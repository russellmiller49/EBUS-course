import { Link } from 'react-router-dom';

import { courseInfo } from '@/content/course';
import { useAuth } from '@/lib/auth';
import { isPretestComplete } from '@/lib/access';
import { useLearnerProgress } from '@/lib/progress';

export function TopHeader() {
  const { isSupabaseEnabled, profile, signOut, user } = useAuth();
  const { state } = useLearnerProgress();
  const pretestReady = isPretestComplete(state);

  return (
    <header className="top-header">
      <div className="top-header__identity">
        <div className="top-header__mark" aria-hidden="true">
          📡
        </div>
        <div>
          <div className="eyebrow">SoCal EBUS 2026</div>
          <h1 className="top-header__title">Fellow Prep</h1>
          <p className="top-header__subtitle">{courseInfo.hostLine}</p>
        </div>
      </div>
      <div className="top-header__meta">
        <span>{courseInfo.dateLabel}</span>
        <span>{courseInfo.venueName}</span>
        <span>{pretestReady ? 'Modules unlocked' : 'Pretest unlock required'}</span>
        {isSupabaseEnabled ? (
          <>
            <span>{profile?.fullName || user?.email || profile?.email || 'Signed out'}</span>
            {user ? (
              <div className="top-header__actions">
                <Link className="button button--ghost top-header__action" to="/account">
                  Account
                </Link>
                <button className="button button--ghost top-header__action" onClick={() => void signOut()} type="button">
                  Sign out
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <span>Local mode</span>
        )}
      </div>
    </header>
  );
}
