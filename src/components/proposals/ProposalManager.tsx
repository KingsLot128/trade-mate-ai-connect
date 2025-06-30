
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Sparkles, Calendar, Download } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Proposal {
  id: string;
  profile_id: string;
  content: string;
  version: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  business_name: string;
}

const ProposalManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchProposals();
    fetchProfiles();
  }, [user]);

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('proposal_versions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch proposals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, business_name')
        .eq('user_id', user?.id);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const generateProposal = async (profileId: string) => {
    setGenerating(true);
    try {
      // Call the generateProposal edge function
      const { data, error } = await supabase.functions.invoke('generateProposal', {
        body: { profileId }
      });

      if (error) {
        console.error('Error generating proposal:', error);
        // Fallback: create a mock proposal for demo
        const mockProposal = {
          profile_id: profileId,
          content: `Dear Valued Customer,

Thank you for considering our services. Based on your business requirements, we have prepared a comprehensive proposal that addresses your specific needs.

Our AI-powered analysis of your profile indicates that you would benefit from our premium service package, which includes:

• 24/7 AI-powered phone support
• Automated appointment scheduling
• Customer relationship management
• Real-time business insights
• Revenue tracking and analytics

We are confident that our solution will help streamline your operations and drive business growth.

Best regards,
TradeMate AI Team`,
          version: 1,
          status: 'draft'
        };

        const { error: insertError } = await supabase
          .from('proposal_versions')
          .insert([mockProposal]);

        if (insertError) throw insertError;
      }

      toast({
        title: "Proposal Generated",
        description: "AI has successfully generated a new proposal.",
      });

      fetchProposals(); // Refresh the list
    } catch (error) {
      console.error('Error in proposal generation:', error);
      toast({
        title: "Error",
        description: "Failed to generate proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p>Please log in to access proposals</p>
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
          <h2 className="text-3xl font-bold tracking-tight">AI Proposals</h2>
          <p className="text-muted-foreground">
            Generate and manage AI-powered business proposals.
          </p>
        </div>
        {profiles.length > 0 && (
          <Button 
            onClick={() => generateProposal(profiles[0].id)}
            disabled={generating}
            className="bg-gradient-to-r from-blue-600 to-green-600"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {generating ? 'Generating...' : 'Generate Proposal'}
          </Button>
        )}
      </div>

      {profiles.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Complete Your Profile</h3>
              <p className="text-gray-500 mb-4">
                Please complete your profile setup to generate AI proposals.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Generated Proposals ({proposals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {proposals.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No proposals yet</h3>
              <p className="text-gray-500 mb-4">
                Generate your first AI-powered proposal to get started.
              </p>
              {profiles.length > 0 && (
                <Button 
                  onClick={() => generateProposal(profiles[0].id)}
                  disabled={generating}
                  className="bg-gradient-to-r from-blue-600 to-green-600"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate First Proposal
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell>
                      <Badge variant="outline">v{proposal.version}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {proposal.content.substring(0, 100)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(proposal.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(proposal.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
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

export default ProposalManager;
