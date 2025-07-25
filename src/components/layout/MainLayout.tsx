import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '@/contexts/AuthContext';

export const MainLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar currentPath={location.pathname} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Header */}
          <Header user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          {/* Page Content */}
          <main className="flex-1 p-3 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};