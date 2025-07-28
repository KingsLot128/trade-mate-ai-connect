import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  CheckCircle, 
  Brain, 
  Zap, 
  Target, 
  AlertTriangle,
  Phone,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Clock
} from "lucide-react";

interface ClarityMetrics {
  chaosIndex: number;
  operationalHealth: number;
  aiConfidence: number;
  businessVelocity: number;
  priorityTasks: number;
  activeThreats: number;
  callQuality: number;
  financialHealth: number;
  customerSatisfaction: number;
  dataQuality: number;
}

interface ClarityMetricsProps {
  metrics: ClarityMetrics;
  isLoading?: boolean;
}

const ClarityMetricsGrid: React.FC<ClarityMetricsProps> = ({ metrics, isLoading = false }) => {
  const getMetricColor = (value: number, inverse = false) => {
    if (inverse) {
      if (value < 30) return 'text-emerald-400';
      if (value < 70) return 'text-amber-400';
      return 'text-red-400';
    } else {
      if (value < 30) return 'text-red-400';
      if (value < 70) return 'text-amber-400';
      return 'text-emerald-400';
    }
  };

  const metricsConfig = [
    {
      key: 'chaosIndex',
      label: 'Chaos Index',
      icon: Activity,
      inverse: true,
      suffix: '%'
    },
    {
      key: 'operationalHealth',
      label: 'Op Health',
      icon: CheckCircle,
      inverse: false,
      suffix: '%'
    },
    {
      key: 'aiConfidence',
      label: 'AI Confidence',
      icon: Brain,
      inverse: false,
      suffix: '%'
    },
    {
      key: 'businessVelocity',
      label: 'Velocity',
      icon: Zap,
      inverse: false,
      suffix: '%'
    },
    {
      key: 'callQuality',
      label: 'Call Quality',
      icon: Phone,
      inverse: false,
      suffix: '%'
    },
    {
      key: 'financialHealth',
      label: 'Financial',
      icon: DollarSign,
      inverse: false,
      suffix: '%'
    },
    {
      key: 'customerSatisfaction',
      label: 'Customer Sat',
      icon: Users,
      inverse: false,
      suffix: '%'
    },
    {
      key: 'dataQuality',
      label: 'Data Quality',
      icon: TrendingUp,
      inverse: false,
      suffix: '%'
    }
  ];

  const specialMetrics = [
    {
      key: 'priorityTasks',
      label: 'Priority Tasks',
      icon: Target,
      color: 'text-amber-400'
    },
    {
      key: 'activeThreats',
      label: 'Active Threats',
      icon: AlertTriangle,
      color: 'text-red-400'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index} className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-slate-700 rounded w-16"></div>
                  <div className="h-6 bg-slate-700 rounded w-12"></div>
                </div>
                <div className="h-6 w-6 bg-slate-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {/* Percentage Metrics */}
      {metricsConfig.map((config) => {
        const value = metrics[config.key as keyof ClarityMetrics] as number;
        const Icon = config.icon;
        
        return (
          <Card key={config.key} className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-300 uppercase tracking-wide font-medium">
                    {config.label}
                  </p>
                  <p className={`text-2xl font-bold ${getMetricColor(value, config.inverse)}`}>
                    {value}{config.suffix}
                  </p>
                  {value < 100 && (
                    <Progress 
                      value={value} 
                      className="h-1 mt-1" 
                    />
                  )}
                </div>
                <Icon className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Special Count Metrics */}
      {specialMetrics.map((config) => {
        const value = metrics[config.key as keyof ClarityMetrics] as number;
        const Icon = config.icon;
        
        return (
          <Card key={config.key} className="bg-slate-800/50 border-blue-800/50 backdrop-blur-sm hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-300 uppercase tracking-wide font-medium">
                    {config.label}
                  </p>
                  <p className={`text-2xl font-bold ${config.color}`}>
                    {value}
                  </p>
                </div>
                <Icon className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ClarityMetricsGrid;