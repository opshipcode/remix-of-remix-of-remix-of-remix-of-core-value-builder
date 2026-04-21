import { useEffect, useState } from "react";

const ONBOARDED_KEY = "kp_onboarded";

interface HelpStep {
  targetId: string;
  title: string;
  body: string;
  position: "top" | "bottom" | "left" | "right";
}

const STEPS: HelpStep[] = [
  {
    targetId: "kp-sidebar-nav",
    title: "Everything lives here",
    body: "Your main workspace navigation. Builder, platforms, analytics, and settings.",
    position: "right",
  },
  {
    targetId: "kp-nav-builder",
    title: "This is your page editor",
    body: "Open the builder to customize every section that brands will see.",
    position: "right",
  },
  {
    targetId: "kp-nav-platforms",
    title: "Connect your channels",
    body: "Link TikTok, Instagram, Facebook, and YouTube for verified follower counts.",
    position: "right",
  },
  {
    targetId: "kp-view-page",
    title: "See what brands see",
    body: "Open your live page in a new tab any time from the workspace header.",
    position: "bottom",
  },
];

interface BubblePos {
  top: number;
  left: number;
}

export function HelpBubble() {
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [pos, setPos] = useState<BubblePos | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(ONBOARDED_KEY) === "true") return;
    // Defer so target elements have mounted
    const t = window.setTimeout(() => setActive(true), 1500);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!active) return;
    const step = STEPS[stepIdx];
    if (!step) return;
    const target = document.getElementById(step.targetId);
    if (!target) {
      // skip missing target
      handleNext();
      return;
    }
    const rect = target.getBoundingClientRect();
    const offsets: Record<HelpStep["position"], BubblePos> = {
      right: { top: rect.top + rect.height / 2 - 40, left: rect.right + 12 },
      left: { top: rect.top + rect.height / 2 - 40, left: rect.left - 312 },
      bottom: { top: rect.bottom + 12, left: rect.left },
      top: { top: rect.top - 120, left: rect.left },
    };
    setPos(offsets[step.position]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stepIdx]);

  function finish() {
    window.localStorage.setItem(ONBOARDED_KEY, "true");
    setActive(false);
  }

  function handleNext() {
    if (stepIdx >= STEPS.length - 1) {
      finish();
      return;
    }
    setStepIdx((i) => i + 1);
  }

  if (!active || !pos) return null;
  const step = STEPS[stepIdx];

  return (
    <div
      role="dialog"
      aria-label={step.title}
      className="kp-glass-strong fixed z-50 w-[300px] rounded-2xl p-4 shadow-lg animate-in fade-in zoom-in-95"
      style={{ top: pos.top, left: pos.left }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Step {stepIdx + 1} of {STEPS.length}
      </p>
      <h4 className="mt-1 text-sm font-semibold text-foreground">{step.title}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{step.body}</p>
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={finish}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Skip tour
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          {stepIdx === STEPS.length - 1 ? "Finish" : "Next →"}
        </button>
      </div>
    </div>
  );
}
