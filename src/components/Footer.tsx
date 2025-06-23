
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/trademate-logo.svg" 
                alt="TradeMate AI Logo" 
                className="w-8 h-8"
              />
              <h3 className="text-xl font-bold">TradeMate AI</h3>
            </div>
            <p className="text-gray-400 mb-4">
              The AI-powered virtual office assistant that helps trade professionals capture more leads and grow their business.
            </p>
            <p className="text-gray-400 text-sm">
              © 2024 TradeMate AI. All rights reserved.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/" className="hover:text-white transition-colors">Demo</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Enterprise</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Partnerships</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/contact" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            Questions? Email us at <a href="mailto:info@summitspark.net" className="text-blue-400 hover:text-blue-300">info@summitspark.net</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
