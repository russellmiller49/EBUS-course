const DEFAULT_APP_CODE = 'ebus_course';
const DEFAULT_COURSE_CODE = 'socal_ebus_prep';
const LEGACY_LEARNER_PROGRESS_STORAGE_KEY = 'socal-ebus-prep.web.learner-progress';

function readOptionalEnvValue(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function readConfigCode(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function getLearnerProgressStorageKeys(options?: {
  appCode?: string | null;
  courseCode?: string | null;
}): string[] {
  const appCode = readConfigCode(options?.appCode ?? undefined, DEFAULT_APP_CODE);
  const courseCode = readConfigCode(options?.courseCode ?? undefined, DEFAULT_COURSE_CODE);
  const primaryKey = `${appCode}.${courseCode}.web.learner-progress`;

  return primaryKey === LEGACY_LEARNER_PROGRESS_STORAGE_KEY
    ? [primaryKey]
    : [primaryKey, LEGACY_LEARNER_PROGRESS_STORAGE_KEY];
}

const learnerProgressStorageKeys = getLearnerProgressStorageKeys({
  appCode: import.meta.env.VITE_APP_CODE,
  courseCode: import.meta.env.VITE_COURSE_CODE,
});

export const courseRuntimeConfig = {
  appCode: readConfigCode(import.meta.env.VITE_APP_CODE, DEFAULT_APP_CODE),
  courseCode: readConfigCode(import.meta.env.VITE_COURSE_CODE, DEFAULT_COURSE_CODE),
  publicSiteUrl: readOptionalEnvValue(import.meta.env.VITE_PUBLIC_SITE_URL),
  supabaseUrl: readOptionalEnvValue(import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: readOptionalEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY),
  learnerProgressStorageKey: learnerProgressStorageKeys[0],
  legacyLearnerProgressStorageKeys: learnerProgressStorageKeys.slice(1),
} as const;
