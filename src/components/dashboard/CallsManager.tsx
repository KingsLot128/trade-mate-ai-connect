
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneMissed, PhoneCall, Clock, User } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Call {
  id: string;
  phone_number: string;
  call_type: 'inbound' | 'outbound';
  status: 'answered' | 'missed' |

 'scheduled' | 'completed';
  duration: number;
  summary: string | null;
  transcript: string | null;
  ai_response: string | null;
  created_at: string;
  customer_id: string | null;
}

const CallsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalls = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('calls')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setCalls(data || []);
      } catch (error) {
        console.error('Error fetching calls:', error);
        toast({
          title: "Error",
          description: "Failed to fetch calls",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [user, toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <PhoneCall className="h-4 w-4 text-green-600" />;
      case 'missed':
        return <PhoneMissed className="h-4 w-4 text-red-600" />;
      default:
        return <Phone className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      answered: "default",
      missed: "destructive",
      scheduled: "secondary",
      completed: "outline"
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (phone: string) => {
    // Basic phone number formatting
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Calls</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calls</h2>
          <p className="text-muted-foreground">
            Manage and review all your call activity.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
          Add Test Call
        </Button>
      </div>

      <div className="space-y-4">
        {calls.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Phone className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No calls yet</h3>
              <p className="text-muted-foreground mb-4 text-center max-w-sm">
                Your AI assistant will automatically log all incoming and outgoing calls here.
              </p>
              <Button variant="outline">View Integration Guide</Button>
            </CardContent>
          </Card>
        ) : (
          calls.map((call) => (
            <Card key={call.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(call.status)}
                    <div>
                      <CardTitle className="text-lg">
                        {formatPhoneNumber(call.phone_number)}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <span>{call.call_type === 'inbound' ? 'Incoming' : 'Outgoing'}</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(call.duration)}</span>
                        <span>•</span>
                        <span>{new Date(call.created_at).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(call.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {call.summary && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">AI Summary</h4>
                    <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                      {call.summary}
                    </p>
                  </div>
                )}
                {call.ai_response && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">AI Response</h4>
                    <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
                      {call.ai_response}
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{call.customer_id ? 'Existing Customer' : 'New Caller'}</span>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {call.status === 'missed' && (
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600">
                        Follow Up
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CallsManager;
