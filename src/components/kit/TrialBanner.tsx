import { useEffect, useState } from "react";
import { usePlanStore } from "@/store/plan";
import type { PlanLockTarget } from "@/components/ui/button";

type Severity = "low" | "medium" | "high" | "critical" | "grace" | "expired" | "none";

const SEVERITY_STYLES: Record<Exclude<Severity, "none">, string> = {
  low: "bg-warning/15 text-warning border-b-warning/40",
  medium: "bg-orange-500/15 text-orange-500 border-b-orange-500/40 dark:text-orange-300",
  high: "bg-destructive/15 text-destructive border-b-destructive/40",
  critical: "bg-destructive/20 text-destructive border-b-destructive/60 animate-pulse",
  grace: "bg-destructive/25 text-destructive border-b-destructive/70",
  expired: "bg-destructive/30 text-destructive border-b-destructive/80",
};

function fmtCountdown(ms: number): string {
  if (ms <= 0) return "0s";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

function deriveSeverity(
  status: string,
  msLeft: number | null,
): { severity: Severity; daysLeft: number } {
  if (status === "active") return { severity: "none", daysLeft: 0 };
  if (status === "grace_period") return { severity: "grace", daysLeft: 0 };
  if (status === "expired" || status === "trial_expired" || status === "cancelled")
    return { severity: "expired", daysLeft: 0 };
  if (status !== "trialing" || msLeft === null)
    return { severity: "none", daysLeft: 0 };

  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
  if (msLeft <= 6 * 60 * 60 * 1000) return { severity: "critical", daysLeft };
  if (msLeft <= 24 * 60 * 60 * 1000) return { severity: "high", daysLeft };
  if (msLeft <= 3 * 24 * 60 * 60 * 1000) return { severity: "medium", daysLeft };
  return { severity: "low", daysLeft };
}

export function TrialBanner() {
  const { status, trialEndsAt, graceEndsAt } = usePlanStore();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (status === "active") return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [status]);

  if (status === "active") return null;

  const endsAtIso = status === "grace_period" ? graceEndsAt : trialEndsAt;
  const msLeft = endsAtIso ? new Date(endsAtIso).getTime() - now : null;
  const { severity, daysLeft } = deriveSeverity(status, msLeft);

  if (severity === "none") return null;

  const targetPlan: PlanLockTarget = "Creator";
  const handleUpgrade = () => {
    window.dispatchEvent(
      new CustomEvent<{ targetPlan: PlanLockTarget; featureName: string }>(
        "kp:upgrade",
        { detail: { targetPlan, featureName: "your Creator plan" } },
      ),
    );
  };

  let label = "";
  if (severity === "low") label = `${daysLeft} days left in your free Creator trial`;
  else if (severity === "medium")
    label = `${daysLeft} days left — upgrade now to keep your analytics and private pages`;
  else if (severity === "high") label = `Less than 24 hours left in your trial`;
  else if (severity === "critical")
    label = `Trial ends in ${msLeft !== null ? fmtCountdown(msLeft) : "0s"}`;
  else if (severity === "grace")
    label = `Payment issue detected — your access continues for ${msLeft !== null ? fmtCountdown(msLeft) : "0s"}`;
  else if (severity === "expired")
    label = "Trial ended — Upgrade to Creator to restore your features";

  return (
    <div
      role="status"
      className={`flex items-center justify-between gap-3 border-b px-4 py-2 text-xs font-medium ${SEVERITY_STYLES[severity]}`}
    >
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={handleUpgrade}
        className="shrink-0 rounded-full bg-current/10 px-3 py-1 text-[11px] font-semibold text-foreground transition-colors hover:bg-current/20"
      >
        Upgrade →
      </button>
    </div>
  );
}
