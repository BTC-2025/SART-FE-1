'use client';

import React from 'react';
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
  dateOfJourney = '15 Nov, 2026',
  onSelectBooking
}: TrainCardProps) {
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
    if (isDaily) return true;
    if (train.number === '22502' || train.name.includes('NTSK')) {
      return index === 4; // Only Friday
    }
    const cleanTokens = runningDaysStr.split(/\s+/);
    if (cleanTokens.length === 7) {
      return cleanTokens[index] !== '-';
    }
    return true;
  };

  return (
    <div className="tb-train-card">
      {/* Top Header: Train Number, Name, Rating Pill, Runs On Days, Schedule link */}
      <div className="tb-card-top-row">
        <div className="tb-train-title-area">
          <span className="tb-train-number-link" onClick={() => onViewRoute(train)}>
            {train.number}
          </span>
          <span className="tb-train-name">{train.name}</span>

          {train.rating && (
            <div className="tb-rating-badge">
              <i className="fa-solid fa-star"></i> {train.rating.toFixed(1)}
            </div>
          )}

          {train.fastest && (
            <span className="tb-fastest-pill">
              <i className="fa-solid fa-bolt"></i> Fastest
            </span>
          )}
        </div>

        <div className="tb-top-right-meta">
          {/* Runs On: M T W T F S S with active days dark and inactive days light grey */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Runs On:</span>
            <div style={{ display: 'flex', gap: '5px' }}>
              {DAYS_INITIALS.map((d) => {
                const isRunning = checkRunsOnDay(d.index);
                return (
                  <span
                    key={d.index}
                    title={`${d.name}: ${isRunning ? 'Runs' : 'Does not run'}`}
                    style={{
                      fontSize: '12px',
                      fontWeight: isRunning ? 800 : 500,
                      color: isRunning ? '#1e293b' : '#cbd5e1',
                      userSelect: 'none'
                    }}
                  >
                    {d.label}
                  </span>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="tb-schedule-link-btn"
            onClick={() => {
              if (onViewSchedule) onViewSchedule(train);
              else onViewRoute(train);
            }}
            style={{
              color: '#0284c7',
              background: 'none',
              border: 'none',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Train Schedule
          </button>
        </div>
      </div>

      {/* Schedule Row */}
      <div className="tb-schedule-row">
        {/* Departure */}
        <div className="tb-station-point">
          <span className="tb-time">{train.departureTime}</span>
          <span className="tb-station-name">{train.departureStation}</span>
          {train.departureTags && train.departureTags.length > 0 ? (
            <div className="tb-station-tags-row">
              {train.departureTags.map((tag, tIdx) => (
                <span key={tIdx} className="tb-station-tag">{tag}</span>
              ))}
            </div>
          ) : train.departureTag ? (
            <span className="tb-station-tag">{train.departureTag}</span>
          ) : null}
        </div>

        {/* Duration */}
        <div className="tb-duration-middle">
          <span>— {train.duration} —</span>
        </div>

        {/* Arrival */}
        <div className="tb-station-point">
          <span className="tb-time">{train.arrivalTime}</span>
          <span className="tb-station-name">{train.arrivalStation}</span>
          {train.arrivalTag && <span className="tb-station-tag">{train.arrivalTag}</span>}
        </div>

        {/* View Route Button */}
        <button className="tb-view-route-btn" onClick={() => onViewRoute(train)}>
          <i className="fa-solid fa-map-location-dot"></i> View Route
        </button>
      </div>

      {/* Banner / redRail Confirm Notice if present */}
      {train.bannerTag && (
        <div className="tb-card-confirm-banner">
          <span className="tb-confirm-tag">redRail Confirm</span>
          <span className="tb-confirm-msg">{train.bannerTag}</span>
        </div>
      )}

      {/* Classes Scrollable Row */}
      <div className="tb-classes-container">
        <div className="tb-classes-scrollable-row">
          {train.classes.map((cls, idx) => {
            const isAvail = cls.statusType === 'available';
            const isWl = cls.statusType === 'wl';
            const isRegret = cls.statusType === 'regret';
            const isSelected = selectedClassOption?.code === cls.code && selectedClassOption?.isTatkal === cls.isTatkal;

            return (
              <div
                key={`${cls.code}-${idx}`}
                className={`tb-class-card-wrapper ${isSelected ? 'tb-class-selected' : ''}`}
                onClick={() => onSelectClass(train, cls)}
              >
                {cls.isTatkal && <div className="tb-tatkal-badge">Tatkal</div>}

                <div className={`tb-class-card ${isWl ? 'tb-class-card-wl' : isRegret ? 'tb-class-card-regret' : ''} ${isSelected ? 'selected' : ''}`}>
                  <div className={`tb-class-header ${isWl ? 'tb-header-wl' : isRegret ? 'tb-header-regret' : 'tb-header-avail'}`}>
                    <span className="tb-class-code">{cls.code}</span>
                    <span className="tb-class-fare">₹{cls.fare.toLocaleString('en-IN')}</span>
                  </div>

                  <div className={`tb-class-status-box ${isAvail ? 'tb-status-available' : isWl ? 'tb-status-wl' : 'tb-status-regret'}`}>
                    <span className="tb-status-main">{cls.status}</span>
                    {cls.chance && (
                      <span className={`tb-status-sub ${cls.chanceColor || ''}`}>
                        {cls.chance}
                      </span>
                    )}
                    {cls.subtext && !cls.chance && (
                      <span className="tb-status-sub">{cls.subtext}</span>
                    )}
                  </div>
                </div>

                <span className="tb-updated-time">{cls.updated}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inline Quotas & Availability Drawer below the card (Images 1, 3, 4, 5, 6) */}
      {selectedClassOption && onSelectBooking && (
        <TrainInlineAvailability
          train={train}
          selectedClass={selectedClassOption}
          dateOfJourney={dateOfJourney}
          onSelectBooking={onSelectBooking}
        />
      )}
    </div>
  );
}

