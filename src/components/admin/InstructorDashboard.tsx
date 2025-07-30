import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { UserPlus, Users, Eye, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Student {
  user_id: string;
  full_name: string;
  email: string;
  business_name: string;
  onboarding_step: string;
  chaos_score: number;
  created_at: string;
  last_login_at: string;
}

export const InstructorDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [createStudentOpen, setCreateStudentOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    full_name: '',
    email: '',
    business_name: '',
    password: ''
  });

  const fetchStudents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          full_name,
          email,
          business_name,
          onboarding_step,
          chaos_score,
          created_at,
          last_login_at
        `)
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async () => {
    if (!user) return;

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newStudent.email,
        password: newStudent.password,
        email_confirm: true,
        user_metadata: {
          full_name: newStudent.full_name,
          business_name: newStudent.business_name,
          created_by_instructor: true
        }
      });

      if (authError) throw authError;

      // Create profile with instructor link
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          email: newStudent.email,
          full_name: newStudent.full_name,
          business_name: newStudent.business_name,
          instructor_id: user.id,
          onboarding_step: 'not_started',
          account_status: 'active',
          subscription_status: 'trial'
        });

      if (profileError) throw profileError;

      // Assign user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: 'user'
        });

      if (roleError) throw roleError;

      toast.success('Student created successfully!');
      setCreateStudentOpen(false);
      setNewStudent({ full_name: '', email: '', business_name: '', password: '' });
      fetchStudents();
    } catch (error) {
      console.error('Error creating student:', error);
      toast.error('Failed to create student');
    }
  };

  const impersonateStudent = async (studentId: string) => {
    toast.info('Impersonation feature coming soon! For now, you can view student progress in the table.');
  };

  const resetStudentData = async (studentId: string) => {
    try {
      await supabase.functions.invoke('reset-user-data', {
        body: { userId: studentId }
      });
      toast.success('Student data reset successfully!');
      fetchStudents();
    } catch (error) {
      console.error('Error resetting student data:', error);
      toast.error('Failed to reset student data');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [user]);

  const getProgressBadge = (step: string) => {
    const stepMap = {
      'not_started': { label: 'Not Started', color: 'secondary' },
      'quiz_completed': { label: 'Quiz Done', color: 'default' },
      'profile_complete': { label: 'Profile Done', color: 'default' },
      'completed': { label: 'Completed', color: 'default' }
    };
    const config = stepMap[step as keyof typeof stepMap] || { label: step, color: 'secondary' };
    return <Badge variant={config.color as any}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Manage your students and track their progress</p>
        </div>
        <Dialog open={createStudentOpen} onOpenChange={setCreateStudentOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Student</DialogTitle>
              <DialogDescription>
                Add a new student to your classroom. They'll receive login credentials and can start the onboarding process.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={newStudent.full_name}
                  onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                  placeholder="Student's full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  placeholder="student@school.edu"
                />
              </div>
              <div>
                <Label htmlFor="business_name">Practice Business Name</Label>
                <Input
                  id="business_name"
                  value={newStudent.business_name}
                  onChange={(e) => setNewStudent({ ...newStudent, business_name: e.target.value })}
                  placeholder="e.g., Mike's Plumbing Service"
                />
              </div>
              <div>
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  placeholder="Temporary password for student"
                />
              </div>
              <Button onClick={createStudent} className="w-full">
                Create Student Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Onboarding</CardTitle>
            <Badge variant="default" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.onboarding_step === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Chaos Score</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.length > 0 
                ? Math.round(students.filter(s => s.chaos_score).reduce((acc, s) => acc + (s.chaos_score || 0), 0) / students.filter(s => s.chaos_score).length || 0)
                : 0
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Students</CardTitle>
          <CardDescription>
            Track student progress and manage their learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No students yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first student to begin teaching with TradeMate.
              </p>
              <Button onClick={() => setCreateStudentOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Your First Student
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{student.full_name}</h4>
                      {getProgressBadge(student.onboarding_step)}
                      {student.chaos_score && (
                        <Badge variant="outline">
                          Chaos: {student.chaos_score}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    <p className="text-sm text-muted-foreground">{student.business_name}</p>
                    {student.last_login_at && (
                      <p className="text-xs text-muted-foreground">
                        Last active: {new Date(student.last_login_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => impersonateStudent(student.user_id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Progress
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetStudentData(student.user_id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset Data
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};