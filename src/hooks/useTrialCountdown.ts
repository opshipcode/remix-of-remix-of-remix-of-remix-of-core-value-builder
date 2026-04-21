import { useEffect, useState } from "react";
import { usePlanStore, type SubscriptionStatus } from "@/store/plan";

export type TrialUrgency =
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "grace"
  | "expired"
  | "none";

export interface TrialCountdownResult {
  label: string;
  urgency: TrialUrgency;
  isLive: boolean;
  msLeft: number | null;
  showBanner: boolean;
}

function fmt(ms: number): string {
  if (ms <= 0) return "0s";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  return `${m}m ${sec}s`;
}

function deriveUrgency(
  status: SubscriptionStatus,
  msLeft: number | null,
): TrialUrgency {
  if (status === "active") return "none";
  if (status === "grace_period") return "grace";
  if (status === "expired" || status === "cancelled" || status === "trial_expired")
    return "expired";
  if (status !== "trialing" || msLeft === null) return "none";
  if (msLeft <= 6 * 60 * 60 * 1000) return "critical";
  if (msLeft <= 24 * 60 * 60 * 1000) return "high";
  if (msLeft <= 3 * 24 * 60 * 60 * 1000) return "medium";
  return "low";
}

export function useTrialCountdown(): TrialCountdownResult {
  const { status, trialEndsAt, graceEndsAt } = usePlanStore();
  const [now, setNow] = useState<number>(() => Date.now());

  const endsAtIso =
    status === "grace_period" ? graceEndsAt : trialEndsAt;
  const msLeft = endsAtIso ? new Date(endsAtIso).getTime() - now : null;
  const urgency = deriveUrgency(status, msLeft);
  const isLive = urgency === "critical" || urgency === "grace";

  useEffect(() => {
    if (status === "active") return;
    const interval = isLive ? 1000 : 60_000;
    const id = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(id);
  }, [status, isLive]);

  let label = "";
  if (urgency === "low" && msLeft !== null) {
    const days = Math.ceil(msLeft / (24 * 60 * 60 * 1000));
    label = `${days} days left in your free Creator trial`;
  } else if (urgency === "medium" && msLeft !== null) {
    const days = Math.ceil(msLeft / (24 * 60 * 60 * 1000));
    label = `${days} days left — upgrade to keep your analytics and private pages`;
  } else if (urgency === "high") {
    label = "Less than 24 hours left in your trial";
  } else if (urgency === "critical" && msLeft !== null) {
    label = `Trial ends in ${fmt(msLeft)}`;
  } else if (urgency === "grace" && msLeft !== null) {
    label = `Payment issue detected — your access continues for ${fmt(msLeft)}`;
  } else if (urgency === "expired") {
    label = "Trial ended — Upgrade to Creator to restore your features";
  }

  return {
    label,
    urgency,
    isLive,
    msLeft,
    showBanner: urgency !== "none",
  };
}