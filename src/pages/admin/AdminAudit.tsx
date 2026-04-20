const ROWS = [
  { ts: "2026-04-19 18:42:11", user: "alex@kitpager.pro", action: "page.visibility.change", ip: "73.42.18.221", ua: "Chrome 124 / macOS" },
  { ts: "2026-04-19 17:21:02", user: "admin@kitpager.pro", action: "user.suspend", ip: "10.4.0.18", ua: "Firefox 127 / Linux" },
  { ts: "2026-04-19 14:08:54", user: "mira@example.com", action: "auth.password.change", ip: "82.21.5.140", ua: "Safari 17 / iOS" },
  { ts: "2026-04-19 09:11:31", user: "alex@kitpager.pro", action: "auth.signin", ip: "73.42.18.221", ua: "Chrome 124 / macOS" },
  { ts: "2026-04-18 22:01:09", user: "jordan@example.com", action: "billing.subscribe", ip: "98.18.43.12", ua: "Chrome 124 / Windows" },
];

export default function AdminAudit() {
  return (
    <>
      <h1 className="kp-display text-3xl">Audit log</h1>
      <p className="mt-2 text-sm text-muted-foreground">Append-only record of sensitive actions.</p>

      <div className="kp-card mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Timestamp</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">IP</th>
              <th className="px-5 py-3">User agent</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-5 py-3 kp-mono text-xs text-muted-foreground">{r.ts}</td>
                <td className="px-5 py-3">{r.user}</td>
                <td className="px-5 py-3 kp-mono text-xs">{r.action}</td>
                <td className="px-5 py-3 kp-mono text-xs">{r.ip}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{r.ua}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
