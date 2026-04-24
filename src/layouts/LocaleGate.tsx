import { Outlet, useParams, Navigate } from "react-router-dom";
import { validCountries } from "@/lib/validateCountry";

export function LocaleGate(): JSX.Element {
  const { country } = useParams<{ country: string }>();

  const normalized: string | undefined = country?.toLowerCase();

  if (!normalized || !validCountries.has(normalized)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}