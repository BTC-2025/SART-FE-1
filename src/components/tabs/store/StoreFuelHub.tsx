'use client';

import React, { useState, useEffect } from 'react';
import { LIVE_FUEL_PRICES, EV_CHARGING_STATIONS, LOCATION_BASED_STATIONS } from '../storeData';

interface StoreFuelHubProps {
  showToast: (msg: string) => void;
  selectedFuelCity: string;
  setSelectedFuelCity: React.Dispatch<React.SetStateAction<string>>;
}

export default function StoreFuelHub({ showToast, selectedFuelCity, setSelectedFuelCity }: StoreFuelHubProps) {
  const [selectedFuelState, setSelectedFuelState] = useState<string>('Tamil Nadu');
  const [fuelLocationSearchQuery, setFuelLocationSearchQuery] = useState<string>('');
  const [fuelBrandFilter, setFuelBrandFilter] = useState<string>('all');
  const [stationFilterCategory, setStationFilterCategory] = useState<string>('all');

  // Buy Fuel & EV Sub-View State: 'stations' (directory) | 'order_delivery' (in-page form) | 'tracking' (live GPS dispatch)
  const [fuelActiveSubView, setFuelActiveSubView] = useState<'stations' | 'order_delivery' | 'tracking'>('stations');
  const [orderFuelType, setOrderFuelType] = useState<'Petrol' | 'Diesel' | 'CNG' | 'EV'>('Petrol');
  const [orderQuantity, setOrderQuantity] = useState<number>(1); // Minimum 1 Litre
  const [orderCustomerName, setOrderCustomerName] = useState<string>('Rajesh Kumar');
  const [orderMobileNumber, setOrderMobileNumber] = useState<string>('9840012345');
  const [orderVehicleReg, setOrderVehicleReg] = useState<string>('TN 09 BX 2023');
  const [orderDeliveryMode, setOrderDeliveryMode] = useState<'nearby_gps' | 'manual_address'>('nearby_gps');
  const [orderDeliveryAddress, setOrderDeliveryAddress] = useState<string>('Anna Salai, Guindy, Chennai - NH-45 Highway Km 12');
  const [orderEmergencyUrgent, setOrderEmergencyUrgent] = useState<boolean>(true);
  const [orderDispatchTrackingId, setOrderDispatchTrackingId] = useState<string>('#SART-SOS-00124');

  // Listen for global custom event 'open-fuel-ev-order-modal' to open in-page view
  useEffect(() => {
    const handleOpenOrder = () => {
      setFuelActiveSubView('order_delivery');
    };
    window.addEventListener('open-fuel-ev-order-modal', handleOpenOrder);
    return () => window.removeEventListener('open-fuel-ev-order-modal', handleOpenOrder);
  }, []);

  // Unique states list from LIVE_FUEL_PRICES
  const availableStates = Array.from(new Set(LIVE_FUEL_PRICES.map((p) => p.state))).sort();
  // Cities in currently selected state
  const citiesInSelectedState = LIVE_FUEL_PRICES.filter(p => selectedFuelState === 'All States' || p.state === selectedFuelState);

  // Get active price record
  const currentPrice = LIVE_FUEL_PRICES.find((p) => p.city.toLowerCase() === selectedFuelCity.toLowerCase()) ||
    LIVE_FUEL_PRICES.find((p) => p.state === selectedFuelState) ||
    LIVE_FUEL_PRICES[0];

  // Delivery charge calculation based on quantity and urgency
  const deliveryCharge = orderQuantity <= 2 ? 149 : orderQuantity <= 5 ? 199 : 249;
  const fuelRatePerUnit = orderFuelType === 'Petrol'
    ? currentPrice.petrol
    : orderFuelType === 'Diesel'
      ? currentPrice.diesel
      : orderFuelType === 'CNG'
        ? currentPrice.cng
        : (currentPrice.electricUnitRate || 18.5);
  const fuelSubtotal = orderQuantity * fuelRatePerUnit;
  const grandTotal = fuelSubtotal + deliveryCharge;

  // Filter stations based on state, city, query, brand, and type
  const filteredStations = LOCATION_BASED_STATIONS.filter((st) => {
    // Match city or search query
    const matchesCity =
      selectedFuelCity === 'All Cities' ||
      st.city.toLowerCase() === selectedFuelCity.toLowerCase() ||
      (fuelLocationSearchQuery.trim() !== '' && (
        st.name.toLowerCase().includes(fuelLocationSearchQuery.toLowerCase()) ||
        st.address.toLowerCase().includes(fuelLocationSearchQuery.toLowerCase()) ||
        st.city.toLowerCase().includes(fuelLocationSearchQuery.toLowerCase()) ||
        st.brand.toLowerCase().includes(fuelLocationSearchQuery.toLowerCase())
      ));

    if (!matchesCity && !fuelLocationSearchQuery.trim()) return false;

    // Brand filter
    if (fuelBrandFilter !== 'all') {
      if (fuelBrandFilter === 'IOCL' && !st.brand.includes('IOCL') && !st.name.includes('Iocl')) return false;
      if (fuelBrandFilter === 'BPCL' && !st.brand.includes('BPCL')) return false;
      if (fuelBrandFilter === 'HPCL' && !st.brand.includes('HPCL')) return false;
      if (fuelBrandFilter === 'Tata' && !st.brand.includes('Tata')) return false;
      if (fuelBrandFilter === 'Jio-bp' && !st.brand.includes('Jio-bp')) return false;
      if (fuelBrandFilter === 'Statiq' && !st.brand.includes('Statiq')) return false;
      if (fuelBrandFilter === 'Shell' && !st.brand.includes('Shell')) return false;
    }

    // Category filter
    if (stationFilterCategory === 'fuel' && st.type === 'ev') return false;
    if (stationFilterCategory === 'ev' && st.type === 'fuel') return false;
    if (stationFilterCategory === 'cng' && !st.fuels.some(fuel => fuel.toLowerCase().includes('cng'))) return false;

    return true;
  });

  return (
    <section className="">
      {fuelActiveSubView === 'stations' && (
        <>
          <div className="hub-view-header modern-fuel-header">
            <div className="view-title-wrap">
              <span className="hub-badge-flair fuel-flair">
                <i className="fa-solid fa-charging-station"></i> LIVE AUTOMOTIVE ENERGY &amp; PUMP FINDER
              </span>
              <h2>Daily Fuel Rates &amp; Nearby Fuel &amp; EV Stations</h2>
              <p>Location-based live directory of verified Petrol, Diesel, CNG pumps and high-speed EV DC charging hubs across India.</p>
            </div>

            {/* State & City Chooser Controls */}
            <div className="fuel-controls-master-bar">
              {/* State Select */}
              <div className="fuel-control-group">
                <span className="control-label"><i className="fa-solid fa-earth-americas"></i> State:</span>
                <select
                  value={selectedFuelState}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setSelectedFuelState(newState);
                    // Pick first city in the new state
                    const matchingCity = LIVE_FUEL_PRICES.find(p => p.state === newState);
                    if (matchingCity) {
                      setSelectedFuelCity(matchingCity.city);
                    }
                    showToast(`Switched state to: ${newState}`);
                  }}
                  className="fuel-modern-select"
                >
                  <option value="All States">All States</option>
                  {availableStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* City Select */}
              <div className="fuel-control-group">
                <span className="control-label"><i className="fa-solid fa-location-dot"></i> City:</span>
                <select
                  value={selectedFuelCity}
                  onChange={(e) => {
                    setSelectedFuelCity(e.target.value);
                    // Auto-sync state if city has known state
                    const found = LIVE_FUEL_PRICES.find(p => p.city === e.target.value);
                    if (found) setSelectedFuelState(found.state);
                    showToast(`Updated stations & fuel prices for ${e.target.value}`);
                  }}
                  className="fuel-modern-select"
                >
                  <option value="All Cities">All Cities</option>
                  {citiesInSelectedState.map((p) => (
                    <option key={p.city} value={p.city}>{p.city} ({p.state})</option>
                  ))}
                </select>
              </div>

              {/* Auto-Detect GPS Button */}
              <button
                type="button"
                className="btn-auto-detect-gps"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setSelectedFuelState('Tamil Nadu');
                        setSelectedFuelCity('Chennai');
                        showToast(`📍 GPS Location verified: Lat ${pos.coords.latitude.toFixed(2)}, Lon ${pos.coords.longitude.toFixed(2)} → Chennai, TN`);
                      },
                      () => {
                        setSelectedFuelState('Tamil Nadu');
                        setSelectedFuelCity('Chennai');
                        showToast('📍 GPS Location detected: Chennai, Tamil Nadu');
                      }
                    );
                  } else {
                    setSelectedFuelState('Tamil Nadu');
                    setSelectedFuelCity('Chennai');
                    showToast('📍 Default GPS Region set: Chennai, Tamil Nadu');
                  }
                }}
              >
                <i className="fa-solid fa-crosshairs"></i> Auto-Detect GPS
              </button>

              {/* BUY FUEL & EV ORDER DELIVERY BUTTON - OPENS IN-PAGE BOOKING VIEW */}
              <button
                type="button"
                className="btn-open-buy-fuel-modal"
                onClick={() => {
                  setFuelActiveSubView('order_delivery');
                  showToast('Opened Doorstep & Emergency Fuel/EV Booking Page');
                }}
              >
                <div className="btn-fuel-pulse-dot"></div>
                <i className="fa-solid fa-truck-droplet"></i>
                <span>Buy Fuel &amp; EV</span>
              </button>
            </div>
          </div>

          {/* SEARCH & BRAND FILTER BAR */}
          <div className="fuel-search-filter-ribbon">
            <div className="fuel-search-input-box">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                value={fuelLocationSearchQuery}
                onChange={(e) => setFuelLocationSearchQuery(e.target.value)}
                placeholder="Search by station name, area, road, or brand (e.g. Shell, IOCL, Velachery, Anna Salai)..."
                className="fuel-search-input"
              />
              {fuelLocationSearchQuery && (
                <button
                  type="button"
                  className="btn-clear-search"
                  onClick={() => setFuelLocationSearchQuery('')}
                  title="Clear search"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            <div className="fuel-brand-filters">
              <span className="brand-label"><i className="fa-solid fa-filter"></i> Brand:</span>
              {[
                { id: 'all', label: 'All Brands' },
                { id: 'IOCL', label: 'IOCL' },
                { id: 'BPCL', label: 'BPCL' },
                { id: 'HPCL', label: 'HPCL' },
                { id: 'Shell', label: 'Shell' },
                { id: 'Tata', label: 'Tata Power' },
                { id: 'Jio-bp', label: 'Jio-bp' },
                { id: 'Statiq', label: 'Statiq' }
              ].map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  className={`brand-pill-btn ${fuelBrandFilter === brand.id ? 'active' : ''}`}
                  onClick={() => setFuelBrandFilter(brand.id)}
                >
                  {brand.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Fuel Price Ticker Cards */}
          <div className="fuel-rates-grid">
            {/* Petrol Card */}
            <div className="fuel-rate-card petrol">
              <div className="fuel-card-top">
                <div className="fuel-badge-icon petrol"><i className="fa-solid fa-gas-pump"></i></div>
                <div className="fuel-card-meta">
                  <span className="fuel-name-badge">Petrol</span>
                  <span className="fuel-location-tag">{currentPrice.city}, {currentPrice.state}</span>
                </div>
              </div>
              <div className="fuel-price-val">₹{currentPrice.petrol.toFixed(2)} <span>/ Litre</span></div>
              <div className="fuel-card-footer-info">
                <span className="fuel-update-text"><i className="fa-regular fa-clock"></i> {currentPrice.updated}</span>
                <span className={`fuel-trend-indicator ${currentPrice.trend || 'steady'}`}>
                  {currentPrice.petrolChange && currentPrice.petrolChange !== 0 ? (
                    <>
                      <i className={`fa-solid ${currentPrice.petrolChange > 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                      ₹{Math.abs(currentPrice.petrolChange).toFixed(2)}
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-minus"></i> Steady
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Diesel Card */}
            <div className="fuel-rate-card diesel">
              <div className="fuel-card-top">
                <div className="fuel-badge-icon diesel"><i className="fa-solid fa-oil-can"></i></div>
                <div className="fuel-card-meta">
                  <span className="fuel-name-badge">Diesel</span>
                  <span className="fuel-location-tag">{currentPrice.city}, {currentPrice.state}</span>
                </div>
              </div>
              <div className="fuel-price-val">₹{currentPrice.diesel.toFixed(2)} <span>/ Litre</span></div>
              <div className="fuel-card-footer-info">
                <span className="fuel-update-text"><i className="fa-regular fa-clock"></i> {currentPrice.updated}</span>
                <span className={`fuel-trend-indicator ${currentPrice.trend || 'steady'}`}>
                  {currentPrice.dieselChange && currentPrice.dieselChange !== 0 ? (
                    <>
                      <i className={`fa-solid ${currentPrice.dieselChange > 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                      ₹{Math.abs(currentPrice.dieselChange).toFixed(2)}
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-minus"></i> Steady
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* CNG Card */}
            <div className="fuel-rate-card cng">
              <div className="fuel-card-top">
                <div className="fuel-badge-icon cng"><i className="fa-solid fa-fire-flame-simple"></i></div>
                <div className="fuel-card-meta">
                  <span className="fuel-name-badge">Auto CNG</span>
                  <span className="fuel-location-tag">{currentPrice.city}, {currentPrice.state}</span>
                </div>
              </div>
              <div className="fuel-price-val">₹{currentPrice.cng.toFixed(2)} <span>/ Kg</span></div>
              <div className="fuel-card-footer-info">
                <span className="fuel-update-text"><i className="fa-regular fa-clock"></i> {currentPrice.updated}</span>
                <span className="fuel-trend-indicator clean-green">
                  <i className="fa-solid fa-leaf"></i> Eco Clean
                </span>
              </div>
            </div>

            {/* EV Power Card */}
            <div className="fuel-rate-card ev-energy">
              <div className="fuel-card-top">
                <div className="fuel-badge-icon ev"><i className="fa-solid fa-bolt"></i></div>
                <div className="fuel-card-meta">
                  <span className="fuel-name-badge">EV DC Fast Rate</span>
                  <span className="fuel-location-tag">{currentPrice.city}, {currentPrice.state}</span>
                </div>
              </div>
              <div className="fuel-price-val">₹{(currentPrice.electricUnitRate || 18.50).toFixed(2)} <span>/ kWh</span></div>
              <div className="fuel-card-footer-info">
                <span className="fuel-update-text"><i className="fa-solid fa-plug-circle-bolt"></i> 60kW - 150kW Ultra Fast</span>
                <span className="fuel-trend-indicator ev-subsidized">
                  <i className="fa-solid fa-circle-check"></i> Subsidized
                </span>
              </div>
            </div>
          </div>

          {/* LOCATION-BASED FUEL & EV STATIONS SECTION (MATCHING USER'S SCREENSHOT & DESIGN) */}
          <div className="location-stations-container">
            <div className="stations-filter-row">
              <div className="stations-title-block">
                <h3>
                  <i className="fa-solid fa-map-location-dot"></i> Verified Fuel &amp; EV Stations Near {selectedFuelCity !== 'All Cities' ? selectedFuelCity : selectedFuelState}
                </h3>
                <span className="stations-count-pill">
                  {filteredStations.length} Stations Located
                </span>
              </div>

              <div className="stations-type-pills">
                {[
                  { id: 'all', label: 'All Stations', icon: 'fa-layer-group' },
                  { id: 'fuel', label: 'Petrol & Diesel', icon: 'fa-gas-pump' },
                  { id: 'cng', label: 'CNG Available', icon: 'fa-fire-flame-simple' },
                  { id: 'ev', label: 'EV Fast Charging', icon: 'fa-bolt' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`st-filter-btn ${stationFilterCategory === f.id ? 'active' : ''}`}
                    onClick={() => setStationFilterCategory(f.id)}
                  >
                    <i className={`fa-solid ${f.icon}`}></i> {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CARD GRID MATCHING USER SCREENSHOT */}
            {filteredStations.length > 0 ? (
              <div className="image2-stations-grid">
                {filteredStations.map((station) => (
                  <div key={station.id} className="image2-station-card">
                    <div className="st-card-content">
                      <div className="st-card-header-line">
                        <span className="st-brand-pill">{station.brand}</span>
                        <span className="st-distance-pill"><i className="fa-solid fa-route"></i> {station.distance}</span>
                      </div>

                      <h4 className="st-card-title">{station.name}</h4>
                      <p className="st-card-address">{station.address}</p>

                      <div className="st-status-timing">
                        <span className="st-status-green">Open now</span>
                        <span className="st-timing-sep">•</span>
                        <span className="st-timing-text">{station.status || '06:00 AM - 10:00 PM'}</span>
                      </div>

                      <div className="st-phone-row">
                        <i className="fa-solid fa-phone"></i>
                        <a href={`tel:${station.phone}`} className="st-phone-link">{station.phone}</a>
                      </div>

                      <div className="st-fuels-checks">
                        {station.fuels.map((fuel) => (
                          <span key={fuel} className="st-fuel-check-item">
                            <i className="fa-solid fa-check"></i> {fuel}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="st-card-footer">
                      <button
                        type="button"
                        className="btn-get-direction"
                        onClick={() => {
                          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.name + ' ' + station.address)}`;
                          window.open(mapsUrl, '_blank');
                          showToast(`Navigating to ${station.name}...`);
                        }}
                      >
                        <i className="fa-solid fa-diamond-turn-right"></i>
                        <span>Get Direction</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-stations-found-card">
                <i className="fa-solid fa-gas-pump fa-3x"></i>
                <h4>No stations found matching your criteria</h4>
                <p>Try clearing your search query or selecting "All Cities" or "All Brands".</p>
                <button
                  type="button"
                  className="btn-reset-filters"
                  onClick={() => {
                    setSelectedFuelCity('All Cities');
                    setFuelLocationSearchQuery('');
                    setFuelBrandFilter('all');
                    setStationFilterCategory('all');
                  }}
                >
                  <i className="fa-solid fa-rotate-left"></i> Reset All Filters
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 2: IN-PAGE DOORSTEP & HIGHWAY FUEL & EV DELIVERY BOOKING PAGE
          (As shown in User Image 2 - Dedicated In-Page View, Not Popup Modal)
          ========================================================================= */}
      {fuelActiveSubView === 'order_delivery' && (
        <div className="fuel-inpage-container animate-pop">
          {/* Top Return Banner */}
          <div className="fuel-inpage-nav-bar">
            <button
              type="button"
              className="btn-back-to-stations"
              onClick={() => setFuelActiveSubView('stations')}
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Fuel &amp; EV Stations
            </button>
            <span className="inpage-nav-badge">
              <i className="fa-solid fa-shield-halved"></i> PESO &amp; SART Certified Emergency Delivery
            </span>
          </div>

          <div className="fuel-inpage-view-card">
            {/* Dark Header Banner matching Image 2 */}
            <div className="fuel-order-hero-banner">
              <div className="f-hero-left">
                <div className="f-hero-icon-badge">
                  <i className="fa-solid fa-truck-droplet"></i>
                </div>
                <div className="f-hero-text">
                  <h3>Doorstep &amp; Highway Fuel &amp; EV Delivery</h3>
                  <p>Delivers certified Petrol, Diesel, CNG cylinders, or Mobile EV DC Supercharging van to your location.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-inpage-close"
                onClick={() => setFuelActiveSubView('stations')}
                title="Return to stations"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* In-Page Booking Form */}
            <form
              className="fuel-order-form inpage-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!orderMobileNumber.trim() || orderMobileNumber.trim().length < 10) {
                  showToast('Please enter a valid 10-digit mobile number');
                  return;
                }
                if (orderDeliveryMode === 'manual_address' && !orderDeliveryAddress.trim()) {
                  showToast('Please enter your delivery address');
                  return;
                }

                const trackingId = `#SART-SOS-${Math.floor(10000 + Math.random() * 90000)}`;
                setOrderDispatchTrackingId(trackingId);
                setFuelActiveSubView('tracking');
                showToast(`✅ Dispatched! Emergency Patrol en route with ${orderQuantity} ${orderFuelType === 'EV' ? 'kWh EV Fast Charge' : orderFuelType === 'CNG' ? 'Kg' : 'Litres'}!`);
              }}
            >
              {/* 1. Select Fuel Type */}
              <div className="form-group-block">
                <label className="form-label-title">
                  <i className="fa-solid fa-gas-pump text-primary"></i> 1. Select Fuel or Energy Type:
                </label>
                <div className="fuel-type-selector-grid">
                  {[
                    { id: 'Petrol', label: 'Petrol', sub: `₹${currentPrice.petrol.toFixed(2)}/L`, icon: 'fa-gas-pump', color: 'petrol' },
                    { id: 'Diesel', label: 'Diesel', sub: `₹${currentPrice.diesel.toFixed(2)}/L`, icon: 'fa-oil-can', color: 'diesel' },
                    { id: 'CNG', label: 'Auto CNG', sub: `₹${currentPrice.cng.toFixed(2)}/Kg`, icon: 'fa-fire-flame-simple', color: 'cng' },
                    { id: 'EV', label: 'Mobile EV DC', sub: `₹${(currentPrice.electricUnitRate || 18.5).toFixed(2)}/kWh`, icon: 'fa-bolt', color: 'ev' },
                  ].map((ft) => (
                    <button
                      key={ft.id}
                      type="button"
                      className={`fuel-type-choice-btn ${ft.color} ${orderFuelType === ft.id ? 'active' : ''}`}
                      onClick={() => {
                        setOrderFuelType(ft.id as any);
                        if (ft.id === 'CNG') setOrderQuantity(3);
                        else if (ft.id === 'EV') setOrderQuantity(15);
                        else setOrderQuantity(1); // 1 Litre minimum choice
                      }}
                    >
                      <div className="ft-icon"><i className={`fa-solid ${ft.icon}`}></i></div>
                      <div className="ft-info">
                        <strong>{ft.label}</strong>
                        <small>{ft.sub}</small>
                      </div>
                      {orderFuelType === ft.id && (
                        <div className="ft-check"><i className="fa-solid fa-circle-check"></i></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Fuel Quantity / Amount (1 Litre Minimum Supported) */}
              <div className="form-group-block">
                <div className="qty-header-row">
                  <label className="form-label-title">
                    <i className="fa-solid fa-calculator text-primary"></i> 2. Fuel Quantity / Amount (Min. 1 Litre):
                  </label>
                  <span className="qty-pill-display">
                    <strong>{orderQuantity}</strong> {orderFuelType === 'EV' ? 'kWh Fast Charge' : orderFuelType === 'CNG' ? 'Kg' : orderQuantity === 1 ? 'Litre (Emergency Reach-Next-Pump)' : 'Litres'}
                  </span>
                </div>

                {/* Quick Litre Chips including 1L and 2L */}
                <div className="quick-qty-chips">
                  {(orderFuelType === 'EV'
                    ? [5, 10, 15, 20, 30, 50]
                    : orderFuelType === 'CNG'
                      ? [2, 3, 5, 8, 10, 14]
                      : [1, 2, 5, 10, 15, 20, 30]
                  ).map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      className={`qty-chip-btn ${orderQuantity === qty ? 'active' : ''}`}
                      onClick={() => setOrderQuantity(qty)}
                    >
                      {qty} {orderFuelType === 'EV' ? 'kWh' : orderFuelType === 'CNG' ? 'Kg' : 'L'}
                    </button>
                  ))}
                </div>

                {/* Range Slider Starting from 1 */}
                <div className="qty-slider-row">
                  <input
                    type="range"
                    min={orderFuelType === 'EV' ? 5 : orderFuelType === 'CNG' ? 2 : 1}
                    max={orderFuelType === 'EV' ? 80 : orderFuelType === 'CNG' ? 20 : 60}
                    step={1}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    className="qty-range-slider"
                  />
                  <div className="slider-ticks-row">
                    <span>{orderFuelType === 'EV' ? '5 kWh' : orderFuelType === 'CNG' ? '2 Kg' : '1 Litre (Min)'}</span>
                    <span>{orderFuelType === 'EV' ? '40 kWh' : orderFuelType === 'CNG' ? '10 Kg' : '30 Litres'}</span>
                    <span>{orderFuelType === 'EV' ? '80 kWh' : orderFuelType === 'CNG' ? '20 Kg' : '60 Litres (Max)'}</span>
                  </div>
                </div>

                {/* Transparent Cost Breakdown & Delivery Charges */}
                <div className="est-cost-pill">
                  <div className="cost-breakdown-row">
                    <span>Fuel Subtotal ({orderQuantity} {orderFuelType === 'EV' ? 'kWh' : orderFuelType === 'CNG' ? 'Kg' : 'L'} × ₹{fuelRatePerUnit.toFixed(2)}):</span>
                    <strong>₹{fuelSubtotal.toFixed(2)}</strong>
                  </div>
                  <div className="cost-breakdown-row delivery-row">
                    <span>Doorstep PESO Certified Dispenser &amp; Delivery Fee:</span>
                    <strong className="text-emerald">+₹{deliveryCharge}.00</strong>
                  </div>
                  <div className="cost-breakdown-total">
                    <span>Grand Total Payable (Post Delivery / UPI / Card):</span>
                    <strong className="total-val">₹{grandTotal.toFixed(2)}</strong>
                  </div>
                  <small className="cost-notice-sub">
                    <i className="fa-solid fa-circle-info"></i> Minimum 1 Litre allowed. Safe PESO explosive-grade container van dispatch included.
                  </small>
                </div>
              </div>

              {/* 3. Delivery Location Selection */}
              <div className="form-group-block">
                <label className="form-label-title">
                  <i className="fa-solid fa-map-location-dot text-primary"></i> 3. Delivery Location Selection:
                </label>

                <div className="delivery-mode-tabs">
                  <button
                    type="button"
                    className={`del-mode-tab ${orderDeliveryMode === 'nearby_gps' ? 'active' : ''}`}
                    onClick={() => {
                      setOrderDeliveryMode('nearby_gps');
                      setOrderDeliveryAddress(`Anna Salai, Guindy, Chennai - NH-45 Highway Km 12`);
                      showToast('Set to Near-by Live GPS Location');
                    }}
                  >
                    <i className="fa-solid fa-crosshairs"></i>
                    <div>
                      <strong>Near-by GPS Location</strong>
                      <small>Auto-detects live coordinates &amp; closest fuel van</small>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`del-mode-tab ${orderDeliveryMode === 'manual_address' ? 'active' : ''}`}
                    onClick={() => {
                      setOrderDeliveryMode('manual_address');
                      showToast('Switched to Manual Address fill');
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                    <div>
                      <strong>Manual Address Fill</strong>
                      <small>Enter custom home, office or highway marker</small>
                    </div>
                  </button>
                </div>

                {orderDeliveryMode === 'nearby_gps' ? (
                  <div className="gps-live-detected-card">
                    <div className="gps-live-icon">
                      <i className="fa-solid fa-satellite-dish"></i>
                    </div>
                    <div className="gps-live-details">
                      <span className="gps-detected-badge"><i className="fa-solid fa-circle-dot"></i> LIVE DETECTED</span>
                      <strong className="gps-loc-name">{orderDeliveryAddress}</strong>
                      <small>Nearest SART Rapid Patrol Van is 2.4 km away (Est. 11 Mins)</small>
                    </div>
                    <button
                      type="button"
                      className="btn-recheck-gps"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              setOrderDeliveryAddress(`Lat ${pos.coords.latitude.toFixed(3)}, Lon ${pos.coords.longitude.toFixed(3)} • Anna Salai, Chennai`);
                              showToast('Updated live GPS coordinates');
                            },
                            () => showToast('GPS location locked')
                          );
                        }
                      }}
                    >
                      <i className="fa-solid fa-rotate"></i> Refresh GPS
                    </button>
                  </div>
                ) : (
                  <div className="manual-address-input-wrap">
                    <textarea
                      value={orderDeliveryAddress}
                      onChange={(e) => setOrderDeliveryAddress(e.target.value)}
                      placeholder="Enter street address, building, landmark, or Highway mile marker (e.g. NH-45 near Guduvanchery toll plaza, Chennai)..."
                      className="manual-address-textarea"
                      rows={3}
                      required
                    />
                  </div>
                )}
              </div>

              {/* 4. Basic Contact & Vehicle Information */}
              <div className="form-group-block">
                <label className="form-label-title">
                  <i className="fa-solid fa-id-card text-primary"></i> 4. Basic Contact &amp; Vehicle Information:
                </label>

                <div className="form-two-col-grid">
                  <div className="form-input-field">
                    <label>Mobile Number <span className="text-red">*</span></label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">+91</span>
                      <input
                        type="tel"
                        placeholder="98400 12345"
                        maxLength={10}
                        value={orderMobileNumber}
                        onChange={(e) => setOrderMobileNumber(e.target.value.replace(/\D/g, ''))}
                        className="form-control-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-input-field">
                    <label>Customer Name / Contact Person</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={orderCustomerName}
                      onChange={(e) => setOrderCustomerName(e.target.value)}
                      className="form-control-input"
                    />
                  </div>

                  <div className="form-input-field">
                    <label>Vehicle Reg Number (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. TN 09 BX 2023"
                      value={orderVehicleReg}
                      onChange={(e) => setOrderVehicleReg(e.target.value.toUpperCase())}
                      className="form-control-input"
                    />
                  </div>

                  <div className="form-input-field">
                    <label>Urgency Level</label>
                    <div className="urgency-toggle-pill">
                      <button
                        type="button"
                        className={`btn-urgency ${orderEmergencyUrgent ? 'urgent' : ''}`}
                        onClick={() => setOrderEmergencyUrgent(true)}
                      >
                        <i className="fa-solid fa-triangle-exclamation"></i> Emergency SOS (11 Mins)
                      </button>
                      <button
                        type="button"
                        className={`btn-urgency ${!orderEmergencyUrgent ? 'standard' : ''}`}
                        onClick={() => setOrderEmergencyUrgent(false)}
                      >
                        <i className="fa-regular fa-clock"></i> Scheduled Doorstep
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Footer Actions */}
              <div className="fuel-form-actions-footer">
                <button
                  type="button"
                  className="btn-fuel-cancel"
                  onClick={() => setFuelActiveSubView('stations')}
                >
                  Cancel &amp; Back
                </button>
                <button
                  type="submit"
                  className="btn-fuel-confirm-order"
                >
                  <i className="fa-solid fa-bolt"></i>
                  <span>Confirm &amp; Dispatch Fuel Delivery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: LIVE EMERGENCY DISPATCH TRACKING PAGE
          (As shown in User Image 3 - Exact Murugan K., ETA 11 Mins, Progress Steps)
          ========================================================================= */}
      {fuelActiveSubView === 'tracking' && (
        <div className="fuel-inpage-container animate-pop">
          {/* Top Return Navigation */}
          <div className="fuel-inpage-nav-bar">
            <button
              type="button"
              className="btn-back-to-stations"
              onClick={() => setFuelActiveSubView('stations')}
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Fuel &amp; EV Stations
            </button>
            <span className="inpage-nav-badge live-beacon">
              <span className="pulse-red-dot"></span> LIVE SART TELEMETRY CONNECTED
            </span>
          </div>

          <div className="tracking-inpage-card">
            {/* Header matching Image 3 */}
            <div className="tracking-header-banner">
              <div className="th-left">
                <span className="live-status-dot"></span>
                <div>
                  <h3 className="tracking-main-title">Live Emergency Dispatch Tracking</h3>
                  <div className="tracking-sub-meta">
                    Request ID: <strong>{orderDispatchTrackingId}</strong> • Priority Level: <span className="priority-critical">CRITICAL</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn-tracking-close"
                onClick={() => setFuelActiveSubView('stations')}
                title="Close and return to pumps"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="tracking-card-body">
              {/* Alert Ribbon: Patrol Vehicle En Route via GPS */}
              <div className="patrol-route-alert-box">
                <div className="alert-truck-icon">
                  <i className="fa-solid fa-truck-medical"></i>
                </div>
                <div className="alert-content">
                  <span className="alert-badge-top">PATROL VEHICLE EN ROUTE VIA GPS</span>
                  <h4 className="alert-heading">Rapid Emergency GPS Patrol Dispatch</h4>
                  <p className="alert-destination">
                    <i className="fa-solid fa-location-dot"></i> Destination: {orderDeliveryAddress}
                  </p>
                </div>
              </div>

              {/* Technician Profile Card matching Image 3 */}
              <div className="technician-profile-card">
                <div className="tech-avatar-box">
                  <i className="fa-solid fa-user-shield"></i>
                </div>
                <div className="tech-meta-details">
                  <div className="tech-name-row">
                    <strong className="tech-name">Murugan K. (4.9 ★ • 1,420+ Dispatches)</strong>
                    <span className="verified-sart-badge">VERIFIED SART RESPONDER</span>
                  </div>
                  <div className="tech-unit-info">
                    <span>Patrol Van #TN-09-RSA-412</span>
                  </div>
                  <div className="tech-equip-row">
                    <span><i className="fa-solid fa-screwdriver-wrench"></i> Fully Equipped RSA Unit</span>
                    <span><i className="fa-solid fa-location-arrow"></i> Distance: 2.4 km away</span>
                  </div>
                </div>
                <div className="eta-badge-pill">
                  <span className="eta-label">EST. ARRIVAL</span>
                  <strong className="eta-time">11 MINS</strong>
                </div>
              </div>

              {/* Progress Milestones Checklist matching Image 3 */}
              <div className="tracking-checklist-timeline">
                {/* Step 1: Completed */}
                <div className="timeline-step-row completed">
                  <div className="step-icon-wrap">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div className="step-details">
                    <strong className="step-title">SOS Request Received &amp; GPS Locked</strong>
                    <p className="step-desc">Coordinates verified by Chennai Highway Dispatch Desk</p>
                  </div>
                </div>

                {/* Step 2: Completed */}
                <div className="timeline-step-row completed">
                  <div className="step-icon-wrap">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div className="step-details">
                    <strong className="step-title">Unit #412 Dispatched from Guindy RSA Depot</strong>
                    <p className="step-desc">
                      Technician rolling with {orderQuantity} {orderFuelType === 'EV' ? 'kWh Mobile DC Supercharger' : orderFuelType === 'CNG' ? 'Kg Auto CNG' : `Litres Certified ${orderFuelType}`} canister, hydraulic jack &amp; jump kit
                    </p>
                  </div>
                </div>

                {/* Step 3: In Progress (Pulse) */}
                <div className="timeline-step-row active">
                  <div className="step-icon-wrap pulsing">
                    <i className="fa-solid fa-circle-dot"></i>
                  </div>
                  <div className="step-details">
                    <strong className="step-title">Patrol Unit Approaching Destination (2.4 km)</strong>
                    <p className="step-desc">Live telemetry streaming via Anna Salai corridor • Real-time traffic optimized</p>
                  </div>
                </div>

                {/* Step 4: Pending */}
                <div className="timeline-step-row pending">
                  <div className="step-icon-wrap">
                    <i className="fa-regular fa-circle"></i>
                  </div>
                  <div className="step-details">
                    <strong className="step-title">Safe Delivery &amp; Contactless On-Site Dispense</strong>
                    <p className="step-desc">PESO-certified sealed fuel canister delivery or high-speed DC vehicle booster charge</p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="tracking-actions-bar">
                <button
                  type="button"
                  className="btn-call-responder"
                  onClick={() => {
                    showToast('📞 Dialing SART Dispatcher Murugan K. (+91 98400 98400)...');
                  }}
                >
                  <i className="fa-solid fa-phone"></i> Call Responder (Murugan K.)
                </button>
                <button
                  type="button"
                  className="btn-share-live-link"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(`https://sart.live/track/${orderDispatchTrackingId.replace('#', '')}`);
                      showToast('Live tracking link copied to clipboard!');
                    }
                  }}
                >
                  <i className="fa-solid fa-share-nodes"></i> Share Live Location
                </button>
                <button
                  type="button"
                  className="btn-done-back"
                  onClick={() => setFuelActiveSubView('stations')}
                >
                  Back to Stations
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
