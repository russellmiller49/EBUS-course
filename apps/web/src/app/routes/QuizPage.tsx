import { useState } from 'react';

import { getQuizQuestions } from '@/content/quiz';
import { QuizCard } from '@/features/quiz/QuizCard';
import { useLearnerProgress } from '@/lib/progress';

type QuizFilter = 'all' | 'knobology' | 'station-map' | 'station-explorer';

export function QuizPage() {
  const { recordQuizResult, setModuleProgress, state } = useLearnerProgress();
  const [filter, setFilter] = useState<QuizFilter>('all');
  const questions = filter === 'all' ? getQuizQuestions() : getQuizQuestions(filter);

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Question bank</div>
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
              {candidate === 'all' ? 'All' : candidate}
            </button>
          ))}
        </div>
      </section>

      <QuizCard
        label={filter === 'all' ? 'Mixed quiz' : `${filter} quiz`}
        onComplete={(result) => {
          recordQuizResult({
            id: `${filter}-${Date.now()}`,
            label: filter === 'all' ? 'Mixed quiz' : `${filter} quiz`,
            moduleId: filter === 'all' ? 'mixed' : filter === 'station-map' ? 'station-map' : filter === 'station-explorer' ? 'station-explorer' : 'knobology',
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
