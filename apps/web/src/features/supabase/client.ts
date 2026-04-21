import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

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

  browserClient = createBrowserClient(
    courseRuntimeConfig.supabaseUrl!,
    courseRuntimeConfig.supabaseAnonKey!,
  );

  return browserClient;
}
