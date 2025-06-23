
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin, Plus, Filter } from "lucide-react";

interface Appointment {
  id: string;
  title: string;
  customer: string;
  technician: string;
  scheduledTime: string;
  duration: number;
  location: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  description: string;
}

const ScheduleManager = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Sample appointments data
  const appointments: Appointment[] = [
    {
      id: '1',
      title: 'Kitchen Sink Repair',
      customer: 'Sarah Johnson',
      technician: 'Mike Johnson',
      scheduledTime: '2024-01-15T09:00:00',
      duration: 90,
      location: '123 Main St, Anytown',
      status: 'confirmed',
      priority: 'medium',
      description: 'Leaking kitchen sink faucet needs replacement'
    },
    {
      id: '2',
      title: 'Emergency Burst Pipe',
      customer: 'David Chen',
      technician: 'Sarah Chen',
      scheduledTime: '2024-01-15T11:30:00',
      duration: 120,
      location: '456 Oak Ave, Anytown',
      status: 'in-progress',
      priority: 'emergency',
      description: 'Burst pipe in basement flooding issue'
    },
    {
      id: '3',
      title: 'AC Maintenance',
      customer: 'Lisa Rodriguez',
      technician: 'David Rodriguez',
      scheduledTime: '2024-01-15T14:00:00',
      duration: 60,
      location: '789 Pine St, Anytown',
      status: 'scheduled',
      priority: 'low',
      description: 'Routine AC system maintenance and filter change'
    },
    {
      id: '4',
      title: 'Electrical Outlet Installation',
      customer: 'Mark Wilson',
      technician: 'Lisa Wang',
      scheduledTime: '2024-01-15T16:30:00',
      duration: 45,
      location: '321 Elm Dr, Anytown',
      status: 'scheduled',
      priority: 'medium',
      description: 'Install 3 new electrical outlets in home office'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      scheduled: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      'in-progress': "bg-yellow-100 text-yellow-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      emergency: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={variants[priority]} variant="outline">
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const todayAppointments = appointments.filter(apt => 
    apt.scheduledTime.split('T')[0] === selectedDate
  ).sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());

  const stats = {
    total: todayAppointments.length,
    confirmed: todayAppointments.filter(apt => apt.status === 'confirmed').length,
    inProgress: todayAppointments.filter(apt => apt.status === 'in-progress').length,
    completed: todayAppointments.filter(apt => apt.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Schedule Management</h2>
          <p className="text-muted-foreground">
            Manage appointments and technician schedules.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Schedule Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Jobs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Scheduled appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">Ready to go</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Finished today</p>
          </CardContent>
        </Card>
      </div>

      {/* Date Selector */}
      <div className="flex items-center space-x-4">
        <label htmlFor="date" className="text-sm font-medium">View schedule for:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {todayAppointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No appointments scheduled</h3>
              <p className="text-muted-foreground mb-4 text-center max-w-sm">
                No appointments found for {new Date(selectedDate).toLocaleDateString()}.
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Schedule First Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          todayAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-lg">{appointment.title}</CardTitle>
                      {getPriorityBadge(appointment.priority)}
                      {getStatusBadge(appointment.status)}
                    </div>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(appointment.scheduledTime)} ({appointment.duration} min)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{appointment.customer} • {appointment.technician}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{appointment.location}</span>
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">{appointment.description}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="space-x-2">
                    {appointment.status === 'scheduled' && (
                      <Button variant="outline" size="sm">
                        Confirm
                      </Button>
                    )}
                    {appointment.status === 'confirmed' && (
                      <Button variant="outline" size="sm">
                        Start Job
                      </Button>
                    )}
                    {appointment.status === 'in-progress' && (
                      <Button variant="outline" size="sm">
                        Complete
                      </Button>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600">
                      View Details
                    </Button>
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

export default ScheduleManager;
