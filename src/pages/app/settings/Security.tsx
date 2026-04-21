import { useState } from "react";
import { Laptop, Smartphone, ShieldCheck } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { usePageLoader } from "@/hooks/usePageLoader";
import { toast } from "@/hooks/use-toast";

interface Session {
  id: string;
  device: string;
  loc: string;
  icon: typeof Laptop;
  current?: boolean;
}

const INITIAL_SESSIONS: Session[] = [
  { id: "s1", device: "MacBook Pro · Chrome", loc: "Brooklyn, NY · current", icon: Laptop, current: true },
  { id: "s2", device: "iPhone 15 Pro · Safari", loc: "Brooklyn, NY · 2 hours ago", icon: Smartphone },
  { id: "s3", device: "MacBook Air · Safari", loc: "Austin, TX · 4 days ago", icon: Laptop },
];

export default function Security() {
  const { loading } = usePageLoader(700);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [revoking, setRevoking] = useState<Session | null>(null);
  const [revokeBusy, setRevokeBusy] = useState(false);
  const [accountToggle, setAccountToggle] = useState<{ name: string; connected: boolean } | null>(null);
  const [accountBusy, setAccountBusy] = useState(false);
  const [accounts, setAccounts] = useState([
    { p: "Google", connected: true, account: "alex@gmail.com" },
    { p: "Apple", connected: false },
  ]);

  if (loading) return <SecuritySkeleton />;

  const handleUpdatePwd = () => {
    if (!pwd.current || !pwd.next || pwd.next !== pwd.confirm) {
      toast({ title: "Check your passwords", description: "All fields are required and must match." });
      return;
    }
    setSavingPwd(true);
    window.setTimeout(() => {
      setSavingPwd(false);
      setPwd({ current: "", next: "", confirm: "" });
      toast({ title: "Password updated" });
    }, 1100);
  };

  const handleRevoke = () => {
    if (!revoking) return;
    setRevokeBusy(true);
    window.setTimeout(() => {
      setSessions(sessions.filter((s) => s.id !== revoking.id));
      setRevokeBusy(false);
      setRevoking(null);
      toast({ title: "Session revoked" });
    }, 800);
  };

  const handleAccount = () => {
    if (!accountToggle) return;
    setAccountBusy(true);
    window.setTimeout(() => {
      setAccounts(accounts.map((a) =>
        a.p === accountToggle.name ? { ...a, connected: !a.connected, account: !a.connected ? "you@icloud.com" : undefined } : a,
      ));
      setAccountBusy(false);
      setAccountToggle(null);
      toast({
        title: accountToggle.connected ? "Disconnected" : "Connected",
        description: `${accountToggle.name} ${accountToggle.connected ? "removed" : "linked"}.`,
      });
    }, 900);
  };

  return (
    <div className="space-y-6">
      <div className="kp-card p-6">
        <h2 className="text-lg font-semibold">Change password</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Field label="Current password" type="password" value={pwd.current} onChange={(v) => setPwd({ ...pwd, current: v })} />
          <Field label="New password" type="password" value={pwd.next} onChange={(v) => setPwd({ ...pwd, next: v })} />
          <Field label="Confirm new password" type="password" value={pwd.confirm} onChange={(v) => setPwd({ ...pwd, confirm: v })} />
        </div>
        <div className="mt-5 flex justify-end">
          <Button loaderClick isLoading={savingPwd} onClick={handleUpdatePwd}>
            Update password
          </Button>
        </div>
      </div>

      <div className="kp-card p-6">
        <h2 className="text-lg font-semibold">Connected accounts</h2>
        <div className="mt-4 divide-y divide-border">
          {accounts.map((a) => (
            <div key={a.p} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{a.p}</p>
                {a.connected && a.account && <p className="kp-mono text-xs text-muted-foreground">{a.account}</p>}
              </div>
              <Button
                variant={a.connected ? "outline" : "default"}
                size="sm"
                className={a.connected ? "border-destructive/40 text-destructive hover:bg-destructive/10" : ""}
                onClick={() => setAccountToggle({ name: a.p, connected: a.connected })}
              >
                {a.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="kp-card p-6">
        <h2 className="text-lg font-semibold">Active sessions</h2>
        <div className="mt-4 divide-y divide-border">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-2">
                  <s.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{s.device}</p>
                  <p className="text-xs text-muted-foreground">{s.loc}</p>
                </div>
              </div>
              {s.current ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success">
                  <ShieldCheck className="h-3 w-3" /> Current
                </span>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setRevoking(s)}>
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <AlertDialog open={!!revoking} onOpenChange={(v) => !v && setRevoking(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke session?</AlertDialogTitle>
            <AlertDialogDescription>
              {revoking?.device} ({revoking?.loc}) will be signed out immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" loaderClick isLoading={revokeBusy} onClick={handleRevoke}>
                Revoke session
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!accountToggle} onOpenChange={(v) => !v && setAccountToggle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {accountToggle?.connected ? `Disconnect ${accountToggle.name}?` : `Connect ${accountToggle?.name}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {accountToggle?.connected
                ? "You'll need to use your password (or another connected account) to sign in."
                : `You'll be redirected to ${accountToggle?.name} to authorize KitPager.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant={accountToggle?.connected ? "destructive" : "default"}
                loaderClick
                isLoading={accountBusy}
                onClick={handleAccount}
              >
                {accountToggle?.connected ? "Disconnect" : "Connect"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SecuritySkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-44" />
      <Skeleton className="h-40" />
      <Skeleton className="h-56" />
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
