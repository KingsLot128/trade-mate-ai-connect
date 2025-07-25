
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhoneMissed, MessageSquare, Mail, Calendar, Clock } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MissedCall {
  id: string;
  phone_number: string;
  created_at: string;
  follow_up_sent: boolean;
  recovery_status: 'pending' | 'contacted' | 'scheduled' | 'lost';
}

const MissedCallRecovery = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [missedCalls, setMissedCalls] = useState<MissedCall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissedCalls();
  }, [user]);

  const fetchMissedCalls = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'missed')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setMissedCalls(data || []);
    } catch (error) {
      console.error('Error fetching missed calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFollowUp = async (callId: string, method: 'sms' | 'email') => {
    try {
      // In a real implementation, this would trigger an edge function
      // that sends SMS via Twilio or email via Resend
      
      const followUpMessages = {
        sms: "Hi! We missed your call. We'd love to help with your service needs. Reply with a good time to call you back, or visit our website to schedule online.",
        email: "Thank you for calling! We're sorry we missed you. We'd be happy to help with your service needs. Please reply with your availability or schedule online."
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the call record
      await supabase
        .from('calls')
        .update({ 
          follow_up_sent: true,
          ai_response: `Follow-up ${method} sent: ${followUpMessages[method]}`
        })
        .eq('id', callId);

      toast({
        title: "Follow-up Sent",
        description: `${method.toUpperCase()} follow-up sent successfully`,
      });

      fetchMissedCalls(); // Refresh the list
    } catch (error) {
      console.error('Error sending follow-up:', error);
      toast({
        title: "Error",
        description: "Failed to send follow-up",
        variant: "destructive",
      });
    }
  };

  const updateRecoveryStatus = async (callId: string, status: MissedCall['recovery_status']) => {
    try {
      await supabase
        .from('calls')
        .update({ recovery_status: status })
        .eq('id', callId);

      fetchMissedCalls();
      
      toast({
        title: "Status Updated",
        description: `Call marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PhoneMissed className="h-5 w-5 mr-2 text-red-600" />
            Missed Call Recovery
          </CardTitle>
          <CardDescription>
            Automatically follow up with missed calls to recover potential business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {missedCalls.filter(call => call.recovery_status === 'pending').length}
              </div>
              <div className="text-sm text-red-700">Pending Follow-up</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {missedCalls.filter(call => call.recovery_status === 'contacted').length}
              </div>
              <div className="text-sm text-blue-700">Follow-up Sent</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {missedCalls.filter(call => call.recovery_status === 'scheduled').length}
              </div>
              <div className="text-sm text-green-700">Recovered & Scheduled</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {missedCalls.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <PhoneMissed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Missed Calls</h3>
              <p className="text-gray-600">Great job! You're not missing any potential customers.</p>
            </CardContent>
          </Card>
        ) : (
          missedCalls.map((call) => (
            <Card key={call.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <PhoneMissed className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium">{formatPhoneNumber(call.phone_number)}</div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(call.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(call.recovery_status)}>
                      {call.recovery_status}
                    </Badge>
                  </div>
                </div>

                {call.recovery_status === 'pending' && (
                  <div className="mt-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendFollowUp(call.id, 'sms')}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Send SMS
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendFollowUp(call.id, 'email')}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Send Email
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateRecoveryStatus(call.id, 'contacted')}
                    >
                      Mark Contacted
                    </Button>
                  </div>
                )}

                {call.recovery_status === 'contacted' && (
                  <div className="mt-4 flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => updateRecoveryStatus(call.id, 'scheduled')}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Mark Scheduled
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateRecoveryStatus(call.id, 'lost')}
                    >
                      Mark Lost
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MissedCallRecovery;
