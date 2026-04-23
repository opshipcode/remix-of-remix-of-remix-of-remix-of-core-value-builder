import type { CheckoutConfig } from "../payment-config";
import { showMockCheckout } from "./mockCheckout";

/** Stripe handler — stub. Real implementation pending. */
export function stripeHandler(config: CheckoutConfig): void {
  // eslint-disable-next-line no-console
  console.warn("[payment] Stripe provider not yet implemented — using mock checkout");
  showMockCheckout(config, "Stripe");
}
