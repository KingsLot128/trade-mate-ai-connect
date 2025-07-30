import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Building,
  Brain,
  Shield,
  Bell,
  CreditCard,
  Globe,
  Loader2,
  Save,
  RefreshCw,
  RotateCcw,
  Plus
} from 'lucide-react';

interface UserProfile {
  full_name?: string;
  email?: string;
  phone?: string;
  business_name?: string;
  industry?: string;
  location?: string;
  website_url?: string;
  business_size?: string;
  years_in_business?: number;
}

interface BusinessSettings {
  company_name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface AIPreferences {
  frequency: string;
  focus_areas: string[];
  complexity: string;
  benchmarking: boolean;
  predictive: boolean;
  competitive: boolean;
  auto_insights: boolean;
  email_notifications: boolean;
}

interface NotificationSettings {
  email_recommendations: boolean;
  email_insights: boolean;
  email_reports: boolean;
  push_notifications: boolean;
  sms_alerts: boolean;
}

interface PrivacySettings {
  data_sharing: boolean;
  analytics_tracking: boolean;
  marketing_emails: boolean;
  third_party_integrations: boolean;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({});
  const [aiPreferences, setAiPreferences] = useState<AIPreferences>({
    frequency: 'daily',
    focus_areas: [],
    complexity: 'moderate',
    benchmarking: true,
    predictive: true,
    competitive: true,
    auto_insights: true,
    email_notifications: true
  });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_recommendations: true,
    email_insights: true,
    email_reports: false,
    push_notifications: true,
    sms_alerts: false
  });
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    data_sharing: false,
    analytics_tracking: true,
    marketing_emails: false,
    third_party_integrations: true
  });

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Load profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Load business settings
      const { data: business } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Load AI preferences
      const { data: ai } = await supabase
        .from('ai_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setUserProfile({
          full_name: profile.full_name || '',
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          business_name: profile.business_name || '',
          industry: profile.industry || '',
          location: profile.location || '',
          website_url: profile.website_url || '',
          business_size: profile.business_size || '',
          years_in_business: profile.years_in_business || 0
        });
      }

      if (business) {
        setBusinessSettings({
          company_name: business.company_name || '',
          email: business.email || '',
          phone: business.phone || '',
          address: business.address || ''
        });
      }

      if (ai) {
        setAiPreferences({
          frequency: ai.frequency || 'daily',
          focus_areas: ai.focus_areas || [],
          complexity: ai.complexity || 'moderate',
          benchmarking: ai.benchmarking !== false,
          predictive: ai.predictive !== false,
          competitive: ai.competitive !== false,
          auto_insights: true,
          email_notifications: true
        });
      }

    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfileSettings = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...userProfile,
          updated_at: new Date().toISOString()
        });

      toast({
        title: "Success",
        description: "Profile settings saved successfully"
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveBusinessSettings = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await supabase
        .from('business_settings')
        .upsert({
          user_id: user.id,
          ...businessSettings,
          updated_at: new Date().toISOString()
        });

      toast({
        title: "Success",
        description: "Business settings saved successfully"
      });
    } catch (error) {
      console.error('Error saving business settings:', error);
      toast({
        title: "Error",
        description: "Failed to save business settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveAISettings = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await supabase
        .from('ai_preferences')
        .upsert({
          user_id: user.id,
          frequency: aiPreferences.frequency,
          focus_areas: aiPreferences.focus_areas,
          complexity: aiPreferences.complexity,
          benchmarking: aiPreferences.benchmarking,
          predictive: aiPreferences.predictive,
          competitive: aiPreferences.competitive,
          preferences_data: JSON.stringify(aiPreferences),
          updated_at: new Date().toISOString()
        });

      toast({
        title: "Success",
        description: "AI preferences saved successfully"
      });
    } catch (error) {
      console.error('Error saving AI preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save AI preferences",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetSandboxData = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.functions.invoke('reset-user-data', {
        body: { userId: user.id }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your sandbox data has been reset successfully! You can now start fresh."
      });
    } catch (error) {
      console.error('Error resetting sandbox data:', error);
      toast({
        title: "Error",
        description: "Failed to reset sandbox data",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const populateSampleData = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.functions.invoke('populate-sample-data', {
        body: { userId: user.id }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sample data has been added to your account! Check your dashboard to see the new data."
      });
    } catch (error) {
      console.error('Error populating sample data:', error);
      toast({
        title: "Error",
        description: "Failed to populate sample data",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and business preferences
          </p>
        </div>
        <Button variant="outline" onClick={loadSettings}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
          <TabsTrigger value="profile" className="flex flex-col gap-1 p-3">
            <User className="w-4 h-4" />
            <span className="text-xs">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex flex-col gap-1 p-3">
            <Building className="w-4 h-4" />
            <span className="text-xs">Business</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex flex-col gap-1 p-3">
            <Brain className="w-4 h-4" />
            <span className="text-xs">AI & Insights</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex flex-col gap-1 p-3">
            <Bell className="w-4 h-4" />
            <span className="text-xs">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex flex-col gap-1 p-3">
            <Shield className="w-4 h-4" />
            <span className="text-xs">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex flex-col gap-1 p-3">
            <CreditCard className="w-4 h-4" />
            <span className="text-xs">Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={userProfile.full_name || ''}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={userProfile.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={userProfile.phone || ''}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={userProfile.location || ''}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State"
                  />
                </div>
              </div>
              <Button onClick={saveProfileSettings} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={userProfile.business_name || ''}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, business_name: e.target.value }))}
                    placeholder="Your business name"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select 
                    value={userProfile.industry || ''} 
                    onValueChange={(value) => setUserProfile(prev => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing & Pipefitting</SelectItem>
                      <SelectItem value="electrical">Electrical Services</SelectItem>
                      <SelectItem value="hvac">HVAC & Refrigeration</SelectItem>
                      <SelectItem value="construction">Construction & General Contracting</SelectItem>
                      <SelectItem value="landscaping">Landscaping & Lawn Care</SelectItem>
                      <SelectItem value="roofing">Roofing & Exterior</SelectItem>
                      <SelectItem value="flooring">Flooring & Tile</SelectItem>
                      <SelectItem value="painting">Painting & Decorating</SelectItem>
                      <SelectItem value="cleaning">Cleaning Services</SelectItem>
                      <SelectItem value="pest_control">Pest Control</SelectItem>
                      <SelectItem value="security">Security & Alarm Systems</SelectItem>
                      <SelectItem value="automotive">Automotive Services</SelectItem>
                      <SelectItem value="handyman">Handyman Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="business_size">Business Size</Label>
                  <Select 
                    value={userProfile.business_size || ''} 
                    onValueChange={(value) => setUserProfile(prev => ({ ...prev, business_size: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo (Just me)</SelectItem>
                      <SelectItem value="small">Small (2-10 employees)</SelectItem>
                      <SelectItem value="medium">Medium (11-50 employees)</SelectItem>
                      <SelectItem value="large">Large (50+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="years_in_business">Years in Business</Label>
                  <Input
                    id="years_in_business"
                    type="number"
                    value={userProfile.years_in_business || ''}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, years_in_business: parseInt(e.target.value) || 0 }))}
                    placeholder="5"
                  />
                </div>
                <div>
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    value={userProfile.website_url || ''}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, website_url: e.target.value }))}
                    placeholder="https://yourbusiness.com"
                  />
                </div>
                <div>
                  <Label htmlFor="company_address">Business Address</Label>
                  <Textarea
                    id="company_address"
                    value={businessSettings.address || ''}
                    onChange={(e) => setBusinessSettings(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main St, City, State 12345"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveProfileSettings} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Business Info
                </Button>
                <Button onClick={saveBusinessSettings} variant="outline" disabled={isSaving}>
                  Save Contact Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations & Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ai_frequency">Recommendation Frequency</Label>
                  <Select 
                    value={aiPreferences.frequency} 
                    onValueChange={(value) => setAiPreferences(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ai_complexity">Analysis Complexity</Label>
                  <Select 
                    value={aiPreferences.complexity} 
                    onValueChange={(value) => setAiPreferences(prev => ({ ...prev, complexity: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple (Quick insights)</SelectItem>
                      <SelectItem value="moderate">Moderate (Balanced analysis)</SelectItem>
                      <SelectItem value="advanced">Advanced (Deep dive)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>AI Features</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-normal">Benchmarking Analysis</Label>
                        <p className="text-xs text-muted-foreground">Compare your business to industry standards</p>
                      </div>
                      <Switch
                        checked={aiPreferences.benchmarking}
                        onCheckedChange={(checked) => setAiPreferences(prev => ({ ...prev, benchmarking: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-normal">Predictive Insights</Label>
                        <p className="text-xs text-muted-foreground">AI-powered business forecasting</p>
                      </div>
                      <Switch
                        checked={aiPreferences.predictive}
                        onCheckedChange={(checked) => setAiPreferences(prev => ({ ...prev, predictive: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-normal">Competitive Analysis</Label>
                        <p className="text-xs text-muted-foreground">Track competitors and market trends</p>
                      </div>
                      <Switch
                        checked={aiPreferences.competitive}
                        onCheckedChange={(checked) => setAiPreferences(prev => ({ ...prev, competitive: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-normal">Automatic Insights</Label>
                        <p className="text-xs text-muted-foreground">Generate insights automatically based on your data</p>
                      </div>
                      <Switch
                        checked={aiPreferences.auto_insights}
                        onCheckedChange={(checked) => setAiPreferences(prev => ({ ...prev, auto_insights: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={saveAISettings} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save AI Settings
              </Button>
            </CardContent>
          </Card>

          {/* Classroom Features */}
          <Card>
            <CardHeader>
              <CardTitle>Classroom & Learning Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Perfect for educational environments and practice scenarios.
              </p>
              
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">Reset My Sandbox</h4>
                      <p className="text-xs text-muted-foreground">
                        Clear all data and start fresh with a clean slate
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={resetSandboxData} 
                      disabled={isSaving}
                      className="text-destructive hover:text-destructive"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
                      Reset Data
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">Add Sample Data</h4>
                      <p className="text-xs text-muted-foreground">
                        Populate your account with realistic sample data for practice
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={populateSampleData} 
                      disabled={isSaving}
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                      Add Sample Data
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                <strong>Note:</strong> These tools are designed for educational and practice use. 
                Reset functionality allows you to start assignments fresh, while sample data 
                helps you explore features without manual data entry.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Email Recommendations</Label>
                    <p className="text-xs text-muted-foreground">Receive AI recommendations via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.email_recommendations}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, email_recommendations: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Business Insights</Label>
                    <p className="text-xs text-muted-foreground">Get weekly business health reports</p>
                  </div>
                  <Switch
                    checked={notificationSettings.email_insights}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, email_insights: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive urgent alerts and updates</p>
                  </div>
                  <Switch
                    checked={notificationSettings.push_notifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, push_notifications: checked }))}
                  />
                </div>
              </div>
              <Button onClick={() => toast({ title: "Settings saved", description: "Notification preferences updated" })}>
                <Save className="w-4 h-4 mr-2" />
                Save Notifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Analytics Tracking</Label>
                    <p className="text-xs text-muted-foreground">Help improve our services with usage analytics</p>
                  </div>
                  <Switch
                    checked={privacySettings.analytics_tracking}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, analytics_tracking: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Third-party Integrations</Label>
                    <p className="text-xs text-muted-foreground">Allow connections to external business tools</p>
                  </div>
                  <Switch
                    checked={privacySettings.third_party_integrations}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, third_party_integrations: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-normal">Marketing Communications</Label>
                    <p className="text-xs text-muted-foreground">Receive product updates and tips</p>
                  </div>
                  <Switch
                    checked={privacySettings.marketing_emails}
                    onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, marketing_emails: checked }))}
                  />
                </div>
              </div>
              <Button onClick={() => toast({ title: "Privacy settings saved", description: "Your preferences have been updated" })}>
                <Save className="w-4 h-4 mr-2" />
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription & Billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-accent/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Current Plan</span>
                  <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">Trial</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  You're currently on a free trial. Upgrade to unlock all features.
                </p>
                <Button>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;