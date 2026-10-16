'use client';

import React, { useState } from 'react';
import { COMPARISON_VEHICLES, ComparisonVehicle, POPULAR_COMPARISON_PAIRS } from '../storeData';

interface StoreCompareHubProps {
  showToast: (msg: string) => void;
  userLocationCity?: string;
}

export default function StoreCompareHub({ showToast, userLocationCity = 'Chennai' }: StoreCompareHubProps) {
  const [selectedCompareVehicleType, setSelectedCompareVehicleType] = useState<string>('Car');
  const [compareSelectedVehicles, setCompareSelectedVehicles] = useState<(ComparisonVehicle | null)[]>([
    COMPARISON_VEHICLES.find((v) => v.category === 'Car') || COMPARISON_VEHICLES[12],
    COMPARISON_VEHICLES.filter((v) => v.category === 'Car')[1] || COMPARISON_VEHICLES[13],
    null,
    null
  ]);
  const [compareActiveCategory, setCompareActiveCategory] = useState<string>('All');
  const [compareVehicleSearchQuery, setCompareVehicleSearchQuery] = useState<string>('');
  const [comparePickerSlot, setComparePickerSlot] = useState<number | null>(null);
  const [comparePopularTab, setComparePopularTab] = useState<'All' | 'Scooters' | 'Electric' | 'Bikes' | 'Cars' | 'Commercial'>('All');

          const filledVehicles = compareSelectedVehicles.filter((v): v is ComparisonVehicle => v !== null);

          // Filter vehicles for the selection modal
          const modalAvailableVehicles = COMPARISON_VEHICLES.filter((v) => {
            const matchesCat = compareActiveCategory === 'All' || v.category === compareActiveCategory;
            const matchesSearch = !compareVehicleSearchQuery.trim() ||
              v.name.toLowerCase().includes(compareVehicleSearchQuery.toLowerCase()) ||
              v.brand.toLowerCase().includes(compareVehicleSearchQuery.toLowerCase());
            return matchesCat && matchesSearch;
          });

          // Popular comparison pairs based on screenshot
          const popularPairs = [
            {
              cat: 'Scooters',
              vA: COMPARISON_VEHICLES.find(v => v.id === 'comp-ntorq') || COMPARISON_VEHICLES[0],
              vB: COMPARISON_VEHICLES.find(v => v.id === 'comp-rayzr') || COMPARISON_VEHICLES[1]
            },
            {
              cat: 'Electric',
              vA: COMPARISON_VEHICLES.find(v => v.id === 'comp-olas1x') || COMPARISON_VEHICLES[2],
              vB: COMPARISON_VEHICLES.find(v => v.id === 'comp-qc1') || COMPARISON_VEHICLES[3]
            },
            {
              cat: 'Bikes',
              vA: COMPARISON_VEHICLES.find(v => v.id === 'comp-rr300') || COMPARISON_VEHICLES[9],
              vB: COMPARISON_VEHICLES.find(v => v.id === 'comp-r15') || COMPARISON_VEHICLES[8]
            },
            {
              cat: 'Cars',
              vA: COMPARISON_VEHICLES.find(v => v.id === 'comp-creta') || COMPARISON_VEHICLES[13],
              vB: COMPARISON_VEHICLES.find(v => v.id === 'comp-seltos') || COMPARISON_VEHICLES[15]
            }
          ].filter(pair => comparePopularTab === 'All' || pair.cat === comparePopularTab || (comparePopularTab === 'Scooters' && pair.cat === 'Scooters'));

          return (
            <section className="hub-showcase-view animate-pop carbike-compare-wrapper">
              {/* 1. TOP HEADER & INTRO */}
              <div className="cb-compare-header">
                <div className="cb-header-title-row">
                  <div>
                    <h2>Compare Your Dream {selectedCompareVehicleType === 'All' ? 'Vehicle' : selectedCompareVehicleType}</h2>
                    <p>
                      Planning on buying a vehicle? Confused between options? Select your vehicle type, pick up to <strong>four vehicles</strong>,
                      and compare specifications, real on-road pricing, fuel economy, safety, and monthly ownership cost.
                    </p>
                  </div>

                  <span className="cb-active-class-pill">
                    <i className="fa-solid fa-shapes"></i> Category: {selectedCompareVehicleType}
                  </span>
                </div>

                {/* STEP 1: CHOOSE VEHICLE OPTION FIRST (ALL SART VEHICLE CLASSES) */}
                <div className="cb-vehicle-type-selector-bar">
                  <span className="type-bar-label">
                    <i className="fa-solid fa-layer-group"></i> <strong>Step 1: Choose Vehicle Type:</strong>
                  </span>
                  <div className="type-buttons-scroll">
                    {[
                      { id: 'Car', label: 'Cars & SUVs', icon: 'fa-car-side' },
                      { id: 'Scooter', label: 'Scooters', icon: 'fa-motorcycle' },
                      { id: 'Bike', label: 'Bikes & Motorcycles', icon: 'fa-motorcycle' },
                      { id: 'EV', label: 'Electric (EV)', icon: 'fa-bolt' },
                      { id: 'Commercial', label: 'Trucks & Lorries', icon: 'fa-truck' },
                      { id: 'Auto', label: 'Auto Rickshaws', icon: 'fa-taxi' },
                      { id: 'All', label: 'All Vehicles', icon: 'fa-globe' }
                    ].map((vt) => (
                      <button
                        key={vt.id}
                        type="button"
                        className={`cb-type-tab-btn ${selectedCompareVehicleType === vt.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCompareVehicleType(vt.id);
                          setCompareActiveCategory(vt.id);

                          // Load 2 matching defaults for this class
                          const matching = vt.id === 'All'
                            ? COMPARISON_VEHICLES
                            : COMPARISON_VEHICLES.filter(v => v.category === vt.id || (vt.id === 'Auto' && v.category === 'Scooter'));

                          if (matching.length >= 2) {
                            setCompareSelectedVehicles([matching[0], matching[1], null, null]);
                          } else if (matching.length === 1) {
                            setCompareSelectedVehicles([matching[0], null, null, null]);
                          }

                          showToast(`Selected ${vt.label} category for comparison`);
                        }}
                      >
                        <i className={`fa-solid ${vt.icon}`}></i>
                        <span>{vt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. 4 COMPARISON SLOTS ROW (DESKTOP 4 MAX, FULLY RESPONSIVE) */}
              <div className="cb-compare-slots-row">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const veh = compareSelectedVehicles[slotIdx];
                  const slotLabel = selectedCompareVehicleType === 'All' ? 'Vehicle' : selectedCompareVehicleType;
                  return (
                    <div key={slotIdx} className={`cb-slot-card ${veh ? 'has-vehicle' : 'is-empty'}`}>
                      {veh ? (
                        <div className="cb-slot-filled">
                          <button
                            type="button"
                            className="btn-slot-remove"
                            title="Remove from comparison"
                            onClick={() => {
                              const updated = [...compareSelectedVehicles];
                              updated[slotIdx] = null;
                              setCompareSelectedVehicles(updated);
                              showToast(`Removed ${veh.name}`);
                            }}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                          <img src={veh.image} alt={veh.name} className="cb-slot-img" />
                          <span className="cb-slot-brand">{veh.brand}</span>
                          <h4 className="cb-slot-name" title={veh.name}>{veh.name}</h4>
                          <span className="cb-slot-price">{veh.price}</span>
                          <button
                            type="button"
                            className="btn-slot-change"
                            onClick={() => {
                              setComparePickerSlot(slotIdx);
                            }}
                          >
                            <i className="fa-solid fa-arrows-rotate"></i> Change Vehicle
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="cb-slot-empty-btn"
                          onClick={() => {
                            setComparePickerSlot(slotIdx);
                          }}
                        >
                          <div className="slot-plus-circle">
                            <i className="fa-solid fa-plus"></i>
                          </div>
                          <span className="slot-btn-label">
                            Add {slotLabel} {slotIdx + 1}
                          </span>
                          <span className="slot-btn-sub">Click to select from SART</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* COMPARE ACTION BUTTON */}
              <div className="cb-compare-action-bar">
                <button
                  type="button"
                  className="btn-primary-compare"
                  disabled={filledVehicles.length < 2}
                  onClick={() => {
                    const tableElem = document.getElementById('sart-compare-table-anchor');
                    if (tableElem) {
                      tableElem.scrollIntoView({ behavior: 'smooth' });
                    }
                    showToast(`Comparing ${filledVehicles.length} vehicles side-by-side!`);
                  }}
                >
                  <i className="fa-solid fa-code-compare"></i> Compare ({filledVehicles.length} Selected)
                </button>
                {filledVehicles.length < 2 && (
                  <span className="compare-hint-text">
                    <i className="fa-solid fa-circle-info"></i> Please select at least 2 vehicles to view comparison table.
                  </span>
                )}
              </div>

              {/* 3. POPULAR COMPARISONS BAR (MATCHING USER SCREENSHOT) */}
              <div className="cb-popular-comparisons-section">
                <div className="section-head-line">
                  <h3>Popular {selectedCompareVehicleType === 'All' ? 'Vehicle' : selectedCompareVehicleType} Comparisons</h3>
                  <div className="cb-cat-pills">
                    {(['All', 'Scooters', 'Electric', 'Bikes', 'Cars'] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        className={`cb-cat-pill-btn ${comparePopularTab === tab ? 'active' : ''}`}
                        onClick={() => setComparePopularTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="cb-popular-cards-grid">
                  {popularPairs.map((pair, idx) => (
                    <div key={idx} className="cb-popular-pair-card">
                      <div className="pair-images-row">
                        <div className="pair-side">
                          <img src={pair.vA.image} alt={pair.vA.name} />
                          <h5 className="pair-veh-title">{pair.vA.name}</h5>
                          <span className="pair-veh-price">{pair.vA.price}</span>
                        </div>

                        <div className="pair-vs-badge">V/S</div>

                        <div className="pair-side">
                          <img src={pair.vB.image} alt={pair.vB.name} />
                          <h5 className="pair-veh-title">{pair.vB.name}</h5>
                          <span className="pair-veh-price">{pair.vB.price}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-compare-now-pair"
                        onClick={() => {
                          setCompareSelectedVehicles([pair.vA, pair.vB, null, null]);
                          showToast(`Loaded comparison for ${pair.vA.name} vs ${pair.vB.name}`);
                          const anchor = document.getElementById('sart-compare-table-anchor');
                          if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <span>Compare Now</span>
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. POPULAR MODELS IN INDIA (DYNAMIC BY SELECTED VEHICLE TYPE) */}
              {(() => {
                const popularVehiclesToShow = (selectedCompareVehicleType === 'All'
                  ? COMPARISON_VEHICLES
                  : COMPARISON_VEHICLES.filter(v => v.category === selectedCompareVehicleType || (selectedCompareVehicleType === 'Auto' && v.category === 'Scooter'))
                ).slice(0, 6);

                return (
                  <div className="cb-popular-vehicles-section">
                    <div className="section-head-line">
                      <h3>Popular {selectedCompareVehicleType === 'All' ? 'Vehicles' : selectedCompareVehicleType + 's'} In India</h3>
                      <span className="sec-sub-count">{popularVehiclesToShow.length} Models Verified</span>
                    </div>

                    <div className="cb-vehicles-scroll-row">
                      {popularVehiclesToShow.map((veh) => (
                        <div key={veh.id} className="cb-vehicle-mini-card">
                          <div className="card-top-fav">
                            <i className="fa-regular fa-heart"></i>
                          </div>
                          <img src={veh.image} alt={veh.name} className="cb-mini-img" />
                          <h4 className="cb-mini-name">{veh.name}</h4>
                          <div className="cb-mini-specs">
                            <span>{veh.engine.split(' ')[0]}</span> • <span>{veh.mileage.split(' ')[0]}</span>
                          </div>
                          <div className="cb-mini-price">{veh.price}</div>
                          <button
                            type="button"
                            className="btn-get-onroad-link"
                            onClick={() => {
                              showToast(`Estimated on-road price for ${veh.name} in ${userLocationCity} is ${veh.price}`);
                            }}
                          >
                            <span>Get on road price</span>
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* 5. SIDE-BY-SIDE SPEC COMPARISON TABLE (ANCHOR FOR SCROLL) */}
              <div id="sart-compare-table-anchor" className="comparison-table-wrap">
                <div className="table-header-info">
                  <h3>
                    <i className="fa-solid fa-table-columns"></i> Side-by-Side Detailed Specification Matrix
                  </h3>
                  <span className="active-count-tag">
                    {filledVehicles.length} of 4 vehicles active
                  </span>
                </div>

                {filledVehicles.length >= 2 ? (
                  <div className="table-responsive-box">
                    <table className="comparison-table multi-slot-table">
                      <thead>
                        <tr>
                          <th className="th-feature-metric">Features &amp; Metrics</th>
                          {filledVehicles.map((v, idx) => (
                            <th key={`${v.id}-${idx}`} className="th-veh-col">
                              <div className="th-veh-head">
                                <img src={v.image} alt={v.name} />
                                <span className="th-brand">{v.brand}</span>
                                <strong>{v.name}</strong>
                                <span className="th-price">{v.price}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {/* Group 1: Pricing */}
                        <tr className="table-group-header">
                          <td colSpan={filledVehicles.length + 1}>
                            <i className="fa-solid fa-indian-rupee-sign"></i> 1. Pricing &amp; Warranty
                          </td>
                        </tr>
                        <tr>
                          <td className="spec-label">Price Range</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-price-${idx}`}><strong className="highlight-metric">{v.price}</strong></td>
                          ))}
                        </tr>
                        <tr>
                          <td className="spec-label">Manufacturer Warranty</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-warr-${idx}`}>{v.warranty}</td>
                          ))}
                        </tr>

                        {/* Group 2: Engine & Specs */}
                        <tr className="table-group-header">
                          <td colSpan={filledVehicles.length + 1}>
                            <i className="fa-solid fa-gauge-high"></i> 2. Powertrain, Power &amp; Mileage
                          </td>
                        </tr>
                        <tr>
                          <td className="spec-label">Engine / Battery Spec</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-eng-${idx}`}>{v.engine}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="spec-label">Max Power &amp; Output</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-pwr-${idx}`}><strong className="highlight-metric">{v.power}</strong></td>
                          ))}
                        </tr>
                        <tr>
                          <td className="spec-label">Certified Mileage / Range</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-mil-${idx}`}><span className="mileage-badge">{v.mileage}</span></td>
                          ))}
                        </tr>

                        {/* Group 3: Safety & Brakes */}
                        <tr className="table-group-header">
                          <td colSpan={filledVehicles.length + 1}>
                            <i className="fa-solid fa-shield-halved"></i> 3. Safety, Brakes &amp; Ergonomics
                          </td>
                        </tr>
                        <tr>
                          <td className="spec-label">Braking &amp; Safety Tech</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-saf-${idx}`}><span className="safety-badge">{v.safety}</span></td>
                          ))}
                        </tr>
                        <tr>
                          <td className="spec-label">Chassis &amp; Protective Frame</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-airb-${idx}`}>{v.airbags}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="spec-label">Seating &amp; Class</td>
                          {filledVehicles.map((v, idx) => (
                            <td key={`${v.id}-seat-${idx}`}>{v.seating}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="choose-atleast-two-card">
                    <i className="fa-solid fa-arrows-split-up-and-left fa-3x"></i>
                    <h4>Select at least 2 vehicles to unlock detailed side-by-side comparison</h4>
                    <p>Click on any "+ Add Scooter" slot above or pick one of our Popular Comparisons!</p>
                  </div>
                )}
              </div>

              {/* 6. VEHICLE PICKER MODAL (Choose Any SART Vehicle for Slot) */}
              {comparePickerSlot !== null && (
                <div className="cb-picker-modal-overlay" onClick={() => setComparePickerSlot(null)}>
                  <div className="cb-picker-modal-card animate-pop" onClick={(e) => e.stopPropagation()}>
                    <div className="picker-modal-header">
                      <div>
                        <h3>Select Vehicle for Slot {comparePickerSlot + 1}</h3>
                        <p>Pick from all scooters, bikes, cars, and EVs in SART</p>
                      </div>
                      <button
                        type="button"
                        className="btn-close-picker"
                        onClick={() => setComparePickerSlot(null)}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>

                    {/* Filter categories */}
                    <div className="picker-category-tabs">
                      {['All', 'Scooter', 'Bike', 'Car', 'EV', 'Commercial'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`picker-cat-btn ${compareActiveCategory === cat ? 'active' : ''}`}
                          onClick={() => setCompareActiveCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Search query */}
                    <div className="picker-search-bar">
                      <i className="fa-solid fa-magnifying-glass"></i>
                      <input
                        type="text"
                        value={compareVehicleSearchQuery}
                        onChange={(e) => setCompareVehicleSearchQuery(e.target.value)}
                        placeholder="Search model or brand (e.g., Activa, NTORQ, Creta, R15)..."
                        autoFocus
                      />
                    </div>

                    {/* Vehicles Grid */}
                    <div className="picker-vehicles-list">
                      {modalAvailableVehicles.map((item) => (
                        <div
                          key={item.id}
                          className="picker-vehicle-item"
                          onClick={() => {
                            const updated = [...compareSelectedVehicles];
                            updated[comparePickerSlot] = item;
                            setCompareSelectedVehicles(updated);
                            setComparePickerSlot(null);
                            showToast(`Added ${item.name} to comparison!`);
                          }}
                        >
                          <img src={item.image} alt={item.name} />
                          <div className="picker-item-info">
                            <span className="picker-item-cat">{item.category} • {item.brand}</span>
                            <h5>{item.name}</h5>
                            <strong>{item.price}</strong>
                          </div>
                          <button type="button" className="btn-select-pill">
                            Select
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
}
