'use client';

import React from 'react';

interface TrainFilterSidebarProps {
  filterAvailable: boolean;
  setFilterAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  filterAC: boolean;
  setFilterAC: React.Dispatch<React.SetStateAction<boolean>>;
  filterTatkal: boolean;
  setFilterTatkal: React.Dispatch<React.SetStateAction<boolean>>;
  filterAltTrip: boolean;
  setFilterAltTrip: React.Dispatch<React.SetStateAction<boolean>>;
  selectedClasses: string[];
  setSelectedClasses: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAvailability: string[];
  setSelectedAvailability: React.Dispatch<React.SetStateAction<string[]>>;
  selectedQuota: 'general' | 'tatkal' | 'ladies' | 'senior';
  setSelectedQuota: React.Dispatch<React.SetStateAction<'general' | 'tatkal' | 'ladies' | 'senior'>>;
  selectedDepTimeRanges: string[];
  setSelectedDepTimeRanges: React.Dispatch<React.SetStateAction<string[]>>;
  selectedArrTimeRanges: string[];
  setSelectedArrTimeRanges: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDepStations: string[];
  setSelectedDepStations: React.Dispatch<React.SetStateAction<string[]>>;
  selectedArrStations: string[];
  setSelectedArrStations: React.Dispatch<React.SetStateAction<string[]>>;
  openAccordions: Record<string, boolean>;
  toggleAccordion: (key: string) => void;
  availableDepartingStations: { name: string; code: string }[];
  availableArrivingStations: { name: string; code: string }[];
  handleClearAllFilters: () => void;
  freeCancel: boolean;
  setFreeCancel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TrainFilterSidebar({
  filterAvailable,
  setFilterAvailable,
  filterAC,
  setFilterAC,
  filterTatkal,
  setFilterTatkal,
  filterAltTrip,
  setFilterAltTrip,
  selectedClasses,
  setSelectedClasses,
  selectedAvailability,
  setSelectedAvailability,
  selectedQuota,
  setSelectedQuota,
  selectedDepTimeRanges,
  setSelectedDepTimeRanges,
  selectedArrTimeRanges,
  setSelectedArrTimeRanges,
  selectedDepStations,
  setSelectedDepStations,
  selectedArrStations,
  setSelectedArrStations,
  openAccordions,
  toggleAccordion,
  availableDepartingStations,
  availableArrivingStations,
  handleClearAllFilters,
  freeCancel,
  setFreeCancel
}: TrainFilterSidebarProps) {
  const hasActiveFilters =
    filterAvailable ||
    filterAC ||
    filterTatkal ||
    filterAltTrip ||
    selectedClasses.length > 0 ||
    selectedAvailability.length > 0 ||
    selectedDepTimeRanges.length > 0 ||
    selectedArrTimeRanges.length > 0 ||
    selectedDepStations.length > 0 ||
    selectedArrStations.length > 0 ||
    selectedQuota !== 'general';

  return (
    <aside className="tb-filter-sidebar">
      {/* Applied Filters & Clear All */}
      <div className="tb-applied-filters-header">
        <span className="tb-applied-filters-title">Applied Filters</span>
        {hasActiveFilters && (
          <button type="button" className="tb-clear-all-link" onClick={handleClearAllFilters}>
            Clear All
          </button>
        )}
      </div>

      {/* Active Chips */}
      {hasActiveFilters && (
        <div className="tb-active-chips-wrap">
          {filterAvailable && (
            <span className="tb-active-chip">
              Available Only
              <button type="button" className="tb-active-chip-remove" onClick={() => setFilterAvailable(false)}>×</button>
            </span>
          )}
          {filterAC && (
            <span className="tb-active-chip">
              AC Only
              <button type="button" className="tb-active-chip-remove" onClick={() => setFilterAC(false)}>×</button>
            </span>
          )}
          {filterTatkal && (
            <span className="tb-active-chip">
              Tatkal Quota
              <button type="button" className="tb-active-chip-remove" onClick={() => setFilterTatkal(false)}>×</button>
            </span>
          )}
          {selectedClasses.map((cls) => (
            <span key={cls} className="tb-active-chip">
              Class: {cls}
              <button
                type="button"
                className="tb-active-chip-remove"
                onClick={() => setSelectedClasses((prev) => prev.filter((x) => x !== cls))}
              >
                ×
              </button>
            </span>
          ))}
          {selectedAvailability.map((av) => (
            <span key={av} className="tb-active-chip">
              {av.toUpperCase()}
              <button
                type="button"
                className="tb-active-chip-remove"
                onClick={() => setSelectedAvailability((prev) => prev.filter((x) => x !== av))}
              >
                ×
              </button>
            </span>
          ))}
          {selectedDepStations.map((st) => (
            <span key={st} className="tb-active-chip">
              Dep: {st}
              <button
                type="button"
                className="tb-active-chip-remove"
                onClick={() => setSelectedDepStations((prev) => prev.filter((x) => x !== st))}
              >
                ×
              </button>
            </span>
          ))}
          {selectedArrStations.map((st) => (
            <span key={st} className="tb-active-chip">
              Arr: {st}
              <button
                type="button"
                className="tb-active-chip-remove"
                onClick={() => setSelectedArrStations((prev) => prev.filter((x) => x !== st))}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Quick Filters */}
      <div className="tb-quick-filter-group">
        <label className="tb-filter-checkbox-label">
          <input
            type="checkbox"
            checked={filterAvailable}
            onChange={(e) => setFilterAvailable(e.target.checked)}
          />
          <span>Show Available Only</span>
        </label>
        <label className="tb-filter-checkbox-label">
          <input
            type="checkbox"
            checked={filterAC}
            onChange={(e) => setFilterAC(e.target.checked)}
          />
          <span>AC Coaches Only</span>
        </label>
        <label className="tb-filter-checkbox-label">
          <input
            type="checkbox"
            checked={filterTatkal}
            onChange={(e) => setFilterTatkal(e.target.checked)}
          />
          <span>Tatkal Available</span>
        </label>
      </div>

      {/* Free Cancellation Banner */}
      <div className="tb-free-cancellation-banner">
        <div className="tb-banner-left">
          <i className="fa-solid fa-shield-halved tb-shield-icon"></i>
          <div>
            <strong>Free Cancellation</strong>
            <p>Get full refund if you cancel</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={freeCancel}
          onChange={(e) => setFreeCancel(e.target.checked)}
          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
        />
      </div>

      {/* Accordion List */}
      <div className="tb-accordion-list">
        {/* Availability */}
        <div className="tb-accordion-item">
          <div
            className={`tb-accordion-header ${openAccordions.availability ? 'open' : ''}`}
            onClick={() => toggleAccordion('availability')}
          >
            <span>Availability</span>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
          {openAccordions.availability && (
            <div className="tb-accordion-body">
              {[
                { id: 'available', label: 'Available (Confirmed)' },
                { id: 'rac', label: 'RAC (Reservation Against Can.)' },
                { id: 'wl', label: 'Waitlisted (WL)' }
              ].map((av) => (
                <label key={av.id} className="tb-filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedAvailability.includes(av.id)}
                    onChange={(e) => {
                      setSelectedAvailability((prev) =>
                        e.target.checked ? [...prev, av.id] : prev.filter((x) => x !== av.id)
                      );
                    }}
                  />
                  {av.label}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Class */}
        <div className="tb-accordion-item">
          <div
            className={`tb-accordion-header ${openAccordions.ticketClass ? 'open' : ''}`}
            onClick={() => toggleAccordion('ticketClass')}
          >
            <span>Ticket Class</span>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
          {openAccordions.ticketClass && (
            <div className="tb-accordion-body">
              {[
                { code: '1A', name: 'AC 1st Class' },
                { code: '2A', name: 'AC 2 Tier' },
                { code: '3A', name: 'AC 3 Tier' },
                { code: '3E', name: '3 AC Economy' },
                { code: 'CC', name: 'AC Chair Car' },
                { code: 'EC', name: 'Exec. Chair Car' },
                { code: 'EA', name: 'Anubhuti Class' },
                { code: 'SL', name: 'Sleeper (SL)' },
                { code: '2S', name: 'Second Sitting (2S)' }
              ].map((c) => (
                <label key={c.code} className="tb-filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(c.code)}
                    onChange={(e) => {
                      setSelectedClasses((prev) =>
                        e.target.checked ? [...prev, c.code] : prev.filter((x) => x !== c.code)
                      );
                    }}
                  />
                  {c.code} - {c.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Quota */}
        <div className="tb-accordion-item">
          <div
            className={`tb-accordion-header ${openAccordions.quota ? 'open' : ''}`}
            onClick={() => toggleAccordion('quota')}
          >
            <span>Quota</span>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
          {openAccordions.quota && (
            <div className="tb-accordion-body">
              {[
                { id: 'general', label: 'General Quota' },
                { id: 'tatkal', label: 'Tatkal Quota' },
                { id: 'ladies', label: 'Ladies Quota' },
                { id: 'senior', label: 'Senior Citizen' }
              ].map((q) => (
                <label key={q.id} className="tb-filter-radio-label">
                  <input
                    type="radio"
                    name="quota_filter"
                    checked={selectedQuota === q.id}
                    onChange={() => setSelectedQuota(q.id as any)}
                  />
                  {q.label}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Departure Time */}
        <div className="tb-accordion-item">
          <div
            className={`tb-accordion-header ${openAccordions.departureTime ? 'open' : ''}`}
            onClick={() => toggleAccordion('departureTime')}
          >
            <span>Departure Time</span>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
          {openAccordions.departureTime && (
            <div className="tb-accordion-body">
              {[
                { id: 'early_morning', label: 'Early Morning (00:00 - 06:00)' },
                { id: 'morning', label: 'Morning (06:00 - 12:00)' },
                { id: 'afternoon', label: 'Afternoon (12:00 - 18:00)' },
                { id: 'night', label: 'Night (18:00 - 24:00)' }
              ].map((time) => (
                <label key={time.id} className="tb-filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedDepTimeRanges.includes(time.id)}
                    onChange={(e) => {
                      setSelectedDepTimeRanges((prev) =>
                        e.target.checked ? [...prev, time.id] : prev.filter((x) => x !== time.id)
                      );
                    }}
                  />
                  {time.label}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Departing Stations */}
        <div className="tb-accordion-item">
          <div
            className={`tb-accordion-header ${openAccordions.departingStations ? 'open' : ''}`}
            onClick={() => toggleAccordion('departingStations')}
          >
            <span>Departing Stations</span>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
          {openAccordions.departingStations && (
            <div className="tb-accordion-body">
              {availableDepartingStations.length > 0 ? (
                availableDepartingStations.map((st) => (
                  <label key={st.name} className="tb-filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedDepStations.includes(st.name) || selectedDepStations.includes(st.code)}
                      onChange={(e) => {
                        setSelectedDepStations((prev) =>
                          e.target.checked
                            ? [...prev, st.name, st.code]
                            : prev.filter((x) => x !== st.name && x !== st.code)
                        );
                      }}
                    />
                    {st.name} ({st.code})
                  </label>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: '#64748b' }}>No stations available</span>
              )}
            </div>
          )}
        </div>

        {/* Arriving Stations */}
        <div className="tb-accordion-item">
          <div
            className={`tb-accordion-header ${openAccordions.arrivingStations ? 'open' : ''}`}
            onClick={() => toggleAccordion('arrivingStations')}
          >
            <span>Arriving Stations</span>
            <i className="fa-solid fa-chevron-down"></i>
          </div>
          {openAccordions.arrivingStations && (
            <div className="tb-accordion-body">
              {availableArrivingStations.length > 0 ? (
                availableArrivingStations.map((st) => (
                  <label key={st.name} className="tb-filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedArrStations.includes(st.name) || selectedArrStations.includes(st.code)}
                      onChange={(e) => {
                        setSelectedArrStations((prev) =>
                          e.target.checked
                            ? [...prev, st.name, st.code]
                            : prev.filter((x) => x !== st.name && x !== st.code)
                        );
                      }}
                    />
                    {st.name} ({st.code})
                  </label>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: '#64748b' }}>No stations available</span>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

