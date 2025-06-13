import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { testingService } from '@/services/database';

export const dynamic = 'force-dynamic';

// Validation schemas
const getIdeasQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: z.enum(['draft', 'ready', 'running', 'completed', 'archived']).optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  search: z.string().optional()
});

const createIdeaSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  hypothesis: z.string().min(1).max(1000),
  status: z.enum(['draft', 'ready', 'running', 'completed', 'archived']).default('draft'),
  priority: z.enum(['high', 'medium', 'low']),
  created_by: z.string().email(),
  category: z.string().min(1).max(100),
  expected_impact: z.string().min(1).max(500)
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validationResult = getIdeasQuerySchema.safeParse(params);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { page = 1, pageSize = 10, status, priority, search } = validationResult.data;

    // Get paginated test ideas
    const result = await testingService.getTestIdeasPaginated(
      page,
      pageSize,
      { status, priority, search }
    );

    // Get statistics
    const stats = await testingService.getTestStats();

    return NextResponse.json({
      ...result,
      stats
    });
  } catch (error) {
    console.error('Error fetching test ideas:', error);
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
    const validationResult = createIdeaSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    // Create new test idea
    const newIdea = await testingService.createTestIdea(validationResult.data);

    return NextResponse.json(newIdea, { status: 201 });
  } catch (error) {
    console.error('Error creating test idea:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}