import { describe, expect, it } from 'vitest';

import { getPersistenceTargetLabel, getSessionStateLabel, getSupabaseSyncSummary } from './SupabaseSyncCard.model';

describe('getSupabaseSyncSummary', () => {
  it('describes offline-first mode when Supabase env is missing', () => {
    expect(
      getSupabaseSyncSummary({
        configured: false,
        hasActivity: false,
        hasSession: false,
        isDirty: false,
        status: 'disabled',
        syncError: null,
      }),
    ).toEqual({
      heading: 'Live learner sync is off',
      detail: 'The course is running in offline-first mode because no browser-safe Supabase env is configured.',
      tags: ['Local only', 'No Supabase env'],
    });
  });

  it('surfaces a local sign-in path when Supabase is configured but no session exists', () => {
    expect(
      getSupabaseSyncSummary({
        configured: true,
        hasActivity: true,
        hasSession: false,
        isDirty: true,
        status: 'signed-out',
        syncError: null,
      }),
    ).toEqual({
      heading: 'Supabase sync is ready for learner sign-in',
      detail:
        'Sign in from this course build or from the host site to attach local progress to a learner account. Until then, progress stays on this device.',
      tags: ['Supabase configured', 'Sign-in required'],
    });
  });

  it('shows sync progress and remote persistence once a learner session exists', () => {
    expect(
      getSupabaseSyncSummary({
        configured: true,
        hasActivity: true,
        hasSession: true,
        isDirty: false,
        status: 'syncing',
        syncError: null,
      }),
    ).toEqual({
      heading: 'Syncing learner progress',
      detail: 'Writing learner profile, progress snapshot, module progress, and lecture progress to the shared Supabase project.',
      tags: ['Session active', 'Sync in progress'],
    });
  });
});

describe('Supabase sync labels', () => {
  it('reports checking-session state before auth finishes bootstrapping', () => {
    expect(
      getSessionStateLabel({
        configured: true,
        hasSession: false,
        status: 'checking-session',
        userEmail: null,
      }),
    ).toBe('Checking session');
  });

  it('keeps signed-out learners on local persistence until they authenticate', () => {
    expect(
      getPersistenceTargetLabel({
        configured: true,
        hasSession: false,
      }),
    ).toBe('Local until sign-in');
  });
});
