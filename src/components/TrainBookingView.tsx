'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './TrainBookingView.css';
import BusBookingView from './BusBookingView';
import RideBookingView from './RideBookingView';
import FlightBookingView from './FlightBookingView';
import TrainPassengerDetailsModal, { TrainPassenger } from './TrainPassengerDetails';
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
  getCorridorTrains
} from './trainData';

export type { TrainClassOption, TrainItem, BikeStopItem, CityLocation };
export { POPULAR_CITIES, INDIAN_STATIONS, INITIAL_TRAINS, EXPANDED_CORRIDOR_TRAINS, getCorridorTrains };

export type RideMode = 'bike' | 'auto' | 'car' | 'bus' | 'train' | 'flight';

export function getRideModeFromPath(urlPath?: string): RideMode {
  if (typeof window !== 'undefined') {
    const sp = new URLSearchParams(window.location.search);
    const m = sp.get('mode')?.toLowerCase();
    if (m === 'flight' || m === 'filght') return 'flight';
    if (m === 'bus') return 'bus';
    if (m === 'train') return 'train';
    if (m === 'car') return 'car';
    if (m === 'auto') return 'auto';
    if (m === 'bike' || m === 'bick') return 'bike';
  }

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

export const INITIAL_MODE_ORDER: { id: RideMode; label: string; icon: string }[] = [
  { id: 'flight', label: 'Flight', icon: 'fa-plane' },
  { id: 'train', label: 'Train', icon: 'fa-train' },
  { id: 'bus', label: 'Bus', icon: 'fa-bus' },
  { id: 'car', label: 'Car', icon: 'fa-car' },
  { id: 'auto', label: 'Auto', icon: 'fa-taxi' },
  { id: 'bike', label: 'Bike', icon: 'fa-motorcycle' },
];

export default function TrainBookingView() {
  const pathname = usePathname();
  const router = useRouter();
  const { setActiveTab, setActiveRideMode } = useSartStore();

  // Navigation & Mode - single source of truth initialized from path
  const [activeMode, setActiveMode] = useState<RideMode>(() => getRideModeFromPath(pathname));
  const [isLoadingMode, setIsLoadingMode] = useState<boolean>(false);
  const activeReqIdRef = useRef<number>(0);

  // Dynamic order of mode tabs: initial order is Flight -> Train -> Bus -> Car -> Auto -> Bike
  // When a tab is clicked, that tab moves to the first position.
  const [modeList, setModeList] = useState(() => {
    const initialMode = getRideModeFromPath(pathname);
    const list = [...INITIAL_MODE_ORDER];
    if (initialMode && initialMode !== 'flight') {
      const idx = list.findIndex(m => m.id === initialMode);
      if (idx > -1) {
        const [selected] = list.splice(idx, 1);
        list.unshift(selected);
      }
    }
    return list;
  });

  // Sync mode with pathname changes immediately & bring active mode to first icon position
  useEffect(() => {
    const currentPathMode = getRideModeFromPath(pathname);
    if (currentPathMode !== activeMode) {
      setActiveMode(currentPathMode);
      setActiveRideMode(currentPathMode);
      setModeList(prev => {
        const item = prev.find(m => m.id === currentPathMode);
        if (!item || prev[0].id === currentPathMode) return prev;
        return [item, ...prev.filter(m => m.id !== currentPathMode)];
      });
    }
  }, [pathname, activeMode, setActiveRideMode]);

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

  // Mode change handler: updates UI tab immediately, moves clicked mode to first position, shows skeleton loader, updates URL consistently
  const handleModeChange = (mode: RideMode) => {
    // Reorder tabs so clicked tab is first in the list
    setModeList(prev => {
      const selected = prev.find(m => m.id === mode);
      if (!selected || prev[0].id === mode) return prev;
      return [selected, ...prev.filter(m => m.id !== mode)];
    });

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
    return '14 Oct, 2026';
  });
  const [selectedDay, setSelectedDay] = useState('14');

  const handleSwapStations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sart_ride_pickup', destination);
      localStorage.setItem('sart_ride_dropoff', temp);
      window.dispatchEvent(new CustomEvent('sart_ride_location_update', {
        detail: { pickup: destination, dropoff: temp }
      }));
    }
  };

  // Sync state if query parameters change
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
  const [passengerName, setPassengerName] = useState('');
  const [passengerAge, setPassengerAge] = useState('');
  const [passengerBerth, setPassengerBerth] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
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
        {(activeMode === 'bus' || activeMode === 'train' || activeMode === 'flight') && (
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{formatStationName(source) || 'Select Source'}</span>
              <i className="fa-solid fa-arrow-right" style={{ fontSize: '13px', color: '#64748b' }}></i>
              <span>{formatStationName(destination) || 'Select Destination'}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              {activeMode === 'bus' ? 'Buses available' :
                activeMode === 'train' ? `${displayedTrains.length} ${displayedTrains.length === 1 ? 'train' : 'trains'} running on this route` :
                  'Flights available'}
            </div>
          </div>
        )}
      </div>

      {/* ---------------- 1. Top Search Bar (Appears above the mode icons for all modes: Bus, Car, Train, Flight, Bike, Auto) ---------------- */}
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
                className=""
                value={formatStationName(source)}
                onChange={(e) => { setSource(e.target.value); setShowSourceDropdown(true); }}
                onFocus={() => setShowSourceDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowSourceDropdown(false);
                    const src = formatStationName(source);
                    const dst = formatStationName(destination);
                    const q = new URLSearchParams({
                      source: src,
                      destination: dst,
                      date: dateOfJourney
                    }).toString();
                    const targetUrl = `/home/ride/${activeMode}?${q}`;
                    if (typeof window !== 'undefined') {
                      window.history.pushState(null, '', targetUrl);
                    }
                    router.push(targetUrl);
                  }
                }}
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
                className=""
                value={formatStationName(destination)}
                onChange={(e) => { setDestination(e.target.value); setShowDestDropdown(true); }}
                onFocus={() => setShowDestDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowDestDropdown(false);
                    const src = formatStationName(source);
                    const dst = formatStationName(destination);
                    const q = new URLSearchParams({
                      source: src,
                      destination: dst,
                      date: dateOfJourney
                    }).toString();
                    const targetUrl = `/home/ride/${activeMode}?${q}`;
                    if (typeof window !== 'undefined') {
                      window.history.pushState(null, '', targetUrl);
                    }
                    router.push(targetUrl);
                  }
                }}
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
                  <span className=" tb-date-text">
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
          <button
            className="tb-search-action-btn"
            onClick={() => {
              const src = formatStationName(source);
              const dst = formatStationName(destination);
              const q = new URLSearchParams({
                source: src,
                destination: dst,
                date: dateOfJourney
              }).toString();
              const targetUrl = `/home/ride/${activeMode}?${q}`;
              if (typeof window !== 'undefined') {
                window.history.pushState(null, '', targetUrl);
              }
              router.push(targetUrl);
            }}
            title="Search"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        {/* Mode Tabs: Dynamic order starting with Flight, Train, Bus, Car, Auto, Bike, where any clicked icon moves to the 1st position */}
        <div className="tb-mode-tabs">
          {modeList.map((m) => (
            <button
              key={m.id}
              className={`tb-mode-tab ${activeMode === m.id ? 'active' : ''}`}
              onClick={() => handleModeChange(m.id)}
            >
              <i className={`fa-solid ${m.icon}`}></i> {m.label}
            </button>
          ))}
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
            {/* Applied Filters & Clear All Header (Matches user image exactly) */}
            <div className="tb-applied-filters-header">
              <span className="tb-applied-filters-title">Applied Filters</span>
              {(filterAvailable || filterAC || filterTatkal || filterAltTrip || selectedClasses.length > 0 || selectedAvailability.length > 0 || selectedDepTimeRanges.length > 0 || selectedArrTimeRanges.length > 0 || selectedDepStations.length > 0 || selectedArrStations.length > 0 || selectedQuota !== 'general') && (
                <button
                  type="button"
                  className="tb-clear-all-link"
                  onClick={handleClearAllFilters}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Active Chips Display */}
            {(filterAvailable || filterAC || filterTatkal || filterAltTrip || selectedClasses.length > 0 || selectedAvailability.length > 0 || selectedDepTimeRanges.length > 0 || selectedArrTimeRanges.length > 0 || selectedDepStations.length > 0 || selectedArrStations.length > 0 || selectedQuota !== 'general') && (
              <div className="tb-active-chips-wrap">
                {filterAvailable && (
                  <span className="tb-active-chip">
                    Available Only
                    <button type="button" className="tb-active-chip-remove" onClick={() => setFilterAvailable(false)}>×</button>
                  </span>
                )}
                {filterAC && (
                  <span className="tb-active-chip">
                    AC
                    <button type="button" className="tb-active-chip-remove" onClick={() => setFilterAC(false)}>×</button>
                  </span>
                )}
                {filterTatkal && (
                  <span className="tb-active-chip">
                    Tatkal
                    <button type="button" className="tb-active-chip-remove" onClick={() => setFilterTatkal(false)}>×</button>
                  </span>
                )}
                {filterAltTrip && (
                  <span className="tb-active-chip">
                    Alternate Trip
                    <button type="button" className="tb-active-chip-remove" onClick={() => setFilterAltTrip(false)}>×</button>
                  </span>
                )}
                {selectedClasses.map(cls => (
                  <span key={cls} className="tb-active-chip">
                    Class: {cls}
                    <button type="button" className="tb-active-chip-remove" onClick={() => setSelectedClasses(prev => prev.filter(c => c !== cls))}>×</button>
                  </span>
                ))}
                {selectedAvailability.map(av => (
                  <span key={av} className="tb-active-chip">
                    {av.toUpperCase()}
                    <button type="button" className="tb-active-chip-remove" onClick={() => setSelectedAvailability(prev => prev.filter(a => a !== av))}>×</button>
                  </span>
                ))}
                {selectedQuota !== 'general' && (
                  <span className="tb-active-chip">
                    Quota: {selectedQuota}
                    <button type="button" className="tb-active-chip-remove" onClick={() => setSelectedQuota('general')}>×</button>
                  </span>
                )}
              </div>
            )}

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
          sourceLocation={formatStationName(source)}
          destinationLocation={formatStationName(destination)}
          onSourceChange={(newSource) => {
            setSource(newSource);
          }}
          onDestinationChange={(newDest) => {
            setDestination(newDest);
          }}
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
        <FlightBookingView
          source={formatStationName(source)}
          destination={formatStationName(destination)}
          dateOfJourney={dateOfJourney}
        />
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
