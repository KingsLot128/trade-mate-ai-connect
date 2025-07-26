import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Target,
  Zap
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RevenueOpportunity {
  id: string;
  opportunity_type: string;
  customer_id: string;
  status: string;
  priority: string;
  estimated_value: number;
  confidence_score: number;
  title: string;
  description: string;
  ai_analysis: any;
  follow_up_date: string;
  last_contacted_at: string;
  created_at: string;
}

interface RevenueMetrics {
  totalOpportunities: number;
  totalPotentialRevenue: number;
  averageOpportunityValue: number;
  highPriorityCount: number;
  conversionRate: number;
  thisMonthRevenue: number;
}

const RevenueRecoveryDashboard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<RevenueOpportunity[]>([]);
  const [metrics, setMetrics] = useState<RevenueMetrics>({
    totalOpportunities: 0,
    totalPotentialRevenue: 0,
    averageOpportunityValue: 0,
    highPriorityCount: 0,
    conversionRate: 0,
    thisMonthRevenue: 0
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('opportunities');
  const [lastAnalysis, setLastAnalysis] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadOpportunities();
      loadMetrics();
    }
  }, [user]);

  const loadOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('revenue_opportunities')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOpportunities(data || []);
    } catch (error) {
      console.error('Error loading opportunities:', error);
      toast.error('Failed to load opportunities');
    }
  };

  const loadMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('revenue_opportunities')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      const opps = data || [];
      const totalPotential = opps.reduce((sum, opp) => sum + (opp.estimated_value || 0), 0);
      const converted = opps.filter(opp => opp.status === 'converted');
      const thisMonth = converted.filter(opp => 
        new Date(opp.conversion_date || 0) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).reduce((sum, opp) => sum + (opp.estimated_value || 0), 0);

      setMetrics({
        totalOpportunities: opps.length,
        totalPotentialRevenue: totalPotential,
        averageOpportunityValue: opps.length > 0 ? totalPotential / opps.length : 0,
        highPriorityCount: opps.filter(opp => opp.priority === 'high').length,
        conversionRate: opps.length > 0 ? (converted.length / opps.length) * 100 : 0,
        thisMonthRevenue: thisMonth
      });
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const generateAnalysis = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-revenue-recovery', {
        body: { userId: user?.id }
      });

      if (error) throw error;

      await loadOpportunities();
      await loadMetrics();
      setLastAnalysis(new Date().toLocaleString());
      
      toast.success(`Generated ${data.opportunities_generated} new revenue opportunities worth $${data.total_potential_revenue?.toLocaleString()}!`);
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast.error('Failed to generate revenue analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateOpportunityStatus = async (opportunityId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === 'converted') {
        updates.conversion_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('revenue_opportunities')
        .update(updates)
        .eq('id', opportunityId);

      if (error) throw error;

      await loadOpportunities();
      await loadMetrics();
      toast.success(`Opportunity marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating opportunity:', error);
      toast.error('Failed to update opportunity');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quote_followup': return <Mail className="h-4 w-4" />;
      case 'maintenance_due': return <Calendar className="h-4 w-4" />;
      case 'upsell': return <TrendingUp className="h-4 w-4" />;
      case 'cross_sell': return <Target className="h-4 w-4" />;
      case 'churn_prevention': return <AlertTriangle className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatOpportunityType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center">
            <DollarSign className="h-8 w-8 mr-3 text-primary" />
            Revenue Recovery & Upselling
          </h2>
          <p className="text-muted-foreground text-lg">
            AI-powered revenue optimization and customer lifecycle management
          </p>
          {lastAnalysis && (
            <p className="text-sm text-muted-foreground">Last analysis: {lastAnalysis}</p>
          )}
        </div>
        <Button 
          onClick={generateAnalysis} 
          disabled={loading}
          size="lg"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing...' : 'Generate Revenue Analysis'}
        </Button>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Opportunities</p>
                <p className="text-2xl font-bold">{metrics.totalOpportunities}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Revenue</p>
                <p className="text-2xl font-bold">${metrics.totalPotentialRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">{metrics.highPriorityCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="opportunities">Active Opportunities</TabsTrigger>
          <TabsTrigger value="pipeline">Revenue Pipeline</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && opportunities.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">No Revenue Opportunities Found</h3>
                <p className="text-muted-foreground text-center mb-4 max-w-md">
                  Generate an AI analysis to discover untapped revenue opportunities from your customer data.
                </p>
                <Button onClick={generateAnalysis}>
                  Start Revenue Analysis
                </Button>
              </CardContent>
            </Card>
          )}

          {!loading && opportunities.length > 0 && opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getTypeIcon(opportunity.opportunity_type)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{opportunity.title}</CardTitle>
                      <CardDescription className="mt-1">{opportunity.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getPriorityColor(opportunity.priority)}>
                      {opportunity.priority.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {formatOpportunityType(opportunity.opportunity_type)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Value and Confidence */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">${opportunity.estimated_value?.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Estimated Value</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{opportunity.confidence_score}%</p>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{new Date(opportunity.follow_up_date).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">Follow-up Date</p>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  {opportunity.ai_analysis && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-sm text-blue-800 mb-1 flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        AI Recommendation:
                      </h4>
                      <p className="text-sm text-blue-700">{opportunity.ai_analysis.follow_up_action}</p>
                      {opportunity.ai_analysis.timeline && (
                        <p className="text-xs text-blue-600 mt-1">Timeline: {opportunity.ai_analysis.timeline}</p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {opportunity.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => updateOpportunityStatus(opportunity.id, 'contacted')}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Mark Contacted
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateOpportunityStatus(opportunity.id, 'dismissed')}
                        >
                          Dismiss
                        </Button>
                      </>
                    )}
                    {opportunity.status === 'contacted' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateOpportunityStatus(opportunity.id, 'converted')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Converted
                      </Button>
                    )}
                    <Badge variant="secondary">
                      Status: {opportunity.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Pipeline Overview</CardTitle>
              <CardDescription>Track opportunities through your revenue recovery process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Pipeline Stages */}
                {['pending', 'contacted', 'converted'].map((stage) => {
                  const stageOpportunities = opportunities.filter(opp => opp.status === stage);
                  const stageValue = stageOpportunities.reduce((sum, opp) => sum + (opp.estimated_value || 0), 0);
                  
                  return (
                    <div key={stage} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium capitalize">{stage} ({stageOpportunities.length})</h4>
                        <p className="font-medium">${stageValue.toLocaleString()}</p>
                      </div>
                      <Progress 
                        value={(stageValue / metrics.totalPotentialRevenue) * 100} 
                        className="h-2"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Opportunity Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['quote_followup', 'maintenance_due', 'upsell', 'cross_sell', 'churn_prevention'].map((type) => {
                    const typeOpportunities = opportunities.filter(opp => opp.opportunity_type === type);
                    const typeValue = typeOpportunities.reduce((sum, opp) => sum + (opp.estimated_value || 0), 0);
                    const percentage = metrics.totalPotentialRevenue > 0 ? 
                      (typeValue / metrics.totalPotentialRevenue) * 100 : 0;
                    
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{formatOpportunityType(type)}</span>
                          <span>${typeValue.toLocaleString()}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Opportunity Value:</span>
                    <span className="font-medium">${metrics.averageOpportunityValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Month Revenue:</span>
                    <span className="font-medium text-green-600">${metrics.thisMonthRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Conversion Rate:</span>
                    <span className="font-medium">{metrics.conversionRate.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueRecoveryDashboard;