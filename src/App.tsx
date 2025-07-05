
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import EnhancedOnboarding from "./components/onboarding/EnhancedOnboarding";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Company from "./pages/Company";
import Support from "./pages/Support";
import Enterprise from "./pages/Enterprise";
import Partnerships from "./pages/Partnerships";
import Resources from "./pages/Resources";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Security from "./pages/Security";
import Insights from "./pages/Insights";
import Calendar from "./pages/Calendar";
import Decisions from "./pages/Decisions";
import Integrations from "./pages/Integrations";
import OAuthCallback from "./pages/OAuthCallback";
import ClarityLens from "./pages/ClarityLens";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/auth/AuthGuard";
import EnhancedQuizInterface from "./components/quiz/EnhancedQuizInterface";
import VisualIntegrationHub from "./components/integrations/VisualIntegrationHub";
import BusinessHealthScore from "./components/gamification/BusinessHealthScore";
import MultiStreamFeed from "./components/enhanced-feed/MultiStreamFeed";
import UserProfile from "./components/profile/UserProfile";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/company" element={<Company />} />
              <Route path="/support" element={<Support />} />
              <Route path="/enterprise" element={<Enterprise />} />
              <Route path="/partnerships" element={<Partnerships />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/security" element={<Security />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/enhanced-quiz" element={<EnhancedQuizInterface />} />
              
              {/* Landing page */}
              <Route path="/" element={<Index />} />
              
              {/* Protected routes with main layout */}
              <Route path="/" element={
                <AuthGuard requireAuth={true} requireComplete={true}>
                  <MainLayout />
                </AuthGuard>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="feed" element={<MultiStreamFeed />} />
                <Route path="health" element={<BusinessHealthScore />} />
                <Route path="clarity" element={<ClarityLens />} />
                <Route path="recommendations" element={<Insights />} />
                <Route path="calls" element={<div>Call Log - Coming Soon</div>} />
                <Route path="contacts" element={<div>Contacts - Coming Soon</div>} />
                <Route path="deals" element={<div>Deals Pipeline - Coming Soon</div>} />
                <Route path="tools" element={<div>Smart Tools - Coming Soon</div>} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="analytics" element={<div>Analytics - Coming Soon</div>} />
                <Route path="integrations" element={<VisualIntegrationHub />} />
                <Route path="website" element={<div>Website Analysis - Coming Soon</div>} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="settings" element={<div>Settings - Coming Soon</div>} />
                <Route path="billing" element={<div>Billing - Coming Soon</div>} />
                <Route path="admin" element={<div>Admin Dashboard - Coming Soon</div>} />
                <Route path="admin/users" element={<div>User Management - Coming Soon</div>} />
              </Route>
              
              {/* Onboarding (separate layout) */}
              <Route path="/onboarding" element={
                <AuthGuard requireAuth={true} requireComplete={false}>
                  <EnhancedOnboarding />
                </AuthGuard>
              } />

              {/* OAuth callback */}
              <Route path="/integrations/oauth/callback" element={<OAuthCallback />} />
              
              {/* Legacy routes - redirect to new structure */}
              <Route path="/insights" element={<Navigate to="/recommendations" replace />} />
              <Route path="/decisions" element={<Navigate to="/clarity" replace />} />
              <Route path="/intelligence-feed" element={<Navigate to="/feed" replace />} />
              <Route path="/business-health" element={<Navigate to="/health" replace />} />
              <Route path="/integration-hub" element={<Navigate to="/integrations" replace />} />
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
