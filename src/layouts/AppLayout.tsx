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
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/kit/Logo";
import { ThemeToggle } from "@/components/kit/ThemeToggle";
import { useAuthStore } from "@/store/auth";

const NAV: { to: string; label: string; icon: typeof LayoutGrid }[] = [
  { to: "/app", label: "Overview", icon: LayoutGrid },
  { to: "/app/builder", label: "Builder", icon: Wand2 },
  { to: "/app/platforms", label: "Platforms", icon: Link2 },
  { to: "/app/testimonials", label: "Testimonials", icon: Star },
  { to: "/app/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/rates", label: "Rates", icon: DollarSign },
];

const SETTINGS: { to: string; label: string }[] = [
  { to: "/app/settings/profile", label: "Profile" },
  { to: "/app/settings/billing", label: "Billing" },
  { to: "/app/settings/security", label: "Security" },
  { to: "/app/settings/page", label: "Page" },
  { to: "/app/settings/notifications", label: "Notifications" },
  { to: "/app/settings/resources", label: "Resources" },
];

export default function AppLayout() {
  const { user, signOut } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const inSettings = location.pathname.startsWith("/app/settings");

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-300 ease-smooth md:flex ${
          collapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && (
            <Link to="/app" className="flex items-center gap-2">
              <Logo />
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

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
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
          ))}

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
                onClick={signOut}
                aria-label="Sign out"
                className="rounded-md p-1 text-muted-foreground transition hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={signOut}
              aria-label="Sign out"
              className="grid h-9 w-full place-items-center rounded-xl text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3 md:hidden">
            <Logo />
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <p className="text-sm text-muted-foreground">
              {inSettings ? "Settings" : "Workspace"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/${user?.slug ?? ""}`}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground md:inline-flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="kp-mono">kitpager.pro/{user?.slug}</span>
            </a>
            <ThemeToggle />
          </div>
        </header>
        <main className="min-h-[calc(100vh-3.5rem)] p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
