'use client';

import React, { useState, useRef, useEffect } from 'react';
import './TrainBookingView.css';

interface TrainClassOption {
  code: string;
  fare: number;
  status: string;
  statusType: 'available' | 'wl' | 'regret';
  updated: string;
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
  duration: string;
  arrivalTime: string;
  arrivalStation: string;
  arrivalStationCode: string;
  arrivalTag?: string;
  classes: TrainClassOption[];
  stops: { station: string; code: string; arr: string; dep: string; halt: string }[];
}

const INDIAN_STATIONS = [
  { code: 'MAS', name: 'Mgr Chennai Ctl', full: 'Mgr Chennai Ctl - MAS' },
  { code: 'KPD', name: 'Katpadi Jn', full: 'Katpadi Jn - KPD' },
  { code: 'SBC', name: 'KSR Bengaluru', full: 'KSR Bengaluru - SBC' },
  { code: 'SC', name: 'Secunderabad Jn', full: 'Secunderabad Jn - SC' },
  { code: 'NDLS', name: 'New Delhi', full: 'New Delhi - NDLS' },
  { code: 'HWH', name: 'Howrah Jn', full: 'Howrah Jn - HWH' },
  { code: 'CSMT', name: 'CSMT Mumbai', full: 'CSMT Mumbai - CSMT' },
  { code: 'BZA', name: 'Vijayawada Jn', full: 'Vijayawada Jn - BZA' },
  { code: 'CBE', name: 'Coimbatore Jn', full: 'Coimbatore Jn - CBE' },
  { code: 'MDU', name: 'Madurai Jn', full: 'Madurai Jn - MDU' }
];

const INITIAL_TRAINS: TrainItem[] = [
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
    classes: [
      { code: 'SL', fare: 180, status: 'Available 9', statusType: 'available', updated: '15 mins ago' },
      { code: '3A', fare: 565, status: 'Available 2', statusType: 'available', updated: '3 hr ago' },
      { code: '3E', fare: 565, status: 'Available 5', statusType: 'available', updated: '2 hr ago' },
      { code: '2A', fare: 770, status: 'Available 1', statusType: 'available', updated: '2 hr ago' },
      { code: '1A', fare: 1270, status: 'PQWL 3', statusType: 'wl', updated: '3 hr ago' },
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

export default function TrainBookingView() {
  // Navigation & Mode
  const [activeMode, setActiveMode] = useState<'train' | 'bus'>('train');

  // Search Fields
  const [source, setSource] = useState('Mgr Chennai Ctl - MAS');
  const [destination, setDestination] = useState('Katpadi Jn - KPD');
  const [dateOfJourney, setDateOfJourney] = useState('14 Oct, 2026');
  const [selectedDay, setSelectedDay] = useState('14');

  // Calendar Picker State
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [calMonth, setCalMonth] = useState(9); // 0-indexed: 9 = October
  const [calYear, setCalYear] = useState(2026);
  const calendarRef = useRef<HTMLDivElement>(null);

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

  // Close calendar popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendarPicker(false);
      }
    };
    if (showCalendarPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendarPicker]);

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

  // Sorting state
  const [sortBy, setSortBy] = useState<'Default' | 'Availability' | 'Duration' | 'Departure' | 'Arrival'>('Default');

  // Quick filters
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterAC, setFilterAC] = useState(false);
  const [filterTatkal, setFilterTatkal] = useState(false);
  const [filterAltTrip, setFilterAltTrip] = useState(false);

  // Free cancellation toggle
  const [freeCancel, setFreeCancel] = useState(false);

  // Accordion open/close states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    availability: false,
    ticketClass: false,
    quota: false,
    departureTime: false,
    arrivalTime: false,
    departingStations: false,
    arrivingStations: false,
    alternateTrip: false
  });

  // Modals
  const [viewRouteTrain, setViewRouteTrain] = useState<TrainItem | null>(null);
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

  // Filtered & Sorted Trains
  let displayedTrains = [...INITIAL_TRAINS];

  if (filterAvailable) {
    displayedTrains = displayedTrains.filter(t => t.classes.some(c => c.statusType === 'available'));
  }
  if (filterAC) {
    displayedTrains = displayedTrains.filter(t => t.classes.some(c => ['1A', '2A', '3A', '3E', 'CC', 'EC'].includes(c.code)));
  }

  if (sortBy === 'Duration') {
    displayedTrains.sort((a, b) => a.duration.localeCompare(b.duration));
  } else if (sortBy === 'Departure') {
    displayedTrains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  } else if (sortBy === 'Arrival') {
    displayedTrains.sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime));
  }

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
      {/* ---------------- 1. Top Search Bar ---------------- */}
      <div className="tb-search-card">
        <div className="tb-search-row">
          {/* Source Input */}
          <div className="tb-search-field">
            <i className={`fa-solid ${activeMode === 'train' ? 'fa-train-subway' : 'fa-bus'} tb-field-icon`}></i>
            <div className="tb-field-content">
              <span className="tb-field-label">Source</span>
              <input
                type="text"
                className="tb-field-input"
                value={source}
                onChange={(e) => { setSource(e.target.value); setShowSourceDropdown(true); }}
                onFocus={() => setShowSourceDropdown(true)}
                placeholder="From Station"
              />
            </div>

            {showSourceDropdown && (
              <div className="tb-suggestions-popup">
                {INDIAN_STATIONS.map(st => (
                  <div
                    key={st.code}
                    className="tb-suggestion-item"
                    onClick={() => {
                      setSource(st.full);
                      setShowSourceDropdown(false);
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{st.name}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{st.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <button className="tb-swap-btn" onClick={handleSwapStations} title="Swap Stations">
            <i className="fa-solid fa-arrow-right-arrow-left"></i>
          </button>

          {/* Destination Input */}
          <div className="tb-search-field">
            <i className={`fa-solid ${activeMode === 'train' ? 'fa-train-subway' : 'fa-bus'} tb-field-icon`}></i>
            <div className="tb-field-content">
              <span className="tb-field-label">Destination</span>
              <input
                type="text"
                className="tb-field-input"
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setShowDestDropdown(true); }}
                onFocus={() => setShowDestDropdown(true)}
                placeholder="To Station"
              />
            </div>

            {showDestDropdown && (
              <div className="tb-suggestions-popup">
                {INDIAN_STATIONS.map(st => (
                  <div
                    key={st.code}
                    className="tb-suggestion-item"
                    onClick={() => {
                      setDestination(st.full);
                      setShowDestDropdown(false);
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{st.name}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{st.code}</span>
                  </div>
                ))}
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

        {/* Mode Tabs (Train / Bus) */}
        <div className="tb-mode-tabs">
          <button
            className={`tb-mode-tab ${activeMode === 'train' ? 'active' : ''}`}
            onClick={() => setActiveMode('train')}
          >
            <i className="fa-solid fa-train"></i> Train
          </button>
          <button
            className={`tb-mode-tab ${activeMode === 'bus' ? 'active' : ''}`}
            onClick={() => setActiveMode('bus')}
          >
            <i className="fa-solid fa-bus"></i> Bus
          </button>
        </div>
      </div>

      {/* ---------------- 2. Two-Column Layout ---------------- */}
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
                    <input type="checkbox" checked={filterAvailable} onChange={(e) => setFilterAvailable(e.target.checked)} />
                    Confirmed Available Only
                  </label>
                  <label className="tb-filter-checkbox-label">
                    <input type="checkbox" /> RAC (Reservation Against Cancellation)
                  </label>
                  <label className="tb-filter-checkbox-label">
                    <input type="checkbox" /> Waitlist (WL / PQWL / GNWL)
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
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> 1A (AC First Class)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> 2A (AC 2-Tier)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> 3A (AC 3-Tier)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> 3E (AC 3 Economy)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> SL (Sleeper Class)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> CC (AC Chair Car)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> 2S (Second Sitting)</label>
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
                  <label className="tb-filter-checkbox-label"><input type="radio" name="quota" defaultChecked /> General Quota</label>
                  <label className="tb-filter-checkbox-label"><input type="radio" name="quota" /> Tatkal Quota</label>
                  <label className="tb-filter-checkbox-label"><input type="radio" name="quota" /> Ladies Quota</label>
                  <label className="tb-filter-checkbox-label"><input type="radio" name="quota" /> Senior Citizen / Lower Berth</label>
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
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> Early Morning (00:00 - 06:00)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> Morning (06:00 - 12:00)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> Afternoon (12:00 - 18:00)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> Night (18:00 - 24:00)</label>
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
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> Morning (06:00 - 12:00)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> Afternoon (12:00 - 18:00)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> Night (18:00 - 24:00)</label>
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
                  <label className="tb-filter-checkbox-label"><input type="checkbox" defaultChecked /> Mgr Chennai Ctl (MAS)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> Chennai Egmore (MS)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> Tambaram (TBM)</label>
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
                  <label className="tb-filter-checkbox-label"><input type="checkbox" defaultChecked /> Katpadi Jn (KPD)</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> Vellore Cantt (VLR)</label>
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
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> Connecting Trains Via AJJ</label>
                  <label className="tb-filter-checkbox-label"><input type="checkbox" /> Same-day Bus Return</label>
                </div>
              )}
            </div>
          </div>
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
            <span className="tb-trains-count">65 {activeMode === 'train' ? 'Trains' : 'Buses'}</span>

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

          {/* Free Cancellation Banner */}
          <div className="tb-free-cancel-banner">
            <div className="tb-free-cancel-left">
              <div className="tb-cancel-icon-circle">
                <i className="fa-solid fa-indian-rupee-sign"></i>
              </div>
              <div>
                <h4 className="tb-cancel-title">Free Cancellation</h4>
                <p className="tb-cancel-subtitle">₹0 cancellation fee...</p>
              </div>
            </div>

            <label className="tb-toggle-switch">
              <input
                type="checkbox"
                checked={freeCancel}
                onChange={(e) => setFreeCancel(e.target.checked)}
              />
              <span className="tb-toggle-slider"></span>
            </label>
          </div>

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
                  {train.departureTag && (
                    <span className="tb-station-tag">{train.departureTag}</span>
                  )}
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

              {/* Classes Row */}
              <div className="tb-classes-row">
                {train.classes.map((cls) => (
                  <div
                    key={cls.code}
                    className="tb-class-card"
                    onClick={() => {
                      setBookingClassModal({ train, classOption: cls });
                      setBookingConfirmed(false);
                    }}
                  >
                    <div className="tb-class-header">
                      <span className="tb-class-code">{cls.code}</span>
                      <span className="tb-class-fare">₹{cls.fare.toLocaleString('en-IN')}</span>
                    </div>

                    <div className={`tb-class-status-box ${cls.statusType === 'available' ? 'tb-status-available' : cls.statusType === 'wl' ? 'tb-status-wl' : 'tb-status-regret'}`}>
                      {cls.status}
                    </div>

                    <span className="tb-updated-time">{cls.updated}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>

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

      {/* ---------------- Booking Ticket Confirmation Modal ---------------- */}
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
