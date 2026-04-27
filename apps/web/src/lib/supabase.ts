import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null | undefined;

export type AuthCallbackMode = 'sign-in' | 'reset-password';

const COURSE_AUTH_CALLBACK_APP = 'socal-ebus-course';

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
  const basePath = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/+$/, '');

  if (configured) {
    const normalized = configured.replace(/\/+$/, '');

    if (!basePath) {
      return normalized;
    }

    try {
      const configuredUrl = new URL(normalized);

      if (configuredUrl.pathname === '' || configuredUrl.pathname === '/') {
        return `${configuredUrl.origin}${basePath}`;
      }
    } catch {
      return normalized;
    }

    return normalized;
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${basePath}`;
  }

  return '';
}

export function buildAuthCallbackUrl(siteUrl: string, mode: AuthCallbackMode) {
  if (!siteUrl) {
    return '';
  }

  const url = new URL(`${siteUrl}/`);
  url.searchParams.set('authMode', mode);

  return url.toString();
}

export function buildSharedAuthCallbackUrl(callbackUrl: string, mode: AuthCallbackMode) {
  if (!callbackUrl) {
    return '';
  }

  const url = new URL(callbackUrl);

  if (!url.searchParams.has('app')) {
    url.searchParams.set('app', COURSE_AUTH_CALLBACK_APP);
  }

  url.searchParams.set('authMode', mode);

  return url.toString();
}

export function getAuthCallbackUrl(mode: AuthCallbackMode) {
  const sharedCallbackUrl = import.meta.env.VITE_SUPABASE_AUTH_CALLBACK_URL?.trim();

  if (sharedCallbackUrl) {
    return buildSharedAuthCallbackUrl(sharedCallbackUrl, mode);
  }

  return buildAuthCallbackUrl(getSiteUrl(), mode);
}

export function getBrowserAuthCallbackMode(): AuthCallbackMode | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const mode = new URLSearchParams(window.location.search).get('authMode');

  return mode === 'sign-in' || mode === 'reset-password' ? mode : null;
}
