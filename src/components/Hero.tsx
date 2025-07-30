import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar, DollarSign, Play, Users, Brain, Building, GraduationCap, Sparkles, Target } from "lucide-react";
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
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                Business Intelligence + Education Platform
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                The Complete Platform for 
                <span className="bg-gradient-to-r from-[#1ABC9C] to-[#3498DB] bg-clip-text text-transparent block mt-2">
                  Trade Professionals
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-200 max-w-2xl leading-relaxed">
                From AI-powered business intelligence to classroom-ready training tools – everything trade businesses and educational institutions need to grow, learn, and succeed.
              </p>

              {/* Dual Market Value Props */}
              <div className="grid sm:grid-cols-2 gap-4 text-sm sm:text-base">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-[#1ABC9C]" />
                    <span className="font-semibold text-white">For Business Owners</span>
                  </div>
                  <p className="text-slate-200 text-xs sm:text-sm">
                    Complete CRM, AI insights, revenue recovery, and email intelligence
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-[#3498DB]" />
                    <span className="font-semibold text-white">For Education</span>
                  </div>
                  <p className="text-slate-200 text-xs sm:text-sm">
                    Instructor dashboards, student management, and sandbox learning tools
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-[#1ABC9C] hover:bg-[#16A085] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
                  onClick={() => setShowTrialModal(true)}
                >
                  Start Free Business Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-[#3498DB] text-[#3498DB] bg-white/5 hover:bg-[#3498DB] hover:text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 transition-all duration-300"
                  onClick={() => setShowDemoModal(true)}
                >
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Book School Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-6 text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1ABC9C] rounded-full"></div>
                  <span className="text-sm">Classroom Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1ABC9C] rounded-full"></div>
                  <span className="text-sm">Business Intelligence</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1ABC9C] rounded-full"></div>
                  <span className="text-sm">AI-Powered Insights</span>
                </div>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative order-1 lg:order-2">
              <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-lg mx-auto">
                {/* Dashboard Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Business Dashboard</h3>
                    <Badge className="bg-green-100 text-green-800">Live</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">$47K</div>
                      <div className="text-xs text-gray-600">Revenue</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">89%</div>
                      <div className="text-xs text-gray-600">Health Score</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">247</div>
                      <div className="text-xs text-gray-600">Leads</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">🎯 Follow up with hot leads</span>
                      <Badge variant="secondary" className="text-xs">High</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">📧 Email campaign performance</span>
                      <Badge variant="secondary" className="text-xs">Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">📊 Revenue opportunity detected</span>
                      <Badge variant="secondary" className="text-xs">$3.2K</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 animate-pulse">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium">AI Analyzing...</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium">23 Students Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 scroll-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900">
              Dual-Purpose Platform Excellence
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Built for the real world of trade professionals and the structured world of education
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Business Features */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <Badge className="bg-blue-100 text-blue-800 mb-3">
                  <Building className="h-4 w-4 mr-1" />
                  Business Intelligence
                </Badge>
                <h3 className="text-2xl font-bold mb-4">For Trade Business Owners</h3>
              </div>
              
              <div className="grid gap-4">
                <FeatureCard
                  icon={DollarSign}
                  title="Revenue Recovery"
                  description="AI identifies missed opportunities and automatically follows up with prospects"
                />
                <FeatureCard
                  icon={Brain}
                  title="Smart CRM"
                  description="Intelligent customer management with AI-powered insights and recommendations"
                />
                <FeatureCard
                  icon={Target}
                  title="Email Intelligence"
                  description="Automated email analysis, sentiment tracking, and response suggestions"
                />
              </div>
            </div>

            {/* Education Features */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <Badge className="bg-green-100 text-green-800 mb-3">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  Educational Excellence
                </Badge>
                <h3 className="text-2xl font-bold mb-4">For Trade Schools</h3>
              </div>
              
              <div className="grid gap-4">
                <FeatureCard
                  icon={Users}
                  title="Instructor Dashboard"
                  description="Manage student accounts, track progress, and oversee classroom activities"
                />
                <FeatureCard
                  icon={Play}
                  title="Sandbox Learning"
                  description="Students can reset data and practice with realistic scenarios"
                />
                <FeatureCard
                  icon={Calendar}
                  title="Guided Learning"
                  description="Built-in tours and structured onboarding for educational environments"
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center scroll-fade-in">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Organization?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Whether you're running a trade business or teaching the next generation, our platform adapts to your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowTrialModal(true)}
                >
                  Start Business Trial
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => setShowDemoModal(true)}
                >
                  Request Education Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <TrialRegistrationModal open={showTrialModal} onOpenChange={setShowTrialModal} />
      <DemoModal open={showDemoModal} onOpenChange={setShowDemoModal} />
    </>
  );
};

export default Hero;