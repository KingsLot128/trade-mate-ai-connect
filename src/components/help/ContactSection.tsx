
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const ContactSection = () => {
  return (
    <div className="mt-8 md:mt-12 text-center bg-white rounded-xl p-6 md:p-8 shadow-sm border">
      <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Still Need Help?</h2>
      <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
        Our support team is here to help you succeed with TradeMate AI
      </p>
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
        <Link to="/support">
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </Link>
        <a href="mailto:support@summitspark.net">
          <Button variant="outline" className="w-full sm:w-auto">
            <MessageCircle className="h-4 w-4 mr-2" />
            Email Us
          </Button>
        </a>
      </div>
    </div>
  );
};

export default ContactSection;
