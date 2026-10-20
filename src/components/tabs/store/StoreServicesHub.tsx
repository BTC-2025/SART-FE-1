'use client';

import React, { useState, useMemo } from 'react';
import {
  StoreProduct,
  formatPrice,
  ALL_STORE_PRODUCTS,
  VEHICLE_TYPES,
  YEARS_LIST
} from '../storeProductsData';
import {
  ACCESSORIES_POINTS,
  AccessoriesStorePoint
} from '../storeSparesAccessoriesData';

interface StoreServicesHubProps {
  showToast: (msg: string) => void;
  setSelectedProductModal: (product: StoreProduct) => void;
  handleAddToCart: (product: StoreProduct) => void;
  selectedVehicleType: string;
  selectedBrand: string;
  selectedModel: string;
  selectedYear: string;
  selectedFuel: string;
  setSelectedFuel: (fuel: string) => void;
  appliedVehicleSearch: {
    type: string;
    brand: string;
    model: string;
    year: string;
    fuel: string;
    category: string;
  } | null;
  handleVehicleTypeChange: (type: string) => void;
  availableBrands: string[];
  handleBrandChange: (brand: string) => void;
  setSelectedModel: (model: string) => void;
  availableModels: string[];
  setSelectedYear: (year: string) => void;
  handleApplyVehicleSearch: () => void;
  userLocationCity: string;
  setUserLocationCity: (city: string) => void;
  selectedEquipment: Record<string, string[]>;
  getProductTotalPrice: (product: StoreProduct) => number;
}

export default function StoreServicesHub({
  showToast,
  setSelectedProductModal,
  handleAddToCart,
  selectedVehicleType,
  selectedBrand,
  selectedModel,
  selectedYear,
  selectedFuel,
  setSelectedFuel,
  appliedVehicleSearch,
  handleVehicleTypeChange,
  availableBrands,
  handleBrandChange,
  setSelectedModel,
  availableModels,
  setSelectedYear,
  handleApplyVehicleSearch,
  userLocationCity,
  setUserLocationCity,
  selectedEquipment,
  getProductTotalPrice
}: StoreServicesHubProps) {
  const [activeServiceTab, setActiveServiceTab] = useState<'packages' | 'service_centers'>('packages');
  const [mechanicCategoryFilter, setMechanicCategoryFilter] = useState<string>('All Services');
  const [locationSearchInput, setLocationSearchInput] = useState<string>('');

  // Effective vehicle type
  const effectiveVehType = appliedVehicleSearch ? appliedVehicleSearch.type : selectedVehicleType;

  // Filter service packages by vehicle & category
  const filteredServices = useMemo(() => {
    return ALL_STORE_PRODUCTS
      .filter((item) => item.isService)
      .filter((item) => {
        // Vehicle filter
        if (effectiveVehType) {
          const vTypeLower = effectiveVehType.toLowerCase();
          const itemVeh = (item.vehicle || '').toLowerCase();
          const compat = (item.compatibleWith || '').toLowerCase();
          const match = itemVeh === 'universal' || itemVeh === vTypeLower || compat.includes(vTypeLower) || compat.includes('all');
          if (!match) return false;
        }

        // Category filter
        if (mechanicCategoryFilter === 'All Services') return true;
        const blob = `${item.name} ${item.desc} ${item.section} ${item.category}`.toLowerCase();
        if (mechanicCategoryFilter === 'Periodic Services') return blob.includes('periodic') || blob.includes('engine oil') || blob.includes('tune-up');
        if (mechanicCategoryFilter === 'AC Service & Repair') return blob.includes('ac') || blob.includes('gas') || blob.includes('cooling');
        if (mechanicCategoryFilter === 'Brakes & Clutch') return blob.includes('brake') || blob.includes('caliper') || blob.includes('clutch');
        if (mechanicCategoryFilter === 'Tyres & Wheel Care') return blob.includes('tyre') || blob.includes('wheel') || blob.includes('puncture');
        if (mechanicCategoryFilter === 'Cleaning & Detailing') return blob.includes('ceramic') || blob.includes('wash') || blob.includes('polish') || blob.includes('clean');
        if (mechanicCategoryFilter === 'Custom Tuning & Mods') return blob.includes('remap') || blob.includes('wrap') || blob.includes('exhaust') || blob.includes('modification') || blob.includes('ambient');
        if (mechanicCategoryFilter === 'Authorized Workshop') return blob.includes('authorized') || blob.includes('service center');
        if (mechanicCategoryFilter === 'Heavy Commercial Fleet') return blob.includes('lorry') || blob.includes('commercial') || blob.includes('fleet') || blob.includes('auto');
        return true;
      });
  }, [effectiveVehType, mechanicCategoryFilter]);

  // Filter nearby service centers by location and vehicle
  const filteredServiceCenters = useMemo(() => {
    return ACCESSORIES_POINTS.filter((store) => {
      // 1. City / Location match
      const currentCity = (userLocationCity || 'Chennai').toLowerCase();
      const storeCity = (store.city || '').toLowerCase();
      const storeArea = (store.area || '').toLowerCase();
      const storeAddress = (store.address || '').toLowerCase();
      const query = locationSearchInput.toLowerCase().trim();

      const cityMatch = storeCity.includes(currentCity) || currentCity.includes(storeCity);
      if (!cityMatch && !query) return false;

      if (query) {
        const matchesQuery = storeCity.includes(query) || storeArea.includes(query) || storeAddress.includes(query) || store.name.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // 2. Vehicle Type match
      if (effectiveVehType) {
        const vTypeLower = effectiveVehType.toLowerCase();
        const storeVeh = (store.vehicleType || '').toLowerCase();
        if (storeVeh && storeVeh !== 'universal' && !storeVeh.includes(vTypeLower) && !vTypeLower.includes(storeVeh)) {
          return false;
        }
      }

      return true;
    });
  }, [userLocationCity, locationSearchInput, effectiveVehType]);

  return (
    <section className="gomechanic-hub-view animate-pop">
      {/* 1. TOP FITMENT SELECTOR BAR: Select Your Vehicle */}
      <div className="boodmo-fitment-selector-card">
        <div className="fitment-header-row">
          <div className="fitment-title-wrap">
            <i className="fa-solid fa-screwdriver-wrench"></i>
            <div>
              <h3>Choose Your Vehicle For Guaranteed Service Compatibility</h3>
              <p>Select vehicle make, model &amp; year to find certified doorstep mechanics and authorized local service centers.</p>
            </div>
          </div>

          <div className="fitment-actions-wrap">
            {appliedVehicleSearch && (
              <div className="active-fitment-badge">
                <i className="fa-solid fa-circle-check"></i>
                <span>Vehicle: <strong>{appliedVehicleSearch.year} {appliedVehicleSearch.brand} {appliedVehicleSearch.model}</strong></span>
              </div>
            )}
          </div>
        </div>

        <div className="boodmo-dropdown-row">
          {/* 1. Vehicle Type */}
          <div className="boodmo-select-col">
            <label><i className="fa-solid fa-shapes"></i> 1. Vehicle Type</label>
            <select
              value={selectedVehicleType}
              onChange={(e) => handleVehicleTypeChange(e.target.value)}
            >
              <option value="">Select Vehicle Type</option>
              {VEHICLE_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Brand / Make */}
          <div className="boodmo-select-col">
            <label><i className="fa-solid fa-copyright"></i> 2. Brand / Make</label>
            <select
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              disabled={!selectedVehicleType}
            >
              <option value="">Select Brand</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* 3. Model */}
          <div className="boodmo-select-col">
            <label><i className="fa-solid fa-car-rear"></i> 3. Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
            >
              <option value="">Select Model</option>
              {availableModels.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* 4. Year */}
          <div className="boodmo-select-col">
            <label><i className="fa-regular fa-calendar-check"></i> 4. Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={!selectedModel}
            >
              <option value="">Select Year</option>
              {YEARS_LIST.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* 5. Fuel / Variant */}
          <div className="boodmo-select-col">
            <label><i className="fa-solid fa-gas-pump"></i> 5. Fuel / Variant</label>
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              disabled={!selectedYear}
            >
              <option value="">Select Fuel</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric (EV)</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* 6. Find Button */}
          <div className="boodmo-btn-col">
            <button
              type="button"
              className="btn-boodmo-find-parts"
              onClick={handleApplyVehicleSearch}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
              <span>Find Services</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top View Switcher & Location Search Bar */}
      <div className="service-hub-switch-bar">
        <div className="service-tab-toggle-wrap">
          <button
            type="button"
            className={`service-tab-btn ${activeServiceTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveServiceTab('packages')}
          >
            <i className="fa-solid fa-screwdriver-wrench"></i>
            <span>Doorstep &amp; Workshop Packages ({filteredServices.length})</span>
          </button>
          <button
            type="button"
            className={`service-tab-btn ${activeServiceTab === 'service_centers' ? 'active' : ''}`}
            onClick={() => setActiveServiceTab('service_centers')}
          >
            <i className="fa-solid fa-map-location-dot"></i>
            <span>Nearby Service Centers &amp; Workshops 📍 ({filteredServiceCenters.length})</span>
          </button>
        </div>

        {/* Location Enter Search Bar */}
        <div className="service-location-filter-box">
          <i className="fa-solid fa-location-dot"></i>
          <input
            type="text"
            placeholder={`Enter area or city (e.g. ${userLocationCity || 'Chennai'}, Anna Nagar, Guindy)...`}
            value={locationSearchInput}
            onChange={(e) => setLocationSearchInput(e.target.value)}
            className="service-location-input"
          />
          {locationSearchInput && (
            <button
              type="button"
              className="btn-clear-loc-search"
              onClick={() => setLocationSearchInput('')}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      {/* 3. TAB CONTENT 1: SERVICE PACKAGES */}
      {activeServiceTab === 'packages' && (
        <div className="store-split-layout">
          {/* LEFT SIDEBAR: Service Categories */}
          <aside className="store-left-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-header">
                <h4><i className="fa-solid fa-screwdriver-wrench"></i> Service Packages</h4>
                <button
                  type="button"
                  className="cb360-clear-btn"
                  onClick={() => setMechanicCategoryFilter('All Services')}
                >
                  Reset
                </button>
              </div>

              <div className="sidebar-nav-pills">
                {[
                  { id: 'All Services', label: 'All Workshop Services', icon: 'fa-globe' },
                  { id: 'Periodic Services', label: 'Periodic Maintenance', icon: 'fa-oil-can' },
                  { id: 'AC Service & Repair', label: 'AC Deep Clean & Gas', icon: 'fa-snowflake' },
                  { id: 'Brakes & Clutch', label: 'Brakes & Clutch Overhaul', icon: 'fa-circle-dot' },
                  { id: 'Tyres & Wheel Care', label: 'Tyres & Wheel Alignment', icon: 'fa-circle-notch' },
                  { id: 'Cleaning & Detailing', label: 'Car Spa & Ceramic Polish', icon: 'fa-sparkles' },
                  { id: 'Custom Tuning & Mods', label: 'ECU Remap & Modifications', icon: 'fa-wand-magic-sparkles' },
                  { id: 'Authorized Workshop', label: 'Authorized Center Stamp', icon: 'fa-building-shield' },
                  { id: 'Heavy Commercial Fleet', label: 'Heavy Truck & Bus Fleet', icon: 'fa-truck-moving' },
                ].map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    className={`sidebar-nav-item ${mechanicCategoryFilter === srv.id ? 'active' : ''}`}
                    onClick={() => {
                      setMechanicCategoryFilter(srv.id);
                      showToast(`Filtered by ${srv.label}`);
                    }}
                  >
                    <i className={`fa-solid ${srv.icon}`}></i>
                    <span>{srv.label}</span>
                  </button>
                ))}
              </div>

              {/* Live Support Box */}
              <div className="sidebar-trust-box gomechanic-trust" style={{ marginTop: '16px' }}>
                <i className="fa-solid fa-headset"></i>
                <div>
                  <strong>Need Advice on Repairs?</strong>
                  <p>Talk to our master automotive mechanics for instant diagnosis &amp; upfront pricing.</p>
                  <button
                    type="button"
                    className="btn-call-mechanic-sidebar"
                    onClick={() => showToast('Calling SART Mechanic Advisor Hotline (1800-SART-TECH)...')}
                  >
                    <i className="fa-solid fa-phone"></i> Call Service Advisor
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT: Service Cards */}
          <main className="store-right-content">
            <div className="content-top-status-bar">
              <div>
                <h3 className="content-heading">
                  {effectiveVehType
                    ? `Doorstep & Workshop Services for ${appliedVehicleSearch ? `${appliedVehicleSearch.brand} ${appliedVehicleSearch.model}` : effectiveVehType}`
                    : 'Select Vehicle Service or Custom Repair Package'}
                </h3>
                <p className="content-subtext">
                  Showing {filteredServices.length} verified packages with 1000 km warranty &amp; live doorstep update tracking.
                </p>
              </div>

              {effectiveVehType && (
                <div className="gomechanic-active-veh-pill">
                  <i className="fa-solid fa-car"></i>
                  <span>Service For: <strong>{effectiveVehType}</strong></span>
                </div>
              )}
            </div>

            <div className="gomechanic-packages-grid">
              {filteredServices.map((service) => {
                const includesList = service.includes || [];
                const chosenAddOns = selectedEquipment[service.id] ?? [];
                const totalCost = getProductTotalPrice(service);

                return (
                  <div
                    key={service.id}
                    className="gomechanic-card cursor-pointer"
                    onClick={() => setSelectedProductModal(service)}
                  >
                    <div className="gm-card-header">
                      <div className="gm-header-left">
                        <span className="gm-duration-tag"><i className="fa-regular fa-clock"></i> {service.duration || '2-3 Hrs'}</span>
                        {service.warranty && (
                          <span className="gm-warranty-tag"><i className="fa-solid fa-shield"></i> {service.warranty}</span>
                        )}
                      </div>
                      <span className="gm-pickup-pill"><i className="fa-solid fa-truck-pickup"></i> Free Pick-up</span>
                    </div>

                    <div className="gm-card-body">
                      <div className="gm-title-media-row">
                        <div className="gm-info-col">
                          <h4 className="gm-service-name">{service.name}</h4>
                          <p className="gm-service-desc">{service.desc}</p>
                        </div>
                        <img src={service.image} alt={service.name} className="gm-thumb" />
                      </div>

                      {/* Inclusions */}
                      {includesList.length > 0 && (
                        <div className="gm-inclusions-box">
                          <div className="inclusions-title"><i className="fa-solid fa-clipboard-check"></i> What's Included:</div>
                          <div className="inclusions-grid">
                            {includesList.slice(0, 4).map((inc, i) => (
                              <div key={i} className="inclusion-item">
                                <i className="fa-solid fa-check"></i>
                                <span>{inc}</span>
                              </div>
                            ))}
                            {includesList.length > 4 && (
                              <span className="inclusions-more">+{includesList.length - 4} more inspection points</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Card Footer */}
                      <div className="gm-card-footer">
                        <div className="gm-pricing">
                          <span className="gm-cost">{formatPrice(totalCost)}</span>
                          {service.originalPrice && (
                            <span className="gm-original-cost">{formatPrice(service.originalPrice)}</span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="btn-book-service"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(service);
                          }}
                        >
                          <i className="fa-solid fa-calendar-check"></i>
                          <span>Book Service</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      )}

      {/* 4. TAB CONTENT 2: NEARBY SERVICE CENTERS & WORKSHOPS */}
      {activeServiceTab === 'service_centers' && (
        <div className="nearby-service-centers-view">
          <div className="service-center-results-banner">
            <div>
              <h3>
                <i className="fa-solid fa-building-circle-check"></i>{' '}
                Authorized Service Stations in {userLocationCity || 'Chennai'}
              </h3>
              <p>Certified multi-brand mechanic workshops equipped with computerized bay scanners &amp; cashless warranty claims.</p>
            </div>
            <span className="sc-count-badge">{filteredServiceCenters.length} Stations Found</span>
          </div>

          <div className="service-centers-grid">
            {filteredServiceCenters.map((center) => (
              <div key={center.id} className="service-center-card">
                <div className="sc-card-top">
                  <div className="sc-badge-row">
                    <span className="sc-type-pill">
                      <i className="fa-solid fa-shield-halved"></i> Authorized Station
                    </span>
                    <span className="sc-distance-pill">
                      <i className="fa-solid fa-location-arrow"></i> {center.distance}
                    </span>
                  </div>
                  <h4 className="sc-title">{center.name}</h4>
                  <p className="sc-address">
                    <i className="fa-solid fa-map-pin"></i> {center.address}
                  </p>
                </div>

                <div className="sc-specs-box">
                  <strong>Specialization &amp; Facilities:</strong>
                  <div className="sc-specs-tags">
                    {center.specialization.map((spec, i) => (
                      <span key={i} className="sc-spec-tag">
                        <i className="fa-solid fa-circle-check"></i> {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sc-timing-row">
                  <span className="sc-status"><i className="fa-solid fa-circle"></i> {center.openStatus}</span>
                  <div className="sc-rating-wrap">
                    <i className="fa-solid fa-star"></i>
                    <strong>{center.rating}</strong>
                    <span>({center.reviewsCount} reviews)</span>
                  </div>
                </div>

                <div className="sc-card-actions">
                  <a href={`tel:${center.phone}`} className="btn-sc-call">
                    <i className="fa-solid fa-phone"></i>
                    <span>Call Center</span>
                  </a>
                  <button
                    type="button"
                    className="btn-sc-book"
                    onClick={() => showToast(`Service Bay Booked at ${center.name}! Confirmation SMS sent.`)}
                  >
                    <i className="fa-solid fa-calendar-check"></i>
                    <span>Book Bay Slot</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
