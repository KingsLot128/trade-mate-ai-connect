
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Plus, Calendar, TrendingUp } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Deal {
  id: string;
  name: string;
  amount: number | null;
  stage: string | null;
  probability: number;
  expected_close_date: string | null;
  contact_id: string | null;
  description: string | null;
  created_at: string;
}

const DealsPipeline = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  const stages = [
    { name: 'Lead', color: 'bg-gray-100 text-gray-800' },
    { name: 'Qualified', color: 'bg-blue-100 text-blue-800' },
    { name: 'Proposal', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
    { name: 'Closed Won', color: 'bg-green-100 text-green-800' },
    { name: 'Closed Lost', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    if (!user) return;
    fetchDeals();
  }, [user]);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_deals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeals(data || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDealsForStage = (stageName: string) => {
    return deals.filter(deal => deal.stage === stageName);
  };

  const getTotalValue = (stageDeals: Deal[]) => {
    return stageDeals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
  };

  const getStageColor = (stageName: string) => {
    const stage = stages.find(s => s.name === stageName);
    return stage?.color || 'bg-gray-100 text-gray-800';
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p>Please log in to view deals</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Deals Pipeline</h2>
          <p className="text-muted-foreground">
            Track your sales opportunities and revenue pipeline.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Pipeline Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${getTotalValue(deals).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {deals.length} active deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${getTotalValue(getDealsForStage('Closed Won')).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {getDealsForStage('Closed Won').length} deals closed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${deals.length > 0 ? Math.round(getTotalValue(deals) / deals.length).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Close Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deals.length > 0 ? Math.round((getDealsForStage('Closed Won').length / deals.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Win rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stages.map((stage) => {
          const stageDeals = getDealsForStage(stage.name);
          return (
            <Card key={stage.name} className="h-fit">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{stage.name}</CardTitle>
                  <Badge className={stage.color}>
                    {stageDeals.length}
                  </Badge>
                </div>
                <CardDescription>
                  ${getTotalValue(stageDeals).toLocaleString()} total value
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {stageDeals.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No deals in this stage
                  </p>
                ) : (
                  stageDeals.map((deal) => (
                    <div key={deal.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{deal.name}</h4>
                        <span className="text-sm font-medium text-green-600">
                          ${deal.amount?.toLocaleString() || '0'}
                        </span>
                      </div>
                      {deal.description && (
                        <p className="text-xs text-gray-600 mb-2">{deal.description}</p>
                      )}
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{deal.probability}% probability</span>
                        {deal.expected_close_date && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(deal.expected_close_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DealsPipeline;
