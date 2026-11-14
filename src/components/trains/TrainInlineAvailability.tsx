'use client';

import React, { useState } from 'react';
import { TrainItem, TrainClassOption } from '../trainData';

interface TrainInlineAvailabilityProps {
  train: TrainItem;
  selectedClass: TrainClassOption;
  dateOfJourney: string;
  onSelectBooking: (train: TrainItem, cls: TrainClassOption, date: string) => void;
  onClose?: () => void;
}

export default function TrainInlineAvailability({
  train,
  selectedClass,
  dateOfJourney,
  onSelectBooking,
  onClose
}: TrainInlineAvailabilityProps) {
  const [activeQuota, setActiveQuota] = useState<'General' | 'Tatkal' | 'Senior Citizen' | 'Ladies'>('General');

  // Days list with realistic status variation based on quota and class
  const sampleDates = (() => {
    const isAvailClass = selectedClass.statusType === 'available';
    const baseFare = selectedClass.fare;

    if (activeQuota === 'Senior Citizen' || activeQuota === 'Ladies') {
      return [
        { date: '15 Nov', day: 'Sun', status: 'Not Available', statusType: 'not_available', subtext: '', fare: baseFare, canBook: false },
        { date: '16 Nov', day: 'Mon', status: 'Not Available', statusType: 'not_available', subtext: '', fare: baseFare, canBook: false, isNextDate: true },
        { date: '17 Nov', day: 'Tue', status: 'Not Available', statusType: 'not_available', subtext: '', fare: baseFare, canBook: false },
        { date: '18 Nov', day: 'Wed', status: 'Not Available', statusType: 'not_available', subtext: '', fare: baseFare, canBook: false }
      ];
    }

    if (activeQuota === 'Tatkal') {
      const tatkalFare = Math.round(baseFare * 1.25);
      return [
        { date: '15 Nov', day: 'Sun', status: 'AVL 120', statusType: 'available', subtext: 'Available', fare: tatkalFare, canBook: true },
        { date: '16 Nov', day: 'Mon', status: 'AVL 119', statusType: 'available', subtext: 'Available', fare: tatkalFare, canBook: true },
        { date: '17 Nov', day: 'Tue', status: 'WL 4', statusType: 'wl', subtext: '52% Chance', fare: tatkalFare, canBook: true },
        { date: '18 Nov', day: 'Wed', status: 'WL 1', statusType: 'wl', subtext: '55% Chance', fare: tatkalFare, canBook: true }
      ];
    }

    // General quota (Images 1, 3)
    return [
      { date: '15 Nov', day: 'Sun', status: isAvailClass ? selectedClass.status : 'WL 18', statusType: isAvailClass ? 'available' : 'wl', subtext: isAvailClass ? 'Available' : '39% Chance', fare: baseFare, canBook: true },
      { date: '16 Nov', day: 'Mon', status: 'WL 41', statusType: 'wl', subtext: 'Low Chance', fare: baseFare, canBook: true },
      { date: '17 Nov', day: 'Tue', status: 'WL 32', statusType: 'wl', subtext: 'Low Chance', fare: baseFare, canBook: true },
      { date: '18 Nov', day: 'Wed', status: 'WL 18', statusType: 'wl', subtext: '55% Chance', fare: baseFare, canBook: true }
    ];
  })();

  return (
    <div className="tb-inline-avail-container">
      {/* Top Quota Navigation Tabs (General, Tatkal, Senior Citizen, Ladies) */}
      <div className="tb-inline-quota-nav">
        {(['General', 'Tatkal', 'Senior Citizen', 'Ladies'] as const).map(q => {
          const isActive = activeQuota === q;
          return (
            <button
              key={q}
              type="button"
              className={`tb-inline-quota-btn ${isActive ? 'active' : ''} ${q === 'Senior Citizen' || q === 'Ladies' ? 'quota-green-style' : ''}`}
              onClick={() => setActiveQuota(q)}
            >
              {q}
            </button>
          );
        })}
      </div>

      {/* Date Rows Table */}
      <div className="tb-inline-dates-list">
        {sampleDates.map((item, idx) => {
          const isNotAvail = item.statusType === 'not_available';
          const isAvail = item.statusType === 'available';
          const isWL = item.statusType === 'wl';

          return (
            <React.Fragment key={idx}>
              {item.isNextDate && (
                <div className="tb-inline-next-dates-header">Next Dates</div>
              )}
              <div className="tb-inline-date-row">
                <div className="tb-inline-date-left">
                  <span className="tb-inline-date-str">{item.date}</span>
                  <span className="tb-inline-day-str">{item.day}</span>
                </div>

                <div className="tb-inline-status-mid">
                  <span className={`tb-inline-status-text ${isAvail ? 'status-avail' : isNotAvail ? 'status-notavail' : 'status-wl'}`}>
                    {item.status}
                  </span>
                  {item.subtext ? (
                    <span className="tb-inline-subtext">{item.subtext}</span>
                  ) : null}
                </div>

                <div className="tb-inline-action-right">
                  {item.canBook ? (
                    <button
                      type="button"
                      className="tb-inline-book-btn"
                      onClick={() => onSelectBooking(train, selectedClass, `${item.date}, 2026`)}
                    >
                      <span className="tb-inline-book-title">Book</span>
                      <span className="tb-inline-book-fare">₹{item.fare}</span>
                    </button>
                  ) : (
                    <button type="button" className="tb-inline-book-disabled" disabled>
                      <span className="tb-inline-book-title">Book</span>
                      <span className="tb-inline-book-fare">₹{item.fare}</span>
                    </button>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

