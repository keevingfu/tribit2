import { NextRequest, NextResponse } from 'next/server';
import { adService } from '@/services/database/AdService';

export async function GET(request: NextRequest) {
  try {
    // Get platform metrics
    const platformMetrics = await adService.getPlatformMetrics();

    return NextResponse.json({
      success: true,
      data: platformMetrics,
    });
  } catch (error) {
    console.error('Error fetching platform metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform metrics' },
      { status: 500 }
    );
  }
}