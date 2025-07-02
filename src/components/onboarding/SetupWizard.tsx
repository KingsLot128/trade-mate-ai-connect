
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, ArrowLeft, Phone, Wrench, Zap, Droplets } from "lucide-react";
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
    greetingTemplate: ''
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
    { title: 'Phone Integration', description: 'Connect your business phone' },
    { title: 'AI Customization', description: 'Personalize your AI assistant' }
  ];

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
      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: setupData.businessName,
          industry: setupData.industry,
          phone: setupData.phone,
          primary_service_types: [setupData.industry],
          business_goals: 'Grow business and improve efficiency',
          target_customer_type: 'Homeowners and businesses',
          competition_level: 'medium',
          pricing_strategy: 'competitive'
        })
        .eq('user_id', user.id);

      if (error) throw error;

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

      toast({
        title: "Setup Complete!",
        description: "Your TradeMate AI is ready to handle calls.",
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
          <div className="space-y-4">
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
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Business Phone Number</label>
              <Input
                value={setupData.phone}
                onChange={(e) => setSetupData({...setupData, phone: e.target.value})}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800">📞 Phone Integration Steps:</h4>
              <ol className="text-sm text-yellow-700 mt-2 space-y-1">
                <li>1. Sign up for Twilio (free trial available)</li>
                <li>2. Purchase a phone number (~$1/month)</li>
                <li>3. Add your Twilio credentials in Settings</li>
                <li>4. Forward your business calls to the Twilio number</li>
              </ol>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">AI Greeting Message</label>
              <textarea
                className="w-full p-3 border rounded-md min-h-[100px]"
                value={setupData.greetingTemplate}
                onChange={(e) => setSetupData({...setupData, greetingTemplate: e.target.value})}
                placeholder="Your AI assistant's greeting..."
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800">🤖 Your AI Will:</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Detect emergencies and prioritize urgent calls</li>
                <li>• Provide service estimates based on your industry</li>
                <li>• Schedule appointments automatically</li>
                <li>• Follow up on missed calls</li>
                <li>• Send review requests after completed jobs</li>
              </ul>
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
