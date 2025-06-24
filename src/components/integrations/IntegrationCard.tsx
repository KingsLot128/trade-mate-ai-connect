
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, RefreshCw, Settings, CheckCircle2 } from "lucide-react";

interface IntegrationCardProps {
  provider: string;
  name: string;
  description: string;
  isConnected: boolean;
  lastSync?: string;
  onConnect: () => void;
  onSync: () => void;
  onDisconnect: () => void;
  isLoading?: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  provider,
  name,
  description,
  isConnected,
  lastSync,
  onConnect,
  onSync,
  onDisconnect,
  isLoading = false
}) => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await onSync();
    } finally {
      setSyncing(false);
    }
  };

  const getProviderLogo = (provider: string) => {
    const logos: Record<string, string> = {
      hubspot: '🔶',
      salesforce: '☁️',
      quickbooks: '📊'
    };
    return logos[provider] || '🔗';
  };

  return (
    <Card className="hover-scale transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getProviderLogo(provider)}</div>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription className="text-sm">{description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {isConnected && lastSync && (
            <div className="text-xs text-gray-500">
              Last sync: {new Date(lastSync).toLocaleDateString()}
            </div>
          )}
          
          <div className="flex space-x-2">
            {!isConnected ? (
              <Button 
                onClick={onConnect}
                disabled={isLoading}
                className="tm-btn-primary flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleSync}
                  disabled={syncing || isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  Sync Now
                </Button>
                <Button 
                  onClick={onDisconnect}
                  variant="ghost"
                  size="sm"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
