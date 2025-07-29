import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  Brain,
  Zap,
  Settings,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOAuth } from '@/hooks/useOAuth';
import { SmartMailService, EmailAccount, EmailConversation, EmailInsight } from '@/services/SmartMailService';
import { toast } from 'sonner';

export const SmartMailSync: React.FC = () => {
  const { user } = useAuth();
  const { connect, isConnecting, isConnected } = useOAuth({
    onSuccess: handleOAuthSuccess,
    onError: (provider, error) => {
      toast.error(`Failed to connect ${provider}: ${error}`);
    }
  });

  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [conversations, setConversations] = useState<EmailConversation[]>([]);
  const [insights, setInsights] = useState<EmailInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  async function handleOAuthSuccess(provider: string, data: any) {
    if (!user || (provider !== 'gmail' && provider !== 'outlook')) return;

    try {
      await SmartMailService.addEmailAccount({
        user_id: user.id,
        provider,
        email_address: data.email || 'Connected Account',
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
        is_active: true,
        last_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      toast.success(`${provider} connected successfully!`);
      fetchData();
    } catch (error) {
      console.error('Error saving email account:', error);
      toast.error('Failed to save email account');
    }
  }

  async function fetchData() {
    if (!user) return;

    try {
      setLoading(true);
      const [accountsData, conversationsData, insightsData] = await Promise.all([
        SmartMailService.getEmailAccounts(user.id),
        SmartMailService.getConversations(user.id),
        SmartMailService.getInsights(user.id)
      ]);

      setEmailAccounts(accountsData);
      setConversations(conversationsData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load email data');
    } finally {
      setLoading(false);
    }
  }

  async function generateInsights() {
    if (!user) return;

    try {
      toast.info('Generating AI insights...');
      await SmartMailService.generateInsights(user.id);
      await fetchData();
      toast.success('Insights generated successfully!');
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights');
    }
  }

  async function dismissInsight(insightId: string) {
    try {
      await SmartMailService.dismissInsight(insightId);
      setInsights(prev => prev.filter(insight => insight.id !== insightId));
      toast.success('Insight dismissed');
    } catch (error) {
      console.error('Error dismissing insight:', error);
      toast.error('Failed to dismiss insight');
    }
  }

  const hasEmailAccounts = emailAccounts.length > 0;
  const stalledConversations = conversations.filter(conv => conv.conversation_stage === 'stalled');
  const urgentInsights = insights.filter(insight => insight.confidence_score > 70);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SmartMail Sync</h1>
          <p className="text-muted-foreground">
            AI-powered email intelligence for your business communications
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={generateInsights}
            disabled={!hasEmailAccounts}
            size="sm"
          >
            <Brain className="w-4 h-4 mr-2" />
            Generate Insights
          </Button>
        </div>
      </div>

      {/* Connect Email Accounts */}
      {!hasEmailAccounts && (
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            Connect your email accounts to start getting AI-powered insights and automation.
          </AlertDescription>
        </Alert>
      )}

      {/* Email Account Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Connected Email Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emailAccounts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {emailAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{account.email_address}</p>
                        <p className="text-sm text-muted-foreground capitalize">{account.provider}</p>
                      </div>
                    </div>
                    <Badge variant={account.is_active ? "default" : "secondary"}>
                      {account.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No email accounts connected yet</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                onClick={() => connect('gmail')}
                disabled={isConnecting('gmail')}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isConnecting('gmail') ? 'Connecting...' : 'Connect Gmail'}
              </Button>
              <Button
                onClick={() => connect('outlook')}
                disabled={isConnecting('outlook')}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isConnecting('outlook') ? 'Connecting...' : 'Connect Outlook'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasEmailAccounts && (
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Active Conversations</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {conversations.filter(c => c.conversation_stage === 'active').length}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Stalled Deals</span>
                </div>
                <p className="text-2xl font-bold mt-1">{stalledConversations.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Avg Clarity Score</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {conversations.length > 0 
                    ? Math.round(conversations.reduce((sum, c) => sum + c.clarity_score, 0) / conversations.length)
                    : 0}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">AI Insights</span>
                </div>
                <p className="text-2xl font-bold mt-1">{insights.length}</p>
              </CardContent>
            </Card>
          </div>

          <TabsContent value="insights" className="space-y-4">
            {insights.length > 0 ? (
              insights.map((insight) => (
                <Card key={insight.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={insight.insight_type === 'urgent_response' ? 'destructive' : 'default'}>
                            {insight.insight_type.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {insight.confidence_score}% confidence
                          </span>
                        </div>
                        <h3 className="font-semibold">{insight.title}</h3>
                        <p className="text-muted-foreground">{insight.description}</p>
                        
                        {Array.isArray(insight.suggested_actions) && insight.suggested_actions.length > 0 && (
                          <div className="space-y-1 mt-3">
                            <p className="text-sm font-medium">Suggested Actions:</p>
                            {insight.suggested_actions.map((action: any, index: number) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>{action.action}: {action.description}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => dismissInsight(insight.id)}
                        variant="ghost"
                        size="sm"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No insights available yet. Click "Generate Insights" to analyze your email conversations.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="conversations" className="space-y-4">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <Card key={conversation.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{conversation.subject || 'No Subject'}</h3>
                          <Badge variant={
                            conversation.conversation_stage === 'active' ? 'default' :
                            conversation.conversation_stage === 'stalled' ? 'destructive' :
                            'secondary'
                          }>
                            {conversation.conversation_stage}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {Array.isArray(conversation.participants) ? conversation.participants.join(', ') : 'No participants'}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>Clarity: {conversation.clarity_score}%</span>
                          </div>
                          {conversation.sentiment_score && (
                            <div className="flex items-center gap-1">
                              <span>Sentiment: {(conversation.sentiment_score * 100).toFixed(0)}%</span>
                            </div>
                          )}
                          {conversation.last_activity_at && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                Last activity: {new Date(conversation.last_activity_at).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No conversations found. Make sure your email accounts are properly synced.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="automation" className="space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Automation Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Set up intelligent automation rules to handle common email scenarios automatically.
                </p>
                <Button variant="outline" disabled>
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Rules
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};