import type { AudienceSnapshot } from "@/store/kitPage";
import { getCountry } from "@/lib/countries";
import { ShieldCheck, AlertCircle } from "lucide-react";

interface Props {
  audience: AudienceSnapshot;
  variant?: "minimal" | "bold" | "professional";
}

export function AudienceSection({ audience, variant = "minimal" }: Props) {
  const total =
    audience.genderSplit.female + audience.genderSplit.male + audience.genderSplit.other;
  const hasData = !!audience.primaryAge || total > 0 || !!audience.topCountry;
  if (!hasData) return null;

  const top = getCountry(audience.topCountry);
  const sec = getCountry(audience.secondaryCountry);
  const genderLabel = total
    ? `${audience.genderSplit.female}% F · ${audience.genderSplit.male}% M · ${audience.genderSplit.other}% Other`
    : "—";

  const wrapper =
    variant === "bold"
      ? "px-8 py-12 md:px-16 md:py-16 bg-surface/40"
      : variant === "professional"
        ? "border-b border-border px-8 py-10 md:px-16"
        : "border-y border-border px-8 py-10 md:px-16";

  return (
    <section className={wrapper}>
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="kp-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Audience
          </h2>
          {audience.isVerified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] text-success">
              <ShieldCheck className="h-3 w-3" /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-0.5 text-[11px] text-warning">
              <AlertCircle className="h-3 w-3" /> Self-reported
            </span>
          )}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Cell label="Primary age" value={audience.primaryAge ?? "—"} />
          <Cell label="Gender split" value={genderLabel} />
          <Cell
            label="Top markets"
            value={
              top
                ? `${top.flag} ${top.name}${sec ? ` · ${sec.flag} ${sec.name}` : ""}`
                : "—"
            }
          />
        </div>
      </div>
    </section>
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
