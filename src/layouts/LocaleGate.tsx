import { Outlet, useParams, Navigate } from "react-router-dom";

export function LocaleGate(): JSX.Element {
  const { locale } = useParams<{ locale: string }>();

  const isValid = !!locale && /^[a-z]{2}$/i.test(locale);

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}