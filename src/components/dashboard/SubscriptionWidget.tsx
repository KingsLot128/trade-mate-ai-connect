import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, Calendar, Zap, ArrowRight } from 'lucide-react';

export const SubscriptionWidget: React.FC = () => {
  const { 
    subscription, 
    loading, 
    createCheckout, 
    getTrialDaysRemaining,
    plans 
  } = useSubscription();

  const trialDaysRemaining = getTrialDaysRemaining();
  const isOnTrial = subscription?.subscription_status === 'trial';
  const isActive = subscription?.subscription_status === 'active';
  const professionalPlan = plans.find(p => p.plan_id === 'professional');

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isActive) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Crown className="w-4 h-4" />
            {subscription?.subscription_tier?.charAt(0).toUpperCase() + subscription?.subscription_tier?.slice(1)} Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">Status:</span>
              <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
            </div>
            {subscription?.next_billing_date && (
              <p className="text-xs text-green-600">
                Next billing: {new Date(subscription.next_billing_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isOnTrial) {
    const isExpiringSoon = trialDaysRemaining <= 7;
    
    return (
      <Card className={`${isExpiringSoon ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'}`}>
        <CardHeader className="pb-3">
          <CardTitle className={`flex items-center gap-2 ${isExpiringSoon ? 'text-orange-800' : 'text-blue-800'}`}>
            <Calendar className="w-4 h-4" />
            Free Trial
          </CardTitle>
          <CardDescription className={isExpiringSoon ? 'text-orange-600' : 'text-blue-600'}>
            {trialDaysRemaining} days remaining
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isExpiringSoon && (
            <p className="text-sm text-orange-700 font-medium">
              Your trial is ending soon! Upgrade to continue using TradeMate AI.
            </p>
          )}
          
          {professionalPlan && (
            <Button 
              onClick={() => createCheckout(professionalPlan.plan_id, 'monthly')}
              className={`w-full ${isExpiringSoon ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              size="sm"
            >
              <Zap className="w-3 h-3 mr-2" />
              Upgrade to Pro - ${(professionalPlan.price_monthly_cents / 100).toFixed(0)}/mo
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => window.location.href = '/settings/billing'}
          >
            View All Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-muted">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Crown className="w-4 h-4" />
          Subscription
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          No active subscription found.
        </p>
        <Button size="sm" className="w-full" onClick={() => window.location.href = '/settings/billing'}>
          View Plans
        </Button>
      </CardContent>
    </Card>
  );
};