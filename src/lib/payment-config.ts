/**
 * Single source of truth for payment provider selection.
 * To switch providers globally, change ACTIVE_PROVIDER below — nothing else.
 */
import { flutterwaveHandler } from "./providers/flutterwave";
import { stripeHandler } from "./providers/stripe";
import { paddleHandler } from "./providers/paddle";

export type ProviderId = "flutterwave" | "stripe" | "paddle";

export type PlanId =
  | "creator_monthly"
  | "creator_annual"
  | "pro_monthly"
  | "pro_annual"
  | "founding_creator";

export interface CheckoutConfig {
  amount: number; // already converted to local currency
  currency: string;
  email: string;
  name: string;
  plan: PlanId;
  onSuccess: (response: unknown) => void;
  onClose: () => void;
}

export interface PaymentProvider {
  id: ProviderId;
  label: string;
  description: string;
  currencies: string[];
  handler: (config: CheckoutConfig) => void;
}

export const PAYMENT_PROVIDERS: Record<ProviderId, PaymentProvider> = {
  flutterwave: {
    id: "flutterwave",
    label: "Flutterwave",
    description: "Best for Africa & emerging markets",
    currencies: ["NGN", "USD", "GHS", "KES", "ZAR"],
    handler: flutterwaveHandler,
  },
  stripe: {
    id: "stripe",
    label: "Stripe",
    description: "Global — cards, Apple Pay, Google Pay",
    currencies: ["USD", "EUR", "GBP", "CAD", "AUD"],
    handler: stripeHandler,
  },
  paddle: {
    id: "paddle",
    label: "Paddle",
    description: "SaaS billing, VAT handled automatically",
    currencies: ["USD", "EUR", "GBP"],
    handler: paddleHandler,
  },
};

/** ← CHANGE THIS ONE LINE TO SWITCH PROVIDERS GLOBALLY */
export const ACTIVE_PROVIDER: ProviderId = "flutterwave";

/** Base USD pricing — single source of truth. */
export const PLAN_PRICES_USD = {
  creator_monthly: 12.0,
  creator_annual: 8.25, // per month — billed as $99.00/yr
  pro_monthly: 19.0,
  pro_annual: 14.92, // per month — billed as $179.04/yr
  founding_creator: 349.99, // one-time — unlocks 5-year Founding Creator plan
} as const;

export const FOUNDING_CREATOR_DURATION_YEARS = 5;
