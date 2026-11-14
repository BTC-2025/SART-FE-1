'use client';

import React from 'react';
import { TrainItem, TrainClassOption } from '../trainData';
import TrainInlineAvailability from './TrainInlineAvailability';

interface TrainCardProps {
  train: TrainItem;
  onViewRoute: (train: TrainItem) => void;
  onSelectClass: (train: TrainItem, cls: TrainClassOption) => void;
  selectedClassOption?: TrainClassOption | null;
  dateOfJourney?: string;
  onSelectBooking?: (train: TrainItem, cls: TrainClassOption, date: string) => void;
}

export default function TrainCard({
  train,
  onViewRoute,
  onSelectClass,
  selectedClassOption,
  dateOfJourney = '15 Nov, 2026',
  onSelectBooking
}: TrainCardProps) {
  return (
    <div className="tb-train-card">
      {/* Top Header: Train Number, Name, Rating Pill, Running Days, Schedule link */}
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
          <div className="tb-running-days">{train.runningDays}</div>
          <button className="tb-schedule-link-btn" onClick={() => onViewRoute(train)}>
            <i className="fa-solid fa-utensils"></i> Schedule
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

