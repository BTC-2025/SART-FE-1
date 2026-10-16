'use client';

import React, { useState } from 'react';
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

          // Unique states list from LIVE_FUEL_PRICES
          const availableStates = Array.from(new Set(LIVE_FUEL_PRICES.map((p) => p.state))).sort();
          // Cities in currently selected state
          const citiesInSelectedState = LIVE_FUEL_PRICES.filter(p => selectedFuelState === 'All States' || p.state === selectedFuelState);

          // Get active price record
          const currentPrice = LIVE_FUEL_PRICES.find((p) => p.city.toLowerCase() === selectedFuelCity.toLowerCase()) ||
            LIVE_FUEL_PRICES.find((p) => p.state === selectedFuelState) ||
            LIVE_FUEL_PRICES[0];

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
            <section className="hub-showcase-view animate-pop">
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
            </section>
          );
}
