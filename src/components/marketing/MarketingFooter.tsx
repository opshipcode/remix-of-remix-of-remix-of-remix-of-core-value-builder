import { Link } from "react-router-dom";
import { Logo } from "@/components/kit/Logo";

const COLS = [
  {
    title: "Product",
    items: [
      { to: "/features", label: "Features" },
      { to: "/templates", label: "Templates" },
      { to: "/pricing", label: "Pricing" },
      { to: "/changelog", label: "Changelog" },
      { to: "/status", label: "Status" },
    ],
  },
  {
    title: "Company",
    items: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/legal/terms", label: "Terms" },
      { to: "/legal/privacy", label: "Privacy" },
      { to: "/legal/cookies", label: "Cookies" },
    ],
  },
  {
    title: "Resources",
    items: [
      { to: "/legal/acceptable-use", label: "Acceptable use" },
      { to: "/legal/dmca", label: "DMCA" },
      { to: "/legal/refund", label: "Refund policy" },
      { to: "/legal/data-request", label: "Data request" },
      { to: "/legal/subprocessors", label: "Subprocessors" },
    ],
  },
];

/**
 * Footer with the giant faded "kitpager" brand signature stretched across the bottom.
 * Required by spec — premium brand mark, not a loud banner.
 */
export function MarketingFooter() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-border bg-surface">
      <div className="kp-container py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The premium media kit page for serious creators. Live proof, verified metrics, brand-ready in fifteen minutes.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((it) => (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      className="text-sm text-foreground/80 transition hover:text-primary"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="kp-container flex flex-col items-start justify-between gap-3 border-t border-border/70 py-6 text-xs text-muted-foreground md:flex-row md:items-center">
        <p>&copy; {new Date().getFullYear()} KitPager, Inc. All rights reserved.</p>
        <p className="kp-mono">v0.1.0 — preview build</p>
      </div>

      {/* Brand signature — large, faded, masked, premium */}
      <div className="kp-container -mb-6 select-none overflow-hidden md:-mb-10">
        <div className="kp-footer-signature whitespace-nowrap text-center md:text-left">
          kitpager
        </div>
      </div>
    </footer>
  );
}
