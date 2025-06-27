
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Phone, Plus, Clock, User } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AutomationEvent {
  id: string;
  event_type: string;
  event_data: any;
  processed: boolean;
  processed_at: string | null;
  created_at: string;
}

const CallsLog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<AutomationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('automation_events')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching automation events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch call events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTestCall = async () => {
    try {
      const testEvent = {
        user_id: user?.id,
        event_type: 'incoming_call',
        event_data: {
          phone_number: '+1 (555) 123-4567',
          duration: '5:32',
          caller_name: 'John Smith',
          call_status: 'answered',
          ai_summary: 'Customer called regarding tile installation quote for bathroom renovation project.'
        },
        processed: false
      };

      const { error } = await supabase
        .from('automation_events')
        .insert([testEvent]);

      if (error) throw error;

      toast({
        title: "Test Call Added",
        description: "A test call entry has been added to your log.",
      });

      fetchEvents(); // Refresh the list
    } catch (error) {
      console.error('Error adding test call:', error);
      toast({
        title: "Error",
        description: "Failed to add test call",
        variant: "destructive",
      });
    }
  };

  const getEventBadge = (eventType: string) => {
    const colors = {
      incoming_call: "bg-blue-100 text-blue-800",
      outgoing_call: "bg-green-100 text-green-800",
      missed_call: "bg-red-100 text-red-800",
      voicemail: "bg-yellow-100 text-yellow-800"
    };
    
    return (
      <Badge className={colors[eventType as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {eventType.replace('_', ' ')}
      </Badge>
    );
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p>Please log in to view calls</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Call Log</h2>
          <p className="text-muted-foreground">
            Track all your call activity and AI-powered interactions.
          </p>
        </div>
        <Button 
          onClick={addTestCall}
          className="bg-gradient-to-r from-blue-600 to-green-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Test Call
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="h-5 w-5 mr-2" />
            Recent Activity ({events.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No call activity yet</h3>
              <p className="text-gray-500 mb-4">
                Your AI assistant will automatically log all call activities here.
              </p>
              <Button 
                onClick={addTestCall}
                className="bg-gradient-to-r from-blue-600 to-green-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Test Call
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      {getEventBadge(event.event_type)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {event.event_data?.phone_number || 'Unknown Number'}
                        </div>
                        {event.event_data?.caller_name && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {event.event_data.caller_name}
                          </div>
                        )}
                        {event.event_data?.duration && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.event_data.duration}
                          </div>
                        )}
                        {event.event_data?.ai_summary && (
                          <div className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                            <strong>AI Summary:</strong> {event.event_data.ai_summary}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={event.processed ? "default" : "secondary"}>
                        {event.processed ? "Processed" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(event.created_at).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CallsLog;
