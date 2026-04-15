export type ChartPoint = {
  label: string;
  value: number;
};

export type LocalizedTitleItem = {
  language: string;
  title: string;
};

export type AdminLanguageStat = {
  code: string;
  label: string;
  users: number;
  publishedCourses: number;
  publishedCaseStudies: number;
  availableScenarioVariants: number;
};

export type AdminScenarioStat = {
  id: string;
  slug: string;
  title: string;
  area: string;
  languages: string[];
  availableVariants: number;
  totalAttempts: number;
  completedLikeTotal: number;
  completionRate: number;
  averageScore: number | null;
};

export type AdminCourseStat = {
  id: string;
  slug: string;
  title: string;
  area: string;
  difficulty: string;
  totalAttempts: number;
  completed: number;
  inProgress: number;
  failed: number;
  completionRate: number;
  averagePreQuizScore: number | null;
  averagePostQuizScore: number | null;
};

export type BasicAdminStats = {
  generatedAt: string;
  users: {
    total: number;
    learners: number;
    educators: number;
    admins: number;
  };
  content: {
    publishedCourses: number;
    publishedCaseStudies: number;
    publishedScenarios: number;
    availableScenarioVariants: number;
  };
  scenarioAttempts: {
    total: number;
    passed: number;
    completed: number;
    failed: number;
    incomplete: number;
    browsed: number;
    completedLikeTotal: number;
    completionRate: number;
    averageScore: number | null;
  };
  curriculum: {
    totalAttempts: number;
    completed: number;
    inProgress: number;
    failed: number;
    completionRate: number;
    averagePreQuizScore: number | null;
    averagePostQuizScore: number | null;
  };
  eportfolio: {
    totalProgressRecords: number;
    completedCaseStudies: number;
    completionRate: number;
  };
  activity: {
    activeUsersLast24h: number;
    activeUsersLast7Days: number;
    activeUsersLast30Days: number;

    recentScenarioAttempts24h: number;
    recentScenarioAttempts: number;
    recentScenarioAttempts30d: number;

    recentCourseAttempts24h: number;
    recentCourseAttempts: number;
    recentCourseAttempts30d: number;

    recentEportfolioEvents24h: number;
    recentEportfolioEvents: number;
    recentEportfolioEvents30d: number;

    scenarioSeries24h: ChartPoint[];
    scenarioSeries: ChartPoint[];
    scenarioSeries30d: ChartPoint[];

    curriculumSeries24h: ChartPoint[];
    curriculumSeries: ChartPoint[];
    curriculumSeries30d: ChartPoint[];

    eportfolioSeries24h: ChartPoint[];
    eportfolioSeries: ChartPoint[];
    eportfolioSeries30d: ChartPoint[];

    scenarioStats24h: {
      completionRate: number;
      averageScore: number | null;
      completedLikeTotal: number;
      failed: number;
    };
    scenarioStats7d: {
      completionRate: number;
      averageScore: number | null;
      completedLikeTotal: number;
      failed: number;
    };
    scenarioStats30d: {
      completionRate: number;
      averageScore: number | null;
      completedLikeTotal: number;
      failed: number;
    };

    curriculumStats24h: {
      completionRate: number;
      averagePreQuizScore: number | null;
      averagePostQuizScore: number | null;
      inProgress: number;
    };
    curriculumStats7d: {
      completionRate: number;
      averagePreQuizScore: number | null;
      averagePostQuizScore: number | null;
      inProgress: number;
    };
    curriculumStats30d: {
      completionRate: number;
      averagePreQuizScore: number | null;
      averagePostQuizScore: number | null;
      inProgress: number;
    };

    eportfolioStats24h: {
      completionRate: number;
      published: number;
      activeUsers: number;
    };
    eportfolioStats7d: {
      completionRate: number;
      published: number;
      activeUsers: number;
    };
    eportfolioStats30d: {
      completionRate: number;
      published: number;
      activeUsers: number;
    };
  };
  languageBreakdown: AdminLanguageStat[];
  scenarioBreakdown: AdminScenarioStat[];
  courseBreakdown: AdminCourseStat[];

  scenarioAttemptRows: DashboardScenarioAttemptRow[];
  curriculumAttemptRows: DashboardCurriculumAttemptRow[];
  eportfolioProgressRows: DashboardEportfolioProgressRow[];
};

export type DashboardScenarioAttemptRow = {
  id: string;
  learnerName: string;
  learnerEmail: string;
  scenarioTitle: string;
  scenarioSlug: string;
  area: "environmental" | "social" | "governance" | "cross-cutting";
  language: string;
  attemptNumber: number;
  status: "passed" | "completed" | "failed" | "incomplete" | "browsed";
  scoreLabel: string;
  startedAtLabel: string;
  lastOpenedAtLabel: string;
  completedAtLabel: string;
};

export type DashboardCurriculumAttemptRow = {
  id: string;
  learnerName: string;
  learnerEmail: string;
  courseTitle: string;
  courseSlug: string;
  area: "environmental" | "social" | "governance" | "cross-cutting";
  attemptNumber: number;
  status: "completed" | "in_progress" | "failed";
  preQuizScoreLabel: string;
  postQuizScoreLabel: string;
  startedAtLabel: string;
  lastOpenedAtLabel: string;
  completedAtLabel: string;
};

export type DashboardEportfolioProgressRow = {
  id: string;
  learnerName: string;
  learnerEmail: string;
  caseStudyTitle: string;
  caseStudySlug: string;
  language: string;
  isCompleted: boolean;
  startedAtLabel: string;
  lastOpenedAtLabel: string;
  completedAtLabel: string;
};
