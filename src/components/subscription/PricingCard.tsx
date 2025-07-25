import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { SubscriptionPlan } from '@/hooks/useSubscription';

interface PricingCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  isYearly?: boolean;
  onSelectPlan: (planId: string, interval: 'monthly' | 'yearly') => void;
  loading?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isCurrentPlan = false,
  isYearly = false,
  onSelectPlan,
  loading = false
}) => {
  const monthlyPrice = plan.price_monthly_cents / 100;
  const yearlyPrice = plan.price_yearly_cents ? plan.price_yearly_cents / 100 : monthlyPrice * 12;
  const yearlyMonthlyPrice = yearlyPrice / 12;
  const savings = isYearly ? Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100) : 0;

  const displayPrice = isYearly ? yearlyMonthlyPrice : monthlyPrice;
  const billingLabel = isYearly ? 'per month, billed yearly' : 'per month';

  const getPlanIcon = () => {
    switch (plan.plan_id) {
      case 'enterprise':
        return <Crown className="w-5 h-5" />;
      case 'professional':
        return <Zap className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getPlanColor = () => {
    switch (plan.plan_id) {
      case 'enterprise':
        return 'from-purple-500 to-purple-600';
      case 'professional':
        return 'from-primary to-blue-600';
      default:
        return 'from-green-500 to-green-600';
    }
  };

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-lg ${
      plan.is_popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''
    } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
      {plan.is_popular && (
        <Badge 
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1"
        >
          Most Popular
        </Badge>
      )}
      
      {isCurrentPlan && (
        <Badge 
          className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1"
        >
          Current Plan
        </Badge>
      )}

      <CardHeader className="text-center pb-2">
        <div className={`mx-auto w-12 h-12 rounded-full bg-gradient-to-r ${getPlanColor()} flex items-center justify-center text-white mb-4`}>
          {getPlanIcon()}
        </div>
        
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
          {plan.name}
        </CardTitle>
        
        <CardDescription className="text-base">
          {plan.description}
        </CardDescription>

        <div className="space-y-2 mt-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold">${Math.round(displayPrice)}</span>
            <span className="text-muted-foreground">/{billingLabel.split(',')[0]}</span>
          </div>
          
          {isYearly && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{billingLabel}</p>
              {savings > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  Save {savings}%
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button 
          className={`w-full ${isCurrentPlan 
            ? 'bg-green-500 hover:bg-green-600' 
            : plan.is_popular 
              ? 'bg-primary hover:bg-primary/90' 
              : 'bg-secondary hover:bg-secondary/80'
          }`}
          onClick={() => !isCurrentPlan && onSelectPlan(plan.plan_id, isYearly ? 'yearly' : 'monthly')}
          disabled={isCurrentPlan || loading}
        >
          {isCurrentPlan ? 'Current Plan' : loading ? 'Loading...' : `Get ${plan.name}`}
        </Button>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Everything included:
          </h4>
          
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trial info for non-current plans */}
        {!isCurrentPlan && plan.plan_id !== 'starter' && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              14-day free trial • No credit card required
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};