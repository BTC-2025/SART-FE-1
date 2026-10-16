'use client';

import React, { useState, useMemo } from 'react';
import { VEHICLE_SHOWCASE_DATA, VehicleShowcaseItem } from './storeData';
import { Carbike360ChetakSidebarAd, Carbike360ChetakLeaderboardAd } from './CarBike360Views';

export interface LatestViewProps {
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

