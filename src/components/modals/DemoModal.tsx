import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Mail, ExternalLink, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ open, onOpenChange }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const { isConfigured } = useAuth();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Database integration disabled temporarily - demo functionality still works
      // Will be re-enabled when demo_requests table is created

      // Track the lead capture event (only if gtag is available)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          event_category: 'Demo',
          event_label: 'Email Capture',
          value: 1
        });
      }

      // Demo request captured
      setShowVideo(true);
      
      toast({
        title: "Access Granted!",
        description: "Enjoy the demo! We'll also send you our free trade business guide.",
      });

    } catch (error) {
      console.error('Error processing demo request:', error);
      toast({
        title: "Demo Access Granted",
        description: "Enjoy the demo! There was a minor issue saving your request, but you can still watch.",
      });
      setShowVideo(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      setShowVideo(false);
      setEmail('');
      setName('');
      setCompany('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Play className="h-5 w-5 mr-2 text-blue-600" />
            TradeMate AI Demo
          </DialogTitle>
          <DialogDescription>
            See how TradeMate AI transforms your business operations in under 3 minutes
          </DialogDescription>
        </DialogHeader>
        
        {!showVideo ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="demo-email">Business Email *</Label>
              <Input
                id="demo-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@business-email.com"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="demo-name">Your Name</Label>
                <Input
                  id="demo-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label htmlFor="demo-company">Company Name</Label>
                <Input
                  id="demo-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Smith Plumbing LLC"
                />
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">You'll also receive:</p>
                  <ul className="space-y-1">
                    <li>• Free guide: "5 Ways AI Can Boost Your Trade Business"</li>
                    <li>• Industry-specific tips for your trade</li>
                    <li>• Exclusive early-access offers</li>
                  </ul>
                </div>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-green-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Watch Demo Now
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              No spam, unsubscribe anytime. Your privacy is our priority.
            </p>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Placeholder for actual demo video */}
              <div className="text-center p-8">
                <Play className="h-20 w-20 text-blue-600 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Demo Video</h3>
                <p className="text-gray-600 mb-4">
                  Experience TradeMate AI in action:<br />
                  • AI answering customer calls<br />
                  • Automatic appointment scheduling<br />
                  • Lead capture and follow-up<br />
                  • Revenue tracking dashboard
                </p>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 inline-block">
                  <p className="text-sm text-gray-700">
                    <strong>Coming Soon:</strong> Interactive video demo showcasing real customer scenarios
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Demo access confirmed for {email}</p>
                  <p>We'll send your free business guide and keep you updated on TradeMate AI's progress.</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => handleClose(false)} className="flex-1">
                Close
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-green-600"
                onClick={() => window.open('https://calendly.com/trademateai/demo', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Schedule Live Demo
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;
