'use client';

import React, { useState, useMemo } from 'react';
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
  const effectiveDate = useMemo(() => {
    if (dateOfJourney) return dateOfJourney;
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]}, ${now.getFullYear()}`;
  }, [dateOfJourney]);
  // Master list generated for the currently searched corridor
  const rawFlights = useMemo(() => {
    return getFlightsForRoute(source, destination);
  }, [source, destination]);

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
        fare: faresList[i % faresList.length]
      };
    });
  }, []);

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

  // Booked modal state
  const [selectedFlightModal, setSelectedFlightModal] = useState<FlightItem | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [passenger, setPassenger] = useState<FlightPassenger>({
    title: 'Mr',
    fullName: 'Alex Carter',
    age: '28',
    gender: 'Male',
    seatPreference: 'Window',
    mealPreference: 'Veg'
  });
  const [contact, setContact] = useState<FlightContactInfo>({
    email: 'alex.carter@example.com',
    phone: '+91 98765 43210'
  });

  // Travelers & Cabin Class state
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business'>('Economy');
  const [showTravelerPopup, setShowTravelerPopup] = useState<boolean>(false);

  // Modal toggle for "More flight details" popup
  const [detailedFlightModal, setDetailedFlightModal] = useState<FlightItem | null>(null);

  const totalTravelers = adults + children + infants;
  const travelerSummary = `${totalTravelers} Traveler${totalTravelers > 1 ? 's' : ''}, ${cabinClass}`;

  return (
    <div className="fb-container">
      {/* ---------------- Top Travelers & Class Bar (Directly below mode icons) ---------------- */}
      <div className="fb-traveler-class-bar">
        <div className="fb-traveler-trigger-container">
          <button
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
          </button>

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
                      disabled={adults <= 1}
                      onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                    >
                      −
                    </button>
                    <span className="fb-stepper-val">{adults}</span>
                    <button
                      type="button"
                      disabled={adults >= 9}
                      onClick={() => setAdults(prev => Math.min(9, prev + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="fb-pax-count-row">
                  <div>
                    <span className="fb-pax-type-title">Children</span>
                    <span className="fb-pax-type-sub">2 - 12 years</span>
                  </div>
                  <div className="fb-stepper-control">
                    <button
                      type="button"
                      disabled={children <= 0}
                      onClick={() => setChildren(prev => Math.max(0, prev - 1))}
                    >
                      −
                    </button>
                    <span className="fb-stepper-val">{children}</span>
                    <button
                      type="button"
                      disabled={children >= 6}
                      onClick={() => setChildren(prev => Math.min(6, prev + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="fb-pax-count-row">
                  <div>
                    <span className="fb-pax-type-title">Infants</span>
                    <span className="fb-pax-type-sub">Under 2 years</span>
                  </div>
                  <div className="fb-stepper-control">
                    <button
                      type="button"
                      disabled={infants <= 0}
                      onClick={() => setInfants(prev => Math.max(0, prev - 1))}
                    >
                      −
                    </button>
                    <span className="fb-stepper-val">{infants}</span>
                    <button
                      type="button"
                      disabled={infants >= adults}
                      onClick={() => setInfants(prev => Math.min(adults, prev + 1))}
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
              className={`fb-sort-tab ${sortBy === 'prefer' ? 'active' : ''}`}
              onClick={() => setSortBy('prefer')}
            >
              <span className="fb-sort-tab-title">You May Prefer</span>
              <span className="fb-sort-tab-sub">₹ 7,721 | 04h 25m</span>
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
            filteredFlights.map((flight) => (
              <div key={flight.id} className="fb-flight-card">
                <div className="fb-flight-main-row">
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
                    <div className="fb-fare-price">₹ {flight.fare.toLocaleString('en-IN')}</div>
                    <div className="fb-fare-promo-tag">Get Flat 12% OFF using GOPNB</div>
                    <button
                      type="button"
                      className="fb-view-fares-btn"
                      onClick={() => {
                        setSelectedFlightModal(flight);
                        setBookingConfirmed(false);
                      }}
                    >
                      VIEW FARES
                    </button>
                  </div>
                </div>

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
            ))
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
