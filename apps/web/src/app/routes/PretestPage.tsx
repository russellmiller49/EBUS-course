import { useEffect, useMemo } from 'react';

import { getPretestImage, pretestContent } from '@/content/pretest';
import { getFirstUnansweredQuestionIndex, getNextUnansweredQuestionIndex, scorePretest } from '@/features/pretest/logic';
import { useLearnerProgress } from '@/lib/progress';

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Not submitted yet';
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export function PretestPage() {
  const { state, setModuleProgress, setPretestAnswer, setPretestQuestionIndex, submitPretest } = useLearnerProgress();
  const questions = pretestContent.questions;
  const pretest = state.pretest;
  const currentIndex = Math.max(0, Math.min(questions.length - 1, pretest.currentQuestionIndex));
  const currentQuestion = questions[currentIndex];
  const currentImage = currentQuestion?.imageAssetKey ? getPretestImage(currentQuestion.imageAssetKey) : null;
  const submitted = Boolean(pretest.submittedAt);
  const result = useMemo(() => scorePretest(questions, pretest.answers), [questions, pretest.answers]);
  const unansweredCount = result.totalCount - result.answeredCount;
  const firstUnansweredQuestionIndex = getFirstUnansweredQuestionIndex(questions, pretest.answers);
  const nextUnansweredQuestionIndex = getNextUnansweredQuestionIndex(questions, pretest.answers, currentIndex);
  const savedScore = pretest.score ?? result.correctCount;
  const savedTotal = pretest.totalQuestions || questions.length;
  const savedPercent = savedTotal > 0 ? Math.round((savedScore / savedTotal) * 100) : 0;
  const progressPercent =
    submitted || result.totalCount === 0 ? 100 : Math.max(12, Math.round((result.answeredCount / result.totalCount) * 92));

  useEffect(() => {
    setModuleProgress('pretest', progressPercent, submitted);
  }, [progressPercent, setModuleProgress, submitted]);

  function openQuestion(index: number) {
    if (index < 0 || index >= questions.length) {
      return;
    }

    setPretestQuestionIndex(index);
  }

  function handleSelect(optionId: string) {
    if (!currentQuestion || submitted) {
      return;
    }

    setPretestAnswer(currentQuestion.id, optionId);
  }

  function handleSubmit() {
    if (result.answeredCount < result.totalCount) {
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
            <div className="eyebrow">Current status</div>
            <h2>{submitted ? 'Pretest submitted' : 'Assessment in progress'}</h2>
          </div>
        </div>
        <div className="stats-grid">
          <article className="mini-card">
            <strong>{submitted ? `${savedScore}/${savedTotal}` : `${result.answeredCount}/${questions.length}`}</strong>
            <span>{submitted ? 'Saved score' : 'Questions answered'}</span>
          </article>
          <article className="mini-card">
            <strong>{submitted ? `${savedPercent}%` : `${unansweredCount}`}</strong>
            <span>{submitted ? 'Saved percent' : 'Questions remaining'}</span>
          </article>
          <article className="mini-card">
            <strong>{submitted ? pretest.attemptCount : 'Local only'}</strong>
            <span>{submitted ? 'Saved attempts' : 'Logging mode'}</span>
          </article>
        </div>
        <p>{pretestContent.demoPolicy}</p>
        <div className="tag-row">
          <span className="tag">Latest submission: {formatTimestamp(pretest.submittedAt)}</span>
          {submitted ? <span className="tag">Read-only review</span> : <span className="tag">Editable until submitted</span>}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Question navigator</div>
            <h2>
              Question {currentIndex + 1} of {questions.length}
            </h2>
          </div>
        </div>
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
      </section>

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
            {submitted ? 'Pretest saved' : `Save ${result.percent}% score`}
          </button>
        </div>
      </section>
    </div>
  );
}
