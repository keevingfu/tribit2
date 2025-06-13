import { NextRequest } from 'next/server';
import { KOLService } from '@/services/database/KOLService';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export const dynamic = "force-dynamic";

const kolService = new KOLService();

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return errorResponse('KOL ID is required', 'MISSING_ID', null, 400);
    }

    // Try to get KOL by account name first
    const results = await kolService.searchKOLAccounts(id);
    
    if (!results || results.length === 0) {
      return errorResponse('KOL not found', 'NOT_FOUND', null, 404);
    }

    // Get the first exact match or the first result
    const kol = results.find(k => k.kol_account === id) || results[0];

    // Get additional data
    const [videos, platformStats, regionStats] = await Promise.all([
      kolService.getVideosByKOLAccount(kol.kol_account || ''),
      kolService.getPlatformStats(),
      kolService.getRegionStats(),
    ]);

    // Prepare response data
    const responseData = {
      kol,
      videos: videos.slice(0, 10), // Limit to 10 most recent videos
      relatedStats: {
        totalVideos: videos.length,
        platformDistribution: platformStats,
        regionDistribution: regionStats,
      },
    };

    return successResponse(responseData, 'KOL details retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}