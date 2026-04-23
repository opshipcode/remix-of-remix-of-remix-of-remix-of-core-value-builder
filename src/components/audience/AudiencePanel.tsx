import { useState } from "react";
import { ChevronDown, ExternalLink, Plus } from "lucide-react";
import { useKitPageStore, type AgeRange } from "@/store/kitPage";
import { COUNTRIES } from "@/lib/countries";

const AGES: AgeRange[] = ["18-24", "25-34", "35-44", "45+"];

const HELP_KEY = "kp_audience_help_seen";

export function AudiencePanel() {
  const audience = useKitPageStore((s) => s.data.audience);
  const setAudienceSnapshot = useKitPageStore((s) => s.setAudienceSnapshot);

  const [helpOpen, setHelpOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem(HELP_KEY) !== "true";
  });

  const total =
    audience.genderSplit.female +
    audience.genderSplit.male +
    audience.genderSplit.other;
  const genderError = total !== 0 && total !== 100 ? "Must add up to 100%" : "";

  const [secondaryShown, setSecondaryShown] = useState<boolean>(
    !!audience.secondaryCountry,
  );

  const closeHelp = () => {
    setHelpOpen(false);
    try {
      window.localStorage.setItem(HELP_KEY, "true");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-3">
      <HelpAccordion open={helpOpen} onToggle={() => (helpOpen ? closeHelp() : setHelpOpen(true))} />

      {/* Primary age */}
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Primary age range
        </p>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {AGES.map((age) => {
            const active = audience.primaryAge === age;
            return (
              <button
                key={age}
                type="button"
                onClick={() => setAudienceSnapshot({ primaryAge: age })}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  active
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:bg-surface-2"
                }`}
              >
                {age}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender split */}
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Gender split (%)
        </p>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          <NumInput
            label="F"
            value={audience.genderSplit.female}
            onChange={(v) =>
              setAudienceSnapshot({
                genderSplit: { ...audience.genderSplit, female: v },
              })
            }
          />
          <NumInput
            label="M"
            value={audience.genderSplit.male}
            onChange={(v) =>
              setAudienceSnapshot({
                genderSplit: { ...audience.genderSplit, male: v },
              })
            }
          />
          <NumInput
            label="Other"
            value={audience.genderSplit.other}
            onChange={(v) =>
              setAudienceSnapshot({
                genderSplit: { ...audience.genderSplit, other: v },
              })
            }
          />
        </div>
        {genderError && (
          <p className="mt-1 text-[10px] text-destructive">{genderError}</p>
        )}
      </div>

      {/* Top country */}
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Top country
        </p>
        <select
          value={audience.topCountry ?? ""}
          onChange={(e) => setAudienceSnapshot({ topCountry: e.target.value || null })}
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select country</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Secondary country */}
      {secondaryShown ? (
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Secondary country
          </p>
          <select
            value={audience.secondaryCountry ?? ""}
            onChange={(e) =>
              setAudienceSnapshot({ secondaryCountry: e.target.value || null })
            }
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setSecondaryShown(true)}
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <Plus className="h-3 w-3" /> Add secondary country
        </button>
      )}
    </div>
  );
}

function NumInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <span className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <input
        type="number"
        min={0}
        max={100}
        value={value || ""}
        onChange={(e) => onChange(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
        className="mt-0.5 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function HelpAccordion({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const [tab, setTab] = useState<"tiktok" | "instagram" | "youtube">("tiktok");

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-2/40">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium hover:bg-surface-2"
      >
        Where do I find this data?
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="space-y-2 border-t border-border p-3">
          <div className="flex gap-1 rounded-full border border-border bg-background p-1 text-[11px]">
            {(["tiktok", "instagram", "youtube"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 rounded-full px-2 py-1 capitalize transition ${
                  tab === t ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="text-[11px] leading-relaxed text-muted-foreground">
            {tab === "tiktok" && (
              <>
                <p className="font-medium text-foreground">In the app:</p>
                <ol className="ml-4 list-decimal space-y-0.5">
                  <li>Profile → ≡ menu</li>
                  <li>Creator tools → Analytics</li>
                  <li>Open the Followers tab</li>
                </ol>
                <p className="mt-2">
                  Prefer desktop?{" "}
                  <a
                    href="https://analytics.tiktok.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 text-primary hover:underline"
                  >
                    analytics.tiktok.com <ExternalLink className="h-2.5 w-2.5" />
                  </a>{" "}
                  → Followers tab.
                </p>
              </>
            )}
            {tab === "instagram" && (
              <>
                <p className="font-medium text-foreground">In the app:</p>
                <ol className="ml-4 list-decimal space-y-0.5">
                  <li>Profile → Professional dashboard</li>
                  <li>Insights → Total followers</li>
                  <li>Scroll to age, gender, location</li>
                </ol>
                <p className="mt-2">
                  Desktop is limited — use the app for the full breakdown.
                </p>
              </>
            )}
            {tab === "youtube" && (
              <>
                <p className="font-medium text-foreground">Best on desktop:</p>
                <ol className="ml-4 list-decimal space-y-0.5">
                  <li>
                    Open{" "}
                    <a
                      href="https://studio.youtube.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-0.5 text-primary hover:underline"
                    >
                      studio.youtube.com <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </li>
                  <li>Analytics → Audience tab</li>
                </ol>
                <p className="mt-2">Mobile app shows less detail than desktop.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
