
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Phone, Calendar, DollarSign } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
          🚀 Now Available for Trade Professionals
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Never Miss Another
          <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Customer Call</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          TradeMate AI automatically answers calls, schedules jobs, and converts missed opportunities into booked revenue - 24/7, even when you're on-site.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-6">
            Start 14-Day Free Trial
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
            Watch Demo
          </Button>
        </div>
        
        {/* Value Proposition Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">24/7 Call Answering</h3>
            <p className="text-gray-600 text-sm">Never miss a customer call again, even during busy job sites</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Instant Scheduling</h3>
            <p className="text-gray-600 text-sm">AI automatically books appointments and manages your calendar</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Recover Lost Revenue</h3>
            <p className="text-gray-600 text-sm">Convert every missed call into a paying customer</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
