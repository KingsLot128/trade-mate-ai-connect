// Chaos scoring algorithm for business clarity assessment

export interface ChaosQuizResponse {
  daily_overwhelm: number;
  revenue_predictability: number;
  customer_acquisition: string;
  biggest_challenge: string;
  task_management_difficulty: number;
  financial_tracking: number;
  customer_communication: number;
  time_management: number;
}

export interface ChaosResults {
  chaos_score: number;
  clarity_zone: 'chaos' | 'control' | 'clarity';
  industry_percentile: number;
  quick_wins: string[];
  strategic_opportunities: string[];
  chaos_factors: string[];
}

// Industry benchmark data (mock data - would be real in production)
const INDUSTRY_BENCHMARKS = {
  'Plumbing': { average_chaos: 65, top_percentile_threshold: 35 },
  'Electrical': { average_chaos: 58, top_percentile_threshold: 32 },
  'HVAC': { average_chaos: 62, top_percentile_threshold: 38 },
  'General Contractor': { average_chaos: 72, top_percentile_threshold: 45 },
  'Roofing': { average_chaos: 68, top_percentile_threshold: 42 },
  'Flooring': { average_chaos: 55, top_percentile_threshold: 30 },
  'Painting': { average_chaos: 52, top_percentile_threshold: 28 },
  'Landscaping': { average_chaos: 60, top_percentile_threshold: 35 },
  'Carpentry': { average_chaos: 58, top_percentile_threshold: 33 },
  'Other': { average_chaos: 60, top_percentile_threshold: 35 }
};

export function calculateChaosScore(responses: ChaosQuizResponse): number {
  // Convert 1-10 scales to chaos contribution (10 = high chaos, 1 = low chaos)
  const overwhelmScore = responses.daily_overwhelm * 10; // 10-100
  const unpredictabilityScore = (11 - responses.revenue_predictability) * 8; // 8-80
  const taskDifficultyScore = responses.task_management_difficulty * 8; // 8-80
  const financialTrackingScore = (11 - responses.financial_tracking) * 6; // 6-60
  const communicationScore = responses.customer_communication * 6; // 6-60
  const timeManagementScore = responses.time_management * 8; // 8-80
  
  // Customer acquisition method chaos contribution
  const acquisitionChaos = getAcquisitionChaos(responses.customer_acquisition);
  
  // Biggest challenge chaos contribution
  const challengeChaos = getChallengeChaos(responses.biggest_challenge);
  
  // Calculate weighted total (max possible: ~500)
  const totalScore = 
    overwhelmScore + 
    unpredictabilityScore + 
    taskDifficultyScore + 
    financialTrackingScore + 
    communicationScore + 
    timeManagementScore + 
    acquisitionChaos + 
    challengeChaos;
  
  // Convert to 0-100 scale (lower is better)
  return Math.min(100, Math.round(totalScore / 5));
}

function getAcquisitionChaos(method: string): number {
  const chaosLevels = {
    'Repeat customers': 10,
    'Referrals': 15,
    'Online marketing': 25,
    'Cold outreach': 35,
    'Other': 30
  };
  return chaosLevels[method as keyof typeof chaosLevels] || 30;
}

function getChallengeChaos(challenge: string): number {
  const chaosLevels = {
    'Pricing/profitability': 15,
    'Team coordination': 20,
    'Time management': 25,
    'Managing cash flow': 30,
    'Finding customers': 35
  };
  return chaosLevels[challenge as keyof typeof chaosLevels] || 25;
}

export function getClarityZone(chaosScore: number): 'chaos' | 'control' | 'clarity' {
  if (chaosScore >= 70) return 'chaos';
  if (chaosScore >= 40) return 'control';
  return 'clarity';
}

export function getIndustryPercentile(chaosScore: number, industry: string): number {
  const benchmark = INDUSTRY_BENCHMARKS[industry as keyof typeof INDUSTRY_BENCHMARKS] || INDUSTRY_BENCHMARKS['Other'];
  
  if (chaosScore <= benchmark.top_percentile_threshold) {
    return 90 + Math.floor(Math.random() * 10); // Top 10%
  } else if (chaosScore <= benchmark.average_chaos) {
    return 60 + Math.floor(Math.random() * 30); // Top 40%
  } else {
    return 20 + Math.floor(Math.random() * 40); // Bottom 60%
  }
}

export function generateQuickWins(responses: ChaosQuizResponse, chaosScore: number): string[] {
  const wins: string[] = [];
  
  if (responses.daily_overwhelm >= 7) {
    wins.push("Set up a daily task priority system (impact: immediate stress reduction)");
  }
  
  if (responses.revenue_predictability <= 4) {
    wins.push("Track monthly recurring revenue and create 90-day cash flow forecast");
  }
  
  if (responses.financial_tracking <= 5) {
    wins.push("Set up automated expense tracking with receipt scanning");
  }
  
  if (responses.customer_communication >= 6) {
    wins.push("Create standard response templates for common customer questions");
  }
  
  if (responses.time_management >= 7) {
    wins.push("Block 2-hour focus periods in your calendar for important work");
  }
  
  // Always include at least 3 wins
  if (wins.length < 3) {
    const additionalWins = [
      "Automate appointment scheduling with online booking",
      "Set up customer follow-up email sequences",
      "Create standardized pricing sheets for common services"
    ];
    wins.push(...additionalWins.slice(0, 3 - wins.length));
  }
  
  return wins.slice(0, 4);
}

export function generateStrategicOpportunities(responses: ChaosQuizResponse, industry: string): string[] {
  const opportunities: string[] = [];
  
  if (responses.customer_acquisition === 'Cold outreach' || responses.customer_acquisition === 'Other') {
    opportunities.push("Build referral program to reduce customer acquisition costs by 40%");
  }
  
  if (responses.biggest_challenge === 'Finding customers') {
    opportunities.push("Implement local SEO strategy to capture 70% more online leads");
  }
  
  if (responses.revenue_predictability <= 5) {
    opportunities.push("Develop maintenance contracts for predictable monthly revenue");
  }
  
  // Industry-specific opportunities
  const industryOpportunities = {
    'Plumbing': "Offer emergency service premium pricing (+30% revenue)",
    'Electrical': "Add smart home installation services (+50% project value)",
    'HVAC': "Create seasonal maintenance packages for steady income",
    'General Contractor': "Partner with real estate agents for referral pipeline",
    'Roofing': "Implement drone inspections for competitive advantage"
  };
  
  const industryOpp = industryOpportunities[industry as keyof typeof industryOpportunities];
  if (industryOpp) {
    opportunities.push(industryOpp);
  }
  
  // Always include at least 3 opportunities
  if (opportunities.length < 3) {
    const additionalOpps = [
      "Implement dynamic pricing based on demand and seasonality",
      "Create premium service tiers for higher-value customers",
      "Build strategic partnerships with complementary businesses"
    ];
    opportunities.push(...additionalOpps.slice(0, 3 - opportunities.length));
  }
  
  return opportunities.slice(0, 4);
}

export function getChaosFactors(responses: ChaosQuizResponse): string[] {
  const factors: string[] = [];
  
  if (responses.daily_overwhelm >= 7) {
    factors.push("High daily overwhelm affecting decision quality");
  }
  
  if (responses.revenue_predictability <= 4) {
    factors.push("Unpredictable revenue creating financial stress");
  }
  
  if (responses.task_management_difficulty >= 7) {
    factors.push("Difficulty managing multiple tasks simultaneously");
  }
  
  if (responses.time_management >= 7) {
    factors.push("Poor time management leading to missed opportunities");
  }
  
  if (responses.customer_communication >= 7) {
    factors.push("Communication issues causing customer dissatisfaction");
  }
  
  return factors;
}

export function processQuizResults(responses: ChaosQuizResponse, industry: string): ChaosResults {
  const chaos_score = calculateChaosScore(responses);
  const clarity_zone = getClarityZone(chaos_score);
  const industry_percentile = getIndustryPercentile(chaos_score, industry);
  const quick_wins = generateQuickWins(responses, chaos_score);
  const strategic_opportunities = generateStrategicOpportunities(responses, industry);
  const chaos_factors = getChaosFactors(responses);
  
  return {
    chaos_score,
    clarity_zone,
    industry_percentile,
    quick_wins,
    strategic_opportunities,
    chaos_factors
  };
}