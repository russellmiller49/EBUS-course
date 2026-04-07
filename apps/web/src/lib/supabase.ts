import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null | undefined;

function resolveSupabaseUrl() {
  const directUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || import.meta.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (directUrl) {
    return directUrl;
  }

  const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_REF?.trim() || import.meta.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF?.trim();

  return projectRef ? `https://${projectRef}.supabase.co` : '';
}

function resolveSupabaseAnonKey() {
  return import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';
}

export function isSupabaseConfigured() {
  return Boolean(resolveSupabaseUrl() && resolveSupabaseAnonKey());
}

export function getSupabaseBrowserClient() {
  if (typeof window === 'undefined' || !isSupabaseConfigured()) {
    return null;
  }

  if (browserClient) {
    return browserClient;
  }

  browserClient = createClient(resolveSupabaseUrl(), resolveSupabaseAnonKey(), {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  });

  return browserClient;
}

export function getSiteUrl() {
  const configured = import.meta.env.VITE_SITE_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return '';
}
