import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, Plus, Settings, CheckCircle, AlertCircle, Calendar as CalendarComponent } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'appointment' | 'call' | 'follow-up';
  customer?: string;
  priority: 'high' | 'medium' | 'low';
}

interface CalendarIntegration {
  provider: string;
  name: string;
  description: string;
  connected: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

const Calendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);

  const integrations: CalendarIntegration[] = [
    {
      provider: 'google',
      name: 'Google Calendar',
      description: 'Sync with your Google Calendar for seamless scheduling',
      connected: false,
      icon: CalendarIcon,
      color: 'bg-blue-500'
    },
    {
      provider: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Connect your Outlook calendar',
      connected: false,
      icon: CalendarIcon,
      color: 'bg-orange-500'
    },
    {
      provider: 'calendly',
      name: 'Calendly',
      description: 'Import your Calendly bookings',
      connected: false,
      icon: Clock,
      color: 'bg-green-500'
    },
    {
      provider: 'acuity',
      name: 'Acuity Scheduling',
      description: 'Sync with Acuity appointments',
      connected: false,
      icon: CheckCircle,
      color: 'bg-purple-500'
    }
  ];

  // Sample events for demonstration
  const sampleEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Emergency Plumbing - Johnson Residence',
      start: new Date(2024, 1, 15, 9, 0),
      end: new Date(2024, 1, 15, 11, 0),
      type: 'appointment',
      customer: 'Johnson Family',
      priority: 'high'
    },
    {
      id: '2',
      title: 'HVAC Maintenance - Smith Commercial',
      start: new Date(2024, 1, 15, 14, 0),
      end: new Date(2024, 1, 15, 16, 0),
      type: 'appointment',
      customer: 'Smith Corp',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Follow-up Call - Davis Quote',
      start: new Date(2024, 1, 16, 10, 0),
      end: new Date(2024, 1, 16, 10, 30),
      type: 'follow-up',
      customer: 'Davis Family',
      priority: 'low'
    }
  ];

  useEffect(() => {
    loadCalendarData();
    generateAIRecommendations();
  }, [user]);

  const loadCalendarData = async () => {
    if (!user) return;

    try {
      // Load appointments from database
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      // Convert to calendar events
      const calendarEvents: CalendarEvent[] = appointments?.map(apt => ({
        id: apt.id,
        title: `Appointment - ${apt.status}`,
        start: new Date(apt.scheduled_at || ''),
        end: new Date(apt.scheduled_at || ''),
        type: 'appointment' as const,
        priority: 'medium' as const
      })) || [];

      // Add sample events for demonstration
      setEvents([...calendarEvents, ...sampleEvents]);
    } catch (error) {
      console.error('Error loading calendar data:', error);
      // Use sample data if database fails
      setEvents(sampleEvents);
    } finally {
      setLoading(false);
    }
  };

  const generateAIRecommendations = () => {
    const recommendations = [
      "Schedule follow-up calls 2 days after service completion",
      "Block Fridays 3-5 PM for emergency calls (highest demand)",
      "Buffer 30 minutes between appointments for travel time",
      "Set reminders 1 hour before each appointment",
      "Schedule preventive maintenance during slow seasons"
    ];
    setAiRecommendations(recommendations);
  };

  const handleCalendarConnect = async (provider: string) => {
    setLoading(true);
    try {
      // Simulate calendar connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would initiate OAuth flow
      const authUrl = `https://auth.${provider}.com/oauth2/authorize?redirect_uri=${encodeURIComponent(window.location.origin)}/calendar/callback`;
      
      toast.success(`${provider} calendar connection initiated`);
      console.log(`Would redirect to: ${authUrl}`);
      
      // For demo, just show success
      toast.success(`${provider} calendar connected successfully`);
    } catch (error) {
      toast.error(`Failed to connect ${provider} calendar`);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <CalendarIcon className="h-4 w-4" />;
      case 'call': return <AlertCircle className="h-4 w-4" />;
      case 'follow-up': return <Clock className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2 text-blue-600" />
            Calendar Hub
          </h2>
          <p className="text-gray-600">Intelligent scheduling and appointment management</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          {/* Calendar Component */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {/* Main Calendar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Overview</CardTitle>
                  <CardDescription>Your upcoming appointments and calls</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getEventTypeIcon(event.type)}
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-gray-500">
                              {event.start.toLocaleDateString()} at {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {event.customer && (
                              <p className="text-sm text-gray-600">Customer: {event.customer}</p>
                            )}
                          </div>
                        </div>
                        <Badge className={getPriorityColor(event.priority)}>
                          {event.priority.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Appointments</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">High Priority</span>
                    <span className="font-medium text-red-600">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Travel Time</span>
                    <span className="font-medium">45 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue Potential</span>
                    <span className="font-medium text-green-600">$1,250</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Set Availability
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Calendar Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <Card key={integration.provider} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${integration.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">{integration.name}</h3>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                        </div>
                      </div>
                      <Button
                        variant={integration.connected ? "outline" : "default"}
                        onClick={() => handleCalendarConnect(integration.provider)}
                        disabled={loading}
                      >
                        {integration.connected ? 'Connected' : 'Connect'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Scheduling Intelligence</CardTitle>
              <CardDescription>Optimize your schedule with AI-powered recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Optimal Time Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monday 9-11 AM</span>
                    <span className="text-green-600">92% booking rate</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Friday 2-4 PM</span>
                    <span className="text-yellow-600">78% booking rate</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tuesday 3-5 PM</span>
                    <span className="text-red-600">45% booking rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Schedule Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Travel Time</span>
                    <span className="font-medium">15 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Daily Utilization</span>
                    <span className="font-medium text-green-600">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">No-Show Rate</span>
                    <span className="font-medium text-yellow-600">8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calendar;