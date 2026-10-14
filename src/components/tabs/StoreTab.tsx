'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import './StoreTab.css';
import { useSartStore } from '@/store/useSartStore';
import {
  VEHICLE_SHOWCASE_DATA,
  VehicleShowcaseItem,
  COMPARISON_VEHICLES,
  ComparisonVehicle,
  LIVE_FUEL_PRICES,
  EV_CHARGING_STATIONS,
  INSURANCE_QUOTES,
  InsuranceQuote,
  LOCATION_BASED_STATIONS,
  LocationFuelEvStation
} from './storeData';

/* ------------------------------------------------------------------ */
/* Types & Interfaces                                                  */
/* ------------------------------------------------------------------ */

export type EquipmentOption = { name: string; price: number };
export type VehicleType = 'Car' | 'Bike' | 'Auto' | 'Van' | 'Lorry' | 'Bus' | 'EV' | 'Universal';
export type StoreHubTab = 
  | 'buy_sell' 
  | 'spare_parts' 
  | 'mechanic_service' 
  | 'emergency_sos' 
  | 'compare_vehicles' 
  | 'ev_fuel_stations' 
  | 'finance_insurance';

export type MainCategory = 
  | 'All' 
  | 'Spare Parts' 
  | 'Accessories' 
  | 'Maintenance' 
  | 'Service Center' 
  | 'Mechanic Service' 
  | 'Vehicle Modification' 
  | 'Wash & Care' 
  | 'Emergency';

export const VEHICLE_SPECIFIC_CATEGORIES: Record<string, string[]> = {
  Car: [
    'All Categories',
    'Engine & Transmission',
    'Brakes & Rotors',
    'Suspension & Steering',
    'Periodic Maintenance Service',
    'Authorized Service Center Work',
    'Doorstep Mechanic Repair',
    'Custom Modification & Body Kits',
    'Car Accessories & Dashcams',
    'Ceramic Coating & Detailing',
    'AC Gas & Cooling Service',
    'Batteries & Electricals',
    'Tyres & Alloy Wheels',
    'Emergency Breakdown & Towing'
  ],
  Bike: [
    'All Categories',
    'Bike Engine Oil & Filters',
    'Chain & Sprocket Overhaul',
    'Brake Pads & Disc Rotors',
    'Clutch & Cables',
    'Two-Wheeler Service Center',
    'Bike Mechanic Breakdown Service',
    'Superbike Custom Modification',
    'Bike Exhaust & Performance Tuning',
    'Helmets & Riding Accessories',
    'Bike Detailing & Foam Wash',
    'Bike Tyres & Tubes',
    'Roadside Puncture & Towing'
  ],
  Auto: [
    'All Categories',
    'Auto CNG System & Tuning',
    'Engine & Gearbox Spares',
    'Clutch Plate & Friction Discs',
    'Auto Mechanic Repair & Tuning',
    'Commercial Auto Service Station',
    'Audio, Meter & Mod Accessories',
    'Heavy Auto Batteries & Starters',
    'Tyres, Rims & Brake Shoes',
    'Auto Towing & Breakdown Help'
  ],
  Van: [
    'All Categories',
    'Van Engine & Fuel Injection',
    'Passenger Seat & Interior Mods',
    'Van Periodic Maintenance',
    'Suspension & Leaf Springs',
    'Van Service Center Diagnostic',
    'Doorstep Van Mechanic',
    'Accessories & Luggage Carriers',
    'Brakes, Clutch & Radiator',
    'Fleet Emergency Roadside'
  ],
  Lorry: [
    'All Categories',
    'Heavy Diesel Engine Overhaul',
    'Air Brake Chambers & Linings',
    'Leaf Spring & Axle Suspension',
    'Commercial Fleet Service Center',
    'Heavy Highway Truck Mechanic',
    'Custom Cabin & Body Modification',
    'Transmission & Heavy Gear Oil',
    'Heavy Vehicle Tyres & Rims',
    'Heavy Crane & Highway Recovery'
  ],
  Bus: [
    'All Categories',
    'Bus Engine & Cooling Radiators',
    'Air Conditioning & Vent Service',
    'Air Brake & Pneumatic Spares',
    'Bus Service Depot Inspection',
    'Fleet Mechanic & Triage',
    'Luxury Coach Modification & Seats',
    'Door Mechanisms & Electrics',
    'Heavy Duty Batteries',
    '24/7 Breakdown & Recovery'
  ],
  EV: [
    'All Categories',
    'EV Fast Chargers & Type-2 Cables',
    'Lithium Battery Health Diagnostics',
    'Electric Motor Tuning & Service',
    'EV Authorized Service Center',
    'Doorstep EV Mechanic & Tech Support',
    'EV Custom Styling & Aero Mods',
    'Regenerative Braking Systems',
    'Infotainment & Smart Gadgets',
    'Emergency Mobile EV Charging Unit'
  ],
  Universal: [
    'All Categories',
    'Spare Parts',
    'Accessories',
    'Maintenance & Service',
    'Service Center Booking',
    'Nearby Mechanic Service',
    'Vehicle Modification Studio',
    'Wash & Detailing',
    'Emergency Roadside'
  ]
};

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
  hubCategory: 'store' | 'mechanic' | 'service_center' | 'modification';
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
    hubCategory: 'store',
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
    id: 'mech-1',
    name: 'SpeedyCare Doorstep & Garage Mechanic',
    type: 'Certified On-Demand Mechanic & Triage Station',
    hubCategory: 'mechanic',
    distance: '0.8 km away',
    rating: 4.88,
    reviews: 512,
    address: '12th Main Road, HAL 2nd Stage, Indiranagar',
    phone: '+91 98450 77112',
    openStatus: 'Open Now • 24x7 Emergency Mechanic On-Call',
    servicesAvailable: ['Roadside Breakdown', 'Brake & Clutch Repair', 'Instant Oil Change', 'Jumpstart & Puncture'],
    partsInStock: 1200,
  },
  {
    id: 'sc-1',
    name: 'SART Multi-Brand Authorized Service Center',
    type: 'OEM Master Service Station & Bodyshop',
    hubCategory: 'service_center',
    distance: '2.1 km away',
    rating: 4.92,
    reviews: 840,
    address: 'Old Airport Road, Kodihalli, Bengaluru',
    phone: '+91 98451 44556',
    openStatus: 'Open Now • Closes 8:30 PM',
    servicesAvailable: ['Periodic Scheduled Service', 'Engine Overhaul & Diagnostics', 'Automated Wheel Alignment', 'Cashless Insurance Claims'],
    partsInStock: 6800,
  },
  {
    id: 'mod-1',
    name: 'Autocraft Custom Studio & Performance Mod Garage',
    type: 'Custom Vehicle Modification, Body Kits & Remapping',
    hubCategory: 'modification',
    distance: '3.4 km away',
    rating: 4.96,
    reviews: 395,
    address: 'Double Road, Indiranagar Stage 1, Bengaluru',
    phone: '+91 98452 99001',
    openStatus: 'Open Now • Closes 9:00 PM',
    servicesAvailable: ['Full Body Wrap & PPF', 'Performance ECU Remap & Exhaust', 'Custom Off-road Lift Kits', 'Ambient RGB & Audio Tuning'],
    partsInStock: 2900,
  },
  {
    id: 'store-2',
    name: 'Koramangala AutoZone & Spare Hub',
    type: 'Premier Multi-Vehicle Parts Center',
    hubCategory: 'store',
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
    id: 'mech-2',
    name: 'Koramangala 24/7 Mobile Mechanic Patrol',
    type: 'Express Bike & Car Breakdown Mechanic',
    hubCategory: 'mechanic',
    distance: '2.5 km away',
    rating: 4.85,
    reviews: 380,
    address: '5th Block, Jyoti Nivas College Road, Koramangala',
    phone: '+91 98453 66778',
    openStatus: 'Open 24 Hours • 15 Mins Dispatch',
    servicesAvailable: ['Mobile Mechanic Van', 'Flat Tyre Replacement', 'Radiator Leak Fix', 'Electrical Wiring'],
    partsInStock: 1650,
  },
  {
    id: 'sc-2',
    name: 'Bosch Car & Bike Premier Service Hub',
    type: 'Certified Service Center & Computerized Lab',
    hubCategory: 'service_center',
    distance: '3.1 km away',
    rating: 4.89,
    reviews: 640,
    address: 'Intermediate Ring Road, Koramangala, Bengaluru',
    phone: '+91 98452 33441',
    openStatus: 'Open Now • Closes 9:00 PM',
    servicesAvailable: ['Bosch Diagnostics', 'Suspension Overhaul', 'Climate Control AC Refill', 'Tyre Balancing'],
    partsInStock: 5200,
  },
  {
    id: 'mod-2',
    name: 'Torque Beast 4x4, Superbike & Thar Modifiers',
    type: 'Specialized Bike, Car & SUV Vehicle Modification Studio',
    hubCategory: 'modification',
    distance: '4.2 km away',
    rating: 4.95,
    reviews: 310,
    address: '100 Feet Road, 6th Block, Koramangala',
    phone: '+91 98453 88123',
    openStatus: 'Open Now • Closes 10:00 PM',
    servicesAvailable: ['Thar & Off-Road Armor Customization', 'Superbike Exhaust & Tuning', 'Matte Paint Protection Film (PPF)', 'Custom Alloy Wheels'],
    partsInStock: 1850,
  },
  {
    id: 'store-3',
    name: 'Whitefield Heavy Fleet, Mechanic & Service Depot',
    type: 'Commercial Trucks, Buses, Cars & EV Depot',
    hubCategory: 'service_center',
    distance: '5.4 km away',
    rating: 4.7,
    reviews: 295,
    address: 'ITPL Main Road, Hope Farm Junction, Whitefield',
    phone: '+91 98452 44332',
    openStatus: 'Open 24x7 Emergency Depot',
    servicesAvailable: ['Heavy Commercial Spares', 'Lorry & Bus Fitment', '24x7 Roadside Dispatch', 'EV Fast Charging'],
    partsInStock: 8200,
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
  {
    id: 'srv-9',
    name: 'Nearby Doorstep Mechanic On-Demand Inspection & Tune-Up',
    price: 499,
    originalPrice: 850,
    rating: 4.9,
    reviewsCount: 1540,
    icon: 'fa-wrench',
    image: 'https://crawfordsautoservice.com/wp-content/uploads/2020/03/service-writer-auto-repair.jpg',
    vehicle: 'Universal',
    category: 'Mechanic Service',
    section: 'Nearby Mechanic Services',
    badge: 'DOORSTEP MECHANIC',
    badgeType: 'bestseller',
    desc: 'Expert certified technician visits your home/office. Complete 35-point health diagnostics, minor fault fixes & fluids top-up.',
    duration: '1 Hr',
    warranty: 'Workmanship Guaranteed',
    isService: true,
    includes: ['Doorstep mechanic inspection', 'OBD scanner diagnostic error clearance', 'Battery terminals cleaning', 'Coolant & brake fluid check', 'Fan belt & wiper triage'],
    equipmentOptions: [
      { name: 'Spark Plug Set Replacement', price: 550 },
      { name: 'Engine Oil Flush (3.5L)', price: 950 },
      { name: 'Brake Fluid Bleed (500ml)', price: 300 },
    ],
  },
  {
    id: 'srv-10',
    name: 'Authorized Service Center Master Overhaul & Stamp',
    price: 2999,
    originalPrice: 4800,
    rating: 4.94,
    reviewsCount: 920,
    icon: 'fa-building-shield',
    image: 'https://blogs.gomechanic.com/wp-content/uploads/2024/09/car-service_web_what-is-car-servicing.png',
    vehicle: 'Car',
    category: 'Service Center',
    section: 'Authorized Service Centers',
    badge: 'OEM CERTIFIED',
    badgeType: 'trending',
    desc: 'Dealer-grade full bay inspection at SART authorized service station. Factory diagnostics, digital logbook stamping & warranty preservation.',
    duration: '4.5 Hrs',
    warranty: '12 Months OEM Warranty',
    isService: true,
    includes: ['Comprehensive mechanical audit', 'Computerized ECU fault scan', 'High-pressure underchassis wash', 'Wheel alignment & computerized balancing', 'Official service logbook stamping'],
    equipmentOptions: [
      { name: 'Synthetic Motul 5W-40 Upgrade', price: 1400 },
      { name: 'Cabin Carbon HEPA Pollen Filter', price: 650 },
      { name: 'Throttle Body Ultrasonic Cleaning', price: 750 },
    ],
  },
  {
    id: 'srv-11',
    name: 'Custom Vehicle Modification: Full Matte / Gloss Vinyl Wrap & PPF',
    price: 18500,
    originalPrice: 28000,
    rating: 4.97,
    reviewsCount: 410,
    icon: 'fa-paint-roller',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Vehicle Modification',
    section: 'Custom Vehicle Modification Studio',
    badge: 'CUSTOM MODS',
    badgeType: 'new',
    desc: 'Transform your vehicle with premium Avery Dennison / 3M exterior color-shift vinyl wrap or self-healing TPU paint protection film.',
    duration: '2 Days',
    warranty: '5 Years Film Warranty',
    isService: true,
    includes: ['Full exterior surface clay bar prep', 'Edge wrapping & precision cutting', 'Heat gun bonding treatment', 'UV & scratch proof clear coat shield'],
    equipmentOptions: [
      { name: 'Roof Gloss Black De-Chrome Wrap', price: 2800 },
      { name: 'Smoked Headlight & Taillight PPF Tint', price: 1600 },
      { name: 'Alloy Wheels Hyper-Dip Matte Bronze', price: 3500 },
    ],
  },
  {
    id: 'srv-12',
    name: 'Performance Tuning: Stage 1 ECU Remap & Free-Flow Exhaust',
    price: 12500,
    originalPrice: 19500,
    rating: 4.95,
    reviewsCount: 290,
    icon: 'fa-gauge-simple-high',
    image: 'https://images.unsplash.com/photo-1503376710356-70d6943f65e2?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Universal',
    category: 'Vehicle Modification',
    section: 'Custom Vehicle Modification Studio',
    badge: '+25% HP BOOST',
    badgeType: 'bestseller',
    desc: 'Unleash up to 25% extra horsepower and 30% torque with custom engine ECU flashing. Smooth power band with improved highway fuel efficiency.',
    duration: '4 Hrs',
    warranty: 'Safe Dyno-Tested Map',
    isService: true,
    includes: ['Dyno baseline power run', 'Custom fuel & boost map flash', 'Speed limiter removal', 'OBD performance health check'],
    equipmentOptions: [
      { name: 'High-Flow Cold Air Intake Cone', price: 3400 },
      { name: 'Valvetronic Exhaust System Cutout', price: 6500 },
      { name: 'Iridium Racing Spark Plugs Set', price: 1200 },
    ],
  },
  {
    id: 'srv-13',
    name: 'Interior Luxury Mod: Ambient 64-Color RGB LED & Starry Starlight Headliner',
    price: 5499,
    originalPrice: 8900,
    rating: 4.88,
    reviewsCount: 360,
    icon: 'fa-wand-magic-sparkles',
    image: 'https://images.unsplash.com/photo-1517524285303-d6fc683dddf8?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Vehicle Modification',
    section: 'Custom Vehicle Modification Studio',
    badge: 'LUXURY RETROFIT',
    badgeType: 'trending',
    desc: 'Rolls-Royce inspired fiber-optic shooting star roof liner and app-controlled 64-color acrylic hidden ambient light strips.',
    duration: '5 Hrs',
    warranty: '2 Years Wiring Warranty',
    isService: true,
    includes: ['64-Color smartphone synced ambient bars', 'Dashboard, doors & footwell wiring', 'Optical starlight fiber harness', 'Fuse tap safety box with zero wire-cutting'],
    equipmentOptions: [
      { name: 'Shooting Meteor Star Effect Addon', price: 2100 },
      { name: 'Illuminated Door Sill Scuff Plates', price: 1400 },
      { name: 'Underglow Chassis RGB Neon Kit', price: 2200 },
    ],
  },
  {
    id: 'srv-14',
    name: 'Two-Wheeler Service Center Periodic Check & Injector Clean',
    price: 699,
    originalPrice: 1100,
    rating: 4.91,
    reviewsCount: 880,
    icon: 'fa-motorcycle',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Service Center',
    section: 'Authorized Service Centers',
    badge: 'BIKE SERVICE',
    badgeType: 'bestseller',
    desc: 'Authorized bike service bay inspection. Ultrasonic fuel injector clean, brake bleeding, clutch adjustment & electrical test.',
    duration: '2 Hrs',
    warranty: '90 Days Service Warranty',
    isService: true,
    includes: ['Ultrasonic fuel injector clean', 'Brake pad surface de-glaze', 'Clutch cable play adjust', 'Drive chain degrease & Motul lube'],
    equipmentOptions: [
      { name: 'Motul 7100 100% Synthetic Oil (1L)', price: 850 },
      { name: 'K&N High Flow Air Filter', price: 1800 },
    ],
  },
  {
    id: 'srv-15',
    name: 'Emergency Roadside Mechanic Breakdown SOS Dispatch',
    price: 699,
    originalPrice: 1200,
    rating: 4.98,
    reviewsCount: 2240,
    icon: 'fa-truck-medical',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Universal',
    category: 'Mechanic Service',
    section: 'Nearby Mechanic Services',
    badge: '15-MINS ARRIVAL',
    badgeType: 'emergency',
    emergency: true,
    desc: 'Nearest mobile mechanic dispatched to your live GPS location. Quick spot fix for battery dead, flat tyre, clutch wire snap or engine heat up.',
    duration: '15 Mins Arrival',
    warranty: 'Instant On-Spot Triage',
    isService: true,
    includes: ['Priority technician dispatch', 'On-spot battery jump start', 'Puncture tube repair', 'Overheating radiator triage'],
    equipmentOptions: [
      { name: 'Emergency Fuel Can (5 Litres)', price: 650 },
      { name: 'Battery Replacement Exchange', price: 3800 },
    ],
  },
];

const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

export {
  NEW_LAUNCH_PRODUCTS,
  TRENDING_PRODUCTS,
  TOP_SELLING_PRODUCTS,
  CATALOG_ITEMS,
};

export const ALL_STORE_PRODUCTS: StoreProduct[] = [
  ...NEW_LAUNCH_PRODUCTS,
  ...TRENDING_PRODUCTS,
  ...TOP_SELLING_PRODUCTS,
  ...CATALOG_ITEMS,
];

/* ------------------------------------------------------------------ */
/* Component Implementation                                           */
/* ------------------------------------------------------------------ */

export default function StoreTab() {
  const { activeTab, addToCart, wishlist, toggleWishlist } = useSartStore();

  const [mounted, setMounted] = useState(false);

  // Top Vehicle Selector State
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('Car');
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState<string>('All Categories');
  const [selectedBrand, setSelectedBrand] = useState<string>('Maruti Suzuki');
  const [selectedModel, setSelectedModel] = useState<string>('Swift');
  const [selectedYear, setSelectedYear] = useState<string>('2023');
  const [selectedFuel, setSelectedFuel] = useState<string>('Petrol');

  // Browse Mode: 'general' (All products & services across all vehicles) vs 'my_vehicle' (Filtered to user's vehicle)
  const [storeBrowseMode, setStoreBrowseMode] = useState<'general' | 'my_vehicle'>('my_vehicle');

  // Applied Vehicle Search
  const [appliedVehicleSearch, setAppliedVehicleSearch] = useState<{
    type: string;
    brand: string;
    model: string;
    year: string;
    fuel: string;
    category: string;
  } | null>({
    type: 'Car',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    year: '2023',
    fuel: 'Petrol',
    category: 'All Categories',
  });

  // Garage Active Flag
  const [garageActive, setGarageActive] = useState<boolean>(true);

  // Saved Garage Vehicles List
  interface SavedGarageVehicle {
    id: string;
    type: string;
    brand: string;
    model: string;
    year: string;
    fuel: string;
    regNumber?: string;
    nickname?: string;
  }

  const [savedVehicles, setSavedVehicles] = useState<SavedGarageVehicle[]>([
    {
      id: 'v-1',
      type: 'Car',
      brand: 'Maruti Suzuki',
      model: 'Swift',
      year: '2023',
      fuel: 'Petrol',
      nickname: 'Daily Swift',
      regNumber: 'TN 09 BX 2023',
    },
    {
      id: 'v-2',
      type: 'Bike',
      brand: 'Royal Enfield',
      model: 'Classic 350',
      year: '2022',
      fuel: 'Petrol',
      nickname: 'Bullet 350',
      regNumber: 'TN 07 AB 3500',
    },
  ]);

  const [activeVehicleId, setActiveVehicleId] = useState<string>('v-1');

  // Add Vehicle Modal State
  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false);
  const [newVehicleType, setNewVehicleType] = useState<string>('Car');
  const [newVehicleBrand, setNewVehicleBrand] = useState<string>('Hyundai');
  const [newVehicleModel, setNewVehicleModel] = useState<string>('Creta');
  const [newVehicleYear, setNewVehicleYear] = useState<string>('2024');
  const [newVehicleFuel, setNewVehicleFuel] = useState<string>('Petrol');
  const [newVehicleNickname, setNewVehicleNickname] = useState<string>('');
  const [newVehicleReg, setNewVehicleReg] = useState<string>('');

  // Store fulfillment mode: 'delivery' vs 'nearby'
  const [fulfillmentMode, setFulfillmentMode] = useState<'delivery' | 'nearby'>('delivery');
  const [showStoreLocatorModal, setShowStoreLocatorModal] = useState<boolean>(false);
  const [nearbyStoreFilter, setNearbyStoreFilter] = useState<'all' | 'store' | 'mechanic' | 'service_center' | 'modification'>('all');
  const [preferredStore, setPreferredStore] = useState<NearbyStore>(NEARBY_STORES[0]);

  // Search & Category Filters
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MainCategory>('All');

  // Equipment add-on selection for services
  const [selectedEquipment, setSelectedEquipment] = useState<Record<string, string[]>>({});
  const [customVehicleNote, setCustomVehicleNote] = useState<Record<string, string>>({});
  const [expandedIncludes, setExpandedIncludes] = useState<Record<string, boolean>>({});
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

  // Dedicated Product Detail Modal when clicking ANY card
  const [selectedProductModal, setSelectedProductModal] = useState<StoreProduct | null>(null);

  // Carousel references for scrolling with left and right buttons
  const newLaunchRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
  const topSellingRef = useRef<HTMLDivElement>(null);
  const catalogSectionRef = useRef<HTMLElement>(null);

  // Active SART Automotive Hub Tab
  const [activeHubTab, setActiveHubTab] = useState<StoreHubTab>('buy_sell');

  // Filter state for Spare Parts & Accessories (Boodmo / Autoduken style)
  const [partsCategoryFilter, setPartsCategoryFilter] = useState<string>('All Spares & Accessories');

  // Filter state for Mechanic & Garage Services (GoMechanic style)
  const [mechanicCategoryFilter, setMechanicCategoryFilter] = useState<string>('All Services');

  // CarDekho Buy / Sell view mode: 'buy' vs 'sell'
  const [cardekhoViewMode, setCardekhoViewMode] = useState<'buy' | 'sell'>('buy');
  // SART Universal Vehicle Selector for Buy / Sell Hub
  const [cardekhoSelectedType, setCardekhoSelectedType] = useState<string>('All'); // All, Car, Bike, Auto, Van, Lorry, Bus, EV
  const [cardekhoVehicleCondition, setCardekhoVehicleCondition] = useState<'new' | 'used'>('new');
  const [cardekhoSearchBy, setCardekhoSearchBy] = useState<'budget' | 'brand'>('budget');
  const [cardekhoBudgetFilter, setCardekhoBudgetFilter] = useState<string>('All Budgets');
  const [cardekhoBodyTypeFilter, setCardekhoBodyTypeFilter] = useState<string>('All');
  const [cardekhoBrandFilter, setCardekhoBrandFilter] = useState<string>('All Brands');
  const [cardekhoNavCategory, setCardekhoNavCategory] = useState<string>('all');
  const [cardekhoFormOpen, setCardekhoFormOpen] = useState<boolean>(true);
  const [sellFormVehicle, setSellFormVehicle] = useState({
    brand: 'Maruti Suzuki',
    model: 'Swift',
    year: '2021',
    kms: '35,000 km',
    expectedPrice: '5.5 Lakh',
    phone: '',
  });

  // Vehicle Showcase (CarDekho / BikeDekho) filters
  const [vehicleShowcaseType, setVehicleShowcaseType] = useState<'all' | 'Car' | 'Bike' | 'EV'>('all');
  const [vehicleShowcaseStatus, setVehicleShowcaseStatus] = useState<'all' | 'popular' | 'electric' | 'upcoming' | 'used'>('all');
  const [vehicleBudgetMax, setVehicleBudgetMax] = useState<number>(30); // in Lakhs

  // Vehicle Comparison Selector
  const [compareVehicleA, setCompareVehicleA] = useState<ComparisonVehicle>(COMPARISON_VEHICLES[0]);
  const [compareVehicleB, setCompareVehicleB] = useState<ComparisonVehicle>(COMPARISON_VEHICLES[1]);

  // Fuel Price Selected City
  const [selectedFuelCity, setSelectedFuelCity] = useState<string>('New Delhi');
  const [stationFilterCategory, setStationFilterCategory] = useState<string>('all');

  // CarDekho-style EMI Calculator States (User Image 3 Reference)
  const [emiCarBrand, setEmiCarBrand] = useState<string>('Tata');
  const [emiCarModel, setEmiCarModel] = useState<string>('Sierra');
  const [emiCarVariant, setEmiCarVariant] = useState<string>('Smart Plus (Petrol) 14.34 Lakh');
  const [emiOnRoadPrice, setEmiOnRoadPrice] = useState<number>(1434347);
  const [emiDownPayment, setEmiDownPayment] = useState<number>(143000);
  const [emiInterestRate, setEmiInterestRate] = useState<number>(9.8);
  const [emiLoanTenureYears, setEmiLoanTenureYears] = useState<number>(5);
  const [emiDailyKm, setEmiDailyKm] = useState<number>(20);
  const [activeTrendingTab, setActiveTrendingTab] = useState<'popular' | 'upcoming'>('popular');
  const [activeReviewFilter, setActiveReviewFilter] = useState<string>('All (509)');

  // EMI Calculator States
  const [loanAmount, setLoanAmount] = useState<number>(800000); // 8 Lakhs
  const [downPayment, setDownPayment] = useState<number>(150000); // 1.5 Lakhs
  const [loanTenureMonths, setLoanTenureMonths] = useState<number>(60); // 5 Years
  const [interestRate, setInterestRate] = useState<number>(9.5); // 9.5%

  // Calculated EMI
  const calculatedEmi = useMemo(() => {
    const principal = Math.max(0, loanAmount - downPayment);
    if (principal <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };
    const monthlyRate = interestRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTenureMonths)) / 
                (Math.pow(1 + monthlyRate, loanTenureMonths) - 1);
    const totalPayment = emi * loanTenureMonths;
    const totalInterest = totalPayment - principal;
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      principal
    };
  }, [loanAmount, downPayment, loanTenureMonths, interestRate]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 24/7 Roadside SOS State
  const [sosVehicleType, setSosVehicleType] = useState<string>('All');
  const [sosEmergencyIssue, setSosEmergencyIssue] = useState<string>('all');
  const [sosLocationName, setSosLocationName] = useState<string>('Anna Salai, Guindy, Chennai • NH-45 Highway km 18');
  const [showSosDispatchModal, setShowSosDispatchModal] = useState<boolean>(false);
  const [selectedSosService, setSelectedSosService] = useState<{
    title: string;
    icon: string;
    time: string;
    price: string;
    categoryTag: string;
    desc: string;
    features: string[];
    assignedUnit: string;
    driverName: string;
    driverPhone: string;
  } | null>(null);
  const [sosDispatchStage, setSosDispatchStage] = useState<'finding' | 'assigned' | 'en_route'>('finding');

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

  // Vehicle-specific categories based on selected vehicle type
  const availableVehicleCategories = useMemo(() => {
    return VEHICLE_SPECIFIC_CATEGORIES[selectedVehicleType] || VEHICLE_SPECIFIC_CATEGORIES['Universal'] || ['All Categories'];
  }, [selectedVehicleType]);

  // Modal available brands & models based on newVehicleType
  const modalAvailableBrands = useMemo(() => {
    return BRANDS_BY_VEHICLE[newVehicleType] || ['Universal Brands'];
  }, [newVehicleType]);

  const modalAvailableModels = useMemo(() => {
    return MODELS_BY_BRAND[newVehicleBrand] || ['All Models / Universal'];
  }, [newVehicleBrand]);

  // When modal vehicle type changes
  const handleModalVehicleTypeChange = (type: string) => {
    setNewVehicleType(type);
    const brands = BRANDS_BY_VEHICLE[type] || [];
    const firstBrand = brands[0] || 'Universal';
    setNewVehicleBrand(firstBrand);
    const models = MODELS_BY_BRAND[firstBrand] || [];
    setNewVehicleModel(models[0] || 'All Models');
  };

  const handleModalBrandChange = (brand: string) => {
    setNewVehicleBrand(brand);
    const models = MODELS_BY_BRAND[brand] || [];
    setNewVehicleModel(models[0] || 'All Models');
  };

  // When vehicle type changes, sync brand, model, and category
  const handleVehicleTypeChange = (type: string) => {
    setSelectedVehicleType(type);
    setSelectedVehicleCategory('All Categories');
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

  // Switch to a saved vehicle
  const handleSelectSavedVehicle = (v: SavedGarageVehicle) => {
    setActiveVehicleId(v.id);
    setSelectedVehicleType(v.type);
    setSelectedBrand(v.brand);
    setSelectedModel(v.model);
    setSelectedYear(v.year);
    setSelectedFuel(v.fuel);
    setSelectedVehicleCategory('All Categories');
    setGarageActive(true);
    setStoreBrowseMode('my_vehicle');
    setAppliedVehicleSearch({
      type: v.type,
      brand: v.brand,
      model: v.model,
      year: v.year,
      fuel: v.fuel,
      category: 'All Categories',
    });
    showToast(`Switched to your ${v.nickname || `${v.brand} ${v.model}`}`);
  };

  // Save New Vehicle from Modal
  const handleSaveNewVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `v-${Date.now()}`;
    const newVeh: SavedGarageVehicle = {
      id: newId,
      type: newVehicleType,
      brand: newVehicleBrand,
      model: newVehicleModel,
      year: newVehicleYear,
      fuel: newVehicleFuel,
      nickname: newVehicleNickname.trim() || `${newVehicleBrand} ${newVehicleModel}`,
      regNumber: newVehicleReg.trim().toUpperCase(),
    };

    setSavedVehicles((prev) => [newVeh, ...prev]);
    setActiveVehicleId(newId);
    setSelectedVehicleType(newVeh.type);
    setSelectedBrand(newVeh.brand);
    setSelectedModel(newVeh.model);
    setSelectedYear(newVeh.year);
    setSelectedFuel(newVeh.fuel);
    setSelectedVehicleCategory('All Categories');
    setGarageActive(true);
    setStoreBrowseMode('my_vehicle');
    setAppliedVehicleSearch({
      type: newVeh.type,
      brand: newVeh.brand,
      model: newVeh.model,
      year: newVeh.year,
      fuel: newVeh.fuel,
      category: 'All Categories',
    });

    setShowAddVehicleModal(false);
    setNewVehicleNickname('');
    setNewVehicleReg('');
    showToast(`Vehicle Added! Showing exact parts & services for ${newVeh.brand} ${newVeh.model}`);

    // Scroll to results
    setTimeout(() => {
      if (catalogSectionRef.current) {
        catalogSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  const handleApplyVehicleSearch = () => {
    setGarageActive(true);
    setStoreBrowseMode('my_vehicle');
    setAppliedVehicleSearch({
      type: selectedVehicleType,
      brand: selectedBrand,
      model: selectedModel,
      year: selectedYear,
      fuel: selectedFuel,
      category: selectedVehicleCategory,
    });
    showToast(`Showing parts & services for: ${selectedYear} ${selectedBrand} ${selectedModel} (${selectedVehicleType}) • ${selectedVehicleCategory}`);

    // Smooth scroll to catalog results section below
    setTimeout(() => {
      if (catalogSectionRef.current) {
        catalogSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleResetVehicle = () => {
    setSelectedVehicleType('Car');
    setSelectedVehicleCategory('All Categories');
    setSelectedBrand('Maruti Suzuki');
    setSelectedModel('Swift');
    setSelectedYear('2023');
    setGarageActive(false);
    setAppliedVehicleSearch(null);
    setStoreBrowseMode('general');
    showToast('Switched to General Store Catalog (All Products)');
  };

  // Filtered nearby stores list based on modal category filter tab
  const filteredNearbyStores = useMemo(() => {
    if (nearbyStoreFilter === 'all') return NEARBY_STORES;
    return NEARBY_STORES.filter((s) => s.hubCategory === nearbyStoreFilter);
  }, [nearbyStoreFilter]);

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
      // Main Category Pill Filter
      const matchCat =
        activeCategory === 'All' ||
        (activeCategory === 'Spare Parts' && item.category === 'Spare Parts') ||
        (activeCategory === 'Accessories' && item.category === 'Accessories') ||
        (activeCategory === 'Maintenance' && item.category === 'Maintenance') ||
        (activeCategory === 'Service Center' && (item.category === 'Service Center' || item.name.toLowerCase().includes('service center') || item.desc.toLowerCase().includes('service center'))) ||
        (activeCategory === 'Mechanic Service' && (item.category === 'Mechanic Service' || item.name.toLowerCase().includes('mechanic') || item.desc.toLowerCase().includes('mechanic'))) ||
        (activeCategory === 'Vehicle Modification' && (item.category === 'Vehicle Modification' || item.name.toLowerCase().includes('modification') || item.name.toLowerCase().includes('remap') || item.name.toLowerCase().includes('wrap'))) ||
        (activeCategory === 'Wash & Care' && item.category === 'Wash & Care') ||
        (activeCategory === 'Emergency' && item.category === 'Emergency');

      // Vehicle-Specific Top Category Filter
      let matchVehicleCat = true;
      if (storeBrowseMode === 'my_vehicle' && selectedVehicleCategory && selectedVehicleCategory !== 'All Categories') {
        const vCat = selectedVehicleCategory.toLowerCase();
        const itemBlob = `${item.name} ${item.desc} ${item.category} ${item.section} ${(item.includes || []).join(' ')}`.toLowerCase();
        
        if (vCat.includes('mechanic')) {
          matchVehicleCat = itemBlob.includes('mechanic') || item.category === 'Mechanic Service';
        } else if (vCat.includes('service center')) {
          matchVehicleCat = itemBlob.includes('service center') || item.category === 'Service Center';
        } else if (vCat.includes('modification') || vCat.includes('tuning') || vCat.includes('body kit') || vCat.includes('exhaust')) {
          matchVehicleCat = itemBlob.includes('modification') || itemBlob.includes('mod') || itemBlob.includes('tuning') || item.category === 'Vehicle Modification';
        } else if (vCat.includes('brake') || vCat.includes('rotor')) {
          matchVehicleCat = itemBlob.includes('brake') || itemBlob.includes('disc') || itemBlob.includes('shoe');
        } else if (vCat.includes('engine') || vCat.includes('transmission') || vCat.includes('gear')) {
          matchVehicleCat = itemBlob.includes('engine') || itemBlob.includes('gear') || itemBlob.includes('clutch') || itemBlob.includes('oil');
        } else if (vCat.includes('suspension') || vCat.includes('spring') || vCat.includes('steering')) {
          matchVehicleCat = itemBlob.includes('suspension') || itemBlob.includes('steering') || itemBlob.includes('spring');
        } else if (vCat.includes('detailing') || vCat.includes('wash') || vCat.includes('ceramic') || vCat.includes('coating')) {
          matchVehicleCat = itemBlob.includes('wash') || itemBlob.includes('coating') || itemBlob.includes('detailing') || itemBlob.includes('polish');
        } else if (vCat.includes('accessories') || vCat.includes('dashcam') || vCat.includes('helmet')) {
          matchVehicleCat = itemBlob.includes('accessories') || itemBlob.includes('dashcam') || itemBlob.includes('charger') || item.category === 'Accessories';
        } else if (vCat.includes('ev') || vCat.includes('charger') || vCat.includes('battery')) {
          matchVehicleCat = itemBlob.includes('charger') || itemBlob.includes('battery') || itemBlob.includes('ev') || item.vehicle === 'EV';
        } else if (vCat.includes('emergency') || vCat.includes('breakdown') || vCat.includes('towing') || vCat.includes('puncture')) {
          matchVehicleCat = itemBlob.includes('emergency') || itemBlob.includes('breakdown') || itemBlob.includes('towing') || item.category === 'Emergency';
        } else {
          // general token match
          const firstWord = vCat.split(' ')[0];
          matchVehicleCat = itemBlob.includes(firstWord);
        }
      }

      // Vehicle-Type Fitment Match (Only enforced when in 'my_vehicle' mode)
      let matchVehicleType = true;
      if (storeBrowseMode === 'my_vehicle') {
        const activeVehicleTypeToFilter = appliedVehicleSearch ? appliedVehicleSearch.type : selectedVehicleType;
        matchVehicleType =
          !activeVehicleTypeToFilter ||
          activeVehicleTypeToFilter === 'Universal' ||
          item.vehicle === 'Universal' ||
          item.vehicle === activeVehicleTypeToFilter ||
          (item.compatibleWith && item.compatibleWith.toLowerCase().includes(activeVehicleTypeToFilter.toLowerCase()));
      }

      const matchQuery =
        !q ||
        `${item.name} ${item.desc} ${item.vehicle} ${item.category} ${item.section} ${item.includes?.join(' ') || ''}`
          .toLowerCase()
          .includes(q);

      return matchCat && matchVehicleCat && matchVehicleType && matchQuery;
    });
  }, [activeCategory, selectedVehicleCategory, selectedVehicleType, appliedVehicleSearch, search, storeBrowseMode]);

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
          <div className="sart-super-hub-nav">
            {[
              { id: 'buy_sell', label: 'Buy / Sell Vehicle', icon: 'fa-car-side' },
              { id: 'spare_parts', label: 'Spare Parts & Accessories', icon: 'fa-gears' },
              { id: 'mechanic_service', label: 'Mechanic & Service', icon: 'fa-wrench' },
              { id: 'emergency_sos', label: '24/7 Roadside SOS', icon: 'fa-truck-medical' },
              { id: 'compare_vehicles', label: 'Compare Vehicles', icon: 'fa-code-compare' },
              { id: 'ev_fuel_stations', label: 'EV & Fuel Prices', icon: 'fa-charging-station' },
              { id: 'finance_insurance', label: 'EMI & Insurance', icon: 'fa-calculator' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`super-hub-tab-btn ${activeHubTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveHubTab(tab.id as StoreHubTab);
                  showToast(`Opened ${tab.label}`);
                }}
              >
                <div className="tab-icon-pill">
                  <i className={`fa-solid ${tab.icon}`}></i>
                </div>
                <span className="tab-main-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="store-container">

        {/* ------------------------------------------------------------------ */}
        {/* ================================================================== */}
        {/* TAB 1: BUY / SELL VEHICLE (CarDekho & BikeDekho UI)                 */}
        {/* ================================================================== */}
        {activeHubTab === 'buy_sell' && (
          <section className="cardekho-hub-view animate-pop">
            {/* Top Sub-Nav Bar (CarDekho Style: All Vehicles, New, Used, Sell) */}
            <div className="cardekho-header-subnav">
              <div className="cardekho-nav-links">
                <button
                  type="button"
                  className={`cardekho-nav-link-btn ${cardekhoVehicleCondition === 'new' ? 'active' : ''}`}
                  onClick={() => {
                    setCardekhoVehicleCondition('new');
                    setCardekhoNavCategory('all');
                  }}
                >
                  <i className="fa-solid fa-sparkles"></i>
                  <span>NEW VEHICLES</span>
                  <i className="fa-solid fa-chevron-down nav-arrow"></i>
                </button>

                <button
                  type="button"
                  className={`cardekho-nav-link-btn ${cardekhoVehicleCondition === 'used' ? 'active' : ''}`}
                  onClick={() => {
                    setCardekhoVehicleCondition('used');
                    setCardekhoNavCategory('used');
                  }}
                >
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>CERTIFIED USED</span>
                  <i className="fa-solid fa-chevron-down nav-arrow"></i>
                </button>

                <button
                  type="button"
                  className={`cardekho-nav-link-btn ${cardekhoViewMode === 'sell' ? 'active' : ''}`}
                  onClick={() => setCardekhoViewMode(cardekhoViewMode === 'sell' ? 'buy' : 'sell')}
                >
                  <i className="fa-solid fa-indian-rupee-sign"></i>
                  <span>SELL ANY VEHICLE • INSTANT VALUATION</span>
                </button>

                <button
                  type="button"
                  className="cardekho-nav-link-btn"
                  onClick={() => setActiveHubTab('compare_vehicles')}
                >
                  <i className="fa-solid fa-code-compare"></i>
                  <span>COMPARE</span>
                </button>

                <button
                  type="button"
                  className="cardekho-nav-link-btn"
                  onClick={() => setActiveHubTab('ev_fuel_stations')}
                >
                  <i className="fa-solid fa-charging-station"></i>
                  <span>EV &amp; FUEL PRICES</span>
                </button>
              </div>

              <div className="cardekho-subnav-right">
                <span className="inspection-badge-pill">
                  <i className="fa-solid fa-circle-check"></i> SART Certified All-Vehicle Expo
                </span>
              </div>
            </div>

            {/* If Sell Mode is Active */}
            {cardekhoViewMode === 'sell' ? (
              <div className="cardekho-sell-container animate-scale">
                <div className="sell-banner-left">
                  <span className="sell-flair"><i className="fa-solid fa-bolt"></i> INSTANT SELL IN 24 HOURS</span>
                  <h2>Sell Any Vehicle at Guaranteed Fair Market Price</h2>
                  <p>Cars, Bikes, Scooters, Autos, Commercial Vans, Lorries &amp; Buses. Free doorstep inspection and immediate bank transfer.</p>
                  <div className="sell-perks-list">
                    <div className="perk-item">
                      <i className="fa-solid fa-circle-check"></i>
                      <div><strong>Instant Online Valuation:</strong> Algorithmic fair pricing based on vehicle type, year and mileage.</div>
                    </div>
                    <div className="perk-item">
                      <i className="fa-solid fa-circle-check"></i>
                      <div><strong>Doorstep Evaluation:</strong> SART certified technician inspects at your home, depot or workshop.</div>
                    </div>
                    <div className="perk-item">
                      <i className="fa-solid fa-circle-check"></i>
                      <div><strong>Same-Day Payment:</strong> Direct RTGS/IMPS bank transfer before handover with complete RC transfer.</div>
                    </div>
                  </div>
                </div>

                <div className="sell-form-card">
                  <h3><i className="fa-solid fa-calculator"></i> Get Instant Price Quote</h3>
                  <div className="sell-form-grid">
                    <div className="form-field">
                      <label>Vehicle Category</label>
                      <select
                        value={cardekhoSelectedType}
                        onChange={(e) => setCardekhoSelectedType(e.target.value)}
                      >
                        <option value="Car">Car / SUV</option>
                        <option value="Bike">Bike / Scooter</option>
                        <option value="Auto">Auto (3-Wheeler)</option>
                        <option value="Van">Van / Commercial</option>
                        <option value="Lorry">Lorry / Truck</option>
                        <option value="Bus">Bus / Coach</option>
                        <option value="EV">Electric Vehicle (EV)</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Brand / Make</label>
                      <input
                        type="text"
                        value={sellFormVehicle.brand}
                        onChange={(e) => setSellFormVehicle({ ...sellFormVehicle, brand: e.target.value })}
                        placeholder="e.g. Maruti, Tata, Royal Enfield, Eicher"
                      />
                    </div>

                    <div className="form-field">
                      <label>Model &amp; Variant</label>
                      <input
                        type="text"
                        value={sellFormVehicle.model}
                        onChange={(e) => setSellFormVehicle({ ...sellFormVehicle, model: e.target.value })}
                        placeholder="e.g. Swift, Classic 350, Signa"
                      />
                    </div>

                    <div className="form-field">
                      <label>Registration Year</label>
                      <select
                        value={sellFormVehicle.year}
                        onChange={(e) => setSellFormVehicle({ ...sellFormVehicle, year: e.target.value })}
                      >
                        {['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'].map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Kilometers Driven</label>
                      <input
                        type="text"
                        value={sellFormVehicle.kms}
                        onChange={(e) => setSellFormVehicle({ ...sellFormVehicle, kms: e.target.value })}
                        placeholder="e.g. 35,000 km"
                      />
                    </div>

                    <div className="form-field">
                      <label>Your Mobile Number</label>
                      <input
                        type="tel"
                        value={sellFormVehicle.phone}
                        onChange={(e) => setSellFormVehicle({ ...sellFormVehicle, phone: e.target.value })}
                        placeholder="Enter 10-digit mobile number"
                      />
                    </div>
                  </div>

                  <div className="sell-estimated-quote-box">
                    <span className="quote-label">Estimated Resale Value:</span>
                    <span className="quote-value">₹{sellFormVehicle.expectedPrice}</span>
                  </div>

                  <button
                    type="button"
                    className="btn-sell-submit"
                    onClick={() => {
                      if (!sellFormVehicle.phone) {
                        showToast('Please enter mobile number for vehicle valuation callback');
                        return;
                      }
                      showToast(`Valuation booked for ${sellFormVehicle.year} ${sellFormVehicle.brand} ${sellFormVehicle.model}! Inspector will call ${sellFormVehicle.phone}`);
                    }}
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>Book Free Doorstep Evaluation &amp; Sell</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 1. HORIZONTAL ALL-VEHICLE "FIND YOUR RIGHT VEHICLE" FORM (First & Second Image Reference) */}
                <div className="cardekho-finder-hero-card">
                  {/* Top Bar: Title + SART All Vehicle Selector Chips */}
                  <div className="finder-header-row">
                    <div className="finder-title-col">
                      <h2 className="finder-title">Find your right vehicle</h2>
                      <p className="finder-subtitle">Search new &amp; certified used cars, bikes, scooters, autos, vans, trucks &amp; buses across India</p>
                    </div>

                    {/* New vs Used Switcher */}
                    <div className="finder-type-pills">
                      <button
                        type="button"
                        className={`finder-type-btn ${cardekhoVehicleCondition === 'new' ? 'active' : ''}`}
                        onClick={() => {
                          setCardekhoVehicleCondition('new');
                          setCardekhoNavCategory('all');
                        }}
                      >
                        New Vehicle
                      </button>
                      <button
                        type="button"
                        className={`finder-type-btn ${cardekhoVehicleCondition === 'used' ? 'active' : ''}`}
                        onClick={() => {
                          setCardekhoVehicleCondition('used');
                          setCardekhoNavCategory('used');
                        }}
                      >
                        Used Vehicle
                      </button>
                    </div>
                  </div>

                  {/* SART Multi-Vehicle Category Selector Strip */}
                  <div className="sart-vehicle-type-tabs">
                    {[
                      { id: 'All', label: 'All Vehicles', icon: 'fa-globe' },
                      { id: 'Car', label: 'Cars & SUVs', icon: 'fa-car' },
                      { id: 'Bike', label: 'Bikes & Scooters', icon: 'fa-motorcycle' },
                      { id: 'Auto', label: '3-Wheelers (Auto)', icon: 'fa-gas-pump' },
                      { id: 'Van', label: 'Vans & Eeco', icon: 'fa-van-shuttle' },
                      { id: 'Lorry', label: 'Lorries & Trucks', icon: 'fa-truck-moving' },
                      { id: 'Bus', label: 'Buses & Coaches', icon: 'fa-bus' },
                      { id: 'EV', label: 'Electric (EV)', icon: 'fa-bolt' },
                    ].map((vType) => (
                      <button
                        key={vType.id}
                        type="button"
                        className={`sart-vtype-tab-btn ${cardekhoSelectedType === vType.id ? 'active' : ''}`}
                        onClick={() => {
                          setCardekhoSelectedType(vType.id);
                          showToast(`Showing ${vType.label}`);
                        }}
                      >
                        <i className={`fa-solid ${vType.icon}`}></i>
                        <span>{vType.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Horizontal Radio Selector: By Budget vs By Brand */}
                  <div className="finder-radio-row">
                    <label className="radio-label-item">
                      <input
                        type="radio"
                        name="cardekhoSearchBy"
                        value="budget"
                        checked={cardekhoSearchBy === 'budget'}
                        onChange={() => setCardekhoSearchBy('budget')}
                      />
                      <span className="radio-dot"></span>
                      <span>By Budget</span>
                    </label>

                    <label className="radio-label-item">
                      <input
                        type="radio"
                        name="cardekhoSearchBy"
                        value="brand"
                        checked={cardekhoSearchBy === 'brand'}
                        onChange={() => setCardekhoSearchBy('brand')}
                      />
                      <span className="radio-dot"></span>
                      <span>By Brand</span>
                    </label>
                  </div>

                  {/* HORIZONTAL FORM INPUTS ROW (Cardekho Image 1 / Autoduken Image 2 Reference) */}
                  <div className="cardekho-horizontal-form-row">
                    {cardekhoSearchBy === 'budget' ? (
                      <>
                        {/* 1. Select Budget Range */}
                        <div className="finder-field-col">
                          <label className="field-caption">Select Budget Range</label>
                          <div className="select-box-wrap">
                            <select
                              value={cardekhoBudgetFilter}
                              onChange={(e) => setCardekhoBudgetFilter(e.target.value)}
                            >
                              <option value="All Budgets">All Budgets</option>
                              <option value="Under 2 Lakh">Under ₹2 Lakh (Bikes &amp; Scooters)</option>
                              <option value="2 - 5 Lakh">₹2 - 5 Lakh (Autos / Entry Cars)</option>
                              <option value="5 - 10 Lakh">₹5 - 10 Lakh (Hatchbacks &amp; Compact)</option>
                              <option value="10 - 20 Lakh">₹10 - 20 Lakh (SUVs &amp; Vans)</option>
                              <option value="20 - 50 Lakh">₹20 - 50 Lakh (Heavy Lorries &amp; Premium)</option>
                              <option value="Above 50 Lakh">Above ₹50 Lakh (Luxury &amp; Buses)</option>
                            </select>
                            <i className="fa-solid fa-chevron-down"></i>
                          </div>
                        </div>

                        {/* 2. Select Body Type / Category */}
                        <div className="finder-field-col">
                          <label className="field-caption">Body Type / Class</label>
                          <div className="select-box-wrap">
                            <select
                              value={cardekhoBodyTypeFilter}
                              onChange={(e) => setCardekhoBodyTypeFilter(e.target.value)}
                            >
                              <option value="All">All Vehicle Classes</option>
                              <option value="SUV">SUV / Compact SUV</option>
                              <option value="Hatchback">Hatchback</option>
                              <option value="Sedan">Sedan</option>
                              <option value="Bike">Motorcycle / Bike</option>
                              <option value="Scooter">Scooter</option>
                              <option value="Auto">Passenger Auto</option>
                              <option value="Van">Passenger / Cargo Van</option>
                              <option value="Truck">Heavy Commercial Truck</option>
                              <option value="Bus">Luxury Tourist Bus</option>
                            </select>
                            <i className="fa-solid fa-chevron-down"></i>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* 1. Select Brand */}
                        <div className="finder-field-col">
                          <label className="field-caption">Select Maker / Brand</label>
                          <div className="select-box-wrap">
                            <select
                              value={cardekhoBrandFilter}
                              onChange={(e) => setCardekhoBrandFilter(e.target.value)}
                            >
                              <option value="All Brands">All Vehicle Makers</option>
                              <option value="Tata Motors">Tata Motors</option>
                              <option value="Hyundai">Hyundai</option>
                              <option value="Mahindra">Mahindra</option>
                              <option value="Maruti Suzuki">Maruti Suzuki</option>
                              <option value="Toyota">Toyota</option>
                              <option value="Royal Enfield">Royal Enfield</option>
                              <option value="Yamaha">Yamaha</option>
                              <option value="KTM">KTM</option>
                              <option value="Honda 2Wheelers">Honda 2Wheelers</option>
                              <option value="TVS Motor">TVS Motor</option>
                              <option value="Bajaj Auto">Bajaj Auto</option>
                              <option value="Ashok Leyland">Ashok Leyland</option>
                              <option value="Volvo Buses">Volvo</option>
                              <option value="Force Motors">Force Motors</option>
                              <option value="Ather Energy">Ather</option>
                              <option value="Ola Electric">Ola</option>
                            </select>
                            <i className="fa-solid fa-chevron-down"></i>
                          </div>
                        </div>

                        {/* 2. Fuel / Powertrain */}
                        <div className="finder-field-col">
                          <label className="field-caption">Fuel / Powertrain</label>
                          <div className="select-box-wrap">
                            <select
                              value={cardekhoBodyTypeFilter}
                              onChange={(e) => setCardekhoBodyTypeFilter(e.target.value)}
                            >
                              <option value="All">All Fuel Types</option>
                              <option value="Petrol">Petrol</option>
                              <option value="Diesel">Diesel</option>
                              <option value="CNG">CNG</option>
                              <option value="Electric">100% Electric (EV)</option>
                            </select>
                            <i className="fa-solid fa-chevron-down"></i>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Search Button */}
                    <div className="finder-btn-col">
                      <button
                        type="button"
                        className="btn-cardekho-search-orange"
                        onClick={() => {
                          showToast(`Found vehicles matching ${cardekhoSelectedType} • ${cardekhoSearchBy === 'budget' ? cardekhoBudgetFilter : cardekhoBrandFilter}`);
                        }}
                      >
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <span>Search</span>
                      </button>
                    </div>
                  </div>

                  {/* Horizontal Category Quick Filter Strip */}
                  <div className="cardekho-category-chips-strip">
                    {[
                      { id: 'all', label: 'All Showcase Vehicles', icon: 'fa-globe' },
                      { id: 'popular', label: 'Get Festive Offers (Popular)', icon: 'fa-fire' },
                      { id: 'electric', label: 'Electric Vehicles (EV)', icon: 'fa-bolt' },
                      { id: 'upcoming', label: 'Upcoming 2025 Launches', icon: 'fa-calendar-star' },
                      { id: 'used', label: 'Certified Used Vehicles', icon: 'fa-certificate' },
                    ].map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        className={`cardekho-category-chip ${cardekhoNavCategory === chip.id ? 'active' : ''}`}
                        onClick={() => {
                          setCardekhoNavCategory(chip.id);
                          if (chip.id === 'used') setCardekhoVehicleCondition('used');
                          else if (chip.id === 'all' || chip.id === 'popular' || chip.id === 'upcoming') setCardekhoVehicleCondition('new');
                        }}
                      >
                        <i className={`fa-solid ${chip.icon}`}></i>
                        <span>{chip.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. FULL-PAGE CARDS GRID: Even without choosing anything, ALL vehicles show (Third & Fourth Images Reference) */}
                <div className="cardekho-content-sections-wrap">

                  {/* SECTION 1: GET FESTIVE OFFERS / POPULAR VEHICLES (Full-Width Cardekho 3rd Image Style) */}
                  {(cardekhoNavCategory === 'all' || cardekhoNavCategory === 'popular') && (
                    <div className="cardekho-catalog-section">
                      <div className="section-title-line">
                        <div>
                          <h3 className="section-title-text">Get Festive Offers for Popular Vehicles</h3>
                          <p className="section-title-sub">Explore best-selling cars, bikes, scooters &amp; commercial vehicles with verified dealer discounts</p>
                        </div>
                        <span className="section-count-tag">
                          {VEHICLE_SHOWCASE_DATA.filter(v => (cardekhoSelectedType === 'All' || v.type === cardekhoSelectedType) && v.status === 'popular').length} Vehicles
                        </span>
                      </div>

                      <div className="cardekho-cards-row full-width-grid">
                        {VEHICLE_SHOWCASE_DATA
                          .filter((v) => (cardekhoSelectedType === 'All' || v.type === cardekhoSelectedType) && v.status === 'popular')
                          .map((veh) => (
                            <div key={veh.id} className="cardekho-vehicle-card">
                              <div className="cardekho-card-media">
                                <span className="media-badge badge-popular">🔥 {veh.type}</span>
                                <img src={veh.image} alt={veh.name} loading="lazy" />
                                <div className="card-media-tags">
                                  <span><i className="fa-solid fa-gas-pump"></i> {veh.fuel}</span>
                                  <span><i className="fa-solid fa-gauge-high"></i> {veh.mileage}</span>
                                </div>
                              </div>

                              <div className="cardekho-card-body">
                                <div className="veh-type-tag-small">{veh.type} • {veh.brand}</div>
                                <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                <div className="car-price">{veh.priceRange}</div>
                                <div className="car-rating-row">
                                  <span className="rating-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
                                  <span className="seating-pill">{veh.seating || 'Standard'}</span>
                                </div>

                                <div className="car-features-list">
                                  {veh.features.slice(0, 3).map((f) => (
                                    <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                  ))}
                                </div>

                                <div className="cardekho-card-buttons">
                                  <button
                                    type="button"
                                    className="btn-cardekho-offer"
                                    onClick={() => showToast(`Checking Festive Offers for ${veh.name} in ${selectedFuelCity}...`)}
                                  >
                                    Get Navaratri Offers
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-cardekho-test-drive"
                                    onClick={() => showToast(`Test Drive Booked for ${veh.name}! Authorized dealer will call you.`)}
                                  >
                                    <i className="fa-solid fa-key"></i> Test Drive
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: 100% ELECTRIC VEHICLES ACROSS SART */}
                  {(cardekhoNavCategory === 'all' || cardekhoNavCategory === 'electric') && (
                    <div className="cardekho-catalog-section">
                      <div className="section-title-line">
                        <div>
                          <h3 className="section-title-text">⚡ Electric Vehicles (Cars, Bikes, Autos &amp; Buses)</h3>
                          <p className="section-title-sub">Zero-emission mobility with certified battery range, fast charging &amp; state subsidy rates</p>
                        </div>
                        <span className="section-count-tag tag-ev">
                          {VEHICLE_SHOWCASE_DATA.filter(v => (cardekhoSelectedType === 'All' || v.type === cardekhoSelectedType) && v.status === 'electric').length} EV Models
                        </span>
                      </div>

                      <div className="cardekho-cards-row full-width-grid">
                        {VEHICLE_SHOWCASE_DATA
                          .filter((v) => (cardekhoSelectedType === 'All' || v.type === cardekhoSelectedType) && v.status === 'electric')
                          .map((veh) => (
                            <div key={veh.id} className="cardekho-vehicle-card ev-card-accent">
                              <div className="cardekho-card-media">
                                <span className="media-badge badge-ev">⚡ {veh.type} EV</span>
                                <img src={veh.image} alt={veh.name} loading="lazy" />
                                <div className="card-media-tags">
                                  <span><i className="fa-solid fa-bolt"></i> {veh.mileage}</span>
                                </div>
                              </div>

                              <div className="cardekho-card-body">
                                <div className="veh-type-tag-small">{veh.type} • {veh.brand}</div>
                                <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                <div className="car-price">{veh.priceRange}</div>
                                <div className="car-rating-row">
                                  <span className="rating-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
                                  <span className="seating-pill">{veh.seating || 'Electric Unit'}</span>
                                </div>

                                <div className="car-features-list">
                                  {veh.features.slice(0, 3).map((f) => (
                                    <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                  ))}
                                </div>

                                <div className="cardekho-card-buttons">
                                  <button
                                    type="button"
                                    className="btn-cardekho-offer"
                                    onClick={() => showToast(`Fast charging station locator opened for ${veh.name}`)}
                                  >
                                    View EV Subsidy
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-cardekho-test-drive"
                                    onClick={() => showToast(`EV Test Drive Booked for ${veh.name}!`)}
                                  >
                                    <i className="fa-solid fa-key"></i> Test Drive
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* SECTION 3: UPCOMING 2025 VEHICLE LAUNCHES */}
                  {(cardekhoNavCategory === 'all' || cardekhoNavCategory === 'upcoming') && (
                    <div className="cardekho-catalog-section">
                      <div className="section-title-line">
                        <div>
                          <h3 className="section-title-text">🚀 Upcoming Vehicle Launches 2025</h3>
                          <p className="section-title-sub">Anticipated cars, bikes and commercial vehicles with expected pricing &amp; reveals</p>
                        </div>
                        <span className="section-count-tag tag-upcoming">
                          {VEHICLE_SHOWCASE_DATA.filter(v => (cardekhoSelectedType === 'All' || v.type === cardekhoSelectedType) && v.status === 'upcoming').length} Launches
                        </span>
                      </div>

                      <div className="cardekho-cards-row full-width-grid">
                        {VEHICLE_SHOWCASE_DATA
                          .filter((v) => (cardekhoSelectedType === 'All' || v.type === cardekhoSelectedType) && v.status === 'upcoming')
                          .map((veh) => (
                            <div key={veh.id} className="cardekho-vehicle-card">
                              <div className="cardekho-card-media">
                                <span className="media-badge badge-upcoming">🚀 Upcoming {veh.type}</span>
                                <img src={veh.image} alt={veh.name} loading="lazy" />
                                {veh.launchDate && (
                                  <div className="card-media-tags">
                                    <span><i className="fa-regular fa-clock"></i> {veh.launchDate}</span>
                                  </div>
                                )}
                              </div>

                              <div className="cardekho-card-body">
                                <div className="veh-type-tag-small">{veh.type} • {veh.brand}</div>
                                <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                <div className="car-price">{veh.priceRange}</div>
                                <div className="launch-expected-banner">
                                  <i className="fa-solid fa-calendar-check"></i> {veh.launchDate}
                                </div>

                                <div className="car-features-list">
                                  {veh.features.slice(0, 3).map((f) => (
                                    <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                  ))}
                                </div>

                                <div className="cardekho-card-buttons">
                                  <button
                                    type="button"
                                    className="btn-cardekho-alert"
                                    onClick={() => showToast(`Alert set for ${veh.name}! We will notify you upon launch.`)}
                                  >
                                    <i className="fa-regular fa-bell"></i> Set Launch Alert
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* SECTION 4: CERTIFIED USED VEHICLES (CARS, BIKES, COMMERCIAL) */}
                  {(cardekhoNavCategory === 'all' || cardekhoNavCategory === 'used') && (
                    <div className="cardekho-catalog-section">
                      <div className="section-title-line">
                        <div>
                          <h3 className="section-title-text">🛡️ SART Certified Pre-Owned Vehicles (200+ Point Inspection)</h3>
                          <p className="section-title-sub">Verified pre-owned cars, bikes and commercial trucks with warranty, 7-day money back &amp; free RC transfer</p>
                        </div>
                        <span className="section-count-tag tag-used">
                          {VEHICLE_SHOWCASE_DATA.filter(v => (cardekhoSelectedType === 'All' || v.type === cardekhoSelectedType) && v.status === 'used').length} Verified Units
                        </span>
                      </div>

                      <div className="cardekho-cards-row full-width-grid">
                        {VEHICLE_SHOWCASE_DATA
                          .filter((v) => (cardekhoSelectedType === 'All' || v.type === cardekhoSelectedType) && v.status === 'used')
                          .map((veh) => (
                            <div key={veh.id} className="cardekho-vehicle-card used-card-border">
                              <div className="cardekho-card-media">
                                <span className="media-badge badge-used">🛡️ Certified {veh.type}</span>
                                <img src={veh.image} alt={veh.name} loading="lazy" />
                                <div className="card-media-tags">
                                  <span><i className="fa-solid fa-location-dot"></i> {veh.location || selectedFuelCity}</span>
                                </div>
                              </div>

                              <div className="cardekho-card-body">
                                <div className="veh-type-tag-small">{veh.type} • {veh.brand}</div>
                                <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                <div className="car-price">{veh.priceRange}</div>

                                <div className="used-car-stats-grid">
                                  <span><i className="fa-regular fa-calendar"></i> {veh.year}</span>
                                  <span><i className="fa-solid fa-road"></i> {veh.kmsDriven}</span>
                                  <span><i className="fa-solid fa-user"></i> {veh.owners}</span>
                                  <span><i className="fa-solid fa-gas-pump"></i> {veh.fuel}</span>
                                </div>

                                <div className="cardekho-card-buttons">
                                  <button
                                    type="button"
                                    className="btn-cardekho-inspection"
                                    onClick={() => showToast(`Viewing 200-point inspection report for ${veh.name}`)}
                                  >
                                    <i className="fa-solid fa-file-shield"></i> Inspection Report
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-cardekho-test-drive"
                                    onClick={() => showToast(`Home Test Drive scheduled for ${veh.name}!`)}
                                  >
                                    <i className="fa-solid fa-key"></i> Book Test Drive
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* SART POPULAR AUTOMOTIVE BRANDS IN INDIA */}
                  <div className="cardekho-brands-strip-section">
                    <h3 className="section-title-text">Popular Manufacturers Across Vehicles in India</h3>
                    <div className="cardekho-brands-logos-grid">
                      {[
                        { name: 'Tata Motors', icon: 'fa-shield-halved', type: 'Cars, Trucks, EV, Buses' },
                        { name: 'Maruti Suzuki', icon: 'fa-car', type: 'Cars & Vans' },
                        { name: 'Mahindra', icon: 'fa-truck-pickup', type: 'SUVs & 3-Wheelers' },
                        { name: 'Hyundai', icon: 'fa-bolt', type: 'Cars & Electric' },
                        { name: 'Royal Enfield', icon: 'fa-motorcycle', type: 'Cruiser Motorcycles' },
                        { name: 'Honda', icon: 'fa-road', type: 'Cars, Bikes & Scooters' },
                        { name: 'Ashok Leyland', icon: 'fa-truck-moving', type: 'Lorries & Commercial Buses' },
                        { name: 'Bajaj Auto', icon: 'fa-gas-pump', type: '3-Wheeler Auto & Bikes' },
                        { name: 'Volvo Buses', icon: 'fa-bus', type: 'Luxury Coaches' },
                        { name: 'Ather & Ola', icon: 'fa-charging-station', type: 'Smart EV 2-Wheelers' },
                      ].map((brand) => (
                        <div
                          key={brand.name}
                          className="brand-logo-card"
                          onClick={() => {
                            setCardekhoBrandFilter(brand.name.split(' ')[0]);
                            setCardekhoSearchBy('brand');
                            showToast(`Filtered for ${brand.name} models`);
                          }}
                        >
                          <i className={`fa-solid ${brand.icon}`}></i>
                          <span className="brand-title">{brand.name}</span>
                          <span className="brand-sub">{brand.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </>
            )}
          </section>
        )}

        {activeHubTab === 'spare_parts' && (
          <section className="boodmo-parts-view animate-pop">
            {/* 1. BOODMO VEHICLE FITMENT SELECTOR BAR: Type, Brand, Model, Year, Fuel */}
            <div className="boodmo-fitment-selector-card">
              <div className="fitment-header-row">
                <div className="fitment-title-wrap">
                  <i className="fa-solid fa-car-tunnel"></i>
                  <div>
                    <h3>Select Your Vehicle for 100% Guaranteed Fitment</h3>
                    <p>Enter make, model &amp; year to see compatible OEM &amp; OES genuine spare parts &amp; accessories.</p>
                  </div>
                </div>

                {appliedVehicleSearch && (
                  <div className="active-fitment-badge">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Fitment Active: <strong>{appliedVehicleSearch.year} {appliedVehicleSearch.brand} {appliedVehicleSearch.model}</strong></span>
                  </div>
                )}
              </div>

              <div className="boodmo-dropdown-row">
                {/* 1. Vehicle Type */}
                <div className="boodmo-select-col">
                  <label><i className="fa-solid fa-shapes"></i> 1. Vehicle Type</label>
                  <select
                    value={selectedVehicleType}
                    onChange={(e) => handleVehicleTypeChange(e.target.value)}
                  >
                    {VEHICLE_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Brand / Make */}
                <div className="boodmo-select-col">
                  <label><i className="fa-solid fa-copyright"></i> 2. Brand / Make</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                  >
                    {availableBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Model */}
                <div className="boodmo-select-col">
                  <label><i className="fa-solid fa-car-rear"></i> 3. Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    {availableModels.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Year */}
                <div className="boodmo-select-col">
                  <label><i className="fa-regular fa-calendar"></i> 4. Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {YEARS_LIST.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* 5. Variant / Fuel */}
                <div className="boodmo-select-col">
                  <label><i className="fa-solid fa-gas-pump"></i> 5. Fuel / Variant</label>
                  <select
                    value={selectedFuel}
                    onChange={(e) => setSelectedFuel(e.target.value)}
                  >
                    {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Apply Button */}
                <div className="boodmo-btn-col">
                  <button
                    type="button"
                    className="btn-boodmo-find-parts"
                    onClick={handleApplyVehicleSearch}
                  >
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>Find Parts</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. SPLIT LAYOUT: Left Spare Categories Sidebar + Right E-Commerce Grid */}
            <div className="store-split-layout">
              {/* LEFT SIDEBAR: Spare Parts & Accessories Categories */}
              <aside className="store-left-sidebar">
                <div className="sidebar-card">
                  <div className="sidebar-header">
                    <h4><i className="fa-solid fa-boxes-stacked"></i> Spares Directory</h4>
                    <span className="sidebar-total-badge">{ALL_STORE_PRODUCTS.filter(p => !p.isService).length} Parts</span>
                  </div>

                  <div className="sidebar-nav-pills">
                    {[
                      { id: 'All Spares & Accessories', label: 'All Spares & Accessories', icon: 'fa-globe' },
                      { id: 'Engine & Fluids', label: 'Engine Oil & Fluids', icon: 'fa-oil-can' },
                      { id: 'Braking System', label: 'Brakes & Discs', icon: 'fa-circle-dot' },
                      { id: 'Filters & Plugs', label: 'Filters & Spark Plugs', icon: 'fa-filter' },
                      { id: 'Batteries & Electricals', label: 'Batteries & Alternator', icon: 'fa-car-battery' },
                      { id: 'Tyres & Wheels', label: 'Tyres & Wheel Care', icon: 'fa-circle-notch' },
                      { id: 'Lighting & Bulbs', label: 'LED Headlights & Bulbs', icon: 'fa-lightbulb' },
                      { id: 'Smart Electronics', label: 'Dashcam & Gadgets', icon: 'fa-video' },
                      { id: 'Accessories & Car Care', label: 'Accessories & Care Kit', icon: 'fa-spray-can-sparkles' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`sidebar-nav-item ${partsCategoryFilter === cat.id ? 'active' : ''}`}
                        onClick={() => setPartsCategoryFilter(cat.id)}
                      >
                        <i className={`fa-solid ${cat.icon}`}></i>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Boodmo Quality Assurance Box */}
                  <div className="sidebar-trust-box boodmo-trust">
                    <i className="fa-solid fa-barcode"></i>
                    <div>
                      <strong>OEM / OES Verified</strong>
                      <p>Every product includes genuine part number certification &amp; 10-day replacement.</p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* RIGHT CONTENT: Products Grid (Boodmo / Autoduken E-Commerce style) */}
              <main className="store-right-content">
                <div className="content-top-status-bar">
                  <div>
                    <h3 className="content-heading">
                      {appliedVehicleSearch
                        ? `Guaranteed Fitment for ${appliedVehicleSearch.brand} ${appliedVehicleSearch.model} (${appliedVehicleSearch.year})`
                        : 'Universal Genuine Spare Parts & Accessories'}
                    </h3>
                    <p className="content-subtext">
                      Showing verified replacement parts, synthetic lubricants, performance accessories &amp; fast doorstep dispatch.
                    </p>
                  </div>

                  {/* Search Bar for Spares */}
                  <div className="catalog-search-wrap parts-search-box">
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search part name, part number, brand..."
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

                {/* Product E-Commerce Cards Grid */}
                <div className="boodmo-products-grid">
                  {ALL_STORE_PRODUCTS
                    .filter((item) => !item.isService)
                    .filter((item) => {
                      if (partsCategoryFilter === 'All Spares & Accessories') return true;
                      const blob = `${item.name} ${item.desc} ${item.section} ${item.category}`.toLowerCase();
                      if (partsCategoryFilter === 'Engine & Fluids') return blob.includes('oil') || blob.includes('fluid') || blob.includes('synthetic');
                      if (partsCategoryFilter === 'Braking System') return blob.includes('brake') || blob.includes('disc') || blob.includes('pad');
                      if (partsCategoryFilter === 'Filters & Plugs') return blob.includes('filter') || blob.includes('plug');
                      if (partsCategoryFilter === 'Batteries & Electricals') return blob.includes('battery') || blob.includes('starter') || blob.includes('chamber');
                      if (partsCategoryFilter === 'Tyres & Wheels') return blob.includes('tyre') || blob.includes('puncture') || blob.includes('tpms');
                      if (partsCategoryFilter === 'Lighting & Bulbs') return blob.includes('led') || blob.includes('light') || blob.includes('bulb');
                      if (partsCategoryFilter === 'Smart Electronics') return blob.includes('dashcam') || blob.includes('gps') || blob.includes('charger') || blob.includes('phone mount');
                      if (partsCategoryFilter === 'Accessories & Car Care') return blob.includes('wax') || blob.includes('coating') || blob.includes('wiper') || blob.includes('horn');
                      return true;
                    })
                    .filter((item) => {
                      if (!search.trim()) return true;
                      const q = search.trim().toLowerCase();
                      return `${item.name} ${item.desc} ${item.vehicle} ${item.compatibleWith || ''}`.toLowerCase().includes(q);
                    })
                    .map((product) => (
                      <div
                        key={product.id}
                        className="boodmo-product-card cursor-pointer"
                        onClick={() => setSelectedProductModal(product)}
                      >
                        <div className="boodmo-card-media">
                          {product.badge && (
                            <span className="boodmo-badge-ribbon">{product.badge}</span>
                          )}
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
                          >
                            <i className={wishlist.includes(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                          </button>
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div className="boodmo-fitment-indicator">
                            <i className="fa-solid fa-shield-check"></i>
                            <span>Compatible: {product.compatibleWith || product.vehicle || 'Universal'}</span>
                          </div>
                        </div>

                        <div className="boodmo-card-content">
                          <div className="boodmo-rating-row">
                            <div className="rating-badge">
                              <i className="fa-solid fa-star"></i> {product.rating || 4.8} <span>({product.reviewsCount || 150})</span>
                            </div>
                            <span className="delivery-time-pill">
                              <i className="fa-solid fa-truck-fast"></i> {product.deliveryTime || 'In 24-48 Hrs'}
                            </span>
                          </div>

                          <h4 className="boodmo-product-title" title={product.name}>{product.name}</h4>
                          <p className="boodmo-product-desc">{product.desc}</p>

                          <div className="boodmo-price-row">
                            <div className="price-info">
                              <span className="current-price">{formatPrice(product.price)}</span>
                              {product.originalPrice && (
                                <span className="original-price">{formatPrice(product.originalPrice)}</span>
                              )}
                            </div>
                            <button
                              type="button"
                              className="btn-boodmo-add-cart"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                            >
                              <i className="fa-solid fa-cart-shopping"></i>
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </main>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* TAB 3: MECHANIC & SERVICE PACKAGES (GoMechanic Style)               */}
        {/* ================================================================== */}
        {activeHubTab === 'mechanic_service' && (
          <section className="gomechanic-hub-view animate-pop">
            {/* GoMechanic Service Guarantee Banner */}
            <div className="gomechanic-hero-banner">
              <div className="gomechanic-banner-text">
                <span className="gm-badge"><i className="fa-solid fa-wrench"></i> GOMECHANIC CERTIFIED AUTO REPAIR</span>
                <h2>Expert Doorstep &amp; Workshop Car &amp; Bike Services</h2>
                <p>Free doorstep pick-up &amp; drop, genuine OEM spares, 1000 km warranty &amp; live service updates on SART.</p>
              </div>

              <div className="gomechanic-perks-row">
                <div className="gm-perk"><i className="fa-solid fa-truck-pickup"></i><span>Free Pick-up &amp; Drop</span></div>
                <div className="gm-perk"><i className="fa-solid fa-shield-halved"></i><span>1000 km / 1 Month Warranty</span></div>
                <div className="gm-perk"><i className="fa-solid fa-user-check"></i><span>Dedicated Service Buddy</span></div>
                <div className="gm-perk"><i className="fa-solid fa-file-invoice-dollar"></i><span>Up to 40% Cheaper than Dealerships</span></div>
              </div>
            </div>

            {/* Split Layout: Left Service Categories Sidebar + Right Service Packages Grid */}
            <div className="store-split-layout">
              {/* LEFT SIDEBAR: GoMechanic Service Categories */}
              <aside className="store-left-sidebar">
                <div className="sidebar-card">
                  <div className="sidebar-header">
                    <h4><i className="fa-solid fa-screwdriver-wrench"></i> Service Packages</h4>
                    <span className="sidebar-total-badge">{ALL_STORE_PRODUCTS.filter(p => p.isService).length} Packages</span>
                  </div>

                  <div className="sidebar-nav-pills">
                    {[
                      { id: 'All Services', label: 'All Workshop Services', icon: 'fa-globe' },
                      { id: 'Periodic Services', label: 'Periodic Maintenance', icon: 'fa-oil-can' },
                      { id: 'AC Service & Repair', label: 'AC Deep Clean & Gas', icon: 'fa-snowflake' },
                      { id: 'Brakes & Clutch', label: 'Brakes & Clutch Overhaul', icon: 'fa-circle-dot' },
                      { id: 'Tyres & Wheel Care', label: 'Tyres & Wheel Alignment', icon: 'fa-circle-notch' },
                      { id: 'Cleaning & Detailing', label: 'Car Spa & Ceramic Polish', icon: 'fa-sparkles' },
                      { id: 'Custom Tuning & Mods', label: 'ECU Remap & Modifications', icon: 'fa-wand-magic-sparkles' },
                      { id: 'Authorized Workshop', label: 'Authorized Center Stamp', icon: 'fa-building-shield' },
                      { id: 'Heavy Commercial Fleet', label: 'Heavy Truck & Bus Fleet', icon: 'fa-truck-moving' },
                    ].map((srv) => (
                      <button
                        key={srv.id}
                        type="button"
                        className={`sidebar-nav-item ${mechanicCategoryFilter === srv.id ? 'active' : ''}`}
                        onClick={() => setMechanicCategoryFilter(srv.id)}
                      >
                        <i className={`fa-solid ${srv.icon}`}></i>
                        <span>{srv.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* GoMechanic Live Support Box */}
                  <div className="sidebar-trust-box gomechanic-trust">
                    <i className="fa-solid fa-headset"></i>
                    <div>
                      <strong>Need Advice on Repairs?</strong>
                      <p>Talk to our master automotive mechanics for instant diagnosis &amp; upfront pricing.</p>
                      <button
                        type="button"
                        className="btn-call-mechanic-sidebar"
                        onClick={() => showToast('Calling SART Mechanic Advisor Hotline (1800-SART-TECH)...')}
                      >
                        <i className="fa-solid fa-phone"></i> Call Service Advisor
                      </button>
                    </div>
                  </div>
                </div>
              </aside>

              {/* RIGHT CONTENT: GoMechanic Service Package Cards */}
              <main className="store-right-content">
                <div className="content-top-status-bar">
                  <div>
                    <h3 className="content-heading">Select Vehicle Service or Custom Repair Package</h3>
                    <p className="content-subtext">
                      All packages include multi-point vehicle safety health audit, transparent pricing, and contactless handover.
                    </p>
                  </div>

                  {/* Vehicle Context Tag */}
                  <div className="gomechanic-active-veh-pill">
                    <i className="fa-solid fa-car"></i>
                    <span>Service For: <strong>{selectedBrand} {selectedModel} ({selectedYear})</strong></span>
                  </div>
                </div>

                <div className="gomechanic-packages-grid">
                  {ALL_STORE_PRODUCTS
                    .filter((item) => item.isService)
                    .filter((item) => {
                      if (mechanicCategoryFilter === 'All Services') return true;
                      const blob = `${item.name} ${item.desc} ${item.section} ${item.category}`.toLowerCase();
                      if (mechanicCategoryFilter === 'Periodic Services') return blob.includes('periodic') || blob.includes('engine oil') || blob.includes('tune-up');
                      if (mechanicCategoryFilter === 'AC Service & Repair') return blob.includes('ac') || blob.includes('gas') || blob.includes('cooling');
                      if (mechanicCategoryFilter === 'Brakes & Clutch') return blob.includes('brake') || blob.includes('caliper') || blob.includes('clutch');
                      if (mechanicCategoryFilter === 'Tyres & Wheel Care') return blob.includes('tyre') || blob.includes('wheel') || blob.includes('puncture');
                      if (mechanicCategoryFilter === 'Cleaning & Detailing') return blob.includes('ceramic') || blob.includes('wash') || blob.includes('polish') || blob.includes('clean');
                      if (mechanicCategoryFilter === 'Custom Tuning & Mods') return blob.includes('remap') || blob.includes('wrap') || blob.includes('exhaust') || blob.includes('modification') || blob.includes('ambient');
                      if (mechanicCategoryFilter === 'Authorized Workshop') return blob.includes('authorized') || blob.includes('service center');
                      if (mechanicCategoryFilter === 'Heavy Commercial Fleet') return blob.includes('lorry') || blob.includes('commercial') || blob.includes('fleet') || blob.includes('auto');
                      return true;
                    })
                    .map((service) => {
                      const includesList = service.includes || [];
                      const chosenAddOns = selectedEquipment[service.id] ?? [];
                      const totalCost = getProductTotalPrice(service);

                      return (
                        <div
                          key={service.id}
                          className="gomechanic-card cursor-pointer"
                          onClick={() => setSelectedProductModal(service)}
                        >
                          <div className="gm-card-header">
                            <div className="gm-header-left">
                              <span className="gm-duration-tag"><i className="fa-regular fa-clock"></i> {service.duration || '2-3 Hrs'}</span>
                              {service.warranty && (
                                <span className="gm-warranty-tag"><i className="fa-solid fa-shield"></i> {service.warranty}</span>
                              )}
                            </div>
                            <span className="gm-pickup-pill"><i className="fa-solid fa-truck-pickup"></i> Free Pick-up</span>
                          </div>

                          <div className="gm-card-body">
                            <div className="gm-title-media-row">
                              <div className="gm-info-col">
                                <h4 className="gm-service-name">{service.name}</h4>
                                <p className="gm-service-desc">{service.desc}</p>
                              </div>
                              <img src={service.image} alt={service.name} className="gm-thumb" />
                            </div>

                            {/* Service Inclusions Checklist */}
                            {includesList.length > 0 && (
                              <div className="gm-inclusions-box">
                                <div className="inclusions-title"><i className="fa-solid fa-clipboard-check"></i> What's Included:</div>
                                <div className="inclusions-grid">
                                  {includesList.slice(0, 4).map((inc, i) => (
                                    <div key={i} className="inclusion-item">
                                      <i className="fa-solid fa-check"></i>
                                      <span>{inc}</span>
                                    </div>
                                  ))}
                                  {includesList.length > 4 && (
                                    <span className="inclusions-more">+{includesList.length - 4} more inspection points</span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Footer Price & Booking CTA */}
                            <div className="gm-card-footer">
                              <div className="gm-pricing">
                                <span className="gm-cost">{formatPrice(totalCost)}</span>
                                {service.originalPrice && (
                                  <span className="gm-original-cost">{formatPrice(service.originalPrice)}</span>
                                )}
                              </div>

                              <button
                                type="button"
                                className="btn-book-service"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(service);
                                }}
                              >
                                <i className="fa-solid fa-calendar-check"></i>
                                <span>Book Service</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </main>
            </div>
          </section>
        )}

        {/* HUB TAB 3: COMPARE VEHICLES (Side-by-Side CarWale Style)           */}
        {/* ------------------------------------------------------------------ */}
                {/* ------------------------------------------------------------------ */}
        {/* HUB TAB 3: COMPARE VEHICLES (Side-by-Side CarWale Style)           */}
        {/* ------------------------------------------------------------------ */}
        {activeHubTab === 'compare_vehicles' && (
          <section className="hub-showcase-view animate-pop">
            <div className="hub-view-header">
              <div className="view-title-wrap">
                <span className="hub-badge-flair">
                  <i className="fa-solid fa-code-compare"></i> SIDE-BY-SIDE ALL-VEHICLE COMPARISON
                </span>
                <h2>Compare Specs, Mileage, Safety, EMI &amp; Price</h2>
                <p>Make smart buying decisions. Choose any 2 vehicles to compare engine power, safety ratings, mileage, and ownership cost.</p>
              </div>
            </div>

            {/* QUICK BATTLE PRESETS */}
            <div className="compare-quick-battles-bar">
              <span className="battles-label"><i className="fa-solid fa-fire"></i> Popular Comparisons:</span>
              <div className="battles-scroll">
                {[
                  { label: 'Creta vs Seltos', vA: 'comp-creta', vB: 'comp-seltos', type: 'Car' },
                  { label: 'Nexon vs Thar Roxx', vA: 'comp-nexon', vB: 'comp-thar', type: 'Car' },
                  { label: 'Curvv EV vs Creta', vA: 'comp-curvv', vB: 'comp-creta', type: 'EV' },
                  { label: 'Classic 350 vs Hunter 350', vA: 'comp-classic', vB: 'comp-hunter', type: 'Bike' },
                  { label: 'Tata Signa 2823 vs Ashok 1920', vA: 'comp-signa', vB: 'comp-ashok', type: 'Truck' },
                ].map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    className="quick-battle-btn"
                    onClick={() => {
                      const foundA = COMPARISON_VEHICLES.find(v => v.id === b.vA);
                      const foundB = COMPARISON_VEHICLES.find(v => v.id === b.vB);
                      if (foundA) setCompareVehicleA(foundA);
                      if (foundB) setCompareVehicleB(foundB);
                      showToast(`Loaded comparison: ${b.label}`);
                    }}
                  >
                    <span>{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison Selectors Row */}
            <div className="compare-selectors-bar">
              <div className="compare-select-col">
                <div className="compare-card-head">
                  <img src={compareVehicleA.image} alt={compareVehicleA.name} className="comp-head-img" />
                  <div className="comp-head-meta">
                    <span className="comp-brand-badge">{compareVehicleA.brand}</span>
                    <h3>{compareVehicleA.name}</h3>
                    <strong className="comp-price-head">{compareVehicleA.price}</strong>
                  </div>
                </div>
                <div className="select-wrapper">
                  <label><i className="fa-solid fa-car"></i> Select Vehicle A:</label>
                  <select
                    value={compareVehicleA.id}
                    onChange={(e) => {
                      const found = COMPARISON_VEHICLES.find(v => v.id === e.target.value);
                      if (found) setCompareVehicleA(found);
                    }}
                  >
                    {COMPARISON_VEHICLES.map((v) => (
                      <option key={v.id} value={v.id}>{v.name} ({v.brand})</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down select-arrow"></i>
                </div>
              </div>

              <div className="compare-vs-divider">
                <button
                  type="button"
                  className="btn-swap-vehicles"
                  title="Swap Vehicles"
                  onClick={() => {
                    const temp = compareVehicleA;
                    setCompareVehicleA(compareVehicleB);
                    setCompareVehicleB(temp);
                    showToast('Swapped Vehicle A and Vehicle B');
                  }}
                >
                  <i className="fa-solid fa-arrow-right-arrow-left"></i>
                  <span>SWAP</span>
                </button>
              </div>

              <div className="compare-select-col">
                <div className="compare-card-head">
                  <img src={compareVehicleB.image} alt={compareVehicleB.name} className="comp-head-img" />
                  <div className="comp-head-meta">
                    <span className="comp-brand-badge">{compareVehicleB.brand}</span>
                    <h3>{compareVehicleB.name}</h3>
                    <strong className="comp-price-head">{compareVehicleB.price}</strong>
                  </div>
                </div>
                <div className="select-wrapper">
                  <label><i className="fa-solid fa-car"></i> Select Vehicle B:</label>
                  <select
                    value={compareVehicleB.id}
                    onChange={(e) => {
                      const found = COMPARISON_VEHICLES.find(v => v.id === e.target.value);
                      if (found) setCompareVehicleB(found);
                    }}
                  >
                    {COMPARISON_VEHICLES.map((v) => (
                      <option key={v.id} value={v.id}>{v.name} ({v.brand})</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down select-arrow"></i>
                </div>
              </div>
            </div>

            {/* Side-by-Side Spec Comparison Table */}
            <div className="comparison-table-wrap">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Feature &amp; Metric</th>
                    <th>{compareVehicleA.name}</th>
                    <th>{compareVehicleB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-group-header">
                    <td colSpan={3}><i className="fa-solid fa-tag"></i> 1. Pricing &amp; Value</td>
                  </tr>
                  <tr>
                    <td className="spec-label"><i className="fa-solid fa-indian-rupee-sign"></i> Price Range</td>
                    <td><strong className="highlight-metric">{compareVehicleA.price}</strong></td>
                    <td><strong className="highlight-metric">{compareVehicleB.price}</strong></td>
                  </tr>
                  <tr>
                    <td className="spec-label"><i className="fa-solid fa-certificate"></i> Warranty</td>
                    <td>{compareVehicleA.warranty}</td>
                    <td>{compareVehicleB.warranty}</td>
                  </tr>

                  <tr className="table-group-header">
                    <td colSpan={3}><i className="fa-solid fa-gears"></i> 2. Engine &amp; Performance</td>
                  </tr>
                  <tr>
                    <td className="spec-label"><i className="fa-solid fa-gas-pump"></i> Engine / Powertrain</td>
                    <td>{compareVehicleA.engine}</td>
                    <td>{compareVehicleB.engine}</td>
                  </tr>
                  <tr>
                    <td className="spec-label"><i className="fa-solid fa-bolt"></i> Max Power &amp; Torque</td>
                    <td><strong className="highlight-metric">{compareVehicleA.power}</strong></td>
                    <td><strong className="highlight-metric">{compareVehicleB.power}</strong></td>
                  </tr>
                  <tr>
                    <td className="spec-label"><i className="fa-solid fa-gauge"></i> Fuel Efficiency / Certified Range</td>
                    <td><span className="mileage-badge">{compareVehicleA.mileage}</span></td>
                    <td><span className="mileage-badge">{compareVehicleB.mileage}</span></td>
                  </tr>

                  <tr className="table-group-header">
                    <td colSpan={3}><i className="fa-solid fa-shield-halved"></i> 3. Safety, Airbags &amp; Body</td>
                  </tr>
                  <tr>
                    <td className="spec-label"><i className="fa-solid fa-star"></i> Crash Test Rating</td>
                    <td><span className="safety-badge"><i className="fa-solid fa-star"></i> {compareVehicleA.safety}</span></td>
                    <td><span className="safety-badge"><i className="fa-solid fa-star"></i> {compareVehicleB.safety}</span></td>
                  </tr>
                  <tr>
                    <td className="spec-label"><i className="fa-solid fa-shield"></i> Airbags &amp; Driver Assist</td>
                    <td>{compareVehicleA.airbags}</td>
                    <td>{compareVehicleB.airbags}</td>
                  </tr>
                  <tr>
                    <td className="spec-label"><i className="fa-solid fa-users"></i> Body &amp; Seating Layout</td>
                    <td>{compareVehicleA.seating}</td>
                    <td>{compareVehicleB.seating}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SART Comparison Verdict */}
            <div className="compare-verdict-card">
              <div className="verdict-icon">
                <i className="fa-solid fa-award"></i>
              </div>
              <div className="verdict-content">
                <h4>SART Intelligent Buying Recommendation</h4>
                <p>
                  <strong>{compareVehicleA.name}</strong> delivers superior powertrain options and warranty coverage, 
                  while <strong>{compareVehicleB.name}</strong> excels in pricing competitiveness and standard safety features.
                  Choose {compareVehicleA.name} for highway driving performance, or {compareVehicleB.name} for city commute and lower total ownership costs.
                </p>
                <div className="verdict-actions">
                  <button
                    type="button"
                    className="btn-verdict-cta"
                    onClick={() => {
                      setActiveHubTab('finance_insurance');
                      showToast(`Opened EMI calculator for ${compareVehicleA.name}`);
                    }}
                  >
                    <i className="fa-solid fa-calculator"></i> Check EMI for {compareVehicleA.name}
                  </button>
                  <button
                    type="button"
                    className="btn-verdict-cta outline"
                    onClick={() => {
                      setActiveHubTab('buy_sell');
                      showToast(`Browsing offers for ${compareVehicleB.name}`);
                    }}
                  >
                    <i className="fa-solid fa-car"></i> View Offers for {compareVehicleB.name}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* HUB TAB 4: EV CHARGING & LIVE FUEL PRICES (USER IMAGE 2 BASED)     */}
        {/* ------------------------------------------------------------------ */}
        {activeHubTab === 'ev_fuel_stations' && (
          <section className="hub-showcase-view animate-pop">
            <div className="hub-view-header">
              <div className="view-title-wrap">
                <span className="hub-badge-flair">
                  <i className="fa-solid fa-charging-station"></i> LIVE AUTOMOTIVE ENERGY &amp; PUMP FINDER
                </span>
                <h2>Daily Fuel Rates &amp; Nearby Fuel &amp; EV Stations</h2>
                <p>Location-based directory of verified Petrol, Diesel, CNG pumps and high-speed EV DC charging hubs.</p>
              </div>

              {/* City Chooser for Fuel Rates & Pumps */}
              <div className="fuel-city-selector">
                <span className="city-label"><i className="fa-solid fa-location-dot"></i> Select City / State:</span>
                <select
                  value={selectedFuelCity}
                  onChange={(e) => {
                    setSelectedFuelCity(e.target.value);
                    showToast(`Updated stations & fuel prices for ${e.target.value}`);
                  }}
                  className="city-select"
                >
                  {LIVE_FUEL_PRICES.map((p) => (
                    <option key={p.city} value={p.city}>{p.city}</option>
                  ))}
                  <option value="New Delhi">New Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
                <button
                  type="button"
                  className="btn-auto-detect-gps"
                  onClick={() => {
                    setSelectedFuelCity('New Delhi');
                    showToast('GPS Auto-detected location: New Delhi (Dwarka / South Delhi)');
                  }}
                >
                  <i className="fa-solid fa-crosshairs"></i> Auto-Detect GPS
                </button>
              </div>
            </div>

            {/* Live Fuel Price Ticker Cards */}
            {(() => {
              const currentPrice = LIVE_FUEL_PRICES.find((p) => p.city === selectedFuelCity) || {
                city: selectedFuelCity,
                petrol: selectedFuelCity === 'New Delhi' ? 94.72 : 100.75,
                diesel: selectedFuelCity === 'New Delhi' ? 87.62 : 92.34,
                cng: selectedFuelCity === 'New Delhi' ? 75.09 : 85.50,
                updated: 'Today 06:00 AM'
              };
              return (
                <div className="fuel-rates-grid">
                  <div className="fuel-rate-card petrol">
                    <div className="fuel-card-top">
                      <i className="fa-solid fa-gas-pump"></i>
                      <span>Petrol Rate ({currentPrice.city})</span>
                    </div>
                    <div className="fuel-price-val">₹{currentPrice.petrol.toFixed(2)} <span>/ Litre</span></div>
                    <div className="fuel-update-text"><i className="fa-solid fa-clock"></i> Updated: {currentPrice.updated} • Steady</div>
                  </div>

                  <div className="fuel-rate-card diesel">
                    <div className="fuel-card-top">
                      <i className="fa-solid fa-oil-can"></i>
                      <span>Diesel Rate ({currentPrice.city})</span>
                    </div>
                    <div className="fuel-price-val">₹{currentPrice.diesel.toFixed(2)} <span>/ Litre</span></div>
                    <div className="fuel-update-text"><i className="fa-solid fa-clock"></i> Updated: {currentPrice.updated} • No Change</div>
                  </div>

                  <div className="fuel-rate-card cng">
                    <div className="fuel-card-top">
                      <i className="fa-solid fa-fire-flame-simple"></i>
                      <span>Auto CNG Rate ({currentPrice.city})</span>
                    </div>
                    <div className="fuel-price-val">₹{currentPrice.cng.toFixed(2)} <span>/ Kg</span></div>
                    <div className="fuel-update-text"><i className="fa-solid fa-clock"></i> Updated: {currentPrice.updated} • Subsidized</div>
                  </div>

                  <div className="fuel-rate-card ev-energy">
                    <div className="fuel-card-top">
                      <i className="fa-solid fa-bolt"></i>
                      <span>EV Public DC Rate</span>
                    </div>
                    <div className="fuel-price-val">₹18.50 <span>/ kWh</span></div>
                    <div className="fuel-update-text"><i className="fa-solid fa-plug"></i> 60kW - 150kW Fast Charging</div>
                  </div>
                </div>
              );
            })()}

            {/* LOCATION-BASED FUEL & EV STATIONS SECTION (MATCHING USER'S IMAGE 2) */}
            <div className="location-stations-container">
              <div className="stations-filter-row">
                <div className="stations-title-block">
                  <h3><i className="fa-solid fa-map-location-dot"></i> Verified Fuel &amp; EV Stations Near {selectedFuelCity}</h3>
                  <span className="stations-count-pill">
                    {LOCATION_BASED_STATIONS.filter(s => selectedFuelCity === 'All Cities' || s.city === selectedFuelCity || (selectedFuelCity === 'New Delhi' && s.city === 'New Delhi')).length} Stations Located
                  </span>
                </div>

                <div className="stations-type-pills">
                  {[
                    { id: 'all', label: 'All Stations' },
                    { id: 'fuel', label: 'Petrol & Diesel' },
                    { id: 'cng', label: 'CNG Available' },
                    { id: 'ev', label: 'EV Fast Charging' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`st-filter-btn ${stationFilterCategory === f.id ? 'active' : ''}`}
                      onClick={() => setStationFilterCategory(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CARD GRID MATCHING USER IMAGE 2 */}
              <div className="image2-stations-grid">
                {LOCATION_BASED_STATIONS
                  .filter((st) => {
                    const matchesCity = selectedFuelCity === 'All Cities' || st.city === selectedFuelCity || (selectedFuelCity !== 'New Delhi' && selectedFuelCity !== 'Chennai' && selectedFuelCity !== 'Bangalore');
                    if (stationFilterCategory === 'fuel' && st.type === 'ev') return false;
                    if (stationFilterCategory === 'ev' && st.type === 'fuel') return false;
                    if (stationFilterCategory === 'cng' && !st.fuels.some(fuel => fuel.toLowerCase().includes('cng'))) return false;
                    return matchesCity;
                  })
                  .map((station) => (
                    <div key={station.id} className="image2-station-card">
                      <div className="st-card-content">
                        <h4 className="st-card-title">{station.name}</h4>
                        <p className="st-card-address">{station.address}</p>
                        
                        <div className="st-status-timing">
                          <span className="st-status-green">Open now</span>
                          <span className="st-timing-sep">•</span>
                          <span className="st-timing-text">06:00 AM - 10:00 PM</span>
                        </div>

                        <div className="st-phone-row">
                          <i className="fa-solid fa-phone"></i>
                          <span>{station.phone}</span>
                        </div>

                        <div className="st-fuels-checks">
                          {station.fuels.map((fuel) => (
                            <span key={fuel} className="st-fuel-check-item">
                              <i className="fa-solid fa-check"></i> {fuel}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="st-card-footer">
                        <button
                          type="button"
                          className="btn-get-direction"
                          onClick={() => {
                            showToast(`Opening Google Maps directions for: ${station.name}...`);
                          }}
                        >
                          <i className="fa-solid fa-diamond-turn-right"></i>
                          <span>Get Direction</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* HUB TAB 5: FINANCE & INSURANCE (USER IMAGE 3 BASED)                */}
        {/* ------------------------------------------------------------------ */}
        {activeHubTab === 'finance_insurance' && (
          <section className="hub-showcase-view cardekho-emi-hub-view animate-pop">
            {/* Top Breadcrumb */}
            <div className="cd-emi-breadcrumb">
              <span>SIERRA</span>
              <span className="bc-sep">/</span>
              <span className="bc-active">SIERRA EMI</span>
            </div>

            {/* TOP VEHICLE HERO CARD (IMAGE 3 BASED) */}
            <div className="cd-vehicle-hero-card">
              <div className="cd-hero-left">
                <img
                  src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80"
                  alt="Tata Sierra SUV"
                  className="cd-hero-car-img"
                />
              </div>
              <div className="cd-hero-info">
                <div className="cd-hero-title-row">
                  <h2>Tata Sierra EMI Calculator</h2>
                  <button type="button" className="btn-wish-heart" title="Bookmark">
                    <i className="fa-regular fa-heart"></i>
                  </button>
                </div>
                <p className="cd-hero-desc">
                  Tata Sierra EMI starts at ₹33,121 per month for a tenure of 60 months @ 9.8% for a loan 
                  amount of ₹13.11 Lakh. The EMI Calculator tool on SART gives a detailed break-up of... <span className="read-more-link">Read More</span>
                </p>
                <div className="cd-hero-rating-row">
                  <span className="rating-star-tag">4.7 <i className="fa-solid fa-star"></i></span>
                  <span className="review-count-txt">209 Reviews</span>
                </div>
                <div className="cd-hero-price-row">
                  <strong className="cd-hero-price">₹11.49 - 21.59 Lakh*</strong>
                  <span className="cd-emi-starts">EMI starts @ ₹33,121</span>
                </div>
                <button
                  type="button"
                  className="btn-cd-orange-cta"
                  onClick={() => showToast('Festival discount offers applied for Tata Sierra!')}
                >
                  Get Navaratri Offers
                </button>
              </div>
            </div>

            {/* 2-COLUMN MAIN CONTENT (LEFT CALCULATOR + RIGHT SIDEBAR) */}
            <div className="cd-emi-layout-grid">
              {/* LEFT COLUMN: CALCULATOR, ALTERNATIVES, USED CARS, REVIEWS */}
              <div className="cd-emi-main-col">
                {/* 1. CALCULATE YOUR LOAN EMI CARD */}
                <div className="cd-calculator-card">
                  <h3 className="cd-card-heading">Calculate your Loan EMI for Sierra</h3>

                  {/* 3 Dropdowns */}
                  <div className="cd-dropdowns-row">
                    <div className="cd-dropdown-wrap">
                      <select value={emiCarBrand} onChange={(e) => setEmiCarBrand(e.target.value)}>
                        <option value="Tata">Tata</option>
                        <option value="Mahindra">Mahindra</option>
                        <option value="Hyundai">Hyundai</option>
                        <option value="Kia">Kia</option>
                      </select>
                      <i className="fa-solid fa-chevron-down dd-arrow"></i>
                    </div>

                    <div className="cd-dropdown-wrap">
                      <select value={emiCarModel} onChange={(e) => setEmiCarModel(e.target.value)}>
                        <option value="Sierra">Sierra</option>
                        <option value="Curvv">Curvv</option>
                        <option value="Harrier">Harrier</option>
                        <option value="Nexon">Nexon</option>
                      </select>
                      <i className="fa-solid fa-chevron-down dd-arrow"></i>
                    </div>

                    <div className="cd-dropdown-wrap">
                      <select value={emiCarVariant} onChange={(e) => setEmiCarVariant(e.target.value)}>
                        <option value="Smart Plus (Petrol) 14.34 Lakh">Smart Plus (Petrol) 14.34 Lakh</option>
                        <option value="Adventure Plus (Petrol) 17.48 Lakh">Adventure Plus (Petrol) 17.48 Lakh</option>
                        <option value="Accomplished Plus (Diesel) 21.59 Lakh">Accomplished Plus (Diesel) 21.59 Lakh</option>
                      </select>
                      <i className="fa-solid fa-chevron-down dd-arrow"></i>
                    </div>
                  </div>

                  {/* On-Road Price in City */}
                  <div className="cd-price-line">
                    <span className="price-lbl">On-Road Price in Bangalore</span>
                    <strong className="price-val">₹{emiOnRoadPrice.toLocaleString('en-IN')}</strong>
                  </div>

                  {/* Down Payment Slider */}
                  <div className="cd-slider-block">
                    <div className="slider-label-line">
                      <span>Down Payment</span>
                      <strong>₹{emiDownPayment.toLocaleString('en-IN')}</strong>
                    </div>
                    <input
                      type="range"
                      min={70000}
                      max={emiOnRoadPrice * 0.7}
                      step={10000}
                      value={emiDownPayment}
                      onChange={(e) => setEmiDownPayment(Number(e.target.value))}
                      className="cd-range-slider"
                    />
                    <div className="slider-minmax-hints">
                      <span>0</span>
                      <span>₹{Math.round(emiOnRoadPrice * 0.7).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Bank Interest Rate Slider */}
                  <div className="cd-slider-block">
                    <div className="slider-label-line">
                      <span>Bank Interest Rate</span>
                      <strong>{emiInterestRate}%</strong>
                    </div>
                    <input
                      type="range"
                      min={7.5}
                      max={15.0}
                      step={0.1}
                      value={emiInterestRate}
                      onChange={(e) => setEmiInterestRate(Number(e.target.value))}
                      className="cd-range-slider"
                    />
                    <div className="slider-minmax-hints">
                      <span>7.5%</span>
                      <span>15%</span>
                    </div>
                  </div>

                  {/* Loan Period (Years) segmented buttons */}
                  <div className="cd-period-block">
                    <span className="period-lbl">Loan Period (Years)</span>
                    <div className="cd-year-buttons">
                      {[1, 2, 3, 4, 5, 6, 7].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          className={`yr-btn ${emiLoanTenureYears === yr ? 'active' : ''}`}
                          onClick={() => setEmiLoanTenureYears(yr)}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Financial Metrics Split */}
                  <div className="cd-calc-summary-split">
                    <div className="summary-left">
                      <div className="sum-item">
                        <span>Total Loan Amount</span>
                        <strong>₹{Math.max(0, emiOnRoadPrice - emiDownPayment).toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="sum-item">
                        <span>Payable Amount</span>
                        <strong>
                          ₹{Math.round((emiOnRoadPrice - emiDownPayment) + ((emiOnRoadPrice - emiDownPayment) * (emiInterestRate / 100) * emiLoanTenureYears)).toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>

                    <div className="summary-right">
                      <div className="emi-big-display">
                        <div className="emi-label-sub">
                          <span>EMI</span>
                          <small>per month</small>
                        </div>
                        <h2 className="emi-amount-val">
                          ₹{(() => {
                            const p = Math.max(0, emiOnRoadPrice - emiDownPayment);
                            const r = emiInterestRate / 12 / 100;
                            const n = emiLoanTenureYears * 12;
                            if (p <= 0 || n <= 0) return '0';
                            const emiVal = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
                            return emiVal.toLocaleString('en-IN');
                          })()}
                        </h2>
                      </div>
                      <span className="calc-interest-hint">Calculated on On-Road Price</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-cd-orange-block"
                    onClick={() => showToast('Applied for lowest interest EMI offers across 14 partner banks!')}
                  >
                    Get EMI Offers
                  </button>
                </div>

                {/* 2. FIND EMI OF SIERRA ALTERNATIVES (IMAGE 3 BASED) */}
                <div className="cd-section-card">
                  <h3 className="cd-card-heading">Find EMI of Sierra alternatives</h3>
                  <div className="cd-alternatives-grid">
                    {[
                      { name: 'Kia Seltos', price: '₹11.25 - 21.82 Lakh*', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Seltos Emi', compareTxt: 'Sierra vs Seltos' },
                      { name: 'Tata Harrier', price: '₹12 - 26.11 Lakh*', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80', emiBtn: 'Harrier Emi', compareTxt: 'Sierra vs Harrier' },
                      { name: 'Hyundai Creta', price: '₹10.91 - 20.46 Lakh*', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80', emiBtn: 'Creta Emi', compareTxt: 'Sierra vs Creta' },
                    ].map((alt) => (
                      <div key={alt.name} className="cd-alt-card">
                        <div className="alt-img-box">
                          <img src={alt.img} alt={alt.name} />
                        </div>
                        <h4 className="alt-name">{alt.name}</h4>
                        <span className="alt-price">{alt.price}</span>
                        <button
                          type="button"
                          className="btn-alt-emi-orange"
                          onClick={() => showToast(`Calculating EMI for ${alt.name}...`)}
                        >
                          {alt.emiBtn}
                        </button>
                        <a
                          href="#compare"
                          className="alt-compare-link"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveHubTab('compare_vehicles');
                          }}
                        >
                          {alt.compareTxt}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. RECOMMENDED USED CAR ALTERNATIVES (IMAGE 3 BASED) */}
                <div className="cd-section-card">
                  <h3 className="cd-card-heading">Recommended used car alternatives for Tata Sierra In Bangalore</h3>
                  <div className="cd-used-grid">
                    {[
                      { name: 'Tata Sierra Adventure Plus', price: '₹17.48 Lakh', meta: '2023 • 4,851 km • Petrol' },
                      { name: 'Tata Sierra Accomplished Plus Diesel', price: '₹23.70 Lakh', meta: '2024 • 8,500 km • Diesel' },
                      { name: 'Kia Seltos HTK Plus D', price: '₹11.50 Lakh', meta: '2019 • 70,427 km • Diesel' }
                    ].map((uc, i) => (
                      <div key={i} className="cd-used-card">
                        <div className="used-img-placeholder">
                          <i className="fa-solid fa-car-side"></i>
                        </div>
                        <h4 className="used-title">{uc.name}</h4>
                        <strong className="used-price">{uc.price}</strong>
                        <span className="used-meta">{uc.meta}</span>
                        <button
                          type="button"
                          className="btn-used-seller"
                          onClick={() => showToast(`Contacting certified seller for ${uc.name}...`)}
                        >
                          View Seller Details
                        </button>
                      </div>
                    ))}
                  </div>
                  <a href="#used" className="cd-view-all-link" onClick={(e) => { e.preventDefault(); setActiveHubTab('buy_sell'); }}>
                    View Used Tata Cars in Bangalore <i className="fa-solid fa-chevron-right"></i>
                  </a>
                </div>

                {/* 4. TATA SIERRA USER REVIEWS (IMAGE 3 BASED) */}
                <div className="cd-section-card">
                  <div className="reviews-card-head">
                    <div>
                      <h3 className="cd-card-heading" style={{ margin: 0 }}>Tata Sierra user reviews</h3>
                      <div className="rev-stars-row">
                        <span className="rev-score">4.7 <i className="fa-solid fa-star"></i></span>
                        <span className="rev-sub-count">Based on 509 User Reviews</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-write-review-orange"
                      onClick={() => showToast('Review modal opened! Write your review to win ₹1000')}
                    >
                      Write a Review &amp; Win ₹1000
                    </button>
                  </div>

                  {/* Review Filter Pills */}
                  <div className="cd-review-pills-row">
                    {['All (509)', 'Look (150)', 'Safety (121)', 'Comfort (100)', 'Price (74)', 'Mileage (54)', 'Space (42)'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`rev-pill-btn ${activeReviewFilter === p ? 'active' : ''}`}
                        onClick={() => setActiveReviewFilter(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {/* Review Cards */}
                  <div className="cd-reviews-cards-list">
                    {[
                      { author: 'Debinder', date: 'Oct 12, 2024', rating: 4.7, title: 'Best SUV Of India', text: 'Best performance SUV in India powered by Tata Motors. Compared to all under SUVs in this segment Sierra gives best performance and comfort. Good mileage, People also like off-road performance which is excellent.' },
                      { author: 'Sasidharan', date: 'Oct 11, 2024', rating: 5.0, title: 'TATA - I SALUTE', text: 'Awesome experience. Heated seats, comfortable and confident with the Tata Sierra. For me, it\'s not just about a budget-friendly car; build quality, safety, and comfort are the most important things.' },
                      { author: 'Gowrishankar', date: 'Oct 10, 2024', rating: 4.0, title: 'I Was Shocked', text: 'I was shocked after a safe life car. This car is good in every side, mileage, colour, price, safety all the things, seriously this car is very good when I check in Rways, it gives very nice diesel, average colour option also looking.' }
                    ].map((r, i) => (
                      <div key={i} className="cd-review-item-card">
                        <div className="rev-author-line">
                          <div className="rev-initial">{r.author.charAt(0)}</div>
                          <div>
                            <strong>{r.author}</strong> <small>on {r.date}</small>
                          </div>
                          <span className="rev-item-stars">{r.rating} <i className="fa-solid fa-star"></i></span>
                        </div>
                        <h5 className="rev-card-title">{r.title}</h5>
                        <p className="rev-card-body">{r.text} <span className="read-more-txt">Read More</span></p>
                        <div className="rev-card-feedback">
                          <button type="button" className="rev-thumb-btn" onClick={() => showToast('Marked helpful')}><i className="fa-regular fa-thumbs-up"></i></button>
                          <button type="button" className="rev-thumb-btn" onClick={() => showToast('Feedback recorded')}><i className="fa-regular fa-thumbs-down"></i></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <a href="#reviews" className="cd-view-all-link">
                    View All Sierra Reviews <i className="fa-solid fa-chevron-right"></i>
                  </a>
                </div>

                {/* 5. FREQUENTLY ASKED QUESTIONS (IMAGE 3 BASED) */}
                <div className="cd-section-card">
                  <h3 className="cd-card-heading">Frequently Asked Questions On Car Sierra Emi</h3>
                  <div className="cd-faq-list">
                    <div className="cd-faq-item">
                      <strong>Q: What is the lowest EMI for Tata Sierra in Bangalore?</strong>
                      <p>A: The lowest EMI for Tata Sierra starts at ₹32,628/month for a tenure of 60 months with a down payment of ₹1,43,000 at 9.8% annual interest rate.</p>
                    </div>
                    <div className="cd-faq-item">
                      <strong>Q: What is the minimum down payment required for Sierra?</strong>
                      <p>A: Most nationalized and private banks require a minimum 10% down payment (approximately ₹1,15,000) of the vehicle ex-showroom price.</p>
                    </div>
                    <div className="cd-faq-item">
                      <strong>Q: Can I foreclose or prepay my car loan early?</strong>
                      <p>A: Yes, most banks allow prepayment or foreclosure after 6 to 12 months with zero to nominal prepayment charges under RBI guidelines.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR COLUMN (IMAGE 3 BASED) */}
              <div className="cd-emi-sidebar-col">
                {/* 1. RUNNING COST OF YOUR CAR */}
                <div className="cd-sidebar-widget">
                  <h4 className="sidebar-widget-title">Running cost of your car</h4>
                  <div className="km-driven-block">
                    <div className="km-header-line">
                      <span>KM driven per day</span>
                      <strong>{emiDailyKm} km/day</strong>
                    </div>
                    <div className="km-buttons-row">
                      {[20, 30, 40, 50, 100].map((k) => (
                        <button
                          key={k}
                          type="button"
                          className={`km-btn ${emiDailyKm === k ? 'active' : ''}`}
                          onClick={() => setEmiDailyKm(k)}
                        >
                          {k}
                        </button>
                      ))}
                      <button type="button" className="km-btn" onClick={() => setEmiDailyKm(60)}>Other</button>
                    </div>
                  </div>

                  <div className="monthly-fuel-cost-box">
                    <span className="mfc-lbl">Monthly fuel cost</span>
                    <h3 className="mfc-val">₹{Math.round((emiDailyKm * 30 / 14) * 101).toLocaleString('en-IN')}* <span>/ month</span></h3>
                    <small className="mfc-disclaimer">
                      It looks like our automated calculator verified mileage of Tata Sierra Smart Plus at 14 kmpl.
                    </small>
                  </div>
                </div>

                {/* 2. POPULAR CARS LIST */}
                <div className="cd-sidebar-widget">
                  <h4 className="sidebar-widget-title">Popular cars</h4>
                  <div className="cd-popular-cars-list">
                    {[
                      { name: 'Tata Sierra', price: '₹11.49 - 21.59 Lakh*', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80' },
                      { name: 'Tata Altroz', price: '₹6.30 - 9.75 Lakh*', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80' },
                      { name: 'Honda Elevate', price: '₹11.00 - 18.40 Lakh*', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80' },
                      { name: 'Mahindra Thar OG', price: '₹10.32 - 18.99 Lakh*', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80' },
                      { name: 'Maruti Suzuki Brezza', price: '₹7.50 - 13.71 Lakh*', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80' }
                    ].map((c) => (
                      <div key={c.name} className="sidebar-car-row">
                        <img src={c.img} alt={c.name} className="sidebar-car-thumb" />
                        <div className="sidebar-car-info">
                          <h5>{c.name}</h5>
                          <span>{c.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a href="#all" className="sidebar-orange-link" onClick={(e) => { e.preventDefault(); setActiveHubTab('buy_sell'); }}>
                    View All Best Cars <i className="fa-solid fa-chevron-right"></i>
                  </a>
                </div>

                {/* 3. PROMOTIONAL ADS BANNERS */}
                <div className="cd-promo-ad-card duster-ad">
                  <div className="ad-badge">SPONSORED</div>
                  <h4>ALL-NEW RENAULT DUSTER</h4>
                  <p>Starting at ₹10.49 Lakh* • 4x4 Hybrid Available</p>
                  <button type="button" className="btn-ad-book" onClick={() => showToast('Redirecting to Renault Duster special booking portal...')}>
                    Book Now
                  </button>
                </div>

                <div className="cd-promo-ad-card chetak-ad">
                  <div className="ad-badge">EV SPOTLIGHT</div>
                  <h4>Bajaj Chetak C25 Electric</h4>
                  <p>Only at ₹1,04,802* • 126 km Certified Range</p>
                  <button type="button" className="btn-ad-book dark" onClick={() => showToast('Opened Chetak EV Test Ride booking')}>
                    Buy Now
                  </button>
                </div>

                {/* 4. TRENDING TATA CARS WIDGET */}
                <div className="cd-sidebar-widget">
                  <h4 className="sidebar-widget-title">Trending Tata cars</h4>
                  <div className="trending-tabs-row">
                    <button
                      type="button"
                      className={`trend-tab-btn ${activeTrendingTab === 'popular' ? 'active' : ''}`}
                      onClick={() => setActiveTrendingTab('popular')}
                    >
                      Popular
                    </button>
                    <button
                      type="button"
                      className={`trend-tab-btn ${activeTrendingTab === 'upcoming' ? 'active' : ''}`}
                      onClick={() => setActiveTrendingTab('upcoming')}
                    >
                      Upcoming
                    </button>
                  </div>

                  <div className="cd-popular-cars-list">
                    {[
                      { name: 'Tata Punch', price: '₹5.75 - 10.77 Lakh*' },
                      { name: 'Tata Nexon', price: '₹7.40 - 14.52 Lakh*' },
                      { name: 'Tata Harrier', price: '₹13 - 26.11 Lakh*' },
                      { name: 'Tata Safari', price: '₹13.40 - 26.91 Lakh*' },
                      { name: 'Tata Curvv', price: '₹10 - 19 Lakh*' },
                    ].map((tc) => (
                      <div key={tc.name} className="sidebar-car-row simple">
                        <div className="trend-bullet"><i className="fa-solid fa-car"></i></div>
                        <div className="sidebar-car-info">
                          <h5>{tc.name}</h5>
                          <span>{tc.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a href="#tata" className="sidebar-orange-link" onClick={(e) => { e.preventDefault(); setActiveHubTab('buy_sell'); }}>
                    View All Tata Cars <i className="fa-solid fa-chevron-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}


        {/* ------------------------------------------------------------------ */}
        {/* HUB TAB 6: 24/7 ROADSIDE SOS & EMERGENCY BREAKDOWN ASSISTANCE      */}
        {/* ------------------------------------------------------------------ */}
        {activeHubTab === 'emergency_sos' && (
          <section className="hub-showcase-view sart-sos-view animate-pop">
            {/* TOP EMERGENCY RADAR HERO BANNER */}
            <div className="sart-sos-hero-card">
              <div className="sos-radar-header">
                <div className="sos-live-pill">
                  <span className="sos-blinking-dot"></span>
                  <span>24/7 LIVE EMERGENCY RESCUE ACTIVE • PAN-INDIA DISPATCH</span>
                </div>
                <div className="sos-hotline-badge">
                  <i className="fa-solid fa-phone-volume"></i>
                  <span>TOLL-FREE: <strong>1800-SART-SOS (7278-767)</strong></span>
                </div>
              </div>

              <div className="sos-hero-main-body">
                <div className="sos-hero-text">
                  <h2>Rapid Roadside Assistance (RSA) &amp; Vehicle Rescue</h2>
                  <p>
                    Stranded on a highway, caught in city traffic, or broken down at home? SART dispatches the nearest certified mechanic, 
                    zero-damage hydraulic flatbed, emergency fuel unit, or mobile EV charging van within <strong>12 to 15 minutes</strong>.
                  </p>
                </div>

                <div className="sos-hero-cta-group">
                  <button
                    type="button"
                    className="sos-btn-primary-call"
                    onClick={() => {
                      showToast('Dialing 24/7 SART Emergency Rescue Desk: 1800-SART-SOS...');
                    }}
                  >
                    <i className="fa-solid fa-phone"></i>
                    <span>Call 24/7 Emergency Hotline</span>
                  </button>

                  <button
                    type="button"
                    className="sos-btn-primary-gps"
                    onClick={() => {
                      setSelectedSosService({
                        title: 'Rapid Emergency GPS Patrol Dispatch',
                        icon: 'fa-truck-medical',
                        time: '11 Mins Arrival',
                        price: '₹349 Visit Fee',
                        categoryTag: 'All Vehicles',
                        desc: 'Nearest SART highway patrol unit dispatched immediately to your live GPS coordinates.',
                        features: ['Nearest patrol van allocated', 'Real-time GPS track on map', 'On-spot diagnostic tools included', 'Cashless insurance claim integration'],
                        assignedUnit: 'Patrol Van #TN-09-RSA-412',
                        driverName: 'Murugan K. (4.9 ★ • 1,420+ Dispatches)',
                        driverPhone: '+91 98400 12345'
                      });
                      setSosDispatchStage('finding');
                      setShowSosDispatchModal(true);
                      setTimeout(() => setSosDispatchStage('assigned'), 1800);
                      setTimeout(() => setSosDispatchStage('en_route'), 3600);
                    }}
                  >
                    <i className="fa-solid fa-location-crosshairs"></i>
                    <span>One-Tap GPS Auto-Dispatch</span>
                  </button>

                  <button
                    type="button"
                    className="sos-btn-whatsapp"
                    onClick={() => {
                      showToast('Opening WhatsApp SOS Channel with SART Dispatch Controller...');
                    }}
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    <span>WhatsApp SOS</span>
                  </button>
                </div>
              </div>

              {/* LIVE DETECTED LOCATION STRIP */}
              <div className="sos-location-live-strip">
                <div className="sos-loc-left">
                  <div className="loc-radar-icon">
                    <i className="fa-solid fa-satellite-dish"></i>
                  </div>
                  <div>
                    <span className="loc-sublabel">Your Detected Highway / City Location</span>
                    <strong className="loc-main-address">{sosLocationName}</strong>
                  </div>
                </div>
                <div className="sos-loc-right">
                  <div className="loc-nearest-badge">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Nearest Patrol Unit: <strong>2.4 km away</strong> (Est. 11 Mins)</span>
                  </div>
                  <button
                    type="button"
                    className="btn-change-gps-loc"
                    onClick={() => {
                      const updated = prompt('Enter your current highway mile-marker, landmark or city:', sosLocationName);
                      if (updated) {
                        setSosLocationName(updated);
                        showToast(`Location updated to: ${updated}`);
                      }
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i> Change Location
                  </button>
                </div>
              </div>
            </div>

            {/* VEHICLE TYPE FILTER BAR (ALL SART VEHICLES SUPPORTED) */}
            <div className="sos-filter-box">
              <div className="sos-filter-section-title">
                <i className="fa-solid fa-car"></i>
                <span>Select Your Stranded Vehicle Type:</span>
                <small className="sos-vtype-hint">(Tailors recovery trucks, hydraulic ramps &amp; equipment)</small>
              </div>

              <div className="sos-vtype-pills-row">
                {[
                  { id: 'All', label: 'All Vehicles', icon: 'fa-truck-monster' },
                  { id: 'Car', label: 'Car / SUV / MUV', icon: 'fa-car-side' },
                  { id: 'Bike', label: 'Bike / Scooter', icon: 'fa-motorcycle' },
                  { id: 'Auto', label: '3-Wheeler (Auto)', icon: 'fa-gas-pump' },
                  { id: 'Van', label: 'Commercial Van', icon: 'fa-van-shuttle' },
                  { id: 'Lorry', label: 'Heavy Truck / Lorry', icon: 'fa-truck-moving' },
                  { id: 'Bus', label: 'Bus / Coach', icon: 'fa-bus' },
                  { id: 'EV', label: 'Electric Vehicle (EV)', icon: 'fa-bolt' },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    className={`sos-vtype-btn ${sosVehicleType === v.id ? 'active' : ''}`}
                    onClick={() => {
                      setSosVehicleType(v.id);
                      showToast(`Filtered SOS assistance for: ${v.label}`);
                    }}
                  >
                    <i className={`fa-solid ${v.icon}`}></i>
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>

              {/* EMERGENCY ISSUE QUICK TRIAGE */}
              <div className="sos-filter-section-title" style={{ marginTop: '16px' }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>What Is Your Emergency Situation?</span>
              </div>

              <div className="sos-triage-pills-row">
                {[
                  { id: 'all', label: 'All Emergency Services', icon: 'fa-layer-group' },
                  { id: 'breakdown', label: 'Engine Won\'t Start / Breakdown', icon: 'fa-wrench' },
                  { id: 'puncture', label: 'Flat Tyre / Puncture Swap', icon: 'fa-circle-dot' },
                  { id: 'battery', label: 'Dead Battery / Jumpstart', icon: 'fa-car-battery' },
                  { id: 'fuel_ev', label: 'Out of Fuel / EV Battery 0%', icon: 'fa-gas-pump' },
                  { id: 'towing', label: 'Accident / Towing Recovery', icon: 'fa-truck-pickup' },
                  { id: 'locked', label: 'Key Locked Inside Vehicle', icon: 'fa-key' },
                ].map((iss) => (
                  <button
                    key={iss.id}
                    type="button"
                    className={`sos-triage-btn ${sosEmergencyIssue === iss.id ? 'active' : ''}`}
                    onClick={() => setSosEmergencyIssue(iss.id)}
                  >
                    <i className={`fa-solid ${iss.icon}`}></i>
                    <span>{iss.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* EMERGENCY SERVICE CARDS GRID */}
            <div className="sos-cards-modern-grid">
              {[
                {
                  id: 'breakdown',
                  icon: 'fa-screwdriver-wrench',
                  title: 'On-Spot Mechanical Breakdown Repair',
                  time: '12 - 15 Mins Arrival',
                  price: '₹349 Visit Fee',
                  categoryTag: 'Cars, Bikes, Autos & Light Vans',
                  desc: 'Engine crank failure, overheating radiator, broken clutch/accelerator cable, spark plug failure, or minor electrical triage solved right on the highway.',
                  features: ['Comprehensive 25-point on-spot diagnosis', 'Alternator, belt & fuse replacement', 'Coolant top-up & air bleeding', 'Parts billed at standard OEM MRP'],
                  driverName: 'Murugan K. (4.9 ★ • 1,420+ Dispatches)',
                  driverPhone: '+91 98400 12345',
                  assignedUnit: 'Patrol Van #TN-09-RSA-412'
                },
                {
                  id: 'towing',
                  icon: 'fa-truck-pickup',
                  title: 'Hydraulic Flatbed & Crane Towing Recovery',
                  time: '18 - 20 Mins Arrival',
                  price: '₹999 Starting (First 25 km)',
                  categoryTag: 'Cars, SUVs, Bikes & Commercial Lorries',
                  desc: 'Zero-damage hydraulic full-tilt flatbeds for luxury sedans and SUVs, specialized ramp vans for two-wheelers, and high-tonnage underlift cranes for heavy trucks.',
                  features: ['Zero-ground clearance hydraulic tilt bed', 'Soft nylon wheel lashings (no rim scratches)', 'Cashless drop to nearest network garage', 'Live GPS in-app tracking during tow'],
                  driverName: 'Selvam R. (4.8 ★ • 980+ Tow Dispatches)',
                  driverPhone: '+91 98400 54321',
                  assignedUnit: 'Flatbed Recovery Truck #TN-07-TOW-881'
                },
                {
                  id: 'puncture',
                  icon: 'fa-circle-dot',
                  title: 'Tubeless Puncture & Rapid Wheel Swap',
                  time: '10 - 12 Mins Arrival',
                  price: '₹199 per Tyre',
                  categoryTag: 'All Vehicles (Cars, Bikes, Autos, Trucks)',
                  desc: 'High-speed mobile puncture repair unit. On-the-spot tubeless vulcanizing mushroom plug repair, stepney spare wheel mounting, and high-pressure digital nitrogen inflation.',
                  features: ['Heavy-duty 3-ton hydraulic jack', 'German tubeless vulcanized plug repair', 'Digital torque-wrench wheel tightening', 'Spare wheel swap & bead sealing'],
                  driverName: 'Vignesh P. (4.9 ★ • 2,100+ Punctures Repaired)',
                  driverPhone: '+91 98400 67890',
                  assignedUnit: 'Rapid Bike & Tyre Patrol #TN-01-RSA-109'
                },
                {
                  id: 'battery',
                  icon: 'fa-car-battery',
                  title: 'Emergency Battery Jumpstart & Replacement',
                  time: '12 - 15 Mins Arrival',
                  price: '₹299 Jumpstart',
                  categoryTag: '12V Passenger & 24V Heavy Commercial Fleet',
                  desc: 'Heavy-duty 1000A booster pack for instant jumpstart. Digital load testing of battery, alternator, and starter motor. On-spot Amaron / Exide battery delivery available.',
                  features: ['12V & 24V surge-protected jumpstart', 'Computerized alternator health test', 'Doorstep Amaron / Exide replacement available', 'Old battery exchange discount up to ₹1,200'],
                  driverName: 'Karthik S. (4.9 ★ • 850+ Battery Dispatches)',
                  driverPhone: '+91 98400 99887',
                  assignedUnit: 'Battery Support Unit #TN-09-BAT-304'
                },
                {
                  id: 'fuel_ev',
                  icon: 'fa-gas-pump',
                  title: 'Emergency Fuel & Mobile EV Fast Charger',
                  time: '15 Mins Arrival',
                  price: '₹249 Delivery + Fuel / ₹699 EV Top-up',
                  categoryTag: 'Petrol, Diesel & EV Vehicles',
                  desc: 'Ran out of fuel or EV battery drained to 0%? 5 to 10 Litres of certified pure Petrol/Diesel delivered in sealed PESO-approved cans, or mobile 25 kW DC fast charger van top-up.',
                  features: ['5L pure Petrol or Diesel in PESO cans', 'Mobile DC fast charger (adds 20-30 km range in 15 mins)', 'Diesel fuel line priming & air-lock bleeding', 'Zero contamination guarantee'],
                  driverName: 'Aravind M. (4.8 ★ • 1,120+ Fuel Rescues)',
                  driverPhone: '+91 98400 11223',
                  assignedUnit: 'Mobile Fuel & EV Van #TN-02-EV-550'
                },
                {
                  id: 'towing',
                  icon: 'fa-car-burst',
                  title: 'Accident Triage, Winch & Insurance Garage Drop',
                  time: 'Immediate (Priority 1)',
                  price: '100% Free Triage Help',
                  categoryTag: 'Cashless Network for All Vehicles',
                  desc: 'Accident recovery specialists. On-scene documentation, FIR and police liaison guidance, zero-damage winching out of ditches or dividers, and cashless transport to authorized body shop.',
                  features: ['Spot survey & high-res damage photography', 'Assistance with police FIR & highway protocol', 'Direct transfer to 28+ cashless insurance workshops', 'Zero out-of-pocket towing under RSA policy'],
                  driverName: 'Dinesh Kumar (Accident Triage Commander)',
                  driverPhone: '+91 98400 44556',
                  assignedUnit: 'Heavy Winch Crane Unit #TN-09-REC-901'
                },
                {
                  id: 'locked',
                  icon: 'fa-key',
                  title: 'Smart Key Lockout & Non-Destructive Entry',
                  time: '15 - 20 Mins Arrival',
                  price: '₹449 Fixed Fee',
                  categoryTag: 'Cars, SUVs, Commercial Vans & Trucks',
                  desc: 'Keys locked inside the car or trunk? Certified locksmith technicians use professional air-wedge airbags and scratch-free reach rods to unlock doors without damaging paint or rubber seals.',
                  features: ['100% non-destructive air wedge entry', 'Zero scratch guarantee on glass & paint', 'Smart key fob battery replacement on spot', 'Valid vehicle RC & ID verification required'],
                  driverName: 'Ramesh Babu (Lockout Specialist)',
                  driverPhone: '+91 98400 77889',
                  assignedUnit: 'Rapid Lockout Patrol #TN-01-KEY-007'
                },
                {
                  id: 'breakdown',
                  icon: 'fa-truck-moving',
                  title: 'Heavy Commercial Lorry & Bus Fleet SOS',
                  time: '20 - 25 Mins Arrival',
                  price: 'Custom Fleet Corporate Tariff',
                  categoryTag: 'Lorries, Trailers, Multi-Axle Trucks & Buses',
                  desc: 'Highway long-haul emergency assistance for transport fleet operators. Air brake pneumatic hose repair, heavy wheel nut torquing, propeller shaft recovery, and 40-ton crane rescue.',
                  features: ['Heavy pneumatic impact wrenches & jacks', 'Trailer kingpin & air brake diagnostics', 'Heavy underlift towing for 16-to-40 ton trucks', 'Driver highway food & safety assistance'],
                  driverName: 'Rajendran M. (Heavy Fleet Recovery Lead)',
                  driverPhone: '+91 98400 33221',
                  assignedUnit: 'Heavy Fleet 40T Recovery Rig #TN-04-CRANE-99'
                }
              ]
                .filter((srv) => {
                  if (sosEmergencyIssue !== 'all' && srv.id !== sosEmergencyIssue) return false;
                  return true;
                })
                .map((srv) => (
                  <div key={srv.title} className="sos-modern-card">
                    <div className="sos-card-header-bar">
                      <div className="sos-badge-eta">
                        <i className="fa-solid fa-bolt"></i>
                        <span>{srv.time}</span>
                      </div>
                      <span className="sos-tag-vehicles">{srv.categoryTag}</span>
                    </div>

                    <div className="sos-card-middle">
                      <div className="sos-icon-circle">
                        <i className={`fa-solid ${srv.icon}`}></i>
                      </div>
                      <div className="sos-title-block">
                        <h4>{srv.title}</h4>
                        <p className="sos-desc-text">{srv.desc}</p>
                      </div>
                    </div>

                    <ul className="sos-features-checklist">
                      {srv.features.map((feat, i) => (
                        <li key={i}>
                          <i className="fa-solid fa-circle-check"></i>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="sos-card-bottom-bar">
                      <div className="sos-price-box">
                        <span className="sos-price-label">Transparent Tariff</span>
                        <strong className="sos-price-value">{srv.price}</strong>
                      </div>
                      <button
                        type="button"
                        className="btn-sos-card-dispatch"
                        onClick={() => {
                          setSelectedSosService(srv);
                          setSosDispatchStage('finding');
                          setShowSosDispatchModal(true);
                          setTimeout(() => setSosDispatchStage('assigned'), 1800);
                          setTimeout(() => setSosDispatchStage('en_route'), 3600);
                        }}
                      >
                        <i className="fa-solid fa-truck-fast"></i>
                        <span>Dispatch Now</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* HIGHWAY EMERGENCY PROTOCOL (SAFETY STEPS WHILE WAITING) */}
            <div className="sos-safety-protocol-section">
              <div className="sos-section-header">
                <h3><i className="fa-solid fa-shield-halved"></i> Highway Emergency Safety Protocol</h3>
                <p>Follow these critical guidelines to stay 100% safe while our patrol unit reaches your vehicle.</p>
              </div>

              <div className="sos-safety-grid">
                <div className="sos-safety-card">
                  <div className="safety-icon warn">
                    <i className="fa-solid fa-lightbulb"></i>
                  </div>
                  <h5>1. Hazard Lights On</h5>
                  <p>Turn on your hazard warning flashers immediately to alert speeding highway vehicles from behind.</p>
                </div>

                <div className="sos-safety-card">
                  <div className="safety-icon danger">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <h5>2. Warning Triangle 50m Back</h5>
                  <p>Place your reflective red warning triangle at least 50 meters behind your vehicle on the highway shoulder.</p>
                </div>

                <div className="sos-safety-card">
                  <div className="safety-icon safe">
                    <i className="fa-solid fa-person-shelter"></i>
                  </div>
                  <h5>3. Stand Behind Barrier</h5>
                  <p>Never sit inside the vehicle on a high-speed motorway. Move all passengers safely behind the steel crash barrier.</p>
                </div>

                <div className="sos-safety-card">
                  <div className="safety-icon police">
                    <i className="fa-solid fa-headset"></i>
                  </div>
                  <h5>4. Emergency 112 &amp; 1033 Sync</h5>
                  <p>SART dispatch auto-syncs with National Highway Emergency (1033) &amp; Police 112 if you request armed assistance.</p>
                </div>
              </div>
            </div>

            {/* SART RSA FLEET COMMITMENTS & CASHLESS PARTNERS */}
            <div className="sos-guarantee-strip">
              <div className="guarantee-item">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <div>
                  <strong>15-Minute Highway Commitment</strong>
                  <span>Fastest average response time on 98% of Indian National &amp; State Highways.</span>
                </div>
              </div>
              <div className="guarantee-item">
                <i className="fa-solid fa-shield-check"></i>
                <div>
                  <strong>Zero-Damage Recovery Guarantee</strong>
                  <span>Hydraulic low-angle tilt beds protect bumpers, differentials, and alloy rims.</span>
                </div>
              </div>
              <div className="guarantee-item">
                <i className="fa-solid fa-file-invoice-dollar"></i>
                <div>
                  <strong>28+ Cashless Insurer Partners</strong>
                  <span>Direct cashless claim billing with ICICI Lombard, HDFC Ergo, Tata AIG, Bajaj Allianz &amp; more.</span>
                </div>
              </div>
              <div className="guarantee-item">
                <i className="fa-solid fa-person-dress"></i>
                <div>
                  <strong>Female Motorist Priority Escort</strong>
                  <span>Police-verified background-checked technicians with automated family live-location tracking.</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE LIVE SOS DISPATCH MODAL */}
            {showSosDispatchModal && selectedSosService && (
              <div className="sos-modal-overlay animate-fade">
                <div className="sos-modal-box animate-pop">
                  <div className="sos-modal-header">
                    <div className="sos-modal-title">
                      <div className="sos-beacon-pulse"></div>
                      <div>
                        <h3>Live Emergency Dispatch Tracking</h3>
                        <span className="sos-order-ref">Request ID: #SART-SOS-98124 • Priority Level: CRITICAL</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="sos-modal-close-btn"
                      onClick={() => setShowSosDispatchModal(false)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>

                  <div className="sos-modal-body">
                    {/* DISPATCH PROGRESS RADAR */}
                    <div className="sos-tracker-radar-panel">
                      <div className="radar-circle-anim">
                        <div className="radar-sweep"></div>
                        <i className="fa-solid fa-truck-medical radar-center-icon"></i>
                      </div>
                      <div className="radar-status-info">
                        <span className="radar-tag">
                          {sosDispatchStage === 'finding' && 'SEARCHING NEAREST PATROL UNIT...'}
                          {sosDispatchStage === 'assigned' && 'PATROL OFFICER ALLOCATED!'}
                          {sosDispatchStage === 'en_route' && 'PATROL VEHICLE EN ROUTE VIA GPS!'}
                        </span>
                        <h4>{selectedSosService.title}</h4>
                        <p className="radar-loc-txt">
                          <i className="fa-solid fa-location-dot"></i> Destination: {sosLocationName}
                        </p>
                      </div>
                    </div>

                    {/* DRIVER & VEHICLE DETAILS */}
                    <div className="sos-driver-card">
                      <div className="driver-avatar-box">
                        <i className="fa-solid fa-user-shield"></i>
                      </div>
                      <div className="driver-details">
                        <div className="driver-name-row">
                          <strong>{selectedSosService.driverName}</strong>
                          <span className="driver-badge">VERIFIED SART RESPONDER</span>
                        </div>
                        <span className="driver-sub">{selectedSosService.assignedUnit}</span>
                        <div className="driver-specs">
                          <span><i className="fa-solid fa-toolbox"></i> Fully Equipped RSA Unit</span>
                          <span><i className="fa-solid fa-route"></i> Distance: 2.4 km away</span>
                        </div>
                      </div>
                      <div className="driver-eta-box">
                        <span className="eta-lbl">EST. ARRIVAL</span>
                        <strong className="eta-val">11 MINS</strong>
                      </div>
                    </div>

                    {/* TIMELINE STEPS */}
                    <div className="sos-timeline-steps">
                      <div className="timeline-step completed">
                        <div className="step-circle"><i className="fa-solid fa-check"></i></div>
                        <div className="step-content">
                          <strong>SOS Request Received &amp; GPS Locked</strong>
                          <small>Coordinates verified by Chennai Highway Dispatch Desk</small>
                        </div>
                      </div>

                      <div className={`timeline-step ${sosDispatchStage === 'assigned' || sosDispatchStage === 'en_route' ? 'completed' : 'active'}`}>
                        <div className="step-circle">
                          {sosDispatchStage === 'finding' ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}
                        </div>
                        <div className="step-content">
                          <strong>Unit #412 Dispatched from Guindy RSA Depot</strong>
                          <small>Technician rolling with hydraulic gear, booster pack &amp; tyre kit</small>
                        </div>
                      </div>

                      <div className={`timeline-step ${sosDispatchStage === 'en_route' ? 'active' : ''}`}>
                        <div className="step-circle">
                          {sosDispatchStage === 'en_route' ? <i className="fa-solid fa-location-arrow"></i> : <i className="fa-solid fa-circle"></i>}
                        </div>
                        <div className="step-content">
                          <strong>Patrol Unit Approaching Your Vehicle</strong>
                          <small>Keep your hazard lights flashing for rapid visual identification</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MODAL FOOTER ACTIONS */}
                  <div className="sos-modal-footer">
                    <button
                      type="button"
                      className="btn-modal-call-driver"
                      onClick={() => showToast(`Dialing Patrol Driver (${selectedSosService.driverPhone})...`)}
                    >
                      <i className="fa-solid fa-phone"></i>
                      <span>Call Patrol Driver</span>
                    </button>

                    <button
                      type="button"
                      className="btn-modal-share-loc"
                      onClick={() => showToast('Live GPS location shared via WhatsApp to Emergency Contacts!')}
                    >
                      <i className="fa-brands fa-whatsapp"></i>
                      <span>Share Location With Family</span>
                    </button>

                    <button
                      type="button"
                      className="btn-modal-close"
                      onClick={() => {
                        setShowSosDispatchModal(false);
                        showToast('Dispatch modal closed. Live tracking continues in background.');
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

          </section>
        )}

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
              {/* Hub Category Filter Tabs */}
              <div className="modal-hub-filter-tabs">
                {[
                  { id: 'all', label: 'All Locations', icon: 'fa-location-dot' },
                  { id: 'mechanic', label: 'Nearby Mechanics', icon: 'fa-wrench' },
                  { id: 'service_center', label: 'Service Centers', icon: 'fa-building-shield' },
                  { id: 'modification', label: 'Vehicle Modification', icon: 'fa-wand-magic-sparkles' },
                  { id: 'store', label: 'Auto Parts Stores', icon: 'fa-shop' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`hub-filter-tab-btn ${nearbyStoreFilter === tab.id ? 'active' : ''}`}
                    onClick={() => setNearbyStoreFilter(tab.id as any)}
                  >
                    <i className={`fa-solid ${tab.icon}`}></i>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="store-list-container">
                {filteredNearbyStores.map((store) => (
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
                        <div className="store-name-row">
                          <h4 className="store-item-name">{store.name}</h4>
                          <span className={`hub-category-tag tag-${store.hubCategory}`}>
                            {store.hubCategory === 'mechanic' && '🛠️ On-Demand Mechanic'}
                            {store.hubCategory === 'service_center' && '🏢 Authorized Service Center'}
                            {store.hubCategory === 'modification' && '✨ Modification & Tuning Studio'}
                            {store.hubCategory === 'store' && '📦 Auto Spares Hub'}
                          </span>
                        </div>
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

      {/* ADD VEHICLE MODAL */}
      {showAddVehicleModal && (
        <div className="store-locator-backdrop animate-pop" onClick={() => setShowAddVehicleModal(false)}>
          <div
            className="store-locator-modal add-vehicle-modal-card animate-scale"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-add-vehicle-title"
          >
            <div className="store-modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge">
                  <i className="fa-solid fa-car-side"></i>
                </div>
                <div>
                  <h3 id="modal-add-vehicle-title">Add Your Vehicle</h3>
                  <p>Save your vehicle to get exact compatible spare parts &amp; verified workshop services</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowAddVehicleModal(false)}
                aria-label="Close Modal"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form className="add-vehicle-modal-form" onSubmit={handleSaveNewVehicle}>
              {/* Vehicle Type */}
              <div className="modal-form-group">
                <label className="modal-form-label">
                  <i className="fa-solid fa-shapes"></i> Vehicle Type
                </label>
                <div className="modal-type-chips">
                  {VEHICLE_TYPES.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`modal-type-btn ${newVehicleType === v.id ? 'active' : ''}`}
                      onClick={() => handleModalVehicleTypeChange(v.id)}
                    >
                      <i className={`fa-solid ${v.icon}`}></i>
                      <span>{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand and Model Row */}
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label className="modal-form-label">
                    <i className="fa-solid fa-industry"></i> Brand / Manufacturer
                  </label>
                  <div className="select-wrapper">
                    <select
                      value={newVehicleBrand}
                      onChange={(e) => handleModalBrandChange(e.target.value)}
                      aria-label="Select Brand"
                    >
                      {modalAvailableBrands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down select-arrow"></i>
                  </div>
                </div>

                <div className="modal-form-group">
                  <label className="modal-form-label">
                    <i className="fa-solid fa-car-rear"></i> Model
                  </label>
                  <div className="select-wrapper">
                    <select
                      value={newVehicleModel}
                      onChange={(e) => setNewVehicleModel(e.target.value)}
                      aria-label="Select Model"
                    >
                      {modalAvailableModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down select-arrow"></i>
                  </div>
                </div>
              </div>

              {/* Year and Fuel Row */}
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label className="modal-form-label">
                    <i className="fa-regular fa-calendar"></i> Year
                  </label>
                  <div className="select-wrapper">
                    <select
                      value={newVehicleYear}
                      onChange={(e) => setNewVehicleYear(e.target.value)}
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

                <div className="modal-form-group">
                  <label className="modal-form-label">
                    <i className="fa-solid fa-gas-pump"></i> Fuel / Engine Type
                  </label>
                  <div className="select-wrapper">
                    <select
                      value={newVehicleFuel}
                      onChange={(e) => setNewVehicleFuel(e.target.value)}
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
              </div>

              {/* Optional Registration Number & Nickname */}
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label className="modal-form-label">
                    <i className="fa-solid fa-id-card"></i> Vehicle Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={newVehicleReg}
                    onChange={(e) => setNewVehicleReg(e.target.value)}
                    placeholder="e.g. TN 09 BK 2024"
                    className="modal-text-input"
                  />
                </div>

                <div className="modal-form-group">
                  <label className="modal-form-label">
                    <i className="fa-solid fa-tag"></i> Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    value={newVehicleNickname}
                    onChange={(e) => setNewVehicleNickname(e.target.value)}
                    placeholder="e.g. My Weekend Beast"
                    className="modal-text-input"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowAddVehicleModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  <i className="fa-solid fa-car-circle-check"></i>
                  <span>Save &amp; View Vehicle Parts</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT QUICK-VIEW & BOOKING DETAIL MODAL */}
      {selectedProductModal && (
        <div
          className="store-locator-backdrop animate-pop"
          onClick={() => setSelectedProductModal(null)}
        >
          <div
            className="store-locator-modal product-quickview-modal-card animate-scale"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-product-title"
          >
            {/* Modal Header */}
            <div className="store-modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge">
                  <i className={`fa-solid ${selectedProductModal.icon || 'fa-box'}`}></i>
                </div>
                <div>
                  <h3 id="modal-product-title">{selectedProductModal.name}</h3>
                  <p>
                    Category: <strong>{selectedProductModal.category}</strong> • Vehicle: <strong>{selectedProductModal.vehicle}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setSelectedProductModal(null)}
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="product-quickview-body">
              {/* Product Media & Core Specs */}
              <div className="quickview-media-grid">
                <div className="quickview-image-box">
                  <img
                    src={selectedProductModal.image}
                    alt={selectedProductModal.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  {selectedProductModal.badge && (
                    <span className="catalog-card-badge">{selectedProductModal.badge}</span>
                  )}
                </div>

                <div className="quickview-summary-box">
                  <div className="quickview-price-banner">
                    <div>
                      <span className="total-label">Total Price:</span>
                      <div className="catalog-price-wrap">
                        <span className="quickview-current-price">
                          {formatPrice(getProductTotalPrice(selectedProductModal))}
                        </span>
                        {selectedProductModal.originalPrice && (
                          <span className="catalog-strike-price">
                            {formatPrice(selectedProductModal.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedProductModal.originalPrice && (
                      <span className="discount-tag">
                        Save {Math.round(((selectedProductModal.originalPrice - selectedProductModal.price) / selectedProductModal.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  <p className="quickview-desc">{selectedProductModal.desc}</p>

                  <div className="quickview-meta-badges">
                    {selectedProductModal.warranty && (
                      <span className="warranty-tag">
                        <i className="fa-solid fa-shield-halved"></i> Warranty: {selectedProductModal.warranty}
                      </span>
                    )}
                    {selectedProductModal.duration && (
                      <span className="duration-pill">
                        <i className="fa-regular fa-clock"></i> Duration: {selectedProductModal.duration}
                      </span>
                    )}
                    <span className="pickup-tag">
                      <i className="fa-solid fa-truck-ramp-box"></i> {fulfillmentMode === 'nearby' ? preferredStore.name : 'Doorstep Service / Delivery'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inclusions List */}
              {(selectedProductModal.includes || []).length > 0 && (
                <div className="quickview-section">
                  <h4 className="quickview-section-title">
                    <i className="fa-solid fa-circle-check"></i> What's Included:
                  </h4>
                  <div className="quickview-inc-grid">
                    {selectedProductModal.includes?.map((inc) => (
                      <div key={inc} className="quickview-inc-item">
                        <i className="fa-solid fa-check"></i>
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment & Recommended Add-ons */}
              {(selectedProductModal.equipmentOptions || []).length > 0 && (
                <div className="quickview-section">
                  <h4 className="quickview-section-title">
                    <i className="fa-solid fa-toolbox"></i> Optional Equipment &amp; Add-ons:
                  </h4>
                  <div className="quickview-addons-grid">
                    {selectedProductModal.equipmentOptions?.map((opt) => {
                      const isSelected = (selectedEquipment[selectedProductModal.id] ?? []).includes(opt.name);
                      return (
                        <label key={opt.name} className={`quickview-addon-label ${isSelected ? 'active' : ''}`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleEquipmentOption(selectedProductModal.id, opt.name)}
                          />
                          <span className="addon-text">{opt.name}</span>
                          <span className="addon-price">+{formatPrice(opt.price)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Vehicle Compatibility Banner */}
              <div className="quickview-fitment-bar">
                <i className="fa-solid fa-shield-cat"></i>
                <div>
                  <strong>Guaranteed Fitment:</strong> Compatible with {selectedProductModal.compatibleWith || selectedProductModal.vehicle || 'all verified models'}.
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="product-quickview-footer">
              <button
                type="button"
                className={`btn-quickview-wishlist ${wishlist.includes(selectedProductModal.id) ? 'active' : ''}`}
                onClick={() => {
                  toggleWishlist(selectedProductModal.id);
                  showToast(
                    wishlist.includes(selectedProductModal.id)
                      ? `Removed from Wishlist: ${selectedProductModal.name}`
                      : `Added to Wishlist: ${selectedProductModal.name}`
                  );
                }}
              >
                <i className={wishlist.includes(selectedProductModal.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                <span>{wishlist.includes(selectedProductModal.id) ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                type="button"
                className="btn-quickview-add-cart"
                onClick={() => {
                  handleAddToCart(selectedProductModal);
                  setSelectedProductModal(null);
                }}
              >
                <i className="fa-solid fa-cart-shopping"></i>
                <span>Add To Cart • {formatPrice(getProductTotalPrice(selectedProductModal))}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}