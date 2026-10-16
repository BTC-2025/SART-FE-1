'use client';

import { StoreVehicleFinderBar } from './StoreVehicleFinderBar';
import { StoreBuySellPortalOverview } from './StoreBuySellPortalOverview';

import React, { useState, useRef, useEffect } from 'react';
import {
  VEHICLE_SHOWCASE_DATA,
  VehicleShowcaseItem,
  AUTOMOTIVE_NEWS_DATA,
  VEHICLE_VIDEO_REVIEWS,
  UPCOMING_CARS_FAQS,
  POPULAR_COMPARISON_PAIRS
} from '../storeData';
import { BRANDS_BY_VEHICLE, MODELS_BY_BRAND } from '../storeProductsData';
import {
  Carbike360FindNewView,
  Carbike360LatestView,
  Carbike360UpcomingView,
  Carbike360ElectricView,
  Carbike360TrendingView,
  Carbike360UsedCatalogView,
  Carbike360DealershipsView
} from '../CarBike360Views';

interface StoreBuySellHubProps {
  showToast: (msg: string) => void;
  userLocationCity: string;
  setUserLocationCity: (city: string) => void;
  topVehicleSearch: string;
  setTopVehicleSearch: (s: string) => void;
  setOnRoadPriceModalVehicle: (v: VehicleShowcaseItem | null) => void;
  selectedFuelCity: string;
  setActiveHubTab: (tab: any) => void;
}

export default function StoreBuySellHub({
  showToast,
  userLocationCity,
  setUserLocationCity,
  topVehicleSearch,
  setTopVehicleSearch,
  setOnRoadPriceModalVehicle,
  selectedFuelCity,
  setActiveHubTab
}: StoreBuySellHubProps) {
  // Dropdown states for New Vehicle and Used Vehicle buttons
  const [newVehicleDropdownOpen, setNewVehicleDropdownOpen] = useState<boolean>(false);
  const [usedVehicleDropdownOpen, setUsedVehicleDropdownOpen] = useState<boolean>(false);
  const [activeDropdownSubmenu, setActiveDropdownSubmenu] = useState<string | null>(null);
  const newVehicleDropdownRef = useRef<HTMLDivElement>(null);
  const usedVehicleDropdownRef = useRef<HTMLDivElement>(null);

  // Close vehicle dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (newVehicleDropdownRef.current && !newVehicleDropdownRef.current.contains(target)) {
        setNewVehicleDropdownOpen(false);
      }
      if (usedVehicleDropdownRef.current && !usedVehicleDropdownRef.current.contains(target)) {
        setUsedVehicleDropdownOpen(false);
      }
      if (
        (!newVehicleDropdownRef.current || !newVehicleDropdownRef.current.contains(target)) &&
        (!usedVehicleDropdownRef.current || !usedVehicleDropdownRef.current.contains(target))
      ) {
        setActiveDropdownSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // CarDekho Buy / Sell view mode: 'buy' vs 'sell'
  const [cardekhoViewMode, setCardekhoViewMode] = useState<'buy' | 'sell'>('buy');
  // SART Universal Vehicle Selector for Buy / Sell Hub
  const [cardekhoSelectedType, setCardekhoSelectedType] = useState<string>('All'); // All, Car, Bike, Auto, Van, Lorry, Bus, EV
  const [cardekhoVehicleCondition, setCardekhoVehicleCondition] = useState<'new' | 'used'>('new');
  const [cardekhoSearchBy, setCardekhoSearchBy] = useState<'budget' | 'brand'>('budget');
  const [cardekhoBudgetFilter, setCardekhoBudgetFilter] = useState<string>('All Budgets');
  const [cardekhoBodyTypeFilter, setCardekhoBodyTypeFilter] = useState<string>('All');
  const [cardekhoBrandFilter, setCardekhoBrandFilter] = useState<string>('All Brands');
  const [cardekhoModelFilter, setCardekhoModelFilter] = useState<string>('All Models');
  const [cardekhoCityFilter, setCardekhoCityFilter] = useState<string>('All Cities');
  const [cardekhoNavCategory, setCardekhoNavCategory] = useState<string>('all');
  const [homeCarSubCategory, setHomeCarSubCategory] = useState<string>('All');
  const [homeBikeSubCategory, setHomeBikeSubCategory] = useState<string>('All');
  const [homeCommercialSubCategory, setHomeCommercialSubCategory] = useState<string>('All');
  const [cardekhoFormOpen, setCardekhoFormOpen] = useState<boolean>(true);
  const [sellFormVehicle, setSellFormVehicle] = useState({
    brand: 'Maruti Suzuki',
    model: 'Swift',
    year: '2021',
    kms: '35,000 km',
    expectedPrice: '5.5 Lakh',
    phone: '',
  });

  const [vehicleShowcaseType, setVehicleShowcaseType] = useState<'all' | 'Car' | 'Bike' | 'EV'>('all');
  const [vehicleShowcaseStatus, setVehicleShowcaseStatus] = useState<'all' | 'popular' | 'electric' | 'upcoming' | 'used'>('all');
  const [vehicleBudgetMax, setVehicleBudgetMax] = useState<number>(30); // in Lakhs

  // CarBike360.com page mode triggered by dropdown options
  const [carbike360PageMode, setCarbike360PageMode] = useState<
    | 'portal_home'
    | 'find_new'
    | 'latest'
    | 'upcoming'
    | 'electric'
    | 'trending'
    | 'used_catalog'
    | 'dealerships'
  >('portal_home');

  // CarBike360 Left Sidebar Filters
  const [cb360PriceRange, setCb360PriceRange] = useState<string>('all');
  const [cb360SelectedBrands, setCb360SelectedBrands] = useState<string[]>([]);
  const [cb360SelectedBodyTypes, setCb360SelectedBodyTypes] = useState<string[]>([]);
  const [cb360SelectedFuels, setCb360SelectedFuels] = useState<string[]>([]);
  const [cb360SelectedTransmissions, setCb360SelectedTransmissions] = useState<string[]>([]);
  const [cb360SelectedSeating, setCb360SelectedSeating] = useState<string>('all');
  const [cb360SortBy, setCb360SortBy] = useState<'popular' | 'price_low' | 'price_high' | 'rating'>('popular');

  // CarBike360 Upcoming Cars Filter Bar
  const [cb360UpcomingBrand, setCb360UpcomingBrand] = useState<string>('All Brands');
  const [cb360UpcomingBodyType, setCb360UpcomingBodyType] = useState<string>('All Body Types');
  const [cb360UpcomingBudget, setCb360UpcomingBudget] = useState<string>('All Prices');
  const [cb360FaqOpenIndex, setCb360FaqOpenIndex] = useState<number | null>(0);

  return (
          <section className="cardekho-hub-view animate-pop">

            {/* FULL-WIDTH LEADERBOARD AD BANNER (User First Image Reference: Chetak Sport Mode Electric Ad) */}
            <div className="sart-leaderboard-ad-banner" onClick={() => {
              setCardekhoSelectedType('Bike');
              setCardekhoBodyTypeFilter('Electric');
              showToast('Opening Bajaj Chetak Sport Mode • ₹99,800/- Special Offer');
            }}>
              <div className="ad-banner-link">
                <div className="ad-banner-content">
                  <div className="ad-banner-side-visual">
                    <span className="ad-badge-tag">Featured Ad</span>
                    <div className="ad-scooter-avatar">
                      <i className="fa-solid fa-motorcycle"></i>
                    </div>
                  </div>

                  <div className="ad-banner-center-copy">
                    <div className="ad-headline-small">STAY TECHPROOF WITH</div>
                    <div className="ad-brand-title">
                      <span className="ad-brand-font">Chetak</span>
                      <span className="ad-feature-pill">SPORT MODE</span>
                    </div>
                    <div className="ad-speed-tag">FULLY LIFEPROOF • TOP SPEED 80 KM/H • ZERO EMISSION</div>
                  </div>

                  <div className="ad-banner-cta-group">
                    <div className="ad-price-col">
                      <span className="ad-price-lbl">Starting at</span>
                      <div className="ad-price-val">₹ 99 800/-*</div>
                    </div>
                    <button type="button" className="ad-cta-btn">
                      <span>Explore Chetak</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* UNIFIED CONTAINER FOR: (1) TOP CHOOSE VEHICLE + (2) NEW / USED / SELL BUTTONS + (3) VEHICLE FINDER FORM */}
            <div className="sart-unified-buysell-container">
              {/* 1. TOP CHOOSE VEHICLE SELECTOR STRIP (All Categories, Bike, Car, Van, Bus, Lorry, Tractor, Auto, EV) */}
              <div className="sart-top-vehicle-category-selector-bar">
                <div className="sart-vehicle-selector-label">
                  <i className="fa-solid fa-layer-group"></i>
                  <span>1. Choose Vehicle:</span>
                </div>
                <div className="sart-vehicle-category-pill-group">
                  {[
                    { id: 'All', label: 'All Vehicles', icon: 'fa-border-all' },
                    { id: 'Car', label: 'Cars & SUVs', icon: 'fa-car-side' },
                    { id: 'Bike', label: 'Bikes & Scooters', icon: 'fa-motorcycle' },
                    { id: 'Van', label: 'Commercial Vans', icon: 'fa-van-shuttle' },
                    { id: 'Bus', label: 'Buses', icon: 'fa-bus' },
                    { id: 'Lorry', label: 'Trucks / Lorries', icon: 'fa-truck-moving' },
                    { id: 'Tractor', label: 'Agri Tractors', icon: 'fa-tractor' },
                    { id: 'Auto', label: '3-Wheelers', icon: 'fa-taxi' },
                    { id: 'EV', label: 'Electric (EV)', icon: 'fa-bolt' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`sart-vehicle-pill-btn ${cardekhoSelectedType === v.id ? 'active' : ''}`}
                      onClick={() => {
                        setCardekhoSelectedType(v.id);
                        setCardekhoBrandFilter('All Brands');
                        setCardekhoModelFilter('All Models');
                        setCardekhoBodyTypeFilter('All');
                        showToast(`Selected Category: ${v.label}`);
                      }}
                      title={`Filter by ${v.label}`}
                    >
                      <i className={`fa-solid ${v.icon}`}></i>
                      <span>{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. SUB-NAV: NEW VEHICLE (WITH ATTACHED ARROW), USED VEHICLE (WITH DOWN ARROW), SELL VEHICLE */}
              <div className="sart-buysell-top-subnav embedded-in-container">
                <div className="sart-buysell-three-buttons">
                  {/* 1. NEW VEHICLE BUTTON WITH ATTACHED DOWN ARROW */}
                  <div
                    className="sart-buysell-dropdown-wrap"
                    ref={newVehicleDropdownRef}
                  >
                    <button
                      type="button"
                      className={`sart-buysell-btn ${cardekhoViewMode === 'buy' && cardekhoVehicleCondition === 'new' ? 'active' : ''} ${newVehicleDropdownOpen ? 'menu-open' : ''}`}
                      onClick={() => {
                        setCardekhoViewMode('buy');
                        setCardekhoVehicleCondition('new');
                        setCardekhoNavCategory('all');
                        setCarbike360PageMode('portal_home');
                        setNewVehicleDropdownOpen(false);
                        setUsedVehicleDropdownOpen(false);
                        showToast('Viewing New Vehicles');
                      }}
                    >
                      <i className="fa-solid fa-sparkles"></i>
                      <span>New Vehicle</span>
                      <span
                        className="sart-dropdown-arrow-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewVehicleDropdownOpen((prev) => !prev);
                          setUsedVehicleDropdownOpen(false);
                        }}
                        title={newVehicleDropdownOpen ? 'Close New Vehicles Menu' : 'Open New Vehicles Options'}
                      >
                        <i className={`fa-solid ${newVehicleDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'} sart-btn-dropdown-arrow`}></i>
                      </span>
                    </button>

                    {newVehicleDropdownOpen && (
                      <div className="sart-nav-dropdown-menu animate-fade-in" role="menu">
                        {/* 1. Find New [Category] (or all vehicles if 'All') */}
                        {cardekhoSelectedType === 'All' ? (
                          <div
                            className={`sart-dropdown-item has-submenu ${activeDropdownSubmenu === 'find_vehicle' ? 'submenu-active' : ''}`}
                            onMouseEnter={() => setActiveDropdownSubmenu('find_vehicle')}
                            onClick={(e) => {
                              // If user clicks the parent label directly without picking a sub-item:
                              e.stopPropagation();
                              setActiveDropdownSubmenu(activeDropdownSubmenu === 'find_vehicle' ? null : 'find_vehicle');
                            }}
                          >
                            <span className="sart-dropdown-item-label">Find New Vehicle</span>
                            <i className="fa-solid fa-chevron-right sart-submenu-caret"></i>

                            {/* Submenu: Many Vehicle Categories */}
                            {activeDropdownSubmenu === 'find_vehicle' && (
                              <div className="sart-dropdown-flyout animate-fade-in">
                                {[
                                  { id: 'Car', label: 'Cars & SUVs', icon: 'fa-car-side' },
                                  { id: 'Bike', label: 'Bikes & Scooters', icon: 'fa-motorcycle' },
                                  { id: 'Lorry', label: 'Commercial Trucks', icon: 'fa-truck-moving' },
                                  { id: 'Bus', label: 'Passenger Buses', icon: 'fa-bus-simple' },
                                  { id: 'Van', label: 'Delivery Vans & Omni', icon: 'fa-van-shuttle' },
                                  { id: 'Tractor', label: 'Agricultural Tractors', icon: 'fa-tractor' },
                                  { id: 'Auto', label: '3-Wheelers & Auto', icon: 'fa-truck-pickup' },
                                  { id: 'EV', label: '100% Electric Vehicles', icon: 'fa-bolt' },
                                ].map((sub) => (
                                  <div
                                    key={sub.id}
                                    className="sart-dropdown-subitem"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCarbike360PageMode('find_new');
                                      setCardekhoSelectedType(sub.id);
                                      setCardekhoViewMode('buy');
                                      setCardekhoVehicleCondition('new');
                                      setNewVehicleDropdownOpen(false);
                                      setActiveDropdownSubmenu(null);
                                      showToast(`Selected New ${sub.label}`);
                                    }}
                                  >
                                    <i className={`fa-solid ${sub.icon} subitem-icon`}></i>
                                    <span>{sub.label}</span>
                                  </div>
                                ))}
                                <div
                                  className="sart-dropdown-subitem highlight-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCarbike360PageMode('find_new');
                                    setCardekhoSelectedType('All');
                                    setCardekhoViewMode('buy');
                                    setCardekhoVehicleCondition('new');
                                    setNewVehicleDropdownOpen(false);
                                    setActiveDropdownSubmenu(null);
                                    showToast('Viewing All New Vehicles');
                                  }}
                                >
                                  <i className="fa-solid fa-layer-group subitem-icon"></i>
                                  <span>All Vehicle Categories</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* When category is specifically chosen (e.g. Car or Bike or Truck): Direct Find New */
                          <div
                            className="sart-dropdown-item"
                            onMouseEnter={() => setActiveDropdownSubmenu(null)}
                            onClick={() => {
                              setCarbike360PageMode('find_new');
                              setCardekhoViewMode('buy');
                              setCardekhoVehicleCondition('new');
                              setNewVehicleDropdownOpen(false);
                              showToast(`Opening Find New ${cardekhoSelectedType === 'Car' ? 'Cars & SUVs' : cardekhoSelectedType === 'Bike' ? 'Bikes & Scooters' : cardekhoSelectedType === 'Lorry' ? 'Commercial Trucks' : cardekhoSelectedType === 'Bus' ? 'Buses' : cardekhoSelectedType === 'Tractor' ? 'Tractors' : `${cardekhoSelectedType}s`}`);
                            }}
                          >
                            <span className="sart-dropdown-item-label">
                              Find New {cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes & Scooters' : cardekhoSelectedType === 'Lorry' ? 'Trucks' : cardekhoSelectedType === 'Bus' ? 'Buses' : cardekhoSelectedType === 'Tractor' ? 'Tractors' : cardekhoSelectedType === 'Auto' ? '3-Wheelers' : 'EVs'}
                            </span>
                          </div>
                        )}

                        {/* 2. Latest Models */}
                        <div
                          className="sart-dropdown-item"
                          onMouseEnter={() => setActiveDropdownSubmenu(null)}
                          onClick={() => {
                            setCarbike360PageMode('latest');
                            setCardekhoViewMode('buy');
                            setCardekhoVehicleCondition('new');
                            setVehicleShowcaseStatus('popular');
                            setNewVehicleDropdownOpen(false);
                            showToast(`Showing Latest ${cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : cardekhoSelectedType === 'All' ? 'Vehicles' : `${cardekhoSelectedType}s`} in India`);
                          }}
                        >
                          <span className="sart-dropdown-item-label">
                            Latest {cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : cardekhoSelectedType === 'All' ? 'Vehicles' : `${cardekhoSelectedType}s`}
                          </span>
                        </div>

                        {/* 3. Popular Brands */}
                        <div
                          className={`sart-dropdown-item has-submenu ${activeDropdownSubmenu === 'popular_brands' ? 'submenu-active' : ''}`}
                          onMouseEnter={() => setActiveDropdownSubmenu('popular_brands')}
                          onClick={() => {
                            setActiveDropdownSubmenu(activeDropdownSubmenu === 'popular_brands' ? null : 'popular_brands');
                          }}
                        >
                          <span className="sart-dropdown-item-label">
                            Popular {cardekhoSelectedType === 'Car' ? 'Car' : cardekhoSelectedType === 'Bike' ? 'Bike' : ''} Brands
                          </span>
                          <i className="fa-solid fa-chevron-right sart-submenu-caret"></i>

                          {/* Submenu: Brands for current category */}
                          {activeDropdownSubmenu === 'popular_brands' && (
                            <div className="sart-dropdown-flyout animate-fade-in">
                              {(cardekhoSelectedType === 'Car'
                                ? ['Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Toyota', 'Kia', 'All Brands']
                                : cardekhoSelectedType === 'Bike'
                                ? ['Royal Enfield', 'Hero MotoCorp', 'Honda 2Wheelers', 'Bajaj Auto', 'TVS Motor', 'Yamaha', 'All Brands']
                                : cardekhoSelectedType === 'Lorry'
                                ? ['Tata Motors', 'Ashok Leyland', 'Eicher Motors', 'BharatBenz', 'Mahindra Trucks', 'All Brands']
                                : cardekhoSelectedType === 'Bus'
                                ? ['Volvo Buses', 'Tata Motors', 'Ashok Leyland', 'Scania', 'All Brands']
                                : cardekhoSelectedType === 'Tractor'
                                ? ['Mahindra Tractors', 'Swaraj', 'John Deere', 'Sonalika', 'All Brands']
                                : cardekhoSelectedType === 'Auto'
                                ? ['Bajaj Auto', 'Piaggio Ape', 'Mahindra Alfa', 'TVS King', 'All Brands']
                                : ['Tata Motors', 'Hyundai', 'Maruti Suzuki', 'Mahindra', 'Royal Enfield', 'All Brands']
                              ).map((brand) => (
                                <div
                                  key={brand}
                                  className="sart-dropdown-subitem"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCarbike360PageMode('find_new');
                                    setCardekhoViewMode('buy');
                                    setCardekhoVehicleCondition('new');
                                    setCb360SelectedBrands(brand === 'All Brands' ? [] : [brand]);
                                    setCardekhoBrandFilter(brand);
                                    setNewVehicleDropdownOpen(false);
                                    setActiveDropdownSubmenu(null);
                                    showToast(brand === 'All Brands' ? 'Showing all brands' : `Filtered models from ${brand}`);
                                  }}
                                >
                                  <span>{brand}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 4. Upcoming Models */}
                        <div
                          className="sart-dropdown-item"
                          onMouseEnter={() => setActiveDropdownSubmenu(null)}
                          onClick={() => {
                            setCarbike360PageMode('upcoming');
                            setCardekhoViewMode('buy');
                            setCardekhoVehicleCondition('new');
                            setVehicleShowcaseStatus('upcoming');
                            setNewVehicleDropdownOpen(false);
                            showToast(`Showing Upcoming ${cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : cardekhoSelectedType === 'All' ? 'Vehicles' : `${cardekhoSelectedType}s`} 2026`);
                          }}
                        >
                          <span className="sart-dropdown-item-label">
                            Upcoming {cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : cardekhoSelectedType === 'All' ? 'Vehicles' : `${cardekhoSelectedType}s`}
                          </span>
                        </div>

                        {/* 5. Electric Models */}
                        <div
                          className="sart-dropdown-item"
                          onMouseEnter={() => setActiveDropdownSubmenu(null)}
                          onClick={() => {
                            setCarbike360PageMode('electric');
                            setCardekhoViewMode('buy');
                            setCardekhoVehicleCondition('new');
                            setVehicleShowcaseStatus('electric');
                            setNewVehicleDropdownOpen(false);
                            showToast(`Showing 100% Electric ${cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes & Scooters' : 'Vehicles'}`);
                          }}
                        >
                          <span className="sart-dropdown-item-label">
                            <span className="sart-ev-bolt-symbol">⚡</span> Electric {cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes & Scooters' : 'Vehicles'}
                          </span>
                        </div>

                        {/* 6. Compare Models */}
                        <div
                          className="sart-dropdown-item"
                          onMouseEnter={() => setActiveDropdownSubmenu(null)}
                          onClick={() => {
                            setActiveHubTab('compare_vehicles');
                            setNewVehicleDropdownOpen(false);
                            showToast(`Opening Compare ${cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : 'Vehicles'}`);
                          }}
                        >
                          <span className="sart-dropdown-item-label">
                            Compare {cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : 'Vehicles'}
                          </span>
                        </div>

                        {/* 7. Trending Models */}
                        <div
                          className="sart-dropdown-item"
                          onMouseEnter={() => setActiveDropdownSubmenu(null)}
                          onClick={() => {
                            setCarbike360PageMode('trending');
                            setCardekhoViewMode('buy');
                            setCardekhoVehicleCondition('new');
                            setNewVehicleDropdownOpen(false);
                            showToast(`Showing Trending ${cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : 'Vehicles'} in India`);
                          }}
                        >
                          <span className="sart-dropdown-item-label">
                            Trending {cardekhoSelectedType === 'Car' ? 'Cars' : cardekhoSelectedType === 'Bike' ? 'Bikes' : 'Vehicles'}
                          </span>
                        </div>

                        {/* 8. Dealers */}
                        <div
                          className="sart-dropdown-item"
                          onMouseEnter={() => setActiveDropdownSubmenu(null)}
                          onClick={() => {
                            setCarbike360PageMode('dealerships');
                            setNewVehicleDropdownOpen(false);
                            showToast(`Showing Authorized ${cardekhoSelectedType === 'Car' ? 'Car' : cardekhoSelectedType === 'Bike' ? 'Bike' : ''} Showrooms near ${userLocationCity}`);
                          }}
                        >
                          <span className="sart-dropdown-item-label">Authorized Dealers</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. USED VEHICLE BUTTON WITH DROPDOWN (Image 2 Reference - "Sell My Car" Removed) */}
                  <div
                    className="sart-buysell-dropdown-wrap"
                    ref={usedVehicleDropdownRef}
                  >
                    <button
                      type="button"
                      className={`sart-buysell-btn ${cardekhoViewMode === 'buy' && cardekhoVehicleCondition === 'used' ? 'active' : ''} ${usedVehicleDropdownOpen ? 'menu-open' : ''}`}
                      onClick={() => {
                        setCardekhoViewMode('buy');
                        setCardekhoVehicleCondition('used');
                        setCardekhoNavCategory('used');
                        setCarbike360PageMode('used_catalog');
                        setUsedVehicleDropdownOpen(false);
                        setNewVehicleDropdownOpen(false);
                        showToast('Viewing Certified Pre-Owned Vehicles');
                      }}
                    >
                      <i className="fa-solid fa-shield-halved"></i>
                      <span>Used Vehicle</span>
                      <span
                        className="sart-dropdown-arrow-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUsedVehicleDropdownOpen((prev) => !prev);
                          setNewVehicleDropdownOpen(false);
                        }}
                        title={usedVehicleDropdownOpen ? 'Close Used Vehicles Menu' : 'Open Used Vehicles Options'}
                      >
                        <i className={`fa-solid ${usedVehicleDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'} sart-btn-dropdown-arrow`}></i>
                      </span>
                    </button>

                    {usedVehicleDropdownOpen && (
                      <div className="sart-nav-dropdown-menu used-cars-menu animate-fade-in" role="menu">
                        {/* Dynamic category label helper */}
                        {(() => {
                          const vehLabel =
                            cardekhoSelectedType === 'Car' ? 'Cars & SUVs' :
                            cardekhoSelectedType === 'Bike' ? 'Bikes & Scooters' :
                            cardekhoSelectedType === 'Van' ? 'Commercial Vans' :
                            cardekhoSelectedType === 'Bus' ? 'Buses' :
                            cardekhoSelectedType === 'Lorry' ? 'Commercial Trucks' :
                            cardekhoSelectedType === 'Tractor' ? 'Agricultural Tractors' :
                            cardekhoSelectedType === 'Auto' ? '3-Wheelers & Autos' :
                            cardekhoSelectedType === 'EV' ? 'Electric Vehicles (EV)' : 'Used Vehicles';

                          return (
                            <>
                              {/* If 'All' is selected, offer quick category selection */}
                              {cardekhoSelectedType === 'All' ? (
                                <div
                                  className={`sart-dropdown-item has-submenu ${activeDropdownSubmenu === 'used_category' ? 'submenu-active' : ''}`}
                                  onMouseEnter={() => setActiveDropdownSubmenu('used_category')}
                                  onClick={() => {
                                    setActiveDropdownSubmenu(activeDropdownSubmenu === 'used_category' ? null : 'used_category');
                                  }}
                                >
                                  <span className="sart-dropdown-item-label">Buy Used Vehicles by Type</span>
                                  <i className="fa-solid fa-chevron-right sart-submenu-caret"></i>

                                  {activeDropdownSubmenu === 'used_category' && (
                                    <div className="sart-dropdown-flyout animate-fade-in">
                                      {[
                                        { id: 'Car', label: 'Cars & SUVs', icon: 'fa-car-side' },
                                        { id: 'Bike', label: 'Bikes & Scooters', icon: 'fa-motorcycle' },
                                        { id: 'Van', label: 'Commercial Vans', icon: 'fa-van-shuttle' },
                                        { id: 'Bus', label: 'Passenger Buses', icon: 'fa-bus-simple' },
                                        { id: 'Lorry', label: 'Commercial Trucks', icon: 'fa-truck-moving' },
                                        { id: 'Tractor', label: 'Agricultural Tractors', icon: 'fa-tractor' },
                                        { id: 'Auto', label: '3-Wheelers & Auto', icon: 'fa-taxi' },
                                        { id: 'EV', label: 'Electric Vehicles (EV)', icon: 'fa-bolt' },
                                      ].map((sub) => (
                                        <div
                                          key={sub.id}
                                          className="sart-dropdown-subitem"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setCardekhoSelectedType(sub.id);
                                            setCarbike360PageMode('used_catalog');
                                            setCardekhoViewMode('buy');
                                            setCardekhoVehicleCondition('used');
                                            setCardekhoNavCategory('used');
                                            setUsedVehicleDropdownOpen(false);
                                            setActiveDropdownSubmenu(null);
                                            showToast(`Showing Certified Used ${sub.label}`);
                                          }}
                                        >
                                          <i className={`fa-solid ${sub.icon} subitem-icon`}></i>
                                          <span>{sub.label}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                /* 1. Buy Used [Category] */
                                <div
                                  className="sart-dropdown-item"
                                  onMouseEnter={() => setActiveDropdownSubmenu(null)}
                                  onClick={() => {
                                    setCarbike360PageMode('used_catalog');
                                    setCardekhoViewMode('buy');
                                    setCardekhoVehicleCondition('used');
                                    setCardekhoNavCategory('used');
                                    setUsedVehicleDropdownOpen(false);
                                    showToast(`Browsing Certified Used ${vehLabel}`);
                                  }}
                                >
                                  <span className="sart-dropdown-item-label">Buy Used {vehLabel}</span>
                                </div>
                              )}

                              {/* 2. Used [Category] In Your City */}
                              <div
                                className={`sart-dropdown-item has-submenu ${activeDropdownSubmenu === 'used_city' ? 'submenu-active' : ''}`}
                                onMouseEnter={() => setActiveDropdownSubmenu('used_city')}
                                onClick={() => {
                                  setActiveDropdownSubmenu(activeDropdownSubmenu === 'used_city' ? null : 'used_city');
                                }}
                              >
                                <span className="sart-dropdown-item-label">Used {vehLabel} In Your City</span>
                                <i className="fa-solid fa-chevron-right sart-submenu-caret"></i>

                                {/* Submenu: Cities */}
                                {activeDropdownSubmenu === 'used_city' && (
                                  <div className="sart-dropdown-flyout animate-fade-in">
                                    {['Chennai', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Coimbatore', 'Pune', 'All Cities'].map((city) => (
                                      <div
                                        key={city}
                                        className="sart-dropdown-subitem"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCarbike360PageMode('used_catalog');
                                          setCardekhoViewMode('buy');
                                          setCardekhoVehicleCondition('used');
                                          setCardekhoCityFilter(city);
                                          if (city !== 'All Cities') setUserLocationCity(city);
                                          setUsedVehicleDropdownOpen(false);
                                          setActiveDropdownSubmenu(null);
                                          showToast(`Showing certified used ${vehLabel} in ${city}`);
                                        }}
                                      >
                                        <i className="fa-solid fa-location-dot subitem-icon icon-city"></i>
                                        <span>{city}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* 3. Used [Category] Valuation */}
                              <div
                                className="sart-dropdown-item"
                                onMouseEnter={() => setActiveDropdownSubmenu(null)}
                                onClick={() => {
                                  setCardekhoViewMode('sell');
                                  setUsedVehicleDropdownOpen(false);
                                  showToast(`Used ${vehLabel} Valuation: Calculate fair market resale price`);
                                }}
                              >
                                <span className="sart-dropdown-item-label">Used {vehLabel} Valuation</span>
                              </div>

                              {/* 4. Dealership Near Me */}
                              <div
                                className="sart-dropdown-item"
                                onMouseEnter={() => setActiveDropdownSubmenu(null)}
                                onClick={() => {
                                  setCarbike360PageMode('dealerships');
                                  setUsedVehicleDropdownOpen(false);
                                  showToast(`Showing Certified ${vehLabel} Dealerships near ${userLocationCity}`);
                                }}
                              >
                                <span className="sart-dropdown-item-label">Dealership Near Me</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* 3. SELL VEHICLE BUTTON */}
                  <button
                    type="button"
                    className={`sart-buysell-btn sell ${cardekhoViewMode === 'sell' ? 'active' : ''}`}
                    onClick={() => {
                      setCardekhoViewMode('sell');
                      setNewVehicleDropdownOpen(false);
                      setUsedVehicleDropdownOpen(false);
                      showToast('Opened Sell Your Vehicle • Instant Valuation');
                    }}
                  >
                    <i className="fa-solid fa-indian-rupee-sign"></i>
                    <span>Sell Vehicle</span>
                  </button>
                </div>
              </div>

              {/* If Sell Mode is Active inside container */}
              {cardekhoViewMode === 'sell' ? (
                <div className="cardekho-sell-container animate-scale">
                  <div className="sell-banner-left">
                    <span className="sell-flair"><i className="fa-solid fa-bolt"></i> INSTANT SELL IN 24 HOURS</span>
                    <h2>Sell Any Vehicle at Guaranteed Fair Market Price</h2>
                    <p>Cars, Bikes, Scooters, Autos, Commercial Vans, Lorries &amp; Buses. Free doorstep inspection and immediate bank transfer.</p>
                    <div className="sell-perks-list">
                      <div className="perk-item">
                        <i className="fa-solid fa-circle-check"></i>
                        <div><strong>Instant Online Valuation:</strong> Algorithmic fair pricing based on vehicle type, year and mileage.</div>
                      </div>
                      <div className="perk-item">
                        <i className="fa-solid fa-circle-check"></i>
                        <div><strong>Doorstep Evaluation:</strong> SART certified technician inspects at your home, depot or workshop.</div>
                      </div>
                      <div className="perk-item">
                        <i className="fa-solid fa-circle-check"></i>
                        <div><strong>Same-Day Payment:</strong> Direct RTGS/IMPS bank transfer before handover with complete RC transfer.</div>
                      </div>
                    </div>
                  </div>

                  <div className="sell-form-card">
                    <h3><i className="fa-solid fa-calculator"></i> Get Instant Price Quote</h3>
                    <div className="sell-form-grid">
                      <div className="form-field">
                        <label>Vehicle Category</label>
                        <select
                          value={cardekhoSelectedType}
                          onChange={(e) => setCardekhoSelectedType(e.target.value)}
                        >
                          <option value="Car">Car / SUV</option>
                          <option value="Bike">Bike / Scooter</option>
                          <option value="Auto">Auto (3-Wheeler)</option>
                          <option value="Van">Van / Commercial</option>
                          <option value="Lorry">Lorry / Heavy Truck (TruckDekho)</option>
                          <option value="Bus">Bus / Tourist Coach (BusDekho)</option>
                          <option value="Tractor">Tractor / Farm Equipment (TractorGuru)</option>
                          <option value="EV">Electric Vehicle (EV)</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label>Brand / Make</label>
                        <input
                          type="text"
                          value={sellFormVehicle.brand}
                          onChange={(e) => setSellFormVehicle({ ...sellFormVehicle, brand: e.target.value })}
                          placeholder="e.g. Maruti, Tata, Royal Enfield, Eicher"
                        />
                      </div>

                      <div className="form-field">
                        <label>Model &amp; Variant</label>
                        <input
                          type="text"
                          value={sellFormVehicle.model}
                          onChange={(e) => setSellFormVehicle({ ...sellFormVehicle, model: e.target.value })}
                          placeholder="e.g. Swift, Classic 350, Signa"
                        />
                      </div>

                      <div className="form-field">
                        <label>Registration Year</label>
                        <select
                          value={sellFormVehicle.year}
                          onChange={(e) => setSellFormVehicle({ ...sellFormVehicle, year: e.target.value })}
                        >
                          {['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'].map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-field">
                        <label>Kilometers Driven</label>
                        <input
                          type="text"
                          value={sellFormVehicle.kms}
                          onChange={(e) => setSellFormVehicle({ ...sellFormVehicle, kms: e.target.value })}
                          placeholder="e.g. 35,000 km"
                        />
                      </div>

                      <div className="form-field">
                        <label>Your Mobile Number</label>
                        <input
                          type="tel"
                          value={sellFormVehicle.phone}
                          onChange={(e) => setSellFormVehicle({ ...sellFormVehicle, phone: e.target.value })}
                          placeholder="Enter 10-digit mobile number"
                        />
                      </div>
                    </div>

                    <div className="sell-estimated-quote-box">
                      <span className="quote-label">Estimated Resale Value:</span>
                      <span className="quote-value">₹{sellFormVehicle.expectedPrice}</span>
                    </div>

                    <button
                      type="button"
                      className="btn-sell-submit"
                      onClick={() => {
                        if (!sellFormVehicle.phone) {
                          showToast('Please enter mobile number for vehicle valuation callback');
                          return;
                        }
                        showToast(`Valuation booked for ${sellFormVehicle.year} ${sellFormVehicle.brand} ${sellFormVehicle.model}! Inspector will call ${sellFormVehicle.phone}`);
                      }}
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                      <span>Book Free Doorstep Evaluation &amp; Sell</span>
                    </button>
                  </div>
                </div>
              ) : carbike360PageMode === 'portal_home' ? (
                <StoreVehicleFinderBar
                  cardekhoVehicleCondition={cardekhoVehicleCondition}
                  setCardekhoVehicleCondition={setCardekhoVehicleCondition}
                  cardekhoSelectedType={cardekhoSelectedType}
                  setCardekhoSelectedType={setCardekhoSelectedType}
                  cardekhoBrandFilter={cardekhoBrandFilter}
                  setCardekhoBrandFilter={setCardekhoBrandFilter}
                  cardekhoModelFilter={cardekhoModelFilter}
                  setCardekhoModelFilter={setCardekhoModelFilter}
                  cardekhoBodyTypeFilter={cardekhoBodyTypeFilter}
                  setCardekhoBodyTypeFilter={setCardekhoBodyTypeFilter}
                  cardekhoSearchBy={cardekhoSearchBy}
                  setCardekhoSearchBy={setCardekhoSearchBy}
                  cardekhoBudgetFilter={cardekhoBudgetFilter}
                  setCardekhoBudgetFilter={setCardekhoBudgetFilter}
                  cardekhoCityFilter={cardekhoCityFilter}
                  setCardekhoCityFilter={setCardekhoCityFilter}
                  showToast={showToast}
                />
              ) : (
                /* Sleek Status Bar when on a dedicated CarBike360 page */
                <div className="cb360-quick-status-bar animate-fade-in">
                  <div className="cb360-quick-status-left">
                    <span className="cb360-active-mode-badge">
                      <i className="fa-solid fa-layer-group"></i>
                      {carbike360PageMode === 'find_new' ? 'CarBike360 • New Cars in India' :
                       carbike360PageMode === 'latest' ? 'CarBike360 • Latest Cars in India' :
                       carbike360PageMode === 'upcoming' ? 'CarBike360 • Upcoming Cars 2026' :
                       carbike360PageMode === 'electric' ? 'CarBike360 • 100% Electric Vehicles' :
                       carbike360PageMode === 'trending' ? 'CarBike360 • Trending Cars' :
                       carbike360PageMode === 'used_catalog' ? 'CarBike360 • Certified Pre-Owned' : 'CarBike360 • Dealerships'}
                    </span>
                    <span className="cb360-active-city-note">
                      <i className="fa-solid fa-location-dot"></i> City: <strong>{userLocationCity}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="cb360-top-return-portal-btn"
                    onClick={() => {
                      setCarbike360PageMode('portal_home');
                      showToast('Returned to Portal Overview & Multi-Vehicle Finder');
                    }}
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Back to Portal Overview</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. FULL-PAGE CARDS GRID: Strictly matches selected vehicle type, brand, model, city, and body type without unrelated cards */}
            {cardekhoViewMode !== 'sell' && (
              <>
                {/* A. CARBIKE360 DEDICATED VIEWS BASED ON DROPDOWN CLICK */}
                {carbike360PageMode === 'find_new' && (
                  <Carbike360FindNewView
                    cardekhoSelectedType={cardekhoSelectedType}
                    setCardekhoSelectedType={setCardekhoSelectedType}
                    cb360PriceRange={cb360PriceRange}
                    setCb360PriceRange={setCb360PriceRange}
                    cb360SelectedBrands={cb360SelectedBrands}
                    setCb360SelectedBrands={setCb360SelectedBrands}
                    cb360SelectedBodyTypes={cb360SelectedBodyTypes}
                    setCb360SelectedBodyTypes={setCb360SelectedBodyTypes}
                    cb360SelectedFuels={cb360SelectedFuels}
                    setCb360SelectedFuels={setCb360SelectedFuels}
                    cb360SelectedTransmissions={cb360SelectedTransmissions}
                    setCb360SelectedTransmissions={setCb360SelectedTransmissions}
                    cb360SelectedSeating={cb360SelectedSeating}
                    setCb360SelectedSeating={setCb360SelectedSeating}
                    cb360SortBy={cb360SortBy}
                    setCb360SortBy={setCb360SortBy}
                    userLocationCity={userLocationCity}
                    onSelectOnRoadPrice={(v) => setOnRoadPriceModalVehicle(v)}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                  />
                )}

                {carbike360PageMode === 'latest' && (
                  <Carbike360LatestView
                    userLocationCity={userLocationCity}
                    onSelectOnRoadPrice={(v) => setOnRoadPriceModalVehicle(v)}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                    onSelectBrand={(brand) => {
                      setCarbike360PageMode('find_new');
                      setCb360SelectedBrands([brand]);
                      showToast(`Filtered for ${brand} cars`);
                    }}
                  />
                )}

                {carbike360PageMode === 'upcoming' && (
                  <Carbike360UpcomingView
                    userLocationCity={userLocationCity}
                    cb360UpcomingBrand={cb360UpcomingBrand}
                    setCb360UpcomingBrand={setCb360UpcomingBrand}
                    cb360UpcomingBodyType={cb360UpcomingBodyType}
                    setCb360UpcomingBodyType={setCb360UpcomingBodyType}
                    cb360UpcomingBudget={cb360UpcomingBudget}
                    setCb360UpcomingBudget={setCb360UpcomingBudget}
                    cb360FaqOpenIndex={cb360FaqOpenIndex}
                    setCb360FaqOpenIndex={setCb360FaqOpenIndex}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                  />
                )}

                {carbike360PageMode === 'electric' && (
                  <Carbike360ElectricView
                    userLocationCity={userLocationCity}
                    onSelectOnRoadPrice={(v) => setOnRoadPriceModalVehicle(v)}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                  />
                )}

                {carbike360PageMode === 'trending' && (
                  <Carbike360TrendingView
                    userLocationCity={userLocationCity}
                    onSelectOnRoadPrice={(v) => setOnRoadPriceModalVehicle(v)}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                  />
                )}

                {carbike360PageMode === 'used_catalog' && (
                  <Carbike360UsedCatalogView
                    cardekhoSelectedType={cardekhoSelectedType}
                    setCardekhoSelectedType={setCardekhoSelectedType}
                    userLocationCity={userLocationCity}
                    setUserLocationCity={setUserLocationCity}
                    cardekhoCityFilter={cardekhoCityFilter}
                    setCardekhoCityFilter={setCardekhoCityFilter}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                  />
                )}

                {carbike360PageMode === 'dealerships' && (
                  <Carbike360DealershipsView
                    userLocationCity={userLocationCity}
                    setUserLocationCity={setUserLocationCity}
                    onBackToPortal={() => setCarbike360PageMode('portal_home')}
                    showToast={showToast}
                  />
                )}

                {/* B. DEFAULT PORTAL OVERVIEW (When carbike360PageMode === 'portal_home') */}
                {/* B. DEFAULT PORTAL OVERVIEW (Modularized into StoreBuySellPortalOverview) */}
                {carbike360PageMode === 'portal_home' && (
                  <StoreBuySellPortalOverview
                    cardekhoVehicleCondition={cardekhoVehicleCondition}
                    cardekhoSelectedType={cardekhoSelectedType}
                    cardekhoSearchBy={cardekhoSearchBy}
                    cardekhoBrandFilter={cardekhoBrandFilter}
                    setCardekhoBrandFilter={setCardekhoBrandFilter}
                    cardekhoModelFilter={cardekhoModelFilter}
                    setCardekhoModelFilter={setCardekhoModelFilter}
                    cardekhoBodyTypeFilter={cardekhoBodyTypeFilter}
                    setCardekhoBodyTypeFilter={setCardekhoBodyTypeFilter}
                    cardekhoBudgetFilter={cardekhoBudgetFilter}
                    setCardekhoBudgetFilter={setCardekhoBudgetFilter}
                    homeCarSubCategory={homeCarSubCategory}
                    setHomeCarSubCategory={setHomeCarSubCategory}
                    homeBikeSubCategory={homeBikeSubCategory}
                    setHomeBikeSubCategory={setHomeBikeSubCategory}
                    homeCommercialSubCategory={homeCommercialSubCategory}
                    setHomeCommercialSubCategory={setHomeCommercialSubCategory}
                    userLocationCity={userLocationCity}
                    selectedFuelCity={selectedFuelCity}
                    showToast={showToast}
                    setActiveHubTab={setActiveHubTab}
                    setCarbike360PageMode={setCarbike360PageMode}
                    setCardekhoSelectedType={setCardekhoSelectedType}
                    setCardekhoSearchBy={setCardekhoSearchBy}
                    cardekhoCityFilter={cardekhoCityFilter}
                    setCardekhoCityFilter={setCardekhoCityFilter}
                    topVehicleSearch={topVehicleSearch}
                    setCardekhoVehicleCondition={setCardekhoVehicleCondition}
                  />
                )}
            </>
          )}
          </section>
  );
}
