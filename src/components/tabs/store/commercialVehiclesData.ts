import { BrandInfo } from './vehicleBrandsModelsData';
import { UsedCarItem } from './usedCarsData';

// ============================================================================
// TRUCKS & COMMERCIAL PICKUPS BRANDS & MODELS
// ============================================================================
export const TRUCK_BRANDS_DATA: Record<string, BrandInfo> = {
  'Ashok Leyland': {
    name: 'Ashok Leyland',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=120&q=80',
    models: [
      'Dost+', 'Bada Dost', 'Saathi', 'Partner', 'Boss',
      'Ecomet (1215 HE, 1615 HE)', 'AVTR (1920, 2820, 3520, 4825, 5525)', 'Captain'
    ]
  },
  'Tata Motors': {
    name: 'Tata Motors',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: [
      'Ace Gold', 'Ace EV', 'Intra (V10, V20, V30, V50, V70, EV)', 'Yodha Pickup',
      '407 Gold', '709g', 'LPT series', 'Ultra (T.7, T.9, 1918.T)',
      'Signa (1923, 2823, 3523, 4825, 5530)', 'Prima (2830, 3530, 5530)'
    ]
  },
  'Eicher Motors': {
    name: 'Eicher Motors',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=120&q=80',
    models: [
      'Pro 2049', 'Pro 2059', 'Pro 2095XP', 'Pro 2110', 'Pro 3015', 'Pro 3019',
      'Pro 6028', 'Pro 6035', 'Pro 6048', 'Pro 6055', 'Pro 8035XM', 'Pro 8055'
    ]
  },
  'BharatBenz': {
    name: 'BharatBenz',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=120&q=80',
    models: [
      '1015R', '1217C', '1415R', '1617R', '1917R', '1923C', '2823C',
      '2828C', '3523R', '3528C', '4228R', '5228TT', '5528TT', '5532T'
    ]
  },
  'Mahindra': {
    name: 'Mahindra',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: [
      'Jeeto Plus', 'Supro Profit Truck', 'Bolero Pik-Up', 'Bolero Maxitruck',
      'Bolero Camper', 'Jaya', 'Furio (7, 11, 14, 17)', 'Blazo X (28, 35, 42, 48, 55)'
    ]
  },
  'SML Mahindra': {
    name: 'SML Mahindra',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=120&q=80',
    models: ['Sartaj', 'Samrat', 'Prestige', 'Supreme', 'Super GS']
  },
  'Force Motors': {
    name: 'Force Motors',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80',
    models: ['Traveller Delivery Van', 'Urbania', 'Shaktiman']
  },
  'Maruti Suzuki Commercial': {
    name: 'Maruti Suzuki Commercial',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=120&q=80',
    models: ['Super Carry', 'Eeco Cargo']
  },
  'Isuzu': {
    name: 'Isuzu',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=120&q=80',
    models: ['D-Max', 'S-CAB', 'Hi-Lander', 'V-Cross']
  },
  'Toyota': {
    name: 'Toyota',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=120&q=80',
    models: ['Hilux']
  },
  'Volvo Trucks': {
    name: 'Volvo Trucks',
    category: 'heavy',
    logo: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=120&q=80',
    models: ['FM', 'FMX (460, 500)', 'FH']
  },
  'Scania': {
    name: 'Scania',
    category: 'heavy',
    logo: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=120&q=80',
    models: ['G-Series (G 500, G 560 Super)', 'R-Series', 'P-Series']
  },
  'Euler Motors': {
    name: 'Euler Motors',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80',
    models: ['HiLoad EV', 'Turbo EV 1000', 'Storm EV T1500']
  },
  'Switch Mobility': {
    name: 'Switch Mobility',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80',
    models: ['IeV3', 'IeV4']
  },
  'Montra Electric': {
    name: 'Montra Electric',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80',
    models: ['Eviator']
  }
};

// ============================================================================
// THREE-WHEELERS & AUTO-RICKSHAWS BRANDS & MODELS
// ============================================================================
export const AUTO_BRANDS_DATA: Record<string, BrandInfo> = {
  'Bajaj': {
    name: 'Bajaj',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80',
    models: [
      'RE', 'Maxima Z', 'Maxima C', 'Maxima X Wide',
      'Maxima XL Cargo E-TEC', 'Qute', 'Riki E-Rickshaw'
    ]
  },
  'Piaggio': {
    name: 'Piaggio',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=120&q=80',
    models: ['Ape City+', 'Ape Auto DX', 'Ape Xtra LDX', 'Ape E-City', 'Ape E-Xtra FX']
  },
  'Mahindra': {
    name: 'Mahindra',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: ['Alfa', 'Treo', 'Treo Zor', 'Zor Grand', 'e-Alfa Mini']
  },
  'TVS': {
    name: 'TVS',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=120&q=80',
    models: ['King Deluxe', 'King Duramax', 'King Kargo']
  },
  'Atul Auto': {
    name: 'Atul Auto',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=120&q=80',
    models: ['Gem Paxx', 'Gem Cargo', 'Shakti', 'Elite', 'RIK']
  },
  'Altigreen': {
    name: 'Altigreen',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80',
    models: ['neEV Tez', 'neEV High Deck', 'neEV Low Deck']
  },
  'Omega Seiki Mobility (OSM)': {
    name: 'Omega Seiki Mobility (OSM)',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80',
    models: ['Rage+', 'Stream', 'Swayamgati']
  }
};

// ============================================================================
// BUSES & PASSENGER VANS BRANDS & MODELS
// ============================================================================
export const BUS_BRANDS_DATA: Record<string, BrandInfo> = {
  'Tata Motors': {
    name: 'Tata Motors',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: ['Starbus', 'Magic', 'Winger', 'Magna', 'Ultra Urban']
  },
  'Ashok Leyland': {
    name: 'Ashok Leyland',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=120&q=80',
    models: ['Viking', 'Cheetah', 'Lynx', 'Oyster', 'Sunshine', 'Falcon']
  },
  'Eicher': {
    name: 'Eicher',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=120&q=80',
    models: ['Skyline Pro', 'Starline']
  },
  'Force Motors': {
    name: 'Force Motors',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80',
    models: ['Traveller (3050, 3350, 3700, 4020)', 'Trax Cruiser', 'Urbania']
  },
  'BharatBenz': {
    name: 'BharatBenz',
    category: 'commercial',
    logo: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=120&q=80',
    models: ['1017', '1624', '1824']
  },
  'Volvo Buses': {
    name: 'Volvo Buses',
    category: 'luxury',
    logo: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=120&q=80',
    models: ['9400', '9600']
  },
  'Olectra': {
    name: 'Olectra',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80',
    models: ['K6', 'K7', 'K9', 'CX2']
  },
  'JBM': {
    name: 'JBM',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80',
    models: ['Eco-Life', 'Galaxy']
  }
};

// ============================================================================
// TRACTORS & CONSTRUCTION EQUIPMENT BRANDS & MODELS
// ============================================================================
export const TRACTOR_BRANDS_DATA: Record<string, BrandInfo> = {
  'Mahindra': {
    name: 'Mahindra',
    category: 'agri',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: ['Arjun Novo', 'Yuvo Tech+', 'Jivo', 'XP Plus (275, 475, 575)', 'OJA']
  },
  'Swaraj': {
    name: 'Swaraj',
    category: 'agri',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: ['735 FE', '744 FE', '855 FE', '963 FE']
  },
  'John Deere': {
    name: 'John Deere',
    category: 'agri',
    logo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=120&q=80',
    models: ['5050 D', '5105', '5210 GearPro', '5310']
  },
  'Sonalika': {
    name: 'Sonalika',
    category: 'agri',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: ['DI 35', 'DI 745 III', 'DI 750 III', 'Tiger 50']
  },
  'Massey Ferguson': {
    name: 'Massey Ferguson (TAFE)',
    category: 'agri',
    logo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=120&q=80',
    models: ['1035 DI', '241 DI', '245 DI', '7250 DI']
  },
  'Escorts': {
    name: 'Escorts (Farmtrac / Powertrac)',
    category: 'agri',
    logo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=120&q=80',
    models: ['Farmtrac 45', 'Farmtrac 60', 'Powertrac Euro 50']
  },
  'New Holland': {
    name: 'New Holland',
    category: 'agri',
    logo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=120&q=80',
    models: ['3630 TX', '3230 NX', 'Excel 4710']
  },
  'Kubota': {
    name: 'Kubota',
    category: 'agri',
    logo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=120&q=80',
    models: ['MU4501', 'MU5502', 'NeoStar']
  },
  'JCB': {
    name: 'JCB (Earthmovers)',
    category: 'construction',
    logo: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=120&q=80',
    models: ['3DX', '3DX Plus', '4DX', 'NXT 205 Excavator']
  }
};

// ============================================================================
// COMMERCIAL VANS BRANDS & MODELS
// ============================================================================
export const COMMERCIAL_VAN_BRANDS_DATA: Record<string, BrandInfo> = {
  'Tata Motors': {
    name: 'Tata Motors',
    category: 'van',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: ['Winger', 'Magic', 'Intra V50', 'Ace Gold']
  },
  'Force Motors': {
    name: 'Force Motors',
    category: 'van',
    logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80',
    models: ['Traveller Delivery Van', 'Urbania', 'Trax Cruiser']
  },
  'Maruti Suzuki Commercial': {
    name: 'Maruti Suzuki Commercial',
    category: 'van',
    logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=120&q=80',
    models: ['Super Carry', 'Eeco Cargo']
  },
  'Mahindra': {
    name: 'Mahindra',
    category: 'van',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: ['Supro Profit Truck', 'Bolero Camper', 'Bolero Maxitruck']
  },
  'Ashok Leyland': {
    name: 'Ashok Leyland',
    category: 'van',
    logo: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=120&q=80',
    models: ['Bada Dost', 'Dost+', 'Partner']
  }
};

// ============================================================================
// USED COMMERCIAL VEHICLES MOCK DATA (Cards matching Image 2 style)
// ============================================================================
export const USED_COMMERCIAL_MOCK_DATA: UsedCarItem[] = [
  {
    id: 'comm-1',
    name: '2021 Tata Ace Gold',
    brand: 'Tata Motors',
    model: 'Ace Gold',
    year: 2021,
    variant: 'High Deck Diesel BS6',
    price: '₹3.95 L',
    rawPrice: 395000,
    emi: '₹7,850/m',
    saveBadge: 'Save ₹35K',
    topBadge: 'Verified Carrier',
    km: '48,200 kms',
    rawKm: 48200,
    fuel: 'Diesel',
    transmission: 'Manual',
    rto: 'TN09 (Chennai)',
    location: 'Guindy, Chennai',
    isCertified: true,
    hasWarranty: true,
    hasRcTransfer: true,
    hasFiveDayMoney: false,
    ownerType: 'First owner',
    bodyType: 'Mini Truck',
    sellerType: 'Certified Commercial Dealer',
    seats: 2,
    images: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'comm-2',
    name: '2022 Ashok Leyland Bada Dost',
    brand: 'Ashok Leyland',
    model: 'Bada Dost',
    year: 2022,
    variant: 'i4 Pickup 3.5T',
    price: '₹6.85 L',
    rawPrice: 685000,
    emi: '₹13,420/m',
    saveBadge: 'Save ₹50K',
    topBadge: 'Top Load King',
    km: '36,500 kms',
    rawKm: 36500,
    fuel: 'Diesel',
    transmission: 'Manual',
    rto: 'TN05 (Chennai)',
    location: 'Ambattur, Chennai',
    isCertified: true,
    hasWarranty: true,
    hasRcTransfer: true,
    hasFiveDayMoney: true,
    ownerType: 'First owner',
    bodyType: 'Pickup Truck',
    sellerType: 'Commercial Hub',
    seats: 3,
    images: [
      'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'comm-3',
    name: '2020 Mahindra Bolero Pik-Up',
    brand: 'Mahindra',
    model: 'Bolero Pik-Up',
    year: 2020,
    variant: 'ExtraLong 1.7T CBC',
    price: '₹5.60 L',
    rawPrice: 560000,
    emi: '₹11,100/m',
    saveBadge: 'Save ₹40K',
    topBadge: 'Heavy Duty',
    km: '62,000 kms',
    rawKm: 62000,
    fuel: 'Diesel',
    transmission: 'Manual',
    rto: 'TN10 (Chennai)',
    location: 'Madhavaram, Chennai',
    isCertified: true,
    hasWarranty: true,
    hasRcTransfer: true,
    hasFiveDayMoney: false,
    ownerType: 'First owner',
    bodyType: 'Pickup Truck',
    sellerType: 'Direct Owner',
    seats: 2,
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'comm-4',
    name: '2021 BharatBenz 1217C Tipper',
    brand: 'BharatBenz',
    model: '1217C',
    year: 2021,
    variant: '6-Wheeler Sand & Mining Tipper',
    price: '₹18.50 L',
    rawPrice: 1850000,
    emi: '₹36,200/m',
    saveBadge: 'Save ₹1.2 L',
    topBadge: 'Heavy Fleet',
    km: '84,000 kms',
    rawKm: 84000,
    fuel: 'Diesel',
    transmission: 'Manual',
    rto: 'TN18 (Redhills)',
    location: 'Ennore Port Hub, Chennai',
    isCertified: true,
    hasWarranty: true,
    hasRcTransfer: true,
    hasFiveDayMoney: false,
    ownerType: 'First owner',
    bodyType: 'Tipper Truck',
    sellerType: 'Enterprise Fleet',
    seats: 3,
    images: [
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'comm-5',
    name: '2022 Bajaj Maxima Z Passenger',
    brand: 'Bajaj',
    model: 'Maxima Z',
    year: 2022,
    variant: '4-Stroke Diesel 4-Seater Auto',
    price: '₹1.95 L',
    rawPrice: 195000,
    emi: '₹4,100/m',
    saveBadge: 'Save ₹20K',
    topBadge: 'Verified Auto',
    km: '28,000 kms',
    rawKm: 28000,
    fuel: 'Diesel',
    transmission: 'Manual',
    rto: 'TN02 (Chennai Central)',
    location: 'T. Nagar, Chennai',
    isCertified: true,
    hasWarranty: true,
    hasRcTransfer: true,
    hasFiveDayMoney: true,
    ownerType: 'First owner',
    bodyType: '3-Wheeler Auto',
    sellerType: 'Direct Owner',
    seats: 4,
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'comm-6',
    name: '2023 Piaggio Ape E-City EV',
    brand: 'Piaggio',
    model: 'Ape E-City',
    year: 2023,
    variant: 'Electric Swappable Battery',
    price: '₹2.45 L',
    rawPrice: 245000,
    emi: '₹5,200/m',
    saveBadge: 'Zero Emission',
    topBadge: 'EV Auto',
    km: '14,500 kms',
    rawKm: 14500,
    fuel: 'Electric',
    transmission: 'Automatic',
    rto: 'TN07 (Thiruvanmiyur)',
    location: 'Adyar, Chennai',
    isCertified: true,
    hasWarranty: true,
    hasRcTransfer: true,
    hasFiveDayMoney: true,
    ownerType: 'First owner',
    bodyType: '3-Wheeler Auto',
    sellerType: 'Certified Commercial Dealer',
    seats: 4,
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'comm-7',
    name: '2021 Force Traveller 3050',
    brand: 'Force Motors',
    model: 'Traveller (3050, 3350, 3700, 4020)',
    year: 2021,
    variant: '3050 12+D AC Luxury Van',
    price: '₹12.80 L',
    rawPrice: 1280000,
    emi: '₹25,100/m',
    saveBadge: 'Save ₹75K',
    topBadge: 'Tourist Permit',
    km: '54,000 kms',
    rawKm: 54000,
    fuel: 'Diesel',
    transmission: 'Manual',
    rto: 'TN09 (Chennai)',
    location: 'Koyambedu, Chennai',
    isCertified: true,
    hasWarranty: true,
    hasRcTransfer: true,
    hasFiveDayMoney: false,
    ownerType: 'First owner',
    bodyType: 'Commercial Van',
    sellerType: 'Enterprise Fleet',
    seats: 13,
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'comm-8',
    name: '2020 Tata Starbus Ultra',
    brand: 'Tata Motors',
    model: 'Starbus',
    year: 2020,
    variant: '32-Seater Staff & School Bus',
    price: '₹16.50 L',
    rawPrice: 1650000,
    emi: '₹32,400/m',
    saveBadge: 'Save ₹90K',
    topBadge: 'All Clear Fitness',
    km: '76,000 kms',
    rawKm: 76000,
    fuel: 'Diesel',
    transmission: 'Manual',
    rto: 'TN14 (Sholinganallur)',
    location: 'OMR, Chennai',
    isCertified: true,
    hasWarranty: true,
    hasRcTransfer: true,
    hasFiveDayMoney: false,
    ownerType: 'First owner',
    bodyType: 'Passenger Bus',
    sellerType: 'Institutional Fleet',
    seats: 32,
    images: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'comm-9',
    name: '2021 Mahindra Arjun Novo 605',
    brand: 'Mahindra',
    model: 'Arjun Novo',
    year: 2021,
    variant: 'DI-i 4WD 57 HP Farm Tractor',
    price: '₹6.20 L',
    rawPrice: 620000,
    emi: '₹12,300/m',
    saveBadge: 'Save ₹45K',
    topBadge: 'Agri Certified',
    km: '1,450 hrs',
    rawKm: 14500,
    fuel: 'Diesel',
    transmission: 'Manual',
    rto: 'TN21 (Kanchipuram)',
    location: 'Sriperumbudur, Chennai',
    isCertified: true,
    hasWarranty: true,
    hasRcTransfer: true,
    hasFiveDayMoney: true,
    ownerType: 'First owner',
    bodyType: 'Agri Tractor',
    sellerType: 'Direct Farmer / Owner',
    seats: 1,
    images: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'comm-10',
    name: '2020 Swaraj 744 FE Tractor',
    brand: 'Swaraj',
    model: '744 FE',
    year: 2020,
    variant: '48 HP Multi-Speed PTO',
    price: '₹4.90 L',
    rawPrice: 490000,
    emi: '₹9,800/m',
    saveBadge: 'Save ₹30K',
    topBadge: 'Top Efficiency',
    km: '2,100 hrs',
    rawKm: 21000,
    fuel: 'Diesel',
    transmission: 'Manual',
    rto: 'TN23 (Vellore)',
    location: 'Vellore Hub',
    isCertified: true,
    hasWarranty: true,
    hasRcTransfer: true,
    hasFiveDayMoney: false,
    ownerType: 'First owner',
    bodyType: 'Agri Tractor',
    sellerType: 'Agri Equipment Mart',
    seats: 1,
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'comm-11',
    name: '2021 JCB 3DX Plus Backhoe',
    brand: 'JCB',
    model: '3DX Plus',
    year: 2021,
    variant: 'CEV-IV EcoMAX 76 HP Excavator',
    price: '₹22.50 L',
    rawPrice: 2250000,
    emi: '₹44,000/m',
    saveBadge: 'Save ₹1.5 L',
    topBadge: 'LiveLink GPS',
    km: '3,200 hrs',
    rawKm: 32000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    rto: 'TN11 (Tambaram)',
    location: 'Tambaram, Chennai',
    isCertified: true,
    hasWarranty: true,
    hasRcTransfer: true,
    hasFiveDayMoney: false,
    ownerType: 'First owner',
    bodyType: 'Earthmover / Backhoe',
    sellerType: 'Construction Equipment Hub',
    seats: 1,
    images: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'comm-12',
    name: '2022 Euler HiLoad EV Truck',
    brand: 'Euler Motors',
    model: 'HiLoad EV',
    year: 2022,
    variant: '688 kg Payload 170 km Range',
    price: '₹4.35 L',
    rawPrice: 435000,
    emi: '₹8,600/m',
    saveBadge: 'Zero Emission',
    topBadge: 'Fast Charging',
    km: '19,000 kms',
    rawKm: 19000,
    fuel: 'Electric',
    transmission: 'Automatic',
    rto: 'TN09 (Chennai)',
    location: 'Perungudi, Chennai',
    isCertified: true,
    hasWarranty: true,
    hasRcTransfer: true,
    hasFiveDayMoney: true,
    ownerType: 'First owner',
    bodyType: 'Mini Truck',
    sellerType: 'Certified EV Dealer',
    seats: 2,
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80'
    ]
  }
];
