'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  VehicleCategoryType,
  getBrandsForCategory,
  BrandInfo
} from './vehicleBrandsModelsData';
import './VehicleSelectorHeader.css';

interface VehicleSelectorHeaderProps {
  selectedVehicleType: VehicleCategoryType;
  onVehicleTypeChange: (type: VehicleCategoryType) => void;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  showToast: (msg: string) => void;
  onOpenSellVehicle: () => void;
  userCity: string;
}

const CATEGORY_TABS: { id: VehicleCategoryType; label: string; icon: string; desc: string }[] = [
  { id: 'All', label: 'All Vehicles', icon: 'fa-solid fa-shapes', desc: 'All personal & commercial vehicles' },
  { id: 'Car', label: 'Cars & SUVs', icon: 'fa-solid fa-car-side', desc: 'Hatchbacks, Sedans, SUVs & MUVs' },
  { id: 'Bike', label: 'Bikes & Scooters', icon: 'fa-solid fa-motorcycle', desc: 'Commuter, Sports, Scooters & Cruisers' },
  { id: 'Van', label: 'Commercial Vans', icon: 'fa-solid fa-van-shuttle', desc: 'Delivery vans & passenger shuttles' },
  { id: 'Bus', label: 'Buses', icon: 'fa-solid fa-bus', desc: 'Staff, school & luxury tourist coaches' },
  { id: 'Truck', label: 'Trucks / Lorries', icon: 'fa-solid fa-truck-moving', desc: 'Pickups, tippers & heavy haulage trucks' },
  { id: 'Tractor', label: 'Agri Tractors', icon: 'fa-solid fa-tractor', desc: 'Farm tractors & construction JCB equipment' },
  { id: 'Auto', label: '3-Wheelers', icon: 'fa-solid fa-trailer', desc: 'Passenger auto & cargo loader e-rickshaws' },
  { id: 'Electric', label: 'Electric (EV)', icon: 'fa-solid fa-bolt', desc: '100% Zero-emission electric fleet' }
];

export default function VehicleSelectorHeader({
  selectedVehicleType,
  onVehicleTypeChange,
  selectedBrand,
  onBrandChange,
  selectedModel,
  onModelChange,
  showToast,
  onOpenSellVehicle,
  userCity
}: VehicleSelectorHeaderProps) {
  // Category dropdown state
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Dropdown states for NEW / USED vehicle popovers
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [usedMenuOpen, setUsedMenuOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  // Cascading Brand & Model selector dropdowns
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');

  const headerRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
        setNewMenuOpen(false);
        setUsedMenuOpen(false);
        setActiveSubMenu(null);
        setBrandDropdownOpen(false);
        setModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine dynamic plural and singular labels for menus
  const getLabels = (cat: VehicleCategoryType) => {
    switch (cat) {
      case 'Bike':
        return { plural: 'Bikes', singular: 'Bike' };
      case 'Truck':
        return { plural: 'Trucks', singular: 'Truck' };
      case 'Auto':
        return { plural: '3-Wheelers', singular: 'Auto' };
      case 'Bus':
        return { plural: 'Buses', singular: 'Bus' };
      case 'Tractor':
        return { plural: 'Tractors', singular: 'Tractor' };
      case 'Van':
        return { plural: 'Vans', singular: 'Van' };
      case 'Electric':
        return { plural: 'EVs', singular: 'EV' };
      case 'All':
        return { plural: 'Vehicles', singular: 'Vehicle' };
      case 'Car':
      default:
        return { plural: 'Cars', singular: 'Car' };
    }
  };

  const { plural: typeLabel, singular: singularLabel } = getLabels(selectedVehicleType);
  const activeCategoryObj = CATEGORY_TABS.find(t => t.id === selectedVehicleType) || CATEGORY_TABS[0];

  // Active brands pool for selected category
  const currentBrandsMap = getBrandsForCategory(selectedVehicleType);
  const brandNames = Object.keys(currentBrandsMap);

  const filteredBrands = brandNames.filter(b =>
    b.toLowerCase().includes(brandSearchQuery.toLowerCase())
  );

  // Models for selected brand
  const currentBrandInfo: BrandInfo | undefined = currentBrandsMap[selectedBrand];
  const availableModels = currentBrandInfo ? currentBrandInfo.models : [];

  return (
    <div className="sart-vehicle-nav-selector-bar animate-fade-in" ref={headerRef}>
      <div className="vehicle-selector-inner-row">
        {/* 1. CHOOSE VEHICLE DROPDOWN SELECTOR (ALL 9 VEHICLE CATEGORIES) */}
        <div className="choose-vehicle-dropdown-wrapper">
          <button
            type="button"
            className={`choose-vehicle-dropdown-btn ${categoryDropdownOpen ? 'open' : ''}`}
            onClick={() => {
              setCategoryDropdownOpen(!categoryDropdownOpen);
              setNewMenuOpen(false);
              setUsedMenuOpen(false);
              setBrandDropdownOpen(false);
              setModelDropdownOpen(false);
            }}
          >
            <div className="choose-vehicle-btn-content">
              <i className="fa-solid fa-layer-group label-prefix-icon"></i>
              <span className="choose-vehicle-prefix">CHOOSE VEHICLE:</span>
              <span className="choose-vehicle-current-pill">
                <i className={activeCategoryObj.icon}></i>
                <strong>{activeCategoryObj.label}</strong>
              </span>
            </div>
            <i className={`fa-solid ${categoryDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'} caret-indicator`}></i>
          </button>

          {/* DROPDOWN MENU WITH ALL VEHICLES */}
          {categoryDropdownOpen && (
            <div className="choose-vehicle-dropdown-menu animate-fade-in">
              <div className="choose-dropdown-header">
                <i className="fa-solid fa-shapes"></i>
                <span>Select Vehicle ({CATEGORY_TABS.length} Categories)</span>
              </div>
              <div className="choose-dropdown-list">
                {CATEGORY_TABS.map(tab => {
                  const isSelected = selectedVehicleType === tab.id;
                  return (
                    <div
                      key={tab.id}
                      className={`choose-dropdown-option ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        onVehicleTypeChange(tab.id);
                        onBrandChange('');
                        onModelChange('');
                        setCategoryDropdownOpen(false);
                        showToast(`Selected: ${tab.label}`);
                      }}
                    >
                      <div className="option-info-group">
                        <div className={`option-icon-box ${isSelected ? 'selected' : ''}`}>
                          <i className={tab.icon}></i>
                        </div>
                        <div className="option-label-group">
                          <span className="option-title">{tab.label}</span>
                          <span className="option-sub">{tab.desc}</span>
                        </div>
                      </div>
                      {isSelected ? (
                        <i className="fa-solid fa-circle-check check-selected-icon"></i>
                      ) : (
                        <i className="fa-solid fa-chevron-right arrow-indicator"></i>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. DROPDOWN: NEW VEHICLE (IMAGE 1) */}
        <div className="nav-dropdown-wrapper">
          <button
            type="button"
            className={`nav-dropdown-trigger-btn ${newMenuOpen ? 'open' : ''}`}
            onClick={() => {
              setNewMenuOpen(!newMenuOpen);
              setUsedMenuOpen(false);
              setCategoryDropdownOpen(false);
              setBrandDropdownOpen(false);
              setModelDropdownOpen(false);
            }}
          >
            <span>NEW {typeLabel.toUpperCase()}</span>
            <i className={`fa-solid ${newMenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>

          {newMenuOpen && (
            <div className="nav-dropdown-popover animate-fade-in">
              <div
                className="dropdown-menu-item"
                onClick={() => {
                  showToast(`Explore all New ${typeLabel}`);
                  setNewMenuOpen(false);
                }}
              >
                <span>Explore New {typeLabel}</span>
              </div>

              <div
                className="dropdown-menu-item has-flyout"
                onMouseEnter={() => setActiveSubMenu('electric')}
                onClick={() => {
                  onVehicleTypeChange('Electric');
                  showToast(`Showing All Electric ${typeLabel}`);
                  setNewMenuOpen(false);
                }}
              >
                <span>All Electric {typeLabel}</span>
                <i className="fa-solid fa-chevron-right flyout-arrow"></i>

                {activeSubMenu === 'electric' && (
                  <div className="nested-flyout-menu animate-fade-in">
                    {(selectedVehicleType === 'Bike'
                      ? ['Ola Electric', 'Ather Energy', 'Vida (Hero)', 'Revolt', 'Chetak', 'TVS iQube']
                      : selectedVehicleType === 'Truck'
                        ? ['Euler HiLoad EV', 'Switch IeV3', 'Switch IeV4', 'Montra Eviator', 'Tata Ace EV']
                        : selectedVehicleType === 'Auto'
                          ? ['Mahindra Treo Zor', 'Piaggio Ape E-City', 'Altigreen neEV', 'Bajaj Chetak Auto']
                          : selectedVehicleType === 'Bus'
                            ? ['Olectra K9', 'JBM Eco-Life', 'Tata Ultra Urban EV']
                            : ['Tata Nexon EV', 'MG ZS EV', 'Mahindra XUV400', 'Hyundai Ioniq 5', 'BYD Atto 3']
                    ).map(m => (
                      <div
                        key={m}
                        className="flyout-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBrandChange(m.split(' ')[0]);
                          showToast(`Selected ${m}`);
                          setNewMenuOpen(false);
                        }}
                      >
                        <i className="fa-solid fa-bolt"></i>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="dropdown-menu-item has-flyout"
                onMouseEnter={() => setActiveSubMenu('popular')}
              >
                <span>Popular {typeLabel}</span>
                <i className="fa-solid fa-chevron-right flyout-arrow"></i>

                {activeSubMenu === 'popular' && (
                  <div className="nested-flyout-menu animate-fade-in">
                    {(selectedVehicleType === 'Truck'
                      ? ['Tata Ace Gold', 'Ashok Leyland Bada Dost', 'Mahindra Bolero Pik-Up', 'BharatBenz 1217C']
                      : selectedVehicleType === 'Auto'
                        ? ['Bajaj Maxima Z', 'Piaggio Ape DX', 'Mahindra Alfa', 'TVS King Deluxe']
                        : selectedVehicleType === 'Bus'
                          ? ['Tata Starbus', 'Force Traveller', 'Ashok Leyland Viking', 'Volvo 9600']
                          : selectedVehicleType === 'Tractor'
                            ? ['Mahindra Arjun Novo', 'Swaraj 744 FE', 'John Deere 5310', 'JCB 3DX Plus']
                            : selectedVehicleType === 'Bike'
                              ? ['Royal Enfield Classic 350', 'TVS Apache RTR', 'Yamaha MT-15', 'Hero Splendor+']
                              : ['Hyundai Creta', 'Maruti Suzuki Swift', 'Tata Nexon', 'Mahindra Scorpio-N', 'Honda City']
                    ).map(p => (
                      <div
                        key={p}
                        className="flyout-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Selected Popular ${p}`);
                          setNewMenuOpen(false);
                        }}
                      >
                        <i className="fa-solid fa-fire"></i>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="dropdown-menu-item"
                onClick={() => {
                  showToast(`Viewing Upcoming ${typeLabel} 2026`);
                  setNewMenuOpen(false);
                }}
              >
                <span>Upcoming {typeLabel}</span>
              </div>

              <div
                className="dropdown-menu-item"
                onClick={() => {
                  showToast(`New Launches in ${typeLabel}`);
                  setNewMenuOpen(false);
                }}
              >
                <span>New Launches</span>
              </div>

              <div
                className="dropdown-menu-item has-badge"
                onClick={() => {
                  showToast(`${singularLabel} Commercial & Personal Insurance: Save up to 75%`);
                  setNewMenuOpen(false);
                }}
              >
                <span>{singularLabel} Insurance</span>
                <span className="item-ad-badge">Ad</span>
              </div>

              <div
                className="dropdown-menu-item has-flyout"
                onMouseEnter={() => setActiveSubMenu('brands')}
              >
                <span>Popular Brands</span>
                <i className="fa-solid fa-chevron-right flyout-arrow"></i>

                {activeSubMenu === 'brands' && (
                  <div className="nested-flyout-menu brands-logo-grid-flyout animate-fade-in">
                    {brandNames.slice(0, 12).map(bName => {
                      const bObj = currentBrandsMap[bName];
                      return (
                        <div
                          key={bName}
                          className="flyout-brand-logo-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            onBrandChange(bName);
                            showToast(`Selected ${bName}`);
                            setNewMenuOpen(false);
                          }}
                        >
                          <img src={bObj.logo} alt={bName} className="brand-thumb-logo" />
                          <span>{bName}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div
                className="dropdown-menu-item"
                onClick={() => {
                  showToast(`Compare ${typeLabel}`);
                  setNewMenuOpen(false);
                }}
              >
                <span>Compare {typeLabel}</span>
              </div>

              <div
                className="dropdown-menu-item"
                onClick={() => {
                  showToast(`Active Offers & Discounts on ${typeLabel}`);
                  setNewMenuOpen(false);
                }}
              >
                <span>New {singularLabel} Offers &amp; Discounts</span>
              </div>

              <div
                className="dropdown-menu-item"
                onClick={() => {
                  showToast(`Finding Authorized ${typeLabel} Dealers near ${userCity}`);
                  setNewMenuOpen(false);
                }}
              >
                <span>Find {singularLabel} Dealers</span>
              </div>

              <div
                className="dropdown-menu-item"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/store/FindEVChargingStations');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                  showToast('Locating EV Charging Stations in ' + userCity);
                  setNewMenuOpen(false);
                }}
              >
                <span>Charging Station</span>
              </div>

              <div
                className="dropdown-menu-item"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const query = selectedVehicleType ? `?vehicleType=${selectedVehicleType}${selectedBrand ? `&brand=${encodeURIComponent(selectedBrand)}` : ''}` : '';
                    window.history.pushState({}, '', `/store/ServiceCenters${query}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                  showToast(`Listing Authorized ${selectedBrand ? selectedBrand + ' ' : ''}Service Centers in ${userCity}`);
                  setNewMenuOpen(false);
                }}
              >
                <span>Service Centers</span>
              </div>

              <div
                className="dropdown-menu-item"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/store/FuelStations');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                  showToast('Locating Fuel / Gas Stations near you');
                  setNewMenuOpen(false);
                }}
              >
                <span>Find Fuel Stations</span>
              </div>

              <div
                className="dropdown-menu-item"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/store/CheckFuelPrices');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                  showToast(`Daily Fuel Prices in ${userCity}`);
                  setNewMenuOpen(false);
                }}
              >
                <span>Check Fuel Prices</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. DROPDOWN: USED VEHICLE (IMAGE 2) */}
        <div className="nav-dropdown-wrapper">
          <button
            type="button"
            className={`nav-dropdown-trigger-btn ${usedMenuOpen ? 'open' : ''}`}
            onClick={() => {
              setUsedMenuOpen(!usedMenuOpen);
              setNewMenuOpen(false);
              setCategoryDropdownOpen(false);
              setBrandDropdownOpen(false);
              setModelDropdownOpen(false);
            }}
          >
            <span>USED {typeLabel.toUpperCase()}</span>
            <i className={`fa-solid ${usedMenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>

          {usedMenuOpen && (
            <div className="nav-dropdown-popover animate-fade-in">
              <div
                className="dropdown-menu-item"
                onClick={() => {
                  showToast(`Browsing Certified Used ${typeLabel}`);
                  setUsedMenuOpen(false);
                }}
              >
                <span>Buy Used {typeLabel}</span>
              </div>

              <div
                className="dropdown-menu-item has-flyout"
                onMouseEnter={() => setActiveSubMenu('city')}
              >
                <span>Used {typeLabel} In Your City</span>
                <i className="fa-solid fa-chevron-right flyout-arrow"></i>

                {activeSubMenu === 'city' && (
                  <div className="nested-flyout-menu animate-fade-in">
                    {['Chennai', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Coimbatore', 'Pune'].map(c => (
                      <div
                        key={c}
                        className="flyout-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Selected city: ${c}`);
                          setUsedMenuOpen(false);
                        }}
                      >
                        <i className="fa-solid fa-location-dot"></i>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="dropdown-menu-item"
                onClick={() => {
                  onOpenSellVehicle();
                  setUsedMenuOpen(false);
                }}
              >
                <span>Sell My {singularLabel}</span>
              </div>

              <div
                className="dropdown-menu-item"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/store/Buy&Sell/UsedCarValuation');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                  showToast(`Instant Used ${singularLabel} Valuation Calculator`);
                  onOpenSellVehicle();
                  setUsedMenuOpen(false);
                }}
              >
                <span>Used {singularLabel} Valuation</span>
              </div>

              <div
                className="dropdown-menu-item"
                onClick={() => {
                  showToast(`Verified Certified Dealerships in ${userCity}`);
                  setUsedMenuOpen(false);
                }}
              >
                <span>Dealership Near Me</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. SELL VEHICLE BUTTON */}
        <button
          type="button"
          className="btn-sell-vehicle-shortcut"
          onClick={onOpenSellVehicle}
        >
          <i className="fa-solid fa-tag"></i>
          <span>Sell {singularLabel}</span>
        </button>

        {/* 5. CASCADING SELECTOR: SELECT BRAND (WITH LOGOS) -> SELECT MODEL */}
        <div className="cascading-vehicle-selector-group">
          {/* Step A: Select Brand */}
          <div className="selector-field-wrap">
            <button
              type="button"
              className={`cascading-select-btn ${brandDropdownOpen ? 'active' : ''} ${selectedBrand ? 'has-value' : ''}`}
              onClick={() => {
                setBrandDropdownOpen(!brandDropdownOpen);
                setModelDropdownOpen(false);
                setNewMenuOpen(false);
                setUsedMenuOpen(false);
                setCategoryDropdownOpen(false);
              }}
            >
              {selectedBrand ? (
                <div className="selected-brand-pill">
                  {currentBrandsMap[selectedBrand]?.logo && (
                    <img
                      src={currentBrandsMap[selectedBrand].logo}
                      alt={selectedBrand}
                      className="brand-pill-logo"
                    />
                  )}
                  <span>{selectedBrand}</span>
                </div>
              ) : (
                <span className="placeholder-text">1. Select Brand</span>
              )}
              <i className="fa-solid fa-chevron-down"></i>
            </button>

            {brandDropdownOpen && (
              <div className="brand-select-dropdown-panel animate-fade-in">
                <div className="dropdown-search-strip">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <input
                    type="text"
                    placeholder={`Search ${typeLabel} Brand...`}
                    value={brandSearchQuery}
                    onChange={(e) => setBrandSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {brandSearchQuery && (
                    <button
                      type="button"
                      className="clear-search-btn"
                      onClick={() => setBrandSearchQuery('')}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  )}
                </div>

                <div className="brands-logo-grid-list">
                  {filteredBrands.map((bName) => {
                    const b = currentBrandsMap[bName];
                    const isSelected = selectedBrand === bName;
                    return (
                      <div
                        key={bName}
                        className={`brand-grid-tile ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          onBrandChange(bName);
                          onModelChange('');
                          setBrandDropdownOpen(false);
                          setModelDropdownOpen(true);
                          showToast(`Selected ${bName}`);
                        }}
                      >
                        <div className="brand-tile-logo-box">
                          <img src={b.logo} alt={bName} className="tile-logo-img" />
                        </div>
                        <span className="brand-tile-name">{bName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Step B: Select Model */}
          <div className="selector-field-wrap">
            <button
              type="button"
              className={`cascading-select-btn ${modelDropdownOpen ? 'active' : ''} ${selectedModel ? 'has-value' : ''}`}
              disabled={!selectedBrand}
              onClick={() => {
                if (!selectedBrand) return;
                setModelDropdownOpen(!modelDropdownOpen);
                setBrandDropdownOpen(false);
                setNewMenuOpen(false);
                setUsedMenuOpen(false);
                setCategoryDropdownOpen(false);
              }}
            >
              {selectedModel ? (
                <span className="selected-model-text">{selectedModel}</span>
              ) : (
                <span className="placeholder-text">
                  {selectedBrand ? `2. Choose ${selectedBrand} Model` : '2. Select Model'}
                </span>
              )}
              <i className="fa-solid fa-chevron-down"></i>
            </button>

            {modelDropdownOpen && selectedBrand && (
              <div className="model-select-dropdown-panel animate-fade-in">
                <div className="model-panel-header">
                  <span>Models for <strong>{selectedBrand}</strong> ({availableModels.length}):</span>
                </div>
                <div className="model-chips-grid">
                  {availableModels.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`model-select-chip ${selectedModel === m ? 'active' : ''}`}
                      onClick={() => {
                        onModelChange(m);
                        setModelDropdownOpen(false);
                        showToast(`Selected ${selectedBrand} ${m}`);
                      }}
                    >
                      <span>{m}</span>
                      {selectedModel === m && <i className="fa-solid fa-check"></i>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear / Reset Button if Brand or Model selected */}
          {(selectedBrand || selectedModel) && (
            <button
              type="button"
              className="btn-clear-vehicle-selection"
              onClick={() => {
                onBrandChange('');
                onModelChange('');
                showToast('Cleared vehicle brand and model selection');
              }}
              title="Clear brand & model"
            >
              <i className="fa-solid fa-xmark"></i>
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
