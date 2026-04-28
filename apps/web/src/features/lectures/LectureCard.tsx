import { useRef, useState } from 'react';

import type { LectureManifestItem } from '@/content/types';
import { getContinuousWatchDelta, isLecturePlaybackComplete } from '@/features/lectures/watchProgress';
import type { LectureWatchState } from '@/lib/progress';

export function LectureCard({
  lecture,
  watchState,
  locked,
  lockedReason,
  onUpdateWatchState,
}: {
  lecture: LectureManifestItem;
  watchState?: LectureWatchState;
  locked?: boolean;
  lockedReason?: string | null;
  onUpdateWatchState: (
    lectureId: string,
    update: { watchedSeconds?: number; completed?: boolean; opened?: boolean },
  ) => void;
}) {
  const [posterBroken, setPosterBroken] = useState(false);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [lastReportedSecond, setLastReportedSecond] = useState(0);
  const lastMediaTimeRef = useRef<number | null>(null);
  const watchedSecondsRef = useRef(watchState?.watchedSeconds ?? 0);
  const isLocked = locked ?? lecture.status === 'locked';
  const hasPlayableVideo = Boolean(lecture.video || lecture.embedUrl);

  function handleTogglePlayer() {
    const nextExpanded = !videoExpanded;
    setVideoExpanded(nextExpanded);

    if (nextExpanded) {
      onUpdateWatchState(lecture.id, { opened: true });
    }
  }

  function handleVideoTimeUpdate(event: React.SyntheticEvent<HTMLVideoElement>) {
    const element = event.currentTarget;
    const durationSeconds = Number.isFinite(element.duration) ? Math.floor(element.duration) : 0;
    const delta = getContinuousWatchDelta({
      currentTime: element.currentTime,
      lastTime: lastMediaTimeRef.current,
      paused: element.paused,
      playbackRate: element.playbackRate,
    });

    lastMediaTimeRef.current = element.currentTime;
    watchedSecondsRef.current = Math.max(watchedSecondsRef.current, watchState?.watchedSeconds ?? 0) + delta;

    const watchedSeconds = Math.floor(watchedSecondsRef.current);
    const completed = isLecturePlaybackComplete({
      currentTime: element.currentTime,
      durationSeconds,
      watchedSeconds,
    });

    if (watchedSeconds - lastReportedSecond < 15 && !completed) {
      return;
    }

    setLastReportedSecond(watchedSeconds);
    onUpdateWatchState(lecture.id, {
      watchedSeconds,
      completed,
    });
  }

  function handleVideoEnded(event: React.SyntheticEvent<HTMLVideoElement>) {
    const element = event.currentTarget;
    const durationSeconds = Number.isFinite(element.duration) ? Math.floor(element.duration) : 0;
    const delta = getContinuousWatchDelta({
      currentTime: element.currentTime,
      lastTime: lastMediaTimeRef.current,
      paused: false,
      playbackRate: element.playbackRate,
    });
    watchedSecondsRef.current = Math.max(watchedSecondsRef.current, watchState?.watchedSeconds ?? 0) + delta;
    const watchedSeconds = Math.floor(watchedSecondsRef.current);

    onUpdateWatchState(lecture.id, {
      watchedSeconds,
      completed: isLecturePlaybackComplete({
        currentTime: element.currentTime,
        durationSeconds,
        watchedSeconds,
      }),
    });
  }

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
          <span>{watchState?.completed ? 'Completed' : isLocked ? 'Locked' : 'Ready'}</span>
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
          {hasPlayableVideo ? (
            <button className="button button--ghost" onClick={handleTogglePlayer} type="button">
              {videoExpanded ? 'Hide player' : 'Open player'}
            </button>
          ) : null}
          {lecture.resourceUrl ? (
            <a className="button button--ghost" href={lecture.resourceUrl} rel="noreferrer" target="_blank">
              {lecture.resourceLabel ?? 'Open resource'}
            </a>
          ) : null}
          {!hasPlayableVideo ? (
            <button
              className="button"
              onClick={() =>
                onUpdateWatchState(lecture.id, {
                  completed: true,
                  opened: true,
                  watchedSeconds: Math.max(watchState?.watchedSeconds ?? 0, 60),
                })
              }
              type="button"
            >
              {watchState?.completed ? 'Completed' : 'Mark reviewed'}
            </button>
          ) : null}
        </div>
      ) : (
        <p className="lecture-card__status">{lockedReason ?? 'Complete the previous course step to unlock this lecture.'}</p>
      )}

      {videoExpanded && !isLocked ? (
        <div className="lecture-card__player">
          {lecture.embedUrl ? (
            <iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" src={lecture.embedUrl} title={lecture.title} />
          ) : lecture.video ? (
            <video controls onEnded={handleVideoEnded} onTimeUpdate={handleVideoTimeUpdate} preload="metadata" src={lecture.video} />
          ) : (
            <div className="lecture-card__placeholder">
              <strong>Video slot ready</strong>
              <span>{lecture.video ?? 'Add local MP4 or embedUrl in lectures.json'}</span>
            </div>
          )}
        </div>
      ) : null}

      {watchState?.completedAt ? (
        <p className="lecture-card__status">Completed {new Date(watchState.completedAt).toLocaleString()}</p>
      ) : null}
    </article>
  );
}
