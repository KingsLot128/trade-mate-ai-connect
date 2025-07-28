import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Users, 
  Target,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface DataCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  requiredFor: string[];
  fields: DataField[];
  completeness: number;
  isUnlocked: boolean;
}

interface DataField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
  value?: string;
  placeholder?: string;
}

const ProgressiveDataCollection = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('financial');
  const [loading, setLoading] = useState(false);
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);
  const [dataCategories, setDataCategories] = useState<DataCategory[]>([
    {
      id: 'financial',
      name: 'Financial Intelligence',
      description: 'Revenue, expenses, and pricing data for better profit optimization',
      icon: <DollarSign className="h-5 w-5" />,
      requiredFor: ['revenue_optimization', 'pricing_strategy', 'profit_analysis'],
      completeness: 0,
      isUnlocked: true,
      fields: [
        { id: 'monthly_revenue', label: 'Average Monthly Revenue', type: 'number', required: true, placeholder: '25000' },
        { id: 'monthly_expenses', label: 'Average Monthly Expenses', type: 'number', required: true, placeholder: '18000' },
        { id: 'primary_revenue_sources', label: 'Primary Revenue Sources', type: 'textarea', required: true, placeholder: 'Service A, Product B, Consulting...' },
        { id: 'pricing_strategy', label: 'Current Pricing Strategy', type: 'select', required: true, options: ['Hourly Rate', 'Project-Based', 'Value-Based', 'Subscription', 'Mixed'] },
        { id: 'payment_terms', label: 'Payment Terms', type: 'select', required: false, options: ['Net 30', 'Net 15', 'Due on Receipt', 'Deposit + Final', '50/50 Split'] },
        { id: 'seasonal_patterns', label: 'Seasonal Revenue Patterns', type: 'textarea', required: false, placeholder: 'Describe how your revenue changes throughout the year...' }
      ]
    },
    {
      id: 'calling',
      name: 'Call Intelligence',
      description: 'Voice call patterns and customer communication data',
      icon: <Phone className="h-5 w-5" />,
      requiredFor: ['ai_calling', 'voice_insights', 'call_optimization'],
      completeness: 0,
      isUnlocked: false,
      fields: [
        { id: 'daily_call_volume', label: 'Average Daily Calls', type: 'number', required: true, placeholder: '15' },
        { id: 'call_duration_avg', label: 'Average Call Duration (minutes)', type: 'number', required: true, placeholder: '12' },
        { id: 'peak_call_hours', label: 'Peak Call Hours', type: 'select', required: true, options: ['8-10 AM', '10-12 PM', '12-2 PM', '2-4 PM', '4-6 PM', 'Evening'] },
        { id: 'call_types', label: 'Common Call Types', type: 'textarea', required: true, placeholder: 'Initial inquiries, follow-ups, service questions...' },
        { id: 'conversion_rate', label: 'Call-to-Sale Conversion Rate (%)', type: 'number', required: false, placeholder: '25' },
        { id: 'common_objections', label: 'Common Customer Objections', type: 'textarea', required: false, placeholder: 'Price concerns, timing issues, competition...' }
      ]
    },
    {
      id: 'operational',
      name: 'Operational Efficiency',
      description: 'Task management, time tracking, and process optimization data',
      icon: <Clock className="h-5 w-5" />,
      requiredFor: ['efficiency_optimization', 'time_management', 'process_improvement'],
      completeness: 0,
      isUnlocked: true,
      fields: [
        { id: 'avg_project_duration', label: 'Average Project Duration (days)', type: 'number', required: true, placeholder: '14' },
        { id: 'team_size', label: 'Team Size', type: 'number', required: true, placeholder: '3' },
        { id: 'peak_productivity_hours', label: 'Peak Productivity Hours', type: 'select', required: true, options: ['Early Morning', 'Mid Morning', 'Afternoon', 'Evening', 'Varies'] },
        { id: 'biggest_time_wasters', label: 'Biggest Time Wasters', type: 'textarea', required: true, placeholder: 'Excessive emails, unclear requirements, rework...' },
        { id: 'process_bottlenecks', label: 'Process Bottlenecks', type: 'textarea', required: false, placeholder: 'Approval delays, resource constraints, communication gaps...' },
        { id: 'automation_opportunities', label: 'Manual Tasks You\'d Like to Automate', type: 'textarea', required: false, placeholder: 'Scheduling, invoicing, follow-ups...' }
      ]
    },
    {
      id: 'customer',
      name: 'Customer Intelligence',
      description: 'Customer behavior, preferences, and journey optimization data',
      icon: <Users className="h-5 w-5" />,
      requiredFor: ['customer_optimization', 'retention_analysis', 'personalization'],
      completeness: 0,
      isUnlocked: true,
      fields: [
        { id: 'customer_acquisition_cost', label: 'Customer Acquisition Cost', type: 'number', required: true, placeholder: '150' },
        { id: 'customer_lifetime_value', label: 'Customer Lifetime Value', type: 'number', required: true, placeholder: '2500' },
        { id: 'preferred_communication', label: 'Customer Preferred Communication', type: 'select', required: true, options: ['Phone', 'Email', 'Text', 'In-Person', 'Mixed'] },
        { id: 'customer_pain_points', label: 'Common Customer Pain Points', type: 'textarea', required: true, placeholder: 'Long wait times, unclear pricing, complex processes...' },
        { id: 'retention_rate', label: 'Customer Retention Rate (%)', type: 'number', required: false, placeholder: '85' },
        { id: 'referral_rate', label: 'Customer Referral Rate (%)', type: 'number', required: false, placeholder: '30' }
      ]
    }
  ]);

  useEffect(() => {
    if (user) {
      loadUserData();
      checkEnabledFeatures();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      const { data: businessSettings } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      // Load existing data and calculate completeness
      updateDataCompleteness(profile, businessSettings);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const checkEnabledFeatures = async () => {
    // Check what features the user has enabled
    const features = ['ai_calling']; // This would be determined by user's subscription/settings
    setEnabledFeatures(features);
    
    // Unlock categories based on enabled features
    setDataCategories(prev => prev.map(category => ({
      ...category,
      isUnlocked: category.id === 'financial' || category.id === 'operational' || category.id === 'customer' || 
                  category.requiredFor.some(feature => features.includes(feature))
    })));
  };

  const updateDataCompleteness = (profile: any, businessSettings: any) => {
    setDataCategories(prev => prev.map(category => {
      const filledFields = category.fields.filter(field => {
        const value = profile?.[field.id] || businessSettings?.[field.id];
        return value && value !== '';
      });
      
      return {
        ...category,
        completeness: Math.round((filledFields.length / category.fields.length) * 100)
      };
    }));
  };

  const handleFieldUpdate = async (categoryId: string, fieldId: string, value: string) => {
    setDataCategories(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          fields: category.fields.map(field => 
            field.id === fieldId ? { ...field, value } : field
          )
        };
      }
      return category;
    }));
  };

  const saveCategory = async (categoryId: string) => {
    setLoading(true);
    try {
      const category = dataCategories.find(c => c.id === categoryId);
      if (!category) return;

      const dataToSave: any = {};
      category.fields.forEach(field => {
        if (field.value) {
          dataToSave[field.id] = field.value;
        }
      });

      // Save to appropriate table based on category
      const table = categoryId === 'financial' ? 'business_settings' : 'profiles';
      
      await supabase
        .from(table)
        .upsert({
          user_id: user?.id,
          ...dataToSave,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      toast.success(`${category.name} data saved successfully!`);
      loadUserData(); // Refresh completeness
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data');
    } finally {
      setLoading(false);
    }
  };

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 80) return 'text-green-600';
    if (completeness >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFeatureBenefits = (category: DataCategory) => {
    const benefits = {
      financial: ['Revenue optimization recommendations', 'Pricing strategy insights', 'Profit margin analysis'],
      calling: ['AI-powered call handling', 'Voice sentiment analysis', 'Call conversion optimization'],
      operational: ['Efficiency improvement plans', 'Time management insights', 'Process automation suggestions'],
      customer: ['Personalized customer strategies', 'Retention improvement plans', 'Customer journey optimization']
    };
    return benefits[category.id as keyof typeof benefits] || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Data Intelligence Center</h2>
          <p className="text-muted-foreground text-lg">
            Unlock better insights by providing additional business data
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {dataCategories.map((category) => (
          <Card key={category.id} className={`cursor-pointer transition-all ${
            activeCategory === category.id ? 'ring-2 ring-primary' : ''
          } ${!category.isUnlocked ? 'opacity-60' : ''}`}
          onClick={() => category.isUnlocked && setActiveCategory(category.id)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {category.icon}
                  {category.isUnlocked ? (
                    <Unlock className="h-4 w-4 text-green-600" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <Badge variant={category.completeness >= 80 ? 'default' : 'secondary'}>
                  {category.completeness}%
                </Badge>
              </div>
              <h3 className="font-medium text-sm mb-1">{category.name}</h3>
              <Progress value={category.completeness} className="h-2" />
              <p className={`text-xs mt-2 ${getCompletenessColor(category.completeness)}`}>
                {category.completeness >= 80 ? 'Excellent data quality' :
                 category.completeness >= 50 ? 'Good data coverage' : 'Basic data provided'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Data Collection */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-4">
          {dataCategories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              disabled={!category.isUnlocked}
              className="flex items-center space-x-2"
            >
              {category.icon}
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {dataCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      {category.icon}
                      <span>{category.name}</span>
                      <Badge variant={category.completeness >= 80 ? 'default' : 'secondary'}>
                        {category.completeness}% Complete
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {category.description}
                    </CardDescription>
                  </div>
                  {!category.isUnlocked && (
                    <Badge variant="outline" className="text-muted-foreground">
                      <Lock className="h-3 w-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              {category.isUnlocked ? (
                <CardContent className="space-y-6">
                  {/* Benefits Section */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-sm mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-2 text-green-600" />
                      Unlocked Insights & Features:
                    </h4>
                    <ul className="text-sm space-y-1">
                      {getFeatureBenefits(category).map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Data Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label className="flex items-center">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        
                        {field.type === 'text' && (
                          <Input
                            placeholder={field.placeholder}
                            value={field.value || ''}
                            onChange={(e) => handleFieldUpdate(category.id, field.id, e.target.value)}
                          />
                        )}
                        
                        {field.type === 'number' && (
                          <Input
                            type="number"
                            placeholder={field.placeholder}
                            value={field.value || ''}
                            onChange={(e) => handleFieldUpdate(category.id, field.id, e.target.value)}
                          />
                        )}
                        
                        {field.type === 'select' && (
                          <Select 
                            value={field.value || ''} 
                            onValueChange={(value) => handleFieldUpdate(category.id, field.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        
                        {field.type === 'textarea' && (
                          <Textarea
                            placeholder={field.placeholder}
                            value={field.value || ''}
                            onChange={(e) => handleFieldUpdate(category.id, field.id, e.target.value)}
                            rows={3}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => saveCategory(category.id)}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Data'}
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  <div className="text-center py-8">
                    <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Feature Required to Unlock</h3>
                    <p className="text-muted-foreground mb-4">
                      Enable {category.requiredFor.join(', ')} to unlock this data collection
                    </p>
                    <Button variant="outline">
                      View Available Features
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProgressiveDataCollection;