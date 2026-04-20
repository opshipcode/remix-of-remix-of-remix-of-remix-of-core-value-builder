import { useParams, Link, Navigate } from "react-router-dom";
import { PageHeader } from "@/components/marketing/PageHeader";

const DOCS: Record<string, { title: string; updated: string; sections: { h: string; p: string[] }[] }> = {
  terms: {
    title: "Terms of Service",
    updated: "April 1, 2026",
    sections: [
      { h: "1. Acceptance", p: ["By creating a KitPager account or using the service you agree to these Terms.", "If you do not agree, do not use the service."] },
      { h: "2. The service", p: ["KitPager provides hosted public pages, a creator dashboard, an inquiry inbox, and related tooling.", "Some features require a paid plan."] },
      { h: "3. Your account", p: ["You are responsible for keeping your credentials secure.", "You must be at least 16 to create an account."] },
      { h: "4. Acceptable use", p: ["No spam, harassment, illegal content, or impersonation. See the Acceptable Use Policy."] },
      { h: "5. Subscriptions and billing", p: ["Plans are billed in advance via Polar.sh. Refunds follow the Refund Policy."] },
      { h: "6. Termination", p: ["You may close your account at any time. We may suspend or terminate accounts that violate these Terms."] },
      { h: "7. Liability", p: ["The service is provided 'as is'. To the fullest extent permitted by law our liability is limited to fees paid in the prior 12 months."] },
      { h: "8. Changes", p: ["We may update these Terms with reasonable notice. Continued use after changes constitutes acceptance."] },
      { h: "9. Contact", p: ["Questions? legal@kitpager.pro"] },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: "April 1, 2026",
    sections: [
      { h: "Data we collect", p: ["Account info (email, name), platform handles, content metadata, billing identifiers, and usage analytics."] },
      { h: "How we use it", p: ["To run the service, prevent abuse, send transactional emails, and improve product quality."] },
      { h: "Sharing", p: ["We never sell data. Data is shared only with subprocessors necessary to operate the service."] },
      { h: "Your rights", p: ["You may request export, correction, or deletion of your data via /legal/data-request."] },
      { h: "Retention", p: ["Account data is kept while your account is active. Backups roll off after 30 days."] },
      { h: "Contact", p: ["privacy@kitpager.pro"] },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    updated: "April 1, 2026",
    sections: [
      { h: "What we use", p: ["A session cookie for authentication, a theme preference cookie, and first-party analytics."] },
      { h: "Third parties", p: ["Cloudflare Turnstile may set a transient cookie to mitigate bots."] },
      { h: "Choices", p: ["You can clear cookies in your browser at any time. Disabling auth cookies will sign you out."] },
    ],
  },
  "acceptable-use": {
    title: "Acceptable Use Policy",
    updated: "April 1, 2026",
    sections: [
      { h: "Prohibited", p: ["Illegal content, harassment, doxxing, hate speech, sexual content involving minors, fraud, or impersonation."] },
      { h: "Platform integrity", p: ["No scraping, bots, or attempts to circumvent rate limits, billing, or feature gates."] },
      { h: "Reporting", p: ["abuse@kitpager.pro — include URLs and a clear description."] },
    ],
  },
  dmca: {
    title: "DMCA Policy",
    updated: "April 1, 2026",
    sections: [
      { h: "How to file", p: ["Send a notice to dmca@kitpager.pro with the items required by 17 U.S.C. § 512(c)(3)."] },
      { h: "Counter-notice", p: ["You may file a counter-notice with the items required by 17 U.S.C. § 512(g)(3)."] },
      { h: "Repeat infringers", p: ["Accounts with repeated valid notices are terminated."] },
    ],
  },
  refunds: {
    title: "Refund Policy",
    updated: "April 1, 2026",
    sections: [
      { h: "Monthly plans", p: ["Cancel any time. Access continues until the end of the current period. No partial refunds."] },
      { h: "Annual plans", p: ["Pro-rata refund within the first 14 days. After that, no refund."] },
      { h: "Exceptions", p: ["Service-impacting outages may qualify for credit. Contact billing@kitpager.pro."] },
    ],
  },
  subprocessors: {
    title: "Subprocessors",
    updated: "April 1, 2026",
    sections: [
      { h: "Hosting and database", p: ["Supabase (US, EU regions)."] },
      { h: "Edge and CDN", p: ["Cloudflare."] },
      { h: "Email", p: ["Resend (primary), SMTP failover provider."] },
      { h: "Billing", p: ["Polar.sh."] },
      { h: "Bot mitigation", p: ["Cloudflare Turnstile."] },
    ],
  },
  "data-request": {
    title: "Data Subject Request",
    updated: "April 1, 2026",
    sections: [
      { h: "Submit a request", p: ["Email privacy@kitpager.pro from the address on your account, indicating: export, correction, or deletion."] },
      { h: "Verification", p: ["We may require additional verification before processing destructive requests."] },
      { h: "Timeline", p: ["We respond within 30 days, often within 7."] },
    ],
  },
};

const SLUG_ALIASES: Record<string, string> = { refund: "refunds", "data-requests": "data-request" };

export default function LegalPage() {
  const { slug = "" } = useParams();
  const key = SLUG_ALIASES[slug] ?? slug;
  const doc = DOCS[key];
  if (!doc) return <Navigate to="/legal/terms" replace />;

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={doc.title}
        subtitle={`Last updated ${doc.updated}`}
        align="left"
      />
      <section className="kp-container mt-12 grid gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">All documents</p>
          <ul className="mt-4 space-y-1.5 text-sm">
            {Object.entries(DOCS).map(([k, v]) => (
              <li key={k}>
                <Link
                  to={`/legal/${k}`}
                  className={`block rounded-lg px-3 py-2 transition ${k === key ? "bg-surface-2 text-foreground" : "text-muted-foreground hover:bg-surface hover:text-foreground"}`}
                >
                  {v.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        <article className="prose-kp space-y-10 pb-16">
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2 className="kp-display text-2xl">{s.h}</h2>
              {s.p.map((para, i) => (
                <p key={i} className="mt-3 text-sm leading-relaxed text-foreground/80 md:text-base">{para}</p>
              ))}
            </section>
          ))}
        </article>
      </section>
    </>
  );
}
