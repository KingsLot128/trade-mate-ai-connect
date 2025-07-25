import { useAuth } from '@/contexts/AuthContext';

export const useEffectiveUser = () => {
  const { user } = useAuth();
  
  // Try to get impersonation data from sessionStorage
  let effectiveUserId = user?.id;
  let isImpersonating = false;
  
  try {
    const storedData = sessionStorage.getItem('admin_impersonation');
    if (storedData) {
      const impersonationData = JSON.parse(storedData);
      effectiveUserId = impersonationData.impersonatedUserId;
      isImpersonating = true;
    }
  } catch (error) {
    // Fallback to regular user if impersonation data is invalid
    console.warn('Invalid impersonation data:', error);
  }
  
  return {
    user,
    effectiveUserId,
    isImpersonating
  };
};