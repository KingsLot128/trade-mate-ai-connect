
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  console.log('Footer rendering');
  
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
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="hover:text-white transition-colors"
                  onClick={() => console.log('Dashboard link clicked from footer')}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    console.log('Demo button clicked from footer');
                    // This would trigger the demo modal
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Demo
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/company" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
              <li><Link to="/enterprise" className="hover:text-white transition-colors">Enterprise</Link></li>
              <li><Link to="/partnerships" className="hover:text-white transition-colors">Partnerships</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              <li><Link to="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
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
