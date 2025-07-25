import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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

interface TransactionListProps {
  transactions: Transaction[];
  onUpdate: (transactionId: string, updates: Partial<Transaction>) => void;
  onDelete: (transactionId: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onUpdate, onDelete }) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editData, setEditData] = useState<Partial<Transaction>>({});

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditData(transaction);
  };

  const handleSave = () => {
    if (editingTransaction) {
      onUpdate(editingTransaction.id, editData);
      setEditingTransaction(null);
      setEditData({});
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const formatted = `$${amount.toLocaleString()}`;
    return type === 'income' ? (
      <span className="text-green-600 font-medium">+{formatted}</span>
    ) : (
      <span className="text-red-600 font-medium">-{formatted}</span>
    );
  };

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800';
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

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

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions yet. Add your first transaction above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>AI Confidence</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.description}
                  <div className="text-xs text-muted-foreground mt-1">
                    {transaction.tax_deductible && (
                      <Badge variant="outline" className="mr-2">Tax Deductible</Badge>
                    )}
                    {transaction.recurring && (
                      <Badge variant="outline">Recurring</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  <Badge className={getTypeColor(transaction.type)} variant="outline">
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatAmount(transaction.amount, transaction.type)}
                </TableCell>
                <TableCell className="capitalize">
                  {transaction.payment_method.replace('_', ' ')}
                </TableCell>
                <TableCell>
                  <Badge className={getConfidenceColor(transaction.ai_category_confidence)} variant="outline">
                    {transaction.ai_category_confidence}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(transaction)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit Transaction</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                              Description
                            </Label>
                            <Input
                              id="description"
                              value={editData.description || ''}
                              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                              Amount
                            </Label>
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              value={editData.amount || ''}
                              onChange={(e) => setEditData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                              Category
                            </Label>
                            <Select 
                              value={editData.category || ''} 
                              onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {(editData.type === 'expense' ? expenseCategories : incomeCategories).map(category => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="payment_method" className="text-right">
                              Payment
                            </Label>
                            <Select 
                              value={editData.payment_method || ''} 
                              onValueChange={(value) => setEditData(prev => ({ ...prev, payment_method: value }))}
                            >
                              <SelectTrigger className="col-span-3">
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
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                              Date
                            </Label>
                            <Input
                              id="date"
                              type="date"
                              value={editData.date?.split('T')[0] || ''}
                              onChange={(e) => setEditData(prev => ({ ...prev, date: e.target.value }))}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Options</Label>
                            <div className="col-span-3 space-y-2">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={editData.tax_deductible || false}
                                  onCheckedChange={(checked) => setEditData(prev => ({ ...prev, tax_deductible: checked }))}
                                />
                                <Label>Tax Deductible</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={editData.recurring || false}
                                  onCheckedChange={(checked) => setEditData(prev => ({ ...prev, recurring: checked }))}
                                />
                                <Label>Recurring</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setEditingTransaction(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSave}>
                            Save
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this transaction? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(transaction.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionList;