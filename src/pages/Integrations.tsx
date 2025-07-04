
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntegrationHub from '@/components/integrations/IntegrationHub';
import IntegrationsManager from '@/components/integrations/IntegrationsManager';
import CRMAnalytics from '@/components/analytics/CRMAnalytics';

const Integrations = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="hub" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hub">Integration Hub</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="hub">
            <IntegrationHub />
          </TabsContent>

          <TabsContent value="manage">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Manage Integrations</h1>
              <p className="text-muted-foreground">Configure and sync your connected tools</p>
            </div>
            <IntegrationsManager />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">CRM Analytics</h1>
              <p className="text-muted-foreground">Monitor your business performance</p>
            </div>
            <CRMAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Integrations;
