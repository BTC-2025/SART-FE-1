'use client';

import React, { useState } from 'react';
import { TrainItem, TrainClassOption } from '../trainData';
import TrainInlineAvailability from './TrainInlineAvailability';

interface TrainCardProps {
  train: TrainItem;
  onViewRoute: (train: TrainItem) => void;
  onViewSchedule?: (train: TrainItem) => void;
  onSelectClass: (train: TrainItem, cls: TrainClassOption) => void;
  selectedClassOption?: TrainClassOption | null;
  dateOfJourney?: string;
  onSelectBooking?: (train: TrainItem, cls: TrainClassOption, date: string) => void;
}

export default function TrainCard({
  train,
  onViewRoute,
  onViewSchedule,
  onSelectClass,
  selectedClassOption,
  dateOfJourney = '16 Nov, 2026',
  onSelectBooking
}: TrainCardProps) {
  const [isRefreshing, setIsRefreshing] = useState<Record<string, boolean>>({});

  // Days of week list
  const DAYS_INITIALS = [
    { label: 'M', name: 'Mon', index: 0 },
    { label: 'T', name: 'Tue', index: 1 },
    { label: 'W', name: 'Wed', index: 2 },
    { label: 'T', name: 'Thu', index: 3 },
    { label: 'F', name: 'Fri', index: 4 },
    { label: 'S', name: 'Sat', index: 5 },
    { label: 'S', name: 'Sun', index: 6 }
  ];

  const runningDaysStr = (train.runningDays || '').toUpperCase();
  const isDaily = runningDaysStr.includes('DAILY') || runningDaysStr.replace(/\s+/g, '') === 'MTWTFSS';

  const checkRunsOnDay = (index: number) => {
    // 22625 Sbc Double Deck: does NOT run on Tuesday (index 1) and Thursday (index 3)
    if (train.number === '22625' || train.name.toLowerCase().includes('double deck')) {
      return index !== 1 && index !== 3;
    }
    if (isDaily) return true;
    if (train.number === '15228' || train.name.includes('MFP')) {
      return index === 2; // Wednesday only as per image
    }
    if (train.number === '22502' || train.name.includes('NTSK')) {
      return index === 4; // Friday only
    }
    const cleanTokens = runningDaysStr.split(/\s+/);
    if (cleanTokens.length === 7) {
      return cleanTokens[index] !== '-';
    }
    return true;
  };

  const handleRefreshClick = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    setIsRefreshing((prev) => ({ ...prev, [code]: true }));
    setTimeout(() => {
      setIsRefreshing((prev) => ({ ...prev, [code]: false }));
    }, 600);
  };

  // Format full class name for label (e.g. "Sleeper (SL)", "AC 3 Tier (3A)")
  const getFullClassLabel = (code: string) => {
    switch (code) {
      case 'SL': return 'Sleeper (SL)';
      case '3E': return 'AC 3 Economy (3E)';
      case '3A': return 'AC 3 Tier (3A)';
      case '2A': return 'AC 2 Tier (2A)';
      case '1A': return 'AC First Class (1A)';
      case 'CC': return 'AC Chair car (CC)';
      case 'EC': return 'Exec. Chair Car (EC)';
      case 'EA': return 'Anubhuti Class (EA)';
      case '2S': return 'Second Sitting (2S)';
      default: return code;
    }
  };

  // Primary available class to book
  const primaryClass = selectedClassOption || train.classes[0];

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
        padding: '16px 20px',
        marginBottom: '16px',
        fontFamily: 'inherit'
      }}
    >
      {/* 1. Top Header: Train Name (Train Number) | Runs On: M T W T F S S | Train Schedule */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
            {train.name.toUpperCase()} ({train.number})
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Runs On: M T W T F S S */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Runs On:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {DAYS_INITIALS.map((d) => {
                const isRunning = checkRunsOnDay(d.index);
                return (
                  <span
                    key={d.index}
                    title={`${d.name}: ${isRunning ? 'Runs' : 'Does not run'}`}
                    style={{
                      fontSize: '12px',
                      fontWeight: isRunning ? 900 : 500,
                      color: isRunning ? '#0f172a' : '#cbd5e1',
                      userSelect: 'none'
                    }}
                  >
                    {d.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Train Schedule Link Button */}
          <button
            type="button"
            onClick={() => {
              if (onViewSchedule) onViewSchedule(train);
              else onViewRoute(train);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0284c7',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Train Schedule
          </button>
        </div>
      </div>

      {/* 2. Stations & Timing Row: 03:05 | PERAMBUR | Wed, 18 Nov  —— 01:40 ——  04:45 | KATPADI JN. | Wed, 18 Nov */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 0 16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Source Station */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
            {train.departureTime}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
            | {train.departureStation.toUpperCase()} | {dateOfJourney}
          </span>
        </div>

        {/* Duration line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>
          <span style={{ width: '40px', height: '1px', background: '#cbd5e1' }}></span>
          <span style={{ color: '#475569' }}>{train.duration}</span>
          <span style={{ width: '40px', height: '1px', background: '#cbd5e1' }}></span>
        </div>

        {/* Destination Station */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>
            {train.arrivalTime}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
            | {train.arrivalStation.toUpperCase()} | {dateOfJourney}
          </span>
        </div>
      </div>

      {/* 3. Class Availability Cards Grid (IRCTC Box Style) */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '12px'
        }}
      >
        {train.classes.map((cls, idx) => {
          const isSelected = selectedClassOption?.code === cls.code && selectedClassOption?.isTatkal === cls.isTatkal;
          const isSpinning = Boolean(isRefreshing[cls.code]);

          return (
            <div
              key={`${cls.code}-${idx}`}
              onClick={() => onSelectClass(train, cls)}
              style={{
                minWidth: '150px',
                flex: '0 0 auto',
                background: '#ffffff',
                border: isSelected ? '1.5px solid #0070f3' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 0 0 2px rgba(0, 112, 243, 0.15)' : 'none'
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  {getFullClassLabel(cls.code)}
                </div>

                {cls.statusType === 'available' ? (
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#16a34a' }}>
                    {cls.status}
                  </div>
                ) : cls.statusType === 'wl' ? (
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#b91c1c' }}>
                    {cls.status}
                  </div>
                ) : (
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#dc2626' }}>
                    Get Availability
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  paddingTop: '6px',
                  borderTop: '1px solid #f8fafc'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>
                  <span>₹ {cls.fare.toLocaleString('en-IN')}</span>
                  <i className="fa-solid fa-circle-info" style={{ fontSize: '11px', color: '#94a3b8' }}></i>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleRefreshClick(e, cls.code)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0f172a',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <span>Refresh</span>
                  <i className={`fa-solid fa-rotate-right ${isSpinning ? 'fa-spin' : ''}`}></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. NTES Advisory Notice Note */}
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
        Please check{' '}
        <span style={{ color: '#0284c7', cursor: 'pointer' }}>NTES website</span> or{' '}
        <span style={{ color: '#0284c7', cursor: 'pointer' }}>NTES app</span> for actual time before boarding
      </div>

      {/* 5. Bottom Action Bar: Book Now | OTHER DATES | Updated Timer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '10px',
          borderTop: '1px solid #f1f5f9'
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Orange Book Now Button */}
          <button
            type="button"
            onClick={() => {
              if (onSelectBooking && primaryClass) {
                onSelectBooking(train, primaryClass, dateOfJourney);
              }
            }}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              background: '#fed7aa',
              color: '#ea580c',
              border: '1px solid #fdba74',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
          >
            Book Now
          </button>

          {/* OTHER DATES Button */}
          <button
            type="button"
            onClick={() => onViewRoute(train)}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              background: '#ffffff',
              color: '#0f172a',
              border: '1.5px solid #cbd5e1',
              fontWeight: 800,
              fontSize: '12.5px',
              cursor: 'pointer',
              letterSpacing: '0.3px',
              transition: 'background 0.15s ease'
            }}
          >
            OTHER DATES
          </button>
        </div>

        {/* Updated Timer info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#334155', fontWeight: 600 }}>
          <span>Updated 27 Minutes and 27 Seconds ago</span>
          <i className="fa-solid fa-rotate-right" style={{ cursor: 'pointer' }} title="Refresh live status"></i>
        </div>
      </div>

      {/* Inline Quotas & Availability Drawer below the card when selected */}
      {selectedClassOption && onSelectBooking && (
        <div style={{ marginTop: '16px' }}>
          <TrainInlineAvailability
            train={train}
            selectedClass={selectedClassOption}
            dateOfJourney={dateOfJourney}
            onSelectBooking={onSelectBooking}
          />
        </div>
      )}
    </div>
  );
}
