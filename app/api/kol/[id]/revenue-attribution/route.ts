import { NextRequest, NextResponse } from 'next/server';
import { kolService } from '@/services/kol.service';

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await kolService.getRevenueAttribution(params.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching revenue attribution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue attribution' },
      { status: 500 }
    );
  }
}