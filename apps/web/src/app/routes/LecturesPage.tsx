import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { aabipProceduralVideoLibrary } from '@/content/aabipProceduralVideos';
import { courseInfo } from '@/content/course';
import { lectureManifest } from '@/content/lectures';
import { AabipVideoLibrary } from '@/features/lectures/AabipVideoLibrary';
import { LectureCard } from '@/features/lectures/LectureCard';
import { useCourseAdminSessionActive } from '@/lib/adminSession';
import { getLectureWorkflowStatus, getNextCourseStep } from '@/lib/courseWorkflow';
import { useLearnerProgress } from '@/lib/progress';

const VIDEO_TABS = [
  { id: 'course-videos', label: 'Course Videos' },
  { id: 'aabip-videos', label: 'AABIP Videos' },
] as const;

type VideoTabId = (typeof VIDEO_TABS)[number]['id'];

export function LecturesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, setLectureState, setModuleProgress } = useLearnerProgress();
  const adminSessionActive = useCourseAdminSessionActive();
  const reviewedCount = Object.values(state.lectureWatchStatus).filter((lecture) => lecture.completed).length;
  const activeTab = searchParams.get('tab') === 'aabip-videos' ? 'aabip-videos' : 'course-videos';
  const nextCourseStep = getNextCourseStep(state, { admin: adminSessionActive });

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

  function handleTabChange(nextTab: VideoTabId) {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextTab === 'course-videos') {
      nextSearchParams.delete('tab');
    } else {
      nextSearchParams.set('tab', nextTab);
    }

    setSearchParams(nextSearchParams, { replace: true });
  }

  return (
    <div className="page-stack">
      <section className="section-card">
        <div className="section-card__heading">
          <div>
            <div className="eyebrow">Video library</div>
            <h2>Course videos and additional AABIP viewing</h2>
            <p>Keep the core lecture set separate from the optional procedural playlist while still playing everything inside the app.</p>
          </div>
          <div className="tag-row">
            <span className="tag">{lectureManifest.length} course videos</span>
            <span className="tag">{aabipProceduralVideoLibrary.videos.length} AABIP videos</span>
          </div>
        </div>
        <div aria-label="Video library tabs" className="button-row button-row--wrap" role="tablist">
          {VIDEO_TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                aria-controls={`lectures-panel-${tab.id}`}
                aria-selected={isActive}
                className={`control-pill${isActive ? ' control-pill--active' : ''}`}
                id={`lectures-tab-${tab.id}`}
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                role="tab"
                type="button"
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {activeTab === 'course-videos' ? (
        <div aria-labelledby="lectures-tab-course-videos" id="lectures-panel-course-videos" role="tabpanel">
          <section className="section-card">
            <div className="section-card__heading">
              <div>
                <div className="eyebrow">Lecture manifest</div>
                <h2>Prep window: {courseInfo.prepWindow}</h2>
                <p>
                  Start with the welcome video. The pre-test, post-lecture quizzes, post-test, survey, answers, and
                  certificate unlock in sequence as each required step is completed.
                </p>
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
                <h2>{reviewedCount} of {lectureManifest.length} lectures marked reviewed</h2>
                {nextCourseStep ? <p>Current step: {nextCourseStep.title}</p> : <p>All course steps are complete.</p>}
              </div>
              <div className="tag-row">
                <span className="tag">Core course only</span>
              </div>
            </div>
            <div className="stack-list">
              {lectureManifest.map((lecture) => {
                const workflowStatus = getLectureWorkflowStatus(state, lecture.id, { admin: adminSessionActive });

                return (
                  <LectureCard
                    key={lecture.id}
                    lecture={lecture}
                    locked={!workflowStatus?.unlocked}
                    lockedReason={workflowStatus?.lockedReason}
                    onUpdateWatchState={handleLectureUpdate}
                    watchState={state.lectureWatchStatus[lecture.id]}
                  />
                );
              })}
            </div>
          </section>
        </div>
      ) : (
        <AabipVideoLibrary labelledBy="lectures-tab-aabip-videos" panelId="lectures-panel-aabip-videos" />
      )}
    </div>
  );
}
