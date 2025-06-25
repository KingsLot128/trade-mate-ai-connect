
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Code, Users, Handshake } from 'lucide-react';

const Partnerships = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Partnerships</h1>
          
          <p className="text-xl text-gray-600 mb-12">
            Accelerate growth and delight your customers by teaming up with TradeMate AI:
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
              <Code className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Technology Integrators</h3>
              <p className="text-gray-600">Embed our API into your solutions</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Resellers & Referral Partners</h3>
              <p className="text-gray-600">Earn generous revenue shares</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
              <Handshake className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Co-Marketing Programs</h3>
              <p className="text-gray-600">Joint webinars, case studies, events</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Build the Future Together</h3>
            <p className="text-lg mb-6">Let's build the future of field service together</p>
            <a href="mailto:partners@summitspark.net" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              partners@summitspark.net
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Partnerships;
