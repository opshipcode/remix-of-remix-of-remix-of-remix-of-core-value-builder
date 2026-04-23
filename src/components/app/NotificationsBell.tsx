import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BellIcon,
  BellSlashIcon,
  InboxIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useNotificationsStore,
  relativeTime,
  seedNotificationsOnce,
  type Notification,
  type NotificationType,
} from "@/store/notifications";

interface IconStyle {
  Icon: typeof BellIcon;
  cls: string;
}

const TYPE_STYLE: Record<NotificationType, IconStyle> = {
  new_inquiry: { Icon: InboxIcon, cls: "text-primary bg-primary/10" },
  new_testimonial: { Icon: StarIcon, cls: "text-amber-500 bg-amber-500/10" },
  plan_created: {
    Icon: CheckCircleIcon,
    cls: "text-success bg-success/15",
  },
  plan_expiring: {
    Icon: ExclamationTriangleIcon,
    cls: "text-amber-500 bg-amber-500/10",
  },
  plan_expired: {
    Icon: XCircleIcon,
    cls: "text-destructive bg-destructive/10",
  },
  subscription_renewed: {
    Icon: ArrowPathIcon,
    cls: "text-success bg-success/15",
  },
  admin_reply: {
    Icon: ChatBubbleLeftIcon,
    cls: "text-blue-500 bg-blue-500/10",
  },
  trial_ending: { Icon: ClockIcon, cls: "text-amber-500 bg-amber-500/10" },
};

export function NotificationsBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const notifications = useNotificationsStore((s) => s.notifications);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const seededRef = useRef(false);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    seedNotificationsOnce();
  }, []);

  const handleClick = (n: Notification) => {
    markRead(n.id);
    if (n.link) {
      setOpen(false);
      navigate(n.link);
    }
  };

  const showDot = unreadCount > 0 && !open;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:text-foreground"
        >
          <BellIcon className="h-4 w-4" />
          {showDot && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="kp-glass w-screen max-w-sm border border-border p-0 sm:w-80"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="text-[11px] font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-40"
          >
            Mark all read
          </button>
        </div>

        <div className="max-h-[480px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="grid place-items-center px-4 py-12 text-center">
              <BellSlashIcon className="h-8 w-8 text-muted-foreground/60" />
              <p className="mt-3 text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((n) => {
                const { Icon, cls } = TYPE_STYLE[n.type];
                const Body = (
                  <div
                    className={`flex gap-3 px-4 py-3 transition hover:bg-surface-2 ${
                      !n.read ? "bg-surface-2/60" : ""
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${cls}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {n.title}
                        </p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {relativeTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {n.body}
                      </p>
                    </div>
                  </div>
                );
                return (
                  <li key={n.id}>
                    {n.link ? (
                      <button
                        type="button"
                        onClick={() => handleClick(n)}
                        className="block w-full text-left"
                      >
                        {Body}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        className="block w-full text-left"
                      >
                        {Body}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-border px-4 py-2 text-center">
          <Link
            to="/app/settings/notifications"
            onClick={() => setOpen(false)}
            className="text-[11px] text-muted-foreground transition hover:text-foreground"
          >
            Notification settings →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
