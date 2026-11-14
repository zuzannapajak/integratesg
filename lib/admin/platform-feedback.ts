import {
  GENERAL_FEEDBACK_SURVEY_TYPE,
  isGeneralFeedbackCategory,
  type GeneralFeedbackCategory,
} from "@/lib/platform-feedback/general-definition";
import { prisma } from "@/lib/prisma";
import { WP3_PLATFORM_SURVEY_TYPE } from "@/lib/platform-feedback/wp3-eligibility";

export type GeneralFeedbackAdminRecord = {
  id: string;
  userName: string;
  userEmail: string;
  category: GeneralFeedbackCategory;
  message: string;
  locale: string;
  role: string;
  submittedAt: string;
};

export type PlatformFeedbackAdminStats = {
  generalFeedback: {
    totalSubmissions: number;
    rows: GeneralFeedbackAdminRecord[];
  };
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
    surveyType: string;
    surveyVersion: number | null;
    pilotCohortCode: string | null;
    countryCode: string | null;
    locale: string | null;
    modulesCompleted: number | null;
  }>;
};

function average(values: number[]) {
  if (values.length === 0) return null;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function getUserName(user: { fullName: string | null; email: string }) {
  const fullName = user.fullName?.trim();
  if (fullName && fullName.length > 0) return fullName;
  return user.email;
}

function jsonRecord(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid platform survey data");
  }
  return value as Record<string, unknown>;
}

function rating(record: Record<string, unknown>, key: string) {
  const value = record[key];
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error(`Invalid platform survey rating: ${key}`);
  }
  return value;
}

function optionalText(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value : null;
}

export async function getPlatformFeedbackAdminStats(): Promise<PlatformFeedbackAdminStats> {
  const [legacy, structured, general, generalTotal] = await Promise.all([
    prisma.platformFeedbackSubmission.findMany({
      include: { user: { select: { email: true, fullName: true } } },
    }),
    prisma.surveySubmission.findMany({
      where: { surveyType: WP3_PLATFORM_SURVEY_TYPE },
      include: { user: { select: { email: true, fullName: true } } },
    }),
    prisma.surveySubmission.findMany({
      where: { surveyType: GENERAL_FEEDBACK_SURVEY_TYPE },
      include: { user: { select: { email: true, fullName: true } } },
      orderBy: { submittedAt: "desc" },
      take: 100,
    }),
    prisma.surveySubmission.count({ where: { surveyType: GENERAL_FEEDBACK_SURVEY_TYPE } }),
  ]);

  const rows: PlatformFeedbackAdminStats["rows"] = [
    ...legacy.map((item) => ({
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
      surveyType: "legacy_unclassified",
      surveyVersion: null,
      pilotCohortCode: null,
      countryCode: null,
      locale: null,
      modulesCompleted: null,
    })),
    ...structured.map((item) => {
      const answers = jsonRecord(item.answers);
      const activity = jsonRecord(item.activitySnapshot);
      return {
        id: item.id,
        userEmail: item.user.email,
        userName: getUserName(item.user),
        easeOfUse: rating(answers, "easeOfUse"),
        moduleClarity: rating(answers, "moduleClarity"),
        navigation: rating(answers, "navigation"),
        testsExperience: rating(answers, "testsExperience"),
        technicalProblems: rating(answers, "technicalProblems"),
        overallSatisfaction: rating(answers, "overallSatisfaction"),
        suggestions: optionalText(answers, "suggestions"),
        technicalNotes: optionalText(answers, "technicalNotes"),
        createdAt: item.submittedAt.toISOString(),
        surveyType: item.surveyType,
        surveyVersion: item.surveyVersion,
        pilotCohortCode: item.pilotCohortCode,
        countryCode: item.countryCode,
        locale: item.locale,
        modulesCompleted:
          typeof activity.modulesCompleted === "number" ? activity.modulesCompleted : null,
      };
    }),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const generalRows: GeneralFeedbackAdminRecord[] = general.map((item) => {
    const answers = jsonRecord(item.answers);
    const category = answers.category;
    const message = answers.message;
    return {
      id: item.id,
      userEmail: item.user.email,
      userName: getUserName(item.user),
      category: isGeneralFeedbackCategory(category) ? category : "other",
      message: typeof message === "string" ? message : "",
      locale: item.locale,
      role: item.roleAtSubmission,
      submittedAt: item.submittedAt.toISOString(),
    };
  });

  return {
    generalFeedback: { totalSubmissions: generalTotal, rows: generalRows },
    summary: {
      totalSubmissions: rows.length,
      averageEaseOfUse: average(rows.map((item) => item.easeOfUse)),
      averageModuleClarity: average(rows.map((item) => item.moduleClarity)),
      averageNavigation: average(rows.map((item) => item.navigation)),
      averageTestsExperience: average(rows.map((item) => item.testsExperience)),
      averageTechnicalProblems: average(rows.map((item) => item.technicalProblems)),
      averageOverallSatisfaction: average(rows.map((item) => item.overallSatisfaction)),
    },
    rows,
  };
}
