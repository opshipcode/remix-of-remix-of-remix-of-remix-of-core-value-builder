---
name: build-sequence
description: 10-phase super-prompt status across multiple sessions. Tracks what is done and what remains so we don't repeat or skip work.
type: feature
---
# Build Sequence — Super Prompt Status

## ✅ Done
- Phase 1: Basenji font (logo only), teal purged → electric purple, dark default, navbar transparent→glass>80px, footer floating card with watermark
- Phase 2: Button (loaderClick/planLock asChild-safe), PlanLock, UpgradeModal + UpgradeModalHost (kp:upgrade event), TrialBanner with severity tiers, LogoutModal, HelpBubble (kp_onboarded), WelcomeModal (kp_welcomed), usePageLoader, AppPageSkeleton, SettingsSaveBar
- Phase 3: useKitPageStore persisted as kp_page_data
- Phase 4: MinimalTemplate, BoldTemplate, ProfessionalTemplate + TemplateRenderer
- Phase 5: Builder rebuild (template switcher + device preview), Platforms (Connect/Disconnect sheets), Testimonials (approve/reject), Inquiries (reply/archive), Rates (sticky save bar), all 6 Settings sub-pages, Public page with skeleton + 8s analytics beacon
- Phase 6: Onboarding 5-step (Identity / Platforms+Facebook / Profile / Template / Plan picker with mock Paddle sheet, auto 7-day Creator trial)
- Phase 7: Trial+Grace+Auto-renew engine, GraceExpiredModal (non-dismissable), useTrialCountdown, billing trial states
- Phase 8: Analytics with @justphemi/atlas-kit map, theme-reactive, country dot algorithm
- Phase 9: useLocaleDetect (ipapi.co + open.er-api.com, sessionStorage cache), formatPrice, /:locale prefix whitelist, Pricing fade transition + USD toggle
- Phase 10: Public guards (country block, /share/:token password, inactive screen, branded 404), ScrollToTop on route change
- Mobile: AppTabBar (<640px), AppHamburger sheet (640-1023px), shared MobileMoreSheet
- Admin debug panel at /admin/system: subscription state jump buttons

## How globals are wired
- Plan store: src/store/plan.ts — usePlanStore, useEffectivePlan, simulateAutoRenew action
- Locale store: src/store/locale.ts — useLocaleStore, SUPPORTED_LOCALES
- Locale detect: src/hooks/useLocaleDetect.ts — mounted in App, non-blocking, sessionStorage cache key kp_locale
- Trial countdown: src/hooks/useTrialCountdown.ts — interval 1s only when critical/grace
- Slug validation: src/lib/slugValidation.ts — RESERVED_SLUGS includes locale codes + platform routes
- Upgrade events: window.dispatchEvent(new CustomEvent("kp:upgrade", { detail: { targetPlan, featureName } }))
