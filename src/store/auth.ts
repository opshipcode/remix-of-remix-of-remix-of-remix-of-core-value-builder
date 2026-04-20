import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Mock auth store for frontend-only build.
 * Toggle isAuthenticated to test guarded routes.
 * Replace with Supabase session in Phase 2.
 */

export type MockPlan = "free" | "creator" | "pro";

export interface MockUser {
  id: string;
  email: string;
  displayName: string;
  slug: string;
  plan: MockPlan;
  isAdmin: boolean;
  onboardingComplete: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: MockUser | null;
  signIn: (overrides?: Partial<MockUser>) => void;
  signOut: () => void;
  setPlan: (plan: MockPlan) => void;
  completeOnboarding: () => void;
}

const DEFAULT_USER: MockUser = {
  id: "usr_mock_001",
  email: "alex@kitpager.pro",
  displayName: "Alex Rivera",
  slug: "alexrivera",
  plan: "creator",
  isAdmin: true,
  onboardingComplete: true,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      signIn: (overrides) =>
        set({
          isAuthenticated: true,
          user: { ...DEFAULT_USER, ...overrides },
        }),
      signOut: () => set({ isAuthenticated: false, user: null }),
      setPlan: (plan) =>
        set((s) => (s.user ? { user: { ...s.user, plan } } : s)),
      completeOnboarding: () =>
        set((s) =>
          s.user ? { user: { ...s.user, onboardingComplete: true } } : s,
        ),
    }),
    { name: "kp-mock-auth" },
  ),
);
