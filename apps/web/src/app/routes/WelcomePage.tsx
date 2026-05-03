import { Link } from 'react-router-dom';

import { welcomeLecture } from '@/content/welcome';
import { LectureCard } from '@/features/lectures/LectureCard';
import { useAuth } from '@/lib/auth';
import { useLearnerProgress } from '@/lib/progress';

export function WelcomePage() {
  const { isSupabaseEnabled, user } = useAuth();
  const { setLectureState, state } = useLearnerProgress();
  const welcomeComplete = Boolean(state.lectureWatchStatus[welcomeLecture.id]?.completed);

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
          <Link className="button" to="/pretest">
            {welcomeComplete ? 'Continue to pre-course survey and test' : 'Open pre-course flow'}
          </Link>
        </div>
      </section>

      <LectureCard
        defaultExpanded
        lecture={welcomeLecture}
        onUpdateWatchState={(lectureId, update) => setLectureState(lectureId, update)}
        readyLabel="Opened"
        watchState={state.lectureWatchStatus[welcomeLecture.id]}
      />
    </div>
  );
}
