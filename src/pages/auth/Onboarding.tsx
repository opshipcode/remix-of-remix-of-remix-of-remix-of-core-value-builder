import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Logo } from "@/components/kit/Logo";
import { ThemeToggle } from "@/components/kit/ThemeToggle";
import { useAuthStore } from "@/store/auth";
import { usePlanStore } from "@/store/plan";
import { useKitPageStore, type TemplateId } from "@/store/kitPage";
import { useLocaleStore } from "@/store/locale";
import { formatPrice } from "@/lib/formatPrice";
import { Button } from "@/components/ui/button";
import { MockPaddleSheet } from "@/components/kit/MockPaddleSheet";
import { validateSlugSync, checkSlugAvailability } from "@/lib/slugValidation";
import { toast } from "@/hooks/use-toast";

const STEPS = [
  { id: 1, title: "Identity", desc: "Name and slug" },
  { id: 2, title: "Platforms", desc: "Connect channels" },
  { id: 3, title: "Profile", desc: "Bio and niche" },
  { id: 4, title: "Template", desc: "Pick your look" },
  { id: 5, title: "Plan", desc: "How you'll grow" },
];

type ConnectedSet = Record<"tiktok" | "instagram" | "facebook" | "youtube", "idle" | "loading" | "connected">;
type PlanChoice = "Free" | "Creator" | "Pro";

export default function Onboarding() {
  const navigate = useNavigate();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const startCreatorTrial = usePlanStore((s) => s.startCreatorTrial);
  const setKitPage = useKitPageStore((s) => s.setData);
  const [step, setStep] = useState<number>(1);

  const [displayName, setDisplayName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [niche, setNiche] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [template, setTemplate] = useState<TemplateId>("minimal");
  const [plan, setPlan] = useState<PlanChoice>("Creator");
  const [paddleOpen, setPaddleOpen] = useState<boolean>(false);
  const [continuing, setContinuing] = useState<boolean>(false);

  const [connected, setConnected] = useState<ConnectedSet>({
    tiktok: "idle", instagram: "idle", facebook: "idle", youtube: "idle",
  });

  const handleFinish = () => {
    setKitPage({
      slug: slug || "creator",
      displayName: displayName || "Creator",
      tagline: headline,
      bio,
      template,
      nicheTags: niche.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8),
    });

    // Auto-start a 7-day Creator trial regardless of plan choice
    startCreatorTrial(7);
    completeOnboarding();
    toast({
      title: "Welcome to KitPager",
      description: "Your 7-day Creator trial has started.",
    });
    navigate("/app");
  };

  const handleContinue = () => {
    if (plan === "Free") {
      setContinuing(true);
      window.setTimeout(handleFinish, 800);
    } else {
      setPaddleOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6 md:px-10">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden text-sm text-muted-foreground sm:inline">Setup</span>
        </div>
        <ThemeToggle />
      </header>

      <div className="kp-container grid gap-6 py-6 sm:gap-10 sm:py-10 md:grid-cols-[260px_1fr] md:py-16">
        <aside className="md:sticky md:top-10 md:self-start">
          <ol className="flex gap-3 overflow-x-auto md:flex-col md:gap-4 md:overflow-visible">
            {STEPS.map((s) => {
              const done = s.id < step;
              const active = s.id === step;
              return (
                <li key={s.id} className="flex shrink-0 items-start gap-3">
                  <span
                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition ${
                      done ? "bg-primary text-primary-foreground"
                        : active ? "bg-foreground text-background"
                        : "bg-surface-2 text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="h-3 w-3" /> : s.id}
                  </span>
                  <div className="hidden md:block">
                    <p className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <p className={`text-xs font-medium md:hidden ${active ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.title}
                  </p>
                </li>
              );
            })}
          </ol>
        </aside>

        <div className="kp-card p-5 sm:p-8 md:p-10">
          {step === 1 && (
            <StepIdentity
              displayName={displayName} setDisplayName={setDisplayName}
              slug={slug} setSlug={setSlug}
              headline={headline} setHeadline={setHeadline}
            />
          )}
          {step === 2 && (
            <StepPlatforms connected={connected} setConnected={setConnected} />
          )}
          {step === 3 && (
            <StepProfile
              bio={bio} setBio={setBio}
              niche={niche} setNiche={setNiche}
              contactEmail={contactEmail} setContactEmail={setContactEmail}
            />
          )}
          {step === 4 && <StepTemplate template={template} setTemplate={setTemplate} />}
          {step === 5 && <StepPlan plan={plan} setPlan={setPlan} />}

          <div className="mt-8 flex items-center justify-between sm:mt-10">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-40 sm:px-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition hover:opacity-90 sm:px-5"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <Button
                onClick={handleContinue}
                loaderClick
                isLoading={continuing}
                size="lg"
                className="rounded-full"
              >
                Continue with {plan} <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <MockPaddleSheet
        open={paddleOpen}
        onClose={() => setPaddleOpen(false)}
        onSuccess={() => { setPaddleOpen(false); handleFinish(); }}
        planLabel={plan === "Pro" ? "Pro" : "Creator"}
        priceUSD={plan === "Pro" ? 29 : 12}
      />
    </div>
  );
}

/* ---------- Steps ---------- */

interface IdentityProps {
  displayName: string; setDisplayName: (v: string) => void;
  slug: string; setSlug: (v: string) => void;
  headline: string; setHeadline: (v: string) => void;
}
function StepIdentity({ displayName, setDisplayName, slug, setSlug, headline, setHeadline }: IdentityProps) {
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "ok" | "bad">("idle");
  const [slugMsg, setSlugMsg] = useState<string>("");

  useEffect(() => {
    if (!slug) { setSlugStatus("idle"); return; }
    const sync = validateSlugSync(slug);
    if (sync.ok === false) {
      setSlugStatus("bad");
      setSlugMsg(sync.reason);
      return;
    }
    setSlugStatus("checking");
    const id = window.setTimeout(async () => {
      const available = await checkSlugAvailability(slug);
      if (available) { setSlugStatus("ok"); setSlugMsg("Available"); }
      else { setSlugStatus("bad"); setSlugMsg("Already taken"); }
    }, 300);
    return () => window.clearTimeout(id);
  }, [slug]);

  return (
    <div>
      <span className="kp-eyebrow">Step 1 of 5</span>
      <h2 className="kp-display mt-3 text-2xl sm:text-3xl">Let's get your identity set.</h2>
      <p className="mt-2 text-muted-foreground">This is what brands see first.</p>
      <div className="mt-6 grid gap-4 sm:mt-8 md:grid-cols-2">
        <div>
          <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Display name</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Alex Rivera"
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Public slug</label>
          <div className="mt-1.5 flex items-center rounded-xl border border-border bg-background px-4 py-3 text-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <span className="kp-mono text-muted-foreground">kitpager.pro/</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              placeholder="alexrivera"
              className="flex-1 bg-transparent kp-mono outline-none"
            />
            {slugStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {slugStatus === "ok" && <Check className="h-4 w-4 text-success" />}
          </div>
          {slug && slugStatus !== "idle" && (
            <p className={`mt-1.5 text-xs ${slugStatus === "ok" ? "text-success" : slugStatus === "bad" ? "text-destructive" : "text-muted-foreground"}`}>
              {slugMsg}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Headline</label>
        <input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="Lifestyle creator helping brands ship better launch content"
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}

interface PlatformsProps {
  connected: ConnectedSet;
  setConnected: React.Dispatch<React.SetStateAction<ConnectedSet>>;
}
function StepPlatforms({ connected, setConnected }: PlatformsProps) {
  const PLATFORMS: { id: keyof ConnectedSet; label: string; note?: string }[] = [
    { id: "tiktok", label: "TikTok", note: "TikTok metrics are self-reported until app approval — clearly labeled on your page." },
    { id: "instagram", label: "Instagram", note: "Connect your Facebook Page and linked Instagram account together." },
    { id: "facebook", label: "Facebook" },
    { id: "youtube", label: "YouTube" },
  ];

  const handleConnect = (id: keyof ConnectedSet) => {
    setConnected((c) => ({ ...c, [id]: "loading" }));
    window.setTimeout(() => {
      setConnected((c) => ({ ...c, [id]: "connected" }));
    }, 1200);
  };

  return (
    <div>
      <span className="kp-eyebrow">Step 2 of 5</span>
      <h2 className="kp-display mt-3 text-2xl sm:text-3xl">Connect your platforms.</h2>
      <p className="mt-2 text-muted-foreground">We auto-pull live metrics. You can also paste content URLs.</p>
      <div className="mt-6 space-y-3 sm:mt-8">
        {PLATFORMS.map((p) => {
          const status = connected[p.id];
          return (
            <div key={p.id} className="rounded-2xl border border-border bg-surface px-4 py-4 sm:px-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{p.label}</span>
                <Button
                  size="sm"
                  variant={status === "connected" ? "outline" : "default"}
                  loaderClick
                  isLoading={status === "loading"}
                  onClick={() => handleConnect(p.id)}
                  disabled={status === "connected"}
                  className="rounded-full"
                >
                  {status === "connected" ? <><Check className="h-3.5 w-3.5" /> Connected</> : "Connect"}
                </Button>
              </div>
              {p.note && <p className="mt-2 text-[11px] text-muted-foreground">{p.note}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ProfileProps {
  bio: string; setBio: (v: string) => void;
  niche: string; setNiche: (v: string) => void;
  contactEmail: string; setContactEmail: (v: string) => void;
}
function StepProfile({ bio, setBio, niche, setNiche, contactEmail, setContactEmail }: ProfileProps) {
  return (
    <div>
      <span className="kp-eyebrow">Step 3 of 5</span>
      <h2 className="kp-display mt-3 text-2xl sm:text-3xl">Round out your profile.</h2>
      <div className="mt-6 space-y-4 sm:mt-8">
        <div>
          <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Bio</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 400))}
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="What kind of brands do you work with?"
          />
          <p className="mt-1 text-right text-[11px] text-muted-foreground">{bio.length}/400</p>
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Niche tags (comma-separated)</label>
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Tech, Lifestyle, Wellness"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Contact email</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="alex@email.com"
          />
        </div>
      </div>
    </div>
  );
}

interface TemplateProps {
  template: TemplateId;
  setTemplate: (v: TemplateId) => void;
}
function StepTemplate({ template, setTemplate }: TemplateProps) {
  const TEMPLATES: { id: TemplateId; name: string; vibe: string }[] = [
    { id: "minimal", name: "Minimal", vibe: "Linear / Notion" },
    { id: "bold", name: "Bold", vibe: "Music artist / Spotify" },
    { id: "professional", name: "Professional", vibe: "LinkedIn / Behance" },
  ];
  return (
    <div>
      <span className="kp-eyebrow">Step 4 of 5</span>
      <h2 className="kp-display mt-3 text-2xl sm:text-3xl">Pick a starting template.</h2>
      <p className="mt-2 text-muted-foreground">You can switch anytime — your content is preserved.</p>
      <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTemplate(t.id)}
            className={`group rounded-2xl border p-1 text-left transition ${
              template === t.id ? "border-primary shadow-glow" : "border-border hover:border-primary/40"
            }`}
          >
            <div className={`aspect-[3/4] rounded-xl ${
              t.id === "bold"
                ? "bg-gradient-to-br from-primary/40 to-primary-active/30"
                : t.id === "professional"
                  ? "bg-gradient-to-br from-surface-offset to-surface-2"
                  : "bg-surface-2"
            }`} />
            <div className="px-3 py-3">
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.vibe}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

interface PlanProps {
  plan: PlanChoice;
  setPlan: (v: PlanChoice) => void;
}
function StepPlan({ plan, setPlan }: PlanProps) {
  const locale = useLocaleStore();
  const PLANS: { id: PlanChoice; price: number; tag?: string; features: string[] }[] = [
    { id: "Free", price: 0, features: ["1 public page", "Basic template", "KitPager footer"] },
    { id: "Creator", price: 12, tag: "Most popular", features: ["All 3 templates", "Verified stats", "Country restrictions", "7-day free trial"] },
    { id: "Pro", price: 29, tag: "Best value", features: ["Everything in Creator", "Advanced analytics", "Viewed-by alerts", "Private shares"] },
  ];

  return (
    <div>
      <span className="kp-eyebrow">Step 5 of 5</span>
      <h2 className="kp-display mt-3 text-2xl sm:text-3xl">One last thing.</h2>
      <p className="mt-2 text-muted-foreground">Your first 7 days on any paid plan are free. Free needs no card.</p>
      <div className="mt-6 grid gap-3 sm:mt-8 md:grid-cols-3 md:gap-4">
        {PLANS.map((p) => {
          const selected = plan === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlan(p.id)}
              className={`relative rounded-2xl border p-5 text-left transition ${
                selected ? "border-primary shadow-glow" : "border-border hover:border-primary/40"
              }`}
            >
              {p.tag && (
                <span className={`absolute -top-2.5 left-4 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                  p.id === "Pro" ? "bg-primary text-primary-foreground" : "bg-warning/20 text-warning-foreground"
                }`}>
                  {p.tag}
                </span>
              )}
              <p className="text-sm font-semibold">{p.id}</p>
              <p className="kp-display mt-2 text-3xl">
                {p.price === 0 ? "Free" : formatPrice(p.price, locale)}
                {p.price > 0 && <span className="text-sm text-muted-foreground">/mo</span>}
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              {selected && (
                <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}