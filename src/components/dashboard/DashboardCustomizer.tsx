import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings,
  Eye,
  EyeOff,
  RotateCcw,
  Monitor,
  BarChart3,
  Zap,
  Target,
  User,
  UserCheck,
  Crown,
  Briefcase
} from "lucide-react";
import { useDashboard } from '@/contexts/DashboardContext';

const DashboardCustomizer = () => {
  const { 
    preferences, 
    availableWidgets, 
    toggleWidget, 
    resetToDefaults, 
    setDashboardRole,
    updatePreferences
  } = useDashboard();
  
  const [open, setOpen] = useState(false);

  if (!preferences) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'metrics': return <BarChart3 className="h-4 w-4" />;
      case 'charts': return <Monitor className="h-4 w-4" />;
      case 'actions': return <Zap className="h-4 w-4" />;
      case 'insights': return <Target className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'executive': return <Crown className="h-4 w-4" />;
      case 'analyst': return <BarChart3 className="h-4 w-4" />;
      case 'operator': return <Briefcase className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'executive': return 'High-level metrics, revenue focus, strategic insights';
      case 'analyst': return 'Detailed analytics, performance tracking, data-driven insights';
      case 'operator': return 'Operational metrics, daily tasks, efficiency tracking';
      default: return 'Balanced view with essential business metrics and recommendations';
    }
  };

  const widgetsByCategory = availableWidgets.reduce((acc, widget) => {
    if (!acc[widget.category]) acc[widget.category] = [];
    acc[widget.category].push(widget);
    return acc;
  }, {} as Record<string, typeof availableWidgets>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Customize Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Dashboard Customization
          </DialogTitle>
          <DialogDescription>
            Personalize your dashboard layout, widgets, and role-based views
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="widgets" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="role">Role & Layout</TabsTrigger>
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            <TabsTrigger value="theme">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="widgets" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Widget Management</h3>
                <p className="text-sm text-muted-foreground">
                  Show or hide dashboard widgets based on your needs
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>

            <div className="space-y-6">
              {Object.entries(widgetsByCategory).map(([category, widgets]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <h4 className="font-medium capitalize">{category}</h4>
                    <Badge variant="secondary">{widgets.length}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {widgets.map((widget) => {
                      const isActive = preferences.active_widgets.includes(widget.id);
                      
                      return (
                        <Card key={widget.id} className={`cursor-pointer transition-all ${
                          isActive ? 'ring-2 ring-primary' : 'opacity-70'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-medium text-sm">{widget.name}</h5>
                                  {widget.requiredRole && (
                                    <Badge variant="outline" className="text-xs">
                                      {widget.requiredRole.join(', ')}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {widget.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {isActive ? (
                                  <Eye className="h-4 w-4 text-green-600" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                )}
                                <Switch
                                  checked={isActive}
                                  onCheckedChange={() => toggleWidget(widget.id)}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="role" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Dashboard Role</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose your role to get a customized dashboard experience
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'default', label: 'Default User', icon: User },
                  { value: 'executive', label: 'Executive', icon: Crown },
                  { value: 'analyst', label: 'Business Analyst', icon: BarChart3 },
                  { value: 'operator', label: 'Operations Manager', icon: Briefcase }
                ].map((role) => {
                  const isSelected = preferences.dashboard_role === role.value;
                  
                  return (
                    <Card 
                      key={role.value}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setDashboardRole(role.value as any)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <role.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{role.label}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {getRoleDescription(role.value)}
                            </p>
                            {isSelected && (
                              <Badge className="mt-2" variant="default">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Layout Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="lg-columns">Large Screen Columns</Label>
                  <Select
                    value={preferences.layout_config.columns?.lg?.toString() || '3'}
                    onValueChange={(value) => updatePreferences({
                      layout_config: {
                        ...preferences.layout_config,
                        columns: { ...preferences.layout_config.columns, lg: parseInt(value) }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Columns</SelectItem>
                      <SelectItem value="3">3 Columns</SelectItem>
                      <SelectItem value="4">4 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="md-columns">Medium Screen Columns</Label>
                  <Select
                    value={preferences.layout_config.columns?.md?.toString() || '2'}
                    onValueChange={(value) => updatePreferences({
                      layout_config: {
                        ...preferences.layout_config,
                        columns: { ...preferences.layout_config.columns, md: parseInt(value) }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Column</SelectItem>
                      <SelectItem value="2">2 Columns</SelectItem>
                      <SelectItem value="3">3 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="sm-columns">Small Screen Columns</Label>
                  <Select
                    value={preferences.layout_config.columns?.sm?.toString() || '1'}
                    onValueChange={(value) => updatePreferences({
                      layout_config: {
                        ...preferences.layout_config,
                        columns: { ...preferences.layout_config.columns, sm: parseInt(value) }
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Column</SelectItem>
                      <SelectItem value="2">2 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Quick Actions</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Customize your quick action buttons for faster navigation
              </p>
              
              <div className="space-y-3">
                {preferences.quick_actions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span className="font-medium">{action.name}</span>
                      <Badge variant="outline">{action.url}</Badge>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                Add Custom Action
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Dashboard Theme</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Customize the appearance and color scheme
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['default', 'executive', 'minimal'].map((theme) => (
                  <Card 
                    key={theme}
                    className={`cursor-pointer ${
                      preferences.color_theme === theme ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => updatePreferences({ color_theme: theme })}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded mb-2"></div>
                      <p className="font-medium capitalize">{theme}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={() => setOpen(false)}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardCustomizer;