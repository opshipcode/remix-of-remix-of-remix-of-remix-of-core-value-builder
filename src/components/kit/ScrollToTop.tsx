import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Auto-scrolls to top of the window AND any scrollable [data-scroll-root] element
 * on every route change.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.querySelectorAll<HTMLElement>("[data-scroll-root]").forEach((el) => {
      el.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [pathname]);
  return null;
}
