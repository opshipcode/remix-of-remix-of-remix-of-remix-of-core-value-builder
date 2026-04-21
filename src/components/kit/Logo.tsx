/**
 * KitPager wordmark — Basenji font.
 * variant="default" → upright Basenji Semibold (navbar, sidebar, admin)
 * variant="slanted" → oblique Basenji (footer watermark only)
 */
export function Logo({
  className = "",
  variant = "default",
  size = "md",
}: {
  className?: string;
  variant?: "default" | "slanted" | "mono";
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "text-xl", md: "text-2xl", lg: "text-3xl" } as const;
  const brandClass = variant === "slanted" ? "kp-brand-slanted" : "kp-brand";
  return (
    <span
      className={`${brandClass} inline-flex items-baseline ${sizes[size]} leading-none ${className}`}
      aria-label="KitPager"
    >
      <span className="text-foreground">kit</span>
      <span className={variant === "mono" ? "text-foreground" : "text-primary"}>pager</span>
    </span>
  );
}
