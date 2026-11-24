'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface LocationResult {
  address: string;
  city: string;
  area: string;
  pincode?: string;
  lat?: number;
  lng?: number;
}

export const PRESET_CARRIER_HUBS: Array<{
  title: string;
  city: string;
  area: string;
  address: string;
  pincode: string;
  lat: number;
  lng: number;
}> = [
    {
      title: 'Chennai George Town Freight Hub',
      city: 'Chennai',
      area: 'George Town, Tamil Nadu (600001)',
      address: 'No. 12, Rajaji Salai, George Town, Chennai, Tamil Nadu - 600001',
      pincode: '600001',
      lat: 13.0906,
      lng: 80.2887
    },
    {
      title: 'Bengaluru MG Road Logistics Depot',
      city: 'Bengaluru',
      area: 'MG Road, Ashok Nagar, Bengaluru (560001)',
      address: '45/1, MG Road, Ashok Nagar, Bengaluru, Karnataka - 560001',
      pincode: '560001',
      lat: 12.9756,
      lng: 77.6066
    },
    {
      title: 'Mumbai Port Trust & Ballard Estate',
      city: 'Mumbai',
      area: 'Ballard Estate, Fort, Mumbai (400001)',
      address: 'Port Trust Road, Ballard Estate, Fort, Mumbai, Maharashtra - 400001',
      pincode: '400001',
      lat: 18.9322,
      lng: 72.8398
    },
    {
      title: 'Hyderabad Abids Cargo Depot',
      city: 'Hyderabad',
      area: 'Abids / Koti, Hyderabad (500001)',
      address: 'Station Road, Abids, Hyderabad, Telangana - 500001',
      pincode: '500001',
      lat: 17.3871,
      lng: 78.4734
    },
    {
      title: 'Pune MIDC Freight Terminal',
      city: 'Pune',
      area: 'MIDC Chakan, Pune (410501)',
      address: 'Plot 4, Phase 2 MIDC, Chakan Industrial Area, Pune, Maharashtra - 410501',
      pincode: '410501',
      lat: 18.7606,
      lng: 73.8567
    },
    {
      title: 'Katpadi Railway Goods Shed',
      city: 'Katpadi',
      area: 'Katpadi Junction, Vellore (632007)',
      address: 'Goods Shed Rd, Katpadi Junction, Vellore, Tamil Nadu - 632007',
      pincode: '632007',
      lat: 12.9774,
      lng: 79.1384
    },
    {
      title: 'Chennai Guindy Industrial Estate',
      city: 'Chennai',
      area: 'Guindy, Chennai (600032)',
      address: 'GST Road, Guindy Industrial Estate, Chennai, Tamil Nadu - 600032',
      pincode: '600032',
      lat: 13.0067,
      lng: 80.2025
    },
    {
      title: 'Bengaluru Whitefield ITPL Hub',
      city: 'Bengaluru',
      area: 'Whitefield, Bengaluru (560066)',
      address: 'ITPL Main Road, Whitefield, Bengaluru, Karnataka - 560066',
      pincode: '560066',
      lat: 12.9866,
      lng: 77.7380
    }
  ];

interface CarrierLocationModalProps {
  isOpen: boolean;
  target: 'pickup' | 'delivery';
  currentValue?: string;
  onClose: () => void;
  onSelect: (location: LocationResult) => void;
}

export default function CarrierLocationModal({
  isOpen,
  target,
  currentValue = '',
  onClose,
  onSelect
}: CarrierLocationModalProps) {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<typeof PRESET_CARRIER_HUBS>([]);
  const [selectedHub, setSelectedHub] = useState<LocationResult>({
    address: target === 'pickup'
      ? 'No. 12, Rajaji Salai, George Town, Chennai, Tamil Nadu - 600001'
      : '45/1, MG Road, Ashok Nagar, Bengaluru, Karnataka - 560001',
    city: target === 'pickup' ? 'Chennai' : 'Bengaluru',
    area: target === 'pickup' ? 'George Town, Tamil Nadu (600001)' : 'MG Road, Ashok Nagar, Bengaluru (560001)',
    pincode: target === 'pickup' ? '600001' : '560001',
    lat: target === 'pickup' ? 13.0906 : 12.9756,
    lng: target === 'pickup' ? 80.2887 : 77.6066
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Sync initial hub based on target or current value if already selected
  useEffect(() => {
    if (!isOpen) return;

    if (currentValue && currentValue.trim().length > 3) {
      const match = PRESET_CARRIER_HUBS.find(
        h => currentValue.toLowerCase().includes(h.city.toLowerCase()) ||
          currentValue.toLowerCase().includes(h.pincode)
      );
      if (match) {
        setSelectedHub({
          address: currentValue,
          city: match.city,
          area: match.area,
          pincode: match.pincode,
          lat: match.lat,
          lng: match.lng
        });
        return;
      }
    }

    const defaultHub = target === 'pickup' ? PRESET_CARRIER_HUBS[0] : PRESET_CARRIER_HUBS[1];
    setSelectedHub({
      address: defaultHub.address,
      city: defaultHub.city,
      area: defaultHub.area,
      pincode: defaultHub.pincode,
      lat: defaultHub.lat,
      lng: defaultHub.lng
    });
  }, [isOpen, target, currentValue]);

  // Initialize interactive Leaflet map
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      if (!mapContainerRef.current) return;

      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!isMounted || !mapContainerRef.current) return;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      const initialLat = selectedHub.lat || (target === 'pickup' ? 13.0906 : 12.9756);
      const initialLng = selectedHub.lng || (target === 'pickup' ? 80.2887 : 77.6066);

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true
      });

      // Google Maps Crisp Road Layer
      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps Road Layer',
        maxZoom: 20
      }).addTo(map);

      // Custom Red Location Pin
      const pinIcon = L.divIcon({
        className: 'carrier-custom-map-pin',
        html: `
          <div style="transform: translate(-50%, -100%); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
            <svg viewBox="0 0 24 24" width="38" height="38" fill="#ef4444">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38]
      });

      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
        icon: pinIcon
      }).addTo(map);

      const updatePinLocation = async (lat: number, lng: number) => {
        setIsGeocoding(true);

        // Check if close to known presets
        let matched = null;
        let minDistance = 999;
        for (const hub of PRESET_CARRIER_HUBS) {
          const d = Math.hypot(hub.lat - lat, hub.lng - lng);
          if (d < minDistance) {
            minDistance = d;
            matched = hub;
          }
        }

        if (matched && minDistance < 0.04) {
          setSelectedHub({
            address: matched.address,
            city: matched.city,
            area: matched.area,
            pincode: matched.pincode,
            lat,
            lng
          });
          setIsGeocoding(false);
          return;
        }

        // Live reverse geocoding
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              const addr = data.address || {};
              const city = addr.city || addr.town || addr.state_district || addr.county || 'City Hub';
              const state = addr.state || 'India';
              const postcode = addr.postcode || '';
              const area = postcode ? `${city}, ${state} (${postcode})` : `${city}, ${state}`;
              setSelectedHub({
                address: data.display_name,
                city,
                area,
                pincode: postcode,
                lat,
                lng
              });
              setIsGeocoding(false);
              return;
            }
          }
        } catch (e) {
          // fallback
        }

        setSelectedHub({
          address: `Location Pin (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`,
          city: 'Selected Point',
          area: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          lat,
          lng
        });
        setIsGeocoding(false);
      };

      marker.on('dragend', (e: any) => {
        const coords = e.target.getLatLng();
        updatePinLocation(coords.lat, coords.lng);
      });

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        updatePinLocation(lat, lng);
      });

      leafletMapRef.current = map;
      markerRef.current = marker;
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Instant Hub Selection handler
  const handleSelectPresetHub = (hub: typeof PRESET_CARRIER_HUBS[0]) => {
    setSelectedHub({
      address: hub.address,
      city: hub.city,
      area: hub.area,
      pincode: hub.pincode,
      lat: hub.lat,
      lng: hub.lng
    });

    if (leafletMapRef.current && markerRef.current) {
      leafletMapRef.current.flyTo([hub.lat, hub.lng], 15, { animate: true, duration: 0.8 });
      markerRef.current.setLatLng([hub.lat, hub.lng]);
    }
    setSuggestions([]);
    setSearchText('');
  };

  // Live Location / GPS handler
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        if (leafletMapRef.current && markerRef.current) {
          leafletMapRef.current.flyTo([lat, lng], 16, { animate: true, duration: 1 });
          markerRef.current.setLatLng([lat, lng]);
        }

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              const addr = data.address || {};
              const city = addr.city || addr.town || addr.state_district || 'City Hub';
              const state = addr.state || 'India';
              const postcode = addr.postcode || '';
              setSelectedHub({
                address: data.display_name,
                city,
                area: postcode ? `${city}, ${state} (${postcode})` : `${city}, ${state}`,
                pincode: postcode,
                lat,
                lng
              });
              return;
            }
          }
        } catch (e) { }

        setSelectedHub({
          address: `Current GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          city: 'Current Location',
          area: `GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          lat,
          lng
        });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        alert('Could not access GPS location. Please select from hubs or click on map.');
      },
      { timeout: 8000 }
    );
  };

  // Search input change handler
  const handleSearchChange = (val: string) => {
    setSearchText(val);
    if (!val.trim()) {
      setSuggestions([]);
      return;
    }
    const q = val.toLowerCase();
    const matches = PRESET_CARRIER_HUBS.filter(
      h => h.title.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.area.toLowerCase().includes(q) ||
        h.pincode.includes(q) ||
        h.address.toLowerCase().includes(q)
    );
    setSuggestions(matches);
  };

  // Confirm and set location
  const handleConfirm = () => {
    onSelect(selectedHub);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2500,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '680px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i
                className="fa-solid fa-map-location-dot"
                style={{ color: target === 'pickup' ? '#2563eb' : '#059669', fontSize: '18px' }}
              ></i>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>
                Select {target === 'pickup' ? 'Pick-up' : 'Delivery'} Location on Map
              </h3>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              Choose a logistics hub, search any address, or click anywhere on the map to pin.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 800
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>

          {/* Search Bar + GPS Button */}
          <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                borderRadius: '10px',
                padding: '0 12px',
                gap: '8px'
              }}
            >
              <i className="fa-solid fa-magnifying-glass" style={{ color: '#94a3b8', fontSize: '13px' }}></i>
              <input
                type="text"
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search hub, landmark, area, or pincode..."
                style={{
                  width: '100%',
                  height: '40px',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              />
              {searchText && (
                <button
                  type="button"
                  onClick={() => { setSearchText(''); setSuggestions([]); }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleUseGPS}
              disabled={isLocating}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 14px',
                borderRadius: '10px',
                border: '1px solid #bfdbfe',
                background: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <i className={`fa-solid fa-location-crosshairs ${isLocating ? 'fa-spin' : ''}`}></i>
              <span>{isLocating ? 'Locating...' : 'GPS Locate'}</span>
            </button>

            {/* Live Autocomplete Dropdown */}
            {suggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  zIndex: 3000,
                  maxHeight: '220px',
                  overflowY: 'auto',
                  padding: '6px'
                }}
              >
                {suggestions.map((hub, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectPresetHub(hub)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      borderBottom: idx < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <i className="fa-solid fa-location-dot" style={{ color: '#2563eb', marginTop: '3px' }}></i>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{hub.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{hub.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>



          {/* Map View Frame */}
          <div
            style={{
              position: 'relative',
              height: '280px',
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1.5px solid #cbd5e1'
            }}
          >
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

            {/* Instruction Banner at top of map */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(15, 23, 42, 0.75)',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 700,
                pointerEvents: 'none',
                zIndex: 1000,
                backdropFilter: 'blur(4px)'
              }}
            >
              <i className="fa-solid fa-hand-pointer" style={{ marginRight: '5px' }}></i>
              Click anywhere on the map or drag the pin to set location
            </div>
          </div>

          {/* Selected Location Card */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: target === 'pickup' ? '#dbeafe' : '#dcfce7',
                  color: target === 'pickup' ? '#2563eb' : '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              >
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Confirmed {target === 'pickup' ? 'Pick-up' : 'Delivery'} Address:
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1.3,
                    marginTop: '2px',
                    wordBreak: 'break-word'
                  }}
                >
                  {isGeocoding ? 'Detecting address...' : selectedHub.address}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                  City / Area: <strong>{selectedHub.city}</strong> • {selectedHub.area}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              style={{
                background: target === 'pickup' ? '#2563eb' : '#059669',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: target === 'pickup'
                  ? '0 4px 12px rgba(37, 99, 235, 0.3)'
                  : '0 4px 12px rgba(5, 150, 105, 0.3)',
                flexShrink: 0
              }}
            >
              Confirm Location
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
