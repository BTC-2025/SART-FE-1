import { StoreProduct } from './storeProductsData';

/* ------------------------------------------------------------------ */
/* 1. EXTENDED VEHICLE SPECIFIC ACCESSORIES & SPARES DATA               */
/* ------------------------------------------------------------------ */

export interface SpareSubCategoryItem {
  id: string;
  name: string;
  items: string[];
}

export interface VehicleSpareCategory {
  id: string;
  name: string;
  icon: string;
  subCategories: SpareSubCategoryItem[];
}

// 11 Detailed Categories based on User Reference Image
export const BIKE_DETAILED_CATEGORIES: VehicleSpareCategory[] = [
  {
    id: 'bike_engine',
    name: '1. Engine & Internal Components',
    icon: 'fa-gears',
    subCategories: [
      { id: 'piston_cyl', name: 'Piston & Cylinder Assembly', items: ['Piston', 'Piston Rings', 'Piston Pin', 'Cylinder Block', 'Cylinder Head'] },
      { id: 'valves_timing', name: 'Valves & Timing', items: ['Inlet/Exhaust Valves', 'Valve Springs', 'Rocker Arms', 'Camshaft', 'Timing Chain', 'Tensioner'] },
      { id: 'crank_bearings', name: 'Crankshaft & Bearings', items: ['Crankshaft Assembly', 'Connecting Rod', 'Crank Bearings', 'Oil Pump'] },
      { id: 'gaskets_seals', name: 'Gaskets & Seals', items: ['Engine Head Gasket', 'Full Packing Kit', 'Oil Seals'] }
    ]
  },
  {
    id: 'bike_transmission',
    name: '2. Transmission & Clutch System',
    icon: 'fa-shuffle',
    subCategories: [
      { id: 'clutch_assy', name: 'Clutch Assembly', items: ['Clutch Plates (Friction & Steel)', 'Clutch Housing', 'Clutch Hub', 'Clutch Center', 'Clutch Push Rod', 'Clutch Cable'] },
      { id: 'gearbox_drive', name: 'Gearbox & Drive', items: ['Gear Shift Lever', 'Gear Drum', 'Transmission Gears', 'Drive Chain', 'Front/Rear Sprockets', 'Chain Adjuster'] },
      { id: 'belt_cvt', name: 'Belt & CVT (Scooters)', items: ['V-Belt', 'Variator Plate', 'Roller Weights', 'Clutch Shoe Assembly'] }
    ]
  },
  {
    id: 'bike_fuel_air',
    name: '3. Fuel & Air Intake System',
    icon: 'fa-gas-pump',
    subCategories: [
      { id: 'fuel_supply', name: 'Fuel Supply', items: ['Fuel Tank', 'Fuel/Petrol Cock', 'Fuel Pump', 'Carburetor / Throttle Body FI', 'Fuel Filter'] },
      { id: 'air_filtration', name: 'Air Filtration', items: ['Air Filter Element', 'Air Suction Valve', 'Breather Hose'] },
      { id: 'exhaust_sys', name: 'Exhaust', items: ['Exhaust Pipe', 'Header Bend Pipe', 'Muffler / Silencer', 'Heat Shield'] }
    ]
  },
  {
    id: 'bike_electrical',
    name: '4. Electrical & Ignition System',
    icon: 'fa-bolt',
    subCategories: [
      { id: 'power_charging', name: 'Power & Charging', items: ['Battery', 'Wiring Harness Kit', 'Regulator / Rectifier', 'Stator Coil / Alternator'] },
      { id: 'ignition_start', name: 'Ignition & Starting', items: ['Spark Plug', 'Ignition Coil', 'CDI / TCI Unit', 'ECU', 'Starter Motor', 'Self-Start Bendix', 'Starter Relay'] },
      { id: 'switches_sensors', name: 'Switches & Sensors', items: ['Ignition Key Switch', 'Handle Switch Assembly', 'Side Stand Sensor', 'Neutral Switch', 'ABS Module'] }
    ]
  },
  {
    id: 'bike_lighting',
    name: '5. Lighting & Signalling',
    icon: 'fa-lightbulb',
    subCategories: [
      { id: 'head_tail', name: 'Head & Tail', items: ['Headlight Assembly (LED/Bulb)', 'Reflector Visor', 'Tail Light Assembly'] },
      { id: 'indicators_extras', name: 'Indicators & Extras', items: ['Turn Signal Indicators', 'Flasher Relay', 'DRLs', 'License Plate Light'] }
    ]
  },
  {
    id: 'bike_braking',
    name: '6. Braking System',
    icon: 'fa-circle-stop',
    subCategories: [
      { id: 'drum_brakes', name: 'Drum Brakes', items: ['Brake Shoes', 'Brake Drum Plate', 'Brake Cams', 'Brake Rods & Springs'] },
      { id: 'disc_brakes', name: 'Disc Brakes', items: ['Brake Disc Rotor', 'Brake Pads (Sintered/Ceramic)', 'Brake Caliper', 'Master Cylinder', 'Brake Fluid Reservoir', 'Brake Hoses'] },
      { id: 'controls', name: 'Controls', items: ['Front Brake Lever', 'Rear Brake Pedal / Foot Lever'] }
    ]
  },
  {
    id: 'bike_suspension',
    name: '7. Suspension & Steering',
    icon: 'fa-arrows-up-down',
    subCategories: [
      { id: 'front_susp', name: 'Front Suspension', items: ['Front Fork Inner Tubes', 'Outer Tubes', 'Fork Oil Seals', 'Fork Cone Set'] },
      { id: 'rear_susp', name: 'Rear Suspension', items: ['Rear Shock Absorbers', 'Mono-Shock Absorber'] },
      { id: 'steering', name: 'Steering', items: ['Handlebar', 'Handle Riser', 'Triple Tree', 'Steering Stem Nut'] }
    ]
  },
  {
    id: 'bike_tyres_wheels',
    name: '8. Wheels, Tyres & Rubber Parts',
    icon: 'fa-circle-notch',
    subCategories: [
      { id: 'wheels_tyres', name: 'Wheels & Tyres', items: ['Tubeless Tyres', 'Tube Tyres', 'Alloy Wheels', 'Spoked Rims', 'Wheel Hub', 'Inner Tubes'] },
      { id: 'rubber_cushions', name: 'Rubber Cushions & Mounts', items: ['Chain Coupling Rubbers', 'Engine Mounting Bushes', 'Footrest Rubbers', 'Gear Lever Rubbers'] }
    ]
  },
  {
    id: 'bike_body_ergo',
    name: '9. Body & Ergonomics',
    icon: 'fa-motorcycle',
    subCategories: [
      { id: 'panels_fairing', name: 'Panels & Fairings', items: ['Front Nose Cowl', 'Side Panels', 'Tail Panel', 'Front/Rear Mudguards', 'Tyre Hugger'] },
      { id: 'seating_frame', name: 'Seating & Frame', items: ['Rider & Pillion Seat', 'Seat Lock / Cable', 'Grab Rail', 'Chassis / Subframe'] },
      { id: 'stands_guards', name: 'Stands & Guards', items: ['Center Stand', 'Side Stand', 'Kickstand Spring', 'Crash Guard / Leg Guard', 'Sari Guard', 'Engine Sump Guard'] }
    ]
  },
  {
    id: 'bike_cluster_dash',
    name: '10. Instrument Cluster & Dash',
    icon: 'fa-gauge-high',
    subCategories: [
      { id: 'dash_meters', name: 'Dashboard & Display', items: ['Digital TFT Display', 'Analog Speedometer', 'Tachometer / RPM Meter', 'Fuel Gauge', 'Meter Glass Lens', 'Speedometer Cable'] }
    ]
  },
  {
    id: 'bike_aftermarket',
    name: '11. Aftermarket, Wear & Touring Accessories',
    icon: 'fa-helmet-safety',
    subCategories: [
      { id: 'riding_gear', name: 'Riding Wear & Protective Gear', items: ['Full Face Helmets', 'Flip-up Modular Helmets', 'Riding Goggles / Visors', 'Armored Riding Jackets', 'Riding Pants', 'Riding Gloves', 'Biking Boots', 'Knee & Elbow Guards'] },
      { id: 'lighting_touring', name: 'Lighting & Electronics', items: ['Auxiliary LED Fog Lights', 'Spotlights', 'Handlebar Mount Switch', 'Fast Mobile USB Charger', 'Vibration Dampener Phone Mount'] },
      { id: 'luggage_touring', name: 'Luggage & Comfort', items: ['Magnetic Tank Bags', 'Waterproof Saddlebags', 'Top Box / Tail Bag', 'Gel Seat Cushion Cover', 'All-Weather Bike Body Cover'] },
      { id: 'crash_protection', name: 'Custom Protection & Styling', items: ['Frame Sliders', 'Knuckle Guards / Handguards', 'Radiator Grill Guard', 'Headlight Grill Mesh'] }
    ]
  }
];

// Universal / Car Specific Spares Categories
export const CAR_DETAILED_CATEGORIES: VehicleSpareCategory[] = [
  {
    id: 'car_engine_fluids',
    name: '1. Engine, Oils & Lubricants',
    icon: 'fa-oil-can',
    subCategories: [
      { id: 'car_oil', name: 'Engine Oils', items: ['Fully Synthetic 5W-40', 'Semi-Synthetic 10W-30', 'Diesel Engine Oil 15W-40', 'Coolant & Antifreeze', 'Brake Fluid DOT 4'] },
      { id: 'car_filters', name: 'Filters & Plugs', items: ['Oil Filter', 'Engine Air Filter', 'Cabin AC Filter', 'Fuel Filter', 'Iridium Spark Plugs'] }
    ]
  },
  {
    id: 'car_tyres_wheels',
    name: '2. Tyres, Alloys & TPMS',
    icon: 'fa-circle-notch',
    subCategories: [
      { id: 'car_tyres', name: 'Passenger Tyres', items: ['185/65 R15 Radial', '195/55 R16 Tubeless', '215/60 R17 SUV Tyres', 'All-Terrain 4x4 Tyres', 'Run-Flat Tyres'] },
      { id: 'car_wheel_care', name: 'Alloys & Accessories', items: ['Diamond Cut Alloy Wheels', 'Solar TPMS Wireless Sensor', 'Tubeless Puncture Repair Kit', 'Digital Tyre Inflator'] }
    ]
  },
  {
    id: 'car_electronics_dash',
    name: '3. Dashboard, Dashcams & Infotainment',
    icon: 'fa-video',
    subCategories: [
      { id: 'car_dashcam', name: 'Smart Dashcams', items: ['4K UHD Dual Channel Dashcam', 'Night Vision Parking Dashcam', 'GPS 4G Connected Dashcam', 'Rear View Mirror Cam'] },
      { id: 'car_audio', name: 'Touchscreen Audio & Gadgets', items: ['Android Auto / CarPlay Touchscreen 10-inch', 'High-Fidelity Component Speakers', 'Wireless MagSafe Car Charger Mount', 'OBD-II Smart Diagnostic Scanner'] }
    ]
  },
  {
    id: 'car_accessories_care',
    name: '4. Styling, Mats, Care & Emergency',
    icon: 'fa-spray-can-sparkles',
    subCategories: [
      { id: 'car_interiors', name: 'Interior Accessories', items: ['7D Luxury Custom Fit Foot Mats', 'Perforated Leatherette Seat Covers', 'Memory Foam Neck Pillows', 'Sunshades & Magnetic Curtains'] },
      { id: 'car_detailing', name: 'Ceramic & Wash Care', items: ['Graphene Ceramic Coating 10H', 'Carnauba Liquid Polish', 'Frameless Silicone Wiper Blades', 'Heavy Duty Jump Starter 24000mAh'] }
    ]
  }
];

/* ------------------------------------------------------------------ */
/* 2. RICH DIRECT-SELLER / SELF-SHIP SPARES & ACCESSORIES CATALOG     */
/* ------------------------------------------------------------------ */

export const EXTENDED_ACCESSORIES_CATALOG: StoreProduct[] = [
  // --- HELMETS & RIDING GEAR ---
  {
    id: 'gear-1',
    name: 'Axor Apex Venomous ECE & DOT Certified Full Face Helmet',
    price: 4994,
    originalPrice: 5499,
    rating: 4.9,
    reviewsCount: 840,
    icon: 'fa-helmet-safety',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Accessories',
    section: 'Riding Gear & Protection',
    badge: 'DOT & ECE 22.05',
    badgeType: 'trending',
    desc: 'High impact ABS composite shell with anti-scratch pinlock ready visor, integrated internal sun visor & aerodynamic spoiler.',
    compatibleWith: 'All Bikers & Scooter Riders (M, L, XL)',
    deliveryTime: 'Direct Dealer Dispatch (24-48 Hrs)',
    inStock: true,
    stockLeft: 24,
  },
  {
    id: 'gear-2',
    name: 'Royal Enfield Escapade Armored All-Weather Riding Jacket',
    price: 7200,
    originalPrice: 8999,
    rating: 4.88,
    reviewsCount: 312,
    icon: 'fa-vest',
    image: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Accessories',
    section: 'Riding Gear & Protection',
    badge: 'CE LEVEL 2',
    badgeType: 'new',
    desc: 'Abrasion resistant 600D Cordura construction with Knox CE Level 2 shoulder & elbow protectors, removable thermal rain liner.',
    compatibleWith: 'Universal Touring (Sizes: S, M, L, XL, XXL)',
    deliveryTime: 'Nearby Riding Gear Store (1-Hr Pickup)',
    inStock: true,
    stockLeft: 18,
  },
  {
    id: 'gear-3',
    name: '100% UV400 Polarized Anti-Glare Biking & Touring Goggles',
    price: 1299,
    originalPrice: 2499,
    rating: 4.75,
    reviewsCount: 450,
    icon: 'fa-glasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Accessories',
    section: 'Riding Gear & Protection',
    badge: 'UV400 POLARIZED',
    desc: 'High-definition shatterproof polycarbonate lenses with windproof dust gasket for high-speed highway touring and motocross.',
    compatibleWith: 'Universal Biking & Outdoor Sport',
    deliveryTime: 'Direct Seller Dispatch',
    inStock: true,
    stockLeft: 50,
  },

  // --- TYRES & CUSTOMIZABLE SIZES ---
  {
    id: 'tyre-1',
    name: 'MRF Zapper FX1 100/80-17 Tubeless Front Bike Tyre',
    price: 2150,
    originalPrice: 2800,
    rating: 4.82,
    reviewsCount: 920,
    icon: 'fa-circle-notch',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Spare Parts',
    section: 'Wheels & Tyres',
    badge: 'BESTSELLER TYRE',
    badgeType: 'bestseller',
    desc: 'Aggressive directional tread pattern for supreme wet tarmac grip, sharper cornering precision and extended tread life.',
    compatibleWith: 'Yamaha FZ, MT-15, Pulsar NS200, TVS Apache RTR',
    deliveryTime: 'Free Fitting at Nearby Tyre Partner',
    inStock: true,
    stockLeft: 30,
  },
  {
    id: 'tyre-2',
    name: 'Michelin City Extra 140/70-17 High-Mileage Rear Bike Tyre',
    price: 3850,
    originalPrice: 4700,
    rating: 4.95,
    reviewsCount: 610,
    icon: 'fa-circle-notch',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Spare Parts',
    section: 'Wheels & Tyres',
    badge: 'MICHELIN GRIP',
    badgeType: 'trending',
    desc: 'Water Sipe technology delivering 35% longer tyre longevity with puncture-resistant overlap casing for rough Indian roads.',
    compatibleWith: 'KTM 390 Duke, Dominar 400, Royal Enfield Hunter 350',
    deliveryTime: 'Express 2-Hr Fitting Available',
    inStock: true,
    stockLeft: 22,
  },

  // --- DASHCAM & DASHBOARD SMART ACCESSORIES ---
  {
    id: 'dash-1',
    name: '70mai A810 4K HDR Dual-Vision Smart Car Dashcam with Sony Starvis 2',
    price: 13999,
    originalPrice: 18999,
    rating: 4.96,
    reviewsCount: 1180,
    icon: 'fa-video',
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Accessories',
    section: 'Dashboard & Electronics',
    badge: '4K SONY STARVIS 2',
    badgeType: 'new',
    desc: 'Native true 4K front + 1080P rear HDR recording with built-in GPS logger, ADAS road safety alerts & 24H AI parking buffer surveillance.',
    compatibleWith: 'All Indian Cars, Sedans, SUVs & Commercial Vans',
    deliveryTime: 'Direct Seller Dispatch (Free Installation Voucher)',
    inStock: true,
    stockLeft: 15,
  },
  {
    id: 'dash-2',
    name: 'Bobo Claw-Grip Motorcycle Mobile Mount with Anti-Vibration Dampener',
    price: 1899,
    originalPrice: 2999,
    rating: 4.89,
    reviewsCount: 2450,
    icon: 'fa-mobile-screen',
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Accessories',
    section: 'Dashboard & Electronics',
    badge: 'ANTI-VIBRATION',
    badgeType: 'trending',
    desc: 'Aviation-grade aluminum CNC body with 4 silicone vibration dampers to protect delicate phone camera sensors during rough rides.',
    compatibleWith: 'All Bikes & Scooters (7/8” & 1” Handlebars)',
    deliveryTime: 'Same Day Dispatch by Local Partner',
    inStock: true,
    stockLeft: 65,
  },

  // --- SPARE PARTS: ENGINE & BRAKING ---
  {
    id: 'sp-1',
    name: 'NGK Iridium IX CR9EIX High Performance Laser Spark Plug',
    price: 799,
    originalPrice: 1100,
    rating: 4.92,
    reviewsCount: 1540,
    icon: 'fa-bolt',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Spare Parts',
    section: 'Engine & Internal Components',
    badge: 'OEM GENUINE',
    desc: '0.6mm ultra-fine laser welded Iridium tip ensuring high durability, anti-fouling spark, and crisper throttle pickup.',
    compatibleWith: 'Royal Enfield, Yamaha, KTM, Bajaj, TVS, Honda',
    deliveryTime: 'In Stock • Ships in 24 Hrs',
    inStock: true,
    stockLeft: 85,
  },
  {
    id: 'sp-2',
    name: 'Rolon Brass Coated Heavy Duty Drive Chain & Sprocket Kit',
    price: 2450,
    originalPrice: 3200,
    rating: 4.86,
    reviewsCount: 780,
    icon: 'fa-link',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Spare Parts',
    section: 'Transmission & Clutch System',
    badge: 'O-RING SEALED',
    badgeType: 'bestseller',
    desc: 'Gold brass plated solid bushings with O-ring sealed chain links resisting rust and stretching across high-mileage tours.',
    compatibleWith: 'Royal Enfield Classic 350 / Hunter / Meteor',
    deliveryTime: 'Direct Seller Dispatch',
    inStock: true,
    stockLeft: 34,
  }
];

/* ------------------------------------------------------------------ */
/* 3. ACCESSORIES POINT - LOCAL STORES DIRECTORY (For Modal)          */
/* ------------------------------------------------------------------ */

export interface AccessoriesStorePoint {
  id: string;
  name: string;
  city: string;
  area: string;
  address: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  openStatus: string;
  specialization: string[];
  distance: string;
  mapCoordinates: string;
}

export const ACCESSORIES_POINTS: AccessoriesStorePoint[] = [
  // --- CHENNAI ---
  {
    id: 'acc-chn-1',
    name: 'AutoStyle Mega Accessories & Fitment Hub',
    city: 'Chennai',
    area: 'Anna Nagar West',
    address: 'Plot 42, 2nd Avenue, Near Roundtana, Anna Nagar, Chennai - 600040',
    phone: '+91 98401 22334',
    rating: 4.9,
    reviewsCount: 640,
    openStatus: 'Open Now • Closes 9:30 PM',
    specialization: ['Riding Helmets & Gear', 'Tubeless Tyres & Alloys', '4K Dashcams & Android Audio', 'Custom Lighting & Horns'],
    distance: '1.4 km from you',
    mapCoordinates: '13.0850, 80.2101'
  },
  {
    id: 'acc-chn-sc-1',
    name: 'SART Multi-Brand Authorized Service Center & Bodyshop',
    city: 'Chennai',
    area: 'Guindy Industrial Estate',
    address: 'No. 8 SIDCO Industrial Estate, Near Guindy Metro, Chennai - 600032',
    phone: '+91 94440 12890',
    rating: 4.94,
    reviewsCount: 1420,
    openStatus: 'Open Now • 24x7 Breakdown Service & Bay Booking',
    specialization: ['Authorized Periodic Car & Bike Service', 'Engine Diagnostics & Scan', 'Cashless Accidental Claims', 'Genuine Spares Fitment Center'],
    distance: '2.3 km from you',
    mapCoordinates: '13.0067, 80.2025'
  },
  {
    id: 'acc-chn-2',
    name: 'GP Road MotoSpares & Performance Point',
    city: 'Chennai',
    area: 'Mount Road / GP Road',
    address: '15/2 General Patters Road, Thousand Lights, Chennai - 600002',
    phone: '+91 94440 88771',
    rating: 4.88,
    reviewsCount: 1120,
    openStatus: 'Open Now • Wholesale & Retail Direct Counter',
    specialization: ['OEM Engine & Clutch Spares', 'Brembo / Bosch Brake Kits', 'High Performance Oils & Filters', 'Crash Guards & Touring Luggage'],
    distance: '3.2 km from you',
    mapCoordinates: '13.0610, 80.2642'
  },
  {
    id: 'acc-chn-sc-2',
    name: 'SpeedyCare Two-Wheeler Master Service & Modification Hub',
    city: 'Chennai',
    area: 'T. Nagar',
    address: '45 Venkatnarayana Road, T. Nagar, Chennai - 600017',
    phone: '+91 98411 90876',
    rating: 4.87,
    reviewsCount: 890,
    openStatus: 'Open Now • Closes 8:30 PM',
    specialization: ['Superbike & Commuter Service', 'Fork & Suspension Overhaul', 'Laser Wheel Alignment', 'Free Safety Inspection'],
    distance: '2.8 km from you',
    mapCoordinates: '13.0418, 80.2341'
  },

  // --- BENGALURU ---
  {
    id: 'acc-blr-1',
    name: 'JC Road SpeedSpares & Riding Zone',
    city: 'Bengaluru',
    area: 'JC Road / Kalasipalyam',
    address: '88 JC Road, Automotive Commercial Complex, Bengaluru - 560002',
    phone: '+91 98860 33445',
    rating: 4.92,
    reviewsCount: 950,
    openStatus: 'Open Now • Closes 9:00 PM',
    specialization: ['Axor & MT Certified Helmets', 'Michelin & Apollo Tyres', 'Aux Fog Lights & Goggles', 'Direct Doorstep Dispatch'],
    distance: '2.1 km from you',
    mapCoordinates: '12.9611, 77.5835'
  },
  {
    id: 'acc-blr-sc-1',
    name: 'Indiranagar AutoCare Multi-Brand Service Station',
    city: 'Bengaluru',
    area: 'Indiranagar',
    address: '100ft Road, Near CMH Metro, Indiranagar, Bengaluru - 560038',
    phone: '+91 98450 12345',
    rating: 4.91,
    reviewsCount: 1250,
    openStatus: 'Open Now • Closes 9:30 PM',
    specialization: ['Automated Brake Bleeding & Discs', 'Periodic Scheduled Car/Bike Service', 'AC Gas & Cooling System', 'Genuine OES Parts Depot'],
    distance: '1.2 km from you',
    mapCoordinates: '12.9784, 77.6408'
  },

  // --- MUMBAI ---
  {
    id: 'acc-mum-1',
    name: 'Opera House MotoLuxe Car & Bike Studio',
    city: 'Mumbai',
    area: 'Opera House, Lamington Road',
    address: 'Shop 12, Swadeshi Mills Compound, Charni Road, Mumbai - 400004',
    phone: '+91 98200 44556',
    rating: 4.86,
    reviewsCount: 780,
    openStatus: 'Open Now • Closes 8:30 PM',
    specialization: ['Luxury 7D Footmats', 'GPS Anti-Theft Dashcams', 'Racing Seats & Ergonomics', 'Laser LED Headlights'],
    distance: '2.8 km from you',
    mapCoordinates: '18.9567, 72.8189'
  },
  {
    id: 'acc-mum-sc-1',
    name: 'Andheri West ProCare Master Bodyshop & Service Station',
    city: 'Mumbai',
    area: 'Andheri West',
    address: 'Link Road, Near Infinity Mall, Andheri West, Mumbai - 400053',
    phone: '+91 98201 99887',
    rating: 4.89,
    reviewsCount: 1100,
    openStatus: 'Open Now • 24x7 Roadside & Garage Triage',
    specialization: ['Car & Bike Full Service', 'Engine Overhaul & ECU Scan', 'Ceramic Paint Booth & Detailing', 'Genuine Parts Fitment'],
    distance: '3.1 km from you',
    mapCoordinates: '19.1363, 72.8277'
  }
];
