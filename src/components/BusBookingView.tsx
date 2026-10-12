'use client';

import React, { useState } from 'react';
import './BusBookingView.css';

export interface BusItem {
  id: string;
  operator: string;
  busType: string;
  isElectric?: boolean;
  hasLiveTracking?: boolean;
  hasTripReward?: boolean;
  isPrimo?: boolean;
  isRTC?: boolean;
  rating: number;
  totalRatings: number;
  depTime: string;
  arrTime: string;
  duration: string;
  depLocation: string;
  arrLocation: string;
  availableSeats: number;
  singleSeats: number;
  fare: number;
  highlights: string[];
  boardingPoints: { name: string; time: string }[];
  droppingPoints: { name: string; time: string }[];
}

const INITIAL_BUSES: BusItem[] = [
  {
    id: 'bus-freshbus',
    operator: 'FRESHBUS',
    busType: 'Electric A/C Seater/Sleeper (2+1)',
    isElectric: true,
    hasLiveTracking: true,
    hasTripReward: true,
    isPrimo: true,
    rating: 4.6,
    totalRatings: 325,
    depTime: '08:35',
    arrTime: '10:55',
    duration: '2h 20m',
    depLocation: 'CMBT Koyambedu',
    arrLocation: 'Katpadi Green Circle',
    availableSeats: 36,
    singleSeats: 10,
    fare: 339,
    highlights: ['100% Electric EV Bus', 'Clean Air Filtered Cabin', 'Emergency Exit & CCTV', 'Fast Charging Port & Blanket', 'Live GPS Tracking'],
    boardingPoints: [
      { name: 'CMBT Koyambedu (Platform 4)', time: '08:35 AM' },
      { name: 'Ashok Pillar Metro', time: '08:50 AM' },
      { name: 'Guindy Kathipara Junction', time: '09:05 AM' }
    ],
    droppingPoints: [
      { name: 'Katpadi Green Circle', time: '10:40 AM' },
      { name: 'Vellore New Bus Stand', time: '10:55 AM' }
    ]
  },
  {
    id: 'bus-intrcity',
    operator: 'INTRCITY SMARTBUS',
    busType: 'AC Sleeper / Seater (2+1)',
    isElectric: false,
    hasLiveTracking: true,
    hasTripReward: true,
    isPrimo: true,
    rating: 4.7,
    totalRatings: 1280,
    depTime: '11:00',
    arrTime: '01:15',
    duration: '2h 15m',
    depLocation: 'CMBT Koyambedu',
    arrLocation: 'Katpadi Junction',
    availableSeats: 28,
    singleSeats: 6,
    fare: 549,
    highlights: ['Primo Certified Bus', 'Private Sleeper Pods', 'SmartBus Lounge Access', 'Mineral Water & Pillow'],
    boardingPoints: [
      { name: 'Koyambedu CMBT Gate 3', time: '11:00 PM' },
      { name: 'Maduravoyal Toll', time: '11:20 PM' }
    ],
    droppingPoints: [
      { name: 'Katpadi Junction', time: '01:15 AM' },
      { name: 'Vellore Green Circle', time: '01:30 AM' }
    ]
  },
  {
    id: 'bus-zingbus',
    operator: 'ZINGBUS PLUS',
    busType: 'Electric Multi-Axle AC Sleeper (2+1)',
    isElectric: true,
    hasLiveTracking: true,
    hasTripReward: true,
    isPrimo: true,
    rating: 4.8,
    totalRatings: 840,
    depTime: '07:15',
    arrTime: '09:30',
    duration: '2h 15m',
    depLocation: 'Chennai Central',
    arrLocation: 'Vellore New Bus Stand',
    availableSeats: 32,
    singleSeats: 8,
    fare: 389,
    highlights: ['Zero Emission EV Comfort', 'Free Onboard Wi-Fi', 'Free Rescheduling', 'Female Passenger Safe Berth'],
    boardingPoints: [
      { name: 'Chennai Central Railway Station', time: '07:15 AM' },
      { name: 'Koyambedu CMBT', time: '07:45 AM' }
    ],
    droppingPoints: [
      { name: 'Katpadi Green Circle', time: '09:15 AM' },
      { name: 'Vellore New Bus Stand', time: '09:30 AM' }
    ]
  },
  {
    id: 'bus-parveen',
    operator: 'PARVEEN TRAVELS',
    busType: 'Scania Multi-Axle Semi-Sleeper AC (2+2)',
    isElectric: false,
    hasLiveTracking: true,
    hasTripReward: true,
    rating: 4.3,
    totalRatings: 1100,
    depTime: '20:15',
    arrTime: '22:50',
    duration: '2h 35m',
    depLocation: 'Ashok Pillar',
    arrLocation: 'Vellore Green Circle',
    availableSeats: 16,
    singleSeats: 4,
    fare: 490,
    highlights: ['Scania Air Suspension', 'Individual Reading Lights', 'Emergency Exit Assistance', 'USB Charging Port'],
    boardingPoints: [
      { name: 'Ashok Pillar', time: '08:15 PM' },
      { name: 'Guindy', time: '08:30 PM' }
    ],
    droppingPoints: [
      { name: 'Vellore Green Circle', time: '10:50 PM' }
    ]
  },
  {
    id: 'bus-srs',
    operator: 'SRS TRAVELS',
    busType: 'Mercedes Benz Multi-Axle AC Semi-Sleeper (2+2)',
    isElectric: false,
    hasLiveTracking: true,
    rating: 4.4,
    totalRatings: 940,
    depTime: '22:30',
    arrTime: '01:00',
    duration: '2h 30m',
    depLocation: 'Guindy Kathipara',
    arrLocation: 'Vellore New Bus Stand',
    availableSeats: 24,
    singleSeats: 0,
    fare: 550,
    highlights: ['Mercedes Benz Coach', 'Reclining Comfort Seats', 'Punctual Dispatch', 'Bottled Water'],
    boardingPoints: [
      { name: 'Guindy Kathipara', time: '10:30 PM' },
      { name: 'Porur Toll', time: '10:50 PM' }
    ],
    droppingPoints: [
      { name: 'Vellore New Bus Stand', time: '01:00 AM' }
    ]
  },
  {
    id: 'bus-setc',
    operator: 'SETC GOVT EXPRESS',
    busType: 'Ultra Deluxe Non-AC Seater (2+2)',
    isRTC: true,
    rating: 4.1,
    totalRatings: 3400,
    depTime: '18:30',
    arrTime: '21:15',
    duration: '2h 45m',
    depLocation: 'CMBT Koyambedu',
    arrLocation: 'Vellore Old Bus Stand',
    availableSeats: 40,
    singleSeats: 12,
    fare: 240,
    highlights: ['Govt. of Tamil Nadu Undertaking', 'Government Fare Subsidies', 'Luggage Compartment', 'Direct Highway Express'],
    boardingPoints: [
      { name: 'CMBT Koyambedu Platform 12', time: '06:30 PM' }
    ],
    droppingPoints: [
      { name: 'Katpadi', time: '09:00 PM' },
      { name: 'Vellore Old Bus Stand', time: '09:15 PM' }
    ]
  }
];

export default function BusBookingView({
  source = 'Chennai (CMBT / Koyambedu)',
  destination = 'Vellore (Katpadi)',
  dateOfJourney = '21 Oct, 2026'
}: {
  source?: string;
  destination?: string;
  dateOfJourney?: string;
}) {
  const [buses] = useState<BusItem[]>(INITIAL_BUSES);
  const [filterSearch, setFilterSearch] = useState('');
  const [sortBy, setSortBy] = useState<'Ratings' | 'Duration' | 'Departure' | 'Arrival' | 'Price'>('Ratings');

  // Quick filter chips
  const [filterPrimo, setFilterPrimo] = useState(false);
  const [filterLiveTrack, setFilterLiveTrack] = useState(false);
  const [filterAC, setFilterAC] = useState(false);
  const [filterSleeper, setFilterSleeper] = useState(false);
  const [filterSingleSeats, setFilterSingleSeats] = useState(false);
  const [filterElectric, setFilterElectric] = useState(false);
  const [filterGovt, setFilterGovt] = useState(false);

  // Active expanded card tab
  const [activeCardTab, setActiveCardTab] = useState<{ busId: string; tab: string } | null>(null);

  // Seat Selection Modal State
  const [selectedBus, setSelectedBus] = useState<BusItem | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['L4']);
  const [passengerName, setPassengerName] = useState('Alex Carter');
  const [passengerPhone, setPassengerPhone] = useState('+91 98765 43210');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedPnr, setConfirmedPnr] = useState('');

  const toggleCardTab = (busId: string, tab: string) => {
    if (activeCardTab?.busId === busId && activeCardTab?.tab === tab) {
      setActiveCardTab(null);
    } else {
      setActiveCardTab({ busId, tab });
    }
  };

  // Filter logic
  let displayedBuses = buses.filter(b => {
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      const match =
        b.operator.toLowerCase().includes(q) ||
        b.depLocation.toLowerCase().includes(q) ||
        b.arrLocation.toLowerCase().includes(q) ||
        b.busType.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterPrimo && !b.isPrimo) return false;
    if (filterLiveTrack && !b.hasLiveTracking) return false;
    if (filterAC && !b.busType.includes('AC') && !b.busType.includes('A/C')) return false;
    if (filterSleeper && !b.busType.toLowerCase().includes('sleeper')) return false;
    if (filterSingleSeats && b.singleSeats <= 0) return false;
    if (filterElectric && !b.isElectric) return false;
    if (filterGovt && !b.isRTC) return false;
    return true;
  });

  // Sorting
  if (sortBy === 'Ratings') {
    displayedBuses.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'Duration') {
    displayedBuses.sort((a, b) => a.duration.localeCompare(b.duration));
  } else if (sortBy === 'Departure') {
    displayedBuses.sort((a, b) => a.depTime.localeCompare(b.depTime));
  } else if (sortBy === 'Arrival') {
    displayedBuses.sort((a, b) => a.arrTime.localeCompare(b.arrTime));
  } else if (sortBy === 'Price') {
    displayedBuses.sort((a, b) => a.fare - b.fare);
  }

  // Seat toggle helper
  const handleToggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleConfirmBusBooking = () => {
    if (!selectedBus || selectedSeats.length === 0) return;
    const pnr = `BUS${Math.floor(10000000 + Math.random() * 90000000)}`;
    const newBooking = {
      id: `bus-${Date.now()}`,
      title: `${selectedBus.operator} (${selectedBus.busType})`,
      number: `Seats: ${selectedSeats.join(', ')}`,
      type: 'Bus',
      pnr,
      bookingId: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      source: selectedBus.depLocation,
      sourceCode: 'MAA',
      destination: selectedBus.arrLocation,
      destinationCode: 'KPD',
      sourceTime: selectedBus.depTime,
      sourceDate: dateOfJourney,
      destinationTime: selectedBus.arrTime,
      destinationDate: dateOfJourney,
      passengerName,
      seatStatus: `Confirmed Seats: ${selectedSeats.join(', ')}`,
      statusBadge: 'CNF',
      statusText: 'Ticket Confirmed',
      price: selectedBus.fare * selectedSeats.length,
      isActive: true,
      isCancelled: false
    };

    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('sart_global_bookings');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newBooking);
      localStorage.setItem('sart_global_bookings', JSON.stringify(list));
    }

    setConfirmedPnr(pnr);
    setBookingConfirmed(true);
  };

  return (
    <div className="bb-container">
      {/* ---------------- 1. Promotional Cards Carousel Strip ---------------- */}
      <div className="bb-promo-strip">
        <div className="bb-promo-card bb-card-brics">
          <div className="bb-card-top">
            <span className="bb-brics-badge">BRICS 🌐</span>
            <span className="bb-brics-year">2026</span>
          </div>
          <div>
            <div className="bb-card-title">BRICS Global Travel</div>
            <div className="bb-card-sub">Official Mobility Partner</div>
          </div>
        </div>

        <div className="bb-promo-card bb-card-discount">
          <div className="bb-card-top">
            <span className="bb-badge-pill">SAVE BIG</span>
            <span className="bb-code-tag">SARTBUS</span>
          </div>
          <div>
            <div className="bb-card-title">10% OFF</div>
            <div className="bb-card-sub">On RTC & Private Buses</div>
          </div>
        </div>

        <div className="bb-promo-card bb-card-primo">
          <div className="bb-card-top">
            <span className="bb-primo-star">Primo ⭐</span>
            <span className="bb-badge-pill light">On-Time</span>
          </div>
          <div>
            <div className="bb-card-title">Primo Buses</div>
            <div className="bb-card-sub">Top Rated & Guaranteed Punctual</div>
          </div>
        </div>

        <div className="bb-promo-card bb-card-cancel">
          <div className="bb-card-top">
            <span className="bb-zero-badge">₹0</span>
            <span className="bb-badge-pill light">Instant</span>
          </div>
          <div>
            <div className="bb-card-title">Free Cancellation</div>
            <div className="bb-card-sub">100% Refund Available</div>
          </div>
        </div>

        <div className="bb-promo-card bb-card-flexi">
          <div className="bb-card-top">
            <span className="bb-badge-pill">FLEXI</span>
            <span className="bb-flexi-val">Save ₹100</span>
          </div>
          <div>
            <div className="bb-card-title">Flexi Ticket</div>
            <div className="bb-card-sub">Reschedule Anytime</div>
          </div>
        </div>
      </div>

      {/* ---------------- 2. Advisory / Offer Banner ---------------- */}
      <div className="bb-advisory-bar">
        <i className="fa-solid fa-bullhorn bb-advisory-icon"></i>
        <span>
          <strong>Special Bus Offer:</strong> Instant ₹100 discount available with code <strong>SARTPAY</strong> on all AC Sleeper & Seater buses between Chennai and Vellore!
        </span>
      </div>

      {/* ---------------- 3. Government RTC Highlight Banner ---------------- */}
      <div className="bb-rtc-highlight-card">
        <div className="bb-rtc-left">
          <div className="bb-rtc-icon-wrap">
            <i className="fa-solid fa-bus"></i>
          </div>
          <div>
            <div className="bb-rtc-title">
              SETC & KSRTC Interstate Express Buses
              <span className="bb-govt-tag">Govt Authorized</span>
            </div>
            <div className="bb-rtc-sub">
              Operated by Govt. of Tamil Nadu & Karnataka • Starting from ₹240 • Safe & Reliable
            </div>
          </div>
        </div>
        <button
          className="bb-rtc-btn"
          onClick={() => setFilterGovt(!filterGovt)}
        >
          {filterGovt ? 'Show All Buses' : 'Book Govt Bus'}
        </button>
      </div>

      {/* ---------------- 4. Main Two-Column Layout ---------------- */}
      <div className="bb-main-grid">
        {/* Left Filter Sidebar */}
        <aside className="bb-filter-sidebar">
          <div className="bb-filter-header">
            <h3 className="bb-filter-title">100+ Buses</h3>
            <button
              className="bb-filter-clear-btn"
              onClick={() => {
                setFilterSearch('');
                setFilterPrimo(false);
                setFilterLiveTrack(false);
                setFilterAC(false);
                setFilterSleeper(false);
                setFilterSingleSeats(false);
                setFilterElectric(false);
                setFilterGovt(false);
              }}
            >
              Clear All
            </button>
          </div>

          <div className="bb-sidebar-search">
            <i className="fa-solid fa-magnifying-glass bb-sidebar-search-icon"></i>
            <input
              type="text"
              placeholder="Search by operator, route..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="bb-sidebar-search-input"
            />
          </div>

          <div className="bb-chips-grid">
            <button
              className={`bb-chip ${filterElectric ? 'active' : ''}`}
              onClick={() => setFilterElectric(!filterElectric)}
            >
              <i className="fa-solid fa-bolt" style={{ color: '#0d9488' }}></i> EV Bus
            </button>
            <button
              className={`bb-chip ${filterPrimo ? 'active' : ''}`}
              onClick={() => setFilterPrimo(!filterPrimo)}
            >
              <i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i> Primo Bus
            </button>
            <button
              className={`bb-chip ${filterLiveTrack ? 'active' : ''}`}
              onClick={() => setFilterLiveTrack(!filterLiveTrack)}
            >
              <i className="fa-solid fa-location-crosshairs"></i> Live Tracking
            </button>
            <button
              className={`bb-chip ${filterAC ? 'active' : ''}`}
              onClick={() => setFilterAC(!filterAC)}
            >
              <i className="fa-solid fa-snowflake"></i> AC (65)
            </button>
            <button
              className={`bb-chip ${filterSleeper ? 'active' : ''}`}
              onClick={() => setFilterSleeper(!filterSleeper)}
            >
              <i className="fa-solid fa-bed"></i> Sleeper (42)
            </button>
            <button
              className={`bb-chip ${filterSingleSeats ? 'active' : ''}`}
              onClick={() => setFilterSingleSeats(!filterSingleSeats)}
            >
              <i className="fa-solid fa-chair"></i> Single Seats
            </button>
            <button
              className={`bb-chip ${filterGovt ? 'active' : ''}`}
              onClick={() => setFilterGovt(!filterGovt)}
            >
              <i className="fa-solid fa-building-shield"></i> Govt Buses
            </button>
          </div>
        </aside>

        {/* Right Bus Results Feed */}
        <main className="bb-results-area">
          <div className="bb-results-header">
            <span className="bb-count-label">{displayedBuses.length} Buses Found</span>
            <div className="bb-sort-wrap">
              <span className="bb-sort-text">Sort By:</span>
              {(['Ratings', 'Duration', 'Departure', 'Arrival', 'Price'] as const).map(opt => (
                <button
                  key={opt}
                  className={`bb-sort-btn ${sortBy === opt ? 'active' : ''}`}
                  onClick={() => setSortBy(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Bus Cards List */}
          <div className="bb-bus-list">
            {displayedBuses.map((bus) => (
              <div key={bus.id} className="bb-redbus-card">
                {/* 1. Top Pink tripReward Banner (Exact Image 1 Style) */}
                {bus.hasTripReward && (
                  <div className="bb-trip-reward-banner">
                    <span className="bb-reward-star-badge">
                      <i className="fa-solid fa-star"></i>
                    </span>
                    <strong className="bb-reward-title">tripReward</strong>
                    <span className="bb-reward-sub">Take 4 trips to get a <strong>free ticket</strong></span>
                  </div>
                )}

                {/* 2. Main Bus Card Info Row (Exact Image 1 Layout) */}
                <div className="bb-card-main-content">
                  {/* Left Column: Operator & Bus Model */}
                  <div className="bb-col-operator">
                    <div className="bb-op-title-row">
                      <span className="bb-op-title">{bus.operator}</span>
                      {bus.hasLiveTracking && (
                        <i className="fa-solid fa-location-dot bb-op-track-icon" title="Live Tracking Available"></i>
                      )}
                    </div>
                    <div className="bb-op-sub">
                      {bus.isElectric ? (
                        <>
                          <i className="fa-solid fa-bolt bb-op-bolt" title="100% Electric EV Bus"></i>
                          <span>{bus.busType}</span>
                        </>
                      ) : (
                        <span>{bus.busType}</span>
                      )}
                    </div>
                  </div>

                  {/* Rating Stacked Box: Green Badge over Total Ratings */}
                  <div className="bb-col-rating">
                    <div className="bb-rating-stacked">
                      <span className="bb-rating-pill">
                        ★ {bus.rating}
                      </span>
                      <span className="bb-rating-num">{bus.totalRatings}</span>
                    </div>
                  </div>

                  {/* Schedule & Duration Column */}
                  <div className="bb-col-schedule">
                    <div className="bb-times-range">
                      <span>{bus.depTime}</span>
                      <span className="bb-times-dash">—</span>
                      <span>{bus.arrTime}</span>
                    </div>
                    <div className="bb-seats-meta">
                      {bus.duration} • {bus.availableSeats} Seats ({bus.singleSeats} Single)
                    </div>
                  </div>

                  {/* Fare Column */}
                  <div className="bb-col-price">
                    <div className="bb-price-val">₹{bus.fare}</div>
                    <div className="bb-price-onwards">Onwards</div>
                  </div>
                </div>

                {/* 3. Bottom Links & Red Button Row (Exact Image 1 Style) */}
                <div className="bb-card-bottom-bar">
                  <div className="bb-links-group">
                    <button
                      type="button"
                      className={`bb-tab-link ${activeCardTab?.busId === bus.id && activeCardTab.tab === 'highlights' ? 'active' : ''}`}
                      onClick={() => toggleCardTab(bus.id, 'highlights')}
                    >
                      Highlights
                    </button>
                    <span className="bb-tab-divider"></span>

                    <button
                      type="button"
                      className={`bb-tab-link ${activeCardTab?.busId === bus.id && activeCardTab.tab === 'points' ? 'active' : ''}`}
                      onClick={() => toggleCardTab(bus.id, 'points')}
                    >
                      Boarding/ Dropping Points
                    </button>
                    <span className="bb-tab-divider"></span>

                    <button
                      type="button"
                      className={`bb-tab-link ${activeCardTab?.busId === bus.id && activeCardTab.tab === 'reviews' ? 'active' : ''}`}
                      onClick={() => toggleCardTab(bus.id, 'reviews')}
                    >
                      Ratings & Reviews
                    </button>
                    <span className="bb-tab-divider"></span>

                    <button
                      type="button"
                      className={`bb-tab-link ${activeCardTab?.busId === bus.id && activeCardTab.tab === 'photos' ? 'active' : ''}`}
                      onClick={() => toggleCardTab(bus.id, 'photos')}
                    >
                      Bus Photos
                    </button>
                    <span className="bb-tab-divider"></span>

                    <button
                      type="button"
                      className={`bb-tab-link ${activeCardTab?.busId === bus.id && activeCardTab.tab === 'policies' ? 'active' : ''}`}
                      onClick={() => toggleCardTab(bus.id, 'policies')}
                    >
                      Cancellation Policies
                    </button>
                  </div>

                  <button
                    type="button"
                    className="bb-view-seats-cta"
                    onClick={() => {
                      setSelectedBus(bus);
                      setSelectedSeats(['L4']);
                      setBookingConfirmed(false);
                    }}
                  >
                    View seats
                  </button>
                </div>

                {/* 4. Expandable Info Drawers */}
                {activeCardTab?.busId === bus.id && (
                  <div className="bb-card-drawer">
                    {activeCardTab.tab === 'highlights' && (
                      <div className="bb-drawer-section">
                        <h4 className="bb-drawer-title"><i className="fa-solid fa-star"></i> Key Bus Highlights</h4>
                        <div className="bb-highlights-chips">
                          {bus.highlights.map((h, i) => (
                            <span key={i} className="bb-hl-chip">✓ {h}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeCardTab.tab === 'points' && (
                      <div className="bb-drawer-section bb-points-grid">
                        <div>
                          <h4 className="bb-drawer-title"><i className="fa-solid fa-location-dot"></i> Boarding Points</h4>
                          {bus.boardingPoints.map((bp, i) => (
                            <div key={i} className="bb-point-item">
                              <span className="bb-point-time">{bp.time}</span>
                              <span className="bb-point-name">{bp.name}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <h4 className="bb-drawer-title"><i className="fa-solid fa-flag-checkered"></i> Dropping Points</h4>
                          {bus.droppingPoints.map((dp, i) => (
                            <div key={i} className="bb-point-item">
                              <span className="bb-point-time">{dp.time}</span>
                              <span className="bb-point-name">{dp.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeCardTab.tab === 'reviews' && (
                      <div className="bb-drawer-section">
                        <h4 className="bb-drawer-title"><i className="fa-solid fa-award"></i> Verified Passenger Ratings</h4>
                        <div className="bb-ratings-breakdown">
                          <div className="bb-r-bar-item"><span>Cleanliness</span> <strong>4.8 / 5</strong></div>
                          <div className="bb-r-bar-item"><span>Punctuality</span> <strong>4.7 / 5</strong></div>
                          <div className="bb-r-bar-item"><span>Staff Courtesy</span> <strong>4.6 / 5</strong></div>
                          <div className="bb-r-bar-item"><span>Driving Quality</span> <strong>4.9 / 5</strong></div>
                        </div>
                      </div>
                    )}

                    {activeCardTab.tab === 'photos' && (
                      <div className="bb-drawer-section">
                        <h4 className="bb-drawer-title"><i className="fa-solid fa-camera"></i> Verified Bus Interior Photos</h4>
                        <div className="bb-photos-row">
                          <div className="bb-photo-card"><i className="fa-solid fa-bed"></i> Sleeper Deck</div>
                          <div className="bb-photo-card"><i className="fa-solid fa-chair"></i> Recliner Seats</div>
                          <div className="bb-photo-card"><i className="fa-solid fa-bolt"></i> EV Cabin</div>
                          <div className="bb-photo-card"><i className="fa-solid fa-tv"></i> Clean Interior</div>
                        </div>
                      </div>
                    )}

                    {activeCardTab.tab === 'policies' && (
                      <div className="bb-drawer-section">
                        <h4 className="bb-drawer-title"><i className="fa-solid fa-shield-halved"></i> Cancellation & Refund Policy</h4>
                        <table className="bb-cancel-table">
                          <thead>
                            <tr>
                              <th>Time Before Departure</th>
                              <th>Refund Percentage</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td>Between 12 to 24 hrs</td><td>90% Refund</td></tr>
                            <tr><td>Between 6 to 12 hrs</td><td>50% Refund</td></tr>
                            <tr><td>Under 6 hrs</td><td>No Refund</td></tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ---------------- 5. Interactive Seat Selection Modal ---------------- */}
      {selectedBus && (
        <div className="bb-seat-modal-backdrop" onClick={() => setSelectedBus(null)}>
          <div className="bb-seat-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="bb-seat-modal-header">
              <div>
                <h3 className="bb-seat-modal-title">Select Seats — {selectedBus.operator}</h3>
                <span className="bb-seat-modal-sub">
                  {selectedBus.busType} • {selectedBus.depTime} ({selectedBus.depLocation}) → {selectedBus.arrTime} ({selectedBus.arrLocation})
                </span>
              </div>
              <button className="bb-modal-close-btn" onClick={() => setSelectedBus(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="bb-confirmed-box">
                <div className="bb-cnf-icon">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <h3>Bus Ticket Booked Successfully!</h3>
                <p>PNR: <strong>{confirmedPnr}</strong></p>
                <div className="bb-cnf-summary">
                  <div><strong>Operator:</strong> {selectedBus.operator}</div>
                  <div><strong>Seats:</strong> {selectedSeats.join(', ')}</div>
                  <div><strong>Journey Date:</strong> {dateOfJourney}</div>
                  <div><strong>Passenger:</strong> {passengerName} ({passengerPhone})</div>
                  <div><strong>Amount Paid:</strong> ₹{selectedBus.fare * selectedSeats.length}</div>
                </div>
                <button
                  className="bb-rtc-btn"
                  style={{ marginTop: '20px' }}
                  onClick={() => setSelectedBus(null)}
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="bb-seat-selection-content">
                <div className="bb-legend-row">
                  <div className="bb-legend-item">
                    <span className="bb-legend-sample available"></span> Available
                  </div>
                  <div className="bb-legend-item">
                    <span className="bb-legend-sample selected"></span> Selected
                  </div>
                  <div className="bb-legend-item">
                    <span className="bb-legend-sample booked"></span> Booked
                  </div>
                  <div className="bb-legend-item">
                    <span className="bb-legend-sample ladies"></span> Female Reserved
                  </div>
                </div>

                <div className="bb-bus-decks-container">
                  <div className="bb-deck-card">
                    <div className="bb-deck-title">
                      <span>Lower Deck</span>
                      <i className="fa-solid fa-circle-dot" title="Driver Steering Wheel" style={{ color: '#475569' }}></i>
                    </div>

                    <div className="bb-deck-seats-grid">
                      {['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'].map((seat, i) => {
                        const isBooked = [1, 5, 8].includes(i);
                        const isLadies = [3, 9].includes(i);
                        const isSel = selectedSeats.includes(seat);

                        return (
                          <button
                            key={seat}
                            disabled={isBooked}
                            className={`bb-seat-berth ${isBooked ? 'booked' : ''} ${isLadies ? 'ladies' : ''} ${isSel ? 'selected' : ''}`}
                            onClick={() => handleToggleSeat(seat)}
                          >
                            <span className="bb-seat-code">{seat}</span>
                            <span className="bb-seat-price">₹{selectedBus.fare}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bb-deck-card">
                    <div className="bb-deck-title">
                      <span>Upper Deck</span>
                    </div>

                    <div className="bb-deck-seats-grid">
                      {['U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12'].map((seat, i) => {
                        const isBooked = [2, 6, 11].includes(i);
                        const isLadies = [0].includes(i);
                        const isSel = selectedSeats.includes(seat);

                        return (
                          <button
                            key={seat}
                            disabled={isBooked}
                            className={`bb-seat-berth ${isBooked ? 'booked' : ''} ${isLadies ? 'ladies' : ''} ${isSel ? 'selected' : ''}`}
                            onClick={() => handleToggleSeat(seat)}
                          >
                            <span className="bb-seat-code">{seat}</span>
                            <span className="bb-seat-price">₹{selectedBus.fare}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bb-booking-checkout-box">
                  <div className="bb-checkout-fields">
                    <div className="bb-field-item">
                      <label>Passenger Name</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                      />
                    </div>
                    <div className="bb-field-item">
                      <label>Mobile Number</label>
                      <input
                        type="text"
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="bb-checkout-summary-row">
                    <div>
                      <div className="bb-selected-seats-text">
                        Selected: <strong>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</strong>
                      </div>
                      <div className="bb-total-fare">
                        Total: <strong>₹{selectedBus.fare * selectedSeats.length}</strong>
                      </div>
                    </div>

                    <button
                      className="bb-confirm-book-btn"
                      disabled={selectedSeats.length === 0}
                      onClick={handleConfirmBusBooking}
                    >
                      Book Selected Seats
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
