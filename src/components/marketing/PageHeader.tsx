import { ReactNode } from "react";
import { Link } from "react-router-dom";


/**
 * Marketing page chrome — eyebrow, large headline, subhead. Used by docs-style pages
 * (how-it-works, security, examples, resources, status, legal).
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <header className={`pt-16 md:pt-24 ${align === "center" ? "text-center" : ""}`}>
      <div className="kp-container">
        {eyebrow && (
          <span className="kp-eyebrow mx-auto inline-flex">{eyebrow}</span>
        )}
        <h1 className="kp-display mt-5 text-4xl text-foreground md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className={`mt-5 text-lg text-muted-foreground ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}

export function CTAStrip() {
  return (
    <section className="kp-container py-20">
      <div
        className="relative overflow-hidden rounded-3xl border border-border p-10 md:p-16"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="kp-display text-3xl text-primary-foreground md:text-4xl">
              Ready to look the part?
            </h3>
            <p className="mt-2 max-w-xl text-primary-foreground/85">
              Build a brand-ready kit page in fifteen minutes. Free forever, upgrade when you book.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center rounded-full bg-background px-6 py-3 text-sm font-medium text-foreground transition hover:opacity-90"
            >
              Start free
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary-foreground/10"
            >
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
