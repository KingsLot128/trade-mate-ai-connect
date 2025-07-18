import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  User,
  Settings,
  Globe,
  CreditCard,
  Brain,
  TrendingUp,
  Calendar,
  Users,
  Phone,
  BarChart3,
  FileText,
  Shield,
  UserCog,
  LogOut,
  Menu,
  X,
  Lightbulb,
  Building
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
}

export const Sidebar = ({ currentPath }: SidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine user role (simplified - you can enhance this)
  const isAdmin = user?.email === 'ajose002@gmail.com';

  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Intelligence Feed', href: '/feed', icon: Brain, badge: 'AI', badgeColor: 'bg-purple-500' },
    { name: 'Business Health', href: '/health', icon: TrendingUp, badge: 'NEW', badgeColor: 'bg-green-500' },
    { name: 'Clarity Lens', href: '/clarity', icon: Brain },
    { name: 'Recommendations', href: '/recommendations', icon: Lightbulb },
    { name: 'Call Log', href: '/calls', icon: Phone },
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'Deals Pipeline', href: '/deals', icon: TrendingUp },
    { name: 'Smart Tools', href: '/tools', icon: Settings, badge: 'SMART', badgeColor: 'bg-blue-500' },
    { name: 'Calendar Hub', href: '/calendar', icon: Calendar },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Integrations', href: '/integrations', icon: Settings },
    { name: 'Website', href: '/website', icon: Globe }
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: Shield },
    { name: 'User Management', href: '/admin/users', icon: UserCog }
  ];

  const userNavigation = [
    { name: 'My Profile', href: '/profile', icon: User }
  ];

  const settingsNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Billing', href: '/billing', icon: CreditCard }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => (
    <Link
      to={item.href}
      onClick={() => setSidebarOpen(false)}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative group",
        isActive
          ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
    >
      <item.icon className={cn("mr-3 h-5 w-5", isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
      <span className="lg:block md:hidden sm:hidden">{item.name}</span>
      {/* Mobile tooltip */}
      <div className="lg:hidden absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
        {item.name}
      </div>
      {item.badge && (
        <span className={cn(
          "absolute -top-1 -right-1 text-xs px-1.5 py-0.5 rounded-full text-white font-bold lg:block hidden",
          item.badgeColor
        )}>
          {item.badge}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-background/90 backdrop-blur-sm"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-card shadow-sm border-r transition-transform duration-300 ease-in-out z-40",
        "w-64 lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:h-full",
        "fixed lg:static h-full",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">TM</span>
            </div>
            <div className="ml-2 hidden lg:block">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TradeMateAI
              </span>
              <p className="text-xs text-muted-foreground">AI Business Assistant</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <nav className="px-3 space-y-6">
            {/* Main Navigation */}
            <div>
              <div className="flex items-center px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                <Building className="mr-2 h-3 w-3" />
                <span className="hidden lg:block">Business</span>
              </div>
              <div className="space-y-1">
                {mainNavigation.map((item) => (
                  <NavItem 
                    key={item.name} 
                    item={item} 
                    isActive={currentPath === item.href || (currentPath === '/' && item.href === '/dashboard')} 
                  />
                ))}
              </div>
            </div>

            {/* Admin Section */}
            {isAdmin && (
              <div>
                <div className="flex items-center px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <Shield className="mr-2 h-3 w-3" />
                  <span className="hidden lg:block">Admin</span>
                </div>
                <div className="space-y-1">
                  {adminNavigation.map((item) => (
                    <NavItem key={item.name} item={item} isActive={currentPath === item.href} />
                  ))}
                </div>
              </div>
            )}

            {/* User Profile Section - Only for regular users */}
            {!isAdmin && (
              <div>
                <div className="flex items-center px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <User className="mr-2 h-3 w-3" />
                  <span className="hidden lg:block">Profile</span>
                </div>
                <div className="space-y-1">
                  {userNavigation.map((item) => (
                    <NavItem key={item.name} item={item} isActive={currentPath === item.href} />
                  ))}
                </div>
              </div>
            )}

            {/* Settings Section */}
            <div>
              <div className="flex items-center px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                <Settings className="mr-2 h-3 w-3" />
                <span className="hidden lg:block">Settings</span>
              </div>
              <div className="space-y-1">
                {settingsNavigation.map((item) => (
                  <NavItem key={item.name} item={item} isActive={currentPath === item.href} />
                ))}
              </div>
            </div>
          </nav>
        </ScrollArea>

        {/* Sign Out Button */}
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden lg:block">Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
};