import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { courseRuntimeConfig } from '@/lib/runtime';

let browserClient: SupabaseClient | null | undefined;

export function hasSupabaseBrowserConfig() {
  return Boolean(courseRuntimeConfig.supabaseUrl && courseRuntimeConfig.supabaseAnonKey);
}

export function getSupabaseBrowserClient() {
  if (browserClient !== undefined) {
    return browserClient;
  }

  if (!hasSupabaseBrowserConfig()) {
    browserClient = null;
    return browserClient;
  }

  browserClient = createClient(courseRuntimeConfig.supabaseUrl!, courseRuntimeConfig.supabaseAnonKey!, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  });

  return browserClient;
}
