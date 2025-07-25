import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  payment_method: string;
  tax_deductible: boolean;
  recurring: boolean;
  ai_category_confidence: number;
  user_id: string;
  created_at: string;
}

interface QuickAddTransactionProps {
  onAdd: (transaction: Partial<Transaction>) => void;
}

const QuickAddTransaction: React.FC<QuickAddTransactionProps> = ({ onAdd }) => {
  const [transactionData, setTransactionData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    tax_deductible: false,
    recurring: false
  });

  const expenseCategories = [
    'Office Supplies',
    'Marketing',
    'Travel',
    'Meals',
    'Software',
    'Equipment',
    'Professional Services',
    'Rent',
    'Utilities',
    'Insurance',
    'Other'
  ];

  const incomeCategories = [
    'Service Revenue',
    'Product Sales',
    'Consulting',
    'Recurring Revenue',
    'One-time Payment',
    'Refund',
    'Other'
  ];

  const paymentMethods = [
    'cash',
    'credit_card',
    'bank_transfer',
    'check',
    'paypal',
    'stripe',
    'other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionData.amount || !transactionData.description) {
      return;
    }

    onAdd({
      ...transactionData,
      amount: parseFloat(transactionData.amount)
    });

    // Reset form
    setTransactionData({
      type: 'expense',
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      payment_method: 'cash',
      tax_deductible: false,
      recurring: false
    });
  };

  const categories = transactionData.type === 'expense' ? expenseCategories : incomeCategories;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select 
            value={transactionData.type} 
            onValueChange={(value) => setTransactionData(prev => ({ 
              ...prev, 
              type: value as 'income' | 'expense',
              category: '' // Reset category when type changes
            }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">💰 Income</SelectItem>
              <SelectItem value="expense">💸 Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={transactionData.amount}
            onChange={(e) => setTransactionData(prev => ({ ...prev, amount: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="What was this transaction for?"
          value={transactionData.description}
          onChange={(e) => setTransactionData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select 
            value={transactionData.category} 
            onValueChange={(value) => setTransactionData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="payment_method">Payment Method</Label>
          <Select 
            value={transactionData.payment_method} 
            onValueChange={(value) => setTransactionData(prev => ({ ...prev, payment_method: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map(method => (
                <SelectItem key={method} value={method}>
                  {method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={transactionData.date}
          onChange={(e) => setTransactionData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="tax_deductible"
            checked={transactionData.tax_deductible}
            onCheckedChange={(checked) => setTransactionData(prev => ({ ...prev, tax_deductible: checked }))}
          />
          <Label htmlFor="tax_deductible">Tax Deductible</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="recurring"
            checked={transactionData.recurring}
            onCheckedChange={(checked) => setTransactionData(prev => ({ ...prev, recurring: checked }))}
          />
          <Label htmlFor="recurring">Recurring</Label>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Add Transaction
      </Button>
    </form>
  );
};

export default QuickAddTransaction;