import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Zap,
  Target
} from 'lucide-react';

interface WebsiteAnalysis {
  url: string;
  seoScore: number;
  designScore: number;
  conversionScore: number;
  recommendations: {
    type: 'seo' | 'design' | 'conversion';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
  }[];
}

const WebsiteAnalyzer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);

  const analyzeWebsite = async () => {
    if (!user || !url) return;

    setLoading(true);
    try {
      // Simulate website analysis - in real app would use actual analysis service
      const mockAnalysis: WebsiteAnalysis = {
        url,
        seoScore: Math.floor(Math.random() * 40) + 60, // 60-100
        designScore: Math.floor(Math.random() * 30) + 70, // 70-100
        conversionScore: Math.floor(Math.random() * 50) + 50, // 50-100
        recommendations: [
          {
            type: 'seo',
            priority: 'high',
            title: 'Optimize Page Titles and Meta Descriptions',
            description: 'Your page titles are too long and missing key keywords. This affects search rankings.',
            impact: '15-25% increase in organic traffic'
          },
          {
            type: 'conversion',
            priority: 'high',
            title: 'Add Clear Call-to-Action Buttons',
            description: 'Your contact forms are hard to find. Adding prominent CTAs could boost conversions.',
            impact: '30-40% increase in lead generation'
          },
          {
            type: 'design',
            priority: 'medium',
            title: 'Improve Mobile Responsiveness',
            description: 'Some elements don\'t display well on mobile devices, affecting user experience.',
            impact: '20% improvement in mobile engagement'
          }
        ]
      };

      setAnalysis(mockAnalysis);

      // Store analysis in database
      await supabase
        .from('website_analysis')
        .upsert({
          user_id: user.id,
          website_url: url,
          seo_score: mockAnalysis.seoScore,
          design_score: mockAnalysis.designScore,
          conversion_score: mockAnalysis.conversionScore,
          analysis_data: mockAnalysis,
          recommendations: mockAnalysis.recommendations,
          last_analyzed: new Date().toISOString()
        }, { onConflict: 'user_id,website_url' });

      // Generate AI recommendations based on website analysis
      await generateWebsiteRecommendations(mockAnalysis);

      toast({
        title: "Website Analysis Complete",
        description: `Generated ${mockAnalysis.recommendations.length} optimization recommendations.`
      });

    } catch (error) {
      console.error('Error analyzing website:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze website. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateWebsiteRecommendations = async (analysis: WebsiteAnalysis) => {
    if (!user) return;

    try {
      // Create specific recommendations based on website analysis
      for (const rec of analysis.recommendations) {
        await supabase
          .from('enhanced_recommendations')
          .insert({
            user_id: user.id,
            recommendation_id: `website-${rec.type}-${Date.now()}`,
            recommendation_type: 'website_optimization',
            hook: `🌐 ${rec.title}`,
            content: {
              title: rec.title,
              description: rec.description,
              expectedImpact: rec.impact,
              timeToImplement: rec.priority === 'high' ? '2-3 hours' : '1-2 hours',
              steps: getImplementationSteps(rec),
              metrics: ['Website traffic', 'Conversion rate', 'Search rankings']
            },
            priority_score: rec.priority === 'high' ? 85 : rec.priority === 'medium' ? 70 : 55,
            personalized_score: 90,
            confidence_score: 88,
            reasoning: `Based on website analysis of ${analysis.url}`,
            expected_impact: rec.impact,
            time_to_implement: rec.priority === 'high' ? '2-3 hours' : '1-2 hours',
            stream_type: 'forYou',
            is_active: true
          });
      }
    } catch (error) {
      console.error('Error generating website recommendations:', error);
    }
  };

  const getImplementationSteps = (rec: any): string[] => {
    switch (rec.type) {
      case 'seo':
        return [
          'Audit current page titles and meta descriptions',
          'Research target keywords for your industry',
          'Rewrite titles to include primary keywords',
          'Update meta descriptions to be compelling and under 160 characters'
        ];
      case 'conversion':
        return [
          'Identify key conversion points on your site',
          'Design prominent call-to-action buttons',
          'Place CTAs above the fold on main pages',
          'A/B test different button colors and text'
        ];
      case 'design':
        return [
          'Test website on various mobile devices',
          'Identify responsive design issues',
          'Update CSS for better mobile compatibility',
          'Test loading speed on mobile connections'
        ];
      default:
        return ['Analyze current state', 'Plan improvements', 'Implement changes', 'Monitor results'];
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Website Analysis Tool
          </CardTitle>
          <p className="text-muted-foreground">
            Analyze your website and get AI-powered optimization recommendations
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your website URL (e.g., https://yoursite.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={analyzeWebsite} 
              disabled={loading || !url}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid gap-6">
          {/* Score Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results for {analysis.url}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SEO Score</span>
                    <div className="flex items-center gap-1">
                      {getScoreIcon(analysis.seoScore)}
                      <span className={`font-bold ${getScoreColor(analysis.seoScore)}`}>
                        {analysis.seoScore}/100
                      </span>
                    </div>
                  </div>
                  <Progress value={analysis.seoScore} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Design Score</span>
                    <div className="flex items-center gap-1">
                      {getScoreIcon(analysis.designScore)}
                      <span className={`font-bold ${getScoreColor(analysis.designScore)}`}>
                        {analysis.designScore}/100
                      </span>
                    </div>
                  </div>
                  <Progress value={analysis.designScore} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Conversion Score</span>
                    <div className="flex items-center gap-1">
                      {getScoreIcon(analysis.conversionScore)}
                      <span className={`font-bold ${getScoreColor(analysis.conversionScore)}`}>
                        {analysis.conversionScore}/100
                      </span>
                    </div>
                  </div>
                  <Progress value={analysis.conversionScore} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Optimization Recommendations
              </CardTitle>
              <p className="text-muted-foreground">
                These recommendations have been added to your AI feed for implementation
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                        {rec.priority} priority
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {rec.type}
                      </Badge>
                    </div>
                    <h3 className="font-medium">{rec.title}</h3>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-green-600 font-medium">Expected Impact: {rec.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WebsiteAnalyzer;