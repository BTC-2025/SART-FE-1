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
  iconType: 'calendar' | 'calculator' | 'contacts' | 'notes' | 'keyboard' | 'cloud' | 'custom_edit' | 'rides' | 'rentals' | 'logistics' | 'parking';
}

const INITIAL_PINS: PinItem[] = [
  { id: 'calendar', name: 'Calendar', color: '#ea580c', isPinned: true, iconType: 'calendar' },
  { id: 'calculator', name: 'Calculator', color: '#059669', isPinned: true, iconType: 'calculator' },
  { id: 'contacts', name: 'Contacts', color: '#2563eb', isPinned: true, iconType: 'contacts' },
  { id: 'notes', name: 'Notes', color: '#64748b', isPinned: true, iconType: 'notes' },
  { id: 'keyboard', name: 'Virtual Keyboard', color: '#6366f1', isPinned: true, iconType: 'keyboard' },
  { id: 'cloud', name: 'Weather', color: '#06b6d4', isPinned: true, iconType: 'cloud' },
];

const AVAILABLE_WEBSITE_APPS: { id: string; name: string; iconType: PinItem['iconType']; color: string }[] = [
  { id: 'rides', name: 'Ride Booking', iconType: 'rides', color: '#2563eb' },
  { id: 'rentals', name: 'Vehicle Rentals', iconType: 'rentals', color: '#10b981' },
  { id: 'logistics', name: 'Cargo & Parcel', iconType: 'logistics', color: '#f59e0b' },
  { id: 'parking', name: 'Smart Parking', iconType: 'parking', color: '#8b5cf6' },
  { id: 'notes', name: 'Notes', iconType: 'notes', color: '#64748b' }
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
  const [showAddOptionsModal, setShowAddOptionsModal] = useState(false);

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

  // Calendar Item Modal State (Image 1)
  const [showAddCalendarItem, setShowAddCalendarItem] = useState(false);
  const [calendarItemType, setCalendarItemType] = useState<'Event' | 'Note' | 'Reminder'>('Event');
  const [calItemTitle, setCalItemTitle] = useState('');
  const [calItemStartTime, setCalItemStartTime] = useState('10:00 AM');
  const [calItemEndTime, setCalItemEndTime] = useState('11:00 AM');
  const [calItemDesc, setCalItemDesc] = useState('');
  const [calendarItems, setCalendarItems] = useState<Array<{
    day: number;
    month: number;
    year: number;
    type: 'Event' | 'Note' | 'Reminder';
    title: string;
    startTime: string;
    endTime: string;
    desc: string;
  }>>([]);

  // Contacts state (Image 2)
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [contactFullName, setContactFullName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactsList, setContactsList] = useState<Array<{
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role?: string;
  }>>([]);

  // Global Notes state (Image 3 & 4)
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isNotePinned, setIsNotePinned] = useState(false);
  const [noteColor, setNoteColor] = useState('#fff9c4');
  const [notesList, setNotesList] = useState<Array<{
    id: string;
    title: string;
    content: string;
    color: string;
    isPinned: boolean;
    date: string;
  }>>([]);
  const [noteInput, setNoteInput] = useState('');

  // Virtual Keyboard input dispatcher to search bar
  const handleVirtualKeyPress = (key: string) => {
    window.dispatchEvent(new CustomEvent('sart-virtual-keypress', { detail: { key } }));
  };

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
      setNotesList(prev => [{
        id: `note-${Date.now()}`,
        title: noteInput.trim(),
        content: '',
        color: '#fff9c4',
        isPinned: false,
        date: 'Just now'
      }, ...prev]);
      setNoteInput('');
    }
  };

  // Render individual Icon by type
  const renderItemIcon = (type: string) => {
    switch (type) {
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
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      case 'custom_edit':
        return (
          <img src="/images/bnx_edit_pencil.png" alt="Edit Notes" className="w-80 h-80 object-contain rounded" />
        );
      case 'rides':
        return (
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
            <circle cx="7" cy="17" r="2"></circle>
            <circle cx="17" cy="17" r="2"></circle>
          </svg>
        );
      case 'rentals':
        return (
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        );
      case 'logistics':
        return (
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="21 8 21 21 3 21 3 8"></polyline>
            <rect x="1" y="3" width="22" height="5"></rect>
            <line x1="10" y1="12" x2="14" y2="12"></line>
          </svg>
        );
      case 'parking':
        return (
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" stroke="#8b5cf6" strokeWidth="2"></circle>
            <path d="M10 8h3a2 2 0 0 1 0 4h-3v4"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 1. Vertical Bit-Tool Strip on the Right Hand Edge */}
      <aside className="right-tools-sidebar relative w-[58px] hidden-scrollbar flex flex-col items-center select-none shrink-0 user-side-bittool-strip bnx-style overflow-visible" aria-label="SART Side Utilities">
        {/* Icons stack container */}
        <div className="px-2 py-2 flex flex-col items-center w-full overflow-visible">
          <div className="flex flex-col items-center gap-1.5 w-full">
            {/* Header: EDIT PINS in edit mode or Brand B launcher in normal mode (Consistent 42px width) */}
            {isEditMode ? (
              <div className="bnx-edit-pins-btn active-mode">
                <span>EDIT PINS</span>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className={`bnx-tool-btn bnx-brand-b bnx-square-shape ${activeModal === 'portal' ? 'active-tool' : ''}`}
                  title="Beta App Launcher"
                  onClick={() => toggleModal('portal')}
                >
                  <img src="/images/bnx_brand_b.png" alt="Beta Launcher" className="bnx-b-logo-img" />
                  <span className="bnx-tooltip">Beta Launcher</span>
                </button>
                <div className="w-8 h-[1px] bg-gray-200 dark:bg-gray-800 mt-1 mb-0.5 shrink-0"></div>
              </>
            )}

            {/* List of App Pins */}
            {pinItems.map((item) => {
              if (!isEditMode && !item.isPinned) return null;

              return (
                <div key={item.id} className="bnx-pin-wrapper relative my-0.5">
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

            {/* In Edit mode, show dedicated dashed '+' slot directly below pins */}
            {isEditMode && (
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="w-7 h-[1.5px] bg-slate-200 rounded my-0.5"></div>
                <div className="bnx-pin-wrapper relative my-0.5">
                  <button
                    type="button"
                    className="bnx-tool-btn dashed-unpinned"
                    title="Add more options"
                    onClick={() => setShowAddOptionsModal(true)}
                  >
                    <span className="text-blue-600 font-bold text-xl leading-none">+</span>
                    <span className="bnx-tooltip">Add More Apps</span>
                  </button>
                </div>
              </div>
            )}

            {/* In Normal mode, show the shortcut customize pencil right below pins */}
            {!isEditMode && (
              <div className="bnx-pin-wrapper relative my-0.5">
                <button
                  type="button"
                  className="bnx-tool-btn bnx-pencil"
                  title="Customize Pins"
                  onClick={() => setIsEditMode(true)}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                  <span className="bnx-tooltip">Customize Pins</span>
                </button>
              </div>
            )}

            {/* Bottom Controls (Image 1 Sliders / Tune Icon in normal mode, or Checkmark in edit mode) */}
            <div className="bnx-bottom-controls-container mt-auto flex flex-col items-center pb-[30px] pt-2">
              {!isEditMode ? (
                /* Image 1: Sliders / Settings Filter Icon below pencil at bottom with 30px gap below */
                <div className="bnx-pin-wrapper relative">
                  <button
                    type="button"
                    className="bnx-tool-btn bnx-sliders-btn"
                    title="Edit and Customize Pins"
                    onClick={() => setIsEditMode(true)}
                  >
                    <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      {/* Top slider line with thumb */}
                      <line x1="4" y1="7" x2="14" y2="7"></line>
                      <line x1="14" y1="4" x2="14" y2="10"></line>
                      <line x1="18" y1="7" x2="20" y2="7"></line>
                      {/* Bottom slider line with thumb */}
                      <line x1="4" y1="17" x2="6" y2="17"></line>
                      <line x1="10" y1="14" x2="10" y2="20"></line>
                      <line x1="10" y1="17" x2="20" y2="17"></line>
                    </svg>
                    <span className="bnx-tooltip">Customize Dock</span>
                  </button>
                </div>
              ) : (
                /* In Edit mode, show Save Checkmark at bottom */
                <div className="bnx-pin-wrapper relative">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* MODAL: ADD MORE OPTIONS (Shown when clicking + in Edit Pins Mode) */}
      {showAddOptionsModal && (
        <div className="fixed inset-0 top-[105px] z-[999] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-slate-300 w-full max-w-md my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
              <h3 className="font-bold text-slate-900 text-sm tracking-wide">Add Website Shortcuts</h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
                onClick={() => setShowAddOptionsModal(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto hidden-scrollbar">
              {AVAILABLE_WEBSITE_APPS.map(app => {
                const existing = pinItems.find(p => p.id === app.id);
                const isPinned = existing ? existing.isPinned : false;

                return (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border-2 border-slate-200 hover:border-blue-200 hover:bg-blue-50/40 transition-all cursor-pointer"
                    onClick={() => {
                      if (existing) {
                        handleTogglePin(app.id);
                      } else {
                        setPinItems(prev => [...prev, { ...app, isPinned: true }]);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 border border-slate-200">
                        {renderItemIcon(app.iconType)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{app.name}</div>
                        <div className="text-[11px] text-slate-400">Quick action icon</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${isPinned
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                      {isPinned ? 'Remove' : '+ Add'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Click Save (✓) on the bar to confirm</span>
              <button
                type="button"
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                onClick={() => {
                  setShowAddOptionsModal(false);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Flyout Side Drawers Attached to Pin Bar */}

      {/* DRAWER 1: BETA APP LAUNCHER (Exact Image 1 UI) */}
      {activeModal === 'portal' && (
        <div className="user-side-dock-panel bnx-beta-panel">
          {/* Header with BETA wordmark, EDIT pill and Close button */}
          <div className="bnx-beta-header">
            <div className="flex items-center">
              <img
                src="/images/beta_logo_header.png"
                alt="BETA"
                className="h-8 object-contain"
              />
            </div>
            <div className="flex items-center gap-2">

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

              {/* Apps Grid for Favorites vs Recent */}
              {launcherTab === 'favorites' ? (
                <div className="bnx-beta-grid">
                  {/* 1. Cliks */}
                  <div className="bnx-app-item">
                    <div className="bnx-app-icon-wrap">
                      <img src="/images/beta_cliks.png" alt="Cliks" className="w-10 h-10 object-contain" />
                    </div>
                    <span className="bnx-app-name">Cliks</span>
                  </div>

                  {/* 2. BNXmail */}
                  <div className="bnx-app-item">
                    <div className="bnx-app-icon-wrap">
                      <img src="/images/beta_bnxmail.png" alt="BNXmail" className="w-10 h-10 object-contain" />
                    </div>
                    <span className="bnx-app-name">BNXmail</span>
                  </div>

                  {/* 3. Bit-Tool */}
                  <div className="bnx-app-item">
                    <div className="bnx-app-icon-wrap">
                      <img src="/images/beta_bittool.png" alt="Bit-Tool" className="w-10 h-10 object-contain" />
                    </div>
                    <span className="bnx-app-name">Bit-Tool</span>
                  </div>

                  {/* 4. B2Auth */}
                  <div className="bnx-app-item">
                    <div className="bnx-app-icon-wrap">
                      <img src="/images/beta_b2auth.png" alt="B2Auth" className="w-10 h-10 object-contain" />
                    </div>
                    <span className="bnx-app-name">B2Auth</span>
                  </div>
                </div>
              ) : (
                /* RECENT TAB: Only Cliks is shown */
                <div className="bnx-beta-grid">
                  <div className="bnx-app-item">
                    <div className="bnx-app-icon-wrap">
                      <img src="/images/beta_cliks.png" alt="Cliks" className="w-10 h-10 object-contain" />
                    </div>
                    <span className="bnx-app-name">Cliks</span>
                  </div>
                </div>
              )}
            </div>

            {/* BASE Section */}
            <div className="bnx-base-section mt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="bnx-base-title">BASE</span>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <button
                    type="button"
                    className={`transition-colors font-extrabold ${baseCategory === 'public' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    onClick={() => setBaseCategory('public')}
                  >
                    PUBLIC
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    className={`transition-colors font-extrabold ${baseCategory === 'business' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                    onClick={() => setBaseCategory('business')}
                  >
                    BUSINESS
                  </button>
                </div>
              </div>

              {/* Base Apps View: PUBLIC vs BUSINESS */}
              {baseCategory === 'public' ? (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bnx-card-slot">
                      <img src="/images/beta_cliks.png" alt="Cliks" className="w-7 h-7 object-contain" />
                      <span>Cliks</span>
                    </div>
                    <div className="bnx-card-slot">
                      <img src="/images/beta_bnxmail.png" alt="BNXmail" className="w-7 h-7 object-contain" />
                      <span>BNXmail</span>
                    </div>
                    <div className="bnx-card-slot">
                      <img src="/images/beta_bittool.png" alt="Bit-Tool" className="w-7 h-7 object-contain" />
                      <span>Bit-Tool</span>
                    </div>
                    <div className="bnx-card-slot">
                      <img src="/images/beta_b2auth.png" alt="B2Auth" className="w-7 h-7 object-contain" />
                      <span>B2Auth</span>
                    </div>
                  </div>

                  <div className="mt-2 w-[110px]">
                    <div className="bnx-card-slot">
                      <img src="/images/beta_cliks.png" alt="CliksBusiness" className="w-7 h-7 object-contain" />
                      <span>CliksBusine...</span>
                    </div>
                  </div>
                </>
              ) : (
                /* BUSINESS TAB: Only CliksBusiness is shown */
                <div className="w-[110px]">
                  <div className="bnx-card-slot">
                    <img src="/images/beta_cliks.png" alt="CliksBusiness" className="w-7 h-7 object-contain" />
                    <span>CliksBusin...</span>
                  </div>
                </div>
              )}
            </div>

            {/* BETA LABS RELEASE / COMING SOON CARD */}
            <div className="relative border border-gray-200/90 rounded-[20px] px-6 py-4 mt-6 mb-0.5 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.01)] text-center flex flex-col items-center">
              {/* Floating top badge icon */}
              <div className="absolute -top-4 w-9 h-9 rounded-full bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center">
                <img src="/images/beta_bnxmail.png" alt="Beta Labs" className="w-5 h-5 object-contain" />
              </div>

              {/* BETA LABS RELEASE pill tag */}
              <div className="mt-1 inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50/80 text-[10.5px] font-extrabold tracking-wider text-blue-600 uppercase">
                BETA LABS RELEASE
              </div>

              {/* COMING SOON title */}
              <h4 className="mt-2 text-base font-black tracking-wide bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase">
                COMING SOON
              </h4>

              {/* Subtitle */}
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Building the next generation of Beta applications.
              </p>
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
                onClick={() => setShowAddCalendarItem(true)}
              >
                + Add
              </button>
            </div>

            {/* Empty or List items */}
            {calendarItems.filter(item => item.day === selectedDay && item.month === currentMonthIdx && item.year === currentYear).length === 0 ? (
              <div className="bnx-cal-empty-msg">
                No items scheduled
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', maxHeight: '140px', overflowY: 'auto' }}>
                {calendarItems
                  .filter(item => item.day === selectedDay && item.month === currentMonthIdx && item.year === currentYear)
                  .map((it, idx) => (
                    <div key={idx} style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{it.title}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{it.type} • {it.startTime} - {it.endTime}</div>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: '#fef3c7', color: '#b45309' }}>{it.type}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* BOTTOM SHEET: Add Item for [Day] [Month] (Image 1) */}
          {showAddCalendarItem && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              zIndex: 50,
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#ffffff',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '22px 24px 26px',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                {/* Header: Add Item for 11 November + Close */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                    Add Item for {selectedDay} {currentMonthName}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddCalendarItem(false)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                {/* Switcher Pill: Event | Note | Reminder */}
                <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '14px', gap: '4px' }}>
                  {(['Event', 'Note', 'Reminder'] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setCalendarItemType(tab)}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        border: 'none',
                        borderRadius: '10px',
                        background: calendarItemType === tab ? '#ffffff' : 'transparent',
                        color: calendarItemType === tab ? '#0f172a' : '#64748b',
                        fontWeight: 800,
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxShadow: calendarItemType === tab ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Title Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Title</label>
                  <input
                    type="text"
                    value={calItemTitle}
                    onChange={(e) => setCalItemTitle(e.target.value)}
                    placeholder=""
                    style={{
                      height: '42px',
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '0 14px',
                      fontSize: '14px',
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Start Time & End Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Start Time</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={calItemStartTime}
                        onChange={(e) => setCalItemStartTime(e.target.value)}
                        style={{
                          width: '100%',
                          height: '42px',
                          background: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '0 36px 0 14px',
                          fontSize: '14px',
                          color: '#0f172a',
                          outline: 'none'
                        }}
                      />
                      <i className="fa-regular fa-clock" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '13px', pointerEvents: 'none' }}></i>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>End Time</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={calItemEndTime}
                        onChange={(e) => setCalItemEndTime(e.target.value)}
                        style={{
                          width: '100%',
                          height: '42px',
                          background: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '0 36px 0 14px',
                          fontSize: '14px',
                          color: '#0f172a',
                          outline: 'none'
                        }}
                      />
                      <i className="fa-regular fa-clock" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '13px', pointerEvents: 'none' }}></i>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Description</label>
                  <textarea
                    rows={3}
                    value={calItemDesc}
                    onChange={(e) => setCalItemDesc(e.target.value)}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '14px',
                      color: '#0f172a',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                {/* Save Item Button (Exact Orange matching Image 1) */}
                <button
                  type="button"
                  onClick={() => {
                    if (calItemTitle.trim()) {
                      setCalendarItems(prev => [...prev, {
                        day: selectedDay,
                        month: currentMonthIdx,
                        year: currentYear,
                        type: calendarItemType,
                        title: calItemTitle.trim(),
                        startTime: calItemStartTime,
                        endTime: calItemEndTime,
                        desc: calItemDesc
                      }]);
                      setCalItemTitle('');
                      setCalItemDesc('');
                    }
                    setShowAddCalendarItem(false);
                  }}
                  style={{
                    height: '46px',
                    background: '#f59e0b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
                    marginTop: '4px'
                  }}
                >
                  Save Item
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DRAWER 3: CALCULATOR */}
      {activeModal === 'calculator' && (
        <div className="user-side-dock-panel">
          <div className="user-dock-header">
            <span className="user-dock-title">CALCULATOR</span>
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
        <div className="user-side-dock-panel" style={{ width: '400px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          {/* Top Header: CONTACTS with Close button (Matching Image 2) */}
          <div className="bnx-cal-header" style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 className="bnx-cal-title" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.3px', margin: 0, color: '#0f172a' }}>CONTACTS</h3>
            <button className="bnx-cal-close-btn" onClick={closeModal} title="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Sub Header & Search Section (Matching Image 1) */}
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flex: 1, gap: '16px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Global Contacts</h4>
              </div>
              <button
                type="button"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  color: '#2563eb',
                  border: '1px solid #dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
                title="Add Contact"
                onClick={() => setShowAddContact(true)}
              >
                +
              </button>
            </div>

            {/* Pill Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '15px' }}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Search global contacts..."
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '24px',
                  border: '1.5px solid #e2e8f0',
                  paddingLeft: '44px',
                  paddingRight: '16px',
                  fontSize: '14px',
                  color: '#0f172a',
                  outline: 'none',
                  background: '#ffffff'
                }}
              />
            </div>

            {/* Empty State or List */}
            {contactsList.filter(c => c.fullName.toLowerCase().includes(contactSearch.toLowerCase()) || c.email.toLowerCase().includes(contactSearch.toLowerCase())).length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', color: '#94a3b8' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>No contacts found</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {contactsList
                  .filter(c => c.fullName.toLowerCase().includes(contactSearch.toLowerCase()) || c.email.toLowerCase().includes(contactSearch.toLowerCase()))
                  .map(c => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px' }}>
                        {c.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.fullName}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>{c.email}</div>
                        {c.phone && <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.phone} {c.role ? `• ${c.role}` : ''}</div>}
                      </div>
                      <button
                        type="button"
                        onClick={() => setContactsList(prev => prev.filter(item => item.id !== c.id))}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* BOTTOM SHEET: Add Contact (Image 2) */}
          {showAddContact && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              zIndex: 50,
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#ffffff',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '22px 24px 26px',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                {/* Header: + Add Contact + Close */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb' }}>+</span>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Add Contact</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddContact(false)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                {/* Full Name * */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Full Name *</label>
                  <input
                    type="text"
                    value={contactFullName}
                    onChange={(e) => setContactFullName(e.target.value)}
                    placeholder="Jane Smith"
                    style={{
                      height: '44px',
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0 14px',
                      fontSize: '14px',
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Email Address * */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Email Address *</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jane@example.com"
                    style={{
                      height: '44px',
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '0 14px',
                      fontSize: '14px',
                      color: '#0f172a',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Phone & Role */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Phone</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+1 234 567 890"
                      style={{
                        height: '44px',
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0 14px',
                        fontSize: '14px',
                        color: '#0f172a',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Role</label>
                    <input
                      type="text"
                      value={contactRole}
                      onChange={(e) => setContactRole(e.target.value)}
                      placeholder="e.g. Supplier"
                      style={{
                        height: '44px',
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0 14px',
                        fontSize: '14px',
                        color: '#0f172a',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Save Contact Button (Exact Solid Royal Blue matching Image 2) */}
                <button
                  type="button"
                  onClick={() => {
                    if (contactFullName.trim() && contactEmail.trim()) {
                      setContactsList(prev => [...prev, {
                        id: `cnt-${Date.now()}`,
                        fullName: contactFullName.trim(),
                        email: contactEmail.trim(),
                        phone: contactPhone.trim(),
                        role: contactRole.trim()
                      }]);
                      setContactFullName('');
                      setContactEmail('');
                      setContactPhone('');
                      setContactRole('');
                    }
                    setShowAddContact(false);
                  }}
                  style={{
                    height: '48px',
                    background: '#1d63ed',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(29, 99, 237, 0.35)',
                    marginTop: '8px'
                  }}
                >
                  Save Contact
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DRAWER 5: GLOBAL NOTES (Matching Image 3 & 4) */}
      {activeModal === 'notes' && (
        <div className="user-side-dock-panel" style={{ width: '400px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          {/* Header */}
          <div className="bnx-cal-header" style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 className="bnx-cal-title" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.3px', margin: 0, color: '#0f172a' }}>NOTES</h3>
            <button className="bnx-cal-close-btn" onClick={closeModal} title="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flex: 1, gap: '16px', overflowY: 'auto' }}>
            {/* Global Notes Title & Rounded Yellow Plus Button (Image 3 & 4) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Global Notes</h4>
              </div>
              <button
                type="button"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#fef9c3',
                  color: '#ca8a04',
                  border: '1px solid #fef08a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
                title="Add Note"
                onClick={() => {
                  setNoteColor('#fff9c4');
                  setShowAddNote(true);
                }}
              >
                +
              </button>
            </div>

            {/* Notes List or Empty State */}
            {notesList.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '180px', gap: '12px' }}>
                <div style={{ width: '52px', height: '52px', color: '#94a3b8' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>No notes found</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                {notesList.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      background: n.color || '#fff9c4',
                      borderRadius: '16px',
                      padding: '14px',
                      minHeight: '110px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      border: '1px solid rgba(0,0,0,0.06)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b', wordBreak: 'break-word' }}>{n.title || n.content.slice(0, 20)}</span>
                      <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: 'rgba(255,255,255,0.7)', color: '#2563eb' }}>BNX MAIL</span>
                    </div>
                    {n.content && (
                      <p style={{ margin: '6px 0', fontSize: '12px', color: '#334155', wordBreak: 'break-word' }}>{n.content}</p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{n.date}</span>
                      <button
                        type="button"
                        onClick={() => setNotesList(prev => prev.filter(item => item.id !== n.id))}
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                      >
                        <i className="fa-regular fa-trash-can" style={{ fontSize: '11px' }}></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOTTOM SHEET: Add Note (Image 3 & 4) */}
          {showAddNote && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              zIndex: 50,
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: noteColor || '#fff9c4',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '22px 24px 26px',
                boxShadow: '0 -10px 30px rgba(0,0,0,0.12)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                {/* Header: + Add Note + Pin Icon + Close Icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>+</span>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Add Note</h4>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button
                      type="button"
                      onClick={() => setIsNotePinned(prev => !prev)}
                      style={{ background: 'none', border: 'none', color: isNotePinned ? '#2563eb' : '#334155', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                      title="Pin note"
                    >
                      <i className={`fa-solid fa-thumbtack ${isNotePinned ? 'rotate-45' : ''}`} style={{ fontSize: '16px' }}></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddNote(false)}
                      style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                      title="Close"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Title Input */}
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Title"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#1e293b',
                    outline: 'none',
                    padding: '4px 0'
                  }}
                />

                {/* Take a note... Textarea */}
                <textarea
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Take a note..."
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '15px',
                    color: '#334155',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: '1.5'
                  }}
                />

                {/* Color Palette Bubbles (Exact Image 3 & 4) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                  {[
                    '#ffffff', // White
                    '#f87171', // Coral red
                    '#f59e0b', // Deep Amber / Orange
                    '#fef08a', // Pastel Yellow
                    '#bbf7d0', // Pastel Green
                    '#a7f3d0', // Mint Cyan
                    '#bae6fd', // Light Sky Blue
                    '#bfdbfe', // Soft Periwinkle
                    '#d8b4fe', // Light Purple
                    '#fbcfe8', // Soft Pink
                    '#fed7aa', // Light Peach
                    '#e2e8f0', // Cool Grey
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNoteColor(c)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: c,
                        border: noteColor === c ? '3px solid #2563eb' : '1.5px solid rgba(0,0,0,0.12)',
                        cursor: 'pointer',
                        padding: 0,
                        transform: noteColor === c ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.15s ease'
                      }}
                    />
                  ))}
                </div>

                {/* Save Note Button (Exact Dark Charcoal button matching Image 3 & 4) */}
                <button
                  type="button"
                  onClick={() => {
                    if (noteTitle.trim() || noteContent.trim()) {
                      setNotesList(prev => [{
                        id: `note-${Date.now()}`,
                        title: noteTitle.trim(),
                        content: noteContent.trim(),
                        color: noteColor,
                        isPinned: isNotePinned,
                        date: 'Just now'
                      }, ...prev]);
                      setNoteTitle('');
                      setNoteContent('');
                    }
                    setShowAddNote(false);
                  }}
                  style={{
                    height: '48px',
                    background: '#2b2b2b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                    marginTop: '8px'
                  }}
                >
                  Save Note
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DRAWER 6: VIRTUAL KEYBOARD (Full & Interactive) */}
      {activeModal === 'keyboard' && (
        <div className="user-side-dock-panel bnx-vk-panel" style={{ width: '740px', maxWidth: 'calc(100vw - 80px)', height: 'auto', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <div className="bnx-cal-header" style={{ padding: '16px 22px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <i className="fa-solid fa-keyboard" style={{ fontSize: '17px' }}></i>
              </div>
              <div>
                <h3 className="bnx-cal-title" style={{ fontSize: '17px', margin: 0, fontWeight: 700, color: '#0f172a' }}>Virtual Keyboard</h3>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Types directly into search bar</span>
              </div>
            </div>
            <button className="bnx-cal-close-btn" onClick={closeModal} title="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc' }}>
            {/* Row 1 */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
              <button type="button" className="vk-btn vk-btn-sm" style={{ minWidth: '50px' }} onClick={() => handleVirtualKeyPress('Esc')}>Esc</button>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].map((k, i) => (
                <button
                  key={k}
                  type="button"
                  className="vk-btn vk-btn-sm"
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4px 0' }}
                  onClick={() => handleVirtualKeyPress(k)}
                >
                  <span style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1 }}>{['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'][i]}</span>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>{k}</span>
                </button>
              ))}
              <button type="button" className="vk-btn vk-btn-sm" style={{ minWidth: '80px', fontWeight: 600 }} onClick={() => handleVirtualKeyPress('Backspace')}>Backspace</button>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
              <button type="button" className="vk-btn" style={{ minWidth: '60px' }} onClick={() => handleVirtualKeyPress('Tab')}>Tab</button>
              {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((k) => (
                <button key={k} type="button" className="vk-btn" style={{ flex: 1, fontWeight: 700, fontSize: '14px' }} onClick={() => handleVirtualKeyPress(k)}>{k}</button>
              ))}
              <button type="button" className="vk-btn" style={{ width: '42px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }} onClick={() => handleVirtualKeyPress('[')}>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{'{'}</span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>[</span>
              </button>
              <button type="button" className="vk-btn" style={{ width: '42px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }} onClick={() => handleVirtualKeyPress(']')}>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{'}'}</span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>]</span>
              </button>
            </div>

            {/* Row 3 */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
              <button type="button" className="vk-btn" style={{ minWidth: '78px' }} onClick={() => { }}>Caps Lock</button>
              {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((k) => (
                <button key={k} type="button" className="vk-btn" style={{ flex: 1, fontWeight: 700, fontSize: '14px' }} onClick={() => handleVirtualKeyPress(k)}>{k}</button>
              ))}
              <button type="button" className="vk-btn" style={{ width: '42px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }} onClick={() => handleVirtualKeyPress(';')}>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>:</span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>;</span>
              </button>
              <button type="button" className="vk-btn" style={{ width: '42px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }} onClick={() => handleVirtualKeyPress("'")}>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>"</span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>'</span>
              </button>
              <button type="button" className="vk-btn" style={{ minWidth: '86px', background: '#2563eb', color: '#ffffff', fontWeight: 700, border: 'none' }} onClick={() => handleVirtualKeyPress('Enter')}>Enter</button>
            </div>

            {/* Row 4 */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
              <button type="button" className="vk-btn" style={{ minWidth: '92px', background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 600 }}>↑ Shift</button>
              {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((k) => (
                <button key={k} type="button" className="vk-btn" style={{ flex: 1, fontWeight: 700, fontSize: '14px' }} onClick={() => handleVirtualKeyPress(k)}>{k}</button>
              ))}
              <button type="button" className="vk-btn" style={{ width: '42px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }} onClick={() => handleVirtualKeyPress(',')}>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>&lt;</span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>,</span>
              </button>
              <button type="button" className="vk-btn" style={{ width: '42px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }} onClick={() => handleVirtualKeyPress('.')}>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>&gt;</span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>.</span>
              </button>
              <button type="button" className="vk-btn" style={{ width: '42px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }} onClick={() => handleVirtualKeyPress('/')}>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>?</span>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>/</span>
              </button>
              <button type="button" className="vk-btn" style={{ minWidth: '92px', background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 600 }}>↑ Shift</button>
            </div>

            {/* Row 5 */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" className="vk-btn" style={{ minWidth: '55px' }}>Ctrl</button>
              <button type="button" className="vk-btn" style={{ minWidth: '55px' }}>Alt</button>
              <button type="button" className="vk-btn" style={{ flex: 1, fontWeight: 700, letterSpacing: '1px' }} onClick={() => handleVirtualKeyPress('Space')}>Space</button>
              <button type="button" className="vk-btn" style={{ minWidth: '55px' }}>Alt</button>
              <button type="button" className="vk-btn" style={{ minWidth: '55px' }}>Ctrl</button>
              <button type="button" className="vk-btn" style={{ width: '44px' }}><i className="fa-solid fa-caret-left"></i></button>
              <button type="button" className="vk-btn" style={{ width: '44px' }}><i className="fa-solid fa-caret-down"></i></button>
              <button type="button" className="vk-btn" style={{ width: '44px' }}><i className="fa-solid fa-caret-up"></i></button>
              <button type="button" className="vk-btn" style={{ width: '44px' }}><i className="fa-solid fa-caret-right"></i></button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER 7: WEATHER (Image 2 UI) */}
      {activeModal === 'cloud' && (
        <div className="user-side-dock-panel" style={{ width: '380px' }}>
          <div className="bnx-cal-header" style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 className="bnx-cal-title" style={{ fontSize: '17px', margin: 0, fontWeight: 700, color: '#0f172a' }}>Weather</h3>
            <button className="bnx-cal-close-btn" onClick={closeModal} title="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, border: '1.5px solid #e2e8f0', borderRadius: '24px', padding: '36px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#ffffff' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v2"></path>
                  <path d="M4.93 4.93l1.41 1.41"></path>
                  <path d="M20 12h2"></path>
                  <path d="M19.07 4.93l-1.41 1.41"></path>
                  <path d="M15.5 12a3.5 3.5 0 0 0-7 0"></path>
                  <path d="M6 16a4 4 0 0 0 4 4h8a4 4 0 0 0 0-8 4.5 4.5 0 0 0-1.8.38"></path>
                </svg>
              </div>

              <h4 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0' }}>Local Weather</h4>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, margin: '0 0 28px 0', maxWidth: '240px' }}>
                Allow location access to see the current weather in your area.
              </p>

              <button
                type="button"
                style={{
                  background: '#00b4d8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '13px 28px',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(0, 180, 216, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  alert('Detecting your location weather: 29°C Partly Cloudy in Chennai.');
                }}
              >
                <i className="fa-solid fa-location-dot"></i>
                <span>Detect Location</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
