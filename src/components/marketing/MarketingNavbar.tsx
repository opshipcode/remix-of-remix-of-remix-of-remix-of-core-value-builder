import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/kit/Logo";
import { ThemeToggle } from "@/components/kit/ThemeToggle";
import { useAuthStore } from "@/store/auth";

const NAV = [
  { to: "/features", label: "Features" },
  { to: "/templates", label: "Templates" },
  { to: "/pricing", label: "Pricing" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/examples", label: "Examples" },
  { to: "/resources", label: "Resources" },
];

export function MarketingNavbar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isAuthed = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <header className="sticky top-4 z-50 px-4 bg-none">
      <div className="kp-container bg-none">
        <div
          ref={ref}
          className="kp-glass-strong mx-auto flex h-14 items-center justify-between rounded-full px-3 pl-5 shadow-md md:h-16 md:px-4 md:pl-6"
        >
          <Link to="/" className="flex items-center gap-2" aria-label="KitPager home">
            <Logo size="md" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                    active
                      ? "bg-surface-offset text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden md:inline-flex" />
            {isAuthed ? (
              <Link
                to="/app"
                className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover md:inline-flex"
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground md:inline-flex"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover md:inline-flex"
                >
                  Start free
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:bg-surface-2 lg:hidden"
            >
              <ChevronLeft
                className={`h-4 w-4 transition-transform duration-300 ease-smooth ${
                  open ? "-rotate-90" : "rotate-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-smooth lg:hidden ${
            open ? "mt-2 max-h-[560px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="kp-glass-strong rounded-3xl p-3 shadow-md">
            <nav className="flex flex-col">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-2xl px-4 py-3 text-sm text-foreground transition hover:bg-surface-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="my-2 kp-divider" />
            <div className="flex items-center justify-between gap-2 px-2">
              <ThemeToggle />
              {isAuthed ? (
                <Link
                  to="/app"
                  className="flex-1 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground"
                >
                  Open dashboard
                </Link>
              ) : (
                <div className="flex flex-1 gap-2">
                  <Link to="/login" className="flex-1 rounded-full border border-border px-4 py-2.5 text-center text-sm">
                    Sign in
                  </Link>
                  <Link to="/signup" className="flex-1 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground">
                    Start free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
