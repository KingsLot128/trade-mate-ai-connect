import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, LogOut, Bell, Search, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  user: any;
}

export const Header = ({ user }: HeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-card border-b px-3 lg:px-6 py-3 lg:py-4 lg:fixed lg:top-0 lg:right-0 lg:left-64 z-30">
      <div className="flex items-center justify-between">
        {/* Left side - Welcome message */}
        <div className="flex-1 min-w-0 pr-2">
          <h1 className="text-lg lg:text-2xl font-bold text-foreground truncate">
            Welcome back!
          </h1>
          <p className="text-xs lg:text-base text-muted-foreground truncate">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Quick Add Button - Hidden on mobile */}
          <Button variant="outline" size="sm" className="hidden lg:flex">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>

          {/* Search Button - Hidden on mobile */}
          <Button variant="ghost" size="sm" className="hidden lg:flex">
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-5" />
            </Button>
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </div>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email === 'ajose002@gmail.com' ? 'Administrator' : 'Business Owner'}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              
              {/* Regular users get profile link */}
              {user?.email !== 'ajose002@gmail.com' && (
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
              )}

              {/* Admin users get admin dashboard link */}
              {user?.email === 'ajose002@gmail.com' && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};