import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';

export const StripeSetupPrompt: React.FC = () => {
  return (
    <Card className="border-2 border-dashed border-orange-200 bg-orange-50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
          <CreditCard className="w-6 h-6 text-orange-600" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2 text-orange-800">
          <AlertTriangle className="w-5 h-5" />
          Stripe Integration Required
          <Badge variant="secondary" className="bg-orange-200 text-orange-800">
            Setup Needed
          </Badge>
        </CardTitle>
        <CardDescription className="text-orange-700">
          To enable payments and subscription management, you need to configure your Stripe integration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-200 bg-orange-100">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Payment processing is not yet configured.</strong> Complete the setup below to start accepting payments.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-semibold text-orange-800">Setup Steps:</h4>
          <div className="space-y-2">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-orange-800">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-800">Create a Stripe account</p>
                <p className="text-xs text-orange-600">Sign up at stripe.com if you don't have an account</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-orange-800">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-800">Get your Stripe Secret Key</p>
                <p className="text-xs text-orange-600">Find it in your Stripe Dashboard → Developers → API Keys</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-orange-800">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-orange-800">Add the secret key to your project</p>
                <p className="text-xs text-orange-600">Configure it in your Supabase edge function secrets</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-200 pt-4 mt-4">
          <h4 className="font-semibold text-orange-800 mb-2">What you'll get:</h4>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-orange-700">Accept credit card payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-orange-700">Automatic subscription management</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-orange-700">Customer billing portal</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-orange-700">Trial-to-paid conversion</span>
            </div>
          </div>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <ExternalLink className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Ready to get started?</strong> Visit the Supabase Edge Functions settings to add your <code>STRIPE_SECRET_KEY</code>.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};