// src/components/editor/ThemePicker.tsx
import React from "react";
import { Check, Lock, Palette } from "lucide-react";
import { THEME_PRESETS, ThemePresetId } from "@/lib/themePresets";
import { useEffectivePlan, planMeets } from "@/store/plan";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface ThemePickerProps {
  current: ThemePresetId;
  onSelect: (themeId: ThemePresetId) => void;
  plan: ReturnType<typeof useEffectivePlan>;
}

export function ThemePicker({ current, onSelect, plan }: ThemePickerProps) {
  const isPaidPlan = true; // Adjust to match your plan logic
  const themeIds = Object.keys(THEME_PRESETS) as ThemePresetId[];
  
  const handleSelect = (themeId: ThemePresetId) => {
    if (themeId !== "platform" && !isPaidPlan) {
      window.dispatchEvent(
        new CustomEvent("kp:upgrade", {
          detail: { 
            targetPlan: "pro", 
            featureName: `${THEME_PRESETS[themeId].label} theme` 
          },
        })
      );
      return;
    }
    
    onSelect(themeId);
    toast({ 
      title: "Theme applied", 
      description: `${THEME_PRESETS[themeId].label} theme is now active.` 
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Palette className="h-4 w-4 text-muted-foreground" />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Theme Colors
        </p>
        {!isPaidPlan && (
          <Link
            to="/app/settings/billing"
            className="ml-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 transition-colors"
          >
            Upgrade →
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {themeIds.map((themeId) => {
          const theme = THEME_PRESETS[themeId];
          const isActive = current === themeId;
          const isLocked = themeId !== "platform" && !isPaidPlan;
          
          return (
            <button
              key={themeId}
              onClick={() => handleSelect(themeId)}
              disabled={isLocked && !isPaidPlan}
              className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all hover:shadow-md ${
                isActive 
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                  : "border-border bg-surface hover:bg-surface-2"
              } ${isLocked ? "opacity-60" : ""}`}
            >
              {/* Theme preview swatches */}
              <div className="flex gap-1 mb-2">
                <div 
                  className="h-6 w-6 rounded-full border border-border/30" 
                  style={{ backgroundColor: theme.colors.light.primary }}
                />
                <div 
                  className="h-6 w-6 rounded-full border border-border/30" 
                  style={{ backgroundColor: theme.colors.light.surface }}
                />
                <div 
                  className="h-6 w-6 rounded-full border border-border/30" 
                  style={{ backgroundColor: theme.colors.light.muted }}
                />
              </div>
              
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold">{theme.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {theme.description}
                  </p>
                </div>
                
                {isActive && (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                
                {isLocked && (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
                )}
              </div>
              
              {/* Gradient preview */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ background: theme.colors.light.gradient }}
              />
            </button>
          );
        })}
      </div>
      
      {!isPaidPlan && (
        <div className="mt-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
          <p className="text-[10px] text-amber-700 dark:text-amber-300 leading-relaxed">
            <Lock className="h-3 w-3 inline mr-1" />
            Custom themes are a paid feature. Upgrade to unlock all 9 premium themes.
          </p>
        </div>
      )}
    </div>
  );
}