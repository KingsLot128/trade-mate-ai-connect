import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BookOpen, Play, Wrench, MessageCircle, Brain, Users, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import HelpCenterSearchBar from '../components/help/HelpCenterSearchBar';
import CategoryNavigation from '../components/help/CategoryNavigation';
import ArticleCard from '../components/help/ArticleCard';
import QuickActions from '../components/help/QuickActions';
import AdditionalResources from '../components/help/AdditionalResources';
import ContactSection from '../components/help/ContactSection';

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
            {/* Hero Section */}
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">TradeMate AI Help Center</h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 px-2">
                Everything you need to maximize your AI-powered trade business
              </p>
              
              <HelpCenterSearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              <QuickActions />
            </div>

            <CategoryNavigation
              categories={categories}
              selectedCategory={selectedCategory}
              showMobileCategories={showMobileCategories}
              onCategorySelect={setSelectedCategory}
              onToggleMobileCategories={() => setShowMobileCategories(!showMobileCategories)}
            />

            {/* Featured Articles */}
            {selectedCategory === 'all' && (
              <div className="mb-8 md:mb-12">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Featured Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {featuredArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} isFeatured />
                  ))}
                </div>
              </div>
            )}

            {/* All Articles */}
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
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>

            <AdditionalResources />
            <ContactSection />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default HelpCenter;
