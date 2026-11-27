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
import FlightFiltersSidebar from './FlightFiltersSidebar';
import FlightCardRow from './FlightCardRow';
import FlightDetailedModal from './FlightDetailedModal';

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

  // Cabin multiplier:
  // - Economy: 1.0x (standard fare)
  // - Premium Economy: 1.35x (+35% extra legroom & priority)
  // - Business: 2.85x (+185% luxury front cabin flatbed / XL recliner)
  const getCabinMultiplier = (cabin?: string) => {
    const c = (cabin || cabinClass || '').toLowerCase();
    if (c.includes('business')) return 2.85;
    if (c.includes('premium')) return 1.35;
    return 1.0;
  };

  const calculateFlightPrice = (
    baseAdultFare: number,
    counts: { adults: number; seniors: number; children: number; infants: number },
    cabin?: string
  ) => {
    const mult = getCabinMultiplier(cabin);
    const adjustedAdult = Math.round(baseAdultFare * mult);

    const a = Math.max(0, counts.adults || 0);
    const s = Math.max(0, counts.seniors || 0);
    const c = Math.max(0, counts.children || 0);
    const inf = Math.max(0, counts.infants || 0);

    if (a + s + c + inf === 0) return adjustedAdult;

    const adultPart = a * adjustedAdult;
    const seniorPart = s * Math.round(adjustedAdult * 0.90);
    const childPart = c * Math.round(adjustedAdult * 0.75);
    const infantPart = inf * Math.min(2500, Math.max(800, Math.round(adjustedAdult * 0.15)));

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
        fareTier: `${chosenFare.tag} | ${cabinClass}`,
        cabinClass: cabinClass,
        checkInBaggage: cabinClass === 'Business' ? '40 KG' : (cabinClass === 'Premium Economy' ? '25 KG' : '15 KG'),
        cabinBaggage: cabinClass === 'Business' ? '12 KG' : (cabinClass === 'Premium Economy' ? '10 KG' : '7 KG'),
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

  // Selected date carousel tab (re-calculates immediately when cabinClass changes)
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
        fare: calculateFlightPrice(faresList[i % faresList.length], passengerCounts, cabinClass)
      };
    });
  }, [passengerCounts, cabinClass]);

  // Sorting
  const [sortBy, setSortBy] = useState<'cheapest' | 'nonstop' | 'prefer' | 'departure'>('cheapest');

  // Filter States
  const [selectedStops, setSelectedStops] = useState<number[]>([]);
  const [maxDuration, setMaxDuration] = useState<number>(700);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedLayovers, setSelectedLayovers] = useState<string[]>([]);
  const [layoverSearchText, setLayoverSearchText] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(65000);
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
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasActiveFilters = useMemo(() => {
    return (
      selectedStops.length > 0 ||
      maxDuration < 700 ||
      selectedAirlines.length > 0 ||
      selectedLayovers.length > 0 ||
      maxPrice < 65000 ||
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

  const handleClearAllFilters = () => {
    setSelectedStops([]);
    setMaxDuration(700);
    setSelectedAirlines([]);
    setSelectedLayovers([]);
    setLayoverSearchText('');
    setMaxPrice(65000);
    setCheckInBaggageOnly(false);
    setSelectedAircraftSize([]);
  };

  // Filter computation
  const filteredFlights = useMemo(() => {
    let list = [...rawFlights];

    if (selectedStops.length > 0) {
      list = list.filter((f) => selectedStops.includes(f.stopsCount));
    }
    if (maxDuration < 700) {
      list = list.filter((f) => f.durationMinutes <= maxDuration);
    }
    if (selectedAirlines.length > 0) {
      list = list.filter((f) => selectedAirlines.includes(f.airline));
    }
    if (selectedLayovers.length > 0) {
      list = list.filter((f) => f.layoverAirport && selectedLayovers.includes(f.layoverAirport));
    }

    // Apply price filter using adjusted price with active cabinClass
    list = list.filter((f) => calculateFlightPrice(f.fare, passengerCounts, cabinClass) <= maxPrice);

    if (checkInBaggageOnly) {
      list = list.filter((f) => !f.baggageInfo.toLowerCase().includes('cabin baggage only'));
    }

    if (sortBy === 'cheapest') {
      list.sort((a, b) => a.fare - b.fare);
    } else if (sortBy === 'nonstop') {
      list.sort((a, b) => a.stopsCount - b.stopsCount || a.fare - b.fare);
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
    sortBy,
    passengerCounts,
    cabinClass
  ]);

  const airlineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rawFlights.forEach((f) => {
      counts[f.airline] = (counts[f.airline] || 0) + 1;
    });
    return counts;
  }, [rawFlights]);

  const layoverAirportsList = useMemo(() => {
    const setL = new Set<string>();
    rawFlights.forEach((f) => {
      if (f.layoverAirport) setL.add(f.layoverAirport);
    });
    return Array.from(setL);
  }, [rawFlights]);

  // Expanded Flight Card ID
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);
  const [selectedFareMap, setSelectedFareMap] = useState<Record<string, string>>({});

  // Detailed Modal State
  const [detailedFlightModal, setDetailedFlightModal] = useState<FlightItem | null>(null);

  // Fast-checkout Booking Modal
  const [selectedFlightModal, setSelectedFlightModal] = useState<FlightItem | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [passenger, setPassenger] = useState<FlightPassenger>({
    title: 'Mr',
    fullName: '',
    age: '',
    gender: 'Male',
    seatPreference: 'Window'
  });
  const [contact, setContact] = useState<FlightContactInfo>({
    email: '',
    phone: ''
  });

  // Dynamic Fare Options generator based on selected cabinClass
  const getFareOptions = (flight: FlightItem, cardPrice: number) => {
    if (cabinClass === 'Business') {
      return [
        {
          id: 'lite',
          tag: 'Business Saver',
          exclusiveBadge: `✦ ${flight.airline} Business ✦`,
          price: calculateFlightPrice(Math.round(flight.fare * 0.92), passengerCounts, 'Business'),
          bluChips: Math.round(flight.fare * 0.18 * totalTravelers),
          features: [
            { text: '12 kg Cabin bag allowance (2 pcs)', icon: 'fa-bag-shopping' },
            { text: '35 kg Check-in bag allowance', isHighlight: true, icon: 'fa-suitcase-rolling' },
            { text: 'Priority Check-in & Fast Track Boarding', icon: 'fa-user-check' },
            { text: 'Change charges: Standard', link: 'Standard', icon: 'fa-file-lines' }
          ],
          inclusions: [
            { text: 'Front XL Recliner Seat (Rows 1–3)', icon: 'fa-crown' },
            { text: 'Complimentary Hot Gourmet Meal', icon: 'fa-utensils' }
          ]
        },
        {
          id: 'saver',
          tag: 'Business Standard',
          price: cardPrice,
          bluChips: Math.round(flight.fare * 0.22 * totalTravelers),
          features: [
            { text: '12 kg Cabin bag allowance (2 pcs)', icon: 'fa-bag-shopping' },
            { text: '40 kg Check-in bag allowance', isHighlight: true, icon: 'fa-suitcase-rolling' },
            { text: 'Dedicated Airport Lounge Access Included', isHighlight: true, icon: 'fa-champagne-glasses' },
            { text: 'Zero change fee up to 24h prior', icon: 'fa-arrow-rotate-left' }
          ],
          offer: {
            text: 'Avail Business Elite Upgrade - VIP Meet & Assist at Terminal',
            action: 'Upgrade'
          },
          inclusions: [
            { text: 'Front XL Lie-flat / Recliner Seat (Rows 1–3)', icon: 'fa-crown' },
            { text: 'Multi-course Gourmet Dining & Bar', icon: 'fa-utensils' },
            { text: 'Priority Baggage Handling', icon: 'fa-plane-arrival' }
          ]
        },
        {
          id: 'flexi',
          tag: 'Business Elite',
          price: calculateFlightPrice(Math.round(flight.fare * 1.15), passengerCounts, 'Business'),
          bluChips: Math.round(flight.fare * 0.28 * totalTravelers),
          features: [
            { text: '15 kg Cabin bag allowance', icon: 'fa-bag-shopping' },
            { text: '45 kg Check-in bag allowance', isHighlight: true, icon: 'fa-suitcase-rolling' },
            { text: 'Zero change and cancellation fees anytime', isHighlight: true, icon: 'fa-circle-check' },
            { text: 'VIP Fast-track Security & Lounge Access', icon: 'fa-star' }
          ],
          inclusions: [
            { text: 'Choice of Any XL Business Seat (Rows 1–3)', icon: 'fa-crown' },
            { text: 'Premium Chef Curated Dining', icon: 'fa-utensils' },
            { text: 'Dedicated Chauffeur Airport Transfer', icon: 'fa-car' }
          ]
        }
      ];
    }

    if (cabinClass === 'Premium Economy') {
      return [
        {
          id: 'lite',
          tag: 'Premium Saver',
          exclusiveBadge: `✦ ${flight.airline} Premium ✦`,
          price: calculateFlightPrice(Math.round(flight.fare * 0.94), passengerCounts, 'Premium Economy'),
          bluChips: Math.round(flight.fare * 0.12 * totalTravelers),
          features: [
            { text: '10 kg Cabin bag allowance', icon: 'fa-bag-shopping' },
            { text: '20 kg Check-in bag allowance', icon: 'fa-suitcase-rolling' },
            { text: 'Standard change charges', link: 'Standard', icon: 'fa-file-lines' }
          ],
          inclusions: [
            { text: 'Extra Legroom Seating', icon: 'fa-chair' }
          ]
        },
        {
          id: 'saver',
          tag: 'Premium Economy',
          price: cardPrice,
          bluChips: Math.round(flight.fare * 0.15 * totalTravelers),
          features: [
            { text: '10 kg Cabin bag allowance', icon: 'fa-bag-shopping' },
            { text: '25 kg Check-in bag allowance', isHighlight: true, icon: 'fa-suitcase-rolling' },
            { text: 'Priority Boarding Lane', icon: 'fa-person-walking' },
            { text: 'Zero change charges within 48 hours', icon: 'fa-arrow-rotate-left' }
          ],
          inclusions: [
            { text: 'Extra Legroom Seating Included', icon: 'fa-chair' },
            { text: 'Complimentary Hot Meal & Drink', icon: 'fa-utensils' }
          ]
        },
        {
          id: 'flexi',
          tag: 'Premium Flexi',
          price: calculateFlightPrice(Math.round(flight.fare * 1.10), passengerCounts, 'Premium Economy'),
          bluChips: Math.round(flight.fare * 0.18 * totalTravelers),
          features: [
            { text: '10 kg Cabin bag allowance', icon: 'fa-bag-shopping' },
            { text: '30 kg Check-in bag allowance', isHighlight: true, icon: 'fa-suitcase-rolling' },
            { text: 'Zero cancellation & change charges', isHighlight: true, icon: 'fa-check' }
          ],
          inclusions: [
            { text: 'Extra Legroom Front Seat', icon: 'fa-chair' },
            { text: 'Complimentary Hot Meal & Beverage', icon: 'fa-utensils' }
          ]
        }
      ];
    }

    // Default Economy
    return [
      {
        id: 'lite',
        tag: 'Lite fare',
        exclusiveBadge: `✦ ${flight.airline} Exclusive ✦`,
        price: calculateFlightPrice(Math.max(1000, Math.round(flight.fare * 0.92)), passengerCounts, 'Economy'),
        bluChips: Math.round(flight.fare * 0.08 * totalTravelers),
        features: [
          { text: '7 kg Cabin bag only', sub: 'Preferably under the seat', icon: 'fa-bag-shopping' },
          { text: 'No check-in bag included', isAlert: true, icon: 'fa-ban' },
          { text: 'Zero change charges within 48h', icon: 'fa-arrow-rotate-left' }
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
          { text: 'Zero change charges within 48h', icon: 'fa-arrow-rotate-left' }
        ],
        offer: {
          text: 'Avail Flexi plus fare benefits - for benefits up to ₹4,900',
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
        price: calculateFlightPrice(Math.round(flight.fare * 1.08), passengerCounts, 'Economy'),
        bluChips: Math.round(flight.fare * 0.10 * totalTravelers),
        features: [
          { text: '7 kg Cabin bag allowance', icon: 'fa-bag-shopping' },
          { text: '15 kg Check-in bag allowance', icon: 'fa-suitcase-rolling' },
          { text: 'Zero change and partial cancellation refund', icon: 'fa-arrow-rotate-left' }
        ],
        inclusions: [
          { text: 'Complimentary snack', icon: 'fa-utensils' },
          { text: 'Complimentary standard seat', icon: 'fa-chair' }
        ]
      }
    ];
  };

  return (
    <div className="fb-results-container">
      {/* ---------------- Top Compact Search Summary Bar ---------------- */}
      <div className="fb-summary-bar">
        <div className="fb-summary-left">
          <div className="fb-summary-route">
            <span className="fb-route-city">{source.split('-')[0].trim()}</span>
            <span className="fb-route-code">({getAirportCode(source)})</span>
            <i className="fa-solid fa-arrow-right fb-route-arrow"></i>
            <span className="fb-route-city">{destination.split('-')[0].trim()}</span>
            <span className="fb-route-code">({getAirportCode(destination)})</span>
          </div>
          <div className="fb-summary-meta">
            <span>Departure: <strong>{effectiveDate}</strong></span>
            <span className="fb-meta-sep">•</span>
            <span style={{ color: cabinClass === 'Business' ? '#2563eb' : '#047857', fontWeight: 800 }}>
              {cabinClass === 'Business' ? '★ Business Class' : (cabinClass === 'Premium Economy' ? '✦ Premium Economy' : 'Economy')}
            </span>
            <span className="fb-meta-sep">•</span>
            <span>{totalTravelers} Traveler{totalTravelers > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Travelers & Cabin Class Selector Dropdown trigger */}
        <div className="fb-summary-right" style={{ position: 'relative' }}>
          <div
            className="fb-traveler-trigger-btn"
            onClick={() => setShowTravelerPopup((prev) => !prev)}
          >
            <i className="fa-solid fa-user-group fb-trigger-icon"></i>
            <div className="fb-trigger-info">
              <span className="fb-trigger-label">Travelers & Cabin Class</span>
              <span className="fb-trigger-value">{travelerSummary}</span>
            </div>
            <i className={`fa-solid fa-chevron-${showTravelerPopup ? 'up' : 'down'} fb-trigger-arrow`}></i>
          </div>

          {/* Travelers Dropdown Modal */}
          {showTravelerPopup && (
            <div className="fb-traveler-dropdown-panel" onClick={(e) => e.stopPropagation()}>
              <div className="fb-dropdown-header">
                <span className="fb-dropdown-title">Select Travelers & Cabin</span>
                <button
                  type="button"
                  className="fb-dropdown-close"
                  onClick={() => setShowTravelerPopup(false)}
                >
                  ✕
                </button>
              </div>

              {/* Counters */}
              <div className="fb-passengers-counters">
                {/* Adults */}
                <div className="fb-counter-row">
                  <div className="fb-counter-info">
                    <span className="fb-counter-name">Adults</span>
                    <span className="fb-counter-desc">12+ years</span>
                  </div>
                  <div className="fb-counter-controls">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => {
                        const next = Math.max(1, adults - 1);
                        setAdults(next);
                        syncTravellersToStorage(next, seniors, children, infants);
                      }}
                    >
                      -
                    </button>
                    <span>{adults}</span>
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

                {/* Senior Citizens */}
                <div className="fb-counter-row">
                  <div className="fb-counter-info">
                    <span className="fb-counter-name">Senior Citizens</span>
                    <span className="fb-counter-desc">&gt;60 years (10% concession)</span>
                  </div>
                  <div className="fb-counter-controls">
                    <button
                      type="button"
                      disabled={seniors <= 0}
                      onClick={() => {
                        const next = Math.max(0, seniors - 1);
                        setSeniors(next);
                        syncTravellersToStorage(adults, next, children, infants);
                      }}
                    >
                      -
                    </button>
                    <span>{seniors}</span>
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
                <div className="fb-counter-row">
                  <div className="fb-counter-info">
                    <span className="fb-counter-name">Children</span>
                    <span className="fb-counter-desc">2–12 years (25% concession)</span>
                  </div>
                  <div className="fb-counter-controls">
                    <button
                      type="button"
                      disabled={children <= 0}
                      onClick={() => {
                        const next = Math.max(0, children - 1);
                        setChildren(next);
                        syncTravellersToStorage(adults, seniors, next, infants);
                      }}
                    >
                      -
                    </button>
                    <span>{children}</span>
                    <button
                      type="button"
                      disabled={totalTravelers >= 9}
                      onClick={() => {
                        const next = Math.min(9, children + 1);
                        setChildren(next);
                        syncTravellersToStorage(adults, seniors, next, infants);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="fb-counter-row">
                  <div className="fb-counter-info">
                    <span className="fb-counter-name">Infants</span>
                    <span className="fb-counter-desc">Under 2 years (lap seat)</span>
                  </div>
                  <div className="fb-counter-controls">
                    <button
                      type="button"
                      disabled={infants <= 0}
                      onClick={() => {
                        const next = Math.max(0, infants - 1);
                        setInfants(next);
                        syncTravellersToStorage(adults, seniors, children, next);
                      }}
                    >
                      -
                    </button>
                    <span>{infants}</span>
                    <button
                      type="button"
                      disabled={infants >= adults}
                      onClick={() => {
                        const next = Math.min(adults, infants + 1);
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
                  {(['Economy', 'Premium Economy', 'Business'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`fb-cabin-pill ${cabinClass === c ? 'active' : ''}`}
                      onClick={() => {
                        setCabinClass(c);
                        syncTravellersToStorage(adults, seniors, children, infants, c);
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  {cabinClass === 'Business'
                    ? '★ Front XL Cabin (Rows 1–3) with flatbed seating & luxury dining. Higher pricing applies.'
                    : cabinClass === 'Premium Economy'
                      ? 'Rows 4–39 with extra legroom & priority boarding.'
                      : 'Standard Economy seating across Rows 4–39.'}
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

      {/* ---------------- Main Layout (Sidebar + Results with Date Strip) ---------------- */}
      <div className="fb-main-layout">
        {/* Left Filter Sidebar */}
        <FlightFiltersSidebar
          hasActiveFilters={hasActiveFilters}
          handleClearAllFilters={handleClearAllFilters}
          selectedStops={selectedStops}
          setSelectedStops={setSelectedStops}
          selectedAirlines={selectedAirlines}
          setSelectedAirlines={setSelectedAirlines}
          selectedLayovers={selectedLayovers}
          setSelectedLayovers={setSelectedLayovers}
          layoverSearchText={layoverSearchText}
          setLayoverSearchText={setLayoverSearchText}
          maxDuration={maxDuration}
          setMaxDuration={setMaxDuration}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          checkInBaggageOnly={checkInBaggageOnly}
          setCheckInBaggageOnly={setCheckInBaggageOnly}
          selectedAircraftSize={selectedAircraftSize}
          setSelectedAircraftSize={setSelectedAircraftSize}
          openSections={openSections}
          toggleSection={toggleSection}
          rawFlights={rawFlights}
          airlineCounts={airlineCounts}
          layoverAirportsList={layoverAirportsList}
        />

        {/* Right Content Results */}
        <main className="fb-results-col">
          {/* Date Fare Carousel Strip */}
          <div className="fb-date-strip">
            <button
              type="button"
              className="fb-date-arrow-btn"
              onClick={() => setSelectedDateIdx((prev) => Math.max(0, prev - 1))}
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
                <span className={`fb-date-fare ${idx === 0 ? 'highlight' : ''}`}>
                  ₹ {df.fare.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
            <button
              type="button"
              className="fb-date-arrow-btn"
              onClick={() => setSelectedDateIdx((prev) => Math.min(dateFares.length - 1, prev + 1))}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          {/* Main Title Row with Cabin Badge */}
          <div className="fb-results-heading-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="fb-results-heading">
              Flights from {source.split('-')[0].trim()} to {destination.split('-')[0].trim()}
            </h2>
            <span
              style={{
                background: cabinClass === 'Business' ? '#eff6ff' : (cabinClass === 'Premium Economy' ? '#f0fdf4' : '#f8fafc'),
                color: cabinClass === 'Business' ? '#1d4ed8' : (cabinClass === 'Premium Economy' ? '#15803d' : '#475569'),
                border: cabinClass === 'Business' ? '1.5px solid #93c5fd' : (cabinClass === 'Premium Economy' ? '1.5px solid #86efac' : '1px solid #e2e8f0'),
                padding: '5px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 800
              }}
            >
              {cabinClass === 'Business' ? '★ Business Class' : (cabinClass === 'Premium Economy' ? '✦ Premium Economy' : '✓ Economy')}
            </span>
          </div>

          {/* Promo Coupons Cards Row */}
          <div className="fb-coupons-row">
            {FLIGHT_COUPONS.map((coupon) => (
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
              <span className="fb-sort-tab-sub">₹ {calculateFlightPrice(7721, passengerCounts, cabinClass).toLocaleString('en-IN')} | 04h 25m</span>
            </button>
            <button
              type="button"
              className={`fb-sort-tab ${sortBy === 'nonstop' ? 'active' : ''}`}
              onClick={() => setSortBy('nonstop')}
            >
              <span className="fb-sort-tab-title">Non Stop First</span>
              <span className="fb-sort-tab-sub">₹ {calculateFlightPrice(7970, passengerCounts, cabinClass).toLocaleString('en-IN')} | 01h 45m</span>
            </button>
            <button
              type="button"
              className={`fb-sort-tab ${sortBy === 'prefer' ? 'active' : ''}`}
              onClick={() => setSortBy('prefer')}
            >
              <span className="fb-sort-tab-title">You May Prefer</span>
              <span className="fb-sort-tab-sub">₹ {calculateFlightPrice(7721, passengerCounts, cabinClass).toLocaleString('en-IN')} | 04h 25m</span>
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
              const cardPrice = calculateFlightPrice(flight.fare, passengerCounts, cabinClass);
              const fareOptions = getFareOptions(flight, cardPrice);
              const currentTierId = selectedFareMap[flight.id] || 'saver';
              const selectedTier = fareOptions.find((f) => f.id === currentTierId) || fareOptions[1];

              return (
                <FlightCardRow
                  key={flight.id}
                  flight={flight}
                  isExpanded={isExpanded}
                  setExpandedFlightId={setExpandedFlightId}
                  selectedFareMap={selectedFareMap}
                  setSelectedFareMap={setSelectedFareMap}
                  cardPrice={cardPrice}
                  fareOptions={fareOptions}
                  currentTierId={currentTierId}
                  selectedTier={selectedTier}
                  totalTravelers={totalTravelers}
                  passengerSummaryText={passengerSummaryText}
                  handleProceedToPassengerDetails={handleProceedToPassengerDetails}
                  setDetailedFlightModal={setDetailedFlightModal}
                />
              );
            })
          )}
        </main>
      </div>

      {/* Detailed Itinerary Modal */}
      <FlightDetailedModal
        detailedFlightModal={detailedFlightModal}
        setDetailedFlightModal={setDetailedFlightModal}
        cabinClass={cabinClass}
      />

      {/* Flight Passenger Fast Checkout Modal */}
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
