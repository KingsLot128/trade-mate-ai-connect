import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import ChaosIndexDisplay from './ChaosIndexDisplay';

interface BusinessHealthData {
  chaosIndex: number;
  topChallenges: string[];
  setupDate: string;
  industry: string;
  revenueRange: string;
}

const BusinessHealthWidget: React.FC = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<BusinessHealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      if (!user) return;

      try {
        // Fetch chaos index from business metrics
        const { data: metrics } = await supabase
          .from('business_metrics')
          .select('*')
          .eq('user_id', user.id)
          .eq('metric_type', 'chaos_index')
          .order('recorded_at', { ascending: false })
          .limit(1);

        // Fetch quiz responses for challenges
        const { data: responses } = await supabase
          .from('user_quiz_responses')
          .select('*')
          .eq('user_id', user.id)
          .eq('question_id', 'business_challenges');

        // Fetch profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const chaosIndex = metrics?.[0]?.value || 0;
        const challenges = responses?.[0]?.response || [];
        
        setHealthData({
          chaosIndex,
          topChallenges: Array.isArray(challenges) ? challenges.slice(0, 3) : [],
          setupDate: profile?.created_at || '',
          industry: profile?.industry || 'Not specified',
          revenueRange: 'Not specified' // Will be populated from quiz responses
        });
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!healthData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Health</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Complete the setup wizard to see your business health metrics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <ChaosIndexDisplay score={healthData.chaosIndex} size="small" showDetails={false} />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Business Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Industry: {healthData.industry}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Revenue: {healthData.revenueRange}</span>
            </div>
          </div>
          
          {healthData.topChallenges.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Top Challenges</h4>
              <div className="flex flex-wrap gap-2">
                {healthData.topChallenges.map((challenge, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {challenge}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessHealthWidget;