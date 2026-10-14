export interface TrainClassOption {
  code: string;
  fare: number;
  status: string;
  statusType: 'available' | 'wl' | 'regret' | 'update';
  updated: string;
  isTatkal?: boolean;
}

export interface TrainItem {
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

export interface BikeStopItem {
  id: string;
  name: string;
  purpose: string;
  coords?: { x: number; y: number };
}

export interface CityLocation {
  name: string;
  state: string;
  code?: string;
  isOnlineResult?: boolean;
}

export const POPULAR_CITIES: CityLocation[] = [
  { name: 'Hyderabad', state: 'Telangana', code: 'HYD' },
  { name: 'Bengaluru', state: 'Karnataka', code: 'BLR' },
  { name: 'Chennai', state: 'Tamil Nadu', code: 'MAS' },
  { name: 'Goa', state: 'Goa', code: 'GOA' },
  { name: 'Vijayawada', state: 'Andhra Pradesh', code: 'BZA' },
  { name: 'Nellore', state: 'Andhra Pradesh', code: 'NLR' },
  { name: 'Tirupati', state: 'Andhra Pradesh', code: 'TPTY' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', code: 'VSKP' },
  { name: 'Coimbatore', state: 'Tamil Nadu', code: 'CBE' },
  { name: 'Madurai', state: 'Tamil Nadu', code: 'MDU' },
  { name: 'Pune', state: 'Maharashtra', code: 'PUNE' },
  { name: 'Mumbai', state: 'Maharashtra', code: 'MUM' },
  { name: 'Delhi', state: 'Delhi', code: 'DEL' },
  { name: 'Kochi', state: 'Kerala', code: 'KOC' },
  { name: 'Kurnool', state: 'Andhra Pradesh', code: 'KNL' },
  { name: 'Warangal', state: 'Telangana', code: 'WL' },
  { name: 'Guntur', state: 'Andhra Pradesh', code: 'GNT' },
  { name: 'Pondicherry', state: 'Puducherry', code: 'PDY' },
  { name: 'Mysore', state: 'Karnataka', code: 'MYS' },
  { name: 'Mangalore', state: 'Karnataka', code: 'MAQ' },
  { name: 'Salem', state: 'Tamil Nadu', code: 'SA' },
  { name: 'Trichy', state: 'Tamil Nadu', code: 'TRZ' },
  { name: 'Vellore', state: 'Tamil Nadu', code: 'VLR' },
  { name: 'Jaipur', state: 'Rajasthan', code: 'JP' },
  { name: 'Kolkata', state: 'West Bengal', code: 'HWH' }
];

export const INDIAN_STATIONS = POPULAR_CITIES;

export const INITIAL_TRAINS: TrainItem[] = [
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

// Curated authentic trains operating on major Indian railway corridors
export const EXPANDED_CORRIDOR_TRAINS: TrainItem[] = [
  // --- CHENNAI to VIJAYAWADA corridor trains ---
  {
    id: '12603',
    number: '12603',
    name: 'Chennai - Hyderabad SF Exp',
    runningDays: 'M T W T F S S',
    departureTime: '04:45 PM',
    departureStation: 'Mgr Chennai Ctl (MAS)',
    departureStationCode: 'MAS',
    departureTag: 'Starting station',
    duration: '06 h 15 min',
    arrivalTime: '11:00 PM',
    arrivalStation: 'Vijayawada Jn. (BZA)',
    arrivalStationCode: 'BZA',
    arrivalTag: '10 min halt',
    distance: '431 km',
    avgSpeed: '70 km/h',
    punctuality: '95% On Time',
    pantryAvailable: true,
    classes: [
      { code: 'SL', fare: 275, status: 'Available 38', statusType: 'available', updated: '20 mins ago' },
      { code: '3A', fare: 735, status: 'Available 14', statusType: 'available', updated: '1 hr ago' },
      { code: '2A', fare: 1045, status: 'Available 4', statusType: 'available', updated: '2 hr ago' },
      { code: '1A', fare: 1750, status: 'WL 2', statusType: 'wl', updated: '30 mins ago' },
    ],
    stops: [
      { station: 'Mgr Chennai Ctl', code: 'MAS', arr: '--', dep: '04:45 PM', halt: 'Starts' },
      { station: 'Sullurupeta', code: 'SPE', arr: '05:53 PM', dep: '05:55 PM', halt: '2 min' },
      { station: 'Gudur Jn', code: 'GDR', arr: '06:48 PM', dep: '06:50 PM', halt: '2 min' },
      { station: 'Nellore', code: 'NLR', arr: '07:23 PM', dep: '07:25 PM', halt: '2 min' },
      { station: 'Ongole', code: 'OGL', arr: '08:58 PM', dep: '09:00 PM', halt: '2 min' },
      { station: 'Tenali Jn', code: 'TEL', arr: '10:18 PM', dep: '10:20 PM', halt: '2 min' },
      { station: 'Vijayawada Jn', code: 'BZA', arr: '11:00 PM', dep: '11:10 PM', halt: '10 min' },
      { station: 'Hyderabad Deccan', code: 'HYB', arr: '05:45 AM', dep: '--', halt: 'Ends' }
    ]
  },
  {
    id: '12842',
    number: '12842',
    name: 'Coromandel Express',
    runningDays: 'M T W T F S S',
    departureTime: '07:00 AM',
    departureStation: 'Mgr Chennai Ctl (MAS)',
    departureStationCode: 'MAS',
    departureTag: 'Starting station',
    duration: '06 h 05 min',
    arrivalTime: '01:05 PM',
    arrivalStation: 'Vijayawada Jn. (BZA)',
    arrivalStationCode: 'BZA',
    arrivalTag: '10 min halt',
    distance: '431 km',
    avgSpeed: '72 km/h',
    punctuality: '92% On Time',
    pantryAvailable: true,
    classes: [
      { code: 'SL', fare: 275, status: 'Available 19', statusType: 'available', updated: '40 mins ago' },
      { code: '3A', fare: 735, status: 'Available 22', statusType: 'available', updated: '15 mins ago' },
      { code: '2A', fare: 1045, status: 'Available 8', statusType: 'available', updated: '1 hr ago' },
      { code: '1A', fare: 1750, status: 'Available 2', statusType: 'available', updated: '2 hr ago' },
    ],
    stops: [
      { station: 'Mgr Chennai Ctl', code: 'MAS', arr: '--', dep: '07:00 AM', halt: 'Starts' },
      { station: 'Nellore', code: 'NLR', arr: '09:18 AM', dep: '09:20 AM', halt: '2 min' },
      { station: 'Ongole', code: 'OGL', arr: '10:48 AM', dep: '10:50 AM', halt: '2 min' },
      { station: 'Vijayawada Jn', code: 'BZA', arr: '01:05 PM', dep: '01:15 PM', halt: '10 min' },
      { station: 'Visakhapatnam', code: 'VSKP', arr: '06:50 PM', dep: '07:10 PM', halt: '20 min' },
      { station: 'Howrah Jn', code: 'HWH', arr: '11:50 AM', dep: '--', halt: 'Ends' }
    ]
  },
  {
    id: '20677',
    number: '20677',
    name: 'Vande Bharat Express',
    runningDays: 'M T W T F S',
    departureTime: '05:30 AM',
    departureStation: 'Mgr Chennai Ctl (MAS)',
    departureStationCode: 'MAS',
    departureTag: 'Starting station',
    duration: '04 h 10 min',
    arrivalTime: '09:40 AM',
    arrivalStation: 'Vijayawada Jn. (BZA)',
    arrivalStationCode: 'BZA',
    arrivalTag: 'Starting point in AP',
    distance: '431 km',
    avgSpeed: '103 km/h',
    punctuality: '98% On Time',
    classes: [
      { code: 'CC', fare: 1140, status: 'Available 65', statusType: 'available', updated: '5 mins ago' },
      { code: 'EC', fare: 2190, status: 'Available 14', statusType: 'available', updated: '10 mins ago' },
    ],
    stops: [
      { station: 'Mgr Chennai Ctl', code: 'MAS', arr: '--', dep: '05:30 AM', halt: 'Starts' },
      { station: 'Nellore', code: 'NLR', arr: '07:28 AM', dep: '07:30 AM', halt: '2 min' },
      { station: 'Ongole', code: 'OGL', arr: '08:38 AM', dep: '08:40 AM', halt: '2 min' },
      { station: 'Tenali Jn', code: 'TEL', arr: '09:18 AM', dep: '09:20 AM', halt: '2 min' },
      { station: 'Vijayawada Jn', code: 'BZA', arr: '09:40 AM', dep: '--', halt: 'Ends' }
    ]
  },
  {
    id: '12759',
    number: '12759',
    name: 'Charminar SF Express',
    runningDays: 'M T W T F S S',
    departureTime: '06:10 PM',
    departureStation: 'Tambaram (TBM)',
    departureStationCode: 'TBM',
    departureTag: 'Originates at TBM',
    duration: '06 h 45 min',
    arrivalTime: '12:55 AM',
    arrivalStation: 'Vijayawada Jn. (BZA)',
    arrivalStationCode: 'BZA',
    arrivalTag: '10 min halt',
    distance: '455 km',
    avgSpeed: '68 km/h',
    punctuality: '94% On Time',
    pantryAvailable: true,
    classes: [
      { code: 'SL', fare: 285, status: 'Available 12', statusType: 'available', updated: '1 hr ago' },
      { code: '3A', fare: 750, status: 'Available 9', statusType: 'available', updated: '30 mins ago' },
      { code: '2A', fare: 1070, status: 'Available 3', statusType: 'available', updated: '45 mins ago' },
      { code: '1A', fare: 1790, status: 'Available 1', statusType: 'available', updated: '2 hr ago' }
    ],
    stops: [
      { station: 'Tambaram', code: 'TBM', arr: '--', dep: '06:10 PM', halt: 'Starts' },
      { station: 'Chennai Egmore', code: 'MS', arr: '06:40 PM', dep: '06:45 PM', halt: '5 min' },
      { station: 'Gudur Jn', code: 'GDR', arr: '09:03 PM', dep: '09:05 PM', halt: '2 min' },
      { station: 'Nellore', code: 'NLR', arr: '09:38 PM', dep: '09:40 PM', halt: '2 min' },
      { station: 'Ongole', code: 'OGL', arr: '11:08 PM', dep: '11:10 PM', halt: '2 min' },
      { station: 'Vijayawada Jn', code: 'BZA', arr: '12:55 AM', dep: '01:05 AM', halt: '10 min' },
      { station: 'Secunderabad', code: 'SC', arr: '07:15 AM', dep: '--', halt: 'Ends' }
    ]
  },
  {
    id: '12840',
    number: '12840',
    name: 'Howrah Mail',
    runningDays: 'M T W T F S S',
    departureTime: '11:45 PM',
    departureStation: 'Mgr Chennai Ctl (MAS)',
    departureStationCode: 'MAS',
    departureTag: 'Overnight Superfast',
    duration: '06 h 20 min',
    arrivalTime: '06:05 AM',
    arrivalStation: 'Vijayawada Jn. (BZA)',
    arrivalStationCode: 'BZA',
    arrivalTag: '15 min halt',
    distance: '431 km',
    avgSpeed: '69 km/h',
    punctuality: '93% On Time',
    pantryAvailable: true,
    classes: [
      { code: 'SL', fare: 275, status: 'Available 45', statusType: 'available', updated: '1 hr ago' },
      { code: '3A', fare: 735, status: 'Available 28', statusType: 'available', updated: '2 hr ago' },
      { code: '2A', fare: 1045, status: 'Available 6', statusType: 'available', updated: '15 mins ago' },
      { code: '2S', fare: 165, status: 'Available 85', statusType: 'available', updated: '10 mins ago' }
    ],
    stops: [
      { station: 'Mgr Chennai Ctl', code: 'MAS', arr: '--', dep: '11:45 PM', halt: 'Starts' },
      { station: 'Nellore', code: 'NLR', arr: '02:08 AM', dep: '02:10 AM', halt: '2 min' },
      { station: 'Ongole', code: 'OGL', arr: '03:48 AM', dep: '03:50 AM', halt: '2 min' },
      { station: 'Tenali Jn', code: 'TEL', arr: '05:18 AM', dep: '05:20 AM', halt: '2 min' },
      { station: 'Vijayawada Jn', code: 'BZA', arr: '06:05 AM', dep: '06:20 AM', halt: '15 min' }
    ]
  },
  {
    id: '12615',
    number: '12615',
    name: 'Grand Trunk Express',
    runningDays: 'M T W T F S S',
    departureTime: '06:40 PM',
    departureStation: 'Mgr Chennai Ctl (MAS)',
    departureStationCode: 'MAS',
    departureTag: 'Legendary Express',
    duration: '06 h 30 min',
    arrivalTime: '01:10 AM',
    arrivalStation: 'Vijayawada Jn. (BZA)',
    arrivalStationCode: 'BZA',
    arrivalTag: '10 min halt',
    distance: '431 km',
    avgSpeed: '67 km/h',
    punctuality: '96% On Time',
    pantryAvailable: true,
    classes: [
      { code: 'SL', fare: 275, status: 'Available 22', statusType: 'available', updated: '25 mins ago' },
      { code: '3A', fare: 735, status: 'Available 16', statusType: 'available', updated: '30 mins ago' },
      { code: '2A', fare: 1045, status: 'Available 5', statusType: 'available', updated: '1 hr ago' },
      { code: '1A', fare: 1750, status: 'Available 3', statusType: 'available', updated: '1 hr ago' }
    ],
    stops: [
      { station: 'Mgr Chennai Ctl', code: 'MAS', arr: '--', dep: '06:40 PM', halt: 'Starts' },
      { station: 'Gudur Jn', code: 'GDR', arr: '08:58 PM', dep: '09:00 PM', halt: '2 min' },
      { station: 'Nellore', code: 'NLR', arr: '09:33 PM', dep: '09:35 PM', halt: '2 min' },
      { station: 'Ongole', code: 'OGL', arr: '11:03 PM', dep: '11:05 PM', halt: '2 min' },
      { station: 'Vijayawada Jn', code: 'BZA', arr: '01:10 AM', dep: '01:20 AM', halt: '10 min' },
      { station: 'New Delhi', code: 'NDLS', arr: '06:30 AM', dep: '--', halt: 'Ends' }
    ]
  },
  {
    id: '12621',
    number: '12621',
    name: 'Tamil Nadu SF Express',
    runningDays: 'M T W T F S S',
    departureTime: '10:00 PM',
    departureStation: 'Mgr Chennai Ctl (MAS)',
    departureStationCode: 'MAS',
    departureTag: 'Premier Superfast',
    duration: '05 h 55 min',
    arrivalTime: '03:55 AM',
    arrivalStation: 'Vijayawada Jn. (BZA)',
    arrivalStationCode: 'BZA',
    arrivalTag: '10 min halt',
    distance: '431 km',
    avgSpeed: '74 km/h',
    punctuality: '97% On Time',
    pantryAvailable: true,
    classes: [
      { code: 'SL', fare: 285, status: 'Available 31', statusType: 'available', updated: '12 mins ago' },
      { code: '3A', fare: 750, status: 'Available 18', statusType: 'available', updated: '20 mins ago' },
      { code: '2A', fare: 1065, status: 'Available 7', statusType: 'available', updated: '45 mins ago' },
      { code: '1A', fare: 1780, status: 'Available 4', statusType: 'available', updated: '1 hr ago' }
    ],
    stops: [
      { station: 'Mgr Chennai Ctl', code: 'MAS', arr: '--', dep: '10:00 PM', halt: 'Starts' },
      { station: 'Vijayawada Jn', code: 'BZA', arr: '03:55 AM', dep: '04:05 AM', halt: '10 min' },
      { station: 'Warangal', code: 'WL', arr: '06:40 AM', dep: '06:42 AM', halt: '2 min' },
      { station: 'New Delhi', code: 'NDLS', arr: '06:30 AM', dep: '--', halt: 'Ends' }
    ]
  },
  {
    id: '12830',
    number: '12830',
    name: 'Chennai - Bhubaneswar SF Exp',
    runningDays: 'Th',
    departureTime: '09:00 PM',
    departureStation: 'Mgr Chennai Ctl (MAS)',
    departureStationCode: 'MAS',
    departureTag: 'Superfast Express',
    duration: '06 h 15 min',
    arrivalTime: '03:15 AM',
    arrivalStation: 'Vijayawada Jn. (BZA)',
    arrivalStationCode: 'BZA',
    arrivalTag: '10 min halt',
    distance: '431 km',
    avgSpeed: '69 km/h',
    punctuality: '91% On Time',
    pantryAvailable: true,
    classes: [
      { code: 'SL', fare: 275, status: 'Available 8', statusType: 'available', updated: '15 mins ago' },
      { code: '3A', fare: 735, status: 'Available 11', statusType: 'available', updated: '1 hr ago' },
      { code: '2A', fare: 1045, status: 'Available 2', statusType: 'available', updated: '2 hr ago' }
    ],
    stops: [
      { station: 'Mgr Chennai Ctl', code: 'MAS', arr: '--', dep: '09:00 PM', halt: 'Starts' },
      { station: 'Gudur Jn', code: 'GDR', arr: '11:13 PM', dep: '11:15 PM', halt: '2 min' },
      { station: 'Nellore', code: 'NLR', arr: '11:48 PM', dep: '11:50 PM', halt: '2 min' },
      { station: 'Vijayawada Jn', code: 'BZA', arr: '03:15 AM', dep: '03:25 AM', halt: '10 min' },
      { station: 'Bhubaneswar', code: 'BBS', arr: '05:55 PM', dep: '--', halt: 'Ends' }
    ]
  }
];

// Corridors lookup dictionary: finds trains traveling between origin and destination
export function getCorridorTrains(src: string, dest: string): TrainItem[] {
  const s = src.toLowerCase().trim();
  const d = dest.toLowerCase().trim();

  // 1. Chennai <-> Katpadi / Vellore / Bangalore route
  const isChennaiToVellore =
    (s.includes('chennai') || s.includes('mas') || s.includes('ms') || s.includes('perambur') || s.includes('tbm')) &&
    (d.includes('katpadi') || d.includes('vellore') || d.includes('kpd') || d.includes('vlr') || d.includes('bengaluru') || d.includes('bangalore') || d.includes('mys'));

  // 2. Chennai <-> Vijayawada / Andhra / Kolkata route
  const isChennaiToVijayawada =
    (s.includes('chennai') || s.includes('mas') || s.includes('ms') || s.includes('tbm')) &&
    (d.includes('vijayawada') || d.includes('bza') || d.includes('guntur') || d.includes('vizag') || d.includes('visakhapatnam') || d.includes('nellore') || d.includes('howrah'));

  if (isChennaiToVijayawada) {
    return EXPANDED_CORRIDOR_TRAINS;
  }
  if (isChennaiToVellore) {
    return INITIAL_TRAINS;
  }

  // Generic directional match: check if train stops cover src and dest in order
  const allKnown = [...INITIAL_TRAINS, ...EXPANDED_CORRIDOR_TRAINS];
  const matched = allKnown.filter(t => {
    const srcIndex = t.stops.findIndex(st => st.station.toLowerCase().includes(s) || st.code.toLowerCase().includes(s));
    const destIndex = t.stops.findIndex(st => st.station.toLowerCase().includes(d) || st.code.toLowerCase().includes(d));
    return srcIndex !== -1 && destIndex !== -1 && srcIndex < destIndex;
  });

  if (matched.length > 0) return matched;

  // Fallback: Dynamically generate tailored trains specifically running between src and dest
  const srcName = src.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim() || 'Origin';
  const destName = dest.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim() || 'Destination';
  const srcCode = src.slice(0, 3).toUpperCase();
  const destCode = dest.slice(0, 3).toUpperCase();

  return [
    {
      id: '12801',
      number: '12801',
      name: `${srcName} - ${destName} SF Express`,
      runningDays: 'M T W T F S S',
      departureTime: '06:30 AM',
      departureStation: `${srcName} Jn (${srcCode})`,
      departureStationCode: srcCode,
      departureTag: 'Daily Superfast',
      duration: '04 h 45 min',
      arrivalTime: '11:15 AM',
      arrivalStation: `${destName} Jn (${destCode})`,
      arrivalStationCode: destCode,
      arrivalTag: 'On Time record',
      distance: '340 km',
      avgSpeed: '72 km/h',
      punctuality: '95% On Time',
      pantryAvailable: true,
      classes: [
        { code: 'SL', fare: 245, status: 'Available 35', statusType: 'available', updated: '15 mins ago' },
        { code: '3A', fare: 650, status: 'Available 12', statusType: 'available', updated: '1 hr ago' },
        { code: '2A', fare: 920, status: 'Available 4', statusType: 'available', updated: '2 hr ago' },
        { code: '2S', fare: 140, status: 'Available 54', statusType: 'available', updated: '30 mins ago' },
      ],
      stops: [
        { station: `${srcName} Jn`, code: srcCode, arr: '--', dep: '06:30 AM', halt: 'Starts' },
        { station: 'Intermediate Halt 1', code: 'INT1', arr: '08:15 AM', dep: '08:17 AM', halt: '2 min' },
        { station: 'Intermediate Halt 2', code: 'INT2', arr: '09:40 AM', dep: '09:42 AM', halt: '2 min' },
        { station: `${destName} Jn`, code: destCode, arr: '11:15 AM', dep: '--', halt: 'Ends' }
      ]
    },
    {
      id: '20805',
      number: '20805',
      name: `Vande Bharat (${srcName} - ${destName})`,
      runningDays: 'M T W T F S',
      departureTime: '05:40 AM',
      departureStation: `${srcName} (${srcCode})`,
      departureStationCode: srcCode,
      departureTag: 'Fastest in route',
      duration: '03 h 30 min',
      arrivalTime: '09:10 AM',
      arrivalStation: `${destName} (${destCode})`,
      arrivalStationCode: destCode,
      arrivalTag: 'High Speed',
      distance: '340 km',
      avgSpeed: '97 km/h',
      punctuality: '99% On Time',
      classes: [
        { code: 'CC', fare: 980, status: 'Available 48', statusType: 'available', updated: '5 mins ago' },
        { code: 'EC', fare: 1890, status: 'Available 16', statusType: 'available', updated: '10 mins ago' }
      ],
      stops: [
        { station: srcName, code: srcCode, arr: '--', dep: '05:40 AM', halt: 'Starts' },
        { station: `${destName} Jn`, code: destCode, arr: '09:10 AM', dep: '--', halt: 'Ends' }
      ]
    },
    {
      id: '12803',
      number: '12803',
      name: `${destName} Mail Express`,
      runningDays: 'M T W T F S S',
      departureTime: '09:20 PM',
      departureStation: `${srcName} Jn (${srcCode})`,
      departureStationCode: srcCode,
      departureTag: 'Overnight Service',
      duration: '05 h 10 min',
      arrivalTime: '02:30 AM',
      arrivalStation: `${destName} (${destCode})`,
      arrivalStationCode: destCode,
      arrivalTag: 'Daily Mail',
      distance: '340 km',
      avgSpeed: '66 km/h',
      punctuality: '92% On Time',
      pantryAvailable: true,
      classes: [
        { code: 'SL', fare: 245, status: 'Available 18', statusType: 'available', updated: '40 mins ago' },
        { code: '3A', fare: 650, status: 'Available 8', statusType: 'available', updated: '1 hr ago' },
        { code: '2A', fare: 920, status: 'WL 3', statusType: 'wl', updated: '15 mins ago' },
        { code: '1A', fare: 1540, status: 'Available 2', statusType: 'available', updated: '2 hr ago' }
      ],
      stops: [
        { station: srcName, code: srcCode, arr: '--', dep: '09:20 PM', halt: 'Starts' },
        { station: `${destName} Jn`, code: destCode, arr: '02:30 AM', dep: '--', halt: 'Ends' }
      ]
    },
    {
      id: '12807',
      number: '12807',
      name: `${srcName} Intercity SF`,
      runningDays: 'M T W T F S S',
      departureTime: '03:15 PM',
      departureStation: `${srcName} (${srcCode})`,
      departureStationCode: srcCode,
      departureTag: 'Day Commuter',
      duration: '04 h 50 min',
      arrivalTime: '08:05 PM',
      arrivalStation: `${destName} (${destCode})`,
      arrivalStationCode: destCode,
      arrivalTag: 'Popular',
      distance: '340 km',
      avgSpeed: '70 km/h',
      punctuality: '96% On Time',
      classes: [
        { code: '2S', fare: 135, status: 'Available 92', statusType: 'available', updated: '10 mins ago' },
        { code: 'CC', fare: 480, status: 'Available 24', statusType: 'available', updated: '25 mins ago' }
      ],
      stops: [
        { station: srcName, code: srcCode, arr: '--', dep: '03:15 PM', halt: 'Starts' },
        { station: `${destName} Jn`, code: destCode, arr: '08:05 PM', dep: '--', halt: 'Ends' }
      ]
    }
  ];
}
