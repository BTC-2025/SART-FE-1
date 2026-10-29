'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function CaptainHeader({
  partnerDetails,
  isOnDuty,
  setIsOnDuty,
  onOpenProfile,
  onOpenLocationModal,
  onLogout,
  activeSubTab = 'rides',
  setActiveSubTab = (_tab) => { },
  onNavigate = (_route) => { }
}) {

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const subNavItems = [
  ];

  const rideCategories = [
    { id: 'rides', label: '', icon: 'fa-layer-group', route: 'ride-home' },
    { id: 'bike', label: 'Bike Moto', icon: 'fa-motorcycle', route: 'ride-bike' },
    { id: 'auto', label: 'Auto Rickshaw', icon: 'fa-truck-front', route: 'ride-auto' },
    { id: 'car', label: 'Cab & Car', icon: 'fa-car-side', route: 'ride-car' }
  ];

  // If user is inside Rides section (rides, bike, auto, car), show the 3 vehicle categories:
  const isRideSection = ['rides', 'bike', 'auto', 'car'].includes(activeSubTab);

  return (
    <div className="sart-business-nav-wrapper">
      {/* 1. Top Navbar (Matching Customer Emerald Green Header in Screenshot 1) */}
      <header className="web-navbar" style={{ position: 'relative', zIndex: 100 }}>
        {/* Left: SART Brand + Location Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            className="nav-brand"
            onClick={() => {
              window.location.href = '/';
            }}
            style={{ cursor: 'pointer' }}
          >
            <i className="fa-solid fa-compass-drafting brand-icon"></i>
            <span>SART</span>
            <span className="brand-badge">UNIVERSAL</span>
          </div>

          <div
            className="location-nav-btn"
            style={{ flexShrink: 0, alignSelf: 'center', cursor: 'pointer' }}
            onClick={() => {
              if (onOpenLocationModal) onOpenLocationModal();
              else if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('openReactModal', { detail: 'modal-city-selector' }));
              }
            }}
          >
            <i className="fa-solid fa-location-dot"></i>
            <span id="nav-location-txt">{partnerDetails?.city || 'Chennai'}</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i>
          </div>
        </div>

        {/* Center: Home | Store | Tracks Pill Navigation */}
        <nav className="nav-links">
          <div
            className="nav-link active"
            id="nav-btn-home"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              window.location.href = '/';
            }}
          >
            <span>Home</span>
          </div>
          <div
            className="nav-link"
            id="nav-btn-store"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              window.location.href = '/store';
            }}
          >
            <span>Store</span>
          </div>
          <div
            className="nav-link"
            id="nav-btn-booking"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              window.location.href = '/booking';
            }}
          >
            <span>Tracks</span>
          </div>
        </nav>

        {/* Right: Controls & Alex Carter User Profile */}
        <div className="nav-controls">
          <div className="ctrl-btn" title="Search" onClick={() => { }}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>

          <div className="ctrl-btn" title="Favorites" onClick={() => { }}>
            <i className="fa-solid fa-heart"></i>
          </div>

          <div className="ctrl-btn" title="Cart / Alerts" onClick={() => { }}>
            <i className="fa-solid fa-bag-shopping"></i>
          </div>

          {/* Captain Partner Profile with Dropdown */}
          <div ref={profileMenuRef} style={{ position: 'relative' }}>
            <div
              className="profile-nav-btn"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              style={{
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1.5px solid #fecaca',
                background: '#fff1f2'
              }}
            >
              {partnerDetails?.avatarUrl ? (
                <img
                  src={partnerDetails.avatarUrl}
                  alt="Captain Avatar"
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #dc2626' }}
                />
              ) : (
                <i className="fa-solid fa-id-badge" style={{ color: '#dc2626' }}></i>
              )}
              <span style={{ color: '#dc2626', fontWeight: 800, letterSpacing: '0.2px' }}>
                {partnerDetails?.name || 'Captain Partner'}
              </span>
              <span style={{
                background: '#dc2626',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '6px',
                textTransform: 'uppercase'
              }}>
                CAPTAIN
              </span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px', color: '#dc2626' }}></i>
            </div>


            {isProfileDropdownOpen && (
              <div
                className="profile-dropdown-menu show"
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '320px',
                  padding: '16px',
                  borderRadius: '24px',
                  textAlign: 'center',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
                  color: '#000000',
                  zIndex: 9999
                }}
              >
                <div style={{ position: 'relative', width: '70px', height: '70px', margin: '0 auto 10px' }}>
                  {partnerDetails?.avatarUrl ? (
                    <img
                      src={partnerDetails.avatarUrl}
                      alt="Captain Profile"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #dc2626' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: '#dc2626',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        fontWeight: 700
                      }}
                    >
                      {(partnerDetails?.name || 'C').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ display: 'inline-block', background: '#fee2e2', color: '#b91c1c', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', marginBottom: '8px', border: '1px solid #fca5a5' }}>
                  COMMERCIAL FLEET CAPTAIN
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>{partnerDetails?.name || 'Captain Partner'}</h3>
                <p style={{ margin: '2px 0 14px', fontSize: '13px', color: '#64748b' }}>{partnerDetails?.email || partnerDetails?.phone || partnerDetails?.mobile || 'captain@sart.com'}</p>



                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    if (onOpenProfile) onOpenProfile();
                  }}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    borderRadius: '20px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '14px'
                  }}
                >
                  <i className="fa-solid fa-user-gear"></i> Manage your account
                </button>

                <div style={{ borderTop: '1px solid #e2e8f0', margin: '8px 0 10px' }}></div>

                <div
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <i className="fa-solid fa-headset" style={{ color: '#64748b' }}></i> Help & Support
                </div>
                <div
                  style={{
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('sart_captain_session');
                      localStorage.removeItem('sart_captain_jwt_token');
                    }
                    if (onLogout) {
                      onLogout();
                    } else if (typeof window !== 'undefined') {
                      window.location.reload();
                    }
                  }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i> Sign out
                </div>
              </div>
            )}


          </div>
        </div>
      </header>

      {/* 2. Sub-Navbar: Primary Services (Rides, Logistics & Cargo, Rentals, Hire Drivers...) */}
      <nav className="subnavbar-container" aria-label="Sub Navigation">
        <div className="subnavbar-links">
          {subNavItems.map((item) => {
            const isItemActive = item.id === 'rides' ? isRideSection : activeSubTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`subnav-item ${isItemActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveSubTab(item.id);
                  if (item.route) {
                    const targetPath = item.route === 'ride-home' ? '/home/ride' : item.route === 'ride-bike' ? '/home/ride/bike' : item.route === 'ride-auto' ? '/home/ride/auto' : '/home/ride/car';
                    window.history.pushState({}, '', targetPath);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                title={item.label}
              >
                <i className={`fa-solid ${item.icon} subnav-item-icon`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Rides Inner Category Strip - Appears ONLY when user clicks / is in the Rides page */}
      {isRideSection && (
        <div className="sart-biz-category-strip">
          <div className="sart-biz-category-strip-inner">
            <div className="sart-biz-cat-title">
              <i className="fa-solid fa-list-check"></i>
              <span>RIDE CATEGORY:</span>
            </div>
            <div className="sart-biz-category-pills">
              {rideCategories.map((cat) => {
                const isCatActive = activeSubTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`sart-biz-cat-pill ${isCatActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSubTab(cat.id);
                      if (cat.route) {
                        const targetPath = cat.route === 'ride-home' ? '/home/ride' : cat.route === 'ride-bike' ? '/home/ride/bike' : cat.route === 'ride-auto' ? '/home/ride/auto' : '/home/ride/car';
                        window.history.pushState({}, '', targetPath);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }
                    }}
                  >
                    <i className={`fa-solid ${cat.icon}`}></i>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
