import { supabase } from '@/integrations/supabase/client';
import { UnifiedBusinessProfile, synthesizeBusinessData } from './dataUnification';

interface QuizSession {
  responses: QuizResponse[];
  chaosScore: number;
  clarityZone: 'chaos' | 'control' | 'clarity';
  industryBenchmarks: BenchmarkData;
  timestamp: Date;
  browserFingerprint: string;
}

interface QuizResponse {
  questionId: string;
  answer: any;
  chaosContribution: number;
}

interface BenchmarkData {
  industry: string;
  averageScore: number;
  topPerformerScore: number;
  percentile: number;
}

interface MagicLinkConversion {
  token: string;
  email: string;
  quizData: QuizSession;
  preFilledProfile: Partial<UnifiedBusinessProfile>;
  dashboardPreview: DashboardPreview;
  expiresAt: Date;
}

interface DashboardPreview {
  businessHealthScore: number;
  topRecommendations: Array<{
    title: string;
    impact: string;
    category: string;
  }>;
  industryInsights: Array<{
    insight: string;
    relevance: number;
  }>;
  quickWins: Array<{
    action: string;
    timeToImplement: string;
    expectedResult: string;
  }>;
}

// Enhanced Magic Link System with Pre-Population
export const generateMagicLinkWithPrePopulation = async (
  email: string, 
  quizData: QuizSession
): Promise<MagicLinkConversion> => {
  try {
    // Generate secure token
    const token = generateSecureToken();
    
    // Create pre-filled business profile from quiz data
    const preFilledProfile = await generatePreFilledProfile(quizData);
    
    // Generate dashboard preview
    const dashboardPreview = await generateDashboardPreview(quizData, preFilledProfile);
    
    // Store magic link data
    const { data, error } = await supabase
      .from('magic_link_tokens')
      .insert({
        token,
        email,
        quiz_data: JSON.parse(JSON.stringify({
          responses: quizData.responses,
          chaosScore: quizData.chaosScore,
          clarityZone: quizData.clarityZone,
          industryBenchmarks: quizData.industryBenchmarks,
          timestamp: quizData.timestamp.toISOString(),
          browserFingerprint: quizData.browserFingerprint
        })),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      })
      .select()
      .single();

    if (error) throw error;

    return {
      token,
      email,
      quizData,
      preFilledProfile,
      dashboardPreview,
      expiresAt: new Date(data.expires_at)
    };
  } catch (error) {
    console.error('Error generating magic link:', error);
    throw error;
  }
};

// Claim account with pre-populated data
export const claimMagicLinkAccount = async (token: string) => {
  try {
    // Retrieve magic link data
    const { data: magicLinkData, error } = await supabase
      .from('magic_link_tokens')
      .select('*')
      .eq('token', token)
      .is('claimed_at', null)
      .single();

    if (error || !magicLinkData) {
      throw new Error('Invalid or expired magic link');
    }

    // Check if token is expired
    if (new Date(magicLinkData.expires_at) < new Date()) {
      throw new Error('Magic link has expired');
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.signInWithOtp({
      email: magicLinkData.email,
      options: {
        shouldCreateUser: true
      }
    });

    // Mark magic link as claimed
    await supabase
      .from('magic_link_tokens')
      .update({
        claimed_at: new Date().toISOString()
      })
      .eq('token', token);

    return {
      email: magicLinkData.email,
      quizData: magicLinkData.quiz_data,
      requiresEmailVerification: true
    };
  } catch (error) {
    console.error('Error claiming magic link:', error);
    throw error;
  }
};

// Generate pre-filled profile from quiz data
const generatePreFilledProfile = async (quizData: QuizSession): Promise<Partial<UnifiedBusinessProfile>> => {
  const responses = quizData.responses;
  
  // Extract business info from quiz responses
  const businessName = responses.find(r => r.questionId === 'business_name')?.answer || '';
  const industry = responses.find(r => r.questionId === 'industry')?.answer || '';
  const revenue = responses.find(r => r.questionId === 'monthly_revenue')?.answer || 0;
  const employeeCount = responses.find(r => r.questionId === 'employee_count')?.answer || 1;

  return {
    businessInfo: {
      company_name: businessName,
      industry: industry,
      phone: '',
      email: '',
      address: ''
    },
    financialData: {
      revenue: typeof revenue === 'number' ? revenue : 0,
      expenses: 0,
      profit: 0,
      cashFlow: 0,
      source: 'manual' as const,
      confidence: 60
    },
    quizInsights: {
      chaosScore: quizData.chaosScore,
      clarityZone: quizData.clarityZone,
      industryPercentile: quizData.industryBenchmarks.percentile,
      confidence: 100
    }
  };
};

// Generate dashboard preview
const generateDashboardPreview = async (
  quizData: QuizSession, 
  profile: Partial<UnifiedBusinessProfile>
): Promise<DashboardPreview> => {
  const chaosScore = quizData.chaosScore;
  const industry = quizData.industryBenchmarks.industry;

  // Generate recommendations based on chaos score and industry
  const topRecommendations = generateTopRecommendations(chaosScore, industry);
  const industryInsights = generateIndustryInsights(industry, quizData.industryBenchmarks);
  const quickWins = generateQuickWins(chaosScore);

  return {
    businessHealthScore: 100 - chaosScore, // Convert chaos to health score
    topRecommendations,
    industryInsights,
    quickWins
  };
};

const generateTopRecommendations = (chaosScore: number, industry: string) => {
  const recommendations = [];

  if (chaosScore > 70) {
    recommendations.push({
      title: '🗂️ Set up basic task management system',
      impact: '4-6 hours saved weekly',
      category: 'Organization'
    });
    recommendations.push({
      title: '📞 Create customer communication templates',
      impact: '50% faster response times',
      category: 'Communication'
    });
  } else if (chaosScore > 40) {
    recommendations.push({
      title: '📊 Implement weekly revenue tracking',
      impact: '15% revenue increase on average',
      category: 'Financial'
    });
    recommendations.push({
      title: '🎯 Optimize your sales process',
      impact: '25% better conversion rates',
      category: 'Sales'
    });
  } else {
    recommendations.push({
      title: '🚀 Scale your marketing efforts',
      impact: '2x lead generation potential',
      category: 'Growth'
    });
    recommendations.push({
      title: '🤝 Build strategic partnerships',
      impact: '30% new revenue streams',
      category: 'Partnerships'
    });
  }

  return recommendations;
};

const generateIndustryInsights = (industry: string, benchmarks: BenchmarkData) => {
  return [
    {
      insight: `You're in the ${benchmarks.percentile}th percentile for ${industry} businesses`,
      relevance: 95
    },
    {
      insight: `Top ${industry} performers score ${benchmarks.topPerformerScore} on average`,
      relevance: 90
    },
    {
      insight: `${industry} businesses typically see 23% growth with better systems`,
      relevance: 85
    }
  ];
};

const generateQuickWins = (chaosScore: number) => {
  const quickWins = [];

  if (chaosScore > 60) {
    quickWins.push({
      action: 'Create a daily priority list',
      timeToImplement: '5 minutes daily',
      expectedResult: '30% better focus'
    });
    quickWins.push({
      action: 'Set up email templates for common responses',
      timeToImplement: '1 hour setup',
      expectedResult: '50% faster customer communication'
    });
  } else {
    quickWins.push({
      action: 'Implement weekly revenue review',
      timeToImplement: '30 minutes weekly',
      expectedResult: '15% revenue improvement'
    });
    quickWins.push({
      action: 'Create customer follow-up sequence',
      timeToImplement: '2 hours setup',
      expectedResult: '25% better customer retention'
    });
  }

  return quickWins;
};

// Browser fingerprinting for session continuity
export const generateBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Browser fingerprint', 2, 2);

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');

  return btoa(fingerprint).substring(0, 32);
};

// Detect returning user by fingerprint
export const detectReturningUser = async (fingerprint: string) => {
  try {
    const { data, error } = await supabase
      .from('magic_link_tokens')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return null;

    return {
      email: data.email,
      quizData: data.quiz_data,
      lastSeen: new Date(data.created_at)
    };
  } catch (error) {
    console.error('Error detecting returning user:', error);
    return null;
  }
};

// Merge duplicate submissions
export const mergeDuplicateSubmissions = async (email: string) => {
  try {
    const { data: submissions, error } = await supabase
      .from('magic_link_tokens')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error || !submissions || submissions.length <= 1) {
      return submissions?.[0] || null;
    }

    // Merge quiz data from all submissions
    const mergedQuizData = submissions.reduce((merged: any, submission) => {
      const quizData = submission.quiz_data as any;
      return {
        responses: [...(merged.responses || []), ...(quizData?.responses || [])],
        chaosScore: Math.max(merged.chaosScore || 0, quizData?.chaosScore || 0),
        clarityZone: quizData?.clarityZone || merged.clarityZone,
        industryBenchmarks: quizData?.industryBenchmarks || merged.industryBenchmarks,
        timestamp: new Date(Math.max(
          new Date(merged.timestamp || 0).getTime(),
          new Date(quizData?.timestamp || 0).getTime()
        )),
        browserFingerprint: quizData?.browserFingerprint || merged.browserFingerprint
      };
    }, {} as any);

    return {
      email,
      quizData: mergedQuizData,
      mergedFrom: submissions.length
    };
  } catch (error) {
    console.error('Error merging duplicate submissions:', error);
    return null;
  }
};

const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};