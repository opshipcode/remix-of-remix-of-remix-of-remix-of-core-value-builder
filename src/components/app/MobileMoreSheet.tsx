import { Link, NavLink } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  LayoutGrid, Wand2, Link2, Star, Inbox, BarChart3, DollarSign,
  Settings, ShieldCheck, LogOut, ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";

export const NAV_ITEMS = [
  { to: "/app", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/app/builder", label: "Builder", icon: Wand2 },
  { to: "/app/platforms", label: "Platforms", icon: Link2 },
  { to: "/app/testimonials", label: "Testimonials", icon: Star },
  { to: "/app/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/rates", label: "Rates", icon: DollarSign },
] as const;

export const SETTINGS_ITEMS = [
  { to: "/app/settings/profile", label: "Profile" },
  { to: "/app/settings/billing", label: "Billing" },
  { to: "/app/settings/security", label: "Security" },
  { to: "/app/settings/page", label: "Page" },
  { to: "/app/settings/notifications", label: "Notifications" },
  { to: "/app/settings/resources", label: "Resources" },
] as const;

interface MobileMoreSheetProps {
  open: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
}

export function MobileMoreSheet({ open, onClose, onLogoutClick }: MobileMoreSheetProps) {
  const { user } = useAuthStore();
  return (
    <Sheet open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <SheetContent side="right" className="w-[88%] max-w-sm overflow-y-auto p-0 sm:w-[420px]">
        <SheetHeader className="border-b border-border p-5">
          <SheetTitle className="text-base">More</SheetTitle>
        </SheetHeader>
        <div className="p-3">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Workspace</p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={"end" in item ? item.end : false}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive ? "bg-surface-offset text-foreground" : "text-muted-foreground hover:bg-surface-2"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}

          <p className="mt-4 px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Settings</p>
          {SETTINGS_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive ? "bg-surface-offset text-foreground" : "text-muted-foreground hover:bg-surface-2"
                }`
              }
            >
              <Settings className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}

          <div className="mt-4 space-y-1">
            <a
              href={`/${user?.slug ?? ""}`}
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-surface-2"
            >
              <ExternalLink className="h-4 w-4" />
              View my page
            </a>
            {user?.isAdmin && (
              <Link
                to="/admin"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-primary transition hover:bg-primary-highlight"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            )}
            <button
              type="button"
              onClick={() => { onClose(); onLogoutClick(); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive transition hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}