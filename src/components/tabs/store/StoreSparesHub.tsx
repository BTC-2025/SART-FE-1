'use client';

import React, { useState } from 'react';
import {
  StoreProduct,
  formatPrice,
  CATALOG_ITEMS,
  NEW_LAUNCH_PRODUCTS,
  TRENDING_PRODUCTS,
  TOP_SELLING_PRODUCTS,
  ALL_STORE_PRODUCTS,
  VEHICLE_TYPES,
  YEARS_LIST
} from '../storeProductsData';

interface StoreSparesHubProps {
  showToast: (msg: string) => void;
  setSelectedProductModal: (product: StoreProduct) => void;
  handleAddToCart: (product: StoreProduct) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  selectedVehicleType: string;
  selectedBrand: string;
  selectedModel: string;
  selectedYear: string;
  selectedFuel: string;
  setSelectedFuel: (fuel: string) => void;
  garageActive: boolean;
  setShowAddVehicleModal: (open: boolean) => void;
  appliedVehicleSearch: {
    type: string;
    brand: string;
    model: string;
    year: string;
    fuel: string;
    category: string;
  } | null;
  handleVehicleTypeChange: (type: string) => void;
  availableBrands: string[];
  handleBrandChange: (brand: string) => void;
  setSelectedModel: (model: string) => void;
  availableModels: string[];
  setSelectedYear: (year: string) => void;
  handleApplyVehicleSearch: () => void;
  search: string;
  setSearch: (s: string) => void;
}

export default function StoreSparesHub({
  showToast,
  setSelectedProductModal,
  handleAddToCart,
  wishlist,
  toggleWishlist,
  selectedVehicleType,
  selectedBrand,
  selectedModel,
  selectedYear,
  selectedFuel,
  setSelectedFuel,
  garageActive,
  setShowAddVehicleModal,
  appliedVehicleSearch,
  handleVehicleTypeChange,
  availableBrands,
  handleBrandChange,
  setSelectedModel,
  availableModels,
  setSelectedYear,
  handleApplyVehicleSearch,
  search,
  setSearch
}: StoreSparesHubProps) {
  const [partsCategoryFilter, setPartsCategoryFilter] = useState<string>('All Spares & Accessories');

  return (
          <section className="boodmo-parts-view animate-pop">
            {/* 1. BOODMO VEHICLE FITMENT SELECTOR BAR: Type, Brand, Model, Year, Fuel */}
            <div className="boodmo-fitment-selector-card">
              <div className="fitment-header-row">
                <div className="fitment-title-wrap">
                  <i className="fa-solid fa-car-tunnel"></i>
                  <div>
                    <h3>Select Your Vehicle for 100% Guaranteed Fitment</h3>
                    <p>Enter make, model &amp; year to see compatible OEM &amp; OES genuine spare parts &amp; accessories.</p>
                  </div>
                </div>

                {appliedVehicleSearch && (
                  <div className="active-fitment-badge">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Fitment Active: <strong>{appliedVehicleSearch.year} {appliedVehicleSearch.brand} {appliedVehicleSearch.model}</strong></span>
                  </div>
                )}
              </div>

              <div className="boodmo-dropdown-row">
                {/* 1. Vehicle Type */}
                <div className="boodmo-select-col">
                  <label><i className="fa-solid fa-shapes"></i> 1. Vehicle Type</label>
                  <select
                    value={selectedVehicleType}
                    onChange={(e) => handleVehicleTypeChange(e.target.value)}
                  >
                    {VEHICLE_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Brand / Make */}
                <div className="boodmo-select-col">
                  <label><i className="fa-solid fa-copyright"></i> 2. Brand / Make</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                  >
                    {availableBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Model */}
                <div className="boodmo-select-col">
                  <label><i className="fa-solid fa-car-rear"></i> 3. Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    {availableModels.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Year */}
                <div className="boodmo-select-col">
                  <label><i className="fa-regular fa-calendar"></i> 4. Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {YEARS_LIST.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* 5. Variant / Fuel */}
                <div className="boodmo-select-col">
                  <label><i className="fa-solid fa-gas-pump"></i> 5. Fuel / Variant</label>
                  <select
                    value={selectedFuel}
                    onChange={(e) => setSelectedFuel(e.target.value)}
                  >
                    {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* Apply Button */}
                <div className="boodmo-btn-col">
                  <button
                    type="button"
                    className="btn-boodmo-find-parts"
                    onClick={handleApplyVehicleSearch}
                  >
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>Find Parts</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. SPLIT LAYOUT: Left Spare Categories Sidebar + Right E-Commerce Grid */}
            <div className="store-split-layout">
              {/* LEFT SIDEBAR: Spare Parts & Accessories Categories */}
              <aside className="store-left-sidebar">
                <div className="sidebar-card">
                  <div className="sidebar-header">
                    <h4><i className="fa-solid fa-boxes-stacked"></i> Spares Directory</h4>
                    <span className="sidebar-total-badge">{ALL_STORE_PRODUCTS.filter(p => !p.isService).length} Parts</span>
                  </div>

                  <div className="sidebar-nav-pills">
                    {[
                      { id: 'All Spares & Accessories', label: 'All Spares & Accessories', icon: 'fa-globe' },
                      { id: 'Engine & Fluids', label: 'Engine Oil & Fluids', icon: 'fa-oil-can' },
                      { id: 'Braking System', label: 'Brakes & Discs', icon: 'fa-circle-dot' },
                      { id: 'Filters & Plugs', label: 'Filters & Spark Plugs', icon: 'fa-filter' },
                      { id: 'Batteries & Electricals', label: 'Batteries & Alternator', icon: 'fa-car-battery' },
                      { id: 'Tyres & Wheels', label: 'Tyres & Wheel Care', icon: 'fa-circle-notch' },
                      { id: 'Lighting & Bulbs', label: 'LED Headlights & Bulbs', icon: 'fa-lightbulb' },
                      { id: 'Smart Electronics', label: 'Dashcam & Gadgets', icon: 'fa-video' },
                      { id: 'Accessories & Car Care', label: 'Accessories & Care Kit', icon: 'fa-spray-can-sparkles' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`sidebar-nav-item ${partsCategoryFilter === cat.id ? 'active' : ''}`}
                        onClick={() => setPartsCategoryFilter(cat.id)}
                      >
                        <i className={`fa-solid ${cat.icon}`}></i>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Boodmo Quality Assurance Box */}
                  <div className="sidebar-trust-box boodmo-trust">
                    <i className="fa-solid fa-barcode"></i>
                    <div>
                      <strong>OEM / OES Verified</strong>
                      <p>Every product includes genuine part number certification &amp; 10-day replacement.</p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* RIGHT CONTENT: Products Grid (Boodmo / Autoduken E-Commerce style) */}
              <main className="store-right-content">
                <div className="content-top-status-bar">
                  <div>
                    <h3 className="content-heading">
                      {appliedVehicleSearch
                        ? `Guaranteed Fitment for ${appliedVehicleSearch.brand} ${appliedVehicleSearch.model} (${appliedVehicleSearch.year})`
                        : 'Universal Genuine Spare Parts & Accessories'}
                    </h3>
                    <p className="content-subtext">
                      Showing verified replacement parts, synthetic lubricants, performance accessories &amp; fast doorstep dispatch.
                    </p>
                  </div>

                  {/* Search Bar for Spares */}
                  <div className="catalog-search-wrap parts-search-box">
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search part name, part number, brand..."
                      className="catalog-search-input"
                    />
                    {search && (
                      <button
                        type="button"
                        className="btn-search-clear"
                        onClick={() => setSearch('')}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* Product E-Commerce Cards Grid */}
                <div className="boodmo-products-grid">
                  {ALL_STORE_PRODUCTS
                    .filter((item) => !item.isService)
                    .filter((item) => {
                      if (partsCategoryFilter === 'All Spares & Accessories') return true;
                      const blob = `${item.name} ${item.desc} ${item.section} ${item.category}`.toLowerCase();
                      if (partsCategoryFilter === 'Engine & Fluids') return blob.includes('oil') || blob.includes('fluid') || blob.includes('synthetic');
                      if (partsCategoryFilter === 'Braking System') return blob.includes('brake') || blob.includes('disc') || blob.includes('pad');
                      if (partsCategoryFilter === 'Filters & Plugs') return blob.includes('filter') || blob.includes('plug');
                      if (partsCategoryFilter === 'Batteries & Electricals') return blob.includes('battery') || blob.includes('starter') || blob.includes('chamber');
                      if (partsCategoryFilter === 'Tyres & Wheels') return blob.includes('tyre') || blob.includes('puncture') || blob.includes('tpms');
                      if (partsCategoryFilter === 'Lighting & Bulbs') return blob.includes('led') || blob.includes('light') || blob.includes('bulb');
                      if (partsCategoryFilter === 'Smart Electronics') return blob.includes('dashcam') || blob.includes('gps') || blob.includes('charger') || blob.includes('phone mount');
                      if (partsCategoryFilter === 'Accessories & Car Care') return blob.includes('wax') || blob.includes('coating') || blob.includes('wiper') || blob.includes('horn');
                      return true;
                    })
                    .filter((item) => {
                      if (!search.trim()) return true;
                      const q = search.trim().toLowerCase();
                      return `${item.name} ${item.desc} ${item.vehicle} ${item.compatibleWith || ''}`.toLowerCase().includes(q);
                    })
                    .map((product) => (
                      <div
                        key={product.id}
                        className="boodmo-product-card cursor-pointer"
                        onClick={() => setSelectedProductModal(product)}
                      >
                        <div className="boodmo-card-media">
                          {product.badge && (
                            <span className="boodmo-badge-ribbon">{product.badge}</span>
                          )}
                          <button
                            type="button"
                            className={`btn-card-wishlist ${wishlist.includes(product.id) ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product.id);
                              showToast(
                                wishlist.includes(product.id)
                                  ? `Removed from Wishlist: ${product.name}`
                                  : `Added to Wishlist: ${product.name}`
                              );
                            }}
                          >
                            <i className={wishlist.includes(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                          </button>
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                          <div className="boodmo-fitment-indicator">
                            <i className="fa-solid fa-shield-check"></i>
                            <span>Compatible: {product.compatibleWith || product.vehicle || 'Universal'}</span>
                          </div>
                        </div>

                        <div className="boodmo-card-content">
                          <div className="boodmo-rating-row">
                            <div className="rating-badge">
                              <i className="fa-solid fa-star"></i> {product.rating || 4.8} <span>({product.reviewsCount || 150})</span>
                            </div>
                            <span className="delivery-time-pill">
                              <i className="fa-solid fa-truck-fast"></i> {product.deliveryTime || 'In 24-48 Hrs'}
                            </span>
                          </div>

                          <h4 className="boodmo-product-title" title={product.name}>{product.name}</h4>
                          <p className="boodmo-product-desc">{product.desc}</p>

                          <div className="boodmo-price-row">
                            <div className="price-info">
                              <span className="current-price">{formatPrice(product.price)}</span>
                              {product.originalPrice && (
                                <span className="original-price">{formatPrice(product.originalPrice)}</span>
                              )}
                            </div>
                            <button
                              type="button"
                              className="btn-boodmo-add-cart"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                            >
                              <i className="fa-solid fa-cart-shopping"></i>
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </main>
            </div>
          </section>
  );
}
