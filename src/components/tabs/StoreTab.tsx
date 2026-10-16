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
  LocationFuelEvStation,
  AUTOMOTIVE_NEWS_DATA,
  VEHICLE_VIDEO_REVIEWS,
  POPULAR_COMPARISON_PAIRS,
  UPCOMING_CARS_FAQS,
  VEHICLE_EMI_CATALOG,
  VehicleModelItem,
  VehicleVariant
} from './storeData';
import {
  Carbike360FindNewView,
  Carbike360LatestView,
  Carbike360UpcomingView,
  Carbike360ElectricView,
  Carbike360TrendingView,
  Carbike360UsedCatalogView,
  Carbike360DealershipsView,
  Carbike360OnRoadPriceModal
} from './CarBike360Views';

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
  Tractor: [
    'Mahindra Tractor', 'Swaraj', 'John Deere', 'Sonalika', 'Eicher Tractors', 'Escorts Farmtrac'
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

  'Mahindra Tractor': ['575 DI XP Plus', 'Arjun Novo 605', 'Yuvo Tech+ 415', 'Oja 3140 4WD'],
  'Swaraj': ['Swaraj 744 FE', 'Swaraj 855 FE', 'Swaraj 735 XT', 'Swaraj Target 630'],
  'John Deere': ['5050 D GearPro', '5310 4WD', '5105 Utility', '5045 D PowerPro'],
  'Sonalika': ['DI 745 III Sikander', 'Tiger DI 65 4WD', 'Sikander DI 60', 'GT 26 Mini Tractor'],
  'Eicher Tractors': ['Eicher 380 Super DI', 'Eicher 485', 'Eicher 551 Super Plus'],
  'Escorts Farmtrac': ['Farmtrac 60 Powermaxx', 'Farmtrac 45 Classic', 'Powertrac Euro 50'],
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
  const [cardekhoModelFilter, setCardekhoModelFilter] = useState<string>('All Models');
  const [cardekhoCityFilter, setCardekhoCityFilter] = useState<string>('All Cities');
  const [cardekhoNavCategory, setCardekhoNavCategory] = useState<string>('all');
  const [homeCarSubCategory, setHomeCarSubCategory] = useState<string>('All');
  const [homeBikeSubCategory, setHomeBikeSubCategory] = useState<string>('All');
  const [homeCommercialSubCategory, setHomeCommercialSubCategory] = useState<string>('All');
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

  // Vehicle Comparison Selector (Up to 4 Slots - SART All-Vehicle Multi-Class Comparison)
  const [selectedCompareVehicleType, setSelectedCompareVehicleType] = useState<string>('Car');
  const [compareSelectedVehicles, setCompareSelectedVehicles] = useState<(ComparisonVehicle | null)[]>([
    COMPARISON_VEHICLES.find(v => v.category === 'Car') || COMPARISON_VEHICLES[12],
    COMPARISON_VEHICLES.filter(v => v.category === 'Car')[1] || COMPARISON_VEHICLES[13],
    null,
    null
  ]);
  const [compareActiveCategory, setCompareActiveCategory] = useState<string>('All');
  const [compareVehicleSearchQuery, setCompareVehicleSearchQuery] = useState<string>('');
  const [comparePickerSlot, setComparePickerSlot] = useState<number | null>(null);
  const [comparePopularTab, setComparePopularTab] = useState<'All' | 'Scooters' | 'Electric' | 'Bikes' | 'Cars' | 'Commercial'>('All');

  // User Top Header Location & Search Bar (User Reference Image)
  const [userLocationCity, setUserLocationCity] = useState<string>('Chennai');
  const [topVehicleSearch, setTopVehicleSearch] = useState<string>('');

  // Dropdown states for New Vehicle and Used Vehicle buttons (User Image Reference)
  const [newVehicleDropdownOpen, setNewVehicleDropdownOpen] = useState<boolean>(false);
  const [usedVehicleDropdownOpen, setUsedVehicleDropdownOpen] = useState<boolean>(false);
  const [activeDropdownSubmenu, setActiveDropdownSubmenu] = useState<string | null>(null);
  const newVehicleDropdownRef = useRef<HTMLDivElement>(null);
  const usedVehicleDropdownRef = useRef<HTMLDivElement>(null);

  // CarBike360.com page mode triggered by dropdown options (User Screenshots Reference)
  const [carbike360PageMode, setCarbike360PageMode] = useState<
    | 'portal_home'     // Default portal overview with ad banner & finder
    | 'find_new'        // Image 1: "New Cars in India" with Left Filter Sidebar + Wide Horizontal Cards
    | 'latest'          // Image 2: "Latest Cars in India" with Right Sidebar Explore Brands + Chetak ads
    | 'upcoming'        // Images 3 & 4: "Upcoming Cars in India 2026" with Launch Filters, Expected Launch Date, Notify Me, Right Sidebar, FAQs
    | 'electric'        // "100% Electric Vehicles in India" with EV Specs & Charging
    | 'trending'        // Trending Vehicles in India
    | 'used_catalog'    // Certified Pre-Owned Vehicles
    | 'dealerships'     // Authorized Dealers & Showrooms
  >('portal_home');

  // CarBike360 Left Sidebar Filters for Image 1 (Find New Cars)
  const [cb360PriceRange, setCb360PriceRange] = useState<string>('all');
  const [cb360SelectedBrands, setCb360SelectedBrands] = useState<string[]>([]);
  const [cb360SelectedBodyTypes, setCb360SelectedBodyTypes] = useState<string[]>([]);
  const [cb360SelectedFuels, setCb360SelectedFuels] = useState<string[]>([]);
  const [cb360SelectedTransmissions, setCb360SelectedTransmissions] = useState<string[]>([]);
  const [cb360SelectedSeating, setCb360SelectedSeating] = useState<string>('all');
  const [cb360SortBy, setCb360SortBy] = useState<'popular' | 'price_low' | 'price_high' | 'rating'>('popular');

  // CarBike360 Upcoming Cars Filter Bar (Images 3 & 4)
  const [cb360UpcomingBrand, setCb360UpcomingBrand] = useState<string>('All Brands');
  const [cb360UpcomingBodyType, setCb360UpcomingBodyType] = useState<string>('All Body Types');
  const [cb360UpcomingBudget, setCb360UpcomingBudget] = useState<string>('All Prices');
  const [cb360FaqOpenIndex, setCb360FaqOpenIndex] = useState<number | null>(0);
  const [onRoadPriceModalVehicle, setOnRoadPriceModalVehicle] = useState<VehicleShowcaseItem | null>(null);
  const [cb360BrandSearch, setCb360BrandSearch] = useState<string>('');
  const [cb360PickRightTab, setCb360PickRightTab] = useState<'brand' | 'budget' | 'body' | 'fuel' | 'transmission'>('brand');
  const [cb360ShowMoreBrands, setCb360ShowMoreBrands] = useState<boolean>(false);
  const [cb360SeeMoreHeader, setCb360SeeMoreHeader] = useState<boolean>(false);

  // Fuel Price Selected State, City and Search
  const [selectedFuelState, setSelectedFuelState] = useState<string>('Tamil Nadu');
  const [selectedFuelCity, setSelectedFuelCity] = useState<string>('Chennai');
  const [fuelLocationSearchQuery, setFuelLocationSearchQuery] = useState<string>('');
  const [fuelBrandFilter, setFuelBrandFilter] = useState<string>('all');
  const [stationFilterCategory, setStationFilterCategory] = useState<string>('all');

  // CarDekho-style EMI Calculator States (User Image 3 Reference)
  const [emiVehicleCategory, setEmiVehicleCategory] = useState<string>('Car');
  const [emiCarBrand, setEmiCarBrand] = useState<string>('Tata');
  const [emiCarModel, setEmiCarModel] = useState<string>('car-sierra');
  const [emiCarVariant, setEmiCarVariant] = useState<string>('sierra-smart-plus');
  const [emiOnRoadPrice, setEmiOnRoadPrice] = useState<number>(1311000);
  const [emiDownPayment, setEmiDownPayment] = useState<number>(131000);
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

  // Close vehicle dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (newVehicleDropdownRef.current && !newVehicleDropdownRef.current.contains(target)) {
        setNewVehicleDropdownOpen(false);
      }
      if (usedVehicleDropdownRef.current && !usedVehicleDropdownRef.current.contains(target)) {
        setUsedVehicleDropdownOpen(false);
      }
      if (
        (!newVehicleDropdownRef.current || !newVehicleDropdownRef.current.contains(target)) &&
        (!usedVehicleDropdownRef.current || !usedVehicleDropdownRef.current.contains(target))
      ) {
        setActiveDropdownSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

      {/* TOP CLEAN WHITE HEADER: 7 BUTTONS + SEARCH BAR + LOCATION ALL IN A SINGLE ROW */}
      <div className="store-top-bar-clean">
        <div className="store-top-bar-content">
          <div className="store-single-row-header">
            {/* Left: All 7 Buttons */}
            <div className="sart-super-hub-nav single-row-nav">
              {[
                { id: 'buy_sell', label: 'Buy / Sell Vehicle', icon: 'fa-car-side' },
                { id: 'spare_parts', label: 'Spare Parts & Accessories', icon: 'fa-gears' },
                { id: 'mechanic_service', label: 'Mechanic & Service', icon: 'fa-wrench' },
                { id: 'emergency_sos', label: '24/7 Roadside Assistance', icon: 'fa-truck-medical', badge: 'SOS' },
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
                  title={tab.label}
                >
                  <i className={`fa-solid ${tab.icon} tab-direct-icon`}></i>
                  <span className="tab-main-label">{tab.label}</span>
                  {tab.badge && (
                    <span className="tab-badge-pill badge-alert">{tab.badge}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Right: Search Bar & Location Chooser */}
            <div className="store-top-actions-right">
              {/* Search Bar Pill */}
              <div className="store-top-search-pill">
                <input
                  type="text"
                  placeholder="Search cars, bikes, scooters..."
                  value={topVehicleSearch}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTopVehicleSearch(val);
                    if (activeHubTab !== 'buy_sell' && val.trim()) {
                      setActiveHubTab('buy_sell');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (activeHubTab !== 'buy_sell') setActiveHubTab('buy_sell');
                      showToast(topVehicleSearch ? `Showing search results for "${topVehicleSearch}"` : 'Enter a vehicle name to search');
                    }
                  }}
                />
                <button
                  type="button"
                  className="top-search-icon-btn"
                  onClick={() => {
                    if (activeHubTab !== 'buy_sell') setActiveHubTab('buy_sell');
                    showToast(topVehicleSearch ? `Showing search results for "${topVehicleSearch}"` : 'Enter a vehicle name to search');
                  }}
                  title="Search"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                {topVehicleSearch && (
                  <button
                    type="button"
                    className="top-search-clear-btn"
                    onClick={() => {
                      setTopVehicleSearch('');
                      showToast('Search cleared');
                    }}
                    title="Clear search"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              {/* Location Chooser Pill */}
              <div className="store-top-location-picker">
                <div className="location-pin-wrap">
                  <i className="fa-solid fa-location-dot location-dot-icon"></i>
                  <span className="location-online-dot"></span>
                </div>
                <select
                  value={userLocationCity}
                  onChange={(e) => {
                    const newCity = e.target.value;
                    setUserLocationCity(newCity);
                    setSelectedFuelCity(newCity);
                    setCardekhoCityFilter(newCity);
                    showToast(`Location updated to ${newCity}`);
                  }}
                  className="location-city-select"
                >
                  <option value="Chennai">Chennai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Pune">Pune</option>
                </select>
                <i className="fa-solid fa-chevron-down location-arrow-icon"></i>
              </div>
            </div>
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

            {/* FULL-WIDTH LEADERBOARD AD BANNER (User First Image Reference: Chetak Sport Mode Electric Ad) */}
            <div className="sart-leaderboard-ad-banner" onClick={() => {
              setCardekhoSelectedType('Bike');
              setCardekhoBodyTypeFilter('Electric');
              showToast('Opening Bajaj Chetak Sport Mode • ₹99,800/- Special Offer');
            }}>
              <div className="ad-banner-link">
                <div className="ad-banner-content">
                  <div className="ad-banner-side-visual">
                    <span className="ad-badge-tag">Featured Ad</span>
                    <div className="ad-scooter-avatar">
                      <i className="fa-solid fa-motorcycle"></i>
                    </div>
                  </div>

                  <div className="ad-banner-center-copy">
                    <div className="ad-headline-small">STAY TECHPROOF WITH</div>
                    <div className="ad-brand-title">
                      <span className="ad-brand-font">Chetak</span>
                      <span className="ad-feature-pill">SPORT MODE</span>
                    </div>
                    <div className="ad-speed-tag">FULLY LIFEPROOF • TOP SPEED 80 KM/H • ZERO EMISSION</div>
                  </div>

                  <div className="ad-banner-cta-group">
                    <div className="ad-price-col">
                      <span className="ad-price-lbl">Starting at</span>
                      <div className="ad-price-val">₹ 99 800/-*</div>
                    </div>
                    <button type="button" className="ad-cta-btn">
                      <span>Explore Chetak</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* UNIFIED CONTAINER FOR: (1) TOP CHOOSE VEHICLE + (2) NEW / USED / SELL BUTTONS + (3) VEHICLE FINDER FORM */}
            <div className="sart-unified-buysell-container">
              {/* 1. TOP CHOOSE VEHICLE SELECTOR STRIP (All Categories, Bike, Car, Van, Bus, Lorry, Tractor, Auto, EV) */}
              <div className="sart-top-vehicle-category-selector-bar">
                <div className="sart-vehicle-selector-label">
                  <i className="fa-solid fa-layer-group"></i>
                  <span>1. Choose Vehicle:</span>
                </div>
                <div className="sart-vehicle-category-pill-group">
                  {[
                    { id: 'All', label: 'All Vehicles', icon: 'fa-border-all' },
                    { id: 'Car', label: 'Cars & SUVs', icon: 'fa-car-side' },
                    { id: 'Bike', label: 'Bikes & Scooters', icon: 'fa-motorcycle' },
                    { id: 'Van', label: 'Commercial Vans', icon: 'fa-van-shuttle' },
                    { id: 'Bus', label: 'Buses', icon: 'fa-bus' },
                    { id: 'Lorry', label: 'Trucks / Lorries', icon: 'fa-truck-moving' },
                    { id: 'Tractor', label: 'Agri Tractors', icon: 'fa-tractor' },
                    { id: 'Auto', label: '3-Wheelers', icon: 'fa-taxi' },
                    { id: 'EV', label: 'Electric (EV)', icon: 'fa-bolt' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`sart-vehicle-pill-btn ${cardekhoSelectedType === v.id ? 'active' : ''}`}
                      onClick={() => {
                        setCardekhoSelectedType(v.id);
                        setCardekhoBrandFilter('All Brands');
                        setCardekhoModelFilter('All Models');
                        setCardekhoBodyTypeFilter('All');
                        showToast(`Selected Category: ${v.label}`);
                      }}
                      title={`Filter by ${v.label}`}
                    >
                      <i className={`fa-solid ${v.icon}`}></i>
                      <span>{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. SUB-NAV: NEW VEHICLE (WITH ATTACHED ARROW), USED VEHICLE (WITH DOWN ARROW), SELL VEHICLE */}
              <div className="sart-buysell-top-subnav embedded-in-container">
                <div className="sart-buysell-three-buttons">
                  {/* 1. NEW VEHICLE BUTTON WITH ATTACHED DOWN ARROW */}
                  <div
                    className="sart-buysell-dropdown-wrap"
                    ref={newVehicleDropdownRef}
                  >
                    <button
                      type="button"
                      className={`sart-buysell-btn ${cardekhoViewMode === 'buy' && cardekhoVehicleCondition === 'new' ? 'active' : ''} ${newVehicleDropdownOpen ? 'menu-open' : ''}`}
                      onClick={() => {
                        setCardekhoViewMode('buy');
                        setCardekhoVehicleCondition('new');
                        setCardekhoNavCategory('all');
                        setCarbike360PageMode('portal_home');
                        setNewVehicleDropdownOpen(false);
                        setUsedVehicleDropdownOpen(false);
                        showToast('Viewing New Vehicles');
                      }}
                    >
                      <i className="fa-solid fa-sparkles"></i>
                      <span>New Vehicle</span>
                      <span
                        className="sart-dropdown-arrow-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewVehicleDropdownOpen((prev) => !prev);
                          setUsedVehicleDropdownOpen(false);
                        }}
                        title={newVehicleDropdownOpen ? 'Close New Vehicles Menu' : 'Open New Vehicles Options'}
                      >
                        <i className={`fa-solid ${newVehicleDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'} sart-btn-dropdown-arrow`}></i>
                      </span>
                    </button>

                    {newVehicleDropdownOpen && (
                      <div className="sart-nav-dropdown-menu animate-fade-in" role="menu">
                        {/* 1. Find New [Category] (or all vehicles if 'All') */}
                        {cardekhoSelectedType === 'All' ? (
                          <div
                            className={`sart-dropdown-item has-submenu ${activeDropdownSubmenu === 'find_vehicle' ? 'submenu-active' : ''}`}
                            onMouseEnter={() => setActiveDropdownSubmenu('find_vehicle')}
                            onClick={(e) => {
                              // If user clicks the parent label directly without picking a sub-item:
                              e.stopPropagation();
                              setActiveDropdownSubmenu(activeDropdownSubmenu === 'find_vehicle' ? null : 'find_vehicle');
                            }}
                          >
                            <span className="sart-dropdown-item-label">Find New Vehicle</span>
                            <i className="fa-solid fa-chevron-right sart-submenu-caret"></i>

                            {/* Submenu: Many Vehicle Categories */}
                            {activeDropdownSubmenu === 'find_vehicle' && (
                              <div className="sart-dropdown-flyout animate-fade-in">
                                {[
                                  { id: 'Car', label: 'Cars & SUVs', icon: 'fa-car-side' },
                                  { id: 'Bike', label: 'Bikes & Scooters', icon: 'fa-motorcycle' },
                                  { id: 'Lorry', label: 'Commercial Trucks', icon: 'fa-truck-moving' },
                                  { id: 'Bus', label: 'Passenger Buses', icon: 'fa-bus-simple' },
                                  { id: 'Van', label: 'Delivery Vans & Omni', icon: 'fa-van-shuttle' },
                                  { id: 'Tractor', label: 'Agricultural Tractors', icon: 'fa-tractor' },
                                  { id: 'Auto', label: '3-Wheelers & Auto', icon: 'fa-truck-pickup' },
                                  { id: 'EV', label: '100% Electric Vehicles', icon: 'fa-bolt' },
                                ].map((sub) => (
                                  <div
                                    key={sub.id}
                                    className="sart-dropdown-subitem"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCarbike360PageMode('find_new');
                                      setCardekhoSelectedType(sub.id);
                                      setCardekhoViewMode('buy');
                                      setCardekhoVehicleCondition('new');
                                      setNewVehicleDropdownOpen(false);
                                      setActiveDropdownSubmenu(null);
                                      showToast(`Selected New ${sub.label}`);
                                    }}
                                  >
                                    <i className={`fa-solid ${sub.icon} subitem-icon`}></i>
                                    <span>{sub.label}</span>
                                  </div>
                                ))}
                                <div
                                  className="sart-dropdown-subitem highlight-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCarbike360PageMode('find_new');
                                    setCardekhoSelectedType('All');
                                    setCardekhoViewMode('buy');
                                    setCardekhoVehicleCondition('new');
                                    setNewVehicleDropdownOpen(false);
                                    setActiveDropdownSubmenu(null);
                                    showToast('Viewing All New Vehicles');
                                  }}
                                >
                                  <i className="fa-solid fa-layer-group subitem-icon"></i>
                                  <span>All Vehicle Categories</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* When category is specifically chosen (e.g. Car or Bike or Truck): Direct Find New */
                          <div
                            className="sart-dropdown-item"
                            onMouseEnter={() => setActiveDropdownSubmenu(null)}
                            onClick={() => {
                              setCarbike360PageMode('find_new');
                              setCardekhoViewMode('buy');
                              setCardekhoVehicleCondition('new');
                              setNewVehicleDropdownOpen(false);
                              showToast(`Opening Find New ${cardekhoSelectedType === 'Car' ? 'Cars & SUVs' : cardekhoSelectedType === 'Bike' ? 'Bikes & Scooters' : cardekhoSelectedType === 'Lorry' ? 'Commercial Trucks' : cardekhoSelectedType === 'Bus' ? 'Buses' : cardekhoSelectedType === 'Tractor' ? 'Tractors' : `${cardekhoSelectedType}s`}`);
                            }}
                          >
                            <span className="sart-dropdown-item-label">
                              Find New {cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes & Scooters' : cardekhoSelectedType === 'Lorry' ? 'Trucks' : cardekhoSelectedType === 'Bus' ? 'Buses' : cardekhoSelectedType === 'Tractor' ? 'Tractors' : cardekhoSelectedType === 'Auto' ? '3-Wheelers' : 'EVs'}
                            </span>
                          </div>
                        )}

                        {/* 2. Latest Models */}
                        <div
                          className="sart-dropdown-item"
                          onMouseEnter={() => setActiveDropdownSubmenu(null)}
                          onClick={() => {
                            setCarbike360PageMode('latest');
                            setCardekhoViewMode('buy');
                            setCardekhoVehicleCondition('new');
                            setVehicleShowcaseStatus('popular');
                            setNewVehicleDropdownOpen(false);
                            showToast(`Showing Latest ${cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : cardekhoSelectedType === 'All' ? 'Vehicles' : `${cardekhoSelectedType}s`} in India`);
                          }}
                        >
                          <span className="sart-dropdown-item-label">
                            Latest {cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : cardekhoSelectedType === 'All' ? 'Vehicles' : `${cardekhoSelectedType}s`}
                          </span>
                        </div>

                        {/* 3. Popular Brands */}
                        <div
                          className={`sart-dropdown-item has-submenu ${activeDropdownSubmenu === 'popular_brands' ? 'submenu-active' : ''}`}
                          onMouseEnter={() => setActiveDropdownSubmenu('popular_brands')}
                          onClick={() => {
                            setActiveDropdownSubmenu(activeDropdownSubmenu === 'popular_brands' ? null : 'popular_brands');
                          }}
                        >
                          <span className="sart-dropdown-item-label">
                            Popular {cardekhoSelectedType === 'Car' ? 'Car' : cardekhoSelectedType === 'Bike' ? 'Bike' : ''} Brands
                          </span>
                          <i className="fa-solid fa-chevron-right sart-submenu-caret"></i>

                          {/* Submenu: Brands for current category */}
                          {activeDropdownSubmenu === 'popular_brands' && (
                            <div className="sart-dropdown-flyout animate-fade-in">
                              {(cardekhoSelectedType === 'Car'
                                ? ['Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Toyota', 'Kia', 'All Brands']
                                : cardekhoSelectedType === 'Bike'
                                ? ['Royal Enfield', 'Hero MotoCorp', 'Honda 2Wheelers', 'Bajaj Auto', 'TVS Motor', 'Yamaha', 'All Brands']
                                : cardekhoSelectedType === 'Lorry'
                                ? ['Tata Motors', 'Ashok Leyland', 'Eicher Motors', 'BharatBenz', 'Mahindra Trucks', 'All Brands']
                                : cardekhoSelectedType === 'Bus'
                                ? ['Volvo Buses', 'Tata Motors', 'Ashok Leyland', 'Scania', 'All Brands']
                                : cardekhoSelectedType === 'Tractor'
                                ? ['Mahindra Tractors', 'Swaraj', 'John Deere', 'Sonalika', 'All Brands']
                                : cardekhoSelectedType === 'Auto'
                                ? ['Bajaj Auto', 'Piaggio Ape', 'Mahindra Alfa', 'TVS King', 'All Brands']
                                : ['Tata Motors', 'Hyundai', 'Maruti Suzuki', 'Mahindra', 'Royal Enfield', 'All Brands']
                              ).map((brand) => (
                                <div
                                  key={brand}
                                  className="sart-dropdown-subitem"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCarbike360PageMode('find_new');
                                    setCardekhoViewMode('buy');
                                    setCardekhoVehicleCondition('new');
                                    setCb360SelectedBrands(brand === 'All Brands' ? [] : [brand]);
                                    setCardekhoBrandFilter(brand);
                                    setNewVehicleDropdownOpen(false);
                                    setActiveDropdownSubmenu(null);
                                    showToast(brand === 'All Brands' ? 'Showing all brands' : `Filtered models from ${brand}`);
                                  }}
                                >
                                  <span>{brand}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 4. Upcoming Models */}
                        <div
                          className="sart-dropdown-item"
                          onMouseEnter={() => setActiveDropdownSubmenu(null)}
                          onClick={() => {
                            setCarbike360PageMode('upcoming');
                            setCardekhoViewMode('buy');
                            setCardekhoVehicleCondition('new');
                            setVehicleShowcaseStatus('upcoming');
                            setNewVehicleDropdownOpen(false);
                            showToast(`Showing Upcoming ${cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : cardekhoSelectedType === 'All' ? 'Vehicles' : `${cardekhoSelectedType}s`} 2026`);
                          }}
                        >
                          <span className="sart-dropdown-item-label">
                            Upcoming {cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : cardekhoSelectedType === 'All' ? 'Vehicles' : `${cardekhoSelectedType}s`}
                          </span>
                        </div>

                        {/* 5. Electric Models */}
                        <div
                          className="sart-dropdown-item"
                          onMouseEnter={() => setActiveDropdownSubmenu(null)}
                          onClick={() => {
                            setCarbike360PageMode('electric');
                            setCardekhoViewMode('buy');
                            setCardekhoVehicleCondition('new');
                            setVehicleShowcaseStatus('electric');
                            setNewVehicleDropdownOpen(false);
                            showToast(`Showing 100% Electric ${cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes & Scooters' : 'Vehicles'}`);
                          }}
                        >
                          <span className="sart-dropdown-item-label">
                            <span className="sart-ev-bolt-symbol">⚡</span> Electric {cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes & Scooters' : 'Vehicles'}
                          </span>
                        </div>

                        {/* 6. Compare Models */}
                        <div
                          className="sart-dropdown-item"
                          onMouseEnter={() => setActiveDropdownSubmenu(null)}
                          onClick={() => {
                            setActiveHubTab('compare_vehicles');
                            setNewVehicleDropdownOpen(false);
                            showToast(`Opening Compare ${cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : 'Vehicles'}`);
                          }}
                        >
                          <span className="sart-dropdown-item-label">
                            Compare {cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : 'Vehicles'}
                          </span>
                        </div>

                        {/* 7. Trending Models */}
                        <div
                          className="sart-dropdown-item"
                          onMouseEnter={() => setActiveDropdownSubmenu(null)}
                          onClick={() => {
                            setCarbike360PageMode('trending');
                            setCardekhoViewMode('buy');
                            setCardekhoVehicleCondition('new');
                            setNewVehicleDropdownOpen(false);
                            showToast(`Showing Trending ${cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : 'Vehicles'} in India`);
                          }}
                        >
                          <span className="sart-dropdown-item-label">
                            Trending {cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : 'Vehicles'}
                          </span>
                        </div>

                        {/* 8. Dealers */}
                        <div
                          className="sart-dropdown-item"
                          onMouseEnter={() => setActiveDropdownSubmenu(null)}
                          onClick={() => {
                            setCarbike360PageMode('dealerships');
                            setNewVehicleDropdownOpen(false);
                            showToast(`Showing Authorized ${cardekhoSelectedType === 'Car' ? 'Car' : cardekhoSelectedType === 'Bike' ? 'Bike' : ''} Showrooms near ${userLocationCity}`);
                          }}
                        >
                          <span className="sart-dropdown-item-label">Authorized Dealers</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. USED VEHICLE BUTTON WITH DROPDOWN (Image 2 Reference - "Sell My Car" Removed) */}
                  <div
                    className="sart-buysell-dropdown-wrap"
                    ref={usedVehicleDropdownRef}
                  >
                    <button
                      type="button"
                      className={`sart-buysell-btn ${cardekhoViewMode === 'buy' && cardekhoVehicleCondition === 'used' ? 'active' : ''} ${usedVehicleDropdownOpen ? 'menu-open' : ''}`}
                      onClick={() => {
                        setCardekhoViewMode('buy');
                        setCardekhoVehicleCondition('used');
                        setCardekhoNavCategory('used');
                        setCarbike360PageMode('portal_home');
                        setUsedVehicleDropdownOpen(false);
                        setNewVehicleDropdownOpen(false);
                        showToast('Viewing Certified Pre-Owned Vehicles');
                      }}
                    >
                      <i className="fa-solid fa-shield-halved"></i>
                      <span>Used Vehicle</span>
                      <span
                        className="sart-dropdown-arrow-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUsedVehicleDropdownOpen((prev) => !prev);
                          setNewVehicleDropdownOpen(false);
                        }}
                        title={usedVehicleDropdownOpen ? 'Close Used Vehicles Menu' : 'Open Used Vehicles Options'}
                      >
                        <i className={`fa-solid ${usedVehicleDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'} sart-btn-dropdown-arrow`}></i>
                      </span>
                    </button>

                    {usedVehicleDropdownOpen && (
                      <div className="sart-nav-dropdown-menu used-cars-menu animate-fade-in" role="menu">
                        {/* Dynamic category label helper */}
                        {(() => {
                          const vehLabel =
                            cardekhoSelectedType === 'Car' ? 'Cars & SUVs' :
                            cardekhoSelectedType === 'Bike' ? 'Bikes & Scooters' :
                            cardekhoSelectedType === 'Van' ? 'Commercial Vans' :
                            cardekhoSelectedType === 'Bus' ? 'Buses' :
                            cardekhoSelectedType === 'Lorry' ? 'Commercial Trucks' :
                            cardekhoSelectedType === 'Tractor' ? 'Agricultural Tractors' :
                            cardekhoSelectedType === 'Auto' ? '3-Wheelers & Autos' :
                            cardekhoSelectedType === 'EV' ? 'Electric Vehicles (EV)' : 'Used Vehicles';

                          return (
                            <>
                              {/* If 'All' is selected, offer quick category selection */}
                              {cardekhoSelectedType === 'All' ? (
                                <div
                                  className={`sart-dropdown-item has-submenu ${activeDropdownSubmenu === 'used_category' ? 'submenu-active' : ''}`}
                                  onMouseEnter={() => setActiveDropdownSubmenu('used_category')}
                                  onClick={() => {
                                    setActiveDropdownSubmenu(activeDropdownSubmenu === 'used_category' ? null : 'used_category');
                                  }}
                                >
                                  <span className="sart-dropdown-item-label">Buy Used Vehicles by Type</span>
                                  <i className="fa-solid fa-chevron-right sart-submenu-caret"></i>

                                  {activeDropdownSubmenu === 'used_category' && (
                                    <div className="sart-dropdown-flyout animate-fade-in">
                                      {[
                                        { id: 'Car', label: 'Cars & SUVs', icon: 'fa-car-side' },
                                        { id: 'Bike', label: 'Bikes & Scooters', icon: 'fa-motorcycle' },
                                        { id: 'Van', label: 'Commercial Vans', icon: 'fa-van-shuttle' },
                                        { id: 'Bus', label: 'Passenger Buses', icon: 'fa-bus-simple' },
                                        { id: 'Lorry', label: 'Commercial Trucks', icon: 'fa-truck-moving' },
                                        { id: 'Tractor', label: 'Agricultural Tractors', icon: 'fa-tractor' },
                                        { id: 'Auto', label: '3-Wheelers & Auto', icon: 'fa-taxi' },
                                        { id: 'EV', label: 'Electric Vehicles (EV)', icon: 'fa-bolt' },
                                      ].map((sub) => (
                                        <div
                                          key={sub.id}
                                          className="sart-dropdown-subitem"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setCardekhoSelectedType(sub.id);
                                            setCarbike360PageMode('used_catalog');
                                            setCardekhoViewMode('buy');
                                            setCardekhoVehicleCondition('used');
                                            setCardekhoNavCategory('used');
                                            setUsedVehicleDropdownOpen(false);
                                            setActiveDropdownSubmenu(null);
                                            showToast(`Showing Certified Used ${sub.label}`);
                                          }}
                                        >
                                          <i className={`fa-solid ${sub.icon} subitem-icon`}></i>
                                          <span>{sub.label}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                /* 1. Buy Used [Category] */
                                <div
                                  className="sart-dropdown-item"
                                  onMouseEnter={() => setActiveDropdownSubmenu(null)}
                                  onClick={() => {
                                    setCarbike360PageMode('used_catalog');
                                    setCardekhoViewMode('buy');
                                    setCardekhoVehicleCondition('used');
                                    setCardekhoNavCategory('used');
                                    setUsedVehicleDropdownOpen(false);
                                    showToast(`Browsing Certified Used ${vehLabel}`);
                                  }}
                                >
                                  <span className="sart-dropdown-item-label">Buy Used {vehLabel}</span>
                                </div>
                              )}

                              {/* 2. Used [Category] In Your City */}
                              <div
                                className={`sart-dropdown-item has-submenu ${activeDropdownSubmenu === 'used_city' ? 'submenu-active' : ''}`}
                                onMouseEnter={() => setActiveDropdownSubmenu('used_city')}
                                onClick={() => {
                                  setActiveDropdownSubmenu(activeDropdownSubmenu === 'used_city' ? null : 'used_city');
                                }}
                              >
                                <span className="sart-dropdown-item-label">Used {vehLabel} In Your City</span>
                                <i className="fa-solid fa-chevron-right sart-submenu-caret"></i>

                                {/* Submenu: Cities */}
                                {activeDropdownSubmenu === 'used_city' && (
                                  <div className="sart-dropdown-flyout animate-fade-in">
                                    {['Chennai', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Coimbatore', 'Pune', 'All Cities'].map((city) => (
                                      <div
                                        key={city}
                                        className="sart-dropdown-subitem"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCarbike360PageMode('used_catalog');
                                          setCardekhoViewMode('buy');
                                          setCardekhoVehicleCondition('used');
                                          setCardekhoCityFilter(city);
                                          if (city !== 'All Cities') setUserLocationCity(city);
                                          setUsedVehicleDropdownOpen(false);
                                          setActiveDropdownSubmenu(null);
                                          showToast(`Showing certified used ${vehLabel} in ${city}`);
                                        }}
                                      >
                                        <i className="fa-solid fa-location-dot subitem-icon icon-city"></i>
                                        <span>{city}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* 3. Used [Category] Valuation */}
                              <div
                                className="sart-dropdown-item"
                                onMouseEnter={() => setActiveDropdownSubmenu(null)}
                                onClick={() => {
                                  setCardekhoViewMode('sell');
                                  setUsedVehicleDropdownOpen(false);
                                  showToast(`Used ${vehLabel} Valuation: Calculate fair market resale price`);
                                }}
                              >
                                <span className="sart-dropdown-item-label">Used {vehLabel} Valuation</span>
                              </div>

                              {/* 4. Dealership Near Me */}
                              <div
                                className="sart-dropdown-item"
                                onMouseEnter={() => setActiveDropdownSubmenu(null)}
                                onClick={() => {
                                  setCarbike360PageMode('dealerships');
                                  setUsedVehicleDropdownOpen(false);
                                  showToast(`Showing Certified ${vehLabel} Dealerships near ${userLocationCity}`);
                                }}
                              >
                                <span className="sart-dropdown-item-label">Dealership Near Me</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* 3. SELL VEHICLE BUTTON */}
                  <button
                    type="button"
                    className={`sart-buysell-btn sell ${cardekhoViewMode === 'sell' ? 'active' : ''}`}
                    onClick={() => {
                      setCardekhoViewMode('sell');
                      setNewVehicleDropdownOpen(false);
                      setUsedVehicleDropdownOpen(false);
                      showToast('Opened Sell Your Vehicle • Instant Valuation');
                    }}
                  >
                    <i className="fa-solid fa-indian-rupee-sign"></i>
                    <span>Sell Vehicle</span>
                  </button>
                </div>
              </div>

              {/* If Sell Mode is Active inside container */}
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
                          <option value="Lorry">Lorry / Heavy Truck (TruckDekho)</option>
                          <option value="Bus">Bus / Tourist Coach (BusDekho)</option>
                          <option value="Tractor">Tractor / Farm Equipment (TractorGuru)</option>
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
              ) : carbike360PageMode === 'portal_home' ? (
                /* HORIZONTAL VEHICLE FINDER FORM INSIDE CONTAINER */
                <div className="carandbike-finder-bar-card">
                  {/* Top line with title and active condition badge */}
                  <div className="cb-finder-title-row">
                    <div className="cb-title-wrap">
                      <span className="cb-flair-badge"><i className="fa-solid fa-compass"></i> SART ALL-VEHICLE SEARCH</span>
                      <h2 className="cb-main-heading">
                        {cardekhoVehicleCondition === 'new'
                          ? (cardekhoSelectedType === 'All' ? 'Search New Vehicles' :
                             cardekhoSelectedType === 'Car' ? 'Search New Cars & SUVs' :
                             cardekhoSelectedType === 'Bike' ? 'Search New Bikes & Scooters' :
                             cardekhoSelectedType === 'Van' ? 'Search New Commercial Vans' :
                             cardekhoSelectedType === 'Bus' ? 'Search New Passenger Buses' :
                             cardekhoSelectedType === 'Lorry' ? 'Search New Commercial Trucks' :
                             cardekhoSelectedType === 'Tractor' ? 'Search New Agri Tractors' :
                             cardekhoSelectedType === 'Auto' ? 'Search New 3-Wheelers & Autos' : 'Search New Electric Vehicles (EV)')
                          : (cardekhoSelectedType === 'All' ? 'Search Certified Pre-Owned Vehicles' :
                             cardekhoSelectedType === 'Car' ? 'Search Certified Pre-Owned Cars & SUVs' :
                             cardekhoSelectedType === 'Bike' ? 'Search Certified Pre-Owned Bikes & Scooters' :
                             cardekhoSelectedType === 'Van' ? 'Search Certified Pre-Owned Commercial Vans' :
                             cardekhoSelectedType === 'Bus' ? 'Search Certified Pre-Owned Passenger Buses' :
                             cardekhoSelectedType === 'Lorry' ? 'Search Certified Pre-Owned Commercial Trucks' :
                             cardekhoSelectedType === 'Tractor' ? 'Search Certified Pre-Owned Agri Tractors' :
                             cardekhoSelectedType === 'Auto' ? 'Search Certified Pre-Owned 3-Wheelers & Autos' : 'Search Certified Pre-Owned Electric Vehicles')}
                      </h2>
                    </div>

                    <div className="cb-top-stats-pill">
                      <span>{VEHICLE_SHOWCASE_DATA.filter(v => (cardekhoSelectedType === 'All' || v.type === cardekhoSelectedType || (cardekhoSelectedType === 'EV' && (v.status === 'electric' || v.fuel.toLowerCase().includes('ev') || v.fuel.toLowerCase().includes('electric')))) && (cardekhoVehicleCondition === 'new' ? v.status !== 'used' : v.status === 'used')).length} Vehicles Available</span>
                    </div>
                  </div>

                  {/* Horizontal Inputs Bar tailored dynamically to New vs Used Vehicle */}
                  <div className="cb-horizontal-inputs-bar">
                    {/* 1. NEW VEHICLE FLOW */}
                    {cardekhoVehicleCondition === 'new' && (
                      <>
                        {/* Step 1: Choose Your Vehicle Category */}
                        <div className="cb-field-box">
                          <label className="cb-field-label">
                            <i className="fa-solid fa-truck-monster"></i> 1. Choose Vehicle
                          </label>
                          <div className="cb-select-wrap">
                            <select
                              value={cardekhoSelectedType}
                              onChange={(e) => {
                                const newType = e.target.value;
                                setCardekhoSelectedType(newType);
                                setCardekhoBrandFilter('All Brands');
                                setCardekhoModelFilter('All Models');
                                setCardekhoBodyTypeFilter('All');
                                showToast(`Selected: ${e.target.options[e.target.selectedIndex].text}`);
                              }}
                            >
                              <option value="All">All Categories</option>
                              <option value="Bike">🏍️ Bike &amp; Scooter</option>
                              <option value="Car">🚗 Car &amp; SUV</option>
                              <option value="Van">🚐 Van &amp; Commercial MUV</option>
                              <option value="Bus">🚌 Passenger Bus</option>
                              <option value="Lorry">🚛 Truck &amp; Heavy Lorry</option>
                              <option value="Tractor">🚜 Agriculture &amp; Tractor</option>
                              <option value="Auto">🛺 3-Wheeler Auto</option>
                              <option value="EV">⚡ 100% Electric (EV)</option>
                            </select>
                            <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                          </div>
                        </div>

                        {/* Step 2: Choose Filter Mode: By Budget OR By Brand */}
                        <div className="cb-field-box">
                          <label className="cb-field-label">
                            <i className="fa-solid fa-sliders"></i> 2. Search Mode
                          </label>
                          <div className="cb-select-wrap">
                            <select
                              value={cardekhoSearchBy}
                              onChange={(e) => {
                                setCardekhoSearchBy(e.target.value as 'budget' | 'brand');
                                setCardekhoModelFilter('All Models');
                              }}
                            >
                              <option value="budget">💰 By Budget</option>
                              <option value="brand">🏷️ By Brand &amp; Model</option>
                            </select>
                            <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                          </div>
                        </div>

                        {/* If 'By Budget': Budget Price 0-2 Lakh etc. + Type of Vehicle (Body Type) */}
                        {cardekhoSearchBy === 'budget' ? (
                          <>
                            <div className="cb-field-box">
                              <label className="cb-field-label">
                                <i className="fa-solid fa-indian-rupee-sign"></i> Budget Price
                              </label>
                              <div className="cb-select-wrap">
                                <select
                                  value={cardekhoBudgetFilter}
                                  onChange={(e) => setCardekhoBudgetFilter(e.target.value)}
                                >
                                  <option value="All Budgets">All Price Ranges</option>
                                  <option value="Under 2 Lakh">0 - 2 Lakh</option>
                                  <option value="2 - 5 Lakh">2 - 5 Lakh</option>
                                  <option value="5 - 10 Lakh">5 - 10 Lakh</option>
                                  <option value="10 - 20 Lakh">10 - 20 Lakh</option>
                                  <option value="20 - 50 Lakh">20 - 50 Lakh</option>
                                  <option value="Above 50 Lakh">Above 50 Lakh</option>
                                </select>
                                <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                              </div>
                            </div>

                            <div className="cb-field-box">
                              <label className="cb-field-label">
                                <i className="fa-solid fa-shapes"></i> Type of Vehicle
                              </label>
                              <div className="cb-select-wrap">
                                <select
                                  value={cardekhoBodyTypeFilter}
                                  onChange={(e) => setCardekhoBodyTypeFilter(e.target.value)}
                                >
                                  <option value="All">All Types</option>
                                  {cardekhoSelectedType === 'Bike' && (
                                    <>
                                      <option value="Scooter">Scooter / Moped</option>
                                      <option value="Bike">Commuter Motorcycle</option>
                                      <option value="Cruiser">Cruiser (Meteor / Bullet)</option>
                                      <option value="Sports">Sports / Naked Bike (Duke / R15)</option>
                                      <option value="Adventure">Adventure Tourer (Himalayan / 390)</option>
                                      <option value="Electric">Electric Scooter (EV)</option>
                                    </>
                                  )}
                                  {cardekhoSelectedType === 'Car' && (
                                    <>
                                      <option value="Hatchback">Hatchback (Swift / Baleno)</option>
                                      <option value="Sedan">Sedan (Dzire / City / Verna)</option>
                                      <option value="SUV">Compact SUV (Nexon / Brezza)</option>
                                      <option value="SUV">Mid-Size / Full SUV (Creta / Scorpio / Thar)</option>
                                      <option value="MPV">MPV / 7-Seater (Ertiga / Innova)</option>
                                      <option value="Electric">Electric SUV (EV)</option>
                                    </>
                                  )}
                                  {cardekhoSelectedType === 'Van' && (
                                    <>
                                      <option value="Passenger">Passenger Van (Eeco / Winger)</option>
                                      <option value="Cargo">Cargo Delivery Van</option>
                                      <option value="Luxury">Luxury Tourer (Urbania / Traveller)</option>
                                    </>
                                  )}
                                  {cardekhoSelectedType === 'Bus' && (
                                    <>
                                      <option value="Intercity">Intercity Luxury Coach</option>
                                      <option value="City">City Transit Bus</option>
                                      <option value="School">School / Staff Bus</option>
                                      <option value="Electric">Electric City Bus</option>
                                    </>
                                  )}
                                  {cardekhoSelectedType === 'Lorry' && (
                                    <>
                                      <option value="Light">Small / Light Commercial (SCV / Dost)</option>
                                      <option value="Tipper">Tipper / Construction Mining</option>
                                      <option value="Haulage">Heavy Long-Haul Truck (Signa / Blazo)</option>
                                      <option value="Trailer">Tractor Trailer / Multi-Axle</option>
                                    </>
                                  )}
                                  {cardekhoSelectedType === 'Tractor' && (
                                    <>
                                      <option value="2WD">2WD Agricultural Tractor</option>
                                      <option value="4WD">4WD Heavy Duty Tractor</option>
                                      <option value="Mini">Mini / Orchard Tractor</option>
                                      <option value="Harvester">Combine Harvester Equipment</option>
                                    </>
                                  )}
                                  {cardekhoSelectedType === 'Auto' && (
                                    <>
                                      <option value="Passenger">Passenger Auto (3-Seater)</option>
                                      <option value="Cargo">Cargo Load Auto (Ape / Maxima)</option>
                                      <option value="Electric">Electric Auto (EV)</option>
                                    </>
                                  )}
                                  {cardekhoSelectedType === 'EV' && (
                                    <>
                                      <option value="SUV">Electric SUV / Car</option>
                                      <option value="Scooter">Electric Scooter / 2W</option>
                                      <option value="Auto">Electric Auto (3W)</option>
                                      <option value="Bus">Electric Passenger Bus</option>
                                    </>
                                  )}
                                  {cardekhoSelectedType === 'All' && (
                                    <>
                                      <option value="Hatchback">Hatchback</option>
                                      <option value="Sedan">Sedan</option>
                                      <option value="SUV">SUV</option>
                                      <option value="Scooter">Scooter</option>
                                      <option value="Bike">Motorcycle</option>
                                      <option value="Truck">Commercial Truck</option>
                                      <option value="Bus">Bus</option>
                                      <option value="Tractor">Tractor</option>
                                    </>
                                  )}
                                </select>
                                <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                              </div>
                            </div>
                          </>
                        ) : (
                          /* If 'By Brand': Maker + Model */
                          <>
                            <div className="cb-field-box">
                              <label className="cb-field-label">
                                <i className="fa-solid fa-building"></i> Maker / Brand
                              </label>
                              <div className="cb-select-wrap">
                                <select
                                  value={cardekhoBrandFilter}
                                  onChange={(e) => {
                                    setCardekhoBrandFilter(e.target.value);
                                    setCardekhoModelFilter('All Models');
                                  }}
                                >
                                  <option value="All Brands">All Brands</option>
                                  {(cardekhoSelectedType === 'All'
                                    ? [
                                      'Tata Motors', 'Hyundai', 'Mahindra', 'Maruti Suzuki', 'Toyota',
                                      'Royal Enfield', 'Hero MotoCorp', 'Honda 2Wheelers', 'Bajaj Auto',
                                      'TVS Motor', 'Yamaha', 'KTM', 'Ashok Leyland', 'Volvo Buses',
                                      'Force Motors', 'Ather Energy', 'Ola Electric', 'Swaraj', 'John Deere', 'Sonalika'
                                    ]
                                    : (BRANDS_BY_VEHICLE[cardekhoSelectedType] || ['Tata Motors', 'Mahindra', 'Hyundai'])
                                  ).map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                  ))}
                                </select>
                                <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                              </div>
                            </div>

                            <div className="cb-field-box">
                              <label className="cb-field-label">
                                <i className="fa-solid fa-car-side"></i> Model
                              </label>
                              <div className="cb-select-wrap">
                                <select
                                  value={cardekhoModelFilter}
                                  onChange={(e) => setCardekhoModelFilter(e.target.value)}
                                >
                                  <option value="All Models">All Models</option>
                                  {(MODELS_BY_BRAND[cardekhoBrandFilter] || [
                                    'Swift', 'Creta', 'Nexon', 'Scorpio-N', 'Classic 350', 'Activa 6G / 125', 'Splendor Plus',
                                    'Pulsar 150', '575 DI XP Plus', 'Swaraj 744 FE', 'Signa 2823.K', 'Traveller 3050'
                                  ]).map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                  ))}
                                </select>
                                <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* 2. USED VEHICLE FLOW */}
                    {cardekhoVehicleCondition === 'used' && (
                      <>
                        {/* Step 1: Choose Your Vehicle Category */}
                        <div className="cb-field-box">
                          <label className="cb-field-label">
                            <i className="fa-solid fa-truck-monster"></i> 1. Choose Vehicle
                          </label>
                          <div className="cb-select-wrap">
                            <select
                              value={cardekhoSelectedType}
                              onChange={(e) => {
                                const newType = e.target.value;
                                setCardekhoSelectedType(newType);
                                setCardekhoBrandFilter('All Brands');
                                setCardekhoModelFilter('All Models');
                                setCardekhoBodyTypeFilter('All');
                                showToast(`Selected: ${e.target.options[e.target.selectedIndex].text}`);
                              }}
                            >
                              <option value="All">All Categories</option>
                              <option value="Car">🚗 Cars &amp; SUVs</option>
                              <option value="Bike">🏍️ Bikes &amp; Scooters</option>
                              <option value="Lorry">🚛 Commercial Trucks</option>
                              <option value="Bus">🚌 Passenger Buses</option>
                              <option value="Van">🚐 Commercial Vans</option>
                              <option value="Tractor">🚜 Agri Tractors</option>
                              <option value="Auto">🛺 3-Wheelers &amp; Auto</option>
                              <option value="EV">⚡ Electric Vehicles (EV)</option>
                            </select>
                            <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                          </div>
                        </div>

                        {/* Search Mode: By Budget OR By Brand & Model */}
                        <div className="cb-field-box">
                          <label className="cb-field-label">
                            <i className="fa-solid fa-sliders"></i> Filter By
                          </label>
                          <div className="cb-select-wrap">
                            <select
                              value={cardekhoSearchBy}
                              onChange={(e) => {
                                setCardekhoSearchBy(e.target.value as 'budget' | 'brand');
                                setCardekhoModelFilter('All Models');
                              }}
                            >
                              <option value="budget">💰 By Budget</option>
                              <option value="brand">🏷️ By Brand &amp; Model</option>
                            </select>
                            <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                          </div>
                        </div>

                        {cardekhoSearchBy === 'budget' ? (
                          <div className="cb-field-box">
                            <label className="cb-field-label">
                              <i className="fa-solid fa-indian-rupee-sign"></i> Budget Price
                            </label>
                            <div className="cb-select-wrap">
                              <select
                                value={cardekhoBudgetFilter}
                                onChange={(e) => setCardekhoBudgetFilter(e.target.value)}
                              >
                                <option value="All Budgets">All Price Ranges</option>
                                <option value="Under 2 Lakh">0 - 2 Lakh</option>
                                <option value="2 - 5 Lakh">2 - 5 Lakh</option>
                                <option value="5 - 10 Lakh">5 - 10 Lakh</option>
                                <option value="10 - 20 Lakh">10 - 20 Lakh</option>
                                <option value="20 - 50 Lakh">20 - 50 Lakh</option>
                                <option value="Above 50 Lakh">Above 50 Lakh</option>
                              </select>
                              <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="cb-field-box">
                              <label className="cb-field-label">
                                <i className="fa-solid fa-building"></i> Brand
                              </label>
                              <div className="cb-select-wrap">
                                <select
                                  value={cardekhoBrandFilter}
                                  onChange={(e) => {
                                    setCardekhoBrandFilter(e.target.value);
                                    setCardekhoModelFilter('All Models');
                                  }}
                                >
                                  <option value="All Brands">All Brands</option>
                                  {(cardekhoSelectedType === 'All'
                                    ? [
                                      'Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Toyota', 'Honda',
                                      'Royal Enfield', 'Hero MotoCorp', 'Honda 2Wheelers', 'Bajaj Auto', 'TVS Motor',
                                      'Yamaha', 'KTM', 'Bajaj Auto (RE)', 'Maruti Suzuki (Eeco/Omni)', 'Eicher Motors', 'Sonalika'
                                    ]
                                    : (BRANDS_BY_VEHICLE[cardekhoSelectedType] || ['Tata Motors', 'Mahindra', 'Hyundai'])
                                  ).map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                  ))}
                                </select>
                                <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                              </div>
                            </div>

                            <div className="cb-field-box">
                              <label className="cb-field-label">
                                <i className="fa-solid fa-car-side"></i> Model
                              </label>
                              <div className="cb-select-wrap">
                                <select
                                  value={cardekhoModelFilter}
                                  onChange={(e) => setCardekhoModelFilter(e.target.value)}
                                >
                                  <option value="All Models">All Models</option>
                                  {(MODELS_BY_BRAND[cardekhoBrandFilter] || [
                                    'Swift', 'Creta', 'Venue', 'Nexon', 'Punch', 'Thar / Thar Roxx',
                                    'Meteor 350', 'MT-15 V2', 'Activa 6G / 125', 'Apache RTR 160 4V', 'Eeco 7-Seater AC'
                                  ]).map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                  ))}
                                </select>
                                <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Cities Dropdown */}
                        <div className="cb-field-box">
                          <label className="cb-field-label">
                            <i className="fa-solid fa-location-dot"></i> Select City
                          </label>
                          <div className="cb-select-wrap">
                            <select
                              value={cardekhoCityFilter}
                              onChange={(e) => setCardekhoCityFilter(e.target.value)}
                            >
                              <option value="All Cities">All Cities</option>
                              <option value="Chennai">Chennai</option>
                              <option value="Bengaluru">Bengaluru</option>
                              <option value="Mumbai">Mumbai</option>
                              <option value="Delhi NCR">Delhi NCR</option>
                              <option value="Hyderabad">Hyderabad</option>
                              <option value="Coimbatore">Coimbatore / Erode</option>
                              <option value="Pune">Pune</option>
                            </select>
                            <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Search Action Button */}
                    <div className="cb-btn-box">
                      <button
                        type="button"
                        className="btn-carandbike-search-yellow"
                        onClick={() => {
                          showToast(`Search applied: ${cardekhoVehicleCondition === 'new' ? 'New Vehicles' : 'Used Vehicles'} • ${cardekhoSearchBy === 'budget' ? cardekhoBudgetFilter : `${cardekhoBrandFilter} ${cardekhoModelFilter}`}`);
                        }}
                      >
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <span>Search</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Sleek Status Bar when on a dedicated CarBike360 page */
                <div className="cb360-quick-status-bar animate-fade-in">
                  <div className="cb360-quick-status-left">
                    <span className="cb360-active-mode-badge">
                      <i className="fa-solid fa-layer-group"></i>
                      {carbike360PageMode === 'find_new' ? 'CarBike360 • New Cars in India' :
                       carbike360PageMode === 'latest' ? 'CarBike360 • Latest Cars in India' :
                       carbike360PageMode === 'upcoming' ? 'CarBike360 • Upcoming Cars 2026' :
                       carbike360PageMode === 'electric' ? 'CarBike360 • 100% Electric Vehicles' :
                       carbike360PageMode === 'trending' ? 'CarBike360 • Trending Cars' :
                       carbike360PageMode === 'used_catalog' ? 'CarBike360 • Certified Pre-Owned' : 'CarBike360 • Dealerships'}
                    </span>
                    <span className="cb360-active-city-note">
                      <i className="fa-solid fa-location-dot"></i> City: <strong>{userLocationCity}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="cb360-top-return-portal-btn"
                    onClick={() => {
                      setCarbike360PageMode('portal_home');
                      showToast('Returned to Portal Overview & Multi-Vehicle Finder');
                    }}
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Back to Portal Overview</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. FULL-PAGE CARDS GRID: Strictly matches selected vehicle type, brand, model, city, and body type without unrelated cards */}
            {cardekhoViewMode !== 'sell' && (
              <>
                {/* A. CARBIKE360 DEDICATED VIEWS BASED ON DROPDOWN CLICK */}
                {carbike360PageMode === 'find_new' && (
                  <Carbike360FindNewView
                    cardekhoSelectedType={cardekhoSelectedType}
                    setCardekhoSelectedType={setCardekhoSelectedType}
                    cb360PriceRange={cb360PriceRange}
                    setCb360PriceRange={setCb360PriceRange}
                    cb360SelectedBrands={cb360SelectedBrands}
                    setCb360SelectedBrands={setCb360SelectedBrands}
                    cb360SelectedBodyTypes={cb360SelectedBodyTypes}
                    setCb360SelectedBodyTypes={setCb360SelectedBodyTypes}
                    cb360SelectedFuels={cb360SelectedFuels}
                    setCb360SelectedFuels={setCb360SelectedFuels}
                    cb360SelectedTransmissions={cb360SelectedTransmissions}
                    setCb360SelectedTransmissions={setCb360SelectedTransmissions}
                    cb360SelectedSeating={cb360SelectedSeating}
                    setCb360SelectedSeating={setCb360SelectedSeating}
                    cb360SortBy={cb360SortBy}
                    setCb360SortBy={setCb360SortBy}
                    userLocationCity={userLocationCity}
                    onSelectOnRoadPrice={(v) => setOnRoadPriceModalVehicle(v)}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                  />
                )}

                {carbike360PageMode === 'latest' && (
                  <Carbike360LatestView
                    userLocationCity={userLocationCity}
                    onSelectOnRoadPrice={(v) => setOnRoadPriceModalVehicle(v)}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                    onSelectBrand={(brand) => {
                      setCarbike360PageMode('find_new');
                      setCb360SelectedBrands([brand]);
                      showToast(`Filtered for ${brand} cars`);
                    }}
                  />
                )}

                {carbike360PageMode === 'upcoming' && (
                  <Carbike360UpcomingView
                    userLocationCity={userLocationCity}
                    cb360UpcomingBrand={cb360UpcomingBrand}
                    setCb360UpcomingBrand={setCb360UpcomingBrand}
                    cb360UpcomingBodyType={cb360UpcomingBodyType}
                    setCb360UpcomingBodyType={setCb360UpcomingBodyType}
                    cb360UpcomingBudget={cb360UpcomingBudget}
                    setCb360UpcomingBudget={setCb360UpcomingBudget}
                    cb360FaqOpenIndex={cb360FaqOpenIndex}
                    setCb360FaqOpenIndex={setCb360FaqOpenIndex}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                  />
                )}

                {carbike360PageMode === 'electric' && (
                  <Carbike360ElectricView
                    userLocationCity={userLocationCity}
                    onSelectOnRoadPrice={(v) => setOnRoadPriceModalVehicle(v)}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                  />
                )}

                {carbike360PageMode === 'trending' && (
                  <Carbike360TrendingView
                    userLocationCity={userLocationCity}
                    onSelectOnRoadPrice={(v) => setOnRoadPriceModalVehicle(v)}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                  />
                )}

                {carbike360PageMode === 'used_catalog' && (
                  <Carbike360UsedCatalogView
                    cardekhoSelectedType={cardekhoSelectedType}
                    setCardekhoSelectedType={setCardekhoSelectedType}
                    userLocationCity={userLocationCity}
                    setUserLocationCity={setUserLocationCity}
                    cardekhoCityFilter={cardekhoCityFilter}
                    setCardekhoCityFilter={setCardekhoCityFilter}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                  />
                )}

                {carbike360PageMode === 'dealerships' && (
                  <Carbike360DealershipsView
                    userLocationCity={userLocationCity}
                    setUserLocationCity={setUserLocationCity}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                  />
                )}

                {/* B. DEFAULT PORTAL OVERVIEW (When carbike360PageMode === 'portal_home') */}
                {carbike360PageMode === 'portal_home' && (
                  <div className="cardekho-content-sections-wrap">

                {/* HELPER FILTER FUNCTION TO FILTER OUT UNRELATED CONTENT */}
                {(() => {
                  const matchesFilter = (v: any) => {
                    // In New Vehicle mode: filter out used vehicles if user is in 'new' mode
                    if (cardekhoVehicleCondition === 'new' && v.status === 'used') return false;
                    // In Used Vehicle mode: only show used vehicles
                    if (cardekhoVehicleCondition === 'used' && v.status !== 'used') return false;

                    // 1. Vehicle Type Filter (for both New and Used Vehicle modes)
                    if (cardekhoSelectedType !== 'All') {
                      if (cardekhoSelectedType === 'EV') {
                        const isEV = v.status === 'electric' || v.type === 'EV' || v.fuel.toLowerCase().includes('electric') || v.fuel.toLowerCase().includes('ev');
                        if (!isEV) return false;
                      } else if (v.type !== cardekhoSelectedType) {
                        return false;
                      }
                    }

                    // 2. Brand Filter
                    if (cardekhoSearchBy === 'brand' && cardekhoBrandFilter !== 'All Brands') {
                      const brandPrefix = cardekhoBrandFilter.toLowerCase().split(' ')[0];
                      if (!v.brand.toLowerCase().includes(brandPrefix) && !v.name.toLowerCase().includes(brandPrefix)) {
                        return false;
                      }
                    }

                    // 3. Model Filter
                    if (cardekhoSearchBy === 'brand' && cardekhoModelFilter !== 'All Models') {
                      const modelTerms = cardekhoModelFilter.toLowerCase().split(/[\s(/)]+/).filter(Boolean);
                      const targetName = v.name.toLowerCase();
                      const hasTerm = modelTerms.some((t: string) => t.length > 2 && targetName.includes(t));
                      if (!hasTerm && !targetName.includes(cardekhoModelFilter.toLowerCase())) {
                        return false;
                      }
                    }

                    // 4. Body Type / Fuel / Vehicle Sub-type Filter (for New Vehicle mode By Budget)
                    if (cardekhoVehicleCondition === 'new' && cardekhoSearchBy === 'budget' && cardekhoBodyTypeFilter !== 'All') {
                      const bt = cardekhoBodyTypeFilter.toLowerCase();
                      const blob = `${v.name} ${v.fuel} ${v.type} ${(v.seating || '')} ${(v.features || []).join(' ')}`.toLowerCase();
                      if (!blob.includes(bt)) {
                        return false;
                      }
                    }

                    // 5. Budget Range Filter
                    if (cardekhoSearchBy === 'budget' && cardekhoBudgetFilter !== 'All Budgets') {
                      const p = v.priceRaw || 0;
                      if (cardekhoBudgetFilter.includes('Under 2 Lakh') && p > 2) return false;
                      if (cardekhoBudgetFilter.includes('2 - 5 Lakh') && (p < 2 || p > 5)) return false;
                      if (cardekhoBudgetFilter.includes('5 - 10 Lakh') && (p < 5 || p > 10)) return false;
                      if (cardekhoBudgetFilter.includes('10 - 20 Lakh') && (p < 10 || p > 20)) return false;
                      if (cardekhoBudgetFilter.includes('20 - 50 Lakh') && (p < 20 || p > 50)) return false;
                      if (cardekhoBudgetFilter.includes('Above 50 Lakh') && p < 50) return false;
                    }

                    // 6. City Filter (for Used Vehicle mode)
                    if (cardekhoVehicleCondition === 'used' && cardekhoCityFilter !== 'All Cities') {
                      const vCity = (v.location || '').toLowerCase();
                      const targetCity = cardekhoCityFilter.toLowerCase().split(' ')[0];
                      if (!vCity.includes(targetCity)) {
                        return false;
                      }
                    }

                    // 7. Top Search Bar Query (Search cars, bikes, scooters...)
                    if (topVehicleSearch.trim()) {
                      const query = topVehicleSearch.toLowerCase().trim();
                      const searchBlob = `${v.name} ${v.brand} ${v.type} ${v.fuel} ${(v.features || []).join(' ')} ${(v.seating || '')} ${(v.location || '')}`.toLowerCase();
                      if (!searchBlob.includes(query)) {
                        return false;
                      }
                    }

                    return true;
                  };

                  const popularVehicles = VEHICLE_SHOWCASE_DATA.filter(v => v.status === 'popular' && matchesFilter(v));
                  const electricVehicles = VEHICLE_SHOWCASE_DATA.filter(v => (v.status === 'electric' || v.fuel.toLowerCase().includes('electric') || v.fuel.toLowerCase().includes('ev')) && matchesFilter(v));
                  const upcomingVehicles = VEHICLE_SHOWCASE_DATA.filter(v => v.status === 'upcoming' && matchesFilter(v));
                  const usedVehicles = VEHICLE_SHOWCASE_DATA.filter(v => v.status === 'used' && matchesFilter(v));

                  const isDefaultPortalView = cardekhoVehicleCondition === 'new' &&
                    cardekhoBrandFilter === 'All Brands' &&
                    cardekhoBudgetFilter === 'All Budgets' &&
                    cardekhoBodyTypeFilter === 'All' &&
                    !topVehicleSearch.trim();

                  return (
                    <>
                      {/* ============================================================== */}
                      {/* CASE A: DEFAULT PORTAL SHOWCASE (User Reference Image Layout)   */}
                      {/* ============================================================== */}
                      {isDefaultPortalView ? (
                        <>
                          {/* 1. LATEST & POPULAR CARS & SUVS IN INDIA */}
                          {(cardekhoSelectedType === 'All' || cardekhoSelectedType === 'Car') && (
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>🚗 Latest &amp; Popular Cars in India</h3>
                                <p>Explore top selling hatchbacks, sedans, compact SUVs and luxury MPVs with verified dealer festive discounts</p>
                              </div>
                              <button
                                type="button"
                                className="cb-section-viewall-link"
                                onClick={() => {
                                  setCardekhoSelectedType('Car');
                                  showToast('Filtered to Cars & SUVs');
                                }}
                              >
                                <span>Explore All Cars</span>
                                <i className="fa-solid fa-chevron-right"></i>
                              </button>
                            </div>

                            {/* Sub-Category Filter Chips */}
                            <div className="cb-subtabs-row">
                              {['All', 'SUV', 'Hatchback', 'Sedan', 'MPV'].map((tab) => (
                                <button
                                  key={tab}
                                  type="button"
                                  className={`cb-subtab-btn ${homeCarSubCategory === tab ? 'active' : ''}`}
                                  onClick={() => setHomeCarSubCategory(tab)}
                                >
                                  {tab === 'All' ? 'All Cars' : tab === 'MPV' ? 'MUV / 7-Seater' : `${tab}s`}
                                </button>
                              ))}
                            </div>

                            <div className="cardekho-cards-row full-width-grid">
                              {VEHICLE_SHOWCASE_DATA
                                .filter(v => v.type === 'Car' && v.status === 'popular')
                                .filter(v => {
                                  if (homeCarSubCategory === 'All') return true;
                                  const text = `${v.name} ${v.seating || ''} ${v.features.join(' ')}`.toLowerCase();
                                  if (homeCarSubCategory === 'SUV') return text.includes('suv') || text.includes('thar') || text.includes('nexon') || text.includes('creta') || text.includes('brezza');
                                  if (homeCarSubCategory === 'Hatchback') return text.includes('hatchback') || text.includes('swift') || text.includes('punch') || text.includes('i20');
                                  if (homeCarSubCategory === 'Sedan') return text.includes('sedan') || text.includes('dzire') || text.includes('city') || text.includes('verna');
                                  if (homeCarSubCategory === 'MPV') return text.includes('mpv') || text.includes('7') || text.includes('ertiga') || text.includes('innova');
                                  return true;
                                })
                                .map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-popular">🔥 Hot Seller</span>
                                      <img src={veh.image} alt={veh.name} loading="lazy" />
                                      <div className="card-media-tags">
                                        <span><i className="fa-solid fa-gas-pump"></i> {veh.fuel}</span>
                                        <span><i className="fa-solid fa-gauge-high"></i> {veh.mileage}</span>
                                      </div>
                                    </div>

                                    <div className="cardekho-card-body">
                                      <div className="veh-type-tag-small">Passenger Car • {veh.brand}</div>
                                      <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                      <div className="car-price">{veh.priceRange}</div>
                                      <div className="car-rating-row">
                                        <span className="rating-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
                                        <span className="seating-pill">{veh.seating || '5 Seater'}</span>
                                      </div>

                                      <div className="car-features-list">
                                        {veh.features.slice(0, 3).map((f) => (
                                          <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Festive Offers for ${veh.name} in ${selectedFuelCity}: Cash Discount up to ₹45,000 + Exchange Bonus!`)}
                                      >
                                        <i className="fa-solid fa-tag"></i>
                                        <span>View All Offers</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          )}

                          {/* 2. POPULAR BIKES & SCOOTERS IN INDIA */}
                          {(cardekhoSelectedType === 'All' || cardekhoSelectedType === 'Bike') && (
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>🏍️ Popular Bikes &amp; Scooters in India</h3>
                                <p>Explore best-selling commuter motorcycles, cruisers, sport bikes and electric scooters</p>
                              </div>
                              <button
                                type="button"
                                className="cb-section-viewall-link"
                                onClick={() => {
                                  setCardekhoSelectedType('Bike');
                                  showToast('Filtered to Bikes & Scooters');
                                }}
                              >
                                <span>Explore All Two-Wheelers</span>
                                <i className="fa-solid fa-chevron-right"></i>
                              </button>
                            </div>

                            {/* Sub-Category Filter Chips */}
                            <div className="cb-subtabs-row">
                              {['All', 'Motorcycle', 'Scooter', 'Cruiser', 'Sports'].map((tab) => (
                                <button
                                  key={tab}
                                  type="button"
                                  className={`cb-subtab-btn ${homeBikeSubCategory === tab ? 'active' : ''}`}
                                  onClick={() => setHomeBikeSubCategory(tab)}
                                >
                                  {tab === 'All' ? 'All Two-Wheelers' : tab === 'Motorcycle' ? 'Commuter Bikes' : `${tab}s`}
                                </button>
                              ))}
                            </div>

                            <div className="cardekho-cards-row full-width-grid">
                              {VEHICLE_SHOWCASE_DATA
                                .filter(v => v.type === 'Bike' && v.status === 'popular')
                                .filter(v => {
                                  if (homeBikeSubCategory === 'All') return true;
                                  const text = `${v.name} ${v.features.join(' ')}`.toLowerCase();
                                  if (homeBikeSubCategory === 'Motorcycle') return !text.includes('activa') && !text.includes('jupiter') && !text.includes('scooter');
                                  if (homeBikeSubCategory === 'Scooter') return text.includes('activa') || text.includes('jupiter') || text.includes('scooter');
                                  if (homeBikeSubCategory === 'Cruiser') return text.includes('classic') || text.includes('hunter') || text.includes('meteor') || text.includes('bullet');
                                  if (homeBikeSubCategory === 'Sports') return text.includes('mt-15') || text.includes('duke') || text.includes('r15') || text.includes('sports');
                                  return true;
                                })
                                .map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-popular">🏍️ Popular 2W</span>
                                      <img src={veh.image} alt={veh.name} loading="lazy" />
                                      <div className="card-media-tags">
                                        <span><i className="fa-solid fa-gas-pump"></i> {veh.fuel}</span>
                                        <span><i className="fa-solid fa-gauge-high"></i> {veh.mileage}</span>
                                      </div>
                                    </div>

                                    <div className="cardekho-card-body">
                                      <div className="veh-type-tag-small">Two-Wheeler • {veh.brand}</div>
                                      <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                      <div className="car-price">{veh.priceRange}</div>
                                      <div className="car-rating-row">
                                        <span className="rating-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
                                        <span className="seating-pill">{veh.seating || '2 Seater'}</span>
                                      </div>

                                      <div className="car-features-list">
                                        {veh.features.slice(0, 3).map((f) => (
                                          <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Festive Offers for ${veh.name} in ${selectedFuelCity}: ₹0 Down Payment & Free Helmet!`)}
                                      >
                                        <i className="fa-solid fa-tag"></i>
                                        <span>View Offers &amp; Price</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          )}

                          {/* 3. COMMERCIAL FLEETS, FREIGHT & AGRICULTURE (TruckDekho, BusDekho & TractorGuru) */}
                          {(cardekhoSelectedType === 'All' || ['Lorry', 'Bus', 'Van', 'Tractor', 'Auto'].includes(cardekhoSelectedType)) && (
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>🚛 Commercial Fleets &amp; Agricultural Machinery</h3>
                                <p>Heavy haulage trucks, tippers, luxury buses, cargo vans, autos &amp; agricultural tractors</p>
                              </div>
                              <button
                                type="button"
                                className="cb-section-viewall-link"
                                onClick={() => {
                                  setCardekhoSelectedType('Lorry');
                                  showToast('Filtered to Commercial Trucks & Lorries');
                                }}
                              >
                                <span>Commercial Hub</span>
                                <i className="fa-solid fa-chevron-right"></i>
                              </button>
                            </div>

                            {/* Sub-Category Filter Chips */}
                            <div className="cb-subtabs-row">
                              {[
                                { id: 'All', label: 'All Commercial' },
                                { id: 'Lorry', label: 'Trucks & Lorries' },
                                { id: 'Bus', label: 'Passenger Buses' },
                                { id: 'Van', label: 'Commercial Vans' },
                                { id: 'Tractor', label: 'Agricultural Tractors' },
                                { id: 'Auto', label: '3-Wheelers & Auto' }
                              ].map((tab) => (
                                <button
                                  key={tab.id}
                                  type="button"
                                  className={`cb-subtab-btn ${homeCommercialSubCategory === tab.id ? 'active' : ''}`}
                                  onClick={() => setHomeCommercialSubCategory(tab.id)}
                                >
                                  {tab.label}
                                </button>
                              ))}
                            </div>

                            <div className="cardekho-cards-row full-width-grid">
                              {VEHICLE_SHOWCASE_DATA
                                .filter(v => (v.type === 'Lorry' || v.type === 'Bus' || v.type === 'Van' || v.type === 'Tractor' || v.type === 'Auto') && v.status === 'popular')
                                .filter(v => homeCommercialSubCategory === 'All' || v.type === homeCommercialSubCategory)
                                .map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-popular">
                                        {veh.type === 'Tractor' ? '🚜 Farm Tractor' : veh.type === 'Lorry' ? '🚛 Heavy Truck' : veh.type === 'Bus' ? '🚌 Coach' : veh.type === 'Van' ? '🚐 Commercial Van' : '🛺 3-Wheeler'}
                                      </span>
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
                                        <span className="seating-pill">{veh.seating || 'Commercial Grade'}</span>
                                      </div>

                                      <div className="car-features-list">
                                        {veh.features.slice(0, 3).map((f) => (
                                          <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Commercial Financing & Offers requested for ${veh.name}. Authorized dealer will call with fleet quote!`)}
                                      >
                                        <i className="fa-solid fa-file-invoice-dollar"></i>
                                        <span>View Commercial Financing</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          )}

                          {/* 4. COMPARE POPULAR VEHICLES (Side-by-Side Dual-Card Comparison Spotlight) */}
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>⚖️ Compare Popular Vehicles</h3>
                                <p>Side-by-side comparison of prices, specs, mileage and safety ratings to make an informed choice</p>
                              </div>
                              <button
                                type="button"
                                className="cb-section-viewall-link"
                                onClick={() => {
                                  setActiveHubTab('compare_vehicles');
                                  showToast('Switched to Vehicle Comparison Tool');
                                }}
                              >
                                <span>Full Comparison Tool</span>
                                <i className="fa-solid fa-arrow-right"></i>
                              </button>
                            </div>

                            <div className="cb-comparison-grid">
                              {POPULAR_COMPARISON_PAIRS.map((pair) => (
                                <div key={pair.id} className="cb-comparison-card">
                                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
                                    {pair.title} ({pair.category})
                                  </div>

                                  <div className="cb-comp-duo-row">
                                    <div className="cb-comp-veh-col">
                                      <img src={pair.vehicleA.image} alt={pair.vehicleA.name} loading="lazy" />
                                      <div className="cb-comp-veh-name" title={pair.vehicleA.name}>{pair.vehicleA.name}</div>
                                      <div className="cb-comp-veh-price">{pair.vehicleA.price}</div>
                                      <div className="cb-comp-veh-spec">{pair.vehicleA.spec}</div>
                                    </div>

                                    <div className="cb-comp-vs-badge">VS</div>

                                    <div className="cb-comp-veh-col">
                                      <img src={pair.vehicleB.image} alt={pair.vehicleB.name} loading="lazy" />
                                      <div className="cb-comp-veh-name" title={pair.vehicleB.name}>{pair.vehicleB.name}</div>
                                      <div className="cb-comp-veh-price">{pair.vehicleB.price}</div>
                                      <div className="cb-comp-veh-spec">{pair.vehicleB.spec}</div>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    className="btn-card-yellow-primary"
                                    onClick={() => {
                                      setActiveHubTab('compare_vehicles');
                                      showToast(`Comparing ${pair.vehicleA.name} vs ${pair.vehicleB.name}`);
                                    }}
                                  >
                                    <i className="fa-solid fa-code-compare"></i>
                                    <span>Compare {pair.vehicleA.name.split(' ')[0]} vs {pair.vehicleB.name.split(' ')[0]}</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 5. 100% ELECTRIC VEHICLES (EV MOBILITY SPOTLIGHT) */}
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>⚡ 100% Electric Vehicles (EV Showcase)</h3>
                                <p>Zero-tailpipe emissions: Electric cars, high-speed scooters, passenger autos &amp; smart city buses</p>
                              </div>
                              <button
                                type="button"
                                className="cb-section-viewall-link"
                                onClick={() => {
                                  setCardekhoSelectedType('EV');
                                  showToast('Filtered to 100% Electric Vehicles');
                                }}
                              >
                                <span>Explore All EV Models</span>
                                <i className="fa-solid fa-chevron-right"></i>
                              </button>
                            </div>

                            <div className="cardekho-cards-row full-width-grid">
                              {VEHICLE_SHOWCASE_DATA
                                .filter(v => v.status === 'electric' || v.type === 'EV' || v.fuel.toLowerCase().includes('electric') || v.fuel.toLowerCase().includes('ev'))
                                .map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-ev">⚡ Electric ({veh.type})</span>
                                      <img src={veh.image} alt={veh.name} loading="lazy" />
                                      <div className="card-media-tags">
                                        <span><i className="fa-solid fa-bolt"></i> {veh.fuel}</span>
                                        <span><i className="fa-solid fa-battery-full"></i> {veh.mileage}</span>
                                      </div>
                                    </div>

                                    <div className="cardekho-card-body">
                                      <div className="veh-type-tag-small">100% Electric • {veh.brand}</div>
                                      <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                      <div className="car-price">{veh.priceRange}</div>
                                      <div className="car-rating-row">
                                        <span className="rating-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
                                        <span className="seating-pill">{veh.seating || 'Electric Powertrain'}</span>
                                      </div>

                                      <div className="car-features-list">
                                        {veh.features.slice(0, 3).map((f) => (
                                          <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`State EV Subsidy & Offers for ${veh.name}: ₹10,000 FAME incentive + Free Home Charger installation!`)}
                                      >
                                        <i className="fa-solid fa-bolt"></i>
                                        <span>View EV Subsidies &amp; Price</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* 6. POPULAR AUTOMOTIVE MANUFACTURERS IN INDIA */}
                          <div className="cardekho-brands-strip-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>🏭 Popular Manufacturers Across Vehicles in India</h3>
                                <p>Click any brand to instantly browse all models, specifications and authorized dealers</p>
                              </div>
                            </div>

                            <div className="cardekho-brands-logos-grid">
                              {[
                                { name: 'Tata Motors', icon: 'fa-shield-halved', type: 'Cars, Trucks, EV, Buses', category: 'Car' },
                                { name: 'Maruti Suzuki', icon: 'fa-car', type: 'Cars & Vans', category: 'Car' },
                                { name: 'Mahindra', icon: 'fa-truck-pickup', type: 'SUVs, Autos & Tractors', category: 'Car' },
                                { name: 'Hyundai', icon: 'fa-bolt', type: 'Cars & Electric', category: 'Car' },
                                { name: 'Royal Enfield', icon: 'fa-motorcycle', type: 'Cruiser Motorcycles', category: 'Bike' },
                                { name: 'Hero MotoCorp', icon: 'fa-motorcycle', type: 'Motorcycles & Scooters', category: 'Bike' },
                                { name: 'Honda 2Wheelers', icon: 'fa-road', type: 'Activa, Shine & Bikes', category: 'Bike' },
                                { name: 'TVS Motor', icon: 'fa-motorcycle', type: 'Apache, Jupiter & iQube', category: 'Bike' },
                                { name: 'Bajaj Auto', icon: 'fa-gas-pump', type: 'Pulsar, Chetak EV & 3W', category: 'Bike' },
                                { name: 'Yamaha', icon: 'fa-motorcycle', type: 'MT-15, R15 & Aerox', category: 'Bike' },
                                { name: 'KTM', icon: 'fa-motorcycle', type: 'Duke & Adventure Sports', category: 'Bike' },
                                { name: 'Ashok Leyland', icon: 'fa-truck-moving', type: 'Lorries & Buses', category: 'Lorry' },
                                { name: 'Volvo Buses', icon: 'fa-bus', type: 'Luxury Coaches & Heavy Trucks', category: 'Bus' },
                                { name: 'Force Motors', icon: 'fa-van-shuttle', type: 'Traveller, Urbania & Vans', category: 'Van' },
                                { name: 'Ather & Ola', icon: 'fa-charging-station', type: 'Smart EV 2-Wheelers', category: 'Bike' },
                                { name: 'Swaraj & John Deere', icon: 'fa-tractor', type: 'Agricultural Tractors', category: 'Tractor' },
                              ]
                                .filter((brand) => {
                                  if (cardekhoSelectedType === 'All') return true;
                                  if (cardekhoSelectedType === 'Car') return brand.category === 'Car';
                                  if (cardekhoSelectedType === 'Bike') return brand.category === 'Bike';
                                  if (cardekhoSelectedType === 'Lorry') return brand.category === 'Lorry';
                                  if (cardekhoSelectedType === 'Bus') return brand.category === 'Bus';
                                  if (cardekhoSelectedType === 'Van') return brand.category === 'Van';
                                  if (cardekhoSelectedType === 'Tractor') return brand.category === 'Tractor';
                                  if (cardekhoSelectedType === 'Auto') return brand.type.includes('3W') || brand.type.includes('Autos');
                                  if (cardekhoSelectedType === 'EV') return brand.type.includes('EV') || brand.type.includes('Electric');
                                  return true;
                                })
                                .map((brand) => (
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

                          {/* 7. CERTIFIED PRE-OWNED VEHICLES (SART ASSURED USED) */}
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>🛡️ SART Certified Pre-Owned Vehicles (200+ Point Inspected)</h3>
                                <p>Verified cars, bikes &amp; commercial vehicles with warranty, 7-day money-back &amp; free RC transfer</p>
                              </div>
                              <button
                                type="button"
                                className="cb-section-viewall-link"
                                onClick={() => {
                                  setCardekhoVehicleCondition('used');
                                  showToast('Switched to Certified Used Vehicles View');
                                }}
                              >
                                <span>View All Used Vehicles</span>
                                <i className="fa-solid fa-chevron-right"></i>
                              </button>
                            </div>

                            <div className="cardekho-cards-row full-width-grid">
                              {VEHICLE_SHOWCASE_DATA.filter(v => v.status === 'used').slice(0, 8).map((veh) => (
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

                                    <button
                                      type="button"
                                      className="btn-card-yellow-primary"
                                      onClick={() => showToast(`Home Test Drive scheduled for ${veh.name}! SART certified technician will contact you.`)}
                                    >
                                      <i className="fa-solid fa-key"></i>
                                      <span>Book Free Home Test Drive</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 8. LATEST AUTOMOTIVE NEWS & EXPERT ROAD TESTS */}
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>📰 Latest Automotive News &amp; Expert Road Tests</h3>
                                <p>Independent road reviews, real-world mileage checks, electric battery tests &amp; industry launches</p>
                              </div>
                            </div>

                            <div className="cb-news-grid">
                              {AUTOMOTIVE_NEWS_DATA.map((article) => (
                                <div
                                  key={article.id}
                                  className="cb-news-card"
                                  onClick={() => showToast(`Opening article: "${article.title}"`)}
                                >
                                  <div className="cb-news-img-box">
                                    <span className="cb-news-category-badge">{article.category}</span>
                                    <img src={article.image} alt={article.title} loading="lazy" />
                                  </div>
                                  <div className="cb-news-content">
                                    <div className="cb-news-meta-row">
                                      <span><i className="fa-regular fa-clock"></i> {article.readTime}</span>
                                      <span>{article.date}</span>
                                    </div>
                                    <h4 className="cb-news-title">{article.title}</h4>
                                    <p className="cb-news-snippet">{article.snippet}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 9. POPULAR VEHICLE VIDEO REVIEWS & WALKAROUNDS */}
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>🎬 Popular Vehicle Video Reviews &amp; Test Drives</h3>
                                <p>Watch in-depth walkarounds, performance road tests and drag races by automobile experts</p>
                              </div>
                            </div>

                            <div className="cb-videos-grid">
                              {VEHICLE_VIDEO_REVIEWS.map((vid) => (
                                <div
                                  key={vid.id}
                                  className="cb-video-card"
                                  onClick={() => showToast(`Playing video: "${vid.title}"`)}
                                >
                                  <div className="cb-video-thumb-box">
                                    <img src={vid.image} alt={vid.title} loading="lazy" />
                                    <div className="cb-video-play-overlay">
                                      <i className="fa-solid fa-play"></i>
                                    </div>
                                    <span className="cb-video-duration">{vid.duration}</span>
                                  </div>
                                  <div className="cb-video-info">
                                    <h4 className="cb-video-title">{vid.title}</h4>
                                    <div className="cb-video-channel">
                                      <i className="fa-brands fa-youtube" style={{ color: '#ef4444' }}></i>
                                      <span>{vid.channel} • {vid.views}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        /* ============================================================== */
                        /* CASE B: DYNAMICALLY FILTERED VIEW (When user chooses from form) */
                        /* ============================================================== */
                        <>
                          {/* 1. FILTERED NEW OR POPULAR VEHICLES */}
                          {popularVehicles.length > 0 && (
                            <div className="cardekho-catalog-section">
                              <div className="section-title-line">
                                <div>
                                  <h3 className="section-title-text">
                                    {cardekhoVehicleCondition === 'new'
                                      ? `Matching New Vehicles • ${cardekhoSelectedType === 'All' ? 'All Classes' : cardekhoSelectedType}`
                                      : 'Available Certified Pre-Owned Vehicles'}
                                  </h3>
                                  <p className="section-title-sub">Showing verified vehicles matching your selected criteria with instant dealer quotes</p>
                                </div>
                                <span className="section-count-tag">
                                  {popularVehicles.length} Vehicles
                                </span>
                              </div>

                              <div className="cardekho-cards-row full-width-grid">
                                {popularVehicles.map((veh) => (
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

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Festive Offers for ${veh.name} in ${selectedFuelCity}: Maximum dealer discounts applied!`)}
                                      >
                                        <i className="fa-solid fa-tag"></i>
                                        <span>View Offers &amp; Price</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 2. FILTERED ELECTRIC VEHICLES */}
                          {electricVehicles.length > 0 && (
                            <div className="cardekho-catalog-section">
                              <div className="section-title-line">
                                <div>
                                  <h3 className="section-title-text">⚡ Electric Mobility (EV) • {cardekhoSelectedType === 'All' ? 'All Classes' : cardekhoSelectedType}</h3>
                                  <p className="section-title-sub">Zero tailpipe emissions, lower running cost &amp; fast highway charging network</p>
                                </div>
                                <span className="section-count-tag tag-ev">
                                  {electricVehicles.length} EVs
                                </span>
                              </div>

                              <div className="cardekho-cards-row full-width-grid">
                                {electricVehicles.map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-ev">⚡ Electric {veh.type}</span>
                                      <img src={veh.image} alt={veh.name} loading="lazy" />
                                      <div className="card-media-tags">
                                        <span><i className="fa-solid fa-battery-full"></i> {veh.mileage}</span>
                                        <span><i className="fa-solid fa-plug"></i> Fast Charge</span>
                                      </div>
                                    </div>

                                    <div className="cardekho-card-body">
                                      <div className="veh-type-tag-small">EV • {veh.brand}</div>
                                      <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                      <div className="car-price">{veh.priceRange}</div>
                                      <div className="car-rating-row">
                                        <span className="rating-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
                                        <span className="seating-pill">{veh.seating || 'EV Spec'}</span>
                                      </div>

                                      <div className="car-features-list">
                                        {veh.features.slice(0, 3).map((f) => (
                                          <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Subsidies and Fast Charging Map for ${veh.name} sent to your WhatsApp!`)}
                                      >
                                        <i className="fa-solid fa-bolt"></i>
                                        <span>View EV Subsidies &amp; Price</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 3. FILTERED UPCOMING VEHICLES */}
                          {upcomingVehicles.length > 0 && (
                            <div className="cardekho-catalog-section">
                              <div className="section-title-line">
                                <div>
                                  <h3 className="section-title-text">🚀 Upcoming Launches • {cardekhoSelectedType === 'All' ? 'All Classes' : cardekhoSelectedType}</h3>
                                  <p className="section-title-sub">Be the first to book! Pre-bookings opening soon with exclusive launch price guarantee</p>
                                </div>
                                <span className="section-count-tag tag-upcoming">
                                  {upcomingVehicles.length} Launches
                                </span>
                              </div>

                              <div className="cardekho-cards-row full-width-grid">
                                {upcomingVehicles.map((veh) => (
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

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Priority Launch Alert set for ${veh.name}! We will notify you upon launch.`)}
                                      >
                                        <i className="fa-regular fa-bell"></i>
                                        <span>Set Launch Alert</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 4. FILTERED USED VEHICLES (When in used mode or searching used) */}
                          {usedVehicles.length > 0 && (
                            <div className="cardekho-catalog-section">
                              <div className="section-title-line">
                                <div>
                                  <h3 className="section-title-text">
                                    🛡️ Certified Pre-Owned {cardekhoSelectedType === 'All' ? 'Vehicles' : cardekhoSelectedType === 'Car' ? 'Cars & SUVs' : cardekhoSelectedType === 'Bike' ? 'Bikes & Scooters' : cardekhoSelectedType === 'Van' ? 'Commercial Vans' : cardekhoSelectedType === 'Bus' ? 'Buses' : cardekhoSelectedType === 'Lorry' ? 'Commercial Trucks' : cardekhoSelectedType === 'Tractor' ? 'Agricultural Tractors' : cardekhoSelectedType === 'Auto' ? '3-Wheelers & Autos' : 'Electric Vehicles'}
                                    {cardekhoCityFilter !== 'All Cities' && ` in ${cardekhoCityFilter}`}
                                  </h3>
                                  <p className="section-title-sub">Verified pre-owned vehicles with 200+ point inspection, warranty, 7-day money back &amp; free RC transfer</p>
                                </div>
                                <span className="section-count-tag tag-used">
                                  {usedVehicles.length} Units
                                </span>
                              </div>

                              <div className="cardekho-cards-row full-width-grid">
                                {usedVehicles.map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card used-card-border">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-used">🛡️ Certified {veh.type}</span>
                                      <img src={veh.image} alt={veh.name} loading="lazy" />
                                      <div className="card-media-tags">
                                        <span><i className="fa-solid fa-location-dot"></i> {veh.location || cardekhoCityFilter}</span>
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

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Home Test Drive scheduled for ${veh.name} in ${veh.location || cardekhoCityFilter}!`)}
                                      >
                                        <i className="fa-solid fa-key"></i>
                                        <span>Book Free Home Test Drive</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* NO MATCH FOUND FALLBACK */}
                          {popularVehicles.length === 0 && electricVehicles.length === 0 && upcomingVehicles.length === 0 && usedVehicles.length === 0 && (
                            <div className="empty-search-state" style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '16px', margin: '20px 0' }}>
                              <i className="fa-solid fa-car-tunnel" style={{ fontSize: '42px', color: '#94a3b8', marginBottom: '14px' }}></i>
                              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>No exact vehicle match found</h4>
                              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                                We couldn't find vehicles matching your selected filters. Try resetting the filters to view all models.
                              </p>
                              <button
                                type="button"
                                className="btn-carandbike-search-yellow"
                                style={{ display: 'inline-flex', width: 'auto', padding: '10px 24px', margin: '0 auto' }}
                                onClick={() => {
                                  setCardekhoSelectedType('All');
                                  setCardekhoBrandFilter('All Brands');
                                  setCardekhoModelFilter('All Models');
                                  setCardekhoBodyTypeFilter('All');
                                  setCardekhoBudgetFilter('All Budgets');
                                  setCardekhoCityFilter('All Cities');
                                  setCardekhoSearchBy('budget');
                                  showToast('Reset all filters to All Vehicles');
                                }}
                              >
                                <i className="fa-solid fa-rotate-left"></i>
                                <span>Reset Filters (Show All Vehicles)</span>
                              </button>
                            </div>
                          )}

                          {/* RELEVANT BRANDS STRIP */}
                          <div className="cardekho-brands-strip-section">
                            <h3 className="section-title-text">
                              {cardekhoSelectedType === 'All' ? 'Popular Manufacturers in India' : `Popular ${cardekhoSelectedType} Brands`}
                            </h3>
                            <div className="cardekho-brands-logos-grid">
                              {[
                                { name: 'Tata Motors', icon: 'fa-shield-halved', type: 'Cars, Trucks, EV, Buses', category: ['Car', 'Lorry', 'Bus', 'EV'] },
                                { name: 'Maruti Suzuki', icon: 'fa-car', type: 'Cars & Vans', category: ['Car', 'Van'] },
                                { name: 'Mahindra', icon: 'fa-truck-pickup', type: 'SUVs, Autos & Tractors', category: ['Car', 'Auto', 'Tractor', 'EV'] },
                                { name: 'Hyundai', icon: 'fa-bolt', type: 'Cars & Electric', category: ['Car', 'EV'] },
                                { name: 'Royal Enfield', icon: 'fa-motorcycle', type: 'Cruiser Motorcycles', category: ['Bike'] },
                                { name: 'Hero MotoCorp', icon: 'fa-motorcycle', type: 'Motorcycles & Scooters', category: ['Bike'] },
                                { name: 'Honda 2Wheelers', icon: 'fa-road', type: 'Activa, Shine & Bikes', category: ['Bike'] },
                                { name: 'TVS Motor', icon: 'fa-motorcycle', type: 'Apache, Jupiter & iQube', category: ['Bike', 'Auto', 'EV'] },
                                { name: 'Bajaj Auto', icon: 'fa-gas-pump', type: 'Pulsar, Chetak EV & 3W', category: ['Bike', 'Auto', 'EV'] },
                                { name: 'Yamaha', icon: 'fa-motorcycle', type: 'MT-15, R15 & Aerox', category: ['Bike'] },
                                { name: 'KTM', icon: 'fa-motorcycle', type: 'Duke & Adventure Sports', category: ['Bike'] },
                                { name: 'Ashok Leyland', icon: 'fa-truck-moving', type: 'Lorries & Buses', category: ['Lorry', 'Bus'] },
                                { name: 'Volvo Buses', icon: 'fa-bus', type: 'Luxury Coaches & Heavy Trucks', category: ['Bus', 'Lorry'] },
                                { name: 'Force Motors', icon: 'fa-van-shuttle', type: 'Traveller, Urbania & Vans', category: ['Van', 'Bus'] },
                                { name: 'Ather & Ola', icon: 'fa-charging-station', type: 'Smart EV 2-Wheelers', category: ['Bike', 'EV'] },
                                { name: 'Swaraj & John Deere', icon: 'fa-tractor', type: 'Agricultural Tractors', category: ['Tractor'] },
                              ]
                                .filter(brand => cardekhoSelectedType === 'All' || brand.category.includes(cardekhoSelectedType))
                                .map((brand) => (
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
                        </>
                      )}
                    </>
                  );
                })()}

                </div>
              )}
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
        {activeHubTab === 'compare_vehicles' && (() => {
          const filledVehicles = compareSelectedVehicles.filter((v): v is ComparisonVehicle => v !== null);

          // Filter vehicles for the selection modal
          const modalAvailableVehicles = COMPARISON_VEHICLES.filter((v) => {
            const matchesCat = compareActiveCategory === 'All' || v.category === compareActiveCategory;
            const matchesSearch = !compareVehicleSearchQuery.trim() ||
              v.name.toLowerCase().includes(compareVehicleSearchQuery.toLowerCase()) ||
              v.brand.toLowerCase().includes(compareVehicleSearchQuery.toLowerCase());
            return matchesCat && matchesSearch;
          });

          // Popular comparison pairs based on screenshot
          const popularPairs = [
            {
              cat: 'Scooters',
              vA: COMPARISON_VEHICLES.find(v => v.id === 'comp-ntorq') || COMPARISON_VEHICLES[0],
              vB: COMPARISON_VEHICLES.find(v => v.id === 'comp-rayzr') || COMPARISON_VEHICLES[1]
            },
            {
              cat: 'Electric',
              vA: COMPARISON_VEHICLES.find(v => v.id === 'comp-olas1x') || COMPARISON_VEHICLES[2],
              vB: COMPARISON_VEHICLES.find(v => v.id === 'comp-qc1') || COMPARISON_VEHICLES[3]
            },
            {
              cat: 'Bikes',
              vA: COMPARISON_VEHICLES.find(v => v.id === 'comp-rr300') || COMPARISON_VEHICLES[9],
              vB: COMPARISON_VEHICLES.find(v => v.id === 'comp-r15') || COMPARISON_VEHICLES[8]
            },
            {
              cat: 'Cars',
              vA: COMPARISON_VEHICLES.find(v => v.id === 'comp-creta') || COMPARISON_VEHICLES[13],
              vB: COMPARISON_VEHICLES.find(v => v.id === 'comp-seltos') || COMPARISON_VEHICLES[15]
            }
          ].filter(pair => comparePopularTab === 'All' || pair.cat === comparePopularTab || (comparePopularTab === 'Scooters' && pair.cat === 'Scooters'));

          return (
            <section className="hub-showcase-view animate-pop carbike-compare-wrapper">
              {/* 1. TOP HEADER & INTRO */}
              <div className="cb-compare-header">
                <div className="cb-header-title-row">
                  <div>
                    <h2>Compare Your Dream {selectedCompareVehicleType === 'All' ? 'Vehicle' : selectedCompareVehicleType}</h2>
                    <p>
                      Planning on buying a vehicle? Confused between options? Select your vehicle type, pick up to <strong>four vehicles</strong>,
                      and compare specifications, real on-road pricing, fuel economy, safety, and monthly ownership cost.
                    </p>
                  </div>

                  <span className="cb-active-class-pill">
                    <i className="fa-solid fa-shapes"></i> Category: {selectedCompareVehicleType}
                  </span>
                </div>

                {/* STEP 1: CHOOSE VEHICLE OPTION FIRST (ALL SART VEHICLE CLASSES) */}
                <div className="cb-vehicle-type-selector-bar">
                  <span className="type-bar-label">
                    <i className="fa-solid fa-layer-group"></i> <strong>Step 1: Choose Vehicle Type:</strong>
                  </span>
                  <div className="type-buttons-scroll">
                    {[
                      { id: 'Car', label: 'Cars & SUVs', icon: 'fa-car-side' },
                      { id: 'Scooter', label: 'Scooters', icon: 'fa-motorcycle' },
                      { id: 'Bike', label: 'Bikes & Motorcycles', icon: 'fa-motorcycle' },
                      { id: 'EV', label: 'Electric (EV)', icon: 'fa-bolt' },
                      { id: 'Commercial', label: 'Trucks & Lorries', icon: 'fa-truck' },
                      { id: 'Auto', label: 'Auto Rickshaws', icon: 'fa-taxi' },
                      { id: 'All', label: 'All Vehicles', icon: 'fa-globe' }
                    ].map((vt) => (
                      <button
                        key={vt.id}
                        type="button"
                        className={`cb-type-tab-btn ${selectedCompareVehicleType === vt.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCompareVehicleType(vt.id);
                          setCompareActiveCategory(vt.id);

                          // Load 2 matching defaults for this class
                          const matching = vt.id === 'All'
                            ? COMPARISON_VEHICLES
                            : COMPARISON_VEHICLES.filter(v => v.category === vt.id || (vt.id === 'Auto' && v.category === 'Scooter'));

                          if (matching.length >= 2) {
                            setCompareSelectedVehicles([matching[0], matching[1], null, null]);
                          } else if (matching.length === 1) {
                            setCompareSelectedVehicles([matching[0], null, null, null]);
                          }

                          showToast(`Selected ${vt.label} category for comparison`);
                        }}
                      >
                        <i className={`fa-solid ${vt.icon}`}></i>
                        <span>{vt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. 4 COMPARISON SLOTS ROW (DESKTOP 4 MAX, FULLY RESPONSIVE) */}
              <div className="cb-compare-slots-row">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const veh = compareSelectedVehicles[slotIdx];
                  const slotLabel = selectedCompareVehicleType === 'All' ? 'Vehicle' : selectedCompareVehicleType;
                  return (
                    <div key={slotIdx} className={`cb-slot-card ${veh ? 'has-vehicle' : 'is-empty'}`}>
                      {veh ? (
                        <div className="cb-slot-filled">
                          <button
                            type="button"
                            className="btn-slot-remove"
                            title="Remove from comparison"
                            onClick={() => {
                              const updated = [...compareSelectedVehicles];
                              updated[slotIdx] = null;
                              setCompareSelectedVehicles(updated);
                              showToast(`Removed ${veh.name}`);
                            }}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                          <img src={veh.image} alt={veh.name} className="cb-slot-img" />
                          <span className="cb-slot-brand">{veh.brand}</span>
                          <h4 className="cb-slot-name" title={veh.name}>{veh.name}</h4>
                          <span className="cb-slot-price">{veh.price}</span>
                          <button
                            type="button"
                            className="btn-slot-change"
                            onClick={() => {
                              setComparePickerSlot(slotIdx);
                            }}
                          >
                            <i className="fa-solid fa-arrows-rotate"></i> Change Vehicle
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="cb-slot-empty-btn"
                          onClick={() => {
                            setComparePickerSlot(slotIdx);
                          }}
                        >
                          <div className="slot-plus-circle">
                            <i className="fa-solid fa-plus"></i>
                          </div>
                          <span className="slot-btn-label">
                            Add {slotLabel} {slotIdx + 1}
                          </span>
                          <span className="slot-btn-sub">Click to select from SART</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* COMPARE ACTION BUTTON */}
              <div className="cb-compare-action-bar">
                <button
                  type="button"
                  className="btn-primary-compare"
                  disabled={filledVehicles.length < 2}
                  onClick={() => {
                    const tableElem = document.getElementById('sart-compare-table-anchor');
                    if (tableElem) {
                      tableElem.scrollIntoView({ behavior: 'smooth' });
                    }
                    showToast(`Comparing ${filledVehicles.length} vehicles side-by-side!`);
                  }}
                >
                  <i className="fa-solid fa-code-compare"></i> Compare ({filledVehicles.length} Selected)
                </button>
                {filledVehicles.length < 2 && (
                  <span className="compare-hint-text">
                    <i className="fa-solid fa-circle-info"></i> Please select at least 2 vehicles to view comparison table.
                  </span>
                )}
              </div>

              {/* 3. POPULAR COMPARISONS BAR (MATCHING USER SCREENSHOT) */}
              <div className="cb-popular-comparisons-section">
                <div className="section-head-line">
                  <h3>Popular {selectedCompareVehicleType === 'All' ? 'Vehicle' : selectedCompareVehicleType} Comparisons</h3>
                  <div className="cb-cat-pills">
                    {(['All', 'Scooters', 'Electric', 'Bikes', 'Cars'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        className={`cb-cat-pill-btn ${comparePopularTab === tab ? 'active' : ''}`}
                        onClick={() => setComparePopularTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="cb-popular-cards-grid">
                  {popularPairs.map((pair, idx) => (
                    <div key={idx} className="cb-popular-pair-card">
                      <div className="pair-images-row">
                        <div className="pair-side">
                          <img src={pair.vA.image} alt={pair.vA.name} />
                          <h5 className="pair-veh-title">{pair.vA.name}</h5>
                          <span className="pair-veh-price">{pair.vA.price}</span>
                        </div>

                        <div className="pair-vs-badge">V/S</div>

                        <div className="pair-side">
                          <img src={pair.vB.image} alt={pair.vB.name} />
                          <h5 className="pair-veh-title">{pair.vB.name}</h5>
                          <span className="pair-veh-price">{pair.vB.price}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-compare-now-pair"
                        onClick={() => {
                          setCompareSelectedVehicles([pair.vA, pair.vB, null, null]);
                          showToast(`Loaded comparison for ${pair.vA.name} vs ${pair.vB.name}`);
                          const anchor = document.getElementById('sart-compare-table-anchor');
                          if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <span>Compare Now</span>
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. POPULAR MODELS IN INDIA (DYNAMIC BY SELECTED VEHICLE TYPE) */}
              {(() => {
                const popularVehiclesToShow = (selectedCompareVehicleType === 'All'
                  ? COMPARISON_VEHICLES
                  : COMPARISON_VEHICLES.filter(v => v.category === selectedCompareVehicleType || (selectedCompareVehicleType === 'Auto' && v.category === 'Scooter'))
                ).slice(0, 6);

                return (
                  <div className="cb-popular-vehicles-section">
                    <div className="section-head-line">
                      <h3>Popular {selectedCompareVehicleType === 'All' ? 'Vehicles' : selectedCompareVehicleType + 's'} In India</h3>
                      <span className="sec-sub-count">{popularVehiclesToShow.length} Models Verified</span>
                    </div>

                    <div className="cb-vehicles-scroll-row">
                      {popularVehiclesToShow.map((veh) => (
                        <div key={veh.id} className="cb-vehicle-mini-card">
                          <div className="card-top-fav">
                            <i className="fa-regular fa-heart"></i>
                          </div>
                          <img src={veh.image} alt={veh.name} className="cb-mini-img" />
                          <h4 className="cb-mini-name">{veh.name}</h4>
                          <div className="cb-mini-specs">
                            <span>{veh.engine.split(' ')[0]}</span> • <span>{veh.mileage.split(' ')[0]}</span>
                          </div>
                          <div className="cb-mini-price">{veh.price}</div>
                          <button
                            type="button"
                            className="btn-get-onroad-link"
                            onClick={() => {
                              showToast(`Estimated on-road price for ${veh.name} in ${userLocationCity} is ${veh.price}`);
                            }}
                          >
                            <span>Get on road price</span>
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* 5. SIDE-BY-SIDE SPEC COMPARISON TABLE (ANCHOR FOR SCROLL) */}
              <div id="sart-compare-table-anchor" className="comparison-table-wrap">
                <div className="table-header-info">
                  <h3>
                    <i className="fa-solid fa-table-columns"></i> Side-by-Side Detailed Specification Matrix
                  </h3>
                  <span className="active-count-tag">
                    {filledVehicles.length} of 4 vehicles active
                  </span>
                </div>

                {filledVehicles.length >= 2 ? (
                  <div className="table-responsive-box">
                    <table className="comparison-table multi-slot-table">
                      <thead>
                        <tr>
                          <th className="th-feature-metric">Features &amp; Metrics</th>
                          {filledVehicles.map((v, idx) => (
                            <th key={`${v.id}-${idx}`} className="th-veh-col">
                              <div className="th-veh-head">
                                <img src={v.image} alt={v.name} />
                                <span className="th-brand">{v.brand}</span>
                                <strong>{v.name}</strong>
                                <span className="th-price">{v.price}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {/* Group 1: Pricing */}
                        <tr className="table-group-header">
                          <td colSpan={filledVehicles.length + 1}>
                            <i className="fa-solid fa-indian-rupee-sign"></i> 1. Pricing &amp; Warranty
                          </td>
                        </tr>
                        <tr>
                          <td className="spec-label">Price Range</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-price-${idx}`}><strong className="highlight-metric">{v.price}</strong></td>
                          ))}
                        </tr>
                        <tr>
                          <td className="spec-label">Manufacturer Warranty</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-warr-${idx}`}>{v.warranty}</td>
                          ))}
                        </tr>

                        {/* Group 2: Engine & Specs */}
                        <tr className="table-group-header">
                          <td colSpan={filledVehicles.length + 1}>
                            <i className="fa-solid fa-gauge-high"></i> 2. Powertrain, Power &amp; Mileage
                          </td>
                        </tr>
                        <tr>
                          <td className="spec-label">Engine / Battery Spec</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-eng-${idx}`}>{v.engine}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="spec-label">Max Power &amp; Output</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-pwr-${idx}`}><strong className="highlight-metric">{v.power}</strong></td>
                          ))}
                        </tr>
                        <tr>
                          <td className="spec-label">Certified Mileage / Range</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-mil-${idx}`}><span className="mileage-badge">{v.mileage}</span></td>
                          ))}
                        </tr>

                        {/* Group 3: Safety & Brakes */}
                        <tr className="table-group-header">
                          <td colSpan={filledVehicles.length + 1}>
                            <i className="fa-solid fa-shield-halved"></i> 3. Safety, Brakes &amp; Ergonomics
                          </td>
                        </tr>
                        <tr>
                          <td className="spec-label">Braking &amp; Safety Tech</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-saf-${idx}`}><span className="safety-badge">{v.safety}</span></td>
                          ))}
                        </tr>
                        <tr>
                          <td className="spec-label">Chassis &amp; Protective Frame</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-airb-${idx}`}>{v.airbags}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="spec-label">Seating &amp; Class</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-seat-${idx}`}>{v.seating}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="choose-atleast-two-card">
                    <i className="fa-solid fa-arrows-split-up-and-left fa-3x"></i>
                    <h4>Select at least 2 vehicles to unlock detailed side-by-side comparison</h4>
                    <p>Click on any "+ Add Scooter" slot above or pick one of our Popular Comparisons!</p>
                  </div>
                )}
              </div>

              {/* 6. VEHICLE PICKER MODAL (Choose Any SART Vehicle for Slot) */}
              {comparePickerSlot !== null && (
                <div className="cb-picker-modal-overlay" onClick={() => setComparePickerSlot(null)}>
                  <div className="cb-picker-modal-card animate-pop" onClick={(e) => e.stopPropagation()}>
                    <div className="picker-modal-header">
                      <div>
                        <h3>Select Vehicle for Slot {comparePickerSlot + 1}</h3>
                        <p>Pick from all scooters, bikes, cars, and EVs in SART</p>
                      </div>
                      <button
                        type="button"
                        className="btn-close-picker"
                        onClick={() => setComparePickerSlot(null)}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>

                    {/* Filter categories */}
                    <div className="picker-category-tabs">
                      {['All', 'Scooter', 'Bike', 'Car', 'EV', 'Commercial'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`picker-cat-btn ${compareActiveCategory === cat ? 'active' : ''}`}
                          onClick={() => setCompareActiveCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Search query */}
                    <div className="picker-search-bar">
                      <i className="fa-solid fa-magnifying-glass"></i>
                      <input
                        type="text"
                        value={compareVehicleSearchQuery}
                        onChange={(e) => setCompareVehicleSearchQuery(e.target.value)}
                        placeholder="Search model or brand (e.g., Activa, NTORQ, Creta, R15)..."
                        autoFocus
                      />
                    </div>

                    {/* Vehicles Grid */}
                    <div className="picker-vehicles-list">
                      {modalAvailableVehicles.map((item) => (
                        <div
                          key={item.id}
                          className="picker-vehicle-item"
                          onClick={() => {
                            const updated = [...compareSelectedVehicles];
                            updated[comparePickerSlot] = item;
                            setCompareSelectedVehicles(updated);
                            setComparePickerSlot(null);
                            showToast(`Added ${item.name} to comparison!`);
                          }}
                        >
                          <img src={item.image} alt={item.name} />
                          <div className="picker-item-info">
                            <span className="picker-item-cat">{item.category} • {item.brand}</span>
                            <h5>{item.name}</h5>
                            <strong>{item.price}</strong>
                          </div>
                          <button type="button" className="btn-select-pill">
                            Select
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })()}

        {/* ------------------------------------------------------------------ */}
        {/* HUB TAB 4: EV CHARGING & LIVE FUEL PRICES (USER IMAGE 2 BASED)     */}
        {/* ------------------------------------------------------------------ */}
        {activeHubTab === 'ev_fuel_stations' && (() => {
          // Unique states list from LIVE_FUEL_PRICES
          const availableStates = Array.from(new Set(LIVE_FUEL_PRICES.map((p) => p.state))).sort();
          // Cities in currently selected state
          const citiesInSelectedState = LIVE_FUEL_PRICES.filter(p => selectedFuelState === 'All States' || p.state === selectedFuelState);

          // Get active price record
          const currentPrice = LIVE_FUEL_PRICES.find((p) => p.city.toLowerCase() === selectedFuelCity.toLowerCase()) ||
            LIVE_FUEL_PRICES.find((p) => p.state === selectedFuelState) ||
            LIVE_FUEL_PRICES[0];

          // Filter stations based on state, city, query, brand, and type
          const filteredStations = LOCATION_BASED_STATIONS.filter((st) => {
            // Match city or search query
            const matchesCity =
              selectedFuelCity === 'All Cities' ||
              st.city.toLowerCase() === selectedFuelCity.toLowerCase() ||
              (fuelLocationSearchQuery.trim() !== '' && (
                st.name.toLowerCase().includes(fuelLocationSearchQuery.toLowerCase()) ||
                st.address.toLowerCase().includes(fuelLocationSearchQuery.toLowerCase()) ||
                st.city.toLowerCase().includes(fuelLocationSearchQuery.toLowerCase()) ||
                st.brand.toLowerCase().includes(fuelLocationSearchQuery.toLowerCase())
              ));

            if (!matchesCity && !fuelLocationSearchQuery.trim()) return false;

            // Brand filter
            if (fuelBrandFilter !== 'all') {
              if (fuelBrandFilter === 'IOCL' && !st.brand.includes('IOCL') && !st.name.includes('Iocl')) return false;
              if (fuelBrandFilter === 'BPCL' && !st.brand.includes('BPCL')) return false;
              if (fuelBrandFilter === 'HPCL' && !st.brand.includes('HPCL')) return false;
              if (fuelBrandFilter === 'Tata' && !st.brand.includes('Tata')) return false;
              if (fuelBrandFilter === 'Jio-bp' && !st.brand.includes('Jio-bp')) return false;
              if (fuelBrandFilter === 'Statiq' && !st.brand.includes('Statiq')) return false;
              if (fuelBrandFilter === 'Shell' && !st.brand.includes('Shell')) return false;
            }

            // Category filter
            if (stationFilterCategory === 'fuel' && st.type === 'ev') return false;
            if (stationFilterCategory === 'ev' && st.type === 'fuel') return false;
            if (stationFilterCategory === 'cng' && !st.fuels.some(fuel => fuel.toLowerCase().includes('cng'))) return false;

            return true;
          });

          return (
            <section className="hub-showcase-view animate-pop">
              <div className="hub-view-header modern-fuel-header">
                <div className="view-title-wrap">
                  <span className="hub-badge-flair fuel-flair">
                    <i className="fa-solid fa-charging-station"></i> LIVE AUTOMOTIVE ENERGY &amp; PUMP FINDER
                  </span>
                  <h2>Daily Fuel Rates &amp; Nearby Fuel &amp; EV Stations</h2>
                  <p>Location-based live directory of verified Petrol, Diesel, CNG pumps and high-speed EV DC charging hubs across India.</p>
                </div>

                {/* State & City Chooser Controls */}
                <div className="fuel-controls-master-bar">
                  {/* State Select */}
                  <div className="fuel-control-group">
                    <span className="control-label"><i className="fa-solid fa-earth-americas"></i> State:</span>
                    <select
                      value={selectedFuelState}
                      onChange={(e) => {
                        const newState = e.target.value;
                        setSelectedFuelState(newState);
                        // Pick first city in the new state
                        const matchingCity = LIVE_FUEL_PRICES.find(p => p.state === newState);
                        if (matchingCity) {
                          setSelectedFuelCity(matchingCity.city);
                        }
                        showToast(`Switched state to: ${newState}`);
                      }}
                      className="fuel-modern-select"
                    >
                      <option value="All States">All States</option>
                      {availableStates.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  {/* City Select */}
                  <div className="fuel-control-group">
                    <span className="control-label"><i className="fa-solid fa-location-dot"></i> City:</span>
                    <select
                      value={selectedFuelCity}
                      onChange={(e) => {
                        setSelectedFuelCity(e.target.value);
                        // Auto-sync state if city has known state
                        const found = LIVE_FUEL_PRICES.find(p => p.city === e.target.value);
                        if (found) setSelectedFuelState(found.state);
                        showToast(`Updated stations & fuel prices for ${e.target.value}`);
                      }}
                      className="fuel-modern-select"
                    >
                      <option value="All Cities">All Cities</option>
                      {citiesInSelectedState.map((p) => (
                        <option key={p.city} value={p.city}>{p.city} ({p.state})</option>
                      ))}
                    </select>
                  </div>

                  {/* Auto-Detect GPS Button */}
                  <button
                    type="button"
                    className="btn-auto-detect-gps"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setSelectedFuelState('Tamil Nadu');
                            setSelectedFuelCity('Chennai');
                            showToast(`📍 GPS Location verified: Lat ${pos.coords.latitude.toFixed(2)}, Lon ${pos.coords.longitude.toFixed(2)} → Chennai, TN`);
                          },
                          () => {
                            setSelectedFuelState('Tamil Nadu');
                            setSelectedFuelCity('Chennai');
                            showToast('📍 GPS Location detected: Chennai, Tamil Nadu');
                          }
                        );
                      } else {
                        setSelectedFuelState('Tamil Nadu');
                        setSelectedFuelCity('Chennai');
                        showToast('📍 Default GPS Region set: Chennai, Tamil Nadu');
                      }
                    }}
                  >
                    <i className="fa-solid fa-crosshairs"></i> Auto-Detect GPS
                  </button>
                </div>
              </div>

              {/* SEARCH & BRAND FILTER BAR */}
              <div className="fuel-search-filter-ribbon">
                <div className="fuel-search-input-box">
                  <i className="fa-solid fa-magnifying-glass search-icon"></i>
                  <input
                    type="text"
                    value={fuelLocationSearchQuery}
                    onChange={(e) => setFuelLocationSearchQuery(e.target.value)}
                    placeholder="Search by station name, area, road, or brand (e.g. Shell, IOCL, Velachery, Anna Salai)..."
                    className="fuel-search-input"
                  />
                  {fuelLocationSearchQuery && (
                    <button
                      type="button"
                      className="btn-clear-search"
                      onClick={() => setFuelLocationSearchQuery('')}
                      title="Clear search"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  )}
                </div>

                <div className="fuel-brand-filters">
                  <span className="brand-label"><i className="fa-solid fa-filter"></i> Brand:</span>
                  {[
                    { id: 'all', label: 'All Brands' },
                    { id: 'IOCL', label: 'IOCL' },
                    { id: 'BPCL', label: 'BPCL' },
                    { id: 'HPCL', label: 'HPCL' },
                    { id: 'Shell', label: 'Shell' },
                    { id: 'Tata', label: 'Tata Power' },
                    { id: 'Jio-bp', label: 'Jio-bp' },
                    { id: 'Statiq', label: 'Statiq' }
                  ].map((brand) => (
                    <button
                      key={brand.id}
                      type="button"
                      className={`brand-pill-btn ${fuelBrandFilter === brand.id ? 'active' : ''}`}
                      onClick={() => setFuelBrandFilter(brand.id)}
                    >
                      {brand.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Fuel Price Ticker Cards */}
              <div className="fuel-rates-grid">
                {/* Petrol Card */}
                <div className="fuel-rate-card petrol">
                  <div className="fuel-card-top">
                    <div className="fuel-badge-icon petrol"><i className="fa-solid fa-gas-pump"></i></div>
                    <div className="fuel-card-meta">
                      <span className="fuel-name-badge">Petrol</span>
                      <span className="fuel-location-tag">{currentPrice.city}, {currentPrice.state}</span>
                    </div>
                  </div>
                  <div className="fuel-price-val">₹{currentPrice.petrol.toFixed(2)} <span>/ Litre</span></div>
                  <div className="fuel-card-footer-info">
                    <span className="fuel-update-text"><i className="fa-regular fa-clock"></i> {currentPrice.updated}</span>
                    <span className={`fuel-trend-indicator ${currentPrice.trend || 'steady'}`}>
                      {currentPrice.petrolChange && currentPrice.petrolChange !== 0 ? (
                        <>
                          <i className={`fa-solid ${currentPrice.petrolChange > 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                          ₹{Math.abs(currentPrice.petrolChange).toFixed(2)}
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-minus"></i> Steady
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Diesel Card */}
                <div className="fuel-rate-card diesel">
                  <div className="fuel-card-top">
                    <div className="fuel-badge-icon diesel"><i className="fa-solid fa-oil-can"></i></div>
                    <div className="fuel-card-meta">
                      <span className="fuel-name-badge">Diesel</span>
                      <span className="fuel-location-tag">{currentPrice.city}, {currentPrice.state}</span>
                    </div>
                  </div>
                  <div className="fuel-price-val">₹{currentPrice.diesel.toFixed(2)} <span>/ Litre</span></div>
                  <div className="fuel-card-footer-info">
                    <span className="fuel-update-text"><i className="fa-regular fa-clock"></i> {currentPrice.updated}</span>
                    <span className={`fuel-trend-indicator ${currentPrice.trend || 'steady'}`}>
                      {currentPrice.dieselChange && currentPrice.dieselChange !== 0 ? (
                        <>
                          <i className={`fa-solid ${currentPrice.dieselChange > 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                          ₹{Math.abs(currentPrice.dieselChange).toFixed(2)}
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-minus"></i> Steady
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* CNG Card */}
                <div className="fuel-rate-card cng">
                  <div className="fuel-card-top">
                    <div className="fuel-badge-icon cng"><i className="fa-solid fa-fire-flame-simple"></i></div>
                    <div className="fuel-card-meta">
                      <span className="fuel-name-badge">Auto CNG</span>
                      <span className="fuel-location-tag">{currentPrice.city}, {currentPrice.state}</span>
                    </div>
                  </div>
                  <div className="fuel-price-val">₹{currentPrice.cng.toFixed(2)} <span>/ Kg</span></div>
                  <div className="fuel-card-footer-info">
                    <span className="fuel-update-text"><i className="fa-regular fa-clock"></i> {currentPrice.updated}</span>
                    <span className="fuel-trend-indicator clean-green">
                      <i className="fa-solid fa-leaf"></i> Eco Clean
                    </span>
                  </div>
                </div>

                {/* EV Power Card */}
                <div className="fuel-rate-card ev-energy">
                  <div className="fuel-card-top">
                    <div className="fuel-badge-icon ev"><i className="fa-solid fa-bolt"></i></div>
                    <div className="fuel-card-meta">
                      <span className="fuel-name-badge">EV DC Fast Rate</span>
                      <span className="fuel-location-tag">{currentPrice.city}, {currentPrice.state}</span>
                    </div>
                  </div>
                  <div className="fuel-price-val">₹{(currentPrice.electricUnitRate || 18.50).toFixed(2)} <span>/ kWh</span></div>
                  <div className="fuel-card-footer-info">
                    <span className="fuel-update-text"><i className="fa-solid fa-plug-circle-bolt"></i> 60kW - 150kW Ultra Fast</span>
                    <span className="fuel-trend-indicator ev-subsidized">
                      <i className="fa-solid fa-circle-check"></i> Subsidized
                    </span>
                  </div>
                </div>
              </div>

              {/* LOCATION-BASED FUEL & EV STATIONS SECTION (MATCHING USER'S SCREENSHOT & DESIGN) */}
              <div className="location-stations-container">
                <div className="stations-filter-row">
                  <div className="stations-title-block">
                    <h3>
                      <i className="fa-solid fa-map-location-dot"></i> Verified Fuel &amp; EV Stations Near {selectedFuelCity !== 'All Cities' ? selectedFuelCity : selectedFuelState}
                    </h3>
                    <span className="stations-count-pill">
                      {filteredStations.length} Stations Located
                    </span>
                  </div>

                  <div className="stations-type-pills">
                    {[
                      { id: 'all', label: 'All Stations', icon: 'fa-layer-group' },
                      { id: 'fuel', label: 'Petrol & Diesel', icon: 'fa-gas-pump' },
                      { id: 'cng', label: 'CNG Available', icon: 'fa-fire-flame-simple' },
                      { id: 'ev', label: 'EV Fast Charging', icon: 'fa-bolt' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        className={`st-filter-btn ${stationFilterCategory === f.id ? 'active' : ''}`}
                        onClick={() => setStationFilterCategory(f.id)}
                      >
                        <i className={`fa-solid ${f.icon}`}></i> {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CARD GRID MATCHING USER SCREENSHOT */}
                {filteredStations.length > 0 ? (
                  <div className="image2-stations-grid">
                    {filteredStations.map((station) => (
                      <div key={station.id} className="image2-station-card">
                        <div className="st-card-content">
                          <div className="st-card-header-line">
                            <span className="st-brand-pill">{station.brand}</span>
                            <span className="st-distance-pill"><i className="fa-solid fa-route"></i> {station.distance}</span>
                          </div>

                          <h4 className="st-card-title">{station.name}</h4>
                          <p className="st-card-address">{station.address}</p>

                          <div className="st-status-timing">
                            <span className="st-status-green">Open now</span>
                            <span className="st-timing-sep">•</span>
                            <span className="st-timing-text">{station.status || '06:00 AM - 10:00 PM'}</span>
                          </div>

                          <div className="st-phone-row">
                            <i className="fa-solid fa-phone"></i>
                            <a href={`tel:${station.phone}`} className="st-phone-link">{station.phone}</a>
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
                              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.name + ' ' + station.address)}`;
                              window.open(mapsUrl, '_blank');
                              showToast(`Navigating to ${station.name}...`);
                            }}
                          >
                            <i className="fa-solid fa-diamond-turn-right"></i>
                            <span>Get Direction</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-stations-found-card">
                    <i className="fa-solid fa-gas-pump fa-3x"></i>
                    <h4>No stations found matching your criteria</h4>
                    <p>Try clearing your search query or selecting "All Cities" or "All Brands".</p>
                    <button
                      type="button"
                      className="btn-reset-filters"
                      onClick={() => {
                        setSelectedFuelCity('All Cities');
                        setFuelLocationSearchQuery('');
                        setFuelBrandFilter('all');
                        setStationFilterCategory('all');
                      }}
                    >
                      <i className="fa-solid fa-rotate-left"></i> Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            </section>
          );
        })()}

        {/* ------------------------------------------------------------------ */}
        {/* HUB TAB 5: FINANCE & INSURANCE (USER IMAGE 3 BASED)                */}
        {/* ------------------------------------------------------------------ */}
        {/* ------------------------------------------------------------------ */}
        {/* HUB TAB 5: FINANCE & INSURANCE (MULTI-VEHICLE DYNAMIC EMI HUB)     */}
        {/* ------------------------------------------------------------------ */}
        {activeHubTab === 'finance_insurance' && (() => {
          // Get models matching active category
          const modelsInCategory = VEHICLE_EMI_CATALOG.filter(
            (m) => emiVehicleCategory === 'All' || m.category === emiVehicleCategory
          );

          // Get active model
          const activeModel = VEHICLE_EMI_CATALOG.find((m) => m.id === emiCarModel) ||
            modelsInCategory[0] ||
            VEHICLE_EMI_CATALOG[0];

          // Available brands in this category
          const availableBrands = Array.from(new Set(modelsInCategory.map((m) => m.brand)));

          // Models matching selected brand
          const modelsForBrand = modelsInCategory.filter((m) => m.brand === emiCarBrand);

          // Active variant
          const activeVariant = activeModel.variants.find((v) => v.id === emiCarVariant) ||
            activeModel.variants[0];

          // Loan and EMI math
          const totalLoanAmt = Math.max(0, emiOnRoadPrice - emiDownPayment);
          const monthlyRate = (emiInterestRate / 100) / 12;
          const totalMonths = emiLoanTenureYears * 12;
          const monthlyEmiVal = totalLoanAmt <= 0 || totalMonths <= 0
            ? 0
            : Math.round(
                (totalLoanAmt * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                (Math.pow(1 + monthlyRate, totalMonths) - 1)
              );
          const totalPayableAmt = Math.round(monthlyEmiVal * totalMonths);
          const totalInterestPayable = Math.max(0, totalPayableAmt - totalLoanAmt);

          return (
            <section className="hub-showcase-view cardekho-emi-hub-view animate-pop">
              {/* Top Breadcrumb */}
              <div className="cd-emi-breadcrumb">
                <span>{emiVehicleCategory.toUpperCase()} FINANCE</span>
                <span className="bc-sep">/</span>
                <span>{activeModel.brand.toUpperCase()}</span>
                <span className="bc-sep">/</span>
                <span className="bc-active">{activeModel.name.toUpperCase()} EMI &amp; LOAN</span>
              </div>

              {/* STEP 1: VEHICLE TYPE SELECTOR FORM HEADER */}
              <div className="emi-category-selector-ribbon">
                <span className="cat-ribbon-title">
                  <i className="fa-solid fa-shapes"></i> <strong>Step 1: Choose Vehicle Category:</strong>
                </span>
                <div className="cat-ribbon-scroll">
                  {[
                    { id: 'Car', label: 'Cars & SUVs', icon: 'fa-car-side' },
                    { id: 'Scooter', label: 'Scooters', icon: 'fa-motorcycle' },
                    { id: 'Bike', label: 'Bikes & Motorcycles', icon: 'fa-motorcycle' },
                    { id: 'EV', label: 'Electric (EV)', icon: 'fa-bolt' },
                    { id: 'Commercial', label: 'Trucks & Lorries', icon: 'fa-truck' },
                    { id: 'Auto', label: 'Auto Rickshaws', icon: 'fa-taxi' },
                    { id: 'All', label: 'All Vehicles', icon: 'fa-globe' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`emi-cat-tab-btn ${emiVehicleCategory === cat.id ? 'active' : ''}`}
                      onClick={() => {
                        setEmiVehicleCategory(cat.id);
                        const newModels = VEHICLE_EMI_CATALOG.filter(
                          (m) => cat.id === 'All' || m.category === cat.id
                        );
                        if (newModels.length > 0) {
                          const firstModel = newModels[0];
                          setEmiCarBrand(firstModel.brand);
                          setEmiCarModel(firstModel.id);
                          if (firstModel.variants.length > 0) {
                            setEmiCarVariant(firstModel.variants[0].id);
                            setEmiOnRoadPrice(firstModel.variants[0].onRoadPrice);
                            setEmiDownPayment(Math.round(firstModel.variants[0].onRoadPrice * 0.1));
                          }
                        }
                        showToast(`Switched category to ${cat.label}`);
                      }}
                    >
                      <i className={`fa-solid ${cat.icon}`}></i>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* TOP VEHICLE HERO CARD (DYNAMIC TO SELECTED MODEL & VARIANT) */}
              <div className="cd-vehicle-hero-card">
                <div className="cd-hero-left">
                  <img
                    src={activeModel.image}
                    alt={activeModel.name}
                    className="cd-hero-car-img"
                  />
                  <span className="hero-cat-tag">
                    <i className="fa-solid fa-tag"></i> {activeModel.category}
                  </span>
                </div>
                <div className="cd-hero-info">
                  <div className="cd-hero-title-row">
                    <div>
                      <h2>{activeModel.name} EMI Calculator</h2>
                      <span className="active-variant-chip">
                        <i className="fa-solid fa-code-branch"></i> Variant: <strong>{activeVariant.name}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-wish-heart"
                      title="Bookmark Vehicle"
                      onClick={() => showToast(`Saved ${activeModel.name} to favorites`)}
                    >
                      <i className="fa-regular fa-heart"></i>
                    </button>
                  </div>
                  <p className="cd-hero-desc">
                    <strong>{activeModel.name} ({activeVariant.name})</strong> monthly EMI starts at{' '}
                    <strong className="text-orange">₹{monthlyEmiVal.toLocaleString('en-IN')}</strong> per month for a tenure
                    of {emiLoanTenureYears * 12} months @ {emiInterestRate}% for a total loan amount of{' '}
                    <strong>₹{totalLoanAmt.toLocaleString('en-IN')}</strong> in {userLocationCity}.
                    Calculated on verified on-road pricing with comprehensive insurance &amp; RTO charges.
                  </p>
                  <div className="cd-hero-rating-row">
                    <span className="rating-star-tag">{activeModel.rating} <i className="fa-solid fa-star"></i></span>
                    <span className="review-count-txt">{activeModel.reviewCount} Verified Owner Reviews</span>
                    <span className="hero-spec-pill"><i className="fa-solid fa-gas-pump"></i> {activeVariant.fuel}</span>
                    <span className="hero-spec-pill"><i className="fa-solid fa-gauge"></i> {activeVariant.mileage}</span>
                  </div>
                  <div className="cd-hero-price-row">
                    <div>
                      <span className="hero-price-label">Ex-Showroom: ₹{activeVariant.exShowroom.toLocaleString('en-IN')}</span>
                      <strong className="cd-hero-price">On-Road: ₹{activeVariant.onRoadPrice.toLocaleString('en-IN')}</strong>
                    </div>
                    <span className="cd-emi-starts">EMI starts @ ₹{monthlyEmiVal.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div className="hero-cta-buttons-row">
                    <button
                      type="button"
                      className="btn-cd-orange-cta"
                      onClick={() => showToast(`Fast-track loan approval request submitted for ${activeModel.name}!`)}
                    >
                      <i className="fa-solid fa-file-invoice-dollar"></i> Apply Instant Loan (Pre-Approved)
                    </button>
                    <button
                      type="button"
                      className="btn-cd-secondary-cta"
                      onClick={() => {
                        showToast(`Free test drive booking confirmed for ${activeModel.name} in ${userLocationCity}!`);
                      }}
                    >
                      <i className="fa-solid fa-car-side"></i> Book Free Test Drive
                    </button>
                  </div>
                </div>
              </div>

              {/* 2-COLUMN MAIN CONTENT (LEFT CALCULATOR FORM + RIGHT SIDEBAR) */}
              <div className="cd-emi-layout-grid">
                {/* LEFT COLUMN: CALCULATOR, ALTERNATIVES, USED CARS, REVIEWS */}
                <div className="cd-emi-main-col">
                  {/* 1. CALCULATE YOUR LOAN EMI FORM CARD */}
                  <div className="cd-calculator-card">
                    <div className="calc-card-head-row">
                      <h3 className="cd-card-heading" style={{ margin: 0 }}>
                        <i className="fa-solid fa-sliders"></i> Customize Your Vehicle &amp; Loan Details
                      </h3>
                      <span className="city-pill-tag">
                        <i className="fa-solid fa-location-dot"></i> {userLocationCity}
                      </span>
                    </div>
                    <p className="calc-sub-text">
                      Step 2: Choose your brand, model, and specific variant to instantly compute on-road price, down payment, and monthly installment:
                    </p>

                    {/* 3 INTERACTIVE DROPDOWNS: BRAND -> MODEL -> VARIANT */}
                    <div className="cd-dropdowns-row">
                      {/* 1. BRAND SELECTOR */}
                      <div className="cd-dropdown-wrap">
                        <label className="dropdown-label"><i className="fa-solid fa-building"></i> Select Brand:</label>
                        <select
                          value={emiCarBrand}
                          onChange={(e) => {
                            const newBrand = e.target.value;
                            setEmiCarBrand(newBrand);
                            const matchingModels = modelsInCategory.filter((m) => m.brand === newBrand);
                            if (matchingModels.length > 0) {
                              const firstM = matchingModels[0];
                              setEmiCarModel(firstM.id);
                              if (firstM.variants.length > 0) {
                                setEmiCarVariant(firstM.variants[0].id);
                                setEmiOnRoadPrice(firstM.variants[0].onRoadPrice);
                                setEmiDownPayment(Math.round(firstM.variants[0].onRoadPrice * 0.1));
                              }
                            }
                          }}
                        >
                          {availableBrands.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                        <i className="fa-solid fa-chevron-down dd-arrow"></i>
                      </div>

                      {/* 2. MODEL SELECTOR */}
                      <div className="cd-dropdown-wrap">
                        <label className="dropdown-label"><i className="fa-solid fa-car"></i> Select Model:</label>
                        <select
                          value={emiCarModel}
                          onChange={(e) => {
                            const newModelId = e.target.value;
                            setEmiCarModel(newModelId);
                            const selectedM = VEHICLE_EMI_CATALOG.find((m) => m.id === newModelId);
                            if (selectedM && selectedM.variants.length > 0) {
                              setEmiCarVariant(selectedM.variants[0].id);
                              setEmiOnRoadPrice(selectedM.variants[0].onRoadPrice);
                              setEmiDownPayment(Math.round(selectedM.variants[0].onRoadPrice * 0.1));
                            }
                          }}
                        >
                          {modelsForBrand.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                        <i className="fa-solid fa-chevron-down dd-arrow"></i>
                      </div>

                      {/* 3. VARIANT SELECTOR */}
                      <div className="cd-dropdown-wrap">
                        <label className="dropdown-label"><i className="fa-solid fa-layer-group"></i> Select Variant:</label>
                        <select
                          value={emiCarVariant}
                          onChange={(e) => {
                            const newVariantId = e.target.value;
                            setEmiCarVariant(newVariantId);
                            const foundVar = activeModel.variants.find((v) => v.id === newVariantId);
                            if (foundVar) {
                              setEmiOnRoadPrice(foundVar.onRoadPrice);
                              setEmiDownPayment(Math.round(foundVar.onRoadPrice * 0.1));
                            }
                          }}
                        >
                          {activeModel.variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name} (₹{(v.onRoadPrice / 100000).toFixed(2)} Lakh)
                            </option>
                          ))}
                        </select>
                        <i className="fa-solid fa-chevron-down dd-arrow"></i>
                      </div>
                    </div>

                    {/* On-Road Price in City & Variant Quick Specs */}
                    <div className="cd-price-line">
                      <div className="price-details-cell">
                        <span className="price-lbl">On-Road Price in {userLocationCity}</span>
                        <small className="price-sub-note">Includes Road Tax, Insurance &amp; Fastag</small>
                      </div>
                      <div className="price-values-box">
                        <span className="ex-price-small">Ex-Showroom: ₹{activeVariant.exShowroom.toLocaleString('en-IN')}</span>
                        <strong className="price-val">₹{emiOnRoadPrice.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    {/* Down Payment Slider */}
                    <div className="cd-slider-block">
                      <div className="slider-label-line">
                        <span>Down Payment Amount</span>
                        <strong>₹{emiDownPayment.toLocaleString('en-IN')} ({Math.round((emiDownPayment / emiOnRoadPrice) * 100)}%)</strong>
                      </div>
                      <input
                        type="range"
                        min={Math.round(emiOnRoadPrice * 0.05)}
                        max={Math.round(emiOnRoadPrice * 0.8)}
                        step={5000}
                        value={emiDownPayment}
                        onChange={(e) => setEmiDownPayment(Number(e.target.value))}
                        className="cd-range-slider"
                      />
                      <div className="slider-minmax-hints">
                        <span>Min (5%): ₹{Math.round(emiOnRoadPrice * 0.05).toLocaleString('en-IN')}</span>
                        <span>Max (80%): ₹{Math.round(emiOnRoadPrice * 0.8).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Bank Interest Rate Slider */}
                    <div className="cd-slider-block">
                      <div className="slider-label-line">
                        <span>Annual Bank Interest Rate</span>
                        <strong>{emiInterestRate}% p.a.</strong>
                      </div>
                      <input
                        type="range"
                        min={7.5}
                        max={16.0}
                        step={0.1}
                        value={emiInterestRate}
                        onChange={(e) => setEmiInterestRate(Number(e.target.value))}
                        className="cd-range-slider"
                      />
                      <div className="slider-minmax-hints">
                        <span>Lowest: 7.5% (PSU Banks)</span>
                        <span>Standard: 9.8%</span>
                        <span>Max: 16.0% (NBFCs)</span>
                      </div>
                    </div>

                    {/* Loan Period (Years) segmented buttons */}
                    <div className="cd-period-block">
                      <span className="period-lbl">Loan Tenure Period: <strong>{emiLoanTenureYears} Years ({emiLoanTenureYears * 12} Months)</strong></span>
                      <div className="cd-year-buttons">
                        {[1, 2, 3, 4, 5, 6, 7].map((yr) => (
                          <button
                            key={yr}
                            type="button"
                            className={`yr-btn ${emiLoanTenureYears === yr ? 'active' : ''}`}
                            onClick={() => setEmiLoanTenureYears(yr)}
                          >
                            {yr} {yr === 1 ? 'Year' : 'Yrs'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Financial Metrics Split Display */}
                    <div className="cd-calc-summary-split">
                      <div className="summary-left">
                        <div className="sum-item">
                          <span>Total Loan Amount Financed</span>
                          <strong className="text-blue">₹{totalLoanAmt.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="sum-item">
                          <span>Total Interest Payable</span>
                          <strong className="text-amber">₹{totalInterestPayable.toLocaleString('en-IN')}</strong>
                        </div>
                        <div className="sum-item">
                          <span>Total Amount Payable (Principal + Interest)</span>
                          <strong className="text-slate">₹{totalPayableAmt.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                      <div className="summary-right">
                        <div className="emi-big-display">
                          <div className="emi-label-sub">
                            <span>Monthly EMI</span>
                            <small>per month</small>
                          </div>
                          <h2 className="emi-amount-val">
                            ₹{monthlyEmiVal.toLocaleString('en-IN')}
                          </h2>
                        </div>
                        <span className="calc-interest-hint">
                          Calculated for {activeVariant.name}
                        </span>
                      </div>
                    </div>

                    <div className="calc-action-buttons-grid">
                      <button
                        type="button"
                        className="btn-cd-orange-block"
                        onClick={() => showToast(`Comparing 14 bank loan schemes for ${activeModel.name} in ${userLocationCity}...`)}
                      >
                        <i className="fa-solid fa-building-columns"></i> Get Best EMI Offers from 14 Partner Banks
                      </button>
                      <button
                        type="button"
                        className="btn-cd-insurance-block"
                        onClick={() => showToast(`Instant 0-Dep insurance quote for ${activeModel.name} generated: ₹${Math.round(activeVariant.onRoadPrice * 0.032).toLocaleString('en-IN')}/year`)}
                      >
                        <i className="fa-solid fa-shield-halved"></i> Compare 0-Depreciation Insurance Plans
                      </button>
                    </div>
                  </div>

                  {/* 2. FIND EMI OF MODEL ALTERNATIVES */}
                  <div className="cd-section-card">
                    <h3 className="cd-card-heading">Find EMI of {activeModel.name} Alternatives</h3>
                    <div className="cd-alternatives-grid">
                      {activeModel.alternatives.map((alt) => (
                        <div key={alt.name} className="cd-alt-card">
                          <div className="alt-img-box">
                            <img src={alt.img} alt={alt.name} />
                          </div>
                          <h4 className="alt-name">{alt.name}</h4>
                          <span className="alt-price">{alt.price}</span>
                          <button
                            type="button"
                            className="btn-alt-emi-orange"
                            onClick={() => {
                              const found = VEHICLE_EMI_CATALOG.find(
                                (m) => m.name.toLowerCase().includes(alt.name.toLowerCase()) ||
                                       alt.name.toLowerCase().includes(m.name.toLowerCase())
                              );
                              if (found) {
                                setEmiCarBrand(found.brand);
                                setEmiCarModel(found.id);
                                if (found.variants.length > 0) {
                                  setEmiCarVariant(found.variants[0].id);
                                  setEmiOnRoadPrice(found.variants[0].onRoadPrice);
                                  setEmiDownPayment(Math.round(found.variants[0].onRoadPrice * 0.1));
                                }
                                showToast(`Loaded EMI calculator for ${found.name}!`);
                              } else {
                                showToast(`Calculating comparative EMI for ${alt.name}...`);
                              }
                            }}
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
                            {activeModel.name} vs {alt.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. USER REVIEWS FOR SELECTED MODEL */}
                  <div className="cd-section-card">
                    <div className="reviews-card-head">
                      <div>
                        <h3 className="cd-card-heading" style={{ margin: 0 }}>
                          {activeModel.name} Verified User Reviews
                        </h3>
                        <div className="rev-stars-row">
                          <span className="rev-score">{activeModel.rating} <i className="fa-solid fa-star"></i></span>
                          <span className="rev-sub-count">Based on {activeModel.reviewCount} User Ratings</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-write-review-orange"
                        onClick={() => showToast(`Review submission dialog opened for ${activeModel.name}!`)}
                      >
                        Write a Review &amp; Win ₹1000
                      </button>
                    </div>

                    {/* Review Filter Pills */}
                    <div className="cd-review-pills-row">
                      {['All Reviews', 'Performance', 'Comfort', 'Mileage & Range', 'Maintenance', 'Safety'].map((p) => (
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
                        { author: 'Debinder Singh', date: 'Yesterday', rating: 4.8, title: `Outstanding value and performance`, text: `Purchased the ${activeVariant.name} recently. The throttle response and fuel economy have been spot on. Highly impressed with the build quality and service assistance in ${userLocationCity}.` },
                        { author: 'Sasidharan K.', date: '3 days ago', rating: 5.0, title: 'Superb comfort on long highway runs', text: `Very comfortable driving ergonomics and confidence inspiring brakes. The monthly EMI is affordable with SART low-interest partner banks. 5 stars from my side!` }
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
                  </div>

                  {/* 4. FREQUENTLY ASKED QUESTIONS */}
                  <div className="cd-section-card">
                    <h3 className="cd-card-heading">Frequently Asked Questions On {activeModel.name} EMI</h3>
                    <div className="cd-faq-list">
                      <div className="cd-faq-item">
                        <strong>Q: What is the lowest EMI for {activeModel.name} in {userLocationCity}?</strong>
                        <p>A: The lowest EMI starts at ₹{monthlyEmiVal.toLocaleString('en-IN')}/month for {activeVariant.name} with a tenure of {emiLoanTenureYears} years and 10% down payment.</p>
                      </div>
                      <div className="cd-faq-item">
                        <strong>Q: What documents are required for car or bike loan approval?</strong>
                        <p>A: PAN Card, Aadhaar Card, 6 months bank statement, 3 months salary slips or ITR (for self-employed), and electricity or address proof.</p>
                      </div>
                      <div className="cd-faq-item">
                        <strong>Q: Can I get zero down payment loan on {activeModel.name}?</strong>
                        <p>A: Selected partner banks (HDFC, SBI, ICICI) offer 100% on-road financing for eligible salaried professionals with a CIBIL score of 750+.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDEBAR COLUMN */}
                <div className="cd-emi-sidebar-col">
                  {/* 1. RUNNING COST OF YOUR VEHICLE */}
                  <div className="cd-sidebar-widget">
                    <h4 className="sidebar-widget-title">Estimated Running Cost</h4>
                    <div className="km-driven-block">
                      <div className="km-header-line">
                        <span>Daily usage</span>
                        <strong>{emiDailyKm} km/day</strong>
                      </div>
                      <div className="km-buttons-row">
                        {[15, 25, 40, 60, 100].map((k) => (
                          <button
                            key={k}
                            type="button"
                            className={`km-btn ${emiDailyKm === k ? 'active' : ''}`}
                            onClick={() => setEmiDailyKm(k)}
                          >
                            {k} km
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="monthly-fuel-cost-box">
                      <span className="mfc-lbl">Monthly fuel / electricity cost</span>
                      <h3 className="mfc-val">
                        ₹{(() => {
                          const isEv = activeVariant.fuel.toLowerCase().includes('electric');
                          const monthlyKm = emiDailyKm * 30;
                          if (isEv) {
                            return Math.round((monthlyKm / 8) * 8).toLocaleString('en-IN');
                          }
                          const ratePerLiter = 102;
                          const mileageNum = parseFloat(activeVariant.mileage) || 16;
                          return Math.round((monthlyKm / mileageNum) * ratePerLiter).toLocaleString('en-IN');
                        })()}* <span>/ month</span>
                      </h3>
                      <small className="mfc-disclaimer">
                        Estimated on {activeVariant.mileage} test-cycle rating for {activeVariant.name} in {userLocationCity}.
                      </small>
                    </div>
                  </div>

                  {/* 2. POPULAR MODELS IN SAME CATEGORY */}
                  <div className="cd-sidebar-widget">
                    <h4 className="sidebar-widget-title">Other Popular {activeModel.category}s</h4>
                    <div className="cd-popular-cars-list">
                      {VEHICLE_EMI_CATALOG.filter((m) => m.id !== activeModel.id).slice(0, 5).map((c) => (
                        <div
                          key={c.id}
                          className="sidebar-car-row"
                          onClick={() => {
                            setEmiVehicleCategory(c.category);
                            setEmiCarBrand(c.brand);
                            setEmiCarModel(c.id);
                            if (c.variants.length > 0) {
                              setEmiCarVariant(c.variants[0].id);
                              setEmiOnRoadPrice(c.variants[0].onRoadPrice);
                              setEmiDownPayment(Math.round(c.variants[0].onRoadPrice * 0.1));
                            }
                            showToast(`Switched EMI view to ${c.name}`);
                          }}
                        >
                          <img src={c.image} alt={c.name} className="sidebar-car-thumb" />
                          <div className="sidebar-car-info">
                            <h5>{c.name}</h5>
                            <span>{c.priceRange}</span>
                            <small className="sidebar-cat-badge">{c.category}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. PROMOTIONAL LOAN FESTIVAL CARD */}
                  <div className="cd-promo-ad-card festive-loan-card">
                    <div className="ad-badge">FESTIVE LOAN MELA</div>
                    <h4>7.5% P.A. SPECIAL INTEREST</h4>
                    <p>Zero processing fees • Instant digital sanction in 30 mins • Pre-approved loan vouchers</p>
                    <button
                      type="button"
                      className="btn-ad-book"
                      onClick={() => showToast('Claimed 0% processing fee voucher for loan application!')}
                    >
                      Claim Festive Offer
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}


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

      {/* CarBike360 On-Road Price Breakdown Modal */}
      {onRoadPriceModalVehicle && (
        <Carbike360OnRoadPriceModal
          vehicle={onRoadPriceModalVehicle}
          userLocationCity={userLocationCity}
          onClose={() => setOnRoadPriceModalVehicle(null)}
          showToast={showToast}
        />
      )}
    </section>
  );
}