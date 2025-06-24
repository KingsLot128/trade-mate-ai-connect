
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertCircle, CheckCircle, Lightbulb, Lock, Users, Phone, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const InsightsPreview = () => {
  const demoInsights = [
    {
      title: "Missed Call Opportunities",
      description: "You're missing 23% of incoming calls during peak hours (2-4 PM). This represents approximately $2,800 in potential monthly revenue.",
      priority: 'high' as const,
      category: 'sales' as const,
      actionable_steps: [
        "Set up AI call answering during peak hours",
        "Add callback scheduling for missed calls",
        "Consider hiring additional staff for busy periods"
      ],
      potential_impact: "Recover 80% of missed calls, potentially adding $2,240/month in revenue"
    },
    {
      title: "Customer Follow-up Gap",
      description: "Only 34% of completed jobs receive follow-up contact within 48 hours. This affects customer satisfaction and repeat business.",
      priority: 'medium' as const,
      category: 'customer_service' as const,
      actionable_steps: [
        "Implement automated follow-up workflows",
        "Set reminders for manual follow-ups",
        "Create customer satisfaction surveys"
      ],
      potential_impact: "Increase customer retention by 25% and boost review ratings"
    },
    {
      title: "Peak Season Preparation",
      description: "Historical data shows 40% increase in emergency calls during winter months. Current capacity may not handle the surge.",
      priority: 'medium' as const,
      category: 'operations' as const,
      actionable_steps: [
        "Prepare seasonal staffing plan",
        "Stock additional emergency supplies",
        "Update pricing for emergency services"
      ],
      potential_impact: "Maintain service quality during peak season and capture additional revenue"
    }
  ];

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

  return (
    <div className="space-y-6">
      {/* Header with explanation */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <Brain className="h-8 w-8 mr-3 text-purple-600" />
          <h1 className="text-3xl font-bold">AI-Powered Business Insights</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Our AI analyzes your business data to identify opportunities, inefficiencies, and growth strategies. 
          Get personalized recommendations based on your industry, call patterns, and customer behavior.
        </p>
        
        {/* Demo Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-800">Preview Demo</span>
          </div>
          <p className="text-sm text-purple-700">
            This is a sample of insights based on a plumbing business. Your actual insights will be personalized 
            to your trade, location, and business data.
          </p>
        </div>
      </div>

      {/* Sample Business Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Business Health Summary (Demo)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-700">
            Based on your plumbing business data: You're handling 45 calls/week with a 77% answer rate. 
            Your average job value is $285, and you're booking 68% of inquiries into appointments. 
            There are clear opportunities to improve call handling and follow-up processes.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <Phone className="h-6 w-6 mx-auto text-blue-600 mb-1" />
              <div className="text-2xl font-bold text-blue-600">45</div>
              <div className="text-xs text-gray-600">Calls/Week</div>
            </div>
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto text-green-600 mb-1" />
              <div className="text-2xl font-bold text-green-600">68%</div>
              <div className="text-xs text-gray-600">Booking Rate</div>
            </div>
            <div className="text-center">
              <DollarSign className="h-6 w-6 mx-auto text-purple-600 mb-1" />
              <div className="text-2xl font-bold text-purple-600">$285</div>
              <div className="text-xs text-gray-600">Avg Job Value</div>
            </div>
            <div className="text-center">
              <AlertCircle className="h-6 w-6 mx-auto text-red-600 mb-1" />
              <div className="text-2xl font-bold text-red-600">23%</div>
              <div className="text-xs text-gray-600">Missed Calls</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
            Top Recommendations (Demo)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Implement 24/7 AI call answering to capture missed opportunities</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Set up automated follow-up system for completed jobs</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Prepare for winter season demand with additional staffing</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Sample Insights */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {demoInsights.map((insight, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow relative">
            <div className="absolute top-4 right-4">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
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

      {/* CTA Section */}
      <div className="text-center space-y-4 py-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">Get Your Personalized Insights</h3>
          <p className="text-gray-600 mb-4">
            Sign up to connect your business data and receive AI-powered insights tailored to your trade and location.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">✅ Custom industry analysis</p>
            <p className="text-sm text-gray-500">✅ Real-time business metrics</p>
            <p className="text-sm text-gray-500">✅ Actionable growth recommendations</p>
          </div>
          <div className="mt-4 space-x-4">
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPreview;
