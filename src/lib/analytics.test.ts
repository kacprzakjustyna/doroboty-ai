import posthog from "posthog-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { initAnalytics } from "./analytics";

describe("initAnalytics", () => {
  afterEach(() => vi.restoreAllMocks());

  it("does nothing without a project key", () => {
    const init = vi.spyOn(posthog, "init").mockReturnValue(posthog);
    expect(initAnalytics({})).toBe(false);
    expect(initAnalytics({ VITE_PUBLIC_POSTHOG_KEY: "  " })).toBe(false);
    expect(init).not.toHaveBeenCalled();
  });

  it("starts capture with masking and no session replay", () => {
    const init = vi.spyOn(posthog, "init").mockReturnValue(posthog);
    expect(initAnalytics({ VITE_PUBLIC_POSTHOG_KEY: "phc_test" })).toBe(true);
    expect(init).toHaveBeenCalledWith(
      "phc_test",
      expect.objectContaining({
        api_host: "https://eu.i.posthog.com",
        mask_all_text: true,
        disable_session_recording: true,
      }),
    );
  });
});
