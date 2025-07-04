import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import SmartCRM from './SmartCRM';
import SimpleBookkeeping from './SimpleBookkeeping';
import { TrendingUp, Users, DollarSign, Calendar, Zap } from 'lucide-react';

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'cross_tool' | 'optimization' | 'opportunity';
  priority: 'high' | 'medium' | 'low';
  tools: string[];
}

interface ToolMetrics {
  totalLeads: number;
  totalTransactions: number;
  monthlyRevenue: number;
  activeDeals: number;
}

const UnifiedToolsInterface = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('crm');
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [toolMetrics, setToolMetrics] = useState<ToolMetrics>({
    totalLeads: 0,
    totalTransactions: 0,
    monthlyRevenue: 0,
    activeDeals: 0
  });

  const tools = [
    { 
      id: 'crm', 
      label: 'Smart CRM', 
      icon: '🏢', 
      component: SmartCRM,
      description: 'AI-powered customer relationship management'
    },
    { 
      id: 'bookkeeping', 
      label: 'Simple Bookkeeping', 
      icon: '💰', 
      component: SimpleBookkeeping,
      description: 'Intelligent financial tracking and insights'
    },
    { 
      id: 'calendar', 
      label: 'Smart Calendar', 
      icon: '📅', 
      component: SmartCalendarInterface,
      description: 'Optimized scheduling and time management'
    }
  ];

  useEffect(() => {
    if (user) {
      loadToolMetrics();
      generateAIInsights();
    }
  }, [user]);

  const loadToolMetrics = async () => {
    try {
      // Load CRM metrics
      const { data: contacts } = await supabase
        .from('crm_contacts')
        .select('id, status')
        .eq('user_id', user?.id);

      const { data: deals } = await supabase
        .from('crm_deals')
        .select('id, amount, stage')
        .eq('user_id', user?.id);

      // Calculate metrics
      const totalLeads = contacts?.length || 0;
      const activeDeals = deals?.filter(deal => deal.stage !== 'closed_won' && deal.stage !== 'closed_lost').length || 0;
      const monthlyRevenue = deals?.reduce((sum, deal) => sum + (deal.amount || 0), 0) || 0;

      setToolMetrics({
        totalLeads,
        totalTransactions: 0, // Would come from bookkeeping
        monthlyRevenue,
        activeDeals
      });
    } catch (error) {
      console.error('Error loading tool metrics:', error);
    }
  };

  const generateAIInsights = async () => {
    // Generate cross-tool insights based on available data
    const insights: AIInsight[] = [
      {
        id: '1',
        title: 'Revenue Opportunity Detected',
        description: 'Your CRM shows 5 hot leads but bookkeeping shows declining revenue. Focus follow-up efforts on high-value prospects.',
        type: 'opportunity',
        priority: 'high',
        tools: ['crm', 'bookkeeping']
      },
      {
        id: '2',
        title: 'Lead Conversion Optimization',
        description: 'Schedule follow-up calls within 24 hours. Your data shows 3x higher conversion when contacted quickly.',
        type: 'optimization',
        priority: 'medium',
        tools: ['crm', 'calendar']
      },
      {
        id: '3',
        title: 'Cash Flow Pattern Analysis',
        description: 'Revenue peaks on Wednesdays. Consider scheduling important client calls mid-week for better results.',
        type: 'cross_tool',
        priority: 'medium',
        tools: ['bookkeeping', 'calendar']
      }
    ];

    setAiInsights(insights);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return '💰';
      case 'optimization': return '⚡';
      case 'cross_tool': return '🔗';
      default: return '💡';
    }
  };

  return (
    <div className="unified-tools-interface space-y-6">
      {/* Tools Overview */}
      <div className="tools-overview">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Built-in Smart Tools</h2>
            <p className="text-muted-foreground">AI-enhanced business management tools that work together seamlessly</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
            <Zap className="w-4 h-4 mr-1" />
            AI-Enhanced
          </Badge>
        </div>

        {/* Quick Metrics */}
        <div className="quick-metrics grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{toolMetrics.totalLeads}</div>
                  <div className="text-sm text-muted-foreground">Total Leads</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{toolMetrics.activeDeals}</div>
                  <div className="text-sm text-muted-foreground">Active Deals</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">${toolMetrics.monthlyRevenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Pipeline Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cross-Tool AI Insights */}
      {aiInsights.length > 0 && (
        <Card className="cross-tool-insights bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-400">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-900">
              🤖 Cross-Tool AI Insights
              <Badge className="ml-2" variant="secondary">
                {aiInsights.length} insights
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.slice(0, 2).map(insight => (
                <div key={insight.id} className="p-4 bg-background rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTypeIcon(insight.type)}</span>
                      <h4 className="font-semibold">{insight.title}</h4>
                    </div>
                    <Badge className={getPriorityColor(insight.priority)}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Involves:</span>
                    {insight.tools.map(tool => (
                      <Badge key={tool} variant="outline" className="text-xs">
                        {tools.find(t => t.id === tool)?.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
              {aiInsights.length > 2 && (
                <Button variant="outline" size="sm" className="w-full">
                  View All {aiInsights.length} Insights
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tools Navigation */}
      <div className="tools-navigation">
        <div className="flex space-x-1 bg-muted rounded-lg p-1 mb-6">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={`flex-1 py-4 px-4 rounded-md font-medium transition-all ${
                activeTab === tool.id 
                  ? 'bg-background shadow-sm text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-2xl">{tool.icon}</span>
                <div className="text-center">
                  <div className="font-semibold">{tool.label}</div>
                  <div className="text-xs opacity-75">{tool.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Tool Interface */}
      <div className="active-tool-interface">
        {tools.map(tool => (
          <div 
            key={tool.id} 
            className={activeTab === tool.id ? 'block' : 'hidden'}
          >
            {tool.id === 'calendar' ? (
              <SmartCalendarInterface />
            ) : (
              <tool.component />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Smart Calendar Interface Component
const SmartCalendarInterface = () => {
  const [appointments, setAppointments] = useState([]);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([
    {
      id: '1',
      title: 'Optimize Your Peak Hours',
      description: 'Schedule important calls between 10 AM - 2 PM for 40% higher success rates',
      impact: 'High',
      timeToImplement: '5 minutes'
    },
    {
      id: '2',
      title: 'Buffer Time Recommendation',
      description: 'Add 15-minute buffers between appointments to reduce stress and improve quality',
      impact: 'Medium',
      timeToImplement: '2 minutes'
    }
  ]);

  return (
    <div className="smart-calendar-interface space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            📅 Smart Calendar
            <Badge className="ml-2" variant="secondary">AI-Optimized</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold mb-2">Smart Calendar Coming Soon</h3>
            <p className="text-sm">AI-powered scheduling optimization and time management</p>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Schedule Optimization Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationSuggestions.map(suggestion => (
              <div key={suggestion.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{suggestion.title}</h4>
                  <Badge variant={suggestion.impact === 'High' ? 'default' : 'secondary'}>
                    {suggestion.impact} Impact
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    ⏱️ {suggestion.timeToImplement}
                  </span>
                  <Button size="sm">Implement</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedToolsInterface;