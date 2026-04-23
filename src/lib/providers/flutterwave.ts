import type { CheckoutConfig } from "../payment-config";
import { showMockCheckout } from "./mockCheckout";

interface FlutterwaveCheckoutFn {
  (config: object): void;
}

/**
 * Flutterwave handler.
 * If the real script + public key are present, use them.
 * Otherwise fall back to the mock checkout sheet (dev / no-key environments).
 */
export function flutterwaveHandler(config: CheckoutConfig): void {
  const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY as
    | string
    | undefined;
  const fw =
    typeof window !== "undefined"
      ? (window as unknown as { FlutterwaveCheckout?: FlutterwaveCheckoutFn })
          .FlutterwaveCheckout
      : undefined;

  if (!publicKey || typeof fw !== "function") {
    showMockCheckout(config, "Flutterwave");
    return;
  }

  fw({
    public_key: publicKey,
    tx_ref: `kp-${config.plan}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    amount: config.amount,
    currency: config.currency,
    customer: { email: config.email, name: config.name },
    customizations: {
      title: "KitPager",
      description: `${config.plan} plan`,
      logo: "/logo.svg",
    },
    callback: config.onSuccess,
    onclose: config.onClose,
  });
}
