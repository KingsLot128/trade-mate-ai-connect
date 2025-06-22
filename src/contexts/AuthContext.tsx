
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, businessName?: string) => Promise<void>;
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
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not configured. Running in demo mode.');
      setIsConfigured(false);
      setLoading(false);
      return;
    }

    setIsConfigured(true);

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, businessName?: string) => {
    if (!isConfigured) {
      // Demo mode - simulate successful signup
      toast({
        title: "Demo Mode",
        description: "This is a demo. In production, you would receive a confirmation email.",
      });
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    // Update profile with business name if provided
    if (businessName) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ business_name: businessName })
        .eq('email', email);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
    }

    toast({
      title: "Success!",
      description: "Please check your email to confirm your account.",
    });
  };

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      // Demo mode - simulate successful login
      toast({
        title: "Demo Mode",
        description: "This is a demo. Login functionality requires backend configuration.",
      });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
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
  };

  const signOut = async () => {
    if (!isConfigured) {
      toast({
        title: "Demo Mode",
        description: "This is a demo. Sign out functionality requires backend configuration.",
      });
      return;
    }

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
      title: "Signed out",
      description: "You have successfully signed out.",
    });
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
