'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSartStore } from '@/store/useSartStore';
import './BusBookingView.css';
import { BusFilterSidebar } from './bus/BusFilterSidebar';
import { BusBookingModal } from './bus/BusBookingModal';
import { BusApi } from '@/apis/busApi';

// Extracted Data & Child Components
import {
  BusItem,
  CALENDAR_DATES,
  GovtRtcCardItem,
  GOVT_RTC_CARDS,
  BusSeat,
  ALL_MODAL_SEATS,
  computeBusSeatsLayout,
  RouteStop,
  getRouteAndPointsForPlaces,
  BUS_FULL_ROUTE,
  BOARDING_POINTS_DATA,
  DROPPING_POINTS_DATA,
  CANCELLATION_POLICY_ROWS,
  CANCELLATION_POLICY_DATA,
  BUS_GALLERY_IMAGES,
  generateBusesForRoute
} from './bus/busData';

export type { BusItem, GovtRtcCardItem, BusSeat, RouteStop };
export {
  CALENDAR_DATES, GOVT_RTC_CARDS, ALL_MODAL_SEATS, computeBusSeatsLayout,
  getRouteAndPointsForPlaces, BUS_FULL_ROUTE, BOARDING_POINTS_DATA,
  DROPPING_POINTS_DATA, CANCELLATION_POLICY_ROWS, CANCELLATION_POLICY_DATA,
  BUS_GALLERY_IMAGES, generateBusesForRoute
};

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

  // Dynamically update buses from backend API with fallback to local generator
  useEffect(() => {
    let isMounted = true;
    const fetchBusesFromBackend = async () => {
      try {
        const cleanSrc = source.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim();
        const cleanDst = destination.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim();
        const dateQuery = dateOfJourney || new Date().toISOString().split('T')[0];

        const res = await fetch(`http://localhost:5000/api/buses/search?origin=${encodeURIComponent(cleanSrc)}&destination=${encodeURIComponent(cleanDst)}&date=${encodeURIComponent(dateQuery)}`);
        if (res.ok) {
          const result = await res.json();
          if (isMounted && result && result.success && Array.isArray(result.data) && result.data.length > 0) {
            setBuses(result.data);
            return;
          }
        }
      } catch (err) {
        // Fallback gracefully to offline generator if backend is restarting
      }
      if (isMounted) {
        setBuses(generateBusesForRoute(source, destination));
      }
    };

    fetchBusesFromBackend();
    return () => { isMounted = false; };
  }, [source, destination, dateOfJourney]);
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
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
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
  const [passengers, setPassengers] = useState<Record<string, { name: string; age: string; gender: 'Male' | 'Female' }>>({});
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

  // Track booked seats per bus in localStorage so booked seats remain occupied permanently
  const [persistedBookedSeats, setPersistedBookedSeats] = useState<Record<string, string[]>>({});
  const [persistedBookedGenders, setPersistedBookedGenders] = useState<Record<string, Record<string, 'male' | 'female'>>>({});

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('sart_bus_booked_seats');
        if (stored) {
          setPersistedBookedSeats(JSON.parse(stored));
        }
        const storedGenders = localStorage.getItem('sart_bus_booked_genders');
        const gendersMap: Record<string, Record<string, 'male' | 'female'>> = storedGenders ? JSON.parse(storedGenders) : {};

        // Also check sart_global_bookings to recover any booked ticket genders (e.g., if booked with Female)
        const storedBookings = localStorage.getItem('sart_global_bookings');
        if (storedBookings) {
          const bookings = JSON.parse(storedBookings);
          bookings.forEach((b: any) => {
            if (b.type === 'Bus' && b.seatStatus) {
              // Parse seatStatus, e.g. "Confirmed Seats: U-D6A (♀ Female)"
              const matches = b.seatStatus.matchAll(/([A-Za-z0-9-]+)\s*\(([♀♂]?\s*(Female|Male))\)/gi);
              for (const m of matches) {
                const sId = m[1];
                const gStr = m[3]?.toLowerCase();
                if (sId && (gStr === 'female' || gStr === 'male')) {
                  const gVal: 'female' | 'male' = gStr === 'female' ? 'female' : 'male';
                  if (b.sourceDate) {
                    const bKey = `${b.title?.split(' ')?.[0] || ''}-${b.sourceDate}`;
                    if (!gendersMap[bKey]) gendersMap[bKey] = {};
                    gendersMap[bKey][sId] = gVal;
                  }
                  // Also set globally per seat id
                  if (!gendersMap['global']) gendersMap['global'] = {};
                  gendersMap['global'][sId] = gVal;
                }
              }
            }
          });
        }
        setPersistedBookedGenders(gendersMap);
      }
    } catch (e) { }
  }, []);

  // Compute exact seating layout whenever selectedBus or dateOfJourney changes
  const getBookedSeatsForBus = (busId: string): string[] => {
    const keyWithDate = `${busId}-${effectiveDateOfJourney}`;
    const genericKey = busId;
    const dateSpecific = persistedBookedSeats[keyWithDate] || [];
    const generic = persistedBookedSeats[genericKey] || [];
    return Array.from(new Set([...dateSpecific, ...generic]));
  };

  const getBookedGendersForBus = (busId: string): Record<string, 'male' | 'female'> => {
    const keyWithDate = `${busId}-${effectiveDateOfJourney}`;
    const genericKey = busId;
    return {
      ...(persistedBookedGenders['global'] || {}),
      ...(persistedBookedGenders[genericKey] || {}),
      ...(persistedBookedGenders[keyWithDate] || {})
    };
  };

  const currentSeatLayout = useMemo(() => {
    if (!selectedBus) return null;
    const extraBooked = getBookedSeatsForBus(selectedBus.id);
    const bookedGenders = getBookedGendersForBus(selectedBus.id);
    return computeBusSeatsLayout(selectedBus, effectiveDateOfJourney, extraBooked, bookedGenders);
  }, [selectedBus, effectiveDateOfJourney, persistedBookedSeats, persistedBookedGenders]);

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
  const safeBuses = Array.isArray(buses) ? buses : [];
  let displayedBuses = safeBuses.filter(b => {
    if (!b || !b.depTime || !b.arrTime) return false;
    const depH = parseInt(b.depTime.split(':')[0], 10) || 0;
    const arrH = parseInt(b.arrTime.split(':')[0], 10) || 0;

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

    // Government RTC vs Private Bus segregation
    if (selectedGovtRtc) {
      // User clicked a state RTC card: show only that state RTC buses
      if (!b.operator.toLowerCase().includes(selectedGovtRtc.toLowerCase())) return false;
    } else {
      // Default: show ONLY Private buses (redBus / AbhiBus style)
      if (b.isRTC || b.operator.includes('(RTC)') || ['APSRTC', 'TGSRTC', 'Kerala RTC', 'KSRTC', 'TNSTC'].some(rtc => b.operator.includes(rtc))) {
        return false;
      }
    }

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
    const savedUserSession = (() => {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('sart_user_session') : null;
        if (stored) return JSON.parse(stored);
      } catch (e) { }
      return null;
    })();
    const defaultLoggedInName = savedUserSession?.name || savedUserSession?.fullName || 'Vasanth Kumar';

    const primaryPax = passengers[selectedSeats[0]] || { name: defaultLoggedInName, age: '28', gender: 'Male' };
    const pName = primaryPax.name.trim() || defaultLoggedInName;
    const currentUserId = savedUserSession?.id || savedUserSession?.userId || 'user-sart-demo';
    const newBooking = {
      id: `bus-${Date.now()}`,
      userId: currentUserId,
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
      sourceDate: effectiveDateOfJourney,
      destinationTime: selectedBus.arrTime,
      destinationDate: effectiveDateOfJourney,
      passengerName: pName,
      seatStatus: `Confirmed Seats: ${selectedSeats.map(s => `${s} (${passengers[s]?.gender === 'Female' ? '♀ Female' : '♂ Male'})`).join(', ')}`,
      statusBadge: 'CNF',
      statusText: 'Ticket Confirmed',
      price: totalAmount,
      cost: totalAmount,
      isActive: true,
      isCancelled: false
    };

    // 1. Persist to sart_global_bookings
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('sart_global_bookings');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newBooking);
      localStorage.setItem('sart_global_bookings', JSON.stringify(list));

      // 2. Persist the booked seat IDs and exact passenger genders per bus and date so they can NEVER be booked again
      const busKey = `${selectedBus.id}-${effectiveDateOfJourney}`;
      const genericKey = selectedBus.id;
      const currentBooked = persistedBookedSeats[busKey] || [];
      const updatedBooked = Array.from(new Set([...currentBooked, ...selectedSeats]));
      const newBookedMap = {
        ...persistedBookedSeats,
        [busKey]: updatedBooked,
        [genericKey]: Array.from(new Set([...(persistedBookedSeats[genericKey] || []), ...selectedSeats]))
      };
      setPersistedBookedSeats(newBookedMap);
      localStorage.setItem('sart_bus_booked_seats', JSON.stringify(newBookedMap));

      // Persist the passenger gender chosen for each seat ('male' | 'female')
      const currentGenders = persistedBookedGenders[busKey] || {};
      const newSeatGenders: Record<string, 'male' | 'female'> = { ...currentGenders };
      selectedSeats.forEach(sId => {
        const pax = passengers[sId];
        const g = (pax?.gender || 'Male').toLowerCase() === 'female' ? 'female' : 'male';
        newSeatGenders[sId] = g;
      });
      const newGendersMap = {
        ...persistedBookedGenders,
        [busKey]: newSeatGenders,
        [genericKey]: { ...(persistedBookedGenders[genericKey] || {}), ...newSeatGenders }
      };
      setPersistedBookedGenders(newGendersMap);
      localStorage.setItem('sart_bus_booked_genders', JSON.stringify(newGendersMap));
    }

    // 3. Asynchronously sync to backend /api/bookings
    try {
      fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUserId
        },
        body: JSON.stringify({
          title: newBooking.title,
          type: 'bus',
          subType: selectedBus.busType,
          cost: totalAmount,
          pickupLoc: newBooking.source,
          dropLoc: newBooking.destination,
          details: `Seats: ${selectedSeats.join(', ')} | PNR: ${pnr}`,
          extraData: {
            pnr,
            bookingId: newBooking.bookingId,
            passengerName: pName,
            source: newBooking.source,
            sourceCode: newBooking.sourceCode,
            destination: newBooking.destination,
            destinationCode: newBooking.destinationCode,
            sourceTime: newBooking.sourceTime,
            sourceDate: newBooking.sourceDate,
            destinationTime: newBooking.destinationTime,
            destinationDate: newBooking.destinationDate,
            seatStatus: newBooking.seatStatus,
            statusBadge: 'CNF',
            statusText: 'Ticket Confirmed',
            stops: [
              { name: newBooking.source, time: newBooking.sourceTime, status: 'past' },
              { name: newBooking.destination, time: newBooking.destinationTime, status: 'future' }
            ]
          }
        })
      }).catch(err => console.warn('Backend booking sync error:', err));
    } catch (e) { }

    setConfirmedPnr(pnr);
    setBookingConfirmed(true);
  };

  return (
    <div className="bb-container">

      {/* ---------------- Main Two-Column Layout ---------------- */}
      <div className="bb-main-grid">
        {/* Left Filter Sidebar */}
        <BusFilterSidebar
          clearAllFilters={clearAllFilters}
          aiFilterText={aiFilterText}
          setAiFilterText={setAiFilterText}
          filterPrimo={filterPrimo}
          setFilterPrimo={setFilterPrimo}
          filterFreeCancel={filterFreeCancel}
          setFilterFreeCancel={setFilterFreeCancel}
          filterLiveTrack={filterLiveTrack}
          setFilterLiveTrack={setFilterLiveTrack}
          filterAC={filterAC}
          setFilterAC={setFilterAC}
          filterNonAC={filterNonAC}
          setFilterNonAC={setFilterNonAC}
          filterSleeper={filterSleeper}
          setFilterSleeper={setFilterSleeper}
          filterSeater={filterSeater}
          setFilterSeater={setFilterSeater}
          filterSingleSeats={filterSingleSeats}
          setFilterSingleSeats={setFilterSingleSeats}
          filterHighRated={filterHighRated}
          setFilterHighRated={setFilterHighRated}
          accordionsOpen={accordionsOpen}
          toggleAccordion={toggleAccordion}
          selectedDepTimes={selectedDepTimes}
          setSelectedDepTimes={setSelectedDepTimes}
          toggleSelection={toggleSelection}
          selectedBusTypes={selectedBusTypes}
          setSelectedBusTypes={setSelectedBusTypes}
          selectedArrTimes={selectedArrTimes}
          setSelectedArrTimes={setSelectedArrTimes}
          searchOperator={searchOperator}
          setSearchOperator={setSearchOperator}
          selectedOperators={selectedOperators}
          setSelectedOperators={setSelectedOperators}
          searchBoarding={searchBoarding}
          setSearchBoarding={setSearchBoarding}
          selectedBoarding={selectedBoarding}
          setSelectedBoarding={setSelectedBoarding}
          searchDropping={searchDropping}
          setSearchDropping={setSearchDropping}
          selectedDropping={selectedDropping}
          setSelectedDropping={setSelectedDropping}
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
        />

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
                      {card.logoImg ? (
                        <img
                          src={card.logoImg}
                          alt={card.code}
                          className="bb-govt-card-emblem-img"
                        />
                      ) : (
                        card.emblemSvg
                      )}
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
            <span className="bb-count-label">
              {displayedBuses.length} {selectedGovtRtc ? `${selectedGovtRtc} State Buses Available` : 'Private Buses Available'}
            </span>
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
            {displayedBuses.map((bus, busIndex) => {
              const bookedSeats = getBookedSeatsForBus(bus.id);
              const liveAvailableSeats = Math.max(0, bus.availableSeats - bookedSeats.length);

              return (
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
                          <span className={liveAvailableSeats <= 15 ? 'bb-seats-highlight-low' : 'bb-seats-highlight-normal'}>
                            {liveAvailableSeats} Seats
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
                            setSelectedSeats([]);
                            setPassengers({});
                            setModalTopTab('select_seats');
                            setModalSubTab('Highlights');
                            setSelectedBoardingPoint(bus.boardingPoints?.[0]?.name || 'Boarding Point');
                            setSelectedDroppingPoint(bus.droppingPoints?.[bus.droppingPoints.length - 1]?.name || 'Dropping Point');
                            setBookingConfirmed(false);
                          }}
                        >
                          Select Seats
                        </button>
                        <div className={`bb-seats-left-pill ${liveAvailableSeats <= 15 ? 'low-seats' : 'normal-seats'}`}>
                          <i className="fa-solid fa-couch"></i>
                          <span>{liveAvailableSeats} Seats Left</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </main>
      </div>

      {/* ---------------- 5. Interactive Seat Selection Modal ---------------- */}
      {/* ---------------- 5. Interactive Seat Selection Modal (Exact Image 3 Reference) ---------------- */}
      {/* ---------------- 5. Interactive Seat Selection Modal ---------------- */}
      <BusBookingModal
        selectedBus={selectedBus}
        setSelectedBus={setSelectedBus}
        modalTopTab={modalTopTab}
        setModalTopTab={setModalTopTab}
        isGpsEnabled={isGpsEnabled}
        setIsGpsEnabled={setIsGpsEnabled}
        activeFullRoute={activeFullRoute}
        selectedBoardingPoint={selectedBoardingPoint}
        selectedDroppingPoint={selectedDroppingPoint}
        activeRouteData={activeRouteData}
        activeBoardingPoints={activeBoardingPoints}
        activeDroppingPoints={activeDroppingPoints}
        setSelectedBoardingPoint={setSelectedBoardingPoint}
        setSelectedDroppingPoint={setSelectedDroppingPoint}
        boardingSubTab={boardingSubTab}
        setBoardingSubTab={setBoardingSubTab}
        passengers={passengers}
        updatePassengerField={(seatId, field, val) => {
          setPassengers(prev => ({
            ...prev,
            [seatId]: {
              ...(prev[seatId] || { name: '', age: '', gender: 'Male' }),
              [field]: val
            }
          }));
        }}
        registeredPhone={registeredPhone}
        setRegisteredPhone={setRegisteredPhone}
        isEditingPhone={isEditingPhone}
        setIsEditingPhone={setIsEditingPhone}
        tempPhone={tempPhone}
        setTempPhone={setTempPhone}
        stateOfResidence={stateOfResidence}
        whatsAppOptIn={whatsAppOptIn}
        setWhatsAppOptIn={setWhatsAppOptIn}
        tripRewardOptIn={tripRewardOptIn}
        setTripRewardOptIn={setTripRewardOptIn}
        selectedSeats={selectedSeats}
        dateOfJourney={effectiveDateOfJourney}
        calculateTotalFare={calculateTotalFare}
        handleConfirmBusBooking={handleConfirmBusBooking}
        currentSeatLayout={currentSeatLayout}
        handleToggleSeat={handleToggleSeat}
        setPreviewPhoto={setPreviewPhoto}
        modalSubTab={modalSubTab}
        setModalSubTab={setModalSubTab}
        previewPhoto={previewPhoto}
        bookingConfirmed={bookingConfirmed}
        confirmedPnr={confirmedPnr}
        onDoneBooking={() => {
          setSelectedBus(null);
          setBookingConfirmed(false);
          setActiveTab('booking');
          if (typeof window !== 'undefined') {
            window.history.pushState(null, '', '/booking');
          }
        }}
      />
    </div>
  );
}
