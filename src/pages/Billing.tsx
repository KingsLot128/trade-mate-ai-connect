import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';

const Billing = () => {
  return (
    <MainLayout>
      <SubscriptionManager />
    </MainLayout>
  );
};

export default Billing;