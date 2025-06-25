
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, Lock, Users, Search } from 'lucide-react';

const Security = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Security</h1>
          
          <p className="text-xl text-gray-600 mb-12">
            We safeguard your data with industry-leading practices:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold">Compliance Standards</h3>
              </div>
              <p className="text-gray-600">ISO 27001 & SOC 2 Compliant Infrastructure</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Lock className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold">End-to-End Encryption</h3>
              </div>
              <p className="text-gray-600">TLS 1.2+ in transit, AES-256 at rest</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold">Access Control</h3>
              </div>
              <p className="text-gray-600">Multi-Factor Authentication & RBAC for granular access control</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Search className="h-8 w-8 text-orange-600 mr-3" />
                <h3 className="text-xl font-semibold">Security Testing</h3>
              </div>
              <p className="text-gray-600">Regular Penetration Tests & Vulnerability Scans</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Comprehensive Security Framework</h3>
            <p className="text-lg">Learn more about our comprehensive security framework and continuous monitoring.</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Security;
