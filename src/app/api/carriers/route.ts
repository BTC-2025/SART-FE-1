import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Shared persistence file for carrier vehicles across ports 3005 and 3007
const DATA_FILE = path.join(process.cwd(), '.carrier_fleet.json');

const DEFAULT_SEEDS = [
  {
    id: 'CRG-1001',
    name: 'Tata Ace Gold',
    mode: 'truck',
    category: 'Truck (Road Freight)',
    type: 'truck',
    brand: 'Tata Motors',
    model: 'Tata Ace Gold',
    plate: 'MH 14 EB 1102',
    regId: 'MH 14 EB 1102',
    fuel: 'Electric',
    hub: 'Pune Chakan Industrial Hub',
    location: 'Pune Chakan Industrial Hub',
    year: 2024,
    units: 2,
    payloadKg: 900,
    maxPayload: 0.9,
    weightUnit: 'Tonnes',
    containerSpace: '7.5ft Cargo Deck',
    volumeCapacity: 8.5,
    isReefer: false,
    hasGps: true,
    isHazmat: false,
    ratePerKm: 22,
    baseCharge: 500,
    advancePercent: 25,
    deposit: 1000,
    pricingText: '₹500/trip | ₹22/km | Adv: 25%',
    isAvailable: true,
    status: 'Available',
    image: '/images/carrier_mode_truck.png',
    images: ['/images/carrier_mode_truck.png'],
    rating: 4.9,
    verified: true
  },
  {
    id: 'CRG-1002',
    name: 'TVS King Cargo 3-Wheeler',
    mode: 'bike',
    category: 'Bike (Express EV/Bike)',
    type: 'bike',
    brand: 'TVS',
    model: 'TVS King Cargo 3-Wheeler',
    plate: 'MH 14 EV 4012',
    regId: 'MH 14 EV 4012',
    fuel: 'Electric (EV)',
    hub: 'Pune Central Last-Mile Delivery Hub',
    location: 'Pune Central Last-Mile Delivery Hub',
    year: 2024,
    units: 3,
    payloadKg: 150,
    maxPayload: 150,
    weightUnit: 'kg',
    containerSpace: 'Insulated Last-Mile Top Box (65L)',
    volumeCapacity: 0.65,
    isReefer: false,
    hasGps: true,
    isHazmat: false,
    ratePerKm: 14,
    baseCharge: 120,
    advancePercent: 25,
    deposit: 1000,
    pricingText: '₹120/trip | ₹14/km | Adv: 25%',
    isAvailable: true,
    status: 'Available',
    image: '/images/carrier_mode_bike.png',
    images: ['/images/carrier_mode_bike.png'],
    rating: 4.8,
    verified: true
  },
  {
    id: 'CRG-1003',
    name: 'Mahindra Blazo X 28',
    mode: 'truck',
    category: 'Truck (Road Freight)',
    type: 'truck',
    brand: 'Mahindra',
    model: 'Mahindra Blazo X 28',
    plate: 'MH 12 QX 4920',
    regId: 'MH 12 QX 4920',
    fuel: 'Diesel',
    hub: 'Mumbai Nhava Sheva Logistics Park',
    location: 'Mumbai Nhava Sheva Logistics Park',
    year: 2024,
    units: 1,
    payloadKg: 28000,
    maxPayload: 28,
    weightUnit: 'Tonnes',
    containerSpace: '24ft Heavy Open Body Container',
    volumeCapacity: 52,
    isReefer: false,
    hasGps: true,
    isHazmat: false,
    ratePerKm: 48,
    baseCharge: 1800,
    advancePercent: 30,
    deposit: 3000,
    pricingText: '₹1,800/trip | ₹48/km | Adv: 30%',
    isAvailable: true,
    status: 'Available',
    image: '/images/carrier_mode_truck.png',
    images: ['/images/carrier_mode_truck.png'],
    rating: 4.9,
    verified: true
  },
  {
    id: 'CRG-1004',
    name: 'Indian Railways Flat Container Rake (BLC)',
    mode: 'train',
    category: 'Train (Rail Rake)',
    type: 'train',
    brand: 'Indian Railways Freight',
    model: 'Flat Container Rake (BLC)',
    plate: 'IR-RAKE-9921-WR',
    regId: 'IR-RAKE-9921-WR',
    fuel: 'Electric (3-Phase AC)',
    hub: 'Dadri ICD Freight Corridor, Delhi NCR',
    location: 'Dadri ICD Freight Corridor, Delhi NCR',
    year: 2023,
    units: 1,
    payloadKg: 1300000,
    maxPayload: 1300,
    weightUnit: 'Tonnes',
    containerSpace: '45 Wagon BLC Container Rake',
    volumeCapacity: 2400,
    isReefer: false,
    hasGps: true,
    isHazmat: true,
    ratePerKm: 320,
    baseCharge: 25000,
    advancePercent: 40,
    deposit: 50000,
    pricingText: '₹25,000/trip | ₹320/km | Adv: 40%',
    isAvailable: true,
    status: 'Available',
    image: '/images/carrier_mode_train.jpg',
    images: ['/images/carrier_mode_train.jpg'],
    rating: 4.9,
    verified: true
  },
  {
    id: 'CRG-1005',
    name: 'Boeing 757-200F Freighter',
    mode: 'flight',
    category: 'Flight (Air Cargo)',
    type: 'flight',
    brand: 'Blue Dart Aviation',
    model: 'Boeing 757-200F Freighter',
    plate: 'VT-BDA',
    regId: 'VT-BDA',
    fuel: 'Jet A-1 Fuel',
    hub: 'Delhi IGI Air Cargo Terminal 2',
    location: 'Delhi IGI Air Cargo Terminal 2',
    year: 2022,
    units: 1,
    payloadKg: 30000,
    maxPayload: 30,
    weightUnit: 'Tonnes',
    containerSpace: 'Main Deck Cargo Pallets',
    volumeCapacity: 239,
    isReefer: true,
    hasGps: true,
    isHazmat: true,
    ratePerKm: 450,
    baseCharge: 35000,
    advancePercent: 50,
    deposit: 75000,
    pricingText: '₹35,000/trip | ₹450/km | Adv: 50%',
    isAvailable: true,
    status: 'Available',
    image: '/images/carrier_mode_flight.png',
    images: ['/images/carrier_mode_flight.png'],
    rating: 5.0,
    verified: true
  },
  {
    id: 'CRG-1006',
    name: 'Panamax Container Vessel (4500 TEU)',
    mode: 'ship',
    category: 'Ship (Ocean Freight)',
    type: 'ship',
    brand: 'Maersk',
    model: 'Panamax Container Vessel (4500 TEU)',
    plate: 'IMO 9732104',
    regId: 'IMO 9732104',
    fuel: 'Low Sulfur Marine Gas Oil (MGO)',
    hub: 'Jawaharlal Nehru Port Trust (JNPT), Mumbai',
    location: 'Jawaharlal Nehru Port Trust (JNPT), Mumbai',
    year: 2021,
    units: 1,
    payloadKg: 52000000,
    maxPayload: 52000,
    weightUnit: 'Tonnes',
    containerSpace: '4500 TEU ISO Container Vessel',
    volumeCapacity: 85000,
    isReefer: true,
    hasGps: true,
    isHazmat: true,
    ratePerKm: 650,
    baseCharge: 120000,
    advancePercent: 40,
    deposit: 200000,
    pricingText: '₹120,000/trip | ₹650/km | Adv: 40%',
    isAvailable: true,
    status: 'Available',
    image: '/images/carrier_mode_ship.png',
    images: ['/images/carrier_mode_ship.png'],
    rating: 4.9,
    verified: true
  }
];

function readFleet(): any[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
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
    if (searchParams.get('all') === 'true') {
      writeFleet([]);
      return NextResponse.json({ success: true, count: 0, vehicles: [] }, { headers: corsHeaders });
    }
    const rawId = searchParams.get('id') || searchParams.get('plate') || '';
    const targetId = decodeURIComponent(rawId).toLowerCase().trim();
    const targetClean = targetId.replace(/[^a-z0-9]/g, '');
    const current = readFleet();
    const updated = current.filter(v => {
      const vId = (v.id || '').toLowerCase().trim();
      const vIdClean = vId.replace(/[^a-z0-9]/g, '');
      const vPlate = (v.plate || v.regId || '').toLowerCase().trim();
      const vPlateClean = vPlate.replace(/[^a-z0-9]/g, '');
      const vName = (v.name || '').toLowerCase().trim();
      const vNameClean = vName.replace(/[^a-z0-9]/g, '');

      if (targetId && (vId === targetId || vPlate === targetId || vName === targetId)) return false;
      if (targetClean && (vIdClean === targetClean || vPlateClean === targetClean || vNameClean === targetClean)) return false;
      return true;
    });
    writeFleet(updated);
    return NextResponse.json({ success: true, vehicles: updated }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500, headers: corsHeaders });
  }
}
