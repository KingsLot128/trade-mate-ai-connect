import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, DollarSign, Users, Phone, Calendar, Target, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data
  const revenueData = [
    { month: 'Jan', revenue: 12000, leads: 45, calls: 120 },
    { month: 'Feb', revenue: 15000, leads: 52, calls: 135 },
    { month: 'Mar', revenue: 18000, leads: 48, calls: 142 },
    { month: 'Apr', revenue: 22000, leads: 65, calls: 158 },
    { month: 'May', revenue: 25000, leads: 70, calls: 175 },
    { month: 'Jun', revenue: 28000, leads: 78, calls: 190 }
  ];

  const conversionData = [
    { name: 'Leads', value: 78, color: '#3b82f6' },
    { name: 'Qualified', value: 45, color: '#10b981' },
    { name: 'Proposals', value: 32, color: '#f59e0b' },
    { name: 'Closed', value: 18, color: '#ef4444' }
  ];

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$127,500',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Leads',
      value: '45',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Conversion Rate',
      value: '23.1%',
      change: '-2.1%',
      trend: 'down',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      title: 'Avg Deal Size',
      value: '$7,083',
      change: '+15.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Analytics</h1>
          <p className="text-muted-foreground">
            Track your business performance and growth metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Badge variant={timeRange === '7d' ? 'default' : 'outline'} 
                 className="cursor-pointer" 
                 onClick={() => setTimeRange('7d')}>
            7 Days
          </Badge>
          <Badge variant={timeRange === '30d' ? 'default' : 'outline'} 
                 className="cursor-pointer" 
                 onClick={() => setTimeRange('30d')}>
            30 Days
          </Badge>
          <Badge variant={timeRange === '90d' ? 'default' : 'outline'} 
                 className="cursor-pointer" 
                 onClick={() => setTimeRange('90d')}>
            90 Days
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="leads">Lead Generation</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Generation Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="calls" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      Website
                    </span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      Referrals
                    </span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      Social Media
                    </span>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      Direct
                    </span>
                    <span className="font-medium">12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversionData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <span>Lead to Qualified</span>
                    <span className="font-bold text-green-600">57.7%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <span>Qualified to Proposal</span>
                    <span className="font-bold text-blue-600">71.1%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <span>Proposal to Close</span>
                    <span className="font-bold text-purple-600">56.3%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded border border-green-200">
                    <span className="font-medium">Overall Conversion</span>
                    <span className="font-bold text-green-700">23.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">2.4h</div>
                  <p className="text-sm text-muted-foreground">Average response time</p>
                  <Badge className="mt-2" variant="outline">12% faster</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">94%</div>
                  <p className="text-sm text-muted-foreground">On-time completion rate</p>
                  <Badge className="mt-2" variant="outline">+3% this month</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">4.8/5</div>
                  <p className="text-sm text-muted-foreground">Average rating</p>
                  <Badge className="mt-2" variant="outline">98% positive</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;