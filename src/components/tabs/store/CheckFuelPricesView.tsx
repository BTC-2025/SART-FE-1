'use client';

import React, { useState } from 'react';
import './CheckFuelPricesView.css';

interface CheckFuelPricesViewProps {
  showToast: (msg: string) => void;
  userLocationCity?: string;
  setUserLocationCity?: (city: string) => void;
  onNavigateTab?: (path: string) => void;
}

export default function CheckFuelPricesView({
  showToast,
  userLocationCity = 'Vellore',
  setUserLocationCity,
  onNavigateTab
}: CheckFuelPricesViewProps) {
  const [selectedState, setSelectedState] = useState<string>('Tamil Nadu');
  const [selectedCity, setSelectedCity] = useState<string>('Vellore');
  const [selectedFuelType, setSelectedFuelType] = useState<'Petrol' | 'Diesel' | 'CNG'>('Petrol');
  const [readMoreExpanded, setReadMoreExpanded] = useState<boolean>(false);
  const [fuelDropdownOpen, setFuelDropdownOpen] = useState<boolean>(false);

  // Price rates based on fuel type
  const priceMap: Record<'Petrol' | 'Diesel' | 'CNG', { price: string; unit: string }> = {
    Petrol: { price: '₹ 108.45', unit: '/L' },
    Diesel: { price: '₹ 100.24', unit: '/L' },
    CNG: { price: '₹ 97.50', unit: '/KG' }
  };

  const currentRate = priceMap[selectedFuelType];

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    showToast(`State changed to ${state}`);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    if (setUserLocationCity) setUserLocationCity(city);
    showToast(`Fuel prices updated for ${city}`);
  };

  const handleFuelSelect = (fuel: 'Petrol' | 'Diesel' | 'CNG') => {
    setSelectedFuelType(fuel);
    setFuelDropdownOpen(false);
    showToast(`Showing ${fuel} price trend for ${selectedCity}`);
  };

  const last7DaysData = [
    { date: '27-Nov-2026', price: currentRate.price },
    { date: '26-Nov-2026', price: currentRate.price },
    { date: '25-Nov-2026', price: currentRate.price },
    { date: '24-Nov-2026', price: currentRate.price },
    { date: '23-Nov-2026', price: currentRate.price },
    { date: '22-Nov-2026', price: currentRate.price },
    { date: '21-Nov-2026', price: currentRate.price }
  ];

  const navigateTo = (path: string) => {
    if (onNavigateTab) {
      onNavigateTab(path);
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="check-fuel-prices-wrapper animate-fade-in">
      {/* 1. TOP HEADER BANNER (MATCHING IMAGE 2) */}
      <div className="fuel-prices-header-card">
        <h1 className="fuel-prices-main-title">
          Fuel Price in {selectedCity} Today
        </h1>

        <p className="fuel-prices-subtext">
          Fuel price in {selectedCity} today stands at Petrol - ₹ 108.45 /L, Diesel - ₹ 100.24 /L &amp; CNG - ₹ 97.5 /KG. You can get your car&apos;s fuel tank filled at similar prices at your nearby fuel station today. Explore the daily, weekly, and monthly fuel price growth trend easily. Generally, fuel prices revise at 6 a.m. daily in India. Indian Oil, Bharat Petroleum, Hindustan Petroleum (HP), Reliance &amp;
          {readMoreExpanded ? (
            <span> Shell offer reliable fueling services across highway corridors and city centers. Check live revisions each morning for optimal fuel budgeting.</span>
          ) : (
            <button
              type="button"
              className="btn-read-more-inline"
              onClick={() => setReadMoreExpanded(true)}
            >
              {' '}Read More
            </button>
          )}
        </p>

        {/* Quick Hub Navigation Pills */}
        <div className="fuel-quick-switch-tabs">
          <button
            type="button"
            className="fuel-switch-btn"
            onClick={() => navigateTo('/store/FuelStations')}
          >
            <i className="fa-solid fa-gas-pump"></i>
            <span>Fuel Stations</span>
          </button>

          <button
            type="button"
            className="fuel-switch-btn active"
            onClick={() => {}}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Check Fuel Prices</span>
          </button>

          <button
            type="button"
            className="fuel-switch-btn"
            onClick={() => navigateTo('/store/FindEVChargingStations')}
          >
            <i className="fa-solid fa-bolt"></i>
            <span>Charging Station</span>
          </button>

          <button
            type="button"
            className="fuel-switch-btn"
            onClick={() => navigateTo('/store/ServiceCenters')}
          >
            <i className="fa-solid fa-wrench"></i>
            <span>Service Centers</span>
          </button>
        </div>
      </div>

      {/* 2. FILTER DROPDOWNS ROW (MATCHING IMAGE 2) */}
      <div className="fuel-filters-row">
        {/* State Dropdown */}
        <div className="fuel-select-box">
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="fuel-dropdown-select"
          >
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Telangana">Telangana</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
          </select>
          <i className="fa-solid fa-chevron-down fuel-select-arrow"></i>
        </div>

        {/* City Dropdown */}
        <div className="fuel-select-box">
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="fuel-dropdown-select"
          >
            <option value="Vellore">Vellore</option>
            <option value="Chennai">Chennai</option>
            <option value="Ranipet">Ranipet</option>
            <option value="Tiruvannamalai">Tiruvannamalai</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mumbai">Mumbai</option>
          </select>
          <i className="fa-solid fa-chevron-down fuel-select-arrow"></i>
        </div>

        {/* Fuel Type Dropdown (Petrol, Diesel, CNG) */}
        <div className="fuel-select-box custom-fuel-dropdown">
          <button
            type="button"
            className="fuel-dropdown-select fuel-trigger-btn"
            onClick={() => setFuelDropdownOpen(!fuelDropdownOpen)}
          >
            <span>{selectedFuelType ? selectedFuelType : 'Select Fuel'}</span>
            <i className={`fa-solid ${fuelDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'} fuel-select-arrow`}></i>
          </button>

          {fuelDropdownOpen && (
            <div className="fuel-type-popover animate-fade-in">
              {(['Petrol', 'Diesel', 'CNG'] as const).map((fuel) => (
                <div
                  key={fuel}
                  className={`fuel-popover-item ${selectedFuelType === fuel ? 'selected' : ''}`}
                  onClick={() => handleFuelSelect(fuel)}
                >
                  {fuel}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. TREND CARD (MATCHING IMAGE 2) */}
      <div className="fuel-trend-card">
        <h3 className="fuel-card-title">
          Trend of {selectedFuelType} Rate in {selectedCity}
        </h3>

        <div className="fuel-trend-table">
          <div className="trend-row">
            <span className="trend-label">21 November</span>
            <span className="trend-val">{currentRate.price} {currentRate.unit}</span>
          </div>
          <div className="trend-row">
            <span className="trend-label">27 November</span>
            <span className="trend-val">{currentRate.price} {currentRate.unit}</span>
          </div>
          <div className="trend-row">
            <span className="trend-label">Highest Rate In November</span>
            <span className="trend-val">{currentRate.price} {currentRate.unit}</span>
          </div>
          <div className="trend-row">
            <span className="trend-label">Lowest Rate In November</span>
            <span className="trend-val">{currentRate.price} {currentRate.unit}</span>
          </div>
        </div>
      </div>

      {/* 4. LAST 7 DAYS FUEL PRICES CARD (MATCHING IMAGE 2) */}
      <div className="fuel-history-card">
        <h3 className="fuel-card-title">
          Last 7 Days fuel prices In {selectedCity}
        </h3>

        {/* Fuel Type Tabs */}
        <div className="fuel-history-tabs">
          {(['Petrol', 'Diesel', 'CNG'] as const).map((fuel) => (
            <button
              key={fuel}
              type="button"
              className={`fuel-tab-btn ${selectedFuelType === fuel ? 'active' : ''}`}
              onClick={() => handleFuelSelect(fuel)}
            >
              {fuel}
            </button>
          ))}
        </div>

        {/* 7-Day Table */}
        <div className="fuel-history-table-wrap">
          <table className="fuel-history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Price (cost{currentRate.unit})</th>
              </tr>
            </thead>
            <tbody>
              {last7DaysData.map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td>{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
