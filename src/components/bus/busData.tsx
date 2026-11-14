'use client';

import React from 'react';

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
  bookedSeats?: string[];
  hasToilet?: boolean;
  layoutVariant?: 'seater_sleeper_48' | 'sleeper_36' | 'toilet_sleeper_24_24';
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
  logoImg?: string;
  emblemSvg?: React.ReactNode;
}

export const GOVT_RTC_CARDS: GovtRtcCardItem[] = [
  {
    code: 'APSRTC',
    fullName: 'Andhra Pradesh State Road Transport Corporation',
    bgImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl6-oaf-jF2KCyZOAugjmBSq55wsREoLLsCxKRDxdU3CVM1Up4LGILZI4&s=10',
    logoImg: '/images/rtc/apsrtc_logo.png',
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
    bgImage: 'https://www.trawell.in/admin/images/upload/249844992Hyderabad_Main.jpg',
    logoImg: '/images/rtc/tsrtc_logo.png',
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
    logoImg: '/images/rtc/kerala_rtc_logo.png',
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
    code: 'KSRTC',
    fullName: 'Karnataka State Road Transport Corporation',
    bgImage: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=600&q=80',
    logoImg: '/images/rtc/ksrtc_logo.png',
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
    code: 'TNSTC',
    fullName: 'Tamil Nadu State Transport Corporation',
    bgImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    logoImg: '/images/rtc/tnstc_logo.png',
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


];

const INITIAL_BUSES: BusItem[] = [

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
  { id: 'L-SL1', code: 'SL1', price: 999, type: 'sleeper', deck: 'lower' },
  { id: 'L-SL2', code: 'SL2', price: 999, type: 'sleeper', deck: 'lower' },
  { id: 'L-SL3', code: 'SL3', price: 999, type: 'sleeper', deck: 'lower' },
  { id: 'L-SL4', code: 'SL4', price: 999, type: 'sleeper', deck: 'lower' },
  { id: 'L-SL5', code: 'SL5', price: 999, type: 'sleeper', deck: 'lower' },
  { id: 'L-SL6', code: 'SL6', price: 999, type: 'sleeper', deck: 'lower' },
];

export const LOWER_DECK_SEATERS: BusSeat[][] = [
  [
    { id: 'L-S1A', code: 'S1A', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row1' },
    { id: 'L-S1B', code: 'S1B', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row1' },
  ],
  [
    { id: 'L-S2A', code: 'S2A', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row2' },
    { id: 'L-S2B', code: 'S2B', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row2' },
  ],
  [
    { id: 'L-S3A', code: 'S3A', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row3' },
    { id: 'L-S3B', code: 'S3B', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row3' },
  ],
  [
    { id: 'L-S4A', code: 'S4A', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row4' },
    { id: 'L-S4B', code: 'S4B', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row4' },
  ],
  [
    { id: 'L-S5A', code: 'S5A', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row5' },
    { id: 'L-S5B', code: 'S5B', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row5' },
  ],
  [
    { id: 'L-S6A', code: 'S6A', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row6' },
    { id: 'L-S6B', code: 'S6B', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row6' },
  ],
  [
    { id: 'L-S7A', code: 'S7A', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row7' },
    { id: 'L-S7B', code: 'S7B', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row7' },
  ],
  [
    { id: 'L-S8A', code: 'S8A', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row8' },
    { id: 'L-S8B', code: 'S8B', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row8' },
  ],
  [
    { id: 'L-S9A', code: 'S9A', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row9' },
    { id: 'L-S9B', code: 'S9B', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row9' },
  ],
  [
    { id: 'L-S10A', code: 'S10A', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row10' },
    { id: 'L-S10B', code: 'S10B', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row10' },
  ],
  [
    { id: 'L-S11A', code: 'S11A', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row11' },
    { id: 'L-S11B', code: 'S11B', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row11' },
  ],
  [
    { id: 'L-S12A', code: 'S12A', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row12' },
    { id: 'L-S12B', code: 'S12B', price: 444, type: 'seater', deck: 'lower', pairId: 'L-row12' },
  ],
];

export const LOWER_DECK_BACK_ROW: BusSeat[] = [];

export const UPPER_DECK_SLEEPERS_LEFT: BusSeat[] = [
  { id: 'U-SL1', code: 'U-SL1', price: 888, type: 'sleeper', deck: 'upper' },
  { id: 'U-SL2', code: 'U-SL2', price: 888, type: 'sleeper', deck: 'upper' },
  { id: 'U-SL3', code: 'U-SL3', price: 888, type: 'sleeper', deck: 'upper' },
  { id: 'U-SL4', code: 'U-SL4', price: 888, type: 'sleeper', deck: 'upper' },
  { id: 'U-SL5', code: 'U-SL5', price: 888, type: 'sleeper', deck: 'upper' },
  { id: 'U-SL6', code: 'U-SL6', price: 888, type: 'sleeper', deck: 'upper' },
];

export const UPPER_DECK_SLEEPERS_RIGHT: BusSeat[][] = [
  [
    { id: 'U-D1A', code: 'U-D1A', price: 666, type: 'sleeper', deck: 'upper', pairId: 'U-row1' },
    { id: 'U-D1B', code: 'U-D1B', price: 666, type: 'sleeper', deck: 'upper', pairId: 'U-row1' },
  ],
  [
    { id: 'U-D2A', code: 'U-D2A', price: 666, type: 'sleeper', deck: 'upper', pairId: 'U-row2' },
    { id: 'U-D2B', code: 'U-D2B', price: 666, type: 'sleeper', deck: 'upper', pairId: 'U-row2' },
  ],
  [
    { id: 'U-D3A', code: 'U-D3A', price: 666, type: 'sleeper', deck: 'upper', pairId: 'U-row3' },
    { id: 'U-D3B', code: 'U-D3B', price: 666, type: 'sleeper', deck: 'upper', pairId: 'U-row3' },
  ],
  [
    { id: 'U-D4A', code: 'U-D4A', price: 666, type: 'sleeper', deck: 'upper', pairId: 'U-row4' },
    { id: 'U-D4B', code: 'U-D4B', price: 666, type: 'sleeper', deck: 'upper', pairId: 'U-row4' },
  ],
  [
    { id: 'U-D5A', code: 'U-D5A', price: 666, type: 'sleeper', deck: 'upper', pairId: 'U-row5' },
    { id: 'U-D5B', code: 'U-D5B', price: 666, type: 'sleeper', deck: 'upper', pairId: 'U-row5' },
  ],
  [
    { id: 'U-D6A', code: 'U-D6A', price: 666, type: 'sleeper', deck: 'upper', pairId: 'U-row6' },
    { id: 'U-D6B', code: 'U-D6B', price: 666, type: 'sleeper', deck: 'upper', pairId: 'U-row6' },
  ],
];

export const ALL_MODAL_SEATS: BusSeat[] = [
  ...LOWER_DECK_SLEEPERS,
  ...LOWER_DECK_SEATERS.flat(),
  ...LOWER_DECK_BACK_ROW,
  ...UPPER_DECK_SLEEPERS_LEFT,
  ...UPPER_DECK_SLEEPERS_RIGHT.flat(),
];

// Helper to calculate exact available vs booked seats dynamically per bus & date
export function computeBusSeatsLayout(
  bus: BusItem | null,
  date: string,
  extraBookedIds: string[] = [],
  bookedGendersMap: Record<string, 'male' | 'female'> = {}
): {
  lowerSleepers: BusSeat[];
  lowerSeaters: BusSeat[][];
  lowerBackRow: BusSeat[];
  upperSleepersLeft: BusSeat[];
  upperSleepersRight: BusSeat[][];
  availableSeatIds: string[];
  hasToilet: boolean;
  layoutVariant: 'seater_sleeper_48' | 'sleeper_36' | 'toilet_sleeper_24_24';
} {
  const hasToilet = bus?.hasToilet === true || bus?.layoutVariant === 'toilet_sleeper_24_24';
  let layoutVariant: 'seater_sleeper_48' | 'sleeper_36' | 'toilet_sleeper_24_24' = 'seater_sleeper_48';

  if (hasToilet || bus?.layoutVariant === 'toilet_sleeper_24_24') {
    layoutVariant = 'toilet_sleeper_24_24';
  } else if (bus?.layoutVariant === 'sleeper_36' || bus?.busType?.toLowerCase().includes('sleeper (2+1)') || bus?.busType?.toLowerCase().includes('pure sleeper')) {
    layoutVariant = 'sleeper_36';
  }

  // Construct raw seat definitions based on layout variant
  let rawLowerSleepers: BusSeat[] = [];
  let rawLowerSeaters: BusSeat[][] = [];
  let rawUpperLeft: BusSeat[] = [];
  let rawUpperRight: BusSeat[][] = [];

  if (layoutVariant === 'toilet_sleeper_24_24') {
    // Image 3: Toilet bus - 5 sleepers on left (toilet at front), 6 double sleeper pairs on right
    rawLowerSleepers = [
      { id: 'L-SL1', code: 'L-SL1', price: 999, type: 'sleeper', deck: 'lower' },
      { id: 'L-SL2', code: 'L-SL2', price: 999, type: 'sleeper', deck: 'lower' },
      { id: 'L-SL3', code: 'L-SL3', price: 999, type: 'sleeper', deck: 'lower' },
      { id: 'L-SL4', code: 'L-SL4', price: 999, type: 'sleeper', deck: 'lower' },
      { id: 'L-SL5', code: 'L-SL5', price: 999, type: 'sleeper', deck: 'lower' },
    ];
    rawLowerSeaters = [
      [{ id: 'L-D1A', code: 'L-D1A', price: 859, type: 'sleeper', deck: 'lower', pairId: 'L-row1' }, { id: 'L-D1B', code: 'L-D1B', price: 689, type: 'sleeper', deck: 'lower', pairId: 'L-row1' }],
      [{ id: 'L-D2A', code: 'L-D2A', price: 859, type: 'sleeper', deck: 'lower', pairId: 'L-row2' }, { id: 'L-D2B', code: 'L-D2B', price: 689, type: 'sleeper', deck: 'lower', pairId: 'L-row2' }],
      [{ id: 'L-D3A', code: 'L-D3A', price: 859, type: 'sleeper', deck: 'lower', pairId: 'L-row3' }, { id: 'L-D3B', code: 'L-D3B', price: 689, type: 'sleeper', deck: 'lower', pairId: 'L-row3' }],
      [{ id: 'L-D4A', code: 'L-D4A', price: 859, type: 'sleeper', deck: 'lower', pairId: 'L-row4' }, { id: 'L-D4B', code: 'L-D4B', price: 689, type: 'sleeper', deck: 'lower', pairId: 'L-row4' }],
      [{ id: 'L-D5A', code: 'L-D5A', price: 859, type: 'sleeper', deck: 'lower', pairId: 'L-row5' }, { id: 'L-D5B', code: 'L-D5B', price: 689, type: 'sleeper', deck: 'lower', pairId: 'L-row5' }],
      [{ id: 'L-D6A', code: 'L-D6A', price: 859, type: 'sleeper', deck: 'lower', pairId: 'L-row6' }, { id: 'L-D6B', code: 'L-D6B', price: 689, type: 'sleeper', deck: 'lower', pairId: 'L-row6' }],
    ];
    rawUpperLeft = [
      { id: 'U-SL1', code: 'U-SL1', price: 888, type: 'sleeper', deck: 'upper' },
      { id: 'U-SL2', code: 'U-SL2', price: 888, type: 'sleeper', deck: 'upper' },
      { id: 'U-SL3', code: 'U-SL3', price: 888, type: 'sleeper', deck: 'upper' },
      { id: 'U-SL4', code: 'U-SL4', price: 888, type: 'sleeper', deck: 'upper' },
      { id: 'U-SL5', code: 'U-SL5', price: 888, type: 'sleeper', deck: 'upper' },
    ];
    rawUpperRight = [
      [{ id: 'U-D1A', code: 'U-D1A', price: 779, type: 'sleeper', deck: 'upper', pairId: 'U-row1' }, { id: 'U-D1B', code: 'U-D1B', price: 779, type: 'sleeper', deck: 'upper', pairId: 'U-row1' }],
      [{ id: 'U-D2A', code: 'U-D2A', price: 779, type: 'sleeper', deck: 'upper', pairId: 'U-row2' }, { id: 'U-D2B', code: 'U-D2B', price: 779, type: 'sleeper', deck: 'upper', pairId: 'U-row2' }],
      [{ id: 'U-D3A', code: 'U-D3A', price: 779, type: 'sleeper', deck: 'upper', pairId: 'U-row3' }, { id: 'U-D3B', code: 'U-D3B', price: 779, type: 'sleeper', deck: 'upper', pairId: 'U-row3' }],
      [{ id: 'U-D4A', code: 'U-D4A', price: 779, type: 'sleeper', deck: 'upper', pairId: 'U-row4' }, { id: 'U-D4B', code: 'U-D4B', price: 779, type: 'sleeper', deck: 'upper', pairId: 'U-row4' }],
      [{ id: 'U-D5A', code: 'U-D5A', price: 779, type: 'sleeper', deck: 'upper', pairId: 'U-row5' }, { id: 'U-D5B', code: 'U-D5B', price: 779, type: 'sleeper', deck: 'upper', pairId: 'U-row5' }],
      [{ id: 'U-D6A', code: 'U-D6A', price: 779, type: 'sleeper', deck: 'upper', pairId: 'U-row6' }, { id: 'U-D6B', code: 'U-D6B', price: 779, type: 'sleeper', deck: 'upper', pairId: 'U-row6' }],
    ];
  } else if (layoutVariant === 'sleeper_36') {
    // Image 2: 36 Sleepers (Pure Sleeper Bus - 18 Lower + 18 Upper)
    rawLowerSleepers = [
      { id: 'L-SL1', code: 'L-SL1', price: 999, type: 'sleeper', deck: 'lower' },
      { id: 'L-SL2', code: 'L-SL2', price: 999, type: 'sleeper', deck: 'lower' },
      { id: 'L-SL3', code: 'L-SL3', price: 999, type: 'sleeper', deck: 'lower' },
      { id: 'L-SL4', code: 'L-SL4', price: 999, type: 'sleeper', deck: 'lower' },
      { id: 'L-SL5', code: 'L-SL5', price: 999, type: 'sleeper', deck: 'lower' },
      { id: 'L-SL6', code: 'L-SL6', price: 999, type: 'sleeper', deck: 'lower' },
    ];
    rawLowerSeaters = [
      [{ id: 'L-D1A', code: 'L-D1A', price: 799, type: 'sleeper', deck: 'lower', pairId: 'L-row1' }, { id: 'L-D1B', code: 'L-D1B', price: 799, type: 'sleeper', deck: 'lower', pairId: 'L-row1' }],
      [{ id: 'L-D2A', code: 'L-D2A', price: 799, type: 'sleeper', deck: 'lower', pairId: 'L-row2' }, { id: 'L-D2B', code: 'L-D2B', price: 799, type: 'sleeper', deck: 'lower', pairId: 'L-row2' }],
      [{ id: 'L-D3A', code: 'L-D3A', price: 799, type: 'sleeper', deck: 'lower', pairId: 'L-row3' }, { id: 'L-D3B', code: 'L-D3B', price: 799, type: 'sleeper', deck: 'lower', pairId: 'L-row3' }],
      [{ id: 'L-D4A', code: 'L-D4A', price: 799, type: 'sleeper', deck: 'lower', pairId: 'L-row4' }, { id: 'L-D4B', code: 'L-D4B', price: 799, type: 'sleeper', deck: 'lower', pairId: 'L-row4' }],
      [{ id: 'L-D5A', code: 'L-D5A', price: 799, type: 'sleeper', deck: 'lower', pairId: 'L-row5' }, { id: 'L-D5B', code: 'L-D5B', price: 799, type: 'sleeper', deck: 'lower', pairId: 'L-row5' }],
      [{ id: 'L-D6A', code: 'L-D6A', price: 799, type: 'sleeper', deck: 'lower', pairId: 'L-row6' }, { id: 'L-D6B', code: 'L-D6B', price: 799, type: 'sleeper', deck: 'lower', pairId: 'L-row6' }],
    ];
    rawUpperLeft = UPPER_DECK_SLEEPERS_LEFT;
    rawUpperRight = UPPER_DECK_SLEEPERS_RIGHT;
  } else {
    // Image 1: 24 Seaters & 24 Sleepers
    rawLowerSleepers = LOWER_DECK_SLEEPERS;
    rawLowerSeaters = LOWER_DECK_SEATERS;
    rawUpperLeft = UPPER_DECK_SLEEPERS_LEFT;
    rawUpperRight = UPPER_DECK_SLEEPERS_RIGHT;
  }

  const allSeats: BusSeat[] = [
    ...rawLowerSleepers,
    ...rawLowerSeaters.flat(),
    ...rawUpperLeft,
    ...rawUpperRight.flat(),
  ];
  const totalSeats = allSeats.length;

  // Calculate live available target after deducting persistent booked seats
  const baseAvailable = bus ? bus.availableSeats : 11;
  const targetAvailable = Math.max(0, Math.min(totalSeats, baseAvailable - extraBookedIds.length));
  const numToBook = Math.max(0, totalSeats - targetAvailable);

  // Simple deterministic seed for stable seat selection per bus & date
  let seed = 12345;
  if (bus) {
    const key = `${bus.id}-${date}`;
    for (let i = 0; i < key.length; i++) {
      seed = ((seed << 5) - seed) + key.charCodeAt(i);
      seed |= 0;
    }
  }

  // Shuffle candidate seats deterministically
  const shuffled = [...allSeats].sort((a, b) => {
    const hA = Math.sin((seed + a.code.charCodeAt(0) * 17) * 999);
    const hB = Math.sin((seed + b.code.charCodeAt(0) * 17) * 999);
    return hA - hB;
  });

  const bookedIdsSet = new Set<string>();

  // 1. First prioritize all user-confirmed booked seats
  extraBookedIds.forEach(id => bookedIdsSet.add(id));

  // 2. If bus carries backend bookedSeats list, add them
  if (bus?.bookedSeats && Array.isArray(bus.bookedSeats) && bus.bookedSeats.length > 0) {
    bus.bookedSeats.forEach(id => bookedIdsSet.add(id));
  }

  // 3. Fill remaining booked seats from deterministic shuffle until exactly numToBook seats are booked
  for (let i = 0; i < shuffled.length && bookedIdsSet.size < numToBook; i++) {
    bookedIdsSet.add(shuffled[i].id);
  }

  const markSeat = (s: BusSeat): BusSeat => {
    const isBooked = bookedIdsSet.has(s.id);
    let assignedGender: 'male' | 'female' | undefined = undefined;
    if (isBooked) {
      if (bookedGendersMap[s.id]) {
        assignedGender = bookedGendersMap[s.id];
      } else {
        assignedGender = s.id.charCodeAt(s.id.length - 1) % 2 === 0 ? 'female' : 'male';
      }
    }
    return {
      ...s,
      isBooked,
      bookedGender: assignedGender
    };
  };

  const lowerSleepers = rawLowerSleepers.map(markSeat);
  const lowerSeaters = rawLowerSeaters.map(row => row.map(markSeat));
  const lowerBackRow: BusSeat[] = [];
  const upperSleepersLeft = rawUpperLeft.map(markSeat);
  const upperSleepersRight = rawUpperRight.map(row => row.map(markSeat));

  const allMarked = [
    ...lowerSleepers,
    ...lowerSeaters.flat(),
    ...upperSleepersLeft,
    ...upperSleepersRight.flat()
  ];
  const availableSeatIds = allMarked.filter(s => !s.isBooked).map(s => s.id);

  return {
    lowerSleepers,
    lowerSeaters,
    lowerBackRow,
    upperSleepersLeft,
    upperSleepersRight,
    availableSeatIds,
    hasToilet,
    layoutVariant
  };
}

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

export interface CancellationPolicyRow {
  time: string;
  refund: string;
  withoutFree?: string;
  withFree?: string;
}

export const CANCELLATION_POLICY_ROWS: CancellationPolicyRow[] = [
  { time: '0 to 12 hrs before departure', refund: '0%', withoutFree: '0% refund', withFree: '100% refund' },
  { time: '12 to 24 hrs before departure', refund: '50%', withoutFree: '50% refund', withFree: '100% refund' },
  { time: '24 to 48 hrs before departure', refund: '80%', withoutFree: '80% refund', withFree: '100% refund' },
  { time: '48+ hrs before departure', refund: '90%', withoutFree: '90% refund', withFree: '100% refund' },
];

export const CANCELLATION_POLICY_DATA: CancellationPolicyRow[] = [
  { time: 'Before 24 hrs of journey', refund: '90% refund', withoutFree: '90%', withFree: '100%' },
  { time: 'Between 12 to 24 hrs', refund: '70% refund', withoutFree: '70%', withFree: '100%' },
  { time: 'Between 2 to 12 hrs', refund: '50% refund', withoutFree: '50%', withFree: '100%' },
  { time: 'Within 2 hrs of journey', refund: 'No refund', withoutFree: '0%', withFree: '100%' },
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


  ];
}

