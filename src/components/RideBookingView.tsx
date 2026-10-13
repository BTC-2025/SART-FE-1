'use client';

import React, { useState, useEffect, useRef } from 'react';
import './RideBookingView.css';

export type RideCategoryMode = 'bike' | 'auto' | 'car';

export interface RouteStop {
  id: string;
  name: string;
  purpose: string;
  lat?: number;
  lng?: number;
}

interface RideBookingViewProps {
  mode: RideCategoryMode;
  onBackToHome?: () => void;
}

// Well-known coordinates in Chennai, Vellore & major cities for instant offline lookup
const KNOWN_LOCATIONS: { [key: string]: { lat: number; lng: number } } = {
  // Chennai & Metro Suburbs
  'korukkupet': { lat: 13.1118, lng: 80.2789 },
  'meenambal nagar': { lat: 13.1118, lng: 80.2789 },
  'old washermanpet': { lat: 13.1118, lng: 80.2789 },
  'chennai central': { lat: 13.0827, lng: 80.2755 },
  'central': { lat: 13.0827, lng: 80.2755 },
  'chennai': { lat: 13.0827, lng: 80.2755 },
  'central square': { lat: 13.0827, lng: 80.2755 },
  'anna salai': { lat: 13.0604, lng: 80.2496 },
  'thiruvallam': { lat: 12.9833, lng: 79.2167 },
  't nagar': { lat: 13.0418, lng: 80.2341 },
  'anna nagar': { lat: 13.0850, lng: 80.2101 },
  'vadapalani': { lat: 13.0500, lng: 80.2121 },
  'airport': { lat: 12.9941, lng: 80.1709 },
  'meenambakkam': { lat: 12.9941, lng: 80.1709 },
  'guindy': { lat: 13.0067, lng: 80.2025 },
  'velachery': { lat: 12.9815, lng: 80.2180 },
  'tambaram': { lat: 12.9249, lng: 80.1000 },
  'ambattur': { lat: 13.1143, lng: 80.1548 },
  'avadi': { lat: 13.1147, lng: 80.1018 },
  'maduravoyal': { lat: 13.0655, lng: 80.1633 },
  'poonamallee': { lat: 13.0490, lng: 80.0984 },
  'alandur': { lat: 13.0040, lng: 80.2015 },
  'triplicane': { lat: 13.0587, lng: 80.2757 },
  'marina beach': { lat: 13.0500, lng: 80.2824 },
  'egmore': { lat: 13.0826, lng: 80.2600 },
  'perambur': { lat: 13.1075, lng: 80.2434 },
  'porur': { lat: 13.0382, lng: 80.1565 },
  'omr': { lat: 12.8710, lng: 80.2220 },
  'sholinganallur': { lat: 12.9010, lng: 80.2279 },
  'siruseri': { lat: 12.8331, lng: 80.2201 },
  'kelambakkam': { lat: 12.7876, lng: 80.2204 },
  'chengalpattu': { lat: 12.6819, lng: 79.9888 },
  'kanchipuram': { lat: 12.8342, lng: 79.7036 },
  'kanchi': { lat: 12.8342, lng: 79.7036 },
  'sriperumbudur': { lat: 12.9724, lng: 79.9462 },
  'thiruvallur': { lat: 13.1432, lng: 79.9079 },
  'arakkonam': { lat: 13.0850, lng: 79.6677 },
  'ranipet': { lat: 12.9272, lng: 79.3330 },
  'arcot': { lat: 12.9056, lng: 79.3337 },
  'walajah': { lat: 12.9754, lng: 79.3562 },
  // Vellore District & Key Junctions
  'vellore': { lat: 12.9165, lng: 79.1325 },
  'katpadi': { lat: 12.9751, lng: 79.1360 },
  'vit': { lat: 12.9692, lng: 79.1559 },
  'cmc': { lat: 12.9250, lng: 79.1350 },
  'bagayam': { lat: 12.8752, lng: 79.1369 },
  'sathuvachari': { lat: 12.9348, lng: 79.1652 },
  'gandhi nagar': { lat: 12.9572, lng: 79.1419 },
  'shenbakkam': { lat: 12.9272, lng: 79.1221 },
  'ambur': { lat: 12.7904, lng: 78.7166 },
  'vaniyambadi': { lat: 12.6825, lng: 78.6208 },
  // Other Major Connections
  'tirupati': { lat: 13.6288, lng: 79.4192 },
  'chittoor': { lat: 13.2172, lng: 79.1003 },
  'hosur': { lat: 12.7409, lng: 77.8253 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'salem': { lat: 11.6643, lng: 78.1460 },
  'coimbatore': { lat: 11.0168, lng: 76.9558 },
  'trichy': { lat: 10.7905, lng: 78.7047 },
  'madurai': { lat: 9.9252, lng: 78.1198 },
  'pondicherry': { lat: 11.9416, lng: 79.8083 },
  'puducherry': { lat: 11.9416, lng: 79.8083 }
};

// Geocoding helper with fuzzy fallback
const resolveCoordinates = (text: string, defaultFallback: { lat: number; lng: number }): { lat: number; lng: number } => {
  const lower = text.toLowerCase();
  for (const key of Object.keys(KNOWN_LOCATIONS)) {
    if (lower.includes(key)) {
      return KNOWN_LOCATIONS[key];
    }
  }
  return defaultFallback;
};

// Haversine distance helper (in kilometers) between two geographic points
const calculateHaversineKm = (
  p1: { lat: number; lng: number },
  p2: { lat: number; lng: number }
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
    Math.cos((p2.lat * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Calculate total multi-point driving/riding route distance including winding road factor
const calculateRouteDistanceKm = (
  pCoords: { lat: number; lng: number } | null,
  dCoords: { lat: number; lng: number } | null,
  stopsList: RouteStop[]
): number => {
  // If no coordinates selected yet, provide a realistic baseline distance
  if (!pCoords || !dCoords) {
    return 14.8;
  }

  const points: { lat: number; lng: number }[] = [pCoords];
  for (const stop of stopsList) {
    if (stop.lat !== undefined && stop.lng !== undefined) {
      points.push({ lat: stop.lat, lng: stop.lng });
    }
  }
  points.push(dCoords);

  let totalCrowFlies = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalCrowFlies += calculateHaversineKm(points[i], points[i + 1]);
  }

  // Multiply by 1.35x to account for real urban roads, signals, turns & detours
  const realRoadKm = Math.max(1.5, Math.round(totalCrowFlies * 1.35 * 10) / 10);
  return realRoadKm;
};

export default function RideBookingView({ mode, onBackToHome }: RideBookingViewProps) {
  // Synchronize pickup and dropoff across bike, auto, and car pages via shared storage
  const [pickup, setPickup] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sart_ride_pickup') || '';
    }
    return '';
  });

  const [dropoff, setDropoff] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sart_ride_dropoff') || '';
    }
    return '';
  });

  const [stops, setStops] = useState<RouteStop[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sart_ride_stops');
        if (saved) return JSON.parse(saved);
      } catch (e) { }
    }
    return [];
  });

  // Keep localStorage updated whenever user changes pickup/dropoff/stops
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sart_ride_pickup', pickup);
    }
  }, [pickup]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sart_ride_dropoff', dropoff);
    }
  }, [dropoff]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sart_ride_stops', JSON.stringify(stops));
    }
  }, [stops]);

  // Coordinates for pickup and dropoff (defaults to central Chennai coordinates)
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dropCoords, setDropCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Active target for setting location on map: 'pickup' | 'drop' | stopId | 'new-stop' | null
  const [activePinTarget, setActivePinTarget] = useState<'pickup' | 'drop' | string | null>(null);

  // Map zoom and center
  const [mapZoom, setMapZoom] = useState(13);
  const [centerCoords, setCenterCoords] = useState<{ lat: number; lng: number }>({
    lat: 13.0751,
    lng: 80.1960
  });

  // UI state for adding stops & modals
  const [showAddStopForm, setShowAddStopForm] = useState(false);
  const [newStopName, setNewStopName] = useState('');
  const [newStopPurpose, setNewStopPurpose] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rideBookedModal, setRideBookedModal] = useState<any | null>(null);

  // Selected vehicle type: ONLY 2 OPTIONS FOR BIKE (Red Scooty ₹98, Honda SP 125 Bike ₹114)
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

  // Debounced geocoder for text entered into pickup input
  useEffect(() => {
    const text = pickup.trim();
    if (!text) {
      setPickupCoords(null);
      return;
    }
    // Fast dictionary check first
    const fastCoords = resolveCoordinates(text, null as any);
    if (fastCoords) {
      setPickupCoords(fastCoords);
      setCenterCoords(fastCoords);
      return;
    }

    // Debounced Nominatim live geocode lookup
    const timer = setTimeout(async () => {
      try {
        const queries = [
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text + ', Tamil Nadu, India')}&limit=1`,
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&countrycodes=in&limit=1`
        ];
        for (const url of queries) {
          const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data[0]) {
              const lat = parseFloat(data[0].lat);
              const lng = parseFloat(data[0].lon);
              if (!isNaN(lat) && !isNaN(lng)) {
                setPickupCoords({ lat, lng });
                setCenterCoords({ lat, lng });
                break;
              }
            }
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [pickup]);

  // Debounced geocoder for text entered into dropoff input
  useEffect(() => {
    const text = dropoff.trim();
    if (!text) {
      setDropCoords(null);
      return;
    }
    // Fast dictionary check first
    const fastCoords = resolveCoordinates(text, null as any);
    if (fastCoords) {
      setDropCoords(fastCoords);
      return;
    }

    // Debounced Nominatim live geocode lookup
    const timer = setTimeout(async () => {
      try {
        const queries = [
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text + ', Tamil Nadu, India')}&limit=1`,
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&countrycodes=in&limit=1`
        ];
        for (const url of queries) {
          const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data[0]) {
              const lat = parseFloat(data[0].lat);
              const lng = parseFloat(data[0].lon);
              if (!isNaN(lat) && !isNaN(lng)) {
                setDropCoords({ lat, lng });
                break;
              }
            }
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [dropoff]);

  // Calculate live Google Maps road navigation embed URL with exact two-wheeler / bicycling routes
  const getGoogleDirectionsUrl = () => {
    const defaultCenter = '13.0751024,80.1959839';
    const origin = pickup.trim()
      ? encodeURIComponent(pickup.trim())
      : (pickupCoords ? `${pickupCoords.lat},${pickupCoords.lng}` : '');
    const destination = dropoff.trim()
      ? encodeURIComponent(dropoff.trim())
      : (dropCoords ? `${dropCoords.lat},${dropCoords.lng}` : '');

    // If both origin and destination are present, show route directions
    if (origin && destination) {
      // Use Google Maps directions embed
      return `https://maps.google.com/maps?saddr=${origin}&daddr=${destination}&t=m&z=${mapZoom}&output=embed`;
    }

    // If only one is present, center map on that point
    const target = origin || destination;
    if (target) {
      return `https://maps.google.com/maps?q=${target}&t=m&z=${mapZoom}&output=embed`;
    }

    // Default: User's exact Chennai link center (13.0751024, 80.1959839, 13z)
    return `https://maps.google.com/maps?ll=13.0751024,80.1959839&z=${mapZoom}&t=m&output=embed`;
  };

  const getDirectAppUrl = () => {
    const origin = encodeURIComponent(pickup.trim() || 'Chennai');
    const destination = encodeURIComponent(dropoff.trim() || 'Chennai Central');
    const travelmode = mode === 'bike' ? 'two_wheeler' : 'driving';
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelmode}`;
  };

  // Convert lat/lng to percentage coordinates on interactive canvas
  const getRelativePosition = (pt: { lat: number; lng: number } | null, fallbackX = 30, fallbackY = 50) => {
    if (!pt) {
      return { left: `${fallbackX}%`, top: `${fallbackY}%`, x: fallbackX, y: fallbackY, exists: false };
    }
    const minLat = 12.96, maxLat = 13.18;
    const minLng = 80.08, maxLng = 80.30;

    const x = Math.min(Math.max(((pt.lng - minLng) / (maxLng - minLng)) * 100, 10), 90);
    const y = Math.min(Math.max((1 - (pt.lat - minLat) / (maxLat - minLat)) * 100, 10), 90);
    return { left: `${x.toFixed(1)}%`, top: `${y.toFixed(1)}%`, x, y, exists: true };
  };

  const pickupPos = getRelativePosition(pickupCoords, 28, 48);
  const dropPos = getRelativePosition(dropCoords, 72, 54);

  // Reverse geocode or create readable name for clicked map coordinates
  const handleMapCanvasClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activePinTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;

    // Approximate latitude & longitude based on Chennai bounding box
    const minLat = 12.96, maxLat = 13.18;
    const minLng = 80.08, maxLng = 80.30;
    const clickLat = +(maxLat - yRatio * (maxLat - minLat)).toFixed(4);
    const clickLng = +(minLng + xRatio * (maxLng - minLng)).toFixed(4);

    let resolvedLabel = `Pinned Point (${clickLat}°N, ${clickLng}°E)`;

    // Try fast reverse lookup with Nominatim
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickLat}&lon=${clickLng}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          const parts = data.display_name.split(',');
          resolvedLabel = parts.slice(0, 3).join(', ').trim();
        }
      }
    } catch (err) {
      // Keep default resolvedLabel
    }

    if (activePinTarget === 'pickup') {
      setPickup(resolvedLabel);
      setPickupCoords({ lat: clickLat, lng: clickLng });
      setCenterCoords({ lat: clickLat, lng: clickLng });
      setActivePinTarget(null);
    } else if (activePinTarget === 'drop') {
      setDropoff(resolvedLabel);
      setDropCoords({ lat: clickLat, lng: clickLng });
      setActivePinTarget(null);
    } else if (activePinTarget === 'new-stop') {
      setNewStopName(resolvedLabel);
      setActivePinTarget(null);
    } else if (typeof activePinTarget === 'string' && activePinTarget.startsWith('stop-')) {
      const stopId = activePinTarget;
      setStops(prev => prev.map(s => s.id === stopId ? { ...s, name: resolvedLabel, lat: clickLat, lng: clickLng } : s));
      setActivePinTarget(null);
    }
  };

  // Zoom controls
  const handleZoom = (dir: 'in' | 'out') => {
    setMapZoom(prev => Math.min(Math.max(prev + (dir === 'in' ? 1 : -1), 10), 19));
  };

  // Dynamic Route Distance (in km) calculated between Pickup, Stops and Dropoff
  const routeDistanceKm = React.useMemo(() => {
    return calculateRouteDistanceKm(pickupCoords, dropCoords, stops);
  }, [pickupCoords, dropCoords, stops]);

  const stopsExtraCost = stops.length * 15; // ₹15 per stop

  // Dynamic Vehicles list with fare and time calculated based on route distance
  const vehicles = React.useMemo(() => {
    const dist = routeDistanceKm;
    const distText = `${dist} km`;

    // Standardized estimated trip duration based on Google Map road distance (approx 2 mins per km + 3 mins per stop)
    const tripDurationMins = Math.max(7, Math.round(dist * 1.8 + stops.length * 3));
    const tripTimeText = `${tripDurationMins} mins`;

    if (mode === 'bike') {
      // Scooty: Base ₹25 (covers first 2km) + ₹5.5/km + stops
      const scootyFare = Math.round(25 + Math.max(0, dist - 2) * 5.5 + stopsExtraCost);

      // Bike (Honda SP 125): Base ₹30 (covers first 2km) + ₹6.5/km + stops
      const bikeFare = Math.round(30 + Math.max(0, dist - 2) * 6.5 + stopsExtraCost);

      return [
        {
          id: 'scooty',
          title: 'Scooty / Activa',
          fare: scootyFare,
          distance: distText,
          time: tripTimeText,
          badge: 'Eco Friendly & Smooth',
          badgeClass: '',
          image: '/images/red_scooty.png',
          desc: 'Comfortable footboard for bag, smooth city cruise, top safety rating'
        },
        {
          id: 'bike',
          title: 'Honda SP 125 Bike',
          fare: bikeFare,
          distance: distText,
          time: tripTimeText,
          badge: 'Fastest Ride',
          badgeClass: 'popular',
          image: '/images/blue_bike.png',
          desc: 'Quickest travel through signals, verified rider captain, disposable hairnet'
        }
      ];
    } else if (mode === 'auto') {
      // Auto: Base ₹40 + ₹11/km
      const autoFare = Math.round(40 + Math.max(0, dist - 2) * 11 + stopsExtraCost * 1.2);
      const autoPlusFare = Math.round(50 + Math.max(0, dist - 2) * 13 + stopsExtraCost * 1.2);

      return [
        {
          id: 'auto_standard',
          title: 'Auto Rickshaw',
          fare: autoFare,
          distance: distText,
          time: tripTimeText,
          badge: 'Pocket Friendly',
          badgeClass: 'popular',
          image: '/images/auto_green_yellow.png',
          desc: 'Doorstep pickup, open breeze, fit for 3 passengers & luggage'
        },
        {
          id: 'auto_plus',
          title: 'Auto Plus (Top Rated)',
          fare: autoPlusFare,
          distance: distText,
          time: tripTimeText,
          badge: 'Top Rated 4.9★',
          badgeClass: 'premium',
          image: '/images/auto_yellow_black.png',
          desc: 'Experienced super drivers, cleanest auto, immediate dispatch'
        }
      ];
    } else {
      // Car / Cab
      const econFare = Math.round(80 + Math.max(0, dist - 2) * 14 + stopsExtraCost * 1.5);
      const sedanFare = Math.round(100 + Math.max(0, dist - 2) * 17 + stopsExtraCost * 1.5);
      const suvFare = Math.round(150 + Math.max(0, dist - 2) * 24 + stopsExtraCost * 2);

      return [
        {
          id: 'car_economy',
          title: 'Cab Economy (Mini/Go)',
          fare: econFare,
          distance: distText,
          time: tripTimeText,
          badge: 'Best Value',
          badgeClass: 'popular',
          icon: '🚖',
          desc: 'Air-conditioned hatchback, affordable daily commute'
        },
        {
          id: 'car_sedan',
          title: 'Cab Premium Sedan',
          fare: sedanFare,
          distance: distText,
          time: tripTimeText,
          badge: 'Comfort Sedan',
          badgeClass: 'premium',
          icon: '✨🚕',
          desc: 'Spacious Dzire/Etios with top-rated driver & ample boot space'
        },
        {
          id: 'car_suv',
          title: 'Cab XL (6 Seater SUV)',
          fare: suvFare,
          distance: distText,
          time: tripTimeText,
          badge: 'Family & Groups',
          badgeClass: '',
          icon: '🚙',
          desc: 'Innova/Ertiga with extra legroom and large luggage carrier'
        }
      ];
    }
  }, [mode, routeDistanceKm, stops.length, stopsExtraCost]);

  const currentVehicleData = vehicles.find(v => v.id === selectedVehicle) || vehicles[0];

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
                <i className="fa-solid fa-circle-dot"></i> Live Google Road Network
              </span>
            </div>
            <h2 className="rb-main-heading">
              {mode === 'bike' ? 'Bike & Scooty Booking' : mode === 'auto' ? 'Auto Rickshaw Booking' : 'Cab & Taxi Booking'}
            </h2>
          </div>
        </div>


      </div>

      {/* Main Grid: Inputs Column & Live Map */}
      <div className="rb-booking-grid">
        {/* Left Column: Route Inputs */}
        <div className="rb-route-column">
          <div className="rb-route-boxes-stack">
            {/* 1. Pickup Box */}
            <div className={`rb-input-box ${activePinTarget === 'pickup' ? 'focus-target' : ''}`}>
              <div className="rb-box-label green">
                <span>Pickup</span>

              </div>
              <div className="rb-box-field-row">
                <div className="rb-point-bullet green"></div>
                <input
                  type="text"
                  className="rb-input-element"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup location"
                />

              </div>
            </div>

            {/* Connecting Dotted Line */}
            <div className="rb-route-dotted-v-line"></div>

            {/* Intermediate Stops */}
            {stops.map((st, idx) => (
              <React.Fragment key={st.id}>
                <div className={`rb-input-box stop-box ${activePinTarget === st.id ? 'focus-target' : ''}`}>
                  <div className="rb-box-label orange">
                    <span>Stop #{idx + 1}</span>
                    <button
                      type="button"
                      className="rb-remove-stop-cross"
                      onClick={() => setStops(prev => prev.filter(s => s.id !== st.id))}
                      title="Remove Stop"
                    >
                      ×
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
                        setStops(prev => prev.map(s => s.id === st.id ? { ...s, name: val } : s));
                      }}
                      placeholder="Stop location"
                    />
                    <button
                      type="button"
                      className={`rb-input-map-icon-btn ${activePinTarget === st.id ? 'active' : ''}`}
                      onClick={() => {
                        setActivePinTarget(activePinTarget === st.id ? null : st.id);
                      }}
                      title="Click to select this stop on map"
                    >
                      <i className="fa-solid fa-map-location-dot"></i>
                    </button>
                  </div>

                  <div className="rb-stop-purpose-pill-row">
                    <i className="fa-solid fa-clipboard-check"></i>
                    <input
                      type="text"
                      className="rb-stop-purpose-input"
                      value={st.purpose}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStops(prev => prev.map(s => s.id === st.id ? { ...s, purpose: val } : s));
                      }}
                      placeholder="Purpose for stop (e.g. Pick parcel, 2 min errand, Meet friend)"
                    />
                  </div>
                </div>

                <div className="rb-route-dotted-v-line"></div>
              </React.Fragment>
            ))}

            {/* 2. Drop Box */}
            <div className={`rb-input-box ${activePinTarget === 'drop' ? 'focus-target' : ''}`}>
              <div className="rb-box-label red">
                <span>Drop</span>

              </div>
              <div className="rb-box-field-row">
                <div className="rb-point-bullet red"></div>
                <input
                  type="text"
                  className="rb-input-element"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="Enter drop location"
                />

              </div>
            </div>
          </div>

          {/* Quick Action Pills: Select on map + Add stops */}
          <div className="rb-actions-pills-row">
            <button
              type="button"
              className={`rb-pill-btn ${activePinTarget === 'pickup' ? 'active' : ''}`}
              onClick={() => {
                setActivePinTarget(activePinTarget === 'pickup' ? null : 'pickup');
              }}
            >
              <i className="fa-solid fa-map-pin"></i> Select on map
            </button>
            <button
              type="button"
              className="rb-pill-btn"
              onClick={() => setShowAddStopForm(prev => !prev)}
            >
              <span className="rb-pill-diamond">＋</span> Add stops
            </button>
          </div>

          {/* Add Stop with Purpose Creator */}
          {showAddStopForm && (
            <div className="rb-add-stop-panel">
              <div className="rb-add-stop-badge-title">
                <i className="fa-solid fa-circle-plus"></i> Add Stopping
              </div>
              <div className="rb-add-stop-inputs">
                <div className="rb-field-with-icon">
                  <input
                    type="text"
                    className="rb-input-element standard"
                    placeholder="Stop location"
                    value={newStopName}
                    onChange={(e) => setNewStopName(e.target.value)}
                  />
                  <button
                    type="button"
                    className="rb-field-map-btn"
                    onClick={() => {
                      setActivePinTarget('new-stop');
                    }}
                    title="Pick on map"
                  >
                    <i className="fa-solid fa-location-dot"></i>
                  </button>
                </div>

              </div>
              <div className="rb-add-stop-buttons">
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
                        lat: 13.0600,
                        lng: 80.2200
                      }
                    ]);
                    setNewStopName('');
                    setNewStopPurpose('');
                    setShowAddStopForm(false);
                  }}
                >
                  Confirm Stop
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

        {/* Right Column: Exact Google Road Navigation Map with Direct Selection & Blue Pencil Route Line */}
        <div className="rb-map-column">
          <div className="rb-map-card">
            {/* Map Top Bar */}
            <div className="rb-map-top-bar">
              <div className="rb-map-header-left">
                <i className="fa-solid fa-location-crosshairs" style={{ color: '#ea580c' }}></i>
                <span>
                  Live Google Map ({centerCoords.lat.toFixed(4)}°N, {centerCoords.lng.toFixed(4)}°E) •{' '}
                  {activePinTarget ? (
                    <span className="rb-active-pin-notice">
                      Click map to set <strong>{activePinTarget === 'pickup' ? 'PICKUP' : activePinTarget === 'drop' ? 'DROP' : 'STOP'}</strong>
                    </span>
                  ) : (
                    'Two-Wheeler Road Route'
                  )}
                </span>
              </div>

              {activePinTarget && (
                <div className="rb-active-selecting-badge">
                  <span className="pulse-dot"></span> Click anywhere on map to select
                </div>
              )}
            </div>

            {/* Interactive Map Canvas Container with Google Road Map Embed */}
            <div
              className={`rb-interactive-map-canvas ${activePinTarget ? 'selecting-active' : ''}`}
              onClick={handleMapCanvasClick}
            >
              {/* Real Google Map Road Directions Embed */}
              <iframe
                title="Google Maps Live Bike Road Navigation"
                className="rb-map-iframe-google"
                src={getGoogleDirectionsUrl()}
                loading="lazy"
                allowFullScreen
              />

              {/* Click Interceptor Overlay when selecting on map */}
              {activePinTarget && (
                <div className="rb-map-click-overlay" title={`Click to set ${activePinTarget}`}>
                  <div className="rb-map-selection-tooltip">
                    <i className="fa-solid fa-crosshairs"></i> Click anywhere to pin {activePinTarget.toUpperCase()}
                  </div>
                </div>
              )}

              {/* Map Floating Zoom Controls */}
              <div className="rb-map-zoom-controls" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="rb-zoom-btn"
                  onClick={() => handleZoom('in')}
                  title="Zoom In"
                >
                  ＋
                </button>
                <button
                  type="button"
                  className="rb-zoom-btn"
                  onClick={() => handleZoom('out')}
                  title="Zoom Out"
                >
                  －
                </button>
              </div>
            </div>

            {/* Prominent Live Google Map Route & Distance Card Below Map */}
            <div className="rb-map-below-distance-card">
              <div className="rb-map-distance-header">
                <div className="rb-map-distance-pill">
                  <i className="fa-solid fa-route"></i>
                  <span>Total Distance: <strong>{routeDistanceKm} km</strong></span>
                </div>
                <div className="rb-map-time-pill">
                  <i className="fa-solid fa-clock"></i>
                  <span>Est. Duration: <strong>{currentVehicleData.time}</strong></span>
                </div>
              </div>

              <div className="rb-map-route-points-preview">
                <div className="rb-map-point-preview green">
                  <div className="rb-point-bullet green"></div>
                  <div className="rb-point-text">
                    <span className="rb-point-title">Pickup Point:</span>
                    <span className="rb-point-address">{pickup || 'Tap to set or enter pickup address'}</span>
                  </div>
                </div>

                {stops.length > 0 && (
                  <div className="rb-map-point-preview orange">
                    <div className="rb-point-diamond">
                      <span>{stops.length}</span>
                    </div>
                    <div className="rb-point-text">
                      <span className="rb-point-title">{stops.length} Halt {stops.length === 1 ? 'Stop' : 'Stops'}:</span>
                      <span className="rb-point-address">{stops.map(s => s.name).join(' • ')}</span>
                    </div>
                  </div>
                )}

                <div className="rb-map-point-preview red">
                  <div className="rb-point-bullet red"></div>
                  <div className="rb-point-text">
                    <span className="rb-point-title">Dropping Point:</span>
                    <span className="rb-point-address">{dropoff || 'Tap to set or enter dropping destination'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Selection Cards Section */}
      <div className="rb-vehicle-section">
        <h3 className="rb-vehicle-section-title">
          <i className={mode === 'bike' ? 'fa-solid fa-motorcycle' : mode === 'auto' ? 'fa-solid fa-taxi' : 'fa-solid fa-car'}></i>
          {mode === 'bike' ? 'Choose Two-Wheeler (Only 2 Options)' : mode === 'auto' ? 'Choose Auto Service' : 'Choose Cab Service'}
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
                <div className="rb-vehicle-specs-row">
                  <span><i className="fa-solid fa-route"></i> {v.distance}</span>
                  <span><i className="fa-solid fa-clock"></i> {v.time}</span>
                  <span><i className="fa-solid fa-shield-halved"></i> Helmet / Safety</span>
                </div>
                <p className="rb-vehicle-desc">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
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
          onClick={() => setShowConfirmModal(true)}
        >
          Continue Booking & View Itinerary Map (₹ {currentVehicleData.fare})
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
              {/* Live Map in Modal with Real Google Road Directions */}
              <div className="rb-modal-map-view">
                <div className="rb-modal-legend">
                  <div className="rb-legend-pill">
                    <span className="dot green"></span> Pickup Point
                  </div>
                  <div className="rb-legend-pill">
                    <span className="dot orange"></span> Stops with Purpose
                  </div>
                  <div className="rb-legend-pill">
                    <span className="dot red"></span> Final Destination
                  </div>
                </div>

                <div className="rb-modal-map-canvas">
                  <iframe
                    title="Modal Route Map"
                    className="rb-map-iframe-google"
                    src={getGoogleDirectionsUrl()}
                    loading="lazy"
                  />
                  {/* Blue pencil line */}
                  <svg className="rb-map-pencil-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line
                      x1="22"
                      y1="30"
                      x2="78"
                      y2="70"
                      stroke="#2563eb"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  </svg>
                </div>
              </div>

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
                    <div className="rb-itin-time">Direct dropoff • Total journey ~{currentVehicleData.time} ({routeDistanceKm} km)</div>
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
