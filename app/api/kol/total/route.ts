import { NextRequest, NextResponse } from 'next/server';
import KOLTotalService from '@/services/database/KOLTotalService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const service = new KOLTotalService();
    const searchParams = request.nextUrl.searchParams;
    
    const dataset = searchParams.get('dataset') || 'total'; // total, 2024, india
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const platform = searchParams.get('platform') || undefined;
    const region = searchParams.get('region') || undefined;
    
    let result;
    
    switch (dataset) {
      case '2024':
        result = await service.getKOL2024List({ page, pageSize, platform });
        break;
      case 'india':
        result = await service.getKOLIndiaList({ page, pageSize, platform });
        break;
      default:
        result = await service.getKOLTotalList({ page, pageSize, platform, region });
    }
    
    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching KOL total data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch KOL data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}