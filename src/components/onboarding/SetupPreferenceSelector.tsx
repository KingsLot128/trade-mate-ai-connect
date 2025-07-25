import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SetupOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  recommendedFor: string[];
  difficulty: 'Easy' | 'Medium' | 'Advanced';
}

interface SetupPreferenceSelectorProps {
  onPreferenceSelect: (option: SetupOption) => void;
  chaosScore?: number;
  clarityZone?: string;
}

const PreferenceCard: React.FC<{ 
  option: SetupOption; 
  onSelect: () => void;
  isRecommended?: boolean;
}> = ({ option, onSelect, isRecommended }) => (
  <Card className={`preference-card cursor-pointer transition-all hover:shadow-lg ${
    isRecommended ? 'ring-2 ring-primary border-primary' : ''
  }`} onClick={onSelect}>
    {isRecommended && (
      <div className="absolute -top-2 left-4">
        <Badge className="bg-primary text-primary-foreground">Recommended for You</Badge>
      </div>
    )}
    
    <CardHeader className="text-center pb-4">
      <div className="text-4xl mb-2">{option.icon}</div>
      <CardTitle className="text-xl">{option.title}</CardTitle>
      <div className="text-sm text-muted-foreground">{option.description}</div>
    </CardHeader>

    <CardContent className="space-y-4">
      <div className="benefits">
        <h4 className="font-semibold text-sm mb-2 text-green-700">✓ What you get:</h4>
        <ul className="space-y-1">
          {option.benefits.map((benefit, index) => (
            <li key={index} className="text-sm text-muted-foreground">• {benefit}</li>
          ))}
        </ul>
      </div>

      <div className="recommended-for">
        <h4 className="font-semibold text-sm mb-2 text-blue-700">Perfect for:</h4>
        <div className="flex flex-wrap gap-1">
          {option.recommendedFor.map((rec, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {rec}
            </Badge>
          ))}
        </div>
      </div>

      <div className="difficulty-indicator flex items-center justify-between pt-2 border-t">
        <span className="text-xs text-muted-foreground">Setup Complexity</span>
        <Badge variant={
          option.difficulty === 'Easy' ? 'default' : 
          option.difficulty === 'Medium' ? 'secondary' : 
          'destructive'
        }>
          {option.difficulty}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

const SetupPreferenceSelector: React.FC<SetupPreferenceSelectorProps> = ({ 
  onPreferenceSelect, 
  chaosScore = 50,
  clarityZone = 'mixed'
}) => {
  const setupOptions: SetupOption[] = [
    {
      id: 'connect',
      title: "Connect My Existing Tools",
      description: "I use QuickBooks, CRM, etc. - connect them for richer insights",
      icon: "🔗",
      benefits: [
        "Automatic data sync",
        "Richer AI insights",
        "No duplicate entry",
        "Real-time business metrics"
      ],
      recommendedFor: ["Established businesses", "Tech-savvy users", "Multiple tools"],
      difficulty: 'Medium'
    },
    {
      id: 'builtin',
      title: "Use Built-in Smart Tools",
      description: "Simple, integrated tools without complexity",
      icon: "⚡",
      benefits: [
        "Zero setup required",
        "Everything in one place",
        "AI-optimized workflow",
        "Immediate value"
      ],
      recommendedFor: ["New businesses", "Simplicity lovers", "All-in-one preference"],
      difficulty: 'Easy'
    },
    {
      id: 'minimal',
      title: "Start with AI Insights Only",
      description: "Just give me smart recommendations",
      icon: "🎯",
      benefits: [
        "Instant value",
        "No setup required",
        "Upgrade anytime",
        "Focus on insights"
      ],
      recommendedFor: ["Testing the waters", "Minimal time investment", "Busy schedules"],
      difficulty: 'Easy'
    }
  ];

  // Smart recommendation based on chaos score and user profile
  const getRecommendedOption = () => {
    if (chaosScore > 70) {
      return 'minimal'; // High chaos = need simplicity
    } else if (chaosScore < 40) {
      return 'connect'; // Low chaos = can handle complexity
    } else {
      return 'builtin'; // Medium chaos = balanced approach
    }
  };

  const recommendedId = getRecommendedOption();

  return (
    <div className="setup-preference-selector max-w-6xl mx-auto">
      <div className="selector-header text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">How do you prefer to work?</h2>
        <p className="text-xl text-muted-foreground mb-2">Choose your style - you can always change later</p>
        
        {chaosScore && (
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <span className="text-sm text-blue-700">
              💡 Based on your chaos score of {chaosScore}%, we recommend starting simple
            </span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {setupOptions.map(option => (
          <div key={option.id} className="relative">
            <PreferenceCard 
              option={option}
              onSelect={() => onPreferenceSelect(option)}
              isRecommended={option.id === recommendedId}
            />
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-4">
          Don't worry - you can change your preference anytime or combine approaches later
        </div>
        <Button 
          variant="ghost" 
          onClick={() => onPreferenceSelect(setupOptions.find(o => o.id === 'minimal')!)}
        >
          Skip this step - use default settings
        </Button>
      </div>
    </div>
  );
};

export default SetupPreferenceSelector;