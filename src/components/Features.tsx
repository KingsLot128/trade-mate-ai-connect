
import React, { useEffect } from 'react';
import { Phone, Calendar, DollarSign } from "lucide-react";

const Features = () => {
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
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 trademate-heading">
            Everything You Need to Grow Your Business
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful AI features designed specifically for trade professionals
          </p>
        </div>

        {/* Dashboard Preview Section */}
        <div className="mb-20 scroll-fade-in">
          <div className="bg-gradient-to-br from-[#2C3E50] to-[#34495E] rounded-3xl p-8 md:p-12 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl inline-block">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1ABC9C] mb-2">247</div>
                  <div className="text-sm text-gray-600">Calls Answered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1ABC9C] mb-2">89</div>
                  <div className="text-sm text-gray-600">Jobs Booked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1ABC9C] mb-2">$42K</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
              </div>
              <div className="h-32 bg-gradient-to-r from-[#1ABC9C] to-[#16A085] rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Live Analytics Dashboard</span>
              </div>
            </div>
            <p className="text-white text-lg mt-8 max-w-2xl mx-auto">
              Track calls answered, jobs booked, and revenue—in real time.
            </p>
          </div>
        </div>

        {/* Asymmetric Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 scroll-fade-in">
            <div className="bg-[#ECF0F1] rounded-2xl p-8 h-full flex flex-col justify-center">
              <div className="w-16 h-16 bg-[#1ABC9C] rounded-2xl flex items-center justify-center mb-6">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 trademate-heading">Smart Conversations</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                AI understands your business and answers customer questions naturally, 
                handling everything from basic inquiries to complex scheduling requests.
              </p>
            </div>
          </div>
          
          <div className="scroll-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="bg-white border-2 border-[#1ABC9C] rounded-2xl p-8 h-full flex flex-col justify-center text-center">
              <div className="w-16 h-16 bg-[#1ABC9C] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 trademate-heading">Automatic Scheduling</h3>
              <p className="text-gray-600">
                Seamlessly books appointments based on your availability
              </p>
            </div>
          </div>

          <div className="scroll-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="bg-white border-2 border-[#1ABC9C] rounded-2xl p-8 h-full flex flex-col justify-center text-center">
              <div className="w-16 h-16 bg-[#1ABC9C] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 trademate-heading">Customer Follow-up</h3>
              <p className="text-gray-600">
                Automated reminders and follow-ups to maximize retention
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 scroll-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="bg-gradient-to-r from-[#1ABC9C] to-[#16A085] rounded-2xl p-8 h-full flex flex-col justify-center text-white">
              <h3 className="text-2xl font-bold mb-4">Revenue Recovery System</h3>
              <p className="text-lg leading-relaxed opacity-90">
                Convert missed calls into paying customers with intelligent follow-up 
                sequences and personalized outreach that works around the clock.
              </p>
              <div className="mt-6">
                <span className="text-3xl font-bold">40%</span>
                <span className="text-lg ml-2 opacity-90">increase in bookings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
