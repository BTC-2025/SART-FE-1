'use client';

import React, { useState, useEffect } from 'react';
import { useSartStore } from '@/store/useSartStore';
import dynamic from 'next/dynamic';

const LiveTrackerMap = dynamic(() => import('@/components/LeafletMapClient'), { ssr: false });

const ROAD_RENTAL_FLEET = [
  {
    title: 'Two-Wheelers & Micro-Mobility',
    vehicles: [
      { id: 'r-bicycle', name: 'Geared Bicycle', icon: 'fa-bicycle', color: '#10b981', price: 250 },
      { id: 'r-scooter', name: 'City Scooter (Gearless)', icon: 'fa-motorcycle', color: '#3b82f6', price: 400 },
      { id: 'r-commuter', name: 'Standard Commuter Bike', icon: 'fa-motorcycle', color: '#f59e0b', price: 600 },
      { id: 'r-sports', name: 'Premium Sports Bike', icon: 'fa-motorcycle', color: '#ef4444', price: 1200 },
      { id: 'r-adv', name: 'Adventure Tourer', icon: 'fa-mountain', color: '#8b5cf6', price: 1800 },
    ]
  },
  {
    title: 'Economy & City Cars',
    vehicles: [
      { id: 'r-micro', name: 'Micro Hatchback', icon: 'fa-car-side', color: '#0ea5e9', price: 1500 },
      { id: 'r-premium-hatch', name: 'Premium Hatchback', icon: 'fa-car', color: '#6366f1', price: 2000 },
      { id: 'r-sedan', name: 'Standard Sedan', icon: 'fa-car', color: '#3b82f6', price: 2500 },
    ]
  },
  {
    title: 'Premium & Executive Cars',
    vehicles: [
      { id: 'r-exec', name: 'Executive Sedan', icon: 'fa-briefcase', color: '#1d4ed8', price: 4500 },
      { id: 'r-luxury', name: 'Luxury Sedan', icon: 'fa-gem', color: '#8b5cf6', price: 8000 },
      { id: 'r-sports-car', name: 'Sports / Convertible', icon: 'fa-car-burst', color: '#e11d48', price: 15000 },
    ]
  },
  {
    title: 'SUVs & Off-Roaders',
    vehicles: [
      { id: 'r-csuv', name: 'Compact SUV', icon: 'fa-truck-pickup', color: '#ec4899', price: 3000 },
      { id: 'r-4x4', name: '4x4 Off-Roader', icon: 'fa-mountain-sun', color: '#f97316', price: 5500 },
      { id: 'r-premium-suv', name: 'Premium 7-Seater SUV', icon: 'fa-crown', color: '#eab308', price: 7000 },
      { id: 'r-luxury-suv', name: 'Luxury Full-Size SUV', icon: 'fa-truck-monster', color: '#be123c', price: 12000 },
    ]
  },
  {
    title: 'Vans, RVs & Specialty',
    vehicles: [
      { id: 'r-minivan', name: 'Passenger Minivan (8 Seater)', icon: 'fa-van-shuttle', color: '#14b8a6', price: 4000 },
      { id: 'r-camper', name: 'Camper Van / RV', icon: 'fa-caravan', color: '#06b6d4', price: 8500 },
      { id: 'r-vanity', name: 'Luxury Vanity Van', icon: 'fa-star', color: '#db2777', price: 25000 },
      { id: 'r-moving', name: 'Self-Drive Moving Truck', icon: 'fa-truck', color: '#4f46e5', price: 5000 },
    ]
  }
];

const SEA_RENTAL_FLEET = [
  {
    title: 'Personal Watercraft',
    vehicles: [
      { id: 'r-jetski', name: 'Jet Ski / WaveRunner', icon: 'fa-water', color: '#0ea5e9', price: 3500 },
      { id: 'r-skiff', name: 'Small Motorboat / Skiff', icon: 'fa-sailboat', color: '#38bdf8', price: 6000 },
    ]
  },
  {
    title: 'Private Charters & Speedboats',
    vehicles: [
      { id: 'r-speedboat', name: 'Standard Speedboat', icon: 'fa-ship', color: '#0284c7', price: 12000 },
      { id: 'r-cabin', name: 'Premium Cabin Cruiser', icon: 'fa-anchor', color: '#0369a1', price: 25000 },
    ]
  },
  {
    title: 'Luxury Yachts & Catamarans',
    vehicles: [
      { id: 'r-catamaran', name: 'Sailing Catamaran', icon: 'fa-sailboat', color: '#0f766e', price: 45000 },
      { id: 'r-yacht', name: 'Luxury Private Yacht', icon: 'fa-champagne-glasses', color: '#eab308', price: 150000 },
    ]
  }
];

const AIR_RENTAL_FLEET = [
  {
    title: 'Urban Air Mobility & Choppers',
    vehicles: [
      { id: 'r-evtol', name: 'eVTOL / Air Taxi', icon: 'fa-helicopter-symbol', color: '#10b981', price: 35000 },
      { id: 'r-chopper', name: 'Light Helicopter', icon: 'fa-helicopter', color: '#059669', price: 85000 },
    ]
  },
  {
    title: 'Private Jets & Charters',
    vehicles: [
      { id: 'r-lightjet', name: 'Light Private Jet', icon: 'fa-plane-up', color: '#8b5cf6', price: 250000 },
      { id: 'r-heavyjet', name: 'Heavy Ultra-Long-Range Jet', icon: 'fa-gem', color: '#7c3aed', price: 850000 },
    ]
  }
];

const RAIL_RENTAL_FLEET = [
  {
    title: 'Private Rail & Saloon Cars',
    vehicles: [
      { id: 'r-saloon', name: 'Private Saloon Car', icon: 'fa-train', color: '#8b5cf6', price: 45000 },
      { id: 'r-tourist', name: 'Private Tourist Train', icon: 'fa-champagne-glasses', color: '#eab308', price: 250000 },
    ]
  }
];

const RENTAL_MASTER_CATEGORIES = [
  { id: 'bike', name: 'Bikes & Scooters', icon: 'fa-motorcycle', color: '#f59e0b', desc: 'Commuters & Sports Bikes', type: 'ROAD', list: ROAD_RENTAL_FLEET[0].vehicles },
  { id: 'car', name: 'Cars & Sedans', icon: 'fa-car-side', color: '#3b82f6', desc: 'Hatchbacks & Premium Sedans', type: 'ROAD', list: [...ROAD_RENTAL_FLEET[1].vehicles, ...ROAD_RENTAL_FLEET[2].vehicles] },
  { id: 'suv', name: 'SUVs & Off-Roaders', icon: 'fa-mountain-sun', color: '#ec4899', desc: 'Compact & Luxury SUVs', type: 'ROAD', list: ROAD_RENTAL_FLEET[3].vehicles },
  { id: 'van', name: 'Vans & Specialty', icon: 'fa-van-shuttle', color: '#10b981', desc: 'Minivans & RVs', type: 'ROAD', list: ROAD_RENTAL_FLEET[4].vehicles },
  { id: 'water', name: 'Boats & Yachts', icon: 'fa-ship', color: '#0ea5e9', desc: 'Speedboats & Private Yachts', type: 'SEA', list: [...SEA_RENTAL_FLEET[0].vehicles, ...SEA_RENTAL_FLEET[1].vehicles, ...SEA_RENTAL_FLEET[2].vehicles] },
  { id: 'air', name: 'Air Charters', icon: 'fa-plane', color: '#8b5cf6', desc: 'Helicopters & Private Jets', type: 'AIR', list: [...AIR_RENTAL_FLEET[0].vehicles, ...AIR_RENTAL_FLEET[1].vehicles] },
  { id: 'rail', name: 'Train Charters', icon: 'fa-train', color: '#ef4444', desc: 'Saloon Cars & Tourist Trains', type: 'RAIL', list: RAIL_RENTAL_FLEET[0].vehicles }
];

interface RentalBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

class ModalErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ zIndex: 9999, position: 'fixed', top: '100px', left: '20px', background: 'red', color: 'white', padding: '20px', borderRadius: '10px' }}>
          <h2>Modal Crash!</h2>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function RentalBookingModalWrapper(props: RentalBookingModalProps) {
  return (
    <ModalErrorBoundary>
      <RentalBookingModal {...props} />
    </ModalErrorBoundary>
  );
}

function RentalBookingModal({ isOpen, onClose }: RentalBookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMasterId, setSelectedMasterId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  useEffect(() => {
    const handleUrlState = () => {
      const path = window.location.pathname;
      if (path.includes('-checkout')) {
        setStep(3);
      } else if (path.includes('-rental')) {
        setStep(2);
        const parts = path.split('/');
        if (parts.length > 3) {
          const name = decodeURIComponent(parts[3].split('-')[0]);
          const found = RENTAL_MASTER_CATEGORIES.find(m => m.name.startsWith(name) || m.id === name);
          if (found) setSelectedMasterId(found.id);
        }
      } else if (path === '/home/rental') {
        setStep(1);
      } else if (path === '/' || path === '/home') {
        useSartStore.getState().setActiveTab('home');
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
  
  // Form State
  const [pickup, setPickup] = useState('');
  const [rentalType, setRentalType] = useState('Hourly');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [showLocationList, setShowLocationList] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const INDIAN_CITIES = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Vellore', 'Erode', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Kochi', 'Mysuru'];
  
  const getFilteredCities = (input: string) => {
    const term = input.toLowerCase();
    const match = INDIAN_CITIES.find(c => c.toLowerCase().startsWith(term));
    return match || (input.charAt(0).toUpperCase() + input.slice(1));
  };

  useEffect(() => {
    const handleReset = () => {
      setStep(1);
      setIsProcessing(false);
      setIsConfirmed(false);
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

  const handleSelectMaster = (master: any) => {
    setSelectedMasterId(master.id);
    if (master.list.length > 0) {
      setSelectedVehicleId(master.list[0].id);
    }
    setStep(2);
    
    // Update URL dynamically
    const cleanName = master.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    updateUrl(`/home/rental/${cleanName}`);
  };

  const handleBackToFleet = () => {
    setStep(1);
    updateUrl('/home/rental');
  };

  const handleClose = () => {
    setStep(1);
    updateUrl('/');
    useSartStore.getState().setActiveTab('home');
    onClose();
  };

  const handleBook = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);
      
      // We no longer trigger a page reload or generic popup here.
      // We want to keep the modal open to show the new interactive Dashboard!
    }, 2000);
  };
  
  const handleFinalConfirm = () => {
    let vehicleName = 'Self-Drive Vehicle';
    let vehiclePrice = 1500;
    
    const master = RENTAL_MASTER_CATEGORIES.find(m => m.id === selectedMasterId);
    if (master) {
      const found = master.list.find((v: any) => v.id === selectedVehicleId);
      if (found) {
        vehicleName = found.name;
        vehiclePrice = found.price;
      }
    }

    let subtitle = `${vehicleName} • ${rentalType} Rental`;
    if (startDate && returnDate) {
      subtitle += ` • From ${startDate} to ${returnDate}`;
    }
    
    if ((window as any).executeGenericBooking) {
      (window as any).executeGenericBooking('rental', `Rental: ${pickup}`, subtitle, vehiclePrice, { from: pickup, startDate, startTime, returnDate, returnTime, rentalType });
    }
    window.location.reload();
  };

  const activeMaster = RENTAL_MASTER_CATEGORIES.find(m => m.id === selectedMasterId);
  const activeVehicle = activeMaster?.list.find((v: any) => v.id === selectedVehicleId);

  // Global Timespan Calculation
  let diffMs = 0;
  let diffHours = 0;
  let multiplier = 1;
  let unitStr = '';
  let isTimespanValid = false;

  if (startDate && startTime && returnDate && returnTime) {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    diffMs = end.getTime() - start.getTime();
    if (diffMs > 0 && !isNaN(diffMs)) {
      isTimespanValid = true;
      diffHours = diffMs / (1000 * 60 * 60);
      
      if (rentalType === 'Hourly') {
        multiplier = Math.ceil(diffHours);
        unitStr = `${multiplier} Hour${multiplier > 1 ? 's' : ''}`;
      } else if (rentalType === 'Daily') {
        multiplier = Math.ceil(diffHours / 24) || 1;
        unitStr = `${multiplier} Day${multiplier > 1 ? 's' : ''}`;
      } else if (rentalType === 'Weekly') {
        multiplier = Math.ceil(diffHours / (24 * 7)) || 1;
        unitStr = `${multiplier} Week${multiplier > 1 ? 's' : ''}`;
      } else if (rentalType === 'Monthly') {
        multiplier = Math.ceil(diffHours / (24 * 30)) || 1;
        unitStr = `${multiplier} Month${multiplier > 1 ? 's' : ''}`;
      }
    }
  }

  const isFormComplete = pickup.length > 2 && pickup !== 'Current Location' && isTimespanValid;

  return (
    <div className="modal-overlay open" style={{ display: 'flex', zIndex: 1000, background: 'rgba(0,0,0,0.6)' }} onClick={handleClose}>
      <div className="modal-sheet centered-modal" style={{ maxWidth: '1000px', width: '95%', height: '90vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} onClick={e => e.stopPropagation()}>
        
        {/* HACK: globals.css has `#tab-service-pages .modal-sheet>div:first-child { display: none !important; }`
            This dummy div absorbs that CSS rule so our actual content doesn't get hidden! */}
        <div className="dummy-modal-header-for-css-hack"></div>

        {/* ================= STEP 1: MASTER CATEGORIES ================= */}
        {step === 1 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fa-solid fa-key" style={{ color: '#0ea5e9' }}></i> Self-Drive & Rentals
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#ffffff' }}>
              <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: '800', color: '#111827' }}>What would you like to rent?</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {RENTAL_MASTER_CATEGORIES.map(m => (
                  <div 
                    key={m.id}
                    onClick={() => handleSelectMaster(m)}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: '#ffffff',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
                  >
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: m.color + '20', color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '16px' }}>
                      <i className={`fa-solid ${m.icon}`}></i>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#1f2937', textAlign: 'center', marginBottom: '8px' }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
                      {m.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ================= STEP 2 & 3: BOOKING DASHBOARD (ZOOMCAR STYLE) ================= */}
        {(step === 2 || step === 3) && activeMaster && (
          <div style={{ display: 'flex', flex: 1, height: '80vh', overflow: 'hidden' }}>
            
            {/* Left Sidebar (Booking Form) */}
            <div style={{ width: '420px', background: '#ffffff', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb', zIndex: 10, boxShadow: '4px 0 16px rgba(0,0,0,0.05)', overflowY: 'auto' }}>
              
              {/* Header */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, background: '#fff', zIndex: 20 }}>
                <button onClick={step === 3 ? () => setStep(2) : handleBackToFleet} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827' }}>{step === 3 ? 'Booking Summary' : activeMaster.name}</h2>
              </div>

              {/* Form Content - Only show if not processing/confirmed */}
              {!isProcessing && !isConfirmed ? (
                <>
                  <div style={{ padding: '24px 24px 0 24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {activeMaster.type === 'SEA' ? 'Port of Departure' : 
                         activeMaster.type === 'AIR' ? 'Departure Airport' : 
                         activeMaster.type === 'RAIL' ? 'Boarding Station' : 
                         'Pick-up Location'}
                      </label>
                      <div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '12px 16px' }}>
                          <i className={`fa-solid ${activeMaster.type === 'SEA' ? 'fa-anchor' : activeMaster.type === 'AIR' ? 'fa-plane-departure' : activeMaster.type === 'RAIL' ? 'fa-train' : 'fa-location-dot'}`} style={{ color: '#10b981', marginRight: '12px', fontSize: '18px' }}></i>
                          <input 
                            type="text" 
                            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '15px', fontWeight: '600', color: '#111827' }} 
                            placeholder={
                              activeMaster.type === 'SEA' ? 'Enter Port or Marina' : 
                              activeMaster.type === 'AIR' ? 'Enter Airport or Helipad' : 
                              activeMaster.type === 'RAIL' ? 'Enter Railway Station' : 
                              'Enter City, Airport, or Address'
                            }
                            value={pickup} 
                            onChange={e => {
                              setPickup(e.target.value);
                              setShowLocationList(e.target.value.length > 1);
                            }} 
                          />
                          <button 
                            onClick={() => setPickup('Chennai City Hub')}
                            style={{ border: 'none', background: 'transparent', color: '#0ea5e9', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Use Current Location"
                          >
                            <i className="fa-solid fa-location-crosshairs" style={{ fontSize: '16px' }}></i>
                          </button>
                        </div>
                        {showLocationList && pickup.length > 1 && (
                          <div style={{ position: 'absolute', top: '100%', left: '0', right: '0', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden', marginTop: '8px' }}>
                            <div onClick={() => { setPickup(getFilteredCities(pickup) + ' Airport'); setShowLocationList(false); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '14px', fontWeight: '600' }}><i className="fa-solid fa-plane-departure" style={{ color: '#9ca3af', marginRight: '8px' }}></i> {getFilteredCities(pickup)} Airport</div>
                            <div onClick={() => { setPickup(getFilteredCities(pickup) + ' City Hub'); setShowLocationList(false); }} style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}><i className="fa-solid fa-city" style={{ color: '#9ca3af', marginRight: '8px' }}></i> {getFilteredCities(pickup)} City Hub</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rental Duration Plan</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {['Hourly', 'Daily', 'Weekly', 'Monthly'].map(type => (
                          <button 
                            key={type}
                            onClick={() => setRentalType(type)}
                            style={{ padding: '10px', borderRadius: '8px', border: rentalType === type ? `1px solid ${activeMaster.color}` : '1px solid #e5e7eb', background: rentalType === type ? activeMaster.color + '10' : '#ffffff', color: rentalType === type ? activeMaster.color : '#4b5563', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                        <div style={{ width: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '3px solid #10b981' }}></div>
                          <div style={{ width: '2px', height: '24px', background: '#e5e7eb' }}></div>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>START</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', flex: 1, outline: 'none' }} />
                              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', width: '110px', outline: 'none' }} />
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>END</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', flex: 1, outline: 'none' }} />
                              <input type="time" value={returnTime} onChange={e => setReturnTime(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', width: '110px', outline: 'none' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ background: '#f9fafb', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563', fontWeight: '600' }}>
                        <i className="fa-solid fa-clock" style={{ color: '#f59e0b' }}></i> Ensure accurate drop-off time to avoid penalties.
                      </div>
                    </div>
                  </div>

                  {/* Zoomcar Flow: Only show vehicles when form is complete */}
                  {isFormComplete ? (
                    <div style={{ padding: '0 24px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available Vehicles</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {activeMaster.list.map((v: any) => {
                          let baseRate = 0;
                          if (rentalType === 'Hourly') baseRate = Math.max(50, Math.round(v.price / 10)) * multiplier;
                          else if (rentalType === 'Daily') baseRate = v.price * multiplier;
                          else if (rentalType === 'Weekly') baseRate = Math.round(v.price * 6) * multiplier;
                          else if (rentalType === 'Monthly') baseRate = Math.round(v.price * 20) * multiplier;
                          
                          const taxes = Math.round(baseRate * 0.18);
                          const total = baseRate + taxes;
                          
                          return (
                            <div 
                              key={v.id}
                              onClick={() => setSelectedVehicleId(v.id)}
                              style={{
                                background: '#ffffff',
                                border: selectedVehicleId === v.id ? `2px solid ${activeMaster.color}` : '1px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: selectedVehicleId === v.id ? `0 4px 12px ${activeMaster.color}20` : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px'
                              }}
                            >
                              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: v.color + '15', color: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                                <i className={`fa-solid ${v.icon}`}></i>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>{v.name}</div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>{unitStr}</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: activeMaster.color }}>₹{total}</div>
                                <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600' }}>Includes ₹{taxes} taxes</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Rental Details Breakdown block (Restored for user visibility) */}
                      {selectedVehicleId && (
                        <div style={{ marginTop: '24px', padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                          <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>Rental Details</h4>
                          {(() => {
                            const v = activeMaster.list.find((v: any) => v.id === selectedVehicleId);
                            if (!v) return null;
                            let baseRate = 0;
                            if (rentalType === 'Hourly') baseRate = Math.max(50, Math.round(v.price / 10)) * multiplier;
                            else if (rentalType === 'Daily') baseRate = v.price * multiplier;
                            else if (rentalType === 'Weekly') baseRate = Math.round(v.price * 6) * multiplier;
                            else if (rentalType === 'Monthly') baseRate = Math.round(v.price * 20) * multiplier;
                            const taxes = Math.round(baseRate * 0.18);
                            const total = baseRate + taxes;
                            return (
                              <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <span style={{ color: '#64748b', fontSize: '13px' }}>Base Fare ({unitStr})</span>
                                  <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '13px' }}>₹{baseRate}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <span style={{ color: '#64748b', fontSize: '13px' }}>Taxes & Fees (18%)</span>
                                  <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '13px' }}>₹{taxes}</span>
                                </div>
                                <div style={{ borderTop: '1px dashed #cbd5e1', margin: '12px 0' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '15px' }}>Total Amount</span>
                                  <span style={{ fontWeight: '900', color: activeMaster.color, fontSize: '18px' }}>₹{total}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#9ca3af' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                        <i className="fa-solid fa-car"></i>
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', maxWidth: '200px' }}>Enter pick-up location and dates to view available vehicles and exact pricing.</p>
                    </div>
                  )}
                </>
              ) : step === 3 && !isProcessing && !isConfirmed ? (
                <div style={{ padding: '24px', flex: 1 }}>
                  <div style={{ background: '#f9fafb', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-file-invoice" style={{ color: activeMaster.color }}></i> Booking Details
                    </h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px dashed #d1d5db' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: activeVehicle?.color + '15', color: activeVehicle?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                        <i className={`fa-solid ${activeVehicle?.icon}`}></i>
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#111827' }}>{activeVehicle?.name}</div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>Self-Drive Rental</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px dashed #d1d5db' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#6b7280' }}>Pick-up Hub</span>
                        <span style={{ fontWeight: '700', color: '#111827' }}>{pickup}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#6b7280' }}>Duration</span>
                        <span style={{ fontWeight: '700', color: '#111827' }}>{unitStr}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#6b7280' }}>Start</span>
                        <span style={{ fontWeight: '700', color: '#111827' }}>{startDate} {startTime}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#6b7280' }}>End</span>
                        <span style={{ fontWeight: '700', color: '#111827' }}>{returnDate} {returnTime}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#111827' }}>Total Amount</span>
                      <span style={{ fontSize: '24px', fontWeight: '800', color: activeMaster.color }}>
                        ₹{(() => {
                          let base = 0;
                          if (rentalType === 'Hourly') base = Math.max(50, Math.round((activeVehicle?.price || 0) / 10)) * multiplier;
                          else if (rentalType === 'Daily') base = (activeVehicle?.price || 0) * multiplier;
                          else if (rentalType === 'Weekly') base = Math.round((activeVehicle?.price || 0) * 6) * multiplier;
                          else if (rentalType === 'Monthly') base = Math.round((activeVehicle?.price || 0) * 20) * multiplier;
                          return base + Math.round(base * 0.18);
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : isConfirmed ? (
                <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: '#f9fafb', overflowY: 'auto' }}>
                  <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <i className="fa-solid fa-circle-check"></i> Vehicle Reserved Successfully
                  </div>
                  
                  {/* Vehicle Card */}
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', background: '#fff', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: activeVehicle?.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: activeVehicle?.color }}>
                          <i className={`fa-solid ${activeVehicle?.icon}`}></i>
                        </div>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{activeVehicle?.name}</div>
                          <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fa-solid fa-location-dot" style={{ color: '#0ea5e9' }}></i> Hub: {pickup}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#111827', letterSpacing: '1px' }}>TN 34 R 9081</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>License Plate</div>
                      </div>
                    </div>
                    
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Booking PIN</div>
                        <div style={{ fontSize: '28px', fontWeight: '900', color: '#0ea5e9', letterSpacing: '4px' }}>8420</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Status</div>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>Ready for Pickup</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    <button style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', background: '#fff', color: '#0f172a', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', transition: 'all 0.2s' }}>
                      <i className="fa-solid fa-message"></i> Message Hub
                    </button>
                    <button style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', background: activeMaster.color, color: '#fff', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', boxShadow: `0 4px 12px ${activeMaster.color}40`, transition: 'all 0.2s' }}>
                      <i className="fa-solid fa-phone"></i> Call Hub
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button 
                      onClick={() => { setIsConfirmed(false); setStep(2); }}
                      style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '2px solid #ef4444', background: '#fff', color: '#ef4444', fontWeight: '800', fontSize: '15px', cursor: 'pointer', transition: 'background 0.2s' }}
                    >
                      Cancel Booking
                    </button>
                    <button 
                      onClick={handleFinalConfirm}
                      style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', background: '#111827', color: '#fff', fontWeight: '800', fontSize: '15px', cursor: 'pointer', transition: 'background 0.2s' }}
                    >
                      Finish
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1 }}>
                  {isProcessing && (
                    <>
                      <div style={{ width: '48px', height: '48px', border: `4px solid ${activeMaster.color}20`, borderTop: `4px solid ${activeMaster.color}`, borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '24px' }}></div>
                      <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>Securing Booking...</h3>
                      <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Please wait while we process your request.</p>
                      <style>{`
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                      `}</style>
                    </>
                  )}
                </div>
              )}

              {/* Bottom Action - Only show if not processing/confirmed AND if form is complete */}
              {!isProcessing && !isConfirmed && isFormComplete && step === 2 && (
                <div style={{ padding: '20px', background: '#ffffff', borderTop: '1px solid #e5e7eb', position: 'sticky', bottom: 0, marginTop: 'auto', zIndex: 10 }}>
                  <button 
                    onClick={() => setStep(3)}
                    style={{ width: '100%', background: activeMaster.color, color: '#ffffff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}

              {/* Bottom Action - Step 3 (Confirm / Cancel) */}
              {!isProcessing && !isConfirmed && step === 3 && (
                <div style={{ padding: '20px', background: '#ffffff', borderTop: '1px solid #e5e7eb', position: 'sticky', bottom: 0, marginTop: 'auto', zIndex: 10, display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setStep(2)}
                    style={{ flex: 1, background: '#f3f4f6', color: '#4b5563', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleBook}
                    style={{ flex: 2, background: activeMaster.color, color: '#ffffff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
            </div>

            {/* Right Sidebar (Live Map for Rentals) */}
            <div style={{ flex: 1, position: 'relative', background: '#e5e7eb', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <LiveTrackerMap 
                  key="rental-map"
                  vehicleIconClass={activeVehicle?.icon || 'fa-car'} 
                  pickup={pickup}
                  dropoff=""
                  isSearching={false}
                />
              </div>
              
              <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10, background: '#ffffff', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>Live Fleet Map</div>
              </div>
              
              {pickup && pickup !== 'Current Location' && (
                <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, background: '#111827', color: '#fff', padding: '12px 24px', borderRadius: '24px', fontSize: '14px', fontWeight: '700', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                  <i className="fa-solid fa-location-dot" style={{ marginRight: '8px', color: '#10b981' }}></i> Viewing Hub: {pickup}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
