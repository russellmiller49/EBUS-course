import { describe, expect, it } from 'vitest';

import { courseAssessments } from '@/content/courseAssessments';
import { lectureManifest } from '@/content/lectures';
import {
  getAssessmentWorkflowStatus,
  getCourseStepModels,
  getLectureWorkflowStatus,
  getNextCourseStep,
  isCoursePretestUnlocked,
} from '@/lib/courseWorkflow';
import { createInitialLearnerProgress, learnerProgressReducer } from '@/lib/progress';

describe('courseWorkflow', () => {
  it('starts with lecture 1 unlocked and the pre-test locked', () => {
    const state = createInitialLearnerProgress();
    const steps = getCourseStepModels(state);

    expect(steps.find((step) => step.id === 'lecture-01')?.unlocked).toBe(true);
    expect(steps.find((step) => step.id === 'pretest')?.unlocked).toBe(false);
    expect(isCoursePretestUnlocked(state)).toBe(false);
    expect(getNextCourseStep(state)?.id).toBe('lecture-01');
  });

  it('unlocks the pre-test after the welcome video and lecture 2 after pre-test submission', () => {
    const afterIntro = learnerProgressReducer(createInitialLearnerProgress(), {
      type: 'setLectureState',
      lectureId: 'lecture-01',
      completed: true,
      watchedSeconds: 120,
    });

    expect(isCoursePretestUnlocked(afterIntro)).toBe(true);
    expect(getCourseStepModels(afterIntro).find((step) => step.id === 'pretest')?.unlocked).toBe(true);

    const afterPretest = learnerProgressReducer(afterIntro, {
      type: 'submitPretest',
      score: 16,
      answeredCount: 20,
      totalQuestions: 20,
    });

    expect(getCourseStepModels(afterPretest).find((step) => step.id === 'lecture-02')?.unlocked).toBe(true);
  });

  it('requires a post-lecture quiz before unlocking the next lecture', () => {
    const state = createInitialLearnerProgress();
    state.pretest.submittedAt = '2026-04-10T10:00:00.000Z';
    state.lectureWatchStatus['lecture-02'] = {
      completed: true,
      completedAt: '2026-04-10T11:00:00.000Z',
      watchedSeconds: 600,
      lastOpenedAt: '2026-04-10T10:30:00.000Z',
    };

    expect(getCourseStepModels(state).find((step) => step.id === 'post-lecture-02')?.unlocked).toBe(true);
    expect(getCourseStepModels(state).find((step) => step.id === 'lecture-03')?.unlocked).toBe(false);

    const afterQuiz = learnerProgressReducer(state, {
      type: 'recordCourseAssessmentResult',
      assessmentId: 'post-lecture-02',
      correctCount: 5,
      totalCount: 5,
      percent: 100,
    });

    expect(getCourseStepModels(afterQuiz).find((step) => step.id === 'lecture-03')?.unlocked).toBe(true);
  });

  it('unlocks post-test answers and certificate after the survey', () => {
    const state = createInitialLearnerProgress();
    state.pretest.submittedAt = '2026-04-10T10:00:00.000Z';

    for (const lecture of lectureManifest) {
      state.lectureWatchStatus[lecture.id] = {
        completed: true,
        completedAt: '2026-04-12T11:00:00.000Z',
        watchedSeconds: 600,
        lastOpenedAt: '2026-04-12T10:30:00.000Z',
      };
    }

    for (const assessment of courseAssessments) {
      state.courseAssessmentResults[assessment.id] = {
        completedAt: '2026-04-12T12:00:00.000Z',
        correctCount: assessment.questions.length,
        totalCount: assessment.questions.length,
        percent: 100,
        attemptCount: 1,
      };
    }

    expect(getCourseStepModels(state).find((step) => step.id === 'post-course-survey')?.unlocked).toBe(true);
    expect(getCourseStepModels(state).find((step) => step.id === 'post-test-answers')?.unlocked).toBe(false);

    state.courseSurvey.submittedAt = '2026-04-12T12:15:00.000Z';

    expect(getCourseStepModels(state).find((step) => step.id === 'post-test-answers')?.unlocked).toBe(true);
    expect(getCourseStepModels(state).find((step) => step.id === 'certificate')?.unlocked).toBe(true);
  });

  it('unlocks the full course workflow for admin preview without marking steps complete', () => {
    const state = createInitialLearnerProgress();
    const steps = getCourseStepModels(state, { admin: true });

    expect(steps.every((step) => step.unlocked)).toBe(true);
    expect(steps.find((step) => step.id === 'pretest')?.completed).toBe(false);
    expect(steps.find((step) => step.id === 'post-test-answers')?.lockedReason).toBeNull();
    expect(getNextCourseStep(state, { admin: true })?.id).toBe('lecture-01');
    expect(getLectureWorkflowStatus(state, 'lecture-20', { admin: true })?.unlocked).toBe(true);
    expect(getAssessmentWorkflowStatus(state, courseAssessments[0]!, { admin: true })?.unlocked).toBe(true);
  });
});
