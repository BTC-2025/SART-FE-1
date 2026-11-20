import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const targetUrl = `http://127.0.0.1:5000/api/rental/vehicles/${encodeURIComponent(id)}`;

    const res = await fetch(targetUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ success: false, message: 'Vehicle not found' }, { status: 404 });
  } catch (err: any) {
    console.error('Next.js API proxy to single vehicle error:', err.message);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
