// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const ParkingMapClient = dynamic(() => import('./ParkingMapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#e2e8f0', color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
      <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Loading Live Parking Map...
    </div>
  )
});

export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  priceDisplay: string;
  pricePerHour: number;
  rating: number;
  reviewsCount: number;
  distance: string;
  host: string;
  features: string[];
  image: string;
  availableSlots: number;
  totalSlots: number;
  operatingHours: string;
}

const CITIES = [
  'Gurugram',
  'Delhi NCR',
  'Bengaluru',
  'Mumbai',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Trivandrum',
  'Kochi'
];

const VEHICLE_TYPES = [
  { id: 'bike', label: 'Bike / Scooter', icon: 'fa-motorcycle', baseRate: 20 },
  { id: 'car', label: 'Car / Jeep', icon: 'fa-car', baseRate: 50 },
  { id: 'bus', label: 'Bus', icon: 'fa-bus', baseRate: 150 },
  { id: 'minibus', label: 'Mini bus', icon: 'fa-van-shuttle', baseRate: 100 },
  { id: 'autorickshaw', label: 'Auto rickshaw', icon: 'fa-taxi', baseRate: 30 },
  { id: 'truck', label: 'Truck', icon: 'fa-truck', baseRate: 200 },
  { id: 'minitruck', label: 'Mini truck', icon: 'fa-truck-pickup', baseRate: 120 },
  { id: 'pickup', label: 'Pickup', icon: 'fa-truck-moving', baseRate: 90 }
];

const DURATION_PACKS = [
  { id: '1hr', hours: 1, label: '1 Hr', tag: 'Basic', discount: 0, saveText: '' },
  { id: '2hr', hours: 2, label: '2 Hrs', tag: '', discount: 4, saveText: 'Save ₹4' },
  { id: '4hr', hours: 4, label: '4 Hrs', tag: 'Best seller', discount: 22, saveText: 'Save ₹22' },
  { id: '6hr', hours: 6, label: '6 Hrs', tag: '', discount: 48, saveText: 'Save ₹48' },
  { id: '12hr', hours: 12, label: '12 Hrs', tag: 'Day pass', discount: 100, saveText: 'Save ₹100' },
  { id: '24hr', hours: 24, label: '24 Hrs', tag: 'Full day', discount: 220, saveText: 'Save ₹220' }
];

const MOCK_SPOTS_DATA: Record<string, ParkingSpot[]> = {
  default: [
    {
      id: 'spot-1',
      name: 'Mall of Travancore Parking',
      address: 'NH Bypass, Chacka, Trivandrum',
      lat: 8.4908,
      lng: 76.9246,
      pricePerHour: 50,
      priceDisplay: '₹50/hr',
      rating: 4.6,
      reviewsCount: 382,
      distance: '1.2 km away',
      host: 'Mall Management Corp',
      features: ['24 X 7 cctv', 'Security Guard', 'Free Wifi', 'Covered Roof', 'EV Charging', 'Refreshment'],
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400',
      availableSlots: 18,
      totalSlots: 60,
      operatingHours: '7:30 AM - 11:00 PM'
    },
    {
      id: 'spot-2',
      name: 'Central Metro Station Parking Plaza',
      address: 'Station Road, City Center',
      lat: 8.4985,
      lng: 76.9362,
      pricePerHour: 40,
      priceDisplay: '₹40/hr',
      rating: 4.4,
      reviewsCount: 512,
      distance: '2.5 km away',
      host: 'City Transit Authority',
      features: ['24 X 7 cctv', 'Security Guard', 'Fast Exit / Entry', 'Boom Barrier', 'Well-lit'],
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400',
      availableSlots: 7,
      totalSlots: 45,
      operatingHours: '24 Hours Open'
    },
    {
      id: 'spot-3',
      name: 'Lulu Cyber Park Basement Parking',
      address: 'Tech Corridor, IT Highway',
      lat: 8.5050,
      lng: 76.9180,
      pricePerHour: 60,
      priceDisplay: '₹60/hr',
      rating: 4.8,
      reviewsCount: 220,
      distance: '3.4 km away',
      host: 'Lulu Group Intl',
      features: ['24 X 7 cctv', 'Security Guard', 'Valet Assist', 'Free Wifi', 'Washroom', 'Refreshment'],
      image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400',
      availableSlots: 24,
      totalSlots: 100,
      operatingHours: '8:00 AM - 10:30 PM'
    },
    {
      id: 'spot-4',
      name: 'Greenpark Commercial Yard & Bays',
      address: 'Greenpark Drive, Outer Ring Road',
      lat: 8.4812,
      lng: 76.9410,
      pricePerHour: 35,
      priceDisplay: '₹35/hr',
      rating: 4.2,
      reviewsCount: 145,
      distance: '4.1 km away',
      host: 'Aaron Logistics Park',
      features: ['Wide space', 'Security Guard', 'Well-lit', 'Single-entry/exit'],
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400',
      availableSlots: 32,
      totalSlots: 80,
      operatingHours: '6:00 AM - Midnight'
    }
  ]
};

interface ParkingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ParkingBookingModal({ isOpen, onClose }: ParkingBookingModalProps) {
  // Navigation / Stepper State:
  // step 1: Search Form (Your city, Vehicle type, Vehicle number, Live Location Toggle)
  // step 2: Discovery Screen (Left cards wider ~65%, Right Map ~35%, Tabs: Recommended/Cheapest/Closest)
  // step 3: Duration / Details Screen (1hr, 2hr, 4hr, Check-in/out, Amenities, Operating Hours)
  // step 4: Checkout & Overstay/Time-exceeded Summary with dynamic pricing
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Inputs
  const [city, setCity] = useState('Gurugram');
  const [vehicleType, setVehicleType] = useState('car');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleModelName, setVehicleModelName] = useState('Grazia');
  const [isLiveLocationOn, setIsLiveLocationOn] = useState(false);
  const [liveLocationStatus, setLiveLocationStatus] = useState<string>('Live location off');
  const [userCoords, setUserCoords] = useState<[number, number]>([28.4595, 77.0266]); // default Gurugram coords

  // Discovery State
  const [filterTab, setFilterTab] = useState<'recommended' | 'cheapest' | 'closest'>('recommended');
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot>(MOCK_SPOTS_DATA.default[0]);

  // Duration / Booking Details State
  const [selectedDuration, setSelectedDuration] = useState('1hr');
  const [checkInTime, setCheckInTime] = useState('10:42 AM');
  const [checkInDate, setCheckInDate] = useState('16 Oct 2026');
  const [checkOutTime, setCheckOutTime] = useState('12:53 AM');
  const [checkOutDate, setCheckOutDate] = useState('16 Oct 2026');

  // Checkout / Leaving Time Tracker (Dynamic price based on duration + overtime)
  const [exceededMinutes, setExceededMinutes] = useState(20);
  const [paymentMethod, setPaymentMethod] = useState<'phonepe' | 'gpay' | 'card' | 'cash'>('phonepe');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Toggle Live Location
  const toggleLiveLocation = () => {
    if (!isLiveLocationOn) {
      setLiveLocationStatus('Acquiring GPS...');
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setUserCoords([lat, lng]);
            setIsLiveLocationOn(true);
            setLiveLocationStatus('Live GPS Active • Showing Available Slots Near You');
          },
          (err) => {
            // Fallback gracefully to default coordinates
            setIsLiveLocationOn(true);
            setLiveLocationStatus('Live GPS Active (Approximate Area)');
          },
          { timeout: 8000 }
        );
      } else {
        setIsLiveLocationOn(true);
        setLiveLocationStatus('Live GPS Active');
      }
    } else {
      setIsLiveLocationOn(false);
      setLiveLocationStatus('Live location off');
    }
  };

  // Adjust coordinates and spots when city changes
  useEffect(() => {
    if (city === 'Gurugram') setUserCoords([28.4595, 77.0266]);
    else if (city === 'Trivandrum') setUserCoords([8.4908, 76.9246]);
    else if (city === 'Bengaluru') setUserCoords([12.9716, 77.5946]);
    else if (city === 'Chennai') setUserCoords([13.0827, 80.2707]);
    else if (city === 'Mumbai') setUserCoords([19.0760, 72.8777]);
    else if (city === 'Hyderabad') setUserCoords([17.3850, 78.4867]);
  }, [city]);

  // Reset steps when closed
  const handleClose = () => {
    setStep(1);
    setCheckoutSuccess(false);
    setIsProcessingCheckout(false);
    onClose();
  };

  if (!isOpen) return null;

  // Selected vehicle multiplier
  const selectedVehicleObj = VEHICLE_TYPES.find(v => v.id === vehicleType) || VEHICLE_TYPES[1];
  const selectedDurationObj = DURATION_PACKS.find(d => d.id === selectedDuration) || DURATION_PACKS[0];

  // Price calculations
  const baseRate = selectedVehicleObj.baseRate;
  const rawSubtotal = baseRate * selectedDurationObj.hours;
  const discount = selectedDurationObj.discount;
  const parkingTotal = Math.max(10, rawSubtotal - discount);

  // Overtime calculations for Step 4
  const hourlyRate = baseRate;
  const overtimeAddon = exceededMinutes > 0 ? Math.ceil((exceededMinutes / 60) * hourlyRate) + 50 : 0;
  const taxesAndFees = Math.round((parkingTotal + overtimeAddon) * 0.18 * 100) / 100;
  const finalPayable = Math.round((parkingTotal + overtimeAddon + taxesAndFees) * 100) / 100;

  // Search click handler
  const handleStartSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleType) {
      alert('Please select your vehicle type');
      return;
    }
    // Proceed to Step 2
    setStep(2);
  };

  const spotsList = MOCK_SPOTS_DATA.default.map((spot) => {
    // dynamically scale prices based on selected vehicle
    const scaledPerHour = Math.round(spot.pricePerHour * (baseRate / 50));
    return {
      ...spot,
      pricePerHour: scaledPerHour,
      priceDisplay: `₹${scaledPerHour}/hr`
    };
  });

  return (
    <div
      className="modal-overlay open"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        overflow: 'hidden'
      }}
      onClick={handleClose}
    >
      <div
        className="modal-sheet centered-modal parking-booking-modal-sheet"
        style={{
          width: '100%',
          maxWidth: '100%',
          height: 'calc(100vh - 70px)',
          maxHeight: 'calc(100vh - 70px)',
          backgroundColor: '#f8fafc',
          borderRadius: '0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: 'none',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dummy div to absorb globals.css #tab-service-pages .modal-sheet>div:first-child rule */}
        <div style={{ display: 'none' }}></div>

        {/* Global Modal Header Bar */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
              }}
            >
              <i className="fa-solid fa-square-parking"></i>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                  Smart Parking & Spot Reservations
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '20px',
                    background: isLiveLocationOn ? '#ecfdf5' : '#fef3c7',
                    color: isLiveLocationOn ? '#059669' : '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: isLiveLocationOn ? '#10b981' : '#f59e0b',
                      display: 'inline-block'
                    }}
                  ></span>
                  {isLiveLocationOn ? 'LIVE RADAR ON' : 'GPS STANDBY'}
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Real-time parking spot discovery • Instant reservation • Automated exit timing billing
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Step navigation breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '16px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: step === 1 ? 800 : 600,
                  color: step === 1 ? '#059669' : '#94a3b8',
                  background: step === 1 ? '#ecfdf5' : 'transparent',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}
              >
                1. Vehicle & Location
              </span>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', color: '#cbd5e1' }}></i>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: step === 2 ? 800 : 600,
                  color: step === 2 ? '#059669' : '#94a3b8',
                  background: step === 2 ? '#ecfdf5' : 'transparent',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}
              >
                2. Live Spots & Map
              </span>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', color: '#cbd5e1' }}></i>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: step === 3 ? 800 : 600,
                  color: step === 3 ? '#059669' : '#94a3b8',
                  background: step === 3 ? '#ecfdf5' : 'transparent',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}
              >
                3. Timing & Pass
              </span>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px', color: '#cbd5e1' }}></i>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: step === 4 ? 800 : 600,
                  color: step === 4 ? '#059669' : '#94a3b8',
                  background: step === 4 ? '#ecfdf5' : 'transparent',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}
              >
                4. Leaving Checkout
              </span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                border: 'none',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '15px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e2e8f0';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* =========================================================================
            STEP 1: FIRST IMAGE UI (Your city, Vehicle type, Vehicle number, Search)
           ========================================================================= */}
        {step === 1 && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '36px 30px', background: '#f8fafc' }}>
            <div style={{ maxWidth: '1050px', margin: '0 auto' }}>

              {/* Top Navigation Tabs: Parking vs Subscription (Matches First Image) */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                <button
                  type="button"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px 10px 0 0',
                    border: '1px solid #e2e8f0',
                    borderBottom: 'none',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Parking
                </button>
                {/* <button
                  type="button"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px 10px 0 0',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#64748b',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Subscription
                </button> */}
              </div>

              {/* Main Search Filter Box (Matches First Image) */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
                  padding: '24px 28px',
                  marginBottom: '24px'
                }}
              >
                <form onSubmit={handleStartSearch}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 1.3fr 1.3fr auto',
                      gap: '18px',
                      alignItems: 'end'
                    }}
                  >
                    {/* Your City */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                        Your city
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '13px 16px',
                            borderRadius: '10px',
                            border: '1.5px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#0f172a',
                            outline: 'none',
                            cursor: 'pointer',
                            appearance: 'none'
                          }}
                        >
                          {CITIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <i className="fa-solid fa-chevron-down" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '12px', pointerEvents: 'none' }}></i>
                      </div>
                    </div>

                    {/* Vehicle Type Dropdown (Matches First Image exactly) */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                        Vehicle type
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={vehicleType}
                          onChange={(e) => setVehicleType(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '13px 16px',
                            borderRadius: '10px',
                            border: '1.5px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#0f172a',
                            outline: 'none',
                            cursor: 'pointer',
                            appearance: 'none'
                          }}
                        >
                          <option value="">Select</option>
                          <option value="bike">Bike / Scooter</option>
                          <option value="car">Car / Jeep</option>
                          <option value="bus">Bus</option>
                          <option value="minibus">Mini bus</option>
                          <option value="autorickshaw">Auto rickshaw</option>
                          <option value="truck">Truck</option>
                          <option value="minitruck">Mini truck</option>
                          <option value="pickup">Pickup</option>
                        </select>
                        <i className="fa-solid fa-chevron-down" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '12px', pointerEvents: 'none' }}></i>
                      </div>
                    </div>

                    {/* Vehicle Number (Last 4 digits / Plate number) */}
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                        Vehicle number
                      </label>
                      <input
                        type="text"
                        placeholder="Last 4 digits or Plate (e.g. 2324)"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '13px 16px',
                          borderRadius: '10px',
                          border: '1.5px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          fontSize: '14px',
                          color: '#0f172a',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* Search Button (Dark style from image) */}
                    <div>
                      <button
                        type="submit"
                        style={{
                          padding: '13px 36px',
                          backgroundColor: '#18181b',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '15px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#27272a'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#18181b'}
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Live Location Toggle Banner (Requested: When live location on, easily identify slots) */}
                  <div
                    style={{
                      marginTop: '20px',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      backgroundColor: isLiveLocationOn ? '#f0fdf4' : '#f8fafc',
                      border: isLiveLocationOn ? '1.5px solid #86efac' : '1px dashed #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: isLiveLocationOn ? '#22c55e' : '#e2e8f0',
                          color: isLiveLocationOn ? '#ffffff' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px'
                        }}
                      >
                        <i className={`fa-solid ${isLiveLocationOn ? 'fa-satellite-dish' : 'fa-location-dot'}`}></i>
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                          Enable Live Location Radar
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {liveLocationStatus}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleLiveLocation}
                      style={{
                        padding: '9px 18px',
                        borderRadius: '20px',
                        border: 'none',
                        backgroundColor: isLiveLocationOn ? '#15803d' : '#0284c7',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <i className={`fa-solid ${isLiveLocationOn ? 'fa-check' : 'fa-crosshairs'}`}></i>
                      {isLiveLocationOn ? 'Live Location ON' : 'Turn ON Live Location'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Value Proposition Section (Matches first image text: Why choose parknsure?) */}
              <div style={{ marginTop: '36px', padding: '0 8px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0' }}>
                  Why choose smart parking?
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', maxWidth: '850px', margin: '0 0 24px 0' }}>
                  At SART Parking, we are passionate about providing seamless, guaranteed parking spots that exceed our customers’ expectations.
                  Turn on live location to instantly detect available spots in your perimeter and pay strictly for the minutes you stay.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>
                      <i className="fa-solid fa-satellite-dish"></i>
                    </div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Live Radar Tracking</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Only shows lots with guaranteed open slots in real-time when GPS is active.</p>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Minute-Accurate Billing</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>If you leave earlier or exceed your slot, prices automatically calculate on exit.</p>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>
                      <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>24x7 Security & CCTV</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Gated barriers, verified attendants, and protected bays for all vehicle types.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: SECOND IMAGE UI (Discovery Screen: Left list WIDER, Map REDUCED)
            Matches user's second image layout with Airport/Hub selector, From-Until,
            Recommended/Cheapest/Closest tabs, list of parking cards, and live map!
           ========================================================================= */}
        {step === 2 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

            {/* Top Bar for Discovery Screen (Matches Second Image Top Controls) */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    border: 'none',
                    background: '#f1f5f9',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    color: '#334155',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i> Edit Vehicle / City
                </button>

                {/* Destination / Airport dropdown selector */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800 }}>Departure hub / City</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                    <span>{city} Airport & Commercial Hubs</span>
                    <i className="fa-solid fa-chevron-down" style={{ fontSize: '11px', color: '#94a3b8' }}></i>
                  </div>
                </div>

                {/* From / Until selector badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800 }}>From</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Today at 10:42 AM</span>
                  </div>
                  <i className="fa-solid fa-arrow-right" style={{ color: '#cbd5e1', fontSize: '12px' }}></i>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800 }}>Until</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Today at 12:53 PM</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Badge Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 14px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <i className={`fa-solid ${selectedVehicleObj.icon}`} style={{ color: '#059669' }}></i>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{selectedVehicleObj.label}</span>
                {vehicleNumber && (
                  <span style={{ fontSize: '12px', color: '#64748b', borderLeft: '1px solid #cbd5e1', paddingLeft: '8px' }}>
                    No: {vehicleNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Split Screen Container: LEFT SIDE WIDER (~62-65%), RIGHT SIDE MAP REDUCED (~35-38%) */}
            <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>

              {/* LEFT COLUMN: WIDER LIST OF PLACES */}
              <div
                style={{
                  flex: '1 1 63%',
                  overflowY: 'auto',
                  backgroundColor: '#ffffff',
                  borderRight: '1px solid #e2e8f0',
                  padding: '20px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {/* Filter Tabs: Recommended | Cheapest | Closest + Filters Pill */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <button
                      type="button"
                      onClick={() => setFilterTab('recommended')}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '6px 0',
                        fontSize: '15px',
                        fontWeight: filterTab === 'recommended' ? 900 : 600,
                        color: filterTab === 'recommended' ? '#059669' : '#64748b',
                        borderBottom: filterTab === 'recommended' ? '2.5px solid #059669' : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Recommended
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab('cheapest')}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '6px 0',
                        fontSize: '15px',
                        fontWeight: filterTab === 'cheapest' ? 900 : 600,
                        color: filterTab === 'cheapest' ? '#059669' : '#64748b',
                        borderBottom: filterTab === 'cheapest' ? '2.5px solid #059669' : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Cheapest
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab('closest')}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '6px 0',
                        fontSize: '15px',
                        fontWeight: filterTab === 'closest' ? 900 : 600,
                        color: filterTab === 'closest' ? '#059669' : '#64748b',
                        borderBottom: filterTab === 'closest' ? '2.5px solid #059669' : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Closest
                    </button>
                  </div>

                  <button
                    type="button"
                    style={{
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fa-solid fa-sliders"></i> Filters
                  </button>
                </div>

                {/* Spot Cards List (Matching Second Image styling) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {spotsList.map((spot) => {
                    const isSelected = selectedSpot.id === spot.id;
                    return (
                      <div
                        key={spot.id}
                        onClick={() => setSelectedSpot(spot)}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '16px',
                          border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                          boxShadow: isSelected ? '0 10px 25px -5px rgba(5, 150, 105, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                          padding: '18px 20px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'flex',
                          gap: '18px',
                          position: 'relative'
                        }}
                      >
                        {/* Spot Thumbnail / Icon */}
                        <div style={{ width: '110px', height: '100px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                          <img
                            src={spot.image}
                            alt={spot.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(15, 23, 42, 0.75)', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px' }}>
                            {spot.availableSlots} Open
                          </div>
                        </div>

                        {/* Middle Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div>
                              <h4 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                                {spot.name}
                              </h4>
                              <span style={{ fontSize: '12px', color: '#64748b' }}>
                                Hosted by {spot.host}
                              </span>
                            </div>
                            <button
                              type="button"
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px' }}
                              onClick={(e) => { e.stopPropagation(); alert('Saved to favorites'); }}
                            >
                              <i className="fa-regular fa-bookmark"></i>
                            </button>
                          </div>

                          {/* Pills for features (Single-entry/exit, Wide space, Well-lit) */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0' }}>
                            {spot.features.slice(0, 3).map((f, fi) => (
                              <span
                                key={fi}
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  backgroundColor: '#f1f5f9',
                                  color: '#334155',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <i className="fa-solid fa-check" style={{ fontSize: '9px', color: '#059669' }}></i> {f}
                              </span>
                            ))}
                          </div>

                          {/* Cancellation Note */}
                          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fa-solid fa-circle-check" style={{ fontSize: '11px' }}></i>
                            Cancel up to 24h before start (excl. fees)
                          </div>

                          {/* Bottom Row: Distance, Star rating, Price & Book */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f8fafc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: '#64748b' }}>
                              <span><i className="fa-solid fa-person-walking"></i> {spot.distance}</span>
                              <span style={{ fontWeight: 800, color: '#0f172a' }}>★ {spot.rating} ({spot.reviewsCount})</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Reserve for</span>
                                <span style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>{spot.priceDisplay}</span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSpot(spot);
                                  setStep(3); // Enter third image screen
                                }}
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: '10px',
                                  border: 'none',
                                  backgroundColor: '#059669',
                                  color: '#ffffff',
                                  fontSize: '13px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  boxShadow: '0 4px 10px rgba(5, 150, 105, 0.25)'
                                }}
                              >
                                Select Slot <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px' }}></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: MAP CONTAINER REDUCED (~37%) */}
              <div
                style={{
                  flex: '1 1 37%',
                  position: 'relative',
                  backgroundColor: '#e2e8f0',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                  <ParkingMapClient
                    vehicleIconClass={selectedVehicleObj.icon}
                    vehicleTitle={selectedVehicleObj.label}
                    searchQuery={city}
                    isSearched={true}
                    spots={spotsList}
                    selectedSpotId={selectedSpot.id}
                    onSelectSpot={(s) => setSelectedSpot(s)}
                    userCoords={userCoords}
                  />
                </div>

                {/* Floating Map Helper Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    zIndex: 1000,
                    background: '#ffffff',
                    padding: '8px 14px',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#0f172a'
                  }}
                >
                  <i className="fa-solid fa-layer-group" style={{ color: '#059669' }}></i>
                  Interactive Map • Tap pin to view rate
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: LAPTOP VIEW - PARKING DURATION & SPOT DETAILS
           ========================================================================= */}
        {step === 3 && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', background: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '1100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              {/* Top Navigation Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    color: '#334155',
                    fontSize: '14px',
                    fontWeight: 800,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i> Back to Live Spots
                </button>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>
                    Select Parking Duration &amp; Access Pass
                  </h2>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{selectedSpot.name} • {selectedSpot.address}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', padding: '6px 14px', borderRadius: '20px', color: '#059669', fontSize: '12px', fontWeight: 800 }}>
                  <i className="fa-solid fa-shield-check"></i> Spot Reserved
                </div>
              </div>

              {/* Laptop Split Container: Left Info / Amenities, Right Duration & Sticky Checkout */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: '28px',
                  alignItems: 'start'
                }}
              >
                {/* Left Laptop Panel: Spot overview, Vehicle, Amenities, Hours, Reviews */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}
                >
                  {/* Spot Header with Thumbnail */}
                  <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                    <img
                      src={selectedSpot.image}
                      alt={selectedSpot.name}
                      style={{ width: '90px', height: '80px', borderRadius: '14px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                          {selectedSpot.name}
                        </h3>
                        <span style={{ fontSize: '12px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '20px', fontWeight: 800 }}>
                          ★ {selectedSpot.rating} ({selectedSpot.reviewsCount})
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                        {selectedSpot.address} • Hosted by <strong>{selectedSpot.host}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                        <i className="fa-solid fa-circle-check"></i> {selectedSpot.availableSlots} bays currently open • Barrier Automated
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Row (Matches Screenshot: Grazia / Bike/Scooter) */}
                  <div
                    style={{
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '18px' }}>
                        <i className={`fa-solid ${selectedVehicleObj.icon}`}></i>
                      </div>
                      <div>
                        <h5 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                          {vehicleModelName} ({selectedVehicleObj.label})
                        </h5>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>
                          Registration: <strong>{vehicleNumber ? vehicleNumber : 'KL 01 AD 2324'}</strong>
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: '#059669', fontWeight: 800, background: '#dcfce7', padding: '4px 10px', borderRadius: '20px' }}>
                      FastTag Linked
                    </span>
                  </div>

                  {/* Amenities (2x2 grid from screenshot) */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                      Amenities &amp; Facilities
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', fontWeight: 600, background: '#f8fafc', padding: '10px 14px', borderRadius: '10px' }}>
                        <i className="fa-regular fa-eye" style={{ color: '#059669', fontSize: '16px' }}></i> 24 X 7 cctv surveillance
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', fontWeight: 600, background: '#f8fafc', padding: '10px 14px', borderRadius: '10px' }}>
                        <i className="fa-solid fa-user-shield" style={{ color: '#059669', fontSize: '16px' }}></i> Dedicated Security Guard
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', fontWeight: 600, background: '#f8fafc', padding: '10px 14px', borderRadius: '10px' }}>
                        <i className="fa-solid fa-wifi" style={{ color: '#059669', fontSize: '16px' }}></i> High-speed Free Wifi
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', fontWeight: 600, background: '#f8fafc', padding: '10px 14px', borderRadius: '10px' }}>
                        <i className="fa-solid fa-bottle-water" style={{ color: '#059669', fontSize: '16px' }}></i> Restroom &amp; Refreshment
                      </div>
                    </div>
                  </div>

                  {/* Operating Hours & Reviews */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Operating Hours</h4>
                      <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#16a34a', fontWeight: 800 }}>Open Today</span>
                        <span style={{ color: '#475569' }}>{selectedSpot.operatingHours}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Verified Reviews</h4>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textDecoration: 'underline', cursor: 'pointer' }}>See all {selectedSpot.reviewsCount}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                        98% positive check-in ratings
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Laptop Panel: Duration Packs, Check-in / Check-out, Pricing & Continue */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                    Choose Required Duration
                  </h4>

                  {/* Duration Packs Grid (1 Hr, 2 Hrs, 4 Hrs, 6 Hrs) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {DURATION_PACKS.slice(0, 4).map((pack) => {
                      const isSelected = selectedDuration === pack.id;
                      return (
                        <div
                          key={pack.id}
                          onClick={() => setSelectedDuration(pack.id)}
                          style={{
                            position: 'relative',
                            padding: '16px 12px',
                            borderRadius: '16px',
                            border: isSelected ? '2.5px solid #2563eb' : '1.5px solid #e2e8f0',
                            backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {pack.tag && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: '#16a34a',
                                color: '#ffffff',
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '10px',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {pack.tag}
                            </span>
                          )}
                          <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                            {pack.label}
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: pack.saveText ? '#16a34a' : '#64748b', marginTop: '2px' }}>
                            {pack.saveText || 'Basic'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Check-In / Check-Out Timestamps Box */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' }}>CHECK-IN</span>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{checkInTime}</div>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{checkInDate}</span>
                    </div>

                    <i className="fa-solid fa-chevron-right" style={{ color: '#cbd5e1', fontSize: '16px' }}></i>

                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px' }}>CHECK-OUT</span>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{checkOutTime}</div>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{checkOutDate}</span>
                    </div>

                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '16px' }}
                      onClick={() => alert('Adjust check-in/out times')}
                    >
                      <i className="fa-regular fa-pen-to-square"></i>
                    </button>
                  </div>

                  {/* Total Amount & Yellow Continue Button */}
                  <div
                    style={{
                      borderTop: '1px solid #e2e8f0',
                      paddingTop: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '20px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className={`fa-solid ${selectedVehicleObj.icon}`} style={{ color: '#64748b', fontSize: '13px' }}></i>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Total</span>
                        <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px' }}>
                          10% Off
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                        <span style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a' }}>
                          ₹{parkingTotal}.00
                        </span>
                        <span style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'line-through' }}>
                          ₹{parkingTotal + 10}.00
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      style={{
                        flex: 1,
                        padding: '16px 24px',
                        borderRadius: '14px',
                        border: 'none',
                        backgroundColor: '#facc15',
                        color: '#0f172a',
                        fontSize: '17px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(250, 204, 21, 0.45)',
                        transition: 'all 0.15s ease',
                        textAlign: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eab308'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#facc15'}
                    >
                      Continue to Checkout <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: LAPTOP VIEW - CHECKOUT & OVERSTAY EXIT BILLING
           ========================================================================= */}
        {step === 4 && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', background: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '1100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              {/* Top Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    color: '#334155',
                    fontSize: '14px',
                    fontWeight: 800,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i> Back to Duration
                </button>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>
                    Checkout &amp; Exit Clearance
                  </h2>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Automated gate barrier opens immediately upon payment</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fee2e2', padding: '6px 14px', borderRadius: '20px', color: '#dc2626', fontSize: '12px', fontWeight: 800 }}>
                  <i className="fa-solid fa-clock"></i> Live Overtime Billing
                </div>
              </div>

              {/* Red Exceeded Time Banner (Matches Screenshot across laptop width) */}
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  border: '1.5px solid #fecaca',
                  borderRadius: '16px',
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#dc2626'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#dc2626' }}>
                    <i className="fa-regular fa-clock"></i>
                  </div>
                  <div>
                    <span style={{ fontSize: '16px', fontWeight: 900 }}>
                      Your time exceeded by {exceededMinutes} min!
                    </span>
                    <div style={{ fontSize: '13px', color: '#b91c1c', marginTop: '2px' }}>
                      Additional overstay rate has been calculated and added to your exit clearance ticket.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#7f1d1d' }}>Simulate Exit Time:</span>
                  <button
                    type="button"
                    onClick={() => setExceededMinutes(Math.max(0, exceededMinutes - 10))}
                    style={{ background: '#ffffff', border: '1px solid #fca5a5', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', color: '#dc2626' }}
                  >
                    -10m
                  </button>
                  <button
                    type="button"
                    onClick={() => setExceededMinutes(exceededMinutes + 15)}
                    style={{ background: '#ffffff', border: '1px solid #fca5a5', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', color: '#dc2626' }}
                  >
                    +15m
                  </button>
                </div>
              </div>

              {/* Laptop Split Grid for Checkout: Left Details & Timestamps, Right Price Breakdown & Payment */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.1fr 1fr',
                  gap: '28px',
                  alignItems: 'start'
                }}
              >
                {/* Left Laptop Panel: Spot overview, Checkin/out times, Vehicle */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}
                >
                  {/* Spot Card Snapshot */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img
                      src={selectedSpot.image}
                      alt={selectedSpot.name}
                      style={{ width: '90px', height: '80px', borderRadius: '14px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                        {selectedSpot.name}
                      </h4>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>
                        {selectedSpot.address}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', fontSize: '13px' }}>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>★ {selectedSpot.rating}</span>
                        <span style={{ color: '#cbd5e1' }}>|</span>
                        <span style={{ color: '#64748b' }}>{selectedSpot.distance}</span>
                        <span style={{ color: '#cbd5e1' }}>|</span>
                        <span style={{ color: '#059669', fontWeight: 700 }}>Bay A-14</span>
                      </div>
                    </div>
                  </div>

                  {/* Check-In / Check-Out Summary */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      padding: '18px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 800, color: '#64748b', fontSize: '13px' }}>CHECK-IN :</span>
                        <span style={{ textDecoration: 'underline', fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                          {checkInDate}, {checkInTime}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800, background: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>Entry Logged</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 800, color: '#64748b', fontSize: '13px' }}>CHECK-OUT :</span>
                        <span style={{ textDecoration: 'underline', fontWeight: 800, color: '#dc2626', fontSize: '14px' }}>
                          {checkOutDate}, {checkOutTime}
                        </span>
                      </div>
                      <i className="fa-regular fa-pen-to-square" style={{ color: '#dc2626', cursor: 'pointer', fontSize: '16px' }}></i>
                    </div>
                  </div>

                  {/* Vehicle Details Card */}
                  <div
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '18px' }}>
                        <i className={`fa-solid ${selectedVehicleObj.icon}`}></i>
                      </div>
                      <div>
                        <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>Vehicle details</span>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                          {vehicleModelName} • <strong>{vehicleNumber || '7869'}</strong>
                        </div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-down" style={{ color: '#94a3b8', fontSize: '14px' }}></i>
                  </div>
                </div>

                {/* Right Laptop Panel: Detailed Invoice, Payment Gateway & Checkout Button */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                    Payment Breakdown &amp; Clearance
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#475569' }}>
                      <span>Base reserved parking ({selectedDurationObj.label})</span>
                      <span style={{ fontWeight: 700 }}>₹{parkingTotal}.00</span>
                    </div>

                    {exceededMinutes > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#dc2626', fontWeight: 800 }}>
                        <span>{exceededMinutes} min overstay add-on</span>
                        <span>₹{overtimeAddon}.00</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#64748b' }}>
                      <span>Taxes &amp; GST fees</span>
                      <span style={{ fontWeight: 600 }}>₹{taxesAndFees.toFixed(2)}</span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '2px solid #e2e8f0',
                        paddingTop: '16px',
                        marginTop: '6px'
                      }}
                    >
                      <span style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>Total amount</span>
                      <span style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>₹{finalPayable.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Method Selector (PhonePe, GPay, Card) */}
                  <div
                    style={{
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#f8fafc',
                      borderRadius: '14px',
                      padding: '14px 18px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'block' }}>Payment Method</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>PhonePe UPI Auto-Clear</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#5f259f',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '16px'
                        }}
                      >
                        पे
                      </div>
                      <i className="fa-solid fa-chevron-down" style={{ color: '#94a3b8', fontSize: '14px' }}></i>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  {checkoutSuccess ? (
                    <div
                      style={{
                        backgroundColor: '#ecfdf5',
                        border: '1.5px solid #10b981',
                        borderRadius: '16px',
                        padding: '20px',
                        textAlign: 'center',
                        color: '#065f46'
                      }}
                    >
                      <i className="fa-solid fa-circle-check" style={{ fontSize: '32px', color: '#10b981', marginBottom: '8px' }}></i>
                      <div style={{ fontSize: '18px', fontWeight: 900 }}>Exit Barrier Opened!</div>
                      <div style={{ fontSize: '13px', marginTop: '6px' }}>
                        Payment of ₹{finalPayable.toFixed(2)} received via PhonePe. Thank you for parking with SART.
                      </div>
                      <button
                        type="button"
                        onClick={handleClose}
                        style={{
                          marginTop: '16px',
                          padding: '10px 24px',
                          background: '#059669',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Done (Return Home)
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsProcessingCheckout(true);
                        setTimeout(() => {
                          setIsProcessingCheckout(false);
                          setCheckoutSuccess(true);
                          if ((window as any).executeGenericBooking) {
                            (window as any).executeGenericBooking(
                              'parking',
                              `Parking Exit: ${selectedSpot.name}`,
                              `${selectedVehicleObj.label} (${vehicleNumber || '7869'}) • Duration ${selectedDurationObj.hours}h + ${exceededMinutes}m`,
                              finalPayable,
                              { spot: selectedSpot.name, vehicle: selectedVehicleObj.label, number: vehicleNumber || '7869' }
                            );
                          }
                        }, 1200);
                      }}
                      disabled={isProcessingCheckout}
                      style={{
                        width: '100%',
                        padding: '18px',
                        borderRadius: '14px',
                        border: 'none',
                        backgroundColor: '#facc15',
                        color: '#0f172a',
                        fontSize: '18px',
                        fontWeight: 900,
                        cursor: isProcessingCheckout ? 'not-allowed' : 'pointer',
                        boxShadow: '0 6px 20px rgba(250, 204, 21, 0.45)',
                        transition: 'all 0.15s ease',
                        textAlign: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eab308'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#facc15'}
                    >
                      {isProcessingCheckout ? (
                        <span><i className="fa-solid fa-spinner fa-spin"></i> Processing Exit Barrier...</span>
                      ) : (
                        'Checkout & Clear Barrier'
                      )}
                    </button>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
