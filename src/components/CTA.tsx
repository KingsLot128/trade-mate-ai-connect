
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import TrialRegistrationModal from './modals/TrialRegistrationModal';
import DemoModal from './modals/DemoModal';

const CTA = () => {
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <>
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Stop Losing Customers?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of trade professionals who've increased their revenue with TradeMate AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => setShowTrialModal(true)}
            >
              Start Your Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6"
              onClick={() => setShowDemoModal(true)}
            >
              View Demo
            </Button>
          </div>
          <p className="text-sm mt-4 opacity-75">No credit card required • Setup in under 5 minutes</p>
        </div>
      </section>

      <TrialRegistrationModal open={showTrialModal} onOpenChange={setShowTrialModal} />
      <DemoModal open={showDemoModal} onOpenChange={setShowDemoModal} />
    </>
  );
};

export default CTA;
