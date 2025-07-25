import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Calendar, CreditCard, Crown, ExternalLink, RefreshCw, Clock } from 'lucide-react';
import { PricingCard } from '@/components/subscription/PricingCard';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Billing = () => {
  const { 
    subscription, 
    plans, 
    loading, 
    createCheckout, 
    manageSubscription, 
    getTrialDaysRemaining,
    refreshSubscription 
  } = useSubscription();
  
  const { toast } = useToast();
  const [isYearly, setIsYearly] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleSelectPlan = async (planId: string, interval: 'monthly' | 'yearly') => {
    setCheckoutLoading(planId);
    try {
      await createCheckout(planId, interval);
      toast({
        title: "Redirecting to Checkout",
        description: "You'll be redirected to Stripe to complete your purchase.",
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: "There was an issue starting the checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await manageSubscription();
      toast({
        title: "Opening Billing Portal",
        description: "You'll be redirected to manage your subscription.",
      });
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: "Portal Error", 
        description: "There was an issue opening the billing portal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefreshSubscription = async () => {
    setRefreshing(true);
    try {
      await refreshSubscription();
      toast({
        title: "Subscription Refreshed",
        description: "Your subscription status has been updated.",
      });
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: "Refresh Error",
        description: "There was an issue refreshing your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'trial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const trialDaysRemaining = getTrialDaysRemaining();

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Billing & Subscription
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage your subscription, view billing details, and upgrade your plan
        </p>
      </div>

      {/* Current Subscription Status */}
      {subscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Current Subscription
                </CardTitle>
                <CardDescription>
                  Your current plan and billing information
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshSubscription}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={getStatusColor(subscription.subscription_status)}>
                  {subscription.subscription_status.charAt(0).toUpperCase() + subscription.subscription_status.slice(1)}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Plan</p>
                <p className="font-medium flex items-center gap-1">
                  {subscription.subscription_tier ? (
                    <>
                      <Crown className="w-4 h-4 text-primary" />
                      {subscription.subscription_tier.charAt(0).toUpperCase() + subscription.subscription_tier.slice(1)}
                    </>
                  ) : (
                    'Free Trial'
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {subscription.subscription_status === 'trial' ? 'Trial Ends' : 'Next Billing'}
                </p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {subscription.subscription_status === 'trial' 
                    ? formatDate(subscription.trial_ends_at)
                    : formatDate(subscription.next_billing_date)
                  }
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {subscription.subscription_status === 'trial' ? 'Days Remaining' : 'Subscription Ends'}
                </p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {subscription.subscription_status === 'trial' 
                    ? `${trialDaysRemaining} days`
                    : formatDate(subscription.subscription_ends_at)
                  }
                </p>
              </div>
            </div>

            {/* Trial warning */}
            {subscription.subscription_status === 'trial' && trialDaysRemaining <= 7 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your free trial {trialDaysRemaining === 0 ? 'has expired' : `expires in ${trialDaysRemaining} days`}. 
                  Choose a plan below to continue using premium features.
                </AlertDescription>
              </Alert>
            )}

            {/* Manage subscription button for active subscriptions */}
            {subscription.subscription_status === 'active' && subscription.subscription_tier && (
              <div className="pt-4 border-t border-border">
                <Button onClick={handleManageSubscription} variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Update payment method, cancel subscription, or download invoices
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pricing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm ${!isYearly ? 'font-medium' : 'text-muted-foreground'}`}>
          Monthly
        </span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <span className={`text-sm ${isYearly ? 'font-medium' : 'text-muted-foreground'}`}>
          Yearly
          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
            Save up to 20%
          </Badge>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={subscription?.subscription_tier === plan.plan_id}
            isYearly={isYearly}
            onSelectPlan={handleSelectPlan}
            loading={checkoutLoading === plan.plan_id}
          />
        ))}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Have questions about billing or need assistance with your subscription?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Contact Support</h4>
              <p className="text-sm text-muted-foreground">
                Get help with billing issues, plan changes, or technical questions.
              </p>
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Billing FAQ</h4>
              <p className="text-sm text-muted-foreground">
                Find answers to common billing and subscription questions.
              </p>
              <Button variant="outline" size="sm">
                View FAQ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          All payments are processed securely through Stripe. We never store your payment information.
        </p>
      </div>
    </div>
  );
};

export default Billing;