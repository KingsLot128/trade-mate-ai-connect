import { supabase } from '@/integrations/supabase/client';

interface OAuthProvider {
  id: string;
  name: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
}

interface OAuthState {
  provider: string;
  timestamp: number;
  redirectUrl: string;
}

const OAUTH_PROVIDERS: Record<string, OAuthProvider> = {
  quickbooks: {
    id: 'quickbooks',
    name: 'QuickBooks',
    authUrl: 'https://appcenter.intuit.com/connect/oauth2',
    tokenUrl: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    scopes: ['com.intuit.quickbooks.accounting']
  },
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot',
    authUrl: 'https://app.hubspot.com/oauth/authorize',
    tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
    scopes: ['contacts', 'deals', 'companies', 'automation']
  },
  google_calendar: {
    id: 'google_calendar',
    name: 'Google Calendar',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly']
  },
  gmail: {
    id: 'gmail',
    name: 'Gmail',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.compose']
  },
  outlook: {
    id: 'outlook',
    name: 'Outlook',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scopes: ['https://graph.microsoft.com/Mail.ReadWrite', 'https://graph.microsoft.com/Mail.Send']
  },
  salesforce: {
    id: 'salesforce',
    name: 'Salesforce',
    authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
    tokenUrl: 'https://login.salesforce.com/services/oauth2/token',
    scopes: ['api', 'refresh_token']
  },
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    authUrl: 'https://connect.stripe.com/oauth/authorize',
    tokenUrl: 'https://connect.stripe.com/oauth/token',
    scopes: ['read_write']
  }
};

export class OAuthManager {
  private static instance: OAuthManager;
  private activeWindows: Map<string, Window> = new Map();
  private pendingPromises: Map<string, { resolve: Function; reject: Function }> = new Map();

  static getInstance(): OAuthManager {
    if (!OAuthManager.instance) {
      OAuthManager.instance = new OAuthManager();
    }
    return OAuthManager.instance;
  }

  private constructor() {
    // Listen for messages from OAuth popup windows
    window.addEventListener('message', this.handlePostMessage.bind(this));
  }

  private handlePostMessage(event: MessageEvent) {
    if (event.origin !== window.location.origin) return;

    const { type, provider, success, error, data } = event.data;
    
    if (type === 'oauth-callback') {
      const pendingPromise = this.pendingPromises.get(provider);
      if (pendingPromise) {
        this.pendingPromises.delete(provider);
        
        if (success) {
          pendingPromise.resolve(data);
        } else {
          pendingPromise.reject(new Error(error || 'OAuth failed'));
        }
      }
      
      // Close the OAuth window
      const window = this.activeWindows.get(provider);
      if (window && !window.closed) {
        window.close();
      }
      this.activeWindows.delete(provider);
    }
  }

  generateSecureState(provider: string): string {
    const state: OAuthState = {
      provider,
      timestamp: Date.now(),
      redirectUrl: window.location.origin
    };
    
    const stateString = btoa(JSON.stringify(state));
    
    // Store state in sessionStorage for validation
    sessionStorage.setItem(`oauth_state_${provider}`, stateString);
    
    return stateString;
  }

  validateState(stateString: string): OAuthState | null {
    try {
      const state: OAuthState = JSON.parse(atob(stateString));
      const storedState = sessionStorage.getItem(`oauth_state_${state.provider}`);
      
      if (storedState !== stateString) {
        console.error('OAuth state mismatch');
        return null;
      }
      
      // Check if state is not too old (30 minutes)
      if (Date.now() - state.timestamp > 30 * 60 * 1000) {
        console.error('OAuth state expired');
        return null;
      }
      
      // Cleanup
      sessionStorage.removeItem(`oauth_state_${state.provider}`);
      
      return state;
    } catch (error) {
      console.error('Invalid OAuth state:', error);
      return null;
    }
  }

  async initiateOAuth(integrationId: string): Promise<any> {
    const provider = OAUTH_PROVIDERS[integrationId];
    if (!provider) {
      throw new Error(`OAuth provider not found for ${integrationId}`);
    }

    // Check if there's already an active OAuth flow for this provider
    if (this.activeWindows.has(integrationId)) {
      throw new Error(`OAuth flow already in progress for ${provider.name}`);
    }

    try {
      const redirectUrl = `${window.location.origin}/integrations/oauth/callback`;

      // Get OAuth URL from our edge function
      const { data, error } = await supabase.functions.invoke('oauth-start', {
        body: { 
          provider: integrationId, 
          redirectUrl 
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to start OAuth flow');
      }

      if (!data.oauthUrl) {
        throw new Error('No OAuth URL returned from server');
      }

      // Open OAuth window
      const authWindow = window.open(
        data.oauthUrl,
        `oauth-${integrationId}`,
        'width=600,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,directories=no,status=no'
      );

      if (!authWindow) {
        throw new Error('Failed to open OAuth popup. Please allow popups for this site.');
      }

      // Store the window reference
      this.activeWindows.set(integrationId, authWindow);

      // Return a promise that resolves when OAuth completes
      return new Promise((resolve, reject) => {
        this.pendingPromises.set(integrationId, { resolve, reject });

        // Check if window was closed manually
        const checkClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkClosed);
            
            // Clean up if window was closed without completing OAuth
            if (this.pendingPromises.has(integrationId)) {
              this.pendingPromises.delete(integrationId);
              this.activeWindows.delete(integrationId);
              reject(new Error('OAuth was cancelled by user'));
            }
          }
        }, 1000);

        // Timeout after 10 minutes
        setTimeout(() => {
          if (this.pendingPromises.has(integrationId)) {
            clearInterval(checkClosed);
            this.pendingPromises.delete(integrationId);
            
            if (!authWindow.closed) {
              authWindow.close();
            }
            this.activeWindows.delete(integrationId);
            
            reject(new Error('OAuth timeout'));
          }
        }, 10 * 60 * 1000);
      });

    } catch (error) {
      // Clean up on error
      this.activeWindows.delete(integrationId);
      this.pendingPromises.delete(integrationId);
      throw error;
    }
  }

  async checkAuthStatus(integrationId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const { data, error } = await supabase
        .from('integrations')
        .select('is_active')
        .eq('user_id', user.user.id)
        .eq('provider', integrationId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking auth status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  }

  getProviderInfo(integrationId: string): OAuthProvider | null {
    return OAUTH_PROVIDERS[integrationId] || null;
  }

  getAllProviders(): OAuthProvider[] {
    return Object.values(OAUTH_PROVIDERS);
  }

  // Cleanup method for component unmounting
  cleanup() {
    // Close all active windows
    this.activeWindows.forEach(window => {
      if (!window.closed) {
        window.close();
      }
    });
    
    // Reject all pending promises
    this.pendingPromises.forEach(({ reject }) => {
      reject(new Error('OAuth manager cleanup'));
    });
    
    // Clear maps
    this.activeWindows.clear();
    this.pendingPromises.clear();
  }
}

// Export convenience functions
export const initiateOAuth = (integrationId: string) => {
  return OAuthManager.getInstance().initiateOAuth(integrationId);
};

export const checkAuthStatus = (integrationId: string) => {
  return OAuthManager.getInstance().checkAuthStatus(integrationId);
};

export const getProviderInfo = (integrationId: string) => {
  return OAuthManager.getInstance().getProviderInfo(integrationId);
};

export const getAllProviders = () => {
  return OAuthManager.getInstance().getAllProviders();
};

// Cleanup function for app unmounting
export const cleanupOAuth = () => {
  OAuthManager.getInstance().cleanup();
};