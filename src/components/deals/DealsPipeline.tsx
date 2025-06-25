
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Plus, Calendar } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Deal {
  id: string;
  name: string;
  description: string | null;
  stage: string | null;
  amount: number | null;
  probability: number;
  expected_close_date: string | null;
  actual_close_date: string | null;
  created_at: string;
}

const stages = [
  { id: 'lead', name: 'Lead', color: 'bg-gray-100 text-gray-800' },
  { id: 'qualified', name: 'Qualified', color: 'bg-blue-100 text-blue-800' },
  { id: 'proposal', name: 'Proposal', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { id: 'closed-won', name: 'Closed Won', color: 'bg-green-100 text-green-800' },
  { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-100 text-red-800' }
];

const DealsPipeline = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchDeals();
  }, [user]);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_deals')
        .select('*')
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

  const getDealsForStage = (stageId: string) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getTotalValue = (stageDeals: Deal[]) => {
    return stageDeals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
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
            Track your sales opportunities through the pipeline.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageDeals = getDealsForStage(stage.id);
          const totalValue = getTotalValue(stageDeals);

          return (
            <div key={stage.id} className="space-y-3">
              <Card className="bg-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={stage.color}>
                      {stage.name}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {stageDeals.length}
                    </span>
                  </div>
                  {totalValue > 0 && (
                    <div className="text-sm font-medium">
                      {formatCurrency(totalValue)}
                    </div>
                  )}
                </CardHeader>
              </Card>

              <div className="space-y-3">
                {stageDeals.map((deal) => (
                  <Card key={deal.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{deal.name}</h4>
                      {deal.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {deal.description}
                        </p>
                      )}
                      <div className="space-y-1">
                        {deal.amount && (
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {formatCurrency(deal.amount)}
                          </div>
                        )}
                        {deal.expected_close_date && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(deal.expected_close_date).toLocaleDateString()}
                          </div>
                        )}
                        {deal.probability > 0 && (
                          <div className="text-sm text-gray-500">
                            {deal.probability}% probability
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No deals in this stage</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {deals.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No deals yet</h3>
            <p className="text-gray-500 mb-4 text-center max-w-sm">
              Start tracking your sales opportunities by adding your first deal.
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-green-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Deal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DealsPipeline;
