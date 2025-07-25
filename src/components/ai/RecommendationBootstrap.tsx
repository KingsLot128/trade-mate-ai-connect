import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Loader2, Target, TrendingUp, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface RecommendationTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  priority_score: number;
  expected_impact: string;
  time_to_implement: string;
  content: {
    actionable_steps: string[];
    success_metrics: string[];
    timeframe: string;
    difficulty: string;
  };
}

const RecommendationBootstrap = () => {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);

  const generateInitialRecommendations = async () => {
    if (!user) return;

    try {
      setGenerating(true);

      // Call the intelligent recommendation generation edge function
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'generate-intelligent-recommendations',
        {
          body: { user_id: user.id }
        }
      );

      if (functionError) {
        console.error('Edge function error:', functionError);
        // Fallback to local generation if edge function fails
        await generateLocalRecommendations();
      } else {
        toast.success(`Generated ${functionData.recommendations_generated} AI recommendations and ${functionData.decisions_generated} daily decisions!`);
      }
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to local generation
      await generateLocalRecommendations();
    } finally {
      setGenerating(false);
    }
  };

  const generateLocalRecommendations = async () => {
    if (!user) return;

    // Get user profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get business context
    const [customersRes, metricsRes] = await Promise.all([
      supabase.from('customers').select('*').eq('user_id', user.id),
      supabase.from('business_metrics').select('*').eq('user_id', user.id)
    ]);

    const customers = customersRes.data || [];
    const metrics = metricsRes.data || [];

    // Generate context-aware recommendations
    const recommendations = generateContextualRecommendations(profile, customers, metrics);

    // Insert recommendations into database
    const enhancedRecommendations = recommendations.map(rec => ({
      user_id: user.id,
      recommendation_id: rec.id,
      recommendation_type: rec.category,
      hook: rec.title,
      reasoning: rec.description,
      content: rec.content,
      priority_score: rec.priority_score,
      confidence_score: 85,
      expected_impact: rec.expected_impact,
      time_to_implement: rec.time_to_implement,
      stream_type: 'forYou',
      is_active: true
    }));

    const { error } = await supabase
      .from('enhanced_recommendations')
      .insert(enhancedRecommendations);

    if (error) throw error;

    toast.success(`Generated ${recommendations.length} AI recommendations based on your business profile!`);
  };

  const generateContextualRecommendations = (profile: any, customers: any[], metrics: any[]): RecommendationTemplate[] => {
    const recommendations: RecommendationTemplate[] = [];

    // Business Growth Recommendations
    if (customers.length < 10) {
      recommendations.push({
        id: 'lead-generation-1',
        title: 'Boost Lead Generation with Local SEO',
        description: 'Optimize your online presence to attract more local customers through search engines.',
        category: 'marketing',
        priority_score: 90,
        expected_impact: 'High - 20-30% increase in qualified leads',
        time_to_implement: '2-3 weeks',
        content: {
          actionable_steps: [
            'Claim and optimize your Google Business Profile',
            'Add location-specific keywords to your website',
            'Collect and showcase customer reviews',
            'Create location-based service pages'
          ],
          success_metrics: [
            'Google Maps ranking improvement',
            'Increase in website traffic from local searches',
            'More phone calls and contact form submissions',
            'Higher quality lead score average'
          ],
          timeframe: '2-3 weeks',
          difficulty: 'moderate'
        }
      });
    }

    // Customer Retention Focus
    if (customers.length > 5) {
      recommendations.push({
        id: 'retention-1',
        title: 'Implement Customer Follow-up Automation',
        description: 'Set up automated follow-up sequences to increase customer satisfaction and repeat business.',
        category: 'customer_success',
        priority_score: 85,
        expected_impact: 'Medium - 15-25% increase in repeat customers',
        time_to_implement: '1-2 weeks',
        content: {
          actionable_steps: [
            'Create post-service satisfaction survey',
            'Set up 30-day follow-up email sequence',
            'Implement seasonal service reminders',
            'Develop referral request campaigns'
          ],
          success_metrics: [
            'Customer satisfaction score improvement',
            'Increase in repeat business percentage',
            'Number of referrals generated',
            'Customer lifetime value increase'
          ],
          timeframe: '1-2 weeks',
          difficulty: 'easy'
        }
      });
    }

    // Revenue Optimization
    const hasRevenueData = metrics.some(m => m.metric_type === 'monthly_revenue');
    if (!hasRevenueData || profile?.chaos_score > 60) {
      recommendations.push({
        id: 'revenue-tracking-1',
        title: 'Establish Revenue Tracking System',
        description: 'Implement systematic revenue tracking to identify profitable services and optimize pricing.',
        category: 'financial',
        priority_score: 80,
        expected_impact: 'High - Better pricing decisions, 10-20% profit increase',
        time_to_implement: '1 week',
        content: {
          actionable_steps: [
            'Set up monthly revenue tracking',
            'Analyze service profitability by type',
            'Identify seasonal revenue patterns',
            'Create pricing strategy based on data'
          ],
          success_metrics: [
            'Monthly revenue growth percentage',
            'Profit margin improvement by service',
            'Accurate revenue forecasting',
            'Better cash flow management'
          ],
          timeframe: '1 week',
          difficulty: 'easy'
        }
      });
    }

    // Operational Efficiency
    if (profile?.chaos_score > 70) {
      recommendations.push({
        id: 'workflow-optimization-1',
        title: 'Streamline Daily Operations Workflow',
        description: 'Reduce chaos and improve efficiency by organizing your daily business operations.',
        category: 'operations',
        priority_score: 95,
        expected_impact: 'High - 30-40% time savings, reduced stress',
        time_to_implement: '1-2 weeks',
        content: {
          actionable_steps: [
            'Create standardized service checklists',
            'Implement appointment scheduling system',
            'Set up customer communication templates',
            'Establish daily task prioritization method'
          ],
          success_metrics: [
            'Reduction in chaos score',
            'Decreased time per customer interaction',
            'Improved on-time service delivery',
            'Better work-life balance'
          ],
          timeframe: '1-2 weeks',
          difficulty: 'moderate'
        }
      });
    }

    // Industry-specific recommendations
    if (profile?.industry === 'Landscaping') {
      recommendations.push({
        id: 'seasonal-marketing-1',
        title: 'Develop Seasonal Service Marketing',
        description: 'Create targeted marketing campaigns for different seasons to maximize year-round revenue.',
        category: 'marketing',
        priority_score: 75,
        expected_impact: 'Medium - 15-25% increase in off-season bookings',
        time_to_implement: '2-3 weeks',
        content: {
          actionable_steps: [
            'Plan spring cleanup marketing campaign',
            'Develop summer maintenance packages',
            'Create fall preparation service offers',
            'Design winter planning consultations'
          ],
          success_metrics: [
            'Bookings during off-peak seasons',
            'Annual contract conversion rate',
            'Customer retention through seasons',
            'Average project value increase'
          ],
          timeframe: '2-3 weeks',
          difficulty: 'moderate'
        }
      });
    }

    return recommendations;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Recommendation Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border">
          <Brain className="h-12 w-12 mx-auto mb-3 text-blue-600" />
          <h3 className="font-semibold mb-2">Get Personalized Business Insights</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Generate AI-powered recommendations tailored to your business profile, industry, and current challenges.
          </p>
          
          <Button 
            onClick={generateInitialRecommendations}
            disabled={generating}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Recommendations...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Generate AI Recommendations
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span>Growth strategies</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-500" />
            <span>Customer retention</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-purple-500" />
            <span>Revenue optimization</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-orange-500" />
            <span>Operational efficiency</span>
          </div>
        </div>

        <div className="flex justify-center">
          <Badge variant="outline" className="text-xs">
            Powered by contextual AI analysis
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationBootstrap;