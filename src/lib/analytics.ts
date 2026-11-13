import posthog from "posthog-js";

type AnalyticsEnv = Record<string, string | boolean | undefined> & {
  VITE_PUBLIC_POSTHOG_KEY?: string;
  VITE_PUBLIC_POSTHOG_HOST?: string;
};

/**
 * Starts PostHog browser event capture only when a project key is configured.
 * Without VITE_PUBLIC_POSTHOG_KEY (local dev, tests, participant packages) nothing is sent.
 * Element text and attributes are masked and session replay stays off, so private free
 * text typed into the prototype is never sent.
 */
export function initAnalytics(env: AnalyticsEnv = import.meta.env): boolean {
  const key = env.VITE_PUBLIC_POSTHOG_KEY?.trim();
  if (!key) return false;

  posthog.init(key, {
    api_host: env.VITE_PUBLIC_POSTHOG_HOST?.trim() || "https://eu.i.posthog.com",
    defaults: "2025-05-24",
    capture_pageview: "history_change",
    autocapture: true,
    mask_all_text: true,
    mask_all_element_attributes: true,
    disable_session_recording: true,
    person_profiles: "identified_only",
  });
  return true;
}
