'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const LiveTrackerMap = dynamic(
  () => import('./LeafletMapClient'),
  { ssr: false }
);

const ROAD_CARRIERS = [
  {
    title: 'Bikes, Trucks & Lorries',
    vehicles: [
      { id: 'c-bike', name: 'Delivery Bike / Moto', icon: 'fa-motorcycle', color: '#ff6b6b', price: 150 },
      { id: 'c-auto', name: 'Electric Three-Wheeler Cargo', icon: 'fa-truck-fast', color: '#f59e0b', price: 400 },
      { id: 'c-minitruck', name: 'Small Commercial Mini-Truck', icon: 'fa-truck-pickup', color: '#3b82f6', price: 900 },
      { id: 'c-lcv', name: 'Light Commercial Lorry (LCV)', icon: 'fa-truck', color: '#2563eb', price: 2500 },
      { id: 'c-hcv', name: 'Heavy Rigid Lorry (HCV)', icon: 'fa-truck-front', color: '#8b5cf6', price: 8000 },
      { id: 'c-trailer', name: 'Multi-Axle Semi-Trailer', icon: 'fa-truck-moving', color: '#ec4899', price: 15000 },
    ]
  }
];

const SEA_CARRIERS = [
  {
    title: 'Marine Cargo & Freight',
    vehicles: [
      { id: 'c-barge', name: 'Small Coastal Cargo Barge', icon: 'fa-sailboat', color: '#0ea5e9', price: 25000 },
      { id: 'c-general', name: 'General Cargo Ship', icon: 'fa-ship', color: '#0284c7', price: 150000 },
      { id: 'c-feeder', name: 'Feedership Container Ship', icon: 'fa-anchor', color: '#4f46e5', price: 500000 },
      { id: 'c-mega', name: 'Mega Container Ship', icon: 'fa-ferry', color: '#be123c', price: 2500000 },
    ]
  }
];

const AIR_CARRIERS = [
  {
    title: 'Express Aviation Freight',
    vehicles: [
      { id: 'c-drone', name: 'Delivery Drone / Quadcopter', icon: 'fa-helicopter-symbol', color: '#10b981', price: 500 },
      { id: 'c-belly', name: 'Passenger Aircraft Belly Cargo', icon: 'fa-plane', color: '#f59e0b', price: 15000 },
      { id: 'c-turboprop', name: 'Regional Turboprop Freighter', icon: 'fa-plane-departure', color: '#d97706', price: 120000 },
      { id: 'c-narrow', name: 'Narrow-Body Jet Freighter', icon: 'fa-plane-up', color: '#3b82f6', price: 650000 },
      { id: 'c-wide', name: 'Wide-Body Heavy Jet Freighter', icon: 'fa-globe', color: '#be123c', price: 3500000 },
    ]
  }
];

const RAIL_CARRIERS = [
  {
    title: 'Rail Freight & Bulk Transport',
    vehicles: [
      { id: 'c-freight', name: 'Standard Freight Train', icon: 'fa-train', color: '#8b5cf6', price: 150000 },
      { id: 'c-tanker', name: 'Liquid Tanker Train', icon: 'fa-train-subway', color: '#0ea5e9', price: 200000 },
      { id: 'c-intermodal', name: 'Intermodal Container Train', icon: 'fa-train-tram', color: '#10b981', price: 350000 },
      { id: 'c-heavyhaul', name: 'Heavy-Haul Locomotive', icon: 'fa-train', color: '#f59e0b', price: 500000 },
    ]
  }
];

const ALL_CARRIERS = [
  ...ROAD_CARRIERS.map(c => c.vehicles).flat(),
  ...SEA_CARRIERS.map(c => c.vehicles).flat(),
  ...AIR_CARRIERS.map(c => c.vehicles).flat(),
  ...RAIL_CARRIERS.map(c => c.vehicles).flat()
];

interface CarrierBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CarrierBookingModal({ isOpen, onClose }: CarrierBookingModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'ROAD' | 'SEA' | 'AIR' | 'RAIL'>('ALL');
  const [selectedVehicle, setSelectedVehicle] = useState('c-minitruck');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [scheduleType, setScheduleType] = useState('Now');
  const [bookingRole, setBookingRole] = useState<'Sender' | 'Receiver'>('Sender');

  const [cargoWeight, setCargoWeight] = useState('');
  const [cargoUnit, setCargoUnit] = useState('kg');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [weightError, setWeightError] = useState('');

  const [isSearching, setIsSearching] = useState(false);
  const [isFindingCarrier, setIsFindingCarrier] = useState(false);
  const [isCarrierFound, setIsCarrierFound] = useState(false);
  const [showLocationList, setShowLocationList] = useState(false);
  const [showDropoffList, setShowDropoffList] = useState(false);

  const INDIAN_CITIES = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Vellore', 'Erode', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Kolkata', 'Kochi', 'Thiruvananthapuram', 'Mysuru'];
  
  const getFilteredCities = (input: string) => {
    const term = input.toLowerCase();
    const match = INDIAN_CITIES.find(c => c.toLowerCase().startsWith(term));
    return match || (input.charAt(0).toUpperCase() + input.slice(1));
  };

  const getSimulatedDistance = () => {
    if (!pickup || !dropoff || pickup === 'Current Location') return 15;
    return 10 + (pickup.length + dropoff.length) * 3;
  };
  const estimatedDistance = getSimulatedDistance();

  React.useEffect(() => {
    let timer: any;
    if (isFindingCarrier) {
      timer = setTimeout(() => {
        setIsFindingCarrier(false);
        setIsCarrierFound(true);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isFindingCarrier]);

  React.useEffect(() => {
    const handleUrlState = () => {
      const path = window.location.pathname;
      
      let searchParamsObj = new URLSearchParams();
      if (typeof window !== 'undefined') {
        searchParamsObj = new URLSearchParams(window.location.search);
      }
      
      // Fallback to Next.js searchParams if native is empty (happens during some router syncs)
      const subService = searchParamsObj.get('subService') || (typeof searchParams !== 'undefined' ? searchParams.get('subService') : null);
      const origin = searchParamsObj.get('origin') || (typeof searchParams !== 'undefined' ? searchParams.get('origin') : null);
      const destination = searchParamsObj.get('destination') || (typeof searchParams !== 'undefined' ? searchParams.get('destination') : null);
      
      if (subService || path.startsWith('/home/carrier/')) {
        let vehicleId = '';
        if (subService) {
          vehicleId = subService.toLowerCase();
        } else {
          const parts = path.split('/');
          const lastPart = parts[parts.length - 1];
          if (lastPart && lastPart !== 'carrier') {
            vehicleId = decodeURIComponent(lastPart).replace('-booking', '').toLowerCase();
          }
        }
        
        if (vehicleId) {
          const foundVehicle = ALL_CARRIERS.find(v => v.id.toLowerCase() === vehicleId || v.name.toLowerCase().includes(vehicleId));
          
          if (foundVehicle) {
            setSelectedVehicle(foundVehicle.id);
            
            // Prefill form
            if (origin) setPickup(origin);
            if (destination) setDropoff(destination);
            
            // Aesthetic URL update
            if (typeof window !== 'undefined' && path === '/home/carrier' && subService) {
               try {
                 const nativePushState = Object.getPrototypeOf(window.history).pushState;
                 nativePushState.call(window.history, null, '', `/home/carrier/${foundVehicle.id}`);
               } catch (e) {
                 window.history.pushState(null, '', `/home/carrier/${foundVehicle.id}`);
               }
            }
            
            setStep(2);
            return;
          }
        }
      }

      if (path === '/home/carrier') {
        setStep(1);
      } else if (path === '/' || path === '/home') {
        const { useSartStore } = require('@/store/useSartStore');
        useSartStore.getState().setActiveTab('home');
      }
    };

    const handleReset = () => {
      setStep(1);
    };

    // Check immediately on mount
    handleUrlState();

    window.addEventListener('resetModalSteps', handleReset);
    window.addEventListener('popstate', handleUrlState);
    return () => {
      window.removeEventListener('resetModalSteps', handleReset);
      window.removeEventListener('popstate', handleUrlState);
    };
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
    setCargoWeight('');
    // Use the ID instead of the complex name for a cleaner URL, similar to RideBookingModal
    updateUrl(`/home/carrier/${vehicle.id}`);
  };

  const handleBackToFleet = () => {
    setStep(1);
    updateUrl('/home/carrier');
  };

  const handleClose = () => {
    setStep(1);
    updateUrl('/');
    onClose();
  };

  const handleSwap = () => {
    const temp = pickup;
    setPickup(dropoff);
    setDropoff(temp);
  };

  const selectedVehicleObj = ALL_CARRIERS.find(v => v.id === selectedVehicle);

  let mode = 'ROAD';
  let maxWeightNum = 2000;
  let maxWeightStr = '2000kg';
  
  if (selectedVehicleObj) {
    if (SEA_CARRIERS[0].vehicles.some(v => v.id === selectedVehicleObj.id)) mode = 'SEA';
    if (AIR_CARRIERS[0].vehicles.some(v => v.id === selectedVehicleObj.id)) mode = 'AIR';
    if (RAIL_CARRIERS[0].vehicles.some(v => v.id === selectedVehicleObj.id)) mode = 'RAIL';
    
    // Estimate weight based on vehicle name/id
    if (selectedVehicleObj.id.includes('bike') || selectedVehicleObj.id.includes('moto') || selectedVehicleObj.id.includes('drone')) {
      maxWeightStr = '20kg';
      maxWeightNum = 20;
    } else if (selectedVehicleObj.id.includes('auto') || selectedVehicleObj.id.includes('lcv') || selectedVehicleObj.name.includes('Pickup')) {
      maxWeightStr = '800kg';
      maxWeightNum = 800;
    } else if (selectedVehicleObj.name.includes('Ship') || selectedVehicleObj.name.includes('Train') || selectedVehicleObj.name.includes('Locomotive')) {
      maxWeightStr = '50,000+ kg';
      maxWeightNum = 50000;
    } else {
      maxWeightStr = '5000kg';
      maxWeightNum = 5000;
    }
  }

  const handleWeightChange = (e: any) => {
    const val = e.target.value;
    setCargoWeight(val);
    const parsed = parseInt(val.replace(/[^0-9]/g, ''));
    if (!isNaN(parsed) && parsed > maxWeightNum) {
      setWeightError(`Overweight! Max capacity is ${maxWeightStr}. Please go back and select a larger carrier.`);
    } else {
      setWeightError('');
    }
  };

  const handleBook = () => {
    if (!cargoWeight.trim()) {
      alert("Please enter the cargo weight/quantity.");
      return;
    }
    
    if (weightError) {
      alert("Cannot book: " + weightError);
      return;
    }

    if (!pickup.trim() || !dropoff.trim()) {
      alert("Please enter valid pickup and dropoff locations.");
      return;
    }
    
    if (!contactName.trim() || !contactPhone.trim()) {
      alert("Please fill in the contact details (Name and Phone Number).");
      return;
    }
    
    setIsSearching(true);
    setIsFindingCarrier(true);
  };

  const handleFinalConfirm = () => {
    let vehicleName = 'Cargo Carrier';
    
    const found = ALL_CARRIERS.find(v => v.id === selectedVehicle);
    if (found) {
      vehicleName = found.name;
    }
    
    const dynamicPrice = found ? Math.max(found.price, Math.round(found.price * (estimatedDistance / 20))) : 900;

    let subtitle = `${vehicleName} • Logistics Freight`;
    if (scheduleType === 'Schedule' && (date || time)) {
      subtitle += ` • Scheduled: ${date} ${time}`.trim();
    } else {
      subtitle += ` • Dispatch: Now`;
    }
    
    if ((window as any).executeGenericBooking) {
      (window as any).executeGenericBooking('carrier', `Cargo: ${pickup} to ${dropoff || 'Destination'}`, subtitle, dynamicPrice, { from: pickup, to: dropoff, date: scheduleType === 'Schedule' ? date : 'Now', time: scheduleType === 'Schedule' ? time : 'Now' });
    }
    handleClose();
  };

  let pickupLabel = 'Sender Location';
  let dropoffLabel = 'Receiver Location';
  let routeTitle = 'Route';
  let routeIcon = 'fa-map-location-dot';

  if (mode === 'AIR') {
    pickupLabel = 'Departure Airport / Cargo Terminal';
    dropoffLabel = 'Arrival Airport / Cargo Terminal';
    routeTitle = 'Flight Route';
    routeIcon = 'fa-plane-departure';
  } else if (mode === 'SEA') {
    pickupLabel = 'Departure Port / Freight Terminal';
    dropoffLabel = 'Arrival Port / Freight Terminal';
    routeTitle = 'Shipping Route';
    routeIcon = 'fa-ship';
  } else if (mode === 'RAIL') {
    pickupLabel = 'Origin Freight Station';
    dropoffLabel = 'Destination Freight Station';
    routeTitle = 'Rail Route';
    routeIcon = 'fa-train';
  }

  const renderGridSection = (title: string, icon: string, data: typeof ROAD_CARRIERS) => {
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
      <div className="modal-sheet centered-modal" style={{ maxWidth: step === 2 ? '1200px' : '900px', width: '95%', height: '90vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb', borderRadius: '24px', overflow: 'hidden', transition: 'max-width 0.3s ease' }} onClick={e => e.stopPropagation()}>
        
        {/* Dummy div to absorb the globals.css >div:first-child { display: none } rule */}
        <div style={{ display: 'none' }}></div>
        
        {step === 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <i className="fa-solid fa-truck-fast" style={{ color: '#0ea5e9' }}></i> Cargo & Carrier Booking
            </div>
          </div>
        )}
        
        {step === 1 && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {/* Category Selector */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
              {[
                { id: 'ALL', label: 'All Carriers', icon: 'fa-globe', color: '#f59e0b' },
                { id: 'ROAD', label: 'Road', icon: 'fa-truck', color: '#3b82f6' },
                { id: 'SEA', label: 'Sea & Water', icon: 'fa-ship', color: '#0ea5e9' },
                { id: 'AIR', label: 'Air Freight', icon: 'fa-plane', color: '#8b5cf6' },
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

            {/* Render only active category */}
            {activeCategory === 'ALL' && renderGridSection('ALL CARRIER OPTIONS', 'fa-globe', [{ title: 'All', vehicles: ALL_CARRIERS }] as any)}
            {activeCategory === 'ROAD' && renderGridSection('ROAD CARRIERS', 'fa-truck', ROAD_CARRIERS)}
            {activeCategory === 'SEA' && renderGridSection('SEA / MARINE FREIGHT', 'fa-ship', SEA_CARRIERS)}
            {activeCategory === 'AIR' && renderGridSection('AIR FREIGHT', 'fa-plane', AIR_CARRIERS)}
            {activeCategory === 'RAIL' && renderGridSection('RAIL FREIGHT', 'fa-train', RAIL_CARRIERS)}
          </div>
        )}

        {/* ================= STEP 2: LOGISTICS DASHBOARD (PORTER/MOVERS STYLE) ================= */}
        {step === 2 && (
          <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            
            {/* Left Sidebar (Booking Flow) */}
            <div style={{ width: '460px', background: '#ffffff', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb', zIndex: 10, boxShadow: '4px 0 16px rgba(0,0,0,0.05)', overflowY: 'auto' }}>
              
              {/* Header */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, background: '#fff', zIndex: 20 }}>
                <button onClick={handleBackToFleet} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827' }}>Logistics & Freight</h2>
              </div>


              {/* Form Content OR Carrier Tracking */}
              {isFindingCarrier ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', border: '4px solid #f3f4f6', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '24px' }}></div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>Assigning Carrier...</h3>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '15px' }}>Finding the best {selectedVehicleObj?.name} near you.</p>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
              ) : isCarrierFound ? (
                <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: '#f9fafb' }}>
                  <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                    <i className="fa-solid fa-circle-check"></i> Carrier Assigned Successfully
                  </div>
                  
                  {/* Carrier Card */}
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', background: '#fff', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#9ca3af', overflow: 'hidden' }}>
                          <img src="https://ui-avatars.com/api/?name=Kannan+S&background=random" alt="Driver" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>Kannan S.</div>
                          <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fa-solid fa-star" style={{ color: '#f59e0b' }}></i> 4.9 (420 deliveries)
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#111827', letterSpacing: '1px' }}>TN 12 L 4567</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>{selectedVehicleObj?.name}</div>
                      </div>
                    </div>
                    
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Tracking PIN</div>
                        <div style={{ fontSize: '28px', fontWeight: '900', color: '#0ea5e9', letterSpacing: '4px' }}>5921</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>ETA to Pickup</div>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>12 mins</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    <button style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '2px solid #e2e8f0', background: '#fff', color: '#0f172a', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', transition: 'all 0.2s' }}>
                      <i className="fa-solid fa-message"></i> Message
                    </button>
                    <button style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: '800', fontSize: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)', transition: 'all 0.2s' }}>
                      <i className="fa-solid fa-phone"></i> Call Driver
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button 
                      onClick={() => { setIsCarrierFound(false); setIsSearching(false); }}
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
                <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Cargo Details */}
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-box-open" style={{ color: '#0ea5e9' }}></i> Cargo Details
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <select style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '14px', fontWeight: '600', color: '#111827', outline: 'none' }}>
                        {mode === 'ROAD' && (
                          <>
                            <option>Documents & Parcels</option>
                            <option>Electronics & Appliances</option>
                            <option>Furniture & Home</option>
                            <option>Textiles & Apparel</option>
                            <option>Industrial Goods</option>
                            <option>Perishables / FMCG</option>
                          </>
                        )}
                        {mode === 'SEA' && (
                          <>
                            <option>FCL (Full Container) - 20ft</option>
                            <option>FCL (Full Container) - 40ft</option>
                            <option>LCL (Less than Container Load)</option>
                            <option>Break Bulk / Over-dimensional</option>
                            <option>Liquid Bulk / Chemicals</option>
                            <option>Ro-Ro (Vehicles/Machinery)</option>
                          </>
                        )}
                        {mode === 'AIR' && (
                          <>
                            <option>General Air Freight (ULD)</option>
                            <option>Priority / Express Cargo</option>
                            <option>Temperature Controlled (Pharma)</option>
                            <option>Dangerous Goods (HAZMAT)</option>
                            <option>Live Animals</option>
                            <option>High-Value / Fragile Cargo</option>
                          </>
                        )}
                        {mode === 'RAIL' && (
                          <>
                            <option>Standard Freight Container</option>
                            <option>Bulk Minerals & Coal</option>
                            <option>Agricultural Produce</option>
                            <option>Automobiles & Parts</option>
                            <option>Liquid Tank Wagons</option>
                          </>
                        )}
                      </select>
                      
                      <div style={{ display: 'flex', borderRadius: '12px', border: weightError ? '1px solid #ef4444' : '1px solid #e5e7eb', background: '#f9fafb', width: '150px', overflow: 'hidden' }}>
                        <input type="text" placeholder={`Max ${maxWeightNum}`} value={cargoWeight} onChange={handleWeightChange} style={{ width: '80px', padding: '12px', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '600', color: '#111827', outline: 'none' }} />
                        <select value={cargoUnit} onChange={e => setCargoUnit(e.target.value)} style={{ flex: 1, padding: '12px 8px', border: 'none', borderLeft: '1px solid #e5e7eb', background: 'transparent', fontSize: '13px', fontWeight: '700', color: '#4b5563', outline: 'none', cursor: 'pointer' }}>
                          <option value="kg">kg</option>
                          <option value="lbs">lbs</option>
                          <option value="ton">tons</option>
                          <option value="cbm">cbm</option>
                          <option value="pallets">pallets</option>
                        </select>
                      </div>
                    </div>
                    {weightError && (
                      <div style={{ color: '#ef4444', fontSize: '13px', fontWeight: '700', paddingLeft: '4px' }}>
                        <i className="fa-solid fa-circle-exclamation"></i> {weightError}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Route & Locations */}
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                    <span><i className={`fa-solid ${routeIcon}`} style={{ color: '#f59e0b' }}></i> {routeTitle}</span>
                    <button onClick={handleSwap} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-arrow-right-arrow-left fa-rotate-90"></i> Swap
                    </button>
                  </h3>
                  <div style={{ position: 'relative', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '16px', background: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', marginRight: '16px', flexShrink: 0 }}></div>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', marginBottom: '2px' }}>Pickup (Sender)</div>
                        <input 
                          type="text" 
                          placeholder={pickupLabel} 
                          value={pickup} 
                          onChange={e => {
                            setPickup(e.target.value);
                            setShowLocationList(e.target.value.length > 1);
                            setIsSearching(false);
                          }} 
                          style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '15px', fontWeight: '600', color: '#111827', outline: 'none' }} 
                        />
                        {showLocationList && pickup.length > 1 && (
                          <div style={{ position: 'absolute', top: '100%', left: '0', right: '0', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden', marginTop: '8px' }}>
                            <div onClick={() => { setPickup(getFilteredCities(pickup) + (mode === 'AIR' ? ' Airport' : (mode === 'SEA' ? ' Port' : ' Industrial Estate'))); setShowLocationList(false); setIsSearching(false); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '14px', fontWeight: '600' }}><i className={`fa-solid ${routeIcon}`} style={{ color: '#9ca3af', marginRight: '8px' }}></i> {getFilteredCities(pickup)} {mode === 'AIR' ? 'Airport' : (mode === 'SEA' ? 'Port' : 'Industrial Estate')}</div>
                            <div onClick={() => { setPickup(getFilteredCities(pickup) + ' City Center'); setShowLocationList(false); setIsSearching(false); }} style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}><i className="fa-solid fa-city" style={{ color: '#9ca3af', marginRight: '8px' }}></i> {getFilteredCities(pickup)} City Center</div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ borderLeft: '2px dashed #e5e7eb', marginLeft: '4px', height: '24px', marginBottom: '12px' }}></div>
                    
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '10px', height: '10px', background: '#ef4444', marginRight: '16px', flexShrink: 0 }}></div>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', marginBottom: '2px' }}>Dropoff (Receiver)</div>
                        <input 
                          type="text" 
                          placeholder={dropoffLabel} 
                          value={dropoff} 
                          onChange={e => {
                            setDropoff(e.target.value);
                            setShowDropoffList(e.target.value.length > 1);
                            setIsSearching(false);
                          }} 
                          style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '15px', fontWeight: '600', color: '#111827', outline: 'none' }} 
                        />
                        {showDropoffList && dropoff.length > 1 && (
                          <div style={{ position: 'absolute', top: '100%', left: '0', right: '0', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, overflow: 'hidden', marginTop: '8px' }}>
                            <div onClick={() => { setDropoff(getFilteredCities(dropoff) + (mode === 'AIR' ? ' Airport' : (mode === 'SEA' ? ' Port' : ' Industrial Estate'))); setShowDropoffList(false); setIsSearching(false); }} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', fontSize: '14px', fontWeight: '600' }}><i className={`fa-solid ${routeIcon}`} style={{ color: '#9ca3af', marginRight: '8px' }}></i> {getFilteredCities(dropoff)} {mode === 'AIR' ? 'Airport' : (mode === 'SEA' ? 'Port' : 'Industrial Estate')}</div>
                            <div onClick={() => { setDropoff(getFilteredCities(dropoff) + ' City Center'); setShowDropoffList(false); setIsSearching(false); }} style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}><i className="fa-solid fa-city" style={{ color: '#9ca3af', marginRight: '8px' }}></i> {getFilteredCities(dropoff)} City Center</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Vehicle Summary Card */}
                {selectedVehicleObj && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#ffffff', border: '2px solid #000', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: selectedVehicleObj.color + '15', color: selectedVehicleObj.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                      <i className={`fa-solid ${selectedVehicleObj.icon}`}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Selected Carrier</div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#111827' }}>{selectedVehicleObj.name}</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>
                        {(pickup.length > 1 && dropoff.length > 1 && cargoWeight !== '') ? `₹${Math.max(selectedVehicleObj.price, Math.round(selectedVehicleObj.price * (estimatedDistance / 20))).toLocaleString('en-IN')}` : '--'}
                      </div>
                      {pickup && dropoff && pickup !== 'Current Location' && pickup.length > 1 && dropoff.length > 1 && cargoWeight !== '' && (
                        <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '700', marginTop: '4px' }}>
                          <i className="fa-solid fa-route"></i> ~{estimatedDistance} km route
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Contact Details */}
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button 
                      onClick={() => setBookingRole('Sender')}
                      style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', border: '1px solid', borderColor: bookingRole === 'Sender' ? '#111827' : '#e5e7eb', background: bookingRole === 'Sender' ? '#111827' : '#ffffff', color: bookingRole === 'Sender' ? '#ffffff' : '#4b5563', transition: 'all 0.2s ease' }}
                    >{mode === 'ROAD' ? 'I am the Sender' : 'I am the Shipper'}</button>
                    <button 
                      onClick={() => setBookingRole('Receiver')}
                      style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', border: '1px solid', borderColor: bookingRole === 'Receiver' ? '#111827' : '#e5e7eb', background: bookingRole === 'Receiver' ? '#111827' : '#ffffff', color: bookingRole === 'Receiver' ? '#ffffff' : '#4b5563', transition: 'all 0.2s ease' }}
                    >{mode === 'ROAD' ? 'I am the Receiver' : 'I am the Consignee'}</button>
                  </div>
                  
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-address-book" style={{ color: '#8b5cf6' }}></i> 
                    {bookingRole === 'Sender' 
                      ? (mode === 'ROAD' ? 'Receiver Contact Details' : 'Consignee Details') 
                      : (mode === 'ROAD' ? 'Sender Contact Details' : 'Shipper Details')}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder={mode === 'ROAD' ? "Name" : "Company / Contact Name"} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '14px', fontWeight: '600', color: '#111827', outline: 'none' }} />
                    <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="Phone Number" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '14px', fontWeight: '600', color: '#111827', outline: 'none' }} />
                  </div>
                </div>

                {/* 4. Scheduling */}
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-regular fa-clock" style={{ color: '#14b8a6' }}></i> Dispatch Time
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: scheduleType === 'Schedule' ? '12px' : '0' }}>
                    <button 
                      onClick={() => setScheduleType('Now')}
                      style={{ flex: 1, padding: '10px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', border: '1px solid', borderColor: scheduleType === 'Now' ? '#111827' : '#e5e7eb', background: scheduleType === 'Now' ? '#111827' : '#ffffff', color: scheduleType === 'Now' ? '#ffffff' : '#4b5563', transition: 'all 0.2s ease' }}
                    >Now</button>
                    <button 
                      onClick={() => setScheduleType('Schedule')}
                      style={{ flex: 1, padding: '10px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', border: '1px solid', borderColor: scheduleType === 'Schedule' ? '#111827' : '#e5e7eb', background: scheduleType === 'Schedule' ? '#111827' : '#ffffff', color: scheduleType === 'Schedule' ? '#ffffff' : '#4b5563', transition: 'all 0.2s ease' }}
                    >Schedule</button>
                  </div>
                  {scheduleType === 'Schedule' && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '14px', fontWeight: '600', color: '#111827', outline: 'none' }} />
                      <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '14px', fontWeight: '600', color: '#111827', outline: 'none' }} />
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Bottom Action Bar (Payment & Book) */}
            {!isCarrierFound && !isFindingCarrier && (
              <div style={{ borderTop: '1px solid #e5e7eb', padding: '20px', background: '#ffffff', position: 'sticky', bottom: 0 }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <select style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '14px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: '700', color: '#111827', outline: 'none', cursor: 'pointer', width: '140px' }}>
                    <option>Pay via Cash</option>
                    <option>Pay via UPI</option>
                    <option>Corporate Billed</option>
                  </select>
                  
                  <button 
                    onClick={handleBook}
                    style={{ flex: 1, background: '#111827', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.1s' }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span>Find Carrier</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}

            </div> {/* Close Left Sidebar */}

            {/* Right Sidebar (Live Map for Logistics) */}
            <div style={{ flex: 1, position: 'relative', background: '#e5e7eb', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', backgroundSize: '200px', opacity: 0.6 }}></div>
              
              {/* Map Floating UI Elements */}
              <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '12px', zIndex: 10 }}>
                <div style={{ background: '#ffffff', padding: '10px 16px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '13px', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-location-crosshairs" style={{ color: '#3b82f6' }}></i> Live GPS Active
                </div>
              </div>

              {/* Real Map Integration */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <LiveTrackerMap 
                  key="carrier-map"
                  vehicleIconClass={selectedVehicleObj?.icon || 'fa-truck-fast'} 
                  pickup={pickup}
                  dropoff={dropoff}
                  isSearching={isSearching || isFindingCarrier || isCarrierFound}
                />
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
