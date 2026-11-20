import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const targetUrl = `http://127.0.0.1:5000/api/rental/vehicles${queryString ? `?${queryString}` : ''}`;

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

    // Fallback: fetch without query parameters if filtered query failed
    const fallbackRes = await fetch('http://127.0.0.1:5000/api/rental/vehicles', { cache: 'no-store' });
    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ success: true, count: 0, data: [] });
  } catch (err: any) {
    console.error('Next.js API proxy to rental vehicles error:', err.message);
    return NextResponse.json({ success: false, message: err.message, data: [] }, { status: 500 });
  }
}
