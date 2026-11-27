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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = searchParams.get('vehicleId');
  let bookings = readBookings();

  if (bookings.length === 0) {
    try {
      const beRes = await fetch('http://localhost:5000/api/carriers/bookings', { cache: 'no-store' });
      if (beRes.ok) {
        const beData = await beRes.json();
        if (beData.bookings && Array.isArray(beData.bookings)) {
          bookings = beData.bookings;
        }
      }
    } catch (e) { }
  }

  if (vehicleId) {
    const vLower = vehicleId.toLowerCase();
    const vClean = vLower.replace(/[^a-z0-9]/g, '');
    const matched = bookings.filter(b =>
      b.vehicleId === vehicleId ||
      b.vehicleName?.toLowerCase() === vLower ||
      b.vehicleReg?.toLowerCase() === vLower ||
      (b.vehicleName && b.vehicleName.toLowerCase().replace(/[^a-z0-9]/g, '') === vClean) ||
      (b.vehicleReg && b.vehicleReg.toLowerCase().replace(/[^a-z0-9]/g, '') === vClean)
    );
    return NextResponse.json({ success: true, count: matched.length, bookings: matched }, { headers: corsHeaders });
  }

  return NextResponse.json({ success: true, count: bookings.length, bookings }, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const b = await request.json();
    const id = b.id || b.bookingId || `CRG-BK-${Date.now().toString().slice(-6)}`;
    const currentBookings = readBookings();

    const bookingRecord = {
      ...b,
      id,
      bookingId: id,
      status: b.status || 'Advance Paid - Ready to Dispatch',
      createdAt: b.createdAt || new Date().toISOString()
    };

    const updatedBookings = [bookingRecord, ...currentBookings.filter(item => item.id !== id)];
    writeBookings(updatedBookings);

    // Update vehicle availability to false and save bookingDetails
    const currentCarriers = readCarriers();
    const vehicleId = b.vehicleId;
    const vehicleReg = (b.vehicleReg || b.plate || '').toLowerCase();
    const vehicleName = (b.vehicleName || '').toLowerCase();

    const updatedCarriers = currentCarriers.map(v => {
      const matches =
        (vehicleId && v.id === vehicleId) ||
        (vehicleReg && (v.plate?.toLowerCase() === vehicleReg || v.regId?.toLowerCase() === vehicleReg)) ||
        (vehicleName && v.name?.toLowerCase() === vehicleName);

      if (matches) {
        return {
          ...v,
          isAvailable: false,
          status: 'On Trip',
          bookingDetails: bookingRecord,
          updatedAt: new Date().toISOString()
        };
      }
      return v;
    });

    writeCarriers(updatedCarriers);

    return NextResponse.json({
      success: true,
      message: 'Carrier booking recorded and vehicle marked On Trip',
      booking: bookingRecord
    }, { status: 201, headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}
