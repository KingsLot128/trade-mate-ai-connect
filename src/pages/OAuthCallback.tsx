import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing OAuth callback...');
  const [integration, setIntegration] = useState<any>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle OAuth errors
        if (error) {
          setStatus('error');
          setMessage(errorDescription || `OAuth error: ${error}`);
          notifyParent(false, errorDescription || error);
          return;
        }

        // Validate required parameters
        if (!code || !state) {
          setStatus('error');
          setMessage('Missing required OAuth parameters');
          notifyParent(false, 'Missing required OAuth parameters');
          return;
        }

        if (!user) {
          setStatus('error');
          setMessage('User not authenticated. Please log in and try again.');
          notifyParent(false, 'User not authenticated');
          return;
        }

        setMessage('Exchanging authorization code for access token...');

        // Call the OAuth callback edge function
        const { data, error: callbackError } = await supabase.functions.invoke('oauth-callback', {
          body: {
            code,
            state,
            userId: user.id
          }
        });

        if (callbackError) {
          throw new Error(callbackError.message || 'OAuth callback failed');
        }

        if (!data.success) {
          throw new Error(data.error || 'OAuth integration failed');
        }

        // Success!
        setStatus('success');
        setMessage('Integration connected successfully!');
        setIntegration(data.integration);
        
        // Notify parent window
        notifyParent(true, null, data.integration);

        // Auto-close after 3 seconds
        setTimeout(() => {
          window.close();
        }, 3000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
        notifyParent(false, error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    };

    handleOAuthCallback();
  }, [searchParams, user]);

  const notifyParent = (success: boolean, error?: string | null, data?: any) => {
    const state = searchParams.get('state');
    const provider = state ? state.split(':')[0] : 'unknown';
    
    // Try to notify parent window
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({
        type: 'oauth-callback',
        provider,
        success,
        error,
        data
      }, window.location.origin);
    }
  };

  const handleRetry = () => {
    window.close();
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className={`w-full max-w-md ${getStatusColor()} border-2`}>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-xl">
            {status === 'processing' && 'Connecting Integration'}
            {status === 'success' && 'Integration Connected!'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {message}
          </p>
          
          {integration && status === 'success' && (
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="text-sm font-medium text-green-800">
                Provider: {integration.provider}
              </div>
              <div className="text-xs text-green-600 mt-1">
                Connected at: {new Date(integration.created_at).toLocaleString()}
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-sm text-green-600">
              This window will close automatically in a few seconds...
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-3">
              <Button 
                onClick={handleRetry}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Close & Retry
              </Button>
              
              <div className="text-xs text-muted-foreground">
                If this problem persists, please contact support.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;