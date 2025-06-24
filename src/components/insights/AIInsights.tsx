
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertCircle, CheckCircle, Lightbulb, RefreshCw, Settings } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface Insight {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'sales' | 'marketing' | 'operations' | 'customer_service' | 'general';
  actionable_steps: string[];
  potential_impact: string;
}

interface AIInsightsData {
  insights: Insight[];
  summary: string;
  recommendations: string[];
}

const AIInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<AIInsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [hasBusinessData, setHasBusinessData] = useState(false);

  const checkBusinessSetup = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('business_name, industry, phone')
        .eq('id', user.id)
        .single();

      const { data: settings } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setHasBusinessData(!!(profile?.business_name && profile?.industry && settings));
    } catch (error) {
      console.error('Error checking business setup:', error);
    }
  };

  const generateInsights = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-insights', {
        body: { userId: user.id }
      });

      if (error) throw error;

      setInsights(data);
      setLastGenerated(new Date().toLocaleString());
      toast.success('AI insights generated successfully!');
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights. Please try again.');
    } finally {
      setLoading(false);
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
      case 'sales': return <TrendingUp className="h-4 w-4" />;
      case 'marketing': return <Lightbulb className="h-4 w-4" />;
      case 'operations': return <CheckCircle className="h-4 w-4" />;
      case 'customer_service': return <AlertCircle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    if (user) {
      checkBusinessSetup();
    }
  }, [user]);

  // Show setup required message if business not configured
  if (!hasBusinessData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Brain className="h-6 w-6 mr-2 text-purple-600" />
              AI-Powered Insights
            </h2>
            <p className="text-gray-600">Smart recommendations to grow your business</p>
          </div>
        </div>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-12 w-12 text-yellow-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">Complete Your Business Setup</h3>
            <p className="text-gray-600 text-center mb-4 max-w-md">
              To generate personalized AI insights, please complete your business profile first. 
              This helps our AI understand your industry and provide relevant recommendations.
            </p>
            <Link to="/dashboard?tab=setup">
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                Complete Setup
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="h-6 w-6 mr-2 text-purple-600" />
            AI-Powered Insights
          </h2>
          <p className="text-gray-600">Smart recommendations to grow your business</p>
          {lastGenerated && (
            <p className="text-sm text-gray-500">Last updated: {lastGenerated}</p>
          )}
        </div>
        <Button 
          onClick={generateInsights} 
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing...' : 'Refresh Insights'}
        </Button>
      </div>

      {!insights && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Brain className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">Generate Your First AI Insights</h3>
            <p className="text-gray-600 text-center mb-4 max-w-md">
              Our AI will analyze your business data to provide personalized recommendations 
              based on your call patterns, customer interactions, and industry best practices.
            </p>
            <Button onClick={generateInsights} className="bg-purple-600 hover:bg-purple-700">
              Generate Insights
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {insights && (
        <>
          {/* Business Summary */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Business Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700">{insights.summary}</p>
            </CardContent>
          </Card>

          {/* Top Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                Top Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {insights.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Detailed Insights */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {insights.insights.map((insight, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(insight.category)}
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <Badge className={getPriorityColor(insight.priority)}>
                      {insight.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription>{insight.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Action Steps:</h4>
                      <ul className="space-y-1">
                        {insight.actionable_steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start text-sm">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                              {stepIndex + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm text-green-800 mb-1">Potential Impact:</h4>
                      <p className="text-sm text-green-700">{insight.potential_impact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AIInsights;
