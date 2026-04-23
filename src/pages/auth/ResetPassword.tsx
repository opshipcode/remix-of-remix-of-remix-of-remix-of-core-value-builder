import { useState } from "react";
import { Link } from "react-router-dom";


export default function ResetPassword() {
  const [done, setDone] = useState(false);
  return (
    <div>
      <h1 className="kp-display text-3xl">Set a new password.</h1>
      <p className="mt-2 text-muted-foreground">Make it strong — at least 10 characters.</p>
      {done ? (
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 text-sm">
          Password updated. <Link to="/login" className="text-primary">Sign in</Link>.
        </div>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
          <div>
            <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">New password</label>
            <input type="password" className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Confirm password</label>
            <input type="password" className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:opacity-90">Update password</button>
        </form>
      )}
    </div>
  );
}
