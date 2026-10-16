'use client';

import React, { useState } from 'react';
import { StoreProduct, formatPrice, ALL_STORE_PRODUCTS } from '../storeProductsData';

interface StoreServicesHubProps {
  showToast: (msg: string) => void;
  setSelectedProductModal: (product: StoreProduct) => void;
  handleAddToCart: (product: StoreProduct) => void;
  selectedBrand: string;
  selectedModel: string;
  selectedYear: string;
  selectedEquipment: Record<string, string[]>;
  getProductTotalPrice: (product: StoreProduct) => number;
}

export default function StoreServicesHub({
  showToast,
  setSelectedProductModal,
  handleAddToCart,
  selectedBrand,
  selectedModel,
  selectedYear,
  selectedEquipment,
  getProductTotalPrice
}: StoreServicesHubProps) {
  const [mechanicCategoryFilter, setMechanicCategoryFilter] = useState<string>('All Services');

  return (
          <section className="gomechanic-hub-view animate-pop">
            {/* GoMechanic Service Guarantee Banner */}
            <div className="gomechanic-hero-banner">
              <div className="gomechanic-banner-text">
                <span className="gm-badge"><i className="fa-solid fa-wrench"></i> GOMECHANIC CERTIFIED AUTO REPAIR</span>
                <h2>Expert Doorstep &amp; Workshop Car &amp; Bike Services</h2>
                <p>Free doorstep pick-up &amp; drop, genuine OEM spares, 1000 km warranty &amp; live service updates on SART.</p>
              </div>

              <div className="gomechanic-perks-row">
                <div className="gm-perk"><i className="fa-solid fa-truck-pickup"></i><span>Free Pick-up &amp; Drop</span></div>
                <div className="gm-perk"><i className="fa-solid fa-shield-halved"></i><span>1000 km / 1 Month Warranty</span></div>
                <div className="gm-perk"><i className="fa-solid fa-user-check"></i><span>Dedicated Service Buddy</span></div>
                <div className="gm-perk"><i className="fa-solid fa-file-invoice-dollar"></i><span>Up to 40% Cheaper than Dealerships</span></div>
              </div>
            </div>

            {/* Split Layout: Left Service Categories Sidebar + Right Service Packages Grid */}
            <div className="store-split-layout">
              {/* LEFT SIDEBAR: GoMechanic Service Categories */}
              <aside className="store-left-sidebar">
                <div className="sidebar-card">
                  <div className="sidebar-header">
                    <h4><i className="fa-solid fa-screwdriver-wrench"></i> Service Packages</h4>
                    <span className="sidebar-total-badge">{ALL_STORE_PRODUCTS.filter(p => p.isService).length} Packages</span>
                  </div>

                  <div className="sidebar-nav-pills">
                    {[
                      { id: 'All Services', label: 'All Workshop Services', icon: 'fa-globe' },
                      { id: 'Periodic Services', label: 'Periodic Maintenance', icon: 'fa-oil-can' },
                      { id: 'AC Service & Repair', label: 'AC Deep Clean & Gas', icon: 'fa-snowflake' },
                      { id: 'Brakes & Clutch', label: 'Brakes & Clutch Overhaul', icon: 'fa-circle-dot' },
                      { id: 'Tyres & Wheel Care', label: 'Tyres & Wheel Alignment', icon: 'fa-circle-notch' },
                      { id: 'Cleaning & Detailing', label: 'Car Spa & Ceramic Polish', icon: 'fa-sparkles' },
                      { id: 'Custom Tuning & Mods', label: 'ECU Remap & Modifications', icon: 'fa-wand-magic-sparkles' },
                      { id: 'Authorized Workshop', label: 'Authorized Center Stamp', icon: 'fa-building-shield' },
                      { id: 'Heavy Commercial Fleet', label: 'Heavy Truck & Bus Fleet', icon: 'fa-truck-moving' },
                    ].map((srv) => (
                      <button
                        key={srv.id}
                        type="button"
                        className={`sidebar-nav-item ${mechanicCategoryFilter === srv.id ? 'active' : ''}`}
                        onClick={() => setMechanicCategoryFilter(srv.id)}
                      >
                        <i className={`fa-solid ${srv.icon}`}></i>
                        <span>{srv.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* GoMechanic Live Support Box */}
                  <div className="sidebar-trust-box gomechanic-trust">
                    <i className="fa-solid fa-headset"></i>
                    <div>
                      <strong>Need Advice on Repairs?</strong>
                      <p>Talk to our master automotive mechanics for instant diagnosis &amp; upfront pricing.</p>
                      <button
                        type="button"
                        className="btn-call-mechanic-sidebar"
                        onClick={() => showToast('Calling SART Mechanic Advisor Hotline (1800-SART-TECH)...')}
                      >
                        <i className="fa-solid fa-phone"></i> Call Service Advisor
                      </button>
                    </div>
                  </div>
                </div>
              </aside>

              {/* RIGHT CONTENT: GoMechanic Service Package Cards */}
              <main className="store-right-content">
                <div className="content-top-status-bar">
                  <div>
                    <h3 className="content-heading">Select Vehicle Service or Custom Repair Package</h3>
                    <p className="content-subtext">
                      All packages include multi-point vehicle safety health audit, transparent pricing, and contactless handover.
                    </p>
                  </div>

                  {/* Vehicle Context Tag */}
                  <div className="gomechanic-active-veh-pill">
                    <i className="fa-solid fa-car"></i>
                    <span>Service For: <strong>{selectedBrand} {selectedModel} ({selectedYear})</strong></span>
                  </div>
                </div>

                <div className="gomechanic-packages-grid">
                  {ALL_STORE_PRODUCTS
                    .filter((item) => item.isService)
                    .filter((item) => {
                      if (mechanicCategoryFilter === 'All Services') return true;
                      const blob = `${item.name} ${item.desc} ${item.section} ${item.category}`.toLowerCase();
                      if (mechanicCategoryFilter === 'Periodic Services') return blob.includes('periodic') || blob.includes('engine oil') || blob.includes('tune-up');
                      if (mechanicCategoryFilter === 'AC Service & Repair') return blob.includes('ac') || blob.includes('gas') || blob.includes('cooling');
                      if (mechanicCategoryFilter === 'Brakes & Clutch') return blob.includes('brake') || blob.includes('caliper') || blob.includes('clutch');
                      if (mechanicCategoryFilter === 'Tyres & Wheel Care') return blob.includes('tyre') || blob.includes('wheel') || blob.includes('puncture');
                      if (mechanicCategoryFilter === 'Cleaning & Detailing') return blob.includes('ceramic') || blob.includes('wash') || blob.includes('polish') || blob.includes('clean');
                      if (mechanicCategoryFilter === 'Custom Tuning & Mods') return blob.includes('remap') || blob.includes('wrap') || blob.includes('exhaust') || blob.includes('modification') || blob.includes('ambient');
                      if (mechanicCategoryFilter === 'Authorized Workshop') return blob.includes('authorized') || blob.includes('service center');
                      if (mechanicCategoryFilter === 'Heavy Commercial Fleet') return blob.includes('lorry') || blob.includes('commercial') || blob.includes('fleet') || blob.includes('auto');
                      return true;
                    })
                    .map((service) => {
                      const includesList = service.includes || [];
                      const chosenAddOns = selectedEquipment[service.id] ?? [];
                      const totalCost = getProductTotalPrice(service);

                      return (
                        <div
                          key={service.id}
                          className="gomechanic-card cursor-pointer"
                          onClick={() => setSelectedProductModal(service)}
                        >
                          <div className="gm-card-header">
                            <div className="gm-header-left">
                              <span className="gm-duration-tag"><i className="fa-regular fa-clock"></i> {service.duration || '2-3 Hrs'}</span>
                              {service.warranty && (
                                <span className="gm-warranty-tag"><i className="fa-solid fa-shield"></i> {service.warranty}</span>
                              )}
                            </div>
                            <span className="gm-pickup-pill"><i className="fa-solid fa-truck-pickup"></i> Free Pick-up</span>
                          </div>

                          <div className="gm-card-body">
                            <div className="gm-title-media-row">
                              <div className="gm-info-col">
                                <h4 className="gm-service-name">{service.name}</h4>
                                <p className="gm-service-desc">{service.desc}</p>
                              </div>
                              <img src={service.image} alt={service.name} className="gm-thumb" />
                            </div>

                            {/* Service Inclusions Checklist */}
                            {includesList.length > 0 && (
                              <div className="gm-inclusions-box">
                                <div className="inclusions-title"><i className="fa-solid fa-clipboard-check"></i> What's Included:</div>
                                <div className="inclusions-grid">
                                  {includesList.slice(0, 4).map((inc, i) => (
                                    <div key={i} className="inclusion-item">
                                      <i className="fa-solid fa-check"></i>
                                      <span>{inc}</span>
                                    </div>
                                  ))}
                                  {includesList.length > 4 && (
                                    <span className="inclusions-more">+{includesList.length - 4} more inspection points</span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Footer Price & Booking CTA */}
                            <div className="gm-card-footer">
                              <div className="gm-pricing">
                                <span className="gm-cost">{formatPrice(totalCost)}</span>
                                {service.originalPrice && (
                                  <span className="gm-original-cost">{formatPrice(service.originalPrice)}</span>
                                )}
                              </div>

                              <button
                                type="button"
                                className="btn-book-service"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(service);
                                }}
                              >
                                <i className="fa-solid fa-calendar-check"></i>
                                <span>Book Service</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </main>
            </div>
          </section>
  );
}
