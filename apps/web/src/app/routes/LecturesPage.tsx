import { useCallback } from 'react';

import { courseInfo } from '@/content/course';
import { lectureManifest } from '@/content/lectures';
import { LectureCard } from '@/features/lectures/LectureCard';
import { useLearnerProgress } from '@/lib/progress';

export function LecturesPage() {
  const { state, setLectureState, setModuleProgress } = useLearnerProgress();
  const reviewedCount = Object.values(state.lectureWatchStatus).filter((lecture) => lecture.completed).length;

  const handleLectureUpdate = useCallback(
    (lectureId: string, update: { watchedSeconds?: number; completed?: boolean; opened?: boolean }) => {
      const wasCompleted = state.lectureWatchStatus[lectureId]?.completed ?? false;
      const nextReviewedCount = reviewedCount + (!wasCompleted && update.completed ? 1 : 0);

      setLectureState(lectureId, update);

      if (update.completed) {
        setModuleProgress(
          'lectures',
          Math.round((nextReviewedCount / lectureManifest.length) * 100),
          nextReviewedCount >= lectureManifest.length,
        );
      }
    },
    [reviewedCount, setLectureState, setModuleProgress, state.lectureWatchStatus],
  );

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Lecture manifest</div>
            <h2>Prep window: {courseInfo.prepWindow}</h2>
          </div>
        </div>
        <div className="mini-card-grid">
          {courseInfo.prepTopics.map((topic) => (
            <article key={topic} className="mini-card">
              <p>{topic}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Progress</div>
            <h2>{reviewedCount} lectures marked reviewed</h2>
          </div>
        </div>
        <div className="stack-list">
          {lectureManifest.map((lecture) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              onUpdateWatchState={handleLectureUpdate}
              watchState={state.lectureWatchStatus[lecture.id]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
