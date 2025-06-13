import { NextRequest, NextResponse } from 'next/server';
import { privateService } from '@/services/database/PrivateService';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const funnelData = await privateService.getConversionFunnel();
    return NextResponse.json({ data: funnelData });
  } catch (error) {
    console.error('Private funnel API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}