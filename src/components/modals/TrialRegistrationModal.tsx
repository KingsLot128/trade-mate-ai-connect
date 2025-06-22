
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';

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
    businessSize: ''
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
    'Other'
  ];

  const businessSizes = [
    'Just me (1 person)',
    'Small team (2-5 people)',
    'Medium business (6-20 people)',
    'Large business (20+ people)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.businessName);
      
      if (!isConfigured) {
        // In demo mode, show success immediately
        setStep(3);
      } else {
        setStep(3);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                placeholder="e.g., Smith Plumbing LLC"
                required
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your trade" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="businessSize">Business Size</Label>
              <Select value={formData.businessSize} onValueChange={(value) => setFormData({...formData, businessSize: value})}>
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
              className="w-full"
              disabled={!formData.businessName || !formData.industry || !formData.businessSize}
            >
              Continue
            </Button>
          </div>
        );

      case 2:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
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
              <Label htmlFor="phone">Business Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(555) 123-4567"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Create a secure password"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirm your password"
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-blue-600 to-green-600">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Start Free Trial
              </Button>
            </div>
          </form>
        );

      case 3:
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold">Welcome to TradeMate AI!</h3>
            {isConfigured ? (
              <div className="space-y-2">
                <p className="text-gray-600">
                  We've sent a confirmation email to <strong>{formData.email}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Please check your email and click the confirmation link to activate your 14-day free trial.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">
                  Thank you for your interest in TradeMate AI!
                </p>
                <p className="text-sm text-gray-500">
                  This is a demo version. The full platform will be available soon with complete backend integration.
                </p>
              </div>
            )}
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Tell us about your business"}
            {step === 2 && "Create your account"}
            {step === 3 && "You're all set!"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Help us customize TradeMate AI for your specific trade"}
            {step === 2 && "Enter your details to start your 14-day free trial"}
            {step === 3 && "Your TradeMate AI trial is ready to go"}
          </DialogDescription>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};

export default TrialRegistrationModal;
