import { NextRequest, NextResponse } from 'next/server';
import KOLTotalService from '@/services/database/KOLTotalService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const service = new KOLTotalService();
    const statistics = await service.getStatistics();
    
    return NextResponse.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error fetching KOL statistics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}