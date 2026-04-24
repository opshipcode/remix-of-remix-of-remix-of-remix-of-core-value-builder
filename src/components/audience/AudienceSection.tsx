import type { AudienceSnapshot } from "@/store/kitPage";
import { getCountry } from "@/lib/countries";
import { ShieldCheck, AlertCircle } from "lucide-react";

interface Props {
  audience: AudienceSnapshot;
  variant?: "minimal" | "bold" | "professional";
}

export function AudienceSection({ audience }) {
  const total =
    audience.genderSplit.female + audience.genderSplit.male + audience.genderSplit.other;
  const hasData = !!audience.primaryAge || total > 0 || audience.topCountries.length > 0;
  if (!hasData) return null;

  const genderLabel = total
    ? `${audience.genderSplit.female}% F · ${audience.genderSplit.male}% M · ${audience.genderSplit.other}% Other`
    : "—";

  const topCountriesDisplay = audience.topCountries
    .map((code) => {
      const country = getCountry(code);
      return country ? `${country.flag} ${country.name}` : code;
    })
    .join(" · ") || "—";

  return (
    <div title="Audience">
      <div className="flex items-center gap-2 mb-6 -mt-2">
        {audience.isVerified ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-0.5 text-[11px] text-green-600 dark:text-green-400">
            <ShieldCheck className="h-3 w-3" /> Verified data
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-[11px] text-yellow-600 dark:text-yellow-400">
            <ShieldCheck className="h-3 w-3" /> Self-reported
          </span>
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <Cell label="Primary age" value={audience.primaryAge ?? "—"} />
        <Cell label="Gender split" value={genderLabel} />
        <Cell label="Top markets" value={topCountriesDisplay} />
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}