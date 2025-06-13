import { BaseService } from './BaseService';
import { PaginatedResult } from '@/types/database';

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

export interface TestVariant {
  id: string;
  test_id: string;
  name: string;
  description: string;
  traffic_percentage: number;
  is_control: boolean;
  configuration: Record<string, any>;
}

export interface TestMetric {
  id: string;
  name: string;
  type: 'conversion' | 'revenue' | 'engagement' | 'custom';
  goal_type: 'increase' | 'decrease';
  primary: boolean;
}

export interface TestResults {
  test_id: string;
  total_participants: number;
  confidence_level: number;
  statistical_significance: boolean;
  variant_results: VariantResult[];
  updated_at: string;
}

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

export class TestingService extends BaseService<TestIdea> {
  constructor() {
    super('testing_ideas');
  }

  // Mock data for development
  private mockIdeas: TestIdea[] = [
    {
      id: '1',
      title: 'Homepage CTA Button Color Test',
      description: 'Test different button colors to improve conversion rate',
      hypothesis: 'Changing the CTA button from blue to green will increase click-through rate by 15%',
      status: 'running',
      priority: 'high',
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-15T14:30:00Z',
      created_by: 'john.doe@company.com',
      category: 'UI/UX',
      expected_impact: '15-20% CTR increase'
    },
    {
      id: '2',
      title: 'Email Subject Line Personalization',
      description: 'Test personalized vs generic email subject lines',
      hypothesis: 'Personalized subject lines will increase open rates by 25%',
      status: 'completed',
      priority: 'medium',
      created_at: '2024-11-15T09:00:00Z',
      updated_at: '2024-12-01T16:00:00Z',
      created_by: 'jane.smith@company.com',
      category: 'Email Marketing',
      expected_impact: '20-30% open rate increase'
    },
    {
      id: '3',
      title: 'Product Page Layout Optimization',
      description: 'Test new product page layout with larger images',
      hypothesis: 'Larger product images will increase add-to-cart rate by 10%',
      status: 'ready',
      priority: 'high',
      created_at: '2024-12-10T11:00:00Z',
      updated_at: '2024-12-10T11:00:00Z',
      created_by: 'mike.wilson@company.com',
      category: 'E-commerce',
      expected_impact: '10-15% conversion increase'
    },
    {
      id: '4',
      title: 'Checkout Process Simplification',
      description: 'Test one-page vs multi-step checkout',
      hypothesis: 'One-page checkout will reduce cart abandonment by 20%',
      status: 'draft',
      priority: 'high',
      created_at: '2024-12-20T13:00:00Z',
      updated_at: '2024-12-20T13:00:00Z',
      created_by: 'sarah.jones@company.com',
      category: 'E-commerce',
      expected_impact: '20% reduction in cart abandonment'
    }
  ];

  private mockExecutions: TestExecution[] = [
    {
      id: 'exec-1',
      idea_id: '1',
      name: 'Homepage CTA Button Color Test',
      type: 'ab',
      status: 'running',
      variants: [
        {
          id: 'var-1',
          test_id: 'exec-1',
          name: 'Control (Blue)',
          description: 'Current blue button',
          traffic_percentage: 50,
          is_control: true,
          configuration: { color: '#007bff' }
        },
        {
          id: 'var-2',
          test_id: 'exec-1',
          name: 'Variant A (Green)',
          description: 'Green button variant',
          traffic_percentage: 50,
          is_control: false,
          configuration: { color: '#28a745' }
        }
      ],
      metrics: [
        {
          id: 'metric-1',
          name: 'Click-through Rate',
          type: 'conversion',
          goal_type: 'increase',
          primary: true
        },
        {
          id: 'metric-2',
          name: 'Bounce Rate',
          type: 'engagement',
          goal_type: 'decrease',
          primary: false
        }
      ],
      traffic_allocation: 100,
      start_date: '2024-12-01T10:00:00Z',
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-15T14:30:00Z',
      results: {
        test_id: 'exec-1',
        total_participants: 50000,
        confidence_level: 95,
        statistical_significance: true,
        variant_results: [
          {
            variant_id: 'var-1',
            variant_name: 'Control (Blue)',
            participants: 25000,
            conversions: 2500,
            conversion_rate: 10.0,
            improvement: 0,
            confidence_interval: [9.5, 10.5],
            is_winner: false
          },
          {
            variant_id: 'var-2',
            variant_name: 'Variant A (Green)',
            participants: 25000,
            conversions: 3125,
            conversion_rate: 12.5,
            improvement: 25,
            confidence_interval: [12.0, 13.0],
            is_winner: true
          }
        ],
        updated_at: '2024-12-15T14:30:00Z'
      }
    },
    {
      id: 'exec-2',
      idea_id: '2',
      name: 'Email Subject Line Personalization',
      type: 'ab',
      status: 'completed',
      variants: [
        {
          id: 'var-3',
          test_id: 'exec-2',
          name: 'Control (Generic)',
          description: 'Generic subject line',
          traffic_percentage: 50,
          is_control: true,
          configuration: { template: 'Check out our latest deals!' }
        },
        {
          id: 'var-4',
          test_id: 'exec-2',
          name: 'Personalized',
          description: 'Personalized with first name',
          traffic_percentage: 50,
          is_control: false,
          configuration: { template: '{firstName}, exclusive deals just for you!' }
        }
      ],
      metrics: [
        {
          id: 'metric-3',
          name: 'Open Rate',
          type: 'engagement',
          goal_type: 'increase',
          primary: true
        }
      ],
      traffic_allocation: 100,
      start_date: '2024-11-15T09:00:00Z',
      end_date: '2024-12-01T16:00:00Z',
      winner_variant_id: 'var-4',
      created_at: '2024-11-15T09:00:00Z',
      updated_at: '2024-12-01T16:00:00Z',
      results: {
        test_id: 'exec-2',
        total_participants: 100000,
        confidence_level: 99,
        statistical_significance: true,
        variant_results: [
          {
            variant_id: 'var-3',
            variant_name: 'Control (Generic)',
            participants: 50000,
            conversions: 10000,
            conversion_rate: 20.0,
            improvement: 0,
            confidence_interval: [19.5, 20.5],
            is_winner: false
          },
          {
            variant_id: 'var-4',
            variant_name: 'Personalized',
            participants: 50000,
            conversions: 13500,
            conversion_rate: 27.0,
            improvement: 35,
            confidence_interval: [26.5, 27.5],
            is_winner: true
          }
        ],
        updated_at: '2024-12-01T16:00:00Z'
      }
    }
  ];

  // Override getAll to return mock data
  async getAll(): Promise<TestIdea[]> {
    return Promise.resolve(this.mockIdeas);
  }

  // Get test ideas with filtering
  async getTestIdeas(filters?: {
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<TestIdea[]> {
    let ideas = [...this.mockIdeas];

    if (filters?.status) {
      ideas = ideas.filter(idea => idea.status === filters.status);
    }

    if (filters?.priority) {
      ideas = ideas.filter(idea => idea.priority === filters.priority);
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      ideas = ideas.filter(idea => 
        idea.title.toLowerCase().includes(searchTerm) ||
        idea.description.toLowerCase().includes(searchTerm) ||
        idea.hypothesis.toLowerCase().includes(searchTerm)
      );
    }

    return Promise.resolve(ideas);
  }

  // Get paginated test ideas
  async getTestIdeasPaginated(
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      status?: string;
      priority?: string;
      search?: string;
    }
  ): Promise<PaginatedResult<TestIdea>> {
    const ideas = await this.getTestIdeas(filters);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = ideas.slice(start, end);

    return {
      data: paginatedData,
      total: ideas.length,
      page,
      pageSize,
      totalPages: Math.ceil(ideas.length / pageSize)
    };
  }

  // Get test idea by ID
  async getTestIdeaById(id: string): Promise<TestIdea | null> {
    const idea = this.mockIdeas.find(i => i.id === id);
    return Promise.resolve(idea || null);
  }

  // Get test executions
  async getTestExecutions(filters?: {
    status?: string;
    ideaId?: string;
  }): Promise<TestExecution[]> {
    let executions = [...this.mockExecutions];

    if (filters?.status) {
      executions = executions.filter(exec => exec.status === filters.status);
    }

    if (filters?.ideaId) {
      executions = executions.filter(exec => exec.idea_id === filters.ideaId);
    }

    return Promise.resolve(executions);
  }

  // Get test execution by ID
  async getTestExecutionById(id: string): Promise<TestExecution | null> {
    const execution = this.mockExecutions.find(e => e.id === id);
    return Promise.resolve(execution || null);
  }

  // Get active tests
  async getActiveTests(): Promise<TestExecution[]> {
    return this.getTestExecutions({ status: 'running' });
  }

  // Get test statistics
  async getTestStats(): Promise<{
    totalIdeas: number;
    activeTests: number;
    completedTests: number;
    averageImprovement: number;
  }> {
    const ideas = await this.getTestIdeas();
    const executions = await this.getTestExecutions();
    
    const activeTests = executions.filter(e => e.status === 'running').length;
    const completedTests = executions.filter(e => e.status === 'completed').length;
    
    // Calculate average improvement from completed tests
    const completedWithResults = executions.filter(e => 
      e.status === 'completed' && e.results
    );
    
    let totalImprovement = 0;
    completedWithResults.forEach(test => {
      const winnerResult = test.results?.variant_results.find(v => v.is_winner);
      if (winnerResult) {
        totalImprovement += winnerResult.improvement;
      }
    });
    
    const averageImprovement = completedWithResults.length > 0 
      ? totalImprovement / completedWithResults.length 
      : 0;

    return {
      totalIdeas: ideas.length,
      activeTests,
      completedTests,
      averageImprovement
    };
  }

  // Create test idea (mock)
  async createTestIdea(idea: Omit<TestIdea, 'id' | 'created_at' | 'updated_at'>): Promise<TestIdea> {
    const newIdea: TestIdea = {
      ...idea,
      id: String(this.mockIdeas.length + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.mockIdeas.push(newIdea);
    return Promise.resolve(newIdea);
  }

  // Update test idea (mock)
  async updateTestIdea(id: string, updates: Partial<TestIdea>): Promise<TestIdea | null> {
    const index = this.mockIdeas.findIndex(i => i.id === id);
    if (index === -1) return null;

    this.mockIdeas[index] = {
      ...this.mockIdeas[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return Promise.resolve(this.mockIdeas[index]);
  }

  // Create test execution (mock)
  async createTestExecution(execution: Omit<TestExecution, 'id' | 'created_at' | 'updated_at'>): Promise<TestExecution> {
    const newExecution: TestExecution = {
      ...execution,
      id: `exec-${this.mockExecutions.length + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.mockExecutions.push(newExecution);
    return Promise.resolve(newExecution);
  }

  // Update test execution (mock)
  async updateTestExecution(id: string, updates: Partial<TestExecution>): Promise<TestExecution | null> {
    const index = this.mockExecutions.findIndex(e => e.id === id);
    if (index === -1) return null;

    this.mockExecutions[index] = {
      ...this.mockExecutions[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return Promise.resolve(this.mockExecutions[index]);
  }
}

// Export singleton instance
export const testingService = new TestingService();