import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/kit/Logo";
import { ThemeToggle } from "@/components/kit/ThemeToggle";
import { useAuthStore } from "@/store/auth";

const STEPS = [
  { id: 1, title: "Identity", desc: "Tell us who you are" },
  { id: 2, title: "Platforms", desc: "Connect your channels" },
  { id: 3, title: "Profile", desc: "Bio, niche, and pitch" },
  { id: 4, title: "Template", desc: "Pick a starting look" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 md:px-10">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="text-sm text-muted-foreground">Setup</span>
        </div>
        <ThemeToggle />
      </header>

      <div className="kp-container grid gap-10 py-10 md:grid-cols-[260px_1fr] md:py-16">
        {/* Stepper */}
        <aside className="md:sticky md:top-10 md:self-start">
          <ol className="space-y-4">
            {STEPS.map((s) => {
              const done = s.id < step;
              const active = s.id === step;
              return (
                <li key={s.id} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition ${
                      done
                        ? "bg-primary text-primary-foreground"
                        : active
                        ? "bg-foreground text-background"
                        : "bg-surface-2 text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="h-3 w-3" /> : s.id}
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* Step body */}
        <div className="kp-card p-8 md:p-10">
          {step === 1 && <StepIdentity />}
          {step === 2 && <StepPlatforms />}
          {step === 3 && <StepProfile />}
          {step === 4 && <StepTemplate />}

          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  completeOnboarding();
                  navigate("/app");
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
              >
                Publish my page <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIdentity() {
  return (
    <div>
      <span className="kp-eyebrow">Step 1 of 4</span>
      <h2 className="kp-display mt-3 text-3xl">Let's get your identity set.</h2>
      <p className="mt-2 text-muted-foreground">This is what brands see first.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Field label="Display name" placeholder="Alex Rivera" />
        <Field label="Public slug" prefix="kitpager.pro/" placeholder="alexrivera" mono />
      </div>
      <div className="mt-4">
        <Field label="Headline" placeholder="Lifestyle creator helping brands ship better launch content" />
      </div>
    </div>
  );
}

function StepPlatforms() {
  return (
    <div>
      <span className="kp-eyebrow">Step 2 of 4</span>
      <h2 className="kp-display mt-3 text-3xl">Connect your platforms.</h2>
      <p className="mt-2 text-muted-foreground">We auto-pull live metrics. You can also paste content URLs.</p>
      <div className="mt-8 space-y-3">
        {["TikTok", "Instagram", "YouTube"].map((p) => (
          <button
            key={p}
            type="button"
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 text-left transition hover:bg-surface-2"
          >
            <span className="text-sm font-medium">{p}</span>
            <span className="text-xs text-muted-foreground">Connect →</span>
          </button>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        TikTok metrics are self-reported until app approval — clearly labeled on your page.
      </p>
    </div>
  );
}

function StepProfile() {
  return (
    <div>
      <span className="kp-eyebrow">Step 3 of 4</span>
      <h2 className="kp-display mt-3 text-3xl">Round out your profile.</h2>
      <div className="mt-8 space-y-4">
        <div>
          <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Bio</label>
          <textarea rows={4} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="What kind of brands do you work with?" />
        </div>
        <Field label="Niche tags (comma-separated)" placeholder="Tech, Lifestyle, Wellness" />
        <Field label="Contact email" placeholder="alex@email.com" type="email" />
      </div>
    </div>
  );
}

function StepTemplate() {
  const [picked, setPicked] = useState("minimal");
  return (
    <div>
      <span className="kp-eyebrow">Step 4 of 4</span>
      <h2 className="kp-display mt-3 text-3xl">Pick a starting template.</h2>
      <p className="mt-2 text-muted-foreground">You can switch anytime — your content is preserved.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { id: "minimal", name: "Minimal" },
          { id: "bold", name: "Bold" },
          { id: "professional", name: "Professional" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setPicked(t.id)}
            className={`group rounded-2xl border p-1 text-left transition ${
              picked === t.id ? "border-primary shadow-glow" : "border-border hover:border-primary/40"
            }`}
          >
            <div className="aspect-[3/4] rounded-xl bg-surface-2" />
            <div className="px-3 py-3">
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground">Tap to preview</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({
  label, placeholder, type = "text", prefix, mono,
}: { label: string; placeholder?: string; type?: string; prefix?: string; mono?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <div className={`mt-1.5 flex items-center rounded-xl border border-border bg-background px-4 py-3 text-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20`}>
        {prefix && <span className="kp-mono text-muted-foreground">{prefix}</span>}
        <input
          type={type}
          placeholder={placeholder}
          className={`flex-1 bg-transparent outline-none ${mono ? "kp-mono" : ""}`}
        />
      </div>
    </div>
  );
}
