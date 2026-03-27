import { courseInfo } from '@/content/course';
import { lectureManifest } from '@/content/lectures';
import { LectureCard } from '@/features/lectures/LectureCard';
import { useLearnerProgress } from '@/lib/progress';

export function LecturesPage() {
  const { state, setLectureState, setModuleProgress } = useLearnerProgress();
  const reviewedCount = Object.values(state.lectureWatchStatus).filter((lecture) => lecture.completed).length;

  function handleMarkReviewed(lectureId: string) {
    const nextReviewedCount =
      reviewedCount + (state.lectureWatchStatus[lectureId]?.completed ? 0 : 1);

    setLectureState(lectureId, { completed: true, watchedSeconds: 60 });
    setModuleProgress(
      'lectures',
      Math.round((nextReviewedCount / lectureManifest.length) * 100),
      nextReviewedCount >= lectureManifest.length,
    );
  }

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
              onMarkReviewed={handleMarkReviewed}
              watchState={state.lectureWatchStatus[lecture.id]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
