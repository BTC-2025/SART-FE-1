export interface HelicopterItem {
  id: string;
  operator: string;
  heliNo: string;
  operatorLogoColor: string;
  depTime: string;
  depHeliCode: string; // e.g. "MAA-HP1"
  depCity: string;
  arrTime: string;
  arrHeliCode: string; // e.g. "IXE-HL"
  arrCity: string;
  duration: string;
  durationMinutes: number;
  stopsCount: number; // 0 = Direct Helipad, 1 = 1 Refuel Stop
  stopsText: string;
  refuelHelipad?: string;
  fare: number;
  baggageInfo: string;
  heliModel: string;
  seatingCapacity: string;
  cruisingSpeed: string;
  rangeKm: string;
  freeCancellation?: boolean;
}

export interface HelicopterCoupon {
  code: string;
  title: string;
  desc: string;
  color: string;
}

export const HELICOPTER_COUPONS: HelicopterCoupon[] = [



];

export const HELIPAD_CODES: Record<string, string> = {
  'chennai': 'MAA-HP',
  'mangaluru': 'IXE-HL',
  'mangalore': 'IXE-HL',
  'bengaluru': 'BLR-HL',
  'bangalore': 'BLR-HL',
  'hyderabad': 'HYD-HL',
  'mumbai': 'BOM-RW',
  'delhi': 'DEL-HP',
  'new delhi': 'DEL-HP',
  'kolkata': 'CCU-HP',
  'goa': 'GOI-HP',
  'kochi': 'COK-HL',
  'tirupati': 'TIR-HL',
  'visakhapatnam': 'VTZ-HL',
  'pune': 'PNQ-HL',
  'jaipur': 'JAI-HP',
  'shirdi': 'SHR-HP',
  'kedarnath': 'KED-HP'
};

export function getHelipadCode(cityName: string): string {
  const clean = cityName.toLowerCase().split('-')[0].trim();
  for (const [key, code] of Object.entries(HELIPAD_CODES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return code;
    }
  }
  return `${clean.slice(0, 3).toUpperCase()}-HP`;
}

export function getHelicoptersForRoute(source: string, destination: string): HelicopterItem[] {
  const srcCode = getHelipadCode(source);
  const destCode = getHelipadCode(destination);
  const srcCity = source.split('-')[0].trim() || 'Origin Helipad';
  const destCity = destination.split('-')[0].trim() || 'Destination Helipad';

  return [
    {
      id: 'h-101',
      operator: 'Pawan Hans Skyways',
      heliNo: 'PH-407-VIP',
      operatorLogoColor: '#059669',
      depTime: '06:30',
      depHeliCode: `${srcCode}-1`,
      depCity: srcCity,
      arrTime: '07:45',
      arrHeliCode: `${destCode}-Main`,
      arrCity: destCity,
      duration: '01h 15m',
      durationMinutes: 75,
      stopsCount: 0,
      stopsText: 'Direct Helipad Hop',
      fare: 28500,
      baggageInfo: '15 Kg Cabin + 1 Personal Duffel Bag',
      heliModel: 'Bell 407 GXi Turbine',
      seatingCapacity: '6 Luxury Leather Seats',
      cruisingSpeed: '246 km/h',
      rangeKm: '624 km',
      freeCancellation: true
    },
    {
      id: 'h-102',
      operator: 'Global Vectra Helicorp',
      heliNo: 'GV-139-EXEC',
      operatorLogoColor: '#0284c7',
      depTime: '08:45',
      depHeliCode: `${srcCode}-Bay 2`,
      depCity: srcCity,
      arrTime: '09:55',
      arrHeliCode: `${destCode}-Main`,
      arrCity: destCity,
      duration: '01h 10m',
      durationMinutes: 70,
      stopsCount: 0,
      stopsText: 'Direct Helipad Hop',
      fare: 34200,
      baggageInfo: '20 Kg Luggage + Soft Bags Allowed',
      heliModel: 'AgustaWestland AW139 Twin-Engine',
      seatingCapacity: '8 VIP Club Seats',
      cruisingSpeed: '306 km/h',
      rangeKm: '1,060 km',
      freeCancellation: false
    },
    {
      id: 'h-103',
      operator: 'Heritage Aviation Charters',
      heliNo: 'HA-350-B3',
      operatorLogoColor: '#f59e0b',
      depTime: '11:15',
      depHeliCode: `${srcCode}-H1`,
      depCity: srcCity,
      arrTime: '12:50',
      arrHeliCode: `${destCode}-H2`,
      arrCity: destCity,
      duration: '01h 35m',
      durationMinutes: 95,
      stopsCount: 1,
      stopsText: '1 Refuel Stop • Waypoint HP',
      refuelHelipad: 'Vellore Tech Park Helipad',
      fare: 24900,
      baggageInfo: '12 Kg Flight Bag per passenger',
      heliModel: 'Airbus H125 Écureuil (AS350 B3e)',
      seatingCapacity: '5 Passenger Seats',
      cruisingSpeed: '252 km/h',
      rangeKm: '638 km',
      freeCancellation: true
    },
    {
      id: 'h-104',
      operator: 'Titan Aviation Helo',
      heliNo: 'TA-EC145-PRIME',
      operatorLogoColor: '#8b5cf6',
      depTime: '14:20',
      depHeliCode: `${srcCode}-VIP Rooftop`,
      depCity: srcCity,
      arrTime: '15:35',
      arrHeliCode: `${destCode}-Main`,
      arrCity: destCity,
      duration: '01h 15m',
      durationMinutes: 75,
      stopsCount: 0,
      stopsText: 'Direct Helipad Hop',
      fare: 38500,
      baggageInfo: '20 Kg Executive Bag per seat',
      heliModel: 'Airbus H145 Twin-Turbine (Mercedes-Benz Interior)',
      seatingCapacity: '8 Club Seating',
      cruisingSpeed: '248 km/h',
      rangeKm: '650 km',
      freeCancellation: true
    },
    {
      id: 'h-105',
      operator: 'FlyBlade Urban Mobility',
      heliNo: 'BLADE-S76-LUX',
      operatorLogoColor: '#e11d48',
      depTime: '16:40',
      depHeliCode: `${srcCode}-Bay 1`,
      depCity: srcCity,
      arrTime: '17:50',
      arrHeliCode: `${destCode}-Bay 3`,
      arrCity: destCity,
      duration: '01h 10m',
      durationMinutes: 70,
      stopsCount: 0,
      stopsText: 'Direct Helipad Hop',
      fare: 42000,
      baggageInfo: '25 Kg Executive Luggage Allowance',
      heliModel: 'Sikorsky S-76D Executive Chopper',
      seatingCapacity: '8 Leather Captain Recliners',
      cruisingSpeed: '287 km/h',
      rangeKm: '848 km',
      freeCancellation: false
    },
    {
      id: 'h-106',
      operator: 'Deccan Charters',
      heliNo: 'DC-B206-L4',
      operatorLogoColor: '#4f46e5',
      depTime: '18:30',
      depHeliCode: `${srcCode}-H1`,
      depCity: srcCity,
      arrTime: '20:10',
      arrHeliCode: `${destCode}-H2`,
      arrCity: destCity,
      duration: '01h 40m',
      durationMinutes: 100,
      stopsCount: 1,
      stopsText: '1 Refuel Stop • Intermediate Airfield',
      refuelHelipad: 'Tirupati Suburban Helipad',
      fare: 22800,
      baggageInfo: '10 Kg Soft luggage allowance',
      heliModel: 'Bell 206L-4 LongRanger',
      seatingCapacity: '6 Passenger Seats',
      cruisingSpeed: '205 km/h',
      rangeKm: '585 km',
      freeCancellation: true
    }
  ];
}
