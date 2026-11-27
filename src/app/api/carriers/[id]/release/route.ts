import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CARRIERS_FILE = path.join(process.cwd(), '.carrier_fleet.json');
const BOOKINGS_FILE = path.join(process.cwd(), '.carrier_bookings.json');

function readCarriers(): any[] {
  try {
    if (fs.existsSync(CARRIERS_FILE)) {
      const data = fs.readFileSync(CARRIERS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) { }
  return [];
}

function writeCarriers(carriers: any[]) {
  try {
    fs.writeFileSync(CARRIERS_FILE, JSON.stringify(carriers, null, 2), 'utf-8');
  } catch (err) { }
}

function readBookings(): any[] {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const data = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) { }
  return [];
}

function writeBookings(bookings: any[]) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (err) { }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolved = await params;
    const vehicleId = decodeURIComponent(resolved.id).trim();
    const vehicleIdLower = vehicleId.toLowerCase();
    const vehicleClean = vehicleIdLower.replace(/[^a-z0-9]/g, '');

    let body: any = {};
    try {
      body = await request.json();
    } catch (e) { }

    const bookingId = body?.bookingId;

    // 1. Mark booking as Completed
    const bookings = readBookings();
    const updatedBookings = bookings.map(b => {
      const bVehId = (b.vehicleId || '').toLowerCase().trim();
      const bReg = (b.vehicleReg || b.plate || '').toLowerCase().trim();
      const bName = (b.vehicleName || '').toLowerCase().trim();
      const matches =
        (bookingId && (b.id === bookingId || b.bookingId === bookingId)) ||
        (bVehId === vehicleIdLower || bReg === vehicleIdLower || bName === vehicleIdLower) ||
        (vehicleClean && (bVehId.replace(/[^a-z0-9]/g, '') === vehicleClean || bReg.replace(/[^a-z0-9]/g, '') === vehicleClean));

      if (matches) {
        return { ...b, status: 'Completed', updatedAt: new Date().toISOString() };
      }
      return b;
    });
    writeBookings(updatedBookings);

    // 2. Release vehicle back to Available
    const carriers = readCarriers();
    let releasedVehicle: any = null;
    const updatedCarriers = carriers.map(v => {
      const vId = (v.id || '').toLowerCase().trim();
      const vPlate = (v.plate || v.regId || '').toLowerCase().trim();
      const vName = (v.name || '').toLowerCase().trim();
      const vIdClean = vId.replace(/[^a-z0-9]/g, '');
      const vPlateClean = vPlate.replace(/[^a-z0-9]/g, '');

      const isMatch =
        vId === vehicleIdLower ||
        vPlate === vehicleIdLower ||
        vName === vehicleIdLower ||
        (vehicleClean && (vIdClean === vehicleClean || vPlateClean === vehicleClean));

      if (isMatch) {
        releasedVehicle = {
          ...v,
          isAvailable: true,
          status: 'Available',
          bookingDetails: null,
          updatedAt: new Date().toISOString()
        };
        return releasedVehicle;
      }
      return v;
    });
    writeCarriers(updatedCarriers);

    return NextResponse.json(
      { success: true, message: 'Vehicle successfully released to Available', vehicle: releasedVehicle },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}
