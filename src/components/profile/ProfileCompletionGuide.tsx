import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  AlertCircle, 
  Brain, 
  Target, 
  Users, 
  BarChart3,
  Calendar,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileCompleteness {
  hasBasicInfo: boolean;
  hasQuizData: boolean;
  hasBusinessData: boolean;
  hasMetricsData: boolean;
  overallScore: number;
  missingItems: string[];
}

const ProfileCompletionGuide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [completeness, setCompleteness] = useState<ProfileCompleteness>({
    hasBasicInfo: false,
    hasQuizData: false,
    hasBusinessData: false,
    hasMetricsData: false,
    overallScore: 0,
    missingItems: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkProfileCompleteness();
    }
  }, [user]);

  const checkProfileCompleteness = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Check profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Check if quiz completed
      const hasQuizData = !!(profile?.chaos_score && profile?.clarity_zone && profile?.quiz_completed_at);
      
      // Check basic business info
      const hasBasicInfo = !!(profile?.business_name && profile?.industry && profile?.phone);
      
      // Check business data (customers, deals, etc.)
      const [customersRes, appointmentsRes, dealsRes] = await Promise.all([
        supabase.from('customers').select('id').eq('user_id', user.id).limit(1),
        supabase.from('appointments').select('id').eq('user_id', user.id).limit(1),
        supabase.from('crm_deals').select('id').eq('user_id', user.id).limit(1)
      ]);

      const hasBusinessData = !!(
        (customersRes.data && customersRes.data.length > 0) ||
        (appointmentsRes.data && appointmentsRes.data.length > 0) ||
        (dealsRes.data && dealsRes.data.length > 0)
      );

      // Check metrics data
      const { data: metrics } = await supabase
        .from('business_metrics')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      const hasMetricsData = !!(metrics && metrics.length > 0);

      // Calculate missing items
      const missingItems = [];
      if (!hasBasicInfo) missingItems.push('Basic business information');
      if (!hasQuizData) missingItems.push('Chaos assessment quiz');
      if (!hasBusinessData) missingItems.push('Business data (customers/deals/appointments)');
      if (!hasMetricsData) missingItems.push('Business metrics and KPIs');

      // Calculate overall score
      const completedItems = [hasBasicInfo, hasQuizData, hasBusinessData, hasMetricsData].filter(Boolean).length;
      const overallScore = Math.round((completedItems / 4) * 100);

      setCompleteness({
        hasBasicInfo,
        hasQuizData,
        hasBusinessData,
        hasMetricsData,
        overallScore,
        missingItems
      });

    } catch (error) {
      console.error('Error checking profile completeness:', error);
      toast.error('Failed to check profile completeness');
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = async () => {
    if (!user) return;

    try {
      // Add sample customers
      const sampleCustomers = [
        {
          user_id: user.id,
          name: 'John Smith',
          email: 'john@example.com',
          phone: '(555) 123-4567',
          service_type: 'Landscaping Design',
          timeline_urgency: 'Within 2 weeks',
          project_value_min: 5000,
          project_value_max: 8000,
          lead_source: 'Website',
          decision_maker_type: 'Homeowner',
          communication_preference: 'Phone',
          best_contact_time: 'Evening',
          relationship_stage: 'Qualified Lead'
        },
        {
          user_id: user.id,
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '(555) 234-5678',
          service_type: 'Lawn Maintenance',
          timeline_urgency: 'ASAP',
          project_value_min: 2000,
          project_value_max: 3000,
          lead_source: 'Referral',
          decision_maker_type: 'Property Manager',
          communication_preference: 'Email',
          best_contact_time: 'Morning',
          relationship_stage: 'New Lead'
        }
      ];

      await supabase.from('customers').insert(sampleCustomers);

      // Add sample business metrics
      const sampleMetrics = [
        {
          user_id: user.id,
          metric_type: 'monthly_revenue',
          value: 15000,
          context: { period: '2024-01', source: 'sales_data' }
        },
        {
          user_id: user.id,
          metric_type: 'customer_satisfaction',
          value: 4.8,
          context: { scale: '5_point', reviews_count: 24 }
        },
        {
          user_id: user.id,
          metric_type: 'lead_conversion_rate',
          value: 35,
          context: { period: 'last_30_days', total_leads: 20 }
        }
      ];

      await supabase.from('business_metrics').insert(sampleMetrics);

      toast.success('Sample business data added successfully!');
      checkProfileCompleteness(); // Refresh the completeness check
      
    } catch (error) {
      console.error('Error generating sample data:', error);
      toast.error('Failed to generate sample data');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Experience Setup
        </CardTitle>
        <div className="space-y-2">
          <Progress value={completeness.overallScore} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {completeness.overallScore}% complete - {completeness.missingItems.length === 0 ? 'Ready for AI insights!' : `${completeness.missingItems.length} items remaining`}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Completion Status Items */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4" />
              <span className="text-sm">Basic Business Info</span>
            </div>
            {completeness.hasBasicInfo ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-500" />
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Target className="h-4 w-4" />
              <span className="text-sm">Chaos Assessment Quiz</span>
            </div>
            {completeness.hasQuizData ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-500" />
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">Business Data</span>
            </div>
            {completeness.hasBusinessData ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-500" />
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Business Metrics</span>
            </div>
            {completeness.hasMetricsData ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-500" />
            )}
          </div>
        </div>

        {/* Missing Items Alert */}
        {completeness.missingItems.length > 0 && (
          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
            <h4 className="font-medium text-orange-800 mb-2">Complete these for better AI insights:</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              {completeness.missingItems.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <AlertCircle className="h-3 w-3" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid gap-2">
          {!completeness.hasQuizData && (
            <Button 
              onClick={() => navigate('/enhanced-quiz')}
              variant="outline"
              className="w-full"
            >
              <Target className="h-4 w-4 mr-2" />
              Complete Chaos Assessment Quiz
            </Button>
          )}
          
          {!completeness.hasBusinessData && (
            <Button 
              onClick={generateSampleData}
              variant="outline"
              className="w-full"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Add Sample Business Data
            </Button>
          )}

          {completeness.overallScore >= 75 && (
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/clarity')}
                className="w-full"
              >
                <Brain className="h-4 w-4 mr-2" />
                Open Clarity Lens
              </Button>
              <Button 
                onClick={() => navigate('/ai-recommendations')}
                variant="outline"
                className="w-full"
              >
                <Target className="h-4 w-4 mr-2" />
                View AI Recommendations
              </Button>
            </div>
          )}
        </div>

        {/* AI Readiness Badge */}
        <div className="flex justify-center pt-2">
          {completeness.overallScore >= 75 ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              AI Ready
            </Badge>
          ) : (
            <Badge variant="outline" className="border-orange-200 text-orange-600">
              <AlertCircle className="h-3 w-3 mr-1" />
              Setup Needed
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionGuide;