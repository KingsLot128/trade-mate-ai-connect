import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import IntegrationCard from './IntegrationCard';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  category: 'accounting' | 'crm' | 'calendar' | 'communication' | 'payments';
  icon: string;
  description: string;
  benefits: string[];
  setupComplexity: 'easy' | 'moderate' | 'advanced';
  dataEnrichment: string[];
  isConnected: boolean;
  connectionStatus?: 'connected' | 'error' | 'syncing';
  popularityRank: number;
  provider: string;
}

interface UserProfile {
  chaos_score: number;
  setup_preference: string;
  industry: string;
  business_name: string;
}

interface BuiltinToolCardProps {
  tool: string;
  title: string;
  description: string;
  icon: string;
}

const BuiltinToolCard: React.FC<BuiltinToolCardProps> = ({ tool, title, description, icon }) => (
  <Card className="p-4 hover:shadow-md transition-shadow">
    <div className="text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <Button variant="outline" size="sm">
        Learn More
      </Button>
    </div>
  </Card>
);

const IntegrationHub = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [connectedIntegrations, setConnectedIntegrations] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('accounting');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'accounting', label: 'Accounting', icon: '💰', description: 'Financial data and insights' },
    { id: 'crm', label: 'CRM', icon: '👥', description: 'Customer and lead management' },
    { id: 'calendar', label: 'Calendar', icon: '📅', description: 'Scheduling and time management' },
    { id: 'communication', label: 'Communication', icon: '💬', description: 'Email and messaging' },
    { id: 'payments', label: 'Payments', icon: '💳', description: 'Payment processing' }
  ];

  const availableIntegrations: Integration[] = [
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      category: 'accounting',
      icon: '💰',
      description: 'Sync invoices, expenses, and financial data',
      benefits: ['Real-time financial insights', 'Automated expense tracking', 'Cash flow predictions'],
      setupComplexity: 'easy',
      dataEnrichment: ['Revenue trends', 'Expense patterns', 'Profit margins'],
      isConnected: false,
      popularityRank: 1,
      provider: 'quickbooks'
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      category: 'crm',
      icon: '👥',
      description: 'Sync contacts, deals, and pipeline data',
      benefits: ['Lead scoring', 'Pipeline optimization', 'Contact insights'],
      setupComplexity: 'moderate',
      dataEnrichment: ['Customer journey', 'Deal probability', 'Lead quality'],
      isConnected: false,
      popularityRank: 2,
      provider: 'hubspot'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'crm',
      icon: '👥',
      description: 'Enterprise CRM integration',
      benefits: ['Advanced analytics', 'Custom objects', 'Workflow automation'],
      setupComplexity: 'advanced',
      dataEnrichment: ['Sales forecasting', 'Territory management', 'Custom metrics'],
      isConnected: false,
      popularityRank: 3,
      provider: 'salesforce'
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      category: 'calendar',
      icon: '📅',
      description: 'Sync appointments and scheduling',
      benefits: ['Time blocking', 'Meeting insights', 'Availability optimization'],
      setupComplexity: 'easy',
      dataEnrichment: ['Time patterns', 'Meeting efficiency', 'Schedule optimization'],
      isConnected: false,
      popularityRank: 4,
      provider: 'google-calendar'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'payments',
      icon: '💳',
      description: 'Payment processing and analytics',
      benefits: ['Payment insights', 'Revenue tracking', 'Customer behavior'],
      setupComplexity: 'moderate',
      dataEnrichment: ['Payment trends', 'Customer lifetime value', 'Churn analysis'],
      isConnected: false,
      popularityRank: 5,
      provider: 'stripe'
    }
  ];

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadConnectedIntegrations();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('chaos_score, setup_preference, industry, business_name')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadConnectedIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (error) throw error;
      setConnectedIntegrations(data || []);
      
      // Update integration connection status
      const updatedIntegrations = availableIntegrations.map(integration => ({
        ...integration,
        isConnected: data?.some(conn => conn.provider === integration.provider) || false
      }));
      
      setIntegrations(getRecommendedIntegrations(updatedIntegrations));
    } catch (error) {
      console.error('Error loading integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedIntegrations = (integrations: Integration[]): Integration[] => {
    if (!userProfile) return integrations;

    const { chaos_score, setup_preference } = userProfile;
    
    // Sort integrations based on chaos score and setup preference
    return integrations.sort((a, b) => {
      // High chaos (70+) = prioritize easy setup
      if (chaos_score >= 70) {
        if (a.setupComplexity === 'easy' && b.setupComplexity !== 'easy') return -1;
        if (b.setupComplexity === 'easy' && a.setupComplexity !== 'easy') return 1;
      }
      
      // Setup preference influence
      if (setup_preference === 'minimal') {
        return a.popularityRank - b.popularityRank;
      }
      
      if (setup_preference === 'connect') {
        // Prioritize more powerful integrations
        if (a.setupComplexity === 'advanced' && b.setupComplexity !== 'advanced') return -1;
        if (b.setupComplexity === 'advanced' && a.setupComplexity !== 'advanced') return 1;
      }
      
      return a.popularityRank - b.popularityRank;
    });
  };

  const getSmartRecommendationText = (profile: UserProfile | null): string => {
    if (!profile) return "Loading recommendations...";
    
    const { chaos_score, setup_preference } = profile;
    
    if (chaos_score >= 70) {
      return "Based on your chaos score, we recommend starting with 1-2 simple integrations to reduce complexity.";
    } else if (chaos_score >= 40) {
      return "Your business is well-organized. Try connecting your most-used tools first for maximum impact.";
    } else {
      return "Your business is highly organized. Feel free to explore advanced integrations for deeper insights.";
    }
  };

  const calculateDataRichness = (integrations: Integration[]): number => {
    const connected = integrations.filter(i => i.isConnected).length;
    const total = integrations.length;
    return Math.round((connected / total) * 100);
  };

  const calculateAIConfidence = (integrations: Integration[]): number => {
    const connectedCategories = new Set(integrations.filter(i => i.isConnected).map(i => i.category));
    const totalCategories = categories.length;
    return Math.round((connectedCategories.size / totalCategories) * 100);
  };

  const getIntegrationsByCategory = (categoryId: string): Integration[] => {
    return integrations.filter(integration => integration.category === categoryId);
  };

  const handleConnect = async (provider: string) => {
    try {
      const redirectUrl = `${window.location.origin}/integrations/callback`;
      
      const { data } = await supabase.functions.invoke('oauth-start', {
        body: { provider, redirectUrl }
      });

      if (data.oauthUrl) {
        window.location.href = data.oauthUrl;
      }
    } catch (error) {
      console.error('OAuth start error:', error);
      toast.error('Failed to start integration');
    }
  };

  const handleSync = async (provider: string) => {
    try {
      toast.info('Starting sync...');
      
      const { data } = await supabase.functions.invoke('sync-crm-data', {
        body: { userId: user?.id, provider }
      });

      if (data.success) {
        toast.success(`Sync completed successfully`);
        loadConnectedIntegrations();
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Sync failed');
    }
  };

  const handleDisconnect = async (provider: string) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ is_active: false })
        .eq('user_id', user?.id)
        .eq('provider', provider);

      if (error) throw error;
      
      toast.success('Integration disconnected');
      loadConnectedIntegrations();
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error('Failed to disconnect');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="integration-hub space-y-8">
      {/* Hub header with smart recommendations */}
      <div className="hub-header">
        <h2 className="text-3xl font-bold mb-4">Connect Your Business Tools</h2>
        <p className="text-xl text-muted-foreground mb-4">
          Connect what you use, skip what you don't. Our AI adapts to your setup.
        </p>
        
        {/* Smart recommendation based on chaos score */}
        {userProfile && (
          <div className="smart-recommendation p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">
              🤖 Recommended for your business stage
            </h3>
            <p className="text-blue-700">
              {getSmartRecommendationText(userProfile)}
            </p>
          </div>
        )}
        
        {/* Connection status overview */}
        <div className="connection-overview grid md:grid-cols-4 gap-4 mb-6">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-green-600">
              {integrations.filter(i => i.isConnected).length}
            </div>
            <div className="text-sm text-muted-foreground">Connected</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">
              {integrations.filter(i => !i.isConnected).length}
            </div>
            <div className="text-sm text-muted-foreground">Available</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-purple-600">
              {calculateDataRichness(integrations)}%
            </div>
            <div className="text-sm text-muted-foreground">Data Richness</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-orange-600">
              {calculateAIConfidence(integrations)}%
            </div>
            <div className="text-sm text-muted-foreground">AI Confidence</div>
          </Card>
        </div>
      </div>

      {/* Category tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex flex-col gap-1">
              <span className="text-lg">{category.icon}</span>
              <span className="text-xs">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="category-description mb-4 p-3 bg-muted rounded">
              <p className="text-muted-foreground">{category.description}</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getIntegrationsByCategory(category.id).map(integration => (
                <IntegrationCard
                  key={integration.id}
                  provider={integration.provider}
                  name={integration.name}
                  description={integration.description}
                  isConnected={integration.isConnected}
                  lastSync={connectedIntegrations.find(c => c.provider === integration.provider)?.updated_at}
                  onConnect={() => handleConnect(integration.provider)}
                  onSync={() => handleSync(integration.provider)}
                  onDisconnect={() => handleDisconnect(integration.provider)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Built-in tools alternative */}
      <div className="builtin-alternative mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Prefer to keep it simple?</h3>
          <p className="text-muted-foreground text-lg">
            Use our built-in smart tools instead. You'll still get powerful AI insights.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <BuiltinToolCard 
            tool="crm"
            title="Smart CRM"
            description="AI-powered lead tracking and follow-up automation"
            icon="🏢"
          />
          <BuiltinToolCard 
            tool="bookkeeping"
            title="Simple Bookkeeping"
            description="Easy expense tracking with AI financial insights"
            icon="💰"
          />
          <BuiltinToolCard 
            tool="calendar"
            title="Smart Calendar"
            description="Intelligent scheduling with optimization suggestions"
            icon="📅"
          />
        </div>
      </div>
    </div>
  );
};

export default IntegrationHub;