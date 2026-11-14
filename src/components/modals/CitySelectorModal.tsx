'use client';

import React, { useState } from 'react';
import './CitySelectorModal.css';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlaceSuggestion {
  name: string;
  state?: string;
  lat?: number;
  lng?: number;
}

const POPULAR_METROS = ['Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi NCR', 'Kolkata', 'Pune', 'Goa'];

export default function CitySelectorModal({ isOpen, onClose }: CitySelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [detectedLocationName, setDetectedLocationName] = useState<string | null>(null);

  // Dynamic place lookup across all of India using live Geocoding API
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery.trim()
          )}&countrycodes=in&limit=15&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped = data.map((item: any) => {
              const addr = item.address || {};
              const placeName = addr.city || addr.town || addr.village || addr.suburb || item.name || item.display_name.split(',')[0];
              const state = addr.state || addr.county || '';
              return {
                name: placeName,
                state: state ? `${state}` : item.display_name.split(',').slice(1, 3).join(', ').trim(),
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon)
              };
            });
            // Deduplicate by name
            const unique = mapped.filter((p, idx, arr) => arr.findIndex(x => x.name.toLowerCase() === p.name.toLowerCase()) === idx);
            setSearchResults(unique);
          }
        }
      } catch (e) {
        console.warn('Place search error:', e);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleCitySelect = (cityName: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sart_user_location', cityName);
      window.dispatchEvent(new CustomEvent('updateLocation', { detail: cityName }));
    }
    setShowLocationPrompt(false);
    onClose();
  };

  // Perform reverse geocoding to resolve exact location name
  const performGpsDetection = () => {
    if (typeof window === 'undefined') return;

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      setShowLocationPrompt(false);
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          // Fetch reverse geocoded address using high zoom level (18) for exact street / area
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            
            // Priority:
            // 1. Village name if available (village, hamlet, residential, neighbourhood, suburb)
            // 2. Mandal / Tehsil / Taluk / Sub-district if village not available
            // 3. District / City if neither is available
            const villageName =
              addr.village ||
              addr.hamlet ||
              addr.locality ||
              addr.suburb ||
              addr.neighbourhood ||
              addr.residential ||
              addr.isolated_dwelling;

            const mandalName =
              addr.mandal ||
              addr.tehsil ||
              addr.taluk ||
              addr.subdistrict ||
              addr.county ||
              addr.town;

            const districtName =
              addr.district ||
              addr.state_district ||
              addr.city ||
              addr.city_district ||
              addr.state;

            // Select only the single most specific available hierarchy level
            let exactLocationName = villageName || mandalName || districtName || data.name || 'Current Location';

            // Clean up unwanted suffixes if any (e.g., "Karnampattu")
            exactLocationName = exactLocationName.split(',')[0].trim();

            setDetectedLocationName(exactLocationName);
            handleCitySelect(exactLocationName);
          } else {
            handleCitySelect('Current Location');
          }
        } catch (e) {
          console.warn('Reverse geocoding error:', e);
          handleCitySelect('Current Location');
        } finally {
          setIsDetectingLocation(false);
          setShowLocationPrompt(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        setShowLocationPrompt(false);
        console.warn('Geolocation error:', err);
        alert('Could not access GPS location. Please check your browser location permissions or choose a city from the list.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleUseCurrentLocation = () => {
    // Show the "Enable Location" prompt dialog matching Image 1
    setShowLocationPrompt(true);
  };

  return (
    <div className="sart-modal-backdrop city-selector-backdrop" onClick={onClose}>
      <div className="new-city-modal" onClick={e => e.stopPropagation()}>

        {/* Header Section */}
        <div className="new-city-header">
          <h2 className="new-city-title">Select Location</h2>
          <button className="new-city-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="new-city-body">

          <div className="new-city-search">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              placeholder="Search city, area or locality"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div
            className="use-current-location"
            onClick={handleUseCurrentLocation}
            style={{ cursor: isDetectingLocation ? 'wait' : 'pointer' }}
          >
            <i className={`fa-solid ${isDetectingLocation ? 'fa-spinner fa-spin' : 'fa-location-crosshairs'}`}></i>
            <span>{isDetectingLocation ? 'Detecting current district...' : 'Use Current Location'}</span>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '16px', color: '#f97316' }}>
              <i className="fa-solid fa-spinner fa-spin"></i> Searching live places across India...
            </div>
          )}

          {/* Dynamic Search Results */}
          {searchQuery.trim().length > 0 && searchResults.length > 0 && (
            <div style={{ margin: '16px 0' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>
                <i className="fa-solid fa-location-dot" style={{ color: '#f97316' }}></i> Matching Places in India
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {searchResults.map((place, idx) => (
                  <div
                    key={`${place.name}-${idx}`}
                    onClick={() => handleCitySelect(place.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#f97316')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fa-solid fa-location-pin" style={{ color: '#ea580c' }}></i>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{place.name}</div>
                        {place.state && <div style={{ fontSize: '12px', color: '#64748b' }}>{place.state}</div>}
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px', color: '#94a3b8' }}></i>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {searchQuery.trim().length > 0 && !isLoading && searchResults.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
              <i className="fa-solid fa-map-location" style={{ fontSize: '24px', marginBottom: '8px', color: '#94a3b8' }}></i>
              <div>No exact match found for "{searchQuery}".</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Try searching city, area, pincode or state</div>
            </div>
          )}

          {/* Popular Cities in India */}
          <div style={{ marginTop: '20px' }}>
            <h3 className="all-cities-title" style={{ fontSize: '14px', marginBottom: '12px' }}>
              <i className="fa-solid fa-city" style={{ color: '#f97316' }}></i> Popular Metros & Regions
            </h3>
            <div className="new-cities-grid">
              {POPULAR_METROS.map((metro) => (
                <div
                  key={metro}
                  className="new-city-card"
                  onClick={() => handleCitySelect(metro)}
                >
                  <i className="fa-solid fa-location-dot city-pin"></i>
                  <span className="city-name">{metro}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Enable Location Dialog (Exact Image 1) */}
      {showLocationPrompt && (
        <div
          className="enable-location-backdrop"
          onClick={() => !isDetectingLocation && setShowLocationPrompt(false)}
        >
          <div
            className="enable-location-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="enable-location-close-btn"
              onClick={() => !isDetectingLocation && setShowLocationPrompt(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Concentric Green Circles Icon */}
            <div className="enable-location-icon-wrap">
              <div className="enable-location-outer-circle">
                <div className="enable-location-inner-circle">
                  <i className="fa-solid fa-location-dot enable-location-pin-icon"></i>
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="enable-location-title">Enable Location</h3>
            <p className="enable-location-desc">
              Discover medical clinics, fitness coaches, and styling salons nearest to you. We request access to your device's GPS location.
            </p>

            {/* Primary Action: Allow Access */}
            <button
              type="button"
              className="enable-location-allow-btn"
              onClick={performGpsDetection}
              disabled={isDetectingLocation}
            >
              {isDetectingLocation ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Getting Exact Location...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-crosshairs"></i> Allow Access
                </>
              )}
            </button>

            {/* Secondary Action: Choose Manually */}
            <button
              type="button"
              className="enable-location-manual-btn"
              onClick={() => setShowLocationPrompt(false)}
              disabled={isDetectingLocation}
            >
              Choose Manually
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
