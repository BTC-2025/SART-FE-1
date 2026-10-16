export interface VehicleVariant {
  id: string;
  name: string;
  fuel: string;
  transmission: string;
  exShowroom: number;
  onRoadPrice: number;
  engine: string;
  mileage: string;
}

export interface VehicleModelItem {
  id: string;
  name: string;
  brand: string;
  category: 'Car' | 'Bike' | 'Scooter' | 'EV' | 'Commercial' | 'Auto' | 'Van' | 'Lorry' | 'Bus' | 'Tractor';
  image: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  variants: VehicleVariant[];
  alternatives: {
    name: string;
    price: string;
    img: string;
    emiBtn: string;
  }[];
}

export const VEHICLE_EMI_CATALOG: VehicleModelItem[] = [
  // -------------------------------------------------------------
  // 1. CARS & SUVS
  // -------------------------------------------------------------
  {
    id: 'car-sierra',
    name: 'Tata Sierra',
    brand: 'Tata Motors',
    category: 'Car',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewCount: 209,
    priceRange: '₹11.49 - 21.59 Lakh*',
    variants: [
      { id: 'sierra-smart-plus', name: 'Smart Plus (Petrol 1.5L Manual)', fuel: 'Petrol', transmission: 'Manual', exShowroom: 1149000, onRoadPrice: 1311000, engine: '1498cc Turbo Petrol', mileage: '16.5 kmpl' },
      { id: 'sierra-pure', name: 'Pure Edition (Petrol 1.5L AMT)', fuel: 'Petrol', transmission: 'Automatic', exShowroom: 1320000, onRoadPrice: 1495000, engine: '1498cc Turbo Petrol', mileage: '15.8 kmpl' },
      { id: 'sierra-adventure-plus', name: 'Adventure Plus (Diesel 2.0L Manual)', fuel: 'Diesel', transmission: 'Manual', exShowroom: 1548000, onRoadPrice: 1748000, engine: '1956cc Kryotec Diesel', mileage: '18.2 kmpl' },
      { id: 'sierra-accomplished', name: 'Accomplished Plus (Diesel 2.0L AT 4x4)', fuel: 'Diesel', transmission: 'Automatic', exShowroom: 1890000, onRoadPrice: 2159000, engine: '1956cc Kryotec Diesel', mileage: '17.0 kmpl' }
    ],
    alternatives: [
      { name: 'Kia Seltos', price: '₹10.90 - 20.35 Lakh*', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Seltos EMI' },
      { name: 'Tata Harrier', price: '₹14.99 - 26.44 Lakh*', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80', emiBtn: 'Harrier EMI' },
      { name: 'Hyundai Creta', price: '₹11.00 - 20.15 Lakh*', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80', emiBtn: 'Creta EMI' }
    ]
  },
  {
    id: 'car-nexon',
    name: 'Tata Nexon Facelift',
    brand: 'Tata Motors',
    category: 'Car',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewCount: 345,
    priceRange: '₹8.00 - 15.80 Lakh*',
    variants: [
      { id: 'nexon-smart', name: 'Smart 1.2L Revotron (Petrol)', fuel: 'Petrol', transmission: 'Manual', exShowroom: 799990, onRoadPrice: 915000, engine: '1199cc Turbo Petrol', mileage: '17.44 kmpl' },
      { id: 'nexon-pure', name: 'Pure 1.2L Petrol (Sunroof)', fuel: 'Petrol', transmission: 'Manual', exShowroom: 979990, onRoadPrice: 1120000, engine: '1199cc Turbo Petrol', mileage: '17.44 kmpl' },
      { id: 'nexon-creative', name: 'Creative Plus 1.5L Diesel DCA', fuel: 'Diesel', transmission: 'Dual-Clutch AT', exShowroom: 1229990, onRoadPrice: 1410000, engine: '1497cc Revotorq Diesel', mileage: '24.08 kmpl' },
      { id: 'nexon-fearless', name: 'Fearless Plus S Diesel DCA Dual-Tone', fuel: 'Diesel', transmission: 'Dual-Clutch AT', exShowroom: 1379990, onRoadPrice: 1580000, engine: '1497cc Revotorq Diesel', mileage: '23.20 kmpl' }
    ],
    alternatives: [
      { name: 'Maruti Brezza', price: '₹8.34 - 14.14 Lakh*', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80', emiBtn: 'Brezza EMI' },
      { name: 'Hyundai Venue', price: '₹7.94 - 13.48 Lakh*', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80', emiBtn: 'Venue EMI' },
      { name: 'Kia Sonet', price: '₹7.99 - 15.75 Lakh*', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Sonet EMI' }
    ]
  },
  {
    id: 'car-creta',
    name: 'Hyundai Creta 2024',
    brand: 'Hyundai',
    category: 'Car',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    reviewCount: 412,
    priceRange: '₹11.00 - 20.15 Lakh*',
    variants: [
      { id: 'creta-e', name: 'E 1.5L Petrol Manual', fuel: 'Petrol', transmission: 'Manual', exShowroom: 1099900, onRoadPrice: 1270000, engine: '1497cc MPi Petrol', mileage: '17.4 kmpl' },
      { id: 'creta-ex', name: 'EX 1.5L Diesel Manual', fuel: 'Diesel', transmission: 'Manual', exShowroom: 1368000, onRoadPrice: 1575000, engine: '1493cc U2 CRDi Diesel', mileage: '21.8 kmpl' },
      { id: 'creta-sx-tech', name: 'SX (Tech) 1.5L Turbo Petrol DCT ADAS', fuel: 'Petrol', transmission: 'Dual-Clutch AT', exShowroom: 1598000, onRoadPrice: 1845000, engine: '1482cc Turbo GDi', mileage: '18.4 kmpl' },
      { id: 'creta-sx-opt', name: 'SX (O) 1.5L Diesel Automatic Knight', fuel: 'Diesel', transmission: 'Automatic', exShowroom: 1748000, onRoadPrice: 2015000, engine: '1493cc CRDi Diesel', mileage: '19.1 kmpl' }
    ],
    alternatives: [
      { name: 'Kia Seltos', price: '₹10.90 - 20.35 Lakh*', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Seltos EMI' },
      { name: 'Maruti Grand Vitara', price: '₹10.87 - 19.97 Lakh*', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80', emiBtn: 'Vitara EMI' },
      { name: 'Honda Elevate', price: '₹11.69 - 16.51 Lakh*', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80', emiBtn: 'Elevate EMI' }
    ]
  },
  {
    id: 'car-thar-roxx',
    name: 'Mahindra Thar Roxx',
    brand: 'Mahindra',
    category: 'Car',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 180,
    priceRange: '₹12.99 - 22.49 Lakh*',
    variants: [
      { id: 'thar-mx1', name: 'MX1 Petrol Manual RWD', fuel: 'Petrol', transmission: 'Manual', exShowroom: 1299000, onRoadPrice: 1489000, engine: '2.0L mStallion Turbo', mileage: '14.0 kmpl' },
      { id: 'thar-mx3', name: 'MX3 Diesel Manual RWD', fuel: 'Diesel', transmission: 'Manual', exShowroom: 1499000, onRoadPrice: 1720000, engine: '2.2L mHawk Diesel', mileage: '15.2 kmpl' },
      { id: 'thar-ax5l', name: 'AX5L Diesel Automatic RWD (Level 2 ADAS)', fuel: 'Diesel', transmission: 'Automatic', exShowroom: 1899000, onRoadPrice: 2175000, engine: '2.2L mHawk Diesel', mileage: '14.6 kmpl' },
      { id: 'thar-ax7l-4x4', name: 'AX7L Diesel Automatic 4x4 (Panoramic Sunroof)', fuel: 'Diesel', transmission: 'Automatic 4x4', exShowroom: 2049000, onRoadPrice: 2249000, engine: '2.2L mHawk High Output', mileage: '13.8 kmpl' }
    ],
    alternatives: [
      { name: 'Force Gurkha 5-Door', price: '₹16.75 - 18.00 Lakh*', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Gurkha EMI' },
      { name: 'Scorpio-N', price: '₹13.85 - 24.54 Lakh*', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500&q=80', emiBtn: 'Scorpio-N EMI' }
    ]
  },
  {
    id: 'car-brezza',
    name: 'Maruti Suzuki Brezza',
    brand: 'Maruti Suzuki',
    category: 'Car',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    rating: 4.82,
    reviewCount: 310,
    priceRange: '₹8.34 - 14.14 Lakh*',
    variants: [
      { id: 'brezza-lxi', name: 'LXi 1.5L Smart Hybrid Manual', fuel: 'Petrol', transmission: 'Manual', exShowroom: 834000, onRoadPrice: 955000, engine: '1462cc K15C DualJet', mileage: '19.89 kmpl' },
      { id: 'brezza-vxi-cng', name: 'VXi S-CNG Factory Fitted', fuel: 'CNG', transmission: 'Manual', exShowroom: 1064000, onRoadPrice: 1210000, engine: '1462cc K15C CNG', mileage: '25.51 km/kg' },
      { id: 'brezza-zxi-at', name: 'ZXi Plus 6-Speed AT with Paddle Shifter', fuel: 'Petrol', transmission: 'Automatic', exShowroom: 1398000, onRoadPrice: 1595000, engine: '1462cc K15C DualJet', mileage: '19.80 kmpl' }
    ],
    alternatives: [
      { name: 'Tata Nexon', price: '₹8.00 - 15.80 Lakh*', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Nexon EMI' },
      { name: 'Hyundai Venue', price: '₹7.94 - 13.48 Lakh*', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80', emiBtn: 'Venue EMI' }
    ]
  },

  // -------------------------------------------------------------
  // 2. SCOOTERS
  // -------------------------------------------------------------
  {
    id: 'scooter-activa',
    name: 'Honda Activa 6G',
    brand: 'Honda 2Wheelers',
    category: 'Scooter',
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewCount: 840,
    priceRange: '₹76,364 - 91,480',
    variants: [
      { id: 'activa-std', name: 'Standard (Drum Brakes / Steel Wheels)', fuel: 'Petrol', transmission: 'CVT Automatic', exShowroom: 76364, onRoadPrice: 91500, engine: '109.5cc PGM-FI', mileage: '50 kmpl' },
      { id: 'activa-dlx', name: 'Deluxe (LED Headlamp / Digital Display)', fuel: 'Petrol', transmission: 'CVT Automatic', exShowroom: 81364, onRoadPrice: 97500, engine: '109.5cc PGM-FI', mileage: '50 kmpl' },
      { id: 'activa-hsmart', name: 'H-Smart (Keyless Smart Start / Anti-Theft)', fuel: 'Petrol', transmission: 'CVT Automatic', exShowroom: 83864, onRoadPrice: 100500, engine: '109.5cc PGM-FI', mileage: '50 kmpl' }
    ],
    alternatives: [
      { name: 'TVS Jupiter 110', price: '₹74,130 - 89,830', img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80', emiBtn: 'Jupiter EMI' },
      { name: 'Suzuki Access 125', price: '₹82,190 - 1.01 Lakh', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80', emiBtn: 'Access EMI' }
    ]
  },
  {
    id: 'scooter-jupiter',
    name: 'TVS Jupiter 125',
    brand: 'TVS Motor',
    category: 'Scooter',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    rating: 4.84,
    reviewCount: 610,
    priceRange: '₹79,500 - 98,200',
    variants: [
      { id: 'jup-drum', name: 'Drum Sheet Metal Alloy', fuel: 'Petrol', transmission: 'CVT Automatic', exShowroom: 79500, onRoadPrice: 93800, engine: '124.8cc ETFi Engine', mileage: '52 kmpl' },
      { id: 'jup-disc', name: 'Disc SmartXonnect BT Connectivity', fuel: 'Petrol', transmission: 'CVT Automatic', exShowroom: 87500, onRoadPrice: 103200, engine: '124.8cc ETFi Engine', mileage: '50 kmpl' }
    ],
    alternatives: [
      { name: 'Honda Activa 6G', price: '₹76,364 - 91,480', img: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=500&q=80', emiBtn: 'Activa EMI' },
      { name: 'Suzuki Access 125', price: '₹82,190 - 1.01 Lakh', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80', emiBtn: 'Access EMI' }
    ]
  },
  {
    id: 'scooter-ntorq',
    name: 'TVS NTORQ 125',
    brand: 'TVS Motor',
    category: 'Scooter',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    reviewCount: 520,
    priceRange: '₹84,850 - 1.05 Lakh',
    variants: [
      { id: 'ntorq-drum', name: 'Drum Brake Commuter', fuel: 'Petrol', transmission: 'CVT Automatic', exShowroom: 84850, onRoadPrice: 101500, engine: '124.8cc 3-Valve Fi', mileage: '47 kmpl' },
      { id: 'ntorq-disc', name: 'Disc Brake SmartXonnect', fuel: 'Petrol', transmission: 'CVT Automatic', exShowroom: 89900, onRoadPrice: 107500, engine: '124.8cc 3-Valve Fi', mileage: '47 kmpl' },
      { id: 'ntorq-race-xp', name: 'Race XP (Dual Ride Modes + 10.2 PS)', fuel: 'Petrol', transmission: 'CVT Automatic', exShowroom: 97850, onRoadPrice: 116500, engine: '124.8cc High Output', mileage: '45 kmpl' }
    ],
    alternatives: [
      { name: 'Yamaha Ray ZR 125', price: '₹80,680 - 94,500', img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80', emiBtn: 'Ray ZR EMI' },
      { name: 'Honda Dio 125', price: '₹84,500 - 92,800', img: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=500&q=80', emiBtn: 'Dio EMI' }
    ]
  },

  // -------------------------------------------------------------
  // 3. BIKES & MOTORCYCLES
  // -------------------------------------------------------------
  {
    id: 'bike-classic350',
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    category: 'Bike',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    rating: 4.88,
    reviewCount: 760,
    priceRange: '₹1.93 - 2.30 Lakh',
    variants: [
      { id: 'classic-heritage', name: 'Heritage Series (Single Channel ABS)', fuel: 'Petrol', transmission: '5-Speed Manual', exShowroom: 193000, onRoadPrice: 226000, engine: '349cc J-Series Air-Oil Cooled', mileage: '37 kmpl' },
      { id: 'classic-signals', name: 'Signals Edition (Dual Channel ABS)', fuel: 'Petrol', transmission: '5-Speed Manual', exShowroom: 216000, onRoadPrice: 252000, engine: '349cc J-Series Air-Oil Cooled', mileage: '37 kmpl' },
      { id: 'classic-dark', name: 'Dark Stealth Black (Alloy Wheels + Tubeless)', fuel: 'Petrol', transmission: '5-Speed Manual', exShowroom: 225000, onRoadPrice: 262000, engine: '349cc J-Series Air-Oil Cooled', mileage: '36 kmpl' },
      { id: 'classic-emerald', name: 'Emerald Chrome Deluxe (Dual Disc ABS)', fuel: 'Petrol', transmission: '5-Speed Manual', exShowroom: 230000, onRoadPrice: 268000, engine: '349cc J-Series Air-Oil Cooled', mileage: '36 kmpl' }
    ],
    alternatives: [
      { name: 'Honda Hness CB350', price: '₹2.10 - 2.16 Lakh', img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80', emiBtn: 'CB350 EMI' },
      { name: 'Jawa 350', price: '₹1.99 - 2.15 Lakh', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80', emiBtn: 'Jawa EMI' }
    ]
  },
  {
    id: 'bike-r15',
    name: 'Yamaha R15 V4',
    brand: 'Yamaha',
    category: 'Bike',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 480,
    priceRange: '₹1.73 - 1.98 Lakh',
    variants: [
      { id: 'r15-metallic-red', name: 'Metallic Red Edition (Dual ABS + TCS)', fuel: 'Petrol', transmission: '6-Speed Manual / Quickshifter', exShowroom: 173000, onRoadPrice: 204000, engine: '155cc Liquid-Cooled 4V VVA', mileage: '48 kmpl' },
      { id: 'r15-racing-blue', name: 'Racing Blue (Quickshifter Standard)', fuel: 'Petrol', transmission: '6-Speed Manual', exShowroom: 187000, onRoadPrice: 219000, engine: '155cc Liquid-Cooled 4V VVA', mileage: '48 kmpl' },
      { id: 'r15m-carbon', name: 'R15M Carbon Edition (TFT Display + Lap Timer)', fuel: 'Petrol', transmission: '6-Speed Quickshifter', exShowroom: 198000, onRoadPrice: 232000, engine: '155cc Liquid-Cooled 4V VVA', mileage: '46 kmpl' }
    ],
    alternatives: [
      { name: 'KTM RC 200', price: '₹2.18 Lakh', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80', emiBtn: 'RC 200 EMI' },
      { name: 'Suzuki Gixxer SF 250', price: '₹1.92 - 2.05 Lakh', img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80', emiBtn: 'Gixxer EMI' }
    ]
  },
  {
    id: 'bike-splendor',
    name: 'Hero Splendor Plus XTEC',
    brand: 'Hero MotoCorp',
    category: 'Bike',
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=600&q=80',
    rating: 4.82,
    reviewCount: 920,
    priceRange: '₹75,441 - 83,000',
    variants: [
      { id: 'splendor-std', name: 'Drum Brake Self Cast', fuel: 'Petrol', transmission: '4-Speed Manual', exShowroom: 75441, onRoadPrice: 89500, engine: '97.2cc Air-Cooled 4-Stroke', mileage: '70 kmpl' },
      { id: 'splendor-xtec', name: 'XTEC Bluetooth Digital Console', fuel: 'Petrol', transmission: '4-Speed Manual', exShowroom: 79900, onRoadPrice: 94800, engine: '97.2cc xSens FI', mileage: '68 kmpl' }
    ],
    alternatives: [
      { name: 'Bajaj Platina 110', price: '₹68,600 - 79,200', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80', emiBtn: 'Platina EMI' },
      { name: 'Honda Shine 100', price: '₹65,000 - 75,000', img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80', emiBtn: 'Shine EMI' }
    ]
  },

  // -------------------------------------------------------------
  // 4. ELECTRIC VEHICLES (EV)
  // -------------------------------------------------------------
  {
    id: 'car-curvv',
    name: 'Tata Curvv EV',
    brand: 'Tata Motors',
    category: 'EV',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewCount: 98,
    priceRange: '₹17.49 - 21.99 Lakh*',
    variants: [
      { id: 'curvv-creative-45', name: 'Creative 45 (45 kWh Battery - 502 km Range)', fuel: 'Electric', transmission: 'Automatic', exShowroom: 1749000, onRoadPrice: 1845000, engine: 'PMSM 150 PS Motor', mileage: '502 km / charge' },
      { id: 'curvv-accomplished-55', name: 'Accomplished 55 (55 kWh - 585 km Range)', fuel: 'Electric', transmission: 'Automatic', exShowroom: 1925000, onRoadPrice: 2030000, engine: 'PMSM 167 PS Motor', mileage: '585 km / charge' },
      { id: 'curvv-empowered-55', name: 'Empowered Plus 55 (Level 2 ADAS + V2L/V2V)', fuel: 'Electric', transmission: 'Automatic', exShowroom: 2199000, onRoadPrice: 2315000, engine: 'PMSM 167 PS Motor', mileage: '585 km / charge' }
    ],
    alternatives: [
      { name: 'MG ZS EV', price: '₹18.98 - 25.44 Lakh*', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=500&q=80', emiBtn: 'MG ZS EMI' },
      { name: 'BYD Atto 3', price: '₹24.99 - 33.99 Lakh*', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'BYD EMI' }
    ]
  },
  {
    id: 'scooter-olas1',
    name: 'OLA S1 Pro Gen 2',
    brand: 'Ola Electric',
    category: 'EV',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewCount: 390,
    priceRange: '₹1.15 - 1.34 Lakh',
    variants: [
      { id: 'ola-s1-air', name: 'S1 Air (3 kWh Battery - 151 km Range)', fuel: 'Electric', transmission: 'Automatic', exShowroom: 104999, onRoadPrice: 116500, engine: 'Hub Motor 6 kW Peak', mileage: '151 km / charge' },
      { id: 'ola-s1-pro', name: 'S1 Pro Gen 2 (4 kWh Battery - 195 km Range / 120 km/h)', fuel: 'Electric', transmission: 'Automatic', exShowroom: 133999, onRoadPrice: 147500, engine: 'Mid-Drive 11 kW Peak', mileage: '195 km / charge' }
    ],
    alternatives: [
      { name: 'Ather 450X', price: '₹1.41 - 1.55 Lakh', img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=500&q=80', emiBtn: 'Ather EMI' },
      { name: 'Bajaj Chetak EV', price: '₹99,800 - 1.25 Lakh', img: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=500&q=80', emiBtn: 'Chetak EMI' }
    ]
  },

  // -------------------------------------------------------------
  // 5. COMMERCIAL VANS
  // -------------------------------------------------------------
  {
    id: 'van-eeco',
    name: 'Maruti Suzuki Eeco',
    brand: 'Maruti Suzuki (Eeco/Omni)',
    category: 'Van',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    rating: 4.78,
    reviewCount: 280,
    priceRange: '₹5.32 - 6.58 Lakh',
    variants: [
      { id: 'eeco-5str', name: '5-Seater Standard (Petrol 1.2L)', fuel: 'Petrol', transmission: '5-Speed Manual', exShowroom: 532000, onRoadPrice: 615000, engine: '1.2L Advanced K-Series DualJet', mileage: '19.71 kmpl' },
      { id: 'eeco-7str', name: '7-Seater Standard (Family Tour)', fuel: 'Petrol', transmission: '5-Speed Manual', exShowroom: 561000, onRoadPrice: 648000, engine: '1.2L DualJet Dual VVT', mileage: '19.71 kmpl' },
      { id: 'eeco-cng', name: '5-Seater AC S-CNG Factory Fitted', fuel: 'CNG', transmission: '5-Speed Manual', exShowroom: 658000, onRoadPrice: 755000, engine: '1.2L K-Series CNG', mileage: '26.78 km/kg' }
    ],
    alternatives: [
      { name: 'Tata Magic Express', price: '₹7.14 - 8.35 Lakh', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=80', emiBtn: 'Magic EMI' },
      { name: 'Mahindra Supro Van', price: '₹6.80 - 7.90 Lakh', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Supro EMI' }
    ]
  },
  {
    id: 'van-traveller',
    name: 'Force Traveller 3350',
    brand: 'Force Motors (Traveller)',
    category: 'Van',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    reviewCount: 140,
    priceRange: '₹15.80 - 18.90 Lakh',
    variants: [
      { id: 'traveller-13str', name: '3350 WB (13+Driver AC Luxury Seating)', fuel: 'Diesel', transmission: '5-Speed Manual Synchromesh', exShowroom: 1580000, onRoadPrice: 1795000, engine: 'FM 2.6L CR ED Turbo Diesel', mileage: '11.5 kmpl' },
      { id: 'traveller-17str', name: '3700 WB (17+Driver High Roof AC)', fuel: 'Diesel', transmission: '5-Speed Manual Synchromesh', exShowroom: 1740000, onRoadPrice: 1980000, engine: 'FM 2.6L CR ED 115 HP', mileage: '10.8 kmpl' }
    ],
    alternatives: [
      { name: 'Tata Winger Tourist', price: '₹16.50 - 19.20 Lakh', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=80', emiBtn: 'Winger EMI' },
      { name: 'Force Urbania Luxury', price: '₹29.50 - 34.00 Lakh', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Urbania EMI' }
    ]
  },

  // -------------------------------------------------------------
  // 6. LORRIES & HEAVY TRUCKS
  // -------------------------------------------------------------
  {
    id: 'lorry-signa-2823',
    name: 'Tata Signa 2823 Tipper',
    brand: 'Tata Motors Commercial',
    category: 'Lorry',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
    rating: 4.86,
    reviewCount: 95,
    priceRange: '₹37.50 - 41.20 Lakh',
    variants: [
      { id: 'signa-14cum', name: 'Signa 2823.TK 14m³ Box Body Cabin', fuel: 'Diesel', transmission: '9-Speed Manual Heavy Duty', exShowroom: 3750000, onRoadPrice: 4125000, engine: 'Cummins ISBe 5.6L 230 HP', mileage: '4.8 km/l' },
      { id: 'signa-16cum', name: 'Signa 2823.TK 16m³ Box Body HD Hub', fuel: 'Diesel', transmission: '9-Speed Manual Heavy Duty', exShowroom: 3980000, onRoadPrice: 4375000, engine: 'Cummins ISBe 5.6L 230 HP', mileage: '4.5 km/l' }
    ],
    alternatives: [
      { name: 'Ashok Leyland 2820', price: '₹31.20 - 36.50 Lakh', img: 'https://images.unsplash.com/photo-1586191582056-a607185d5656?auto=format&fit=crop&w=500&q=80', emiBtn: 'AL 2820 EMI' },
      { name: 'BharatBenz 2823R', price: '₹38.90 - 42.10 Lakh', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=500&q=80', emiBtn: 'Benz 2823 EMI' }
    ]
  },
  {
    id: 'lorry-ashok-dost',
    name: 'Ashok Leyland Bada Dost i4',
    brand: 'Ashok Leyland',
    category: 'Lorry',
    image: 'https://images.unsplash.com/photo-1586191582056-a607185d5656?auto=format&fit=crop&w=600&q=80',
    rating: 4.84,
    reviewCount: 175,
    priceRange: '₹8.72 - 9.47 Lakh',
    variants: [
      { id: 'dost-fbd', name: 'Bada Dost i4 Fixed Side Deck (FSD)', fuel: 'Diesel', transmission: '5-Speed Manual with Cable Shift', exShowroom: 872000, onRoadPrice: 975000, engine: '1.5L 3-Cylinder P15 Turbo', mileage: '15.5 kmpl' },
      { id: 'dost-hsd', name: 'Bada Dost i4 High Side Deck (HSD)', fuel: 'Diesel', transmission: '5-Speed Manual with Cable Shift', exShowroom: 902000, onRoadPrice: 1010000, engine: '1.5L 80 HP Turbo Diesel', mileage: '15.0 kmpl' }
    ],
    alternatives: [
      { name: 'Tata Intra V30', price: '₹8.10 - 8.90 Lakh', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=500&q=80', emiBtn: 'Intra EMI' },
      { name: 'Mahindra Bolero Maxi Truck', price: '₹7.60 - 8.35 Lakh', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Bolero EMI' }
    ]
  },

  // -------------------------------------------------------------
  // 7. PASSENGER BUSES
  // -------------------------------------------------------------
  {
    id: 'bus-ashok-viking',
    name: 'Ashok Leyland Viking Passenger Bus',
    brand: 'Ashok Leyland',
    category: 'Bus',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    rating: 4.88,
    reviewCount: 88,
    priceRange: '₹28.50 - 34.00 Lakh',
    variants: [
      { id: 'viking-chassis', name: 'Viking 222 WB Bus Chassis Only', fuel: 'Diesel', transmission: '6-Speed Overdrive Manual', exShowroom: 2850000, onRoadPrice: 3180000, engine: 'H-Series 6-Cyl CRS 197 HP iGen-6', mileage: '5.2 km/l' },
      { id: 'viking-built-ac', name: 'Viking 42-Seater Fully Built AC Coach', fuel: 'Diesel', transmission: '6-Speed Overdrive Manual', exShowroom: 3500000, onRoadPrice: 3890000, engine: 'H-Series 6-Cyl CRS 197 HP iGen-6', mileage: '4.8 km/l' }
    ],
    alternatives: [
      { name: 'Tata Starbus Ultra', price: '₹29.00 - 36.50 Lakh', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=500&q=80', emiBtn: 'Starbus EMI' },
      { name: 'Eicher Skyline Pro', price: '₹26.50 - 32.00 Lakh', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=500&q=80', emiBtn: 'Skyline EMI' }
    ]
  },
  {
    id: 'bus-tata-starbus',
    name: 'Tata Starbus Ultra 34-Seater',
    brand: 'Tata Motors Bus',
    category: 'Bus',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    reviewCount: 110,
    priceRange: '₹29.20 - 35.80 Lakh',
    variants: [
      { id: 'starbus-school', name: '34-Seater School Bus High Safety', fuel: 'Diesel', transmission: '6-Speed Manual Cable Shift', exShowroom: 2920000, onRoadPrice: 3260000, engine: '3.8L SGI BS6 Turbo', mileage: '5.5 km/l' },
      { id: 'starbus-staff-ac', name: '34-Seater Executive Push-Back AC', fuel: 'Diesel', transmission: '6-Speed Manual Cable Shift', exShowroom: 3380000, onRoadPrice: 3770000, engine: '3.8L SGI BS6 Turbo', mileage: '5.0 km/l' }
    ],
    alternatives: [
      { name: 'Ashok Leyland Viking', price: '₹28.50 - 34.00 Lakh', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=500&q=80', emiBtn: 'Viking EMI' },
      { name: 'BharatBenz 917 Bus', price: '₹34.00 - 39.50 Lakh', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=500&q=80', emiBtn: 'Benz Bus EMI' }
    ]
  },

  // -------------------------------------------------------------
  // 8. AUTO RICKSHAWS (3-WHEELERS)
  // -------------------------------------------------------------
  {
    id: 'auto-bajaj-re',
    name: 'Bajaj RE Compact 4S',
    brand: 'Bajaj Auto (RE)',
    category: 'Auto',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewCount: 160,
    priceRange: '₹2.34 - 2.55 Lakh',
    variants: [
      { id: 're-cng', name: 'Compact 4S Factory CNG Kit', fuel: 'CNG', transmission: '4-Speed Manual Hand Shift', exShowroom: 234000, onRoadPrice: 258000, engine: '236cc DTS-i 4-Stroke', mileage: '36 km/kg' },
      { id: 're-petrol', name: 'Compact 4S Petrol Passenger Auto', fuel: 'Petrol', transmission: '4-Speed Manual Hand Shift', exShowroom: 221000, onRoadPrice: 244000, engine: '236cc DTS-i Petrol', mileage: '28 kmpl' }
    ],
    alternatives: [
      { name: 'Piaggio Ape DX', price: '₹2.25 - 2.45 Lakh', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Ape EMI' },
      { name: 'Mahindra Alfa', price: '₹2.30 - 2.50 Lakh', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=500&q=80', emiBtn: 'Alfa EMI' }
    ]
  },
  {
    id: 'auto-piaggio-ape',
    name: 'Piaggio Ape Auto DX',
    brand: 'Piaggio Ape',
    category: 'Auto',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rating: 4.82,
    reviewCount: 135,
    priceRange: '₹2.25 - 2.65 Lakh',
    variants: [
      { id: 'ape-diesel', name: 'Ape DX Passenger Diesel', fuel: 'Diesel', transmission: '4-Speed Constant Mesh', exShowroom: 242000, onRoadPrice: 268000, engine: '599cc Water-Cooled Diesel', mileage: '32 kmpl' },
      { id: 'ape-cng', name: 'Ape City Plus CNG Passenger', fuel: 'CNG', transmission: '4-Speed Constant Mesh', exShowroom: 225000, onRoadPrice: 250000, engine: '230cc 3-Valve CNG', mileage: '35 km/kg' }
    ],
    alternatives: [
      { name: 'Bajaj RE Compact 4S', price: '₹2.34 - 2.55 Lakh', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Bajaj RE EMI' },
      { name: 'TVS King Deluxe', price: '₹2.18 - 2.40 Lakh', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'TVS King EMI' }
    ]
  },

  // -------------------------------------------------------------
  // 9. AGRI TRACTORS & FARM EQUIPMENT
  // -------------------------------------------------------------
  {
    id: 'tractor-mahindra-575',
    name: 'Mahindra 575 DI XP Plus',
    brand: 'Mahindra Tractor',
    category: 'Tractor',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewCount: 240,
    priceRange: '₹6.75 - 7.20 Lakh',
    variants: [
      { id: 'mah-575-2wd', name: '575 DI XP Plus (47 HP 2WD Partial Synchro)', fuel: 'Diesel', transmission: '8 Forward + 2 Reverse', exShowroom: 675000, onRoadPrice: 725000, engine: '2979cc 4-Cylinder ELS', mileage: '5.5 L/hr' },
      { id: 'mah-575-ps', name: '575 DI XP Plus Power Steering Oil Brakes', fuel: 'Diesel', transmission: '8 Forward + 2 Reverse', exShowroom: 710000, onRoadPrice: 760000, engine: '2979cc 4-Cylinder 47 HP', mileage: '5.4 L/hr' }
    ],
    alternatives: [
      { name: 'Swaraj 744 FE', price: '₹6.90 - 7.40 Lakh', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Swaraj EMI' },
      { name: 'John Deere 5050 D', price: '₹7.80 - 8.30 Lakh', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'John Deere EMI' }
    ]
  },
  {
    id: 'tractor-swaraj-744',
    name: 'Swaraj 744 FE',
    brand: 'Swaraj',
    category: 'Tractor',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    rating: 4.88,
    reviewCount: 195,
    priceRange: '₹6.90 - 7.40 Lakh',
    variants: [
      { id: 'swaraj-744-std', name: '744 FE (48 HP 3-Cylinder Fuel Efficient)', fuel: 'Diesel', transmission: '8 Forward + 2 Reverse Centre Shift', exShowroom: 690000, onRoadPrice: 742000, engine: '3136cc 3-Cylinder Direct Injection', mileage: '5.2 L/hr' },
      { id: 'swaraj-744-4wd', name: '744 XT (50 HP 4WD Heavy Puddling Special)', fuel: 'Diesel', transmission: 'Side Shift Constant Mesh', exShowroom: 785000, onRoadPrice: 840000, engine: '3478cc 3-Cylinder High Torque', mileage: '5.6 L/hr' }
    ],
    alternatives: [
      { name: 'Mahindra 575 DI', price: '₹6.75 - 7.20 Lakh', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Mahindra EMI' },
      { name: 'Sonalika DI 745', price: '₹6.80 - 7.30 Lakh', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80', emiBtn: 'Sonalika EMI' }
    ]
  }
];
