
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Search, BookOpen, Play, Wrench, MessageCircle, Phone, Brain, Users, Calendar, DollarSign, ChevronRight, ExternalLink, Menu, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', icon: Play },
    { id: 'ai-features', name: 'AI Features', icon: Brain },
    { id: 'integrations', name: 'Integrations', icon: Wrench },
    { id: 'billing', name: 'Billing & Plans', icon: DollarSign },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: MessageCircle }
  ];

  const articles = [
    {
      id: 1,
      title: "Getting Started with TradeMate AI",
      description: "Complete setup guide from registration to your first AI-powered call",
      category: 'getting-started',
      readTime: '5 min',
      featured: true,
      content: "Step-by-step walkthrough of account creation, business profile setup, and initial configuration.",
      keywords: "setup, getting started, registration, configuration"
    },
    {
      id: 2,
      title: "Setting Up Your Business Profile",
      description: "Configure your trade type, service areas, and business hours for optimal AI performance",
      category: 'getting-started',
      readTime: '3 min',
      content: "Learn how to complete the setup wizard to enable personalized AI insights.",
      keywords: "business profile, setup wizard, configuration"
    },
    {
      id: 3,
      title: "Understanding AI-Powered Insights",
      description: "How our AI analyzes your business data to provide actionable recommendations",
      category: 'ai-features',
      readTime: '7 min',
      featured: true,
      content: "Deep dive into how AI insights work, what data is analyzed, and how to act on recommendations.",
      keywords: "AI insights, analytics, recommendations, business intelligence"
    },
    {
      id: 4,
      title: "AI Call Assistant Setup",
      description: "Configure your virtual assistant to handle calls professionally",
      category: 'ai-features',
      readTime: '4 min',
      content: "Customize AI greetings, call routing, and appointment scheduling behavior.",
      keywords: "AI assistant, call handling, virtual assistant"
    },
    {
      id: 5,
      title: "Connecting Your CRM (HubSpot, Salesforce)",
      description: "Sync your existing customer data with TradeMate AI",
      category: 'integrations',
      readTime: '6 min',
      content: "Complete integration guide for major CRM platforms with troubleshooting tips.",
      keywords: "CRM integration, HubSpot, Salesforce, data sync"
    },
    {
      id: 6,
      title: "Twilio Phone Integration",
      description: "Set up phone numbers and SMS capabilities",
      category: 'integrations',
      readTime: '4 min',
      content: "Configure Twilio for call handling, SMS notifications, and voicemail transcription.",
      keywords: "Twilio, phone integration, SMS, voicemail"
    },
    {
      id: 7,
      title: "Missed Call Recovery System",
      description: "Automatically follow up on missed opportunities",
      category: 'ai-features',
      readTime: '3 min',
      content: "Enable automatic callbacks, SMS follow-ups, and lead nurturing workflows.",
      keywords: "missed calls, lead recovery, follow-up automation"
    },
    {
      id: 8,
      title: "Revenue Tracking & Analytics",
      description: "Monitor your business growth and AI performance metrics",
      category: 'ai-features',
      readTime: '5 min',
      content: "Understanding dashboard metrics, revenue attribution, and ROI calculation.",
      keywords: "revenue tracking, analytics, ROI, business metrics"
    },
    {
      id: 9,
      title: "Pricing Plans Explained",
      description: "Choose the right plan for your business size and needs",
      category: 'billing',
      readTime: '3 min',
      content: "Detailed breakdown of Starter, Professional, and Enterprise plans.",
      keywords: "pricing, plans, billing, subscription"
    },
    {
      id: 10,
      title: "API Keys and Security Setup",
      description: "Secure configuration of OpenAI, Twilio, and other service integrations",
      category: 'troubleshooting',
      readTime: '6 min',
      content: "Step-by-step guide to adding API keys in Supabase Edge Function Secrets.",
      keywords: "API keys, security, OpenAI, Twilio, configuration"
    },
    {
      id: 11,
      title: "Why Am I Not Receiving Insights?",
      description: "Troubleshoot common issues with AI insights generation",
      category: 'troubleshooting',
      readTime: '4 min',
      content: "Common reasons insights aren't generating and how to fix them.",
      keywords: "troubleshooting, insights, AI problems, debugging"
    },
    {
      id: 12,
      title: "CRM Data Not Syncing",
      description: "Fix connection issues with your CRM integration",
      category: 'troubleshooting',
      readTime: '5 min',
      content: "Troubleshoot OAuth errors, permission issues, and data sync problems.",
      keywords: "CRM sync, troubleshooting, OAuth, data sync issues"
    }
  ];

  const quickActions = [
    {
      title: "Start Free Trial",
      description: "Get started with TradeMate AI today",
      icon: Play,
      action: "signup",
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      title: "Book a Demo",
      description: "See TradeMate AI in action",
      icon: Calendar,
      action: "demo",
      color: "bg-green-50 text-green-700 border-green-200"
    },
    {
      title: "Contact Support",
      description: "Get help from our team",
      icon: MessageCircle,
      action: "support",
      color: "bg-purple-50 text-purple-700 border-purple-200"
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.keywords.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(article => article.featured);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": articles.map(article => ({
      "@type": "Question",
      "name": article.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": article.description
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>TradeMate AI Help Center - Complete Guide & Support</title>
        <meta name="description" content="Get help with TradeMate AI. Complete guides, tutorials, and support for AI-powered virtual office assistant for trade professionals. Setup, integrations, troubleshooting and more." />
        <meta name="keywords" content="TradeMate AI help, virtual assistant support, trade business AI, call handling setup, CRM integration, troubleshooting guide" />
        <meta property="og:title" content="TradeMate AI Help Center - Complete Guide & Support" />
        <meta property="og:description" content="Comprehensive help center with guides, tutorials, and support for TradeMate AI virtual assistant." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://trademateai.com/help-center" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section - Mobile Optimized */}
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">TradeMate AI Help Center</h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-2">
                Everything you need to maximize your AI-powered trade business
              </p>
              
              {/* Search Bar - Mobile Optimized */}
              <div className="max-w-2xl mx-auto mb-6 md:mb-8 px-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
                  <Input
                    type="text"
                    placeholder="Search help articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 md:py-3 text-base md:text-lg"
                  />
                </div>
              </div>

              {/* Quick Actions - Mobile Stack */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Card key={index} className={`${action.color} border hover:shadow-md transition-shadow cursor-pointer`}>
                      <CardContent className="flex items-center p-3 md:p-4">
                        <Icon className="h-6 w-6 md:h-8 md:w-8 mr-3 flex-shrink-0" />
                        <div className="text-left">
                          <h3 className="font-semibold text-sm md:text-base">{action.title}</h3>
                          <p className="text-xs md:text-sm opacity-80">{action.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Category Navigation - Mobile Optimized */}
            <div className="mb-6 md:mb-8">
              {/* Mobile Category Toggle */}
              <div className="md:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowMobileCategories(!showMobileCategories)}
                  className="w-full flex items-center justify-between"
                >
                  <span>Categories: {categories.find(c => c.id === selectedCategory)?.name}</span>
                  {showMobileCategories ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>

              {/* Category Buttons */}
              <div className={`${showMobileCategories ? 'flex' : 'hidden'} md:flex flex-wrap gap-2 justify-center`}>
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowMobileCategories(false);
                      }}
                      className="flex items-center gap-2 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
                    >
                      <Icon className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                      <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Featured Articles - Mobile Optimized */}
            {selectedCategory === 'all' && (
              <div className="mb-8 md:mb-12">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Featured Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {featuredArticles.map((article) => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 bg-blue-50">
                      <CardHeader className="pb-2 md:pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Featured</Badge>
                          <span className="text-xs md:text-sm text-gray-500">{article.readTime}</span>
                        </div>
                        <CardTitle className="text-blue-900 text-base md:text-lg leading-tight">{article.title}</CardTitle>
                        <CardDescription className="text-blue-700 text-sm md:text-base">{article.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs md:text-sm text-blue-600 capitalize">{article.category.replace('-', ' ')}</span>
                          <ChevronRight className="h-4 w-4 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles - Mobile Optimized */}
            <div className="mb-8 md:mb-12">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                {selectedCategory === 'all' ? 'All Articles' : categories.find(c => c.id === selectedCategory)?.name}
                <span className="text-gray-500 text-base md:text-lg ml-2">({filteredArticles.length})</span>
              </h2>
              
              {filteredArticles.length === 0 ? (
                <Card className="text-center py-8 md:py-12">
                  <CardContent>
                    <BookOpen className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                    <p className="text-sm md:text-base text-gray-600">Try adjusting your search or browse different categories.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-4">
                            <div className="flex items-start gap-2 md:gap-3 mb-2">
                              <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-tight">{article.title}</h3>
                              {article.featured && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs flex-shrink-0">Featured</Badge>
                              )}
                            </div>
                            <p className="text-sm md:text-base text-gray-600 mb-2 line-clamp-2">{article.description}</p>
                            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                              <span className="capitalize">{article.category.replace('-', ' ')}</span>
                              <span>•</span>
                              <span>{article.readTime}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Resources - Mobile Optimized */}
            <div className="border-t pt-8 md:pt-12">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Additional Resources</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {[
                  { icon: Play, title: "Video Tutorials", desc: "Step-by-step video guides", color: "text-blue-600" },
                  { icon: Users, title: "Community Forum", desc: "Connect with other users", color: "text-green-600" },
                  { icon: BookOpen, title: "API Documentation", desc: "Technical integration guides", color: "text-purple-600" },
                  { icon: MessageCircle, title: "Live Chat", desc: "Get instant support", color: "text-orange-600" }
                ].map((resource, index) => {
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

            {/* Contact Section - Mobile Optimized */}
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
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default HelpCenter;
