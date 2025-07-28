
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useIntelligenceIntegration } from "@/hooks/useIntelligenceIntegration";

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

import Settings from "./pages/Settings";
import RevenueRecoveryDashboard from "./components/revenue/RevenueRecoveryDashboard";
import SmartRecommendationEngine from "./components/ai/SmartRecommendationEngine";
import { DashboardProvider } from "./contexts/DashboardContext";
import { NewUserAuthGuard } from "./components/routing/NewUserAuthGuard";
import EnhancedQuizInterface from "./components/quiz/EnhancedQuizInterface";
import VisualIntegrationHub from "./components/integrations/VisualIntegrationHub";
import BusinessHealthScore from "./components/gamification/BusinessHealthScore";
import MultiStreamFeed from "./components/enhanced-feed/MultiStreamFeed";
import UserProfile from "./components/profile/UserProfile";
import WebsiteAnalyzer from "./components/website/WebsiteAnalyzer";
import CallsManager from "./components/calls/CallsManager";
import CallSetupGuide from "./components/calls/CallSetupGuide";
import ContactsManager from "./components/contacts/ContactsManager";
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Billing from "./pages/Billing";
import SmartCRM from "./components/builtin-tools/SmartCRM";
import DealsPipeline from "./components/deals/DealsPipeline";
import DataCollection from "./pages/DataCollection";

const AppWithIntegration = () => {
  useIntelligenceIntegration();
  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <AppWithIntegration />
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
              
              {/* Onboarding (separate layout for new users) */}
              <Route path="/onboarding" element={
                <NewUserAuthGuard>
                  <EnhancedOnboarding />
                </NewUserAuthGuard>
              } />
              
              {/* Protected routes with main layout */}
              <Route path="/" element={
                <NewUserAuthGuard>
                  <MainLayout />
                </NewUserAuthGuard>
              }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="feed" element={<MultiStreamFeed />} />
                <Route path="health" element={<BusinessHealthScore />} />
                <Route path="clarity" element={<ClarityLens />} />
                
                <Route path="revenue-recovery" element={<RevenueRecoveryDashboard />} />
                <Route path="ai-recommendations" element={<SmartRecommendationEngine />} />
                <Route path="calls" element={<CallsManager />} />
                <Route path="calls/setup" element={<CallSetupGuide />} />
                <Route path="contacts" element={<ContactsManager />} />
                <Route path="deals" element={<DealsPipeline />} />
                <Route path="tools" element={<SmartCRM />} />
                <Route path="crm" element={<SmartCRM />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="analytics" element={<AnalyticsDashboard />} />
                <Route path="integrations" element={<VisualIntegrationHub />} />
                <Route path="website" element={<WebsiteAnalyzer />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="data-collection" element={<DataCollection />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/billing" element={<Billing />} />
                <Route path="billing" element={<Navigate to="/settings/billing" replace />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/users" element={<div>User Management - Coming Soon</div>} />
              </Route>

              {/* OAuth callback */}
              <Route path="/integrations/oauth/callback" element={<OAuthCallback />} />
              
              {/* Legacy routes - redirect to new structure */}
              <Route path="/insights" element={<Navigate to="/feed" replace />} />
              <Route path="/decisions" element={<Navigate to="/clarity" replace />} />
              <Route path="/intelligence-feed" element={<Navigate to="/feed" replace />} />
              <Route path="/business-health" element={<Navigate to="/health" replace />} />
              <Route path="/integration-hub" element={<Navigate to="/integrations" replace />} />
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
};

export default App;
