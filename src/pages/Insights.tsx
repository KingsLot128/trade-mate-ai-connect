
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InsightsPreview from '@/components/insights/InsightsPreview';

const Insights = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InsightsPreview />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Insights;
