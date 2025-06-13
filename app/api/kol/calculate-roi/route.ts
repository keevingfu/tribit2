import { NextRequest, NextResponse } from 'next/server';
import { kolService } from '@/services/kol.service';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const params = await request.json();
    const data = await kolService.calculateROI(params);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calculating ROI:', error);
    return NextResponse.json(
      { error: 'Failed to calculate ROI' },
      { status: 500 }
    );
  }
}