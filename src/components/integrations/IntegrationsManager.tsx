
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import IntegrationCard from './IntegrationCard';
import { toast } from 'sonner';

interface Integration {
  id: string;
  provider: string;
  is_active: boolean;
  updated_at: string;
}

const IntegrationsManager = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  const availableIntegrations = [
    {
      provider: 'hubspot',
      name: 'HubSpot',
      description: 'Sync contacts, deals, and pipeline data',
      category: 'CRM'
    },
    {
      provider: 'salesforce',
      name: 'Salesforce',
      description: 'Connect to your Salesforce CRM',
      category: 'CRM'
    },
    {
      provider: 'quickbooks',
      name: 'QuickBooks',
      description: 'Sync invoices and financial data',
      category: 'Accounting'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchIntegrations();
    }
  }, [user]);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast.error('Failed to load integrations');
    } finally {
      setLoading(false);
    }
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
      toast.error('Failed to start OAuth flow');
    }
  };

  const handleSync = async (provider: string) => {
    try {
      toast.info('Starting sync...');
      
      const { data } = await supabase.functions.invoke('sync-crm-data', {
        body: { userId: user?.id, provider }
      });

      if (data.success) {
        toast.success(`Synced ${data.syncResults.contacts} contacts and ${data.syncResults.deals} deals`);
        fetchIntegrations();
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
      fetchIntegrations();
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error('Failed to disconnect');
    }
  };

  const getIntegrationStatus = (provider: string) => {
    const integration = integrations.find(i => i.provider === provider && i.is_active);
    return {
      isConnected: !!integration,
      lastSync: integration?.updated_at
    };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="tm-heading-lg mb-2">Integrations</h2>
          <p className="text-gray-600">Connect your favorite tools to TradeMateAI</p>
        </div>
        <Badge variant="secondary" className="bg-teal-100 text-teal-800">
          {integrations.filter(i => i.is_active).length} Active
        </Badge>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="accounting">Accounting</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableIntegrations.map(integration => {
              const status = getIntegrationStatus(integration.provider);
              return (
                <IntegrationCard
                  key={integration.provider}
                  provider={integration.provider}
                  name={integration.name}
                  description={integration.description}
                  isConnected={status.isConnected}
                  lastSync={status.lastSync}
                  onConnect={() => handleConnect(integration.provider)}
                  onSync={() => handleSync(integration.provider)}
                  onDisconnect={() => handleDisconnect(integration.provider)}
                />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="crm" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableIntegrations
              .filter(i => i.category === 'CRM')
              .map(integration => {
                const status = getIntegrationStatus(integration.provider);
                return (
                  <IntegrationCard
                    key={integration.provider}
                    provider={integration.provider}
                    name={integration.name}
                    description={integration.description}
                    isConnected={status.isConnected}
                    lastSync={status.lastSync}
                    onConnect={() => handleConnect(integration.provider)}
                    onSync={() => handleSync(integration.provider)}
                    onDisconnect={() => handleDisconnect(integration.provider)}
                  />
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="accounting" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableIntegrations
              .filter(i => i.category === 'Accounting')
              .map(integration => {
                const status = getIntegrationStatus(integration.provider);
                return (
                  <IntegrationCard
                    key={integration.provider}
                    provider={integration.provider}
                    name={integration.name}
                    description={integration.description}
                    isConnected={status.isConnected}
                    lastSync={status.lastSync}
                    onConnect={() => handleConnect(integration.provider)}
                    onSync={() => handleSync(integration.provider)}
                    onDisconnect={() => handleDisconnect(integration.provider)}
                  />
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationsManager;
