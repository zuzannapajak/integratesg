import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";

import {
  disconnectScenarioTestDatabase,
  getScenarioTestCredentials,
  resetScenarioTestProgress,
} from "./scenario-test-database";

const scenarioPath = "/en/scenarios/scenario-02/play";

const MAX_OPTIMIZED_IMAGE_BYTES = 1024 * 1024;

const MAX_INTERACTION_SETTLE_MS = 1500;

const PERFORMANCE_SAMPLE_MS = 900;

const MIN_PERFORMANCE_SAMPLES = 8;

const MIN_SAMPLE_COVERAGE_RATIO = 0.8;

const MAX_AVERAGE_FRAME_GAP_MS = 70;

const MAX_P95_FRAME_GAP_MS = 100;

const MAX_FRAME_GAP_MS = 120;

const MAX_LONG_TASK_MS = 180;

const challengeIds = {
  priorities: "scenario-02-challenge-01",
} as const;

type ScenarioPerformanceProbe = {
  readonly frameGaps: number[];
  readonly longTasks: number[];
  done: boolean;
};

type ScenarioPerformanceWindow = Window &
  typeof globalThis & {
    __scenarioPerformanceProbe?: ScenarioPerformanceProbe;
  };

async function signIn(page: Page): Promise<void> {
  const { email, password } = getScenarioTestCredentials();

  await page.goto("/en/auth/login");

  await page.getByLabel("Email address").fill(email);

  await page.getByLabel("Password").fill(password);

  await Promise.all([
    page.waitForURL(/\/en\/dashboard(?:\?.*)?$/),

    page
      .getByRole("button", {
        name: "Login",
      })
      .click(),
  ]);
}

async function openScenarioPlayer(page: Page): Promise<void> {
  const response = await page.goto(scenarioPath, {
    waitUntil: "domcontentloaded",
  });

  if (!response) {
    throw new Error("The scenario route did not return an HTTP response.");
  }

  const status = response.status();

  expect(status, `The scenario route returned HTTP ${status}.`).toBeLessThan(400);

  await expect(page.getByTestId("scenario-player")).toBeVisible();
}

async function readOptimizedImage(page: Page, image: Locator, name: string) {
  await expect(image).toBeVisible();

  const details = await image.evaluate(async (element) => {
    const htmlImage = element as HTMLImageElement;

    if (!htmlImage.complete) {
      await new Promise<void>((resolve, reject) => {
        htmlImage.addEventListener(
          "load",
          () => {
            resolve();
          },
          {
            once: true,
          },
        );

        htmlImage.addEventListener(
          "error",
          () => {
            reject(new Error("Image failed to load."));
          },
          {
            once: true,
          },
        );
      });
    }

    await htmlImage.decode().catch(() => undefined);

    const rectangle = htmlImage.getBoundingClientRect();

    return {
      currentSrc: htmlImage.currentSrc,

      naturalWidth: htmlImage.naturalWidth,

      naturalHeight: htmlImage.naturalHeight,

      renderedWidth: rectangle.width,

      renderedHeight: rectangle.height,
    };
  });

  expect(details.currentSrc).toContain("/_next/image?");

  expect(details.naturalWidth).toBeGreaterThan(0);

  expect(details.naturalHeight).toBeGreaterThan(0);

  expect(details.renderedWidth).toBeGreaterThan(0);

  expect(details.renderedHeight).toBeGreaterThan(0);

  const response = await page.request.get(details.currentSrc, {
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    },
  });

  expect(response.ok()).toBe(true);

  const body = await response.body();

  const contentType = response.headers()["content-type"] ?? "";

  expect(contentType).toMatch(/^image\/(avif|webp)/);

  expect(body.byteLength).toBeLessThanOrEqual(MAX_OPTIMIZED_IMAGE_BYTES);

  return {
    name,
    ...details,
    contentType,
    transferredBytes: body.byteLength,
  };
}

async function startPerformanceProbe(page: Page): Promise<void> {
  await page.evaluate((sampleDurationMs) => {
    const performanceWindow = window as ScenarioPerformanceWindow;

    const probe: ScenarioPerformanceProbe = {
      frameGaps: [],
      longTasks: [],
      done: false,
    };

    performanceWindow.__scenarioPerformanceProbe = probe;

    const startedAt = performance.now();

    let previousFrame = startedAt;

    let observer: PerformanceObserver | null = null;

    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          probe.longTasks.push(entry.duration);
        }
      });

      observer.observe({
        type: "longtask",
        buffered: false,
      });
    } catch {
      observer = null;
    }

    function sampleFrame(timestamp: number) {
      probe.frameGaps.push(timestamp - previousFrame);

      previousFrame = timestamp;

      if (timestamp - startedAt < sampleDurationMs) {
        window.requestAnimationFrame(sampleFrame);

        return;
      }

      observer?.disconnect();

      probe.done = true;
    }

    window.requestAnimationFrame(sampleFrame);
  }, PERFORMANCE_SAMPLE_MS);
}

async function finishPerformanceProbe(page: Page) {
  return page.evaluate(async () => {
    const performanceWindow = window as ScenarioPerformanceWindow;

    const deadline = performance.now() + 3000;

    let probe = performanceWindow.__scenarioPerformanceProbe;

    while (!probe?.done) {
      if (performance.now() > deadline) {
        throw new Error("The scenario performance probe did not finish.");
      }

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 25);
      });

      probe = performanceWindow.__scenarioPerformanceProbe;
    }

    const sortedFrameGaps = [...probe.frameGaps].sort((first, second) => first - second);

    const sampledDurationMs = probe.frameGaps.reduce((sum, gap) => sum + gap, 0);

    const p95Index =
      sortedFrameGaps.length > 0
        ? Math.min(
            sortedFrameGaps.length - 1,

            Math.max(0, Math.ceil(sortedFrameGaps.length * 0.95) - 1),
          )
        : 0;

    const p95FrameGapMs = sortedFrameGaps[p95Index] ?? 0;

    return {
      sampledFrames: probe.frameGaps.length,

      sampledDurationMs,

      maxFrameGapMs: Math.max(...probe.frameGaps, 0),

      p95FrameGapMs,

      averageFrameGapMs: sampledDurationMs / Math.max(probe.frameGaps.length, 1),

      longTaskCount: probe.longTasks.length,

      maxLongTaskMs: Math.max(...probe.longTasks, 0),
    };
  });
}

async function measureInteraction(
  page: Page,
  action: () => Promise<void>,
  completed: () => Promise<void>,
) {
  await startPerformanceProbe(page);

  const startedAt = Date.now();

  await action();
  await completed();

  const settleMs = Date.now() - startedAt;

  const probe = await finishPerformanceProbe(page);

  expect(settleMs).toBeLessThanOrEqual(MAX_INTERACTION_SETTLE_MS);

  /*
   * Liczba requestAnimationFrame zależy od obciążenia
   * trybu developerskiego. Wymagamy wystarczającej
   * próbki, ale nie zakładamy stałego FPS.
   */
  expect(probe.sampledFrames).toBeGreaterThanOrEqual(MIN_PERFORMANCE_SAMPLES);

  expect(probe.sampledDurationMs).toBeGreaterThanOrEqual(
    PERFORMANCE_SAMPLE_MS * MIN_SAMPLE_COVERAGE_RATIO,
  );

  expect(probe.averageFrameGapMs).toBeLessThanOrEqual(MAX_AVERAGE_FRAME_GAP_MS);

  expect(probe.p95FrameGapMs).toBeLessThanOrEqual(MAX_P95_FRAME_GAP_MS);

  expect(probe.maxFrameGapMs).toBeLessThanOrEqual(MAX_FRAME_GAP_MS);

  expect(probe.maxLongTaskMs).toBeLessThanOrEqual(MAX_LONG_TASK_MS);

  return {
    settleMs,
    ...probe,
  };
}

async function attachMetrics(testInfo: TestInfo, name: string, metrics: unknown): Promise<void> {
  await testInfo.attach(`${name}.json`, {
    body: JSON.stringify(metrics, null, 2),

    contentType: "application/json",
  });
}

test.describe("Scenario illustration and animation performance", () => {
  test.describe.configure({
    mode: "serial",
  });

  test.beforeEach(async () => {
    await resetScenarioTestProgress();
  });

  test.afterAll(async () => {
    await resetScenarioTestProgress();

    await disconnectScenarioTestDatabase();
  });

  test("serves optimized pathway and simulator illustrations within the transfer budget", async ({
    page,
  }, testInfo) => {
    test.setTimeout(120_000);

    await page.setViewportSize({
      width: 1440,
      height: 900,
    });

    await signIn(page);

    await page.goto("/en/scenarios");

    const pathwayImage = page.getByTestId("scenario-pathway-map").locator("img:visible").first();

    const pathwayMetrics = await readOptimizedImage(page, pathwayImage, "pathway");

    await openScenarioPlayer(page);

    const player = page.getByTestId("scenario-player");

    const introMetrics = await readOptimizedImage(
      page,
      player.locator("img:visible").first(),
      "scenario-intro",
    );

    await page
      .getByRole("button", {
        name: "Continue",
        exact: true,
      })
      .click();

    await page
      .getByRole("button", {
        name: "Start scenario",
      })
      .click();

    await expect(player).toHaveAttribute("data-view", "board");

    const boardMetrics = await readOptimizedImage(
      page,
      player.locator("img:visible").first(),
      "scenario-board",
    );

    await attachMetrics(testInfo, "scenario-image-performance", {
      budgetBytes: MAX_OPTIMIZED_IMAGE_BYTES,

      images: [pathwayMetrics, introMetrics, boardMetrics],
    });
  });

  test("keeps interface animations responsive and disables them for reduced motion", async ({
    page,
  }, testInfo) => {
    test.setTimeout(120_000);

    await page.setViewportSize({
      width: 1440,
      height: 900,
    });

    await page.emulateMedia({
      reducedMotion: "no-preference",
    });

    await signIn(page);

    await openScenarioPlayer(page);

    const continueButton = page.getByRole("button", {
      name: "Continue",
      exact: true,
    });

    const introTransitionMetrics = await measureInteraction(
      page,

      () => continueButton.click(),

      async () => {
        await expect(
          page.getByRole("button", {
            name: "Start scenario",
          }),
        ).toBeVisible();
      },
    );

    await page
      .getByRole("button", {
        name: "Start scenario",
      })
      .click();

    const player = page.getByTestId("scenario-player");

    await expect(player).toHaveAttribute("data-view", "board");

    const previewZone = page.getByTestId(`scenario-board-preview-zone-${challengeIds.priorities}`);

    const previewCard = page.locator(
      `[data-testid="scenario-board-card-${challengeIds.priorities}"]:visible`,
    );

    const hoverMetrics = await measureInteraction(
      page,

      () => previewZone.hover(),

      async () => {
        await expect(previewCard).toBeVisible();

        await expect(previewCard).toHaveCSS("opacity", "1");
      },
    );

    await attachMetrics(testInfo, "scenario-animation-performance", {
      budgets: {
        maxInteractionSettleMs: MAX_INTERACTION_SETTLE_MS,

        minPerformanceSamples: MIN_PERFORMANCE_SAMPLES,

        minSampleCoverageRatio: MIN_SAMPLE_COVERAGE_RATIO,

        maxAverageFrameGapMs: MAX_AVERAGE_FRAME_GAP_MS,

        maxP95FrameGapMs: MAX_P95_FRAME_GAP_MS,

        maxFrameGapMs: MAX_FRAME_GAP_MS,

        maxLongTaskMs: MAX_LONG_TASK_MS,
      },

      introTransition: introTransitionMetrics,

      challengePreview: hoverMetrics,
    });

    await page.mouse.move(0, 0);

    await page.emulateMedia({
      reducedMotion: "reduce",
    });

    await expect
      .poll(() =>
        page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches),
      )
      .toBe(true);

    await expect(player).toHaveAttribute("data-view", "board");

    const pulse = player.locator('[class*="animate-ping"]').first();

    await expect(pulse).toBeVisible();

    await expect
      .poll(() => pulse.evaluate((element) => window.getComputedStyle(element).animationName))
      .toBe("none");

    await expect
      .poll(() =>
        player.evaluate(
          (element) =>
            element
              .getAnimations({
                subtree: true,
              })
              .filter((animation) => animation.playState === "running").length,
        ),
      )
      .toBe(0);
  });
});
