'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './Navbar.css';
import { useSartStore } from '../store/useSartStore';

export default function Navbar() {
  const { wallet, activeTab, setActiveTab, wishlist, cart } = useSartStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBittoolOpen, setIsBittoolOpen] = useState(false);
  const bittoolRef = useRef<HTMLDivElement>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState('Chennai');
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const SEARCH_OPTIONS = [
    { title: 'Road Ride Booking', kw: ['ride', 'taxi', 'car', 'cab', 'economy', 'suv'], modal: 'modal-ride', icon: 'fa-car', color: 'var(--primary)' },
    { title: 'Logistics Cargo Truck', kw: ['carrier', 'truck', 'logistics', 'delivery', 'cargo'], modal: 'modal-carrier', icon: 'fa-truck', color: 'var(--secondary)' },
    { title: 'Hourly Vehicle Rental', kw: ['rental', 'key', 'nexon', 'himalayan', 'bike', 'motorcycle'], modal: 'modal-rental', icon: 'fa-key', color: 'var(--accent)' },
    { title: 'Personal Chauffeur Hire', kw: ['driver', 'chauffeur', 'verified'], modal: 'modal-drivers', icon: 'fa-user-tie', color: 'var(--warning)' },
    { title: 'Shared Parking Spot', kw: ['parking', 'slot', 'ev slot'], modal: 'modal-parking', icon: 'fa-square-p', color: '#8b5cf6' },
    { title: 'Mechanic Diagnostic Visit', kw: ['mechanic', 'repair', 'wheel', 'overhaul'], modal: 'modal-mechanic', icon: 'fa-screwdriver-wrench', color: '#64748b' },
    { title: 'Ferry & Yacht Sea Booking', kw: ['sea', 'ferry', 'yacht', 'maritime', 'boat', 'water'], modal: 'modal-sea', icon: 'fa-ship', color: 'var(--success)' },
    { title: 'Flight & Heli Air Booking', kw: ['air', 'flight', 'helicopter', 'chopper', 'plane', 'sky'], modal: 'modal-air', icon: 'fa-plane', color: 'var(--warning)' },
    { title: 'Train Vande Bharat Book', kw: ['train', 'express', 'metro', 'railway', 'vande', 'rajdhani'], modal: 'modal-train', icon: 'fa-train', color: '#c864ff' }
  ];

  const [captainProfile, setCaptainProfile] = useState<{ name?: string; email?: string; phone?: string } | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('sart_captain_session');
        if (stored) {
          setCaptainProfile(JSON.parse(stored));
        }
      }
    } catch (e) { }
  }, []);

  useEffect(() => {
    const handleLocationUpdate = (e: any) => {
      setCurrentLocation(e.detail);
    };
    window.addEventListener('updateLocation', handleLocationUpdate);
    return () => window.removeEventListener('updateLocation', handleLocationUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (bittoolRef.current && !bittoolRef.current.contains(event.target as Node)) {
        setIsBittoolOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className="web-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="nav-brand" onClick={() => {
          if (typeof window !== 'undefined') {
            const { useSartStore } = require('@/store/useSartStore');
            useSartStore.getState().setActiveTab('home');
          }
        }} style={{ cursor: 'pointer' }}>
          <i className="fa-solid fa-compass-drafting brand-icon"></i>
          <span>SART</span>
          <span className="brand-badge">UNIVERSAL</span>
        </div>

        <div className="location-nav-btn" style={{ flexShrink: 0, alignSelf: 'center' }} onClick={() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('openReactModal', { detail: 'modal-city-selector' }));
          }
        }}>
          <i className="fa-solid fa-location-dot"></i>
          <span id="nav-location-txt">{currentLocation}</span>
          <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i>
        </div>
      </div>

      <nav className="nav-links">
        <div
          className={`nav-link ${['home', 'ride', 'carrier', 'rental', 'drivers', 'community', 'mechanic', 'parking'].includes(activeTab) ? 'active' : ''}`}
          id="nav-btn-home"
          onClick={() => {
            setActiveTab('home');
            router.push('/', { scroll: false });
          }}
        >
          <span>Home</span>
        </div>
        <div
          className={`nav-link ${activeTab === 'store' ? 'active' : ''}`}
          id="nav-btn-store"
          onClick={() => {
            setActiveTab('store');
            router.push('/store', { scroll: false });
          }}
        >
          <span>Store</span>
        </div>
        <div
          className={`nav-link ${activeTab === 'booking' ? 'active' : ''}`}
          id="nav-btn-booking"
          onClick={() => {
            setActiveTab('booking');
            router.push('/booking', { scroll: false });
          }}
        >
          <span>Tracks</span>
        </div>

      </nav>

      {isSearchExpanded && (
        <div className="expanded-search-container">
          <i className="fa-solid fa-magnifying-glass search-icon-left"></i>
          <input
            type="text"
            className="expanded-search-input"
            placeholder="Search..."
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => setTimeout(() => { setIsSearchExpanded(false); setSearchQuery(''); }, 200)}
          />
          {searchQuery && (
            <div className="search-dropdown">
              {SEARCH_OPTIONS.filter(opt => opt.title.toLowerCase().includes(searchQuery.toLowerCase()) || opt.kw.some(k => k.includes(searchQuery.toLowerCase()))).length > 0 ? (
                SEARCH_OPTIONS.filter(opt => opt.title.toLowerCase().includes(searchQuery.toLowerCase()) || opt.kw.some(k => k.includes(searchQuery.toLowerCase()))).map(opt => (
                  <div key={opt.title} className="booking-card" onClick={() => { (window as any).openModal(opt.modal); setIsSearchExpanded(false); setSearchQuery(''); }}>
                    <div className="booking-card-left">
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: opt.color }}>
                        <i className={`fa-solid ${opt.icon}`}></i>
                      </div>
                      <div className="booking-card-text">
                        <h4 style={{ margin: 0, fontSize: '13px', color: '#fff' }}>{opt.title}</h4>
                        <p style={{ margin: '2px 0 0 0', fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Shortcut trigger</p>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}></i>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '15px', fontSize: '12px' }}>
                  No matching modules found in directory.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="nav-controls">

        <div className="ctrl-btn" style={{ visibility: isSearchExpanded ? 'hidden' : 'visible' }} onClick={() => setIsSearchExpanded(true)}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>

        <div
          className={`ctrl-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
          title="Favorites & Wishlist"
        >
          <i className="fa-solid fa-heart"></i>
          {wishlist.length > 0 && <span className="ctrl-badge">{wishlist.length}</span>}
        </div>

        <div
          className="ctrl-btn"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('openReactModal', { detail: 'modal-cart' }));
            }
          }}
          title="Shopping Cart"
        >
          <i className="fa-solid fa-bag-shopping"></i>
          {cart.length > 0 && <span className="ctrl-badge">{cart.length}</span>}
        </div>





        <div ref={bittoolRef} style={{ position: 'relative' }}>
          {/* Bit-tool Sliders Button beside Alex Carter */}
          {/* <button
            type="button"
            className={`nav-bittool-btn ${isBittoolOpen ? 'active' : ''}`}
            onClick={() => setIsBittoolOpen(!isBittoolOpen)}
            title="Captain and Vehicle Mode Switcher"
          >
            <i className="fa-solid fa-sliders"></i>
          </button> */}

          {/* Vertical Dropdown Strip with Captain Vehicle Icons & Business tools */}
          {isBittoolOpen && (
            <div className="captain-bittool-dropdown">
              <div className="bittool-dropdown-header">
                <span>CAPTAIN DISPATCH</span>
              </div>

              {/* 1. Bike Captain (Helmet Icon) -> Route: /ride/captain/bike */}
              <button
                type="button"
                className="bittool-vehicle-item bike"
                onClick={() => {
                  setIsBittoolOpen(false);
                  router.push('/ride/captain/login?category=bike');
                }}
                title="Bike Captain (Helmet)"
              >
                <div className="vehicle-icon-pill yellow">
                  <i className="fa-solid fa-helmet-safety"></i>
                </div>
                <div className="vehicle-info-text">
                  <strong>Bike Captain</strong>
                  <span>/ride/captain/login?category=bike</span>
                </div>
              </button>

              {/* 2. Auto Captain (Auto Rickshaw Icon) -> Route: /ride/captain/auto */}
              <button
                type="button"
                className="bittool-vehicle-item auto"
                onClick={() => {
                  setIsBittoolOpen(false);
                  router.push('/ride/captain/login?category=auto');
                }}
                title="Auto Captain (Auto Rickshaw)"
              >
                <div className="vehicle-icon-pill green">
                  <i className="fa-solid fa-taxi"></i>
                </div>
                <div className="vehicle-info-text">
                  <strong>Auto Captain</strong>
                  <span>/ride/captain/login?category=auto</span>
                </div>
              </button>

              {/* 3. Cab Captain (Car Seat Icon) -> Route: /ride/captain/car */}
              <button
                type="button"
                className="bittool-vehicle-item car"
                onClick={() => {
                  setIsBittoolOpen(false);
                  router.push('/ride/captain/login?category=car');
                }}
                title="Cab Captain (Car Seat)"
              >
                <div className="vehicle-icon-pill blue">
                  <i className="fa-solid fa-chair"></i>
                </div>
                <div className="vehicle-info-text">
                  <strong>Cab Captain</strong>
                  <span>/ride/captain/login?category=car</span>
                </div>
              </button>

              <div className="bittool-dropdown-divider"></div>

              {/* Business Portal Quick Launch */}
              <button
                type="button"
                className="bittool-vehicle-item business"
                onClick={() => {
                  setIsBittoolOpen(false);
                  window.open('http://localhost:3007', '_blank');
                }}
                title="SART Business Portal"
              >
                <div className="vehicle-icon-pill brand">
                  <span style={{ fontFamily: 'serif', fontWeight: 800 }}>B</span>
                </div>
                <div className="vehicle-info-text">
                  <strong>SART Business Portal</strong>
                  <span>Fleet & Rental Partner</span>
                </div>
              </button>
            </div>
          )}
        </div>

        <div ref={profileRef}>
          <div className="profile-nav-btn" onClick={() => setIsProfileOpen(!isProfileOpen)} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-circle-user" style={{ color: '#2563eb' }}></i>
            <span style={{ color: '#2563eb', fontWeight: 700 }}>Alex Carter</span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px', color: '#2563eb' }}></i>
          </div>

          {isProfileOpen && (
            <div className="profile-dropdown-menu show" style={{ width: '320px', height: '470px', padding: '14px', borderRadius: '28px', textAlign: 'center', background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: '#000000' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 12px' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 500 }}>
                  A
                </div>
                <label style={{ position: 'absolute', bottom: 0, right: 0, background: 'white', color: 'black', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', cursor: 'pointer' }}>
                  <i className="fa-solid fa-camera"></i>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { if (e.target.files && e.target.files[0]) alert('Selected file: ' + e.target.files[0].name) }} />
                </label>
              </div>
              <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', marginBottom: '8px', border: '1px solid #bfdbfe' }}>
                CUSTOMER / USER
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#2563eb' }}>
                Alex Carter
              </h3>
              <p style={{ margin: '4px 0 16px', fontSize: '14px', color: '#4b5563' }}>
                alex.carter@sart.com
              </p>




              <button onClick={() => console.log('Manage Account')} style={{ background: 'transparent', border: '1px solid #d1d5db', color: '#000000', borderRadius: '24px', padding: '10px 20px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', width: 'auto' }}>
                <i className="fa-solid fa-user-gear"></i> Manage your account
              </button>

              {/* <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                <button onClick={() => { document.body.classList.add('light-theme'); localStorage.setItem('sart-theme', 'light'); }} style={{ background: '#f3f4f6', border: 'none', color: '#000000', padding: '8px 16px', borderRadius: '12px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fa-solid fa-sun"></i> Light</button>
                <button onClick={() => { document.body.classList.remove('light-theme'); localStorage.setItem('sart-theme', 'dark'); }} style={{ background: '#f3f4f6', border: 'none', color: '#000000', padding: '8px 16px', borderRadius: '12px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fa-solid fa-moon"></i> Dark</button>
              </div> */}

              <div style={{ borderTop: '1px solid #e5e7eb', margin: '0 -24px 10px' }}></div>

              <a className="dropdown-item" style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#000000', display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => console.log('Add account')}>
                <i className="fa-solid fa-user-plus" style={{ fontSize: '18px', color: '#4b5563' }}></i> Add another account
              </a>
              <a className="dropdown-item" style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#000000', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => { setActiveTab('support'); router.push('/home/support', { scroll: false }); setIsProfileOpen(false); }}>
                <i className="fa-solid fa-headset" style={{ fontSize: '18px', color: '#4b5563' }}></i> Help & Support
              </a>
              <a className="dropdown-item" style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#000000', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => { setActiveTab('profile'); router.push('/profile', { scroll: false }); setIsProfileOpen(false); }}>
                <i className="fa-solid fa-gear" style={{ fontSize: '18px', color: '#4b5563' }}></i> Settings
              </a>
              <a className="dropdown-item signout-btn" style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#000000', display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => { console.log('Sign out'); setIsProfileOpen(false); }}>
                <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: '18px', color: '#4b5563' }}></i> Sign out of this account
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
