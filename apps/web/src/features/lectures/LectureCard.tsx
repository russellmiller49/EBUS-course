import { useState } from 'react';

import type { LectureManifestItem } from '@/content/types';
import type { LectureWatchState } from '@/lib/progress';

export function LectureCard({
  lecture,
  watchState,
  onMarkReviewed,
}: {
  lecture: LectureManifestItem;
  watchState?: LectureWatchState;
  onMarkReviewed: (lectureId: string) => void;
}) {
  const [posterBroken, setPosterBroken] = useState(false);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const isLocked = lecture.status === 'locked';

  return (
    <article className={`lecture-card${isLocked ? ' lecture-card--locked' : ''}`}>
      <div className="lecture-card__header">
        <div>
          <div className="eyebrow">{lecture.week}</div>
          <h3>{lecture.title}</h3>
          <p>{lecture.subtitle}</p>
        </div>
        <div className="lecture-card__meta">
          <span>{lecture.duration}</span>
          <span>{watchState?.completed ? 'Reviewed' : isLocked ? 'Locked' : 'Ready'}</span>
        </div>
      </div>

      <div className="lecture-card__media">
        {lecture.poster && !posterBroken ? (
          <img
            alt={`${lecture.title} poster`}
            onError={() => setPosterBroken(true)}
            src={lecture.poster}
          />
        ) : (
          <div className="lecture-card__placeholder">
            <strong>Poster slot ready</strong>
            <span>{lecture.poster ?? 'Add poster path in lectures.json'}</span>
          </div>
        )}
      </div>

      <div className="tag-row">
        {lecture.topics.map((topic) => (
          <span key={topic} className="tag">
            {topic}
          </span>
        ))}
      </div>

      {!isLocked ? (
        <div className="lecture-card__actions">
          <button className="button button--ghost" onClick={() => setVideoExpanded((current) => !current)} type="button">
            {videoExpanded ? 'Hide player' : 'Open player'}
          </button>
          <button className="button" onClick={() => onMarkReviewed(lecture.id)} type="button">
            {watchState?.completed ? 'Reviewed' : 'Mark reviewed'}
          </button>
        </div>
      ) : null}

      {videoExpanded && !isLocked ? (
        <div className="lecture-card__player">
          {lecture.embedUrl ? (
            <iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" src={lecture.embedUrl} title={lecture.title} />
          ) : lecture.video ? (
            <video controls preload="metadata" src={lecture.video} />
          ) : (
            <div className="lecture-card__placeholder">
              <strong>Video slot ready</strong>
              <span>{lecture.video ?? 'Add local MP4 or embedUrl in lectures.json'}</span>
            </div>
          )}
        </div>
      ) : null}
    </article>
  );
}
