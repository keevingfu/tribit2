import { NextRequest, NextResponse } from 'next/server';
import TikTokVideoService from '@/services/database/TikTokVideoService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const result = await TikTokVideoService.getVideos(page, pageSize);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching TikTok videos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch TikTok videos'
      },
      { status: 500 }
    );
  }
}