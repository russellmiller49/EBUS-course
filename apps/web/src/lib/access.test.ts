import { describe, expect, it } from 'vitest';

import {
  canAccessRoute,
  getLockedRoutePath,
  getRouteLockReason,
  isCourseAdminSessionActive,
  routeRequiresPretest,
  validateCourseAdminPasscode,
  validatePretestAdminPasscode,
} from '@/lib/access';
import { createInitialLearnerProgress } from '@/lib/progress';

function createAdminStorage(passcode: string) {
  return {
    getItem: () => passcode,
    removeItem: () => undefined,
    setItem: () => undefined,
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

  it('unlocks the pretest after the welcome lecture and locks practice modules until pretest submission', () => {
    const state = createInitialLearnerProgress();

    expect(canAccessRoute('lectures', state)).toBe(true);
    expect(canAccessRoute('sponsors', state)).toBe(true);
    expect(canAccessRoute('pretest', state)).toBe(false);
    expect(getLockedRoutePath('pretest', '/pretest', state)).toBe('/lectures');
    expect(canAccessRoute('knobology', state)).toBe(false);

    state.lectureWatchStatus['lecture-01'] = {
      completed: true,
      completedAt: '2026-04-06T09:00:00.000Z',
      watchedSeconds: 60,
      lastOpenedAt: '2026-04-06T09:00:00.000Z',
    };

    expect(canAccessRoute('pretest', state)).toBe(true);
    expect(getLockedRoutePath('knobology', '/knobology', state)).toBe('/pretest');

    state.pretest.submittedAt = '2026-04-06T10:00:00.000Z';

    expect(canAccessRoute('knobology', state)).toBe(true);
    expect(getLockedRoutePath('knobology', '/knobology', state)).toBe('/knobology');
  });

  it('allows the admin/developer passcode to satisfy the pretest gate', () => {
    const state = createInitialLearnerProgress();

    expect(validatePretestAdminPasscode('EBUS_2026')).toBe(true);
    expect(validateCourseAdminPasscode('EBUS_2026')).toBe(true);
    expect(validatePretestAdminPasscode('wrong')).toBe(false);

    state.pretest.unlockedByPasscodeAt = '2026-04-15T10:00:00.000Z';

    expect(canAccessRoute('knobology', state)).toBe(true);
    expect(getLockedRoutePath('knobology', '/knobology', state)).toBe('/knobology');
  });

  it('opens every route while the course admin session is active', () => {
    const state = createInitialLearnerProgress();

    expect(isCourseAdminSessionActive(createAdminStorage('EBUS_2026'))).toBe(true);
    expect(isCourseAdminSessionActive(createAdminStorage('wrong'))).toBe(false);
    expect(canAccessRoute('pretest', state, { admin: true })).toBe(true);
    expect(canAccessRoute('quiz', state, { admin: true })).toBe(true);
    expect(getLockedRoutePath('quiz', '/quiz', state, { admin: true })).toBe('/quiz');
    expect(getRouteLockReason('quiz', state, { admin: true })).toBeNull();
  });
});
