import type { LearnerProgressState } from '@/lib/progress';
import { courseRuntimeConfig } from '@/lib/runtime';

export interface LearnerIdentity {
  id: string;
  email?: string | null;
}

export interface LearnerProgressSnapshotPayload {
  schema_version: 1;
  app_code: string;
  course_code: string;
  source: 'ebus-course-web';
  synced_at: string;
  state: LearnerProgressState;
}

export function hasLearnerProgressActivity(state: LearnerProgressState): boolean {
  return (
    Object.values(state.moduleProgress).some(
      (progress) => progress.percentComplete > 0 || progress.visitedAt !== null || progress.completedAt !== null,
    ) ||
    state.bookmarkedStations.length > 0 ||
    Object.keys(state.stationRecognitionStats).length > 0 ||
    Object.keys(state.lectureWatchStatus).length > 0 ||
    state.quizScoreHistory.length > 0 ||
    Object.keys(state.pretest.answers).length > 0 ||
    state.pretest.submittedAt !== null ||
    state.lastViewedStationId !== null ||
    state.lastUsedKnobologyControl !== null
  );
}

export function buildLearnerProgressSnapshotPayload(
  state: LearnerProgressState,
  syncedAt: string,
): LearnerProgressSnapshotPayload {
  return {
    schema_version: 1,
    app_code: courseRuntimeConfig.appCode,
    course_code: courseRuntimeConfig.courseCode,
    source: 'ebus-course-web',
    synced_at: syncedAt,
    state,
  };
}

export function buildLearnerProfileRow(identity: LearnerIdentity, syncedAt: string) {
  return {
    id: identity.id,
    email: identity.email ?? null,
    last_sign_in_at: syncedAt,
    updated_at: syncedAt,
  };
}

export function buildLearnerSnapshotRow(identity: LearnerIdentity, state: LearnerProgressState, syncedAt: string) {
  return {
    learner_id: identity.id,
    payload: buildLearnerProgressSnapshotPayload(state, syncedAt),
    updated_at: syncedAt,
  };
}

export function buildLearnerModuleProgressRows(identity: LearnerIdentity, state: LearnerProgressState, syncedAt: string) {
  return Object.entries(state.moduleProgress).map(([moduleId, progress]) => ({
    learner_id: identity.id,
    module_id: moduleId,
    percent_complete: Math.round(progress.percentComplete),
    visited_at: progress.visitedAt,
    completed_at: progress.completedAt,
    updated_at: syncedAt,
  }));
}

export function buildLearnerLectureProgressRows(
  identity: LearnerIdentity,
  state: LearnerProgressState,
  syncedAt: string,
) {
  return Object.entries(state.lectureWatchStatus).map(([lectureId, progress]) => ({
    learner_id: identity.id,
    lecture_id: lectureId,
    watched_seconds: progress.watchedSeconds,
    completed: progress.completed,
    completed_at: progress.completed ? syncedAt : null,
    last_opened_at: progress.lastOpenedAt,
    updated_at: syncedAt,
  }));
}

export function buildLearnerPretestAttemptRows(
  identity: LearnerIdentity,
  state: LearnerProgressState,
  syncedAt: string,
) {
  if (!state.pretest.submittedAt || state.pretest.attemptCount < 1) {
    return [];
  }

  const totalQuestions = state.pretest.totalQuestions;
  const score = state.pretest.score ?? 0;
  const percent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return [
    {
      learner_id: identity.id,
      attempt_number: state.pretest.attemptCount,
      score,
      answered_count: state.pretest.answeredCount,
      total_questions: totalQuestions,
      percent,
      answers: state.pretest.answers,
      submitted_at: state.pretest.submittedAt,
      created_at: syncedAt,
    },
  ];
}
