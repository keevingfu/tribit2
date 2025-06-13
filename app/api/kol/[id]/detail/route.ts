import { NextRequest, NextResponse } from 'next/server';
import { kolService } from '@/services/kol.service';

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const detail = await kolService.getKOLDetail(params.id);
    if (!detail) {
      return NextResponse.json(
        { error: 'KOL not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(detail);
  } catch (error) {
    console.error('Error fetching KOL detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KOL detail' },
      { status: 500 }
    );
  }
}