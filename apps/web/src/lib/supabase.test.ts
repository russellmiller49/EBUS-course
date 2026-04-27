import { describe, expect, it } from 'vitest';

import { buildAuthCallbackUrl, buildSharedAuthCallbackUrl, getBrowserAuthCallbackMode } from '@/lib/supabase';

describe('Supabase auth URL helpers', () => {
  it('builds password recovery callbacks at the app base URL', () => {
    expect(buildAuthCallbackUrl('https://course.example.edu/socal-ebus-course/app', 'reset-password')).toBe(
      'https://course.example.edu/socal-ebus-course/app/?authMode=reset-password',
    );
  });

  it('builds shared website callbacks for the EBUS app', () => {
    expect(buildSharedAuthCallbackUrl('https://interventionalpulm.org/auth/callback', 'reset-password')).toBe(
      'https://interventionalpulm.org/auth/callback?app=socal-ebus-course&authMode=reset-password',
    );
  });

  it('does not report a browser callback mode in non-browser tests', () => {
    expect(getBrowserAuthCallbackMode()).toBeNull();
  });
});
