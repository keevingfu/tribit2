import { NextRequest, NextResponse } from 'next/server';
import { kolService } from '@/services/kol.service';

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '30d';
    
    const data = await kolService.getContentPerformance(params.id, timeRange as any);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching content performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content performance' },
      { status: 500 }
    );
  }
}