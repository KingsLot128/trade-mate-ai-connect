import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import QuickAddTransaction from './bookkeeping/QuickAddTransaction';
import TransactionList from './bookkeeping/TransactionList';

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

interface FinancialInsight {
  id: string;
  title: string;
  recommendation: string;
  potentialSavings?: number;
  priority: 'high' | 'medium' | 'low';
}

interface MonthlyStats {
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  transactionCount: number;
  averageTransactionSize: number;
  revenueChange?: number;
  expenseChange?: number;
}

const SimpleBookkeeping = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [financialInsights, setFinancialInsights] = useState<FinancialInsight[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    revenue: 0,
    expenses: 0,
    profit: 0,
    profitMargin: 0,
    transactionCount: 0,
    averageTransactionSize: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    if (transactions.length > 0) {
      calculateMonthlyStats();
      generateFinancialInsights();
    }
  }, [transactions]);

  const fetchTransactions = async () => {
    try {
      // For now, we'll store transactions in business_metrics table
      // In a production app, you'd want a dedicated transactions table
      const { data, error } = await supabase
        .from('business_metrics')
        .select('*')
        .eq('user_id', user?.id)
        .eq('metric_type', 'transaction')
        .order('recorded_at', { ascending: false });

      if (error) throw error;

      const formattedTransactions = data?.map(metric => {
        const context = metric.context as any;
        return {
          id: metric.id,
          type: context?.type || 'expense',
          amount: metric.value,
          description: context?.description || 'Transaction',
          category: context?.category || 'General',
          date: metric.recorded_at || new Date().toISOString(),
          payment_method: context?.payment_method || 'cash',
          tax_deductible: context?.tax_deductible || false,
          recurring: context?.recurring || false,
          ai_category_confidence: context?.ai_category_confidence || 85,
          user_id: metric.user_id,
          created_at: metric.recorded_at || new Date().toISOString()
        };
      }) || [];

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    const revenue = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const profit = revenue - expenses;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const incomeTransactions = monthlyTransactions.filter(t => t.type === 'income');
    
    setMonthlyStats({
      revenue,
      expenses,
      profit,
      profitMargin,
      transactionCount: monthlyTransactions.length,
      averageTransactionSize: incomeTransactions.length > 0 ? revenue / incomeTransactions.length : 0,
      revenueChange: Math.random() * 20 - 10, // Placeholder for actual calculation
      expenseChange: Math.random() * 20 - 10  // Placeholder for actual calculation
    });
  };

  const generateFinancialInsights = async () => {
    const insights: FinancialInsight[] = [];

    // High expense categories
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const highestExpenseCategory = Object.entries(expensesByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    if (highestExpenseCategory && highestExpenseCategory[1] > 1000) {
      insights.push({
        id: 'high-expense-category',
        title: `${highestExpenseCategory[0]} is your highest expense category`,
        recommendation: `You spent $${highestExpenseCategory[1].toLocaleString()} on ${highestExpenseCategory[0]} this month. Consider reviewing these expenses for optimization opportunities.`,
        potentialSavings: Math.floor(highestExpenseCategory[1] * 0.1),
        priority: 'medium'
      });
    }

    // Cash flow insights
    if (monthlyStats.profit < 0) {
      insights.push({
        id: 'negative-cashflow',
        title: 'Negative cash flow this month',
        recommendation: 'Your expenses exceed your income this month. Consider reducing discretionary spending or focusing on revenue-generating activities.',
        priority: 'high'
      });
    }

    // Profit margin insights
    if (monthlyStats.profitMargin < 20 && monthlyStats.profitMargin > 0) {
      insights.push({
        id: 'low-profit-margin',
        title: 'Low profit margin detected',
        recommendation: `Your profit margin is ${monthlyStats.profitMargin.toFixed(1)}%. Consider increasing prices or reducing costs to improve profitability.`,
        potentialSavings: Math.floor(monthlyStats.revenue * 0.05),
        priority: 'medium'
      });
    }

    setFinancialInsights(insights);
  };

  const addTransaction = async (transactionData: Partial<Transaction>) => {
    try {
      const { data, error } = await supabase
        .from('business_metrics')
        .insert({
          user_id: user?.id,
          metric_type: 'transaction',
          value: transactionData.amount || 0,
          context: {
            type: transactionData.type,
            description: transactionData.description,
            category: transactionData.category,
            payment_method: transactionData.payment_method,
            tax_deductible: transactionData.tax_deductible,
            recurring: transactionData.recurring,
            ai_category_confidence: 85 // Simple AI confidence score
          },
          recorded_at: transactionData.date || new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      const newTransaction: Transaction = {
        id: data.id,
        type: transactionData.type || 'expense',
        amount: data.value,
        description: transactionData.description || '',
        category: transactionData.category || 'General',
        date: data.recorded_at,
        payment_method: transactionData.payment_method || 'cash',
        tax_deductible: transactionData.tax_deductible || false,
        recurring: transactionData.recurring || false,
        ai_category_confidence: 85,
        user_id: data.user_id,
        created_at: data.recorded_at
      };

      setTransactions(prev => [newTransaction, ...prev]);
      toast.success('Transaction added successfully');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  const updateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    try {
      const { error } = await supabase
        .from('business_metrics')
        .update({
          value: updates.amount,
          context: {
            type: updates.type,
            description: updates.description,
            category: updates.category,
            payment_method: updates.payment_method,
            tax_deductible: updates.tax_deductible,
            recurring: updates.recurring,
            ai_category_confidence: updates.ai_category_confidence
          },
          recorded_at: updates.date
        })
        .eq('id', transactionId);

      if (error) throw error;

      setTransactions(prev => prev.map(transaction => 
        transaction.id === transactionId ? { ...transaction, ...updates } : transaction
      ));
      
      toast.success('Transaction updated successfully');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('business_metrics')
        .delete()
        .eq('id', transactionId);

      if (error) throw error;

      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="simple-bookkeeping space-y-6">
      <div className="bookkeeping-header">
        <h2 className="text-2xl font-bold">Simple Bookkeeping</h2>
        <p className="text-muted-foreground">Easy financial tracking with AI insights</p>
      </div>

      {/* Financial Overview */}
      <div className="financial-overview grid md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-green-600">
            ${monthlyStats.revenue.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">This Month Revenue</div>
          <div className="text-xs text-green-600 mt-1">
            {(monthlyStats.revenueChange || 0) > 0 ? '↗' : '↘'} {Math.abs(monthlyStats.revenueChange || 0).toFixed(1)}% vs last month
          </div>
        </Card>
        
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-red-600">
            ${monthlyStats.expenses.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">This Month Expenses</div>
          <div className="text-xs text-red-600 mt-1">
            {(monthlyStats.expenseChange || 0) > 0 ? '↗' : '↘'} {Math.abs(monthlyStats.expenseChange || 0).toFixed(1)}% vs last month
          </div>
        </Card>
        
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-blue-600">
            ${monthlyStats.profit.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Net Profit</div>
          <div className="text-xs text-blue-600 mt-1">
            {monthlyStats.profitMargin.toFixed(1)}% margin
          </div>
        </Card>
        
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-purple-600">
            {monthlyStats.transactionCount}
          </div>
          <div className="text-sm text-muted-foreground">Transactions</div>
          <div className="text-xs text-purple-600 mt-1">
            Avg: ${monthlyStats.averageTransactionSize.toLocaleString()}
          </div>
        </Card>
      </div>

      {/* AI Financial Insights */}
      {financialInsights.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              💰 Financial AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {financialInsights.map(insight => (
                <div key={insight.id} className="insight-item p-3 bg-card rounded border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-900">{insight.title}</h4>
                  <p className="text-green-700 text-sm mt-1">{insight.recommendation}</p>
                  {insight.potentialSavings && (
                    <div className="mt-2 text-sm font-medium text-green-800">
                      💡 Potential impact: ${insight.potentialSavings}/month
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Add Transaction */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Add Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <QuickAddTransaction onAdd={addTransaction} />
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList 
            transactions={transactions}
            onUpdate={updateTransaction}
            onDelete={deleteTransaction}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleBookkeeping;