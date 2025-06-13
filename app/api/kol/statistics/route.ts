import { NextResponse } from 'next/server';
import { kolService } from '@/services/kol.service';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const statistics = await kolService.getStatistics();
    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching KOL statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}