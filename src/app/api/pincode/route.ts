import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get('pincode')?.trim() || '';

  if (!/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ success: false, message: 'Invalid 6-digit pincode' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 86400 } // Cache 24 hours
    });

    if (!res.ok) {
      throw new Error(`External API responded with status ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0]?.PostOffice) && data[0].PostOffice.length > 0) {
      const offices = data[0].PostOffice;
      const primary = offices.find((p: any) => p.DeliveryStatus === 'Delivery') || offices[0];
      
      const placeName = primary.Name?.trim() || '';
      const district = primary.District?.trim() || '';
      const state = primary.State?.trim() || '';
      
      return NextResponse.json({
        success: true,
        pincode,
        placeName,
        district,
        state,
        area: `${placeName}, ${district}`,
        fullAddress: `${placeName}, ${district}, ${state} - ${pincode}`,
        offices: offices.map((o: any) => o.Name)
      });
    }

    return NextResponse.json({ success: false, message: 'Pincode not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Lookup failed' }, { status: 500 });
  }
}
