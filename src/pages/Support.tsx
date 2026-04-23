import { useState } from "react";
import { LifeBuoy, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";

type Subject =
  | "I can't connect my platform"
  | "My page isn't loading"
  | "Billing question"
  | "I found a bug"
  | "Feature question"
  | "Something else";

interface SupportMessage {
  id: string;
  name: string;
  email: string;
  subject: Subject;
  message: string;
  urgency: "Normal" | "Urgent";
  createdAt: string;
}

const SUBJECTS: Subject[] = [
  "I can't connect my platform",
  "My page isn't loading",
  "Billing question",
  "I found a bug",
  "Feature question",
  "Something else",
];

const FAQ = [
  {
    q: "How do I connect my TikTok account?",
    a: "Open Platforms in the sidebar and click Connect on the TikTok card. Until TikTok approves our developer access, follower counts are self-reported and clearly labeled.",
  },
  {
    q: "Why are my stats showing as self-reported?",
    a: "Self-reported means you typed the number yourself rather than us pulling it via OAuth. Connect each platform's official account to switch to verified stats automatically.",
  },
  {
    q: "How do I change my page slug?",
    a: "Go to Settings → Page. Slugs must be lowercase, 3–30 characters, and unique. Old links redirect to the new one for 30 days.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Settings → Billing → Cancel plan. You keep access until the end of your billing period. No retention games, no email loops.",
  },
  {
    q: "Can I remove the KitPager branding from my page?",
    a: "Yes — on Creator and Pro plans the footer 'Built with KitPager' is removed. Free plan pages keep a small footer.",
  },
  {
    q: "How do I add past brand work to my page?",
    a: "Builder → Brand collaborations. Add the brand name, logo, deliverables and results. Drag to reorder.",
  },
];

export default function Support() {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.displayName ?? "");
  const [subject, setSubject] = useState<Subject>("Something else");
  const [message, setMessage] = useState("");
  const [urgency, setUrgency] = useState<"Normal" | "Urgent">("Normal");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length < 20) return;
    setLoading(true);
    window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem("kp_support_messages");
        const list: SupportMessage[] = raw ? (JSON.parse(raw) as SupportMessage[]) : [];
        const next: SupportMessage = {
          id: Math.random().toString(36).slice(2, 10),
          name,
          email: user?.email ?? "",
          subject,
          message,
          urgency,
          createdAt: new Date().toISOString(),
        };
        window.localStorage.setItem(
          "kp_support_messages",
          JSON.stringify([next, ...list]),
        );
      } catch {
        /* ignore */
      }
      setLoading(false);
      setSent(true);
    }, 1400);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="kp-container max-w-5xl py-10 sm:py-14">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <div>
            <h1 className="kp-display text-3xl sm:text-4xl">Get help directly from the founder</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              KitPager is built and supported by one person. Every support request goes
              straight to my inbox.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary">
                P
              </span>
              <span>— Phemi, founder of KitPager.</span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Form */}
          <div className="kp-card p-6 sm:p-8">
            {sent ? (
              <div className="py-8 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/15 text-success">
                  <Check className="h-6 w-6" />
                </span>
                <h2 className="kp-display mt-4 text-2xl">Message sent</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  You'll hear back within 24 hours (urgent: 4 hours).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Name">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </Field>

                <Field label="Email">
                  <input
                    type="email"
                    value={user?.email ?? "you@email.com"}
                    readOnly
                    className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-muted-foreground"
                  />
                </Field>

                <Field label="Subject">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Subject)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Message" hint={`${message.length}/1000`}>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                    required
                    rows={6}
                    placeholder="Walk me through what's happening. Screenshots welcome on the next step."
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </Field>

                <Field label="Urgency">
                  <div className="grid grid-cols-2 gap-2">
                    {(["Normal", "Urgent"] as const).map((u) => (
                      <button
                        type="button"
                        key={u}
                        onClick={() => setUrgency(u)}
                        className={`rounded-full border px-3 py-2 text-xs transition ${
                          urgency === u
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-surface text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                  {urgency === "Urgent" && (
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Urgent requests are reviewed within 4 hours.
                    </p>
                  )}
                </Field>

                <Button
                  type="submit"
                  loaderClick
                  isLoading={loading}
                  size="lg"
                  className="w-full rounded-full"
                  disabled={message.length < 20}
                >
                  Send message
                </Button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="kp-display text-xl">Common questions</h2>
            <Accordion type="single" collapsible className="mt-4">
              {FAQ.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left text-sm">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="kp-card mt-6 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Response time
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span>Free plan</span>
                  <span className="kp-mono text-muted-foreground">Within 48 hours</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Creator plan</span>
                  <span className="kp-mono text-muted-foreground">Within 24 hours</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Pro plan</span>
                  <span className="kp-mono text-muted-foreground">Within 4 hours</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
