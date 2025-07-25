
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntegrationsManager from '@/components/integrations/IntegrationsManager';
import CRMAnalytics from '@/components/analytics/CRMAnalytics';

const Integrations = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="tm-heading-lg mb-2">Integrations & Analytics</h1>
          <p className="text-gray-600">Connect your tools and monitor your business performance</p>
        </div>

        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="integrations">Manage Integrations</TabsTrigger>
            <TabsTrigger value="analytics">CRM Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations">
            <IntegrationsManager />
          </TabsContent>

          <TabsContent value="analytics">
            <CRMAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Integrations;
