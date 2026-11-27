'use client';

import React from 'react';

interface FlightFiltersSidebarProps {
  hasActiveFilters: boolean;
  handleClearAllFilters: () => void;
  selectedStops: number[];
  setSelectedStops: React.Dispatch<React.SetStateAction<number[]>>;
  selectedAirlines: string[];
  setSelectedAirlines: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLayovers: string[];
  setSelectedLayovers: React.Dispatch<React.SetStateAction<string[]>>;
  layoverSearchText: string;
  setLayoverSearchText: React.Dispatch<React.SetStateAction<string>>;
  maxDuration: number;
  setMaxDuration: React.Dispatch<React.SetStateAction<number>>;
  maxPrice: number;
  setMaxPrice: React.Dispatch<React.SetStateAction<number>>;
  checkInBaggageOnly: boolean;
  setCheckInBaggageOnly: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAircraftSize: string[];
  setSelectedAircraftSize: React.Dispatch<React.SetStateAction<string[]>>;
  openSections: {
    stops: boolean;
    airlines: boolean;
    layovers: boolean;
    timePrice: boolean;
    baggage: boolean;
    aircraft: boolean;
  };
  toggleSection: (key: any) => void;
  rawFlights: any[];
  airlineCounts: Record<string, number>;
  layoverAirportsList: string[];
}

export default function FlightFiltersSidebar({
  hasActiveFilters,
  handleClearAllFilters,
  selectedStops,
  setSelectedStops,
  selectedAirlines,
  setSelectedAirlines,
  selectedLayovers,
  setSelectedLayovers,
  layoverSearchText,
  setLayoverSearchText,
  maxDuration,
  setMaxDuration,
  maxPrice,
  setMaxPrice,
  checkInBaggageOnly,
  setCheckInBaggageOnly,
  selectedAircraftSize,
  setSelectedAircraftSize,
  openSections,
  toggleSection,
  rawFlights,
  airlineCounts,
  layoverAirportsList
}: FlightFiltersSidebarProps) {
  return (
    <aside className="fb-sidebar">
      {/* Header with "Applied Filters" & "Clear All" */}
      <div className="fb-applied-filters-header">
        <span className="fb-applied-filters-title">Applied Filters</span>
        {hasActiveFilters && (
          <button
            type="button"
            className="fb-clear-all-btn"
            onClick={handleClearAllFilters}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Chips row if any active */}
      {hasActiveFilters && (
        <div className="fb-active-chips-wrap">
          {selectedStops.map((st) => (
            <span key={`chip-st-${st}`} className="fb-active-chip">
              {st === 0 ? 'Non Stop' : '1 Stop'}
              <button
                type="button"
                className="fb-active-chip-remove"
                onClick={() => setSelectedStops((prev) => prev.filter((x) => x !== st))}
              >
                ×
              </button>
            </span>
          ))}
          {selectedAirlines.map((air) => (
            <span key={`chip-air-${air}`} className="fb-active-chip">
              {air}
              <button
                type="button"
                className="fb-active-chip-remove"
                onClick={() => setSelectedAirlines((prev) => prev.filter((x) => x !== air))}
              >
                ×
              </button>
            </span>
          ))}
          {selectedLayovers.map((lay) => (
            <span key={`chip-lay-${lay}`} className="fb-active-chip">
              {lay}
              <button
                type="button"
                className="fb-active-chip-remove"
                onClick={() => setSelectedLayovers((prev) => prev.filter((x) => x !== lay))}
              >
                ×
              </button>
            </span>
          ))}
          {maxPrice < 25000 && (
            <span className="fb-active-chip">
              Under ₹{maxPrice}
              <button
                type="button"
                className="fb-active-chip-remove"
                onClick={() => setMaxPrice(25000)}
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* 1. Stops and Duration */}
      <div className="fb-filter-section">
        <div className="fb-section-header" onClick={() => toggleSection('stops')}>
          <span className="fb-section-title">Stops and Duration</span>
          <i className={`fa-solid fa-chevron-down fb-section-toggle-icon ${openSections.stops ? 'open' : ''}`}></i>
        </div>
        {openSections.stops && (
          <div>
            <div className="fb-sub-label">Stops</div>
            <div className="fb-stops-pill-row">
              <button
                type="button"
                className={`fb-stops-pill ${selectedStops.includes(0) ? 'active' : ''}`}
                onClick={() => {
                  setSelectedStops((prev) =>
                    prev.includes(0) ? prev.filter((x) => x !== 0) : [...prev, 0]
                  );
                }}
              >
                Non Stop ({rawFlights.filter((f) => f.stopsCount === 0).length})
              </button>
              <button
                type="button"
                className={`fb-stops-pill ${selectedStops.includes(1) ? 'active' : ''}`}
                onClick={() => {
                  setSelectedStops((prev) =>
                    prev.includes(1) ? prev.filter((x) => x !== 1) : [...prev, 1]
                  );
                }}
              >
                1 Stop ({rawFlights.filter((f) => f.stopsCount === 1).length})
              </button>
            </div>

            <div className="fb-sub-label" style={{ marginTop: '14px' }}>Duration</div>
            <div className="fb-slider-wrap">
              <input
                type="range"
                min="105"
                max="700"
                step="15"
                className="fb-slider-range-input"
                value={maxDuration}
                onChange={(e) => setMaxDuration(Number(e.target.value))}
              />
              <div className="fb-slider-labels">
                <span>1h 45m</span>
                <span>{Math.floor(maxDuration / 60)}h {maxDuration % 60}m</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Airlines */}
      <div className="fb-filter-section">
        <div className="fb-section-header" onClick={() => toggleSection('airlines')}>
          <span className="fb-section-title">Airlines</span>
          <i className={`fa-solid fa-chevron-down fb-section-toggle-icon ${openSections.airlines ? 'open' : ''}`}></i>
        </div>
        {openSections.airlines && (
          <div style={{ marginTop: '10px' }}>
            {[
              { name: 'Air India', color: '#dc2626', icon: 'fa-plane' },
              { name: 'Air India Express', color: '#ea580c', icon: 'fa-bolt' },
              { name: 'IndiGo', color: '#1d4ed8', icon: 'fa-plane-departure' }
            ].map((airline) => (
              <div
                key={airline.name}
                className="fb-checkbox-row"
                onClick={() => {
                  setSelectedAirlines((prev) =>
                    prev.includes(airline.name)
                      ? prev.filter((a) => a !== airline.name)
                      : [...prev, airline.name]
                  );
                }}
              >
                <div className="fb-checkbox-left">
                  <input
                    type="checkbox"
                    checked={selectedAirlines.includes(airline.name)}
                    onChange={() => { }}
                  />
                  <span className="fb-airline-logo-dot" style={{ background: airline.color }}>
                    <i className={`fa-solid ${airline.icon}`}></i>
                  </span>
                  <span>{airline.name}</span>
                </div>
                <span className="fb-checkbox-count">{airlineCounts[airline.name] || 0}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Layover Airports */}
      <div className="fb-filter-section">
        <div className="fb-section-header" onClick={() => toggleSection('layovers')}>
          <span className="fb-section-title">Layover Airports</span>
          <i className={`fa-solid fa-chevron-down fb-section-toggle-icon ${openSections.layovers ? 'open' : ''}`}></i>
        </div>
        {openSections.layovers && (
          <div>
            <div className="fb-filter-search-box">
              <input
                type="text"
                className="fb-filter-search-input"
                placeholder="Search layover city..."
                value={layoverSearchText}
                onChange={(e) => setLayoverSearchText(e.target.value)}
              />
            </div>
            {layoverAirportsList
              .filter((c) => !layoverSearchText.trim() || c.toLowerCase().includes(layoverSearchText.toLowerCase()))
              .map((city) => (
                <div
                  key={city}
                  className="fb-checkbox-row"
                  onClick={() => {
                    setSelectedLayovers((prev) =>
                      prev.includes(city) ? prev.filter((x) => x !== city) : [...prev, city]
                    );
                  }}
                >
                  <div className="fb-checkbox-left">
                    <input
                      type="checkbox"
                      checked={selectedLayovers.includes(city)}
                      onChange={() => { }}
                    />
                    <span>{city}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 4. Time and Price */}
      <div className="fb-filter-section">
        <div className="fb-section-header" onClick={() => toggleSection('timePrice')}>
          <span className="fb-section-title">Time and Price</span>
          <i className={`fa-solid fa-chevron-down fb-section-toggle-icon ${openSections.timePrice ? 'open' : ''}`}></i>
        </div>
        {openSections.timePrice && (
          <div>
            <div className="fb-sub-label">Flight Max Price</div>
            <div className="fb-slider-wrap">
              <input
                type="range"
                min="7200"
                max="25000"
                step="500"
                className="fb-slider-range-input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="fb-slider-labels">
                <span>₹ 7,200</span>
                <span>₹ {maxPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Baggage */}
      <div className="fb-filter-section">
        <div className="fb-section-header" onClick={() => toggleSection('baggage')}>
          <span className="fb-section-title">Baggage</span>
          <i className={`fa-solid fa-chevron-down fb-section-toggle-icon ${openSections.baggage ? 'open' : ''}`}></i>
        </div>
        {openSections.baggage && (
          <div style={{ marginTop: '10px' }}>
            <div
              className="fb-checkbox-row"
              onClick={() => setCheckInBaggageOnly((prev) => !prev)}
            >
              <div className="fb-checkbox-left">
                <input
                  type="checkbox"
                  checked={checkInBaggageOnly}
                  onChange={() => { }}
                />
                <span>Check-in Baggage only</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Aircraft Size */}
      <div className="fb-filter-section">
        <div className="fb-section-header" onClick={() => toggleSection('aircraft')}>
          <span className="fb-section-title">Aircraft Size</span>
          <i className={`fa-solid fa-chevron-down fb-section-toggle-icon ${openSections.aircraft ? 'open' : ''}`}></i>
        </div>
        {openSections.aircraft && (
          <div style={{ marginTop: '10px' }}>
            <button
              type="button"
              className={`fb-stops-pill ${selectedAircraftSize.includes('Small / Mid - size aircraft') ? 'active' : ''}`}
              style={{ width: '100%' }}
              onClick={() => {
                setSelectedAircraftSize((prev) =>
                  prev.includes('Small / Mid - size aircraft')
                    ? prev.filter((x) => x !== 'Small / Mid - size aircraft')
                    : [...prev, 'Small / Mid - size aircraft']
                );
              }}
            >
              Small / Mid - size aircraft ({rawFlights.length})
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
