'use client';
import React, { useState, useEffect } from 'react';
import CaptainDutyRightView from './CaptainDutyRightView';

export default function RideCategoryPage({
  category = 'bike', // 'bike' | 'auto' | 'car'
  partnerDetails,
  isOnDuty,
  setIsOnDuty,
  onOpenProfile
}) {
  const [gpsLocation, setGpsLocation] = useState({
    lat: 13.0827,
    lng: 80.2755,
    address: `${partnerDetails?.city || 'Chennai'}, India (Live GPS Radar)`
  });
  const [isGpsLocating, setIsGpsLocating] = useState(false);

  // Request high-accuracy GPS coordinates on page mount
  useEffect(() => {
    if (partnerDetails?.lat && partnerDetails?.lng) {
      setGpsLocation({
        lat: partnerDetails.lat,
        lng: partnerDetails.lng,
        address: partnerDetails.exactAddress || `${partnerDetails.city || 'Chennai'} (${partnerDetails.lat.toFixed(4)}, ${partnerDetails.lng.toFixed(4)})`
      });
    }

    // Fetch location from local network IP immediately
    const fetchNetworkFallback = async () => {
      try {
        const res = await fetch('https://ipwho.is/');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.city) {
            setGpsLocation({
              lat: data.latitude,
              lng: data.longitude,
              address: `${data.city}, ${data.region || 'India'} (Network Location)`
            });
          }
        }
      } catch (e) { }
    };

    if (!partnerDetails?.lat) {
      fetchNetworkFallback();
    }

    if (navigator.geolocation) {
      setIsGpsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          let addr = `${partnerDetails?.city || 'Chennai'} (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`, {
              headers: { 'Accept-Language': 'en' }
            });
            if (res.ok) {
              const data = await res.json();
              const a = data.address || {};
              const place = a.suburb || a.neighbourhood || a.city || a.town || 'Your Area';
              addr = `${place}, ${a.city || a.state || 'India'}`;
            }
          } catch (e) { }

          setGpsLocation({
            lat,
            lng,
            address: addr
          });
          setIsGpsLocating(false);
        },
        async (err) => {
          console.warn('GPS location request failed, using network location:', err.message);
          await fetchNetworkFallback();
          setIsGpsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      fetchNetworkFallback();
    }
  }, [partnerDetails?.lat, partnerDetails?.lng, partnerDetails?.city]);

  const categoryMeta = {
    bike: {
      title: 'Bike Moto Fleet Radar',
      icon: 'fa-motorcycle',
      badge: 'Two-Wheeler Partner Network',
      desc: 'Live high-speed dispatch for bike rides and courier drop-offs'
    },
    auto: {
      title: 'Auto Rickshaw Fleet Radar',
      icon: 'fa-truck-front',
      badge: 'Three-Wheeler Partner Network',
      desc: 'Immediate dispatch for local door-to-door auto rides'
    },
    car: {
      title: 'Cab & Premium Car Fleet Radar',
      icon: 'fa-car-side',
      badge: 'Four-Wheeler Partner Network',
      desc: 'Comfort sedan and AC hatchback ride dispatches'
    }
  };

  const currentMeta = categoryMeta[category.toLowerCase()] || categoryMeta.bike;

  return (
    <div className="c-ride-category-page" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Category Sub-Header Strip */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: category === 'bike' ? '#fff7ed' : category === 'auto' ? '#fefce8' : '#eff6ff',
            color: category === 'bike' ? '#ea580c' : category === 'auto' ? '#ca8a04' : '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            <i className={`fa-solid ${currentMeta.icon}`}></i>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                {currentMeta.title}
              </h2>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                background: '#f1f5f9',
                color: '#475569',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                {currentMeta.badge}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              {currentMeta.desc}
            </div>
          </div>
        </div>

        {/* Live Exact GPS Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '5px 14px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#1e293b'
          }}>
            <i className="fa-solid fa-location-crosshairs" style={{ color: '#16a34a' }}></i>
            <span>{isGpsLocating ? 'Acquiring GPS...' : gpsLocation.address}</span>
          </div>

          <button
            type="button"
            id="captain-duty-toggle-btn"
            onClick={() => setIsOnDuty(!isOnDuty)}
            style={{
              fontSize: '12px',
              fontWeight: 800,
              padding: '6px 14px',
              borderRadius: '20px',
              border: isOnDuty ? '1.5px solid #86efac' : '1.5px solid #fca5a5',
              background: isOnDuty ? '#dcfce7' : '#fee2e2',
              color: isOnDuty ? '#15803d' : '#b91c1c',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease'
            }}
            title={isOnDuty ? 'Click to Go Off Duty' : 'Click to Go On Duty'}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isOnDuty ? '#22c55e' : '#ef4444',
              display: 'inline-block'
            }}></span>
            <span>{isOnDuty ? '● On Duty: Receiving Rides' : '○ Off Duty: Click to Go On Duty'}</span>
          </button>
        </div>
      </div>

      {/* Embedded Full Duty Screen for this category */}
      <CaptainDutyRightView
        partnerDetails={{
          ...partnerDetails,
          serviceType: category,
          lat: gpsLocation.lat,
          lng: gpsLocation.lng,
          exactAddress: gpsLocation.address
        }}
        isOnDuty={isOnDuty}
        setIsOnDuty={setIsOnDuty}
        onOpenProfile={onOpenProfile}
        vehicleCategoryFilter={category}
      />
    </div>
  );
}
