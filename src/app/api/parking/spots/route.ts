import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Shared persistence file for parking spots across ports 3005 and 3007
const DATA_FILE = path.join(process.cwd(), '.parking_spots.json');

function readSpots(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading parking spots file:', err);
  }
  return [];
}

function writeSpots(spots: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(spots, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing parking spots file:', err);
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleType = searchParams.get('vehicleType');
  const city = searchParams.get('city');
  const state = searchParams.get('state');
  const search = searchParams.get('search');

  let spots = readSpots();

  // Also check if Express backend (port 5000) has spots and merge
  try {
    const res = await fetch('http://localhost:5000/api/parking/spots', { cache: 'no-store' });
    if (res.ok) {
      const beData = await res.json();
      if (beData && Array.isArray(beData.data)) {
        beData.data.forEach((s: any) => {
          if (!spots.some(existing => existing.id === s.id)) {
            spots.push(s);
          }
        });
      }
    }
  } catch (e) { }

  // Filter by Vehicle Type
  if (vehicleType && vehicleType !== 'all') {
    const vLower = vehicleType.toLowerCase();
    spots = spots.filter(s => {
      // Check vehicleTypes schema if exists
      if (s.vehicleTypes) {
        if (vLower === 'bike' || vLower.includes('2-wheeler')) {
          return s.vehicleTypes.twoWheeler?.enabled !== false;
        }
        if (vLower === 'car' || vLower.includes('4-wheeler') || vLower.includes('sedan') || vLower.includes('suv')) {
          return s.vehicleTypes.fourWheeler?.enabled !== false;
        }
        if (vLower === 'truck' || vLower.includes('heavy') || vLower === 'bus') {
          return s.vehicleTypes.heavyVehicle?.enabled !== false;
        }
      }
      return true;
    });
  }

  // Filter by City or State
  if (state && state !== 'All') {
    spots = spots.filter(s => (s.state && s.state.toLowerCase().includes(state.toLowerCase())));
  }
  if (city && city !== 'All') {
    spots = spots.filter(s => (s.city && s.city.toLowerCase().includes(city.toLowerCase())));
  }

  // Filter by Search Query
  if (search) {
    const sLower = search.toLowerCase();
    spots = spots.filter(s =>
      (s.name && s.name.toLowerCase().includes(sLower)) ||
      (s.spotName && s.spotName.toLowerCase().includes(sLower)) ||
      (s.address && s.address.toLowerCase().includes(sLower)) ||
      (s.city && s.city.toLowerCase().includes(sLower)) ||
      (s.pincode && s.pincode.toLowerCase().includes(sLower)) ||
      (s.locality && s.locality.toLowerCase().includes(sLower))
    );
  }

  return NextResponse.json({
    success: true,
    count: spots.length,
    data: spots
  }, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = readSpots();

    const id = body.id || `PRK-${Date.now()}`;
    const newSpot = {
      ...body,
      id,
      spotName: body.spotName || body.name || 'Commercial Parking Yard',
      name: body.spotName || body.name || 'Commercial Parking Yard',
      updatedAt: new Date().toISOString()
    };

    const updated = [newSpot, ...current.filter(s => s.id !== id)];
    writeSpots(updated);

    return NextResponse.json({
      success: true,
      message: 'Parking spot saved successfully',
      spot: newSpot,
      data: updated
    }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isAvailable, bookingDetails } = body;
    const current = readSpots();

    const isAvail = isAvailable !== undefined ? Boolean(isAvailable) : !Boolean(bookingDetails);

    const updated = current.map(s => {
      if (s.id === id) {
        return {
          ...s,
          isAvailable: isAvail,
          bookingDetails: bookingDetails || (isAvail ? null : s.bookingDetails),
          activeBooking: bookingDetails || (isAvail ? null : s.activeBooking),
          bookingStatus: isAvail ? 'AVAILABLE' : 'ALREADY_BOOKED',
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    });

    writeSpots(updated);

    return NextResponse.json({
      success: true,
      message: 'Parking spot booking status updated',
      spots: updated
    }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}
