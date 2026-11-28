'use client';

import React, { useState, useMemo, useEffect } from 'react';
import './ServiceCentersView.css';
import {
  VehicleCategoryType,
  getBrandsForCategory,
  BrandInfo
} from './vehicleBrandsModelsData';
import {
  ALL_INDIAN_STATES,
  getDistrictsForState
} from './indianStatesAndDistricts';

interface ServiceCenterItem {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  brand: string;
  vehicleType: string;
  state: string;
  district: string;
  rating?: number;
  openTimings?: string;
}

const VEHICLE_CATEGORIES: { id: VehicleCategoryType; label: string; icon: string }[] = [
  { id: 'Bike', label: 'Bikes & Scooters', icon: 'fa-solid fa-motorcycle' },
  { id: 'Car', label: 'Cars & SUVs', icon: 'fa-solid fa-car-side' },
  { id: 'Truck', label: 'Trucks / Lorries', icon: 'fa-solid fa-truck-moving' },
  { id: 'Auto', label: '3-Wheelers', icon: 'fa-solid fa-trailer' },
  { id: 'Bus', label: 'Buses', icon: 'fa-solid fa-bus' },
  { id: 'Tractor', label: 'Tractors & Agri', icon: 'fa-solid fa-tractor' },
  { id: 'Electric', label: 'Electric (EV)', icon: 'fa-solid fa-bolt' },
];

interface ServiceCentersViewProps {
  showToast: (msg: string) => void;
  userLocationCity?: string;
  setUserLocationCity?: (city: string) => void;
  onNavigateTab?: (path: string) => void;
}

export default function ServiceCentersView({
  showToast,
  userLocationCity = 'Chennai',
  setUserLocationCity,
  onNavigateTab
}: ServiceCentersViewProps) {
  // Vehicle Category selection: Default 'Bike' or read from URL query param
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleCategoryType>('Bike');

  // State & District selection (Google Locations for India)
  const [selectedState, setSelectedState] = useState<string>('Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(userLocationCity || 'Chennai');

  // Brand selection: Empty by default ("Select Brand" placeholder)
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [activeCategoryTab, setActiveCategoryTab] = useState<'CARS' | 'SERVICE CENTERS'>('SERVICE CENTERS');
  const [activeSubPill, setActiveSubPill] = useState<'Dealers' | 'Service Center' | 'Charging Stations'>('Service Center');

  // Listen to URL search params if passed (e.g., ?vehicleType=Bike&brand=TVS)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const typeParam = urlParams.get('vehicleType') as VehicleCategoryType;
      const brandParam = urlParams.get('brand');

      if (typeParam && ['Car', 'Bike', 'Truck', 'Auto', 'Bus', 'Tractor', 'Electric'].includes(typeParam)) {
        setSelectedVehicleType(typeParam);
        if (brandParam) {
          setSelectedBrand(decodeURIComponent(brandParam));
        } else {
          setSelectedBrand('');
        }
      }
    }
  }, []);

  // Brand map based on the active vehicle category
  const brandsMap = useMemo(() => {
    return getBrandsForCategory(selectedVehicleType);
  }, [selectedVehicleType]);

  const brandNames = useMemo(() => {
    return Object.keys(brandsMap);
  }, [brandsMap]);

  // Synchronize available districts when state changes
  const availableDistricts = useMemo(() => {
    return getDistrictsForState(selectedState);
  }, [selectedState]);

  // Handle vehicle type category change
  const handleVehicleCategoryChange = (cat: VehicleCategoryType) => {
    setSelectedVehicleType(cat);
    // When switching vehicle type, reset brand to empty so user explicitly picks their brand
    setSelectedBrand('');
    const newBrands = Object.keys(getBrandsForCategory(cat));
    showToast(`Showing ${cat} brands. Please select your brand.`);
  };

  // Handle State change
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const districts = getDistrictsForState(newState);
    const firstDist = districts[0] || 'Main City';
    setSelectedDistrict(firstDist);
    if (setUserLocationCity) setUserLocationCity(firstDist);
    showToast(`State set to ${newState}. Showing districts.`);
  };

  // Handle District change
  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    if (setUserLocationCity) setUserLocationCity(newDistrict);
    showToast(`Location updated to ${newDistrict}, ${selectedState}`);
  };

  const navigateTo = (path: string) => {
    if (onNavigateTab) {
      onNavigateTab(path);
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleLocate = (centerName: string, address: string) => {
    showToast(`Locating ${centerName} (${address}) on Google Maps GPS`);
  };

  const handleSearch = () => {
    if (!selectedBrand) {
      showToast(`Please choose a ${typeSingular} brand first (e.g. ${brandNames.slice(0, 3).join(', ')})`);
      return;
    }
    showToast(`Found authorized ${selectedBrand} service stations in ${selectedDistrict}, ${selectedState}`);
  };

  // Dynamic Service Centers generation for chosen Brand, Category and District
  const currentCenters: ServiceCenterItem[] = useMemo(() => {
    if (!selectedBrand) {
      // If no brand selected yet, show verified multi-brand centers for the selected category
      return [
        {
          id: `sc-general-1-${selectedVehicleType}`,
          name: `Authorized ${selectedVehicleType} Service & Genuine Spares Hub`,
          address: `No. 20, Main Ring Road, ${selectedDistrict}, ${selectedState}`,
          email: `service@sart-${selectedVehicleType.toLowerCase()}-hub.in`,
          phone: '044-42911111',
          brand: `All ${selectedVehicleType} Brands`,
          vehicleType: selectedVehicleType,
          state: selectedState,
          district: selectedDistrict,
          rating: 4.8,
          openTimings: '08:30 AM - 08:00 PM (Mon - Sat)'
        },
        {
          id: `sc-general-2-${selectedVehicleType}`,
          name: `Multi-Brand ${selectedVehicleType} Workshop & Diagnostic Point`,
          address: `Plot No. B7 & B8, Industrial Estate, ${selectedDistrict}, ${selectedState}`,
          email: `care@sart-${selectedDistrict.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
          phone: '044-49261111',
          brand: `All ${selectedVehicleType} Brands`,
          vehicleType: selectedVehicleType,
          state: selectedState,
          district: selectedDistrict,
          rating: 4.7,
          openTimings: '09:00 AM - 07:30 PM (All 7 Days)'
        }
      ];
    }

    return [
      {
        id: `sc-1-${selectedBrand}`,
        name: `${selectedBrand} Prime Authorized Service Hub`,
        address: `No. 20, Main Ring Road, ${selectedDistrict}, ${selectedState}`,
        email: `service@${selectedBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}-servicehub.in`,
        phone: '044-42911111',
        brand: selectedBrand,
        vehicleType: selectedVehicleType,
        state: selectedState,
        district: selectedDistrict,
        rating: 4.8,
        openTimings: '08:30 AM - 08:00 PM (Mon - Sat)'
      },
      {
        id: `sc-2-${selectedBrand}`,
        name: `Authorized ${selectedBrand} Express Workshop & Spares`,
        address: `Plot No. B7 & B8, Industrial Estate, ${selectedDistrict}, ${selectedState}`,
        email: `care@${selectedBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}-${selectedDistrict.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
        phone: '044-49261111',
        brand: selectedBrand,
        vehicleType: selectedVehicleType,
        state: selectedState,
        district: selectedDistrict,
        rating: 4.7,
        openTimings: '09:00 AM - 07:30 PM (All 7 Days)'
      }
    ];
  }, [selectedBrand, selectedVehicleType, selectedState, selectedDistrict]);

  const typeSingular = selectedVehicleType === 'Bike'
    ? 'bike'
    : selectedVehicleType === 'Truck'
      ? 'truck'
      : selectedVehicleType === 'Bus'
        ? 'bus'
        : selectedVehicleType === 'Tractor'
          ? 'tractor'
          : selectedVehicleType === 'Auto'
            ? '3-wheeler'
            : selectedVehicleType === 'Electric'
              ? 'EV'
              : 'car';

  const headingText = selectedBrand
    ? `${selectedBrand} ${typeSingular} service centers in ${selectedDistrict}`
    : `Authorized ${selectedVehicleType} service centers in ${selectedDistrict}`;

  return (
    <div className="service-centers-page-wrapper animate-fade-in">
      {/* 1. TOP TABS (SERVICE CENTERS | BUY & SELL) */}
      <div className="sc-top-tabs-bar">
        <button
          type="button"
          className={`sc-top-tab-btn ${activeCategoryTab === 'SERVICE CENTERS' ? 'active' : ''}`}
          onClick={() => setActiveCategoryTab('SERVICE CENTERS')}
        >
          SERVICE CENTERS
        </button>

        <button
          type="button"
          className="sc-top-tab-btn"
          onClick={() => navigateTo('/store/Buy&Sell')}
        >
          BUY &amp; SELL VEHICLES
        </button>
      </div>

      {/* 2. VEHICLE CATEGORY SELECTOR CHIPS (Bike, Car, Truck, Auto, Bus, Tractor, EV) */}
      <div className="sc-veh-category-bar">
        <span className="sc-veh-cat-label">
          <i className="fa-solid fa-layer-group"></i> 1. Choose Vehicle Type:
        </span>
        <div className="sc-veh-cat-chips">
          {VEHICLE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`sc-veh-cat-pill ${selectedVehicleType === cat.id ? 'active' : ''}`}
              onClick={() => handleVehicleCategoryChange(cat.id)}
            >
              <i className={cat.icon}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. MAIN TITLE */}
      <h1 className="sc-page-main-heading">
        {headingText}
      </h1>

      {/* 4. INFO DESCRIPTION BOX */}
      <div className="sc-info-card-box">
        <p>
          Locate {selectedBrand ? selectedBrand : `Authorized ${selectedVehicleType}`} Service Centers in {selectedDistrict}, {selectedState}. CarDekho connects you with verified {selectedVehicleType} Service Stations in {selectedDistrict} with complete address, contact details, and Google Maps direction. For official warranty service schedules and genuine spare parts pricing, contact the certified centers listed below.
        </p>
      </div>

      {/* 5. BRAND, STATE, DISTRICT & SEARCH BUTTON ROW */}
      <div className="sc-filters-bar-row">
        {/* Brand Dropdown (Empty by default with "Select Brand" placeholder) */}
        <div className="sc-filter-select-box">
          <label className="sc-dropdown-top-label">
            Select {selectedVehicleType} Brand
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              if (e.target.value) {
                showToast(`Selected brand: ${e.target.value}`);
              }
            }}
            className="sc-filter-select"
          >
            <option value="">-- Select Brand ({brandNames.length} brands) --</option>
            {brandNames.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <i className="fa-solid fa-caret-down sc-select-caret"></i>
        </div>

        {/* State Dropdown (All Indian States & UTs via Google Locations) */}
        <div className="sc-filter-select-box">
          <label className="sc-dropdown-top-label">Select State</label>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="sc-filter-select"
          >
            {ALL_INDIAN_STATES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          <i className="fa-solid fa-caret-down sc-select-caret"></i>
        </div>

        {/* District / City Dropdown (All districts of the selected State) */}
        <div className="sc-filter-select-box">
          <label className="sc-dropdown-top-label">Select District / City</label>
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="sc-filter-select"
          >
            {availableDistricts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <i className="fa-solid fa-caret-down sc-select-caret"></i>
        </div>

        {/* Solid Orange Search Button */}
        <button
          type="button"
          className="btn-sc-search-orange"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* 6. AUTHORIZED SERVICE CENTERS CONTAINER */}
      <div className="sc-results-master-card">
        {/* Results Title & Pill Nav */}
        <div className="sc-results-header">
          <h2 className="sc-results-title">
            2 Authorized {selectedBrand || `${selectedVehicleType}`} service centers in {selectedDistrict}
          </h2>

          <div className="sc-type-pills-row">
            <button
              type="button"
              className={`sc-type-pill-btn ${activeSubPill === 'Dealers' ? 'active' : ''}`}
              onClick={() => {
                setActiveSubPill('Dealers');
                showToast(`Listing Authorized ${selectedBrand || selectedVehicleType} Dealerships in ${selectedDistrict}`);
              }}
            >
              Dealers
            </button>

            <button
              type="button"
              className={`sc-type-pill-btn ${activeSubPill === 'Service Center' ? 'active' : ''}`}
              onClick={() => setActiveSubPill('Service Center')}
            >
              Service Center
            </button>

            <button
              type="button"
              className={`sc-type-pill-btn ${activeSubPill === 'Charging Stations' ? 'active' : ''}`}
              onClick={() => {
                setActiveSubPill('Charging Stations');
                navigateTo('/store/FindEVChargingStations');
              }}
            >
              Charging Stations
            </button>
          </div>
        </div>

        {/* 2-Column Grid of Service Center Cards */}
        <div className="sc-cards-grid">
          {currentCenters.map((center) => (
            <div key={center.id} className="sc-center-card">
              <div className="sc-card-top-header">
                <h3 className="sc-center-name">{center.name}</h3>
                {center.rating && (
                  <span className="sc-rating-badge">
                    <i className="fa-solid fa-star"></i> {center.rating}
                  </span>
                )}
              </div>

              <div className="sc-card-detail-item">
                <i className="fa-solid fa-location-dot sc-icon-location"></i>
                <span>{center.address}</span>
              </div>

              <div className="sc-card-detail-item">
                <i className="fa-regular fa-envelope sc-icon-email"></i>
                <a href={`mailto:${center.email}`} className="sc-link-email">
                  {center.email}
                </a>
              </div>

              <div className="sc-card-detail-item">
                <i className="fa-solid fa-phone sc-icon-phone"></i>
                <a href={`tel:${center.phone}`} className="sc-link-phone">
                  {center.phone}
                </a>
              </div>

              {center.openTimings && (
                <div className="sc-card-detail-item sc-timings-item">
                  <i className="fa-solid fa-clock sc-icon-clock"></i>
                  <span>{center.openTimings}</span>
                </div>
              )}

              <div className="sc-card-footer-action">
                <button
                  type="button"
                  className="btn-sc-locate"
                  onClick={() => handleLocate(center.name, center.address)}
                >
                  <i className="fa-solid fa-location-arrow"></i>
                  <span>Locate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
