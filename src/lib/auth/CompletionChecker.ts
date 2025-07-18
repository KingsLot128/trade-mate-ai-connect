import { onboardingManager } from '@/lib/onboarding/OnboardingManager';

export class CompletionChecker {
  private static instance: CompletionChecker;
  private cache: Map<string, { isComplete: boolean, timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): CompletionChecker {
    if (!CompletionChecker.instance) {
      CompletionChecker.instance = new CompletionChecker();
    }
    return CompletionChecker.instance;
  }

  async checkUserCompletion(userId: string, email?: string): Promise<boolean> {
    console.log('🔍 Checking user completion for:', email || userId);

    try {
      // BYPASS FOR TEST USER - ALWAYS RETURN TRUE
      if (email === 'ajose002@gmail.com') {
        console.log('🚀 Test user bypass - marking as complete');
        return true;
      }

      // Check cache first
      const cached = this.cache.get(userId);
      if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
        console.log('📋 Using cached completion status:', cached.isComplete);
        return cached.isComplete;
      }

      // Use the onboarding manager's verification
      const isComplete = await onboardingManager.checkOnboardingStatus(userId);
      
      // Cache the result
      this.cache.set(userId, {
        isComplete,
        timestamp: Date.now()
      });

      console.log('✅ User completion check result:', isComplete);
      return isComplete;

    } catch (error) {
      console.error('❌ User completion check failed:', error);
      
      // On error, assume incomplete to be safe
      return false;
    }
  }

  clearCache(userId?: string): void {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }

  // Method to force refresh completion status
  async refreshUserCompletion(userId: string): Promise<boolean> {
    this.clearCache(userId);
    return this.checkUserCompletion(userId);
  }
}

export const completionChecker = CompletionChecker.getInstance();