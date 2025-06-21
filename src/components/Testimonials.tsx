
import React from 'react';
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Trusted by Trade Professionals
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "TradeMate AI has transformed my plumbing business. I'm booking 40% more jobs since I never miss calls anymore, even when I'm under a sink!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="font-semibold text-blue-600">MJ</span>
              </div>
              <div>
                <p className="font-semibold">Mike Johnson</p>
                <p className="text-sm text-gray-500">Johnson Plumbing Services</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "The AI is so smart, customers think they're talking to my actual receptionist. It's saved me thousands in missed opportunities."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="font-semibold text-green-600">SS</span>
              </div>
              <div>
                <p className="font-semibold">Sarah Smith</p>
                <p className="text-sm text-gray-500">Elite Electric Co.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
