import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Shared persistence file for fleet drivers across ports 3005 and 3007
const DATA_FILE = path.join(process.cwd(), '.drivers_fleet.json');

function readDrivers(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading drivers fleet file:', err);
  }
  return [];
}

function writeDrivers(drivers: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(drivers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing drivers fleet file:', err);
  }
}

// CORS headers so business portal (localhost:3007) and user site (localhost:3005) can freely read and write
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
  const mode = searchParams.get('mode') || searchParams.get('category');
  const search = searchParams.get('search');
  const vehicleType = searchParams.get('vehicleType');

  let drivers = readDrivers();

  if (mode && mode !== 'All') {
    drivers = drivers.filter(d => (d.mode || d.type || '').toLowerCase() === mode.toLowerCase());
  }

  if (vehicleType && vehicleType !== 'all') {
    const vLower = vehicleType.toLowerCase();
    drivers = drivers.filter(d => {
      const list: string[] = Array.isArray(d.eligibleVehicles) ? d.eligibleVehicles : [];
      return list.some(item => item.toLowerCase().includes(vLower));
    });
  }

  if (search) {
    const sLower = search.toLowerCase();
    drivers = drivers.filter(d =>
      (d.name && d.name.toLowerCase().includes(sLower)) ||
      (d.phone && d.phone.toLowerCase().includes(sLower)) ||
      (d.address && d.address.toLowerCase().includes(sLower)) ||
      (d.dlNumber && d.dlNumber.toLowerCase().includes(sLower))
    );
  }

  return NextResponse.json({
    success: true,
    count: drivers.length,
    drivers
  }, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = readDrivers();

    const id = body.id || `DRV-${Date.now()}`;
    const eligibles = Array.isArray(body.eligibleVehicles) ? body.eligibleVehicles : [];
    
    // Determine mode from eligible vehicles
    let mode = body.mode || 'truck';
    if (eligibles.some((v: string) => v.toLowerCase().includes('bike') || v.toLowerCase().includes('two-wheeler'))) mode = 'bike';
    else if (eligibles.some((v: string) => v.toLowerCase().includes('car') || v.toLowerCase().includes('sedan'))) mode = 'truck';
    else if (eligibles.some((v: string) => v.toLowerCase().includes('ship') || v.toLowerCase().includes('maritime'))) mode = 'ship';
    else if (eligibles.some((v: string) => v.toLowerCase().includes('flight') || v.toLowerCase().includes('aircraft'))) mode = 'flight';

    const hourlyRate = Number(body.hourlyRate) || Number(body.baseCharge) || (mode === 'bike' ? 120 : mode === 'ship' ? 1200 : 200);
    const dailyRate = Number(body.dailyRate) || (mode === 'bike' ? 800 : mode === 'ship' ? 8000 : 1500);
    const weeklyRate = Number(body.weeklyRate) || (dailyRate * 6);
    const monthlyRate = Number(body.monthlyRate) || (dailyRate * 24);
    const outstationRate = Number(body.outstationRate) || (mode === 'bike' ? 1200 : mode === 'ship' ? 25000 : 1800);
    const baseCharge = Number(body.baseCharge) || hourlyRate;

    const newDriver = {
      ...body,
      id,
      name: body.name || body.fullName || 'Verified Fleet Driver',
      phone: body.phone || body.mobileNumber || '',
      brand: body.name || body.fullName || 'Verified Fleet Driver',
      model: eligibles[0] || 'Commercial Logistics',
      mode,
      type: mode,
      plate: body.dlNumber || `DL-${Date.now().toString().slice(-6)}`,
      regId: body.dlNumber || `DL-${Date.now().toString().slice(-6)}`,
      hub: body.address || 'Logistics Hub',
      location: body.address || 'Logistics Hub',
      isAvailable: body.isAvailable !== false,
      rating: Number(body.rating) || 4.9,
      hourlyRate,
      dailyRate,
      weeklyRate,
      monthlyRate,
      outstationRate,
      baseCharge,
      ratePerKm: Number(body.ratePerKm) || (mode === 'bike' ? 14 : mode === 'ship' ? 649 : 48),
      advancePercent: Number(body.advancePercent) || (mode === 'bike' ? 25 : mode === 'ship' ? 35 : 30),
      createdAt: new Date().toISOString()
    };

    const updated = [newDriver, ...current.filter(d => d.id !== id)];
    writeDrivers(updated);

    return NextResponse.json({
      success: true,
      message: 'Driver added to fleet successfully',
      driver: newDriver,
      drivers: updated
    }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}
