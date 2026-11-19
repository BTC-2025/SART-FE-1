export interface RentalVehicle {
  id: string;
  name: string;
  icon: string;
  color: string;
  price: number;
  category: string;
  seats: string;
  transmission: string;
  fuel: string;
  year: number;
  kms: string;
  distance: string;
  image: string;
  badge: string;
  engine?: string;
  vehicleColor?: string;
  galleryImages?: string[];
  images?: string[];
  bookingStatus?: string;
  location?: string;
  city?: string;
  ownerName?: string;
  ownerPhone?: string;
  plate?: string;
  hourlyRate?: number;
  dailyRate?: number;
  monthlyRate?: number;
  isAvailable?: boolean;
}

export interface RentalCategoryFleet {
  title: string;
  vehicles: RentalVehicle[];
}

export interface RentalMasterCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  desc: string;
  type: 'ROAD' | 'SEA' | 'AIR' | 'RAIL';
  list: RentalVehicle[];
}

export const ROAD_RENTAL_FLEET: RentalCategoryFleet[] = [
  {
    title: 'Bikes & Two-Wheelers',
    vehicles: [
    ]
  },
  {
    title: 'Cars - 5 Seater Hatchbacks & Sedans',
    vehicles: [
    ]
  },
  {
    title: 'Cars & SUVs - 7 Seater Family MPV/SUV',
    vehicles: [
    ]
  },
  {
    title: 'Tempo Traveller - 12, 16 & 24 Seater Mini Coaches',
    vehicles: [
    ]
  }
];

export const SEA_RENTAL_FLEET: RentalCategoryFleet[] = [
  {
    title: 'Personal Watercraft & Speedboats',
    vehicles: [
    ]
  }
];

export const AIR_RENTAL_FLEET: RentalCategoryFleet[] = [
  {
    title: 'Air Charters & Choppers',
    vehicles: [
      { id: 'r-chopper', name: 'Bell 407 Light Helicopter (6 Seater)', icon: 'fa-helicopter', color: '#059669', price: 85000, category: 'Air Charter', seats: '6 Seats', transmission: 'Automatic', fuel: 'Aviation Fuel', year: 2023, kms: 'Helipad Transfer', distance: 'Helipad Bay 1', image: 'https://images.unsplash.com/photo-1506501139174-099022df5260?w=600&q=80', badge: 'Chopper' },
      { id: 'r-lightjet', name: 'Cessna Citation Private Jet (8 Seater)', icon: 'fa-plane-up', color: '#8b5cf6', price: 250000, category: 'Air Charter', seats: '8 Seats', transmission: 'Automatic', fuel: 'Jet A1', year: 2024, kms: 'Flight Route', distance: 'Terminal VIP', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80', badge: 'Private Jet' },
    ]
  }
];

export const RAIL_RENTAL_FLEET: RentalCategoryFleet[] = [
  {
    title: 'Private Rail & Saloon Cars',
    vehicles: [
      { id: 'r-saloon', name: 'IRCTC Private Luxury Saloon Coach (18 Seater)', icon: 'fa-train', color: '#8b5cf6', price: 65000, category: 'Train Charter', seats: '18 Seats', transmission: 'Automatic', fuel: 'Electric', year: 2023, kms: 'Rail Network', distance: 'Platform 1 VIP', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80', badge: 'Saloon Car' },
      { id: 'r-tourist', name: 'Exclusive Heritage Tourist Train (Full Rake)', icon: 'fa-champagne-glasses', color: '#eab308', price: 250000, category: 'Train Charter', seats: '120 Seats', transmission: 'Automatic', fuel: 'Electric', year: 2024, kms: 'National Circuit', distance: 'Central Yard', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80', badge: 'Heritage Rake' },
    ]
  }
];

export const ALL_RENTAL_VEHICLES: RentalVehicle[] = [
  ...ROAD_RENTAL_FLEET.map(c => c.vehicles).flat(),
  ...SEA_RENTAL_FLEET.map(c => c.vehicles).flat(),
  ...AIR_RENTAL_FLEET.map(c => c.vehicles).flat(),
  ...RAIL_RENTAL_FLEET.map(c => c.vehicles).flat()
];

export const RENTAL_MASTER_CATEGORIES: RentalMasterCategory[] = [
  { id: 'bike', name: 'Bike', icon: 'fa-motorcycle', color: '#f59e0b', desc: 'Activa, Classic 350, Duke, Himalayan, Pulsar', type: 'ROAD', list: ROAD_RENTAL_FLEET[0].vehicles },
  { id: 'car', name: 'Car', icon: 'fa-car', color: '#3b82f6', desc: 'Swift, i20, Dzire, Creta, Brezza, Innova', type: 'ROAD', list: [...ROAD_RENTAL_FLEET[1].vehicles, ...ROAD_RENTAL_FLEET[2].vehicles] },
  {
    id: 'auto', name: 'Auto', icon: 'fa-taxi', color: '#eab308', desc: 'Bajaj RE, Piaggio Ape, Electric Auto', type: 'ROAD', list: [
      { id: 'r-auto-cng', name: 'Bajaj Compact Auto (CNG)', icon: 'fa-taxi', color: '#eab308', price: 600, category: 'Auto', seats: '3 Seats', transmission: 'Manual', fuel: 'CNG', year: 2023, kms: '200 Kms', distance: '1.0 km', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80', badge: 'Popular' },
      { id: 'r-auto-ev', name: 'Mahindra Treo Electric Auto', icon: 'fa-bolt', color: '#10b981', price: 750, category: 'Auto', seats: '3 Seats', transmission: 'Automatic', fuel: 'Electric', year: 2024, kms: '250 Kms', distance: '1.5 km', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80', badge: 'EV Green' }
    ]
  },
  { id: 'bus', name: 'Bus', icon: 'fa-bus', color: '#10b981', desc: '12-24 Seater Mini Buses, Volvo, AC Coach', type: 'ROAD', list: ROAD_RENTAL_FLEET[3].vehicles },
  {
    id: 'truck', name: 'Truck', icon: 'fa-truck', color: '#ea580c', desc: 'Tata Ace, Ashok Leyland, Eicher 14ft', type: 'ROAD', list: [
      { id: 'r-tata-ace', name: 'Tata Ace Gold (Chota Hathi)', icon: 'fa-truck-pickup', color: '#ea580c', price: 1200, category: 'Truck', seats: '2 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2023, kms: '300 Kms', distance: '2.0 km', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80', badge: 'Payload 1 Ton' },
      { id: 'r-eicher-14', name: 'Eicher Pro 2049 (14ft Container)', icon: 'fa-truck', color: '#ef4444', price: 3500, category: 'Truck', seats: '3 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2023, kms: '400 Kms', distance: '3.5 km', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80', badge: 'Payload 3.5 Ton' }
    ]
  },
  { id: 'ship', name: 'Ship', icon: 'fa-ship', color: '#0ea5e9', desc: 'Speedboats, Cruise & Luxury Yachts', type: 'SEA', list: SEA_RENTAL_FLEET[0].vehicles },
  { id: 'helicopter', name: 'Helicopter', icon: 'fa-helicopter', color: '#8b5cf6', desc: 'Helipad transfers, Bell 407 & Choppers', type: 'AIR', list: AIR_RENTAL_FLEET[0].vehicles },
  {
    id: 'jcb', name: 'JCB', icon: 'fa-trowel-bricks', color: '#f59e0b', desc: 'JCB 3DX Backhoe Loader, Excavator & Digger', type: 'ROAD', list: [
      { id: 'r-jcb-3dx', name: 'JCB 3DX Super Backhoe Loader', icon: 'fa-trowel-bricks', color: '#f59e0b', price: 4500, category: 'JCB', seats: '1 Seat', transmission: 'Manual', fuel: 'Diesel', year: 2023, kms: 'Hourly/Daily Work', distance: 'Yard 2', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80', badge: 'Heavy Earthmover' }
    ]
  },
  {
    id: 'tractor', name: 'Tractor', icon: 'fa-tractor', color: '#16a34a', desc: 'Mahindra 575 DI, John Deere 5050 D & Trolley', type: 'ROAD', list: [
      { id: 'r-tractor-575', name: 'Mahindra 575 DI (45 HP) with Trolley', icon: 'fa-tractor', color: '#16a34a', price: 2000, category: 'Tractor', seats: '1 Seat', transmission: 'Manual', fuel: 'Diesel', year: 2023, kms: 'Agricultural/Commercial', distance: 'Farm Depot 1', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80', badge: 'Trolley Attached' }
    ]
  },
  { id: 'train', name: 'Train', icon: 'fa-train', color: '#dc2626', desc: 'Private Saloon Coach & Heritage Tourist Rake', type: 'RAIL', list: RAIL_RENTAL_FLEET[0].vehicles }
];

export const INDIAN_CITIES = ['Katpadi', 'Vellore', 'Bengaluru', 'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Erode', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Kochi', 'Mysuru', 'Goa'];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
