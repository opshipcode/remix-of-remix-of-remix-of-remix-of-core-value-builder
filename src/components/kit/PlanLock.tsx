import { Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PlanLockTarget } from "@/components/ui/button";

interface PlanLockProps {
  plan: PlanLockTarget;
  tooltip?: string;
  inline?: boolean;
  className?: string;
  onClick?: () => void;
}

const PLAN_STYLES: Record<PlanLockTarget, string> = {
  Creator:
    "bg-warning/15 text-warning border-warning/40 hover:bg-warning/25",
  Pro: "bg-primary/15 text-primary border-primary/40 hover:bg-primary/25",
};

export function PlanLock({
  plan,
  tooltip,
  inline = true,
  className = "",
  onClick,
}: PlanLockProps) {
  const message = tooltip ?? `Upgrade to ${plan} to unlock this feature`;

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    window.dispatchEvent(
      new CustomEvent<{ targetPlan: PlanLockTarget; featureName: string }>(
        "kp:upgrade",
        { detail: { targetPlan: plan, featureName: message } },
      ),
    );
  };

  const base =
    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors";

  const content = (
    <button
      type="button"
      onClick={handleClick}
      className={`${base} ${PLAN_STYLES[plan]} ${className}`}
      aria-label={message}
    >
      <Lock className="h-3 w-3" />
      {plan}
    </button>
  );

  if (inline) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="top">{message}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}
