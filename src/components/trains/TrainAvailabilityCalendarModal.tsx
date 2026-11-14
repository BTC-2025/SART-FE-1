'use client';

import React, { useState } from 'react';
import { TrainItem, TrainClassOption } from '../trainData';

interface TrainAvailabilityCalendarModalProps {
  train: TrainItem;
  selectedClass: TrainClassOption;
  dateOfJourney: string;
  onSelectBooking: (train: TrainItem, cls: TrainClassOption, date: string) => void;
  onClose: () => void;
}

export default function TrainAvailabilityCalendarModal({
  train,
  selectedClass,
  dateOfJourney,
  onSelectBooking,
  onClose
}: TrainAvailabilityCalendarModalProps) {
  const [activeQuota, setActiveQuota] = useState<'General' | 'Tatkal' | 'Senior Citizen' | 'Ladies'>('General');

  // Generate availability rows for consecutive days
  const sampleDates = [
    { date: '15 Nov', day: 'Sun', status: 'AVL 396', statusType: 'available', subtext: 'Available', fare: selectedClass.fare },
    { date: '16 Nov', day: 'Mon', status: 'WL 41', statusType: 'wl', subtext: 'Low Chance', fare: selectedClass.fare },
    { date: '17 Nov', day: 'Tue', status: 'WL 32', statusType: 'wl', subtext: 'Low Chance', fare: selectedClass.fare },
    { date: '18 Nov', day: 'Wed', status: 'WL 18', statusType: 'wl', subtext: '55% Chance', fare: selectedClass.fare },
    { date: '19 Nov', day: 'Thu', status: 'AVL 45', statusType: 'available', subtext: 'Available', fare: selectedClass.fare },
    { date: '20 Nov', day: 'Fri', status: 'WL 60', statusType: 'wl', subtext: '50% Chance', fare: selectedClass.fare }
  ];

  return (
    <div className="tb-cal-modal-backdrop" onClick={onClose}>
      <div className="tb-cal-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="tb-cal-modal-header">
          <div>
            <div className="tb-cal-train-meta">
              <span className="tb-cal-train-number">{train.number}</span>
              <span className="tb-cal-train-name">{train.name}</span>
              <span className="tb-cal-class-badge">{selectedClass.code}</span>
            </div>
            <div className="tb-cal-route-sub">
              {train.departureStation} → {train.arrivalStation} • Dep {train.departureTime}
            </div>
          </div>
          <button className="tb-cal-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Quota Tabs */}
        <div className="tb-cal-quota-tabs">
          {(['General', 'Tatkal', 'Senior Citizen', 'Ladies'] as const).map(q => (
            <button
              key={q}
              className={`tb-cal-quota-tab ${activeQuota === q ? 'active' : ''}`}
              onClick={() => setActiveQuota(q)}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Date Rows Table */}
        <div className="tb-cal-dates-list">
          {sampleDates.map((item, idx) => (
            <div key={idx} className="tb-cal-date-row">
              <div className="tb-cal-date-left">
                <span className="tb-cal-date-str">{item.date}</span>
                <span className="tb-cal-day-str">{item.day}</span>
              </div>

              <div className="tb-cal-status-mid">
                <span className={`tb-cal-status-pill ${item.statusType === 'available' ? 'avail' : 'wl'}`}>
                  {item.status}
                </span>
                <span className="tb-cal-subtext">{item.subtext}</span>
              </div>

              <div className="tb-cal-action-right">
                <button
                  className="tb-cal-book-btn"
                  onClick={() => onSelectBooking(train, selectedClass, `${item.date}, 2026`)}
                >
                  <span className="tb-cal-book-text">Book</span>
                  <span className="tb-cal-book-fare">₹{item.fare}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Links matching Image 3 */}
        <div className="tb-cal-modal-footer">
          <button className="tb-cal-footer-link">
            <i className="fa-solid fa-chart-line"></i> Check W/L Trends
          </button>
          <span className="tb-cal-footer-sep">|</span>
          <button className="tb-cal-footer-link">
            <i className="fa-regular fa-calendar-days"></i> Check 2 Months Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

