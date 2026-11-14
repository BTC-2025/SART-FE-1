'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './TrainBookingView.css';
import './trains/TrainRedRailStyles.css';
import BusBookingView from './BusBookingView';
import BikeBookingView from './BikeBookingView';
import AutoBookingView from './AutoBookingView';
import CarBookingView from './CarBookingView';
import FlightBookingView from './FlightBookingView';
import HelicopterBookingView from './helicopter/HelicopterBookingView';
import TrainPassengerDetailsModal from './TrainPassengerDetails';
import { useSartStore } from '@/store/useSartStore';

import {
  TrainClassOption,
  TrainItem,
  BikeStopItem,
  CityLocation,
  POPULAR_CITIES,
  INDIAN_STATIONS,
  INITIAL_TRAINS,
  EXPANDED_CORRIDOR_TRAINS,
  ALL_CHENNAI_BANGALORE_TRAINS,
  getCorridorTrains
} from './trainData';

import TrainSearchBar from './trains/TrainSearchBar';
import TrainFilterSidebar from './trains/TrainFilterSidebar';
import TrainCard from './trains/TrainCard';
import TrainRouteModal from './trains/TrainRouteModal';
import TrainAvailabilityCalendarModal from './trains/TrainAvailabilityCalendarModal';
import { TrainApi } from '@/apis/trainApi';

export type { TrainClassOption, TrainItem, BikeStopItem, CityLocation };
export { POPULAR_CITIES, INDIAN_STATIONS, INITIAL_TRAINS, EXPANDED_CORRIDOR_TRAINS, ALL_CHENNAI_BANGALORE_TRAINS, getCorridorTrains };

export type RideMode = 'bike' | 'auto' | 'car' | 'bus' | 'train' | 'flight' | 'helicopter';

export function getRideModeFromPath(urlPath?: string, fallbackMode?: RideMode): RideMode {
  if (typeof window !== 'undefined') {
    const sp = new URLSearchParams(window.location.search);
    const m = (sp.get('mode') || sp.get('vehicle'))?.toLowerCase();
    if (m === 'helicopter' || m === 'heli' || m === 'chopper') return 'helicopter';
    if (m === 'flight' || m === 'filght') return 'flight';
    if (m === 'bus') return 'bus';
    if (m === 'train') return 'train';
    if (m === 'car' || m === 'cab') return 'car';
    if (m === 'auto') return 'auto';
    if (m === 'bike' || m === 'bick') return 'bike';
  }

  const p = typeof window !== 'undefined' && window.location.pathname ? window.location.pathname : urlPath || '';
  const lower = p.toLowerCase();

  if (/(?:^|\/)helicopter(?:\/|$|\?)/.test(lower) || /(?:^|\/)heli(?:\/|$|\?)/.test(lower) || /(?:^|\/)chopper(?:\/|$|\?)/.test(lower)) return 'helicopter';
  if (/(?:^|\/)bus(?:\/|$|\?)/.test(lower)) return 'bus';
  if (/(?:^|\/)flight(?:\/|$|\?)/.test(lower) || /(?:^|\/)filght(?:\/|$|\?)/.test(lower)) return 'flight';
  if (/(?:^|\/)car(?:\/|$|\?)/.test(lower) || /(?:^|\/)cab(?:\/|$|\?)/.test(lower)) return 'car';
  if (/(?:^|\/)auto(?:\/|$|\?)/.test(lower)) return 'auto';
  if (/(?:^|\/)bike(?:\/|$|\?)/.test(lower) || /(?:^|\/)bick(?:\/|$|\?)/.test(lower)) return 'bike';
  if (/(?:^|\/)train(?:\/|$|\?)/.test(lower)) return 'train';

  if (fallbackMode) return fallbackMode;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('sart_active_ride_mode') as RideMode;
    if (['bike', 'auto', 'car', 'bus', 'train', 'flight', 'helicopter'].includes(stored)) {
      return stored;
    }
  }
  return 'bike';
}

export const INITIAL_MODE_ORDER: { id: RideMode; label: string; icon: string }[] = [
  { id: 'bike', label: 'Bike', icon: 'fa-motorcycle' },
  { id: 'auto', label: 'Auto', icon: 'fa-taxi' },
  { id: 'car', label: 'Car', icon: 'fa-car' },
  { id: 'bus', label: 'Bus', icon: 'fa-bus' },
  { id: 'train', label: 'Train', icon: 'fa-train' },
  { id: 'flight', label: 'Flight', icon: 'fa-plane' },
  { id: 'helicopter', label: 'Helicopter', icon: 'fa-helicopter' }
];

export default function TrainBookingView() {
  const pathname = usePathname();
  const router = useRouter();
  const { setActiveTab, setActiveRideMode, activeRideMode: storeMode } = useSartStore();

  const [activeMode, setActiveMode] = useState<RideMode>(() => getRideModeFromPath(pathname, (storeMode as RideMode) || undefined));
  const [isLoadingMode, setIsLoadingMode] = useState<boolean>(false);
  const activeReqIdRef = useRef<number>(0);

  const [showOtherRidesDropdown, setShowOtherRidesDropdown] = useState<boolean>(false);
  const otherRidesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentPathMode = getRideModeFromPath(pathname, (storeMode as RideMode) || undefined);
    if (currentPathMode !== activeMode) {
      setActiveMode(currentPathMode);
      setActiveRideMode(currentPathMode);
    }
  }, [pathname, activeMode, setActiveRideMode, storeMode]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (otherRidesRef.current && !otherRidesRef.current.contains(e.target as Node)) {
        setShowOtherRidesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModeChange = (mode: RideMode) => {
    if (mode === activeMode && !isLoadingMode) return;

    setActiveMode(mode);
    setActiveRideMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sart_active_ride_mode', mode);
    }

    const targetUrl = `/home/ride/${mode}`;
    if (typeof window !== 'undefined') {
      window.history.pushState({ mode }, '', targetUrl);
    }
    router.push(targetUrl);

    const reqId = ++activeReqIdRef.current;
    setIsLoadingMode(true);
    setTimeout(() => {
      if (reqId === activeReqIdRef.current) {
        setIsLoadingMode(false);
      }
    }, 180);
  };

  const formatStationName = (name: string) => name.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim();

  const [source, setSource] = useState(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const s = sp.get('source');
      if (s) return s;
    }
    return '';
  });

  const [destination, setDestination] = useState(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const d = sp.get('destination');
      if (d) return d;
    }
    return '';
  });

  const [dateOfJourney, setDateOfJourney] = useState(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const dt = sp.get('date');
      if (dt) return dt;
    }
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(today.getDate()).padStart(2, '0')} ${months[today.getMonth()]}, ${today.getFullYear()}`;
  });

  const [selectedDay, setSelectedDay] = useState(() => String(new Date().getDate()).padStart(2, '0'));

  const handleSwapStations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const s = sp.get('source');
      const d = sp.get('destination');
      const dt = sp.get('date');
      if (s !== null) setSource(s);
      if (d !== null) setDestination(d);
      if (dt !== null) setDateOfJourney(dt);
    }
  }, [pathname]);

  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const calendarRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCalendarPicker = () => {
    const parts = dateOfJourney.split(' ');
    if (parts.length >= 3) {
      const monthPart = parts[1].replace(',', '').trim().toLowerCase();
      const mIdx = MONTH_SHORT.findIndex((m) => m.toLowerCase() === monthPart);
      if (mIdx !== -1) setCalMonth(mIdx);
      const yr = parseInt(parts[2]);
      if (!isNaN(yr)) setCalYear(yr);
    }
    setShowCalendarPicker((prev) => !prev);
  };

  const handleSelectDate = (dayNum: number, monthIdx = calMonth, yr = calYear) => {
    const formattedDay = String(dayNum).padStart(2, '0');
    const newDateStr = `${formattedDay} ${MONTH_SHORT[monthIdx]}, ${yr}`;
    setDateOfJourney(newDateStr);
    setSelectedDay(String(dayNum));
    setShowCalendarPicker(false);
  };

  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [sourceOnlineResults, setSourceOnlineResults] = useState<CityLocation[]>([]);
  const [destOnlineResults, setDestOnlineResults] = useState<CityLocation[]>([]);
  const [isSearchingSource, setIsSearchingSource] = useState(false);
  const [isSearchingDest, setIsSearchingDest] = useState(false);

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
            const mapped: CityLocation[] = data.map((item: any) => ({
              name: item.name || item.display_name?.split(',')[0]?.trim() || q,
              state: item.address?.state || item.address?.county || 'India',
              isOnlineResult: true
            }));
            setSourceOnlineResults(mapped.filter((m) => !POPULAR_CITIES.some((p) => p.name.toLowerCase() === m.name.toLowerCase())));
          }
        }
      } catch (err) {
      } finally {
        setIsSearchingSource(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [source]);

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
            const mapped: CityLocation[] = data.map((item: any) => ({
              name: item.name || item.display_name?.split(',')[0]?.trim() || q,
              state: item.address?.state || item.address?.county || 'India',
              isOnlineResult: true
            }));
            setDestOnlineResults(mapped.filter((m) => !POPULAR_CITIES.some((p) => p.name.toLowerCase() === m.name.toLowerCase())));
          }
        }
      } catch (err) {
      } finally {
        setIsSearchingDest(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [destination]);

  const [sortBy, setSortBy] = useState<'Default' | 'Availability' | 'Duration' | 'Departure' | 'Arrival'>('Default');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterAC, setFilterAC] = useState(false);
  const [filterTatkal, setFilterTatkal] = useState(false);
  const [filterAltTrip, setFilterAltTrip] = useState(false);

  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedQuota, setSelectedQuota] = useState<'general' | 'tatkal' | 'ladies' | 'senior'>('general');
  const [selectedDepTimeRanges, setSelectedDepTimeRanges] = useState<string[]>([]);
  const [selectedArrTimeRanges, setSelectedArrTimeRanges] = useState<string[]>([]);
  const [selectedDepStations, setSelectedDepStations] = useState<string[]>([]);
  const [selectedArrStations, setSelectedArrStations] = useState<string[]>([]);
  const [freeCancel, setFreeCancel] = useState(false);

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    availability: true,
    ticketClass: true,
    quota: false,
    departureTime: false,
    arrivalTime: false,
    departingStations: false,
    arrivingStations: false
  });

  const [viewRouteTrain, setViewRouteTrain] = useState<TrainItem | null>(null);
  const [selectedTrainCardClass, setSelectedTrainCardClass] = useState<Record<string, TrainClassOption | null>>({});
  const [bookingClassModal, setBookingClassModal] = useState<{ train: TrainItem; classOption: TrainClassOption } | null>(null);
  const [passengerName, setPassengerName] = useState('');
  const [passengerAge, setPassengerAge] = useState('');
  const [passengerBerth, setPassengerBerth] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const dateList = useMemo(() => {
    const list = [];
    const today = new Date();
    const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 0; i < 15; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      list.push({
        num: String(d.getDate()).padStart(2, '0'),
        day: daysShort[d.getDay()],
        month: monthsShort[d.getMonth()],
        year: d.getFullYear(),
        pip: i % 2 === 0 ? 'green' : 'orange'
      });
    }
    return list;
  }, []);

  const [backendTrains, setBackendTrains] = useState<TrainItem[] | null>(null);

  // Fetch real trains from backend /api/trains/search when route changes
  useEffect(() => {
    let isMounted = true;
    const fetchTrains = async () => {
      try {
        const cleanSrc = formatStationName(source).trim() || 'Chennai';
        const cleanDst = formatStationName(destination).trim() || 'Bengaluru';
        const data = await TrainApi.searchTrains(cleanSrc, cleanDst, dateOfJourney);
        if (isMounted) {
          if (Array.isArray(data)) {
            setBackendTrains(data);
          } else {
            setBackendTrains([]);
          }
        }
      } catch (err) {
        // When backend stops or is unreachable, strictly return empty array so no trains are shown
        if (isMounted) {
          console.warn('Backend /api/trains unreachable:', err);
          setBackendTrains([]);
        }
      }
    };
    fetchTrains();
    return () => { isMounted = false; };
  }, [source, destination, dateOfJourney]);

  const corridorTrains = useMemo(() => {
    // If backend data is loaded (or backend is stopped/empty), strictly return backendTrains
    if (backendTrains !== null) {
      return backendTrains;
    }
    // Initial loading state: start with empty array so nothing is shown until backend responds
    return [];
  }, [backendTrains]);

  const availableDepartingStations = useMemo(() => {
    const map = new Map<string, string>();
    corridorTrains.forEach((t) => map.set(t.departureStation, t.departureStationCode));
    return Array.from(map.entries()).map(([name, code]) => ({ name, code }));
  }, [corridorTrains]);

  const availableArrivingStations = useMemo(() => {
    const map = new Map<string, string>();
    corridorTrains.forEach((t) => map.set(t.arrivalStation, t.arrivalStationCode));
    return Array.from(map.entries()).map(([name, code]) => ({ name, code }));
  }, [corridorTrains]);

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
      case 'early_morning':
        return mins >= 0 && mins < 6 * 60;
      case 'morning':
        return mins >= 6 * 60 && mins < 12 * 60;
      case 'afternoon':
        return mins >= 12 * 60 && mins < 18 * 60;
      case 'night':
        return mins >= 18 * 60 && mins <= 24 * 60;
      default:
        return true;
    }
  };

  let displayedTrains = [...corridorTrains];
  if (filterAvailable) displayedTrains = displayedTrains.filter((t) => t.classes.some((c) => c.statusType === 'available'));
  if (filterAC) displayedTrains = displayedTrains.filter((t) => t.classes.some((c) => ['1A', '2A', '3A', '3E', 'CC', 'EC', 'EA'].includes(c.code)));
  if (filterTatkal || selectedQuota === 'tatkal') displayedTrains = displayedTrains.filter((t) => t.classes.some((c) => c.isTatkal));
  if (filterAltTrip) displayedTrains = displayedTrains.filter((t) => t.stops && t.stops.length > 3);
  if (selectedClasses.length > 0) displayedTrains = displayedTrains.filter((t) => t.classes.some((c) => selectedClasses.includes(c.code)));

  if (selectedAvailability.length > 0) {
    displayedTrains = displayedTrains.filter((t) =>
      t.classes.some((c) => {
        if (selectedAvailability.includes('available') && c.statusType === 'available') return true;
        if (selectedAvailability.includes('rac') && (c.status.toUpperCase().includes('RAC') || c.statusType === 'update')) return true;
        if (selectedAvailability.includes('wl') && (c.statusType === 'wl' || c.status.toUpperCase().includes('WL'))) return true;
        return false;
      })
    );
  }

  if (selectedDepTimeRanges.length > 0) {
    displayedTrains = displayedTrains.filter((t) => selectedDepTimeRanges.some((r) => matchesTimeRange(t.departureTime, r)));
  }
  if (selectedArrTimeRanges.length > 0) {
    displayedTrains = displayedTrains.filter((t) => selectedArrTimeRanges.some((r) => matchesTimeRange(t.arrivalTime, r)));
  }
  if (selectedDepStations.length > 0) {
    displayedTrains = displayedTrains.filter((t) => selectedDepStations.includes(t.departureStation) || selectedDepStations.includes(t.departureStationCode));
  }
  if (selectedArrStations.length > 0) {
    displayedTrains = displayedTrains.filter((t) => selectedArrStations.includes(t.arrivalStation) || selectedArrStations.includes(t.arrivalStationCode));
  }

  if (sortBy === 'Duration') {
    displayedTrains.sort((a, b) => a.duration.localeCompare(b.duration));
  } else if (sortBy === 'Departure') {
    displayedTrains.sort((a, b) => parseTimeToMinutes(a.departureTime) - parseTimeToMinutes(b.departureTime));
  } else if (sortBy === 'Arrival') {
    displayedTrains.sort((a, b) => parseTimeToMinutes(a.arrivalTime) - parseTimeToMinutes(b.arrivalTime));
  } else if (sortBy === 'Availability') {
    displayedTrains.sort((a, b) => {
      const aAvail = a.classes.filter((c) => c.statusType === 'available').length;
      const bAvail = b.classes.filter((c) => c.statusType === 'available').length;
      return bAvail - aAvail;
    });
  }

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

  const handleConfirmTicketBooking = async (bookingMeta?: {
    passengers: any[];
    email?: string;
    phone?: string;
    irctcId?: string;
    boardingStation?: string;
    paymentDetails?: any;
  }) => {
    if (!bookingClassModal) return;
    const { train, classOption } = bookingClassModal;
    let pnr = `${Math.floor(2000000000 + Math.random() * 8000000000)}`;
    const allPax = bookingMeta?.passengers && bookingMeta.passengers.length > 0
      ? bookingMeta.passengers
      : [{ name: passengerName || 'Passenger', age: passengerAge || '25', gender: 'Male', berthPreference: passengerBerth }];

    const primaryPax = allPax[0];
    const paxNamesStr = allPax.map((p: any) => `${p.name} (${p.age || '25'}, ${p.gender || 'Male'})`).join(', ');

    // Persist booking to backend API /api/trains/confirm-booking
    try {
      const beRes = await TrainApi.confirmBooking({
        trainNumber: train.number,
        trainName: train.name,
        classCode: classOption.code,
        source: source.split('-')[0].trim(),
        sourceCode: train.departureStationCode,
        destination: destination.split('-')[0].trim(),
        destinationCode: train.arrivalStationCode,
        travelDate: dateOfJourney,
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
        passenger: {
          name: primaryPax.name,
          age: primaryPax.age || '25',
          gender: primaryPax.gender || 'Male',
          berthPreference: primaryPax.berthPreference
        },
        passengers: allPax.map((p: any) => ({
          name: p.name,
          age: p.age || '25',
          gender: p.gender || 'Male',
          berthPreference: p.berthPreference
        })),
        email: bookingMeta?.email,
        phone: bookingMeta?.phone,
        irctcId: bookingMeta?.irctcId,
        boardingStation: bookingMeta?.boardingStation,
        paymentDetails: bookingMeta?.paymentDetails,
        fare: (classOption.fare * allPax.length) + (freeCancel ? 50 : 0)
      });
      if (beRes?.data?.pnr) {
        pnr = beRes.data.pnr;
      }
    } catch (e) {
      console.warn('Backend train booking sync failed:', e);
    }

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
      passengerName: paxNamesStr,
      passengerPhone: bookingMeta?.phone || '',
      passengerEmail: bookingMeta?.email || '',
      allPassengers: allPax,
      boardingStation: bookingMeta?.boardingStation || source.split('-')[0].trim(),
      irctcId: bookingMeta?.irctcId || '',
      seatStatus: `Confirmed (${classOption.code} - Coach D8, Berth 24)`,
      statusBadge: 'CNF',
      statusText: 'Ticket Confirmed',
      price: (classOption.fare * allPax.length) + (freeCancel ? 50 : 0),
      paymentDetails: bookingMeta?.paymentDetails,
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

  const triggerSearchNavigation = () => {
    const src = formatStationName(source);
    const dst = formatStationName(destination);
    const q = new URLSearchParams({ source: src, destination: dst, date: dateOfJourney }).toString();
    const targetUrl = `/home/ride/${activeMode}?${q}`;
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', targetUrl);
    }
    router.push(targetUrl);
  };

  return (
    <div className="tb-container">
      {/* Top Navigation */}
      <div className="tb-top-nav-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <button
          onClick={() => {
            setActiveTab('home');
            if (typeof window !== 'undefined') window.history.pushState(null, '', '/home');
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
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}
          title="Back to Home Page"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>


      </div>

      {/* Top Search Bar */}
      <TrainSearchBar
        source={source}
        destination={destination}
        dateOfJourney={dateOfJourney}
        activeMode={activeMode}
        showSourceDropdown={showSourceDropdown}
        setShowSourceDropdown={setShowSourceDropdown}
        showDestDropdown={showDestDropdown}
        setShowDestDropdown={setShowDestDropdown}
        isSearchingSource={isSearchingSource}
        isSearchingDest={isSearchingDest}
        sourceOnlineResults={sourceOnlineResults}
        destOnlineResults={destOnlineResults}
        setSource={setSource}
        setDestination={setDestination}
        setDateOfJourney={setDateOfJourney}
        setSelectedDay={setSelectedDay}
        handleSwapStations={handleSwapStations}
        formatStationName={formatStationName}
        showCalendarPicker={showCalendarPicker}
        setShowCalendarPicker={setShowCalendarPicker}
        calMonth={calMonth}
        setCalMonth={setCalMonth}
        calYear={calYear}
        setCalYear={setCalYear}
        toggleCalendarPicker={toggleCalendarPicker}
        handleSelectDate={handleSelectDate}
        sourceRef={sourceRef}
        destRef={destRef}
        calendarRef={calendarRef}
        otherRidesRef={otherRidesRef}
        showOtherRidesDropdown={showOtherRidesDropdown}
        setShowOtherRidesDropdown={setShowOtherRidesDropdown}
        handleModeChange={handleModeChange}
        onSearch={triggerSearchNavigation}
        INITIAL_MODE_ORDER={INITIAL_MODE_ORDER}
      />

      {/* Mode Views or Skeleton */}
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
      ) : activeMode === 'bike' ? (
        <BikeBookingView
          sourceLocation={formatStationName(source)}
          destinationLocation={formatStationName(destination)}
          onSourceChange={(newSource) => setSource(newSource)}
          onDestinationChange={(newDest) => setDestination(newDest)}
          onBackToHome={() => {
            setActiveTab('home');
            router.push('/home');
          }}
        />
      ) : activeMode === 'auto' ? (
        <AutoBookingView
          sourceLocation={formatStationName(source)}
          destinationLocation={formatStationName(destination)}
          onSourceChange={(newSource) => setSource(newSource)}
          onDestinationChange={(newDest) => setDestination(newDest)}
        />
      ) : activeMode === 'car' ? (
        <CarBookingView
          sourceLocation={formatStationName(source)}
          destinationLocation={formatStationName(destination)}
          onSourceChange={(newSource) => setSource(newSource)}
          onDestinationChange={(newDest) => setDestination(newDest)}
          onBackToHome={() => {
            setActiveTab('home');
            router.push('/home');
          }}
        />
      ) : activeMode === 'flight' ? (
        <FlightBookingView
          source={formatStationName(source)}
          destination={formatStationName(destination)}
          dateOfJourney={dateOfJourney}
        />
      ) : activeMode === 'helicopter' ? (
        <HelicopterBookingView
          source={formatStationName(source)}
          destination={formatStationName(destination)}
          dateOfJourney={dateOfJourney}
        />
      ) : activeMode === 'train' ? (
        <div className="tb-main-grid">
          {/* Left Filter Sidebar */}
          <TrainFilterSidebar
            filterAvailable={filterAvailable}
            setFilterAvailable={setFilterAvailable}
            filterAC={filterAC}
            setFilterAC={setFilterAC}
            filterTatkal={filterTatkal}
            setFilterTatkal={setFilterTatkal}
            filterAltTrip={filterAltTrip}
            setFilterAltTrip={setFilterAltTrip}
            selectedClasses={selectedClasses}
            setSelectedClasses={setSelectedClasses}
            selectedAvailability={selectedAvailability}
            setSelectedAvailability={setSelectedAvailability}
            selectedQuota={selectedQuota}
            setSelectedQuota={setSelectedQuota}
            selectedDepTimeRanges={selectedDepTimeRanges}
            setSelectedDepTimeRanges={setSelectedDepTimeRanges}
            selectedArrTimeRanges={selectedArrTimeRanges}
            setSelectedArrTimeRanges={setSelectedArrTimeRanges}
            selectedDepStations={selectedDepStations}
            setSelectedDepStations={setSelectedDepStations}
            selectedArrStations={selectedArrStations}
            setSelectedArrStations={setSelectedArrStations}
            openAccordions={openAccordions}
            toggleAccordion={toggleAccordion}
            availableDepartingStations={availableDepartingStations}
            availableArrivingStations={availableArrivingStations}
            handleClearAllFilters={handleClearAllFilters}
            freeCancel={freeCancel}
            setFreeCancel={setFreeCancel}
          />

          {/* Right Main Results Area */}
          <main className="tb-results-area">
            {/* Calendar Dates Strip */}
            <div className="tb-date-strip-container">
              <span className="tb-month-label">{dateList[0]?.month?.toUpperCase() || 'LIVE'}</span>
              <div className="tb-dates-scroll">
                {dateList.map((item) => (
                  <div
                    key={`${item.num}-${item.month}`}
                    className={`tb-date-card ${selectedDay === item.num ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDay(item.num);
                      setDateOfJourney(`${item.num} ${item.month}, ${item.year}`);
                    }}
                  >
                    <div className={`tb-date-pip ${item.pip === 'orange' ? 'tb-pip-orange' : 'tb-pip-green'}`}></div>
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
                {(['Default', 'Availability', 'Duration', 'Departure', 'Arrival'] as const).map((option) => (
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

            {/* Empty State */}
            {displayedTrains.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '48px 24px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                <i className="fa-solid fa-train" style={{ fontSize: '32px', color: '#94a3b8', marginBottom: '12px' }}></i>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>No trains found matching your filters</h3>

              </div>
            ) : null}

            {/* Train Cards List with Inline Availability below the selected class */}
            {displayedTrains.map((train) => {
              const activeClass = selectedTrainCardClass[train.id] || null;
              return (
                <TrainCard
                  key={train.id}
                  train={train}
                  selectedClassOption={activeClass}
                  dateOfJourney={dateOfJourney}
                  onViewRoute={(t) => {
                    // Navigate to full train history & live status page
                    router.push(`/home/ride/train/${t.number}`);
                  }}
                  onSelectClass={(t, cls) => {
                    setSelectedTrainCardClass((prev) => {
                      const current = prev[t.id];
                      // Toggle off if already selected, or switch to clicked class
                      if (current?.code === cls.code && current?.isTatkal === cls.isTatkal) {
                        return { ...prev, [t.id]: null };
                      }
                      return { ...prev, [t.id]: cls };
                    });
                  }}
                  onSelectBooking={(tr, cl, dt) => {
                    setDateOfJourney(dt);
                    setBookingClassModal({ train: tr, classOption: cl });
                    setBookingConfirmed(false);
                  }}
                />
              );
            })}
          </main>
        </div>
      ) : null}

      {/* Route Timeline Modal */}
      {viewRouteTrain && <TrainRouteModal train={viewRouteTrain} onClose={() => setViewRouteTrain(null)} />}

      {/* Passenger Details & Booking Modal */}
      {bookingClassModal && (
        <TrainPassengerDetailsModal
          trainName={bookingClassModal.train.name}
          trainNumber={bookingClassModal.train.number}
          classCode={bookingClassModal.classOption.code}
          fare={bookingClassModal.classOption.fare}
          source={source}
          destination={destination}
          dateOfJourney={dateOfJourney}
          depTime={bookingClassModal.train.departureTime}
          passenger={{
            name: passengerName,
            age: passengerAge,
            gender: 'Male',
            berthPreference: passengerBerth as any
          }}
          freeCancel={freeCancel}
          onPassengerChange={(p) => {
            setPassengerName(p.name);
            setPassengerAge(p.age);
            setPassengerBerth(p.berthPreference);
          }}
          onConfirmBooking={handleConfirmTicketBooking}
          onClose={() => {
            setBookingClassModal(null);
            setBookingConfirmed(false);
          }}
          isConfirmed={bookingConfirmed}
        />
      )}
    </div>
  );
}
