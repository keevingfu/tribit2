// Testing module types - can be imported by both client and server

// Main test idea interface
export interface TestIdea {
  id: string;
  title: string;
  description: string;
  hypothesis: string;
  status: 'draft' | 'ready' | 'running' | 'completed' | 'archived';
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
  created_by: string;
  category: string;
  expected_impact: string;
}

// Test execution interface
export interface TestExecution {
  id: string;
  idea_id: string;
  name: string;
  type: 'ab' | 'multivariate' | 'split';
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: TestVariant[];
  metrics: TestMetric[];
  traffic_allocation: number; // percentage of traffic
  start_date: string;
  end_date?: string;
  winner_variant_id?: string;
  results?: TestResults;
  created_at: string;
  updated_at: string;
}

// Test variant interface
export interface TestVariant {
  id: string;
  test_id: string;
  name: string;
  description: string;
  traffic_percentage: number;
  is_control: boolean;
  configuration: Record<string, any>;
}

// Test metric interface
export interface TestMetric {
  id: string;
  name: string;
  type: 'conversion' | 'revenue' | 'engagement' | 'custom';
  goal_type: 'increase' | 'decrease';
  primary: boolean;
}

// Test results interface
export interface TestResults {
  test_id: string;
  total_participants: number;
  confidence_level: number;
  statistical_significance: boolean;
  variant_results: VariantResult[];
  updated_at: string;
}

// Variant result interface
export interface VariantResult {
  variant_id: string;
  variant_name: string;
  participants: number;
  conversions: number;
  conversion_rate: number;
  improvement: number; // percentage improvement over control
  confidence_interval: [number, number];
  is_winner: boolean;
}

// Legacy interfaces for database compatibility (if needed)
export interface LegacyTestIdea {
  id: number;
  experiment_name: string;
  hypothesis: string;
  goal: string;
  primary_metric: string;
  secondary_metrics: string;
  target_audience: string;
  duration_weeks: number;
  status: 'draft' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface LegacyTestExecution {
  id: number;
  test_id: number;
  variant_name: string;
  variant_description: string;
  sample_size: number;
  conversion_rate: number;
  confidence_level: number;
  statistical_significance: boolean;
  metrics_data: Record<string, any>;
  status: 'running' | 'paused' | 'completed' | 'failed';
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface TestPerformance {
  test_id: number;
  experiment_name: string;
  variant_name: string;
  conversion_rate: number;
  improvement_percentage: number;
  confidence_level: number;
  sample_size: number;
  revenue_impact: number;
  status: string;
}

export interface TestRefinement {
  id: number;
  test_id: number;
  refinement_type: string;
  description: string;
  impact_score: number;
  implementation_status: string;
  created_at: string;
}

// Test statistics interface
export interface TestStats {
  totalIdeas: number;
  activeTests: number;
  completedTests: number;
  averageImprovement: number;
}