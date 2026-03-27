export type CurriculumArea = "environmental" | "social" | "governance" | "cross-cutting";
export type CurriculumStatus = "not_started" | "in_progress" | "completed" | "failed";
export type CurriculumDifficulty = "Foundation" | "Intermediate";
export type CurriculumStage = "overview" | "pre_quiz" | "lessons" | "post_quiz" | "completed";

export type CurriculumQuizAnswerViewModel = {
  id: string;
  text: string;
  isCorrect: boolean;
  feedbackText: string | null;
};

export type CurriculumQuizQuestionViewModel = {
  id: string;
  prompt: string;
  explanation: string | null;
  answers: CurriculumQuizAnswerViewModel[];
};

export type CurriculumQuizViewModel = {
  id: string;
  type: "pre" | "post";
  title: string;
  description: string | null;
  passingScore: number | null;
  questions: CurriculumQuizQuestionViewModel[];
};

export type CurriculumLessonViewModel = {
  index: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  estimatedMinutes: number;
};

export type CurriculumQuizAttemptViewModel = {
  attemptNumber: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  submittedAt: string;
  flaggedQuestionIds: string[];
};

export type CurriculumProgressViewModel = {
  currentStage: CurriculumStage;
  currentLessonIndex: number;
  completedLessons: number;
  totalLessons: number;
  preQuizAttempts: CurriculumQuizAttemptViewModel[];
  postQuizAttempts: CurriculumQuizAttemptViewModel[];
  preQuizRemainingAttempts: number;
  postQuizRemainingAttempts: number;
  nextActionLabel: string;
  currentLocationLabel: string;
};

export type CurriculumModuleViewModel = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  content?: string;
  area: CurriculumArea;
  status: CurriculumStatus;
  progress: number;
  duration: string;
  durationMinutes: number | null;
  lessons: number;
  quizzes: number;
  lastOpened: string;
  difficulty: CurriculumDifficulty;
  outcomes: string[];
  structure: string[];
  quizItems: CurriculumQuizViewModel[];
  lessonsData: CurriculumLessonViewModel[];
  progressState: CurriculumProgressViewModel;
};
