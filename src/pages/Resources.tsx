
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BookOpen, FileText, Video, Users } from 'lucide-react';

const Resources = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Resources</h1>
          
          <p className="text-xl text-gray-600 mb-12">
            Turn insights into action with our free content library:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold">Blog</h3>
              </div>
              <p className="text-gray-600">Expert tips to win more jobs, slash no-shows, and boost margins</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold">Case Studies</h3>
              </div>
              <p className="text-gray-600">Proven results from leading contractors</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Video className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold">Webinars & Workshops</h3>
              </div>
              <p className="text-gray-600">Live product demos and strategy deep-dives</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-orange-600 mr-3" />
                <h3 className="text-xl font-semibold">Whitepapers</h3>
              </div>
              <p className="text-gray-600">In-depth guides on AI scheduling, ROI modeling, and compliance</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Resources;
