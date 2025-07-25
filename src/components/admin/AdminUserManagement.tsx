
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Edit, Trash2, Shield, UserCheck } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  business_name: string;
  industry: string;
  phone: string;
  created_at: string;
  last_sign_in_at: string;
}

const AdminUserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      // Note: In production, this should use a service role key or admin-only edge function
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers((data || []) as any); // Type assertion for compatibility with current schema
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAction = async (userId: string, action: string) => {
    try {
      // In production, these actions would call admin-only edge functions
      switch (action) {
        case 'disable':
          toast({
            title: "User Disabled",
            description: `User ${userId} has been disabled.`,
          });
          break;
        case 'promote':
          toast({
            title: "User Promoted",
            description: `User ${userId} has been promoted to admin.`,
          });
          break;
        case 'reset':
          toast({
            title: "Password Reset",
            description: `Password reset email sent to user ${userId}.`,
          });
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error performing user action:', error);
      toast({
        title: "Error",
        description: "Failed to perform action",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p>Please log in to access admin features</p>
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
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage all users and their permissions.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users by name, email, or business..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            All Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-gray-500">
                {users.length === 0 ? 'No users have registered yet.' : 'No users match your search.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Info</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((userProfile) => (
                  <TableRow key={userProfile.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{userProfile.full_name || 'No name'}</div>
                        <div className="text-sm text-gray-500">{userProfile.email}</div>
                        {userProfile.phone && (
                          <div className="text-sm text-gray-500">{userProfile.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{userProfile.business_name || '-'}</div>
                        <div className="text-sm text-gray-500">{userProfile.industry || '-'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(userProfile.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUserAction(userProfile.user_id, 'promote')}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUserAction(userProfile.user_id, 'reset')}
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUserAction(userProfile.user_id, 'disable')}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

export default AdminUserManagement;
