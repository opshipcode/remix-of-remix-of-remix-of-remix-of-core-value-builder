import type { CheckoutConfig } from "../payment-config";
import { showMockCheckout } from "./mockCheckout";

/** Paddle handler — stub. Real implementation pending. */
export function paddleHandler(config: CheckoutConfig): void {
  // eslint-disable-next-line no-console
  console.warn("[payment] Paddle provider not yet implemented — using mock checkout");
  showMockCheckout(config, "Paddle");
}
