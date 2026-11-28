import { UsedCarItem } from './usedCarsData';

export const USED_BIKES_MOCK_DATA: UsedCarItem[] = [
  // 1. 2022 Royal Enfield Classic 350
  {
    id: 'ub-1',
    name: '2022 Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    year: 2022,
    variant: 'Dark Stealth Black Dual Channel ABS',
    price: '₹1.85 L',
    rawPrice: 185000,
    emi: 'EMI ₹4,210/m',
    kms: 14200,
    kmsDisplay: '14,200kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN09',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback', // Cruiser
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner | Featured',
    saveAmount: 'Save ₹12k',
    discountNumber: 12000,
    seats: 2,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'T. Nagar, Chennai',
    images: [
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Bullet Point Chennai',
      phone: '+91 98402 11990',
      type: 'Royal Enfield Specialist Hub',
      verified: true,
      rating: 4.9,
      address: 'G.N. Chetty Road, T. Nagar, Chennai - 600017',
      inspectionScore: '120-Point Multi-Point Bike Check Passed'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 2. 2023 TVS Apache RTR 160 4V
  {
    id: 'ub-2',
    name: '2023 TVS Apache RTR 160 4V',
    brand: 'TVS',
    model: 'Apache RTR 160 4V',
    year: 2023,
    variant: 'Special Edition Dual Disc SmartXonnect',
    price: '₹1.18 L',
    rawPrice: 118000,
    emi: 'EMI ₹2,750/m',
    kms: 9800,
    kmsDisplay: '9,800kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN02',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback', // Sports
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Crest Corner | Featured',
    saveAmount: 'Save ₹8k',
    discountNumber: 8000,
    seats: 2,
    badges: ['Certified', 'Warranty'],
    location: 'Anna Nagar, Chennai',
    images: [
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Rider Zone Chennai',
      phone: '+91 94445 22118',
      type: 'Certified 2-Wheeler Hub',
      verified: true,
      rating: 4.8,
      address: '2nd Avenue, Anna Nagar, Chennai',
      inspectionScore: 'Clean Chassis & Engine Health Verified'
    },
    isCertified: true,
    isPriceDrop: false,
    isLuxury: false
  },

  // 3. 2021 Bajaj Pulsar NS200
  {
    id: 'ub-3',
    name: '2021 Bajaj Pulsar NS200',
    brand: 'Bajaj',
    model: 'Pulsar NS200',
    year: 2021,
    variant: 'BS6 Fi Dual Channel ABS',
    price: '₹1.12 L',
    rawPrice: 112000,
    emi: 'EMI ₹2,600/m',
    kms: 18400,
    kmsDisplay: '18,400kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN10',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback', // Sports
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner',
    saveAmount: 'Save ₹10k',
    discountNumber: 10000,
    seats: 2,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'Thiruverkadu, Chennai',
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'City Two Wheelers Thiruverkadu',
      phone: '+91 98409 88771',
      type: 'Verified Consignment Seller',
      verified: true,
      rating: 4.7,
      address: 'Trunk Road, Thiruverkadu, Chennai',
      inspectionScore: 'Certified Brake, Tyre & Engine Status'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 4. 2023 Yamaha MT-15 V2
  {
    id: 'ub-4',
    name: '2023 Yamaha MT-15 V2',
    brand: 'Yamaha',
    model: 'MT-15 V2',
    year: 2023,
    variant: 'Metallic Black Deluxe',
    price: '₹1.48 L',
    rawPrice: 148000,
    emi: 'EMI ₹3,450/m',
    kms: 8200,
    kmsDisplay: '8,200kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN07',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback', // Sports
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner | Featured',
    saveAmount: 'Save ₹15k',
    discountNumber: 15000,
    seats: 2,
    badges: ['Certified', 'Warranty', '5-Day Money Back'],
    location: 'Adyar, Chennai',
    images: [
      'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'South Metro Bikes Adyar',
      phone: '+91 98841 00223',
      type: 'Yamaha Certified Partner',
      verified: true,
      rating: 4.9,
      address: 'L.B. Road, Adyar, Chennai - 600020',
      inspectionScore: '140-Point Pre-Delivery Quality Passed'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 5. 2022 KTM 390 Duke
  {
    id: 'ub-5',
    name: '2022 KTM 390 Duke',
    brand: 'KTM',
    model: '390 Duke',
    year: 2022,
    variant: 'BS6 Quickshifter+ Cornering ABS',
    price: '₹2.45 L',
    rawPrice: 245000,
    emi: 'EMI ₹5,800/m',
    kms: 11500,
    kmsDisplay: '11,500kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN01',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback', // Performance
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner | Featured',
    saveAmount: 'Save ₹20k',
    discountNumber: 20000,
    seats: 2,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'Nungambakkam, Chennai',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Speed Kraft Performance Bikes',
      phone: '+91 97909 33221',
      type: 'Premium Superbike Outlet',
      verified: true,
      rating: 4.9,
      address: 'Cathedral Road, Chennai - 600086',
      inspectionScore: 'Dyno & Track Diagnostics Clean'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: true
  },

  // 6. 2023 Hero Splendor+ XTEC
  {
    id: 'ub-6',
    name: '2023 Hero Splendor+',
    brand: 'Hero',
    model: 'Splendor+ XTEC',
    year: 2023,
    variant: 'XTEC i3S Bluetooth Digital Console',
    price: '₹68,000',
    rawPrice: 68000,
    emi: 'EMI ₹1,650/m',
    kms: 6400,
    kmsDisplay: '6,400kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN10',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback', // Commuter
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner',
    saveAmount: 'Save ₹5k',
    discountNumber: 5000,
    seats: 2,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'Tambaram, Chennai',
    images: [
      'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Tambaram Two Wheeler Bazar',
      phone: '+91 94440 66554',
      type: 'Hero Authorized Reseller',
      verified: true,
      rating: 4.7,
      address: 'GST Road, Tambaram Sanatorium, Chennai',
      inspectionScore: 'Mileage 65+ km/l Certified'
    },
    isCertified: true,
    isPriceDrop: false,
    isLuxury: false
  },

  // 7. 2023 Honda Activa 6G
  {
    id: 'ub-7',
    name: '2023 Honda Activa',
    brand: 'Honda',
    model: 'Activa 6G',
    year: 2023,
    variant: 'DLX H-Smart Keyless',
    price: '₹74,000',
    rawPrice: 74000,
    emi: 'EMI ₹1,780/m',
    kms: 5800,
    kmsDisplay: '5,800kms',
    fuel: 'Petrol',
    transmission: 'Automatic',
    rto: 'TN05',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback', // Scooter
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner | Featured',
    saveAmount: 'Save ₹7k',
    discountNumber: 7000,
    seats: 2,
    badges: ['Certified', 'Warranty'],
    location: 'Velachery, Chennai',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Velachery Auto Point',
      phone: '+91 98842 11009',
      type: 'Direct Consignment Dealer',
      verified: true,
      rating: 4.8,
      address: 'Velachery Main Road, Chennai - 600042',
      inspectionScore: 'Zero Scratches • Single Hand Driven'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 8. 2023 Ather 450X (Electric)
  {
    id: 'ub-8',
    name: '2023 Ather Energy 450X',
    brand: 'Ather Energy',
    model: '450X',
    year: 2023,
    variant: 'Gen 3 Pro Pack 3.7 kWh',
    price: '₹1.15 L',
    rawPrice: 115000,
    emi: 'EMI ₹2,680/m',
    kms: 6200,
    kmsDisplay: '6,200kms',
    fuel: 'Electric',
    transmission: 'Automatic',
    rto: 'TN09',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback', // Electric Scooter
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner | Featured',
    saveAmount: 'Save ₹18k',
    discountNumber: 18000,
    seats: 2,
    badges: ['Certified', 'Warranty', '5-Day Money Back'],
    location: 'T. Nagar, Chennai',
    images: [
      'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'EV Hub Chennai',
      phone: '+91 99401 77221',
      type: 'EV Certified Specialist',
      verified: true,
      rating: 4.9,
      address: 'Bazullah Road, T. Nagar, Chennai',
      inspectionScore: 'Battery Health 98% Verified'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 9. 2023 Ola S1 Pro (Electric)
  {
    id: 'ub-9',
    name: '2023 Ola Electric S1 Pro',
    brand: 'Ola Electric',
    model: 'S1 Pro',
    year: 2023,
    variant: 'Gen 2 4kWh MoveOS 4',
    price: '₹1.08 L',
    rawPrice: 108000,
    emi: 'EMI ₹2,510/m',
    kms: 7100,
    kmsDisplay: '7,100kms',
    fuel: 'Electric',
    transmission: 'Automatic',
    rto: 'TN01',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback', // Electric Scooter
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner',
    saveAmount: 'Save ₹15k',
    discountNumber: 15000,
    seats: 2,
    badges: ['Certified', 'Warranty'],
    location: 'Anna Nagar, Chennai',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Green Wheels Chennai',
      phone: '+91 98418 33445',
      type: 'Certified Electric Store',
      verified: true,
      rating: 4.7,
      address: 'Shanti Colony, Anna Nagar, Chennai',
      inspectionScore: 'Battery & Motor Warranty Active'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 10. 2023 Kawasaki Ninja 300
  {
    id: 'ub-10',
    name: '2023 Kawasaki Ninja 300',
    brand: 'Kawasaki',
    model: 'Ninja 300',
    year: 2023,
    variant: 'Lime Green Dual ABS',
    price: '₹2.95 L',
    rawPrice: 295000,
    emi: 'EMI ₹6,900/m',
    kms: 7800,
    kmsDisplay: '7,800kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN09',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback', // Sports
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner | Featured',
    saveAmount: 'Save ₹25k',
    discountNumber: 25000,
    seats: 2,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'Nungambakkam, Chennai',
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Apex Superbikes Chennai',
      phone: '+91 98408 99881',
      type: 'Superbike Specialist Hub',
      verified: true,
      rating: 4.9,
      address: 'Kothari Road, Nungambakkam, Chennai',
      inspectionScore: 'Official Kawasaki Service Records'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: true
  },

  // 11. 2023 Triumph Speed 400
  {
    id: 'ub-11',
    name: '2023 Triumph Speed 400',
    brand: 'Triumph',
    model: 'Speed 400',
    year: 2023,
    variant: 'Carnival Red Dual Channel ABS',
    price: '₹2.10 L',
    rawPrice: 210000,
    emi: 'EMI ₹4,850/m',
    kms: 5400,
    kmsDisplay: '5,400kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN01',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback', // Roadster
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner | Featured',
    saveAmount: 'Save ₹15k',
    discountNumber: 15000,
    seats: 2,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'Guindy, Chennai',
    images: [
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'British Bike Club Chennai',
      phone: '+91 97910 88220',
      type: 'Triumph Certified Reseller',
      verified: true,
      rating: 4.9,
      address: 'Mount Road, Guindy, Chennai - 600032',
      inspectionScore: 'Factory Warranty Transferable'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: true
  },

  // 12. 2022 Suzuki Access 125
  {
    id: 'ub-12',
    name: '2022 Suzuki Access',
    brand: 'Suzuki',
    model: 'Access 125',
    year: 2022,
    variant: 'Special Edition Bluetooth Disc Alloy',
    price: '₹72,000',
    rawPrice: 72000,
    emi: 'EMI ₹1,720/m',
    kms: 11200,
    kmsDisplay: '11,200kms',
    fuel: 'Petrol',
    transmission: 'Automatic',
    rto: 'TN10',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback', // Scooter
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner',
    saveAmount: 'Save ₹6k',
    discountNumber: 6000,
    seats: 2,
    badges: ['Certified', 'Warranty'],
    location: 'Thiruverkadu, Chennai',
    images: [
      'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'West Chennai Auto Exchange',
      phone: '+91 98403 44556',
      type: 'Verified Local Dealership',
      verified: true,
      rating: 4.6,
      address: 'Poonamallee High Road, Chennai',
      inspectionScore: 'Engine Smoothness & Battery OK'
    },
    isCertified: false,
    isPriceDrop: true,
    isLuxury: false
  }
];
