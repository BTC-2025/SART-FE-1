'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ParkingMapClient = dynamic(() => import('./ParkingMapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#e2e8f0', borderRadius: '12px', color: '#64748b' }}>
      Loading Map...
    </div>
  )
});

const ROAD_PARKING = [
  {
    title: 'Road Vehicle Parking',
    vehicles: [
      { id: 'p-bike', name: 'Two-Wheeler Parking', icon: 'fa-motorcycle', color: '#10b981', price: 20 },
      { id: 'p-car', name: 'Car Parking Space', icon: 'fa-car-side', color: '#3b82f6', price: 50 },
      { id: 'p-suv', name: 'SUV / MPV Large Space', icon: 'fa-truck-pickup', color: '#8b5cf6', price: 80 },
      { id: 'p-truck', name: 'Commercial Truck Yard', icon: 'fa-truck-front', color: '#f59e0b', price: 200 },
    ]
  }
];

const SEA_PARKING = [
  {
    title: 'Marine Docking & Harbors',
    vehicles: [
      { id: 'p-boat', name: 'Small Boat Mooring', icon: 'fa-sailboat', color: '#0ea5e9', price: 500 },
      { id: 'p-yacht', name: 'Luxury Yacht Marina Slip', icon: 'fa-anchor', color: '#ec4899', price: 2500 },
      { id: 'p-ship', name: 'Commercial Ship Berth', icon: 'fa-ship', color: '#4f46e5', price: 10000 },
    ]
  }
];

const AIR_PARKING = [
  {
    title: 'Aviation Hangars & Tie-Downs',
    vehicles: [
      { id: 'p-heli', name: 'Helipad Landing/Parking', icon: 'fa-helicopter-symbol', color: '#10b981', price: 1500 },
      { id: 'p-light', name: 'Light Aircraft Hangar', icon: 'fa-plane', color: '#8b5cf6', price: 3000 },
      { id: 'p-jet', name: 'Private Jet Tie-Down', icon: 'fa-plane-up', color: '#f97316', price: 8000 },
    ]
  }
];

const RAIL_PARKING = [
  {
    title: 'Rail Depots & Sidings',
    vehicles: [
      { id: 'p-train', name: 'Locomotive Depot Slot', icon: 'fa-train', color: '#f59e0b', price: 5000 },
      { id: 'p-wagon', name: 'Freight Wagon Siding', icon: 'fa-train-subway', color: '#14b8a6', price: 2000 },
    ]
  }
];

const ALL_PARKING = [
  ...ROAD_PARKING.map(c => c.vehicles).flat(),
  ...SEA_PARKING.map(c => c.vehicles).flat(),
  ...AIR_PARKING.map(c => c.vehicles).flat(),
  ...RAIL_PARKING.map(c => c.vehicles).flat()
];

interface ParkingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ParkingBookingModal({ isOpen, onClose }: ParkingBookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedVehicle, setSelectedVehicle] = useState('p-car');

  useEffect(() => {
    const handleUrlState = () => {
      const path = window.location.pathname;
      
      let searchParamsObj = new URLSearchParams();
      if (typeof window !== 'undefined') {
        searchParamsObj = new URLSearchParams(window.location.search);
      }
      
      const subService = searchParamsObj.get('subService');
      const origin = searchParamsObj.get('origin');
      
      if (subService || path.includes('-booking') || path.startsWith('/home/parking/')) {
        let vehicleId = '';
        if (subService) {
          vehicleId = subService.toLowerCase();
        } else {
          const parts = path.split('/');
          const lastPart = parts[parts.length - 1];
          if (lastPart && lastPart !== 'parking' && lastPart !== 'home') {
            vehicleId = decodeURIComponent(lastPart).replace('-booking', '').toLowerCase();
          }
        }
        
        if (vehicleId) {
          const found = ALL_PARKING.find(v => v.id.toLowerCase() === vehicleId || v.name.toLowerCase().includes(vehicleId));
          
          if (found) {
             setSelectedVehicle(found.id);
             if (origin) setPickup(origin);
             
             // Aesthetic URL update
             if (typeof window !== 'undefined' && path === '/home/parking' && subService) {
                try {
                  const nativePushState = Object.getPrototypeOf(window.history).pushState;
                  nativePushState.call(window.history, null, '', `/home/parking/${found.id}`);
                } catch (e) {
                  window.history.pushState(null, '', `/home/parking/${found.id}`);
                }
             }
             
             setStep(2);
             return;
          }
        }
      }

      if (path === '/home/parking') {
        setStep(1);
      }
    };

    // Check immediately on mount
    if (isOpen) {
      handleUrlState();
    }

    window.addEventListener('popstate', handleUrlState);
    return () => {
      window.removeEventListener('popstate', handleUrlState);
    };
  }, [isOpen]);

  const [activeCategory, setActiveCategory] = useState<'ALL' | 'ROAD' | 'SEA' | 'AIR' | 'RAIL'>('ALL');
  const [pickup, setPickup] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  
  const [isSearched, setIsSearched] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const confirmTimeoutRef = React.useRef<any>(null);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  React.useEffect(() => {
    if (!isTyping || pickup.length < 3) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=5&q=${encodeURIComponent(pickup)}&email=demo@sart.com`);
        const data = await res.json();
        setSuggestions(data);
      } catch (e) {
        // Suppress console.error to prevent Next.js dev overlay on rate limit/CORS errors
        console.warn("Failed to fetch suggestions:", e);
      }
    };
    const timer = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timer);
  }, [pickup, isTyping]);

  const availableSlots = [
    { id: 'premium', basePrice: 50, color: '#f59e0b', label: 'Premium Slot', desc: 'Prime location, ground floor' },
    { id: 'standard', basePrice: 40, color: '#10b981', label: 'Standard Slot', desc: 'Regular parking area' },
    { id: 'covered', basePrice: 80, color: '#3b82f6', label: 'Covered Parking', desc: 'Weather protection & security' },
    { id: 'economy', basePrice: 30, color: '#8b5cf6', label: 'Economy Slot', desc: 'Open yard parking' }
  ];

  const getCalculatedPrice = (base: number) => {
    const vName = selectedVehicleObj?.name || '';
    if (vName.includes('Two-Wheeler') || vName.includes('Bike')) return base - 30 > 0 ? base - 30 : 10;
    if (vName.includes('Boat') || vName.includes('Yacht')) return base * 10;
    if (vName.includes('Plane') || vName.includes('Jet')) return base * 50;
    return base;
  };

  React.useEffect(() => {
    const handleReset = () => {
      setStep(1);
    };
    window.addEventListener('resetModalSteps', handleReset);
    return () => window.removeEventListener('resetModalSteps', handleReset);
  }, []);

  if (!isOpen) return null;

  const updateUrl = (path: string) => {
    if (typeof window !== 'undefined') {
      try {
        const nativePushState = Object.getPrototypeOf(window.history).pushState;
        nativePushState.call(window.history, null, '', path);
      } catch (e) {
        window.history.pushState(null, '', path);
      }
    }
  };

  const handleSelectVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle.id);
    setStep(2);
    const cleanName = vehicle.name.split('/')[0].trim();
    updateUrl(`/home/parking/${encodeURIComponent(cleanName)}-booking`);
  };

  const handleBackToFleet = () => {
    setStep(1);
    setIsSearched(false);
    setSelectedSlotId('');
    updateUrl('/home/parking');
  };

  const handleClose = () => {
    setStep(1);
    setIsSearched(false);
    setSelectedSlotId('');
    setIsConfirming(false);
    if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
    updateUrl('/');
    onClose();
  };

  const handleSearch = () => {
    if (!pickup || !startDate || !startTime) {
      alert("Please enter location, check-in date and time.");
      return;
    }
    setIsSearched(true);
  };

  const handleBook = () => {
    if (!selectedSlotId) {
      alert("Please select a parking slot from the list first.");
      return;
    }
    setStep(3);
  };

  const handleFinalConfirm = () => {
    setIsConfirming(true);
    confirmTimeoutRef.current = setTimeout(() => {
      setIsConfirming(false);
      
      let vehicleName = 'Parking Slot';
      let vehiclePrice = 50;
      
      const found = ALL_PARKING.find(v => v.id === selectedVehicle);
      if (found) {
        vehicleName = found.name;
        vehiclePrice = found.price;
      }

      let subtitle = `${vehicleName} • Reserved`;
      if (startDate && returnDate) {
        subtitle += ` • From ${startDate} to ${returnDate}`;
      }
      
      if ((window as any).executeGenericBooking) {
        (window as any).executeGenericBooking('parking', `Parking: ${pickup}`, subtitle, vehiclePrice, { from: pickup, startDate, startTime, returnDate, returnTime });
      }
      handleClose();
    }, 4000);
  };

  const cancelConfirmation = () => {
    if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
    setIsConfirming(false);
    setStep(2);
  };

  const selectedVehicleObj = ALL_PARKING.find(v => v.id === selectedVehicle);

  let mode = 'ROAD';
  if (selectedVehicleObj) {
    if (SEA_PARKING[0].vehicles.some(v => v.id === selectedVehicleObj.id)) mode = 'SEA';
    if (AIR_PARKING[0].vehicles.some(v => v.id === selectedVehicleObj.id)) mode = 'AIR';
    if (RAIL_PARKING[0].vehicles.some(v => v.id === selectedVehicleObj.id)) mode = 'RAIL';
  }

  let searchLabel = 'Search area or landmark';
  let titleLabel = 'Find Nearby Parking';
  let btnLabel = 'Search Parking Slot';
  let searchIcon = 'fa-location-dot';

  if (mode === 'SEA') {
    searchLabel = 'Search Port or Marina';
    titleLabel = 'Find Nearby Dock/Marina';
    btnLabel = 'Search Docking Slot';
    searchIcon = 'fa-anchor';
  } else if (mode === 'AIR') {
    searchLabel = 'Search Airport or Helipad';
    titleLabel = 'Find Nearby Hangar/Tie-Down';
    btnLabel = 'Search Aviation Slot';
    searchIcon = 'fa-plane';
  } else if (mode === 'RAIL') {
    searchLabel = 'Search Railway Station or Yard';
    titleLabel = 'Find Nearby Depot';
    btnLabel = 'Search Rail Slot';
    searchIcon = 'fa-train';
  }

  const renderGridSection = (title: string, icon: string, data: typeof ROAD_PARKING) => {
    const allVehicles = data.map(c => c.vehicles).flat();
    return (
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '24px 0 16px 0', paddingBottom: '8px', borderBottom: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className={`fa-solid ${icon}`}></i> {title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px' }}>
            {allVehicles.map(v => (
            <div 
              key={v.id} 
              onClick={() => handleSelectVehicle(v)}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: v.color + '20', color: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '12px' }}>
                <i className={`fa-solid ${v.icon}`}></i>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', textAlign: 'center', lineHeight: '1.2' }}>
                {v.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay open" style={{ display: 'flex', zIndex: 1000, background: 'rgba(0,0,0,0.6)' }} onClick={handleClose}>
      <div className="modal-sheet centered-modal" style={{ maxWidth: '900px', width: '95%', height: '90vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb', borderRadius: '24px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        
        {/* HACK for globals.css */}
        <div className="dummy-modal-header-for-css-hack"></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fa-solid fa-square-parking" style={{ color: '#f59e0b' }}></i> Reserve Parking & Docking
          </div>
        </div>
        
        {step === 1 && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {/* Category Selector */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {[
                { id: 'ALL', label: 'All Slots', icon: 'fa-globe', color: '#6366f1' },
                { id: 'ROAD', label: 'Road Parking', icon: 'fa-car', color: '#3b82f6' },
                { id: 'SEA', label: 'Docks & Marinas', icon: 'fa-ship', color: '#0ea5e9' },
                { id: 'AIR', label: 'Hangars', icon: 'fa-plane', color: '#8b5cf6' },
                { id: 'RAIL', label: 'Train Depots', icon: 'fa-train', color: '#10b981' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                    borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '700',
                    background: activeCategory === cat.id ? cat.color : '#f3f4f6',
                    color: activeCategory === cat.id ? '#ffffff' : '#4b5563',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className={`fa-solid ${cat.icon}`}></i> {cat.label}
                </button>
              ))}
            </div>

            {/* Render only active category */}
            {activeCategory === 'ALL' && renderGridSection('ALL PARKING OPTIONS', 'fa-globe', [{ title: 'All', vehicles: ALL_PARKING }] as any)}
            {activeCategory === 'ROAD' && renderGridSection('ROAD PARKING', 'fa-car', ROAD_PARKING)}
            {activeCategory === 'SEA' && renderGridSection('MARINE DOCKING', 'fa-ship', SEA_PARKING)}
            {activeCategory === 'AIR' && renderGridSection('AVIATION HANGARS', 'fa-plane', AIR_PARKING)}
            {activeCategory === 'RAIL' && renderGridSection('RAIL DEPOTS', 'fa-train', RAIL_PARKING)}
          </div>
        )}

        {step === 2 && (
          <div style={{ flex: 1, overflowY: 'hidden', padding: '0', display: 'flex' }}>
            
            {/* Left Column: Form Details */}
            <div style={{ flex: '1 1 450px', background: '#ffffff', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb', overflowY: 'auto' }}>
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                
                <button 
                  onClick={handleBackToFleet} 
                  style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 0 24px 0', width: 'fit-content' }}
                >
                  <i className="fa-solid fa-arrow-left"></i> Back to Options
                </button>

                {selectedVehicleObj && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: selectedVehicleObj.color + '20', color: selectedVehicleObj.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                      <i className={`fa-solid ${selectedVehicleObj.icon}`}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#111827' }}>{selectedVehicleObj.name}</h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>Vehicle Requirement</p>
                    </div>
                  </div>
                )}

                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}>{titleLabel}</h3>
                <div style={{ position: 'relative', display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '16px', color: '#9ca3af' }}></i>
                    <input 
                      type="text" 
                      style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '12px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '15px', outline: 'none' }} 
                      placeholder={searchLabel}
                      value={pickup} 
                      onChange={e => { setPickup(e.target.value); setIsTyping(true); }} 
                    />
                    {suggestions.length > 0 && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', marginTop: '8px', zIndex: 50, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                        {suggestions.map((s, i) => (
                          <div 
                            key={i} 
                            style={{ padding: '12px 16px', borderBottom: i === suggestions.length - 1 ? 'none' : '1px solid #e5e7eb', cursor: 'pointer', fontSize: '14px', color: '#374151' }}
                            onClick={() => { setPickup(s.display_name); setSuggestions([]); setIsTyping(false); }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                          >
                            <i className={`fa-solid ${searchIcon}`} style={{ marginRight: '8px', color: '#9ca3af' }}></i>
                            {s.display_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => { setPickup('Chennai'); setIsTyping(false); setSuggestions([]); }}
                    style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '12px', padding: '0 20px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <i className="fa-solid fa-location-crosshairs"></i> Near Me
                  </button>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}>Schedule Booking</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>Check-in Date</label>
                      <input type="date" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none' }} value={startDate} onChange={e => setStartDate(e.target.value)} disabled={isSearched} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>Check-in Time</label>
                      <input type="time" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none' }} value={startTime} onChange={e => setStartTime(e.target.value)} disabled={isSearched} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>Check-out Date</label>
                      <input type="date" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none' }} value={returnDate} onChange={e => setReturnDate(e.target.value)} disabled={isSearched} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>Check-out Time</label>
                      <input type="time" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none' }} value={returnTime} onChange={e => setReturnTime(e.target.value)} disabled={isSearched} />
                    </div>
                  </div>

                  {!isSearched ? (
                    <button 
                      onClick={handleSearch}
                      style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#111827', color: '#ffffff', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s', marginTop: 'auto' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
                      onMouseLeave={e => e.currentTarget.style.background = '#111827'}
                    >
                      {btnLabel}
                    </button>
                  ) : (
                    <>
                      <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#111827', marginBottom: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>Available Slots</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', maxHeight: '180px', overflowY: 'auto' }}>
                        {availableSlots.map(slot => (
                          <div 
                            key={slot.id}
                            onClick={() => setSelectedSlotId(slot.id)}
                            style={{ 
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', 
                              border: selectedSlotId === slot.id ? `2px solid ${slot.color}` : '1px solid #e5e7eb', 
                              borderRadius: '12px', cursor: 'pointer', background: selectedSlotId === slot.id ? `${slot.color}10` : '#ffffff',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${slot.color}`, background: selectedSlotId === slot.id ? slot.color : 'transparent' }}></div>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{slot.label}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{slot.desc}</div>
                              </div>
                            </div>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: slot.color }}>
                              ₹{getCalculatedPrice(slot.basePrice)}/hr
                            </div>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={handleBook}
                        disabled={!selectedSlotId}
                        style={{ width: '100%', padding: '16px', borderRadius: '12px', background: selectedSlotId ? '#f59e0b' : '#d1d5db', color: '#ffffff', border: 'none', fontSize: '16px', fontWeight: '700', cursor: selectedSlotId ? 'pointer' : 'not-allowed', transition: 'background 0.2s', marginTop: 'auto' }}
                      >
                        {selectedSlotId ? 'Confirm Booking' : 'Select a Slot'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Map Area */}
            <div style={{ flex: '1 1 500px', position: 'relative', background: '#e5e7eb', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <ParkingMapClient 
                  vehicleIconClass={selectedVehicleObj?.icon || 'fa-car'} 
                  vehicleTitle={selectedVehicleObj?.name || 'Car'}
                  searchQuery={pickup}
                  isSearched={isSearched}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#e2e8f0', overflowY: 'auto' }}>
            <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', width: '100%', maxWidth: '500px', textAlign: 'center', margin: 'auto' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#10b98120', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 24px auto' }}>
                <i className="fa-solid fa-check"></i>
              </div>
              <h2 style={{ margin: '0 0 12px 0', fontSize: '28px', fontWeight: '800', color: '#111827' }}>Confirm Parking Slot</h2>
              <p style={{ margin: '0 0 32px 0', color: '#6b7280', fontSize: '16px' }}>Please review your booking details before confirming.</p>
              
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '24px', borderRadius: '16px', textAlign: 'left', marginBottom: '32px' }}>
                <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f4f6', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginRight: '16px' }}>
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginTop: '4px', lineHeight: '1.4' }}>{pickup || 'Current Location'}</div>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f4f6', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginRight: '12px' }}>
                      <i className="fa-regular fa-clock"></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Check-in</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginTop: '4px' }}>{startDate} {startTime}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f4f6', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginRight: '12px' }}>
                      <i className="fa-solid fa-flag-checkered"></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Check-out</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginTop: '4px' }}>{returnDate} {returnTime}</div>
                    </div>
                  </div>
                </div>
              </div>

              {isConfirming ? (
                <div style={{ padding: '24px 0' }}>
                  <div className="spinner" style={{ border: '4px solid #f3f4f6', borderTop: '4px solid #f59e0b', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }}></div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' }}>Confirming Booking...</h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px 0' }}>Please do not close this window.</p>
                  
                  <button 
                    onClick={cancelConfirmation}
                    style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#fee2e2', color: '#ef4444', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
                  >
                    Cancel Booking Process
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <button 
                      onClick={handleFinalConfirm}
                      style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#f59e0b', color: '#fff', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#d97706'}
                      onMouseLeave={e => e.currentTarget.style.background = '#f59e0b'}
                    >
                      Confirm Parking Now
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button 
                      onClick={cancelConfirmation}
                      style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#f3f4f6', color: '#4b5563', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                      onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => alert("Calling Parking Owner...")}
                      style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#111827', color: '#fff', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
                      onMouseLeave={e => e.currentTarget.style.background = '#111827'}
                    >
                      <i className="fa-solid fa-phone"></i> Call
                    </button>
                    <button 
                      onClick={() => alert("Opening Messages...")}
                      style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#10b981', color: '#fff', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                      onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
                    >
                      <i className="fa-solid fa-message"></i> Msg
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
