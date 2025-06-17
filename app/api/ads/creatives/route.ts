import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adService } from '@/services/database/AdService';

// Validation schema
const querySchema = z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
});

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const validationResult = querySchema.safeParse({
      limit: searchParams.get('limit') || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { limit } = validationResult.data;

    // Get creative performance
    const creatives = await adService.getCreativePerformance(limit);

    return NextResponse.json({
      success: true,
      data: creatives,
    });
  } catch (error) {
    console.error('Error fetching creative performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch creative performance' },
      { status: 500 }
    );
  }
}