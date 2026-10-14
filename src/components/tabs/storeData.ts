export interface VehicleShowcaseItem {
  id: string;
  name: string;
  brand: string;
  type: 'Car' | 'Bike' | 'EV' | 'Auto' | 'Van' | 'Lorry' | 'Bus' | 'Commercial';
  status: 'popular' | 'upcoming' | 'electric' | 'used';
  priceRange: string;
  priceRaw: number; // in Lakhs / thousands
  image: string;
  rating: number;
  fuel: string;
  mileage: string;
  seating?: string;
  launchDate?: string;
  year?: string;
  kmsDriven?: string;
  owners?: string;
  location?: string;
  features: string[];
}

export const VEHICLE_SHOWCASE_DATA: VehicleShowcaseItem[] = [
  // Two-Wheelers & Bikes in Spotlight (BikeDekho Reference)
  {
    id: 'bike-pop-1',
    name: 'Yamaha MT-15 V2',
    brand: 'Yamaha',
    type: 'Bike',
    status: 'popular',
    priceRange: '₹1.68 - 1.74 Lakh',
    priceRaw: 1.68,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    fuel: 'Petrol (155cc VVA)',
    mileage: '47.9 kmpl',
    seating: '2 Seater',
    features: ['Assist & Slipper Clutch', 'Traction Control', 'Inverted Front Forks', 'Bluetooth Y-Connect']
  },
  {
    id: 'bike-pop-2',
    name: 'KTM 390 Duke',
    brand: 'KTM',
    type: 'Bike',
    status: 'popular',
    priceRange: '₹3.11 Lakh',
    priceRaw: 3.11,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: 'Petrol (399cc LC4c)',
    mileage: '28.9 kmpl',
    seating: '2 Seater',
    features: ['Cornering ABS', 'Launch Control', '5" TFT Display', 'Quickshifter+']
  },
  {
    id: 'scooter-pop-1',
    name: 'Honda Activa 6G DLX',
    brand: 'Honda 2Wheelers',
    type: 'Bike',
    status: 'popular',
    priceRange: '₹76,684 - 82,684',
    priceRaw: 0.82,
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: 'Petrol (109.5cc PGM-FI)',
    mileage: '50 kmpl',
    seating: '2 Seater',
    features: ['Smart Key System', 'eSP Engine Tech', 'Telescopic Suspension', 'Silent ACG Starter']
  },
  {
    id: 'scooter-pop-2',
    name: 'TVS Jupiter 110 SmartXonnect',
    brand: 'TVS Motor',
    type: 'Bike',
    status: 'popular',
    priceRange: '₹73,700 - 87,250',
    priceRaw: 0.87,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
    rating: 4.75,
    fuel: 'Petrol (113cc iGO)',
    mileage: '53 kmpl',
    seating: '2 Seater',
    features: ['iGO Assist Electric Boost', 'Turn-by-Turn Navigation', 'Under-Seat 33L Storage', 'Front Fuel Fill']
  },

  // 3-Wheelers & Auto (Commercial & Passenger)
  {
    id: 'auto-pop-1',
    name: 'Bajaj RE Compact 4S CNG',
    brand: 'Bajaj Auto',
    type: 'Auto',
    status: 'popular',
    priceRange: '₹2.34 - 2.55 Lakh',
    priceRaw: 2.34,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: 'CNG / Petrol',
    mileage: '36 km/kg CNG',
    seating: '3+1 Passenger',
    features: ['DTS-i Twin Spark', 'High Resale Value', 'Low Maintenance Cost', 'Factory CNG Kit']
  },
  {
    id: 'auto-ev-1',
    name: 'Mahindra Treo Electric Auto',
    brand: 'Mahindra',
    type: 'Auto',
    status: 'electric',
    priceRange: '₹2.92 - 3.10 Lakh',
    priceRaw: 2.92,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    fuel: 'Lithium-ion EV',
    mileage: '130 km True Range',
    seating: '3+1 Passenger',
    features: ['Zero Maintenance Li-ion', 'Direct Drive Transmission', 'Digital Fleet Telematics', 'FAME Subsidy']
  },

  // Vans (Multi-Utility Passenger & Delivery)
  {
    id: 'van-pop-1',
    name: 'Maruti Suzuki Eeco 7-Seater',
    brand: 'Maruti Suzuki',
    type: 'Van',
    status: 'popular',
    priceRange: '₹5.32 - 6.58 Lakh',
    priceRaw: 5.32,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    fuel: 'Petrol / CNG',
    mileage: '20.2 kmpl / 27.05 km/kg',
    seating: '7 Seater / Cargo',
    features: ['1.2L K-Series Engine', 'Sliding Doors', 'Dual Airbags Standard', 'Commercial Taxi Yellow Plate']
  },
  {
    id: 'van-pop-2',
    name: 'Force Traveller 3350 Luxury',
    brand: 'Force Motors',
    type: 'Van',
    status: 'popular',
    priceRange: '₹14.80 - 18.20 Lakh',
    priceRaw: 14.80,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: 'Mercedes-Derived FM2.6 CR ED',
    mileage: '12.5 kmpl',
    seating: '13-17 Passenger',
    features: ['Monocoque Body Structure', 'Individual AC Vents', 'ABS with EBD', 'Reclining Luxury Seats']
  },

  // Heavy Commercial Lorries / Trucks
  {
    id: 'lorry-pop-1',
    name: 'Tata Signa 4825.TK Tipper Truck',
    brand: 'Tata Motors',
    type: 'Lorry',
    status: 'popular',
    priceRange: '₹46.50 - 52.80 Lakh',
    priceRaw: 46.50,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    rating: 4.92,
    fuel: 'Cummins ISBe 6.7L Diesel',
    mileage: '3.5 - 4.5 kmpl (Full Load)',
    seating: 'Heavy 16-Wheeler',
    features: ['250 HP Heavy Torque', 'Fleet Edge Telematics', 'Pneumatic Air Brakes', 'Heavy Axle Bogie']
  },
  {
    id: 'lorry-pop-2',
    name: 'Ashok Leyland 2820-6x2 Haulage Lorry',
    brand: 'Ashok Leyland',
    type: 'Lorry',
    status: 'popular',
    priceRange: '₹31.20 - 36.50 Lakh',
    priceRaw: 31.20,
    image: 'https://images.unsplash.com/photo-1586191582056-a607185d5656?auto=format&fit=crop&w=600&q=80',
    rating: 4.88,
    fuel: 'H-Series 6-Cyl i-Gen6 Diesel',
    mileage: '5.2 kmpl',
    seating: '10-Wheeler Haulage',
    features: ['i-Gen6 Technology', 'Unitized Wheel Bearings', 'Digital Cluster', 'Air Suspended Driver Seat']
  },

  // Commercial Passenger Buses
  {
    id: 'bus-pop-1',
    name: 'Volvo 9600 Multi-Axle Luxury Coach',
    brand: 'Volvo Buses',
    type: 'Bus',
    status: 'popular',
    priceRange: '₹1.75 - 2.10 Crore',
    priceRaw: 175.0,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    rating: 4.96,
    fuel: 'Volvo D8K 350 HP Euro-VI',
    mileage: '4.2 kmpl',
    seating: '43 Sleeper / Seater',
    features: ['Electronically Controlled Air Suspension', 'I-Shift Automatic', 'Individual USB & Entertainment', 'Hydraulic Retarder']
  },
  {
    id: 'bus-pop-2',
    name: 'Tata Starbus EV Urban City Bus',
    brand: 'Tata Motors',
    type: 'Bus',
    status: 'electric',
    priceRange: '₹1.15 - 1.45 Crore',
    priceRaw: 115.0,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: 'Electric Ultra-Fast Charge',
    mileage: '200 km Range',
    seating: '34 Low-Floor Seats',
    features: ['Zero Tailpipe Emission', 'Air Suspension with Kneeling Mechanism', 'ITS Smart Fleet System', 'CCTV & Panic Buttons']
  },

  // Used Bike & Commercial
  {
    id: 'bike-used-1',
    name: '2022 Royal Enfield Meteor 350 Fireball',
    brand: 'Royal Enfield',
    type: 'Bike',
    status: 'used',
    priceRange: '₹1.55 Lakh',
    priceRaw: 1.55,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: 'Petrol',
    mileage: '38 kmpl',
    year: '2022',
    kmsDriven: '14,800 km',
    owners: '1st Owner',
    location: 'Chennai (Guindy)',
    features: ['Tripper Nav Installed', 'Ceramic Coated', 'New Rear Tyre', 'Zero Accident']
  },
  {
    id: 'lorry-used-1',
    name: '2021 Eicher Pro 2049 Light Truck',
    brand: 'Eicher Motors',
    type: 'Lorry',
    status: 'used',
    priceRange: '₹7.80 Lakh',
    priceRaw: 7.80,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    fuel: 'Diesel',
    mileage: '11.5 kmpl',
    year: '2021',
    kmsDriven: '68,000 km',
    owners: '1st Owner',
    location: 'Chennai (Madhavaram)',
    features: ['10-ft Container Cargo', 'FC Valid Till 2026', 'Engine Overhauled', 'All 6 Tyres 80% Life']
  },

  // Popular Cars
  {
    id: 'car-pop-1',
    name: 'Tata Nexon Facelift',
    brand: 'Tata Motors',
    type: 'Car',
    status: 'popular',
    priceRange: '₹8.15 - 15.80 Lakh',
    priceRaw: 8.15,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: 'Petrol / Diesel',
    mileage: '17.44 - 24.08 kmpl',
    seating: '5 Seater',
    features: ['5-Star Bharat NCAP', '10.25" Screen', 'Ventilated Seats', '360 Camera']
  },
  {
    id: 'car-pop-2',
    name: 'Hyundai Creta 2024',
    brand: 'Hyundai',
    type: 'Car',
    status: 'popular',
    priceRange: '₹11.00 - 20.15 Lakh',
    priceRaw: 11.00,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: 'Petrol / Diesel',
    mileage: '17.4 - 21.8 kmpl',
    seating: '5 Seater',
    features: ['Level 2 ADAS', 'Panoramic Sunroof', 'Dual Zone AC', 'Bose 8-Speaker']
  },
  {
    id: 'car-pop-3',
    name: 'Mahindra Thar Roxx',
    brand: 'Mahindra',
    type: 'Car',
    status: 'popular',
    priceRange: '₹12.99 - 22.49 Lakh',
    priceRaw: 12.99,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: 'Petrol / Diesel 4x4',
    mileage: '13.5 - 15.2 kmpl',
    seating: '5 Door SUV',
    features: ['4x4 Terrain Mode', 'Panoramic Skyroof', 'Harman Kardon Audio', 'Level 2 ADAS']
  },
  {
    id: 'car-pop-4',
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    type: 'Bike',
    status: 'popular',
    priceRange: '₹1.93 - 2.30 Lakh',
    priceRaw: 1.93,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: 'Petrol',
    mileage: '37.77 kmpl',
    features: ['J-Series 349cc Engine', 'Dual Channel ABS', 'Tripper Navigation', 'LED Headlamp']
  },

  // Electric Vehicles (EV)
  {
    id: 'car-ev-1',
    name: 'Tata Curvv EV',
    brand: 'Tata Motors',
    type: 'EV',
    status: 'electric',
    priceRange: '₹17.49 - 21.99 Lakh',
    priceRaw: 17.49,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: 'Electric (55 kWh)',
    mileage: '585 km Range',
    seating: 'Coupe SUV',
    features: ['150 km in 15 Min Fast Charge', 'V2L & V2V Tech', 'Paddle Shifter Regen', '12.3" Screen']
  },
  {
    id: 'car-ev-2',
    name: 'Mahindra XUV400 Pro EV',
    brand: 'Mahindra',
    type: 'EV',
    status: 'electric',
    priceRange: '₹15.49 - 19.39 Lakh',
    priceRaw: 15.49,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    fuel: 'Electric (39.4 kWh)',
    mileage: '456 km Range',
    seating: '5 Seater SUV',
    features: ['0-100 km/h in 8.3s', 'IP67 Battery Pack', 'Wireless Android Auto', 'All 4 Disc Brakes']
  },
  {
    id: 'car-ev-3',
    name: 'Ather 450X Gen 3',
    brand: 'Ather Energy',
    type: 'EV',
    status: 'electric',
    priceRange: '₹1.44 - 1.57 Lakh',
    priceRaw: 1.44,
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: 'Electric (3.7 kWh)',
    mileage: '150 km IDC Range',
    features: ['Google Maps Onboard', 'Warp Mode 0-40 in 3.3s', 'AutoHold', 'Ather Grid Access']
  },
  {
    id: 'car-ev-4',
    name: 'Ola S1 Pro Gen 2',
    brand: 'Ola Electric',
    type: 'EV',
    status: 'electric',
    priceRange: '₹1.34 - 1.40 Lakh',
    priceRaw: 1.34,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    fuel: 'Electric (4.0 kWh)',
    mileage: '195 km Certified',
    features: ['120 km/h Top Speed', 'Party Mode Audio', 'MoveOS 4 Smart UI', 'Cruise Control']
  },

  // Upcoming Cars
  {
    id: 'car-up-1',
    name: 'Maruti Suzuki eVX (EV)',
    brand: 'Maruti Suzuki',
    type: 'EV',
    status: 'upcoming',
    priceRange: '₹20.00 - 25.00 Lakh (Expected)',
    priceRaw: 20.0,
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: '60 kWh Electric',
    mileage: '550 km Est. Range',
    launchDate: 'Expected Early 2025',
    features: ['Dedicated EV Platform', 'AWD Option', 'Next-Gen Cockpit', 'Fast DC Charging']
  },
  {
    id: 'car-up-2',
    name: 'Skoda Kylaq Sub-Compact SUV',
    brand: 'Skoda',
    type: 'Car',
    status: 'upcoming',
    priceRange: '₹7.89 - 13.50 Lakh (Expected)',
    priceRaw: 7.89,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: '1.0L TSI Turbo Petrol',
    mileage: '19.8 kmpl Est.',
    launchDate: 'Expected Jan 2025',
    features: ['MQB-A0-IN Architecture', '6 Airbags Standard', 'German Safety Dynamics', '10" Infotainment']
  },

  // Certified Used Cars
  {
    id: 'car-used-1',
    name: '2021 Hyundai Venue SX (O) Turbo',
    brand: 'Hyundai',
    type: 'Car',
    status: 'used',
    priceRange: '₹8.45 Lakh',
    priceRaw: 8.45,
    image: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: 'Petrol • Manual',
    mileage: '18.2 kmpl',
    year: '2021',
    kmsDriven: '34,200 km',
    owners: '1st Owner',
    location: 'Chennai (T. Nagar)',
    features: ['200-Point Inspected', '1 Year Free Warranty', 'Sunroof & Wireless Charging', 'Non-Accidental']
  },
  {
    id: 'car-used-2',
    name: '2020 Maruti Suzuki Swift ZXi AMT',
    brand: 'Maruti Suzuki',
    type: 'Car',
    status: 'used',
    priceRange: '₹6.20 Lakh',
    priceRaw: 6.20,
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    fuel: 'Petrol • Automatic',
    mileage: '23.2 kmpl',
    year: '2020',
    kmsDriven: '41,500 km',
    owners: '1st Owner',
    location: 'Chennai (Anna Nagar)',
    features: ['Full Service History', 'Zero Challan Verified', '7-Day Return Guarantee', 'Engine Inspected']
  },
  {
    id: 'car-used-3',
    name: '2022 Tata Punch Creative Kaziranga',
    brand: 'Tata Motors',
    type: 'Car',
    status: 'used',
    priceRange: '₹7.60 Lakh',
    priceRaw: 7.60,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: 'Petrol • Manual',
    mileage: '19.8 kmpl',
    year: '2022',
    kmsDriven: '22,100 km',
    owners: '1st Owner',
    location: 'Chennai (Velachery)',
    features: ['5-Star GNCAP Safety', 'Touchscreen with Harman', 'Alloy Wheels', 'Ready for Delivery']
  }
];

export interface ComparisonVehicle {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  engine: string;
  power: string;
  mileage: string;
  safety: string;
  airbags: string;
  seating: string;
  warranty: string;
}

export const COMPARISON_VEHICLES: ComparisonVehicle[] = [
  {
    id: 'comp-nexon',
    name: 'Tata Nexon Facelift',
    brand: 'Tata Motors',
    price: '₹8.15 - 15.80 Lakh',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    engine: '1.2L Turbo Petrol / 1.5L Diesel',
    power: '120 PS / 170 Nm',
    mileage: '17.44 - 24.08 kmpl',
    safety: '5 Stars (Bharat NCAP)',
    airbags: '6 Airbags (Standard)',
    seating: '5 Seater SUV',
    warranty: '3 Years / 1,00,000 km'
  },
  {
    id: 'comp-creta',
    name: 'Hyundai Creta 2024',
    brand: 'Hyundai',
    price: '₹11.00 - 20.15 Lakh',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    engine: '1.5L MPi / 1.5L Turbo / 1.5L Diesel',
    power: '160 PS / 253 Nm (Turbo)',
    mileage: '17.4 - 21.8 kmpl',
    safety: 'Level 2 ADAS + 70+ Safety Features',
    airbags: '6 Airbags (Standard)',
    seating: '5 Seater SUV',
    warranty: '3 Years / Unlimited km'
  },
  {
    id: 'comp-curvv',
    name: 'Tata Curvv EV',
    brand: 'Tata Motors',
    price: '₹17.49 - 21.99 Lakh',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    engine: 'Permanent Magnet Synchronous Motor',
    power: '167 PS / 215 Nm',
    mileage: '585 km (Certified Range)',
    safety: '5 Stars (Bharat NCAP Expected)',
    airbags: '6 Airbags + Level 2 ADAS',
    seating: '5 Seater Coupe SUV',
    warranty: '8 Years / 1,60,000 km (Battery)'
  },
  {
    id: 'comp-thar',
    name: 'Mahindra Thar Roxx',
    brand: 'Mahindra',
    price: '₹12.99 - 22.49 Lakh',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    engine: '2.0L mStallion Turbo / 2.2L mHawk',
    power: '177 PS / 380 Nm',
    mileage: '13.5 - 15.2 kmpl',
    safety: '5 Stars (Bharat NCAP 2024)',
    airbags: '6 Airbags + ESC Standard',
    seating: '5 Door Off-Roader',
    warranty: '3 Years / 1,00,000 km'
  },
  {
    id: 'comp-seltos',
    name: 'Kia Seltos Facelift',
    brand: 'Kia',
    price: '₹10.90 - 20.35 Lakh',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    engine: '1.5L Smartstream / 1.5L Turbo GDi',
    power: '160 PS / 253 Nm (Turbo)',
    mileage: '17.0 - 20.7 kmpl',
    safety: 'Level 2 ADAS (17 autonomous features)',
    airbags: '6 Airbags (Standard all variants)',
    seating: '5 Seater SUV',
    warranty: '3 Years / Unlimited km'
  },
  {
    id: 'comp-classic',
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    price: '₹1.93 - 2.25 Lakh',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    engine: '349cc Single Cylinder J-Series',
    power: '20.2 PS / 27 Nm',
    mileage: '36.2 kmpl',
    safety: 'Dual Channel ABS Standard',
    airbags: 'Tubular Steel Frame + ABS',
    seating: '2 Seater Cruiser',
    warranty: '3 Years / 30,000 km'
  },
  {
    id: 'comp-hunter',
    name: 'Royal Enfield Hunter 350',
    brand: 'Royal Enfield',
    price: '₹1.49 - 1.74 Lakh',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    engine: '349cc Air-Oil Cooled J-Series',
    power: '20.2 PS / 27 Nm',
    mileage: '36.9 kmpl',
    safety: 'Dual Channel ABS + 300mm Disc',
    airbags: 'Compact Roadsteer Chassis',
    seating: '2 Seater Roadster',
    warranty: '3 Years / 30,000 km'
  },
  {
    id: 'comp-signa',
    name: 'Tata Signa 2823 Tipper Truck',
    brand: 'Tata Motors Commercial',
    price: '₹37.50 - 41.20 Lakh',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    engine: 'Cummins ISBe 5.6L BS6 Turbodiesel',
    power: '230 HP / 850 Nm',
    mileage: '4.5 - 5.5 km/l (Loaded)',
    safety: 'Signa High-Strength Crash Crash Tested Cabin',
    airbags: 'Driver Seatbelt + Air Brake System',
    seating: 'Driver + Co-Driver Sleeper Cabin',
    warranty: '6 Years / 6,00,000 km Driveline'
  },
  {
    id: 'comp-ashok',
    name: 'Ashok Leyland 1920 Multi-Axle Haulage',
    brand: 'Ashok Leyland',
    price: '₹28.40 - 32.80 Lakh',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    engine: 'H-Series 4-Cylinder i-Gen6 Diesel',
    power: '200 HP / 700 Nm',
    mileage: '5.2 - 6.2 km/l',
    safety: 'Full Air Dual Line Brakes with ABS',
    airbags: 'Heavy Rollover Protected Cowl',
    seating: 'Driver + Sleeper Berth',
    warranty: '4 Years / 4,00,000 km'
  }
];

export interface FuelPriceItem {
  city: string;
  petrol: number;
  diesel: number;
  cng: number;
  updated: string;
}

export const LIVE_FUEL_PRICES: FuelPriceItem[] = [
  { city: 'Chennai', petrol: 100.75, diesel: 92.34, cng: 85.50, updated: 'Today 06:00 AM' },
  { city: 'Coimbatore', petrol: 101.20, diesel: 92.80, cng: 86.10, updated: 'Today 06:00 AM' },
  { city: 'Madurai', petrol: 101.45, diesel: 93.05, cng: 86.40, updated: 'Today 06:00 AM' },
  { city: 'Bangalore', petrol: 102.86, diesel: 88.94, cng: 82.00, updated: 'Today 06:00 AM' },
  { city: 'Hyderabad', petrol: 107.41, diesel: 95.65, cng: 89.20, updated: 'Today 06:00 AM' },
];

export interface EvChargingStation {
  id: string;
  name: string;
  operator: string;
  distance: string;
  address: string;
  plugsAvailable: string;
  chargingSpeed: string;
  pricing: string;
  rating: number;
  openNow: boolean;
  types: string[];
}

export const EV_CHARGING_STATIONS: EvChargingStation[] = [
  {
    id: 'ev-st-1',
    name: 'Tata Power EZ Charge - Phoenix Marketcity',
    operator: 'Tata Power',
    distance: '1.2 km',
    address: 'Velachery Main Rd, Indira Gandhi Nagar, Chennai',
    plugsAvailable: '4 of 6 Free',
    chargingSpeed: '60 kW DC Fast',
    pricing: '₹18 / kWh',
    rating: 4.8,
    openNow: true,
    types: ['CCS2', 'Type 2 AC', 'Bharat DC001']
  },
  {
    id: 'ev-st-2',
    name: 'Jio-bp pulse EV Hub - Guindy Industrial Estate',
    operator: 'Jio-bp pulse',
    distance: '2.8 km',
    address: 'CIPET Road, Guindy, Chennai',
    plugsAvailable: '2 of 4 Free',
    chargingSpeed: '120 kW Ultra-Fast',
    pricing: '₹19.5 / kWh',
    rating: 4.9,
    openNow: true,
    types: ['Dual Gun CCS2', 'CHAdeMO']
  },
  {
    id: 'ev-st-3',
    name: 'Statiq Fast Charger - Grand Square Mall',
    operator: 'Statiq',
    distance: '3.5 km',
    address: 'Tambaram Main Rd, Velachery, Chennai',
    plugsAvailable: '3 of 4 Free',
    chargingSpeed: '30 kW DC Fast',
    pricing: '₹16 / kWh',
    rating: 4.7,
    openNow: true,
    types: ['CCS2', 'Type 2 AC']
  },
  {
    id: 'ev-st-4',
    name: 'Ather Grid - OMR IT Corridor',
    operator: 'Ather Grid',
    distance: '4.1 km',
    address: 'Sholinganallur Junction, OMR, Chennai',
    plugsAvailable: '1 of 2 Free',
    chargingSpeed: 'Fast 2-Wheeler',
    pricing: 'Free for Ather / ₹15/hr others',
    rating: 4.9,
    openNow: true,
    types: ['Ather Proprietary', 'Universal AC 15A']
  }
];

export interface InsuranceQuote {
  id: string;
  provider: string;
  planName: string;
  pricePerYear: number;
  cashlessGarages: number;
  claimsRatio: string;
  badge?: string;
  features: string[];
}

export const INSURANCE_QUOTES: InsuranceQuote[] = [
  {
    id: 'ins-1',
    provider: 'HDFC ERGO',
    planName: 'Comprehensive + Zero Depreciation',
    pricePerYear: 6499,
    cashlessGarages: 8500,
    claimsRatio: '98.6%',
    badge: 'MOST POPULAR',
    features: ['Zero Dep Cover', 'Engine & Gearbox Protection', 'Roadside Assistance 24/7', 'Consumables Included']
  },
  {
    id: 'ins-2',
    provider: 'ICICI Lombard',
    planName: 'Complete Motor Protection',
    pricePerYear: 5890,
    cashlessGarages: 9200,
    claimsRatio: '97.9%',
    badge: 'FASTEST PAYOUT',
    features: ['Instant Digital Survey', 'Return to Invoice', 'Key & Lock Replacement', 'Emergency Hotel/Cab']
  },
  {
    id: 'ins-3',
    provider: 'Tata AIG',
    planName: 'AutoSecure Premium',
    pricePerYear: 6150,
    cashlessGarages: 7800,
    claimsRatio: '98.2%',
    features: ['Tyre & Rim Safeguard', 'Personal Accident 15 Lakh', 'No Claim Bonus Protection', 'Doorstep Repair Pickup']
  }
];

export interface LocationFuelEvStation {
  id: string;
  name: string;
  brand: string;
  city: string;
  address: string;
  status: string; // e.g. "Open now • 06:00 AM - 10:00 PM"
  phone: string;
  fuels: string[];
  type: 'fuel' | 'ev' | 'both';
  distance: string;
  rating: number;
}

export const LOCATION_BASED_STATIONS: LocationFuelEvStation[] = [
  // Delhi-NCR Stations (Reference to User Image 2)
  {
    id: 'loc-1',
    name: 'Iocl - Shivalik Service Centre',
    brand: 'Indian Oil (IOCL)',
    city: 'New Delhi',
    address: 'Dwarka Sector-2 Phase-I Lock Id No. 1554, Service Road Road No 201 Palam Najafgarh Road, 110075, New Delhi',
    status: 'Open now • 06:00 AM - 10:00 PM',
    phone: '9873100006',
    fuels: ['Petrol', 'Diesel'],
    type: 'fuel',
    distance: '1.1 km',
    rating: 4.6
  },
  {
    id: 'loc-2',
    name: 'Iocl - Shivesh Service Station',
    brand: 'Indian Oil (IOCL)',
    city: 'New Delhi',
    address: 'Outer Ring Road, Soami Nagar Swami Nagar Lock Id No. 1362, Service Road Bhakti Vedant Swami Marg Ha Chi Minh Marg, 110017, New Delhi',
    status: 'Open now • 06:00 AM - 10:00 PM',
    phone: '7042202193',
    fuels: ['Petrol', 'Diesel'],
    type: 'fuel',
    distance: '2.4 km',
    rating: 4.5
  },
  {
    id: 'loc-3',
    name: 'Iocl - Speedways Service Centre',
    brand: 'Indian Oil (IOCL)',
    city: 'New Delhi',
    address: 'Jail Road near Hari Nagar Depot Lock No 363 (Issue Seals), Jail Road Shaheed Bhagat Singh Marg, 110058, New Delhi',
    status: 'Open now • 06:00 AM - 10:00 PM',
    phone: '9810540137',
    fuels: ['Petrol', 'Diesel'],
    type: 'fuel',
    distance: '3.2 km',
    rating: 4.4
  },
  {
    id: 'loc-4',
    name: 'Iocl - Sushanti Filling Station',
    brand: 'Indian Oil (IOCL)',
    city: 'New Delhi',
    address: 'Sector - 6 Phase I Dwarka Lock Id No. 707, Jail Road Dwarka Road Old Palam Dwarka Road, 110075, New Delhi',
    status: 'Open now • 06:00 AM - 10:00 PM',
    phone: '9654902456',
    fuels: ['Petrol', 'Diesel', 'CNG'],
    type: 'fuel',
    distance: '1.8 km',
    rating: 4.7
  },
  {
    id: 'loc-5',
    name: 'Iocl - Tuli Motors',
    brand: 'Indian Oil (IOCL)',
    city: 'New Delhi',
    address: 'Raja Garden Ring Road For Premium Lock No 988 Bijwasan Lock Code - I - 390, Service Road Mahatma Gandhi Marg, 110027, New Delhi',
    status: 'Open now • 06:00 AM - 10:00 PM',
    phone: '9811452309',
    fuels: ['Petrol', 'Diesel'],
    type: 'fuel',
    distance: '4.1 km',
    rating: 4.6
  },
  {
    id: 'loc-6',
    name: 'Iocl - Vaish Filling Station',
    brand: 'Indian Oil (IOCL)',
    city: 'New Delhi',
    address: 'Nangloi Rd Najafgarh Lock Id No I 563, Najafgarh Nangloi Road Nangloi Road, 110043, New Delhi',
    status: 'Open now • 06:00 AM - 10:00 PM',
    phone: '9844047707',
    fuels: ['Petrol', 'Diesel'],
    type: 'fuel',
    distance: '2.9 km',
    rating: 4.3
  },

  // Chennai Stations
  {
    id: 'loc-chn-1',
    name: 'BPCL Auto Fuel & CNG Hub - Anna Salai',
    brand: 'Bharat Petroleum (BPCL)',
    city: 'Chennai',
    address: 'No. 482 Anna Salai, Near Gemini Flyover, T. Nagar, 600006, Chennai',
    status: 'Open 24 Hours • All Days',
    phone: '044 2434 5511',
    fuels: ['Petrol', 'Diesel', 'CNG'],
    type: 'fuel',
    distance: '1.2 km',
    rating: 4.8
  },
  {
    id: 'loc-chn-2',
    name: 'Tata Power EZ EV Fast Charging Station',
    brand: 'Tata Power EV',
    city: 'Chennai',
    address: 'Phoenix MarketCity Basement Level 2, 142 Velachery Road, 600042, Chennai',
    status: 'Open now • 24x7 Fast Charging',
    phone: '1800 209 5161',
    fuels: ['60kW DC Dual Gun (CCS2)', '22kW AC Type 2'],
    type: 'ev',
    distance: '2.5 km',
    rating: 4.9
  },
  {
    id: 'loc-chn-3',
    name: 'HPCL Auto Care Centre - Guindy Industrial Estate',
    brand: 'Hindustan Petroleum (HPCL)',
    city: 'Chennai',
    address: 'Jawaharlal Nehru Road, Guindy Flyover Junction, 600032, Chennai',
    status: 'Open now • 05:30 AM - 11:30 PM',
    phone: '044 2235 1290',
    fuels: ['Petrol', 'Diesel', 'Auto LPG'],
    type: 'fuel',
    distance: '0.8 km',
    rating: 4.6
  },
  {
    id: 'loc-chn-4',
    name: 'Jio-bp pulse EV Mobility Station',
    brand: 'Jio-bp pulse',
    city: 'Chennai',
    address: 'NH-45 GST Road, Near Airport Cargo Hub, Meenambakkam, 600027, Chennai',
    status: 'Open 24 Hours • Fast Fuel & EV',
    phone: '1800 891 9023',
    fuels: ['Petrol', 'Diesel', '120kW DC Ultra Fast EV'],
    type: 'both',
    distance: '3.6 km',
    rating: 4.8
  },
  {
    id: 'loc-chn-5',
    name: 'IOCL Swagat Highway Station - Tambaram Bypass',
    brand: 'Indian Oil (IOCL)',
    city: 'Chennai',
    address: 'Tambaram Bypass Highway Km 14, Near Irumbuliyur Junction, 600045, Chennai',
    status: 'Open 24 Hours • Highway Oasis',
    phone: '044 2226 7788',
    fuels: ['Petrol', 'Diesel', 'CNG', 'Heavy Truck DEF AdBlue'],
    type: 'fuel',
    distance: '4.8 km',
    rating: 4.7
  },
  {
    id: 'loc-chn-6',
    name: 'Ather Grid Fast Charger - OMR Sholinganallur',
    brand: 'Ather Energy',
    city: 'Chennai',
    address: 'OMR Rajiv Gandhi Salai, Near Classic Foods Court, 600119, Chennai',
    status: 'Open now • 24x7 2-Wheeler Charging',
    phone: '080 6646 5757',
    fuels: ['Ather Dot Fast Charging', 'Universal 15A AC'],
    type: 'ev',
    distance: '5.2 km',
    rating: 4.9
  },

  // Bangalore Stations
  {
    id: 'loc-blr-1',
    name: 'Shell Petrol Station - Whitefield Main Road',
    brand: 'Shell India',
    city: 'Bangalore',
    address: 'ITPL Main Road, Near Hope Farm Junction, Whitefield, 560066, Bangalore',
    status: 'Open 24 Hours • Shell V-Power',
    phone: '080 4123 9081',
    fuels: ['Petrol (V-Power)', 'Diesel', 'Shell Deli2go'],
    type: 'fuel',
    distance: '1.4 km',
    rating: 4.9
  },
  {
    id: 'loc-blr-2',
    name: 'Statiq EV Fast Charging Superhub - Indiranagar',
    brand: 'Statiq EV',
    city: 'Bangalore',
    address: '100 Feet Road, 12th Main Junction, HAL 2nd Stage, Indiranagar, 560038, Bangalore',
    status: 'Open now • 24x7 Multi-Vehicle Hub',
    phone: '011 4118 7800',
    fuels: ['150kW DC Dual Gun (CCS2)', '60kW DC (GB/T)'],
    type: 'ev',
    distance: '2.1 km',
    rating: 4.8
  }
];
