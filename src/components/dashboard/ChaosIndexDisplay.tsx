import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface ChaosIndexDisplayProps {
  score: number;
  size?: 'small' | 'large';
  showDetails?: boolean;
}

const ChaosIndexDisplay: React.FC<ChaosIndexDisplayProps> = ({ 
  score, 
  size = 'large', 
  showDetails = true 
}) => {
  const getScoreData = (score: number) => {
    if (score <= 3) {
      return {
        label: 'Well Organized',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: CheckCircle,
        description: 'Your business operations are running smoothly!'
      };
    } else if (score <= 6) {
      return {
        label: 'Some Challenges',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: AlertCircle,
        description: 'There are opportunities to optimize your operations.'
      };
    } else {
      return {
        label: 'High Chaos - Needs Attention',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: AlertTriangle,
        description: 'Your business could benefit from significant organizational improvements.'
      };
    }
  };

  const scoreData = getScoreData(score);
  const Icon = scoreData.icon;

  if (size === 'small') {
    return (
      <div className="flex items-center space-x-2">
        <Icon className={`h-5 w-5 ${scoreData.color}`} />
        <span className="font-medium">{score.toFixed(1)}</span>
        <span className={`text-sm ${scoreData.color}`}>{scoreData.label}</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className={`h-6 w-6 ${scoreData.color}`} />
          <span>Chaos Index</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${scoreData.color}`}>
              {score.toFixed(1)}
            </div>
            <div className={`text-lg font-medium ${scoreData.color}`}>
              {scoreData.label}
            </div>
          </div>
          
          <Progress 
            value={(score / 10) * 100} 
            className="h-3"
          />
          
          {showDetails && (
            <p className="text-sm text-muted-foreground text-center">
              {scoreData.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChaosIndexDisplay;