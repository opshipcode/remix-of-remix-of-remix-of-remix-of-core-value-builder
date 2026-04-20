/**
 * KitPager wordmark — never use emojis. Pure type lockup.
 */
export function Logo({
  className = "",
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "mono";
}) {
  return (
    <span
      className={`kp-display inline-flex items-baseline gap-[0.1em] text-[1.15rem] tracking-[-0.02em] ${className}`}
      aria-label="KitPager"
    >
      <span className={variant === "mono" ? "text-foreground" : "text-foreground"}>kit</span>
      <span className={variant === "mono" ? "text-foreground" : "text-primary"}>pager</span>
    </span>
  );
}
