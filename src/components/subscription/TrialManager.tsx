import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CreditCard, Star, AlertTriangle, Zap, Users } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

interface TrialExpirationBannerProps {
  className?: string;
}

export const TrialExpirationBanner: React.FC<TrialExpirationBannerProps> = ({ className }) => {
  const { subscription, getTrialDaysRemaining, hasPremiumAccess } = useSubscription();
  const navigate = useNavigate();
  const daysRemaining = getTrialDaysRemaining();

  // Don't show for admin or users with active subscriptions
  if (hasPremiumAccess() || !subscription) return null;

  // Don't show if trial hasn't started expiring (more than 7 days left)
  if (daysRemaining > 7) return null;

  const isExpired = daysRemaining <= 0;
  const isUrgent = daysRemaining <= 3;

  const handleUpgrade = () => {
    navigate('/settings/billing');
  };

  return (
    <Card className={`border-l-4 ${isExpired ? 'border-l-red-500 bg-red-50' : isUrgent ? 'border-l-orange-500 bg-orange-50' : 'border-l-yellow-500 bg-yellow-50'} ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${isExpired ? 'bg-red-100' : isUrgent ? 'bg-orange-100' : 'bg-yellow-100'}`}>
              {isExpired ? (
                <AlertTriangle className={`h-5 w-5 ${isExpired ? 'text-red-600' : 'text-orange-600'}`} />
              ) : (
                <Clock className={`h-5 w-5 ${isUrgent ? 'text-orange-600' : 'text-yellow-600'}`} />
              )}
            </div>
            <div>
              <h3 className={`font-semibold ${isExpired ? 'text-red-800' : isUrgent ? 'text-orange-800' : 'text-yellow-800'}`}>
                {isExpired ? 'Trial Expired' : `Trial Ending Soon`}
              </h3>
              <p className={`text-sm ${isExpired ? 'text-red-700' : isUrgent ? 'text-orange-700' : 'text-yellow-700'}`}>
                {isExpired 
                  ? 'Your trial has ended. Upgrade to continue using premium features.'
                  : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining in your trial.`
                }
              </p>
            </div>
          </div>
          <Button 
            onClick={handleUpgrade}
            className={`${isExpired ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface PaywallModalProps {
  feature?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ feature, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    navigate('/settings/billing');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Star className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Unlock Premium Features</CardTitle>
          <p className="text-muted-foreground">
            {feature ? `${feature} is` : 'This feature is'} available with a Professional or Enterprise plan.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Advanced AI insights and recommendations</span>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Unlimited contacts and deals</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Priority support and updates</span>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={handleUpgrade} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};