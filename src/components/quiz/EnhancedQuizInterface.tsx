import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { generateMagicLinkWithPrePopulation, generateBrowserFingerprint } from '@/utils/magicLinkEnhanced';
import { toast } from 'sonner';

interface QuizData {
  businessName: string;
  industry: string;
  monthlyRevenue: number;
  employeeCount: number;
  biggestChallenge: string;
  responses: Record<string, any>;
}

interface QuizStep {
  id: string;
  title: string;
  question: string;
  type: 'text' | 'select' | 'number' | 'multiselect';
  options?: string[];
  required: boolean;
}

const EnhancedQuizInterface = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({} as QuizData);
  const [showResults, setShowResults] = useState(false);
  const [chaosScore, setChaosScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const quizSteps: QuizStep[] = [
    {
      id: 'business_name',
      title: 'Business Information',
      question: 'What\'s your business name?',
      type: 'text',
      required: true
    },
    {
      id: 'industry',
      title: 'Industry Focus',
      question: 'What industry are you in?',
      type: 'select',
      options: ['Construction', 'HVAC', 'Plumbing', 'Electrical', 'Landscaping', 'Cleaning', 'Home Services', 'Other'],
      required: true
    },
    {
      id: 'monthly_revenue',
      title: 'Business Scale',
      question: 'What\'s your approximate monthly revenue?',
      type: 'select',
      options: ['Under $10K', '$10K - $25K', '$25K - $50K', '$50K - $100K', '$100K+'],
      required: true
    },
    {
      id: 'employee_count',
      title: 'Team Size',
      question: 'How many employees do you have?',
      type: 'select',
      options: ['Just me', '2-5', '6-15', '16-50', '50+'],
      required: true
    },
    {
      id: 'biggest_challenge',
      title: 'Current Challenges',
      question: 'What\'s your biggest business challenge right now?',
      type: 'select',
      options: [
        'Finding quality leads',
        'Managing customer relationships',
        'Tracking finances',
        'Scheduling and organization',
        'Pricing and profitability',
        'Team management',
        'Marketing and visibility'
      ],
      required: true
    }
  ];

  const calculateChaosScore = (data: QuizData): number => {
    let score = 0;
    
    // Revenue scale impact
    const revenueMap: Record<string, number> = {
      'Under $10K': 30,
      '$10K - $25K': 20,
      '$25K - $50K': 15,
      '$50K - $100K': 10,
      '$100K+': 5
    };
    score += revenueMap[data.responses?.monthly_revenue] || 25;

    // Team size impact
    const teamMap: Record<string, number> = {
      'Just me': 25,
      '2-5': 15,
      '6-15': 10,
      '16-50': 5,
      '50+': 0
    };
    score += teamMap[data.responses?.employee_count] || 20;

    // Challenge impact
    const challengeMap: Record<string, number> = {
      'Finding quality leads': 20,
      'Managing customer relationships': 15,
      'Tracking finances': 25,
      'Scheduling and organization': 30,
      'Pricing and profitability': 20,
      'Team management': 15,
      'Marketing and visibility': 18
    };
    score += challengeMap[data.responses?.biggest_challenge] || 20;

    return Math.min(100, score);
  };

  const handleStepComplete = (stepId: string, value: any) => {
    const updatedData = {
      ...quizData,
      responses: { ...quizData.responses, [stepId]: value }
    };
    
    if (stepId === 'business_name') updatedData.businessName = value;
    if (stepId === 'industry') updatedData.industry = value;
    
    setQuizData(updatedData);
  };

  const handleQuizCompletion = async () => {
    setIsLoading(true);
    
    try {
      const score = calculateChaosScore(quizData);
      setChaosScore(score);
      setShowResults(true);
      
      // Track completion
      toast.success('Quiz completed! Analyzing your results...');
    } catch (error) {
      console.error('Quiz completion error:', error);
      toast.error('Error processing results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleQuizCompletion();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (showResults) {
    return (
      <InstantResultsDisplay 
        chaosScore={chaosScore}
        quizData={quizData}
        onConvert={handleMagicConversion}
      />
    );
  }

  const currentQuizStep = quizSteps[currentStep];
  const progress = ((currentStep + 1) / quizSteps.length) * 100;

  return (
    <div className="enhanced-quiz-interface max-w-2xl mx-auto p-6">
      {/* Progress Header */}
      <div className="progress-header mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Business Clarity Assessment</h2>
          <Badge variant="secondary">
            Step {currentStep + 1} of {quizSteps.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-sm text-muted-foreground mt-2">
          {Math.round(progress)}% complete
        </div>
      </div>

      {/* Quiz Step */}
      <Card className="quiz-step-card">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuizStep.title}</CardTitle>
          <p className="text-lg text-muted-foreground">{currentQuizStep.question}</p>
        </CardHeader>
        <CardContent>
          <QuizStepInput 
            step={currentQuizStep}
            value={quizData.responses?.[currentQuizStep.id] || ''}
            onChange={(value) => handleStepComplete(currentQuizStep.id, value)}
          />
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button 
              onClick={handleNextStep}
              disabled={!quizData.responses?.[currentQuizStep.id] && currentQuizStep.required}
            >
              {currentStep === quizSteps.length - 1 ? 'Complete Assessment' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const QuizStepInput = ({ step, value, onChange }: {
  step: QuizStep;
  value: any;
  onChange: (value: any) => void;
}) => {
  if (step.type === 'text') {
    return (
      <Input
        placeholder="Enter your answer..."
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="text-lg p-6"
      />
    );
  }

  if (step.type === 'select') {
    return (
      <div className="space-y-3">
        {step.options?.map(option => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              value === option
                ? 'border-primary bg-primary/5 text-primary font-medium'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  return null;
};

const InstantResultsDisplay = ({ chaosScore, quizData, onConvert }: {
  chaosScore: number;
  quizData: QuizData;
  onConvert: (data: any) => void;
}) => {
  const [email, setEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getClarityZone = (score: number) => {
    if (score >= 70) return { zone: 'chaos', color: 'red', message: 'High Chaos Zone', emoji: '🌪️' };
    if (score >= 40) return { zone: 'control', color: 'yellow', message: 'Control Zone', emoji: '⚡' };
    return { zone: 'clarity', color: 'green', message: 'Clarity Zone', emoji: '🎯' };
  };

  const clarityInfo = getClarityZone(chaosScore);
  const percentile = Math.max(10, 100 - chaosScore);

  const handleMagicConversion = async () => {
    if (!email) return;
    
    setIsLoading(true);
    
    try {
      const browserFingerprint = generateBrowserFingerprint();
      const quizSession = {
        responses: Object.entries(quizData.responses || {}).map(([questionId, answer]) => ({
          questionId,
          answer,
          chaosContribution: 10 // simplified
        })),
        chaosScore,
        clarityZone: clarityInfo.zone as 'chaos' | 'control' | 'clarity',
        industryBenchmarks: {
          industry: quizData.industry,
          averageScore: 55,
          topPerformerScore: 25,
          percentile
        },
        timestamp: new Date(),
        browserFingerprint
      };

      const result = await generateMagicLinkWithPrePopulation(email, quizSession);
      
      toast.success('Magic link sent! Check your email for instant access.');
      setMagicLinkSent(true);
      onConvert(result);
    } catch (error) {
      console.error('Magic conversion failed:', error);
      toast.error('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="magic-success text-center p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
        <div className="text-6xl mb-4">📧</div>
        <h3 className="text-3xl font-bold text-green-800 mb-4">Check Your Email!</h3>
        <p className="text-xl text-green-700 mb-6">
          We've sent you a magic link to access your personalized business intelligence dashboard.
        </p>
        <div className="bg-white p-4 rounded-lg shadow-sm inline-block">
          <div className="text-sm text-green-600 font-medium">
            ✨ One-click access • No password required • Pre-populated with your data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="instant-results-display max-w-4xl mx-auto">
      {/* Hero Results Section */}
      <div className="results-hero text-center mb-8 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        {/* Animated Chaos Score Circle */}
        <div className="chaos-score-container mb-6">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={`hsl(var(--${clarityInfo.color === 'red' ? 'destructive' : clarityInfo.color === 'yellow' ? 'yellow-500' : 'primary'}))`}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - chaosScore / 100)}`}
                className="transition-all duration-2000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {chaosScore}%
                </div>
                <div className="text-sm text-muted-foreground">Chaos Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Clarity Zone Badge */}
        <div className="inline-flex items-center px-6 py-3 rounded-full bg-background border-2 mb-4">
          <span className="text-2xl mr-2">{clarityInfo.emoji}</span>
          <span className="text-lg font-bold">
            {clarityInfo.message.toUpperCase()}
          </span>
        </div>

        {/* Industry Benchmark */}
        <div className="benchmark-highlight p-6 bg-background rounded-lg shadow-sm mb-6 max-w-2xl mx-auto">
          <div className="text-2xl font-semibold text-primary mb-2">
            🎯 You're in the top {percentile}% of {quizData.industry} companies
          </div>
          <div className="text-muted-foreground">
            Based on similar business assessments
          </div>
        </div>

        {/* Quick Preview */}
        <div className="quick-wins-preview grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-background rounded-lg border-l-4 border-primary shadow-sm">
            <h4 className="font-semibold text-primary mb-3">🚀 Quick Wins Available</h4>
            <ul className="text-left space-y-2 text-sm">
              <li>• Set up automated customer follow-ups</li>
              <li>• Implement lead scoring system</li>
              <li>• Create financial tracking dashboard</li>
            </ul>
          </div>
          <div className="p-6 bg-background rounded-lg border-l-4 border-secondary shadow-sm">
            <h4 className="font-semibold text-secondary mb-3">💡 Strategic Opportunities</h4>
            <ul className="text-left space-y-2 text-sm">
              <li>• Optimize pricing strategy</li>
              <li>• Scale marketing efforts</li>
              <li>• Build operational systems</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Magic Conversion Section */}
      <div className="magic-conversion p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold mb-2">Get Your Live Clarity Dashboard</h3>
          <p className="text-xl opacity-90 mb-4">
            Access personalized recommendations and track your progress in real-time
          </p>
          
          {/* Dashboard Preview */}
          <div className="dashboard-preview mb-6 p-4 bg-white/10 rounded-lg backdrop-blur">
            <div className="text-sm opacity-90 mb-3">Your dashboard will include:</div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <span className="mr-2">📊</span>
                Live business health tracking
              </div>
              <div className="flex items-center">
                <span className="mr-2">🎯</span>
                Daily AI recommendations
              </div>
              <div className="flex items-center">
                <span className="mr-2">📈</span>
                Industry benchmarking
              </div>
            </div>
          </div>
        </div>
        
        {/* Email Input */}
        <div className="max-w-md mx-auto">
          <div className="flex">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 text-lg bg-white text-black"
              disabled={isLoading}
            />
            <Button 
              onClick={handleMagicConversion}
              disabled={!email || isLoading}
              className="px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Get Dashboard →'
              )}
            </Button>
          </div>
          
          <div className="text-center mt-3 text-sm opacity-90">
            ✨ One-click access • No password required • Instant setup
          </div>
        </div>
      </div>
    </div>
  );
};

const handleMagicConversion = (data: any) => {
  // Handle conversion complete
  console.log('Magic conversion completed:', data);
};

export default EnhancedQuizInterface;