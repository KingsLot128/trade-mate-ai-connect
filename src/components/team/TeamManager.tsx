
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarContent, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Search, Phone, Mail, Calendar, Star } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'off-duty' | 'vacation';
  rating: number;
  jobsCompleted: number;
  joinDate: string;
  certifications: string[];
}

const TeamManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample team data
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Mike Johnson',
      role: 'Senior Plumber',
      email: 'mike@company.com',
      phone: '(555) 123-4567',
      status: 'active',
      rating: 4.8,
      jobsCompleted: 245,
      joinDate: '2022-03-15',
      certifications: ['Master Plumber', 'Backflow Prevention']
    },
    {
      id: '2',
      name: 'Sarah Chen',
      role: 'Electrician',
      email: 'sarah@company.com',
      phone: '(555) 987-6543',
      status: 'active',
      rating: 4.9,
      jobsCompleted: 189,
      joinDate: '2023-01-10',
      certifications: ['Licensed Electrician', 'Solar Installation']
    },
    {
      id: '3',
      name: 'David Rodriguez',
      role: 'HVAC Technician',
      email: 'david@company.com',
      phone: '(555) 456-7890',
      status: 'vacation',
      rating: 4.7,
      jobsCompleted: 156,
      joinDate: '2022-08-22',
      certifications: ['EPA 608', 'Heat Pump Specialist']
    },
    {
      id: '4',
      name: 'Lisa Wang',
      role: 'Apprentice',
      email: 'lisa@company.com',
      phone: '(555) 321-6549',
      status: 'off-duty',
      rating: 4.5,
      jobsCompleted: 67,
      joinDate: '2023-09-01',
      certifications: ['First Aid', 'OSHA 10']
    }
  ];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.certifications.some(cert => cert.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      'off-duty': "bg-gray-100 text-gray-800",
      vacation: "bg-blue-100 text-blue-800"
    };
    
    return (
      <Badge className={variants[status]}>
        {status === 'off-duty' ? 'Off Duty' : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const activeMembers = teamMembers.filter(member => member.status === 'active').length;
  const avgRating = teamMembers.reduce((sum, member) => sum + member.rating, 0) / teamMembers.length;
  const totalJobs = teamMembers.reduce((sum, member) => sum + member.jobsCompleted, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
          <p className="text-muted-foreground">
            Manage your team members and track performance.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">Team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeMembers}</div>
            <p className="text-xs text-muted-foreground">On duty now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}⭐</div>
            <p className="text-xs text-muted-foreground">Customer satisfaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">Total this year</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search team members by name, role, or certifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(member.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span>{member.rating}⭐ rating • {member.jobsCompleted} jobs completed</span>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Certifications:</p>
                  <div className="flex flex-wrap gap-1">
                    {member.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t mt-4">
                <p className="text-sm text-muted-foreground">
                  Joined: {new Date(member.joinDate).toLocaleDateString()}
                </p>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600">
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;
