export interface UsedCarItem {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  variant: string;
  price: string;
  rawPrice: number; // in rupees
  emi: string;
  kms: number;
  kmsDisplay: string;
  fuel: 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
  transmission: 'Automatic' | 'Manual';
  rto: string;
  rtoState: string;
  bodyType: 'Hatchback' | 'SUV' | 'Sedan' | 'MUV' | 'Minivan' | 'Convertible' | 'Coupe' | 'Pickup Truck';
  ownership: 'First owner' | 'Second owner' | 'Third owner or more';
  sellerType: 'All Cars' | 'Partner Cars' | 'Enterprise Cars' | 'Direct Owner Cars';
  premiumSeller?: 'Cars24' | 'Spinny';
  partnerTag: string; // 'Cars24 | Ad' | 'Crest Corner | Featured' | 'Cars24' | 'Spinny' | 'Partner | Featured' | 'Partner'
  saveAmount?: string; // 'Save ₹15k'
  discountNumber?: number; // 15000
  seats: number;
  badges: string[]; // ['Certified', 'Warranty', 'RC transfer', '5-Day Money Back']
  location: string;
  images: string[];
  sellerDetails: {
    name: string;
    phone: string;
    type: string;
    verified: boolean;
    rating: number;
    address: string;
    inspectionScore: string;
  };
  isCertified: boolean;
  isPriceDrop: boolean;
  isLuxury: boolean;
}

export const USED_CARS_MOCK_DATA: UsedCarItem[] = [
  // 1. 2018 Hyundai i20 Petrol CVT Magna Executive
  {
    id: 'uc-1',
    name: '2018 Hyundai i20',
    brand: 'Hyundai',
    model: 'i20',
    year: 2018,
    variant: 'Petrol CVT Magna Executive',
    price: '₹4.88 L',
    rawPrice: 488000,
    emi: 'EMI ₹12,101/m',
    kms: 75151,
    kmsDisplay: '75,151kms',
    fuel: 'Petrol',
    transmission: 'Automatic',
    rto: 'TN10',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback',
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    premiumSeller: 'Cars24',
    partnerTag: 'Cars24 | Ad',
    saveAmount: 'Save ₹15k',
    discountNumber: 15000,
    seats: 5,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'Thiruverkadu, Chennai',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Cars24 Hub Thiruverkadu',
      phone: '+91 98401 23456',
      type: 'Cars24 Certified Partner Hub',
      verified: true,
      rating: 4.8,
      address: 'No. 42, Trunk Road, Thiruverkadu, Chennai - 600077',
      inspectionScore: '140-Point Quality Inspection Passed'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 2. 2013 Honda City E
  {
    id: 'uc-2',
    name: '2013 Honda City',
    brand: 'Honda',
    model: 'City',
    year: 2013,
    variant: 'E',
    price: '₹5.70 L',
    rawPrice: 570000,
    emi: 'EMI ₹12,900/m',
    kms: 26000,
    kmsDisplay: '26,000kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN01',
    rtoState: 'Tamil nadu',
    bodyType: 'Sedan',
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Crest Corner | Featured',
    saveAmount: 'Save ₹18k',
    discountNumber: 18000,
    seats: 5,
    badges: ['Certified', 'Warranty'],
    location: 'Anna Nagar, Chennai',
    images: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Crest Auto Hub Anna Nagar',
      phone: '+91 94440 88219',
      type: 'Verified Franchise Partner',
      verified: true,
      rating: 4.9,
      address: '2nd Avenue, Anna Nagar West, Chennai - 600040',
      inspectionScore: '120-Point Multi-Check Passed'
    },
    isCertified: true,
    isPriceDrop: false,
    isLuxury: false
  },

  // 3. 2017 Hyundai i20 Sportz 1.2 (TN05)
  {
    id: 'uc-3',
    name: '2017 Hyundai i20',
    brand: 'Hyundai',
    model: 'i20',
    year: 2017,
    variant: 'Sportz 1.2',
    price: '₹5.16 L',
    rawPrice: 516000,
    emi: 'EMI ₹15,982/m',
    kms: 40552,
    kmsDisplay: '40,552kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN05',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback',
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    premiumSeller: 'Cars24',
    partnerTag: 'Cars24',
    saveAmount: 'Save ₹23k',
    discountNumber: 23000,
    seats: 5,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'Thiruverkadu, Chennai',
    images: [
      'https://images.unsplash.com/photo-1541348263662-e0c866659c88?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Cars24 Thiruverkadu Yard',
      phone: '+91 98402 33441',
      type: 'Cars24 Certified Store',
      verified: true,
      rating: 4.7,
      address: 'Near EVP Film City, Poonamallee Road, Chennai',
      inspectionScore: '140-Point Rigorous Test Approved'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 4. 2018 Hyundai i20 Petrol CVT Magna
  {
    id: 'uc-4',
    name: '2018 Hyundai i20',
    brand: 'Hyundai',
    model: 'i20',
    year: 2018,
    variant: 'Petrol CVT Magna',
    price: '₹5.75 L',
    rawPrice: 575000,
    emi: 'EMI ₹12,785/m',
    kms: 75715,
    kmsDisplay: '75,715kms',
    fuel: 'Petrol',
    transmission: 'Automatic',
    rto: 'TN10',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback',
    ownership: 'Second owner',
    sellerType: 'Partner Cars',
    premiumSeller: 'Cars24',
    partnerTag: 'Cars24',
    saveAmount: 'Save ₹15k',
    discountNumber: 15000,
    seats: 5,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'Thiruverkadu, Chennai',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Cars24 Mega Hub Chennai',
      phone: '+91 97910 55667',
      type: 'Cars24 Official Hub',
      verified: true,
      rating: 4.8,
      address: 'Mount Poonamallee High Road, Chennai - 600089',
      inspectionScore: '140-Point Inspection Verified'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 5. 2017 Hyundai i20 Sportz 1.2 (White)
  {
    id: 'uc-5',
    name: '2017 Hyundai i20',
    brand: 'Hyundai',
    model: 'i20',
    year: 2017,
    variant: 'Sportz 1.2',
    price: '₹4.85 L',
    rawPrice: 485000,
    emi: 'EMI ₹12,207/m',
    kms: 40561,
    kmsDisplay: '40,561kms',
    fuel: 'Petrol',
    transmission: 'Automatic',
    rto: 'TN05',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback',
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    premiumSeller: 'Cars24',
    partnerTag: 'Cars24',
    saveAmount: 'Save ₹19k',
    discountNumber: 19000,
    seats: 5,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'Thiruverkadu, Chennai',
    images: [
      'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1541348263662-e0c866659c88?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Cars24 Certified Outlet',
      phone: '+91 91760 99881',
      type: 'Certified Premium Seller',
      verified: true,
      rating: 4.9,
      address: 'Avadi Main Road, Thiruverkadu, Chennai',
      inspectionScore: '140-Point Non-Accidental Verified'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 6. 2018 Honda City i-DTEC VX
  {
    id: 'uc-6',
    name: '2018 Honda City',
    brand: 'Honda',
    model: 'City',
    year: 2018,
    variant: 'i-DTEC VX',
    price: '₹5.95 L',
    rawPrice: 595000,
    emi: 'EMI ₹12,500/m',
    kms: 28000,
    kmsDisplay: '28,000kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN01',
    rtoState: 'Tamil nadu',
    bodyType: 'Sedan',
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner | Featured',
    saveAmount: 'Save ₹20k',
    discountNumber: 20000,
    seats: 5,
    badges: ['Insured till Aug 2027'],
    location: 'Thiruverkadu, Chennai',
    images: [
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Apex Motors Chennai',
      phone: '+91 94441 33221',
      type: 'Verified Dealership Partner',
      verified: true,
      rating: 4.6,
      address: 'Koyambedu Wholesale Junction, Chennai',
      inspectionScore: '110-Point Mechanical Checked'
    },
    isCertified: false,
    isPriceDrop: true,
    isLuxury: false
  },

  // 7. 2014 Hyundai Verna 1.4 CRDi EX
  {
    id: 'uc-7',
    name: '2014 Hyundai Verna',
    brand: 'Hyundai',
    model: 'Verna',
    year: 2014,
    variant: '1.4 CRDi EX',
    price: '₹4.95 L',
    rawPrice: 495000,
    emi: 'EMI ₹10,885/m',
    kms: 49951,
    kmsDisplay: '49,951kms',
    fuel: 'Diesel',
    transmission: 'Manual',
    rto: 'TN10',
    rtoState: 'Tamil nadu',
    bodyType: 'Sedan',
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner | Featured',
    saveAmount: 'Save ₹16k',
    discountNumber: 16000,
    seats: 5,
    badges: ['★ 4.9 seller', 'Insured till Aug 2027'],
    location: 'Anna Nagar, Chennai',
    images: [
      'https://images.unsplash.com/photo-1590362891988-f7780470208b?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Premier Star Motors',
      phone: '+91 98410 77665',
      type: 'Top Rated Direct Seller',
      verified: true,
      rating: 4.9,
      address: '1st Block, Anna Nagar East, Chennai - 600102',
      inspectionScore: 'Clean Record • Zero Major Accidents'
    },
    isCertified: false,
    isPriceDrop: true,
    isLuxury: false
  },

  // 8. 2017 Hyundai i20 Sports 1.2 (Red, Spinny)
  {
    id: 'uc-8',
    name: '2017 Hyundai i20',
    brand: 'Hyundai',
    model: 'i20',
    year: 2017,
    variant: 'Sports 1.2',
    price: '₹4.48 L',
    rawPrice: 448000,
    emi: 'EMI ₹12,985/m',
    kms: 66180,
    kmsDisplay: '66,180kms',
    fuel: 'Petrol',
    transmission: 'Automatic',
    rto: 'TN10',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback',
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    premiumSeller: 'Spinny',
    partnerTag: 'Spinny',
    saveAmount: 'Save ₹23k',
    discountNumber: 23000,
    seats: 5,
    badges: ['Certified', 'Warranty', '5-Day Money Back'],
    location: 'Anna Nagar, Chennai',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Spinny Car Hub VR Mall',
      phone: '+91 96000 44332',
      type: 'Spinny Assured Hub',
      verified: true,
      rating: 4.9,
      address: 'Basement 2, VR Chennai Mall, Thirumangalam, Chennai',
      inspectionScore: '200-Point Spinny Assured Quality Check'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 9. 2018 Hyundai i20 Sports 1.2 (Red, Spinny)
  {
    id: 'uc-9',
    name: '2018 Hyundai i20',
    brand: 'Hyundai',
    model: 'i20',
    year: 2018,
    variant: 'Sports 1.2',
    price: '₹4.90 L',
    rawPrice: 490000,
    emi: 'EMI ₹13,550/m',
    kms: 40561,
    kmsDisplay: '40,561kms',
    fuel: 'Petrol',
    transmission: 'Automatic',
    rto: 'TN01',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback',
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    premiumSeller: 'Spinny',
    partnerTag: 'Spinny',
    saveAmount: 'Save ₹25k',
    discountNumber: 25000,
    seats: 5,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'Thiruverkadu, Chennai',
    images: [
      'https://images.unsplash.com/photo-1541348263662-e0c866659c88?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Spinny Express Park',
      phone: '+91 96000 77112',
      type: 'Spinny Hub Certified',
      verified: true,
      rating: 4.8,
      address: 'Express Avenue Mall, Royapettah, Chennai',
      inspectionScore: '200-Point Inspection Guaranteed'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 10. 2015 Hyundai i20 Era 1.2 (Blue)
  {
    id: 'uc-10',
    name: '2015 Hyundai i20',
    brand: 'Hyundai',
    model: 'i20',
    year: 2015,
    variant: 'Era 1.2',
    price: '₹4.60 L',
    rawPrice: 460000,
    emi: 'EMI ₹19,280/m',
    kms: 56561,
    kmsDisplay: '56,561kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN10',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback',
    ownership: 'Second owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner',
    saveAmount: 'Save ₹14k',
    discountNumber: 14000,
    seats: 5,
    badges: ['Insured till Aug 2027'],
    location: 'Thiruverkadu, Chennai',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'South Coast Motors',
      phone: '+91 98840 55112',
      type: 'Trusted Used Car Dealer',
      verified: true,
      rating: 4.5,
      address: 'Arcot Road, Vadapalani, Chennai',
      inspectionScore: 'Engine & Gearbox Inspected'
    },
    isCertified: false,
    isPriceDrop: false,
    isLuxury: false
  },

  // 11. 2017 Honda Amaze 2.0 VX i-DTEC (Brown Sedan)
  {
    id: 'uc-11',
    name: '2017 Honda Amaze',
    brand: 'Honda',
    model: 'Amaze',
    year: 2017,
    variant: '2.0 VX i-DTEC',
    price: '₹5.10 L',
    rawPrice: 510000,
    emi: 'EMI ₹12,063/m',
    kms: 28000,
    kmsDisplay: '28,000kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN01',
    rtoState: 'Tamil nadu',
    bodyType: 'Sedan',
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner | Featured',
    saveAmount: 'Save ₹17k',
    discountNumber: 17000,
    seats: 5,
    badges: ['Certified', 'Warranty'],
    location: 'Nungambakkam, Chennai',
    images: [
      'https://images.unsplash.com/photo-1590362891988-f7780470208b?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Nungambakkam Auto Prestige',
      phone: '+91 98400 12890',
      type: 'Elite Verified Dealer',
      verified: true,
      rating: 4.8,
      address: 'Sterling Road, Nungambakkam, Chennai - 600034',
      inspectionScore: 'Genuine Odo • Dealer Service Records'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 12. 2018 Hyundai i20 Asta 1.2 (Silver)
  {
    id: 'uc-12',
    name: '2018 Hyundai i20',
    brand: 'Hyundai',
    model: 'i20',
    year: 2018,
    variant: 'Asta 1.2',
    price: '₹4.95 L',
    rawPrice: 495000,
    emi: 'EMI ₹23,599/m',
    kms: 30552,
    kmsDisplay: '30,552kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'TN05',
    rtoState: 'Tamil nadu',
    bodyType: 'Hatchback',
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner',
    saveAmount: 'Save ₹18k',
    discountNumber: 18000,
    seats: 5,
    badges: ['Insured till Aug 2027'],
    location: 'Thiruverkadu, Chennai',
    images: [
      'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'AutoTrust City Hub',
      phone: '+91 98411 99002',
      type: 'Direct Owner Consignment',
      verified: true,
      rating: 4.7,
      address: 'Poonamallee Bypass Road, Chennai',
      inspectionScore: 'Complete Service History Available'
    },
    isCertified: false,
    isPriceDrop: true,
    isLuxury: false
  },

  // 13. Maruti Suzuki Swift ZXi
  {
    id: 'uc-13',
    name: '2021 Maruti Suzuki Swift',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    year: 2021,
    variant: 'ZXi DualJet',
    price: '₹6.40 L',
    rawPrice: 640000,
    emi: 'EMI ₹14,200/m',
    kms: 22000,
    kmsDisplay: '22,000kms',
    fuel: 'Petrol',
    transmission: 'Manual',
    rto: 'HR26',
    rtoState: 'Haryana',
    bodyType: 'Hatchback',
    ownership: 'First owner',
    sellerType: 'Enterprise Cars',
    premiumSeller: 'Cars24',
    partnerTag: 'Cars24 | Ad',
    saveAmount: 'Save ₹20k',
    discountNumber: 20000,
    seats: 5,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'Gurugram, Haryana',
    images: [
      'https://images.unsplash.com/photo-1541348263662-e0c866659c88?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Cars24 Hub Gurugram',
      phone: '+91 98111 22334',
      type: 'Cars24 Hub',
      verified: true,
      rating: 4.9,
      address: 'Golf Course Road, Gurugram, Haryana',
      inspectionScore: '140-Point Inspection Passed'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 14. Tata Nexon XZ Plus
  {
    id: 'uc-14',
    name: '2022 Tata Nexon',
    brand: 'Tata',
    model: 'Nexon',
    year: 2022,
    variant: 'XZ Plus (O)',
    price: '₹9.20 L',
    rawPrice: 920000,
    emi: 'EMI ₹19,800/m',
    kms: 18500,
    kmsDisplay: '18,500kms',
    fuel: 'Diesel',
    transmission: 'Automatic',
    rto: 'DL04',
    rtoState: 'Delhi',
    bodyType: 'SUV',
    ownership: 'First owner',
    sellerType: 'Direct Owner Cars',
    partnerTag: 'Direct Owner | Verified',
    saveAmount: 'Save ₹35k',
    discountNumber: 35000,
    seats: 5,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'Connaught Place, Delhi',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Direct Owner (Mr. Rakesh Sharma)',
      phone: '+91 98100 44556',
      type: 'Direct Private Owner',
      verified: true,
      rating: 5.0,
      address: 'Barakhamba Road, New Delhi',
      inspectionScore: '5-Star Bharat NCAP Certified Owner'
    },
    isCertified: true,
    isPriceDrop: false,
    isLuxury: false
  },

  // 15. Mahindra Thar LX 4x4
  {
    id: 'uc-15',
    name: '2023 Mahindra Thar',
    brand: 'Mahindra',
    model: 'Thar',
    year: 2023,
    variant: 'LX Hard Top 4x4 Diesel AT',
    price: '₹14.80 L',
    rawPrice: 1480000,
    emi: 'EMI ₹29,400/m',
    kms: 12000,
    kmsDisplay: '12,000kms',
    fuel: 'Diesel',
    transmission: 'Automatic',
    rto: 'PB65',
    rtoState: 'Punjab',
    bodyType: 'SUV',
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    premiumSeller: 'Spinny',
    partnerTag: 'Spinny | Featured',
    saveAmount: 'Save ₹50k',
    discountNumber: 50000,
    seats: 4,
    badges: ['Certified', 'Warranty', '5-Day Money Back'],
    location: 'Chandigarh / Mohali',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Spinny Hub Mohali',
      phone: '+91 98765 43210',
      type: 'Spinny Premier Hub',
      verified: true,
      rating: 4.9,
      address: 'Phase 7, Industrial Area, Mohali, Punjab',
      inspectionScore: '200-Point Inspection Guaranteed'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: false
  },

  // 16. BMW 3 Series 320d Luxury Line
  {
    id: 'uc-16',
    name: '2020 BMW 3 Series',
    brand: 'BMW',
    model: '3 Series',
    year: 2020,
    variant: '320d Luxury Line',
    price: '₹32.50 L',
    rawPrice: 3250000,
    emi: 'EMI ₹68,400/m',
    kms: 29000,
    kmsDisplay: '29,000kms',
    fuel: 'Diesel',
    transmission: 'Automatic',
    rto: 'CH01',
    rtoState: 'Chandigarh',
    bodyType: 'Sedan',
    ownership: 'First owner',
    sellerType: 'Partner Cars',
    partnerTag: 'Partner | Featured',
    saveAmount: 'Save ₹1,20k',
    discountNumber: 120000,
    seats: 5,
    badges: ['Certified', 'Warranty', 'RC transfer'],
    location: 'Sector 9, Chandigarh',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=700&q=80'
    ],
    sellerDetails: {
      name: 'Prestige Euro Auto',
      phone: '+91 98888 11223',
      type: 'Luxury Euro Specialist',
      verified: true,
      rating: 4.9,
      address: 'Madhya Marg, Sector 8, Chandigarh',
      inspectionScore: 'BMW Authorized Service History'
    },
    isCertified: true,
    isPriceDrop: true,
    isLuxury: true
  }
];

export interface UsedCarsFilterState {
  // Recommended
  certifiedOnly: boolean;
  priceDropOnly: boolean;
  under5LakhOnly: boolean;
  luxuryOnly: boolean;

  // Budget
  maxBudget: number; // in Rupees, default 50,000,000
  budgetTiers: string[]; // e.g. ['under_2l', '2l_3l', '3l_5l', '5l_8l', '8l_10l', 'above_10l']

  // Brand + Model
  brandSearchText: string;
  selectedBrands: string[];

  // Model Year
  minYear: number; // 2000 to 2024

  // Car Age
  carAge: string[]; // ['<1yr', '<3yr', '<5yr']

  // Fuel Type
  fuelTypes: string[]; // ['Petrol', 'Diesel', 'Electric', 'CNG']

  // Transmission
  transmissions: string[]; // ['Manual', 'Automatic']

  // Kilometer Driven
  maxKms: number; // default 260000
  popularKmChip: string | null; // '< 5,000 km', '< 10,000 km', etc.

  // Ownership
  ownerships: string[]; // ['First owner', 'Second owner', 'Third owner or more']

  // Body Type
  bodyTypes: string[]; // ['Hatchback', 'SUV', 'Sedan', 'MUV', 'Minivan', 'Convertible', 'Coupe', 'Pickup Truck']

  // Seller Type
  sellerType: string; // 'All Cars' | 'Partner Cars' | 'Enterprise Cars' | 'Direct Owner Cars'

  // Premium Sellers
  premiumSellers: string[]; // ['Cars24', 'Spinny']

  // RTO State
  rtoStates: string[]; // ['Tamil nadu', 'Haryana', 'Pondicherry', 'Chandigarh', 'Punjab', 'Delhi']

  // Seats
  seats: number[]; // [4, 5, 6, 7]

  // Discount
  discounts: string[]; // ['upto_20k', 'upto_50k', 'upto_1l', 'above_1l']
}

export const INITIAL_USED_CARS_FILTER: UsedCarsFilterState = {
  certifiedOnly: false,
  priceDropOnly: false,
  under5LakhOnly: false,
  luxuryOnly: false,
  maxBudget: 50000000,
  budgetTiers: [],
  brandSearchText: '',
  selectedBrands: [],
  minYear: 2000,
  carAge: [],
  fuelTypes: [],
  transmissions: [],
  maxKms: 260000,
  popularKmChip: null,
  ownerships: [],
  bodyTypes: [],
  sellerType: 'All Cars',
  premiumSellers: [],
  rtoStates: ['Tamil nadu'],
  seats: [],
  discounts: []
};
