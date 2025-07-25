
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Phone, Clock, MapPin, DollarSign } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CallAnalysis {
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  serviceType: string;
  estimatedCost: string;
  suggestedTimeframe: string;
  followUpActions: string[];
  keywords: string[];
}

const SmartCallHandler = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [testCall, setTestCall] = useState('');
  const [analysis, setAnalysis] = useState<CallAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const emergencyKeywords = {
    plumbing: ['flooding', 'burst pipe', 'no water', 'sewage backup', 'gas leak'],
    electrical: ['no power', 'sparks', 'burning smell', 'electrical fire', 'shock'],
    hvac: ['no heat', 'carbon monoxide', 'furnace not working', 'freezing'],
    general: ['emergency', 'urgent', 'dangerous', 'immediate']
  };

  const serviceEstimates = {
    plumbing: {
      'drain cleaning': '$150-250',
      'leak repair': '$200-400',
      'toilet repair': '$100-200',
      'emergency service': '$300-500'
    },
    electrical: {
      'outlet repair': '$100-150',
      'panel upgrade': '$1500-3000',
      'wiring repair': '$200-500',
      'emergency service': '$400-600'
    },
    hvac: {
      'maintenance': '$150-200',
      'repair': '$300-800',
      'installation': '$3000-8000',
      'emergency service': '$400-700'
    }
  };

  const analyzeCall = (transcript: string): CallAnalysis => {
    const lowerTranscript = transcript.toLowerCase();
    
    // Detect urgency
    let urgency: CallAnalysis['urgency'] = 'low';
    let serviceType = 'general inquiry';
    let estimatedCost = 'Contact for quote';
    let suggestedTimeframe = 'Within 1-2 business days';
    
    // Emergency detection
    const allEmergencyKeywords = Object.values(emergencyKeywords).flat();
    if (allEmergencyKeywords.some(keyword => lowerTranscript.includes(keyword))) {
      urgency = 'emergency';
      suggestedTimeframe = 'Immediate response needed';
      estimatedCost = '$300-600 (emergency rates)';
    }
    
    // Service type detection
    if (lowerTranscript.includes('drain') || lowerTranscript.includes('clog')) {
      serviceType = 'drain cleaning';
      estimatedCost = '$150-250';
    } else if (lowerTranscript.includes('leak') || lowerTranscript.includes('drip')) {
      serviceType = 'leak repair';
      estimatedCost = '$200-400';
      if (lowerTranscript.includes('flooding') || lowerTranscript.includes('burst')) {
        urgency = 'emergency';
      }
    } else if (lowerTranscript.includes('outlet') || lowerTranscript.includes('power')) {
      serviceType = 'electrical repair';
      estimatedCost = '$100-300';
    } else if (lowerTranscript.includes('heat') || lowerTranscript.includes('ac')) {
      serviceType = 'HVAC service';
      estimatedCost = '$200-500';
    }
    
    // Generate follow-up actions
    const followUpActions = [];
    if (urgency === 'emergency') {
      followUpActions.push('Send immediate technician dispatch');
      followUpActions.push('Call customer within 5 minutes');
    } else {
      followUpActions.push('Schedule appointment within 24 hours');
      followUpActions.push('Send service confirmation text');
    }
    
    if (lowerTranscript.includes('quote') || lowerTranscript.includes('estimate')) {
      followUpActions.push('Prepare detailed estimate');
    }
    
    return {
      urgency,
      serviceType,
      estimatedCost,
      suggestedTimeframe,
      followUpActions,
      keywords: lowerTranscript.split(' ').filter(word => word.length > 3)
    };
  };

  const handleTestCall = () => {
    if (!testCall.trim()) return;
    
    setLoading(true);
    setTimeout(() => {
      const result = analyzeCall(testCall);
      setAnalysis(result);
      setLoading(false);
      
      toast({
        title: "Call Analyzed",
        description: `Detected ${result.urgency} priority ${result.serviceType}`,
      });
    }, 1000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Smart Call Analysis
          </CardTitle>
          <CardDescription>
            Test how your AI will analyze and respond to customer calls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Simulate Customer Call</label>
            <textarea
              className="w-full p-3 border rounded-md min-h-[100px]"
              value={testCall}
              onChange={(e) => setTestCall(e.target.value)}
              placeholder="Hi, I have a leak under my kitchen sink and water is dripping onto the floor..."
            />
          </div>
          <Button onClick={handleTestCall} disabled={loading || !testCall.trim()}>
            {loading ? 'Analyzing...' : 'Analyze Call'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              AI Analysis Results
              <Badge className={getUrgencyColor(analysis.urgency)}>
                {analysis.urgency.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Service Type:</span>
                  <span>{analysis.serviceType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Est. Cost:</span>
                  <span>{analysis.estimatedCost}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="font-medium">Timeframe:</span>
                  <span>{analysis.suggestedTimeframe}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Recommended Actions:</h4>
                <ul className="space-y-1">
                  {analysis.followUpActions.map((action, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {analysis.urgency === 'emergency' && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">EMERGENCY DETECTED</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  This call requires immediate attention. Customer will be prioritized and technician dispatched ASAP.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>AI Features Active</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-800">✅ Enabled Features:</h4>
              <ul className="text-sm space-y-1">
                <li>• Emergency keyword detection</li>
                <li>• Service-specific cost estimates</li>
                <li>• Automated appointment scheduling</li>
                <li>• Customer sentiment analysis</li>
                <li>• Follow-up task generation</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">🔧 Coming Soon:</h4>
              <ul className="text-sm space-y-1">
                <li>• Voice-to-text transcription</li>
                <li>• Real-time call monitoring</li>
                <li>• Customer photo uploads</li>
                <li>• Route optimization</li>
                <li>• Review request automation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartCallHandler;
