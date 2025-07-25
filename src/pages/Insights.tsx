
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import AIInsights from '@/components/insights/AIInsights';
import { AdvancedAIGate } from '@/components/subscription/FeatureGate';

const Insights: React.FC = () => {
  return (
    <MainLayout>
      <AIInsights />
    </MainLayout>
  );
};

export default Insights;
