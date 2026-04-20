/**
 * KitPager wordmark — uses the brand font "Jumping Chick".
 */
export function Logo({
  className = "",
  variant = "default",
  size = "md",
}: {
  className?: string;
  variant?: "default" | "mono";
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "text-xl", md: "text-2xl", lg: "text-3xl" } as const;
  return (
    <span
      className={`kp-brand inline-flex items-baseline ${sizes[size]} leading-none ${className}`}
      aria-label="KitPager"
    >
      <span className="text-foreground">kit</span>
      <span className={variant === "mono" ? "text-foreground" : "text-primary"}>pager</span>
    </span>
  );
}
