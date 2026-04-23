import { Link, type LinkProps, useLocation } from "react-router-dom";
import { useLocaleStore } from "@/store/locale";

export function LocaleLink({ to, ...props }: LinkProps) {
  const routePrefix = useLocaleStore((s) => s.routePrefix);
  const location = useLocation();

  if (typeof to !== "string") {
    return <Link to={to} {...props} />;
  }

  // already localized
  if (to.startsWith("/en/")) {
    return <Link to={to} {...props} />;
  }

  // external or hash
  if (to.startsWith("http") || to.startsWith("#")) {
    return <Link to={to} {...props} />;
  }

  // no locale yet
  if (!routePrefix) {
    return <Link to={to} {...props} />;
  }

  const next =
    to === "/"
      ? `/en/${routePrefix}`
      : `/en/${routePrefix}${to}`;

  return <Link to={next} {...props} />;
}