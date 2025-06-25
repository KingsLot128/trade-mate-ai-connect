
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Search, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
  supplier: string;
  lastOrdered: string;
}

const InventoryManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample inventory data
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'PVC Pipe 4"',
      category: 'Plumbing',
      currentStock: 25,
      minStock: 10,
      unitPrice: 12.50,
      supplier: 'PlumbCorp Supply',
      lastOrdered: '2024-01-15'
    },
    {
      id: '2',
      name: 'Copper Fitting 1/2"',
      category: 'Plumbing',
      currentStock: 5,
      minStock: 15,
      unitPrice: 3.25,
      supplier: 'Metro Supplies',
      lastOrdered: '2024-01-10'
    },
    {
      id: '3',
      name: 'HVAC Filter 16x20',
      category: 'HVAC',
      currentStock: 45,
      minStock: 20,
      unitPrice: 8.99,
      supplier: 'Air Solutions',
      lastOrdered: '2024-01-20'
    },
    {
      id: '4',
      name: '14 AWG Wire (100ft)',
      category: 'Electrical',
      currentStock: 3,
      minStock: 5,
      unitPrice: 89.99,
      supplier: 'Electric Pro',
      lastOrdered: '2024-01-05'
    }
  ];

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) {
      return { status: 'low', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    } else if (item.currentStock <= item.minStock * 1.5) {
      return { status: 'medium', color: 'bg-yellow-100 text-yellow-800', icon: TrendingDown };
    } else {
      return { status: 'good', color: 'bg-green-100 text-green-800', icon: TrendingUp };
    }
  };

  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minStock);
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Track your parts, materials, and supplies.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryItems.length}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(inventoryItems.map(item => item.category)).size}
            </div>
            <p className="text-xs text-muted-foreground">Product categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search inventory by name, category, or supplier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-red-700">
              {lowStockItems.length} items need reordering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map(item => (
                <Badge key={item.id} variant="destructive">
                  {item.name} ({item.currentStock} left)
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item);
          const StatusIcon = stockStatus.icon;
          
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.category} • {item.supplier}</CardDescription>
                  </div>
                  <Badge className={stockStatus.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {stockStatus.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Stock</p>
                    <p className="font-medium">{item.currentStock} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Min Stock</p>
                    <p className="font-medium">{item.minStock} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Unit Price</p>
                    <p className="font-medium">${item.unitPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Value</p>
                    <p className="font-medium">${(item.currentStock * item.unitPrice).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t mt-4">
                  <p className="text-sm text-muted-foreground">
                    Last ordered: {new Date(item.lastOrdered).toLocaleDateString()}
                  </p>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    {item.currentStock <= item.minStock && (
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600">
                        Reorder
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryManager;
