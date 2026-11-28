'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  UsedCarItem,
  USED_CARS_MOCK_DATA,
  UsedCarsFilterState,
  INITIAL_USED_CARS_FILTER
} from './usedCarsData';
import { USED_BIKES_MOCK_DATA } from './usedBikesData';
import { USED_COMMERCIAL_MOCK_DATA } from './commercialVehiclesData';
import { VehicleCategoryType } from './vehicleBrandsModelsData';
import UsedCarFilterSidebar from './UsedCarFilterSidebar';
import UsedCarGridCard from './UsedCarGridCard';
import VehicleSelectorHeader from './VehicleSelectorHeader';
import './UsedCarsLayout.css';

interface UsedCarCatalogViewProps {
  showToast: (msg: string) => void;
  userLocationCity?: string;
  setUserLocationCity?: (city: string) => void;
  onSelectSellVehicle?: () => void;
}

export default function UsedCarCatalogView({
  showToast,
  userLocationCity = 'Chennai',
  setUserLocationCity,
  onSelectSellVehicle
}: UsedCarCatalogViewProps) {
  // Primary vehicle category switcher
  const [vehicleType, setVehicleType] = useState<VehicleCategoryType>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  const [filters, setFilters] = useState<UsedCarsFilterState>(INITIAL_USED_CARS_FILTER);
  const [topSearchKeyword, setTopSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'year_desc' | 'km_asc'>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6; // Exactly 2 rows of 3 columns

  // Modals state
  const [offerModalCar, setOfferModalCar] = useState<UsedCarItem | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerPhone, setOfferPhone] = useState('');

  const [sellerModalCar, setSellerModalCar] = useState<UsedCarItem | null>(null);

  // Switch base dataset depending on vehicleType
  const baseVehicles = useMemo(() => {
    if (vehicleType === 'Bike') {
      return USED_BIKES_MOCK_DATA;
    }
    if (vehicleType === 'Truck') {
      return USED_COMMERCIAL_MOCK_DATA.filter(
        c =>
          c.bodyType.includes('Truck') ||
          c.bodyType.includes('Tipper') ||
          [
            'Ashok Leyland',
            'Tata Motors',
            'Eicher Motors',
            'BharatBenz',
            'Mahindra',
            'Euler Motors',
            'Isuzu',
            'Volvo Trucks',
            'Scania'
          ].includes(c.brand)
      );
    }
    if (vehicleType === 'Auto') {
      return USED_COMMERCIAL_MOCK_DATA.filter(
        c =>
          c.bodyType.includes('3-Wheeler') ||
          [
            'Bajaj',
            'Piaggio',
            'Atul Auto',
            'Altigreen',
            'TVS',
            'Omega Seiki Mobility (OSM)'
          ].includes(c.brand)
      );
    }
    if (vehicleType === 'Bus') {
      return USED_COMMERCIAL_MOCK_DATA.filter(
        c =>
          c.bodyType.includes('Bus') ||
          c.name.includes('Starbus') ||
          c.name.includes('Traveller') ||
          c.name.includes('Viking')
      );
    }
    if (vehicleType === 'Tractor') {
      return USED_COMMERCIAL_MOCK_DATA.filter(
        c =>
          c.bodyType.includes('Tractor') ||
          c.bodyType.includes('Earthmover') ||
          [
            'Mahindra',
            'Swaraj',
            'John Deere',
            'Sonalika',
            'JCB',
            'Massey Ferguson',
            'Escorts',
            'New Holland',
            'Kubota'
          ].includes(c.brand)
      );
    }
    if (vehicleType === 'Van') {
      return USED_COMMERCIAL_MOCK_DATA.filter(
        c => c.bodyType.includes('Van') || c.bodyType.includes('Mini Truck')
      );
    }
    if (vehicleType === 'Electric') {
      return [
        ...USED_CARS_MOCK_DATA.filter(c => c.fuel === 'Electric'),
        ...USED_BIKES_MOCK_DATA.filter(b => b.fuel === 'Electric'),
        ...USED_COMMERCIAL_MOCK_DATA.filter(v => v.fuel === 'Electric')
      ];
    }
    if (vehicleType === 'All') {
      return [
        ...USED_CARS_MOCK_DATA,
        ...USED_BIKES_MOCK_DATA.slice(0, 6),
        ...USED_COMMERCIAL_MOCK_DATA
      ];
    }
    return USED_CARS_MOCK_DATA;
  }, [vehicleType]);

  // Filter application
  const filteredVehicles = useMemo(() => {
    return baseVehicles.filter((car) => {
      // 0. Selected Brand & Model from Top Header Selector
      if (selectedBrand) {
        if (!car.brand.toLowerCase().includes(selectedBrand.toLowerCase())) {
          return false;
        }
      }
      if (selectedModel) {
        const m = selectedModel.toLowerCase();
        const matchesModel = car.model.toLowerCase().includes(m) ||
          car.variant.toLowerCase().includes(m) ||
          car.name.toLowerCase().includes(m);
        if (!matchesModel) return false;
      }

      // 1. Recommended
      if (filters.certifiedOnly && !car.isCertified) return false;
      if (filters.priceDropOnly && !car.isPriceDrop) return false;
      if (filters.under5LakhOnly && car.rawPrice > (vehicleType === 'Bike' ? 150000 : 500000)) return false;
      if (filters.luxuryOnly && !car.isLuxury && car.rawPrice < (vehicleType === 'Bike' ? 200000 : 2500000)) return false;

      // 2. Budget slider
      if (car.rawPrice > filters.maxBudget) return false;

      // 3. Budget Tiers
      if (filters.budgetTiers.length > 0) {
        const matchesTier = filters.budgetTiers.some((tier) => {
          if (vehicleType === 'Bike') {
            if (tier === 'under_2l') return car.rawPrice < 50000;
            if (tier === '2l_3l') return car.rawPrice >= 50000 && car.rawPrice <= 100000;
            if (tier === '3l_5l') return car.rawPrice >= 100000 && car.rawPrice <= 150000;
            if (tier === '5l_8l') return car.rawPrice >= 150000 && car.rawPrice <= 200000;
            if (tier === '8l_10l') return car.rawPrice >= 200000 && car.rawPrice <= 300000;
            if (tier === 'above_10l') return car.rawPrice > 300000;
          } else {
            if (tier === 'under_2l') return car.rawPrice < 200000;
            if (tier === '2l_3l') return car.rawPrice >= 200000 && car.rawPrice <= 300000;
            if (tier === '3l_5l') return car.rawPrice >= 300000 && car.rawPrice <= 500000;
            if (tier === '5l_8l') return car.rawPrice >= 500000 && car.rawPrice <= 800000;
            if (tier === '8l_10l') return car.rawPrice >= 800000 && car.rawPrice <= 1000000;
            if (tier === 'above_10l') return car.rawPrice > 1000000;
          }
          return true;
        });
        if (!matchesTier) return false;
      }

      // 4. Brand + Model from Sidebar
      if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(car.brand)) {
        return false;
      }
      if (filters.brandSearchText.trim()) {
        const query = filters.brandSearchText.toLowerCase();
        const text = `${car.brand} ${car.model} ${car.variant} ${car.name}`.toLowerCase();
        if (!text.includes(query)) return false;
      }

      // 5. Model Year
      if (car.year < filters.minYear) return false;

      // 6. Age
      if (filters.carAge.length > 0) {
        const currentYear = 2024;
        const age = currentYear - car.year;
        const matchesAge = filters.carAge.some((a) => {
          if (a === '<1yr') return age <= 1;
          if (a === '<3yr') return age <= 3;
          if (a === '<5yr') return age <= 5;
          return true;
        });
        if (!matchesAge) return false;
      }

      // 7. Fuel Type
      if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuel)) {
        return false;
      }

      // 8. Transmission
      if (filters.transmissions.length > 0 && !filters.transmissions.includes(car.transmission)) {
        return false;
      }

      // 9. Kilometer Driven
      if (car.kms > filters.maxKms) return false;

      // 10. Ownership
      if (filters.ownerships.length > 0 && !filters.ownerships.includes(car.ownership)) {
        return false;
      }

      // 11. Body Type
      if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(car.bodyType)) {
        return false;
      }

      // 12. Seller Type
      if (filters.sellerType !== 'All Cars' && !filters.sellerType.startsWith('All') && car.sellerType !== filters.sellerType) {
        return false;
      }

      // 13. Premium Sellers
      if (filters.premiumSellers.length > 0) {
        if (!car.premiumSeller || !filters.premiumSellers.includes(car.premiumSeller)) {
          return false;
        }
      }

      // 14. RTO
      if (filters.rtoStates.length > 0 && !filters.rtoStates.includes(car.rtoState)) {
        return false;
      }

      // 15. Seats (for cars)
      if (vehicleType === 'Car' && filters.seats.length > 0 && !filters.seats.includes(car.seats)) {
        return false;
      }

      // 16. Discount
      if (filters.discounts.length > 0) {
        const disc = car.discountNumber || 0;
        const matchesDisc = filters.discounts.some((d) => {
          if (d === 'upto_20k') return disc > 0 && disc <= 20000;
          if (d === 'upto_50k') return disc > 20000 && disc <= 50000;
          if (d === 'upto_1l') return disc > 50000 && disc <= 100000;
          if (d === 'above_1l') return disc > 100000;
          return true;
        });
        if (!matchesDisc) return false;
      }

      // 17. Top keyword search
      if (topSearchKeyword.trim()) {
        const q = topSearchKeyword.toLowerCase();
        const fullStr = `${car.name} ${car.brand} ${car.model} ${car.variant} ${car.location} ${car.rto}`.toLowerCase();
        if (!fullStr.includes(q)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.rawPrice - b.rawPrice;
      if (sortBy === 'price_desc') return b.rawPrice - a.rawPrice;
      if (sortBy === 'year_desc') return b.year - a.year;
      if (sortBy === 'km_asc') return a.kms - b.kms;
      return 0; // relevance
    });
  }, [baseVehicles, selectedBrand, selectedModel, filters, topSearchKeyword, sortBy, vehicleType]);

  const handleResetFilters = () => {
    setFilters(INITIAL_USED_CARS_FILTER);
    setTopSearchKeyword('');
    setSelectedBrand('');
    setSelectedModel('');
    setSortBy('relevance');
    showToast('Reset all filters to default');
    setCurrentPage(1);
  };

  // Reset to page 1 whenever filters, brand, model or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, selectedModel, filters, topSearchKeyword, sortBy, vehicleType]);

  // Paginated items (2 rows of 3 items = 6 items per page)
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredVehicles, currentPage]);

  const handleOpenOfferModal = (car: UsedCarItem) => {
    setOfferModalCar(car);
    setOfferPrice('');
    setOfferPhone('');
  };

  const handleCloseOfferModal = () => {
    setOfferModalCar(null);
  };

  const handleSubmitOffer = () => {
    if (!offerPrice) {
      showToast('Please enter your offer price in Rupees');
      return;
    }
    if (!offerPhone) {
      showToast('Please enter your 10-digit mobile number');
      return;
    }
    showToast(`Offer of ₹${offerPrice} submitted for ${offerModalCar?.name}! Seller will contact ${offerPhone}`);
    handleCloseOfferModal();
  };

  const handleOpenSellerModal = (car: UsedCarItem) => {
    setSellerModalCar(car);
  };

  const handleCloseSellerModal = () => {
    setSellerModalCar(null);
  };

  return (
    <div className="used-cars-catalog-wrapper">
      {/* 1. TOP VEHICLE SELECTOR & DROPDOWN BAR: Directly below Store Nav (Image 5) */}
      <VehicleSelectorHeader
        selectedVehicleType={vehicleType}
        onVehicleTypeChange={(t) => {
          setVehicleType(t);
          setSelectedBrand('');
          setSelectedModel('');
          setFilters(p => ({
            ...p,
            maxBudget: t === 'Bike' ? 500000 : 50000000,
            maxKms: t === 'Bike' ? 60000 : 260000,
            selectedBrands: [],
            budgetTiers: []
          }));
        }}
        selectedBrand={selectedBrand}
        onBrandChange={(b) => setSelectedBrand(b)}
        selectedModel={selectedModel}
        onModelChange={(m) => setSelectedModel(m)}
        showToast={showToast}
        onOpenSellVehicle={onSelectSellVehicle || (() => {})}
        userCity={userLocationCity}
      />

      {/* 2. CATALOG HEADER STRIP */}
      <div className="catalog-top-header-strip">
        <div className="catalog-top-title-group">
          <h2>
            {vehicleType === 'Truck'
              ? `Certified Commercial Trucks & Lorries for Sale in ${userLocationCity}`
              : vehicleType === 'Auto'
              ? `Certified 3-Wheelers & Auto Rickshaws in ${userLocationCity}`
              : vehicleType === 'Bus'
              ? `Certified Buses & Passenger Vans in ${userLocationCity}`
              : vehicleType === 'Tractor'
              ? `Certified Agri Tractors & Heavy Equipment in ${userLocationCity}`
              : vehicleType === 'Van'
              ? `Certified Commercial Delivery Vans in ${userLocationCity}`
              : vehicleType === 'Bike'
              ? `Certified Used Bikes & Scooters for Sale in ${userLocationCity}`
              : vehicleType === 'Electric'
              ? `100% Certified Electric Vehicles (EV) in ${userLocationCity}`
              : vehicleType === 'All'
              ? `All Certified Commercial & Passenger Vehicles in ${userLocationCity}`
              : `Certified Used Cars for Sale in ${userLocationCity}`}
            {selectedBrand && <span> • {selectedBrand} {selectedModel}</span>}
          </h2>
          <span className="catalog-cars-count-badge">
            {filteredVehicles.length} of {baseVehicles.length} Vehicles Available
          </span>
        </div>

        <div className="catalog-top-actions">
          {/* Quick search input */}
          <div className="catalog-top-search-bar">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search vehicle model, brand or location..."
              value={topSearchKeyword}
              onChange={(e) => setTopSearchKeyword(e.target.value)}
            />
            {topSearchKeyword && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setTopSearchKeyword('')}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="catalog-sort-wrap">
            <label>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="catalog-sort-select"
            >
              <option value="relevance">Relevance / Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="year_desc">Year: Newest First</option>
              <option value="km_asc">Kilometers: Lowest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE FILTER CHIPS (IF ANY ACTIVE) */}
      {(selectedBrand ||
        selectedModel ||
        filters.selectedBrands.length > 0 ||
        filters.fuelTypes.length > 0 ||
        filters.transmissions.length > 0 ||
        filters.minYear > 2000 ||
        topSearchKeyword) && (
        <div className="active-filters-chips-strip animate-fade-in">
          <span className="active-filters-label">Active Filters:</span>
          {selectedBrand && (
            <span className="active-chip brand-chip">
              Brand: {selectedBrand} <i className="fa-solid fa-xmark" onClick={() => setSelectedBrand('')}></i>
            </span>
          )}
          {selectedModel && (
            <span className="active-chip model-chip">
              Model: {selectedModel} <i className="fa-solid fa-xmark" onClick={() => setSelectedModel('')}></i>
            </span>
          )}

          {filters.selectedBrands.map(b => (
            <span key={b} className="active-chip">
              {b} <i className="fa-solid fa-xmark" onClick={() => setFilters(p => ({ ...p, selectedBrands: p.selectedBrands.filter(x => x !== b) }))}></i>
            </span>
          ))}
          {filters.fuelTypes.map(f => (
            <span key={f} className="active-chip">
              {f} <i className="fa-solid fa-xmark" onClick={() => setFilters(p => ({ ...p, fuelTypes: p.fuelTypes.filter(x => x !== f) }))}></i>
            </span>
          ))}
          {topSearchKeyword && (
            <span className="active-chip">
              &quot;{topSearchKeyword}&quot; <i className="fa-solid fa-xmark" onClick={() => setTopSearchKeyword('')}></i>
            </span>
          )}
          <button
            type="button"
            className="clear-all-chips-link"
            onClick={handleResetFilters}
          >
            Clear All
          </button>
        </div>
      )}

      {/* 4. TWO-COLUMN MAIN LAYOUT: LEFT SIDEBAR + RIGHT GRID */}
      <div className="used-cars-split-container">
        {/* LEFT COLUMN: Filter Sidebar matching Image 1 */}
        <div className="catalog-sidebar-column">
          <UsedCarFilterSidebar
            filters={filters}
            setFilters={setFilters}
            totalCount={filteredVehicles.length}
            onResetFilters={handleResetFilters}
            vehicleType={vehicleType}
          />
        </div>

        {/* RIGHT COLUMN: Used Car/Bike Cards Grid matching Image 2 */}
        <div className="catalog-grid-column">
          {filteredVehicles.length > 0 ? (
            <>
              <div className="used-cars-cards-grid">
                {paginatedVehicles.map((car) => (
                  <UsedCarGridCard
                    key={car.id}
                    car={car}
                    onMakeOffer={handleOpenOfferModal}
                    onViewSellerDetails={handleOpenSellerModal}
                    showToast={showToast}
                  />
                ))}
              </div>

              {/* Dynamic Pagination Controls: Page 1, 2, 3, 4, 5... */}
              {totalPages > 1 && (
                <div className="used-cars-pagination-wrap">
                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                      document.querySelector('.catalog-grid-column')?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    title="Previous Page"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        document.querySelector('.catalog-grid-column')?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="pagination-btn"
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                      document.querySelector('.catalog-grid-column')?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    title="Next Page"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="used-cars-empty-state animate-fade-in">
              <div className="empty-state-icon">
                <i className={`fa-solid ${vehicleType === 'Bike' ? 'fa-motorcycle' : 'fa-car-side'}`}></i>
              </div>
              <h3>No matching {vehicleType === 'Bike' ? 'bikes' : 'cars'} found</h3>
              <p>We couldn&apos;t find any {vehicleType === 'Bike' ? 'bikes' : 'cars'} matching your selected brand, model, or filter criteria.</p>
              <button
                type="button"
                className="btn-empty-reset"
                onClick={handleResetFilters}
              >
                <i className="fa-solid fa-arrow-rotate-left"></i>
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: MAKE AN OFFER */}
      {offerModalCar && (
        <div className="used-car-modal-overlay" onClick={handleCloseOfferModal}>
          <div className="used-car-modal-card animate-scale" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <i className="fa-solid fa-handshake"></i>
                <span>Make an Offer for {offerModalCar.name}</span>
              </div>
              <button type="button" className="modal-close-btn" onClick={handleCloseOfferModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="modal-car-summary">
              <img src={offerModalCar.images[0]} alt={offerModalCar.name} className="modal-car-thumb" />
              <div>
                <h4>{offerModalCar.name} - {offerModalCar.variant}</h4>
                <div className="modal-listed-price">Listed Price: <strong>{offerModalCar.price}</strong></div>
                <div className="modal-car-meta">{offerModalCar.kmsDisplay} • {offerModalCar.fuel} • {offerModalCar.location}</div>
              </div>
            </div>

            <div className="modal-form-body">
              <div className="modal-input-field">
                <label>Your Expected Offer Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 450000"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="modal-input-field">
                <label>Your 10-Digit Mobile Number</label>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={offerPhone}
                  onChange={(e) => setOfferPhone(e.target.value)}
                />
              </div>

              <div className="modal-notice">
                <i className="fa-solid fa-shield-halved"></i>
                <span>Your offer will be directly communicated to the verified seller. No spam guaranteed.</span>
              </div>
            </div>

            <div className="modal-actions-row">
              <button type="button" className="modal-btn-cancel" onClick={handleCloseOfferModal}>
                Cancel
              </button>
              <button type="button" className="modal-btn-submit" onClick={handleSubmitOffer}>
                <i className="fa-solid fa-paper-plane"></i>
                <span>Submit My Offer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW SELLER DETAILS */}
      {sellerModalCar && (
        <div className="used-car-modal-overlay" onClick={handleCloseSellerModal}>
          <div className="used-car-modal-card animate-scale seller-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <i className="fa-solid fa-store"></i>
                <span>Verified Seller Details</span>
              </div>
              <button type="button" className="modal-close-btn" onClick={handleCloseSellerModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="seller-modal-body">
              <div className="seller-info-banner">
                <div className="seller-avatar">
                  <i className="fa-solid fa-building-user"></i>
                </div>
                <div>
                  <h3 className="seller-name">{sellerModalCar.sellerDetails.name}</h3>
                  <div className="seller-type-tag">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>{sellerModalCar.sellerDetails.type}</span>
                    <span className="seller-star-rating">★ {sellerModalCar.sellerDetails.rating}</span>
                  </div>
                </div>
              </div>

              <div className="seller-details-list">
                <div className="detail-item">
                  <i className="fa-solid fa-phone"></i>
                  <div>
                    <label>Contact Number</label>
                    <a href={`tel:${sellerModalCar.sellerDetails.phone}`} className="phone-link">
                      {sellerModalCar.sellerDetails.phone}
                    </a>
                  </div>
                </div>

                <div className="detail-item">
                  <i className="fa-solid fa-location-dot"></i>
                  <div>
                    <label>Hub / Dealership Address</label>
                    <p>{sellerModalCar.sellerDetails.address}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <i className="fa-solid fa-certificate"></i>
                  <div>
                    <label>Quality &amp; Inspection Status</label>
                    <p className="inspection-text">{sellerModalCar.sellerDetails.inspectionScore}</p>
                  </div>
                </div>
              </div>

              <div className="seller-modal-car-specs">
                <h4>{sellerModalCar.name} • {sellerModalCar.price}</h4>
                <div className="specs-badges-cloud">
                  <span>{sellerModalCar.kmsDisplay}</span>
                  <span>{sellerModalCar.fuel}</span>
                  <span>{sellerModalCar.transmission}</span>
                  <span>RTO: {sellerModalCar.rto}</span>
                  <span>{sellerModalCar.ownership}</span>
                </div>
              </div>

              <div className="seller-actions-btn-group">
                <button
                  type="button"
                  className="btn-call-seller"
                  onClick={() => {
                    if (typeof window !== 'undefined') window.location.href = `tel:${sellerModalCar.sellerDetails.phone}`;
                    showToast(`Calling ${sellerModalCar.sellerDetails.name}`);
                  }}
                >
                  <i className="fa-solid fa-phone-volume"></i>
                  <span>Call Seller Now</span>
                </button>

                <button
                  type="button"
                  className="btn-book-testdrive"
                  onClick={() => {
                    showToast(`Test drive appointment requested for ${sellerModalCar.name}! Executive will confirm schedule.`);
                    handleCloseSellerModal();
                  }}
                >
                  <i className="fa-solid fa-key"></i>
                  <span>Book Free Doorstep Inspection</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
