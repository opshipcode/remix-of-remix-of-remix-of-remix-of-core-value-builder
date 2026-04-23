/**
 * The ONLY entry point the app uses to start a checkout.
 * UpgradeModal, Pricing, and Onboarding all import from here.
 * They never import provider modules directly.
 */
import {
  PAYMENT_PROVIDERS,
  ACTIVE_PROVIDER,
  PLAN_PRICES_USD,
  FOUNDING_CREATOR_DURATION_YEARS,
  type CheckoutConfig,
  type PlanId,
} from "./payment-config";

export function openCheckout(config: CheckoutConfig): void {
  PAYMENT_PROVIDERS[ACTIVE_PROVIDER].handler(config);
}

export { PLAN_PRICES_USD, FOUNDING_CREATOR_DURATION_YEARS };
export type { CheckoutConfig, PlanId };
