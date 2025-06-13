import { NextRequest, NextResponse } from 'next/server';
import { kolService } from '@/services/kol.service';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '5');
    
    const performance = await kolService.getCampaignPerformance(limit);
    return NextResponse.json(performance);
  } catch (error) {
    console.error('Error fetching campaign performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign performance' },
      { status: 500 }
    );
  }
}