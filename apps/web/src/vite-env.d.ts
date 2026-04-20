/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_SITE_URL?: string;
  readonly VITE_APP_CODE?: string;
  readonly VITE_COURSE_CODE?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.nrrd?url' {
  const url: string;
  export default url;
}

declare module '*.glb?url' {
  const url: string;
  export default url;
}
