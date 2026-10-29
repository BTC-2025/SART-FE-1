'use client';
import React, { useState } from 'react';

export default function EnableLocationModal({
  isOpen,
  onClose,
  onSelectCity,
  currentCity = 'Chennai'
}) {
  const [showManualCities, setShowManualCities] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  if (!isOpen) return null;

  const CITIES = [
    'Chennai',
    'Bengaluru',
    'Hyderabad',
    'Mumbai',
    'Delhi NCR',
    'Coimbatore',
    'Pune',
    'Kolkata'
  ];

  const handleAllowAccess = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      setIsDetecting(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          try {
            // Reverse geocode to exact city / district
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
              { headers: { 'Accept-Language': 'en' } }
            );
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const detectedCity = addr.city || addr.town || addr.village || addr.suburb || addr.state_district || 'Chennai';
              onSelectCity(detectedCity, { lat, lng });
              setIsDetecting(false);
              onClose();
              return;
            }
          } catch (e) {
            console.warn('Geocoding error:', e);
          }
          // Fallback if reverse geocode failed
          setIsDetecting(false);
          onSelectCity(currentCity || 'Chennai', { lat, lng });
          onClose();
        },
        (err) => {
          console.warn('GPS permission error or denied:', err);
          setIsDetecting(false);
          setShowManualCities(true);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setShowManualCities(true);
    }
  };

  return (
    <div className="sart-loc-overlay" onClick={onClose}>
      <div className="sart-loc-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button type="button" className="sart-loc-close-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Location Pin Illustration / Icon */}
        <div className="sart-loc-icon-bubble">
          <i className="fa-solid fa-location-dot"></i>
          <span className="sart-loc-radar-ping"></span>
        </div>

        {/* Title */}
        <h3 className="sart-loc-title">Enable Location</h3>

        {/* Description requested by user */}
        <p className="sart-loc-desc">
          Discover medical clinics, fitness coaches, and styling salons nearest to you. We request access to your device's GPS location.
        </p>

        {!showManualCities ? (
          <div className="sart-loc-actions">
            <button
              type="button"
              id="btn-allow-location-access"
              className="sart-btn-allow-access"
              onClick={handleAllowAccess}
              disabled={isDetecting}
            >
              <i className={isDetecting ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-crosshairs"}></i>
              <span>{isDetecting ? 'Detecting Location...' : 'Allow Access'}</span>
            </button>

            <button
              type="button"
              id="btn-choose-location-manually"
              className="sart-btn-choose-manually"
              onClick={() => setShowManualCities(true)}
            >
              <span>Choose Manually</span>
            </button>
          </div>
        ) : (
          <div className="sart-manual-city-picker">
            <div className="sart-manual-header">
              <i className="fa-solid fa-city"></i>
              <span>Select Your City:</span>
            </div>
            <div className="sart-city-grid">
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`sart-city-chip ${currentCity === c ? 'selected' : ''}`}
                  onClick={() => {
                    onSelectCity(c);
                    onClose();
                  }}
                >
                  <i className="fa-solid fa-building"></i>
                  <span>{c}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="sart-btn-back-to-gps"
              onClick={() => setShowManualCities(false)}
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back to GPS Access</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
