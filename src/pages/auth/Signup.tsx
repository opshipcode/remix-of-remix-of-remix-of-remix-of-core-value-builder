import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { validateSlugSync, checkSlugAvailability } from "@/lib/slugValidation";
import { Check, Loader2 } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const [params] = useSearchParams();
  const claimSlug = (params.get("slug") ?? "").toLowerCase();
  const [loading, setLoading] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "ok" | "bad">("idle");
  const [slugMsg, setSlugMsg] = useState<string>("");

  useEffect(() => {
    if (!claimSlug) {
      setSlugStatus("idle");
      return;
    }
    const sync = validateSlugSync(claimSlug);
    if (!sync.ok) {
      setSlugStatus("bad");
      setSlugMsg(sync.reason);
      return;
    }
    setSlugStatus("checking");
    let cancelled = false;
    checkSlugAvailability(claimSlug).then((ok) => {
      if (cancelled) return;
      if (ok) {
        setSlugStatus("ok");
        setSlugMsg(`kitpager.pro/${claimSlug} is available — it's yours when you sign up.`);
      } else {
        setSlugStatus("bad");
        setSlugMsg("That handle was just taken — pick another after signup.");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [claimSlug]);

  const handleSignedIn = () => {
    signIn({
      onboardingComplete: false,
      ...(claimSlug && slugStatus === "ok" ? { slug: claimSlug } : {}),
    });
    if (claimSlug && slugStatus === "ok") {
      try {
        window.localStorage.setItem("kp_pending_slug", claimSlug);
      } catch {
        /* ignore */
      }
    }
    navigate("/onboarding");
  };

  return (
    <div>
      <h1 className="kp-display text-3xl">Create your KitPager.</h1>
      <p className="mt-2 text-muted-foreground">Free forever. No credit card.</p>

      {claimSlug && slugStatus === "ok" && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-success/40 bg-success/10 px-3.5 py-2.5 text-xs text-success">
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{slugMsg}</span>
        </div>
      )}
      {claimSlug && slugStatus === "checking" && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Checking availability of /{claimSlug}…
        </div>
      )}
      {claimSlug && slugStatus === "bad" && (
        <div className="mt-5 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
          {slugMsg}
        </div>
      )}

      <button
        type="button"
        onClick={handleSignedIn}
        className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium transition hover:bg-surface-2"
      >
        <GoogleIcon />
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
          window.setTimeout(handleSignedIn, 700);
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
