/**
 * PostHog product analytics for the DoRoboty.ai prototype.
 *
 * Collection is client-side only and stays off until `VITE_PUBLIC_POSTHOG_KEY` is set, so the
 * prototype runs unchanged without a PostHog project.
 *
 * Privacy decisions, required by AGENTS.md ("never log private free text"):
 * - session replay is disabled, because it would film CV and answer fields;
 * - the shared `Input` and `Textarea` primitives carry `data-ph-no-autocapture`, which PostHog's
 *   default `css_selector_ignorelist` honours;
 * - person profiles stay `identified_only` and the prototype never calls `identify`, so events
 *   are anonymous. Role selection here is a simulation, not an identity.
 */
import posthog from "posthog-js";

const projectKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY?.trim() ?? "";
const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST?.trim() || "https://eu.i.posthog.com";

let active = false;

/** Module-level so React StrictMode's double-invoked effects cannot send a pageview twice. */
let lastRoute: string | null = null;

/** Names used by the prototype. Kept narrow so a typo fails type-checking instead of ingestion. */
export type PrototypeEvent =
  "job_viewed" | "apply_clicked" | "filter_used" | "application_submitted";

export type EventProperties = Record<string, string | number | boolean | null | undefined>;

export function isAnalyticsActive(): boolean {
  return active;
}

export function initAnalytics(): void {
  if (active || typeof window === "undefined") return;

  if (!projectKey) {
    if (import.meta.env.DEV) {
      console.info("[analytics] PostHog is off: VITE_PUBLIC_POSTHOG_KEY is not set.");
    }
    return;
  }

  posthog.init(projectKey, {
    api_host: apiHost,
    // Autocapture records clicks, form submissions and changes without manual instrumentation.
    autocapture: true,
    // Left unset on purpose: PostHog then ignores `.ph-no-autocapture` and
    // `[data-ph-no-autocapture]` by default. Supplying a custom list would replace those.
    // css_selector_ignorelist: undefined,
    //
    // Hash routing: `history_change` is documented for history-API path changes only, not for
    // `#/...`, so pageviews are sent from `useAnalyticsPageviews` instead.
    capture_pageview: false,
    capture_pageleave: true,
    // Replay would capture candidate free text visually.
    disable_session_recording: true,
    disable_surveys: true,
    person_profiles: "identified_only",
  });

  // Marks every event as prototype traffic built on synthetic data.
  posthog.register({ app: "doroboty-prototype", data_source: "synthetic-demo" });

  active = true;
}

export function trackEvent(event: PrototypeEvent, properties?: EventProperties): void {
  if (!active) return;
  posthog.capture(event, properties);
}

export function trackPageview(route: string): void {
  if (!active) return;
  if (route === lastRoute) return;
  lastRoute = route;
  posthog.capture("$pageview", { $current_url: window.location.href, route });
}
