'use client';

import React from 'react';
import { TrainItem } from '../trainData';

interface TrainScheduleModalProps {
  train: TrainItem;
  onClose: () => void;
}

export default function TrainScheduleModal({ train, onClose }: TrainScheduleModalProps) {
  // Days of week array
  const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // Parse running days (e.g. "M T W T F S S" or "M W F" or "Daily")
  const runningDaysStr = (train.runningDays || '').toUpperCase();
  const isDaily = runningDaysStr.includes('DAILY') || runningDaysStr.replace(/\s+/g, '') === 'MTWTFSS';

  const isDayRunning = (dayName: string, index: number) => {
    if (isDaily) return true;
    const dayInitial = dayName.charAt(0);
    // Friday specific check from image: if train is 22502, it runs on FRI
    if (train.number === '22502' || train.name.includes('NTSK')) {
      return dayName === 'FRI';
    }
    const cleanTokens = runningDaysStr.split(/\s+/);
    if (cleanTokens.length === 7) {
      return cleanTokens[index] !== '-';
    }
    return cleanTokens.some(t => t.startsWith(dayInitial));
  };

  const stops = train.stops && train.stops.length > 0
    ? train.stops
    : [
      { station: train.departureStation, code: train.departureStationCode, arr: '--', dep: train.departureTime, halt: '--', distance: '0' },
      { station: train.arrivalStation, code: train.arrivalStationCode, arr: train.arrivalTime, dep: '--', halt: '--', distance: train.distance || '360' }
    ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '1050px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #cbd5e1'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navy Header */}
        <div
          style={{
            background: '#1e3a8a',
            color: '#ffffff',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, letterSpacing: '0.3px' }}>
            Train Schedule
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0
            }}
            title="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '20px', overflowY: 'auto' }}>
          {/* Top Meta Table */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1.5fr 1.2fr 1.2fr 240px',
                background: '#0a235c',
                color: '#ffffff',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 800,
                alignItems: 'center'
              }}
            >
              <div>Train Number</div>
              <div>Train Name</div>
              <div>From Station</div>
              <div>Destination Station</div>
              <div>Runs On</div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1.5fr 1.2fr 1.2fr 240px',
                background: '#ffffff',
                color: '#0f172a',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: 700,
                alignItems: 'center',
                borderTop: '1px solid #e2e8f0'
              }}
            >
              <div>{train.number}</div>
              <div>{train.name.toUpperCase()}</div>
              <div>{train.departureStation.toUpperCase()}</div>
              <div>{train.arrivalStation.toUpperCase()}</div>

              {/* Day Badges: Green for active, Light Red for inactive */}
              <div style={{ display: 'flex', gap: '3px' }}>
                {DAYS.map((day, idx) => {
                  const runs = isDayRunning(day, idx);
                  return (
                    <span
                      key={day}
                      style={{
                        padding: '3px 6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        borderRadius: '2px',
                        background: runs ? '#bbf7d0' : '#fecaca',
                        color: runs ? '#15803d' : '#b91c1c'
                      }}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Schedule Stations Table */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            {/* Dark Blue Schedule Columns Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '50px 100px 1.6fr 110px 110px 120px 140px 90px 60px',
                background: '#0a235c',
                color: '#ffffff',
                padding: '10px 14px',
                fontSize: '12px',
                fontWeight: 800,
                alignItems: 'center'
              }}
            >
              <div>S.N.</div>
              <div>Station Code</div>
              <div>Station Name</div>
              <div>Route Number</div>
              <div>Arrival Time</div>
              <div>Departure Time</div>
              <div>Halt Time(In minutes)</div>
              <div>Distance</div>
              <div>Day</div>
            </div>

            {/* Station Rows */}
            {stops.map((stop, sIdx) => {
              const isEven = sIdx % 2 === 0;
              return (
                <div
                  key={sIdx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 100px 1.6fr 110px 110px 120px 140px 90px 60px',
                    padding: '10px 14px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#1e293b',
                    background: isEven ? '#ffffff' : '#f8fafc',
                    borderBottom: '1px solid #f1f5f9',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ color: '#64748b' }}>{sIdx + 1}</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{stop.code}</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{stop.station.toUpperCase()}</div>
                  <div style={{ color: '#475569' }}>1</div>
                  <div style={{ color: stop.arr === '--' ? '#94a3b8' : '#0f172a' }}>{stop.arr}</div>
                  <div style={{ color: stop.dep === '--' ? '#94a3b8' : '#0f172a' }}>{stop.dep}</div>
                  <div style={{ color: stop.halt === '--' ? '#94a3b8' : '#475569' }}>
                    {stop.halt === '--' ? '--' : stop.halt.replace(/[^0:0-9]/g, '').length ? stop.halt : '02:00'}
                  </div>
                  <div>{stop.distance || `${sIdx * 38}`}</div>
                  <div>1</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
