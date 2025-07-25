import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { initiateOAuth, checkAuthStatus, getProviderInfo } from '@/utils/oauth';

interface UseOAuthProps {
  onSuccess?: (provider: string, data: any) => void;
  onError?: (provider: string, error: string) => void;
}

export const useOAuth = ({ onSuccess, onError }: UseOAuthProps = {}) => {
  const [connecting, setConnecting] = useState<Record<string, boolean>>({});
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const connect = useCallback(async (provider: string) => {
    if (connecting[provider]) {
      toast.warning('OAuth flow already in progress for this provider');
      return;
    }

    const providerInfo = getProviderInfo(provider);
    if (!providerInfo) {
      const error = `Unsupported OAuth provider: ${provider}`;
      toast.error(error);
      onError?.(provider, error);
      return;
    }

    setConnecting(prev => ({ ...prev, [provider]: true }));
    
    try {
      toast.info(`Connecting to ${providerInfo.name}...`);
      
      const result = await initiateOAuth(provider);
      
      if (result) {
        toast.success(`Successfully connected to ${providerInfo.name}!`);
        setConnected(prev => ({ ...prev, [provider]: true }));
        onSuccess?.(provider, result);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'OAuth connection failed';
      console.error(`OAuth error for ${provider}:`, error);
      
      // Show user-friendly error messages
      if (errorMessage.includes('popup')) {
        toast.error('Please allow popups and try again');
      } else if (errorMessage.includes('cancelled')) {
        toast.info('OAuth connection was cancelled');
      } else if (errorMessage.includes('timeout')) {
        toast.error('Connection timeout. Please try again.');
      } else {
        toast.error(`Failed to connect to ${providerInfo.name}: ${errorMessage}`);
      }
      
      onError?.(provider, errorMessage);
    } finally {
      setConnecting(prev => ({ ...prev, [provider]: false }));
    }
  }, [connecting, onSuccess, onError]);

  const checkConnection = useCallback(async (provider: string) => {
    try {
      const isConnected = await checkAuthStatus(provider);
      setConnected(prev => ({ ...prev, [provider]: isConnected }));
      return isConnected;
    } catch (error) {
      console.error(`Error checking connection status for ${provider}:`, error);
      return false;
    }
  }, []);

  const checkAllConnections = useCallback(async (providers: string[]) => {
    const results = await Promise.allSettled(
      providers.map(provider => checkConnection(provider))
    );
    
    const connectionStatus: Record<string, boolean> = {};
    providers.forEach((provider, index) => {
      const result = results[index];
      connectionStatus[provider] = result.status === 'fulfilled' ? result.value : false;
    });
    
    setConnected(connectionStatus);
    return connectionStatus;
  }, [checkConnection]);

  const isConnecting = useCallback((provider: string) => {
    return !!connecting[provider];
  }, [connecting]);

  const isConnected = useCallback((provider: string) => {
    return !!connected[provider];
  }, [connected]);

  const getConnectionStatus = useCallback(() => {
    return { connecting, connected };
  }, [connecting, connected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // No cleanup needed for now, but available for future use
    };
  }, []);

  return {
    connect,
    checkConnection,
    checkAllConnections,
    isConnecting,
    isConnected,
    getConnectionStatus,
    connecting,
    connected
  };
};