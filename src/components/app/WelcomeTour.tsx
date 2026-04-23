import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  HomeIcon,
  GlobeAltIcon,
  PencilSquareIcon,
  DevicePhoneMobileIcon,
  InboxIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  MapIcon,
  LinkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Music2, Instagram, Youtube } from "lucide-react";

type Slide = {
  title: string;
  body: string;
  graphic: ReactNode;
};

const SLIDES: Slide[] = [
  {
    title: "Your command center",
    body: "Overview shows your page views, recent visitor locations, latest inquiries, and a world map of where your audience is coming from.",
    graphic: (
      <div className="flex items-center justify-center gap-3">
        <HomeIcon className="h-24 w-24 text-primary" />
        <GlobeAltIcon className="h-24 w-24 text-primary/60" />
      </div>
    ),
  },
  {
    title: "Design your pitch page",
    body: "The Builder lets you edit every section of your kit page — identity, platforms, content gallery, testimonials, and more. Switch templates live.",
    graphic: (
      <div className="flex items-center justify-center gap-3">
        <PencilSquareIcon className="h-24 w-24 text-primary" />
        <DevicePhoneMobileIcon className="h-24 w-24 text-primary/60" />
      </div>
    ),
  },
  {
    title: "Verified stats brands trust",
    body: "Connect your TikTok, Instagram, and YouTube accounts. KitPager pulls your real follower counts and engagement rates automatically.",
    graphic: (
      <div className="flex items-center justify-center gap-4">
        <Music2 className="h-20 w-20 text-primary" />
        <Instagram className="h-20 w-20 text-primary/80" />
        <Youtube className="h-20 w-20 text-primary/60" />
      </div>
    ),
  },
  {
    title: "Never lose a brand deal",
    body: "Every brand that fills out your inquiry form lands in Inquiries — structured, searchable, and tracked from first message to paid deal.",
    graphic: (
      <div className="flex items-center justify-center gap-3">
        <InboxIcon className="h-24 w-24 text-primary" />
        <CurrencyDollarIcon className="h-24 w-24 text-primary/60" />
      </div>
    ),
  },
  {
    title: "Know exactly who's looking",
    body: "Analytics shows which countries your visitors come from, your top referrers, and notifies you the moment a brand views your page.",
    graphic: (
      <div className="flex items-center justify-center gap-3">
        <ChartBarIcon className="h-24 w-24 text-primary" />
        <MapIcon className="h-24 w-24 text-primary/60" />
      </div>
    ),
  },
  {
    title: "You're ready",
    body: "Your page is ready to share. Copy your link and start pitching. The more you use KitPager, the stronger your page gets.",
    graphic: (
      <div className="relative flex items-center justify-center gap-3">
        <LinkIcon className="h-24 w-24 text-primary" />
        <SparklesIcon className="h-24 w-24 animate-pulse text-primary/70" />
      </div>
    ),
  },
];

const KEY = "kp_onboarded";

export function WelcomeTour() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(KEY)) return;
    const t = window.setTimeout(() => setOpen(true), 600);
    return () => window.clearTimeout(t);
  }, []);

  const close = () => {
    try {
      window.localStorage.setItem(KEY, "true");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const next = () => {
    if (index < SLIDES.length - 1) setIndex(index + 1);
    else close();
  };
  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40) next();
    else if (dx > 40) prev();
    touchStartX.current = null;
  };

  if (!open) return null;
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/60 p-3 backdrop-blur-md sm:p-6">
      <div
        className="kp-glass-strong w-full max-w-2xl overflow-hidden rounded-2xl border border-border shadow-2xl"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2 md:gap-8 md:p-10">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {index + 1} of {SLIDES.length}
            </p>
            <h2 className="kp-display mt-3 text-2xl sm:text-3xl">{slide.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {slide.body}
            </p>
          </div>
          <div className="grid h-48 place-items-center rounded-2xl bg-surface-2 p-4 sm:h-56">
            {slide.graphic}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4 sm:px-8">
          {isLast ? (
            <span />
          ) : (
            <button
              type="button"
              onClick={close}
              className="text-xs text-muted-foreground transition hover:text-foreground"
            >
              Skip
            </button>
          )}

          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              className="rounded-full px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground disabled:opacity-30"
            >
              Back
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-primary-hover"
            >
              {isLast ? "Let's go →" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
