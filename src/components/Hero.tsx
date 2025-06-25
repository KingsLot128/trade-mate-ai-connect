
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar, DollarSign, Play } from "lucide-react";
import TrialRegistrationModal from './modals/TrialRegistrationModal';
import DemoModal from './modals/DemoModal';
import FeatureCard from './ui/FeatureCard';

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-[#2C3E50]">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 sm:py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1">
              <Badge className="inline-flex items-center gap-2 bg-[#1ABC9C]/20 text-[#1ABC9C] border-[#1ABC9C]/30 hover:bg-[#1ABC9C]/30 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium">
                🚀 AI-Powered Trade Management
              </Badge>
              
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-white">Transform Your</span>
                  <br />
                  <span className="text-[#1ABC9C]">Trade Business</span>
                </h1>
                
                <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed px-4 lg:px-0">
                  AI-powered call handling, CRM integration, and business automation for trade professionals. Never miss another opportunity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 lg:px-0">
                <Button 
                  size="lg" 
                  className="tm-btn-primary text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto w-full sm:w-auto"
                  onClick={() => setShowDemoModal(true)}
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Get Free Demo
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto w-full sm:w-auto border-2 border-[#1ABC9C] text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white bg-transparent hover:scale-[1.03] transition-all duration-300"
                  onClick={() => setShowTrialModal(true)}
                >
                  Start Free Trial
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-6 sm:pt-8 text-gray-400 px-4 lg:px-0">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#1ABC9C]">500+</div>
                  <div className="text-xs sm:text-sm">Trade Pros</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#1ABC9C]">99.9%</div>
                  <div className="text-xs sm:text-sm">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#1ABC9C]">40%</div>
                  <div className="text-xs sm:text-sm">More Revenue</div>
                </div>
              </div>
            </div>

            {/* Right Side - Fixed Dashboard Preview */}
            <div className="relative order-1 lg:order-2 px-4 sm:px-6 lg:px-0">
              {/* Device Frame - Fixed alignment */}
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl mx-auto max-w-sm sm:max-w-md lg:max-w-lg transform hover:scale-[1.02] transition-all duration-700">
                {/* Screen */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-inner">
                  <div className="bg-gradient-to-br from-[#ECF0F1] to-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    {/* Dashboard Header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h3 className="text-sm sm:text-lg font-semibold text-[#2C3E50] font-montserrat">TradeMate AI Dashboard</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#1ABC9C] rounded-full animate-pulse"></div>
                        <span className="text-xs text-[#2C3E50] font-medium">Live</span>
                      </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="bg-white rounded-md sm:rounded-lg p-2 sm:p-3 text-center shadow-sm border border-gray-100">
                        <div className="text-sm sm:text-xl font-bold text-[#1ABC9C]">247</div>
                        <div className="text-xs text-[#BDC3C7]">Calls Today</div>
                      </div>
                      <div className="bg-white rounded-md sm:rounded-lg p-2 sm:p-3 text-center shadow-sm border border-gray-100">
                        <div className="text-sm sm:text-xl font-bold text-[#2C3E50]">89</div>
                        <div className="text-xs text-[#BDC3C7]">Jobs Booked</div>
                      </div>
                      <div className="bg-white rounded-md sm:rounded-lg p-2 sm:p-3 text-center shadow-sm border border-gray-100">
                        <div className="text-sm sm:text-xl font-bold text-green-600">$12K</div>
                        <div className="text-xs text-[#BDC3C7]">Revenue</div>
                      </div>
                    </div>
                    
                    {/* Enhanced Chart Area */}
                    <div className="bg-gradient-to-r from-[#1ABC9C] to-[#2C3E50] rounded-lg h-16 sm:h-24 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <span className="text-white font-medium text-sm sm:text-base relative z-10">Real-time Analytics</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements - Adjusted for mobile */}
              <div className="absolute -top-3 -left-3 sm:-top-6 sm:-left-6 bg-[#1ABC9C] rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl animate-bounce">
                <Phone className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>

              <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 bg-[#2C3E50] rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl animate-pulse">
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>

              <div className="absolute top-1/2 -right-2 sm:-right-4 bg-gradient-to-r from-[#1ABC9C] to-green-500 rounded-lg sm:rounded-xl p-1 sm:p-2 shadow-lg animate-pulse">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Feature Showcase */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-[#ECF0F1] to-blue-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[#2C3E50]">Powerful Features for Trade Professionals</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              Streamline your operations with AI-powered tools designed specifically for trades and service businesses.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={Phone}
              title="24/7 AI Call Handling"
              description="Never miss a call again. Our AI assistant handles inquiries professionally, books appointments, and captures leads even when you're busy on-site."
              gradient="from-[#1ABC9C] to-teal-600"
              delay="0s"
            />

            <FeatureCard
              icon={Calendar}
              title="Smart Scheduling"
              description="Automatically coordinate appointments based on your real-time availability, job location, and customer preferences with intelligent routing."
              gradient="from-blue-500 to-[#2C3E50]"
              delay="0.2s"
            />

            <FeatureCard
              icon={DollarSign}
              title="Revenue Recovery"
              description="Convert every missed opportunity into revenue with smart follow-ups, automated quotes, and seamless CRM integration."
              gradient="from-green-500 to-emerald-600"
              delay="0.4s"
            />
          </div>
        </div>
      </section>

      <TrialRegistrationModal open={showTrialModal} onOpenChange={setShowTrialModal} />
      <DemoModal open={showDemoModal} onOpenChange={setShowDemoModal} />
    </>
  );
};

export default Hero;
