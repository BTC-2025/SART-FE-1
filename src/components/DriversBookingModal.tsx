// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { useSartStore } from '@/store/useSartStore';

// Vehicle Categories with verified license badges & documents
export interface DriverVehicleCategory {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  licenseRequired: string;
  domain: 'ROAD' | 'SEA' | 'AIR' | 'RAIL';
  suitableModels: string[];
  driverLicenseNumber: string;
  driverBadgeNumber: string;
  experience: string;
  sampleDriver: {
    name: string;
    avatar: string;
    rating: number;
    trips: number;
    policeVerified: boolean;
    languages: string[];
    licenseDocUrl: string;
    aadhaarDocUrl: string;
    policeClearanceUrl: string;
  };
}

export const DRIVER_VEHICLE_CATEGORIES: DriverVehicleCategory[] = [
  // 1. Two & Three Wheelers
  {
    id: 'bike',
    name: 'Bike / Scooter Rider',
    subtitle: 'Motorcycle & Gearless Scooter (MCWG / MCWOG)',
    icon: 'fa-motorcycle',
    color: '#059669',
    domain: 'ROAD',
    licenseRequired: 'DL Class: MCWG (Motorcycle with Gear) / Commercial Badge',
    suitableModels: ['Hero Splendor', 'Honda Activa 6G', 'Royal Enfield Classic 350', 'TVS Jupiter 125', 'Bajaj Pulsar 150', 'Any 2-Wheeler'],
    driverLicenseNumber: 'DL-042019-MCWG-89312',
    driverBadgeNumber: 'TR-2W-PILOT-8821',
    experience: '5+ years safe riding',
    sampleDriver: {
      name: 'Karthik Raja',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      rating: 4.9,
      trips: 2340,
      policeVerified: true,
      languages: ['English', 'Hindi', 'Tamil'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'auto',
    name: 'Auto-Rickshaw Driver',
    subtitle: 'Three-Wheeler Commercial (3W-CAB / PSV)',
    icon: 'fa-taxi',
    color: '#d97706',
    domain: 'ROAD',
    licenseRequired: 'DL Class: 3W-CAB & City PSV Badge Endorsed',
    suitableModels: ['Bajaj RE Auto', 'Piaggio Ape City', 'Mahindra Treo Electric', 'TVS King Deluxe'],
    driverLicenseNumber: 'DL-092015-3WCAB-33912',
    driverBadgeNumber: 'PSV-AUTO-CITY-1048',
    experience: '7+ years city streets specialist',
    sampleDriver: {
      name: 'Murugan S.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.85,
      trips: 4120,
      policeVerified: true,
      languages: ['Tamil', 'Telugu', 'Hindi'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'delivery',
    name: 'Delivery / Courier Rider',
    subtitle: 'Hyper-Local Delivery & Cargo Two-Wheeler',
    icon: 'fa-box',
    color: '#ec4899',
    domain: 'ROAD',
    licenseRequired: 'DL Class: MCWG Commercial Courier Endorsement',
    suitableModels: ['Electric Delivery Scooters', 'Hero Electric NYX', 'Cargo Two-Wheelers', 'Standard Delivery Motorcycle'],
    driverLicenseNumber: 'DL-052021-MCW-44102',
    driverBadgeNumber: 'COURIER-DEL-9912',
    experience: '4+ years hyper-local parcel dispatch',
    sampleDriver: {
      name: 'Anand Kumar',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      rating: 4.88,
      trips: 4120,
      policeVerified: true,
      languages: ['English', 'Tamil', 'Hindi'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },

  // 2. Cars, Sedans, SUVs & Hospitality
  {
    id: 'car',
    name: 'Personal Car Chauffeur',
    subtitle: 'Top Rated Daily Drive (LMV-NT & LMV-TR)',
    icon: 'fa-car-side',
    color: '#0284c7',
    domain: 'ROAD',
    licenseRequired: 'DL Class: LMV (Light Motor Vehicle - Manual & Automatic)',
    suitableModels: ['Maruti Suzuki Swift / Dzire', 'Hyundai i20 / Verna', 'Honda City', 'Tata Nexon', 'Skoda Slavia', 'Any Manual/Auto Car'],
    driverLicenseNumber: 'DL-072016-LMV-55104',
    driverBadgeNumber: 'TR-CAB-LMV-9932',
    experience: '9+ years highway & city drive',
    sampleDriver: {
      name: 'Ramesh Krishnan',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 4.95,
      trips: 3420,
      policeVerified: true,
      languages: ['English', 'Tamil', 'Hindi', 'Kannada'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'suv',
    name: 'SUV / MUV Driver',
    subtitle: 'Heavy Terrain, Ghat Roads & Highway Specialist',
    icon: 'fa-car',
    color: '#6366f1',
    domain: 'ROAD',
    licenseRequired: 'DL Class: LMV-TR & Heavy SUV Endorsement',
    suitableModels: ['Toyota Innova Crysta / Hycross', 'Mahindra Scorpio-N / XUV700', 'Hyundai Creta', 'Tata Harrier', 'Toyota Fortuner', 'MG Hector'],
    driverLicenseNumber: 'DL-032014-LMVTR-88120',
    driverBadgeNumber: 'SUV-GHAT-PILOT-5519',
    experience: '11+ years ghat roads & high terrain',
    sampleDriver: {
      name: 'Suresh Varma',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      rating: 4.93,
      trips: 2850,
      policeVerified: true,
      languages: ['English', 'Telugu', 'Hindi'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'luxury',
    name: 'Luxury Chauffeur (Uniformed)',
    subtitle: 'VIP White Glove Protocol & High-End Luxury Cars',
    icon: 'fa-user-tie',
    color: '#8b5cf6',
    domain: 'ROAD',
    licenseRequired: 'DL Class: LMV-TR / Executive Protocol Certified',
    suitableModels: ['Mercedes-Benz E/S Class', 'BMW 5/7 Series', 'Audi A6/Q7', 'Range Rover Velar', 'Volvo XC90', 'Lexus ES300h'],
    driverLicenseNumber: 'DL-012011-VIP-77102',
    driverBadgeNumber: 'VIP-WHITE-GLOVE-007',
    experience: '12+ years luxury diplomatic drive',
    sampleDriver: {
      name: 'Rajesh Balan',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      rating: 4.98,
      trips: 1980,
      policeVerified: true,
      languages: ['English', 'German', 'Tamil', 'Hindi'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'valet',
    name: 'Event Valet Driver',
    subtitle: 'Speed Parking Certified for Events & Hotels',
    icon: 'fa-key',
    color: '#0d9488',
    domain: 'ROAD',
    licenseRequired: 'DL Class: LMV (Automatic & Manual Transmission Expert)',
    suitableModels: ['All Automatic & Manual Cars', 'Luxury Coupes', 'SUVs', 'Sports Cars', 'Vintage Classics'],
    driverLicenseNumber: 'DL-092017-VALET-66190',
    driverBadgeNumber: 'SPEED-VALET-EVENT-4421',
    experience: '6+ years hospitality valet',
    sampleDriver: {
      name: 'Praveen Chandran',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      rating: 4.89,
      trips: 2120,
      policeVerified: true,
      languages: ['English', 'Tamil'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },

  // 3. Commercial Freight & Heavy Vehicles
  {
    id: 'minitruck',
    name: 'Mini-Truck / LCV Driver',
    subtitle: 'Intra-City Logistics & Express Warehouse Drops',
    icon: 'fa-truck-pickup',
    color: '#f97316',
    domain: 'ROAD',
    licenseRequired: 'DL Class: LMV-Commercial / LCV Badge',
    suitableModels: ['Tata Ace Gold (Chota Hathi)', 'Mahindra Bolero Maxi Truck', 'Ashok Leyland Dost', 'Force Shaktiman'],
    driverLicenseNumber: 'DL-082015-LCV-33109',
    driverBadgeNumber: 'INTRA-LOGISTICS-7781',
    experience: '8+ years intra-city commercial goods',
    sampleDriver: {
      name: 'Venkatesh Babu',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      rating: 4.91,
      trips: 3120,
      policeVerified: true,
      languages: ['Tamil', 'Kannada', 'Hindi'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'truck',
    name: 'Heavy Truck Driver (HGV)',
    subtitle: 'National Permit Master (Heavy Commercial Goods)',
    icon: 'fa-truck-front',
    color: '#ea580c',
    domain: 'ROAD',
    licenseRequired: 'DL Class: HGV / TRANS (All-India Heavy Goods Permit)',
    suitableModels: ['Tata Prima 2830.K', 'Ashok Leyland 3520 (10-Wheeler)', 'Eicher Pro 6028', 'BharatBenz 2823C'],
    driverLicenseNumber: 'DL-022010-HGV-99812',
    driverBadgeNumber: 'TRANS-HGV-NATIONAL-7721',
    experience: '14+ years national cargo routes',
    sampleDriver: {
      name: 'Gurpreet Singh',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      rating: 4.92,
      trips: 2150,
      policeVerified: true,
      languages: ['Hindi', 'Punjabi', 'English'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'trailer',
    name: 'Trailer / Multi-Axle Driver',
    subtitle: 'Heavy Articulated Specialist & ODC Cargo Hauler',
    icon: 'fa-truck-moving',
    color: '#dc2626',
    domain: 'ROAD',
    licenseRequired: 'DL Class: Heavy Articulated (HA) / Trailer Endorsement',
    suitableModels: ['40ft Semi-Trailers', 'Multi-Axle Container Haulers', 'Scania G500 Puller', 'Volvo FH16 Tractor', 'Low-Bed Machinery Carriers'],
    driverLicenseNumber: 'DL-102008-HA-88192',
    driverBadgeNumber: 'ARTICULATED-ODC-9910',
    experience: '16+ years port container & ODC routes',
    sampleDriver: {
      name: 'Balwinder Dhillon',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      rating: 4.96,
      trips: 1680,
      policeVerified: true,
      languages: ['Punjabi', 'Hindi', 'English'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'bus',
    name: 'Commercial Bus Driver',
    subtitle: 'PSV Badge Certified Coach Captain',
    icon: 'fa-bus',
    color: '#6366f1',
    domain: 'ROAD',
    licenseRequired: 'DL Class: TRANS / HPV + PSV Coach Passenger Badge',
    suitableModels: ['Volvo 9600 Multi-Axle Sleeper', 'Force Tempo Traveller (12-24 Seater)', 'Ashok Leyland Viking Coach', 'Scania Metrolink'],
    driverLicenseNumber: 'DL-112012-TRANS-77218',
    driverBadgeNumber: 'PSV-COACH-NATIONAL-4412',
    experience: '12+ years outstation interstate bus',
    sampleDriver: {
      name: 'Manickam Pillai',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      rating: 4.9,
      trips: 1890,
      policeVerified: true,
      languages: ['English', 'Tamil', 'Malayalam', 'Hindi'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'ambulance',
    name: 'Ambulance Driver',
    subtitle: 'Emergency Response Certified (EMT / First Aid Protocol)',
    icon: 'fa-truck-medical',
    color: '#e11d48',
    domain: 'ROAD',
    licenseRequired: 'DL Class: LMV-TR / PSV Ambulance & Green Corridor Certified',
    suitableModels: ['Force Traveller ICU Ambulance', 'Tata Winger Critical Care', 'Mahindra Bolero Neo Ambulance'],
    driverLicenseNumber: 'DL-062016-AMB-11982',
    driverBadgeNumber: 'EMT-EMERGENCY-LIFE-911',
    experience: '9+ years emergency green corridor',
    sampleDriver: {
      name: 'Dr. (EMT) Vinoth Raj',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      rating: 4.97,
      trips: 1450,
      policeVerified: true,
      languages: ['English', 'Tamil', 'Hindi'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'tractor',
    name: 'Tractor / Farm Driver',
    subtitle: 'Farm Implements Master & Heavy Earthwork Operator',
    icon: 'fa-tractor',
    color: '#65a30d',
    domain: 'ROAD',
    licenseRequired: 'DL Class: TRACTOR / Agricultural Heavy Implements Endorsement',
    suitableModels: ['Mahindra 575 DI', 'John Deere 5310 4WD', 'Swaraj 855 FE', 'Tafe Massey Ferguson', 'JCB Rotavator & Trolley'],
    driverLicenseNumber: 'DL-082014-TRAC-66120',
    driverBadgeNumber: 'AGRI-FARM-MASTER-3329',
    experience: '8+ years farm machinery operations',
    sampleDriver: {
      name: 'Chinnasamy G.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      rating: 4.88,
      trips: 1350,
      policeVerified: true,
      languages: ['Tamil', 'Telugu'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },

  // 4. Sea & Marine Navigation
  {
    id: 'speedboat',
    name: 'Speedboat Pilot',
    subtitle: 'Inland Waterways Certified High-Speed Coastal Master',
    icon: 'fa-ship',
    color: '#0284c7',
    domain: 'SEA',
    licenseRequired: 'Certificate of Competency (CoC) Inland Vessels Pilot',
    suitableModels: ['Bayliner Element Speedboat (6-8 Seater)', 'Yamaha 252S Jet Boat', 'Boston Whaler Outrage', 'Twin Yamaha 250HP Engines'],
    driverLicenseNumber: 'IV-PILOT-SPEED-33912',
    driverBadgeNumber: 'MAR-SPEED-INLAND-8812',
    experience: '7+ years coastal speedcraft operations',
    sampleDriver: {
      name: 'Capt. Jude Fernandez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      rating: 4.93,
      trips: 840,
      policeVerified: true,
      languages: ['English', 'Konkani', 'Hindi'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'yacht',
    name: 'Private Yacht Captain',
    subtitle: 'Master Mariner STCW-95 Luxury Superyacht Captain',
    icon: 'fa-anchor',
    color: '#0369a1',
    domain: 'SEA',
    licenseRequired: 'STCW-95 Master 200GT / 500GT Yacht Master Certificate',
    suitableModels: ['Azimut 55 Luxury Flybridge', 'Sunseeker Manhattan 68', 'Beneteau Oceanis 46.1', 'Ferretti 780 Superyacht'],
    driverLicenseNumber: 'STCW-MASTER-YACHT-00441',
    driverBadgeNumber: 'YACHT-CAPTAIN-VIP-1102',
    experience: '15+ years offshore luxury yachting',
    sampleDriver: {
      name: 'Capt. Neil D’Souza',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.97,
      trips: 520,
      policeVerified: true,
      languages: ['English', 'French', 'Portuguese'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'ferry',
    name: 'Ferry Master',
    subtitle: 'Ro-Ro & Passenger Vessel Certified Master',
    icon: 'fa-ferry',
    color: '#4f46e5',
    domain: 'SEA',
    licenseRequired: 'DG Shipping Master 1st Class / Ro-Ro Passenger Endorsement',
    suitableModels: ['Catamaran Passenger Ferry', 'Ro-Ro Vehicle Ferry', 'River Cruiser Houseboat', 'Harbour Launch Vessel'],
    driverLicenseNumber: 'DGS-MASTER-FERRY-9910',
    driverBadgeNumber: 'RORO-FERRY-MASTER-3312',
    experience: '13+ years harbour & passenger ferries',
    sampleDriver: {
      name: 'Capt. Thomas Mathew',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 4.89,
      trips: 980,
      policeVerified: true,
      languages: ['English', 'Malayalam', 'Tamil'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },

  // 5. Air & Aviation
  {
    id: 'heli',
    name: 'Helicopter Pilot',
    subtitle: 'DGCA CHPL Certified Commercial Helicopter Pilot',
    icon: 'fa-helicopter',
    color: '#059669',
    domain: 'AIR',
    licenseRequired: 'DGCA Commercial Helicopter Pilot License (CHPL)',
    suitableModels: ['Bell 407 Helo', 'Airbus H125 / H130', 'Robinson R44 / R66', 'AgustaWestland AW109'],
    driverLicenseNumber: 'DGCA-CHPL-ROTOR-55102',
    driverBadgeNumber: 'HELI-COMMAND-PILOT-8831',
    experience: '10+ years off-shore & VIP heli charter',
    sampleDriver: {
      name: 'Wg Cdr (Retd) K. Swaminathan',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      rating: 4.99,
      trips: 1120,
      policeVerified: true,
      languages: ['English', 'Hindi', 'Tamil'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'jet',
    name: 'Private Jet Captain',
    subtitle: 'DGCA ATPL Type-Rated Executive Jet Captain',
    icon: 'fa-plane-up',
    color: '#0284c7',
    domain: 'AIR',
    licenseRequired: 'DGCA Airline Transport Pilot License (ATPL - Aeroplanes)',
    suitableModels: ['Bombardier Challenger 350', 'Cessna Citation XLS', 'Gulfstream G650', 'Dassault Falcon 2000'],
    driverLicenseNumber: 'DGCA-ATPL-AERO-00389',
    driverBadgeNumber: 'JET-COMMANDER-VIP-001',
    experience: '17+ years VIP trans-continental flights',
    sampleDriver: {
      name: 'Capt. Aditya Malhotra',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.99,
      trips: 760,
      policeVerified: true,
      languages: ['English', 'Hindi', 'French'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'drone',
    name: 'Commercial Drone Operator',
    subtitle: 'DGCA Remote Pilot (RPC) Heavy Industrial Operations',
    icon: 'fa-crosshairs',
    color: '#8b5cf6',
    domain: 'AIR',
    licenseRequired: 'DGCA Remote Pilot Certificate (RPC - Medium/Large UAV Category)',
    suitableModels: ['DJI FlyCart 30 Cargo Drone', 'IdeaForge Switch UAV', 'DJI Agras T40 Sprayer', 'Skydio X2 Commercial'],
    driverLicenseNumber: 'DGCA-RPC-MEDIUM-88210',
    driverBadgeNumber: 'DRONE-PILOT-UAV-4491',
    experience: '6+ years LiDAR mapping & heavy aerial delivery',
    sampleDriver: {
      name: 'Naveen Bharadwaj',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      rating: 4.92,
      trips: 1840,
      policeVerified: true,
      languages: ['English', 'Hindi', 'Kannada'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },

  // 6. Rail & Urban Transit
  {
    id: 'loco',
    name: 'Locomotive Engineer',
    subtitle: 'Class-1 Loco Pilot Heavy Freight & Shunting Yards',
    icon: 'fa-train',
    color: '#ea580c',
    domain: 'RAIL',
    licenseRequired: 'Indian Railways Class-1 Loco Pilot Endorsement / Industrial Siding',
    suitableModels: ['WAG-9 Heavy Electric Locomotive', 'WDP-4D Diesel Loco', 'BHEL Yard Shunting Engine', 'Industrial Rail Siding Tractor'],
    driverLicenseNumber: 'IR-LOCO-CLASS1-77821',
    driverBadgeNumber: 'PILOT-FREIGHT-LOCO-009',
    experience: '18+ years heavy freight siding & shunting',
    sampleDriver: {
      name: 'Harish Chandra Verma',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 4.94,
      trips: 1290,
      policeVerified: true,
      languages: ['Hindi', 'English'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  },
  {
    id: 'tram',
    name: 'Tram Operator',
    subtitle: 'Urban Light Rail Master & Rapid Transit Operator',
    icon: 'fa-train-subway',
    color: '#10b981',
    domain: 'RAIL',
    licenseRequired: 'Urban Light Rail Transit (LRT) Master License',
    suitableModels: ['Alstom Citadis Modern Tram', 'Urban Light Metro Rail (2-4 Car)', 'Heritage Street Tram Car'],
    driverLicenseNumber: 'LRT-TRAM-MASTER-33109',
    driverBadgeNumber: 'URBAN-TRAM-OPERATOR-102',
    experience: '11+ years street light rail & rapid transit',
    sampleDriver: {
      name: 'Debabrata Mukherjee',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      rating: 4.91,
      trips: 920,
      policeVerified: true,
      languages: ['Bengali', 'Hindi', 'English'],
      licenseDocUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
      aadhaarDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
      policeClearanceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400'
    }
  }
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

interface DriversBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DriversBookingModal({ isOpen, onClose }: DriversBookingModalProps) {
  const { setActiveTab } = useSartStore();

  // Selected driver vehicle category (All 21 roles)
  const [selectedVehicleCategoryId, setSelectedVehicleCategoryId] = useState<string>('car');
  const [selectedVehicleModel, setSelectedVehicleModel] = useState<string>('Maruti Suzuki Swift / Dzire');

  // Filter tabs for the 21 roles (All, Road, Sea, Air, Rail)
  const [domainFilter, setDomainFilter] = useState<'ALL' | 'ROAD' | 'SEA' | 'AIR' | 'RAIL'>('ALL');
  const [searchRoleQuery, setSearchRoleQuery] = useState('');

  // Service Type
  const [serviceType, setServiceType] = useState<typeof SERVICE_TYPE_OPTIONS[number]['id']>('round_trip_outstation');

  // Form Inputs (Matches First User Image)
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [requiredHours, setRequiredHours] = useState('Select hours');
  const [foodProvided, setFoodProvided] = useState<'Yes' | 'No'>('Yes');
  const [tripDate, setTripDate] = useState('');
  const [tripTime, setTripTime] = useState('');

  // 4-Digit OTP Verification Workflow
  const [driverOtp, setDriverOtp] = useState('4821');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Booking Flow Steps:
  // 'form' -> user fills trip details
  // 'confirmed' -> driver assigned, shows driver profile, 4-digit OTP prompt, and verified license proofs
  const [bookingStage, setBookingStage] = useState<'form' | 'confirmed'>('form');
  const [bookingRefId, setBookingRefId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProofTab, setActiveProofTab] = useState<'license' | 'badge' | 'aadhaar' | 'police'>('license');

  const filteredCategories = DRIVER_VEHICLE_CATEGORIES.filter((cat) => {
    const matchesDomain = domainFilter === 'ALL' || cat.domain === domainFilter;
    const matchesSearch =
      cat.name.toLowerCase().includes(searchRoleQuery.toLowerCase()) ||
      cat.subtitle.toLowerCase().includes(searchRoleQuery.toLowerCase()) ||
      cat.licenseRequired.toLowerCase().includes(searchRoleQuery.toLowerCase()) ||
      cat.suitableModels.some((m) => m.toLowerCase().includes(searchRoleQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  const currentCategory =
    DRIVER_VEHICLE_CATEGORIES.find((c) => c.id === selectedVehicleCategoryId) || DRIVER_VEHICLE_CATEGORIES[3];

  // Update default vehicle model when category changes
  useEffect(() => {
    if (currentCategory && currentCategory.suitableModels.length > 0) {
      setSelectedVehicleModel(currentCategory.suitableModels[0]);
    }
  }, [selectedVehicleCategoryId]);

  if (!isOpen) return null;

  const handleClose = () => {
    setBookingStage('form');
    setIsOtpVerified(false);
    setEnteredOtp('');
    setOtpError('');
    setActiveTab('home');
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLocation.trim()) {
      alert('Please enter your pickup location.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newRef = `SART-DRV-${Math.floor(100000 + Math.random() * 900000)}`;
      const randomOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingRefId(newRef);
      setDriverOtp(randomOtp);
      setBookingStage('confirmed');

      // Sync booking with universal store
      if ((window as any).executeGenericBooking) {
        (window as any).executeGenericBooking(
          'drivers',
          `Driver Booked: ${currentCategory.name} (${selectedVehicleModel})`,
          `${serviceType.replace(/_/g, ' ').toUpperCase()} • Pickup: ${pickupLocation} • Reporting: ${tripDate || 'Immediate'} ${tripTime}`,
          1200,
          {
            refId: newRef,
            driverName: currentCategory.sampleDriver.name,
            vehicle: selectedVehicleModel,
            category: currentCategory.name,
            serviceType,
            pickup: pickupLocation,
            hours: requiredHours,
            food: foodProvided,
            otp: randomOtp
          }
        );
      }
    }, 900);
  };

  const handleVerifyDriverOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() === driverOtp.trim()) {
      setIsOtpVerified(true);
      setOtpError('');
    } else {
      setOtpError('Invalid OTP! Please check the 4-digit code shown on customer screen.');
    }
  };

  return (
    <div
      className="modal-overlay open"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        overflow: 'hidden'
      }}
      onClick={handleClose}
    >
      <div
        className="modal-sheet centered-modal drivers-booking-modal-sheet"
        style={{
          width: '100%',
          maxWidth: '100%',
          height: 'calc(100vh - 70px)',
          maxHeight: 'calc(100vh - 70px)',
          backgroundColor: '#f8fafc',
          borderRadius: '0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: 'none',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dummy div to absorb globals.css rule */}
        <div style={{ display: 'none' }}></div>

        {/* Global Top Navbar */}
        <div
          style={{
            padding: '14px 28px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
              }}
            >
              <i className="fa-solid fa-id-card"></i>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                  Professional Driver &amp; Chauffeur Hire
                </h2>
                <span
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <i className="fa-solid fa-circle-check"></i> 21 Certified Pilot Categories Available
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Book verified professionals for Bike, Car, Auto, Bus, Truck, Tractor, Speedboat, Yacht, Helicopter, Jet, Drone, or Locomotive with 4-digit OTP trip authorization.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#059669', fontWeight: 800, background: '#f0fdf4', padding: '6px 14px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <i className="fa-solid fa-shield-check"></i> 4-Digit OTP Start Code Protected
            </div>
            <button
              onClick={handleClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* =========================================================================
            STAGE 1: FORM VIEW
            Left Side: 21 Roles Explorer with Category filter tabs (Road, Sea, Air, Rail)
            Right Side: Matching User's Image Form (Service Type 2x2, Pickup, Required Hours,
            Food Provided By Customer, Date, Time, and Specific Model dropdown).
           ========================================================================= */}
        {bookingStage === 'form' ? (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

            {/* LEFT SIDE: 21 Certified Pilot Roles Picker with Driving License Credentials */}
            <div
              style={{
                flex: '1 1 48%',
                borderRight: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                overflowY: 'auto',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Step 1: Choose Vehicle &amp; Driving License Class ({filteredCategories.length} Roles)
                </span>
                <h3 style={{ margin: '4px 0 4px 0', fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                  Which machine or vehicle do you need a driver for?
                </h3>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                  Each driver is certified with government endorsements (MCWG, LMV, 3W, TRANS, HGV, STCW-95, DGCA, Loco Pilot).
                </p>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                  {[
                    { id: 'ALL', label: 'All Roles (21)', icon: 'fa-globe' },
                    { id: 'ROAD', label: 'Road (13)', icon: 'fa-car' },
                    { id: 'SEA', label: 'Marine (3)', icon: 'fa-ship' },
                    { id: 'AIR', label: 'Aviation (3)', icon: 'fa-plane' },
                    { id: 'RAIL', label: 'Rail (2)', icon: 'fa-train' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setDomainFilter(tab.id as any)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: domainFilter === tab.id ? '1.5px solid #059669' : '1px solid #e2e8f0',
                        backgroundColor: domainFilter === tab.id ? '#ecfdf5' : '#ffffff',
                        color: domainFilter === tab.id ? '#047857' : '#475569',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
                    </button>
                  ))}
                </div>

                <div style={{ position: 'relative', width: '180px' }}>
                  <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '11px' }}></i>
                  <input
                    type="text"
                    placeholder="Search roles..."
                    value={searchRoleQuery}
                    onChange={(e) => setSearchRoleQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 10px 6px 28px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* All 21 Roles Grid (Unified with outer scrolling) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '12px',
                  width: '100%'
                }}
              >
                {filteredCategories.map((cat) => {
                  const isSelected = selectedVehicleCategoryId === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedVehicleCategoryId(cat.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '14px',
                        border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 6px 18px -4px rgba(5, 150, 105, 0.2)' : '0 2px 6px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#a7f3d0';
                          e.currentTarget.style.backgroundColor = '#fafafa';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.backgroundColor = '#ffffff';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: cat.color + '18',
                            color: cat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px'
                          }}
                        >
                          <i className={`fa-solid ${cat.icon}`}></i>
                        </div>
                        {isSelected ? (
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', background: '#dcfce7', padding: '2px 8px', borderRadius: '12px' }}>
                            <i className="fa-solid fa-check"></i> Selected
                          </span>
                        ) : (
                          <span style={{ fontSize: '10px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '6px' }}>
                            {cat.domain}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cat.name}
                        </h4>
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cat.subtitle}
                        </span>
                      </div>

                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '6px', fontSize: '10.5px', color: '#059669', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <i className="fa-solid fa-id-card"></i> {cat.licenseRequired.split(':')[1]?.trim() || 'Verified DL'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Driver Profile Preview Snippet with Documents Badge at the End */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginTop: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
              >
                <img
                  src={currentCategory.sampleDriver.avatar}
                  alt={currentCategory.sampleDriver.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #059669', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>
                      {currentCategory.sampleDriver.name}
                    </h4>
                    <span style={{ fontSize: '10.5px', background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '6px', fontWeight: 800 }}>
                      <i className="fa-solid fa-shield-check"></i> 100% Police Verified
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
                    <strong>License No:</strong> {currentCategory.driverLicenseNumber}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    {currentCategory.experience} • {currentCategory.sampleDriver.trips}+ Safe Trips Completed
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE: EXACT FORM MATCHING USER'S IMAGE */}
            <div
              style={{
                flex: '1 1 52%',
                backgroundColor: '#f8fafc',
                overflowY: 'auto',
                padding: '24px 32px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                  padding: '26px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '22px'
                }}
              >
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* 1. Service Type Section (Matches First Image 2x2 Grid) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>
                      Service Type
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {SERVICE_TYPE_OPTIONS.map((opt) => {
                        const isSelected = serviceType === opt.id;
                        return (
                          <button
                            type="button"
                            key={opt.id}
                            onClick={() => setServiceType(opt.id)}
                            style={{
                              padding: '14px 18px',
                              borderRadius: '14px',
                              border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                              backgroundColor: isSelected ? '#059669' : '#ffffff',
                              color: isSelected ? '#ffffff' : '#1e293b',
                              fontSize: '14px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              textAlign: 'center',
                              boxShadow: isSelected ? '0 6px 16px rgba(5, 150, 105, 0.3)' : 'none',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Pickup Location (Matches First Image) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                      Pickup Location
                    </label>
                    <div style={{ position: 'relative' }}>
                      <i className="fa-regular fa-compass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '16px' }}></i>
                      <input
                        type="text"
                        placeholder="Pickup location"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '13px 16px 13px 44px',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          fontSize: '14px',
                          color: '#0f172a',
                          outline: 'none',
                          transition: 'border 0.2s ease'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#059669'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  </div>

                  {/* 3. Drop Location (If Outstation) */}
                  {serviceType.includes('outstation') && (
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                        Destination City / Outstation Drop
                      </label>
                      <div style={{ position: 'relative' }}>
                        <i className="fa-solid fa-location-dot" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '16px' }}></i>
                        <input
                          type="text"
                          placeholder="Destination city or outstation landmark"
                          value={dropLocation}
                          onChange={(e) => setDropLocation(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '13px 16px 13px 44px',
                            borderRadius: '12px',
                            border: '1.5px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            fontSize: '14px',
                            color: '#0f172a',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. Required Hours & Food Provided By Customer (Matches First Image row) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                        Required Hours
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={requiredHours}
                          onChange={(e) => setRequiredHours(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '13px 16px',
                            borderRadius: '12px',
                            border: '1.5px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#0f172a',
                            outline: 'none',
                            cursor: 'pointer',
                            appearance: 'none'
                          }}
                        >
                          {HOURS_OPTIONS.map((h, i) => (
                            <option key={i} value={h}>{h}</option>
                          ))}
                        </select>
                        <i className="fa-solid fa-chevron-down" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '12px', pointerEvents: 'none' }}></i>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                        Food Provided By Customer
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={foodProvided}
                          onChange={(e) => setFoodProvided(e.target.value as any)}
                          style={{
                            width: '100%',
                            padding: '13px 16px',
                            borderRadius: '12px',
                            border: '1.5px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#0f172a',
                            outline: 'none',
                            cursor: 'pointer',
                            appearance: 'none'
                          }}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No (Driver Allowance Added)</option>
                        </select>
                        <i className="fa-solid fa-chevron-down" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '12px', pointerEvents: 'none' }}></i>
                      </div>
                    </div>
                  </div>

                  {/* 5. Date & Time (Matches First Image dd-mm-yyyy and --:-- --) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                        Date
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="date"
                          value={tripDate}
                          onChange={(e) => setTripDate(e.target.value)}
                          placeholder="dd-mm-yyyy"
                          required
                          style={{
                            width: '100%',
                            padding: '13px 16px',
                            borderRadius: '12px',
                            border: '1.5px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#0f172a',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                        Time
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="time"
                          value={tripTime}
                          onChange={(e) => setTripTime(e.target.value)}
                          placeholder="--:-- --"
                          required
                          style={{
                            width: '100%',
                            padding: '13px 16px',
                            borderRadius: '12px',
                            border: '1.5px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#0f172a',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. Specific Vehicle Model Dropdown */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                      Specific Model ({currentCategory.name})
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={selectedVehicleModel}
                        onChange={(e) => setSelectedVehicleModel(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '13px 16px',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#0f172a',
                          outline: 'none',
                          cursor: 'pointer',
                          appearance: 'none'
                        }}
                      >
                        {currentCategory.suitableModels.map((m, i) => (
                          <option key={i} value={m}>{m}</option>
                        ))}
                      </select>
                      <i className="fa-solid fa-chevron-down" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '12px', pointerEvents: 'none' }}></i>
                    </div>
                  </div>

                  {/* Customer Contact row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #e2e8f0',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        WhatsApp Number (For 4-Digit OTP)
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #e2e8f0',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '14px',
                      border: 'none',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: 900,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 16px rgba(5, 150, 105, 0.35)',
                      transition: 'all 0.15s ease',
                      marginTop: '4px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  >
                    {isSubmitting ? (
                      <span><i className="fa-solid fa-spinner fa-spin"></i> Dispatching Licensed Pilot...</span>
                    ) : (
                      <span>Book Driver &amp; Receive 4-Digit OTP <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i></span>
                    )}
                  </button>

                </form>
              </div>
            </div>

          </div>
        ) : (
          /* =========================================================================
             STAGE 2: DRIVER ASSIGNED & 4-DIGIT OTP VERIFICATION + DRIVING LICENSE PROOFS
             ========================================================================= */
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', background: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '920px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              {/* Back to Form */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setBookingStage('form')}
                  style={{
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    color: '#334155',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i> Modify Booking Details
                </button>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Booking ID: <strong style={{ color: '#059669' }}>{bookingRefId}</strong>
                </div>
              </div>

              {/* Top Banner: 4-Digit OTP Required to Start Trip */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: isOtpVerified ? '2px solid #10b981' : '2px solid #f59e0b',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)',
                  padding: '24px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: isOtpVerified ? '#dcfce7' : '#fef3c7',
                      color: isOtpVerified ? '#059669' : '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '26px'
                    }}
                  >
                    <i className={`fa-solid ${isOtpVerified ? 'fa-circle-check' : 'fa-key'}`}></i>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                      {isOtpVerified ? 'Driver Trip Started & Verified!' : 'Driver 4-Digit OTP Verification'}
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b', maxWidth: '420px' }}>
                      {isOtpVerified
                        ? 'Trip officially initiated. License verified, route logged, and emergency SOS enabled.'
                        : 'Customer receives a 4-digit OTP. The driver must verify this OTP on the terminal to start the vehicle.'}
                    </p>
                  </div>
                </div>

                {/* 4-Digit OTP Box */}
                {!isOtpVerified ? (
                  <form onSubmit={handleVerifyDriverOtp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                      CUSTOMER OTP CODE: <span style={{ color: '#059669', fontSize: '14px', fontWeight: 900, background: '#ecfdf5', padding: '2px 8px', borderRadius: '6px' }}>{driverOtp}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="4-digit OTP"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        style={{
                          width: '120px',
                          textAlign: 'center',
                          padding: '10px',
                          borderRadius: '10px',
                          border: '2px solid #f59e0b',
                          fontSize: '18px',
                          fontWeight: 900,
                          letterSpacing: '4px',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          padding: '10px 18px',
                          borderRadius: '10px',
                          border: 'none',
                          backgroundColor: '#059669',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Verify &amp; Start
                      </button>
                    </div>
                    {otpError && (
                      <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700 }}>{otpError}</span>
                    )}
                  </form>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 900, fontSize: '15px', background: '#ecfdf5', padding: '10px 18px', borderRadius: '12px' }}>
                    <i className="fa-solid fa-shield-check"></i> TRIP IN PROGRESS
                  </div>
                )}
              </div>

              {/* Driver Credentials Card & Documents Proofs Section */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
              >
                {/* Driver Profile Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <img
                      src={currentCategory.sampleDriver.avatar}
                      alt={currentCategory.sampleDriver.name}
                      style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #059669' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                          {currentCategory.sampleDriver.name}
                        </h3>
                        <span style={{ fontSize: '12px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '20px', fontWeight: 800 }}>
                          ★ {currentCategory.sampleDriver.rating} Rating
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                        Designated Pilot for <strong>{currentCategory.name}</strong> • Vehicle: <strong>{selectedVehicleModel}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                        Languages: {currentCategory.sampleDriver.languages.join(', ')} • {currentCategory.experience}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Reporting Location:</span>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{pickupLocation || 'Customer Location'}</div>
                    <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                      {tripDate || 'Today'} at {tripTime || 'Immediate'}
                    </div>
                  </div>
                </div>

                {/* Proofs & Documentation Selector */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                        Official Driver Proofs &amp; Verification Documents
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                        Verified by National Transport Portal (Sarathi) and State Police Records.
                      </p>
                    </div>

                    {/* Proof Category Tabs */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setActiveProofTab('license')}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: activeProofTab === 'license' ? '2px solid #059669' : '1px solid #e2e8f0',
                          backgroundColor: activeProofTab === 'license' ? '#ecfdf5' : '#ffffff',
                          color: activeProofTab === 'license' ? '#047857' : '#475569',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fa-solid fa-id-card"></i> Driving License
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveProofTab('badge')}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: activeProofTab === 'badge' ? '2px solid #059669' : '1px solid #e2e8f0',
                          backgroundColor: activeProofTab === 'badge' ? '#ecfdf5' : '#ffffff',
                          color: activeProofTab === 'badge' ? '#047857' : '#475569',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fa-solid fa-certificate"></i> Commercial Badge
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveProofTab('aadhaar')}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: activeProofTab === 'aadhaar' ? '2px solid #059669' : '1px solid #e2e8f0',
                          backgroundColor: activeProofTab === 'aadhaar' ? '#ecfdf5' : '#ffffff',
                          color: activeProofTab === 'aadhaar' ? '#047857' : '#475569',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fa-solid fa-address-card"></i> Aadhaar KYC
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveProofTab('police')}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '10px',
                          border: activeProofTab === 'police' ? '2px solid #059669' : '1px solid #e2e8f0',
                          backgroundColor: activeProofTab === 'police' ? '#ecfdf5' : '#ffffff',
                          color: activeProofTab === 'police' ? '#047857' : '#475569',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fa-solid fa-shield-halved"></i> Police Clearance
                      </button>
                    </div>
                  </div>

                  {/* Active Document View Card */}
                  <div
                    style={{
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '16px',
                      backgroundColor: '#f8fafc',
                      padding: '20px',
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1fr',
                      gap: '24px',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      {activeProofTab === 'license' && (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', background: '#dcfce7', padding: '3px 8px', borderRadius: '4px' }}>
                            VERIFIED DRIVING LICENSE (DL)
                          </span>
                          <h4 style={{ margin: '8px 0 4px 0', fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                            DL No: {currentCategory.driverLicenseNumber}
                          </h4>
                          <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                            <div><strong>Endorsed Class:</strong> {currentCategory.licenseRequired}</div>
                            <div><strong>Issuing RTO Authority:</strong> National Transport Authority (Sarathi Portal)</div>
                            <div><strong>Validity:</strong> Non-Transport up to 2038 / Transport Badge Active</div>
                            <div><strong>Driver Blood Group:</strong> O+ve</div>
                          </div>
                        </div>
                      )}

                      {activeProofTab === 'badge' && (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', background: '#dcfce7', padding: '3px 8px', borderRadius: '4px' }}>
                            COMMERCIAL DRIVER BADGE
                          </span>
                          <h4 style={{ margin: '8px 0 4px 0', fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                            Badge No: {currentCategory.driverBadgeNumber}
                          </h4>
                          <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                            <div><strong>Category:</strong> Public Service Vehicle (PSV) / Heavy Haulage Endorsement</div>
                            <div><strong>First Aid Certified:</strong> St. John Ambulance Certified</div>
                            <div><strong>Refresher Training:</strong> IDTR Safety Compliant 2026</div>
                          </div>
                        </div>
                      )}

                      {activeProofTab === 'aadhaar' && (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', background: '#dcfce7', padding: '3px 8px', borderRadius: '4px' }}>
                            GOVERNMENT AADHAAR KYC
                          </span>
                          <h4 style={{ margin: '8px 0 4px 0', fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                            UID: XXXX-XXXX-7729 (Biometrically Verified)
                          </h4>
                          <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                            <div><strong>Name on Card:</strong> {currentCategory.sampleDriver.name}</div>
                            <div><strong>Address Verification:</strong> Permanent Residence Confirmed</div>
                            <div><strong>OTP Match:</strong> Verified with UIDAI Database</div>
                          </div>
                        </div>
                      )}

                      {activeProofTab === 'police' && (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', background: '#dcfce7', padding: '3px 8px', borderRadius: '4px' }}>
                            STATE POLICE CLEARANCE CERTIFICATE (PCC)
                          </span>
                          <h4 style={{ margin: '8px 0 4px 0', fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                            PCC No: POL-2026-CC-88192
                          </h4>
                          <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
                            <div><strong>Status:</strong> No Criminal Antecedents / Clean Driving Record</div>
                            <div><strong>Station:</strong> Central Commissionerate of Police</div>
                            <div><strong>Validity:</strong> Valid through Dec 2026</div>
                          </div>
                        </div>
                      )}

                      <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#059669', fontWeight: 800 }}>
                          <i className="fa-solid fa-circle-check"></i> Government Digitally Signed
                        </span>
                      </div>
                    </div>

                    {/* Document Preview Snapshot */}
                    <div style={{ position: 'relative', height: '170px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                      <img
                        src={
                          activeProofTab === 'license'
                            ? currentCategory.sampleDriver.licenseDocUrl
                            : activeProofTab === 'aadhaar'
                              ? currentCategory.sampleDriver.aadhaarDocUrl
                              : currentCategory.sampleDriver.policeClearanceUrl
                        }
                        alt="Document Proof Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(to top, rgba(15,23,42,0.85), transparent)',
                          padding: '10px 14px',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{ fontSize: '11px', fontWeight: 800 }}>Tamper-proof Cryptographic Watermark</span>
                        <i className="fa-solid fa-shield-halved" style={{ color: '#10b981' }}></i>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Buttons */}
                <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Calling ${currentCategory.sampleDriver.name}...`);
                    }}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fa-solid fa-phone" style={{ color: '#059669' }}></i> Call Driver
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fa-solid fa-circle-check"></i> Done (Go to Home)
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
