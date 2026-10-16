'use client';

import React, { useEffect, useMemo, useState } from 'react';
import './StoreTab.css';
import { useSartStore } from '@/store/useSartStore';
import {
  EquipmentOption,
  VehicleType,
  StoreHubTab,
  MainCategory,
  StoreProduct,
  NearbyStore,
  VEHICLE_SPECIFIC_CATEGORIES,
  VEHICLE_TYPES,
  BRANDS_BY_VEHICLE,
  MODELS_BY_BRAND,
  YEARS_LIST,
  NEARBY_STORES,
  NEW_LAUNCH_PRODUCTS,
  TRENDING_PRODUCTS,
  TOP_SELLING_PRODUCTS,
  CATALOG_ITEMS,
  ALL_STORE_PRODUCTS,
  formatPrice
} from './storeProductsData';
import { VehicleShowcaseItem } from './storeData';
import { Carbike360OnRoadPriceModal } from './CarBike360Views';

// Subcomponents for each SART Automotive Hub Tab
import StoreBuySellHub from './store/StoreBuySellHub';
import StoreSparesHub from './store/StoreSparesHub';
import StoreServicesHub from './store/StoreServicesHub';
import StoreCompareHub from './store/StoreCompareHub';
import StoreFuelHub from './store/StoreFuelHub';
import StoreFinanceHub from './store/StoreFinanceHub';
import StoreSosHub from './store/StoreSosHub';

// Re-export types & products for other tabs (e.g. FavoritesTab)
export type { EquipmentOption, VehicleType, StoreHubTab, MainCategory, StoreProduct, NearbyStore };
export {
  VEHICLE_SPECIFIC_CATEGORIES,
  VEHICLE_TYPES,
  BRANDS_BY_VEHICLE,
  MODELS_BY_BRAND,
  YEARS_LIST,
  NEARBY_STORES,
  NEW_LAUNCH_PRODUCTS,
  TRENDING_PRODUCTS,
  TOP_SELLING_PRODUCTS,
  CATALOG_ITEMS,
  ALL_STORE_PRODUCTS,
  formatPrice
};

interface SavedGarageVehicle {
  id: string;
  type: string;
  brand: string;
  model: string;
  year: string;
  fuel: string;
  regNumber?: string;
  nickname?: string;
}

export default function StoreTab() {
  const { activeTab, addToCart, wishlist, toggleWishlist } = useSartStore();
  const [mounted, setMounted] = useState(false);

  // Top Vehicle Selector State
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('Car');
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState<string>('All Categories');
  const [selectedBrand, setSelectedBrand] = useState<string>('Maruti Suzuki');
  const [selectedModel, setSelectedModel] = useState<string>('Swift');
  const [selectedYear, setSelectedYear] = useState<string>('2023');
  const [selectedFuel, setSelectedFuel] = useState<string>('Petrol');

  // Garage and Applied Search
  const [garageActive, setGarageActive] = useState<boolean>(true);
  const [appliedVehicleSearch, setAppliedVehicleSearch] = useState<{
    type: string;
    brand: string;
    model: string;
    year: string;
    fuel: string;
    category: string;
  } | null>({
    type: 'Car',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    year: '2023',
    fuel: 'Petrol',
    category: 'All Categories',
  });

  const [savedVehicles, setSavedVehicles] = useState<SavedGarageVehicle[]>([
    {
      id: 'v-1',
      type: 'Car',
      brand: 'Maruti Suzuki',
      model: 'Swift',
      year: '2023',
      fuel: 'Petrol',
      nickname: 'Daily Swift',
      regNumber: 'TN 09 BX 2023',
    },
    {
      id: 'v-2',
      type: 'Bike',
      brand: 'Royal Enfield',
      model: 'Classic 350',
      year: '2022',
      fuel: 'Petrol',
      nickname: 'Bullet 350',
      regNumber: 'TN 07 AB 3500',
    },
  ]);
  const [activeVehicleId, setActiveVehicleId] = useState<string>('v-1');

  // Add Vehicle Modal State
  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false);
  const [newVehicleType, setNewVehicleType] = useState<string>('Car');
  const [newVehicleBrand, setNewVehicleBrand] = useState<string>('Hyundai');
  const [newVehicleModel, setNewVehicleModel] = useState<string>('Creta');
  const [newVehicleYear, setNewVehicleYear] = useState<string>('2024');
  const [newVehicleFuel, setNewVehicleFuel] = useState<string>('Petrol');
  const [newVehicleNickname, setNewVehicleNickname] = useState<string>('');
  const [newVehicleReg, setNewVehicleReg] = useState<string>('');

  // Store fulfillment & Nearby Store Modal
  const [fulfillmentMode, setFulfillmentMode] = useState<'delivery' | 'nearby'>('delivery');
  const [showStoreLocatorModal, setShowStoreLocatorModal] = useState<boolean>(false);
  const [nearbyStoreFilter, setNearbyStoreFilter] = useState<'all' | 'store' | 'mechanic' | 'service_center' | 'modification'>('all');
  const [preferredStore, setPreferredStore] = useState<NearbyStore>(NEARBY_STORES[0]);

  // Search & Category Filters
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MainCategory>('All');

  // Equipment add-on selection for services
  const [selectedEquipment, setSelectedEquipment] = useState<Record<string, string[]>>({});
  const [customVehicleNote, setCustomVehicleNote] = useState<Record<string, string>>({});
  const [selectedProductModal, setSelectedProductModal] = useState<StoreProduct | null>(null);

  // Active SART Automotive Hub Tab
  const [activeHubTab, setActiveHubTab] = useState<StoreHubTab>('buy_sell');

  // Location & Top Search
  const [userLocationCity, setUserLocationCity] = useState<string>('Chennai');
  const [selectedFuelCity, setSelectedFuelCity] = useState<string>('Chennai');
  const [topVehicleSearch, setTopVehicleSearch] = useState<string>('');

  // On-Road Price Modal
  const [onRoadPriceModalVehicle, setOnRoadPriceModalVehicle] = useState<VehicleShowcaseItem | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const availableBrands = useMemo(() => {
    return BRANDS_BY_VEHICLE[selectedVehicleType] || ['Universal Brands'];
  }, [selectedVehicleType]);

  const availableModels = useMemo(() => {
    return MODELS_BY_BRAND[selectedBrand] || ['All Models / Universal'];
  }, [selectedBrand]);

  const modalAvailableBrands = useMemo(() => {
    return BRANDS_BY_VEHICLE[newVehicleType] || ['Universal Brands'];
  }, [newVehicleType]);

  const modalAvailableModels = useMemo(() => {
    return MODELS_BY_BRAND[newVehicleBrand] || ['All Models / Universal'];
  }, [newVehicleBrand]);

  const handleModalVehicleTypeChange = (type: string) => {
    setNewVehicleType(type);
    const brands = BRANDS_BY_VEHICLE[type] || [];
    const firstBrand = brands[0] || 'Universal';
    setNewVehicleBrand(firstBrand);
    const models = MODELS_BY_BRAND[firstBrand] || [];
    setNewVehicleModel(models[0] || 'All Models');
  };

  const handleModalBrandChange = (brand: string) => {
    setNewVehicleBrand(brand);
    const models = MODELS_BY_BRAND[brand] || [];
    setNewVehicleModel(models[0] || 'All Models');
  };

  const handleVehicleTypeChange = (type: string) => {
    setSelectedVehicleType(type);
    setSelectedVehicleCategory('All Categories');
    const brands = BRANDS_BY_VEHICLE[type] || [];
    const firstBrand = brands[0] || 'Universal';
    setSelectedBrand(firstBrand);
    const models = MODELS_BY_BRAND[firstBrand] || [];
    setSelectedModel(models[0] || 'All Models');
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const models = MODELS_BY_BRAND[brand] || [];
    setSelectedModel(models[0] || 'All Models');
  };

  const handleSaveNewVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `v-${Date.now()}`;
    const newVeh: SavedGarageVehicle = {
      id: newId,
      type: newVehicleType,
      brand: newVehicleBrand,
      model: newVehicleModel,
      year: newVehicleYear,
      fuel: newVehicleFuel,
      nickname: newVehicleNickname.trim() || `${newVehicleBrand} ${newVehicleModel}`,
      regNumber: newVehicleReg.trim().toUpperCase(),
    };

    setSavedVehicles((prev) => [newVeh, ...prev]);
    setActiveVehicleId(newId);
    setSelectedVehicleType(newVeh.type);
    setSelectedBrand(newVeh.brand);
    setSelectedModel(newVeh.model);
    setSelectedYear(newVeh.year);
    setSelectedFuel(newVeh.fuel);
    setSelectedVehicleCategory('All Categories');
    setGarageActive(true);
    setAppliedVehicleSearch({
      type: newVeh.type,
      brand: newVeh.brand,
      model: newVeh.model,
      year: newVeh.year,
      fuel: newVeh.fuel,
      category: 'All Categories',
    });

    setShowAddVehicleModal(false);
    setNewVehicleNickname('');
    setNewVehicleReg('');
    showToast(`Vehicle Added! Showing exact parts & services for ${newVeh.brand} ${newVeh.model}`);
  };

  const handleApplyVehicleSearch = () => {
    setGarageActive(true);
    setAppliedVehicleSearch({
      type: selectedVehicleType,
      brand: selectedBrand,
      model: selectedModel,
      year: selectedYear,
      fuel: selectedFuel,
      category: selectedVehicleCategory,
    });
    showToast(`Showing parts & services for: ${selectedYear} ${selectedBrand} ${selectedModel} (${selectedVehicleType})`);
  };

  const filteredNearbyStores = useMemo(() => {
    if (nearbyStoreFilter === 'all') return NEARBY_STORES;
    return NEARBY_STORES.filter((s) => s.hubCategory === nearbyStoreFilter);
  }, [nearbyStoreFilter]);

  const getSelectedEquipmentItems = (product: StoreProduct) => {
    return (product.equipmentOptions || []).filter((opt) =>
      (selectedEquipment[product.id] ?? []).includes(opt.name)
    );
  };

  const getProductTotalPrice = (product: StoreProduct) => {
    const addOnsTotal = getSelectedEquipmentItems(product).reduce((sum, o) => sum + o.price, 0);
    return product.price + addOnsTotal;
  };

  const toggleEquipmentOption = (productId: string, optionName: string) => {
    setSelectedEquipment((prev) => {
      const current = prev[productId] ?? [];
      const updated = current.includes(optionName)
        ? current.filter((n) => n !== optionName)
        : [...current, optionName];
      return { ...prev, [productId]: updated };
    });
  };

  const handleAddToCart = (product: StoreProduct) => {
    const chosenAddOns = getSelectedEquipmentItems(product);
    const userModelNote = customVehicleNote[product.id]?.trim();
    const vehicleSpec = garageActive ? `${selectedBrand} ${selectedModel} (${selectedYear})` : '';

    const details = [
      product.name,
      vehicleSpec ? `Vehicle: ${vehicleSpec}` : '',
      userModelNote ? `Note: ${userModelNote}` : '',
      chosenAddOns.length ? `Add-ons: ${chosenAddOns.map((a) => a.name).join(', ')}` : '',
      fulfillmentMode === 'nearby' ? `Pickup: ${preferredStore.name}` : 'Home Delivery',
    ]
      .filter(Boolean)
      .join(' | ');

    addToCart({
      id: `${product.id}-${Date.now()}`,
      name: details,
      price: getProductTotalPrice(product),
      icon: product.icon || 'fa-box',
      category: product.category,
      quantity: 1,
    });

    showToast(`Added to Cart: ${product.name}`);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openReactModal', { detail: 'modal-cart' }));
    }
  };

  if (!mounted) return null;

  return (
    <section className={`tab-screen ${activeTab === 'store' ? 'active' : ''}`} id="tab-store">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="store-toast-alert animate-pop">
          <i className="fa-solid fa-circle-check"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP CLEAN WHITE HEADER: 7 BUTTONS + SEARCH BAR + LOCATION ALL IN A SINGLE ROW */}
      <div className="store-top-bar-clean">
        <div className="store-top-bar-content">
          <div className="store-single-row-header">
            {/* Left: All 7 Buttons */}
            <div className="sart-super-hub-nav single-row-nav">
              {[
                { id: 'buy_sell', label: 'Buy / Sell Vehicle', icon: 'fa-car-side' },
                { id: 'spare_parts', label: 'Spare Parts & Accessories', icon: 'fa-gears' },
                { id: 'mechanic_service', label: 'Mechanic & Service', icon: 'fa-wrench' },
                { id: 'emergency_sos', label: '24/7 Roadside Assistance', icon: 'fa-truck-medical', badge: 'SOS' },
                { id: 'compare_vehicles', label: 'Compare Vehicles', icon: 'fa-code-compare' },
                { id: 'ev_fuel_stations', label: 'EV & Fuel Prices', icon: 'fa-charging-station' },
                { id: 'finance_insurance', label: 'EMI & Loan', icon: 'fa-calculator' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`super-hub-tab-btn ${activeHubTab === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveHubTab(tab.id as StoreHubTab);
                    showToast(`Opened ${tab.label}`);
                  }}
                  title={tab.label}
                >
                  <i className={`fa-solid ${tab.icon} tab-direct-icon`}></i>
                  <span className="tab-main-label">{tab.label}</span>
                  {tab.badge && (
                    <span className="tab-badge-pill badge-alert">{tab.badge}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Right: Search Bar & Location Chooser */}
            <div className="store-top-actions-right">
              {/* Search Bar Pill */}
              <div className="store-top-search-pill">
                <input
                  type="text"
                  placeholder="Search cars, bikes, scooters..."
                  value={topVehicleSearch}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTopVehicleSearch(val);
                    if (activeHubTab !== 'buy_sell' && val.trim()) {
                      setActiveHubTab('buy_sell');
                    }
                  }}
                  className="top-search-input"
                />
                {topVehicleSearch && (
                  <button
                    type="button"
                    className="top-search-clear-btn"
                    onClick={() => setTopVehicleSearch('')}
                    title="Clear search"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              {/* Location Chooser Pill */}
              <div className="store-top-location-picker">
                <div className="location-pin-wrap">
                  <i className="fa-solid fa-location-dot location-dot-icon"></i>
                  <span className="location-online-dot"></span>
                </div>
                <select
                  value={userLocationCity}
                  onChange={(e) => {
                    const newCity = e.target.value;
                    setUserLocationCity(newCity);
                    setSelectedFuelCity(newCity);
                    showToast(`Location updated to ${newCity}`);
                  }}
                  className="location-city-select"
                >
                  <option value="Chennai">Chennai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Pune">Pune</option>
                </select>
                <i className="fa-solid fa-chevron-down location-arrow-icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="store-container">
        {/* TAB 1: BUY / SELL VEHICLE */}
        {activeHubTab === 'buy_sell' && (
          <StoreBuySellHub
            showToast={showToast}
            userLocationCity={userLocationCity}
            setUserLocationCity={setUserLocationCity}
            topVehicleSearch={topVehicleSearch}
            setTopVehicleSearch={setTopVehicleSearch}
            setOnRoadPriceModalVehicle={setOnRoadPriceModalVehicle}
            selectedFuelCity={selectedFuelCity}
            setActiveHubTab={setActiveHubTab}
          />
        )}

        {/* TAB 2: SPARE PARTS & ACCESSORIES */}
        {activeHubTab === 'spare_parts' && (
          <StoreSparesHub
            showToast={showToast}
            setSelectedProductModal={setSelectedProductModal}
            handleAddToCart={handleAddToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            selectedVehicleType={selectedVehicleType}
            selectedBrand={selectedBrand}
            selectedModel={selectedModel}
            selectedYear={selectedYear}
            selectedFuel={selectedFuel}
            setSelectedFuel={setSelectedFuel}
            garageActive={garageActive}
            setShowAddVehicleModal={setShowAddVehicleModal}
            appliedVehicleSearch={appliedVehicleSearch}
            handleVehicleTypeChange={handleVehicleTypeChange}
            availableBrands={availableBrands}
            handleBrandChange={handleBrandChange}
            setSelectedModel={setSelectedModel}
            availableModels={availableModels}
            setSelectedYear={setSelectedYear}
            handleApplyVehicleSearch={handleApplyVehicleSearch}
            search={search}
            setSearch={setSearch}
          />
        )}

        {/* TAB 3: MECHANIC & SERVICE */}
        {activeHubTab === 'mechanic_service' && (
          <StoreServicesHub
            showToast={showToast}
            setSelectedProductModal={setSelectedProductModal}
            handleAddToCart={handleAddToCart}
            selectedBrand={selectedBrand}
            selectedModel={selectedModel}
            selectedYear={selectedYear}
            selectedEquipment={selectedEquipment}
            getProductTotalPrice={getProductTotalPrice}
          />
        )}

        {/* TAB 4: COMPARE VEHICLES */}
        {activeHubTab === 'compare_vehicles' && (
          <StoreCompareHub
            showToast={showToast}
            userLocationCity={userLocationCity}
          />
        )}

        {/* TAB 5: EV & FUEL STATIONS */}
        {activeHubTab === 'ev_fuel_stations' && (
          <StoreFuelHub
            showToast={showToast}
            selectedFuelCity={selectedFuelCity}
            setSelectedFuelCity={setSelectedFuelCity}
          />
        )}

        {/* TAB 6: FINANCE & INSURANCE */}
        {activeHubTab === 'finance_insurance' && (
          <StoreFinanceHub
            showToast={showToast}
            userLocationCity={userLocationCity}
            setActiveHubTab={setActiveHubTab}
          />
        )}

        {/* TAB 7: 24/7 ROADSIDE SOS */}
        {activeHubTab === 'emergency_sos' && (
          <StoreSosHub showToast={showToast} />
        )}

        {/* 6. TRUST & BRAND BENEFITS (AutoZone / Boodmo style trust badges) */}
        <div className="store-trust-grid">
          <div className="trust-card">
            <div className="trust-icon-box">
              <i className="fa-solid fa-certificate"></i>
            </div>
            <h4>100% Genuine Auto Parts</h4>
            <p>Direct sourcing from authorized OEM &amp; OES global automotive suppliers.</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon-box">
              <i className="fa-solid fa-truck-ramp-box"></i>
            </div>
            <h4>Fast Delivery or Store Pickup</h4>
            <p>Get doorstep delivery or pick up in 15 minutes at 2,400+ verified partner hubs.</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon-box">
              <i className="fa-solid fa-rotate-left"></i>
            </div>
            <h4>Hassle-Free 10-Day Returns</h4>
            <p>Guaranteed compatibility check with zero-question return &amp; instant refund.</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon-box">
              <i className="fa-solid fa-headset"></i>
            </div>
            <h4>24x7 Expert Auto Support</h4>
            <p>Certified automotive engineers ready to assist with part numbers &amp; fitment.</p>
          </div>
        </div>

      </div>

      {/* 7. NEARBY STORE LOCATOR MODAL (Reference AutoZone / Boodmo) */}
      {showStoreLocatorModal && (
        <div className="modal-backdrop-store" onClick={() => setShowStoreLocatorModal(false)}>
          <div
            className="store-locator-modal animate-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-store">
              <div className="modal-title-wrap">
                <i className="fa-solid fa-shop"></i>
                <div>
                  <h3>Select Nearby Auto Store &amp; Fitment Hub</h3>
                  <p>Choose your preferred store for instant pickup, fitting or doorstep dispatch.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowStoreLocatorModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="modal-body-stores">
              {/* Hub Category Filter Tabs */}
              <div className="modal-hub-filter-tabs">
                {[
                  { id: 'all', label: 'All Locations', icon: 'fa-location-dot' },
                  { id: 'mechanic', label: 'Nearby Mechanics', icon: 'fa-wrench' },
                  { id: 'service_center', label: 'Service Centers', icon: 'fa-building-shield' },
                  { id: 'modification', label: 'Vehicle Modification', icon: 'fa-wand-magic-sparkles' },
                  { id: 'store', label: 'Auto Parts Stores', icon: 'fa-shop' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`hub-filter-tab-btn ${nearbyStoreFilter === tab.id ? 'active' : ''}`}
                    onClick={() => setNearbyStoreFilter(tab.id as any)}
                  >
                    <i className={`fa-solid ${tab.icon}`}></i>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="store-list-container">
                {filteredNearbyStores.map((store) => (
                  <div
                    key={store.id}
                    className={`store-item-card ${preferredStore.id === store.id ? 'selected' : ''}`}
                    onClick={() => {
                      setPreferredStore(store);
                      setFulfillmentMode('nearby');
                      setShowStoreLocatorModal(false);
                      showToast(`Selected Store: ${store.name}`);
                    }}
                  >
                    <div className="store-item-header">
                      <div>
                        <div className="store-name-row">
                          <h4 className="store-item-name">{store.name}</h4>
                          <span className={`hub-category-tag tag-${store.hubCategory}`}>
                            {store.hubCategory === 'mechanic' && '🛠️ On-Demand Mechanic'}
                            {store.hubCategory === 'service_center' && '🏢 Authorized Service Center'}
                            {store.hubCategory === 'modification' && '✨ Modification & Tuning Studio'}
                            {store.hubCategory === 'store' && '📦 Auto Spares Hub'}
                          </span>
                        </div>
                        <span className="store-type-badge">{store.type}</span>
                      </div>
                      <div className="store-distance-box">
                        <span className="store-dist">{store.distance}</span>
                        <span className="store-rating">
                          <i className="fa-solid fa-star"></i> {store.rating} ({store.reviews})
                        </span>
                      </div>
                    </div>

                    <p className="store-address-text">
                      <i className="fa-solid fa-location-dot"></i> {store.address}
                    </p>

                    <div className="store-status-row">
                      <span className="open-indicator">
                        <i className="fa-solid fa-clock"></i> {store.openStatus}
                      </span>
                      <span className="stock-count-indicator">
                        <i className="fa-solid fa-boxes-stacked"></i> {store.partsInStock}+ items in stock
                      </span>
                    </div>

                    <div className="store-services-pills">
                      {store.servicesAvailable.map((srv) => (
                        <span key={srv} className="srv-pill">
                          <i className="fa-solid fa-check"></i> {srv}
                        </span>
                      ))}
                    </div>

                    <div className="store-card-footer">
                      <span className="store-phone">
                        <i className="fa-solid fa-phone"></i> {store.phone}
                      </span>
                      <button
                        type="button"
                        className={`btn-select-store ${preferredStore.id === store.id ? 'btn-active' : ''}`}
                      >
                        {preferredStore.id === store.id ? '✓ Selected Store' : 'Select This Store'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {showAddVehicleModal && (
        <div className="store-locator-backdrop animate-pop" onClick={() => setShowAddVehicleModal(false)}>
          <div
            className="store-locator-modal add-vehicle-modal-card animate-scale"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-add-vehicle-title"
          >
            <div className="store-modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge">
                  <i className="fa-solid fa-car-side"></i>
                </div>
                <div>
                  <h3 id="modal-add-vehicle-title">Add Your Vehicle</h3>
                  <p>Save your vehicle to get exact compatible spare parts &amp; verified workshop services</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowAddVehicleModal(false)}
                aria-label="Close Modal"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form className="add-vehicle-modal-form" onSubmit={handleSaveNewVehicle}>
              {/* Vehicle Type */}
              <div className="modal-form-group">
                <label className="modal-form-label">
                  <i className="fa-solid fa-shapes"></i> Vehicle Type
                </label>
                <div className="modal-type-chips">
                  {VEHICLE_TYPES.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`modal-type-btn ${newVehicleType === v.id ? 'active' : ''}`}
                      onClick={() => handleModalVehicleTypeChange(v.id)}
                    >
                      <i className={`fa-solid ${v.icon}`}></i>
                      <span>{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand and Model Row */}
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label className="modal-form-label">
                    <i className="fa-solid fa-industry"></i> Brand / Manufacturer
                  </label>
                  <div className="select-wrapper">
                    <select
                      value={newVehicleBrand}
                      onChange={(e) => handleModalBrandChange(e.target.value)}
                      aria-label="Select Brand"
                    >
                      {modalAvailableBrands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down select-arrow"></i>
                  </div>
                </div>

                <div className="modal-form-group">
                  <label className="modal-form-label">
                    <i className="fa-solid fa-car-rear"></i> Model
                  </label>
                  <div className="select-wrapper">
                    <select
                      value={newVehicleModel}
                      onChange={(e) => setNewVehicleModel(e.target.value)}
                      aria-label="Select Model"
                    >
                      {modalAvailableModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down select-arrow"></i>
                  </div>
                </div>
              </div>

              {/* Year and Fuel Row */}
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label className="modal-form-label">
                    <i className="fa-regular fa-calendar"></i> Year
                  </label>
                  <div className="select-wrapper">
                    <select
                      value={newVehicleYear}
                      onChange={(e) => setNewVehicleYear(e.target.value)}
                      aria-label="Select Year"
                    >
                      {YEARS_LIST.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down select-arrow"></i>
                  </div>
                </div>

                <div className="modal-form-group">
                  <label className="modal-form-label">
                    <i className="fa-solid fa-gas-pump"></i> Fuel / Engine Type
                  </label>
                  <div className="select-wrapper">
                    <select
                      value={newVehicleFuel}
                      onChange={(e) => setNewVehicleFuel(e.target.value)}
                      aria-label="Select Fuel"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Electric">Electric / EV</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    <i className="fa-solid fa-chevron-down select-arrow"></i>
                  </div>
                </div>
              </div>

              {/* Optional Registration Number & Nickname */}
              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label className="modal-form-label">
                    <i className="fa-solid fa-id-card"></i> Vehicle Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={newVehicleReg}
                    onChange={(e) => setNewVehicleReg(e.target.value)}
                    placeholder="e.g. TN 09 BK 2024"
                    className="modal-text-input"
                  />
                </div>

                <div className="modal-form-group">
                  <label className="modal-form-label">
                    <i className="fa-solid fa-tag"></i> Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    value={newVehicleNickname}
                    onChange={(e) => setNewVehicleNickname(e.target.value)}
                    placeholder="e.g. My Weekend Beast"
                    className="modal-text-input"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowAddVehicleModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  <i className="fa-solid fa-car-circle-check"></i>
                  <span>Save &amp; View Vehicle Parts</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT QUICK-VIEW & BOOKING DETAIL MODAL */}
      {selectedProductModal && (
        <div
          className="store-locator-backdrop animate-pop"
          onClick={() => setSelectedProductModal(null)}
        >
          <div
            className="store-locator-modal product-quickview-modal-card animate-scale"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-product-title"
          >
            {/* Modal Header */}
            <div className="store-modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge">
                  <i className={`fa-solid ${selectedProductModal.icon || 'fa-box'}`}></i>
                </div>
                <div>
                  <h3 id="modal-product-title">{selectedProductModal.name}</h3>
                  <p>
                    Category: <strong>{selectedProductModal.category}</strong> • Vehicle: <strong>{selectedProductModal.vehicle}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setSelectedProductModal(null)}
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="product-quickview-body">
              {/* Product Media & Core Specs */}
              <div className="quickview-media-grid">
                <div className="quickview-image-box">
                  <img
                    src={selectedProductModal.image}
                    alt={selectedProductModal.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  {selectedProductModal.badge && (
                    <span className="catalog-card-badge">{selectedProductModal.badge}</span>
                  )}
                </div>

                <div className="quickview-summary-box">
                  <div className="quickview-price-banner">
                    <div>
                      <span className="total-label">Total Price:</span>
                      <div className="catalog-price-wrap">
                        <span className="quickview-current-price">
                          {formatPrice(getProductTotalPrice(selectedProductModal))}
                        </span>
                        {selectedProductModal.originalPrice && (
                          <span className="catalog-strike-price">
                            {formatPrice(selectedProductModal.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedProductModal.originalPrice && (
                      <span className="discount-tag">
                        Save {Math.round(((selectedProductModal.originalPrice - selectedProductModal.price) / selectedProductModal.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  <p className="quickview-desc">{selectedProductModal.desc}</p>

                  <div className="quickview-meta-badges">
                    {selectedProductModal.warranty && (
                      <span className="warranty-tag">
                        <i className="fa-solid fa-shield-halved"></i> Warranty: {selectedProductModal.warranty}
                      </span>
                    )}
                    {selectedProductModal.duration && (
                      <span className="duration-pill">
                        <i className="fa-regular fa-clock"></i> Duration: {selectedProductModal.duration}
                      </span>
                    )}
                    <span className="pickup-tag">
                      <i className="fa-solid fa-truck-ramp-box"></i> {fulfillmentMode === 'nearby' ? preferredStore.name : 'Doorstep Service / Delivery'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inclusions List */}
              {(selectedProductModal.includes || []).length > 0 && (
                <div className="quickview-section">
                  <h4 className="quickview-section-title">
                    <i className="fa-solid fa-circle-check"></i> What's Included:
                  </h4>
                  <div className="quickview-inc-grid">
                    {selectedProductModal.includes?.map((inc) => (
                      <div key={inc} className="quickview-inc-item">
                        <i className="fa-solid fa-check"></i>
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment & Recommended Add-ons */}
              {(selectedProductModal.equipmentOptions || []).length > 0 && (
                <div className="quickview-section">
                  <h4 className="quickview-section-title">
                    <i className="fa-solid fa-toolbox"></i> Optional Equipment &amp; Add-ons:
                  </h4>
                  <div className="quickview-addons-grid">
                    {selectedProductModal.equipmentOptions?.map((opt) => {
                      const isSelected = (selectedEquipment[selectedProductModal.id] ?? []).includes(opt.name);
                      return (
                        <label key={opt.name} className={`quickview-addon-label ${isSelected ? 'active' : ''}`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleEquipmentOption(selectedProductModal.id, opt.name)}
                          />
                          <span className="addon-text">{opt.name}</span>
                          <span className="addon-price">+{formatPrice(opt.price)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Vehicle Compatibility Banner */}
              <div className="quickview-fitment-bar">
                <i className="fa-solid fa-shield-cat"></i>
                <div>
                  <strong>Guaranteed Fitment:</strong> Compatible with {selectedProductModal.compatibleWith || selectedProductModal.vehicle || 'all verified models'}.
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="product-quickview-footer">
              <button
                type="button"
                className={`btn-quickview-wishlist ${wishlist.includes(selectedProductModal.id) ? 'active' : ''}`}
                onClick={() => {
                  toggleWishlist(selectedProductModal.id);
                  showToast(
                    wishlist.includes(selectedProductModal.id)
                      ? `Removed from Wishlist: ${selectedProductModal.name}`
                      : `Added to Wishlist: ${selectedProductModal.name}`
                  );
                }}
              >
                <i className={wishlist.includes(selectedProductModal.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                <span>{wishlist.includes(selectedProductModal.id) ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                type="button"
                className="btn-quickview-add-cart"
                onClick={() => {
                  handleAddToCart(selectedProductModal);
                  setSelectedProductModal(null);
                }}
              >
                <i className="fa-solid fa-cart-shopping"></i>
                <span>Add To Cart • {formatPrice(getProductTotalPrice(selectedProductModal))}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CarBike360 On-Road Price Breakdown Modal */}
      {onRoadPriceModalVehicle && (
        <Carbike360OnRoadPriceModal
          vehicle={onRoadPriceModalVehicle}
          userLocationCity={userLocationCity}
          onClose={() => setOnRoadPriceModalVehicle(null)}
          showToast={showToast}
        />
      )}
    </section>
  );
}
