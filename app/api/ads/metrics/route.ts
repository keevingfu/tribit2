import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adService } from '@/services/database/AdService';

// Validation schema
const querySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const validationResult = querySchema.safeParse({
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { startDate, endDate } = validationResult.data;
    const dateRange = startDate && endDate ? { start: startDate, end: endDate } : undefined;

    // Get overall metrics
    const metrics = await adService.getMetrics(dateRange);

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error fetching ad metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ad metrics' },
      { status: 500 }
    );
  }
}