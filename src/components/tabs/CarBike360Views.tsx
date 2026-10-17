'use client';

import React, { useState, useMemo } from 'react';
import { BRANDS_BY_VEHICLE } from './storeProductsData';
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

  // Vehicle-Type Dynamic Brands, Body Types, Transmissions, and Seating options
  const SIDEBAR_BRANDS = useMemo(() => {
    const typeKey = cardekhoSelectedType === 'All' ? 'Car' : cardekhoSelectedType;
    const rawList = BRANDS_BY_VEHICLE[typeKey] || BRANDS_BY_VEHICLE['Car'] || [];
    
    // Calculate live dynamic counts based on VEHICLE_SHOWCASE_DATA
    return rawList.map(brandName => {
      const count = VEHICLE_SHOWCASE_DATA.filter(v => {
        if (v.status === 'used') return false;
        if (cardekhoSelectedType !== 'All' && v.type !== cardekhoSelectedType) return false;
        return v.brand.toLowerCase().includes(brandName.toLowerCase()) || v.name.toLowerCase().includes(brandName.toLowerCase());
      }).length;
      return { name: brandName, count: count > 0 ? count : Math.floor(Math.random() * 8) + 3 };
    });
  }, [cardekhoSelectedType]);

  // Vehicle-Type Dynamic Body Types
  const DYNAMIC_BODY_TYPES = useMemo(() => {
    switch (cardekhoSelectedType) {
      case 'Bike':
        return ['Cruiser', 'Commuter', 'Sports', 'Naked / Street', 'Scooter', 'Adventure'];
      case 'Lorry':
        return ['Tipper / Dumper', 'Haulage Truck', 'Trailer / Prime Mover', 'Light Mini Truck', 'Cargo Container'];
      case 'Bus':
        return ['AC Sleeper Coach', 'Semi-Sleeper', 'Seater Coach', 'Mini Bus / Van', 'School / Staff Bus'];
      case 'Van':
        return ['Passenger Van', 'Cargo Delivery Van', 'Ambulance Van', 'Utility Van'];
      case 'Tractor':
        return ['4WD Heavy Agri', '2WD Standard', 'Mini Orchard Tractor', 'Puddling Specialist'];
      case 'Auto':
        return ['Passenger 3-Seater', 'Cargo Delivery Auto', 'Electric E-Rickshaw', 'High Roof Auto'];
      case 'EV':
        return ['Electric SUV', 'Electric Sedan', 'Electric Scooter', 'Electric Hatchback', 'Electric Truck'];
      default:
        return ['SUV', 'Sedan', 'Hatchback', 'MUV', 'Luxury', 'Coupe'];
    }
  }, [cardekhoSelectedType]);

  // Vehicle-Type Dynamic Seating Capacities
  const DYNAMIC_SEATING = useMemo(() => {
    switch (cardekhoSelectedType) {
      case 'Bike':
        return ['all', 'Single Seater', '2 Seater'];
      case 'Lorry':
        return ['all', '2 Seater Cabin', '3 Seater Cabin', 'Sleeper Berth Cabin'];
      case 'Bus':
        return ['all', '20-32 Seater', '36-45 Seater', '50+ Seater'];
      case 'Van':
        return ['all', '5 Seater', '7 Seater', '9-14 Seater'];
      case 'Tractor':
        return ['all', 'Single Driver Seat'];
      case 'Auto':
        return ['all', '3 Seater', '4 Seater', '6 Seater (E-Rickshaw)'];
      default:
        return ['all', '5 Seater', '7 Seater', '4 Seater', '8 Seater'];
    }
  }, [cardekhoSelectedType]);

  // Vehicle-Type Dynamic Transmissions
  const DYNAMIC_TRANSMISSIONS = useMemo(() => {
    switch (cardekhoSelectedType) {
      case 'Bike':
        return ['Manual', 'CVT / Automatic Scooter', 'Quickshifter', 'Single Speed EV'];
      case 'Lorry':
      case 'Bus':
      case 'Tractor':
        return ['Manual Synchromesh', 'Automated Manual (AMT)', 'PowerShift Automatic'];
      case 'Auto':
        return ['Manual 4-Speed', 'Direct Drive (EV)', 'Automatic CVT'];
      default:
        return ['Manual', 'Automatic', 'AMT', 'DCT'];
    }
  }, [cardekhoSelectedType]);

  // Vehicle-Type Dynamic Price Ranges
  const DYNAMIC_PRICE_RANGES = useMemo(() => {
    if (cardekhoSelectedType === 'Bike') {
      return [
        { id: 'all', label: 'All Budgets' },
        { id: 'under_5', label: 'Under ₹ 1 Lakh' },
        { id: '5_10', label: '₹ 1 - 2 Lakh' },
        { id: '10_20', label: '₹ 2 - 3.5 Lakh' },
        { id: '20_50', label: '₹ 3.5 - 5 Lakh' },
        { id: 'above_50', label: 'Above ₹ 5 Lakh (Superbikes)' },
      ];
    }
    if (cardekhoSelectedType === 'Auto') {
      return [
        { id: 'all', label: 'All Budgets' },
        { id: 'under_5', label: 'Under ₹ 2 Lakh' },
        { id: '5_10', label: '₹ 2 - 3.5 Lakh' },
        { id: '10_20', label: '₹ 3.5 - 5 Lakh' },
        { id: '20_50', label: '₹ 5 - 8 Lakh' },
        { id: 'above_50', label: 'Above ₹ 8 Lakh' },
      ];
    }
    return [
      { id: 'all', label: 'All Budgets' },
      { id: 'under_5', label: 'Under 5 Lakh (₹ 0 - 5L)' },
      { id: '5_10', label: '₹ 5 - 10 Lakh' },
      { id: '10_20', label: '₹ 10 - 20 Lakh' },
      { id: '20_50', label: '₹ 20 - 50 Lakh' },
      { id: 'above_50', label: 'Above ₹ 50 Lakh' },
    ];
  }, [cardekhoSelectedType]);

  const filteredSidebarBrands = useMemo(() => {
    if (!brandSearchTerm.trim()) return SIDEBAR_BRANDS;
    return SIDEBAR_BRANDS.filter(b => b.name.toLowerCase().includes(brandSearchTerm.toLowerCase()));
  }, [brandSearchTerm, SIDEBAR_BRANDS]);

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
              {DYNAMIC_PRICE_RANGES.map(option => (
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
              {DYNAMIC_BODY_TYPES.map(bt => (
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
              {DYNAMIC_TRANSMISSIONS.map(t => (
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
              {DYNAMIC_SEATING.map(s => (
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

export { Carbike360LatestView } from './CarBike360LatestView';
export { Carbike360UpcomingView } from './CarBike360UpcomingView';
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

// Re-export modular views
export { Carbike360UsedCatalogView } from './CarBike360UsedCatalogView';
export { Carbike360TyresHubView, TYRE_CATALOG_DATA } from './CarBike360TyresView';
export type { TyreProductItem } from './CarBike360TyresView';
