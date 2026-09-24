import { afterEach, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import {
  cleanupDatabaseFixtures,
  createCaseStudy,
  createCourse,
  createProfile,
  createScenarioAttempt,
  markCaseStudyDeleted,
  markCourseDeleted,
  markProfileDeleted,
  trackPilotQuestion,
  unique,
} from "./fixtures";

afterEach(cleanupDatabaseFixtures);

describe("database referential actions", () => {
  it("cascades course deletion through content and curriculum progress", async () => {
    const profile = await createProfile();
    const course = await createCourse();

    const courseTranslation = await prisma.courseTranslation.findFirstOrThrow({
      where: {
        courseId: course.id,
        language: "en",
      },
    });

    const section = await prisma.courseSection.create({
      data: {
        courseId: course.id,
        slug: "section-1",
        sortOrder: 1,
        translations: {
          create: {
            language: "en",
            title: "Section 1",
            content: "Section content",
          },
        },
      },
      include: {
        translations: true,
      },
    });

    const quiz = await prisma.quiz.create({
      data: {
        courseId: course.id,
        type: "post",
        sortOrder: 1,
        questions: {
          create: {
            prompt: "Question?",
            sortOrder: 1,
            answers: {
              create: {
                text: "Answer",
                isCorrect: true,
                sortOrder: 1,
              },
            },
          },
        },
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    await prisma.userCourseAttempt.create({
      data: {
        userId: profile.id,
        courseId: course.id,
        status: "in_progress",
      },
    });

    const sectionTranslation = section.translations.at(0);
    const question = quiz.questions.at(0);
    const answer = question?.answers.at(0);

    if (!sectionTranslation || !question || !answer) {
      throw new Error("Course cascade fixture is incomplete.");
    }

    await prisma.course.delete({
      where: {
        id: course.id,
      },
    });

    markCourseDeleted(course.id);

    await expect(
      prisma.courseTranslation.count({
        where: {
          id: courseTranslation.id,
        },
      }),
    ).resolves.toBe(0);

    await expect(
      prisma.courseSection.count({
        where: {
          id: section.id,
        },
      }),
    ).resolves.toBe(0);

    await expect(
      prisma.courseSectionTranslation.count({
        where: {
          id: sectionTranslation.id,
        },
      }),
    ).resolves.toBe(0);

    await expect(
      prisma.quiz.count({
        where: {
          id: quiz.id,
        },
      }),
    ).resolves.toBe(0);

    await expect(
      prisma.question.count({
        where: {
          id: question.id,
        },
      }),
    ).resolves.toBe(0);

    await expect(
      prisma.answer.count({
        where: {
          id: answer.id,
        },
      }),
    ).resolves.toBe(0);

    await expect(
      prisma.userCourseAttempt.count({
        where: {
          userId: profile.id,
          courseId: course.id,
        },
      }),
    ).resolves.toBe(0);
  });

  it("cascades case-study deletion to translations and ePortfolio progress", async () => {
    const profile = await createProfile();
    const caseStudy = await createCaseStudy();

    const translation = await prisma.caseStudyTranslation.findFirstOrThrow({
      where: {
        caseStudyId: caseStudy.id,
        language: "en",
      },
    });

    await prisma.userCaseStudyProgress.create({
      data: {
        userId: profile.id,
        caseStudyId: caseStudy.id,
        status: "in_progress",
      },
    });

    await prisma.caseStudy.delete({
      where: {
        id: caseStudy.id,
      },
    });

    markCaseStudyDeleted(caseStudy.id);

    await expect(
      prisma.caseStudyTranslation.count({
        where: {
          id: translation.id,
        },
      }),
    ).resolves.toBe(0);

    await expect(
      prisma.userCaseStudyProgress.count({
        where: {
          userId: profile.id,
          caseStudyId: caseStudy.id,
        },
      }),
    ).resolves.toBe(0);
  });

  it("cascades profile deletion to curriculum, ePortfolio and scenario progress", async () => {
    const profile = await createProfile();
    const course = await createCourse();
    const caseStudy = await createCaseStudy();

    await prisma.userCourseAttempt.create({
      data: {
        userId: profile.id,
        courseId: course.id,
      },
    });

    await prisma.userCaseStudyProgress.create({
      data: {
        userId: profile.id,
        caseStudyId: caseStudy.id,
      },
    });

    const scenarioAttempt = await createScenarioAttempt(profile.id);

    await prisma.userScenarioChallengeCompletion.create({
      data: {
        attemptId: scenarioAttempt.id,
        challengeId: "challenge-1",
      },
    });

    await prisma.userScenarioChoiceAttempt.create({
      data: {
        attemptId: scenarioAttempt.id,
        challengeId: "challenge-1",
        choiceId: "choice-1",
        attemptNumber: 1,
        isOptimal: true,
      },
    });

    await prisma.profile.delete({
      where: {
        id: profile.id,
      },
    });

    markProfileDeleted(profile.id);

    await expect(
      prisma.userCourseAttempt.count({
        where: {
          userId: profile.id,
        },
      }),
    ).resolves.toBe(0);

    await expect(
      prisma.userCaseStudyProgress.count({
        where: {
          userId: profile.id,
        },
      }),
    ).resolves.toBe(0);

    await expect(
      prisma.userScenarioAttempt.count({
        where: {
          userId: profile.id,
        },
      }),
    ).resolves.toBe(0);

    await expect(
      prisma.userScenarioChallengeCompletion.count({
        where: {
          attemptId: scenarioAttempt.id,
        },
      }),
    ).resolves.toBe(0);

    await expect(
      prisma.userScenarioChoiceAttempt.count({
        where: {
          attemptId: scenarioAttempt.id,
        },
      }),
    ).resolves.toBe(0);
  });

  it("restricts deletion of a curriculum-pilot question referenced by an answer", async () => {
    const profile = await createProfile("educator");

    const pilot = await prisma.curriculumPilot.create({
      data: {
        userId: profile.id,
      },
    });

    const question = await prisma.curriculumPilotQuestion.create({
      data: {
        key: unique("pilot-question"),
        sortOrder: 999,
        inputType: "likert",
        minValue: 1,
        maxValue: 5,
      },
    });

    trackPilotQuestion(question.id);

    const submission = await prisma.curriculumPilotSubmission.create({
      data: {
        pilotId: pilot.id,
        type: "pre",
      },
    });

    await prisma.curriculumPilotAnswer.create({
      data: {
        submissionId: submission.id,
        questionId: question.id,
        valueInt: 3,
      },
    });

    await expect(
      prisma.curriculumPilotQuestion.delete({
        where: {
          id: question.id,
        },
      }),
    ).rejects.toMatchObject({
      code: "P2003",
    });
  });
});
