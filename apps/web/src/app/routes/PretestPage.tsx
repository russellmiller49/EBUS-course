import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { preCourseSurveyItems } from '@/content/courseSurveys';
import { getPretestImage, pretestContent } from '@/content/pretest';
import { getFirstUnansweredQuestionIndex, getNextUnansweredQuestionIndex, scorePretest } from '@/features/pretest/logic';
import { validatePretestAdminPasscode } from '@/lib/access';
import { useAuth } from '@/lib/auth';
import { useLearnerProgress } from '@/lib/progress';

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Not submitted yet';
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function PretestPage() {
  const {
    state,
    setModuleProgress,
    setPretestAnswer,
    setPretestQuestionIndex,
    submitPreCourseSurvey,
    submitPretest,
    unlockPretestWithPasscode,
  } = useLearnerProgress();
  const { isSupabaseEnabled, user } = useAuth();
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminPasscodeStatus, setAdminPasscodeStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [surveyResponses, setSurveyResponses] = useState<Record<string, string>>({});
  const questions = pretestContent.questions;
  const pretest = state.pretest;
  const currentIndex = Math.max(0, Math.min(questions.length - 1, pretest.currentQuestionIndex));
  const currentQuestion = questions[currentIndex];
  const currentImage = currentQuestion?.imageAssetKey ? getPretestImage(currentQuestion.imageAssetKey) : null;
  const submitted = Boolean(pretest.submittedAt);
  const unlockedByPasscode = Boolean(pretest.unlockedByPasscodeAt);
  const accountComplete = !isSupabaseEnabled || Boolean(user);
  const preCourseSurveyComplete = Boolean(state.preCourseSurvey.submittedAt);
  const pretestAccessUnlocked = submitted || unlockedByPasscode || (accountComplete && preCourseSurveyComplete);
  const result = useMemo(() => scorePretest(questions, pretest.answers), [questions, pretest.answers]);
  const unansweredCount = result.totalCount - result.answeredCount;
  const firstUnansweredQuestionIndex = getFirstUnansweredQuestionIndex(questions, pretest.answers);
  const nextUnansweredQuestionIndex = getNextUnansweredQuestionIndex(questions, pretest.answers, currentIndex);
  const savedScore = pretest.score ?? result.correctCount;
  const savedTotal = pretest.totalQuestions || questions.length;
  const savedPercent = savedTotal > 0 ? Math.round((savedScore / savedTotal) * 100) : 0;
  const progressPercent =
    submitted || unlockedByPasscode || result.totalCount === 0
      ? 100
      : preCourseSurveyComplete
        ? Math.max(38, Math.round((result.answeredCount / result.totalCount) * 92))
        : accountComplete
          ? 24
          : 12;
  const canSubmitSurvey = preCourseSurveyItems.every((item) => surveyResponses[item.id]);

  useEffect(() => {
    setModuleProgress('pretest', progressPercent, pretestAccessUnlocked);
  }, [pretestAccessUnlocked, progressPercent, setModuleProgress]);

  function openQuestion(index: number) {
    if (index < 0 || index >= questions.length) {
      return;
    }

    setPretestQuestionIndex(index);
  }

  function handleSelect(optionId: string) {
    if (!currentQuestion || submitted || !pretestAccessUnlocked) {
      return;
    }

    setPretestAnswer(currentQuestion.id, optionId);
  }

  function handleSubmit() {
    if (!pretestAccessUnlocked || result.answeredCount < result.totalCount) {
      if (firstUnansweredQuestionIndex >= 0) {
        openQuestion(firstUnansweredQuestionIndex);
      }

      return;
    }

    submitPretest({
      score: result.correctCount,
      answeredCount: result.answeredCount,
      totalQuestions: result.totalCount,
    });
  }

  function handleAdminPasscodeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validatePretestAdminPasscode(adminPasscode)) {
      setAdminPasscodeStatus('error');
      return;
    }

    unlockPretestWithPasscode();
    setAdminPasscode('');
    setAdminPasscodeStatus('success');
  }

  function handleSurveySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accountComplete || !canSubmitSurvey) {
      return;
    }

    submitPreCourseSurvey(surveyResponses);
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="eyebrow">Baseline assessment</div>
        <h2>{pretestContent.title}</h2>
        <p>{pretestContent.summary}</p>
        <div className="tag-row">
          <span className="tag">{accountComplete ? 'Account complete' : 'Account required'}</span>
          <span className="tag">{preCourseSurveyComplete ? 'Survey submitted' : 'Survey first'}</span>
          <span className="tag">{questions.length} questions</span>
          <span className="tag">Answers hidden</span>
          <span className="tag">Demo local logging</span>
        </div>
        <div className="stack-list">
          {pretestContent.instructions.map((instruction) => (
            <div key={instruction} className="mini-card">
              <p>{instruction}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Pre-course flow</div>
            <h2>
              {submitted
                ? 'Pre-test submitted'
                : unlockedByPasscode
                  ? 'Admin/developer access unlocked'
                  : !accountComplete
                    ? 'Create an account or sign in'
                    : !preCourseSurveyComplete
                      ? 'Pre-course survey is next'
                  : 'Assessment in progress'}
            </h2>
          </div>
        </div>
        <div className="stats-grid">
          <article className="mini-card">
            <strong>
              {submitted
                ? `${savedScore}/${savedTotal}`
                : unlockedByPasscode
                  ? 'Unlocked'
                  : `${result.answeredCount}/${questions.length}`}
            </strong>
            <span>{submitted ? 'Saved score' : unlockedByPasscode ? 'Course access' : 'Questions answered'}</span>
          </article>
          <article className="mini-card">
            <strong>{submitted ? `${savedPercent}%` : unlockedByPasscode ? 'Staff' : `${unansweredCount}`}</strong>
            <span>{submitted ? 'Saved percent' : unlockedByPasscode ? 'Access mode' : 'Questions remaining'}</span>
          </article>
          <article className="mini-card">
            <strong>{submitted ? pretest.attemptCount : unlockedByPasscode ? 'Passcode' : 'Local only'}</strong>
            <span>{submitted ? 'Saved attempts' : unlockedByPasscode ? 'Unlock method' : 'Logging mode'}</span>
          </article>
        </div>
        <p>{pretestContent.demoPolicy}</p>
        <div className="tag-row">
          <span className="tag">Latest submission: {formatTimestamp(pretest.submittedAt)}</span>
          {unlockedByPasscode ? (
            <span className="tag">Passcode unlock: {formatTimestamp(pretest.unlockedByPasscodeAt)}</span>
          ) : null}
          {submitted ? <span className="tag">Read-only review</span> : <span className="tag">Editable until submitted</span>}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Step 1</div>
            <h2>{accountComplete ? 'Account step complete' : 'Create account / log in'}</h2>
            <p>
              {accountComplete
                ? 'Your learner access step is complete for this browser session.'
                : 'Create your learner account or sign in before submitting the pre-course survey.'}
            </p>
          </div>
        </div>
        {!accountComplete ? (
          <div className="button-row button-row--wrap">
            <Link className="button" to="/auth?mode=sign-up&next=%2Fpretest">
              Create account
            </Link>
            <Link className="button button--ghost" to="/auth?next=%2Fpretest">
              Sign in
            </Link>
          </div>
        ) : null}
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Step 2</div>
            <h2>{preCourseSurveyComplete ? 'Pre-course survey submitted' : 'Pre-course survey'}</h2>
            <p>Submit the survey before starting the baseline pre-test.</p>
          </div>
          <span className="tag">{formatTimestamp(state.preCourseSurvey.submittedAt)}</span>
        </div>
        {preCourseSurveyComplete ? (
          <div className="feedback-banner feedback-banner--success">
            <strong>Survey saved</strong>
            <p>Your pre-course survey response is saved locally with learner progress.</p>
          </div>
        ) : (
          <form className="survey-form" onSubmit={handleSurveySubmit}>
            {preCourseSurveyItems.map((item) => (
              <fieldset key={item.id} className="survey-fieldset" disabled={!accountComplete}>
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
            <button className="button" disabled={!accountComplete || !canSubmitSurvey} type="submit">
              Submit pre-course survey
            </button>
          </form>
        )}
      </section>

      {!submitted ? (
        <section className="section-card section-card--notice">
          <div className="section-card__heading">
            <div>
              <div className="eyebrow">Admin/developer access</div>
              <h2>Unlock without submitting a learner score</h2>
            </div>
          </div>
          {unlockedByPasscode ? (
            <div className="feedback-banner feedback-banner--success">
              <strong>Access unlocked</strong>
              <p>Course modules are available while the pre-test remains open for optional review or completion.</p>
            </div>
          ) : (
            <form className="pretest-unlock-form" onSubmit={handleAdminPasscodeSubmit}>
              <label className="field">
                <span>Passcode</span>
                <input
                  autoComplete="off"
                  onChange={(event) => {
                    setAdminPasscode(event.target.value);
                    setAdminPasscodeStatus('idle');
                  }}
                  placeholder="Enter passcode"
                  type="password"
                  value={adminPasscode}
                />
              </label>
              {adminPasscodeStatus === 'error' ? (
                <div className="feedback-banner">
                  <strong>Passcode not recognized</strong>
                  <p>Check the admin/developer passcode and try again.</p>
                </div>
              ) : null}
              {adminPasscodeStatus === 'success' ? (
                <div className="feedback-banner feedback-banner--success">
                  <strong>Access unlocked</strong>
                  <p>Course modules are now available on this device.</p>
                </div>
              ) : null}
              <button className="button" type="submit">
                Unlock access
              </button>
            </form>
          )}
        </section>
      ) : null}

      <section className={`section-card${pretestAccessUnlocked ? '' : ' section-card--locked'}`}>
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Step 3</div>
            <h2>
              {pretestAccessUnlocked ? `Question ${currentIndex + 1} of ${questions.length}` : 'Pre-test locked'}
            </h2>
            {!pretestAccessUnlocked ? <p>Complete account setup and the pre-course survey to unlock the test.</p> : null}
          </div>
        </div>
        {pretestAccessUnlocked ? (
          <>
            <div className="pretest-chip-grid" role="list" aria-label="Pretest question navigator">
              {questions.map((question, index) => {
                const answered = Boolean(pretest.answers[question.id]);

                return (
                  <button
                    key={question.id}
                    className={`control-pill pretest-chip${currentIndex === index ? ' pretest-chip--active' : ''}${answered ? ' pretest-chip--answered' : ''}`}
                    onClick={() => openQuestion(index)}
                    type="button"
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            {!submitted && firstUnansweredQuestionIndex >= 0 ? (
              <div className="button-row button-row--wrap">
                <button
                  className="button button--ghost"
                  onClick={() => openQuestion(nextUnansweredQuestionIndex >= 0 ? nextUnansweredQuestionIndex : firstUnansweredQuestionIndex)}
                  type="button"
                >
                  Jump to unanswered #{(nextUnansweredQuestionIndex >= 0 ? nextUnansweredQuestionIndex : firstUnansweredQuestionIndex) + 1}
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </section>

      {pretestAccessUnlocked ? (
      <section className="quiz-card">
        <div className="quiz-card__header">
          <div>
            <div className="eyebrow">{currentQuestion.type.replace(/-/g, ' ')}</div>
            <h2>{currentQuestion.prompt}</h2>
          </div>
          <span className="quiz-card__score">
            {submitted ? `${savedScore}/${savedTotal}` : `${result.answeredCount}/${questions.length}`}
          </span>
        </div>

        {currentImage ? (
          <figure className="pretest-figure">
            <img alt={currentImage.alt} src={currentImage.src} />
            <figcaption>{currentImage.caption}</figcaption>
          </figure>
        ) : null}

        <div className="stack-list">
          {currentQuestion.options.map((option) => {
            const isSelected = pretest.answers[currentQuestion.id] === option.id;

            return (
              <button
                key={option.id}
                className={`choice-card${isSelected ? ' choice-card--selected' : ''}`}
                disabled={submitted}
                onClick={() => handleSelect(option.id)}
                type="button"
              >
                <strong>{option.label}</strong>
              </button>
            );
          })}
        </div>

        <div className="button-row button-row--wrap">
          <button
            className="button button--ghost"
            disabled={currentIndex === 0}
            onClick={() => openQuestion(currentIndex - 1)}
            type="button"
          >
            Previous
          </button>
          <button
            className="button button--ghost"
            disabled={currentIndex === questions.length - 1}
            onClick={() => openQuestion(currentIndex + 1)}
            type="button"
          >
            Next
          </button>
          <button
            className="button"
            disabled={submitted || result.answeredCount !== result.totalCount}
            onClick={handleSubmit}
            type="button"
          >
            {submitted ? 'Pre-test saved' : 'Submit pre-test'}
          </button>
        </div>
      </section>
      ) : null}
    </div>
  );
}
