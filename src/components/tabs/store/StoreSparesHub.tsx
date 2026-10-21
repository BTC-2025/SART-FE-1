'use client';

import React, { useState, useMemo } from 'react';
import {
  StoreProduct,
  formatPrice,
  ALL_STORE_PRODUCTS,
  VEHICLE_TYPES,
  YEARS_LIST
} from '../storeProductsData';
import {
  BIKE_DETAILED_CATEGORIES,
  CAR_DETAILED_CATEGORIES,
  EXTENDED_ACCESSORIES_CATALOG,
  VehicleSpareCategory,
  getVehicleDetailedCategories
} from '../storeSparesAccessoriesData';

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
  onOpenAccessoriesPointModal?: () => void;
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
  appliedVehicleSearch,
  handleVehicleTypeChange,
  availableBrands,
  handleBrandChange,
  setSelectedModel,
  availableModels,
  setSelectedYear,
  handleApplyVehicleSearch,
  search,
  setSearch,
  onOpenAccessoriesPointModal
}: StoreSparesHubProps) {
  // Selected category filter
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    bike_engine: true,
    bike_aftermarket: false,
    car_engine_fluids: true
  });

  // Customizable Quick Filter Pills (Brand, Price Budget, Tyre & Gear filter)
  const [budgetFilter, setBudgetFilter] = useState<string>('all');
  const [customTagFilter, setCustomTagFilter] = useState<string>('all');

  // Toggle Category Accordion in Sidebar
  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Determine which detailed categories to show based on selected vehicle
  const activeDetailedCategories: VehicleSpareCategory[] = useMemo(() => {
    const effectiveType = appliedVehicleSearch ? appliedVehicleSearch.type : selectedVehicleType;
    return getVehicleDetailedCategories(effectiveType);
  }, [appliedVehicleSearch, selectedVehicleType]);

  // Combined master catalog including extended riding gear, tyres, dashcams
  const combinedCatalog: StoreProduct[] = useMemo(() => {
    const existingIds = new Set(ALL_STORE_PRODUCTS.map(p => p.id));
    const newItems = EXTENDED_ACCESSORIES_CATALOG.filter(p => !existingIds.has(p.id));
    return [...ALL_STORE_PRODUCTS, ...newItems].filter(item => !item.isService);
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return combinedCatalog.filter(item => {
      // 1. If fitment is active, check vehicle match or universal
      if (appliedVehicleSearch && appliedVehicleSearch.type) {
        const appliedTypeLower = appliedVehicleSearch.type.toLowerCase();
        const itemVehLower = (item.vehicle || '').toLowerCase();
        const compatLower = (item.compatibleWith || '').toLowerCase();
        const isMatch = itemVehLower === 'universal' || itemVehLower === appliedTypeLower || compatLower.includes(appliedTypeLower) || compatLower.includes('all');
        if (!isMatch) {
          return false;
        }
      }

      // 2. Category & Subcategory filter
      if (selectedSubItem) {
        const query = selectedSubItem.toLowerCase().trim();
        const blob = `${item.name} ${item.desc} ${item.section} ${item.category} ${item.compatibleWith || ''}`.toLowerCase();
        // search for subcategory keyword
        const words = query.split(/\s+/);
        const match = words.some(w => w.length > 3 && blob.includes(w));
        if (!match && !blob.includes(query.slice(0, 4))) return false;
      } else if (selectedCategoryId !== 'all') {
        const cat = activeDetailedCategories.find(c => c.id === selectedCategoryId);
        if (cat) {
          const blob = `${item.name} ${item.desc} ${item.section} ${item.category} ${item.compatibleWith || ''}`.toLowerCase();
          // match keywords of the main category
          const cleanName = cat.name.replace(/[0-9.]/g, '').toLowerCase();
          const keys = cleanName.split(/[,&/]+/).map(s => s.trim()).filter(Boolean);
          const hasMatch = keys.some(k => blob.includes(k.slice(0, 4)));
          if (!hasMatch) return false;
        }
      }

      // 3. Customizable Budget Filter
      if (budgetFilter !== 'all') {
        if (budgetFilter === 'under_1k' && item.price > 1000) return false;
        if (budgetFilter === '1k_3k' && (item.price < 1000 || item.price > 3000)) return false;
        if (budgetFilter === '3k_7k' && (item.price < 3000 || item.price > 7000)) return false;
        if (budgetFilter === 'above_7k' && item.price < 7000) return false;
      }

      // 4. Customizable Item Types (Tyres, Helmets, Goggles, Dashcam)
      if (customTagFilter !== 'all') {
        const text = `${item.name} ${item.desc} ${item.section}`.toLowerCase();
        if (customTagFilter === 'tyre' && !text.includes('tyre') && !text.includes('wheel')) return false;
        if (customTagFilter === 'helmet' && !text.includes('helmet') && !text.includes('visor')) return false;
        if (customTagFilter === 'goggles' && !text.includes('goggle') && !text.includes('glasses')) return false;
        if (customTagFilter === 'dash' && !text.includes('dashcam') && !text.includes('mount') && !text.includes('display')) return false;
        if (customTagFilter === 'wear' && !text.includes('jacket') && !text.includes('glove') && !text.includes('boot')) return false;
      }

      // 5. Text Search query
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return `${item.name} ${item.desc} ${item.vehicle} ${item.compatibleWith || ''}`.toLowerCase().includes(q);
      }

      return true;
    });
  }, [combinedCatalog, appliedVehicleSearch, selectedCategoryId, selectedSubItem, budgetFilter, customTagFilter, search, activeDetailedCategories]);

  return (
    <section className="boodmo-parts-view animate-pop">
      {/* 1. BOODMO VEHICLE FITMENT SELECTOR BAR: Type, Brand, Model, Year, Fuel (Default Empty Option) */}
      <div className="boodmo-fitment-selector-card">
        <div className="fitment-header-row">
          <div className="fitment-title-wrap">
            <i className="fa-solid fa-car-tunnel"></i>
            <div>
              <h3>Select Your Vehicle for 100% Guaranteed Fitment</h3>
              <p>Enter make, model &amp; year to see compatible OEM &amp; OES genuine spare parts &amp; direct-seller accessories.</p>
            </div>
          </div>

          <div className="fitment-actions-wrap">
            {appliedVehicleSearch && (
              <div className="active-fitment-badge">
                <i className="fa-solid fa-circle-check"></i>
                <span>Fitment Active: <strong>{appliedVehicleSearch.year} {appliedVehicleSearch.brand} {appliedVehicleSearch.model}</strong></span>
              </div>
            )}
            {onOpenAccessoriesPointModal && (
              <button
                type="button"
                className="btn-top-accessories-point"
                onClick={onOpenAccessoriesPointModal}
                title="View Nearby Authorized Accessories & Spares Hubs"
              >
                <i className="fa-solid fa-map-location-dot"></i>
                <span>Accessories Point 📍</span>
              </button>
            )}
          </div>
        </div>

        <div className="boodmo-dropdown-row">
          {/* 1. Vehicle Type */}
          <div className="boodmo-select-col">
            <label><i className="fa-solid fa-shapes"></i> 1. Vehicle Type</label>
            <select
              value={selectedVehicleType}
              onChange={(e) => handleVehicleTypeChange(e.target.value)}
            >
              <option value="">Select Vehicle Type</option>
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
              disabled={!selectedVehicleType}
            >
              <option value="">Select Brand</option>
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
              disabled={!selectedBrand}
            >
              <option value="">Select Model</option>
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
              disabled={!selectedModel}
            >
              <option value="">Select Year</option>
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
              disabled={!selectedYear}
            >
              <option value="">Select Fuel</option>
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
        {/* LEFT SIDEBAR: Detailed Categories based on user reference image */}
        <aside className="store-left-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-header">
              <h4>
                <i className="fa-solid fa-boxes-stacked"></i>{' '}
                {appliedVehicleSearch ? `${appliedVehicleSearch.type} Spares & Gear` : 'Categories & Spares'}
              </h4>
              <button
                type="button"
                className="cb360-clear-btn"
                onClick={() => {
                  setSelectedCategoryId('all');
                  setSelectedSubItem(null);
                  setBudgetFilter('all');
                  setCustomTagFilter('all');
                  setSearch('');
                  showToast('Reset to All Spares & Accessories');
                }}
              >
                Reset
              </button>
            </div>

            {/* All Spares Master Pill */}
            <button
              type="button"
              className={`sidebar-nav-item ${selectedCategoryId === 'all' && !selectedSubItem ? 'active' : ''}`}
              style={{ marginBottom: '10px' }}
              onClick={() => {
                setSelectedCategoryId('all');
                setSelectedSubItem(null);
              }}
            >
              <i className="fa-solid fa-globe"></i>
              <span>All Spares &amp; Accessories</span>
            </button>

            {/* Image 2 Tree-Style Category Directory */}
            <div className="spares-category-accordion">
              {activeDetailedCategories.map((cat) => {
                const isExpanded = !!expandedCategories[cat.id];
                const isCatActive = selectedCategoryId === cat.id && !selectedSubItem;

                return (
                  <div key={cat.id} className={`spares-tree-group ${isExpanded ? 'open' : ''} ${isCatActive ? 'active-parent' : ''}`}>
                    {/* Top Level Category (e.g. Trims, Suspension, Transmission) */}
                    <button
                      type="button"
                      className={`spares-tree-header ${isCatActive ? 'active' : ''}`}
                      onClick={() => {
                        toggleCategoryExpand(cat.id);
                        setSelectedCategoryId(cat.id);
                        setSelectedSubItem(null);
                        showToast(`Filtered by ${cat.name}`);
                      }}
                    >
                      <span className="spares-tree-title">{cat.name}</span>
                      <i className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'} spares-tree-chevron`}></i>
                    </button>

                    {/* Subcategories & Nested Items */}
                    {isExpanded && (
                      <div className="spares-tree-children">
                        {cat.subCategories.map((sub) => {
                          const isSubSelected = selectedSubItem === sub.name;
                          return (
                            <div key={sub.id} className="spares-tree-subgroup">
                              {/* Subcategory (e.g. Bumper, Mirrors) */}
                              <button
                                type="button"
                                className={`spares-tree-sub-btn ${isSubSelected ? 'active' : ''}`}
                                onClick={() => {
                                  setSelectedCategoryId(cat.id);
                                  setSelectedSubItem(sub.name);
                                  showToast(`Filtered by ${sub.name}`);
                                }}
                              >
                                <span>{sub.name}</span>
                                <i className="fa-solid fa-angle-right spares-tree-mini-arrow"></i>
                              </button>

                              {/* Nested Sub-Items (e.g. Front Bumper, Rear Bumper, Bumper Trim) */}
                              {sub.items && sub.items.length > 0 && (
                                <div className="spares-tree-leaf-list">
                                  {sub.items.map((leaf, leafIdx) => {
                                    const isLeafSelected = selectedSubItem === leaf;
                                    return (
                                      <button
                                        key={leafIdx}
                                        type="button"
                                        className={`spares-tree-leaf-btn ${isLeafSelected ? 'active' : ''}`}
                                        onClick={() => {
                                          setSelectedCategoryId(cat.id);
                                          setSelectedSubItem(leaf);
                                          showToast(`Filtered by ${leaf}`);
                                        }}
                                      >
                                        <span>{leaf}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct Seller / Amazon Self-Ship Trust Box */}
            <div className="sidebar-trust-box boodmo-trust" style={{ marginTop: '14px' }}>
              <i className="fa-solid fa-truck-ramp-box"></i>
              <div>
                <strong>Direct Seller / Self-Ship Hub</strong>
                <p>Verified local dealers dispatch OEM parts directly to your doorstep with instant transit tracking.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT: Products Grid */}
        <main className="store-right-content">
          <div className="content-top-status-bar">
            <div>
              <h3 className="content-heading">
                {appliedVehicleSearch
                  ? `Guaranteed Fitment for ${appliedVehicleSearch.brand} ${appliedVehicleSearch.model} (${appliedVehicleSearch.year})`
                  : 'Universal Genuine Spares, Tyres, Riding Gear & Accessories'}
              </h3>
              <p className="content-subtext">
                Showing {filteredProducts.length} verified products with direct merchant dispatch &amp; certified fitment warranty.
              </p>
            </div>

            {/* Search Bar for Spares */}
            <div className="catalog-search-wrap parts-search-box">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tyre, helmet, goggles, dashcam, brake pad..."
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

          {/* Quick Customizable Filter Strip (Tyres, Helmets, Goggles, Dashcam, Budget) */}
          <div className="spares-quick-filter-strip">
            <div className="quick-filter-pills-row">
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#475569' }}>Filter By:</span>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'tyre', label: 'Tyres & Wheels 🛞' },
                { id: 'helmet', label: 'Helmets & Visors 🪖' },
                { id: 'goggles', label: 'Goggles & Eyewear 🕶️' },
                { id: 'dash', label: 'Dashboard & Dashcam 📹' },
                { id: 'wear', label: 'Riding Jackets & Gear 🧥' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  className={`qfilter-pill ${customTagFilter === pill.id ? 'active' : ''}`}
                  onClick={() => setCustomTagFilter(pill.id)}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Price Budget Filter */}
            <div className="quick-filter-pills-row">
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#475569' }}>Budget:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'under_1k', label: 'Under ₹ 1,000' },
                { id: '1k_3k', label: '₹ 1K - 3K' },
                { id: '3k_7k', label: '₹ 3K - 7K' },
                { id: 'above_7k', label: '₹ 7K+' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`qfilter-pill ${budgetFilter === b.id ? 'active' : ''}`}
                  onClick={() => setBudgetFilter(b.id)}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product E-Commerce Cards Grid */}
          <div className="boodmo-products-grid">
            {filteredProducts.map((product) => (
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
                    <span className="direct-seller-tag">
                      <i className="fa-solid fa-box-open"></i> Self-Ship
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

          {filteredProducts.length === 0 && (
            <div className="text-center" style={{ padding: '48px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <i className="fa-solid fa-box-open" style={{ fontSize: '36px', color: '#94a3b8', marginBottom: '12px' }}></i>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', margin: '0 0 6px' }}>No Spares or Accessories Found</h4>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px' }}>Try resetting the filters or searching for another keyword like 'tyre', 'helmet', 'spark plug'.</p>
              <button
                type="button"
                className="btn-modal-primary"
                onClick={() => {
                  setSelectedCategoryId('all');
                  setSelectedSubItem(null);
                  setBudgetFilter('all');
                  setCustomTagFilter('all');
                  setSearch('');
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
