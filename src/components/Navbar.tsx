'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './Navbar.css';
import './UserSideBitTool.css';
import UserAuthModal from './UserAuthModal';
import { useSartStore } from '../store/useSartStore';

export default function Navbar() {
  const { wallet, activeTab, setActiveTab, wishlist, cart, isBitToolOpen, toggleBitTool } = useSartStore();
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
  const [userSession, setUserSession] = useState<{ id?: string; name?: string; email?: string; phone?: string; avatar?: string; token?: string } | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const loadSession = () => {
      try {
        const stored = localStorage.getItem('sart_user_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserSession(parsed);
          const qParams = new URLSearchParams();
          if (parsed.token) qParams.append('token', parsed.token);
          if (parsed.phone) qParams.append('phone', parsed.phone);
          if (parsed.email) qParams.append('email', parsed.email);

          fetch(`http://localhost:5000/api/user/profile?${qParams.toString()}`)
            .then(res => {
              if (!res.ok) return null;
              return res.json();
            })
            .then(data => {
              if (data && data.success && data.data && (data.data.name || data.data.email || data.data.phone)) {
                const merged = { ...parsed, ...data.data };
                setUserSession(merged);
                localStorage.setItem('sart_user_session', JSON.stringify(merged));
              }
            })
            .catch(() => { });
        } else {
          setUserSession(null);
        }
      } catch (e) {
        setUserSession(null);
      }
    };
    loadSession();

    const handleSessionChange = () => loadSession();
    window.addEventListener('user-session-changed', handleSessionChange);
    window.addEventListener('storage', handleSessionChange);
    return () => {
      window.removeEventListener('user-session-changed', handleSessionChange);
      window.removeEventListener('storage', handleSessionChange);
    };
  }, []);

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



  // Listen for virtual keyboard typing from Bit-Tool
  useEffect(() => {
    const handleVirtualKey = (e: any) => {
      const key = e.detail?.key;
      if (!key) return;

      setIsSearchExpanded(true);

      if (key === 'Backspace') {
        setSearchQuery(prev => prev.slice(0, -1));
      } else if (key === 'Enter') {
        // keep open
      } else if (key === 'Space') {
        setSearchQuery(prev => prev + ' ');
      } else if (key === 'Esc') {
        setIsSearchExpanded(false);
        setSearchQuery('');
      } else if (key.length === 1) {
        setSearchQuery(prev => prev + key);
      }
    };

    window.addEventListener('sart-virtual-keypress', handleVirtualKey);
    return () => window.removeEventListener('sart-virtual-keypress', handleVirtualKey);
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
          <span id="nav-location-txt" >{currentLocation}</span>
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

      <div className="nav-controls">
        <div className={`search-control-slot ${isSearchExpanded ? 'search-open' : ''}`}>
          <div
            className="ctrl-btn search-trigger-btn"
            onClick={() => setIsSearchExpanded(prev => !prev)}
            title="Search"
          >
            <i className={`fa-solid ${isSearchExpanded ? 'fa-xmark' : 'fa-magnifying-glass'}`}></i>
          </div>

          <div className="expanded-search-container">
            <i className="fa-solid fa-magnifying-glass search-icon-left"></i>
            <input
              type="text"
              className="expanded-search-input"
              placeholder="Search all features, tools, records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsSearchExpanded(false);
                  setSearchQuery('');
                }
              }}
            />
            {searchQuery && isSearchExpanded && (
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
        </div>
        <div className={`ctrl-btn ${activeTab === "favorites" ? "active" : ""}`}
          title="Favorites & Wishlist"
          onClick={() => setActiveTab("favorites")}
        >
          <i className="fa-solid fa-heart"></i>
          {wishlist.length > 0 && <span className="ctrl-badge">{wishlist.length}</span>}
        </div>

        <div
          className="ctrl-btn"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/home/cart';
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
          {!userSession ? (
            /* Logged-out state: Navigate to /home/login */
            <button
              type="button"
              className="nav-login-signup-btn"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/home/login';
                }
              }}
            >
              <span className="login-circle-avatar">
                <i className="fa-solid fa-user"></i>
              </span>
              <span>Log in/Sign up</span>
            </button>
          ) : (
            /* Logged-in state: Image 2 */
            <div
              className="profile-nav-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <i className="fa-solid fa-circle-user"></i>
              <span className="profile-name">{userSession.name || ''}</span>
              <i className="fa-solid fa-chevron-down"></i>
            </div>
          )}

          {userSession && isProfileOpen && (
            /* Image 1 Dropdown */
            <div className="profile-dropdown-menu show" style={{ width: '320px', height: '470px', marginTop: '30px', marginRight: '40px', padding: '14px', borderRadius: '28px', textAlign: 'center', background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', color: '#000000' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 12px' }}>
                {userSession.avatar ? (
                  <img
                    src={userSession.avatar}
                    alt={userSession.name || 'Avatar'}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', color: 'blue', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 500 }}>
                    {(userSession.name || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
                <label style={{ position: 'absolute', bottom: 0, right: 0, background: 'white', color: 'black', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', cursor: 'pointer' }}>
                  <i className="fa-solid fa-camera"></i>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async () => {
                      const base64 = reader.result as string;
                      try {
                        await fetch('http://localhost:5000/api/user/profile/photo', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ image: base64 })
                        });
                      } catch (err) { }
                      const updated = { ...userSession, avatar: base64 };
                      setUserSession(updated);
                      localStorage.setItem('sart_user_session', JSON.stringify(updated));
                      window.dispatchEvent(new CustomEvent('user-photo-updated', { detail: base64 }));
                    };
                    reader.readAsDataURL(file);
                  }} />
                </label>
              </div>
              <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', fontSize: '11px', fontWeight: 100, padding: '3px 10px', borderRadius: '12px', marginBottom: '8px', border: '1px solid #bfdbfe' }}>
                USER
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#2563eb' }}>
                {userSession.name || ''}
              </h3>
              <p style={{ margin: '4px 0 16px', fontSize: '14px', color: '#4b5563' }}>
                {userSession.email || ''}
              </p>
              <p style={{ margin: '4px 0 16px', fontSize: '14px', color: '#4b5563' }}>
                Mobile Number : {userSession.phone || ''}
              </p>

              <button onClick={() => { setActiveTab('profile'); router.push('/home/profile', { scroll: false }); setIsProfileOpen(false); }} style={{ background: 'transparent', border: '1px solid #d1d5db', color: '#000000', borderRadius: '24px', padding: '10px 20px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', width: 'auto' }}>
                <i className="fa-solid fa-user-gear"></i> Manage your account
              </button>

              <div style={{ borderTop: '1px solid #e5e7eb', margin: '0 -24px 10px' }}></div>

              <a className="dropdown-item" style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#000000', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setIsLoginModalOpen(true)}>
                <i className="fa-solid fa-user-plus" style={{ fontSize: '18px', color: '#4b5563' }}></i> Add another account
              </a>
              <a className="dropdown-item" style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#000000', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => { setActiveTab('support'); router.push('/home/support', { scroll: false }); setIsProfileOpen(false); }}>
                <i className="fa-solid fa-headset" style={{ fontSize: '18px', color: '#4b5563' }}></i> Help & Support
              </a>
              <a className="dropdown-item" style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#000000', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => { setActiveTab('profile'); router.push('/profile', { scroll: false }); setIsProfileOpen(false); }}>
                <i className="fa-solid fa-gear" style={{ fontSize: '18px', color: '#4b5563' }}></i> Settings
              </a>
              <a className="dropdown-item signout-btn" style={{ padding: '12px 24px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#000000', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={async () => {
                try {
                  const token = userSession?.token;
                  if (token) {
                    await fetch('http://localhost:5000/api/user/auth/logout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ token })
                    });
                  }
                } catch (e) { }
                localStorage.removeItem('sart_user_session');
                setUserSession(null);
                setIsProfileOpen(false);
                window.dispatchEvent(new CustomEvent('user-session-changed', { detail: null }));
              }}>
                <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: '18px', color: '#4b5563' }}></i> Sign out of this account
              </a>
            </div>
          )}
        </div>

        {/* User Mobile + OTP Login Modal */}
        <UserAuthModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={(u) => {
            setUserSession(u);
            setIsLoginModalOpen(false);
          }}
        />

        {/* 4. Bit-tool / Sliders Toggle Button matching Image 1 & 4 (Circular White Button with BNX blue logo) */}
        <div className="h-6 w-[1px] bg-white/20 ml-0.5 sm:ml-1 hidden sm:block shrink-0"></div>
        <button
          type="button"
          className={`h-8 sm:h-9 px-1.5 sm:px-2 rounded-full bg-white dark:hover:bg-white/10 transition-colors flex items-center justify-center shrink-0 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer nav-bittool-slider-btn bnx-toggle ${isBitToolOpen ? 'active' : ''}`}
          title="Toggle Right Side Utilities"
          onClick={toggleBitTool}
        >
          <img
            src="/images/bnx_slider_icon.png"
            alt="Toggle"
            className="h-4 sm:h-5 object-contain opacity-80 hover:opacity-100 bnx-slider-icon-img"
          />
        </button>
      </div>
    </header >
  );
}
