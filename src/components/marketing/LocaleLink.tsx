import { Link, type LinkProps, useLocation } from "react-router-dom";
import { useLocaleStore } from "@/store/locale";

export function LocaleLink({ to, ...props }: LinkProps) {
  const routePrefix = useLocaleStore((s) => s.routePrefix);
  
  if (typeof to !== "string") {
    return <Link to={to} {...props} />;
  }

  // Already localized or no locale - don't modify
  if (to.startsWith("/en/") || !routePrefix) {
    return <Link to={to} {...props} />;
  }

  // External, hash, or system routes - don't modify
  if (
    to.startsWith("http") || 
    to.startsWith("#") ||
    to.startsWith("/app") ||
    to.startsWith("/admin") ||
    to.startsWith("/login") ||
    to.startsWith("/signup")
  ) {
    return <Link to={to} {...props} />;
  }

  const next = to === "/" 
    ? `/en/${routePrefix}` 
    : `/en/${routePrefix}${to}`;

  return <Link to={next} {...props} />;
}