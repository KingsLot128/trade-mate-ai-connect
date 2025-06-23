
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Building, Zap, BarChart3, Shield } from 'lucide-react';

const Enterprise = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Enterprise Solutions</h1>
          
          <p className="text-xl text-gray-600 mb-12">
            Scale TradeMate AI across every branch, with the controls and customizations your organization demands:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Building className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold">Unlimited Seats & Locations</h3>
              </div>
              <p className="text-gray-600">Seamless multi-site deployment for your entire organization</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold">Custom Integrations</h3>
              </div>
              <p className="text-gray-600">Connect with your dispatch, CRM, ERP, and IoT tools</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold">Advanced Analytics & Reporting</h3>
              </div>
              <p className="text-gray-600">Enterprise insights and ROI tracking across all locations</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-orange-600 mr-3" />
                <h3 className="text-xl font-semibold">Enterprise Security</h3>
              </div>
              <p className="text-gray-600">SAML SSO, SCIM & Audit Logs for strict security and compliance</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Scale?</h3>
            <p className="text-lg mb-6">Contact our Enterprise team to discuss volume discounts, SLAs, and a white-glove rollout plan.</p>
            <a href="mailto:info@summitspark.net" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Enterprise Team
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Enterprise;
