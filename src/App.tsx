
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import EnhancedOnboarding from "./components/onboarding/EnhancedOnboarding";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
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
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={
                <AuthGuard requireAuth={false}>
                  <Auth />
                </AuthGuard>
              } />
              <Route path="/onboarding" element={
                <AuthGuard requireAuth={true} requireComplete={false}>
                  <EnhancedOnboarding />
                </AuthGuard>
              } />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={
                <AuthGuard requireAuth={true} requireComplete={true}>
                  <Dashboard />
                </AuthGuard>
              } />
              <Route path="/insights" element={
                <AuthGuard requireAuth={true} requireComplete={true}>
                  <Insights />
                </AuthGuard>
              } />
              <Route path="/calendar" element={
                <AuthGuard requireAuth={true} requireComplete={true}>
                  <Calendar />
                </AuthGuard>
              } />
              <Route path="/decisions" element={
                <AuthGuard requireAuth={true} requireComplete={true}>
                  <Decisions />
                </AuthGuard>
              } />
              <Route path="/integrations" element={
                <AuthGuard requireAuth={true} requireComplete={true}>
                  <Integrations />
                </AuthGuard>
              } />
              <Route path="/integrations/oauth/callback" element={<OAuthCallback />} />
              <Route path="/clarity-lens" element={
                <AuthGuard requireAuth={true} requireComplete={true}>
                  <ClarityLens />
                </AuthGuard>
              } />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
