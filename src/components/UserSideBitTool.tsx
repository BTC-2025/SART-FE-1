'use client';

import React, { useState } from 'react';
import './UserSideBitTool.css';
import { useSartStore } from '../store/useSartStore';

interface UserSideBitToolProps {
  isOpen?: boolean;
  onActivePanelChange?: (panel: string | null) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function UserSideBitTool({
  isOpen = false,
  onActivePanelChange = () => {}
}: UserSideBitToolProps) {
  const { setActiveTab } = useSartStore();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const toggleModal = (modalKey: string) => {
    setActiveModal(prev => {
      const next = prev === modalKey ? null : modalKey;
      onActivePanelChange(next);
      return next;
    });
  };

  const closeModal = () => {
    setActiveModal(null);
    onActivePanelChange(null);
  };

  // Dynamic Calendar state
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 10, 3)); // Nov 3, 2026
  const [selectedDay, setSelectedDay] = useState(3);

  const currentYear = currentDate.getFullYear();
  const currentMonthIdx = currentDate.getMonth();
  const currentMonthName = MONTH_NAMES[currentMonthIdx];

  // Calculate days in month & starting weekday
  const daysInMonth = new Date(currentYear, currentMonthIdx + 1, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonthIdx, 1).getDay(); // 0 (Sun) to 6 (Sat)

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(1);
  };

  // Calculator states
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcFormula, setCalcFormula] = useState('');

  // Notes state
  const [notesList, setNotesList] = useState<string[]>([
    'Remember to verify car rental fuel receipt',
    'Drop luggage at airport depot bay 4'
  ]);
  const [noteInput, setNoteInput] = useState('');

  // Contacts state
  const [contactsList] = useState([
    { name: 'Ramesh Pilot (Bike Captain)', role: 'Rapid Express Pilot', phone: '+91 98401 23456', initial: 'R' },
    { name: 'Tata Steel Container Depo', role: 'Freight & Carrier Hub', phone: '+91 94440 98765', initial: 'T' },
    { name: 'SART 24/7 Roadside Assistance', role: 'Emergency Helpline', phone: '1800-425-7278', initial: 'S' }
  ]);

  if (!isOpen) return null;

  const handleCalcClick = (val: string) => {
    if (val === 'C' || val === 'AC') {
      setCalcDisplay('0');
      setCalcFormula('');
    } else if (val === 'backspace') {
      if (calcDisplay.length <= 1) setCalcDisplay('0');
      else setCalcDisplay(calcDisplay.slice(0, -1));
    } else if (val === '=') {
      try {
        const sanitized = calcDisplay.replace(/x/g, '*').replace(/÷/g, '/');
        if (/^[0-9+\-*/. ()]+$/.test(sanitized)) {
          const res = Function(`'use strict'; return (${sanitized})`)();
          setCalcDisplay(String(res));
          setCalcFormula(calcDisplay + ' =');
        }
      } catch (e) {
        setCalcDisplay('Error');
      }
    } else {
      if (calcDisplay === '0' && !['+', '-', '*', '/', '.', 'x', '÷'].includes(val)) {
        setCalcDisplay(val);
      } else {
        setCalcDisplay(prev => prev + val);
      }
    }
  };

  const handleAddNote = () => {
    if (noteInput.trim()) {
      setNotesList(prev => [noteInput.trim(), ...prev]);
      setNoteInput('');
    }
  };

  return (
    <>
      {/* 1. Vertical Bit-Tool Strip on the right starting at top: 64px beside subnavbar */}
      <aside className="user-side-bittool-strip" aria-label="SART Side Utilities">
        {/* 1. Blue B Button (Starts beside the sub-navbar) */}
        <button
          type="button"
          className={`user-bittool-pill-btn brand-b ${activeModal === 'portal' ? 'active-tool' : ''}`}
          title="SART Portal & Captain Hub"
          onClick={() => toggleModal('portal')}
        >
          <span style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: '20px', color: '#0056b3' }}>B</span>
        </button>

        {/* Small Divider */}
        <div className="user-bittool-divider"></div>

        {/* 2. Yellow Calendar */}
        <button
          type="button"
          className={`user-bittool-pill-btn calendar ${activeModal === 'calendar' ? 'active-tool' : ''}`}
          title="SART Schedule & Calendar"
          onClick={() => toggleModal('calendar')}
        >
          <i className="fa-regular fa-calendar-days"></i>
        </button>

        {/* 3. Mint Calculator */}
        <button
          type="button"
          className={`user-bittool-pill-btn calculator ${activeModal === 'calculator' ? 'active-tool' : ''}`}
          title="Fare & Distance Calculator"
          onClick={() => toggleModal('calculator')}
        >
          <i className="fa-solid fa-calculator"></i>
        </button>

        {/* 4. Soft Blue Contacts ID */}
        <button
          type="button"
          className={`user-bittool-pill-btn contact-id ${activeModal === 'contacts' ? 'active-tool' : ''}`}
          title="Saved Pilots & Contacts"
          onClick={() => toggleModal('contacts')}
        >
          <i className="fa-regular fa-id-badge"></i>
        </button>

        {/* 5. Pink Notes */}
        <button
          type="button"
          className={`user-bittool-pill-btn doc-note ${activeModal === 'notes' ? 'active-tool' : ''}`}
          title="Trip Notes & Documents"
          onClick={() => toggleModal('notes')}
        >
          <i className="fa-regular fa-file"></i>
        </button>

        {/* 6. Dashed Add Button */}
        <button
          type="button"
          className={`user-bittool-pill-btn add-more ${activeModal === 'shortcuts' ? 'active-tool' : ''}`}
          title="Quick Booking Shortcuts"
          onClick={() => toggleModal('shortcuts')}
        >
          <i className="fa-solid fa-plus"></i>
        </button>

        {/* Spacer to push edit/settings to bottom */}
        <div style={{ flex: 1 }}></div>

        {/* Bottom Tool: Quick Edit Notes */}
        <button
          type="button"
          className={`user-bittool-pill-btn bottom-tool ${activeModal === 'notes' ? 'active-tool' : ''}`}
          title="Quick Memo"
          onClick={() => toggleModal('notes')}
        >
          <i className="fa-regular fa-pen-to-square"></i>
        </button>

        {/* Bottom Tool: Settings / Sliders */}
        <button
          type="button"
          className={`user-bittool-pill-btn bottom-tool ${activeModal === 'settings' ? 'active-tool' : ''}`}
          title="User Preferences & Portal Controls"
          onClick={() => toggleModal('settings')}
        >
          <i className="fa-solid fa-sliders"></i>
        </button>
      </aside>

      {/* 2. Interactive Sliding Panels */}

      {/* PANEL 1: FULLY INTERACTIVE DYNAMIC CALENDAR */}
      {activeModal === 'calendar' && (
        <div className="user-side-dock-panel">
          <div className="user-dock-header">
            <span className="user-dock-title">TRIP SCHEDULE & CALENDAR</span>
            <button className="user-dock-close-btn" onClick={closeModal} title="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="user-dock-inner">
            {/* Month & Year Navigation */}
            <div className="user-cal-nav">
              <button type="button" className="user-cal-arrow" onClick={handlePrevMonth} title="Previous Month">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                {currentMonthName} {currentYear}
              </h4>
              <button type="button" className="user-cal-arrow" onClick={handleNextMonth} title="Next Month">
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            {/* Calendar Days Matrix */}
            <div className="user-cal-grid">
              <span className="user-cal-wk">Su</span>
              <span className="user-cal-wk">Mo</span>
              <span className="user-cal-wk">Tu</span>
              <span className="user-cal-wk">We</span>
              <span className="user-cal-wk">Th</span>
              <span className="user-cal-wk">Fr</span>
              <span className="user-cal-wk">Sa</span>

              {/* Empty padding slots before the 1st of month */}
              {Array.from({ length: firstDayWeekday }).map((_, idx) => (
                <div key={`empty-${idx}`} className="user-cal-cell empty" style={{ opacity: 0 }}></div>
              ))}

              {/* Day cells for the active month */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                <div
                  key={day}
                  className={`user-cal-cell ${selectedDay === day ? 'active-day' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Dynamic Schedule Preview for Selected Date */}
            <div style={{ marginTop: '14px', padding: '14px', background: '#f8fafc', borderRadius: '12px', borderLeft: '3px solid #2563eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                  Schedule for {selectedDay} {currentMonthName} {currentYear}
                </strong>
                <span style={{ fontSize: '11px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  Active Day
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>
                {selectedDay === 3
                  ? 'Ride Confirmed: Chennai Central ➔ Airport T2 • 02:30 PM (Toyota Innova Crysta)'
                  : `No bookings scheduled for ${selectedDay} ${currentMonthName}. Click below to plan a trip.`}
              </span>
              <button
                type="button"
                style={{ marginTop: '10px', background: '#2563eb', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => { closeModal(); setActiveTab('ride'); }}
              >
                + Book Ride for This Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PANEL 2: CALCULATOR */}
      {activeModal === 'calculator' && (
        <div className="user-side-dock-panel">
          <div className="user-dock-header">
            <span className="user-dock-title">FARE & EXPENSE CALCULATOR</span>
            <button className="user-dock-close-btn" onClick={closeModal} title="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="user-dock-inner">
            <div className="user-calc-screen">
              <div className="user-calc-formula">{calcFormula}</div>
              <div className="user-calc-display">{calcDisplay}</div>
            </div>
            <div className="user-calc-pad">
              <button className="user-calc-key clear" onClick={() => handleCalcClick('AC')}>AC</button>
              <button className="user-calc-key" onClick={() => handleCalcClick('backspace')}>⌫</button>
              <button className="user-calc-key op" onClick={() => handleCalcClick('%')}>%</button>
              <button className="user-calc-key op" onClick={() => handleCalcClick('÷')}>÷</button>

              <button className="user-calc-key" onClick={() => handleCalcClick('7')}>7</button>
              <button className="user-calc-key" onClick={() => handleCalcClick('8')}>8</button>
              <button className="user-calc-key" onClick={() => handleCalcClick('9')}>9</button>
              <button className="user-calc-key op" onClick={() => handleCalcClick('x')}>×</button>

              <button className="user-calc-key" onClick={() => handleCalcClick('4')}>4</button>
              <button className="user-calc-key" onClick={() => handleCalcClick('5')}>5</button>
              <button className="user-calc-key" onClick={() => handleCalcClick('6')}>6</button>
              <button className="user-calc-key op" onClick={() => handleCalcClick('-')}>−</button>

              <button className="user-calc-key" onClick={() => handleCalcClick('1')}>1</button>
              <button className="user-calc-key" onClick={() => handleCalcClick('2')}>2</button>
              <button className="user-calc-key" onClick={() => handleCalcClick('3')}>3</button>
              <button className="user-calc-key op" onClick={() => handleCalcClick('+')}>+</button>

              <button className="user-calc-key" onClick={() => handleCalcClick('0')}>0</button>
              <button className="user-calc-key" onClick={() => handleCalcClick('.')}>.</button>
              <button className="user-calc-key equal" style={{ gridColumn: 'span 2' }} onClick={() => handleCalcClick('=')}>=</button>
            </div>
          </div>
        </div>
      )}

      {/* PANEL 3: CONTACTS */}
      {activeModal === 'contacts' && (
        <div className="user-side-dock-panel">
          <div className="user-dock-header">
            <span className="user-dock-title">SAVED CAPTAINS & FLEET HUBS</span>
            <button className="user-dock-close-btn" onClick={closeModal} title="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="user-dock-inner">
            <div className="user-contacts-grid">
              {contactsList.map((c, i) => (
                <div key={i} className="user-contact-tile">
                  <div className="user-contact-avatar">{c.initial}</div>
                  <div>
                    <div className="user-contact-name">{c.name}</div>
                    <div className="user-contact-role">{c.role}</div>
                    <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>{c.phone}</div>
                  </div>
                  <button className="user-contact-call-btn" onClick={() => window.open(`tel:${c.phone}`)}>Call</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PANEL 4: NOTES */}
      {activeModal === 'notes' && (
        <div className="user-side-dock-panel">
          <div className="user-dock-header">
            <span className="user-dock-title">TRIP NOTES & MEMOS</span>
            <button className="user-dock-close-btn" onClick={closeModal} title="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="user-dock-inner">
            <div className="user-note-input-row">
              <input
                type="text"
                className="user-note-input"
                placeholder="Write a new note or memo..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(); }}
              />
              <button className="user-note-add-btn" onClick={handleAddNote}>Add</button>
            </div>
            <div className="user-notes-list">
              {notesList.map((n, i) => (
                <div key={i} className="user-note-card">
                  <span style={{ fontSize: '13px', color: '#1e293b' }}>{n}</span>
                  <button
                    className="user-note-delete-btn"
                    onClick={() => setNotesList(prev => prev.filter((_, idx) => idx !== i))}
                    title="Delete"
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      
    </>
  );
}
