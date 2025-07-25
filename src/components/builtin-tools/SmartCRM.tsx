import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import LeadCard from './crm/LeadCard';
import AddLeadModal from './crm/AddLeadModal';

// Debug logging
console.log('SmartCRM component loaded');

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  amount: number;
  lead_source: string;
  notes: string;
  lead_score: number;
  last_contact_date: string | null;
  created_at: string;
  user_id: string;
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  suggestedActions?: Array<{
    id: string;
    label: string;
    action: () => void;
  }>;
}

const SmartCRM = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [showAddLead, setShowAddLead] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  useEffect(() => {
    if (leads.length > 0) {
      generateLeadInsights();
    }
  }, [leads]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedLeads = data?.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        stage: (contact.status as Lead['stage']) || 'new',
        amount: 0, // Will be enhanced with deals data
        lead_source: 'website',
        notes: contact.notes || '',
        lead_score: contact.lead_score || 0,
        last_contact_date: contact.last_contact_date,
        created_at: contact.created_at,
        user_id: contact.user_id
      })) || [];

      setLeads(formattedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const generateLeadInsights = async () => {
    // Generate AI insights based on lead data
    const insights: AIInsight[] = [];

    // High-value leads not contacted recently
    const highValueLeads = leads.filter(lead => 
      lead.lead_score > 70 && 
      (!lead.last_contact_date || 
        new Date(lead.last_contact_date).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    if (highValueLeads.length > 0) {
      insights.push({
        id: 'high-value-followup',
        title: `${highValueLeads.length} high-value leads need follow-up`,
        description: 'These leads scored 70+ but haven\'t been contacted in the past week',
        priority: 'high',
        suggestedActions: [{
          id: 'contact-leads',
          label: 'Contact Now',
          action: () => toast.info('Feature coming soon: Automated contact suggestions')
        }]
      });
    }

    // Leads stuck in pipeline
    const stuckLeads = leads.filter(lead => 
      lead.stage === 'contacted' && 
      lead.last_contact_date &&
      new Date(lead.last_contact_date).getTime() < Date.now() - 14 * 24 * 60 * 60 * 1000
    );

    if (stuckLeads.length > 0) {
      insights.push({
        id: 'stuck-pipeline',
        title: `${stuckLeads.length} leads stuck in pipeline`,
        description: 'These leads have been in "contacted" stage for over 2 weeks',
        priority: 'medium',
        suggestedActions: [{
          id: 'move-stage',
          label: 'Review & Update',
          action: () => toast.info('Feature coming soon: Pipeline optimization')
        }]
      });
    }

    setAiInsights(insights);
  };

  const addLead = async (leadData: Partial<Lead>) => {
    try {
      const { data, error } = await supabase
        .from('crm_contacts')
        .insert({
          user_id: user?.id,
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          company: leadData.company,
          notes: leadData.notes,
          status: 'new',
          lead_score: Math.floor(Math.random() * 100) // Simple AI scoring
        })
        .select()
        .single();

      if (error) throw error;

      const newLead: Lead = {
        id: data.id,
        name: data.name,
        email: data.email || '',
        phone: data.phone || '',
        company: data.company || '',
        stage: 'new',
        amount: 0,
        lead_source: 'manual',
        notes: data.notes || '',
        lead_score: data.lead_score || 0,
        last_contact_date: null,
        created_at: data.created_at,
        user_id: data.user_id
      };

      setLeads(prev => [newLead, ...prev]);
      setShowAddLead(false);
      toast.success('Lead added successfully');
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead');
    }
  };

  const updateLead = async (leadId: string, updates: Partial<Lead>) => {
    try {
      const { error } = await supabase
        .from('crm_contacts')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          company: updates.company,
          notes: updates.notes,
          status: updates.stage,
          lead_score: updates.lead_score,
          last_contact_date: updates.last_contact_date
        })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, ...updates } : lead
      ));
      
      toast.success('Lead updated successfully');
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    }
  };

  const moveLeadToStage = (leadId: string, newStage: Lead['stage']) => {
    updateLead(leadId, { 
      stage: newStage,
      last_contact_date: new Date().toISOString()
    });
  };

  const getLeadsByStage = (stage: Lead['stage']) => {
    return leads.filter(lead => lead.stage === stage);
  };

  const getTotalValueByStage = (stage: Lead['stage']) => {
    return getLeadsByStage(stage).reduce((sum, lead) => sum + lead.amount, 0);
  };

  const getLeadInsights = (leadId: string) => {
    return aiInsights.filter(insight => insight.id.includes(leadId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="smart-crm space-y-6">
      <div className="crm-header">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Smart CRM</h2>
            <p className="text-muted-foreground">AI-powered lead management without the complexity</p>
          </div>
          <Button onClick={() => setShowAddLead(true)}>
            + Add Lead
          </Button>
        </div>
      </div>

      {/* AI Insights Panel */}
      {aiInsights.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              🤖 AI Insights
              <Badge className="ml-2" variant="secondary">
                {aiInsights.length} insights
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiInsights.map(insight => (
                <div key={insight.id} className="insight-item p-3 bg-card rounded border-l-4 border-blue-400">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900">{insight.title}</h4>
                      <p className="text-blue-700 text-sm mt-1">{insight.description}</p>
                    </div>
                    <div className="ml-4">
                      <Badge className={getPriorityColor(insight.priority)}>
                        {insight.priority}
                      </Badge>
                    </div>
                  </div>
                  {insight.suggestedActions && (
                    <div className="mt-3 flex space-x-2">
                      {insight.suggestedActions.map(action => (
                        <Button 
                          key={action.id} 
                          size="sm" 
                          variant="outline"
                          onClick={action.action}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lead Pipeline */}
      <div className="lead-pipeline">
        <div className="pipeline-stages grid md:grid-cols-5 gap-4">
          {['new', 'contacted', 'qualified', 'proposal', 'won'].map(stage => (
            <div key={stage} className="stage-column">
              <div className="stage-header p-3 bg-muted rounded-t">
                <h3 className="font-semibold capitalize">{stage}</h3>
                <div className="text-sm text-muted-foreground">
                  {getLeadsByStage(stage as Lead['stage']).length} leads
                </div>
                <div className="text-xs text-green-600">
                  ${getTotalValueByStage(stage as Lead['stage']).toLocaleString()}
                </div>
              </div>
              <div className="stage-content space-y-2 p-2 bg-muted/50 min-h-[300px] rounded-b">
                {getLeadsByStage(stage as Lead['stage']).map(lead => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    aiInsights={getLeadInsights(lead.id)}
                    onUpdate={updateLead}
                    onStageChange={moveLeadToStage}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddLead && (
        <AddLeadModal 
          onAdd={addLead}
          onClose={() => setShowAddLead(false)}
        />
      )}
    </div>
  );
};

export default SmartCRM;