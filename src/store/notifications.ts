import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationType =
  | "new_inquiry"
  | "new_testimonial"
  | "plan_created"
  | "plan_expiring"
  | "plan_expired"
  | "subscription_renewed"
  | "admin_reply"
  | "trial_ending";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string; // ISO
  read: boolean;
  link?: string;
}

interface NotificationsStore {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  reset: () => void;
}

function computeUnread(list: Notification[]): number {
  return list.filter((n) => !n.read).length;
}

function genId(): string {
  return `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const SEED_KEY = "kp_notif_seeded";

function getSeed(): Notification[] {
  const now = Date.now();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  return [
    {
      id: genId(),
      type: "new_inquiry",
      title: "New inquiry from Glossier",
      body: "We'd love to discuss a Q3 launch with your audience.",
      createdAt: new Date(now - 12 * minute).toISOString(),
      read: false,
      link: "/app/inquiries",
    },
    {
      id: genId(),
      type: "new_testimonial",
      title: "New testimonial from Notion",
      body: "Maya from Notion left you a 5-star review awaiting approval.",
      createdAt: new Date(now - 3 * hour).toISOString(),
      read: false,
      link: "/app/testimonials",
    },
    {
      id: genId(),
      type: "trial_ending",
      title: "Trial ends in 2 days",
      body: "Add a payment method to keep Creator features after your trial.",
      createdAt: new Date(now - 1 * day).toISOString(),
      read: false,
      link: "/app/settings/billing",
    },
    {
      id: genId(),
      type: "subscription_renewed",
      title: "Renewal successful",
      body: "Your Creator plan renewed for another month.",
      createdAt: new Date(now - 5 * day).toISOString(),
      read: true,
      link: "/app/settings/billing",
    },
    {
      id: genId(),
      type: "new_inquiry",
      title: "New inquiry from Glossier",
      body: "We'd love to discuss a Q3 launch with your audience.",
      createdAt: new Date(now - 12 * minute).toISOString(),
      read: false,
      link: "/app/inquiries",
    },
    {
      id: genId(),
      type: "new_testimonial",
      title: "New testimonial from Notion",
      body: "Maya from Notion left you a 5-star review awaiting approval.",
      createdAt: new Date(now - 3 * hour).toISOString(),
      read: false,
      link: "/app/testimonials",
    },
    {
      id: genId(),
      type: "trial_ending",
      title: "Trial ends in 2 days",
      body: "Add a payment method to keep Creator features after your trial.",
      createdAt: new Date(now - 1 * day).toISOString(),
      read: false,
      link: "/app/settings/billing",
    },
    {
      id: genId(),
      type: "subscription_renewed",
      title: "Renewal successful",
      body: "Your Creator plan renewed for another month.",
      createdAt: new Date(now - 5 * day).toISOString(),
      read: true,
      link: "/app/settings/billing",
    },
  ];
}

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      markRead: (id) =>
        set((s) => {
          const next = s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          );
          return { notifications: next, unreadCount: computeUnread(next) };
        }),
      markAllRead: () =>
        set((s) => {
          const next = s.notifications.map((n) => ({ ...n, read: true }));
          return { notifications: next, unreadCount: 0 };
        }),
      addNotification: (n) =>
        set((s) => {
          const next: Notification[] = [
            {
              ...n,
              id: genId(),
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...s.notifications,
          ];
          return { notifications: next, unreadCount: computeUnread(next) };
        }),
      reset: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: "kp_notifications",
      partialize: (s) => ({ notifications: s.notifications }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.unreadCount = computeUnread(state.notifications);
        }
      },
    },
  ),
);

/** Seed dummy notifications once on first mount. Idempotent. */
export function seedNotificationsOnce(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(SEED_KEY)) return;
    const store = useNotificationsStore.getState();
    if (store.notifications.length > 0) {
      window.localStorage.setItem(SEED_KEY, "1");
      return;
    }
    const seeded = getSeed();
    useNotificationsStore.setState({
      notifications: seeded,
      unreadCount: computeUnread(seeded),
    });
    window.localStorage.setItem(SEED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const s = Math.max(0, Math.floor((now - then) / 1000));
  if (s < 60) return "Just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  const w = Math.floor(d / 7);
  if (w < 4) return `${w} wk ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} mo ago`;
  const y = Math.floor(d / 365);
  return `${y} yr ago`;
}
