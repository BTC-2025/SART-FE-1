import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Shared persistence file for carrier vehicles across ports 3005 and 3007
const DATA_FILE = path.join(process.cwd(), '.carrier_fleet.json');

function readFleet(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading carrier fleet file:', err);
  }
  return [];
}

function writeFleet(fleet: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(fleet, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing carrier fleet file:', err);
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

export async function GET() {
  const vehicles = readFleet();
  return NextResponse.json({ success: true, count: vehicles.length, vehicles }, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = readFleet();
    const newVehicle = {
      ...body,
      id: body.id || `CRG-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newVehicle, ...current.filter(v => v.id !== newVehicle.id)];
    writeFleet(updated);
    return NextResponse.json({ success: true, vehicle: newVehicle, vehicles: updated }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const current = readFleet();
    const updated = current.map(v => v.id === body.id ? { ...v, ...body } : v);
    writeFleet(updated);
    return NextResponse.json({ success: true, vehicles: updated }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const current = readFleet();
    const updated = current.filter(v => v.id !== id);
    writeFleet(updated);
    return NextResponse.json({ success: true, vehicles: updated }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}
