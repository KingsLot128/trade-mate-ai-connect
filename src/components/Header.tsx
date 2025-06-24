
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Menu, X, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import DemoModal from './modals/DemoModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                TradeMate AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <div className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              to="/features"
                            >
                              <Phone className="h-6 w-6" />
                              <div className="mb-2 mt-4 text-lg font-medium">
                                AI Call Assistant
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Never miss another call with our 24/7 AI assistant
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                        <div className="grid gap-1">
                          <NavigationMenuLink asChild>
                            <Link to="/features" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Features</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Complete feature overview
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link to="/insights" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none flex items-center">
                                <Brain className="h-4 w-4 mr-2" />
                                AI Insights
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Smart business recommendations
                              </p>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link to="/enterprise" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              <div className="text-sm font-medium leading-none">Enterprise</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Scale with confidence
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/pricing" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                        Pricing
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <NavigationMenuLink asChild>
                          <Link to="/company" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">About Us</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Learn about our mission
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/partnerships" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Partnerships</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Partner with us
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/security" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Security</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Enterprise-grade security
                            </p>
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link to="/help-center" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Help Center</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Get support
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/contact" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                        Contact
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowDemoModal(true)}
              >
                Watch Demo
              </Button>
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-3">
                <Link to="/features" className="text-gray-600 hover:text-blue-600 font-medium">
                  Features
                </Link>
                <Link to="/insights" className="text-gray-600 hover:text-blue-600 font-medium flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Insights
                </Link>
                <Link to="/pricing" className="text-gray-600 hover:text-blue-600 font-medium">
                  Pricing
                </Link>
                <Link to="/company" className="text-gray-600 hover:text-blue-600 font-medium">
                  About
                </Link>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium">
                  Contact
                </Link>
                <div className="pt-3 border-t flex flex-col space-y-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowDemoModal(true)}
                    className="justify-start"
                  >
                    Watch Demo
                  </Button>
                  <Link to="/dashboard">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <DemoModal open={showDemoModal} onOpenChange={setShowDemoModal} />
    </>
  );
};

export default Header;
