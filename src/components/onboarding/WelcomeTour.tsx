import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to TradeMate! 🎉',
    content: 'Let\'s take a quick tour of your new business intelligence dashboard. This will only take 2 minutes.',
    position: 'bottom'
  },
  {
    id: 'dashboard',
    title: 'Your Business Overview',
    content: 'This is your main dashboard where you\'ll see your business health, key metrics, and performance at a glance.',
    target: '[data-tour="dashboard-overview"]',
    position: 'bottom'
  },
  {
    id: 'ai-recommendations',
    title: 'AI-Powered Insights',
    content: 'Your AI co-pilot analyzes your business and provides actionable recommendations to grow revenue and improve efficiency.',
    target: '[data-tour="ai-recommendations"]',
    position: 'left'
  },
  {
    id: 'crm',
    title: 'Customer Management',
    content: 'Track your customers, deals, and communication all in one place. Never lose track of an opportunity again.',
    target: '[data-tour="crm-section"]',
    position: 'right'
  },
  {
    id: 'complete',
    title: 'You\'re All Set! 🚀',
    content: 'Ready to start managing your business more intelligently? Let\'s complete your profile to get personalized insights.',
    position: 'bottom'
  }
];

export const WelcomeTour = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useUserProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [tourPosition, setTourPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Show tour if user hasn't completed it and profile is loaded
    if (profile && !profile.has_completed_tour) {
      setIsVisible(true);
      updateTourPosition();
    }
  }, [profile]);

  useEffect(() => {
    updateTourPosition();
  }, [currentStep]);

  const updateTourPosition = () => {
    const step = tourSteps[currentStep];
    if (!step.target) {
      // Center the tour card
      setTourPosition({ top: 50, left: 50 });
      return;
    }

    const targetElement = document.querySelector(step.target);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const tourWidth = 320;
      const tourHeight = 200;
      
      let top = rect.top;
      let left = rect.left;

      switch (step.position) {
        case 'top':
          top = rect.top - tourHeight - 10;
          left = rect.left + (rect.width / 2) - (tourWidth / 2);
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + (rect.width / 2) - (tourWidth / 2);
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (tourHeight / 2);
          left = rect.left - tourWidth - 10;
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (tourHeight / 2);
          left = rect.right + 10;
          break;
      }

      setTourPosition({ top, left });
    }
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = async () => {
    setIsVisible(false);
    await updateProfile({ has_completed_tour: true });
  };

  const skipTour = async () => {
    setIsVisible(false);
    await updateProfile({ has_completed_tour: true });
  };

  if (!isVisible || !profile) return null;

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" />
      
      {/* Tour Card */}
      <Card 
        className="fixed z-50 w-80 shadow-xl border-2 border-primary"
        style={{
          top: step.target ? `${tourPosition.top}px` : '50%',
          left: step.target ? `${tourPosition.left}px` : '50%',
          transform: step.target ? 'none' : 'translate(-50%, -50%)'
        }}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{step.title}</CardTitle>
              <Badge variant="outline">
                {currentStep + 1} of {tourSteps.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-sm leading-relaxed">
            {step.content}
          </CardDescription>
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <div className="flex gap-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            <Button
              size="sm"
              onClick={nextStep}
              className="gap-2"
            >
              {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          {currentStep === 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="w-full"
            >
              Skip Tour
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  );
};