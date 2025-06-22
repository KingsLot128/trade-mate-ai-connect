
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

interface TrialRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrialRegistrationModal: React.FC<TrialRegistrationModalProps> = ({ open, onOpenChange }) => {
  const { signUp, isConfigured } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    industry: '',
    businessSize: '',
    acceptTerms: false
  });

  const industries = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'General Contractor',
    'Roofing',
    'Flooring',
    'Painting',
    'Landscaping',
    'Carpentry',
    'Other'
  ];

  const businessSizes = [
    'Solo (1 person)',
    'Small team (2-5 people)', 
    'Medium business (6-20 people)',
    'Large business (20+ people)'
  ];

  const validateStep1 = () => {
    return formData.businessName.trim() && formData.industry && formData.businessSize;
  };

  const validateStep2 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    return (
      emailRegex.test(formData.email) &&
      formData.phone.replace(/\D/g, '').length >= 10 &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      formData.acceptTerms
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      toast({
        title: "Validation Error",
        description: "Please check all fields are correctly filled",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        businessName: formData.businessName,
        industry: formData.industry,
        businessSize: formData.businessSize,
        phone: formData.phone
      });
      
      setStep(3);
      
      // Track conversion event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'sign_up', {
          method: 'email',
          business_type: formData.industry
        });
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support if the issue persists",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      businessName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      industry: '',
      businessSize: '',
      acceptTerms: false
    });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
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
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="industry">Your Trade *</Label>
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
              <Label htmlFor="businessSize">Business Size *</Label>
              <Select 
                value={formData.businessSize} 
                onValueChange={(value) => setFormData({...formData, businessSize: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How many people work in your business?" />
                </SelectTrigger>
                <SelectContent>
                  {businessSizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => setStep(2)} 
              className="w-full bg-gradient-to-r from-blue-600 to-green-600"
              disabled={!validateStep1()}
            >
              Continue to Account Setup
            </Button>
          </div>
        );

      case 2:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Business Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@business-email.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Business Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  // Allow only numbers, spaces, dashes, parentheses, and plus
                  const cleanedValue = e.target.value.replace(/[^\d\s\-\(\)\+]/g, '');
                  setFormData({...formData, phone: cleanedValue});
                }}
                placeholder="(555) 123-4567"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Minimum 8 characters"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirm your password"
                required
              />
            </div>
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                className="mt-1"
                required
              />
              <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
                I agree to the <a href="/terms" target="_blank" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">Privacy Policy</a>
              </Label>
            </div>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep(1)} 
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !validateStep2()} 
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Start Free Trial
              </Button>
            </div>
          </form>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Welcome to TradeMate AI!</h3>
              {isConfigured ? (
                <div className="space-y-3">
                  <p className="text-gray-600">
                    We've sent a confirmation email to <strong>{formData.email}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Please check your email and click the confirmation link to activate your 14-day free trial.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Your trial includes:</strong><br />
                      • Unlimited AI call handling<br />
                      • Automatic appointment scheduling<br />
                      • Lead capture and follow-up<br />
                      • Basic analytics dashboard
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Thank you for your interest in TradeMate AI!
                  </p>
                  <p className="text-sm text-gray-500">
                    This is a demo environment. The full platform will be available soon with complete backend integration.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      We'll notify you at <strong>{formData.email}</strong> when TradeMate AI launches with full functionality.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <Button 
              onClick={() => handleClose(false)} 
              className="w-full bg-gradient-to-r from-blue-600 to-green-600"
            >
              Continue to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Tell us about your business";
      case 2: return "Create your account";  
      case 3: return "You're all set!";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Help us customize TradeMate AI for your specific trade";
      case 2: return "Enter your details to start your 14-day free trial";
      case 3: return "Your TradeMate AI trial is ready to go";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getStepTitle()}</DialogTitle>
          <DialogDescription>{getStepDescription()}</DialogDescription>
          {step < 3 && (
            <div className="flex space-x-2 mt-4">
              <div className={`h-2 w-full rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`h-2 w-full rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            </div>
          )}
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};

export default TrialRegistrationModal;
