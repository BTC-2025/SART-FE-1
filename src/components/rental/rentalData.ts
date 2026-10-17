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
      { id: 'r-activa', name: 'Honda Activa 6G (110cc)', icon: 'fa-motorcycle', color: '#f59e0b', price: 400, category: 'Bike', seats: '2 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: '150 Kms', distance: '1.2 km', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80', badge: 'Fast Booking' },
      { id: 'r-jupiter', name: 'TVS Jupiter 125', icon: 'fa-motorcycle', color: '#3b82f6', price: 450, category: 'Bike', seats: '2 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: '150 Kms', distance: '1.8 km', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80', badge: 'Top Rated' },
      { id: 'r-classic', name: 'Royal Enfield Classic 350', icon: 'fa-motorcycle', color: '#10b981', price: 1000, category: 'Bike', seats: '2 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2024, kms: '300 Kms', distance: '2.1 km', image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600&q=80', badge: 'Cruiser' },
      { id: 'r-himalayan', name: 'Royal Enfield Himalayan 450', icon: 'fa-mountain', color: '#8b5cf6', price: 1400, category: 'Bike', seats: '2 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2024, kms: '400 Kms', distance: '3.4 km', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80', badge: 'Adventure' },
      { id: 'r-ktm', name: 'KTM Duke 390 ABS', icon: 'fa-motorcycle', color: '#ea580c', price: 1600, category: 'Bike', seats: '2 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2024, kms: '350 Kms', distance: '2.7 km', image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&q=80', badge: 'Sport' },
    ]
  },
  {
    title: 'Cars - 5 Seater Hatchbacks & Sedans',
    vehicles: [
      { id: 'r-swift', name: 'Maruti Suzuki Swift VXi Ags 2022', icon: 'fa-car', color: '#3b82f6', price: 1800, category: '5 Seater Car', seats: '5 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2022, kms: '500 Kms Included', distance: '3.13 km from Location', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80', badge: 'Only 1 left' },
      { id: 'r-i20', name: 'Hyundai i20 Sportz 2023', icon: 'fa-car', color: '#6366f1', price: 2100, category: '5 Seater Car', seats: '5 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2023, kms: '500 Kms Included', distance: '3.13 km from Location', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUWCH0raA0r-PrGJIFZKMBTP7HegtJSoCQ4N8FWQktwg&s', badge: 'Only 1 left' },
      { id: 'r-fronx', name: 'Maruti Suzuki Fronx Delta (CNG) 2025', icon: 'fa-truck-pickup', color: '#0ea5e9', price: 2400, category: '5 Seater Car', seats: '5 Seats', transmission: 'Manual', fuel: 'CNG', year: 2025, kms: '500 Kms Included', distance: '3.13 km from Location', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80', badge: 'CNG Fuel' },
      { id: 'r-verna', name: 'Hyundai Verna S+ 2022', icon: 'fa-car-rear', color: '#1e293b', price: 2800, category: '5 Seater Car', seats: '5 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2022, kms: '500 Kms Included', distance: '3.13 km from Location', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrKA4V4YbPOCWa4xUJzqe8m7dLrFWD1A8Ngvajv7sG-g&s=10', badge: 'Only 1 left' },
      { id: 'r-celerio', name: 'Maruti Suzuki Celerio VXi (Petrol)', icon: 'fa-car-side', color: '#0ea5e9', price: 1500, category: '5 Seater Car', seats: '5 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2022, kms: '300 Kms Included', distance: '1.6 km from Location', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&q=80', badge: 'Best Value' },
      { id: 'r-dzire', name: 'Maruti Suzuki Dzire Sedan', icon: 'fa-car-rear', color: '#2563eb', price: 2200, category: '5 Seater Car', seats: '5 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: '400 Kms Included', distance: '2.5 km from Location', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYUaaZuIyO0WyUXasdFxcxrhkHKVtVeG4_TNA9xBve4Q&s=10', badge: 'Popular' },
      { id: 'r-city', name: 'Honda City 5th Gen (Petrol)', icon: 'fa-car', color: '#1d4ed8', price: 3200, category: '5 Seater Car', seats: '5 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: '500 Kms Included', distance: '4.2 km from Location', image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&q=80', badge: 'Executive' },
      { id: 'r-creta', name: 'Hyundai Creta SX 1.5 (SUV)', icon: 'fa-truck-pickup', color: '#ec4899', price: 3500, category: '5 Seater Car', seats: '5 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2024, kms: '500 Kms Included', distance: '3.0 km from Location', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80', badge: 'Top Choice' },
      { id: 'r-brezza', name: 'Maruti Suzuki Brezza ZXi', icon: 'fa-truck-pickup', color: '#0284c7', price: 2900, category: '5 Seater Car', seats: '5 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: '450 Kms Included', distance: '2.8 km from Location', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80', badge: 'SUV' },
    ]
  },
  {
    title: 'Cars & SUVs - 7 Seater Family MPV/SUV',
    vehicles: [
      { id: 'r-ertiga', name: 'Maruti Suzuki Ertiga VXi (7 Seater)', icon: 'fa-van-shuttle', color: '#14b8a6', price: 3200, category: '7 Seater SUV', seats: '7 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2023, kms: '500 Kms Included', distance: '2.9 km from Location', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', badge: 'Family Favorite' },
      { id: 'r-innova-crysta', name: 'Toyota Innova Crysta 2.4 (7 Seater)', icon: 'fa-van-shuttle', color: '#eab308', price: 4800, category: '7 Seater SUV', seats: '7 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2023, kms: '600 Kms Included', distance: '3.5 km from Location', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YlXhLs_ltcwVlrliiKFT7NFR9f9USpEnCk-PwrVevQ&s=10', badge: 'Highway King' },
      { id: 'r-scorpio-n', name: 'Mahindra Scorpio-N Z8 (7 Seater)', icon: 'fa-mountain-sun', color: '#f97316', price: 4500, category: '7 Seater SUV', seats: '7 Seats', transmission: 'Automatic', fuel: 'Diesel', year: 2024, kms: '550 Kms Included', distance: '4.1 km from Location', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80', badge: 'Tough 4x4' },
      { id: 'r-xuv700', name: 'Mahindra XUV700 AX7 (7 Seater)', icon: 'fa-crown', color: '#8b5cf6', price: 5200, category: '7 Seater SUV', seats: '7 Seats', transmission: 'Automatic', fuel: 'Diesel', year: 2024, kms: '600 Kms Included', distance: '3.8 km from Location', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YlXhLs_ltcwVlrliiKFT7NFR9f9USpEnCk-PwrVevQ&s=10', badge: 'VIP Luxury' },
      { id: 'r-hycross', name: 'Toyota Innova HyCross Hybrid (7 Seater)', icon: 'fa-caravan', color: '#06b6d4', price: 5800, category: '7 Seater SUV', seats: '7 Seats', transmission: 'Automatic', fuel: 'Electric', year: 2024, kms: '700 Kms Included', distance: '5.0 km from Location', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80', badge: 'Hybrid Eco' },
    ]
  },
  {
    title: 'Tempo Traveller - 12, 16 & 24 Seater Mini Coaches',
    vehicles: [
      { id: 'r-tempo-12', name: 'Force Tempo Traveller (12 Seater Luxury)', icon: 'fa-van-shuttle', color: '#10b981', price: 6500, category: 'Tempo Traveller', seats: '12 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2023, kms: '600 Kms Included', distance: '3.2 km from Location', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', badge: '12 Seats AC' },
      { id: 'r-tempo-16', name: 'Force Tempo Traveller (16 Seater Pushback)', icon: 'fa-van-shuttle', color: '#0ea5e9', price: 8200, category: 'Tempo Traveller', seats: '16 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2023, kms: '700 Kms Included', distance: '4.0 km from Location', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', badge: '16 Seats Pushback' },
      { id: 'r-tempo-24', name: 'Force Tempo Mini Coach (24 Seater)', icon: 'fa-bus', color: '#7c3aed', price: 12000, category: 'Tempo Traveller', seats: '24 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2024, kms: '800 Kms Included', distance: '5.2 km from Location', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', badge: '24 Seats Coach' },
      { id: 'r-tempo-urbania', name: 'Force Urbania Executive (17 Seater VIP)', icon: 'fa-bus-simple', color: '#db2777', price: 14000, category: 'Tempo Traveller', seats: '17 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2024, kms: '800 Kms Included', distance: '4.8 km from Location', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', badge: 'VIP Urbania' },
    ]
  }
];

export const SEA_RENTAL_FLEET: RentalCategoryFleet[] = [
  {
    title: 'Personal Watercraft & Speedboats',
    vehicles: [
      { id: 'r-jetski', name: 'Yamaha WaveRunner Jet Ski (2 Seater)', icon: 'fa-water', color: '#0ea5e9', price: 3500, category: 'Ship / Boat', seats: '2 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: 'Unlimited Marina', distance: 'Marina Dock 4', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80', badge: 'Jet Ski' },
      { id: 'r-speedboat', name: 'Bayliner Element Speedboat (6 Seater)', icon: 'fa-sailboat', color: '#0284c7', price: 12000, category: 'Ship / Boat', seats: '6 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: 'Harbor Bound', distance: 'Pier 2B', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80', badge: 'Speedboat' },
      { id: 'r-cabin', name: 'Sea Ray Sundancer Cruiser (10 Seater)', icon: 'fa-anchor', color: '#0369a1', price: 25000, category: 'Ship / Boat', seats: '10 Seats', transmission: 'Automatic', fuel: 'Diesel', year: 2024, kms: 'Coastal Route', distance: 'Yacht Club', image: 'https://images.unsplash.com/photo-1548574505-12caf0050b5b?w=600&q=80', badge: 'Cruiser' },
      { id: 'r-yacht', name: 'Luxury Private Yacht Charter (20 Seater)', icon: 'fa-ship', color: '#eab308', price: 95000, category: 'Ship / Boat', seats: '20 Seats', transmission: 'Automatic', fuel: 'Diesel', year: 2024, kms: 'Deep Sea Charter', distance: 'Royal Port', image: 'https://images.unsplash.com/photo-1548574505-12caf0050b5b?w=600&q=80', badge: 'Ultra Luxury' },
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

export const INDIAN_CITIES = ['Bengaluru', 'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Vellore', 'Erode', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Kochi', 'Mysuru', 'Goa'];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
