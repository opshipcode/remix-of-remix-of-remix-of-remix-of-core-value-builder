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
    title: "Learn",
    items: [
      { to: "/how-it-works", label: "How it works" },
      { to: "/examples", label: "Examples" },
      { to: "/resources", label: "Resources" },
      { to: "/security", label: "Security" },
      { to: "/about", label: "About" },
    ],
  },
  {
    title: "Legal",
    items: [
      { to: "/legal/terms", label: "Terms" },
      { to: "/legal/privacy", label: "Privacy" },
      { to: "/legal/cookies", label: "Cookies" },
      { to: "/legal/acceptable-use", label: "Acceptable use" },
      { to: "/legal/dmca", label: "DMCA" },
    ],
  },
];

/**
 * Floating, rounded footer that does not touch page edges.
 * Giant faded "kitpager" signature sits at the very bottom of the page,
 * fully visible (untruncated), allowed to overlap the floating card.
 */
export function MarketingFooter() {
  return (
    <div className="relative mt-32">
      <footer className="relative z-10 mx-4 mb-4 overflow-visible rounded-3xl border border-border bg-surface md:mx-6 md:mb-6">
        <div className="px-6 py-16 md:px-12 md:py-20">
          <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div>
              <Logo size="lg" />
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

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
            <p>&copy; {new Date().getFullYear()} KitPager, Inc. All rights reserved.</p>
            <p className="kp-mono">v0.1.0 — preview build</p>
          </div>
        </div>
      </footer>

      {/* Giant faded brand signature — always full width, never clipped */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center overflow-visible"
      >
        <div className="kp-footer-signature whitespace-nowrap leading-none">
          kitpager
        </div>
      </div>
      {/* spacer so signature is fully visible below the floating card */}
      <div aria-hidden className="h-[clamp(4rem,12vw,12rem)]" />
    </div>
  );
}
