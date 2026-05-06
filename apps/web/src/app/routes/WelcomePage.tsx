import { Link } from 'react-router-dom';

import { welcomeLecture } from '@/content/welcome';
import { LectureCard } from '@/features/lectures/LectureCard';
import { useAuth } from '@/lib/auth';
import { useLearnerProgress } from '@/lib/progress';

export function WelcomePage() {
  const { isSupabaseEnabled, user } = useAuth();
  const { setLectureState, state } = useLearnerProgress();
  const welcomeWatchState = state.lectureWatchStatus[welcomeLecture.id];
  const welcomeComplete = Boolean(welcomeWatchState?.completed);

  return (
    <div className="page-stack">
      <section className="hero-card welcome-hero">
        <div className="eyebrow">Welcome</div>
        <h2>Start here before account setup, survey, and the baseline pre-test.</h2>
        <p>
          Review the welcome and course orientation first. Once it is marked reviewed, the pre-course survey and test
          flow opens in the next tab.
        </p>
        <div className="tag-row">
          <span className="tag">{welcomeComplete ? 'Welcome complete' : 'First required step'}</span>
          <span className="tag">{isSupabaseEnabled && !user ? 'Account next' : 'Survey next'}</span>
        </div>
        <div className="button-row button-row--wrap">
          {welcomeLecture.resourceUrl ? (
            <a
              className="button"
              href={welcomeLecture.resourceUrl}
              onClick={() => setLectureState(welcomeLecture.id, { opened: true, quizReady: true })}
              rel="noreferrer"
              target="_blank"
            >
              {welcomeLecture.resourceLabel ?? 'Open welcome resource'}
            </a>
          ) : null}
          <button
            className="button button--ghost"
            disabled={welcomeComplete}
            onClick={() =>
              setLectureState(welcomeLecture.id, {
                completed: true,
                opened: true,
                quizReady: true,
                watchedSeconds: Math.max(welcomeWatchState?.watchedSeconds ?? 0, 60),
              })
            }
            type="button"
          >
            {welcomeComplete ? 'Welcome reviewed' : 'Mark welcome reviewed'}
          </button>
          <Link className="button" to="/pretest">
            {welcomeComplete ? 'Continue to pre-course survey and test' : 'Open pre-course flow'}
          </Link>
        </div>
      </section>

      <LectureCard
        defaultExpanded
        defaultPlayerExpanded
        lecture={welcomeLecture}
        onUpdateWatchState={(lectureId, update) => setLectureState(lectureId, update)}
        readyLabel="Opened"
        watchState={welcomeWatchState}
      />
    </div>
  );
}
