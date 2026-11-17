'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import './FlightBookingView.css';
import {
  FlightItem,
  getFlightsForRoute,
  FLIGHT_COUPONS,
  getAirportCode
} from './flightData';
import FlightPassengerDetailsModal, {
  FlightPassenger,
  FlightContactInfo
} from './FlightPassengerDetails';

interface FlightBookingViewProps {
  source: string;
  destination: string;
  dateOfJourney?: string;
}

export default function FlightBookingView({
  source,
  destination,
  dateOfJourney
}: FlightBookingViewProps) {
  const router = useRouter();

  const effectiveDate = useMemo(() => {
    if (dateOfJourney) return dateOfJourney;
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]}, ${now.getFullYear()}`;
  }, [dateOfJourney]);

  // Travelers & Cabin Class state
  const [adults, setAdults] = useState<number>(1);
  const [seniors, setSeniors] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business'>('Economy');
  const [specialFare, setSpecialFare] = useState<string>('6Exclusive');
  const [showTravelerPopup, setShowTravelerPopup] = useState<boolean>(false);

  // Sync with localStorage ('sart_flight_travellers') and custom events
  useEffect(() => {
    const loadFromStorage = () => {
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('sart_flight_travellers');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.adultCount !== undefined) setAdults(Number(parsed.adultCount) || 1);
            if (parsed.seniorCount !== undefined) setSeniors(Number(parsed.seniorCount) || 0);
            if (parsed.childCount !== undefined) setChildren(Number(parsed.childCount) || 0);
            if (parsed.infantCount !== undefined) setInfants(Number(parsed.infantCount) || 0);
            if (parsed.cabinClass) setCabinClass(parsed.cabinClass);
            if (parsed.specialFare) setSpecialFare(parsed.specialFare);
          }
        } catch (e) {
          console.error('Failed to load travellers in FlightBookingView', e);
        }
      }
    };

    loadFromStorage();

    const handleCustomChange = (e: any) => {
      if (e.detail) {
        if (e.detail.adultCount !== undefined) setAdults(Number(e.detail.adultCount) || 1);
        if (e.detail.seniorCount !== undefined) setSeniors(Number(e.detail.seniorCount) || 0);
        if (e.detail.childCount !== undefined) setChildren(Number(e.detail.childCount) || 0);
        if (e.detail.infantCount !== undefined) setInfants(Number(e.detail.infantCount) || 0);
        if (e.detail.cabinClass) setCabinClass(e.detail.cabinClass);
        if (e.detail.specialFare) setSpecialFare(e.detail.specialFare);
      }
    };

    window.addEventListener('sart_flight_travellers_changed', handleCustomChange);
    window.addEventListener('storage', loadFromStorage);
    return () => {
      window.removeEventListener('sart_flight_travellers_changed', handleCustomChange);
      window.removeEventListener('storage', loadFromStorage);
    };
  }, []);

  const syncTravellersToStorage = (newAdults: number, newSeniors: number, newChildren: number, newInfants: number, newClass?: any) => {
    if (typeof window !== 'undefined') {
      const payload = {
        adultCount: newAdults,
        seniorCount: newSeniors,
        childCount: newChildren,
        infantCount: newInfants,
        cabinClass: newClass || cabinClass,
        specialFare,
        totalPassengers: newAdults + newSeniors + newChildren + newInfants
      };
      localStorage.setItem('sart_flight_travellers', JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent('sart_flight_travellers_changed', { detail: payload }));
    }
  };

  const totalTravelers = adults + seniors + children + infants;
  const passengerCounts = useMemo(() => ({
    adults,
    seniors,
    children,
    infants
  }), [adults, seniors, children, infants]);

  // Pricing calculation based on user requested passenger types:
  // - Adult: 100% of base fare
  // - Senior Citizen (>60 years): 10% concession (90% of base fare)
  // - Children (2 to 12 years): 25% concession (75% of base fare)
  // - Infant (under 2 years): flat nominal / ~20% of base fare (min ₹800, max ₹1500)
  const calculateFlightPrice = (baseAdultFare: number, counts: { adults: number; seniors: number; children: number; infants: number }) => {
    const a = Math.max(0, counts.adults || 0);
    const s = Math.max(0, counts.seniors || 0);
    const c = Math.max(0, counts.children || 0);
    const inf = Math.max(0, counts.infants || 0);

    if (a + s + c + inf === 0) return baseAdultFare;

    const adultPart = a * baseAdultFare;
    const seniorPart = s * Math.round(baseAdultFare * 0.90);
    const childPart = c * Math.round(baseAdultFare * 0.75);
    const infantPart = inf * Math.min(1500, Math.max(800, Math.round(baseAdultFare * 0.20)));

    return adultPart + seniorPart + childPart + infantPart;
  };

  const passengerSummaryText = useMemo(() => {
    const parts: string[] = [];
    if (adults > 0) parts.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
    if (seniors > 0) parts.push(`${seniors} Senior${seniors > 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} Child${children > 1 ? 'ren' : ''}`);
    if (infants > 0) parts.push(`${infants} Infant${infants > 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(', ') : '1 Adult';
  }, [adults, seniors, children, infants]);

  const travelerSummary = `${totalTravelers} Traveler${totalTravelers > 1 ? 's' : ''}${totalTravelers > 1 ? ` (${passengerSummaryText})` : ''}, ${cabinClass}`;

  const handleProceedToPassengerDetails = (selectedFlight: FlightItem, chosenFare: any) => {
    if (typeof window !== 'undefined') {
      const pending = {
        airline: selectedFlight.airline,
        flightNo: selectedFlight.flightNo,
        source: source.split('-')[0].trim(),
        sourceAirport: selectedFlight.depAirportCode,
        destination: destination.split('-')[0].trim(),
        destinationAirport: selectedFlight.arrAirportCode,
        depTime: selectedFlight.depTime,
        arrTime: selectedFlight.arrTime,
        fare: chosenFare.price,
        totalFare: chosenFare.price,
        fareTier: chosenFare.tag,
        dateOfJourney: effectiveDate,
        travelers: {
          adults,
          seniors,
          children,
          infants,
          total: totalTravelers,
          summary: passengerSummaryText
        }
      };
      localStorage.setItem('sart_pending_flight_booking', JSON.stringify(pending));
    }
    router.push('/home/ride/flight/PassengerDetails');
  };
  // Master list generated for the currently searched corridor
  const [flightsList, setFlightsList] = useState<FlightItem[]>(() => getFlightsForRoute(source, destination));

  useEffect(() => {
    let isMounted = true;
    const fetchFlights = async () => {
      try {
        const cleanSrc = source.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim();
        const cleanDst = destination.replace(/\s*-\s*[A-Z0-9]+$/i, '').trim();
        const dateQuery = dateOfJourney || new Date().toISOString().split('T')[0];

        const res = await fetch(`http://localhost:5000/api/flights/search?origin=${encodeURIComponent(cleanSrc)}&destination=${encodeURIComponent(cleanDst)}&date=${encodeURIComponent(dateQuery)}`);
        if (res.ok) {
          const result = await res.json();
          if (isMounted && result && result.success && Array.isArray(result.data) && result.data.length > 0) {
            setFlightsList(result.data);
            return;
          }
        }
      } catch (e) { }

      if (isMounted) {
        setFlightsList(getFlightsForRoute(source, destination));
      }
    };

    fetchFlights();
    return () => { isMounted = false; };
  }, [source, destination, dateOfJourney]);

  const rawFlights = flightsList;

  // Selected date carousel tab
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const dateFares = useMemo(() => {
    const faresList = [7721, 8703, 9882, 8495, 6667, 7120, 10644, 8250];
    const today = new Date();
    const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Array.from({ length: 8 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return {
        label: `${daysShort[d.getDay()]}, ${monthsShort[d.getMonth()]} ${d.getDate()}`,
        fare: calculateFlightPrice(faresList[i % faresList.length], passengerCounts)
      };
    });
  }, [passengerCounts]);

  // Sorting
  const [sortBy, setSortBy] = useState<'cheapest' | 'nonstop' | 'prefer' | 'departure'>('cheapest');

  // Filter States
  const [selectedStops, setSelectedStops] = useState<number[]>([]); // 0 = Non stop, 1 = 1 stop
  const [maxDuration, setMaxDuration] = useState<number>(700); // in minutes
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedLayovers, setSelectedLayovers] = useState<string[]>([]);
  const [layoverSearchText, setLayoverSearchText] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [checkInBaggageOnly, setCheckInBaggageOnly] = useState<boolean>(false);
  const [selectedAircraftSize, setSelectedAircraftSize] = useState<string[]>([]);

  // Accordion Toggles
  const [openSections, setOpenSections] = useState({
    stops: true,
    airlines: true,
    layovers: true,
    timePrice: true,
    baggage: true,
    aircraft: true
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      selectedStops.length > 0 ||
      maxDuration < 700 ||
      selectedAirlines.length > 0 ||
      selectedLayovers.length > 0 ||
      maxPrice < 25000 ||
      checkInBaggageOnly ||
      selectedAircraftSize.length > 0
    );
  }, [
    selectedStops,
    maxDuration,
    selectedAirlines,
    selectedLayovers,
    maxPrice,
    checkInBaggageOnly,
    selectedAircraftSize
  ]);

  // Clear all filters handler (Resets everything cleanly)
  const handleClearAllFilters = () => {
    setSelectedStops([]);
    setMaxDuration(700);
    setSelectedAirlines([]);
    setSelectedLayovers([]);
    setLayoverSearchText('');
    setMaxPrice(25000);
    setCheckInBaggageOnly(false);
    setSelectedAircraftSize([]);
  };

  // Filter computation
  const filteredFlights = useMemo(() => {
    let list = [...rawFlights];

    // Stops filter
    if (selectedStops.length > 0) {
      list = list.filter(f => selectedStops.includes(f.stopsCount));
    }

    // Max duration
    if (maxDuration < 700) {
      list = list.filter(f => f.durationMinutes <= maxDuration);
    }

    // Airlines
    if (selectedAirlines.length > 0) {
      list = list.filter(f => selectedAirlines.includes(f.airline));
    }

    // Layover Airports
    if (selectedLayovers.length > 0) {
      list = list.filter(f => f.layoverAirport && selectedLayovers.includes(f.layoverAirport));
    }

    // Max Price
    if (maxPrice < 25000) {
      list = list.filter(f => f.fare <= maxPrice);
    }

    // Baggage
    if (checkInBaggageOnly) {
      list = list.filter(f => f.baggageInfo.toLowerCase().includes('check-in'));
    }

    // Aircraft Size
    if (selectedAircraftSize.length > 0) {
      list = list.filter(f => selectedAircraftSize.includes(f.aircraftSize));
    }

    // Sorting
    if (sortBy === 'cheapest') {
      list.sort((a, b) => a.fare - b.fare);
    } else if (sortBy === 'nonstop') {
      list.sort((a, b) => a.stopsCount - b.stopsCount || a.fare - b.fare);
    } else if (sortBy === 'prefer') {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes || a.fare - b.fare);
    } else if (sortBy === 'departure') {
      list.sort((a, b) => a.depTime.localeCompare(b.depTime));
    }

    return list;
  }, [
    rawFlights,
    selectedStops,
    maxDuration,
    selectedAirlines,
    selectedLayovers,
    maxPrice,
    checkInBaggageOnly,
    selectedAircraftSize,
    sortBy
  ]);

  // Counts for checkboxes
  const airlineCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'Air India': 0,
      'Air India Express': 0,
      'IndiGo': 0
    };
    rawFlights.forEach(f => {
      if (counts[f.airline] !== undefined) {
        counts[f.airline]++;
      } else {
        counts[f.airline] = 1;
      }
    });
    return counts;
  }, [rawFlights]);

  const layoverAirportsList = ['Bengaluru', 'Hyderabad', 'Kochi', 'Madurai', 'Mumbai'];

  // Expanded flight for fare options breakdown (Images 1 & 2)
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);
  const [selectedFareMap, setSelectedFareMap] = useState<Record<string, string>>({});

  // Booked modal state
  const [selectedFlightModal, setSelectedFlightModal] = useState<FlightItem | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [passenger, setPassenger] = useState<FlightPassenger>({
    title: 'Mr',
    fullName: 'Full Name',
    age: '28',
    gender: 'Male',
    seatPreference: 'Window',
    mealPreference: 'Veg'
  });
  const [contact, setContact] = useState<FlightContactInfo>({
    email: 'name2000@example.com',
    phone: '+91 9876543210'
  });

  // Modal toggle for "More flight details" popup
  const [detailedFlightModal, setDetailedFlightModal] = useState<FlightItem | null>(null);

  return (
    <div className="fb-container">
      {/* ---------------- Top Travelers & Class Bar (Directly below mode icons) ---------------- */}
      <div className="fb-traveler-class-bar">
        <div className="fb-traveler-trigger-container">
          {/* <button
            type="button"
            className="fb-traveler-trigger-btn"
            onClick={() => setShowTravelerPopup(prev => !prev)}
          >
            <div className="fb-trigger-icon-wrap">
              <i className="fa-solid fa-user-group"></i>
            </div>
            <div className="fb-trigger-info">
              <span className="fb-trigger-label">Travelers & Cabin Class</span>
              <span className="fb-trigger-value">{travelerSummary}</span>
            </div>
            <i className={`fa-solid fa-chevron-${showTravelerPopup ? 'up' : 'down'} fb-trigger-arrow`}></i>
          </button> */}

          {/* Interactive Travelers & Class Selector Popup */}
          {showTravelerPopup && (
            <div className="fb-traveler-dropdown-modal">
              <div className="fb-dropdown-header">
                <h4>Select Travelers & Class</h4>
                <button
                  type="button"
                  className="fb-dropdown-close"
                  onClick={() => setShowTravelerPopup(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* Passenger Count Selection */}
              <div className="fb-pax-count-section">
                {/* Adults */}
                <div className="fb-pax-count-row">
                  <div>
                    <span className="fb-pax-type-title">Adults</span>
                    <span className="fb-pax-type-sub">12+ years</span>
                  </div>
                  <div className="fb-stepper-control">
                    <button
                      type="button"
                      disabled={adults <= 1 && seniors <= 0}
                      onClick={() => {
                        const next = Math.max(0, adults - 1);
                        setAdults(next);
                        syncTravellersToStorage(next, seniors, children, infants);
                      }}
                    >
                      −
                    </button>
                    <span className="fb-stepper-val">{adults}</span>
                    <button
                      type="button"
                      disabled={totalTravelers >= 9}
                      onClick={() => {
                        const next = Math.min(9, adults + 1);
                        setAdults(next);
                        syncTravellersToStorage(next, seniors, children, infants);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Senior Citizen (>60 years) */}
                <div className="fb-pax-count-row">
                  <div>
                    <span className="fb-pax-type-title">Senior Citizen</span>
                    <span className="fb-pax-type-sub">&gt;60 years (10% concession)</span>
                  </div>
                  <div className="fb-stepper-control">
                    <button
                      type="button"
                      disabled={seniors <= 0}
                      onClick={() => {
                        const next = Math.max(0, seniors - 1);
                        setSeniors(next);
                        syncTravellersToStorage(adults, next, children, infants);
                      }}
                    >
                      −
                    </button>
                    <span className="fb-stepper-val">{seniors}</span>
                    <button
                      type="button"
                      disabled={totalTravelers >= 9}
                      onClick={() => {
                        const next = Math.min(9, seniors + 1);
                        setSeniors(next);
                        syncTravellersToStorage(adults, next, children, infants);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="fb-pax-count-row">
                  <div>
                    <span className="fb-pax-type-title">Children</span>
                    <span className="fb-pax-type-sub">2 - 12 years (25% concession)</span>
                  </div>
                  <div className="fb-stepper-control">
                    <button
                      type="button"
                      disabled={children <= 0}
                      onClick={() => {
                        const next = Math.max(0, children - 1);
                        setChildren(next);
                        syncTravellersToStorage(adults, seniors, next, infants);
                      }}
                    >
                      −
                    </button>
                    <span className="fb-stepper-val">{children}</span>
                    <button
                      type="button"
                      disabled={totalTravelers >= 9}
                      onClick={() => {
                        const next = Math.min(6, children + 1);
                        setChildren(next);
                        syncTravellersToStorage(adults, seniors, next, infants);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="fb-pax-count-row">
                  <div>
                    <span className="fb-pax-type-title">Infants</span>
                    <span className="fb-pax-type-sub">Under 2 years (Lap infant)</span>
                  </div>
                  <div className="fb-stepper-control">
                    <button
                      type="button"
                      disabled={infants <= 0}
                      onClick={() => {
                        const next = Math.max(0, infants - 1);
                        setInfants(next);
                        syncTravellersToStorage(adults, seniors, children, next);
                      }}
                    >
                      −
                    </button>
                    <span className="fb-stepper-val">{infants}</span>
                    <button
                      type="button"
                      disabled={infants >= Math.max(1, adults + seniors)}
                      onClick={() => {
                        const next = Math.min(Math.max(1, adults + seniors), infants + 1);
                        setInfants(next);
                        syncTravellersToStorage(adults, seniors, children, next);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Cabin Class Selection */}
              <div className="fb-cabin-class-section">
                <span className="fb-cabin-title">Cabin Class</span>
                <div className="fb-cabin-pills">
                  {(['Economy', 'Premium Economy', 'Business'] as const).map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`fb-cabin-pill ${cabinClass === c ? 'active' : ''}`}
                      onClick={() => setCabinClass(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Done Action Button */}
              <div className="fb-dropdown-footer">
                <button
                  type="button"
                  className="fb-done-btn"
                  onClick={() => setShowTravelerPopup(false)}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- Main Layout (Sidebar + Results with Date Strip beside Navbar) ---------------- */}
      <div className="fb-main-layout">
        {/* Left Filter Sidebar */}
        <aside className="fb-sidebar">
          {/* Header with "Applied Filters" & "Clear All" */}
          <div className="fb-applied-filters-header">
            <span className="fb-applied-filters-title">Applied Filters</span>
            {hasActiveFilters && (
              <button
                type="button"
                className="fb-clear-all-btn"
                onClick={handleClearAllFilters}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Active Chips row if any active */}
          {hasActiveFilters && (
            <div className="fb-active-chips-wrap">
              {selectedStops.map(st => (
                <span key={`chip-st-${st}`} className="fb-active-chip">
                  {st === 0 ? 'Non Stop' : '1 Stop'}
                  <button
                    type="button"
                    className="fb-active-chip-remove"
                    onClick={() => setSelectedStops(prev => prev.filter(x => x !== st))}
                  >
                    ×
                  </button>
                </span>
              ))}
              {selectedAirlines.map(air => (
                <span key={`chip-air-${air}`} className="fb-active-chip">
                  {air}
                  <button
                    type="button"
                    className="fb-active-chip-remove"
                    onClick={() => setSelectedAirlines(prev => prev.filter(x => x !== air))}
                  >
                    ×
                  </button>
                </span>
              ))}
              {selectedLayovers.map(lay => (
                <span key={`chip-lay-${lay}`} className="fb-active-chip">
                  {lay}
                  <button
                    type="button"
                    className="fb-active-chip-remove"
                    onClick={() => setSelectedLayovers(prev => prev.filter(x => x !== lay))}
                  >
                    ×
                  </button>
                </span>
              ))}
              {maxPrice < 25000 && (
                <span className="fb-active-chip">
                  Under ₹{maxPrice}
                  <button
                    type="button"
                    className="fb-active-chip-remove"
                    onClick={() => setMaxPrice(25000)}
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {/* 1. Stops and Duration */}
          <div className="fb-filter-section">
            <div className="fb-section-header" onClick={() => toggleSection('stops')}>
              <span className="fb-section-title">Stops and Duration</span>
              <i className={`fa-solid fa-chevron-down fb-section-toggle-icon ${openSections.stops ? 'open' : ''}`}></i>
            </div>
            {openSections.stops && (
              <div>
                <div className="fb-sub-label">Stops</div>
                <div className="fb-stops-pill-row">
                  <button
                    type="button"
                    className={`fb-stops-pill ${selectedStops.includes(0) ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedStops(prev =>
                        prev.includes(0) ? prev.filter(x => x !== 0) : [...prev, 0]
                      );
                    }}
                  >
                    Non Stop ({rawFlights.filter(f => f.stopsCount === 0).length})
                  </button>
                  <button
                    type="button"
                    className={`fb-stops-pill ${selectedStops.includes(1) ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedStops(prev =>
                        prev.includes(1) ? prev.filter(x => x !== 1) : [...prev, 1]
                      );
                    }}
                  >
                    1 Stop ({rawFlights.filter(f => f.stopsCount === 1).length})
                  </button>
                </div>

                <div className="fb-sub-label" style={{ marginTop: '14px' }}>Duration</div>
                <div className="fb-slider-wrap">
                  <input
                    type="range"
                    min="105"
                    max="700"
                    step="15"
                    className="fb-slider-range-input"
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(Number(e.target.value))}
                  />
                  <div className="fb-slider-labels">
                    <span>1h 45m</span>
                    <span>{Math.floor(maxDuration / 60)}h {maxDuration % 60}m</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Airlines */}
          <div className="fb-filter-section">
            <div className="fb-section-header" onClick={() => toggleSection('airlines')}>
              <span className="fb-section-title">Airlines</span>
              <i className={`fa-solid fa-chevron-down fb-section-toggle-icon ${openSections.airlines ? 'open' : ''}`}></i>
            </div>
            {openSections.airlines && (
              <div style={{ marginTop: '10px' }}>
                {[
                  { name: 'Air India', color: '#dc2626', icon: 'fa-plane' },
                  { name: 'Air India Express', color: '#ea580c', icon: 'fa-bolt' },
                  { name: 'IndiGo', color: '#1d4ed8', icon: 'fa-plane-departure' }
                ].map(airline => (
                  <div
                    key={airline.name}
                    className="fb-checkbox-row"
                    onClick={() => {
                      setSelectedAirlines(prev =>
                        prev.includes(airline.name)
                          ? prev.filter(a => a !== airline.name)
                          : [...prev, airline.name]
                      );
                    }}
                  >
                    <div className="fb-checkbox-left">
                      <input
                        type="checkbox"
                        checked={selectedAirlines.includes(airline.name)}
                        onChange={() => { }}
                      />
                      <span className="fb-airline-logo-dot" style={{ background: airline.color }}>
                        <i className={`fa-solid ${airline.icon}`}></i>
                      </span>
                      <span>{airline.name}</span>
                    </div>
                    <span className="fb-checkbox-count">{airlineCounts[airline.name] || 0}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Layover Airports */}
          <div className="fb-filter-section">
            <div className="fb-section-header" onClick={() => toggleSection('layovers')}>
              <span className="fb-section-title">Layover Airports</span>
              <i className={`fa-solid fa-chevron-down fb-section-toggle-icon ${openSections.layovers ? 'open' : ''}`}></i>
            </div>
            {openSections.layovers && (
              <div>
                <div className="fb-filter-search-box">
                  <input
                    type="text"
                    className="fb-filter-search-input"
                    placeholder="Search layover city..."
                    value={layoverSearchText}
                    onChange={(e) => setLayoverSearchText(e.target.value)}
                  />
                </div>
                {layoverAirportsList
                  .filter(c => !layoverSearchText.trim() || c.toLowerCase().includes(layoverSearchText.toLowerCase()))
                  .map(city => (
                    <div
                      key={city}
                      className="fb-checkbox-row"
                      onClick={() => {
                        setSelectedLayovers(prev =>
                          prev.includes(city) ? prev.filter(x => x !== city) : [...prev, city]
                        );
                      }}
                    >
                      <div className="fb-checkbox-left">
                        <input
                          type="checkbox"
                          checked={selectedLayovers.includes(city)}
                          onChange={() => { }}
                        />
                        <span>{city}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* 4. Time and Price */}
          <div className="fb-filter-section">
            <div className="fb-section-header" onClick={() => toggleSection('timePrice')}>
              <span className="fb-section-title">Time and Price</span>
              <i className={`fa-solid fa-chevron-down fb-section-toggle-icon ${openSections.timePrice ? 'open' : ''}`}></i>
            </div>
            {openSections.timePrice && (
              <div>
                <div className="fb-sub-label">Flight Max Price</div>
                <div className="fb-slider-wrap">
                  <input
                    type="range"
                    min="7200"
                    max="25000"
                    step="500"
                    className="fb-slider-range-input"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                  <div className="fb-slider-labels">
                    <span>₹ 7,200</span>
                    <span>₹ {maxPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Baggage */}
          <div className="fb-filter-section">
            <div className="fb-section-header" onClick={() => toggleSection('baggage')}>
              <span className="fb-section-title">Baggage</span>
              <i className={`fa-solid fa-chevron-down fb-section-toggle-icon ${openSections.baggage ? 'open' : ''}`}></i>
            </div>
            {openSections.baggage && (
              <div style={{ marginTop: '10px' }}>
                <div
                  className="fb-checkbox-row"
                  onClick={() => setCheckInBaggageOnly(prev => !prev)}
                >
                  <div className="fb-checkbox-left">
                    <input
                      type="checkbox"
                      checked={checkInBaggageOnly}
                      onChange={() => { }}
                    />
                    <span>Check-in Baggage only</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. Aircraft Size */}
          <div className="fb-filter-section">
            <div className="fb-section-header" onClick={() => toggleSection('aircraft')}>
              <span className="fb-section-title">Aircraft Size</span>
              <i className={`fa-solid fa-chevron-down fb-section-toggle-icon ${openSections.aircraft ? 'open' : ''}`}></i>
            </div>
            {openSections.aircraft && (
              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  className={`fb-stops-pill ${selectedAircraftSize.includes('Small / Mid - size aircraft') ? 'active' : ''}`}
                  style={{ width: '100%' }}
                  onClick={() => {
                    setSelectedAircraftSize(prev =>
                      prev.includes('Small / Mid - size aircraft')
                        ? prev.filter(x => x !== 'Small / Mid - size aircraft')
                        : [...prev, 'Small / Mid - size aircraft']
                    );
                  }}
                >
                  Small / Mid - size aircraft ({rawFlights.length})
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Right Content Results */}
        <main className="fb-results-col">
          {/* ---------------- Date Fare Carousel Strip (Beside the Filter Sidebar) ---------------- */}
          <div className="fb-date-strip">
            <button
              type="button"
              className="fb-date-arrow-btn"
              onClick={() => setSelectedDateIdx(prev => Math.max(0, prev - 1))}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            {dateFares.map((df, idx) => (
              <div
                key={df.label}
                className={`fb-date-cell ${selectedDateIdx === idx ? 'active' : ''}`}
                onClick={() => setSelectedDateIdx(idx)}
              >
                <span className="fb-date-label">{df.label}</span>
                <span className={`fb-date-fare ${df.fare === 6667 ? 'highlight' : ''}`}>
                  ₹ {df.fare.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
            <button
              type="button"
              className="fb-date-arrow-btn"
              onClick={() => setSelectedDateIdx(prev => Math.min(dateFares.length - 1, prev + 1))}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          {/* Main Title Row */}
          <div className="fb-results-heading-row">
            <h2 className="fb-results-heading">
              Flights from {source.split('-')[0].trim()} to {destination.split('-')[0].trim()}
            </h2>
          </div>

          {/* Promo Coupons Cards Row */}
          <div className="fb-coupons-row">
            {FLIGHT_COUPONS.map(coupon => (
              <div key={coupon.code} className="fb-coupon-card">
                <div className="fb-coupon-left">
                  <div className="fb-coupon-badge-icon" style={{ background: coupon.color }}>
                    <i className="fa-solid fa-tag"></i>
                  </div>
                  <div className="fb-coupon-info">
                    <span className="fb-coupon-code">{coupon.title}</span>
                    <span className="fb-coupon-desc">{coupon.desc}</span>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right fb-coupon-arrow"></i>
              </div>
            ))}
          </div>

          {/* Sort Tabs */}
          <div className="fb-sort-bar">
            <button
              type="button"
              className={`fb-sort-tab ${sortBy === 'cheapest' ? 'active' : ''}`}
              onClick={() => setSortBy('cheapest')}
            >
              <span className="fb-sort-tab-title">Cheapest</span>
              <span className="fb-sort-tab-sub">₹ 7,721 | 04h 25m</span>
            </button>
            <button
              type="button"
              className={`fb-sort-tab ${sortBy === 'nonstop' ? 'active' : ''}`}
              onClick={() => setSortBy('nonstop')}
            >
              <span className="fb-sort-tab-title">Non Stop First</span>
              <span className="fb-sort-tab-sub">₹ 7,970 | 01h 45m</span>
            </button>
            <button
              type="button"
              className={`fb-sort-tab ${sortBy === 'nonstop' ? 'active' : ''}`}
              onClick={() => setSortBy('nonstop')}
            >
              <span className="fb-sort-tab-title">Non Stop First</span>
              <span className="fb-sort-tab-sub">₹ {calculateFlightPrice(7970, passengerCounts).toLocaleString('en-IN')} | 01h 45m</span>
            </button>
            <button
              type="button"
              className={`fb-sort-tab ${sortBy === 'prefer' ? 'active' : ''}`}
              onClick={() => setSortBy('prefer')}
            >
              <span className="fb-sort-tab-title">You May Prefer</span>
              <span className="fb-sort-tab-sub">₹ {calculateFlightPrice(7721, passengerCounts).toLocaleString('en-IN')} | 04h 25m</span>
            </button>
            <button
              type="button"
              className={`fb-sort-tab ${sortBy === 'departure' ? 'active' : ''}`}
              onClick={() => setSortBy('departure')}
            >
              <span className="fb-sort-tab-title">
                Departure Time <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i>
              </span>
              <span className="fb-sort-tab-sub">Earliest First</span>
            </button>
          </div>



          {/* Flights Listing Cards */}
          {filteredFlights.length === 0 ? (
            <div style={{ background: '#ffffff', borderRadius: '14px', padding: '40px 20px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
              <i className="fa-solid fa-plane-slash" style={{ fontSize: '36px', color: '#94a3b8', marginBottom: '12px' }}></i>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>No Flights Match Your Selected Filters</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>Try broadening your filters or reset to view all available flights on this route.</p>
              <button
                type="button"
                className="fb-clear-all-btn"
                style={{ background: '#0084ff', color: 'white', padding: '8px 18px' }}
                onClick={handleClearAllFilters}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredFlights.map((flight) => {
              const isExpanded = expandedFlightId === flight.id;
              const cardPrice = calculateFlightPrice(flight.fare, passengerCounts);
              const fareOptions = [
                {
                  id: 'lite',
                  tag: 'Lite fare',
                  exclusiveBadge: `✦ ${flight.airline} Exclusive ✦`,
                  price: calculateFlightPrice(Math.max(1000, Math.round(flight.fare * 0.92)), passengerCounts),
                  bluChips: Math.round(flight.fare * 0.08 * totalTravelers),
                  features: [
                    { text: '7 kg Cabin bag only', sub: 'Preferably under the seat', icon: 'fa-bag-shopping' },
                    { text: 'No check-in bag included', isAlert: true, icon: 'fa-ban' },
                    { text: 'Zero change and cancellation charges within 48 hours of booking', icon: 'fa-arrow-rotate-left' },
                    { text: 'Change and cancellation charges Standard', link: 'Standard', icon: 'fa-file-lines' }
                  ]
                },
                {
                  id: 'saver',
                  tag: 'Saver fare',
                  price: cardPrice,
                  bluChips: Math.round(flight.fare * 0.09 * totalTravelers),
                  features: [
                    { text: '7 kg Cabin bag allowance', icon: 'fa-bag-shopping' },
                    { text: '15 kg Check-in bag allowance', icon: 'fa-suitcase-rolling' },
                    { text: 'Zero change and cancellation charges within 48 hours of booking', icon: 'fa-arrow-rotate-left' },
                    { text: 'Change and cancellation charges Standard', link: 'Standard', icon: 'fa-file-lines' }
                  ],
                  offer: {
                    text: 'Avail Flexi plus fare benefits - For just ₹525, get benefits up to ₹4,900',
                    action: 'Upgrade'
                  },
                  inclusions: [
                    { text: 'Complimentary Meal', icon: 'fa-utensils' },
                    { text: 'Complimentary standard seat', icon: 'fa-chair' }
                  ]
                },
                {
                  id: 'flexi',
                  tag: 'Flexi plus fare',
                  price: calculateFlightPrice(Math.round(flight.fare * 1.08), passengerCounts),
                  bluChips: Math.round(flight.fare * 0.10 * totalTravelers),
                  features: [
                    { text: '7 kg Cabin bag allowance', icon: 'fa-bag-shopping' },
                    { text: '15 kg Check-in bag allowance', icon: 'fa-suitcase-rolling' },
                    { text: 'Zero change and cancellation charges within 48 hours of booking', icon: 'fa-arrow-rotate-left' },
                    { text: 'Change and cancellation charges Partial', link: 'Partial', icon: 'fa-file-lines' }
                  ],
                  inclusions: [
                    { text: 'Complimentary snack', icon: 'fa-utensils' },
                    { text: 'Complimentary standard seat', icon: 'fa-chair' }
                  ]
                },
                {
                  id: 'upfront',
                  tag: `${flight.airline} UpFront`,
                  isNew: true,
                  price: calculateFlightPrice(Math.round(flight.fare * 1.22), passengerCounts),
                  bluChips: Math.round(flight.fare * 0.12 * totalTravelers),
                  features: [
                    { text: '7 kg Cabin bag allowance', icon: 'fa-bag-shopping' },
                    { text: '15+5KG extra kg Check-in bag allowance', isHighlight: true, icon: 'fa-suitcase-rolling' },
                    { text: 'Zero cancellation charges within 48 hours of booking', icon: 'fa-arrow-rotate-left' },
                    { text: 'ZERO change fee', isHighlight: true, icon: 'fa-check' },
                    { text: 'Cancellation charges Low', link: 'Low', icon: 'fa-file-lines' }
                  ],
                  inclusions: [
                    { text: 'Complimentary snack', icon: 'fa-utensils' },
                    { text: 'First two row seats with extra legroom', isLink: true, icon: 'fa-chair' },
                    { text: 'Fast Forward not included', isMuted: true, icon: 'fa-person-walking' }
                  ]
                }
              ];
              const currentTierId = selectedFareMap[flight.id] || 'saver';
              const selectedTier = fareOptions.find((f) => f.id === currentTierId) || fareOptions[1];

              return (
                <div
                  key={flight.id}
                  className={`fb-flight-card ${isExpanded ? 'fb-flight-card-selected' : ''}`}
                  style={{
                    border: isExpanded ? '2px solid #0084ff' : '1px solid #e2e8f0',
                    boxShadow: isExpanded ? '0 6px 24px rgba(0, 132, 255, 0.16)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    borderRadius: '14px',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    className="fb-flight-main-row"
                    onClick={() => {
                      setExpandedFlightId((prev) => (prev === flight.id ? null : flight.id));
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Airline Col */}
                    <div className="fb-airline-col">
                      <div className="fb-airline-logo-box" style={{ color: flight.airlineLogoColor }}>
                        <i className="fa-solid fa-plane"></i>
                      </div>
                      <div>
                        <div className="fb-airline-name">{flight.airline}</div>
                        <div className="fb-flight-number">{flight.flightNo}</div>
                      </div>
                    </div>

                    {/* Schedule Col */}
                    <div className="fb-schedule-col">
                      <div className="fb-time-node">
                        <span className="fb-node-time">{flight.depTime}</span>
                        <span className="fb-node-airport">{flight.depAirportCode}</span>
                      </div>

                      <div className="fb-duration-track">
                        <span className="fb-track-duration">{flight.duration}</span>
                        <div className="fb-track-line"></div>
                        <span className={`fb-track-stops ${flight.stopsCount === 0 ? 'non-stop' : ''}`}>
                          {flight.stopsText}
                        </span>
                      </div>

                      <div className="fb-time-node">
                        <span className="fb-node-time">{flight.arrTime}</span>
                        <span className="fb-node-airport">{flight.arrAirportCode}</span>
                      </div>
                    </div>

                    {/* Fare and CTA Col */}
                    <div className="fb-fare-col">
                      <div className="fb-fare-price">₹ {cardPrice.toLocaleString('en-IN')}</div>
                      <div className="fb-fare-promo-tag">Get Flat 12% OFF using GOPNB</div>
                      {totalTravelers > 1 && (
                        <div style={{ fontSize: '10.5px', color: '#0284c7', fontWeight: 700, marginTop: '2px', textAlign: 'right' }}>
                          Total for {totalTravelers} Pax ({passengerSummaryText})
                        </div>
                      )}
                      <button
                        type="button"
                        className="fb-view-fares-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedFlightId((prev) => (prev === flight.id ? null : flight.id));
                        }}
                      >
                        {isExpanded ? (
                          <>
                            <span>HIDE FARES</span>
                            <i className="fa-solid fa-chevron-up" style={{ marginLeft: '6px', fontSize: '10px' }}></i>
                          </>
                        ) : (
                          <>
                            <span>VIEW FARES</span>
                            <i className="fa-solid fa-chevron-down" style={{ marginLeft: '6px', fontSize: '10px' }}></i>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Fare Options Breakdown (Matching Image 1) */}
                  {isExpanded && (
                    <div style={{
                      background: '#eef6ff',
                      borderRadius: '14px',
                      border: '1.5px solid #bce1fe',
                      padding: '16px',
                      margin: '0 14px 14px 14px'
                    }}>
                      {/* 3 Fare Cards Horizontal Scroll Grid (Image 2 style) */}
                      <div
                        className="fb-fare-cards-scroll-grid"
                        style={{
                          display: 'grid',
                          gridAutoFlow: 'column',
                          gridAutoColumns: 'calc((100% - 28px) / 3)',
                          gap: '14px',
                          overflowX: 'auto',
                          scrollSnapType: 'x mandatory',
                          paddingBottom: '8px'
                        }}
                      >
                        {fareOptions.map((opt) => {
                          const isChosen = currentTierId === opt.id;
                          return (
                            <div
                              key={opt.id}
                              className="fb-fare-card-item"
                              onClick={() => setSelectedFareMap((prev) => ({ ...prev, [flight.id]: opt.id }))}
                              style={{
                                border: isChosen ? '2.5px solid #00baf2' : '1px solid #cbd5e1',
                                background: '#ffffff',
                                borderRadius: '12px',
                                padding: '16px 14px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                position: 'relative',
                                scrollSnapAlign: 'start',
                                boxShadow: isChosen ? '0 4px 16px rgba(0, 186, 242, 0.18)' : '0 1px 3px rgba(0,0,0,0.03)',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div>
                                {/* Card Header Row */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', minHeight: '22px' }}>
                                  <span style={{ fontSize: '10.5px', color: '#0284c7', fontWeight: 700 }}>
                                    {opt.exclusiveBadge || (opt.isNew ? `↗ ${flight.airline} UpFront` : '')}
                                  </span>

                                  <span style={{
                                    background: opt.isNew ? '#000080' : (isChosen ? '#e0f2fe' : '#f1f5f9'),
                                    color: opt.isNew ? '#ffffff' : (isChosen ? '#0369a1' : '#475569'),
                                    fontSize: '10.5px',
                                    fontWeight: 800,
                                    padding: '3px 8px',
                                    borderRadius: '12px'
                                  }}>
                                    {opt.isNew ? 'New' : opt.tag}
                                  </span>
                                </div>

                                {/* Price */}
                                <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', lineHeight: '1.2' }}>
                                  ₹{opt.price.toLocaleString('en-IN')}
                                </div>
                                {totalTravelers > 1 && (
                                  <div style={{ fontSize: '9.5px', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                                    Total for {totalTravelers} Pax
                                  </div>
                                )}
                                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, marginTop: '2px', marginBottom: '12px' }}>
                                  + Earn {opt.bluChips} {flight.airline} BluChips
                                </div>

                                <div style={{ height: '1px', background: '#e2e8f0', borderStyle: 'dashed', marginBottom: '10px' }}></div>

                                {/* Benefits list */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#334155' }}>
                                  {opt.features.map((feat, fIdx) => (
                                    <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                      <i className={`fa-solid ${feat.icon}`} style={{ fontSize: '10px', color: feat.isAlert ? '#e11d48' : '#0284c7', marginTop: '2px' }}></i>
                                      <div>
                                        {feat.isAlert ? (
                                          <span style={{
                                            background: '#ffe4e6',
                                            color: '#e11d48',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontWeight: 700,
                                            fontSize: '10px'
                                          }}>
                                            {feat.text}
                                          </span>
                                        ) : (
                                          <span style={{ fontWeight: feat.isHighlight ? 700 : 500, color: feat.isHighlight ? '#047857' : '#334155' }}>
                                            {feat.text}
                                          </span>
                                        )}
                                        {feat.sub && (
                                          <div style={{ fontSize: '9.5px', color: '#64748b' }}>{feat.sub}</div>
                                        )}
                                        {feat.link && (
                                          <span style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'underline', marginLeft: '4px', cursor: 'pointer' }}>
                                            {feat.link}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}

                                  {/* Offer Box (Saver fare) */}
                                  {opt.offer && (
                                    <div style={{
                                      background: '#f0f9ff',
                                      border: '1px solid #bae6fd',
                                      borderRadius: '6px',
                                      padding: '8px',
                                      marginTop: '4px',
                                      marginBottom: '4px'
                                    }}>
                                      <div style={{ fontSize: '10px', color: '#0369a1', lineHeight: '1.3' }}>
                                        {opt.offer.text}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedFareMap((prev) => ({ ...prev, [flight.id]: 'flexi' }));
                                        }}
                                        style={{
                                          background: '#000080',
                                          color: '#ffffff',
                                          border: 'none',
                                          borderRadius: '12px',
                                          padding: '3px 10px',
                                          fontSize: '10px',
                                          fontWeight: 800,
                                          cursor: 'pointer',
                                          marginTop: '6px'
                                        }}
                                      >
                                        {opt.offer.action}
                                      </button>
                                    </div>
                                  )}

                                  {/* Inclusions (Meals, Seats) */}
                                  {opt.inclusions && opt.inclusions.map((inc, iIdx) => (
                                    <div key={iIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <i className={`fa-solid ${inc.icon}`} style={{ fontSize: '10px', color: '#16a34a' }}></i>
                                      <span style={{
                                        fontWeight: inc.isLink ? 700 : 500,
                                        color: inc.isMuted ? '#94a3b8' : (inc.isLink ? '#0284c7' : '#334155'),
                                        textDecoration: inc.isLink ? 'underline' : 'none'
                                      }}>
                                        {inc.text}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Selection Check Circle */}
                              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                                <div style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '50%',
                                  border: isChosen ? '5px solid #00baf2' : '1.5px solid #cbd5e1',
                                  background: '#ffffff',
                                  boxSizing: 'border-box'
                                }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Bottom Bar of Expanded Card (Image 1) */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '16px',
                        paddingTop: '12px',
                        borderTop: '1px solid #e2e8f0',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}>
                        {/* Left Links */}
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          <span>Compare fare types </span>
                          <span style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>Know more</span>
                          <span> | </span>
                          <span style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>Click here to know more about flight</span>
                        </div>

                        {/* Right Pricing & Continue CTA */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '10px', color: '#0284c7', fontWeight: 600 }}>
                              Book Return trip now & Save Big! Modify Booking
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '6px', marginTop: '2px' }}>
                              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 800 }}>TOTAL FARE</span>
                              <span style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
                                ₹{selectedTier.price.toLocaleString('en-IN')}
                              </span>
                              <span style={{ fontSize: '11px', color: '#0284c7', textDecoration: 'underline', cursor: 'pointer' }}>
                                View Details
                              </span>
                            </div>
                            {totalTravelers > 1 && (
                              <div style={{ fontSize: '10.5px', color: '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                                For {totalTravelers} Pax ({passengerSummaryText})
                              </div>
                            )}
                          </div>

                          {/* Continue Button (in place of Next, as requested) */}
                          <button
                            type="button"
                            onClick={() => handleProceedToPassengerDetails(flight, selectedTier)}
                            style={{
                              background: '#000080',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '24px',
                              padding: '9px 32px',
                              fontSize: '14px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              boxShadow: '0 3px 10px rgba(0, 0, 128, 0.25)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer amenities */}
                  <div className="fb-card-footer">
                    <div className="fb-amenities-pills">
                      <button type="button" className="fb-amenity-link">
                        <i className="fa-solid fa-mug-saucer"></i> Amenities
                      </button>
                      <button
                        type="button"
                        className="fb-amenity-link"
                        onClick={() => setDetailedFlightModal(flight)}
                      >
                        <i className="fa-solid fa-circle-info"></i> More flight details
                      </button>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      {flight.baggageInfo}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>

      {/* ---------------- Detailed Flight Breakdown POPUP MODAL (Matching Image UI) ---------------- */}
      {detailedFlightModal && (
        <div className="fb-popup-modal-overlay" onClick={() => setDetailedFlightModal(null)}>
          <div className="fb-popup-modal-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="fb-popup-modal-header">
              <div className="fb-details-header-left">
                <div className="fb-details-title-row">
                  <h3 className="fb-details-route-title">
                    {detailedFlightModal.depCity}{' '}
                    <i className="fa-solid fa-arrow-right" style={{ fontSize: '13px', margin: '0 6px', color: '#64748b' }}></i>{' '}
                    {detailedFlightModal.arrCity}
                  </h3>
                  <span className="fb-cancellation-badge">
                    {detailedFlightModal.freeCancellation ? 'FREE CANCELLATION APPLIES' : 'CANCELLATION FEES APPLY'}
                  </span>
                </div>
                <div className="fb-details-sub-row">
                  <span className="fb-details-date-pill">{dateOfJourney}</span>
                  <span className="fb-details-stops-duration">
                    {detailedFlightModal.stopsCount === 0 ? 'Non Stop' : '1 Stop'} • {detailedFlightModal.duration}
                  </span>
                </div>
              </div>
              <div className="fb-popup-header-right">
                <button
                  type="button"
                  className="fb-fare-rules-btn"
                  onClick={() => alert('Standard airline baggage & fare rules: Rescheduling permitted up to 2 hours before departure.')}
                >
                  View Fare Rules
                </button>
                <button
                  type="button"
                  className="fb-popup-close-btn"
                  onClick={() => setDetailedFlightModal(null)}
                  aria-label="Close"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="fb-popup-modal-body">
              {/* Segment 1 */}
              <div className="fb-segment-card">
                {/* Sub-header: Airline Logo, Code, Flight No, Aircraft type, Class */}
                <div className="fb-segment-meta-row">
                  <div className="fb-segment-meta-left">
                    <div className="fb-seg-airline-icon" style={{ background: detailedFlightModal.airlineLogoColor }}>
                      <i className="fa-solid fa-plane"></i>
                    </div>
                    <span className="fb-seg-airline-name">{detailedFlightModal.airline}</span>
                    <span className="fb-seg-flight-no">{detailedFlightModal.flightNo.split('|')[0]?.trim()}</span>
                    <span className="fb-aircraft-pill">Airbus A320</span>
                  </div>
                  <div className="fb-segment-meta-right">
                    <span className="fb-class-spec">
                      {cabinClass} &gt; <strong>GO SPECIAL</strong>
                    </span>
                  </div>
                </div>

                {/* Flight Path Tree: Departure and Arrival */}
                <div className="fb-timeline-tree">
                  {/* Departure Node */}
                  <div className="fb-timeline-node">
                    <div className="fb-timeline-time">{detailedFlightModal.depTime}</div>
                    <div className="fb-timeline-bullet"></div>
                    <div className="fb-timeline-place">
                      <span className="fb-place-city">{detailedFlightModal.depCity}</span>
                      <span className="fb-place-airport">
                        {detailedFlightModal.depCity} International Airport, Terminal T1
                      </span>
                    </div>
                    <div className="fb-timeline-amenity-icons">
                      <i className="fa-solid fa-wifi" title="In-flight Wi-Fi"></i>
                      <i className="fa-solid fa-mug-saucer" title="Refreshment Service"></i>
                    </div>
                  </div>

                  {/* Mid-route duration connector */}
                  <div className="fb-timeline-connector">
                    <span className="fb-connector-duration">
                      {detailedFlightModal.stopsCount === 0 ? detailedFlightModal.duration : '1h 05m'}
                    </span>
                  </div>

                  {/* Arrival Node (or Layover Node if 1 stop) */}
                  <div className="fb-timeline-node">
                    <div className="fb-timeline-time">
                      {detailedFlightModal.stopsCount === 0 ? detailedFlightModal.arrTime : '12:00'}
                    </div>
                    <div className="fb-timeline-bullet"></div>
                    <div className="fb-timeline-place">
                      <span className="fb-place-city">
                        {detailedFlightModal.stopsCount === 0 ? detailedFlightModal.arrCity : (detailedFlightModal.layoverAirport || 'Bengaluru')}
                      </span>
                      <span className="fb-place-airport">
                        {detailedFlightModal.stopsCount === 0
                          ? `${detailedFlightModal.arrCity} Airport`
                          : `Kempegowda International Airport ${detailedFlightModal.layoverAirport || 'Bengaluru'}, Terminal T1`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Baggage allowance strip */}
                <div className="fb-baggage-strip">
                  <div className="fb-baggage-item">
                    <i className="fa-solid fa-briefcase"></i>
                    <span>
                      <strong>Cabin Baggage:</strong> 7 Kgs (1 piece only) / Adult
                    </span>
                  </div>
                  <div className="fb-baggage-item">
                    <i className="fa-solid fa-suitcase-rolling"></i>
                    <span>
                      <strong>Check-In Baggage:</strong> 15 Kgs (1 piece only) / Adult
                    </span>
                  </div>
                </div>
              </div>

              {/* If 1 Stop: Show Change of Planes & Second Flight Segment */}
              {detailedFlightModal.stopsCount > 0 && (
                <>
                  {/* Change of Planes Bar (Exact Image Reference) */}
                  <div className="fb-layover-divider-bar">
                    <div className="fb-layover-connector-line"></div>
                    <div className="fb-layover-info-pill">
                      <span className="fb-layover-title">Change of planes</span>
                      <span className="fb-layover-time">
                        <strong>2h 15m</strong> Layover in {detailedFlightModal.layoverAirport || 'Bengaluru'}
                      </span>
                    </div>
                  </div>

                  {/* Segment 2 */}
                  <div className="fb-segment-card">
                    <div className="fb-segment-meta-row">
                      <div className="fb-segment-meta-left">
                        <div className="fb-seg-airline-icon" style={{ background: detailedFlightModal.airlineLogoColor }}>
                          <i className="fa-solid fa-plane"></i>
                        </div>
                        <span className="fb-seg-airline-name">{detailedFlightModal.airline}</span>
                        <span className="fb-seg-flight-no">
                          {detailedFlightModal.flightNo.split('|')[1]?.trim() || '6E-5306'}
                        </span>
                        <span className="fb-aircraft-pill">Airbus A321</span>
                      </div>
                      <div className="fb-segment-meta-right">
                        <span className="fb-class-spec">
                          {cabinClass} &gt; <strong>GO SPECIAL</strong>
                        </span>
                      </div>
                    </div>

                    <div className="fb-timeline-tree">
                      {/* Intermediate Departure */}
                      <div className="fb-timeline-node">
                        <div className="fb-timeline-time">14:15</div>
                        <div className="fb-timeline-bullet"></div>
                        <div className="fb-timeline-place">
                          <span className="fb-place-city">{detailedFlightModal.layoverAirport || 'Bengaluru'}</span>
                          <span className="fb-place-airport">
                            Kempegowda International Airport {detailedFlightModal.layoverAirport || 'Bengaluru'}, Terminal T1
                          </span>
                        </div>
                        <div className="fb-timeline-amenity-icons">
                          <i className="fa-solid fa-wifi" title="In-flight Wi-Fi"></i>
                          <i className="fa-solid fa-mug-saucer" title="Refreshment Service"></i>
                        </div>
                      </div>

                      {/* Second duration connector */}
                      <div className="fb-timeline-connector">
                        <span className="fb-connector-duration">1h 05m</span>
                      </div>

                      {/* Final Destination */}
                      <div className="fb-timeline-node">
                        <div className="fb-timeline-time">{detailedFlightModal.arrTime}</div>
                        <div className="fb-timeline-bullet"></div>
                        <div className="fb-timeline-place">
                          <span className="fb-place-city">{detailedFlightModal.arrCity}</span>
                          <span className="fb-place-airport">{detailedFlightModal.arrCity} International Airport</span>
                        </div>
                      </div>
                    </div>

                    {/* Baggage strip segment 2 */}
                    <div className="fb-baggage-strip">
                      <div className="fb-baggage-item">
                        <i className="fa-solid fa-briefcase"></i>
                        <span>
                          <strong>Cabin Baggage:</strong> 7 Kgs (1 piece only) / Adult
                        </span>
                      </div>
                      <div className="fb-baggage-item">
                        <i className="fa-solid fa-suitcase-rolling"></i>
                        <span>
                          <strong>Check-In Baggage:</strong> 15 Kgs (1 piece only) / Adult
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Flight Passenger Details Modal */}
      {selectedFlightModal && (
        <FlightPassengerDetailsModal
          airline={selectedFlightModal.airline}
          flightNo={selectedFlightModal.flightNo}
          source={source.split('-')[0].trim()}
          destination={destination.split('-')[0].trim()}
          depTime={selectedFlightModal.depTime}
          depAirportCode={selectedFlightModal.depAirportCode}
          arrTime={selectedFlightModal.arrTime}
          arrAirportCode={selectedFlightModal.arrAirportCode}
          fare={selectedFlightModal.fare}
          dateOfJourney={dateOfJourney}
          passenger={passenger}
          contact={contact}
          onPassengerChange={setPassenger}
          onContactChange={setContact}
          onConfirmBooking={() => setBookingConfirmed(true)}
          onClose={() => {
            setSelectedFlightModal(null);
            setBookingConfirmed(false);
          }}
          isConfirmed={bookingConfirmed}
        />
      )}
    </div>
  );
}
