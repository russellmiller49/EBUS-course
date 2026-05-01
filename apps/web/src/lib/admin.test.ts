import { describe, expect, it } from 'vitest';

import {
  buildAdminProgressSummary,
  getLearnerAverageProgress,
  normalizeAdminLearnerOverview,
  type AdminLearnerOverview,
} from '@/lib/admin';

function createLearner(overrides: Partial<AdminLearnerOverview> = {}): AdminLearnerOverview {
  return {
    id: 'learner-1',
    email: 'learner@example.edu',
    fullName: 'Learner One',
    degree: 'MD',
    institution: 'Training Program',
    institutionalEmail: 'learner@example.edu',
    fellowshipYear: 'first',
    flexibleBronchoscopyCount: 0,
    ebusCount: 0,
    ebusConfidence: 'moderate',
    approvalStatus: 'pending',
    approvedAt: null,
    approvedBy: null,
    inviteSentAt: null,
    lastSignInAt: null,
    onboardingCompletedAt: null,
    createdAt: null,
    updatedAt: null,
    snapshotUpdatedAt: null,
    pretestPercent: null,
    pretestSubmittedAt: null,
    pretestAnswers: [],
    postTestAnswers: [],
    totalTimeSpentSeconds: 0,
    moduleProgress: [],
    lectureSummary: {
      completedCount: 0,
      totalWatchedSeconds: 0,
      lastOpenedAt: null,
    },
    ...overrides,
  };
}

describe('admin learner overview helpers', () => {
  it('normalizes RPC rows into dashboard-friendly learner records', () => {
    const learner = normalizeAdminLearnerOverview({
      learner_id: 'learner-1',
      email: 'learner@example.edu',
      full_name: 'Learner One',
      approval_status: 'approved',
      pretest_percent: 86,
      pretest_answers: {
        'pretest-01': 'd',
      },
      assessment_results: {
        'post-test': {
          answers: [
            {
              questionId: 'post-test-q01',
              selectedOptionIds: ['a'],
              correctOptionIds: ['a'],
              isCorrect: true,
            },
          ],
        },
      },
      total_time_spent_seconds: 1200,
      module_progress: [
        {
          moduleId: 'knobology',
          percentComplete: 125,
          visitedAt: '2026-04-20T10:00:00.000Z',
          completedAt: null,
          timeSpentSeconds: 300,
        },
      ],
      lecture_summary: {
        completedCount: 3,
        totalWatchedSeconds: 900,
        lastOpenedAt: '2026-04-21T10:00:00.000Z',
      },
    });

    expect(learner.approvalStatus).toBe('approved');
    expect(learner.pretestPercent).toBe(86);
    expect(learner.pretestAnswers[0]).toMatchObject({
      questionId: 'pretest-01',
      isCorrect: true,
      selectedOptionIds: ['d'],
      correctOptionIds: ['d'],
    });
    expect(learner.postTestAnswers[0]).toMatchObject({
      questionId: 'post-test-q01',
      isCorrect: true,
      selectedOptionIds: ['a'],
      correctOptionIds: ['a'],
    });
    expect(learner.totalTimeSpentSeconds).toBe(1200);
    expect(learner.moduleProgress[0]).toMatchObject({
      moduleId: 'knobology',
      percentComplete: 100,
      timeSpentSeconds: 300,
    });
    expect(learner.lectureSummary.completedCount).toBe(3);
  });

  it('summarizes learner approval counts and average progress', () => {
    const pending = createLearner({
      moduleProgress: [
        { moduleId: 'pretest', percentComplete: 50, visitedAt: null, completedAt: null, timeSpentSeconds: 0 },
      ],
    });
    const approved = createLearner({
      id: 'learner-2',
      approvalStatus: 'approved',
      moduleProgress: [
        { moduleId: 'pretest', percentComplete: 100, visitedAt: null, completedAt: null, timeSpentSeconds: 0 },
        { moduleId: 'lectures', percentComplete: 80, visitedAt: null, completedAt: null, timeSpentSeconds: 0 },
      ],
    });

    expect(getLearnerAverageProgress(approved)).toBe(90);
    expect(buildAdminProgressSummary([pending, approved])).toEqual({
      approvedCount: 1,
      averageProgressPercent: 70,
      pendingCount: 1,
      totalLearners: 2,
    });
  });
});
