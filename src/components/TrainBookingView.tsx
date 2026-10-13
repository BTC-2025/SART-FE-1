'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './TrainBookingView.css';
import BusBookingView from './BusBookingView';
import RideBookingView from './RideBookingView';
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

const INDIAN_STATIONS = POPULAR_CITIES;

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

// Curated authentic trains operating on major Indian railway corridors
const EXPANDED_CORRIDOR_TRAINS: TrainItem[] = [
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
function getCorridorTrains(src: string, dest: string): TrainItem[] {
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
  const { setActiveTab, setActiveRideMode } = useSartStore();

  // Navigation & Mode - single source of truth initialized from path
  const [activeMode, setActiveMode] = useState<RideMode>(() => getRideModeFromPath(pathname));
  const [isLoadingMode, setIsLoadingMode] = useState<boolean>(false);
  const activeReqIdRef = useRef<number>(0);

  // Sync mode with pathname changes immediately
  useEffect(() => {
    const currentPathMode = getRideModeFromPath(pathname);
    if (currentPathMode !== activeMode) {
      setActiveMode(currentPathMode);
      setActiveRideMode(currentPathMode);
    }
  }, [pathname, setActiveRideMode]);

  // Synchronize activeMode with browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const mode = getRideModeFromPath(window.location.pathname);
        setActiveMode(mode);
        setActiveRideMode(mode);
        setIsLoadingMode(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setActiveRideMode]);

  // Mode change handler: updates UI tab immediately, shows skeleton loader, updates URL consistently
  const handleModeChange = (mode: RideMode) => {
    if (mode === activeMode && !isLoadingMode) return;

    // 1. Immediately update active tab highlight
    setActiveMode(mode);
    setActiveRideMode(mode);
    setRideBookingStep('select_service');
    if (mode === 'bike') setSelectedRideService('bike');
    if (mode === 'auto') setSelectedRideService('auto');
    if (mode === 'car') setSelectedRideService('cab_economy');

    // 2. Consistent URL navigation: /home/ride/[mode]
    const targetUrl = `/home/ride/${mode}`;
    if (typeof window !== 'undefined') {
      window.history.pushState({ mode }, '', targetUrl);
    }
    router.push(targetUrl);

    // 3. Show loading transition state & cancel stale responses
    const reqId = ++activeReqIdRef.current;
    setIsLoadingMode(true);

    // Simulate clean data fetch / view render cycle with stale check
    setTimeout(() => {
      if (reqId === activeReqIdRef.current) {
        setIsLoadingMode(false);
      }
    }, 180);
  };

  // Cab / Quick Ride State for Bike, Auto, Car
  const [selectedRideService, setSelectedRideService] = useState<'bike' | 'auto' | 'cab_economy' | 'cab_premium' | 'cab_xl'>('bike');
  const [rideBookingStep, setRideBookingStep] = useState<'select_service' | 'map_confirm'>('select_service');
  const [rideBookedModal, setRideBookedModal] = useState<any | null>(null);

  // Bike specific stops & vehicles state
  const [bikePickup, setBikePickup] = useState('41EB, Thiruvallam, Tamil Nadu 632515, India');
  const [bikeDestination, setBikeDestination] = useState('Central Square, Anna Salai, Chennai, Tamil Nadu 600002');
  const [bikeStops, setBikeStops] = useState<BikeStopItem[]>([
    { id: 'stop-1', name: '41EB, Thiruvallam, Tamil Nadu 632515', purpose: 'Quick halt & parcel drop' }
  ]);
  const [newStopName, setNewStopName] = useState('');
  const [newStopPurpose, setNewStopPurpose] = useState('');
  const [showAddStopForm, setShowAddStopForm] = useState(false);
  const [selectedBikeType, setSelectedBikeType] = useState<'scooty' | 'bike'>('scooty');
  const [activeMapPinTarget, setActiveMapPinTarget] = useState<'pickup' | 'stop' | 'destination' | null>(null);
  const [showBikeRoutePopup, setShowBikeRoutePopup] = useState(false);

  // Unified Station / Place Name Formatter (Consistent across all modes)
  const formatStationName = (name: string) => {
    return name.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim();
  };

  const [source, setSource] = useState('Chennai');
  const [destination, setDestination] = useState('Vijayawada');
  const [dateOfJourney, setDateOfJourney] = useState('14 Oct, 2026');
  const [selectedDay, setSelectedDay] = useState('14');

  // Calendar Picker & Dropdown Refs
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [calMonth, setCalMonth] = useState(9); // 0-indexed: 9 = October
  const [calYear, setCalYear] = useState(2026);
  const calendarRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

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

  // Close calendar popup & dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendarPicker(false);
      }
      if (sourceRef.current && !sourceRef.current.contains(e.target as Node)) {
        setShowSourceDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
  const [sourceOnlineResults, setSourceOnlineResults] = useState<CityLocation[]>([]);
  const [destOnlineResults, setDestOnlineResults] = useState<CityLocation[]>([]);
  const [isSearchingSource, setIsSearchingSource] = useState(false);
  const [isSearchingDest, setIsSearchingDest] = useState(false);

  // Debounced online map search for source location
  useEffect(() => {
    const q = formatStationName(source).trim();
    if (!q || q.length < 2) {
      setSourceOnlineResults([]);
      setIsSearchingSource(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingSource(true);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=in&limit=6&addressdetails=1`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped: CityLocation[] = data.map((item: any) => {
              const placeName = item.name || item.display_name?.split(',')[0]?.trim() || q;
              const stateName = item.address?.state || item.address?.county || 'India';
              return {
                name: placeName,
                state: stateName,
                isOnlineResult: true
              };
            });
            const unique = mapped.filter(m => !POPULAR_CITIES.some(p => p.name.toLowerCase() === m.name.toLowerCase()));
            setSourceOnlineResults(unique);
          }
        }
      } catch (err) {
        // Fallback silently if offline or blocked
      } finally {
        setIsSearchingSource(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [source]);

  // Debounced online map search for destination location
  useEffect(() => {
    const q = formatStationName(destination).trim();
    if (!q || q.length < 2) {
      setDestOnlineResults([]);
      setIsSearchingDest(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingDest(true);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=in&limit=6&addressdetails=1`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped: CityLocation[] = data.map((item: any) => {
              const placeName = item.name || item.display_name?.split(',')[0]?.trim() || q;
              const stateName = item.address?.state || item.address?.county || 'India';
              return {
                name: placeName,
                state: stateName,
                isOnlineResult: true
              };
            });
            const unique = mapped.filter(m => !POPULAR_CITIES.some(p => p.name.toLowerCase() === m.name.toLowerCase()));
            setDestOnlineResults(unique);
          }
        }
      } catch (err) {
        // Fallback silently
      } finally {
        setIsSearchingDest(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [destination]);

  // Sorting state
  const [sortBy, setSortBy] = useState<'Default' | 'Availability' | 'Duration' | 'Departure' | 'Arrival'>('Default');

  // Quick filters
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterAC, setFilterAC] = useState(false);
  const [filterTatkal, setFilterTatkal] = useState(false);
  const [filterAltTrip, setFilterAltTrip] = useState(false);

  // Detailed Filter Accordion States
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedQuota, setSelectedQuota] = useState<'general' | 'tatkal' | 'ladies' | 'senior'>('general');
  const [selectedDepTimeRanges, setSelectedDepTimeRanges] = useState<string[]>([]);
  const [selectedArrTimeRanges, setSelectedArrTimeRanges] = useState<string[]>([]);
  const [selectedDepStations, setSelectedDepStations] = useState<string[]>([]);
  const [selectedArrStations, setSelectedArrStations] = useState<string[]>([]);

  // Free cancellation toggle
  const [freeCancel, setFreeCancel] = useState(false);

  // Accordion open/close states (default open first 3 for great UX)
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    availability: true,
    ticketClass: true,
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

  // Dynamic station lists available for current corridor
  const corridorTrains = React.useMemo(() => {
    return getCorridorTrains(source, destination);
  }, [source, destination]);

  const availableDepartingStations = React.useMemo(() => {
    const map = new Map<string, string>();
    corridorTrains.forEach(t => {
      map.set(t.departureStation, t.departureStationCode);
    });
    return Array.from(map.entries()).map(([name, code]) => ({ name, code }));
  }, [corridorTrains]);

  const availableArrivingStations = React.useMemo(() => {
    const map = new Map<string, string>();
    corridorTrains.forEach(t => {
      map.set(t.arrivalStation, t.arrivalStationCode);
    });
    return Array.from(map.entries()).map(([name, code]) => ({ name, code }));
  }, [corridorTrains]);

  // Helper to parse time string like '07:25 AM' or '21:10' into minutes from midnight
  const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const clean = timeStr.trim().toUpperCase();
    const isPM = clean.includes('PM');
    const isAM = clean.includes('AM');
    const parts = clean.replace(/[APM]/g, '').trim().split(':');
    let hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const matchesTimeRange = (timeStr: string, rangeKey: string): boolean => {
    const mins = parseTimeToMinutes(timeStr);
    switch (rangeKey) {
      case 'early_morning': // 00:00 - 06:00
        return mins >= 0 && mins < 6 * 60;
      case 'morning': // 06:00 - 12:00
        return mins >= 6 * 60 && mins < 12 * 60;
      case 'afternoon': // 12:00 - 18:00
        return mins >= 12 * 60 && mins < 18 * 60;
      case 'night': // 18:00 - 24:00
        return mins >= 18 * 60 && mins <= 24 * 60;
      default:
        return true;
    }
  };

  // Filtered & Sorted Trains
  let displayedTrains = [...corridorTrains];

  // 1. Quick Filters & Tatkal
  if (filterAvailable) {
    displayedTrains = displayedTrains.filter(t => t.classes.some(c => c.statusType === 'available'));
  }
  if (filterAC) {
    displayedTrains = displayedTrains.filter(t => t.classes.some(c => ['1A', '2A', '3A', '3E', 'CC', 'EC'].includes(c.code)));
  }
  if (filterTatkal || selectedQuota === 'tatkal') {
    displayedTrains = displayedTrains.filter(t => t.classes.some(c => c.isTatkal));
  }
  if (filterAltTrip) {
    // Show trains with connecting stops or alternate halts
    displayedTrains = displayedTrains.filter(t => t.stops && t.stops.length > 3);
  }

  // 2. Ticket Class Filter
  if (selectedClasses.length > 0) {
    displayedTrains = displayedTrains.filter(t => t.classes.some(c => selectedClasses.includes(c.code)));
  }

  // 3. Availability Accordion Filter
  if (selectedAvailability.length > 0) {
    displayedTrains = displayedTrains.filter(t => {
      return t.classes.some(c => {
        if (selectedAvailability.includes('available') && c.statusType === 'available') return true;
        if (selectedAvailability.includes('rac') && (c.status.toUpperCase().includes('RAC') || c.statusType === 'update')) return true;
        if (selectedAvailability.includes('wl') && (c.statusType === 'wl' || c.status.toUpperCase().includes('WL'))) return true;
        return false;
      });
    });
  }

  // 4. Departure Time Filter
  if (selectedDepTimeRanges.length > 0) {
    displayedTrains = displayedTrains.filter(t => {
      return selectedDepTimeRanges.some(r => matchesTimeRange(t.departureTime, r));
    });
  }

  // 5. Arrival Time Filter
  if (selectedArrTimeRanges.length > 0) {
    displayedTrains = displayedTrains.filter(t => {
      return selectedArrTimeRanges.some(r => matchesTimeRange(t.arrivalTime, r));
    });
  }

  // 6. Departing Stations Filter
  if (selectedDepStations.length > 0) {
    displayedTrains = displayedTrains.filter(t => {
      return selectedDepStations.includes(t.departureStation) || selectedDepStations.includes(t.departureStationCode);
    });
  }

  // 7. Arriving Stations Filter
  if (selectedArrStations.length > 0) {
    displayedTrains = displayedTrains.filter(t => {
      return selectedArrStations.includes(t.arrivalStation) || selectedArrStations.includes(t.arrivalStationCode);
    });
  }

  // Sorting
  if (sortBy === 'Duration') {
    displayedTrains.sort((a, b) => a.duration.localeCompare(b.duration));
  } else if (sortBy === 'Departure') {
    displayedTrains.sort((a, b) => parseTimeToMinutes(a.departureTime) - parseTimeToMinutes(b.departureTime));
  } else if (sortBy === 'Arrival') {
    displayedTrains.sort((a, b) => parseTimeToMinutes(a.arrivalTime) - parseTimeToMinutes(b.arrivalTime));
  } else if (sortBy === 'Availability') {
    displayedTrains.sort((a, b) => {
      const aAvail = a.classes.filter(c => c.statusType === 'available').length;
      const bAvail = b.classes.filter(c => c.statusType === 'available').length;
      return bAvail - aAvail;
    });
  }

  // Clear all filters handler
  const handleClearAllFilters = () => {
    setFilterAvailable(false);
    setFilterAC(false);
    setFilterTatkal(false);
    setFilterAltTrip(false);
    setSelectedAvailability([]);
    setSelectedClasses([]);
    setSelectedQuota('general');
    setSelectedDepTimeRanges([]);
    setSelectedArrTimeRanges([]);
    setSelectedDepStations([]);
    setSelectedArrStations([]);
  };

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
            <span>{formatStationName(source)}</span>
            <i className="fa-solid fa-arrow-right" style={{ fontSize: '13px', color: '#64748b' }}></i>
            <span>{formatStationName(destination)}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
            {activeMode === 'bus' ? 'Buses available' :
              activeMode === 'train' ? `${displayedTrains.length} ${displayedTrains.length === 1 ? 'train' : 'trains'} running on this route` :
                activeMode === 'flight' ? 'Flights available' :
                  'Instant ride captains nearby'}
          </div>
        </div>
      </div>

      {/* ---------------- 1. Top Search Bar ---------------- */}
      <div className="tb-search-card">
        <div className="tb-search-row">
          {/* Source Input */}
          <div className="tb-search-field" ref={sourceRef}>
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
                value={formatStationName(source)}
                onChange={(e) => { setSource(e.target.value); setShowSourceDropdown(true); }}
                onFocus={() => setShowSourceDropdown(true)}
                placeholder="From Station / Location"
              />
            </div>

            {showSourceDropdown && (
              <div className="tb-suggestions-popup">
                <div className="tb-suggestions-header">
                  <span>Popular Cities</span>
                  <i className="fa-solid fa-city" style={{ color: '#94a3b8' }}></i>
                </div>
                {POPULAR_CITIES.filter(city => {
                  const q = formatStationName(source).trim().toLowerCase();
                  if (!q) return true;
                  return city.name.toLowerCase().includes(q) || city.state.toLowerCase().includes(q);
                }).map(city => (
                  <div
                    key={city.name}
                    className="tb-city-suggestion-item"
                    onClick={() => {
                      setSource(city.name);
                      setShowSourceDropdown(false);
                    }}
                  >
                    <div className="tb-city-icon-wrap">
                      <i className="fa-solid fa-city"></i>
                    </div>
                    <div className="tb-city-text-wrap">
                      <span className="tb-city-main-name">{city.name}</span>
                      <span className="tb-city-sub-name">{city.state}</span>
                    </div>
                  </div>
                ))}

                {isSearchingSource && (
                  <div className="tb-searching-indicator">
                    <i className="fa-solid fa-spinner fa-spin" style={{ color: '#2563eb' }}></i>
                    <span>Finding places on map...</span>
                  </div>
                )}

                {sourceOnlineResults.length > 0 && (
                  <>
                    <div className="tb-suggestions-header tb-suggestions-header-online">
                      <span>Online Map Places</span>
                      <i className="fa-solid fa-map-location-dot"></i>
                    </div>
                    {sourceOnlineResults.map((place, pIdx) => (
                      <div
                        key={`src-online-${pIdx}`}
                        className="tb-city-suggestion-item"
                        onClick={() => {
                          setSource(place.name);
                          setShowSourceDropdown(false);
                        }}
                      >
                        <div className="tb-city-icon-wrap" style={{ color: '#2563eb' }}>
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div className="tb-city-text-wrap">
                          <span className="tb-city-main-name">{place.name}</span>
                          <span className="tb-city-sub-name">{place.state}</span>
                        </div>
                        <span className="tb-online-map-tag">
                          <i className="fa-solid fa-earth-asia"></i> Map
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <button className="tb-swap-btn" onClick={handleSwapStations} title="Swap Stations">
            <i className="fa-solid fa-arrow-right-arrow-left"></i>
          </button>

          {/* Destination Input */}
          <div className="tb-search-field" ref={destRef}>
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
                value={formatStationName(destination)}
                onChange={(e) => { setDestination(e.target.value); setShowDestDropdown(true); }}
                onFocus={() => setShowDestDropdown(true)}
                onKeyDown={(e) => { if (e.key === 'Enter') setShowDestDropdown(false); }}
                placeholder="To Station / Location"
              />
            </div>

            {showDestDropdown && (
              <div className="tb-suggestions-popup">
                <div className="tb-suggestions-header">
                  <span>Popular Cities</span>
                  <i className="fa-solid fa-city" style={{ color: '#94a3b8' }}></i>
                </div>
                {POPULAR_CITIES.filter(city => {
                  const q = formatStationName(destination).trim().toLowerCase();
                  if (!q) return true;
                  return city.name.toLowerCase().includes(q) || city.state.toLowerCase().includes(q);
                }).map(city => (
                  <div
                    key={city.name}
                    className="tb-city-suggestion-item"
                    onClick={() => {
                      setDestination(city.name);
                      setShowDestDropdown(false);
                    }}
                  >
                    <div className="tb-city-icon-wrap">
                      <i className="fa-solid fa-city"></i>
                    </div>
                    <div className="tb-city-text-wrap">
                      <span className="tb-city-main-name">{city.name}</span>
                      <span className="tb-city-sub-name">{city.state}</span>
                    </div>
                  </div>
                ))}

                {isSearchingDest && (
                  <div className="tb-searching-indicator">
                    <i className="fa-solid fa-spinner fa-spin" style={{ color: '#2563eb' }}></i>
                    <span>Finding places on map...</span>
                  </div>
                )}

                {destOnlineResults.length > 0 && (
                  <>
                    <div className="tb-suggestions-header tb-suggestions-header-online">
                      <span>Online Map Places</span>
                      <i className="fa-solid fa-map-location-dot"></i>
                    </div>
                    {destOnlineResults.map((place, pIdx) => (
                      <div
                        key={`dst-online-${pIdx}`}
                        className="tb-city-suggestion-item"
                        onClick={() => {
                          setDestination(place.name);
                          setShowDestDropdown(false);
                        }}
                      >
                        <div className="tb-city-icon-wrap" style={{ color: '#2563eb' }}>
                          <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div className="tb-city-text-wrap">
                          <span className="tb-city-main-name">{place.name}</span>
                          <span className="tb-city-sub-name">{place.state}</span>
                        </div>
                        <span className="tb-online-map-tag">
                          <i className="fa-solid fa-earth-asia"></i> Map
                        </span>
                      </div>
                    ))}
                  </>
                )}
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

      {/* ---------------- Mode Loading Skeleton State (Prevents showing stale previous content) ---------------- */}
      {isLoadingMode ? (
        <div className="tb-mode-skeleton-container">
          <div className="tb-skeleton-pulse tb-skeleton-banner"></div>
          <div className="tb-skeleton-grid">
            <div className="tb-skeleton-pulse tb-skeleton-sidebar"></div>
            <div className="tb-skeleton-cards-col">
              <div className="tb-skeleton-pulse tb-skeleton-card"></div>
              <div className="tb-skeleton-pulse tb-skeleton-card"></div>
              <div className="tb-skeleton-pulse tb-skeleton-card"></div>
            </div>
          </div>
        </div>
      ) : activeMode === 'bus' ? (
        <BusBookingView
          source={formatStationName(source)}
          destination={formatStationName(destination)}
          dateOfJourney={dateOfJourney}
          onDateChange={(newDate) => {
            setDateOfJourney(newDate);
            const d = newDate.split(' ')[0].replace(/^0+/, '');
            setSelectedDay(d);
          }}
        />
      ) : activeMode === 'train' ? (
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
                      <input
                        type="checkbox"
                        checked={filterAvailable || selectedAvailability.includes('available')}
                        onChange={(e) => {
                          setFilterAvailable(e.target.checked);
                          setSelectedAvailability(prev =>
                            e.target.checked ? [...prev.filter(x => x !== 'available'), 'available'] : prev.filter(x => x !== 'available')
                          );
                        }}
                      />
                      Confirmed Available Only
                    </label>
                    <label className="tb-filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes('rac')}
                        onChange={(e) => {
                          setSelectedAvailability(prev =>
                            e.target.checked ? [...prev, 'rac'] : prev.filter(x => x !== 'rac')
                          );
                        }}
                      />
                      RAC (Reservation Against Cancellation)
                    </label>
                    <label className="tb-filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes('wl')}
                        onChange={(e) => {
                          setSelectedAvailability(prev =>
                            e.target.checked ? [...prev, 'wl'] : prev.filter(x => x !== 'wl')
                          );
                        }}
                      />
                      Waitlist (WL / PQWL / GNWL)
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
                    {[
                      { code: '1A', label: '1A (AC First Class)' },
                      { code: '2A', label: '2A (AC 2-Tier)' },
                      { code: '3A', label: '3A (AC 3-Tier)' },
                      { code: '3E', label: '3E (AC 3 Economy)' },
                      { code: 'SL', label: 'SL (Sleeper Class)' },
                      { code: 'CC', label: 'CC (AC Chair Car)' },
                      { code: '2S', label: '2S (Second Sitting)' }
                    ].map(cls => (
                      <label key={cls.code} className="tb-filter-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedClasses.includes(cls.code)}
                          onChange={(e) => {
                            setSelectedClasses(prev =>
                              e.target.checked ? [...prev, cls.code] : prev.filter(x => x !== cls.code)
                            );
                          }}
                        />
                        {cls.label}
                      </label>
                    ))}
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
                    {[
                      { key: 'general', label: 'General Quota' },
                      { key: 'tatkal', label: 'Tatkal Quota' },
                      { key: 'ladies', label: 'Ladies Quota' },
                      { key: 'senior', label: 'Senior Citizen / Lower Berth' }
                    ].map(q => (
                      <label key={q.key} className="tb-filter-checkbox-label">
                        <input
                          type="radio"
                          name="quota"
                          checked={selectedQuota === q.key}
                          onChange={() => {
                            setSelectedQuota(q.key as any);
                            if (q.key === 'tatkal') setFilterTatkal(true);
                            else setFilterTatkal(false);
                          }}
                        />
                        {q.label}
                      </label>
                    ))}
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
                    {[
                      { key: 'early_morning', label: 'Early Morning (00:00 - 06:00)' },
                      { key: 'morning', label: 'Morning (06:00 - 12:00)' },
                      { key: 'afternoon', label: 'Afternoon (12:00 - 18:00)' },
                      { key: 'night', label: 'Night (18:00 - 24:00)' }
                    ].map(t => (
                      <label key={t.key} className="tb-filter-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedDepTimeRanges.includes(t.key)}
                          onChange={(e) => {
                            setSelectedDepTimeRanges(prev =>
                              e.target.checked ? [...prev, t.key] : prev.filter(x => x !== t.key)
                            );
                          }}
                        />
                        {t.label}
                      </label>
                    ))}
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
                    {[
                      { key: 'early_morning', label: 'Early Morning (00:00 - 06:00)' },
                      { key: 'morning', label: 'Morning (06:00 - 12:00)' },
                      { key: 'afternoon', label: 'Afternoon (12:00 - 18:00)' },
                      { key: 'night', label: 'Night (18:00 - 24:00)' }
                    ].map(t => (
                      <label key={t.key} className="tb-filter-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedArrTimeRanges.includes(t.key)}
                          onChange={(e) => {
                            setSelectedArrTimeRanges(prev =>
                              e.target.checked ? [...prev, t.key] : prev.filter(x => x !== t.key)
                            );
                          }}
                        />
                        {t.label}
                      </label>
                    ))}
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
                    {availableDepartingStations.length > 0 ? (
                      availableDepartingStations.map(st => (
                        <label key={st.name} className="tb-filter-checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedDepStations.includes(st.name) || selectedDepStations.includes(st.code)}
                            onChange={(e) => {
                              setSelectedDepStations(prev =>
                                e.target.checked
                                  ? [...prev, st.name, st.code]
                                  : prev.filter(x => x !== st.name && x !== st.code)
                              );
                            }}
                          />
                          {st.name} ({st.code})
                        </label>
                      ))
                    ) : (
                      <span style={{ fontSize: '12px', color: '#64748b' }}>No stations available</span>
                    )}
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
                    {availableArrivingStations.length > 0 ? (
                      availableArrivingStations.map(st => (
                        <label key={st.name} className="tb-filter-checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedArrStations.includes(st.name) || selectedArrStations.includes(st.code)}
                            onChange={(e) => {
                              setSelectedArrStations(prev =>
                                e.target.checked
                                  ? [...prev, st.name, st.code]
                                  : prev.filter(x => x !== st.name && x !== st.code)
                              );
                            }}
                          />
                          {st.name} ({st.code})
                        </label>
                      ))
                    ) : (
                      <span style={{ fontSize: '12px', color: '#64748b' }}>No stations available</span>
                    )}
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
                    <label className="tb-filter-checkbox-label">
                      <input
                        type="checkbox"
                        checked={filterAltTrip}
                        onChange={(e) => setFilterAltTrip(e.target.checked)}
                      />
                      Connecting Trains & Stops
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Clear Filters Button */}
            {(filterAvailable || filterAC || filterTatkal || filterAltTrip || selectedClasses.length > 0 || selectedAvailability.length > 0 || selectedDepTimeRanges.length > 0 || selectedArrTimeRanges.length > 0 || selectedDepStations.length > 0 || selectedArrStations.length > 0 || selectedQuota !== 'general') && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                style={{
                  marginTop: '16px',
                  width: '100%',
                  padding: '10px 14px',
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className="fa-solid fa-rotate-left"></i> Reset All Filters
              </button>
            )}
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
              <span className="tb-trains-count">
                {displayedTrains.length} {displayedTrains.length === 1 ? 'Train' : 'Trains'}
              </span>

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

            {/* Empty State when no trains match filters */}
            {displayedTrains.length === 0 ? (
              <div
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  border: '1px dashed #cbd5e1',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  marginTop: '16px'
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    color: '#64748b',
                    margin: '0 auto 16px auto'
                  }}
                >
                  <i className="fa-solid fa-train"></i>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                  No trains found matching your filters
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '420px', margin: '0 auto 20px auto' }}>
                  Try relaxing your departure time, ticket classes, or availability filters to see available trains on this corridor.
                </p>
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  style={{
                    padding: '10px 24px',
                    background: '#2563eb',
                    color: 'white',
                    fontWeight: 700,
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : null}

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
                    }}
                    title="View more classes"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </main>
        </div>
      ) : null}

      {/* ---------------- Bike / Auto / Car Unified On-Demand Ride View ---------------- */}
      {(activeMode === 'bike' || activeMode === 'auto' || activeMode === 'car') ? (
        <RideBookingView
          mode={activeMode as 'bike' | 'auto' | 'car'}
          onBackToHome={() => {
            setActiveTab('home');
            if (typeof window !== 'undefined') {
              window.history.pushState(null, '', '/home');
            }
            router.push('/home');
          }}
        />
      ) : null}
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
