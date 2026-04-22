import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Music2,
  Instagram,
  Youtube,
  ShieldCheck,
  ExternalLink,
  Eye,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { MOCK_ADMIN_USERS } from "@/lib/mockData";

interface UserDetail {
  id: string;
  email: string;
  displayName: string;
  slug: string;
  avatarInitials: string;
  location: string;
  plan: "free" | "creator" | "pro";
  status: "active" | "suspended" | "banned";
  joinedAt: string;
  lastSeen: string;
  subscription: {
    status: "active" | "trialing" | "expired";
    trialEndsAt: string | null;
    cycle: "monthly" | "annual";
    nextRenewal: string;
    revenueUsd: number;
  };
  platforms: {
    platform: "tiktok" | "instagram" | "youtube";
    handle: string;
    followers: number;
    connectedAt: string;
    lastSynced: string;
    verified: boolean;
  }[];
  page: {
    template: string;
    isActive: boolean;
    passwordProtected: boolean;
    totalViews: number;
    uniqueVisitors: number;
    inquiryCount: number;
  };
  inquiries: { id: string; brand: string; date: string; budget: string; status: "unread" | "in progress" | "completed"; amountUsd: number | null }[];
  earningsByMonth: { month: string; usd: number }[];
  reports: { id: string; label: string; url: string; createdAt: string; views: number; status: "Active" | "Expired" }[];
  analytics: { views7d: number; views30d: number; uniqueVisitors: number; avgTime: string };
  sessions: { id: string; device: string; browser: string; location: string; lastActive: string }[];
}

function buildUserDetail(id: string): UserDetail {
  const base = MOCK_ADMIN_USERS.find((u) => u.id === id) ?? MOCK_ADMIN_USERS[0];
  return {
    id: base.id,
    email: base.email,
    displayName: base.email.split("@")[0].replace(".", " ").replace(/\b\w/g, (s) => s.toUpperCase()),
    slug: base.email.split("@")[0].replace(/\./g, ""),
    avatarInitials: base.email.slice(0, 2).toUpperCase(),
    location: "Lagos, Nigeria",
    plan: base.plan as "free" | "creator" | "pro",
    status: base.status as "active" | "suspended" | "banned",
    joinedAt: base.joinedAt,
    lastSeen: "2h ago",
    subscription: {
      status: base.plan === "free" ? "expired" : "active",
      trialEndsAt: null,
      cycle: "monthly",
      nextRenewal: "May 22, 2026",
      revenueUsd: base.plan === "pro" ? 348 : base.plan === "creator" ? 144 : 0,
    },
    platforms: [
      { platform: "tiktok", handle: "@user.tt", followers: 1_240_000, connectedAt: "Mar 4, 2026", lastSynced: "1h ago", verified: true },
      { platform: "instagram", handle: "@user.ig", followers: 380_000, connectedAt: "Mar 4, 2026", lastSynced: "2h ago", verified: true },
      { platform: "youtube", handle: "@User", followers: 92_000, connectedAt: "Mar 12, 2026", lastSynced: "3h ago", verified: false },
    ],
    page: {
      template: "Minimal",
      isActive: true,
      passwordProtected: false,
      totalViews: 18_420,
      uniqueVisitors: 12_310,
      inquiryCount: 8,
    },
    inquiries: [
      { id: "i1", brand: "Linear", date: "Apr 18, 2026", budget: "$8k–$12k", status: "completed", amountUsd: 9000 },
      { id: "i2", brand: "Vercel", date: "Apr 15, 2026", budget: "$3k–$5k", status: "in progress", amountUsd: null },
      { id: "i3", brand: "Loom", date: "Apr 19, 2026", budget: "$1k–$3k", status: "unread", amountUsd: null },
    ],
    earningsByMonth: [
      { month: "May", usd: 0 }, { month: "Jun", usd: 1200 }, { month: "Jul", usd: 800 },
      { month: "Aug", usd: 2400 }, { month: "Sep", usd: 1900 }, { month: "Oct", usd: 3200 },
      { month: "Nov", usd: 2100 }, { month: "Dec", usd: 4400 }, { month: "Jan", usd: 3700 },
      { month: "Feb", usd: 5100 }, { month: "Mar", usd: 4800 }, { month: "Apr", usd: 6200 },
    ],
    reports: [
      { id: "ab12cd", label: "Glossier Spring 2026", url: "kitpager.co/watch/apr26/ab12cd", createdAt: "Apr 14, 2026", views: 142, status: "Active" },
      { id: "ef34gh", label: "Notion Q1 Launch", url: "kitpager.co/watch/jan26/ef34gh", createdAt: "Jan 8, 2026", views: 312, status: "Expired" },
    ],
    analytics: { views7d: 1842, views30d: 7320, uniqueVisitors: 5180, avgTime: "2m 14s" },
    sessions: [
      { id: "s1", device: "MacBook Pro", browser: "Chrome 124", location: "Lagos, NG", lastActive: "now" },
      { id: "s2", device: "iPhone 15", browser: "Safari", location: "Lagos, NG", lastActive: "1h ago" },
    ],
  };
}

const PLATFORM_ICON = { tiktok: Music2, instagram: Instagram, youtube: Youtube } as const;

type ConfirmKind = "suspend" | "ban" | "delete" | "impersonate" | "revokeSessions" | null;

export default function AdminUserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const user = useMemo(() => buildUserDetail(userId ?? "u1"), [userId]);
  const [confirm, setConfirm] = useState<ConfirmKind>(null);
  const [reason, setReason] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const maxEarnings = Math.max(...user.earningsByMonth.map((e) => e.usd), 1);
  const totalEarnings = user.earningsByMonth.reduce((acc, e) => acc + e.usd, 0);

  const closeModal = () => {
    setConfirm(null);
    setReason("");
    setEmailConfirm("");
  };

  const runAction = (kind: ConfirmKind, durationMs: number) => {
    setBusy(true);
    window.setTimeout(() => {
      switch (kind) {
        case "suspend":
          toast({ title: `${user.displayName} suspended`, description: reason || "No reason given" });
          break;
        case "ban":
          toast({ title: `${user.displayName} banned`, description: reason || "No reason given", variant: "destructive" });
          break;
        case "delete":
          toast({ title: `${user.displayName} deleted`, variant: "destructive" });
          break;
        case "impersonate":
          toast({ title: `Impersonation mode: viewing as ${user.slug}` });
          break;
        case "revokeSessions":
          toast({ title: "All sessions revoked" });
          break;
        default:
          break;
      }
      setBusy(false);
      closeModal();
    }, durationMs);
  };

  return (
    <>
      <div className="mb-6">
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All users
        </Link>
      </div>

      {/* Section 1 — Identity */}
      <Section title="Identity">
        <div className="flex flex-col items-start gap-5 md:flex-row md:items-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-active text-2xl font-bold text-primary-foreground">
            {user.avatarInitials}
          </div>
          <div className="flex-1">
            <h1 className="kp-display text-3xl">{user.displayName}</h1>
            <p className="kp-mono mt-1 text-sm text-muted-foreground">/{user.slug} · {user.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">{user.location}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill tone="primary">{user.plan}</Pill>
              <Pill tone={user.status === "active" ? "success" : "warning"}>{user.status}</Pill>
              <Pill tone="muted">Joined {user.joinedAt}</Pill>
              <Pill tone="muted">Last seen {user.lastSeen}</Pill>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 2 — Subscription */}
      <Section title="Subscription">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Stat label="Current plan" value={user.plan} />
          <Stat label="Status" value={user.subscription.status} />
          <Stat label="Billing cycle" value={user.subscription.cycle} />
          <Stat label="Next renewal" value={user.subscription.nextRenewal} />
          <Stat label="Trial ends" value={user.subscription.trialEndsAt ?? "—"} />
          <Stat label="Total revenue" value={`$${user.subscription.revenueUsd.toLocaleString()}`} />
        </div>
      </Section>

      {/* Section 3 — Platform connections */}
      <Section title="Platform connections">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Platform</th>
                <th className="px-4 py-2.5">Handle</th>
                <th className="px-4 py-2.5">Followers</th>
                <th className="px-4 py-2.5">Connected</th>
                <th className="px-4 py-2.5">Last sync</th>
              </tr>
            </thead>
            <tbody>
              {user.platforms.map((p) => {
                const Icon = PLATFORM_ICON[p.platform];
                return (
                  <tr key={p.platform} className="border-t border-border">
                    <td className="px-4 py-2.5 capitalize">
                      <span className="inline-flex items-center gap-2"><Icon className="h-3.5 w-3.5" /> {p.platform}</span>
                    </td>
                    <td className="px-4 py-2.5 kp-mono text-muted-foreground">{p.handle}</td>
                    <td className="px-4 py-2.5">{p.followers.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{p.connectedAt}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {p.lastSynced}
                      {p.verified && <ShieldCheck className="ml-1 inline h-3 w-3 text-success" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 4 — Kit page */}
      <Section title="Kit page">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Slug: </span>
              <a href={`/${user.slug}`} target="_blank" rel="noreferrer" className="kp-mono text-primary hover:underline">
                /{user.slug} <ExternalLink className="inline h-3 w-3" />
              </a>
            </p>
            <p><span className="text-muted-foreground">Template: </span>{user.page.template}</p>
            <p><span className="text-muted-foreground">Status: </span>{user.page.isActive ? "Active" : "Inactive"}</p>
            <p><span className="text-muted-foreground">Password protected: </span>{user.page.passwordProtected ? "Yes" : "No"}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Total views" value={user.page.totalViews.toLocaleString()} />
            <Stat label="Unique visitors" value={user.page.uniqueVisitors.toLocaleString()} />
            <Stat label="Inquiries" value={user.page.inquiryCount.toString()} />
          </div>
        </div>
      </Section>

      {/* Section 5 — Inquiries */}
      <Section title="Inquiries">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5">Brand</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Budget</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Amount paid</th>
              </tr>
            </thead>
            <tbody>
              {user.inquiries.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="px-4 py-2.5 font-medium">{i.brand}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{i.date}</td>
                  <td className="px-4 py-2.5">{i.budget}</td>
                  <td className="px-4 py-2.5">
                    <Pill tone={i.status === "completed" ? "success" : i.status === "in progress" ? "primary" : "muted"}>
                      {i.status}
                    </Pill>
                  </td>
                  <td className="px-4 py-2.5 kp-mono">{i.amountUsd ? `$${i.amountUsd.toLocaleString()}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 6 — Earnings (simple CSS bars) */}
      <Section title="Earnings">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Total tracked</p>
            <p className="kp-display text-3xl">${totalEarnings.toLocaleString()}</p>
          </div>
          <p className="text-xs text-muted-foreground">Last 12 months</p>
        </div>
        <div className="mt-6 flex h-40 items-end gap-2">
          {user.earningsByMonth.map((e) => (
            <div key={e.month} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-primary/70 transition-all hover:bg-primary"
                style={{ height: `${(e.usd / maxEarnings) * 100}%`, minHeight: e.usd > 0 ? "4px" : "0" }}
                title={`${e.month}: $${e.usd}`}
              />
              <p className="text-[10px] uppercase text-muted-foreground">{e.month}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 7 — Reports */}
      <Section title="Reports">
        <div className="space-y-2">
          {user.reports.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{r.label}</p>
                <p className="kp-mono mt-0.5 text-xs text-muted-foreground">{r.url}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{r.createdAt}</span>
                <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {r.views}</span>
                <Pill tone={r.status === "Active" ? "success" : "muted"}>{r.status}</Pill>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 8 — Analytics */}
      <Section title="Analytics (read-only)">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <Stat label="Views — 7d" value={user.analytics.views7d.toLocaleString()} />
          <Stat label="Views — 30d" value={user.analytics.views30d.toLocaleString()} />
          <Stat label="Unique visitors" value={user.analytics.uniqueVisitors.toLocaleString()} />
          <Stat label="Avg time" value={user.analytics.avgTime} />
        </div>
      </Section>

      {/* Section 9 — Active sessions */}
      <Section title="Active sessions">
        <div className="space-y-2">
          {user.sessions.map((s) => (
            <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{s.device} · <span className="text-muted-foreground">{s.browser}</span></p>
                <p className="text-xs text-muted-foreground">{s.location}</p>
              </div>
              <span className="text-xs text-muted-foreground">{s.lastActive}</span>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="mt-4 border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={() => setConfirm("revokeSessions")}
        >
          Revoke all sessions
        </Button>
      </Section>

      {/* Section 10 — Admin actions */}
      <Section title="Admin actions">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setConfirm("impersonate")}>
            Impersonate user
          </Button>
          <Button variant="destructive" onClick={() => setConfirm("suspend")}>
            Suspend account
          </Button>
          <Button variant="destructive" onClick={() => setConfirm("ban")}>
            <Lock className="h-3.5 w-3.5" /> Ban account
          </Button>
          <Button variant="destructive" onClick={() => setConfirm("delete")}>
            Delete account
          </Button>
        </div>
      </Section>

      {/* Confirmation modal */}
      <AlertDialog open={!!confirm} onOpenChange={(v) => !v && closeModal()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === "suspend" && `Suspend ${user.displayName}?`}
              {confirm === "ban" && `Ban ${user.displayName}?`}
              {confirm === "delete" && `Delete ${user.displayName}?`}
              {confirm === "impersonate" && `Impersonate ${user.displayName}?`}
              {confirm === "revokeSessions" && `Revoke all sessions?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "delete"
                ? `This permanently deletes the user. Type "${user.email}" to confirm.`
                : confirm === "impersonate"
                  ? "You'll see KitPager from this user's perspective. Frontend simulation only."
                  : "This action requires confirmation."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {(confirm === "suspend" || confirm === "ban") && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Reason (visible in audit log)"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          )}
          {confirm === "delete" && (
            <input
              value={emailConfirm}
              onChange={(e) => setEmailConfirm(e.target.value)}
              placeholder={user.email}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                loaderClick
                isLoading={busy}
                variant={confirm === "impersonate" ? "default" : "destructive"}
                disabled={confirm === "delete" && emailConfirm !== user.email}
                onClick={() => {
                  if (confirm === "delete") runAction("delete", 1500);
                  else if (confirm === "ban") runAction("ban", 1200);
                  else if (confirm === "suspend") runAction("suspend", 1200);
                  else if (confirm === "impersonate") runAction("impersonate", 800);
                  else if (confirm === "revokeSessions") runAction("revokeSessions", 1000);
                }}
              >
                Confirm
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="kp-card mb-6 p-6">
      <h2 className="kp-display mb-5 text-xl">{title}</h2>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="kp-mono mt-1.5 text-base font-semibold capitalize">{value}</p>
    </div>
  );
}

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "success" | "warning" | "primary" | "muted";
}) {
  const cls =
    tone === "success"
      ? "bg-success/15 text-success"
      : tone === "warning"
        ? "bg-warning/15 text-warning"
        : tone === "primary"
          ? "bg-primary/15 text-primary"
          : "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs capitalize ${cls}`}>
      {children}
    </span>
  );
}
