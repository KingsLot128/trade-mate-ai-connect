
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Smartphone } from "lucide-react";
import { usePWA } from '@/hooks/usePWA';

const PWAInstall = () => {
  const { isInstallable, installApp } = usePWA();

  if (!isInstallable) return null;

  return (
    <Card className="mb-6 border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800">Install TradeMate AI</h3>
              <p className="text-sm text-green-700">Get faster access and work offline</p>
            </div>
          </div>
          <Button onClick={installApp} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Install App
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstall;
