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
    name: "Bike",
    location: "Chennai City & Nearby Routes",
    rating: "4.8",
    reviews: "2k+ Travelers",
    price: "₹99",
    duration: "Local Trip",
    category: "Bike & Scooter Rides",
    badge: "Quick & Affordable",
    capacity: "1 Passenger",
    description:
      "Beat traffic with a quick and affordable bike ride for office commutes, shopping, and short city trips.",
    transport: "Two-Wheeler Ride",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Car",
    location: "Chennai to Pondicherry",
    rating: "4.8",
    reviews: "3k+ Travelers",
    price: "₹2,499",
    duration: "Approx. 3 Hours",
    category: "City & Outstation Cab",
    badge: "Most Popular",
    capacity: "4 Passengers",
    description:
      "Travel comfortably in an air-conditioned car for city rides, airport transfers, family trips, and outstation journeys.",
    transport: "Private Car",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Auto",
    location: "Chennai City",
    rating: "4.6",
    reviews: "1.5k+ Travelers",
    price: "₹199",
    duration: "Local Trip",
    category: "Local Auto Service",
    badge: "Budget Friendly",
    capacity: "3 Passengers",
    description:
      "Book a convenient auto for daily commutes, nearby shopping, railway station transfers, and short-distance travel.",
    transport: "Auto Rickshaw",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCSsmoe6rtaNGw-IirYBw8PyyweuNHuqmCPbTF_Qbpfw&s=10",
  },
  {
    id: 4,
    name: "Bus",
    location: "Chennai to Bengaluru",
    rating: "4.7",
    reviews: "5k+ Travelers",
    price: "₹699",
    duration: "Approx. 6 Hours",
    category: "Bus & Intercity Travel",
    badge: "Popular Route",
    capacity: "30–50 Passengers",
    description:
      "Book intercity bus journeys with route information, departure times, seat selection, and passenger booking details.",
    transport: "Passenger Bus",
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Goods Transport Truck",
    location: "Chennai & Across Tamil Nadu",
    rating: "4.8",
    reviews: "1.8k+ Shipments",
    price: "Get a Quote",
    duration: "Based on Distance",
    category: "Cargo & Goods Transport",
    badge: "Verified Carrier",
    capacity: "1–10+ Tons",
    description:
      "Transport business goods, furniture, construction materials, and commercial loads with suitable trucks and delivery options.",
    transport: "Commercial Truck",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
  },
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
  category: '';
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
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=700&q=80'
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

interface ListingCardItem {
  id: number;
  name: string;
  category: string;
  provider: string;
  type: string;
  rating: string;
  price: string;
  priceLabel?: string;
  highlights: string;
  features: string[];
  statusBadge: string;
  statusBadgeColor?: string;
  image: string;
  btnText: string;
}

const RIDES_TRAVEL_DATA: ListingCardItem[] = [
  {
    id: 1,
    name: 'Bike',
    category: 'Bikes',
    provider: 'Rapido & City Moto Express',
    type: 'Bike & Scooter Rides • 1 Rider',
    rating: '4.8 (8.5k rides)',
    price: '₹49',
    priceLabel: 'Starting fare',
    highlights: 'Instant pickup, helmet provided, fastest navigation through peak traffic.',
    features: ['Quick Pickup', 'Verified Rider', 'Helmet Provided', 'Live GPS'],
    statusBadge: 'Fastest in Traffic',
    statusBadgeColor: '#0284c7',
    image: 'https://www.bike4rent.in/images/bikes/dreamneo.png',
    btnText: 'Book Ride'
  },
  {
    id: 2,
    name: 'Auto',
    category: 'Autos',
    provider: 'SART City Auto Guild',
    type: 'Auto Rickshaw • Up to 3 Passengers',
    rating: '4.7 (12k rides)',
    price: '₹69',
    priceLabel: 'Metered base fare',
    highlights: 'Pocket-friendly door-to-door transit, zero meter tampering guarantee.',
    features: ['Metered Fare', 'Doorstep Pickup', 'Cash & UPI', 'No Bargaining'],
    statusBadge: 'Everyday Saver',
    statusBadgeColor: '#16a34a',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCSsmoe6rtaNGw-IirYBw8PyyweuNHuqmCPbTF_Qbpfw&s=10',
    btnText: 'Book Ride'
  },
  {
    id: 3,
    name: 'Car',
    category: 'Hatchbacks',
    provider: 'Prime City Cabs',
    type: 'Economy Hatchback • 4 Passengers',
    rating: '4.7 (9.2k rides)',
    price: '₹149',
    priceLabel: 'Base estimate',
    highlights: 'Compact AC cars ideal for comfortable everyday commute and grocery runs.',
    features: ['Air Conditioned', 'Clean Cabins', 'Affordable Fares', 'Luggage Boot'],
    statusBadge: 'Best Value',
    statusBadgeColor: '#059669',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9b-n5UYFeSTe4PixETRDd7BN1AETESozz8Y1CrbKD-w&s',
    btnText: 'Book Ride'
  },


  {
    id: 6,
    name: 'Bus',
    category: 'Buses',
    provider: 'State Express & SRS Fleets',
    type: 'Intercity Bus • AC Sleeper / Semi-Sleeper',
    rating: '4.8 (14.2k ratings)',
    price: '₹599',
    priceLabel: 'Per seat',
    highlights: 'Scheduled departures, live tracking, charging ports, blankets, and verified rest stops.',
    features: ['Live Tracking', 'Charging Ports', 'Water & Blankets', 'Reclining Berths'],
    statusBadge: 'Verified Operator',
    statusBadgeColor: '#16a34a',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxyqCeZUjWUGC5aHtAbH1KC30rkgau3WuLt4eBNlATVQ&s=10',
    btnText: 'View Details'
  },
  {
    id: 7,
    name: 'Train',
    category: 'Trains',
    provider: 'Indian Railways Partner Services',
    type: 'Train Travel • 1A, 2A, 3A, CC & SL',
    rating: '4.7 (42k bookings)',
    price: '₹385',
    priceLabel: 'Starting ticket',
    highlights: 'Official IRCTC partner integration, verified seat availability, PNR updates, and food delivery.',
    features: ['Instant PNR Status', 'Seat Availability', 'Tatkal Support', 'Free Cancellation'],
    statusBadge: 'Nationwide Connect',
    statusBadgeColor: '#9333ea',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCA5JFVd3eULL1V32-6A4dOfqzHgAHqyS2gorrXtuX5g&s=10',
    btnText: 'View Details'
  },
  {
    id: 8,
    name: 'Flight',
    category: 'Flights',
    provider: 'Domestic & Global Air Alliances',
    type: 'Flight Travel • Economy & Business',
    rating: '4.9 (18k flyers)',
    price: '₹2,899',
    priceLabel: 'Starting airfare',
    highlights: 'Zero convenience fees on select cards, instant web check-in support, and baggage assurance.',
    features: ['Zero Gateway Fee', 'Web Check-in', 'Baggage Assurance', 'Meal Pre-order'],
    statusBadge: 'Fastest Transit',
    statusBadgeColor: '#e11d48',
    image: 'https://www.livemint.com/lm-img/img/2024/04/19/original/Air_India_A350-900_1713508027779.jpg',
    btnText: 'View Details'
  },

  {
    id: 10,
    name: 'Helicopter',
    category: 'Helicopters',
    provider: 'SkyAero Charter Logistics',
    type: 'Helicopter Travel • Pilgrimage & Charters',
    rating: '4.9 (1.4k passengers)',
    price: '₹3,499',
    priceLabel: 'Starting seat',
    highlights: 'Fast-track heli-shuttle services for pilgrimage hubs, aerial city views, and corporate charters.',
    features: ['Priority Helipad', 'Experienced Pilots', 'Panoramic Windows', 'Express Check-in'],
    statusBadge: 'Premium Air',
    statusBadgeColor: '#d97706',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrfhFNBLKjDgSsfyNJ2lA43dkHBMm1_rTuw5MUtqeGQg&s=10',
    btnText: 'View Details'
  }

];

const CARGO_CARRIER_DATA: ListingCardItem[] = [


  {
    id: 1,
    name: "Heavy Goods Truck",
    category: "Heavy Trucks",
    provider: "National Cargo Logistics",
    type: "Heavy Truck • 10–25 Ton Payload",
    rating: "",
    price: "",
    priceLabel: "Starting fare",
    highlights:
      "Transport heavy goods, industrial materials, machinery, and bulk commercial shipments between cities and states.",
    features: [
      "Bulk Goods Transport",
      "GPS Tracking",
      "Verified Driver",
      "Intercity Delivery",
    ],
    statusBadge: "Heavy Freight",
    statusBadgeColor: "#ea580c",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2025/11/563084588/DL/CC/TZ/229475018/transport-services-500x500.jpeg",
    btnText: "Book Carrier",
  },
  {
    id: 2,
    name: "Goods Train Transport",
    category: "Rail Freight",
    provider: "SART Rail Cargo Services",
    type: "Freight Train • Bulk Goods & Containers",
    rating: "",
    price: "",
    priceLabel: "Based on route and load",
    highlights:
      "Move bulk goods, agricultural products, raw materials, and commercial cargo over long distances by rail.",
    features: [
      "Bulk Freight",
      "Rail Route Options",
      "Shipment Tracking",
      "Cargo Documentation",
    ],
    statusBadge: "Rail Logistics",
    statusBadgeColor: "#0284c7",
    image:
      "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2020/09/08/Pictures/workers-load-sacks-onto-trucks_ff2adfb4-f18b-11ea-b62b-e96b83076abc.jpg",
    btnText: "Book Rail Cargo",
  },
  {
    id: 3,
    name: "Bike Parcel Delivery",
    category: "Bike Courier",
    provider: "QuickDrop Parcel Network",
    type: "Delivery Bike • Small Parcels & Documents",
    rating: "",
    price: "",
    priceLabel: "Starting fare",
    highlights:
      "Send documents, small parcels, medicines, and lightweight packages quickly across your city.",
    features: [
      "Small Parcel Delivery",
      "Pickup at Your Door",
      "Live Tracking",
      "Delivery Confirmation",
    ],
    statusBadge: "Express Delivery",
    statusBadgeColor: "#16a34a",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXDUMFmFz_bwe1aFrO52xFw63OczJjQESMKaiYvuztURTP12L2P7GmPr0&s=10",
    btnText: "Send a Parcel",
  },
  {
    id: 4,
    name: "Air Cargo Delivery",
    category: "Air Freight",
    provider: "SART Air Cargo Network",
    type: "Air Freight • Express & Commercial Cargo",
    rating: "",
    price: "",
    priceLabel: "Based on weight and route",
    highlights:
      "Ship urgent parcels, business consignments, and commercial goods between cities and international destinations by air.",
    features: [
      "Express Air Freight",
      "Shipment Documentation",
      "Tracking Updates",
      "International Cargo Options",
    ],
    statusBadge: "Express Air Cargo",
    statusBadgeColor: "#7c3aed",
    image:
      "https://www.ttspl.in/wp-content/uploads/2024/08/Website-Banner_1000X562_24Aug2024-1-1080x675.jpg",
    btnText: "Book Air Cargo",
  },
  {
    id: 5,
    name: "Mini Truck Delivery",
    category: "Mini Trucks",
    provider: "QuickHaul City Logistics",
    type: "Mini Truck • 0.75–1.5 Ton Payload",
    rating: "",
    price: "",
    priceLabel: "Base + ₹25/km",
    highlights:
      "Move furniture, household goods, shop inventory, and small commercial loads through city streets.",
    features: [
      "House Shifting",
      "Loading Helper Option",
      "Live GPS Tracking",
      "Local Delivery",
    ],
    statusBadge: "Urban Workhorse",
    statusBadgeColor: "#16a34a",
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80",
    btnText: "Book Mini Truck",
  },

];

const DRIVERS_PARKING_DATA: ListingCardItem[] = [
  {
    id: 1,
    name: 'Hourly Driver',
    category: 'Hire a Driver',
    provider: 'Verified Chauffeur Network',
    type: 'Driver Hire • Local City Journeys',
    rating: '4.9 (3.8k trips)',
    price: '₹99 / hr',
    priceLabel: 'Starting rate',
    highlights: 'Background checked and verified driver for your personal car, hatchback, or sedan.',
    features: ['Police Verified', 'Manual & Automatic', 'Uniformed Driver', 'Zero Deposit'],
    statusBadge: 'Verified Driver',
    statusBadgeColor: '#16a34a',
    image: '/images/hourly_driver_showcase.png',
    btnText: 'Hire Driver'
  },
  {
    id: 2,
    name: 'Full-Day Driver',
    category: 'Full-Day Drivers',
    provider: 'Elite Driver Services',
    type: 'Driver Hire • 8-12 Hours Package',
    rating: '4.9 (2.1k trips)',
    price: '₹799 / day',
    priceLabel: 'Full day pack',
    highlights: 'Full-day acting driver for shopping errands, office visits, or family hospital rounds.',
    features: ['8 to 12 Hours Duty', 'Punctuality Guarantee', 'Route Expert', 'No Surge Pricing'],
    statusBadge: 'Top Rated Pro',
    statusBadgeColor: '#0284c7',
    image: '/images/fullday_driver_showcase.jpg',
    btnText: 'Hire Driver'
  },
  {
    id: 3,
    name: 'Airport Driver',
    category: 'Airport Drivers',
    provider: 'FlightConnect Drivers',
    type: 'Driver Hire • Airport Terminal Drop/Pick',
    rating: '4.8 (4.6k trips)',
    price: '₹449',
    priceLabel: 'Single trip pack',
    highlights: 'Prompt driver at your doorstep to drive your own car to or from the airport terminal.',
    features: ['Flight Tracking', 'Luggage Handling', 'Midnight Pickup', 'Zero Wait Charges'],
    statusBadge: 'Airport Specialist',
    statusBadgeColor: '#7c3aed',
    image: '/images/airport_driver_showcase.jpg',
    btnText: 'Hire Driver'
  },
  {
    id: 4,
    name: 'Car Parking',
    category: 'Car Parking',
    provider: 'SmartPark Transit Hub',
    type: 'Parking Space • Cars & SUVs',
    rating: '4.8 (6.2k bookings)',
    price: '₹30 / hr',
    priceLabel: '₹180 / day',
    highlights: 'Multilevel covered parking with 24x7 CCTV, automated boom barrier, and EV charging.',
    features: ['24x7 CCTV Surveillance', 'EV Fast Charging', 'Covered Basement', 'App Entry QR'],
    statusBadge: 'Smart Parking',
    statusBadgeColor: '#059669',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=700&q=80',
    btnText: 'Book Parking'
  },
  {
    id: 5,
    name: 'Bike Parking',
    category: 'Bike Parking',
    provider: 'UrbanRide Transit Stations',
    type: 'Parking Space • Bikes & Scooters',
    rating: '4.7 (8.9k bookings)',
    price: '₹10 / hr',
    priceLabel: '₹50 / day',
    highlights: 'Dedicated secure two-wheeler bay next to metro and bus terminals for daily commuters.',
    features: ['Helmet Lockers', 'Shaded Sheds', 'Security Guard', 'Fast QR Checkout'],
    statusBadge: 'Commuter Hub',
    statusBadgeColor: '#0284c7',
    image: '/images/bike_parking_showcase.jpg',
    btnText: 'Book Parking'
  },
  {
    id: 6,
    name: 'Truck Parking',
    category: 'Truck Parking',
    provider: 'Highway Rest & Logistics Plaza',
    type: 'Parking Space • Commercial Trucks & Lorries',
    rating: '4.8 (1.5k bookings)',
    price: '₹120 / day',
    priceLabel: 'Secure yard fee',
    highlights: 'Spacious all-weather parking yard with driver rest areas, security patrol, and mechanics.',
    features: ['Heavy Vehicle Bays', 'Driver Dormitory', 'Onsite Mechanic', 'High Mast Lights'],
    statusBadge: 'Logistics Plaza',
    statusBadgeColor: '#ea580c',
    image: '/images/truck_parking_showcase.jpg',
    btnText: 'Book Parking'
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
  const [isHotelsGridExpanded, setIsHotelsGridExpanded] = useState(false);
  const [isRoutesExpanded, setIsRoutesExpanded] = useState(false);

  // 1. Rides Listings
  const [isRidesExpanded, setIsRidesExpanded] = useState(false);
  const [ridesCategory, setRidesCategory] = useState('All');
  const ridesTrackRef = useRef<HTMLDivElement>(null);

  // 2. Carrier Listings
  const [isCarrierExpanded, setIsCarrierExpanded] = useState(false);
  const [carrierCategory, setCarrierCategory] = useState('All');
  const carrierTrackRef = useRef<HTMLDivElement>(null);

  // 3. Drivers & Parking Listings
  const [isDriversParkingExpanded, setIsDriversParkingExpanded] = useState(false);
  const [driversParkingCategory, setDriversParkingCategory] = useState('All');
  const driversParkingTrackRef = useRef<HTMLDivElement>(null);

  // 4. Vehicle Rental Listings
  const [isRentalsExpanded, setIsRentalsExpanded] = useState(false);
  const [rentalsCategory, setRentalsCategory] = useState('All');
  const rentalsTrackRef = useRef<HTMLDivElement>(null);

  const hotelsTrackRef = useRef<HTMLDivElement>(null);
  const routesTrackRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, distance: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  // Filter logic
  const filteredRides = ridesCategory === 'All'
    ? RIDES_TRAVEL_DATA
    : RIDES_TRAVEL_DATA.filter(item => {
      if (ridesCategory === 'Cars') return item.category === 'Sedans' || item.category === 'Hatchbacks' || item.category === 'SUVs';
      return item.category === ridesCategory;
    });

  const filteredCarriers = carrierCategory === 'All'
    ? CARGO_CARRIER_DATA
    : CARGO_CARRIER_DATA.filter(item => item.category === carrierCategory);

  const filteredDriversParking = driversParkingCategory === 'All'
    ? DRIVERS_PARKING_DATA
    : DRIVERS_PARKING_DATA.filter(item => {
      if (driversParkingCategory === 'Drivers') return item.category === 'Hire a Driver' || item.category === 'Full-Day Drivers' || item.category === 'Airport Drivers';
      if (driversParkingCategory === 'Parking') return item.category === 'Car Parking' || item.category === 'Bike Parking' || item.category === 'Truck Parking';
      return true;
    });

  const filteredRentals = rentalsCategory === 'All'
    ? HOTELS_DATA
    : HOTELS_DATA.filter(item => {
      if (rentalsCategory === 'Cabs & Sedans') return item.name.toLowerCase().includes('hatchback') || item.name.toLowerCase().includes('sedan') || item.name.toLowerCase().includes('car');
      if (rentalsCategory === 'SUVs & Vans') return item.name.toLowerCase().includes('suv') || item.name.toLowerCase().includes('tempo') || item.name.toLowerCase().includes('bus');
      if (rentalsCategory === 'Bikes & Autos') return item.name.toLowerCase().includes('bike') || item.name.toLowerCase().includes('auto');
      return true;
    });

  return (
    <div className="showcase-container">


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

      {/* 5.1 RIDES LISTINGS */}
      <section className="showcase-section operator-listings-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Rides Listings</h2>
            <span className="showcase-subtitle-tag" style={{ color: '#0284c7' }}>Rides & Commute</span>
          </div>
          <div className="showcase-header-right">
            <div className="showcase-category-pills">
              {([''] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`showcase-pill-btn ${ridesCategory === tab ? 'active' : ''}`}
                  onClick={() => setRidesCategory(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="showcase-view-all-link"
              onClick={() => setIsRidesExpanded(prev => !prev)}
              style={{ background: '#f0f9ff', borderColor: '#bae6fd', color: '#0284c7' }}
            >
              {isRidesExpanded ? 'View Less' : 'View All Rides'} <i className={`fa-solid ${isRidesExpanded ? 'fa-chevron-up' : 'fa-chevron-right'}`}></i>
            </button>
          </div>
        </div>

        <div className="showcase-slider-relative">
          {!isRidesExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn left"
              onClick={() => scrollContainer(ridesTrackRef, -320)}
              aria-label="Scroll Rides Left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <div
            className={`showcase-operators-track ${isRidesExpanded ? 'grid-expanded' : ''}`}
            ref={ridesTrackRef}
          >
            {filteredRides.map(item => (
              <div key={`ride-${item.id}`} className="showcase-operator-card">
                <div className="showcase-operator-img-wrap">
                  <img src={item.image} alt={item.name} />
                  <span className="showcase-operator-verified">
                    <i className="fa-solid fa-circle-check"></i> {item.statusBadge}
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

                  {/* <div className="showcase-operator-provider">
                    <i className="fa-solid fa-building"></i> Operated by <strong>{item.provider}</strong>
                  </div> */}

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
                      {/* <div className="operator-price-label">Starting at</div> */}
                      {/* <div className="operator-price-val">{item.price}</div> */}
                    </div>
                    <button type="button" className="showcase-operator-hire-btn">
                      {item.btnText || 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isRidesExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn right"
              onClick={() => scrollContainer(ridesTrackRef, 320)}
              aria-label="Scroll Rides Right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      </section>

      {/* 5.2 CARRIER LISTINGS */}
      <section className="showcase-section operator-listings-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Carrier Listings</h2>
            <span className="showcase-subtitle-tag" style={{ color: '#ea580c' }}>Cargo & Logistics</span>
          </div>
          <div className="showcase-header-right">
            <div className="showcase-category-pills">
              {([''] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`showcase-pill-btn ${carrierCategory === tab ? 'active' : ''}`}
                  onClick={() => setCarrierCategory(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="showcase-view-all-link"
              onClick={() => setIsCarrierExpanded(prev => !prev)}
              style={{ background: '#fff7ed', borderColor: '#fed7aa', color: '#ea580c' }}
            >
              {isCarrierExpanded ? 'View Less' : 'View All Carriers'} <i className={`fa-solid ${isCarrierExpanded ? 'fa-chevron-up' : 'fa-chevron-right'}`}></i>
            </button>
          </div>
        </div>

        <div className="showcase-slider-relative">
          {!isCarrierExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn left"
              onClick={() => scrollContainer(carrierTrackRef, -320)}
              aria-label="Scroll Carrier Left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <div
            className={`showcase-operators-track ${isCarrierExpanded ? 'grid-expanded' : ''}`}
            ref={carrierTrackRef}
          >
            {filteredCarriers.map(item => (
              <div key={`carrier-${item.id}`} className="showcase-operator-card">
                <div className="showcase-operator-img-wrap">
                  <img src={item.image} alt={item.name} />
                  <span className="showcase-operator-verified">
                    <i className="fa-solid fa-circle-check"></i> {item.statusBadge}
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

                  {/* <div className="showcase-operator-provider">
                    <i className="fa-solid fa-truck-moving"></i> Operated by <strong>{item.provider}</strong>
                  </div> */}

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
                      {/* <div className="operator-price-label">Starting at</div>
                      <div className="operator-price-val">{item.price}</div> */}
                    </div>
                    <button type="button" className="showcase-operator-hire-btn" style={{ background: '#ea580c' }}>
                      {item.btnText || 'Book Carrier'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isCarrierExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn right"
              onClick={() => scrollContainer(carrierTrackRef, 320)}
              aria-label="Scroll Carrier Right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      </section>

      {/* 5.3 DRIVERS & PARKING LISTINGS */}
      <section className="showcase-section operator-listings-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Drivers & Parking Listings</h2>
            <span className="showcase-subtitle-tag" style={{ color: '#16a34a' }}>Chauffeurs & Parking Hubs</span>
          </div>
          <div className="showcase-header-right">
            <div className="showcase-category-pills">
              {(['All'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`showcase-pill-btn ${driversParkingCategory === tab ? 'active' : ''}`}
                  onClick={() => setDriversParkingCategory(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="showcase-view-all-link"
              onClick={() => setIsDriversParkingExpanded(prev => !prev)}
              style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#16a34a' }}
            >
              {isDriversParkingExpanded ? 'View Less' : 'View All Drivers & Parking'} <i className={`fa-solid ${isDriversParkingExpanded ? 'fa-chevron-up' : 'fa-chevron-right'}`}></i>
            </button>
          </div>
        </div>

        <div className="showcase-slider-relative">
          {!isDriversParkingExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn left"
              onClick={() => scrollContainer(driversParkingTrackRef, -320)}
              aria-label="Scroll Drivers Left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <div
            className={`showcase-operators-track ${isDriversParkingExpanded ? 'grid-expanded' : ''}`}
            ref={driversParkingTrackRef}
          >
            {filteredDriversParking.map(item => (
              <div key={`dp-${item.id}`} className="showcase-operator-card">
                <div className="showcase-operator-img-wrap">
                  <img src={item.image} alt={item.name} />
                  <span className="showcase-operator-verified">
                    <i className="fa-solid fa-circle-check"></i> {item.statusBadge}
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
                    <i className="fa-solid fa-id-card"></i> Service: <strong>{item.provider}</strong>
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
                      {/* <div className="operator-price-label">Starting at</div>
                      <div className="operator-price-val">{item.price}</div> */}
                    </div>
                    <button type="button" className="showcase-operator-hire-btn" style={{ background: '#16a34a' }}>
                      {item.btnText || 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isDriversParkingExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn right"
              onClick={() => scrollContainer(driversParkingTrackRef, 320)}
              aria-label="Scroll Drivers Right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      </section>

      {/* 5.4 VEHICLE RENTAL LISTINGS */}
      <section className="showcase-section operator-listings-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Vehicle Rental Listings</h2>
            <span className="showcase-subtitle-tag" style={{ color: '#7c3aed' }}>Self-Drive & Outstation Fleets</span>
          </div>
          <div className="showcase-header-right">
            <div className="showcase-category-pills">
              {(['All'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`showcase-pill-btn ${rentalsCategory === tab ? 'active' : ''}`}
                  onClick={() => setRentalsCategory(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="showcase-view-all-link"
              onClick={() => setIsRentalsExpanded(prev => !prev)}
              style={{ background: '#f5f3ff', borderColor: '#ddd6fe', color: '#7c3aed' }}
            >
              {isRentalsExpanded ? 'View Less' : 'View All Rentals'} <i className={`fa-solid ${isRentalsExpanded ? 'fa-chevron-up' : 'fa-chevron-right'}`}></i>
            </button>
          </div>
        </div>

        <div className="showcase-slider-relative">
          {!isRentalsExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn left"
              onClick={() => scrollContainer(rentalsTrackRef, -320)}
              aria-label="Scroll Rentals Left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <div
            className={`showcase-operators-track ${isRentalsExpanded ? 'grid-expanded' : ''}`}
            ref={rentalsTrackRef}
          >
            {filteredRentals.map(rental => (
              <div key={`rental-${rental.id}`} className="showcase-operator-card">
                <div className="showcase-operator-img-wrap">
                  <img src={rental.image} alt={rental.name} />
                  <span className="showcase-operator-verified">
                    <i className="fa-solid fa-circle-check"></i> {rental.badge || 'Verified Rental'}
                  </span>
                  <span className="showcase-operator-type">{rental.category || rental.transport || 'Self-Drive / Cab'}</span>
                </div>
                <div className="showcase-operator-body">
                  <div className="showcase-operator-header">
                    <h3 className="showcase-operator-name">{rental.name}</h3>
                    <div className="showcase-operator-rating">
                      <i className="fa-solid fa-star"></i> {rental.rating}
                    </div>
                  </div>

                  <div className="showcase-operator-provider">
                    <i className="fa-solid fa-location-dot"></i> {rental.location}
                  </div>

                  <p className="showcase-operator-highlights">{rental.description || `${rental.capacity || '4 Passengers'} • ${rental.duration || 'Per Day'}`}</p>

                  <div className="showcase-operator-features">
                    {rental.capacity && (
                      <span className="operator-feature-chip">
                        <i className="fa-solid fa-users"></i> {rental.capacity}
                      </span>
                    )}
                    {rental.duration && (
                      <span className="operator-feature-chip">
                        <i className="fa-regular fa-clock"></i> {rental.duration}
                      </span>
                    )}
                    {rental.transport && (
                      <span className="operator-feature-chip">
                        <i className="fa-solid fa-car"></i> {rental.transport}
                      </span>
                    )}
                  </div>

                  <div className="showcase-operator-footer">
                    <div>
                      {/* <div className="operator-price-label">Starting at</div>
                      <div className="operator-price-val">{rental.price}</div> */}
                    </div>
                    <button type="button" className="showcase-operator-hire-btn" style={{ background: '#7c3aed' }}>
                      Rent Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isRentalsExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn right"
              onClick={() => scrollContainer(rentalsTrackRef, 320)}
              aria-label="Scroll Rentals Right"
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





      {/* 9. TRUST INDICATORS - Verified providers, secure payments and transparent pricing */}
      <section className="showcase-section trust-indicators-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Why 10K+ Travelers Trust SART</h2>
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



      </section>

    </div>
  );
}
