
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="bg-white rounded-xl p-8 shadow-sm border">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              By using TradeMate AI, you agree to our terms governing account usage, payments, IP rights, and liability limits. We've crafted fair, transparent terms to protect both your business and ours.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Read the full Terms of Service to learn about your rights, obligations, and how we resolve disputes.
            </p>
            
            <div className="mt-8 p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Our Commitment</h3>
              <ul className="space-y-2 text-green-800">
                <li>• Fair and transparent terms</li>
                <li>• Clear account usage guidelines</li>
                <li>• Straightforward payment terms</li>
                <li>• Protection of intellectual property rights</li>
                <li>• Fair dispute resolution process</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
