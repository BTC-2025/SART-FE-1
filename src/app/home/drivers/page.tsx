'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import GoogleMapPickerModal from '@/components/rental/GoogleMapPickerModal';
import {
  MapPin,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  ChevronDown,
  Navigation,
  Star,
  Shield,
  Phone,
  AlertCircle,
  Clock3
} from 'lucide-react';

export interface DriverFleetItem {
  id: string;
  name: string;
  image?: string;
  passportPhoto?: string;
  drivingExperienceYears?: string | number;
  dob?: string;
  gender?: string;
  eligibleVehicles?: string[];
  cannotDriveList?: string[];
  dlNumber?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  hub?: string;
  location?: string;
  address?: string;
  pincode?: string;
  plate?: string;
  regId?: string;
  phone?: string;
  mobile?: string;
  contactNumber?: string;
  rating?: number | string;
  tripCount?: number;
  baseCharge?: number;
  dailyRate?: number;
  outstationRate?: number;
  isAvailable?: boolean;
}

// Vehicle Categories matching user's Image exactly
const DRIVER_VEHICLE_CATEGORIES = [
  { id: 'bike', label: 'Bike (2W)', icon: 'fa-motorcycle', key: 'bike' },
  { id: 'car', label: 'Car / Sedan', icon: 'fa-car', key: 'car' },
  { id: 'commercial', label: 'Commercial / LCV', icon: 'fa-van-shuttle', key: 'commercial' },
  { id: 'truck6', label: '6-Wheeler Truck', icon: 'fa-truck', key: '6-wheeler' },
  { id: 'flight', label: 'Flight / Aircraft', icon: 'fa-plane', key: 'flight' },
  { id: 'truck8', label: '8-Wheeler Truck', icon: 'fa-truck-moving', key: '8-wheeler' },
  { id: 'ship', label: 'Ship / Maritime', icon: 'fa-ship', key: 'ship' },
  { id: 'truck10', label: '10-Wheeler Truck', icon: 'fa-truck-front', key: '10-wheeler' },
  { id: 'heavy_trailer', label: '12W+ Heavy Trailer', icon: 'fa-trailer', key: '12-wheeler' }
];

function DriversSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search Inputs - initialized blank or from query params
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-21');
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [duration, setDuration] = useState<string>('8 Hours (Full Day)');
  const [selectedCategory, setSelectedCategory] = useState<string>('bike');
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState<boolean>(false);

  // Helper to format date nicely: Sat, 21 Nov 2026
  const formattedDateTimeDisplay = useMemo(() => {
    try {
      const d = new Date(selectedDate);
      if (!isNaN(d.getTime())) {
        const dateStr = d.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        return `${dateStr} - ${selectedTime}`;
      }
    } catch (e) { }
    return `${selectedDate} - ${selectedTime}`;
  }, [selectedDate, selectedTime]);

  // Read URL search params
  useEffect(() => {
    if (!searchParams) return;
    const sourceParam = searchParams.get('source');
    if (sourceParam !== null) {
      setPickupLocation(sourceParam);
    }
    const vehicleParam = searchParams.get('vehicle');
    if (vehicleParam) {
      const matched = DRIVER_VEHICLE_CATEGORIES.find(c => c.id === vehicleParam || c.key === vehicleParam);
      if (matched) {
        setSelectedCategory(matched.id);
      }
    }
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setSelectedDate(dateParam);
    }
  }, [searchParams]);

  // Map Picker Modal
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  // Drivers Data
  const [drivers, setDrivers] = useState<DriverFleetItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<boolean>(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverFleetItem | null>(null);

  // Load Drivers strictly from backend APIs and shared persistence
  const loadDrivers = async () => {
    setIsLoading(true);
    let loaded: DriverFleetItem[] = [];

    const endpoints = [
      '/api/drivers',
      'http://localhost:5000/api/drivers',
      'http://localhost:3005/api/drivers'
    ];

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.drivers) && json.drivers.length > 0) {
            json.drivers.forEach((d: any) => {
              if (!loaded.some(item => item.id === d.id)) {
                loaded.push(d);
              }
            });
            break;
          }
        }
      } catch (e) { }
    }

    // Local storage fallback sync
    try {
      const stored = localStorage.getItem('sart_fleet_drivers');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach((d: any) => {
            if (!loaded.some(item => item.id === d.id)) {
              loaded.unshift(d);
            }
          });
        }
      }
    } catch (e) { }

    setDrivers(loaded);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  // Filter drivers based on selected vehicle category
  const filteredDrivers = useMemo(() => {
    if (!selectedCategory) return drivers;
    const catObj = DRIVER_VEHICLE_CATEGORIES.find(c => c.id === selectedCategory);
    if (!catObj) return drivers;

    return drivers.filter((d) => {
      if (!d.eligibleVehicles || d.eligibleVehicles.length === 0) return false;
      const key = catObj.key.toLowerCase();
      return d.eligibleVehicles.some((ev: string) => {
        const evLower = ev.toLowerCase();
        if (key === 'bike') return evLower.includes('bike') || evLower.includes('two');
        if (key === 'car') return evLower.includes('car') || evLower.includes('sedan') || evLower.includes('suv');
        if (key === 'commercial') return evLower.includes('commercial') || evLower.includes('lcv') || evLower.includes('van');
        if (key === '6-wheeler') return evLower.includes('6-wheeler') || evLower.includes('6 wheeler');
        if (key === '8-wheeler') return evLower.includes('8-wheeler') || evLower.includes('8 wheeler');
        if (key === '10-wheeler') return evLower.includes('10-wheeler') || evLower.includes('10 wheeler');
        if (key === '12-wheeler') return evLower.includes('12-wheeler') || evLower.includes('12 wheeler') || evLower.includes('trailer') || evLower.includes('multi-axle');
        if (key === 'flight') return evLower.includes('flight') || evLower.includes('aircraft') || evLower.includes('plane');
        if (key === 'ship') return evLower.includes('ship') || evLower.includes('maritime') || evLower.includes('vessel') || evLower.includes('boat');
        return false;
      });
    });
  }, [drivers, selectedCategory]);

  // Compute available counts for each category
  const getCategoryCount = (key: string) => {
    return drivers.filter(d => {
      if (!d.eligibleVehicles || d.eligibleVehicles.length === 0) return false;
      return d.eligibleVehicles.some((ev: string) => {
        const evLower = ev.toLowerCase();
        if (key === 'bike') return evLower.includes('bike') || evLower.includes('two');
        if (key === 'car') return evLower.includes('car') || evLower.includes('sedan') || evLower.includes('suv');
        if (key === 'commercial') return evLower.includes('commercial') || evLower.includes('lcv') || evLower.includes('van');
        if (key === '6-wheeler') return evLower.includes('6-wheeler') || evLower.includes('6 wheeler');
        if (key === '8-wheeler') return evLower.includes('8-wheeler') || evLower.includes('8 wheeler');
        if (key === '10-wheeler') return evLower.includes('10-wheeler') || evLower.includes('10 wheeler');
        if (key === '12-wheeler') return evLower.includes('12-wheeler') || evLower.includes('12 wheeler') || evLower.includes('trailer') || evLower.includes('multi-axle');
        if (key === 'flight') return evLower.includes('flight') || evLower.includes('aircraft') || evLower.includes('plane');
        if (key === 'ship') return evLower.includes('ship') || evLower.includes('maritime') || evLower.includes('vessel') || evLower.includes('boat');
        return false;
      });
    }).length;
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflowX: 'hidden' }}>
      <Navbar />
      <SubNavbar />

      <main style={{ flex: '1 0 auto', padding: '24px 20px 48px 20px', width: '100%' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* ================= 1. SEARCH BAR CONTAINER (EXACT IMAGE MATCH) ================= */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
              padding: '16px 20px',
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.6fr 1.3fr 1.1fr auto',
                gap: '16px',
                alignItems: 'center'
              }}
            >
              {/* Field 1: Pickup Location / Address */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  Pickup Location / Address
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '9px 12px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <MapPin size={16} color="#64748b" />
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Search address or area..."
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      width: '100%',
                      background: 'transparent'
                    }}
                  />
                  {pickupLocation && (
                    <button
                      type="button"
                      onClick={() => setPickupLocation('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '2px 4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Clear"
                    >
                      <i className="fa-solid fa-xmark" style={{ fontSize: '13px' }}></i>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ea580c',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Map
                  </button>
                </div>
              </div>

              {/* Field 2: Date & Time with Interactive Calendar & Time Picker */}
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  Date & Time
                </label>
                <div
                  onClick={() => setIsDateTimePickerOpen(!isDateTimePickerOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: isDateTimePickerOpen ? '1.5px solid #2563eb' : '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '9px 12px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: isDateTimePickerOpen ? '0 0 0 3px rgba(37, 99, 235, 0.12)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Calendar size={16} color="#64748b" />
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a', flex: 1, userSelect: 'none' }}>
                    {formattedDateTimeDisplay}
                  </span>
                  <Clock size={16} color="#64748b" />
                </div>

                {/* Dropdown Calendar & Time Selector Popover */}
                {isDateTimePickerOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      zIndex: 100,
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                      width: '280px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>Select Reporting Date & Time</span>
                      <button
                        type="button"
                        onClick={() => setIsDateTimePickerOpen(false)}
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Date Picker */}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Reporting Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1.5px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    {/* Time Picker */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                        Reporting Time
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1.5px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#0f172a',
                          backgroundColor: '#ffffff',
                          outline: 'none',
                          cursor: 'pointer',
                          boxSizing: 'border-box'
                        }}
                      >
                        {[
                          '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
                          '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
                          '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'
                        ].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsDateTimePickerOpen(false)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Field 3: Duration / Type */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  Duration / Type
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{
                      width: '100%',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '9px 12px',
                      paddingRight: '32px',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="4 Hours (Half Day)">4 Hours (Half Day)</option>
                    <option value="8 Hours (Full Day)">8 Hours (Full Day)</option>
                    <option value="12 Hours (Extended)">12 Hours (Extended)</option>
                    <option value="Round Trip (Outstation)">Round Trip (Outstation)</option>
                    <option value="Monthly Driver">Monthly Driver</option>
                  </select>
                  <ChevronDown size={16} color="#64748b" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Find Drivers Button (Orange / Red button matching image) */}
              <div style={{ paddingTop: '18px' }}>
                <button
                  type="button"
                  onClick={loadDrivers}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '11px 22px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c2410c')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ea580c')}
                >
                  <Search size={16} />
                  <span>Find Drivers &gt;</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= 2. VEHICLE CATEGORY SELECTOR PILLS (EXACT IMAGE MATCH) ================= */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              overflowX: 'auto',
              paddingTop: '16px',
              paddingBottom: '12px',
              marginBottom: '24px'
            }}
          >
            {DRIVER_VEHICLE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = getCategoryCount(cat.key);

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: '#ffffff',
                    border: isSelected ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '14px 18px',
                    cursor: 'pointer',
                    minWidth: 'fit-content',
                    boxShadow: isSelected ? '0 4px 14px rgba(37, 99, 235, 0.15)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Floating SELECTED Pill badge */}
                  {isSelected && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-11px',
                        right: '16px',
                        backgroundColor: '#1e3a8a',
                        color: '#ffffff',
                        fontSize: '10px',
                        fontWeight: 900,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        letterSpacing: '0.6px',
                        boxShadow: '0 2px 5px rgba(30, 58, 138, 0.3)',
                        zIndex: 2
                      }}
                    >
                      SELECTED
                    </span>
                  )}

                  {/* Icon */}
                  <i className={`fa-solid ${cat.icon}`} style={{ fontSize: '20px', color: isSelected ? '#2563eb' : '#475569' }}></i>

                  {/* Label & Available count */}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? '#1e3a8a' : '#1e293b', whiteSpace: 'nowrap' }}>
                      {cat.label}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      marginTop: '2px',
                      color: count > 0 ? '#16a34a' : '#dc2626'
                    }}>
                      {count > 0 ? `${count} Available` : 'Unavailable'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ================= 3. DRIVERS CARDS GRID (MATCHING BUSINESS OWNER FLEET CARD UI) ================= */}
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Verified Fleet Drivers ({filteredDrivers.length})
            </h3>
            <span style={{ fontSize: '12.5px', color: '#64748b' }}>
              Instant hiring with police clearance and Aadhaar KYC verification
            </span>
          </div>

          {isLoading ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
              <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '12px' }}>
                <Clock3 size={32} color="#2563eb" />
              </div>
              <p style={{ fontWeight: 600 }}>Loading verified drivers...</p>
            </div>
          ) : filteredDrivers.length === 0 ? (
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
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
                No verified drivers found for this category
              </h4>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '450px', margin: '0 auto 16px auto' }}>
                Try selecting "Car / Sedan" or "6-Wheeler Truck" to view available captain drivers.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory('car')}
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
                View Available Drivers
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))',
                gap: '20px',
                alignItems: 'stretch'
              }}
            >
              {filteredDrivers.map((driver) => {
                const driverPhoto = driver.image || driver.passportPhoto || '';
                const driverName = driver.name || '';
                const experience = driver.drivingExperienceYears ? `${driver.drivingExperienceYears} Years` : '8 Years';
                const age = driver.dob ? `${new Date().getFullYear() - new Date(driver.dob).getFullYear() || 34}` : '34';
                const gender = driver.gender || 'Male';

                let eligibleStr = '';
                if (Array.isArray(driver.eligibleVehicles) && driver.eligibleVehicles.length > 0) {
                  eligibleStr = driver.eligibleVehicles.map((v: string) => {
                    if (v.toLowerCase().includes('car')) return '🚗 Car, SUV';
                    if (v.toLowerCase().includes('sedan')) return '🚗 Sedan';
                    if (v.toLowerCase().includes('bike') || v.toLowerCase().includes('two')) return '🏍️ Bike';
                    if (v.toLowerCase().includes('commercial') || v.toLowerCase().includes('lcv')) return '🛻 Commercial LCV';
                    if (v.toLowerCase().includes('truck')) return '🚛 Truck';
                    return v;
                  }).join(', ');
                } else {
                  eligibleStr = '🚗 Car, SUV, 🚗 Sedan, 🏍️ Bike, 🛻 Commercial LCV';
                }

                const regId = driver.dlNumber || driver.plate || driver.regId || driver.id || 'DRV-3728HSH32938';
                const location = driver.hub || driver.location || driver.address || 'Katpadi, Vellore, Tamil Nadu';
                const mobileNumber = driver.phone || driver.mobile || driver.contactNumber || '+91 98765 43210';
                const rating = driver.rating || '4.9';
                const tripCount = driver.tripCount || 124;

                return (
                  <div
                    key={driver.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '20px 22px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    <div>
                      {/* Top Header: Avatar on left, Car icon on right */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                        {/* Driver Avatar with verified check badge */}
                        <div style={{ position: 'relative', width: '74px', height: '74px' }}>
                          <img
                            src={driverPhoto}
                            alt={driverName}
                            onError={(e) => {
                              e.currentTarget.src = '';
                            }}
                            style={{
                              width: '74px',
                              height: '74px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #e2e8f0',
                              display: 'block'
                            }}
                          />
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '0px',
                              right: '0px',
                              background: '#10b981',
                              color: '#ffffff',
                              borderRadius: '50%',
                              width: '22px',
                              height: '22px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px solid #ffffff',
                              fontSize: '11px',
                              fontWeight: 900
                            }}
                          >
                            ✓
                          </span>
                        </div>


                      </div>

                      {/* Driver Name & Tag Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '19px', fontWeight: 800, color: '#0f172a' }}>
                          {driverName.includes('(') ? driverName : `${driverName} (Captain)`}
                        </h4>
                        <span
                          style={{
                            background: '#eff6ff',
                            color: '#2563eb',
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 9px',
                            borderRadius: '6px',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase'
                          }}
                        >
                          CAR & BIKE DRIVER
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 800, color: '#d97706', marginLeft: 'auto' }}>
                          <span>★</span>
                          <span>{rating}</span>
                          <span style={{ color: '#92400e', fontWeight: 600 }}>({tripCount} trips)</span>
                        </div>
                      </div>

                      {/* Driver Meta Lines */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '13px', color: '#1e293b', marginBottom: '12px' }}>
                        <div>
                          <strong>Driving Experience:</strong> {experience} • <strong>Age:</strong> {age} • {gender}
                        </div>
                        <div>
                          <strong>Eligible Vehicles:</strong> {eligibleStr}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <strong>Documents Verified:</strong>
                          <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                            <span style={{ background: '#10b981', color: '#fff', borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>✓</span> DL,
                          </span>
                          <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                            <span style={{ background: '#10b981', color: '#fff', borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>✓</span> Aadhaar,
                          </span>
                          <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                            <span style={{ background: '#10b981', color: '#fff', borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>✓</span> PAN,
                          </span>
                          <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                            <span style={{ background: '#10b981', color: '#fff', borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>✓</span> Police Clearance
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <strong>Current Location:</strong>
                          <i className="fa-regular fa-compass" style={{ color: '#64748b', fontSize: '13px' }}></i>
                          <span>{location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <strong>Mobile Number:</strong>
                          <i className="fa-solid fa-phone" style={{ color: '#10b981', fontSize: '12px' }}></i>
                          <a
                            href={`tel:${mobileNumber.replace(/\s+/g, '')}`}
                            style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'none' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#0f172a')}
                          >
                            {mobileNumber}
                          </a>
                        </div>
                        <div>
                          <strong>ID / Reg:</strong> {regId}
                        </div>
                      </div>

                      {/* GPS Telematics Active Badge */}
                      <div style={{ marginBottom: '12px' }}>
                        <span
                          style={{
                            background: '#ecfdf5',
                            color: '#059669',
                            border: '1px solid #a7f3d0',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <i className="fa-solid fa-satellite-dish" style={{ fontSize: '11px' }}></i>
                          GPS Telematics Active
                        </span>
                      </div>

                      {/* Rate Card / Charges Box */}
                      <div
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '10px 14px',
                          marginBottom: '16px'
                        }}
                      >
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600, marginBottom: '2px' }}>
                          Rate Card / Charges:
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                          ₹{driver.baseCharge || 120}/hr | ₹{(driver.dailyRate || 1000).toLocaleString('en-IN')} (8 Hrs) | Outstation: ₹{(driver.outstationRate || 1800).toLocaleString('en-IN')}/day
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action: Instant Hire & Reserve Button */}
                    <div
                      style={{
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '4px 12px',
                          borderRadius: '20px',
                          background: driver.isAvailable !== false ? '#ecfdf5' : '#f1f5f9',
                          color: driver.isAvailable !== false ? '#059669' : '#64748b',
                          border: `1px solid ${driver.isAvailable !== false ? '#a7f3d0' : '#cbd5e1'}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <span
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: driver.isAvailable !== false ? '#10b981' : '#94a3b8'
                          }}
                        ></span>
                        {driver.isAvailable !== false ? 'Available Now' : 'On Trip'}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDriver(driver);
                          try {
                            localStorage.setItem('sart_selected_driver', JSON.stringify(driver));
                          } catch (e) { }
                          const q = new URLSearchParams({
                            driverId: driver.id,
                            driverName: driver.name,
                            category: selectedCategory,
                            pickup: pickupLocation,
                            date: selectedDate
                          }).toString();
                          router.push(`/home/drivers/Details?${q}`);
                        }}
                        style={{
                          backgroundColor: '#09090b',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '10px 20px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#27272a')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#09090b')}
                      >
                        Hire Driver Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Booking Confirmation Modal */}
          {bookingSuccessModal && selectedDriver && (
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
                  maxWidth: '500px',
                  width: '100%',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
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
                      margin: '0 auto 12px auto'
                    }}
                  >
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px 0' }}>
                    Confirm Driver Hiring
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    Captain will report to your location at the scheduled time.
                  </p>
                </div>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    {selectedDriver.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                    ID: {selectedDriver.dlNumber || selectedDriver.id}
                  </div>
                  <div style={{ fontSize: '13px', color: '#334155', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                    <div><strong>Pickup:</strong> {pickupLocation}</div>
                    <div><strong>Reporting:</strong> {selectedDate} at {selectedTime}</div>
                    <div><strong>Duty Duration:</strong> {duration}</div>
                    <div style={{ marginTop: '6px', color: '#2563eb', fontWeight: 800 }}>
                      Tariff: ₹{selectedDriver.dailyRate || 1000} (Standard Day Duty)
                    </div>
                  </div>
                </div>

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
                      alert(`Driver ${selectedDriver.name} booked successfully! OTP sent: 3918. Direct tracking enabled.`);
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
                      cursor: 'pointer'
                    }}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Map Picker Modal */}
          <GoogleMapPickerModal
            isOpen={isMapModalOpen}
            onClose={() => setIsMapModalOpen(false)}
            initialAddress={pickupLocation || ''}
            onConfirm={(addr) => {
              setPickupLocation(addr);
              setIsMapModalOpen(false);
            }}
          />

        </div>
      </main>

      {/* Global Bottom Footer */}
      <Footer />
    </div>
  );
}

export default function DriversSearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading drivers...</div>}>
      <DriversSearchContent />
    </Suspense>
  );
}
