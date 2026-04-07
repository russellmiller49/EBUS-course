import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase';

export interface LearnerProfile {
  id: string;
  email: string | null;
  inviteSentAt: string | null;
  lastSignInAt: string | null;
  mustSetPassword: boolean;
  onboardingCompletedAt: string | null;
}

interface AuthContextValue {
  isLoading: boolean;
  isSupabaseEnabled: boolean;
  profile: LearnerProfile | null;
  session: Session | null;
  user: User | null;
  completePasswordSetup: (password: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapProfile(raw: Record<string, unknown> | null): LearnerProfile | null {
  if (!raw) {
    return null;
  }

  return {
    id: typeof raw.id === 'string' ? raw.id : '',
    email: typeof raw.email === 'string' ? raw.email : null,
    inviteSentAt: typeof raw.invite_sent_at === 'string' ? raw.invite_sent_at : null,
    lastSignInAt: typeof raw.last_sign_in_at === 'string' ? raw.last_sign_in_at : null,
    mustSetPassword: raw.must_set_password === true,
    onboardingCompletedAt: typeof raw.onboarding_completed_at === 'string' ? raw.onboarding_completed_at : null,
  };
}

async function upsertLearnerProfile(
  patch: {
    id: string;
    email: string | null;
    last_sign_in_at: string;
    must_set_password?: boolean;
    onboarding_completed_at?: string;
  },
) {
  const client = getSupabaseBrowserClient();

  if (!client) {
    throw new Error('Supabase is not configured for this environment.');
  }

  const { error } = await client.from('learner_profiles').upsert(patch, { onConflict: 'id' });

  if (error) {
    throw error;
  }

  return client;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const isSupabaseEnabled = isSupabaseConfigured();

  const refreshProfile = useCallback(async () => {
    const client = getSupabaseBrowserClient();

    if (!client) {
      setProfile(null);
      return;
    }

    const currentUser = (await client.auth.getUser()).data.user;

    if (!currentUser) {
      setProfile(null);
      return;
    }

    await upsertLearnerProfile(
      {
        id: currentUser.id,
        email: currentUser.email ?? null,
        last_sign_in_at: new Date().toISOString(),
      },
    );

    const { data, error } = await client
      .from('learner_profiles')
      .select('id, email, invite_sent_at, last_sign_in_at, must_set_password, onboarding_completed_at')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    setProfile(mapProfile(data as Record<string, unknown> | null));
  }, []);

  useEffect(() => {
    const nextClient = getSupabaseBrowserClient();

    if (!nextClient) {
      setIsLoading(false);
      return;
    }

    const client = nextClient;

    let active = true;

    async function bootstrapSession() {
      const {
        data: { session: nextSession },
      } = await client.auth.getSession();

      if (!active) {
        return;
      }

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        try {
          await refreshProfile();
        } catch {
          if (active) {
            setProfile(null);
          }
        } finally {
          if (active) {
            setIsLoading(false);
          }
        }
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    }

    void bootstrapSession();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      void refreshProfile()
        .catch(() => {
          // Keep the session active even if profile refresh fails.
        })
        .finally(() => {
          setIsLoading(false);
        });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [refreshProfile]);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const client = getSupabaseBrowserClient();

    if (!client) {
      throw new Error('Supabase is not configured for this environment.');
    }

    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  }, []);

  const completePasswordSetup = useCallback(
    async (password: string) => {
      const client = getSupabaseBrowserClient();

      if (!client || !user) {
        throw new Error('No signed-in learner session is available.');
      }

      const { error: updateError } = await client.auth.updateUser({ password });

      if (updateError) {
        throw updateError;
      }

      await upsertLearnerProfile(
        {
          id: user.id,
          email: user.email ?? null,
          last_sign_in_at: new Date().toISOString(),
          must_set_password: false,
          onboarding_completed_at: new Date().toISOString(),
        },
      );

      await refreshProfile();
    },
    [refreshProfile, user],
  );

  const signOut = useCallback(async () => {
    const client = getSupabaseBrowserClient();

    if (!client) {
      return;
    }

    await client.auth.signOut();
    setProfile(null);
    setSession(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoading,
      isSupabaseEnabled,
      profile,
      session,
      user,
      completePasswordSetup,
      refreshProfile,
      signInWithPassword,
      signOut,
    }),
    [completePasswordSetup, isLoading, isSupabaseEnabled, profile, refreshProfile, session, signInWithPassword, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
