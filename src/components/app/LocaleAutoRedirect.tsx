import { useEffect, useRef } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { useLocaleStore, type LocaleState } from "@/store/locale";
import { LOCALIZED_ROUTES } from "@/lib/localizedRoutes";

type PathString = string;

const LOCALE_SESSION_KEY = "kp_locale_active";

export function LocaleAutoRedirect(): null {
  const location: Location = useLocation();
  const navigate = useNavigate();

  const { routePrefix, detected, hydrated, forcedUSD } = useLocaleStore(
    (s: LocaleState) => s
  );

  const hasInitialized = useRef<boolean>(false);
  const isProcessing = useRef<boolean>(false);

  // INITIAL LOAD ONLY - runs once
  useEffect(() => {
    if (hasInitialized.current) return;
    if (!hydrated || !detected || !routePrefix || forcedUSD) return;

    hasInitialized.current = true;

    const currentPath: PathString = location.pathname;
    const localePrefix: PathString = `/en/${routePrefix}`;

    // Already on localized path - activate session
    if (currentPath.startsWith(localePrefix)) {
      try {
        sessionStorage.setItem(LOCALE_SESSION_KEY, routePrefix);
      } catch {
        // ignore
      }
      return;
    }

    // Check if this is a marketing path that should be localized on initial load
    const pathWithoutParams: PathString = currentPath.split("?")[0] ?? currentPath;
    const segments: string[] = currentPath.split("/").filter(Boolean);

    const isMarketingPath: boolean = Array.from(LOCALIZED_ROUTES).some(
      (route: string) =>
        pathWithoutParams === route || pathWithoutParams.startsWith(`${route}/`)
    );

    // System routes - never localize
    if (
      currentPath.startsWith("/app") ||
      currentPath.startsWith("/admin") ||
      currentPath.startsWith("/login") ||
      currentPath.startsWith("/signup") ||
      currentPath.startsWith("/forgot-password") ||
      currentPath.startsWith("/reset-password") ||
      currentPath.startsWith("/onboarding") ||
      currentPath.startsWith("/review") ||
      currentPath.startsWith("/share") ||
      currentPath.startsWith("/watch")
    ) {
      return;
    }

    // Slug routes - never localize
    if (segments.length === 1 && !isMarketingPath) {
      return;
    }

    // Not a marketing path - don't localize
    if (!isMarketingPath) return;

    // Initial load on marketing path - localize it and activate session
    const localizedPath: PathString =
      currentPath === "/" ? localePrefix : `${localePrefix}${currentPath}`;

    try {
      sessionStorage.setItem(LOCALE_SESSION_KEY, routePrefix);
    } catch {
      // ignore
    }

    navigate(localizedPath, { replace: true });

  }, [hydrated, detected, routePrefix, forcedUSD, location.pathname, navigate]);

  // SUBSEQUENT NAVIGATION - maintains locale session
  useEffect(() => {
    if (!hasInitialized.current) return; // Wait for initial load
    if (!hydrated || !detected || !routePrefix || forcedUSD) return;
    if (isProcessing.current) return;

    const currentPath: PathString = location.pathname;
    const localePrefix: PathString = `/en/${routePrefix}`;

    // Already on localized path
    if (currentPath.startsWith(localePrefix)) {
      return;
    }

    // Check if locale session is active
    let localeSessionActive = false;
    try {
      const stored: string | null = sessionStorage.getItem(LOCALE_SESSION_KEY);
      localeSessionActive = stored === routePrefix;
    } catch {
      // ignore
    }

    // Locale session not active - don't interfere
    if (!localeSessionActive) return;

    // System routes - never localize
    if (
      currentPath.startsWith("/app") ||
      currentPath.startsWith("/admin") ||
      currentPath.startsWith("/login") ||
      currentPath.startsWith("/signup") ||
      currentPath.startsWith("/forgot-password") ||
      currentPath.startsWith("/reset-password") ||
      currentPath.startsWith("/onboarding") ||
      currentPath.startsWith("/review") ||
      currentPath.startsWith("/share") ||
      currentPath.startsWith("/watch")
    ) {
      return;
    }

    // Check if marketing path
    const pathWithoutParams: PathString = currentPath.split("?")[0] ?? currentPath;
    const segments: string[] = currentPath.split("/").filter(Boolean);

    const isMarketingPath: boolean = Array.from(LOCALIZED_ROUTES).some(
      (route: string) =>
        pathWithoutParams === route || pathWithoutParams.startsWith(`${route}/`)
    );

    // Slug routes - don't localize
    if (segments.length === 1 && !isMarketingPath) {
      return;
    }

    // Not marketing - don't localize
    if (!isMarketingPath) return;

    // Localize the path
    isProcessing.current = true;

    const localizedPath: PathString =
      currentPath === "/" ? localePrefix : `${localePrefix}${currentPath}`;

    navigate(localizedPath, { replace: true });

    // Reset flag after navigation completes
    requestAnimationFrame(() => {
      isProcessing.current = false;
    });

  }, [location.pathname, hydrated, detected, routePrefix, forcedUSD, navigate]);

  return null;
}