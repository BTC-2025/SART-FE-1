import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), '.drivers_fleet.json');

function readDrivers(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) { }
  return [];
}

function writeDrivers(drivers: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(drivers, null, 2), 'utf-8');
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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const drivers = readDrivers();
  const driver = drivers.find(d => d.id === resolvedParams.id);
  if (!driver) {
    return NextResponse.json({ success: false, message: 'Driver not found' }, { status: 404, headers: corsHeaders });
  }
  return NextResponse.json({ success: true, driver }, { headers: corsHeaders });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json().catch(() => ({}));
    const drivers = readDrivers();
    const updated = drivers.map(d => {
      if (d.id === resolvedParams.id) {
        return {
          ...d,
          ...body,
          isAvailable: body.isAvailable !== undefined ? body.isAvailable : !d.isAvailable,
          updatedAt: new Date().toISOString()
        };
      }
      return d;
    });
    writeDrivers(updated);
    return NextResponse.json({ success: true, drivers: updated }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const drivers = readDrivers();
    const updated = drivers.filter(d => d.id !== resolvedParams.id);
    writeDrivers(updated);
    return NextResponse.json({ success: true, message: 'Driver deleted', drivers: updated }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}
