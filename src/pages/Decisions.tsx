import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, RefreshCw, TrendingUp, AlertCircle, CheckCircle, Clock, Target, Lightbulb } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'revenue' | 'efficiency' | 'customer' | 'operations';
  confidence: number;
  actionable: boolean;
  estimatedImpact: string;
  timeToImplement: string;
  actions: string[];
}

interface BusinessMetrics {
  revenue: number;
  customers: number;
  appointments: number;
  conversionRate: number;
  responseTime: number;
  satisfaction: number;
}

const Decisions = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [observerMode, setObserverMode] = useState(false);
  const [metrics, setMetrics] = useState<BusinessMetrics>({
    revenue: 15750,
    customers: 42,
    appointments: 18,
    conversionRate: 68,
    responseTime: 2.3,
    satisfaction: 4.7
  });

  // Sample AI recommendations
  const sampleRecommendations: AIRecommendation[] = [
    {
      id: '1',
      title: 'Optimize Emergency Response Pricing',
      description: 'Analysis shows 23% higher acceptance rate for emergency calls priced 20% above standard rates during peak hours (5-9 PM).',
      priority: 'high',
      category: 'revenue',
      confidence: 92,
      actionable: true,
      estimatedImpact: '+$3,200/month',
      timeToImplement: '2 hours',
      actions: [
        'Update pricing schedule for emergency calls',
        'Implement dynamic pricing based on time/demand',
        'Create urgency-based quote templates'
      ]
    },
    {
      id: '2',
      title: 'Follow-up Missed Calls Within 90 Minutes',
      description: 'Calls not answered have 78% conversion rate when followed up within 90 minutes vs. 31% after 4 hours.',
      priority: 'high',
      category: 'customer',
      confidence: 87,
      actionable: true,
      estimatedImpact: '+$1,800/month',
      timeToImplement: '30 minutes',
      actions: [
        'Set automated follow-up reminders',
        'Create missed call recovery templates',
        'Schedule follow-up calls automatically'
      ]
    },
    {
      id: '3',
      title: 'Schedule Preventive Maintenance Outreach',
      description: 'Customers served 6+ months ago show 43% acceptance rate for preventive maintenance offers.',
      priority: 'medium',
      category: 'efficiency',
      confidence: 74,
      actionable: true,
      estimatedImpact: '+$2,100/month',
      timeToImplement: '1 hour',
      actions: [
        'Identify customers from 6+ months ago',
        'Create preventive maintenance campaigns',
        'Schedule quarterly outreach sequences'
      ]
    },
    {
      id: '4',
      title: 'Optimize Tuesday-Thursday Scheduling',
      description: 'Tuesday-Thursday bookings show 15% higher completion rates and 22% better customer satisfaction scores.',
      priority: 'medium',
      category: 'operations',
      confidence: 81,
      actionable: true,
      estimatedImpact: '+12% efficiency',
      timeToImplement: '15 minutes',
      actions: [
        'Prioritize mid-week scheduling',
        'Adjust availability preferences',
        'Offer mid-week booking incentives'
      ]
    },
    {
      id: '5',
      title: 'Implement Text Message Confirmations',
      description: 'Businesses using SMS confirmations see 34% fewer no-shows and 28% higher customer satisfaction.',
      priority: 'low',
      category: 'customer',
      confidence: 69,
      actionable: true,
      estimatedImpact: '+$950/month',
      timeToImplement: '45 minutes',
      actions: [
        'Set up SMS confirmation system',
        'Create appointment reminder templates',
        'Enable two-way text communication'
      ]
    }
  ];

  useEffect(() => {
    loadBusinessData();
    if (recommendations.length === 0) {
      setRecommendations(sampleRecommendations);
    }
  }, [user]);

  const loadBusinessData = async () => {
    if (!user) return;

    try {
      // Load business metrics from multiple tables
      const [customersRes, appointmentsRes, callsRes] = await Promise.all([
        supabase.from('customers').select('*').eq('user_id', user.id),
        supabase.from('appointments').select('*').eq('user_id', user.id),
        supabase.from('calls').select('*').eq('user_id', user.id)
      ]);

      // Update metrics based on real data
      const customerCount = customersRes.data?.length || 0;
      const appointmentCount = appointmentsRes.data?.length || 0;
      const callCount = callsRes.data?.length || 0;

      setMetrics(prev => ({
        ...prev,
        customers: customerCount,
        appointments: appointmentCount,
        // Calculate conversion rate if we have data
        conversionRate: callCount > 0 ? Math.round((appointmentCount / callCount) * 100) : prev.conversionRate
      }));

    } catch (error) {
      console.error('Error loading business data:', error);
    }
  };

  const generateNewRecommendations = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would call the AI Edge Function
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate new recommendations based on current data
      const newRecommendations = sampleRecommendations.map(rec => ({
        ...rec,
        confidence: Math.max(60, Math.min(95, rec.confidence + (Math.random() * 10 - 5)))
      }));

      setRecommendations(newRecommendations);
      toast.success('AI recommendations updated successfully');
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate new recommendations');
    } finally {
      setLoading(false);
    }
  };

  const executeRecommendation = async (id: string) => {
    const recommendation = recommendations.find(r => r.id === id);
    if (!recommendation) return;

    try {
      // Simulate executing the recommendation
      toast.success(`Executing: ${recommendation.title}`);
      
      // Mark as executed (in a real app, this would update the database)
      setRecommendations(prev => 
        prev.map(r => r.id === id ? { ...r, actionable: false } : r)
      );
    } catch (error) {
      toast.error('Failed to execute recommendation');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return <TrendingUp className="h-4 w-4" />;
      case 'efficiency': return <Target className="h-4 w-4" />;
      case 'customer': return <CheckCircle className="h-4 w-4" />;
      case 'operations': return <Clock className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="h-6 w-6 mr-2 text-purple-600" />
            AI Decision Feed
          </h2>
          <p className="text-gray-600">Smart recommendations to optimize your business operations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={observerMode ? "default" : "outline"}
            onClick={() => {
              setObserverMode(!observerMode);
              console.log('Observer mode:', !observerMode);
            }}
            className={observerMode ? "bg-purple-600 hover:bg-purple-700" : ""}
          >
            Observer {observerMode ? 'ON' : 'OFF'}
          </Button>
          <Button 
            onClick={generateNewRecommendations}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analyzing...' : 'Refresh AI'}
          </Button>
        </div>
      </div>

      {/* Business Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-green-600">${metrics.revenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.conversionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.responseTime}s</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AI Recommendations</h3>
        {recommendations.map((recommendation) => (
          <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(recommendation.category)}
                  <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(recommendation.priority)}>
                    {recommendation.priority.toUpperCase()}
                  </Badge>
                  <span className={`text-sm font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                    {recommendation.confidence}% AI Confidence
                  </span>
                </div>
              </div>
              <CardDescription>{recommendation.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Estimated Impact</p>
                    <p className="font-semibold text-green-600">{recommendation.estimatedImpact}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Time to Implement</p>
                    <p className="font-semibold text-blue-600">{recommendation.timeToImplement}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold text-purple-600 capitalize">{recommendation.category}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Action Steps:</h4>
                  <ul className="space-y-1">
                    {recommendation.actions.map((action, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                          {index + 1}
                        </span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center space-x-2">
                    {recommendation.actionable ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-600">
                      {recommendation.actionable ? 'Ready to implement' : 'Already executed'}
                    </span>
                  </div>
                  <Button
                    onClick={() => executeRecommendation(recommendation.id)}
                    disabled={!recommendation.actionable}
                    variant={recommendation.actionable ? "default" : "outline"}
                    size="sm"
                  >
                    {recommendation.actionable ? 'Execute' : 'Completed'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Observer Memory */}
      {observerMode && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-800">AI Observer Memory</CardTitle>
            <CardDescription className="text-purple-600">
              Learning patterns and tracking decision outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-purple-700">
                📊 Tracked 23 recommendation implementations this month
              </p>
              <p className="text-sm text-purple-700">
                🎯 Average success rate: 78% (above industry standard)
              </p>
              <p className="text-sm text-purple-700">
                💡 Most successful category: Revenue optimization (+$4,200)
              </p>
              <p className="text-sm text-purple-700">
                🔄 Learning: Emergency pricing adjustments have 92% acceptance rate
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Decisions;