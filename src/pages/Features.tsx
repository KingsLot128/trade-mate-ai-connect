import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, Calendar, DollarSign, Clock, Users, BarChart3, MessageSquare, Shield, Zap, CheckCircle,
  Brain, Building, GraduationCap, Target, Mail, Sparkles, RefreshCw, UserPlus, Play,
  TrendingUp, PieChart, Settings, Database, Lock, Globe
} from "lucide-react";
import TrialRegistrationModal from '../components/modals/TrialRegistrationModal';

const Features = () => {
  const [showTrialModal, setShowTrialModal] = useState(false);

  const businessFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Business Intelligence",
      description: "Transform your business data into actionable insights with our advanced AI engine that analyzes patterns, predicts trends, and recommends strategic actions.",
      benefits: ["Smart pattern recognition", "Predictive analytics", "Automated insights", "Custom recommendations"],
      category: "intelligence"
    },
    {
      icon: DollarSign,
      title: "Revenue Recovery System",
      description: "Never lose another opportunity. Our AI identifies missed revenue opportunities, automatically follows up with prospects, and tracks conversion rates.",
      benefits: ["Automated follow-ups", "Lead scoring", "Revenue tracking", "Lost opportunity alerts"],
      category: "revenue"
    },
    {
      icon: Mail,
      title: "SmartMail Intelligence",
      description: "Revolutionary email analysis that tracks sentiment, automates responses, and identifies business opportunities hidden in your inbox.",
      benefits: ["Sentiment analysis", "Auto-generated replies", "Conversation tracking", "Opportunity detection"],
      category: "communication"
    },
    {
      icon: Users,
      title: "Intelligent CRM",
      description: "Customer relationship management powered by AI that understands your business patterns and suggests the best next actions for each customer.",
      benefits: ["Smart contact management", "Deal pipeline tracking", "Customer insights", "Automated workflows"],
      category: "crm"
    },
    {
      icon: BarChart3,
      title: "Business Health Scoring",
      description: "Real-time business health monitoring with actionable metrics that help you understand performance and identify improvement areas.",
      benefits: ["Health score tracking", "Performance metrics", "Trend analysis", "Alert system"],
      category: "analytics"
    },
    {
      icon: Target,
      title: "ClarityLens Analytics",
      description: "Cut through business chaos with clear, focused insights that highlight what matters most for your growth and profitability.",
      benefits: ["Clarity scoring", "Focus recommendations", "Chaos reduction", "Priority insights"],
      category: "analytics"
    }
  ];

  const educationFeatures = [
    {
      icon: GraduationCap,
      title: "Instructor Dashboard",
      description: "Complete classroom management system that allows instructors to create student accounts, track progress, and manage assignments with professional oversight tools.",
      benefits: ["Student account creation", "Progress tracking", "Assignment management", "Performance analytics"],
      category: "management"
    },
    {
      icon: RefreshCw,
      title: "Sandbox Learning Environment",
      description: "Students can practice with realistic data, make mistakes, and reset their environment to start fresh - perfect for hands-on learning experiences.",
      benefits: ["Data reset functionality", "Sample data generation", "Safe practice environment", "Repeatable exercises"],
      category: "learning"
    },
    {
      icon: Play,
      title: "Guided Learning Tours",
      description: "Built-in guided tours and structured onboarding ensure students understand each feature and can navigate the platform effectively.",
      benefits: ["Interactive tutorials", "Progressive learning", "Feature discovery", "Structured guidance"],
      category: "learning"
    },
    {
      icon: UserPlus,
      title: "Student Management",
      description: "Streamlined student enrollment and management with bulk creation tools, progress monitoring, and performance tracking for educational institutions.",
      benefits: ["Bulk student creation", "Class organization", "Individual tracking", "Performance reports"],
      category: "management"
    },
    {
      icon: Settings,
      title: "Educational Customization",
      description: "Customize the platform for educational use with classroom-specific settings, assignment templates, and learning objectives alignment.",
      benefits: ["Classroom settings", "Assignment templates", "Learning objectives", "Custom workflows"],
      category: "customization"
    },
    {
      icon: Shield,
      title: "Safe Learning Environment",
      description: "Secure, contained environment where students can explore without affecting real business data, with instructor oversight and control.",
      benefits: ["Data isolation", "Instructor oversight", "Safe exploration", "Controlled access"],
      category: "security"
    }
  ];

  const integrationFeatures = [
    {
      icon: Mail,
      title: "Email Platform Integration",
      description: "Connect with Gmail, Outlook, and other email providers for seamless communication intelligence.",
      platforms: ["Gmail", "Outlook", "Yahoo Mail", "Custom SMTP"]
    },
    {
      icon: Calendar,
      title: "Calendar Synchronization",
      description: "Sync with Google Calendar, Outlook Calendar, and other scheduling platforms.",
      platforms: ["Google Calendar", "Outlook Calendar", "Apple Calendar", "CalDAV"]
    },
    {
      icon: Database,
      title: "CRM Integration",
      description: "Connect with popular CRM platforms to enhance your existing customer data.",
      platforms: ["Salesforce", "HubSpot", "Pipedrive", "Zoho CRM"]
    },
    {
      icon: DollarSign,
      title: "Financial Tools",
      description: "Integrate with accounting and invoicing platforms for complete business oversight.",
      platforms: ["QuickBooks", "Xero", "FreshBooks", "Wave"]
    }
  ];

  const CategoryBadge = ({ category }: { category: string }) => {
    const colors = {
      intelligence: "bg-purple-100 text-purple-800",
      revenue: "bg-green-100 text-green-800",
      communication: "bg-blue-100 text-blue-800",
      crm: "bg-orange-100 text-orange-800",
      analytics: "bg-indigo-100 text-indigo-800",
      management: "bg-red-100 text-red-800",
      learning: "bg-teal-100 text-teal-800",
      customization: "bg-yellow-100 text-yellow-800",
      security: "bg-gray-100 text-gray-800"
    };

    return (
      <Badge className={`${colors[category as keyof typeof colors]} mb-4`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-green-100 text-blue-800 hover:from-blue-200 hover:to-green-200">
              <Sparkles className="h-4 w-4 mr-2" />
              Complete Platform Features
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Everything You Need for
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent block mt-2">
                Business & Education Success
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive platform that serves both trade professionals running their businesses and educational institutions teaching the next generation of skilled workers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-6"
                onClick={() => setShowTrialModal(true)}
              >
                Start Free Business Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-6"
              >
                Request Education Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Business Features */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Building className="h-6 w-6 text-blue-600" />
                <h2 className="text-3xl font-bold">Business Intelligence Features</h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Powerful tools designed to help trade businesses grow revenue, improve efficiency, and make data-driven decisions.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businessFeatures.map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg">
                  <CategoryBadge category={feature.category} />
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Education Features */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-green-600" />
                <h2 className="text-3xl font-bold">Educational Excellence Features</h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive classroom management and learning tools designed specifically for trade education institutions.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {educationFeatures.map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg">
                  <CategoryBadge category={feature.category} />
                  <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-teal-100 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Features */}
        <section className="py-16 px-4 bg-gradient-to-r from-slate-100 to-blue-100">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
                <h2 className="text-3xl font-bold">Integration Ecosystem</h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect with the tools you already use to create a seamless workflow across your entire business operation.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {integrationFeatures.map((feature, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                  <div className="space-y-1">
                    {feature.platforms.map((platform, idx) => (
                      <div key={idx} className="text-xs bg-gray-100 rounded px-2 py-1 inline-block mr-1">
                        {platform}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-red-600" />
                <h2 className="text-3xl font-bold">Enterprise Security & Compliance</h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Bank-level security and compliance features that protect your business data and meet educational institution requirements.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <Lock className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Data Encryption</h3>
                <p className="text-gray-600 text-sm">End-to-end encryption for all data transmission and storage</p>
              </Card>
              <Card className="p-6 text-center">
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">FERPA Compliance</h3>
                <p className="text-gray-600 text-sm">Educational privacy compliance for student data protection</p>
              </Card>
              <Card className="p-6 text-center">
                <Globe className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">SOC 2 Certified</h3>
                <p className="text-gray-600 text-sm">Industry-standard security controls and monitoring</p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the Complete Platform?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join trade professionals and educational institutions who are already transforming their operations with our comprehensive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
                onClick={() => setShowTrialModal(true)}
              >
                Start 14-Day Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                Schedule Platform Demo
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">No credit card required • Full feature access • Educational discounts available</p>
          </div>
        </section>

        <Footer />
      </div>

      <TrialRegistrationModal open={showTrialModal} onOpenChange={setShowTrialModal} />
    </>
  );
};

export default Features;