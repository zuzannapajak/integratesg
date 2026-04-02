export type CurriculumArea = "environmental" | "social" | "governance" | "cross-cutting";
export type CurriculumStatus = "not_started" | "in_progress" | "completed" | "failed";
export type CurriculumDifficulty = "foundation" | "intermediate";
export type CurriculumStage = "overview" | "pre_quiz" | "lessons" | "post_quiz" | "completed";

export type CurriculumTextToken = {
  key: string;
  values?: Record<string, string | number>;
};

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
  title: string | null;
  description: string | null;
  passingScore: number | null;
  questions: CurriculumQuizQuestionViewModel[];
};

export type CurriculumLessonViewModel = {
  index: number;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
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
  nextAction: CurriculumTextToken;
  currentLocation: CurriculumTextToken;
};

export type CurriculumModuleViewModel = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  content?: string | null;
  area: CurriculumArea;
  status: CurriculumStatus;
  progress: number;
  durationMinutes: number | null;
  lessons: number;
  quizzes: number;
  lastOpenedAt: string | null;
  difficulty: CurriculumDifficulty;
  outcomes: CurriculumTextToken[];
  structure: CurriculumTextToken[];
  quizItems: CurriculumQuizViewModel[];
  lessonsData: CurriculumLessonViewModel[];
  progressState: CurriculumProgressViewModel;
};

export type TranslationRecord = {
  language: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  content: string | null;
};

type CourseSectionTranslationRecord = {
  language: string;
  title: string;
  summary: string | null;
  content: string;
};

export type CourseSectionRecord = {
  id: string;
  slug: string;
  sortOrder: number;
  estimatedMinutes: number | null;
  translations: CourseSectionTranslationRecord[];
};

type QuizTranslationRecord = {
  language: string;
  title: string | null;
  description: string | null;
};

type QuestionTranslationRecord = {
  language: string;
  prompt: string;
  explanation: string | null;
};

type AnswerTranslationRecord = {
  language: string;
  text: string;
  feedbackText: string | null;
};

export type StoredQuizAttempt = {
  attemptNumber: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  submittedAt: string;
  flaggedQuestionIds?: string[];
  selectedAnswers?: Array<{
    questionId: string;
    answerId: string;
    isCorrect: boolean;
  }>;
};

type CourseAttemptRecord = {
  status: string;
  progressPercent: number;
  lastOpenedAt: Date | null;
  currentStage: string;
  currentLessonIndex: number;
  completedLessons: number;
  preQuizAttempts: unknown;
  postQuizAttempts: unknown;
};

type QuizRecord = {
  id: string;
  type: string;
  title: string | null;
  description: string | null;
  passingScore: number | null;
  sortOrder: number;
  translations: QuizTranslationRecord[];
  questions: Array<{
    id: string;
    prompt: string;
    explanation: string | null;
    sortOrder: number;
    translations: QuestionTranslationRecord[];
    answers: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
      feedbackText: string | null;
      sortOrder: number;
      translations: AnswerTranslationRecord[];
    }>;
  }>;
};

export type CourseMappedInput = {
  slug: string;
  area: string;
  difficulty: string;
  estimatedDurationMinutes: number | null;
  lessonsCount: number;
  translations: TranslationRecord[];
  sections?: CourseSectionRecord[];
  _count: { quizzes: number };
  userCourseAttempts: CourseAttemptRecord[];
  quizzes?: QuizRecord[];
};
