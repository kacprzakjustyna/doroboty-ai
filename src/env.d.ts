/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** PostHog public project key (`phc_...`). Analytics stay off when absent. */
  readonly VITE_PUBLIC_POSTHOG_KEY?: string;
  /** PostHog ingestion host. Defaults to PostHog Cloud EU. */
  readonly VITE_PUBLIC_POSTHOG_HOST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
