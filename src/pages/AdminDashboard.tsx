import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Search,
  Calendar,
  Activity,
  Ban,
  UserCheck
} from 'lucide-react';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  business_name: string;
  industry: string;
  account_status: 'active' | 'suspended' | 'deactivated';
  created_at: string;
  last_login_at: string | null;
  trial_ends_at: string | null;
  suspended_at: string | null;
  suspension_reason: string | null;
  business_health_score: number;
  profile_completeness: number;
}

interface AdminActivity {
  id: string;
  action_type: string;
  action_details: any;
  created_at: string;
  target_user_id: string;
  target_user_email: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    trialUsers: 0
  });

  useEffect(() => {
    if (user?.email === 'kingslotenterprises@gmail.com') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load all user profiles with auth data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Transform data to match our interface with proper type casting
      const usersData: UserProfile[] = profiles?.map(profile => ({
        ...profile,
        account_status: profile.account_status as 'active' | 'suspended' | 'deactivated' || 'active',
        profile_completeness: profile.business_health_score || 0,
        full_name: profile.full_name || '',
        email: profile.email || '',
        business_name: profile.business_name || '',
        industry: profile.industry || '',
        created_at: profile.created_at || new Date().toISOString(),
        last_login_at: profile.last_login_at || null,
        trial_ends_at: profile.trial_ends_at || null,
        suspended_at: profile.suspended_at || null,
        suspension_reason: profile.suspension_reason || null,
        business_health_score: profile.business_health_score || 0
      })) || [];

      setUsers(usersData);

      // Calculate stats
      const totalUsers = usersData.length;
      const activeUsers = usersData.filter(u => u.account_status === 'active').length;
      const suspendedUsers = usersData.filter(u => u.account_status === 'suspended').length;
      const trialUsers = usersData.filter(u => u.trial_ends_at && new Date(u.trial_ends_at) > new Date()).length;

      setStats({ totalUsers, activeUsers, suspendedUsers, trialUsers });

      // Load recent admin activities (simplified query without join)
      const { data: activityData, error: activityError } = await supabase
        .from('admin_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (activityError) console.warn('Could not load activities:', activityError);

      // Get target user emails separately
      const activitiesWithEmails: AdminActivity[] = [];
      if (activityData) {
        for (const activity of activityData) {
          let targetUserEmail = 'Unknown';
          if (activity.target_user_id) {
            const targetUser = usersData.find(u => u.user_id === activity.target_user_id);
            targetUserEmail = targetUser?.email || 'Unknown';
          }
          
          activitiesWithEmails.push({
            ...activity,
            target_user_email: targetUserEmail
          });
        }
      }

      setActivities(activitiesWithEmails);

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error loading admin data",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'deactivate') => {
    if (!selectedUser) return;

    try {
      const updates: any = {
        account_status: action === 'activate' ? 'active' : action,
        suspended_at: action === 'suspend' ? new Date().toISOString() : null,
        suspended_by: action === 'suspend' ? user?.id : null,
        suspension_reason: action === 'suspend' ? suspensionReason : null
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: `User ${action}d successfully`,
        description: `${selectedUser.email} has been ${action}d`,
      });

      // Reload data
      loadAdminData();
      setSelectedUser(null);
      setSuspensionReason('');

    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast({
        title: `Error ${action}ing user`,
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'suspended':
        return <Badge variant="destructive"><Ban className="h-3 w-3 mr-1" />Suspended</Badge>;
      case 'deactivated':
        return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />Deactivated</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.account_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (user?.email !== 'kingslotenterprises@gmail.com') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center py-8">
            <Shield className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground text-center">
              This page is only accessible to super administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users and monitor platform activity
          </p>
        </div>
        <Button onClick={loadAdminData} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Currently active accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.suspendedUsers}</div>
            <p className="text-xs text-muted-foreground">
              Suspended accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Users</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.trialUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active trial accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by email, name, or business..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="deactivated">Deactivated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Health Score</TableHead>
                  <TableHead>Trial Ends</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((userProfile) => (
                    <TableRow key={userProfile.user_id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{userProfile.full_name || 'Unnamed'}</span>
                          <span className="text-sm text-muted-foreground">{userProfile.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{userProfile.business_name || 'N/A'}</span>
                          <span className="text-sm text-muted-foreground">{userProfile.industry || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(userProfile.account_status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {userProfile.business_health_score || 0}/100
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {userProfile.trial_ends_at ? (
                          <span className="text-sm">
                            {format(new Date(userProfile.trial_ends_at), 'MMM dd, yyyy')}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {format(new Date(userProfile.created_at), 'MMM dd, yyyy')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedUser(userProfile)}
                            >
                              Manage
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Manage User: {userProfile.email}</DialogTitle>
                            </DialogHeader>
                            
                            <div className="space-y-6">
                              {/* User Details */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Full Name</Label>
                                  <p className="text-sm">{userProfile.full_name || 'Not provided'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Business Name</Label>
                                  <p className="text-sm">{userProfile.business_name || 'Not provided'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Industry</Label>
                                  <p className="text-sm">{userProfile.industry || 'Not provided'}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Current Status</Label>
                                  <div className="mt-1">{getStatusBadge(userProfile.account_status)}</div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Profile Completion</Label>
                                  <p className="text-sm">{userProfile.profile_completeness || 0}%</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Health Score</Label>
                                  <p className="text-sm">{userProfile.business_health_score || 0}/100</p>
                                </div>
                              </div>

                              {/* Suspension Details */}
                              {userProfile.account_status === 'suspended' && (
                                <div className="bg-red-50 p-4 rounded-lg">
                                  <h4 className="font-medium text-red-800 mb-2">Suspension Details</h4>
                                  <p className="text-sm text-red-700 mb-1">
                                    <strong>Suspended on:</strong> {userProfile.suspended_at ? format(new Date(userProfile.suspended_at), 'MMM dd, yyyy HH:mm') : 'Unknown'}
                                  </p>
                                  <p className="text-sm text-red-700">
                                    <strong>Reason:</strong> {userProfile.suspension_reason || 'No reason provided'}
                                  </p>
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="space-y-4">
                                {userProfile.account_status === 'active' && (
                                  <div>
                                    <Label htmlFor="suspensionReason">Suspension Reason</Label>
                                    <Textarea
                                      id="suspensionReason"
                                      placeholder="Enter reason for suspension..."
                                      value={suspensionReason}
                                      onChange={(e) => setSuspensionReason(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            <DialogFooter className="flex gap-2">
                              {userProfile.account_status === 'active' ? (
                                <Button
                                  variant="destructive"
                                  onClick={() => handleUserAction(userProfile.user_id, 'suspend')}
                                  disabled={!suspensionReason.trim()}
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Suspend User
                                </Button>
                              ) : (
                                <Button
                                  variant="default"
                                  onClick={() => handleUserAction(userProfile.user_id, 'activate')}
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activate User
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Admin Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Admin Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent activities</p>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">
                        {activity.action_type.replace('_', ' ').toUpperCase()} - {activity.target_user_email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action_details?.old_status && activity.action_details?.new_status && 
                          `Status changed from ${activity.action_details.old_status} to ${activity.action_details.new_status}`
                        }
                        {activity.action_details?.suspension_reason && 
                          ` • Reason: ${activity.action_details.suspension_reason}`
                        }
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(activity.created_at), 'MMM dd, HH:mm')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;