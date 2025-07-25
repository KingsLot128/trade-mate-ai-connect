import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("Stripe not configured");
      return new Response(JSON.stringify({ 
        error: "Stripe is not configured yet. Please add your STRIPE_SECRET_KEY to continue." 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Create Supabase client with service role
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
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { plan_id, interval = 'monthly' } = await req.json();
    if (!plan_id) throw new Error("Plan ID is required");
    logStep("Request data", { plan_id, interval });

    // Get plan details from database
    const { data: planData, error: planError } = await supabaseServiceClient
      .from("subscription_plans")
      .select("*")
      .eq("plan_id", plan_id)
      .eq("is_active", true)
      .single();

    if (planError || !planData) {
      throw new Error(`Plan not found: ${plan_id}`);
    }
    logStep("Plan found", { plan: planData.name });

    const Stripe = (await import("https://esm.sh/stripe@14.21.0")).default;
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    }

    // Calculate price based on interval
    const priceAmount = interval === 'yearly' 
      ? planData.price_yearly_cents || planData.price_monthly_cents * 12
      : planData.price_monthly_cents;

    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: `${planData.name} Plan`,
              description: planData.description,
            },
            unit_amount: priceAmount,
            recurring: { interval: interval === 'yearly' ? 'year' : 'month' },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/settings/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/settings/billing?canceled=true`,
      metadata: {
        user_id: user.id,
        plan_id: plan_id,
        interval: interval,
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});