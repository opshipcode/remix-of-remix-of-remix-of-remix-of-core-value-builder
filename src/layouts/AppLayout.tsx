import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Wand2,
  Link2,
  Star,
  Inbox,
  BarChart3,
  DollarSign,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/kit/Logo";
import { ThemeToggle } from "@/components/kit/ThemeToggle";
import { useAuthStore } from "@/store/auth";
import { useEffectivePlan } from "@/store/plan";
import { LogoutModal } from "@/components/kit/LogoutModal";
import { WelcomeModal } from "@/components/kit/WelcomeModal";
import { HelpBubble } from "@/components/kit/HelpBubble";
import type { PlanLockTarget } from "@/components/ui/button";
import { AppTabBar } from "@/components/app/AppTabBar";
import { MobileMoreSheet } from "@/components/app/MobileMoreSheet";
import { PlanBadge } from "@/components/kit/PlanBadge";
import { GraceExpiredModal, AutoRenewSimulator } from "@/components/kit/GraceExpiredModal";

const NAV = [
  { to: "/app", label: "Overview", icon: LayoutGrid },
  { to: "/app/builder", label: "Builder", icon: Wand2 },
  { to: "/app/platforms", label: "Platforms", icon: Link2 },
  { to: "/app/testimonials", label: "Testimonials", icon: Star },
  { to: "/app/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/rates", label: "Rates", icon: DollarSign },
];

const SETTINGS = [
  { to: "/app/settings/profile", label: "Profile" },
  { to: "/app/settings/billing", label: "Billing" },
  { to: "/app/settings/security", label: "Security" },
  { to: "/app/settings/page", label: "Page" },
  { to: "/app/settings/notifications", label: "Notifications" },
  { to: "/app/settings/resources", label: "Resources" },
];

export default function AppLayout() {
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const effectivePlan = useEffectivePlan();
  const location = useLocation();
  const inSettings = location.pathname.startsWith("/app/settings");
  const inBuilder = location.pathname.startsWith("/app/builder");

  const handleUpgrade = (target: PlanLockTarget) => {
    window.dispatchEvent(
      new CustomEvent<{ targetPlan: PlanLockTarget; featureName: string }>(
        "kp:upgrade",
        { detail: { targetPlan: target, featureName: "your workspace" } },
      ),
    );
  };

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={`hidden h-full shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-300 ease-smooth lg:flex ${
          collapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && (
            <Link to="/app" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        <nav id="kp-sidebar-nav" className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV.map((item) => {
            const targetId =
              item.to === "/app/builder"
                ? "kp-nav-builder"
                : item.to === "/app/platforms"
                  ? "kp-nav-platforms"
                  : undefined;
            return (
              <NavLink
                key={item.to}
                id={targetId}
                to={item.to}
                end={item.to === "/app"}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-surface-offset text-foreground"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  }`
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}

          <div className="pt-4">
            {!collapsed && (
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                Settings
              </p>
            )}
            {SETTINGS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-surface-offset text-foreground"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  }`
                }
              >
                <Settings className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>

          {user?.isAdmin && (
            <div className="pt-4">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-primary hover:bg-primary-highlight"
                  }`
                }
              >
                <ShieldCheck className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Admin</span>}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Free plan persistent upgrade CTA */}
        {!collapsed && effectivePlan === "Free" && (
          <div className="px-3 pb-2">
            <button
              type="button"
              onClick={() => handleUpgrade("Creator")}
              className="flex w-full items-center justify-between gap-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 px-3 py-2.5 text-left text-sm transition-all hover:from-primary/30"
            >
              <span className="flex items-center gap-2 text-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                Upgrade
              </span>
              <span className="text-xs text-muted-foreground">Creator →</span>
            </button>
          </div>
        )}

        <div className="border-t border-border p-3">
          {!collapsed ? (
            <div className="flex items-center gap-3 rounded-xl bg-surface-2 px-3 py-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {user?.displayName?.charAt(0) ?? "K"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user?.displayName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  <span className="kp-mono">/{user?.slug}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLogoutOpen(true)}
                aria-label="Sign out"
                className="rounded-md p-1 text-muted-foreground transition hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              aria-label="Sign out"
              className="grid h-9 w-full place-items-center rounded-xl text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Main column — fixed shell, no outer scroll */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setHamburgerOpen(true)}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:text-foreground sm:inline-flex lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Logo size="sm" />
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <p className="text-sm text-muted-foreground">
              {inBuilder ? "Builder" : inSettings ? "Settings" : "Workspace"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              id="kp-view-page"
              href={`/${user?.slug ?? ""}`}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground md:inline-flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="kp-mono">kitpager.pro/{user?.slug}</span>
            </a>
            <PlanBadge />
            <ThemeToggle />
          </div>
        </header>
        <main
          data-scroll-root
          className={`flex-1 min-h-0 pb-16 sm:pb-0 ${inBuilder ? "overflow-hidden" : "overflow-y-auto"}`}
        >
          <Outlet />
        </main>
      </div>

      <LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
      <WelcomeModal />
      <HelpBubble />
      <GraceExpiredModal />
      <AutoRenewSimulator />
      <AppTabBar unreadInquiries={2} onMoreClick={() => setMoreOpen(true)} />
      <MobileMoreSheet
        open={moreOpen || hamburgerOpen}
        onClose={() => { setMoreOpen(false); setHamburgerOpen(false); }}
        onLogoutClick={() => setLogoutOpen(true)}
      />
    </div>
  );
}
