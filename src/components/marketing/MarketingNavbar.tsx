import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/kit/Logo";
import { ThemeToggle } from "@/components/kit/ThemeToggle";
import { useAuthStore } from "@/store/auth";
import { container, item, navShell } from "@/components/marketing/animations/navbar.animation";
import { motion } from "framer-motion";

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
  const [scrolled, setScrolled] = useState(false);
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
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed ${scrolled ? "top-6" : "top-3"} left-0 right-0 z-50 px-0`}>
      <div className="kp-container">
        <div
          ref={ref}
          className={`mx-auto flex h-14 items-center justify-between rounded-full px-3 pl-5 transition-all duration-300 md:h-16 md:px-4 md:pl-6 ${
            scrolled 
              ? "bg-background/80 backdrop-blur-lg border border-border/50 shadow-md" 
              : "bg-transparent"
          }`}
        >
          <motion.div
            variants={item}
            initial="closed"
            animate="open"
          >
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <Logo size="md" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden items-center gap-1 lg:flex"
            variants={container}
            initial="closed"
            animate="open"
          >
            {NAV.map((navItem, index) => {
              const active = location.pathname === navItem.to;

              return (
                <motion.div key={navItem.to} custom={index} variants={item}>
                  <Link
                    to={navItem.to}
                    className={`rounded-full px-3.5 py-1.5 text-sm transition whitespace-nowrap ${
                      active
                        ? "bg-surface-offset text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                    }`}
                  >
                    {navItem.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>

          {/* Desktop: Theme Toggle + Auth Buttons */}
          <motion.div
            className="hidden items-center gap-2 lg:flex"
            variants={container}
            initial="closed"
            animate="open"
          >
            {isAuthed ? (
              <motion.div variants={item}>
                <Link
                  to="/app"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
                >
                  Open dashboard
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div variants={item}>
                  <Link
                    to="/login"
                    className="rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    Sign in
                  </Link>
                </motion.div>

                <motion.div variants={item}>
                  <Link
                    to="/signup"
                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
                  >
                    Start free
                  </Link>
                </motion.div>
              </>
            )}
            <motion.div variants={item}>
              <ThemeToggle />
            </motion.div>

          </motion.div>

          {/* Mobile: Theme Toggle + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:bg-surface-2"
            >
              <ChevronLeft
                className={`h-4 w-4 transition-transform duration-300 ease-smooth ${
                  open ? "-rotate-90" : "rotate-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-smooth lg:hidden ${
            open ? "mt-2 max-h-[560px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <motion.div
            className="bg-background/95 backdrop-blur-lg border border-border/50 rounded-3xl p-3 shadow-lg"
            variants={container}
            initial="closed"
            animate={open ? "open" : "closed"}
          >
            {/* NAV */}
            <motion.nav className="flex flex-col">
              {NAV.map((itemData, index) => (
                <motion.div key={itemData.to} custom={index} variants={item}>
                  <Link
                    to={itemData.to}
                    className="rounded-2xl px-4 py-3 text-sm text-foreground hover:bg-surface-2 block"
                  >
                    {itemData.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            {/* Divider */}
            <motion.div
              custom={NAV.length}
              variants={item}
              className="my-2 h-px bg-border origin-left"
            />

            {/* BUTTONS */}
            <div className="flex flex-col gap-2 px-2">
              {isAuthed ? (
                <motion.div custom={NAV.length + 1} variants={item}>
                  <Link
                    to="/app"
                    className="rounded-full bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground block"
                  >
                    Open dashboard
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div custom={NAV.length + 1} variants={item}>
                    <Link
                      to="/login"
                      className="rounded-full border border-border px-4 py-2.5 text-center text-sm block"
                    >
                      Sign in
                    </Link>
                  </motion.div>

                  <motion.div custom={NAV.length + 2} variants={item}>
                    <Link
                      to="/signup"
                      className="rounded-full bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground block"
                    >
                      Start free
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}