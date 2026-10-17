export interface DriverVehicleOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  models: string[];
}

export interface DriverProfile {
  id: string;
  name: string;
  image: string;
  licenseNumber: string;
  badgeNumber: string;
  isLocalResident: boolean;
  locationArea: string;
  locationDistance: string;
  vehiclesKnown: string[];
  experienceYears: number;
  mobileNumber: string;
  rating: number;
  completedTrips: number;
  ratePerKm: number;
  ratePerDay: number;
  ratePerWeek: number;
  ratePerMonth: number;
  verifiedBadges: string[];
}

export const DRIVER_VEHICLE_OPTIONS: DriverVehicleOption[] = [
  { id: 'bike', name: 'Bike', icon: 'fa-motorcycle', color: '#059669', models: ['Bike'] },
  { id: 'auto', name: 'Auto', icon: 'fa-taxi', color: '#d97706', models: ['Auto'] },
  { id: 'car', name: 'Car', icon: 'fa-car', color: '#2563eb', models: ['Car'] },
  { id: 'bus', name: 'Bus', icon: 'fa-bus', color: '#10b981', models: ['Bus'] },
  { id: 'truck', name: 'Truck', icon: 'fa-truck', color: '#ea580c', models: ['Truck'] },
  { id: 'jcb', name: 'JCB', icon: 'fa-trowel-bricks', color: '#f59e0b', models: ['JCB'] },
  { id: 'tractor', name: 'Tractor', icon: 'fa-tractor', color: '#16a34a', models: ['Tractor'] },
  { id: 'ship', name: 'Ship', icon: 'fa-ship', color: '#0284c7', models: ['Ship'] },
  { id: 'helicopter', name: 'Helicopter', icon: 'fa-helicopter', color: '#7c3aed', models: ['Helicopter'] }
];

export const SERVICE_TYPE_OPTIONS = [
  { id: 'one_way_incity', label: 'One Way In-city' },
  { id: 'one_way_outstation', label: 'One Way Outstation' },
  { id: 'round_trip_incity', label: 'Round Trip In-city' },
  { id: 'round_trip_outstation', label: 'Round Trip Outstation' }
] as const;

export const HOURS_OPTIONS = [
  'Select hours',
  '4 Hours (Half Day)',
  '8 Hours (Standard Day)',
  '12 Hours (Full Day Outstation)',
  '24 Hours (Overnight Outstation)',
  'Multi-Day (48+ Hours)'
];

export const DEFAULT_DRIVERS: Record<string, DriverProfile[]> = {
  car: [
    {
      id: 'drv-c1',
      name: 'Ramesh Krishnan',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80',
      licenseNumber: 'DL-072016-LMV-55104',
      badgeNumber: 'PSV-LMV-8841',
      isLocalResident: true,
      locationArea: 'Chennai Central & Anna Nagar',
      locationDistance: '2.4 km away (Local Native)',
      vehiclesKnown: ['Hatchback', 'Sedan', 'SUV', 'Automatic & Manual'],
      experienceYears: 9,
      mobileNumber: '+91 98402 11984',
      rating: 4.92,
      completedTrips: 3420,
      ratePerKm: 12,
      ratePerDay: 1200,
      ratePerWeek: 7200,
      ratePerMonth: 26000,
      verifiedBadges: ['Police Verified', 'RTO Sarathi DL', 'First Aid Certified']
    },
    {
      id: 'drv-c2',
      name: 'Senthil Kumar V.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80',
      licenseNumber: 'DL-032014-LMV-99412',
      badgeNumber: 'PSV-LMV-6621',
      isLocalResident: true,
      locationArea: 'Guindy & Velachery Local',
      locationDistance: '3.8 km away (Local Native)',
      vehiclesKnown: ['Luxury Sedans', 'SUV (Fortuner/Innova)', 'Hill & Highway'],
      experienceYears: 12,
      mobileNumber: '+91 97890 44219',
      rating: 4.88,
      completedTrips: 4190,
      ratePerKm: 14,
      ratePerDay: 1400,
      ratePerWeek: 8400,
      ratePerMonth: 30000,
      verifiedBadges: ['Police Verified', 'VIP Chauffeur', 'Highway Specialist']
    },
    {
      id: 'drv-c3',
      name: 'Rajesh Sharma',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&q=80',
      licenseNumber: 'DL-052018-LMV-44102',
      badgeNumber: 'PSV-LMV-3319',
      isLocalResident: false,
      locationArea: 'Outstation Specialist (Bangalore/Chennai Corridor)',
      locationDistance: '7.2 km away (Regional Pilot)',
      vehiclesKnown: ['Sedan', 'MUV', 'Automatic EV Cars'],
      experienceYears: 7,
      mobileNumber: '+91 94441 55902',
      rating: 4.81,
      completedTrips: 2150,
      ratePerKm: 11,
      ratePerDay: 1100,
      ratePerWeek: 6600,
      ratePerMonth: 24000,
      verifiedBadges: ['Police Verified', 'All-India Permit', 'Non-Smoker']
    }
  ],
  bus: [
    {
      id: 'drv-b1',
      name: 'M. Duraisamy',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&q=80',
      licenseNumber: 'DL-092010-TRANS-77812',
      badgeNumber: 'PSV-BUS-COACH-1092',
      isLocalResident: true,
      locationArea: 'Koyambedu CMBT & Chennai West',
      locationDistance: '1.9 km away (Local Native)',
      vehiclesKnown: ['Volvo Multi-Axle', '12-24 Seater Mini Coach', 'BharatBenz AC Sleeper'],
      experienceYears: 15,
      mobileNumber: '+91 98410 77319',
      rating: 4.95,
      completedTrips: 5210,
      ratePerKm: 22,
      ratePerDay: 2200,
      ratePerWeek: 13500,
      ratePerMonth: 48000,
      verifiedBadges: ['PSV Heavy Coach Endorsed', 'IDTR Gold Safety', 'Police Verified']
    },
    {
      id: 'drv-b2',
      name: 'Anbarasan K.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&q=80',
      licenseNumber: 'DL-112015-TRANS-44810',
      badgeNumber: 'PSV-BUS-COACH-7721',
      isLocalResident: false,
      locationArea: 'Inter-City Interstate Corridor (TN-KA-KL)',
      locationDistance: '5.5 km away (Regional Interstate)',
      vehiclesKnown: ['Tempo Traveller 16-24', 'Mini Bus', 'School/Staff Coach'],
      experienceYears: 10,
      mobileNumber: '+91 94432 88901',
      rating: 4.86,
      completedTrips: 2890,
      ratePerKm: 20,
      ratePerDay: 1900,
      ratePerWeek: 11800,
      ratePerMonth: 42000,
      verifiedBadges: ['Police Verified', 'Passenger Transit Badge', 'Zero Accident Record']
    }
  ],
  bike: [
    {
      id: 'drv-bk1',
      name: 'Karthik Raja',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80',
      licenseNumber: 'DL-042019-MCWG-89312',
      badgeNumber: 'TR-2W-PILOT-8821',
      isLocalResident: true,
      locationArea: 'T. Nagar & Nungambakkam',
      locationDistance: '1.2 km away (Local Native)',
      vehiclesKnown: ['Gearless Scooters', 'Royal Enfield 350/650', 'Sport Bikes', 'EV 2W'],
      experienceYears: 6,
      mobileNumber: '+91 99401 22390',
      rating: 4.91,
      completedTrips: 2840,
      ratePerKm: 6,
      ratePerDay: 600,
      ratePerWeek: 3600,
      ratePerMonth: 13500,
      verifiedBadges: ['Police Verified', 'Commercial 2W Badge', 'Defensive Riding Certified']
    }
  ],
  auto: [
    {
      id: 'drv-a1',
      name: 'Murugan S.',
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&q=80',
      licenseNumber: 'DL-092015-3WCAB-33912',
      badgeNumber: 'PSV-AUTO-CITY-1048',
      isLocalResident: true,
      locationArea: 'Egmore & Central Railway Station Local',
      locationDistance: '1.5 km away (Local Native)',
      vehiclesKnown: ['Bajaj RE CNG', 'Piaggio Ape', 'Electric Mahindra Treo'],
      experienceYears: 8,
      mobileNumber: '+91 98409 66120',
      rating: 4.87,
      completedTrips: 4320,
      ratePerKm: 8,
      ratePerDay: 750,
      ratePerWeek: 4500,
      ratePerMonth: 16500,
      verifiedBadges: ['City 3W Badge', 'Police Verified', 'Local Street Master']
    }
  ],
  truck: [
    {
      id: 'drv-t1',
      name: 'Gurmeet Singh',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=160&q=80',
      licenseNumber: 'DL-012008-HGV-99410',
      badgeNumber: 'TRANS-HGV-ALL-INDIA-552',
      isLocalResident: false,
      locationArea: 'Madhavaram Truck Terminal & Warehouse Zone',
      locationDistance: '6.8 km away (ODC & Logistics Master)',
      vehiclesKnown: ['Tata Ace 1-Ton', 'Eicher 14ft Container', 'Tata 1613 10-Wheeler', 'Multi-Axle Trailer'],
      experienceYears: 16,
      mobileNumber: '+91 98112 33490',
      rating: 4.93,
      completedTrips: 3750,
      ratePerKm: 25,
      ratePerDay: 2500,
      ratePerWeek: 15500,
      ratePerMonth: 55000,
      verifiedBadges: ['National Permit HGV', 'Heavy Articulated Endorsement', 'Police Verified']
    }
  ],
  jcb: [
    {
      id: 'drv-j1',
      name: 'Rajendra Prasad',
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=160&q=80',
      licenseNumber: 'DL-062012-LMV-EARTH-8812',
      badgeNumber: 'HEAVY-EARTHMOVER-OPERATOR-991',
      isLocalResident: true,
      locationArea: 'Sriperumbudur & Oragadam Industrial Depot',
      locationDistance: '4.2 km away (Certified Operator)',
      vehiclesKnown: ['JCB 3DX Super Backhoe', 'Hydraulic Excavator JS205', 'Wheel Loader', 'Trench Digger'],
      experienceYears: 11,
      mobileNumber: '+91 97880 11994',
      rating: 4.89,
      completedTrips: 1850,
      ratePerKm: 35,
      ratePerDay: 3000,
      ratePerWeek: 18000,
      ratePerMonth: 65000,
      verifiedBadges: ['Earthmoving Machinery License', 'Safety Certified', 'Police Verified']
    }
  ],
  tractor: [
    {
      id: 'drv-tr1',
      name: 'Balan P.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&q=80',
      licenseNumber: 'DL-082015-TRACT-44192',
      badgeNumber: 'AGRI-HEAVY-IMPLEM-229',
      isLocalResident: true,
      locationArea: 'Red Hills Agricultural & Farm Yard',
      locationDistance: '3.1 km away (Local Native)',
      vehiclesKnown: ['Mahindra 575 DI (Trolley)', 'John Deere 5050D', 'Rotavator & Harvester Implements'],
      experienceYears: 9,
      mobileNumber: '+91 94448 33190',
      rating: 4.88,
      completedTrips: 1420,
      ratePerKm: 18,
      ratePerDay: 1600,
      ratePerWeek: 9800,
      ratePerMonth: 34000,
      verifiedBadges: ['Tractor-Trailer Commercial', 'Agri Heavy Certified', 'Police Verified']
    }
  ],
  ship: [
    {
      id: 'drv-s1',
      name: 'Captain Francis D’Souza',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80',
      licenseNumber: 'MMD-STCW95-MASTER-44819',
      badgeNumber: 'DG-SHIPPING-CHIEF-PILOT-091',
      isLocalResident: true,
      locationArea: 'Chennai Harbor & Royal Yacht Club Marina',
      locationDistance: '2.8 km away (Coastal Master Pilot)',
      vehiclesKnown: ['Yamaha 150HP Speedboat', 'Luxury Motor Yacht', 'Harbor Cruise & Catamaran'],
      experienceYears: 18,
      mobileNumber: '+91 98401 99281',
      rating: 4.97,
      completedTrips: 1120,
      ratePerKm: 50,
      ratePerDay: 8000,
      ratePerWeek: 48000,
      ratePerMonth: 160000,
      verifiedBadges: ['STCW-95 Master Mariner', 'Coastal Navigation Endorsement', 'DG Shipping Verified']
    }
  ],
  helicopter: [
    {
      id: 'drv-h1',
      name: 'Commander Vikram Malhotra',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80',
      licenseNumber: 'DGCA-CHPL-COMMERCIAL-9982',
      badgeNumber: 'ROTARY-PILOT-IN-COMMAND-774',
      isLocalResident: true,
      locationArea: 'Meenambakkam Airport Bay & Helipad Strip',
      locationDistance: '4.5 km away (Type-Rated Pilot)',
      vehiclesKnown: ['Bell 407 Chopper', 'Airbus H125 / H130', 'Twin Engine Executive Choppers'],
      experienceYears: 14,
      mobileNumber: '+91 98200 44102',
      rating: 4.98,
      completedTrips: 840,
      ratePerKm: 150,
      ratePerDay: 25000,
      ratePerWeek: 140000,
      ratePerMonth: 450000,
      verifiedBadges: ['DGCA Commercial Helicopter Pilot', 'Instrument Rating (IR)', 'VIP Protocol Cleared']
    }
  ]
};
