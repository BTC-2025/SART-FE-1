'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSartStore } from '@/store/useSartStore';
import './BusBookingView.css';

export interface BusItem {
  id: string;
  operator: string;
  busType: string;
  isElectric?: boolean;
  hasLiveTracking?: boolean;
  hasTripReward?: boolean;
  isPrimo?: boolean;
  hasFreeCancellation?: boolean;
  isRTC?: boolean;
  rating: number;
  totalRatings: number;
  depTime: string;
  arrTime: string;
  duration: string;
  depLocation: string;
  arrLocation: string;
  availableSeats: number;
  singleSeats: number;
  fare: number;
  highlights: string[];
  boardingPoints: { name: string; time: string }[];
  droppingPoints: { name: string; time: string }[];
}

export const CALENDAR_DATES = (() => {
  const dates = [];
  const today = new Date();
  const weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push({
      day: String(d.getDate()).padStart(2, '0'),
      weekday: weekdaysShort[d.getDay()],
      month: monthsShort[d.getMonth()],
      year: d.getFullYear(),
      badgeType: i === 5 ? 'red-circle' : i === 6 ? 'brown-circle' : i % 2 === 0 ? 'green-dash' : 'orange-dash',
      badgeText: i === 5 ? String(d.getDate()) : i === 6 ? String(d.getDate()) : undefined
    });
  }
  return dates;
})();

export interface GovtRtcCardItem {
  code: string;
  fullName: string;
  bgImage: string;
  emblemSvg: React.ReactNode;
}

export const GOVT_RTC_CARDS: GovtRtcCardItem[] = [
  {
    code: 'APSRTC',
    fullName: 'Andhra Pradesh State Road Transport Corporation',
    bgImage: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80',
    emblemSvg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#e11d48" strokeWidth="3" />
        <circle cx="50" cy="50" r="42" fill="#fff1f2" />
        <path d="M50 15 L58 35 L80 35 L62 48 L68 70 L50 56 L32 70 L38 48 L20 35 L42 35 Z" fill="#e11d48" />
        <circle cx="50" cy="46" r="16" fill="#facc15" stroke="#b45309" strokeWidth="1.5" />
        <text x="50" y="44" textAnchor="middle" fill="#b91c1c" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">
          AP
        </text>
        <text x="50" y="52" textAnchor="middle" fill="#b91c1c" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">
          SRTC
        </text>
        <path id="apsrtc_arc" d="M 20 78 A 36 36 0 0 0 80 78" fill="none" stroke="#e11d48" strokeWidth="3.5" />
        <text fontSize="4.5" fontWeight="800" fill="#0f172a" textAnchor="middle">
          <textPath href="#apsrtc_arc" startOffset="50%">ఆంధ్రప్రదేశ్ RTC</textPath>
        </text>
      </svg>
    )
  },
  {
    code: 'TGSRTC',
    fullName: 'Telangana State Road Transport Corporation',
    bgImage: 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&w=600&q=80',
    emblemSvg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#15803d" strokeWidth="3" />
        <circle cx="50" cy="50" r="42" fill="#f0fdf4" />
        <path d="M26 68 L26 40 Q50 22 74 40 L74 68 Z" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M34 68 L34 46 Q50 32 66 46 L66 68" fill="none" stroke="#eab308" strokeWidth="2.5" />
        <rect x="42" y="52" width="16" height="16" fill="#15803d" rx="2" />
        <path d="M46 64 L46 56 L54 56 L54 64" fill="#ffffff" />
        <circle cx="50" cy="30" r="4" fill="#dc2626" />
        <text x="50" y="82" textAnchor="middle" fill="#15803d" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">
          TGSRTC
        </text>
      </svg>
    )
  },
  {
    code: 'Kerala RTC',
    fullName: 'Kerala Road Transport Corporation',
    bgImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    emblemSvg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#15803d" strokeWidth="3" />
        <circle cx="50" cy="50" r="42" fill="#fef08a" />
        <path d="M50 18 L68 28 L68 56 Q50 76 50 76 Q32 56 32 28 Z" fill="#b91c1c" stroke="#f59e0b" strokeWidth="1.5" />
        <ellipse cx="43" cy="46" rx="6" ry="7" fill="#ffffff" />
        <path d="M40 46 C37 46 36 54 35 60 C37 59 39 55 41 52" fill="#ffffff" />
        <ellipse cx="57" cy="46" rx="6" ry="7" fill="#ffffff" />
        <path d="M60 46 C63 46 64 54 65 60 C63 59 61 55 59 52" fill="#ffffff" />
        <circle cx="50" cy="32" r="5" fill="#fef08a" stroke="#ffffff" strokeWidth="1" />
        <rect x="25" y="78" width="50" height="12" rx="3" fill="#15803d" />
        <text x="50" y="87" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="900" fontFamily="sans-serif">
          KSRTC
        </text>
      </svg>
    )
  },
  {
    code: 'GSRTC',
    fullName: 'Gujarat State Road Transport Corporation',
    bgImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    emblemSvg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#047857" strokeWidth="3" />
        <circle cx="50" cy="50" r="42" fill="#ecfdf5" />
        <circle cx="50" cy="48" r="28" fill="#047857" />
        <path d="M38 38 Q50 34 62 40 Q64 52 58 58 Q46 62 38 52 Z" fill="#ffffff" opacity="0.9" />
        <circle cx="50" cy="48" r="8" fill="#f59e0b" />
        <circle cx="50" cy="48" r="5" fill="none" stroke="#047857" strokeWidth="1.5" />
        <line x1="50" y1="43" x2="50" y2="53" stroke="#047857" strokeWidth="1.5" />
        <line x1="45" y1="48" x2="55" y2="48" stroke="#047857" strokeWidth="1.5" />
        <text x="50" y="87" textAnchor="middle" fill="#047857" fontSize="7" fontWeight="900" fontFamily="sans-serif">
          GSRTC
        </text>
      </svg>
    )
  },
  {
    code: 'KSRTC',
    fullName: 'Karnataka State Road Transport Corporation',
    bgImage: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=600&q=80',
    emblemSvg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#b91c1c" strokeWidth="3" />
        <circle cx="50" cy="50" r="42" fill="#fff7ed" />
        <circle cx="50" cy="45" r="24" fill="#ea580c" />
        <path d="M50 32 L54 44 L64 36 L58 48 L68 52 L56 56 L58 64 L50 58 L42 64 L44 56 L32 52 L42 48 L36 36 L46 44 Z" fill="#fef08a" />
        <text x="50" y="86" textAnchor="middle" fill="#b91c1c" fontSize="7" fontWeight="900" fontFamily="sans-serif">
          KSRTC
        </text>
      </svg>
    )
  },
  {
    code: 'MSRTC',
    fullName: 'Maharashtra State Road Transport Corporation',
    bgImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    emblemSvg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#b91c1c" strokeWidth="3" />
        <circle cx="50" cy="50" r="42" fill="#fef2f2" />
        <path d="M50 20 L76 34 L76 66 L50 80 L24 66 L24 34 Z" fill="#b91c1c" />
        <circle cx="50" cy="50" r="14" fill="#ffffff" />
        <circle cx="50" cy="50" r="10" fill="#f59e0b" />
        <text x="50" y="53" textAnchor="middle" fill="#b91c1c" fontSize="8" fontWeight="900" fontFamily="sans-serif">
          ST
        </text>
        <text x="50" y="86" textAnchor="middle" fill="#b91c1c" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">
          MSRTC
        </text>
      </svg>
    )
  },
  {
    code: 'TNSTC',
    fullName: 'Tamil Nadu State Transport Corporation',
    bgImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    emblemSvg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#1d4ed8" strokeWidth="3" />
        <circle cx="50" cy="50" r="42" fill="#eff6ff" />
        <path d="M38 68 L42 46 L46 46 L47 34 L49 34 L50 24 L51 34 L53 34 L54 46 L58 46 L62 68 Z" fill="#1e40af" />
        <circle cx="50" cy="48" r="8" fill="#f59e0b" />
        <text x="50" y="86" textAnchor="middle" fill="#1e40af" fontSize="7" fontWeight="900" fontFamily="sans-serif">
          TNSTC
        </text>
      </svg>
    )
  },
  {
    code: 'RSRTC',
    fullName: 'Rajasthan State Road Transport Corporation',
    bgImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    emblemSvg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#c026d3" strokeWidth="3" />
        <circle cx="50" cy="50" r="42" fill="#fdf4ff" />
        <circle cx="50" cy="46" r="22" fill="#7e22ce" />
        <path d="M42 34 Q50 24 58 34 Q66 48 50 62 Q34 48 42 34 Z" fill="#facc15" />
        <circle cx="50" cy="44" r="5" fill="#dc2626" />
        <text x="50" y="86" textAnchor="middle" fill="#7e22ce" fontSize="7" fontWeight="900" fontFamily="sans-serif">
          RSRTC
        </text>
      </svg>
    )
  },
  {
    code: 'UPSRTC',
    fullName: 'Uttar Pradesh State Road Transport Corporation',
    bgImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
    emblemSvg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#b91c1c" strokeWidth="3" />
        <circle cx="50" cy="50" r="42" fill="#fef2f2" />
        <circle cx="50" cy="46" r="22" fill="#dc2626" />
        <path d="M38 46 Q50 36 62 46" fill="none" stroke="#fef08a" strokeWidth="2.5" />
        <line x1="50" y1="34" x2="50" y2="58" stroke="#fef08a" strokeWidth="2" />
        <text x="50" y="86" textAnchor="middle" fill="#b91c1c" fontSize="7" fontWeight="900" fontFamily="sans-serif">
          UPSRTC
        </text>
      </svg>
    )
  }
];

const INITIAL_BUSES: BusItem[] = [
  {
    id: 'bus-freshbus-1',
    operator: 'FRESHBUS',
    busType: 'Electric A/C Seater/Sleeper (2+1)',
    isElectric: true,
    hasLiveTracking: true,
    hasTripReward: true,
    isPrimo: true,
    hasFreeCancellation: true,
    rating: 4.8,
    totalRatings: 284,
    depTime: '08:45',
    arrTime: '11:15',
    duration: '2h 30m',
    depLocation: 'Semmancherry / Koyambedu',
    arrLocation: 'Vellore Bypass',
    availableSeats: 32,
    singleSeats: 8,
    fare: 449,
    highlights: ['100% Electric EV Bus', 'Primo Certified', 'Free Cancellation', 'Single Seats Available', 'Live GPS Tracking'],
    boardingPoints: [
      { name: 'Semmancherry', time: '08:45 AM' },
      { name: 'Koyambedu CMBT', time: '09:10 AM' }
    ],
    droppingPoints: [
      { name: 'Katpadi Junction', time: '11:00 AM' },
      { name: 'Vellore Bypass', time: '11:15 AM' }
    ]
  },
  {
    id: 'bus-intrcity-2',
    operator: 'INTRCITY SMARTBUS',
    busType: 'Volvo Multi-Axle AC Seater (2+2)',
    isElectric: false,
    hasLiveTracking: true,
    hasTripReward: true,
    isPrimo: true,
    hasFreeCancellation: true,
    rating: 4.7,
    totalRatings: 540,
    depTime: '14:30',
    arrTime: '17:00',
    duration: '2h 30m',
    depLocation: 'Guindy Kathipara',
    arrLocation: 'Katpadi Green Circle',
    availableSeats: 28,
    singleSeats: 0,
    fare: 680,
    highlights: ['Volvo Multi-Axle Luxury', 'SmartBus Lounge', 'Free Cancellation', 'AC Seater Comfort'],
    boardingPoints: [
      { name: 'Guindy Kathipara', time: '02:30 PM' },
      { name: 'Porur Toll', time: '02:50 PM' }
    ],
    droppingPoints: [
      { name: 'Katpadi Green Circle', time: '04:45 PM' },
      { name: 'Vellore New Bus Stand', time: '05:00 PM' }
    ]
  },
  {
    id: 'bus-orange-3',
    operator: 'ORANGE TOURS AND TRAVELS',
    busType: 'NONAC Seater (2+2)',
    isElectric: false,
    hasLiveTracking: false,
    hasTripReward: false,
    isPrimo: false,
    hasFreeCancellation: false,
    rating: 4.1,
    totalRatings: 920,
    depTime: '19:15',
    arrTime: '22:00',
    duration: '2h 45m',
    depLocation: 'Ashok Pillar',
    arrLocation: 'Vellore Bypass',
    availableSeats: 40,
    singleSeats: 10,
    fare: 299,
    highlights: ['Budget Travel', 'Non-AC Economy Seater', 'Direct Highway Express', '10 Single Window Seats'],
    boardingPoints: [
      { name: 'Ashok Pillar', time: '07:15 PM' },
      { name: 'Koyambedu CMBT', time: '07:35 PM' }
    ],
    droppingPoints: [
      { name: 'Vellore Bypass', time: '10:00 PM' }
    ]
  },
  {
    id: 'bus-kpn-4',
    operator: 'KPN TRAVELS',
    busType: 'AC Sleeper (2+1)',
    isElectric: false,
    hasLiveTracking: true,
    hasTripReward: true,
    isPrimo: false,
    hasFreeCancellation: true,
    rating: 4.6,
    totalRatings: 1480,
    depTime: '23:30',
    arrTime: '02:00',
    duration: '2h 30m',
    depLocation: 'Chennai Central',
    arrLocation: 'Katpadi Junction',
    availableSeats: 18,
    singleSeats: 4,
    fare: 1150,
    highlights: ['Night AC Sleeper', 'Free Blanket & Pillow', 'Free Cancellation', 'Individual Charging Point'],
    boardingPoints: [
      { name: 'Chennai Central', time: '11:30 PM' },
      { name: 'Koyambedu CMBT', time: '11:55 PM' }
    ],
    droppingPoints: [
      { name: 'Katpadi Junction', time: '02:00 AM' }
    ]
  },
  {
    id: 'bus-srm-5',
    operator: 'SRM TRANSPORTS',
    busType: 'Volvo Multi-Axle AC Sleeper (2+1)',
    isElectric: false,
    hasLiveTracking: true,
    hasTripReward: true,
    isPrimo: true,
    hasFreeCancellation: true,
    rating: 4.9,
    totalRatings: 2100,
    depTime: '01:30',
    arrTime: '04:00',
    duration: '2h 30m',
    depLocation: 'Koyambedu CMBT',
    arrLocation: 'Vellore Bypass',
    availableSeats: 22,
    singleSeats: 5,
    fare: 1250,
    highlights: ['Primo Volvo Multi-Axle', 'Ultra Luxury Sleeper', 'High Speed Onboard WiFi', 'Punctual Dispatch'],
    boardingPoints: [
      { name: 'Koyambedu CMBT', time: '01:30 AM' },
      { name: 'Maduravoyal Toll', time: '01:50 AM' }
    ],
    droppingPoints: [
      { name: 'Vellore Bypass', time: '04:00 AM' }
    ]
  },
  {
    id: 'bus-parveen-6',
    operator: 'PARVEEN TRAVELS',
    busType: 'AC Seater / Semi-Sleeper (2+2)',
    isElectric: false,
    hasLiveTracking: true,
    hasTripReward: false,
    isPrimo: false,
    hasFreeCancellation: false,
    rating: 4.3,
    totalRatings: 780,
    depTime: '11:30',
    arrTime: '14:15',
    duration: '2h 45m',
    depLocation: 'Adyar / Alandur',
    arrLocation: 'Vellore New Bus Stand',
    availableSeats: 30,
    singleSeats: 0,
    fare: 520,
    highlights: ['AC Seater Suspension', 'Air Conditioned Coach', 'Pushback Recliners', 'Highway Express'],
    boardingPoints: [
      { name: 'Adyar', time: '11:30 AM' },
      { name: 'Alandur', time: '11:50 AM' }
    ],
    droppingPoints: [
      { name: 'Vellore New Bus Stand', time: '02:15 PM' }
    ]
  }
];

export interface BusSeat {
  id: string;
  code: string;
  price: number;
  type: 'sleeper' | 'seater';
  deck: 'lower' | 'upper';
  pairId?: string;
  isBooked?: boolean;
  bookedGender?: 'male' | 'female';
}

export const LOWER_DECK_SLEEPERS: BusSeat[] = [
  { id: 'L-SL1', code: 'L-SL1', price: 1049, type: 'sleeper', deck: 'lower' },
  { id: 'L-SL2', code: 'L-SL2', price: 1049, type: 'sleeper', deck: 'lower' },
  { id: 'L-SL3', code: 'L-SL3', price: 1049, type: 'sleeper', deck: 'lower' },
  { id: 'L-SL4', code: 'L-SL4', price: 1049, type: 'sleeper', deck: 'lower' },
  { id: 'L-SL5', code: 'L-SL5', price: 979, type: 'sleeper', deck: 'lower' },
];

export const LOWER_DECK_SEATERS: BusSeat[][] = [
  [
    { id: 'L-S1A', code: 'L-S1A', price: 449, type: 'seater', deck: 'lower', pairId: 'L-R1' },
    { id: 'L-S1B', code: 'L-S1B', price: 449, type: 'seater', deck: 'lower', pairId: 'L-R1' },
  ],
  [
    { id: 'L-S2A', code: 'L-S2A', price: 489, type: 'seater', deck: 'lower', pairId: 'L-R2' },
    { id: 'L-S2B', code: 'L-S2B', price: 539, type: 'seater', deck: 'lower', pairId: 'L-R2' },
  ],
  [
    { id: 'L-S3A', code: 'L-S3A', price: 489, type: 'seater', deck: 'lower', pairId: 'L-R3', isBooked: true, bookedGender: 'male' },
    { id: 'L-S3B', code: 'L-S3B', price: 539, type: 'seater', deck: 'lower', pairId: 'L-R3', isBooked: true, bookedGender: 'female' },
  ],
  [
    { id: 'L-S4A', code: 'L-S4A', price: 469, type: 'seater', deck: 'lower', pairId: 'L-R4' },
    { id: 'L-S4B', code: 'L-S4B', price: 539, type: 'seater', deck: 'lower', pairId: 'L-R4', isBooked: true, bookedGender: 'female' },
  ],
  [
    { id: 'L-S5A', code: 'L-S5A', price: 469, type: 'seater', deck: 'lower', pairId: 'L-R5' },
    { id: 'L-S5B', code: 'L-S5B', price: 539, type: 'seater', deck: 'lower', pairId: 'L-R5' },
  ],
  [
    { id: 'L-S6A', code: 'L-S6A', price: 469, type: 'seater', deck: 'lower', pairId: 'L-R6' },
    { id: 'L-S6B', code: 'L-S6B', price: 539, type: 'seater', deck: 'lower', pairId: 'L-R6' },
  ],
];

export const LOWER_DECK_BACK_ROW: BusSeat[] = [
  { id: 'L-S7A', code: 'L-S7A', price: 399, type: 'seater', deck: 'lower', isBooked: true, bookedGender: 'male' },
  { id: 'L-S7B', code: 'L-S7B', price: 399, type: 'seater', deck: 'lower' },
  { id: 'L-S7C', code: 'L-S7C', price: 399, type: 'seater', deck: 'lower', isBooked: true, bookedGender: 'male' },
];

export const UPPER_DECK_SLEEPERS_LEFT: BusSeat[] = [
  { id: 'U-SL1', code: 'U-SL1', price: 979, type: 'sleeper', deck: 'upper' },
  { id: 'U-SL2', code: 'U-SL2', price: 979, type: 'sleeper', deck: 'upper' },
  { id: 'U-SL3', code: 'U-SL3', price: 979, type: 'sleeper', deck: 'upper' },
  { id: 'U-SL4', code: 'U-SL4', price: 979, type: 'sleeper', deck: 'upper' },
  { id: 'U-SL5', code: 'U-SL5', price: 839, type: 'sleeper', deck: 'upper' },
];

export const UPPER_DECK_SLEEPERS_RIGHT: BusSeat[][] = [
  [
    { id: 'U-D1A', code: 'U-D1A', price: 769, type: 'sleeper', deck: 'upper', pairId: 'U-R1' },
    { id: 'U-D1B', code: 'U-D1B', price: 769, type: 'sleeper', deck: 'upper', pairId: 'U-R1' },
  ],
  [
    { id: 'U-D2A', code: 'U-D2A', price: 839, type: 'sleeper', deck: 'upper', pairId: 'U-R2' },
    { id: 'U-D2B', code: 'U-D2B', price: 839, type: 'sleeper', deck: 'upper', pairId: 'U-R2' },
  ],
  [
    { id: 'U-D3A', code: 'U-D3A', price: 839, type: 'sleeper', deck: 'upper', pairId: 'U-R3' },
    { id: 'U-D3B', code: 'U-D3B', price: 839, type: 'sleeper', deck: 'upper', pairId: 'U-R3' },
  ],
  [
    { id: 'U-D4A', code: 'U-D4A', price: 769, type: 'sleeper', deck: 'upper', pairId: 'U-R4' },
    { id: 'U-D4B', code: 'U-D4B', price: 769, type: 'sleeper', deck: 'upper', pairId: 'U-R4' },
  ],
  [
    { id: 'U-D5A', code: 'U-D5A', price: 669, type: 'sleeper', deck: 'upper', pairId: 'U-R5' },
    { id: 'U-D5B', code: 'U-D5B', price: 669, type: 'sleeper', deck: 'upper', pairId: 'U-R5' },
  ],
];

export const ALL_MODAL_SEATS: BusSeat[] = [
  ...LOWER_DECK_SLEEPERS,
  ...LOWER_DECK_SEATERS.flat(),
  ...LOWER_DECK_BACK_ROW,
  ...UPPER_DECK_SLEEPERS_LEFT,
  ...UPPER_DECK_SLEEPERS_RIGHT.flat(),
];

export interface RouteStop {
  id: string;
  name: string;
  time: string;
  landmark: string;
  isBusCurrent?: boolean;
}

export function getRouteAndPointsForPlaces(sourcePlace: string = 'Chennai', destPlace: string = 'Vijayawada') {
  const cleanSrc = sourcePlace.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim() || 'Chennai';
  const cleanDst = destPlace.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim() || 'Vijayawada';

  const srcLower = cleanSrc.toLowerCase();
  const dstLower = cleanDst.toLowerCase();

  // Helper dictionary of real localities for popular hubs
  const cityStopsMap: Record<string, { boarding: { name: string; landmark: string }[]; dropping: { name: string; landmark: string }[] }> = {
    chennai: {
      boarding: [
        { name: 'Chennai CMBT Koyambedu', landmark: 'Platform 4, Opp Koyambedu Metro' },
        { name: 'Ashok Pillar Metro', landmark: 'Pillar No. 711 Bus Bay' },
        { name: 'Guindy Kathipara Junction', landmark: 'Under Flyover Towards Airport' },
        { name: 'Semmancherry', landmark: 'Infront of Sathyabama University Arch' },
        { name: 'Sriperumbudur Toll Plaza', landmark: 'Highway Rest Stop & Food Court' }
      ],
      dropping: [
        { name: 'Chennai Maduravoyal Bypass', landmark: 'Service Road Flyover' },
        { name: 'Koyambedu CMBT Gate 2', landmark: 'Main Passenger Drop Off Platform' },
        { name: 'Chennai Central MGR Point', landmark: 'Near Railway Station Metro Exit' }
      ]
    },
    vijayawada: {
      boarding: [
        { name: 'Vijayawada PNBS Bus Station', landmark: 'Pandit Nehru Bus Station Platform 12' },
        { name: 'Benz Circle Metro Junction', landmark: 'Near Jyothi Mahal Pillar 14' },
        { name: 'Ramavarappadu Ring', landmark: 'National Highway Flyover Entry' },
        { name: 'Gannavaram Airport Road', landmark: 'Near Gannavaram Bus Bay' }
      ],
      dropping: [
        { name: 'Gollapudi Bypass Junction', landmark: 'NH-65 Toll Service Road' },
        { name: 'Benz Circle Flyover Hub', landmark: 'Opposite Siddhartha College Gate' },
        { name: 'Varadhi Bridge Point', landmark: 'Krishna River Bridge Entry' },
        { name: 'Vijayawada PNBS Central Terminal', landmark: 'Arrival Platform 1 (Bus Ending Point)' }
      ]
    },
    bengaluru: {
      boarding: [
        { name: 'Bengaluru Majestic Bus Stand', landmark: 'Platform 18A, Opp City Railway Station' },
        { name: 'Shantinagar TTMC Bus Station', landmark: 'KSRTC Intercity Bay 3' },
        { name: 'Madiwala St. Johns Hospital', landmark: 'Total Mall Bus Stop Service Road' },
        { name: 'Silk Board Junction', landmark: 'Outer Ring Road Flyover Bay' },
        { name: 'Electronic City Toll Plaza', landmark: 'Elevated Toll Exit Gate 1' }
      ],
      dropping: [
        { name: 'Electronic City Toll Plaza', landmark: 'Highway Exit Bay' },
        { name: 'Silk Board Junction', landmark: 'Near Silk Board Metro Station' },
        { name: 'Madiwala Central Drop', landmark: 'Near Police Station Bus Bay' },
        { name: 'Bengaluru Majestic Terminus', landmark: 'Central Kempegowda Terminal (Bus Ending Point)' }
      ]
    },
    hyderabad: {
      boarding: [
        { name: 'Hyderabad MGBS Imlibun', landmark: 'Mahatma Gandhi Bus Station Platform 32' },
        { name: 'Ameerpet Metro Hub', landmark: 'Under Pillar 1045 Bus Stop' },
        { name: 'Kukatpally Y-Junction', landmark: 'Beside Remedy Hospital Bus Stop' },
        { name: 'Miyapur Allwyn X Roads', landmark: 'Miyapur Metro Station Entry' },
        { name: 'LB Nagar Ring Road', landmark: 'Vijayawada Highway Toll Bay' }
      ],
      dropping: [
        { name: 'LB Nagar Ring Road Drop', landmark: 'Sagar Ring Road Flyover' },
        { name: 'Dilsukhnagar Bus Bay', landmark: 'Metro Station Pillar 1520' },
        { name: 'Hyderabad MGBS Central Terminal', landmark: 'Platform 4 Arrival Bay (Bus Ending Point)' }
      ]
    },
    katpadi: {
      boarding: [
        { name: 'Katpadi Railway Station Circle', landmark: 'Opp Chittoor Bus Stop' },
        { name: 'VIT Green Circle Hub', landmark: 'Near VIT University Main Gate' }
      ],
      dropping: [
        { name: 'Kanchipuram Bypass', landmark: 'Bypass Flyover, Opp Highway Motel' },
        { name: 'Walajapet Toll Plaza', landmark: 'Highway Service Road Toll Plaza' },
        { name: 'Katpadi Green Circle', landmark: 'Near Railway Station Circle' },
        { name: 'Vellore Bypass', landmark: 'Opp to Raja Motors towards Bangalore (Bus Ending Point)' }
      ]
    },
    coimbatore: {
      boarding: [
        { name: 'Gandhipuram Central Bus Stand', landmark: 'SETC Bus Terminal Platform 2' },
        { name: 'Omni Bus Stand Sathy Road', landmark: 'Near GP Signal Hub' },
        { name: 'KMCH Avinashi Road', landmark: 'Near Airport Bypass Junction' },
        { name: 'Hopes College Flyover', landmark: 'Opp Bus Shelter' }
      ],
      dropping: [
        { name: 'Avinashi Road Highway Toll', landmark: 'Expressway Flyover' },
        { name: 'Lakshmi Mills Junction', landmark: 'Near Signal Bus Stop' },
        { name: 'Gandhipuram Omni Bus Stand', landmark: 'Main Arrival Bay (Bus Ending Point)' }
      ]
    },
    madurai: {
      boarding: [
        { name: 'Mattuthavani Integrated Bus Stand', landmark: 'MGR Bus Stand Platform 1' },
        { name: 'Periyar Bus Stand Hub', landmark: 'Near Central Railway Station' },
        { name: 'Fringe Thirunagar Stop', landmark: 'National Highway Road' }
      ],
      dropping: [
        { name: 'Fringe Thirunagar Toll', landmark: 'Madurai Outer Ring Road' },
        { name: 'Arapalayam Bus Stand', landmark: 'City Bypass Road' },
        { name: 'Mattuthavani Central Terminal', landmark: 'MGR Bus Stand (Bus Ending Point)' }
      ]
    },
    tirupati: {
      boarding: [
        { name: 'Tirupati Central Bus Stand', landmark: 'RTC Bus Stand Platform 6' },
        { name: 'Alipiri Gate Circle', landmark: 'Foot of Tirumala Hills' }
      ],
      dropping: [
        { name: 'Renigunta Road Toll', landmark: 'Airport Highway Road' },
        { name: 'Tirupati RTC Central Terminal', landmark: 'Main Station Platform (Bus Ending Point)' }
      ]
    },
    visakhapatnam: {
      boarding: [
        { name: 'Visakhapatnam Dwaraka Bus Station', landmark: 'RTC Complex Platform 8' },
        { name: 'Gajuwaka Junction Hub', landmark: 'Near Steel Plant Road' },
        { name: 'Madhurawada Toll Gate', landmark: 'National Highway 16' }
      ],
      dropping: [
        { name: 'NAD Junction Flyover', landmark: 'Airport Road Hub' },
        { name: 'Visakhapatnam RTC Complex', landmark: 'Dwaraka Bus Station (Bus Ending Point)' }
      ]
    },
    nellore: {
      boarding: [
        { name: 'Nellore RTC Bus Station Platform 4', landmark: 'Main APSRTC Depot' },
        { name: 'Mini Bypass Road Junction', landmark: 'Near VRC Ground Gate' },
        { name: 'Nellore Toll Plaza Highway', landmark: 'NH-16 Highway Flyover' }
      ],
      dropping: [
        { name: 'Nellore Mini Bypass Road', landmark: 'Opposite Highway Food Plaza' },
        { name: 'Nellore RTC Central Terminal', landmark: 'Arrival Platform 2 (Bus Ending Point)' }
      ]
    },
    goa: {
      boarding: [
        { name: 'Panjim KTC Bus Stand Platform 3', landmark: 'Kadamba Transport Corporation' },
        { name: 'Mapusa KTC Bus Stand', landmark: 'North Goa Highway Terminal' },
        { name: 'Madgaon KTC Bus Station', landmark: 'South Goa Central Depot' }
      ],
      dropping: [
        { name: 'Mapusa Bypass Junction', landmark: 'Highway Service Road' },
        { name: 'Panjim Central KTC Stand', landmark: 'Arrival Bay (Bus Ending Point)' },
        { name: 'Madgaon KTC Terminal', landmark: 'Railway Station Road (Bus Ending Point)' }
      ]
    },
    mumbai: {
      boarding: [
        { name: 'Borivali West Gokul Hotel', landmark: 'Near Western Express Highway' },
        { name: 'Andheri East Bisleri Compound', landmark: 'Opposite Metro Station' },
        { name: 'Sion Circle Chunabhatti', landmark: 'Eastern Express Highway Bridge' },
        { name: 'Vashi Plaza Highway Bay', landmark: 'Near Vashi Railway Station' }
      ],
      dropping: [
        { name: 'Vashi Highway Toll Point', landmark: 'Navi Mumbai Entry' },
        { name: 'Maitri Park Chembur', landmark: 'Eastern Freeway Exit' },
        { name: 'Dadar TT Circle Terminal', landmark: 'Pritam Hotel (Bus Ending Point)' }
      ]
    },
    pune: {
      boarding: [
        { name: 'Swargate Bus Stand Platform 1', landmark: 'MSRTC Intercity Terminal' },
        { name: 'Shivajinagar Station Gate', landmark: 'Near CoEP Hostel Gate' },
        { name: 'Wakad Hinjewadi Bridge', landmark: 'Bangalore-Mumbai Highway Bay' },
        { name: 'Katraj Bypass Tunnel Hub', landmark: 'Opposite Wonder City' }
      ],
      dropping: [
        { name: 'Hinjewadi Flyover Bridge', landmark: 'IT Park Expressway Exit' },
        { name: 'Shivajinagar Drop Point', landmark: 'Near Metro Station' },
        { name: 'Swargate Central Bus Terminal', landmark: 'Main Station (Bus Ending Point)' }
      ]
    }
  };

  // Find matching city keys
  const getCityKey = (name: string) => {
    const l = name.toLowerCase();
    for (const k of Object.keys(cityStopsMap)) {
      if (l.includes(k)) return k;
    }
    return null;
  };

  const srcKey = getCityKey(cleanSrc);
  const dstKey = getCityKey(cleanDst);

  // Boarding points at origin
  const rawBoarding = srcKey
    ? cityStopsMap[srcKey].boarding
    : [
      { name: `${cleanSrc} Central CMBT`, landmark: `Main Bus Terminus, Platform 1, ${cleanSrc}` },
      { name: `${cleanSrc} Metro Junction`, landmark: `Under Metro Station, ${cleanSrc}` },
      { name: `${cleanSrc} City Hub`, landmark: `Flyover Towards Highway, ${cleanSrc}` },
      { name: `${cleanSrc} Outer Ring Road`, landmark: `Highway Express Service Road, ${cleanSrc}` },
      { name: `${cleanSrc} Highway Toll Plaza`, landmark: 'Expressway Food Court & Rest Stop' }
    ];

  const boardingPoints = rawBoarding.map((b, idx) => ({
    id: `bp-${idx + 1}`,
    time: `${17 + Math.floor(idx * 0.45)}:${String((idx * 25) % 60).padStart(2, '0')}`,
    date: '14 Oct',
    name: b.name,
    landmark: b.landmark
  }));

  // Dropping points at destination
  const rawDropping = dstKey
    ? cityStopsMap[dstKey].dropping
    : [
      { name: `${cleanDst} Highway Toll Entry`, landmark: 'Expressway Flyover' },
      { name: `${cleanDst} Bypass Junction`, landmark: `Highway Service Road, ${cleanDst}` },
      { name: `${cleanDst} Green Circle`, landmark: `Station Circle Hub, ${cleanDst}` },
      { name: `${cleanDst} Main Central Stand`, landmark: `Terminus Platform, ${cleanDst} (Bus Ending Point)` }
    ];

  const droppingPoints = rawDropping.map((d, idx) => ({
    id: `dp-${idx + 1}`,
    time: `${20 + Math.floor(idx * 0.8)}:${String((idx * 30 + 15) % 60).padStart(2, '0')}`,
    date: '14 Oct',
    name: d.name,
    landmark: d.landmark
  }));

  // Build complete route from source to destination
  const fullRoute: RouteStop[] = [
    ...boardingPoints.map((b, i) => ({
      id: `stop-b-${i + 1}`,
      name: b.name,
      time: b.time,
      landmark: i === 0 ? `${b.landmark} (Origin)` : b.landmark,
      isBusCurrent: i === 2
    })),
    // Intermediate waypoint highway stop
    {
      id: 'stop-mid-1',
      name: `${cleanSrc} - ${cleanDst} Expressway Hub`,
      time: '19:55',
      landmark: 'Midway Highway Food Plaza & Fuel Station',
      isBusCurrent: false
    },
    ...droppingPoints.map((d, i) => ({
      id: `stop-d-${i + 1}`,
      name: d.name,
      time: d.time,
      landmark: d.landmark,
      isBusCurrent: false
    }))
  ];

  return { cleanSrc, cleanDst, boardingPoints, droppingPoints, fullRoute };
}

export const BUS_FULL_ROUTE = getRouteAndPointsForPlaces().fullRoute;
export const BOARDING_POINTS_DATA = getRouteAndPointsForPlaces().boardingPoints;
export const DROPPING_POINTS_DATA = getRouteAndPointsForPlaces().droppingPoints;

export const CANCELLATION_POLICY_ROWS = [
  {
    time: 'Before 13th Oct 06:45 PM',
    withoutFree: '85% Refund',
    withFree: '100% Refund'
  },
  {
    time: 'From 13th Oct 06:45 PM Until 14th Oct 06:45 AM',
    withoutFree: '80% Refund',
    withFree: '100% Refund'
  },
  {
    time: 'From 14th Oct 06:45 AM Until 14th Oct 12:45 PM',
    withoutFree: '50% Refund',
    withFree: '100% Refund'
  },
  {
    time: 'From 14th Oct 12:45 PM Until 14th Oct 06:45 PM',
    withoutFree: '0% refund',
    withFree: '0% refund'
  }
];

export const CANCELLATION_POLICY_DATA = [
  { time: 'Before 13th Oct 06:45 PM', refund: '85% Refund' },
  { time: 'From 13th Oct 06:45 PM Until 14th Oct 06:45 AM', refund: '80% Refund' },
  { time: 'From 14th Oct 06:45 AM Until 14th Oct 12:45 PM', refund: '50% Refund' },
  { time: 'From 14th Oct 12:45 PM Until 14th Oct 06:45 PM', refund: '0% refund' }
];

export const BUS_GALLERY_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    title: 'Electric Bus Front View',
    tag: 'FreshBus Electric'
  },
  {
    url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
    title: 'Comfort Sleeper & Recliner Deck',
    tag: 'Clean Interior'
  },
  {
    url: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=800&auto=format&fit=crop&q=80',
    title: 'Aerodynamic Luxury Coach Side Profile',
    tag: 'Express Coach'
  }
];

export function generateBusesForRoute(sourcePlace: string = 'Chennai', destPlace: string = 'Vijayawada'): BusItem[] {
  const cleanSrc = sourcePlace.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim() || 'Chennai';
  const cleanDst = destPlace.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim() || 'Vijayawada';
  const srcKey = cleanSrc.toLowerCase();
  const dstKey = cleanDst.toLowerCase();
  const routeKey = `${srcKey}-${dstKey}`;

  // Known routes table
  const ROUTE_INFO: Record<string, { duration: string; baseFare: number }> = {
    'hyderabad-chennai': { duration: '11h 30m', baseFare: 999 },
    'chennai-hyderabad': { duration: '11h 15m', baseFare: 999 },
    'hyderabad-bengaluru': { duration: '9h 30m', baseFare: 899 },
    'bengaluru-hyderabad': { duration: '9h 45m', baseFare: 899 },
    'hyderabad-vijayawada': { duration: '5h 30m', baseFare: 550 },
    'vijayawada-hyderabad': { duration: '5h 45m', baseFare: 550 },
    'chennai-bengaluru': { duration: '5h 45m', baseFare: 599 },
    'bengaluru-chennai': { duration: '5h 30m', baseFare: 599 },
    'chennai-vijayawada': { duration: '7h 30m', baseFare: 750 },
    'vijayawada-chennai': { duration: '7h 45m', baseFare: 750 },
    'chennai-nellore': { duration: '3h 15m', baseFare: 350 },
    'nellore-chennai': { duration: '3h 15m', baseFare: 350 },
    'hyderabad-goa': { duration: '13h 00m', baseFare: 1250 },
    'goa-hyderabad': { duration: '13h 15m', baseFare: 1250 },
    'bengaluru-goa': { duration: '11h 30m', baseFare: 1100 },
    'goa-bengaluru': { duration: '11h 45m', baseFare: 1100 },
    'mumbai-goa': { duration: '11h 45m', baseFare: 1050 },
    'goa-mumbai': { duration: '12h 00m', baseFare: 1050 },
    'mumbai-pune': { duration: '3h 30m', baseFare: 320 },
    'pune-mumbai': { duration: '3h 30m', baseFare: 320 },
    'pune-goa': { duration: '9h 15m', baseFare: 850 },
    'goa-pune': { duration: '9h 30m', baseFare: 850 },
    'chennai-coimbatore': { duration: '8h 30m', baseFare: 780 },
    'coimbatore-chennai': { duration: '8h 15m', baseFare: 780 },
    'chennai-madurai': { duration: '7h 45m', baseFare: 720 },
    'madurai-chennai': { duration: '7h 30m', baseFare: 720 },
    'vijayawada-nellore': { duration: '4h 45m', baseFare: 480 },
    'nellore-vijayawada': { duration: '4h 30m', baseFare: 480 },
    'chennai-vellore': { duration: '2h 30m', baseFare: 449 }
  };

  const routeConfig = ROUTE_INFO[routeKey] || { duration: '6h 30m', baseFare: 650 };
  const durStr = routeConfig.duration;
  const baseFare = routeConfig.baseFare;

  // Boarding and dropping locations for source and destination
  const bpList = [
    { name: `${cleanSrc} Central Bus Stand`, time: '08:45 AM' },
    { name: `${cleanSrc} Highway Bypass Point`, time: '09:15 AM' }
  ];
  const dpList = [
    { name: `${cleanDst} Bypass Junction`, time: '05:30 PM' },
    { name: `${cleanDst} Central Terminal`, time: '06:00 PM' }
  ];

  return [
    {
      id: `bus-kaveri-${srcKey}-${dstKey}`,
      operator: 'V Kaveri Travels',
      busType: 'VOLVO 9600 AC Multiaxle Sleeper (2 + 1)',
      isElectric: false,
      hasLiveTracking: true,
      hasTripReward: true,
      isPrimo: true,
      hasFreeCancellation: true,
      rating: 3.9,
      totalRatings: 540,
      depTime: '22:00',
      arrTime: '09:30',
      duration: durStr,
      depLocation: `${cleanSrc} Central Hub`,
      arrLocation: `${cleanDst} Terminal`,
      availableSeats: 16, // > 15 -> Normal Green (Image 2)
      singleSeats: 3,
      fare: Math.round(baseFare * 1.39),
      highlights: ['Abhi Assured', '1 Month Old Bus', 'Bus Safety Check', 'Live GPS Tracking', '3 Single Berths (LB-2, UB-1)'],
      boardingPoints: bpList,
      droppingPoints: dpList
    },
    {
      id: `bus-intrcity-${srcKey}-${dstKey}`,
      operator: 'IntrCity SmartBus',
      busType: 'AC Sleeper (2 + 1)',
      isElectric: false,
      hasLiveTracking: true,
      hasTripReward: true,
      isPrimo: true,
      hasFreeCancellation: true,
      rating: 4.0,
      totalRatings: 694,
      depTime: '18:10',
      arrTime: '04:45',
      duration: durStr,
      depLocation: `${cleanSrc} Bus Bay`,
      arrLocation: `${cleanDst} Drop Point`,
      availableSeats: 13, // <= 15 -> LOW SEATS ORANGE (Image 3)
      singleSeats: 5,
      fare: Math.round(baseFare),
      highlights: ['Abhi Assured', 'Most Trusted', 'Toilet', 'Helpful Staff', 'Clean & Hygienic', '5 Single Berths (LB-1, UB-4)'],
      boardingPoints: bpList,
      droppingPoints: dpList
    },
    {
      id: `bus-srm-${srcKey}-${dstKey}`,
      operator: 'SRM TRANSPORTS',
      busType: 'Volvo Multi-Axle AC Sleeper (2+1)',
      isElectric: false,
      hasLiveTracking: true,
      hasTripReward: true,
      isPrimo: true,
      hasFreeCancellation: true,
      rating: 4.9,
      totalRatings: 2100,
      depTime: '01:30',
      arrTime: '04:00',
      duration: durStr,
      depLocation: `${cleanSrc} CMBT / Highway`,
      arrLocation: `${cleanDst} Bypass`,
      availableSeats: 22, // > 15 -> Normal Green (Image 1)
      singleSeats: 5,
      fare: Math.round(baseFare * 1.25),
      highlights: ['Primo Certified', 'Ultra Luxury Sleeper', 'High Speed WiFi', 'Free Cancellation'],
      boardingPoints: bpList,
      droppingPoints: dpList
    },
    {
      id: `bus-orange-${srcKey}-${dstKey}`,
      operator: 'ORANGE TOURS AND TRAVELS',
      busType: 'Scania Multi-Axle AC Sleeper (2+1)',
      isElectric: false,
      hasLiveTracking: true,
      hasTripReward: true,
      isPrimo: false,
      hasFreeCancellation: true,
      rating: 4.6,
      totalRatings: 1840,
      depTime: '20:45',
      arrTime: '07:15',
      duration: durStr,
      depLocation: `${cleanSrc} Ring Road`,
      arrLocation: `${cleanDst} Green Circle`,
      availableSeats: 8, // <= 15 -> LOW SEATS ORANGE!
      singleSeats: 2,
      fare: Math.round(baseFare * 1.15),
      highlights: ['Direct Highway Express', 'High Speed WiFi', 'Charging Sockets', 'Water Bottle Provided'],
      boardingPoints: bpList,
      droppingPoints: dpList
    },
    {
      id: `bus-freshbus-${srcKey}-${dstKey}`,
      operator: 'FRESHBUS',
      busType: 'Electric A/C Seater/Sleeper (2+1)',
      isElectric: true,
      hasLiveTracking: true,
      hasTripReward: true,
      isPrimo: true,
      hasFreeCancellation: true,
      rating: 4.8,
      totalRatings: 920,
      depTime: '08:45',
      arrTime: '19:15',
      duration: durStr,
      depLocation: `${cleanSrc} EV Terminal`,
      arrLocation: `${cleanDst} Hub`,
      availableSeats: 32, // > 15 -> Normal Green
      singleSeats: 8,
      fare: Math.round(baseFare * 0.9),
      highlights: ['100% Electric EV Bus', 'Primo Certified', 'Free Cancellation', 'Zero Carbon Emission'],
      boardingPoints: bpList,
      droppingPoints: dpList
    },
    {
      id: `bus-morningstar-${srcKey}-${dstKey}`,
      operator: 'Morning Star Travels',
      busType: 'Bharat Benz AC Sleeper (2+1)',
      isElectric: false,
      hasLiveTracking: true,
      hasTripReward: false,
      isPrimo: false,
      hasFreeCancellation: true,
      rating: 4.5,
      totalRatings: 1220,
      depTime: '21:15',
      arrTime: '08:00',
      duration: durStr,
      depLocation: `${cleanSrc} Bypass Toll`,
      arrLocation: `${cleanDst} Junction`,
      availableSeats: 11, // <= 15 -> LOW SEATS ORANGE!
      singleSeats: 3,
      fare: Math.round(baseFare * 1.1),
      highlights: ['Deep Cleaned', 'Experienced Crew', 'Emergency Exits', 'Punctual Service'],
      boardingPoints: bpList,
      droppingPoints: dpList
    },
    {
      id: `bus-jabbar-${srcKey}-${dstKey}`,
      operator: 'Jabbar Travels',
      busType: 'Volvo AC Semi-Sleeper (2+2)',
      isElectric: false,
      hasLiveTracking: false,
      hasTripReward: false,
      isPrimo: false,
      hasFreeCancellation: false,
      rating: 4.3,
      totalRatings: 860,
      depTime: '15:30',
      arrTime: '02:00',
      duration: durStr,
      depLocation: `${cleanSrc} Station Gate`,
      arrLocation: `${cleanDst} City Entrance`,
      availableSeats: 28, // > 15 -> Normal Green
      singleSeats: 0,
      fare: Math.round(baseFare * 0.85),
      highlights: ['AC Semi-Sleeper Recliner', 'Reading Lights', 'Luggage Compartment Assist'],
      boardingPoints: bpList,
      droppingPoints: dpList
    },
    {
      id: `bus-kpn-${srcKey}-${dstKey}`,
      operator: 'KPN TRAVELS',
      busType: 'AC Sleeper (2+1)',
      isElectric: false,
      hasLiveTracking: true,
      hasTripReward: true,
      isPrimo: false,
      hasFreeCancellation: true,
      rating: 4.6,
      totalRatings: 1480,
      depTime: '23:30',
      arrTime: '10:00',
      duration: durStr,
      depLocation: `${cleanSrc} Main Road`,
      arrLocation: `${cleanDst} Stand`,
      availableSeats: 14, // <= 15 -> LOW SEATS ORANGE!
      singleSeats: 4,
      fare: Math.round(baseFare * 1.18),
      highlights: ['Night AC Sleeper', 'Free Blanket & Pillow', 'Free Cancellation', 'Individual Charging'],
      boardingPoints: bpList,
      droppingPoints: dpList
    },
    {
      id: `bus-apsrtc-${srcKey}-${dstKey}`,
      operator: 'APSRTC Garuda Plus (RTC)',
      busType: 'Multi-Axle AC Sleeper / Semi-Sleeper',
      isElectric: false,
      hasLiveTracking: true,
      hasTripReward: false,
      isPrimo: true,
      hasFreeCancellation: false,
      isRTC: true,
      rating: 4.7,
      totalRatings: 3400,
      depTime: '19:30',
      arrTime: '06:15',
      duration: durStr,
      depLocation: `${cleanSrc} RTC Bus Station`,
      arrLocation: `${cleanDst} RTC Complex`,
      availableSeats: 6, // <= 15 -> LOW SEATS ORANGE!
      singleSeats: 2,
      fare: Math.round(baseFare * 0.95),
      highlights: ['Government Certified State Transport', 'Professional Drivers', 'No Surge Pricing'],
      boardingPoints: bpList,
      droppingPoints: dpList
    },
    {
      id: `bus-tgsrtc-${srcKey}-${dstKey}`,
      operator: 'TGSRTC Lahari Express (RTC)',
      busType: 'AC Sleeper / Seater Non-Stop',
      isElectric: false,
      hasLiveTracking: true,
      hasTripReward: false,
      isPrimo: true,
      hasFreeCancellation: true,
      isRTC: true,
      rating: 4.8,
      totalRatings: 2890,
      depTime: '20:15',
      arrTime: '06:45',
      duration: durStr,
      depLocation: `${cleanSrc} MGBS Bay 8`,
      arrLocation: `${cleanDst} Central Stand`,
      availableSeats: 12, // <= 15 -> LOW SEATS ORANGE!
      singleSeats: 4,
      fare: Math.round(baseFare * 0.98),
      highlights: ['Telangana State Govt RTC', 'On-Time Guaranteed', 'Live GPS Tracking'],
      boardingPoints: bpList,
      droppingPoints: dpList
    },
    {
      id: `bus-keralartc-${srcKey}-${dstKey}`,
      operator: 'Kerala RTC Swift Deluxe (RTC)',
      busType: 'Air-Conditioned Scania / Semi-Sleeper',
      isElectric: false,
      hasLiveTracking: true,
      hasTripReward: false,
      isPrimo: true,
      hasFreeCancellation: true,
      isRTC: true,
      rating: 4.6,
      totalRatings: 1980,
      depTime: '21:00',
      arrTime: '07:30',
      duration: durStr,
      depLocation: `${cleanSrc} KSRTC Terminal`,
      arrLocation: `${cleanDst} KSRTC Depot`,
      availableSeats: 22,
      singleSeats: 6,
      fare: Math.round(baseFare * 0.92),
      highlights: ['Kerala RTC Swift', 'Official Govt Transport', 'Water Bottle Provided'],
      boardingPoints: bpList,
      droppingPoints: dpList
    },
    {
      id: `bus-gsrtc-${srcKey}-${dstKey}`,
      operator: 'GSRTC Gurjarnagri Express (RTC)',
      busType: 'Volvo AC Sleeper / Semi-Sleeper',
      isElectric: false,
      hasLiveTracking: true,
      hasTripReward: false,
      isPrimo: false,
      hasFreeCancellation: false,
      isRTC: true,
      rating: 4.5,
      totalRatings: 1650,
      depTime: '18:45',
      arrTime: '05:30',
      duration: durStr,
      depLocation: `${cleanSrc} GSRTC Central Bus Port`,
      arrLocation: `${cleanDst} Bus Depot`,
      availableSeats: 8,
      singleSeats: 2,
      fare: Math.round(baseFare * 0.88),
      highlights: ['Gujarat State Road Transport', 'Affordable Govt Fares', 'Luggage Assistance'],
      boardingPoints: bpList,
      droppingPoints: dpList
    },
    {
      id: `bus-ksrtc-${srcKey}-${dstKey}`,
      operator: 'KSRTC Airavat Club Class (RTC)',
      busType: 'Volvo Multi-Axle AC Semi-Sleeper',
      isElectric: false,
      hasLiveTracking: true,
      hasTripReward: true,
      isPrimo: true,
      hasFreeCancellation: true,
      isRTC: true,
      rating: 4.9,
      totalRatings: 4210,
      depTime: '22:15',
      arrTime: '06:00',
      duration: durStr,
      depLocation: `${cleanSrc} Majestic KSRTC Bay`,
      arrLocation: `${cleanDst} Satellite Stand`,
      availableSeats: 19,
      singleSeats: 5,
      fare: Math.round(baseFare * 1.05),
      highlights: ['Karnataka RTC Flagship', 'Airavat Club Class Luxury', 'Water & Blankets'],
      boardingPoints: bpList,
      droppingPoints: dpList
    },
    {
      id: `bus-srs-${srcKey}-${dstKey}`,
      operator: 'SRS Travels',
      busType: 'NONAC Sleeper (2+1)',
      isElectric: false,
      hasLiveTracking: false,
      hasTripReward: false,
      isPrimo: false,
      hasFreeCancellation: false,
      rating: 4.2,
      totalRatings: 650,
      depTime: '17:00',
      arrTime: '03:30',
      duration: durStr,
      depLocation: `${cleanSrc} Outer Ring`,
      arrLocation: `${cleanDst} Ring Road`,
      availableSeats: 25, // > 15 -> Normal Green
      singleSeats: 5,
      fare: Math.max(350, Math.round(baseFare * 0.7)),
      highlights: ['Budget Sleeper', 'Economical Travel', 'Wide Clean Berths', 'Highway Non-Stop'],
      boardingPoints: bpList,
      droppingPoints: dpList
    }
  ];
}

export default function BusBookingView({
  source = 'Chennai (CMBT / Koyambedu)',
  destination = 'Vellore (Katpadi)',
  dateOfJourney,
  onDateChange
}: {
  source?: string;
  destination?: string;
  dateOfJourney?: string;
  onDateChange?: (date: string) => void;
}) {
  const router = useRouter();
  const { setActiveTab } = useSartStore();
  const effectiveDateOfJourney = useMemo(() => {
    if (dateOfJourney) return dateOfJourney;
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]}, ${now.getFullYear()}`;
  }, [dateOfJourney]);
  const [buses, setBuses] = useState<BusItem[]>(() => generateBusesForRoute(source, destination));

  // Dynamically update buses when source or destination changes
  useEffect(() => {
    setBuses(generateBusesForRoute(source, destination));
  }, [source, destination]);
  const [filterSearch, setFilterSearch] = useState('');
  const [aiFilterText, setAiFilterText] = useState('');
  const [sortBy, setSortBy] = useState<'Ratings' | 'Duration' | 'Departure' | 'Price'>('Ratings');

  // Quick filter chip toggles
  const [filterPrimo, setFilterPrimo] = useState(false);
  const [filterFreeCancel, setFilterFreeCancel] = useState(false);
  const [filterAC, setFilterAC] = useState(false);
  const [filterSleeper, setFilterSleeper] = useState(false);
  const [filterSingleSeats, setFilterSingleSeats] = useState(false);
  const [filterSeater, setFilterSeater] = useState(false);
  const [filterNonAC, setFilterNonAC] = useState(false);
  const [filterDepEve, setFilterDepEve] = useState(false); // 18:00-24:00
  const [filterDepMorn, setFilterDepMorn] = useState(false); // 06:00-12:00
  const [filterHighRated, setFilterHighRated] = useState(false);
  const [filterLiveTrack, setFilterLiveTrack] = useState(false);
  const [filterVolvo, setFilterVolvo] = useState(false);
  const [selectedGovtRtc, setSelectedGovtRtc] = useState<string | null>(null);

  // Accordion open/close states
  const [accordionsOpen, setAccordionsOpen] = useState<Record<string, boolean>>({
    depTime: true,
    arrTime: false,
    busType: true,
    singleSeats: false,
    busFeatures: false,
    operator: false,
    boarding: false,
    dropping: false,
    amenities: false,
    specialFeatures: false,
    rtcType: false
  });

  const toggleAccordion = (key: string) => {
    setAccordionsOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Checkbox selections inside accordions
  const [selectedDepTimes, setSelectedDepTimes] = useState<string[]>([]);
  const [selectedArrTimes, setSelectedArrTimes] = useState<string[]>([]);
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [selectedBoarding, setSelectedBoarding] = useState<string[]>([]);
  const [selectedDropping, setSelectedDropping] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedSpecial, setSelectedSpecial] = useState<string[]>([]);
  const [selectedRtc, setSelectedRtc] = useState<string[]>([]);

  // Search queries within accordions
  const [searchOperator, setSearchOperator] = useState('');
  const [searchBoarding, setSearchBoarding] = useState('');
  const [searchDropping, setSearchDropping] = useState('');
  const [searchAmenities, setSearchAmenities] = useState('');

  const toggleSelection = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Active expanded card tab
  const [activeCardTab, setActiveCardTab] = useState<{ busId: string; tab: string } | null>(null);

  const activeRouteData = useMemo(() => {
    return getRouteAndPointsForPlaces(source, destination);
  }, [source, destination]);

  const activeBoardingPoints = activeRouteData.boardingPoints;
  const activeDroppingPoints = activeRouteData.droppingPoints;
  const activeFullRoute = activeRouteData.fullRoute;

  // Seat Selection Modal State (Matching Image 3 & Image 4 Reference)
  const [selectedBus, setSelectedBus] = useState<BusItem | null>(null);
  const [modalTopTab, setModalTopTab] = useState<'select_seats' | 'boarding_dropping' | 'passenger_info' | 'live_tracking'>('select_seats');
  const [modalSubTab, setModalSubTab] = useState<string>('Highlights');
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['L-S1A']);
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState<string>(() => activeBoardingPoints[Math.min(3, activeBoardingPoints.length - 1)]?.name || 'Semmancherry');
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState<string>(() => activeDroppingPoints[activeDroppingPoints.length - 1]?.name || 'Vellore Bypass');
  const [showAllBoardingPoints, setShowAllBoardingPoints] = useState(false);
  const [showAllDroppingPoints, setShowAllDroppingPoints] = useState(false);

  // Sync boarding and dropping points when source or destination changes
  useEffect(() => {
    if (activeBoardingPoints.length > 0) {
      setSelectedBoardingPoint(activeBoardingPoints[Math.min(3, activeBoardingPoints.length - 1)].name);
    }
    if (activeDroppingPoints.length > 0) {
      setSelectedDroppingPoint(activeDroppingPoints[activeDroppingPoints.length - 1].name);
    }
  }, [source, destination]);
  const [passengers, setPassengers] = useState<Record<string, { name: string; age: string; gender: 'Male' | 'Female' }>>({
    'L-S1A': { name: '', age: '', gender: 'Male' }
  });
  const [registeredPhone, setRegisteredPhone] = useState('+91 98765 43210');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState('+91 98765 43210');
  const [stateOfResidence, setStateOfResidence] = useState('Tamil Nadu');
  const [whatsAppOptIn, setWhatsAppOptIn] = useState(true);
  const [tripRewardOptIn, setTripRewardOptIn] = useState(true);
  const [isGpsEnabled, setIsGpsEnabled] = useState(false);
  const [boardingSubTab, setBoardingSubTab] = useState<'boarding_dropping' | 'cancellation' | 'amenities' | 'travel_policy'>('boarding_dropping');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedPnr, setConfirmedPnr] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('14 Wed');

  // Synchronize selected calendar day if dateOfJourney changes
  useEffect(() => {
    if (dateOfJourney) {
      const parts = dateOfJourney.trim().split(' ');
      const dayNum = parts[0]?.replace(/^0+/, '');
      const match = CALENDAR_DATES.find(c => c.day === dayNum || String(parseInt(c.day)) === dayNum);
      if (match) {
        setSelectedCalendarDate(`${match.day} ${match.weekday}`);
      }
    }
  }, [dateOfJourney]);

  const clearAllFilters = () => {
    setFilterPrimo(false);
    setFilterFreeCancel(false);
    setFilterAC(false);
    setFilterSleeper(false);
    setFilterSingleSeats(false);
    setFilterSeater(false);
    setFilterNonAC(false);
    setFilterDepEve(false);
    setFilterDepMorn(false);
    setFilterHighRated(false);
    setFilterLiveTrack(false);
    setFilterVolvo(false);
    setSelectedDepTimes([]);
    setSelectedArrTimes([]);
    setSelectedBusTypes([]);
    setSelectedFeatures([]);
    setSelectedOperators([]);
    setSelectedBoarding([]);
    setSelectedDropping([]);
    setAiFilterText('');
    setFilterSearch('');
    setSelectedGovtRtc(null);
  };

  const toggleCardTab = (busId: string, tab: string) => {
    if (activeCardTab?.busId === busId && activeCardTab?.tab === tab) {
      setActiveCardTab(null);
    } else {
      setActiveCardTab({ busId, tab });
    }
  };

  // Filter logic covering all filters
  let displayedBuses = buses.filter(b => {
    const depH = parseInt(b.depTime.split(':')[0], 10);
    const arrH = parseInt(b.arrTime.split(':')[0], 10);

    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      const match =
        b.operator.toLowerCase().includes(q) ||
        b.depLocation.toLowerCase().includes(q) ||
        b.arrLocation.toLowerCase().includes(q) ||
        b.busType.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (aiFilterText) {
      const q = aiFilterText.toLowerCase();
      if (q.includes('morning') && (depH < 6 || depH >= 12)) return false;
      if (q.includes('afternoon') && (depH < 12 || depH >= 18)) return false;
      if (q.includes('evening') && (depH < 18 || depH >= 24)) return false;
      if (q.includes('night') && (depH >= 6 && depH < 24)) return false;
      if (q.includes('1000') && b.fare > 1000) return false;
      if (q.includes('500') && b.fare > 500) return false;
      if (q.includes('sleeper') && !b.busType.toLowerCase().includes('sleeper')) return false;
      if (q.includes('seater') && !b.busType.toLowerCase().includes('seater')) return false;
      if (q.includes('ac') && !b.busType.toLowerCase().includes('ac') && !b.busType.toLowerCase().includes('a/c')) return false;
      if (q.includes('nonac') && (b.busType.toLowerCase().includes('ac') || b.busType.toLowerCase().includes('a/c'))) return false;
      if (q.includes('primo') && !b.isPrimo) return false;
    }

    // Quick filter chips
    if (filterPrimo && !b.isPrimo) return false;
    if (filterFreeCancel && !b.hasFreeCancellation) return false;
    if (filterAC && !b.busType.includes('AC') && !b.busType.includes('A/C')) return false;
    if (filterNonAC && (b.busType.includes('AC') || b.busType.includes('A/C'))) return false;
    if (filterSleeper && !b.busType.toLowerCase().includes('sleeper')) return false;
    if (filterSeater && !b.busType.toLowerCase().includes('seater')) return false;
    if (filterSingleSeats && b.singleSeats <= 0) return false;
    if (filterDepEve && (depH < 18 || depH >= 24)) return false;
    if (filterDepMorn && (depH < 6 || depH >= 12)) return false;
    if (filterHighRated && b.rating < 4.5) return false;
    if (filterLiveTrack && !b.hasLiveTracking) return false;
    if (filterVolvo && !b.busType.toLowerCase().includes('volvo') && !b.busType.toLowerCase().includes('multi-axle')) return false;
    if (selectedGovtRtc && !b.operator.toLowerCase().includes(selectedGovtRtc.toLowerCase())) return false;

    // Checkboxes inside accordions
    if (selectedDepTimes.length > 0) {
      const matchDep = selectedDepTimes.some(slot => {
        if (slot.includes('06:00-12:00')) return depH >= 6 && depH < 12;
        if (slot.includes('12:00-18:00')) return depH >= 12 && depH < 18;
        if (slot.includes('18:00-24:00')) return depH >= 18 && depH < 24;
        if (slot.includes('00:00-06:00')) return depH >= 0 && depH < 6;
        return true;
      });
      if (!matchDep) return false;
    }

    if (selectedArrTimes.length > 0) {
      const matchArr = selectedArrTimes.some(slot => {
        if (slot.includes('06:00-12:00')) return arrH >= 6 && arrH < 12;
        if (slot.includes('12:00-18:00')) return arrH >= 12 && arrH < 18;
        if (slot.includes('18:00-24:00')) return arrH >= 18 && arrH < 24;
        if (slot.includes('00:00-06:00')) return arrH >= 0 && arrH < 6;
        return true;
      });
      if (!matchArr) return false;
    }

    if (selectedBusTypes.length > 0) {
      const matchType = selectedBusTypes.some(bt => {
        if (bt === 'AC') return b.busType.includes('AC') || b.busType.includes('A/C');
        if (bt === 'NONAC') return !b.busType.includes('AC') && !b.busType.includes('A/C');
        if (bt === 'SEATER') return b.busType.toLowerCase().includes('seater');
        if (bt === 'SLEEPER') return b.busType.toLowerCase().includes('sleeper');
        if (bt === 'Volvo Buses') return b.busType.toLowerCase().includes('volvo') || b.busType.toLowerCase().includes('multi-axle');
        return true;
      });
      if (!matchType) return false;
    }

    if (selectedFeatures.length > 0) {
      const matchFeat = selectedFeatures.every(feat => {
        if (feat === 'Live Tracking') return b.hasLiveTracking;
        if (feat === 'Primo Bus') return b.isPrimo;
        if (feat === 'Free Cancellation') return b.hasFreeCancellation;
        if (feat === 'High Rated Buses') return b.rating >= 4.5;
        if (feat === 'Deals') return b.fare < 500;
        return true;
      });
      if (!matchFeat) return false;
    }

    if (selectedOperators.length > 0 && !selectedOperators.some(op => b.operator.toLowerCase().includes(op.toLowerCase()))) {
      return false;
    }

    if (selectedBoarding.length > 0 && !selectedBoarding.some(bp => b.boardingPoints.some(p => p.name.toLowerCase().includes(bp.toLowerCase())))) {
      return false;
    }

    if (selectedDropping.length > 0 && !selectedDropping.some(dp => b.droppingPoints.some(p => p.name.toLowerCase().includes(dp.toLowerCase())))) {
      return false;
    }

    return true;
  });

  // Sorting
  if (sortBy === 'Ratings') {
    displayedBuses.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'Duration') {
    displayedBuses.sort((a, b) => a.duration.localeCompare(b.duration));
  } else if (sortBy === 'Departure') {
    displayedBuses.sort((a, b) => a.depTime.localeCompare(b.depTime));
  } else if (sortBy === 'Price') {
    displayedBuses.sort((a, b) => a.fare - b.fare);
  }

  // Seat toggle helper
  const handleToggleSeat = (seat: BusSeat) => {
    if (seat.isBooked) return;
    if (selectedSeats.includes(seat.id)) {
      if (selectedSeats.length === 1) return; // Keep at least one seat
      setSelectedSeats(selectedSeats.filter(s => s !== seat.id));
      setPassengers(prev => {
        const updated = { ...prev };
        delete updated[seat.id];
        return updated;
      });
      return;
    }

    setSelectedSeats([...selectedSeats, seat.id]);
    setPassengers(prev => ({
      ...prev,
      [seat.id]: {
        name: '',
        age: '',
        gender: 'Male'
      }
    }));
  };

  const updatePassengerField = (seatId: string, field: 'name' | 'age' | 'gender', value: string) => {
    setPassengers(prev => ({
      ...prev,
      [seatId]: {
        ...(prev[seatId] || { name: '', age: '', gender: 'Male' }),
        [field]: value
      }
    }));
  };

  const calculateTotalFare = () => {
    if (!selectedBus) return 0;
    return selectedSeats.reduce((sum, seatId) => {
      const s = ALL_MODAL_SEATS.find(item => item.id === seatId);
      return sum + (s?.price || selectedBus.fare);
    }, 0);
  };

  const handleConfirmBusBooking = () => {
    if (!selectedBus || selectedSeats.length === 0) return;
    const pnr = `BUS${Math.floor(10000000 + Math.random() * 90000000)}`;
    const totalAmount = calculateTotalFare();
    const primaryPax = passengers[selectedSeats[0]] || { name: 'Alex Carter', age: '28', gender: 'Male' };
    const pName = primaryPax.name.trim() || 'Alex Carter';
    const newBooking = {
      id: `bus-${Date.now()}`,
      title: `${selectedBus.operator} (${selectedBus.busType})`,
      number: `Seats: ${selectedSeats.join(', ')}`,
      type: 'Bus',
      pnr,
      bookingId: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      source: selectedBoardingPoint || selectedBus.depLocation,
      sourceCode: 'MAA',
      destination: selectedDroppingPoint || selectedBus.arrLocation,
      destinationCode: 'KPD',
      sourceTime: selectedBus.depTime,
      sourceDate: dateOfJourney,
      destinationTime: selectedBus.arrTime,
      destinationDate: dateOfJourney,
      passengerName: pName,
      seatStatus: `Confirmed Seats: ${selectedSeats.map(s => `${s} (${passengers[s]?.gender === 'Female' ? '♀ Female' : '♂ Male'})`).join(', ')}`,
      statusBadge: 'CNF',
      statusText: 'Ticket Confirmed',
      price: totalAmount,
      isActive: true,
      isCancelled: false
    };

    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('sart_global_bookings');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newBooking);
      localStorage.setItem('sart_global_bookings', JSON.stringify(list));
    }

    setConfirmedPnr(pnr);
    setBookingConfirmed(true);
  };

  return (
    <div className="bb-container">

      {/* ---------------- Main Two-Column Layout ---------------- */}
      <div className="bb-main-grid">
        {/* Left Filter Sidebar */}
        <aside className="bb-filter-sidebar">
          <div className="bb-filter-header">
            <h3 className="bb-filter-title">Filter buses</h3>
            <button
              type="button"
              className="bb-clear-filters-btn"
              onClick={clearAllFilters}
              title="Reset all applied filters"
            >
              Clear all
            </button>
          </div>

          {/* AI Smart Filter */}
          <div className="bb-ai-smart-filter">
            <span className="bb-ai-tag">AI SMART FILTER</span>
            <div className="bb-ai-input-wrap">
              <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#8b5cf6', fontSize: '13px' }}></i>
              <input
                type="text"
                className="bb-ai-input-field"
                placeholder='Try "Morning bus under ₹1000"'
                value={aiFilterText}
                onChange={(e) => setAiFilterText(e.target.value)}
              />
              <i className="fa-solid fa-microphone bb-ai-mic" title="Voice Search" onClick={() => setAiFilterText('Morning bus under ₹1000')}></i>
            </div>
          </div>

          {/* Quick Filter Chips (All 12 items exactly matching user prompt) */}
          <div className="bb-chips-grid">
            <button
              className={`bb-chip ${filterPrimo ? 'active' : ''}`}
              onClick={() => setFilterPrimo(!filterPrimo)}
            >
              <i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i>
              <span>Primo Bus (33)</span>
            </button>
            <button
              className={`bb-chip ${filterFreeCancel ? 'active' : ''}`}
              onClick={() => setFilterFreeCancel(!filterFreeCancel)}
            >
              <i className="fa-solid fa-shield-halved" style={{ color: '#16a34a' }}></i>
              <span>Free Cancellation (199)</span>
            </button>
            <button
              className={`bb-chip ${filterAC ? 'active' : ''}`}
              onClick={() => setFilterAC(!filterAC)}
            >
              <i className="fa-solid fa-snowflake" style={{ color: '#0284c7' }}></i>
              <span>AC (206)</span>
            </button>
            <button
              className={`bb-chip ${filterSleeper ? 'active' : ''}`}
              onClick={() => setFilterSleeper(!filterSleeper)}
            >
              <i className="fa-solid fa-bed" style={{ color: '#475569' }}></i>
              <span>SLEEPER (198)</span>
            </button>
            <button
              className={`bb-chip ${filterSingleSeats ? 'active' : ''}`}
              onClick={() => setFilterSingleSeats(!filterSingleSeats)}
            >
              <i className="fa-solid fa-chair" style={{ color: '#0f766e' }}></i>
              <span>Single Seats (190)</span>
            </button>
            <button
              className={`bb-chip ${filterSeater ? 'active' : ''}`}
              onClick={() => setFilterSeater(!filterSeater)}
            >
              <i className="fa-solid fa-couch" style={{ color: '#64748b' }}></i>
              <span>SEATER (90)</span>
            </button>
            <button
              className={`bb-chip ${filterNonAC ? 'active' : ''}`}
              onClick={() => setFilterNonAC(!filterNonAC)}
            >
              <i className="fa-solid fa-wind" style={{ color: '#64748b' }}></i>
              <span>NONAC (4)</span>
            </button>
            <button
              className={`bb-chip ${filterDepEve ? 'active' : ''}`}
              onClick={() => setFilterDepEve(!filterDepEve)}
            >
              <i className="fa-solid fa-moon" style={{ color: '#4338ca' }}></i>
              <span>18:00-24:00 (144)</span>
            </button>
            <button
              className={`bb-chip ${filterDepMorn ? 'active' : ''}`}
              onClick={() => setFilterDepMorn(!filterDepMorn)}
            >
              <i className="fa-solid fa-sun" style={{ color: '#ea580c' }}></i>
              <span>06:00-12:00 (18)</span>
            </button>
            <button
              className={`bb-chip ${filterHighRated ? 'active' : ''}`}
              onClick={() => setFilterHighRated(!filterHighRated)}
            >
              <i className="fa-solid fa-thumbs-up" style={{ color: '#16a34a' }}></i>
              <span>High Rated Buses (164)</span>
            </button>
            <button
              className={`bb-chip ${filterLiveTrack ? 'active' : ''}`}
              onClick={() => setFilterLiveTrack(!filterLiveTrack)}
            >
              <i className="fa-solid fa-location-crosshairs" style={{ color: '#2563eb' }}></i>
              <span>Live Tracking (170)</span>
            </button>
            <button
              className={`bb-chip ${filterVolvo ? 'active' : ''}`}
              onClick={() => setFilterVolvo(!filterVolvo)}
            >
              <i className="fa-solid fa-bus-simple" style={{ color: '#dc2626' }}></i>
              <span>Volvo Buses (31)</span>
            </button>
          </div>

          {/* Sidebar Accordions with Full Sub-options Matching User Request */}
          <div className="bb-filter-accordions-group">
            {/* 1. Departure time from source */}
            <div className="bb-accordion-item">
              <div className="bb-accordion-header" onClick={() => toggleAccordion('depTime')}>
                <span>Departure time from source</span>
                <i className={`fa-solid fa-chevron-${accordionsOpen.depTime ? 'up' : 'down'}`}></i>
              </div>
              {accordionsOpen.depTime && (
                <div className="bb-accordion-content">
                  {[
                    { label: '06:00-12:00', sub: 'Morning', count: 18, icon: 'fa-sun' },
                    { label: '12:00-18:00', sub: 'Afternoon', count: 28, icon: 'fa-sun-plant-wilt' },
                    { label: '18:00-24:00', sub: 'Evening', count: 144, icon: 'fa-moon' },
                    { label: '00:00-06:00', sub: 'Night', count: 20, icon: 'fa-cloud-moon' }
                  ].map((t) => (
                    <label key={t.label} className="bb-filter-row-checkbox">
                      <div className="bb-cb-left">
                        <input
                          type="checkbox"
                          checked={selectedDepTimes.includes(t.label)}
                          onChange={() => toggleSelection(selectedDepTimes, setSelectedDepTimes, t.label)}
                        />
                        <i className={`fa-solid ${t.icon} bb-filter-sub-icon`}></i>
                        <div className="bb-time-text-block">
                          <span className="bb-time-val-label">{t.label}</span>
                          <span className="bb-time-period-label">{t.sub}</span>
                        </div>
                      </div>
                      <span className="bb-filter-item-count">{t.count}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Arrival time at destination */}
            <div className="bb-accordion-item">
              <div className="bb-accordion-header" onClick={() => toggleAccordion('arrTime')}>
                <span>Arrival time at destination</span>
                <i className={`fa-solid fa-chevron-${accordionsOpen.arrTime ? 'up' : 'down'}`}></i>
              </div>
              {accordionsOpen.arrTime && (
                <div className="bb-accordion-content">
                  {[
                    { label: '06:00-12:00', sub: 'Morning', count: 22, icon: 'fa-sun' },
                    { label: '12:00-18:00', sub: 'Afternoon', count: 20, icon: 'fa-sun-plant-wilt' },
                    { label: '18:00-24:00', sub: 'Evening', count: 45, icon: 'fa-moon' },
                    { label: '00:00-06:00', sub: 'Night', count: 123, icon: 'fa-cloud-moon' }
                  ].map((t) => (
                    <label key={t.label} className="bb-filter-row-checkbox">
                      <div className="bb-cb-left">
                        <input
                          type="checkbox"
                          checked={selectedArrTimes.includes(t.label)}
                          onChange={() => toggleSelection(selectedArrTimes, setSelectedArrTimes, t.label)}
                        />
                        <i className={`fa-solid ${t.icon} bb-filter-sub-icon`}></i>
                        <div className="bb-time-text-block">
                          <span className="bb-time-val-label">{t.label}</span>
                          <span className="bb-time-period-label">{t.sub}</span>
                        </div>
                      </div>
                      <span className="bb-filter-item-count">{t.count}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Bus type */}
            <div className="bb-accordion-item">
              <div className="bb-accordion-header" onClick={() => toggleAccordion('busType')}>
                <span>Bus type</span>
                <i className={`fa-solid fa-chevron-${accordionsOpen.busType ? 'up' : 'down'}`}></i>
              </div>
              {accordionsOpen.busType && (
                <div className="bb-accordion-content">
                  {[
                    { label: 'AC', count: 206, icon: 'fa-snowflake' },
                    { label: 'NONAC', count: 4, icon: 'fa-wind' },
                    { label: 'SEATER', count: 90, icon: 'fa-couch' },
                    { label: 'SLEEPER', count: 198, icon: 'fa-bed' },
                    { label: 'Volvo Buses', count: 31, icon: 'fa-bus' }
                  ].map((bt) => (
                    <label key={bt.label} className="bb-filter-row-checkbox">
                      <div className="bb-cb-left">
                        <input
                          type="checkbox"
                          checked={selectedBusTypes.includes(bt.label)}
                          onChange={() => toggleSelection(selectedBusTypes, setSelectedBusTypes, bt.label)}
                        />
                        <i className={`fa-solid ${bt.icon} bb-filter-sub-icon`}></i>
                        <span>{bt.label}</span>
                      </div>
                      <span className="bb-filter-item-count">{bt.count}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Single window seater/sleeper */}
            <div className="bb-accordion-item">
              <div className="bb-accordion-header" onClick={() => toggleAccordion('singleSeats')}>
                <span>Single window seater/sleeper</span>
                <i className={`fa-solid fa-chevron-${accordionsOpen.singleSeats ? 'up' : 'down'}`}></i>
              </div>
              {accordionsOpen.singleSeats && (
                <div className="bb-accordion-content">
                  <label className="bb-filter-row-checkbox">
                    <div className="bb-cb-left">
                      <input
                        type="checkbox"
                        checked={filterSingleSeats}
                        onChange={() => setFilterSingleSeats(!filterSingleSeats)}
                      />
                      <i className="fa-solid fa-chair bb-filter-sub-icon"></i>
                      <span>Single Seats</span>
                    </div>
                    <span className="bb-filter-item-count">190</span>
                  </label>
                </div>
              )}
            </div>

            {/* 5. Bus features */}
            <div className="bb-accordion-item">
              <div className="bb-accordion-header" onClick={() => toggleAccordion('busFeatures')}>
                <span>Bus features</span>
                <i className={`fa-solid fa-chevron-${accordionsOpen.busFeatures ? 'up' : 'down'}`}></i>
              </div>
              {accordionsOpen.busFeatures && (
                <div className="bb-accordion-content">
                  {[
                    { label: 'Live Tracking', count: 170, icon: 'fa-location-crosshairs' },
                    { label: 'High Rated Buses', count: 164, icon: 'fa-thumbs-up' },
                    { label: 'Deals', count: 108, icon: 'fa-tag' },
                    { label: 'Primo Bus', count: 33, icon: 'fa-star' },
                    { label: 'Free Cancellation', count: 199, icon: 'fa-shield-halved' }
                  ].map((feat) => (
                    <label key={feat.label} className="bb-filter-row-checkbox">
                      <div className="bb-cb-left">
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(feat.label)}
                          onChange={() => toggleSelection(selectedFeatures, setSelectedFeatures, feat.label)}
                        />
                        <i className={`fa-solid ${feat.icon} bb-filter-sub-icon`}></i>
                        <span>{feat.label}</span>
                      </div>
                      <span className="bb-filter-item-count">{feat.count}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 6. Bus operator */}
            <div className="bb-accordion-item">
              <div className="bb-accordion-header" onClick={() => toggleAccordion('operator')}>
                <span>Bus operator</span>
                <i className={`fa-solid fa-chevron-${accordionsOpen.operator ? 'up' : 'down'}`}></i>
              </div>
              {accordionsOpen.operator && (
                <div className="bb-accordion-content">
                  <div className="bb-search-filter-input-wrap">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                      type="text"
                      placeholder="Search bus operator"
                      value={searchOperator}
                      onChange={(e) => setSearchOperator(e.target.value)}
                    />
                  </div>
                  {[
                    { label: '(SBLT) Shri Bhagiyalakshimi Travels (MAARA)', count: 5 },
                    { label: 'ACLS Navigator', count: 3 },
                    { label: 'ADITHIYA AIRBUS', count: 3 },
                    { label: 'ANT KING', count: 2 }
                  ]
                    .filter(op => op.label.toLowerCase().includes(searchOperator.toLowerCase()))
                    .map((op) => (
                      <label key={op.label} className="bb-filter-row-checkbox">
                        <div className="bb-cb-left">
                          <input
                            type="checkbox"
                            checked={selectedOperators.includes(op.label)}
                            onChange={() => toggleSelection(selectedOperators, setSelectedOperators, op.label)}
                          />
                          <span style={{ fontSize: '12px' }}>{op.label}</span>
                        </div>
                        <span className="bb-filter-item-count">{op.count}</span>
                      </label>
                    ))}
                  <button className="bb-view-all-link">View all bus operators</button>
                </div>
              )}
            </div>

            {/* 7. Boarding points */}
            <div className="bb-accordion-item">
              <div className="bb-accordion-header" onClick={() => toggleAccordion('boarding')}>
                <span>Boarding points</span>
                <i className={`fa-solid fa-chevron-${accordionsOpen.boarding ? 'up' : 'down'}`}></i>
              </div>
              {accordionsOpen.boarding && (
                <div className="bb-accordion-content">
                  <div className="bb-search-filter-input-wrap">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                      type="text"
                      placeholder="Search boarding point"
                      value={searchBoarding}
                      onChange={(e) => setSearchBoarding(e.target.value)}
                    />
                  </div>
                  {[
                    { label: 'Adyar', count: 10 },
                    { label: 'Alandur', count: 11 },
                    { label: 'Ambattur', count: 3 },
                    { label: 'Aminjikarai', count: 10 }
                  ]
                    .filter(b => b.label.toLowerCase().includes(searchBoarding.toLowerCase()))
                    .map((bp) => (
                      <label key={bp.label} className="bb-filter-row-checkbox">
                        <div className="bb-cb-left">
                          <input
                            type="checkbox"
                            checked={selectedBoarding.includes(bp.label)}
                            onChange={() => toggleSelection(selectedBoarding, setSelectedBoarding, bp.label)}
                          />
                          <span>{bp.label}</span>
                        </div>
                        <span className="bb-filter-item-count">{bp.count}</span>
                      </label>
                    ))}
                  <button className="bb-view-all-link">View all boarding points</button>
                </div>
              )}
            </div>

            {/* 8. Dropping points */}
            <div className="bb-accordion-item">
              <div className="bb-accordion-header" onClick={() => toggleAccordion('dropping')}>
                <span>Dropping points</span>
                <i className={`fa-solid fa-chevron-${accordionsOpen.dropping ? 'up' : 'down'}`}></i>
              </div>
              {accordionsOpen.dropping && (
                <div className="bb-accordion-content">
                  <div className="bb-search-filter-input-wrap">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                      type="text"
                      placeholder="Search dropping point"
                      value={searchDropping}
                      onChange={(e) => setSearchDropping(e.target.value)}
                    />
                  </div>
                  {[
                    { label: 'Arcot Bypass', count: 3 },
                    { label: 'CMC Hospital', count: 32 },
                    { label: 'MMDA', count: 2 },
                    { label: 'New Bus Stand', count: 115 }
                  ]
                    .filter(d => d.label.toLowerCase().includes(searchDropping.toLowerCase()))
                    .map((dp) => (
                      <label key={dp.label} className="bb-filter-row-checkbox">
                        <div className="bb-cb-left">
                          <input
                            type="checkbox"
                            checked={selectedDropping.includes(dp.label)}
                            onChange={() => toggleSelection(selectedDropping, setSelectedDropping, dp.label)}
                          />
                          <span>{dp.label}</span>
                        </div>
                        <span className="bb-filter-item-count">{dp.count}</span>
                      </label>
                    ))}
                  <button className="bb-view-all-link">View all dropping points</button>
                </div>
              )}
            </div>

            {/* 9. Amenities */}
            <div className="bb-accordion-item">
              <div className="bb-accordion-header" onClick={() => toggleAccordion('amenities')}>
                <span>Amenities</span>
                <i className={`fa-solid fa-chevron-${accordionsOpen.amenities ? 'up' : 'down'}`}></i>
              </div>
              {accordionsOpen.amenities && (
                <div className="bb-accordion-content">
                  <div className="bb-search-filter-input-wrap">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                      type="text"
                      placeholder="Search amenities"
                      value={searchAmenities}
                      onChange={(e) => setSearchAmenities(e.target.value)}
                    />
                  </div>
                  {[
                    { label: 'WIFI', count: 16, icon: 'fa-wifi' },
                    { label: 'Water Bottle', count: 152, icon: 'fa-bottle-water' },
                    { label: 'Blankets', count: 166, icon: 'fa-rug' },
                    { label: 'Charging Point', count: 182, icon: 'fa-plug' }
                  ]
                    .filter(a => a.label.toLowerCase().includes(searchAmenities.toLowerCase()))
                    .map((am) => (
                      <label key={am.label} className="bb-filter-row-checkbox">
                        <div className="bb-cb-left">
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(am.label)}
                            onChange={() => toggleSelection(selectedAmenities, setSelectedAmenities, am.label)}
                          />
                          <i className={`fa-solid ${am.icon} bb-filter-sub-icon`}></i>
                          <span>{am.label}</span>
                        </div>
                        <span className="bb-filter-item-count">{am.count}</span>
                      </label>
                    ))}
                  <button className="bb-view-all-link">View all amenities</button>
                </div>
              )}
            </div>

            {/* 10. Special bus features */}
            <div className="bb-accordion-item">
              <div className="bb-accordion-header" onClick={() => toggleAccordion('specialFeatures')}>
                <span>Special bus features</span>
                <i className={`fa-solid fa-chevron-${accordionsOpen.specialFeatures ? 'up' : 'down'}`}></i>
              </div>
              {accordionsOpen.specialFeatures && (
                <div className="bb-accordion-content">
                  {[
                    { label: 'New Bus', count: 9, icon: 'fa-sparkles' },
                    { label: 'Business Class', count: 9, icon: 'fa-briefcase' },
                    { label: 'On Time', count: 55, icon: 'fa-clock' },
                    { label: 'Toilet', count: 31, icon: 'fa-restroom' },
                    { label: 'Free date change', count: 91, icon: 'fa-calendar-check' }
                  ].map((sf) => (
                    <label key={sf.label} className="bb-filter-row-checkbox">
                      <div className="bb-cb-left">
                        <input
                          type="checkbox"
                          checked={selectedSpecial.includes(sf.label)}
                          onChange={() => toggleSelection(selectedSpecial, setSelectedSpecial, sf.label)}
                        />
                        <i className={`fa-solid ${sf.icon} bb-filter-sub-icon`}></i>
                        <span>{sf.label}</span>
                      </div>
                      <span className="bb-filter-item-count">{sf.count}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 11. RTC bus type */}
            <div className="bb-accordion-item">
              <div className="bb-accordion-header" onClick={() => toggleAccordion('rtcType')}>
                <span>RTC bus type</span>
                <i className={`fa-solid fa-chevron-${accordionsOpen.rtcType ? 'up' : 'down'}`}></i>
              </div>
              {accordionsOpen.rtcType && (
                <div className="bb-accordion-content">
                  <label className="bb-filter-row-checkbox">
                    <div className="bb-cb-left">
                      <input
                        type="checkbox"
                        checked={selectedRtc.includes('A/C SLEEPER')}
                        onChange={() => toggleSelection(selectedRtc, setSelectedRtc, 'A/C SLEEPER')}
                      />
                      <i className="fa-solid fa-bus-simple bb-filter-sub-icon"></i>
                      <span>A/C SLEEPER</span>
                    </div>
                    <span className="bb-filter-item-count">1</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right Bus Results Feed */}
        <main className="bb-results-area">
          {/* 1. Horizontal Date Calendar Strip (Exact Image 2 Reference) */}
          <div className="bb-calendar-strip-container">
            <div className="bb-cal-month-col">
              <span className="bb-cal-month-title">{CALENDAR_DATES[0]?.month?.toUpperCase() || 'LIVE'}</span>
            </div>
            <div className="bb-cal-dates-track">
              {CALENDAR_DATES.map((cd) => {
                const isSelected = selectedCalendarDate === `${cd.day} ${cd.weekday}`;
                return (
                  <button
                    key={`${cd.day}-${cd.weekday}`}
                    type="button"
                    className={`bb-cal-date-card ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedCalendarDate(`${cd.day} ${cd.weekday}`);
                      onDateChange?.(`${cd.day} ${cd.month}, ${cd.year}`);
                    }}
                  >
                    <div className="bb-cal-badge-wrap">
                      {cd.badgeType === 'green-dash' && <span className="bb-cal-dash green"></span>}
                      {cd.badgeType === 'orange-dash' && <span className="bb-cal-dash orange"></span>}
                      {cd.badgeType === 'red-circle' && <span className="bb-cal-circle red">{cd.badgeText}</span>}
                      {cd.badgeType === 'brown-circle' && <span className="bb-cal-circle brown">{cd.badgeText}</span>}
                    </div>
                    <span className="bb-cal-day-num">{cd.day}</span>
                    <span className="bb-cal-weekday">{cd.weekday}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Government Bus Ticket Booking Section (Exact Image 2 Reference) */}
          <div className="bb-govt-section">
            <div className="bb-govt-section-header">
              <h2 className="bb-govt-section-title">Government Bus Ticket Booking</h2>
              <div className="bb-govt-carousel-arrows">
                <button
                  type="button"
                  className="bb-govt-arrow-btn left"
                  onClick={() => {
                    const track = document.getElementById('govtBusTrack');
                    if (track) track.scrollBy({ left: -300, behavior: 'smooth' });
                  }}
                  title="Scroll left"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  type="button"
                  className="bb-govt-arrow-btn right"
                  onClick={() => {
                    const track = document.getElementById('govtBusTrack');
                    if (track) track.scrollBy({ left: 300, behavior: 'smooth' });
                  }}
                  title="Scroll right"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <div className="bb-govt-carousel-track" id="govtBusTrack">
              {GOVT_RTC_CARDS.map((card) => {
                const isSelected = selectedGovtRtc === card.code;
                return (
                  <div
                    key={card.code}
                    className={`bb-govt-card ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      if (selectedGovtRtc === card.code) {
                        setSelectedGovtRtc(null);
                        setFilterSearch('');
                      } else {
                        setSelectedGovtRtc(card.code);
                        setFilterSearch(card.code);
                      }
                    }}
                    title={`View ${card.fullName} (${card.code}) buses`}
                  >
                    {/* Background scenic photo representing state */}
                    <div
                      className="bb-govt-card-bg"
                      style={{ backgroundImage: `url(${card.bgImage})` }}
                    />

                    {/* Circular Emblem badge centered near top */}
                    <div className="bb-govt-card-emblem-badge">
                      {card.emblemSvg}
                    </div>

                    {/* Bottom gradient overlay with text */}
                    <div className="bb-govt-card-bottom">
                      <div className="bb-govt-card-code">{card.code}</div>
                      <div className="bb-govt-card-name">{card.fullName}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bb-results-header">
            <span className="bb-count-label">{displayedBuses.length} buses found (210 Total)</span>
            <div className="bb-sort-wrap">
              <span className="bb-sort-text">Sort by:</span>
              <button
                className={`bb-sort-btn ${sortBy === 'Ratings' ? 'active' : ''}`}
                onClick={() => setSortBy('Ratings')}
              >
                Ratings
              </button>
              <button
                className={`bb-sort-btn ${sortBy === 'Departure' ? 'active' : ''}`}
                onClick={() => setSortBy('Departure')}
              >
                Departure time
              </button>
              <button
                className={`bb-sort-btn ${sortBy === 'Price' ? 'active' : ''}`}
                onClick={() => setSortBy('Price')}
              >
                Price
              </button>
            </div>
          </div>

          {/* 3.6+ lakh bus routes on redBus peach scalloped banner (Image 3) */}


          {/* Bus Cards List */}
          <div className="bb-bus-list">
            {displayedBuses.map((bus, busIndex) => (
              <React.Fragment key={bus.id}>
                {/* Special Offers Just For You (Rendered after card 1) */}
                {busIndex === 1 && (
                  <div className="bb-special-offers-container">
                    <div className="bb-special-offers-head">
                      <h3>Special offers just for you</h3>
                      <i className="fa-solid fa-bus-simple" style={{ color: '#dc2626', fontSize: '18px' }}></i>
                    </div>
                    <div className="bb-special-coupons-grid">
                      <div className="bb-special-coupon-card">
                        <div className="bb-coupon-circle-icon">%</div>
                        <div className="bb-coupon-meta">
                          <span className="bb-coupon-code-pill">FIRST</span>
                          <span className="bb-coupon-desc">Save upto Rs 500 while making your first booking</span>
                        </div>
                        <button className="bb-coupon-copy-btn" onClick={() => alert('Code FIRST copied!')}>Copy</button>
                      </div>
                      <div className="bb-special-coupon-card">
                        <div className="bb-coupon-circle-icon">%</div>
                        <div className="bb-coupon-meta">
                          <span className="bb-coupon-code-pill">RED500</span>
                          <span className="bb-coupon-desc">Save upto Rs 500 while making your first booking</span>
                        </div>
                        <button className="bb-coupon-copy-btn" onClick={() => alert('Code RED500 copied!')}>Copy</button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bb-redbus-card-img3">
                  {/* 1. Top Pink tripReward Banner (Image 3) */}
                  {bus.hasTripReward && (
                    <div className="bb-trip-reward-banner-img3">
                      <div className="bb-reward-icon-pill">
                        <i className="fa-solid fa-star"></i>
                        <span>tripReward</span>
                      </div>
                      <span className="bb-reward-sub-img3">Take 4 trips to get a <strong>free ticket</strong></span>
                    </div>
                  )}

                  {/* 2. Main Bus Card Info Row (Exact Image 3 Grid) */}
                  <div className="bb-card-main-content-img3">
                    {/* Column 1: Operator Name, Bus Type & EV bolt */}
                    <div className="bb-col-operator-img3">
                      <div className="bb-op-title-row-img3">
                        <span className="bb-op-title-img3">{bus.operator}</span>
                      </div>
                      <div className="bb-op-sub-img3">
                        {bus.isElectric && (
                          <span className="bb-ev-badge-circle" title="100% Electric">
                            <i className="fa-solid fa-bolt"></i>
                          </span>
                        )}
                        <span>{bus.busType}</span>
                      </div>
                    </div>

                    {/* Column 2: Rating Pill with total reviews below */}
                    <div className="bb-col-rating-img3">
                      <div className="bb-rating-pill-img3">
                        <div className="bb-rating-num-top">★ {bus.rating}</div>
                        <div className="bb-rating-count-bottom">{bus.totalRatings}</div>
                      </div>
                    </div>

                    {/* Column 3: Departure, Dash, Arrival, Duration & Seats */}
                    <div className="bb-col-schedule-img3">
                      <div className="bb-times-range-img3">
                        <span className="bb-time-val-bold">{bus.depTime}</span>
                        <span className="bb-time-dash-sep">—</span>
                        <span className="bb-time-val-bold">{bus.arrTime}</span>
                      </div>
                      <div className="bb-seats-meta-img3">
                        {bus.duration} •{' '}
                        <span className={bus.availableSeats <= 15 ? 'bb-seats-highlight-low' : 'bb-seats-highlight-normal'}>
                          {bus.availableSeats} Seats
                        </span>{' '}
                        ({bus.singleSeats} Single)
                      </div>
                    </div>

                    {/* Column 4: Price & Onwards */}
                    <div className="bb-col-price-img3">
                      <div className="bb-price-val-img3">₹{bus.fare}</div>
                      <div className="bb-price-onwards-img3">Onwards</div>
                    </div>
                  </div>

                  {/* 3. Bottom Bar with Red Select Seats Button & Seats Left Pill */}
                  <div className="bb-card-bottom-bar-img3">
                    <div className="bb-action-col-wrap">
                      <button
                        type="button"
                        className="bb-view-seats-cta-img3"
                        onClick={() => {
                          setSelectedBus(bus);
                          setSelectedSeats(['L-S1A']);
                          setPassengers({
                            'L-S1A': { name: '', age: '', gender: 'Male' }
                          });
                          setModalTopTab('select_seats');
                          setModalSubTab('Highlights');
                          setSelectedBoardingPoint(bus.boardingPoints?.[0]?.name || 'Boarding Point');
                          setSelectedDroppingPoint(bus.droppingPoints?.[bus.droppingPoints.length - 1]?.name || 'Dropping Point');
                          setBookingConfirmed(false);
                        }}
                      >
                        Select Seats
                      </button>
                      <div className={`bb-seats-left-pill ${bus.availableSeats <= 15 ? 'low-seats' : 'normal-seats'}`}>
                        <i className="fa-solid fa-couch"></i>
                        <span>{bus.availableSeats} Seats Left</span>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </main>
      </div>

      {/* ---------------- 5. Interactive Seat Selection Modal ---------------- */}
      {/* ---------------- 5. Interactive Seat Selection Modal (Exact Image 3 Reference) ---------------- */}
      {selectedBus && (
        <div className="bb-seat-modal-backdrop" onClick={() => setSelectedBus(null)}>
          <div className="bb-seat-modal-box-img3" onClick={(e) => e.stopPropagation()}>
            {/* Top Navigation Bar: Select seats | Board/Drop point | Passenger Info */}
            {/* Top Navigation Bar: Select seats | Board/Drop point | Passenger Info | Live Tracking */}
            <div className="bb-modal-top-tabs-bar">
              <div className="bb-modal-top-nav-links">
                <button
                  type="button"
                  className={`bb-modal-nav-tab ${modalTopTab === 'select_seats' ? 'active' : ''}`}
                  onClick={() => setModalTopTab('select_seats')}
                >
                  <i className="fa-solid fa-couch" style={{ marginRight: '6px' }}></i> Select seats
                </button>
                <button
                  type="button"
                  className={`bb-modal-nav-tab ${modalTopTab === 'boarding_dropping' ? 'active' : ''}`}
                  onClick={() => setModalTopTab('boarding_dropping')}
                >
                  <i className="fa-solid fa-location-dot" style={{ marginRight: '6px' }}></i> Board/Drop point
                </button>
                <button
                  type="button"
                  className={`bb-modal-nav-tab ${modalTopTab === 'passenger_info' ? 'active' : ''}`}
                  onClick={() => setModalTopTab('passenger_info')}
                >
                  <i className="fa-solid fa-users" style={{ marginRight: '6px' }}></i> Passenger Info
                </button>
                <button
                  type="button"
                  className={`bb-modal-nav-tab live-track-tab ${modalTopTab === 'live_tracking' ? 'active' : ''}`}
                  onClick={() => setModalTopTab('live_tracking')}
                >
                  <span className={`bb-live-pulse-dot ${isGpsEnabled ? 'gps-on' : ''}`}></span>
                  <i className="fa-solid fa-satellite-dish" style={{ marginRight: '6px' }}></i> Live Tracking
                </button>
              </div>

              <button
                type="button"
                className="bb-modal-close-icon-btn"
                onClick={() => setSelectedBus(null)}
                title="Close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="bb-confirmed-box">
                <div className="bb-cnf-icon">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h3>Bus Ticket Booked Successfully!</h3>
                <p>PNR: <strong>{confirmedPnr}</strong></p>
                <div className="bb-cnf-summary">
                  <div><strong>Operator:</strong> {selectedBus.operator}</div>
                  <div><strong>Bus Type:</strong> {selectedBus.busType}</div>
                  <div>
                    <strong>Seats:</strong>{' '}
                    {selectedSeats.map(s => `${s} (${passengers[s]?.gender === 'Female' ? '♀ Female' : '♂ Male'})`).join(', ')}
                  </div>
                  <div><strong>Boarding:</strong> {selectedBoardingPoint || selectedBus.boardingPoints[0]?.name} ({selectedBus.depTime})</div>
                  <div><strong>Dropping:</strong> {selectedDroppingPoint || selectedBus.droppingPoints[0]?.name} ({selectedBus.arrTime})</div>
                  <div><strong>Primary Passenger:</strong> {passengers[selectedSeats[0]]?.name || 'Alex Carter'} (Age: {passengers[selectedSeats[0]]?.age || '28'}) • {registeredPhone}</div>
                  <div><strong>Total Fare Paid:</strong> ₹{calculateTotalFare()}</div>
                </div>
                <button
                  type="button"
                  className="bb-confirm-book-btn"
                  style={{ marginTop: '20px' }}
                  onClick={() => setSelectedBus(null)}
                >
                  Done
                </button>
              </div>
            ) : modalTopTab === 'live_tracking' ? (
              /* ---------------- LIVE TRACKING PANEL (GPS + COLOR CODED ROUTE) ---------------- */
              <div className="bb-live-tracking-panel">
                {/* 1. GPS Controls Banner */}
                <div className={`bb-gps-control-banner ${isGpsEnabled ? 'active' : 'inactive'}`}>
                  <div className="bb-gps-banner-left">
                    <div className="bb-gps-radar-icon">
                      <i className={`fa-solid ${isGpsEnabled ? 'fa-satellite-dish fa-spin' : 'fa-location-slash'}`}></i>
                    </div>
                    <div className="bb-gps-banner-text">
                      <div className="bb-gps-banner-title">
                        {isGpsEnabled ? '🟢 GPS Active: Bus Live Tracking Enabled' : '⚠️ Device GPS is OFF'}
                      </div>
                      <div className="bb-gps-banner-desc">
                        {isGpsEnabled
                          ? 'Real-time satellite lock synchronized (Accuracy: ±4.5m). Live bus telemetry & route proximity updated.'
                          : 'Turn on GPS to receive live real-time bus location, stops countdown, and proximity alerts.'}
                      </div>
                    </div>
                  </div>

                  <div className="bb-gps-banner-actions">
                    <button
                      type="button"
                      className={`bb-gps-toggle-btn ${isGpsEnabled ? 'btn-active' : 'btn-turn-on'}`}
                      onClick={() => setIsGpsEnabled(!isGpsEnabled)}
                    >
                      {isGpsEnabled ? '🛰️ Turn OFF GPS' : '🛰️ Turn ON GPS'}
                    </button>
                  </div>
                </div>

                {/* 2. Key Metrics Row */}
                <div className="bb-tracking-metrics-grid">
                  <div className="bb-metric-stat-card">
                    <div className="bb-metric-label">
                      <i className="fa-solid fa-bus"></i> Where the Bus is
                    </div>
                    <div className="bb-metric-value highlight">
                      {isGpsEnabled ? 'Guindy Kathipara Junction' : 'GPS Required'}
                    </div>
                    <div className="bb-metric-sub">
                      {isGpsEnabled ? 'Speed: 52 km/h • Highway NH-48' : 'Click "Turn ON GPS" to locate'}
                    </div>
                  </div>

                  <div className="bb-metric-stat-card">
                    <div className="bb-metric-label">
                      <i className="fa-solid fa-bus"></i> Where the Bus is
                    </div>
                    <div className="bb-metric-value highlight">
                      {isGpsEnabled
                        ? (activeFullRoute[Math.min(2, activeFullRoute.length - 1)]?.name || 'In Transit')
                        : 'GPS Required'}
                    </div>
                    <div className="bb-metric-sub">
                      {isGpsEnabled ? 'Speed: 52 km/h • Highway NH-48' : 'Click "Turn ON GPS" to locate'}
                    </div>
                  </div>

                  <div className="bb-metric-stat-card">
                    <div className="bb-metric-label">
                      <i className="fa-solid fa-signs-post"></i> Total Route Stops
                    </div>
                    <div className="bb-metric-value">{activeFullRoute.length} Stops</div>
                    <div className="bb-metric-sub">Full route from {activeRouteData.cleanSrc} to {activeRouteData.cleanDst}</div>
                  </div>

                  <div className="bb-metric-stat-card">
                    <div className="bb-metric-label">
                      <i className="fa-solid fa-hourglass-half"></i> Stops Before Your Boarding Point
                    </div>
                    {(() => {
                      const busCurrentIdx = Math.min(2, activeFullRoute.length - 1);
                      const boardIdx = activeFullRoute.findIndex(s =>
                        s.name.toLowerCase().includes(selectedBoardingPoint.toLowerCase()) ||
                        selectedBoardingPoint.toLowerCase().includes(s.name.toLowerCase())
                      );
                      const actualBoardIdx = boardIdx >= 0 ? boardIdx : Math.min(3, activeFullRoute.length - 1);
                      const stopsBefore = Math.max(0, actualBoardIdx - busCurrentIdx);
                      return (
                        <>
                          <div className="bb-metric-value blue-text">
                            {isGpsEnabled ? `${stopsBefore} Stops Away` : 'Calculating...'}
                          </div>
                          <div className="bb-metric-sub">
                            {isGpsEnabled
                              ? `Before ${selectedBoardingPoint} (approx. ${stopsBefore * 12 + 10} mins)`
                              : `Selected: ${selectedBoardingPoint}`}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* 3. Interactive Route Map (GPS Gated - Allowed Only with GPS) */}
                <div className="bb-live-tracking-map-container">
                  <div className="bb-map-top-header">
                    <div className="bb-map-title-left">
                      <i className="fa-solid fa-map-location-dot" style={{ color: '#38bdf8', fontSize: '16px' }}></i>
                      <span>Live Satellite Route Telemetry & Points Map</span>
                      {isGpsEnabled && <span className="bb-map-live-ping-dot" title="Live GPS Signal Active"></span>}
                    </div>
                    <div className={`bb-map-gps-pill ${isGpsEnabled ? 'active' : 'disabled'}`}>
                      <i className={`fa-solid ${isGpsEnabled ? 'fa-satellite-dish' : 'fa-location-slash'}`}></i>
                      <span>{isGpsEnabled ? 'GPS LOCKED (±4.5m)' : 'GPS STANDBY'}</span>
                    </div>
                  </div>

                  <div className="bb-map-canvas-wrap">
                    {!isGpsEnabled ? (
                      /* Standby Overlay when GPS is NOT Allowed */
                      <div className="bb-map-gps-standby-screen">
                        <div className="bb-radar-scanner-disc">
                          <i className="fa-solid fa-satellite bb-standby-satellite-icon"></i>
                        </div>
                        <h4 className="bb-standby-heading">GPS Authorization Required for Map</h4>
                        <p className="bb-standby-subtext">
                          Turn ON GPS to view the live interactive satellite route map showing your{' '}
                          <strong style={{ color: '#60a5fa' }}>Boarding Point</strong>,{' '}
                          <strong style={{ color: '#60a5fa' }}>Dropping Point</strong>, and all route waypoints from{' '}
                          <strong>{activeRouteData.cleanSrc}</strong> to <strong>{activeRouteData.cleanDst}</strong>.
                        </p>
                        <button
                          type="button"
                          className="bb-allow-gps-action-btn"
                          onClick={() => setIsGpsEnabled(true)}
                        >
                          <i className="fa-solid fa-location-crosshairs"></i> Turn ON GPS to View Map Points
                        </button>
                      </div>
                    ) : (
                      /* Active Visualizer when GPS is Allowed */
                      <div className="bb-map-active-visualizer">
                        {/* Floating Live Telemetry Box */}
                        <div className="bb-map-telemetry-floating-box">
                          <div className="bb-map-telemetry-item">
                            <span className="telem-label">Bus Speed</span>
                            <span className="telem-val">52 km/h</span>
                          </div>
                          <div className="bb-map-telemetry-item">
                            <span className="telem-label">Active Highway</span>
                            <span className="telem-val">NH-48 Corridor</span>
                          </div>
                          <div className="bb-map-telemetry-item">
                            <span className="telem-label">Current Node</span>
                            <span className="telem-val" style={{ color: '#34d399' }}>
                              {activeFullRoute[Math.min(2, activeFullRoute.length - 1)]?.name || 'In Transit'}
                            </span>
                          </div>
                        </div>

                        {/* Interactive SVG Route Map with Boarding/Dropping Points */}
                        {(() => {
                          const total = activeFullRoute.length;
                          const busCurrentIdx = Math.min(2, total - 1);
                          const boardIdxRaw = activeFullRoute.findIndex(s =>
                            s.name.toLowerCase().includes(selectedBoardingPoint.toLowerCase()) ||
                            selectedBoardingPoint.toLowerCase().includes(s.name.toLowerCase())
                          );
                          const boardIdx = boardIdxRaw >= 0 ? boardIdxRaw : Math.min(3, total - 1);

                          const dropIdxRaw = activeFullRoute.findIndex(s =>
                            s.name.toLowerCase().includes(selectedDroppingPoint.toLowerCase()) ||
                            selectedDroppingPoint.toLowerCase().includes(s.name.toLowerCase())
                          );
                          const dropIdx = dropIdxRaw >= 0 ? dropIdxRaw : total - 1;

                          // Compute coordinates along a curved road across the canvas (width: 900, height: 380)
                          const mapPoints = activeFullRoute.map((stop, i) => {
                            const ratio = total > 1 ? i / (total - 1) : 0.5;
                            const x = 75 + ratio * 750;
                            // Natural curved path
                            const y = 210 + Math.sin(ratio * Math.PI * 2) * -50 + (i % 2 === 0 ? 12 : -12);
                            return { ...stop, index: i, x, y };
                          });

                          const busPoint = mapPoints[busCurrentIdx] || mapPoints[0];
                          const boardPoint = mapPoints[boardIdx] || mapPoints[0];
                          const dropPoint = mapPoints[dropIdx] || mapPoints[mapPoints.length - 1];

                          // Create SVG path string
                          const fullPathD = mapPoints.reduce((acc, p, i) => {
                            if (i === 0) return `M ${p.x} ${p.y}`;
                            const prev = mapPoints[i - 1];
                            const cx = (prev.x + p.x) / 2;
                            return `${acc} Q ${cx} ${prev.y}, ${p.x} ${p.y}`;
                          }, '');

                          // Boarding to Dropping Path
                          const paxSegmentPoints = mapPoints.slice(boardIdx, dropIdx + 1);
                          const paxPathD = paxSegmentPoints.reduce((acc, p, i) => {
                            if (i === 0) return `M ${p.x} ${p.y}`;
                            const prev = paxSegmentPoints[i - 1];
                            const cx = (prev.x + p.x) / 2;
                            return `${acc} Q ${cx} ${prev.y}, ${p.x} ${p.y}`;
                          }, '');

                          return (
                            <svg
                              className="bb-map-svg-frame"
                              viewBox="0 0 900 380"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <defs>
                                <linearGradient id="blueTrackGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#2563eb" />
                                  <stop offset="50%" stopColor="#38bdf8" />
                                  <stop offset="100%" stopColor="#1d4ed8" />
                                </linearGradient>
                                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                                  <feGaussianBlur stdDeviation="3" result="blur" />
                                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                              </defs>

                              {/* Map Background Grid Lines */}
                              <g opacity="0.12" stroke="#64748b" strokeWidth="1">
                                <line x1="0" y1="95" x2="900" y2="95" strokeDasharray="6 6" />
                                <line x1="0" y1="190" x2="900" y2="190" strokeDasharray="6 6" />
                                <line x1="0" y1="285" x2="900" y2="285" strokeDasharray="6 6" />
                                <line x1="225" y1="0" x2="225" y2="380" strokeDasharray="6 6" />
                                <line x1="450" y1="0" x2="450" y2="380" strokeDasharray="6 6" />
                                <line x1="675" y1="0" x2="675" y2="380" strokeDasharray="6 6" />
                              </g>

                              {/* Base Highway Road Track (Yellow/Dark Gray) */}
                              <path
                                d={fullPathD}
                                fill="none"
                                stroke="#eab308"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity="0.65"
                              />

                              {/* YOUR JOURNEY: Glowing BLUE Track between Boarding and Dropping points */}
                              {paxSegmentPoints.length > 1 && (
                                <path
                                  d={paxPathD}
                                  fill="none"
                                  stroke="url(#blueTrackGlow)"
                                  strokeWidth="7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  filter="url(#glowEffect)"
                                />
                              )}

                              {/* Stop Markers on Map */}
                              {mapPoints.map(p => {
                                const isBoard = p.index === boardIdx;
                                const isDrop = p.index === dropIdx;
                                const isBus = p.index === busCurrentIdx;
                                const isPaxZone = p.index >= boardIdx && p.index <= dropIdx;

                                if (isBoard || isDrop) {
                                  // BLUE BOARDING OR DROPPING POINT
                                  return (
                                    <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
                                      <circle r="14" fill="#1d4ed8" opacity="0.3" className="bb-map-ping-circle" />
                                      <circle r="8" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
                                      {/* Marker Pin Tooltip Badge */}
                                      <g transform={`translate(0, ${p.y > 200 ? -28 : 28})`}>
                                        <rect
                                          x="-58"
                                          y="-14"
                                          width="116"
                                          height="26"
                                          rx="6"
                                          fill="#1e3a8a"
                                          stroke="#60a5fa"
                                          strokeWidth="1.5"
                                        />
                                        <text
                                          x="0"
                                          y="3"
                                          textAnchor="middle"
                                          fill="#ffffff"
                                          fontSize="11"
                                          fontWeight="800"
                                        >
                                          {isBoard ? '🔵 Boarding' : '🔵 Dropping'}
                                        </text>
                                      </g>
                                      {/* Sub-label for place name */}
                                      <text
                                        x="0"
                                        y={p.y > 200 ? -46 : 46}
                                        textAnchor="middle"
                                        fill="#93c5fd"
                                        fontSize="10"
                                        fontWeight="700"
                                      >
                                        {p.name.length > 14 ? p.name.substring(0, 14) + '...' : p.name}
                                      </text>
                                    </g>
                                  );
                                } else {
                                  // REMAINING STOP: YELLOW PIN
                                  return (
                                    <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
                                      <circle r="5" fill="#facc15" stroke="#713f12" strokeWidth="1.5" />
                                      <text
                                        x="0"
                                        y={p.index % 2 === 0 ? 18 : -14}
                                        textAnchor="middle"
                                        fill="#fef08a"
                                        fontSize="9.5"
                                        fontWeight="700"
                                      >
                                        {p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name}
                                      </text>
                                    </g>
                                  );
                                }
                              })}

                              {/* LIVE BUS INDICATOR (Moving / Active Pos) */}
                              {busPoint && (
                                <g transform={`translate(${busPoint.x}, ${busPoint.y - 12})`}>
                                  <circle r="22" fill="#10b981" opacity="0.25">
                                    <animate attributeName="r" values="18;28;18" dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2s" repeatCount="indefinite" />
                                  </circle>
                                  <circle r="14" fill="#047857" stroke="#ffffff" strokeWidth="2" />
                                  <text x="0" y="4" textAnchor="middle" fontSize="13">🚍</text>
                                  <rect
                                    x="-35"
                                    y="-32"
                                    width="70"
                                    height="18"
                                    rx="4"
                                    fill="#064e3b"
                                    stroke="#34d399"
                                    strokeWidth="1"
                                  />
                                  <text x="0" y="-20" textAnchor="middle" fill="#a7f3d0" fontSize="9.5" fontWeight="900">
                                    LIVE BUS
                                  </text>
                                </g>
                              )}
                            </svg>
                          );
                        })()}

                        {/* Floating Legend Overlay */}
                        <div className="bb-map-legend-floating-overlay">
                          <div>
                            <span className="bb-map-legend-dot blue"></span>
                            <span>Boarding & Dropping Points</span>
                          </div>
                          <div>
                            <span className="bb-map-legend-dot yellow"></span>
                            <span>Remaining Stops</span>
                          </div>
                          <div>
                            <span className="bb-map-legend-dot green"></span>
                            <span>Live Bus (GPS Lock)</span>
                          </div>
                        </div>

                        {/* Floating Map Controls */}
                        <div className="bb-map-controls-floating-row">
                          <button type="button" className="bb-map-control-btn" title="Zoom In">+</button>
                          <button type="button" className="bb-map-control-btn" title="Zoom Out">−</button>
                          <button
                            type="button"
                            className="bb-map-control-btn"
                            title="Recenter on Bus"
                            onClick={() => { }}
                          >
                            <i className="fa-solid fa-crosshairs"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Color Legend for Route */}
                <div className="bb-route-color-legend-bar">
                  <div className="bb-color-legend-item">
                    <span className="bb-route-legend-badge your-route"></span>
                    <span><strong>Your Journey (Boarding to Dropping): BLUE</strong></span>
                  </div>
                  <div className="bb-color-legend-item">
                    <span className="bb-route-legend-badge bus-terminus"></span>
                    <span><strong>Remaining Route Stops: YELLOW</strong></span>
                  </div>
                </div>

                {/* 5. Complete Colored Route Timeline */}
                <div className="bb-route-full-visual-timeline">
                  {(() => {
                    const busCurrentIdx = Math.min(2, activeFullRoute.length - 1);
                    const boardIdxRaw = activeFullRoute.findIndex(s =>
                      s.name.toLowerCase().includes(selectedBoardingPoint.toLowerCase()) ||
                      selectedBoardingPoint.toLowerCase().includes(s.name.toLowerCase())
                    );
                    const boardIdx = boardIdxRaw >= 0 ? boardIdxRaw : Math.min(3, activeFullRoute.length - 1);

                    const dropIdxRaw = activeFullRoute.findIndex(s =>
                      s.name.toLowerCase().includes(selectedDroppingPoint.toLowerCase()) ||
                      selectedDroppingPoint.toLowerCase().includes(s.name.toLowerCase())
                    );
                    const dropIdx = dropIdxRaw >= 0 ? dropIdxRaw : activeFullRoute.length - 1;

                    return activeFullRoute.map((stop, index) => {
                      const isCurrentBusStop = index === busCurrentIdx;
                      const isPassengerBoarding = index === boardIdx;
                      const isPassengerDropping = index === dropIdx;
                      const isBusEndingPoint = index === activeFullRoute.length - 1;

                      // Boarding to Dropping point is BLUE, remaining is YELLOW
                      const isInPassengerSegment = index >= boardIdx && index <= dropIdx;
                      const isConnectingBlue = index >= boardIdx && index < dropIdx;
                      const isPreBoarding = index < boardIdx;

                      return (
                        <div
                          key={stop.id}
                          className={`bb-route-stop-card-item ${isInPassengerSegment ? 'passenger-blue-zone' : 'remaining-yellow-zone'
                            }`}
                        >
                          {/* Left node and connecting track line */}
                          <div className="bb-stop-track-col">
                            <div
                              className={`bb-stop-circle-marker ${isInPassengerSegment ? 'marker-blue' : 'marker-yellow'
                                }`}
                            >
                              {isCurrentBusStop && isGpsEnabled ? (
                                <i className="fa-solid fa-bus-simple bb-pulse-bus-icon"></i>
                              ) : isPassengerBoarding ? (
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                              ) : isPassengerDropping ? (
                                <i className="fa-solid fa-location-dot"></i>
                              ) : isBusEndingPoint ? (
                                <i className="fa-solid fa-flag-checkered"></i>
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>
                            {index < activeFullRoute.length - 1 && (
                              <div
                                className={`bb-track-segment-line ${isConnectingBlue ? 'line-blue' : 'line-yellow'
                                  }`}
                              ></div>
                            )}
                          </div>

                          {/* Stop Details */}
                          <div className="bb-stop-details-col">
                            <div className="bb-stop-header-row">
                              <span className="bb-stop-time">{stop.time}</span>
                              <h4 className="bb-stop-name">{stop.name}</h4>

                              {/* Badges */}
                              {isCurrentBusStop && isGpsEnabled && (
                                <span className="bb-stop-badge current-bus-badge">
                                  <span className="bb-radar-dot"></span> Live Bus Position
                                </span>
                              )}
                              {isPassengerBoarding && (
                                <span className="bb-stop-badge boarding-pax-badge">
                                  <i className="fa-solid fa-circle-check"></i> Your Boarding Point (Blue)
                                </span>
                              )}
                              {isPassengerDropping && (
                                <span className="bb-stop-badge dropping-pax-badge">
                                  <i className="fa-solid fa-location-dot"></i> Your Dropping Point (Blue)
                                </span>
                              )}
                              {isInPassengerSegment && !isPassengerBoarding && !isPassengerDropping && (
                                <span className="bb-stop-badge dropping-pax-badge">
                                  <i className="fa-solid fa-road"></i> In Your Journey (Blue)
                                </span>
                              )}
                              {!isInPassengerSegment && (
                                <span className="bb-stop-badge remaining-yellow-badge">
                                  {isBusEndingPoint ? (
                                    <>
                                      <i className="fa-solid fa-flag-checkered"></i> Bus Ending Point (Yellow)
                                    </>
                                  ) : (
                                    'Remaining Route (Yellow)'
                                  )}
                                </span>
                              )}
                            </div>

                            <div className="bb-stop-landmark-text">
                              <i className="fa-solid fa-location-arrow"></i> {stop.landmark}
                            </div>

                            {/* Proximity notice for pre-boarding stops */}
                            {isPreBoarding && isCurrentBusStop && isGpsEnabled && (
                              <div className="bb-stop-proximity-alert">
                                🚍 Bus is at this stop now ({boardIdx - index} stop(s) before your boarding point at {selectedBoardingPoint})
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Footer Navigation */}
                <div className="bb-modal-footer-nav-row" style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    className="bb-nav-back-btn"
                    onClick={() => setModalTopTab('boarding_dropping')}
                  >
                    ← Back to Boarding / Dropping
                  </button>
                  <button
                    type="button"
                    className="bb-confirm-book-btn"
                    onClick={() => setModalTopTab('passenger_info')}
                  >
                    Continue to Passenger Info →
                  </button>
                </div>
              </div>
            ) : modalTopTab === 'boarding_dropping' ? (
              /* ---------------- BOARDING / DROPPING POINTS TAB (EXACT IMAGE 5 REFERENCE) ---------------- */
              <div className="bb-modal-tab-content-panel bb-boarding-dropping-panel-img5">
                {/* 1. Subtabs Header Bar (Exact Image 5) */}
                <div className="bb-img5-subtabs-bar">
                  <button
                    type="button"
                    className={`bb-img5-subtab-btn ${boardingSubTab === 'boarding_dropping' ? 'active' : ''}`}
                    onClick={() => setBoardingSubTab('boarding_dropping')}
                  >
                    Boarding/Dropping Point
                  </button>
                  <button
                    type="button"
                    className={`bb-img5-subtab-btn ${boardingSubTab === 'cancellation' ? 'active' : ''}`}
                    onClick={() => setBoardingSubTab('cancellation')}
                  >
                    Cancellation Policy
                  </button>
                  <button
                    type="button"
                    className={`bb-img5-subtab-btn ${boardingSubTab === 'amenities' ? 'active' : ''}`}
                    onClick={() => setBoardingSubTab('amenities')}
                  >
                    Amenities
                  </button>
                  <button
                    type="button"
                    className={`bb-img5-subtab-btn ${boardingSubTab === 'travel_policy' ? 'active' : ''}`}
                    onClick={() => setBoardingSubTab('travel_policy')}
                  >
                    Travel Policy
                  </button>
                </div>

                {boardingSubTab === 'boarding_dropping' ? (
                  <div className="bb-img5-points-content-scroll">
                    {/* 2. Boarding Points Section (Exact Image 5) */}
                    <div className="bb-img5-section-block">
                      <h3 className="bb-img5-section-title">Boarding Points</h3>
                      <div className="bb-img5-timeline-list">
                        {(showAllBoardingPoints ? activeBoardingPoints : activeBoardingPoints.slice(0, 4)).map((bp, i, arr) => (
                          <div key={bp.id} className="bb-img5-timeline-row">
                            <div className="bb-img5-time-col">
                              <span className="bb-img5-time">{bp.time}</span>
                              <span className="bb-img5-date">{bp.date}</span>
                            </div>

                            <div className="bb-img5-node-col">
                              <label className="bb-img5-radio-wrap">
                                <input
                                  type="radio"
                                  name="boardingRadio"
                                  checked={selectedBoardingPoint === bp.name}
                                  onChange={() => setSelectedBoardingPoint(bp.name)}
                                />
                                <span className="bb-img5-radio-circle"></span>
                              </label>
                              {i < arr.length - 1 && <span className="bb-img5-track-line"></span>}
                            </div>

                            <div
                              className="bb-img5-info-col"
                              onClick={() => setSelectedBoardingPoint(bp.name)}
                            >
                              <div className="bb-img5-point-name">{bp.name}</div>
                              <div className="bb-img5-point-landmark">{bp.landmark}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="bb-img5-view-more-btn"
                        onClick={() => setShowAllBoardingPoints(!showAllBoardingPoints)}
                      >
                        {showAllBoardingPoints ? 'View fewer Boarding points' : 'View more Boarding points'}
                      </button>
                    </div>

                    {/* 3. Dropping Points Section (Exact Image 5) */}
                    <div className="bb-img5-section-block" style={{ marginTop: '28px' }}>
                      <h3 className="bb-img5-section-title">Dropping Points</h3>
                      <div className="bb-img5-timeline-list">
                        {(showAllDroppingPoints ? activeDroppingPoints : activeDroppingPoints.slice(0, 4)).map((dp, i, arr) => (
                          <div key={dp.id} className="bb-img5-timeline-row">
                            <div className="bb-img5-time-col">
                              <span className="bb-img5-time">{dp.time}</span>
                              <span className="bb-img5-date">{dp.date}</span>
                            </div>

                            <div className="bb-img5-node-col">
                              <label className="bb-img5-radio-wrap">
                                <input
                                  type="radio"
                                  name="droppingRadio"
                                  checked={selectedDroppingPoint === dp.name}
                                  onChange={() => setSelectedDroppingPoint(dp.name)}
                                />
                                <span className="bb-img5-radio-circle"></span>
                              </label>
                              {i < arr.length - 1 && <span className="bb-img5-track-line"></span>}
                            </div>

                            <div
                              className="bb-img5-info-col"
                              onClick={() => setSelectedDroppingPoint(dp.name)}
                            >
                              <div className="bb-img5-point-name">{dp.name}</div>
                              <div className="bb-img5-point-landmark">{dp.landmark}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="bb-img5-view-more-btn"
                        onClick={() => setShowAllDroppingPoints(!showAllDroppingPoints)}
                      >
                        {showAllDroppingPoints ? 'View fewer Dropping points' : 'View more Dropping points'}
                      </button>
                    </div>

                    {/* 4. Cancellation Policy Table (Exact Image 5 Bottom) */}
                    <div className="bb-img5-section-block" style={{ marginTop: '28px' }}>
                      <h3 className="bb-img5-section-title">Cancellation Policy</h3>
                      <div className="bb-img5-cancel-table-card">
                        <div className="bb-img5-table-header-row">
                          <span className="bb-img5-th-left">
                            <strong>Cancellation Time</strong><br />
                            <small className="bb-img5-sub-th">(Valid from trip start time)</small>
                          </span>
                          <span className="bb-img5-th-right">
                            <strong>Refund</strong><br />
                            <small className="bb-img5-sub-th">Amount Details</small>
                          </span>
                        </div>

                        {CANCELLATION_POLICY_DATA.map((row, idx) => (
                          <div key={idx} className="bb-img5-table-body-row">
                            <span className="bb-img5-td-time">{row.time}</span>
                            <span className="bb-img5-td-refund">{row.refund}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : boardingSubTab === 'cancellation' ? (
                  <div className="bb-img5-cancel-expanded-view bb-cancel-img-box">
                    <h3 className="bb-cancel-card-title">Cancellation policy</h3>
                    <div className="bb-cancel-card-table-wrap">
                      <table className="bb-exact-cancel-table">
                        <thead>
                          <tr>
                            <th style={{ width: '42%' }}>Time before travel</th>
                            <th style={{ width: '28%', textAlign: 'center' }}>Without free cancellation</th>
                            <th style={{ width: '30%', textAlign: 'center', background: '#f0fdf4' }}>With free cancellation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CANCELLATION_POLICY_ROWS.map((row, rIdx) => (
                            <tr key={rIdx}>
                              <td className="bb-cancel-time-cell">{row.time}</td>
                              <td className="bb-cancel-without-cell">{row.withoutFree}</td>
                              <td className="bb-cancel-with-cell">
                                {row.withFree.includes('100%') ? (
                                  <span className="bb-cancel-badge-green">
                                    <i className="fa-solid fa-circle-check"></i> 100% Refund
                                  </span>
                                ) : (
                                  <span className="bb-cancel-badge-zero">0% refund</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Add Free Cancellation Banner */}
                    <div className="bb-cancel-promo-pink-banner">
                      <div className="bb-cancel-shield-icon">
                        <i className="fa-solid fa-indian-rupee-sign"></i>
                      </div>
                      <span>
                        Add <strong style={{ color: '#dc2626' }}>Free Cancellation</strong> while booking to get a 100% refund on cancellation
                      </span>
                    </div>

                    <ul className="bb-cancel-disclaimers-list">
                      <li>* Cancellation charges are computed on a per seat basis. Above cancellation fare is calculated based on seat fare of ₹ 399</li>
                      <li>* Cancellation charges are calculated based on service start date + time at :14-10-2026 18:45</li>
                      <li>* Ticket cannot be cancelled after scheduled bus departure time from the first boarding point</li>
                      <li>* Note: Cancellation charges mentioned above are excluding GST</li>
                      <li>* For group bookings individual seats can be cancelled.</li>
                    </ul>
                  </div>
                ) : boardingSubTab === 'amenities' ? (
                  <div className="bb-img5-amenities-view">
                    <h3 className="bb-img5-section-title">Bus Amenities</h3>
                    <div className="bb-amenities-grid-pills">
                      <div className="bb-amenity-pill"><i className="fa-solid fa-bottle-water"></i> Water Bottle</div>
                      <div className="bb-amenity-pill"><i className="fa-solid fa-bolt"></i> Personal Charging Point</div>
                      <div className="bb-amenity-pill"><i className="fa-solid fa-snowflake"></i> Central Air Conditioning</div>
                      <div className="bb-amenity-pill"><i className="fa-solid fa-lightbulb"></i> Individual Reading Lights</div>
                      <div className="bb-amenity-pill"><i className="fa-solid fa-bed"></i> Clean Blankets & Pillows</div>
                      <div className="bb-amenity-pill"><i className="fa-solid fa-satellite-dish"></i> Live GPS Tracking</div>
                      <div className="bb-amenity-pill"><i className="fa-solid fa-shield-halved"></i> Emergency Exit & Fire Safety</div>
                    </div>
                  </div>
                ) : (
                  <div className="bb-img5-travel-policy-view">
                    <h3 className="bb-img5-section-title">Travel & Luggage Policy</h3>
                    <ul className="bb-policy-bullets">
                      <li>Please arrive at your boarding point at least 15 minutes prior to scheduled departure.</li>
                      <li>Maximum luggage allowance is 15 kg per passenger ticket.</li>
                      <li>Valid government photo ID is mandatory during boarding.</li>
                    </ul>
                  </div>
                )}

                {/* Footer Navigation Buttons */}
                <div className="bb-modal-footer-nav-row" style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    className="bb-nav-back-btn"
                    onClick={() => setModalTopTab('select_seats')}
                  >
                    ← Back to Seat Selection
                  </button>

                  <div className="bb-footer-right-buttons">
                    <button
                      type="button"
                      className="bb-nav-live-track-btn"
                      onClick={() => setModalTopTab('live_tracking')}
                    >
                      <i className="fa-solid fa-satellite-dish"></i> Live Track Route 🛰️
                    </button>
                    <button
                      type="button"
                      className="bb-confirm-book-btn"
                      onClick={() => setModalTopTab('passenger_info')}
                    >
                      Continue to Passenger Info →
                    </button>
                  </div>
                </div>
              </div>
            ) : modalTopTab === 'passenger_info' ? (
              /* ---------------- PASSENGER INFO TAB (EXACT IMAGE 4 REFERENCE) ---------------- */
              <div className="bb-modal-tab-content-panel bb-passenger-info-screen-img4">
                <div className="bb-pax-img4-two-col-layout">
                  {/* Left Column: Contact details, Passenger cards, tripReward */}
                  <div className="bb-pax-img4-left-col">
                    {/* 1. Contact Details Card (Exact Image 4) */}
                    <div className="bb-pax-img4-card bb-contact-card-img4">
                      <div className="bb-contact-header-row">
                        <div>
                          <h3 className="bb-contact-title">Contact details</h3>
                          <p className="bb-contact-subtitle">Ticket details will be sent to</p>
                        </div>
                        <button
                          type="button"
                          className="bb-contact-edit-btn"
                          onClick={() => setIsEditingPhone(!isEditingPhone)}
                        >
                          {isEditingPhone ? 'Save' : 'Edit'}
                        </button>
                      </div>

                      {isEditingPhone ? (
                        <div className="bb-contact-edit-row">
                          <input
                            type="tel"
                            className="bb-phone-input-edit"
                            value={tempPhone}
                            onChange={(e) => setTempPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                          />
                          <button
                            type="button"
                            className="bb-save-phone-btn"
                            onClick={() => {
                              setRegisteredPhone(tempPhone);
                              setIsEditingPhone(false);
                            }}
                          >
                            Update
                          </button>
                        </div>
                      ) : (
                        <div className="bb-contact-phone-row">
                          <i className="fa-solid fa-phone"></i>
                          <span className="bb-contact-phone-text">{registeredPhone}</span>
                        </div>
                      )}

                      <div className="bb-contact-location-row">
                        <i className="fa-solid fa-location-dot"></i>
                        <span className="bb-contact-state-text">{stateOfResidence}</span>
                      </div>

                      <div className="bb-contact-whatsapp-pill">
                        <i className="fa-brands fa-whatsapp"></i>
                        <span>WhatsApp communication enabled</span>
                        <input
                          type="checkbox"
                          checked={whatsAppOptIn}
                          onChange={(e) => setWhatsAppOptIn(e.target.checked)}
                          className="bb-wa-checkbox"
                          title="Toggle WhatsApp updates"
                        />
                      </div>
                    </div>

                    {/* 2. Passenger Details Cards (Dynamic per Selected Seat - Exact Image 4) */}
                    <div className="bb-pax-img4-card bb-passengers-container-img4">
                      <h3 className="bb-passengers-main-title">Passenger details</h3>

                      {selectedSeats.map((seatId, idx) => {
                        const isUpper = seatId.startsWith('U');
                        const paxData = passengers[seatId] || { name: '', age: '', gender: 'Male' };
                        return (
                          <div key={seatId} className="bb-pax-single-card-block">
                            <div className="bb-pax-header-strip">
                              <div className="bb-pax-user-icon-circle">
                                <i className="fa-solid fa-user"></i>
                              </div>
                              <div className="bb-pax-meta-titles">
                                <span className="bb-pax-num-title">Passenger {idx + 1}</span>
                                <span className="bb-pax-seat-code-sub">
                                  Seat {seatId}, {isUpper ? 'Upper Deck' : 'Lower Deck'}
                                </span>
                              </div>
                              <i className="fa-solid fa-chevron-up bb-pax-acc-icon"></i>
                            </div>

                            <div className="bb-pax-input-group">
                              <label className="bb-pax-label">Name *</label>
                              <input
                                type="text"
                                className="bb-pax-input-box"
                                placeholder=""
                                value={paxData.name}
                                onChange={(e) => updatePassengerField(seatId, 'name', e.target.value)}
                              />
                            </div>

                            <div className="bb-pax-input-group">
                              <label className="bb-pax-label">Age *</label>
                              <input
                                type="number"
                                className="bb-pax-input-box"
                                placeholder=""
                                value={paxData.age}
                                onChange={(e) => updatePassengerField(seatId, 'age', e.target.value)}
                              />
                            </div>

                            <div className="bb-pax-gender-row">
                              <span className="bb-pax-label">Gender *</span>
                              <div className="bb-pax-gender-pills-wrap">
                                <button
                                  type="button"
                                  className={`bb-pax-radio-pill ${paxData.gender === 'Male' ? 'selected' : ''}`}
                                  onClick={() => updatePassengerField(seatId, 'gender', 'Male')}
                                >
                                  <span className="bb-radio-circle"></span> Male
                                </button>
                                <button
                                  type="button"
                                  className={`bb-pax-radio-pill ${paxData.gender === 'Female' ? 'selected' : ''}`}
                                  onClick={() => updatePassengerField(seatId, 'gender', 'Female')}
                                >
                                  <span className="bb-radio-circle"></span> Female
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 3. tripReward Card (Exact Image 4 Bottom) */}
                    <div className="bb-pax-img4-card bb-tripreward-bottom-card">
                      <div className="bb-tripreward-header-badge">
                        <i className="fa-solid fa-star"></i> tripReward
                      </div>

                      <h3 className="bb-tripreward-bold-title">Don&apos;t miss your free ticket!</h3>
                      <p className="bb-tripreward-subtext">
                        Take 4 trips with {selectedBus.operator} to get free ticket
                      </p>

                      <div className="bb-tripreward-inner-box">
                        <div className="bb-step-dots-row">
                          <span className="bb-step-dot active">1</span>
                          <span className="bb-step-dot">2</span>
                          <span className="bb-step-dot">3</span>
                          <span className="bb-step-dot">4</span>
                        </div>
                        <div className="bb-trip-step-label">
                          You are booking 1 of 4 trips with {selectedBus.operator}
                        </div>
                        <div className="bb-optin-label">Opt in to get a free ticket</div>

                        <button
                          type="button"
                          className={`bb-tripreward-cta-btn ${tripRewardOptIn ? 'opted-in' : ''}`}
                          onClick={() => setTripRewardOptIn(!tripRewardOptIn)}
                        >
                          {tripRewardOptIn ? '✔ Yes, I am in' : 'Yes, I am in'}
                        </button>

                        <a href="#how-it-works" className="bb-how-it-works-link" onClick={(e) => e.preventDefault()}>
                          How it works
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mini Trip Summary & Price Card (Exact Image 4) */}
                  <div className="bb-pax-img4-right-col">
                    <div className="bb-pax-img4-summary-card">
                      <h3 className="bb-summary-operator-title">{selectedBus.operator}</h3>
                      <p className="bb-summary-bus-type-meta">
                        {selectedSeats.length} seats • {selectedBus.busType}
                      </p>

                      {/* Schedule Timeline */}
                      <div className="bb-summary-timeline-block">
                        <div className="bb-timeline-stop-row">
                          <span className="bb-tl-time">{selectedBus.depTime}</span>
                          <span className="bb-tl-dot start"></span>
                          <div className="bb-tl-details">
                            <strong className="bb-tl-stop-name">{selectedBoardingPoint}</strong>
                            <span className="bb-tl-landmark">Infront of Sathyabama University Arch</span>
                          </div>
                        </div>

                        <div className="bb-timeline-duration-spacer">
                          <span className="bb-tl-vertical-line"></span>
                          <span className="bb-tl-duration-badge">{selectedBus.duration}</span>
                        </div>

                        <div className="bb-timeline-stop-row">
                          <span className="bb-tl-time">{selectedBus.arrTime}</span>
                          <span className="bb-tl-dot end"></span>
                          <div className="bb-tl-details">
                            <strong className="bb-tl-stop-name">{selectedDroppingPoint}</strong>
                            <span className="bb-tl-landmark">Opp to Raja Motors towards Bangalore</span>
                          </div>
                        </div>
                      </div>

                      <div className="bb-summary-divider"></div>

                      {/* Seat details with Green Badges */}
                      <div className="bb-summary-seat-details-block">
                        <div className="bb-seat-details-header">Seat details</div>
                        <div className="bb-seat-count-sub">{selectedSeats.length} seats</div>

                        <div className="bb-green-seat-pills-row">
                          {selectedSeats.map(s => {
                            const isUpper = s.startsWith('U');
                            return (
                              <span key={s} className="bb-green-seat-pill">
                                {s} • {isUpper ? 'Upper deck' : 'Lower deck'}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bb-summary-divider"></div>

                      {/* Total fare & Confirm CTA */}
                      <div className="bb-summary-fare-row">
                        <span className="bb-fare-label-text">Total Fare</span>
                        <span className="bb-fare-amount-total">₹{calculateTotalFare()}</span>
                      </div>

                      <button
                        type="button"
                        className="bb-confirm-book-btn full-width"
                        onClick={handleConfirmBusBooking}
                      >
                        Confirm & Pay ₹{calculateTotalFare()}
                      </button>
                    </div>

                    <div className="bb-back-nav-box" style={{ marginTop: '16px' }}>
                      <button
                        type="button"
                        className="bb-nav-back-btn"
                        onClick={() => setModalTopTab('boarding_dropping')}
                      >
                        ← Back to Boarding / Dropping
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ---------------- SELECT SEATS MAIN BODY (CLEAN SEATS, NO CHAIR GLYPH, NO GENDER BAR) ---------------- */
              <div className="bb-modal-two-col-body">
                {/* ---------------- LEFT COLUMN: Bus Layout & Clean Seats ---------------- */}
                <div className="bb-modal-left-decks-col">
                  {/* Clean Seat Colors Legend */}
                  <div className="bb-seat-legend-row-img3">
                    <div className="bb-legend-chip">
                      <span className="bb-legend-box available"></span> Available
                    </div>
                    <div className="bb-legend-chip">
                      <span className="bb-legend-box female-selected"></span> Selected
                    </div>
                    <div className="bb-legend-chip">
                      <span className="bb-legend-box booked"></span> Sold
                    </div>
                  </div>

                  {/* The Two Decks Container (Image 3 Clean Layout) */}
                  <div className="bb-decks-side-by-side">
                    {/* Lower Deck */}
                    <div className="bb-deck-card-img3">
                      <div className="bb-deck-header-img3">
                        <span className="bb-deck-title-text">Lower deck</span>
                        <span className="bb-steering-icon-wrap" title="Driver Side">
                          {/* Authentic Steering Wheel SVG */}
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="3" />
                            <line x1="12" y1="2" x2="12" y2="9" />
                            <line x1="12" y1="15" x2="12" y2="22" />
                            <line x1="2" y1="12" x2="9" y2="12" />
                            <line x1="15" y1="12" x2="22" y2="12" />
                          </svg>
                        </span>
                      </div>

                      <div className="bb-deck-body-layout">
                        {/* Single Sleeper column on Left */}
                        <div className="bb-deck-single-sleepers-col">
                          {LOWER_DECK_SLEEPERS.map(seat => {
                            const isSelected = selectedSeats.includes(seat.id);
                            return (
                              <div
                                key={seat.id}
                                className={`bb-berth-seat-wrap ${isSelected ? 'selected-clean' : 'available'}`}
                                onClick={() => handleToggleSeat(seat)}
                              >
                                <div className="bb-berth-seat-body">
                                  <div className="bb-berth-pillow"></div>
                                  <span className="bb-clean-seat-code">{seat.code.replace('L-', '')}</span>
                                </div>
                                <span className="bb-seat-price-label">₹{seat.price}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Seater pairs on Right (CLEAN SEATS - NO CHAIR ICONS) */}
                        <div className="bb-deck-seaters-pairs-col">
                          {LOWER_DECK_SEATERS.map((pair, rowIdx) => (
                            <div key={rowIdx} className="bb-seater-row-pair">
                              {pair.map(seat => {
                                const isBooked = seat.isBooked;
                                const isSelected = selectedSeats.includes(seat.id);

                                if (isBooked) {
                                  return (
                                    <div
                                      key={seat.id}
                                      className="bb-chair-seat-wrap booked"
                                      title="Seat Sold"
                                    >
                                      <div className="bb-chair-seat-body">
                                        <div className="bb-clean-seat-headrest"></div>
                                        <span className="bb-clean-seat-code">{seat.code.replace('L-', '')}</span>
                                      </div>
                                      <span className="bb-seat-price-label sold">Sold</span>
                                    </div>
                                  );
                                }

                                return (
                                  <div
                                    key={seat.id}
                                    className={`bb-chair-seat-wrap ${isSelected ? 'selected-clean' : 'available'}`}
                                    onClick={() => handleToggleSeat(seat)}
                                  >
                                    <div className="bb-chair-seat-body">
                                      <div className="bb-clean-seat-headrest"></div>
                                      <span className="bb-clean-seat-code">{seat.code.replace('L-', '')}</span>
                                    </div>
                                    <span className="bb-seat-price-label">₹{seat.price}</span>
                                  </div>
                                );
                              })}
                            </div>
                          ))}

                          {/* Back row chairs */}
                          <div className="bb-seater-back-row">
                            {LOWER_DECK_BACK_ROW.map(seat => {
                              const isBooked = seat.isBooked;
                              const isSelected = selectedSeats.includes(seat.id);

                              if (isBooked) {
                                return (
                                  <div key={seat.id} className="bb-chair-seat-wrap booked">
                                    <div className="bb-chair-seat-body">
                                      <div className="bb-clean-seat-headrest"></div>
                                      <span className="bb-clean-seat-code">{seat.code.replace('L-', '')}</span>
                                    </div>
                                    <span className="bb-seat-price-label sold">Sold</span>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={seat.id}
                                  className={`bb-chair-seat-wrap ${isSelected ? 'selected-clean' : 'available'}`}
                                  onClick={() => handleToggleSeat(seat)}
                                >
                                  <div className="bb-chair-seat-body">
                                    <div className="bb-clean-seat-headrest"></div>
                                    <span className="bb-clean-seat-code">{seat.code.replace('L-', '')}</span>
                                  </div>
                                  <span className="bb-seat-price-label">₹{seat.price}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upper Deck */}
                    <div className="bb-deck-card-img3">
                      <div className="bb-deck-header-img3">
                        <span className="bb-deck-title-text">Upper deck</span>
                      </div>

                      <div className="bb-deck-body-layout">
                        {/* Single Sleeper column on Left */}
                        <div className="bb-deck-single-sleepers-col">
                          {UPPER_DECK_SLEEPERS_LEFT.map(seat => {
                            const isSelected = selectedSeats.includes(seat.id);
                            return (
                              <div
                                key={seat.id}
                                className={`bb-berth-seat-wrap ${isSelected ? 'selected-clean' : 'available'}`}
                                onClick={() => handleToggleSeat(seat)}
                              >
                                <div className="bb-berth-seat-body">
                                  <div className="bb-berth-pillow"></div>
                                  <span className="bb-clean-seat-code">{seat.code}</span>
                                </div>
                                <span className="bb-seat-price-label">₹{seat.price}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Double Sleeper berths on Right */}
                        <div className="bb-deck-double-sleepers-col">
                          {UPPER_DECK_SLEEPERS_RIGHT.map((pair, rowIdx) => (
                            <div key={rowIdx} className="bb-double-sleeper-pair">
                              {pair.map(seat => {
                                const isSelected = selectedSeats.includes(seat.id);
                                return (
                                  <div
                                    key={seat.id}
                                    className={`bb-berth-seat-wrap ${isSelected ? 'selected-clean' : 'available'}`}
                                    onClick={() => handleToggleSeat(seat)}
                                  >
                                    <div className="bb-berth-seat-body">
                                      <div className="bb-berth-pillow"></div>
                                      <span className="bb-clean-seat-code">{seat.code}</span>
                                    </div>
                                    <span className="bb-seat-price-label">₹{seat.price}</span>
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ---------------- RIGHT COLUMN: Bus Details & Real Bus Photos (Image 3) ---------------- */}
                <div className="bb-modal-right-info-col">
                  {/* 1. tripReward Banner */}
                  <div className="bb-modal-tripreward-banner">
                    <div className="bb-reward-left">
                      <span className="bb-reward-badge">
                        <i className="fa-solid fa-star"></i> tripReward
                      </span>
                      <span className="bb-reward-text">
                        Take 4 trips to get a <strong>free ticket</strong>
                      </span>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ color: '#ec4899', fontSize: '12px' }}></i>
                  </div>

                  {/* 2. Bus Operator Header */}
                  <div className="bb-modal-bus-header">
                    <div className="bb-modal-bus-title-col">
                      <h2 className="bb-modal-operator-name">{selectedBus.operator}</h2>
                      <div className="bb-modal-time-row">
                        <span className="bb-modal-times">{selectedBus.depTime} - {selectedBus.arrTime}</span>
                        <span className="bb-modal-dot">•</span>
                        <span className="bb-modal-date">{dateOfJourney}</span>
                      </div>
                      <div className="bb-modal-type-name">{selectedBus.busType}</div>
                    </div>

                    <div className="bb-modal-rating-box">
                      <div className="bb-modal-rating-score">★ {selectedBus.rating}</div>
                      <div className="bb-modal-rating-count">{selectedBus.totalRatings}</div>
                    </div>
                  </div>

                  {/* 3. Real High-Definition Bus Photos Strip */}
                  <div className="bb-modal-photos-strip">
                    {BUS_GALLERY_IMAGES.map((img, idx) => (
                      <div
                        key={idx}
                        className="bb-modal-photo-thumb"
                        onClick={() => setPreviewPhoto(img.url)}
                        title="Click to view high-resolution photo"
                      >
                        <img src={img.url} alt={img.title} />
                        <span className="bb-photo-caption-badge">{img.tag}</span>
                      </div>
                    ))}
                  </div>

                  {/* 4. Sub-tabs Links Bar */}
                  <div className="bb-modal-subtabs-row">
                    {['Highlights', 'Cancellation policy', 'Bus route', 'Boarding point', 'Dropping point'].map(tab => (
                      <button
                        key={tab}
                        type="button"
                        className={`bb-modal-subtab-btn ${modalSubTab === tab ? 'active' : ''}`}
                        onClick={() => setModalSubTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* 5. Sub-tab Content Area */}
                  <div className="bb-modal-subtab-display">
                    {modalSubTab === 'Highlights' && (
                      <div className="bb-highlights-cards-wrap">
                        {/* Feature Cards Grid (Image 3) */}
                        <div className="bb-modal-features-grid">
                          <div className="bb-modal-feature-card">
                            <div className="bb-feature-card-content">
                              <div className="bb-feat-title">Electric Bus</div>
                              <div className="bb-feat-sub">Saving 17 kg CO2E</div>
                            </div>
                            <div className="bb-feat-icon-ev">
                              <i className="fa-solid fa-bolt"></i>
                            </div>
                          </div>

                          <div className="bb-modal-feature-card">
                            <div className="bb-feature-card-content">
                              <div className="bb-feat-title">Bus Safety</div>
                              <div className="bb-feat-sub">Enhanced &gt;</div>
                            </div>
                            <div className="bb-feat-icon-safety">
                              <i className="fa-solid fa-shield-halved"></i>
                            </div>
                          </div>

                          <div className="bb-modal-feature-card full-row">
                            <div className="bb-feature-card-content">
                              <div className="bb-feat-title">Women’s Choice</div>
                              <div className="bb-feat-sub">Highly rated by women</div>
                            </div>
                            <div className="bb-feat-icon-women">
                              <i className="fa-solid fa-heart"></i>
                            </div>
                          </div>
                        </div>

                        {/* Return trip discount banner */}
                        <div className="bb-modal-return-banner">
                          <div className="bb-return-badge">
                            <span className="bb-ret-line1">Return trip</span>
                            <span className="bb-ret-line2">15% OFF</span>
                          </div>
                          <div className="bb-return-text">
                            Save more on your way back
                          </div>
                        </div>
                      </div>
                    )}

                    {modalSubTab === 'Cancellation policy' && (
                      <div className="bb-modal-tab-inner-box bb-cancel-img-box">
                        <h3 className="bb-cancel-card-title">Cancellation policy</h3>
                        <div className="bb-cancel-card-table-wrap">
                          <table className="bb-exact-cancel-table">
                            <thead>
                              <tr>
                                <th style={{ width: '42%' }}>Time before travel</th>
                                <th style={{ width: '28%', textAlign: 'center' }}>Without free cancellation</th>
                                <th style={{ width: '30%', textAlign: 'center', background: '#f0fdf4' }}>With free cancellation</th>
                              </tr>
                            </thead>
                            <tbody>
                              {CANCELLATION_POLICY_ROWS.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="bb-cancel-time-cell">{row.time}</td>
                                  <td className="bb-cancel-without-cell">{row.withoutFree}</td>
                                  <td className="bb-cancel-with-cell">
                                    {row.withFree.includes('100%') ? (
                                      <span className="bb-cancel-badge-green">
                                        <i className="fa-solid fa-circle-check"></i> 100% Refund
                                      </span>
                                    ) : (
                                      <span className="bb-cancel-badge-zero">0% refund</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Add Free Cancellation Banner */}
                        <div className="bb-cancel-promo-pink-banner">
                          <div className="bb-cancel-shield-icon">
                            <i className="fa-solid fa-indian-rupee-sign"></i>
                          </div>
                          <span>
                            Add <strong style={{ color: '#dc2626' }}>Free Cancellation</strong> while booking to get a 100% refund on cancellation
                          </span>
                        </div>

                        <ul className="bb-cancel-disclaimers-list">
                          <li>* Cancellation charges are computed on a per seat basis. Above cancellation fare is calculated based on seat fare of ₹ 399</li>
                          <li>* Cancellation charges are calculated based on service start date + time at :14-10-2026 18:45</li>
                          <li>* Ticket cannot be cancelled after scheduled bus departure time from the first boarding point</li>
                          <li>* Note: Cancellation charges mentioned above are excluding GST</li>
                          <li>* For group bookings individual seats can be cancelled.</li>
                        </ul>
                      </div>
                    )}

                    {modalSubTab === 'Bus route' && (
                      <div className="bb-modal-tab-inner-box">
                        <div className="bb-subtab-map-banner">
                          <div className="bb-subtab-map-badge">
                            <i className="fa-solid fa-route"></i> Complete Route: {activeRouteData.cleanSrc} → {activeRouteData.cleanDst} ({activeFullRoute.length} Stops)
                          </div>
                          <div className="bb-subtab-map-eta">
                            <i className="fa-solid fa-clock"></i> Approx. Transit: 7 hrs 30 mins
                          </div>
                        </div>

                        <div className="bb-route-timeline">
                          {activeFullRoute.map((stop, sIdx) => {
                            const isOrigin = sIdx === 0;
                            const isEnd = sIdx === activeFullRoute.length - 1;
                            const isBoarding = stop.name.toLowerCase().includes(selectedBoardingPoint.toLowerCase()) ||
                              selectedBoardingPoint.toLowerCase().includes(stop.name.toLowerCase());
                            const isDropping = stop.name.toLowerCase().includes(selectedDroppingPoint.toLowerCase()) ||
                              selectedDroppingPoint.toLowerCase().includes(stop.name.toLowerCase());

                            return (
                              <div
                                key={stop.id}
                                className={`bb-route-stop ${isBoarding ? 'is-boarding' : ''} ${isDropping ? 'is-dropping' : ''}`}
                              >
                                <span className={`bb-stop-dot ${isOrigin ? 'start' : isEnd ? 'end' : isBoarding ? 'board' : isDropping ? 'drop' : ''}`}></span>
                                <div className="bb-route-stop-details">
                                  <div className="bb-route-stop-hdr">
                                    <strong className="bb-stop-name-txt">{stop.name}</strong>
                                    <span className="bb-stop-time-txt">- {stop.time}</span>
                                    {isOrigin && <span className="bb-stop-tag origin-tag">Bus Origin</span>}
                                    {isEnd && <span className="bb-stop-tag end-tag">Bus Terminus</span>}
                                    {isBoarding && <span className="bb-stop-tag board-tag">Your Boarding Point</span>}
                                    {isDropping && <span className="bb-stop-tag drop-tag">Your Dropping Point</span>}
                                  </div>
                                  <div className="bb-stop-landmark-sub">
                                    <i className="fa-solid fa-location-dot"></i> {stop.landmark}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {modalSubTab === 'Boarding point' && (
                      <div className="bb-modal-tab-inner-box">
                        <div className="bb-points-split-card">
                          <div className="bb-points-card-header">
                            <span className="bb-points-hdr-title">Boarding points in {activeRouteData.cleanSrc}</span>
                            <span className="bb-points-hdr-sub">
                              Selected: <strong>{selectedBoardingPoint || activeBoardingPoints[0]?.name}</strong>
                            </span>
                          </div>

                          {/* Quick Proximity & Time To Reach Boarding Point Notice */}
                          <div className="bb-boarding-eta-card">
                            <div className="bb-eta-icon-col">
                              <i className="fa-solid fa-person-walking-luggage"></i>
                            </div>
                            <div className="bb-eta-info-col">
                              <div className="bb-eta-title">
                                Time to reach boarding point ({selectedBoardingPoint})
                              </div>
                              <div className="bb-eta-desc">
                                ⏱️ Estimated transit time from city center: <strong>25 mins</strong> (Distance ~6.8 km). Please arrive 15 minutes before scheduled bus departure ({activeBoardingPoints.find(p => p.name === selectedBoardingPoint)?.time || '18:45'}).
                              </div>
                            </div>
                          </div>

                          <div className="bb-points-items-list">
                            {activeBoardingPoints.map((bp) => {
                              const isSelected = selectedBoardingPoint === bp.name;
                              return (
                                <div
                                  key={bp.id}
                                  className={`bb-point-tile-row ${isSelected ? 'selected' : ''}`}
                                  onClick={() => setSelectedBoardingPoint(bp.name)}
                                >
                                  <div className="bb-pt-left-time">{bp.time}</div>
                                  <div className="bb-pt-center-info">
                                    <div className="bb-pt-name-bold">{bp.name}</div>
                                    <div className="bb-pt-landmark-sub">{bp.landmark}</div>
                                    <div className="bb-pt-time-reach-tag">
                                      <i className="fa-solid fa-location-arrow"></i> ~20-30 min travel to point
                                    </div>
                                  </div>
                                  <div className="bb-pt-right-radio">
                                    <div className={`bb-pt-radio-bull ${isSelected ? 'active-target' : ''}`}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {modalSubTab === 'Dropping point' && (
                      <div className="bb-modal-tab-inner-box">
                        <div className="bb-points-split-card">
                          <div className="bb-points-card-header">
                            <span className="bb-points-hdr-title">Dropping points in {activeRouteData.cleanDst}</span>
                            <span className="bb-points-hdr-sub">
                              Selected: <strong>{selectedDroppingPoint || activeDroppingPoints[activeDroppingPoints.length - 1]?.name}</strong>
                            </span>
                          </div>

                          <div className="bb-points-items-list">
                            {activeDroppingPoints.map((dp) => {
                              const isSelected = selectedDroppingPoint === dp.name;
                              return (
                                <div
                                  key={dp.id}
                                  className={`bb-point-tile-row ${isSelected ? 'selected' : ''}`}
                                  onClick={() => setSelectedDroppingPoint(dp.name)}
                                >
                                  <div className="bb-pt-left-time">{dp.time}</div>
                                  <div className="bb-pt-center-info">
                                    <div className="bb-pt-name-bold">{dp.name}</div>
                                    <div className="bb-pt-landmark-sub">{dp.landmark}</div>
                                  </div>
                                  <div className="bb-pt-right-radio">
                                    <div className={`bb-pt-radio-bull ${isSelected ? 'active-target' : ''}`}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 6. Selected Seats Summary Bar & Action */}
                  <div className="bb-selected-summary-checkout-panel">
                    <div className="bb-sel-seats-list-row">
                      <span className="bb-sel-title">Seats ({selectedSeats.length}):</span>
                      {selectedSeats.map(seatId => {
                        const sData = ALL_MODAL_SEATS.find(s => s.id === seatId);
                        return (
                          <div key={seatId} className="bb-selected-seat-chip selected-clean">
                            <span className="bb-chip-code">{seatId}</span>
                            <span className="bb-chip-fare">₹{sData?.price || selectedBus.fare}</span>
                            <button
                              type="button"
                              className="bb-chip-remove-btn"
                              onClick={() => handleToggleSeat(sData || { id: seatId, code: seatId, price: selectedBus.fare, type: 'seater', deck: 'lower' })}
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bb-fare-and-cta-row">
                      <div className="bb-total-fare-col">
                        <span className="bb-fare-sub">Total Amount</span>
                        <span className="bb-fare-amount">₹{calculateTotalFare()}</span>
                      </div>

                      <button
                        type="button"
                        className="bb-continue-cta-btn"
                        disabled={selectedSeats.length === 0}
                        onClick={() => setModalTopTab('boarding_dropping')}
                      >
                        Continue to Board/Drop point →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Photo Lightbox Preview */}
            {previewPhoto && (
              <div className="bb-photo-lightbox-overlay" onClick={() => setPreviewPhoto(null)}>
                <div className="bb-lightbox-content" onClick={(e) => e.stopPropagation()}>
                  <img src={previewPhoto} alt="Bus Preview" />
                  <button className="bb-lightbox-close" onClick={() => setPreviewPhoto(null)}>
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
