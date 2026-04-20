import { describe, expect, it } from 'vitest';

import { createInitialLearnerProgress } from '@/lib/progress';

import {
  buildLearnerLectureProgressRows,
  buildLearnerModuleProgressRows,
  buildLearnerProfileRow,
  buildLearnerProgressSnapshotPayload,
  buildLearnerSnapshotRow,
  hasLearnerProgressActivity,
} from './sync';

describe('supabase sync helpers', () => {
  it('detects whether learner activity is worth syncing', () => {
    const emptyState = createInitialLearnerProgress();
    const activeState = {
      ...emptyState,
      bookmarkedStations: ['4R'],
    };

    expect(hasLearnerProgressActivity(emptyState)).toBe(false);
    expect(hasLearnerProgressActivity(activeState)).toBe(true);
  });

  it('builds app-scoped snapshot payloads', () => {
    const state = {
      ...createInitialLearnerProgress(),
      lastViewedStationId: '7',
    };
    const payload = buildLearnerProgressSnapshotPayload(state, '2026-04-20T12:00:00.000Z');

    expect(payload).toMatchObject({
      schema_version: 1,
      app_code: 'ebus_course',
      course_code: 'socal_ebus_prep',
      source: 'ebus-course-web',
      synced_at: '2026-04-20T12:00:00.000Z',
      state: {
        lastViewedStationId: '7',
      },
    });
  });

  it('builds learner rows for granular table upserts', () => {
    const state = createInitialLearnerProgress();
    state.moduleProgress.knobology.percentComplete = 72;
    state.moduleProgress.knobology.visitedAt = '2026-04-19T10:00:00.000Z';
    state.lectureWatchStatus['lecture-01'] = {
      completed: true,
      watchedSeconds: 540,
      lastOpenedAt: '2026-04-19T10:10:00.000Z',
    };

    const identity = {
      id: 'user-123',
      email: 'fellow@example.com',
    };
    const syncedAt = '2026-04-20T12:00:00.000Z';

    expect(buildLearnerProfileRow(identity, syncedAt)).toMatchObject({
      id: 'user-123',
      email: 'fellow@example.com',
      last_sign_in_at: syncedAt,
      updated_at: syncedAt,
    });

    expect(buildLearnerSnapshotRow(identity, state, syncedAt)).toMatchObject({
      learner_id: 'user-123',
      updated_at: syncedAt,
    });

    expect(buildLearnerModuleProgressRows(identity, state, syncedAt)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          learner_id: 'user-123',
          module_id: 'knobology',
          percent_complete: 72,
          visited_at: '2026-04-19T10:00:00.000Z',
          updated_at: syncedAt,
        }),
      ]),
    );

    expect(buildLearnerLectureProgressRows(identity, state, syncedAt)).toEqual([
      {
        learner_id: 'user-123',
        lecture_id: 'lecture-01',
        watched_seconds: 540,
        completed: true,
        submitted_at: syncedAt,
      },
    ]);
  });
});
