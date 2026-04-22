import { Link } from "react-router-dom";
import { MOCK_ADMIN_USERS } from "@/lib/mockData";
import { Search, ChevronRight } from "lucide-react";

export default function AdminUsers() {
  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="kp-display text-3xl">Users</h1>
          <p className="mt-2 text-sm text-muted-foreground">Search, filter, and manage every account.</p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Search email or slug…" className="w-64 rounded-full border border-border bg-surface py-2 pl-9 pr-4 text-sm outline-none focus:border-primary" />
        </div>
      </div>

      <div className="kp-card mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ADMIN_USERS.map((u) => (
              <tr key={u.id} className="border-t border-border transition hover:bg-surface-2">
                <td className="px-5 py-3 font-medium">
                  <Link to={`/admin/users/${u.id}`} className="hover:text-primary">
                    {u.email}
                  </Link>
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-primary-highlight px-2.5 py-0.5 text-xs capitalize text-primary">{u.plan}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${u.status === "active" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{u.joinedAt}</td>
                <td className="px-5 py-3 text-right">
                  <Link to={`/admin/users/${u.id}`} className="inline-flex rounded-md p-1 text-muted-foreground hover:bg-surface hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
