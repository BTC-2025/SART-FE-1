'use client';

import React, { useState, useEffect } from 'react';
import './CaptainHub.css';
import CaptainHeader from './CaptainHeader';
import CaptainDutyRightView from './CaptainDutyRightView';
import CaptainProfilePage from './CaptainProfilePage';
import EnableLocationModal from './EnableLocationModal';
import RideCategoryPage from './RideCategoryPage';
import Footer from './Footer';
import CaptainRegisterPage from './CaptainRegisterPage';

interface CaptainHubViewProps {
  initialCategory?: 'bike' | 'auto' | 'car';
}

export default function CaptainHubView({ initialCategory = 'bike' }: CaptainHubViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState<any>(null);

  const [isOnDuty, setIsOnDuty] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<any>(initialCategory);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'category' | 'profile' | 'all'>('category');
  const [showScrollBottom, setShowScrollBottom] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    let sessionUser: any = null;
    try {
      const stored = localStorage.getItem('sart_captain_session');
      if (stored) {
        sessionUser = JSON.parse(stored);
        setPartnerDetails(sessionUser);
      }
    } catch (e) { }

    // Helper to update location in state and localStorage
    const applyLocation = (city: string, lat: number, lng: number) => {
      setPartnerDetails((prev: any) => {
        const updated = {
          ...(prev || sessionUser || {}),
          lat,
          lng,
          city,
          exactAddress: `${city} (${lat.toFixed(4)}, ${lng.toFixed(4)})`
        };
        try {
          localStorage.setItem('sart_captain_session', JSON.stringify(updated));
        } catch (e) { }
        return updated;
      });
    };

    // 1. Fetch location based on local network IP immediately (works without browser prompt)
    const fetchNetworkLocation = async () => {
      try {
        const res = await fetch('https://ipwho.is/');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.city) {
            applyLocation(data.city, data.latitude, data.longitude);
            return true;
          }
        }
      } catch (e) { }
      return false;
    };

    // 2. Fetch high-precision GPS (refines network IP location when allowed)
    const fetchGpsLocation = () => {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            let cityName = sessionUser?.city || 'Chennai';
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`, {
                headers: { 'Accept-Language': 'en' }
              });
              if (res.ok) {
                const data = await res.json();
                const addr = data.address || {};
                cityName = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || 'Chennai';
              }
            } catch (e) { }
            applyLocation(cityName, lat, lng);
          },
          async (err) => {
            console.warn('GPS location fallback to network IP:', err.message);
            await fetchNetworkLocation();
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
      } else {
        fetchNetworkLocation();
      }
    };

    // Run network IP location immediately for instant header display, then refine with GPS
    fetchNetworkLocation();
    fetchGpsLocation();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll - scrollPos < 120) {
        setShowScrollBottom(false);
      } else {
        setShowScrollBottom(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveSubTab(initialCategory);
    if (partnerDetails) {
      setPartnerDetails((prev: any) => ({
        ...prev,
        serviceType: initialCategory,
        vehicleModel: initialCategory === 'bike' ? (prev?.vehicleModel || 'Hero Splendor / White EV Bike') : initialCategory === 'auto' ? (prev?.vehicleModel || 'Bajaj RE Compact Auto') : (prev?.vehicleModel || 'Maruti Suzuki Dzire')
      }));
    }
  }, [initialCategory]);

  const handleCitySelect = (newCity: string, coords?: { lat: number; lng: number }) => {
    const updated = {
      ...partnerDetails,
      city: newCity,
      ...(coords ? { lat: coords.lat, lng: coords.lng } : {})
    };
    setPartnerDetails(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sart_captain_session', JSON.stringify(updated));
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sart_captain_session');
      localStorage.removeItem('sart_captain_jwt_token');
      setPartnerDetails(null);
    }
  };

  const scrollToBottom = () => {
    if (typeof window !== 'undefined') {
      const scrollMax = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      window.scrollTo({
        top: scrollMax,
        behavior: 'smooth'
      });
      const showcaseEl = document.getElementById('sart-captain-fleet-showcase');
      if (showcaseEl) {
        setTimeout(() => {
          showcaseEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 150);
      }
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Prevent SSR hydration mismatch before component mounts in browser
  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 700 }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '10px', color: '#16a34a' }}></i>
          Loading Captain Business Portal...
        </div>
      </div>
    );
  }

  // If Captain is not logged in / registered, show the Captain Authentication & Registration Page
  // STRICT ROUTE GUARD: If Captain is not authenticated, redirect to /ride/captain/login
  if (!partnerDetails) {
    if (typeof window !== 'undefined') {
      window.location.replace('/ride/captain/login?category=' + initialCategory);
    }
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a101d' }}>
        <div style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 700 }}>
          <i className="fa-solid fa-lock" style={{ marginRight: '10px', color: '#ef4444' }}></i>
          Redirecting to Captain Sign In (/ride/captain/login)...
        </div>
      </div>
    );
  }

  // Original fallback if already on login view
  if (!partnerDetails && false) {
    return (
      <CaptainRegisterPage
        onLoginSuccess={(captainUser: any) => {
          setPartnerDetails(captainUser);
        }}
      />
    );
  }

  return (
    <div className="sart-captain-hub-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', position: 'relative' }}>
      <CaptainHeader
        partnerDetails={partnerDetails}
        isOnDuty={isOnDuty}
        setIsOnDuty={setIsOnDuty}
        onOpenProfile={() => setCurrentView('profile')}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onLogout={handleLogout}

        activeSubTab={activeSubTab}
        setActiveSubTab={(tab: any) => {
          setActiveSubTab(tab);
          if (['bike', 'auto', 'car'].includes(tab)) {
            setCurrentView('category');
          } else {
            setCurrentView('all');
          }
        }}
        onNavigate={(route: any) => {
          if (route === 'profile') setCurrentView('profile');
          else if (route === 'ride-bike') { setActiveSubTab('bike'); setCurrentView('category'); }
          else if (route === 'ride-auto') { setActiveSubTab('auto'); setCurrentView('category'); }
          else if (route === 'ride-car') { setActiveSubTab('car'); setCurrentView('category'); }
          else setCurrentView('all');
        }}
      />

      <EnableLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectCity={handleCitySelect}
        currentCity={partnerDetails?.city || 'Chennai'}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        {currentView === 'profile' ? (
          <CaptainProfilePage
            partnerDetails={partnerDetails}
            onBackToHome={() => setCurrentView('category')}
            onLogout={handleLogout}
          />
        ) : currentView === 'category' ? (
          <RideCategoryPage
            category={activeSubTab}
            partnerDetails={partnerDetails}
            isOnDuty={isOnDuty}
            setIsOnDuty={setIsOnDuty}
            onOpenProfile={() => setCurrentView('profile')}
          />
        ) : (
          <div className="c-laptop-split-home full-width-home">
            <CaptainDutyRightView
              partnerDetails={partnerDetails}
              isOnDuty={isOnDuty}
              setIsOnDuty={setIsOnDuty}
              onOpenProfile={() => setCurrentView('profile')}
              vehicleCategoryFilter="all"
            />
          </div>
        )}
      </div>

      {/* Floating Quick Action Button: Scroll to End / Bottom of the Page */}
      <button
        type="button"
        id="scroll-to-end-btn"
        onClick={showScrollBottom ? scrollToBottom : scrollToTop}
        title={showScrollBottom ? "Scroll to End of Page (Footer)" : "Scroll to Top"}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          background: showScrollBottom ? '#0f172a' : '#059669',
          color: '#ffffff',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '28px',
          padding: '10px 18px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 700,
          fontSize: '12.5px',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.28)',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(6px)'
        }}
      >
        <i className={`fa-solid ${showScrollBottom ? 'fa-arrow-down' : 'fa-arrow-up'}`}></i>
        <span>{showScrollBottom ? 'Scroll to End' : 'Back to Top'}</span>
      </button>

      {/* Complete Universal Footer at the end */}
      <Footer onNavigate={(route: any) => {
        if (route === 'profile') setCurrentView('profile');
        else if (route === 'ride-bike') { setActiveSubTab('bike'); setCurrentView('category'); }
        else if (route === 'ride-auto') { setActiveSubTab('auto'); setCurrentView('category'); }
        else if (route === 'ride-car') { setActiveSubTab('car'); setCurrentView('category'); }
      }} />
    </div>
  );
}
