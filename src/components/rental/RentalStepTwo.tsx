'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './RentalStepTwo.css';
import { RentalMasterCategory, RentalVehicle } from './rentalData';
import VehicleDetailModal from './VehicleDetailModal';

interface RentalStepTwoProps {
  activeMaster: RentalMasterCategory;
  pickup: string;
  setPickup?: (v: string) => void;
  pickupDate: string;
  dropoffDate: string;
  userLocationName: string;
  isLocating: boolean;
  setIsLocating: (v: boolean) => void;
  setUserLocationName: (v: string) => void;
  filterFuel: string;
  setFilterFuel: (v: string) => void;
  filterTransmission: string;
  setFilterTransmission: (v: string) => void;
  filterSeats: string;
  setFilterSeats: (v: string) => void;
  filterModelYear: string;
  setFilterModelYear: (v: string) => void;
  filterCategoryModel: string;
  setFilterCategoryModel: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  priceMin: number;
  setPriceMin: (v: number) => void;
  priceMax: number;
  setPriceMax: (v: number) => void;
  durationPlan: '1day' | '3days' | '1week' | '2weeks' | '1month' | 'custom';
  setDurationPlan: (v: '1day' | '3days' | '1week' | '2weeks' | '1month' | 'custom') => void;
  customDays: number;
  setCustomDays: React.Dispatch<React.SetStateAction<number>>;
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  handleBackToFleet: () => void;
  handleClose: () => void;
  setStep: (step: 1 | 2 | 3) => void;
}

export default function RentalStepTwo({
  activeMaster,
  pickup,
  setPickup,
  pickupDate,
  dropoffDate,
  userLocationName,
  isLocating,
  setIsLocating,
  setUserLocationName,
  filterFuel,
  setFilterFuel,
  filterTransmission,
  setFilterTransmission,
  filterSeats,
  setFilterSeats,
  filterModelYear,
  setFilterModelYear,
  filterCategoryModel,
  setFilterCategoryModel,
  sortBy,
  setSortBy,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  durationPlan,
  setDurationPlan,
  customDays,
  setCustomDays,
  selectedVehicleId,
  setSelectedVehicleId,
  handleBackToFleet,
  handleClose,
  setStep
}: RentalStepTwoProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [previewVehicle, setPreviewVehicle] = useState<RentalVehicle | null>(null);
  const [apiVehicles, setApiVehicles] = useState<RentalVehicle[]>([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [hasFetchedApi, setHasFetchedApi] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Live Location Reverse Geocoding: resolves exact user locality, mandal, city
  const detectLivePlaceName = () => {
    setIsDetecting(true);
    setIsLocating(true);

    if (typeof window === 'undefined' || !navigator.geolocation) {
      const fallback = (typeof window !== 'undefined' ? localStorage.getItem('sart_user_location') : null) || pickup || 'Katpadi, Vellore';
      setUserLocationName(fallback);
      setPickup?.(fallback);
      setIsDetecting(false);
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          // 1. Fast BigDataCloud Reverse Geocode (high performance, no CORS issues)
          const bdcRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          ).catch(() => null);

          if (bdcRes && bdcRes.ok) {
            const bdcData = await bdcRes.json();
            const locality = bdcData.locality || bdcData.city || bdcData.principalSubdivision;
            const city = bdcData.city || bdcData.localityInfo?.administrative?.[2]?.name || bdcData.principalSubdivision;
            let placeName = '';
            if (locality && city && locality !== city) {
              placeName = `${locality}, ${city}`;
            } else {
              placeName = locality || city || '';
            }

            if (placeName && placeName.trim() !== '') {
              setUserLocationName(placeName);
              setPickup?.(placeName);
              try {
                localStorage.setItem('sart_user_location', placeName);
                window.dispatchEvent(new CustomEvent('updateLocation', { detail: placeName }));
              } catch (e) { }
              setIsDetecting(false);
              setIsLocating(false);
              return;
            }
          }

          // 2. OpenStreetMap Nominatim reverse geocode fallback
          const osmRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          ).catch(() => null);

          if (osmRes && osmRes.ok) {
            const osmData = await osmRes.json();
            const addr = osmData.address || {};
            const placeNode = addr.suburb || addr.neighbourhood || addr.village || addr.hamlet || addr.residential || addr.town || addr.locality;
            const cityNode = addr.city || addr.town || addr.county || addr.state_district;
            let placeName = '';
            if (placeNode && cityNode && placeNode !== cityNode) {
              placeName = `${placeNode}, ${cityNode}`;
            } else {
              placeName = placeNode || cityNode || osmData.name || '';
            }

            if (placeName && placeName.trim() !== '') {
              setUserLocationName(placeName);
              setPickup?.(placeName);
              try {
                localStorage.setItem('sart_user_location', placeName);
                window.dispatchEvent(new CustomEvent('updateLocation', { detail: placeName }));
              } catch (e) { }
              setIsDetecting(false);
              setIsLocating(false);
              return;
            }
          }

          const fallback = localStorage.getItem('sart_user_location') || pickup || 'Katpadi, Vellore';
          setUserLocationName(fallback);
          setPickup?.(fallback);
        } catch (e) {
          const fallback = (typeof window !== 'undefined' ? localStorage.getItem('sart_user_location') : null) || pickup || 'Katpadi, Vellore';
          setUserLocationName(fallback);
          setPickup?.(fallback);
        } finally {
          setIsDetecting(false);
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or timed out:', err?.message);
        const fallback = (typeof window !== 'undefined' ? localStorage.getItem('sart_user_location') : null) || pickup || 'Katpadi, Vellore';
        setUserLocationName(fallback);
        setPickup?.(fallback);
        setIsDetecting(false);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  // Initialize or auto-detect on mount
  React.useEffect(() => {
    if (!userLocationName || userLocationName.trim() === '') {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('sart_user_location');
        if (stored && stored.trim() !== '') {
          setUserLocationName(stored);
          return;
        }
      }
      detectLivePlaceName();
    }
  }, []);

  // Check if current mode is live GPS / 10-20km range
  const isLiveGps = Boolean(
    isDetecting ||
    isLocating ||
    (pickup || '').toLowerCase().includes('current') ||
    (pickup || '').toLowerCase().includes('gps') ||
    (pickup || '').toLowerCase().includes('live') ||
    (userLocationName || '').toLowerCase().includes('current') ||
    (userLocationName || '').toLowerCase().includes('gps') ||
    (userLocationName || '').toLowerCase().includes('10-20')
  );

  // Fetch live rental vehicles from backend with Location awareness
  React.useEffect(() => {
    let isMounted = true;
    const fetchVehicles = async () => {
      setIsApiLoading(true);
      try {
        const targetLoc = (pickup || userLocationName || '').trim();
        const typeParam = activeMaster?.id || 'all';
        const qParams = new URLSearchParams();

        if (isLiveGps) {
          qParams.append('isGps', 'true');
          qParams.append('nearLive', 'true');
        } else if (targetLoc && targetLoc.toLowerCase() !== 'all' && targetLoc.toLowerCase() !== 'india' && targetLoc.toLowerCase() !== 'all locations' && targetLoc.toLowerCase() !== '') {
          qParams.append('location', targetLoc);
        }

        if (typeParam && typeParam !== 'all') {
          qParams.append('type', typeParam);
        }

        // Scope strictly to user-facing available vehicles
        qParams.append('scope', 'user');
        qParams.append('availableOnly', 'true');

        // Query Next.js internal proxy API first (CORS-free), then Express API port 5000
        let res = await fetch(`/api/rental/vehicles?${qParams.toString()}`).catch(() => null);
        if (!res || !res.ok) {
          res = await fetch(`http://localhost:5000/api/rental/vehicles?${qParams.toString()}`).catch(() => null);
        }

        let apiList: any[] = [];
        if (res && res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            apiList = json.data;
          }
        }

        // Fallback: If filtered location query returned 0 results, load all available fleet vehicles
        if (apiList.length === 0) {
          let fbRes = await fetch('/api/rental/vehicles').catch(() => null);
          if (!fbRes || !fbRes.ok) {
            fbRes = await fetch('http://localhost:5000/api/rental/vehicles').catch(() => null);
          }
          if (fbRes && fbRes.ok) {
            const fbJson = await fbRes.json();
            if (fbJson && fbJson.success && Array.isArray(fbJson.data)) {
              apiList = fbJson.data;
            }
          }
        }

        // Merge with local storage business fleet
        let storedFleet: any[] = [];
        try {
          storedFleet = JSON.parse(localStorage.getItem('sart_business_fleet') || '[]');
        } catch (e) { }

        // Start with apiList
        const map = new Map<string, any>();
        apiList.forEach((v: any) => {
          if (v && v.id) {
            const isBike = (v.type === 'bike') || /bike|scooter|scooty|cruiser|bullet|classic|hunter|himalayan|activa|r15|pulsar|ola|ather|jupiter|tvs|ktm|royal enfield/i.test(`${v.name || ''} ${v.brand || ''} ${v.category || ''}`);
            const rate = Number(v.price ?? v.dailyRate ?? 1800);
            map.set(v.id, {
              ...v,
              type: isBike ? 'bike' : (v.type || 'car'),
              price: rate,
              dailyRate: rate
            });
          }
        });

        // Let storedFleet override or augment apiList
        storedFleet.forEach((v: any) => {
          if (v && v.id) {
            const isBike = (v.type === 'bike') || /bike|scooter|scooty|cruiser|bullet|classic|hunter|himalayan|activa|r15|pulsar|ola|ather|jupiter|tvs|ktm|royal enfield/i.test(`${v.name || ''} ${v.brand || ''} ${v.category || ''}`);
            const rate = Number(v.price ?? v.dailyRate ?? 1800);
            const normalized = {
              ...v,
              type: isBike ? 'bike' : (v.type || 'car'),
              price: rate,
              dailyRate: rate
            };

            const existingKey = Array.from(map.keys()).find(
              k => k === v.id || (v.plate && map.get(k)?.plate && String(map.get(k).plate).toLowerCase() === String(v.plate).toLowerCase())
            );
            if (existingKey) {
              map.set(existingKey, { ...map.get(existingKey), ...normalized });
            } else {
              map.set(v.id, normalized);
            }
          }
        });

        const combinedList = Array.from(map.values());

        if (isMounted) {
          setApiVehicles(combinedList);
          setHasFetchedApi(true);
        }
      } catch (e) {
        console.warn('API error, using fallback catalog');
      } finally {
        if (isMounted) setIsApiLoading(false);
      }
    };

    fetchVehicles();

    const handleStorageChange = () => fetchVehicles();
    const interval = setInterval(fetchVehicles, 3000);
    window.addEventListener('focus', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rental_vehicle_added', handleStorageChange);
    window.addEventListener('rental_vehicle_updated', handleStorageChange);
    window.addEventListener('rental_vehicle_deleted', handleStorageChange);
    window.addEventListener('update_vehicle_availability', handleStorageChange);
    window.addEventListener('rental_trip_completed', handleStorageChange);
    window.addEventListener('rental_vehicle_booked', handleStorageChange);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rental_vehicle_added', handleStorageChange);
      window.removeEventListener('rental_vehicle_updated', handleStorageChange);
      window.removeEventListener('rental_vehicle_deleted', handleStorageChange);
      window.removeEventListener('update_vehicle_availability', handleStorageChange);
      window.removeEventListener('rental_trip_completed', handleStorageChange);
      window.removeEventListener('rental_vehicle_booked', handleStorageChange);
    };
  }, [pickup, userLocationName, activeMaster?.id, isLiveGps]);

  // Use API vehicles if loaded and non-empty; fallback gracefully to activeMaster catalog.
  // Stage 2 Visibility Rule: Filter out any vehicle where isAvailable is false, ALREADY_BOOKED, ON_TRIP, in onTripIds, or in deletedIds
  const isVehicleUnavailable = (v: any) => {
    if (!v) return true;
    if (v.isAvailable === false || v.isAvailable === 0) return true;
    if (v.bookingStatus === 'ALREADY_BOOKED' || v.bookingStatus === 'ON_TRIP') return true;
    if (v.status === 'On Trip' || v.status === 'Not Available') return true;
    return false;
  };

  const MOCK_VEHICLE_IDS = [
    'r-swift', 'r-creta', 'r-thar', 'r-innova', 'r-ertiga', 'r-nexon', 'r-baleno', 'r-fortuner', 'r-scorpio', 'r-xuv700', 'r-city',
    'r-classic350', 'r-hunter350', 'r-himalayan', 'r-activa', 'r-jupiter', 'r-pulsar', 'r-r15',
    'VH-001', 'VH-002', 'VH-003', 'VH-004', 'VH-005', 'VH-006', 'VH-007', 'VH-008', 'VH-009', 'VH-010',
    'VH-101', 'VH-102', 'VH-103', 'VH-0160', 'VH-KAT-001', 'VH-KAT-002', 'VH-KAT-003', 'VH-KAT-004', 'VH-KAT-005'
  ];

  // Only show vehicles actually fetched from backend or added by partner in business portal
  let baseList: any[] = [...apiVehicles].filter((v: any) => v && !MOCK_VEHICLE_IDS.includes(v.id) && !MOCK_VEHICLE_IDS.includes(v.plate));

  try {
    const rawStored = localStorage.getItem('sart_business_fleet');
    const storedFleet: any[] = JSON.parse(rawStored || '[]');
    if (Array.isArray(storedFleet) && storedFleet.length > 0) {
      // Filter out any mock vehicles from stored fleet
      const cleanStored = storedFleet.filter(
        (sf: any) => sf && !MOCK_VEHICLE_IDS.includes(sf.id) && !MOCK_VEHICLE_IDS.includes(sf.plate)
      );
      const fMap = new Map(baseList.map((v: any) => [v.id, v]));
      cleanStored.forEach((sf: any) => {
        const isBike = (sf.type === 'bike') || /bike|scooter|scooty|cruiser|bullet|classic|hunter|himalayan|activa|r15|pulsar|ola|ather|jupiter|tvs|ktm|royal enfield/i.test(`${sf.name || ''} ${sf.brand || ''} ${sf.category || ''}`);
        const rate = Number(sf.price ?? sf.dailyRate ?? 1800);
        const normalized = {
          ...sf,
          type: isBike ? 'bike' : (sf.type || 'car'),
          price: rate,
          dailyRate: rate
        };

        const matchKey = Array.from(fMap.keys()).find(
          k => k === sf.id || (sf.plate && fMap.get(k)?.plate && String(fMap.get(k).plate).toLowerCase() === String(sf.plate).toLowerCase())
        );
        if (matchKey) {
          fMap.set(matchKey, { ...fMap.get(matchKey), ...normalized });
        } else {
          fMap.set(sf.id, normalized);
        }
      });
      baseList = Array.from(fMap.values());
    }
  } catch (e) { }

  // Filter baseList by current page category (Bike vs Car vs All)
  const currentCategoryType = activeMaster?.id;
  if (currentCategoryType && currentCategoryType !== 'all') {
    baseList = baseList.filter((v: any) => {
      const isBike = (v.type === 'bike') || /bike|scooter|scooty|cruiser|bullet|classic|hunter|himalayan|activa|r15|pulsar|ola|ather|jupiter|tvs|ktm|royal enfield/i.test(`${v.name || ''} ${v.brand || ''} ${v.category || ''}`);
      if (currentCategoryType === 'bike') return isBike;
      if (currentCategoryType === 'car') return !isBike;
      return true;
    });
  }

  let list: any[] = baseList.filter((v: any) => !isVehicleUnavailable(v) && !MOCK_VEHICLE_IDS.includes(v.id));

  // Distance calculation based on mode:
  // When in Live GPS mode: enforce deterministic distances in 10-20 km range
  // When in City Hub mode (e.g. Katpadi): show local hub distances (1-5 km)
  if (isLiveGps) {
    const userLocLabel = userLocationName || pickup || 'Current Location';
    list = list.map((v: any, idx: number) => {
      const kmVal = Number((10.5 + ((idx * 2.7 + 1.2) % 9.2)).toFixed(1));
      return {
        ...v,
        distance: `${kmVal} km from ${userLocLabel}`,
        distanceKm: kmVal
      };
    });
  } else {
    const userLocLabel = userLocationName || pickup || 'Katpadi';
    list = list.map((v: any, idx: number) => {
      const kmVal = v.distanceKm && v.distanceKm < 10 ? v.distanceKm : Number((1.2 + ((idx * 0.9 + 0.4) % 4.2)).toFixed(1));
      return {
        ...v,
        distance: `${kmVal} km from ${userLocLabel}`,
        distanceKm: kmVal
      };
    });
  }

  if (filterFuel !== 'ALL') {
    list = list.filter((v: any) => v.fuel === filterFuel);
  }

  if (filterTransmission !== 'ALL') {
    list = list.filter((v: any) => v.transmission === filterTransmission);
  }

  if (filterSeats !== 'ALL') {
    if (filterSeats === '2') list = list.filter((v: any) => v.seats?.includes('2'));
    else if (filterSeats === '5') list = list.filter((v: any) => v.seats?.includes('5'));
    else if (filterSeats === '7') list = list.filter((v: any) => v.seats?.includes('7'));
    else if (filterSeats === '12') list = list.filter((v: any) => v.seats?.includes('12') || v.seats?.includes('16') || v.seats?.includes('24'));
  }

  if (filterCategoryModel !== 'ALL') {
    list = list.filter((v: any) => v.name.toLowerCase().includes(filterCategoryModel.toLowerCase()));
  }

  if (filterModelYear !== 'ALL') {
    const currentYr = 2026;
    if (filterModelYear === 'Under 3 years') {
      list = list.filter((v: any) => (currentYr - (v.year || 2023)) <= 3);
    } else if (filterModelYear === 'Under 5 years') {
      list = list.filter((v: any) => (currentYr - (v.year || 2023)) <= 5);
    } else if (filterModelYear === 'Under 7 years') {
      list = list.filter((v: any) => (currentYr - (v.year || 2023)) <= 7);
    }
  }

  // Price adjustment filter
  if (priceMax > 0) {
    list = list.filter((v: any) => {
      const p = Number(v.price ?? v.dailyRate ?? 1800);
      return p >= priceMin && p <= priceMax;
    });
  }

  if (sortBy === 'price_low') {
    list.sort((a: any, b: any) => a.price - b.price);
  } else if (sortBy === 'price_high') {
    list.sort((a: any, b: any) => b.price - a.price);
  } else if (sortBy === 'newest') {
    list.sort((a: any, b: any) => (b.year || 2023) - (a.year || 2023));
  }

  const totalDays = durationPlan === '1day' ? 1
    : durationPlan === '3days' ? 3
      : durationPlan === '1week' ? 7
        : durationPlan === '2weeks' ? 14
          : durationPlan === '1month' ? 30
            : (customDays || 1);

  const durationLabel = durationPlan === '1day' ? '1 Day'
    : durationPlan === '3days' ? '3 Days'
      : durationPlan === '1week' ? '1 Week'
        : durationPlan === '2weeks' ? '2 Weeks'
          : durationPlan === '1month' ? '1 Month'
            : `${totalDays} Days`;

  // Pagination for Vehicle Cards Grid: 2 rows of 2 columns (4 cards max per page)
  const CARS_PER_PAGE = 4;
  const totalPages = Math.ceil(list.length / CARS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * CARS_PER_PAGE;
  const paginatedList = list.slice(startIndex, startIndex + CARS_PER_PAGE);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#f8fafc' }}>
      {/* Top Navigation & Hub Bar */}
      <div style={{ padding: '14px 24px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={handleBackToFleet}
            style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Back to Search"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              Self-drive cars, bikes and scooties across India
            </h2>

          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={detectLivePlaceName}
            disabled={isDetecting || isLocating}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              border: '1.5px solid #0284c7',
              background: (isDetecting || isLocating) ? '#e0f2fe' : '#ffffff',
              color: '#0284c7',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 3px rgba(2, 132, 199, 0.1)',
              transition: 'all 0.15s ease'
            }}
            title="Detect live user location place name and nearby 10-20 km vehicles"
          >
            {isDetecting || isLocating ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" style={{ color: '#0284c7' }}></i>
                <span>Detecting Place...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-location-arrow" style={{ color: '#0284c7' }}></i>
                <span>Use My GPS Location</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Filter Sidebar */}
        <div style={{ width: '280px', background: '#ffffff', borderRight: '1px solid #e2e8f0', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-sliders" style={{ color: '#0284c7' }}></i>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Filters</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setFilterFuel('ALL');
                setFilterTransmission('ALL');
                setFilterSeats('ALL');
                setFilterModelYear('ALL');
                setFilterCategoryModel('ALL');
                setPriceMax(15000);
              }}
              style={{ background: 'transparent', border: 'none', color: '#0284c7', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
            >
              Reset All
            </button>
          </div>

          {/* What Are You Looking For Search */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              What Are You Looking For
            </span>
            <div style={{ position: 'relative' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '13px' }}></i>
              <input
                type="text"
                placeholder="Search make, model, or type"
                value={filterCategoryModel === 'ALL' ? '' : filterCategoryModel}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilterCategoryModel(val ? val : 'ALL');
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12.5px',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                  background: '#f8fafc'
                }}
              />
            </div>
          </div>

          {/* Vehicle Category: All | Cars | Bikes */}
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Vehicle Category
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'car', label: 'Cars' },
                { id: 'bike', label: 'Bikes' }
              ].map(cat => {
                const isActive = (cat.id === 'all' && (activeMaster?.id !== 'car' && activeMaster?.id !== 'bike')) || activeMaster?.id === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (cat.id === 'car' || cat.id === 'bike') {
                        const target = cat.id;
                        router.push(`/home/rental/${target === 'car' ? 'Car' : 'Bike'}`);
                      } else {
                        router.push(`/home/rental`);
                      }
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '8px',
                      border: isActive ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      background: isActive ? '#2563eb' : '#ffffff',
                      color: isActive ? '#ffffff' : '#334155',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rental Duration Plan Selector */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-regular fa-clock" style={{ color: '#0284c7' }}></i> Rental Duration Plan
              </span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7' }}>
                {durationPlan === '1day' ? '1 Day' : durationPlan === '3days' ? '3 Days' : durationPlan === '1week' ? '1 Week (7 Days)' : durationPlan === '2weeks' ? '2 Weeks (14 Days)' : durationPlan === '1month' ? '1 Month (30 Days)' : `${customDays} Days`}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {[
                { id: '1day' as const, label: '1 Day', days: 1 },
                { id: '3days' as const, label: '3 Days', days: 3 },
                { id: '1week' as const, label: '1 Week', days: 7 },
                { id: '2weeks' as const, label: '2 Weeks', days: 14 },
                { id: '1month' as const, label: '1 Month', days: 30 },
                { id: 'custom' as const, label: 'Custom', days: customDays }
              ].map(dp => (
                <button
                  key={dp.id}
                  type="button"
                  onClick={() => {
                    setDurationPlan(dp.id);
                    if (dp.id !== 'custom') {
                      setCustomDays(dp.days);
                    }
                  }}
                  style={{
                    padding: '6px 4px',
                    borderRadius: '8px',
                    border: durationPlan === dp.id ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                    background: durationPlan === dp.id ? '#0284c7' : '#ffffff',
                    color: durationPlan === dp.id ? '#ffffff' : '#334155',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {dp.label}
                </button>
              ))}
            </div>

            {durationPlan === 'custom' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px dashed #cbd5e1' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Number of Days:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setCustomDays((d: number) => Math.max(1, d - 1))}
                    style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 800 }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', minWidth: '20px', textAlign: 'center' }}>
                    {customDays}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomDays((d: number) => d + 1)}
                    style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 800 }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            <span style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic' }}>
              Vehicle price auto-calculates based on this duration.
            </span>
          </div>

          {/* Popular Brands */}
          {(() => {
            const isBikeMode = activeMaster?.id === 'bike';
            const brandsList = isBikeMode
              ? ['All', 'Royal Enfield', 'Yamaha', 'Honda', 'Bajaj', 'Ola']
              : ['All', 'Tata', 'Maruti Suzuki', 'Hyundai', 'Mahindra', 'Toyota'];

            return (
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <i className="fa-solid fa-tag" style={{ color: '#64748b' }}></i> Popular Brands
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {brandsList.map(b => {
                    const isSelected = (b === 'All' && filterCategoryModel === 'ALL') || filterCategoryModel.toLowerCase() === b.toLowerCase();
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setFilterCategoryModel(b === 'All' ? 'ALL' : b);
                          setCurrentPage(1);
                        }}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '20px',
                          border: isSelected ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          color: isSelected ? '#1d4ed8' : '#475569',
                          fontSize: '11.5px',
                          fontWeight: isSelected ? 800 : 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Popular Models - Dynamically derived from actual added vehicles in fleet */}
          {(() => {
            const isBikeMode = activeMaster?.id === 'bike';
            const allLabel = isBikeMode ? 'All Bikes' : 'All Models';

            // Dynamically derive models ONLY from vehicles that actually exist in baseList and have images
            const addedModelsMap = new Map<string, { id: string; name: string; count: string; img: string }>();

            baseList.forEach((v: any) => {
              const isBike = (v.type === 'bike') || /bike|scooter|scooty|cruiser|bullet|classic|hunter|himalayan|activa|r15|pulsar|ola|ather|jupiter|tvs|ktm|royal enfield/i.test(`${v.name || ''} ${v.brand || ''} ${v.category || ''}`);
              if (isBikeMode && !isBike) return;
              if (!isBikeMode && isBike) return;

              // Only include if vehicle has an image
              const vehicleImage = v.image || (v.images && v.images[0]);
              if (!vehicleImage) return;

              const modelKey = (v.model || v.name || '').trim();
              if (modelKey && !addedModelsMap.has(modelKey.toLowerCase())) {
                addedModelsMap.set(modelKey.toLowerCase(), {
                  id: modelKey,
                  name: v.name || modelKey,
                  count: 'Available',
                  img: vehicleImage
                });
              }
            });

            const addedModels = Array.from(addedModelsMap.values());
            const modelsList = [
              { id: 'ALL', name: allLabel, count: `${addedModels.length > 0 ? addedModels.length + '+' : '0'}`, img: '' },
              ...addedModels
            ];

            return (
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <i className={`fa-solid ${isBikeMode ? 'fa-motorcycle' : 'fa-car-rear'}`} style={{ color: '#64748b' }}></i> Popular Models
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {modelsList.map(m => {
                    const isSelected = (m.id === 'ALL' && filterCategoryModel === 'ALL') || filterCategoryModel.toLowerCase().includes(m.id.toLowerCase());
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          setFilterCategoryModel(m.id === 'ALL' ? 'ALL' : m.id);
                          setCurrentPage(1);
                        }}
                        style={{
                          border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none',
                          transition: 'all 0.15s ease',
                          minHeight: '74px'
                        }}
                      >
                        {m.count && (
                          <span style={{ fontSize: '9px', fontWeight: 800, color: '#b45309', background: '#fef3c7', padding: '1px 6px', borderRadius: '4px', marginBottom: '4px' }}>
                            {m.count}
                          </span>
                        )}
                        {m.img ? (
                          <img
                            src={m.img}
                            alt={m.name}
                            onError={(e) => {
                              // If image fails to load, gracefully hide img element so placeholder text shows
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                            style={{ width: '64px', height: '36px', objectFit: 'contain', borderRadius: '4px' }}
                          />
                        ) : (
                          <span style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? '#1d4ed8' : '#2563eb', padding: '4px 0' }}>
                            {m.name}
                          </span>
                        )}
                        {m.img && (
                          <span style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? '#1d4ed8' : '#1e293b', textAlign: 'center', marginTop: '3px' }}>
                            {m.name}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Fuel Type */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <i className="fa-solid fa-gas-pump" style={{ color: '#64748b' }}></i> Fuel Type
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {['ALL', 'Petrol', 'Diesel', 'CNG', 'Electric'].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterFuel(f)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: filterFuel === f ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    background: filterFuel === f ? '#e0f2fe' : '#ffffff',
                    color: filterFuel === f ? '#0369a1' : '#475569',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {f === 'ALL' ? 'All Fuels' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <i className="fa-solid fa-gear" style={{ color: '#64748b' }}></i> Transmission
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {['ALL', 'Manual', 'Automatic'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterTransmission(t)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: filterTransmission === t ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    background: filterTransmission === t ? '#e0f2fe' : '#ffffff',
                    color: filterTransmission === t ? '#0369a1' : '#475569',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {t === 'ALL' ? 'Any' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Adjustment */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-indian-rupee-sign" style={{ color: '#0284c7' }}></i> Daily Price Limit
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7' }}>
                Up to ₹{priceMax}
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={15000}
              step={100}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
              <span>₹300/day</span>
              <span>₹15,000/day</span>
            </div>
          </div>

          {/* Seating Capacity */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <i className="fa-solid fa-users" style={{ color: '#64748b' }}></i> Seating Capacity
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {[
                { id: 'ALL', label: 'All Seats' },
                { id: '2', label: '2 Seats (Bikes)' },
                { id: '5', label: '4-5 Seats' },
                { id: '7', label: '6-7 Seats' },
                { id: '12', label: '12-24 Seats' }
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFilterSeats(s.id)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: filterSeats === s.id ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    background: filterSeats === s.id ? '#e0f2fe' : '#ffffff',
                    color: filterSeats === s.id ? '#0369a1' : '#475569',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Model Year */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <i className="fa-regular fa-calendar" style={{ color: '#64748b' }}></i> Model Year
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {['ALL', 'Under 3 years', 'Under 5 years', 'Under 7 years'].map(y => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setFilterModelYear(y)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '8px',
                    border: filterModelYear === y ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    background: filterModelYear === y ? '#e0f2fe' : '#ffffff',
                    color: filterModelYear === y ? '#0369a1' : '#475569',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {y === 'ALL' ? 'Any Year' : y}
                </button>
              ))}
            </div>
          </div>
          {/* Apply Filters Big Blue Button from Image 2 */}
          <div style={{ marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#2563eb'; }}
            >
              <i className="fa-solid fa-filter"></i> Apply Filters
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>


          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>Sort By:</span>
              {[
                { id: 'near_first', label: 'Near first', icon: 'fa-location-dot' },
                { id: 'top_rated', label: 'Top rated', icon: 'fa-thumbs-up' },
                { id: 'price_low', label: 'Price: low to high', icon: 'fa-arrow-trend-up' },
                { id: 'price_high', label: 'Price: high to low', icon: 'fa-arrow-trend-down' },
                { id: 'newest', label: 'Newest first', icon: 'fa-star' }
              ].map(sb => (
                <button
                  key={sb.id}
                  type="button"
                  onClick={() => setSortBy(sb.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: sortBy === sb.id ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    background: sortBy === sb.id ? '#0284c7' : '#ffffff',
                    color: sortBy === sb.id ? '#ffffff' : '#475569',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <i className={`fa-solid ${sb.icon}`} style={{ fontSize: '10px' }}></i>
                  {sb.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setFilterFuel('ALL');
                setFilterTransmission('ALL');
                setFilterSeats('ALL');
                setFilterModelYear('ALL');
                setFilterCategoryModel('ALL');
                setSortBy('near_first');
              }}
              style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Clear All <i className="fa-solid fa-rotate-right" style={{ fontSize: '10px' }}></i>
            </button>
          </div>

          {list.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
              <i className="fa-solid fa-car-side" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '12px' }}></i>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>No vehicles available in fleet</h4>
              <p style={{ margin: 0, fontSize: '13px' }}>Vehicles added by the rental owner in the Business Portal will appear here.</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {paginatedList.map((v: RentalVehicle) => {
                  const isSelected = selectedVehicleId === v.id;
                  const hourlyRateDisplay = v.hourlyRate || (v.price && v.price < 1000 ? v.price : Math.round((v.price || 2200) / 10));

                  return (
                    <div
                      key={v.id}
                      onClick={() => {
                        setSelectedVehicleId(v.id);
                        if (handleClose) handleClose();
                        const currentLoc = pickup || userLocationName || 'Katpadi';
                        const isBike = activeMaster?.id === 'bike' || (v as any).vehicleType === 'bike' || (v as any).type === 'bike';
                        const targetPath = isBike
                          ? `/home/rental/Bike/BookingDeliveryDetails?id=${encodeURIComponent(v.id)}&pickup=${encodeURIComponent(currentLoc)}`
                          : `/home/rental/Car/CarDetails?id=${encodeURIComponent(v.id)}&pickup=${encodeURIComponent(currentLoc)}`;
                        router.push(targetPath);
                      }}
                      style={{
                        background: '#ffffff',
                        border: isSelected ? '2px solid #0284c7' : '1px solid #eef2f6',
                        borderRadius: '22px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(15, 23, 42, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.04)';
                      }}
                    >
                      {/* Top Image Frame with Star Rating & Heart Favorite (Image 1 UI - Full Bleed) */}
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '220px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: '#f1f5f9'
                      }}>
                        {/* Rating badge with star on top-left */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(4px)',
                          borderRadius: '20px',
                          padding: '4px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#1e293b',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                          zIndex: 2
                        }}>
                          <i className="fa-solid fa-star" style={{ color: '#f59e0b', fontSize: '11px' }}></i>
                          <span>{(v as any).rating || 4.8}</span>
                        </div>

                        {/* Favorite Heart Button on top-right */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(v.id);
                          }}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.92)',
                            backdropFilter: 'blur(4px)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                            zIndex: 2,
                            transition: 'transform 0.15s ease'
                          }}
                          title="Add to favorites"
                        >
                          <i
                            className={`fa-${favorites[v.id] ? 'solid' : 'regular'} fa-heart`}
                            style={{ color: favorites[v.id] ? '#ef4444' : '#64748b', fontSize: '15px' }}
                          ></i>
                        </button>

                        {/* Vehicle Image full-cover fitting the card header */}
                        <img
                          src={v.image || '/images/cab_sedan.png'}
                          alt={v.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                          onError={(e: any) => {
                            e.target.src = (v as any).vehicleType === 'bike' ? '/images/red_bike_3d.png' : '/images/cab_sedan.png';
                          }}
                        />
                      </div>

                      {/* Content Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {/* Category Pill on Left */}
                        <div>
                          <span style={{
                            background: '#e0f2fe',
                            color: '#0284c7',
                            borderRadius: '6px',
                            padding: '3px 10px',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'inline-block'
                          }}>
                            {v.category || ((v as any).vehicleType === 'bike' ? 'Cruiser' : 'Compact SUV')}
                          </span>
                        </div>

                        {/* Title & Price in Same Row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <h3 style={{
                            margin: 0,
                            fontSize: '17px',
                            fontWeight: 800,
                            color: '#0f172a',
                            lineHeight: 1.3
                          }}>
                            {v.name}
                          </h3>
                          <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <span style={{ fontSize: '18px', fontWeight: 800, color: '#0284c7' }}>
                              ₹{hourlyRateDisplay}
                            </span>
                            <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '3px', fontWeight: 500 }}>
                              /hr
                            </span>
                          </div>
                        </div>

                        {/* Reg No & Location Line */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#475569' }}>
                          <div style={{ fontWeight: 600 }}>
                            Reg No: {v.plate || (v.name.includes('Alphard') ? 'MH 12 TA 7007' : v.name.includes('Verna') ? 'TN 23 BK 4567' : 'TN 23 YT 3264')}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', lineHeight: 1.35, color: '#64748b' }}>
                            <i className="fa-solid fa-location-dot" style={{ marginTop: '2px', fontSize: '11px', color: '#64748b', flexShrink: 0 }}></i>
                            <span>{v.location || (userLocationName ? `${userLocationName}` : 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India')}</span>
                          </div>
                        </div>

                        {/* Specifications Row: Transmission, Fuel, Seats */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 0',
                          borderTop: '1px solid #f1f5f9',
                          marginTop: '4px'
                        }}>
                          {/* Transmission */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>
                            <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '14px' }}>H</span>
                            <span>{v.transmission || 'Manual'}</span>
                          </div>

                          <span style={{ color: '#cbd5e1' }}>•</span>

                          {/* Fuel */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>
                            <i className="fa-solid fa-gas-pump" style={{ color: '#0284c7', fontSize: '13px' }}></i>
                            <span>{v.fuel || 'Petrol'}</span>
                          </div>

                          <span style={{ color: '#cbd5e1' }}>•</span>

                          {/* Seats */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>
                            <i className="fa-solid fa-user" style={{ color: '#0284c7', fontSize: '13px' }}></i>
                            <span>{v.seats || '5-Seater'}</span>
                          </div>
                        </div>

                        {/* Bottom Footer Row: Availability Pill (Left) & Book Now Button (Right) */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '4px'
                        }}>
                          <span style={{
                            background: '#ecfdf5',
                            color: '#059669',
                            padding: '5px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span style={{ fontSize: '10px', color: '#10b981' }}>●</span> Available
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVehicleId(v.id);
                              if (handleClose) handleClose();
                              const currentLoc = pickup || userLocationName || 'Katpadi';
                              const isBike = activeMaster?.id === 'bike' || (v as any).vehicleType === 'bike' || (v as any).type === 'bike';
                              const targetPath = isBike
                                ? `/home/rental/Bike/BookingDeliveryDetails?id=${encodeURIComponent(v.id)}&pickup=${encodeURIComponent(currentLoc)}`
                                : `/home/rental/Car/CarDetails?id=${encodeURIComponent(v.id)}&pickup=${encodeURIComponent(currentLoc)}`;
                              router.push(targetPath);
                            }}
                            style={{
                              background: '#2563eb',
                              color: '#ffffff',
                              border: 'none',
                              padding: '8px 22px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#1d4ed8'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#2563eb'; }}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls: Only shown if more than 4 vehicles (> 2 rows of 2 columns) */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '32px', padding: '16px 0' }}>
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      color: currentPage <= 1 ? '#94a3b8' : '#0f172a',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNo => (
                    <button
                      key={pageNo}
                      type="button"
                      onClick={() => setCurrentPage(pageNo)}
                      style={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: currentPage === pageNo ? '#f8fafc' : '#ffffff',
                        border: currentPage === pageNo ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
                        borderRadius: '4px',
                        color: '#0f172a',
                        fontSize: '15px',
                        fontWeight: currentPage === pageNo ? 800 : 600,
                        cursor: 'pointer'
                      }}
                    >
                      {pageNo}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      color: currentPage >= totalPages ? '#94a3b8' : '#0f172a',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Specification Details Modal (Image 2) */}
      <VehicleDetailModal
        vehicle={previewVehicle}
        isOpen={Boolean(previewVehicle)}
        onClose={() => setPreviewVehicle(null)}
        onBookNow={(veh) => {
          setSelectedVehicleId(veh.id);
          setStep(3);
        }}
        totalDays={totalDays}
        durationLabel={durationLabel}
        pickupLocation={pickup}
      />
    </div>
  );
}

