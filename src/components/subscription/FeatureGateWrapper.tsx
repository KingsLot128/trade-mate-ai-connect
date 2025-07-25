import React from 'react';
import { FeatureGate } from './FeatureGate';
import { useSubscription } from '@/hooks/useSubscription';

interface FeatureGateWrapperProps {
  feature?: string;
  requiresPremium?: boolean;
  children: React.ReactNode;
  title?: string;
  description?: string;
  requiredTier?: string;
}

export const FeatureGateWrapper: React.FC<FeatureGateWrapperProps> = ({
  feature,
  requiresPremium = false,
  children,
  title,
  description,
  requiredTier = "Professional"
}) => {
  const { hasFeatureAccess, hasPremiumAccess } = useSubscription();

  // Check access based on feature or premium requirement
  const hasAccess = feature ? hasFeatureAccess(feature) : (requiresPremium ? hasPremiumAccess() : true);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <FeatureGate
      feature={feature}
      requiresPremium={requiresPremium}
      title={title}
      description={description}
      requiredTier={requiredTier}
    >
      {children}
    </FeatureGate>
  );
};