'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ALL_CHENNAI_BANGALORE_TRAINS, EXPANDED_CORRIDOR_TRAINS, INITIAL_TRAINS, TrainItem } from '@/components/trainData';

export default function TrainRouteHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const trainNumberParam = params?.trainNumber ? String(params.trainNumber) : '20607';

  // Search input for train number or name
  const [searchInput, setSearchInput] = useState(trainNumberParam);
  const [selectedCoachPF, setSelectedCoachPF] = useState<string | null>(null);
  const [expandedNonStopping, setExpandedNonStopping] = useState<{ [key: number]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'schedule' | 'map'>('schedule');

  // Find train in master train catalog
  const allMasterTrains = [
    ...ALL_CHENNAI_BANGALORE_TRAINS,
    ...EXPANDED_CORRIDOR_TRAINS,
    ...INITIAL_TRAINS
  ];

  const currentTrain = allMasterTrains.find(
    (t) => t.number === trainNumberParam || t.id === trainNumberParam
  ) || allMasterTrains.find((t) => t.number === '20607') || ALL_CHENNAI_BANGALORE_TRAINS[0];

  // Live progress simulation: train is currently between Katpadi Jn and KSR Bengaluru
  const currentStationIndex = 1; // 0-indexed: departed stop 1
  const targetUserStation = currentTrain.stops[2] || currentTrain.stops[currentTrain.stops.length - 1];

  // Coach layouts by train type
  const getCoachPositions = (train: TrainItem) => {
    if (train.trainType === 'VB' || train.name.toLowerCase().includes('vande')) {
      return [
        { type: 'DTC', label: 'C1', code: 'EC', pos: 1 },
        { type: 'NDMC', label: 'C2', code: 'CC', pos: 2 },
        { type: 'TC', label: 'C3', code: 'CC', pos: 3 },
        { type: 'MC', label: 'C4', code: 'CC', pos: 4 },
        { type: 'TC', label: 'C5', code: 'CC', pos: 5 },
        { type: 'MC', label: 'C6', code: 'CC', pos: 6 },
        { type: 'NDMC', label: 'C7', code: 'CC', pos: 7 },
        { type: 'DTC', label: 'C8', code: 'CC', pos: 8, isDivyangjan: true },
        { type: 'NDMC', label: 'E1', code: 'EC', pos: 9 },
        { type: 'TC', label: 'E2', code: 'EC', pos: 10 }
      ];
    }
    // Express / Superfast standard rake (as shown in user coach position modal)
    return [
      { type: 'ENG', label: 'ENG', code: 'ENG', pos: 0 },
      { type: 'SLRD', label: 'SLRD', code: 'SLRD', pos: 1, isDivyangjan: true },
      { type: 'GEN', label: 'GEN', code: 'GEN', pos: 2 },
      { type: 'GEN', label: 'GEN', code: 'GEN', pos: 3 },
      { type: 'SL', label: 'S1', code: 'SL', pos: 4 },
      { type: 'SL', label: 'S2', code: 'SL', pos: 5 },
      { type: 'SL', label: 'S3', code: 'SL', pos: 6 },
      { type: 'SL', label: 'S4', code: 'SL', pos: 7 },
      { type: 'SL', label: 'S5', code: 'SL', pos: 8 },
      { type: 'SL', label: 'S6', code: 'SL', pos: 9 },
      { type: 'PC', label: 'PC', code: 'PC', pos: 10 },
      { type: '3E', label: 'M1', code: '3E', pos: 11 },
      { type: '3E', label: 'M2', code: '3E', pos: 12 },
      { type: '3A', label: 'B1', code: '3A', pos: 13 },
      { type: '3A', label: 'B2', code: '3A', pos: 14 },
      { type: '3A', label: 'B3', code: '3A', pos: 15 },
      { type: '3A', label: 'B4', code: '3A', pos: 16 },
      { type: '2A', label: 'A1', code: '2A', pos: 17 },
      { type: '2A', label: 'A2', code: '2A', pos: 18 },
      { type: '1A', label: 'H1', code: '1A', pos: 19 },
      { type: 'GEN', label: 'GEN', code: 'GEN', pos: 20 },
      { type: 'GEN', label: 'GEN', code: 'GEN', pos: 21 },
      { type: 'LPR', label: 'LPR', code: 'LPR', pos: 22 }
    ];
  };

  const coaches = getCoachPositions(currentTrain);

  // Non-stopping intermediate stations between major halts
  const getIntermediateNonStopping = (idx: number) => {
    if (idx === 0) {
      return [
        { name: 'Perambur (PER)', km: '4 KMs' },
        { name: 'Villivakkam (VLK)', km: '9 KMs' },
        { name: 'Avadi (AVD)', km: '21 KMs' },
        { name: 'Tiruvallur (TRL)', km: '42 KMs' },
        { name: 'Arakkonam Jn (AJJ)', km: '69 KMs' },
        { name: 'Walajah Road (WJR)', km: '105 KMs' }
      ];
    } else if (idx === 1) {
      return [
        { name: 'Gudiyattam (GYM)', km: '155 KMs' },
        { name: 'Ambur (AB)', km: '182 KMs' },
        { name: 'Vaniyambadi (VN)', km: '198 KMs' },
        { name: 'Jolarpettai Jn (JTJ)', km: '214 KMs' },
        { name: 'Kuppam (KPN)', km: '255 KMs' },
        { name: 'Bangarapet Jn (BWT)', km: '289 KMs' },
        { name: 'Whitefield (WFD)', km: '336 KMs' },
        { name: 'Krishnarajapuram (KJM)', km: '345 KMs' },
        { name: 'Bengaluru Cant (BNC)', km: '355 KMs' }
      ];
    }
    return [
      { name: 'Kengeri (KGI)', km: '371 KMs' },
      { name: 'Bidadi (BID)', km: '389 KMs' },
      { name: 'Ramanagaram (RMGM)', km: '404 KMs' },
      { name: 'Channapatna (CPT)', km: '415 KMs' },
      { name: 'Maddur (MAD)', km: '433 KMs' },
      { name: 'Mandya (MYA)', km: '452 KMs' }
    ];
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const matched = allMasterTrains.find(
      (t) =>
        t.number.includes(searchInput.trim()) ||
        t.name.toLowerCase().includes(searchInput.trim().toLowerCase())
    );
    if (matched) {
      router.push(`/home/ride/train/${matched.number}`);
    } else {
      router.push(`/home/ride/train/${searchInput.trim()}`);
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'inherit', paddingBottom: '60px', position: 'relative' }}>
      {/* Floating Scroll to Bottom Button */}
      <button
        onClick={scrollToBottom}
        type="button"
        title="Scroll to bottom"
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: '#2a1373',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 14px rgba(42, 19, 115, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          zIndex: 999,
          transition: 'transform 0.2s, background 0.2s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <i className="fa-solid fa-arrow-down"></i>
      </button>

      {/* Top Banner Navigation Bar */}
      <div
        style={{
          background: '#2a1373',
          color: '#ffffff',
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 12px rgba(42, 19, 115, 0.35)',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => router.push('/home/ride/train')}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 900, letterSpacing: '0.5px' }}>
              {currentTrain.number} {currentTrain.name.toUpperCase()} ROUTE &amp; LIVE STATUS
            </h1>
            <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>
              Full train history starting to ending • Real-time station tracking
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('schedule')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'schedule' ? '#ffffff' : 'rgba(255,255,255,0.15)',
              color: activeTab === 'schedule' ? '#2a1373' : '#ffffff',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <i className="fa-solid fa-list-ol" style={{ marginRight: '6px' }}></i> Route Schedule
          </button>
          <button
            onClick={() => setActiveTab('map')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'map' ? '#ffffff' : 'rgba(255,255,255,0.15)',
              color: activeTab === 'map' ? '#2a1373' : '#ffffff',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <i className="fa-solid fa-map-location-dot" style={{ marginRight: '6px' }}></i> Google Map View
          </button>
        </div>
      </div>

      {/* Train Search Input Box matching user screenshot */}
      <div style={{ background: '#ffffff', padding: '16px 28px', borderBottom: '1px solid #e2e8f0' }}>
        <form onSubmit={handleSearchSubmit} style={{ maxWidth: '600px', display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
              Train No. / Name
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #2a1373',
                borderRadius: '8px',
                padding: '6px 12px',
                background: '#ffffff'
              }}
            >
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Train Number or Train Name "
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
              {searchInput && (
                <i
                  className="fa-solid fa-xmark"
                  onClick={() => setSearchInput('')}
                  style={{ color: '#94a3b8', cursor: 'pointer', marginRight: '10px' }}
                ></i>
              )}
              <button type="submit" style={{ background: 'none', border: 'none', color: '#2a1373', cursor: 'pointer', fontSize: '16px' }}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Live Running Status Banner */}
      <div style={{ padding: '16px 28px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
            marginBottom: '20px'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>
              LIVE TRAIN RUNNING STATUS • Start Date : 15-Nov-2026
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>
              {currentTrain.departureStationCode} → {currentTrain.arrivalStationCode} ({currentTrain.name})
            </div>
            <div style={{ fontSize: '13px', marginTop: '6px', color: '#bae6fd', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#22c55e', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, fontSize: '11px' }}>
                ON TIME
              </span>
              <span>Currently near: <strong>Katpadi Jn (KPD)</strong> • Speed: 88 km/h</span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              padding: '12px 20px',
              textAlign: 'right'
            }}
          >
            <div style={{ fontSize: '11px', color: '#e0f2fe' }}>ETA to your station:</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff' }}>
              {targetUserStation.station} ({targetUserStation.code})
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#fef08a', marginTop: '2px' }}>
              Reaching in: 1 hr 45 min • {targetUserStation.arr}
            </div>
          </div>
        </div>

        {/* Tab 1: Full Route Schedule with Intermediate and Non-Stopping stations */}
        {activeTab === 'schedule' ? (
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>

            {/* Header row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 60px 1fr 150px',
                background: '#f1f5f9',
                padding: '12px 20px',
                fontSize: '12px',
                fontWeight: 800,
                color: '#475569',
                textTransform: 'uppercase',
                borderBottom: '1px solid #cbd5e1'
              }}
            >
              <div>Arrival</div>
              <div style={{ textAlign: 'center' }}>Track</div>
              <div>Station Details</div>
              <div style={{ textAlign: 'right' }}>Departure &amp; Status</div>
            </div>

            {/* Stops list with railway track line */}
            <div style={{ position: 'relative' }}>
              {/* Continuous Blue Railway Track from Start to End */}
              <div
                style={{
                  position: 'absolute',
                  left: '168px', // Centered inside the 60px track column (140px + 20px padding + (60 - 24) / 2 = 178px approx; let's position accurately)
                  top: '20px',
                  bottom: '20px',
                  width: '24px',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              >
                {/* Parallel Blue Steel Rails */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '4px', background: '#0284c7', borderRadius: '2px', boxShadow: '0 0 4px rgba(2, 132, 199, 0.4)' }}></div>
                <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '4px', background: '#0284c7', borderRadius: '2px', boxShadow: '0 0 4px rgba(2, 132, 199, 0.4)' }}></div>

                {/* Wooden Ties / Sleepers repeating along the track */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '-3px',
                    right: '-3px',
                    backgroundImage: 'repeating-linear-gradient(to bottom, #78350f 0px, #78350f 4px, transparent 4px, transparent 20px)',
                    zIndex: 0
                  }}
                ></div>
              </div>

              {currentTrain.stops.map((stop, idx) => {
                const isPassed = idx <= currentStationIndex;
                const isCurrent = idx === currentStationIndex;
                const isLast = idx === currentTrain.stops.length - 1;
                const nonStopping = getIntermediateNonStopping(idx);
                const isExpanded = Boolean(expandedNonStopping[idx]);

                return (
                  <React.Fragment key={idx}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '140px 60px 1fr 150px',
                        padding: '18px 20px',
                        borderBottom: '1px solid #f1f5f9',
                        alignItems: 'center',
                        background: '#ffffff',
                        position: 'relative'
                      }}
                    >
                      {/* Arrival info */}
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                          {stop.arr === '--' ? 'START (SRC)' : stop.arr}
                        </div>
                        {stop.arr !== '--' && (
                          <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
                            On Time
                          </div>
                        )}
                      </div>

                      {/* Station Node / Single Train Icon on current station */}
                      <div
                        style={{
                          position: 'relative',
                          width: '44px',
                          height: '100%',
                          minHeight: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2
                        }}
                      >
                        {isCurrent ? (
                          /* Only ONE Train Icon showing live location */
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: '#0284c7',
                              border: '2.5px solid #ffffff',
                              boxShadow: '0 0 14px rgba(2, 132, 199, 0.9)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              fontSize: '13px',
                              zIndex: 4,
                              position: 'relative'
                            }}
                            title={`Train currently here: ${stop.station}`}
                          >
                            <i className="fa-solid fa-train-subway"></i>
                          </div>
                        ) : (
                          /* Station point / stop node on the track */
                          <div
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              background: isPassed ? '#1e3a8a' : '#ffffff',
                              border: `3px solid ${isPassed ? '#1e3a8a' : '#94a3b8'}`,
                              zIndex: 3,
                              position: 'relative',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                            }}
                          ></div>
                        )}
                      </div>

                      {/* Station Details */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                            {stop.station.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
                            ({stop.code})
                          </span>
                          <span
                            style={{
                              background: '#f59e0b',
                              color: '#ffffff',
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}
                          >
                            PF {idx + 1}*
                          </span>

                          {/* Coach Position Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedCoachPF(`${stop.station} (${stop.code})`)}
                            style={{
                              background: '#2563eb',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '4px 10px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <i className="fa-solid fa-train"></i> Coach Position
                          </button>
                        </div>

                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          {stop.distance || `${idx * 130} KMs`} • {stop.halt}
                        </div>

                        {/* Toggle Intermediate Non-Stopping Stations */}
                        {!isLast && (
                          <div
                            onClick={() =>
                              setExpandedNonStopping({
                                ...expandedNonStopping,
                                [idx]: !isExpanded
                              })
                            }
                            style={{
                              fontSize: '12px',
                              color: '#d97706',
                              fontWeight: 700,
                              marginTop: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span>{stop.distance || '120 KMs'} ⇓ Non-Stopping Stations ({nonStopping.length})</span>
                            <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
                          </div>
                        )}
                      </div>

                      {/* Departure info */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                          {stop.dep === '--' ? 'DESTINATION (DST)' : stop.dep}
                        </div>
                        {stop.dep !== '--' && (
                          <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
                            On Time
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Collapsible non-stopping intermediate stations in LINE BY LINE layout */}
                    {isExpanded && !isLast && (
                      <div style={{ background: '#ffffff', borderBottom: '1px solid #f1f5f9', padding: '14px 20px 14px 220px' }}>
                        <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 800, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                          Intermediate Stations Passed Without Halt (Line by Line):
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {nonStopping.map((ns, nsIdx) => (
                            <div
                              key={nsIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '200px',
                                padding: '7px 12px',
                                background: '#ffffff',
                                borderRadius: '8px',

                                fontSize: '12px',
                                color: '#78350f',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <i className="fa-solid fa-circle-dot" style={{ color: '#d97706', fontSize: '9px', flexShrink: 0 }}></i>
                                <span style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={ns.name}>{ns.name}</span>
                              </div>
                              <span style={{ fontWeight: 800, color: '#b45309', fontSize: '11px', flexShrink: 0, marginLeft: '6px' }}>{ns.km}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ) : (
          /* Tab 2: Embedded Google Map & Real-time Live Directions */
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  Live Railway Route Map &amp; Directions
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                  Tracking route from {currentTrain.departureStation} to {currentTrain.arrivalStation}
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/dir/${encodeURIComponent(currentTrain.departureStation)}/${encodeURIComponent(currentTrain.arrivalStation)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#2a1373',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa-solid fa-diamond-turn-right"></i> Open Live Directions in Google Maps
              </a>
            </div>

            {/* Embedded interactive Google Map iframe */}
            <div style={{ width: '100%', height: '550px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              <iframe
                title="Google Maps Train Route"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(currentTrain.departureStation + ' to ' + currentTrain.arrivalStation)}&t=&z=9&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
          </div>
        )}
      </div>

      {/* Coach Position Modal matching Screenshot 6 */}
      {selectedCoachPF && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedCoachPF(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '900px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Orange Title Bar matching Screenshot */}
            <div
              style={{
                background: '#f59e0b',
                color: '#ffffff',
                padding: '14px 20px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 800 }}>
                <span style={{ background: '#0284c7', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>BETA</span>
                Coach Position : {currentTrain.number} | {selectedCoachPF.toUpperCase()} | 15-Nov | PF : 1*
              </div>
              <button
                onClick={() => setSelectedCoachPF(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '18px', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Coach Horizontal Rake Layout */}
            <div style={{ overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', minWidth: '700px' }}>
                {coaches.map((c, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: '54px'
                    }}
                  >
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>
                      {c.type}
                    </span>
                    <div
                      style={{
                        width: '50px',
                        height: '36px',
                        borderRadius: '8px',
                        border: '1.5px solid #0f172a',
                        background: c.isDivyangjan ? '#eff6ff' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '12px',
                        color: '#0f172a',
                        position: 'relative'
                      }}
                    >
                      {c.label}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '4px', fontSize: '10px', color: '#64748b' }}>
                      {c.isDivyangjan && <i className="fa-solid fa-wheelchair" style={{ color: '#2563eb' }}></i>}
                      <span>{c.pos}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
              <i className="fa-solid fa-wheelchair"></i> Divyangjan Coach at Position : 1
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Note - Data shown with (*) are dynamic in nature and may change.
              </span>
              <button
                onClick={() => setSelectedCoachPF(null)}
                style={{
                  padding: '8px 22px',
                  background: '#2a1373',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

