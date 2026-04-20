import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

export default function Signup() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h1 className="kp-display text-3xl">Create your KitPager.</h1>
      <p className="mt-2 text-muted-foreground">Free forever. No credit card.</p>

      <button
        type="button"
        onClick={() => {
          signIn({ onboardingComplete: false });
          navigate("/onboarding");
        }}
        className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium transition hover:bg-surface-2"
      >
        Continue with Google
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
            signIn({ onboardingComplete: false });
            navigate("/onboarding");
          }, 700);
        }}
      >
        <Field label="Display name" name="name" />
        <Field label="Email" name="email" type="email" />
        <Field label="Password" name="password" type="password" />
        <p className="text-xs text-muted-foreground">Must be 10+ characters.</p>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-foreground underline-offset-2 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
