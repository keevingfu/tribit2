import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adService } from '@/services/database/AdService';

// Validation schema
const querySchema = z.object({
  platforms: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const validationResult = querySchema.safeParse({
      platforms: searchParams.get('platforms') || undefined,
      status: searchParams.get('status') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { platforms, status, startDate, endDate } = validationResult.data;

    // Parse filters
    const filters = {
      platforms: platforms ? platforms.split(',') : undefined,
      status: status ? status.split(',') : undefined,
      dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined,
    };

    // Get campaigns
    const campaigns = await adService.getCampaigns(filters);

    return NextResponse.json({
      success: true,
      data: campaigns,
      count: campaigns.length,
    });
  } catch (error) {
    console.error('Error fetching ad campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ad campaigns' },
      { status: 500 }
    );
  }
}