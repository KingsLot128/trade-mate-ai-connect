import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const sampleCustomers = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    service_type: 'Residential Plumbing',
    project_scope: 'Bathroom Renovation',
    project_value_min: 2500,
    project_value_max: 3500,
    timeline_urgency: 'Within 2 weeks',
    pain_point_severity: 'High',
    relationship_stage: 'Active Lead',
    notes: 'Called about leaky pipes in master bathroom. Wants full renovation quote.'
  },
  {
    name: 'Mike Rodriguez',
    email: 'mike.r@constructionco.com',
    phone: '(555) 987-6543',
    service_type: 'Commercial HVAC',
    project_scope: 'Office Building Maintenance',
    project_value_min: 5000,
    project_value_max: 8000,
    timeline_urgency: 'Next month',
    pain_point_severity: 'Medium',
    relationship_stage: 'Qualified Prospect',
    notes: 'Property manager for 3 office buildings. Looking for maintenance contract.'
  },
  {
    name: 'Emily Chen',
    email: 'emily.chen@gmail.com',
    phone: '(555) 456-7890',
    service_type: 'Electrical',
    project_scope: 'Home Rewiring',
    project_value_min: 4000,
    project_value_max: 6000,
    timeline_urgency: 'Flexible',
    pain_point_severity: 'Low',
    relationship_stage: 'Past Customer',
    notes: 'Previous customer from 2 years ago. Referred by neighbor for electrical work.'
  },
  {
    name: 'David Thompson',
    email: 'dthompson@email.com',
    phone: '(555) 234-5678',
    service_type: 'General Contracting',
    project_scope: 'Kitchen Remodel',
    project_value_min: 15000,
    project_value_max: 25000,
    timeline_urgency: 'This month',
    pain_point_severity: 'High',
    relationship_stage: 'Hot Lead',
    notes: 'Ready to start immediately. Has permits and materials list ready.'
  },
  {
    name: 'Lisa Park',
    email: 'lisa.park@business.com',
    phone: '(555) 345-6789',
    service_type: 'Landscaping',
    project_scope: 'Commercial Property',
    project_value_min: 8000,
    project_value_max: 12000,
    timeline_urgency: 'Spring season',
    pain_point_severity: 'Medium',
    relationship_stage: 'Proposal Sent',
    notes: 'Corporate office landscaping. Waiting on board approval for budget.'
  }
];

const sampleDeals = [
  {
    name: 'Johnson Bathroom Renovation',
    amount: 3200,
    stage: 'proposal',
    probability: 75,
    expected_close_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
    description: 'Complete master bathroom renovation including new fixtures, plumbing, and tiling.'
  },
  {
    name: 'Rodriguez HVAC Contract',
    amount: 6800,
    stage: 'negotiation',
    probability: 60,
    expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 month from now
    description: 'Annual HVAC maintenance contract for three commercial office buildings.'
  },
  {
    name: 'Thompson Kitchen Remodel',
    amount: 22000,
    stage: 'qualified',
    probability: 90,
    expected_close_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
    description: 'High-end kitchen renovation with custom cabinets and granite countertops.'
  }
];

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('📊 Creating sample data for user:', userId);

    // Insert sample customers
    const customersWithUserId = sampleCustomers.map(customer => ({
      ...customer,
      user_id: userId
    }));

    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .insert(customersWithUserId)
      .select();

    if (customersError) {
      console.error('Error creating sample customers:', customersError);
      throw customersError;
    }

    // Insert sample CRM contacts
    const crmContacts = sampleCustomers.map(customer => ({
      user_id: userId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: 'active',
      notes: customer.notes,
      lead_score: Math.floor(Math.random() * 100) + 1
    }));

    const { data: contacts, error: contactsError } = await supabase
      .from('crm_contacts')
      .insert(crmContacts)
      .select();

    if (contactsError) {
      console.error('Error creating sample contacts:', contactsError);
      throw contactsError;
    }

    // Insert sample deals
    const dealsWithUserId = sampleDeals.map((deal, index) => ({
      ...deal,
      user_id: userId,
      contact_id: contacts?.[index]?.id || null
    }));

    const { error: dealsError } = await supabase
      .from('crm_deals')
      .insert(dealsWithUserId);

    if (dealsError) {
      console.error('Error creating sample deals:', dealsError);
      throw dealsError;
    }

    // Create some sample AI recommendations
    const sampleRecommendations = [
      {
        user_id: userId,
        recommendation_type: 'follow_up',
        title: 'Follow up with hot leads',
        description: 'You have 2 hot leads that haven\'t been contacted in over 48 hours. Quick follow-up could close these deals.',
        priority: 'high',
        reasoning: 'Based on lead temperature analysis',
        time_to_implement: '15 minutes',
        expected_impact: 'High'
      },
      {
        user_id: userId,
        recommendation_type: 'pricing',
        title: 'Optimize pricing strategy',
        description: 'Your average deal size is 15% below market rate. Consider adjusting your pricing for new projects.',
        priority: 'medium',
        reasoning: 'Market analysis comparison',
        time_to_implement: '1 hour',
        expected_impact: 'Medium'
      }
    ];

    const { error: recommendationsError } = await supabase
      .from('ai_recommendations')
      .insert(sampleRecommendations);

    if (recommendationsError) {
      console.error('Error creating sample recommendations:', recommendationsError);
      throw recommendationsError;
    }

    console.log('✅ Successfully created sample data for user:', userId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sample data created successfully',
        data: {
          customers: customers?.length || 0,
          contacts: contacts?.length || 0,
          deals: dealsWithUserId.length,
          recommendations: sampleRecommendations.length
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create sample data',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});