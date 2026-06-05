import { prisma } from "@/lib/prisma";

export type PlatformFeedbackAdminStats = {
  summary: {
    totalSubmissions: number;
    averageEaseOfUse: number | null;
    averageModuleClarity: number | null;
    averageNavigation: number | null;
    averageTestsExperience: number | null;
    averageTechnicalProblems: number | null;
    averageOverallSatisfaction: number | null;
  };
  rows: Array<{
    id: string;
    userEmail: string;
    userName: string;
    easeOfUse: number;
    moduleClarity: number;
    navigation: number;
    testsExperience: number;
    technicalProblems: number;
    overallSatisfaction: number;
    suggestions: string | null;
    technicalNotes: string | null;
    createdAt: string;
  }>;
};

function average(values: number[]) {
  if (values.length === 0) return null;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function getUserName(user: { fullName: string | null; email: string }) {
  const fullName = user.fullName?.trim();

  if (typeof fullName === "string" && fullName.length > 0) {
    return fullName;
  }

  return user.email;
}

export async function getPlatformFeedbackAdminStats(): Promise<PlatformFeedbackAdminStats> {
  const submissions = await prisma.platformFeedbackSubmission.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          email: true,
          fullName: true,
        },
      },
    },
  });

  return {
    summary: {
      totalSubmissions: submissions.length,
      averageEaseOfUse: average(submissions.map((item) => item.easeOfUse)),
      averageModuleClarity: average(submissions.map((item) => item.moduleClarity)),
      averageNavigation: average(submissions.map((item) => item.navigation)),
      averageTestsExperience: average(submissions.map((item) => item.testsExperience)),
      averageTechnicalProblems: average(submissions.map((item) => item.technicalProblems)),
      averageOverallSatisfaction: average(submissions.map((item) => item.overallSatisfaction)),
    },
    rows: submissions.map((item) => ({
      id: item.id,
      userEmail: item.user.email,
      userName: getUserName(item.user),
      easeOfUse: item.easeOfUse,
      moduleClarity: item.moduleClarity,
      navigation: item.navigation,
      testsExperience: item.testsExperience,
      technicalProblems: item.technicalProblems,
      overallSatisfaction: item.overallSatisfaction,
      suggestions: item.suggestions,
      technicalNotes: item.technicalNotes,
      createdAt: item.createdAt.toISOString(),
    })),
  };
}
