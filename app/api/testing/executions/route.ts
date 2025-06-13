import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { testingService } from '@/services/database';

export const dynamic = 'force-dynamic';

// Validation schemas
const getExecutionsQuerySchema = z.object({
  status: z.enum(['draft', 'running', 'paused', 'completed']).optional(),
  ideaId: z.string().optional()
});

const createExecutionSchema = z.object({
  idea_id: z.string().min(1),
  name: z.string().min(1).max(200),
  type: z.enum(['ab', 'multivariate', 'split']),
  status: z.enum(['draft', 'running', 'paused', 'completed']).default('draft'),
  variants: z.array(z.object({
    name: z.string().min(1),
    description: z.string(),
    traffic_percentage: z.number().min(0).max(100),
    is_control: z.boolean(),
    configuration: z.record(z.any())
  })).min(2),
  metrics: z.array(z.object({
    name: z.string().min(1),
    type: z.enum(['conversion', 'revenue', 'engagement', 'custom']),
    goal_type: z.enum(['increase', 'decrease']),
    primary: z.boolean()
  })).min(1),
  traffic_allocation: z.number().min(0).max(100).default(100),
  start_date: z.string().datetime().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validationResult = getExecutionsQuerySchema.safeParse(params);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { status, ideaId } = validationResult.data;

    // Get test executions
    const executions = await testingService.getTestExecutions({ status, ideaId });

    return NextResponse.json({ data: executions });
  } catch (error) {
    console.error('Error fetching test executions:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = createExecutionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Validate traffic allocation
    const totalTraffic = data.variants.reduce((sum, v) => sum + v.traffic_percentage, 0);
    if (totalTraffic !== 100) {
      return NextResponse.json(
        { error: 'Variant traffic percentages must sum to 100%' },
        { status: 400 }
      );
    }

    // Ensure only one control variant
    const controlVariants = data.variants.filter(v => v.is_control);
    if (controlVariants.length !== 1) {
      return NextResponse.json(
        { error: 'Exactly one control variant is required' },
        { status: 400 }
      );
    }

    // Ensure at least one primary metric
    const primaryMetrics = data.metrics.filter(m => m.primary);
    if (primaryMetrics.length === 0) {
      return NextResponse.json(
        { error: 'At least one primary metric is required' },
        { status: 400 }
      );
    }

    // Create new test execution
    const newExecution = await testingService.createTestExecution({
      ...data,
      start_date: data.start_date || new Date().toISOString(),
      variants: data.variants.map((v, index) => ({
        ...v,
        id: `var-new-${index}`,
        test_id: 'temp'
      })),
      metrics: data.metrics.map((m, index) => ({
        ...m,
        id: `metric-new-${index}`
      }))
    });

    return NextResponse.json(newExecution, { status: 201 });
  } catch (error) {
    console.error('Error creating test execution:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}