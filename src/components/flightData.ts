export interface FlightItem {
  id: string;
  airline: string;
  flightNo: string;
  airlineLogoColor: string;
  depTime: string;
  depAirportCode: string;
  depCity: string;
  arrTime: string;
  arrAirportCode: string;
  arrCity: string;
  duration: string;
  durationMinutes: number;
  stopsCount: number; // 0 = Non Stop, 1 = 1 Stop
  stopsText: string; // 'Non stop' or '1 stop • BLR'
  layoverAirport?: string;
  layoverDurationMin?: number;
  fare: number;
  baggageInfo: string;
  aircraftSize: 'Small / Mid - size aircraft' | 'Wide-body Boeing/Airbus';
  freeCancellation?: boolean;
}

export interface FlightDateFare {
  date: string;
  fare: number;
  label: string; // e.g. "Wed, Oct 14"
}

export interface FlightCoupon {
  code: string;
  title: string;
  desc: string;
  color: string;
}

export const FLIGHT_COUPONS: FlightCoupon[] = [
  {
    code: 'GOKOTAKEMI',
    title: 'GOKOTAKEMI',
    desc: 'Flat 10% off with code GOKOTAKEMI',
    color: '#ea580c'
  },
  {
    code: 'GOYESEMI',
    title: 'GOYESEMI',
    desc: 'Upto 1800 OFF with code GOYESEMI',
    color: '#0284c7'
  },
  {
    code: 'GOPNB',
    title: 'GOPNB',
    desc: 'Flat 12% off with code GOPNB',
    color: '#e11d48'
  }
];

// Airport code helper mappings
export const AIRPORT_CODES: Record<string, string> = {
  'chennai': 'MAA',
  'mangaluru': 'IXE',
  'mangalore': 'IXE',
  'bengaluru': 'BLR',
  'bangalore': 'BLR',
  'hyderabad': 'HYD',
  'mumbai': 'BOM',
  'delhi': 'DEL',
  'new delhi': 'DEL',
  'kolkata': 'CCU',
  'goa': 'GOI',
  'vijayawada': 'VGA',
  'kochi': 'COK',
  'madurai': 'IXM',
  'coimbatore': 'CJB',
  'tirupati': 'TIR',
  'visakhapatnam': 'VTZ',
  'pune': 'PNQ',
  'jaipur': 'JAI'
};

export function getAirportCode(cityName: string): string {
  const clean = cityName.toLowerCase().split('-')[0].trim();
  for (const [key, code] of Object.entries(AIRPORT_CODES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return code;
    }
  }
  return clean.slice(0, 3).toUpperCase();
}

// Generate tailored flights between any source & destination
export function getFlightsForRoute(source: string, destination: string): FlightItem[] {
  const srcCode = getAirportCode(source);
  const destCode = getAirportCode(destination);
  const srcCity = source.split('-')[0].trim() || 'Origin';
  const destCity = destination.split('-')[0].trim() || 'Destination';

  return [
    {
      id: 'fl-101',
      airline: 'IndiGo',
      flightNo: '6E-6892 | 6E-7114',
      airlineLogoColor: '#1d4ed8',
      depTime: '10:55',
      depAirportCode: srcCode,
      depCity: srcCity,
      arrTime: '15:20',
      arrAirportCode: destCode,
      arrCity: destCity,
      duration: '04h 25m',
      durationMinutes: 265,
      stopsCount: 1,
      stopsText: '1 stop • BLR',
      layoverAirport: 'Bengaluru',
      layoverDurationMin: 110,
      fare: 7721,
      baggageInfo: '15kg check-in • 7kg cabin',
      aircraftSize: 'Small / Mid - size aircraft',
      freeCancellation: true
    },
    {
      id: 'fl-102',
      airline: 'IndiGo',
      flightNo: '6E-6815 | 6E-5321',
      airlineLogoColor: '#1d4ed8',
      depTime: '08:55',
      depAirportCode: srcCode,
      depCity: srcCity,
      arrTime: '15:50',
      arrAirportCode: destCode,
      arrCity: destCity,
      duration: '06h 55m',
      durationMinutes: 415,
      stopsCount: 1,
      stopsText: '1 stop • BLR',
      layoverAirport: 'Bengaluru',
      layoverDurationMin: 180,
      fare: 7721,
      baggageInfo: '15kg check-in • 7kg cabin',
      aircraftSize: 'Small / Mid - size aircraft'
    },
    {
      id: 'fl-103',
      airline: 'IndiGo',
      flightNo: '6E-6081 | 6E-3441',
      airlineLogoColor: '#1d4ed8',
      depTime: '07:05',
      depAirportCode: srcCode,
      depCity: srcCity,
      arrTime: '15:20',
      arrAirportCode: destCode,
      arrCity: destCity,
      duration: '08h 15m',
      durationMinutes: 495,
      stopsCount: 1,
      stopsText: '1 stop • BLR',
      layoverAirport: 'Bengaluru',
      layoverDurationMin: 290,
      fare: 7721,
      baggageInfo: '15kg check-in • 7kg cabin',
      aircraftSize: 'Small / Mid - size aircraft'
    },
    {
      id: 'fl-104',
      airline: 'IndiGo',
      flightNo: '6E-7346',
      airlineLogoColor: '#1d4ed8',
      depTime: '05:40',
      depAirportCode: srcCode,
      depCity: srcCity,
      arrTime: '07:25',
      arrAirportCode: destCode,
      arrCity: destCity,
      duration: '01h 45m',
      durationMinutes: 105,
      stopsCount: 0,
      stopsText: 'Non stop',
      fare: 7970,
      baggageInfo: '15kg check-in • 7kg cabin',
      aircraftSize: 'Small / Mid - size aircraft',
      freeCancellation: true
    },
    {
      id: 'fl-105',
      airline: 'IndiGo',
      flightNo: '6E-6815 | 6E-7114',
      airlineLogoColor: '#1d4ed8',
      depTime: '08:55',
      depAirportCode: srcCode,
      depCity: srcCity,
      arrTime: '15:20',
      arrAirportCode: destCode,
      arrCity: destCity,
      duration: '06h 25m',
      durationMinutes: 385,
      stopsCount: 1,
      stopsText: '1 stop • BLR',
      layoverAirport: 'Bengaluru',
      layoverDurationMin: 150,
      fare: 8236,
      baggageInfo: '15kg check-in • 7kg cabin',
      aircraftSize: 'Small / Mid - size aircraft'
    },
    {
      id: 'fl-106',
      airline: 'Air India Express',
      flightNo: 'IX-1385 | IX-1901',
      airlineLogoColor: '#ea580c',
      depTime: '08:55',
      depAirportCode: srcCode,
      depCity: srcCity,
      arrTime: '17:45',
      arrAirportCode: destCode,
      arrCity: destCity,
      duration: '08h 50m',
      durationMinutes: 530,
      stopsCount: 1,
      stopsText: '1 stop • BLR',
      layoverAirport: 'Bengaluru',
      layoverDurationMin: 320,
      fare: 8703,
      baggageInfo: '15kg check-in • 7kg cabin',
      aircraftSize: 'Small / Mid - size aircraft'
    },
    {
      id: 'fl-107',
      airline: 'Air India Express',
      flightNo: 'IX-2786 | IX-1442',
      airlineLogoColor: '#ea580c',
      depTime: '07:25',
      depAirportCode: srcCode,
      depCity: srcCity,
      arrTime: '17:45',
      arrAirportCode: destCode,
      arrCity: destCity,
      duration: '10h 20m',
      durationMinutes: 620,
      stopsCount: 1,
      stopsText: '1 stop • BLR',
      layoverAirport: 'Bengaluru',
      layoverDurationMin: 410,
      fare: 8703,
      baggageInfo: '15kg check-in • 7kg cabin',
      aircraftSize: 'Small / Mid - size aircraft'
    },
    {
      id: 'fl-108',
      airline: 'Air India',
      flightNo: 'AI-542 | AI-621',
      airlineLogoColor: '#dc2626',
      depTime: '09:30',
      depAirportCode: srcCode,
      depCity: srcCity,
      arrTime: '16:40',
      arrAirportCode: destCode,
      arrCity: destCity,
      duration: '07h 10m',
      durationMinutes: 430,
      stopsCount: 1,
      stopsText: '1 stop • HYD',
      layoverAirport: 'Hyderabad',
      layoverDurationMin: 190,
      fare: 9450,
      baggageInfo: '20kg check-in • 7kg cabin • Free Meal',
      aircraftSize: 'Small / Mid - size aircraft'
    },
    {
      id: 'fl-109',
      airline: 'Air India',
      flightNo: 'AI-832',
      airlineLogoColor: '#dc2626',
      depTime: '17:45',
      depAirportCode: srcCode,
      depCity: srcCity,
      arrTime: '19:30',
      arrAirportCode: destCode,
      arrCity: destCity,
      duration: '01h 45m',
      durationMinutes: 105,
      stopsCount: 0,
      stopsText: 'Non stop',
      fare: 9882,
      baggageInfo: '25kg check-in • 7kg cabin • Gourmet Dining',
      aircraftSize: 'Small / Mid - size aircraft'
    },
    {
      id: 'fl-110',
      airline: 'Air India',
      flightNo: 'AI-214 | AI-902',
      airlineLogoColor: '#dc2626',
      depTime: '13:15',
      depAirportCode: srcCode,
      depCity: srcCity,
      arrTime: '21:10',
      arrAirportCode: destCode,
      arrCity: destCity,
      duration: '07h 55m',
      durationMinutes: 475,
      stopsCount: 1,
      stopsText: '1 stop • BOM',
      layoverAirport: 'Mumbai',
      layoverDurationMin: 220,
      fare: 10644,
      baggageInfo: '20kg check-in • 7kg cabin',
      aircraftSize: 'Small / Mid - size aircraft'
    },
    {
      id: 'fl-111',
      airline: 'Air India Express',
      flightNo: 'IX-321 | IX-404',
      airlineLogoColor: '#ea580c',
      depTime: '11:20',
      depAirportCode: srcCode,
      depCity: srcCity,
      arrTime: '18:50',
      arrAirportCode: destCode,
      arrCity: destCity,
      duration: '07h 30m',
      durationMinutes: 450,
      stopsCount: 1,
      stopsText: '1 stop • COK',
      layoverAirport: 'Kochi',
      layoverDurationMin: 180,
      fare: 8495,
      baggageInfo: '15kg check-in • 7kg cabin',
      aircraftSize: 'Small / Mid - size aircraft'
    },
    {
      id: 'fl-112',
      airline: 'Air India',
      flightNo: 'AI-664 | AI-808',
      airlineLogoColor: '#dc2626',
      depTime: '06:10',
      depAirportCode: srcCode,
      depCity: srcCity,
      arrTime: '13:55',
      arrAirportCode: destCode,
      arrCity: destCity,
      duration: '07h 45m',
      durationMinutes: 465,
      stopsCount: 1,
      stopsText: '1 stop • IXM',
      layoverAirport: 'Madurai',
      layoverDurationMin: 160,
      fare: 9120,
      baggageInfo: '20kg check-in • 7kg cabin',
      aircraftSize: 'Small / Mid - size aircraft'
    }
  ];
}
