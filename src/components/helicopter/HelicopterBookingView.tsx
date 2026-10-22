'use client';

import React, { useState, useMemo } from 'react';
import './HelicopterBookingView.css';
import {
  HelicopterItem,
  getHelicoptersForRoute,
  HELICOPTER_COUPONS,
  getHelipadCode
} from './helicopterData';
import HelicopterPassengerDetailsModal, {
  HelicopterPassenger,
  HelicopterContactInfo
} from './HelicopterPassengerDetails';

interface HelicopterBookingViewProps {
  source: string;
  destination: string;
  dateOfJourney?: string;
}

export default function HelicopterBookingView({
  source,
  destination,
  dateOfJourney
}: HelicopterBookingViewProps) {
  const effectiveDate = useMemo(() => {
    if (dateOfJourney) return dateOfJourney;
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]}, ${now.getFullYear()}`;
  }, [dateOfJourney]);
  // Generate helicopter charter options for route
  const rawHelicopters = useMemo(() => {
    return getHelicoptersForRoute(source, destination);
  }, [source, destination]);

  // Selected date carousel tab
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const dateFares = useMemo(() => {
    const faresList = [22800, 24900, 31500, 28500, 22800, 23500, 24900, 26500];
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
  const [sortBy, setSortBy] = useState<'cheapest' | 'direct' | 'speed' | 'departure'>('cheapest');

  // Filter States
  const [selectedStops, setSelectedStops] = useState<number[]>([]); // 0 = Direct, 1 = 1 Stop
  const [maxDuration, setMaxDuration] = useState<number>(120); // in minutes
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [freeCancellationOnly, setFreeCancellationOnly] = useState<boolean>(false);
  const [selectedHeliModel, setSelectedHeliModel] = useState<string[]>([]);

  // Accordion Toggles
  const [openSections, setOpenSections] = useState({
    stops: true,
    operators: true,
    timePrice: true,
    model: true,
    cancellation: true
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasActiveFilters = useMemo(() => {
    return (
      selectedStops.length > 0 ||
      maxDuration < 120 ||
      selectedOperators.length > 0 ||
      maxPrice < 50000 ||
      freeCancellationOnly ||
      selectedHeliModel.length > 0
    );
  }, [
    selectedStops,
    maxDuration,
    selectedOperators,
    maxPrice,
    freeCancellationOnly,
    selectedHeliModel
  ]);

  const handleClearAllFilters = () => {
    setSelectedStops([]);
    setMaxDuration(120);
    setSelectedOperators([]);
    setMaxPrice(50000);
    setFreeCancellationOnly(false);
    setSelectedHeliModel([]);
  };

  // Filter & Sort Logic
  const filteredHelis = useMemo(() => {
    let list = [...rawHelicopters];

    if (selectedStops.length > 0) {
      list = list.filter(h => selectedStops.includes(h.stopsCount));
    }
    if (maxDuration < 120) {
      list = list.filter(h => h.durationMinutes <= maxDuration);
    }
    if (selectedOperators.length > 0) {
      list = list.filter(h => selectedOperators.includes(h.operator));
    }
    if (maxPrice < 50000) {
      list = list.filter(h => h.fare <= maxPrice);
    }
    if (freeCancellationOnly) {
      list = list.filter(h => h.freeCancellation === true);
    }
    if (selectedHeliModel.length > 0) {
      list = list.filter(h => selectedHeliModel.some(m => h.heliModel.toLowerCase().includes(m.toLowerCase())));
    }

    if (sortBy === 'cheapest') {
      list.sort((a, b) => a.fare - b.fare);
    } else if (sortBy === 'direct') {
      list.sort((a, b) => a.stopsCount - b.stopsCount);
    } else if (sortBy === 'speed') {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    } else if (sortBy === 'departure') {
      list.sort((a, b) => a.depTime.localeCompare(b.depTime));
    }

    return list;
  }, [
    rawHelicopters,
    selectedStops,
    maxDuration,
    selectedOperators,
    maxPrice,
    freeCancellationOnly,
    selectedHeliModel,
    sortBy
  ]);

  // Operator counts
  const operatorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rawHelicopters.forEach(h => {
      counts[h.operator] = (counts[h.operator] || 0) + 1;
    });
    return counts;
  }, [rawHelicopters]);

  // Modal State
  const [selectedHeliModal, setSelectedHeliModal] = useState<HelicopterItem | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [detailedHeliModal, setDetailedHeliModal] = useState<HelicopterItem | null>(null);

  const [passenger, setPassenger] = useState<HelicopterPassenger>({
    title: 'Mr',
    fullName: 'Capt. Vikram Singhania',
    age: '34',
    gender: 'Male',
    seatPreference: 'Front Co-Pilot View Seat',
    weightKg: '74'
  });

  const [contact, setContact] = useState<HelicopterContactInfo>({
    email: 'vikram.singhania@sart.in',
    phone: '+91 98765 43210'
  });

  // Passengers & Helipad Priority
  const [passengersCount, setPassengersCount] = useState<number>(1);
  const [showPassengerPopup, setShowPassengerPopup] = useState<boolean>(false);

  return (
    <div className="hb-container">
      {/* ---------------- Top VIP Helipad Bar (Directly below mode icons) ---------------- */}
      <div className="hb-traveler-class-bar">
        <div className="hb-traveler-trigger-container">
          <button
            type="button"
            className="hb-traveler-trigger-btn"
            onClick={() => setShowPassengerPopup(prev => !prev)}
          >
            <div className="hb-trigger-icon-wrap">
              <i className="fa-solid fa-helicopter"></i>
            </div>
            <div className="hb-trigger-info">
              <span className="hb-trigger-label">Helipad Charter Party</span>
              <span className="hb-trigger-value">{passengersCount} Passenger{passengersCount > 1 ? 's' : ''}, Executive Club</span>
            </div>
            <i className={`fa-solid fa-chevron-${showPassengerPopup ? 'up' : 'down'} hb-trigger-arrow`}></i>
          </button>

          {showPassengerPopup && (
            <div className="hb-traveler-dropdown-modal">
              <div className="hb-dropdown-header">
                <h4>Helicopter Party Size</h4>
                <button
                  type="button"
                  className="hb-dropdown-close"
                  onClick={() => setShowPassengerPopup(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="hb-counter-row">
                <div>
                  <span className="hb-counter-title">Helicopter Passengers</span>
                  <span className="hb-counter-sub">Standard turbine seat occupancy</span>
                </div>
                <div className="hb-counter-controls">
                  <button
                    type="button"
                    className="hb-count-btn"
                    onClick={() => setPassengersCount(prev => Math.max(1, prev - 1))}
                    disabled={passengersCount <= 1}
                  >
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <span className="hb-count-num">{passengersCount}</span>
                  <button
                    type="button"
                    className="hb-count-btn"
                    onClick={() => setPassengersCount(prev => Math.min(8, prev + 1))}
                    disabled={passengersCount >= 8}
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>

              <div className="hb-dropdown-footer">
                <button
                  type="button"
                  className="hb-apply-btn"
                  onClick={() => setShowPassengerPopup(false)}
                >
                  Apply Party Size
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hb-quick-badges-strip">
          <span className="hb-quick-badge"><i className="fa-solid fa-shield-halved"></i> DGCA Air Safety Approved</span>
          <span className="hb-quick-badge"><i className="fa-solid fa-route"></i> Rooftop &amp; Helipad Direct</span>
          <span className="hb-quick-badge"><i className="fa-solid fa-bolt"></i> Instant Helipad Clearance</span>
        </div>
      </div>

      {/* ---------------- Main Layout Grid: Left Sidebar Filters + Right Listings ---------------- */}
      <div className="hb-main-grid">
        {/* Left Filter Sidebar */}
        <aside className="hb-filter-sidebar">
          <div className="hb-filter-header">
            <span className="hb-filter-title">Filter Helicopter Charters</span>
            {hasActiveFilters && (
              <button
                type="button"
                className="hb-clear-all-link"
                onClick={handleClearAllFilters}
              >
                Clear All
              </button>
            )}
          </div>

          {/* Active Chips */}
          {hasActiveFilters && (
            <div className="hb-active-chips-wrap">
              {selectedStops.length > 0 && selectedStops.map(s => (
                <span key={s} className="hb-active-chip">
                  {s === 0 ? 'Direct Helipad Hop' : '1 Refuel Stop'}
                  <button type="button" onClick={() => setSelectedStops(prev => prev.filter(x => x !== s))}>×</button>
                </span>
              ))}
              {selectedOperators.map(op => (
                <span key={op} className="hb-active-chip">
                  {op}
                  <button type="button" onClick={() => setSelectedOperators(prev => prev.filter(x => x !== op))}>×</button>
                </span>
              ))}
              {maxPrice < 50000 && (
                <span className="hb-active-chip">
                  Under ₹{maxPrice.toLocaleString()}
                  <button type="button" onClick={() => setMaxPrice(50000)}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Section: Stops */}
          <div className="hb-filter-section">
            <div className="hb-section-header" onClick={() => toggleSection('stops')}>
              <span>Hop Type</span>
              <i className={`fa-solid fa-chevron-${openSections.stops ? 'up' : 'down'}`}></i>
            </div>
            {openSections.stops && (
              <div className="hb-section-body">
                <label className="hb-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedStops.includes(0)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedStops(prev => [...prev, 0]);
                      else setSelectedStops(prev => prev.filter(x => x !== 0));
                    }}
                  />
                  <span>Direct Helipad Hop ({rawHelicopters.filter(h => h.stopsCount === 0).length})</span>
                </label>
                <label className="hb-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedStops.includes(1)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedStops(prev => [...prev, 1]);
                      else setSelectedStops(prev => prev.filter(x => x !== 1));
                    }}
                  />
                  <span>1 Refuel Waypoint ({rawHelicopters.filter(h => h.stopsCount === 1).length})</span>
                </label>
              </div>
            )}
          </div>

          {/* Section: Max Duration */}
          <div className="hb-filter-section">
            <div className="hb-section-header" onClick={() => toggleSection('timePrice')}>
              <span>Max Flight Duration</span>
              <i className={`fa-solid fa-chevron-${openSections.timePrice ? 'up' : 'down'}`}></i>
            </div>
            {openSections.timePrice && (
              <div className="hb-section-body">
                <div className="hb-range-value">Up to {maxDuration} mins</div>
                <input
                  type="range"
                  min="60"
                  max="120"
                  step="5"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(Number(e.target.value))}
                  className="hb-range-slider"
                />
              </div>
            )}
          </div>

          {/* Section: Helicopter Operators */}
          <div className="hb-filter-section">
            <div className="hb-section-header" onClick={() => toggleSection('operators')}>
              <span>Helicopter Operators</span>
              <i className={`fa-solid fa-chevron-${openSections.operators ? 'up' : 'down'}`}></i>
            </div>
            {openSections.operators && (
              <div className="hb-section-body">
                {Object.entries(operatorCounts).map(([op, count]) => (
                  <label key={op} className="hb-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedOperators.includes(op)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedOperators(prev => [...prev, op]);
                        else setSelectedOperators(prev => prev.filter(x => x !== op));
                      }}
                    />
                    <span>{op} ({count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Section: Heli Models */}
          <div className="hb-filter-section">
            <div className="hb-section-header" onClick={() => toggleSection('model')}>
              <span>Aircraft / Turbine Family</span>
              <i className={`fa-solid fa-chevron-${openSections.model ? 'up' : 'down'}`}></i>
            </div>
            {openSections.model && (
              <div className="hb-section-body">
                {['Bell', 'Airbus', 'AgustaWestland', 'Sikorsky'].map(m => (
                  <label key={m} className="hb-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedHeliModel.includes(m)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedHeliModel(prev => [...prev, m]);
                        else setSelectedHeliModel(prev => prev.filter(x => x !== m));
                      }}
                    />
                    <span>{m} Turbine Series</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Section: Free Cancellation */}
          <div className="hb-filter-section">
            <div className="hb-section-header" onClick={() => toggleSection('cancellation')}>
              <span>Cancellation Policy</span>
              <i className={`fa-solid fa-chevron-${openSections.cancellation ? 'up' : 'down'}`}></i>
            </div>
            {openSections.cancellation && (
              <div className="hb-section-body">
                <label className="hb-checkbox-label">
                  <input
                    type="checkbox"
                    checked={freeCancellationOnly}
                    onChange={(e) => setFreeCancellationOnly(e.target.checked)}
                  />
                  <span>Free Cancellation ({rawHelicopters.filter(h => h.freeCancellation).length})</span>
                </label>
              </div>
            )}
          </div>
        </aside>

        {/* Right Listings Column */}
        <main className="hb-content-column">
          {/* Corridor Title Banner */}
          <div className="hb-corridor-title-banner">
            <div>
              <h2>
                Helicopters from {source.split('-')[0].trim()} ({getHelipadCode(source)}) to {destination.split('-')[0].trim()} ({getHelipadCode(destination)})
              </h2>
              <p>Direct private charter &amp; shared helipad hops • {filteredHelis.length} chartered choppers available</p>
            </div>
            <span className="hb-dgca-tag">
              <i className="fa-solid fa-shield-check"></i> DGCA Air Carrier Certified
            </span>
          </div>

          {/* Date Fares Carousel */}
          <div className="hb-date-fare-carousel">
            {dateFares.map((df, idx) => (
              <button
                key={df.label}
                type="button"
                className={`hb-date-tab ${selectedDateIdx === idx ? 'active' : ''}`}
                onClick={() => setSelectedDateIdx(idx)}
              >
                <span className="hb-date-tab-label">{df.label}</span>
                <span className="hb-date-tab-fare">₹ {df.fare.toLocaleString()}</span>
              </button>
            ))}
          </div>

          {/* Promotional Offers Row */}
          <div className="hb-promos-row">
            {HELICOPTER_COUPONS.map((coupon) => (
              <div key={coupon.code} className="hb-coupon-card" style={{ borderLeftColor: coupon.color }}>
                <div className="hb-coupon-content">
                  <div className="hb-coupon-code-badge" style={{ color: coupon.color, backgroundColor: `${coupon.color}15` }}>
                    <i className="fa-solid fa-tag"></i> {coupon.code}
                  </div>
                  <span className="hb-coupon-desc">{coupon.desc}</span>
                </div>
                <i className="fa-solid fa-chevron-right hb-coupon-arrow"></i>
              </div>
            ))}
          </div>

          {/* Sort Tabs */}
          <div className="hb-sort-bar">
            <button
              type="button"
              className={`hb-sort-tab ${sortBy === 'cheapest' ? 'active' : ''}`}
              onClick={() => setSortBy('cheapest')}
            >
              <span className="hb-sort-tab-title">Cheapest</span>
              <span className="hb-sort-tab-sub">₹ 22,800 | 01h 40m</span>
            </button>
            <button
              type="button"
              className={`hb-sort-tab ${sortBy === 'direct' ? 'active' : ''}`}
              onClick={() => setSortBy('direct')}
            >
              <span className="hb-sort-tab-title">Direct Helipad First</span>
              <span className="hb-sort-tab-sub">₹ 28,500 | 01h 15m</span>
            </button>
            <button
              type="button"
              className={`hb-sort-tab ${sortBy === 'speed' ? 'active' : ''}`}
              onClick={() => setSortBy('speed')}
            >
              <span className="hb-sort-tab-title">Fastest Cruise</span>
              <span className="hb-sort-tab-sub">01h 10m | 306 km/h</span>
            </button>
            <button
              type="button"
              className={`hb-sort-tab ${sortBy === 'departure' ? 'active' : ''}`}
              onClick={() => setSortBy('departure')}
            >
              <span className="hb-sort-tab-title">
                Departure Time <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i>
              </span>
              <span className="hb-sort-tab-sub">Earliest First</span>
            </button>
          </div>

          {/* Helicopter Listing Cards */}
          {filteredHelis.length === 0 ? (
            <div className="hb-no-results-card">
              <i className="fa-solid fa-helicopter" style={{ fontSize: '38px', color: '#94a3b8', marginBottom: '12px' }}></i>
              <h3>No Helicopter Charters Match Your Selected Filters</h3>
              <p>Try resetting filters to view all available helicopter hops on this corridor.</p>
              <button
                type="button"
                className="hb-reset-btn"
                onClick={handleClearAllFilters}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredHelis.map((heli) => (
              <div key={heli.id} className="hb-heli-card">
                <div className="hb-heli-main-row">
                  {/* Operator Col */}
                  <div className="hb-operator-col">
                    <div className="hb-operator-logo-box" style={{ color: heli.operatorLogoColor, backgroundColor: `${heli.operatorLogoColor}18` }}>
                      <i className="fa-solid fa-helicopter"></i>
                    </div>
                    <div>
                      <div className="hb-operator-name">{heli.operator}</div>
                      <div className="hb-heli-number">{heli.heliNo} • {heli.heliModel}</div>
                    </div>
                  </div>

                  {/* Schedule Col */}
                  <div className="hb-schedule-col">
                    <div className="hb-time-node">
                      <span className="hb-node-time">{heli.depTime}</span>
                      <span className="hb-node-helipad">{heli.depHeliCode}</span>
                    </div>

                    <div className="hb-duration-track">
                      <span className="hb-track-duration">{heli.duration}</span>
                      <div className="hb-track-line"></div>
                      <span className={`hb-track-stops ${heli.stopsCount === 0 ? 'direct' : ''}`}>
                        {heli.stopsText}
                      </span>
                    </div>

                    <div className="hb-time-node">
                      <span className="hb-node-time">{heli.arrTime}</span>
                      <span className="hb-node-helipad">{heli.arrHeliCode}</span>
                    </div>
                  </div>

                  {/* Price & Action Col */}
                  <div className="hb-price-col">
                    <div className="hb-price-main">₹ {heli.fare.toLocaleString()}</div>
                    <span className="hb-per-passenger-sub">per seat / charter pass</span>

                    <button
                      type="button"
                      className="hb-book-btn"
                      onClick={() => {
                        setSelectedHeliModal(heli);
                        setBookingConfirmed(false);
                      }}
                    >
                      Book Helipad Seat <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>

                {/* Card Sub-Bar */}
                <div className="hb-heli-footer-row">
                  <div className="hb-footer-badges">
                    <span className="hb-badge"><i className="fa-solid fa-suitcase"></i> {heli.baggageInfo}</span>
                    <span className="hb-badge"><i className="fa-solid fa-chair"></i> {heli.seatingCapacity}</span>
                    <span className="hb-badge"><i className="fa-solid fa-gauge-high"></i> Cruise: {heli.cruisingSpeed}</span>
                    {heli.freeCancellation && (
                      <span className="hb-badge hb-badge-green"><i className="fa-solid fa-circle-check"></i> Free Cancellation</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="hb-details-link"
                    onClick={() => setDetailedHeliModal(heli)}
                  >
                    Helipad &amp; Aircraft Details <i className="fa-solid fa-chevron-down"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
      </div>

      {/* Booking Passenger Modal */}
      {selectedHeliModal && (
        <HelicopterPassengerDetailsModal
          heli={selectedHeliModal}
          source={source}
          destination={destination}
          dateOfJourney={dateOfJourney}
          passenger={passenger}
          contact={contact}
          onPassengerChange={setPassenger}
          onContactChange={setContact}
          onConfirmBooking={() => setBookingConfirmed(true)}
          onClose={() => {
            setSelectedHeliModal(null);
            setBookingConfirmed(false);
          }}
          isConfirmed={bookingConfirmed}
        />
      )}

      {/* Detailed Helicopter Specs Modal */}
      {detailedHeliModal && (
        <div className="hp-overlay">
          <div className="hp-modal-card" style={{ maxWidth: '580px' }}>
            <div className="hp-modal-header">
              <div>
                <span className="hp-modal-tag"><i className="fa-solid fa-helicopter"></i> DGCA Type Specification</span>
                <h3>{detailedHeliModal.heliModel}</h3>
                <p>Operator: {detailedHeliModal.operator} • Tail: {detailedHeliModal.heliNo}</p>
              </div>
              <button type="button" className="hp-close-btn" onClick={() => setDetailedHeliModal(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="hp-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, display: 'block' }}>CRUISING SPEED</span>
                  <strong style={{ fontSize: '15px', color: '#0f172a' }}>{detailedHeliModal.cruisingSpeed}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, display: 'block' }}>MAX FLIGHT RANGE</span>
                  <strong style={{ fontSize: '15px', color: '#0f172a' }}>{detailedHeliModal.rangeKm}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, display: 'block' }}>CABIN CONFIGURATION</span>
                  <strong style={{ fontSize: '15px', color: '#0f172a' }}>{detailedHeliModal.seatingCapacity}</strong>
                </div>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, display: 'block' }}>LUGGAGE ALLOCATION</span>
                  <strong style={{ fontSize: '15px', color: '#0f172a' }}>{detailedHeliModal.baggageInfo}</strong>
                </div>
              </div>

              <div style={{ background: '#ecfdf5', padding: '14px 18px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                <strong style={{ color: '#065f46', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa-solid fa-circle-check"></i> VIP Helipad Fast-Track Security Included
                </strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#047857' }}>
                  No airport queueing or long check-ins. Report at the rooftop/executive helipad just 15 minutes before your scheduled departure.
                </p>
              </div>
            </div>

            <div className="hp-modal-footer">
              <button
                type="button"
                className="hp-btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  const target = detailedHeliModal;
                  setDetailedHeliModal(null);
                  setSelectedHeliModal(target);
                }}
              >
                Proceed to Book ({detailedHeliModal.depHeliCode})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
