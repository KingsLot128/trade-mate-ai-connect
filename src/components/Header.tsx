
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import TrialRegistrationModal from './modals/TrialRegistrationModal';

const Header = () => {
  const [showTrialModal, setShowTrialModal] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <img 
                  src="/trademate-logo.svg" 
                  alt="TradeMate AI Logo" 
                  className="w-10 h-10"
                  loading="eager"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  TradeMate AI
                </h1>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <a href="/features">Features</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/pricing">Pricing</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/contact">Contact</a>
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                onClick={() => setShowTrialModal(true)}
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <TrialRegistrationModal open={showTrialModal} onOpenChange={setShowTrialModal} />
    </>
  );
};

export default Header;
