import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolved = await params;
  const vehicles = readFleet();
  const vehicle = vehicles.find(v => v.id === resolved.id);
  if (vehicle) {
    return NextResponse.json({ success: true, vehicle }, { headers: corsHeaders });
  }
  return NextResponse.json({ success: false, message: 'Carrier not found' }, { status: 404, headers: corsHeaders });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolved = await params;
    const body = await request.json();
    const current = readFleet();
    const updated = current.map(v => v.id === resolved.id ? { ...v, ...body } : v);
    writeFleet(updated);
    return NextResponse.json({ success: true, vehicles: updated }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolved = await params;
    const current = readFleet();
    const updated = current.map(v => v.id === resolved.id ? { ...v, isAvailable: !v.isAvailable } : v);
    writeFleet(updated);
    return NextResponse.json({ success: true, vehicles: updated }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolved = await params;
    const current = readFleet();
    const updated = current.filter(v => v.id !== resolved.id);
    writeFleet(updated);
    return NextResponse.json({ success: true, vehicles: updated }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}
