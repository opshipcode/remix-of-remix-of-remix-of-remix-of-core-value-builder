import { PageHeader, CTAStrip } from "@/components/marketing/PageHeader";
import { Lock, KeyRound, ShieldCheck, FileLock2, Globe2, ServerCog, Eye, Mail } from "lucide-react";

const PRINCIPLES = [
  { icon: Lock, title: "Encrypted in transit and at rest", body: "TLS 1.3 for every request. Database, storage and backups encrypted with AES-256." },
  { icon: KeyRound, title: "Server-side entitlement checks", body: "Every billing or feature gate runs on the server. The client is never trusted." },
  { icon: ShieldCheck, title: "Row-Level Security on every table", body: "Postgres RLS is enabled on day one — even during development. No exceptions." },
  { icon: FileLock2, title: "Token-scoped private shares", body: "Private creator pages issue short-lived tokens with passphrase gates." },
  { icon: Globe2, title: "Country-level access controls", body: "Creators can restrict their pages to specific countries with edge-evaluated rules." },
  { icon: ServerCog, title: "Quarterly third-party audit", body: "We schedule independent reviews of our auth, billing, and storage flows every quarter." },
  { icon: Eye, title: "Audit log for every sensitive action", body: "Sign-ins, password changes, page visibility changes, and admin actions are append-only." },
  { icon: Mail, title: "Verified outbound email", body: "DKIM, SPF and DMARC aligned. Bounce and complaint handling on every send." },
];

export default function Security() {
  return (
    <>
      <PageHeader
        eyebrow="Security"
        title={<>Built like the brand pages it ships.</>}
        subtitle="Calm engineering, careful defaults, and zero shortcuts on the things that protect creator data."
      />

      <section className="kp-container mt-16 grid gap-4 md:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="kp-card kp-card-hover p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-highlight text-primary">
                <p.icon className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-base font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="kp-container mt-24">
        <div className="kp-card p-8 md:p-12">
          <h2 className="kp-display text-3xl">Compliance posture</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Practical, transparent, and honest about where we are on the journey.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { k: "GDPR", v: "Compliant. Data subject requests handled within 30 days." },
              { k: "CCPA", v: "Compliant. Sale opt-out is irrelevant — we never sell user data." },
              { k: "SOC 2 Type II", v: "In progress. Targeting completion before public launch." },
            ].map((b) => (
              <div key={b.k} className="rounded-2xl border border-border bg-surface p-5">
                <p className="kp-mono text-xs text-muted-foreground">{b.k}</p>
                <p className="mt-2 text-sm">{b.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kp-container mt-12">
        <div className="rounded-2xl border border-border bg-surface p-6 text-sm">
          Found a security issue? Email{" "}
          <a href="mailto:security@kitpager.pro" className="text-primary hover:underline">
            security@kitpager.pro
          </a>{" "}
          — we respond within 24 hours and credit responsible disclosure in our changelog.
        </div>
      </section>

      <CTAStrip />
    </>
  );
}
