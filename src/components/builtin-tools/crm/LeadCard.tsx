import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface LeadCardProps {
  lead: Lead;
  aiInsights: any[];
  onUpdate: (leadId: string, updates: Partial<Lead>) => void;
  onStageChange: (leadId: string, newStage: Lead['stage']) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, aiInsights, onUpdate, onStageChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(lead);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStageColor = (stage: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      proposal: 'bg-orange-100 text-orange-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleSave = () => {
    onUpdate(lead.id, editData);
    setIsEditing(false);
  };

  const handleStageChange = (newStage: string) => {
    onStageChange(lead.id, newStage as Lead['stage']);
  };

  return (
    <Card className="lead-card hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{lead.name}</h4>
              {lead.company && (
                <p className="text-xs text-muted-foreground">{lead.company}</p>
              )}
            </div>
            <Badge className={getScoreColor(lead.lead_score)} variant="outline">
              {lead.lead_score}
            </Badge>
          </div>

          <div className="space-y-1 text-xs text-muted-foreground">
            {lead.email && <div>📧 {lead.email}</div>}
            {lead.phone && <div>📞 {lead.phone}</div>}
          </div>

          <div className="flex items-center justify-between">
            <Badge className={getStageColor(lead.stage)} variant="outline">
              {lead.stage}
            </Badge>
            {lead.last_contact_date && (
              <span className="text-xs text-muted-foreground">
                {new Date(lead.last_contact_date).toLocaleDateString()}
              </span>
            )}
          </div>

          {lead.notes && (
            <p className="text-xs text-muted-foreground truncate">
              📝 {lead.notes}
            </p>
          )}

          <div className="flex space-x-1">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-xs">
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Lead</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={editData.phone}
                      onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company" className="text-right">
                      Company
                    </Label>
                    <Input
                      id="company"
                      value={editData.company}
                      onChange={(e) => setEditData(prev => ({ ...prev, company: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stage" className="text-right">
                      Stage
                    </Label>
                    <Select 
                      value={editData.stage} 
                      onValueChange={(value) => setEditData(prev => ({ ...prev, stage: value as Lead['stage'] }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="won">Won</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={editData.notes}
                      onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Select onValueChange={handleStageChange}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue placeholder="Move" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;