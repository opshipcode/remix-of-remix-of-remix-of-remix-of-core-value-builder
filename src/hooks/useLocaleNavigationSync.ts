// hooks/useLocaleNavigationSync.ts
import { useEffect, useRef } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { useLocaleStore, type LocaleState } from "@/store/locale";
import { LOCALIZED_ROUTES } from "@/lib/localizedRoutes";

type PathString = string;

const LOCALE_SESSION_KEY = "kp_locale_active";

export function useLocaleNavigationSync(): void {
  const location: Location = useLocation();
  const navigate = useNavigate();

  const { routePrefix, detected, hydrated, forcedUSD } = useLocaleStore(
    (s: LocaleState) => s
  );

  const isProcessing = useRef<boolean>(false);
  const lastProcessedPath = useRef<PathString>("");

  useEffect(() => {
    if (!hydrated || !detected || !routePrefix || forcedUSD) return;
    if (isProcessing.current) return;

    const currentPath: PathString = location.pathname;

    // Prevent duplicate processing
    if (lastProcessedPath.current === currentPath) return;

    const localePrefix: PathString = `/en/${routePrefix}`;
    const isOnLocalePath: boolean = currentPath.startsWith(localePrefix);

    // If user is on /en/{country}/* path, mark locale session as active
    if (isOnLocalePath) {
      try {
        sessionStorage.setItem(LOCALE_SESSION_KEY, routePrefix);
      } catch {
        // ignore storage errors
      }
      lastProcessedPath.current = currentPath;
      return;
    }

    // Check if locale session is active
    let localeSessionActive = false;
    try {
      const stored: string | null = sessionStorage.getItem(LOCALE_SESSION_KEY);
      localeSessionActive = stored === routePrefix;
    } catch {
      // ignore storage errors
    }

    // If locale session is NOT active, don't interfere
    if (!localeSessionActive) {
      lastProcessedPath.current = currentPath;
      return;
    }

    // System routes - never localize
    const systemRoutes: PathString[] = [
      "/app",
      "/admin",
      "/review",
      "/share",
      "/watch",
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/onboarding",
    ];

    if (systemRoutes.some((route: PathString) => currentPath.startsWith(route))) {
      lastProcessedPath.current = currentPath;
      return;
    }

    // Check if it's a marketing path
    const pathWithoutParams: PathString = currentPath.split("?")[0] ?? currentPath;
    const segments: string[] = currentPath.split("/").filter(Boolean);

    const isMarketingPath: boolean = Array.from(LOCALIZED_ROUTES).some(
      (route: string) =>
        pathWithoutParams === route || pathWithoutParams.startsWith(`${route}/`)
    );

    // Slug routes (single segment, not marketing) - don't localize
    if (segments.length === 1 && !isMarketingPath) {
      lastProcessedPath.current = currentPath;
      return;
    }

    // Not a marketing path - don't localize
    if (!isMarketingPath) {
      lastProcessedPath.current = currentPath;
      return;
    }

    // We're in locale session mode + user navigated to non-localized marketing path
    // Rewrite it to maintain locale prefix
    isProcessing.current = true;

    const localizedPath: PathString =
      currentPath === "/" ? localePrefix : `${localePrefix}${currentPath}`;

    lastProcessedPath.current = localizedPath;

    // Use replace to avoid breaking back button and animations
    navigate(localizedPath, { replace: true });

    // Reset processing flag
    requestAnimationFrame(() => {
      isProcessing.current = false;
    });

  }, [
    location.pathname,
    routePrefix,
    detected,
    hydrated,
    forcedUSD,
    navigate,
  ]);
}