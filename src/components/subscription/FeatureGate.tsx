import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';

interface FeatureGateProps {
  feature?: string;
  requiresPremium?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  title?: string;
  description?: string;
  requiredTier?: string;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  requiresPremium = false,
  children,
  fallback,
  title = "Premium Feature",
  description = "Upgrade your plan to unlock this feature",
  requiredTier = "Professional"
}) => {
  const { hasFeatureAccess, hasPremiumAccess, subscription, plans, createCheckout } = useSubscription();
  const { user } = useAuth();

  // Check access based on feature or premium requirement
  // Admin users (kingslotenterprises@gmail.com) get full access
  const isAdmin = user?.email === 'kingslotenterprises@gmail.com';
  const hasAccess = isAdmin || (feature ? hasFeatureAccess(feature) : (requiresPremium ? hasPremiumAccess() : true));

  if (hasAccess) {
    return <>{children}</>;
  }

  // Custom fallback provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Find the required plan
  const requiredPlan = plans.find(plan => 
    plan.name.toLowerCase() === requiredTier.toLowerCase()
  );

  // Default upgrade prompt
  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          {title}
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {requiredTier}
          </Badge>
        </CardTitle>
        <CardDescription className="text-center max-w-sm mx-auto">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Trial info if on trial */}
        {subscription?.subscription_status === 'trial' && (
          <div className="text-center p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-medium text-accent">Free Trial Active</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Upgrade now to continue using premium features after your trial
            </p>
          </div>
        )}

        {/* Upgrade button */}
        <div className="flex flex-col gap-2">
          {requiredPlan && (
            <Button 
              onClick={() => createCheckout(requiredPlan.plan_id, 'monthly')}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to {requiredPlan.name} - ${(requiredPlan.price_monthly_cents / 100).toFixed(0)}/mo
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/settings/billing'}
            className="w-full"
          >
            View All Plans
          </Button>
        </div>

        {/* Feature preview (blurred version of content) */}
        <div className="relative">
          <div className="blur-sm pointer-events-none opacity-50 select-none">
            {children}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        </div>
      </CardContent>
    </Card>
  );
};

// Convenience components for specific features
export const ClarityLensGate: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FeatureGate
    feature="clarity_lens"
    title="ClarityLens Decision Engine"
    description="Get AI-powered business decision recommendations tailored to your situation"
    requiredTier="Professional"
  >
    {children}
  </FeatureGate>
);

export const AdvancedAIGate: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FeatureGate
    feature="advanced_ai"
    title="Advanced AI Insights"
    description="Unlock deeper business intelligence and predictive analytics"
    requiredTier="Professional"
  >
    {children}
  </FeatureGate>
);

export const UnlimitedContactsGate: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FeatureGate
    feature="unlimited_contacts"
    title="Unlimited Contacts"
    description="Manage unlimited contacts and leads in your CRM"
    requiredTier="Professional"
  >
    {children}
  </FeatureGate>
);

export const WhiteLabelGate: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FeatureGate
    feature="white_label"
    title="White Label Solution"
    description="Remove branding and customize the platform for your business"
    requiredTier="Enterprise"
  >
    {children}
  </FeatureGate>
);