import { Link, NavLink, Outlet } from "react-router-dom";
import { Users, AlertTriangle, BarChart3, FileText, ShieldCheck, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/kit/Logo";
import { ThemeToggle } from "@/components/kit/ThemeToggle";

const ADMIN_NAV = [
  { to: "/admin", label: "Overview", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/moderation", label: "Moderation", icon: AlertTriangle },
  { to: "/admin/audit", label: "Audit log", icon: FileText },
  { to: "/admin/system", label: "System health", icon: ShieldCheck },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-surface">
        <div className="kp-container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/app" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to app
            </Link>
            <span className="text-muted-foreground">/</span>
            <div className="flex items-center gap-2">
              <Logo />
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                Admin
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <div className="kp-container">
          <nav className="-mx-1 flex gap-1 overflow-x-auto pb-2 no-scrollbar">
            {ADMIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  }`
                }
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="kp-container py-8">
        <Outlet />
      </main>
    </div>
  );
}
