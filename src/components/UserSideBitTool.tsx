'use client';

import React, { useState } from 'react';
import './UserSideBitTool.css';
import { useSartStore } from '../store/useSartStore';

interface UserSideBitToolProps {
  isOpen?: boolean;
}

export default function UserSideBitTool({ isOpen = true }: UserSideBitToolProps) {
  const { setActiveTab } = useSartStore();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const toggleModal = (modalKey: string) => {
    setActiveModal(prev => (prev === modalKey ? null : modalKey));
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
      {/* 1. Vertical Bit-Tool Strip on the right matching Image 2 */}
      <aside className="user-side-bittool-strip" aria-label="SART Side Utilities">
        {/* 1. Blue B Button (SART Portal / Captain Hub Switcher) */}
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

      {/* PANEL 1: CALENDAR */}
      {activeModal === 'calendar' && (
        <div className="user-side-dock-panel">
          <div className="user-dock-header">
            <span className="user-dock-title">TRIP SCHEDULE & CALENDAR</span>
            <button className="user-dock-close-btn" onClick={() => setActiveModal(null)} title="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="user-dock-inner">
            <div className="user-cal-nav">
              <button className="user-cal-arrow"><i className="fa-solid fa-chevron-left"></i></button>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>November 2026</h4>
              <button className="user-cal-arrow"><i className="fa-solid fa-chevron-right"></i></button>
            </div>
            <div className="user-cal-grid">
              <span className="user-cal-wk">Su</span>
              <span className="user-cal-wk">Mo</span>
              <span className="user-cal-wk">Tu</span>
              <span className="user-cal-wk">We</span>
              <span className="user-cal-wk">Th</span>
              <span className="user-cal-wk">Fr</span>
              <span className="user-cal-wk">Sa</span>

              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(day => (
                <div key={day} className={`user-cal-cell ${day === 3 ? 'active-day' : ''}`}>
                  {day}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '14px', padding: '12px', background: '#f8fafc', borderRadius: '10px', borderLeft: '3px solid #2563eb' }}>
              <strong style={{ fontSize: '12.5px', color: '#0f172a', display: 'block' }}>Upcoming Ride • 03 Nov</strong>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>Chennai Central to Airport T2 • 02:30 PM</span>
            </div>
          </div>
        </div>
      )}

      {/* PANEL 2: CALCULATOR */}
      {activeModal === 'calculator' && (
        <div className="user-side-dock-panel">
          <div className="user-dock-header">
            <span className="user-dock-title">FARE & EXPENSE CALCULATOR</span>
            <button className="user-dock-close-btn" onClick={() => setActiveModal(null)} title="Close">
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
            <button className="user-dock-close-btn" onClick={() => setActiveModal(null)} title="Close">
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
            <button className="user-dock-close-btn" onClick={() => setActiveModal(null)} title="Close">
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

      {/* PANEL 5: PORTAL / CAPTAIN / QUICK SWITCH */}
      {(activeModal === 'portal' || activeModal === 'shortcuts' || activeModal === 'settings') && (
        <div className="user-side-dock-panel">
          <div className="user-dock-header">
            <span className="user-dock-title">
              {activeModal === 'portal' ? 'SART HUBS & CAPTAIN MODES' : 'QUICK SERVICE SWITCHER'}
            </span>
            <button className="user-dock-close-btn" onClick={() => setActiveModal(null)} title="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="user-dock-inner">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{ padding: '14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                onClick={() => { setActiveModal(null); window.open('http://localhost:3007', '_blank'); }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8', fontWeight: 900, fontFamily: 'serif' }}>
                  B
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0f172a', display: 'block' }}>SART Business & Partner Portal</strong>
                  <span style={{ fontSize: '11.5px', color: '#64748b' }}>Switch to Fleet, Carrier & Rental Management</span>
                </div>
                <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginLeft: 'auto', color: '#94a3b8' }}></i>
              </div>

              <div
                style={{ padding: '14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                onClick={() => { setActiveModal(null); window.location.href = '/ride/captain/login?category=bike'; }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', fontSize: '16px' }}>
                  <i className="fa-solid fa-helmet-safety"></i>
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0f172a', display: 'block' }}>Bike Captain Mode</strong>
                  <span style={{ fontSize: '11.5px', color: '#64748b' }}>On-Duty Bike Pilot Dispatch Console</span>
                </div>
              </div>

              <div
                style={{ padding: '14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                onClick={() => { setActiveModal(null); window.location.href = '/ride/captain/login?category=auto'; }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontSize: '16px' }}>
                  <i className="fa-solid fa-taxi"></i>
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0f172a', display: 'block' }}>Auto Captain Mode</strong>
                  <span style={{ fontSize: '11.5px', color: '#64748b' }}>Auto Rickshaw Meter & Trip radar</span>
                </div>
              </div>

              <div
                style={{ padding: '14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                onClick={() => { setActiveModal(null); window.location.href = '/ride/captain/login?category=car'; }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', fontSize: '16px' }}>
                  <i className="fa-solid fa-car"></i>
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0f172a', display: 'block' }}>Cab Captain Mode</strong>
                  <span style={{ fontSize: '11.5px', color: '#64748b' }}>City & Outstation Sedan Cab Pilot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

