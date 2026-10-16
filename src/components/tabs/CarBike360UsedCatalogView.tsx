'use client';

import React, { useState, useMemo } from 'react';
import {
  VehicleShowcaseItem,
  VEHICLE_SHOWCASE_DATA
} from './storeData';

export function Carbike360UsedCatalogView({
  userLocationCity,
  setUserLocationCity,
  cardekhoSelectedType,
  setCardekhoSelectedType,
  cardekhoCityFilter,
  setCardekhoCityFilter,
  onBackToPortal,
  showToast,
}: {
  userLocationCity: string;
  setUserLocationCity: (c: string) => void;
  cardekhoSelectedType: string;
  setCardekhoSelectedType?: (t: string) => void;
  cardekhoCityFilter: string;
  setCardekhoCityFilter: (c: string) => void;
  onBackToPortal: () => void;
  showToast: (msg: string) => void;
}) {
  // Cardekho-style 13 Comprehensive Left Sidebar Filters
  const [usedPriceRange, setUsedPriceRange] = useState<'all' | 'under_3' | '3_5' | '5_8' | '8_12' | '12_20' | 'above_20'>('all');
  const [usedBrandSearch, setUsedBrandSearch] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedKmRange, setSelectedKmRange] = useState<'all' | 'under_25' | 'under_50' | 'under_75' | 'above_75'>('all');
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
  const [sellerTypeFilter, setSellerTypeFilter] = useState<'all' | 'premium_only' | 'dealer' | 'individual'>('all');
  const [selectedRtos, setSelectedRtos] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [discountOnly, setDiscountOnly] = useState<boolean>(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [usedSortBy, setUsedSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'kms_low' | 'year_new'>('popular');

  // Categories list (Car, Bike, Lorry/Truck, Bus, Van, Tractor, Auto, EV)
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

  // Dynamic available models based on selected brands
  const availableModels = useMemo(() => {
    const modelsSet = new Set<string>();
    VEHICLE_SHOWCASE_DATA.forEach(v => {
      if (v.status !== 'used') return;
      if (cardekhoSelectedType !== 'All' && v.type !== cardekhoSelectedType && cardekhoSelectedType !== 'EV') return;
      if (selectedBrands.length > 0 && !selectedBrands.includes(v.brand)) return;
      if (v.model) modelsSet.add(v.model);
    });
    return Array.from(modelsSet);
  }, [cardekhoSelectedType, selectedBrands]);

  // Available RTOs in dataset
  const availableRtos = useMemo(() => {
    const rtoMap: { [r: string]: number } = {};
    VEHICLE_SHOWCASE_DATA.forEach(v => {
      if (v.status === 'used' && v.rto) {
        rtoMap[v.rto] = (rtoMap[v.rto] || 0) + 1;
      }
    });
    return Object.keys(rtoMap).map(r => ({ rto: r, count: rtoMap[r] }));
  }, []);

  // Filtered Used Vehicles with all 13 filters
  const filteredVehicles = useMemo(() => {
    return VEHICLE_SHOWCASE_DATA.filter(v => {
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
          if (v.location) return false;
        }
      }

      // 1. Budget Filter
      if (usedPriceRange !== 'all') {
        const p = v.priceRaw || 0;
        if (usedPriceRange === 'under_3' && p > 3) return false;
        if (usedPriceRange === '3_5' && (p < 3 || p > 5)) return false;
        if (usedPriceRange === '5_8' && (p < 5 || p > 8)) return false;
        if (usedPriceRange === '8_12' && (p < 8 || p > 12)) return false;
        if (usedPriceRange === '12_20' && (p < 12 || p > 20)) return false;
        if (usedPriceRange === 'above_20' && p < 20) return false;
      }

      // 2. Brand Filter
      if (selectedBrands.length > 0) {
        const match = selectedBrands.some(b => v.brand.toLowerCase() === b.toLowerCase());
        if (!match) return false;
      }

      // 3. Model Filter
      if (selectedModels.length > 0) {
        if (!v.model || !selectedModels.includes(v.model)) return false;
      }

      // 4. Model Year Filter
      if (selectedYears.length > 0) {
        if (!v.year || !selectedYears.includes(v.year)) return false;
      }

      // 5. Fuel Type Filter
      if (selectedFuels.length > 0) {
        const fuelLower = v.fuel.toLowerCase();
        const match = selectedFuels.some(f => fuelLower.includes(f.toLowerCase()));
        if (!match) return false;
      }

      // 6. Transmission Filter
      if (selectedTransmissions.length > 0) {
        const transText = `${v.transmission || ''} ${v.fuel || ''} ${(v.features || []).join(' ')}`.toLowerCase();
        const match = selectedTransmissions.some(t => transText.includes(t.toLowerCase()));
        if (!match) return false;
      }

      // 7. Kilometer Driven Filter
      if (selectedKmRange !== 'all') {
        const kmNum = parseInt((v.kmsDriven || '0').replace(/[^0-9]/g, ''), 10) || 0;
        if (selectedKmRange === 'under_25' && kmNum > 25000) return false;
        if (selectedKmRange === 'under_50' && (kmNum < 25000 || kmNum > 50000)) return false;
        if (selectedKmRange === 'under_75' && (kmNum < 50000 || kmNum > 75000)) return false;
        if (selectedKmRange === 'above_75' && kmNum < 75000) return false;
      }

      // 8. Ownership Filter
      if (selectedOwners.length > 0) {
        const ownerLower = (v.owners || '1st Owner').toLowerCase();
        const match = selectedOwners.some(o => ownerLower.includes(o.toLowerCase()));
        if (!match) return false;
      }

      // 9. Body Type Filter
      if (selectedBodyTypes.length > 0) {
        if (!v.bodyType || !selectedBodyTypes.some(bt => v.bodyType?.toLowerCase().includes(bt.toLowerCase()))) {
          return false;
        }
      }

      // 10. Premium Seller Filter
      if (sellerTypeFilter === 'premium_only') {
        if (v.sellerType !== 'Premium Seller') return false;
      } else if (sellerTypeFilter === 'dealer') {
        if (v.sellerType !== 'Dealer' && v.sellerType !== 'Premium Seller') return false;
      } else if (sellerTypeFilter === 'individual') {
        if (v.sellerType !== 'Individual') return false;
      }

      // 11. RTO Filter
      if (selectedRtos.length > 0) {
        if (!v.rto || !selectedRtos.some(r => v.rto?.includes(r))) return false;
      }

      // 12. Seats Filter
      if (selectedSeats.length > 0) {
        if (!v.seats || !selectedSeats.includes(v.seats)) return false;
      }

      // 13. Discount Filter
      if (discountOnly) {
        if (!v.discount) return false;
      }

      // 14. Color Filter
      if (selectedColors.length > 0) {
        if (!v.color || !selectedColors.includes(v.color)) return false;
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
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [
    cardekhoSelectedType, cardekhoCityFilter, usedPriceRange, selectedBrands, selectedModels,
    selectedYears, selectedFuels, selectedTransmissions, selectedKmRange, selectedOwners,
    selectedBodyTypes, sellerTypeFilter, selectedRtos, selectedSeats, discountOnly,
    selectedColors, usedSortBy
  ]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };
  const toggleModel = (model: string) => {
    setSelectedModels(prev => prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]);
  };
  const toggleYear = (year: string) => {
    setSelectedYears(prev => prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]);
  };
  const toggleFuel = (fuel: string) => {
    setSelectedFuels(prev => prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]);
  };
  const toggleTransmission = (trans: string) => {
    setSelectedTransmissions(prev => prev.includes(trans) ? prev.filter(t => t !== trans) : [...prev, trans]);
  };
  const toggleOwner = (owner: string) => {
    setSelectedOwners(prev => prev.includes(owner) ? prev.filter(o => o !== owner) : [...prev, owner]);
  };
  const toggleBodyType = (bType: string) => {
    setSelectedBodyTypes(prev => prev.includes(bType) ? prev.filter(b => b !== bType) : [...prev, bType]);
  };
  const toggleRto = (rto: string) => {
    setSelectedRtos(prev => prev.includes(rto) ? prev.filter(r => r !== rto) : [...prev, rto]);
  };
  const toggleSeats = (seat: number) => {
    setSelectedSeats(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
  };
  const toggleColor = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const clearAllFilters = () => {
    setUsedPriceRange('all');
    setSelectedBrands([]);
    setSelectedModels([]);
    setSelectedYears([]);
    setSelectedFuels([]);
    setSelectedTransmissions([]);
    setSelectedKmRange('all');
    setSelectedOwners([]);
    setSelectedBodyTypes([]);
    setSellerTypeFilter('all');
    setSelectedRtos([]);
    setSelectedSeats([]);
    setDiscountOnly(false);
    setSelectedColors([]);
    setUsedBrandSearch('');
    showToast('Reset all filters to default');
  };

  const hasActiveFilters =
    usedPriceRange !== 'all' ||
    selectedBrands.length > 0 ||
    selectedModels.length > 0 ||
    selectedYears.length > 0 ||
    selectedFuels.length > 0 ||
    selectedTransmissions.length > 0 ||
    selectedKmRange !== 'all' ||
    selectedOwners.length > 0 ||
    selectedBodyTypes.length > 0 ||
    sellerTypeFilter !== 'all' ||
    selectedRtos.length > 0 ||
    selectedSeats.length > 0 ||
    discountOnly ||
    selectedColors.length > 0;

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

      {/* 2. Top Vehicle Category Selector Pills (Car, Bike, Truck, etc.) */}
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

      {/* 4. Two-Column Layout (Matching User Image: Left Cardekho Sidebar + Right Grid/Horizontal Cards) */}
      <div className="cb360-two-col-layout">
        {/* LEFT COLUMN: CARDEKHO 13 FILTER OPTIONS */}
        <aside className="cb360-filter-sidebar cardekho-filter-sidebar animate-fade-in">
          <div className="cb360-sidebar-header">
            <h4><i className="fa-solid fa-sliders"></i> Filters</h4>
            {hasActiveFilters && (
              <button type="button" className="cb360-clear-btn" onClick={clearAllFilters}>
                Clear All
              </button>
            )}
          </div>

          {/* 1. BUDGET */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-indian-rupee-sign"></i> Budget
            </label>
            <div className="cb360-pills-grid">
              {[
                { id: 'all', label: 'All' },
                { id: 'under_3', label: 'Under ₹3 Lakh' },
                { id: '3_5', label: '₹3 - 5 Lakh' },
                { id: '5_8', label: '₹5 - 8 Lakh' },
                { id: '8_12', label: '₹8 - 12 Lakh' },
                { id: '12_20', label: '₹12 - 20 Lakh' },
                { id: 'above_20', label: 'Above ₹20 Lakh' },
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

          {/* 2. BRAND + MODEL */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-tags"></i> Brand + Model
            </label>
            <div className="cb360-brand-search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search brand (e.g. Tata, Hyundai)..."
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
            </div>

            {/* Model Sub-filter if available */}
            {availableModels.length > 0 && (
              <div className="cardekho-model-chips-wrap">
                <span className="text-xs font-semibold text-slate-500 mb-1 block">Models:</span>
                <div className="cb360-pills-grid">
                  {availableModels.map(m => (
                    <button
                      key={m}
                      type="button"
                      className={`cb360-pill-btn ${selectedModels.includes(m) ? 'active' : ''}`}
                      onClick={() => toggleModel(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. MODEL YEAR */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-regular fa-calendar"></i> Model Year
            </label>
            <div className="cb360-pills-grid">
              {['2024', '2023', '2022', '2021', '2020', '2019 & older'].map(yr => (
                <button
                  key={yr}
                  type="button"
                  className={`cb360-pill-btn ${selectedYears.includes(yr.split(' ')[0]) ? 'active' : ''}`}
                  onClick={() => toggleYear(yr.split(' ')[0])}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* 4. FUEL TYPE */}
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

          {/* 5. TRANSMISSION */}
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

          {/* 6. KILOMETER DRIVEN */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-road"></i> Kilometer Driven
            </label>
            <div className="cb360-pills-grid">
              {[
                { id: 'all', label: 'Any KM' },
                { id: 'under_25', label: 'Under 25,000 km' },
                { id: 'under_50', label: '25,000 - 50,000 km' },
                { id: 'under_75', label: '50,000 - 75,000 km' },
                { id: 'above_75', label: '75,000+ km' },
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

          {/* 7. OWNERSHIP */}
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

          {/* 8. BODY TYPE */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-car-side"></i> Body Type
            </label>
            <div className="cb360-pills-grid">
              {['SUV', 'Sedan', 'Hatchback', 'MUV / Van', 'Cruiser', 'Sports', 'Scooter'].map(bt => (
                <button
                  key={bt}
                  type="button"
                  className={`cb360-pill-btn ${selectedBodyTypes.includes(bt) ? 'active' : ''}`}
                  onClick={() => toggleBodyType(bt)}
                >
                  {bt}
                </button>
              ))}
            </div>
          </div>

          {/* 9. PREMIUM SELLER */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-award"></i> Seller Type
            </label>
            <div className="cb360-pills-grid">
              {[
                { id: 'all', label: 'All Sellers' },
                { id: 'premium_only', label: '⭐ Premium Seller' },
                { id: 'dealer', label: 'Verified Dealer' },
                { id: 'individual', label: 'Direct Owner' }
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  className={`cb360-pill-btn ${sellerTypeFilter === st.id ? 'active' : ''}`}
                  onClick={() => setSellerTypeFilter(st.id as any)}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* 10. RTO */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-id-card"></i> RTO Registered Location
            </label>
            <div className="cb360-checkbox-scroll-list" style={{ maxHeight: '140px' }}>
              {availableRtos.map(r => (
                <label key={r.rto} className="cb360-checkbox-row">
                  <input
                    type="checkbox"
                    checked={selectedRtos.includes(r.rto)}
                    onChange={() => toggleRto(r.rto)}
                  />
                  <span className="brand-name">{r.rto}</span>
                  <span className="brand-count">({r.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* 11. SEATS */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-couch"></i> Seats
            </label>
            <div className="cb360-pills-grid">
              {[2, 4, 5, 7, 8].map(s => (
                <button
                  key={s}
                  type="button"
                  className={`cb360-pill-btn ${selectedSeats.includes(s) ? 'active' : ''}`}
                  onClick={() => toggleSeats(s)}
                >
                  {s} Seater
                </button>
              ))}
            </div>
          </div>

          {/* 12. DISCOUNT */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-percent"></i> Special Discount & Offers
            </label>
            <button
              type="button"
              className={`cb360-pill-btn w-full ${discountOnly ? 'active' : ''}`}
              onClick={() => setDiscountOnly(!discountOnly)}
              style={{ justifyContent: 'center' }}
            >
              🏷️ Vehicles with Price Drops & Discounts Only
            </button>
          </div>

          {/* 13. COLORS */}
          <div className="cb360-filter-group">
            <label className="cb360-filter-title">
              <i className="fa-solid fa-palette"></i> Colors
            </label>
            <div className="cb360-color-chips-grid">
              {[
                { name: 'White', hex: '#ffffff', border: '#cbd5e1' },
                { name: 'Black', hex: '#0f172a' },
                { name: 'Silver', hex: '#94a3b8' },
                { name: 'Grey', hex: '#64748b' },
                { name: 'Red', hex: '#ef4444' },
                { name: 'Blue', hex: '#3b82f6' },
                { name: 'Green', hex: '#22c55e' },
                { name: 'Yellow', hex: '#eab308' },
              ].map(col => (
                <button
                  key={col.name}
                  type="button"
                  className={`cb360-color-chip ${selectedColors.includes(col.name) ? 'active' : ''}`}
                  onClick={() => toggleColor(col.name)}
                  title={col.name}
                >
                  <span
                    className="color-dot"
                    style={{
                      background: col.hex,
                      border: col.border ? `1px solid ${col.border}` : 'none'
                    }}
                  ></span>
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* RIGHT COLUMN: MAIN CARDEKHO USED VEHICLE CATALOG LISTINGS */}
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

          {/* Cards List matching Second Reference Image */}
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
                  {/* Cardekho Wide Horizontal Card */}
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
                      {veh.discount && (
                        <span className="cardekho-discount-badge">
                          {veh.discount}
                        </span>
                      )}
                      {veh.sellerType && (
                        <span className="cardekho-seller-badge">
                          {veh.sellerType}
                        </span>
                      )}
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

                      {/* Specs Row with Icons (Year, KM, Owners, Fuel, Location, RTO, Seats) */}
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
                        {veh.rto && (
                          <span className="cb360-spec-col rto-col">
                            <i className="fa-solid fa-id-badge"></i>
                            <span>{veh.rto}</span>
                          </span>
                        )}
                        {veh.seats && (
                          <span className="cb360-spec-col">
                            <i className="fa-solid fa-couch"></i>
                            <span>{veh.seats} Seats</span>
                          </span>
                        )}
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
                </React.Fragment>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


/* 9. VIEW 7: AUTHORIZED DEALERSHIPS & SHOWROOMS                      */
/* ------------------------------------------------------------------ */
