import { NextRequest, NextResponse } from 'next/server';
import { kolService } from '@/services/kol.service';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const topKOLs = await kolService.getTopKOLs(limit);
    return NextResponse.json(topKOLs);
  } catch (error) {
    console.error('Error fetching top KOLs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top KOLs' },
      { status: 500 }
    );
  }
}