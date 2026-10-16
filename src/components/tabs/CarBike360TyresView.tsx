'use client';

import React, { useState, useMemo, useRef } from 'react';

export interface TyreProductItem {
  id: string;
  brand: string;
  brandLogoText: string;
  name: string;
  category: 'Car' | 'Bike' | 'Scooter';
  type: 'Tubeless' | 'Tube Type';
  grip: 'Dry Grip' | 'Wet & Dry Grip' | 'All-Terrain' | 'High Performance';
  size: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  warranty: string;
  image: string;
  isPopular?: boolean;
  isLatest?: boolean;
}

export const TYRE_CATALOG_DATA: TyreProductItem[] = [
  // Latest Car Tyres
  {
    id: 'tyre-jk-uxroyale',
    brand: 'JK Tyre',
    brandLogoText: 'JKTYRE',
    name: 'UX ROYALE',
    category: 'Car',
    type: 'Tubeless',
    grip: 'Dry Grip',
    size: '195/55 R16',
    price: 5499,
    originalPrice: 6200,
    rating: 4.5,
    reviewsCount: 312,
    warranty: '5 Years Warranty',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    isLatest: true
  },
  {
    id: 'tyre-jk-uxtouring',
    brand: 'JK Tyre',
    brandLogoText: 'JKTYRE',
    name: 'UX TOURING',
    category: 'Car',
    type: 'Tubeless',
    grip: 'Wet & Dry Grip',
    size: '165/80 R14',
    price: 3999,
    originalPrice: 4500,
    rating: 4.4,
    reviewsCount: 220,
    warranty: '5 Years Warranty',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    isLatest: true
  },
  {
    id: 'tyre-jk-rangerat',
    brand: 'JK Tyre',
    brandLogoText: 'JKTYRE',
    name: 'RANGER A/T',
    category: 'Car',
    type: 'Tubeless',
    grip: 'All-Terrain',
    size: '215/65 R16',
    price: 7009,
    originalPrice: 7999,
    rating: 4.6,
    reviewsCount: 450,
    warranty: '5 Years Warranty',
    image: 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?auto=format&fit=crop&w=600&q=80',
    isLatest: true
  },
  {
    id: 'tyre-jk-rangerht',
    brand: 'JK Tyre',
    brandLogoText: 'JKTYRE',
    name: 'RANGER H/T',
    category: 'Car',
    type: 'Tubeless',
    grip: 'High Performance',
    size: '235/65 R17',
    price: 8303,
    originalPrice: 9500,
    rating: 4.6,
    reviewsCount: 180,
    warranty: '5 Years Warranty',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    isLatest: true
  },

  // Popular Car Tyres
  {
    id: 'tyre-ceat-securadrive',
    brand: 'CEAT',
    brandLogoText: 'CEAT',
    name: 'SecuraDrive',
    category: 'Car',
    type: 'Tubeless',
    grip: 'Wet & Dry Grip',
    size: '195/65 R15',
    price: 4115,
    originalPrice: 4750,
    rating: 4.45,
    reviewsCount: 520,
    warranty: '3 Years Unconditional',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },
  {
    id: 'tyre-ceat-milaze',
    brand: 'CEAT',
    brandLogoText: 'CEAT',
    name: 'Milaze',
    category: 'Car',
    type: 'Tubeless',
    grip: 'Dry Grip',
    size: '145/80 R12',
    price: 1871,
    originalPrice: 2200,
    rating: 4.2,
    reviewsCount: 680,
    warranty: '3 Years Unconditional',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },
  {
    id: 'tyre-ceat-fuelsmrt',
    brand: 'CEAT',
    brandLogoText: 'CEAT',
    name: 'Fuel Smrt',
    category: 'Car',
    type: 'Tubeless',
    grip: 'Dry Grip',
    size: '165/70 R14',
    price: 3715,
    originalPrice: 4100,
    rating: 4.5,
    reviewsCount: 390,
    warranty: '3 Years Unconditional',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },
  {
    id: 'tyre-ceat-czarat',
    brand: 'CEAT',
    brandLogoText: 'CEAT',
    name: 'CZAR A/T',
    category: 'Car',
    type: 'Tubeless',
    grip: 'All-Terrain',
    size: '215/75 R15',
    price: 6072,
    originalPrice: 7100,
    rating: 4.55,
    reviewsCount: 290,
    warranty: '3 Years Unconditional',
    image: 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },

  // Bike & Scooter Tyres
  {
    id: 'tyre-mrf-zapper',
    brand: 'MRF',
    brandLogoText: 'MRF',
    name: 'Nylogrip Zapper-Q',
    category: 'Bike',
    type: 'Tubeless',
    grip: 'Wet & Dry Grip',
    size: '140/70-17 66S',
    price: 3250,
    originalPrice: 3800,
    rating: 4.8,
    reviewsCount: 840,
    warranty: '6 Years Warranty',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    isLatest: true
  },
  {
    id: 'tyre-mrf-mogrip',
    brand: 'MRF',
    brandLogoText: 'MRF',
    name: 'MoGrip Meteor Off-Road',
    category: 'Bike',
    type: 'Tubeless',
    grip: 'All-Terrain',
    size: '120/80-18',
    price: 2950,
    originalPrice: 3400,
    rating: 4.7,
    reviewsCount: 410,
    warranty: '6 Years Warranty',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  },
  {
    id: 'tyre-ceat-grippx3',
    brand: 'CEAT',
    brandLogoText: 'CEAT',
    name: 'Gripp X3 Scooter',
    category: 'Scooter',
    type: 'Tubeless',
    grip: 'Wet & Dry Grip',
    size: '90/100-10 53J',
    price: 1390,
    originalPrice: 1650,
    rating: 4.6,
    reviewsCount: 1120,
    warranty: '3 Years Unconditional',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    isLatest: true
  },
  {
    id: 'tyre-michelin-cityextra',
    brand: 'Michelin',
    brandLogoText: 'MICHELIN',
    name: 'City Extra Puncture Protect',
    category: 'Scooter',
    type: 'Tubeless',
    grip: 'Wet & Dry Grip',
    size: '90/90-12 54J',
    price: 1750,
    originalPrice: 2100,
    rating: 4.9,
    reviewsCount: 380,
    warranty: '5 Years Warranty',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    isPopular: true
  }
];

export function Carbike360TyresHubView({
  onSelectVehicle,
  onAddToCart,
  showToast,
  onBackToAllSpares
}: {
  onSelectVehicle: (brand: string, model: string, type: string) => void;
  onAddToCart: (item: any) => void;
  showToast: (msg: string) => void;
  onBackToAllSpares: () => void;
}) {
  // Widget Tab: Car, Bike, Scooter
  const [vehicleTab, setVehicleTab] = useState<'Car' | 'Bike' | 'Scooter'>('Car');
  const [widgetBrand, setWidgetBrand] = useState('Maruti Suzuki');
  const [widgetModel, setWidgetModel] = useState('Swift');

  // Brand Strip Tab: Car Tyre Brands / Bike Tyre Brands / Scooter Tyre Brands
  const [brandStripTab, setBrandStripTab] = useState<'Car' | 'Bike' | 'Scooter'>('Car');

  // Product Filter Tabs
  const [latestSubTab, setLatestSubTab] = useState<'Car' | 'Bike' | 'Scooter'>('Car');
  const [popularSubTab, setPopularSubTab] = useState<'Car' | 'Bike' | 'Scooter'>('Car');

  // Modal for quote / book
  const [selectedTyreQuote, setSelectedTyreQuote] = useState<TyreProductItem | null>(null);
  const [quotePincode, setQuotePincode] = useState('600001');
  const [quoteQty, setQuoteQty] = useState(4);

  // Brands with Logos/Badges
  const POPULAR_TYRE_BRANDS = [
    { name: 'JK Tyre', tag: 'JKTYRE', badge: 'India #1 Radial', icon: 'fa-truck-field' },
    { name: 'Apollo', tag: 'apollo', badge: 'Performance Leader', icon: 'fa-award' },
    { name: 'Bridgestone', tag: 'BRIDGESTONE', badge: 'Japanese Precision', icon: 'fa-star' },
    { name: 'CEAT', tag: 'CEAT', badge: 'Born Tough', icon: 'fa-shield-halved' },
    { name: 'Continental', tag: 'Continental', badge: 'German Engineering', icon: 'fa-gauge-high' },
    { name: 'MRF', tag: 'MRF', badge: 'Pace & Grip', icon: 'fa-flag-checkered' },
    { name: 'Michelin', tag: 'MICHELIN', badge: 'Total Performance', icon: 'fa-circle-check' },
    { name: 'Goodyear', tag: 'GOODYEAR', badge: 'Durawall Tech', icon: 'fa-truck' }
  ];

  const POPULAR_VEHICLE_BRANDS = [
    { name: 'Maruti Suzuki', count: '18 Tyres', icon: 'fa-car-side' },
    { name: 'Hyundai', count: '14 Tyres', icon: 'fa-car' },
    { name: 'Honda', count: '12 Tyres', icon: 'fa-car-rear' },
    { name: 'Tata', count: '16 Tyres', icon: 'fa-shield' },
    { name: 'Mahindra', count: '15 Tyres', icon: 'fa-truck-pickup' },
    { name: 'Renault', count: '9 Tyres', icon: 'fa-car' },
    { name: 'Toyota', count: '11 Tyres', icon: 'fa-car-side' },
    { name: 'Kia', count: '10 Tyres', icon: 'fa-car' }
  ];

  const WIDGET_MODELS_BY_BRAND: Record<string, string[]> = {
    'Maruti Suzuki': ['Swift', 'Baleno', 'Brezza', 'Dzire', 'Ertiga', 'Alto K10', 'WagonR'],
    'Hyundai': ['Creta', 'Venue', 'i20', 'Verna', 'Exter', 'Grand i10 Nios'],
    'Tata': ['Nexon', 'Punch', 'Harrier', 'Safari', 'Tiago', 'Altroz'],
    'Mahindra': ['Scorpio-N', 'XUV700', 'Thar', 'Bolero Neo', 'XUV 3XO'],
    'Honda': ['City', 'Elevate', 'Amaze'],
    'Toyota': ['Innova Crysta', 'Innova HyCross', 'Fortuner', 'Hyryder', 'Glanza'],
    'Hero MotoCorp': ['Splendor Plus', 'HF Deluxe', 'Glamour', 'Xpulse 200 4V'],
    'Honda 2Wheelers': ['Activa 6G', 'Dio 125', 'Shine 125', 'SP 125', 'Unicorn'],
    'Royal Enfield': ['Classic 350', 'Hunter 350', 'Meteor 350', 'Himalayan 450'],
    'Bajaj Auto': ['Pulsar 150', 'Pulsar NS200', 'Platina 110', 'Chetak EV'],
    'TVS Motor': ['Jupiter 110', 'Ntorq 125', 'Apache RTR 160 4V', 'Raider 125']
  };

  const currentModels = WIDGET_MODELS_BY_BRAND[widgetBrand] || ['Standard Model', 'Plus Variant'];

  const filteredLatestTyres = TYRE_CATALOG_DATA.filter(t => t.isLatest && t.category === latestSubTab);
  const filteredPopularTyres = TYRE_CATALOG_DATA.filter(t => t.isPopular && t.category === popularSubTab);

  return (
    <div className="cb360-tyres-hub-view animate-fade-in">
      {/* Top Breadcrumb & Return to All Spares */}
      <div className="cb360-breadcrumb-row">
        <div className="cb360-crumbs-list">
          <span className="crumb-link" onClick={onBackToAllSpares}>Spare Parts &amp; Accessories</span>
          <i className="fa-solid fa-chevron-right crumb-sep"></i>
          <span className="crumb-current">Tyres &amp; Wheels Direct Fitment Hub</span>
        </div>
        <button type="button" className="cb360-back-portal-btn" onClick={onBackToAllSpares}>
          <i className="fa-solid fa-arrow-left"></i>
          <span>View All Spares Categories</span>
        </button>
      </div>

      {/* 1. HERO BANNER & "FIND TYRES BY VEHICLE" WIDGET (Exact match to top image) */}
      <div className="cb360-tyre-hero-card">
        <div className="cb360-tyre-hero-overlay"></div>
        <div className="cb360-tyre-hero-content">
          {/* Left Form Widget: Find Tyres By Vehicle */}
          <div className="cb360-tyre-finder-box animate-pop">
            <div className="finder-header-tabs">
              <button
                type="button"
                className={`finder-tab-btn ${vehicleTab === 'Car' ? 'active' : ''}`}
                onClick={() => {
                  setVehicleTab('Car');
                  setWidgetBrand('Maruti Suzuki');
                  setWidgetModel('Swift');
                }}
              >
                <i className="fa-solid fa-car"></i> Cars
              </button>
              <button
                type="button"
                className={`finder-tab-btn ${vehicleTab === 'Bike' ? 'active' : ''}`}
                onClick={() => {
                  setVehicleTab('Bike');
                  setWidgetBrand('Hero MotoCorp');
                  setWidgetModel('Splendor Plus');
                }}
              >
                <i className="fa-solid fa-motorcycle"></i> Bikes
              </button>
              <button
                type="button"
                className={`finder-tab-btn ${vehicleTab === 'Scooter' ? 'active' : ''}`}
                onClick={() => {
                  setVehicleTab('Scooter');
                  setWidgetBrand('Honda 2Wheelers');
                  setWidgetModel('Activa 6G');
                }}
              >
                <i className="fa-solid fa-bicycle"></i> Scooters
              </button>
            </div>

            <div className="finder-box-body">
              <h4 className="finder-title">Find Tyres By Vehicle</h4>

              <div className="finder-field">
                <label><i className="fa-solid fa-copyright"></i> Select Brand</label>
                <select
                  value={widgetBrand}
                  onChange={(e) => {
                    setWidgetBrand(e.target.value);
                    const mods = WIDGET_MODELS_BY_BRAND[e.target.value] || ['Standard'];
                    setWidgetModel(mods[0]);
                  }}
                >
                  {vehicleTab === 'Car' && (
                    <>
                      <option value="Maruti Suzuki">Maruti Suzuki</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Tata">Tata Motors</option>
                      <option value="Mahindra">Mahindra</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Honda">Honda</option>
                    </>
                  )}
                  {vehicleTab === 'Bike' && (
                    <>
                      <option value="Hero MotoCorp">Hero MotoCorp</option>
                      <option value="Royal Enfield">Royal Enfield</option>
                      <option value="Bajaj Auto">Bajaj Auto</option>
                      <option value="TVS Motor">TVS Motor</option>
                    </>
                  )}
                  {vehicleTab === 'Scooter' && (
                    <>
                      <option value="Honda 2Wheelers">Honda (Activa / Dio)</option>
                      <option value="TVS Motor">TVS (Jupiter / Ntorq)</option>
                      <option value="Bajaj Auto">Bajaj Chetak EV</option>
                    </>
                  )}
                </select>
              </div>

              <div className="finder-field">
                <label><i className="fa-solid fa-car-rear"></i> Select Model</label>
                <select
                  value={widgetModel}
                  onChange={(e) => setWidgetModel(e.target.value)}
                >
                  {currentModels.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn-find-tyres-cta"
                onClick={() => {
                  onSelectVehicle(widgetBrand, widgetModel, vehicleTab);
                  showToast(`Selected Guaranteed Fitment for ${widgetBrand} ${widgetModel}`);
                }}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
                <span>Find Tyres</span>
              </button>
            </div>
          </div>

          {/* Right Banner Content */}
          <div className="cb360-tyre-hero-text">
            <span className="tyre-hero-pill">
              <i className="fa-solid fa-shield-halved"></i> 100% Guaranteed Fitment &amp; Free Doorstep Balancing
            </span>
            <h1 className="tyre-hero-headline">All You Need to Know About Tyres</h1>
            <p className="tyre-hero-subline">How to Maintain? When to Change? Which is Better for Indian Roads?</p>
            <div className="tyre-hero-actions">
              <button
                type="button"
                className="btn-expert-guides"
                onClick={() => {
                  const elem = document.getElementById('tyre-guides-section');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <i className="fa-solid fa-book-open"></i>
                <span>CHECK OUR EXPERT GUIDES</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. POPULAR TYRES BRANDS SECTION */}
      <section className="cb360-tyre-section">
        <div className="section-head-row">
          <div>
            <h3 className="section-main-title">Popular Tyres Brands</h3>
            <p className="section-sub-title">Authorized OEM warranty with doorstep fitment &amp; wheel alignment</p>
          </div>
          <div className="section-tabs-pill">
            <button
              type="button"
              className={`pill-tab ${brandStripTab === 'Car' ? 'active' : ''}`}
              onClick={() => setBrandStripTab('Car')}
            >
              Car Tyre Brands
            </button>
            <button
              type="button"
              className={`pill-tab ${brandStripTab === 'Bike' ? 'active' : ''}`}
              onClick={() => setBrandStripTab('Bike')}
            >
              Bike Tyre Brands
            </button>
            <button
              type="button"
              className={`pill-tab ${brandStripTab === 'Scooter' ? 'active' : ''}`}
              onClick={() => setBrandStripTab('Scooter')}
            >
              Scooter Tyre Brands
            </button>
          </div>
        </div>

        <div className="tyre-brands-scroll-strip">
          {POPULAR_TYRE_BRANDS.map((b) => (
            <div
              key={b.name}
              className="tyre-brand-box cursor-pointer"
              onClick={() => showToast(`Filtered ${b.name} genuine radial range`)}
            >
              <div className="brand-logo-text">{b.tag}</div>
              <span className="brand-subtext">{b.badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. POPULAR VEHICLE BRANDS STRIP */}
      <section className="cb360-tyre-section">
        <div className="section-head-row">
          <div>
            <h3 className="section-main-title">Popular Vehicle Brands</h3>
            <p className="section-sub-title">Select your car manufacturer to view factory standard tyre specs</p>
          </div>
        </div>

        <div className="vehicle-brands-grid">
          {POPULAR_VEHICLE_BRANDS.map((vb) => (
            <div
              key={vb.name}
              className="vehicle-brand-tile cursor-pointer"
              onClick={() => {
                onSelectVehicle(vb.name, 'Default', 'Car');
                showToast(`Loaded OEM tyre sizes for ${vb.name}`);
              }}
            >
              <div className="veh-brand-icon">
                <i className={`fa-solid ${vb.icon}`}></i>
              </div>
              <h4>{vb.name}</h4>
              <span className="veh-tyre-count">{vb.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. LATEST TYRES SECTION */}
      <section className="cb360-tyre-section">
        <div className="section-head-row">
          <div>
            <h3 className="section-main-title">Latest Tyres</h3>
            <p className="section-sub-title">Newest generation compound with enhanced silica grip &amp; high fuel efficiency</p>
          </div>
          <div className="section-tabs-pill">
            <button
              type="button"
              className={`pill-tab ${latestSubTab === 'Car' ? 'active' : ''}`}
              onClick={() => setLatestSubTab('Car')}
            >
              Latest Car Tyres
            </button>
            <button
              type="button"
              className={`pill-tab ${latestSubTab === 'Bike' ? 'active' : ''}`}
              onClick={() => setLatestSubTab('Bike')}
            >
              Latest Bike Tyres
            </button>
            <button
              type="button"
              className={`pill-tab ${latestSubTab === 'Scooter' ? 'active' : ''}`}
              onClick={() => setLatestSubTab('Scooter')}
            >
              Latest Scooter Tyres
            </button>
          </div>
        </div>

        <div className="tyre-products-grid">
          {filteredLatestTyres.map((tyre) => (
            <div key={tyre.id} className="cb360-tyre-card animate-fade-in">
              <div className="tyre-card-header">
                <span className="tyre-card-brand-tag">{tyre.brandLogoText}</span>
                <span className="tyre-warranty-badge">
                  <i className="fa-solid fa-shield-check"></i> {tyre.warranty}
                </span>
              </div>

              <div className="tyre-card-body-row">
                <div className="tyre-specs-col">
                  <h4 className="tyre-model-name">{tyre.name}</h4>
                  <ul className="tyre-spec-bullets">
                    <li><i className="fa-solid fa-circle"></i> {tyre.type}</li>
                    <li><i className="fa-solid fa-circle"></i> {tyre.grip}</li>
                    <li><i className="fa-solid fa-circle"></i> {tyre.size}</li>
                  </ul>
                  <div className="tyre-price-rating-row">
                    <div>
                      <span className="price-label">Price</span>
                      <strong className="price-val">₹ {tyre.price.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="rating-col">
                      <span className="expert-rating-label">Expert Rating</span>
                      <span className="expert-stars"><i className="fa-solid fa-star"></i> {tyre.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="tyre-image-col">
                  <img
                    src={tyre.image}
                    alt={tyre.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>
              </div>

              <div className="tyre-card-footer">
                <button
                  type="button"
                  className="btn-tyre-best-quote"
                  onClick={() => setSelectedTyreQuote(tyre)}
                >
                  <i className="fa-solid fa-tag"></i>
                  <span>Get Best Quote</span>
                </button>
                <button
                  type="button"
                  className="btn-tyre-book-cart"
                  onClick={() => {
                    onAddToCart({
                      id: tyre.id,
                      name: `${tyre.brand} ${tyre.name} (${tyre.size})`,
                      price: tyre.price,
                      originalPrice: tyre.originalPrice,
                      image: tyre.image,
                      category: 'Tyres & Wheels',
                      section: 'Tyres',
                      vehicle: tyre.category,
                      inStock: true
                    });
                    showToast(`Added ${tyre.brand} ${tyre.name} to Cart`);
                  }}
                  title="Add to Cart"
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. POPULAR TYRES SECTION */}
      <section className="cb360-tyre-section">
        <div className="section-head-row">
          <div>
            <h3 className="section-main-title">Popular Tyres</h3>
            <p className="section-sub-title">Top customer rated tyres with longest tread life &amp; puncture resistance</p>
          </div>
          <div className="section-tabs-pill">
            <button
              type="button"
              className={`pill-tab ${popularSubTab === 'Car' ? 'active' : ''}`}
              onClick={() => setPopularSubTab('Car')}
            >
              Popular Car Tyres
            </button>
            <button
              type="button"
              className={`pill-tab ${popularSubTab === 'Bike' ? 'active' : ''}`}
              onClick={() => setPopularSubTab('Bike')}
            >
              Popular Bike Tyres
            </button>
            <button
              type="button"
              className={`pill-tab ${popularSubTab === 'Scooter' ? 'active' : ''}`}
              onClick={() => setPopularSubTab('Scooter')}
            >
              Popular Scooter Tyres
            </button>
          </div>
        </div>

        <div className="tyre-products-grid">
          {filteredPopularTyres.map((tyre) => (
            <div key={tyre.id} className="cb360-tyre-card animate-fade-in">
              <div className="tyre-card-header">
                <span className="tyre-card-brand-tag">{tyre.brandLogoText}</span>
                <span className="tyre-warranty-badge">
                  <i className="fa-solid fa-shield-check"></i> {tyre.warranty}
                </span>
              </div>

              <div className="tyre-card-body-row">
                <div className="tyre-specs-col">
                  <h4 className="tyre-model-name">{tyre.name}</h4>
                  <ul className="tyre-spec-bullets">
                    <li><i className="fa-solid fa-circle"></i> {tyre.type}</li>
                    <li><i className="fa-solid fa-circle"></i> {tyre.grip}</li>
                    <li><i className="fa-solid fa-circle"></i> {tyre.size}</li>
                  </ul>
                  <div className="tyre-price-rating-row">
                    <div>
                      <span className="price-label">Price</span>
                      <strong className="price-val">₹ {tyre.price.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="rating-col">
                      <span className="expert-rating-label">Expert Rating</span>
                      <span className="expert-stars"><i className="fa-solid fa-star"></i> {tyre.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="tyre-image-col">
                  <img
                    src={tyre.image}
                    alt={tyre.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>
              </div>

              <div className="tyre-card-footer">
                <button
                  type="button"
                  className="btn-tyre-best-quote"
                  onClick={() => setSelectedTyreQuote(tyre)}
                >
                  <i className="fa-solid fa-tag"></i>
                  <span>Get Best Quote</span>
                </button>
                <button
                  type="button"
                  className="btn-tyre-book-cart"
                  onClick={() => {
                    onAddToCart({
                      id: tyre.id,
                      name: `${tyre.brand} ${tyre.name} (${tyre.size})`,
                      price: tyre.price,
                      originalPrice: tyre.originalPrice,
                      image: tyre.image,
                      category: 'Tyres & Wheels',
                      section: 'Tyres',
                      vehicle: tyre.category,
                      inStock: true
                    });
                    showToast(`Added ${tyre.brand} ${tyre.name} to Cart`);
                  }}
                  title="Add to Cart"
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TOOLS AND SERVICES SECTION */}
      <section className="cb360-tyre-section">
        <div className="section-head-row">
          <div>
            <h3 className="section-main-title">Tools and Services</h3>
            <p className="section-sub-title">Smart calculations and visual comparisons for your vehicle wheels</p>
          </div>
        </div>

        <div className="tyre-tools-grid">
          <div
            className="tyre-tool-card cursor-pointer"
            onClick={() => showToast('Opening Side-by-side Tyre Comparison Tool')}
          >
            <div className="tool-icon-wrap">
              <i className="fa-solid fa-scale-balanced"></i>
            </div>
            <h4>Tyre Comparison Tool</h4>
            <p>Compare tread depth, wet braking distance, noise decibel rating &amp; warranty between any two brands.</p>
          </div>

          <div
            className="tyre-tool-card cursor-pointer"
            onClick={() => showToast('Tyre Pressure Calculator: Swift recommended PSI is 33 Front / 30 Rear')}
          >
            <div className="tool-icon-wrap">
              <i className="fa-solid fa-gauge"></i>
            </div>
            <h4>Tyre Pressure Tool</h4>
            <p>Lookup OEM-recommended cold tyre PSI for city driving, highway runs and heavy passenger loads.</p>
          </div>

          <div
            className="tyre-tool-card cursor-pointer"
            onClick={() => showToast('Tyre Upsizing Calculator: Max safe upsize is within 2.5% rolling circumference.')}
          >
            <div className="tool-icon-wrap">
              <i className="fa-solid fa-arrows-spin"></i>
            </div>
            <h4>Tyre Upsizing Tool</h4>
            <p>Calculate speedometer error and ground clearance shift when upgrading alloy wheels and profile sizes.</p>
          </div>
        </div>
      </section>

      {/* 7. TYRE GUIDE VIDEOS */}
      <section id="tyre-guides-section" className="cb360-tyre-section">
        <div className="section-head-row">
          <div>
            <h3 className="section-main-title">Tyre Guide Videos</h3>
            <p className="section-sub-title">Expert video masterclasses on puncture care, tubeless conversion &amp; alignment</p>
          </div>
        </div>

        <div className="tyre-guides-grid">
          <div className="tyre-video-card">
            <div className="video-thumb-wrap">
              <img
                src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80"
                alt="Guide"
              />
              <span className="video-play-btn"><i className="fa-solid fa-play"></i></span>
            </div>
            <h4>The Ultimate Guide To Tyre Sidewalls: How Good Are Your Tyres?</h4>
          </div>

          <div className="tyre-video-card">
            <div className="video-thumb-wrap">
              <img
                src="https://images.unsplash.com/photo-1543465077-db45d34b88a5?auto=format&fit=crop&w=600&q=80"
                alt="Guide"
              />
              <span className="video-play-btn"><i className="fa-solid fa-play"></i></span>
            </div>
            <h4>Summer vs Winter vs All Season: What Tyres Should You Buy?</h4>
          </div>

          <div className="tyre-video-card">
            <div className="video-thumb-wrap">
              <img
                src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80"
                alt="Guide"
              />
              <span className="video-play-btn"><i className="fa-solid fa-play"></i></span>
            </div>
            <h4>Why You Should Never Buy Cheap Tyres: Hydroplaning Demonstration</h4>
          </div>
        </div>
      </section>

      {/* 8. LATEST TYRE NEWS AND ARTICLES */}
      <section className="cb360-tyre-section">
        <div className="section-head-row">
          <div>
            <h3 className="section-main-title">Latest Tyre News And Articles</h3>
            <p className="section-sub-title">Industry releases, eco-friendly rubber tech, and track day test reports</p>
          </div>
        </div>

        <div className="tyre-news-grid">
          <div className="tyre-news-card">
            <img
              src="https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80"
              alt="News 1"
            />
            <div className="news-body">
              <h4>Yokohama GEOLANDAR A/T: High Grip Indian Terrain Tyre Launched</h4>
              <p>Designed for SUVs and 4x4 pickups with enhanced sidewall cut protection.</p>
              <button
                type="button"
                className="btn-news-read"
                onClick={() => showToast('Opening Full Article...')}
              >
                Read Full News
              </button>
            </div>
          </div>

          <div className="tyre-news-card">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80"
              alt="News 2"
            />
            <div className="news-body">
              <h4>CEAT Opens Specialized EV Tyre R&amp;D Center in Halol</h4>
              <p>Specialized low-rolling resistance compounds targeting 15% range increase.</p>
              <button
                type="button"
                className="btn-news-read"
                onClick={() => showToast('Opening Full Article...')}
              >
                Read Full News
              </button>
            </div>
          </div>

          <div className="tyre-news-card">
            <img
              src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80"
              alt="News 3"
            />
            <div className="news-body">
              <h4>Bridgestone Launches Turanza 6 with ENLITEN EV Tech</h4>
              <p>Superior wet grip performance class-A EU certification for passenger cars.</p>
              <button
                type="button"
                className="btn-news-read"
                onClick={() => showToast('Opening Full Article...')}
              >
                Read Full News
              </button>
            </div>
          </div>

          <div className="tyre-news-card">
            <img
              src="https://images.unsplash.com/photo-1543465077-db45d34b88a5?auto=format&fit=crop&w=600&q=80"
              alt="News 4"
            />
            <div className="news-body">
              <h4>Apollo Tyres Crosses 100 Million Radial Milestones in Chennai</h4>
              <p>Exporting to over 70 countries worldwide with zero-defect quality pledge.</p>
              <button
                type="button"
                className="btn-news-read"
                onClick={() => showToast('Opening Full Article...')}
              >
                Read Full News
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. GET BEST QUOTE MODAL */}
      {selectedTyreQuote && (
        <div className="cb360-modal-backdrop animate-fade-in" onClick={() => setSelectedTyreQuote(null)}>
          <div className="cb360-modal-dialog animate-scale" onClick={(e) => e.stopPropagation()}>
            <div className="cb360-modal-header">
              <div className="cb360-modal-title-wrap">
                <span className="cb360-modal-flair">
                  <i className="fa-solid fa-tags"></i> Direct Dealer Quotation
                </span>
                <h3>Get Best Instant Quote for {selectedTyreQuote.brand} {selectedTyreQuote.name}</h3>
              </div>
              <button type="button" className="cb360-modal-close" onClick={() => setSelectedTyreQuote(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="cb360-modal-body">
              <div className="cb360-modal-veh-summary">
                <img src={selectedTyreQuote.image} alt={selectedTyreQuote.name} className="cb360-modal-veh-img" />
                <div className="cb360-modal-veh-details">
                  <h4>{selectedTyreQuote.brand} {selectedTyreQuote.name}</h4>
                  <div className="cb360-modal-tags">
                    <span className="cb360-modal-tag"><i className="fa-solid fa-ring"></i> Size: {selectedTyreQuote.size}</span>
                    <span className="cb360-modal-tag"><i className="fa-solid fa-shield"></i> {selectedTyreQuote.warranty}</span>
                    <span className="cb360-modal-tag"><i className="fa-solid fa-road"></i> {selectedTyreQuote.grip}</span>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Unit Price: </span>
                    <strong style={{ fontSize: '18px', color: '#059669' }}>₹ {selectedTyreQuote.price.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              <div className="cb360-modal-breakdown-card">
                <h5>Quotation Preferences</h5>
                <div className="quote-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Quantity Required</label>
                    <select
                      value={quoteQty}
                      onChange={(e) => setQuoteQty(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                    >
                      <option value={1}>1 Tyre (Spare Replacement)</option>
                      <option value={2}>2 Tyres (Front / Rear Axle Pair)</option>
                      <option value={4}>4 Tyres (Complete Set - Best Deal)</option>
                      <option value={5}>5 Tyres (Complete Set + Stepney)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Delivery Pincode</label>
                    <input
                      type="text"
                      value={quotePincode}
                      onChange={(e) => setQuotePincode(e.target.value)}
                      placeholder="Enter 6-digit Pincode"
                      style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                    />
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginTop: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>Estimated Total ({quoteQty} Tyres):</span>
                    <strong>₹ {(selectedTyreQuote.price * quoteQty).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontSize: '13px' }}>
                    <span><i className="fa-solid fa-circle-check"></i> Free Doorstep Alignment &amp; Nitrogen Filling</span>
                    <span>FREE</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="cb360-modal-footer">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setSelectedTyreQuote(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-confirm-drive"
                onClick={() => {
                  showToast(`Best quote of ₹${(selectedTyreQuote.price * quoteQty).toLocaleString('en-IN')} sent to your WhatsApp & registered phone!`);
                  setSelectedTyreQuote(null);
                }}
              >
                <i className="fa-solid fa-paper-plane"></i>
                <span>Send Quotation to WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
