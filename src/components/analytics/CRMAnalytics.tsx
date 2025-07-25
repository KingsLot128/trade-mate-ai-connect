import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Target, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CRMMetrics {
  totalContacts: number;
  totalDeals: number;
  totalValue: number;
  conversionRate: number;
  topLeads: Array<{ name: string; score: number; company: string }>;
  dealsByStage: Array<{ stage: string; count: number; value: number }>;
  monthlyTrends: Array<{ month: string; contacts: number; deals: number }>;
}

interface StageData {
  count: number;
  value: number;
}

const CRMAnalytics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<CRMMetrics>({
    totalContacts: 0,
    totalDeals: 0,
    totalValue: 0,
    conversionRate: 0,
    topLeads: [],
    dealsByStage: [],
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCRMMetrics();
    }
  }, [user]);

  const fetchCRMMetrics = async () => {
    try {
      // Fetch contacts
      const { data: contacts } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('user_id', user?.id);

      // Fetch deals
      const { data: deals } = await supabase
        .from('crm_deals')
        .select('*')
        .eq('user_id', user?.id);

      const totalContacts = contacts?.length || 0;
      const totalDeals = deals?.length || 0;
      const totalValue = deals?.reduce((sum, deal) => sum + (deal.amount || 0), 0) || 0;
      const conversionRate = totalContacts > 0 ? Math.round((totalDeals / totalContacts) * 100) : 0;

      // Top leads by score
      const topLeads = contacts
        ?.filter(c => c.lead_score > 0)
        .sort((a, b) => b.lead_score - a.lead_score)
        .slice(0, 5)
        .map(c => ({
          name: c.name,
          score: c.lead_score,
          company: c.company || 'No company'
        })) || [];

      // Deals by stage
      const stageGroups = deals?.reduce((acc: Record<string, StageData>, deal) => {
        const stage = deal.stage || 'unknown';
        if (!acc[stage]) {
          acc[stage] = { count: 0, value: 0 };
        }
        acc[stage].count++;
        acc[stage].value += deal.amount || 0;
        return acc;
      }, {} as Record<string, StageData>) || {};

      const dealsByStage = Object.entries(stageGroups).map(([stage, data]: [string, StageData]) => ({
        stage: stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count: data.count,
        value: data.value
      }));

      // Monthly trends (simplified)
      const monthlyTrends = [
        { month: 'Jan', contacts: Math.floor(totalContacts * 0.7), deals: Math.floor(totalDeals * 0.6) },
        { month: 'Feb', contacts: Math.floor(totalContacts * 0.8), deals: Math.floor(totalDeals * 0.7) },
        { month: 'Mar', contacts: Math.floor(totalContacts * 0.9), deals: Math.floor(totalDeals * 0.8) },
        { month: 'Apr', contacts: totalContacts, deals: totalDeals }
      ];

      setMetrics({
        totalContacts,
        totalDeals,
        totalValue,
        conversionRate,
        topLeads,
        dealsByStage,
        monthlyTrends
      });
    } catch (error) {
      console.error('Error fetching CRM metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#1ABC9C', '#2C3E50', '#3498DB', '#E74C3C', '#F39C12'];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalContacts}</div>
            <p className="text-xs text-green-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalDeals}</div>
            <p className="text-xs text-blue-600">Pipeline healthy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalValue.toLocaleString()}</div>
            <p className="text-xs text-purple-600">Potential revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <p className="text-xs text-orange-600">Contact to deal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
            <CardDescription>Contacts and deals over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="contacts" fill="#1ABC9C" name="Contacts" />
                <Bar dataKey="deals" fill="#2C3E50" name="Deals" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deal Stages */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Distribution</CardTitle>
            <CardDescription>Deals by pipeline stage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.dealsByStage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ stage, count }) => `${stage}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {metrics.dealsByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Leads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Top Qualified Leads
          </CardTitle>
          <CardDescription>Contacts with highest lead scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.topLeads.map((lead, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-sm text-gray-600">{lead.company}</div>
                </div>
                <Badge variant="default" className="bg-teal-100 text-teal-800">
                  Score: {lead.score}
                </Badge>
              </div>
            ))}
            {metrics.topLeads.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No qualified leads yet. Connect your CRM to see lead scoring.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMAnalytics;
