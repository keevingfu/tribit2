import { NextRequest, NextResponse } from 'next/server';
import TikTokVideoService from '@/services/database/TikTokVideoService';

export async function GET(request: NextRequest) {
  try {
    const [creatorStats, productStats] = await Promise.all([
      TikTokVideoService.getCreatorStats(),
      TikTokVideoService.getProductStats()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        creators: creatorStats,
        products: productStats
      }
    });
  } catch (error) {
    console.error('Error fetching TikTok stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch TikTok statistics'
      },
      { status: 500 }
    );
  }
}