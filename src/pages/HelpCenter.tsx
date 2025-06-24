
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Search, BookOpen, Play, Wrench, MessageCircle, Phone, Brain, Users, Calendar, DollarSign, ChevronRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      content: "Step-by-step walkthrough of account creation, business profile setup, and initial configuration."
    },
    {
      id: 2,
      title: "Setting Up Your Business Profile",
      description: "Configure your trade type, service areas, and business hours for optimal AI performance",
      category: 'getting-started',
      readTime: '3 min',
      content: "Learn how to complete the setup wizard to enable personalized AI insights."
    },
    {
      id: 3,
      title: "Understanding AI-Powered Insights",
      description: "How our AI analyzes your business data to provide actionable recommendations",
      category: 'ai-features',
      readTime: '7 min',
      featured: true,
      content: "Deep dive into how AI insights work, what data is analyzed, and how to act on recommendations."
    },
    {
      id: 4,
      title: "AI Call Assistant Setup",
      description: "Configure your virtual assistant to handle calls professionally",
      category: 'ai-features',
      readTime: '4 min',
      content: "Customize AI greetings, call routing, and appointment scheduling behavior."
    },
    {
      id: 5,
      title: "Connecting Your CRM (HubSpot, Salesforce)",
      description: "Sync your existing customer data with TradeMate AI",
      category: 'integrations',
      readTime: '6 min',
      content: "Complete integration guide for major CRM platforms with troubleshooting tips."
    },
    {
      id: 6,
      title: "Twilio Phone Integration",
      description: "Set up phone numbers and SMS capabilities",
      category: 'integrations',
      readTime: '4 min',
      content: "Configure Twilio for call handling, SMS notifications, and voicemail transcription."
    },
    {
      id: 7,
      title: "Missed Call Recovery System",
      description: "Automatically follow up on missed opportunities",
      category: 'ai-features',
      readTime: '3 min',
      content: "Enable automatic callbacks, SMS follow-ups, and lead nurturing workflows."
    },
    {
      id: 8,
      title: "Revenue Tracking & Analytics",
      description: "Monitor your business growth and AI performance metrics",
      category: 'ai-features',
      readTime: '5 min',
      content: "Understanding dashboard metrics, revenue attribution, and ROI calculation."
    },
    {
      id: 9,
      title: "Pricing Plans Explained",
      description: "Choose the right plan for your business size and needs",
      category: 'billing',
      readTime: '3 min',
      content: "Detailed breakdown of Starter, Professional, and Enterprise plans."
    },
    {
      id: 10,
      title: "API Keys and Security Setup",
      description: "Secure configuration of OpenAI, Twilio, and other service integrations",
      category: 'troubleshooting',
      readTime: '6 min',
      content: "Step-by-step guide to adding API keys in Supabase Edge Function Secrets."
    },
    {
      id: 11,
      title: "Why Am I Not Receiving Insights?",
      description: "Troubleshoot common issues with AI insights generation",
      category: 'troubleshooting',
      readTime: '4 min',
      content: "Common reasons insights aren't generating and how to fix them."
    },
    {
      id: 12,
      title: "CRM Data Not Syncing",
      description: "Fix connection issues with your CRM integration",
      category: 'troubleshooting',
      readTime: '5 min',
      content: "Troubleshoot OAuth errors, permission issues, and data sync problems."
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
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(article => article.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">TradeMate AI Help Center</h1>
            <p className="text-xl text-gray-600 mb-8">
              Everything you need to maximize your AI-powered trade business
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for help articles, guides, and tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Card key={index} className={`${action.color} border hover:shadow-md transition-shadow cursor-pointer`}>
                    <CardContent className="flex items-center p-4">
                      <Icon className="h-8 w-8 mr-3" />
                      <div className="text-left">
                        <h3 className="font-semibold">{action.title}</h3>
                        <p className="text-sm opacity-80">{action.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Category Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Featured Articles */}
          {selectedCategory === 'all' && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Featured Guides</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 bg-blue-50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                        <span className="text-sm text-gray-500">{article.readTime}</span>
                      </div>
                      <CardTitle className="text-blue-900">{article.title}</CardTitle>
                      <CardDescription className="text-blue-700">{article.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600 capitalize">{article.category.replace('-', ' ')}</span>
                        <ChevronRight className="h-4 w-4 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Articles */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              {selectedCategory === 'all' ? 'All Articles' : categories.find(c => c.id === selectedCategory)?.name}
              <span className="text-gray-500 text-lg ml-2">({filteredArticles.length})</span>
            </h2>
            
            {filteredArticles.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">Try adjusting your search or browse different categories.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                          {article.featured && (
                            <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{article.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="capitalize">{article.category.replace('-', ' ')}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Additional Resources */}
          <div className="border-t pt-12">
            <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Play className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Video Tutorials</h3>
                  <p className="text-sm text-gray-600 mb-4">Step-by-step video guides</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Community Forum</h3>
                  <p className="text-sm text-gray-600 mb-4">Connect with other users</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Join Forum
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">API Documentation</h3>
                  <p className="text-sm text-gray-600 mb-4">Technical integration guides</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Docs
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <MessageCircle className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-sm text-gray-600 mb-4">Get instant support</p>
                  <Link to="/support">
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center bg-white rounded-xl p-8 shadow-sm border">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you succeed with TradeMate AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/support">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
              <a href="mailto:support@summitspark.net">
                <Button variant="outline">
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
  );
};

export default HelpCenter;
