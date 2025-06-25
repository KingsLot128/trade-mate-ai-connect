
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Company = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About TradeMate AI</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed">
              TradeMate AI is transforming how trade businesses run their back-office. Founded by industry veterans who know that every missed call is lost revenue, our AI-powered virtual assistant never sleeps—answering calls, booking jobs, and following up on leads around the clock.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed mt-6">
              With TradeMate AI, you stay focused on delivering exceptional service while our intelligent platform handles outreach, scheduling, and revenue recovery—so you never lose another opportunity.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Company;
