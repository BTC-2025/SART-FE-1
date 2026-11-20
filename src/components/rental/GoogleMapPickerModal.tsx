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
  { title: 'Indiranagar 100ft Road', city: 'Bengaluru', address: '100ft Road, Indiranagar, Bengaluru, Karnataka', lat: 12.9784, lng: 77.6408 }
];

interface GoogleMapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: string, coords?: { lat: number; lng: number }) => void;
  initialAddress?: string;
  initialCoords?: { lat: number; lng: number };
}

export default function GoogleMapPickerModal({
  isOpen,
  onClose,
  onConfirm,
  initialAddress = 'Velachery, Chennai, Tamil Nadu',
  initialCoords = { lat: 12.9815, lng: 80.2180 }
}: GoogleMapPickerModalProps) {
  const [pinnedCoords, setPinnedCoords] = useState<{ lat: number; lng: number }>(initialCoords);
  const [pinnedAddress, setPinnedAddress] = useState<string>(initialAddress);
  const [mapSearchText, setMapSearchText] = useState<string>('');
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Sync initial values when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialAddress) setPinnedAddress(initialAddress);
      if (initialCoords?.lat && initialCoords?.lng) setPinnedCoords(initialCoords);
    }
  }, [isOpen, initialAddress, initialCoords]);

  // Initialize Leaflet Map
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

      const startLat = pinnedCoords.lat || 12.9815;
      const startLng = pinnedCoords.lng || 80.2180;

      const map = L.map(mapContainerRef.current, {
        center: [startLat, startLng],
        zoom: 14,
        zoomControl: true
      });

      // Google Maps Road Layer matching Image 1
      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: 'Leaflet | &copy; Google Maps',
        maxZoom: 20
      }).addTo(map);

      // Custom Google-Pin Marker
      const customPinIcon = L.divIcon({
        className: 'google-map-pin-marker',
        html: `
          <div class="custom-pin-wrap">
            <svg viewBox="0 0 24 24" width="38" height="38" fill="#ea4335">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <div class="pin-shadow"></div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 36]
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
          setPinnedAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        }

        // Live reverse geocode query
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
        } catch (e) { }
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
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
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
        leafletMapRef.current.flyTo([local.lat, local.lng], 15);
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
            leafletMapRef.current.flyTo([lat, lng], 15);
            markerRef.current.setLatLng([lat, lng]);
          }
        }
      }
    } catch (e) { }
  };

  const handleConfirmLocation = () => {
    onConfirm(pinnedAddress, pinnedCoords);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="map-modal-overlay" onClick={onClose}>
      <div className="map-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header matching Image 1 */}
        <div className="map-modal-top-bar">
          <div className="map-modal-title-group">
            <div className="map-title-pin-icon">
              <i className="fa-solid fa-map-location-dot"></i>
            </div>
            <div>
              <h4 className="map-modal-heading">Select on Google Maps</h4>
              <p className="map-modal-caption">Click anywhere on the map or drag the pin to set the exact hub location</p>
            </div>
          </div>
          <button
            type="button"
            className="map-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Search & Live GPS Bar inside Map matching Image 1 */}
        <div className="map-toolbar-row">
          <form onSubmit={handleMapSearchSubmit} className="map-inner-search-form">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              placeholder="Search city, area or landmark..."
              value={mapSearchText}
              onChange={(e) => setMapSearchText(e.target.value)}
              className="map-inner-search-input"
            />
            <button type="submit" className="map-inner-search-btn">
              Search
            </button>
          </form>

          <button
            type="button"
            className="map-live-gps-btn"
            onClick={handleUseLiveLocation}
            disabled={isLocatingGps}
            title="Use Live GPS Location"
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

        {/* Leaflet Map Canvas */}
        <div className="map-canvas-container" ref={mapContainerRef}></div>

        {/* Selected Address Display & Confirmation Footer matching Image 1 */}
        <div className="map-modal-footer">
          <div className="map-selected-preview">
            <i className="fa-solid fa-location-dot map-preview-pin"></i>
            <div className="map-preview-text-col">
              <span className="map-preview-label">Selected Pickup Address:</span>
              <span className="map-preview-address">{pinnedAddress}</span>
            </div>
          </div>

          <div className="map-footer-btn-strip">
            <button
              type="button"
              className="map-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="map-confirm-btn"
              onClick={handleConfirmLocation}
            >
              <i className="fa-solid fa-check"></i> Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
