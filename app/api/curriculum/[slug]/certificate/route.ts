import { APP_ROLES } from "@/lib/auth/roles";
import { buildCurriculumCertificatePdf } from "@/lib/curriculum/certificate-pdf";
import { logMeasuredOperation } from "@/lib/observability/performance";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

function pickEnglishTitle(
  translations: Array<{
    language: string;
    title: string;
  }>,
  slug: string,
) {
  return translations.find((translation) => translation.language === "en")?.title ?? slug;
}

function humanizeFallbackName(email: string) {
  const localPart = email.split("@")[0] ?? "Learner";

  return (
    localPart
      .replace(/[._-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Learner"
  );
}

function buildCertificateId(slug: string, attemptId: string) {
  const slugToken =
    slug
      .replace(/[^a-z0-9]+/gi, "")
      .toUpperCase()
      .slice(0, 8) || "MODULE";

  const attemptToken =
    attemptId
      .replace(/[^a-z0-9]+/gi, "")
      .toUpperCase()
      .slice(-8) || "00000000";

  return `${slugToken}-${attemptToken}`;
}

function buildDownloadFileName(slug: string) {
  const normalizedSlug = slug
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
  return `integratesg-certificate-${normalizedSlug || "curriculum"}.pdf`;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const startedAt = Date.now();
  let records = 0;
  let status: "ok" | "error" = "ok";
  let slugForLog = "";

  try {
    const { slug } = await params;
    slugForLog = slug;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      status = "error";
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        role: true,
        fullName: true,
        email: true,
      },
    });

    if (!profile || (profile.role !== APP_ROLES.learner && profile.role !== APP_ROLES.educator)) {
      status = "error";
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const course = await prisma.course.findFirst({
      where: {
        slug,
        status: "published",
      },
      select: {
        slug: true,
        estimatedDurationMinutes: true,
        translations: {
          where: {
            language: {
              in: ["en"],
            },
          },
          select: {
            language: true,
            title: true,
          },
        },
        quizzes: {
          where: {
            type: "post",
          },
          select: {
            passingScore: true,
          },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          take: 1,
        },
        userCourseAttempts: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
            status: true,
            currentStage: true,
            postQuizScore: true,
            completedAt: true,
          },
          orderBy: [{ completedAt: "desc" }, { updatedAt: "desc" }],
          take: 1,
        },
      },
    });

    if (!course) {
      status = "error";
      return NextResponse.json({ ok: false, error: "Course not found" }, { status: 404 });
    }

    const attempt = course.userCourseAttempts.at(0) ?? null;
    const passingScore = course.quizzes.at(0)?.passingScore ?? null;
    const hasPassedPostQuiz =
      passingScore === null ||
      passingScore <= 0 ||
      (typeof attempt?.postQuizScore === "number" && attempt.postQuizScore >= passingScore);

    if (
      attempt?.status !== "completed" ||
      attempt.currentStage !== "completed" ||
      !attempt.completedAt ||
      !hasPassedPostQuiz
    ) {
      status = "error";
      return NextResponse.json(
        {
          ok: false,
          error: "Certificate is not available for this module yet.",
        },
        { status: 403 },
      );
    }

    const learnerName = profile.fullName?.trim()
      ? profile.fullName.trim()
      : humanizeFallbackName(profile.email);
    const moduleTitle = pickEnglishTitle(course.translations, course.slug);
    const certificateId = buildCertificateId(course.slug, attempt.id);

    const pdfBuffer = await buildCurriculumCertificatePdf({
      learnerName,
      moduleTitle,
      issuedAt: attempt.completedAt,
      durationMinutes: course.estimatedDurationMinutes,
      certificateId,
    });

    const pdfBytes = pdfBuffer instanceof Uint8Array ? pdfBuffer : Uint8Array.from(pdfBuffer);
    const body = new ArrayBuffer(pdfBytes.byteLength);
    new Uint8Array(body).set(pdfBytes);

    records = 1;

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${buildDownloadFileName(slug)}"`,
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch (error) {
    status = "error";
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to generate certificate.",
      },
      { status: 500 },
    );
  } finally {
    logMeasuredOperation({
      operation: "api.curriculum.certificate.GET",
      durationMs: Date.now() - startedAt,
      records,
      status,
      meta: {
        path: "/api/curriculum/[slug]/certificate",
        slug: slugForLog,
      },
    });
  }
}
