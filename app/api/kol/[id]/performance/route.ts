import { NextRequest, NextResponse } from 'next/server';
import { kolService } from '@/services/kol.service';

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const performance = await kolService.getPerformanceMetrics(params.id);
    return NextResponse.json(performance);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    );
  }
}