
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Your trust matters. TradeMate AI collects only the data needed to operate your virtual assistant—calls, messages, and scheduling details. We never sell your information, and all data is encrypted in transit and at rest.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Review our full policy to understand how we protect your privacy under GDPR, CCPA, and other regulations.
            </p>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Key Privacy Principles</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• We only collect data necessary for service operation</li>
                <li>• Your information is never sold to third parties</li>
                <li>• All data is encrypted both in transit and at rest</li>
                <li>• We comply with GDPR, CCPA, and other privacy regulations</li>
                <li>• You have full control over your data</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
