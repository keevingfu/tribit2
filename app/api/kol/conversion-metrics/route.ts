import { NextRequest, NextResponse } from 'next/server';
import { kolService } from '@/services/kol.service';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '30d';
    
    const data = await kolService.getConversionMetrics(timeRange as any);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching conversion metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversion metrics' },
      { status: 500 }
    );
  }
}