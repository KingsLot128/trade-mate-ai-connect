import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Settings,
  Brain,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Volume2
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceSettings {
  enabled: boolean;
  voice: string;
  responseStyle: 'professional' | 'friendly' | 'concise';
  useBusinessContext: boolean;
  customInstructions: string;
}

const VoiceCallInterface = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: false,
    voice: 'alloy',
    responseStyle: 'professional',
    useBusinessContext: true,
    customInstructions: ''
  });
  const [businessContext, setBusinessContext] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load business context when component mounts
  useEffect(() => {
    loadBusinessContext();
  }, []);

  const loadBusinessContext = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .single();

      const { data: businessSettings } = await supabase
        .from('business_settings')
        .select('*')
        .single();

      setBusinessContext({
        companyName: businessSettings?.company_name || profile?.business_name,
        industry: profile?.industry,
        services: profile?.primary_service_types || [],
        location: profile?.location,
        priceRange: {
          min: profile?.typical_project_range_min,
          max: profile?.typical_project_range_max
        }
      });
    } catch (error) {
      console.error('Error loading business context:', error);
    }
  };

  const generateContextualPrompt = () => {
    if (!businessContext || !voiceSettings.useBusinessContext) {
      return "You are a helpful AI assistant for a business.";
    }

    const basePrompt = `You are an AI assistant for ${businessContext.companyName}, a ${businessContext.industry} business`;
    
    let prompt = basePrompt;
    
    if (businessContext.services?.length > 0) {
      prompt += ` specializing in ${businessContext.services.join(', ')}`;
    }
    
    if (businessContext.location) {
      prompt += ` located in ${businessContext.location}`;
    }

    if (businessContext.priceRange?.min && businessContext.priceRange?.max) {
      prompt += `. Typical project range is $${businessContext.priceRange.min.toLocaleString()} - $${businessContext.priceRange.max.toLocaleString()}`;
    }

    const styleInstructions = {
      professional: "Respond professionally and formally.",
      friendly: "Be warm, friendly, and conversational.",
      concise: "Keep responses brief and to the point."
    };

    prompt += `. ${styleInstructions[voiceSettings.responseStyle]}`;

    if (voiceSettings.customInstructions) {
      prompt += ` Additional instructions: ${voiceSettings.customInstructions}`;
    }

    prompt += " Always be helpful and try to schedule appointments or provide quotes when appropriate.";

    return prompt;
  };

  const startVoiceConversation = async () => {
    if (!voiceSettings.enabled) {
      toast({
        title: "Voice Not Enabled",
        description: "Please enable voice conversations first",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // This would connect to ElevenLabs or OpenAI Realtime API
      const contextualPrompt = generateContextualPrompt();
      
      // For now, simulate connection
      setTimeout(() => {
        setIsConnected(true);
        setIsLoading(false);
        toast({
          title: "Voice Connected",
          description: "AI voice assistant is now active",
        });
      }, 2000);

    } catch (error) {
      setIsLoading(false);
      console.error('Error starting voice conversation:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to start voice conversation",
        variant: "destructive"
      });
    }
  };

  const endVoiceConversation = () => {
    setIsConnected(false);
    setIsSpeaking(false);
    toast({
      title: "Call Ended",
      description: "Voice conversation has been terminated",
    });
  };

  const saveVoiceSettings = async () => {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      // Save settings to user preferences
      const { error } = await supabase
        .from('ai_preferences')
        .upsert({
          user_id: userId,
          preferences_data: {
            voice_settings: voiceSettings as any
          }
        });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Voice configuration has been saved",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save voice settings",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Volume2 className="h-5 w-5 mr-2" />
            Voice Conversation Settings
          </CardTitle>
          <CardDescription>
            Configure AI voice responses for incoming calls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voice-enabled">Enable Voice Conversations</Label>
              <p className="text-sm text-muted-foreground">
                Allow AI to have real-time voice conversations with callers
              </p>
            </div>
            <Switch
              id="voice-enabled"
              checked={voiceSettings.enabled}
              onCheckedChange={(checked) => 
                setVoiceSettings(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          {voiceSettings.enabled && (
            <div className="space-y-4 border-l-2 border-primary/20 pl-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>AI Voice</Label>
                  <Select
                    value={voiceSettings.voice}
                    onValueChange={(value) => 
                      setVoiceSettings(prev => ({ ...prev, voice: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alloy">Alloy (Professional)</SelectItem>
                      <SelectItem value="echo">Echo (Friendly)</SelectItem>
                      <SelectItem value="fable">Fable (Warm)</SelectItem>
                      <SelectItem value="onyx">Onyx (Authoritative)</SelectItem>
                      <SelectItem value="nova">Nova (Energetic)</SelectItem>
                      <SelectItem value="shimmer">Shimmer (Calm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Response Style</Label>
                  <Select
                    value={voiceSettings.responseStyle}
                    onValueChange={(value: any) => 
                      setVoiceSettings(prev => ({ ...prev, responseStyle: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="concise">Concise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="business-context">Use Business Context</Label>
                  <p className="text-sm text-muted-foreground">
                    Include your business details in AI responses
                  </p>
                </div>
                <Switch
                  id="business-context"
                  checked={voiceSettings.useBusinessContext}
                  onCheckedChange={(checked) => 
                    setVoiceSettings(prev => ({ ...prev, useBusinessContext: checked }))
                  }
                />
              </div>

              {voiceSettings.useBusinessContext && businessContext && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center mb-2">
                      <Brain className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">Business Context</span>
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p><strong>Company:</strong> {businessContext.companyName}</p>
                      <p><strong>Industry:</strong> {businessContext.industry}</p>
                      {businessContext.services?.length > 0 && (
                        <p><strong>Services:</strong> {businessContext.services.join(', ')}</p>
                      )}
                      {businessContext.location && (
                        <p><strong>Location:</strong> {businessContext.location}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="custom-instructions">Custom Instructions</Label>
                <Textarea
                  id="custom-instructions"
                  placeholder="Additional instructions for the AI (e.g., specific policies, common questions, etc.)"
                  value={voiceSettings.customInstructions}
                  onChange={(e) => 
                    setVoiceSettings(prev => ({ ...prev, customInstructions: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              <Button onClick={saveVoiceSettings} className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Save Voice Settings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Control */}
      {voiceSettings.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Voice Assistant Control
            </CardTitle>
            <CardDescription>
              Test and manage your AI voice assistant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              {!isConnected ? (
                <Button 
                  onClick={startVoiceConversation}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Voice Test
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={endVoiceConversation}
                  variant="destructive"
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  End Conversation
                </Button>
              )}
            </div>

            {isConnected && (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Voice Assistant Active</span>
                </div>
                {isSpeaking && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    AI is speaking...
                  </Badge>
                )}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                Integration Status
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Voice Engine</span>
                  <Badge variant="outline">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                    Ready
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Business Context</span>
                  <Badge variant="outline">
                    {businessContext ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                        Loaded
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1 text-orange-500" />
                        Loading...
                      </>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Twilio Integration</span>
                  <Badge variant="outline">
                    <AlertCircle className="h-3 w-3 mr-1 text-orange-500" />
                    Setup Required
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceCallInterface;