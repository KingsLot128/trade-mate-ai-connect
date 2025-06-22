
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Mail } from 'lucide-react';

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ open, onOpenChange }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would capture the lead
    console.log('Demo request from:', email);
    setShowVideo(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Play className="h-5 w-5 mr-2 text-blue-600" />
            TradeMate AI Demo
          </DialogTitle>
          <DialogDescription>
            See how TradeMate AI transforms your business operations
          </DialogDescription>
        </DialogHeader>
        
        {!showVideo ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <Label htmlFor="demo-email">Email Address</Label>
              <Input
                id="demo-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to watch the demo"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll also send you our free guide: "5 Ways AI Can Boost Your Trade Business"
              </p>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-green-600">
              <Mail className="h-4 w-4 mr-2" />
              Watch Demo Now
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Demo Video Coming Soon</p>
                <p className="text-sm text-gray-500">
                  We're putting the finishing touches on our demo video.<br />
                  In the meantime, why not start your free trial?
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Close
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-green-600">
                Start Free Trial
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;
