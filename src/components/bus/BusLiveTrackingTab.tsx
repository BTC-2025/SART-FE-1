import React from 'react';
import { RouteStop } from './busData';

export interface BusLiveTrackingTabProps {
  selectedBus: any;
  isGpsEnabled: boolean;
  setIsGpsEnabled: (val: boolean) => void;
  activeFullRoute: RouteStop[];
  selectedBoardingPoint: string;
  selectedDroppingPoint: string;
  gpsCoordinates: { lat: number; lng: number };
  activeRouteData: any;
  activeBoardingPoints: any[];
  activeDroppingPoints: any[];
  setSelectedBoardingPoint: (name: string) => void;
  setSelectedDroppingPoint: (name: string) => void;
  setModalTopTab: (tab: any) => void;
}

export const BusLiveTrackingTab: React.FC<BusLiveTrackingTabProps> = ({
  selectedBus,
  isGpsEnabled,
  setIsGpsEnabled,
  activeFullRoute,
  selectedBoardingPoint,
  selectedDroppingPoint,
  gpsCoordinates,
  activeRouteData,
  activeBoardingPoints,
  activeDroppingPoints,
  setSelectedBoardingPoint,
  setSelectedDroppingPoint,
  setModalTopTab
}) => {
  return (
              <div className="bb-live-tracking-panel">
                {/* 1. GPS Controls Banner */}
                <div className={`bb-gps-control-banner ${isGpsEnabled ? 'active' : 'inactive'}`}>
                  <div className="bb-gps-banner-left">
                    <div className="bb-gps-radar-icon">
                      <i className={`fa-solid ${isGpsEnabled ? 'fa-satellite-dish fa-spin' : 'fa-location-slash'}`}></i>
                    </div>
                    <div className="bb-gps-banner-text">
                      <div className="bb-gps-banner-title">
                        {isGpsEnabled ? '🟢 GPS Active: Bus Live Tracking Enabled' : '⚠️ Device GPS is OFF'}
                      </div>
                      <div className="bb-gps-banner-desc">
                        {isGpsEnabled
                          ? 'Real-time satellite lock synchronized (Accuracy: ±4.5m). Live bus telemetry & route proximity updated.'
                          : 'Turn on GPS to receive live real-time bus location, stops countdown, and proximity alerts.'}
                      </div>
                    </div>
                  </div>

                  <div className="bb-gps-banner-actions">
                    <button
                      type="button"
                      className={`bb-gps-toggle-btn ${isGpsEnabled ? 'btn-active' : 'btn-turn-on'}`}
                      onClick={() => setIsGpsEnabled(!isGpsEnabled)}
                    >
                      {isGpsEnabled ? '🛰️ Turn OFF GPS' : '🛰️ Turn ON GPS'}
                    </button>
                  </div>
                </div>

                {/* 2. Key Metrics Row */}
                <div className="bb-tracking-metrics-grid">
                  <div className="bb-metric-stat-card">
                    <div className="bb-metric-label">
                      <i className="fa-solid fa-bus"></i> Where the Bus is
                    </div>
                    <div className="bb-metric-value highlight">
                      {isGpsEnabled ? 'Guindy Kathipara Junction' : 'GPS Required'}
                    </div>
                    <div className="bb-metric-sub">
                      {isGpsEnabled ? 'Speed: 52 km/h • Highway NH-48' : 'Click "Turn ON GPS" to locate'}
                    </div>
                  </div>

                  <div className="bb-metric-stat-card">
                    <div className="bb-metric-label">
                      <i className="fa-solid fa-bus"></i> Where the Bus is
                    </div>
                    <div className="bb-metric-value highlight">
                      {isGpsEnabled
                        ? (activeFullRoute[Math.min(2, activeFullRoute.length - 1)]?.name || 'In Transit')
                        : 'GPS Required'}
                    </div>
                    <div className="bb-metric-sub">
                      {isGpsEnabled ? 'Speed: 52 km/h • Highway NH-48' : 'Click "Turn ON GPS" to locate'}
                    </div>
                  </div>

                  <div className="bb-metric-stat-card">
                    <div className="bb-metric-label">
                      <i className="fa-solid fa-signs-post"></i> Total Route Stops
                    </div>
                    <div className="bb-metric-value">{activeFullRoute.length} Stops</div>
                    <div className="bb-metric-sub">Full route from {activeRouteData.cleanSrc} to {activeRouteData.cleanDst}</div>
                  </div>

                  <div className="bb-metric-stat-card">
                    <div className="bb-metric-label">
                      <i className="fa-solid fa-hourglass-half"></i> Stops Before Your Boarding Point
                    </div>
                    {(() => {
                      const busCurrentIdx = Math.min(2, activeFullRoute.length - 1);
                      const boardIdx = activeFullRoute.findIndex(s =>
                        s.name.toLowerCase().includes(selectedBoardingPoint.toLowerCase()) ||
                        selectedBoardingPoint.toLowerCase().includes(s.name.toLowerCase())
                      );
                      const actualBoardIdx = boardIdx >= 0 ? boardIdx : Math.min(3, activeFullRoute.length - 1);
                      const stopsBefore = Math.max(0, actualBoardIdx - busCurrentIdx);
                      return (
                        <>
                          <div className="bb-metric-value blue-text">
                            {isGpsEnabled ? `${stopsBefore} Stops Away` : 'Calculating...'}
                          </div>
                          <div className="bb-metric-sub">
                            {isGpsEnabled
                              ? `Before ${selectedBoardingPoint} (approx. ${stopsBefore * 12 + 10} mins)`
                              : `Selected: ${selectedBoardingPoint}`}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* 3. Interactive Route Map (GPS Gated - Allowed Only with GPS) */}
                <div className="bb-live-tracking-map-container">
                  <div className="bb-map-top-header">
                    <div className="bb-map-title-left">
                      <i className="fa-solid fa-map-location-dot" style={{ color: '#38bdf8', fontSize: '16px' }}></i>
                      <span>Live Satellite Route Telemetry & Points Map</span>
                      {isGpsEnabled && <span className="bb-map-live-ping-dot" title="Live GPS Signal Active"></span>}
                    </div>
                    <div className={`bb-map-gps-pill ${isGpsEnabled ? 'active' : 'disabled'}`}>
                      <i className={`fa-solid ${isGpsEnabled ? 'fa-satellite-dish' : 'fa-location-slash'}`}></i>
                      <span>{isGpsEnabled ? 'GPS LOCKED (±4.5m)' : 'GPS STANDBY'}</span>
                    </div>
                  </div>

                  <div className="bb-map-canvas-wrap">
                    {!isGpsEnabled ? (
                      /* Standby Overlay when GPS is NOT Allowed */
                      <div className="bb-map-gps-standby-screen">
                        <div className="bb-radar-scanner-disc">
                          <i className="fa-solid fa-satellite bb-standby-satellite-icon"></i>
                        </div>
                        <h4 className="bb-standby-heading">GPS Authorization Required for Map</h4>
                        <p className="bb-standby-subtext">
                          Turn ON GPS to view the live interactive satellite route map showing your{' '}
                          <strong style={{ color: '#60a5fa' }}>Boarding Point</strong>,{' '}
                          <strong style={{ color: '#60a5fa' }}>Dropping Point</strong>, and all route waypoints from{' '}
                          <strong>{activeRouteData.cleanSrc}</strong> to <strong>{activeRouteData.cleanDst}</strong>.
                        </p>
                        <button
                          type="button"
                          className="bb-allow-gps-action-btn"
                          onClick={() => setIsGpsEnabled(true)}
                        >
                          <i className="fa-solid fa-location-crosshairs"></i> Turn ON GPS to View Map Points
                        </button>
                      </div>
                    ) : (
                      /* Active Visualizer when GPS is Allowed */
                      <div className="bb-map-active-visualizer">
                        {/* Floating Live Telemetry Box */}
                        <div className="bb-map-telemetry-floating-box">
                          <div className="bb-map-telemetry-item">
                            <span className="telem-label">Bus Speed</span>
                            <span className="telem-val">52 km/h</span>
                          </div>
                          <div className="bb-map-telemetry-item">
                            <span className="telem-label">Active Highway</span>
                            <span className="telem-val">NH-48 Corridor</span>
                          </div>
                          <div className="bb-map-telemetry-item">
                            <span className="telem-label">Current Node</span>
                            <span className="telem-val" style={{ color: '#34d399' }}>
                              {activeFullRoute[Math.min(2, activeFullRoute.length - 1)]?.name || 'In Transit'}
                            </span>
                          </div>
                        </div>

                        {/* Interactive SVG Route Map with Boarding/Dropping Points */}
                        {(() => {
                          const total = activeFullRoute.length;
                          const busCurrentIdx = Math.min(2, total - 1);
                          const boardIdxRaw = activeFullRoute.findIndex(s =>
                            s.name.toLowerCase().includes(selectedBoardingPoint.toLowerCase()) ||
                            selectedBoardingPoint.toLowerCase().includes(s.name.toLowerCase())
                          );
                          const boardIdx = boardIdxRaw >= 0 ? boardIdxRaw : Math.min(3, total - 1);

                          const dropIdxRaw = activeFullRoute.findIndex(s =>
                            s.name.toLowerCase().includes(selectedDroppingPoint.toLowerCase()) ||
                            selectedDroppingPoint.toLowerCase().includes(s.name.toLowerCase())
                          );
                          const dropIdx = dropIdxRaw >= 0 ? dropIdxRaw : total - 1;

                          // Compute coordinates along a curved road across the canvas (width: 900, height: 380)
                          const mapPoints = activeFullRoute.map((stop, i) => {
                            const ratio = total > 1 ? i / (total - 1) : 0.5;
                            const x = 75 + ratio * 750;
                            // Natural curved path
                            const y = 210 + Math.sin(ratio * Math.PI * 2) * -50 + (i % 2 === 0 ? 12 : -12);
                            return { ...stop, index: i, x, y };
                          });

                          const busPoint = mapPoints[busCurrentIdx] || mapPoints[0];
                          const boardPoint = mapPoints[boardIdx] || mapPoints[0];
                          const dropPoint = mapPoints[dropIdx] || mapPoints[mapPoints.length - 1];

                          // Create SVG path string
                          const fullPathD = mapPoints.reduce((acc, p, i) => {
                            if (i === 0) return `M ${p.x} ${p.y}`;
                            const prev = mapPoints[i - 1];
                            const cx = (prev.x + p.x) / 2;
                            return `${acc} Q ${cx} ${prev.y}, ${p.x} ${p.y}`;
                          }, '');

                          // Boarding to Dropping Path
                          const paxSegmentPoints = mapPoints.slice(boardIdx, dropIdx + 1);
                          const paxPathD = paxSegmentPoints.reduce((acc, p, i) => {
                            if (i === 0) return `M ${p.x} ${p.y}`;
                            const prev = paxSegmentPoints[i - 1];
                            const cx = (prev.x + p.x) / 2;
                            return `${acc} Q ${cx} ${prev.y}, ${p.x} ${p.y}`;
                          }, '');

                          return (
                            <svg
                              className="bb-map-svg-frame"
                              viewBox="0 0 900 380"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <defs>
                                <linearGradient id="blueTrackGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#2563eb" />
                                  <stop offset="50%" stopColor="#38bdf8" />
                                  <stop offset="100%" stopColor="#1d4ed8" />
                                </linearGradient>
                                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                                  <feGaussianBlur stdDeviation="3" result="blur" />
                                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                              </defs>

                              {/* Map Background Grid Lines */}
                              <g opacity="0.12" stroke="#64748b" strokeWidth="1">
                                <line x1="0" y1="95" x2="900" y2="95" strokeDasharray="6 6" />
                                <line x1="0" y1="190" x2="900" y2="190" strokeDasharray="6 6" />
                                <line x1="0" y1="285" x2="900" y2="285" strokeDasharray="6 6" />
                                <line x1="225" y1="0" x2="225" y2="380" strokeDasharray="6 6" />
                                <line x1="450" y1="0" x2="450" y2="380" strokeDasharray="6 6" />
                                <line x1="675" y1="0" x2="675" y2="380" strokeDasharray="6 6" />
                              </g>

                              {/* Base Highway Road Track (Yellow/Dark Gray) */}
                              <path
                                d={fullPathD}
                                fill="none"
                                stroke="#eab308"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity="0.65"
                              />

                              {/* YOUR JOURNEY: Glowing BLUE Track between Boarding and Dropping points */}
                              {paxSegmentPoints.length > 1 && (
                                <path
                                  d={paxPathD}
                                  fill="none"
                                  stroke="url(#blueTrackGlow)"
                                  strokeWidth="7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  filter="url(#glowEffect)"
                                />
                              )}

                              {/* Stop Markers on Map */}
                              {mapPoints.map(p => {
                                const isBoard = p.index === boardIdx;
                                const isDrop = p.index === dropIdx;
                                const isBus = p.index === busCurrentIdx;
                                const isPaxZone = p.index >= boardIdx && p.index <= dropIdx;

                                if (isBoard || isDrop) {
                                  // BLUE BOARDING OR DROPPING POINT
                                  return (
                                    <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
                                      <circle r="14" fill="#1d4ed8" opacity="0.3" className="bb-map-ping-circle" />
                                      <circle r="8" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
                                      {/* Marker Pin Tooltip Badge */}
                                      <g transform={`translate(0, ${p.y > 200 ? -28 : 28})`}>
                                        <rect
                                          x="-58"
                                          y="-14"
                                          width="116"
                                          height="26"
                                          rx="6"
                                          fill="#1e3a8a"
                                          stroke="#60a5fa"
                                          strokeWidth="1.5"
                                        />
                                        <text
                                          x="0"
                                          y="3"
                                          textAnchor="middle"
                                          fill="#ffffff"
                                          fontSize="11"
                                          fontWeight="800"
                                        >
                                          {isBoard ? '🔵 Boarding' : '🔵 Dropping'}
                                        </text>
                                      </g>
                                      {/* Sub-label for place name */}
                                      <text
                                        x="0"
                                        y={p.y > 200 ? -46 : 46}
                                        textAnchor="middle"
                                        fill="#93c5fd"
                                        fontSize="10"
                                        fontWeight="700"
                                      >
                                        {p.name.length > 14 ? p.name.substring(0, 14) + '...' : p.name}
                                      </text>
                                    </g>
                                  );
                                } else {
                                  // REMAINING STOP: YELLOW PIN
                                  return (
                                    <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
                                      <circle r="5" fill="#facc15" stroke="#713f12" strokeWidth="1.5" />
                                      <text
                                        x="0"
                                        y={p.index % 2 === 0 ? 18 : -14}
                                        textAnchor="middle"
                                        fill="#fef08a"
                                        fontSize="9.5"
                                        fontWeight="700"
                                      >
                                        {p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name}
                                      </text>
                                    </g>
                                  );
                                }
                              })}

                              {/* LIVE BUS INDICATOR (Moving / Active Pos) */}
                              {busPoint && (
                                <g transform={`translate(${busPoint.x}, ${busPoint.y - 12})`}>
                                  <circle r="22" fill="#10b981" opacity="0.25">
                                    <animate attributeName="r" values="18;28;18" dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2s" repeatCount="indefinite" />
                                  </circle>
                                  <circle r="14" fill="#047857" stroke="#ffffff" strokeWidth="2" />
                                  <text x="0" y="4" textAnchor="middle" fontSize="13">🚍</text>
                                  <rect
                                    x="-35"
                                    y="-32"
                                    width="70"
                                    height="18"
                                    rx="4"
                                    fill="#064e3b"
                                    stroke="#34d399"
                                    strokeWidth="1"
                                  />
                                  <text x="0" y="-20" textAnchor="middle" fill="#a7f3d0" fontSize="9.5" fontWeight="900">
                                    LIVE BUS
                                  </text>
                                </g>
                              )}
                            </svg>
                          );
                        })()}

                        {/* Floating Legend Overlay */}
                        <div className="bb-map-legend-floating-overlay">
                          <div>
                            <span className="bb-map-legend-dot blue"></span>
                            <span>Boarding & Dropping Points</span>
                          </div>
                          <div>
                            <span className="bb-map-legend-dot yellow"></span>
                            <span>Remaining Stops</span>
                          </div>
                          <div>
                            <span className="bb-map-legend-dot green"></span>
                            <span>Live Bus (GPS Lock)</span>
                          </div>
                        </div>

                        {/* Floating Map Controls */}
                        <div className="bb-map-controls-floating-row">
                          <button type="button" className="bb-map-control-btn" title="Zoom In">+</button>
                          <button type="button" className="bb-map-control-btn" title="Zoom Out">−</button>
                          <button
                            type="button"
                            className="bb-map-control-btn"
                            title="Recenter on Bus"
                            onClick={() => { }}
                          >
                            <i className="fa-solid fa-crosshairs"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Color Legend for Route */}
                <div className="bb-route-color-legend-bar">
                  <div className="bb-color-legend-item">
                    <span className="bb-route-legend-badge your-route"></span>
                    <span><strong>Your Journey (Boarding to Dropping): BLUE</strong></span>
                  </div>
                  <div className="bb-color-legend-item">
                    <span className="bb-route-legend-badge bus-terminus"></span>
                    <span><strong>Remaining Route Stops: YELLOW</strong></span>
                  </div>
                </div>

                {/* 5. Complete Colored Route Timeline */}
                <div className="bb-route-full-visual-timeline">
                  {(() => {
                    const busCurrentIdx = Math.min(2, activeFullRoute.length - 1);
                    const boardIdxRaw = activeFullRoute.findIndex(s =>
                      s.name.toLowerCase().includes(selectedBoardingPoint.toLowerCase()) ||
                      selectedBoardingPoint.toLowerCase().includes(s.name.toLowerCase())
                    );
                    const boardIdx = boardIdxRaw >= 0 ? boardIdxRaw : Math.min(3, activeFullRoute.length - 1);

                    const dropIdxRaw = activeFullRoute.findIndex(s =>
                      s.name.toLowerCase().includes(selectedDroppingPoint.toLowerCase()) ||
                      selectedDroppingPoint.toLowerCase().includes(s.name.toLowerCase())
                    );
                    const dropIdx = dropIdxRaw >= 0 ? dropIdxRaw : activeFullRoute.length - 1;

                    return activeFullRoute.map((stop, index) => {
                      const isCurrentBusStop = index === busCurrentIdx;
                      const isPassengerBoarding = index === boardIdx;
                      const isPassengerDropping = index === dropIdx;
                      const isBusEndingPoint = index === activeFullRoute.length - 1;

                      // Boarding to Dropping point is BLUE, remaining is YELLOW
                      const isInPassengerSegment = index >= boardIdx && index <= dropIdx;
                      const isConnectingBlue = index >= boardIdx && index < dropIdx;
                      const isPreBoarding = index < boardIdx;

                      return (
                        <div
                          key={stop.id}
                          className={`bb-route-stop-card-item ${isInPassengerSegment ? 'passenger-blue-zone' : 'remaining-yellow-zone'
                            }`}
                        >
                          {/* Left node and connecting track line */}
                          <div className="bb-stop-track-col">
                            <div
                              className={`bb-stop-circle-marker ${isInPassengerSegment ? 'marker-blue' : 'marker-yellow'
                                }`}
                            >
                              {isCurrentBusStop && isGpsEnabled ? (
                                <i className="fa-solid fa-bus-simple bb-pulse-bus-icon"></i>
                              ) : isPassengerBoarding ? (
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                              ) : isPassengerDropping ? (
                                <i className="fa-solid fa-location-dot"></i>
                              ) : isBusEndingPoint ? (
                                <i className="fa-solid fa-flag-checkered"></i>
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>
                            {index < activeFullRoute.length - 1 && (
                              <div
                                className={`bb-track-segment-line ${isConnectingBlue ? 'line-blue' : 'line-yellow'
                                  }`}
                              ></div>
                            )}
                          </div>

                          {/* Stop Details */}
                          <div className="bb-stop-details-col">
                            <div className="bb-stop-header-row">
                              <span className="bb-stop-time">{stop.time}</span>
                              <h4 className="bb-stop-name">{stop.name}</h4>

                              {/* Badges */}
                              {isCurrentBusStop && isGpsEnabled && (
                                <span className="bb-stop-badge current-bus-badge">
                                  <span className="bb-radar-dot"></span> Live Bus Position
                                </span>
                              )}
                              {isPassengerBoarding && (
                                <span className="bb-stop-badge boarding-pax-badge">
                                  <i className="fa-solid fa-circle-check"></i> Your Boarding Point (Blue)
                                </span>
                              )}
                              {isPassengerDropping && (
                                <span className="bb-stop-badge dropping-pax-badge">
                                  <i className="fa-solid fa-location-dot"></i> Your Dropping Point (Blue)
                                </span>
                              )}
                              {isInPassengerSegment && !isPassengerBoarding && !isPassengerDropping && (
                                <span className="bb-stop-badge dropping-pax-badge">
                                  <i className="fa-solid fa-road"></i> In Your Journey (Blue)
                                </span>
                              )}
                              {!isInPassengerSegment && (
                                <span className="bb-stop-badge remaining-yellow-badge">
                                  {isBusEndingPoint ? (
                                    <>
                                      <i className="fa-solid fa-flag-checkered"></i> Bus Ending Point (Yellow)
                                    </>
                                  ) : (
                                    'Remaining Route (Yellow)'
                                  )}
                                </span>
                              )}
                            </div>

                            <div className="bb-stop-landmark-text">
                              <i className="fa-solid fa-location-arrow"></i> {stop.landmark}
                            </div>

                            {/* Proximity notice for pre-boarding stops */}
                            {isPreBoarding && isCurrentBusStop && isGpsEnabled && (
                              <div className="bb-stop-proximity-alert">
                                🚍 Bus is at this stop now ({boardIdx - index} stop(s) before your boarding point at {selectedBoardingPoint})
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Footer Navigation */}
                <div className="bb-modal-footer-nav-row" style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    className="bb-nav-back-btn"
                    onClick={() => setModalTopTab('boarding_dropping')}
                  >
                    ← Back to Boarding / Dropping
                  </button>
                  <button
                    type="button"
                    className="bb-confirm-book-btn"
                    onClick={() => setModalTopTab('passenger_info')}
                  >
                    Continue to Passenger Info →
                  </button>
                </div>
      </div>
  );
};