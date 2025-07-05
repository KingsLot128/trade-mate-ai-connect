
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, ArrowLeft, Phone, Wrench, Zap, Droplets, TrendingUp, Target } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import ChaosIndexDisplay from '@/components/dashboard/ChaosIndexDisplay';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface SetupWizardProps {
  onComplete: () => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState({
    businessName: '',
    industry: '',
    phone: '',
    serviceArea: '',
    emergencyKeywords: ['emergency', 'urgent', 'leak', 'no power', 'flooding'],
    greetingTemplate: '',
    // Enhanced business intelligence fields
    monthlyRevenue: '',
    businessChallenges: [] as string[],
    currentTools: [] as string[],
    // Chaos index assessment
    chaosResponses: {
      overwhelmed: 5,
      missedMessages: 5,
      forgottenFollowups: 5,
      revenueUnpredictability: 5,
      adminTime: 5
    },
    // Success goals
    revenueTarget: '',
    efficiencyGoal: '',
    clientSatisfactionGoal: ''
  });

  const industries = [
    { id: 'plumbing', name: 'Plumbing', icon: Droplets, keywords: ['leak', 'pipe', 'drain', 'toilet', 'faucet'] },
    { id: 'electrical', name: 'Electrical', icon: Zap, keywords: ['power', 'outlet', 'wiring', 'breaker', 'lights'] },
    { id: 'hvac', name: 'HVAC', icon: Wrench, keywords: ['heating', 'cooling', 'ac', 'furnace', 'thermostat'] },
    { id: 'general', name: 'General Contractor', icon: Wrench, keywords: ['repair', 'renovation', 'construction'] }
  ];

  const steps = [
    { title: 'Business Info', description: 'Tell us about your business' },
    { title: 'Industry Setup', description: 'Choose your trade specialization' },
    { title: 'Business Assessment', description: 'Help us understand your operations' },
    { title: 'Success Goals', description: 'Set your objectives and launch' }
  ];

  // Business challenge options
  const challengeOptions = [
    'Time management and scheduling',
    'Client communication and follow-up',
    'Revenue consistency',
    'Lead generation and conversion',
    'Administrative tasks and paperwork',
    'Equipment and inventory management'
  ];

  // Current tools options
  const toolOptions = [
    'CRM software',
    'Scheduling apps',
    'Communication tools',
    'Accounting software',
    'Project management tools',
    'None/Manual processes'
  ];

  // Revenue ranges
  const revenueRanges = [
    { value: '<5k', label: 'Less than $5,000' },
    { value: '5k-15k', label: '$5,000 - $15,000' },
    { value: '15k-30k', label: '$15,000 - $30,000' },
    { value: '30k-50k', label: '$30,000 - $50,000' },
    { value: '50k+', label: '$50,000+' }
  ];

  // Calculate chaos index
  const calculateChaosIndex = () => {
    const responses = setupData.chaosResponses;
    const average = (responses.overwhelmed + responses.missedMessages + 
                    responses.forgottenFollowups + responses.revenueUnpredictability + 
                    responses.adminTime) / 5;
    return average;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSetup();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeSetup = async () => {
    if (!user) return;

    try {
      // Update profile with enhanced data (use upsert to handle new profiles)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          business_name: setupData.businessName,
          industry: setupData.industry,
          phone: setupData.phone,
          primary_service_types: [setupData.industry],
          business_goals: `Revenue: ${setupData.revenueTarget}, Efficiency: ${setupData.efficiencyGoal}`,
          target_customer_type: 'Homeowners and businesses',
          competition_level: 'medium',
          pricing_strategy: 'competitive',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (profileError) throw profileError;

      // Update business settings (use upsert to handle existing records)
      await supabase
        .from('business_settings')
        .upsert({
          user_id: user.id,
          company_name: setupData.businessName,
          greeting_message: setupData.greetingTemplate,
          ai_personality: `Professional ${setupData.industry} assistant`,
          auto_scheduling: true,
          follow_up_enabled: true
        }, {
          onConflict: 'user_id'
        });

      // Store quiz responses for business intelligence
      const quizResponses = [
        {
          user_id: user.id,
          question_id: 'monthly_revenue',
          response: setupData.monthlyRevenue,
          chaos_contribution: null
        },
        {
          user_id: user.id,
          question_id: 'business_challenges',
          response: setupData.businessChallenges,
          chaos_contribution: null
        },
        {
          user_id: user.id,
          question_id: 'current_tools',
          response: setupData.currentTools,
          chaos_contribution: null
        },
        {
          user_id: user.id,
          question_id: 'chaos_overwhelmed',
          response: setupData.chaosResponses.overwhelmed,
          chaos_contribution: setupData.chaosResponses.overwhelmed
        },
        {
          user_id: user.id,
          question_id: 'chaos_missed_messages',
          response: setupData.chaosResponses.missedMessages,
          chaos_contribution: setupData.chaosResponses.missedMessages
        },
        {
          user_id: user.id,
          question_id: 'chaos_forgotten_followups',
          response: setupData.chaosResponses.forgottenFollowups,
          chaos_contribution: setupData.chaosResponses.forgottenFollowups
        },
        {
          user_id: user.id,
          question_id: 'chaos_revenue_unpredictability',
          response: setupData.chaosResponses.revenueUnpredictability,
          chaos_contribution: setupData.chaosResponses.revenueUnpredictability
        },
        {
          user_id: user.id,
          question_id: 'chaos_admin_time',
          response: setupData.chaosResponses.adminTime,
          chaos_contribution: setupData.chaosResponses.adminTime
        },
        {
          user_id: user.id,
          question_id: 'revenue_target',
          response: setupData.revenueTarget,
          chaos_contribution: null
        },
        {
          user_id: user.id,
          question_id: 'efficiency_goal',
          response: setupData.efficiencyGoal,
          chaos_contribution: null
        }
      ];

      await supabase
        .from('user_quiz_responses')
        .upsert(quizResponses, { onConflict: 'user_id,question_id' });

      // Calculate and store chaos index
      const chaosIndex = calculateChaosIndex();
      await supabase
        .from('business_metrics')
        .upsert({
          user_id: user.id,
          metric_type: 'chaos_index',
          value: chaosIndex,
          context: {
            responses: setupData.chaosResponses,
            calculatedAt: new Date().toISOString(),
            industry: setupData.industry
          }
        }, { onConflict: 'user_id,metric_type' });

      toast({
        title: "Setup Complete! 🎉",
        description: `Your Chaos Index: ${chaosIndex.toFixed(1)}. Your Observer OS is ready!`,
      });

      onComplete();
    } catch (error) {
      console.error('Setup error:', error);
      toast({
        title: "Setup Error",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const generateGreeting = (industry: string, businessName: string) => {
    const templates = {
      plumbing: `Thank you for calling ${businessName}! I'm your AI assistant. Whether it's a leaky pipe, clogged drain, or plumbing emergency, I'm here to help schedule your service right away.`,
      electrical: `Hello! You've reached ${businessName}'s AI assistant. I can help with electrical repairs, installations, and emergency power issues. Let me get you connected with our team.`,
      hvac: `Thanks for calling ${businessName}! I'm here to help with all your heating, cooling, and air quality needs. I can schedule maintenance, repairs, or emergency HVAC services.`,
      general: `Welcome to ${businessName}! I'm your AI assistant ready to help with repairs, renovations, and construction projects. How can I assist you today?`
    };
    return templates[industry as keyof typeof templates] || `Thank you for calling ${businessName}! How can I help you today?`;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Business Name</label>
                <Input
                  value={setupData.businessName}
                  onChange={(e) => setSetupData({...setupData, businessName: e.target.value})}
                  placeholder="e.g., Smith Plumbing LLC"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Service Area</label>
                <Input
                  value={setupData.serviceArea}
                  onChange={(e) => setSetupData({...setupData, serviceArea: e.target.value})}
                  placeholder="e.g., Dallas Metro Area"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Monthly Revenue Range</label>
              <Select value={setupData.monthlyRevenue} onValueChange={(value) => setSetupData({...setupData, monthlyRevenue: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your monthly revenue range" />
                </SelectTrigger>
                <SelectContent>
                  {revenueRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Primary Business Challenges (Select all that apply)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {challengeOptions.map((challenge) => (
                  <div key={challenge} className="flex items-center space-x-2">
                    <Checkbox
                      id={challenge}
                      checked={setupData.businessChallenges.includes(challenge)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSetupData({
                            ...setupData,
                            businessChallenges: [...setupData.businessChallenges, challenge]
                          });
                        } else {
                          setSetupData({
                            ...setupData,
                            businessChallenges: setupData.businessChallenges.filter(c => c !== challenge)
                          });
                        }
                      }}
                    />
                    <label htmlFor={challenge} className="text-sm cursor-pointer">
                      {challenge}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Current Tools Used (Select all that apply)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {toolOptions.map((tool) => (
                  <div key={tool} className="flex items-center space-x-2">
                    <Checkbox
                      id={tool}
                      checked={setupData.currentTools.includes(tool)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSetupData({
                            ...setupData,
                            currentTools: [...setupData.currentTools, tool]
                          });
                        } else {
                          setSetupData({
                            ...setupData,
                            currentTools: setupData.currentTools.filter(t => t !== tool)
                          });
                        }
                      }}
                    />
                    <label htmlFor={tool} className="text-sm cursor-pointer">
                      {tool}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Choose your primary trade to customize AI responses:</p>
            <div className="grid grid-cols-2 gap-3">
              {industries.map((industry) => {
                const Icon = industry.icon;
                return (
                  <Card 
                    key={industry.id}
                    className={`cursor-pointer border-2 transition-colors ${
                      setupData.industry === industry.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => {
                      setSetupData({
                        ...setupData, 
                        industry: industry.id,
                        greetingTemplate: generateGreeting(industry.id, setupData.businessName)
                      });
                    }}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="font-medium">{industry.name}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {setupData.industry && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ AI will be trained to recognize: {industries.find(i => i.id === setupData.industry)?.keywords.join(', ')}
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Chaos Index Assessment
              </h4>
              <p className="text-sm text-muted-foreground mb-6">
                Help us understand your current operational challenges. Rate each area from 1-10:
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    How often do you feel overwhelmed by your daily schedule? (1=never, 10=constantly)
                  </label>
                  <Slider
                    value={[setupData.chaosResponses.overwhelmed]}
                    onValueChange={([value]) => setSetupData({
                      ...setupData,
                      chaosResponses: { ...setupData.chaosResponses, overwhelmed: value }
                    })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Current: {setupData.chaosResponses.overwhelmed}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    How frequently do important messages get missed or delayed? (1=rarely, 10=daily)
                  </label>
                  <Slider
                    value={[setupData.chaosResponses.missedMessages]}
                    onValueChange={([value]) => setSetupData({
                      ...setupData,
                      chaosResponses: { ...setupData.chaosResponses, missedMessages: value }
                    })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Current: {setupData.chaosResponses.missedMessages}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    How often do you forget to follow up with clients or leads? (1=never, 10=very often)
                  </label>
                  <Slider
                    value={[setupData.chaosResponses.forgottenFollowups]}
                    onValueChange={([value]) => setSetupData({
                      ...setupData,
                      chaosResponses: { ...setupData.chaosResponses, forgottenFollowups: value }
                    })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Current: {setupData.chaosResponses.forgottenFollowups}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    How unpredictable is your monthly revenue? (1=very consistent, 10=highly unpredictable)
                  </label>
                  <Slider
                    value={[setupData.chaosResponses.revenueUnpredictability]}
                    onValueChange={([value]) => setSetupData({
                      ...setupData,
                      chaosResponses: { ...setupData.chaosResponses, revenueUnpredictability: value }
                    })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Current: {setupData.chaosResponses.revenueUnpredictability}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    How much time do you spend on administrative tasks daily? (1=&lt;30min, 10=&gt;4hours)
                  </label>
                  <Slider
                    value={[setupData.chaosResponses.adminTime]}
                    onValueChange={([value]) => setSetupData({
                      ...setupData,
                      chaosResponses: { ...setupData.chaosResponses, adminTime: value }
                    })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Current: {setupData.chaosResponses.adminTime}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <ChaosIndexDisplay score={calculateChaosIndex()} size="small" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Business Phone Number</label>
              <Input
                value={setupData.phone}
                onChange={(e) => setSetupData({...setupData, phone: e.target.value})}
                placeholder="(555) 123-4567"
              />
              <p className="text-xs text-muted-foreground mt-1">
                We'll help you integrate AI call handling later in settings.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Success Goals & Review
              </h4>
              <p className="text-sm text-muted-foreground mb-6">
                Set your objectives and review your business profile before launching.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Monthly Revenue Target</label>
                <Input
                  value={setupData.revenueTarget}
                  onChange={(e) => setSetupData({...setupData, revenueTarget: e.target.value})}
                  placeholder="e.g., $25,000"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Main Efficiency Goal</label>
                <Input
                  value={setupData.efficiencyGoal}
                  onChange={(e) => setSetupData({...setupData, efficiencyGoal: e.target.value})}
                  placeholder="e.g., Save 2 hours daily"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">AI Greeting Message</label>
              <textarea
                className="w-full p-3 border rounded-md min-h-[100px]"
                value={setupData.greetingTemplate}
                onChange={(e) => setSetupData({...setupData, greetingTemplate: e.target.value})}
                placeholder="Your AI assistant's greeting..."
              />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">🎯 Your Business Profile Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Business:</strong> {setupData.businessName} ({setupData.industry})
                </div>
                <div>
                  <strong>Revenue Range:</strong> {setupData.monthlyRevenue}
                </div>
                <div>
                  <strong>Chaos Index:</strong> <ChaosIndexDisplay score={calculateChaosIndex()} size="small" showDetails={false} />
                </div>
                <div>
                  <strong>Top Challenges:</strong> {setupData.businessChallenges.slice(0, 2).join(', ')}
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-white rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">🚀 Ready to Launch!</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• AI insights tailored to your {setupData.industry} business</li>
                  <li>• Chaos reduction recommendations ready</li>
                  <li>• Business intelligence dashboard configured</li>
                  <li>• Decision feed personalized to your goals</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl">Welcome to TradeMate AI! 🚀</CardTitle>
              <CardDescription>Let's set up your AI assistant in 4 quick steps</CardDescription>
            </div>
            <Badge variant="outline">{currentStep + 1} of {steps.length}</Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="flex space-x-2">
            {steps.map((step, index) => (
              <div key={index} className="flex-1">
                <div className={`h-2 rounded-full ${index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                <p className="text-xs mt-1 text-center">{step.title}</p>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{steps[currentStep].title}</h3>
            <p className="text-gray-600 text-sm">{steps[currentStep].description}</p>
          </div>

          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={
                (currentStep === 0 && !setupData.businessName) ||
                (currentStep === 1 && !setupData.industry) ||
                (currentStep === 2 && !setupData.phone)
              }
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupWizard;
