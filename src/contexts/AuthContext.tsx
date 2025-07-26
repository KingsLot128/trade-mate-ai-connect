
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { completionChecker } from '@/lib/auth/CompletionChecker';

interface UserMetadata {
  businessName?: string;
  industry?: string;
  businessSize?: string;
  phone?: string;
  fullName?: string;
}

interface AuthContextType {
  user: User | null;
  session: any;
  profile: any;
  loading: boolean;
  isConfigured: boolean;
  isProfileComplete: boolean;
  isNewUser: boolean;
  error: string | null;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<{ success: boolean; error?: string; message?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfileCompletion: () => Promise<void>;
  markOnboardingComplete: () => Promise<void>;
  createProfile: (profileData: any) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: any) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
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
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
          await checkProfileCompletion(session.user, false);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('🔄 Auth state change:', event, session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
            // Only mark as new user during SIGNED_UP event  
            const isSignUp = event === 'SIGNED_UP' as AuthChangeEvent;
            await checkProfileCompletion(session.user, isSignUp);
          } else {
            setProfile(null);
            setIsProfileComplete(false);
            setIsNewUser(false);
          }
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

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
      } else if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, this is expected for new users
        console.log('Profile not found for user:', userId);
        setProfile(null);
      } else {
        console.error('Error fetching profile:', error);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, metadata?: UserMetadata) => {
    if (!isConfigured) {
      toast({
        title: "Demo Mode Active",
        description: `Registration simulated for ${email}. Full functionality available when backend is configured.`,
      });
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: false, error: "Demo mode active" };
    }

    try {
      setLoading(true);
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
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Mark as new user for onboarding flow
        setIsNewUser(true);
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully. Let's set up your profile.",
        });
        
        // If user is created and confirmed, try to create profile manually as fallback
        if (data.user.email_confirmed_at) {
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                user_id: data.user.id,
                full_name: metadata?.fullName,
                business_name: metadata?.businessName,
                phone: metadata?.phone,
                industry: metadata?.industry,
                email
              });
            
            if (profileError && profileError.code !== '23505') { // Ignore duplicate key error
              console.error('Profile creation error:', profileError);
            }
          } catch (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }
        
        return { 
          success: true, 
          message: data.user?.email_confirmed_at 
            ? 'Account created successfully!' 
            : 'Please check your email to verify your account.'
        };
      }

      return { success: false, error: "Unknown error occurred" };

    } catch (error) {
      console.error('Registration process failed:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      toast({
        title: "Demo Mode Active",
        description: "Login functionality requires full backend configuration.",
      });
      return { success: false, error: "Demo mode active" };
    }

    try {
      setLoading(true);
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
        return { success: false, error: error.message };
      }

      // For sign-in, don't mark as new user
      setIsNewUser(false);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return { success: true };

    } catch (error) {
      console.error('Sign in failed:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const checkProfileCompletion = async (user: User, isSignUpEvent: boolean = false) => {
    try {
      console.log('🔍 Checking profile completion for:', user.email, 'isSignUp:', isSignUpEvent);
      
      // Set new user flag based on sign-up event
      setIsNewUser(isSignUpEvent);
      
      const isComplete = await completionChecker.checkUserCompletion(user.id, user.email);
      setIsProfileComplete(isComplete);
      setError(null);
      
      console.log('✅ Profile completion status:', isComplete, 'New user:', isSignUpEvent);
    } catch (error) {
      console.error('❌ Profile completion check failed:', error);
      setError('Failed to check profile completion');
      setIsProfileComplete(false);
    }
  };

  const refreshProfileCompletion = async () => {
    if (user) {
      await checkProfileCompletion(user, false);
    }
  };

  const markOnboardingComplete = async () => {
    if (user) {
      try {
        // Update the user's profile to mark onboarding as complete
        await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            onboarding_step: 'completed',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        // Clear the completion cache and refresh
        completionChecker.clearCache(user.id);
        await refreshProfileCompletion();
        
        // Clear new user flag
        setIsNewUser(false);
        
        console.log('✅ Onboarding marked as complete');
      } catch (error) {
        console.error('❌ Failed to mark onboarding complete:', error);
      }
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
      setLoading(true);
      setError(null);
      
      // Clear completion cache
      if (user) {
        completionChecker.clearCache(user.id);
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setIsProfileComplete(false);
      setIsNewUser(false);

      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });

    } catch (error) {
      console.error('❌ Sign out failed:', error);
      setError('Sign out failed');
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: any) => {
    try {
      if (!user) {
        return { success: false, error: 'No authenticated user' };
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          email: user.email,
          ...profileData
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setProfile(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) {
        return { success: false, error: 'No authenticated user' };
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setProfile(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isConfigured,
    isProfileComplete,
    isNewUser,
    error,
    signUp,
    signIn,
    signOut,
    refreshProfileCompletion,
    markOnboardingComplete,
    createProfile,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
