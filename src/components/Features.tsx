
import React from 'react';
import { MessageSquare, Calendar, Users } from "lucide-react";

const Features = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Grow Your Business
          </h2>
          <p className="text-xl text-gray-600">
            Powerful AI features designed specifically for trade professionals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Conversations</h3>
            <p className="text-gray-600">AI understands your business and answers customer questions naturally</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Automatic Scheduling</h3>
            <p className="text-gray-600">Seamlessly books appointments based on your availability</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Customer Follow-up</h3>
            <p className="text-gray-600">Automated reminders and follow-ups to maximize retention</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
