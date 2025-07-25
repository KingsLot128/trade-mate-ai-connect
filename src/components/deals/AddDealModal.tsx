import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useEffectiveUser } from '@/hooks/useEffectiveUser';
import { toast } from 'sonner';

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDealAdded: () => void;
}

const AddDealModal: React.FC<AddDealModalProps> = ({ isOpen, onClose, onDealAdded }) => {
  const { effectiveUserId } = useEffectiveUser();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    stage: 'Lead',
    probability: '25',
    expected_close_date: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveUserId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('crm_deals')
        .insert({
          user_id: effectiveUserId,
          name: formData.name,
          amount: formData.amount ? parseFloat(formData.amount) : null,
          stage: formData.stage,
          probability: parseInt(formData.probability),
          expected_close_date: formData.expected_close_date || null,
          description: formData.description || null
        });

      if (error) throw error;

      toast.success('Deal added successfully');
      onDealAdded();
      onClose();
      setFormData({
        name: '',
        amount: '',
        stage: 'Lead',
        probability: '25',
        expected_close_date: '',
        description: ''
      });
    } catch (error) {
      console.error('Error adding deal:', error);
      toast.error('Failed to add deal');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Deal Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Website Redesign Project"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Deal Value ($)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="15000"
              />
            </div>
            <div>
              <Label htmlFor="probability">Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => handleInputChange('probability', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stage">Stage</Label>
              <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(stage => (
                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expected_close_date">Expected Close Date</Label>
              <Input
                id="expected_close_date"
                type="date"
                value={formData.expected_close_date}
                onChange={(e) => handleInputChange('expected_close_date', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the opportunity..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Deal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDealModal;