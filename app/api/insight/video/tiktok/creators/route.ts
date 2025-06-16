import { NextRequest, NextResponse } from 'next/server';
import TikTokVideoService from '@/services/database/TikTokVideoService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || undefined;

    const result = await TikTokVideoService.getCreators(page, pageSize, {
      search,
      sortBy
    });

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
    console.error('Error fetching TikTok creators:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch TikTok creators'
      },
      { status: 500 }
    );
  }
}