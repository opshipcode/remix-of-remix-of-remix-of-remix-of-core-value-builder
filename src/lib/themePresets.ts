// src/lib/themePresets.ts

export type ThemePresetId = 
  | "platform" // default - uses app theme
  | "ocean" 
  | "sunset" 
  | "forest" 
  | "aurora" 
  | "midnight" 
  | "rosegold" 
  | "emerald" 
  | "lavender" 
  | "amber";

export interface ThemePreset {
  id: ThemePresetId;
  label: string;
  description: string;
  colors: {
    light: {
      bg: string;
      fg: string;
      surface: string;
      surface2: string;
      border: string;
      muted: string;
      primary: string;
      gradient: string; // background gradient for premium feel
    };
    dark: {
      bg: string;
      fg: string;
      surface: string;
      surface2: string;
      border: string;
      muted: string;
      primary: string;
      gradient: string;
    };
  };
}

export const THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
  platform: {
    id: "platform",
    label: "Platform",
    description: "Default app theme colors",
    colors: {
      light: {
        bg: "#ffffff",
        fg: "#0a0a0a",
        surface: "#f9fafb",
        surface2: "#f3f4f6",
        border: "#e5e7eb",
        muted: "#6b7280",
        primary: "#4f46e5",
        gradient: "radial-gradient(ellipse at top, rgba(79,70,229,0.08), transparent 50%)",
      },
      dark: {
        bg: "#0a0a0a",
        fg: "#f5f5f5",
        surface: "#141414",
        surface2: "#222",
        border: "#2a2a2a",
        muted: "#888",
        primary: "#6366f1",
        gradient: "radial-gradient(ellipse at top, rgba(99,102,241,0.12), transparent 50%)",
      },
    },
  },
  ocean: {
    id: "ocean",
    label: "Ocean",
    description: "Calm blues and teals",
    colors: {
      light: {
        bg: "#f0f9ff",
        fg: "#0c4a6e",
        surface: "#e0f2fe",
        surface2: "#bae6fd",
        border: "#7dd3fc",
        muted: "#0369a1",
        primary: "#0284c7",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(2,132,199,0.1), rgba(56,189,248,0.05) 40%, transparent 70%)",
      },
      dark: {
        bg: "#0c1929",
        fg: "#e0f2fe",
        surface: "#122543",
        surface2: "#1a3257",
        border: "#1e4976",
        muted: "#7dd3fc",
        primary: "#38bdf8",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.15), rgba(14,165,233,0.05) 40%, transparent 70%)",
      },
    },
  },
  sunset: {
    id: "sunset",
    label: "Sunset",
    description: "Warm oranges and purples",
    colors: {
      light: {
        bg: "#fff7ed",
        fg: "#7c2d12",
        surface: "#ffedd5",
        surface2: "#fed7aa",
        border: "#fdba74",
        muted: "#c2410c",
        primary: "#ea580c",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(234,88,12,0.12), rgba(147,51,234,0.06) 50%, transparent 70%)",
      },
      dark: {
        bg: "#1a0e14",
        fg: "#ffedd5",
        surface: "#241520",
        surface2: "#2d1d27",
        border: "#4a2d3a",
        muted: "#fdba74",
        primary: "#f97316",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.15), rgba(147,51,234,0.08) 50%, transparent 70%)",
      },
    },
  },
  forest: {
    id: "forest",
    label: "Forest",
    description: "Natural greens and earth tones",
    colors: {
      light: {
        bg: "#f0fdf4",
        fg: "#14532d",
        surface: "#dcfce7",
        surface2: "#bbf7d0",
        border: "#86efac",
        muted: "#15803d",
        primary: "#16a34a",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(22,163,74,0.1), rgba(34,197,94,0.04) 40%, transparent 70%)",
      },
      dark: {
        bg: "#0a1a0f",
        fg: "#dcfce7",
        surface: "#0f2415",
        surface2: "#172e1d",
        border: "#1f4527",
        muted: "#86efac",
        primary: "#22c55e",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.15), rgba(74,222,128,0.05) 40%, transparent 70%)",
      },
    },
  },
  aurora: {
    id: "aurora",
    label: "Aurora",
    description: "Vibrant cyan to purple gradients",
    colors: {
      light: {
        bg: "#f5f3ff",
        fg: "#2e1065",
        surface: "#ede9fe",
        surface2: "#ddd6fe",
        border: "#c4b5fd",
        muted: "#6d28d9",
        primary: "#7c3aed",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12), rgba(6,182,212,0.08) 40%, transparent 70%)",
      },
      dark: {
        bg: "#0f0a1a",
        fg: "#ede9fe",
        surface: "#1a1228",
        surface2: "#231b38",
        border: "#362c54",
        muted: "#c4b5fd",
        primary: "#a78bfa",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(167,139,250,0.18), rgba(6,182,212,0.1) 40%, transparent 70%)",
      },
    },
  },
  midnight: {
    id: "midnight",
    label: "Midnight",
    description: "Deep blues with subtle gradients",
    colors: {
      light: {
        bg: "#f8fafc",
        fg: "#0f172a",
        surface: "#f1f5f9",
        surface2: "#e2e8f0",
        border: "#cbd5e1",
        muted: "#475569",
        primary: "#3b82f6",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08), transparent 50%)",
      },
      dark: {
        bg: "#070c19",
        fg: "#e2e8f0",
        surface: "#0d1525",
        surface2: "#141f38",
        border: "#1e2d4a",
        muted: "#94a3b8",
        primary: "#60a5fa",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(96,165,250,0.15), rgba(59,130,246,0.05) 40%, transparent 70%)",
      },
    },
  },
  rosegold: {
    id: "rosegold",
    label: "Rose Gold",
    description: "Elegant pinks and golds",
    colors: {
      light: {
        bg: "#fff1f2",
        fg: "#881337",
        surface: "#ffe4e6",
        surface2: "#fecdd3",
        border: "#fda4af",
        muted: "#be123c",
        primary: "#e11d48",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(225,29,72,0.1), rgba(245,158,11,0.06) 40%, transparent 70%)",
      },
      dark: {
        bg: "#1a0f12",
        fg: "#ffe4e6",
        surface: "#24151a",
        surface2: "#2d1d24",
        border: "#4a2d36",
        muted: "#fda4af",
        primary: "#fb7185",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(251,113,133,0.15), rgba(245,158,11,0.08) 40%, transparent 70%)",
      },
    },
  },
  emerald: {
    id: "emerald",
    label: "Emerald",
    description: "Rich emerald with gold accents",
    colors: {
      light: {
        bg: "#ecfdf5",
        fg: "#064e3b",
        surface: "#d1fae5",
        surface2: "#a7f3d0",
        border: "#6ee7b7",
        muted: "#047857",
        primary: "#059669",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(5,150,105,0.1), rgba(52,211,153,0.05) 40%, transparent 70%)",
      },
      dark: {
        bg: "#081a13",
        fg: "#d1fae5",
        surface: "#0d2419",
        surface2: "#132e20",
        border: "#1a452e",
        muted: "#6ee7b7",
        primary: "#34d399",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.18), rgba(5,150,105,0.08) 40%, transparent 70%)",
      },
    },
  },
  lavender: {
    id: "lavender",
    label: "Lavender",
    description: "Soft purples and mauves",
    colors: {
      light: {
        bg: "#faf5ff",
        fg: "#4a044e",
        surface: "#f3e8ff",
        surface2: "#e9d5ff",
        border: "#d8b4fe",
        muted: "#7e22ce",
        primary: "#9333ea",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(147,51,234,0.1), rgba(192,132,252,0.05) 40%, transparent 70%)",
      },
      dark: {
        bg: "#140a1f",
        fg: "#f3e8ff",
        surface: "#1e122c",
        surface2: "#281a3a",
        border: "#3b2454",
        muted: "#d8b4fe",
        primary: "#c084fc",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(192,132,252,0.18), rgba(147,51,234,0.08) 40%, transparent 70%)",
      },
    },
  },
  amber: {
    id: "amber",
    label: "Amber",
    description: "Warm golden tones",
    colors: {
      light: {
        bg: "#fffbeb",
        fg: "#78350f",
        surface: "#fef3c7",
        surface2: "#fde68a",
        border: "#fcd34d",
        muted: "#b45309",
        primary: "#d97706",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(217,119,6,0.1), rgba(245,158,11,0.05) 40%, transparent 70%)",
      },
      dark: {
        bg: "#1a140a",
        fg: "#fef3c7",
        surface: "#241c0f",
        surface2: "#2d2415",
        border: "#4a381d",
        muted: "#fcd34d",
        primary: "#f59e0b",
        gradient: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.15), rgba(251,191,36,0.08) 40%, transparent 70%)",
      },
    },
  },
};

export function getThemeCSS(themeId: ThemePresetId, mode: "light" | "dark"): Record<string, string> {
  const theme = THEME_PRESETS[themeId];
  const colors = mode === "dark" ? theme.colors.dark : theme.colors.light;
  
  return {
    "--template-bg": colors.bg,
    "--template-fg": colors.fg,
    "--template-surface": colors.surface,
    "--template-surface-2": colors.surface2,
    "--template-border": colors.border,
    "--template-muted": colors.muted,
    "--template-primary": colors.primary,
    "--template-gradient": colors.gradient,
  };
}