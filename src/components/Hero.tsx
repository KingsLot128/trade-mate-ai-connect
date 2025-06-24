
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Phone, Calendar, DollarSign } from "lucide-react";
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
      <section className="relative py-20 px-4 bg-gradient-to-br from-[#2C3E50] to-[#34495E]">
        {/* Hero Background with Overlay */}
        <div className="absolute inset-0 bg-[#2C3E50] opacity-90"></div>
        
        <div className="container mx-auto text-center max-w-6xl relative z-10">
          <Badge className="mb-6 bg-[#1ABC9C] text-white hover:bg-[#16A085] border-none">
            🚀 AI-Powered Call Management for Trades
          </Badge>
          
          {/* Split Visual Concept with Text Overlay */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
                Never Miss Another
                <span className="block text-[#1ABC9C]">Job</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                AI-powered call handling & scheduling for trades.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="trademate-btn-primary text-lg px-8 py-6"
                  onClick={() => setShowDemoModal(true)}
                >
                  Get Your Free Demo
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 border-2 border-[#1ABC9C] text-[#1ABC9C] hover:bg-[#1ABC9C] hover:text-white"
                  onClick={() => setShowTrialModal(true)}
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
            
            {/* Visual representation of the split concept */}
            <div className="relative">
              <div className="bg-[#ECF0F1] rounded-2xl p-8 shadow-2xl">
                <div className="text-center text-[#2C3E50]">
                  <div className="w-16 h-16 bg-[#1ABC9C] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Dashboard Active</h3>
                  <p className="text-sm text-gray-600">Handling calls while you work</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase with 3-column grid */}
      <section className="py-16 px-4 bg-[#ECF0F1]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-fade-in bg-white">
              <div className="w-16 h-16 bg-[#1ABC9C] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 trademate-heading">24/7 Call Answering</h3>
              <p className="text-gray-600">AI handles every call professionally, even when you're on-site.</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-fade-in bg-white" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-[#1ABC9C] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 trademate-heading">Instant Scheduling</h3>
              <p className="text-gray-600">Automatically books appointments based on your availability.</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 scroll-fade-in bg-white" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 bg-[#1ABC9C] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 trademate-heading">Recover Lost Revenue</h3>
              <p className="text-gray-600">Convert every missed call into a paying customer.</p>
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
