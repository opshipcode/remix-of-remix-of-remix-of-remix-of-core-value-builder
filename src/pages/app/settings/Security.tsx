import { Laptop, Smartphone, ShieldCheck } from "lucide-react";

export default function Security() {
  return (
    <div className="space-y-6">
      <div className="kp-card p-6">
        <h2 className="text-lg font-semibold">Change password</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Field label="Current password" type="password" />
          <Field label="New password" type="password" />
          <Field label="Confirm new password" type="password" />
        </div>
        <div className="mt-5 flex justify-end">
          <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover">Update password</button>
        </div>
      </div>

      <div className="kp-card p-6">
        <h2 className="text-lg font-semibold">Connected accounts</h2>
        <div className="mt-4 divide-y divide-border">
          {[
            { p: "Google", connected: true, account: "alex@gmail.com" },
            { p: "Apple", connected: false },
          ].map((a) => (
            <div key={a.p} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">{a.p}</p>
                {a.connected && <p className="kp-mono text-xs text-muted-foreground">{a.account}</p>}
              </div>
              <button className={`rounded-full px-4 py-1.5 text-xs ${a.connected ? "border border-destructive/40 text-destructive hover:bg-destructive/10" : "bg-foreground text-background"}`}>
                {a.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="kp-card p-6">
        <h2 className="text-lg font-semibold">Active sessions</h2>
        <div className="mt-4 divide-y divide-border">
          {[
            { d: "MacBook Pro · Chrome", loc: "Brooklyn, NY · current", icon: Laptop, current: true },
            { d: "iPhone 15 Pro · Safari", loc: "Brooklyn, NY · 2 hours ago", icon: Smartphone },
            { d: "MacBook Air · Safari", loc: "Austin, TX · 4 days ago", icon: Laptop },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-2"><s.icon className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-medium">{s.d}</p>
                  <p className="text-xs text-muted-foreground">{s.loc}</p>
                </div>
              </div>
              {s.current ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success">
                  <ShieldCheck className="h-3 w-3" /> Current
                </span>
              ) : (
                <button className="rounded-full border border-border px-3 py-1 text-xs hover:bg-surface-2">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input type={type} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}
