
import React from 'react';
import { Play, Users, BookOpen, MessageCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface Resource {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  color: string;
}

const resources: Resource[] = [
  { icon: Play, title: "Video Tutorials", desc: "Step-by-step video guides", color: "text-blue-600" },
  { icon: Users, title: "Community Forum", desc: "Connect with other users", color: "text-green-600" },
  { icon: BookOpen, title: "API Documentation", desc: "Technical integration guides", color: "text-purple-600" },
  { icon: MessageCircle, title: "Live Chat", desc: "Get instant support", color: "text-orange-600" }
];

const AdditionalResources = () => {
  return (
    <div className="border-t pt-8 md:pt-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Additional Resources</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-3 md:p-6">
                <Icon className={`h-6 w-6 md:h-8 md:w-8 ${resource.color} mx-auto mb-2 md:mb-3`} />
                <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">{resource.title}</h3>
                <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4 line-clamp-2">{resource.desc}</p>
                {resource.title === "Live Chat" ? (
                  <Link to="/support">
                    <Button variant="outline" size="sm" className="w-full text-xs md:text-sm">
                      <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">Chat Now</span>
                      <span className="sm:hidden">Chat</span>
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="w-full text-xs md:text-sm">
                    <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">
                      {resource.title === "Video Tutorials" ? "Watch Now" : 
                       resource.title === "Community Forum" ? "Join Forum" : "View Docs"}
                    </span>
                    <span className="sm:hidden">
                      {resource.title === "Video Tutorials" ? "Watch" : 
                       resource.title === "Community Forum" ? "Join" : "View"}
                    </span>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdditionalResources;
