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
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(() => new Date()); // Exact today's date
  const [selectedDay, setSelectedDay] = useState(today.getDate());

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
  const [pendingOp, setPendingOp] = useState<'+' | '-' | '×' | '÷'>('+');
  const [calcFormula, setCalcFormula] = useState('');
  const [calcCurrency, setCalcCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');
  const [activeCalcDropdown, setActiveCalcDropdown] = useState<'gst' | 'discount' | 'region' | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCompareMode, setShowCompareMode] = useState(false);
  const [copiedShareAlert, setCopiedShareAlert] = useState(false);

  // Custom user percentage input states
  const [customGstInput, setCustomGstInput] = useState('');
  const [customDiscountInput, setCustomDiscountInput] = useState('');

  // Price comparison items (Side A vs Side B)
  const [compareItems, setCompareItems] = useState<Array<{ id: string; desc: string; valA: number; valB: number }>>([
    { id: 'cmp-1', desc: 'Item 1', valA: 91, valB: 92 },
    { id: 'cmp-2', desc: 'Item 1', valA: 91, valB: 92 }
  ]);
  const [cmpInputDesc, setCmpInputDesc] = useState('');
  const [cmpInputValA, setCmpInputValA] = useState('');
  const [cmpInputValB, setCmpInputValB] = useState('');

  // Interactive Tape Entries (Base, Discount, GST, Addition, etc.)
  interface TapeItem {
    id: string;
    type: 'BASE' | 'DISCOUNT' | 'GST' | 'ADD' | 'SUB' | 'MUL' | 'DIV';
    label: string;
    percent?: number;
    value: number;
    runningTotal: number;
    diff?: number;
  }

  const [tapeItems, setTapeItems] = useState<TapeItem[]>([
    { id: 't-1', type: 'BASE', label: 'Base Amount', value: 8, runningTotal: 8 },
    { id: 't-2', type: 'DISCOUNT', label: '10% Disc', percent: 10, value: 10, runningTotal: 7.2, diff: -0.8 },
    { id: 't-3', type: 'GST', label: '5% GST', percent: 5, value: 5, runningTotal: 7.56, diff: 0.36 },
    { id: 't-4', type: 'ADD', label: 'Extra Add', value: 8, runningTotal: 15.56, diff: 8 }
  ]);

  // Tape history logs
  const [calcHistory, setCalcHistory] = useState<Array<{
    id: string;
    timestamp: string;
    tape: TapeItem[];
    total: number;
    currency: string;
  }>>([]);

  // Calendar Item Modal State (Image 1 & 2)
  const [showAddCalendarItem, setShowAddCalendarItem] = useState(false);
  const [calendarItemType, setCalendarItemType] = useState<'Event' | 'Note' | 'Reminder'>('Note');
  const [calItemTitle, setCalItemTitle] = useState('');
  const [calItemStartTime, setCalItemStartTime] = useState('10:00 AM');
  const [calItemEndTime, setCalItemEndTime] = useState('11:00 AM');
  const [calItemTime, setCalItemTime] = useState('10:00 AM'); // Note & Reminder time
  const [calItemDesc, setCalItemDesc] = useState('');
  const [calItemEmail, setCalItemEmail] = useState(''); // Reminder email
  const [calendarItems, setCalendarItems] = useState<Array<{
    day: number;
    month: number;
    year: number;
    type: 'Event' | 'Note' | 'Reminder';
    title: string;
    startTime?: string;
    endTime?: string;
    time?: string;
    desc: string;
    email?: string;
  }>>([]);

  // Contacts state (Image 2)
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
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
  }>>([
    {
      id: 'cnt-default-1',
      fullName: 'c',
      email: 'b@gmail.com',
      phone: '87908756789',
      role: 'c'
    }
  ]);

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

  // Exchange rates relative to INR (1 INR = x Currency)
  const currencyRates: Record<string, { symbol: string; rate: number; name: string }> = {
    INR: { symbol: '₹', rate: 1, name: 'India (INR)' },
    USD: { symbol: '$', rate: 0.012, name: 'USA (USD)' },
    EUR: { symbol: '€', rate: 0.011, name: 'Europe (EUR)' },
  };

  const getRunningTotal = () => {
    if (tapeItems.length === 0) return parseFloat(calcDisplay) || 0;
    return tapeItems[tapeItems.length - 1].runningTotal;
  };

  const logToHistory = (itemLabel: string, finalTotal: number, details?: string) => {
    setCalcHistory(prev => [
      {
        id: `hist-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        tape: [...tapeItems],
        total: finalTotal,
        currency: calcCurrency,
        summary: details || itemLabel
      },
      ...prev
    ]);
  };

  const handleApplyDiscount = (percent: number) => {
    const currentBase = getRunningTotal();
    const discountAmount = +(currentBase * (percent / 100)).toFixed(2);
    const newTotal = +(currentBase - discountAmount).toFixed(2);
    const newTapeItem: TapeItem = {
      id: `t-${Date.now()}`,
      type: 'DISCOUNT',
      label: `${percent}% Disc`,
      percent: percent,
      value: percent,
      runningTotal: newTotal,
      diff: -discountAmount
    };
    setTapeItems(prev => [...prev, newTapeItem]);
    logToHistory(`${percent}% Discount`, newTotal, `${currencyRates[calcCurrency]?.symbol || '₹'}${currentBase} − ${percent}% = ${currencyRates[calcCurrency]?.symbol || '₹'}${newTotal}`);
    setActiveCalcDropdown(null);
    setCustomDiscountInput('');
  };

  const handleApplyGst = (percent: number) => {
    const currentBase = getRunningTotal();
    const gstAmount = +(currentBase * (percent / 100)).toFixed(2);
    const newTotal = +(currentBase + gstAmount).toFixed(2);
    const newTapeItem: TapeItem = {
      id: `t-${Date.now()}`,
      type: 'GST',
      label: `${percent}% GST`,
      percent: percent,
      value: percent,
      runningTotal: newTotal,
      diff: +gstAmount
    };
    setTapeItems(prev => [...prev, newTapeItem]);
    logToHistory(`${percent}% GST`, newTotal, `${currencyRates[calcCurrency]?.symbol || '₹'}${currentBase} + ${percent}% GST = ${currencyRates[calcCurrency]?.symbol || '₹'}${newTotal}`);
    setActiveCalcDropdown(null);
    setCustomGstInput('');
  };

  const handleApplyOperation = (op: 'ADD' | 'SUB' | 'MUL' | 'DIV') => {
    const entered = parseFloat(calcDisplay) || 0;
    if (entered === 0 && tapeItems.length === 0) return;
    const currentBase = getRunningTotal();
    let newTotal = currentBase;
    let diffVal = entered;

    if (tapeItems.length === 0) {
      setTapeItems([
        {
          id: `t-${Date.now()}`,
          type: 'BASE',
          label: 'Base Amount',
          value: entered,
          runningTotal: entered
        }
      ]);
      logToHistory('Base Amount', entered, `Initial Base: ${currencyRates[calcCurrency]?.symbol || '₹'}${entered}`);
      setCalcDisplay('0');
      return;
    }

    if (op === 'ADD') {
      newTotal = +(currentBase + entered).toFixed(2);
      diffVal = entered;
    } else if (op === 'SUB') {
      newTotal = +(currentBase - entered).toFixed(2);
      diffVal = -entered;
    } else if (op === 'MUL') {
      newTotal = +(currentBase * entered).toFixed(2);
      diffVal = +(newTotal - currentBase).toFixed(2);
    } else if (op === 'DIV') {
      newTotal = entered !== 0 ? +(currentBase / entered).toFixed(2) : currentBase;
      diffVal = +(newTotal - currentBase).toFixed(2);
    }

    const opSymbol = op === 'ADD' ? '+' : op === 'SUB' ? '−' : op === 'MUL' ? '×' : '÷';
    setTapeItems(prev => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        type: op,
        label: 'Add label...',
        value: entered,
        runningTotal: newTotal,
        diff: diffVal
      }
    ]);
    logToHistory(`Calculated ${opSymbol} ${entered}`, newTotal, `${currencyRates[calcCurrency]?.symbol || '₹'}${currentBase} ${opSymbol} ${entered} = ${currencyRates[calcCurrency]?.symbol || '₹'}${newTotal}`);
    setCalcDisplay('0');
  };

  const handleClearTape = () => {
    // Trash icon in top bar clears the active working tape only without wiping the History logs
    setTapeItems([]);
    setCalcDisplay('0');
    setCalcFormula('');
  };

  const handleShareTape = () => {
    const symbol = currencyRates[calcCurrency]?.symbol || '₹';
    const total = getRunningTotal();
    const lines = tapeItems.map(item => {
      if (item.type === 'DISCOUNT') return `• Discount ${item.percent}%: -${symbol}${Math.abs(item.diff || 0)} (Total: ${symbol}${item.runningTotal})`;
      if (item.type === 'GST') return `• GST ${item.percent}%: +${symbol}${item.diff || 0} (Total: ${symbol}${item.runningTotal})`;
      if (item.type === 'BASE') return `• Base Amount: ${symbol}${item.value}`;
      return `• + ${item.value} = ${symbol}${item.runningTotal}`;
    });

    const shareText = `*BETA CALC SUMMARY*\n` + lines.join('\n') + `\n*TOTAL: ${symbol}${total}*\n(Calculated via SART Beta Calc)`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShareAlert(true);
      setTimeout(() => setCopiedShareAlert(false), 2500);
    }
  };

  const handleAddCompareItem = () => {
    const vA = parseFloat(cmpInputValA) || 0;
    const vB = parseFloat(cmpInputValB) || 0;
    if (cmpInputDesc.trim() || vA || vB) {
      setCompareItems(prev => [
        ...prev,
        {
          id: `cmp-${Date.now()}`,
          desc: cmpInputDesc.trim() || `Item ${prev.length + 1}`,
          valA: vA,
          valB: vB
        }
      ]);
      setCmpInputDesc('');
      setCmpInputValA('');
      setCmpInputValB('');
    }
  };

  const handleCalcClick = (val: string) => {
    if (val === 'C' || val === 'AC') {
      // Clear All: clears everything (display, tape items, formula)
      setCalcDisplay('0');
      setCalcFormula('');
      setTapeItems([]);
    } else if (val === 'backspace') {
      if (calcDisplay.length <= 1) setCalcDisplay('0');
      else setCalcDisplay(calcDisplay.slice(0, -1));
    } else if (val === '=') {
      const num = parseFloat(calcDisplay);
      if (!isNaN(num) && num !== 0) {
        if (pendingOp === '+') handleApplyOperation('ADD');
        else if (pendingOp === '-') handleApplyOperation('SUB');
        else if (pendingOp === '×') handleApplyOperation('MUL');
        else if (pendingOp === '÷') handleApplyOperation('DIV');
      }
    } else if (['+', '-', 'x', '÷'].includes(val)) {
      const num = parseFloat(calcDisplay);
      const symbolMap: Record<string, '+' | '-' | '×' | '÷'> = { '+': '+', '-': '-', 'x': '×', '÷': '÷' };
      const opToApply: Record<string, 'ADD' | 'SUB' | 'MUL' | 'DIV'> = { '+': 'ADD', '-': 'SUB', 'x': 'MUL', '÷': 'DIV' };

      if (!isNaN(num) && num !== 0) {
        if (tapeItems.length === 0) {
          // Commit base amount first
          setTapeItems([
            {
              id: `t-${Date.now()}`,
              type: 'BASE',
              label: 'Base Amount',
              value: num,
              runningTotal: num
            }
          ]);
        } else {
          // Commit previous pending operation with the current number
          const prevOpType = pendingOp === '+' ? 'ADD' : pendingOp === '-' ? 'SUB' : pendingOp === '×' ? 'MUL' : 'DIV';
          handleApplyOperation(prevOpType);
        }
      }
      // Update pending operator without showing 0 or replacing the current typed number until next digit
      setPendingOp(symbolMap[val] || '+');
      setCalcDisplay(''); // Clear for next number entry
    } else {
      if (calcDisplay === '0' && !['.', '+', '-', '*', '/', 'x', '÷'].includes(val)) {
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
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="none">
            {/* Outline calendar matching 1st image icon */}
            <rect x="3.5" y="4" width="17" height="16.5" rx="4.5" stroke="#ea580c" strokeWidth="2.4" fill="none"></rect>
            <path d="M7 2.5v3" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round"></path>
            <path d="M17 2.5v3" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round"></path>
            <path d="M3.5 9h17" stroke="#ea580c" strokeWidth="2.2" strokeLinecap="round"></path>
          </svg>
        );
      case 'calculator':
        return (
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="none">
            {/* Outer calculator body matching the first image icon */}
            <rect x="3.5" y="2.5" width="17" height="19" rx="4.5" stroke="#059669" strokeWidth="2.4" fill="none"></rect>
            {/* Screen bar */}
            <rect x="6.5" y="5.5" width="11" height="2" rx="1" fill="#059669"></rect>
            {/* Row 1 dots */}
            <circle cx="7.5" cy="11" r="1.3" fill="#059669"></circle>
            <circle cx="12" cy="11" r="1.3" fill="#059669"></circle>
            <circle cx="16.5" cy="11" r="1.3" fill="#059669"></circle>
            {/* Row 2 dots */}
            <circle cx="7.5" cy="14.5" r="1.3" fill="#059669"></circle>
            <circle cx="12" cy="14.5" r="1.3" fill="#059669"></circle>
            {/* Tall action key */}
            <rect x="15.2" y="13.5" width="2.6" height="5.5" rx="1.3" fill="#059669"></rect>
            {/* Row 3 dots */}
            <circle cx="7.5" cy="18" r="1.3" fill="#059669"></circle>
            <circle cx="12" cy="18" r="1.3" fill="#059669"></circle>
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
          <svg className="w-5 h-5 object-contain" viewBox="0 0 24 24" fill="none">
            {/* Outer notepad/document frame matching user image */}
            <rect x="4" y="2.5" width="16" height="19" rx="4.5" stroke="#eab308" strokeWidth="2.4" fill="none"></rect>
            {/* Diagonal pencil inside notepad */}
            <path
              d="M14.8 7.2l2 2-6.2 6.2c-.3.3-.7.5-1.1.6l-2 .5.5-2c.1-.4.3-.8.6-1.1l6.2-6.2z"
              stroke="#eab308"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#eab308"
            ></path>
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
        <div className="user-side-dock-panel bnx-cal-panel flex flex-col h-full bg-white text-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <h3 className="font-bold text-base text-slate-900">Calendar</h3>
            <button
              className="p-1 hover:bg-black/5 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              onClick={closeModal}
              title="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="p-4 flex-1 flex flex-col min-h-0 overflow-y-auto">
            {/* Month Header with Right Aligned Arrows matching inspector: flex items-center justify-between mb-4 */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-sm text-slate-900">
                {currentMonthName} {currentYear}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors text-slate-600"
                  onClick={handlePrevMonth}
                  title="Previous Month"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors text-slate-600"
                  onClick={handleNextMonth}
                  title="Next Month"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            {/* Weekday headers: Su in Red, others standard */}
            <div className="grid grid-cols-7 gap-1 text-[11px] text-center font-bold mb-2">
              <span className="text-red-500 font-extrabold">Su</span>
              <span className="opacity-60 text-slate-700">Mo</span>
              <span className="opacity-60 text-slate-700">Tu</span>
              <span className="opacity-60 text-slate-700">We</span>
              <span className="opacity-60 text-slate-700">Th</span>
              <span className="opacity-60 text-slate-700">Fr</span>
              <span className="opacity-60 text-slate-700">Sa</span>
            </div>

            {/* Days Matrix: Sunday marked as red, exact today highlighted with subtle circle, selected day filled golden amber */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-6 min-h-[140px]">
              {Array.from({ length: firstDayWeekday }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-8 flex items-center justify-center"></div>
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const isSelected = selectedDay === day;
                const dayWeekday = (firstDayWeekday + day - 1) % 7;
                const isSunday = dayWeekday === 0;
                const isToday =
                  day === today.getDate() &&
                  currentMonthIdx === today.getMonth() &&
                  currentYear === today.getFullYear();

                return (
                  <button
                    key={day}
                    type="button"
                    className={`h-8 w-8 mx-auto flex items-center justify-center rounded-xl font-medium transition-all cursor-pointer ${isSelected
                      ? 'bg-[#eab308] text-white font-bold shadow-md shadow-yellow-500/30'
                      : isToday
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : isSunday
                          ? 'text-red-500 font-bold hover:bg-red-50'
                          : 'text-slate-800 hover:bg-black/5'
                      }`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Schedule Section */}
            <div className="flex-1 flex flex-col min-h-0 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  {currentMonthName} {selectedDay} Schedule
                </span>
                <button
                  type="button"
                  className="text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors"
                  onClick={() => setShowAddCalendarItem(true)}
                >
                  + Add
                </button>
              </div>

              {/* Empty or List items */}
              {calendarItems.filter(item => item.day === selectedDay && item.month === currentMonthIdx && item.year === currentYear).length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium py-6">
                  No items scheduled
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-[160px] pr-1">
                  {calendarItems
                    .filter(item => item.day === selectedDay && item.month === currentMonthIdx && item.year === currentYear)
                    .map((it, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl flex flex-col gap-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-[13px]">{it.title}</span>
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${it.type === 'Note' ? 'bg-amber-100 text-amber-800' : it.type === 'Reminder' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                            {it.type}
                          </span>
                        </div>
                        {it.time && (
                          <div className="text-[11px] text-slate-500 font-medium">
                            🕒 Time: {it.time}
                          </div>
                        )}
                        {it.startTime && !it.time && (
                          <div className="text-[11px] text-slate-500 font-medium">
                            🕒 {it.startTime} - {it.endTime}
                          </div>
                        )}
                        {it.desc && (
                          <div className="text-[11.5px] text-slate-600 mt-0.5 whitespace-pre-wrap">
                            {it.desc}
                          </div>
                        )}
                        {it.email && (
                          <div className="text-[11px] text-blue-600 font-medium mt-0.5">
                            ✉️ {it.email}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM SHEET: Add Item for [Day] [Month] (Matching exact inspector classes) */}
          {showAddCalendarItem && (
            <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex flex-col justify-end">
              <div className="relative bg-white dark:bg-gray-900 flex flex-col rounded-t-2xl p-4 max-h-[85%] overflow-y-auto hidden-scrollbar shadow-2xl pointer-events-auto border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom duration-200">
                {/* Header: Add Item for [Day] [Month] + Close */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Add Item for {selectedDay} {currentMonthName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddCalendarItem(false)}
                    className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                {/* Switcher Pill: Event | Note | Reminder */}
                <div className="flex gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-lg mb-4 text-xs shrink-0">
                  {(['Event', 'Note', 'Reminder'] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setCalendarItemType(tab)}
                      className={`flex-1 py-1 rounded text-center font-semibold transition-colors ${calendarItemType === tab
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <form
                  className="flex flex-col gap-3 text-xs flex-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const titleToSave = calendarItemType === 'Note' ? (calItemDesc.trim().slice(0, 30) || 'Note') : calItemTitle.trim();
                    if (titleToSave || calItemDesc.trim()) {
                      setCalendarItems(prev => [...prev, {
                        day: selectedDay,
                        month: currentMonthIdx,
                        year: currentYear,
                        type: calendarItemType,
                        title: titleToSave,
                        time: (calendarItemType === 'Note' || calendarItemType === 'Reminder') ? calItemTime : undefined,
                        startTime: calendarItemType === 'Event' ? calItemStartTime : undefined,
                        endTime: calendarItemType === 'Event' ? calItemEndTime : undefined,
                        desc: calItemDesc.trim(),
                        email: calendarItemType === 'Reminder' ? calItemEmail.trim() : undefined
                      }]);
                      setCalItemTitle('');
                      setCalItemDesc('');
                      setCalItemEmail('');
                    }
                    setShowAddCalendarItem(false);
                  }}
                >
                  {/* Note: Only Time and Content (Description) */}
                  {calendarItemType === 'Note' && (
                    <>
                      <div>
                        <label className="block mb-1 opacity-70 font-semibold">Time</label>
                        <input
                          type="time"
                          required
                          value={calItemTime}
                          onChange={(e) => setCalItemTime(e.target.value)}
                          className="w-full bg-black/5 dark:bg-white/5 p-2 rounded outline-none border border-transparent focus:border-gray-300 dark:focus:border-gray-600"
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <label className="block mb-1 opacity-70 font-semibold">Content (Note)</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Write your note content here..."
                          value={calItemDesc}
                          onChange={(e) => setCalItemDesc(e.target.value)}
                          className="w-full flex-1 bg-black/5 dark:bg-white/5 p-2 rounded outline-none border border-transparent focus:border-gray-300 dark:focus:border-gray-600 resize-none min-h-[90px]"
                        />
                      </div>
                    </>
                  )}

                  {/* Reminder: Title, Description, Time, Email */}
                  {calendarItemType === 'Reminder' && (
                    <>
                      <div>
                        <label className="block mb-1 opacity-70 font-semibold">Title</label>
                        <input
                          type="text"
                          required
                          placeholder="Reminder Title"
                          value={calItemTitle}
                          onChange={(e) => setCalItemTitle(e.target.value)}
                          className="w-full bg-black/5 dark:bg-white/5 p-2 rounded outline-none border border-transparent focus:border-gray-300 dark:focus:border-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 opacity-70 font-semibold">Time</label>
                        <input
                          type="time"
                          required
                          value={calItemTime}
                          onChange={(e) => setCalItemTime(e.target.value)}
                          className="w-full bg-black/5 dark:bg-white/5 p-2 rounded outline-none border border-transparent focus:border-gray-300 dark:focus:border-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 opacity-70 font-semibold">Email for Notification</label>
                        <input
                          type="email"
                          required
                          placeholder="example@gmail.com"
                          value={calItemEmail}
                          onChange={(e) => setCalItemEmail(e.target.value)}
                          className="w-full bg-black/5 dark:bg-white/5 p-2 rounded outline-none border border-transparent focus:border-gray-300 dark:focus:border-gray-600"
                        />
                      </div>

                      <div className="flex-1 flex flex-col">
                        <label className="block mb-1 opacity-70 font-semibold">Description</label>
                        <textarea
                          rows={2}
                          placeholder="Reminder description..."
                          value={calItemDesc}
                          onChange={(e) => setCalItemDesc(e.target.value)}
                          className="w-full flex-1 bg-black/5 dark:bg-white/5 p-2 rounded outline-none border border-transparent focus:border-gray-300 dark:focus:border-gray-600 resize-none min-h-[60px]"
                        />
                      </div>
                    </>
                  )}

                  {/* Event: Title, Start Time, End Time, Description */}
                  {calendarItemType === 'Event' && (
                    <>
                      <div>
                        <label className="block mb-1 opacity-70 font-semibold">Title</label>
                        <input
                          type="text"
                          required
                          placeholder="Event Title"
                          value={calItemTitle}
                          onChange={(e) => setCalItemTitle(e.target.value)}
                          className="w-full bg-black/5 dark:bg-white/5 p-2 rounded outline-none border border-transparent focus:border-gray-300 dark:focus:border-gray-600"
                        />
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block mb-1 opacity-70 font-semibold">Start Time</label>
                          <input
                            type="time"
                            required
                            value={calItemStartTime}
                            onChange={(e) => setCalItemStartTime(e.target.value)}
                            className="w-full bg-black/5 dark:bg-white/5 p-2 rounded outline-none border border-transparent focus:border-gray-300 dark:focus:border-gray-600"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block mb-1 opacity-70 font-semibold">End Time</label>
                          <input
                            type="time"
                            required
                            value={calItemEndTime}
                            onChange={(e) => setCalItemEndTime(e.target.value)}
                            className="w-full bg-black/5 dark:bg-white/5 p-2 rounded outline-none border border-transparent focus:border-gray-300 dark:focus:border-gray-600"
                          />
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col">
                        <label className="block mb-1 opacity-70 font-semibold">Description</label>
                        <textarea
                          rows={2}
                          placeholder="Event details..."
                          value={calItemDesc}
                          onChange={(e) => setCalItemDesc(e.target.value)}
                          className="w-full flex-1 bg-black/5 dark:bg-white/5 p-2 rounded outline-none border border-transparent focus:border-gray-300 dark:focus:border-gray-600 resize-none min-h-[60px]"
                        />
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="mt-2 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded shadow-sm disabled:opacity-50 transition-colors"
                  >
                    Save Item
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DRAWER 3: CALCULATOR (Exact Match to Inspector Classes & Uploaded UI) */}
      {activeModal === 'calculator' && (
        <div className="user-side-dock-panel flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl relative">
          {/* Top Panel Header */}
          <div className="px-4 h-14 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-black/[0.01] dark:bg-white/[0.01] shrink-0">
            <span className="font-bold text-sm tracking-wide text-slate-800 dark:text-slate-100">Calculator</span>
            <button
              className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              onClick={closeModal}
              title="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-0 relative">
            <div className="h-full w-full overflow-hidden flex flex-col relative min-h-[520px]">
              <div className="flex flex-col h-full bg-white dark:bg-gray-900">
                {/* Beta Calc Title & Action Buttons Row matching uploaded Image 3 */}
                <div className="flex items-center justify-between p-2.5 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-gray-100 tracking-wide text-xs">
                    <span className="text-emerald-500 font-black">#</span>
                    <span>BETA CALC</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500">
                    {/* History button */}
                    <button
                      type="button"
                      onClick={() => setShowHistoryModal(prev => !prev)}
                      className={`p-1.5 rounded-lg transition-colors ${showHistoryModal ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                      title="Tape History"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                        <path d="M3 3v5h5"></path>
                        <path d="M12 7v5l4 2"></path>
                      </svg>
                    </button>

                    {/* Share button */}
                    <button
                      type="button"
                      onClick={handleShareTape}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Share Tape"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                      </svg>
                    </button>

                    {/* Trash/Clear Tape button */}
                    <button
                      type="button"
                      onClick={handleClearTape}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-lg transition-colors"
                      title="Clear Tape"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" x2="10" y1="11" y2="17"></line>
                        <line x1="14" x2="14" y1="11" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Copied alert toast */}
                {copiedShareAlert && (
                  <div className="bg-emerald-600 text-white text-[11px] font-bold text-center py-1 animate-in fade-in">
                    ✓ Full Calculation Summary Copied to Clipboard!
                  </div>
                )}

                {/* Tape Content Container / Cards Stack matching Image 2 & 3 */}
                {!showCompareMode ? (
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-gray-50/50 dark:bg-gray-900/50 hidden-scrollbar max-h-[220px]">
                    {tapeItems.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-40 py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                          <path d="M3 3v5h5"></path>
                          <path d="M12 7v5l4 2"></path>
                        </svg>
                        <p className="text-xs">Enter numbers and select GST / Discount / Operations</p>
                      </div>
                    ) : (
                      tapeItems.map((item) => {
                        const curSymbol = currencyRates[calcCurrency]?.symbol || '₹';
                        const curRate = currencyRates[calcCurrency]?.rate || 1;
                        const dispTotal = (item.runningTotal * curRate).toFixed(2);
                        const dispDiff = item.diff !== undefined ? (item.diff * curRate).toFixed(2) : undefined;

                        return (
                          <div
                            key={item.id}
                            className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs relative flex flex-col gap-1 text-xs"
                          >
                            {/* Top badge & label & close button */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                {item.type === 'BASE' && (
                                  <span className="bg-indigo-600 text-white font-black text-[9.5px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    BASE
                                  </span>
                                )}
                                {item.type === 'DISCOUNT' && (
                                  <span className="bg-amber-500 text-white font-black text-[9.5px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    DISCOUNT
                                  </span>
                                )}
                                {item.type === 'GST' && (
                                  <span className="bg-emerald-500 text-white font-black text-[9.5px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    GST
                                  </span>
                                )}
                                {['ADD', 'SUB', 'MUL', 'DIV'].includes(item.type) && (
                                  <span className="bg-slate-600 text-white font-black text-[10px] w-5 h-5 rounded-md flex items-center justify-center">
                                    {item.type === 'ADD' ? '+' : item.type === 'SUB' ? '−' : item.type === 'MUL' ? '×' : '÷'}
                                  </span>
                                )}
                                <span className="font-semibold text-slate-500 text-[11px]">{item.label}</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => setTapeItems(prev => prev.filter(t => t.id !== item.id))}
                                className="text-slate-300 hover:text-red-500 transition-colors text-xs font-bold"
                              >
                                ×
                              </button>
                            </div>

                            {/* Middle & Right: Input value & Running Total */}
                            <div className="flex items-center justify-between mt-1">
                              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1">
                                {item.type === 'BASE' && <span>= {item.value}</span>}
                                {item.type === 'DISCOUNT' && <span>% {item.percent}</span>}
                                {item.type === 'GST' && <span>% {item.percent}</span>}
                                {item.type === 'ADD' && <span>+ {item.value}</span>}
                                {item.type === 'SUB' && <span>− {item.value}</span>}
                                {item.type === 'MUL' && <span>× {item.value}</span>}
                                {item.type === 'DIV' && <span>÷ {item.value}</span>}
                              </div>

                              <div className="text-right">
                                <div className="font-extrabold text-emerald-600 text-sm">
                                  {curSymbol}{dispTotal}
                                </div>
                                {dispDiff && (
                                  <div className={`text-[10px] font-bold ${parseFloat(dispDiff) < 0 ? 'text-amber-600' : 'text-emerald-500'}`}>
                                    {parseFloat(dispDiff) < 0 ? `${curSymbol}${dispDiff}` : `+${curSymbol}${dispDiff}`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  /* PRICE COMPARISON MODE (Matching Image 1) */
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/70 border-b border-gray-200">
                    <div className="flex items-center justify-between pb-1.5 border-b border-indigo-100">
                      <div className="flex items-center gap-1.5 text-indigo-700 font-extrabold text-[11px] tracking-wider uppercase">
                        <span>⚖️ PRICE COMPARISON</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCompareItems([])}
                          className="text-[10px] font-bold text-red-500 hover:underline uppercase"
                        >
                          CLEAR ALL
                        </button>
                        <span className="bg-red-50 border border-red-200 text-red-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                          {compareItems.reduce((acc, c) => acc + c.valB, 0) > compareItems.reduce((acc, c) => acc + c.valA, 0) ? 'B Wins ▲' : 'A Wins ▲'}
                        </span>
                      </div>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-12 text-[10px] font-bold text-slate-500 uppercase px-1 pt-1">
                      <span className="col-span-6">Description</span>
                      <span className="col-span-3 text-right text-indigo-600 font-bold">Side A</span>
                      <span className="col-span-3 text-right text-indigo-600 font-bold">Side B</span>
                    </div>

                    {/* Compare Rows */}
                    <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-0.5">
                      {compareItems.map((ci) => (
                        <div key={ci.id} className="grid grid-cols-12 text-xs font-semibold items-center bg-white p-2 rounded-xl border border-slate-200/80">
                          <span className="col-span-6 text-slate-800 truncate">{ci.desc}</span>
                          <span className="col-span-3 text-right font-bold text-indigo-600">₹{ci.valA}</span>
                          <span className="col-span-3 text-right font-bold text-indigo-600 flex items-center justify-end gap-1">
                            ₹{ci.valB}
                            <button
                              type="button"
                              onClick={() => setCompareItems(prev => prev.filter(c => c.id !== ci.id))}
                              className="text-slate-300 hover:text-red-500 text-[10px] ml-1"
                            >
                              ×
                            </button>
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total Row */}
                    <div className="grid grid-cols-12 text-xs font-black pt-1.5 border-t border-slate-200 border-dashed px-1">
                      <span className="col-span-6 uppercase text-slate-600 text-[11px]">TOTAL</span>
                      <span className="col-span-3 text-right text-indigo-600">
                        ₹{compareItems.reduce((acc, c) => acc + c.valA, 0)}
                      </span>
                      <span className="col-span-3 text-right text-indigo-600">
                        ₹{compareItems.reduce((acc, c) => acc + c.valB, 0)}
                      </span>
                    </div>

                    {/* Add Compare Inputs */}
                    <div className="grid grid-cols-12 gap-1 pt-1">
                      <input
                        type="text"
                        placeholder="Description"
                        value={cmpInputDesc}
                        onChange={(e) => setCmpInputDesc(e.target.value)}
                        className="col-span-5 bg-white border border-slate-300 rounded-lg p-1.5 text-xs outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Val A"
                        value={cmpInputValA}
                        onChange={(e) => setCmpInputValA(e.target.value)}
                        className="col-span-3 bg-white border border-slate-300 rounded-lg p-1.5 text-xs outline-none text-right"
                      />
                      <input
                        type="number"
                        placeholder="Val B"
                        value={cmpInputValB}
                        onChange={(e) => setCmpInputValB(e.target.value)}
                        className="col-span-3 bg-white border border-slate-300 rounded-lg p-1.5 text-xs outline-none text-right"
                      />
                      <button
                        type="button"
                        onClick={handleAddCompareItem}
                        className="col-span-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Diff & Ratio Footer Pills */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-white border border-slate-200 rounded-xl p-1.5 text-center text-[11px] font-bold text-slate-600">
                        Diff <span className="text-indigo-600 font-extrabold">₹{Math.abs(compareItems.reduce((acc, c) => acc + c.valA, 0) - compareItems.reduce((acc, c) => acc + c.valB, 0))}</span>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-1.5 text-center text-[11px] font-bold text-slate-600">
                        Ratio <span className="text-indigo-600 font-extrabold">{compareItems.reduce((acc, c) => acc + c.valB, 0) > 0 ? (compareItems.reduce((acc, c) => acc + c.valA, 0) / compareItems.reduce((acc, c) => acc + c.valB, 0)).toFixed(2) : '1.00'}x</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTINUE Input Screen: CONTINUE label + current operator (+, -, ×, ÷) + large number display (shows typed digits, never forces 0) */}
                <div className="bg-gray-100/60 dark:bg-gray-800 py-1.5 px-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">CONTINUE</div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-extrabold text-sm">{pendingOp}</span>
                    <div className="text-xl font-black text-right text-slate-900 dark:text-white truncate">
                      {calcDisplay !== '' ? calcDisplay : (tapeItems.length > 0 ? '' : '0')}
                    </div>
                  </div>
                </div>

                {/* Quick Action Preset Pills: % GST | Discount | Currency/Region | Compare */}
                <div className="grid grid-cols-4 gap-1.5 p-1.5 border-t border-gray-100 dark:border-gray-800 relative bg-white">
                  {/* 1. GST Dropdown Pill (Opens only when clicked, 4 columns inside or custom input) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveCalcDropdown(prev => prev === 'gst' ? null : 'gst')}
                      className={`w-full flex items-center justify-center gap-1 py-1.5 px-1 text-xs font-bold rounded-xl border transition-colors ${activeCalcDropdown === 'gst'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                        }`}
                    >
                      <span>%</span>
                      <span>GST</span>
                    </button>
                    {activeCalcDropdown === 'gst' && (
                      <div className="absolute bottom-full left-[-4px] mb-1.5 w-[288px] bg-white border border-emerald-300 rounded-2xl shadow-xl px-3.5 py-2.5 z-30 animate-in fade-in flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">SELECT GST</span>
                          <button
                            type="button"
                            onClick={() => setActiveCalcDropdown(null)}
                            className="text-slate-400 hover:text-slate-700 text-xs font-bold leading-none p-0.5"
                          >
                            ✕
                          </button>
                        </div>

                        {/* All elements neatly contained without overflowing on the right */}
                        <div className="flex items-center gap-1.5">
                          {[5, 12, 18, 28].map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => handleApplyGst(p)}
                              className="px-2 py-1 text-center text-[11px] font-black text-emerald-800 bg-emerald-50/90 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors shrink-0"
                            >
                              +{p}%
                            </button>
                          ))}

                          {/* Compact % input */}
                          <input
                            type="number"
                            placeholder="%"
                            value={customGstInput}
                            onChange={(e) => setCustomGstInput(e.target.value)}
                            className="w-8 h-6 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs font-bold outline-none text-slate-700 placeholder:text-slate-400 shrink-0"
                          />

                          {/* Compact Add button */}
                          <button
                            type="button"
                            onClick={() => {
                              const val = parseFloat(customGstInput);
                              if (!isNaN(val) && val > 0) handleApplyGst(val);
                            }}
                            className="h-6 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black rounded-lg transition-colors shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Discount Dropdown Pill (Shifted left so it doesn't overflow right) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveCalcDropdown(prev => prev === 'discount' ? null : 'discount')}
                      className={`w-full flex items-center justify-center gap-1 py-1.5 px-1 text-xs font-bold rounded-xl border transition-colors ${activeCalcDropdown === 'discount'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100'
                        }`}
                    >
                      <span>🏷️</span>
                      <span>Discount</span>
                    </button>
                    {activeCalcDropdown === 'discount' && (
                      <div className="absolute bottom-full left-[-72px] mb-1.5 w-[288px] bg-white border border-amber-300 rounded-2xl shadow-xl px-3.5 py-2.5 z-30 animate-in fade-in flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">SELECT DISCOUNT</span>
                          <button
                            type="button"
                            onClick={() => setActiveCalcDropdown(null)}
                            className="text-slate-400 hover:text-slate-700 text-xs font-bold leading-none p-0.5"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Identical layout matching GST */}
                        <div className="flex items-center gap-1.5">
                          {[5, 10, 15, 20].map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => handleApplyDiscount(p)}
                              className="px-2 py-1 text-center text-[11px] font-black text-amber-800 bg-amber-50/90 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors shrink-0"
                            >
                              −{p}%
                            </button>
                          ))}

                          {/* Compact % input */}
                          <input
                            type="number"
                            placeholder="%"
                            value={customDiscountInput}
                            onChange={(e) => setCustomDiscountInput(e.target.value)}
                            className="w-8 h-6 bg-slate-50 border border-slate-200 rounded-lg text-center text-xs font-bold outline-none text-slate-700 placeholder:text-slate-400 shrink-0"
                          />

                          {/* Compact Add button */}
                          <button
                            type="button"
                            onClick={() => {
                              const val = parseFloat(customDiscountInput);
                              if (!isNaN(val) && val > 0) handleApplyDiscount(val);
                            }}
                            className="h-6 px-2 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-black rounded-lg transition-colors shrink-0"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. Currency / Region Dropdown Pill (Opens only when clicked) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveCalcDropdown(prev => prev === 'region' ? null : 'region')}
                      className={`w-full flex items-center justify-center gap-1 py-1.5 px-1 text-xs font-bold rounded-xl border transition-colors ${activeCalcDropdown === 'region'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                        }`}
                    >
                      <span>🌐</span>
                      <span>{calcCurrency}</span>
                    </button>
                    {activeCalcDropdown === 'region' && (
                      <div className="absolute bottom-full right-0 mb-1 w-44 bg-white border border-indigo-300 rounded-2xl shadow-2xl p-2 z-30 animate-in fade-in flex flex-col gap-1">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">SELECT REGION</span>
                          <button
                            type="button"
                            onClick={() => setActiveCalcDropdown(null)}
                            className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                          >
                            ✕
                          </button>
                        </div>

                        {(['INR', 'USD', 'EUR'] as const).map(cur => (
                          <button
                            key={cur}
                            type="button"
                            onClick={() => {
                              setCalcCurrency(cur);
                              setActiveCalcDropdown(null);
                            }}
                            className={`text-left px-2 py-1.5 text-xs font-extrabold rounded-xl transition-colors flex justify-between items-center ${calcCurrency === cur ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-indigo-50'
                              }`}
                          >
                            <span>{cur}</span>
                            <span className="text-[11px] opacity-80">{currencyRates[cur]?.symbol}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. Compare Toggle Pill */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCalcDropdown(null);
                      setShowCompareMode(prev => !prev);
                    }}
                    className={`flex items-center justify-center gap-1 py-1.5 px-1 text-xs font-bold rounded-xl border transition-colors ${showCompareMode ? 'bg-indigo-600 text-white border-indigo-600' : 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100'
                      }`}
                  >
                    <span>⇅</span>
                    <span>Compare</span>
                  </button>
                </div>

                {/* Keypad Grid matching Image 1 layout */}
                <div className="grid grid-cols-4 gap-1 p-2 bg-slate-50/70 border-t border-gray-100">
                  {/* Row 1: Clear, Backspace, Divide, Multiply */}
                  <button
                    type="button"
                    onClick={() => handleCalcClick('AC')}
                    className="h-10 rounded-xl text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                      <path d="M3 3v5h5"></path>
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCalcClick('backspace')}
                    className="h-10 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center"
                  >
                    ⌫
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCalcClick('÷')}
                    className="h-10 rounded-xl text-sm font-black text-emerald-600 bg-emerald-50/80 hover:bg-emerald-100 transition-colors flex items-center justify-center"
                  >
                    /
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCalcClick('x')}
                    className="h-10 rounded-xl text-sm font-black text-emerald-600 bg-emerald-50/80 hover:bg-emerald-100 transition-colors flex items-center justify-center"
                  >
                    x
                  </button>

                  {/* Row 2: 7 8 9 - */}
                  <button type="button" onClick={() => handleCalcClick('7')} className="h-10 rounded-xl text-sm font-bold text-slate-800 bg-white shadow-xs hover:bg-slate-100 transition-colors">7</button>
                  <button type="button" onClick={() => handleCalcClick('8')} className="h-10 rounded-xl text-sm font-bold text-slate-800 bg-white shadow-xs hover:bg-slate-100 transition-colors">8</button>
                  <button type="button" onClick={() => handleCalcClick('9')} className="h-10 rounded-xl text-sm font-bold text-slate-800 bg-white shadow-xs hover:bg-slate-100 transition-colors">9</button>
                  <button type="button" onClick={() => handleCalcClick('-')} className="h-10 rounded-xl text-base font-black text-emerald-600 bg-emerald-50/80 hover:bg-emerald-100 transition-colors">−</button>

                  {/* Row 3: 4 5 6 + */}
                  <button type="button" onClick={() => handleCalcClick('4')} className="h-10 rounded-xl text-sm font-bold text-slate-800 bg-white shadow-xs hover:bg-slate-100 transition-colors">4</button>
                  <button type="button" onClick={() => handleCalcClick('5')} className="h-10 rounded-xl text-sm font-bold text-slate-800 bg-white shadow-xs hover:bg-slate-100 transition-colors">5</button>
                  <button type="button" onClick={() => handleCalcClick('6')} className="h-10 rounded-xl text-sm font-bold text-slate-800 bg-white shadow-xs hover:bg-slate-100 transition-colors">6</button>
                  <button type="button" onClick={() => handleCalcClick('+')} className="h-10 rounded-xl text-base font-black text-emerald-600 bg-emerald-50/80 hover:bg-emerald-100 transition-colors">+</button>

                  {/* Row 4: 1 2 3 = */}
                  <button type="button" onClick={() => handleCalcClick('1')} className="h-10 rounded-xl text-sm font-bold text-slate-800 bg-white shadow-xs hover:bg-slate-100 transition-colors">1</button>
                  <button type="button" onClick={() => handleCalcClick('2')} className="h-10 rounded-xl text-sm font-bold text-slate-800 bg-white shadow-xs hover:bg-slate-100 transition-colors">2</button>
                  <button type="button" onClick={() => handleCalcClick('3')} className="h-10 rounded-xl text-sm font-bold text-slate-800 bg-white shadow-xs hover:bg-slate-100 transition-colors">3</button>

                  <button
                    type="button"
                    rowSpan={2}
                    onClick={() => handleCalcClick('=')}
                    className="row-span-2 rounded-xl text-xl font-black text-white bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/30 transition-all flex items-center justify-center cursor-pointer"
                  >
                    =
                  </button>

                  {/* Row 5: SCI 0 . */}
                  <button type="button" className="h-10 rounded-xl text-[11px] font-bold text-slate-500 bg-white shadow-xs hover:bg-slate-100 transition-colors">SCI</button>
                  <button type="button" onClick={() => handleCalcClick('0')} className="h-10 rounded-xl text-sm font-bold text-slate-800 bg-white shadow-xs hover:bg-slate-100 transition-colors">0</button>
                  <button type="button" onClick={() => handleCalcClick('.')} className="h-10 rounded-xl text-sm font-bold text-slate-800 bg-white shadow-xs hover:bg-slate-100 transition-colors">.</button>
                </div>

                {/* Bottom Currency Comparison & Conversion Footer matching Image 1 & 3 */}
                <div className="bg-slate-900 text-white p-3 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      TOTAL (SIMULATED {calcCurrency})
                    </div>
                    <div className="text-lg font-black text-emerald-400 tracking-tight">
                      {currencyRates[calcCurrency]?.symbol}
                      {(getRunningTotal() * (currencyRates[calcCurrency]?.rate || 1)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Base Value (INR)
                    </div>
                    <div className="text-xs font-bold text-slate-200">
                      ₹{getRunningTotal().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* History Drawer Modal */}
                {showHistoryModal && (
                  <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-xs flex flex-col justify-end">
                    <div className="bg-white dark:bg-gray-900 rounded-t-2xl p-4 max-h-[75%] overflow-y-auto shadow-2xl flex flex-col">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          🕒 Calculator History
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setCalcHistory([])}
                            className="text-[10px] font-bold text-red-500 hover:underline uppercase"
                          >
                            Clear
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowHistoryModal(false)}
                            className="p-1 text-slate-400 hover:text-slate-700"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {calcHistory.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400 font-medium">
                          No saved calculation history yet. Calculations will appear here as you calculate.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {calcHistory.map(h => (
                            <div key={h.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-col gap-1">
                              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                                <span>{h.timestamp}</span>
                                <span className="font-extrabold text-emerald-600 text-xs">
                                  {currencyRates[h.currency]?.symbol || '₹'}{h.total.toFixed(2)}
                                </span>
                              </div>
                              <div className="text-slate-700 font-medium text-[11.5px]">
                                {h.summary || (h.tape && h.tape.map(t => `${t.label}: ${t.runningTotal}`).join(' → '))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
                onClick={() => {
                  setEditingContactId(null);
                  setContactFullName('');
                  setContactEmail('');
                  setContactPhone('');
                  setContactRole('');
                  setShowAddContact(true);
                }}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {contactsList
                  .filter(c => c.fullName.toLowerCase().includes(contactSearch.toLowerCase()) || c.email.toLowerCase().includes(contactSearch.toLowerCase()))
                  .map(c => (
                    <div
                      key={c.id}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #edf2f7',
                        borderRadius: '20px',
                        padding: '16px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        position: 'relative',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
                      }}
                    >
                      {/* Top Row: Name on Left, Badge & Edit Pencil on Right */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                          {c.fullName}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              background: '#eff6ff',
                              color: '#2563eb',
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '4px 10px',
                              borderRadius: '14px',
                              letterSpacing: '0.4px',
                              textTransform: 'uppercase'
                            }}
                          >
                            {c.role || 'BNX MAIL'}
                          </span>

                          <button
                            type="button"
                            title="Edit Contact"
                            onClick={() => {
                              setEditingContactId(c.id);
                              setContactFullName(c.fullName);
                              setContactEmail(c.email);
                              setContactPhone(c.phone || '');
                              setContactRole(c.role || '');
                              setShowAddContact(true);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'color 0.15s ease'
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#2563eb')}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#94a3b8')}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Detail 1: Email Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '13.5px', marginTop: '2px' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </svg>
                        <span style={{ color: '#475569', fontWeight: 500 }}>{c.email}</span>
                      </div>

                      {/* Detail 2: Phone Row */}
                      {c.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '13.5px' }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          <span style={{ color: '#475569', fontWeight: 500 }}>{c.phone}</span>
                        </div>
                      )}

                      {/* Detail 3: Role / Work Bag Row */}
                      {c.role && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '13.5px' }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                          </svg>
                          <span style={{ color: '#475569', fontWeight: 500 }}>{c.role}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* BOTTOM SHEET: Add / Edit Contact (Image 2) */}
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
                {/* Header: + Add Contact or Edit Contact + Close */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb' }}>
                      {editingContactId ? '✎' : '+'}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                      {editingContactId ? 'Edit Contact' : 'Add Contact'}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddContact(false);
                      setEditingContactId(null);
                    }}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Full Name</label>
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

                {/* Email Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Email Address</label>
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
                      placeholder="+91 234 567 890"
                      style={{
                        height: '44px',
                        background: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0 2px',
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
                        padding: '0 2px',
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
                      if (editingContactId) {
                        setContactsList(prev => prev.map(item => {
                          if (item.id === editingContactId) {
                            return {
                              ...item,
                              fullName: contactFullName.trim(),
                              email: contactEmail.trim(),
                              phone: contactPhone.trim(),
                              role: contactRole.trim()
                            };
                          }
                          return item;
                        }));
                      } else {
                        setContactsList(prev => [...prev, {
                          id: `cnt-${Date.now()}`,
                          fullName: contactFullName.trim(),
                          email: contactEmail.trim(),
                          phone: contactPhone.trim(),
                          role: contactRole.trim()
                        }]);
                      }
                      setContactFullName('');
                      setContactEmail('');
                      setContactPhone('');
                      setContactRole('');
                      setEditingContactId(null);
                      setShowAddContact(false);
                    }
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
                  {editingContactId ? 'Save Changes' : 'Save Contact'}
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
