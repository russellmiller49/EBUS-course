import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';

import { finalPostTestAssessment } from '@/content/courseAssessments';
import {
  type CourseSurveyResponses,
  isCourseSurveyComplete as isCourseSurveyResponseComplete,
  postCourseSurveyItems,
} from '@/content/courseSurveys';
import { QuizCard } from '@/features/quiz/QuizCard';
import { CourseSurveyForm } from '@/features/surveys/CourseSurveyForm';
import { useCourseAdminSessionActive, useCourseVendorSessionActive } from '@/lib/adminSession';
import { useAuth } from '@/lib/auth';
import { formatCourseEndAvailability, isCourseEndUnlocked } from '@/lib/courseConfig';
import { useCourseNow } from '@/lib/courseClock';
import {
  getAssessmentWorkflowStatus,
  getCourseAssessmentProgress,
  getLectureModuleProgressSummary,
  isCourseSurveyComplete,
} from '@/lib/courseWorkflow';
import type { QuizResult } from '@/lib/quiz';
import { type CourseAssessmentProgress, useLearnerProgress } from '@/lib/progress';

function formatTimestamp(value: string | null | undefined) {
  if (!value) {
    return 'Not completed';
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function getAssessmentScoreLabel(progress: CourseAssessmentProgress | null) {
  if (!finalPostTestAssessment) {
    return 'Unavailable';
  }

  if (!progress?.completedAt) {
    return `${finalPostTestAssessment.questions.length} questions`;
  }

  return `${progress.percent}% saved`;
}

export function PostCoursePage() {
  const {
    recordCourseAssessmentResult,
    recordQuizResult,
    setModuleProgress,
    state,
    submitCourseSurvey,
  } = useLearnerProgress();
  const { profile, user } = useAuth();
  const adminSessionActive = useCourseAdminSessionActive();
  const vendorSessionActive = useCourseVendorSessionActive();
  const previewSessionActive = adminSessionActive || vendorSessionActive;
  const nowMs = useCourseNow();
  const accessOptions = useMemo(
    () => ({ admin: adminSessionActive, nowMs, preview: vendorSessionActive }),
    [adminSessionActive, nowMs, vendorSessionActive],
  );
  const [surveyResponses, setSurveyResponses] = useState<CourseSurveyResponses>({});
  const postTestProgress = finalPostTestAssessment
    ? getCourseAssessmentProgress(state, finalPostTestAssessment.id)
    : null;
  const postTestWorkflow = finalPostTestAssessment
    ? getAssessmentWorkflowStatus(state, finalPostTestAssessment, accessOptions)
    : null;
  const surveyStep = useMemo(
    () => getLectureModuleProgressSummary(state),
    [state],
  );
  const surveyComplete = isCourseSurveyComplete(state);
  const courseEnded = isCourseEndUnlocked(nowMs);
  const surveyUnlocked = previewSessionActive || (courseEnded && Boolean(postTestProgress?.completedAt));
  const completionArtifactsUnlocked = previewSessionActive || surveyComplete;
  const canSubmitSurvey = isCourseSurveyResponseComplete(postCourseSurveyItems, surveyResponses);
  const certificateName = profile?.fullName || user?.email || 'EBUS learner';

  function handleCourseAssessmentComplete(result: QuizResult) {
    if (!finalPostTestAssessment) {
      return;
    }

    const wasComplete = Boolean(state.courseAssessmentResults[finalPostTestAssessment.id]?.completedAt);
    const nextCompletedCount = surveyStep.completedCount + (wasComplete ? 0 : 1);
    const answers = result.items.map((item) => ({
      questionId: item.question.id,
      selectedOptionIds: item.selectedOptionIds,
      correctOptionIds: item.question.correctOptionIds,
      isCorrect: item.isCorrect,
    }));

    recordCourseAssessmentResult({
      assessmentId: finalPostTestAssessment.id,
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      percent: result.percent,
      answers,
    });
    recordQuizResult({
      id: `${finalPostTestAssessment.id}-${Date.now()}`,
      label: finalPostTestAssessment.title,
      moduleId: 'lectures',
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      percent: result.percent,
    });
    setModuleProgress(
      'lectures',
      Math.round((nextCompletedCount / surveyStep.totalCount) * 100),
      nextCompletedCount >= surveyStep.totalCount,
    );
  }

  function handleSurveySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmitSurvey || !surveyUnlocked) {
      return;
    }

    const nextCompletedCount = surveyStep.completedCount + (surveyComplete ? 0 : 1);

    submitCourseSurvey(surveyResponses);
    setModuleProgress(
      'lectures',
      Math.round((nextCompletedCount / surveyStep.totalCount) * 100),
      nextCompletedCount >= surveyStep.totalCount,
    );
  }

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="eyebrow">Post-course survey and test</div>
        <h2>Post-course assessment unlocks after the live course.</h2>
        <p>
          The post-test and post-course survey stay locked until the course end timestamp. Answers remain hidden during
          the test experience for cohort review.
        </p>
        <div className="tag-row">
          <span className="tag">{courseEnded ? 'Course ended' : formatCourseEndAvailability()}</span>
          <span className="tag">Post-test: {getAssessmentScoreLabel(postTestProgress)}</span>
        </div>
      </section>

      <section className={`section-card${postTestWorkflow?.unlocked ? '' : ' section-card--locked'}`}>
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Post-test</div>
            <h2>{postTestProgress?.completedAt ? 'Post-test submitted' : 'Post-test'}</h2>
            <p>
              {postTestWorkflow?.unlocked
                ? 'Submit the post-test before the post-course survey.'
                : postTestWorkflow?.lockedReason ?? formatCourseEndAvailability()}
            </p>
          </div>
          <span className="tag">{formatTimestamp(postTestProgress?.completedAt)}</span>
        </div>
        {finalPostTestAssessment && postTestWorkflow?.unlocked ? (
          <QuizCard
            key={`${finalPostTestAssessment.id}-${postTestProgress?.attemptCount ?? 0}`}
            label={finalPostTestAssessment.title}
            largeQuestionStem
            onComplete={handleCourseAssessmentComplete}
            questions={finalPostTestAssessment.questions}
            revealAnswers={completionArtifactsUnlocked}
            showRunningScore={false}
          />
        ) : null}
      </section>

      <section className={`section-card${surveyUnlocked ? '' : ' section-card--locked'}`}>
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Post-course survey</div>
            <h2>{surveyComplete ? 'Survey submitted' : 'Submit the survey to unlock the certificate'}</h2>
            <p>{surveyUnlocked ? 'Survey status is saved locally.' : 'Complete the post-test after the live course first.'}</p>
          </div>
          <span className="tag">{formatTimestamp(state.courseSurvey.submittedAt)}</span>
        </div>
        {surveyComplete ? (
          <div className="feedback-banner feedback-banner--success">
            <strong>Certificate is unlocked.</strong>
            <p>Your survey response is saved locally and synced to Supabase when connected.</p>
          </div>
        ) : (
          <CourseSurveyForm
            disabled={!surveyUnlocked}
            items={postCourseSurveyItems}
            onResponsesChange={setSurveyResponses}
            onSubmit={handleSurveySubmit}
            responses={surveyResponses}
            submitLabel="Submit survey"
          />
        )}
      </section>

      {completionArtifactsUnlocked ? (
        <section className="section-card certificate-card">
          <div className="eyebrow">Certificate of completion</div>
          <h2>{certificateName}</h2>
          <p>
            has completed the SoCal EBUS Prep online curriculum, pre-test, lecture quizzes, final post-test, and
            post-course survey.
          </p>
          <div className="tag-row">
            <span className="tag">Completed {formatTimestamp(state.courseSurvey.submittedAt)}</span>
            <span className="tag">SoCal EBUS Prep 2026</span>
          </div>
          <button className="button button--ghost" onClick={() => window.print()} type="button">
            Print certificate
          </button>
        </section>
      ) : null}
    </div>
  );
}
