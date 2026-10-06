'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const LiveTrackerMap = dynamic(
  () => import('./LeafletMapClient'),
  { ssr: false }
);

// Step 1: Master Categories
const MASTER_CATEGORIES = [
  { id: 'bike', name: 'Bike', icon: 'fa-motorcycle', color: '#ff6b6b', type: 'ROAD' },
  { id: 'auto', name: 'Auto', icon: 'fa-taxi', color: '#f59e0b', type: 'ROAD' },
  { id: 'car', name: 'Car / Sedan', icon: 'fa-car', color: '#3b82f6', type: 'ROAD' },
  { id: 'suv', name: 'SUV & Multi-Utility', icon: 'fa-truck-pickup', color: '#ec4899', type: 'ROAD' },
  { id: 'bus', name: 'Bus & Minivan', icon: 'fa-bus', color: '#8b5cf6', type: 'ROAD' },
  { id: 'boat', name: 'Boat & Speedboat', icon: 'fa-ship', color: '#0ea5e9', type: 'SEA' },
  { id: 'yacht', name: 'Yacht & Cruise', icon: 'fa-anchor', color: '#0369a1', type: 'SEA' },
  { id: 'flight', name: 'Charter Flight', icon: 'fa-plane', color: '#8b5cf6', type: 'AIR' },
  { id: 'heli', name: 'Helicopter', icon: 'fa-helicopter', color: '#10b981', type: 'AIR' },
  { id: 'train', name: 'Express Train', icon: 'fa-train', color: '#eab308', type: 'RAIL' }
];

// Base rates per KM for dynamic pricing
const VEHICLE_DATABASE: Record<string, any[]> = {
  'bike': [
    { id: 'pedal', name: 'Pedal Bicycle', icon: 'fa-bicycle', color: '#14b8a6', ratePerKm: 5, capacity: 1, luggage: 0, time: '2 mins' },
    { id: 'moto', name: 'Bike / Moto', icon: 'fa-motorcycle', color: '#ff6b6b', ratePerKm: 12, capacity: 1, luggage: 1, time: '5 mins' },
    { id: 'escooter', name: 'Electric Scooter', icon: 'fa-bolt', color: '#10b981', ratePerKm: 8, capacity: 1, luggage: 0, time: '3 mins' }
  ],
  'auto': [
    { id: 'auto-std', name: 'Standard Auto', icon: 'fa-taxi', color: '#f59e0b', ratePerKm: 18, capacity: 3, luggage: 2, time: '4 mins' },
    { id: 'e-rickshaw', name: 'E-Rickshaw', icon: 'fa-leaf', color: '#34d399', ratePerKm: 15, capacity: 4, luggage: 2, time: '1 min' }
  ],
  'car': [
    { id: 'mini', name: 'Mini Hatchback', icon: 'fa-car-side', color: '#3b82f6', ratePerKm: 22, capacity: 4, luggage: 2, time: '6 mins' },
    { id: 'sedan', name: 'Premium Sedan', icon: 'fa-car', color: '#2563eb', ratePerKm: 28, capacity: 4, luggage: 3, time: '8 mins' },
    { id: 'exec', name: 'Executive Luxury', icon: 'fa-gem', color: '#8b5cf6', ratePerKm: 55, capacity: 4, luggage: 3, time: '12 mins' }
  ],
  'suv': [
    { id: 'suv-std', name: 'Standard SUV', icon: 'fa-truck-pickup', color: '#ec4899', ratePerKm: 35, capacity: 6, luggage: 4, time: '10 mins' },
    { id: 'suv-prem', name: 'Premium SUV XL', icon: 'fa-crown', color: '#eab308', ratePerKm: 45, capacity: 7, luggage: 5, time: '15 mins' }
  ],
  'bus': [
    { id: 'minivan', name: 'Traveller', icon: 'fa-shuttle-van', color: '#14b8a6', ratePerKm: 60, capacity: 12, luggage: 8, time: '30 mins' },
    { id: 'bus-std', name: 'Standard Bus', icon: 'fa-bus', color: '#8b5cf6', ratePerKm: 120, capacity: 40, luggage: 20, time: '45 mins' }
  ],
  'boat': [
    { id: 'speedboat', name: 'Speedboat', icon: 'fa-ship', color: '#0ea5e9', ratePerKm: 150, capacity: 6, luggage: 2, time: '10 mins' },
    { id: 'ferry', name: 'Ferry Pass', icon: 'fa-ferry', color: '#0284c7', ratePerKm: 25, capacity: 50, luggage: 10, time: 'Scheduled' }
  ],
  'yacht': [
    { id: 'yacht-small', name: 'Small Yacht', icon: 'fa-anchor', color: '#0369a1', ratePerKm: 500, capacity: 15, luggage: 10, time: 'Charter' }
  ],
  'flight': [
    { id: 'lightjet', name: 'Light Private Jet', icon: 'fa-plane', color: '#8b5cf6', ratePerKm: 2500, capacity: 6, luggage: 6, time: 'Charter' }
  ],
  'heli': [
    { id: 'heli-std', name: 'Charter Helicopter', icon: 'fa-helicopter', color: '#10b981', ratePerKm: 1200, capacity: 4, luggage: 2, time: 'Charter' }
  ],
  'train': [
    { id: 'express', name: 'Express Train Ticket', icon: 'fa-train', color: '#eab308', ratePerKm: 15, capacity: 1, luggage: 2, time: 'Scheduled' }
  ]
};

export default function RideBookingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'ROAD' | 'SEA' | 'AIR' | 'RAIL'>('ALL');
  
  // Search Form State
  const [tripType, setTripType] = useState('One Way');
  const [scheduleType, setScheduleType] = useState('Now');
  const [pickup, setPickup] = useState('Chennai Central');
  const [stops, setStops] = useState<string[]>([]);
  const [dropoff, setDropoff] = useState('Chennai International Airport');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  
  // Data State
  const [relatedVehicles, setRelatedVehicles] = useState<any[]>([]);
  const [selectedMasterId, setSelectedMasterId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  
  // Payment & Offers
  const [paymentType, setPaymentType] = useState('Cash');
  const [offerApplied, setOfferApplied] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  
  // UI Interaction States
  const [isSearching, setIsSearching] = useState(false);
  const [isFindingDriver, setIsFindingDriver] = useState(false);
  const [isDriverFound, setIsDriverFound] = useState(false);
  const [showLocationList, setShowLocationList] = useState(false);
  const [showDropoffList, setShowDropoffList] = useState(false);

  const INDIAN_CITIES = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Vellore', 'Erode', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Kolkata', 'Kochi', 'Thiruvananthapuram', 'Mysuru'];
  
  const getFilteredCities = (input: string) => {
    const term = input.toLowerCase();
    const match = INDIAN_CITIES.find(c => c.toLowerCase().startsWith(term));
    return match || (input.charAt(0).toUpperCase() + input.slice(1));
  };
  
  // Dynamic Distance (base + stops + string length simulation)
  const getSimulatedDistance = () => {
    let base = 15 + (stops.length * 5);
    if (pickup && dropoff) {
      base += Math.abs(pickup.length - dropoff.length) * 2 + (pickup.length % 5) * 3;
    }
    return base;
  };
  const estimatedDistance = getSimulatedDistance();

  React.useEffect(() => {
    let timer: any;
    if (isFindingDriver && !isDriverFound) {
      timer = setTimeout(() => {
        setIsFindingDriver(false);
        setIsDriverFound(true);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isFindingDriver, isDriverFound]);

  React.useEffect(() => {
    const handleReset = () => setStep(1);
    
    const handleUrlState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/home/rides/')) {
        const masterId = decodeURIComponent(path.split('/rides/')[1]).toLowerCase();
        if (masterId) {
          const foundMaster = MASTER_CATEGORIES.find(m => m.name.toLowerCase().includes(masterId) || m.id === masterId);
          if (foundMaster) {
            setSelectedMasterId(foundMaster.id);
            const vehicles = VEHICLE_DATABASE[foundMaster.id] || VEHICLE_DATABASE['car'];
            setRelatedVehicles(vehicles);
            if (vehicles.length > 0 && !selectedVehicleId) setSelectedVehicleId(vehicles[0].id);
            setStep(2);
            return;
          }
        }
      }
      if (path === '/home/ride') {
        setStep(1);
      }
      if (path === '/' || path === '/home') {
        const { useSartStore } = require('@/store/useSartStore');
        useSartStore.getState().setActiveTab('home');
      }
    };

    window.addEventListener('resetModalSteps', handleReset);
    window.addEventListener('popstate', handleUrlState);

    if (isOpen) {
      handleUrlState();
    }

    return () => {
      window.removeEventListener('resetModalSteps', handleReset);
      window.removeEventListener('popstate', handleUrlState);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const updateUrl = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', path);
    }
  };

  const handleSelectMasterCategory = (master: any) => {
    setSelectedMasterId(master.id);
    const vehicles = VEHICLE_DATABASE[master.id] || VEHICLE_DATABASE['car'];
    setRelatedVehicles(vehicles);
    if (vehicles.length > 0) setSelectedVehicleId(vehicles[0].id);
    setPickup('');
    setDropoff('');
    setStops([]);
    setStep(2);
    updateUrl(`/home/rides/${encodeURIComponent(master.id)}`);
  };

  const handleBackToFleet = () => {
    setStep(1);
    updateUrl('/home/ride');
  };

  const handleClose = () => {
    setStep(1);
    updateUrl('/');
    onClose();
  };

  const handleFinalBook = () => {
    const v = relatedVehicles.find(v => v.id === selectedVehicleId);
    if (!v) return;
    
    let finalPrice = Math.max(v.basePrice || 0, (v.ratePerKm || 10) * estimatedDistance);
    if (offerApplied) finalPrice = Math.floor(finalPrice * 0.8); // 20% off

    const timeStr = scheduleType === 'Now' ? 'Now' : `${pickupDate} ${pickupTime}`;
    const subtitle = `${v.name} • ${tripType} • ${timeStr} • Paid via ${paymentType}`;
    if ((window as any).executeGenericBooking) {
      (window as any).executeGenericBooking('ride', `Ride: ${pickup} to ${dropoff}`, subtitle, finalPrice, { from: pickup, to: dropoff, date: pickupDate, time: pickupTime });
    }
    handleClose();
  };

  const displayedMasters = activeCategory === 'ALL' 
    ? MASTER_CATEGORIES 
    : MASTER_CATEGORIES.filter(m => m.type === activeCategory);

  const selectedMaster = MASTER_CATEGORIES.find(m => m.id === selectedMasterId) || MASTER_CATEGORIES[0];
  const mode = selectedMaster?.type || 'ROAD';

  let pickupLabel = 'Pickup Location';
  let dropoffLabel = 'Drop Location';
  let stopLabel = 'Add Stop';

  if (mode === 'AIR') {
    pickupLabel = 'Departure Airport / Helipad';
    dropoffLabel = 'Arrival Airport / Helipad';
    stopLabel = 'Add Layover';
  } else if (mode === 'SEA') {
    pickupLabel = 'Departure Port / Pier';
    dropoffLabel = 'Arrival Port / Pier';
    stopLabel = 'Add Port of Call';
  } else if (mode === 'RAIL') {
    pickupLabel = 'Departure Station';
    dropoffLabel = 'Arrival Station';
    stopLabel = 'Add Station Stop';
  }

  const selectedVehicle = relatedVehicles.find(v => v.id === selectedVehicleId) || relatedVehicles[0];
  let currentFinalPrice = selectedVehicle ? Math.max(selectedVehicle.basePrice || 0, (selectedVehicle.ratePerKm || 10) * estimatedDistance) : 0;
  if (offerApplied) currentFinalPrice = Math.floor(currentFinalPrice * 0.8);

  return (
    <div className="modal-overlay open" style={{ display: 'flex', zIndex: 1000, background: 'rgba(0,0,0,0.6)' }} onClick={handleClose}>
      <div className="modal-sheet centered-modal" style={{ maxWidth: step === 2 ? '1200px' : '900px', width: '95%', height: step === 2 ? '90vh' : '80vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb', borderRadius: step === 2 ? '16px' : '24px', overflow: 'hidden', transition: 'max-width 0.3s ease, height 0.3s ease' }} onClick={e => e.stopPropagation()}>
        
        <div className="hack-absorber" style={{ display: 'none' }}></div>

        {/* ================= STEP 1: SELECT MASTER CATEGORY ================= */}
        {step === 1 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fa-solid fa-car-side" style={{ color: '#3b82f6' }}></i> Ride Booking
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#ffffff' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {[
                  { id: 'ALL', label: 'All Fleet', icon: 'fa-globe', color: '#f59e0b' },
                  { id: 'ROAD', label: 'Road', icon: 'fa-car', color: '#3b82f6' },
                  { id: 'SEA', label: 'Sea & Water', icon: 'fa-ship', color: '#0ea5e9' },
                  { id: 'AIR', label: 'Air Charters', icon: 'fa-plane', color: '#8b5cf6' },
                  { id: 'RAIL', label: 'Train & Rail', icon: 'fa-train', color: '#10b981' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                      borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '700',
                      background: activeCategory === cat.id ? cat.color : '#f3f4f6',
                      color: activeCategory === cat.id ? '#ffffff' : '#4b5563',
                      transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                    }}
                  >
                    <i className={`fa-solid ${cat.icon}`}></i> {cat.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px' }}>
                {displayedMasters.map(m => (
                  <div 
                    key={m.id} 
                    onClick={() => handleSelectMasterCategory(m)}
                    style={{
                      background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px 12px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
                  >
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: m.color + '20', color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '16px' }}>
                      <i className={`fa-solid ${m.icon}`}></i>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#1f2937', textAlign: 'center' }}>
                      {m.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ================= STEP 2: DASHBOARD (UBER/RAPIDO STYLE) ================= */}
        {step === 2 && (
          <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            
            {/* Left Sidebar (Booking Flow) */}
            <div style={{ width: '420px', background: '#ffffff', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb', zIndex: 10, boxShadow: '4px 0 16px rgba(0,0,0,0.05)', overflowY: 'auto' }}>
              
              {/* Header */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, background: '#fff', zIndex: 20 }}>
                <button onClick={handleBackToFleet} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827' }}>Book your Ride</h2>
              </div>

              {/* 1. Search Form */}
              <div style={{ padding: '20px', background: '#ffffff', borderBottom: '8px solid #f9fafb' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <select value={tripType} onChange={e => setTripType(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '13px', fontWeight: '700', color: '#111827', outline: 'none' }}>
                    <option>One Way</option>
                    <option>Round Trip</option>
                  </select>
                  <select style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '13px', fontWeight: '700', color: '#111827', outline: 'none' }}>
                    <option>For Me</option>
                    <option>For Someone Else</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <select value={scheduleType} onChange={e => setScheduleType(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '13px', fontWeight: '700', color: '#111827', outline: 'none' }}>
                    <option value="Now">Leave Now</option>
                    <option value="Schedule">Schedule</option>
                  </select>
                  {scheduleType === 'Schedule' && (
                    <>
                      <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#ffffff', fontSize: '13px', fontWeight: '600' }} />
                      <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} style={{ width: '90px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#ffffff', fontSize: '13px', fontWeight: '600' }} />
                    </>
                  )}
                </div>

                <div style={{ position: 'relative', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', position: 'relative' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', marginRight: '12px', flexShrink: 0 }}></div>
                    <input 
                      type="text" 
                      placeholder={pickupLabel} 
                      value={pickup} 
                      onChange={e => { 
                        setPickup(e.target.value); 
                        setShowLocationList(e.target.value.length > 1); 
                        setIsSearching(false);
                      }} 
                      style={{ border: 'none', background: 'transparent', flex: 1, fontSize: '15px', fontWeight: '600', color: '#111827', outline: 'none' }} 
                    />
                    <button 
                      onClick={() => { setPickup('Current Location'); setShowLocationList(false); setIsSearching(false); }}
                      style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%' }}
                      title="Use Current Location"
                    >
                      <i className="fa-solid fa-location-crosshairs"></i>
                    </button>
                    
                    {showLocationList && pickup.length > 1 && (
                      <div style={{ position: 'absolute', top: '100%', left: '0', right: '0', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden', marginTop: '8px' }}>
                        <div onClick={() => { setPickup(getFilteredCities(pickup) + ' Railway Station'); setShowLocationList(false); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '14px', fontWeight: '600' }}><i className="fa-solid fa-train" style={{ color: '#9ca3af', marginRight: '8px' }}></i> {getFilteredCities(pickup)} Railway Station</div>
                        <div onClick={() => { setPickup(getFilteredCities(pickup) + ' Bus Stand'); setShowLocationList(false); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '14px', fontWeight: '600' }}><i className="fa-solid fa-bus" style={{ color: '#9ca3af', marginRight: '8px' }}></i> {getFilteredCities(pickup)} Bus Stand</div>
                        <div onClick={() => { setPickup(getFilteredCities(pickup) + ' Airport'); setShowLocationList(false); }} style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}><i className="fa-solid fa-plane" style={{ color: '#9ca3af', marginRight: '8px' }}></i> {getFilteredCities(pickup)} Airport</div>
                      </div>
                    )}
                  </div>
                  
                  {stops.map((stop, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ borderLeft: '1px solid #d1d5db', marginLeft: '3px', height: '20px', width: '20px', flexShrink: 0, position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-5px', top: '50%', width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div>
                      </div>
                      <input type="text" placeholder={`Stop ${i + 1}`} value={stop} onChange={e => { const newStops = [...stops]; newStops[i] = e.target.value; setStops(newStops); }} style={{ border: 'none', background: 'transparent', flex: 1, fontSize: '15px', fontWeight: '600', color: '#111827', outline: 'none', paddingLeft: '8px' }} />
                      <button onClick={() => setStops(stops.filter((_, idx) => idx !== i))} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                  ))}

                  {stops.length < 3 && (
                    <div style={{ borderLeft: '1px dashed #d1d5db', marginLeft: '3px', paddingLeft: '16px', marginBottom: '8px' }}>
                      <button onClick={() => setStops([...stops, ''])} style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-solid fa-plus" style={{ fontSize: '10px' }}></i> {stopLabel}
                      </button>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <div style={{ width: '8px', height: '8px', background: '#ef4444', marginRight: '12px', flexShrink: 0 }}></div>
                    <input 
                      type="text" 
                      placeholder={dropoffLabel} 
                      value={dropoff} 
                      onChange={e => {
                        setDropoff(e.target.value);
                        setShowDropoffList(e.target.value.length > 1);
                        setIsSearching(false);
                      }} 
                      style={{ border: 'none', background: 'transparent', flex: 1, fontSize: '15px', fontWeight: '600', color: '#111827', outline: 'none' }} 
                    />
                    
                    {showDropoffList && dropoff.length > 1 && (
                      <div style={{ position: 'absolute', top: '100%', left: '0', right: '0', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden', marginTop: '8px' }}>
                        <div onClick={() => { setDropoff(getFilteredCities(dropoff) + ' Railway Station'); setShowDropoffList(false); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '14px', fontWeight: '600' }}><i className="fa-solid fa-train" style={{ color: '#9ca3af', marginRight: '8px' }}></i> {getFilteredCities(dropoff)} Railway Station</div>
                        <div onClick={() => { setDropoff(getFilteredCities(dropoff) + ' Bus Stand'); setShowDropoffList(false); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '14px', fontWeight: '600' }}><i className="fa-solid fa-bus" style={{ color: '#9ca3af', marginRight: '8px' }}></i> {getFilteredCities(dropoff)} Bus Stand</div>
                        <div onClick={() => { setDropoff(getFilteredCities(dropoff) + ' Airport'); setShowDropoffList(false); }} style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}><i className="fa-solid fa-plane" style={{ color: '#9ca3af', marginRight: '8px' }}></i> {getFilteredCities(dropoff)} Airport</div>
                      </div>
                    )}
                  </div>
                  
                  <button onClick={() => { const t = pickup; setPickup(dropoff); setDropoff(t); }} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: '#f3f4f6', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                    <i className="fa-solid fa-arrow-down-up-across-line" style={{ color: '#4b5563', fontSize: '12px' }}></i>
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    if (pickup.trim().length > 1 && dropoff.trim().length > 1) {
                      setIsSearching(true);
                    } else {
                      alert('Please enter valid pickup and dropoff locations to search rides.');
                    }
                  }} 
                  style={{ width: '100%', marginTop: '16px', background: '#111827', color: '#fff', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', border: 'none', cursor: 'pointer' }}
                >
                  Search Rides
                </button>
              </div>

              {isDriverFound ? (
                <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: '#f9fafb' }}>
                  <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <i className="fa-solid fa-circle-check"></i> Ride Confirmed
                  </div>
                  
                  {/* Driver Card (Rapido Style) */}
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', background: '#fff', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#9ca3af', overflow: 'hidden' }}>
                          <img src="https://ui-avatars.com/api/?name=Ramesh+K&background=random" alt="Driver" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>Ramesh K.</div>
                          <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i> 4.8 (1,240 rides)
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#111827', letterSpacing: '1px' }}>TN 07 AB 1234</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>{selectedVehicle?.name}</div>
                      </div>
                    </div>
                    
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Ride OTP</div>
                        <div style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', letterSpacing: '4px' }}>8492</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Arriving in</div>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>4 mins</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    <button style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', background: '#fff', color: '#0f172a', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', transition: 'all 0.2s' }}>
                      <i className="fa-solid fa-message"></i> Message
                    </button>
                    <button style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', background: '#10b981', color: '#fff', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', transition: 'all 0.2s' }}>
                      <i className="fa-solid fa-phone"></i> Call Driver
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => { setIsDriverFound(false); setIsSearching(false); setStep(1); }}
                    style={{ width: '100%', marginTop: '16px', padding: '16px', borderRadius: '12px', border: 'none', background: '#fee2e2', color: '#991b1b', fontWeight: '700', fontSize: '15px', cursor: 'pointer', transition: 'background 0.2s' }}
                  >
                    Cancel Ride
                  </button>
                </div>
              ) : (
                <>
                  {/* 2. Vehicle List */}
                  <div style={{ padding: '20px', opacity: isSearching ? 1 : 0.3, pointerEvents: isSearching ? 'auto' : 'none', transition: 'all 0.3s ease' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800', color: '#111827' }}>{isSearching ? 'Available Rides' : 'Search to see rides'}</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {relatedVehicles.map((v) => {
                        const price = Math.max(v.basePrice || 0, (v.ratePerKm || 10) * estimatedDistance);
                        const isSelected = selectedVehicleId === v.id;
                        
                        const displayPrice = isSearching ? `₹${price}` : '--';
                        const displayDistance = isSearching ? `${estimatedDistance} km trip` : 'Distance to be calculated';
                        const displayRate = isSearching ? `₹${v.ratePerKm || 10}/km` : '--/km';
                        
                        return (
                          <div 
                            key={v.id} 
                            onClick={() => setSelectedVehicleId(v.id)}
                            style={{ 
                              display: 'flex', alignItems: 'center', padding: '16px', borderRadius: '16px', 
                              border: isSelected ? '2px solid #000' : '2px solid transparent',
                              background: isSelected ? '#f3f4f6' : '#ffffff',
                              boxShadow: isSelected ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
                              cursor: 'pointer', transition: 'all 0.2s'
                            }}
                          >
                            {/* Vehicle Icon */}
                            <div style={{ width: '60px', height: '50px', background: v.color + '15', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: v.color, fontSize: '24px', marginRight: '16px', flexShrink: 0 }}>
                              <i className={`fa-solid ${v.icon}`}></i>
                            </div>
                            
                            {/* Details */}
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '16px', fontWeight: '800', color: '#111827' }}>{v.name}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>
                                  <i className="fa-regular fa-clock"></i> {v.time}
                                </span>
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span><i className="fa-solid fa-user-group"></i> {v.capacity}</span>
                                {v.luggage > 0 && <span><i className="fa-solid fa-suitcase"></i> {v.luggage}</span>}
                                {isSearching && <span style={{ color: '#3b82f6', fontWeight: '600' }}><i className="fa-solid fa-route"></i> {displayDistance}</span>}
                              </div>
                            </div>
                            
                            {/* Price */}
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>
                                {displayPrice}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>
                                {displayRate}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* 3. Bottom Action Bar (Offers, Payment, Book) */}
                  <div style={{ borderTop: '1px solid #e5e7eb', padding: '20px', background: '#ffffff', opacity: isSearching ? 1 : 0.3, pointerEvents: isSearching ? 'auto' : 'none', marginTop: 'auto' }}>
                    
                    {/* Offers */}
                    <div style={{ marginBottom: '16px' }}>
                      <div 
                        onClick={() => setShowOffers(!showOffers)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: offerApplied ? '#dcfce7' : '#fffbeb', borderRadius: '12px', cursor: 'pointer', border: offerApplied ? '1px solid #86efac' : '1px dashed #fcd34d' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: offerApplied ? '#166534' : '#b45309' }}>
                          <i className="fa-solid fa-tag" style={{ fontSize: '16px' }}></i>
                          <span style={{ fontSize: '14px', fontWeight: '700' }}>{offerApplied ? '20% Offer Applied!' : 'Apply Promos & Offers'}</span>
                        </div>
                        <i className={`fa-solid ${showOffers ? 'fa-chevron-down' : 'fa-chevron-right'}`} style={{ color: offerApplied ? '#166534' : '#b45309' }}></i>
                      </div>

                      {showOffers && (
                        <div style={{ marginTop: '8px', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '800', color: '#111827' }}>WELCOME20</div>
                              <div style={{ fontSize: '11px', color: '#6b7280' }}>Get 20% off on this ride</div>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setOfferApplied(!offerApplied); setShowOffers(false); }}
                              style={{ background: offerApplied ? '#fee2e2' : '#e11d48', color: offerApplied ? '#991b1b' : '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                            >
                              {offerApplied ? 'Remove' : 'Apply'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Payment & Book Row */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <select 
                        value={paymentType} 
                        onChange={e => setPaymentType(e.target.value)}
                        style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '14px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', color: '#111827', outline: 'none', cursor: 'pointer', width: '120px' }}
                      >
                        <option>Cash</option>
                        <option>UPI</option>
                        <option>Wallet</option>
                        <option>Card</option>
                      </select>
                      
                      <button 
                        onClick={() => setIsFindingDriver(true)}
                        disabled={isFindingDriver}
                        style={{ flex: 1, background: isFindingDriver ? '#e5e7eb' : '#111827', color: isFindingDriver ? '#4b5563' : '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}
                      >
                        {isFindingDriver ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span><i className="fa-solid fa-circle-notch fa-spin"></i> Finding Ride...</span>
                            <span onClick={(e) => { e.stopPropagation(); setIsFindingDriver(false); }} style={{ color: '#ef4444', fontSize: '14px', padding: '4px 8px', cursor: 'pointer' }}>Cancel</span>
                          </div>
                        ) : (
                          <>
                            <span>Book {selectedVehicle?.name.split(' ')[0]}</span>
                            <span>₹{currentFinalPrice} <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i></span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Right Sidebar (Live Map) */}
            <div style={{ flex: 1, position: 'relative', background: '#e5e7eb', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', backgroundSize: '200px' }}></div>
              
              {/* Map Floating UI Elements */}
              <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '12px', zIndex: 10 }}>
                <div style={{ background: '#ffffff', padding: '10px 16px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '13px', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-location-crosshairs" style={{ color: '#3b82f6' }}></i> Live GPS Active
                </div>
              </div>

              {/* Real Map Integration */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <LiveTrackerMap 
                  key="rides-map"
                  vehicleIconClass={selectedVehicle?.icon || 'fa-car'} 
                  pickup={pickup}
                  dropoff={dropoff}
                  isSearching={isSearching || isFindingDriver || isDriverFound}
                />
              </div>



            </div>

          </div>
        )}

      </div>
    </div>
  );
}
