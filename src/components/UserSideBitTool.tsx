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
  onActivePanelChange = () => { }
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
      {/* 1. Vertical Bit-Tool Strip matching BNX Mail Inbox (Image 2 DevTools & Image 3) */}
      <aside className="right-tools-sidebar relative w-[60px] flex flex-col items-center pb-4 h-full justify-between select-none shrink-0 user-side-bittool-strip bnx-style" aria-label="SART Side Utilities">
        <div className="flex-1 overflow-y-auto hidden-scrollbar px-3 py-2 flex flex-col justify-between">
          <div className="flex flex-col items-center gap-3 w-full">
            {/* Top Floating Curve Pill Header with Brand B (Exact Image 1 Logo) */}
            <button
              type="button"
              className={`bnx-tool-btn bnx-brand-b ${activeModal === 'portal' ? 'active-tool' : ''}`}
              title="SART Portal & Captain Hub"
              onClick={() => toggleModal('portal')}
            >
              <img
                src="/images/bnx_brand_b.png"
                alt="BNX Brand"
                className="bnx-b-logo-img"
              />
            </button>

            {/* Thin Divider */}
            <div className="bnx-divider"></div>

            {/* 1. Yellow Calendar Icon (Orange Outline on Soft Warm Yellow Pill) */}
            <button
              type="button"
              className={`bnx-tool-btn bnx-calendar ${activeModal === 'calendar' ? 'active-tool' : ''}`}
              title="SART Schedule & Calendar"
              onClick={() => toggleModal('calendar')}
            >
              <svg className="w-6 h-6 object-contain" viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="4" ry="4"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </button>

            {/* 2. Mint Green Calculator Icon */}
            <button
              type="button"
              className={`bnx-tool-btn bnx-calculator ${activeModal === 'calculator' ? 'active-tool' : ''}`}
              title="Fare & Distance Calculator"
              onClick={() => toggleModal('calculator')}
            >
              <svg className="w-6 h-6 object-contain" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="5" fill="#10b981"></rect>
                <line x1="6.5" y1="8" x2="10.5" y2="8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></line>
                <line x1="8.5" y1="6" x2="8.5" y2="10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></line>
                <line x1="13.5" y1="8" x2="17.5" y2="8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></line>
                <line x1="13.5" y1="14" x2="17.5" y2="14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></line>
                <line x1="13.5" y1="17" x2="17.5" y2="17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></line>
                <line x1="6.5" y1="14" x2="10.5" y2="17" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"></line>
                <line x1="10.5" y1="14" x2="6.5" y2="17" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"></line>
              </svg>
            </button>

            {/* 3. Soft Blue People / Community Icon */}
            <button
              type="button"
              className={`bnx-tool-btn bnx-people ${activeModal === 'contacts' ? 'active-tool' : ''}`}
              title="Saved Pilots & Contacts"
              onClick={() => toggleModal('contacts')}
            >
              <svg className="w-6 h-6 object-contain" viewBox="0 0 24 24" fill="#2563eb">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path>
              </svg>
            </button>

            {/* 4. Warm Yellow Note / Clipboard with Pen Icon */}
            <button
              type="button"
              className={`bnx-tool-btn bnx-notes ${activeModal === 'notes' ? 'active-tool' : ''}`}
              title="Trip Notes & Documents"
              onClick={() => toggleModal('notes')}
            >
              <svg className="w-6 h-6 object-contain" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="17" rx="3" stroke="#d97706" strokeWidth="2.2"></rect>
                <path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1z" fill="#d97706"></path>
                <path d="M9.5 14.5l5-5 1.5 1.5-5 5H9.5v-1.5z" fill="#d97706"></path>
              </svg>
            </button>

            {/* 5. Lavender Purple Keyboard Icon */}
            <button
              type="button"
              className={`bnx-tool-btn bnx-keyboard ${activeModal === 'shortcuts' ? 'active-tool' : ''}`}
              title="Shortcuts & Tools"
              onClick={() => toggleModal('shortcuts')}
            >
              <svg className="w-6 h-6 object-contain" viewBox="0 0 24 24" fill="#6366f1">
                <rect x="2" y="5" width="20" height="14" rx="3" stroke="#6366f1" strokeWidth="1.5" fill="#6366f1"></rect>
                <rect x="4.5" y="8" width="2" height="2" rx="0.5" fill="#ffffff"></rect>
                <rect x="8" y="8" width="2" height="2" rx="0.5" fill="#ffffff"></rect>
                <rect x="11.5" y="8" width="2" height="2" rx="0.5" fill="#ffffff"></rect>
                <rect x="15" y="8" width="2" height="2" rx="0.5" fill="#ffffff"></rect>
                <rect x="18" y="8" width="1.5" height="2" rx="0.5" fill="#ffffff"></rect>
                <rect x="4.5" y="11.5" width="2.5" height="2" rx="0.5" fill="#ffffff"></rect>
                <rect x="8.5" y="11.5" width="2" height="2" rx="0.5" fill="#ffffff"></rect>
                <rect x="12" y="11.5" width="2" height="2" rx="0.5" fill="#ffffff"></rect>
                <rect x="15.5" y="11.5" width="4" height="2" rx="0.5" fill="#ffffff"></rect>
                <rect x="7" y="15" width="10" height="1.8" rx="0.8" fill="#ffffff"></rect>
              </svg>
            </button>

            {/* 6. Soft Cyan Cloud Storage Icon */}
            <button
              type="button"
              className={`bnx-tool-btn bnx-cloud ${activeModal === 'settings' ? 'active-tool' : ''}`}
              title="Cloud Backup & Storage"
              onClick={() => toggleModal('settings')}
            >
              <svg className="w-6 h-6 object-contain" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Interactive Sliding Panels */}

      {/* PANEL 1: FULLY INTERACTIVE DYNAMIC CALENDAR */}
      {activeModal === 'calendar' && (
        <div className="user-side-dock-panel">
          <div className="user-dock-header">
            <span className="user-dock-title">CALENDAR</span>
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
