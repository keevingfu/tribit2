import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = "force-dynamic";

const db = new Database(path.join(process.cwd(), 'data', 'tribit.db'), { readonly: true });

export async function GET(request: NextRequest) {
  try {
    // TODO: Migrate specific database API logic here
    return NextResponse.json({ message: 'database API endpoint' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Migrate specific database POST logic here
    return NextResponse.json({ message: 'database POST endpoint', data: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}