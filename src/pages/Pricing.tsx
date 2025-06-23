
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, X, Star, Zap, Crown, Phone } from "lucide-react";
import TrialRegistrationModal from '../components/modals/TrialRegistrationModal';

const Pricing = () => {
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      icon: Phone,
      description: "Perfect for solo trade professionals",
      monthlyPrice: 97,
      annualPrice: 776, // 2 months free
      savings: 388,
      features: [
        "24/7 AI call answering",
        "Basic appointment scheduling",
        "Up to 200 calls/month",
        "Email notifications",
        "Basic analytics dashboard",
        "Standard business hours",
        "Email support"
      ],
      limitations: [
        "Limited customization",
        "Basic reporting only"
      ],
      popular: false,
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      icon: Zap,
      description: "Ideal for growing trade businesses",
      monthlyPrice: 197,
      annualPrice: 1576, // 2 months free
      savings: 788,
      features: [
        "Everything in Starter",
        "Unlimited calls",
        "Advanced appointment scheduling",
        "Custom business hours",
        "Lead qualification & scoring",
        "SMS notifications",
        "CRM integration",
        "Advanced analytics",
        "Priority phone support"
      ],
      limitations: [
        "Single location only"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      icon: Crown,
      description: "For large operations and franchises",
      monthlyPrice: 397,
      annualPrice: 3176, // 2 months free
      savings: 1588,
      features: [
        "Everything in Professional",
        "Multi-location support",
        "Custom AI training",
        "White-label options",
        "Advanced integrations",
        "Custom reporting",
        "Dedicated account manager",
        "24/7 priority support",
        "Custom SLA agreements"
      ],
      limitations: [],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  const allFeatures = [
    { name: "24/7 AI Call Answering", starter: true, professional: true, enterprise: true },
    { name: "Appointment Scheduling", starter: true, professional: true, enterprise: true },
    { name: "Email Notifications", starter: true, professional: true, enterprise: true },
    { name: "Basic Analytics", starter: true, professional: true, enterprise: true },
    { name: "Monthly Calls", starter: "200", professional: "Unlimited", enterprise: "Unlimited" },
    { name: "Business Hours Setup", starter: "Standard", professional: "Custom", enterprise: "Multi-timezone" },
    { name: "Lead Qualification", starter: false, professional: true, enterprise: true },
    { name: "SMS Notifications", starter: false, professional: true, enterprise: true },
    { name: "CRM Integration", starter: false, professional: true, enterprise: true },
    { name: "Advanced Analytics", starter: false, professional: true, enterprise: true },
    { name: "Multi-location Support", starter: false, professional: false, enterprise: true },
    { name: "Custom AI Training", starter: false, professional: false, enterprise: true },
    { name: "White-label Options", starter: false, professional: false, enterprise: true },
    { name: "Dedicated Support", starter: false, professional: false, enterprise: true }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
              💰 Simple, Transparent Pricing
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Choose the Plan That 
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Grows With You</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start with a 14-day free trial. No credit card required. Cancel anytime.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-lg ${!isAnnual ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>Monthly</span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-green-600"
              />
              <span className={`text-lg ${isAnnual ? 'font-semibold text-green-600' : 'text-gray-600'}`}>
                Annual <Badge className="ml-2 bg-green-100 text-green-800">Save 20%</Badge>
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card key={index} className={`p-8 relative ${plan.popular ? 'border-2 border-blue-600 shadow-xl scale-105' : 'hover:shadow-lg'} transition-all duration-300`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="text-4xl font-bold">
                        ${isAnnual ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice}
                        <span className="text-lg font-normal text-gray-600">/month</span>
                      </div>
                      {isAnnual && (
                        <p className="text-green-600 text-sm mt-2">
                          Save ${plan.savings}/year
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-green-600' : 'bg-gray-900'} mb-6`}
                      onClick={() => {
                        if (plan.cta === "Contact Sales") {
                          window.location.href = '/contact';
                        } else {
                          setShowTrialModal(true);
                        }
                      }}
                    >
                      {plan.cta}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-600">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-orange-600 pt-4">Limitations:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-start">
                              <X className="h-4 w-4 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Compare All Features</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold">Features</th>
                    <th className="text-center py-4 px-4 font-semibold">Starter</th>
                    <th className="text-center py-4 px-4 font-semibold">Professional</th>
                    <th className="text-center py-4 px-4 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">{feature.name}</td>
                      <td className="py-4 px-4 text-center">
                        {typeof feature.starter === 'boolean' ? (
                          feature.starter ? <CheckCircle className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />
                        ) : (
                          <span className="text-sm">{feature.starter}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {typeof feature.professional === 'boolean' ? (
                          feature.professional ? <CheckCircle className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />
                        ) : (
                          <span className="text-sm">{feature.professional}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {typeof feature.enterprise === 'boolean' ? (
                          feature.enterprise ? <CheckCircle className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />
                        ) : (
                          <span className="text-sm">{feature.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="font-semibold mb-3">Can I change plans later?</h3>
                <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-3">What happens after the free trial?</h3>
                <p className="text-gray-600 text-sm">After 14 days, you'll be charged for your selected plan. Cancel anytime during the trial with no charge.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-3">Do you offer refunds?</h3>
                <p className="text-gray-600 text-sm">Yes, we offer a 30-day money-back guarantee if you're not satisfied with TradeMate AI.</p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-3">Is setup included?</h3>
                <p className="text-gray-600 text-sm">Setup is included with all plans. Professional and Enterprise plans include personalized onboarding.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Growing Your Business Today
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of trade professionals who've increased their revenue with TradeMate AI
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => setShowTrialModal(true)}
            >
              Start 14-Day Free Trial
            </Button>
            <p className="text-sm mt-4 opacity-75">No credit card required • Cancel anytime</p>
          </div>
        </section>

        <Footer />
      </div>

      <TrialRegistrationModal open={showTrialModal} onOpenChange={setShowTrialModal} />
    </>
  );
};

export default Pricing;
