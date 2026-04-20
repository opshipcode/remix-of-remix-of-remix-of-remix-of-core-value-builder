import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

export default function Login() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h1 className="kp-display text-3xl">Welcome back.</h1>
      <p className="mt-2 text-muted-foreground">Sign in to your KitPager.</p>

      <button
        type="button"
        onClick={() => {
          signIn();
          navigate("/app");
        }}
        className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium transition hover:bg-surface-2"
      >
        <GoogleIcon /> Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setTimeout(() => {
            signIn();
            navigate("/app");
          }, 600);
        }}
      >
        <Field label="Email" name="email" type="email" placeholder="you@email.com" />
        <Field label="Password" name="password" type="password" placeholder="" />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="h-3.5 w-3.5 rounded border-border" defaultChecked /> Remember me
          </label>
          <Link to="/forgot-password" className="text-foreground/80 hover:text-primary">Forgot password?</Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to KitPager?{" "}
        <Link to="/signup" className="text-foreground underline-offset-2 hover:underline">Create an account</Link>
      </p>
    </div>
  );
}

function Field({ label, name, type, placeholder }: { label: string; name: string; type: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
