import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  isConnected: boolean;
  isBuiltIn: boolean;
  connectionStatus: 'connected' | 'available' | 'coming_soon';
  dataRichness: number;
  benefits: string[];
}

interface SetupOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  recommended: boolean;
  chaosScoreRange: [number, number];
}

const VisualIntegrationHub = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [userChaosScore, setUserChaosScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [connectionInProgress, setConnectionInProgress] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      loadIntegrations();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('chaos_score')
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        setUserChaosScore(profile.chaos_score || 50);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const loadIntegrations = async () => {
    // Load from database and add mock data
    const mockIntegrations: Integration[] = [
      {
        id: 'quickbooks',
        name: 'QuickBooks',
        category: 'accounting',
        icon: '💰',
        description: 'Connect your accounting for rich financial insights',
        isConnected: false,
        isBuiltIn: false,
        connectionStatus: 'available',
        dataRichness: 95,
        benefits: ['Automatic revenue tracking', 'Expense categorization', 'Tax preparation insights']
      },
      {
        id: 'hubspot',
        name: 'HubSpot CRM',
        category: 'crm',
        icon: '🏢',
        description: 'Sync customer data and sales pipeline',
        isConnected: false,
        isBuiltIn: false,
        connectionStatus: 'available',
        dataRichness: 90,
        benefits: ['Customer journey tracking', 'Sales pipeline analysis', 'Marketing automation']
      },
      {
        id: 'google-calendar',
        name: 'Google Calendar',
        category: 'calendar',
        icon: '📅',
        description: 'Optimize scheduling and time management',
        isConnected: false,
        isBuiltIn: false,
        connectionStatus: 'available',
        dataRichness: 75,
        benefits: ['Schedule optimization', 'Time blocking', 'Meeting insights']
      },
      {
        id: 'smart-crm',
        name: 'Smart CRM',
        category: 'crm',
        icon: '🎯',
        description: 'Built-in CRM with AI-powered insights',
        isConnected: true,
        isBuiltIn: true,
        connectionStatus: 'connected',
        dataRichness: 80,
        benefits: ['Zero setup required', 'AI lead scoring', 'Built-in automation']
      },
      {
        id: 'simple-bookkeeping',
        name: 'Simple Bookkeeping',
        category: 'accounting',
        icon: '📊',
        description: 'Easy financial tracking without complexity',
        isConnected: true,
        isBuiltIn: true,
        connectionStatus: 'connected',
        dataRichness: 70,
        benefits: ['Instant setup', 'AI categorization', 'Smart insights']
      }
    ];

    setIntegrations(mockIntegrations);
  };

  const setupOptions: SetupOption[] = [
    {
      id: 'connect',
      title: 'Connect Existing Tools',
      description: 'Link QuickBooks, CRM, Calendar for maximum insights',
      icon: '🔗',
      benefits: ['Automatic sync', 'Richer insights', 'No duplicate entry'],
      recommended: userChaosScore < 40,
      chaosScoreRange: [0, 40]
    },
    {
      id: 'builtin',
      title: 'Use Built-in Tools',
      description: 'Simple, integrated tools without complexity',
      icon: '⚡',
      benefits: ['Zero setup', 'Everything in one place', 'AI-optimized'],
      recommended: userChaosScore >= 40 && userChaosScore < 70,
      chaosScoreRange: [40, 70]
    },
    {
      id: 'minimal',
      title: 'AI Insights Only',
      description: 'Start with smart recommendations, upgrade later',
      icon: '🎯',
      benefits: ['Instant value', 'No setup', 'Upgrade anytime'],
      recommended: userChaosScore >= 70,
      chaosScoreRange: [70, 100]
    }
  ];

  const getSetupRecommendation = (chaosScore: number) => {
    if (chaosScore >= 70) {
      return "Your high chaos score suggests starting simple. Focus on AI insights first, then add tools as you stabilize.";
    } else if (chaosScore >= 40) {
      return "You're in the control zone. Built-in tools will give you structure without overwhelming complexity.";
    } else {
      return "You're ready for integrations! Connect your existing tools for maximum business intelligence.";
    }
  };

  const handleConnect = async (integration: Integration) => {
    setConnectionInProgress(integration.id);
    
    try {
      if (integration.isBuiltIn) {
        toast.success(`${integration.name} is already active!`);
        return;
      }

      // Mock OAuth flow
      toast.success(`Connecting to ${integration.name}...`);
      
      // Simulate connection
      setTimeout(() => {
        setIntegrations(prev => 
          prev.map(int => 
            int.id === integration.id 
              ? { ...int, isConnected: true, connectionStatus: 'connected' as const }
              : int
          )
        );
        toast.success(`${integration.name} connected successfully!`);
        setConnectionInProgress(null);
      }, 2000);
    } catch (error) {
      console.error('Connection failed:', error);
      toast.error(`Failed to connect ${integration.name}`);
      setConnectionInProgress(null);
    }
  };

  const connectedIntegrations = integrations.filter(i => i.isConnected);
  const availableIntegrations = integrations.filter(i => !i.isConnected);

  return (
    <div className="visual-integration-hub">
      {/* Hub Hero Section */}
      <div className="hub-hero mb-8 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Your Business Ecosystem</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Connect your tools or use our built-in alternatives - we adapt to your workflow
          </p>
          
          {/* Smart Recommendation */}
          <div className="smart-recommendation p-6 bg-background rounded-lg shadow-sm border-l-4 border-primary max-w-2xl mx-auto">
            <h3 className="font-semibold text-primary mb-2">
              🤖 Recommended for your business stage
            </h3>
            <p className="text-muted-foreground">
              {getSetupRecommendation(userChaosScore)}
            </p>
          </div>
        </div>

        {/* Visual Connection Map */}
        <ConnectionMap 
          integrations={integrations}
          onConnect={handleConnect}
          connectionInProgress={connectionInProgress}
        />
      </div>

      {/* Setup Options */}
      <div className="setup-options mb-8">
        <h3 className="text-2xl font-bold text-center mb-6">Choose Your Approach</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {setupOptions.map(option => (
            <SetupOptionCard 
              key={option.id}
              option={option}
              isSelected={selectedOption === option.id}
              onSelect={() => setSelectedOption(option.id)}
            />
          ))}
        </div>
      </div>

      {/* Integration Categories */}
      <div className="integration-categories">
        <h3 className="text-2xl font-bold mb-6">Available Integrations</h3>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="accounting">💰 Accounting</TabsTrigger>
            <TabsTrigger value="crm">👥 CRM</TabsTrigger>
            <TabsTrigger value="calendar">📅 Calendar</TabsTrigger>
            <TabsTrigger value="communication">💬 Communication</TabsTrigger>
            <TabsTrigger value="payments">💳 Payments</TabsTrigger>
          </TabsList>
          
          {['all', 'accounting', 'crm', 'calendar', 'communication', 'payments'].map(category => (
            <TabsContent key={category} value={category} className="space-y-4">
              {integrations
                .filter(int => category === 'all' || int.category === category)
                .map(integration => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onConnect={() => handleConnect(integration)}
                    isConnecting={connectionInProgress === integration.id}
                  />
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

const ConnectionMap = ({ integrations, onConnect, connectionInProgress }: {
  integrations: Integration[];
  onConnect: (integration: Integration) => void;
  connectionInProgress: string | null;
}) => {
  const connectedIntegrations = integrations.filter(i => i.isConnected);
  const availableIntegrations = integrations.filter(i => !i.isConnected).slice(0, 6);

  return (
    <div className="connection-map relative w-full max-w-4xl mx-auto h-80 bg-background rounded-lg p-8 border">
      {/* Central TradeMateAI Hub */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <div className="text-center">
            <div className="text-white font-bold text-xs">TradeMate</div>
            <div className="text-white font-bold text-xs">AI</div>
          </div>
        </div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-muted-foreground">
          Intelligence Hub
        </div>
      </div>

      {/* Connected Tools */}
      {connectedIntegrations.map((integration, index) => (
        <ConnectedToolNode 
          key={integration.id}
          integration={integration}
          position={getConnectedNodePosition(index, connectedIntegrations.length)}
        />
      ))}

      {/* Available Tools */}
      {availableIntegrations.map((integration, index) => (
        <AvailableToolNode 
          key={integration.id}
          integration={integration}
          position={getAvailableNodePosition(index, availableIntegrations.length)}
          onConnect={() => onConnect(integration)}
          isConnecting={connectionInProgress === integration.id}
        />
      ))}

      {/* Data Flow Animation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connectedIntegrations.map((integration, index) => (
          <AnimatedConnectionLine 
            key={integration.id}
            position={getConnectedNodePosition(index, connectedIntegrations.length)}
          />
        ))}
      </svg>
    </div>
  );
};

const ConnectedToolNode = ({ integration, position }: {
  integration: Integration;
  position: { x: string; y: string };
}) => (
  <div 
    className="absolute transform -translate-x-1/2 -translate-y-1/2"
    style={{ left: position.x, top: position.y }}
  >
    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-background">
      <span className="text-2xl">{integration.icon}</span>
    </div>
    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-center whitespace-nowrap">
      {integration.name}
    </div>
    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
      <span className="text-xs text-white">✓</span>
    </div>
  </div>
);

const AvailableToolNode = ({ integration, position, onConnect, isConnecting }: {
  integration: Integration;
  position: { x: string; y: string };
  onConnect: () => void;
  isConnecting: boolean;
}) => (
  <div 
    className="absolute transform -translate-x-1/2 -translate-y-1/2"
    style={{ left: position.x, top: position.y }}
  >
    <button
      onClick={onConnect}
      disabled={isConnecting}
      className="w-16 h-16 bg-muted rounded-full flex items-center justify-center shadow-lg border-2 border-dashed border-muted-foreground hover:border-primary hover:bg-primary/10 transition-all"
    >
      <span className="text-2xl opacity-60">{integration.icon}</span>
    </button>
    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-center whitespace-nowrap text-muted-foreground">
      {integration.name}
    </div>
  </div>
);

const AnimatedConnectionLine = ({ position }: { position: { x: string; y: string } }) => {
  const centerX = 50; // percentage
  const centerY = 50; // percentage
  const nodeX = parseFloat(position.x);
  const nodeY = parseFloat(position.y);

  return (
    <line
      x1={`${centerX}%`}
      y1={`${centerY}%`}
      x2={position.x}
      y2={position.y}
      stroke="hsl(var(--primary))"
      strokeWidth="2"
      strokeDasharray="5,5"
      className="animate-pulse"
    />
  );
};

const SetupOptionCard = ({ option, isSelected, onSelect }: {
  option: SetupOption;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <Card 
    className={`cursor-pointer transition-all ${
      isSelected ? 'ring-2 ring-primary' : 'hover:shadow-lg'
    } ${option.recommended ? 'border-primary' : ''}`}
    onClick={onSelect}
  >
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="text-3xl">{option.icon}</div>
        {option.recommended && (
          <Badge className="bg-primary text-primary-foreground">
            Recommended
          </Badge>
        )}
      </div>
      <CardTitle className="text-xl">{option.title}</CardTitle>
      <p className="text-muted-foreground">{option.description}</p>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {option.benefits.map((benefit, index) => (
          <li key={index} className="flex items-center text-sm">
            <span className="text-green-500 mr-2">✓</span>
            {benefit}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const IntegrationCard = ({ integration, onConnect, isConnecting }: {
  integration: Integration;
  onConnect: () => void;
  isConnecting: boolean;
}) => (
  <Card className="integration-card">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{integration.icon}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-lg">{integration.name}</h4>
              {integration.isBuiltIn && (
                <Badge variant="secondary">Built-in</Badge>
              )}
              {integration.isConnected && (
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-3">{integration.description}</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground">Data Richness:</span>
                <div className="w-16 h-2 bg-muted rounded-full">
                  <div 
                    className="h-2 bg-primary rounded-full transition-all"
                    style={{ width: `${integration.dataRichness}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{integration.dataRichness}%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <Button
            onClick={onConnect}
            disabled={integration.isConnected || isConnecting}
            variant={integration.isConnected ? 'secondary' : 'default'}
          >
            {isConnecting ? 'Connecting...' : 
             integration.isConnected ? 'Connected' : 'Connect'}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Helper functions for positioning nodes
const getConnectedNodePosition = (index: number, total: number) => {
  const angle = (index / total) * 2 * Math.PI;
  const radius = 30; // percentage from center
  return {
    x: `${50 + radius * Math.cos(angle)}%`,
    y: `${50 + radius * Math.sin(angle)}%`
  };
};

const getAvailableNodePosition = (index: number, total: number) => {
  const angle = (index / total) * 2 * Math.PI + Math.PI; // Offset by π
  const radius = 35; // percentage from center
  return {
    x: `${50 + radius * Math.cos(angle)}%`,
    y: `${50 + radius * Math.sin(angle)}%`
  };
};

export default VisualIntegrationHub;