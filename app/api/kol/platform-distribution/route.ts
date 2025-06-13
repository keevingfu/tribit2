import { NextResponse } from 'next/server';
import { kolService } from '@/services/kol.service';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const distribution = await kolService.getPlatformDistribution();
    return NextResponse.json(distribution);
  } catch (error) {
    console.error('Error fetching platform distribution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform distribution' },
      { status: 500 }
    );
  }
}