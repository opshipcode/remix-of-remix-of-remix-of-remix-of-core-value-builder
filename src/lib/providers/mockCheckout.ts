import type { CheckoutConfig } from "../payment-config";

/**
 * Frontend mock checkout: dispatches a custom event consumed by
 * <MockCheckoutHost /> mounted at the app root. Decouples provider
 * handlers from React components.
 */
export interface MockCheckoutDetail {
  config: CheckoutConfig;
  providerLabel: string;
}

export function showMockCheckout(
  config: CheckoutConfig,
  providerLabel: string,
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<MockCheckoutDetail>("kp:mock-checkout", {
      detail: { config, providerLabel },
    }),
  );
}
