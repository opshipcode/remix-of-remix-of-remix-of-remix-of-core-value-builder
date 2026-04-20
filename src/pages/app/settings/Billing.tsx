import { useAuthStore } from "@/store/auth";
import { Sparkles, Download } from "lucide-react";

const HISTORY = [
  { id: "i1", date: "Apr 1, 2026", desc: "Creator plan — monthly", amount: "$12.00", status: "Paid" },
  { id: "i2", date: "Mar 1, 2026", desc: "Creator plan — monthly", amount: "$12.00", status: "Paid" },
  { id: "i3", date: "Feb 1, 2026", desc: "Creator plan — monthly", amount: "$12.00", status: "Paid" },
];

export default function Billing() {
  const plan = useAuthStore((s) => s.user?.plan ?? "free");
  return (
    <div className="space-y-6">
      <div className="kp-card overflow-hidden">
        <div className="p-6 md:p-8" style={{ background: "var(--gradient-primary)" }}>
          <p className="text-xs uppercase tracking-[0.14em] text-primary-foreground/80">Current plan</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <p className="kp-display text-4xl text-primary-foreground capitalize">{plan}</p>
              <p className="mt-1 text-sm text-primary-foreground/80">$12 / month, renews May 1, 2026</p>
            </div>
            <button className="rounded-full bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:opacity-90">
              <Sparkles className="mr-1.5 inline h-4 w-4" />
              Upgrade to Pro
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border bg-card text-center">
          {[
            { l: "Trial ends", v: "—" },
            { l: "Used this month", v: "1.2K views" },
            { l: "Plan limit", v: "Unlimited" },
          ].map((s) => (
            <div key={s.l} className="p-4">
              <p className="text-xs text-muted-foreground">{s.l}</p>
              <p className="kp-mono mt-1 text-sm font-medium">{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="kp-card overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-semibold">Billing history</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((h) => (
              <tr key={h.id} className="border-t border-border">
                <td className="px-5 py-3 text-muted-foreground">{h.date}</td>
                <td className="px-5 py-3">{h.desc}</td>
                <td className="px-5 py-3 kp-mono">{h.amount}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success">{h.status}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                    <Download className="h-3.5 w-3.5" /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
