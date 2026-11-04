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

interface PinItem {
  id: string;
  name: string;
  color: string;
  isPinned: boolean;
  iconType: 'b' | 'calendar' | 'calculator' | 'contacts' | 'notes' | 'keyboard' | 'cloud' | 'tasks';
}

const INITIAL_PINS: PinItem[] = [
  { id: 'portal', name: 'Beta Launcher', color: '#0056b3', isPinned: true, iconType: 'b' },
  { id: 'calendar', name: 'Calendar', color: '#ea580c', isPinned: true, iconType: 'calendar' },
  { id: 'calculator', name: 'Calculator', color: '#059669', isPinned: true, iconType: 'calculator' },
  { id: 'contacts', name: 'Contacts', color: '#2563eb', isPinned: true, iconType: 'contacts' },
  { id: 'notes', name: 'Notes', color: '#64748b', isPinned: false, iconType: 'notes' },
  { id: 'shortcuts', name: 'Keyboard', color: '#6366f1', isPinned: true, iconType: 'keyboard' },
  { id: 'settings', name: 'Cloud Storage', color: '#06b6d4', isPinned: true, iconType: 'cloud' },
  { id: 'tasks', name: 'Tasks', color: '#10b981', isPinned: false, iconType: 'tasks' }
];

export default function UserSideBitTool({
  isOpen = false,
  onActivePanelChange = () => { }
}: UserSideBitToolProps) {
  const { setActiveTab } = useSartStore();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Edit pins mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [pinItems, setPinItems] = useState<PinItem[]>(INITIAL_PINS);

  // App Launcher (BETA) View states
  const [launcherTab, setLauncherTab] = useState<'favorites' | 'recent'>('favorites');
  const [baseCategory, setBaseCategory] = useState<'public' | 'business'>('public');

  const toggleModal = (modalKey: string) => {
    if (isEditMode) return;
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

  const handleTogglePin = (id: string) => {
    setPinItems(prev =>
      prev.map(item => item.id === id ? { ...item, isPinned: !item.isPinned } : item)
    );
  };

  // Dynamic Calendar state
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 10, 4)); // Nov 4, 2026
  const [selectedDay, setSelectedDay] = useState(4);

  const currentYear = currentDate.getFullYear();
  const currentMonthIdx = currentDate.getMonth();
  const currentMonthName = MONTH_NAMES[currentMonthIdx];

  const daysInMonth = new Date(currentYear, currentMonthIdx + 1, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonthIdx, 1).getDay();

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
    { name: 'Ramesh Pilot (Bike Captain)', role: 'Rapid Express Pilot', phone: '+91 94440 12345', initial: 'R' },
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

  // Render individual Icon by type
  const renderItemIcon = (type: string) => {
    switch (type) {
      case 'b':
        return <img src="/images/bnx_brand_b.png" alt="B" className="w-5 h-5 object-contain" />;
      case 'calendar':
        return (
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="4" ry="4"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        );
      case 'calculator':
        return (
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="4" fill="#059669"></rect>
            <line x1="6.5" y1="8" x2="10.5" y2="8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></line>
            <line x1="8.5" y1="6" x2="8.5" y2="10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></line>
            <line x1="13.5" y1="8" x2="17.5" y2="8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></line>
            <line x1="13.5" y1="14" x2="17.5" y2="14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></line>
            <line x1="13.5" y1="17" x2="17.5" y2="17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></line>
            <line x1="6.5" y1="14" x2="10.5" y2="17" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"></line>
            <line x1="10.5" y1="14" x2="6.5" y2="17" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round"></line>
          </svg>
        );
      case 'contacts':
        return (
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="#2563eb">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path>
          </svg>
        );
      case 'notes':
        return (
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="3" width="16" height="18" rx="3"></rect>
            <path d="M9 13.5l4-4 2 2-4 4H9v-2z"></path>
          </svg>
        );
      case 'keyboard':
        return (
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="#6366f1">
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
        );
      case 'cloud':
        return (
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
          </svg>
        );
      case 'tasks':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 1. Vertical Bit-Tool Strip on the Right Hand Edge */}
      <aside className="right-tools-sidebar relative w-[60px] flex flex-col items-center pb-4 h-full justify-between select-none shrink-0 user-side-bittool-strip bnx-style" aria-label="SART Side Utilities">
        <div className="flex-1 overflow-y-auto hidden-scrollbar px-3 py-2 flex flex-col justify-between w-full">
          <div className="flex flex-col items-center gap-3 w-full">
            {/* Header: EDIT PINS in edit mode or Brand B launcher in normal mode */}
            {isEditMode ? (
              <div className="bnx-edit-pins-btn active-mode">
                <span>EDIT</span>
                <span>PINS</span>
              </div>
            ) : (
              <button
                type="button"
                className={`bnx-tool-btn bnx-brand-b ${activeModal === 'portal' ? 'active-tool' : ''}`}
                title="Beta App Launcher"
                onClick={() => toggleModal('portal')}
              >
                <img src="/images/bnx_brand_b.png" alt="Beta Launcher" className="bnx-b-logo-img" />
                <span className="bnx-tooltip">Beta Launcher</span>
              </button>
            )}

            {/* List of App Pins */}
            {pinItems.map((item) => {
              if (!isEditMode && !item.isPinned) return null;

              return (
                <div key={item.id} className="bnx-pin-wrapper relative">
                  <button
                    type="button"
                    className={`bnx-tool-btn bnx-${item.iconType} ${activeModal === item.id ? 'active-tool' : ''} ${!item.isPinned && isEditMode ? 'dashed-unpinned' : ''}`}
                    onClick={() => {
                      if (isEditMode) {
                        handleTogglePin(item.id);
                      } else {
                        toggleModal(item.id);
                      }
                    }}
                  >
                    {!item.isPinned && isEditMode ? (
                      <span className="text-gray-400 font-bold text-lg">+</span>
                    ) : (
                      renderItemIcon(item.iconType)
                    )}

                    {/* Tooltip on left */}
                    <span className="bnx-tooltip">
                      {isEditMode ? (item.isPinned ? `Unpin ${item.name}` : `Pin ${item.name}`) : item.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Edit Pins / Save Button */}
          <div className="flex flex-col items-center gap-3 w-full mt-4">
            {isEditMode ? (
              <button
                type="button"
                className="bnx-tool-btn bnx-check"
                title="Save Pins"
                onClick={() => setIsEditMode(false)}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="bnx-tooltip">Save Pins</span>
              </button>
            ) : (
              <button
                type="button"
                className="bnx-tool-btn bnx-pencil"
                title="Edit Pins"
                onClick={() => setIsEditMode(true)}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
                <span className="bnx-tooltip">Edit Pins</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* 2. Flyout Side Drawers Attached to Pin Bar */}

      {/* DRAWER 1: BETA APP LAUNCHER (Exact Image 1 UI) */}
      {activeModal === 'portal' && (
        <div className="user-side-dock-panel bnx-beta-panel">
          {/* Header with BETA wordmark, EDIT pill and Close button */}
          <div className="bnx-beta-header">
            <h2 className="bnx-beta-title">BETA</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="bnx-beta-edit-btn"
                onClick={() => {
                  closeModal();
                  setIsEditMode(true);
                }}
              >
                EDIT
              </button>
              <button className="bnx-cal-close-btn" onClick={closeModal} title="Close">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className="bnx-beta-body">
            {/* Tab Toggle: FAVORITES | RECENT with active underline */}
            <div className="bnx-beta-card-box">
              <div className="bnx-beta-tabs">
                <button
                  type="button"
                  className={`bnx-beta-tab ${launcherTab === 'favorites' ? 'active' : ''}`}
                  onClick={() => setLauncherTab('favorites')}
                >
                  FAVORITES
                </button>
                <span className="bnx-beta-tab-divider">|</span>
                <button
                  type="button"
                  className={`bnx-beta-tab ${launcherTab === 'recent' ? 'active' : ''}`}
                  onClick={() => setLauncherTab('recent')}
                >
                  RECENT
                </button>
              </div>

              {/* 3-Column Apps Grid */}
              <div className="bnx-beta-grid">
                {/* 1. Cliks */}
                <div className="bnx-app-item">
                  <div className="bnx-app-icon-wrap green-check">
                    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#10b981" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="9" stroke="#065f46" strokeWidth="2.5"></circle>
                      <polyline points="8 12 11 15 16 9" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></polyline>
                    </svg>
                  </div>
                  <span className="bnx-app-name">Cliks</span>
                </div>

                {/* 2. BNXmail */}
                <div className="bnx-app-item">
                  <div className="bnx-app-icon-wrap blue-bird">
                    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#2563eb" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <span className="bnx-app-name">BNXmail</span>
                </div>

                {/* 3. Bit-Tool */}
                <div className="bnx-app-item">
                  <div className="bnx-app-icon-wrap blue-eq">
                    <img src="/images/bnx_slider_icon.png" alt="Bit-Tool" className="w-8 h-8 object-contain" />
                  </div>
                  <span className="bnx-app-name">Bit-Tool</span>
                </div>

                {/* 4. B2Auth */}
                <div className="bnx-app-item">
                  <div className="bnx-app-icon-wrap shield-finger">
                    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#0f172a" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <path d="M12 8a2 2 0 0 0-2 2c0 2 2 4 2 4s2-2 2-4a2 2 0 0 0-2-2z" fill="#0f172a"></path>
                    </svg>
                  </div>
                  <span className="bnx-app-name">B2Auth</span>
                </div>
              </div>
            </div>

            {/* BASE Section */}
            <div className="bnx-base-section mt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="bnx-base-title">BASE</span>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <button
                    type="button"
                    className={`hover:text-blue-600 transition-colors ${baseCategory === 'public' ? 'text-blue-600' : ''}`}
                    onClick={() => setBaseCategory('public')}
                  >
                    PUBLIC
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    className={`hover:text-blue-600 transition-colors ${baseCategory === 'business' ? 'text-blue-600' : ''}`}
                    onClick={() => setBaseCategory('business')}
                  >
                    BUSINESS
                  </button>
                </div>
              </div>

              {/* Base Apps 4-card row */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bnx-card-slot">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#065f46" strokeWidth="2"></circle>
                    <polyline points="8 12 11 15 16 9" stroke="#065f46" strokeWidth="2"></polyline>
                  </svg>
                  <span>Cliks</span>
                </div>
                <div className="bnx-card-slot">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#2563eb" strokeWidth="1.8">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>BNXmail</span>
                </div>
                <div className="bnx-card-slot">
                  <img src="/images/bnx_slider_icon.png" alt="Bit-Tool" className="w-6 h-6 object-contain" />
                  <span>Bit-Tool</span>
                </div>
                <div className="bnx-card-slot">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#0f172a" strokeWidth="1.8">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <span>B2Auth</span>
                </div>
              </div>

              <div className="mt-2 w-[110px]">
                <div className="bnx-card-slot">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#065f46" strokeWidth="2"></circle>
                    <polyline points="8 12 11 15 16 9" stroke="#065f46" strokeWidth="2"></polyline>
                  </svg>
                  <span>CliksBusine...</span>
                </div>
              </div>
            </div>

            {/* Footer Tag */}
            <div className="bnx-beta-footer mt-auto pt-6 text-center">
              <span className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
                BETA ECOSYSTEM • FUTURE READY
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 2: EXACT MATCH BNX CALENDAR MODAL (Image 2 UI) */}
      {activeModal === 'calendar' && (
        <div className="user-side-dock-panel bnx-cal-panel">
          {/* Header */}
          <div className="bnx-cal-header">
            <h3 className="bnx-cal-title">Calendar</h3>
            <button className="bnx-cal-close-btn" onClick={closeModal} title="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="bnx-cal-body">
            {/* Month Header with Right Aligned Arrows */}
            <div className="bnx-month-row">
              <h4 className="bnx-month-name">{currentMonthName} {currentYear}</h4>
              <div className="bnx-month-arrows">
                <button type="button" className="bnx-arrow-btn" onClick={handlePrevMonth} title="Previous Month">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button type="button" className="bnx-arrow-btn" onClick={handleNextMonth} title="Next Month">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            {/* Days Matrix */}
            <div className="bnx-days-grid">
              <span className="bnx-day-wk">Su</span>
              <span className="bnx-day-wk">Mo</span>
              <span className="bnx-day-wk">Tu</span>
              <span className="bnx-day-wk">We</span>
              <span className="bnx-day-wk">Th</span>
              <span className="bnx-day-wk">Fr</span>
              <span className="bnx-day-wk">Sa</span>

              {Array.from({ length: firstDayWeekday }).map((_, idx) => (
                <div key={`empty-${idx}`} className="bnx-day-cell empty"></div>
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                <div
                  key={day}
                  className={`bnx-day-cell ${selectedDay === day ? 'active-orange' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Divider line before schedule footer */}
            <div className="bnx-cal-footer-divider"></div>

            {/* Footer Row: e.g. "NOVEMBER 4 SCHEDULE" and "+ Add" button */}
            <div className="bnx-schedule-row">
              <span className="bnx-schedule-label">
                {currentMonthName.toUpperCase()} {selectedDay} SCHEDULE
              </span>
              <button
                type="button"
                className="bnx-add-btn"
                onClick={() => { closeModal(); setActiveTab('ride'); }}
              >
                + Add
              </button>
            </div>

            {/* Empty items message matching user screenshot */}
            <div className="bnx-cal-empty-msg">
              No items scheduled
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 3: CALCULATOR */}
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

      {/* DRAWER 4: CONTACTS */}
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

      {/* DRAWER 5: NOTES */}
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
