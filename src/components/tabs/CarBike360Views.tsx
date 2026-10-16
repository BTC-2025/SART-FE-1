'use client';

import React, { useState, useMemo } from 'react';
import {
  VehicleShowcaseItem,
  VEHICLE_SHOWCASE_DATA,
  UPCOMING_CARS_FAQS,
  UpcomingCarsFaq
} from './storeData';

/* ------------------------------------------------------------------ */
/* 1. ON-ROAD PRICE BREAKDOWN MODAL                                    */
/* ------------------------------------------------------------------ */

interface OnRoadPriceModalProps {
  vehicle: VehicleShowcaseItem;
  userLocationCity: string;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export function Carbike360OnRoadPriceModal({
  vehicle,
  userLocationCity,
  onClose,
  showToast
}: OnRoadPriceModalProps) {
  const [activeCity, setActiveCity] = useState(userLocationCity || 'Chennai');
  const [includeWarranty, setIncludeWarranty] = useState(true);

  // Approximate on-road components based on ex-showroom
  const priceRaw = vehicle.priceRaw || 10;
  const exShowroomRupees = Math.round(priceRaw * 100000);
  const rtoTaxRupees = Math.round(exShowroomRupees * 0.125); // 12.5% RTO
  const insuranceRupees = Math.round(exShowroomRupees * 0.038); // 3.8% Comprehensive
  const fastagHsrp = 1100;
  const warrantyShield = includeWarranty ? 18500 : 0;
  const totalOnRoadRupees = exShowroomRupees + rtoTaxRupees + insuranceRupees + fastagHsrp + warrantyShield;

  const formatINR = (val: number) => {
    return '₹ ' + val.toLocaleString('en-IN');
  };

  return (
    <div className="cb360-modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="cb360-modal-dialog animate-scale" onClick={(e) => e.stopPropagation()}>
        <div className="cb360-modal-header">
          <div className="cb360-modal-title-wrap">
            <span className="cb360-modal-flair">
              <i className="fa-solid fa-calculator"></i> CarBike360 On-Road Price Calculator
            </span>
            <h3>{vehicle.name} On-Road Price in {activeCity}</h3>
          </div>
          <button type="button" className="cb360-modal-close" onClick={onClose} title="Close Modal">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="cb360-modal-body">
          {/* Top Vehicle Summary Card */}
          <div className="cb360-modal-veh-summary">
            <img src={vehicle.image} alt={vehicle.name} className="cb360-modal-veh-img" />
            <div className="cb360-modal-veh-details">
              <h4>{vehicle.name}</h4>
              <div className="cb360-modal-tags">
                <span className="cb360-modal-tag"><i className="fa-solid fa-gas-pump"></i> {vehicle.fuel}</span>
                <span className="cb360-modal-tag"><i className="fa-solid fa-gears"></i> {vehicle.transmission || 'Manual / AMT'}</span>
                <span className="cb360-modal-tag"><i className="fa-solid fa-users"></i> {vehicle.seating || '5 Seater'}</span>
              </div>
              <div className="cb360-modal-city-select-row">
                <label><i className="fa-solid fa-location-dot"></i> Select Your City:</label>
                <select value={activeCity} onChange={(e) => setActiveCity(e.target.value)}>
                  {['Chennai', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Coimbatore', 'Pune', 'Kolkata'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Detailed Price Breakdown Table */}
          <div className="cb360-modal-breakdown-card">
            <h5>Price Breakdown Details ({activeCity})</h5>
            <div className="cb360-table-row">
              <span className="row-label">Ex-Showroom Price</span>
              <span className="row-value">{formatINR(exShowroomRupees)}</span>
            </div>
            <div className="cb360-table-row">
              <span className="row-label">
                RTO Registration &amp; Road Tax (12.5%)
                <small>State Road Transport Office Charges</small>
              </span>
              <span className="row-value">{formatINR(rtoTaxRupees)}</span>
            </div>
            <div className="cb360-table-row">
              <span className="row-label">
                Comprehensive Insurance (1 Yr OD + 3 Yr TP)
                <small>Zero Depreciation + Engine Protect + RSA</small>
              </span>
              <span className="row-value">{formatINR(insuranceRupees)}</span>
            </div>
            <div className="cb360-table-row">
              <span className="row-label">FASTag &amp; High Security Plates (HSRP)</span>
              <span className="row-value">{formatINR(fastagHsrp)}</span>
            </div>
            <div className="cb360-table-row optional-row">
              <label className="row-label checkbox-label">
                <input
                  type="checkbox"
                  checked={includeWarranty}
                  onChange={(e) => setIncludeWarranty(e.target.checked)}
                />
                <span>SART Extended 5-Year Warranty Shield</span>
              </label>
              <span className="row-value">{includeWarranty ? formatINR(warrantyShield) : '₹ 0'}</span>
            </div>

            <div className="cb360-table-total-row">
              <div className="total-label-wrap">
                <span className="total-title">Total Estimated On-Road Price:</span>
                <span className="total-city-note">Inclusive of all taxes &amp; charges in {activeCity}</span>
              </div>
              <div className="total-val-box">
                <span className="total-val">{formatINR(totalOnRoadRupees)}</span>
                <span className="total-emi-hint">or starting EMI ₹ {Math.round(totalOnRoadRupees * 0.0195).toLocaleString('en-IN')}/mo*</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cb360-modal-footer">
          <button
            type="button"
            className="cb360-modal-btn secondary"
            onClick={() => {
              showToast(`Booking test drive for ${vehicle.name} in ${activeCity}...`);
              onClose();
            }}
          >
            <i className="fa-solid fa-car-side"></i>
            <span>Book Free Test Drive</span>
          </button>
          <button
            type="button"
            className="cb360-modal-btn primary"
            onClick={() => {
              showToast(`Dealer quotation requested for ${vehicle.name} in ${activeCity}! Best offer will be sent.`);
              onClose();
            }}
          >
            <i className="fa-solid fa-file-invoice-dollar"></i>
            <span>Get Dealer Festive Offer</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. SHARED CHETAK AD BANNERS (User First Image Reference)           */
/* ------------------------------------------------------------------ */

export function Carbike360ChetakLeaderboardAd({ showToast }: { showToast: (msg: string) => void }) {
  return (
    <div className="cb360-ad-leaderboard animate-fade-in" onClick={() => showToast('Opened Bajaj Chetak Sport Mode Special Offer • ₹99,800/-')}>
      <div className="cb360-ad-leaderboard-inner">
        <div className="cb360-ad-tag-col">
          <span className="cb360-ad-pill">Featured Ad</span>
          <div className="cb360-ad-brand">
            <span className="brand-name">Chetak</span>
            <span className="badge-sport">SPORT MODE</span>
          </div>
        </div>
        <div className="cb360-ad-content-col">
          <h4 className="cb360-ad-headline">STAY TECHPROOF WITH GOOGLE MAPS ONBOARD</h4>
          <p className="cb360-ad-desc">Fully Lifeproof • Top Speed 80 km/h • Real World Range 126 km • Zero Emissions</p>
        </div>
        <div className="cb360-ad-cta-col">
          <div className="cb360-ad-price-block">
            <span className="price-lbl">Starting at</span>
            <span className="price-num">₹ 99,800/-*</span>
          </div>
          <button type="button" className="cb360-ad-btn">
            <span>Explore Chetak</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export function Carbike360ChetakSidebarAd({ showToast }: { showToast: (msg: string) => void }) {
  return (
    <div className="cb360-sidebar-ad-card" onClick={() => showToast('Opening Bajaj Chetak EV Details')}>
      <div className="cb360-sidebar-ad-top">
        <span className="ad-sponsor-label">Sponsored Ad</span>
        <div className="cb360-sidebar-chetak-logo">
          <span className="chetak-logo-text">Chetak</span>
          <span className="chetak-life-tag">FULLY LIFEPROOF</span>
        </div>
      </div>
      <div className="cb360-sidebar-ad-image-box">
        <img
          src="https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=400&q=80"
          alt="Bajaj Chetak Electric"
        />
        <div className="cb360-sidebar-ad-overlay">
          <span className="ad-pill-badge"><i className="fa-solid fa-bolt"></i> SPORT MODE</span>
          <span className="ad-pill-badge map"><i className="fa-solid fa-location-arrow"></i> Google Maps</span>
        </div>
      </div>
      <div className="cb360-sidebar-ad-footer">
        <div className="ad-price-group">
          <span className="label">Starting Price</span>
          <span className="price">₹ 99,800/-*</span>
        </div>
        <button type="button" className="btn-chetak-sidebar">
          <span>Book Test Ride</span>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. VIEW 1: FIND NEW CARS (First Image Based Layout)                */
/* ------------------------------------------------------------------ */

interface FindNewViewProps {
  cardekhoSelectedType: string;
  setCardekhoSelectedType: (type: string) => void;
  cb360PriceRange: string;
  setCb360PriceRange: (range: string) => void;
  cb360SelectedBrands: string[];
  setCb360SelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  cb360SelectedBodyTypes: string[];
  setCb360SelectedBodyTypes: React.Dispatch<React.SetStateAction<string[]>>;
  cb360SelectedFuels: string[];
  setCb360SelectedFuels: React.Dispatch<React.SetStateAction<string[]>>;
  cb360SelectedTransmissions: string[];
  setCb360SelectedTransmissions: React.Dispatch<React.SetStateAction<string[]>>;
  cb360SelectedSeating: string;
  setCb360SelectedSeating: (seating: string) => void;
  cb360SortBy: 'popular' | 'price_low' | 'price_high' | 'rating';
  setCb360SortBy: (sort: 'popular' | 'price_low' | 'price_high' | 'rating') => void;
  userLocationCity: string;
  onSelectOnRoadPrice: (v: VehicleShowcaseItem) => void;
  onBackToPortal: () => void;
  showToast: (msg: string) => void;
}

export function Carbike360FindNewView({
  cardekhoSelectedType,
  setCardekhoSelectedType,
  cb360PriceRange,
  setCb360PriceRange,
  cb360SelectedBrands,
  setCb360SelectedBrands,
  cb360SelectedBodyTypes,
  setCb360SelectedBodyTypes,
  cb360SelectedFuels,
  setCb360SelectedFuels,
  cb360SelectedTransmissions,
  setCb360SelectedTransmissions,
  cb360SelectedSeating,
  setCb360SelectedSeating,
  cb360SortBy,
  setCb360SortBy,
  userLocationCity,
  onSelectOnRoadPrice,
  onBackToPortal,
  showToast
}: FindNewViewProps) {
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  const [seeMoreHeader, setSeeMoreHeader] = useState(false);

  // Vehicle Categories for quick pill switcher (satisfies user "many vechicle there ok")
  const VEHICLE_CATEGORIES = [
    { id: 'All', label: 'All Vehicles', icon: 'fa-layer-group' },
    { id: 'Car', label: 'Cars & SUVs', icon: 'fa-car-side' },
    { id: 'Bike', label: 'Bikes & Scooters', icon: 'fa-motorcycle' },
    { id: 'Lorry', label: 'Commercial Trucks', icon: 'fa-truck-moving' },
    { id: 'Bus', label: 'Passenger Buses', icon: 'fa-bus-simple' },
    { id: 'Van', label: 'Delivery Vans', icon: 'fa-van-shuttle' },
    { id: 'Tractor', label: 'Agri Tractors', icon: 'fa-tractor' },
    { id: 'Auto', label: '3-Wheelers & Auto', icon: 'fa-truck-pickup' },
    { id: 'EV', label: '100% Electric (EV)', icon: 'fa-bolt' },
  ];

  // Brands list for left sidebar with vehicle counts
  const SIDEBAR_BRANDS = [
    { name: 'Maruti Suzuki', count: 18 },
    { name: 'Hyundai', count: 12 },
    { name: 'Tata Motors', count: 14 },
    { name: 'Mahindra', count: 10 },
    { name: 'Toyota', count: 8 },
    { name: 'Honda', count: 6 },
    { name: 'Rolls-Royce', count: 2 },
    { name: 'Mercedes-Benz', count: 5 },
    { name: 'BMW', count: 4 },
    { name: 'Skoda', count: 3 },
    { name: 'Kia', count: 6 },
    { name: 'Bajaj Auto', count: 7 },
    { name: 'Royal Enfield', count: 5 },
    { name: 'Ashok Leyland', count: 4 },
    { name: 'Volvo', count: 4 },
  ];

  const filteredSidebarBrands = useMemo(() => {
    if (!brandSearchTerm.trim()) return SIDEBAR_BRANDS;
    return SIDEBAR_BRANDS.filter(b => b.name.toLowerCase().includes(brandSearchTerm.toLowerCase()));
  }, [brandSearchTerm]);

  // Filter vehicles
  const findNewVehicles = useMemo(() => {
    return VEHICLE_SHOWCASE_DATA.filter((v) => {
      // Must not be used
      if (v.status === 'used') return false;

      // Filter by vehicle type
      if (cardekhoSelectedType !== 'All') {
        if (cardekhoSelectedType === 'EV') {
          const isEv = v.type === 'EV' || v.status === 'electric' || v.fuel.toLowerCase().includes('electric') || v.fuel.toLowerCase().includes('ev');
          if (!isEv) return false;
        } else if (v.type !== cardekhoSelectedType) {
          return false;
        }
      }

      // Filter by price range
      if (cb360PriceRange !== 'all') {
        const p = v.priceRaw || 0;
        if (cb360PriceRange === 'under_5' && p > 5) return false;
        if (cb360PriceRange === '5_10' && (p < 5 || p > 10)) return false;
        if (cb360PriceRange === '10_20' && (p < 10 || p > 20)) return false;
        if (cb360PriceRange === '20_50' && (p < 20 || p > 50)) return false;
        if (cb360PriceRange === 'above_50' && p < 50) return false;
      }

      // Filter by selected brands
      if (cb360SelectedBrands.length > 0) {
        const match = cb360SelectedBrands.some(b => v.brand.toLowerCase().includes(b.toLowerCase()) || v.name.toLowerCase().includes(b.toLowerCase()));
        if (!match) return false;
      }

      // Filter by body types
      if (cb360SelectedBodyTypes.length > 0) {
        const text = `${v.name} ${v.seating || ''} ${(v.features || []).join(' ')}`.toLowerCase();
        const match = cb360SelectedBodyTypes.some(bt => text.includes(bt.toLowerCase()));
        if (!match) return false;
      }

      // Filter by fuel
      if (cb360SelectedFuels.length > 0) {
        const fuelLower = v.fuel.toLowerCase();
        const match = cb360SelectedFuels.some(f => fuelLower.includes(f.toLowerCase()));
        if (!match) return false;
      }

      // Filter by transmission
      if (cb360SelectedTransmissions.length > 0) {
        const transLower = `${v.transmission || ''} ${(v.features || []).join(' ')}`.toLowerCase();
        const match = cb360SelectedTransmissions.some(t => transLower.includes(t.toLowerCase()));
        if (!match) return false;
      }

      // Filter by seating
      if (cb360SelectedSeating !== 'all') {
        const seatText = (v.seating || '').toLowerCase();
        if (!seatText.includes(cb360SelectedSeating.toLowerCase())) return false;
      }

      return true;
    }).sort((a, b) => {
      if (cb360SortBy === 'price_low') return a.priceRaw - b.priceRaw;
      if (cb360SortBy === 'price_high') return b.priceRaw - a.priceRaw;
      if (cb360SortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [cardekhoSelectedType, cb360PriceRange, cb360SelectedBrands, cb360SelectedBodyTypes, cb360SelectedFuels, cb360SelectedTransmissions, cb360SelectedSeating, cb360SortBy]);

  const toggleBrand = (brandName: string) => {
    setCb360SelectedBrands(prev =>
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
  };

  const toggleBodyType = (type: string) => {
    setCb360SelectedBodyTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleFuel = (fuel: string) => {
    setCb360SelectedFuels(prev =>
      prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]
    );
  };

  const toggleTransmission = (t: string) => {
    setCb360SelectedTransmissions(prev =>
      prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]
    );
  };

  const clearAllFilters = () => {
    setCb360PriceRange('all');
    setCb360SelectedBrands([]);
    setCb360SelectedBodyTypes([]);
    setCb360SelectedFuels([]);
    setCb360SelectedTransmissions([]);
    setCb360SelectedSeating('all');
    setBrandSearchTerm('');
    showToast('All filters cleared');
  };

  const hasActiveFilters = cb360PriceRange !== 'all' || cb360SelectedBrands.length > 0 || cb360SelectedBodyTypes.length > 0 || cb360SelectedFuels.length > 0 || cb360SelectedTransmissions.length > 0 || cb360SelectedSeating !== 'all';

  return (
    <div className="cb360-page-container animate-fade-in">
      {/* 1. Breadcrumbs & Return Bar */}
      <div className="cb360-breadcrumb-row">
        <div className="cb360-crumbs-list">
          <span className="crumb-link" onClick={onBackToPortal}>Home</span>
          <i className="fa-solid fa-chevron-right crumb-sep"></i>
          <span className="crumb-link" onClick={() => setCardekhoSelectedType('All')}>
            {cardekhoSelectedType === 'Bike' ? 'Bikes' :
             cardekhoSelectedType === 'Lorry' ? 'Commercial Trucks' :
             cardekhoSelectedType === 'Bus' ? 'Buses' :
             cardekhoSelectedType === 'Van' ? 'Vans' :
             cardekhoSelectedType === 'Tractor' ? 'Tractors' :
             cardekhoSelectedType === 'Auto' ? '3-Wheelers' :
             cardekhoSelectedType === 'EV' ? 'Electric Vehicles' : 'Cars'}
          </span>
          <i className="fa-solid fa-chevron-right crumb-sep"></i>
          <span className="crumb-current">
            New {cardekhoSelectedType === 'All' ? 'Vehicles' : cardekhoSelectedType + 's'} in India
          </span>
        </div>
        <button type="button" className="cb360-back-portal-btn" onClick={onBackToPortal}>
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Portal Overview</span>
        </button>
      </div>

      {/* 2. Top Chetak Banner Ad (Image 1 Reference) */}
      <Carbike360ChetakLeaderboardAd showToast={showToast} />

      {/* 3. Multi-Vehicle Category Selector Pills (satisfies "you mind it many vechicle there ok") */}
      <div className="cb360-category-pills-row">
        <span className="category-row-label">Category:</span>
        <div className="category-pills-scroll">
          {VEHICLE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`cb360-cat-pill ${cardekhoSelectedType === cat.id ? 'active' : ''}`}
              onClick={() => {
                setCardekhoSelectedType(cat.id);
                showToast(`Filtered for New ${cat.label}`);
              }}
            >
              <i className={`fa-solid ${cat.icon}`}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Page Title & CarBike360 Introductory SEO Text (Image 1 Reference) */}
      <div className="cb360-page-header-card">
        <h1 className="cb360-page-title">
          New {cardekhoSelectedType === 'All' ? 'Cars & Vehicles' : cardekhoSelectedType + 's'} in India
        </h1>
        <p className="cb360-page-desc">
          CarBike360 has curated {findNewVehicles.length} popular new {cardekhoSelectedType === 'All' ? 'vehicles' : cardekhoSelectedType.toLowerCase() + 's'} available for sale in India. Starting price is ₹ 3.99 Lakh while the most luxurious model is Rolls-Royce Ghost at ₹ 7.95 Crore.
          {seeMoreHeader ? (
            <span>
              {' '}Explore top selling hatchbacks, sedans, compact SUVs, luxury saloons and commercial carriers with verified technical specifications, mileage, real-time ex-showroom and on-road prices across cities like {userLocationCity}, Delhi, Mumbai, and Bengaluru. Use our interactive filters below to sort by budget, brand, body type, transmission and fuel preferences.
            </span>
          ) : null}
          <button
            type="button"
            className="cb360-see-more-link"
            onClick={() => setSeeMoreHeader(!seeMoreHeader)}
          >
            {seeMoreHeader ? 'See Less ∧' : 'See More ∨'}
          </button>
        </p>
      </div>

      {/* 5. Two-Column Layout (Image 1 Layout: Left Filter Sidebar + Right Main Catalog) */}
      <div className="cb360-two-col-layout">
        {/* LEFT COLUMN: FILTERS SIDEBAR */}
        <aside className="cb360-filter-sidebar">
          <div className="cb360-sidebar-header">
            <h4><i className="fa-solid fa-sliders"></i> Filters</h4>
            {hasActiveFilters && (
              <button type="button" className="cb360-clear-btn" onClick={clearAllFilters}>
                Clear All
              </button>
            )}
          </div>

          {/* 1. Price Histogram & Range (Strictly matching Image 1) */}
          <div className="cb360-filter-group">
            <div className="filter-title-row">
              <span className="filter-group-title">Price</span>
            </div>
            {/* Visual Histogram Chart (12 Bars) */}
            <div className="cb360-histogram-bar-wrap" title="Price Distribution Histogram">
              {[25, 45, 75, 95, 60, 40, 85, 100, 70, 50, 30, 15].map((height, i) => (
                <div key={i} className="hist-bar-col">
                  <div
                    className={`hist-bar-fill ${i >= 2 && i <= 8 ? 'active-range' : ''}`}
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="cb360-radio-list">
              {[
                { id: 'all', label: 'All Budgets' },
                { id: 'under_5', label: 'Under 5 Lakh (₹ 0 - 5L)' },
                { id: '5_10', label: '₹ 5 - 10 Lakh' },
                { id: '10_20', label: '₹ 10 - 20 Lakh' },
                { id: '20_50', label: '₹ 20 - 50 Lakh' },
                { id: 'above_50', label: 'Above ₹ 50 Lakh' },
              ].map(option => (
                <label key={option.id} className="cb360-checkbox-item">
                  <input
                    type="radio"
                    name="price_range"
                    checked={cb360PriceRange === option.id}
                    onChange={() => setCb360PriceRange(option.id)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Brand Checkboxes with Search Input (Image 1 Reference) */}
          <div className="cb360-filter-group">
            <span className="filter-group-title">Brand</span>
            <div className="cb360-filter-search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search Brand..."
                value={brandSearchTerm}
                onChange={(e) => setBrandSearchTerm(e.target.value)}
              />
            </div>
            <div className="cb360-checkbox-scroll-list">
              {filteredSidebarBrands.map(brand => (
                <label key={brand.name} className="cb360-checkbox-item">
                  <input
                    type="checkbox"
                    checked={cb360SelectedBrands.includes(brand.name)}
                    onChange={() => toggleBrand(brand.name)}
                  />
                  <span className="checkbox-text">{brand.name}</span>
                  <span className="checkbox-count">({brand.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Body Type */}
          <div className="cb360-filter-group">
            <span className="filter-group-title">Body Type</span>
            <div className="cb360-checkbox-list">
              {['SUV', 'Sedan', 'Hatchback', 'MUV', 'Luxury', 'Coupe'].map(bt => (
                <label key={bt} className="cb360-checkbox-item">
                  <input
                    type="checkbox"
                    checked={cb360SelectedBodyTypes.includes(bt)}
                    onChange={() => toggleBodyType(bt)}
                  />
                  <span>{bt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Fuel Type */}
          <div className="cb360-filter-group">
            <span className="filter-group-title">Fuel Type</span>
            <div className="cb360-checkbox-list">
              {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map(f => (
                <label key={f} className="cb360-checkbox-item">
                  <input
                    type="checkbox"
                    checked={cb360SelectedFuels.includes(f)}
                    onChange={() => toggleFuel(f)}
                  />
                  <span>{f}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Transmission */}
          <div className="cb360-filter-group">
            <span className="filter-group-title">Transmission</span>
            <div className="cb360-checkbox-list">
              {['Manual', 'Automatic', 'AMT', 'DCT'].map(t => (
                <label key={t} className="cb360-checkbox-item">
                  <input
                    type="checkbox"
                    checked={cb360SelectedTransmissions.includes(t)}
                    onChange={() => toggleTransmission(t)}
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 6. Seating Capacity */}
          <div className="cb360-filter-group">
            <span className="filter-group-title">Seating Capacity</span>
            <div className="cb360-pills-grid">
              {['all', '5 Seater', '7 Seater', '4 Seater', '8 Seater'].map(s => (
                <button
                  key={s}
                  type="button"
                  className={`cb360-pill-btn ${cb360SelectedSeating === s ? 'active' : ''}`}
                  onClick={() => setCb360SelectedSeating(s)}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Vertical Chetak Sidebar Ad (Matching Image 1) */}
          <Carbike360ChetakSidebarAd showToast={showToast} />
        </aside>

        {/* RIGHT COLUMN: MAIN VEHICLE CATALOG (Horizontal Cards matching Image 1) */}
        <main className="cb360-catalog-col">
          {/* Top Sort & Count Bar */}
          <div className="cb360-catalog-top-bar">
            <div className="cb360-results-count">
              <span>Total <strong>{findNewVehicles.length}</strong> {cardekhoSelectedType === 'All' ? 'Vehicles' : cardekhoSelectedType + 's'} Available</span>
            </div>
            <div className="cb360-sort-group">
              <label>Sort By:</label>
              <select
                value={cb360SortBy}
                onChange={(e) => setCb360SortBy(e.target.value as any)}
              >
                <option value="popular">Popularity</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          {findNewVehicles.length === 0 ? (
            <div className="cb360-empty-results">
              <i className="fa-solid fa-car-tunnel"></i>
              <h4>No vehicles match your active filter criteria</h4>
              <p>Try resetting the price, brand or transmission filters to view more models.</p>
              <button type="button" className="cb360-btn-reset" onClick={clearAllFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="cb360-cards-container">
              {findNewVehicles.map((veh, index) => (
                <React.Fragment key={veh.id}>
                  {/* Wide Horizontal Card (Strictly matching Image 1) */}
                  <div className="cb360-horizontal-card animate-fade-in">
                    {/* Media Column (Left) */}
                    <div className="cb360-card-media">
                      <img src={veh.image} alt={veh.name} loading="lazy" />
                      <span className="cb360-photo-count-pill">
                        <i className="fa-regular fa-image"></i> 1/12
                      </span>
                      <span className="cb360-360-badge">
                        <i className="fa-solid fa-rotate"></i> 360°
                      </span>
                    </div>

                    {/* Content Column (Right) */}
                    <div className="cb360-card-content">
                      <div className="cb360-card-head-row">
                        <div className="cb360-name-block">
                          <h3 className="cb360-car-name">{veh.name}</h3>
                          {veh.badgeTag && (
                            <span className={`cb360-tag-pill ${veh.badgeTag.toLowerCase()}`}>
                              {veh.badgeTag}
                            </span>
                          )}
                        </div>
                        <div className="cb360-rating-block">
                          <span className="cb360-star-pill">
                            <i className="fa-solid fa-star"></i> {veh.rating}
                          </span>
                          <button
                            type="button"
                            className="cb360-heart-fav"
                            title="Add to Wishlist"
                            onClick={() => showToast(`Added ${veh.name} to Wishlist`)}
                          >
                            <i className="fa-regular fa-heart"></i>
                          </button>
                        </div>
                      </div>

                      {/* Specs Row with Icons */}
                      <div className="cb360-specs-row">
                        <span className="cb360-spec-col">
                          <i className="fa-solid fa-gas-pump"></i>
                          <span>{veh.fuel}</span>
                        </span>
                        <span className="cb360-spec-col">
                          <i className="fa-solid fa-gauge-high"></i>
                          <span>{veh.mileage}</span>
                        </span>
                        <span className="cb360-spec-col">
                          <i className="fa-solid fa-gears"></i>
                          <span>{veh.transmission || 'Manual • AMT'}</span>
                        </span>
                        <span className="cb360-spec-col">
                          <i className="fa-solid fa-users"></i>
                          <span>{veh.seating || '5 Seater'}</span>
                        </span>
                      </div>

                      {/* Ex-showroom Price & Action CTA */}
                      <div className="cb360-card-bottom-row">
                        <div className="cb360-price-wrap">
                          <span className="cb360-price-tag">{veh.priceRange}</span>
                          <span className="cb360-price-sub">Avg. Ex-Showroom price</span>
                        </div>
                        <button
                          type="button"
                          className="cb360-btn-onroad"
                          onClick={() => onSelectOnRoadPrice(veh)}
                        >
                          <span>Get on-road price</span>
                          <i className="fa-solid fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interstitial Chetak Leaderboard Ad every 4 cards (Matching Image 1) */}
                  {(index + 1) % 4 === 0 && index + 1 < findNewVehicles.length && (
                    <Carbike360ChetakLeaderboardAd showToast={showToast} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. VIEW 2: LATEST CARS IN INDIA (Second Image Based Layout)         */
/* ------------------------------------------------------------------ */

interface LatestViewProps {
  userLocationCity: string;
  onSelectOnRoadPrice: (v: VehicleShowcaseItem) => void;
  onBackToPortal: () => void;
  showToast: (msg: string) => void;
  onSelectBrand: (brand: string) => void;
}

export function Carbike360LatestView({
  userLocationCity,
  onSelectOnRoadPrice,
  onBackToPortal,
  showToast,
  onSelectBrand
}: LatestViewProps) {
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [latestSort, setLatestSort] = useState<'newest' | 'low' | 'high'>('newest');

  // Filter latest cars
  const latestCars = useMemo(() => {
    return VEHICLE_SHOWCASE_DATA.filter(v =>
      v.status === 'popular' && (v.type === 'Car' || v.type === 'EV')
    ).sort((a, b) => {
      if (latestSort === 'low') return a.priceRaw - b.priceRaw;
      if (latestSort === 'high') return b.priceRaw - a.priceRaw;
      return 0; // default newest
    });
  }, [latestSort]);

  // 3x3 Brands Grid matching Image 2
  const INITIAL_BRANDS = [
    { name: 'Maruti Suzuki', icon: 'fa-car' },
    { name: 'Hyundai', icon: 'fa-bolt' },
    { name: 'Honda', icon: 'fa-road' },
    { name: 'Tata', icon: 'fa-shield-halved' },
    { name: 'Mahindra', icon: 'fa-truck-pickup' },
    { name: 'Renault', icon: 'fa-gem' },
    { name: 'Nissan', icon: 'fa-compass' },
    { name: 'Toyota', icon: 'fa-crown' },
    { name: 'MG', icon: 'fa-circle-dot' },
  ];

  const EXTRA_BRANDS = [
    { name: 'Skoda', icon: 'fa-award' },
    { name: 'Volkswagen', icon: 'fa-car-side' },
    { name: 'Kia', icon: 'fa-star' },
    { name: 'BMW', icon: 'fa-fan' },
    { name: 'Mercedes-Benz', icon: 'fa-certificate' },
    { name: 'Audi', icon: 'fa-circle-notch' }
  ];

  const displayedBrands = showMoreBrands ? [...INITIAL_BRANDS, ...EXTRA_BRANDS] : INITIAL_BRANDS;

  return (
    <div className="cb360-page-container animate-fade-in">
      {/* 1. Breadcrumbs */}
      <div className="cb360-breadcrumb-row">
        <div className="cb360-crumbs-list">
          <span className="crumb-link" onClick={onBackToPortal}>Home</span>
          <i className="fa-solid fa-chevron-right crumb-sep"></i>
          <span className="crumb-link" onClick={onBackToPortal}>Cars</span>
          <i className="fa-solid fa-chevron-right crumb-sep"></i>
          <span className="crumb-current">Latest Cars in India</span>
        </div>
        <button type="button" className="cb360-back-portal-btn" onClick={onBackToPortal}>
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Portal Overview</span>
        </button>
      </div>

      {/* 2. Top Chetak Banner Ad */}
      <Carbike360ChetakLeaderboardAd showToast={showToast} />

      {/* 3. Header Text matching Image 2 */}
      <div className="cb360-page-header-card">
        <div className="cb360-header-flex-row">
          <div>
            <h1 className="cb360-page-title">Latest Cars in India</h1>
            <p className="cb360-page-desc">
              CarBike360 has featured all {latestCars.length} new cars launched in recent months in India, including premium hatchbacks, SUVs with radar ADAS, luxury saloons and new-age electric vehicles.
            </p>
          </div>
          <div className="cb360-sort-group header-sort">
            <label>Sort By:</label>
            <select value={latestSort} onChange={(e) => setLatestSort(e.target.value as any)}>
              <option value="newest">Newest First</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Layout (Image 2: Left Main Column + Right Sidebar) */}
      <div className="cb360-image2-layout">
        {/* LEFT / MAIN COLUMN: LATEST CARS */}
        <div className="cb360-image2-main-col">
          <div className="cb360-cards-container">
            {latestCars.map((veh, index) => (
              <React.Fragment key={veh.id}>
                <div className="cb360-horizontal-card animate-fade-in">
                  <div className="cb360-card-media">
                    <img src={veh.image} alt={veh.name} loading="lazy" />
                    <span className="cb360-photo-count-pill"><i className="fa-regular fa-image"></i> 1/12</span>
                    <span className="cb360-360-badge"><i className="fa-solid fa-rotate"></i> 360°</span>
                  </div>

                  <div className="cb360-card-content">
                    <div className="cb360-card-head-row">
                      <div className="cb360-name-block">
                        <h3 className="cb360-car-name">{veh.name}</h3>
                        {veh.badgeTag && (
                          <span className={`cb360-tag-pill ${veh.badgeTag.toLowerCase()}`}>
                            {veh.badgeTag}
                          </span>
                        )}
                      </div>
                      <div className="cb360-rating-block">
                        <span className="cb360-star-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
                        <button type="button" className="cb360-heart-fav" onClick={() => showToast(`Saved ${veh.name} to Wishlist`)}>
                          <i className="fa-regular fa-heart"></i>
                        </button>
                      </div>
                    </div>

                    <div className="cb360-specs-row">
                      <span className="cb360-spec-col"><i className="fa-solid fa-gas-pump"></i> <span>{veh.fuel}</span></span>
                      <span className="cb360-spec-col"><i className="fa-solid fa-gauge-high"></i> <span>{veh.mileage}</span></span>
                      <span className="cb360-spec-col"><i className="fa-solid fa-gears"></i> <span>{veh.transmission || 'Automatic'}</span></span>
                      <span className="cb360-spec-col"><i className="fa-solid fa-users"></i> <span>{veh.seating || '5 Seater'}</span></span>
                    </div>

                    <div className="cb360-card-bottom-row">
                      <div className="cb360-price-wrap">
                        <span className="cb360-price-tag">{veh.priceRange}</span>
                        <span className="cb360-price-sub">Avg. Ex-Showroom price</span>
                      </div>
                      <button
                        type="button"
                        className="cb360-btn-onroad"
                        onClick={() => onSelectOnRoadPrice(veh)}
                      >
                        <span>Get on-road price</span>
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chetak leaderboard ad every 3 cars */}
                {(index + 1) % 3 === 0 && index + 1 < latestCars.length && (
                  <Carbike360ChetakLeaderboardAd showToast={showToast} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR (Matching Image 2: Chetak Ad + Explore Latest Cars Brands Grid) */}
        <aside className="cb360-image2-sidebar">
          {/* 1. Square Chetak Ad */}
          <div className="cb360-square-ad-box" onClick={() => showToast('Opened Chetak Sport Mode Offer')}>
            <div className="ad-badge-top">Sponsored</div>
            <img
              src="https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=400&q=80"
              alt="Chetak Ad"
            />
            <div className="ad-square-copy">
              <h5>STAY TECHPROOF</h5>
              <p>SPORT MODE • Starting ₹ 99,800/-</p>
            </div>
          </div>

          {/* 2. Explore Latest Cars Brands (3x3 Grid matching Image 2) */}
          <div className="cb360-sidebar-brands-card">
            <h4>Explore Latest Cars Brands</h4>
            <div className="cb360-brands-3x3-grid">
              {displayedBrands.map(b => (
                <div
                  key={b.name}
                  className="cb360-brand-tile"
                  onClick={() => onSelectBrand(b.name)}
                  title={`View all ${b.name} cars`}
                >
                  <div className="brand-tile-icon">
                    <i className={`fa-solid ${b.icon}`}></i>
                  </div>
                  <span className="brand-tile-name">{b.name}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="cb360-sidebar-showmore-btn"
              onClick={() => setShowMoreBrands(!showMoreBrands)}
            >
              <span>{showMoreBrands ? 'Show Less' : 'Show More'}</span>
              <i className={`fa-solid ${showMoreBrands ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </button>
          </div>

          {/* 3. Tall Chetak Vertical Ad */}
          <Carbike360ChetakSidebarAd showToast={showToast} />
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. VIEW 3: UPCOMING CARS IN INDIA 2026 (Images 3 & 4 Layout)       */
/* ------------------------------------------------------------------ */

interface UpcomingViewProps {
  userLocationCity: string;
  cb360UpcomingBrand: string;
  setCb360UpcomingBrand: (b: string) => void;
  cb360UpcomingBodyType: string;
  setCb360UpcomingBodyType: (bt: string) => void;
  cb360UpcomingBudget: string;
  setCb360UpcomingBudget: (b: string) => void;
  cb360FaqOpenIndex: number | null;
  setCb360FaqOpenIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onBackToPortal: () => void;
  showToast: (msg: string) => void;
}

export function Carbike360UpcomingView({
  userLocationCity,
  cb360UpcomingBrand,
  setCb360UpcomingBrand,
  cb360UpcomingBodyType,
  setCb360UpcomingBodyType,
  cb360UpcomingBudget,
  setCb360UpcomingBudget,
  cb360FaqOpenIndex,
  setCb360FaqOpenIndex,
  onBackToPortal,
  showToast
}: UpcomingViewProps) {
  const [pickRightTab, setPickRightTab] = useState<'brand' | 'budget' | 'body' | 'fuel' | 'transmission'>('brand');
  const [launchOrder, setLaunchOrder] = useState<'sooner' | 'later'>('sooner');

  // Filter upcoming vehicles
  const upcomingVehicles = useMemo(() => {
    return VEHICLE_SHOWCASE_DATA.filter(v => v.status === 'upcoming').filter(v => {
      if (cb360UpcomingBrand !== 'All Brands' && !v.brand.toLowerCase().includes(cb360UpcomingBrand.toLowerCase())) {
        return false;
      }
      if (cb360UpcomingBodyType !== 'All Body Types') {
        const text = `${v.name} ${v.seating || ''} ${(v.features || []).join(' ')}`.toLowerCase();
        if (!text.includes(cb360UpcomingBodyType.toLowerCase())) return false;
      }
      if (cb360UpcomingBudget !== 'All Prices') {
        const p = v.priceRaw || 0;
        if (cb360UpcomingBudget === 'Under 15 Lakh' && p > 15) return false;
        if (cb360UpcomingBudget === '15 - 35 Lakh' && (p < 15 || p > 35)) return false;
        if (cb360UpcomingBudget === '35 - 60 Lakh' && (p < 35 || p > 60)) return false;
        if (cb360UpcomingBudget === 'Above 60 Lakh' && p < 60) return false;
      }
      return true;
    });
  }, [cb360UpcomingBrand, cb360UpcomingBodyType, cb360UpcomingBudget]);

  const toggleFaq = (index: number) => {
    setCb360FaqOpenIndex(prev => prev === index ? null : index);
  };

  return (
    <div className="cb360-page-container animate-fade-in">
      {/* 1. Breadcrumbs */}
      <div className="cb360-breadcrumb-row">
        <div className="cb360-crumbs-list">
          <span className="crumb-link" onClick={onBackToPortal}>Home</span>
          <i className="fa-solid fa-chevron-right crumb-sep"></i>
          <span className="crumb-link" onClick={onBackToPortal}>Cars</span>
          <i className="fa-solid fa-chevron-right crumb-sep"></i>
          <span className="crumb-current">Upcoming</span>
        </div>
        <button type="button" className="cb360-back-portal-btn" onClick={onBackToPortal}>
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Portal Overview</span>
        </button>
      </div>

      {/* 2. Top Chetak Banner Ad */}
      <Carbike360ChetakLeaderboardAd showToast={showToast} />

      {/* 3. Title & Intro text matching Images 3 & 4 */}
      <div className="cb360-page-header-card">
        <h1 className="cb360-page-title">Upcoming Cars in India 2026</h1>
        <p className="cb360-page-desc">
          Check out 70+ upcoming cars in India with expected prices and launch timelines. The list covers new models like 2026 Toyota Fortuner, Audi Q3, Audi A6 E-Tron, Volkswagen Tayron, Land Rover Range Rover Sport Electric, Tata Sierra EV and Maruti Suzuki eVX. Set up instant launch alerts to get notified the day bookings open.
        </p>
      </div>

      {/* 4. Interactive Launch Filter Bar (Top of cards, matching Images 3 & 4) */}
      <div className="cb360-launch-filter-bar">
        <div className="launch-filter-inputs">
          <select
            value={cb360UpcomingBrand}
            onChange={(e) => setCb360UpcomingBrand(e.target.value)}
          >
            <option value="All Brands">Select Brand</option>
            <option value="Toyota">Toyota</option>
            <option value="Audi">Audi</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="Land Rover">Land Rover</option>
            <option value="Tata">Tata Motors</option>
            <option value="Mahindra">Mahindra</option>
            <option value="Skoda">Skoda</option>
          </select>

          <select
            value={cb360UpcomingBodyType}
            onChange={(e) => setCb360UpcomingBodyType(e.target.value)}
          >
            <option value="All Body Types">Select Body Type</option>
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Coupe">Coupe</option>
            <option value="Convertible">Convertible</option>
            <option value="Electric">Electric (EV)</option>
          </select>

          <select
            value={cb360UpcomingBudget}
            onChange={(e) => setCb360UpcomingBudget(e.target.value)}
          >
            <option value="All Prices">Expected Price</option>
            <option value="Under 15 Lakh">Under ₹ 15 Lakh</option>
            <option value="15 - 35 Lakh">₹ 15 - 35 Lakh</option>
            <option value="35 - 60 Lakh">₹ 35 - 60 Lakh</option>
            <option value="Above 60 Lakh">Above ₹ 60 Lakh</option>
          </select>

          <button
            type="button"
            className="cb360-btn-find-cars"
            onClick={() => showToast(`Filtered upcoming cars: ${cb360UpcomingBrand} • ${cb360UpcomingBodyType}`)}
          >
            <span>Find Cars</span>
          </button>
        </div>

        <div className="launch-order-link-wrap">
          <button
            type="button"
            className="cb360-launch-order-btn"
            onClick={() => {
              setLaunchOrder(launchOrder === 'sooner' ? 'later' : 'sooner');
              showToast(`Sorted by Launch Date: ${launchOrder === 'sooner' ? 'Launching Later First' : 'Launching Sooner First'}`);
            }}
          >
            <i className="fa-solid fa-calendar-days"></i>
            <span>Launch Date: {launchOrder === 'sooner' ? 'Sooner ▾' : 'Later ▾'}</span>
          </button>
        </div>
      </div>

      {/* 5. Two-Column Layout (Matching Images 3 & 4) */}
      <div className="cb360-image2-layout">
        {/* LEFT / MAIN COLUMN: UPCOMING PROTOTYPES */}
        <div className="cb360-image2-main-col">
          <div className="cb360-cards-container">
            {upcomingVehicles.map((veh, index) => (
              <React.Fragment key={veh.id}>
                {/* Horizontal Prototype / Camouflaged Card */}
                <div className="cb360-horizontal-card upcoming-card animate-fade-in">
                  <div className="cb360-card-media">
                    <img src={veh.image} alt={veh.name} loading="lazy" />
                    <span className="cb360-prototype-badge">
                      <i className="fa-solid fa-camera"></i> Spy Shot
                    </span>
                  </div>

                  <div className="cb360-card-content">
                    <div className="cb360-card-head-row">
                      <div className="cb360-name-block">
                        <h3 className="cb360-car-name">{veh.name}</h3>
                        <span className="cb360-tag-pill upcoming">Upcoming</span>
                        {veh.badgeTag && veh.badgeTag !== 'Upcoming' && (
                          <span className={`cb360-tag-pill ${veh.badgeTag.toLowerCase()}`}>
                            {veh.badgeTag}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="cb360-heart-fav"
                        onClick={() => showToast(`Added ${veh.name} to Launch Watchlist`)}
                        title="Add to Watchlist"
                      >
                        <i className="fa-regular fa-heart"></i>
                      </button>
                    </div>

                    <div className="cb360-upcoming-date-row">
                      <i className="fa-regular fa-calendar-check"></i>
                      <span><strong>Expected Launch:</strong> {veh.launchDate || 'Late 2026 (Tentative)'}</span>
                    </div>

                    <div className="cb360-specs-row">
                      <span className="cb360-spec-col"><i className="fa-solid fa-gas-pump"></i> <span>{veh.fuel}</span></span>
                      <span className="cb360-spec-col"><i className="fa-solid fa-gears"></i> <span>{veh.transmission || 'Automatic'}</span></span>
                      <span className="cb360-spec-col"><i className="fa-solid fa-users"></i> <span>{veh.seating || '5 Seater SUV'}</span></span>
                    </div>

                    <div className="cb360-card-bottom-row">
                      <div className="cb360-price-wrap">
                        <span className="cb360-price-tag">{veh.priceRange}</span>
                        <span className="cb360-price-sub">Expected Ex-Showroom</span>
                      </div>
                      <button
                        type="button"
                        className="cb360-btn-notify-launch"
                        onClick={() => showToast(`🔔 Launch Alert Activated for ${veh.name}! We will notify you via SMS & WhatsApp when bookings open.`)}
                      >
                        <i className="fa-regular fa-bell"></i>
                        <span>Notify Me on Launch</span>
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chetak leaderboard ad every 3 cards */}
                {(index + 1) % 3 === 0 && index + 1 < upcomingVehicles.length && (
                  <Carbike360ChetakLeaderboardAd showToast={showToast} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR (Matching Images 3 & 4) */}
        <aside className="cb360-image2-sidebar">
          {/* 1. Square Chetak Ad */}
          <div className="cb360-square-ad-box" onClick={() => showToast('Opened Chetak Sport Mode Offer')}>
            <div className="ad-badge-top">Sponsored</div>
            <img
              src="https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=400&q=80"
              alt="Chetak Ad"
            />
            <div className="ad-square-copy">
              <h5>STAY TECHPROOF</h5>
              <p>SPORT MODE • Starting ₹ 99,800/-</p>
            </div>
          </div>

          {/* 2. Upcoming Cars by Brand */}
          <div className="cb360-sidebar-brands-card">
            <h4>Upcoming Cars by Brand</h4>
            <div className="cb360-brands-3x3-grid">
              {[
                { name: 'Maruti', icon: 'fa-car' },
                { name: 'Hyundai', icon: 'fa-bolt' },
                { name: 'Honda', icon: 'fa-road' },
                { name: 'Tata', icon: 'fa-shield-halved' },
                { name: 'Mahindra', icon: 'fa-truck-pickup' },
                { name: 'Renault', icon: 'fa-gem' },
                { name: 'Nissan', icon: 'fa-compass' },
                { name: 'Skoda', icon: 'fa-award' },
                { name: 'Toyota', icon: 'fa-crown' },
              ].map(b => (
                <div
                  key={b.name}
                  className="cb360-brand-tile"
                  onClick={() => {
                    setCb360UpcomingBrand(b.name);
                    showToast(`Filtered upcoming cars for ${b.name}`);
                  }}
                >
                  <div className="brand-tile-icon"><i className={`fa-solid ${b.icon}`}></i></div>
                  <span className="brand-tile-name">{b.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Upcoming Cars by Body Type (Image 3 Reference) */}
          <div className="cb360-sidebar-section-card">
            <h4>Upcoming Cars by Body Type</h4>
            <div className="cb360-bodytype-grid">
              {[
                { type: 'SUV', icon: 'fa-truck-monster' },
                { type: 'MUV', icon: 'fa-van-shuttle' },
                { type: 'Sedan', icon: 'fa-car' },
                { type: 'Hatchback', icon: 'fa-car-side' },
                { type: 'Coupe', icon: 'fa-car-rear' },
                { type: 'Convertible', icon: 'fa-sun' },
              ].map(bt => (
                <div
                  key={bt.type}
                  className={`cb360-bodytype-tile ${cb360UpcomingBodyType === bt.type ? 'active' : ''}`}
                  onClick={() => {
                    setCb360UpcomingBodyType(bt.type);
                    showToast(`Filtered upcoming cars by ${bt.type}`);
                  }}
                >
                  <i className={`fa-solid ${bt.icon}`}></i>
                  <span>{bt.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Popular Cars in India (Image 3 Reference) */}
          <div className="cb360-sidebar-section-card">
            <h4>Popular Cars in India</h4>
            <div className="cb360-popular-mini-list">
              {[
                { name: 'Maruti Brezza', price: '₹ 8.34 - 14.14 Lakh', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=150&q=80' },
                { name: 'Hyundai Creta', price: '₹ 11.00 - 20.15 Lakh', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=150&q=80' },
                { name: 'Maruti Baleno', price: '₹ 6.66 - 9.88 Lakh', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=150&q=80' },
                { name: 'Kia Seltos', price: '₹ 10.90 - 20.35 Lakh', img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=150&q=80' },
                { name: 'Mahindra Thar Roxx', price: '₹ 12.99 - 22.49 Lakh', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=150&q=80' },
              ].map(car => (
                <div key={car.name} className="cb360-mini-car-item" onClick={() => showToast(`Selected ${car.name}`)}>
                  <img src={car.img} alt={car.name} />
                  <div className="mini-car-info">
                    <span className="mini-car-name">{car.name}</span>
                    <span className="mini-car-price">{car.price}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right mini-arrow"></i>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Tall Chetak Vertical Ad */}
          <Carbike360ChetakSidebarAd showToast={showToast} />
        </aside>
      </div>

      {/* 6. BOTTOM SECTIONS: Pick the Right Car for You (Images 3 & 4 Reference) */}
      <div className="cb360-pick-right-section">
        <div className="pick-right-head">
          <h3>Pick the Right Car for You</h3>
          <p>Choose your preferred filter criteria below to find the best matching car in India</p>
        </div>

        {/* Tab Pills matching Images 3 & 4 */}
        <div className="pick-right-tabs-row">
          {[
            { id: 'brand', label: 'BRAND' },
            { id: 'budget', label: 'BUDGET' },
            { id: 'body', label: 'BODY TYPE' },
            { id: 'fuel', label: 'FUEL TYPE' },
            { id: 'transmission', label: 'TRANSMISSION TYPE' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`pick-tab-btn ${pickRightTab === tab.id ? 'active' : ''}`}
              onClick={() => setPickRightTab(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Brand Grid for 'brand' tab */}
        <div className="pick-right-grid animate-fade-in">
          {[
            { name: 'Maruti Suzuki', icon: 'fa-car' },
            { name: 'Hyundai', icon: 'fa-bolt' },
            { name: 'Honda', icon: 'fa-road' },
            { name: 'Tata', icon: 'fa-shield-halved' },
            { name: 'Mahindra', icon: 'fa-truck-pickup' },
            { name: 'Renault', icon: 'fa-gem' },
          ].map(b => (
            <div
              key={b.name}
              className="pick-brand-card"
              onClick={() => showToast(`Selected ${b.name} cars`)}
            >
              <div className="brand-circle-logo"><i className={`fa-solid ${b.icon}`}></i></div>
              <span className="brand-lbl">{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Bottom Chetak Leaderboard Ad */}
      <Carbike360ChetakLeaderboardAd showToast={showToast} />

      {/* 8. FAQs — Upcoming Cars in India 2026/2027 Accordion (Strictly matching Images 3 & 4) */}
      <div className="cb360-faqs-section">
        <h3 className="cb360-faqs-title">FAQs — Upcoming Cars in India 2026/2027</h3>
        <div className="cb360-faqs-accordion">
          {UPCOMING_CARS_FAQS.map((faq, index) => {
            const isOpen = cb360FaqOpenIndex === index;
            return (
              <div key={index} className={`cb360-faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="cb360-faq-question-btn"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="faq-question-text">{faq.q}</span>
                  <i className={`fa-solid ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} faq-chevron`}></i>
                </button>
                {isOpen && (
                  <div className="cb360-faq-answer animate-fade-in">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6. VIEW 4: 100% ELECTRIC VEHICLES CATALOG                          */
/* ------------------------------------------------------------------ */

interface ElectricViewProps {
  userLocationCity: string;
  onSelectOnRoadPrice: (v: VehicleShowcaseItem) => void;
  onBackToPortal: () => void;
  showToast: (msg: string) => void;
}

export function Carbike360ElectricView({
  userLocationCity,
  onSelectOnRoadPrice,
  onBackToPortal,
  showToast
}: ElectricViewProps) {
  const evList = useMemo(() => {
    return VEHICLE_SHOWCASE_DATA.filter(v =>
      v.type === 'EV' || v.status === 'electric' || v.fuel.toLowerCase().includes('electric') || v.fuel.toLowerCase().includes('ev')
    );
  }, []);

  return (
    <div className="cb360-page-container animate-fade-in">
      <div className="cb360-breadcrumb-row">
        <div className="cb360-crumbs-list">
          <span className="crumb-link" onClick={onBackToPortal}>Home</span>
          <i className="fa-solid fa-chevron-right crumb-sep"></i>
          <span className="crumb-current">⚡ 100% Electric Vehicles in India</span>
        </div>
        <button type="button" className="cb360-back-portal-btn" onClick={onBackToPortal}>
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Portal Overview</span>
        </button>
      </div>

      <Carbike360ChetakLeaderboardAd showToast={showToast} />

      <div className="cb360-page-header-card">
        <h1 className="cb360-page-title">⚡ 100% Electric Vehicles in India</h1>
        <p className="cb360-page-desc">
          Compare verified battery capacities (kWh), fast DC charging times, real-world driving range, and state subsidy benefits across {evList.length} electric cars, SUVs and two-wheelers in India.
        </p>
      </div>

      <div className="cb360-cards-container">
        {evList.map(veh => (
          <div key={veh.id} className="cb360-horizontal-card animate-fade-in">
            <div className="cb360-card-media">
              <img src={veh.image} alt={veh.name} loading="lazy" />
              <span className="cb360-tag-pill electric"><i className="fa-solid fa-bolt"></i> EV</span>
            </div>
            <div className="cb360-card-content">
              <div className="cb360-card-head-row">
                <div className="cb360-name-block">
                  <h3 className="cb360-car-name">{veh.name}</h3>
                  <span className="cb360-tag-pill electric">Zero Tailpipe Emission</span>
                </div>
                <span className="cb360-star-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
              </div>
              <div className="cb360-specs-row">
                <span className="cb360-spec-col"><i className="fa-solid fa-battery-full"></i> <span>{veh.fuel}</span></span>
                <span className="cb360-spec-col"><i className="fa-solid fa-gauge-high"></i> <span>{veh.mileage}</span></span>
                <span className="cb360-spec-col"><i className="fa-solid fa-bolt"></i> <span>Fast Charge Ready</span></span>
              </div>
              <div className="cb360-card-bottom-row">
                <div className="cb360-price-wrap">
                  <span className="cb360-price-tag">{veh.priceRange}</span>
                  <span className="cb360-price-sub">State Subsidy Applicable</span>
                </div>
                <button
                  type="button"
                  className="cb360-btn-onroad"
                  onClick={() => onSelectOnRoadPrice(veh)}
                >
                  <span>Get on-road price</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 7. VIEW 5: TRENDING VEHICLES IN INDIA                              */
/* ------------------------------------------------------------------ */

export function Carbike360TrendingView({
  userLocationCity,
  onSelectOnRoadPrice,
  onBackToPortal,
  showToast
}: {
  userLocationCity: string;
  onSelectOnRoadPrice: (v: VehicleShowcaseItem) => void;
  onBackToPortal: () => void;
  showToast: (msg: string) => void;
}) {
  const trendingList = useMemo(() => {
    return VEHICLE_SHOWCASE_DATA.filter(v => v.rating >= 4.8);
  }, []);

  return (
    <div className="cb360-page-container animate-fade-in">
      <div className="cb360-breadcrumb-row">
        <div className="cb360-crumbs-list">
          <span className="crumb-link" onClick={onBackToPortal}>Home</span>
          <i className="fa-solid fa-chevron-right crumb-sep"></i>
          <span className="crumb-current">🔥 Trending Vehicles in India</span>
        </div>
        <button type="button" className="cb360-back-portal-btn" onClick={onBackToPortal}>
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Portal Overview</span>
        </button>
      </div>

      <div className="cb360-page-header-card">
        <h1 className="cb360-page-title">🔥 Trending Vehicles in India</h1>
        <p className="cb360-page-desc">
          Top searched cars, motorcycles, commercial trucks and tractors with high booking interest and lowest waiting times in {userLocationCity}.
        </p>
      </div>

      <div className="cb360-cards-container">
        {trendingList.map((veh, i) => (
          <div key={veh.id} className="cb360-horizontal-card animate-fade-in">
            <div className="cb360-card-media">
              <img src={veh.image} alt={veh.name} loading="lazy" />
              <span className="cb360-tag-pill trending">#{i + 1} Trending</span>
            </div>
            <div className="cb360-card-content">
              <div className="cb360-card-head-row">
                <div className="cb360-name-block">
                  <h3 className="cb360-car-name">{veh.name}</h3>
                  <span className="cb360-veh-brand-sub">{veh.brand} • {veh.type}</span>
                </div>
                <span className="cb360-star-pill"><i className="fa-solid fa-star"></i> {veh.rating}</span>
              </div>
              <div className="cb360-specs-row">
                <span className="cb360-spec-col"><i className="fa-solid fa-gas-pump"></i> <span>{veh.fuel}</span></span>
                <span className="cb360-spec-col"><i className="fa-solid fa-gauge-high"></i> <span>{veh.mileage}</span></span>
                <span className="cb360-spec-col"><i className="fa-solid fa-clock"></i> <span>Waiting: 2-4 Weeks</span></span>
              </div>
              <div className="cb360-card-bottom-row">
                <div className="cb360-price-wrap">
                  <span className="cb360-price-tag">{veh.priceRange}</span>
                </div>
                <button
                  type="button"
                  className="cb360-btn-onroad"
                  onClick={() => onSelectOnRoadPrice(veh)}
                >
                  <span>Get on-road price</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 8. VIEW 6: CERTIFIED USED VEHICLES CATALOG                         */
/* ------------------------------------------------------------------ */

export function Carbike360UsedCatalogView({
  cardekhoSelectedType = 'All',
  setCardekhoSelectedType,
  userLocationCity,
  setUserLocationCity,
  cardekhoCityFilter,
  setCardekhoCityFilter,
  onBackToPortal,
  showToast
}: {
  cardekhoSelectedType?: string;
  setCardekhoSelectedType?: (t: string) => void;
  userLocationCity: string;
  setUserLocationCity: (c: string) => void;
  cardekhoCityFilter: string;
  setCardekhoCityFilter: (c: string) => void;
  onBackToPortal: () => void;
  showToast: (msg: string) => void;
}) {
  // Local Filter States for Used Vehicles
  const [usedPriceRange, setUsedPriceRange] = useState<'all' | 'under_5' | '5_10' | '10_20' | 'above_20'>('all');
  const [usedBrandSearch, setUsedBrandSearch] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [selectedKmRange, setSelectedKmRange] = useState<'all' | 'under_25' | 'under_50' | 'above_50'>('all');
  const [usedSortBy, setUsedSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'kms_low' | 'year_new'>('popular');

  // Categories list matching user's requested vehicles (Car, Bike, Truck/Lorry, Bus, Van, Tractor, Auto, EV)
  const VEHICLE_CATEGORIES = [
    { id: 'All', label: 'All Used Vehicles', icon: 'fa-layer-group' },
    { id: 'Car', label: 'Cars & SUVs', icon: 'fa-car-side' },
    { id: 'Bike', label: 'Bikes & Scooters', icon: 'fa-motorcycle' },
    { id: 'Lorry', label: 'Commercial Trucks', icon: 'fa-truck-moving' },
    { id: 'Bus', label: 'Passenger Buses', icon: 'fa-bus-simple' },
    { id: 'Van', label: 'Vans & Commercial', icon: 'fa-van-shuttle' },
    { id: 'Tractor', label: 'Agri Tractors', icon: 'fa-tractor' },
    { id: 'Auto', label: '3-Wheelers & Auto', icon: 'fa-taxi' },
    { id: 'EV', label: 'Electric Vehicles (EV)', icon: 'fa-bolt' },
  ];

  // Dynamic label based on active category
  const activeCategoryLabel = useMemo(() => {
    const match = VEHICLE_CATEGORIES.find(c => c.id === cardekhoSelectedType);
    return match ? match.label : 'Certified Pre-Owned Vehicles';
  }, [cardekhoSelectedType]);

  // Dynamic available brands based on vehicles in selected category
  const availableBrands = useMemo(() => {
    const brandsMap: { [b: string]: number } = {};
    VEHICLE_SHOWCASE_DATA.forEach(v => {
      if (v.status !== 'used') return;
      if (cardekhoSelectedType !== 'All') {
        if (cardekhoSelectedType === 'EV') {
          const isEv = v.type === 'EV' || v.fuel.toLowerCase().includes('electric');
          if (!isEv) return;
        } else if (v.type !== cardekhoSelectedType) {
          return;
        }
      }
      brandsMap[v.brand] = (brandsMap[v.brand] || 0) + 1;
    });

    const list = Object.keys(brandsMap).map(b => ({ name: b, count: brandsMap[b] }));
    if (!usedBrandSearch.trim()) return list;
    return list.filter(b => b.name.toLowerCase().includes(usedBrandSearch.toLowerCase()));
  }, [cardekhoSelectedType, usedBrandSearch]);

  // Filtered Used Vehicles
  const filteredVehicles = useMemo(() => {
    return VEHICLE_SHOWCASE_DATA.filter(v => {
      // Must be certified used
      if (v.status !== 'used') return false;

      // Filter by vehicle type
      if (cardekhoSelectedType !== 'All') {
        if (cardekhoSelectedType === 'EV') {
          const isEv = v.type === 'EV' || v.fuel.toLowerCase().includes('electric');
          if (!isEv) return false;
        } else if (v.type !== cardekhoSelectedType) {
          return false;
        }
      }

      // Filter by city
      if (cardekhoCityFilter && cardekhoCityFilter !== 'All Cities') {
        const cityLower = cardekhoCityFilter.toLowerCase();
        const locLower = (v.location || '').toLowerCase();
        if (!locLower.includes(cityLower)) {
          // If city filter doesn't match location, don't strictly hide if city not set on vehicle
          if (v.location) return false;
        }
      }

      // Filter by budget price
      if (usedPriceRange !== 'all') {
        const p = v.priceRaw || 0;
        if (usedPriceRange === 'under_5' && p > 5) return false;
        if (usedPriceRange === '5_10' && (p < 5 || p > 10)) return false;
        if (usedPriceRange === '10_20' && (p < 10 || p > 20)) return false;
        if (usedPriceRange === 'above_20' && p < 20) return false;
      }

      // Filter by brand
      if (selectedBrands.length > 0) {
        const match = selectedBrands.some(b => v.brand.toLowerCase() === b.toLowerCase());
        if (!match) return false;
      }

      // Filter by Fuel
      if (selectedFuels.length > 0) {
        const fuelLower = v.fuel.toLowerCase();
        const match = selectedFuels.some(f => fuelLower.includes(f.toLowerCase()));
        if (!match) return false;
      }

      // Filter by Transmission
      if (selectedTransmissions.length > 0) {
        const transText = `${v.transmission || ''} ${v.fuel || ''} ${(v.features || []).join(' ')}`.toLowerCase();
        const match = selectedTransmissions.some(t => transText.includes(t.toLowerCase()));
        if (!match) return false;
      }

      // Filter by Owners
      if (selectedOwners.length > 0) {
        const ownerLower = (v.owners || '1st Owner').toLowerCase();
        const match = selectedOwners.some(o => ownerLower.includes(o.toLowerCase()));
        if (!match) return false;
      }

      // Filter by Kms
      if (selectedKmRange !== 'all') {
        const kmNum = parseInt((v.kmsDriven || '0').replace(/[^0-9]/g, ''), 10) || 0;
        if (selectedKmRange === 'under_25' && kmNum > 25000) return false;
        if (selectedKmRange === 'under_50' && kmNum > 50000) return false;
        if (selectedKmRange === 'above_50' && kmNum < 50000) return false;
      }

      return true;
    }).sort((a, b) => {
      if (usedSortBy === 'price_low') return (a.priceRaw || 0) - (b.priceRaw || 0);
      if (usedSortBy === 'price_high') return (b.priceRaw || 0) - (a.priceRaw || 0);
      if (usedSortBy === 'year_new') {
        const ya = parseInt(a.year || '2020', 10);
        const yb = parseInt(b.year || '2020', 10);
        return yb - ya;
      }
      if (usedSortBy === 'kms_low') {
        const ka = parseInt((a.kmsDriven || '0').replace(/[^0-9]/g, ''), 10) || 0;
        const kb = parseInt((b.kmsDriven || '0').replace(/[^0-9]/g, ''), 10) || 0;
        return ka - kb;
      }
      // default: popular / rating
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [cardekhoSelectedType, cardekhoCityFilter, usedPriceRange, selectedBrands, selectedFuels, selectedTransmissions, selectedOwners, selectedKmRange, usedSortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleFuel = (fuel: string) => {
    setSelectedFuels(prev =>
      prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]
    );
  };

  const toggleTransmission = (trans: string) => {
    setSelectedTransmissions(prev =>
      prev.includes(trans) ? prev.filter(t => t !== trans) : [...prev, trans]
    );
  };

  const toggleOwner = (owner: string) => {
    setSelectedOwners(prev =>
      prev.includes(owner) ? prev.filter(o => o !== owner) : [...prev, owner]
    );
  };

  const clearAllFilters = () => {
    setUsedPriceRange('all');
    setSelectedBrands([]);
    setSelectedFuels([]);
    setSelectedTransmissions([]);
    setSelectedOwners([]);
    setSelectedKmRange('all');
    setUsedBrandSearch('');
    showToast('Reset all filters to default');
  };

  return (
    <div className="cb360-page-container animate-fade-in">
      {/* 1. Breadcrumb Row */}
      <div className="cb360-breadcrumb-row">
        <div className="cb360-crumbs-list">
          <span className="crumb-link" onClick={onBackToPortal}>Home</span>
          <i className="fa-solid fa-chevron-right crumb-sep"></i>
          <span className="crumb-link" onClick={onBackToPortal}>Used Vehicles</span>
          <i className="fa-solid fa-chevron-right crumb-sep"></i>
          <span className="crumb-current">Used {activeCategoryLabel} in {userLocationCity}</span>
        </div>
        <button type="button" className="cb360-back-portal-btn" onClick={onBackToPortal}>
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Store Portal</span>
        </button>
      </div>

      {/* 2. Top Vehicle Category Selector Pills (Strictly satisfies user request: Car, Bike, Truck, etc.) */}
      <div className="cb360-category-scroll-wrap animate-fade-in">
        <span className="category-row-label">
          <i className="fa-solid fa-filter"></i> Select Vehicle:
        </span>
        <div className="category-pills-scroll">
          {VEHICLE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`cb360-cat-pill ${cardekhoSelectedType === cat.id ? 'active' : ''}`}
              onClick={() => {
                if (setCardekhoSelectedType) setCardekhoSelectedType(cat.id);
                showToast(`Filtered by ${cat.label}`);
              }}
            >
              <i className={`fa-solid ${cat.icon}`}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Page Header Card with City Dropdown */}
      <div className="cb360-page-header-card">
        <div className="cb360-header-flex-row">
          <div>
            <h1 className="cb360-page-title">
              Certified Used {activeCategoryLabel} in {userLocationCity}
            </h1>
            <p className="cb360-page-desc">
              All vehicles inspected across 210 checkpoints. Guaranteed non-accidental, verified RC ownership, 1-year SART comprehensive warranty, and 7-day money-back guarantee.
            </p>
          </div>
          <div className="cb360-city-selector-box">
            <label><i className="fa-solid fa-location-dot"></i> City:</label>
            <select
              value={cardekhoCityFilter}
              onChange={(e) => {
                setCardekhoCityFilter(e.target.value);
                if (e.target.value !== 'All Cities') setUserLocationCity(e.target.value);
              }}
            >
              {['All Cities', 'Chennai', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Coimbatore', 'Pune'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Layout (Matching Third Reference Image) */}
      <div className="cb360-two-col-layout">
        {/* LEFT COLUMN: FILTERS SIDEBAR */}
        <aside className="cb360-filter-sidebar animate-fade-in">
          <div className="cb360-sidebar-header">
            <h4><i className="fa-solid fa-sliders"></i> Filters</h4>
            {(usedPriceRange !== 'all' || selectedBrands.length > 0 || selectedFuels.length > 0 || selectedTransmissions.length > 0 || selectedOwners.length > 0 || selectedKmRange !== 'all') && (
              <button type="button" className="cb360-clear-btn" onClick={clearAllFilters}>
                Clear All
              </button>
            )}
          </div>

          {/* Budget / Price Histogram Filter */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-indian-rupee-sign"></i> Budget
            </label>
            <div className="cb360-pills-grid">
              {[
                { id: 'all', label: 'All Budgets' },
                { id: 'under_5', label: 'Under ₹5 Lakh' },
                { id: '5_10', label: '₹5 - 10 Lakh' },
                { id: '10_20', label: '₹10 - 20 Lakh' },
                { id: 'above_20', label: 'Above ₹20 Lakh' }
              ].map(b => (
                <button
                  key={b.id}
                  type="button"
                  className={`cb360-pill-btn ${usedPriceRange === b.id ? 'active' : ''}`}
                  onClick={() => setUsedPriceRange(b.id as any)}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* KM Driven Filter */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-road"></i> KM Driven
            </label>
            <div className="cb360-pills-grid">
              {[
                { id: 'all', label: 'Any KM' },
                { id: 'under_25', label: 'Under 25,000 km' },
                { id: 'under_50', label: 'Under 50,000 km' },
                { id: 'above_50', label: '50,000+ km' }
              ].map(k => (
                <button
                  key={k.id}
                  type="button"
                  className={`cb360-pill-btn ${selectedKmRange === k.id ? 'active' : ''}`}
                  onClick={() => setSelectedKmRange(k.id as any)}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brands with Search Bar */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-tags"></i> Brands ({availableBrands.length})
            </label>
            <div className="cb360-brand-search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search brand (e.g. Tata, Maruti)..."
                value={usedBrandSearch}
                onChange={(e) => setUsedBrandSearch(e.target.value)}
              />
            </div>
            <div className="cb360-checkbox-scroll-list">
              {availableBrands.map(b => (
                <label key={b.name} className="cb360-checkbox-row">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b.name)}
                    onChange={() => toggleBrand(b.name)}
                  />
                  <span className="brand-name">{b.name}</span>
                  <span className="brand-count">({b.count})</span>
                </label>
              ))}
              {availableBrands.length === 0 && (
                <span className="text-xs text-slate-400 py-1">No brands matching search</span>
              )}
            </div>
          </div>

          {/* Fuel Type Filter */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-gas-pump"></i> Fuel Type
            </label>
            <div className="cb360-pills-grid">
              {['Petrol', 'Diesel', 'CNG', 'Electric'].map(f => (
                <button
                  key={f}
                  type="button"
                  className={`cb360-pill-btn ${selectedFuels.includes(f) ? 'active' : ''}`}
                  onClick={() => toggleFuel(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission Filter */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-gears"></i> Transmission
            </label>
            <div className="cb360-pills-grid">
              {['Manual', 'Automatic'].map(t => (
                <button
                  key={t}
                  type="button"
                  className={`cb360-pill-btn ${selectedTransmissions.includes(t) ? 'active' : ''}`}
                  onClick={() => toggleTransmission(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Owners Filter */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-user-check"></i> Ownership
            </label>
            <div className="cb360-pills-grid">
              {['1st Owner', '2nd Owner'].map(o => (
                <button
                  key={o}
                  type="button"
                  className={`cb360-pill-btn ${selectedOwners.includes(o) ? 'active' : ''}`}
                  onClick={() => toggleOwner(o)}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical Chetak Sidebar Banner Ad (matching reference) */}
          <div
            className="cb360-sidebar-ad-card animate-fade-in"
            onClick={() => showToast('Opening Bajaj Chetak Sport Electric booking portal')}
          >
            <div className="cb360-sidebar-ad-top">
              <span className="ad-sponsor-label">Featured EV</span>
              <div className="cb360-sidebar-chetak-logo">
                <span className="chetak-logo-text">Chetak</span>
                <span className="chetak-life-tag">FULLY LIFEPROOF</span>
              </div>
            </div>
            <div className="cb360-sidebar-ad-image-box">
              <img
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80"
                alt="Bajaj Chetak EV"
                loading="lazy"
              />
              <div className="cb360-sidebar-ad-overlay">
                <span className="ad-pill-badge"><i className="fa-solid fa-bolt"></i> ZERO EMISSION</span>
                <span className="ad-pill-badge map"><i className="fa-solid fa-gauge-high"></i> 80 KM/H</span>
              </div>
            </div>
            <div className="cb360-sidebar-ad-footer">
              <div className="ad-price-group">
                <span className="label">STARTING AT</span>
                <span className="price">₹ 99,800/-*</span>
              </div>
              <button type="button" className="btn-chetak-sidebar">
                <span>Explore</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: MAIN CATALOG LISTINGS */}
        <main className="cb360-catalog-col animate-fade-in">
          {/* Top Sort and Results Counter Bar */}
          <div className="cb360-catalog-top-bar">
            <div className="cb360-results-count">
              <span>Showing <strong>{filteredVehicles.length}</strong> Certified Used {activeCategoryLabel}</span>
            </div>
            <div className="cb360-sort-group">
              <label>Sort By:</label>
              <select
                value={usedSortBy}
                onChange={(e) => setUsedSortBy(e.target.value as any)}
              >
                <option value="popular">Popularity & Rating</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="kms_low">KM: Low to High</option>
                <option value="year_new">Model Year: Newest First</option>
              </select>
            </div>
          </div>

          {/* Cards List matching Third Image */}
          {filteredVehicles.length === 0 ? (
            <div className="cb360-empty-results">
              <i className="fa-solid fa-car-tunnel"></i>
              <h4>No used {activeCategoryLabel.toLowerCase()} match your active filters</h4>
              <p>Try resetting the price, brand, or KM filters to explore other certified pre-owned units.</p>
              <button type="button" className="cb360-btn-reset" onClick={clearAllFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="cb360-cards-container">
              {filteredVehicles.map((veh, index) => (
                <React.Fragment key={`${veh.id}-${index}`}>
                  {/* Wide Horizontal Card matching Third Image */}
                  <div className="cb360-horizontal-card animate-fade-in">
                    {/* Media Column (Left) */}
                    <div className="cb360-card-media">
                      <img src={veh.image} alt={veh.name} loading="lazy" />
                      <span className="cb360-photo-count-pill">
                        <i className="fa-regular fa-image"></i> 1/14 Photos
                      </span>
                      <span className="cb360-360-badge">
                        <i className="fa-solid fa-rotate"></i> 360° View
                      </span>
                      <span className="cb360-tag-pill used" style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                        <i className="fa-solid fa-shield-check"></i> Certified
                      </span>
                    </div>

                    {/* Content Column (Right) */}
                    <div className="cb360-card-content">
                      <div className="cb360-card-head-row">
                        <div className="cb360-name-block">
                          <h3 className="cb360-car-name">{veh.name}</h3>
                          <span className="cb360-tag-pill used">
                            <i className="fa-solid fa-circle-check text-sky-500"></i> Non-Accidental Verified
                          </span>
                        </div>
                        <div className="cb360-rating-block">
                          <span className="cb360-star-pill">
                            <i className="fa-solid fa-star"></i> {veh.rating}
                          </span>
                          <button
                            type="button"
                            className="cb360-heart-fav"
                            title="Save vehicle"
                            onClick={() => showToast(`Saved ${veh.name} to Shortlist!`)}
                          >
                            <i className="fa-regular fa-heart"></i>
                          </button>
                        </div>
                      </div>

                      {/* Specs Row with Icons (Year, KM, Owners, Fuel, Location) */}
                      <div className="cb360-specs-row">
                        <span className="cb360-spec-col">
                          <i className="fa-regular fa-calendar"></i>
                          <span>{veh.year || '2022'}</span>
                        </span>
                        <span className="cb360-spec-col">
                          <i className="fa-solid fa-road"></i>
                          <span>{veh.kmsDriven || '32,000 km'}</span>
                        </span>
                        <span className="cb360-spec-col">
                          <i className="fa-solid fa-user-check"></i>
                          <span>{veh.owners || '1st Owner'}</span>
                        </span>
                        <span className="cb360-spec-col">
                          <i className="fa-solid fa-gas-pump"></i>
                          <span>{veh.fuel}</span>
                        </span>
                        <span className="cb360-spec-col">
                          <i className="fa-solid fa-location-dot"></i>
                          <span>{veh.location || userLocationCity}</span>
                        </span>
                      </div>

                      {/* Key Inspection Highlights */}
                      <div className="cb360-features-preview">
                        {(veh.features || []).slice(0, 3).map((f, i) => (
                          <span key={i} className="cb360-feature-chip">
                            <i className="fa-solid fa-check"></i> {f}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Row: Price & CTA */}
                      <div className="cb360-card-bottom-row">
                        <div className="cb360-price-wrap">
                          <span className="cb360-price-tag">{veh.priceRange}</span>
                          <span className="cb360-price-sub">
                            Fixed Price • EMI from ₹{Math.round((veh.priceRaw || 5) * 1800).toLocaleString('en-IN')}/mo • 7-Day Money Back
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="cb360-btn-onroad"
                            onClick={() => showToast(`Inspection report sent for ${veh.name}`)}
                          >
                            <i className="fa-solid fa-file-lines"></i>
                            <span>210-Pt Report</span>
                          </button>
                          <button
                            type="button"
                            className="cb360-btn-notify-launch"
                            style={{ background: '#2563eb' }}
                            onClick={() => showToast(`Free Doorstep Test Drive booked for ${veh.name} in ${veh.location || userLocationCity}!`)}
                          >
                            <i className="fa-solid fa-car-side"></i>
                            <span>Book Free Test Drive</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interstitial Chetak Ad after every 3 items (matching reference image) */}
                  {(index + 1) % 3 === 0 && index < filteredVehicles.length - 1 && (
                    <div
                      className="cb360-interstitial-ad animate-fade-in"
                      onClick={() => showToast('Connecting to Bajaj Chetak EV Authorized Dealer')}
                    >
                      <div className="cb360-ad-left">
                        <span className="ad-badge-top">FEATURED EV</span>
                        <div className="ad-brand-row">
                          <span className="ad-brand-name">Chetak</span>
                          <span className="ad-badge-sport">SPORT MODE</span>
                        </div>
                        <span className="ad-promise">FULLY LIFEPROOF • TOP SPEED 80 KM/H • ZERO EMISSION</span>
                      </div>
                      <div className="cb360-ad-right">
                        <div className="ad-price-col">
                          <span className="ad-price-lbl">STARTING AT</span>
                          <span className="ad-price-val">₹ 99 800/-*</span>
                        </div>
                        <button type="button" className="btn-explore-chetak">
                          <span>Explore Chetak</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 9. VIEW 7: AUTHORIZED DEALERSHIPS & SHOWROOMS                      */
/* ------------------------------------------------------------------ */

export function Carbike360DealershipsView({
  userLocationCity,
  setUserLocationCity,
  onBackToPortal,
  showToast
}: {
  userLocationCity: string;
  setUserLocationCity: (c: string) => void;
  onBackToPortal: () => void;
  showToast: (msg: string) => void;
}) {
  const DEALERS = [
    { name: 'KUN United Hyundai', brand: 'Hyundai', address: 'GST Road, Guindy', phone: '+91 98401 22334', rating: 4.8, type: 'Sales & Service' },
    { name: 'Popular Maruti Nexa', brand: 'Maruti Suzuki', address: 'Anna Salai, Nandanam', phone: '+91 94440 55667', rating: 4.9, type: 'Nexa Premium' },
    { name: 'PPS Mahindra Hub', brand: 'Mahindra', address: 'Mount Poonamallee Rd, Porur', phone: '+91 97890 11223', rating: 4.75, type: 'SUV Specialist' },
    { name: 'FPL Tata Motors Arena', brand: 'Tata Motors', address: 'Old Mahabalipuram Rd, OMR', phone: '+91 91760 99887', rating: 4.85, type: 'Passenger & EV' },
    { name: 'Lanson Toyota Galleria', brand: 'Toyota', address: 'Koyambedu Wholesale Hub', phone: '+91 98840 77889', rating: 4.92, type: 'Authorized 3S' },
  ];

  return (
    <div className="cb360-page-container animate-fade-in">
      <div className="cb360-breadcrumb-row">
        <div className="cb360-crumbs-list">
          <span className="crumb-link" onClick={onBackToPortal}>Home</span>
          <i className="fa-solid fa-chevron-right crumb-sep"></i>
          <span className="crumb-current">Authorized Dealerships near {userLocationCity}</span>
        </div>
        <button type="button" className="cb360-back-portal-btn" onClick={onBackToPortal}>
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Portal Overview</span>
        </button>
      </div>

      <div className="cb360-page-header-card">
        <h1 className="cb360-page-title">Authorized Showrooms &amp; Dealers in {userLocationCity}</h1>
        <p className="cb360-page-desc">
          Locate certified OEM showrooms, test drive hubs and authorized service facilities with genuine warranties and festive cash discount benefits.
        </p>
      </div>

      <div className="cb360-dealers-grid">
        {DEALERS.map(d => (
          <div key={d.name} className="cb360-dealer-card animate-fade-in">
            <div className="dealer-head">
              <span className="dealer-brand-pill">{d.brand}</span>
              <span className="dealer-rating"><i className="fa-solid fa-star"></i> {d.rating}</span>
            </div>
            <h4>{d.name}</h4>
            <p className="dealer-addr"><i className="fa-solid fa-location-dot"></i> {d.address}, {userLocationCity}</p>
            <p className="dealer-phone"><i className="fa-solid fa-phone"></i> {d.phone}</p>
            <div className="dealer-actions">
              <button
                type="button"
                className="btn-dealer-contact"
                onClick={() => showToast(`Contacting ${d.name} at ${d.phone}`)}
              >
                <i className="fa-solid fa-phone-volume"></i>
                <span>Call Dealer</span>
              </button>
              <button
                type="button"
                className="btn-dealer-visit"
                onClick={() => showToast(`Directions sent to your phone for ${d.name}`)}
              >
                <i className="fa-solid fa-diamond-turn-right"></i>
                <span>Get Directions</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
