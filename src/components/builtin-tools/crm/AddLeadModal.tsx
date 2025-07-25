import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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

interface AddLeadModalProps {
  onAdd: (leadData: Partial<Lead>) => void;
  onClose: () => void;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ onAdd, onClose }) => {
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leadData.name.trim()) {
      return;
    }

    onAdd(leadData);
    setLeadData({
      name: '',
      email: '',
      phone: '',
      company: '',
      notes: ''
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name *
            </Label>
            <Input
              id="name"
              value={leadData.name}
              onChange={(e) => setLeadData(prev => ({ ...prev, name: e.target.value }))}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={leadData.email}
              onChange={(e) => setLeadData(prev => ({ ...prev, email: e.target.value }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={leadData.phone}
              onChange={(e) => setLeadData(prev => ({ ...prev, phone: e.target.value }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <Input
              id="company"
              value={leadData.company}
              onChange={(e) => setLeadData(prev => ({ ...prev, company: e.target.value }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={leadData.notes}
              onChange={(e) => setLeadData(prev => ({ ...prev, notes: e.target.value }))}
              className="col-span-3"
              placeholder="Initial notes about this lead..."
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadModal;