'use client';

import React from 'react';
import { POPULAR_CITIES, CityLocation } from '../trainData';

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

  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (classDropdownRef.current && !classDropdownRef.current.contains(e.target as Node)) {
        setShowClassDropdown(false);
      }
      if (quotaDropdownRef.current && !quotaDropdownRef.current.contains(e.target as Node)) {
        setShowQuotaDropdown(false);
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
            className={`fa-solid ${
              activeMode === 'bike'
                ? 'fa-motorcycle'
                : activeMode === 'auto'
                ? 'fa-taxi'
                : activeMode === 'car'
                ? 'fa-car'
                : activeMode === 'bus'
                ? 'fa-bus'
                : activeMode === 'flight'
                ? 'fa-plane'
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
              placeholder="From Station / Location"
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
            className={`fa-solid ${
              activeMode === 'bike'
                ? 'fa-motorcycle'
                : activeMode === 'auto'
                ? 'fa-taxi'
                : activeMode === 'car'
                ? 'fa-car'
                : activeMode === 'bus'
                ? 'fa-bus'
                : activeMode === 'flight'
                ? 'fa-plane'
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
              placeholder="To Station / Location"
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

        <div className="tb-field-divider"></div>

        {/* Date Field */}
        <div className="tb-search-field tb-date-field" style={{ flex: '0 0 auto', minWidth: '130px', cursor: 'pointer' }} ref={calendarRef}>
          <div className="tb-date-trigger-wrap" onClick={toggleCalendarPicker} title="Click to select journey date" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-regular fa-calendar-days tb-field-icon tb-cal-icon" style={{ fontSize: '18px', color: '#334155' }}></i>
            <div className="tb-field-content">
              <span className="tb-field-label" style={{ fontSize: '10px', color: '#94a3b8', lineHeight: '1.2' }}>Date Of<br/>Journey</span>
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
          </div>
        )}

        {/* Red Search Button */}
        <button className="tb-search-action-btn" onClick={onSearch} title="Search">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="tb-mode-tabs" style={{ position: 'relative', overflow: 'visible' }}>
        {INITIAL_MODE_ORDER.filter((m) => m.id !== 'helicopter').map((m) => (
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

        {/* Other Rides */}
        <div ref={otherRidesRef} style={{ position: 'relative', display: 'inline-block' }}>
          <button
            type="button"
            className={`tb-mode-tab ${activeMode === 'helicopter' ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowOtherRidesDropdown((prev) => !prev);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            title="Click to view Other Rides"
          >
            <i
              className={`fa-solid ${activeMode === 'helicopter' ? 'fa-helicopter' : 'fa-bars'}`}
              style={{ color: activeMode === 'helicopter' ? '#dc2626' : 'inherit' }}
            ></i>
            <span>{activeMode === 'helicopter' ? 'Helicopter' : 'Other Rides'}</span>
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
                minWidth: '220px',
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 16px 36px rgba(15, 23, 42, 0.2), 0 2px 10px rgba(0, 0, 0, 0.08)',
                border: '1px solid #cbd5e1',
                zIndex: 99999,
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '6px 12px 4px', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Special Aerial Charters
              </div>
              <div
                onClick={() => {
                  setShowOtherRidesDropdown(false);
                  handleModeChange('helicopter');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: activeMode === 'helicopter' ? '#fee2e2' : 'transparent',
                  color: activeMode === 'helicopter' ? '#dc2626' : '#1e293b',
                  fontWeight: 700,
                  fontSize: '14px'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-helicopter"></i>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800 }}>Helicopter</span>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Helipad transfers & charters</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

