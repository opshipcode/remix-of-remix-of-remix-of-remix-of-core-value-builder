import { useState } from "react";
import { Mail, MessageSquare, Building2 } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <section className="bg-hero">
        <div className="kp-container py-20 text-center md:py-28">
          <span className="kp-eyebrow">Contact</span>
          <h1 className="kp-display mt-5 text-5xl md:text-6xl">Talk to us.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Sales, support, partnerships, press — we read everything.
          </p>
        </div>
      </section>

      <section className="kp-container grid gap-8 py-16 md:grid-cols-[1fr_1.4fr] md:py-24">
        <div className="space-y-6">
          {[
            { icon: Mail, label: "Support", v: "support@kitpager.pro" },
            { icon: MessageSquare, label: "Sales", v: "hello@kitpager.pro" },
            { icon: Building2, label: "Press", v: "press@kitpager.pro" },
          ].map((c) => (
            <div key={c.label} className="kp-card flex items-start gap-4 p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-highlight text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{c.label}</p>
                <p className="kp-mono mt-1 text-sm">{c.v}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="kp-card p-8 md:p-10"
        >
          <h2 className="kp-display text-2xl">Send us a note</h2>
          <p className="mt-1 text-sm text-muted-foreground">We reply within one business day.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Your name" name="name" />
            <Field label="Email" name="email" type="email" />
          </div>
          <div className="mt-4">
            <Field label="Subject" name="subject" />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Message</label>
            <textarea
              name="message"
              rows={5}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="What's going on?"
            />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Protected by Cloudflare Turnstile</p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
            >
              {submitted ? "Sent — we'll reply shortly" : "Send message"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
