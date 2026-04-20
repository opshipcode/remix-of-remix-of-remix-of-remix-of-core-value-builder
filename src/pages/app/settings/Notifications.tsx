import { Lock } from "lucide-react";
import { useAuthStore } from "@/store/auth";

const PREFS = [
  { k: "inquiry", title: "New inquiry received", desc: "Email me when a brand sends an inquiry." },
  { k: "testimonial", title: "New testimonial submitted", desc: "Email me when a brand submits a testimonial." },
  { k: "follower", title: "Follower milestone", desc: "Notify me when I cross a 100K / 250K / 1M follower threshold on any platform." },
  { k: "digest", title: "Weekly digest", desc: "Sunday summary of views, inquiries, and platform stats." },
];

export default function Notifications() {
  const isPro = useAuthStore((s) => s.user?.plan === "pro");
  return (
    <div className="space-y-6">
      <div className="kp-card p-6">
        <h2 className="text-lg font-semibold">Email alerts</h2>
        <div className="mt-4 space-y-3">
          {PREFS.map((p) => (
            <label key={p.k} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
              <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-primary" />
              <div>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className={`kp-card p-6 ${!isPro ? "relative" : ""}`}>
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          Pro alerts
          {!isPro && <span className="inline-flex items-center gap-1 rounded-full bg-primary-highlight px-2.5 py-0.5 text-xs text-primary"><Lock className="h-3 w-3" /> Pro</span>}
        </h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
            <input type="checkbox" disabled={!isPro} className="mt-1 h-4 w-4 accent-primary" />
            <div>
              <p className="text-sm font-medium">Notify me when someone views my page</p>
              <p className="text-xs text-muted-foreground">Real-time email per visitor with city and referrer.</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
