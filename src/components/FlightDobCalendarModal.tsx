import React, { useState } from 'react';
import { PassengerFormData } from './flightpassenger';

export interface FlightDobCalendarModalProps {
  activeDobPax: PassengerFormData | null;
  onClose: () => void;
  onSelectDob: (paxId: string, dobFormatted: string) => void;
}

export default function FlightDobCalendarModal({
  activeDobPax,
  onClose,
  onSelectDob
}: FlightDobCalendarModalProps) {
  if (!activeDobPax) return null;

  const curYear = new Date().getFullYear();
  const defaultYear =
    activeDobPax.type === 'senior'
      ? curYear - 65
      : activeDobPax.type === 'child'
        ? curYear - 7
        : activeDobPax.type === 'infant'
          ? curYear - 1
          : curYear - 25;

  let initDay = 15;
  let initMonth = 0;
  let initYear = defaultYear;

  if (activeDobPax.dob && (activeDobPax.dob.includes('-') || activeDobPax.dob.includes('/'))) {
    const sep = activeDobPax.dob.includes('-') ? '-' : '/';
    const parts = activeDobPax.dob.split(sep);
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      if (!isNaN(d) && !isNaN(m) && !isNaN(y) && y >= 1920) {
        initDay = d;
        initMonth = Math.max(0, Math.min(11, m));
        initYear = y;
      }
    }
  }

  const [calDay, setCalDay] = useState<number>(initDay);
  const [calMonth, setCalMonth] = useState<number>(initMonth);
  const [calYear, setCalYear] = useState<number>(initYear);

  return (
    <div
      className="fp-dob-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="fp-dob-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '20px 22px',
          maxWidth: '350px',
          width: '100%',
          boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-calendar-days" style={{ color: '#0084ff', fontSize: '16px' }}></i>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
              Select Date of Birth
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '4px',
              lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>

        {/* Passenger Label */}
        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>
          Passenger: <strong style={{ color: '#002970' }}>{activeDobPax.typeLabel} ({activeDobPax.firstName || 'Traveler'})</strong>
        </div>

        {/* Month & Year Selectors with Arrows */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '12px' }}>
          <button
            type="button"
            onClick={() => {
              if (calMonth === 0) {
                setCalMonth(11);
                setCalYear((y) => Math.max(1920, y - 1));
              } else {
                setCalMonth((m) => m - 1);
              }
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155'
            }}
            title="Previous Month"
          >
            ‹
          </button>

          <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
            {/* Month Dropdown */}
            <select
              value={calMonth}
              onChange={(e) => setCalMonth(parseInt(e.target.value, 10))}
              style={{
                flex: 1.2,
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#0f172a',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ].map((mName, mIdx) => (
                <option key={mIdx} value={mIdx}>
                  {mName}
                </option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              value={calYear}
              onChange={(e) => setCalYear(parseInt(e.target.value, 10))}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#0f172a',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              {Array.from({ length: new Date().getFullYear() - 1920 + 1 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              if (calMonth === 11) {
                setCalMonth(0);
                setCalYear((y) => Math.min(new Date().getFullYear(), y + 1));
              } else {
                setCalMonth((m) => m + 1);
              }
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155'
            }}
            title="Next Month"
          >
            ›
          </button>
        </div>

        {/* Days of Week Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '2px', marginBottom: '6px', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} style={{ padding: '2px 0' }}>{d}</div>
          ))}
        </div>

        {/* Calendar Days Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', textAlign: 'center', marginBottom: '14px' }}>
          {Array.from({ length: new Date(calYear, calMonth, 1).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} style={{ height: '32px' }} />
          ))}

          {Array.from({ length: new Date(calYear, calMonth + 1, 0).getDate() }).map((_, i) => {
            const dayNum = i + 1;
            const isSelected = calDay === dayNum;
            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => setCalDay(dayNum)}
                style={{
                  height: '32px',
                  width: '32px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  border: isSelected ? '2px solid #002970' : 'none',
                  background: isSelected ? '#0084ff' : 'transparent',
                  color: isSelected ? '#ffffff' : '#0f172a',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.1s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                {dayNum}
              </button>
            );
          })}
        </div>

        {/* Selected Date Summary & OK / Cancel Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9'
        }}>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 700 }}>
              Selected DOB
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#002970' }}>
              {String(calDay).padStart(2, '0')}-{String(calMonth + 1).padStart(2, '0')}-{calYear}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#475569',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                const formatted = `${String(calDay).padStart(2, '0')}-${String(calMonth + 1).padStart(2, '0')}-${calYear}`;
                onSelectDob(activeDobPax.id, formatted);
              }}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: '#002970',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 41, 112, 0.3)'
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
