'use client';
import React, { useState } from 'react';

export default function CaptainProfilePage({
  partnerDetails,
  onBackToHome,
  onLogout
}) {
  // Default to 'partner-services' (2nd image content) as requested by user
  const [activeTab, setActiveTab] = useState('partner-services');

  return (
    <div className="c-profile-page-container">
      {/* Top Banner Bar */}
      <div className="c-profile-page-header">
        <button
          type="button"
          onClick={onBackToHome}
          className="c-profile-back-btn"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Business Home</span>
        </button>

        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0f172a' }}>
          SART Business Partner & Captain Profile
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className={`c-profile-tab-toggle-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fa-solid fa-user-gear"></i>
            <span>Account & KYC</span>
          </button>
          <button
            type="button"
            className={`c-profile-tab-toggle-btn ${activeTab === 'partner-services' ? 'active' : ''}`}
            onClick={() => setActiveTab('partner-services')}
          >
            <i className="fa-solid fa-cubes"></i>
            <span>Partner Hub & Services</span>
          </button>
        </div>
      </div>

      <div className="c-profile-page-content">
        {/* Star Captain Gold & Blue Banner (Screenshot 4) */}
        <div className="c-profile-hero-banner">
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '65%' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 6px', color: '#fef08a' }}>Star Captain</h3>
            <p style={{ margin: '0 0 12px', fontSize: '13.5px', color: '#e0e7ff', lineHeight: '1.4' }}>
              Trusted and top rated by customers across {partnerDetails?.city || 'Chennai'}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '5px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 700 }}>
              <i className="fa-solid fa-award"></i>
              <span>Tier: Platinum Business Partner</span>
            </div>
          </div>

          <div className="c-profile-star-graphic">
            ★
          </div>
        </div>

        {/* Profile Card Container (Laptop Grid) */}
        <div className="c-profile-details-grid">
          {/* Left Sub-card: Avatar, Name, Stats, Logout */}
          <div className="c-profile-user-card">
            <div className="c-profile-avatar-circle" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {partnerDetails?.avatarUrl ? (
                <img
                  src={partnerDetails.avatarUrl}
                  alt={partnerDetails.name || 'Captain'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#0b50c0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800 }}>
                  {partnerDetails?.name ? partnerDetails.name.charAt(0).toUpperCase() : 'V'}
                </div>
              )}
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              {partnerDetails?.name || 'Sai'}
            </h3>
            <div style={{ fontSize: '12.5px', color: '#0284c7', fontWeight: 700, marginBottom: '6px' }}>
              {partnerDetails?.email || 'gmvinoth@bnxmail.com'}
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px' }}>
              {partnerDetails?.plateNumber || partnerDetails?.vehiclePlate || 'TN 09 BK 4421'} • {partnerDetails?.vehicleModel || 'Bajaj RE Auto'}
            </p>

            {/* 3 Stats (Screenshot 4 & 5) */}
            <div className="c-profile-stats-row">
              <div className="c-pstat">
                <div className="val">4.9 <span style={{ color: '#f59e0b' }}>★</span></div>
                <div className="lbl">RATING &gt;</div>
              </div>
              <div className="c-pstat">
                <div className="val">495</div>
                <div className="lbl">ORDERS</div>
              </div>
              <div className="c-pstat">
                <div className="val">3.0</div>
                <div className="lbl">YEARS</div>
              </div>
            </div>

            {/* Logout and Reset */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                id="captain-logout-btn"
                onClick={onLogout}
                className="c-btn-logout"
              >
                <i className="fa-solid fa-power-off"></i>
                <span>Logout / Reset Session</span>
              </button>
            </div>
          </div>

          {/* Right Sub-card: Interactive Content (Account Settings OR Partner Hub Services from 2nd Image) */}
          <div className="c-profile-menu-card">
            {activeTab === 'partner-services' ? (
              /* Second Image Content (Earnings, Incentives, Rewards, Service Manager, Demand Planner, Help, Refer, Vehicle Numbers) */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Partner Management & Earning Hub
                  </h4>
                  <span style={{ fontSize: '12px', background: '#dcfce7', color: '#15803d', fontWeight: 800, padding: '3px 10px', borderRadius: '12px' }}>
                    Active Services
                  </span>
                </div>

                <div className="c-profile-menu-list">
                  <div className="c-profile-row-item">
                    <div className="left">
                      <div className="icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                        <i className="fa-solid fa-wallet"></i>
                      </div>
                      <div>
                        <div className="title">Earnings</div>
                        <div className="desc">Transfer Money to Bank, History</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                  </div>

                  <div className="c-profile-row-item">
                    <div className="left">
                      <div className="icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                        <i className="fa-solid fa-money-bill-wave"></i>
                      </div>
                      <div>
                        <div className="title">Incentives and More</div>
                        <div className="desc">Know how you get paid</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                  </div>

                  <div className="c-profile-row-item">
                    <div className="left">
                      <div className="icon" style={{ background: '#fdf2f8', color: '#db2777' }}>
                        <i className="fa-solid fa-gift"></i>
                      </div>
                      <div>
                        <div className="title">Rewards</div>
                        <div className="desc">Insurance and Discounts</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                  </div>

                  <div className="c-profile-row-item">
                    <div className="left">
                      <div className="icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                        <i className="fa-solid fa-cubes"></i>
                      </div>
                      <div>
                        <div className="title">Service Manager</div>
                        <div className="desc">Food Delivery & more</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                  </div>

                  <div className="c-profile-row-item">
                    <div className="left">
                      <div className="icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                        <i className="fa-solid fa-chart-pie"></i>
                      </div>
                      <div>
                        <div className="title">Demand Planner</div>
                        <div className="desc">Past High Demand Areas & More</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                  </div>

                  <div className="c-profile-row-item">
                    <div className="left">
                      <div className="icon" style={{ background: '#ecfeff', color: '#0891b2' }}>
                        <i className="fa-solid fa-headset"></i>
                      </div>
                      <div>
                        <div className="title">Help</div>
                        <div className="desc">Get support, Accident Insurance</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                  </div>

                  <div className="c-profile-row-item">
                    <div className="left">
                      <div className="icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                        <i className="fa-solid fa-user-group"></i>
                      </div>
                      <div>
                        <div className="title">Refer friends</div>
                        <div className="desc">Earn up to ₹800</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                  </div>
                </div>

                {/* Get New Vehicle Numbers (From 2nd Screenshot) */}
                <div style={{ marginTop: '20px', background: '#eff6ff', padding: '16px 20px', borderRadius: '16px', border: '1.5px dashed #93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h5 style={{ margin: '0 0 4px', fontSize: '14.5px', fontWeight: 800, color: '#1e3a8a' }}>
                      Get New Vehicle Numbers
                    </h5>
                    <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                      Add to SART Captain Fleet & Earn Daily
                    </p>
                  </div>
                  <button
                    type="button"
                    style={{
                      background: '#1d4ed8',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '24px',
                      padding: '10px 22px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(29, 78, 216, 0.3)'
                    }}
                  >
                    Tap to Earn
                  </button>
                </div>
              </div>
            ) : (
              /* Account Settings & Credentials (4th & 5th Screenshots) */
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#334155', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Account Settings & Credentials
                </h4>

                <div className="c-profile-menu-list">
                  <div className="c-profile-row-item">
                    <div className="left">
                      <div className="icon"><i className="fa-solid fa-gauge"></i></div>
                      <div>
                        <div className="title">Average</div>
                        <div className="desc">View acceptance rate, cancellation metrics and feedback</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                  </div>

                  <div className="c-profile-row-item">
                    <div className="left">
                      <div className="icon"><i className="fa-solid fa-user-circle"></i></div>
                      <div>
                        <div className="title">Profile Info</div>
                        <div className="desc">Legal name ({partnerDetails?.name}), phone ({partnerDetails?.mobile || '+91 98765 43210'}), email</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                  </div>

                  <div className="c-profile-row-item">
                    <div className="left">
                      <div className="icon"><i className="fa-solid fa-id-badge"></i></div>
                      <div>
                        <div className="title">SART Captain ID Card</div>
                        <div className="desc">Verified government authorized digital identity card</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                  </div>

                  <div className="c-profile-row-item">
                    <div className="left">
                      <div className="icon"><i className="fa-solid fa-certificate"></i></div>
                      <div>
                        <div className="title">Documents (RC, DL, PAN)</div>
                        <div className="desc">Verified driving license ({partnerDetails?.license || 'DL-042022009214'}), vehicle insurance & PAN</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                  </div>

                  <div className="c-profile-row-item">
                    <div className="left">
                      <div className="icon"><i className="fa-solid fa-language"></i></div>
                      <div>
                        <div className="title">Language Settings</div>
                        <div className="desc">English, Hindi, Tamil, Telugu, Kannada navigation voice</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow"></i>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

