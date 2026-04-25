import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const { useSupabaseSyncMock } = vi.hoisted(() => ({
  useSupabaseSyncMock: vi.fn(),
}));

vi.mock('@/features/supabase/SupabaseSyncProvider', () => ({
  useSupabaseSync: useSupabaseSyncMock,
}));

import { TopHeader } from './TopHeader';

describe('TopHeader', () => {
  it('shows a learner sign-in CTA when Supabase is configured but no session exists', () => {
    useSupabaseSyncMock.mockReturnValue({
      configured: true,
      hasActivity: false,
      hasSession: false,
      isDirty: false,
      lastSyncedAt: null,
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      status: 'signed-out',
      syncError: null,
      syncNow: vi.fn(),
      userEmail: null,
    });

    const html = renderToStaticMarkup(<TopHeader />);

    expect(html).toContain('Supabase sync ready');
    expect(html).toContain('Learner sign in');
  });

  it('shows the active learner email and sign-out control when a session exists', () => {
    useSupabaseSyncMock.mockReturnValue({
      configured: true,
      hasActivity: true,
      hasSession: true,
      isDirty: false,
      lastSyncedAt: '2026-04-21T00:00:00.000Z',
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      status: 'ready',
      syncError: null,
      syncNow: vi.fn(),
      userEmail: 'learner@example.com',
    });

    const html = renderToStaticMarkup(<TopHeader />);

    expect(html).toContain('learner@example.com');
    expect(html).toContain('Sign out');
  });
});
