
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const SetupGuide = () => {
  const steps = [
    {
      title: "✅ Supabase Connected",
      status: "complete",
      description: "Database and authentication are ready",
    },
    {
      title: "🤖 OpenAI API Setup",
      status: "pending",
      description: "Add your OpenAI API key for AI conversations",
      instructions: [
        "Go to https://platform.openai.com/api-keys",
        "Create a new API key",
        "Copy the key (starts with sk-...)",
        "In Supabase Dashboard → Edge Functions → Secrets",
        "Add secret: OPENAI_API_KEY = your_key_here"
      ]
    },
    {
      title: "📞 Twilio Integration",
      status: "pending",
      description: "Enable phone calls and SMS",
      instructions: [
        "Sign up at https://www.twilio.com/try-twilio",
        "Get your Account SID and Auth Token from Console",
        "Buy a phone number (around $1/month)",
        "In Supabase → Edge Functions → Secrets, add:",
        "TWILIO_ACCOUNT_SID = your_account_sid",
        "TWILIO_AUTH_TOKEN = your_auth_token",
        "TWILIO_PHONE_NUMBER = your_twilio_number"
      ]
    },
    {
      title: "📧 Email Notifications",
      status: "pending", 
      description: "Send follow-up emails and notifications",
      instructions: [
        "Sign up at https://resend.com (free tier: 3k emails/month)",
        "Get your API key from dashboard",
        "In Supabase → Edge Functions → Secrets:",
        "RESEND_API_KEY = your_resend_key"
      ]
    },
    {
      title: "🌐 Deploy to Your Domain",
      status: "pending",
      description: "Host on your Hostinger plan",
      instructions: [
        "Click 'Publish' button in Lovable (top-right)",
        "Download the build files or connect GitHub",
        "In Hostinger control panel:",
        "Upload files to public_html folder",
        "Point your domain to the files",
        "Set up SSL certificate (usually automatic)"
      ]
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">🚀 TradeMate AI Setup Guide</h1>
        <p className="text-gray-600">Follow these steps to make your MVP fully functional</p>
      </div>

      {steps.map((step, index) => (
        <Card key={index} className={step.status === 'complete' ? 'border-green-200 bg-green-50' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {step.status === 'complete' ? 
                  <CheckCircle className="h-6 w-6 text-green-600" /> : 
                  <Circle className="h-6 w-6 text-gray-400" />
                }
                <div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </div>
              </div>
              <Badge variant={step.status === 'complete' ? 'default' : 'secondary'}>
                {step.status === 'complete' ? 'Done' : 'To Do'}
              </Badge>
            </div>
          </CardHeader>
          
          {step.instructions && (
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-gray-700">Step-by-step:</h4>
                <ol className="space-y-2">
                  {step.instructions.map((instruction, i) => (
                    <li key={i} className="flex items-start space-x-2 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {i + 1}
                      </span>
                      <span className="flex-1">{instruction}</span>
                      {instruction.includes('http') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(instruction.match(/https?:\/\/[^\s]+/)?.[0], '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">💡 Pro Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-700">
          <p>• Start with OpenAI + Twilio for core functionality</p>
          <p>• Test each integration before moving to the next</p>
          <p>• Keep your API keys secure and never share them</p>
          <p>• Monitor usage to avoid unexpected charges</p>
          <p>• Use Supabase's built-in monitoring for database queries</p>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">🎯 Quick Start Costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-green-700">
          <p>• OpenAI API: ~$20-50/month (depending on usage)</p>
          <p>• Twilio: $1/month for phone number + $0.0075/minute for calls</p>
          <p>• Resend Email: Free up to 3,000 emails/month</p>
          <p>• Supabase: Free tier covers MVP needs</p>
          <p>• <strong>Total startup cost: ~$25-55/month</strong></p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupGuide;
