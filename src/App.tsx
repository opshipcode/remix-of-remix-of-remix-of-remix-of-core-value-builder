import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import "@/store/theme"; // initialize theme on load

import MarketingLayout from "@/layouts/MarketingLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";
import AdminLayout from "@/layouts/AdminLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Home from "@/pages/marketing/Home";
import Pricing from "@/pages/marketing/Pricing";
import Templates from "@/pages/marketing/Templates";
import Features from "@/pages/marketing/Features";
import About from "@/pages/marketing/About";
import Changelog from "@/pages/marketing/Changelog";
import Contact from "@/pages/marketing/Contact";

import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Onboarding from "@/pages/auth/Onboarding";

import AppOverview from "@/pages/app/AppOverview";
import Builder from "@/pages/app/Builder";

import PublicKitPage from "@/pages/public/PublicKitPage";
import ComingSoon from "@/components/kit/ComingSoon";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Marketing */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/status" element={<ComingSoon title="Status page" route="/status" description="Public status page with component health, incident timeline, and uptime — scaffolded next session." />} />
            <Route path="/legal/:slug" element={<ComingSoon title="Legal page" description="Terms, Privacy, Cookies, AUP, DMCA, Refund, Data Request, Subprocessors — full content shells next session." />} />
          </Route>

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

          {/* App */}
          <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<AppOverview />} />
            <Route path="builder" element={<Builder />} />
            <Route path="platforms" element={<ComingSoon title="Platforms" route="/app/platforms" />} />
            <Route path="testimonials" element={<ComingSoon title="Testimonials" route="/app/testimonials" />} />
            <Route path="inquiries" element={<ComingSoon title="Inquiries" route="/app/inquiries" />} />
            <Route path="analytics" element={<ComingSoon title="Analytics" route="/app/analytics" />} />
            <Route path="rates" element={<ComingSoon title="Rates" route="/app/rates" />} />
            <Route path="settings" element={<Navigate to="/app/settings/profile" replace />} />
            <Route path="settings/:section" element={<ComingSoon title="Settings" />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
            <Route index element={<ComingSoon title="Admin overview" route="/admin" />} />
            <Route path="users" element={<ComingSoon title="Users" route="/admin/users" />} />
            <Route path="moderation" element={<ComingSoon title="Moderation" route="/admin/moderation" />} />
            <Route path="audit" element={<ComingSoon title="Audit log" route="/admin/audit" />} />
            <Route path="system" element={<ComingSoon title="System health" route="/admin/system" />} />
          </Route>

          {/* Public creator pages — must be last so it doesn't shadow defined routes */}
          <Route path="/:slug" element={<PublicKitPage />} />
          <Route path="/review/:token" element={<ComingSoon title="Brand testimonial submission" description="Public form for brands to submit a testimonial via secure token." />} />
          <Route path="/share/:token" element={<ComingSoon title="Private share" description="Password-gated private share view of a creator page." />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
