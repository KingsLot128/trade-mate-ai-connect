import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, TrendingUp, CheckCircle, X, Calendar } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Decision {
  id: string;
  decision_type: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  time_to_implement: string;
  estimated_value: string;
  reasoning: string;
  priority: number;
  status: string;
}

interface DecisionCardProps {
  decision: Decision;
  onStatusChange: (id: string, status: string) => void;
}

const DecisionCard: React.FC<DecisionCardProps> = ({ decision, onStatusChange }) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue': return TrendingUp;
      case 'efficiency': return Target;
      case 'communication': return Clock;
      case 'risk': return X;
      default: return Target;
    }
  };

  const handleAction = async (action: string) => {
    setIsUpdating(true);
    
    try {
      // Update decision status
      const { error: updateError } = await supabase
        .from('ai_decisions')
        .update({ 
          status: action,
          completed_at: action === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', decision.id);

      if (updateError) throw updateError;

      // Log interaction
      await supabase
        .from('decision_interactions')
        .insert({
          decision_id: decision.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          action: action
        });

      onStatusChange(decision.id, action);
      
      toast({
        title: action === 'completed' ? "Great work! 🎉" : "Decision updated",
        description: action === 'completed' 
          ? "You've completed this recommendation!" 
          : `Decision marked as ${action}`,
      });

    } catch (error) {
      console.error('Error updating decision:', error);
      toast({
        title: "Error",
        description: "Failed to update decision. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const TypeIcon = getTypeIcon(decision.decision_type);

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <TypeIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">{decision.title}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Badge className={getImpactColor(decision.impact)}>
              {decision.impact.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {decision.decision_type.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{decision.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Time: {decision.time_to_implement}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Value: {decision.estimated_value}</span>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Why this matters:</strong> {decision.reasoning}
          </p>
        </div>

        {decision.status === 'pending' && (
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleAction('completed')}
              disabled={isUpdating}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Do This Now
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction('scheduled')}
              disabled={isUpdating}
              className="flex-1"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Later
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleAction('dismissed')}
              disabled={isUpdating}
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {decision.status === 'completed' && (
          <div className="flex items-center justify-center py-2 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">Completed!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DecisionCard;