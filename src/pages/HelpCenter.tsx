
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BookOpen, Play, Wrench, MessageCircle } from 'lucide-react';

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Help Center</h1>
          
          <p className="text-xl text-gray-600 mb-12">
            Your go-to self-service portal:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Play className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold">Quick-Start Guides</h3>
              </div>
              <p className="text-gray-600">Get up and running in minutes</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold">Step-by-Step Tutorials</h3>
              </div>
              <p className="text-gray-600">Detailed instructions for every feature</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Wrench className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold">Troubleshooting Articles</h3>
              </div>
              <p className="text-gray-600">Fast resolution for common issues</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <MessageCircle className="h-8 w-8 text-orange-600 mr-3" />
                <h3 className="text-xl font-semibold">Community Forum</h3>
              </div>
              <p className="text-gray-600">Share best practices with peers</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HelpCenter;
