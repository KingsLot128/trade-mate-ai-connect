import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, Plus, Search, Clock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Call {
  id: string;
  customerName: string;
  phone: string;
  duration: string;
  status: 'completed' | 'missed' | 'scheduled';
  timestamp: string;
  notes?: string;
}

const CallsManager = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [calls] = useState<Call[]>([
    {
      id: '1',
      customerName: 'John Smith',
      phone: '(555) 123-4567',
      duration: '12:34',
      status: 'completed',
      timestamp: '2024-01-15 10:30 AM',
      notes: 'Kitchen renovation inquiry - Follow up needed'
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      phone: '(555) 987-6543',
      duration: '0:00',
      status: 'missed',
      timestamp: '2024-01-15 09:15 AM'
    },
    {
      id: '3',
      customerName: 'Mike Wilson',
      phone: '(555) 456-7890',
      duration: 'Scheduled',
      status: 'scheduled',
      timestamp: '2024-01-16 2:00 PM',
      notes: 'Bathroom remodel estimate'
    }
  ]);

  const filteredCalls = calls.filter(call =>
    call.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Call Management</h1>
          <p className="text-muted-foreground">
            Track and manage your customer communications
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log Call
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search calls by name or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline">Today: 3</Badge>
              <Badge variant="outline">Missed: 1</Badge>
              <Badge variant="outline">Scheduled: 1</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calls List */}
      <div className="space-y-4">
        {filteredCalls.map((call) => (
          <Card key={call.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{call.customerName}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{call.phone}</span>
                      <Clock className="h-3 w-3 ml-2" />
                      <span>{call.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{call.duration}</div>
                    <Badge className={getStatusColor(call.status)} variant="outline">
                      {call.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                </div>
              </div>

              {call.notes && (
                <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                  <strong>Notes:</strong> {call.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCalls.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Phone className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No calls found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search terms' : 'Start logging your customer calls to track communications'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CallsManager;