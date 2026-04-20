const REPORTS = [
  { id: "r1", type: "Testimonial", reporter: "creator: alexrivera", date: "Apr 18", preview: "Suspected fake testimonial submission, brand identity unverifiable.", severity: "med" },
  { id: "r2", type: "Profile", reporter: "creator: jordanchen", date: "Apr 17", preview: "Impersonation of a verified creator account.", severity: "high" },
  { id: "r3", type: "Inquiry", reporter: "system: turnstile", date: "Apr 16", preview: "Bot pattern detected on inquiry form submission.", severity: "low" },
];

const TONE = { high: "bg-destructive/15 text-destructive", med: "bg-warning/15 text-warning", low: "bg-surface-2 text-muted-foreground" } as const;

export default function AdminModeration() {
  return (
    <>
      <h1 className="kp-display text-3xl">Moderation</h1>
      <p className="mt-2 text-sm text-muted-foreground">Reported content awaiting review.</p>

      <div className="mt-6 space-y-3">
        {REPORTS.map((r) => (
          <div key={r.id} className="kp-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs capitalize ${TONE[r.severity as keyof typeof TONE]}`}>{r.severity}</span>
                  <span className="text-sm font-medium">{r.type}</span>
                  <span className="text-xs text-muted-foreground">· {r.date}</span>
                </div>
                <p className="mt-2 text-sm">{r.preview}</p>
                <p className="kp-mono mt-1 text-xs text-muted-foreground">Reported by {r.reporter}</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-full border border-border px-3 py-1.5 text-xs hover:bg-surface-2">Dismiss</button>
                <button className="rounded-full border border-warning/40 px-3 py-1.5 text-xs text-warning hover:bg-warning/10">Warn user</button>
                <button className="rounded-full border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
