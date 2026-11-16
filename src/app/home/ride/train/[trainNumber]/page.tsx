'use client';

import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ALL_CHENNAI_BANGALORE_TRAINS, EXPANDED_CORRIDOR_TRAINS, INITIAL_TRAINS, TrainItem } from '@/components/trainData';
import { TRAIN_12007_FULL_SCHEDULE, TrainStopScheduleItem } from '@/components/trains/train12007ScheduleData';
import Footer from '@/components/Footer';
import './TrainLiveRoute.css';

export default function TrainRouteHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const trainNumberParam = params?.trainNumber ? String(params.trainNumber) : '12007';

  // Search input for train number or name
  const [searchInput, setSearchInput] = useState(trainNumberParam);
  const [selectedCoachPF, setSelectedCoachPF] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'schedule' | 'map'>('schedule');

  // Ref for scrolling to the end of the page
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Find train in master catalog
  const allMasterTrains = [
    ...ALL_CHENNAI_BANGALORE_TRAINS,
    ...EXPANDED_CORRIDOR_TRAINS,
    ...INITIAL_TRAINS
  ];

  const currentTrain =
    allMasterTrains.find((t) => t.number === trainNumberParam || t.id === trainNumberParam) ||
    allMasterTrains.find((t) => t.number === '12007') ||
    ALL_CHENNAI_BANGALORE_TRAINS[0];

  const isTrain12007 = trainNumberParam === '12007' || currentTrain.number === '12007';
  const scheduleData: TrainStopScheduleItem[] = isTrain12007 ? TRAIN_12007_FULL_SCHEDULE : TRAIN_12007_FULL_SCHEDULE;

  // Identify index where the train currently is (Kuppam - index 56)
  const currentCrossedIdx = scheduleData.findIndex((s) => s.isCurrentCrossed) !== -1
    ? scheduleData.findIndex((s) => s.isCurrentCrossed)
    : 56;

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
    // Shatabdi / Express standard rake
    return [
      { type: 'ENG', label: 'ENG', code: 'ENG', pos: 0 },
      { type: 'SLRD', label: 'SLRD', code: 'SLRD', pos: 1, isDivyangjan: true },
      { type: 'GEN', label: 'GEN', code: 'GEN', pos: 2 },
      { type: 'GEN', label: 'GEN', code: 'GEN', pos: 3 },
      { type: 'CC', label: 'C1', code: 'CC', pos: 4 },
      { type: 'CC', label: 'C2', code: 'CC', pos: 5 },
      { type: 'CC', label: 'C3', code: 'CC', pos: 6 },
      { type: 'CC', label: 'C4', code: 'CC', pos: 7 },
      { type: 'CC', label: 'C5', code: 'CC', pos: 8 },
      { type: 'CC', label: 'C6', code: 'CC', pos: 9 },
      { type: 'PC', label: 'PC', code: 'PC', pos: 10 },
      { type: 'EC', label: 'E1', code: 'EC', pos: 11 },
      { type: 'EC', label: 'E2', code: 'EC', pos: 12 },
      { type: 'EA', label: 'EA', code: 'EA', pos: 13 },
      { type: 'GEN', label: 'GEN', code: 'GEN', pos: 14 },
      { type: 'LPR', label: 'LPR', code: 'LPR', pos: 15 }
    ];
  };

  const coaches = getCoachPositions(currentTrain);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const cleanSearch = searchInput.trim().toUpperCase();
    const matched = allMasterTrains.find(
      (t) =>
        t.number.toUpperCase().includes(cleanSearch) ||
        t.name.toUpperCase().includes(cleanSearch) ||
        (t.departureStation && t.departureStation.toUpperCase().includes(cleanSearch)) ||
        (t.arrivalStation && t.arrivalStation.toUpperCase().includes(cleanSearch)) ||
        (t.departureStationCode && t.departureStationCode.toUpperCase().includes(cleanSearch)) ||
        (t.arrivalStationCode && t.arrivalStationCode.toUpperCase().includes(cleanSearch))
    );
    if (matched) {
      router.push(`/home/ride/train/${matched.number}`);
    } else {
      router.push(`/home/ride/train/${cleanSearch}`);
    }
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
    if (typeof window !== 'undefined') {
      const mainContent = document.querySelector('.web-main-content');
      if (mainContent) {
        mainContent.scrollTo({ top: mainContent.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="web-app-layout tlr-page-wrapper"
      style={{
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Floating Scroll to Bottom Button */}
      <button
        type="button"
        className="tlr-scroll-bottom-btn"
        onClick={scrollToBottom}
        title="Scroll to bottom"
      >
        <i className="fa-solid fa-arrow-down"></i>
      </button>

      {/* Top Dark Violet Navbar */}
      <div className="tlr-navbar">
        <div className="tlr-nav-left">
          <button
            onClick={() => router.back()}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer'
            }}
            title="Go Back"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '0.5px' }}>
              {currentTrain.number} {currentTrain.name.toUpperCase()} ROUTE & LIVE STATUS
            </h1>
            <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '2px 0 0 0' }}>
              Full train history starting to ending • Real-time station tracking
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('schedule')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              background: activeTab === 'schedule' ? '#ffffff' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'schedule' ? '#2a1373' : '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <i className="fa-solid fa-list-check"></i>
            Route Schedule
          </button>
          <button
            onClick={() => setActiveTab('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              background: activeTab === 'map' ? '#ffffff' : 'rgba(255,255,255,0.1)',
              color: activeTab === 'map' ? '#2a1373' : '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <i className="fa-solid fa-map-location-dot"></i>
            Google Map View
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '24px 32px 40px', maxWidth: '1440px', margin: '0 auto', width: '100%', flex: 1 }}>
        {/* Train Search Bar with Train No & Name beside */}
        <div style={{ marginBottom: '20px' }}>
          <form
            onSubmit={handleSearchSubmit}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}
          >
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Train No. / Name"
                style={{
                  width: '100%',
                  padding: '10px 42px 10px 18px',
                  borderRadius: '24px',
                  border: '1.5px solid #2a1373',
                  fontSize: '14px',
                  fontWeight: 600,
                  outline: 'none',
                  background: '#ffffff',
                  boxShadow: '0 2px 6px rgba(42, 19, 115, 0.08)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
                <button
                  type="submit"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2a1373',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>

            {/* Display train number and train name beside the search input */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#ffffff',
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}
            >
              <span
                style={{
                  background: '#2a1373',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '12px',
                  padding: '3px 8px',
                  borderRadius: '12px'
                }}
              >
                {currentTrain.number}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                {currentTrain.name}
              </span>
            </div>
          </form>
        </div>

        {/* Live Running Status Banner */}
        <div
          style={{
            background: 'linear-gradient(90deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '18px 24px',
            marginBottom: '20px',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>
              LIVE TRAIN RUNNING STATUS • START DATE : 16-NOV-2026
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>
              MAS → MYS ({currentTrain.name})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <span
                style={{
                  background: '#ef4444',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}
              >
                DELAYED BY 8M
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>
                Crossed at Kuppam (KPN) • Updated 9:26 AM November 16
              </span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '12px 20px',
              borderRadius: '8px',
              textAlign: 'right'
            }}
          >
            <div style={{ fontSize: '11px', opacity: 0.9 }}>Delay Status:</div>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>Late 8 min</div>
            <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '2px' }}>
              Reaching Mysuru in 3 hrs 19 min
            </div>
          </div>
        </div>

        {/* Train Timetable Card (RailMitra 12007 Style) */}
        <div className="tlr-table-card" style={{ marginBottom: '32px' }}>
          {/* Table Header matching RailMitra */}
          <div className="tlr-table-header">
            <div>Arrival</div>
            <div>Station Name</div>
            <div>Day</div>
            <div>Halt</div>
            <div>Departure</div>
          </div>

          {/* List of Stations */}
          <div className="tlr-table-body">
            {scheduleData.map((item, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === scheduleData.length - 1;
              const isCurrent = idx === currentCrossedIdx;
              const isPassed = idx < currentCrossedIdx;
              const isFuture = idx > currentCrossedIdx;

              // Top track is passed if current or passed
              const topTrackPassed = idx <= currentCrossedIdx;
              // Bottom track is passed only if strictly before current
              const bottomTrackPassed = idx < currentCrossedIdx;

              return (
                <div
                  key={idx}
                  className={`tlr-station-row ${item.isHalt ? 'major-halt' : 'minor-stop'} ${isCurrent ? 'current-location-row' : ''}`}
                >
                  {/* Column 1: Arrival */}
                  <div className="tlr-col-arr">
                    {item.arr === 'Start' ? (
                      <span className="tlr-start-tag">Start</span>
                    ) : item.arr === '--' ? (
                      <span style={{ color: '#94a3b8' }}>--</span>
                    ) : (
                      <>
                        <div className="tlr-arr-time">{item.arr}</div>
                        {item.delay && <div className="tlr-arr-delay">{item.delay}</div>}
                      </>
                    )}
                  </div>

                  {/* Column 2: Station Name with Route Track & Node */}
                  <div className="tlr-col-station">
                    {/* Top track half (incoming from previous station) */}
                    {!isFirst && (
                      <div
                        className={`tlr-track-segment-top ${topTrackPassed ? 'track-passed' : 'track-future'}`}
                      />
                    )}

                    {/* Bottom track half (outgoing to next station) */}
                    {!isLast && (
                      <div
                        className={`tlr-track-segment-bottom ${bottomTrackPassed ? 'track-passed' : 'track-future'}`}
                      />
                    )}

                    {/* Station Node / Point:
                        - Past station: Solid blue dot
                        - Current crossed station: Pulsing train icon badge
                        - Future station: Hollow circle with blue border
                    */}
                    <div className="tlr-node-wrapper">
                      {isCurrent ? (
                        <div className="tlr-node-current" title="Train currently here">
                          <i className="fa-solid fa-train"></i>
                        </div>
                      ) : isPassed ? (
                        <div className={`tlr-node-passed ${item.isHalt ? 'major' : 'minor'}`} />
                      ) : (
                        <div className={`tlr-node-future ${item.isHalt ? 'major' : 'minor'}`} />
                      )}
                    </div>

                    {/* Station Name & Details */}
                    <div className="tlr-station-details">
                      <div className="tlr-station-header-line">
                        <span className="tlr-station-name">
                          {item.station} {item.code ? `(${item.code})` : ''}
                        </span>

                        {item.isHalt && item.pf && item.pf !== '--' && (
                          <span className="tlr-pf-badge">{item.pf}</span>
                        )}

                        {item.isHalt && (
                          <button
                            type="button"
                            className="tlr-coach-btn"
                            onClick={() => setSelectedCoachPF(item.station)}
                          >
                            <i className="fa-solid fa-train-subway"></i> Coach Position
                          </button>
                        )}
                      </div>

                      <div className="tlr-station-subtext">
                        <span>{item.distance}</span>
                        {isCurrent && (
                          <span className="tlr-crossed-badge">
                            • Crossed at {item.dep || item.arr}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Day */}
                  <div className="tlr-col-day">
                    <div className="tlr-day-main">{item.day}</div>
                    <div className="tlr-day-sub">{item.date}</div>
                  </div>

                  {/* Column 4: Halt */}
                  <div className="tlr-col-halt">
                    {item.halt}
                  </div>

                  {/* Column 5: Departure */}
                  <div className="tlr-col-dep">
                    {item.dep === 'End' ? (
                      <span className="tlr-start-tag" style={{ background: '#64748b' }}>End</span>
                    ) : item.dep === '--' ? (
                      <span style={{ color: '#94a3b8' }}>--</span>
                    ) : (
                      <>
                        <div className="tlr-dep-time">{item.dep}</div>
                        {item.delay && (
                          <div
                            className={`tlr-delay-tag ${item.delay === 'RT' ? 'ontime' : ''}`}
                          >
                            {item.delay}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global SART Footer at the end of the page */}
      <Footer />

      {/* Coach Position Modal */}
      {selectedCoachPF && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setSelectedCoachPF(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px 28px',
              maxWidth: '850px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Coach Position at {selectedCoachPF}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                  Train No: {currentTrain.number} • Platform Coach Arrangement
                </p>
              </div>
              <button
                onClick={() => setSelectedCoachPF(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
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
                    <span
                      style={{
                        fontSize: '10px',
                        color: '#64748b',
                        fontWeight: 700,
                        marginBottom: '4px'
                      }}
                    >
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        marginTop: '4px',
                        fontSize: '10px',
                        color: '#64748b'
                      }}
                    >
                      {c.isDivyangjan && (
                        <i className="fa-solid fa-wheelchair" style={{ color: '#2563eb' }}></i>
                      )}
                      <span>{c.pos}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                fontSize: '12px',
                color: '#ef4444',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '20px'
              }}
            >
              <i className="fa-solid fa-wheelchair"></i> Divyangjan Coach at Position : 1
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '16px'
              }}
            >
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

      {/* Anchor for Scrolling to Bottom */}
      <div ref={bottomRef} style={{ height: '1px' }}></div>
    </div>
  );
}
