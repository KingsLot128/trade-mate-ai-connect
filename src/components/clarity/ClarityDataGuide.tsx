import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  DollarSign,
  Phone,
  Users,
  Settings,
  FileText,
  Target,
  Brain
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface DataRequirement {
  category: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  items: string[];
  completed: boolean;
  route: string;
  priority: 'high' | 'medium' | 'low';
}

interface ClarityDataGuideProps {
  dataQuality: {
    overallQuality: number;
    missingAreas: string[];
    hasFinancialData: boolean;
    hasCallData: boolean;
    hasCustomerData: boolean;
    hasIntegrationData: boolean;
  };
  loadingTime: number;
}

const ClarityDataGuide: React.FC<ClarityDataGuideProps> = ({ dataQuality, loadingTime }) => {
  const navigate = useNavigate();

  const requirements: DataRequirement[] = [
    {
      category: 'financial',
      icon: DollarSign,
      title: 'Financial Intelligence',
      description: 'Revenue tracking, expenses, and financial health metrics',
      items: [
        'Monthly revenue figures',
        'Operating expenses',
        'Profit margins',
        'Cash flow patterns'
      ],
      completed: dataQuality.hasFinancialData,
      route: '/data-collection?section=financial',
      priority: 'high'
    },
    {
      category: 'calls',
      icon: Phone,
      title: 'Call Intelligence',
      description: 'Call quality, conversation insights, and communication patterns',
      items: [
        'Call recordings and notes',
        'Customer sentiment',
        'Call outcomes',
        'Follow-up requirements'
      ],
      completed: dataQuality.hasCallData,
      route: '/data-collection?section=calls',
      priority: 'high'
    },
    {
      category: 'customers',
      icon: Users,
      title: 'Customer Intelligence',
      description: 'Customer relationships, pipeline data, and interaction history',
      items: [
        'Customer profiles',
        'Deal pipeline',
        'Interaction history',
        'Customer satisfaction scores'
      ],
      completed: dataQuality.hasCustomerData,
      route: '/contacts',
      priority: 'medium'
    },
    {
      category: 'operations',
      icon: Settings,
      title: 'Operational Data',
      description: 'Business processes, efficiency metrics, and operational insights',
      items: [
        'Business processes',
        'Task completion rates',
        'Resource utilization',
        'Performance metrics'
      ],
      completed: dataQuality.hasIntegrationData,
      route: '/data-collection?section=operational',
      priority: 'medium'
    }
  ];

  const incompleteRequirements = requirements.filter(r => !r.completed);
  const isDataInsufficient = dataQuality.overallQuality < 60;

  if (!isDataInsufficient) {
    return null;
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Main Alert */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-white">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Brain className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Clarity Lens Needs More Intelligence</h2>
              <p className="text-amber-200 text-sm font-normal">
                Only {dataQuality.overallQuality}% of required data available • {loadingTime > 3000 ? 'Slow' : 'Limited'} insights
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h3 className="font-semibold text-white mb-2 flex items-center">
              <Target className="h-4 w-4 mr-2 text-blue-400" />
              What You're Missing
            </h3>
            <p className="text-slate-300 text-sm mb-3">
              Clarity Lens uses AI to analyze your business data and provide real-time insights. 
              With more complete data, you'll get:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="text-emerald-300">✓ Predictive threat detection</div>
              <div className="text-emerald-300">✓ Real-time performance alerts</div>
              <div className="text-emerald-300">✓ AI-powered recommendations</div>
              <div className="text-emerald-300">✓ Accurate chaos index scoring</div>
              <div className="text-emerald-300">✓ Financial health monitoring</div>
              <div className="text-emerald-300">✓ Customer satisfaction insights</div>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/data-collection')}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            <Database className="h-4 w-4 mr-2" />
            Complete Data Setup
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Data Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {incompleteRequirements.map((requirement) => {
          const IconComponent = requirement.icon;
          
          return (
            <Card 
              key={requirement.category}
              className={`bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-colors cursor-pointer ${
                requirement.priority === 'high' ? 'ring-1 ring-red-500/20' : ''
              }`}
              onClick={() => navigate(requirement.route)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      requirement.priority === 'high' 
                        ? 'bg-red-500/20' 
                        : 'bg-blue-500/20'
                    }`}>
                      <IconComponent className={`h-4 w-4 ${
                        requirement.priority === 'high' 
                          ? 'text-red-400' 
                          : 'text-blue-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{requirement.title}</h3>
                      <p className="text-xs text-slate-400">{requirement.description}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      requirement.priority === 'high' 
                        ? 'text-red-400 border-red-400' 
                        : 'text-amber-400 border-amber-400'
                    }`}
                  >
                    {requirement.priority}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-slate-300 mb-2">Missing Data Points:</h4>
                  {requirement.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center text-xs text-slate-400">
                      <AlertTriangle className="h-3 w-3 mr-2 text-amber-400" />
                      {item}
                    </div>
                  ))}
                  {requirement.items.length > 3 && (
                    <div className="text-xs text-slate-500">
                      +{requirement.items.length - 3} more items
                    </div>
                  )}
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-3 text-xs border-slate-600 hover:border-slate-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(requirement.route);
                  }}
                >
                  Add {requirement.title}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Quick Setup Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/data-collection?quick=financial')}
              className="border-slate-600 hover:border-slate-500"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Financial Setup
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/contacts')}
              className="border-slate-600 hover:border-slate-500"
            >
              <Users className="h-4 w-4 mr-2" />
              Add Customers
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/integrations')}
              className="border-slate-600 hover:border-slate-500"
            >
              <Settings className="h-4 w-4 mr-2" />
              Connect Tools
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClarityDataGuide;