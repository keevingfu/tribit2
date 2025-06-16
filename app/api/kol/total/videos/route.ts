import { NextRequest, NextResponse } from 'next/server';
import KOLTotalService from '@/services/database/KOLTotalService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const service = new KOLTotalService();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const region = searchParams.get('region') || undefined;
    
    const videos = await service.getVideoUrls(limit, region);
    
    return NextResponse.json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Error fetching video URLs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch videos',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}