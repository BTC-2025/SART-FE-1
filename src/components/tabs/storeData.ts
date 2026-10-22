export interface VehicleShowcaseItem {
  id: string;
  name: string;
  brand: string;
  type: 'Car' | 'Bike' | 'EV' | 'Auto' | 'Van' | 'Lorry' | 'Bus' | 'Tractor' | 'Commercial' | 'Emergency' | 'Construction';
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
  badgeTag?: string;
  transmission?: string;
  model?: string;
  bodyType?: string;
  sellerType?: 'Individual' | 'Dealer' | 'Certified' | 'Premium Seller';
  rto?: string;
  seats?: number;
  discount?: string;
  color?: string;
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

  // CarBike360 New Cars (User Image 1 Reference)
  {
    id: 'cb-new-1',
    name: 'Rolls-Royce Ghost',
    brand: 'Rolls-Royce',
    type: 'Car',
    status: 'popular',
    badgeTag: 'Petrol',
    priceRange: '₹6.95 - 7.95 Crore',
    priceRaw: 695.0,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    rating: 4.96,
    fuel: 'Petrol (6.75L Twin-Turbo V12)',
    transmission: '8-Speed Satellite Aided Auto',
    mileage: '6.33 kmpl',
    seating: '5 Seater Ultra-Luxury Saloon',
    features: ['Effortless Doors', 'Starlight Headliner with Shooting Stars', 'Illuminated Grille', 'Planar Suspension System']
  },
  {
    id: 'cb-new-2',
    name: 'Mahindra Scorpio Classic',
    brand: 'Mahindra',
    type: 'Car',
    status: 'popular',
    badgeTag: 'Diesel',
    priceRange: '₹13.62 - 17.42 Lakh',
    priceRaw: 13.62,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    rating: 4.82,
    fuel: 'Diesel (2.2L Gen-2 mHawk)',
    transmission: '6-Speed Manual',
    mileage: '15.0 kmpl',
    seating: '7 / 9 Seater Rugged SUV',
    features: ['mHawk 132 PS Diesel', 'Cable Shift Gearbox', '9" Android Touchscreen', 'Signature Scorpio Grille']
  },
  {
    id: 'cb-new-3',
    name: 'Maruti Suzuki Baleno',
    brand: 'Maruti Suzuki',
    type: 'Car',
    status: 'popular',
    badgeTag: 'Petrol',
    priceRange: '₹6.66 - 9.88 Lakh',
    priceRaw: 6.66,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rating: 4.78,
    fuel: 'Petrol / CNG (1.2L DualJet)',
    transmission: '5-Speed Manual • AGS AMT',
    mileage: '22.35 - 30.61 km/kg',
    seating: '5 Seater Premium Hatchback',
    features: ['Head-Up Display', '360 View HD Camera', '9" SmartPlay Pro+ Audio', '6 Airbags Standard']
  },
  {
    id: 'cb-new-4',
    name: 'Maruti Suzuki Brezza',
    brand: 'Maruti Suzuki',
    type: 'Car',
    status: 'popular',
    badgeTag: 'Petrol',
    priceRange: '₹8.34 - 14.14 Lakh',
    priceRaw: 8.34,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: 'Petrol / CNG (1.5L K15C)',
    transmission: 'Manual • 6-Speed AT with Paddle Shifters',
    mileage: '19.8 - 25.51 km/kg',
    seating: '5 Seater Compact SUV',
    features: ['Electric Sunroof', 'Wireless Charging', 'Arkamy Surround Sound', 'HUD Display']
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
  // CarBike360 Latest Cars in India (User Image 2 Reference)
  {
    id: 'cb-latest-1',
    name: 'Toyota Glanza',
    brand: 'Toyota',
    type: 'Car',
    status: 'popular',
    badgeTag: 'Petrol',
    priceRange: '₹6.80 - 10.00 Lakh',
    priceRaw: 6.80,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: 'Petrol',
    transmission: 'Manual • AMT',
    mileage: '22.35 - 22.94 kmpl',
    seating: '5 Seater Hatchback',
    features: ['Head-up Display', '360 View Camera', '9" Smart Playcast Audio', '6 Airbags']
  },
  {
    id: 'cb-latest-2',
    name: 'Volvo EX30',
    brand: 'Volvo',
    type: 'EV',
    status: 'popular',
    badgeTag: 'Electric',
    priceRange: '₹41.20 Lakh',
    priceRaw: 41.20,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: 'Electric (69 kWh)',
    transmission: 'Automatic',
    mileage: '475 km Range',
    seating: '5 Seater Compact SUV',
    features: ['0-100 in 3.6s', 'Harman Kardon Soundbar', 'Pilot Assist 3.0', '10-80% Fast Charge 26 min']
  },
  {
    id: 'cb-latest-3',
    name: 'Honda Elevate',
    brand: 'Honda',
    type: 'Car',
    status: 'popular',
    badgeTag: 'Petrol',
    priceRange: '₹11.60 - 16.40 Lakh',
    priceRaw: 11.60,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    fuel: 'Petrol (1.5L i-VTEC)',
    transmission: '6-Speed MT • 7-Speed CVT',
    mileage: '15.31 - 16.92 kmpl',
    seating: '5 Seater Mid-Size SUV',
    features: ['Honda Sensing ADAS', '220mm Ground Clearance', '10.25" Touchscreen', 'LaneWatch Camera']
  },
  {
    id: 'cb-latest-4',
    name: 'Skoda Slavia',
    brand: 'Skoda',
    type: 'Car',
    status: 'popular',
    badgeTag: 'Petrol',
    priceRange: '₹10.69 - 18.69 Lakh',
    priceRaw: 10.69,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: 'Petrol (1.0L / 1.5L TSI)',
    transmission: 'Manual • Torque Converter • DSG',
    mileage: '18.73 - 19.47 kmpl',
    seating: '5 Seater Sedan',
    features: ['5-Star Global NCAP', '521L Boot Space', 'Electric Sunroof', 'Ventilated Front Seats']
  },
  {
    id: 'cb-latest-5',
    name: 'Mercedes-Maybach S-Class',
    brand: 'Mercedes-Benz',
    type: 'Car',
    status: 'popular',
    badgeTag: 'Luxury',
    priceRange: '₹2.35 - 3.40 Crore',
    priceRaw: 235.0,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    rating: 4.95,
    fuel: 'Petrol (4.0L V8 Biturbo)',
    transmission: '9G-TRONIC Automatic',
    mileage: '9.8 kmpl',
    seating: '4 Seater Executive Limousine',
    features: ['First-Class Rear Compartment', 'Burmester High-End 4D Sound', 'E-ACTIVE Body Control', 'Rear Seat Massage']
  },
  {
    id: 'cb-latest-6',
    name: 'Porsche Macan Electric',
    brand: 'Porsche',
    type: 'EV',
    status: 'popular',
    badgeTag: 'Electric',
    priceRange: '₹1.22 - 2.05 Crore',
    priceRaw: 122.0,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    rating: 4.92,
    fuel: 'Electric (100 kWh)',
    transmission: 'Single-Speed Automatic AWD',
    mileage: '613 km WLTP Range',
    seating: '5 Seater Performance SUV',
    features: ['639 PS Launch Control', '270 kW DC Fast Charging', 'Porsche Active Suspension (PASM)', 'Rear-Axle Steering']
  },
  {
    id: 'cb-latest-7',
    name: 'Tata Altroz Racer',
    brand: 'Tata Motors',
    type: 'Car',
    status: 'popular',
    badgeTag: 'Petrol',
    priceRange: '₹9.49 - 10.99 Lakh',
    priceRaw: 9.49,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rating: 4.75,
    fuel: 'Petrol (1.2L Turbo 120 PS)',
    transmission: '6-Speed Manual',
    mileage: '18.0 kmpl',
    seating: '5 Seater Hot Hatch',
    features: ['Race-Tuned Dual Exhaust', 'Ventilated Front Seats', '10.25" Harman Infotainment', '360 HD Camera']
  },
  {
    id: 'cb-latest-8',
    name: 'BMW i7 eDrive50',
    brand: 'BMW',
    type: 'EV',
    status: 'popular',
    badgeTag: 'Electric',
    priceRange: '₹2.03 - 2.50 Crore',
    priceRaw: 203.0,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: 'Electric (101.7 kWh)',
    transmission: 'Automatic',
    mileage: '625 km WLTP Range',
    seating: '5 Seater Luxury Sedan',
    features: ['31.3" 8K BMW Theatre Screen', 'Executive Lounge Seating', 'BMW Interaction Bar', 'Crystal Headlights']
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

  // Upcoming Cars (CarBike360 Images 3 & 4 Reference)
  {
    id: 'cb-up-1',
    name: '2026 Toyota Fortuner',
    brand: 'Toyota',
    type: 'Car',
    status: 'upcoming',
    badgeTag: 'Upcoming',
    priceRange: '₹35.00 - 45.00 Lakh (Expected)',
    priceRaw: 35.0,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: '2.8L Turbo Diesel + 48V Mild Hybrid',
    transmission: '6-Speed Automatic 4x4',
    mileage: '14.2 kmpl Est.',
    seating: '7 Seater SUV',
    launchDate: 'Expected Dec 2025',
    features: ['TNGA-F Global Platform', '48V Mild Hybrid Powertrain', 'Level 2 ADAS Suite', 'Electronic Locking Differentials']
  },
  {
    id: 'cb-up-2',
    name: 'Audi Q3 2026',
    brand: 'Audi',
    type: 'Car',
    status: 'upcoming',
    badgeTag: 'Upcoming',
    priceRange: '₹46.00 - 52.00 Lakh (Expected)',
    priceRaw: 46.0,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    fuel: '2.0L TFSI Turbo Petrol Quattro',
    transmission: '7-Speed S-Tronic',
    mileage: '15.5 kmpl Est.',
    seating: '5 Seater Luxury SUV',
    launchDate: 'Expected Nov 2025',
    features: ['Matrix LED Headlights', 'Audi Virtual Cockpit Plus', 'Bang & Olufsen 3D Sound', 'Quattro AWD']
  },
  {
    id: 'cb-up-3',
    name: 'Audi A6 E-Tron',
    brand: 'Audi',
    type: 'EV',
    status: 'upcoming',
    badgeTag: 'Electric',
    priceRange: '₹78.00 Lakh (Expected)',
    priceRaw: 78.0,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: '100 kWh Electric PPE Platform',
    transmission: 'Automatic Quattro',
    mileage: '700 km Est. Range',
    seating: '5 Seater Executive Sportback',
    launchDate: 'Expected Jan 2026',
    features: ['800-Volt Architecture', '270 kW DC Fast Charging', 'Digital Matrix LED with Projectors', 'Virtual Exterior Mirrors']
  },
  {
    id: 'cb-up-4',
    name: 'Volkswagen Tayron (7-Seater Tiguan)',
    brand: 'Volkswagen',
    type: 'Car',
    status: 'upcoming',
    badgeTag: 'Upcoming',
    priceRange: '₹35.00 - 40.00 Lakh (Expected)',
    priceRaw: 35.0,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: '2.0L TSI Turbo Petrol 4MOTION',
    transmission: '7-Speed DSG',
    mileage: '15.8 kmpl Est.',
    seating: '7 Seater Premium SUV',
    launchDate: 'Expected Dec 2025',
    features: ['MQB EVO Platform', '15" OLED Display', 'DCC Pro Adaptive Chassis', 'Travel Assist ADAS']
  },
  {
    id: 'cb-up-5',
    name: 'Audi Q5 2026',
    brand: 'Audi',
    type: 'Car',
    status: 'upcoming',
    badgeTag: 'Upcoming',
    priceRange: '₹70.00 Lakh (Expected)',
    priceRaw: 70.0,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    rating: 4.88,
    fuel: '2.0L MHEV Plus Petrol Quattro',
    transmission: '7-Speed S-Tronic',
    mileage: '14.5 kmpl Est.',
    seating: '5 Seater Luxury SUV',
    launchDate: 'Expected Nov 2025',
    features: ['PPC Premium Combustion Architecture', 'Active Digital OLED Taillights', 'MMI Panoramic Display', 'Air Suspension']
  },
  {
    id: 'cb-up-6',
    name: 'Land Rover Range Rover Sport Electric',
    brand: 'Land Rover',
    type: 'EV',
    status: 'upcoming',
    badgeTag: 'Electric',
    priceRange: 'Price Coming Soon',
    priceRaw: 150.0,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    rating: 4.95,
    fuel: '800V Dedicated Electric Powertrain',
    transmission: 'All-Wheel Drive Electric',
    mileage: '550 km Est. Range',
    seating: '5 Seater Luxury Off-Road SUV',
    launchDate: 'Expected Mid 2026',
    features: ['850mm Wading Depth in EV', 'Terrain Response 2 Electric', 'Ultra-Quiet Cabin Tech', 'All-Wheel Steering']
  },
  {
    id: 'cb-up-7',
    name: 'Tata Sierra EV',
    brand: 'Tata Motors',
    type: 'EV',
    status: 'upcoming',
    badgeTag: 'Electric',
    priceRange: '₹22.00 - 28.00 Lakh (Expected)',
    priceRaw: 22.0,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    rating: 4.92,
    fuel: 'Electric Acti.ev Architecture',
    transmission: 'Single-Speed Automatic AWD',
    mileage: '500 km Est. Range',
    seating: '5 Seater Iconic SUV',
    launchDate: 'Expected Feb 2026',
    features: ['Iconic Curved Rear Glasshouse', 'Lounge Seating Mode', 'Vehicle-to-Load (V2L)', 'Dual-Motor AWD']
  },
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
  {
    id: 'bike-up-1',
    name: 'Royal Enfield Classic 650 Twin',
    brand: 'Royal Enfield',
    type: 'Bike',
    status: 'upcoming',
    priceRange: '₹3.25 - 3.50 Lakh (Expected)',
    priceRaw: 3.25,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    rating: 4.92,
    fuel: '648cc Parallel-Twin Petrol',
    mileage: '24.5 kmpl Est.',
    launchDate: 'Expected Early 2025',
    features: ['648cc Twin Engine', 'Dual Exhaust Pipes', 'Showa Upside-Down Suspension', 'All-LED Headlamps']
  },
  {
    id: 'bike-up-2',
    name: 'KTM 390 Adventure 2025 Next-Gen',
    brand: 'KTM',
    type: 'Bike',
    status: 'upcoming',
    priceRange: '₹3.65 - 3.85 Lakh (Expected)',
    priceRaw: 3.65,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    rating: 4.95,
    fuel: '399cc LC4c Engine',
    mileage: '28.0 kmpl Est.',
    launchDate: 'Expected Mid 2025',
    features: ['21-inch Front Spoke Wheel', 'Cornering Traction Control', 'Rally Dashboard', 'Long Travel Suspension']
  },

  
  // Agricultural Tractors (TractorGuru Reference)
  {
    id: 'tractor-pop-1',
    name: 'Mahindra 575 DI XP Plus Tractor',
    brand: 'Mahindra',
    type: 'Tractor',
    status: 'popular',
    priceRange: '₹6.85 - 7.20 Lakh',
    priceRaw: 6.85,
    image: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=600&q=80',
    rating: 4.88,
    fuel: 'Diesel (47 HP ELS Engine)',
    mileage: 'High Fuel Efficiency',
    seating: 'Heavy Duty 2WD Farm Tractor',
    features: ['4-Cylinder 47 HP Engine', 'Advanced ADDC Hydraulics', '6-Year Warranty', 'Dual Clutch Option']
  },
  {
    id: 'tractor-pop-2',
    name: 'Swaraj 744 FE 4WD Tractor',
    brand: 'Swaraj',
    type: 'Tractor',
    status: 'popular',
    priceRange: '₹8.20 - 8.65 Lakh',
    priceRaw: 8.20,
    image: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=600&q=80',
    rating: 4.92,
    fuel: 'Diesel (48 HP 3-Cylinder)',
    mileage: 'Rugged Farm Field Rating',
    seating: '4WD Heavy Agricultural Rig',
    features: ['4-Wheel Drive Traction', 'Power Steering Standard', 'Multi-Speed Reverse PTO', '2000 kg Lift Capacity']
  },
  {
    id: 'tractor-pop-3',
    name: 'John Deere 5050 D GearPro',
    brand: 'John Deere',
    type: 'Tractor',
    status: 'popular',
    priceRange: '₹7.99 - 8.45 Lakh',
    priceRaw: 7.99,
    image: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=600&q=80',
    rating: 4.95,
    fuel: 'Diesel (50 HP Turbocharged)',
    mileage: 'Optimized Heavy Haulage',
    seating: 'Agricultural / Haulage Workhorse',
    features: ['Top Shaft Synchronized Gearbox', 'Oil Immersed Disc Brakes', 'Selective Control Valve', 'Heavy Front Axle']
  },
  {
    id: 'tractor-used-1',
    name: '2022 Sonalika DI 745 III Sikander',
    brand: 'Sonalika',
    type: 'Tractor',
    status: 'used',
    priceRange: '₹4.60 Lakh',
    priceRaw: 4.60,
    image: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: 'Diesel (50 HP)',
    mileage: 'Single Farm Owner',
    year: '2022',
    kmsDriven: '1,420 Hours',
    owners: '1st Owner',
    location: 'Coimbatore / Erode Hub',
    features: ['New Rear Radial Tyres', 'Cultivator & Rotavator Linkage', 'Zero Hydraulic Leakage', 'RC & Fitness Valid']
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
  },
  {
    id: 'bike-used-2',
    name: '2023 Yamaha MT-15 V2 Moto GP Edition',
    brand: 'Yamaha',
    type: 'Bike',
    status: 'used',
    priceRange: '₹1.32 Lakh',
    priceRaw: 1.32,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    fuel: 'Petrol (155cc)',
    mileage: '48 kmpl',
    year: '2023',
    kmsDriven: '11,400 km',
    owners: '1st Owner',
    location: 'Chennai (Anna Nagar)',
    features: ['Single Owner Doctor Driven', 'All Periodic Services at Yamaha Authorized', 'Zero Scratch Condition', 'Comprehensive Insurance']
  },
  {
    id: 'bike-used-3',
    name: '2022 Honda Activa 6G Premium',
    brand: 'Honda 2Wheelers',
    type: 'Bike',
    status: 'used',
    priceRange: '₹58,000',
    priceRaw: 0.58,
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=600&q=80',
    rating: 4.75,
    fuel: 'Petrol (110cc)',
    mileage: '52 kmpl',
    year: '2022',
    kmsDriven: '18,200 km',
    owners: '1st Owner',
    location: 'Chennai (T. Nagar)',
    features: ['Golden Emblem Special Edition', 'New Battery with Warranty', 'Clean RC & Pollution Pass', 'Smooth Engine']
  },
  {
    id: 'car-used-bengaluru-1',
    name: '2021 Tata Nexon XZ+ Diesel',
    brand: 'Tata Motors',
    type: 'Car',
    status: 'used',
    priceRange: '₹9.40 Lakh',
    priceRaw: 9.40,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    fuel: 'Diesel • Manual',
    mileage: '21.5 kmpl',
    year: '2021',
    kmsDriven: '38,500 km',
    owners: '1st Owner',
    location: 'Bengaluru (Koramangala)',
    features: ['Single Owner IT Professional', 'Dual Tone Roof', 'Zero Depreciation Insurance', 'All Service Records']
  },
  {
    id: 'bike-used-bengaluru-1',
    name: '2022 TVS Apache RTR 160 4V',
    brand: 'TVS Motor',
    type: 'Bike',
    status: 'used',
    priceRange: '₹89,000',
    priceRaw: 0.89,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    fuel: 'Petrol',
    mileage: '45 kmpl',
    year: '2022',
    kmsDriven: '16,200 km',
    owners: '1st Owner',
    location: 'Bengaluru (Indiranagar)',
    features: ['Bluetooth SmartXonnect', 'Ride Modes', 'New Chain Sprocket', 'Verified Clean RC']
  },
  {
    id: 'car-used-mumbai-1',
    name: '2020 Hyundai Creta SX 1.5 Petrol',
    brand: 'Hyundai',
    type: 'Car',
    status: 'used',
    priceRange: '₹11.85 Lakh',
    priceRaw: 11.85,
    image: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: 'Petrol • Manual',
    mileage: '16.8 kmpl',
    year: '2020',
    kmsDriven: '36,000 km',
    owners: '1st Owner',
    location: 'Mumbai (Andheri West)',
    features: ['Panoramic Sunroof', '10.25" Bose Sound', 'Non-Flood Checked', 'Brand New Bridgestone Tyres']
  },
  {
    id: 'auto-used-chennai-1',
    name: '2022 Bajaj RE Compact 4S CNG',
    brand: 'Bajaj Auto (RE)',
    type: 'Auto',
    status: 'used',
    priceRange: '₹1.45 Lakh',
    priceRaw: 1.45,
    image: 'https://images.unsplash.com/photo-1596707328904-897d81a95449?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: 'CNG',
    mileage: '36 km/kg',
    year: '2022',
    kmsDriven: '28,000 km',
    owners: '1st Owner',
    location: 'Chennai (Tambaram)',
    features: ['Chennai Metro Permit Active', 'Valid Hydro Test CNG Tank', 'New Battery', 'Zero Police Challans']
  },
  {
    id: 'van-used-hyderabad-1',
    name: '2021 Maruti Suzuki Eeco 7-Seater AC',
    brand: 'Maruti Suzuki (Eeco/Omni)',
    type: 'Van',
    status: 'used',
    priceRange: '₹3.95 Lakh',
    priceRaw: 3.95,
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
    rating: 4.75,
    fuel: 'Petrol + CNG',
    mileage: '20.8 km/kg',
    year: '2021',
    kmsDriven: '44,000 km',
    owners: '1st Owner',
    location: 'Hyderabad (Secunderabad)',
    features: ['Factory Fitted Chilled AC', 'Company CNG Kit', 'Commercial / Private Use', 'Clean Chassis']
  },
  {
    id: 'car-used-delhi-1',
    name: '2022 Mahindra Thar LX 4x4 Hard Top',
    brand: 'Mahindra',
    type: 'Car',
    status: 'used',
    priceRange: '₹13.50 Lakh',
    priceRaw: 13.50,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    rating: 4.95,
    fuel: 'Diesel • Manual 4x4',
    mileage: '14.5 kmpl',
    year: '2022',
    kmsDriven: '24,000 km',
    owners: '1st Owner',
    location: 'Delhi NCR (Gurugram)',
    features: ['True 4x4 Low Range', 'Factory Hardtop', 'Underbody Armor Plated', 'Complete Delhi NCR NOC Available']
  },
  {
    id: 'car-used-4',
    name: '2021 Kia Seltos GTX Plus 1.4 Turbo',
    brand: 'Kia',
    type: 'Car',
    status: 'used',
    priceRange: '₹14.25 Lakh',
    priceRaw: 14.25,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rating: 4.88,
    fuel: 'Petrol • Automatic',
    mileage: '16.5 kmpl',
    year: '2021',
    kmsDriven: '31,000 km',
    owners: '1st Owner',
    location: 'Chennai (Adyar)',
    features: ['Bose 8-Speaker Sound', 'Ventilated Front Seats', '360 Camera', 'Sunroof & HUD']
  },
  {
    id: 'car-used-5',
    name: '2022 Toyota Fortuner 4x2 AT',
    brand: 'Toyota',
    type: 'Car',
    status: 'used',
    priceRange: '₹34.50 Lakh',
    priceRaw: 34.50,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    rating: 4.92,
    fuel: 'Diesel • Automatic',
    mileage: '12.8 kmpl',
    year: '2022',
    kmsDriven: '42,000 km',
    owners: '1st Owner',
    location: 'Chennai (OMR)',
    features: ['Full Toyota Service Record', 'Leather Seating', 'Zero Accidental History', '7 Airbags']
  },
  {
    id: 'car-used-6',
    name: '2021 Honda City ZX CVT',
    brand: 'Honda',
    type: 'Car',
    status: 'used',
    priceRange: '₹11.20 Lakh',
    priceRaw: 11.20,
    image: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=600&q=80',
    rating: 4.82,
    fuel: 'Petrol • Automatic',
    mileage: '18.4 kmpl',
    year: '2021',
    kmsDriven: '29,400 km',
    owners: '1st Owner',
    location: 'Bengaluru (Whitefield)',
    features: ['Sunroof', 'LaneWatch Camera', 'All 4 Power Windows', 'Leather Upholstery']
  },
  {
    id: 'bike-used-4',
    name: '2022 Royal Enfield Classic 350 Dark Stealth',
    brand: 'Royal Enfield',
    type: 'Bike',
    status: 'used',
    priceRange: '₹1.72 Lakh',
    priceRaw: 1.72,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    rating: 4.88,
    fuel: 'Petrol',
    mileage: '38.0 kmpl',
    year: '2022',
    kmsDriven: '14,500 km',
    owners: '1st Owner',
    location: 'Chennai (Mylapore)',
    features: ['Dual Channel ABS', 'Alloy Wheels with Tubeless Tyres', 'Single Hand Driven', 'Valid Insurance']
  },
  {
    id: 'bike-used-5',
    name: '2021 KTM Duke 250 ABS',
    brand: 'KTM',
    type: 'Bike',
    status: 'used',
    priceRange: '₹1.85 Lakh',
    priceRaw: 1.85,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: 'Petrol',
    mileage: '32.0 kmpl',
    year: '2021',
    kmsDriven: '19,000 km',
    owners: '1st Owner',
    location: 'Bengaluru (HSR Layout)',
    features: ['Slipper Clutch', 'Dual Channel Supermoto ABS', 'Showroom Condition', 'New Metzelers']
  },
  {
    id: 'lorry-used-tipper-1',
    name: '2021 Tata Signa 4825.TK Heavy Tipper',
    brand: 'Tata Motors',
    type: 'Lorry',
    status: 'used',
    priceRange: '₹28.50 Lakh',
    priceRaw: 28.50,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    rating: 4.84,
    fuel: 'Diesel',
    mileage: '3.8 kmpl',
    year: '2021',
    kmsDriven: '1,12,000 km',
    owners: '1st Owner',
    location: 'Chennai (Madhavaram)',
    features: ['Cummins ISBe 6.7L 250HP Engine', 'Heavy Duty 29 Cu.M Box Body', 'Valid Fitness & National Permit', 'Fleet Telematics Active']
  },
  {
    id: 'lorry-used-2',
    name: '2022 Ashok Leyland Ecomet 1615 HE',
    brand: 'Ashok Leyland',
    type: 'Lorry',
    status: 'used',
    priceRange: '₹17.80 Lakh',
    priceRaw: 17.80,
    image: 'https://images.unsplash.com/photo-1586191582056-a602058331df?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    fuel: 'Diesel',
    mileage: '6.2 kmpl',
    year: '2022',
    kmsDriven: '78,000 km',
    owners: '1st Owner',
    location: 'Coimbatore (Trichy Road)',
    features: ['i-Gen6 BS6 150HP Engine', '20ft High Deck Load Body', 'All Radial Tyres 80% Life', 'Zero Penalty Clean RC']
  },
  {
    id: 'bus-used-1',
    name: '2020 Volvo 9400 B11R Multi-Axle Luxury Coach',
    brand: 'Volvo',
    type: 'Bus',
    status: 'used',
    priceRange: '₹55.00 Lakh',
    priceRaw: 55.00,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    fuel: 'Diesel',
    mileage: '4.2 kmpl',
    year: '2020',
    kmsDriven: '3,20,000 km',
    owners: '1st Owner',
    location: 'Chennai (Koyambedu)',
    features: ['430HP 11L Engine • I-Shift AT', '53 Sleeper / Semi-Sleeper Berths', 'Individual AC & USB Ports', 'Full Volvo Authorized Service Records']
  },
  {
    id: 'bus-used-2',
    name: '2022 BharatBenz 1017 36-Seater AC Staff Bus',
    brand: 'BharatBenz',
    type: 'Bus',
    status: 'used',
    priceRange: '₹22.50 Lakh',
    priceRaw: 22.50,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
    rating: 4.78,
    fuel: 'Diesel',
    mileage: '6.5 kmpl',
    year: '2022',
    kmsDriven: '64,000 km',
    owners: '1st Owner',
    location: 'Bengaluru (Electronic City)',
    features: ['Chilled ThermoKing AC', 'High Back Pushback Recliners', 'Valid RTO School/Staff Fitness', 'ABS & Air Brakes']
  },
  {
    id: 'ev-used-1',
    name: '2022 Tata Nexon EV Max XZ+ Lux',
    brand: 'Tata Motors',
    type: 'EV',
    status: 'used',
    priceRange: '₹12.60 Lakh',
    priceRaw: 12.60,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    rating: 4.88,
    fuel: 'Electric (40.5 kWh)',
    mileage: '437 km Certified Range',
    year: '2022',
    kmsDriven: '26,500 km',
    owners: '1st Owner',
    location: 'Chennai (T. Nagar)',
    features: ['Battery State-of-Health 97%', 'Fast 7.2 kW Home Wallbox Included', 'Sunroof & Wireless Charger', '8-Year Battery Warranty Active']
  },
  {
    id: 'ev-used-2',
    name: '2023 Ather 450X Gen 3.1 Pro Pack',
    brand: 'Ather Energy',
    type: 'EV',
    status: 'used',
    priceRange: '₹1.05 Lakh',
    priceRaw: 1.05,
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    fuel: 'Electric (3.7 kWh)',
    mileage: '146 km Certified Range',
    year: '2023',
    kmsDriven: '9,200 km',
    owners: '1st Owner',
    location: 'Bengaluru (Indiranagar)',
    features: ['Ather Connect Pro Lifetime', 'Warp Mode Enabled', 'Battery Health 98%', 'Portable Fast Charger Box']
  }
];

export interface ComparisonVehicle {
  id: string;
  name: string;
  brand: string;
  category: 'Scooter' | 'Bike' | 'Car' | 'EV' | 'Commercial' | 'Auto';
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
  // SCOOTERS (Direct Match to User CarBike360 Reference Screenshot)
  {
    id: 'comp-ntorq',
    name: 'TVS NTORQ 125',
    brand: 'TVS',
    category: 'Scooter',
    price: '₹83.85k - 1.05 Lakh',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    engine: '124.8cc 3-Valve Single Cylinder',
    power: '9.38 PS @ 7000 rpm / 10.5 Nm',
    mileage: '47 - 51 kmpl',
    safety: 'SBT (Synchronized Braking) + Roto Petal Disc',
    airbags: 'High Rigidity Underbone Chassis',
    seating: '2 Seater Sport Scooter',
    warranty: '5 Years / 50,000 km'
  },
  {
    id: 'comp-rayzr',
    name: 'Yamaha Ray ZR 125',
    brand: 'Yamaha',
    category: 'Scooter',
    price: '₹80.68k - 94.50k',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    engine: '125cc Fi Hybrid Air-Cooled',
    power: '8.2 PS @ 6500 rpm / 10.3 Nm',
    mileage: '58.3 kmpl (Smart Hybrid)',
    safety: 'Unified Braking System (UBS) Disc',
    airbags: 'Lightweight 99kg Tough Frame',
    seating: '2 Seater Street Scooter',
    warranty: '5 Years / 50,000 km'
  },
  {
    id: 'comp-olas1x',
    name: 'OLA S1 X',
    brand: 'OLA Electric',
    category: 'Scooter',
    price: '₹74.99k - 99.99k',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    engine: 'Hub Motor / 3 kWh Lithium-ion Pack',
    power: '6.0 kW Peak / 90 km/h Top Speed',
    mileage: '151 km (Certified Range)',
    safety: 'Combined Braking System + Reverse Mode',
    airbags: 'High Strength Steel Frame',
    seating: '2 Seater EV Scooter',
    warranty: '8 Years / 80,000 km (Battery)'
  },
  {
    id: 'comp-qc1',
    name: 'Honda QC1 EV',
    brand: 'Honda',
    category: 'Scooter',
    price: '₹90.71k - 1.10 Lakh',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    engine: 'Honda Mobile Power Pack e: Swappable',
    power: '1.8 kW Motor / 80 km/h',
    mileage: '100 km Range per Charge',
    safety: 'Combi-Braking System (CBS)',
    airbags: 'Reinforced Underbone Frame',
    seating: '2 Seater Smart EV',
    warranty: '3 Years / 50,000 km'
  },
  {
    id: 'comp-activa',
    name: 'Honda Activa 6G',
    brand: 'Honda',
    category: 'Scooter',
    price: '₹76.36k - 91.48k',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    engine: '109.5cc PGM-FI 4-Stroke SI Engine',
    power: '7.99 PS @ 8000 rpm / 8.90 Nm',
    mileage: '59.5 kmpl',
    safety: 'Combi Brake System with Equalizer',
    airbags: 'Full Metal Body Construction',
    seating: '2 Seater Family Scooter',
    warranty: '3 Years + 3 Years Extended'
  },
  {
    id: 'comp-jupiter',
    name: 'TVS Jupiter 110',
    brand: 'TVS',
    category: 'Scooter',
    price: '₹74.13k - 89.83k',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    engine: '113.3cc 4-Stroke Single Cylinder',
    power: '8.02 PS @ 6500 rpm / 9.8 Nm',
    mileage: '53.84 kmpl',
    safety: 'Synchronized Braking Technology Disc',
    airbags: 'Rigid Underbone Frame with Gas Canister Shock',
    seating: '2 Seater Daily Commuter',
    warranty: '5 Years / 50,000 km'
  },
  {
    id: 'comp-access',
    name: 'Suzuki Access 125',
    brand: 'Suzuki',
    category: 'Scooter',
    price: '₹82.19k - 1.01 Lakh',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    engine: '124cc 4-Stroke Air-Cooled SEP',
    power: '8.42 PS @ 6500 rpm / 10 Nm',
    mileage: '45.0 - 52.0 kmpl',
    safety: 'Combined Brake System with Front Disc',
    airbags: 'Telescopic Suspension Frame',
    seating: '2 Seater Retro Classic',
    warranty: '5 Years / 50,000 km'
  },
  {
    id: 'comp-xl100',
    name: 'TVS XL100 Heavy Duty',
    brand: 'TVS',
    category: 'Scooter',
    price: '₹48.25k - 61.86k',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    engine: '100cc 4-Stroke EcoThrust Fuel Injection',
    power: '4.4 PS @ 6000 rpm / 6.5 Nm',
    mileage: '60 - 65 kmpl',
    safety: 'Synchronized Braking System',
    airbags: 'Heavy Duty Detachable Rear Seat Frame',
    seating: '2 Seater Commercial Multi-Utility',
    warranty: '3 Years / 36,000 km'
  },

  // BIKES
  {
    id: 'comp-r15',
    name: 'Yamaha R15 V4',
    brand: 'Yamaha',
    category: 'Bike',
    price: '₹1.73 - 1.98 Lakh',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    engine: '155cc Liquid-Cooled 4-Valve VVA',
    power: '18.4 PS @ 10,000 rpm / 14.2 Nm',
    mileage: '45 - 51 kmpl',
    safety: 'Dual-Channel ABS + Traction Control System',
    airbags: 'Deltabox Frame + Upside Down Forks',
    seating: '2 Seater Supersport',
    warranty: '5 Years / 50,000 km'
  },
  {
    id: 'comp-rr300',
    name: 'Keeway RR 300',
    brand: 'Keeway',
    category: 'Bike',
    price: '₹1.85 - 2.10 Lakh',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    engine: '298cc Liquid-Cooled Twin Cylinder',
    power: '30 PS @ 8500 rpm / 25 Nm',
    mileage: '30 - 35 kmpl',
    safety: 'Dual Channel ABS with Dual Discs',
    airbags: 'Trellis High-Tensile Steel Frame',
    seating: '2 Seater Streetfighter',
    warranty: '3 Years / 30,000 km'
  },
  {
    id: 'comp-classic',
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    category: 'Bike',
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
    category: 'Bike',
    price: '₹1.49 - 1.74 Lakh',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    engine: '349cc Air-Oil Cooled J-Series',
    power: '20.2 PS / 27 Nm',
    mileage: '36.9 kmpl',
    safety: 'Dual Channel ABS + 300mm Disc',
    airbags: 'Compact Roadster Chassis',
    seating: '2 Seater Roadster',
    warranty: '3 Years / 30,000 km'
  },

  // CARS & SUVS
  {
    id: 'comp-nexon',
    name: 'Tata Nexon Facelift',
    brand: 'Tata Motors',
    category: 'Car',
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
    category: 'Car',
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
    id: 'comp-thar',
    name: 'Mahindra Thar Roxx',
    brand: 'Mahindra',
    category: 'Car',
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
    category: 'Car',
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

  // ELECTRIC VEHICLES
  {
    id: 'comp-curvv',
    name: 'Tata Curvv EV',
    brand: 'Tata Motors',
    category: 'EV',
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

  // COMMERCIAL FLEET
  {
    id: 'comp-signa',
    name: 'Tata Signa 2823 Tipper Truck',
    brand: 'Tata Motors Commercial',
    category: 'Commercial',
    price: '₹37.50 - 41.20 Lakh',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    engine: 'Cummins ISBe 5.6L BS6 Turbodiesel',
    power: '230 HP / 850 Nm',
    mileage: '4.5 - 5.5 km/l (Loaded)',
    safety: 'Signa High-Strength Crash Tested Cabin',
    airbags: 'Driver Seatbelt + Air Brake System',
    seating: 'Driver + Co-Driver Sleeper Cabin',
    warranty: '6 Years / 6,00,000 km Driveline'
  },
  {
    id: 'comp-ashok',
    name: 'Ashok Leyland 1920 Multi-Axle Haulage',
    brand: 'Ashok Leyland',
    category: 'Commercial',
    price: '₹28.40 - 32.80 Lakh',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    engine: 'H-Series 4-Cylinder i-Gen6 Diesel',
    power: '200 HP / 700 Nm',
    mileage: '5.2 - 6.2 km/l',
    safety: 'Full Air Dual Line Brakes with ABS',
    airbags: 'Heavy Rollover Protected Cowl',
    seating: 'Driver + Sleeper Berth',
    warranty: '4 Years / 4,00,000 km'
  },
  // 3-WHEELER AUTO RICKSHAWS
  {
    id: 'comp-bajaj-re',
    name: 'Bajaj RE Compact 4S CNG',
    brand: 'Bajaj Auto',
    category: 'Auto',
    price: '₹2.34 - 2.55 Lakh',
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=600&q=80',
    engine: '236cc DTS-i 4-Stroke CNG',
    power: '9.65 HP @ 5000 rpm / 16.2 Nm',
    mileage: '38 - 42 km/kg',
    safety: 'Hydraulic Drum Brakes with Twin Circuit',
    airbags: 'High Tensile Pressed Steel Monocoque',
    seating: 'Driver + 3 Passenger Auto',
    warranty: '1 Year / 40,000 km'
  },
  {
    id: 'comp-piaggio-ape',
    name: 'Piaggio Ape City Plus Petrol',
    brand: 'Piaggio',
    category: 'Auto',
    price: '₹2.22 - 2.45 Lakh',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    engine: '230cc 3-Valve Single Cylinder Air-Cooled',
    power: '10.2 HP @ 4800 rpm / 17.5 Nm',
    mileage: '32 - 36 kmpl',
    safety: 'Tough Heavy Suspension & Front Bumper Guard',
    airbags: 'Monocoque High Rigidity Tub',
    seating: 'Driver + 3 Passenger',
    warranty: '3 Years / 1,00,000 km Super Warranty'
  },
  {
    id: 'comp-mahindra-treo',
    name: 'Mahindra Treo Electric Auto',
    brand: 'Mahindra',
    category: 'Auto',
    price: '₹2.92 - 3.12 Lakh',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    engine: 'AC Induction Motor / 7.37 kWh Li-ion',
    power: '10.7 HP / 42 Nm Instant Torque',
    mileage: '130 - 141 km (Certified Range)',
    safety: 'Hydraulic Brakes + Regenerative Braking',
    airbags: 'Rust-Free Modular Hard Top Spaceframe',
    seating: 'Driver + 3 Passenger Zero-Emission',
    warranty: '3 Years / 80,000 km Battery'
  }
];

export interface FuelPriceItem {
  city: string;
  state: string;
  petrol: number;
  diesel: number;
  cng: number;
  electricUnitRate: number; // ₹ per kWh
  updated: string;
  trend?: 'steady' | 'up' | 'down';
  petrolChange?: number;
  dieselChange?: number;
}

export const LIVE_FUEL_PRICES: FuelPriceItem[] = [
  // Tamil Nadu
  { city: 'Chennai', state: 'Tamil Nadu', petrol: 107.76, diesel: 99.55, cng: 99.50, electricUnitRate: 18.50, updated: 'Today 06:00 AM', trend: 'steady', petrolChange: 0.00, dieselChange: 0.00 },
  { city: 'Coimbatore', state: 'Tamil Nadu', petrol: 108.45, diesel: 100.45, cng: 96.90, electricUnitRate: 17.50, updated: 'Today 06:00 AM', trend: 'up', petrolChange: +0.18, dieselChange: +0.15 },
  { city: 'Madurai', state: 'Tamil Nadu', petrol: 108.62, diesel: 100.60, cng: 97.40, electricUnitRate: 17.50, updated: 'Today 06:00 AM', trend: 'steady', petrolChange: 0.00, dieselChange: 0.00 },
  { city: 'Tiruchirappalli', state: 'Tamil Nadu', petrol: 108.15, diesel: 99.95, cng: 96.80, electricUnitRate: 17.00, updated: 'Today 06:00 AM', trend: 'down', petrolChange: -0.10, dieselChange: -0.08 },
  { city: 'Salem', state: 'Tamil Nadu', petrol: 108.38, diesel: 100.25, cng: 97.10, electricUnitRate: 17.00, updated: 'Today 06:00 AM', trend: 'steady', petrolChange: 0.00, dieselChange: 0.00 },

  // Karnataka
  { city: 'Bengaluru', state: 'Karnataka', petrol: 110.82, diesel: 99.56, cng: 98.00, electricUnitRate: 19.00, updated: 'Today 06:00 AM', trend: 'up', petrolChange: +0.22, dieselChange: +0.18 },
  { city: 'Mysuru', state: 'Karnataka', petrol: 110.45, diesel: 99.20, cng: 97.80, electricUnitRate: 18.00, updated: 'Today 06:00 AM', trend: 'steady', petrolChange: 0.00, dieselChange: 0.00 },
  { city: 'Mangaluru', state: 'Karnataka', petrol: 109.80, diesel: 98.90, cng: 97.20, electricUnitRate: 17.50, updated: 'Today 06:00 AM', trend: 'down', petrolChange: -0.12, dieselChange: -0.10 },

  // Telangana & Andhra
  { city: 'Hyderabad', state: 'Telangana', petrol: 115.69, diesel: 104.23, cng: 97.00, electricUnitRate: 19.50, updated: 'Today 06:00 AM', trend: 'steady', petrolChange: 0.00, dieselChange: 0.00 },
  { city: 'Warangal', state: 'Telangana', petrol: 115.10, diesel: 103.80, cng: 96.50, electricUnitRate: 18.00, updated: 'Today 06:00 AM', trend: 'down', petrolChange: -0.14, dieselChange: -0.10 },

  // Maharashtra
  { city: 'Mumbai', state: 'Maharashtra', petrol: 111.21, diesel: 97.28, cng: 89.50, electricUnitRate: 20.00, updated: 'Today 06:00 AM', trend: 'down', petrolChange: -0.18, dieselChange: -0.15 },
  { city: 'Pune', state: 'Maharashtra', petrol: 110.95, diesel: 96.90, cng: 92.00, electricUnitRate: 18.50, updated: 'Today 06:00 AM', trend: 'steady', petrolChange: 0.00, dieselChange: 0.00 },
  { city: 'Nagpur', state: 'Maharashtra', petrol: 111.80, diesel: 97.85, cng: 93.50, electricUnitRate: 18.00, updated: 'Today 06:00 AM', trend: 'up', petrolChange: +0.25, dieselChange: +0.20 },

  // Delhi NCR
  { city: 'New Delhi', state: 'Delhi NCR', petrol: 94.72, diesel: 87.62, cng: 79.70, electricUnitRate: 16.00, updated: 'Today 06:00 AM', trend: 'steady', petrolChange: 0.00, dieselChange: 0.00 },
  { city: 'Noida', state: 'Delhi NCR', petrol: 96.65, diesel: 89.82, cng: 82.20, electricUnitRate: 16.50, updated: 'Today 06:00 AM', trend: 'up', petrolChange: +0.14, dieselChange: +0.11 },
  { city: 'Gurugram', state: 'Delhi NCR', petrol: 95.25, diesel: 88.10, cng: 81.60, electricUnitRate: 16.80, updated: 'Today 06:00 AM', trend: 'steady', petrolChange: 0.00, dieselChange: 0.00 },

  // Kerala
  { city: 'Kochi', state: 'Kerala', petrol: 108.80, diesel: 97.75, cng: 94.50, electricUnitRate: 18.00, updated: 'Today 06:00 AM', trend: 'steady', petrolChange: 0.00, dieselChange: 0.00 },
  { city: 'Thiruvananthapuram', state: 'Kerala', petrol: 109.95, diesel: 98.90, cng: 95.00, electricUnitRate: 18.50, updated: 'Today 06:00 AM', trend: 'up', petrolChange: +0.20, dieselChange: +0.16 },

  // Gujarat
  { city: 'Ahmedabad', state: 'Gujarat', petrol: 96.44, diesel: 92.11, cng: 84.40, electricUnitRate: 15.50, updated: 'Today 06:00 AM', trend: 'down', petrolChange: -0.22, dieselChange: -0.19 },
  { city: 'Surat', state: 'Gujarat', petrol: 96.30, diesel: 91.98, cng: 83.90, electricUnitRate: 15.00, updated: 'Today 06:00 AM', trend: 'steady', petrolChange: 0.00, dieselChange: 0.00 },

  // West Bengal
  { city: 'Kolkata', state: 'West Bengal', petrol: 104.95, diesel: 91.76, cng: 89.00, electricUnitRate: 18.00, updated: 'Today 06:00 AM', trend: 'steady', petrolChange: 0.00, dieselChange: 0.00 },
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

  // Bengaluru Stations
  {
    id: 'loc-blr-1',
    name: 'Shell Petrol Station - Whitefield Main Road',
    brand: 'Shell India',
    city: 'Bengaluru',
    address: 'ITPL Main Road, Near Hope Farm Junction, Whitefield, 560066, Bengaluru',
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
    city: 'Bengaluru',
    address: '100 Feet Road, 12th Main Junction, HAL 2nd Stage, Indiranagar, 560038, Bengaluru',
    status: 'Open now • 24x7 Multi-Vehicle Hub',
    phone: '011 4118 7800',
    fuels: ['150kW DC Dual Gun (CCS2)', '60kW DC (GB/T)'],
    type: 'ev',
    distance: '2.1 km',
    rating: 4.8
  },
  {
    id: 'loc-blr-3',
    name: 'HPCL Auto & CNG Station - Koramangala',
    brand: 'Hindustan Petroleum (HPCL)',
    city: 'Bengaluru',
    address: '80 Feet Road, 4th Block, Koramangala, 560034, Bengaluru',
    status: 'Open 24 Hours • High Volume Station',
    phone: '080 2553 4410',
    fuels: ['Petrol', 'Diesel', 'CNG (GAIL Gas)'],
    type: 'fuel',
    distance: '1.9 km',
    rating: 4.6
  },
  {
    id: 'loc-blr-4',
    name: 'Tata Power EZ EV Hub - Electronic City Phase 1',
    brand: 'Tata Power EV',
    city: 'Bengaluru',
    address: 'Hosur Main Road, Near Infosys Gate 1, Electronic City, 560100, Bengaluru',
    status: 'Open 24 Hours • Ultra-Fast DC Hub',
    phone: '1800 209 5161',
    fuels: ['120kW DC Fast Charge', '60kW DC CCS2', 'Type 2 AC'],
    type: 'ev',
    distance: '3.4 km',
    rating: 4.9
  },

  // Coimbatore Stations
  {
    id: 'loc-cbe-1',
    name: 'BPCL Auto & Green CNG Station - Avinashi Road',
    brand: 'Bharat Petroleum (BPCL)',
    city: 'Coimbatore',
    address: 'Avinashi Road, Near Lakshmi Mills Junction, Peelamedu, 641004, Coimbatore',
    status: 'Open 24 Hours • High Speed Dispenser',
    phone: '0422 256 7180',
    fuels: ['Petrol', 'Diesel', 'CNG'],
    type: 'fuel',
    distance: '1.0 km',
    rating: 4.8
  },
  {
    id: 'loc-cbe-2',
    name: 'Zeon Electric Fast Charging Hub - Brookefields',
    brand: 'Zeon Charging',
    city: 'Coimbatore',
    address: 'Brookefields Mall Parking, Krishnaswamy Road, 641001, Coimbatore',
    status: 'Open now • 07:00 AM - 11:00 PM',
    phone: '0422 438 8899',
    fuels: ['60kW Dual CCS2 DC', '22kW Type 2 AC'],
    type: 'ev',
    distance: '2.2 km',
    rating: 4.9
  },

  // Madurai Stations
  {
    id: 'loc-mdu-1',
    name: 'IOCL Highway Service Station - Mattuthavani',
    brand: 'Indian Oil (IOCL)',
    city: 'Madurai',
    address: 'Melur High Road, Near Mattuthavani Integrated Bus Terminal, 625007, Madurai',
    status: 'Open 24 Hours • All Days',
    phone: '0452 258 3311',
    fuels: ['Petrol', 'Diesel', 'CNG Available'],
    type: 'fuel',
    distance: '1.5 km',
    rating: 4.7
  },
  {
    id: 'loc-mdu-2',
    name: 'Relux Electric EV Fast Charging Station',
    brand: 'Relux Electric',
    city: 'Madurai',
    address: 'Bypass Road, Near Ponmeni, 625016, Madurai',
    status: 'Open 24 Hours • Fast EV Hub',
    phone: '1800 123 73589',
    fuels: ['50kW DC Fast Gun', '22kW AC Charger'],
    type: 'ev',
    distance: '2.8 km',
    rating: 4.8
  },

  // Mumbai Stations
  {
    id: 'loc-mum-1',
    name: 'MGL Auto CNG & BPCL Pump - Bandra Kurla Complex',
    brand: 'Mahanagar Gas & BPCL',
    city: 'Mumbai',
    address: 'BKC Main Avenue, Bandra East, 400051, Mumbai',
    status: 'Open 24 Hours • 8 CNG Dispensers',
    phone: '022 2659 0100',
    fuels: ['CNG Clean Fuel', 'Speed Petrol', 'Diesel'],
    type: 'both',
    distance: '1.1 km',
    rating: 4.7
  },
  {
    id: 'loc-mum-2',
    name: 'Tata Power EV Mega Charger - Lower Parel',
    brand: 'Tata Power EV',
    city: 'Mumbai',
    address: 'Senapati Bapat Marg, High Street Phoenix Compound, Lower Parel, 400013, Mumbai',
    status: 'Open 24 Hours • 120kW Supercharger',
    phone: '1800 209 5161',
    fuels: ['120kW Dual CCS2 DC', '60kW DC Fast', 'Type 2 AC'],
    type: 'ev',
    distance: '2.6 km',
    rating: 4.9
  },

  // Hyderabad Stations
  {
    id: 'loc-hyd-1',
    name: 'HPCL Auto & Bhagyanagar CNG - Hitec City',
    brand: 'Hindustan Petroleum (HPCL)',
    city: 'Hyderabad',
    address: 'Madhapur Main Road, Cyber Towers Junction, Hitec City, 500081, Hyderabad',
    status: 'Open 24 Hours • High Volume Pump',
    phone: '040 2311 8844',
    fuels: ['Petrol (Power)', 'Diesel', 'Auto CNG'],
    type: 'fuel',
    distance: '0.9 km',
    rating: 4.8
  },
  {
    id: 'loc-hyd-2',
    name: 'Jio-bp pulse EV Hub - Gachibowli Stadium Road',
    brand: 'Jio-bp pulse',
    city: 'Hyderabad',
    address: 'Old Mumbai Highway, Gachibowli, 500032, Hyderabad',
    status: 'Open 24 Hours • Super Fast EV',
    phone: '1800 891 9023',
    fuels: ['150kW Ultra Fast DC', '60kW CCS2 DC', '22kW AC'],
    type: 'ev',
    distance: '2.4 km',
    rating: 4.9
  }
];

export interface AutomotiveNewsItem {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  snippet: string;
  author: string;
}

export const AUTOMOTIVE_NEWS_DATA: AutomotiveNewsItem[] = [
  {
    id: 'news-1',
    title: 'Mahindra Thar Roxx 4x4 Road Test Review: The Five-Door Off-Road King',
    category: 'Expert Review',
    readTime: '6 min read',
    date: 'Oct 2024',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    snippet: 'With 5 doors, panoramic skyroof, and genuine 4x4 low range, can the Thar Roxx become the ultimate family adventure SUV?',
    author: 'SART Automotive Desk'
  },
  {
    id: 'news-2',
    title: 'Tata Curvv EV 500km Real-World Highway Range & DC Fast Charge Test',
    category: 'First Drive',
    readTime: '5 min read',
    date: 'Oct 2024',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    snippet: 'Tested on the Chennai-Bangalore expressway with full AC and luggage: how does the 55 kWh battery pack hold up?',
    author: 'Electric Mobility Team'
  },
  {
    id: 'news-3',
    title: 'Royal Enfield Classic 650 Twin & Himalayan 450 Tubeless Rims: Launch Timeline',
    category: 'New Launch',
    readTime: '4 min read',
    date: 'Oct 2024',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    snippet: 'The iconic Classic styling meets Royal Enfield’s smooth 648cc parallel-twin engine with dual peashooter exhausts.',
    author: 'Two-Wheeler Bureau'
  },
  {
    id: 'news-4',
    title: 'Heavy Commercial Telematics: How Tata Fleet Edge & Ashok Leyland i-Gen6 Save 18% Fuel',
    category: 'Commercial & Fleet',
    readTime: '7 min read',
    date: 'Oct 2024',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
    snippet: 'Modern Indian freight operators are deploying IoT fuel monitoring and predictive diagnostics on heavy tippers and container trucks.',
    author: 'Commercial Fleet Insights'
  }
];

export interface VehicleVideoItem {
  id: string;
  title: string;
  duration: string;
  views: string;
  image: string;
  channel: string;
  vehicleType: string;
}

export const VEHICLE_VIDEO_REVIEWS: VehicleVideoItem[] = [
  {
    id: 'vid-1',
    title: 'Mahindra Thar Roxx vs Force Gurkha 5-Door: Ultimate Mud Off-Road Battle',
    duration: '18:45',
    views: '480K views',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    channel: 'SART Motors Video',
    vehicleType: 'Car & SUV'
  },
  {
    id: 'vid-2',
    title: 'Honda Amaze 3rd Gen 2024: Premium Cabin, ADAS & City Mileage Walkaround',
    duration: '14:20',
    views: '320K views',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    channel: 'SART Car Reviews',
    vehicleType: 'Sedan'
  },
  {
    id: 'vid-3',
    title: 'Royal Enfield Classic 350 vs Hunter 350: Which J-Series Bike Should You Buy?',
    duration: '16:10',
    views: '610K views',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    channel: 'SART Moto Vlog',
    vehicleType: 'Motorcycle'
  },
  {
    id: 'vid-4',
    title: 'Ather 450X Gen 3 vs Ola S1 Pro Gen 2: True Range & Warp Mode Tested in Traffic',
    duration: '19:35',
    views: '750K views',
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=600&q=80',
    channel: 'EV Revolution India',
    vehicleType: 'Electric Scooter'
  }
];

export interface VehicleComparisonPair {
  id: string;
  title: string;
  category: 'Car' | 'Bike' | 'Truck' | 'Tractor' | 'EV';
  vehicleA: {
    name: string;
    brand: string;
    price: string;
    image: string;
    spec: string;
  };
  vehicleB: {
    name: string;
    brand: string;
    price: string;
    image: string;
    spec: string;
  };
}

export const POPULAR_COMPARISON_PAIRS: VehicleComparisonPair[] = [
  {
    id: 'comp-pair-1',
    title: 'Compact SUV Battle',
    category: 'Car',
    vehicleA: {
      name: 'Tata Nexon Facelift',
      brand: 'Tata Motors',
      price: '₹8.15 - 15.80 Lakh',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      spec: '120 PS • 17.44 kmpl • 5-Star BNCAP'
    },
    vehicleB: {
      name: 'Hyundai Creta 2024',
      brand: 'Hyundai',
      price: '₹11.00 - 20.15 Lakh',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      spec: '160 PS • 17.4 kmpl • Level 2 ADAS'
    }
  },
  {
    id: 'comp-pair-2',
    title: '350cc Cruiser Showdown',
    category: 'Bike',
    vehicleA: {
      name: 'Royal Enfield Classic 350',
      brand: 'Royal Enfield',
      price: '₹1.93 - 2.30 Lakh',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      spec: '349cc J-Series • 37.7 kmpl • Dual ABS'
    },
    vehicleB: {
      name: 'Yamaha MT-15 V2',
      brand: 'Yamaha',
      price: '₹1.68 - 1.74 Lakh',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
      spec: '155cc Liquid-Cooled • 47.9 kmpl • Traction Control'
    }
  },
  {
    id: 'comp-pair-3',
    title: 'Heavy Commercial Haulage',
    category: 'Truck',
    vehicleA: {
      name: 'Tata Signa 4825.TK Tipper',
      brand: 'Tata Motors',
      price: '₹46.50 - 52.80 Lakh',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
      spec: '250 HP Cummins • 16-Wheeler • Pneumatic ABS'
    },
    vehicleB: {
      name: 'Ashok Leyland 2820-6x2',
      brand: 'Ashok Leyland',
      price: '₹31.20 - 36.50 Lakh',
      image: 'https://images.unsplash.com/photo-1586191582056-a607185d5656?auto=format&fit=crop&w=600&q=80',
      spec: '200 HP i-Gen6 • 10-Wheeler • Unitized Bearings'
    }
  },
  {
    id: 'comp-pair-4',
    title: 'Heavy Agricultural Workhorses',
    category: 'Tractor',
    vehicleA: {
      name: 'Mahindra 575 DI XP Plus',
      brand: 'Mahindra',
      price: '₹6.85 - 7.20 Lakh',
      image: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=600&q=80',
      spec: '47 HP 4-Cyl ELS • 1480 kg Lift • 6-Yr Warranty'
    },
    vehicleB: {
      name: 'Swaraj 744 FE 4WD',
      brand: 'Swaraj',
      price: '₹8.20 - 8.65 Lakh',
      image: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=600&q=80',
      spec: '48 HP 4WD • 2000 kg Lift • Multi-Speed PTO'
    }
  }
];

export interface UpcomingCarsFaq {
  q: string;
  a: string;
}

export const UPCOMING_CARS_FAQS: UpcomingCarsFaq[] = [
  {
    q: 'How many upcoming cars are expected to launch in India 2026/2027?',
    a: 'As per automotive intelligence, 70+ new cars, SUVs and electric vehicles are scheduled to launch in India across SUV, Sedan, MPV and luxury segments in 2025-2027.'
  },
  {
    q: 'How many upcoming cars will launch in India in the next 3 months?',
    a: 'Around 12 to 15 key vehicles are slated for commercial launch within the next 90 days, including the 2026 Toyota Fortuner, Skoda Kylaq, New Honda City facelift, and Tata Curvv EV.'
  },
  {
    q: 'Which is the lowest price car in this list?',
    a: 'The most affordable upcoming car in India is the Skoda Kylaq sub-compact SUV, with expected prices starting from ₹7.89 Lakh (Ex-showroom).'
  },
  {
    q: 'Which upcoming SUVs are launching in India soon?',
    a: 'Major upcoming SUVs include the next-gen Toyota Fortuner 2026/2027, Tata Sierra EV, Volkswagen Tayron 7-Seater, Audi Q3, and Mahindra XUV.e8.'
  },
  {
    q: 'How can I get alerted when an upcoming car launches in India?',
    a: 'Click "Notify Me on Launch" on any upcoming vehicle card to receive instantaneous SMS and WhatsApp alerts on official price reveal, dealership test drive availability, and booking commencement.'
  },
  {
    q: 'Can I filter upcoming cars by brand, body type, or launch period?',
    a: 'Yes, you can use our dedicated filters above to sort upcoming models by your preferred automaker, body style (SUV, Sedan, Hatchback, etc.), and expected price range.'
  }
];

export * from './storeFinanceEmiData';