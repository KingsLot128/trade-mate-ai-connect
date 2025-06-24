
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
  delay?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  gradient = "from-teal-500 to-teal-600",
  delay = "0s"
}) => {
  return (
    <Card 
      className="feature-card p-8 text-center bg-white border-0 shadow-lg scroll-fade-in" 
      style={{ animationDelay: delay }}
    >
      <CardContent className="p-0">
        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="tm-heading-md mb-3 text-slate-800">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
