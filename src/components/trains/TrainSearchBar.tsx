'use client';

import React from 'react';
import { POPULAR_CITIES, CityLocation } from '../trainData';
import FlightTravellersDropdown from './FlightTravellersDropdown';

interface TrainSearchBarProps {
  source: string;
  destination: string;
  dateOfJourney: string;
  activeMode: string;
  showSourceDropdown: boolean;
  setShowSourceDropdown: (show: boolean) => void;
  showDestDropdown: boolean;
  setShowDestDropdown: (show: boolean) => void;
  isSearchingSource: boolean;
  isSearchingDest: boolean;
  sourceOnlineResults: CityLocation[];
  destOnlineResults: CityLocation[];
  setSource: (src: string) => void;
  setDestination: (dst: string) => void;
  setDateOfJourney: (date: string) => void;
  setSelectedDay: (day: string) => void;
  handleSwapStations: () => void;
  formatStationName: (name: string) => string;
  showCalendarPicker: boolean;
  setShowCalendarPicker: React.Dispatch<React.SetStateAction<boolean>>;
  calMonth: number;
  setCalMonth: React.Dispatch<React.SetStateAction<number>>;
  calYear: number;
  setCalYear: React.Dispatch<React.SetStateAction<number>>;
  toggleCalendarPicker: () => void;
  handleSelectDate: (dayNum: number, monthIdx?: number, yr?: number) => void;
  sourceRef: React.RefObject<HTMLDivElement | null>;
  destRef: React.RefObject<HTMLDivElement | null>;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  otherRidesRef: React.RefObject<HTMLDivElement | null>;
  showOtherRidesDropdown: boolean;
  setShowOtherRidesDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  handleModeChange: (mode: any) => void;
  onSearch: () => void;
  INITIAL_MODE_ORDER: { id: string; label: string; icon: string }[];
  selectedClassFilter?: string;
  setSelectedClassFilter?: (cls: string) => void;
  selectedQuotaFilter?: string;
  setSelectedQuotaFilter?: (quota: string) => void;
}

export default function TrainSearchBar({
  source,
  destination,
  dateOfJourney,
  activeMode,
  showSourceDropdown,
  setShowSourceDropdown,
  showDestDropdown,
  setShowDestDropdown,
  isSearchingSource,
  isSearchingDest,
  sourceOnlineResults,
  destOnlineResults,
  setSource,
  setDestination,
  setDateOfJourney,
  setSelectedDay,
  handleSwapStations,
  formatStationName,
  showCalendarPicker,
  setShowCalendarPicker,
  calMonth,
  setCalMonth,
  calYear,
  setCalYear,
  toggleCalendarPicker,
  handleSelectDate,
  sourceRef,
  destRef,
  calendarRef,
  otherRidesRef,
  showOtherRidesDropdown,
  setShowOtherRidesDropdown,
  handleModeChange,
  onSearch,
  INITIAL_MODE_ORDER,
  selectedClassFilter = 'All Classes',
  setSelectedClassFilter,
  selectedQuotaFilter = 'GENERAL',
  setSelectedQuotaFilter
}: TrainSearchBarProps) {
  const [showClassDropdown, setShowClassDropdown] = React.useState(false);
  const [showQuotaDropdown, setShowQuotaDropdown] = React.useState(false);
  const classDropdownRef = React.useRef<HTMLDivElement>(null);
  const quotaDropdownRef = React.useRef<HTMLDivElement>(null);

  // Flight-only Travellers & Special Fares Dropdown states (Images 1, 3, 4)
  const [showTravellersDropdown, setShowTravellersDropdown] = React.useState(false);
  const travellersRef = React.useRef<HTMLDivElement>(null);
  const [adultCount, setAdultCount] = React.useState(1);
  const [seniorCount, setSeniorCount] = React.useState(0);
  const [childCount, setChildCount] = React.useState(0);
  const [infantCount, setInfantCount] = React.useState(0);
  const [specialFare, setSpecialFare] = React.useState('6Exclusive');
  const [cabinClass, setCabinClass] = React.useState('Economy');
  const [expandedSeatOption, setExpandedSeatOption] = React.useState<string | null>(null);

  const totalPassengers = adultCount + seniorCount + childCount + infantCount;

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sart_flight_travellers');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.adultCount !== undefined) setAdultCount(parsed.adultCount);
          if (parsed.seniorCount !== undefined) setSeniorCount(parsed.seniorCount);
          if (parsed.childCount !== undefined) setChildCount(parsed.childCount);
          if (parsed.infantCount !== undefined) setInfantCount(parsed.infantCount);
          if (parsed.specialFare) setSpecialFare(parsed.specialFare);
          if (parsed.cabinClass) setCabinClass(parsed.cabinClass);
        }
      } catch (e) {
        console.error('Error loading flight travellers', e);
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = {
        adultCount,
        seniorCount,
        childCount,
        infantCount,
        specialFare,
        cabinClass,
        totalPassengers: adultCount + seniorCount + childCount + infantCount
      };
      localStorage.setItem('sart_flight_travellers', JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('sart_flight_travellers_changed', { detail: data }));
    }
  }, [adultCount, seniorCount, childCount, infantCount, specialFare, cabinClass]);

  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (classDropdownRef.current && !classDropdownRef.current.contains(e.target as Node)) {
        setShowClassDropdown(false);
      }
      if (quotaDropdownRef.current && !quotaDropdownRef.current.contains(e.target as Node)) {
        setShowQuotaDropdown(false);
      }
      if (travellersRef.current && !travellersRef.current.contains(e.target as Node)) {
        setShowTravellersDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const CLASS_OPTIONS = [
    'All Classes',
    'Anubhuti Class (EA)',
    'AC First Class (1A)',
    'Vistadome AC (EV)',
    'Exec. Chair Car (EC)',
    'AC 2 Tier (2A)',
    'First Class (FC)',
    'AC 3 Tier (3A)',
    'AC 3 Economy (3E)',
    'Vistadome Chair Car (VC)',
    'AC Chair car (CC)',
    'Sleeper (SL)',
    'Vistadome Non AC (VS)',
    'Second Sitting (2S)'
  ];

  const QUOTA_OPTIONS = [
    'GENERAL',
    'LADIES',
    'LOWER BERTH/SR.CITIZEN',
    'PERSON WITH DISABILITY',
    'DUTY PASS',
    'TATKAL',
    'PREMIUM TATKAL'
  ];
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  return (
    <div className="tb-search-card">
      <div className="tb-search-row">
        {/* Source Field */}
        <div className="tb-search-field" ref={sourceRef}>
          <i
            className={`fa-solid ${activeMode === 'bike'
              ? 'fa-motorcycle'
              : activeMode === 'auto'
                ? 'fa-taxi'
                : activeMode === 'car'
                  ? 'fa-car'
                  : activeMode === 'bus'
                    ? 'fa-bus'
                    : activeMode === 'flight'
                      ? 'fa-plane'
                      : activeMode === 'ship'
                        ? 'fa-ship'
                        : activeMode === 'ship'
                          ? 'fa-ship'
                          : activeMode === 'helicopter'
                            ? 'fa-helicopter'
                            : 'fa-train-subway'
              } tb-field-icon`}
          ></i>
          <div className="tb-field-content">
            <span className="tb-field-label">Source</span>
            <input
              type="text"
              value={formatStationName(source)}
              onChange={(e) => {
                setSource(e.target.value);
                setShowSourceDropdown(true);
              }}
              onFocus={() => setShowSourceDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowSourceDropdown(false);
                  onSearch();
                }
              }}
              placeholder={activeMode === 'ship' ? 'From Port / Coastal Hub' : 'From Station / Location'}
            />
          </div>

          {showSourceDropdown && (
            <div className="tb-suggestions-popup">
              <div className="tb-suggestions-header">
                <span>Popular Cities</span>
                <i className="fa-solid fa-city" style={{ color: '#94a3b8' }}></i>
              </div>
              {POPULAR_CITIES.filter((city) => {
                const q = formatStationName(source).trim().toLowerCase();
                if (!q) return true;
                return city.name.toLowerCase().includes(q) || city.state.toLowerCase().includes(q);
              }).map((city) => (
                <div
                  key={city.name}
                  className="tb-city-suggestion-item"
                  onClick={() => {
                    setSource(city.name);
                    setShowSourceDropdown(false);
                  }}
                >
                  <div className="tb-city-icon-wrap">
                    <i className="fa-solid fa-city"></i>
                  </div>
                  <div className="tb-city-text-wrap">
                    <span className="tb-city-main-name">{city.name}</span>
                    <span className="tb-city-sub-name">{city.state}</span>
                  </div>
                </div>
              ))}

              {isSearchingSource && (
                <div className="tb-searching-indicator">
                  <i className="fa-solid fa-spinner fa-spin" style={{ color: '#2563eb' }}></i>
                  <span>Finding places on map...</span>
                </div>
              )}

              {sourceOnlineResults.length > 0 && (
                <>
                  <div className="tb-suggestions-header tb-suggestions-header-online">
                    <span>Online Map Places</span>
                    <i className="fa-solid fa-map-location-dot"></i>
                  </div>
                  {sourceOnlineResults.map((place, pIdx) => (
                    <div
                      key={`src-online-${pIdx}`}
                      className="tb-city-suggestion-item"
                      onClick={() => {
                        setSource(place.name);
                        setShowSourceDropdown(false);
                      }}
                    >
                      <div className="tb-city-icon-wrap" style={{ color: '#2563eb' }}>
                        <i className="fa-solid fa-location-dot"></i>
                      </div>
                      <div className="tb-city-text-wrap">
                        <span className="tb-city-main-name">{place.name}</span>
                        <span className="tb-city-sub-name">{place.state}</span>
                      </div>
                      <span className="tb-online-map-tag">
                        <i className="fa-solid fa-earth-asia"></i> Map
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Swap Button */}
        <button className="tb-swap-btn" onClick={handleSwapStations} title="Swap Stations">
          <i className="fa-solid fa-arrow-right-arrow-left"></i>
        </button>

        {/* Destination Field */}
        <div className="tb-search-field" ref={destRef}>
          <i
            className={`fa-solid ${activeMode === 'bike'
              ? 'fa-motorcycle'
              : activeMode === 'auto'
                ? 'fa-taxi'
                : activeMode === 'car'
                  ? 'fa-car'
                  : activeMode === 'bus'
                    ? 'fa-bus'
                    : activeMode === 'flight'
                      ? 'fa-plane'
                      : activeMode === 'ship'
                        ? 'fa-ship'
                        : activeMode === 'ship'
                          ? 'fa-ship'
                          : activeMode === 'helicopter'
                            ? 'fa-helicopter'
                            : 'fa-train-subway'
              } tb-field-icon`}
          ></i>
          <div className="tb-field-content">
            <span className="tb-field-label">Destination</span>
            <input
              type="text"
              value={formatStationName(destination)}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowDestDropdown(true);
              }}
              onFocus={() => setShowDestDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowDestDropdown(false);
                  onSearch();
                }
              }}
              placeholder={activeMode === 'ship' ? 'To Island / Destination Port' : 'To Station / Location'}
            />
          </div>

          {showDestDropdown && (
            <div className="tb-suggestions-popup">
              <div className="tb-suggestions-header">
                <span>Popular Cities</span>
                <i className="fa-solid fa-city" style={{ color: '#94a3b8' }}></i>
              </div>
              {POPULAR_CITIES.filter((city) => {
                const q = formatStationName(destination).trim().toLowerCase();
                if (!q) return true;
                return city.name.toLowerCase().includes(q) || city.state.toLowerCase().includes(q);
              }).map((city) => (
                <div
                  key={city.name}
                  className="tb-city-suggestion-item"
                  onClick={() => {
                    setDestination(city.name);
                    setShowDestDropdown(false);
                  }}
                >
                  <div className="tb-city-icon-wrap">
                    <i className="fa-solid fa-city"></i>
                  </div>
                  <div className="tb-city-text-wrap">
                    <span className="tb-city-main-name">{city.name}</span>
                    <span className="tb-city-sub-name">{city.state}</span>
                  </div>
                </div>
              ))}

              {isSearchingDest && (
                <div className="tb-searching-indicator">
                  <i className="fa-solid fa-spinner fa-spin" style={{ color: '#2563eb' }}></i>
                  <span>Finding places on map...</span>
                </div>
              )}

              {destOnlineResults.length > 0 && (
                <>
                  <div className="tb-suggestions-header tb-suggestions-header-online">
                    <span>Online Map Places</span>
                    <i className="fa-solid fa-map-location-dot"></i>
                  </div>
                  {destOnlineResults.map((place, pIdx) => (
                    <div
                      key={`dst-online-${pIdx}`}
                      className="tb-city-suggestion-item"
                      onClick={() => {
                        setDestination(place.name);
                        setShowDestDropdown(false);
                      }}
                    >
                      <div className="tb-city-icon-wrap" style={{ color: '#2563eb' }}>
                        <i className="fa-solid fa-location-dot"></i>
                      </div>
                      <div className="tb-city-text-wrap">
                        <span className="tb-city-main-name">{place.name}</span>
                        <span className="tb-city-sub-name">{place.state}</span>
                      </div>
                      <span className="tb-online-map-tag">
                        <i className="fa-solid fa-earth-asia"></i> Map
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Only for Flight Page: Travellers + Special Fares Field (Before Calendar) */}
        {activeMode === 'flight' && (
          <>
            <div className="tb-field-divider"></div>
            <div
              className="tb-search-field tb-flight-travellers-field"
              ref={travellersRef}
              style={{
                flex: '0 0 auto',
                minWidth: '165px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px'
              }}
              onClick={() => setShowTravellersDropdown((prev) => !prev)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                    Travellers + Special Fares
                  </span>
                  <i
                    className={`fa-solid fa-chevron-${showTravellersDropdown ? 'up' : 'down'}`}
                    style={{ fontSize: '9px', color: '#64748b' }}
                  ></i>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#002970', marginTop: '2px', whiteSpace: 'nowrap' }}>
                  {totalPassengers} Passenger{totalPassengers > 1 ? 's' : ''}
                </div>
              </div>

              {/* Dropdown Popup */}
              {showTravellersDropdown && (
                <FlightTravellersDropdown
                  specialFare={specialFare}
                  setSpecialFare={setSpecialFare}
                  adultCount={adultCount}
                  setAdultCount={setAdultCount}
                  seniorCount={seniorCount}
                  setSeniorCount={setSeniorCount}
                  childCount={childCount}
                  setChildCount={setChildCount}
                  infantCount={infantCount}
                  setInfantCount={setInfantCount}
                  cabinClass={cabinClass}
                  setCabinClass={setCabinClass}
                  totalPassengers={totalPassengers}
                  expandedSeatOption={expandedSeatOption}
                  setExpandedSeatOption={setExpandedSeatOption}
                  onDone={() => setShowTravellersDropdown(false)}
                />
              )}
            </div>
          </>
        )}

        <div className="tb-field-divider"></div>

        {/* Date Field */}
        <div className="tb-search-field tb-date-field" style={{ flex: '0 0 auto', minWidth: '130px', cursor: 'pointer' }} ref={calendarRef}>
          <div className="tb-date-trigger-wrap" onClick={toggleCalendarPicker} title="Click to select journey date" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-regular fa-calendar-days tb-field-icon tb-cal-icon" style={{ fontSize: '18px', color: '#334155' }}></i>
            <div className="tb-field-content">
              <span className="tb-field-label" style={{ fontSize: '10px', color: '#94a3b8', lineHeight: '1.2' }}>Date Of<br />Journey</span>
              <div className="tb-date-display-row" style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '1px' }}>
                <span className="tb-date-text" style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                  {dateOfJourney}
                </span>
                <i className={`fa-solid fa-chevron-${showCalendarPicker ? 'up' : 'down'} tb-date-chevron`} style={{ fontSize: '10px', color: '#64748b' }}></i>
              </div>
            </div>
          </div>

          {showCalendarPicker && (
            <div className="tb-calendar-popup" onClick={(e) => e.stopPropagation()}>
              <div className="tb-cal-header">
                <button
                  type="button"
                  className="tb-cal-nav-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (calMonth === 0) {
                      setCalMonth(11);
                      setCalYear((y) => y - 1);
                    } else {
                      setCalMonth((m) => m - 1);
                    }
                  }}
                  title="Previous month"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <span className="tb-cal-title">
                  {MONTH_NAMES[calMonth]} {calYear}
                </span>
                <button
                  type="button"
                  className="tb-cal-nav-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (calMonth === 11) {
                      setCalMonth(0);
                      setCalYear((y) => y + 1);
                    } else {
                      setCalMonth((m) => m + 1);
                    }
                  }}
                  title="Next month"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>

              <div className="tb-cal-weekdays">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((w) => (
                  <span key={w} className="tb-cal-weekday">
                    {w}
                  </span>
                ))}
              </div>

              <div className="tb-cal-days-grid">
                {Array.from({ length: getFirstDayOfMonth(calYear, calMonth) }).map((_, i) => (
                  <div key={`empty-${i}`} className="tb-cal-day-cell empty"></div>
                ))}

                {Array.from({ length: getDaysInMonth(calYear, calMonth) }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayFormatted = String(dayNum).padStart(2, '0');
                  const isSelected =
                    dateOfJourney === `${dayFormatted} ${MONTH_SHORT[calMonth]}, ${calYear}` ||
                    dateOfJourney === `${dayNum} ${MONTH_SHORT[calMonth]}, ${calYear}`;

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      className={`tb-cal-day-cell ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectDate(dayNum)}
                    >
                      <span className="tb-cal-day-number">{dayNum}</span>
                      {isSelected && <span className="tb-cal-selected-indicator"></span>}
                    </button>
                  );
                })}
              </div>

              <div className="tb-cal-footer">
                <button
                  type="button"
                  className="tb-cal-quick-action"
                  onClick={() => {
                    const now = new Date();
                    setCalMonth(now.getMonth());
                    setCalYear(now.getFullYear());
                    handleSelectDate(now.getDate(), now.getMonth(), now.getFullYear());
                  }}
                >
                  Today ({new Date().getDate()} {MONTH_SHORT[new Date().getMonth()]})
                </button>
                <button
                  type="button"
                  className="tb-cal-quick-action"
                  onClick={() => {
                    const tom = new Date();
                    tom.setDate(tom.getDate() + 1);
                    setCalMonth(tom.getMonth());
                    setCalYear(tom.getFullYear());
                    handleSelectDate(tom.getDate(), tom.getMonth(), tom.getFullYear());
                  }}
                >
                  Tomorrow
                </button>
              </div>
            </div>
          )}
        </div>

        {/* All Classes, GENERAL, Tomorrow, Day After: Displayed ONLY in Train mode */}
        {activeMode === 'train' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, margin: '0 4px' }}>
            {/* 1. All Classes Dropdown Button */}
            <div ref={classDropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setShowClassDropdown((prev) => !prev);
                  setShowQuotaDropdown(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: showClassDropdown ? '1.5px solid #0070f3' : '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: showClassDropdown ? '0 0 0 3px rgba(0, 112, 243, 0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <i className="fa-solid fa-briefcase" style={{ color: '#0070f3', fontSize: '14px' }}></i>
                <span>{selectedClassFilter}</span>
                <i className={`fa-solid fa-chevron-${showClassDropdown ? 'up' : 'down'}`} style={{ color: '#64748b', fontSize: '11px', marginLeft: '4px' }}></i>
              </button>

              {showClassDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    width: '240px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    background: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 99999,
                    padding: '4px 0'
                  }}
                >
                  {CLASS_OPTIONS.map((cls) => {
                    const isSelected = selectedClassFilter === cls;
                    return (
                      <div
                        key={cls}
                        onClick={() => {
                          if (setSelectedClassFilter) setSelectedClassFilter(cls);
                          setShowClassDropdown(false);
                        }}
                        style={{
                          padding: '9px 14px',
                          fontSize: '13px',
                          fontWeight: isSelected ? 800 : 500,
                          color: isSelected ? '#ffffff' : '#1e293b',
                          background: isSelected ? '#0070f3' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.1s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#f1f5f9';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {cls}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Quota (General / Tatkal) Dropdown Button */}
            <div ref={quotaDropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setShowQuotaDropdown((prev) => !prev);
                  setShowClassDropdown(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: showQuotaDropdown ? '1.5px solid #0070f3' : '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: showQuotaDropdown ? '0 0 0 3px rgba(0, 112, 243, 0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <i className="fa-solid fa-table-cells" style={{ color: '#0070f3', fontSize: '14px' }}></i>
                <span>{selectedQuotaFilter}</span>
                <i className={`fa-solid fa-chevron-${showQuotaDropdown ? 'up' : 'down'}`} style={{ color: '#64748b', fontSize: '11px', marginLeft: '4px' }}></i>
              </button>

              {showQuotaDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    width: '240px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    background: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 99999,
                    padding: '4px 0'
                  }}
                >
                  {QUOTA_OPTIONS.map((q) => {
                    const isSelected = selectedQuotaFilter === q;
                    return (
                      <div
                        key={q}
                        onClick={() => {
                          if (setSelectedQuotaFilter) setSelectedQuotaFilter(q);
                          setShowQuotaDropdown(false);
                        }}
                        style={{
                          padding: '9px 14px',
                          fontSize: '13px',
                          fontWeight: isSelected ? 800 : 500,
                          color: isSelected ? '#ffffff' : '#1e293b',
                          background: isSelected ? '#0070f3' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.1s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = '#f1f5f9';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {q}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Tomorrow Button (after All Classes and GENERAL) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const tom = new Date();
                tom.setDate(tom.getDate() + 1);
                setCalMonth(tom.getMonth());
                setCalYear(tom.getFullYear());
                const formatted = `${String(tom.getDate()).padStart(2, '0')} ${MONTH_SHORT[tom.getMonth()]}, ${tom.getFullYear()}`;
                setDateOfJourney(formatted);
                setSelectedDay(String(tom.getDate()).padStart(2, '0'));
                setShowCalendarPicker(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b0764',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                padding: '6px 8px',
                borderRadius: '6px',
                transition: 'background 0.15s ease'
              }}
            >
              Tomorrow
            </button>

            {/* 4. Day After Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const da = new Date();
                da.setDate(da.getDate() + 2);
                setCalMonth(da.getMonth());
                setCalYear(da.getFullYear());
                const formatted = `${String(da.getDate()).padStart(2, '0')} ${MONTH_SHORT[da.getMonth()]}, ${da.getFullYear()}`;
                setDateOfJourney(formatted);
                setSelectedDay(String(da.getDate()).padStart(2, '0'));
                setShowCalendarPicker(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b0764',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                padding: '6px 8px',
                borderRadius: '6px',
                transition: 'background 0.15s ease'
              }}
            >
              Day After
            </button>
          </div>
        )}

        {/* Red Search Button */}
        <button className="tb-search-action-btn" onClick={onSearch} title="Search">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="tb-mode-tabs" style={{ position: 'relative', overflow: 'visible' }}>
        {INITIAL_MODE_ORDER.filter((m) => m.id !== 'ship' && m.id !== 'helicopter').map((m) => (
          <button
            key={m.id}
            className={`tb-mode-tab ${activeMode === m.id ? 'active' : ''}`}
            onClick={() => {
              setShowOtherRidesDropdown(false);
              handleModeChange(m.id);
            }}
          >
            <i className={`fa-solid ${m.icon}`}></i> {m.label}
          </button>
        ))}

        {/* Dropdown Tab for Others: Ship & Helicopter */}
        <div ref={otherRidesRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            className={`tb-mode-tab ${(activeMode === 'ship' || activeMode === 'helicopter') ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowOtherRidesDropdown((prev) => !prev);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            title="Click to choose Ship or Helicopter"
          >
            <i
              className={`fa-solid ${activeMode === 'helicopter' ? 'fa-helicopter' : activeMode === 'ship' ? 'fa-ship' : 'fa-ellipsis'}`}
              style={{ color: activeMode === 'helicopter' ? '#dc2626' : activeMode === 'ship' ? '#0284c7' : 'inherit' }}
            ></i>
            <span>
              {activeMode === 'helicopter' ? 'Helicopter' : activeMode === 'ship' ? 'Ship' : 'Others'}
            </span>
            <i
              className={`fa-solid fa-chevron-${showOtherRidesDropdown ? 'up' : 'down'}`}
              style={{ fontSize: '11px', opacity: 0.7 }}
            ></i>
          </button>

          {showOtherRidesDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                minWidth: '260px',
                background: '#ffffff',
                borderRadius: '14px',
                boxShadow: '0 16px 36px rgba(15, 23, 42, 0.2), 0 2px 10px rgba(0, 0, 0, 0.08)',
                border: '1.5px solid #cbd5e1',
                zIndex: 99999,
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Option 1: Ship */}
              <div
                onClick={() => {
                  setShowOtherRidesDropdown(false);
                  handleModeChange('ship' as any);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: activeMode === 'ship' ? '#f0f9ff' : 'transparent',
                  border: activeMode === 'ship' ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (activeMode !== 'ship') e.currentTarget.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  if (activeMode !== 'ship') e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                  <i className="fa-solid fa-ship"></i>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Ship</span>
                    {activeMode === 'ship' && (
                      <span style={{ fontSize: '10px', background: '#ecfdf5', color: '#059669', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>Selected</span>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Marine Voyages &amp; Ferries</span>
                </div>
              </div>

              {/* Option 2: Helicopter */}
              <div
                onClick={() => {
                  setShowOtherRidesDropdown(false);
                  handleModeChange('helicopter' as any);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: activeMode === 'helicopter' ? '#fef2f2' : 'transparent',
                  border: activeMode === 'helicopter' ? '1.5px solid #dc2626' : '1px solid #e2e8f0',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (activeMode !== 'helicopter') e.currentTarget.style.backgroundColor = '#fef2f2';
                }}
                onMouseLeave={(e) => {
                  if (activeMode !== 'helicopter') e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dc2626', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                  <i className="fa-solid fa-helicopter"></i>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Helicopter</span>
                    {activeMode === 'helicopter' && (
                      <span style={{ fontSize: '10px', background: '#ecfdf5', color: '#059669', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>Selected</span>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Helipad transfers &amp; Charters</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

