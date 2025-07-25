import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAccessButtonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
  onClick: () => void;
  className?: string;
}

const QuickAccessButton: React.FC<QuickAccessButtonProps> = ({
  title,
  description,
  icon: Icon,
  badge,
  badgeColor = 'bg-primary',
  onClick,
  className
}) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "h-auto p-6 text-left hover:bg-muted/50 transition-all duration-300 hover:shadow-md relative",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4 w-full">
        <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-semibold text-lg mb-1">{title}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
        {badge && (
          <Badge className={cn("absolute -top-2 -right-2 text-xs font-bold text-white", badgeColor)}>
            {badge}
          </Badge>
        )}
      </div>
    </Button>
  );
};

export default QuickAccessButton;