import React from 'react';

export interface BusFilterSidebarProps {
  clearAllFilters: () => void;
  aiFilterText: string;
  setAiFilterText: (v: string) => void;
  filterPrimo: boolean;
  setFilterPrimo: (v: boolean) => void;
  filterFreeCancel: boolean;
  setFilterFreeCancel: (v: boolean) => void;
  filterElectric?: boolean;
  setFilterElectric?: (v: boolean) => void;
  filterLiveTrack: boolean;
  setFilterLiveTrack: (v: boolean) => void;
  filterAC: boolean;
  setFilterAC: (v: boolean) => void;
  filterNonAC: boolean;
  setFilterNonAC: (v: boolean) => void;
  filterSleeper: boolean;
  setFilterSleeper: (v: boolean) => void;
  filterSeater: boolean;
  setFilterSeater: (v: boolean) => void;
  filterSingleSeats: boolean;
  setFilterSingleSeats: (v: boolean) => void;
  filterHighRated: boolean;
  setFilterHighRated: (v: boolean) => void;
  filterNightBus?: boolean;
  setFilterNightBus?: (v: boolean) => void;
  filterGovtRTC?: boolean;
  setFilterGovtRTC?: (v: boolean) => void;
  accordionsOpen: Record<string, boolean>;
  toggleAccordion: (key: string) => void;
  selectedDepTimes: string[];
  setSelectedDepTimes: any;
  toggleSelection: (list: string[], setter: any, val: string) => void;
  selectedBusTypes: string[];
  setSelectedBusTypes: any;
  selectedSeatTypes?: string[];
  setSelectedSeatTypes?: any;
  selectedArrTimes: string[];
  setSelectedArrTimes: any;
  searchOperator: string;
  setSearchOperator: (v: string) => void;
  selectedOperators: string[];
  setSelectedOperators: any;
  searchBoarding: string;
  setSearchBoarding: (v: string) => void;
  selectedBoarding: string[];
  setSelectedBoarding: any;
  searchDropping: string;
  setSearchDropping: (v: string) => void;
  selectedDropping: string[];
  setSelectedDropping: any;
  amenitiesList?: Array<{ label: string; icon: string; count: number }>;
  selectedAmenities: string[];
  setSelectedAmenities: any;
  selectedSpecial?: string[];
  setSelectedSpecial?: any;
  selectedRtc?: string[];
  setSelectedRtc?: any;
}

export const BusFilterSidebar: React.FC<BusFilterSidebarProps> = (props) => {
  const {
    clearAllFilters, aiFilterText, setAiFilterText, filterPrimo, setFilterPrimo,
    filterFreeCancel, setFilterFreeCancel, filterElectric, setFilterElectric,
    filterLiveTrack, setFilterLiveTrack, filterAC, setFilterAC, filterNonAC, setFilterNonAC,
    filterSleeper, setFilterSleeper, filterSeater, setFilterSeater, filterSingleSeats, setFilterSingleSeats,
    filterHighRated, setFilterHighRated, filterNightBus, setFilterNightBus, filterGovtRTC, setFilterGovtRTC,
    accordionsOpen, toggleAccordion, selectedDepTimes, setSelectedDepTimes, toggleSelection,
    selectedBusTypes, setSelectedBusTypes,
    selectedArrTimes, setSelectedArrTimes, searchOperator, setSearchOperator,
    selectedOperators, setSelectedOperators, searchBoarding, setSearchBoarding,
    selectedBoarding, setSelectedBoarding, searchDropping, setSearchDropping,
    selectedDropping, setSelectedDropping, selectedAmenities, setSelectedAmenities,
    selectedSpecial = [], setSelectedSpecial = () => {},
    selectedRtc = [], setSelectedRtc = () => {}
  } = props;

  const defaultAmenities = [
    { label: 'Live Tracking', icon: 'fa-location-crosshairs', count: 118 },
    { label: 'Water Bottle', icon: 'fa-bottle-water', count: 104 },
    { label: 'Blankets', icon: 'fa-bed', count: 96 },
    { label: 'Charging Point', icon: 'fa-plug', count: 112 },
    { label: 'Reading Light', icon: 'fa-lightbulb', count: 88 }
  ];

  return (
    <aside className="bb-filter-sidebar">
      <div className="bb-filter-header">
        <h3 className="bb-filter-title">Filter buses</h3>
        <button
          type="button"
          className="bb-clear-filters-btn"
          onClick={clearAllFilters}
          title="Reset all applied filters"
        >
          Clear all
        </button>
      </div>

      {/* AI Smart Filter */}
      <div className="bb-ai-smart-filter">
        <span className="bb-ai-tag">AI SMART FILTER</span>
        <div className="bb-ai-input-wrap">
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#8b5cf6', fontSize: '13px' }}></i>
          <input
            type="text"
            className="bb-ai-input-field"
            placeholder='Try "Morning bus under ₹1000"'
            value={aiFilterText}
            onChange={(e) => setAiFilterText(e.target.value)}
          />
          <i className="fa-solid fa-microphone bb-ai-mic" title="Voice Search" onClick={() => setAiFilterText('Morning bus under ₹1000')}></i>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="bb-chips-grid">
        <button
          className={`bb-chip ${filterPrimo ? 'active' : ''}`}
          onClick={() => setFilterPrimo(!filterPrimo)}
        >
          <i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i>
          <span>Primo Bus</span>
        </button>
        <button
          className={`bb-chip ${filterFreeCancel ? 'active' : ''}`}
          onClick={() => setFilterFreeCancel(!filterFreeCancel)}
        >
          <i className="fa-solid fa-shield-halved" style={{ color: '#16a34a' }}></i>
          <span>Free Cancellation</span>
        </button>
        {setFilterElectric && (
          <button
            className={`bb-chip ${filterElectric ? 'active' : ''}`}
            onClick={() => setFilterElectric(!filterElectric)}
          >
            <i className="fa-solid fa-bolt" style={{ color: '#059669' }}></i>
            <span>Electric</span>
          </button>
        )}
        <button
          className={`bb-chip ${filterLiveTrack ? 'active' : ''}`}
          onClick={() => setFilterLiveTrack(!filterLiveTrack)}
        >
          <i className="fa-solid fa-satellite-dish" style={{ color: '#2563eb' }}></i>
          <span>Live Tracking</span>
        </button>
        <button
          className={`bb-chip ${filterAC ? 'active' : ''}`}
          onClick={() => setFilterAC(!filterAC)}
        >
          <i className="fa-solid fa-snowflake" style={{ color: '#0ea5e9' }}></i>
          <span>AC</span>
        </button>
        <button
          className={`bb-chip ${filterNonAC ? 'active' : ''}`}
          onClick={() => setFilterNonAC(!filterNonAC)}
        >
          <i className="fa-solid fa-fan" style={{ color: '#64748b' }}></i>
          <span>Non AC</span>
        </button>
        <button
          className={`bb-chip ${filterSleeper ? 'active' : ''}`}
          onClick={() => setFilterSleeper(!filterSleeper)}
        >
          <i className="fa-solid fa-bed" style={{ color: '#8b5cf6' }}></i>
          <span>Sleeper</span>
        </button>
        <button
          className={`bb-chip ${filterSeater ? 'active' : ''}`}
          onClick={() => setFilterSeater(!filterSeater)}
        >
          <i className="fa-solid fa-chair" style={{ color: '#6366f1' }}></i>
          <span>Seater</span>
        </button>
        <button
          className={`bb-chip ${filterSingleSeats ? 'active' : ''}`}
          onClick={() => setFilterSingleSeats(!filterSingleSeats)}
        >
          <i className="fa-solid fa-user" style={{ color: '#ec4899' }}></i>
          <span>Single Seats</span>
        </button>
        <button
          className={`bb-chip ${filterHighRated ? 'active' : ''}`}
          onClick={() => setFilterHighRated(!filterHighRated)}
        >
          <i className="fa-solid fa-thumbs-up" style={{ color: '#f59e0b' }}></i>
          <span>High Rated</span>
        </button>
        {setFilterNightBus && (
          <button
            className={`bb-chip ${filterNightBus ? 'active' : ''}`}
            onClick={() => setFilterNightBus(!filterNightBus)}
          >
            <i className="fa-solid fa-moon" style={{ color: '#6366f1' }}></i>
            <span>Night Bus</span>
          </button>
        )}
        {setFilterGovtRTC && (
          <button
            className={`bb-chip ${filterGovtRTC ? 'active' : ''}`}
            onClick={() => setFilterGovtRTC(!filterGovtRTC)}
          >
            <i className="fa-solid fa-bus-simple" style={{ color: '#b91c1c' }}></i>
            <span>Govt RTC</span>
          </button>
        )}
      </div>

      <div className="bb-accordion-list">
        {/* Departure Time Accordion */}
        <div className="bb-accordion-item">
          <div className="bb-accordion-header" onClick={() => toggleAccordion('depTime')}>
            <span>Departure time</span>
            <i className={`fa-solid fa-chevron-${accordionsOpen.depTime ? 'up' : 'down'}`}></i>
          </div>
          {accordionsOpen.depTime && (
            <div className="bb-accordion-content">
              {[
                { label: 'Morning 06:00 - 12:00', count: 18 },
                { label: 'Afternoon 12:00 - 18:00', count: 24 },
                { label: 'Evening 18:00 - 24:00', count: 42 },
                { label: 'Night 00:00 - 06:00', count: 14 }
              ].map((time) => (
                <label key={time.label} className="bb-filter-row-checkbox">
                  <div className="bb-cb-left">
                    <input
                      type="checkbox"
                      checked={selectedDepTimes.includes(time.label)}
                      onChange={() => toggleSelection(selectedDepTimes, setSelectedDepTimes, time.label)}
                    />
                    <span>{time.label}</span>
                  </div>
                  <span className="bb-filter-item-count">{time.count}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Bus Types Accordion */}
        <div className="bb-accordion-item">
          <div className="bb-accordion-header" onClick={() => toggleAccordion('busType')}>
            <span>Bus types</span>
            <i className={`fa-solid fa-chevron-${accordionsOpen.busType ? 'up' : 'down'}`}></i>
          </div>
          {accordionsOpen.busType && (
            <div className="bb-accordion-content">
              {[
                { label: 'VOLVO', count: 22 },
                { label: 'SCANIA', count: 16 },
                { label: 'BHARAT BENZ', count: 14 },
                { label: 'ELECTRIC EV', count: 8 },
                { label: 'MERCEDES BENZ', count: 6 }
              ].map((bt) => (
                <label key={bt.label} className="bb-filter-row-checkbox">
                  <div className="bb-cb-left">
                    <input
                      type="checkbox"
                      checked={selectedBusTypes.includes(bt.label)}
                      onChange={() => toggleSelection(selectedBusTypes, setSelectedBusTypes, bt.label)}
                    />
                    <span>{bt.label}</span>
                  </div>
                  <span className="bb-filter-item-count">{bt.count}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Operators Accordion */}
        <div className="bb-accordion-item">
          <div className="bb-accordion-header" onClick={() => toggleAccordion('operator')}>
            <span>Bus operators</span>
            <i className={`fa-solid fa-chevron-${accordionsOpen.operator ? 'up' : 'down'}`}></i>
          </div>
          {accordionsOpen.operator && (
            <div className="bb-accordion-content">
              <div className="bb-search-filter-input-wrap">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search operator"
                  value={searchOperator}
                  onChange={(e) => setSearchOperator(e.target.value)}
                />
              </div>
              {[
                { label: 'V Kaveri Travels', count: 6 },
                { label: 'IntrCity SmartBus', count: 8 },
                { label: 'SRM TRANSPORTS', count: 12 },
                { label: 'ORANGE TOURS AND TRAVELS', count: 10 },
                { label: 'FRESHBUS', count: 4 },
                { label: 'Morning Star Travels', count: 7 }
              ]
                .filter(op => op.label.toLowerCase().includes(searchOperator.toLowerCase()))
                .map((op) => (
                  <label key={op.label} className="bb-filter-row-checkbox">
                    <div className="bb-cb-left">
                      <input
                        type="checkbox"
                        checked={selectedOperators.includes(op.label)}
                        onChange={() => toggleSelection(selectedOperators, setSelectedOperators, op.label)}
                      />
                      <span>{op.label}</span>
                    </div>
                    <span className="bb-filter-item-count">{op.count}</span>
                  </label>
                ))}
            </div>
          )}
        </div>

        {/* Boarding Points Accordion */}
        <div className="bb-accordion-item">
          <div className="bb-accordion-header" onClick={() => toggleAccordion('boarding')}>
            <span>Boarding points</span>
            <i className={`fa-solid fa-chevron-${accordionsOpen.boarding ? 'up' : 'down'}`}></i>
          </div>
          {accordionsOpen.boarding && (
            <div className="bb-accordion-content">
              <div className="bb-search-filter-input-wrap">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search boarding point"
                  value={searchBoarding}
                  onChange={(e) => setSearchBoarding(e.target.value)}
                />
              </div>
              {[
                { label: 'Central Hub', count: 14 },
                { label: 'Highway Bypass', count: 12 },
                { label: 'Main Bus Stand', count: 10 },
                { label: 'Ring Road Toll', count: 8 }
              ]
                .filter(b => b.label.toLowerCase().includes(searchBoarding.toLowerCase()))
                .map((bp) => (
                  <label key={bp.label} className="bb-filter-row-checkbox">
                    <div className="bb-cb-left">
                      <input
                        type="checkbox"
                        checked={selectedBoarding.includes(bp.label)}
                        onChange={() => toggleSelection(selectedBoarding, setSelectedBoarding, bp.label)}
                      />
                      <span>{bp.label}</span>
                    </div>
                    <span className="bb-filter-item-count">{bp.count}</span>
                  </label>
                ))}
            </div>
          )}
        </div>

        {/* Dropping Points Accordion */}
        <div className="bb-accordion-item">
          <div className="bb-accordion-header" onClick={() => toggleAccordion('dropping')}>
            <span>Dropping points</span>
            <i className={`fa-solid fa-chevron-${accordionsOpen.dropping ? 'up' : 'down'}`}></i>
          </div>
          {accordionsOpen.dropping && (
            <div className="bb-accordion-content">
              <div className="bb-search-filter-input-wrap">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search dropping point"
                  value={searchDropping}
                  onChange={(e) => setSearchDropping(e.target.value)}
                />
              </div>
              {[
                { label: 'Terminal Gateway', count: 14 },
                { label: 'Central Junction', count: 12 },
                { label: 'City Hub Drop', count: 10 },
                { label: 'Highway Exit', count: 8 }
              ]
                .filter(d => d.label.toLowerCase().includes(searchDropping.toLowerCase()))
                .map((dp) => (
                  <label key={dp.label} className="bb-filter-row-checkbox">
                    <div className="bb-cb-left">
                      <input
                        type="checkbox"
                        checked={selectedDropping.includes(dp.label)}
                        onChange={() => toggleSelection(selectedDropping, setSelectedDropping, dp.label)}
                      />
                      <span>{dp.label}</span>
                    </div>
                    <span className="bb-filter-item-count">{dp.count}</span>
                  </label>
                ))}
            </div>
          )}
        </div>

        {/* Amenities Accordion */}
        <div className="bb-accordion-item">
          <div className="bb-accordion-header" onClick={() => toggleAccordion('amenities')}>
            <span>Amenities</span>
            <i className={`fa-solid fa-chevron-${accordionsOpen.amenities ? 'up' : 'down'}`}></i>
          </div>
          {accordionsOpen.amenities && (
            <div className="bb-accordion-content">
              {defaultAmenities.map((am) => (
                <label key={am.label} className="bb-filter-row-checkbox">
                  <div className="bb-cb-left">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(am.label)}
                      onChange={() => toggleSelection(selectedAmenities, setSelectedAmenities, am.label)}
                    />
                    <i className={`fa-solid ${am.icon} bb-filter-sub-icon`}></i>
                    <span>{am.label}</span>
                  </div>
                  <span className="bb-filter-item-count">{am.count}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
