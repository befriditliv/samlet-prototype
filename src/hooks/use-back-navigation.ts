import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Returns a back handler that goes back in browser history when there is a
 * previous in-app entry, and otherwise falls back to a safe route.
 * Handles direct links and hard refreshes (where history has no in-app entry).
 */
export function useBackNavigation(fallback: string = "/manager") {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    const hasInAppHistory = location.key !== "default" && window.history.length > 1;
    if (hasInAppHistory) {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  }, [navigate, location.key, fallback]);
}
