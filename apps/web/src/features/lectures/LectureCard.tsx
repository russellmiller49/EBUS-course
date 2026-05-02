import { useEffect, useRef, useState } from 'react';

import type { LectureManifestItem } from '@/content/types';
import { getContinuousWatchDelta, isLecturePlaybackComplete } from '@/features/lectures/watchProgress';
import type { LectureWatchState } from '@/lib/progress';

export function LectureCard({
  lecture,
  watchState,
  locked,
  lockedReason,
  defaultExpanded = false,
  onUpdateWatchState,
}: {
  lecture: LectureManifestItem;
  watchState?: LectureWatchState;
  locked?: boolean;
  lockedReason?: string | null;
  defaultExpanded?: boolean;
  onUpdateWatchState: (
    lectureId: string,
    update: { watchedSeconds?: number; completed?: boolean; opened?: boolean },
  ) => void;
}) {
  const [posterBroken, setPosterBroken] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(
    () => defaultExpanded && !watchState?.lastOpenedAt && !watchState?.completed,
  );
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [lastReportedSecond, setLastReportedSecond] = useState(0);
  const lastMediaTimeRef = useRef<number | null>(null);
  const watchedSecondsRef = useRef(watchState?.watchedSeconds ?? 0);
  const isLocked = locked ?? lecture.status === 'locked';
  const hasPlayableVideo = Boolean(lecture.video || lecture.embedUrl);
  const thumbnailSrc = lecture.thumbnail ?? lecture.poster;

  useEffect(() => {
    if (defaultExpanded && !watchState?.lastOpenedAt && !watchState?.completed && !isLocked) {
      setDetailsExpanded(true);
    }
  }, [defaultExpanded, isLocked, lecture.id, watchState?.completed, watchState?.lastOpenedAt]);

  function handleTogglePlayer() {
    const nextExpanded = !videoExpanded;
    setDetailsExpanded(true);
    setVideoExpanded(nextExpanded);

    if (nextExpanded) {
      onUpdateWatchState(lecture.id, { opened: true });
    } else if (watchState?.lastOpenedAt || watchState?.completed) {
      setDetailsExpanded(false);
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
    setDetailsExpanded(false);
    setVideoExpanded(false);
  }

  return (
    <article className={`lecture-card${isLocked ? ' lecture-card--locked' : ''}${!detailsExpanded ? ' lecture-card--collapsed' : ''}`}>
      <div className="lecture-card__header">
        {thumbnailSrc && !posterBroken ? (
          <img
            alt=""
            aria-hidden="true"
            className="lecture-card__thumb"
            onError={() => setPosterBroken(true)}
            src={thumbnailSrc}
          />
        ) : (
          <div className="lecture-card__thumb lecture-card__thumb--placeholder" aria-hidden="true">
            {lecture.week.replace('Lecture ', '')}
          </div>
        )}
        <div className="lecture-card__title-block">
          <div className="lecture-card__number">{lecture.week}</div>
          <h3>{lecture.title}</h3>
          {detailsExpanded ? <p>{lecture.subtitle}</p> : null}
        </div>
        <div className="lecture-card__meta">
          <span>{lecture.duration}</span>
          <span>{watchState?.completed ? 'Completed' : isLocked ? 'Locked' : 'Ready'}</span>
        </div>
        <button
          aria-expanded={detailsExpanded}
          className="lecture-card__toggle"
          onClick={() => {
            setDetailsExpanded((current) => !current);
            if (detailsExpanded) {
              setVideoExpanded(false);
            }
          }}
          type="button"
        >
          {detailsExpanded ? '⌃' : '⌄'}
        </button>
      </div>

      {detailsExpanded && lecture.poster && !posterBroken ? (
        <div className="lecture-card__media">
          <img
            alt={`${lecture.title} poster`}
            onError={() => setPosterBroken(true)}
            src={lecture.poster}
          />
        </div>
      ) : null}

      {detailsExpanded ? (
        <div className="tag-row">
          {lecture.topics.map((topic) => (
            <span key={topic} className="tag">
              {topic}
            </span>
          ))}
        </div>
      ) : null}

      {detailsExpanded && !isLocked ? (
        <div className="lecture-card__actions">
          {hasPlayableVideo ? (
            <button className="button button--ghost" onClick={handleTogglePlayer} type="button">
              {videoExpanded ? 'Hide player' : 'Open player'}
            </button>
          ) : null}
          {lecture.resourceUrl ? (
            <a
              className="button button--ghost"
              href={lecture.resourceUrl}
              onClick={() => onUpdateWatchState(lecture.id, { opened: true })}
              rel="noreferrer"
              target="_blank"
            >
              {lecture.resourceLabel ?? 'Open resource'}
            </a>
          ) : null}
          {!hasPlayableVideo ? (
            <button
              className="button"
              onClick={() => {
                onUpdateWatchState(lecture.id, {
                  completed: true,
                  opened: true,
                  watchedSeconds: Math.max(watchState?.watchedSeconds ?? 0, 60),
                });
                setDetailsExpanded(false);
              }}
              type="button"
            >
              {watchState?.completed ? 'Completed' : 'Mark reviewed'}
            </button>
          ) : null}
        </div>
      ) : isLocked ? (
        <p className="lecture-card__status">{lockedReason ?? 'Complete the previous course step to unlock this lecture.'}</p>
      ) : null}

      {videoExpanded && detailsExpanded && !isLocked ? (
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
