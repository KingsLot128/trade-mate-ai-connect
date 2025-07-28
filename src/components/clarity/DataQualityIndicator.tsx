import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Zap
} from "lucide-react";

interface DataQualityProps {
  overallQuality: number;
  missingData: string[];
  loadingTime: number;
  onImproveData: () => void;
}

const DataQualityIndicator: React.FC<DataQualityProps> = ({ 
  overallQuality, 
  missingData, 
  loadingTime,
  onImproveData 
}) => {
  const getQualityStatus = () => {
    if (overallQuality >= 80) return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle };
    if (overallQuality >= 50) return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle };
    return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle };
  };

  const status = getQualityStatus();
  const StatusIcon = status.icon;

  const isSlowLoading = loadingTime > 3000; // 3+ seconds

  return (
    <Card className={`${status.bg} ${status.border} backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-400" />
            <span>Data Intelligence Status</span>
          </div>
          <Badge variant="outline" className={`${status.color} border-current`}>
            {overallQuality}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Data Quality Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-200">Data Completeness</span>
            <span className={`text-sm font-medium ${status.color}`}>
              {overallQuality}%
            </span>
          </div>
          <Progress value={overallQuality} className="h-2" />
        </div>

        {/* Loading Performance */}
        {isSlowLoading && (
          <div className="flex items-start space-x-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <Clock className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-300 text-sm">Slow Loading Detected</h4>
              <p className="text-xs text-amber-200">
                Loading took {(loadingTime / 1000).toFixed(1)}s due to insufficient business data. 
                More data = faster insights.
              </p>
            </div>
          </div>
        )}

        {/* Missing Data Areas */}
        {missingData.length > 0 && (
          <div>
            <h4 className="font-medium text-blue-300 text-sm mb-2 flex items-center">
              <StatusIcon className="h-4 w-4 mr-2" />
              Missing Intelligence Areas
            </h4>
            <div className="space-y-1">
              {missingData.slice(0, 3).map((area, index) => (
                <div key={index} className="text-xs text-blue-200 flex items-center">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                  {area}
                </div>
              ))}
              {missingData.length > 3 && (
                <div className="text-xs text-blue-300">
                  +{missingData.length - 3} more areas
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quality Impact */}
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <h4 className="font-medium text-blue-300 text-sm mb-2">Impact on Clarity Lens</h4>
          <div className="space-y-1 text-xs">
            {overallQuality >= 80 ? (
              <p className="text-emerald-300">
                ✓ All intelligence streams active • Real-time insights • Predictive alerts
              </p>
            ) : overallQuality >= 50 ? (
              <p className="text-amber-300">
                ⚠ Basic intelligence • Some predictive features limited • Manual alerts
              </p>
            ) : (
              <p className="text-red-300">
                ⚠ Limited intelligence • Mostly manual tracking • Basic insights only
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        {overallQuality < 80 && (
          <Button 
            onClick={onImproveData}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Zap className="h-4 w-4 mr-2" />
            Improve Data Quality
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DataQualityIndicator;