import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { PricingCard } from './PricingCard';
import { Crown, Calendar, CreditCard, Settings } from 'lucide-react';

export const SubscriptionManager: React.FC = () => {
  const { 
    subscription, 
    plans, 
    loading, 
    createCheckout, 
    manageSubscription,
    getTrialDaysRemaining 
  } = useSubscription();

  const trialDaysRemaining = getTrialDaysRemaining();
  const isOnTrial = subscription?.subscription_status === 'trial';
  const isActive = subscription?.subscription_status === 'active';

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Current Subscription
              </CardTitle>
              <CardDescription>
                Manage your TradeMate AI subscription and billing
              </CardDescription>
            </div>
            {isActive && (
              <Button onClick={manageSubscription} variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              <Badge variant={isActive ? 'default' : isOnTrial ? 'secondary' : 'destructive'}>
                {subscription?.subscription_status || 'Unknown'}
              </Badge>
            </div>
            
            {subscription?.subscription_tier && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Plan:</span>
                <span className="capitalize">{subscription.subscription_tier}</span>
              </div>
            )}

            {isOnTrial && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Trial ends in:</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {trialDaysRemaining} days
                </Badge>
              </div>
            )}

            {subscription?.next_billing_date && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Next billing:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(subscription.next_billing_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trial Warning */}
      {isOnTrial && trialDaysRemaining <= 7 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Trial Ending Soon</CardTitle>
            <CardDescription className="text-orange-600">
              Your trial ends in {trialDaysRemaining} days. Upgrade now to continue using TradeMate AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <CreditCard className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Available Plans</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={subscription?.subscription_tier === plan.plan_id}
              onSelectPlan={(planId, interval) => createCheckout(planId, interval)}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};