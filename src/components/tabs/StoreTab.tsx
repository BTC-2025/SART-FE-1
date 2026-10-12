'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import './StoreTab.css';
import { useSartStore } from '@/store/useSartStore';

/* ------------------------------------------------------------------ */
/* Types & Interfaces                                                  */
/* ------------------------------------------------------------------ */

export type EquipmentOption = { name: string; price: number };
export type VehicleType = 'Car' | 'Bike' | 'Auto' | 'Van' | 'Lorry' | 'Bus' | 'EV' | 'Universal';
export type MainCategory = 'All' | 'Spare Parts' | 'Accessories' | 'Maintenance' | 'Wash & Care' | 'Emergency';

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewsCount?: number;
  icon: string;
  image: string;
  vehicle: VehicleType;
  category: MainCategory;
  section: string;
  badge?: string;
  badgeType?: 'new' | 'trending' | 'bestseller' | 'emergency' | 'sale';
  desc: string;
  duration?: string;
  warranty?: string;
  compatibleWith?: string;
  inStock?: boolean;
  stockLeft?: number;
  deliveryTime?: string;
  isService?: boolean;
  includes?: string[];
  equipmentOptions?: EquipmentOption[];
  emergency?: boolean;
}

export interface NearbyStore {
  id: string;
  name: string;
  type: string;
  distance: string;
  rating: number;
  reviews: number;
  address: string;
  phone: string;
  openStatus: string;
  servicesAvailable: string[];
  partsInStock: number;
}

/* ------------------------------------------------------------------ */
/* Universal Vehicle Hierarchy Data (Boodmo / AutoZone / eBay Motors) */
/* ------------------------------------------------------------------ */

const VEHICLE_TYPES = [
  { id: 'Car', label: 'Car / SUV', icon: 'fa-car' },
  { id: 'Bike', label: 'Bike / Scooter', icon: 'fa-motorcycle' },
  { id: 'Auto', label: 'Auto (3-Wheeler)', icon: 'fa-gas-pump' },
  { id: 'Van', label: 'Van / Omni / Eeco', icon: 'fa-van-shuttle' },
  { id: 'Lorry', label: 'Lorry / Truck', icon: 'fa-truck-moving' },
  { id: 'Bus', label: 'Bus / Coach', icon: 'fa-bus' },
  { id: 'EV', label: 'Electric Vehicle (EV)', icon: 'fa-bolt' },
];

const BRANDS_BY_VEHICLE: Record<string, string[]> = {
  Car: [
    'Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Toyota', 
    'Honda', 'Kia', 'Volkswagen', 'Skoda', 'MG Motor', 'Renault', 'Ford'
  ],
  Bike: [
    'Royal Enfield', 'Hero MotoCorp', 'Honda 2Wheelers', 'Bajaj Auto', 
    'TVS Motor', 'Yamaha', 'Suzuki 2Wheelers', 'KTM', 'Jawa / Yezdi', 'Kawasaki'
  ],
  Auto: [
    'Bajaj Auto (RE)', 'Piaggio Ape', 'Mahindra Alfa', 'Atul Auto', 'TVS King'
  ],
  Van: [
    'Maruti Suzuki (Eeco/Omni)', 'Force Motors (Traveller)', 'Tata Motors (Magic/Winger)', 'Mahindra (Bolero Maxi/Supro)'
  ],
  Lorry: [
    'Tata Motors Commercial', 'Ashok Leyland', 'BharatBenz', 'Eicher Motors', 'Mahindra Truck & Bus', 'Volvo Trucks'
  ],
  Bus: [
    'Ashok Leyland', 'Tata Motors Bus', 'Volvo Buses', 'Eicher Buses', 'BharatBenz Buses', 'Force Motors'
  ],
  EV: [
    'Tata.ev (Nexon/Punch/Tiago)', 'Ola Electric', 'Ather Energy', 'MG ZS EV', 'Mahindra XUV400', 'TVS iQube', 'BYD Auto'
  ],
};

const MODELS_BY_BRAND: Record<string, string[]> = {
  'Maruti Suzuki': ['Swift', 'Baleno', 'Brezza', 'Dzire', 'Ertiga', 'Grand Vitara', 'Fronx', 'WagonR', 'Alto K10', 'Ciaz'],
  'Hyundai': ['Creta', 'Venue', 'i20', 'Verna', 'Exter', 'Alcazar', 'Tucson', 'Aura', 'Grand i10 Nios'],
  'Tata Motors': ['Nexon', 'Punch', 'Harrier', 'Safari', 'Tiago', 'Tigor', 'Altroz', 'Curvv'],
  'Mahindra': ['Scorpio-N', 'XUV700', 'Thar / Thar Roxx', 'Bolero Neo', 'XUV 3XO', 'Scorpio Classic'],
  'Toyota': ['Innova Crysta', 'Innova HyCross', 'Fortuner', 'Urban Cruiser Hyryder', 'Glanza', 'Hilux'],
  'Honda': ['City 5th Gen', 'Elevate', 'Amaze', 'WR-V', 'Civic'],
  'Kia': ['Seltos', 'Sonet', 'Carens', 'EV6', 'Carnival'],
  'Volkswagen': ['Virtus', 'Taigun', 'Polo TSI', 'Vento', 'Tiguan'],
  'Skoda': ['Slavia', 'Kushaq', 'Octavia', 'Kodiaq', 'Superb'],
  'MG Motor': ['Hector', 'Astor', 'ZS EV', 'Comet EV', 'Gloster'],
  'Renault': ['Kiger', 'Triber', 'Kwid', 'Duster'],
  'Ford': ['EcoSport', 'Endeavour', 'Figo', 'Aspire'],

  'Royal Enfield': ['Classic 350', 'Hunter 350', 'Meteor 350', 'Himalayan 450', 'Bullet 350', 'Continental GT 650', 'Interceptor 650', 'Shotgun 650'],
  'Hero MotoCorp': ['Splendor Plus', 'HF Deluxe', 'Passion Pro', 'Glamour', 'Xpulse 200 4V', 'Xtreme 160R', 'Destini 125', 'Pleasure Plus'],
  'Honda 2Wheelers': ['Activa 6G / 125', 'Shine 125', 'SP 125', 'Unicorn', 'Dio', 'CB350 Hness', 'Hornet 2.0', 'CBR 650R'],
  'Bajaj Auto': ['Pulsar 150', 'Pulsar NS200', 'Pulsar N160', 'Platina 110', 'Dominar 400', 'Chetak EV', 'Avenger Cruise 220'],
  'TVS Motor': ['Apache RTR 160 4V', 'Apache RTR 200', 'Jupiter 110/125', 'Raider 125', 'Ntorq 125', 'Ronin 225', 'iQube Electric'],
  'Yamaha': ['YZF R15 V4', 'MT-15 V2', 'FZ-S Fi V4', 'Aerox 155', 'RayZR 125 Fi', 'Fazzio'],
  'Suzuki 2Wheelers': ['Access 125', 'Burgman Street', 'Gixxer SF 250', 'Avenis 125', 'V-Strom SX 250'],
  'KTM': ['Duke 200', 'Duke 250', 'Duke 390', 'RC 200', 'RC 390', 'Adventure 390'],
  'Jawa / Yezdi': ['Jawa 42', 'Jawa 350', 'Yezdi Adventure', 'Yezdi Scrambler', 'Yezdi Roadster'],
  'Kawasaki': ['Ninja 300', 'Ninja 400', 'Z650', 'Ninja 650', 'Versys 650'],

  'Bajaj Auto (RE)': ['RE Compact 4S (Petrol/CNG)', 'RE Maxima Cargo', 'Maxima Z Passenger', 'Compact Diesel', 'Qute Quadricycle'],
  'Piaggio Ape': ['Ape City Plus (CNG/Petrol)', 'Ape Auto DX', 'Ape Xtra LDX', 'Ape E-City FX Electric'],
  'Mahindra Alfa': ['Alfa DX Passenger', 'Alfa Load Champion', 'Alfa Plus Diesel', 'Mahindra Treo Electric'],
  'Atul Auto': ['Atul Rik Petrol/CNG', 'Atul Gem Cargo', 'Atul Elite Passenger EV'],
  'TVS King': ['TVS King Deluxe CNG', 'TVS King Duramax', 'TVS King Cargo'],

  'Maruti Suzuki (Eeco/Omni)': ['Eeco 5-Seater Std', 'Eeco 7-Seater AC', 'Eeco Cargo CNG', 'Omni 8-Seater (Legacy)'],
  'Force Motors (Traveller)': ['Traveller 3050 (9-13 Seater)', 'Traveller 3350 (14-17 Seater)', 'Traveller 4020 Super', 'Urbania Luxury MUV'],
  'Tata Motors (Magic/Winger)': ['Tata Magic Express 10-Seater', 'Tata Magic Mantra', 'Tata Winger Tourist/Executive', 'Tata Ace Gold EV/Diesel'],
  'Mahindra (Bolero Maxi/Supro)': ['Bolero Maxi Truck Plus', 'Bolero Camper 4x4', 'Supro Profit Truck Mini', 'Supro Van Passenger'],

  'Tata Motors Commercial': ['Tata 407 Gold SFC', 'Tata 709g LPT', 'Tata Signa 2823.K Tipper', 'Tata Signa 4825.T Heavy Truck', 'Tata Ultra T.7', 'Tata Prima 3530.K'],
  'Ashok Leyland': ['Dost+ / Bada Dost i4', 'Ecomet 1215 HE', 'Partner 6 Tyre', 'AVTR 2820 Multi-Axle', 'Captain 3123 Tipper', 'Taurus 2518'],
  'BharatBenz': ['1217C Tipper', '1617R Medium Rigid', '2823R Multi-Axle', '3528C Mining Tipper', '5528TT Tractor Trailer'],
  'Eicher Motors': ['Pro 2049 City Truck', 'Pro 3015 Medium Truck', 'Pro 6028 Tipper', 'Pro 8035XM Heavy Haulage'],
  'Mahindra Truck & Bus': ['Furio 7 Cargo', 'Furio 11 Heavy', 'Blazo X 28 Tipper', 'Blazo X 35 Haulage', 'Blazo X 49 Tractor Trailer'],
  'Volvo Trucks': ['Volvo FMX 460 Mining Tipper', 'Volvo FM 420 Puller', 'Volvo FH 520 Heavy Heavy'],

  'Ashok Leyland Bus': ['Viking Passenger Chassis', 'Oyster School/Staff Bus', 'Freedom 42-Seater', 'MiTR Mini Bus'],
  'Tata Motors Bus': ['Starbus Ultra 34-Seater', 'LP 410 Bus Chassis', 'Starbus EV City Electric', 'Marcopolo Luxury Coach'],
  'Volvo Buses': ['Volvo 9400 B11R Multi-Axle', 'Volvo 9600 Intercity Luxury Coach', 'Volvo 8400 Low Floor City AC'],
  'Eicher Buses': ['Skyline Pro 3009', 'Starline 20.15', 'Route Star 24 Seater'],
  'BharatBenz Buses': ['1624 School/Tourist Bus', '917 Commuter Bus', '1017 Tourism AC'],
  'Force Motors Bus': ['Cruiser Deluxe', 'Citiline 10-Seater', 'Traveller Smart School Bus'],

  'Tata.ev (Nexon/Punch/Tiago)': ['Nexon EV Long Range 45kWh', 'Punch EV Empowered', 'Tiago EV XT/XZ+', 'Tigor EV Tech', 'Curvv EV 55kWh'],
  'Ola Electric': ['Ola S1 Pro Gen 2', 'Ola S1 Air', 'Ola S1 X+ (3kWh)', 'Roadster Pro EV Motorcycle'],
  'Ather Energy': ['Ather 450X 3.7kWh', 'Ather 450S 2.9kWh', 'Ather Rizta Family Scooter'],
  'MG ZS EV': ['MG ZS EV Excite', 'MG ZS EV Exclusive Pro ADAS'],
  'Mahindra XUV400': ['XUV400 Pro EL 39.4kWh', 'XUV400 EC 34.5kWh'],
  'TVS iQube': ['TVS iQube S 3.4kWh', 'TVS iQube ST 5.1kWh'],
  'BYD Auto': ['BYD Atto 3 Extended Range', 'BYD Seal Premium AWD', 'BYD e6 MPV'],
};

const YEARS_LIST = [
  '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2012', '2010', '2008 & Older'
];

/* ------------------------------------------------------------------ */
/* Nearby Stores & Partner Hubs Data                                  */
/* ------------------------------------------------------------------ */

const NEARBY_STORES: NearbyStore[] = [
  {
    id: 'store-1',
    name: 'SART Express Indiranagar Hub',
    type: 'Authorized Mega Store & Fitment Garage',
    distance: '1.2 km away',
    rating: 4.9,
    reviews: 428,
    address: '100ft Road, Near CMH Metro, Indiranagar, Bengaluru',
    phone: '+91 98450 12345',
    openStatus: 'Open Now • Closes 10:00 PM',
    servicesAvailable: ['Free Fitment', 'Diagnostic Scan', 'Instant Pickup (15 Mins)', 'AC Service'],
    partsInStock: 3450,
  },
  {
    id: 'store-2',
    name: 'Koramangala AutoZone & Spare Hub',
    type: 'Premier Multi-Vehicle Parts Center',
    distance: '2.8 km away',
    rating: 4.8,
    reviews: 612,
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
    phone: '+91 98451 98765',
    openStatus: 'Open Now • Closes 9:30 PM',
    servicesAvailable: ['Wheel Alignment', 'Oil Change Bay', 'Genuine Parts Pickup', 'Battery Exchange'],
    partsInStock: 4890,
  },
  {
    id: 'store-3',
    name: 'Whitefield Heavy Fleet & Car World',
    type: 'Cars, Commercial Trucks & Bus Depot',
    distance: '5.4 km away',
    rating: 4.7,
    reviews: 295,
    address: 'ITPL Main Road, Hope Farm Junction, Whitefield',
    phone: '+91 98452 44332',
    openStatus: 'Open 24x7 Emergency Depot',
    servicesAvailable: ['Heavy Commercial Spares', 'Lorry & Bus Fitment', '24x7 Roadside Dispatch', 'EV Fast Charging'],
    partsInStock: 8200,
  },
  {
    id: 'store-4',
    name: 'HSR Layout Bosch & Two-Wheeler Junction',
    type: 'Bike & Car Express Workshop',
    distance: '3.9 km away',
    rating: 4.85,
    reviews: 380,
    address: '27th Main Road, Sector 1, HSR Layout, Bengaluru',
    phone: '+91 98453 11223',
    openStatus: 'Open Now • Closes 9:00 PM',
    servicesAvailable: ['Superbike Tuning', 'Suspension Overhaul', 'Ceramic Detailing Bay'],
    partsInStock: 2600,
  },
];

/* ------------------------------------------------------------------ */
/* 1. NEW LAUNCH PRODUCTS DATA (Scrollable carousel with arrows)      */
/* ------------------------------------------------------------------ */

const NEW_LAUNCH_PRODUCTS: StoreProduct[] = [
  {
    id: 'nl-1',
    name: 'SART Ultra 4K Dual Dashcam with ADAS & Night Vision',
    price: 4999,
    originalPrice: 8499,
    rating: 4.9,
    reviewsCount: 142,
    icon: 'fa-video',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Accessories',
    section: 'New Launch',
    badge: 'NEW LAUNCH 2026',
    badgeType: 'new',
    desc: 'Dual Sony Starvis 2 sensors, 4K front + 1080p rear recording with built-in GPS tracker and 24H parking impact monitor.',
    compatibleWith: 'Universal Cars, Vans & Lorries',
    deliveryTime: 'Today in 2 Hours',
    inStock: true,
    stockLeft: 12,
  },
  {
    id: 'nl-2',
    name: 'Solar Smart TPMS Tyre Pressure Monitor (Internal / External)',
    price: 1899,
    originalPrice: 3299,
    rating: 4.8,
    reviewsCount: 96,
    icon: 'fa-gauge-high',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Universal',
    category: 'Accessories',
    section: 'New Launch',
    badge: 'JUST ARRIVED',
    badgeType: 'new',
    desc: 'Real-time wireless solar display for tyre temperature, leak detection & psi pressure with instant audible alarm.',
    compatibleWith: 'Cars, Bikes, Vans & Autos',
    deliveryTime: 'Express Next-Day',
    inStock: true,
    stockLeft: 18,
  },
  {
    id: 'nl-3',
    name: 'SART 7.4kW Smart EV Portable Charger (Type 2, 32A)',
    price: 14500,
    originalPrice: 22000,
    rating: 4.95,
    reviewsCount: 68,
    icon: 'fa-bolt',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=80',
    vehicle: 'EV',
    category: 'Accessories',
    section: 'New Launch',
    badge: 'INNOVATION',
    badgeType: 'new',
    desc: 'IP67 waterproof smart charger with LCD display, current adjustment (10A-32A), timer, and surge leakage protection.',
    compatibleWith: 'Tata.ev, MG ZS EV, Mahindra XUV400, BYD, Hyundai Ioniq',
    deliveryTime: 'Free Express Delivery',
    inStock: true,
    stockLeft: 7,
  },
  {
    id: 'nl-4',
    name: 'Laser Matrix LED Headlight Bulbs 160W (6500K Crystal White)',
    price: 2499,
    originalPrice: 4500,
    rating: 4.85,
    reviewsCount: 114,
    icon: 'fa-lightbulb',
    image: 'https://images.unsplash.com/photo-1503376710356-70d6943f65e2?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Spare Parts',
    section: 'New Launch',
    badge: 'NEW 2026 GEN',
    badgeType: 'new',
    desc: 'Canbus error-free 30,000 Lumens plug-and-play LED bulbs with copper cooling tubes. 300% brighter throw than halogen.',
    compatibleWith: 'H4, H7, H11, 9005 Socket Compatible',
    deliveryTime: 'Same Day Delivery',
    inStock: true,
    stockLeft: 24,
  },
  {
    id: 'nl-5',
    name: 'Heavy Duty Jump Starter 24000mAh with Digital Inflator',
    price: 4299,
    originalPrice: 6999,
    rating: 4.9,
    reviewsCount: 88,
    icon: 'fa-car-battery',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Universal',
    category: 'Emergency',
    section: 'New Launch',
    badge: 'ALL-IN-ONE RESCUE',
    badgeType: 'new',
    desc: 'Starts up to 8.0L Petrol / 6.5L Diesel engines up to 40 times on single charge. Includes 150 PSI auto air compressor.',
    compatibleWith: 'Cars, Trucks, Bikes, Autos & Boats',
    deliveryTime: 'Today in 2 Hours',
    inStock: true,
    stockLeft: 9,
  },
  {
    id: 'nl-6',
    name: 'Graphene Ceramic Coating 10H Shield Protection (50ml Kit)',
    price: 1999,
    originalPrice: 3800,
    rating: 4.75,
    reviewsCount: 52,
    icon: 'fa-wand-magic-sparkles',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Wash & Care',
    section: 'New Launch',
    badge: 'NANO TECH',
    badgeType: 'new',
    desc: '5+ Years hydrophobic protection against UV rays, acid rain, swirl marks, bird droppings, and highway scratches.',
    compatibleWith: 'All Paintwork, Alloys & Glass Surfaces',
    deliveryTime: 'Express 1-Day Delivery',
    inStock: true,
    stockLeft: 15,
  },
  {
    id: 'nl-7',
    name: 'Bosch Aerotwin Frameless Silicon Wiper Blades (Pair)',
    price: 1250,
    originalPrice: 1950,
    rating: 4.8,
    reviewsCount: 203,
    icon: 'fa-shield-halved',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Spare Parts',
    section: 'New Launch',
    badge: 'GERMAN OEM',
    badgeType: 'new',
    desc: 'Patented Power Protection Plus coating for streak-free crystal vision during heavy monsoon driving at high speeds.',
    compatibleWith: 'All Indian Hatchbacks, Sedans & SUVs',
    deliveryTime: 'Available at Nearby Store',
    inStock: true,
    stockLeft: 35,
  },
];

/* ------------------------------------------------------------------ */
/* 2. TRENDING PRODUCTS DATA (Scrollable carousel with arrows)        */
/* ------------------------------------------------------------------ */

const TRENDING_PRODUCTS: StoreProduct[] = [
  {
    id: 'tr-1',
    name: 'Motul 7100 4T 10W-50 Fully Synthetic Bike Engine Oil (1.5L)',
    price: 1150,
    originalPrice: 1520,
    rating: 4.95,
    reviewsCount: 1420,
    icon: 'fa-oil-can',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Spare Parts',
    section: 'Trending Products',
    badge: 'TRENDING #1',
    badgeType: 'trending',
    desc: '100% Ester synthetic oil engineered for high-performance bikes. Superior gearbox protection and smooth clutch response.',
    compatibleWith: 'Royal Enfield, KTM Duke, Dominar, Pulsar, Apache',
    deliveryTime: '2-Hr Express Pickup',
    inStock: true,
    stockLeft: 42,
  },
  {
    id: 'tr-2',
    name: 'Brembo Ceramic High-Friction Front Brake Pads Kit',
    price: 2100,
    originalPrice: 3100,
    rating: 4.9,
    reviewsCount: 520,
    icon: 'fa-stop',
    image: 'https://c8.alamy.com/comp/T2X4GH/front-brake-discs-with-caliper-and-brake-pads-in-the-car-on-a-car-lift-in-a-workshop-T2X4GH.jpg',
    vehicle: 'Car',
    category: 'Spare Parts',
    section: 'Trending Products',
    badge: '100% GENUINE OES',
    badgeType: 'trending',
    desc: 'Ceramic composite friction material formulated for zero brake squeal, reduced dust, and razor-sharp stopping distances.',
    compatibleWith: 'Swift, Baleno, Creta, Nexon, City, Seltos',
    deliveryTime: 'Free Fitting at Store',
    inStock: true,
    stockLeft: 14,
  },
  {
    id: 'tr-3',
    name: 'Castrol EDGE 5W-40 Advanced Full Synthetic Engine Oil (4L)',
    price: 2850,
    originalPrice: 3900,
    rating: 4.88,
    reviewsCount: 910,
    icon: 'fa-oil-can',
    image: 'https://images.unsplash.com/photo-1635787687258-2900bcbd2e60?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Spare Parts',
    section: 'Trending Products',
    badge: 'TITANIUM FST',
    badgeType: 'trending',
    desc: 'Engineered with Fluid Titanium technology to transform under extreme engine pressures and double film strength.',
    compatibleWith: 'Petrol & Diesel Passenger Vehicles',
    deliveryTime: 'Today in 2 Hours',
    inStock: true,
    stockLeft: 22,
  },
  {
    id: 'tr-4',
    name: 'Universal Waterproof 4G GPS Tracker with Remote Engine Cut-Off',
    price: 1999,
    originalPrice: 3499,
    rating: 4.82,
    reviewsCount: 680,
    icon: 'fa-location-crosshairs',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Universal',
    category: 'Accessories',
    section: 'Trending Products',
    badge: 'HOT SELLER',
    badgeType: 'trending',
    desc: 'Live vehicle tracking, geo-fencing, ignition alerts, and emergency remote fuel/engine kill via Android/iOS app.',
    compatibleWith: 'Cars, Bikes, Autos, Trucks & Vans',
    deliveryTime: 'Free Home Delivery',
    inStock: true,
    stockLeft: 19,
  },
  {
    id: 'tr-5',
    name: 'Amaron Pro Hi-Life Sealed Maintenance-Free Battery (DIN65 / 12V)',
    price: 5200,
    originalPrice: 6800,
    rating: 4.92,
    reviewsCount: 840,
    icon: 'fa-car-battery',
    image: 'https://images.unsplash.com/photo-1616781297597-402927d780ba?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Spare Parts',
    section: 'Trending Products',
    badge: '60 MOS WARRANTY',
    badgeType: 'trending',
    desc: 'Silven X alloy technology with high cranking power. Zero maintenance, heat resistant, and free doorstep replacement.',
    compatibleWith: 'Sedans, Compact SUVs & Diesel Cars',
    deliveryTime: 'Doorstep Fitment in 45m',
    inStock: true,
    stockLeft: 11,
  },
  {
    id: 'tr-6',
    name: 'Michelin Primacy 4 High Grip All-Weather Radial Tyre (195/65 R15)',
    price: 5600,
    originalPrice: 7200,
    rating: 4.91,
    reviewsCount: 460,
    icon: 'fa-circle-notch',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Spare Parts',
    section: 'Trending Products',
    badge: 'PREMIUM GRIP',
    badgeType: 'trending',
    desc: 'Silent rib technology with EverGrip wet braking performance. Exceptional tyre life and fuel economy.',
    compatibleWith: 'Honda City, Swift, Verna, Rapid, Dzire',
    deliveryTime: 'Free Alignment at Hub',
    inStock: true,
    stockLeft: 16,
  },
  {
    id: 'tr-7',
    name: 'Heavy Commercial Lorry Air Brake Chamber Type 24/30 Double Diaphragm',
    price: 3400,
    originalPrice: 4800,
    rating: 4.86,
    reviewsCount: 195,
    icon: 'fa-truck',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Lorry',
    category: 'Spare Parts',
    section: 'Trending Products',
    badge: 'HEAVY FLEET',
    badgeType: 'trending',
    desc: 'Reinforced spring brake chamber for heavy load braking safety. Heavy corrosion-resistant electrostatic finish.',
    compatibleWith: 'Tata 2518/3118, Ashok Leyland Taurus, Eicher Pro',
    deliveryTime: 'Available at Whitefield Hub',
    inStock: true,
    stockLeft: 25,
  },
];

/* ------------------------------------------------------------------ */
/* 3. TOP SELLING PRODUCTS DATA (Scrollable carousel with arrows)     */
/* ------------------------------------------------------------------ */

const TOP_SELLING_PRODUCTS: StoreProduct[] = [
  {
    id: 'ts-1',
    name: 'Universal MagSafe Wireless Fast Charging Auto Phone Mount (15W)',
    price: 1399,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 3200,
    icon: 'fa-mobile-screen-button',
    image: 'https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Universal',
    category: 'Accessories',
    section: 'Top Selling Products',
    badge: 'BESTSELLER #1',
    badgeType: 'bestseller',
    desc: 'Strong N52 neodymium magnets with smart clamping sensor, cooling fan, and 360-degree rotation ball joint for AC vent/dash.',
    compatibleWith: 'All Smartphones & All Vehicles',
    deliveryTime: 'Instant 2-Hr Delivery',
    inStock: true,
    stockLeft: 70,
  },
  {
    id: 'ts-2',
    name: 'Roots Windtone 90 High-Decibel Dual Horn Set (Original)',
    price: 950,
    originalPrice: 1450,
    rating: 4.88,
    reviewsCount: 2450,
    icon: 'fa-bullhorn',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Universal',
    category: 'Accessories',
    section: 'Top Selling Products',
    badge: 'GOLD CHOICE',
    badgeType: 'bestseller',
    desc: 'Original European tone dual electric horns with water spray resistant grill. Loud, clear penetrating sound.',
    compatibleWith: 'Cars, Bikes, Autos, Vans & Commercial Lorries',
    deliveryTime: 'Same Day Delivery',
    inStock: true,
    stockLeft: 50,
  },
  {
    id: 'ts-3',
    name: '3M Complete Automotive Foam Wash & Quick Wax Spray Combo',
    price: 749,
    originalPrice: 1199,
    rating: 4.85,
    reviewsCount: 1980,
    icon: 'fa-spray-can',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Universal',
    category: 'Wash & Care',
    section: 'Top Selling Products',
    badge: 'OVER 2,000+ SOLD',
    badgeType: 'bestseller',
    desc: 'pH-balanced rich suds shampoo + Carnauba quick detailing wax spray with microfiber cloth for showroom shine.',
    compatibleWith: 'Cars, Bikes, Vans & Autos',
    deliveryTime: 'Today in 2 Hours',
    inStock: true,
    stockLeft: 85,
  },
  {
    id: 'ts-4',
    name: 'Heavy Duty Tubeless Tyre Puncture Repair Kit with 20 Strip Plugs & Tool',
    price: 399,
    originalPrice: 799,
    rating: 4.8,
    reviewsCount: 4100,
    icon: 'fa-screwdriver-wrench',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Universal',
    category: 'Emergency',
    section: 'Top Selling Products',
    badge: 'EMERGENCY MUST-HAVE',
    badgeType: 'bestseller',
    desc: 'All-metal T-handle rasp and split-eye needle with 20 vulcanized rubber strings and lube for instant roadside fix.',
    compatibleWith: 'All Tubeless Tyres (Bike, Car, Van, Lorry)',
    deliveryTime: 'Express Delivery',
    inStock: true,
    stockLeft: 120,
  },
  {
    id: 'ts-5',
    name: 'Liqui Moly Ceratec Ceramic Engine Wear Protection Additive (300ml)',
    price: 2200,
    originalPrice: 2850,
    rating: 4.96,
    reviewsCount: 1650,
    icon: 'fa-flask',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Spare Parts',
    section: 'Top Selling Products',
    badge: 'MADE IN GERMANY',
    badgeType: 'bestseller',
    desc: 'Micro-ceramic solid lubricant suspension reduces friction, engine noise, and fuel consumption for up to 50,000 km.',
    compatibleWith: 'All Gasoline, Diesel & Turbocharged Engines',
    deliveryTime: 'Available at Nearby Store',
    inStock: true,
    stockLeft: 30,
  },
  {
    id: 'ts-6',
    name: 'Bosch High-Efficiency Spin-On Engine Oil Filter',
    price: 320,
    originalPrice: 480,
    rating: 4.92,
    reviewsCount: 3800,
    icon: 'fa-filter',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Spare Parts',
    section: 'Top Selling Products',
    badge: '99% FILTRATION',
    badgeType: 'bestseller',
    desc: 'Synthetic blend media traps 99% of harmful dirt and metal shavings. Silicone anti-drainback valve protects engine starts.',
    compatibleWith: 'Maruti, Hyundai, Tata, Honda, Mahindra',
    deliveryTime: 'Today in 2 Hours',
    inStock: true,
    stockLeft: 150,
  },
  {
    id: 'ts-7',
    name: 'Piaggio Ape & Bajaj RE Heavy Clutch Plate & Friction Disc Set',
    price: 1100,
    originalPrice: 1650,
    rating: 4.84,
    reviewsCount: 920,
    icon: 'fa-gears',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Auto',
    category: 'Spare Parts',
    section: 'Top Selling Products',
    badge: 'COMMERCIAL GRADE',
    badgeType: 'bestseller',
    desc: 'High-torque heat resistant friction material designed for commercial 3-wheelers carrying passenger & cargo loads.',
    compatibleWith: 'Bajaj RE Compact, Piaggio Ape, Mahindra Alfa',
    deliveryTime: '2-Hr Pickup at Hub',
    inStock: true,
    stockLeft: 40,
  },
];

/* ------------------------------------------------------------------ */
/* 4. COMPREHENSIVE SERVICE & SPARE CATALOG (Multi-vehicle catalog)   */
/* ------------------------------------------------------------------ */

const CATALOG_ITEMS: StoreProduct[] = [
  {
    id: 'srv-1',
    name: 'Periodic Periodic Engine Oil & Filter Service',
    price: 1999,
    originalPrice: 2800,
    rating: 4.9,
    reviewsCount: 1840,
    icon: 'fa-oil-can',
    image: 'https://crawfordsautoservice.com/wp-content/uploads/2020/03/service-writer-auto-repair.jpg',
    vehicle: 'Car',
    category: 'Maintenance',
    section: 'Maintenance & Service Packages',
    badge: 'MOST POPULAR',
    badgeType: 'bestseller',
    desc: 'Includes synthetic oil flush, new OEM filter, 40-point vehicle safety health audit, and brake cleaning.',
    duration: '2.5 Hrs',
    warranty: '6 Months / 5,000 km Warranty',
    isService: true,
    includes: ['Engine oil change (3.5L)', 'New OEM Oil Filter', 'Air filter blowout', 'Coolant top-up', 'Battery voltage scan', 'Brake pad inspection'],
    equipmentOptions: [
      { name: 'Upgrade to 100% Synthetic Motul/Castrol (3.5L)', price: 1200 },
      { name: 'New Cabin AC Pollen Filter', price: 450 },
      { name: 'Wiper Fluid Additive Concentrate', price: 150 },
    ],
  },
  {
    id: 'srv-2',
    name: 'Front & Rear Brake Overhaul with Caliper Bleed',
    price: 1499,
    originalPrice: 2200,
    rating: 4.88,
    reviewsCount: 750,
    icon: 'fa-disc-drive',
    image: 'https://c8.alamy.com/comp/T2X4GH/front-brake-discs-with-caliper-and-brake-pads-in-the-car-on-a-car-lift-in-a-workshop-T2X4GH.jpg',
    vehicle: 'Car',
    category: 'Maintenance',
    section: 'Maintenance & Service Packages',
    badge: 'SAFETY CRITICAL',
    badgeType: 'sale',
    desc: 'Complete inspection of discs, calipers, brake fluid boiling point, and piston lubrication for responsive stopping.',
    duration: '2 Hrs',
    warranty: '1 Year Warranty',
    isService: true,
    includes: ['Brake caliper cleaning', 'Rotor resurfacing check', 'DOT 4 Fluid Bleed', 'Handbrake adjustment'],
    equipmentOptions: [
      { name: 'New Front Brembo Ceramic Pads', price: 1800 },
      { name: 'DOT 4 Brake Fluid Flush (500ml)', price: 350 },
      { name: 'Rear Brake Shoe Set', price: 950 },
    ],
  },
  {
    id: 'srv-3',
    name: 'Comprehensive AC Deep Sanitization & Gas Recharge',
    price: 2200,
    originalPrice: 3500,
    rating: 4.85,
    reviewsCount: 620,
    icon: 'fa-snowflake',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Maintenance',
    section: 'Maintenance & Service Packages',
    desc: 'R134a refrigerant gas vacuum recharge, compressor oil replacement, condenser pressure wash, and antibacterial vent misting.',
    duration: '3 Hrs',
    warranty: '100% Chilling Guaranteed',
    isService: true,
    includes: ['AC Gas Top-Up (R134a)', 'Compressor Oil (100ml)', 'Condenser Deep Wash', 'Ozone Cabin Sterilization'],
    equipmentOptions: [
      { name: 'High-Flow Cabin Pollen Filter', price: 500 },
      { name: 'Cooling Coil Disinfection Foam', price: 600 },
    ],
  },
  {
    id: 'srv-4',
    name: 'Bike Super Service & Chain Sprocket Overhaul',
    price: 799,
    originalPrice: 1200,
    rating: 4.92,
    reviewsCount: 1420,
    icon: 'fa-motorcycle',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Maintenance',
    section: 'Two-Wheeler & Scooter Solutions',
    badge: 'BIKE SPECIAL',
    badgeType: 'trending',
    desc: 'Complete 32-point inspection, carburettor/FI tuning, spark plug cleaning, clutch play adjustment, and chain tension lube.',
    duration: '1.5 Hrs',
    warranty: '3 Months Warranty',
    isService: true,
    includes: ['Engine oil change', 'Chain degreasing & lube', 'Spark plug gapping', 'Brake drum/disc wash', 'Tappet adjustment'],
    equipmentOptions: [
      { name: 'Motul 7100 Fully Synthetic Oil (1L)', price: 850 },
      { name: 'New NGK Iridium Spark Plug', price: 350 },
      { name: 'Rolon Chain & Sprocket Set', price: 1600 },
    ],
  },
  {
    id: 'srv-5',
    name: '24x7 Emergency Highway Breakdown Towing & Recovery',
    price: 1499,
    originalPrice: 2500,
    rating: 4.98,
    reviewsCount: 3100,
    icon: 'fa-truck-pickup',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Universal',
    category: 'Emergency',
    section: 'Emergency & Roadside Assistance',
    badge: '24/7 RAPID DISPATCH',
    badgeType: 'emergency',
    emergency: true,
    desc: 'Guaranteed 25-minute dispatch. Flatbed and wheel-lift towing for cars, bikes, autos, and commercial transport.',
    duration: '25 Mins Arrival',
    warranty: 'Damage-Free Tow Guarantee',
    isService: true,
    includes: ['Up to 15 km towing included', 'Hydraulic flatbed recovery', 'Trained roadside crew', 'Free mechanic triage on spot'],
    equipmentOptions: [
      { name: 'Emergency Jump Start Battery Kit', price: 500 },
      { name: 'Roadside Fuel Delivery (5 Litres)', price: 650 },
    ],
  },
  {
    id: 'srv-6',
    name: 'Lorry & Heavy Commercial Multi-Point Fleet Diagnostics',
    price: 3500,
    originalPrice: 5000,
    rating: 4.8,
    reviewsCount: 210,
    icon: 'fa-truck-moving',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Lorry',
    category: 'Maintenance',
    section: 'Fleet & Heavy Commercial Solutions',
    badge: 'FLEET READY',
    badgeType: 'new',
    desc: 'Heavy diesel engine computerized scan, air brake system test, leaf spring suspension check, and differential oil check.',
    duration: '4 Hrs',
    warranty: 'Commercial Fleet Certification',
    isService: true,
    includes: ['OBD-II Heavy Protocol Scanner', 'Air compressor & tank pressure test', 'Greasing 28 points', 'Transmission fluid inspection'],
    equipmentOptions: [
      { name: 'Heavy Duty 15L Diesel Engine Oil', price: 3200 },
      { name: 'Fleet Primary & Secondary Fuel Filter Set', price: 1400 },
    ],
  },
  {
    id: 'srv-7',
    name: '3-Wheeler Auto Complete Mechanical Tuning & CNG Inspection',
    price: 850,
    originalPrice: 1300,
    rating: 4.85,
    reviewsCount: 640,
    icon: 'fa-gas-pump',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Auto',
    category: 'Maintenance',
    section: 'Auto & 3-Wheeler Commercial Solutions',
    badge: 'MAX MILEAGE',
    badgeType: 'sale',
    desc: 'CNG leakage sniff test, high pressure valve tuning, clutch plate tension setup, differential oil top-up, and brake adjustment.',
    duration: '1.5 Hrs',
    warranty: 'Mileage Guarantee',
    isService: true,
    includes: ['CNG gas safety leak check', 'Engine tuning for maximum mileage', 'Brake shoe cleaning', 'Front fork grease injection'],
    equipmentOptions: [
      { name: 'Spark Plug & Cable Replacement', price: 280 },
      { name: 'Castrol 20W-50 CNG Engine Oil (2.5L)', price: 650 },
    ],
  },
  {
    id: 'srv-8',
    name: 'Showroom Mirror Ceramic Polish & 5-Layer Deep Steam Wash',
    price: 2499,
    originalPrice: 4200,
    rating: 4.93,
    reviewsCount: 880,
    icon: 'fa-car-burst',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Wash & Care',
    section: 'Detailing, Polish & Wash Care',
    badge: 'PREMIUM FINISH',
    badgeType: 'bestseller',
    desc: 'Underbody high pressure chassis wash, 3-stage exterior dual-action foam polish, interior steam disinfection, and engine bay dressing.',
    duration: '3.5 Hrs',
    warranty: 'Guaranteed 90-Day Gloss',
    isService: true,
    includes: ['Snow foam active wash', 'Clay bar decontamination', 'Dual-action machine polish', 'Leather/Fabric upholstery steam extract', 'Tyre & trim ceramic gloss'],
    equipmentOptions: [
      { name: 'Rain-X Windshield Hydrophobic Treatment', price: 400 },
      { name: 'Headlight Fog & Yellowing Restoration', price: 600 },
    ],
  },
];

const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

/* ------------------------------------------------------------------ */
/* Component Implementation                                           */
/* ------------------------------------------------------------------ */

export default function StoreTab() {
  const { activeTab, addToCart, wishlist, toggleWishlist } = useSartStore();

  const [mounted, setMounted] = useState(false);

  // Top Vehicle Selector State
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('Car');
  const [selectedBrand, setSelectedBrand] = useState<string>('Maruti Suzuki');
  const [selectedModel, setSelectedModel] = useState<string>('Swift');
  const [selectedYear, setSelectedYear] = useState<string>('2023');
  const [selectedFuel, setSelectedFuel] = useState<string>('Petrol');

  // Garage Selection Active Flag
  const [garageActive, setGarageActive] = useState<boolean>(true);

  // Store fulfillment mode: 'delivery' vs 'nearby'
  const [fulfillmentMode, setFulfillmentMode] = useState<'delivery' | 'nearby'>('delivery');
  const [showStoreLocatorModal, setShowStoreLocatorModal] = useState<boolean>(false);
  const [preferredStore, setPreferredStore] = useState<NearbyStore>(NEARBY_STORES[0]);

  // Search & Category Filters
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MainCategory>('All');

  // Equipment add-on selection for services
  const [selectedEquipment, setSelectedEquipment] = useState<Record<string, string[]>>({});
  const [customVehicleNote, setCustomVehicleNote] = useState<Record<string, string>>({});
  const [expandedIncludes, setExpandedIncludes] = useState<Record<string, boolean>>({});
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

  // Carousel references for scrolling with left and right buttons
  const newLaunchRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
  const topSellingRef = useRef<HTMLDivElement>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update brand options when vehicle type changes
  const availableBrands = useMemo(() => {
    return BRANDS_BY_VEHICLE[selectedVehicleType] || ['Universal Brands'];
  }, [selectedVehicleType]);

  // Update model options when brand changes
  const availableModels = useMemo(() => {
    return MODELS_BY_BRAND[selectedBrand] || ['All Models / Universal'];
  }, [selectedBrand]);

  // When vehicle type changes, sync brand and model
  const handleVehicleTypeChange = (type: string) => {
    setSelectedVehicleType(type);
    const brands = BRANDS_BY_VEHICLE[type] || [];
    const firstBrand = brands[0] || 'Universal';
    setSelectedBrand(firstBrand);
    const models = MODELS_BY_BRAND[firstBrand] || [];
    setSelectedModel(models[0] || 'All Models');
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const models = MODELS_BY_BRAND[brand] || [];
    setSelectedModel(models[0] || 'All Models');
  };

  const handleApplyVehicleSearch = () => {
    setGarageActive(true);
    showToast(`Vehicle configured: ${selectedYear} ${selectedBrand} ${selectedModel} (${selectedVehicleType})`);
  };

  const handleResetVehicle = () => {
    setSelectedVehicleType('Car');
    setSelectedBrand('Maruti Suzuki');
    setSelectedModel('Swift');
    setSelectedYear('2023');
    setGarageActive(false);
  };

  // Scroll carousel helper
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Equipment add-on calculations
  const getSelectedEquipmentItems = (product: StoreProduct) => {
    return (product.equipmentOptions || []).filter((opt) =>
      (selectedEquipment[product.id] ?? []).includes(opt.name)
    );
  };

  const getProductTotalPrice = (product: StoreProduct) => {
    const addOnsTotal = getSelectedEquipmentItems(product).reduce((sum, o) => sum + o.price, 0);
    return product.price + addOnsTotal;
  };

  const toggleEquipmentOption = (productId: string, optionName: string) => {
    setSelectedEquipment((prev) => {
      const current = prev[productId] ?? [];
      const updated = current.includes(optionName)
        ? current.filter((n) => n !== optionName)
        : [...current, optionName];
      return { ...prev, [productId]: updated };
    });
  };

  // Add to cart handler
  const handleAddToCart = (product: StoreProduct) => {
    const chosenAddOns = getSelectedEquipmentItems(product);
    const userModelNote = customVehicleNote[product.id]?.trim();
    const vehicleSpec = garageActive ? `${selectedBrand} ${selectedModel} (${selectedYear})` : '';

    const details = [
      product.name,
      vehicleSpec ? `Vehicle: ${vehicleSpec}` : '',
      userModelNote ? `Note: ${userModelNote}` : '',
      chosenAddOns.length ? `Add-ons: ${chosenAddOns.map((a) => a.name).join(', ')}` : '',
      fulfillmentMode === 'nearby' ? `Pickup: ${preferredStore.name}` : 'Home Delivery',
    ]
      .filter(Boolean)
      .join(' | ');

    addToCart({
      id: `${product.id}-${Date.now()}`,
      name: details,
      price: getProductTotalPrice(product),
      icon: product.icon || 'fa-box',
      category: product.category,
      quantity: 1,
    });

    showToast(`Added to Cart: ${product.name}`);

    // Trigger cart modal
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openReactModal', { detail: 'modal-cart' }));
    }
  };

  // Filtered Catalog products
  const filteredCatalog = useMemo(() => {
    const q = search.trim().toLowerCase();

    return CATALOG_ITEMS.filter((item) => {
      const matchCat =
        activeCategory === 'All' ||
        (activeCategory === 'Spare Parts' && item.category === 'Spare Parts') ||
        (activeCategory === 'Accessories' && item.category === 'Accessories') ||
        (activeCategory === 'Maintenance' && item.category === 'Maintenance') ||
        (activeCategory === 'Wash & Care' && item.category === 'Wash & Care') ||
        (activeCategory === 'Emergency' && item.category === 'Emergency');

      const matchQuery =
        !q ||
        `${item.name} ${item.desc} ${item.vehicle} ${item.category} ${item.section} ${item.includes?.join(' ') || ''}`
          .toLowerCase()
          .includes(q);

      return matchCat && matchQuery;
    });
  }, [activeCategory, search]);

  if (!mounted) return null;

  return (
    <section className={`tab-screen ${activeTab === 'store' ? 'active' : ''}`} id="tab-store">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="store-toast-alert animate-pop">
          <i className="fa-solid fa-circle-check"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP CLEAN WHITE HEADER: NEARBY LOCATION BASED CHOOSER + VEHICLE SELECTOR */}
      <div className="store-top-bar-clean">
        <div className="store-top-bar-content">
          {/* Nearby Location Chooser Option */}
          <div className="store-nearby-location-bar">
            <div className="location-bar-left">
              <div className="location-pin-icon-wrap">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="location-details">
                <span className="location-choose-title">Choose Nearby Location / Auto Store:</span>
                <div className="location-current-selection">
                  <span className="store-strong-name">{preferredStore.name}</span>
                  <span className="store-distance-tag">
                    <i className="fa-solid fa-person-walking"></i> {preferredStore.distance}
                  </span>
                  <span className="store-open-tag">
                    <i className="fa-solid fa-circle-check"></i> {preferredStore.openStatus}
                  </span>
                  <span className="store-addr-tag">
                    • {preferredStore.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="location-bar-right">
              {/* Quick Dropdown Chooser */}
              <div className="location-quick-dropdown">
                <select
                  value={preferredStore.id}
                  onChange={(e) => {
                    const found = NEARBY_STORES.find((s) => s.id === e.target.value);
                    if (found) {
                      setPreferredStore(found);
                      showToast(`Nearby store set: ${found.name}`);
                    }
                  }}
                  aria-label="Choose Nearby Location"
                >
                  {NEARBY_STORES.map((s) => (
                    <option key={s.id} value={s.id}>
                      📍 {s.name} ({s.distance})
                    </option>
                  ))}
                </select>
                <i className="fa-solid fa-chevron-down select-arrow"></i>
              </div>

              <button
                type="button"
                className="btn-change-location-hub"
                onClick={() => setShowStoreLocatorModal(true)}
              >
                <i className="fa-solid fa-map-location-dot"></i>
                <span>Change Location</span>
              </button>
            </div>
          </div>

          {/* 1. TOP FORM: VEHICLE SELECTOR (Clean White Card) */}
          <div className="vehicle-selector-card-white">
            <div className="vehicle-selector-header">
              <div className="v-header-left">
                <i className="fa-solid fa-car-tunnel"></i>
                <div>
                  <h3>Select Your Vehicle for Exact Fitment</h3>
                  <p>Guaranteed compatible parts, lubricants, filters &amp; services</p>
                </div>
              </div>
              {garageActive && (
                <div className="active-vehicle-tag">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Fitment Active: <strong>{selectedBrand} {selectedModel} ({selectedYear})</strong></span>
                  <button type="button" className="btn-clear-garage" onClick={handleResetVehicle} title="Reset">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              )}
            </div>

            <form
              className="vehicle-selector-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyVehicleSearch();
              }}
            >
              {/* Field 1: Vehicle Type */}
              <div className="form-group-field">
                <label>
                  <i className="fa-solid fa-shapes"></i> Vehicle Type
                </label>
                <div className="select-wrapper">
                  <select
                    value={selectedVehicleType}
                    onChange={(e) => handleVehicleTypeChange(e.target.value)}
                    aria-label="Select Vehicle Type"
                  >
                    {VEHICLE_TYPES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down select-arrow"></i>
                </div>
              </div>

              {/* Field 2: Brand / Make */}
              <div className="form-group-field">
                <label>
                  <i className="fa-solid fa-certificate"></i> Brand / Make
                </label>
                <div className="select-wrapper">
                  <select
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    aria-label="Select Brand"
                  >
                    {availableBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down select-arrow"></i>
                </div>
              </div>

              {/* Field 3: Model */}
              <div className="form-group-field">
                <label>
                  <i className="fa-solid fa-car-side"></i> Model
                </label>
                <div className="select-wrapper">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    aria-label="Select Model"
                  >
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down select-arrow"></i>
                </div>
              </div>

              {/* Field 4: Year */}
              <div className="form-group-field field-year">
                <label>
                  <i className="fa-regular fa-calendar"></i> Year
                </label>
                <div className="select-wrapper">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    aria-label="Select Year"
                  >
                    {YEARS_LIST.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down select-arrow"></i>
                </div>
              </div>

              {/* Field 5: Fuel / Engine */}
              <div className="form-group-field field-fuel">
                <label>
                  <i className="fa-solid fa-gas-pump"></i> Fuel Type
                </label>
                <div className="select-wrapper">
                  <select
                    value={selectedFuel}
                    onChange={(e) => setSelectedFuel(e.target.value)}
                    aria-label="Select Fuel"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric / EV</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <i className="fa-solid fa-chevron-down select-arrow"></i>
                </div>
              </div>

              {/* Search Button */}
              <div className="form-action-field">
                <button type="submit" className="btn-search-parts">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <span>Find Parts &amp; Services</span>
                </button>
              </div>
            </form>

            {/* Quick Vehicle Type Icons Row */}
            <div className="quick-vehicle-pills">
              <span className="pills-label">Browse by Vehicle:</span>
              {VEHICLE_TYPES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`vehicle-pill-chip ${selectedVehicleType === v.id ? 'active' : ''}`}
                  onClick={() => handleVehicleTypeChange(v.id)}
                >
                  <i className={`fa-solid ${v.icon}`}></i>
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="store-container">

        {/* 2. SECTION: NEW LAUNCH (Scroll with left and right arrow buttons) */}
        <section className="store-showcase-section" id="section-new-launch">
          <div className="section-header-row">
            <div className="section-title-wrap">
              <div className="badge-flair">
                <i className="fa-solid fa-bolt-lightning"></i> NEW RELEASES
              </div>
              <h2 className="section-title">New Launch</h2>
              <p className="section-desc">
                Latest automotive innovations, smart dashcams, LED upgrades, portable EV chargers &amp; high-tech accessories.
              </p>
            </div>
            {/* Left and Right Scroll Navigation */}
            <div className="carousel-nav-arrows">
              <button
                type="button"
                className="btn-carousel-arrow btn-prev"
                onClick={() => scrollCarousel(newLaunchRef, 'left')}
                aria-label="Scroll New Launches Left"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                type="button"
                className="btn-carousel-arrow btn-next"
                onClick={() => scrollCarousel(newLaunchRef, 'right')}
                aria-label="Scroll New Launches Right"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          {/* Horizontal Slider Track */}
          <div className="carousel-slider-track" ref={newLaunchRef}>
            {NEW_LAUNCH_PRODUCTS.map((item) => (
              <div key={item.id} className="store-product-slide-card">
                <div className="product-media-wrapper">
                  <span className="product-ribbon-badge badge-new">{item.badge}</span>
                  <button
                    type="button"
                    className={`btn-card-wishlist ${wishlist.includes(item.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item.id);
                      showToast(
                        wishlist.includes(item.id)
                          ? `Removed from Wishlist: ${item.name}`
                          : `Added to Wishlist: ${item.name}`
                      );
                    }}
                    aria-label="Wishlist"
                    title={wishlist.includes(item.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <i className={wishlist.includes(item.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                  </button>
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="media-overlay-tags">
                    <span className="fitment-chip">
                      <i className="fa-solid fa-check"></i> {item.compatibleWith}
                    </span>
                  </div>
                </div>

                <div className="product-card-body">
                  <div className="rating-stock-row">
                    <div className="rating-pill">
                      <i className="fa-solid fa-star"></i> {item.rating} <span>({item.reviewsCount})</span>
                    </div>
                    <span className="stock-pill">
                      <i className="fa-solid fa-box-open"></i> {item.deliveryTime}
                    </span>
                  </div>

                  <h3 className="product-title" title={item.name}>{item.name}</h3>
                  <p className="product-short-desc">{item.desc}</p>

                  <div className="product-price-action-row">
                    <div className="pricing-col">
                      <div className="price-top">
                        <span className="price-current">{formatPrice(item.price)}</span>
                        {item.originalPrice && (
                          <span className="price-strike">{formatPrice(item.originalPrice)}</span>
                        )}
                      </div>
                      {item.originalPrice && (
                        <span className="discount-tag">
                          Save {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn-add-cart-primary"
                      onClick={() => handleAddToCart(item)}
                    >
                      <i className="fa-solid fa-cart-plus"></i>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SECTION: TRENDING PRODUCTS (Scroll with left and right arrow buttons) */}
        <section className="store-showcase-section" id="section-trending">
          <div className="section-header-row">
            <div className="section-title-wrap">
              <div className="badge-flair badge-flair-trending">
                <i className="fa-solid fa-fire"></i> HIGH DEMAND
              </div>
              <h2 className="section-title">Trending Products</h2>
              <p className="section-desc">
                High-performance synthetic oils, ceramic brake kits, 4G GPS trackers, and heavy-duty batteries.
              </p>
            </div>
            {/* Left and Right Scroll Navigation */}
            <div className="carousel-nav-arrows">
              <button
                type="button"
                className="btn-carousel-arrow btn-prev"
                onClick={() => scrollCarousel(trendingRef, 'left')}
                aria-label="Scroll Trending Products Left"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                type="button"
                className="btn-carousel-arrow btn-next"
                onClick={() => scrollCarousel(trendingRef, 'right')}
                aria-label="Scroll Trending Products Right"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          {/* Horizontal Slider Track */}
          <div className="carousel-slider-track" ref={trendingRef}>
            {TRENDING_PRODUCTS.map((item) => (
              <div key={item.id} className="store-product-slide-card card-trending">
                <div className="product-media-wrapper">
                  <span className="product-ribbon-badge badge-trending">{item.badge}</span>
                  <button
                    type="button"
                    className={`btn-card-wishlist ${wishlist.includes(item.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item.id);
                      showToast(
                        wishlist.includes(item.id)
                          ? `Removed from Wishlist: ${item.name}`
                          : `Added to Wishlist: ${item.name}`
                      );
                    }}
                    aria-label="Wishlist"
                    title={wishlist.includes(item.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <i className={wishlist.includes(item.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                  </button>
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="media-overlay-tags">
                    <span className="fitment-chip">
                      <i className="fa-solid fa-check"></i> {item.compatibleWith}
                    </span>
                  </div>
                </div>

                <div className="product-card-body">
                  <div className="rating-stock-row">
                    <div className="rating-pill">
                      <i className="fa-solid fa-star"></i> {item.rating} <span>({item.reviewsCount})</span>
                    </div>
                    <span className="stock-pill stock-urgent">
                      <i className="fa-solid fa-clock"></i> {item.stockLeft ? `Only ${item.stockLeft} left` : 'Fast Selling'}
                    </span>
                  </div>

                  <h3 className="product-title" title={item.name}>{item.name}</h3>
                  <p className="product-short-desc">{item.desc}</p>

                  <div className="product-price-action-row">
                    <div className="pricing-col">
                      <div className="price-top">
                        <span className="price-current">{formatPrice(item.price)}</span>
                        {item.originalPrice && (
                          <span className="price-strike">{formatPrice(item.originalPrice)}</span>
                        )}
                      </div>
                      {item.originalPrice && (
                        <span className="discount-tag">
                          Save {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn-add-cart-primary"
                      onClick={() => handleAddToCart(item)}
                    >
                      <i className="fa-solid fa-cart-plus"></i>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. SECTION: TOP SELLING PRODUCTS (Scroll with left and right arrow buttons) */}
        <section className="store-showcase-section" id="section-top-selling">
          <div className="section-header-row">
            <div className="section-title-wrap">
              <div className="badge-flair badge-flair-bestseller">
                <i className="fa-solid fa-award"></i> MOST POPULAR
              </div>
              <h2 className="section-title">Top Selling Products</h2>
              <p className="section-desc">
                Verified customer staples, OEM replacement filters, emergency puncture kits, MagSafe mounts &amp; Roots horns.
              </p>
            </div>
            {/* Left and Right Scroll Navigation */}
            <div className="carousel-nav-arrows">
              <button
                type="button"
                className="btn-carousel-arrow btn-prev"
                onClick={() => scrollCarousel(topSellingRef, 'left')}
                aria-label="Scroll Top Selling Products Left"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                type="button"
                className="btn-carousel-arrow btn-next"
                onClick={() => scrollCarousel(topSellingRef, 'right')}
                aria-label="Scroll Top Selling Products Right"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          {/* Horizontal Slider Track */}
          <div className="carousel-slider-track" ref={topSellingRef}>
            {TOP_SELLING_PRODUCTS.map((item) => (
              <div key={item.id} className="store-product-slide-card card-bestseller">
                <div className="product-media-wrapper">
                  <span className="product-ribbon-badge badge-bestseller">{item.badge}</span>
                  <button
                    type="button"
                    className={`btn-card-wishlist ${wishlist.includes(item.id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item.id);
                      showToast(
                        wishlist.includes(item.id)
                          ? `Removed from Wishlist: ${item.name}`
                          : `Added to Wishlist: ${item.name}`
                      );
                    }}
                    aria-label="Wishlist"
                    title={wishlist.includes(item.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <i className={wishlist.includes(item.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                  </button>
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="media-overlay-tags">
                    <span className="fitment-chip">
                      <i className="fa-solid fa-check"></i> {item.compatibleWith}
                    </span>
                  </div>
                </div>

                <div className="product-card-body">
                  <div className="rating-stock-row">
                    <div className="rating-pill">
                      <i className="fa-solid fa-star"></i> {item.rating} <span>({item.reviewsCount})</span>
                    </div>
                    <span className="stock-pill stock-highlight">
                      <i className="fa-solid fa-truck-fast"></i> {item.deliveryTime}
                    </span>
                  </div>

                  <h3 className="product-title" title={item.name}>{item.name}</h3>
                  <p className="product-short-desc">{item.desc}</p>

                  <div className="product-price-action-row">
                    <div className="pricing-col">
                      <div className="price-top">
                        <span className="price-current">{formatPrice(item.price)}</span>
                        {item.originalPrice && (
                          <span className="price-strike">{formatPrice(item.originalPrice)}</span>
                        )}
                      </div>
                      {item.originalPrice && (
                        <span className="discount-tag">
                          Save {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn-add-cart-primary"
                      onClick={() => handleAddToCart(item)}
                    >
                      <i className="fa-solid fa-cart-plus"></i>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. UNIVERSAL WORKSHOP SERVICES & SPARE PARTS CATALOG */}
        <section className="store-catalog-section">
          <div className="catalog-header-bar">
            <div>
              <h2 className="section-title">All-in-One Vehicle Services &amp; Spares</h2>
              <p className="section-desc">
                Order parts for home delivery or book complete certified mechanic service at your doorstep or nearby garage.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="catalog-search-wrap">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search spare parts, oil, brakes, vehicle model..."
                className="catalog-search-input"
              />
              {search && (
                <button
                  type="button"
                  className="btn-search-clear"
                  onClick={() => setSearch('')}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs Strip */}
          <div className="catalog-categories-bar">
            {(['All', 'Spare Parts', 'Accessories', 'Maintenance', 'Wash & Care', 'Emergency'] as MainCategory[]).map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-pill-btn ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  <span>{category}</span>
                </button>
              )
            )}
          </div>

          {/* Catalog Cards Grid */}
          <div className="catalog-grid">
            {filteredCatalog.map((product) => {
              const includesList = product.includes || [];
              const chosenAddOns = selectedEquipment[product.id] ?? [];
              const totalCost = getProductTotalPrice(product);
              const isDetailOpen = activeDetailId === product.id;

              return (
                <div key={product.id} className="catalog-item-card">
                  {/* Left: Thumbnail & Badges */}
                  <div className="catalog-item-media">
                    <button
                      type="button"
                      className={`btn-card-wishlist ${wishlist.includes(product.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                        showToast(
                          wishlist.includes(product.id)
                            ? `Removed from Wishlist: ${product.name}`
                            : `Added to Wishlist: ${product.name}`
                        );
                      }}
                      aria-label="Wishlist"
                      title={wishlist.includes(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <i className={wishlist.includes(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                    </button>
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    {product.badge && (
                      <span className="catalog-card-badge">{product.badge}</span>
                    )}
                    <span className="catalog-vehicle-tag">
                      <i className="fa-solid fa-wrench"></i> {product.vehicle}
                    </span>
                  </div>

                  {/* Right: Compact Info */}
                  <div className="catalog-item-info">
                    <div className="catalog-top-row">
                      <h3 className="catalog-item-title" title={product.name}>{product.name}</h3>
                      {product.duration && (
                        <span className="duration-pill">
                          <i className="fa-regular fa-clock"></i> {product.duration}
                        </span>
                      )}
                    </div>

                    <div className="catalog-meta-row">
                      {product.warranty && (
                        <span className="warranty-tag">
                          <i className="fa-solid fa-shield"></i> {product.warranty}
                        </span>
                      )}
                      <span className="pickup-tag">
                        <i className="fa-solid fa-van-shuttle"></i> Free Pick-up &amp; Drop
                      </span>
                    </div>

                    <p className="catalog-desc-compact">{product.desc}</p>

                    {/* Compact Teaser & "See More" Button without increasing card height */}
                    <div className="catalog-teaser-row">
                      <span className="teaser-pill">
                        <i className="fa-solid fa-check"></i> {includesList.length} Included
                      </span>
                      <button
                        type="button"
                        className="btn-see-more-action"
                        onClick={() => setActiveDetailId(product.id)}
                      >
                        <span>See More &amp; Parts</span>
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>

                    {/* Pricing & Add to Cart */}
                    <div className="catalog-footer-row">
                      <div className="catalog-price-col">
                        <span className="total-label">Starting Price:</span>
                        <div className="catalog-price-wrap">
                          <span className="catalog-current-price">{formatPrice(totalCost)}</span>
                          {product.originalPrice && (
                            <span className="catalog-strike-price">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-add-catalog-cart"
                        onClick={() => handleAddToCart(product)}
                      >
                        <i className="fa-solid fa-cart-shopping"></i>
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                  {/* INTERNAL ZERO-HEIGHT-INCREASE OVERLAY (Shows full content with smooth internal scroll) */}
                  {isDetailOpen && (
                    <div className="catalog-card-details-overlay animate-scale">
                      <div className="overlay-header">
                        <div className="overlay-header-title">
                          <span className="overlay-badge">All Content &amp; Add-ons</span>
                          <h4>{product.name}</h4>
                        </div>
                        <button
                          type="button"
                          className="btn-close-overlay"
                          onClick={() => setActiveDetailId(null)}
                          title="Close details"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>

                      <div className="overlay-scroll-body">
                        <p className="overlay-desc">{product.desc}</p>

                        {/* All Inclusions */}
                        {includesList.length > 0 && (
                          <div className="overlay-section">
                            <div className="overlay-section-title">
                              <i className="fa-solid fa-list-check"></i> Included Services ({includesList.length}):
                            </div>
                            <div className="overlay-inc-grid">
                              {includesList.map((inc) => (
                                <div key={inc} className="overlay-inc-item">
                                  <i className="fa-solid fa-circle-check"></i>
                                  <span>{inc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommended Parts Add-ons */}
                        {(product.equipmentOptions || []).length > 0 && (
                          <div className="overlay-section">
                            <div className="overlay-section-title">
                              <i className="fa-solid fa-toolbox"></i> Recommended Parts &amp; Add-ons:
                            </div>
                            <div className="overlay-addons-list">
                              {product.equipmentOptions?.map((opt) => (
                                <label key={opt.name} className="addon-checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={chosenAddOns.includes(opt.name)}
                                    onChange={() => toggleEquipmentOption(product.id, opt.name)}
                                  />
                                  <span className="addon-text">{opt.name}</span>
                                  <span className="addon-price">(+{formatPrice(opt.price)})</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Vehicle Note */}
                        <div className="overlay-section">
                          <div className="overlay-section-title">
                            <i className="fa-solid fa-car"></i> Vehicle Note / Registration:
                          </div>
                          <input
                            type="text"
                            placeholder={
                              garageActive
                                ? `Vehicle: ${selectedBrand} ${selectedModel} (${selectedYear})`
                                : 'Enter vehicle registration or model'
                            }
                            value={customVehicleNote[product.id] ?? ''}
                            onChange={(e) =>
                              setCustomVehicleNote((prev) => ({
                                ...prev,
                                [product.id]: e.target.value,
                              }))
                            }
                            className="vehicle-note-input"
                          />
                        </div>
                      </div>

                      <div className="overlay-footer">
                        <div className="overlay-price-col">
                          <span className="total-label">Total Amount:</span>
                          <span className="overlay-total-price">{formatPrice(totalCost)}</span>
                        </div>
                        <button
                          type="button"
                          className="btn-add-catalog-cart"
                          onClick={() => {
                            handleAddToCart(product);
                            setActiveDetailId(null);
                          }}
                        >
                          <i className="fa-solid fa-cart-shopping"></i>
                          <span>Add To Cart</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredCatalog.length === 0 && (
            <div className="catalog-empty-state">
              <i className="fa-solid fa-magnifying-glass"></i>
              <h3>No products or services found</h3>
              <p>Try searching with another keyword or change your category filter.</p>
              <button
                type="button"
                className="btn-reset-filter"
                onClick={() => {
                  setSearch('');
                  setActiveCategory('All');
                }}
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </section>

        {/* 6. TRUST & BRAND BENEFITS (AutoZone / Boodmo style trust badges) */}
        <div className="store-trust-grid">
          <div className="trust-card">
            <div className="trust-icon-box">
              <i className="fa-solid fa-certificate"></i>
            </div>
            <h4>100% Genuine Auto Parts</h4>
            <p>Direct sourcing from authorized OEM &amp; OES global automotive suppliers.</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon-box">
              <i className="fa-solid fa-truck-ramp-box"></i>
            </div>
            <h4>Fast Delivery or Store Pickup</h4>
            <p>Get doorstep delivery or pick up in 15 minutes at 2,400+ verified partner hubs.</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon-box">
              <i className="fa-solid fa-rotate-left"></i>
            </div>
            <h4>Hassle-Free 10-Day Returns</h4>
            <p>Guaranteed compatibility check with zero-question return &amp; instant refund.</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon-box">
              <i className="fa-solid fa-headset"></i>
            </div>
            <h4>24x7 Expert Auto Support</h4>
            <p>Certified automotive engineers ready to assist with part numbers &amp; fitment.</p>
          </div>
        </div>

      </div>

      {/* 7. NEARBY STORE LOCATOR MODAL (Reference AutoZone / Boodmo) */}
      {showStoreLocatorModal && (
        <div className="modal-backdrop-store" onClick={() => setShowStoreLocatorModal(false)}>
          <div
            className="store-locator-modal animate-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-store">
              <div className="modal-title-wrap">
                <i className="fa-solid fa-shop"></i>
                <div>
                  <h3>Select Nearby Auto Store &amp; Fitment Hub</h3>
                  <p>Choose your preferred store for instant pickup, fitting or doorstep dispatch.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowStoreLocatorModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="modal-body-stores">
              <div className="store-list-container">
                {NEARBY_STORES.map((store) => (
                  <div
                    key={store.id}
                    className={`store-item-card ${preferredStore.id === store.id ? 'selected' : ''}`}
                    onClick={() => {
                      setPreferredStore(store);
                      setFulfillmentMode('nearby');
                      setShowStoreLocatorModal(false);
                      showToast(`Selected Store: ${store.name}`);
                    }}
                  >
                    <div className="store-item-header">
                      <div>
                        <h4 className="store-item-name">{store.name}</h4>
                        <span className="store-type-badge">{store.type}</span>
                      </div>
                      <div className="store-distance-box">
                        <span className="store-dist">{store.distance}</span>
                        <span className="store-rating">
                          <i className="fa-solid fa-star"></i> {store.rating} ({store.reviews})
                        </span>
                      </div>
                    </div>

                    <p className="store-address-text">
                      <i className="fa-solid fa-location-dot"></i> {store.address}
                    </p>

                    <div className="store-status-row">
                      <span className="open-indicator">
                        <i className="fa-solid fa-clock"></i> {store.openStatus}
                      </span>
                      <span className="stock-count-indicator">
                        <i className="fa-solid fa-boxes-stacked"></i> {store.partsInStock}+ items in stock
                      </span>
                    </div>

                    <div className="store-services-pills">
                      {store.servicesAvailable.map((srv) => (
                        <span key={srv} className="srv-pill">
                          <i className="fa-solid fa-check"></i> {srv}
                        </span>
                      ))}
                    </div>

                    <div className="store-card-footer">
                      <span className="store-phone">
                        <i className="fa-solid fa-phone"></i> {store.phone}
                      </span>
                      <button
                        type="button"
                        className={`btn-select-store ${preferredStore.id === store.id ? 'btn-active' : ''}`}
                      >
                        {preferredStore.id === store.id ? '✓ Selected Store' : 'Select This Store'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}