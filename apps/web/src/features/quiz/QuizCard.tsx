import { useState } from 'react';

import type { QuizQuestionContent } from '@/content/types';
import { calculateQuizResult } from '@/lib/quiz';

export function QuizCard({
  questions,
  label,
  onComplete,
}: {
  questions: QuizQuestionContent[];
  label: string;
  onComplete?: (result: ReturnType<typeof calculateQuizResult>) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | undefined>>({});
  const [completionRecorded, setCompletionRecorded] = useState(false);
  const currentQuestion = questions[currentIndex];
  const result = calculateQuizResult(questions, answers);
  const answeredCurrent = Boolean(currentQuestion && answers[currentQuestion.id]);

  if (questions.length === 0) {
    return null;
  }

  function recordCompletion() {
    if (completionRecorded) {
      return;
    }

    setCompletionRecorded(true);
    onComplete?.(result);
  }

  return (
    <section className="quiz-card">
      <div className="quiz-card__header">
        <div>
          <div className="eyebrow">{label}</div>
          <h2>{currentQuestion.prompt}</h2>
        </div>
        <span className="quiz-card__score">
          {result.correctCount}/{result.answeredCount || questions.length}
        </span>
      </div>

      <div className="quiz-card__progress">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.correctOptionId;

          return (
            <span
              key={question.id}
              className={`quiz-card__progress-pill${
                index === currentIndex
                  ? ' quiz-card__progress-pill--active'
                  : selected
                    ? isCorrect
                      ? ' quiz-card__progress-pill--correct'
                      : ' quiz-card__progress-pill--incorrect'
                    : ''
              }`}
            />
          );
        })}
      </div>

      <div className="quiz-card__question-meta">
        <span>{currentQuestion.type.replace(/-/g, ' ')}</span>
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="stack-list">
        {currentQuestion.options.map((option) => {
          const selected = answers[currentQuestion.id];
          const isThis = selected === option.id;
          const isCorrect = option.id === currentQuestion.correctOptionId;

          return (
            <button
              key={option.id}
              className={`choice-card${
                answeredCurrent
                  ? isCorrect
                    ? ' choice-card--correct'
                    : isThis
                      ? ' choice-card--incorrect'
                      : ''
                  : isThis
                    ? ' choice-card--selected'
                    : ''
              }`}
              onClick={() => {
                if (!answeredCurrent) {
                  setAnswers((current) => ({
                    ...current,
                    [currentQuestion.id]: option.id,
                  }));
                }
              }}
              type="button"
            >
              <strong>{option.label}</strong>
            </button>
          );
        })}
      </div>

      {answeredCurrent ? (
        <div className={`feedback-banner${answers[currentQuestion.id] === currentQuestion.correctOptionId ? ' feedback-banner--success' : ''}`}>
          <strong>{answers[currentQuestion.id] === currentQuestion.correctOptionId ? 'Correct' : 'Review'}</strong>
          <p>{currentQuestion.explanation}</p>
        </div>
      ) : null}

      <div className="button-row">
        <button
          className="button button--ghost"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((index) => index - 1)}
          type="button"
        >
          Previous
        </button>
        {currentIndex < questions.length - 1 ? (
          <button
            className="button"
            disabled={!answeredCurrent}
            onClick={() => setCurrentIndex((index) => index + 1)}
            type="button"
          >
            Next
          </button>
        ) : (
          <button
            className="button"
            disabled={result.answeredCount !== questions.length}
            onClick={recordCompletion}
            type="button"
          >
            {completionRecorded ? 'Attempt saved' : `Save ${result.percent}% score`}
          </button>
        )}
      </div>
    </section>
  );
}
