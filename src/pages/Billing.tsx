import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';

const Billing = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              Billing & Subscription
            </CardTitle>
            <CardDescription>
              Manage your TradeMate AI subscription, billing details, and payment methods
            </CardDescription>
          </CardHeader>
        </Card>
        
        <SubscriptionManager />
      </div>
    </MainLayout>
  );
};

export default Billing;