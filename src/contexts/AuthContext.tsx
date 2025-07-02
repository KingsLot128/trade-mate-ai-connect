
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface UserMetadata {
  businessName?: string;
  industry?: string;
  businessSize?: string;
  phone?: string;
  fullName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkSupabaseConfiguration();
  }, []);

  const checkSupabaseConfiguration = async () => {
    try {
      // Check if Supabase is properly configured by testing a simple query
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error && error.code === 'PGRST301') {
        console.warn('Supabase database not fully configured. Running in demo mode.');
        setIsConfigured(false);
      } else if (error && error.message.includes('JWT')) {
        console.warn('Supabase authentication not configured. Running in demo mode.');
        setIsConfigured(false);
      } else {
        setIsConfigured(true);
        
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      }
    } catch (error) {
      console.warn('Supabase connection test failed. Running in demo mode.', error);
      setIsConfigured(false);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: UserMetadata) => {
    if (!isConfigured) {
      toast({
        title: "Demo Mode Active",
        description: `Registration simulated for ${email}. Full functionality available when backend is configured.`,
      });
      await new Promise(resolve => setTimeout(resolve, 1500));
      return;
    }

    try {
      console.log('Attempting signup with:', { email, metadata });
      
      const signUpData = {
        email,
        password,
        options: {
          data: {
            full_name: metadata?.fullName || '',
            business_name: metadata?.businessName || '',
            industry: metadata?.industry || '',
            business_size: metadata?.businessSize || '',
            phone: metadata?.phone || ''
          }
        }
      };

      const { data, error } = await supabase.auth.signUp(signUpData);

      if (error) {
        console.error('Supabase signup error:', error);
        toast({
          title: "Registration Error",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (data.user) {
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully. You can now sign in.",
        });
      }

    } catch (error) {
      console.error('Registration process failed:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      toast({
        title: "Demo Mode Active",
        description: "Login functionality requires full backend configuration.",
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!isConfigured) {
      toast({
        title: "Demo Mode Active", 
        description: "Sign out functionality requires full backend configuration.",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign Out Error",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });

    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isConfigured,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
