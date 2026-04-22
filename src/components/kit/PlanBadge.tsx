import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, Clock, Zap, AlertTriangle, X } from "lucide-react";
import { usePlanStore, type SubscriptionStatus, type PlanTier } from "@/store/plan";
import type { PlanLockTarget } from "@/components/ui/button";

function fmtCountdown(ms: number): string {
  if (ms <= 0) return "0s";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h >= 24) {
    const d = Math.floor(h / 24);
    const remH = h % 24;
    return remH > 0 ? `${d}d ${remH}h` : `${d}d`;
  }
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

function dispatchUpgrade(target: PlanLockTarget, featureName: string): void {
  window.dispatchEvent(
    new CustomEvent<{ targetPlan: PlanLockTarget; featureName: string }>(
      "kp:upgrade",
      { detail: { targetPlan: target, featureName } },
    ),
  );
}

export function PlanBadge(): JSX.Element | null {
  const navigate = useNavigate();
  const { status, plan, trialEndsAt, graceEndsAt } = usePlanStore();
  const [now, setNow] = useState<number>(() => Date.now());

  // Determine end timestamp
  const endsAtIso: string | null =
    status === "grace_period" ? graceEndsAt : trialEndsAt;
  const msLeft: number | null = endsAtIso
    ? new Date(endsAtIso).getTime() - now
    : null;

  // Decide tick interval — 1s only when critical/grace, else 60s
  const isCritical: boolean =
    status === "trialing" && msLeft !== null && msLeft <= 6 * 60 * 60 * 1000;
  const isGrace: boolean = status === "grace_period";

  useEffect(() => {
    if (status === "active" && (plan === "Creator" || plan === "Pro")) return;
    const interval = isCritical || isGrace ? 1000 : 60_000;
    const id = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(id);
  }, [status, plan, isCritical, isGrace]);

  return renderBadge(status, plan, msLeft, navigate);
}

function renderBadge(
  status: SubscriptionStatus,
  plan: PlanTier,
  msLeft: number | null,
  navigate: ReturnType<typeof useNavigate>,
): JSX.Element | null {
  // Active paid plans → no badge
  if (status === "active" && (plan === "Creator" || plan === "Pro")) return null;

  // Active Free → subtle Upgrade
  if (status === "active" && plan === "Free") {
    return (
      <BadgeShell
        onClick={() => dispatchUpgrade("Creator", "more features")}
        className="bg-muted text-muted-foreground hover:bg-muted/80"
        icon={<ArrowUp className="h-3 w-3" />}
        label="Upgrade"
      />
    );
  }

  // Trialing
  if (status === "trialing" && msLeft !== null) {
    if (msLeft <= 6 * 60 * 60 * 1000) {
      return (
        <BadgeShell
          onClick={() => dispatchUpgrade("Creator", "your Creator trial")}
          className="border border-destructive/50 bg-destructive/20 text-destructive"
          icon={<span className="h-2 w-2 rounded-full bg-destructive" />}
          label={fmtCountdown(msLeft)}
        />
      );
    }
    if (msLeft <= 24 * 60 * 60 * 1000) {
      const hours = Math.max(1, Math.ceil(msLeft / (60 * 60 * 1000)));
      return (
        <BadgeShell
          onClick={() => dispatchUpgrade("Creator", "your Creator trial")}
          className="border border-destructive/40 bg-destructive/15 text-destructive"
          icon={<span className="h-2 w-2 rounded-full bg-destructive" />}
          label={`${hours}h left`}
        />
      );
    }
    const days = Math.ceil(msLeft / (24 * 60 * 60 * 1000));
    if (days <= 3) {
      return (
        <BadgeShell
          onClick={() => dispatchUpgrade("Creator", "your Creator trial")}
          className="border border-orange-400/40 bg-orange-400/15 text-orange-500 animate-[pulse_2.4s_ease-in-out_infinite] dark:text-orange-300"
          icon={<Zap className="h-3 w-3" />}
          label={`${days} day${days === 1 ? "" : "s"} left`}
        />
      );
    }
    return (
      <BadgeShell
        onClick={() => dispatchUpgrade("Creator", "your Creator trial")}
        className="border border-warning/40 bg-warning/15 text-warning"
        icon={<Clock className="h-3 w-3" />}
        label={`${days} days left`}
      />
    );
  }

  // Grace
  if (status === "grace_period" && msLeft !== null) {
    return (
      <BadgeShell
        onClick={() => navigate("/app/settings/billing")}
        className="border border-destructive/50 bg-destructive/20 text-destructive shadow-[0_0_10px_hsl(var(--warning)/0.4)]"
        icon={<AlertTriangle className="h-3 w-3" />}
        label={fmtCountdown(msLeft)}
      />
    );
  }

  // Expired states
  if (status === "trial_expired" || status === "expired") {
    return (
      <BadgeShell
        onClick={() => dispatchUpgrade("Creator", "your Creator plan")}
        className="border border-destructive/40 bg-destructive/30 text-destructive"
        icon={<X className="h-3 w-3" />}
        label="Trial ended"
      />
    );
  }

  if (status === "cancelled") {
    return (
      <BadgeShell
        onClick={() => dispatchUpgrade("Creator", "your Creator plan")}
        className="bg-muted text-muted-foreground hover:bg-muted/80"
        icon={<ArrowUp className="h-3 w-3" />}
        label="Resubscribe"
      />
    );
  }

  return null;
}

interface BadgeShellProps {
  onClick: () => void;
  className: string;
  icon: JSX.Element;
  label: string;
}
function BadgeShell({ onClick, className, icon, label }: BadgeShellProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-90 ${className}`}
      aria-label={label}
    >
      {icon}
      <span className="kp-mono">{label}</span>
    </button>
  );
}