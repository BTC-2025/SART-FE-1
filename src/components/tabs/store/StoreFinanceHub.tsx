'use client';

import React, { useState } from 'react';
import { VEHICLE_EMI_CATALOG, INSURANCE_QUOTES } from '../storeData';

interface StoreFinanceHubProps {
  showToast: (msg: string) => void;
  userLocationCity: string;
  setActiveHubTab?: (tab: 'buy_sell' | 'spare_parts' | 'mechanic_service' | 'emergency_sos' | 'compare_vehicles' | 'ev_fuel_stations' | 'finance_insurance') => void;
}

export default function StoreFinanceHub({ showToast, userLocationCity, setActiveHubTab }: StoreFinanceHubProps) {
  const [emiVehicleCategory, setEmiVehicleCategory] = useState<string>('All');
  const [emiCarBrand, setEmiCarBrand] = useState<string>('Tata Motors');
  const [emiCarModel, setEmiCarModel] = useState<string>('car-sierra');
  const [emiCarVariant, setEmiCarVariant] = useState<string>('sierra-smart-plus');
  const [emiOnRoadPrice, setEmiOnRoadPrice] = useState<number>(1311000);
  const [emiDownPayment, setEmiDownPayment] = useState<number>(131000);
  const [emiInterestRate, setEmiInterestRate] = useState<number>(9.8);
  const [emiLoanTenureYears, setEmiLoanTenureYears] = useState<number>(5);
  const [emiDailyKm, setEmiDailyKm] = useState<number>(20);
  const [activeReviewFilter, setActiveReviewFilter] = useState<string>('All (509)');

          // Get models matching active category
          const modelsInCategory = VEHICLE_EMI_CATALOG.filter(
            (m) => emiVehicleCategory === 'All' || m.category === emiVehicleCategory
          );

          // Get active model
          const activeModel = VEHICLE_EMI_CATALOG.find((m) => m.id === emiCarModel) ||
            modelsInCategory[0] ||
            VEHICLE_EMI_CATALOG[0];

          // Available brands in this category
          const availableBrands = Array.from(new Set(modelsInCategory.map((m) => m.brand)));

          // Models matching selected brand
          const modelsForBrand = modelsInCategory.filter((m) => m.brand === emiCarBrand);

          // Active variant
          const activeVariant = activeModel.variants.find((v) => v.id === emiCarVariant) ||
            activeModel.variants[0];

          // Loan and EMI math
          const totalLoanAmt = Math.max(0, emiOnRoadPrice - emiDownPayment);
          const monthlyRate = (emiInterestRate / 100) / 12;
          const totalMonths = emiLoanTenureYears * 12;
          const monthlyEmiVal = totalLoanAmt <= 0 || totalMonths <= 0
            ? 0
            : Math.round(
                (totalLoanAmt * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                (Math.pow(1 + monthlyRate, totalMonths) - 1)
              );
          const totalPayableAmt = Math.round(monthlyEmiVal * totalMonths);
          const totalInterestPayable = Math.max(0, totalPayableAmt - totalLoanAmt);

          return (
            <section className="hub-showcase-view cardekho-emi-hub-view animate-pop">
              {/* Top Breadcrumb */}
              <div className="cd-emi-breadcrumb">
                <span>{emiVehicleCategory === 'All' ? 'ALL VEHICLES' : emiVehicleCategory.toUpperCase()} FINANCE</span>
                <span className="bc-sep">/</span>
                <span>{activeModel.brand.toUpperCase()}</span>
                <span className="bc-sep">/</span>
                <span className="bc-active">{activeModel.name.toUpperCase()} EMI &amp; LOAN</span>
              </div>

              {/* STEP 1: VEHICLE TYPE SELECTOR FORM HEADER */}
              <div className="emi-category-selector-ribbon">
                <span className="cat-ribbon-title">
                  <i className="fa-solid fa-shapes"></i> <strong>Step 1: Choose Vehicle Category:</strong>
                </span>
                <div className="cat-ribbon-scroll">
                  {[
                    { id: 'All', label: 'All Vehicles', icon: 'fa-globe' },
                    { id: 'Car', label: 'Cars & SUVs', icon: 'fa-car-side' },
                    { id: 'Scooter', label: 'Scooters', icon: 'fa-motorcycle' },
                    { id: 'Bike', label: 'Bikes & Motorcycles', icon: 'fa-motorcycle' },
                    { id: 'EV', label: 'Electric (EV)', icon: 'fa-bolt' },
                    { id: 'Van', label: 'Vans & Commercial', icon: 'fa-van-shuttle' },
                    { id: 'Commercial', label: 'Trucks & Lorries', icon: 'fa-truck' },
                    { id: 'Bus', label: 'Buses & Coaches', icon: 'fa-bus' },
                    { id: 'Auto', label: 'Auto Rickshaws', icon: 'fa-taxi' },
                    { id: 'Tractor', label: 'Farm Tractors', icon: 'fa-tractor' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`emi-cat-tab-btn ${emiVehicleCategory === cat.id ? 'active' : ''}`}
                      onClick={() => {
                        setEmiVehicleCategory(cat.id);
                        const newModels = VEHICLE_EMI_CATALOG.filter(
                          (m) => cat.id === 'All' || m.category === cat.id
                        );
                        if (newModels.length > 0) {
                          const firstModel = newModels[0];
                          setEmiCarBrand(firstModel.brand);
                          setEmiCarModel(firstModel.id);
                          if (firstModel.variants.length > 0) {
                            setEmiCarVariant(firstModel.variants[0].id);
                            setEmiOnRoadPrice(firstModel.variants[0].onRoadPrice);
                            setEmiDownPayment(Math.round(firstModel.variants[0].onRoadPrice * 0.1));
                          }
                        }
                        showToast(`Switched category to ${cat.label}`);
                      }}
                    >
                      <i className={`fa-solid ${cat.icon}`}></i>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 1.5: QUICK VEHICLE CHIP PICKER (BROWSE & CHOOSE ANY VEHICLE) */}
              <div className="cd-quick-vehicles-strip">
                <div className="strip-header-row">
                  <span className="strip-title">
                    <i className="fa-solid fa-car-burst"></i> Quick Pick: Choose Any Vehicle ({modelsInCategory.length} Available)
                  </span>
                  <span className="strip-count-badge">
                    Selected: <strong>{activeModel.name}</strong> ({activeModel.category})
                  </span>
                </div>
                <div className="cd-quick-vehicles-scroll">
                  {modelsInCategory.map((veh) => {
                    const isSelected = veh.id === activeModel.id;
                    return (
                      <button
                        key={veh.id}
                        type="button"
                        className={`cd-quick-veh-card ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setEmiCarBrand(veh.brand);
                          setEmiCarModel(veh.id);
                          if (veh.variants.length > 0) {
                            setEmiCarVariant(veh.variants[0].id);
                            setEmiOnRoadPrice(veh.variants[0].onRoadPrice);
                            setEmiDownPayment(Math.round(veh.variants[0].onRoadPrice * 0.1));
                          }
                          showToast(`Selected ${veh.name} - EMI & Loan terms updated`);
                        }}
                      >
                        <div className="quick-veh-img-wrap">
                          <img src={veh.image} alt={veh.name} />
                          <span className="quick-veh-cat-tag">{veh.category}</span>
                        </div>
                        <div className="quick-veh-meta">
                          <span className="quick-veh-name">{veh.name}</span>
                          <span className="quick-veh-price">{veh.priceRange}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2-COLUMN MAIN CONTENT (LEFT: SELECTOR & SLIDERS, RIGHT: EMI CALCULATOR & LOAN SUMMARY) */}
              <div className="cd-emi-layout-grid">
                {/* LEFT COLUMN: VEHICLE CUSTOMIZER (BRAND, MODEL, VARIANT & SLIDERS) */}
                <div className="cd-emi-main-col">
                  {/* VEHICLE CONFIGURATION & LOAN CONTROLS CARD */}
                  <div className="cd-calculator-card">
                    <div className="calc-card-head-row">
                      <div>
                        <h3 className="cd-card-heading" style={{ margin: 0 }}>
                          <i className="fa-solid fa-sliders"></i> 1. Choose Vehicle, Company &amp; Model
                        </h3>
                        <p className="calc-sub-text" style={{ margin: '4px 0 0' }}>
                          Select brand, model &amp; variant to instantly compute on-road price and loan terms:
                        </p>
                      </div>
                      <span className="city-pill-tag">
                        <i className="fa-solid fa-location-dot"></i> {userLocationCity}
                      </span>
                    </div>

                    {/* 3 INTERACTIVE DROPDOWNS: BRAND -> MODEL -> VARIANT */}
                    <div className="cd-dropdowns-row">
                      {/* 1. BRAND SELECTOR */}
                      <div className="cd-dropdown-wrap">
                        <label className="dropdown-label"><i className="fa-solid fa-building"></i> Select Company / Brand:</label>
                        <select
                          value={emiCarBrand}
                          onChange={(e) => {
                            const newBrand = e.target.value;
                            setEmiCarBrand(newBrand);
                            const matchingModels = modelsInCategory.filter((m) => m.brand === newBrand);
                            if (matchingModels.length > 0) {
                              const firstM = matchingModels[0];
                              setEmiCarModel(firstM.id);
                              if (firstM.variants.length > 0) {
                                setEmiCarVariant(firstM.variants[0].id);
                                setEmiOnRoadPrice(firstM.variants[0].onRoadPrice);
                                setEmiDownPayment(Math.round(firstM.variants[0].onRoadPrice * 0.1));
                              }
                            }
                          }}
                        >
                          {availableBrands.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                        <i className="fa-solid fa-chevron-down dd-arrow"></i>
                      </div>

                      {/* 2. MODEL SELECTOR */}
                      <div className="cd-dropdown-wrap">
                        <label className="dropdown-label"><i className="fa-solid fa-car"></i> Select Model:</label>
                        <select
                          value={emiCarModel}
                          onChange={(e) => {
                            const newModelId = e.target.value;
                            setEmiCarModel(newModelId);
                            const selectedM = VEHICLE_EMI_CATALOG.find((m) => m.id === newModelId);
                            if (selectedM) {
                              setEmiCarBrand(selectedM.brand);
                              if (selectedM.variants.length > 0) {
                                setEmiCarVariant(selectedM.variants[0].id);
                                setEmiOnRoadPrice(selectedM.variants[0].onRoadPrice);
                                setEmiDownPayment(Math.round(selectedM.variants[0].onRoadPrice * 0.1));
                              }
                            }
                          }}
                        >
                          {modelsForBrand.length > 0 ? (
                            modelsForBrand.map((m) => (
                              <option key={m.id} value={m.id}>{m.name} ({m.category})</option>
                            ))
                          ) : (
                            modelsInCategory.map((m) => (
                              <option key={m.id} value={m.id}>{m.name} ({m.category})</option>
                            ))
                          )}
                        </select>
                        <i className="fa-solid fa-chevron-down dd-arrow"></i>
                      </div>

                      {/* 3. VARIANT SELECTOR */}
                      <div className="cd-dropdown-wrap">
                        <label className="dropdown-label"><i className="fa-solid fa-layer-group"></i> Select Variant:</label>
                        <select
                          value={emiCarVariant}
                          onChange={(e) => {
                            const newVariantId = e.target.value;
                            setEmiCarVariant(newVariantId);
                            const foundVar = activeModel.variants.find((v) => v.id === newVariantId);
                            if (foundVar) {
                              setEmiOnRoadPrice(foundVar.onRoadPrice);
                              setEmiDownPayment(Math.round(foundVar.onRoadPrice * 0.1));
                            }
                          }}
                        >
                          {activeModel.variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name} (₹{(v.onRoadPrice / 100000).toFixed(2)} Lakh)
                            </option>
                          ))}
                        </select>
                        <i className="fa-solid fa-chevron-down dd-arrow"></i>
                      </div>
                    </div>

                    {/* ACTIVE VEHICLE MINI-PREVIEW BAR */}
                    <div className="cd-active-veh-preview-bar">
                      <img src={activeModel.image} alt={activeModel.name} className="veh-preview-thumb" />
                      <div className="veh-preview-info">
                        <div className="veh-preview-title">
                          <strong>{activeModel.name}</strong>
                          <span className="veh-preview-badge">{activeModel.category}</span>
                          <span className="veh-preview-var">{activeVariant.name}</span>
                        </div>
                        <div className="veh-preview-specs">
                          <span><i className="fa-solid fa-gas-pump"></i> {activeVariant.fuel}</span>
                          <span><i className="fa-solid fa-gauge"></i> {activeVariant.mileage}</span>
                          <span><i className="fa-solid fa-star text-amber"></i> {activeModel.rating} ({activeModel.reviewCount} Reviews)</span>
                        </div>
                      </div>
                      <div className="veh-preview-price-box">
                        <span className="preview-price-sub">On-Road {userLocationCity}</span>
                        <strong className="preview-price-main">₹{emiOnRoadPrice.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    {/* Down Payment Slider & Manual Input */}
                    <div className="cd-slider-block" style={{ marginTop: '16px' }}>
                      <div className="slider-label-line">
                        <span className="slider-title-text">
                          <i className="fa-solid fa-wallet text-orange"></i> Down Payment Amount
                        </span>
                        <div className="slider-manual-input-wrap">
                          <span className="input-rupee-symbol">₹</span>
                          <input
                            type="number"
                            className="slider-manual-input-box"
                            min={Math.round(emiOnRoadPrice * 0.05)}
                            max={Math.round(emiOnRoadPrice * 0.9)}
                            step={1000}
                            value={emiDownPayment}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setEmiDownPayment(val);
                            }}
                            title="Enter manual down payment amount in Rupees"
                          />
                          <span className="input-pct-badge">
                            {Math.round((emiDownPayment / emiOnRoadPrice) * 100)}%
                          </span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={Math.round(emiOnRoadPrice * 0.05)}
                        max={Math.round(emiOnRoadPrice * 0.8)}
                        step={5000}
                        value={Math.min(emiDownPayment, Math.round(emiOnRoadPrice * 0.8))}
                        onChange={(e) => setEmiDownPayment(Number(e.target.value))}
                        className="cd-range-slider"
                      />
                      <div className="slider-minmax-hints">
                        <span>Min (5%): ₹{Math.round(emiOnRoadPrice * 0.05).toLocaleString('en-IN')}</span>
                        <span>Max (80%): ₹{Math.round(emiOnRoadPrice * 0.8).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Bank Interest Rate Slider & Manual Input */}
                    <div className="cd-slider-block">
                      <div className="slider-label-line">
                        <span className="slider-title-text">
                          <i className="fa-solid fa-percent text-blue"></i> Annual Bank Interest Rate
                        </span>
                        <div className="slider-manual-input-wrap">
                          <input
                            type="number"
                            className="slider-manual-input-box"
                            min={5.0}
                            max={24.0}
                            step={0.1}
                            value={emiInterestRate}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setEmiInterestRate(val);
                            }}
                            title="Enter manual annual interest rate percentage"
                          />
                          <span className="input-pct-badge">% p.a.</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={7.5}
                        max={16.0}
                        step={0.1}
                        value={Math.max(7.5, Math.min(16.0, emiInterestRate))}
                        onChange={(e) => setEmiInterestRate(Number(e.target.value))}
                        className="cd-range-slider"
                      />
                      <div className="slider-minmax-hints">
                        <span>Lowest: 7.5% (PSU Banks)</span>
                        <span>Standard: 9.8%</span>
                        <span>Max: 16.0% (NBFCs)</span>
                      </div>
                    </div>

                    {/* Loan Period (Years) segmented buttons */}
                    <div className="cd-period-block">
                      <span className="period-lbl">Loan Tenure Period: <strong>{emiLoanTenureYears} Years ({emiLoanTenureYears * 12} Months)</strong></span>
                      <div className="cd-year-buttons">
                        {[1, 2, 3, 4, 5, 6, 7].map((yr) => (
                          <button
                            key={yr}
                            type="button"
                            className={`yr-btn ${emiLoanTenureYears === yr ? 'active' : ''}`}
                            onClick={() => setEmiLoanTenureYears(yr)}
                          >
                            {yr} {yr === 1 ? 'Year' : 'Yrs'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 2. FIND EMI OF MODEL ALTERNATIVES */}
                  <div className="cd-section-card">
                    <h3 className="cd-card-heading">Find EMI of {activeModel.name} Alternatives</h3>
                    <div className="cd-alternatives-grid">
                      {activeModel.alternatives.map((alt) => (
                        <div key={alt.name} className="cd-alt-card">
                          <div className="alt-img-box">
                            <img src={alt.img} alt={alt.name} />
                          </div>
                          <h4 className="alt-name">{alt.name}</h4>
                          <span className="alt-price">{alt.price}</span>
                          <button
                            type="button"
                            className="btn-alt-emi-orange"
                            onClick={() => {
                              const found = VEHICLE_EMI_CATALOG.find(
                                (m) => m.name.toLowerCase().includes(alt.name.toLowerCase()) ||
                                       alt.name.toLowerCase().includes(m.name.toLowerCase())
                              );
                              if (found) {
                                setEmiCarBrand(found.brand);
                                setEmiCarModel(found.id);
                                if (found.variants.length > 0) {
                                  setEmiCarVariant(found.variants[0].id);
                                  setEmiOnRoadPrice(found.variants[0].onRoadPrice);
                                  setEmiDownPayment(Math.round(found.variants[0].onRoadPrice * 0.1));
                                }
                                showToast(`Loaded EMI calculator for ${found.name}!`);
                              } else {
                                showToast(`Calculating comparative EMI for ${alt.name}...`);
                              }
                            }}
                          >
                            {alt.emiBtn}
                          </button>
                          <a
                            href="#compare"
                            className="alt-compare-link"
                            onClick={(e) => {
                              e.preventDefault();
                              if (setActiveHubTab) {
                                setActiveHubTab('compare_vehicles');
                              } else {
                                showToast(`Navigate to Compare Vehicles for ${activeModel.name} vs ${alt.name}`);
                              }
                            }}
                          >
                            {activeModel.name} vs {alt.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. USER REVIEWS FOR SELECTED MODEL */}
                  <div className="cd-section-card">
                    <div className="reviews-card-head">
                      <div>
                        <h3 className="cd-card-heading" style={{ margin: 0 }}>
                          {activeModel.name} Verified User Reviews
                        </h3>
                        <div className="rev-stars-row">
                          <span className="rev-score">{activeModel.rating} <i className="fa-solid fa-star"></i></span>
                          <span className="rev-sub-count">Based on {activeModel.reviewCount} User Ratings</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-write-review-orange"
                        onClick={() => showToast(`Review submission dialog opened for ${activeModel.name}!`)}
                      >
                        Write a Review &amp; Win ₹1000
                      </button>
                    </div>

                    {/* Review Filter Pills */}
                    <div className="cd-review-pills-row">
                      {['All Reviews', 'Performance', 'Comfort', 'Mileage & Range', 'Maintenance', 'Safety'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          className={`rev-pill-btn ${activeReviewFilter === p ? 'active' : ''}`}
                          onClick={() => setActiveReviewFilter(p)}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    {/* Review Cards */}
                    <div className="cd-reviews-cards-list">
                      {[
                        { author: 'Debinder Singh', date: 'Yesterday', rating: 4.8, title: `Outstanding value and performance`, text: `Purchased the ${activeVariant.name} recently. The throttle response and fuel economy have been spot on. Highly impressed with the build quality and service assistance in ${userLocationCity}.` },
                        { author: 'Sasidharan K.', date: '3 days ago', rating: 5.0, title: 'Superb comfort on long highway runs', text: `Very comfortable driving ergonomics and confidence inspiring brakes. The monthly EMI is affordable with SART low-interest partner banks. 5 stars from my side!` }
                      ].map((r, i) => (
                        <div key={i} className="cd-review-item-card">
                          <div className="rev-author-line">
                            <div className="rev-initial">{r.author.charAt(0)}</div>
                            <div>
                              <strong>{r.author}</strong> <small>on {r.date}</small>
                            </div>
                            <span className="rev-item-stars">{r.rating} <i className="fa-solid fa-star"></i></span>
                          </div>
                          <h5 className="rev-card-title">{r.title}</h5>
                          <p className="rev-card-body">{r.text} <span className="read-more-txt">Read More</span></p>
                          <div className="rev-card-feedback">
                            <button type="button" className="rev-thumb-btn" onClick={() => showToast('Marked helpful')}><i className="fa-regular fa-thumbs-up"></i></button>
                            <button type="button" className="rev-thumb-btn" onClick={() => showToast('Feedback recorded')}><i className="fa-regular fa-thumbs-down"></i></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. FREQUENTLY ASKED QUESTIONS */}
                  <div className="cd-section-card">
                    <h3 className="cd-card-heading">Frequently Asked Questions On {activeModel.name} EMI</h3>
                    <div className="cd-faq-list">
                      <div className="cd-faq-item">
                        <strong>Q: What is the lowest EMI for {activeModel.name} in {userLocationCity}?</strong>
                        <p>A: The lowest EMI starts at ₹{monthlyEmiVal.toLocaleString('en-IN')}/month for {activeVariant.name} with a tenure of {emiLoanTenureYears} years and 10% down payment.</p>
                      </div>
                      <div className="cd-faq-item">
                        <strong>Q: What documents are required for car or bike loan approval?</strong>
                        <p>A: PAN Card, Aadhaar Card, 6 months bank statement, 3 months salary slips or ITR (for self-employed), and electricity or address proof.</p>
                      </div>
                      <div className="cd-faq-item">
                        <strong>Q: Can I get zero down payment loan on {activeModel.name}?</strong>
                        <p>A: Selected partner banks (HDFC, SBI, ICICI) offer 100% on-road financing for eligible salaried professionals with a CIBIL score of 750+.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDEBAR COLUMN: DEDICATED LIVE EMI & LOAN BREAKDOWN CALCULATOR */}
                <div className="cd-emi-sidebar-col">
                  {/* 1. PRIMARY LIVE EMI & LOAN BREAKDOWN CARD */}
                  <div className="cd-sidebar-widget cd-right-emi-card">
                    <div className="right-emi-header">
                      <span className="right-emi-badge">
                        <i className="fa-solid fa-calculator"></i> Live EMI Calculator
                      </span>
                      <small className="right-emi-sub">Tenure: {emiLoanTenureYears} Years @ {emiInterestRate}%</small>
                    </div>

                    {/* BIG MONTHLY INSTALLMENT DISPLAY */}
                    <div className="right-emi-display-box">
                      <span className="right-emi-lbl">Estimated Monthly EMI</span>
                      <div className="right-emi-val-row">
                        <h2 className="right-emi-amount">₹{monthlyEmiVal.toLocaleString('en-IN')}</h2>
                        <span className="right-emi-per-mo">/ month</span>
                      </div>
                      <span className="right-emi-model-tag">
                        For {activeModel.name} - {activeVariant.name}
                      </span>
                    </div>

                    {/* LOAN STATS BREAKDOWN LIST */}
                    <div className="right-loan-breakdown-list">
                      <div className="right-loan-stat-row">
                        <span><i className="fa-solid fa-receipt"></i> On-Road Price:</span>
                        <strong>₹{emiOnRoadPrice.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="right-loan-stat-row">
                        <span><i className="fa-solid fa-wallet"></i> Down Payment ({Math.round((emiDownPayment / emiOnRoadPrice) * 100)}%):</span>
                        <strong className="text-orange">₹{emiDownPayment.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="right-loan-stat-row">
                        <span><i className="fa-solid fa-hand-holding-dollar"></i> Net Loan Financed:</span>
                        <strong className="text-blue">₹{totalLoanAmt.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="right-loan-stat-row">
                        <span><i className="fa-solid fa-chart-line"></i> Total Interest ({emiLoanTenureYears} yrs):</span>
                        <strong className="text-amber">₹{totalInterestPayable.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="right-loan-stat-row total-highlight">
                        <span><i className="fa-solid fa-calculator"></i> Total Payable Amount:</span>
                        <strong className="text-slate">₹{totalPayableAmt.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    {/* INSTANT LOAN ACTION BUTTONS */}
                    <div className="right-loan-actions">
                      <button
                        type="button"
                        className="btn-right-apply-loan"
                        onClick={() => showToast(`Fast-track instant loan application submitted for ${activeModel.name}!`)}
                      >
                        <i className="fa-solid fa-file-invoice-dollar"></i> Apply Instant Loan (Pre-Approved)
                      </button>
                      <button
                        type="button"
                        className="btn-right-bank-offers"
                        onClick={() => showToast(`Comparing 14 partner bank loan schemes in ${userLocationCity}...`)}
                      >
                        <i className="fa-solid fa-building-columns"></i> Get 14 Bank Offers
                      </button>
                      <button
                        type="button"
                        className="btn-right-test-drive"
                        onClick={() => showToast(`Free test drive booking confirmed for ${activeModel.name} in ${userLocationCity}!`)}
                      >
                        <i className="fa-solid fa-car-side"></i> Book Free Test Drive
                      </button>
                    </div>
                  </div>

                  {/* 2. RUNNING COST OF YOUR VEHICLE */}
                  <div className="cd-sidebar-widget">
                    <h4 className="sidebar-widget-title">Estimated Running Cost</h4>
                    <div className="km-driven-block">
                      <div className="km-header-line">
                        <span>Daily usage</span>
                        <strong>{emiDailyKm} km/day</strong>
                      </div>
                      <div className="km-buttons-row">
                        {[15, 25, 40, 60, 100].map((k) => (
                          <button
                            key={k}
                            type="button"
                            className={`km-btn ${emiDailyKm === k ? 'active' : ''}`}
                            onClick={() => setEmiDailyKm(k)}
                          >
                            {k} km
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="monthly-fuel-cost-box">
                      <span className="mfc-lbl">Monthly fuel / electricity cost</span>
                      <h3 className="mfc-val">
                        ₹{(() => {
                          const isEv = activeVariant.fuel.toLowerCase().includes('electric');
                          const monthlyKm = emiDailyKm * 30;
                          if (isEv) {
                            return Math.round((monthlyKm / 8) * 8).toLocaleString('en-IN');
                          }
                          const ratePerLiter = 102;
                          const mileageNum = parseFloat(activeVariant.mileage) || 16;
                          return Math.round((monthlyKm / mileageNum) * ratePerLiter).toLocaleString('en-IN');
                        })()}* <span>/ month</span>
                      </h3>
                      <small className="mfc-disclaimer">
                        Estimated on {activeVariant.mileage} test-cycle rating for {activeVariant.name} in {userLocationCity}.
                      </small>
                    </div>
                  </div>

                  {/* 2. POPULAR MODELS IN SAME CATEGORY */}
                  <div className="cd-sidebar-widget">
                    <h4 className="sidebar-widget-title">Other Popular {activeModel.category}s</h4>
                    <div className="cd-popular-cars-list">
                      {VEHICLE_EMI_CATALOG.filter((m) => m.id !== activeModel.id).slice(0, 5).map((c) => (
                        <div
                          key={c.id}
                          className="sidebar-car-row"
                          onClick={() => {
                            setEmiVehicleCategory(c.category);
                            setEmiCarBrand(c.brand);
                            setEmiCarModel(c.id);
                            if (c.variants.length > 0) {
                              setEmiCarVariant(c.variants[0].id);
                              setEmiOnRoadPrice(c.variants[0].onRoadPrice);
                              setEmiDownPayment(Math.round(c.variants[0].onRoadPrice * 0.1));
                            }
                            showToast(`Switched EMI view to ${c.name}`);
                          }}
                        >
                          <img src={c.image} alt={c.name} className="sidebar-car-thumb" />
                          <div className="sidebar-car-info">
                            <h5>{c.name}</h5>
                            <span>{c.priceRange}</span>
                            <small className="sidebar-cat-badge">{c.category}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. PROMOTIONAL LOAN FESTIVAL CARD */}
                  <div className="cd-promo-ad-card festive-loan-card">
                    <div className="ad-badge">FESTIVE LOAN MELA</div>
                    <h4>7.5% P.A. SPECIAL INTEREST</h4>
                    <p>Zero processing fees • Instant digital sanction in 30 mins • Pre-approved loan vouchers</p>
                    <button
                      type="button"
                      className="btn-ad-book"
                      onClick={() => showToast('Claimed 0% processing fee voucher for loan application!')}
                    >
                      Claim Festive Offer
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
}
