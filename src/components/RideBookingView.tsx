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
import CaptainBusinessPortalModal from './CaptainBusinessPortalModal';
import { ridesApiClient, CaptainItem, FuelFareResponse } from '../services/ridesApi';
import dynamic from 'next/dynamic';
import { io, Socket } from 'socket.io-client';


const InteractiveRideMap = dynamic(() => import('./InteractiveRideMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#64748b' }}>
      <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Loading Live Map...
    </div>
  )
});

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
  // Remove any default stored values so user enters location cleanly
  const [pickup, setPickup] = useState(sourceLocation.trim());
  const [dropoff, setDropoff] = useState(destinationLocation.trim());

  // When sourceLocation prop changes, update pickup
  useEffect(() => {
    if (sourceLocation.trim() !== pickup.trim()) {
      setPickup(sourceLocation.trim());
      setPickupCoords(null);
    }
  }, [sourceLocation]);

  // When destinationLocation prop changes, update dropoff
  useEffect(() => {
    if (destinationLocation.trim() !== dropoff.trim()) {
      setDropoff(destinationLocation.trim());
      setDropCoords(null);
    }
  }, [destinationLocation]);

  const [stops, setStops] = useState<RouteStop[]>([]);

  // Coordinates
  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(null);
  const [dropCoords, setDropCoords] = useState<LatLng | null>(null);

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

  // Live Captain Tracker & Chat Communication State (matches user screenshot)
  const [captainStatus, setCaptainStatus] = useState<'searching' | 'accepted' | 'arriving' | 'arrived'>('searching');
  const [captainProgress, setCaptainProgress] = useState(0); // 0 to 100% on road
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'captain'; text: string; time: string }>>([]);
  const [chatInputText, setChatInputText] = useState('');
  const [pickupInstruction, setPickupInstruction] = useState('');
  const [callActive, setCallActive] = useState(false);

  // Captain Business Portal Modal state
  const [showCaptainPortal, setShowCaptainPortal] = useState(false);

  // Booking for Self or Others
  const [bookingFor, setBookingFor] = useState<'myself' | 'others'>('myself');
  const [otherRiderName, setOtherRiderName] = useState('');
  const [otherRiderPhone, setOtherRiderPhone] = useState('');

  // Interactive Direct Map Selection Mode: 'pickup' | 'drop' | 'idle'
  const [mapSelectionMode, setMapSelectionMode] = useState<'pickup' | 'drop' | 'idle'>('idle');
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);

  // Auto-search suggestions for input fields
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);

  // Backend Live Drivers from SART Backend API
  const [backendDrivers, setBackendDrivers] = useState<CaptainItem[]>([]);
  // Dynamic vehicle configurations fetched from backend
  const [backendVehicleConfigs, setBackendVehicleConfigs] = useState<VehicleConfig[] | null>(null);
  // Dynamic location fuel pricing and consumption
  const [backendFuelData, setBackendFuelData] = useState<FuelFareResponse | null>(null);

  // Live Socket.io connection for instant ride acceptance & AI chat
  const [socketRef, setSocketRef] = useState<Socket | null>(null);

  useEffect(() => {
    let s: Socket;
    try {
      s = io('http://localhost:5000', {
        transports: ['websocket', 'polling']
      });
      setSocketRef(s);

      s.on('connect', () => {
        console.log('[User Socket] Connected to SART backend:', s.id);
      });

      // Real-time notification when Captain accepts ride!
      s.on('booking_status_changed', (data: any) => {
        console.log('[User Socket] Booking status changed event received:', data);
        if (data.status === 'Accepted') {
          const cap = data.captain || {};
          setCaptainStatus('accepted');
          setRideBookedModal((prev: any) => {
            if (!prev) return prev;
            return {
              ...prev,
              captain: cap.name || 'Sai (Star Captain)',
              plate: cap.vehiclePlate || 'TN 09 EQ 4421',
              phone: cap.phone || '+91 98765 43210',
              eta: cap.eta || '3 mins away',
              distanceToCaptain: cap.distanceToCaptain || '0.8 km from you',
              isAcceptedByCaptain: true
            };
          });
        } else if (data.status === 'In-Trip') {
          setCaptainStatus('arrived');
          setRideBookedModal((prev: any) => prev ? { ...prev, eta: 'In-Trip (En Route)' } : prev);
        } else if (data.status === 'Completed') {
          setRideBookedModal((prev: any) => prev ? { ...prev, eta: 'Trip Completed' } : prev);
        }
      });

      // Real-time chat messages from captain (or AI assistant)
      s.on('chat_message_received', (msg: any) => {
        setChatMessages((prev) => {
          // Avoid duplicate local user messages
          if (msg.sender === 'user' && prev.some(m => m.text === msg.text && m.time === msg.time)) {
            return prev;
          }
          return [...prev, msg];
        });
      });
    } catch (e) {
      console.warn('[User Socket] Connection fallback:', e);
    }

    return () => {
      if (s) s.disconnect();
    };
  }, []);


  useEffect(() => {
    const fetchBackendData = async () => {
      if (['bike', 'auto', 'car'].includes(mode)) {
        // Fetch live nearby drivers centered on user's exact pickup location (e.g. Chennai 13.0827, 80.2755)
        const targetLat = pickupCoords?.lat || 13.0827;
        const targetLng = pickupCoords?.lng || 80.2755;
        const drivers = await ridesApiClient.getNearbyCaptains(mode as 'bike' | 'auto' | 'car', targetLat, targetLng);
        setBackendDrivers(drivers);

        // Fetch vehicle types and fares dynamically from backend
        const dynamicVehicles = await ridesApiClient.getVehicles(mode as 'bike' | 'auto' | 'car');
        if (dynamicVehicles && Array.isArray(dynamicVehicles) && dynamicVehicles.length > 0) {
          setBackendVehicleConfigs(dynamicVehicles);
        }
      }
    };
    fetchBackendData();
  }, [mode, pickupCoords?.lat, pickupCoords?.lng]);

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

  // Perform road routing search when user clicks Search Route or types
  const handleCalculateRoute = async () => {
    let pCoords = pickupCoords;
    let dCoords = dropCoords;

    setIsRouteCalculating(true);
    setRouteError(null);

    // Resolve pickup if not yet geocoded
    if (!pCoords && pickup.trim()) {
      const pRes = await searchAddress(pickup.trim());
      if (pRes.length > 0) {
        pCoords = pRes[0].coords;
        setPickupCoords(pCoords);
      }
    }

    // Resolve dropoff if not yet geocoded
    if (!dCoords && dropoff.trim()) {
      const dRes = await searchAddress(dropoff.trim());
      if (dRes.length > 0) {
        dCoords = dRes[0].coords;
        setDropCoords(dCoords);
      }
    }

    if (!pCoords || !dCoords) {
      setIsRouteCalculating(false);
      setRouteError('Please enter both pickup and dropping locations to calculate route.');
      return;
    }

    const points = [
      `${pCoords.lng},${pCoords.lat}`,
      ...stops.filter(s => s.lng !== undefined && s.lat !== undefined).map(s => `${s.lng},${s.lat}`),
      `${dCoords.lng},${dCoords.lat}`
    ].join(';');

    // Use vehicle-specific road routing profile
    fetch(`https://router.project-osrm.org/route/v1/driving/${points}?overview=full&geometries=geojson`)
      .then(res => res.json())
      .then(async data => {
        setIsRouteCalculating(false);
        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          const distKm = Math.round((route.distance / 1000) * 10) / 10;

          // Realistic travel duration based on user specification:
          // - Bike: 3 to 4 minutes per kilometer (avg 3.5 min/km)
          // - Auto Rickshaw: 2 to 3 minutes per kilometer (avg 2.5 min/km)
          // - Car: 2 to 4 minutes per kilometer (avg 3.0 min/km)
          const minPerKm = mode === 'bike' ? 3.5 : mode === 'auto' ? 2.5 : 3.0;
          const calculatedSecs = Math.max(60, Math.round(distKm * minPerKm * 60));
          const durMin = Math.round(calculatedSecs / 60);
          const durText = formatDurationHuman(calculatedSecs);

          if (route.geometry && route.geometry.coordinates) {
            const flipped: [number, number][] = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
            setRouteGeometry(flipped);
          }

          // Fetch dynamic location-based daily fuel price & fare calculation
          const detectedCity = pickup.split(',')[0].trim() || 'Chennai';
          try {
            const fuelRes = await ridesApiClient.calculateFuelFare(mode as 'bike' | 'auto' | 'car', distKm, detectedCity);
            if (fuelRes) {
              setBackendFuelData(fuelRes);
            }
          } catch (err) {
            console.warn('Could not fetch dynamic fuel calculation:', err);
          }

          setRouteState({
            origin: pCoords,
            destination: dCoords,
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
  };

  // Auto trigger route calculation when coordinates update
  useEffect(() => {
    if (pickupCoords && dropCoords) {
      handleCalculateRoute();
    }
  }, [pickupCoords, dropCoords, stops, mode]);

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

  // Open "Pick on map"
  const handleOpenMapPicker = (target: 'pickup' | 'drop' | 'new-stop' | string) => {
    if (target === 'drop') {
      setMapSelectionMode('drop');
    } else {
      setMapSelectionMode('pickup');
    }
  };


  // Direct Map Click Handler: Only triggered on explicit mouse click on the map
  const handleDirectMapLocationSelect = async (type: 'pickup' | 'drop', lat: number, lng: number) => {
    const coords = { lat: +lat.toFixed(5), lng: +lng.toFixed(5) };
    const addr = await reverseGeocode(coords.lat, coords.lng);

    if (type === 'pickup') {
      setPickup(addr);
      setPickupCoords(coords);
      if (onSourceChange) onSourceChange(addr);
      // Auto toggle to 'drop' mode so next click easily selects the Red dropping pin!
      setMapSelectionMode('drop');
    } else {
      setDropoff(addr);
      setDropCoords(coords);
      if (onDestinationChange) onDestinationChange(addr);
      setMapSelectionMode('idle');
    }
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
    const list = backendVehicleConfigs || VEHICLE_CONFIGS[mode] || VEHICLE_CONFIGS.bike;
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
  }, [mode, backendVehicleConfigs, calculateVehicleFare, routeState.distanceKm, routeState.durationText]);

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

            <h2 className="rb-main-heading">
              {mode === 'bike' ? 'Bike & Scooty Booking' : mode === 'auto' ? 'Auto Booking' : 'Cab & Taxi Booking'}
            </h2>
          </div>
        </div>

        {/* 🏍️🚗🛺 Safety & Captain Badge at the end of header - Click to open Captain Business Portal */}
        <button
          type="button"
          className="rb-header-vehicle-image-wrapper"
          onClick={() => {
            const bizUrl = `http://localhost:3007/Business/Home?category=${mode}`;
            window.open(bizUrl, '_blank') || (window.location.href = bizUrl);
          }}
          title="Click to enter Captain Business Portal"
        >
          <div className="rb-header-captain-column">
            {/* Header image: Auto Driver for Auto, Seatbelt for Car, Helmet for Bike */}
            <img
              src={
                mode === 'auto'
                  ? '/images/auto_driver_captain.png'
                  : mode === 'car'
                    ? '/images/seatbelt_safety.png'
                    : '/images/helmet_safety.jpg'
              }
              alt={mode === 'auto' ? 'Auto Captain' : mode === 'car' ? 'Seatbelt' : 'Helmet'}
              className="rb-header-safety-hero-img"
            />
            {/* Captain Badge below the image */}
            <span className="rb-captain-badge-pill">
              <i className="fa-solid fa-briefcase"></i> Captain
            </span>
          </div>
        </button>
      </div>

      {/* Booking For Option: Myself or Others */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '12px 18px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-user-tag" style={{ color: '#ea580c', fontSize: '15px' }}></i>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Who is taking this ride?</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setBookingFor('myself')}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: bookingFor === 'myself' ? '2px solid #ea580c' : '1px solid #cbd5e1',
              background: bookingFor === 'myself' ? '#fff7ed' : '#ffffff',
              color: bookingFor === 'myself' ? '#c2410c' : '#475569',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fa-solid fa-user"></i>
            <span>For Myself</span>
          </button>

          <button
            type="button"
            onClick={() => setBookingFor('others')}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: bookingFor === 'others' ? '2px solid #ea580c' : '1px solid #cbd5e1',
              background: bookingFor === 'others' ? '#fff7ed' : '#ffffff',
              color: bookingFor === 'others' ? '#c2410c' : '#475569',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fa-solid fa-users"></i>
            <span>For Someone Else (Others)</span>
          </button>
        </div>

        {bookingFor === 'others' && (
          <div style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '10px',
            marginTop: '8px',
            paddingTop: '10px',
            borderTop: '1px dashed #e2e8f0'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                Rider's Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Suresh Kumar"
                value={otherRiderName}
                onChange={(e) => setOtherRiderName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                Rider's Mobile Number (for driver & ride OTP)
              </label>
              <input
                type="tel"
                placeholder="+91 98765 XXXXX"
                value={otherRiderPhone}
                onChange={(e) => setOtherRiderPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        )}
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
                    className={`rb-input-map-pin-btn ${mapSelectionMode === 'pickup' ? 'active-pin-mode' : ''}`}
                    onClick={() => setMapSelectionMode(prev => prev === 'pickup' ? 'idle' : 'pickup')}
                    style={{
                      background: mapSelectionMode === 'pickup' ? '#16a34a' : '#ffffff',
                      color: mapSelectionMode === 'pickup' ? '#ffffff' : '#16a34a',
                      borderColor: '#16a34a',
                      fontWeight: 700
                    }}
                    title="Click here, then click anywhere on map below to set pickup location"
                  >
                    <i className="fa-solid fa-location-dot"></i> {mapSelectionMode === 'pickup' ? 'Click Map Below' : 'Select on Map'}
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

          {/* Right Column: Dropping point + Search Route Button */}
          <div className="rb-input-side-column">
            <div className="rb-input-box">
              <div className="rb-box-label red">
                <span>Dropping Point</span>
                <button
                  type="button"
                  className={`rb-input-map-pin-btn ${mapSelectionMode === 'drop' ? 'active-pin-mode' : ''}`}
                  onClick={() => setMapSelectionMode(prev => prev === 'drop' ? 'idle' : 'drop')}
                  style={{
                    background: mapSelectionMode === 'drop' ? '#dc2626' : '#ffffff',
                    color: mapSelectionMode === 'drop' ? '#ffffff' : '#dc2626',
                    borderColor: '#dc2626',
                    fontWeight: 700
                  }}
                  title="Click here, then click anywhere on map below to set dropping point"
                >
                  <i className="fa-solid fa-location-dot"></i> {mapSelectionMode === 'drop' ? 'Click Map Below' : 'Select on Map (Red Pin)'}
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCalculateRoute();
                    }
                  }}
                  placeholder="Enter dropping location"
                />
              </div>
            </div>

            {/* Prominent Action Button: Search Route & Show Directions for this Vehicle */}
            <div className="rb-search-route-trigger-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                className="rb-search-route-btn"
                onClick={handleCalculateRoute}
                disabled={isRouteCalculating}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '11px 18px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: isRouteCalculating ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.28)',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className={`fa-solid ${isRouteCalculating ? 'fa-spinner fa-spin' : 'fa-magnifying-glass-location'}`}></i>
                <span>{isRouteCalculating ? 'Calculating Vehicle Route...' : `Search Route for ${mode === 'bike' ? 'Bike' : mode === 'auto' ? 'Auto' : 'Car'}`}</span>
              </button>

              {(pickup || dropoff) && (
                <button
                  type="button"
                  onClick={() => {
                    setPickup('');
                    setDropoff('');
                    setPickupCoords(null);
                    setDropCoords(null);
                    setStops([]);
                    setRouteState({
                      origin: null,
                      destination: null,
                      stops: [],
                      distanceKm: null,
                      durationMin: null,
                      durationText: ''
                    });
                  }}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '11px 14px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                  title="Clear Locations"
                >
                  <i className="fa-solid fa-rotate-left"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Google Map Section (Height: 400px, Width: 100%) */}
      <div className="rb-fullwidth-map-section">
        <div className="rb-map-card full-width">
          {/* Map Top Bar */}
          <div className="rb-map-top-bar">
            <div className="rb-map-header-left">
              <i className={mode === 'bike' ? 'fa-solid fa-motorcycle' : mode === 'auto' ? 'fa-solid fa-taxi' : 'fa-solid fa-car'} style={{ color: '#ea580c' }}></i>
              <span>{mode.toUpperCase()} Live Road Navigation</span>
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

          {/* Interactive Map Canvas Container: Interactive Leaflet Map with Click selection, Green Pickup Pin, Red Dropping Pin, Route Polyline and Live Nearby Captains */}
          <div className="rb-interactive-map-canvas" style={{ width: '100%', height: '360px', position: 'relative' }}>
            <InteractiveRideMap
              mode={mode as 'bike' | 'auto' | 'car'}
              pickupCoords={pickupCoords}
              dropCoords={dropCoords}
              pickupAddress={pickup}
              dropAddress={dropoff}
              selectionMode={mapSelectionMode}
              onSelectLocation={handleDirectMapLocationSelect}
              nearbyCaptains={backendDrivers}
              routeGeometry={routeGeometry}
            />

            {/* Live Captain Moving Overlay on the Road Map when Ride is Booked / Arriving (matches Screenshot 1) */}
            {rideBookedModal && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: '#ffffff',
                  borderRadius: '24px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 20,
                  fontSize: '12.5px',
                  fontWeight: 800,
                  color: '#0f172a'
                }}
              >
                <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 0 4px rgba(22, 163, 74, 0.25)' }}></div>
                <span>Your Pick Up</span>
                <span style={{ color: '#64748b', fontWeight: 600, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {pickup || 'Current Spot'}
                </span>
                <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', color: '#94a3b8' }}></i>
              </div>
            )}

            {rideBookedModal && (
              <div
                style={{
                  position: 'absolute',
                  top: `${Math.max(20, Math.min(65, 20 + captainProgress * 0.45))}%`,
                  left: `${Math.max(25, Math.min(60, 25 + captainProgress * 0.35))}%`,
                  zIndex: 25,
                  transform: 'translate(-50%, -50%)',
                  transition: 'all 1s ease',
                  pointerEvents: 'none'
                }}
              >
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    marginBottom: '4px'
                  }}>
                    {rideBookedModal.captain?.split(' ')[0]} • {captainStatus === 'arriving' ? `${Math.max(1, 3 - Math.floor(captainProgress / 35))} min` : 'Arrived'}
                  </div>
                  <img
                    src={
                      mode === 'bike'
                        ? '/images/white_bike.png'
                        : mode === 'auto'
                          ? '/images/auto_green_yellow.png'
                          : '/images/cab_economy.png'
                    }
                    alt="Captain Vehicle"
                    style={{
                      width: '42px',
                      height: '42px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))',
                      transform: 'rotate(-25deg)'
                    }}
                  />
                </div>
              </div>
            )}
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
          <>
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

            {/* ⛽ Dynamic Fuel & Mileage Metrics based on Distance and Location Daily Rate */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 18px',
              marginTop: '12px',
              fontSize: '13px',
              color: '#334155',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-gas-pump" style={{ color: '#ea580c', fontSize: '18px' }}></i>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>
                    Fuel Economy: {mode === 'bike' ? '45 km/L (Petrol)' : mode === 'auto' ? '28 km/kg (CNG)' : '18 km/L (Petrol)'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Rate in {backendFuelData?.city || (pickup ? pickup.split(',')[0].trim() : 'Location')}: ₹{backendFuelData?.fuelSpecs?.fuelPricePerUnit ? backendFuelData.fuelSpecs.fuelPricePerUnit.toFixed(2) : (mode === 'auto' ? '99.50' : '107.76')} per {mode === 'auto' ? 'kg' : 'Liter'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '12.5px' }}>
                  Estimated Consumption: <strong style={{ color: '#0f172a' }}>{backendFuelData?.fuelSpecs?.fuelConsumed || `${(routeState.distanceKm / (mode === 'bike' ? 45 : mode === 'auto' ? 28 : 18)).toFixed(2)} ${mode === 'auto' ? 'kgs' : 'Liters'}`}</strong>
                </div>
                <div style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '13px'
                }}>
                  Fuel Cost: {backendFuelData?.fuelSpecs?.fuelCostEstimate || `₹${((routeState.distanceKm / (mode === 'bike' ? 45 : mode === 'auto' ? 28 : 18)) * (mode === 'auto' ? 99.50 : 107.76)).toFixed(1)}`}
                </div>
                <div style={{
                  fontSize: '11.5px',
                  color: '#475569',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '3px 8px'
                }}>
                  ⏱️ Speed: {mode === 'bike' ? '3 to 4 mins' : mode === 'auto' ? '2 to 3 mins' : '2 to 4 mins'} per km
                </div>
              </div>
            </div>
          </>
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
                onClick={async () => {
                  setShowConfirmModal(false);
                  const selectedDriver = backendDrivers.length > 0 ? backendDrivers[0] : null;
                  const captainName = selectedDriver ? `${selectedDriver.driverName} (${selectedDriver.vehicleModel || 'SART Partner'})` : 'Karthik Raja (Super Captain)';
                  const plateNum = selectedDriver ? selectedDriver.plateNumber : (mode === 'bike' ? 'TN 09 BX 4281' : mode === 'auto' ? 'TN 05 AT 9821' : 'TN 01 CB 7741');
                  const otpCode = `${Math.floor(1000 + Math.random() * 9000)}`;

                  const riderDisplay = bookingFor === 'others' && otherRiderName.trim()
                    ? `${otherRiderName.trim()} (${otherRiderPhone || 'Rider'})`
                    : 'Myself';

                  // Trigger backend booking API
                  let createdBookingId = null;
                  try {
                    const createRes = await fetch('http://localhost:5000/api/bookings', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        title: `${mode.toUpperCase()} Ride Booking`,
                        type: 'ride',
                        subType: mode,
                        cost: currentVehicleData.fare,
                        pickupLoc: pickup || 'Live GPS User Spot',
                        dropLoc: dropoff || 'MG Road, Bengaluru',
                        details: `Captain: ${captainName} • OTP: ${otpCode} • Booked for: ${riderDisplay}`,
                        extraData: {
                          captain: captainName,
                          plate: plateNum,
                          otp: otpCode,
                          stops,
                          bookingFor,
                          riderName: otherRiderName,
                          riderPhone: otherRiderPhone,
                          vehicleType: mode,
                          pickupDist: '1.2 km',
                          pickupTime: '4 mins',
                          userLat: pickupCoords?.lat || 13.0827,
                          userLng: pickupCoords?.lng || 80.2755,
                          dropLat: dropCoords?.lat || 13.0600,
                          dropLng: dropCoords?.lng || 80.2200
                        }
                      })

                    });
                    if (createRes.ok) {
                      const resData = await createRes.json();
                      if (resData.data && resData.data.id) {
                        createdBookingId = resData.data.id;
                      }
                    }
                  } catch (e) {
                    console.log('Backend sync offline/fallback');
                  }

                  // Join socket room for this booking and broadcast to business captains
                  if (socketRef && createdBookingId) {
                    socketRef.emit('join_booking', createdBookingId);
                    socketRef.emit('new_booking_created', {
                      id: createdBookingId,
                      category: mode.charAt(0).toUpperCase() + mode.slice(1),
                      fare: currentVehicleData.fare,
                      pickupLoc: pickup || 'Pickup Point',
                      dropLoc: dropoff || 'Drop Point',
                      userLat: pickupCoords?.lat || 13.0827,
                      userLng: pickupCoords?.lng || 80.2755,
                      otp: otpCode
                    });
                  }

                  // Initially waiting for captain response
                  setCaptainStatus('searching');
                  setCaptainProgress(0);

                  setRideBookedModal({
                    id: createdBookingId,
                    type: currentVehicleData.title,
                    captain: 'Connecting with nearby Captain...',
                    plate: 'Waiting for acceptance...',
                    otp: otpCode,
                    fare: currentVehicleData.fare,
                    eta: 'Radar active...',
                    distanceToCaptain: 'Notifying captains nearby...',
                    isAcceptedByCaptain: false
                  });

                  // Poll backend every 2 seconds to check if captain accepted this booking
                  let pollCount = 0;
                  const pollInterval = setInterval(async () => {
                    pollCount++;
                    if (createdBookingId) {
                      try {
                        const checkRes = await fetch(`http://localhost:5000/api/bookings/${createdBookingId}`);
                        if (checkRes.ok) {
                          const checkData = await checkRes.json();
                          const b = checkData.data;
                          if (b && (b.status === 'Accepted' || b.status === 'In-Trip')) {
                            let parsed: any = {};
                            try {
                              parsed = typeof b.extraData === 'string' ? JSON.parse(b.extraData) : (b.extraData || {});
                            } catch (e) { }

                            setCaptainStatus(b.status === 'In-Trip' ? 'arrived' : 'accepted');
                            setRideBookedModal((prev: any) => ({
                              ...prev,
                              captain: parsed.captainName || 'Sai (Star Captain)',
                              plate: parsed.vehiclePlate || 'TN 09 EQ 4421',
                              phone: parsed.captainPhone || '+91 98765 43210',
                              eta: parsed.pickupTime || '3 mins away',
                              distanceToCaptain: parsed.pickupDist ? `${parsed.pickupDist} from you` : '0.8 km from you',
                              isAcceptedByCaptain: true
                            }));
                            clearInterval(pollInterval);
                            return;
                          }
                        }
                      } catch (err) { }
                    }

                    // Fallback only after 45 seconds if no captain accepted manually
                    if (pollCount >= 22) {
                      clearInterval(pollInterval);
                      setCaptainStatus('arriving');
                      setRideBookedModal((prev: any) => ({
                        ...prev,
                        captain: captainName,
                        plate: plateNum,
                        eta: '3 mins',
                        distanceToCaptain: '1.2 km from you',
                        isAcceptedByCaptain: true
                      }));
                    }
                  }, 2000);


                  // Progressively move captain on road towards user over 15 seconds
                  let prog = 0;
                  const intv = setInterval(() => {
                    prog += 12;
                    if (prog >= 100) {
                      prog = 100;
                      setCaptainProgress(100);
                      setCaptainStatus('arrived');
                      clearInterval(intv);
                    } else {
                      setCaptainProgress(prog);
                    }
                  }, 1200);
                }}
              >
                Confirm & Request Captain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 Realistic Live Captain Tracking & Communication Modal (Matching User's Screenshots Exactly) */}
      {rideBookedModal && (
        <div className="rb-captain-tracking-backdrop" style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          backdropFilter: 'blur(3px)'
        }}>
          {/* Bottom Sheet Card */}
          <div style={{
            background: '#ffffff',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            width: '100%',
            maxWidth: '540px',
            maxHeight: '92vh',
            overflowY: 'auto',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.22)',
            padding: '16px 20px 24px 20px',
            position: 'relative',
            animation: 'rbSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Grab Handle */}
            <div style={{
              width: '40px',
              height: '4px',
              background: '#cbd5e1',
              borderRadius: '2px',
              margin: '0 auto 14px auto'
            }}></div>

            {/* OTP Header Section (matches user screenshot: "Start your order with PIN:XXXX") */}
            <div style={{
              textAlign: 'center',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '14px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '15px', color: '#0f172a', fontWeight: 800 }}>
                Start your order with PIN: <strong style={{ color: '#0f172a', letterSpacing: '1px', fontSize: '18px' }}>{rideBookedModal.otp}</strong>
              </span>
              <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span className="pulse-dot"></span>
                <span>Captain is arriving • Live on road</span>
              </div>
            </div>

            {/* Captain Profile Card & Call Button (matches user screenshot 1) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '12px 16px',
              marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '24px',
                  boxShadow: '0 4px 10px rgba(234, 88, 12, 0.3)'
                }}>
                  <i className="fa-solid fa-user"></i>
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>
                    {rideBookedModal.captain}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>4.8</span>
                    <i className="fa-solid fa-star" style={{ color: '#eab308', fontSize: '11px' }}></i>
                    <span>• {rideBookedModal.type} ({rideBookedModal.plate})</span>
                  </div>
                  {/* Distance from Captain to User */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#16a34a', marginTop: '3px' }}>
                    <i className="fa-solid fa-route"></i>
                    <span>{rideBookedModal.distanceToCaptain || '0.8 km from you'} ({rideBookedModal.eta || '3 mins'})</span>
                  </div>
                </div>
              </div>

              {/* Call Driver Button (Black circle with yellow phone icon matching Screenshot 1) */}
              <button
                type="button"
                onClick={() => setCallActive(prev => !prev)}
                title="Call Captain"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: '#000000',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <i className="fa-solid fa-phone" style={{ color: '#facc15', fontSize: '18px' }}></i>
              </button>
            </div>

            {/* Calling Active Bar */}
            {callActive && (
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                fontSize: '13px',
                color: '#065f46'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-phone-volume fa-shake" style={{ color: '#10b981' }}></i>
                  <span>Calling {rideBookedModal.captain}... (Connecting via secure line)</span>
                </div>
                <button
                  onClick={() => setCallActive(false)}
                  style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                >
                  End Call
                </button>
              </div>
            )}

            {/* Pickup Instructions Input Row (matches Screenshot 1) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#f1f5f9',
              borderRadius: '24px',
              padding: '8px 16px',
              marginBottom: '16px'
            }}>
              <i className="fa-regular fa-file-lines" style={{ color: '#64748b', fontSize: '15px' }}></i>
              <input
                type="text"
                value={pickupInstruction}
                onChange={(e) => setPickupInstruction(e.target.value)}
                placeholder="Any pickup instructions ?"
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '13px',
                  color: '#0f172a',
                  width: '100%'
                }}
              />
              <button
                type="button"
                onClick={() => setShowChatModal(true)}
                title="Chat with Captain"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ea580c',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <i className="fa-solid fa-comment-dots"></i>
              </button>
            </div>

            {/* Card Details: Pickup & Drop matching Screenshot 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {/* Pickup details box */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 14px'
              }}>
                <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Pickup details</div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {pickup || 'Current GPS Spot'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#4f46e5', fontWeight: 700 }}>
                  <span style={{ cursor: 'pointer' }}><i className="fa-solid fa-pen"></i> Edit location</span>
                  <span style={{ cursor: 'pointer' }}><i className="fa-regular fa-heart"></i> Add as Favorite</span>
                </div>
              </div>

              {/* Drop details box */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 14px'
              }}>
                <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Drop details</div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {dropoff || 'Selected Destination'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#4f46e5', fontWeight: 700 }}>
                  <span style={{ cursor: 'pointer' }}><i className="fa-solid fa-pen"></i> Edit location</span>
                  <span style={{ cursor: 'pointer' }}><i className="fa-regular fa-heart"></i> Add as Favorite</span>
                </div>
              </div>

              {/* Payment Box (matches Screenshot 2: Ride Fare ₹48 ₹39, QR Pay) */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 14px'
              }}>
                <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Payment</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Ride Fare</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '13px' }}>
                      ₹{Math.round(rideBookedModal.fare * 1.25)}
                    </span>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                      ₹{rideBookedModal.fare}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '12.5px', color: '#0f172a', fontWeight: 700 }}>
                  <i className="fa-solid fa-qrcode" style={{ color: '#0284c7' }}></i>
                  <span>QR Pay / UPI on arrival</span>
                </div>
              </div>
            </div>

            {/* Cancel & Done Bottom Actions (matches Screenshot 2 Cancel button) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setRideBookedModal(null)}
                style={{
                  flex: 1,
                  background: '#ffffff',
                  border: '1.5px solid #f87171',
                  borderRadius: '24px',
                  padding: '12px 20px',
                  color: '#dc2626',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Cancel Ride
              </button>

              <button
                type="button"
                onClick={() => setShowChatModal(true)}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '12px 20px',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                }}
              >
                <i className="fa-solid fa-comments"></i>
                <span>Chat Captain</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💬 Live Communication Chat Modal with Captain */}
      {showChatModal && rideBookedModal && (
        <div className="rb-modal-overlay" style={{ zIndex: 100000 }} onClick={() => setShowChatModal(false)}>
          <div
            className="rb-modal-card"
            style={{ maxWidth: '440px', height: '520px', display: 'flex', flexDirection: 'column', padding: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div style={{
              padding: '14px 18px',
              background: '#0f172a',
              color: '#ffffff',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-user-shield"></i>
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800 }}>{rideBookedModal.captain}</div>
                  <div style={{ fontSize: '11px', color: '#4ade80' }}>Online • Driving towards you</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowChatModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Chat Body */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc' }}>
              <div style={{ alignSelf: 'flex-start', background: '#e2e8f0', color: '#0f172a', padding: '8px 12px', borderRadius: '12px', fontSize: '13px', maxWidth: '80%' }}>
                Hello! I have accepted your {mode} ride request. I am on the road and arriving in ~3 mins.
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', textAlign: 'right' }}>Just now</div>
              </div>

              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'user' ? '#ea580c' : '#e2e8f0',
                    color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    maxWidth: '80%'
                  }}
                >
                  {msg.text}
                  <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px', textAlign: 'right' }}>{msg.time}</div>
                </div>
              ))}
            </div>

            {/* Chat Footer Input */}
            <div style={{ padding: '12px 14px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatInputText.trim()) {
                    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const msgPayload = {
                      bookingId: rideBookedModal.id,
                      sender: 'user' as const,
                      text: chatInputText.trim(),
                      time
                    };
                    setChatMessages(prev => [...prev, msgPayload]);
                    if (socketRef && rideBookedModal.id) {
                      socketRef.emit('send_chat_message', msgPayload);
                    }
                    setChatInputText('');
                  }
                }}
                placeholder="Type a message to captain or ask AI assistant..."
                style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: '20px', padding: '8px 14px', outline: 'none', fontSize: '13px' }}
              />
              <button
                type="button"
                onClick={() => {
                  if (!chatInputText.trim()) return;
                  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const msgPayload = {
                    bookingId: rideBookedModal.id,
                    sender: 'user' as const,
                    text: chatInputText.trim(),
                    time
                  };
                  setChatMessages(prev => [...prev, msgPayload]);
                  if (socketRef && rideBookedModal.id) {
                    socketRef.emit('send_chat_message', msgPayload);
                  }
                  setChatInputText('');
                }}
                style={{ background: '#ea580c', color: '#ffffff', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Captain Business Portal Modal (Registration & OTP Authentication) */}
      <CaptainBusinessPortalModal
        isOpen={showCaptainPortal}
        onClose={() => setShowCaptainPortal(false)}
        category={mode}
      />
    </div>
  );
}
