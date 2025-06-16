import { NextRequest, NextResponse } from 'next/server';
import KOLTotalService from '@/services/database/KOLTotalService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const service = new KOLTotalService();
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'platform'; // platform or region
    
    let data;
    
    if (type === 'region') {
      data = await service.getRegionDistribution();
    } else {
      data = await service.getPlatformDistribution();
    }
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching distribution data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch distribution',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}