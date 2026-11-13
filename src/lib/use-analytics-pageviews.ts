import { useEffect } from "react";
import { useLocation } from "react-router";
import { trackPageview } from "./analytics";

/**
 * Sends a `$pageview` on every hash-route change. Must be rendered inside the router.
 */
export function useAnalyticsPageviews(): void {
  const location = useLocation();

  useEffect(() => {
    trackPageview(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);
}
