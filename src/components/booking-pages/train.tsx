import React, { useState } from 'react';
import '../tabs/BookingsTab.css';

const INDIAN_STATIONS = [
  { code: 'SC', name: 'SECUNDERABAD JN' },
  { code: 'NLR', name: 'NELLORE' },
  { code: 'BZA', name: 'VIJAYAWADA JN' },
  { code: 'MAS', name: 'MGR CHENNAI CTL' },
  { code: 'NDLS', name: 'NEW DELHI' },
  { code: 'HWH', name: 'HOWRAH JN' },
  { code: 'CSMT', name: 'CSMT MUMBAI' },
  { code: 'SBC', name: 'KSR BENGALURU' },
  { code: 'CH', name: 'CHANDAUSI JN' },
  { code: 'CHE', name: 'SRIKAKULAM ROAD' },
  { code: 'J', name: 'JALNA' },
  { code: 'JL', name: 'JALGAON JN' },
  { code: 'JBP', name: 'JABALPUR' }
];

export default function TrainBooking({ selectedVehicleType, handleBackToFleet }: { selectedVehicleType: string, handleBackToFleet: () => void }) {
  const [activeSubTab, setActiveSubTab] = useState<'book' | 'upcoming' | 'past'>('book');
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [routeDate, setRouteDate] = useState('2026-10-05');
  const [showResults, setShowResults] = useState(false);
  const [expandedTrainIndex, setExpandedTrainIndex] = useState<number | null>(null);
  const [expandedTrainTab, setExpandedTrainTab] = useState<string>('details');
  const [showMapModal, setShowMapModal] = useState<any>(null);

  // Quick dates
  const today = new Date();
  const getFormattedDate = (addDays = 0) => {
    const d = new Date(today);
    d.setDate(d.getDate() + addDays);
    return {
      day: d.getDate(),
      month: d.toLocaleString('en-US', { month: 'short' }),
      weekday: d.toLocaleString('en-US', { weekday: 'short' }),
      full: d.toISOString().split('T')[0],
      label: addDays === 0 ? 'Today' : addDays === 1 ? 'Tomorrow' : d.toLocaleString('en-US', { weekday: 'short' })
    };
  };

  const handleSwap = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  return (
    <div className="bookings-tab-container fleet-selection-container" style={{ minHeight: '80vh', padding: '20px', backgroundColor: '#f0f4f8' }}>
      {/* Top Navigation */}
      <div className="bookings-top-actions" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={handleBackToFleet}
            style={{ padding: '10px 20px', backgroundColor: 'black', color: 'white', borderRadius: '8px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Fleet
          </button>
          <h2 style={{ margin: 0, textTransform: 'capitalize', color: '#1e293b' }}>Train Ticket Booking</h2>
        </div>

        {/* Sub-tabs for Booking vs History */}
        <div style={{ display: 'flex', backgroundColor: 'white', padding: '4px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <button
            onClick={() => setActiveSubTab('book')}
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeSubTab === 'book' ? '#0052cc' : 'transparent', color: activeSubTab === 'book' ? 'white' : '#64748b', fontWeight: activeSubTab === 'book' ? 'bold' : 'normal' }}
          >
            Book Ticket
          </button>
          <button
            onClick={() => setActiveSubTab('upcoming')}
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeSubTab === 'upcoming' ? '#0052cc' : 'transparent', color: activeSubTab === 'upcoming' ? 'white' : '#64748b', fontWeight: activeSubTab === 'upcoming' ? 'bold' : 'normal' }}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveSubTab('past')}
            style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: activeSubTab === 'past' ? '#0052cc' : 'transparent', color: activeSubTab === 'past' ? 'white' : '#64748b', fontWeight: activeSubTab === 'past' ? 'bold' : 'normal' }}
          >
            Past Bookings
          </button>
        </div>
      </div>

      {activeSubTab === 'book' && (
        <div className="train-search-widget" style={{ backgroundColor: '#0f3a63', padding: '40px 20px', borderRadius: '16px', position: 'relative', marginTop: '20px' }}>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1100px', margin: '0 auto' }}>

            {/* Main Search Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>

              {/* From Station */}
              <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '12px 16px' }}>
                  <i className="fa-solid fa-location-arrow" style={{ color: '#0052cc', marginRight: '10px' }}></i>
                  <input
                    type="text"
                    placeholder="From Station"
                    value={fromStation}
                    onChange={(e) => { setFromStation(e.target.value); setShowFromSuggestions(true); }}
                    onFocus={() => setShowFromSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '16px', fontWeight: '500' }}
                  />
                </div>

                {/* Suggestions Dropdown */}
                {showFromSuggestions && fromStation.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 10, marginTop: '4px', maxHeight: '250px', overflowY: 'auto', padding: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#0052cc', fontWeight: 'bold', padding: '4px 8px', marginBottom: '4px' }}>Suggestions</div>
                    {INDIAN_STATIONS.filter(s => s.name.toLowerCase().includes(fromStation.split('(')[0].trim().toLowerCase()) || s.code.toLowerCase().includes(fromStation.split('(')[0].trim().toLowerCase())).map((station, i) => (
                      <div
                        key={i}
                        onMouseDown={() => { setFromStation(`${station.name} (${station.code})`); setShowFromSuggestions(false); }}
                        style={{ padding: '10px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}
                        className="hover-bg-slate"
                      >
                        <span style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginRight: '12px', minWidth: '50px', textAlign: 'center' }}>{station.code}</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{station.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0f3a63', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <i className="fa-solid fa-arrow-right-arrow-left"></i>
              </button>

              {/* To Station */}
              <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '12px 16px' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: '#0052cc', marginRight: '10px' }}></i>
                  <input
                    type="text"
                    placeholder="To Station"
                    value={toStation}
                    onChange={(e) => { setToStation(e.target.value); setShowToSuggestions(true); }}
                    onFocus={() => setShowToSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '16px', fontWeight: '500' }}
                  />
                </div>
                {/* Suggestions Dropdown */}
                {showToSuggestions && toStation.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', zIndex: 10, marginTop: '4px', maxHeight: '250px', overflowY: 'auto', padding: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#0052cc', fontWeight: 'bold', padding: '4px 8px', marginBottom: '4px' }}>Suggestions</div>
                    {INDIAN_STATIONS.filter(s => s.name.toLowerCase().includes(toStation.split('(')[0].trim().toLowerCase()) || s.code.toLowerCase().includes(toStation.split('(')[0].trim().toLowerCase())).map((station, i) => (
                      <div
                        key={i}
                        onMouseDown={() => { setToStation(`${station.name} (${station.code})`); setShowToSuggestions(false); }}
                        style={{ padding: '10px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}
                        className="hover-bg-slate"
                      >
                        <span style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', marginRight: '12px', minWidth: '50px', textAlign: 'center' }}>{station.code}</span>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{station.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Input */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', flex: '0.8', minWidth: '150px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Date</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="date"
                      value={routeDate}
                      onChange={(e) => setRouteDate(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '16px', fontWeight: 'bold', color: '#0f3a63', cursor: 'pointer', width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Dates */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[0, 1].map(days => {
                  const d = getFormattedDate(days);
                  return (
                    <div
                      key={days}
                      onClick={() => setRouteDate(d.full)}
                      style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', textAlign: 'center', cursor: 'pointer', backgroundColor: routeDate === d.full ? '#0052cc' : 'white', color: routeDate === d.full ? 'white' : '#0f3a63' }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{d.label}</div>
                      <div style={{ fontSize: '11px', color: routeDate === d.full ? '#e2e8f0' : '#64748b' }}>{d.day} {d.month}</div>
                    </div>
                  );
                })}
              </div>

              {/* Search Button */}
              <button onClick={() => setShowResults(true)} style={{ backgroundColor: '#0052cc', color: 'white', padding: '16px 32px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginLeft: 'auto' }}>
                SEARCH TRAINS
              </button>
            </div>

            {/* Filters Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>Quick Filters:</span>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" /> AC Only
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" /> Available Seats
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" /> Morning Departure (06:00 - 12:00)
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" /> Ladies Quota
              </label>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
                <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white', fontSize: '14px' }}>
                  <option>All Classes</option>
                  <option>1A (First AC)</option>
                  <option>2A (Second AC)</option>
                  <option>3A (Third AC)</option>
                  <option>SL (Sleeper)</option>
                </select>

                <select style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white', fontSize: '14px' }}>
                  <option>General</option>
                  <option>Tatkal</option>
                  <option>Ladies</option>
                  <option>Senior Citizen</option>
                </select>
              </div>
            </div>

          </div>

          {/* TRAIN SEARCH RESULTS */}
          {showResults && (
            <div style={{ maxWidth: '1100px', margin: '24px auto 0' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <button onClick={() => setShowResults(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#0f172a' }}>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{fromStation || 'SECUNDERABAD JN (SC)'} To {toStation || 'NELLORE (NLR)'}</h2>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{new Date(routeDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', weekday: 'long' })}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <button style={{ flex: 1, padding: '12px', background: 'white', border: '2px solid #0ea5e9', borderRadius: '8px', color: '#0f172a', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fa-solid fa-train"></i> Trains <span style={{ background: '#c084fc', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '12px' }}>Upto ₹40 off</span></span>
                  <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>₹330 • 8h 13m</span>
                </button>
                <button style={{ flex: 1, padding: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fa-solid fa-bus"></i> Buses</span>
                  <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>₹370 • ~9h 17m</span>
                </button>
              </div>

              {[
                {
                  name: fromStation.toLowerCase().includes('secunderabad') && toStation.toLowerCase().includes('nellore') ? 'Narayanadri Sf' : `${fromStation ? fromStation.split(' ')[0] : 'Sart'} Superfast`,
                  num: fromStation.toLowerCase().includes('secunderabad') && toStation.toLowerCase().includes('nellore') ? '12734' : Math.floor(Math.random() * 90000 + 10000).toString(),
                  dep: '18:10', arr: '02:48', dur: '8h 38m',
                  c1: '2A', c1P: '1710', c1OP: '2100', c1S: 'Available 2',
                  c2: 'SL', c2P: '460', c2S: 'TQWL 52'
                },
                {
                  name: fromStation.toLowerCase().includes('secunderabad') && toStation.toLowerCase().includes('nellore') ? 'Charminar Sf Exp' : `${toStation ? toStation.split(' ')[0] : 'Express'} Mail`,
                  num: fromStation.toLowerCase().includes('secunderabad') && toStation.toLowerCase().includes('nellore') ? '12760' : Math.floor(Math.random() * 90000 + 10000).toString(),
                  dep: '18:25', arr: '03:33', dur: '9h 08m',
                  c1: 'SL', c1P: '495', c1OP: '600', c1S: 'TQWL 37',
                  c2: '3A', c2P: '1200', c2S: 'PQWL 23'
                }
              ].map((train, idx) => (
                <div key={idx} className="train-result-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>

                  {/* Top Row: Name, Time, Price */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '25%' }}>
                      <div style={{ color: '#3b82f6', fontSize: '20px' }}>
                        <i className="fa-solid fa-train"></i>
                      </div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>{train.name}</h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'center' }}>
                      <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: 'normal' }}>{train.dep}</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', flex: 1, maxWidth: '150px' }}>
                        <div style={{ height: '1px', borderBottom: '2px dashed #cbd5e1', flex: 1 }}></div>
                        <i className="fa-solid fa-train" style={{ color: '#94a3b8', fontSize: '14px' }}></i>
                        <div style={{ height: '1px', borderBottom: '2px dashed #cbd5e1', flex: 1 }}></div>
                      </div>
                      <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: 'normal' }}>{train.arr}</h2>
                    </div>

                    <div style={{ width: '25%', textAlign: 'right' }}>
                      <div style={{ color: '#10b981', fontSize: '18px', fontWeight: 'bold' }}>₹{train.c1P} <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>/pax</span></div>
                    </div>
                  </div>

                  {/* Second Row: Number/Class, Duration, Original Price */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '25%' }}>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>{train.num}</span>
                      <span style={{ fontSize: '11px', background: '#3b82f6', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{train.c1}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'center', fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                      <span>{fromStation ? fromStation.split(' ')[0].split('(')[0].trim() : 'SC'}</span>
                      <span>{train.dur} - Direct</span>
                      <span>{toStation ? toStation.split(' ')[0].split('(')[0].trim() : 'NLR'}</span>
                    </div>

                    <div style={{ width: '25%', textAlign: 'right' }}>
                      {train.c1OP && <div style={{ color: '#3b82f6', fontSize: '13px', textDecoration: 'line-through', fontWeight: '500' }}>₹{train.c1OP}/pax</div>}
                    </div>
                  </div>

                  {/* Facilities Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Facilities:</span>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                      <span><i className="fa-solid fa-suitcase-rolling" style={{ marginRight: '6px' }}></i> Baggage 20kg</span>
                      <span><i className="fa-solid fa-bed" style={{ marginRight: '6px' }}></i> Clean Bedding</span>
                      <span><i className="fa-solid fa-utensils" style={{ marginRight: '6px' }}></i> Pantry Food</span>
                      <span><i className="fa-solid fa-plug" style={{ marginRight: '6px' }}></i> Charging Port</span>
                    </div>
                  </div>

                  {/* Footer Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#3b82f6', fontWeight: '500' }}>
                      <span onClick={() => { setExpandedTrainIndex(expandedTrainIndex === idx && expandedTrainTab === 'details' ? null : idx); setExpandedTrainTab('details'); }} style={{ cursor: 'pointer', borderBottom: expandedTrainIndex === idx && expandedTrainTab === 'details' ? '2px solid #3b82f6' : 'none', paddingBottom: '4px' }}>Train Details</span>
                      <span onClick={() => { setExpandedTrainIndex(expandedTrainIndex === idx && expandedTrainTab === 'availability' ? null : idx); setExpandedTrainTab('availability'); }} style={{ cursor: 'pointer', borderBottom: expandedTrainIndex === idx && expandedTrainTab === 'availability' ? '2px solid #3b82f6' : 'none', paddingBottom: '4px' }}>Availability</span>
                      <span onClick={() => { setExpandedTrainIndex(expandedTrainIndex === idx && expandedTrainTab === 'promos' ? null : idx); setExpandedTrainTab('promos'); }} style={{ cursor: 'pointer', borderBottom: expandedTrainIndex === idx && expandedTrainTab === 'promos' ? '2px solid #3b82f6' : 'none', paddingBottom: '4px' }}>Promos</span>
                      <span onClick={() => { setExpandedTrainIndex(expandedTrainIndex === idx && expandedTrainTab === 'refund' ? null : idx); setExpandedTrainTab('refund'); }} style={{ cursor: 'pointer', borderBottom: expandedTrainIndex === idx && expandedTrainTab === 'refund' ? '2px solid #3b82f6' : 'none', paddingBottom: '4px' }}>Refund</span>
                    </div>
                    <button onClick={() => setShowMapModal(train)} style={{ backgroundColor: '#eff6ff', color: '#3b82f6', border: 'none', padding: '10px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)' }}>
                      Book Train
                    </button>
                  </div>

                  {/* Expanded Details Section */}
                  {expandedTrainIndex === idx && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #e2e8f0', color: '#334155', fontSize: '13px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                      {expandedTrainTab === 'details' && (
                        <div><strong>{train.name} ({train.num})</strong> travels from {fromStation ? fromStation.split('(')[0].trim() : 'Secunderabad'} to {toStation ? toStation.split('(')[0].trim() : 'Nellore'}. Journey takes approx {train.dur}. <ul style={{ paddingLeft: '20px', marginTop: '10px' }}><li>Pantry: Available</li><li>On-time performance: 85%</li><li>Type: Superfast Express</li></ul></div>
                      )}
                      {expandedTrainTab === 'availability' && (
                        <div>Current Availability: <br /><br /><span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', display: 'inline-block', marginBottom: '8px' }}>{train.c1}: {train.c1S}</span><br /><span style={{ background: '#fffbeb', color: '#d97706', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{train.c2}: {train.c2S}</span></div>
                      )}
                      {expandedTrainTab === 'promos' && (
                        <div>Apply promo code <strong style={{ color: '#0ea5e9' }}>FESTIVE50</strong> for ₹50 off on checkout.<br /><br />Apply <strong style={{ color: '#0ea5e9' }}>SART10</strong> for 10% cashback.</div>
                      )}
                      {expandedTrainTab === 'refund' && (
                        <div><strong>Cancellation Policy:</strong><ul style={{ paddingLeft: '20px', marginTop: '10px' }}><li>Cancel before 24hrs: Full refund minus ₹60 clerical charge.</li><li>Cancel within 24hrs: 50% refund.</li><li>No refund post train departure.</li></ul></div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div style={{ backgroundColor: '#e0f2fe', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>Get full fare refund on cancellation</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>Zero cancellation fee on all bookings</p>
                  </div>
                </div>
                <i className="fa-solid fa-shield-halved" style={{ fontSize: '24px', color: '#0284c7' }}></i>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Booking Map Modal */}
      {showMapModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '800px', padding: '30px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>Confirm Booking: {showMapModal.name}</h2>
              <button onClick={() => setShowMapModal(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div style={{ width: '100%', height: '350px', backgroundColor: '#e2e8f0', borderRadius: '12px', marginBottom: '24px', position: 'relative', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://maps.google.com/maps?q=${encodeURIComponent((fromStation || 'Secunderabad').split('(')[0])}%20to%20${encodeURIComponent((toStation || 'Nellore').split('(')[0])}&t=&z=6&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'white', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <i className="fa-solid fa-route" style={{ color: '#0ea5e9', marginRight: '8px' }}></i> Travel Map Live Route
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Passenger Name</div>
                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Rahul Sharma</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Date of Journey</div>
                  <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{new Date(routeDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Total Fare</div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#10b981' }}>₹{showMapModal.c1P}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button onClick={() => setShowMapModal(null)} style={{ padding: '12px 24px', border: '1px solid #cbd5e1', backgroundColor: 'transparent', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#334155' }}>Cancel</button>
              <button onClick={() => {
                import('../../data/mockBookings').then(({ MOCK_BOOKINGS }) => {
                  MOCK_BOOKINGS.unshift({
                    id: `bk-${Date.now()}`,
                    title: showMapModal.name,
                    number: showMapModal.num,
                    type: 'train',
                    image: 'https://img.icons8.com/fluency/96/train.png',
                    source: (fromStation || 'Secunderabad').split('(')[0].trim(),
                    sourceCode: 'SRC',
                    sourceTime: showMapModal.dep,
                    sourceDate: routeDate,
                    destination: (toStation || 'Nellore').split('(')[0].trim(),
                    destinationCode: 'DST',
                    destinationTime: showMapModal.arr,
                    destinationDate: routeDate,
                    duration: showMapModal.dur,
                    bookingId: `TRN${Math.floor(Math.random() * 1000000000)}`,
                    passengerName: 'Rahul Sharma',
                    seatStatus: `${showMapModal.c1}/CNF/S4/12`,
                    statusBadge: 'CONFIRMED',
                    statusText: 'Your ticket is confirmed!',
                    isActive: true,
                    isCancelled: false,
                    txnId: `TXN${Date.now()}`,
                    transactionAmount: parseInt(showMapModal.c1P, 10),
                    firstName: 'Rahul',
                    lastName: 'Sharma',
                    email: 'rahul@example.com',
                    mobile: '+91 9876543210'
                  });
                });
                setShowMapModal(null);
                setActiveSubTab('upcoming');
              }} style={{ padding: '12px 24px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Confirm Booking & Pay</button>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'upcoming' && (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', marginTop: '20px' }}>
          <img src="https://cdn-icons-png.flaticon.com/512/747/747116.png" alt="No bookings" width="100" style={{ opacity: 0.5, marginBottom: '20px' }} />
          <h3>No Upcoming Train Journeys</h3>
          <p style={{ color: '#64748b' }}>Looks like you haven't booked any trains yet. Switch to the Book Ticket tab to plan a trip!</p>
        </div>
      )}

      {activeSubTab === 'past' && (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', marginTop: '20px' }}>
          <img src="https://cdn-icons-png.flaticon.com/512/2884/2884323.png" alt="No past bookings" width="100" style={{ opacity: 0.5, marginBottom: '20px' }} />
          <h3>No Past Train Bookings</h3>
          <p style={{ color: '#64748b' }}>Your completed journeys will appear here.</p>
        </div>
      )}

      <style>{`
        .hover-bg-slate:hover {
          background-color: #e2e8f0 !important;
        }
      `}</style>
    </div>
  );
}
