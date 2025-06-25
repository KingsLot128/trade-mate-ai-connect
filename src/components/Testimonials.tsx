
import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
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
    <section className="py-20 px-4 relative">
      {/* Subtle teal overlay background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1ABC9C]/5 to-[#16A085]/10"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 trademate-heading">
            Trusted by Trade Professionals
          </h2>
          <p className="text-xl text-gray-600">
            See how TradeMate AI transforms businesses like yours
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 scroll-fade-in bg-white border-none shadow-lg">
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-[#1ABC9C] fill-current" />
              ))}
            </div>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              "I'm booking 40% more jobs since I never miss calls anymore, even when I'm under a sink!"
            </p>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#1ABC9C] to-[#16A085] rounded-full flex items-center justify-center mr-4">
                <span className="font-bold text-white text-lg">MJ</span>
              </div>
              <div>
                <p className="font-semibold text-[#2C3E50] text-lg">Mike Johnson</p>
                <p className="text-gray-500">Johnson Plumbing Services</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 scroll-fade-in bg-white border-none shadow-lg" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-[#1ABC9C] fill-current" />
              ))}
            </div>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              "Customers think they're talking to my actual receptionist. It's saved me thousands in missed opportunities."
            </p>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#1ABC9C] to-[#16A085] rounded-full flex items-center justify-center mr-4">
                <span className="font-bold text-white text-lg">SS</span>
              </div>
              <div>
                <p className="font-semibold text-[#2C3E50] text-lg">Sarah Smith</p>
                <p className="text-gray-500">Elite Electric Co.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Add trust indicators */}
        <div className="text-center mt-16 scroll-fade-in" style={{animationDelay: '0.4s'}}>
          <p className="text-[#2C3E50] font-semibold mb-4">Join 500+ trade professionals already growing with TradeMate AI</p>
          <div className="flex justify-center items-center space-x-8 text-gray-400">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1ABC9C]">24/7</div>
              <div className="text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1ABC9C]">99.9%</div>
              <div className="text-sm">Reliability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1ABC9C]">40%</div>
              <div className="text-sm">More Bookings</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
