import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ImpersonationData {
  originalUserId: string;
  originalEmail: string;
  impersonatedUserId: string;
  impersonatedEmail: string;
  impersonatedName: string;
}

interface AdminImpersonationContextType {
  isImpersonating: boolean;
  impersonationData: ImpersonationData | null;
  exitImpersonation: () => void;
  getEffectiveUserId: () => string | undefined;
}

const AdminImpersonationContext = createContext<AdminImpersonationContextType>({
  isImpersonating: false,
  impersonationData: null,
  exitImpersonation: () => {},
  getEffectiveUserId: () => undefined,
});

export const useAdminImpersonation = () => {
  return useContext(AdminImpersonationContext);
};

export const AdminImpersonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [impersonationData, setImpersonationData] = useState<ImpersonationData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for active impersonation on mount
    const storedData = sessionStorage.getItem('admin_impersonation');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setImpersonationData(data);
      } catch (error) {
        console.error('Error parsing impersonation data:', error);
        sessionStorage.removeItem('admin_impersonation');
      }
    }
  }, []);

  const exitImpersonation = () => {
    sessionStorage.removeItem('admin_impersonation');
    setImpersonationData(null);
    toast.success('Exited admin impersonation mode');
    navigate('/admin');
  };

  const getEffectiveUserId = () => {
    return impersonationData?.impersonatedUserId;
  };

  const isImpersonating = !!impersonationData;

  return (
    <AdminImpersonationContext.Provider 
      value={{ 
        isImpersonating, 
        impersonationData, 
        exitImpersonation, 
        getEffectiveUserId 
      }}
    >
      {/* Impersonation Banner */}
      {isImpersonating && (
        <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between shadow-lg border-b-2 border-red-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <AlertTriangle className="h-4 w-4 animate-pulse" />
            </div>
            <span className="font-medium">ADMIN MODE:</span>
            <span>Viewing as</span>
            <Badge variant="secondary" className="bg-red-700 text-white">
              {impersonationData?.impersonatedName}
            </Badge>
            <span className="text-red-200 text-sm">({impersonationData?.impersonatedEmail})</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exitImpersonation}
            className="bg-red-700 border-red-500 text-white hover:bg-red-800"
          >
            <X className="h-4 w-4 mr-1" />
            Exit Admin Mode
          </Button>
        </div>
      )}
      {children}
    </AdminImpersonationContext.Provider>
  );
};

// Hook to override the user ID in components when impersonating
export const useEffectiveUserId = (originalUserId?: string) => {
  const { isImpersonating, getEffectiveUserId } = useAdminImpersonation();
  
  if (isImpersonating) {
    return getEffectiveUserId();
  }
  
  return originalUserId;
};