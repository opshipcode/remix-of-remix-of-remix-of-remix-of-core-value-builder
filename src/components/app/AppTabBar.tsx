import { NavLink } from "react-router-dom";
import { LayoutGrid, Wand2, Inbox, BarChart3, MoreHorizontal } from "lucide-react";

interface AppTabBarProps {
  unreadInquiries: number;
  onMoreClick: () => void;
}

const TABS = [
  { to: "/app", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/app/builder", label: "Builder", icon: Wand2 },
  { to: "/app/inquiries", label: "Inquiries", icon: Inbox, badge: true },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function AppTabBar({ unreadInquiries, onMoreClick }: AppTabBarProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background/95 backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile navigation"
    >
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={"end" in t ? t.end : false}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
          <t.icon className="h-5 w-5" />
          <span>{t.label}</span>
          {"badge" in t && t.badge && unreadInquiries > 0 ? (
            <span className="absolute right-[28%] top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-semibold text-destructive-foreground">
              {unreadInquiries > 9 ? "9+" : unreadInquiries}
            </span>
          ) : null}
        </NavLink>
      ))}
      <button
        type="button"
        onClick={onMoreClick}
        className="flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <MoreHorizontal className="h-5 w-5" />
        <span>More</span>
      </button>
    </nav>
  );
}