import React, { useRef, useState } from 'react';
import './Showcase.css';

interface OfferCard {
  id: number;
  category: 'Flights' | 'Hotels' | 'Bank Offers' | 'Trains';
  tag: string;
  bank?: string;
  badgeBg: string;
  title: string;
  subtitle: string;
  code?: string;
  image: string;
}

interface HotelCard {
  id: number;
  name: string;
  location: string;
  rating: string;
  reviews: string;
  price: string;
  stars?: number;
  image: string;
  badge?: string;
  duration?: string;
  category?: string;
  capacity?: string;
  description?: string;
  transport?: string;
}

const OFFERS_DATA: OfferCard[] = [
  {
    id: 1,
    category: 'Flights',
    tag: 'FESTIVE FARES',
    title: 'Up to 20% Off on Flights',
    subtitle: 'Special holiday airline discounts for domestic & intl routes',
    code: 'FEST',
    badgeBg: '#e11d48',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    category: 'Bank Offers',
    bank: 'AXIS BANK',
    tag: 'AXIS SPECIAL',
    title: 'Flat 12% Off on Flights',
    subtitle: 'With Axis Bank Credit Cards + Interest Free EMI',
    code: 'AXISFLY',
    badgeBg: '#9f1239',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    category: 'Bank Offers',
    bank: 'HDFC BANK',
    tag: 'DOMESTIC DEALS',
    title: 'Get up to ₹2,000 Off',
    subtitle: 'On domestic flights with HDFC Bank Credit Card EMI',
    code: 'HDFCSART',
    badgeBg: '#1e3a8a',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    category: 'Bank Offers',
    bank: 'ICICI BANK',
    tag: 'MEGA SAVER',
    title: 'Up to ₹7,500 Off',
    subtitle: 'On Flights with ICICI Bank Credit Card EMI',
    code: 'ICICISART',
    badgeBg: '#c2410c',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    category: 'Hotels',
    tag: 'LUXURY STAYS',
    title: 'Save up to 40% on Hotels',
    subtitle: 'Verified 4-star & 5-star properties across top metro hubs',
    code: 'HOTEL40',
    badgeBg: '#059669',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    category: 'Trains',
    tag: 'ZERO CONVENIENCE',
    title: '₹0 Gateway Fee on Trains',
    subtitle: 'Instant PNR confirmation & free cancellation protection',
    code: 'TRAINFREE',
    badgeBg: '#7c3aed',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    category: 'Flights',
    tag: 'INTL FLYER',
    title: 'Flat ₹5,000 Off Abroad',
    subtitle: 'Exclusive discounts on Europe, Dubai, & Singapore flights',
    code: 'GLOBALFLY',
    badgeBg: '#0284c7',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    category: 'Hotels',
    tag: 'WEEKEND RESORT',
    title: 'Stay 3 Nights, Pay for 2',
    subtitle: 'Complimentary breakfast and free pool access included',
    code: 'RESORT2X',
    badgeBg: '#0d9488',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 9,
    category: 'Bank Offers',
    bank: 'SBI CARD',
    tag: 'CASHBACK',
    title: '5% Instant Cashback',
    subtitle: 'Applicable across all transit bookings and airport taxis',
    code: 'SBISART',
    badgeBg: '#15803d',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 10,
    category: 'Trains',
    tag: 'TATKAL BOOST',
    title: 'Guaranteed Waitlist Refund',
    subtitle: '100% money back if waitlisted train ticket not confirmed',
    code: 'SURETRAIN',
    badgeBg: '#9333ea',
    image: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=600&q=80'
  }
];

const WHY_BOOK_ITEMS = [
  {
    id: 1,
    title: 'Track flight delays & baggage',
    desc: 'Live gate alerts & baggage carousel tracker',
    icon: 'fa-solid fa-plane-circle-check',
    bg: '#eff6ff',
    color: '#2563eb'
  },
  {
    id: 2,
    title: 'Save up to 40% with smart fare alerts',
    desc: 'AI price prediction & automatic price drops',
    icon: 'fa-solid fa-bell-concierge',
    bg: '#fefce8',
    color: '#ca8a04'
  },
  {
    id: 3,
    title: 'Travel Stress-Free with Insurance',
    desc: 'Medical coverage, trip delay & lost passport cover',
    icon: 'fa-solid fa-shield-heart',
    bg: '#fdf2f8',
    color: '#db2777'
  },
  {
    id: 4,
    title: 'Instant & Full Refund Guarantee',
    desc: 'Zero-deduction instant refund on cancellations',
    icon: 'fa-solid fa-shield-halved',
    bg: '#f0fdf4',
    color: '#16a34a'
  }
];

const HOTELS_DATA: HotelCard[] = [

  {
    id: 1,
    name: "Economy Hatchback",
    location: "Chennai to Pondicherry",
    rating: "4.6",
    reviews: "2k+ Travelers",
    price: "₹2,499",
    duration: "3 Hours",
    category: "City & Outstation Cab",
    badge: "Budget Friendly",
    capacity: "4 Passengers",
    description:
      "Affordable air-conditioned hatchback for city rides, airport transfers, and short trips.",
    transport: "Private Cab",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Premium Sedan",
    location: "Hyderabad to Vijayawada",
    rating: "4.8",
    reviews: "3k+ Travelers",
    price: "₹3,999",
    duration: "5 Hours",
    category: "Comfort Travel",
    badge: "Most Popular",
    capacity: "4 Passengers",
    description:
      "Comfortable sedan with spacious seating, air conditioning, and a professional driver.",
    transport: "Private Sedan",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "SUV Family Ride",
    location: "Bengaluru to Mysuru",
    rating: "4.8",
    reviews: "2.5k+ Travelers",
    price: "₹4,999",
    duration: "3.5 Hours",
    category: "Family Travel",
    badge: "Family Favorite",
    capacity: "6–7 Passengers",
    description:
      "Spacious SUV suitable for families, luggage, weekend trips, and long-distance journeys.",
    transport: "Private SUV",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Luxury Premium Car",
    location: "Mumbai City & Outstation",
    rating: "4.9",
    reviews: "1.5k+ Travelers",
    price: "₹7,999",
    duration: "8 Hours",
    category: "Luxury Travel",
    badge: "Premium Choice",
    capacity: "3–4 Passengers",
    description:
      "Travel in a premium vehicle for business meetings, special occasions, and executive transfers.",
    transport: "Luxury Chauffeur Car",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Tempo Traveller",
    location: "Delhi to Agra",
    rating: "4.7",
    reviews: "1.8k+ Travelers",
    price: "₹8,499",
    duration: "4 Hours",
    category: "Group Travel",
    badge: "Group Special",
    capacity: "9–17 Passengers",
    description:
      "Ideal for group outings, family functions, sightseeing, and multi-day road trips.",
    transport: "Private Tempo Traveller",
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Mini Bus Rental",
    location: "Hyderabad to Tirupati",
    rating: "4.7",
    reviews: "1.2k+ Travelers",
    price: "₹12,999",
    duration: "10 Hours",
    category: "Group & Pilgrimage",
    badge: "Group Travel Deal",
    capacity: "18–25 Passengers",
    description:
      "Convenient group transport for pilgrimages, corporate trips, weddings, and tours.",
    transport: "Private Mini Bus",
    image:
      "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Motorbike Rental",
    location: "Manali & Nearby Routes",
    rating: "4.8",
    reviews: "2k+ Travelers",
    price: "₹999",
    duration: "Per Day",
    category: "Bike Adventure",
    badge: "Adventure Pick",
    capacity: "1–2 Riders",
    description:
      "Explore scenic mountain roads and local destinations on a rented motorcycle.",
    transport: "Self-Drive Bike",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Electric Auto Rickshaw",
    location: "Chennai City",
    rating: "4.5",
    reviews: "900+ Travelers",
    price: "₹199",
    duration: "Local Trip",
    category: "Eco-Friendly Travel",
    badge: "Green Mobility",
    capacity: "3 Passengers",
    description:
      "Affordable short-distance travel for local shopping, station transfers, and daily commutes.",
    transport: "Electric Auto",
    image:
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80"
  }

];

interface PopularRoute {
  id: number;
  from: string;
  to: string;
  duration: string;
  distance: string;
  dailyOptions: string;
  startingFare: string;
  tag: string;
  type: string;
  image: string;
}

interface OperatorItem {
  id: number;
  name: string;
  category: 'Buses' | 'Cars' | 'Trucks & Carriers' | 'Fleet Owners';
  operator: string;
  type: string;
  rating: string;
  price: string;
  highlights: string;
  features: string[];
  fleetStatus: string;
  image: string;
}

interface CouponOffer {
  id: number;
  category: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  validTill: string;
  accentColor: string;
  cardBg: string;
  icon: string;
}

interface BookingMgmtCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  accent: string;
  image: string;
  actionText: string;
  features: string[];
}

interface SupportChannel {
  id: number;
  title: string;
  desc: string;
  contact: string;
  available: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  action: string;
}

interface SupportFaq {
  id: number;
  q: string;
  a: string;
}

interface TrustPillar {
  id: number;
  title: string;
  metric: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  highlight: string;
}

const POPULAR_ROUTES_DATA: PopularRoute[] = [
  {
    id: 1,
    from: 'Bengaluru',
    to: 'Hyderabad',
    duration: '8h 30m',
    distance: '570 km',
    dailyOptions: '170+ Daily Buses & Cabs',
    startingFare: '₹649',
    tag: 'MOST POPULAR',
    type: 'Sleeper & Volvo AC',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 2,
    from: 'Mumbai',
    to: 'Pune Expressway',
    duration: '3h 15m',
    distance: '150 km',
    dailyOptions: '320+ Daily Cabs & Fleets',
    startingFare: '₹399',
    tag: 'EXPRESS CORRIDOR',
    type: 'Cab & Electric Bus',
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 3,
    from: 'Chennai',
    to: 'Coimbatore',
    duration: '7h 45m',
    distance: '510 km',
    dailyOptions: '140+ Daily Trips',
    startingFare: '₹599',
    tag: 'FAST CONNECT',
    type: 'Multi-Axle Scania',
    image: 'https://images.unsplash.com/photo-1623062335439-d34ba0a09e1d?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 4,
    from: 'Delhi NCR',
    to: 'Jaipur Pink City',
    duration: '4h 45m',
    distance: '280 km',
    dailyOptions: '240+ Daily Options',
    startingFare: '₹449',
    tag: 'HERITAGE HIGHWAY',
    type: 'Luxury AC Seater',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 5,
    from: 'Hyderabad',
    to: 'Vijayawada',
    duration: '5h 10m',
    distance: '275 km',
    dailyOptions: '190+ Daily Rides',
    startingFare: '₹499',
    tag: 'BUSINESS ROUTE',
    type: 'EV Intercity & SUV',
    image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 6,
    from: 'Indore',
    to: 'Bhopal',
    duration: '3h 30m',
    distance: '190 km',
    dailyOptions: '215+ Departures',
    startingFare: '₹349',
    tag: 'SMART ROUTE',
    type: 'AC Intercity Coach',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=700&q=80'
  }
];

const OPERATOR_LISTINGS_DATA: OperatorItem[] = [
  {
    id: 1,
    name: 'InterCity Volvo Multi-Axle B11R',
    category: 'Buses',
    operator: 'Orange & SRS Certified Fleets',
    type: 'AC Sleeper 2+1 (Live GPS)',
    rating: '4.8 (4.2k ratings)',
    price: '₹799 / seat',
    highlights: 'CCTV monitored, personal USB charging, fresh linen & emergency SOS.',
    features: ['Wi-Fi Onboard', 'Emergency SOS', 'Verified Crew', 'GPS Tracker'],
    fleetStatus: 'Government Verified Operator',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 2,
    name: 'Toyota Innova Crysta / HyCross',
    category: 'Cars',
    operator: 'SART Premier Chauffeur Network',
    type: '6-7 Seater Premium MPV',
    rating: '4.9 (5.8k ratings)',
    price: '₹14 / km',
    highlights: 'Uniformed background-checked drivers, sanitized cabin & zero hidden toll fees.',
    features: ['Luggage Carrier', 'Chauffeur Driven', 'Toll Included Options', 'Air Bag Safety'],
    fleetStatus: 'Platinum Fleet Owner',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 3,
    name: 'BharatBenz Heavy Transport 2823R',
    category: 'Trucks & Carriers',
    operator: 'TransIndia Logistics Alliance',
    type: '16–28 Ton All-India Permit',
    rating: '4.7 (1.9k loads)',
    price: '₹4,500 / trip base',
    highlights: 'Full-truckload (FTL) goods carrier with real-time telematics and digital e-Way bill sync.',
    features: ['Container Locked', 'e-Way Bill Sync', 'Consignment Insurance', '24x7 Escort GPS'],
    fleetStatus: 'National Permit Verified',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 4,
    name: 'Tata Ace Gold & Intra V30 Mini',
    category: 'Trucks & Carriers',
    operator: 'QuickHaul City Logistics',
    type: '1–2 Ton Local Freight',
    rating: '4.8 (3.1k deliveries)',
    price: '₹650 base + ₹25/km',
    highlights: 'City intra-hub transfers, house relocation, commercial goods and warehouse deliveries.',
    features: ['Loading Assistance', 'Instant Dispatch', 'Real-Time Map Share', 'Digital Invoicing'],
    fleetStatus: 'Verified Urban Fleet',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 5,
    name: 'Mahindra Scorpio-N 4x4 Enterprise',
    category: 'Cars',
    operator: 'SafeDrive Commercial Motors',
    type: 'Rugged Outstation SUV',
    rating: '4.9 (2.4k ratings)',
    price: '₹16 / km',
    highlights: 'Built for hill stations, rough terrains, national highway journeys and family holidays.',
    features: ['Hill Descent Control', 'Speed Governors', 'Child Seat Support', 'Clean Interiors'],
    fleetStatus: 'Verified Fleet Owner',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 6,
    name: 'Force Urbania Executive Cruiser',
    category: 'Fleet Owners',
    operator: 'Apex Hospitality & Charter Bus',
    type: '12-17 Luxury Recliner Coach',
    rating: '4.9 (1.1k trips)',
    price: '₹34 / km',
    highlights: 'Luxury corporate charter, wedding fleets, airport group transfers with entertainment console.',
    features: ['Captain Recliners', 'Ambient Lighting', 'Big Luggage Boot', 'Public Address System'],
    fleetStatus: 'Certified Charter Fleet',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=700&q=80'
  }
];

const COUPON_OFFERS_DATA: CouponOffer[] = [
  {
    id: 1,
    category: 'BUS & OUTSTATION CAB',
    title: 'Super Saver Road Trip',
    description: 'Get flat ₹250 instant cashback on your first outstation bus or intercity cab ride.',
    code: 'SARTROADS',
    discount: 'FLAT ₹250 OFF',
    validTill: 'Valid till 30 Nov',
    accentColor: '#0284c7',
    cardBg: '#f0f9ff',
    icon: 'fa-solid fa-bus'
  },
  {
    id: 2,
    category: 'FREIGHT & TRUCKS',
    title: 'Heavy Logistics Commercial Discount',
    description: 'Save 15% on interstate full container or mini-truck bookings for SME businesses.',
    code: 'CARRIER15',
    discount: '15% DISCOUNT',
    validTill: 'Valid all month',
    accentColor: '#16a34a',
    cardBg: '#f0fdf4',
    icon: 'fa-solid fa-truck-moving'
  },
  {
    id: 3,
    category: 'AIRLINE & HELICOPTER',
    title: 'Weekend Flight Flash Sale',
    description: 'Zero convenience fees + up to ₹1,800 instant airline discount on domestic sectors.',
    code: 'FLYFESTIVE',
    discount: 'UP TO ₹1,800 OFF',
    validTill: 'Limited Seats',
    accentColor: '#e11d48',
    cardBg: '#fff1f2',
    icon: 'fa-solid fa-plane-departure'
  },
  {
    id: 4,
    category: 'RENTAL & SELF-DRIVE',
    title: 'Long Weekend Car Rental Deal',
    description: 'Book 3+ days of self-drive hatchback, sedan or SUV and get 1 extra day completely free.',
    code: 'RENTFREE1',
    discount: '1 DAY FREE RENTAL',
    validTill: 'Expires in 48 hrs',
    accentColor: '#d97706',
    cardBg: '#fffbeb',
    icon: 'fa-solid fa-car-side'
  }
];

const BOOKING_MGMT_CARDS: BookingMgmtCard[] = [
  {
    id: 1,
    title: 'View & Download Tickets',
    description: 'Access digital confirmed e-tickets, boarding pass QR codes and GST invoices in one click.',
    icon: 'fa-solid fa-file-invoice',
    accent: '#0284c7',
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80',
    actionText: 'Find My Tickets',
    features: ['PDF / WhatsApp Ticket', 'Boarding Point Maps', 'Tax Invoice with GST']
  },
  {
    id: 2,
    title: 'Live Tracking & Seat Position',
    description: 'Track your bus, taxi or train in real time with GPS updates and live coach layout previews.',
    icon: 'fa-solid fa-location-crosshairs',
    accent: '#16a34a',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80',
    actionText: 'Track Vehicle',
    features: ['Live GPS Telematics', 'Delay Alerts via SMS', 'Exact Platform & Gate Info']
  },
  {
    id: 3,
    title: 'Modify Journey or Date',
    description: 'Change departure time, shift travel dates or switch boarding stops with flexible reschedule.',
    icon: 'fa-solid fa-calendar-days',
    accent: '#d97706',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    actionText: 'Reschedule Trip',
    features: ['Zero Fee 1st Date Change', 'Seat Swapping', 'Instant Confirmation']
  },
  {
    id: 4,
    title: 'Instant Cancellation & Refunds',
    description: 'Cancel in under 60 seconds with 100% transparent refund rules and immediate bank transfer.',
    icon: 'fa-solid fa-rotate-left',
    accent: '#dc2626',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    actionText: 'Cancel & Refund',
    features: ['Auto-Credit in 2 Hours', 'Zero Penalty Window', 'Full UPI / Wallet Reversal']
  }
];

const SUPPORT_CHANNELS_DATA: SupportChannel[] = [
  {
    id: 1,
    title: 'Live Chat Support',
    desc: 'Instant replies from dedicated travel specialists for active or upcoming bookings.',
    contact: 'Average response: under 45 secs',
    available: 'Available 24x7',
    icon: 'fa-solid fa-comments',
    iconColor: '#0284c7',
    iconBg: '#e0f2fe',
    action: 'Start Live Chat'
  },
  {
    id: 2,
    title: 'Toll-Free Helpline',
    desc: 'Speak directly with our national travel customer desk for urgent roadside or ticketing help.',
    contact: '1800-419-7278 (SART-DESK)',
    available: 'Toll-Free Pan India',
    icon: 'fa-solid fa-phone-volume',
    iconColor: '#16a34a',
    iconBg: '#dcfce7',
    action: 'Call Helpline'
  },
  {
    id: 3,
    title: 'WhatsApp Concierge',
    desc: 'Receive ticket PDFs, live driver details, and invoice receipts directly on your WhatsApp.',
    contact: '+91 98765 43210 (Verified)',
    available: 'Instant Bot & Agent',
    icon: 'fa-brands fa-whatsapp',
    iconColor: '#25d366',
    iconBg: '#dcfce7',
    action: 'Open WhatsApp'
  },
  {
    id: 4,
    title: 'Email Grievance Desk',
    desc: 'Submit claims, business fleet billing queries, and special refunds with case tracking.',
    contact: 'support@sart-travel.in',
    available: 'Guaranteed reply < 4 hrs',
    icon: 'fa-solid fa-envelope-open-text',
    iconColor: '#7c3aed',
    iconBg: '#ede9fe',
    action: 'Send Email'
  }
];

const SUPPORT_FAQS_DATA: SupportFaq[] = [
  {
    id: 1,
    q: 'How do I download my ticket or receipt after booking?',
    a: 'Your ticket is immediately sent via SMS and WhatsApp right after payment. You can also view and download full PDF tickets with QR codes anytime under the "My Bookings" tab by simply entering your Mobile Number or PNR.'
  },
  {
    id: 2,
    q: 'What is the refund policy if I cancel my trip?',
    a: 'If you cancel up to 12 hours before scheduled departure, you receive up to 100% refund. Our automated payment engine credits your original payment mode (UPI, card, or wallet) in under 2 hours without manual intervention.'
  },
  {
    id: 3,
    q: 'Are all vehicle operators, drivers and trucks verified on SART?',
    a: 'Yes, 100% of our drivers and fleet operators pass stringent background verification including commercial driver license checks, vehicle fitness certification, insurance validation, and RTO registration audit before joining the platform.'
  },
  {
    id: 4,
    q: 'How does live GPS vehicle tracking work?',
    a: 'Every bus, cab, and logistics vehicle is linked to our real-time telematics engine. You receive a live track link 30 minutes before pickup, letting you see the vehicle’s exact coordinate, estimated arrival time, and driver phone.'
  },
  {
    id: 5,
    q: 'Can I book one-way outstation cabs or return trips?',
    a: 'Yes, SART supports one-way outstation drops, round trips, and hourly city packages. For one-way drops, you only pay for the distance travelled without any round-trip empty return charges.'
  }
];

const TRUST_PILLARS_DATA: TrustPillar[] = [
  {
    id: 1,
    title: 'Verified Fleet Owners',
    metric: '25,000+ Partners',
    description: 'Every vehicle operator undergoes strict RTO background checks, fitness certificates, and safety audits.',
    icon: 'fa-solid fa-id-card-clip',
    color: '#0284c7',
    bg: '#f0f9ff',
    highlight: 'Govt. Commercial Driving License & RTO Compliant'
  },
  {
    id: 2,
    title: '256-Bit Bank Level Security',
    metric: '100% Secure',
    description: 'PCI-DSS certified payment gateway supporting UPI, NetBanking, and credit card tokenization.',
    icon: 'fa-solid fa-shield-halved',
    color: '#16a34a',
    bg: '#f0fdf4',
    highlight: 'Zero Card Data Storage & Encrypted Checkout'
  },
  {
    id: 3,
    title: '100% Transparent Pricing',
    metric: '₹0 Hidden Fees',
    description: 'No surprise charges at the time of boarding. Toll taxes, driver allowances, and GST are clearly itemized.',
    icon: 'fa-solid fa-receipt',
    color: '#d97706',
    bg: '#fffbeb',
    highlight: 'All Tolls, State Taxes & Driver Allowances Disclosed'
  },
  {
    id: 4,
    title: '24x7 Roadside & Trip Assistance',
    metric: '15 Mins Response',
    description: 'Round-the-clock emergency assistance, replacement vehicle guarantees, and dedicated call support.',
    icon: 'fa-solid fa-headset',
    color: '#7c3aed',
    bg: '#f5f3ff',
    highlight: 'National Emergency Response Network Active'
  }
];

export default function Showcase() {
  const [activeOfferTab, setActiveOfferTab] = useState<'All' | 'Flights' | 'Hotels' | 'Bank Offers' | 'Trains'>('All');
  const [isOffersGridExpanded, setIsOffersGridExpanded] = useState(false);
  const [isHotelsGridExpanded, setIsHotelsGridExpanded] = useState(false);
  const [isRoutesExpanded, setIsRoutesExpanded] = useState(false);
  const [isOperatorsExpanded, setIsOperatorsExpanded] = useState(false);
  const [operatorCategory, setOperatorCategory] = useState<'All' | 'Buses' | 'Cars' | 'Trucks & Carriers' | 'Fleet Owners'>('All');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const offersTrackRef = useRef<HTMLDivElement>(null);
  const whyTrackRef = useRef<HTMLDivElement>(null);
  const hotelsTrackRef = useRef<HTMLDivElement>(null);
  const routesTrackRef = useRef<HTMLDivElement>(null);
  const operatorsTrackRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, distance: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  const filteredOffers = activeOfferTab === 'All'
    ? OFFERS_DATA
    : OFFERS_DATA.filter(o => o.category === activeOfferTab);

  const filteredOperators = operatorCategory === 'All'
    ? OPERATOR_LISTINGS_DATA
    : OPERATOR_LISTINGS_DATA.filter(op => op.category === operatorCategory);

  return (
    <div className="showcase-container">

      {/* 1. OFFERS FOR YOU SECTION */}
      <section className="showcase-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Offers For You</h2>
          </div>
          <div className="showcase-header-right">

            <button
              type="button"
              className="showcase-view-all-link"
              onClick={() => setIsOffersGridExpanded(prev => !prev)}
            >
              {isOffersGridExpanded ? 'View Less' : 'View All'} <i className={`fa-solid ${isOffersGridExpanded ? 'fa-chevron-up' : 'fa-chevron-right'}`}></i>
            </button>
          </div>
        </div>

        {/* Carousel with Left/Right Buttons */}
        <div className="showcase-slider-relative">
          {!isOffersGridExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn left"
              onClick={() => scrollContainer(offersTrackRef, -330)}
              aria-label="Scroll Offers Left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <div
            className={`showcase-cards-track ${isOffersGridExpanded ? 'grid-expanded' : ''}`}
            ref={offersTrackRef}
          >
            {filteredOffers.map(offer => (
              <div
                key={offer.id}
                className="showcase-offer-card"
                style={{ backgroundImage: `url(${offer.image})` }}
              >
                {/* Full Card Background Backdrop Gradient Overlay */}
                <div className="showcase-card-overlay"></div>

                <div className="showcase-card-inner">
                  <div className="showcase-card-top-tags">
                    <div className="showcase-offer-badge" style={{ backgroundColor: offer.badgeBg }}>
                      {offer.tag}
                    </div>
                    {offer.bank && (
                      <div className="showcase-bank-pill">
                        <span className="showcase-bank-text">{offer.bank}</span>
                      </div>
                    )}
                  </div>

                  <div className="showcase-card-bottom-info">
                    <h3 className="showcase-offer-heading">{offer.title}</h3>
                    <p className="showcase-offer-sub">{offer.subtitle}</p>
                    {offer.code && (
                      <div className="showcase-code-chip">
                        <span>Code:</span> <strong>{offer.code}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isOffersGridExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn right"
              onClick={() => scrollContainer(offersTrackRef, 330)}
              aria-label="Scroll Offers Right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      </section>

      {/* 2. WHY BOOK WITH US SECTION */}
      <section className="showcase-section why-book-section">
        <div className="showcase-section-header">
          <h2 className="showcase-title">Why Book With Us?</h2>
        </div>

        <div className="showcase-slider-relative">


          <div className="showcase-why-track" ref={whyTrackRef}>
            {WHY_BOOK_ITEMS.map(item => (
              <div key={item.id} className="showcase-why-card">
                <div className="showcase-why-icon-box" style={{ backgroundColor: item.bg, color: item.color }}>
                  <i className={item.icon}></i>
                </div>
                <div className="showcase-why-text">
                  <h4 className="showcase-why-title">{item.title}</h4>
                  <p className="showcase-why-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* 3. TOP HOTELS & DESTINATIONS SECTION */}
      <section className="showcase-section hotels-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Explore Top Travel Destinations</h2>
            <span className="showcase-subtitle-tag">Best Travel Deals</span>
          </div>
          <button
            type="button"
            className="showcase-view-all-link orange"
            onClick={() => setIsHotelsGridExpanded(prev => !prev)}
          >
            {isHotelsGridExpanded ? 'View Less' : 'View All'} <i className={`fa-solid ${isHotelsGridExpanded ? 'fa-chevron-up' : 'fa-chevron-right'}`}></i>
          </button>
        </div>

        <div className="showcase-slider-relative">
          {!isHotelsGridExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn left"
              onClick={() => scrollContainer(hotelsTrackRef, -310)}
              aria-label="Scroll Hotels Left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <div
            className={`showcase-hotels-track ${isHotelsGridExpanded ? 'grid-expanded' : ''}`}
            ref={hotelsTrackRef}
          >
            {HOTELS_DATA.map(hotel => (
              <div key={hotel.id} className="showcase-hotel-card">
                <div className="showcase-hotel-img-wrap">
                  <img src={hotel.image} alt={hotel.name} />
                  {hotel.badge && (
                    <span className="showcase-hotel-badge">
                      <i className="fa-solid fa-shield-check"></i> {hotel.badge}
                    </span>
                  )}
                </div>

                <div className="showcase-hotel-details">
                  <div className="showcase-hotel-name-row">
                    <h3 className="showcase-hotel-name" title={hotel.name}>{hotel.name}</h3>
                    <div className="showcase-stars">
                      {Array.from({ length: hotel.stars }).map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                    </div>
                  </div>
                  <p className="showcase-hotel-loc">{hotel.location}</p>

                  <div className="showcase-hotel-footer">
                    <div className="showcase-rating-pill">
                      <span className="rating-score">{hotel.rating}</span>
                      <span className="rating-lbl">Excellent • {hotel.reviews}</span>
                    </div>
                    <div className="showcase-price-tag">
                      <span className="price-val">{hotel.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isHotelsGridExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn right"
              onClick={() => scrollContainer(hotelsTrackRef, 310)}
              aria-label="Scroll Hotels Right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      </section>

      {/* 4. POPULAR ROUTES - Frequently booked routes and destinations */}
      <section className="showcase-section popular-routes-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Popular Routes</h2>
            <span className="showcase-subtitle-tag" style={{ color: '#0284c7' }}>Frequently Booked Routes & Destinations</span>
          </div>
          <button
            type="button"
            className="showcase-view-all-link"
            onClick={() => setIsRoutesExpanded(prev => !prev)}
            style={{ background: '#f0f9ff', borderColor: '#bae6fd', color: '#0284c7' }}
          >
            {isRoutesExpanded ? 'View Less' : 'Explore All Routes'} <i className={`fa-solid ${isRoutesExpanded ? 'fa-chevron-up' : 'fa-chevron-right'}`}></i>
          </button>
        </div>

        <div className="showcase-slider-relative">
          {!isRoutesExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn left"
              onClick={() => scrollContainer(routesTrackRef, -320)}
              aria-label="Scroll Routes Left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <div
            className={`showcase-routes-track ${isRoutesExpanded ? 'grid-expanded' : ''}`}
            ref={routesTrackRef}
          >
            {POPULAR_ROUTES_DATA.map(route => (
              <div key={route.id} className="showcase-route-card">
                <div className="showcase-route-img-wrap">
                  <img src={route.image} alt={`${route.from} to ${route.to}`} />
                  <span className="showcase-route-badge">{route.tag}</span>
                  <span className="showcase-route-type-badge">
                    <i className="fa-solid fa-bolt"></i> {route.type}
                  </span>
                </div>
                <div className="showcase-route-body">
                  <div className="showcase-route-path">
                    <span className="route-city">{route.from}</span>
                    <span className="route-arrow-icon"><i className="fa-solid fa-arrow-right-long"></i></span>
                    <span className="route-city">{route.to}</span>
                  </div>
                  <div className="showcase-route-meta-row">
                    <span><i className="fa-regular fa-clock"></i> {route.duration}</span>
                    <span><i className="fa-solid fa-road"></i> {route.distance}</span>
                    <span><i className="fa-solid fa-ticket"></i> {route.dailyOptions}</span>
                  </div>
                  <div className="showcase-route-footer">
                    <div>
                      <div className="route-price-label">Fares starting from</div>
                      <div className="route-price-val">{route.startingFare}</div>
                    </div>
                    <button type="button" className="showcase-route-book-btn">
                      Book Route <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isRoutesExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn right"
              onClick={() => scrollContainer(routesTrackRef, 320)}
              aria-label="Scroll Routes Right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      </section>

      {/* 5. VEHICLE / OPERATOR LISTINGS - Available buses, cars, trucks and verified fleet owners */}
      <section className="showcase-section operator-listings-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Vehicle & Operator Listings</h2>
            <span className="showcase-subtitle-tag" style={{ color: '#16a34a' }}>Buses, Cars, Trucks & Verified Fleet Owners</span>
          </div>
          <div className="showcase-header-right">
            <div className="showcase-category-pills">
              {(['All', 'Buses', 'Cars', 'Trucks & Carriers', 'Fleet Owners'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`showcase-pill-btn ${operatorCategory === tab ? 'active' : ''}`}
                  onClick={() => setOperatorCategory(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="showcase-view-all-link"
              onClick={() => setIsOperatorsExpanded(prev => !prev)}
              style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#16a34a' }}
            >
              {isOperatorsExpanded ? 'View Less' : 'View All Fleets'} <i className={`fa-solid ${isOperatorsExpanded ? 'fa-chevron-up' : 'fa-chevron-right'}`}></i>
            </button>
          </div>
        </div>

        <div className="showcase-slider-relative">
          {!isOperatorsExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn left"
              onClick={() => scrollContainer(operatorsTrackRef, -320)}
              aria-label="Scroll Operators Left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <div
            className={`showcase-operators-track ${isOperatorsExpanded ? 'grid-expanded' : ''}`}
            ref={operatorsTrackRef}
          >
            {filteredOperators.map(item => (
              <div key={item.id} className="showcase-operator-card">
                <div className="showcase-operator-img-wrap">
                  <img src={item.image} alt={item.name} />
                  <span className="showcase-operator-verified">
                    <i className="fa-solid fa-circle-check"></i> {item.fleetStatus}
                  </span>
                  <span className="showcase-operator-type">{item.type}</span>
                </div>
                <div className="showcase-operator-body">
                  <div className="showcase-operator-header">
                    <h3 className="showcase-operator-name">{item.name}</h3>
                    <div className="showcase-operator-rating">
                      <i className="fa-solid fa-star"></i> {item.rating}
                    </div>
                  </div>
                  <div className="showcase-operator-provider">
                    <i className="fa-solid fa-building"></i> Operated by <strong>{item.operator}</strong>
                  </div>
                  <p className="showcase-operator-highlights">{item.highlights}</p>
                  <div className="showcase-operator-features">
                    {item.features.map((feat, i) => (
                      <span key={i} className="operator-feature-chip">
                        <i className="fa-solid fa-check"></i> {feat}
                      </span>
                    ))}
                  </div>
                  <div className="showcase-operator-footer">
                    <div>
                      <div className="operator-price-label">Starting at</div>
                      <div className="operator-price-val">{item.price}</div>
                    </div>
                    <button type="button" className="showcase-operator-hire-btn">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isOperatorsExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn right"
              onClick={() => scrollContainer(operatorsTrackRef, 320)}
              aria-label="Scroll Operators Right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      </section>

      {/* 6. OFFERS - Coupons, discounts and promotional fares */}
      <section className="showcase-section offers-promo-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Exclusive Deals & Offers</h2>
            <span className="showcase-subtitle-tag" style={{ color: '#db2777' }}>Coupons, Promo Codes & Special Fares</span>
          </div>
          <span className="showcase-live-pill" style={{ background: '#fdf2f8', color: '#db2777', border: '1px solid #fbcfe8', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
            <i className="fa-solid fa-fire"></i> Active Today Only
          </span>
        </div>

        <div className="showcase-coupons-grid">
          {COUPON_OFFERS_DATA.map(promo => (
            <div key={promo.id} className="showcase-coupon-card" style={{ background: promo.cardBg }}>
              <div className="showcase-coupon-left-badge" style={{ background: promo.accentColor }}>
                <i className={promo.icon}></i>
              </div>
              <div className="showcase-coupon-content">
                <div className="showcase-coupon-top-row">
                  <span className="coupon-category" style={{ color: promo.accentColor }}>{promo.category}</span>
                  <span className="coupon-discount-tag" style={{ background: promo.accentColor }}>{promo.discount}</span>
                </div>
                <h4 className="coupon-title">{promo.title}</h4>
                <p className="coupon-desc">{promo.description}</p>
                <div className="showcase-coupon-bottom-row">
                  <div className="coupon-code-box">
                    <span className="code-text">{promo.code}</span>
                    <button
                      type="button"
                      className="copy-code-btn"
                      onClick={() => {
                        navigator.clipboard?.writeText(promo.code);
                        alert(`Coupon code "${promo.code}" copied to clipboard!`);
                      }}
                      title="Copy Coupon"
                    >
                      <i className="fa-regular fa-copy"></i>
                    </button>
                  </div>
                  <span className="coupon-expiry"><i className="fa-regular fa-clock"></i> {promo.validTill}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. BOOKING MANAGEMENT - My Bookings, ticket details and cancellations */}
      <section className="showcase-section booking-mgmt-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Booking Management</h2>
            <span className="showcase-subtitle-tag" style={{ color: '#7c3aed' }}>Manage Trips, Ticket Details & Instant Refunds</span>
          </div>
        </div>

        <div className="showcase-mgmt-container">
          <div className="showcase-mgmt-hero-box">
            <div className="showcase-mgmt-hero-text">
              <span className="mgmt-badge"><i className="fa-solid fa-shield-halved"></i> 100% Self-Service Portal</span>
              <h3>Manage All Your Trips In One Place</h3>
              <p>Download e-tickets, check live seat charts, track coach positions, modify journey dates, or process full instant refunds with zero friction.</p>
              <div className="mgmt-hero-stats">
                <div className="mgmt-stat">
                  <strong>2 mins</strong>
                  <span>Instant Cancellation</span>
                </div>
                <div className="mgmt-stat">
                  <strong>100%</strong>
                  <span>Auto-Refunds</span>
                </div>
                <div className="mgmt-stat">
                  <strong>SMS / WA</strong>
                  <span>Paperless Tickets</span>
                </div>
              </div>
            </div>
            <div className="showcase-mgmt-hero-img">
              <img
                src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=700&q=80"
                alt="Manage Bookings with SART"
              />
            </div>
          </div>

          <div className="showcase-mgmt-features-grid">
            {BOOKING_MGMT_CARDS.map(card => (
              <div key={card.id} className="showcase-mgmt-card">
                <div className="mgmt-card-img-wrap">
                  <img src={card.image} alt={card.title} />
                  <div className="mgmt-card-icon" style={{ background: card.accent }}>
                    <i className={card.icon}></i>
                  </div>
                </div>
                <div className="mgmt-card-body">
                  <h4>{card.title}</h4>
                  <p>{card.description}</p>
                  <ul className="mgmt-card-bullets">
                    {card.features.map((f, i) => (
                      <li key={i}><i className="fa-solid fa-circle-check" style={{ color: card.accent }}></i> {f}</li>
                    ))}
                  </ul>
                  <button type="button" className="mgmt-card-action-btn" style={{ borderColor: card.accent, color: card.accent }}>
                    {card.actionText} <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER SUPPORT - Help centre, FAQs and contact support */}
      <section className="showcase-section customer-support-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Customer Support & Help Centre</h2>
            <span className="showcase-subtitle-tag" style={{ color: '#0ea5e9' }}>24x7 Assistance, Emergency Helpline & FAQs</span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>
            <i className="fa-solid fa-circle" style={{ fontSize: '9px', marginRight: '6px' }}></i> Help Agents Active
          </span>
        </div>

        <div className="showcase-support-grid">
          {/* Quick Contact Channels */}
          <div className="support-channels-col">
            {SUPPORT_CHANNELS_DATA.map(ch => (
              <div key={ch.id} className="support-channel-card">
                <div className="support-channel-icon" style={{ background: ch.iconBg, color: ch.iconColor }}>
                  <i className={ch.icon}></i>
                </div>
                <div className="support-channel-info">
                  <div className="channel-title-row">
                    <h4>{ch.title}</h4>
                    <span className="channel-avail">{ch.available}</span>
                  </div>
                  <p>{ch.desc}</p>
                  <span className="channel-contact-val">{ch.contact}</span>
                </div>
                <button type="button" className="channel-btn" style={{ background: ch.iconColor }}>
                  {ch.action}
                </button>
              </div>
            ))}
          </div>

          {/* Interactive FAQs Accordion */}
          <div className="support-faqs-col">
            <div className="support-faqs-box">
              <div className="faqs-header">
                <i className="fa-solid fa-circle-question" style={{ color: '#0284c7', fontSize: '18px' }}></i>
                <h3>Frequently Asked Questions</h3>
              </div>
              <div className="faqs-list">
                {SUPPORT_FAQS_DATA.map((faq, index) => {
                  const isOpen = expandedFaqIndex === index;
                  return (
                    <div key={faq.id} className={`faq-item ${isOpen ? 'active' : ''}`}>
                      <button
                        type="button"
                        className="faq-question-btn"
                        onClick={() => setExpandedFaqIndex(isOpen ? null : index)}
                      >
                        <span>{faq.q}</span>
                        <i className={`fa-solid ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                      </button>
                      {isOpen && (
                        <div className="faq-answer">
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TRUST INDICATORS - Verified providers, secure payments and transparent pricing */}
      <section className="showcase-section trust-indicators-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Why 10M+ Travelers Trust SART</h2>
            <span className="showcase-subtitle-tag" style={{ color: '#059669' }}>Verified Providers • 256-Bit Secure Payments • 100% Transparent</span>
          </div>
        </div>

        <div className="showcase-trust-grid">
          {TRUST_PILLARS_DATA.map(pillar => (
            <div key={pillar.id} className="showcase-trust-card">
              <div className="trust-card-top">
                <div className="trust-icon-box" style={{ background: pillar.bg, color: pillar.color }}>
                  <i className={pillar.icon}></i>
                </div>
                <span className="trust-metric-pill" style={{ color: pillar.color, background: pillar.bg }}>
                  {pillar.metric}
                </span>
              </div>
              <h3 className="trust-title">{pillar.title}</h3>
              <p className="trust-desc">{pillar.description}</p>
              <div className="trust-divider"></div>
              <div className="trust-highlight">
                <i className="fa-solid fa-shield-check" style={{ color: pillar.color }}></i>
                <span>{pillar.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Partner Verification Banner */}
        <div className="showcase-security-banner">
          <div className="sec-banner-left">
            <div className="sec-shield-icon">
              <i className="fa-solid fa-lock"></i>
            </div>
            <div>
              <h4>Government Licensed & PCI-DSS Level 1 Certified</h4>
              <p>All credit cards, UPI transactions, IRCTC ticket bookings and rental agreements are protected with bank-grade encryption.</p>
            </div>
          </div>
          <div className="sec-badges-row">
            <span className="sec-badge"><i className="fa-solid fa-shield-halved"></i> PCI-DSS</span>
            <span className="sec-badge"><i className="fa-solid fa-building-columns"></i> RBI Approved UPI</span>
            <span className="sec-badge"><i className="fa-solid fa-award"></i> ISO 27001</span>
            <span className="sec-badge"><i className="fa-solid fa-id-card"></i> 100% KYC Verified</span>
          </div>
        </div>
      </section>

    </div>
  );
}
