import { useAuth } from '@/contexts/AuthContext';

// Check if admin impersonation context is available
let impersonationContext: any = null;
try {
  const { useAdminImpersonation } = require('@/contexts/AdminImpersonationContext');
  impersonationContext = useAdminImpersonation;
} catch (error) {
  // Context not available, fallback to normal behavior
}

export const useEffectiveUser = () => {
  const { user } = useAuth();
  
  // Try to get impersonation data if context is available
  let effectiveUserId = user?.id;
  let isImpersonating = false;
  
  try {
    if (impersonationContext) {
      const { isImpersonating: impersonating, getEffectiveUserId } = impersonationContext();
      if (impersonating) {
        effectiveUserId = getEffectiveUserId();
        isImpersonating = true;
      }
    }
  } catch (error) {
    // Fallback to regular user if impersonation context fails
  }
  
  return {
    user,
    effectiveUserId,
    isImpersonating
  };
};