import { useThemeStore } from "@/store/theme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useThemeStore();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:text-foreground hover:bg-surface-2 ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
