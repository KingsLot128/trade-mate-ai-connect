import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DataVault = () => {
  return (
    <Card className="data-vault">
      <CardHeader>
        <CardTitle className="flex items-center">
          🔒 Your Data Vault
          <Badge className="ml-2" variant="secondary">Encrypted</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="privacy-controls space-y-4">
          <div className="encryption-status p-3 bg-green-50 rounded border-l-4 border-green-400">
            <h4 className="font-semibold text-green-800">🛡️ Bank-Level Security</h4>
            <p className="text-green-700 text-sm">All your data is encrypted and never shared or sold</p>
          </div>
          
          <div className="data-usage p-3 bg-blue-50 rounded border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800">🤖 How We Use Your Data</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Generate personalized business recommendations</li>
              <li>• Calculate industry benchmarks (anonymized)</li>
              <li>• Improve AI accuracy for your specific business</li>
            </ul>
          </div>
          
          <div className="user-controls">
            <h4 className="font-semibold mb-2">Your Controls</h4>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Export My Data</Button>
              <Button variant="outline" size="sm">Delete My Data</Button>
              <Button variant="outline" size="sm">Privacy Settings</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataVault;