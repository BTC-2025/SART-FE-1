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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const bookings = readBookings();
  const carriers = readCarriers();

  let targetVehicleId = '';
  let targetReg = '';
  let targetName = '';

  const updatedBookings = bookings.map(b => {
    if (b.id === id || b.bookingId === id) {
      targetVehicleId = b.vehicleId;
      targetReg = (b.vehicleReg || b.plate || '').toLowerCase();
      targetName = (b.vehicleName || '').toLowerCase();
      return { ...b, status: 'Completed', updatedAt: new Date().toISOString() };
    }
    return b;
  });

  writeBookings(updatedBookings);

  // Release vehicle back to Available
  const updatedCarriers = carriers.map(v => {
    const matches =
      (targetVehicleId && v.id === targetVehicleId) ||
      (targetReg && (v.plate?.toLowerCase() === targetReg || v.regId?.toLowerCase() === targetReg)) ||
      (targetName && v.name?.toLowerCase() === targetName);

    if (matches) {
      return {
        ...v,
        isAvailable: true,
        status: 'Available',
        bookingDetails: null,
        updatedAt: new Date().toISOString()
      };
    }
    return v;
  });

  writeCarriers(updatedCarriers);

  return NextResponse.json({ success: true, message: 'Carrier booking completed and vehicle released' }, { headers: corsHeaders });
}
