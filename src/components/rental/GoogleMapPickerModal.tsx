'use client';

import React, { useState, useEffect, useRef } from 'react';
import './LocationPickerInput.css';

// Popular Indian hubs for fast local proximity & fallback matching
const POPULAR_HUBS = [
  { title: 'Katpadi Railway Station', city: 'Katpadi', address: 'Katpadi Junction, Katpadi, Vellore, Tamil Nadu', lat: 12.9774, lng: 79.1384 },
  { title: 'VIT University Campus', city: 'Katpadi', address: 'VIT Road, Katpadi, Vellore, Tamil Nadu', lat: 12.9692, lng: 79.1559 },
  { title: 'Gandhi Nagar Main Hub', city: 'Katpadi', address: 'Gandhi Nagar, Katpadi, Vellore, Tamil Nadu', lat: 12.9567, lng: 79.1432 },
  { title: 'Ranipet - Chittoor Trunk Road Hub', city: 'Katpadi', address: 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India', lat: 12.9854, lng: 79.1821 },
  { title: 'Vellore Fort Area', city: 'Vellore', address: 'Fort Round Road, Vellore, Tamil Nadu', lat: 12.9234, lng: 79.1326 },
  { title: 'Velachery Pickup Hub', city: 'Chennai', address: 'Velachery Main Road, Velachery, Chennai, Tamil Nadu', lat: 12.9815, lng: 80.2180 },
  { title: 'Anna Nagar West Depot', city: 'Chennai', address: '2nd Avenue, Anna Nagar, Chennai, Tamil Nadu', lat: 13.0850, lng: 80.2101 },
  { title: 'Guindy Industrial Estate', city: 'Chennai', address: 'GST Road, Guindy, Chennai, Tamil Nadu', lat: 13.0067, lng: 80.2025 },
  { title: 'Baner Hub Point', city: 'Pune', address: 'Baner Road, Baner, Pune, Maharashtra', lat: 18.5590, lng: 73.7868 },
  { title: 'Cyber City, Phase 2', city: 'Gurugram', address: 'Cyber City, Phase 2, Gurugram, Haryana - 122002', lat: 28.4950, lng: 77.0895 },
  { title: 'Sector 44 Hub', city: 'Gurugram', address: 'Plot No. 14-B, Sector 44, Gurugram, Haryana', lat: 28.4485, lng: 77.0682 },
  { title: 'Indiranagar 100ft Road', city: 'Bengaluru', address: '100ft Road, Indiranagar, Bengaluru, Karnataka', lat: 12.9784, lng: 77.6408 }
];

// Default coordinates
const DEFAULT_COORDS = { lat: 12.9854, lng: 79.1821 };
const DEFAULT_ADDRESS = 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India';

interface GoogleMapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: string, coords?: { lat: number; lng: number }) => void;
  initialAddress?: string;
  initialCoords?: { lat: number; lng: number };
  targetLabel?: string;
}

export default function GoogleMapPickerModal({
  isOpen,
  onClose,
  onConfirm,
  initialAddress = DEFAULT_ADDRESS,
  initialCoords,
  targetLabel
}: GoogleMapPickerModalProps) {
  const [pinnedCoords, setPinnedCoords] = useState<{ lat: number; lng: number }>(initialCoords || DEFAULT_COORDS);
  const [pinnedAddress, setPinnedAddress] = useState<string>(initialAddress);
  const [mapSearchText, setMapSearchText] = useState<string>('');
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // Sync initial values when modal opens (run only when isOpen transitions to true)
  useEffect(() => {
    if (isOpen) {
      const addr = initialAddress || DEFAULT_ADDRESS;
      setPinnedAddress(addr);

      const matched = POPULAR_HUBS.find(h =>
        addr.toLowerCase().includes(h.city.toLowerCase()) ||
        addr.toLowerCase().includes(h.title.toLowerCase())
      );

      if (matched) {
        setPinnedCoords({ lat: matched.lat, lng: matched.lng });
      } else if (initialCoords?.lat && initialCoords?.lng) {
        setPinnedCoords({ lat: initialCoords.lat, lng: initialCoords.lng });
      } else {
        setPinnedCoords(DEFAULT_COORDS);
      }
    }
  }, [isOpen, initialAddress, initialCoords?.lat, initialCoords?.lng]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isOpen) {
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {}
        leafletMapRef.current = null;
      }
      setIsMapReady(false);
      return;
    }

    let isMounted = true;

    const initMap = async () => {
      // Ensure Leaflet is loaded (from global window or dynamic import)
      let L: any = (window as any).L;
      if (!L) {
        try {
          const leafletModule = await import('leaflet');
          L = leafletModule.default || leafletModule;
        } catch (err) {
          console.warn('Leaflet dynamic import error:', err);
        }
      }

      if (!L) {
        // Fallback: wait a bit for script tag in layout.jsx to hydrate
        let attempts = 0;
        while (!L && attempts < 10) {
          await new Promise(r => setTimeout(r, 150));
          L = (window as any).L;
          attempts++;
        }
      }

      if (!isMounted || !mapContainerRef.current || !L) return;

      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {}
        leafletMapRef.current = null;
      }

      const startLat = pinnedCoords?.lat || 12.9854;
      const startLng = pinnedCoords?.lng || 79.1821;

      try {
        const map = L.map(mapContainerRef.current, {
          center: [startLat, startLng],
          zoom: 15,
          zoomControl: true,
          attributionControl: false
        });

        // Google Maps Standard Road Tile Layer
        L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          attribution: 'Map data &copy; Google Maps',
          maxZoom: 20
        }).addTo(map);

        // Custom Google Pin Marker Icon matching screenshot
        const customPinIcon = L.divIcon({
          className: 'google-map-pin-marker',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
              <div style="
                background: #ea4335;
                color: #ffffff;
                width: 36px;
                height: 36px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 14px rgba(234, 67, 53, 0.45);
                border: 2px solid #ffffff;
              ">
                <div style="
                  width: 12px;
                  height: 12px;
                  background: #ffffff;
                  border-radius: 50%;
                  transform: rotate(45deg);
                "></div>
              </div>
              <div style="
                width: 14px;
                height: 4px;
                background: rgba(0,0,0,0.3);
                border-radius: 50%;
                filter: blur(1.5px);
                margin-top: 2px;
              "></div>
            </div>
          `,
          iconSize: [36, 46],
          iconAnchor: [18, 46]
        });

        const marker = L.marker([startLat, startLng], {
          draggable: true,
          icon: customPinIcon
        }).addTo(map);

        const updateLocationFromLatLng = async (lat: number, lng: number) => {
          setPinnedCoords({ lat, lng });

          // Fast local proximity match
          let closest: any = null;
          let minD = 9999;
          POPULAR_HUBS.forEach((hub) => {
            const d = Math.hypot(hub.lat - lat, hub.lng - lng);
            if (d < minD) {
              minD = d;
              closest = hub;
            }
          });

          if (closest && minD < 0.05) {
            setPinnedAddress(closest.address);
          } else {
            setPinnedAddress(`Selected Location (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`);
          }

          // Live reverse geocoding via OpenStreetMap Nominatim
          try {
            const revRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            if (revRes.ok) {
              const revData = await revRes.json();
              if (revData && revData.display_name) {
                setPinnedAddress(revData.display_name);
              }
            }
          } catch (e) {}
        };

        // Marker drag event
        marker.on('dragend', (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          updateLocationFromLatLng(lat, lng);
        });

        // Map click event
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          marker.setLatLng([lat, lng]);
          updateLocationFromLatLng(lat, lng);
        });

        markerRef.current = marker;
        leafletMapRef.current = map;
        setIsMapReady(true);

        // Map invalidateSize after animation/modal display
        setTimeout(() => {
          if (map) {
            map.invalidateSize();
          }
        }, 150);
        setTimeout(() => {
          if (map) {
            map.invalidateSize();
          }
        }, 400);

      } catch (err) {
        console.error('Error creating Leaflet map:', err);
      }
    };

    const timer = setTimeout(initMap, 80);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch (e) {}
        leafletMapRef.current = null;
      }
    };
  }, [isOpen]);

  // Use Live Location (GPS)
  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPinnedCoords({ lat, lng });

        if (leafletMapRef.current && markerRef.current) {
          leafletMapRef.current.flyTo([lat, lng], 16, { animate: true, duration: 1 });
          markerRef.current.setLatLng([lat, lng]);
        }

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              setPinnedAddress(data.display_name);
            }
          }
        } catch (e) {
          setPinnedAddress(`Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        } finally {
          setIsLocatingGps(false);
        }
      },
      (err) => {
        console.warn('GPS Error:', err);
        setIsLocatingGps(false);
        alert('Could not retrieve current location. Please ensure location permissions are granted.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Search inside Map Modal
  const handleMapSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSearchText.trim()) return;

    const query = mapSearchText.toLowerCase();
    const local = POPULAR_HUBS.find(h => h.title.toLowerCase().includes(query) || h.city.toLowerCase().includes(query) || h.address.toLowerCase().includes(query));

    if (local) {
      setPinnedCoords({ lat: local.lat, lng: local.lng });
      setPinnedAddress(local.address);
      if (leafletMapRef.current && markerRef.current) {
        leafletMapRef.current.flyTo([local.lat, local.lng], 16, { animate: true });
        markerRef.current.setLatLng([local.lat, local.lng]);
      }
      return;
    }

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchText)}&limit=1`);
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          setPinnedCoords({ lat, lng });
          setPinnedAddress(data[0].display_name);
          if (leafletMapRef.current && markerRef.current) {
            leafletMapRef.current.flyTo([lat, lng], 16, { animate: true });
            markerRef.current.setLatLng([lat, lng]);
          }
        }
      }
    } catch (e) {}
  };

  const handleConfirmLocation = () => {
    onConfirm(pinnedAddress, pinnedCoords);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '780px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header matching user reference image */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#ea4335',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
            >
              <i className="fa-solid fa-map-location-dot"></i>
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '16.5px', fontWeight: 800, color: '#0f172a' }}>
                Select on Google Maps
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Click anywhere on the map or drag the pin to set the exact hub location
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '18px',
              color: '#94a3b8',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Search & Live GPS Bar inside Map matching user image */}
        <div
          style={{
            padding: '10px 18px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <form
            onSubmit={handleMapSearchSubmit}
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <i
              className="fa-solid fa-magnifying-glass"
              style={{
                position: 'absolute',
                left: '12px',
                fontSize: '13px',
                color: '#94a3b8',
                pointerEvents: 'none'
              }}
            ></i>
            <input
              type="text"
              placeholder="Search city, area or landmark..."
              value={mapSearchText}
              onChange={(e) => setMapSearchText(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                padding: '0 80px 0 34px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0f172a',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '4px',
                padding: '6px 14px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </form>

          <button
            type="button"
            onClick={handleUseLiveLocation}
            disabled={isLocatingGps}
            title="Use Live GPS Location"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {isLocatingGps ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i> Detecting...
              </>
            ) : (
              <>
                <i className="fa-solid fa-crosshairs"></i> Use Live Location
              </>
            )}
          </button>
        </div>

        {/* Leaflet Map Canvas Container with Explicit Dimensions & Fallback */}
        <div style={{ position: 'relative', width: '100%', height: '390px', backgroundColor: '#e2e8f0' }}>
          <div
            ref={mapContainerRef}
            style={{
              width: '100%',
              height: '100%',
              zIndex: 10
            }}
          />

          {/* Quick Hub Badges Overlay at Top Left of Map */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 500,
              display: 'flex',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.92)',
              padding: '4px 8px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#0f172a'
            }}
          >
            <span style={{ color: '#16a34a' }}>● GPS Connected</span>
          </div>
        </div>

        {/* Selected Address Display & Confirmation Footer matching user image */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
            <i className="fa-solid fa-location-dot" style={{ color: '#ea4335', fontSize: '17px' }}></i>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748b', display: 'block' }}>
                SELECTED {targetLabel ? targetLabel.toUpperCase() : 'PICKUP'} ADDRESS:
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', wordBreak: 'break-word' }}>
                {pinnedAddress}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmLocation}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
              }}
            >
              <i className="fa-solid fa-check"></i> Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
