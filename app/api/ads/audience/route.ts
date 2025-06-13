import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { adService } from '@/services/database/AdService';

// Validation schema
const querySchema = z.object({
  campaignId: z.string().optional().transform(val => val ? parseInt(val) : undefined),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const validationResult = querySchema.safeParse({
      campaignId: searchParams.get('campaignId') || undefined,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { campaignId } = validationResult.data;

    // Get audience insights and demographics
    const [audienceData, demographics, geographic] = await Promise.all([
      adService.getAudienceInsights(campaignId),
      adService.getDemographicBreakdown(),
      adService.getGeographicMetrics(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        audience: audienceData,
        demographics,
        geographic,
      },
    });
  } catch (error) {
    console.error('Error fetching audience data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audience data' },
      { status: 500 }
    );
  }
}