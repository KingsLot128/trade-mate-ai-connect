import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { initializeTracking, trackRecommendationView } from '@/utils/dataTracking';
import {
  Camera,
  Building,
  MapPin,
  Globe,
  Share,
  Download,
  RefreshCw,
  Search,
  Loader2,
  User,
  Settings,
  Eye,
  Shield,
  CreditCard
} from 'lucide-react';

interface UserProfileData {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  business_name?: string;
  industry?: string;
  location?: string;
  website_url?: string;
  years_in_business?: number;
  business_size?: string;
  primary_goal?: string;
  biggest_challenge?: string;
  target_revenue?: string;
  photo_url?: string;
  business_health_score?: number;
  business_level?: number;
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
}

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [aiPreferences, setAiPreferences] = useState<AIPreferences>({
    frequency: 'daily',
    focus_areas: [],
    complexity: 'moderate',
    benchmarking: true,
    predictive: true,
    competitive: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
      initializeTracking(user.id);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Load profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Load business settings
      const { data: settings } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Load AI preferences (if exists)
      const { data: preferences } = await supabase
        .from('ai_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setUserProfile(profile);
      setBusinessSettings(settings);
      setWebsiteUrl(profile?.website_url || '');

      if (preferences) {
        setAiPreferences({
          frequency: preferences.frequency || 'daily',
          focus_areas: preferences.focus_areas || [],
          complexity: preferences.complexity || 'moderate',
          benchmarking: preferences.benchmarking !== false,
          predictive: preferences.predictive !== false,
          competitive: preferences.competitive !== false
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (updatedProfile: Partial<UserProfileData>) => {
    if (!user) return;

    setIsSaving(true);
    try {
      await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('user_id', user.id);

      setUserProfile(prev => ({ ...prev, ...updatedProfile } as UserProfileData));

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveBusinessSettings = async (updatedSettings: Partial<BusinessSettings>) => {
    if (!user) return;

    setIsSaving(true);
    try {
      await supabase
        .from('business_settings')
        .update(updatedSettings)
        .eq('user_id', user.id);

      setBusinessSettings(prev => ({ ...prev, ...updatedSettings } as BusinessSettings));

      toast({
        title: "Success",
        description: "Business settings updated successfully"
      });
    } catch (error) {
      console.error('Error saving business settings:', error);
      toast({
        title: "Error",
        description: "Failed to update business settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveAIPreferences = async () => {
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
          preferences_data: JSON.stringify(aiPreferences)
        });

      toast({
        title: "Success",
        description: "AI preferences updated successfully"
      });
    } catch (error) {
      console.error('Error saving AI preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update AI preferences",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleWebsiteAnalysis = async () => {
    if (!websiteUrl) return;

    setIsAnalyzing(true);
    try {
      // Track user action
      await trackRecommendationView('website_analysis', { website_url: websiteUrl });

      // Simulate analysis (you can implement actual analysis later)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update profile with website URL
      await saveProfile({ website_url: websiteUrl });

      toast({
        title: "Website Analysis Complete",
        description: "Your website has been analyzed and insights are being generated"
      });
    } catch (error) {
      console.error('Website analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze website",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                {userProfile?.photo_url ? (
                  <img 
                    src={userProfile.photo_url} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl lg:text-2xl font-bold">
                    {getInitials(userProfile?.business_name || userProfile?.full_name)}
                  </span>
                )}
              </div>
              <Button 
                size="sm"
                variant="outline"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full p-0 bg-background"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            {/* Business Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {businessSettings?.company_name || userProfile?.business_name || 'Your Business'}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                {userProfile?.industry && (
                  <span className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {userProfile.industry}
                  </span>
                )}
                {userProfile?.location && (
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {userProfile.location}
                  </span>
                )}
                {userProfile?.website_url && (
                  <span className="flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    Website Added
                  </span>
                )}
              </div>
              
              {/* Business Health Score */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-muted rounded-full mr-2">
                    <div 
                      className="h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                      style={{ width: `${userProfile?.business_health_score || 75}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {userProfile?.business_health_score || 75}% Health Score
                  </span>
                </div>
                <Badge variant="secondary">
                  Level {userProfile?.business_level || 1}
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col lg:flex-row gap-2">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
          <TabsTrigger value="overview" className="flex flex-col gap-1 p-3">
            <User className="w-4 h-4" />
            <span className="text-xs">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex flex-col gap-1 p-3">
            <Building className="w-4 h-4" />
            <span className="text-xs">Business</span>
          </TabsTrigger>
          <TabsTrigger value="website" className="flex flex-col gap-1 p-3">
            <Globe className="w-4 h-4" />
            <span className="text-xs">Website</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex flex-col gap-1 p-3">
            <Settings className="w-4 h-4" />
            <span className="text-xs">AI Settings</span>
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

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={userProfile?.full_name || ''}
                  onChange={(e) => setUserProfile(prev => ({ ...prev!, full_name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={userProfile?.email || user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={userProfile?.phone || ''}
                  onChange={(e) => setUserProfile(prev => ({ ...prev!, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="md:col-span-2">
                <Button 
                  onClick={() => saveProfile({
                    full_name: userProfile?.full_name,
                    phone: userProfile?.phone
                  })}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Business Information
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Redo Setup
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  value={userProfile?.business_name || ''}
                  onChange={(e) => setUserProfile(prev => ({ ...prev!, business_name: e.target.value }))}
                  placeholder="Your business name"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select 
                  value={userProfile?.industry || ''} 
                  onValueChange={(value) => setUserProfile(prev => ({ ...prev!, industry: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="landscaping">Landscaping</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="business_size">Business Size</Label>
                <Select 
                  value={userProfile?.business_size || ''} 
                  onValueChange={(value) => setUserProfile(prev => ({ ...prev!, business_size: value }))}
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
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={userProfile?.location || ''}
                  onChange={(e) => setUserProfile(prev => ({ ...prev!, location: e.target.value }))}
                  placeholder="City, State"
                />
              </div>
              <div>
                <Label htmlFor="primary_goal">Primary Goal</Label>
                <Select 
                  value={userProfile?.primary_goal || ''} 
                  onValueChange={(value) => setUserProfile(prev => ({ ...prev!, primary_goal: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase_revenue">Increase Revenue</SelectItem>
                    <SelectItem value="improve_efficiency">Improve Efficiency</SelectItem>
                    <SelectItem value="expand_team">Expand Team</SelectItem>
                    <SelectItem value="better_customers">Get Better Customers</SelectItem>
                    <SelectItem value="work_life_balance">Improve Work-Life Balance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="target_revenue">Target Annual Revenue</Label>
                <Input
                  id="target_revenue"
                  value={userProfile?.target_revenue || ''}
                  onChange={(e) => setUserProfile(prev => ({ ...prev!, target_revenue: e.target.value }))}
                  placeholder="$500,000"
                />
              </div>
              <div className="md:col-span-2">
                <Button 
                  onClick={() => saveProfile({
                    business_name: userProfile?.business_name,
                    industry: userProfile?.industry,
                    business_size: userProfile?.business_size,
                    location: userProfile?.location,
                    primary_goal: userProfile?.primary_goal,
                    target_revenue: userProfile?.target_revenue
                  })}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Business Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="website" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="website_url">Website URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="website_url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleWebsiteAnalysis}
                      disabled={!websiteUrl || isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    We'll analyze your website for SEO, design, and conversion opportunities
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Recommendation Frequency</Label>
                <Select 
                  value={aiPreferences.frequency} 
                  onValueChange={(value) => setAiPreferences(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily (5-7 recommendations)</SelectItem>
                    <SelectItem value="weekly">Weekly (10-15 recommendations)</SelectItem>
                    <SelectItem value="on_demand">On Demand Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Focus Areas</Label>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {[
                    'Revenue Growth', 'Operational Efficiency', 'Customer Acquisition',
                    'Team Management', 'Financial Health', 'Marketing & Sales'
                  ].map(area => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox 
                        id={area}
                        checked={aiPreferences.focus_areas?.includes(area)}
                        onCheckedChange={(checked) => {
                          const areas = checked 
                            ? [...(aiPreferences.focus_areas || []), area]
                            : aiPreferences.focus_areas?.filter(a => a !== area) || [];
                          setAiPreferences(prev => ({ ...prev, focus_areas: areas }));
                        }}
                      />
                      <Label htmlFor={area} className="text-sm">{area}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Implementation Complexity</Label>
                <RadioGroup 
                  value={aiPreferences.complexity} 
                  onValueChange={(value) => setAiPreferences(prev => ({ ...prev, complexity: value }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="simple" id="simple" />
                    <Label htmlFor="simple">Simple (Quick wins, minimal setup)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate (Balanced effort and impact)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Advanced (Complex strategies, high impact)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Industry Benchmarking</Label>
                    <p className="text-sm text-muted-foreground">Compare your performance with similar businesses</p>
                  </div>
                  <Switch 
                    checked={aiPreferences.benchmarking}
                    onCheckedChange={(checked) => setAiPreferences(prev => ({ ...prev, benchmarking: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Predictive Analytics</Label>
                    <p className="text-sm text-muted-foreground">Get forecasts and trend predictions</p>
                  </div>
                  <Switch 
                    checked={aiPreferences.predictive}
                    onCheckedChange={(checked) => setAiPreferences(prev => ({ ...prev, predictive: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Competitive Intelligence</Label>
                    <p className="text-sm text-muted-foreground">Insights about market trends and opportunities</p>
                  </div>
                  <Switch 
                    checked={aiPreferences.competitive}
                    onCheckedChange={(checked) => setAiPreferences(prev => ({ ...prev, competitive: checked }))}
                  />
                </div>
              </div>

              <Button onClick={saveAIPreferences} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save AI Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Manage how your data is used and stored in the TradeMate AI system.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Data Collection</h4>
                  <p className="text-sm text-muted-foreground">
                    We collect business data to improve AI recommendations and provide better insights.
                    All data is encrypted and stored securely.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Manage your subscription and billing information.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Current Plan</h4>
                  <p className="text-sm text-muted-foreground">
                    Professional Plan - Active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;