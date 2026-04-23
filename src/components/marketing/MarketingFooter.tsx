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
      { to: "/support", label: "Support" },
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

const SOCIALS = [
  {
    name: "TikTok",
    href: "https://tiktok.com",
    path: "M12.5 2v11.7a3.3 3.3 0 1 1-3.3-3.3v3a.3.3 0 1 0 .3.3v-3a6.3 6.3 0 1 0 6.3 6.3V8.4a8.4 8.4 0 0 0 4.9 1.6V7a5.4 5.4 0 0 1-4.9-5h-3.3Z",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    path: "M7.5 2.5h9A5 5 0 0 1 21.5 7.5v9A5 5 0 0 1 16.5 21.5h-9A5 5 0 0 1 2.5 16.5v-9A5 5 0 0 1 7.5 2.5Zm0 2A3 3 0 0 0 4.5 7.5v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-9Zm9.5 1.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  },
  {
    name: "X",
    href: "https://x.com",
    path: "M18.4 2H21l-6.6 7.5L22 22h-6.8l-4.7-6.2L4.7 22H2l7-8L2 2h6.9l4.3 5.8L18.4 2Zm-1.2 18.2h1.7L7 3.7H5.2l12 16.5Z",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4v11H3v-11Zm6 0h3.8v1.5h.05c.53-1 1.83-2 3.77-2 4.03 0 4.78 2.65 4.78 6.1V20.5h-4v-4.85c0-1.16-.02-2.65-1.62-2.65-1.62 0-1.87 1.27-1.87 2.57V20.5H9v-11Z",
  },
];

export function MarketingFooter() {
  return (
    <div className="relative mt-32 overflow-x-clip">
      {/* Watermark sits BEHIND the footer card. 80% above, 20% covered by the card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center"
      >
        <div className="kp-footer-signature whitespace-nowrap leading-none translate-y-[35%]">
          kitpager
        </div>
      </div>

      <footer className="relative z-10 mx-4 mb-4 rounded-3xl border border-border bg-card md:mx-6 md:mb-6">
        <div className="px-6 py-14 md:px-12 md:py-16">
          <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div>
              <Logo size="lg" />
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                The premium media kit page for serious creators. Live proof, verified metrics, brand-ready in fifteen minutes.
              </p>
              <div className="mt-5 flex items-center gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
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
                        className="text-sm text-foreground/80 transition-colors hover:text-primary"
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
            <p>&copy; {new Date().getFullYear()} KitPager Co. All rights reserved.</p>
            <p className="kp-mono">v0.1.0</p>
          </div>
        </div>
      </footer>
      {/* spacer so the bottom 20% of the watermark is visible below the floating card */}
      <div aria-hidden className="h-[clamp(2rem,6vw,6rem)]" />
    </div>
  );
}
