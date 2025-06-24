
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Phone, Calendar, DollarSign, Play } from "lucide-react";
import TrialRegistrationModal from './modals/TrialRegistrationModal';
import DemoModal from './modals/DemoModal';

const Hero = () => {
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
    });

    document.querySelectorAll('.scroll-fade-in').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Main Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-center lg:text-left space-y-8">
              <Badge className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border-teal-500/30 hover:bg-teal-500/30 px-4 py-2 text-sm font-medium">
                🚀 AI-Powered Call Management
              </Badge>
              
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-white">Never Miss</span>
                  <br />
                  <span className="text-teal-400">Another Job</span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  AI-powered call handling & scheduling for trades. Convert every missed call into a paying customer.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="trademate-btn-primary text-lg px-8 py-6 h-auto"
                  onClick={() => setShowDemoModal(true)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Get Your Free Demo
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 h-auto border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-slate-900 bg-transparent"
                  onClick={() => setShowTrialModal(true)}
                >
                  Start Free Trial
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 text-gray-400">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-400">500+</div>
                  <div className="text-sm">Trade Pros</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-400">99.9%</div>
                  <div className="text-sm">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-400">40%</div>
                  <div className="text-sm">More Revenue</div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative">
              {/* Main Dashboard Mockup */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">TradeMate AI Dashboard</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="text-2xl font-bold text-teal-600">247</div>
                      <div className="text-sm text-gray-600">Calls Today</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">89</div>
                      <div className="text-sm text-gray-600">Jobs Booked</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="text-2xl font-bold text-green-600">$12K</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                  </div>
                  
                  {/* Chart Area */}
                  <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg h-32 flex items-center justify-center">
                    <span className="text-white font-medium">Live Analytics</span>
                  </div>
                </div>
              </div>

              {/* Floating Phone Element */}
              <div className="absolute -top-8 -left-8 bg-teal-500 rounded-2xl p-4 shadow-xl animate-bounce">
                <Phone className="w-8 h-8 text-white" />
              </div>

              {/* Floating Calendar Element */}
              <div className="absolute -bottom-8 -right-8 bg-blue-600 rounded-2xl p-4 shadow-xl animate-pulse">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Strip */}
      <section className="py-20 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-fade-in bg-white border-0 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">24/7 Call Answering</h3>
              <p className="text-gray-600 leading-relaxed">AI handles every call professionally, even when you're on-site working.</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-fade-in bg-white border-0 shadow-lg" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Instant Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">Automatically books appointments based on your real-time availability.</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-fade-in bg-white border-0 shadow-lg" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Recover Lost Revenue</h3>
              <p className="text-gray-600 leading-relaxed">Convert every missed call into a paying customer with smart follow-ups.</p>
            </Card>
          </div>
        </div>
      </section>

      <TrialRegistrationModal open={showTrialModal} onOpenChange={setShowTrialModal} />
      <DemoModal open={showDemoModal} onOpenChange={setShowDemoModal} />
    </>
  );
};

export default Hero;
