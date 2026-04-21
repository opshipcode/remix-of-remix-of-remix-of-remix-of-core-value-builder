import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PlanTier = "Free" | "Creator" | "Pro";
export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "trial_expired"
  | "grace_period"
  | "expired"
  | "cancelled";

export interface PlanState {
  plan: PlanTier;
  status: SubscriptionStatus;
  trialEndsAt: string | null;     // ISO string for persistence safety
  graceEndsAt: string | null;
  billingRenewalDate: string | null;

  setPlan: (plan: PlanTier) => void;
  setStatus: (status: SubscriptionStatus) => void;
  setTrialEndsAt: (date: Date | null) => void;
  setGraceEndsAt: (date: Date | null) => void;
  startCreatorTrial: (days?: number) => void;
  enterGracePeriod: (hours?: number) => void;
  jumpToState: (status: SubscriptionStatus) => void;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      plan: "Creator",
      status: "active",
      trialEndsAt: null,
      graceEndsAt: null,
      billingRenewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      setPlan: (plan) => set({ plan }),
      setStatus: (status) => set({ status }),
      setTrialEndsAt: (date) => set({ trialEndsAt: date ? date.toISOString() : null }),
      setGraceEndsAt: (date) => set({ graceEndsAt: date ? date.toISOString() : null }),
      startCreatorTrial: (days = 7) =>
        set({
          plan: "Creator",
          status: "trialing",
          trialEndsAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
          graceEndsAt: null,
        }),
      enterGracePeriod: (hours = 48) =>
        set({
          status: "grace_period",
          graceEndsAt: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(),
        }),
      jumpToState: (status) => {
        const now = Date.now();
        const patch: Partial<PlanState> = { status };
        if (status === "trialing") {
          patch.trialEndsAt = new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString();
          patch.graceEndsAt = null;
        } else if (status === "grace_period") {
          patch.graceEndsAt = new Date(now + 48 * 60 * 60 * 1000).toISOString();
        } else if (status === "active") {
          patch.trialEndsAt = null;
          patch.graceEndsAt = null;
          patch.billingRenewalDate = new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString();
        } else {
          patch.trialEndsAt = null;
          patch.graceEndsAt = null;
        }
        set(patch);
      },
    }),
    { name: "kp-plan-state" },
  ),
);

/**
 * Derive the effective plan: what the user actually has access to right now.
 * - trialing → Creator (full mid-tier access during trial)
 * - grace_period → keep the paid plan they had
 * - expired / trial_expired / cancelled → Free
 * - active → their plan
 */
export function getEffectivePlan(state: PlanState): PlanTier {
  switch (state.status) {
    case "trialing":
      return "Creator";
    case "grace_period":
    case "active":
      return state.plan;
    case "trial_expired":
    case "expired":
    case "cancelled":
      return "Free";
    default:
      return state.plan;
  }
}

export function useEffectivePlan(): PlanTier {
  return usePlanStore(getEffectivePlan);
}

/** Convenience: does the user have at least `required` plan access? */
export function planMeets(current: PlanTier, required: PlanTier): boolean {
  const order: Record<PlanTier, number> = { Free: 0, Creator: 1, Pro: 2 };
  return order[current] >= order[required];
}
