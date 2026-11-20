import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationPickerInput.css';

// Pre-defined database of prominent hubs across major Indian cities for instant offline autocomplete
const POPULAR_HUBS = [
  // Katpadi & Vellore
  { title: 'Katpadi Railway Station', city: 'Katpadi', address: 'Katpadi Junction, Katpadi, Vellore, Tamil Nadu', lat: 12.9774, lng: 79.1384 },
  { title: 'VIT University Campus', city: 'Katpadi', address: 'VIT Road, Katpadi, Vellore, Tamil Nadu', lat: 12.9692, lng: 79.1559 },
  { title: 'Gandhi Nagar Main Hub', city: 'Katpadi', address: 'Gandhi Nagar, Katpadi, Vellore, Tamil Nadu', lat: 12.9567, lng: 79.1432 },
  { title: 'Chittoor Road Hub', city: 'Katpadi', address: 'Chittoor Road, Katpadi, Vellore, Tamil Nadu', lat: 12.9841, lng: 79.1311 },
  { title: 'Vellore Fort Area', city: 'Vellore', address: 'Fort Round Road, Vellore, Tamil Nadu', lat: 12.9234, lng: 79.1326 },

  // Chennai
  { title: 'Velachery Pickup Hub', city: 'Chennai', address: 'Velachery Main Road, Velachery, Chennai, Tamil Nadu', lat: 12.9815, lng: 80.2180 },
  { title: 'Anna Nagar West Depot', city: 'Chennai', address: '2nd Avenue, Anna Nagar, Chennai, Tamil Nadu', lat: 13.0850, lng: 80.2101 },
  { title: 'T. Nagar Commercial Hub', city: 'Chennai', address: 'Usman Road, T. Nagar, Chennai, Tamil Nadu', lat: 13.0418, lng: 80.2341 },
  { title: 'Chennai Central Railway Station', city: 'Chennai', address: 'Park Town, Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { title: 'Guindy Industrial Estate', city: 'Chennai', address: 'GST Road, Guindy, Chennai, Tamil Nadu', lat: 13.0067, lng: 80.2025 },
  { title: 'OMR IT Corridor (Thoraipakkam)', city: 'Chennai', address: 'Old Mahabalipuram Rd, Chennai, Tamil Nadu', lat: 12.9416, lng: 80.2362 },

  // Pune
  { title: 'Baner Hub Point', city: 'Pune', address: 'Baner Road, Baner, Pune, Maharashtra', lat: 18.5590, lng: 73.7868 },
  { title: 'Kothrud Central Depot', city: 'Pune', address: 'Paud Road, Kothrud, Pune, Maharashtra', lat: 18.5074, lng: 73.8077 },
  { title: 'Viman Nagar Hub', city: 'Pune', address: 'Symbiosis Road, Viman Nagar, Pune, Maharashtra', lat: 18.5679, lng: 73.9143 },
  { title: 'Hinjawadi Phase 1 IT Park', city: 'Pune', address: 'Hinjawadi, Pune, Maharashtra', lat: 18.5913, lng: 73.7389 },
  { title: 'Wakad Bridge Point', city: 'Pune', address: 'Datta Mandir Road, Wakad, Pune, Maharashtra', lat: 18.5987, lng: 73.7661 },
  { title: 'Shivajinagar Station Hub', city: 'Pune', address: 'FC Road, Shivajinagar, Pune, Maharashtra', lat: 18.5314, lng: 73.8446 },
  { title: 'Magarpatta City Hub', city: 'Pune', address: 'Hadapsar, Pune, Maharashtra', lat: 18.5158, lng: 73.9272 },

  // Bengaluru
  { title: 'Indiranagar 100ft Road', city: 'Bengaluru', address: '100ft Road, Indiranagar, Bengaluru, Karnataka', lat: 12.9784, lng: 77.6408 },
  { title: 'Koramangala 5th Block', city: 'Bengaluru', address: 'Koramangala, Bengaluru, Karnataka', lat: 12.9352, lng: 77.6245 },
  { title: 'HSR Layout Sector 1', city: 'Bengaluru', address: 'HSR Layout, Bengaluru, Karnataka', lat: 12.9121, lng: 77.6446 },
  { title: 'Whitefield ITPL Hub', city: 'Bengaluru', address: 'Whitefield, Bengaluru, Karnataka', lat: 12.9866, lng: 77.7380 },

  // Mumbai
  { title: 'Bandra West (Hill Road)', city: 'Mumbai', address: 'Hill Road, Bandra West, Mumbai, Maharashtra', lat: 19.0596, lng: 72.8295 },
  { title: 'Andheri East Metro Hub', city: 'Mumbai', address: 'JB Nagar, Andheri East, Mumbai, Maharashtra', lat: 19.1136, lng: 72.8697 },
  { title: 'BKC Business Yard', city: 'Mumbai', address: 'Bandra Kurla Complex, Mumbai, Maharashtra', lat: 19.0657, lng: 72.8642 },

  // Hyderabad
  { title: 'Hitech City Cyber Towers', city: 'Hyderabad', address: 'Hitech City, Madhapur, Hyderabad, Telangana', lat: 17.4504, lng: 78.3808 },
  { title: 'Gachibowli Stadium Point', city: 'Hyderabad', address: 'Gachibowli, Hyderabad, Telangana', lat: 17.4401, lng: 78.3489 }
];

export default function LocationPickerInput({
  value = '',
  onChange = () => { },
  placeholder = 'Search city, area, or pickup address...',
  className = ''
}) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchingApi, setIsSearchingApi] = useState(false);

  // Map Modal State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [pinnedCoords, setPinnedCoords] = useState({ lat: 12.9815, lng: 80.2180 });
  const [pinnedAddress, setPinnedAddress] = useState(value || 'Velachery, Chennai, Tamil Nadu');
  const [pinnedCity, setPinnedCity] = useState('Chennai');
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [mapSearchText, setMapSearchText] = useState('');

  const containerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  // Sync external value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Click outside listener for autocomplete dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle typing in Location input
  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputValue(text);

    if (!text.trim()) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const query = text.toLowerCase();
    // 1. Instant local matching
    const localMatches = POPULAR_HUBS.filter(
      hub =>
        hub.title.toLowerCase().includes(query) ||
        hub.address.toLowerCase().includes(query) ||
        hub.city.toLowerCase().includes(query)
    );

    setSuggestions(localMatches.slice(0, 6));
    setIsDropdownOpen(true);

    // 2. Async debounce online geocode lookup
    if (text.trim().length >= 3) {
      setIsSearchingApi(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              text
            )}&addressdetails=1&countrycodes=in&limit=5`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              const apiSuggestions = data.map((item) => {
                const addr = item.address || {};
                const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || 'City';
                return {
                  title: item.display_name.split(',')[0],
                  city,
                  address: item.display_name,
                  lat: parseFloat(item.lat),
                  lng: parseFloat(item.lon)
                };
              });

              // Combine unique items
              setSuggestions((prev) => {
                const map = new Map();
                localMatches.forEach((m) => map.set(m.address, m));
                apiSuggestions.forEach((a) => {
                  if (!map.has(a.address)) map.set(a.address, a);
                });
                return Array.from(map.values()).slice(0, 7);
              });
            }
          }
        } catch (err) {
          // Keep local fallback
        } finally {
          setIsSearchingApi(false);
        }
      }, 350);

      return () => clearTimeout(timer);
    }
  };

  // When user selects a suggestion from dropdown
  const handleSelectSuggestion = (item) => {
    setInputValue(item.address);
    setIsDropdownOpen(false);
    setPinnedCoords({ lat: item.lat, lng: item.lng });
    setPinnedAddress(item.address);
    setPinnedCity(item.city);

    onChange(item.address, {
      address: item.address,
      city: item.city,
      lat: item.lat,
      lng: item.lng
    });
  };

  // Open Interactive Map Modal
  const handleOpenMap = () => {
    // If input already has a match, center on that hub, else detect/fallback
    const query = (inputValue || '').toLowerCase();
    const matched = POPULAR_HUBS.find(h => query.includes(h.city.toLowerCase()) || query.includes(h.title.toLowerCase()));

    if (matched) {
      setPinnedCoords({ lat: matched.lat, lng: matched.lng });
      setPinnedAddress(inputValue || matched.address);
      setPinnedCity(matched.city);
    }

    setIsMapModalOpen(true);
  };

  // Initialize Leaflet Map when Modal Opens
  useEffect(() => {
    if (!isMapModalOpen) return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      // Clean up previous map if any
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      const initialLat = pinnedCoords.lat || 12.9815;
      const initialLng = pinnedCoords.lng || 80.2180;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true
      });

      // Google Maps Road Layer (High resolution, crisp roads, green spaces, matching Image 4 with no watermark and no API key required)
      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps',
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

      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
        icon: customPinIcon
      }).addTo(map);

      // Reverse geocode on pin move
      const updateLocationFromLatLng = async (lat, lng) => {
        setPinnedCoords({ lat, lng });

        // Fast local proximity match
        let closest = null;
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
          setPinnedCity(closest.city);
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
              const addr = revData.address || {};
              const city = addr.city || addr.town || addr.village || addr.county || 'City';
              setPinnedAddress(revData.display_name);
              setPinnedCity(city);
            }
          }
        } catch (e) { }
      };

      // Marker drag event
      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        updateLocationFromLatLng(lat, lng);
      });

      // Map click event
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        updateLocationFromLatLng(lat, lng);
      });

      markerRef.current = marker;
      leafletMapRef.current = map;
    }, 150);

    return () => clearTimeout(timer);
  }, [isMapModalOpen]);

  // Use Live Location (GPS) button in Map Modal
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
              const city = data.address?.city || data.address?.town || data.address?.state_district || 'Current Location';
              setPinnedAddress(data.display_name);
              setPinnedCity(city);
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
  const handleMapSearchSubmit = async (e) => {
    e.preventDefault();
    if (!mapSearchText.trim()) return;

    const query = mapSearchText.toLowerCase();
    const local = POPULAR_HUBS.find(h => h.title.toLowerCase().includes(query) || h.city.toLowerCase().includes(query));

    if (local) {
      setPinnedCoords({ lat: local.lat, lng: local.lng });
      setPinnedAddress(local.address);
      setPinnedCity(local.city);
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

  // Confirm Selection from Map
  const handleConfirmMapLocation = () => {
    setInputValue(pinnedAddress);
    onChange(pinnedAddress, {
      address: pinnedAddress,
      city: pinnedCity,
      lat: pinnedCoords.lat,
      lng: pinnedCoords.lng
    });
    setIsMapModalOpen(false);
  };

  return (
    <div className={`location-picker-container ${className}`} ref={containerRef}>
      {/* Unified Input with Map Pin Action Button */}
      <div className="location-input-field-wrap">
        <div className="location-pin-lead-icon">
          <i className="fa-solid fa-location-dot"></i>
        </div>

        <input
          type="text"
          className="location-single-text-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsDropdownOpen(true);
          }}
          placeholder={placeholder}
          autoComplete="off"
          required
        />

        {/* Clear Button if input has text */}
        {inputValue && (
          <button
            type="button"
            className="location-clear-btn"
            onClick={() => {
              setInputValue('');
              onChange('', { address: '', city: '', lat: null, lng: null });
            }}
            title="Clear Address"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}

        {/* Google Maps Pin Button */}
        <button
          type="button"
          className="location-map-pin-btn"
          onClick={handleOpenMap}
          title="Select on Google Maps"
          aria-label="Select on Google Maps"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#ea4335" style={{ flexShrink: 0 }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="location-map-btn-text">Select on Map</span>
        </button>
      </div>

      {/* Autocomplete Dropdown List */}
      {isDropdownOpen && suggestions.length > 0 && (
        <div className="location-autocomplete-dropdown">
          <div className="autocomplete-header-label">
            <span>Matching Pickup Locations</span>
            {isSearchingApi && <i className="fa-solid fa-circle-notch fa-spin"></i>}
          </div>
          <div className="autocomplete-scroll-list">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                className="autocomplete-item-row"
                onClick={() => handleSelectSuggestion(item)}
              >
                <div className="autocomplete-item-icon">
                  <i className="fa-solid fa-map-pin"></i>
                </div>
                <div className="autocomplete-item-text">
                  <div className="autocomplete-item-title">{item.title}</div>
                  <div className="autocomplete-item-address">{item.address}</div>
                </div>
                <div className="autocomplete-item-city-pill">{item.city}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Google Maps Modal / Popup */}
      {isMapModalOpen && (
        <div className="map-modal-overlay" onClick={() => setIsMapModalOpen(false)}>
          <div className="map-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
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
                onClick={() => setIsMapModalOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Search & Live GPS Bar inside Map */}
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

            {/* Selected Address Display & Confirmation Footer */}
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
                  onClick={() => setIsMapModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="map-confirm-btn"
                  onClick={handleConfirmMapLocation}
                >
                  <i className="fa-solid fa-check"></i> Confirm Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
