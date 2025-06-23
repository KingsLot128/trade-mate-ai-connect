
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Shield, Clock, User } from 'lucide-react';

const Support = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Support</h1>
          
          <p className="text-xl text-gray-600 mb-12">Your success is our priority.</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Mail className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold">24/7 Email Support</h3>
              </div>
              <p className="text-gray-600 mb-4">Fast answers from our expert team</p>
              <a href="mailto:support@summitspark.net" className="text-blue-600 hover:text-blue-700 font-medium">
                support@summitspark.net
              </a>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <User className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold">Dedicated Account Manager</h3>
              </div>
              <p className="text-gray-600">Personalized onboarding and ongoing strategy sessions</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold">Service Level Guarantee</h3>
              </div>
              <p className="text-gray-600">99.9% uptime, backed by our SLA</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 text-orange-600 mr-3" />
                <h3 className="text-xl font-semibold">Dashboard Access</h3>
              </div>
              <p className="text-gray-600">Log in to your dashboard at any time to open or track a ticket, escalate an issue, or access our knowledge base.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Support;
