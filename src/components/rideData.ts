export type RideCategoryMode = 'bike' | 'auto' | 'car';

export interface RouteStop {
  id: string;
  name: string;
  purpose: string;
  lat?: number;
  lng?: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface VehicleConfig {
  id: string;
  title: string;
  minFare: number;
  baseFare: number;
  perKm: number;
  perMinute: number;
  waitingChargePerStop: number;
  badge?: string;
  badgeClass?: string;
  image?: string;
  icon?: string;
  desc: string;
}

// Config objects per vehicle type
export const VEHICLE_CONFIGS: Record<RideCategoryMode, VehicleConfig[]> = {
  bike: [
    {
      id: 'scooty',
      title: 'Scooty',
      minFare: 25,
      baseFare: 20,
      perKm: 5.5,
      perMinute: 0.8,
      waitingChargePerStop: 15,
      badge: 'Eco Friendly & Smooth',
      badgeClass: '',
      image: '/images/red_scooty.png',
      desc: 'Comfortable footboard for bag, smooth city cruise, top safety rating'
    },
    {
      id: 'bike',
      title: 'Bike',
      minFare: 30,
      baseFare: 25,
      perKm: 6.5,
      perMinute: 0.9,
      waitingChargePerStop: 15,
      badge: 'Fastest Ride',
      badgeClass: 'popular',
      image: '/images/blue_bike.png',
      desc: 'Quickest travel through signals, verified rider captain, disposable hairnet'
    }
  ],
  auto: [
    {
      id: 'auto_standard',
      title: 'Auto',
      minFare: 40,
      baseFare: 35,
      perKm: 11,
      perMinute: 1.2,
      waitingChargePerStop: 20,
      badge: 'Pocket Friendly',
      badgeClass: 'popular',
      image: '/images/auto_green_yellow.png',
      desc: 'Doorstep pickup, open breeze, fit for 3 passengers & luggage'
    },
    {
      id: 'auto_plus',
      title: 'Auto Plus',
      minFare: 50,
      baseFare: 45,
      perKm: 13,
      perMinute: 1.5,
      waitingChargePerStop: 25,
      badge: 'Top Rated 4.9★',
      badgeClass: 'premium',
      image: '/images/auto_yellow_black.png',
      desc: 'Experienced super drivers, cleanest auto, immediate dispatch'
    }
  ],
  car: [
    {
      id: 'car_economy',
      title: 'Cab Economy',
      minFare: 80,
      baseFare: 70,
      perKm: 14,
      perMinute: 1.8,
      waitingChargePerStop: 30,
      badge: 'Best Value',
      badgeClass: 'popular',
      image: '/images/cab_economy.png',
      desc: 'Air-conditioned hatchback, affordable daily commute'
    },
    {
      id: 'car_sedan',
      title: 'Cab Premium',
      minFare: 100,
      baseFare: 90,
      perKm: 17,
      perMinute: 2.2,
      waitingChargePerStop: 35,
      badge: 'Comfort Sedan',
      badgeClass: 'premium',
      image: '/images/cab_sedan.png',
      desc: 'Spacious Dzire/Etios with top-rated driver & ample boot space'
    },
    {
      id: 'car_suv',
      title: 'Family Ride 6-Seater SUV',
      minFare: 150,
      baseFare: 130,
      perKm: 24,
      perMinute: 3.0,
      waitingChargePerStop: 45,
      badge: 'Family & Groups',
      badgeClass: '',
      image: '/images/cab_xl.png',
      desc: 'Innova/Ertiga with extra legroom and large luggage carrier'
    }
  ]
};

// Known major landmarks for instant fast address lookup
export const KNOWN_LOCATIONS: { [key: string]: LatLng } = {
  'korukkupet': { lat: 13.1118, lng: 80.2789 },
  'meenambal nagar': { lat: 13.1118, lng: 80.2789 },
  'old washermanpet': { lat: 13.1118, lng: 80.2789 },
  'chennai central': { lat: 13.0827, lng: 80.2755 },
  'central': { lat: 13.0827, lng: 80.2755 },
  'chennai': { lat: 13.0827, lng: 80.2755 },
  'anna salai': { lat: 13.0604, lng: 80.2496 },
  't nagar': { lat: 13.0418, lng: 80.2341 },
  'anna nagar': { lat: 13.0850, lng: 80.2101 },
  'vadapalani': { lat: 13.0500, lng: 80.2121 },
  'airport': { lat: 12.9941, lng: 80.1709 },
  'guindy': { lat: 13.0067, lng: 80.2025 },
  'velachery': { lat: 12.9815, lng: 80.2180 },
  'tambaram': { lat: 12.9249, lng: 80.1000 },
  'ambattur': { lat: 13.1143, lng: 80.1548 },
  'avadi': { lat: 13.1147, lng: 80.1018 },
  'porur': { lat: 13.0382, lng: 80.1565 },
  'omr': { lat: 12.8710, lng: 80.2220 },
  'vellore': { lat: 12.9165, lng: 79.1325 },
  'katpadi': { lat: 12.9751, lng: 79.1360 },
  'vit': { lat: 12.9692, lng: 79.1559 },
  'cmc': { lat: 12.9250, lng: 79.1350 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'coimbatore': { lat: 11.0168, lng: 76.9558 },
  'madurai': { lat: 9.9252, lng: 78.1198 },
  'salem': { lat: 11.6643, lng: 78.1460 },
  'pondicherry': { lat: 11.9416, lng: 79.8083 }
};

export function formatDurationHuman(seconds: number): string {
  const totalMin = Math.round(seconds / 60);
  const hrs = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hrs > 0) {
    return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
  }
  return `${Math.max(1, mins)} min`;
}

export interface SingleSourceRouteState {
  origin: LatLng | null;
  destination: LatLng | null;
  stops: RouteStop[];
  distanceKm: number | null;
  durationMin: number | null;
  durationText: string;
}

export interface RideBookedInfo {
  type: string;
  captain: string;
  plate: string;
  otp: string;
  fare: number;
  eta: string;
}
