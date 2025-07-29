import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClarityReportService } from '@/services/ClarityReportService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Sparkles, Calendar } from 'lucide-react';

const ClarityReportGenerator: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const generateReport = async () => {
    if (!user) return;

    setGenerating(true);
    try {
      const reportBlob = await ClarityReportService.generatePDFReport(user.id);
      
      // Create download link
      const url = URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clarity-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Report Generated",
        description: "Your Clarity Report has been downloaded successfully."
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const currentMonth = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <Card className="clarity-report-generator">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Clarity Report Generator
          <Badge variant="secondary" className="ml-auto">
            Premium Feature
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Generate a comprehensive business intelligence report with AI-powered insights.
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Report Period</span>
            </div>
            <div className="text-muted-foreground">{currentMonth}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="font-medium">AI Summary</span>
            </div>
            <div className="text-muted-foreground">Included</div>
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
          <h4 className="font-medium text-sm">Report Includes:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Business Health Score Analysis</li>
            <li>• Key Performance Metrics</li>
            <li>• AI-Generated Insights & Recommendations</li>
            <li>• Data Quality Assessment</li>
            <li>• Monthly Trends & Projections</li>
          </ul>
        </div>

        <Button 
          onClick={generateReport} 
          disabled={generating}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {generating ? 'Generating Report...' : 'Generate Clarity Report'}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          Reports are automatically saved to your dashboard history
        </div>
      </CardContent>
    </Card>
  );
};

export default ClarityReportGenerator;