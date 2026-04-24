import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import "@/store/theme";
import { useLocaleDetect } from "@/hooks/useLocaleDetect";
import { LocaleAutoRedirect } from "@/components/app/LocaleAutoRedirect";

import MarketingLayout from "@/layouts/MarketingLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";
import AdminLayout from "@/layouts/AdminLayout";
import { LocaleGate } from "@/layouts/LocaleGate";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ScrollToTop } from "@/components/kit/ScrollToTop";
import { UpgradeModalHost } from "@/components/kit/UpgradeModal";
import { MockCheckoutHost } from "@/components/kit/MockCheckoutHost";

import Home from "@/pages/marketing/Home";
import Pricing from "@/pages/marketing/Pricing";
import Templates from "@/pages/marketing/Templates";
import TemplatePreview from "@/pages/marketing/TemplatePreview";
import Features from "@/pages/marketing/Features";
import About from "@/pages/marketing/About";
import Changelog from "@/pages/marketing/Changelog";
import Contact from "@/pages/marketing/Contact";
import HowItWorks from "@/pages/marketing/HowItWorks";
import Security from "@/pages/marketing/Security";
import Examples from "@/pages/marketing/Examples";
import Resources from "@/pages/marketing/Resources";
import Status from "@/pages/marketing/Status";
import LegalPage from "@/pages/marketing/LegalPage";

import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Onboarding from "@/pages/auth/Onboarding";

import AppOverview from "@/pages/app/AppOverview";
import Builder from "@/pages/app/Builder";
import Platforms from "@/pages/app/Platforms";
import Testimonials from "@/pages/app/Testimonials";
import Inquiries from "@/pages/app/Inquiries";
import Analytics from "@/pages/app/Analytics";
import Rates from "@/pages/app/Rates";
import Settings from "@/pages/app/Settings";
import AppTemplates from "@/pages/app/AppTemplates";
import AppTemplatePreview from "@/pages/app/AppTemplatePreview";
import Reports from "@/pages/app/Reports";

import AdminOverview from "@/pages/admin/AdminOverview";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminUserDetail from "@/pages/admin/AdminUserDetail";
import AdminModeration from "@/pages/admin/AdminModeration";
import AdminAudit from "@/pages/admin/AdminAudit";
import AdminSystem from "@/pages/admin/AdminSystem";

import PublicKitPage from "@/pages/public/PublicKitPage";
import ReviewSubmission from "@/pages/public/ReviewSubmission";
import PrivateShare from "@/pages/public/PrivateShare";
import CreatorReviewPage from "@/pages/public/CreatorReviewPage";
import ReportPage from "@/pages/public/ReportPage";
import SuggestFeature from "@/pages/SuggestFeature";
import Support from "@/pages/Support";
import NotFound from "./pages/NotFound.tsx";
import { RESERVED_PREFIXES } from "@/lib/reservedPrefixes";

const queryClient = new QueryClient();


function AppRoutes(): JSX.Element {
  useLocaleDetect();

  return (
    <>
      <ScrollToTop />
      <UpgradeModalHost />
      <MockCheckoutHost />
      <LocaleAutoRedirect />

      <Routes>

        {/* ================= SYSTEM ROUTES ================= */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

        <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<AppOverview />} />
          <Route path="builder" element={<Builder />} />
          <Route path="platforms" element={<Platforms />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="rates" element={<Rates />} />
          <Route path="reports" element={<Reports />} />
          <Route path="templates" element={<AppTemplates />} />
          <Route path="templates/:templateId" element={<AppTemplatePreview />} />
          <Route path="settings" element={<Navigate to="/app/settings/profile" replace />} />
          <Route path="settings/:section" element={<Settings />} />
          <Route path="suggest" element={<SuggestFeature />} />
          <Route path="support" element={<Support />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:userId" element={<AdminUserDetail />} />
          <Route path="moderation" element={<AdminModeration />} />
          <Route path="audit" element={<AdminAudit />} />
          <Route path="system" element={<AdminSystem />} />
        </Route>

        {/* ================= PUBLIC FIXED ROUTES ================= */}
        <Route path="/review/:token" element={<ReviewSubmission />} />
        <Route path="/share/:token" element={<PrivateShare />} />
        <Route path="/watch/:period/:id" element={<ReportPage />} />

        {/* ================= LOCALE ROUTES ================= */}
        <Route path="/en/:country/*" element={<LocaleGate />}>
          <Route element={<MarketingLayout />}>

            <Route index element={<Home />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="templates" element={<Templates />} />
            <Route path="templates/:templateId" element={<TemplatePreview />} />
            <Route path="features" element={<Features />} />
            <Route path="about" element={<About />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="security" element={<Security />} />
            <Route path="examples" element={<Examples />} />
            <Route path="resources" element={<Resources />} />
            <Route path="status" element={<Status />} />
            <Route path="contact" element={<Contact />} />
            <Route path="changelog" element={<Changelog />} />
            <Route path="legal/:slug" element={<LegalPage />} />
            <Route path="suggest" element={<SuggestFeature />} />
            <Route path="support" element={<Support />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* ================= DEFAULT MARKETING ================= */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/:templateId" element={<TemplatePreview />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/security" element={<Security />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/status" element={<Status />} />
          <Route path="/legal/:slug" element={<LegalPage />} />
          <Route path="/suggest" element={<SuggestFeature />} />
          <Route path="/support" element={<Support />} />
        </Route>

        {/* ================= SLUG FALLBACK (LAST ONLY) ================= */}
        <Route path="/:slug" element={<PublicKitPage />} />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}

const App = (): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;