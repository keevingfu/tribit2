import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adService } from '@/services/database/AdService';

// Validation schema
const querySchema = z.object({
  days: z.string().optional().transform(val => val ? parseInt(val) : 30),
});

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const validationResult = querySchema.safeParse({
      days: searchParams.get('days') || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { days } = validationResult.data;

    // Get performance over time
    const performanceData = await adService.getDateRangeMetrics(days);

    return NextResponse.json({
      success: true,
      data: performanceData,
    });
  } catch (error) {
    console.error('Error fetching performance data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance data' },
      { status: 500 }
    );
  }
}