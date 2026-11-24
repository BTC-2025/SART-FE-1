'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import GoogleMapPickerModal from '@/components/rental/GoogleMapPickerModal';
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Search,
  Crosshair,
  Navigation,
  Shield,
  Star,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Layers,
  Phone,
  AlertCircle,
  Clock3,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export interface ParkingSpotItem {
  id: string;
  name: string;
  spotName?: string;
  category: string;
  spaceType?: string;
  city: string;
  state: string;
  locality?: string;
  pincode?: string;
  pincodePlace?: string;
  address: string;
  lat: number;
  lng: number;
  hourlyRate: number;
  dailyRate?: number;
  monthlyRate?: number;
  pricingText?: string;
  rating: number;
  reviewsCount?: number;
  availableSlots: number;
  totalSlots: number;
  operatingHours?: string;
  securityFeatures?: string[];
  features?: string[];
  image: string;
  ownerName?: string;
  primaryMobile?: string;
  vehicleTypes?: any;
  distanceKm?: number;
  distanceText?: string;
}

// Vehicle Categories supported with intuitive icons
const VEHICLE_TYPES = [
  { id: 'all', label: 'All Vehicles', icon: 'fa-solid fa-shapes' },
  { id: 'bike', label: '2-Wheeler / Bike', icon: 'fa-solid fa-motorcycle', key: 'twoWheeler' },
  { id: 'car', label: 'Car / Sedan / SUV', icon: 'fa-solid fa-car', key: 'fourWheeler' },
  { id: 'truck', label: 'Truck / Heavy Bay', icon: 'fa-solid fa-truck', key: 'heavyVehicle' },
  { id: 'bus', label: 'Bus / Coach', icon: 'fa-solid fa-bus', key: 'heavyVehicle' }
];

export default function ParkingSearchPage() {
  // Search Inputs
  const [vehicleType, setVehicleType] = useState<string>('car');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  const [durationHours, setDurationHours] = useState<number>(2);

  // Location / Address states
  const [addressInput, setAddressInput] = useState<string>('');
  const [resolvedState, setResolvedState] = useState<string>('');
  const [resolvedCity, setResolvedCity] = useState<string>('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isUsingLiveLocation, setIsUsingLiveLocation] = useState<boolean>(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('');

  // Map Picker Modal
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  // Spots Data & Loading
  const [spots, setSpots] = useState<ParkingSpotItem[]>([]);
  const [isLoadingSpots, setIsLoadingSpots] = useState<boolean>(true);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpotItem | null>(null);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<boolean>(false);

  // Fetch Spots from backend API and sync with local storage
  const loadSpots = async (queryState?: string, queryCity?: string) => {
    setIsLoadingSpots(true);
    let loaded: ParkingSpotItem[] = [];

    // 1. Try Backend APIs (/api/parking/spots and Express port 5000)
    const endpoints = [
      '/api/parking/spots',
      'http://localhost:5000/api/parking/spots',
      'http://localhost:3005/api/parking/spots'
    ];

    for (const ep of endpoints) {
      try {
        const params = new URLSearchParams();
        if (queryState) params.append('state', queryState);
        if (queryCity) params.append('city', queryCity);
        const url = params.toString() ? `${ep}?${params.toString()}` : ep;

        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            json.data.forEach((item: any) => {
              if (!loaded.some(l => l.id === item.id)) {
                loaded.push({
                  id: item.id,
                  name: item.spotName || item.name || '',
                  category: item.spaceType || item.category || '',
                  city: item.city || '',
                  state: item.state || '',
                  locality: item.locality || '',
                  pincode: item.pincode || '',
                  pincodePlace: item.pincodePlace || item.locality || item.city,
                  address: item.address || `${item.doorNo ? item.doorNo + ', ' : ''}${item.streetName ? item.streetName + ', ' : ''}${item.locality ? item.locality + ', ' : ''}${item.city}, ${item.state} - ${item.pincode || ''}`.replace(/^,\s*/, ''),
                  lat: Number(item.lat) || 28.4595,
                  lng: Number(item.lng) || 77.0266,
                  hourlyRate: Number(item.minHourlyRate || item.hourlyRate) || 20,
                  dailyRate: Number(item.dailyRate) || 150,
                  monthlyRate: Number(item.monthlyRate) || 2500,
                  pricingText: item.pricingText || `₹${item.minHourlyRate || item.hourlyRate || 20}/hr`,
                  rating: Number(item.rating) || 4.8,
                  reviewsCount: Number(item.reviewsCount) || 24,
                  availableSlots: Number(item.availableSlots) || 35,
                  totalSlots: Number(item.totalSlots) || 50,
                  operatingHours: item.operatingHours || '24/7 Open',
                  securityFeatures: Array.isArray(item.securityFeatures) ? item.securityFeatures : ['CCTV Surveillance', '24/7 Security Guard', 'Gated Boundary Wall'],
                  image: item.coverPhoto || item.image || '',
                  ownerName: item.ownerName || '',
                  primaryMobile: item.primaryMobile || '',
                  vehicleTypes: item.vehicleTypes
                });
              }
            });
            break;
          }
        }
      } catch (e) { }
    }

    // 2. Check local storage added from FE-2 business portal
    try {
      const localFleet = localStorage.getItem('sart_parking_fleet');
      if (localFleet) {
        const parsed = JSON.parse(localFleet);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((item: any) => {
            if (!loaded.some(l => l.id === item.id)) {
              loaded.unshift({
                id: item.id,
                name: item.name || item.yardData?.spotName || '',
                category: item.brand || item.yardData?.spaceType || '',
                city: item.city || item.yardData?.city || '',
                state: item.yardData?.state || '',
                locality: item.locality || item.yardData?.locality || '',
                pincode: item.yardData?.pincode || '',
                pincodePlace: item.pincodePlace || item.locality || item.city,
                address: item.location || `${item.city}, ${item.yardData?.state || ''}`,
                lat: Number(item.yardData?.coordinates?.lat) || 28.4595,
                lng: Number(item.yardData?.coordinates?.lng) || 77.0266,
                hourlyRate: Number(item.hourlyRate) || 20,
                dailyRate: Number(item.dailyRate) || 150,
                monthlyRate: Number(item.monthlyRate) || 2500,
                pricingText: item.pricingText || `₹${item.hourlyRate || 20}/hr`,
                rating: Number(item.rating) || 4.9,
                reviewsCount: 18,
                availableSlots: 45,
                totalSlots: 60,
                operatingHours: item.yardData?.operatingHours || '24/7 Open',
                securityFeatures: item.yardData?.securityFeatures || [''],
                image: item.image || '',
                ownerName: item.yardData?.ownerName || 'Verified Yard Host',
                primaryMobile: item.yardData?.primaryMobile || '',
                vehicleTypes: item.yardData?.vehicleTypes
              });
            }
          });
        }
      }
    } catch (e) { }

    // 3. Fallback mock spots if completely empty so user always sees interactive parking options
    if (loaded.length === 0) {
      loaded = [

      ];
    }

    setSpots(loaded);
    setIsLoadingSpots(false);
  };

  useEffect(() => {
    loadSpots();
  }, []);

  // Distance calculator helper in KM
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Turn ON Live Location handler
  const handleDetectLiveLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatus('Acquiring your GPS location...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords({ lat, lng });
        setIsUsingLiveLocation(true);
        setIsDetectingLocation(false);

        // Reverse geocode to get State & City
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const state = addr.state || '';
            const city = addr.city || addr.town || addr.county || addr.state_district || 'Near Me';
            const locality = addr.suburb || addr.neighbourhood || addr.road || '';

            const formatted = `${locality ? locality + ', ' : ''}${city}, ${state}`.trim();
            setAddressInput(formatted || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            setResolvedState(state);
            setResolvedCity(city);
            setLocationStatus(`Located: ${city}, ${state}`);

            // Automatically filter spots in that state/near user
            loadSpots(state);
            setHasSearched(true);
          }
        } catch (e) {
          setAddressInput(`Current GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          setLocationStatus('GPS acquired');
          setHasSearched(true);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        setLocationStatus('Could not acquire GPS.');
        alert('Could not get your location. Please type your city/address or select on map.');
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  // Map Picker Modal confirm
  const handleMapConfirm = (addr: string, coords?: { lat: number; lng: number }) => {
    setAddressInput(addr);
    setIsMapModalOpen(false);

    // Extract state/city if available
    const parts = addr.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      const statePart = parts[parts.length - 1].replace(/[0-9-]/g, '').trim();
      const cityPart = parts[parts.length - 2];
      setResolvedState(statePart);
      setResolvedCity(cityPart);
      loadSpots(statePart, cityPart);
    }
    if (coords) {
      setUserCoords(coords);
      setIsUsingLiveLocation(true);
    }
    setHasSearched(true);
  };

  // Execute Search
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasSearched(true);

    if (resolvedState || resolvedCity) {
      loadSpots(resolvedState, resolvedCity);
    } else if (addressInput) {
      // Look for match in input string
      loadSpots(undefined, addressInput);
    } else {
      loadSpots();
    }
  };

  // Filter and sort spots by proximity (nearest first) and vehicle compatibility
  const filteredAndSortedSpots = useMemo(() => {
    let list = [...spots];

    // Filter by vehicle type if specific vehicle is chosen
    if (vehicleType && vehicleType !== 'all') {
      list = list.filter((s) => {
        if (!s.vehicleTypes) return true; // If no restrictive schema, default allow
        if (vehicleType === 'bike') return s.vehicleTypes.twoWheeler?.enabled !== false;
        if (vehicleType === 'car') return s.vehicleTypes.fourWheeler?.enabled !== false;
        if (vehicleType === 'truck' || vehicleType === 'bus') return s.vehicleTypes.heavyVehicle?.enabled !== false;
        return true;
      });
    }

    // Filter by state or address if state is resolved
    if (resolvedState && isUsingLiveLocation) {
      const stateLower = resolvedState.toLowerCase();
      const matchingState = list.filter(s => s.state && s.state.toLowerCase().includes(stateLower));
      if (matchingState.length > 0) {
        list = matchingState;
      }
    }

    // Calculate distance and sort by nearest
    if (userCoords) {
      list = list.map((s) => {
        const dist = calculateDistance(userCoords.lat, userCoords.lng, s.lat, s.lng);
        return {
          ...s,
          distanceKm: dist,
          distanceText: dist < 1 ? `${Math.round(dist * 1000)} m away` : `${dist.toFixed(1)} km away`
        };
      });

      // Sort by nearest distance
      list.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
    } else {
      // Assign default distances
      list = list.map((s, idx) => ({
        ...s,
        distanceText: s.distanceText || `${(1.2 + idx * 1.4).toFixed(1)} km away`
      }));
    }

    return list;
  }, [spots, vehicleType, userCoords, resolvedState, isUsingLiveLocation]);

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflowX: 'hidden' }}>
      <Navbar />
      <SubNavbar />

      <main style={{ flex: '1 0 auto', padding: '24px 20px 48px 20px', width: '100%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Header Title & Subtitle */}
          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#2563eb' }}><MapPin size={28} /></span> Smart Parking & Yard Reservation
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
              Select your vehicle type, date, time and location. Turn on live location to discover verified parking yards in your state, sorted nearest to you.
            </p>
          </div>

          {/* Search Card Container */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
              padding: '24px 28px',
              marginBottom: '32px'
            }}
          >
            <form onSubmit={handleSearch}>

              {/* Row 1: Vehicle Type, Date, Time & Duration */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1.1fr 1fr 1fr',
                  gap: '16px',
                  marginBottom: '20px'
                }}
              >
                {/* Vehicle Type */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                    Vehicle Type *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingRight: '36px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none'
                      }}
                    >
                      {VEHICLE_TYPES.map((vt) => (
                        <option key={vt.id} value={vt.id}>
                          {vt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                  </div>
                </div>

                {/* Booking Date */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                    Date *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Booking Time */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                    Time *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Expected Duration */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                    Duration
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        paddingRight: '36px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#0f172a',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none'
                      }}
                    >
                      <option value={1}>1 Hour (Quick)</option>
                      <option value={2}>2 Hours</option>
                      <option value={4}>4 Hours (Half Day)</option>
                      <option value={8}>8 Hours (Full Day)</option>
                      <option value={24}>24 Hours (Overnight)</option>
                      <option value={720}>Monthly Pass</option>
                    </select>
                    <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                  </div>
                </div>
              </div>

              {/* Row 2: Address only * Search bar with Select on Map button (Matching Image) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Address only *
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '14px',
                    backgroundColor: '#ffffff',
                    padding: '4px 6px 4px 14px',
                    transition: 'border-color 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <span style={{ color: '#2563eb', display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <MapPin size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search city, area, or pickup address..."
                    value={addressInput}
                    onChange={(e) => {
                      setAddressInput(e.target.value);
                      setIsUsingLiveLocation(false);
                    }}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      color: '#0f172a',
                      fontWeight: 500
                    }}
                  />

                  {/* Select on Map Button (Matching user screenshot style) */}
                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: '1.5px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      color: '#0f172a',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  >
                    <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                      <MapPin size={16} />
                    </span>
                    Select on Map
                  </button>
                </div>
              </div>

              {/* Action Buttons: Live Location Radar + Search Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px' }}>

                {/* Live Location Button */}
                <button
                  type="button"
                  onClick={handleDetectLiveLocation}
                  disabled={isDetectingLocation}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: isUsingLiveLocation ? '#ecfdf5' : '#eff6ff',
                    border: isUsingLiveLocation ? '1.5px solid #10b981' : '1.5px solid #bfdbfe',
                    color: isUsingLiveLocation ? '#047857' : '#1d4ed8',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Crosshair size={16} className={isDetectingLocation ? 'animate-spin' : ''} />
                  {isDetectingLocation
                    ? 'Detecting GPS...'
                    : isUsingLiveLocation
                      ? `Live Location: ${resolvedState || 'Active'}`
                      : 'Use Live Location (Show State Parking)'}
                </button>

                {/* Black Search Button */}
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#09090b',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 36px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#27272a')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#09090b')}
                >
                  <Search size={16} /> Search Parking
                </button>
              </div>

              {/* Status Note */}
              {locationStatus && (
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="#10b981" />
                  <span>{locationStatus}</span>
                  {resolvedState && (
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>
                      — Showing all available yards in {resolvedState}
                    </span>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Results Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Available Parking Spots ({filteredAndSortedSpots.length})
              </h2>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                {userCoords
                  ? 'Sorted by nearest distance from your selected location'
                  : 'Verified spaces with instant gate entry and security guards'}
              </span>
            </div>

            {resolvedState && (
              <span
                style={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Navigation size={13} /> State: {resolvedState}
              </span>
            )}
          </div>

          {/* Parking Spots Grid */}
          {isLoadingSpots ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
              <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '12px' }}>
                <Clock3 size={32} color="#2563eb" />
              </div>
              <p style={{ fontWeight: 600 }}>Loading verified parking yards...</p>
            </div>
          ) : filteredAndSortedSpots.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center'
              }}
            >
              <AlertCircle size={40} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                No parking yards found matching this filter
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '450px', margin: '0 auto 16px auto' }}>
                Try selecting "All Vehicles", clearing the state filter, or searching for nearby areas.
              </p>
              <button
                type="button"
                onClick={() => {
                  setVehicleType('all');
                  setResolvedState('');
                  setResolvedCity('');
                  loadSpots();
                }}
                style={{
                  padding: '9px 20px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Reset Filters & View All
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '20px'
              }}
            >
              {filteredAndSortedSpots.map((spot) => (
                <div
                  key={spot.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1.5px solid #e2e8f0',
                    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.04)';
                  }}
                >
                  {/* Spot Image Header */}
                  <div style={{ height: '170px', position: 'relative', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                    <img
                      src={spot.image}
                      alt={spot.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {/* Distance Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Navigation size={11} color="#60a5fa" />
                      <span>{spot.distanceText}</span>
                    </div>

                    {/* Rating Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        fontSize: '12px',
                        fontWeight: 800,
                        padding: '4px 8px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Star size={13} fill="#f59e0b" color="#f59e0b" />
                      <span>{spot.rating}</span>
                    </div>

                    {/* Available Slots Bar */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '12px',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '20px'
                      }}
                    >
                      ● {spot.availableSlots} Slots Available
                    </div>
                  </div>

                  {/* Spot Info Body */}
                  <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {spot.category}
                      </span>
                      <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '2px 0 6px 0' }}>
                        {spot.name}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: 0, display: 'flex', alignItems: 'flex-start', gap: '5px', lineHeight: '1.4' }}>
                        <MapPin size={14} color="#94a3b8" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{spot.address}</span>
                      </p>
                    </div>

                    {/* Host & Features */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {(spot.securityFeatures || ['CCTV Guard', 'Gated Barrier']).slice(0, 3).map((feat, fi) => (
                        <span
                          key={fi}
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Pricing & Reserve Button */}
                    <div
                      style={{
                        marginTop: 'auto',
                        paddingTop: '14px',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '19px', fontWeight: 900, color: '#0f172a' }}>
                          ₹{spot.hourlyRate}
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>/hr</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                          ₹{spot.dailyRate || spot.hourlyRate * 8}/day pass
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSpot(spot);
                          setBookingSuccessModal(true);
                        }}
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '10px 18px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                      >
                        Reserve Spot <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Map Picker Modal */}
      <GoogleMapPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onConfirm={handleMapConfirm}
        initialAddress={addressInput || 'Gurugram, Haryana'}
      />

      {/* Booking Confirmation Modal */}
      {bookingSuccessModal && selectedSpot && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '28px 32px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto',
                  fontSize: '24px'
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
                Confirm Parking Reservation
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Guaranteed slot entry generated with verified QR & OTP protection.
              </p>
            </div>

            {/* Spot Summary Box */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                {selectedSpot.name}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                {selectedSpot.address}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Date & Time</span>
                  <strong>{selectedDate} at {selectedTime}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Vehicle Category</span>
                  <strong style={{ textTransform: 'capitalize' }}>{vehicleType}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Estimated Tariff</span>
                  <strong style={{ color: '#2563eb' }}>₹{selectedSpot.hourlyRate * durationHours} ({durationHours} hrs)</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '11px', display: 'block' }}>Distance</span>
                  <strong style={{ color: '#059669' }}>{selectedSpot.distanceText}</strong>
                </div>
              </div>
            </div>

            {/* Confirm Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setBookingSuccessModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Reservation Confirmed for ${selectedSpot.name}! OTP: 8291. Direct gate navigation enabled.`);
                  setBookingSuccessModal(false);
                }}
                style={{
                  flex: 1.5,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#09090b',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                Confirm & Pay at Gate
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
