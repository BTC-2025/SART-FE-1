'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './RideBookingView.css';

import {
  RideCategoryMode,
  RouteStop,
  LatLng,
  VehicleConfig,
  VEHICLE_CONFIGS,
  KNOWN_LOCATIONS,
  formatDurationHuman,
  SingleSourceRouteState,
  RideBookedInfo
} from './rideData';

export type { RideCategoryMode, RouteStop, LatLng, VehicleConfig, SingleSourceRouteState, RideBookedInfo };
export { VEHICLE_CONFIGS, KNOWN_LOCATIONS, formatDurationHuman };

interface RideBookingViewProps {
  mode: RideCategoryMode;
  sourceLocation?: string;
  destinationLocation?: string;
  onSourceChange?: (val: string) => void;
  onDestinationChange?: (val: string) => void;
  onBackToHome?: () => void;
}

export default function RideBookingView({
  mode,
  sourceLocation = '',
  destinationLocation = '',
  onSourceChange,
  onDestinationChange,
  onBackToHome
}: RideBookingViewProps) {
  // Synchronize pickup and dropoff across bike, auto, and car pages via props and shared storage
  const [pickup, setPickup] = useState(() => {
    if (sourceLocation.trim()) return sourceLocation.trim();
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sart_ride_pickup') || '';
    }
    return '';
  });

  const [dropoff, setDropoff] = useState(() => {
    if (destinationLocation.trim()) return destinationLocation.trim();
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sart_ride_dropoff') || '';
    }
    return '';
  });

  // When sourceLocation prop changes, update pickup
  useEffect(() => {
    if (sourceLocation.trim() && sourceLocation.trim() !== pickup.trim()) {
      setPickup(sourceLocation.trim());
      setPickupCoords(null);
    }
  }, [sourceLocation]);

  // When destinationLocation prop changes, update dropoff
  useEffect(() => {
    if (destinationLocation.trim() && destinationLocation.trim() !== dropoff.trim()) {
      setDropoff(destinationLocation.trim());
      setDropCoords(null);
    }
  }, [destinationLocation]);

  const [stops, setStops] = useState<RouteStop[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sart_ride_stops');
        if (saved) return JSON.parse(saved);
      } catch (e) { }
    }
    return [];
  });

  // Coordinates
  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sart_ride_pickup_coords');
        if (saved) return JSON.parse(saved);
      } catch (e) { }
    }
    return null;
  });

  const [dropCoords, setDropCoords] = useState<LatLng | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sart_ride_drop_coords');
        if (saved) return JSON.parse(saved);
      } catch (e) { }
    }
    return null;
  });

  // Single Source of Truth Route State
  const [routeState, setRouteState] = useState<SingleSourceRouteState>({
    origin: null,
    destination: null,
    stops: [],
    distanceKm: null,
    durationMin: null,
    durationText: ''
  });

  const [isRouteCalculating, setIsRouteCalculating] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Selected vehicle type
  const [selectedVehicle, setSelectedVehicle] = useState<string>(() => {
    if (mode === 'bike') return 'scooty';
    if (mode === 'auto') return 'auto_standard';
    return 'car_economy';
  });

  useEffect(() => {
    if (mode === 'bike') setSelectedVehicle('scooty');
    else if (mode === 'auto') setSelectedVehicle('auto_standard');
    else setSelectedVehicle('car_economy');
  }, [mode]);

  // UI state for adding stops & modals
  const [showAddStopForm, setShowAddStopForm] = useState(false);
  const [newStopName, setNewStopName] = useState('');
  const [newStopCoords, setNewStopCoords] = useState<LatLng | null>(null);
  const [newStopPurpose, setNewStopPurpose] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rideBookedModal, setRideBookedModal] = useState<any | null>(null);

  // Map Picker Modal state
  const [pickerTarget, setPickerTarget] = useState<'pickup' | 'drop' | 'new-stop' | string | null>(null);
  const [pickerCoords, setPickerCoords] = useState<LatLng>({ lat: 13.0827, lng: 80.2755 });
  const [pickerAddress, setPickerAddress] = useState<string>('Select location');
  const [isGeocodingPicker, setIsGeocodingPicker] = useState(false);

  // Auto-search suggestions for input fields
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sart_ride_pickup', pickup);
      if (pickupCoords) localStorage.setItem('sart_ride_pickup_coords', JSON.stringify(pickupCoords));
      else localStorage.removeItem('sart_ride_pickup_coords');
    }
  }, [pickup, pickupCoords]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sart_ride_dropoff', dropoff);
      if (dropCoords) localStorage.setItem('sart_ride_drop_coords', JSON.stringify(dropCoords));
      else localStorage.removeItem('sart_ride_drop_coords');
    }
  }, [dropoff, dropCoords]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sart_ride_stops', JSON.stringify(stops));
    }
  }, [stops]);

  // Reverse geocoding helper (OpenStreetMap Nominatim, no API key needed)
  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { 'Accept-Language': 'en' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.display_name) {
          const parts = data.display_name.split(',');
          return parts.slice(0, 3).join(', ').trim();
        }
      }
    } catch (err) { }
    return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }, []);

  // Forward geocoding search for typing
  const searchAddress = async (query: string): Promise<{ label: string; coords: LatLng }[]> => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // Check fast known locations first
    for (const [key, coords] of Object.entries(KNOWN_LOCATIONS)) {
      if (key.includes(q) || q.includes(key)) {
        return [{ label: key.toUpperCase() + ', Chennai', coords }];
      }
    }

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=4`, {
        headers: { 'Accept-Language': 'en' }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.map((item: any) => ({
            label: item.display_name.split(',').slice(0, 3).join(', ').trim(),
            coords: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) }
          }));
        }
      }
    } catch (e) { }
    return [];
  };

  // Debounced geocoding on typing for Pickup
  useEffect(() => {
    const text = pickup.trim();
    if (!text || pickupCoords) return;

    const timer = setTimeout(async () => {
      const results = await searchAddress(text);
      if (results.length > 0) {
        setPickupCoords(results[0].coords);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [pickup, pickupCoords]);

  // Debounced geocoding on typing for Dropoff
  useEffect(() => {
    const text = dropoff.trim();
    if (!text || dropCoords) return;

    const timer = setTimeout(async () => {
      const results = await searchAddress(text);
      if (results.length > 0) {
        setDropCoords(results[0].coords);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [dropoff, dropCoords]);

  // Calculate Real Road Navigation Distance & Duration without requiring Google API Keys
  useEffect(() => {
    if (!pickupCoords || !dropCoords) {
      setRouteState({
        origin: null,
        destination: null,
        stops: [],
        distanceKm: null,
        durationMin: null,
        durationText: ''
      });
      return;
    }

    setIsRouteCalculating(true);
    setRouteError(null);

    const points = [
      `${pickupCoords.lng},${pickupCoords.lat}`,
      ...stops.filter(s => s.lng !== undefined && s.lat !== undefined).map(s => `${s.lng},${s.lat}`),
      `${dropCoords.lng},${dropCoords.lat}`
    ].join(';');

    fetch(`https://router.project-osrm.org/route/v1/driving/${points}?overview=full&geometries=geojson`)
      .then(res => res.json())
      .then(data => {
        setIsRouteCalculating(false);
        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          const distKm = Math.round((route.distance / 1000) * 10) / 10;
          const durSeconds = Math.round(route.duration);
          const durMin = Math.round(durSeconds / 60);
          const durText = formatDurationHuman(durSeconds);

          setRouteState({
            origin: pickupCoords,
            destination: dropCoords,
            stops,
            distanceKm: distKm,
            durationMin: durMin,
            durationText: durText
          });
        } else {
          setRouteError('Could not compute road distance between these points.');
        }
      })
      .catch(err => {
        setIsRouteCalculating(false);
        console.error('Routing error:', err);
        setRouteError('Failed to calculate road route.');
      });
  }, [pickupCoords, dropCoords, stops]);

  // "Use my current location" handler for pickup
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsRouteCalculating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPickupCoords({ lat, lng });
        const addr = await reverseGeocode(lat, lng);
        setPickup(addr);
        if (onSourceChange) onSourceChange(addr);
        setIsRouteCalculating(false);
      },
      (err) => {
        setIsRouteCalculating(false);
        alert('Could not retrieve your current location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Open "Pick on map" modal
  const handleOpenMapPicker = (target: 'pickup' | 'drop' | 'new-stop' | string) => {
    let initialCoords: LatLng = { lat: 13.0827, lng: 80.2755 }; // Chennai default
    if (target === 'pickup' && pickupCoords) initialCoords = pickupCoords;
    else if (target === 'drop' && dropCoords) initialCoords = dropCoords;
    else if (typeof target === 'string' && target.startsWith('stop-')) {
      const existing = stops.find(s => s.id === target);
      if (existing?.lat && existing?.lng) initialCoords = { lat: existing.lat, lng: existing.lng };
    }

    setPickerTarget(target);
    setPickerCoords(initialCoords);
    setPickerAddress('Locating address...');
    setIsGeocodingPicker(true);
    reverseGeocode(initialCoords.lat, initialCoords.lng).then(addr => {
      setPickerAddress(addr);
      setIsGeocodingPicker(false);
    });
  };

  // Map Picker Canvas Pan/Drag handler
  const handlePickerMapCanvasClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    // Relative offset from current picker center
    const latSpan = 0.04;
    const lngSpan = 0.04;
    const newLat = +(pickerCoords.lat + (0.5 - yRatio) * latSpan).toFixed(5);
    const newLng = +(pickerCoords.lng + (xRatio - 0.5) * lngSpan).toFixed(5);

    setPickerCoords({ lat: newLat, lng: newLng });
    setIsGeocodingPicker(true);
    const addr = await reverseGeocode(newLat, newLng);
    setPickerAddress(addr);
    setIsGeocodingPicker(false);
  };

  // Confirm selection in Map Picker Modal
  const handleConfirmPickerLocation = () => {
    if (!pickerTarget) return;

    if (pickerTarget === 'pickup') {
      setPickup(pickerAddress);
      setPickupCoords(pickerCoords);
      if (onSourceChange) onSourceChange(pickerAddress);
    } else if (pickerTarget === 'drop') {
      setDropoff(pickerAddress);
      setDropCoords(pickerCoords);
      if (onDestinationChange) onDestinationChange(pickerAddress);
    } else if (pickerTarget === 'new-stop') {
      setNewStopName(pickerAddress);
      setNewStopCoords(pickerCoords);
    } else if (pickerTarget.startsWith('stop-')) {
      const stopId = pickerTarget;
      setStops(prev =>
        prev.map(s => (s.id === stopId ? { ...s, name: pickerAddress, lat: pickerCoords.lat, lng: pickerCoords.lng } : s))
      );
    }

    setPickerTarget(null);
  };

  // Calculate vehicle fare using the exact formula:
  // fare = max(minFare, baseFare + perKm * distanceKm + perMinute * durationMin + waiting charge per stop)
  const calculateVehicleFare = useCallback(
    (cfg: VehicleConfig) => {
      if (routeState.distanceKm === null || routeState.durationMin === null) {
        return cfg.minFare;
      }
      const distancePart = cfg.perKm * routeState.distanceKm;
      const durationPart = cfg.perMinute * routeState.durationMin;
      const waitingPart = cfg.waitingChargePerStop * stops.length;
      const rawFare = cfg.baseFare + distancePart + durationPart + waitingPart;
      return Math.round(Math.max(cfg.minFare, rawFare));
    },
    [routeState.distanceKm, routeState.durationMin, stops.length]
  );

  // Dynamic Vehicle Cards
  const vehicles = React.useMemo(() => {
    const list = VEHICLE_CONFIGS[mode] || VEHICLE_CONFIGS.bike;
    return list.map(cfg => {
      const fare = calculateVehicleFare(cfg);
      return {
        ...cfg,
        fare,
        distance: routeState.distanceKm !== null ? `${routeState.distanceKm} km` : '',
        time: routeState.durationText || '',
        hasDistance: routeState.distanceKm !== null
      };
    });
  }, [mode, calculateVehicleFare, routeState.distanceKm, routeState.durationText]);

  const currentVehicleData = vehicles.find(v => v.id === selectedVehicle) || vehicles[0];

  // Google Maps Clean Embed URL (100% Free, No API Key, Clean Road Navigation)
  const getGoogleMapsEmbedUrl = () => {
    const origin = pickup.trim()
      ? encodeURIComponent(pickup.trim())
      : (pickupCoords ? `${pickupCoords.lat},${pickupCoords.lng}` : '');
    const destination = dropoff.trim()
      ? encodeURIComponent(dropoff.trim())
      : (dropCoords ? `${dropCoords.lat},${dropCoords.lng}` : '');

    if (origin && destination) {
      return `https://maps.google.com/maps?saddr=${origin}&daddr=${destination}&t=m&z=13&output=embed`;
    }
    const center = origin || destination || '13.0827,80.2755';
    return `https://maps.google.com/maps?q=${center}&t=m&z=13&output=embed`;
  };

  const getDirectGoogleMapsAppUrl = () => {
    const origin = encodeURIComponent(pickup.trim() || 'Chennai');
    const destination = encodeURIComponent(dropoff.trim() || 'Chennai Central');
    const travelmode = mode === 'bike' ? 'two_wheeler' : 'driving';
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelmode}`;
  };

  return (
    <div className="rb-container">
      {/* Top Header Card */}
      <div className="rb-header-card">
        <div className="rb-header-left">
          <button
            type="button"
            className="rb-back-btn"
            onClick={onBackToHome}
            title="Back to Home"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <div className="rb-mode-title-row">
              <span className="rb-mode-badge">
                {mode === 'bike' ? '🛵 Instant Two-Wheeler Booking' : mode === 'auto' ? '🛺 Auto Rickshaw Booking' : '🚗 Cab & Car Booking'}
              </span>
              <span className="rb-status-pill">
                <i className="fa-solid fa-circle-dot"></i> Live Google Road Navigation
              </span>
            </div>
            <h2 className="rb-main-heading">
              {mode === 'bike' ? 'Bike & Scooty Booking' : mode === 'auto' ? 'Auto Rickshaw Booking' : 'Cab & Taxi Booking'}
            </h2>
          </div>
        </div>
      </div>

      {/* Top Section: Left Side Pickup, Right Side Dropping, with Stops appearing below Pickup */}
      <div className="rb-inputs-horizontal-section">
        <div className="rb-inputs-two-columns">
          {/* Left Column: Pickup point + Added Stops below Pickup */}
          <div className="rb-input-side-column">
            <div className="rb-input-box">
              <div className="rb-box-label green">
                <span>Pickup Point</span>
                <div className="rb-box-label-actions">
                  <button
                    type="button"
                    className="rb-input-map-pin-btn location-btn"
                    onClick={handleUseCurrentLocation}
                    title="Use GPS current location"
                  >
                    <i className="fa-solid fa-crosshairs"></i> Use current location
                  </button>
                  <button
                    type="button"
                    className="rb-input-map-pin-btn"
                    onClick={() => handleOpenMapPicker('pickup')}
                    title="Pick pickup on map"
                  >
                    <i className="fa-solid fa-map-location-dot"></i> Pick on map
                  </button>
                </div>
              </div>
              <div className="rb-box-field-row">
                <div className="rb-point-bullet green"></div>
                <input
                  type="text"
                  className="rb-input-element"
                  value={pickup}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPickup(val);
                    setPickupCoords(null);
                    if (onSourceChange) onSourceChange(val);
                  }}
                  placeholder="Enter pickup location"
                />
              </div>
            </div>

            {/* Intermediate Stops (Appears cleanly below Pickup point) */}
            {stops.map((st, idx) => (
              <div key={st.id} className="rb-added-stop-wrapper">
                <div className="rb-stop-connector-line"></div>
                <div className="rb-input-box stop-box">
                  <div className="rb-box-label orange">
                    <span>Stop #{idx + 1}</span>
                    <button
                      type="button"
                      className="rb-remove-stop-cross"
                      onClick={() => setStops(prev => prev.filter(s => s.id !== st.id))}
                      title="Remove Stop"
                    >
                      × Remove
                    </button>
                  </div>
                  <div className="rb-box-field-row">
                    <div className="rb-point-diamond">
                      <span>{idx + 1}</span>
                    </div>
                    <input
                      type="text"
                      className="rb-input-element"
                      value={st.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStops(prev => prev.map(s => (s.id === st.id ? { ...s, name: val } : s)));
                      }}
                      placeholder="Enter stop location"
                    />
                    <button
                      type="button"
                      className="rb-input-map-icon-btn"
                      onClick={() => handleOpenMapPicker(st.id)}
                      title="Pick stop on map"
                    >
                      <i className="fa-solid fa-map-location-dot"></i>
                    </button>
                  </div>

                </div>
              </div>
            ))}

            {/* Simple and Easy Add Stop Button */}
            <div className="rb-add-stop-trigger-row">
              <button
                type="button"
                className="rb-add-stop-simple-btn"
                onClick={() => setShowAddStopForm(prev => !prev)}
              >
                <span className="rb-add-stop-plus-circle">＋</span>
                <span>{showAddStopForm ? 'Close Add Stop' : 'Add Stopping'}</span>
              </button>
            </div>

            {/* Simple Add Stop Form */}
            {showAddStopForm && (
              <div className="rb-simple-add-stop-card">
                <div className="rb-simple-stop-header">
                  <span><i className="fa-solid fa-plus-circle"></i> New Stopping Point</span>
                </div>
                <div className="rb-field-with-icon">
                  <input
                    type="text"
                    className="rb-input-element standard"
                    placeholder="Enter stop location name"
                    value={newStopName}
                    onChange={(e) => setNewStopName(e.target.value)}
                  />
                  <button
                    type="button"
                    className="rb-field-map-btn"
                    onClick={() => handleOpenMapPicker('new-stop')}
                    title="Pick stop on map"
                  >
                    <i className="fa-solid fa-map-location-dot"></i>
                  </button>
                </div>
                <div className="rb-field-with-icon" style={{ marginTop: '6px' }}>
                  <input
                    type="text"
                    className="rb-input-element standard"
                    placeholder="Stop purpose (e.g. pick parcel, 2 min errand)"
                    value={newStopPurpose}
                    onChange={(e) => setNewStopPurpose(e.target.value)}
                  />
                </div>
                <div className="rb-simple-stop-actions">
                  <button
                    type="button"
                    className="rb-btn-confirm-stop"
                    onClick={() => {
                      if (!newStopName.trim()) return;
                      setStops(prev => [
                        ...prev,
                        {
                          id: `stop-${Date.now()}`,
                          name: newStopName.trim(),
                          purpose: newStopPurpose.trim() || 'Short Errand',
                          lat: newStopCoords?.lat ?? 13.0600,
                          lng: newStopCoords?.lng ?? 80.2200
                        }
                      ]);
                      setNewStopName('');
                      setNewStopCoords(null);
                      setNewStopPurpose('');
                      setShowAddStopForm(false);
                    }}
                  >
                    Add Stop
                  </button>
                  <button
                    type="button"
                    className="rb-btn-cancel-stop"
                    onClick={() => setShowAddStopForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Dropping point */}
          <div className="rb-input-side-column">
            <div className="rb-input-box">
              <div className="rb-box-label red">
                <span>Dropping Point</span>
                <button
                  type="button"
                  className="rb-input-map-pin-btn"
                  onClick={() => handleOpenMapPicker('drop')}
                  title="Pick drop on map"
                >
                  <i className="fa-solid fa-map-location-dot"></i> Pick on map
                </button>
              </div>
              <div className="rb-box-field-row">
                <div className="rb-point-bullet red"></div>
                <input
                  type="text"
                  className="rb-input-element"
                  value={dropoff}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDropoff(val);
                    setDropCoords(null);
                    if (onDestinationChange) onDestinationChange(val);
                  }}
                  placeholder="Enter dropping location"
                />
              </div>
            </div>

            {/* Helper notice */}

          </div>
        </div>
      </div>

      {/* Full Width Google Map Section (Height: 400px, Width: 100%) */}
      <div className="rb-fullwidth-map-section">
        <div className="rb-map-card full-width">
          {/* Map Top Bar */}
          <div className="rb-map-top-bar">
            <div className="rb-map-header-left">
              <i className="fa-solid fa-map-location-dot" style={{ color: '#ea580c' }}></i>
              <span>Google Maps Live Road Navigation</span>
              {isRouteCalculating && <span className="rb-calculating-spinner"><i className="fa-solid fa-spinner fa-spin"></i> Calculating Route...</span>}
              {!isRouteCalculating && routeState.distanceKm !== null && (
                <span className="rb-live-dist-pill" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.35)',
                  marginLeft: '8px'
                }}>
                  <i className="fa-solid fa-route"></i>
                  {routeState.distanceKm} km {routeState.durationText ? `• ${routeState.durationText}` : ''}
                </span>
              )}
            </div>

            <a
              href={getDirectGoogleMapsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="rb-pill-btn google-nav-btn"
              title="Open full navigation in Google Maps app"
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i> Open in Maps
            </a>
          </div>

          {/* Interactive Map Canvas Container (Full width, 280px height with clean Google Maps Road View) */}
          <div className="rb-interactive-map-canvas" style={{ width: '100%', height: '280px' }}>
            <iframe
              title="Google Maps Live Navigation"
              className="rb-map-iframe-google"
              src={getGoogleMapsEmbedUrl()}
              loading="lazy"
              allowFullScreen
            />
          </div>

          {/* Error Message if Directions fails */}
          {routeError && (
            <div className="rb-directions-error-bar">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{routeError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Selection Cards Section */}
      <div className="rb-vehicle-section">
        <h3 className="rb-vehicle-section-title">
          <i className={mode === 'bike' ? 'fa-solid fa-motorcycle' : mode === 'auto' ? 'fa-solid fa-taxi' : 'fa-solid fa-car'}></i>
          {mode === 'bike' ? 'Choose Two-Wheeler' : mode === 'auto' ? 'Choose Auto Service' : 'Choose Cab Service'}
        </h3>

        <div className={`rb-vehicle-cards-grid ${(mode === 'bike' || mode === 'auto') ? 'two-cards' : ''}`}>
          {vehicles.map((v: any) => (
            <div
              key={v.id}
              className={`rb-vehicle-card ${selectedVehicle === v.id ? 'active' : ''}`}
              onClick={() => setSelectedVehicle(v.id)}
            >
              {v.badge && (
                <div className={`rb-vehicle-badge ${v.badgeClass}`}>{v.badge}</div>
              )}

              <div className="rb-vehicle-media">
                {v.image ? (
                  <img src={v.image} alt={v.title} className="rb-vehicle-img" />
                ) : (
                  <span className="rb-vehicle-emoji">{v.icon}</span>
                )}
              </div>

              <div className="rb-vehicle-info">
                <div className="rb-vehicle-header-row">
                  <span className="rb-vehicle-name">{v.title}</span>
                  <span className="rb-vehicle-price">₹ {v.fare}</span>
                </div>

                {/* Distance & Time */}
                {v.hasDistance ? (
                  <div className="rb-vehicle-specs-row">
                    <span><i className="fa-solid fa-route"></i> {v.distance}</span>
                    <span><i className="fa-solid fa-clock"></i> {v.time}</span>
                    <span><i className="fa-solid fa-shield-halved"></i> Safety Insured</span>
                  </div>
                ) : (
                  <div className="rb-vehicle-specs-row empty">
                    <span>Select pickup & drop for exact distance</span>
                  </div>
                )}

                <p className="rb-vehicle-desc">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SHOW DISTANCE BELOW THE VEHICLES: SUMMARY BAR */}
        {routeState.distanceKm !== null ? (
          <div className="rb-distance-summary-bar">
            <div className="rb-dist-sum-item">
              <i className="fa-solid fa-route"></i>
              <span>Distance: <strong>{routeState.distanceKm} km</strong></span>
            </div>
            <div className="rb-dist-sum-divider">•</div>
            <div className="rb-dist-sum-item">
              <i className="fa-solid fa-clock"></i>
              <span>Time: <strong>{routeState.durationText}</strong></span>
            </div>
            {stops.length > 0 && (
              <>
                <div className="rb-dist-sum-divider">•</div>
                <div className="rb-dist-sum-item">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>Stops: <strong>{stops.length} included</strong></span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="rb-distance-summary-bar empty">
            <i className="fa-solid fa-info-circle"></i>
            <span>Set your pickup and drop locations to see road distance, duration and fares.</span>
          </div>
        )}
      </div>

      {/* Bottom Booking Summary & Continue CTA */}
      <div className="rb-footer-bar">
        <div className="rb-footer-payment-info">
          <i className="fa-solid fa-wallet"></i>
          <span>Payment Mode: <strong>Cash on Arrival / UPI</strong></span>
        </div>
        <button
          type="button"
          className="rb-continue-booking-btn"
          disabled={routeState.distanceKm === null}
          onClick={() => setShowConfirmModal(true)}
        >
          Continue Booking & View Itinerary (₹ {currentVehicleData.fare})
        </button>
      </div>

      {/* ================= PICK ON MAP MODAL ================= */}
      {pickerTarget && (
        <div className="rb-picker-modal-overlay" onClick={() => setPickerTarget(null)}>
          <div className="rb-picker-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rb-picker-modal-header">
              <div className="rb-picker-title">
                <i className="fa-solid fa-map-pin"></i>
                <span>
                  Pin {pickerTarget === 'pickup' ? 'Pickup Location' : pickerTarget === 'drop' ? 'Dropping Location' : 'Stopping Point'}
                </span>
              </div>
              <button
                type="button"
                className="rb-picker-close-btn"
                onClick={() => setPickerTarget(null)}
              >
                ×
              </button>
            </div>

            <div className="rb-picker-map-wrapper" onClick={handlePickerMapCanvasClick}>
              {/* Clean Google Maps Canvas for Picking Location */}
              <iframe
                title="Google Maps Location Picker"
                className="rb-picker-map-canvas"
                src={`https://maps.google.com/maps?q=${pickerCoords.lat},${pickerCoords.lng}&z=15&output=embed`}
                style={{ border: 0, pointerEvents: 'none' }}
              />
              {/* Fixed Center Pin Overlay */}
              <div className="rb-picker-centre-pin">
                <div className="rb-picker-pin-head">
                  <div className="rb-picker-pin-inner"></div>
                </div>
                <div className="rb-picker-pin-point"></div>
              </div>
              <div className="rb-picker-canvas-hint">
                Click anywhere on map to reposition pin
              </div>
            </div>

            <div className="rb-picker-footer">
              <div className="rb-picker-address-box">
                <div className="rb-picker-address-title">Selected Address:</div>
                <div className="rb-picker-address-text">
                  {isGeocodingPicker ? (
                    <span><i className="fa-solid fa-spinner fa-spin"></i> Resolving address...</span>
                  ) : (
                    pickerAddress
                  )}
                </div>
                <div className="rb-picker-coords-text">
                  Coordinates: {pickerCoords.lat.toFixed(5)}, {pickerCoords.lng.toFixed(5)}
                </div>
              </div>
              <div className="rb-picker-btn-row">
                <button
                  type="button"
                  className="rb-picker-cancel-btn"
                  onClick={() => setPickerTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rb-picker-confirm-btn"
                  onClick={handleConfirmPickerLocation}
                >
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ITINERARY MODAL POPUP ================= */}
      {showConfirmModal && (
        <div className="rb-modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="rb-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rb-modal-header">
              <div>
                <h3 className="rb-modal-title">
                  <i className="fa-solid fa-route" style={{ color: '#ea580c' }}></i>
                  <span>Confirmed Itinerary & Live Route</span>
                </h3>
                <span className="rb-modal-sub">
                  Vehicle: <strong>{currentVehicleData.title} (₹{currentVehicleData.fare})</strong>
                </span>
              </div>
              <button
                type="button"
                className="rb-modal-close-btn"
                onClick={() => setShowConfirmModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="rb-modal-content">
              {/* Itinerary Schedule */}
              <div className="rb-modal-itinerary-list">
                <h4 className="rb-itinerary-heading">Traveling Schedule & Purpose Breakdown</h4>

                {/* Pickup Row */}
                <div className="rb-itin-card green">
                  <div className="rb-itin-icon green">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <div className="rb-itin-body">
                    <div className="rb-itin-title green">1. Pickup Location (Start)</div>
                    <div className="rb-itin-address">{pickup}</div>
                    <div className="rb-itin-time">Captain arrives in ~3 mins</div>
                  </div>
                </div>

                {/* Stops Rows */}
                {stops.map((st, idx) => (
                  <div key={st.id} className="rb-itin-card orange">
                    <div className="rb-itin-icon orange">
                      <span>{idx + 1}</span>
                    </div>
                    <div className="rb-itin-body">
                      <div className="rb-itin-title orange">Stop #{idx + 1}</div>
                      <div className="rb-itin-address">{st.name}</div>
                      <div className="rb-itin-purpose-badge">
                        <i className="fa-solid fa-tag"></i>
                        <span>Purpose: {st.purpose}</span>
                      </div>
                      <div className="rb-itin-time">Estimated 2-5 min halt included</div>
                    </div>
                  </div>
                ))}

                {/* Drop Row */}
                <div className="rb-itin-card red">
                  <div className="rb-itin-icon red">
                    <i className="fa-solid fa-flag-checkered"></i>
                  </div>
                  <div className="rb-itin-body">
                    <div className="rb-itin-title red">Final Destination (Drop)</div>
                    <div className="rb-itin-address">{dropoff}</div>
                    <div className="rb-itin-time">Direct dropoff • Total journey {routeState.durationText} ({routeState.distanceKm} km)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rb-modal-footer">
              <div className="rb-modal-fare-group">
                <span className="rb-modal-fare-label">Total Payable:</span>
                <span className="rb-modal-fare-val">₹ {currentVehicleData.fare}</span>
                <span className="rb-modal-fare-note">(Includes all {stops.length} stops)</span>
              </div>
              <button
                type="button"
                className="rb-modal-confirm-btn"
                onClick={() => {
                  setShowConfirmModal(false);
                  setRideBookedModal({
                    type: currentVehicleData.title,
                    captain: 'Karthik Raja (Super Captain)',
                    plate: mode === 'bike' ? 'TN 09 BX 4281' : mode === 'auto' ? 'TN 05 AT 9821' : 'TN 01 CB 7741',
                    otp: `${Math.floor(1000 + Math.random() * 9000)}`,
                    fare: currentVehicleData.fare,
                    eta: '3 mins'
                  });
                }}
              >
                Confirm & Request Captain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ride Booked Success Modal */}
      {rideBookedModal && (
        <div className="rb-modal-overlay">
          <div className="rb-modal-card success">
            <div className="rb-modal-header success">
              <div>
                <h3 className="rb-modal-title">Ride Confirmed!</h3>
                <span className="rb-modal-sub">Captain is arriving in {rideBookedModal.eta}</span>
              </div>
              <button
                type="button"
                className="rb-modal-close-btn"
                onClick={() => setRideBookedModal(null)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="rb-modal-content">
              <div className="rb-success-summary-box">
                <div className="rb-success-row">
                  <span>Vehicle:</span>
                  <strong>{rideBookedModal.type}</strong>
                </div>
                <div className="rb-success-row">
                  <span>Captain:</span>
                  <strong>{rideBookedModal.captain}</strong>
                </div>
                <div className="rb-success-row">
                  <span>Number Plate:</span>
                  <strong>{rideBookedModal.plate}</strong>
                </div>
                <div className="rb-success-row otp">
                  <span>Start Ride OTP:</span>
                  <strong className="rb-otp-code">{rideBookedModal.otp}</strong>
                </div>
                <div className="rb-success-row total">
                  <span>Total Fare:</span>
                  <strong className="rb-total-fare">₹ {rideBookedModal.fare}</strong>
                </div>
              </div>
              <button
                type="button"
                className="rb-modal-confirm-btn full"
                onClick={() => setRideBookedModal(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
