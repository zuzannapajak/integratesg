-- =============================================================================
-- IntegratESG: Row Level Security
--
-- Browser / Supabase Data API:
--   - anonymous users: no table access
--   - authenticated users: read-only access to published learning content
--   - authenticated users: read-only access to their own private records
--
-- Writes to progress, attempts, answers and feedback remain server-only.
-- Server Actions must derive userId from Supabase Auth and must never accept
-- userId from the browser.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Remove direct Data API privileges
-- -----------------------------------------------------------------------------

REVOKE ALL PRIVILEGES ON TABLE
  public."Profile",
  public."CaseStudy",
  public."CaseStudyTranslation",
  public."UserCaseStudyProgress",
  public."Course",
  public."CourseTranslation",
  public."CourseSection",
  public."CourseSectionTranslation",
  public."Quiz",
  public."QuizTranslation",
  public."Question",
  public."QuestionTranslation",
  public."Answer",
  public."AnswerTranslation",
  public."UserCourseAttempt",
  public."CurriculumPilot",
  public."CurriculumPilotQuestion",
  public."CurriculumPilotQuestionTranslation",
  public."CurriculumPilotSubmission",
  public."CurriculumPilotAnswer",
  public."UserScenarioAttempt",
  public."UserScenarioChallengeCompletion",
  public."UserScenarioChoiceAttempt",
  public."PlatformFeedbackSubmission",
  public."PlatformFeedbackReminder"
FROM PUBLIC, anon, authenticated;

REVOKE ALL PRIVILEGES
ON ALL SEQUENCES IN SCHEMA public
FROM PUBLIC, anon, authenticated;

-- -----------------------------------------------------------------------------
-- 2. Enable RLS on every application table
-- -----------------------------------------------------------------------------

ALTER TABLE public."Profile"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."CaseStudy"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."CaseStudyTranslation"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."UserCaseStudyProgress"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."Course"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."CourseTranslation"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."CourseSection"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."CourseSectionTranslation"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."Quiz"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."QuizTranslation"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."Question"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."QuestionTranslation"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."Answer"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."AnswerTranslation"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."UserCourseAttempt"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."CurriculumPilot"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."CurriculumPilotQuestion"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."CurriculumPilotQuestionTranslation"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."CurriculumPilotSubmission"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."CurriculumPilotAnswer"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."UserScenarioAttempt"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."UserScenarioChallengeCompletion"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."UserScenarioChoiceAttempt"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."PlatformFeedbackSubmission"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public."PlatformFeedbackReminder"
  ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 3. Authenticated read access to published learning content
-- -----------------------------------------------------------------------------

GRANT SELECT ON TABLE
  public."CaseStudy",
  public."CaseStudyTranslation",
  public."Course",
  public."CourseTranslation",
  public."CourseSection",
  public."CourseSectionTranslation",
  public."CurriculumPilotQuestion",
  public."CurriculumPilotQuestionTranslation"
TO authenticated;

-- -----------------------------------------------------------------------------
-- 4. Authenticated read access to private user-owned data
-- -----------------------------------------------------------------------------

GRANT SELECT ON TABLE
  public."Profile",
  public."UserCaseStudyProgress",
  public."UserCourseAttempt",
  public."CurriculumPilot",
  public."CurriculumPilotSubmission",
  public."CurriculumPilotAnswer",
  public."UserScenarioAttempt",
  public."UserScenarioChallengeCompletion",
  public."UserScenarioChoiceAttempt",
  public."PlatformFeedbackSubmission",
  public."PlatformFeedbackReminder"
TO authenticated;

-- =============================================================================
-- PROFILE
-- =============================================================================

DROP POLICY IF EXISTS "profile_select_own"
ON public."Profile";

CREATE POLICY "profile_select_own"
ON public."Profile"
FOR SELECT
TO authenticated
USING (
  "id" = (SELECT auth.uid())::text
);

-- =============================================================================
-- CASE STUDIES: published content
-- =============================================================================

DROP POLICY IF EXISTS "case_study_select_published"
ON public."CaseStudy";

CREATE POLICY "case_study_select_published"
ON public."CaseStudy"
FOR SELECT
TO authenticated
USING (
  "status" = 'published'
);

DROP POLICY IF EXISTS "case_study_translation_select_published"
ON public."CaseStudyTranslation";

CREATE POLICY "case_study_translation_select_published"
ON public."CaseStudyTranslation"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."CaseStudy" AS case_study
    WHERE case_study."id" =
      "CaseStudyTranslation"."caseStudyId"
      AND case_study."status" = 'published'
  )
);

-- =============================================================================
-- CASE STUDY PROGRESS: own rows only
-- =============================================================================

DROP POLICY IF EXISTS "case_study_progress_select_own"
ON public."UserCaseStudyProgress";

CREATE POLICY "case_study_progress_select_own"
ON public."UserCaseStudyProgress"
FOR SELECT
TO authenticated
USING (
  "userId" = (SELECT auth.uid())::text
);

-- =============================================================================
-- CURRICULUM CONTENT: published courses only
-- =============================================================================

DROP POLICY IF EXISTS "course_select_published"
ON public."Course";

CREATE POLICY "course_select_published"
ON public."Course"
FOR SELECT
TO authenticated
USING (
  "status" = 'published'
);

DROP POLICY IF EXISTS "course_translation_select_published"
ON public."CourseTranslation";

CREATE POLICY "course_translation_select_published"
ON public."CourseTranslation"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."Course" AS course
    WHERE course."id" =
      "CourseTranslation"."courseId"
      AND course."status" = 'published'
  )
);

DROP POLICY IF EXISTS "course_section_select_published"
ON public."CourseSection";

CREATE POLICY "course_section_select_published"
ON public."CourseSection"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."Course" AS course
    WHERE course."id" =
      "CourseSection"."courseId"
      AND course."status" = 'published'
  )
);

DROP POLICY IF EXISTS "course_section_translation_select_published"
ON public."CourseSectionTranslation";

CREATE POLICY "course_section_translation_select_published"
ON public."CourseSectionTranslation"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."CourseSection" AS course_section
    INNER JOIN public."Course" AS course
      ON course."id" = course_section."courseId"
    WHERE course_section."id" =
      "CourseSectionTranslation"."courseSectionId"
      AND course."status" = 'published'
  )
);

-- =============================================================================
-- COURSE ATTEMPTS: own rows only
-- =============================================================================

DROP POLICY IF EXISTS "course_attempt_select_own"
ON public."UserCourseAttempt";

CREATE POLICY "course_attempt_select_own"
ON public."UserCourseAttempt"
FOR SELECT
TO authenticated
USING (
  "userId" = (SELECT auth.uid())::text
);

-- =============================================================================
-- PILOT QUESTIONS: active content only
-- =============================================================================

DROP POLICY IF EXISTS "pilot_question_select_active"
ON public."CurriculumPilotQuestion";

CREATE POLICY "pilot_question_select_active"
ON public."CurriculumPilotQuestion"
FOR SELECT
TO authenticated
USING (
  "isActive" = true
);

DROP POLICY IF EXISTS "pilot_question_translation_select_active"
ON public."CurriculumPilotQuestionTranslation";

CREATE POLICY "pilot_question_translation_select_active"
ON public."CurriculumPilotQuestionTranslation"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."CurriculumPilotQuestion" AS question
    WHERE question."id" =
      "CurriculumPilotQuestionTranslation"."questionId"
      AND question."isActive" = true
  )
);

-- =============================================================================
-- CURRICULUM PILOT: own rows only
-- =============================================================================

DROP POLICY IF EXISTS "curriculum_pilot_select_own"
ON public."CurriculumPilot";

CREATE POLICY "curriculum_pilot_select_own"
ON public."CurriculumPilot"
FOR SELECT
TO authenticated
USING (
  "userId" = (SELECT auth.uid())::text
);

DROP POLICY IF EXISTS "curriculum_pilot_submission_select_own"
ON public."CurriculumPilotSubmission";

CREATE POLICY "curriculum_pilot_submission_select_own"
ON public."CurriculumPilotSubmission"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."CurriculumPilot" AS pilot
    WHERE pilot."id" =
      "CurriculumPilotSubmission"."pilotId"
      AND pilot."userId" =
        (SELECT auth.uid())::text
  )
);

DROP POLICY IF EXISTS "curriculum_pilot_answer_select_own"
ON public."CurriculumPilotAnswer";

CREATE POLICY "curriculum_pilot_answer_select_own"
ON public."CurriculumPilotAnswer"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."CurriculumPilotSubmission" AS submission
    INNER JOIN public."CurriculumPilot" AS pilot
      ON pilot."id" = submission."pilotId"
    WHERE submission."id" =
      "CurriculumPilotAnswer"."submissionId"
      AND pilot."userId" =
        (SELECT auth.uid())::text
  )
);

-- =============================================================================
-- SCENARIO ATTEMPTS: own rows only
-- =============================================================================

DROP POLICY IF EXISTS "scenario_attempt_select_own"
ON public."UserScenarioAttempt";

CREATE POLICY "scenario_attempt_select_own"
ON public."UserScenarioAttempt"
FOR SELECT
TO authenticated
USING (
  "userId" = (SELECT auth.uid())::text
);

DROP POLICY IF EXISTS "scenario_challenge_completion_select_own"
ON public."UserScenarioChallengeCompletion";

CREATE POLICY "scenario_challenge_completion_select_own"
ON public."UserScenarioChallengeCompletion"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."UserScenarioAttempt" AS attempt
    WHERE attempt."id" =
      "UserScenarioChallengeCompletion"."attemptId"
      AND attempt."userId" =
        (SELECT auth.uid())::text
  )
);

DROP POLICY IF EXISTS "scenario_choice_attempt_select_own"
ON public."UserScenarioChoiceAttempt";

CREATE POLICY "scenario_choice_attempt_select_own"
ON public."UserScenarioChoiceAttempt"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public."UserScenarioAttempt" AS attempt
    WHERE attempt."id" =
      "UserScenarioChoiceAttempt"."attemptId"
      AND attempt."userId" =
        (SELECT auth.uid())::text
  )
);

-- =============================================================================
-- PLATFORM FEEDBACK: own rows only
-- =============================================================================

DROP POLICY IF EXISTS "platform_feedback_submission_select_own"
ON public."PlatformFeedbackSubmission";

CREATE POLICY "platform_feedback_submission_select_own"
ON public."PlatformFeedbackSubmission"
FOR SELECT
TO authenticated
USING (
  "userId" = (SELECT auth.uid())::text
);

DROP POLICY IF EXISTS "platform_feedback_reminder_select_own"
ON public."PlatformFeedbackReminder";

CREATE POLICY "platform_feedback_reminder_select_own"
ON public."PlatformFeedbackReminder"
FOR SELECT
TO authenticated
USING (
  "userId" = (SELECT auth.uid())::text
);
