import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

/**
 * Mock window.matchMedia.
 *
 * Jest wykorzystywany m.in. przez komponenty responsywne,
 * Framer Motion i obsługę prefers-reduced-motion.
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,

  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,

    addListener: vi.fn(),
    removeListener: vi.fn(),

    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),

    dispatchEvent: vi.fn(),
  })),
});

/**
 * Mock ResizeObserver.
 *
 * Może być potrzebny przez responsywne komponenty,
 * wykresy i elementy reagujące na zmianę rozmiaru.
 */
class ResizeObserverMock {
  observe() {}

  unobserve() {}

  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

/**
 * JSDOM nie implementuje scrollIntoView.
 */
Object.defineProperty(Element.prototype, "scrollIntoView", {
  writable: true,
  value: vi.fn(),
});
