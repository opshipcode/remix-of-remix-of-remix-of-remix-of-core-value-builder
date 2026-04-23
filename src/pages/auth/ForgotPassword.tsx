import { useState } from "react";
import { Link } from "react-router-dom";


export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <h1 className="kp-display text-3xl">Forgot your password?</h1>
      <p className="mt-2 text-muted-foreground">We'll email you a secure reset link.</p>
      {sent ? (
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm">Check your inbox for the reset link. It expires in 30 minutes.</p>
        </div>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <div>
            <label htmlFor="email" className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Email</label>
            <input id="email" type="email" className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:opacity-90">Send reset link</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link to="/login" className="text-foreground underline-offset-2 hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
