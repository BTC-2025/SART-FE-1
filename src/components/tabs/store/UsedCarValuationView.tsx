'use client';

import React, { useState } from 'react';
import './UsedCarValuationView.css';

interface UsedCarValuationViewProps {
  onBackToSell?: () => void;
  showToast: (msg: string) => void;
  userLocationCity?: string;
}

const POPULAR_BRANDS = [
  'Maruti Suzuki',
  'Hyundai',
  'Tata Motors',
  'Mahindra',
  'Honda',
  'Toyota',
  'Kia',
  'Volkswagen',
  'Renault',
  'Skoda',
  'BMW',
  'Mercedes-Benz',
  'Audi'
];

const MODELS_BY_BRAND: Record<string, string[]> = {
  'Maruti Suzuki': ['Swift', 'Baleno', 'Dzire', 'Brezza', 'Wagon R', 'Ertiga', 'Grand Vitara'],
  'Hyundai': ['Creta', 'Venue', 'i20', 'Verna', 'Grand i10 Nios', 'Exter', 'Alcazar'],
  'Tata Motors': ['Nexon', 'Punch', 'Harrier', 'Safari', 'Altroz', 'Tiago', 'Curvv'],
  'Mahindra': ['Scorpio-N', 'XUV700', 'Thar', 'Bolero', 'XUV 3XO', 'Scorpio Classic'],
  'Honda': ['City', 'Amaze', 'Elevate', 'Civic', 'WR-V', 'Jazz'],
  'Toyota': ['Innova Crysta', 'Innova Hycross', 'Fortuner', 'Urban Cruiser Hyryder', 'Glanza'],
  'Kia': ['Seltos', 'Sonet', 'Carens', 'Carnival', 'EV6'],
  'Volkswagen': ['Virtus', 'Taigun', 'Polo', 'Vento', 'Tiguan'],
  'Renault': ['Kwid', 'Kiger', 'Triber', 'Duster'],
  'Skoda': ['Slavia', 'Kushaq', 'Octavia', 'Superb'],
  'BMW': ['3 Series', '5 Series', 'X1', 'X3', 'X5', '7 Series'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLA', 'GLC', 'GLE', 'S-Class'],
  'Audi': ['A4', 'A6', 'Q3', 'Q5', 'Q7']
};

const YEARS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];
const VARIANTS = ['VXi / SX / Top Spec', 'ZXi / SX(O) / Luxury', 'LXi / Base Spec', 'Mid Variant (Delta/EX)', 'Automatic / DCT / CVT', 'Turbo / Diesel'];

export default function UsedCarValuationView({
  onBackToSell,
  showToast,
  userLocationCity = 'Chennai'
}: UsedCarValuationViewProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('Hyundai');
  const [selectedYear, setSelectedYear] = useState<string>('2021');
  const [selectedModel, setSelectedModel] = useState<string>('Creta');
  const [selectedVariant, setSelectedVariant] = useState<string>('SX (1.5 Petrol)');
  const [cityOrPincode, setCityOrPincode] = useState<string>(userLocationCity || 'Chennai');
  const [kilometers, setKilometers] = useState<string>('42,000');
  const [ownership, setOwnership] = useState<string>('1st owner');
  const [regNumber, setRegNumber] = useState<string>('DL03-CW-3122');

  const [valuationResult, setValuationResult] = useState<{
    calculated: boolean;
    fairMin: number;
    fairMax: number;
    instantOffer: number;
    vehicleName: string;
  } | null>(null);

  const availableModels = MODELS_BY_BRAND[selectedBrand] || ['All Models'];

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const models = MODELS_BY_BRAND[brand] || [];
    setSelectedModel(models[0] || 'Base Model');
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const vehName = `${selectedYear} ${selectedBrand} ${selectedModel} ${selectedVariant}`;

    // Compute realistic price bracket
    const basePrice = selectedBrand === 'BMW' || selectedBrand === 'Mercedes-Benz' || selectedBrand === 'Audi'
      ? 28.5
      : selectedBrand === 'Toyota' || selectedBrand === 'Mahindra'
        ? 14.8
        : 8.2;

    const fairMin = parseFloat((basePrice * 0.92).toFixed(2));
    const fairMax = parseFloat((basePrice * 1.08).toFixed(2));
    const instantOffer = parseFloat((basePrice * 1.02).toFixed(2));

    setValuationResult({
      calculated: true,
      fairMin,
      fairMax,
      instantOffer,
      vehicleName: vehName
    });

    showToast(`Instant Market Valuation generated for ${selectedBrand} ${selectedModel}!`);
  };

  return (
    <div className="used-car-valuation-wrapper animate-fade-in">
      {/* Back button link */}
      <div className="valuation-nav-bar">
        <button
          type="button"
          className="btn-back-to-sell"
          onClick={onBackToSell}
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Sell Vehicle</span>
        </button>
      </div>

      <div className="valuation-two-col-grid">
        {/* LEFT COLUMN: TITLE, BADGE & DESCRIPTION (EXACT REPLICA OF USER IMAGE) */}
        <div className="val-left-col">
          <div className="smartprice-pill-badge">
            <span className="star-icon">☆</span>
            <span>CarDekho SmartPrice</span>
          </div>

          <h1 className="val-main-title">
            Used Car Valuation
          </h1>

          <p className="val-description-text">
            CarDekho SmartPrice, a free used car valuation tool gives you the most accurate, transparent car resale value instantly. Our real-time price calculator analyzes thousands of listings to deliver India&apos;s most reliable valuation for your second-hand car.{' '}
            <button
              type="button"
              className="list-car-free-link"
              onClick={onBackToSell}
            >
              List your car for free on CarDekho
            </button>
            {' '}-- India&apos;s trusted platform for selling used cars.
          </p>
        </div>

        {/* RIGHT COLUMN: USED CAR PRICE CALCULATOR CARD (EXACT REPLICA OF USER IMAGE) */}
        <div className="val-right-col">
          <h2 className="calc-super-heading">
            Used Car Price Calculator
          </h2>

          <div className="val-calc-card-box">
            <h3 className="calc-card-title">
              Get your estimate
            </h3>

            <form onSubmit={handleCalculate} className="calc-form-container">
              {/* Field 1: Brand (Full Width) */}
              <div className="calc-form-field full-width">
                <label className="calc-floating-label">Brand</label>
                <div className="calc-select-wrap">
                  <select
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    className="calc-select-input"
                  >
                    {POPULAR_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down calc-arrow-icon"></i>
                </div>
              </div>

              {/* Field 2 & 3: Year & Model (2 Columns) */}
              <div className="calc-fields-row">
                <div className="calc-form-field">
                  <label className="calc-floating-label">Year</label>
                  <div className="calc-select-wrap">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="calc-select-input"
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down calc-arrow-icon"></i>
                  </div>
                </div>

                <div className="calc-form-field">
                  <label className="calc-floating-label">Model</label>
                  <div className="calc-select-wrap">
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="calc-select-input"
                    >
                      {availableModels.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down calc-arrow-icon"></i>
                  </div>
                </div>
              </div>

              {/* Field 4 & 5: Variant & City (2 Columns) */}
              <div className="calc-fields-row">
                <div className="calc-form-field">
                  <label className="calc-floating-label">Variant</label>
                  <div className="calc-select-wrap">
                    <select
                      value={selectedVariant}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="calc-select-input"
                    >
                      {VARIANTS.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down calc-arrow-icon"></i>
                  </div>
                </div>

                <div className="calc-form-field">
                  <label className="calc-floating-label">City</label>
                  <input
                    type="text"
                    className="calc-text-input"
                    value={cityOrPincode}
                    onChange={(e) => setCityOrPincode(e.target.value)}
                    placeholder="City or pincode"
                  />
                </div>
              </div>

              {/* Field 6 & 7: Kilometers & Ownership (2 Columns) */}
              <div className="calc-fields-row">
                <div className="calc-form-field km-field-group">
                  <label className="calc-floating-label">Kilometers</label>
                  <div className="calc-input-with-suffix">
                    <input
                      type="text"
                      className="calc-text-input"
                      value={kilometers}
                      onChange={(e) => setKilometers(e.target.value)}
                      placeholder="e.g. 45,000"
                    />
                    <span className="calc-unit-suffix">km</span>
                  </div>
                </div>

                <div className="calc-form-field">
                  <label className="calc-floating-label">Ownership</label>
                  <div className="calc-select-wrap">
                    <select
                      value={ownership}
                      onChange={(e) => setOwnership(e.target.value)}
                      className="calc-select-input"
                    >
                      <option value="1st owner">1st owner</option>
                      <option value="2nd owner">2nd owner</option>
                      <option value="3rd owner">3rd owner</option>
                      <option value="4th owner+">4th owner+</option>
                    </select>
                    <i className="fa-solid fa-chevron-down calc-arrow-icon"></i>
                  </div>
                </div>
              </div>

              {/* Divider: OR */}
              <div className="calc-or-divider">
                <span>OR</span>
              </div>

              {/* Registration Input Sub-section */}
              <div className="calc-reg-subsection">
                <label className="calc-reg-section-label">
                  Enter your car registration
                </label>
                <div className="calc-reg-input-wrap">
                  <i className="fa-solid fa-car-side calc-reg-car-icon"></i>
                  <input
                    type="text"
                    className="calc-reg-input"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                    placeholder="Enter Your Car No. (DL03-CW-3122)"
                  />
                </div>
              </div>

              {/* Big Orange Submit Button */}
              <button type="submit" className="btn-calc-check-value">
                <i className="fa-solid fa-bolt"></i>
                <span>Check value</span>
              </button>

              {/* Footer Trust Badge */}
              <div className="calc-card-footer-trust">
                <i className="fa-regular fa-circle-check"></i>
                <span>100% free • No sign-up • Instant estimate</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* INSTANT VALUATION BREAKDOWN MODAL/POPUP (ON CHECK VALUE CLICK) */}
      {valuationResult && (
        <div className="val-result-modal-backdrop" onClick={() => setValuationResult(null)}>
          <div className="val-result-card animate-scale" onClick={(e) => e.stopPropagation()}>
            <div className="val-result-header">
              <div className="val-badge-top">
                <i className="fa-solid fa-shield-halved"></i>
                <span>Verified Market Valuation</span>
              </div>
              <button
                type="button"
                className="btn-val-close"
                onClick={() => setValuationResult(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <h3 className="val-result-veh-name">{valuationResult.vehicleName}</h3>
            <p className="val-result-meta">
              📍 {cityOrPincode} • 🛣️ {kilometers} km • 👤 {ownership}
            </p>

            <div className="val-result-price-box">
              <span className="price-box-label">Estimated Fair Market Resale Value</span>
              <div className="price-big-highlight">
                ₹ {valuationResult.fairMin} Lakh - ₹ {valuationResult.fairMax} Lakh
              </div>
              <span className="price-sub-note">
                Instant SART Verified Buyer Buyout: <strong>₹ {valuationResult.instantOffer} Lakh</strong>
              </span>
            </div>

            <div className="val-condition-tier-row">
              <div className="tier-col">
                <span className="tier-name">Excellent Condition</span>
                <span className="tier-amt">₹ {valuationResult.fairMax} L</span>
              </div>
              <div className="tier-col active">
                <span className="tier-name">Good Condition</span>
                <span className="tier-amt">₹ {valuationResult.instantOffer} L</span>
              </div>
              <div className="tier-col">
                <span className="tier-name">Fair Condition</span>
                <span className="tier-amt">₹ {valuationResult.fairMin} L</span>
              </div>
            </div>

            <div className="val-result-actions">
              <button
                type="button"
                className="btn-val-sell-now"
                onClick={() => {
                  showToast('Connecting you with 15+ verified buyers in ' + cityOrPincode);
                  if (onBackToSell) onBackToSell();
                }}
              >
                <i className="fa-solid fa-handshake"></i>
                <span>Sell to Verified Buyers</span>
              </button>

              <button
                type="button"
                className="btn-val-book-inspection"
                onClick={() => {
                  showToast('Doorstep inspection requested! SART team will call you shortly.');
                  setValuationResult(null);
                }}
              >
                <i className="fa-solid fa-calendar-check"></i>
                <span>Book Free Doorstep Inspection</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
