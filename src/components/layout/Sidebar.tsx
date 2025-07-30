import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  LayoutDashboard,
  User,
  Settings,
  Globe,
  CreditCard,
  Brain,
  TrendingUp, 
  DollarSign,
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
  Building,
  Database,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar = ({ currentPath, sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);

  // Check admin and instructor roles properly from database
  useEffect(() => {
    const checkUserRoles = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsInstructor(false);
        return;
      }

      try {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        const userRoles = roles?.map(r => r.role) || [];
        setIsAdmin(userRoles.includes('admin'));
        setIsInstructor(userRoles.includes('instructor'));
        
        console.log('🔰 User roles for', user.email, ':', userRoles);
      } catch (error) {
        setIsAdmin(false);
        setIsInstructor(false);
      }
    };

    checkUserRoles();
  }, [user]);

  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Intelligence Feed', href: '/feed', icon: Brain, badge: 'AI', badgeColor: 'bg-purple-500' },
    { name: 'Business Health', href: '/health', icon: TrendingUp, badge: 'NEW', badgeColor: 'bg-green-500' },
    { name: 'Clarity Lens', href: '/clarity', icon: Brain, badge: 'PRO', badgeColor: 'bg-purple-500' },
    
    { name: 'Revenue Recovery', href: '/revenue-recovery', icon: DollarSign, badge: 'AI', badgeColor: 'bg-green-500' },
    { name: 'Smart AI', href: '/ai-recommendations', icon: Brain, badge: 'PRO', badgeColor: 'bg-purple-500' },
    { name: 'AI Calls', href: '/calls', icon: Phone, badge: 'AI', badgeColor: 'bg-blue-500' },
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'Deals Pipeline', href: '/deals', icon: TrendingUp },
    { name: 'Smart Tools', href: '/tools', icon: Settings, badge: 'SMART', badgeColor: 'bg-blue-500' },
    { name: 'Calendar Hub', href: '/calendar', icon: Calendar },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Data Center', href: '/data-collection', icon: Database, badge: 'NEW', badgeColor: 'bg-green-500' },
    { name: 'Integrations', href: '/integrations', icon: Settings },
    { name: 'Website', href: '/website', icon: Globe }
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: Shield },
    { name: 'User Management', href: '/admin/users', icon: UserCog }
  ];

  const instructorNavigation = [
    { name: 'Instructor Dashboard', href: '/instructor', icon: GraduationCap, badge: 'EDU', badgeColor: 'bg-green-500' },
    { name: 'Student Management', href: '/instructor', icon: Users },
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
      <span className="truncate">{item.name}</span>
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
            <div className="ml-2">
              <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TradeMateAI
              </span>
              <p className="text-xs text-muted-foreground hidden lg:block">AI Business Assistant</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <nav className="px-3 space-y-6">
            {/* Main Navigation */}
            <div>
              <div className="flex items-center px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                <Building className="mr-2 h-3 w-3" />
                <span>Business</span>
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
                  <span>Admin</span>
                </div>
                <div className="space-y-1">
                  {adminNavigation.map((item) => (
                    <NavItem key={item.name} item={item} isActive={currentPath === item.href} />
                  ))}
                </div>
              </div>
            )}

            {/* Instructor Section */}
            {isInstructor && (
              <div>
                <div className="flex items-center px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <GraduationCap className="mr-2 h-3 w-3" />
                  <span>Education</span>
                </div>
                <div className="space-y-1">
                  {instructorNavigation.map((item) => (
                    <NavItem key={item.name} item={item} isActive={currentPath === item.href} />
                  ))}
                </div>
              </div>
            )}

            {/* User Profile Section - Only for regular users */}
            {!isAdmin && !isInstructor && (
              <div>
                <div className="flex items-center px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <User className="mr-2 h-3 w-3" />
                  <span>Profile</span>
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
                <span>Settings</span>
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
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </>
  );
};