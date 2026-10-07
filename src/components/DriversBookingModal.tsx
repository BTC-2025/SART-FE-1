'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const LeafletMapClient = dynamic(() => import('./LeafletMapClient'), {
  ssr: false,
  loading: () => <div style={{width:'100%',height:'100%',background:'#e2e8f0',display:'flex',alignItems:'center',justifyContent:'center'}}><div className="spinner" style={{border:'4px solid #f3f4f6',borderTop:'4px solid #10b981',borderRadius:'50%',width:'40px',height:'40px',animation:'spin 1s linear infinite'}}></div></div>
});

const ROAD_DRIVERS = [
  {
    title: 'Two & Three Wheelers',
    vehicles: [
      { id: 'd-bike', name: 'Bike / Scooter Rider', icon: 'fa-motorcycle', color: '#10b981', price: 500 },
      { id: 'd-auto', name: 'Auto-Rickshaw Driver', icon: 'fa-taxi', color: '#f59e0b', price: 700 },
      { id: 'd-delivery', name: 'Delivery / Courier Rider', icon: 'fa-box', color: '#ec4899', price: 600 },
    ]
  },
  {
    title: 'Cars & Passenger Vehicles',
    vehicles: [
      { id: 'd-car', name: 'Personal Car Chauffeur', icon: 'fa-car-side', color: '#3b82f6', price: 1200 },
      { id: 'd-suv', name: 'SUV / MUV Driver', icon: 'fa-car', color: '#6366f1', price: 1500 },
      { id: 'd-luxury', name: 'Luxury Chauffeur (Uniformed)', icon: 'fa-user-tie', color: '#8b5cf6', price: 2500 },
      { id: 'd-valet', name: 'Event Valet Driver', icon: 'fa-key', color: '#14b8a6', price: 1000 },
    ]
  },
  {
    title: 'Commercial & Heavy Vehicles',
    vehicles: [
      { id: 'd-minitruck', name: 'Mini-Truck / LCV Driver', icon: 'fa-truck-pickup', color: '#f97316', price: 1800 },
      { id: 'd-truck', name: 'Heavy Truck Driver (HGV)', icon: 'fa-truck-front', color: '#ea580c', price: 3000 },
      { id: 'd-trailer', name: 'Trailer / Multi-Axle Driver', icon: 'fa-truck-moving', color: '#ef4444', price: 4500 },
      { id: 'd-bus', name: 'Commercial Bus Driver', icon: 'fa-bus', color: '#0ea5e9', price: 2800 },
      { id: 'd-ambulance', name: 'Ambulance Driver', icon: 'fa-truck-medical', color: '#e11d48', price: 3500 },
      { id: 'd-tractor', name: 'Tractor / Farm Driver', icon: 'fa-tractor', color: '#84cc16', price: 2000 },
    ]
  }
];

const SEA_DRIVERS = [
  {
    title: 'Marine Captains & Crew',
    vehicles: [
      { id: 'd-speedboat', name: 'Speedboat Pilot', icon: 'fa-ship', color: '#0ea5e9', price: 5000 },
      { id: 'd-yacht', name: 'Private Yacht Captain', icon: 'fa-anchor', color: '#0284c7', price: 15000 },
      { id: 'd-ferry', name: 'Ferry Master', icon: 'fa-ferry', color: '#4f46e5', price: 12000 },
    ]
  }
];

const AIR_DRIVERS = [
  {
    title: 'Pilots & Flight Crew',
    vehicles: [
      { id: 'd-heli', name: 'Helicopter Pilot', icon: 'fa-helicopter', color: '#10b981', price: 45000 },
      { id: 'd-privatejet', name: 'Private Jet Captain', icon: 'fa-plane-up', color: '#8b5cf6', price: 85000 },
      { id: 'd-drone', name: 'Commercial Drone Operator', icon: 'fa-helicopter-symbol', color: '#f59e0b', price: 8000 },
    ]
  }
];

const RAIL_DRIVERS = [
  {
    title: 'Rail & Train Operators',
    vehicles: [
      { id: 'd-train', name: 'Locomotive Engineer', icon: 'fa-train', color: '#f97316', price: 15000 },
      { id: 'd-tram', name: 'Tram Operator', icon: 'fa-train-tram', color: '#14b8a6', price: 8000 },
    ]
  }
];

const ALL_DRIVERS = [
  ...ROAD_DRIVERS.map(c => c.vehicles).flat(),
  ...SEA_DRIVERS.map(c => c.vehicles).flat(),
  ...AIR_DRIVERS.map(c => c.vehicles).flat(),
  ...RAIL_DRIVERS.map(c => c.vehicles).flat()
];

interface DriversBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DriversBookingModal({ isOpen, onClose }: DriversBookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedVehicle, setSelectedVehicle] = useState('d-car');
  const [isConfirming, setIsConfirming] = useState(false);
  const confirmTimeoutRef = React.useRef<any>(null);

  useEffect(() => {
    const handleUrlState = () => {
      const path = window.location.pathname;
      if (path.includes('-booking')) {
        setStep(2);
        const parts = path.split('/');
        const last = parts[parts.length - 1];
        const name = decodeURIComponent(last.replace('-booking', ''));
        const found = ALL_DRIVERS.find(v => v.name.startsWith(name));
        if (found) setSelectedVehicle(found.id);
      } else if (path === '/home/drivers') {
        setStep(1);
      }
    };

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
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [tripType, setTripType] = useState<'ONE_WAY' | 'HOURLY'>('ONE_WAY');
  const [duration, setDuration] = useState('4');

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  React.useEffect(() => {
    if (!isTyping || pickup.length < 3) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=5&q=${encodeURIComponent(pickup)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (e) {
        console.error("Failed to fetch suggestions", e);
      }
    };
    const timer = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timer);
  }, [pickup, isTyping]);

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
      window.history.pushState(null, '', path);
    }
  };

  const handleSelectVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle.id);
    setStep(2);
    const cleanName = vehicle.name.split('/')[0].trim();
    updateUrl(`/home/drivers/${encodeURIComponent(cleanName)}-booking`);
  };

  const handleBackToFleet = () => {
    setStep(1);
    updateUrl('/home/drivers');
  };

  const handleClose = () => {
    setStep(1);
    if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
    setIsConfirming(false);
    updateUrl('/');
    onClose();
  };

  const handleBook = () => {
    if (!pickup || !date || !time) {
      alert("Please enter location, date, and time first.");
      return;
    }
    setStep(3);
  };

  const handleFinalConfirm = () => {
    setIsConfirming(true);
    confirmTimeoutRef.current = setTimeout(() => {
      setIsConfirming(false);
      let vehicleName = 'Professional Driver';
      let vehiclePrice = 1200;
      
      const found = ALL_DRIVERS.find(v => v.id === selectedVehicle);
      if (found) {
        vehicleName = found.name;
        vehiclePrice = tripType === 'HOURLY' ? found.price * (parseInt(duration)/8) : found.price;
      }

      let subtitle = `${vehicleName}`;
      if (tripType === 'ONE_WAY') {
         subtitle += ` • One Way (Drop)`;
      } else {
         subtitle += ` • ${duration} Hrs Package`;
      }

      if ((window as any).executeGenericBooking) {
        (window as any).executeGenericBooking('drivers', `Hire: ${vehicleName} at ${pickup}`, subtitle, vehiclePrice, { from: pickup, to: dropoff, date, time });
      }
      handleClose();
    }, 4000);
  };

  const cancelConfirmation = () => {
    if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
    setIsConfirming(false);
    setStep(2);
  };

  const selectedVehicleObj = ALL_DRIVERS.find(v => v.id === selectedVehicle);

  const renderGridSection = (title: string, icon: string, data: typeof ROAD_DRIVERS) => {
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

  let mode = 'ROAD';
  if (selectedVehicleObj) {
    if (SEA_DRIVERS[0].vehicles.some(v => v.id === selectedVehicleObj.id)) mode = 'SEA';
    if (AIR_DRIVERS[0].vehicles.some(v => v.id === selectedVehicleObj.id)) mode = 'AIR';
    if (RAIL_DRIVERS[0].vehicles.some(v => v.id === selectedVehicleObj.id)) mode = 'RAIL';
  }

  let pickupLabel = 'Reporting Location';
  let dropoffLabel = 'Drop-off Location';
  let locationIcon = 'fa-location-dot';
  let placeholder = 'Enter pickup address';

  if (mode === 'SEA') {
    pickupLabel = 'Reporting Port / Marina';
    dropoffLabel = 'Destination Port';
    locationIcon = 'fa-anchor';
    placeholder = 'Enter port name';
  } else if (mode === 'AIR') {
    pickupLabel = 'Reporting Airport / Helipad';
    dropoffLabel = 'Destination Airport';
    locationIcon = 'fa-plane';
    placeholder = 'Enter airport code';
  } else if (mode === 'RAIL') {
    pickupLabel = 'Reporting Railway Station';
    dropoffLabel = 'Destination Station';
    locationIcon = 'fa-train';
    placeholder = 'Enter station name';
  }

  return (
    <div className="modal-overlay open" style={{ display: 'flex', zIndex: 1000, background: 'rgba(0,0,0,0.6)' }} onClick={handleClose}>
      <div className="modal-sheet centered-modal" style={{ maxWidth: '900px', width: '95%', height: '90vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb', borderRadius: '24px', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fa-solid fa-user-tie" style={{ color: '#10b981' }}></i> Rent Professional Drivers
          </div>
          <button onClick={handleClose} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        {step === 1 && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {[
                { id: 'ALL', label: 'All Staff', icon: 'fa-users', color: '#f59e0b' },
                { id: 'ROAD', label: 'Road Drivers', icon: 'fa-car', color: '#3b82f6' },
                { id: 'SEA', label: 'Sea & Water', icon: 'fa-ship', color: '#0ea5e9' },
                { id: 'AIR', label: 'Air Pilots', icon: 'fa-plane', color: '#8b5cf6' },
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
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <i className={`fa-solid ${cat.icon}`}></i> {cat.label}
                </button>
              ))}
            </div>

            {activeCategory === 'ALL' && renderGridSection('ALL DRIVERS', 'fa-users', [{ title: 'All', vehicles: ALL_DRIVERS }] as any)}
            {activeCategory === 'ROAD' && renderGridSection('ROAD DRIVERS', 'fa-car', ROAD_DRIVERS)}
            {activeCategory === 'SEA' && renderGridSection('MARINE CAPTAINS', 'fa-ship', SEA_DRIVERS)}
            {activeCategory === 'AIR' && renderGridSection('AIR PILOTS', 'fa-plane', AIR_DRIVERS)}
            {activeCategory === 'RAIL' && renderGridSection('RAIL OPERATORS', 'fa-train', RAIL_DRIVERS)}
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

                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#111827' }}>Hire Options</h3>
                
                <div style={{ display: 'flex', gap: '8px', background: '#f3f4f6', padding: '6px', borderRadius: '14px', marginBottom: '24px' }}>
                  <button 
                    onClick={() => setTripType('ONE_WAY')}
                    style={{ flex: 1, padding: '12px', borderRadius: '10px', background: tripType === 'ONE_WAY' ? '#ffffff' : 'transparent', color: tripType === 'ONE_WAY' ? '#111827' : '#6b7280', border: 'none', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: tripType === 'ONE_WAY' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
                  >
                    One Way (Drop)
                  </button>
                  <button 
                    onClick={() => setTripType('HOURLY')}
                    style={{ flex: 1, padding: '12px', borderRadius: '10px', background: tripType === 'HOURLY' ? '#ffffff' : 'transparent', color: tripType === 'HOURLY' ? '#111827' : '#6b7280', border: 'none', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: tripType === 'HOURLY' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
                  >
                    Hourly Package
                  </button>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>{pickupLabel}</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <i className={`fa-solid ${locationIcon}`} style={{ position: 'absolute', left: '16px', top: '16px', color: '#10b981' }}></i>
                        <input 
                          type="text" 
                          style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none' }} 
                          placeholder={placeholder} 
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
                                <i className="fa-solid fa-location-dot" style={{ marginRight: '8px', color: '#9ca3af' }}></i>
                                {s.display_name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => { setPickup('Chennai'); setIsTyping(false); setSuggestions([]); }}
                        style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '10px', padding: '0 20px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <i className="fa-solid fa-location-crosshairs"></i> Near Me
                      </button>
                    </div>
                  </div>

                  {tripType === 'ONE_WAY' ? (
                    <div style={{ marginBottom: '20px', position: 'relative' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>{dropoffLabel}</label>
                      <i className={`fa-solid ${locationIcon}`} style={{ position: 'absolute', left: '16px', top: '38px', color: '#ef4444' }}></i>
                      <input type="text" style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none' }} placeholder={`Enter destination`} value={dropoff} onChange={e => setDropoff(e.target.value)} />
                    </div>
                  ) : (
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>Select Package</label>
                      <select style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none', cursor: 'pointer' }} value={duration} onChange={e => setDuration(e.target.value)}>
                        <option value="4">4 Hrs - 40 Km</option>
                        <option value="8">8 Hrs - 80 Km</option>
                        <option value="12">12 Hrs - 120 Km</option>
                        <option value="24">Outstation (24 Hrs)</option>
                      </select>
                    </div>
                  )}
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>Reporting Date</label>
                      <input type="date" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none' }} value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#4b5563', marginBottom: '6px', textTransform: 'uppercase' }}>Reporting Time</label>
                      <input type="time" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#111827', fontSize: '14px', outline: 'none' }} value={time} onChange={e => setTime(e.target.value)} />
                    </div>
                  </div>

                  {pickup && date && time && selectedVehicleObj && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f9fafb', border: '1px solid #10b98130', borderRadius: '16px', padding: '16px', marginBottom: '24px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        <i className="fa-solid fa-user-check"></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#111827' }}>Ramesh K. <span style={{fontSize:'12px', color:'#f59e0b'}}><i className="fa-solid fa-star"></i> 4.8</span></h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>{selectedVehicleObj.name}</p>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#111827', textAlign: 'right' }}>
                        ₹{(tripType === 'HOURLY' ? selectedVehicleObj.price * (parseInt(duration)/8) : selectedVehicleObj.price).toLocaleString('en-IN')}
                        <div style={{fontSize: '11px', color: '#10b981', fontWeight: '600', textTransform: 'uppercase'}}>Est. Total</div>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleBook}
                    style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#10b981', color: '#ffffff', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s', marginTop: 'auto' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                    onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Map Area */}
            <div style={{ flex: '1 1 500px', position: 'relative', background: '#e5e7eb', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <LeafletMapClient 
                  vehicleIconClass="fa-user-tie" 
                  pickup={pickup}
                  dropoff={tripType === 'ONE_WAY' ? dropoff : undefined}
                  isSearching={tripType === 'ONE_WAY' && !!pickup && !!dropoff}
                />
              </div>
              
              <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10, background: '#ffffff', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>Driver Network Map</div>
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
              <h2 style={{ margin: '0 0 12px 0', fontSize: '28px', fontWeight: '800', color: '#111827' }}>Confirm Driver Booking</h2>
              <p style={{ margin: '0 0 32px 0', color: '#6b7280', fontSize: '16px' }}>Please review your booking details before confirming.</p>
              
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '24px', borderRadius: '16px', textAlign: 'left', marginBottom: '32px' }}>
                <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f4f6', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginRight: '16px' }}>
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reporting Location</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginTop: '4px', lineHeight: '1.4' }}>{pickup}</div>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f4f6', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginRight: '12px' }}>
                      <i className="fa-regular fa-clock"></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date & Time</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginTop: '4px' }}>{date} {time}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3f4f6', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginRight: '12px' }}>
                      <i className="fa-solid fa-user-tie"></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Driver Profile</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827', marginTop: '4px' }}>Ramesh K. (4.8★)</div>
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
                      Confirm Booking Now
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
                      onClick={() => alert("Calling Driver...")}
                      style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#111827', color: '#fff', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
                      onMouseLeave={e => e.currentTarget.style.background = '#111827'}
                    >
                      <i className="fa-solid fa-phone"></i> Call
                    </button>
                    <button 
                      onClick={() => alert("Opening SMS...")}
                      style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#10b981', color: '#fff', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                      onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
                    >
                      <i className="fa-solid fa-comment-sms"></i> SMS
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
