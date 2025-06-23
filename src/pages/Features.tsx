
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar, DollarSign, Clock, Users, BarChart3, MessageSquare, Shield, Zap, CheckCircle } from "lucide-react";
import TrialRegistrationModal from '../components/modals/TrialRegistrationModal';

const Features = () => {
  const [showTrialModal, setShowTrialModal] = useState(false);

  const coreFeatures = [
    {
      icon: Phone,
      title: "24/7 AI Call Answering",
      description: "Never miss a customer call again. Our AI answers professionally, captures leads, and schedules appointments even when you're on-site.",
      benefits: ["Instant call pickup", "Professional greetings", "Lead qualification", "Emergency handling"]
    },
    {
      icon: Calendar,
      title: "Smart Appointment Scheduling",
      description: "AI automatically books appointments based on your availability, sends confirmations, and manages rescheduling requests.",
      benefits: ["Real-time calendar sync", "Automated confirmations", "Rescheduling management", "Time zone handling"]
    },
    {
      icon: DollarSign,
      title: "Revenue Recovery System",
      description: "Convert missed calls into paying customers with intelligent follow-up sequences and personalized outreach.",
      benefits: ["Automated follow-ups", "Lead scoring", "Revenue tracking", "Lost opportunity alerts"]
    },
    {
      icon: MessageSquare,
      title: "Intelligent Call Routing",
      description: "Smart call classification ensures urgent calls reach you immediately while routine inquiries are handled automatically.",
      benefits: ["Emergency escalation", "Smart categorization", "Priority routing", "Custom workflows"]
    },
    {
      icon: BarChart3,
      title: "Business Analytics Dashboard",
      description: "Track your business growth with detailed analytics on calls, bookings, revenue, and customer satisfaction.",
      benefits: ["Call volume tracking", "Conversion metrics", "Revenue insights", "Performance reports"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security protects your customer data with encryption, compliance, and secure storage.",
      benefits: ["End-to-end encryption", "HIPAA compliance", "Secure data storage", "Access controls"]
    }
  ];

  const advancedFeatures = [
    {
      icon: Clock,
      title: "Business Hours Management",
      description: "Set custom hours for different services and let AI handle after-hours calls appropriately."
    },
    {
      icon: Users,
      title: "Multi-Location Support",
      description: "Manage multiple business locations with location-specific scheduling and routing."
    },
    {
      icon: Zap,
      title: "Integration Hub",
      description: "Connect with your existing tools like QuickBooks, Google Calendar, and CRM systems."
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
              🚀 Powerful Features for Trade Professionals
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Everything You Need to 
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Grow Your Business</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              TradeMate AI combines intelligent call handling, smart scheduling, and business analytics to help trade professionals capture more leads and grow revenue.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-6"
              onClick={() => setShowTrialModal(true)}
            >
              Start Your Free Trial
            </Button>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreFeatures.map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
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

        {/* Advanced Features */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Advanced Capabilities</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {advancedFeatures.map((feature, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of trade professionals already growing with TradeMate AI
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => setShowTrialModal(true)}
            >
              Start 14-Day Free Trial
            </Button>
            <p className="text-sm mt-4 opacity-75">No credit card required • Setup in under 5 minutes</p>
          </div>
        </section>

        <Footer />
      </div>

      <TrialRegistrationModal open={showTrialModal} onOpenChange={setShowTrialModal} />
    </>
  );
};

export default Features;
