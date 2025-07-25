import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const Onboarding = () => {
  const { user, refreshProfileCompletion } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    phone: '',
    primaryServices: [] as string[],
    businessGoals: '',
    targetCustomers: '',
    competitionLevel: '',
    pricingStrategy: '',
    serviceAreaRadius: '',
    projectRangeMin: '',
    projectRangeMax: '',
    seasonalPatterns: ''
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

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      primaryServices: prev.primaryServices.includes(service)
        ? prev.primaryServices.filter(s => s !== service)
        : [...prev.primaryServices, service]
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

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
          onboarding_step: 'completed',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      await refreshProfileCompletion();
      
      toast({
        title: "Profile Complete!",
        description: "Welcome to TradeMate AI. Let's get started with your AI assistant.",
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

  const getProgress = () => {
    switch (step) {
      case 1: return 33;
      case 2: return 66;
      case 3: return 100;
      default: return 0;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
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
                onClick={handleSubmit}
                disabled={loading || !validateStep3()}
                className="flex-1"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Complete Setup
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
            Complete Your Business Profile
          </CardTitle>
          <CardDescription>
            Help us customize TradeMate AI for your specific business needs
          </CardDescription>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Step {step} of 3</span>
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

export default Onboarding;