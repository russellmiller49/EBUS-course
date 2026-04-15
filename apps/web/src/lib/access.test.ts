import { describe, expect, it } from 'vitest';

import {
  canAccessRoute,
  getLockedRoutePath,
  routeRequiresPretest,
  validatePretestAdminPasscode,
} from '@/lib/access';
import { createInitialLearnerProgress } from '@/lib/progress';

describe('course access helpers', () => {
  it('keeps the home screen outside the pretest gate', () => {
    expect(routeRequiresPretest('home')).toBe(false);
    expect(routeRequiresPretest('pretest')).toBe(false);
    expect(routeRequiresPretest('lectures')).toBe(true);
  });

  it('locks non-pretest modules until the pretest is submitted', () => {
    const state = createInitialLearnerProgress();

    expect(canAccessRoute('lectures', state)).toBe(false);
    expect(getLockedRoutePath('lectures', '/lectures', state)).toBe('/pretest');

    state.pretest.submittedAt = '2026-04-06T10:00:00.000Z';

    expect(canAccessRoute('lectures', state)).toBe(true);
    expect(getLockedRoutePath('lectures', '/lectures', state)).toBe('/lectures');
  });

  it('allows the admin/developer passcode to satisfy the pretest gate', () => {
    const state = createInitialLearnerProgress();

    expect(validatePretestAdminPasscode('EBUS_2026')).toBe(true);
    expect(validatePretestAdminPasscode('wrong')).toBe(false);

    state.pretest.unlockedByPasscodeAt = '2026-04-15T10:00:00.000Z';

    expect(canAccessRoute('knobology', state)).toBe(true);
    expect(getLockedRoutePath('knobology', '/knobology', state)).toBe('/knobology');
  });
});
