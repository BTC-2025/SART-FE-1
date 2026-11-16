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
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let baseDate = new Date();
    if (dateOfJourney) {
      const parts = dateOfJourney.replace(/,/g, '').split(' ');
      if (parts.length >= 3) {
        const d = parseInt(parts[0], 10);
        const m = months.findIndex((x) => x.toLowerCase() === parts[1].toLowerCase());
        const y = parseInt(parts[2], 10);
        if (!isNaN(d) && m !== -1 && !isNaN(y)) {
          baseDate = new Date(y, m, d);
        }
      } else {
        const parsed = new Date(dateOfJourney);
        if (!isNaN(parsed.getTime())) {
          baseDate = parsed;
        }
      }
    }

    const items = [];
    for (let i = 0; i < 4; i++) {
      const cur = new Date(baseDate);
      cur.setDate(cur.getDate() + i);
      const dateStr = `${cur.getDate()} ${months[cur.getMonth()]}`;
      const dayStr = daysShort[cur.getDay()];
      const fullDate = `${dateStr}, ${cur.getFullYear()}`;

      if (activeQuota === 'Senior Citizen' || activeQuota === 'Ladies') {
        items.push({
          date: dateStr,
          day: dayStr,
          fullDate,
          status: 'Not Available',
          statusType: 'not_available',
          subtext: '',
          fare: baseFare,
          canBook: false,
          isNextDate: i === 1
        });
      } else if (activeQuota === 'Tatkal') {
        const tatkalFare = Math.round(baseFare * 1.25);
        items.push({
          date: dateStr,
          day: dayStr,
          fullDate,
          status: i === 0 ? (isAvailClass ? selectedClass.status : 'AVL 120') : i === 1 ? 'AVL 119' : `WL ${i * 2}`,
          statusType: i < 2 ? 'available' : 'wl',
          subtext: i < 2 ? 'Available' : '52% Chance',
          fare: tatkalFare,
          canBook: true,
          isNextDate: i === 1
        });
      } else {
        // General quota
        items.push({
          date: dateStr,
          day: dayStr,
          fullDate,
          status: i === 0 ? (selectedClass.status || 'AVL 55') : i === 1 ? 'WL 41' : i === 2 ? 'WL 32' : 'WL 18',
          statusType: i === 0 ? (selectedClass.statusType || 'available') : 'wl',
          subtext: i === 0 ? (isAvailClass ? 'Available' : '39% Chance') : i === 1 ? 'Low Chance' : i === 2 ? 'Low Chance' : '55% Chance',
          fare: baseFare,
          canBook: true,
          isNextDate: i === 1
        });
      }
    }
    return items;
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
                      onClick={() => onSelectBooking(train, selectedClass, item.fullDate)}
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

