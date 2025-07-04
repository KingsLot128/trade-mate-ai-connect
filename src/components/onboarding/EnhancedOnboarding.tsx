import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, Brain, Target, Zap } from 'lucide-react';
import { ChaosQuizResponse, processQuizResults, ChaosResults } from '@/utils/chaosScoring';
import DataVault from '@/components/privacy/DataVault';
import SetupPreferenceSelector from './SetupPreferenceSelector';

interface FormData {
  // Basic business info
  businessName: string;
  industry: string;
  phone: string;
  primaryServices: string[];
  businessGoals: string;
  targetCustomers: string;
  competitionLevel: string;
  pricingStrategy: string;
  serviceAreaRadius: string;
  projectRangeMin: string;
  projectRangeMax: string;
  seasonalPatterns: string;
  
  // Chaos assessment
  daily_overwhelm: number;
  revenue_predictability: number;
  customer_acquisition: string;
  biggest_challenge: string;
  task_management_difficulty: number;
  financial_tracking: number;
  customer_communication: number;
  time_management: number;
}

const EnhancedOnboarding = () => {
  const { user, checkProfileComplete, isQuizCompleted, onboardingStep } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(() => {
    // Smart step initialization based on user state
    if (isQuizCompleted && onboardingStep === 'preferences') return 6;
    if (isQuizCompleted) return 5;
    return 1;
  });
  const [chaosResults, setChaosResults] = useState<ChaosResults | null>(null);
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    industry: '',
    phone: '',
    primaryServices: [],
    businessGoals: '',
    targetCustomers: '',
    competitionLevel: '',
    pricingStrategy: '',
    serviceAreaRadius: '',
    projectRangeMin: '',
    projectRangeMax: '',
    seasonalPatterns: '',
    daily_overwhelm: 5,
    revenue_predictability: 5,
    customer_acquisition: '',
    biggest_challenge: '',
    task_management_difficulty: 5,
    financial_tracking: 5,
    customer_communication: 5,
    time_management: 5
  });

  const industries = [
    'Plumbing', 'Electrical', 'HVAC', 'General Contractor', 'Roofing',
    'Flooring', 'Painting', 'Landscaping', 'Carpentry', 'Other'
  ];

  const services = [
    'Residential Repair', 'Commercial Services', 'New Installation',
    'Maintenance Contracts', 'Emergency Services', 'Renovation',
    'Consultation', 'Design Services'
  ];

  const customerAcquisitionMethods = [
    'Referrals', 'Online marketing', 'Cold outreach', 'Repeat customers', 'Other'
  ];

  const biggestChallenges = [
    'Finding customers', 'Managing cash flow', 'Time management', 'Team coordination', 'Pricing/profitability'
  ];

  const competitionLevels = [
    'Low - Few competitors', 'Medium - Some competition', 'High - Very competitive'
  ];

  const pricingStrategies = [
    'Premium pricing', 'Competitive pricing', 'Value-based pricing', 'Cost-plus pricing'
  ];

  const seasonalOptions = [
    'Year-round steady', 'Busy in summer', 'Busy in winter', 'Project-dependent'
  ];

  const validateStep1 = () => {
    return formData.businessName && formData.industry && formData.phone;
  };

  const validateStep2 = () => {
    return formData.primaryServices.length > 0 && formData.businessGoals;
  };

  const validateStep3 = () => {
    return formData.targetCustomers && formData.competitionLevel && formData.pricingStrategy;
  };

  const validateStep4 = () => {
    return formData.customer_acquisition && formData.biggest_challenge;
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      primaryServices: prev.primaryServices.includes(service)
        ? prev.primaryServices.filter(s => s !== service)
        : [...prev.primaryServices, service]
    }));
  };

  const handleChaosAssessment = () => {
    const chaosQuizData: ChaosQuizResponse = {
      daily_overwhelm: formData.daily_overwhelm,
      revenue_predictability: formData.revenue_predictability,
      customer_acquisition: formData.customer_acquisition,
      biggest_challenge: formData.biggest_challenge,
      task_management_difficulty: formData.task_management_difficulty,
      financial_tracking: formData.financial_tracking,
      customer_communication: formData.customer_communication,
      time_management: formData.time_management
    };

    const results = processQuizResults(chaosQuizData, formData.industry);
    setChaosResults(results);
    setStep(5); // Move to results screen
  };

  const handleSubmit = async () => {
    if (!user || !chaosResults) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          business_name: formData.businessName,
          industry: formData.industry,
          phone: formData.phone,
          primary_service_types: formData.primaryServices,
          business_goals: formData.businessGoals,
          target_customer_type: formData.targetCustomers,
          competition_level: formData.competitionLevel,
          pricing_strategy: formData.pricingStrategy,
          service_area_radius: formData.serviceAreaRadius ? parseInt(formData.serviceAreaRadius) : null,
          typical_project_range_min: formData.projectRangeMin ? parseFloat(formData.projectRangeMin) : null,
          typical_project_range_max: formData.projectRangeMax ? parseFloat(formData.projectRangeMax) : null,
          seasonal_patterns: formData.seasonalPatterns,
          chaos_score: chaosResults.chaos_score,
          clarity_zone: chaosResults.clarity_zone,
          industry_percentile: chaosResults.industry_percentile,
          daily_overwhelm_score: formData.daily_overwhelm,
          revenue_predictability_score: formData.revenue_predictability,
          customer_acquisition_method: formData.customer_acquisition,
          biggest_challenge: formData.biggest_challenge,
          quiz_completed_at: new Date().toISOString(),
          onboarding_step: 'completed',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Store detailed quiz responses
      const quizResponses = [
        { question_id: 'daily_overwhelm', response: { value: formData.daily_overwhelm }, chaos_contribution: formData.daily_overwhelm * 10 },
        { question_id: 'revenue_predictability', response: { value: formData.revenue_predictability }, chaos_contribution: (11 - formData.revenue_predictability) * 8 },
        { question_id: 'customer_acquisition', response: { value: formData.customer_acquisition }, chaos_contribution: 25 },
        { question_id: 'biggest_challenge', response: { value: formData.biggest_challenge }, chaos_contribution: 25 },
        { question_id: 'task_management_difficulty', response: { value: formData.task_management_difficulty }, chaos_contribution: formData.task_management_difficulty * 8 },
        { question_id: 'financial_tracking', response: { value: formData.financial_tracking }, chaos_contribution: (11 - formData.financial_tracking) * 6 },
        { question_id: 'customer_communication', response: { value: formData.customer_communication }, chaos_contribution: formData.customer_communication * 6 },
        { question_id: 'time_management', response: { value: formData.time_management }, chaos_contribution: formData.time_management * 8 }
      ];

      for (const response of quizResponses) {
        await supabase
          .from('user_quiz_responses')
          .insert({
            user_id: user.id,
            question_id: response.question_id,
            response: response.response,
            chaos_contribution: response.chaos_contribution
          });
      }

      await checkProfileComplete();
      
      toast({
        title: "Profile Complete!",
        description: "Welcome to TradeMate AI. Your clarity dashboard is ready.",
      });

      navigate('/dashboard');

    } catch (error) {
      console.error('Profile update failed:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceSelect = async (option: any) => {
    try {
      setLoading(true);
      
      // Save preference to database
      await supabase
        .from('profiles')
        .upsert({ 
          user_id: user?.id,
          setup_preference: option.id,
          onboarding_step: 'preferences_selected'
        });

      toast({
        title: "Preference Saved",
        description: `We'll set you up with ${option.title.toLowerCase()}.`,
      });

      setStep(7); // Go to final completion
    } catch (error) {
      console.error('Error saving preference:', error);
      toast({
        title: "Error",
        description: "Failed to save preference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getProgress = () => {
    switch (step) {
      case 1: return 20;
      case 2: return 40;
      case 3: return 60;
      case 4: return 80;
      case 5: return 100;
      default: return 0;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getZoneBadgeStyle = (zone: string) => {
    switch (zone) {
      case 'chaos': return 'bg-red-100 text-red-800 border-red-200';
      case 'control': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'clarity': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Business Basics</h3>
              <p className="text-sm text-gray-600">Let's start with your business information</p>
            </div>
            
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                placeholder="e.g., Smith Plumbing LLC"
                required
              />
            </div>
            <div>
              <Label htmlFor="industry">Primary Trade *</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => setFormData({...formData, industry: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary trade" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phone">Business Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(555) 123-4567"
                required
              />
            </div>
            <Button 
              onClick={() => setStep(2)} 
              className="w-full"
              disabled={!validateStep1()}
            >
              Continue <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Services & Goals</h3>
              <p className="text-sm text-gray-600">What services do you offer and what are your goals?</p>
            </div>
            
            <div>
              <Label>Primary Services *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {services.map((service) => (
                  <Button
                    key={service}
                    type="button"
                    variant={formData.primaryServices.includes(service) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleServiceToggle(service)}
                    className="justify-start"
                  >
                    {service}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="businessGoals">Business Goals *</Label>
              <Textarea
                id="businessGoals"
                value={formData.businessGoals}
                onChange={(e) => setFormData({...formData, businessGoals: e.target.value})}
                placeholder="What are your main business objectives for the next year?"
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(1)} 
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button 
                onClick={() => setStep(3)} 
                disabled={!validateStep2()}
                className="flex-1"
              >
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Market & Strategy</h3>
              <p className="text-sm text-gray-600">Tell us about your market and pricing approach</p>
            </div>
            
            <div>
              <Label htmlFor="targetCustomers">Target Customer Type *</Label>
              <Input
                id="targetCustomers"
                value={formData.targetCustomers}
                onChange={(e) => setFormData({...formData, targetCustomers: e.target.value})}
                placeholder="e.g., Homeowners, Small businesses, Property managers"
              />
            </div>
            <div>
              <Label>Competition Level *</Label>
              <Select 
                value={formData.competitionLevel} 
                onValueChange={(value) => setFormData({...formData, competitionLevel: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How competitive is your market?" />
                </SelectTrigger>
                <SelectContent>
                  {competitionLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pricing Strategy *</Label>
              <Select 
                value={formData.pricingStrategy} 
                onValueChange={(value) => setFormData({...formData, pricingStrategy: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How do you price your services?" />
                </SelectTrigger>
                <SelectContent>
                  {pricingStrategies.map((strategy) => (
                    <SelectItem key={strategy} value={strategy}>{strategy}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectRangeMin">Typical Project Min ($)</Label>
                <Input
                  id="projectRangeMin"
                  type="number"
                  value={formData.projectRangeMin}
                  onChange={(e) => setFormData({...formData, projectRangeMin: e.target.value})}
                  placeholder="500"
                />
              </div>
              <div>
                <Label htmlFor="projectRangeMax">Typical Project Max ($)</Label>
                <Input
                  id="projectRangeMax"
                  type="number"
                  value={formData.projectRangeMax}
                  onChange={(e) => setFormData({...formData, projectRangeMax: e.target.value})}
                  placeholder="5000"
                />
              </div>
            </div>
            <div>
              <Label>Seasonal Patterns</Label>
              <Select 
                value={formData.seasonalPatterns} 
                onValueChange={(value) => setFormData({...formData, seasonalPatterns: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How does your business vary by season?" />
                </SelectTrigger>
                <SelectContent>
                  {seasonalOptions.map((pattern) => (
                    <SelectItem key={pattern} value={pattern}>{pattern}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(2)} 
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button 
                onClick={() => setStep(4)} 
                disabled={!validateStep3()}
                className="flex-1"
              >
                Continue <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <Brain className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Business Clarity Assessment</h3>
              </div>
              <p className="text-sm text-gray-600">Help us understand your current business challenges</p>
            </div>
            
            {/* Daily Overwhelm Scale */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">How often do you feel overwhelmed by daily business tasks?</Label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.daily_overwhelm}
                  onChange={(e) => setFormData({...formData, daily_overwhelm: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Never (1)</span>
                  <span className="font-medium">Currently: {formData.daily_overwhelm}</span>
                  <span>Constantly (10)</span>
                </div>
              </div>
            </div>

            {/* Revenue Predictability */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">How predictable is your monthly revenue?</Label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.revenue_predictability}
                  onChange={(e) => setFormData({...formData, revenue_predictability: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Unpredictable (1)</span>
                  <span className="font-medium">Currently: {formData.revenue_predictability}</span>
                  <span>Very predictable (10)</span>
                </div>
              </div>
            </div>

            {/* Customer Acquisition */}
            <div>
              <Label>How do you currently get most of your customers? *</Label>
              <Select 
                value={formData.customer_acquisition} 
                onValueChange={(value) => setFormData({...formData, customer_acquisition: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary customer acquisition method" />
                </SelectTrigger>
                <SelectContent>
                  {customerAcquisitionMethods.map((method) => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Biggest Challenge */}
            <div>
              <Label>What's your biggest business challenge right now? *</Label>
              <Select 
                value={formData.biggest_challenge} 
                onValueChange={(value) => setFormData({...formData, biggest_challenge: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your biggest challenge" />
                </SelectTrigger>
                <SelectContent>
                  {biggestChallenges.map((challenge) => (
                    <SelectItem key={challenge} value={challenge}>{challenge}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Additional Quick Assessment Scales */}
            <div className="grid grid-cols-1 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-sm">Task Management Difficulty (1-10)</Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.task_management_difficulty}
                  onChange={(e) => setFormData({...formData, task_management_difficulty: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-center">Currently: {formData.task_management_difficulty}</div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Financial Tracking Accuracy (1-10)</Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.financial_tracking}
                  onChange={(e) => setFormData({...formData, financial_tracking: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-center">Currently: {formData.financial_tracking}</div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Customer Communication Issues (1-10)</Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.customer_communication}
                  onChange={(e) => setFormData({...formData, customer_communication: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-center">Currently: {formData.customer_communication}</div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Time Management Challenges (1-10)</Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.time_management}
                  onChange={(e) => setFormData({...formData, time_management: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-center">Currently: {formData.time_management}</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(3)} 
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button 
                onClick={handleChaosAssessment}
                disabled={!validateStep4()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Brain className="h-4 w-4 mr-2" />
                Calculate My Score
              </Button>
            </div>
          </div>
        );

      case 5:
        if (!chaosResults) return null;
        
        return (
          <div className="space-y-6">
            {/* Chaos Score Display */}
            <div className="text-center">
              <div className="chaos-score-circle mb-4">
                <div className={`text-6xl font-bold ${getScoreColor(chaosResults.chaos_score)}`}>
                  {chaosResults.chaos_score}%
                </div>
                <div className="text-xl text-gray-600">Business Clarity Score</div>
                <div className="text-sm text-gray-500">(Lower is better)</div>
              </div>
              
              <Badge className={`text-lg px-4 py-2 ${getZoneBadgeStyle(chaosResults.clarity_zone)}`}>
                {chaosResults.clarity_zone.toUpperCase()} ZONE
              </Badge>
              
              <div className="benchmark-highlight mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-800">
                  🎯 You're in the top {chaosResults.industry_percentile}% of {formData.industry} companies
                </div>
              </div>
            </div>

            {/* Quick Wins & Strategic Opportunities */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="quick-wins p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Quick Wins (This Week)
                </h4>
                <ul className="space-y-2">
                  {chaosResults.quick_wins.map((win, index) => (
                    <li key={index} className="text-green-700 text-sm">• {win}</li>
                  ))}
                </ul>
              </div>
              
              <div className="strategic-moves p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Strategic Opportunities
                </h4>
                <ul className="space-y-2">
                  {chaosResults.strategic_opportunities.map((opp, index) => (
                    <li key={index} className="text-purple-700 text-sm">• {opp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Chaos Factors */}
            {chaosResults.chaos_factors.length > 0 && (
              <div className="chaos-factors p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-3">🚨 Key Chaos Factors</h4>
                <ul className="space-y-1">
                  {chaosResults.chaos_factors.map((factor, index) => (
                    <li key={index} className="text-red-700 text-sm">• {factor}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Complete Setup Button */}
            <div className="pt-4">
              <Button 
                onClick={() => setStep(6)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Choose Your Setup Style
              </Button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <SetupPreferenceSelector 
              onPreferenceSelect={handlePreferenceSelect}
              chaosScore={chaosResults?.chaos_score}
              clarityZone={chaosResults?.clarity_zone}
            />
          </div>
        );

      case 7:
        return (
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">You're All Set!</h2>
              <p className="text-lg text-muted-foreground">
                Your personalized business intelligence dashboard is ready
              </p>
            </div>

            {/* Data Privacy & Security */}
            <DataVault />

            {/* Complete Setup Button */}
            <div className="pt-4">
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <CheckCircle className="h-5 w-5 mr-2" />
                )}
                Access Your Dashboard
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {step <= 3 ? 'Complete Your Business Profile' : step === 4 ? 'Business Clarity Assessment' : 'Your Clarity Results'}
          </CardTitle>
          <CardDescription>
            {step <= 3 
              ? 'Help us customize TradeMate AI for your specific business needs'
              : step === 4 
                ? 'Quick assessment to understand your business challenges'
                : 'Personalized insights and recommendations for your business'
            }
          </CardDescription>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Step {step} of 5</span>
              <span>{getProgress()}% complete</span>
            </div>
            <Progress value={getProgress()} className="w-full" />
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedOnboarding;