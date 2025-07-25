import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Create Supabase client with service role for database operations
    const supabaseServiceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Create regular client for auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if Stripe is configured
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("Stripe not configured, returning local subscription data");
      
      // Get subscription from profiles table
      const { data: profileData, error: profileError } = await supabaseServiceClient
        .from("profiles")
        .select("subscription_status, subscription_tier, subscription_ends_at, next_billing_date, trial_ends_at")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        logStep("Error fetching profile", { error: profileError.message });
        return new Response(JSON.stringify({ error: "Profile not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }

      return new Response(JSON.stringify({
        subscribed: profileData.subscription_status === 'active',
        subscription_status: profileData.subscription_status,
        subscription_tier: profileData.subscription_tier,
        subscription_ends_at: profileData.subscription_ends_at,
        next_billing_date: profileData.next_billing_date,
        trial_ends_at: profileData.trial_ends_at
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // If Stripe is configured, check with Stripe
    const Stripe = (await import("https://esm.sh/stripe@14.21.0")).default;
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No Stripe customer found, updating unsubscribed state");
      
      // Upsert subscriber record
      await supabaseServiceClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscription_status: 'trial',
        subscription_tier: null,
        subscription_ends_at: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

      return new Response(JSON.stringify({ 
        subscribed: false, 
        subscription_status: 'trial',
        subscription_tier: null 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = null;
    let subscriptionEnd = null;
    let nextBillingDate = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      nextBillingDate = subscriptionEnd;
      logStep("Active subscription found", { subscriptionId: subscription.id, endDate: subscriptionEnd });
      
      // Determine subscription tier from price
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      
      if (amount <= 10000) {
        subscriptionTier = "starter";
      } else if (amount <= 20000) {
        subscriptionTier = "professional";
      } else {
        subscriptionTier = "enterprise";
      }
      logStep("Determined subscription tier", { priceId, amount, subscriptionTier });
    } else {
      logStep("No active subscription found");
    }

    // Update subscriber record
    await supabaseServiceClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscription_status: hasActiveSub ? 'active' : 'trial',
      subscription_tier: subscriptionTier,
      subscription_ends_at: subscriptionEnd,
      next_billing_date: nextBillingDate,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });
    
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_status: hasActiveSub ? 'active' : 'trial',
      subscription_tier: subscriptionTier,
      subscription_ends_at: subscriptionEnd,
      next_billing_date: nextBillingDate
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});