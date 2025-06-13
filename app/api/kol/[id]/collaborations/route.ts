import { NextRequest, NextResponse } from 'next/server';
import { kolService } from '@/services/kol.service';

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collaborations = await kolService.getCollaborationHistory(params.id);
    return NextResponse.json(collaborations);
  } catch (error) {
    console.error('Error fetching collaboration history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collaboration history' },
      { status: 500 }
    );
  }
}