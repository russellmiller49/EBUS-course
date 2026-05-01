import type { FormEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { courseAssessments, finalPostTestAssessment, getCourseAssessmentById } from '@/content/courseAssessments';
import { courseInfo } from '@/content/course';
import { lectureManifest } from '@/content/lectures';
import type { CourseAssessmentContent } from '@/content/types';
import { AabipVideoLibrary } from '@/features/lectures/AabipVideoLibrary';
import { LectureCard } from '@/features/lectures/LectureCard';
import { QuizCard } from '@/features/quiz/QuizCard';
import { useCourseAdminSessionActive, useCourseVendorSessionActive } from '@/lib/adminSession';
import { useAuth } from '@/lib/auth';
import {
  getAssessmentWorkflowStatus,
  getCourseAssessmentProgress,
  getLectureModuleProgressSummary,
  getLectureWorkflowStatus,
  getNextCourseStep,
  isCourseSurveyComplete,
  type CourseWorkflowStepModel,
} from '@/lib/courseWorkflow';
import type { QuizResult } from '@/lib/quiz';
import { type CourseAssessmentProgress, useLearnerProgress } from '@/lib/progress';

const VIDEO_TABS = [
  { id: 'course-videos', label: 'Course Videos' },
  { id: 'aabip-videos', label: 'AABIP Videos' },
] as const;

const surveyItems = [
  {
    id: 'confidence',
    label: 'Confidence after the course',
    options: ['More confident with cpEBUS fundamentals', 'About the same', 'Less confident'],
  },
  {
    id: 'pacing',
    label: 'Online curriculum pacing',
    options: ['About right', 'Too compressed', 'Too slow'],
  },
  {
    id: 'readiness',
    label: 'Readiness for the live simulation day',
    options: ['Ready to practice deliberately', 'Need more review time', 'Unsure'],
  },
];

type VideoTabId = (typeof VIDEO_TABS)[number]['id'];

function formatTimestamp(value: string | null | undefined) {
  if (!value) {
    return 'Not completed';
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function getAssessmentScoreLabel(assessment: CourseAssessmentContent, progress: CourseAssessmentProgress | null) {
  if (!progress?.completedAt) {
    return `${assessment.questions.length} questions`;
  }

  return `${progress.percent}% saved`;
}

function getAssessmentRequirementLabel(assessment: CourseAssessmentContent) {
  const lectureLabels = assessment.requiredLectureIds.map((lectureId) => {
    const lecture = lectureManifest.find((entry) => entry.id === lectureId);

    return lecture?.week ?? lecture?.title ?? lectureId;
  });

  return lectureLabels.length > 0 ? `After ${lectureLabels.join(' + ')}` : 'After required lecture';
}

function getTrailingLectureId(assessment: CourseAssessmentContent) {
  return assessment.requiredLectureIds[assessment.requiredLectureIds.length - 1] ?? null;
}

function getProgressPercent(completedCount: number, totalCount: number) {
  return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
}

function CourseAssessmentSummary({
  active,
  assessment,
  onSelect,
  progress,
  workflow,
}: {
  active: boolean;
  assessment: CourseAssessmentContent;
  onSelect: () => void;
  progress: CourseAssessmentProgress | null;
  workflow: CourseWorkflowStepModel | null;
}) {
  const locked = !workflow?.unlocked;
  const completed = Boolean(progress?.completedAt);

  return (
    <article className={`course-assessment-card course-assessment-card--inline${active ? ' course-assessment-card--active' : ''}`}>
      <div className="course-assessment-card__heading">
        <div>
          <span className="eyebrow">{assessment.kind === 'post-test' ? 'Post-test' : 'Post-lecture quiz'}</span>
          <strong>{assessment.title}</strong>
          <span>{getAssessmentRequirementLabel(assessment)}</span>
        </div>
        <span className="tag">{getAssessmentScoreLabel(assessment, progress)}</span>
      </div>
      {locked ? <small>{workflow?.lockedReason ?? 'Complete the required lecture to unlock this quiz.'}</small> : null}
      {completed ? <small>Completed {formatTimestamp(progress?.completedAt)}</small> : null}
      <div className="button-row button-row--wrap">
        <button className="button button--ghost" disabled={locked} onClick={onSelect} type="button">
          {completed ? 'Review or retake' : active ? 'Continue quiz' : 'Start quiz'}
        </button>
      </div>
    </article>
  );
}

export function LecturesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    recordCourseAssessmentResult,
    recordQuizResult,
    setLectureState,
    setModuleProgress,
    state,
    submitCourseSurvey,
  } = useLearnerProgress();
  const { profile, user } = useAuth();
  const adminSessionActive = useCourseAdminSessionActive();
  const vendorSessionActive = useCourseVendorSessionActive();
  const previewSessionActive = adminSessionActive || vendorSessionActive;
  const accessOptions = useMemo(
    () => ({ admin: adminSessionActive, preview: vendorSessionActive }),
    [adminSessionActive, vendorSessionActive],
  );
  const previewLabel = vendorSessionActive ? 'Sponsor preview' : 'Admin preview';
  const reviewedCount = Object.values(state.lectureWatchStatus).filter((lecture) => lecture.completed).length;
  const activeTab = searchParams.get('tab') === 'aabip-videos' ? 'aabip-videos' : 'course-videos';
  const selectedAssessmentParam = searchParams.get('assessment');
  const selectedCourseAssessmentId = selectedAssessmentParam && getCourseAssessmentById(selectedAssessmentParam) ? selectedAssessmentParam : null;
  const nextCourseStep = getNextCourseStep(state, accessOptions);
  const activeAssessmentId = selectedCourseAssessmentId ?? nextCourseStep?.assessmentId ?? null;
  const lectureModuleProgress = getLectureModuleProgressSummary(state);
  const completedAssessments = courseAssessments.filter(
    (assessment) => state.courseAssessmentResults[assessment.id]?.completedAt,
  ).length;
  const postTestProgress = finalPostTestAssessment
    ? getCourseAssessmentProgress(state, finalPostTestAssessment.id)
    : null;
  const surveyComplete = isCourseSurveyComplete(state);
  const surveyUnlocked = previewSessionActive || Boolean(postTestProgress?.completedAt);
  const completionArtifactsUnlocked = previewSessionActive || surveyComplete;
  const certificateName = profile?.fullName || user?.email || 'EBUS learner';
  const [surveyResponses, setSurveyResponses] = useState<Record<string, string>>({});
  const canSubmitSurvey = surveyItems.every((item) => surveyResponses[item.id]);

  const assessmentsByTrailingLectureId = useMemo(() => {
    return courseAssessments.reduce<Record<string, CourseAssessmentContent[]>>((grouped, assessment) => {
      const lectureId = getTrailingLectureId(assessment);

      if (!lectureId) {
        return grouped;
      }

      return {
        ...grouped,
        [lectureId]: [...(grouped[lectureId] ?? []), assessment],
      };
    }, {});
  }, []);

  const handleLectureUpdate = useCallback(
    (lectureId: string, update: { watchedSeconds?: number; completed?: boolean; opened?: boolean }) => {
      const wasCompleted = getLectureWorkflowStatus(state, lectureId, accessOptions)?.completed ?? false;
      const nextCompletedCount = lectureModuleProgress.completedCount + (!wasCompleted && update.completed ? 1 : 0);

      setLectureState(lectureId, update);

      if (update.completed) {
        setModuleProgress(
          'lectures',
          getProgressPercent(nextCompletedCount, lectureModuleProgress.totalCount),
          nextCompletedCount >= lectureModuleProgress.totalCount,
        );
      }
    },
    [accessOptions, lectureModuleProgress.completedCount, lectureModuleProgress.totalCount, setLectureState, setModuleProgress, state],
  );

  function handleTabChange(nextTab: VideoTabId) {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextTab === 'course-videos') {
      nextSearchParams.delete('tab');
    } else {
      nextSearchParams.set('tab', nextTab);
    }

    setSearchParams(nextSearchParams, { replace: true });
  }

  function handleAssessmentSelect(assessmentId: string) {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.delete('tab');
    nextSearchParams.set('assessment', assessmentId);
    setSearchParams(nextSearchParams, { replace: true });
  }

  function handleCourseAssessmentComplete(
    assessment: CourseAssessmentContent,
    result: QuizResult,
  ) {
    const wasComplete = Boolean(state.courseAssessmentResults[assessment.id]?.completedAt);
    const nextCompletedCount = lectureModuleProgress.completedCount + (wasComplete ? 0 : 1);
    const answers = result.items.map((item) => ({
      questionId: item.question.id,
      selectedOptionIds: item.selectedOptionIds,
      correctOptionIds: item.question.correctOptionIds,
      isCorrect: item.isCorrect,
    }));

    recordCourseAssessmentResult({
      assessmentId: assessment.id,
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      percent: result.percent,
      answers,
    });
    recordQuizResult({
      id: `${assessment.id}-${Date.now()}`,
      label: assessment.title,
      moduleId: 'lectures',
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      percent: result.percent,
    });
    setModuleProgress(
      'lectures',
      getProgressPercent(nextCompletedCount, lectureModuleProgress.totalCount),
      nextCompletedCount >= lectureModuleProgress.totalCount,
    );
  }

  function handleSurveySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmitSurvey || !surveyUnlocked) {
      return;
    }

    const nextCompletedCount = lectureModuleProgress.completedCount + (surveyComplete ? 0 : 1);

    submitCourseSurvey(surveyResponses);
    setModuleProgress(
      'lectures',
      getProgressPercent(nextCompletedCount, lectureModuleProgress.totalCount),
      nextCompletedCount >= lectureModuleProgress.totalCount,
    );
  }

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Lecture module</div>
            <h2>Course videos, post-lecture quizzes, and final post-test</h2>
            <p>
              Complete each lecture to unlock its quiz in place. The next lecture opens after the required quiz or
              post-test step is submitted.
            </p>
          </div>
          <div className="tag-row">
            <span className="tag">{lectureManifest.length} course videos</span>
            <span className="tag">{completedAssessments}/{courseAssessments.length} assessments</span>
            <span className="tag">Current: {nextCourseStep?.title ?? 'Complete'}</span>
          </div>
        </div>
        <div aria-label="Video library tabs" className="button-row button-row--wrap" role="tablist">
          {VIDEO_TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                aria-controls={`lectures-panel-${tab.id}`}
                aria-selected={isActive}
                className={`control-pill${isActive ? ' control-pill--active' : ''}`}
                id={`lectures-tab-${tab.id}`}
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                role="tab"
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {activeTab === 'course-videos' ? (
        <div aria-labelledby="lectures-tab-course-videos" id="lectures-panel-course-videos" role="tabpanel">
          <section className="section-card">
            <div className="section-card__heading">
              <div>
                <div className="eyebrow">Lecture manifest</div>
                <h2>Prep window: {courseInfo.prepWindow}</h2>
                <p>
                  Start with the welcome video. The pre-test, practice modules, lecture quizzes, final post-test,
                  survey, answers, and certificate unlock in sequence as each required step is completed.
                </p>
              </div>
            </div>
            <div className="mini-card-grid">
              {courseInfo.prepTopics.map((topic) => (
                <article key={topic} className="mini-card">
                  <p>{topic}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section-card">
            <div className="section-card__heading">
              <div>
                <div className="eyebrow">Progress</div>
                <h2>{lectureModuleProgress.completedCount} of {lectureModuleProgress.totalCount} lecture-module steps complete</h2>
                <p>
                  {reviewedCount} of {lectureManifest.length} lectures marked reviewed.{' '}
                  {nextCourseStep ? `Current step: ${nextCourseStep.title}` : 'All course steps are complete.'}
                </p>
              </div>
              <div className="tag-row">
                <span className="tag">{lectureModuleProgress.percent}% complete</span>
              </div>
            </div>
            <div className="stack-list">
              {lectureManifest.map((lecture) => {
                const workflowStatus = getLectureWorkflowStatus(state, lecture.id, accessOptions);
                const lectureAssessments = assessmentsByTrailingLectureId[lecture.id] ?? [];

                return (
                  <div key={lecture.id} className="lecture-workflow-item">
                    <LectureCard
                      lecture={lecture}
                      locked={!workflowStatus?.unlocked}
                      lockedReason={workflowStatus?.lockedReason}
                      onUpdateWatchState={handleLectureUpdate}
                      watchState={state.lectureWatchStatus[lecture.id]}
                    />
                    {lectureAssessments.map((assessment) => {
                      const workflow = getAssessmentWorkflowStatus(state, assessment, accessOptions);
                      const progress = getCourseAssessmentProgress(state, assessment.id);
                      const active = activeAssessmentId === assessment.id;

                      return (
                        <div key={assessment.id} className="lecture-assessment-stack">
                          <CourseAssessmentSummary
                            active={active}
                            assessment={assessment}
                            onSelect={() => handleAssessmentSelect(assessment.id)}
                            progress={progress}
                            workflow={workflow}
                          />
                          {active && workflow?.unlocked ? (
                            <QuizCard
                              key={`${assessment.id}-${progress?.attemptCount ?? 0}`}
                              deferFeedbackUntilComplete={assessment.kind !== 'post-test'}
                              label={assessment.title}
                              onComplete={(result) => handleCourseAssessmentComplete(assessment, result)}
                              questions={assessment.questions}
                              revealAnswers
                              showRunningScore={false}
                            />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="section-card">
            <div className="section-card__heading">
              <div>
                <div className="eyebrow">Course completion</div>
                <h2>Post-course survey and certificate</h2>
                <p>
                  These open after the final post-test, so the whole course assessment path stays inside the lecture module.
                </p>
              </div>
            </div>
          </section>

          {surveyUnlocked ? (
            <section className="section-card">
              <div className="section-card__heading">
                <div>
                  <div className="eyebrow">Post-course survey</div>
                  <h2>{surveyComplete ? 'Survey submitted' : 'Submit the survey to unlock the certificate'}</h2>
                  <p>Survey status: {formatTimestamp(state.courseSurvey.submittedAt)}</p>
                </div>
              </div>
              {surveyComplete ? (
                <div className="feedback-banner feedback-banner--success">
                  <strong>Certificate is unlocked.</strong>
                  <p>
                    {previewSessionActive && !surveyComplete
                      ? `${previewLabel} is active without changing learner survey status.`
                      : 'Your survey response is saved in local progress and included in the synced learner snapshot when login-backed sync is enabled.'}
                  </p>
                </div>
              ) : (
                <form className="survey-form" onSubmit={handleSurveySubmit}>
                  {surveyItems.map((item) => (
                    <fieldset key={item.id} className="survey-fieldset">
                      <legend>{item.label}</legend>
                      <div className="button-row button-row--wrap">
                        {item.options.map((option) => (
                          <label key={option} className="control-pill">
                            <input
                              checked={surveyResponses[item.id] === option}
                              name={item.id}
                              onChange={() => setSurveyResponses((current) => ({ ...current, [item.id]: option }))}
                              type="radio"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                  <label className="field">
                    <span>Optional course note</span>
                    <textarea
                      onChange={(event) =>
                        setSurveyResponses((current) => ({ ...current, courseNote: event.target.value }))
                      }
                      rows={4}
                      value={surveyResponses.courseNote ?? ''}
                    />
                  </label>
                  <button className="button" disabled={!canSubmitSurvey} type="submit">
                    Submit survey
                  </button>
                </form>
              )}
            </section>
          ) : null}

          {completionArtifactsUnlocked ? (
            <section className="section-card certificate-card">
              <div className="eyebrow">Certificate of completion</div>
              <h2>{certificateName}</h2>
              <p>
                {previewSessionActive && !surveyComplete
                  ? `${previewLabel} of the certificate workflow unlocked after learner completion.`
                  : 'has completed the SoCal EBUS Prep online curriculum, pre-test, lecture quizzes, final post-test, and post-course survey.'}
              </p>
              <div className="tag-row">
                <span className="tag">
                  {previewSessionActive && !surveyComplete ? previewLabel : `Completed ${formatTimestamp(state.courseSurvey.submittedAt)}`}
                </span>
                <span className="tag">SoCal EBUS Prep 2026</span>
              </div>
              <button className="button button--ghost" onClick={() => window.print()} type="button">
                Print certificate
              </button>
            </section>
          ) : null}
        </div>
      ) : (
        <AabipVideoLibrary labelledBy="lectures-tab-aabip-videos" panelId="lectures-panel-aabip-videos" />
      )}
    </div>
  );
}
