import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  Bot, 
  Settings, 
  CheckCircle, 
  ExternalLink, 
  Copy,
  Webhook,
  PhoneCall
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const CallSetupGuide = () => {
  const { toast } = useToast();
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const webhookUrl = `${window.location.origin}/api/webhooks/calls`;

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
    toast({
      title: "Copied!",
      description: "Webhook URL copied to clipboard",
    });
  };

  const integrationSteps = [
    {
      title: "Choose Your Phone System",
      description: "Select from our supported integrations",
      services: [
        { name: "Twilio", status: "recommended", setup: "5 min" },
        { name: "RingCentral", status: "available", setup: "10 min" },
        { name: "8x8", status: "available", setup: "10 min" },
        { name: "Vonage", status: "coming-soon", setup: "TBD" }
      ]
    },
    {
      title: "Configure AI Settings",
      description: "Customize how your AI assistant responds",
      features: [
        "Emergency keyword detection",
        "Service-specific responses",
        "Appointment scheduling",
        "Cost estimation",
        "Follow-up automation"
      ]
    },
    {
      title: "Test & Deploy",
      description: "Verify everything works before going live",
      actions: [
        "Test with demo calls",
        "Review AI responses",
        "Train on your services",
        "Set business hours",
        "Go live with confidence"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
            <Bot className="h-5 w-5 text-blue-600" />
            <span className="text-blue-600 font-medium">AI Call Assistant Setup</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold">Turn Every Call Into Revenue</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your AI assistant never misses a call, books appointments instantly, and handles emergencies 24/7. 
          Set up in minutes and start converting every caller into a customer.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Never Miss a Call</CardTitle>
                <CardDescription>
                  AI answers when you can't, captures leads, and books appointments automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    24/7 availability
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Emergency detection
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Instant responses
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Bot className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Smart Conversations</CardTitle>
                <CardDescription>
                  AI understands context, provides quotes, and schedules based on your services.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Service recognition
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Price estimation
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Appointment booking
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Settings className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Easy Integration</CardTitle>
                <CardDescription>
                  Works with your existing phone system. No hardware changes needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    5-minute setup
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    No hardware required
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Works with existing systems
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Ready to get started?</h3>
                  <p className="text-blue-700">Choose your phone provider and we'll walk you through the setup.</p>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Start Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid gap-6">
            {integrationSteps.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    {step.title}
                  </CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {'services' in step && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {step.services.map((service) => (
                        <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <PhoneCall className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="text-sm text-muted-foreground">Setup time: {service.setup}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={service.status === 'recommended' ? 'default' : 
                                         service.status === 'available' ? 'secondary' : 'outline'}>
                              {service.status === 'recommended' ? 'Recommended' :
                               service.status === 'available' ? 'Available' : 'Coming Soon'}
                            </Badge>
                            {service.status !== 'coming-soon' && (
                              <Button size="sm" variant="outline">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Setup
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {'features' in step && (
                    <div className="grid md:grid-cols-2 gap-2">
                      {step.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  )}
                  {'actions' in step && (
                    <div className="space-y-2">
                      {step.actions.map((action, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          {action}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Webhook className="h-5 w-5 mr-2" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>
                Use this URL in your phone system to send call data to TradeMate AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded border">
                  <code className="flex-1 text-sm">{webhookUrl}</code>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={copyWebhookUrl}
                    className={copiedWebhook ? 'bg-green-50 border-green-200' : ''}
                  >
                    {copiedWebhook ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configure this as a POST webhook in your phone system. It will receive call events and transcripts.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Response Configuration</CardTitle>
              <CardDescription>Customize how your AI assistant responds to different types of calls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Emergency Calls</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Immediate response for urgent situations
                    </p>
                    <Badge variant="destructive">High Priority</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Service Requests</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Quote and schedule appointments
                    </p>
                    <Badge variant="default">Standard</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">General Inquiries</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Information and basic questions
                    </p>
                    <Badge variant="secondary">Low Priority</Badge>
                  </div>
                </div>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Responses
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your AI Assistant</CardTitle>
              <CardDescription>
                Try different scenarios to see how your AI responds before going live
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Test Scenarios</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      🚨 Emergency: "My basement is flooding!"
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      🔧 Service: "Need a plumber for a leak"
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      📅 Scheduling: "When can you come out?"
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      💰 Quote: "How much for drain cleaning?"
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Expected Response</h4>
                  <div className="p-4 bg-blue-50 rounded border-l-4 border-blue-600">
                    <p className="text-sm">
                      "I understand this is urgent. Let me connect you with someone right away to schedule an emergency appointment. 
                      Can you tell me your location and the extent of the flooding?"
                    </p>
                    <div className="mt-2 flex items-center text-xs text-blue-600">
                      <Bot className="h-3 w-3 mr-1" />
                      AI will automatically escalate and schedule emergency service
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CallSetupGuide;