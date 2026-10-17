export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  priceDisplay: string;
  pricePerHour: number;
  rating: number;
  reviewsCount: number;
  distance: string;
  host: string;
  features: string[];
  image: string;
  availableSlots: number;
  totalSlots: number;
  operatingHours: string;
}

export interface VehicleTypeOption {
  id: string;
  label: string;
  icon: string;
  baseRate: number;
}

export interface DurationPack {
  id: string;
  hours: number;
  label: string;
  tag: string;
  discount: number;
  saveText: string;
}

export const CITIES = [
  'Gurugram',
  'Delhi NCR',
  'Bengaluru',
  'Mumbai',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Trivandrum',
  'Kochi'
];

export const VEHICLE_TYPES: VehicleTypeOption[] = [
  { id: 'bike', label: 'Bike / Scooter', icon: 'fa-motorcycle', baseRate: 20 },
  { id: 'car', label: 'Car / Jeep', icon: 'fa-car', baseRate: 50 },
  { id: 'bus', label: 'Bus', icon: 'fa-bus', baseRate: 150 },
  { id: 'minibus', label: 'Mini bus', icon: 'fa-van-shuttle', baseRate: 100 },
  { id: 'autorickshaw', label: 'Auto rickshaw', icon: 'fa-taxi', baseRate: 30 },
  { id: 'truck', label: 'Truck', icon: 'fa-truck', baseRate: 200 },
  { id: 'minitruck', label: 'Mini truck', icon: 'fa-truck-pickup', baseRate: 120 },
  { id: 'pickup', label: 'Pickup', icon: 'fa-truck-moving', baseRate: 90 }
];

export const DURATION_PACKS: DurationPack[] = [
  { id: '1hr', hours: 1, label: '1 Hr', tag: 'Basic', discount: 0, saveText: '' },
  { id: '2hr', hours: 2, label: '2 Hrs', tag: '', discount: 4, saveText: 'Save ₹4' },
  { id: '4hr', hours: 4, label: '4 Hrs', tag: 'Best seller', discount: 22, saveText: 'Save ₹22' },
  { id: '6hr', hours: 6, label: '6 Hrs', tag: '', discount: 48, saveText: 'Save ₹48' },
  { id: '12hr', hours: 12, label: '12 Hrs', tag: 'Day pass', discount: 100, saveText: 'Save ₹100' },
  { id: '24hr', hours: 24, label: '24 Hrs', tag: 'Full day', discount: 220, saveText: 'Save ₹220' }
];

export const MOCK_SPOTS_DATA: Record<string, ParkingSpot[]> = {
  default: [
    {
      id: 'spot-1',
      name: 'Mall of Travancore Parking',
      address: 'NH Bypass, Chacka, Trivandrum',
      lat: 8.4908,
      lng: 76.9246,
      pricePerHour: 50,
      priceDisplay: '₹50/hr',
      rating: 4.6,
      reviewsCount: 382,
      distance: '1.2 km away',
      host: 'Mall Management Corp',
      features: ['24 X 7 cctv', 'Security Guard', 'Free Wifi', 'Covered Roof', 'EV Charging', 'Refreshment'],
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400',
      availableSlots: 18,
      totalSlots: 60,
      operatingHours: '7:30 AM - 11:00 PM'
    },
    {
      id: 'spot-2',
      name: 'Central Metro Station Parking Plaza',
      address: 'Station Road, City Center',
      lat: 8.4985,
      lng: 76.9362,
      pricePerHour: 40,
      priceDisplay: '₹40/hr',
      rating: 4.4,
      reviewsCount: 512,
      distance: '2.5 km away',
      host: 'City Transit Authority',
      features: ['24 X 7 cctv', 'Security Guard', 'Fast Exit / Entry', 'Boom Barrier', 'Well-lit'],
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400',
      availableSlots: 7,
      totalSlots: 45,
      operatingHours: '24 Hours Open'
    },
    {
      id: 'spot-3',
      name: 'Lulu Cyber Park Basement Parking',
      address: 'Tech Corridor, IT Highway',
      lat: 8.5050,
      lng: 76.9180,
      pricePerHour: 60,
      priceDisplay: '₹60/hr',
      rating: 4.8,
      reviewsCount: 220,
      distance: '3.4 km away',
      host: 'Lulu Group Intl',
      features: ['24 X 7 cctv', 'Security Guard', 'Valet Assist', 'Free Wifi', 'Washroom', 'Refreshment'],
      image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400',
      availableSlots: 24,
      totalSlots: 100,
      operatingHours: '8:00 AM - 10:30 PM'
    },
    {
      id: 'spot-4',
      name: 'Greenpark Commercial Yard & Bays',
      address: 'Greenpark Drive, Outer Ring Road',
      lat: 8.4812,
      lng: 76.9410,
      pricePerHour: 35,
      priceDisplay: '₹35/hr',
      rating: 4.2,
      reviewsCount: 145,
      distance: '4.1 km away',
      host: 'Aaron Logistics Park',
      features: ['Wide space', 'Security Guard', 'Well-lit', 'Single-entry/exit'],
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400',
      availableSlots: 32,
      totalSlots: 80,
      operatingHours: '6:00 AM - Midnight'
    }
  ]
};
