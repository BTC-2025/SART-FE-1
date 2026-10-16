'use client';

import React from 'react';
import {
  VEHICLE_SHOWCASE_DATA,
  AUTOMOTIVE_NEWS_DATA,
  VEHICLE_VIDEO_REVIEWS,
  POPULAR_COMPARISON_PAIRS,
  UPCOMING_CARS_FAQS
} from '../storeData';
import { BRANDS_BY_VEHICLE, MODELS_BY_BRAND } from '../storeProductsData';

interface StoreBuySellPortalOverviewProps {
  cardekhoVehicleCondition: 'new' | 'used';
  cardekhoSelectedType: string;
  cardekhoSearchBy: 'budget' | 'brand';
  cardekhoBrandFilter: string;
  setCardekhoBrandFilter: (b: string) => void;
  cardekhoModelFilter: string;
  setCardekhoModelFilter: (m: string) => void;
  cardekhoBodyTypeFilter: string;
  setCardekhoBodyTypeFilter: (bt: string) => void;
  cardekhoBudgetFilter: string;
  setCardekhoBudgetFilter: (bg: string) => void;
  homeCarSubCategory: string;
  setHomeCarSubCategory: (s: string) => void;
  homeBikeSubCategory: string;
  setHomeBikeSubCategory: (s: string) => void;
  homeCommercialSubCategory: string;
  setHomeCommercialSubCategory: (s: string) => void;
  userLocationCity: string;
  selectedFuelCity: string;
  showToast: (msg: string) => void;
  setActiveHubTab: (tab: any) => void;
  setCarbike360PageMode: (mode: any) => void;
  setCardekhoSelectedType: (type: string) => void;
  setCardekhoSearchBy: (s: any) => void;
  cardekhoCityFilter: string;
  setCardekhoCityFilter: (c: string) => void;
  topVehicleSearch: string;
  setCardekhoVehicleCondition: (c: 'new' | 'used') => void;
}

export function StoreBuySellPortalOverview(props: StoreBuySellPortalOverviewProps) {
  const {
    cardekhoVehicleCondition,
    cardekhoSelectedType,
    cardekhoSearchBy,
    cardekhoBrandFilter,
    setCardekhoBrandFilter,
    cardekhoModelFilter,
    setCardekhoModelFilter,
    cardekhoBodyTypeFilter,
    setCardekhoBodyTypeFilter,
    cardekhoBudgetFilter,
    setCardekhoBudgetFilter,
    homeCarSubCategory,
    setHomeCarSubCategory,
    homeBikeSubCategory,
    setHomeBikeSubCategory,
    homeCommercialSubCategory,
    setHomeCommercialSubCategory,
    userLocationCity,
    selectedFuelCity,
    showToast,
    setActiveHubTab,
    setCarbike360PageMode,
    setCardekhoSelectedType,
    setCardekhoSearchBy,
    cardekhoCityFilter,
    setCardekhoCityFilter,
    topVehicleSearch,
    setCardekhoVehicleCondition
  } = props;

  return (
                  <div className="cardekho-content-sections-wrap">

                {/* HELPER FILTER FUNCTION TO FILTER OUT UNRELATED CONTENT */}
                {(() => {
                  const matchesFilter = (v: any) => {
                    // In New Vehicle mode: filter out used vehicles if user is in 'new' mode
                    if (cardekhoVehicleCondition === 'new' && v.status === 'used') return false;
                    // In Used Vehicle mode: only show used vehicles
                    if (cardekhoVehicleCondition === 'used' && v.status !== 'used') return false;

                    // 1. Vehicle Type Filter (for both New and Used Vehicle modes)
                    if (cardekhoSelectedType !== 'All') {
                      if (cardekhoSelectedType === 'EV') {
                        const isEV = v.status === 'electric' || v.type === 'EV' || v.fuel.toLowerCase().includes('electric') || v.fuel.toLowerCase().includes('ev');
                        if (!isEV) return false;
                      } else if (v.type !== cardekhoSelectedType) {
                        return false;
                      }
                    }

                    // 2. Brand Filter
                    if (cardekhoSearchBy === 'brand' && cardekhoBrandFilter !== 'All Brands') {
                      const brandPrefix = cardekhoBrandFilter.toLowerCase().split(' ')[0];
                      if (!v.brand.toLowerCase().includes(brandPrefix) && !v.name.toLowerCase().includes(brandPrefix)) {
                        return false;
                      }
                    }

                    // 3. Model Filter
                    if (cardekhoSearchBy === 'brand' && cardekhoModelFilter !== 'All Models') {
                      const modelTerms = cardekhoModelFilter.toLowerCase().split(/[\s(/)]+/).filter(Boolean);
                      const targetName = v.name.toLowerCase();
                      const hasTerm = modelTerms.some((t: string) => t.length > 2 && targetName.includes(t));
                      if (!hasTerm && !targetName.includes(cardekhoModelFilter.toLowerCase())) {
                        return false;
                      }
                    }

                    // 4. Body Type / Fuel / Vehicle Sub-type Filter (for New Vehicle mode By Budget)
                    if (cardekhoVehicleCondition === 'new' && cardekhoSearchBy === 'budget' && cardekhoBodyTypeFilter !== 'All') {
                      const bt = cardekhoBodyTypeFilter.toLowerCase();
                      const blob = `${v.name} ${v.fuel} ${v.type} ${(v.seating || '')} ${(v.features || []).join(' ')}`.toLowerCase();
                      if (!blob.includes(bt)) {
                        return false;
                      }
                    }

                    // 5. Budget Range Filter
                    if (cardekhoSearchBy === 'budget' && cardekhoBudgetFilter !== 'All Budgets') {
                      const p = v.priceRaw || 0;
                      if (cardekhoBudgetFilter.includes('Under 2 Lakh') && p > 2) return false;
                      if (cardekhoBudgetFilter.includes('2 - 5 Lakh') && (p < 2 || p > 5)) return false;
                      if (cardekhoBudgetFilter.includes('5 - 10 Lakh') && (p < 5 || p > 10)) return false;
                      if (cardekhoBudgetFilter.includes('10 - 20 Lakh') && (p < 10 || p > 20)) return false;
                      if (cardekhoBudgetFilter.includes('20 - 50 Lakh') && (p < 20 || p > 50)) return false;
                      if (cardekhoBudgetFilter.includes('Above 50 Lakh') && p < 50) return false;
                    }

                    // 6. City Filter (for Used Vehicle mode)
                    if (cardekhoVehicleCondition === 'used' && cardekhoCityFilter !== 'All Cities') {
                      const vCity = (v.location || '').toLowerCase();
                      const targetCity = cardekhoCityFilter.toLowerCase().split(' ')[0];
                      if (!vCity.includes(targetCity)) {
                        return false;
                      }
                    }

                    // 7. Top Search Bar Query (Search cars, bikes, scooters...)
                    if (topVehicleSearch.trim()) {
                      const query = topVehicleSearch.toLowerCase().trim();
                      const searchBlob = `${v.name} ${v.brand} ${v.type} ${v.fuel} ${(v.features || []).join(' ')} ${(v.seating || '')} ${(v.location || '')}`.toLowerCase();
                      if (!searchBlob.includes(query)) {
                        return false;
                      }
                    }

                    return true;
                  };

                  const popularVehicles = VEHICLE_SHOWCASE_DATA.filter(v => v.status === 'popular' && matchesFilter(v));
                  const electricVehicles = VEHICLE_SHOWCASE_DATA.filter(v => (v.status === 'electric' || v.fuel.toLowerCase().includes('electric') || v.fuel.toLowerCase().includes('ev')) && matchesFilter(v));
                  const upcomingVehicles = VEHICLE_SHOWCASE_DATA.filter(v => v.status === 'upcoming' && matchesFilter(v));
                  const usedVehicles = VEHICLE_SHOWCASE_DATA.filter(v => v.status === 'used' && matchesFilter(v));

                  const isDefaultPortalView = cardekhoVehicleCondition === 'new' &&
                    cardekhoBrandFilter === 'All Brands' &&
                    cardekhoBudgetFilter === 'All Budgets' &&
                    cardekhoBodyTypeFilter === 'All' &&
                    !topVehicleSearch.trim();

                  return (
                    <>
                      {/* ============================================================== */}
                      {/* CASE A: DEFAULT PORTAL SHOWCASE (User Reference Image Layout)   */}
                      {/* ============================================================== */}
                      {isDefaultPortalView ? (
                        <>
                          {/* 1. LATEST & POPULAR CARS & SUVS IN INDIA */}
                          {(cardekhoSelectedType === 'All' || cardekhoSelectedType === 'Car') && (
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>🚗 Latest &amp; Popular Cars in India</h3>
                                <p>Explore top selling hatchbacks, sedans, compact SUVs and luxury MPVs with verified dealer festive discounts</p>
                              </div>
                              <button
                                type="button"
                                className="cb-section-viewall-link"
                                onClick={() => {
                                  setCardekhoSelectedType('Car');
                                  showToast('Filtered to Cars & SUVs');
                                }}
                              >
                                <span>Explore All Cars</span>
                                <i className="fa-solid fa-chevron-right"></i>
                              </button>
                            </div>

                            {/* Sub-Category Filter Chips */}
                            <div className="cb-subtabs-row">
                              {['All', 'SUV', 'Hatchback', 'Sedan', 'MPV'].map((tab) => (
                                <button
                                  key={tab}
                                  type="button"
                                  className={`cb-subtab-btn ${homeCarSubCategory === tab ? 'active' : ''}`}
                                  onClick={() => setHomeCarSubCategory(tab)}
                                >
                                  {tab === 'All' ? 'All Cars' : tab === 'MPV' ? 'MUV / 7-Seater' : `${tab}s`}
                                </button>
                              ))}
                            </div>

                            <div className="cardekho-cards-row full-width-grid">
                              {VEHICLE_SHOWCASE_DATA
                                .filter(v => v.type === 'Car' && v.status === 'popular')
                                .filter(v => {
                                  if (homeCarSubCategory === 'All') return true;
                                  const text = `${v.name} ${v.seating || ''} ${v.features.join(' ')}`.toLowerCase();
                                  if (homeCarSubCategory === 'SUV') return text.includes('suv') || text.includes('thar') || text.includes('nexon') || text.includes('creta') || text.includes('brezza');
                                  if (homeCarSubCategory === 'Hatchback') return text.includes('hatchback') || text.includes('swift') || text.includes('punch') || text.includes('i20');
                                  if (homeCarSubCategory === 'Sedan') return text.includes('sedan') || text.includes('dzire') || text.includes('city') || text.includes('verna');
                                  if (homeCarSubCategory === 'MPV') return text.includes('mpv') || text.includes('7') || text.includes('ertiga') || text.includes('innova');
                                  return true;
                                })
                                .map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-popular">🔥 Hot Seller</span>
                                      <img src={veh.image} alt={veh.name} loading="lazy" />
                                      <div className="card-media-tags">
                                        <span><i className="fa-solid fa-gas-pump"></i> {veh.fuel}</span>
                                        <span><i className="fa-solid fa-gauge-high"></i> {veh.mileage}</span>
                                      </div>
                                    </div>

                                    <div className="cardekho-card-body">
                                      <div className="veh-type-tag-small">Passenger Car • {veh.brand}</div>
                                      <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                      <div className="car-price">{veh.priceRange}</div>
                                      <div className="car-rating-row">
                                        <span className="rating-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
                                        <span className="seating-pill">{veh.seating || '5 Seater'}</span>
                                      </div>

                                      <div className="car-features-list">
                                        {veh.features.slice(0, 3).map((f) => (
                                          <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Festive Offers for ${veh.name} in ${selectedFuelCity}: Cash Discount up to ₹45,000 + Exchange Bonus!`)}
                                      >
                                        <i className="fa-solid fa-tag"></i>
                                        <span>View All Offers</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          )}

                          {/* 2. POPULAR BIKES & SCOOTERS IN INDIA */}
                          {(cardekhoSelectedType === 'All' || cardekhoSelectedType === 'Bike') && (
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>🏍️ Popular Bikes &amp; Scooters in India</h3>
                                <p>Explore best-selling commuter motorcycles, cruisers, sport bikes and electric scooters</p>
                              </div>
                              <button
                                type="button"
                                className="cb-section-viewall-link"
                                onClick={() => {
                                  setCardekhoSelectedType('Bike');
                                  showToast('Filtered to Bikes & Scooters');
                                }}
                              >
                                <span>Explore All Two-Wheelers</span>
                                <i className="fa-solid fa-chevron-right"></i>
                              </button>
                            </div>

                            {/* Sub-Category Filter Chips */}
                            <div className="cb-subtabs-row">
                              {['All', 'Motorcycle', 'Scooter', 'Cruiser', 'Sports'].map((tab) => (
                                <button
                                  key={tab}
                                  type="button"
                                  className={`cb-subtab-btn ${homeBikeSubCategory === tab ? 'active' : ''}`}
                                  onClick={() => setHomeBikeSubCategory(tab)}
                                >
                                  {tab === 'All' ? 'All Two-Wheelers' : tab === 'Motorcycle' ? 'Commuter Bikes' : `${tab}s`}
                                </button>
                              ))}
                            </div>

                            <div className="cardekho-cards-row full-width-grid">
                              {VEHICLE_SHOWCASE_DATA
                                .filter(v => v.type === 'Bike' && v.status === 'popular')
                                .filter(v => {
                                  if (homeBikeSubCategory === 'All') return true;
                                  const text = `${v.name} ${v.features.join(' ')}`.toLowerCase();
                                  if (homeBikeSubCategory === 'Motorcycle') return !text.includes('activa') && !text.includes('jupiter') && !text.includes('scooter');
                                  if (homeBikeSubCategory === 'Scooter') return text.includes('activa') || text.includes('jupiter') || text.includes('scooter');
                                  if (homeBikeSubCategory === 'Cruiser') return text.includes('classic') || text.includes('hunter') || text.includes('meteor') || text.includes('bullet');
                                  if (homeBikeSubCategory === 'Sports') return text.includes('mt-15') || text.includes('duke') || text.includes('r15') || text.includes('sports');
                                  return true;
                                })
                                .map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-popular">🏍️ Popular 2W</span>
                                      <img src={veh.image} alt={veh.name} loading="lazy" />
                                      <div className="card-media-tags">
                                        <span><i className="fa-solid fa-gas-pump"></i> {veh.fuel}</span>
                                        <span><i className="fa-solid fa-gauge-high"></i> {veh.mileage}</span>
                                      </div>
                                    </div>

                                    <div className="cardekho-card-body">
                                      <div className="veh-type-tag-small">Two-Wheeler • {veh.brand}</div>
                                      <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                      <div className="car-price">{veh.priceRange}</div>
                                      <div className="car-rating-row">
                                        <span className="rating-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
                                        <span className="seating-pill">{veh.seating || '2 Seater'}</span>
                                      </div>

                                      <div className="car-features-list">
                                        {veh.features.slice(0, 3).map((f) => (
                                          <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Festive Offers for ${veh.name} in ${selectedFuelCity}: ₹0 Down Payment & Free Helmet!`)}
                                      >
                                        <i className="fa-solid fa-tag"></i>
                                        <span>View Offers &amp; Price</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          )}

                          {/* 3. COMMERCIAL FLEETS, FREIGHT & AGRICULTURE (TruckDekho, BusDekho & TractorGuru) */}
                          {(cardekhoSelectedType === 'All' || ['Lorry', 'Bus', 'Van', 'Tractor', 'Auto'].includes(cardekhoSelectedType)) && (
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>🚛 Commercial Fleets &amp; Agricultural Machinery</h3>
                                <p>Heavy haulage trucks, tippers, luxury buses, cargo vans, autos &amp; agricultural tractors</p>
                              </div>
                              <button
                                type="button"
                                className="cb-section-viewall-link"
                                onClick={() => {
                                  setCardekhoSelectedType('Lorry');
                                  showToast('Filtered to Commercial Trucks & Lorries');
                                }}
                              >
                                <span>Commercial Hub</span>
                                <i className="fa-solid fa-chevron-right"></i>
                              </button>
                            </div>

                            {/* Sub-Category Filter Chips */}
                            <div className="cb-subtabs-row">
                              {[
                                { id: 'All', label: 'All Commercial' },
                                { id: 'Lorry', label: 'Trucks & Lorries' },
                                { id: 'Bus', label: 'Passenger Buses' },
                                { id: 'Van', label: 'Commercial Vans' },
                                { id: 'Tractor', label: 'Agricultural Tractors' },
                                { id: 'Auto', label: '3-Wheelers & Auto' }
                              ].map((tab) => (
                                <button
                                  key={tab.id}
                                  type="button"
                                  className={`cb-subtab-btn ${homeCommercialSubCategory === tab.id ? 'active' : ''}`}
                                  onClick={() => setHomeCommercialSubCategory(tab.id)}
                                >
                                  {tab.label}
                                </button>
                              ))}
                            </div>

                            <div className="cardekho-cards-row full-width-grid">
                              {VEHICLE_SHOWCASE_DATA
                                .filter(v => (v.type === 'Lorry' || v.type === 'Bus' || v.type === 'Van' || v.type === 'Tractor' || v.type === 'Auto') && v.status === 'popular')
                                .filter(v => homeCommercialSubCategory === 'All' || v.type === homeCommercialSubCategory)
                                .map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-popular">
                                        {veh.type === 'Tractor' ? '🚜 Farm Tractor' : veh.type === 'Lorry' ? '🚛 Heavy Truck' : veh.type === 'Bus' ? '🚌 Coach' : veh.type === 'Van' ? '🚐 Commercial Van' : '🛺 3-Wheeler'}
                                      </span>
                                      <img src={veh.image} alt={veh.name} loading="lazy" />
                                      <div className="card-media-tags">
                                        <span><i className="fa-solid fa-gas-pump"></i> {veh.fuel}</span>
                                        <span><i className="fa-solid fa-gauge-high"></i> {veh.mileage}</span>
                                      </div>
                                    </div>

                                    <div className="cardekho-card-body">
                                      <div className="veh-type-tag-small">{veh.type} • {veh.brand}</div>
                                      <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                      <div className="car-price">{veh.priceRange}</div>
                                      <div className="car-rating-row">
                                        <span className="rating-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
                                        <span className="seating-pill">{veh.seating || 'Commercial Grade'}</span>
                                      </div>

                                      <div className="car-features-list">
                                        {veh.features.slice(0, 3).map((f) => (
                                          <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Commercial Financing & Offers requested for ${veh.name}. Authorized dealer will call with fleet quote!`)}
                                      >
                                        <i className="fa-solid fa-file-invoice-dollar"></i>
                                        <span>View Commercial Financing</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          )}

                          {/* 4. COMPARE POPULAR VEHICLES (Side-by-Side Dual-Card Comparison Spotlight) */}
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>⚖️ Compare Popular Vehicles</h3>
                                <p>Side-by-side comparison of prices, specs, mileage and safety ratings to make an informed choice</p>
                              </div>
                              <button
                                type="button"
                                className="cb-section-viewall-link"
                                onClick={() => {
                                  setActiveHubTab('compare_vehicles');
                                  showToast('Switched to Vehicle Comparison Tool');
                                }}
                              >
                                <span>Full Comparison Tool</span>
                                <i className="fa-solid fa-arrow-right"></i>
                              </button>
                            </div>

                            <div className="cb-comparison-grid">
                              {POPULAR_COMPARISON_PAIRS.map((pair) => (
                                <div key={pair.id} className="cb-comparison-card">
                                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
                                    {pair.title} ({pair.category})
                                  </div>

                                  <div className="cb-comp-duo-row">
                                    <div className="cb-comp-veh-col">
                                      <img src={pair.vehicleA.image} alt={pair.vehicleA.name} loading="lazy" />
                                      <div className="cb-comp-veh-name" title={pair.vehicleA.name}>{pair.vehicleA.name}</div>
                                      <div className="cb-comp-veh-price">{pair.vehicleA.price}</div>
                                      <div className="cb-comp-veh-spec">{pair.vehicleA.spec}</div>
                                    </div>

                                    <div className="cb-comp-vs-badge">VS</div>

                                    <div className="cb-comp-veh-col">
                                      <img src={pair.vehicleB.image} alt={pair.vehicleB.name} loading="lazy" />
                                      <div className="cb-comp-veh-name" title={pair.vehicleB.name}>{pair.vehicleB.name}</div>
                                      <div className="cb-comp-veh-price">{pair.vehicleB.price}</div>
                                      <div className="cb-comp-veh-spec">{pair.vehicleB.spec}</div>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    className="btn-card-yellow-primary"
                                    onClick={() => {
                                      setActiveHubTab('compare_vehicles');
                                      showToast(`Comparing ${pair.vehicleA.name} vs ${pair.vehicleB.name}`);
                                    }}
                                  >
                                    <i className="fa-solid fa-code-compare"></i>
                                    <span>Compare {pair.vehicleA.name.split(' ')[0]} vs {pair.vehicleB.name.split(' ')[0]}</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 5. 100% ELECTRIC VEHICLES (EV MOBILITY SPOTLIGHT) */}
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>⚡ 100% Electric Vehicles (EV Showcase)</h3>
                                <p>Zero-tailpipe emissions: Electric cars, high-speed scooters, passenger autos &amp; smart city buses</p>
                              </div>
                              <button
                                type="button"
                                className="cb-section-viewall-link"
                                onClick={() => {
                                  setCardekhoSelectedType('EV');
                                  showToast('Filtered to 100% Electric Vehicles');
                                }}
                              >
                                <span>Explore All EV Models</span>
                                <i className="fa-solid fa-chevron-right"></i>
                              </button>
                            </div>

                            <div className="cardekho-cards-row full-width-grid">
                              {VEHICLE_SHOWCASE_DATA
                                .filter(v => v.status === 'electric' || v.type === 'EV' || v.fuel.toLowerCase().includes('electric') || v.fuel.toLowerCase().includes('ev'))
                                .map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-ev">⚡ Electric ({veh.type})</span>
                                      <img src={veh.image} alt={veh.name} loading="lazy" />
                                      <div className="card-media-tags">
                                        <span><i className="fa-solid fa-bolt"></i> {veh.fuel}</span>
                                        <span><i className="fa-solid fa-battery-full"></i> {veh.mileage}</span>
                                      </div>
                                    </div>

                                    <div className="cardekho-card-body">
                                      <div className="veh-type-tag-small">100% Electric • {veh.brand}</div>
                                      <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                      <div className="car-price">{veh.priceRange}</div>
                                      <div className="car-rating-row">
                                        <span className="rating-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
                                        <span className="seating-pill">{veh.seating || 'Electric Powertrain'}</span>
                                      </div>

                                      <div className="car-features-list">
                                        {veh.features.slice(0, 3).map((f) => (
                                          <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`State EV Subsidy & Offers for ${veh.name}: ₹10,000 FAME incentive + Free Home Charger installation!`)}
                                      >
                                        <i className="fa-solid fa-bolt"></i>
                                        <span>View EV Subsidies &amp; Price</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* 6. POPULAR AUTOMOTIVE MANUFACTURERS IN INDIA */}
                          <div className="cardekho-brands-strip-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>🏭 Popular Manufacturers Across Vehicles in India</h3>
                                <p>Click any brand to instantly browse all models, specifications and authorized dealers</p>
                              </div>
                            </div>

                            <div className="cardekho-brands-logos-grid">
                              {[
                                { name: 'Tata Motors', icon: 'fa-shield-halved', type: 'Cars, Trucks, EV, Buses', category: 'Car' },
                                { name: 'Maruti Suzuki', icon: 'fa-car', type: 'Cars & Vans', category: 'Car' },
                                { name: 'Mahindra', icon: 'fa-truck-pickup', type: 'SUVs, Autos & Tractors', category: 'Car' },
                                { name: 'Hyundai', icon: 'fa-bolt', type: 'Cars & Electric', category: 'Car' },
                                { name: 'Royal Enfield', icon: 'fa-motorcycle', type: 'Cruiser Motorcycles', category: 'Bike' },
                                { name: 'Hero MotoCorp', icon: 'fa-motorcycle', type: 'Motorcycles & Scooters', category: 'Bike' },
                                { name: 'Honda 2Wheelers', icon: 'fa-road', type: 'Activa, Shine & Bikes', category: 'Bike' },
                                { name: 'TVS Motor', icon: 'fa-motorcycle', type: 'Apache, Jupiter & iQube', category: 'Bike' },
                                { name: 'Bajaj Auto', icon: 'fa-gas-pump', type: 'Pulsar, Chetak EV & 3W', category: 'Bike' },
                                { name: 'Yamaha', icon: 'fa-motorcycle', type: 'MT-15, R15 & Aerox', category: 'Bike' },
                                { name: 'KTM', icon: 'fa-motorcycle', type: 'Duke & Adventure Sports', category: 'Bike' },
                                { name: 'Ashok Leyland', icon: 'fa-truck-moving', type: 'Lorries & Buses', category: 'Lorry' },
                                { name: 'Volvo Buses', icon: 'fa-bus', type: 'Luxury Coaches & Heavy Trucks', category: 'Bus' },
                                { name: 'Force Motors', icon: 'fa-van-shuttle', type: 'Traveller, Urbania & Vans', category: 'Van' },
                                { name: 'Ather & Ola', icon: 'fa-charging-station', type: 'Smart EV 2-Wheelers', category: 'Bike' },
                                { name: 'Swaraj & John Deere', icon: 'fa-tractor', type: 'Agricultural Tractors', category: 'Tractor' },
                              ]
                                .filter((brand) => {
                                  if (cardekhoSelectedType === 'All') return true;
                                  if (cardekhoSelectedType === 'Car') return brand.category === 'Car';
                                  if (cardekhoSelectedType === 'Bike') return brand.category === 'Bike';
                                  if (cardekhoSelectedType === 'Lorry') return brand.category === 'Lorry';
                                  if (cardekhoSelectedType === 'Bus') return brand.category === 'Bus';
                                  if (cardekhoSelectedType === 'Van') return brand.category === 'Van';
                                  if (cardekhoSelectedType === 'Tractor') return brand.category === 'Tractor';
                                  if (cardekhoSelectedType === 'Auto') return brand.type.includes('3W') || brand.type.includes('Autos');
                                  if (cardekhoSelectedType === 'EV') return brand.type.includes('EV') || brand.type.includes('Electric');
                                  return true;
                                })
                                .map((brand) => (
                                <div
                                  key={brand.name}
                                  className="brand-logo-card"
                                  onClick={() => {
                                    setCardekhoBrandFilter(brand.name.split(' ')[0]);
                                    setCardekhoSearchBy('brand');
                                    showToast(`Filtered for ${brand.name} models`);
                                  }}
                                >
                                  <i className={`fa-solid ${brand.icon}`}></i>
                                  <span className="brand-title">{brand.name}</span>
                                  <span className="brand-sub">{brand.type}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 7. CERTIFIED PRE-OWNED VEHICLES (SART ASSURED USED) */}
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>🛡️ SART Certified Pre-Owned Vehicles (200+ Point Inspected)</h3>
                                <p>Verified cars, bikes &amp; commercial vehicles with warranty, 7-day money-back &amp; free RC transfer</p>
                              </div>
                              <button
                                type="button"
                                className="cb-section-viewall-link"
                                onClick={() => {
                                  setCardekhoVehicleCondition('used');
                                  showToast('Switched to Certified Used Vehicles View');
                                }}
                              >
                                <span>View All Used Vehicles</span>
                                <i className="fa-solid fa-chevron-right"></i>
                              </button>
                            </div>

                            <div className="cardekho-cards-row full-width-grid">
                              {VEHICLE_SHOWCASE_DATA.filter(v => v.status === 'used').slice(0, 8).map((veh) => (
                                <div key={veh.id} className="cardekho-vehicle-card used-card-border">
                                  <div className="cardekho-card-media">
                                    <span className="media-badge badge-used">🛡️ Certified {veh.type}</span>
                                    <img src={veh.image} alt={veh.name} loading="lazy" />
                                    <div className="card-media-tags">
                                      <span><i className="fa-solid fa-location-dot"></i> {veh.location || selectedFuelCity}</span>
                                    </div>
                                  </div>

                                  <div className="cardekho-card-body">
                                    <div className="veh-type-tag-small">{veh.type} • {veh.brand}</div>
                                    <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                    <div className="car-price">{veh.priceRange}</div>

                                    <div className="used-car-stats-grid">
                                      <span><i className="fa-regular fa-calendar"></i> {veh.year}</span>
                                      <span><i className="fa-solid fa-road"></i> {veh.kmsDriven}</span>
                                      <span><i className="fa-solid fa-user"></i> {veh.owners}</span>
                                      <span><i className="fa-solid fa-gas-pump"></i> {veh.fuel}</span>
                                    </div>

                                    <button
                                      type="button"
                                      className="btn-card-yellow-primary"
                                      onClick={() => showToast(`Home Test Drive scheduled for ${veh.name}! SART certified technician will contact you.`)}
                                    >
                                      <i className="fa-solid fa-key"></i>
                                      <span>Book Free Home Test Drive</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 8. LATEST AUTOMOTIVE NEWS & EXPERT ROAD TESTS */}
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>📰 Latest Automotive News &amp; Expert Road Tests</h3>
                                <p>Independent road reviews, real-world mileage checks, electric battery tests &amp; industry launches</p>
                              </div>
                            </div>

                            <div className="cb-news-grid">
                              {AUTOMOTIVE_NEWS_DATA.map((article) => (
                                <div
                                  key={article.id}
                                  className="cb-news-card"
                                  onClick={() => showToast(`Opening article: "${article.title}"`)}
                                >
                                  <div className="cb-news-img-box">
                                    <span className="cb-news-category-badge">{article.category}</span>
                                    <img src={article.image} alt={article.title} loading="lazy" />
                                  </div>
                                  <div className="cb-news-content">
                                    <div className="cb-news-meta-row">
                                      <span><i className="fa-regular fa-clock"></i> {article.readTime}</span>
                                      <span>{article.date}</span>
                                    </div>
                                    <h4 className="cb-news-title">{article.title}</h4>
                                    <p className="cb-news-snippet">{article.snippet}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 9. POPULAR VEHICLE VIDEO REVIEWS & WALKAROUNDS */}
                          <div className="cardekho-catalog-section">
                            <div className="cb-section-header-row">
                              <div className="cb-section-title-wrap">
                                <h3>🎬 Popular Vehicle Video Reviews &amp; Test Drives</h3>
                                <p>Watch in-depth walkarounds, performance road tests and drag races by automobile experts</p>
                              </div>
                            </div>

                            <div className="cb-videos-grid">
                              {VEHICLE_VIDEO_REVIEWS.map((vid) => (
                                <div
                                  key={vid.id}
                                  className="cb-video-card"
                                  onClick={() => showToast(`Playing video: "${vid.title}"`)}
                                >
                                  <div className="cb-video-thumb-box">
                                    <img src={vid.image} alt={vid.title} loading="lazy" />
                                    <div className="cb-video-play-overlay">
                                      <i className="fa-solid fa-play"></i>
                                    </div>
                                    <span className="cb-video-duration">{vid.duration}</span>
                                  </div>
                                  <div className="cb-video-info">
                                    <h4 className="cb-video-title">{vid.title}</h4>
                                    <div className="cb-video-channel">
                                      <i className="fa-brands fa-youtube" style={{ color: '#ef4444' }}></i>
                                      <span>{vid.channel} • {vid.views}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        /* ============================================================== */
                        /* CASE B: DYNAMICALLY FILTERED VIEW (When user chooses from form) */
                        /* ============================================================== */
                        <>
                          {/* 1. FILTERED NEW OR POPULAR VEHICLES */}
                          {popularVehicles.length > 0 && (
                            <div className="cardekho-catalog-section">
                              <div className="section-title-line">
                                <div>
                                  <h3 className="section-title-text">
                                    {cardekhoVehicleCondition === 'new'
                                      ? `Matching New Vehicles • ${cardekhoSelectedType === 'All' ? 'All Classes' : cardekhoSelectedType}`
                                      : 'Available Certified Pre-Owned Vehicles'}
                                  </h3>
                                  <p className="section-title-sub">Showing verified vehicles matching your selected criteria with instant dealer quotes</p>
                                </div>
                                <span className="section-count-tag">
                                  {popularVehicles.length} Vehicles
                                </span>
                              </div>

                              <div className="cardekho-cards-row full-width-grid">
                                {popularVehicles.map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-popular">🔥 {veh.type}</span>
                                      <img src={veh.image} alt={veh.name} loading="lazy" />
                                      <div className="card-media-tags">
                                        <span><i className="fa-solid fa-gas-pump"></i> {veh.fuel}</span>
                                        <span><i className="fa-solid fa-gauge-high"></i> {veh.mileage}</span>
                                      </div>
                                    </div>

                                    <div className="cardekho-card-body">
                                      <div className="veh-type-tag-small">{veh.type} • {veh.brand}</div>
                                      <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                      <div className="car-price">{veh.priceRange}</div>
                                      <div className="car-rating-row">
                                        <span className="rating-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
                                        <span className="seating-pill">{veh.seating || 'Standard'}</span>
                                      </div>

                                      <div className="car-features-list">
                                        {veh.features.slice(0, 3).map((f) => (
                                          <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Festive Offers for ${veh.name} in ${selectedFuelCity}: Maximum dealer discounts applied!`)}
                                      >
                                        <i className="fa-solid fa-tag"></i>
                                        <span>View Offers &amp; Price</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 2. FILTERED ELECTRIC VEHICLES */}
                          {electricVehicles.length > 0 && (
                            <div className="cardekho-catalog-section">
                              <div className="section-title-line">
                                <div>
                                  <h3 className="section-title-text">⚡ Electric Mobility (EV) • {cardekhoSelectedType === 'All' ? 'All Classes' : cardekhoSelectedType}</h3>
                                  <p className="section-title-sub">Zero tailpipe emissions, lower running cost &amp; fast highway charging network</p>
                                </div>
                                <span className="section-count-tag tag-ev">
                                  {electricVehicles.length} EVs
                                </span>
                              </div>

                              <div className="cardekho-cards-row full-width-grid">
                                {electricVehicles.map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-ev">⚡ Electric {veh.type}</span>
                                      <img src={veh.image} alt={veh.name} loading="lazy" />
                                      <div className="card-media-tags">
                                        <span><i className="fa-solid fa-battery-full"></i> {veh.mileage}</span>
                                        <span><i className="fa-solid fa-plug"></i> Fast Charge</span>
                                      </div>
                                    </div>

                                    <div className="cardekho-card-body">
                                      <div className="veh-type-tag-small">EV • {veh.brand}</div>
                                      <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                      <div className="car-price">{veh.priceRange}</div>
                                      <div className="car-rating-row">
                                        <span className="rating-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
                                        <span className="seating-pill">{veh.seating || 'EV Spec'}</span>
                                      </div>

                                      <div className="car-features-list">
                                        {veh.features.slice(0, 3).map((f) => (
                                          <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Subsidies and Fast Charging Map for ${veh.name} sent to your WhatsApp!`)}
                                      >
                                        <i className="fa-solid fa-bolt"></i>
                                        <span>View EV Subsidies &amp; Price</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 3. FILTERED UPCOMING VEHICLES */}
                          {upcomingVehicles.length > 0 && (
                            <div className="cardekho-catalog-section">
                              <div className="section-title-line">
                                <div>
                                  <h3 className="section-title-text">🚀 Upcoming Launches • {cardekhoSelectedType === 'All' ? 'All Classes' : cardekhoSelectedType}</h3>
                                  <p className="section-title-sub">Be the first to book! Pre-bookings opening soon with exclusive launch price guarantee</p>
                                </div>
                                <span className="section-count-tag tag-upcoming">
                                  {upcomingVehicles.length} Launches
                                </span>
                              </div>

                              <div className="cardekho-cards-row full-width-grid">
                                {upcomingVehicles.map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-upcoming">🚀 Upcoming {veh.type}</span>
                                      <img src={veh.image} alt={veh.name} loading="lazy" />
                                      {veh.launchDate && (
                                        <div className="card-media-tags">
                                          <span><i className="fa-regular fa-clock"></i> {veh.launchDate}</span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="cardekho-card-body">
                                      <div className="veh-type-tag-small">{veh.type} • {veh.brand}</div>
                                      <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                      <div className="car-price">{veh.priceRange}</div>
                                      <div className="launch-expected-banner">
                                        <i className="fa-solid fa-calendar-check"></i> {veh.launchDate}
                                      </div>

                                      <div className="car-features-list">
                                        {veh.features.slice(0, 3).map((f) => (
                                          <span key={f} className="feat-chip"><i className="fa-solid fa-check"></i> {f}</span>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Priority Launch Alert set for ${veh.name}! We will notify you upon launch.`)}
                                      >
                                        <i className="fa-regular fa-bell"></i>
                                        <span>Set Launch Alert</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 4. FILTERED USED VEHICLES (When in used mode or searching used) */}
                          {usedVehicles.length > 0 && (
                            <div className="cardekho-catalog-section">
                              <div className="section-title-line">
                                <div>
                                  <h3 className="section-title-text">
                                    🛡️ Certified Pre-Owned {cardekhoSelectedType === 'All' ? 'Vehicles' : cardekhoSelectedType === 'Car' ? 'Cars & SUVs' : cardekhoSelectedType === 'Bike' ? 'Bikes & Scooters' : cardekhoSelectedType === 'Van' ? 'Commercial Vans' : cardekhoSelectedType === 'Bus' ? 'Buses' : cardekhoSelectedType === 'Lorry' ? 'Commercial Trucks' : cardekhoSelectedType === 'Tractor' ? 'Agricultural Tractors' : cardekhoSelectedType === 'Auto' ? '3-Wheelers & Autos' : 'Electric Vehicles'}
                                    {cardekhoCityFilter !== 'All Cities' && ` in ${cardekhoCityFilter}`}
                                  </h3>
                                  <p className="section-title-sub">Verified pre-owned vehicles with 200+ point inspection, warranty, 7-day money back &amp; free RC transfer</p>
                                </div>
                                <span className="section-count-tag tag-used">
                                  {usedVehicles.length} Units
                                </span>
                              </div>

                              <div className="cardekho-cards-row full-width-grid">
                                {usedVehicles.map((veh) => (
                                  <div key={veh.id} className="cardekho-vehicle-card used-card-border">
                                    <div className="cardekho-card-media">
                                      <span className="media-badge badge-used">🛡️ Certified {veh.type}</span>
                                      <img src={veh.image} alt={veh.name} loading="lazy" />
                                      <div className="card-media-tags">
                                        <span><i className="fa-solid fa-location-dot"></i> {veh.location || cardekhoCityFilter}</span>
                                      </div>
                                    </div>

                                    <div className="cardekho-card-body">
                                      <div className="veh-type-tag-small">{veh.type} • {veh.brand}</div>
                                      <h4 className="car-name" title={veh.name}>{veh.name}</h4>
                                      <div className="car-price">{veh.priceRange}</div>

                                      <div className="used-car-stats-grid">
                                        <span><i className="fa-regular fa-calendar"></i> {veh.year}</span>
                                        <span><i className="fa-solid fa-road"></i> {veh.kmsDriven}</span>
                                        <span><i className="fa-solid fa-user"></i> {veh.owners}</span>
                                        <span><i className="fa-solid fa-gas-pump"></i> {veh.fuel}</span>
                                      </div>

                                      <button
                                        type="button"
                                        className="btn-card-yellow-primary"
                                        onClick={() => showToast(`Home Test Drive scheduled for ${veh.name} in ${veh.location || cardekhoCityFilter}!`)}
                                      >
                                        <i className="fa-solid fa-key"></i>
                                        <span>Book Free Home Test Drive</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* NO MATCH FOUND FALLBACK */}
                          {popularVehicles.length === 0 && electricVehicles.length === 0 && upcomingVehicles.length === 0 && usedVehicles.length === 0 && (
                            <div className="empty-search-state" style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '16px', margin: '20px 0' }}>
                              <i className="fa-solid fa-car-tunnel" style={{ fontSize: '42px', color: '#94a3b8', marginBottom: '14px' }}></i>
                              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>No exact vehicle match found</h4>
                              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                                We couldn't find vehicles matching your selected filters. Try resetting the filters to view all models.
                              </p>
                              <button
                                type="button"
                                className="btn-carandbike-search-yellow"
                                style={{ display: 'inline-flex', width: 'auto', padding: '10px 24px', margin: '0 auto' }}
                                onClick={() => {
                                  setCardekhoSelectedType('All');
                                  setCardekhoBrandFilter('All Brands');
                                  setCardekhoModelFilter('All Models');
                                  setCardekhoBodyTypeFilter('All');
                                  setCardekhoBudgetFilter('All Budgets');
                                  setCardekhoCityFilter('All Cities');
                                  setCardekhoSearchBy('budget');
                                  showToast('Reset all filters to All Vehicles');
                                }}
                              >
                                <i className="fa-solid fa-rotate-left"></i>
                                <span>Reset Filters (Show All Vehicles)</span>
                              </button>
                            </div>
                          )}

                          {/* RELEVANT BRANDS STRIP */}
                          <div className="cardekho-brands-strip-section">
                            <h3 className="section-title-text">
                              {cardekhoSelectedType === 'All' ? 'Popular Manufacturers in India' : `Popular ${cardekhoSelectedType} Brands`}
                            </h3>
                            <div className="cardekho-brands-logos-grid">
                              {[
                                { name: 'Tata Motors', icon: 'fa-shield-halved', type: 'Cars, Trucks, EV, Buses', category: ['Car', 'Lorry', 'Bus', 'EV'] },
                                { name: 'Maruti Suzuki', icon: 'fa-car', type: 'Cars & Vans', category: ['Car', 'Van'] },
                                { name: 'Mahindra', icon: 'fa-truck-pickup', type: 'SUVs, Autos & Tractors', category: ['Car', 'Auto', 'Tractor', 'EV'] },
                                { name: 'Hyundai', icon: 'fa-bolt', type: 'Cars & Electric', category: ['Car', 'EV'] },
                                { name: 'Royal Enfield', icon: 'fa-motorcycle', type: 'Cruiser Motorcycles', category: ['Bike'] },
                                { name: 'Hero MotoCorp', icon: 'fa-motorcycle', type: 'Motorcycles & Scooters', category: ['Bike'] },
                                { name: 'Honda 2Wheelers', icon: 'fa-road', type: 'Activa, Shine & Bikes', category: ['Bike'] },
                                { name: 'TVS Motor', icon: 'fa-motorcycle', type: 'Apache, Jupiter & iQube', category: ['Bike', 'Auto', 'EV'] },
                                { name: 'Bajaj Auto', icon: 'fa-gas-pump', type: 'Pulsar, Chetak EV & 3W', category: ['Bike', 'Auto', 'EV'] },
                                { name: 'Yamaha', icon: 'fa-motorcycle', type: 'MT-15, R15 & Aerox', category: ['Bike'] },
                                { name: 'KTM', icon: 'fa-motorcycle', type: 'Duke & Adventure Sports', category: ['Bike'] },
                                { name: 'Ashok Leyland', icon: 'fa-truck-moving', type: 'Lorries & Buses', category: ['Lorry', 'Bus'] },
                                { name: 'Volvo Buses', icon: 'fa-bus', type: 'Luxury Coaches & Heavy Trucks', category: ['Bus', 'Lorry'] },
                                { name: 'Force Motors', icon: 'fa-van-shuttle', type: 'Traveller, Urbania & Vans', category: ['Van', 'Bus'] },
                                { name: 'Ather & Ola', icon: 'fa-charging-station', type: 'Smart EV 2-Wheelers', category: ['Bike', 'EV'] },
                                { name: 'Swaraj & John Deere', icon: 'fa-tractor', type: 'Agricultural Tractors', category: ['Tractor'] },
                              ]
                                .filter(brand => cardekhoSelectedType === 'All' || brand.category.includes(cardekhoSelectedType))
                                .map((brand) => (
                                  <div
                                    key={brand.name}
                                    className="brand-logo-card"
                                    onClick={() => {
                                      setCardekhoBrandFilter(brand.name.split(' ')[0]);
                                      setCardekhoSearchBy('brand');
                                      showToast(`Filtered for ${brand.name} models`);
                                    }}
                                  >
                                    <i className={`fa-solid ${brand.icon}`}></i>
                                    <span className="brand-title">{brand.name}</span>
                                    <span className="brand-sub">{brand.type}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
      </div>
  );
}