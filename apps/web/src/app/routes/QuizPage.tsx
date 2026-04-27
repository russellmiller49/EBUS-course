import type { FormEvent } from 'react';
import { useState } from 'react';

import { courseAssessments, finalPostTestAssessment, getCourseAssessmentById } from '@/content/courseAssessments';
import { getQuizQuestions } from '@/content/quiz';
import type { CourseAssessmentContent } from '@/content/types';
import { QuizCard } from '@/features/quiz/QuizCard';
import { useCourseAdminSessionActive } from '@/lib/adminSession';
import { useAuth } from '@/lib/auth';
import {
  getAssessmentWorkflowStatus,
  getCourseAssessmentProgress,
  getCourseStepModels,
  isCourseSurveyComplete,
} from '@/lib/courseWorkflow';
import { useLearnerProgress } from '@/lib/progress';

type QuizFilter = 'all' | 'knobology' | 'station-map' | 'station-explorer';

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

function formatTimestamp(value: string | null | undefined) {
  if (!value) {
    return 'Not completed';
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

function getAssessmentScoreLabel(assessment: CourseAssessmentContent, completedAt: string | null | undefined, percent?: number) {
  if (!completedAt) {
    return `${assessment.questions.length} questions`;
  }

  return `${percent ?? 0}% saved`;
}

export function QuizPage() {
  const {
    recordCourseAssessmentResult,
    recordQuizResult,
    setModuleProgress,
    state,
    submitCourseSurvey,
  } = useLearnerProgress();
  const { profile, user } = useAuth();
  const adminSessionActive = useCourseAdminSessionActive();
  const [filter, setFilter] = useState<QuizFilter>('all');
  const [selectedCourseAssessmentId, setSelectedCourseAssessmentId] = useState<string | null>(null);
  const [surveyResponses, setSurveyResponses] = useState<Record<string, string>>({});
  const questions = filter === 'all' ? getQuizQuestions() : getQuizQuestions(filter);
  const filterLabels: Record<QuizFilter, string> = {
    all: 'All',
    knobology: 'Knobology',
    'station-map': 'Station map',
    'station-explorer': 'Explorer',
  };
  const courseStepModels = getCourseStepModels(state, { admin: adminSessionActive });
  const assessmentRows = courseAssessments.map((assessment) => ({
    assessment,
    progress: getCourseAssessmentProgress(state, assessment.id),
    workflow: getAssessmentWorkflowStatus(state, assessment, { admin: adminSessionActive }),
  }));
  const nextUnlockedAssessment =
    assessmentRows.find((row) => row.workflow?.unlocked && !row.progress?.completedAt)?.assessment ??
    assessmentRows.find((row) => row.workflow?.unlocked)?.assessment ??
    null;
  const selectedCourseAssessment =
    (selectedCourseAssessmentId ? getCourseAssessmentById(selectedCourseAssessmentId) : null) ?? nextUnlockedAssessment;
  const selectedAssessmentWorkflow = selectedCourseAssessment
    ? getAssessmentWorkflowStatus(state, selectedCourseAssessment, { admin: adminSessionActive })
    : null;
  const selectedAssessmentProgress = selectedCourseAssessment
    ? getCourseAssessmentProgress(state, selectedCourseAssessment.id)
    : null;
  const postTestProgress = finalPostTestAssessment
    ? getCourseAssessmentProgress(state, finalPostTestAssessment.id)
    : null;
  const surveyComplete = isCourseSurveyComplete(state);
  const surveyUnlocked = adminSessionActive || Boolean(postTestProgress?.completedAt);
  const completionArtifactsUnlocked = adminSessionActive || surveyComplete;
  const certificateName = profile?.fullName || user?.email || 'EBUS learner';
  const completedAssessments = assessmentRows.filter((row) => row.progress?.completedAt).length;
  const currentCourseStep = courseStepModels.find((step) => step.unlocked && !step.completed);
  const canSubmitSurvey = surveyItems.every((item) => surveyResponses[item.id]);

  function handleCourseAssessmentComplete(assessment: CourseAssessmentContent, result: { correctCount: number; totalCount: number; percent: number }) {
    const wasComplete = Boolean(state.courseAssessmentResults[assessment.id]?.completedAt);
    const nextCompletedCount = completedAssessments + (wasComplete ? 0 : 1);

    recordCourseAssessmentResult({
      assessmentId: assessment.id,
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      percent: result.percent,
    });
    recordQuizResult({
      id: `${assessment.id}-${Date.now()}`,
      label: assessment.title,
      moduleId: 'quiz',
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      percent: result.percent,
    });
    setModuleProgress(
      'quiz',
      Math.round((nextCompletedCount / courseAssessments.length) * 100),
      nextCompletedCount >= courseAssessments.length && surveyComplete,
    );
  }

  function handleSurveySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmitSurvey || !surveyUnlocked) {
      return;
    }

    submitCourseSurvey(surveyResponses);
    setModuleProgress('quiz', 100, true);
  }

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Course progression</div>
            <h2>Post-lecture quizzes, post-test, survey, answers, and certificate</h2>
            <p>
              Quizzes unlock only after the required lecture video is complete. Post-test answers and the certificate
              unlock after the post-course survey is submitted.
            </p>
          </div>
          <div className="tag-row">
            <span className="tag">{completedAssessments}/{courseAssessments.length} assessments</span>
            <span className="tag">Current: {currentCourseStep?.title ?? 'Complete'}</span>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Assessment path</div>
            <h2>Unlocked in lecture order</h2>
          </div>
        </div>
        <div className="course-assessment-grid">
          {assessmentRows.map(({ assessment, progress, workflow }) => {
            const isSelected = selectedCourseAssessment?.id === assessment.id;

            return (
              <button
                key={assessment.id}
                className={`course-assessment-card${isSelected ? ' course-assessment-card--active' : ''}`}
                disabled={!workflow?.unlocked}
                onClick={() => setSelectedCourseAssessmentId(assessment.id)}
                type="button"
              >
                <span className="eyebrow">{assessment.kind === 'post-test' ? 'Post-test' : 'Quiz'}</span>
                <strong>{assessment.title}</strong>
                <span>{getAssessmentScoreLabel(assessment, progress?.completedAt, progress?.percent)}</span>
                {!workflow?.unlocked ? <small>{workflow?.lockedReason}</small> : null}
              </button>
            );
          })}
        </div>
      </section>

      {selectedCourseAssessment && selectedAssessmentWorkflow?.unlocked ? (
        <QuizCard
          key={`${selectedCourseAssessment.id}-${selectedAssessmentProgress?.attemptCount ?? 0}`}
          deferFeedbackUntilComplete
          label={selectedCourseAssessment.title}
          onComplete={(result) => handleCourseAssessmentComplete(selectedCourseAssessment, result)}
          questions={selectedCourseAssessment.questions}
          revealAnswers={selectedCourseAssessment.kind !== 'post-test' || completionArtifactsUnlocked}
          showRunningScore={false}
        />
      ) : (
        <section className="section-card section-card--notice">
          <div className="section-card__heading">
            <div>
              <div className="eyebrow">Locked</div>
              <h2>{selectedAssessmentWorkflow?.lockedReason ?? 'Complete the current course step to unlock assessments.'}</h2>
            </div>
          </div>
        </section>
      )}

      {surveyUnlocked ? (
        <section className="section-card">
          <div className="section-card__heading">
            <div>
              <div className="eyebrow">Post-course survey</div>
              <h2>{surveyComplete ? 'Survey submitted' : 'Submit the survey to unlock answers and certificate'}</h2>
              <p>Survey status: {formatTimestamp(state.courseSurvey.submittedAt)}</p>
            </div>
          </div>
          {surveyComplete ? (
            <div className="feedback-banner feedback-banner--success">
              <strong>Post-test answers and certificate are unlocked.</strong>
              <p>
                {adminSessionActive && !surveyComplete
                  ? 'Admin preview is active without changing learner survey status.'
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

      {completionArtifactsUnlocked && finalPostTestAssessment ? (
        <section className="section-card">
          <div className="section-card__heading">
            <div>
              <div className="eyebrow">Post-test answers</div>
              <h2>Answer key and teaching explanations</h2>
            </div>
            <div className="tag-row">
              <span className="tag">{postTestProgress?.percent ?? 0}% post-test score</span>
            </div>
          </div>
          <div className="stack-list">
            {finalPostTestAssessment.questions.map((question, index) => {
              const correctLabels = question.correctOptionIds
                .map((optionId) => question.options.find((option) => option.id === optionId)?.label ?? optionId)
                .join(', ');

              return (
                <article key={question.id} className="mini-card">
                  <strong>
                    {index + 1}. {correctLabels}
                  </strong>
                  <p>{question.explanation}</p>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {completionArtifactsUnlocked ? (
        <section className="section-card certificate-card">
          <div className="eyebrow">Certificate of completion</div>
          <h2>{certificateName}</h2>
          <p>
            {adminSessionActive && !surveyComplete
              ? 'Admin preview of the certificate workflow unlocked after learner completion.'
              : 'has completed the SoCal EBUS Prep online curriculum, pre-test, lecture quizzes, final post-test, and post-course survey.'}
          </p>
          <div className="tag-row">
            <span className="tag">
              {adminSessionActive && !surveyComplete ? 'Admin preview' : `Completed ${formatTimestamp(state.courseSurvey.submittedAt)}`}
            </span>
            <span className="tag">SoCal EBUS Prep 2026</span>
          </div>
          <button className="button button--ghost" onClick={() => window.print()} type="button">
            Print certificate
          </button>
        </section>
      ) : null}

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Practice question bank</div>
            <h2>Mixed review across modules</h2>
          </div>
        </div>
        <div className="button-row button-row--wrap">
          {(['all', 'knobology', 'station-map', 'station-explorer'] as const).map((candidate) => (
            <button
              key={candidate}
              className={`control-pill${filter === candidate ? ' control-pill--active' : ''}`}
              onClick={() => setFilter(candidate)}
              type="button"
            >
              {filterLabels[candidate]}
            </button>
          ))}
        </div>
      </section>

      <QuizCard
        key={filter}
        label={filter === 'all' ? 'Mixed quiz' : `${filter} quiz`}
        onComplete={(result) => {
          recordQuizResult({
            id: `${filter}-${Date.now()}`,
            label: filter === 'all' ? 'Mixed quiz' : `${filter} quiz`,
            moduleId:
              filter === 'all'
                ? 'mixed'
                : filter === 'station-map'
                  ? 'station-map'
                  : filter === 'station-explorer'
                    ? 'station-explorer'
                    : 'knobology',
            correctCount: result.correctCount,
            totalCount: result.totalCount,
            percent: result.percent,
          });
          setModuleProgress('quiz', result.percent >= 80 ? 100 : 75, result.percent >= 80);
        }}
        questions={questions}
      />

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">History</div>
            <h2>Recent saved attempts</h2>
          </div>
        </div>
        <div className="stack-list">
          {state.quizScoreHistory.length === 0 ? (
            <div className="mini-card">
              <p>Saved attempts will appear here after you complete a quiz.</p>
            </div>
          ) : (
            state.quizScoreHistory.map((entry) => (
              <article key={entry.id} className="mini-card">
                <strong>{entry.label}</strong>
                <p>
                  {entry.correctCount}/{entry.totalCount} correct · {entry.percent}%
                </p>
                <span>{new Date(entry.completedAt).toLocaleString()}</span>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
