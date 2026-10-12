'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './TrainBookingView.css';
import BusBookingView from './BusBookingView';
import { useSartStore } from '@/store/useSartStore';

interface TrainClassOption {
  code: string;
  fare: number;
  status: string;
  statusType: 'available' | 'wl' | 'regret' | 'update';
  updated: string;
  isTatkal?: boolean;
}

interface TrainItem {
  id: string;
  number: string;
  name: string;
  runningDays: string;
  departureTime: string;
  departureStation: string;
  departureStationCode: string;
  departureTag?: string;
  departureTags?: string[];
  duration: string;
  arrivalTime: string;
  arrivalStation: string;
  arrivalStationCode: string;
  arrivalTag?: string;
  classes: TrainClassOption[];
  stops: { station: string; code: string; arr: string; dep: string; halt: string }[];
  distance?: string;
  avgSpeed?: string;
  punctuality?: string;
  pantryAvailable?: boolean;
  coaches?: { code: string; label: string; type: string }[];
}

const INDIAN_STATIONS = [
  { code: 'MAS', name: 'Chennai', full: 'Mgr Chennai Ctl - MAS' },
  { code: 'BZA', name: 'Vijayawada', full: 'Vijayawada Jn - BZA' },
  { code: 'HYD', name: 'Hyderabad', full: 'Secunderabad / Hyderabad - HYD' },
  { code: 'BLR', name: 'Bengaluru', full: 'KSR Bengaluru - SBC' },
  { code: 'KPD', name: 'Katpadi', full: 'Katpadi Jn - KPD' },
  { code: 'VLR', name: 'Vellore', full: 'Vellore Cantt - VLR' },
  { code: 'TPTY', name: 'Tirupati', full: 'Tirupati Central - TPTY' },
  { code: 'VSKP', name: 'Visakhapatnam', full: 'Visakhapatnam Jn - VSKP' },
  { code: 'CBE', name: 'Coimbatore', full: 'Coimbatore Jn - CBE' },
  { code: 'MDU', name: 'Madurai', full: 'Madurai Jn - MDU' },
  { code: 'TRZ', name: 'Trichy', full: 'Tiruchchirappalli Jn - TPJ' },
  { code: 'PUNE', name: 'Pune', full: 'Pune Jn - PUNE' },
  { code: 'MUM', name: 'Mumbai', full: 'CSMT Mumbai - CSMT' },
  { code: 'DEL', name: 'Delhi', full: 'New Delhi - NDLS' },
  { code: 'GOA', name: 'Goa', full: 'Madgaon Goa - MAO' },
  { code: 'KOC', name: 'Kochi', full: 'Ernakulam Kochi - ERS' }
];

const INITIAL_TRAINS: TrainItem[] = [
  // 1. Nilagiri Sf Exp (Exact match to Image 1)
  {
    id: '12671',
    number: '12671',
    name: 'Nilagiri Sf Exp',
    runningDays: 'M T W T F S S',
    departureTime: '09:05 PM',
    departureStation: 'Mgr Chennai Ctl (MAS)',
    departureStationCode: 'MAS',
    departureTag: 'Starting station',
    duration: '01 h 48 min',
    arrivalTime: '10:53 PM',
    arrivalStation: 'Katpadi Jn. (KPD)',
    arrivalStationCode: 'KPD',
    arrivalTag: '2 min halt',
    distance: '130 km',
    avgSpeed: '72 km/h',
    punctuality: '94% On Time Record (Avg delay 3m)',
    pantryAvailable: true,
    coaches: [
      { code: 'ENG', label: 'Engine', type: 'loco' },
      { code: 'S1', label: 'Sleeper', type: 'sl' },
      { code: 'S2', label: 'Sleeper', type: 'sl' },
      { code: 'S3', label: 'Sleeper', type: 'sl' },
      { code: 'B1', label: '3-Tier AC', type: '3a' },
      { code: 'B2', label: '3-Tier AC', type: '3a' },
      { code: 'B3', label: '3-Tier AC', type: '3a' },
      { code: 'A1', label: '2-Tier AC', type: '2a' },
      { code: 'H1', label: '1st Class AC', type: '1a' },
      { code: 'PC', label: 'Pantry Car', type: 'pc' },
      { code: 'SLR', label: 'Guard / Luggage', type: 'slr' }
    ],
    classes: [
      { code: 'SL', fare: 180, status: 'Available 9', statusType: 'available', updated: '1 hr ago' },
      { code: '3A', fare: 565, status: 'Available 2', statusType: 'available', updated: '7 hr ago' },
      { code: '3E', fare: 565, status: 'Available 5', statusType: 'available', updated: '6 hr ago' },
      { code: '2A', fare: 770, status: 'Available 1', statusType: 'available', updated: '5 hr ago' },
      { code: '1A', fare: 1270, status: 'PQWL 3', statusType: 'wl', updated: '7 hr ago' },
    ],
    stops: [
      { station: 'Mgr Chennai Ctl', code: 'MAS', arr: '--', dep: '09:05 PM', halt: 'Starts' },
      { station: 'Arakkonam Jn', code: 'AJJ', arr: '09:58 PM', dep: '10:00 PM', halt: '2 min' },
      { station: 'Katpadi Jn', code: 'KPD', arr: '10:53 PM', dep: '10:55 PM', halt: '2 min' },
      { station: 'Jolarpettai Jn', code: 'JTJ', arr: '12:03 AM', dep: '12:05 AM', halt: '2 min' },
      { station: 'Salem Jn', code: 'SA', arr: '01:47 AM', dep: '01:50 AM', halt: '3 min' },
      { station: 'Erode Jn', code: 'ED', arr: '02:45 AM', dep: '02:50 AM', halt: '5 min' },
      { station: 'Mettupalayam', code: 'MTP', arr: '06:15 AM', dep: '--', halt: 'Ends' }
    ]
  },

  // 2. Sangha Mitra Ex (Exact match to Image 2 with Tatkal badges & scrollable classes)
  {
    id: '12296',
    number: '12296',
    name: 'Sangha Mitra Ex',
    runningDays: 'M T W T F S S',
    departureTime: '09:45 AM',
    departureStation: 'Perambur (PER)',
    departureStationCode: 'PER',
    departureTags: ['5 min halt', '4km from MAS'],
    duration: '01 h 40 min',
    arrivalTime: '11:25 AM',
    arrivalStation: 'Katpadi Jn. (KPD)',
    arrivalStationCode: 'KPD',
    arrivalTag: '15 min halt',
    distance: '132 km',
    avgSpeed: '79 km/h',
    punctuality: '96% On Time Record (Avg delay 2m)',
    pantryAvailable: true,
    coaches: [
      { code: 'ENG', label: 'WAP-7 Loco', type: 'loco' },
      { code: 'D1', label: 'General / 2S', type: '2s' },
      { code: 'S1', label: 'Sleeper', type: 'sl' },
      { code: 'S2', label: 'Sleeper', type: 'sl' },
      { code: 'S3', label: 'Sleeper', type: 'sl' },
      { code: 'S4', label: 'Sleeper (Tatkal)', type: 'sl' },
      { code: 'B1', label: '3A Economy', type: '3e' },
      { code: 'B2', label: '3-Tier AC', type: '3a' },
      { code: 'B3', label: '3-Tier AC (Tatkal)', type: '3a' },
      { code: 'A1', label: '2-Tier AC', type: '2a' },
      { code: 'A2', label: '2-Tier AC', type: '2a' },
      { code: 'H1', label: 'First AC (1A)', type: '1a' },
      { code: 'PC', label: 'Pantry Car', type: 'pc' },
      { code: 'EOG', label: 'End on Gen', type: 'slr' }
    ],
    classes: [
      { code: 'SL', fare: 180, status: 'Available 1', statusType: 'available', updated: '5 hr ago' },
      { code: 'SL', fare: 440, status: 'Available 18', statusType: 'available', updated: '2 hr ago', isTatkal: true },
      { code: '3A', fare: 565, status: 'Available 21', statusType: 'available', updated: '5 hr ago' },
      { code: '3A', fare: 1170, status: 'Available 19', statusType: 'available', updated: '6 hr ago', isTatkal: true },
      { code: '2A', fare: 770, status: 'Available 6', statusType: 'available', updated: '4 hr ago' },
      { code: '3E', fare: 565, status: 'Tap to update', statusType: 'update', updated: 'Just now' },
      { code: '3E', fare: 1240, status: 'Available 12', statusType: 'available', updated: '1 hr ago', isTatkal: true },
      { code: '1A', fare: 1320, status: 'Available 4', statusType: 'available', updated: '3 hr ago' },
      { code: '2S', fare: 95, status: 'Available 42', statusType: 'available', updated: '30 min ago' },
    ],
    stops: [
      { station: 'Perambur', code: 'PER', arr: '--', dep: '09:45 AM', halt: 'Starts' },
      { station: 'Arakkonam Jn', code: 'AJJ', arr: '10:33 AM', dep: '10:35 AM', halt: '2 min' },
      { station: 'Katpadi Jn', code: 'KPD', arr: '11:25 AM', dep: '11:40 AM', halt: '15 min' },
      { station: 'Jolarpettai Jn', code: 'JTJ', arr: '12:48 PM', dep: '12:50 PM', halt: '2 min' },
      { station: 'Bangarapet', code: 'BWT', arr: '01:53 PM', dep: '01:55 PM', halt: '2 min' },
      { station: 'KSR Bengaluru', code: 'SBC', arr: '03:30 PM', dep: '--', halt: 'Ends' }
    ]
  },
  {
    id: '22625',
    number: '22625',
    name: 'Sbc Double Deck',
    runningDays: 'M T W T F S S',
    departureTime: '07:25 AM',
    departureStation: 'Mgr Chennai Ctl (MAS)',
    departureStationCode: 'MAS',
    departureTag: 'Starting station',
    duration: '01 h 38 min',
    arrivalTime: '09:03 AM',
    arrivalStation: 'Katpadi Jn. (KPD)',
    arrivalStationCode: 'KPD',
    arrivalTag: '2 min halt',
    classes: [
      { code: 'CC', fare: 320, status: 'Available 42', statusType: 'available', updated: '10 mins ago' },
      { code: '2S', fare: 95, status: 'Available 115', statusType: 'available', updated: '25 mins ago' },
      { code: 'EV', fare: 685, status: 'WL 8', statusType: 'wl', updated: '1 hr ago' },
    ],
    stops: [
      { station: 'Mgr Chennai Ctl', code: 'MAS', arr: '--', dep: '07:25 AM', halt: 'Starts' },
      { station: 'Arakkonam Jn', code: 'AJJ', arr: '08:18 AM', dep: '08:20 AM', halt: '2 min' },
      { station: 'Katpadi Jn', code: 'KPD', arr: '09:03 AM', dep: '09:05 AM', halt: '2 min' },
      { station: 'Ambur', code: 'AB', arr: '09:43 AM', dep: '09:45 AM', halt: '2 min' },
      { station: 'Vaniyambadi', code: 'VN', arr: '09:58 AM', dep: '10:00 AM', halt: '2 min' },
      { station: 'Jolarpettai Jn', code: 'JTJ', arr: '10:23 AM', dep: '10:25 AM', halt: '2 min' },
      { station: 'KSR Bengaluru', code: 'SBC', arr: '01:10 PM', dep: '--', halt: 'Ends' }
    ]
  },
  {
    id: '12007',
    number: '12007',
    name: 'Mysore Shatabdi',
    runningDays: 'M T W T F S S',
    departureTime: '06:00 AM',
    departureStation: 'Mgr Chennai Ctl (MAS)',
    departureStationCode: 'MAS',
    departureTag: 'Starting station',
    duration: '01 h 33 min',
    arrivalTime: '07:33 AM',
    arrivalStation: 'Katpadi Jn. (KPD)',
    arrivalStationCode: 'KPD',
    arrivalTag: '2 min halt',
    classes: [
      { code: 'CC', fare: 425, status: 'Available 18', statusType: 'available', updated: '20 mins ago' },
      { code: 'EC', fare: 910, status: 'Available 6', statusType: 'available', updated: '40 mins ago' },
    ],
    stops: [
      { station: 'Mgr Chennai Ctl', code: 'MAS', arr: '--', dep: '06:00 AM', halt: 'Starts' },
      { station: 'Katpadi Jn', code: 'KPD', arr: '07:33 AM', dep: '07:35 AM', halt: '2 min' },
      { station: 'KSR Bengaluru', code: 'SBC', arr: '10:45 AM', dep: '10:50 AM', halt: '5 min' },
      { station: 'Mysuru Jn', code: 'MYS', arr: '01:00 PM', dep: '--', halt: 'Ends' }
    ]
  },
  {
    id: '12639',
    number: '12639',
    name: 'Brindavan Exp',
    runningDays: 'M T W T F S S',
    departureTime: '07:40 AM',
    departureStation: 'Mgr Chennai Ctl (MAS)',
    departureStationCode: 'MAS',
    departureTag: 'Starting station',
    duration: '01 h 48 min',
    arrivalTime: '09:28 AM',
    arrivalStation: 'Katpadi Jn. (KPD)',
    arrivalStationCode: 'KPD',
    arrivalTag: '2 min halt',
    classes: [
      { code: '2S', fare: 85, status: 'Available 64', statusType: 'available', updated: '15 mins ago' },
      { code: 'CC', fare: 315, status: 'Available 12', statusType: 'available', updated: '1 hr ago' },
      { code: 'EV', fare: 650, status: 'Available 3', statusType: 'available', updated: '2 hr ago' },
    ],
    stops: [
      { station: 'Mgr Chennai Ctl', code: 'MAS', arr: '--', dep: '07:40 AM', halt: 'Starts' },
      { station: 'Arakkonam Jn', code: 'AJJ', arr: '08:33 AM', dep: '08:35 AM', halt: '2 min' },
      { station: 'Katpadi Jn', code: 'KPD', arr: '09:28 AM', dep: '09:30 AM', halt: '2 min' },
      { station: 'Walajah Road Jn', code: 'WJR', arr: '09:50 AM', dep: '09:52 AM', halt: '2 min' },
      { station: 'KSR Bengaluru', code: 'SBC', arr: '02:00 PM', dep: '--', halt: 'Ends' }
    ]
  },
  {
    id: '20607',
    number: '20607',
    name: 'Vande Bharat Exp',
    runningDays: 'M T W T F S S',
    departureTime: '05:50 AM',
    departureStation: 'Mgr Chennai Ctl (MAS)',
    departureStationCode: 'MAS',
    departureTag: 'Starting station',
    duration: '01 h 23 min',
    arrivalTime: '07:13 AM',
    arrivalStation: 'Katpadi Jn. (KPD)',
    arrivalStationCode: 'KPD',
    arrivalTag: '2 min halt',
    classes: [
      { code: 'CC', fare: 510, status: 'Available 34', statusType: 'available', updated: '5 mins ago' },
      { code: 'EC', fare: 1020, status: 'Available 8', statusType: 'available', updated: '12 mins ago' },
    ],
    stops: [
      { station: 'Mgr Chennai Ctl', code: 'MAS', arr: '--', dep: '05:50 AM', halt: 'Starts' },
      { station: 'Katpadi Jn', code: 'KPD', arr: '07:13 AM', dep: '07:15 AM', halt: '2 min' },
      { station: 'KSR Bengaluru', code: 'SBC', arr: '10:10 AM', dep: '10:15 AM', halt: '5 min' },
      { station: 'Mysuru Jn', code: 'MYS', arr: '12:20 PM', dep: '--', halt: 'Ends' }
    ]
  }
];

export type RideMode = 'bike' | 'auto' | 'car' | 'bus' | 'train' | 'flight';

export function getRideModeFromPath(urlPath?: string): RideMode {
  const p = (typeof window !== 'undefined' && window.location.pathname)
    ? window.location.pathname
    : (urlPath || '');
  const lower = p.toLowerCase();
  if (lower.includes('/bus')) return 'bus';
  if (lower.includes('/flight') || lower.includes('/filght')) return 'flight';
  if (lower.includes('/car')) return 'car';
  if (lower.includes('/bike') || lower.includes('/bick')) return 'bike';
  if (lower.includes('/auto')) return 'auto';
  if (lower.includes('/train')) return 'train';
  return 'train';
}

export default function TrainBookingView() {
  const pathname = usePathname();
  const router = useRouter();
  const { setActiveTab } = useSartStore();

  // Navigation & Mode - initialized reliably from the current path
  const [activeMode, setActiveMode] = useState<RideMode>(() => getRideModeFromPath(pathname));

  // Synchronize activeMode with browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const mode = getRideModeFromPath(window.location.pathname);
        setActiveMode(mode);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleModeChange = (mode: RideMode) => {
    setActiveMode(mode);
    const targetUrl = `/home/ride/${mode}`;
    if (typeof window !== 'undefined') {
      window.history.pushState({ mode }, '', targetUrl);
    }
    router.push(targetUrl);
  };

  // Cab / Quick Ride State for Bike, Auto, Car
  const [selectedRideId, setSelectedRideId] = useState<string>('std-1');
  const [rideBookedModal, setRideBookedModal] = useState<any | null>(null);

  // Search Fields
  const getCleanPlaceName = (name: string) => {
    return name.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim();
  };

  const [source, setSource] = useState(() =>
    getRideModeFromPath(pathname) === 'bus' ? 'Mgr Chennai Ctl' : 'Mgr Chennai Ctl - MAS'
  );
  const [destination, setDestination] = useState(() =>
    getRideModeFromPath(pathname) === 'bus' ? 'Katpadi Jn' : 'Katpadi Jn - KPD'
  );
  const [dateOfJourney, setDateOfJourney] = useState('14 Oct, 2026');
  const [selectedDay, setSelectedDay] = useState('14');

  // Keep source & destination formatted as place name only when in bus mode
  useEffect(() => {
    if (activeMode === 'bus') {
      setSource(prev => getCleanPlaceName(prev));
      setDestination(prev => getCleanPlaceName(prev));
    }
  }, [activeMode]);

  // Calendar Picker State
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [calMonth, setCalMonth] = useState(9); // 0-indexed: 9 = October
  const [calYear, setCalYear] = useState(2026);
  const calendarRef = useRef<HTMLDivElement>(null);

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const MONTH_SHORT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Close calendar popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendarPicker(false);
      }
    };
    if (showCalendarPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendarPicker]);

  const toggleCalendarPicker = () => {
    // Sync current month/year from dateOfJourney if possible
    const parts = dateOfJourney.split(' ');
    if (parts.length >= 3) {
      const monthPart = parts[1].replace(',', '').trim().toLowerCase();
      const mIdx = MONTH_SHORT.findIndex(m => m.toLowerCase() === monthPart);
      if (mIdx !== -1) setCalMonth(mIdx);
      const yr = parseInt(parts[2]);
      if (!isNaN(yr)) setCalYear(yr);
    }
    setShowCalendarPicker(prev => !prev);
  };

  const handleSelectDate = (dayNum: number, monthIdx = calMonth, yr = calYear) => {
    const formattedDay = String(dayNum).padStart(2, '0');
    const newDateStr = `${formattedDay} ${MONTH_SHORT[monthIdx]}, ${yr}`;
    setDateOfJourney(newDateStr);
    if (monthIdx === 9 && yr === 2026) {
      setSelectedDay(String(dayNum));
    } else {
      setSelectedDay('');
    }
    setShowCalendarPicker(false);
  };

  // Auto-complete dropdown states
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState<'Default' | 'Availability' | 'Duration' | 'Departure' | 'Arrival'>('Default');

  // Quick filters
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterAC, setFilterAC] = useState(false);
  const [filterTatkal, setFilterTatkal] = useState(false);
  const [filterAltTrip, setFilterAltTrip] = useState(false);

  // Free cancellation toggle
  const [freeCancel, setFreeCancel] = useState(false);

  // Accordion open/close states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    availability: false,
    ticketClass: false,
    quota: false,
    departureTime: false,
    arrivalTime: false,
    departingStations: false,
    arrivingStations: false,
    alternateTrip: false
  });

  // Modals & Expanded Train details
  const [viewRouteTrain, setViewRouteTrain] = useState<TrainItem | null>(null);
  const [expandedTrainId, setExpandedTrainId] = useState<string | null>(null);
  const classScrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [bookingClassModal, setBookingClassModal] = useState<{ train: TrainItem; classOption: TrainClassOption } | null>(null);
  const [passengerName, setPassengerName] = useState('Alex Carter');
  const [passengerAge, setPassengerAge] = useState('28');
  const [passengerBerth, setPassengerBerth] = useState('No Preference');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSwapStations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  // Calendar dates list in October
  const dateList = [
    { num: '14', day: 'Wed', pip: 'green' },
    { num: '15', day: 'Thu', pip: 'green' },
    { num: '16', day: 'Fri', pip: 'orange' },
    { num: '17', day: 'Sat', pip: 'orange' },
    { num: '18', day: 'Sun', pip: 'green' },
    { num: '19', day: 'Mon', badge: '19', badgeColor: 'red' },
    { num: '20', day: 'Tue', badge: '20', badgeColor: 'brown' },
    { num: '21', day: 'Wed', pip: 'green' },
    { num: '22', day: 'Thu', pip: 'green' },
    { num: '23', day: 'Fri', pip: 'green' },
    { num: '24', day: 'Sat', pip: 'green' },
    { num: '25', day: 'Sun', pip: 'green' },
    { num: '26', day: 'Mon', pip: 'green' },
    { num: '27', day: 'Tue', pip: 'green' },
    { num: '28', day: 'Wed', pip: 'green' },
  ];

  // Filtered & Sorted Trains
  let displayedTrains = [...INITIAL_TRAINS];

  if (filterAvailable) {
    displayedTrains = displayedTrains.filter(t => t.classes.some(c => c.statusType === 'available'));
  }
  if (filterAC) {
    displayedTrains = displayedTrains.filter(t => t.classes.some(c => ['1A', '2A', '3A', '3E', 'CC', 'EC'].includes(c.code)));
  }

  if (sortBy === 'Duration') {
    displayedTrains.sort((a, b) => a.duration.localeCompare(b.duration));
  } else if (sortBy === 'Departure') {
    displayedTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  } else if (sortBy === 'Arrival') {
    displayedTrains.sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime));
  }

  // Handle final booking confirmation
  const handleConfirmTicketBooking = () => {
    if (!bookingClassModal) return;
    const { train, classOption } = bookingClassModal;
    const pnr = `PNR${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newBooking = {
      id: `train-${Date.now()}`,
      title: train.name,
      number: train.number,
      type: 'Train',
      pnr,
      bookingId: `TRN${Math.floor(100000 + Math.random() * 900000)}`,
      source: source.split('-')[0].trim(),
      sourceCode: train.departureStationCode,
      destination: destination.split('-')[0].trim(),
      destinationCode: train.arrivalStationCode,
      sourceTime: train.departureTime,
      sourceDate: dateOfJourney,
      destinationTime: train.arrivalTime,
      destinationDate: dateOfJourney,
      passengerName,
      seatStatus: `Confirmed (${classOption.code} - Coach S3, Berth 24)`,
      statusBadge: 'CNF',
      statusText: 'Ticket Confirmed',
      price: classOption.fare + (freeCancel ? 50 : 0),
      isActive: true,
      isCancelled: false
    };

    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('sart_global_bookings');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newBooking);
      localStorage.setItem('sart_global_bookings', JSON.stringify(list));
    }

    setBookingConfirmed(true);
  };

  return (
    <div className="tb-container">
      {/* ---------------- Top Navigation Bar with Back Arrow to Home ---------------- */}
      <div className="tb-top-nav-bar" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <button
          onClick={() => {
            setActiveTab('home');
            if (typeof window !== 'undefined') {
              window.history.pushState(null, '', '/home');
            }
            router.push('/home');
          }}
          className="tb-back-home-btn"
          style={{
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#0f172a',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            transition: 'all 0.2s ease'
          }}
          title="Back to Home Page"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{source.split('-')[0].trim()}</span>
            <i className="fa-solid fa-arrow-right" style={{ fontSize: '13px', color: '#64748b' }}></i>
            <span>{destination.split('-')[0].trim()}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
            {activeMode === 'bus' ? '213 buses available' :
              activeMode === 'train' ? '65 trains available' :
                activeMode === 'flight' ? '18 flights available' :
                  'Instant ride captains nearby'}
          </div>
        </div>
      </div>

      {/* ---------------- 1. Top Search Bar ---------------- */}
      <div className="tb-search-card">
        <div className="tb-search-row">
          {/* Source Input */}
          <div className="tb-search-field">
            <i className={`fa-solid ${activeMode === 'bike' ? 'fa-motorcycle' :
                activeMode === 'auto' ? 'fa-taxi' :
                  activeMode === 'car' ? 'fa-car' :
                    activeMode === 'bus' ? 'fa-bus' :
                      activeMode === 'flight' ? 'fa-plane' :
                        'fa-train-subway'
              } tb-field-icon`}></i>
            <div className="tb-field-content">
              <span className="tb-field-label">Source</span>
              <input
                type="text"
                className="tb-field-input"
                value={activeMode === 'bus' ? getCleanPlaceName(source) : source}
                onChange={(e) => { setSource(e.target.value); setShowSourceDropdown(true); }}
                onFocus={() => setShowSourceDropdown(true)}
                placeholder="From Station / Location"
              />
            </div>

            {showSourceDropdown && (
              <div className="tb-suggestions-popup">
                {INDIAN_STATIONS.filter(st => {
                  const q = (activeMode === 'bus' ? getCleanPlaceName(source) : source).trim().toLowerCase();
                  if (!q) return true;
                  return st.name.toLowerCase().includes(q) || st.code.toLowerCase().includes(q) || st.full.toLowerCase().includes(q);
                }).map(st => (
                  <div
                    key={st.code}
                    className="tb-suggestion-item"
                    onClick={() => {
                      setSource(activeMode === 'bus' ? st.name : st.full);
                      setShowSourceDropdown(false);
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{st.name}</span>
                    {activeMode !== 'bus' && (
                      <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{st.code}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <button className="tb-swap-btn" onClick={handleSwapStations} title="Swap Stations">
            <i className="fa-solid fa-arrow-right-arrow-left"></i>
          </button>

          {/* Destination Input */}
          <div className="tb-search-field">
            <i className={`fa-solid ${activeMode === 'bike' ? 'fa-motorcycle' :
                activeMode === 'auto' ? 'fa-taxi' :
                  activeMode === 'car' ? 'fa-car' :
                    activeMode === 'bus' ? 'fa-bus' :
                      activeMode === 'flight' ? 'fa-plane' :
                        'fa-train-subway'
              } tb-field-icon`}></i>
            <div className="tb-field-content">
              <span className="tb-field-label">Destination</span>
              <input
                type="text"
                className="tb-field-input"
                value={activeMode === 'bus' ? getCleanPlaceName(destination) : destination}
                onChange={(e) => { setDestination(e.target.value); setShowDestDropdown(true); }}
                onFocus={() => setShowDestDropdown(true)}
                placeholder="To Station / Location"
              />
            </div>

            {showDestDropdown && (
              <div className="tb-suggestions-popup">
                {INDIAN_STATIONS.filter(st => {
                  const q = (activeMode === 'bus' ? getCleanPlaceName(destination) : destination).trim().toLowerCase();
                  if (!q) return true;
                  return st.name.toLowerCase().includes(q) || st.code.toLowerCase().includes(q) || st.full.toLowerCase().includes(q);
                }).map(st => (
                  <div
                    key={st.code}
                    className="tb-suggestion-item"
                    onClick={() => {
                      setDestination(activeMode === 'bus' ? st.name : st.full);
                      setShowDestDropdown(false);
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{st.name}</span>
                    {activeMode !== 'bus' && (
                      <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{st.code}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tb-field-divider"></div>

          {/* Date of Journey Field with Interactive Calendar Picker */}
          <div
            className="tb-search-field tb-date-field"
            style={{ flex: '1.2', cursor: 'pointer' }}
            ref={calendarRef}
          >
            <div
              className="tb-date-trigger-wrap"
              onClick={toggleCalendarPicker}
              title="Click to select journey date"
            >
              <i className="fa-regular fa-calendar-days tb-field-icon tb-cal-icon"></i>
              <div className="tb-field-content">
                <span className="tb-field-label">Date of journey</span>
                <div className="tb-date-display-row">
                  <span className="tb-field-input tb-date-text">
                    {dateOfJourney}
                  </span>
                  <i className={`fa-solid fa-chevron-${showCalendarPicker ? 'up' : 'down'} tb-date-chevron`}></i>
                </div>
              </div>
            </div>

            <div className="tb-quick-date-pills">
              <button
                type="button"
                className={`tb-date-pill ${dateOfJourney === '15 Oct, 2026' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCalMonth(9);
                  setCalYear(2026);
                  setDateOfJourney('15 Oct, 2026');
                  setSelectedDay('15');
                  setShowCalendarPicker(false);
                }}
              >
                Tomorrow
              </button>
              <button
                type="button"
                className={`tb-date-pill ${dateOfJourney === '16 Oct, 2026' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCalMonth(9);
                  setCalYear(2026);
                  setDateOfJourney('16 Oct, 2026');
                  setSelectedDay('16');
                  setShowCalendarPicker(false);
                }}
              >
                Day After
              </button>
            </div>

            {/* Interactive Calendar Dropdown Popup */}
            {showCalendarPicker && (
              <div className="tb-calendar-popup" onClick={(e) => e.stopPropagation()}>
                {/* Month/Year Navigation */}
                <div className="tb-cal-header">
                  <button
                    type="button"
                    className="tb-cal-nav-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (calMonth === 0) {
                        setCalMonth(11);
                        setCalYear(y => y - 1);
                      } else {
                        setCalMonth(m => m - 1);
                      }
                    }}
                    title="Previous month"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <span className="tb-cal-title">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </span>
                  <button
                    type="button"
                    className="tb-cal-nav-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (calMonth === 11) {
                        setCalMonth(0);
                        setCalYear(y => y + 1);
                      } else {
                        setCalMonth(m => m + 1);
                      }
                    }}
                    title="Next month"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>

                {/* Weekday Names */}
                <div className="tb-cal-weekdays">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => (
                    <span key={w} className="tb-cal-weekday">{w}</span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="tb-cal-days-grid">
                  {/* Empty cells padding for first day */}
                  {Array.from({ length: getFirstDayOfMonth(calYear, calMonth) }).map((_, i) => (
                    <div key={`empty-${i}`} className="tb-cal-day-cell empty"></div>
                  ))}

                  {/* Day cells */}
                  {Array.from({ length: getDaysInMonth(calYear, calMonth) }).map((_, i) => {
                    const dayNum = i + 1;
                    const dayFormatted = String(dayNum).padStart(2, '0');
                    const isSelected =
                      dateOfJourney === `${dayFormatted} ${MONTH_SHORT[calMonth]}, ${calYear}` ||
                      dateOfJourney === `${dayNum} ${MONTH_SHORT[calMonth]}, ${calYear}`;

                    return (
                      <button
                        key={dayNum}
                        type="button"
                        className={`tb-cal-day-cell ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectDate(dayNum)}
                      >
                        <span className="tb-cal-day-number">{dayNum}</span>
                        {isSelected && <span className="tb-cal-selected-indicator"></span>}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Date Pills inside the Calendar */}
                <div className="tb-cal-footer">
                  <button
                    type="button"
                    className="tb-cal-quick-action"
                    onClick={() => {
                      setCalMonth(9);
                      setCalYear(2026);
                      handleSelectDate(14, 9, 2026);
                    }}
                  >
                    Today (14 Oct)
                  </button>
                  <button
                    type="button"
                    className="tb-cal-quick-action"
                    onClick={() => {
                      setCalMonth(9);
                      setCalYear(2026);
                      handleSelectDate(15, 9, 2026);
                    }}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    className="tb-cal-quick-action"
                    onClick={() => {
                      setCalMonth(9);
                      setCalYear(2026);
                      handleSelectDate(16, 9, 2026);
                    }}
                  >
                    Day After
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Red Circular Search Button */}
          <button className="tb-search-action-btn" onClick={() => { }} title="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        {/* Mode Tabs: 1st Bike, 2nd Auto, 3rd Car, 4th Bus, 5th Train */}
        <div className="tb-mode-tabs">
          <button
            className={`tb-mode-tab ${activeMode === 'bike' ? 'active' : ''}`}
            onClick={() => handleModeChange('bike')}
          >
            <i className="fa-solid fa-motorcycle"></i> Bike
          </button>
          <button
            className={`tb-mode-tab ${activeMode === 'auto' ? 'active' : ''}`}
            onClick={() => handleModeChange('auto')}
          >
            <i className="fa-solid fa-taxi"></i> Auto
          </button>
          <button
            className={`tb-mode-tab ${activeMode === 'car' ? 'active' : ''}`}
            onClick={() => handleModeChange('car')}
          >
            <i className="fa-solid fa-car"></i> Car
          </button>
          <button
            className={`tb-mode-tab ${activeMode === 'bus' ? 'active' : ''}`}
            onClick={() => handleModeChange('bus')}
          >
            <i className="fa-solid fa-bus"></i> Bus
          </button>
          <button
            className={`tb-mode-tab ${activeMode === 'train' ? 'active' : ''}`}
            onClick={() => handleModeChange('train')}
          >
            <i className="fa-solid fa-train"></i> Train
          </button>
          <button
            className={`tb-mode-tab ${activeMode === 'flight' ? 'active' : ''}`}
            onClick={() => handleModeChange('flight')}
          >
            <i className="fa-solid fa-plane"></i> Flight
          </button>
        </div>
      </div>

      {activeMode === 'bus' && (
        <BusBookingView
          source={getCleanPlaceName(source)}
          destination={getCleanPlaceName(destination)}
          dateOfJourney={dateOfJourney}
          onDateChange={(newDate) => {
            setDateOfJourney(newDate);
            const d = newDate.split(' ')[0].replace(/^0+/, '');
            setSelectedDay(d);
          }}
        />
      )}

      {activeMode === 'train' && (
        <div className="tb-main-grid">
          {/* Left Filter Results Sidebar */}
          <aside className="tb-filter-sidebar">
            <h3 className="tb-filter-title">Filter results</h3>

            {/* Quick Filter Chips (2x2) */}
            <div className="tb-quick-chips-grid">
              <button
                className={`tb-quick-chip ${filterAvailable ? 'active' : ''}`}
                onClick={() => setFilterAvailable(!filterAvailable)}
              >
                <i className="fa-solid fa-ticket"></i> Available
              </button>
              <button
                className={`tb-quick-chip ${filterAC ? 'active' : ''}`}
                onClick={() => setFilterAC(!filterAC)}
              >
                <i className="fa-solid fa-snowflake"></i> AC
              </button>
              <button
                className={`tb-quick-chip ${filterTatkal ? 'active' : ''}`}
                onClick={() => setFilterTatkal(!filterTatkal)}
              >
                <i className="fa-solid fa-train"></i> Tatkal
              </button>
              <button
                className={`tb-quick-chip ${filterAltTrip ? 'active' : ''}`}
                onClick={() => setFilterAltTrip(!filterAltTrip)}
              >
                <i className="fa-solid fa-arrow-right-arrow-left"></i> Alternate Trip
              </button>
            </div>

            {/* Accordions */}
            <div className="tb-filter-accordions">
              {/* Availability */}
              <div className="tb-accordion-item">
                <div className={`tb-accordion-header ${openAccordions.availability ? 'open' : ''}`} onClick={() => toggleAccordion('availability')}>
                  <span>Availability</span>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
                {openAccordions.availability && (
                  <div className="tb-accordion-body">
                    <label className="tb-filter-checkbox-label">
                      <input type="checkbox" checked={filterAvailable} onChange={(e) => setFilterAvailable(e.target.checked)} />
                      Confirmed Available Only
                    </label>
                    <label className="tb-filter-checkbox-label">
                      <input type="checkbox" /> RAC (Reservation Against Cancellation)
                    </label>
                    <label className="tb-filter-checkbox-label">
                      <input type="checkbox" /> Waitlist (WL / PQWL / GNWL)
                    </label>
                  </div>
                )}
              </div>

              {/* Ticket class */}
              <div className="tb-accordion-item">
                <div className={`tb-accordion-header ${openAccordions.ticketClass ? 'open' : ''}`} onClick={() => toggleAccordion('ticketClass')}>
                  <span>Ticket class</span>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
                {openAccordions.ticketClass && (
                  <div className="tb-accordion-body">
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> 1A (AC First Class)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> 2A (AC 2-Tier)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> 3A (AC 3-Tier)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> 3E (AC 3 Economy)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> SL (Sleeper Class)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> CC (AC Chair Car)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> 2S (Second Sitting)</label>
                  </div>
                )}
              </div>

              {/* Quota */}
              <div className="tb-accordion-item">
                <div className={`tb-accordion-header ${openAccordions.quota ? 'open' : ''}`} onClick={() => toggleAccordion('quota')}>
                  <span>Quota</span>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
                {openAccordions.quota && (
                  <div className="tb-accordion-body">
                    <label className="tb-filter-checkbox-label"><input type="radio" name="quota" defaultChecked /> General Quota</label>
                    <label className="tb-filter-checkbox-label"><input type="radio" name="quota" /> Tatkal Quota</label>
                    <label className="tb-filter-checkbox-label"><input type="radio" name="quota" /> Ladies Quota</label>
                    <label className="tb-filter-checkbox-label"><input type="radio" name="quota" /> Senior Citizen / Lower Berth</label>
                  </div>
                )}
              </div>

              {/* Departure time range */}
              <div className="tb-accordion-item">
                <div className={`tb-accordion-header ${openAccordions.departureTime ? 'open' : ''}`} onClick={() => toggleAccordion('departureTime')}>
                  <span>Departure time range</span>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
                {openAccordions.departureTime && (
                  <div className="tb-accordion-body">
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> Early Morning (00:00 - 06:00)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> Morning (06:00 - 12:00)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> Afternoon (12:00 - 18:00)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> Night (18:00 - 24:00)</label>
                  </div>
                )}
              </div>

              {/* Arrival time range */}
              <div className="tb-accordion-item">
                <div className={`tb-accordion-header ${openAccordions.arrivalTime ? 'open' : ''}`} onClick={() => toggleAccordion('arrivalTime')}>
                  <span>Arrival time range</span>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
                {openAccordions.arrivalTime && (
                  <div className="tb-accordion-body">
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> Morning (06:00 - 12:00)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> Afternoon (12:00 - 18:00)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> Night (18:00 - 24:00)</label>
                  </div>
                )}
              </div>

              {/* Departing Stations */}
              <div className="tb-accordion-item">
                <div className={`tb-accordion-header ${openAccordions.departingStations ? 'open' : ''}`} onClick={() => toggleAccordion('departingStations')}>
                  <span>Departing Stations</span>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
                {openAccordions.departingStations && (
                  <div className="tb-accordion-body">
                    <label className="tb-filter-checkbox-label"><input type="checkbox" defaultChecked /> Mgr Chennai Ctl (MAS)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> Chennai Egmore (MS)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> Tambaram (TBM)</label>
                  </div>
                )}
              </div>

              {/* Arriving Stations */}
              <div className="tb-accordion-item">
                <div className={`tb-accordion-header ${openAccordions.arrivingStations ? 'open' : ''}`} onClick={() => toggleAccordion('arrivingStations')}>
                  <span>Arriving Stations</span>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
                {openAccordions.arrivingStations && (
                  <div className="tb-accordion-body">
                    <label className="tb-filter-checkbox-label"><input type="checkbox" defaultChecked /> Katpadi Jn (KPD)</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> Vellore Cantt (VLR)</label>
                  </div>
                )}
              </div>

              {/* Alternate Trip */}
              <div className="tb-accordion-item">
                <div className={`tb-accordion-header ${openAccordions.alternateTrip ? 'open' : ''}`} onClick={() => toggleAccordion('alternateTrip')}>
                  <span>Alternate Trip</span>
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
                {openAccordions.alternateTrip && (
                  <div className="tb-accordion-body">
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> Connecting Trains Via AJJ</label>
                    <label className="tb-filter-checkbox-label"><input type="checkbox" /> Same-day Bus Return</label>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right Main Results Area */}
          <main className="tb-results-area">
            {/* Calendar Dates Strip */}
            <div className="tb-date-strip-container">
              <span className="tb-month-label">OCT</span>
              <div className="tb-dates-scroll">
                {dateList.map((item) => (
                  <div
                    key={item.num}
                    className={`tb-date-card ${selectedDay === item.num ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDay(item.num);
                      setDateOfJourney(`${item.num} Oct, 2026`);
                    }}
                  >
                    {item.badge ? (
                      <div className={`tb-demand-badge ${item.badgeColor || 'red'}`}>{item.badge}</div>
                    ) : (
                      <div className={`tb-date-pip ${item.pip === 'orange' ? 'tb-pip-orange' : 'tb-pip-green'}`}></div>
                    )}
                    <span className="tb-date-num">{item.num}</span>
                    <span className="tb-date-day">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Header (Count + Sorting) */}
            <div className="tb-results-header">
              <span className="tb-trains-count">65 {activeMode === 'train' ? 'Trains' : 'Buses'}</span>

              <div className="tb-sort-group">
                <span className="tb-sort-label">Sort By:</span>
                {(['Default', 'Availability', 'Duration', 'Departure', 'Arrival'] as const).map(option => (
                  <button
                    key={option}
                    className={`tb-sort-btn ${sortBy === option ? 'active' : ''}`}
                    onClick={() => setSortBy(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Free Cancellation Banner */}
            <div className="tb-free-cancel-banner">
              <div className="tb-free-cancel-left">
                <div className="tb-cancel-icon-circle">
                  <i className="fa-solid fa-indian-rupee-sign"></i>
                </div>
                <div>
                  <h4 className="tb-cancel-title">Free Cancellation</h4>
                  <p className="tb-cancel-subtitle">₹0 cancellation fee...</p>
                </div>
              </div>

              <label className="tb-toggle-switch">
                <input
                  type="checkbox"
                  checked={freeCancel}
                  onChange={(e) => setFreeCancel(e.target.checked)}
                />
                <span className="tb-toggle-slider"></span>
              </label>
            </div>

            {/* Train Cards List */}
            {displayedTrains.map((train) => (
              <div key={train.id} className="tb-train-card">
                {/* Card Top Row: Number, Name, Running Days */}
                <div className="tb-card-top-row">
                  <div className="tb-train-title-area">
                    <span className="tb-train-number-link" onClick={() => setViewRouteTrain(train)}>
                      {train.number}
                    </span>
                    <span className="tb-train-name">{train.name}</span>
                  </div>

                  <div className="tb-running-days">{train.runningDays}</div>
                </div>

                {/* Schedule Row */}
                <div className="tb-schedule-row">
                  {/* Departure */}
                  <div className="tb-station-point">
                    <span className="tb-time">{train.departureTime}</span>
                    <span className="tb-station-name">{train.departureStation}</span>
                    {train.departureTags && train.departureTags.length > 0 ? (
                      <div className="tb-station-tags-row">
                        {train.departureTags.map((tag, tIdx) => (
                          <span key={tIdx} className="tb-station-tag">{tag}</span>
                        ))}
                      </div>
                    ) : train.departureTag ? (
                      <span className="tb-station-tag">{train.departureTag}</span>
                    ) : null}
                  </div>

                  {/* Duration */}
                  <div className="tb-duration-middle">
                    <span>— {train.duration} —</span>
                  </div>

                  {/* Arrival */}
                  <div className="tb-station-point">
                    <span className="tb-time">{train.arrivalTime}</span>
                    <span className="tb-station-name">{train.arrivalStation}</span>
                    {train.arrivalTag && (
                      <span className="tb-station-tag">{train.arrivalTag}</span>
                    )}
                  </div>

                  {/* View Route Button */}
                  <button
                    className="tb-view-route-btn"
                    onClick={() => setViewRouteTrain(train)}
                  >
                    <i className="fa-solid fa-map-location-dot"></i> View Route
                  </button>
                </div>

                {/* Classes Container with scrollable row and floating arrow */}
                <div className="tb-classes-container">
                  <div
                    className="tb-classes-scrollable-row"
                    ref={(el) => { classScrollRefs.current[train.id] = el; }}
                  >
                    {train.classes.map((cls, idx) => (
                      <div
                        key={`${cls.code}-${idx}`}
                        className="tb-class-card-wrapper"
                        onClick={() => {
                          setBookingClassModal({ train, classOption: cls });
                          setBookingConfirmed(false);
                        }}
                      >
                        {cls.isTatkal && (
                          <div className="tb-tatkal-badge">Tatkal</div>
                        )}
                        <div className={`tb-class-card ${cls.statusType === 'wl' ? 'tb-class-card-wl' : ''}`}>
                          <div className={`tb-class-header ${cls.statusType === 'wl' ? 'tb-header-wl' : 'tb-header-avail'}`}>
                            <span className="tb-class-code">{cls.code}</span>
                            <span className="tb-class-fare">₹{cls.fare.toLocaleString('en-IN')}</span>
                          </div>

                          <div className={`tb-class-status-box ${cls.statusType === 'available' ? 'tb-status-available' : cls.statusType === 'wl' ? 'tb-status-wl' : cls.statusType === 'update' ? 'tb-status-update' : 'tb-status-regret'}`}>
                            {cls.statusType === 'update' ? (
                              <div className="tb-update-content">
                                <i className="fa-solid fa-arrows-rotate tb-rotate-icon"></i>
                                <span>Tap to update</span>
                              </div>
                            ) : (
                              cls.status
                            )}
                          </div>
                        </div>

                        <span className="tb-updated-time">{cls.updated}</span>
                      </div>
                    ))}
                  </div>

                  {/* The Arrow Button: click to scroll classes and view more related to this train */}
                  <button
                    type="button"
                    className={`tb-class-scroll-arrow-btn ${expandedTrainId === train.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Smooth scroll classes container
                      const container = classScrollRefs.current[train.id];
                      if (container) {
                        const maxScroll = container.scrollWidth - container.clientWidth;
                        if (container.scrollLeft >= maxScroll - 10) {
                          container.scrollTo({ left: 0, behavior: 'smooth' });
                        } else {
                          container.scrollBy({ left: 220, behavior: 'smooth' });
                        }
                      }
                      // Toggle expanded train details drawer
                      setExpandedTrainId(prev => prev === train.id ? null : train.id);
                    }}
                    title={expandedTrainId === train.id ? "Close train details" : "View more details for this train"}
                  >
                    <i className={`fa-solid ${expandedTrainId === train.id ? 'fa-chevron-up' : 'fa-chevron-right'}`}></i>
                  </button>
                </div>

                {/* Expanded Train Details Drawer when arrow is clicked */}
                {expandedTrainId === train.id && (
                  <div className="tb-expanded-train-drawer">
                    <div className="tb-drawer-header">
                      <div className="tb-drawer-title">
                        <i className="fa-solid fa-train"></i>
                        <span>Live Train Insights: <strong>{train.name} ({train.number})</strong></span>
                      </div>
                      <div className="tb-drawer-badges">
                        {train.punctuality && (
                          <span className="tb-info-chip green">
                            <i className="fa-solid fa-clock"></i> {train.punctuality}
                          </span>
                        )}
                        {train.avgSpeed && (
                          <span className="tb-info-chip blue">
                            <i className="fa-solid fa-gauge-high"></i> Avg Speed: {train.avgSpeed}
                          </span>
                        )}
                        {train.distance && (
                          <span className="tb-info-chip purple">
                            <i className="fa-solid fa-route"></i> Distance: {train.distance}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Coach Layout Visual Track */}
                    {train.coaches && train.coaches.length > 0 && (
                      <div className="tb-coaches-section">
                        <div className="tb-section-subhead">
                          <span>Coach Composition & Position:</span>
                          <span className="tb-subhead-hint">Engine to Guard (Click any class above to book)</span>
                        </div>
                        <div className="tb-coaches-track">
                          {train.coaches.map((coach, cIdx) => (
                            <div key={cIdx} className={`tb-coach-block coach-${coach.type}`}>
                              <span className="tb-coach-code">{coach.code}</span>
                              <span className="tb-coach-name">{coach.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Halts & On-board Amenities Grid */}
                    <div className="tb-drawer-grid">
                      <div className="tb-drawer-col">
                        <div className="tb-section-subhead">
                          <i className="fa-solid fa-list-check"></i> Key Halts & Timings:
                        </div>
                        <div className="tb-halts-preview-list">
                          {train.stops.slice(0, 5).map((st, sIdx) => (
                            <div key={sIdx} className="tb-halt-row">
                              <span className="tb-halt-station">{st.station} ({st.code})</span>
                              <span className="tb-halt-timing">Arr: {st.arr} | Dep: {st.dep}</span>
                              <span className="tb-halt-duration">{st.halt}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="tb-drawer-col">
                        <div className="tb-section-subhead">
                          <i className="fa-solid fa-bell-concierge"></i> Amenities & Quota Rules:
                        </div>
                        <div className="tb-amenities-tags">
                          <span className="tb-amenity-tag"><i className="fa-solid fa-utensils"></i> {train.pantryAvailable ? 'Pantry Car & E-Catering' : 'Station Catering'}</span>
                          <span className="tb-amenity-tag"><i className="fa-solid fa-plug"></i> Charging Sockets Available</span>
                          <span className="tb-amenity-tag"><i className="fa-solid fa-shield-halved"></i> Bio-Toilets Fitted</span>
                          <span className="tb-amenity-tag"><i className="fa-solid fa-ticket"></i> Tatkal Quota: Opens 10:00 AM (AC) / 11:00 AM (Non-AC)</span>
                          <span className="tb-amenity-tag"><i className="fa-solid fa-rotate-left"></i> Free Cancellation with ₹0 Deductions</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </main>
        </div>
      )}

      {/* ---------------- Bike / Auto / Car On-Demand Ride Views ---------------- */}
      {(activeMode === 'bike' || activeMode === 'auto' || activeMode === 'car') && (
        <div className="tb-ride-cab-container" style={{ marginTop: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className={`fa-solid ${activeMode === 'bike' ? 'fa-motorcycle' : activeMode === 'auto' ? 'fa-taxi' : 'fa-car'}`} style={{ color: '#dc2626' }}></i>
                  Available {activeMode === 'bike' ? 'Bike Taxi' : activeMode === 'auto' ? 'Auto Rickshaws' : 'Cabs & Cars'} Near You
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Pickup from <strong>{source.split('-')[0].trim()}</strong> • Drop to <strong>{destination.split('-')[0].trim()}</strong>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', background: '#dcfce7', color: '#16a34a', padding: '6px 12px', borderRadius: '20px', fontWeight: 700 }}>
                  <i className="fa-solid fa-circle-check"></i> High Captain Availability
                </span>
              </div>
            </div>

            {/* Ride Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {activeMode === 'bike' && [
                { id: 'b1', name: 'Rapido Bike Taxi', eta: '2 mins', fare: 45, rating: 4.8, trips: '1.2k', desc: 'Fastest commute through traffic • Helmet provided', icon: 'fa-motorcycle', tag: 'Fastest' },
                { id: 'b2', name: 'Electric EV Bike', eta: '4 mins', fare: 39, rating: 4.9, trips: '850', desc: '100% Green Electric • Quiet & smooth ride', icon: 'fa-bolt', tag: 'Eco Friendly' },
                { id: 'b3', name: 'Express Bike Priority', eta: '1 min', fare: 55, rating: 4.8, trips: '2.4k', desc: 'Top verified captain • Direct priority pickup', icon: 'fa-fire', tag: 'Popular' }
              ].map(ride => (
                <div
                  key={ride.id}
                  onClick={() => setSelectedRideId(ride.id)}
                  style={{
                    border: selectedRideId === ride.id ? '2px solid #dc2626' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px',
                    cursor: 'pointer',
                    background: selectedRideId === ride.id ? '#fef2f2' : '#ffffff',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedRideId === ride.id ? '0 6px 16px rgba(220, 38, 38, 0.12)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                        <i className={`fa-solid ${ride.icon}`}></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{ride.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>ETA: <strong style={{ color: '#16a34a' }}>{ride.eta}</strong> • ★ {ride.rating}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>₹{ride.fare}</div>
                      <span style={{ fontSize: '10px', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{ride.tag}</span>
                    </div>
                  </div>
                  <p style={{ margin: '10px 0 12px 0', fontSize: '12px', color: '#64748b' }}>{ride.desc}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRideBookedModal({ ...ride, type: 'Bike Taxi', captain: 'Vikram Singh', plate: 'TN 02 BY 4120', otp: '4821' });
                    }}
                    style={{ width: '100%', padding: '10px', background: selectedRideId === ride.id ? '#dc2626' : '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                  >
                    Book This Bike
                  </button>
                </div>
              ))}

              {activeMode === 'auto' && [
                { id: 'a1', name: 'Auto Standard', eta: '3 mins', fare: 75, rating: 4.7, trips: '3.4k', desc: 'Meter standard fare • Up to 3 passengers', icon: 'fa-taxi', tag: 'Affordable' },
                { id: 'a2', name: 'Electric E-Rickshaw', eta: '5 mins', fare: 65, rating: 4.8, trips: '1.2k', desc: 'Zero emissions • Silent & comfortable', icon: 'fa-charging-station', tag: 'Eco Green' },
                { id: 'a3', name: 'Auto Prime Comfort', eta: '2 mins', fare: 95, rating: 4.9, trips: '2.8k', desc: 'Spacious 4-seater • Top-rated driver', icon: 'fa-star', tag: 'Top Rated' }
              ].map(ride => (
                <div
                  key={ride.id}
                  onClick={() => setSelectedRideId(ride.id)}
                  style={{
                    border: selectedRideId === ride.id ? '2px solid #dc2626' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px',
                    cursor: 'pointer',
                    background: selectedRideId === ride.id ? '#fef2f2' : '#ffffff',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedRideId === ride.id ? '0 6px 16px rgba(220, 38, 38, 0.12)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                        <i className={`fa-solid ${ride.icon}`}></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{ride.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>ETA: <strong style={{ color: '#16a34a' }}>{ride.eta}</strong> • ★ {ride.rating}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>₹{ride.fare}</div>
                      <span style={{ fontSize: '10px', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{ride.tag}</span>
                    </div>
                  </div>
                  <p style={{ margin: '10px 0 12px 0', fontSize: '12px', color: '#64748b' }}>{ride.desc}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRideBookedModal({ ...ride, type: 'Auto Rickshaw', captain: 'Ramesh Babu', plate: 'TN 05 AT 9821', otp: '3914' });
                    }}
                    style={{ width: '100%', padding: '10px', background: selectedRideId === ride.id ? '#dc2626' : '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                  >
                    Book This Auto
                  </button>
                </div>
              ))}

              {activeMode === 'car' && [
                { id: 'c1', name: 'Go Mini (AC)', eta: '3 mins', fare: 149, rating: 4.7, trips: '5.8k', desc: 'Compact hatchback • Economical everyday rides', icon: 'fa-car', tag: 'Economical' },
                { id: 'c2', name: 'Prime Sedan', eta: '4 mins', fare: 199, rating: 4.9, trips: '6.2k', desc: 'Spacious AC sedan • Top-rated drivers & Wi-Fi', icon: 'fa-car-side', tag: 'Most Popular' },
                { id: 'c3', name: 'Prime SUV (6 Seater)', eta: '5 mins', fare: 299, rating: 4.8, trips: '3.1k', desc: 'Spacious SUV • Extra legroom & large luggage trunk', icon: 'fa-truck-pickup', tag: 'Extra Space' },
                { id: 'c4', name: 'Outstation Intercity Cab', eta: '15 mins', fare: 1450, rating: 4.9, trips: '940', desc: 'One-way / Round trip • Dedicated chauffeur & toll included', icon: 'fa-route', tag: 'Intercity' }
              ].map(ride => (
                <div
                  key={ride.id}
                  onClick={() => setSelectedRideId(ride.id)}
                  style={{
                    border: selectedRideId === ride.id ? '2px solid #dc2626' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '18px',
                    cursor: 'pointer',
                    background: selectedRideId === ride.id ? '#fef2f2' : '#ffffff',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedRideId === ride.id ? '0 6px 16px rgba(220, 38, 38, 0.12)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                        <i className={`fa-solid ${ride.icon}`}></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{ride.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>ETA: <strong style={{ color: '#16a34a' }}>{ride.eta}</strong> • ★ {ride.rating}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>₹{ride.fare}</div>
                      <span style={{ fontSize: '10px', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{ride.tag}</span>
                    </div>
                  </div>
                  <p style={{ margin: '10px 0 12px 0', fontSize: '12px', color: '#64748b' }}>{ride.desc}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRideBookedModal({ ...ride, type: 'Car / Cab', captain: 'Suresh Kumar', plate: 'TN 01 CB 7741', otp: '5192' });
                    }}
                    style={{ width: '100%', padding: '10px', background: selectedRideId === ride.id ? '#dc2626' : '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                  >
                    Book This Car
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Flight Booking View ---------------- */}
      {activeMode === 'flight' && (
        <div className="tb-flight-view-container" style={{ marginTop: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-plane" style={{ color: '#0284c7' }}></i>
                  18 Flights Available • {source.split('-')[0].trim()} to {destination.split('-')[0].trim()}
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Departure date: <strong>{dateOfJourney}</strong> • Non-stop and connecting flights
                </p>
              </div>
              <span style={{ fontSize: '12px', background: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: '20px', fontWeight: 700 }}>
                ✈ Lowest fares guaranteed
              </span>
            </div>

            {/* Flights List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { id: 'fl-1', airline: 'IndiGo', flightNo: '6E 214', dep: '06:00', arr: '07:25', dur: '1h 25m', type: 'Non-stop', fare: 3850, bags: '15kg check-in • 7kg cabin', color: '#0045a5' },
                { id: 'fl-2', airline: 'Air India', flightNo: 'AI 542', dep: '09:30', arr: '10:50', dur: '1h 20m', type: 'Non-stop', fare: 4120, bags: '20kg check-in • 7kg cabin • Free Meal', color: '#dc2626' },
                { id: 'fl-3', airline: 'Akasa Air', flightNo: 'QP 1308', dep: '13:15', arr: '14:40', dur: '1h 25m', type: 'Non-stop', fare: 3690, bags: '15kg check-in • 7kg cabin • USB Port', color: '#ea580c' },
                { id: 'fl-4', airline: 'Vistara', flightNo: 'UK 832', dep: '17:45', arr: '19:10', dur: '1h 25m', type: 'Non-stop', fare: 5200, bags: '25kg check-in • Gourmet Dining', color: '#6b21a8' }
              ].map(flight => (
                <div key={flight.id} style={{ border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', background: '#fafafa', transition: 'all 0.2s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '180px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'white', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: flight.color }}>
                      <i className="fa-solid fa-plane"></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>{flight.airline}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{flight.flightNo} • {flight.bags}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{flight.dep}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{source.split('-')[0].trim()}</div>
                    </div>
                    <div style={{ minWidth: '80px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{flight.dur}</span>
                      <div style={{ height: '2px', background: '#cbd5e1', margin: '4px 0' }}></div>
                      <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 700 }}>{flight.type}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{flight.arr}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{destination.split('-')[0].trim()}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '140px' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>₹{flight.fare.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>Per Adult (taxes incl.)</div>
                    <button
                      onClick={() => setRideBookedModal({
                        name: `${flight.airline} (${flight.flightNo})`,
                        type: 'Flight Ticket',
                        eta: flight.dep,
                        captain: `Seat 12A • Gate 4`,
                        plate: flight.flightNo,
                        otp: `${Math.floor(1000 + Math.random() * 9000)}`,
                        fare: flight.fare
                      })}
                      style={{ padding: '8px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
                    >
                      Book Flight
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ride Booking Confirmation Modal */}
      {rideBookedModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '480px', width: '100%', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '20px 24px', background: '#dc2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Ride Confirmed!</h3>
                <span style={{ fontSize: '13px', color: '#fee2e2' }}>Captain is arriving in {rideBookedModal.eta}</span>
              </div>
              <button onClick={() => setRideBookedModal(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>Captain Name:</span>
                  <strong style={{ color: '#0f172a' }}>{rideBookedModal.captain}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>Vehicle Plate:</span>
                  <strong style={{ color: '#0f172a' }}>{rideBookedModal.plate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>Start OTP:</span>
                  <strong style={{ color: '#dc2626', fontSize: '18px', letterSpacing: '2px' }}>{rideBookedModal.otp}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '8px' }}>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>Total Fare:</span>
                  <strong style={{ color: '#16a34a', fontSize: '18px' }}>₹{rideBookedModal.fare}</strong>
                </div>
              </div>
              <button
                onClick={() => setRideBookedModal(null)}
                style={{ width: '100%', padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- View Route Modal ---------------- */}
      {viewRouteTrain && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '600px', width: '100%', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '20px 24px', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{viewRouteTrain.number} - {viewRouteTrain.name}</h3>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Train Schedule & Halt Details</span>
              </div>
              <button onClick={() => setViewRouteTrain(null)} style={{ background: 'none', border: 'none', color: '#cbd5e1', fontSize: '20px', cursor: 'pointer' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '20px 24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '8px 4px' }}>Station</th>
                    <th style={{ padding: '8px 4px' }}>Arr</th>
                    <th style={{ padding: '8px 4px' }}>Dep</th>
                    <th style={{ padding: '8px 4px' }}>Halt</th>
                  </tr>
                </thead>
                <tbody>
                  {viewRouteTrain.stops.map((st, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 4px', fontWeight: 700, color: '#0f172a' }}>
                        {st.station} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>({st.code})</span>
                      </td>
                      <td style={{ padding: '10px 4px', color: '#475569' }}>{st.arr}</td>
                      <td style={{ padding: '10px 4px', color: '#475569' }}>{st.dep}</td>
                      <td style={{ padding: '10px 4px', color: '#0284c7', fontWeight: 600 }}>{st.halt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setViewRouteTrain(null)}
                style={{ padding: '8px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
              >
                Close Route
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Booking Ticket Confirmation Modal ---------------- */}
      {bookingClassModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '520px', width: '100%', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '20px 24px', background: '#dc2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Book Ticket: {bookingClassModal.train.name}</h3>
                <span style={{ fontSize: '13px', color: '#fee2e2' }}>Class: {bookingClassModal.classOption.code} • Fare: ₹{bookingClassModal.classOption.fare}</span>
              </div>
              <button onClick={() => setBookingClassModal(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {bookingConfirmed ? (
              <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px auto' }}>
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Ticket Confirmed!</h3>
                <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '14px' }}>
                  Your ticket for <strong>{bookingClassModal.train.name} ({bookingClassModal.classOption.code})</strong> has been booked for {passengerName}.
                </p>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#64748b' }}>Journey:</span>
                    <span style={{ fontWeight: 700 }}>{source.split('-')[0].trim()} <i className="fa-solid fa-arrow-right"></i> {destination.split('-')[0].trim()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ color: '#64748b' }}>Date:</span>
                    <span style={{ fontWeight: 700 }}>{dateOfJourney}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#64748b' }}>Status:</span>
                    <span style={{ fontWeight: 700, color: '#16a34a' }}>CNF / Coach S3, 24</span>
                  </div>
                </div>

                <button
                  onClick={() => setBookingClassModal(null)}
                  style={{ width: '100%', padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Passenger Name</label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Age</label>
                    <input
                      type="number"
                      value={passengerAge}
                      onChange={(e) => setPassengerAge(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Berth Preference</label>
                    <select
                      value={passengerBerth}
                      onChange={(e) => setPassengerBerth(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', background: 'white' }}
                    >
                      <option>No Preference</option>
                      <option>Lower Berth</option>
                      <option>Middle Berth</option>
                      <option>Upper Berth</option>
                      <option>Side Lower</option>
                      <option>Side Upper</option>
                    </select>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Base Fare:</span>
                    <span style={{ fontWeight: 700 }}>₹{bookingClassModal.classOption.fare}</span>
                  </div>
                  {freeCancel && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                      <span style={{ color: '#64748b' }}>Free Cancellation Opt-in:</span>
                      <span style={{ fontWeight: 700 }}>₹50</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, borderTop: '1px dashed #cbd5e1', paddingTop: '8px', color: '#0f172a' }}>
                    <span>Total Payable:</span>
                    <span>₹{bookingClassModal.classOption.fare + (freeCancel ? 50 : 0)}</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmTicketBooking}
                  style={{ width: '100%', padding: '14px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <i className="fa-solid fa-lock"></i> Pay & Confirm Ticket
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
