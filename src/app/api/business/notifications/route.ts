import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), '.business_notifications.json');

function readNotifications(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading business notifications file:', err);
  }
  return [];
}

function writeNotifications(notifications: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(notifications, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing business notifications file:', err);
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

export async function GET() {
  const notifs = readNotifications();
  const unreadCount = notifs.filter(n => !n.read).length;
  return NextResponse.json({
    success: true,
    count: notifs.length,
    unreadCount,
    data: notifs
  }, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const b = await request.json();
    const current = readNotifications();

    const isDriver = b.type === 'driver_booking';
    const isCarrier = b.type === 'carrier_booking';
    const isParking = b.type === 'parking_booking';

    let defaultBadge = 'New Rental Booking';
    if (isDriver) defaultBadge = 'New Driver Booking';
    else if (isCarrier) defaultBadge = 'New Logistics Booking';
    else if (isParking) defaultBadge = 'New Parking Reservation';

    let defaultCategory = 'Chauffeur / Driver';
    if (isCarrier) defaultCategory = 'Commercial Freight';
    else if (isParking) defaultCategory = b.category || 'Parking Slot';
    else if (!isDriver && !isCarrier) defaultCategory = b.category || 'Rental Vehicle';

    let defaultTitle = `${b.customerName || 'Customer'} booked a ${b.category || defaultCategory} (${b.vehicleName || ''})`;
    if (isDriver) defaultTitle = `${b.customerName || 'Customer'} booked Captain: ${b.vehicleName || 'Driver'}`;
    else if (isParking) defaultTitle = `${b.customerName || 'Customer'} reserved parking at ${b.vehicleName || 'Yard'}`;

    const newNotif = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: b.type || (isDriver ? 'driver_booking' : isParking ? 'parking_booking' : 'rental_booking'),
      badge: b.badge || defaultBadge,
      title: b.title || defaultTitle,
      customerName: b.customerName || 'Customer',
      customerPhone: b.customerPhone || '',
      category: b.category || defaultCategory,
      vehicleName: b.vehicleName || 'Vehicle',
      vehiclePlate: b.vehiclePlate || '',
      vehicleNumber: b.vehicleNumber || b.vehiclePlate || '',
      vehicleModel: b.vehicleModel || '',
      startTime: b.startTime || b.time || '',
      endTime: b.endTime || '',
      date: b.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: b.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      bookingId: b.bookingId || '',
      totalAmount: b.totalAmount || 0,
      read: false,
      createdAt: new Date().toISOString()
    };

    const updated = [newNotif, ...current].slice(0, 50);
    writeNotifications(updated);

    return NextResponse.json({
      success: true,
      data: newNotif
    }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function PATCH() {
  try {
    const current = readNotifications();
    const updated = current.map(n => ({ ...n, read: true }));
    writeNotifications(updated);
    return NextResponse.json({
      success: true,
      message: 'All notifications marked as read',
      unreadCount: 0
    }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}
