
import React from 'react';
import { Play, Calendar, MessageCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    title: "Start Free Trial",
    description: "Get started with TradeMate AI today",
    icon: Play,
    action: "signup",
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    title: "Book a Demo",
    description: "See TradeMate AI in action",
    icon: Calendar,
    action: "demo",
    color: "bg-green-50 text-green-700 border-green-200"
  },
  {
    title: "Contact Support",
    description: "Get help from our team",
    icon: MessageCircle,
    action: "support",
    color: "bg-purple-50 text-purple-700 border-purple-200"
  }
];

const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
      {quickActions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Card key={index} className={`${action.color} border hover:shadow-md transition-shadow cursor-pointer`}>
            <CardContent className="flex items-center p-3 md:p-4">
              <Icon className="h-6 w-6 md:h-8 md:w-8 mr-3 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-sm md:text-base">{action.title}</h3>
                <p className="text-xs md:text-sm opacity-80">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickActions;
