import { PageHeader } from "@/components/marketing/PageHeader";
import { MOCK_COMPONENTS, MOCK_INCIDENTS } from "@/lib/mockData";
import { CheckCircle2, AlertTriangle } from "lucide-react";

const DAYS = 30;

export default function Status() {
  const overall = MOCK_COMPONENTS.every((c) => c.status === "operational");
  return (
    <>
      <PageHeader
        eyebrow="Status"
        title={overall ? "All systems operational" : "Some systems degraded"}
        subtitle="Live status of the KitPager platform. Updated every 60 seconds."
      />

      <section className="kp-container mt-16">
        <div className={`flex items-center gap-3 rounded-2xl border p-5 ${overall ? "border-success/30 bg-success/10" : "border-warning/30 bg-warning/10"}`}>
          {overall ? <CheckCircle2 className="h-5 w-5 text-success" /> : <AlertTriangle className="h-5 w-5 text-warning" />}
          <p className="text-sm">
            {overall ? "No incidents reported in the last 30 days." : "We are investigating an active issue."}
          </p>
        </div>
      </section>

      <section className="kp-container mt-10 space-y-3">
        {MOCK_COMPONENTS.map((c) => (
          <div key={c.name} className="kp-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-success" />
                <p className="text-sm font-medium">{c.name}</p>
              </div>
              <span className="text-xs text-muted-foreground capitalize">{c.status}</span>
            </div>
            <div className="mt-3 flex items-end gap-[2px]">
              {Array.from({ length: DAYS }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 flex-1 rounded-sm bg-success/70"
                  title={`Day -${DAYS - i}: operational`}
                />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        ))}
      </section>

      <section className="kp-container mt-14 mb-12">
        <h2 className="kp-display text-2xl">Past incidents</h2>
        <div className="kp-card mt-4 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INCIDENTS.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="px-5 py-3 text-muted-foreground">{i.date}</td>
                  <td className="px-5 py-3">{i.title}</td>
                  <td className="px-5 py-3 kp-mono">{i.durationMin}m</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success">
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
