import { NextRequest, NextResponse } from 'next/server';
import { kolService } from '@/services/kol.service';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    
    if (!query) {
      return NextResponse.json([]);
    }
    
    const results = await kolService.searchKOLs(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching KOLs:', error);
    return NextResponse.json(
      { error: 'Failed to search KOLs' },
      { status: 500 }
    );
  }
}