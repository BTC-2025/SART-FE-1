'use client';

import React, { useState, useMemo } from 'react';
import { VEHICLE_SHOWCASE_DATA, VehicleShowcaseItem, UPCOMING_CARS_FAQS } from './storeData';
import { Carbike360ChetakSidebarAd, Carbike360ChetakLeaderboardAd } from './CarBike360Views';

export interface UpcomingViewProps {
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

