import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Mail, MapPin, Languages, Calendar, Send, Star,
  Play, Eye, Heart, Lock,
  LucideIcon, Link2, Check,
  XIcon, Verified, Moon, Sun, ShieldCheck, MessageSquare, Clock,
  MessageCircle
} from "lucide-react";
import { useLocaleStore } from "@/store/locale";
import type { AudienceSnapshot } from "@/store/kitPage";
import { Testimonial } from "@/store/kitPage";
import { getCountry } from "@/lib/countries";
import { TemplateProps } from "./types";
import { formatDistanceToNow } from "date-fns";
import Brand from "../marketing/Brand";
import { getThemeCSS } from "@/lib/themePresets";

// ─── Types ───────────────────────────────────────────────────────────────────
// Add these to your KitPageData type:
// sectionVisibility?: Partial<Record<SectionKey, boolean>>;
// profileImage is required (not optional) — always use an image

export type SectionKey =
  | "platforms"
  | "audience"
  | "about"
  | "gallery"
  | "collabs"
  | "testimonials"
  | "rates"
  | "inquiry";

// ─── Utility Functions ────────────────────────────────────────────────────────
function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

/** Format NGN price */
function formatNGN(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function calculateAverageRating(testimonials: Testimonial[]): number {
  const visible = testimonials.filter((t) => t.visible && t.status === "approved");
  if (visible.length === 0) return 0;
  return visible.reduce((acc, t) => acc + t.rating, 0) / visible.length;
}

function timeAgo(date: string | Date | undefined): string {
  if (!date) return "";
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "";
  }
}

// ─── Stats Pill Component ────────────────────────────────────────────────────
function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl template-surface-2 template-border border px-3 py-2.5 text-center">
      <p className="text-[10px] template-text-muted leading-tight">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

// ─── Gallery Stats Calculator (inline or import from lib) ────────────────────
// Copy this from lib/videoMetadata.ts or import it:
function calculateGalleryStats(
  items: Array<{ views: number; likes: number; comments?: number; engagementRate?: number }>
) {
  const total = items.length;
  if (total === 0) {
    return { avgViews: 0, avgLikes: 0, avgComments: 0, avgEngagementRate: 0, totalViews: 0, totalLikes: 0, totalComments: 0 };
  }
  const totalViews = items.reduce((s, i) => s + (i.views || 0), 0);
  const totalLikes = items.reduce((s, i) => s + (i.likes || 0), 0);
  const totalComments = items.reduce((s, i) => s + (i.comments || 0), 0);
  return {
    avgViews: Math.round(totalViews / total),
    avgLikes: Math.round(totalLikes / total),
    avgComments: Math.round(totalComments / total),
    avgEngagementRate: parseFloat((items.reduce((s, i) => s + (i.engagementRate || 0), 0) / total).toFixed(1)),
    totalViews,
    totalLikes,
    totalComments,
  };
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function SectionWrapper({
  title,
  id,
  children,
  surface = false,
  className = "",
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
  surface?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`border-t template-border px-8 py-16 md:px-16 ${surface ? "template-surface" : ""} ${className}`}
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="kp-mono text-[10px] uppercase tracking-[0.22em] template-text-muted mb-8">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

// ─── Audience Section ─────────────────────────────────────────────────────────
interface AudienceProps {
  audience: AudienceSnapshot;
}

function AudienceSection({ audience }: AudienceProps) {
  const total =
    audience.genderSplit.female + audience.genderSplit.male + audience.genderSplit.other;
  const hasData = !!audience.primaryAge || total > 0 || audience.topCountries.length > 0;
  if (!hasData) return null;

  const genderLabel = total
    ? `${audience.genderSplit.female}% F · ${audience.genderSplit.male}% M · ${audience.genderSplit.other}% Other`
    : "—";

  const topCountriesDisplay = audience.topCountries
    .map((code) => {
      const country = getCountry(code);
      return country ? `${country.flag} ${country.name}` : code;
    })
    .join(" · ") || "—";

  return (
    <SectionWrapper title="Audience" surface>
      <div className="flex items-center gap-2 mb-6 -mt-2">
        {audience.isVerified ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-0.5 text-[11px] text-green-600 dark:text-green-400">
            <ShieldCheck className="h-3 w-3" /> Verified data
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-[11px] text-yellow-600 dark:text-yellow-400">
            <ShieldCheck className="h-3 w-3" /> Self-reported
          </span>
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <AudienceCell label="Primary age" value={audience.primaryAge ?? "—"} />
        <AudienceCell label="Gender split" value={genderLabel} />
        <AudienceCell label="Top markets" value={topCountriesDisplay} />
      </div>
    </SectionWrapper>
  );
}

function AudienceCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.14em] template-text-muted mb-1">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const sz = size === "xs" ? "h-3 w-3" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sz} ${i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  );
}

// ─── MinimalTemplate ──────────────────────────────────────────────────────────
export function MinimalTemplate({ data, preview }: TemplateProps) {
  const [localTheme, setLocalTheme] = useState<"light" | "dark">("light");
  const themeCSS = getThemeCSS(data.theme || "platform", localTheme);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "", email: "", budget: "", platform: "",
    campaignStart: "", campaignEnd: "", deliveryDate: "", details: ""
  });




  // Section visibility — default all true if not set
  const vis = (key: SectionKey) =>
    data.sectionVisibility?.[key] !== false;

  const visiblePlatforms = data.platforms.filter((p) => p.visible);

  // Last 10 of each, most-recent first
  const visibleTestimonials = useMemo(
    () =>
      [...data.testimonials]
        .filter((t) => t.visible && t.status === "approved")
        .reverse()
        .slice(0, 10),
    [data.testimonials]
  );

  const visibleCollabs = useMemo(
    () => [...data.brandCollabs].reverse().slice(0, 10),
    [data.brandCollabs]
  );

  const averageRating = useMemo(
    () => calculateAverageRating(data.testimonials),
    [data.testimonials]
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormValues({ ...formValues, [e.target.name]: e.target.value });

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOtp(true);
  };

  const verifyOtp = () => {
    if (otpValue === "1234") {
      setIsSuccess(true);
      setTimeout(() => {
        setShowOtp(false);
        setShowInquiryModal(false);
        setShowToast(true);
        setOtpValue("");
        setIsSuccess(false);
        setFormValues({
          name: "", email: "", budget: "", platform: "",
          campaignStart: "", campaignEnd: "", deliveryDate: "", details: ""
        });
        setTimeout(() => setShowToast(false), 4000);
      }, 1500);
    } else {
      setOtpError(true);
      setTimeout(() => setOtpError(false), 500);
    }
  };

  // Detect aspect ratio for gallery items
  const getAspectClass = (item: typeof data.contentGallery[number]) => {
    if (item.aspectRatio === "portrait") return "aspect-[9/16]";
    if (item.aspectRatio === "square") return "aspect-square";
    return "aspect-video"; // landscape default
  };

  // Responsive grid for gallery — portrait items get narrower cols
  const hasPortrait = data.contentGallery.some((c) => c.aspectRatio === "portrait");
  const galleryGridClass = hasPortrait
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
    : data.contentGallery.length === 1
    ? "grid-cols-1 max-w-xl"
    : data.contentGallery.length === 2
    ? "sm:grid-cols-2"
    : "sm:grid-cols-2 lg:grid-cols-3";

  const collabGridClass =
    visibleCollabs.length === 1
      ? "grid-cols-1"
      : visibleCollabs.length === 2
      ? "sm:grid-cols-2"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
    <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{ background: 'var(--template-gradient)' }}
      /> 
    <div
      className={`min-h-full z-10 relative ${localTheme === "dark" ? "dark" : ""}`}
      data-template="minimal"
      style={themeCSS as React.CSSProperties
      }
    >

       
      {/* ── SEO / Favicon ── */}
      <Helmet>
        <title>{data.displayName} · Creator Media Kit</title>
        <meta name="description" content={data.tagline} />
        <meta property="og:title" content={`${data.displayName} · Creator Media Kit`} />
        <meta property="og:description" content={data.tagline} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`https://kitpager.pro/${data.slug}`} />
        {data.profileImage && <meta property="og:image" content={data.profileImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${data.displayName} · Creator Media Kit`} />
        <meta name="twitter:description" content={data.tagline} />
        {data.profileImage && <meta name="twitter:image" content={data.profileImage} />}
        <meta name="keywords" content={data.nicheTags.join(", ")} />
        <link rel="canonical" href={`https://kitpager.pro/${data.slug}`} />
        {/* Profile image as favicon */}
        {data.profileImage && <link rel="icon" type="image/png" href={data.profileImage} />}
        {data.profileImage && <link rel="apple-touch-icon" href={data.profileImage} />}
      </Helmet>

      <style>{`
        [data-template="minimal"] {
          background: var(--template-bg);
          color: var(--template-fg);
          font-family: 'DM Sans', sans-serif;
        }
        [data-template="minimal"] .template-surface { background: var(--template-surface); }
        [data-template="minimal"] .template-surface-2 { background: var(--template-surface-2); }
        [data-template="minimal"] .template-border { border-color: var(--template-border); }
        [data-template="minimal"] .template-text-muted { color: var(--template-muted); }
        [data-template="minimal"] .template-primary { background: var(--template-primary); }
        [data-template="minimal"] .template-primary-text { color: var(--template-primary); }
        [data-template="minimal"] .kp-mono { font-family: 'DM Mono', monospace; }
        [data-template="minimal"] .kp-display { font-family: 'DM Serif Display', serif; }
      `}</style>

      {/* ── Theme Toggle ── */}
      <button
        onClick={() => setLocalTheme(localTheme === "light" ? "dark" : "light")}
        className="fixed right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full template-border template-surface-2 border shadow-lg transition-all hover:scale-105"
        aria-label="Toggle theme"
      >
        {localTheme === "light" ? (
          <Moon className="h-4 w-4 template-text-muted" />
        ) : (
          <Sun className="h-4 w-4 template-text-muted" />
        )}
      </button>

      {/* ── Toast ── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 flex items-center gap-3 rounded-2xl template-border template-surface border px-6 py-4 shadow-2xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
              <Check className="h-4 w-4" />
            </div>
            <div className="pr-4">
              <p className="text-sm font-bold">Proposal Sent!</p>
              <p className="text-[11px] template-text-muted">The creator will review and reach out soon.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="px-8 pt-20 pb-14 md:px-16 md:pt-28 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Avatar — always an image */}
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full template-border border md:h-28 md:w-28 shadow-lg">
            {data.profileImage ? (
              <img
                src={data.profileImage}
                alt={data.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(data.displayName)}&backgroundColor=6366f1&textColor=ffffff`}
                alt={data.displayName}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <p className="kp-mono mt-6 text-[10px] uppercase tracking-[0.22em] template-text-muted">
            kitpager.pro/{data.slug}
          </p>
          <h1 className="kp-display mt-2 text-4xl md:text-6xl">{data.displayName}</h1>
          <p className="mx-auto mt-4 max-w-xl text-base template-text-muted md:text-lg">
            {data.tagline}
          </p>

          {/* Niche tags */}
          {data.nicheTags.length > 0 && (
            <div className="mt-5 flex flex-wrap justify-center gap-1.5">
              {data.nicheTags.map((n) => (
                <span
                  key={n}
                  className="rounded-full template-border border px-2.5 py-0.5 text-[11px] template-text-muted"
                >
                  {n}
                </span>
              ))}
            </div>
          )}

          {/* About — moved to hero above stars */}
          {data.bio && (
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed opacity-80">
              {data.bio}
            </p>
          )}

          {/* Star rating */}
          {visibleTestimonials.length > 0 && averageRating > 0 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <Stars rating={averageRating} />
              <span className="text-sm font-medium">
                {averageRating.toFixed(1)}{" "}
                <span className="template-text-muted font-normal">
                  ({visibleTestimonials.length} reviews)
                </span>
              </span>
            </div>
          )}

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setShowInquiryModal(true)}
              className="inline-flex items-center gap-2 rounded-full template-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              <Send className="h-4 w-4" /> Send inquiry
            </button>
            <a
              href={`mailto:${data.contactEmail}`}
              className="inline-flex items-center gap-2 rounded-full template-border border px-5 py-2.5 text-sm template-surface-2 hover:opacity-80 transition-opacity"
            >
              <Mail className="h-4 w-4" /> {data.contactEmail}
            </a>
            <a
              href="#testimonials"
              className="inline-flex items-center gap-2 rounded-full template-border border px-5 py-2.5 text-sm template-surface-2 hover:opacity-80 transition-opacity"
            >
              <Star className="h-4 w-4" /> Reviews
            </a>
          </div>

          {/* Meta row */}
          {(data.location || data.languages?.length || data.creatingSince) && (
            <div className="mt-10 flex flex-wrap items-start justify-center gap-8">
              {data.location && (
                <Meta icon={MapPin} label="Location" value={data.location} />
              )}
              {data.languages?.length > 0 && (
                <Meta icon={Languages} label="Languages" value={data.languages.join(", ")} />
              )}
              {data.creatingSince && (
                <Meta icon={Calendar} label="Creating since" value={`${String(data.creatingSince)} (${new Date().getFullYear() - data.creatingSince} years)`} />
              )}
            </div>
          )}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          PLATFORMS
      ══════════════════════════════════════════ */}
      {vis("platforms") && visiblePlatforms.length > 0 && (
        <section className="template-border template-surface border-y px-8 py-12 md:px-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="kp-mono text-[10px] uppercase tracking-[0.22em] template-text-muted mb-8">
              Platforms
            </h2>
            {/* Dynamic grid — auto-fits any number of platforms */}
            <div
              className="grid gap-8 text-center"
              style={{
                gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))`,
              }}
            >
              {visiblePlatforms.map((p) => (
                <div key={p.id}>
                  <p className="kp-mono text-[10px] uppercase tracking-[0.2em] template-text-muted">
                    {p.platform}
                  </p>
                  <p className="kp-display mt-2 text-3xl font-medium">{fmt(p.followers)}</p>
                  <a
                    href={p.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center justify-center gap-1 text-xs template-text-muted hover:opacity-70 transition-opacity"
                  >
                    {p.handle} <Link2 className="h-3 w-3 rotate-45" />
                  </a>
                  {/* Updated timestamp */}
                  {p.updatedAt && (
                    <p className="mt-1.5 flex items-center justify-center gap-1 text-[10px] template-text-muted">
                      <Clock className="h-2.5 w-2.5" />
                      Updated {timeAgo(p.updatedAt)}
                    </p>
                  )}
                  {p.selfReported && (
                    <p className="mt-1 text-[10px] italic template-text-muted">self-reported</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          AUDIENCE
      ══════════════════════════════════════════ */}
      {vis("audience") && <AudienceSection audience={data.audience} />}

      {/* ══════════════════════════════════════════
          CONTENT GALLERY
      ══════════════════════════════════════════ */}
      {vis("gallery") && data.contentGallery.length > 0 && (
        <SectionWrapper title="Recent work">
          {/* ─── Stats Row ───────────────────────────────────────────────── */}
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatPill
              label="Avg Views"
              value={fmt(calculateGalleryStats(data.contentGallery).avgViews)}
            />
            <StatPill
              label="Avg Likes"
              value={fmt(calculateGalleryStats(data.contentGallery).avgLikes)}
            />
            <StatPill
              label="Avg Comments"
              value={fmt(calculateGalleryStats(data.contentGallery).avgComments)}
            />
            <StatPill
              label="Engagement"
              value={`${calculateGalleryStats(data.contentGallery).avgEngagementRate}%`}
            />
          </div>

          {/* ─── Gallery Grid ────────────────────────────────────────────── */}
          <div className={`grid gap-4 ${galleryGridClass}`}>
            {data.contentGallery.map((c) => (
              <a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                {/* Thumbnail */}
                <div
                  className={`relative overflow-hidden rounded-2xl template-border template-surface-2 border ${getAspectClass(c)}`}
                >
                  {c.thumbnailUrl ? (
                    <img
                      src={c.thumbnailUrl}
                      alt={c.fetchedTitle || c.caption}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-black/10 backdrop-blur-sm">
                        <Play className="h-4 w-4 fill-white text-white" />
                      </span>
                    </div>
                  )}

                  {/* Platform badge */}
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                    {c.platform === "tiktok" ? "TikTok" : c.platform === "instagram" ? "IG" : "YT"}
                  </span>

                  {/* Featured badge */}
                  {c.featured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full template-primary px-2 py-0.5 text-[10px] text-white">
                      <Star className="h-2.5 w-2.5 fill-current" /> Featured
                    </span>
                  )}

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-black/50 backdrop-blur">
                      <Play className="h-3.5 w-3.5 fill-white text-white" />
                    </span>
                  </div>
                </div>

                {/* Title / Caption */}
                <p className="mt-2.5 line-clamp-2 text-sm font-medium">
                  {c.fetchedTitle || c.caption || "Untitled"}
                </p>

                {/* Stats row */}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] template-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {fmt(c.views)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3 w-3" /> {fmt(c.likes)}
                  </span>
                  {c.comments != null && c.comments > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" /> {fmt(c.comments)}
                    </span>
                  )}
                  <span className="tabular-nums">{c.engagementRate.toFixed(1)}% ER</span>
                  {c.selfReported && (
                    <span className="italic opacity-70">self-reported</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </SectionWrapper>
      )}

      {/* ══════════════════════════════════════════
          BRAND COLLABORATIONS
      ══════════════════════════════════════════ */}
      {vis("collabs") && visibleCollabs.length > 0 && (
        <SectionWrapper title="Brand collaborations" surface>
          <div className={`grid gap-5 ${collabGridClass}`}>
            {visibleCollabs.map((b) => (
            <div key={b.id} className="border-l-2 template-border pl-4">
              <p className="kp-display text-lg font-semibold">{b.brandName}</p>
              <p className="mt-1 text-sm template-text-muted">{b.deliverables}</p>
              {b.results && <p className="mt-1 text-xs opacity-70">{b.results}</p>}
              {b.collabVideoThumbnail && (
                <div className="mt-3 relative rounded-xl overflow-hidden aspect-video">
                  <img
                    src={b.collabVideoThumbnail}
                    alt={`${b.brandName} collab`}
                    className="w-full h-full object-cover"
                  />
                  {b.collabVideoViews != null && (
                    <div className="absolute bottom-2 left-2 flex gap-3 text-[10px] text-white bg-black/60 rounded-full px-3 py-1">
                      <span><Eye className="h-3 w-3 inline mr-1" />{fmt(b.collabVideoViews)}</span>
                      <span><Heart className="h-3 w-3 inline mr-1" />{fmt(b.collabVideoLikes ?? 0)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          </div>
        </SectionWrapper>
      )}

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      {vis("testimonials") && (
        <SectionWrapper title="What brands say" id="testimonials">
          {visibleTestimonials.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {visibleTestimonials.map((t) => (
                <figure
                  key={t.id}
                  className="rounded-2xl template-border template-surface border p-5"
                >
                  <Stars rating={t.rating} size="xs" />
                  <blockquote className="mt-3 text-sm leading-relaxed opacity-85">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-2 text-xs template-text-muted">
                    {t.reviewerName}, {t.brandName}
                    {t.verified && <Verified className="h-3.5 w-3.5 text-blue-500" />}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="text-sm template-text-muted">No reviews yet.</p>
          )}

          {/* Leave a review CTA */}
          <div className="mt-10 flex justify-center">
            <a
              href={`${window.location.origin}/${data.slug}/review`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full template-border border px-5 py-2.5 text-sm hover:opacity-70 transition-opacity"
            >
              <MessageSquare className="h-4 w-4" /> Leave a review
            </a>
          </div>
        </SectionWrapper>
      )}

      {/* ══════════════════════════════════════════
          RATES
      ══════════════════════════════════════════ */}
      {vis("rates") && data.rates.rows.length > 0 && (
        <SectionWrapper title="Rates" surface>
          <div className="divide-y template-border">
            {data.rates.rows.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-semibold">{r.deliverable}</p>
                  {r.notes && (
                    <p className="mt-0.5 text-xs template-text-muted">{r.notes}</p>
                  )}
                </div>
                {data.rates.isPublic ? (
                  <span className="kp-display text-xl font-semibold">
                    {formatNGN(r.priceUSD)}
                  </span>
                ) : (
                  <a
                    href="#inquiry"
                    onClick={() => setShowInquiryModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs template-text-muted hover:opacity-70 transition-opacity"
                  >
                    <Lock className="h-3 w-3" /> By inquiry
                  </a>
                )}
              </div>
            ))}
          </div>
          {(data.rates.turnaround || data.rates.licensingNotes) && (
            <p className="mt-6 text-xs template-text-muted">
              {data.rates.turnaround && <>Turnaround: {data.rates.turnaround}. </>}
              {data.rates.licensingNotes}
            </p>
          )}
        </SectionWrapper>
      )}

      {/* ══════════════════════════════════════════
          INQUIRY / WORK TOGETHER
      ══════════════════════════════════════════ */}
      {vis("inquiry") && (
        <SectionWrapper title="Work together" id="inquiry">
          <div className="mx-auto max-w-xl text-center">
            {data.inquirySettings?.introMessage && (
              <p className="text-sm template-text-muted mb-8">
                {data.inquirySettings.introMessage}
              </p>
            )}
            <button
              onClick={() => setShowInquiryModal(true)}
              className="inline-flex items-center gap-2 rounded-full template-primary px-6 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              <Send className="h-4 w-4" /> Send inquiry
            </button>
            <a
              href={`mailto:${data.contactEmail}`}
              className="mt-3 flex items-center justify-center gap-1.5 text-sm template-text-muted hover:opacity-70 transition-opacity"
            >
              <Mail className="h-4 w-4" /> {data.contactEmail}
            </a>
          </div>
        </SectionWrapper>
      )}

      {/* ══════════════════════════════════════════
          INQUIRY MODAL
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {showInquiryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !showOtp && setShowInquiryModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl template-border template-surface border p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowInquiryModal(false)}
                className="absolute right-6 top-6 rounded-full p-2 template-surface-2 hover:opacity-80 transition-opacity"
              >
                <XIcon className="h-5 w-5" />
              </button>
              <div className="mb-8">
                <h2 className="kp-display text-2xl font-semibold">Start an Inquiry</h2>
                <p className="mt-2 text-sm template-text-muted">
                  Fill in campaign details to verify and send.
                </p>
              </div>
              <form className="grid gap-6" onSubmit={handleSendProposal}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="Name" name="name" value={formValues.name} onChange={handleInputChange} placeholder="Your name" required />
                  <FormField label="Email" name="email" type="email" value={formValues.email} onChange={handleInputChange} placeholder="brand@company.com" required />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider template-text-muted ml-1">
                      Budget
                    </label>
                    <select
                      name="budget"
                      value={formValues.budget}
                      onChange={handleInputChange}
                      className="w-full rounded-xl template-border template-surface border px-4 py-3 text-sm focus:outline-none"
                    >
                      <option value="">Select range</option>
                      <option value="<100k">Under ₦100,000</option>
                      <option value="100k-500k">₦100,000 – ₦500,000</option>
                      <option value="500k-1m">₦500,000 – ₦1,000,000</option>
                      <option value="1m+">₦1,000,000+</option>
                    </select>
                  </div>
                  <FormField label="Platform" name="platform" value={formValues.platform} onChange={handleInputChange} placeholder="e.g. TikTok" optional />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Start Date" name="campaignStart" type="date" value={formValues.campaignStart} onChange={handleInputChange} required />
                  <FormField label="End Date" name="campaignEnd" type="date" value={formValues.campaignEnd} onChange={handleInputChange} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider template-text-muted ml-1">
                    Campaign Details
                  </label>
                  <textarea
                    name="details"
                    rows={4}
                    value={formValues.details}
                    onChange={handleInputChange}
                    placeholder="Campaign goals, deliverables, references…"
                    className="w-full rounded-xl template-border template-surface border px-4 py-3 text-sm focus:outline-none resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl template-primary py-4 text-sm font-bold text-white hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <Send className="h-4 w-4" /> Verify & Send
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* OTP Modal */}
        {showOtp && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl template-border template-surface border p-8 shadow-2xl"
            >
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <Mail className="h-6 w-6" />
                      </div>
                      <h3 className="kp-display text-xl font-semibold">Security Code</h3>
                      <p className="mt-2 text-xs template-text-muted">
                        Enter <b>1234</b> to verify your email.
                      </p>
                    </div>
                    <div className="mt-8 space-y-6">
                      <input
                        type="text"
                        maxLength={4}
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                        className={`w-full template-surface-2 text-center text-3xl font-bold tracking-[0.5em] py-5 rounded-2xl border ${otpError ? "border-red-500" : "template-border"} focus:outline-none transition-colors`}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setShowOtp(false)}
                          className="rounded-xl template-border border py-3 text-sm font-medium"
                        >
                          Back
                        </button>
                        <button
                          onClick={verifyOtp}
                          className="rounded-xl template-primary text-white py-3 text-sm font-bold"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-6 text-center"
                  >
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white">
                      <Check className="h-10 w-10 stroke-[3]" />
                    </div>
                    <h3 className="kp-display text-2xl font-bold">Proposal Sent!</h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Footer ── */}
      <footer className="border-t w-full flex align-center justify-center template-border px-8 py-10 text-center">
          <div className="flex flex-col items-center gap-2 text-xs template-text-muted">



    {/* Legal line */}
    <p className="opacity-70 leading-relaxed max-w-md">
      Metrics may be self-reported and are not guaranteed. 
      Kitpager is not a party to brand-creator agreements.
    </p>

    {/* Links */}
    <div className="flex gap-4 text-[11px] opacity-70">
      <a href="/terms" target="-blank" className="hover:opacity-100">Terms</a>
      <a href="/privacy" target="-blank" className="hover:opacity-100">Privacy</a>
    </div>

  </div>
      </footer>
    </div>
    </>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────────
function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex w-1/4 flex-col items-center text-center">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full template-surface-2 template-text-muted">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] template-text-muted opacity-60">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  optional = false,
}: {
  label: string;
  name: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider template-text-muted ml-1">
        {label}{" "}
        {optional && (
          <span className="lowercase font-normal opacity-50">(optional)</span>
        )}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl template-border template-surface border px-4 py-3 text-sm focus:outline-none transition-all"
      />
    </div>
  );
}