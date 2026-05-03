import { describe, expect, it } from 'vitest';

import {
  canAccessRoute,
  clearCourseAdminPasscode,
  getLockedRoutePath,
  getRouteLockReason,
  isCourseAdminSessionActive,
  isCourseVendorSessionActive,
  routeRequiresPretest,
  validateCourseAdminPasscode,
  validateCourseVendorPasscode,
  validatePretestAdminPasscode,
} from '@/lib/access';
import { createInitialLearnerProgress } from '@/lib/progress';

function createAdminStorage(passcode: string) {
  let storedPasscode = passcode;

  return {
    getItem: () => storedPasscode,
    removeItem: () => {
      storedPasscode = '';
    },
    setItem: (_key: string, value: string) => {
      storedPasscode = value;
    },
  };
}

describe('course access helpers', () => {
  it('keeps the home screen outside the pretest gate', () => {
    expect(routeRequiresPretest('home')).toBe(false);
    expect(routeRequiresPretest('sponsors')).toBe(false);
    expect(routeRequiresPretest('admin')).toBe(false);
    expect(routeRequiresPretest('pretest')).toBe(false);
    expect(routeRequiresPretest('lectures')).toBe(false);
    expect(routeRequiresPretest('knobology')).toBe(true);
  });

  it('unlocks the pre-course flow after welcome and locks practice modules until their lecture quiz', () => {
    const state = createInitialLearnerProgress();

    expect(canAccessRoute('lectures', state)).toBe(true);
    expect(canAccessRoute('sponsors', state)).toBe(true);
    expect(canAccessRoute('pretest', state)).toBe(false);
    expect(getLockedRoutePath('pretest', '/pretest', state)).toBe('/');
    expect(canAccessRoute('knobology', state)).toBe(false);

    state.lectureWatchStatus['lecture-01'] = {
      completed: true,
      completedAt: '2026-04-06T09:00:00.000Z',
      durationSeconds: 60,
      lastOpenedAt: '2026-04-06T09:00:00.000Z',
      lastPositionSeconds: 60,
      quizUnlockedAt: '2026-04-06T09:00:00.000Z',
      watchedSeconds: 60,
    };

    expect(canAccessRoute('pretest', state)).toBe(true);
    expect(getLockedRoutePath('knobology', '/knobology', state)).toBe('/pretest');

    state.preCourseSurvey.submittedAt = '2026-04-06T09:30:00.000Z';
    state.pretest.submittedAt = '2026-04-06T10:00:00.000Z';

    expect(canAccessRoute('knobology', state)).toBe(false);
    expect(getLockedRoutePath('knobology', '/knobology', state)).toBe('/lectures');

    state.courseAssessmentResults['post-lecture-02'] = {
      completedAt: '2026-04-06T11:00:00.000Z',
      correctCount: 5,
      totalCount: 5,
      percent: 100,
      attemptCount: 1,
      answers: [],
    };

    expect(canAccessRoute('knobology', state)).toBe(true);
  });

  it('allows the admin/developer passcode to satisfy the pretest gate', () => {
    const state = createInitialLearnerProgress();

    expect(validatePretestAdminPasscode('EBUS_2026')).toBe(true);
    expect(validateCourseAdminPasscode('EBUS_2026')).toBe(true);
    expect(validatePretestAdminPasscode('wrong')).toBe(false);

    state.pretest.unlockedByPasscodeAt = '2026-04-15T10:00:00.000Z';

    expect(canAccessRoute('pretest', state)).toBe(true);
    expect(canAccessRoute('knobology', state)).toBe(false);
  });

  it('opens every route while the course admin session is active', () => {
    const state = createInitialLearnerProgress();

    expect(isCourseAdminSessionActive(createAdminStorage('EBUS_2026'))).toBe(true);
    expect(isCourseAdminSessionActive(createAdminStorage('wrong'))).toBe(false);
    expect(canAccessRoute('pretest', state, { admin: true })).toBe(true);
    expect(canAccessRoute('simulator', state, { admin: true })).toBe(true);
    expect(getLockedRoutePath('simulator', '/simulator', state, { admin: true })).toBe('/simulator');
    expect(getRouteLockReason('simulator', state, { admin: true })).toBeNull();
  });

  it('clears the course admin browser session when the admin logs out', () => {
    const storage = createAdminStorage('EBUS_2026');

    expect(isCourseAdminSessionActive(storage)).toBe(true);

    clearCourseAdminPasscode(storage);

    expect(isCourseAdminSessionActive(storage)).toBe(false);
  });

  it('unlocks learning routes for vendor preview without activating admin access', () => {
    const state = createInitialLearnerProgress();

    expect(validateCourseVendorPasscode('SoCal_EBUS_Sponsor')).toBe(true);
    expect(validateCourseVendorPasscode('EBUS_2026')).toBe(false);
    expect(isCourseVendorSessionActive(createAdminStorage('SoCal_EBUS_Sponsor'))).toBe(true);
    expect(isCourseAdminSessionActive(createAdminStorage('SoCal_EBUS_Sponsor'))).toBe(false);
    expect(canAccessRoute('pretest', state, { preview: true })).toBe(true);
    expect(canAccessRoute('simulator', state, { preview: true })).toBe(true);
    expect(getLockedRoutePath('simulator', '/simulator', state, { preview: true })).toBe('/simulator');
    expect(getRouteLockReason('simulator', state, { preview: true })).toBeNull();
  });
});
