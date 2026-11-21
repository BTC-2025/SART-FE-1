'use client';

import React, { useState, useEffect, useRef } from 'react';
import CarrierLocationModal, { LocationResult } from './CarrierLocationModal';

// Pincode Directory & Smart Postal Circle Resolver for ANY 6-digit Indian Pincode
const PINCODE_DIRECTORY: Record<string, { city: string; area: string; fullAddress: string; state: string }> = {
  '600001': {
    city: 'Chennai',
    area: 'George Town, Tamil Nadu (600001)',
    fullAddress: 'No. 12, Rajaji Salai, George Town, Chennai, Tamil Nadu - 600001',
    state: 'Tamil Nadu'
  },
  '560001': {
    city: 'Bengaluru',
    area: 'MG Road, Ashok Nagar, Bengaluru (560001)',
    fullAddress: '45/1, MG Road, Ashok Nagar, Bengaluru, Karnataka - 560001',
    state: 'Karnataka'
  },
  '400001': {
    city: 'Mumbai',
    area: 'Ballard Estate, Fort, Mumbai (400001)',
    fullAddress: 'Port Trust Road, Ballard Estate, Fort, Mumbai, Maharashtra - 400001',
    state: 'Maharashtra'
  },
  '500001': {
    city: 'Hyderabad',
    area: 'Abids / Koti, Hyderabad (500001)',
    fullAddress: 'Station Road, Abids, Hyderabad, Telangana - 500001',
    state: 'Telangana'
  },
  '410501': {
    city: 'Pune',
    area: 'MIDC Chakan, Pune (410501)',
    fullAddress: 'Plot 4, Phase 2 MIDC, Chakan Industrial Area, Pune, Maharashtra - 410501',
    state: 'Maharashtra'
  },
  '632007': {
    city: 'Katpadi',
    area: 'Katpadi Junction, Vellore (632007)',
    fullAddress: 'Goods Shed Rd, Katpadi Junction, Vellore, Tamil Nadu - 632007',
    state: 'Tamil Nadu'
  }
};

function resolvePincodeData(input: string) {
  if (!input) return null;
  const digits = input.replace(/[^0-9]/g, '').slice(0, 6);
  if (digits.length === 6) {
    if (PINCODE_DIRECTORY[digits]) {
      return PINCODE_DIRECTORY[digits];
    }
    let state = 'Tamil Nadu';
    let city = 'Regional Freight Terminal';
    const prefix2 = digits.slice(0, 2);
    if (['60', '61', '62', '63', '64'].includes(prefix2)) {
      state = 'Tamil Nadu';
      city = prefix2 === '60' ? 'Chennai Hub' : prefix2 === '64' ? 'Coimbatore Hub' : 'Tamil Nadu Logistics Circle';
    } else if (['56', '57', '58', '59'].includes(prefix2)) {
      state = 'Karnataka';
      city = 'Bengaluru Hub';
    } else if (['40', '41', '42', '43', '44'].includes(prefix2)) {
      state = 'Maharashtra';
      city = prefix2 === '40' ? 'Mumbai Logistics Park' : 'Pune Logistics Circle';
    } else if (['11', '12', '13'].includes(prefix2)) {
      state = 'Delhi NCR';
      city = 'Delhi Central Cargo Depot';
    } else if (['50', '51', '52', '53'].includes(prefix2)) {
      state = 'Telangana';
      city = 'Hyderabad Cargo Complex';
    } else if (['70', '71', '72', '73'].includes(prefix2)) {
      state = 'West Bengal';
      city = 'Kolkata Port Terminal';
    } else if (['67', '68', '69'].includes(prefix2)) {
      state = 'Kerala';
      city = 'Kochi Terminal';
    }
    return {
      city,
      area: `${city}, ${state} (${digits})`,
      fullAddress: `Plot ${digits.slice(2, 4)}, Logistics Freight Corridor, ${city}, ${state} - ${digits}`,
      state
    };
  }
  return null;
}

export interface CarrierVehicleItem {
  id: string;
  name: string;
  subtitle: string;
  owner: string;
  rating: number;
  trips: number;
  maxPayloadTon: number;
  volumeM3: number;
  bodyType: string;
  distanceKm: number;
  deliveryTime: string;
  features: string[];
  ratePerKm: number;
  totalPrice: number;
  badge?: { text: string; bg: string; color: string; icon: string };
  image: string;
  mode: string;
}

// Initial Owner Fleet: EXACTLY 1 Truck and 1 Bike as added by owner in business website
const INITIAL_OWNER_FLEET: CarrierVehicleItem[] = [
  {
    id: 'CRG-1001',
    name: 'BharatBenz 2823C (14-Wheeler Heavy Multi-Axle)',
    subtitle: '(14-Wheeler Heavy Road Cargo)',
    owner: 'Tata Steel Logistics Hub, Chennai',
    rating: 4.8,
    trips: 142,
    maxPayloadTon: 28,
    volumeM3: 55,
    bodyType: '1 standard 40ft High Cube Container',
    distanceKm: 345,
    deliveryTime: 'Est. Delivery: Sun, Nov 23 (8.5 hrs)',
    features: ['Active Live Telematics / AIS Satellite', 'HAZMAT Certified', '24/7 Driver Support'],
    ratePerKm: 45,
    totalPrice: 15525,
    badge: {
      text: '⭐ BEST VALUE • Owner Verified Fleet',
      bg: '#fef3c7',
      color: '#92400e',
      icon: '⭐'
    },
    image: '/images/carrier_mode_truck.png',
    mode: 'truck'
  },
  {
    id: 'CRG-1002',
    name: 'TVS King Cargo EV Delivery 3-Wheeler',
    subtitle: '(Express Hyperlocal EV / Cargo Bike)',
    owner: 'Chennai Central Last-Mile Hub',
    rating: 4.9,
    trips: 520,
    maxPayloadTon: 0.5,
    volumeM3: 0.85,
    bodyType: 'Insulated Last-Mile Top Box (65L)',
    distanceKm: 25,
    deliveryTime: 'Est. Delivery: 45 mins',
    features: ['Active Live Telematics', 'Cold-Chain Ambient Sealed', 'Contactless Delivery'],
    ratePerKm: 14,
    totalPrice: 450,
    badge: {
      text: '⚡ FASTEST HYPERLOCAL • 100% Green Electric',
      bg: '#ecfeff',
      color: '#0e7490',
      icon: '⚡'
    },
    image: '/images/carrier_mode_bike.png',
    mode: 'bike'
  }
];

interface CarrierBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CarrierBookingModal({ isOpen, onClose }: CarrierBookingModalProps) {
  // Owner-added vehicles state
  const [fleetVehicles, setFleetVehicles] = useState<CarrierVehicleItem[]>(INITIAL_OWNER_FLEET);

  // Selected category mode
  const [activeMode, setActiveMode] = useState<'truck' | 'train' | 'flight' | 'ship' | 'bike' | 'bus'>('truck');

  // Top header dropdown state for "Select Carrier"
  const [isCarrierDropdownOpen, setIsCarrierDropdownOpen] = useState(false);
  const [selectedCarrierName, setSelectedCarrierName] = useState('Heavy Road Truck');
  const carrierDropdownRef = useRef<HTMLDivElement>(null);

  // Pincode Inputs (showing place beside the pincode)
  const [pickupPincodeRaw, setPickupPincodeRaw] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupArea, setPickupArea] = useState('');

  const [deliveryPincodeRaw, setDeliveryPincodeRaw] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('');

  // Form Fields
  const [goodsType, setGoodsType] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'Tons' | 'Kgs'>('Tons');
  const [paymentMode, setPaymentMode] = useState<'prepaid' | 'cod'>('prepaid');

  // Selected vehicle in the list
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('CRG-1001');
  const [date, setDate] = useState('Sat, 21 Nov');

  // Booking completion state
  const [isBooked, setIsBooked] = useState(false);

  // Map Picker Modal State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapTarget, setMapTarget] = useState<'pickup' | 'delivery'>('pickup');

  const handleOpenMap = (target: 'pickup' | 'delivery') => {
    setMapTarget(target);
    setIsMapModalOpen(true);
  };

  const handleSelectLocation = (loc: LocationResult) => {
    if (mapTarget === 'pickup') {
      setPickupAddress(loc.address);
      setPickupCity(loc.city);
      setPickupArea(loc.area);
      if (loc.pincode) setPickupPincodeRaw(loc.pincode);
    } else {
      setDeliveryAddress(loc.address);
      setDeliveryCity(loc.city);
      setDeliveryArea(loc.area);
      if (loc.pincode) setDeliveryPincodeRaw(loc.pincode);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (carrierDropdownRef.current && !carrierDropdownRef.current.contains(e.target as Node)) {
        setIsCarrierDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Owner Added Vehicles from Backend API and sync with local storage
  useEffect(() => {
    const loadOwnerFleet = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/carriers');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.vehicles) && data.vehicles.length > 0) {
            const mapped: CarrierVehicleItem[] = data.vehicles.map((v: any) => ({
              id: v.id,
              name: v.name,
              subtitle: `(${v.type || v.category || 'Owner Fleet'})`,
              owner: v.hub || v.location || 'Verified Business Fleet',
              rating: v.rating || 4.8,
              trips: 100 + Math.floor(Math.random() * 50),
              maxPayloadTon: v.maxPayload || 28,
              volumeM3: v.volumeCapacity || 55,
              bodyType: v.containerSpace || 'Standard Heavy Body',
              distanceKm: 345,
              deliveryTime: 'Est. Delivery: Sun, Nov 23',
              features: [
                v.hasGps ? 'Live GPS Tracking' : 'Standard Fleet Tracking',
                v.isHazmat ? 'HAZMAT Certified' : 'Verified Cargo Clearance',
                'Insurance Covered'
              ],
              ratePerKm: v.ratePerKm || 45,
              totalPrice: Math.round((v.ratePerKm || 45) * 345),
              badge: {
                text: '⭐ VERIFIED OWNER FLEET',
                bg: '#fef3c7',
                color: '#92400e',
                icon: '⭐'
              },
              image: v.mode === 'bike' ? '/images/carrier_mode_bike.png' :
                v.mode === 'ship' ? '/images/carrier_mode_ship.png' : '/images/carrier_mode_truck.png',
              mode: v.mode || 'truck'
            }));
            setFleetVehicles(mapped);
            return;
          }
        }
      } catch (err) { }

      try {
        const saved = localStorage.getItem('logi_pulse_vehicles');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mapped: CarrierVehicleItem[] = parsed.map((v: any) => ({
              id: v.id,
              name: v.name,
              subtitle: `(${v.type || v.category || 'Owner Fleet'})`,
              owner: v.hub || v.location || 'Verified Business Fleet',
              rating: v.rating || 4.8,
              trips: 142,
              maxPayloadTon: v.maxPayload || 28,
              volumeM3: v.volumeCapacity || 55,
              bodyType: v.containerSpace || 'Standard Heavy Body',
              distanceKm: 345,
              deliveryTime: 'Est. Delivery: Sun, Nov 23',
              features: ['Live GPS Tracking', 'Insurance Covered'],
              ratePerKm: v.ratePerKm || 45,
              totalPrice: Math.round((v.ratePerKm || 45) * 345),
              badge: {
                text: '⭐ VERIFIED OWNER FLEET',
                bg: '#fef3c7',
                color: '#92400e',
                icon: '⭐'
              },
              image: v.mode === 'bike' ? '/images/carrier_mode_bike.png' :
                v.mode === 'ship' ? '/images/carrier_mode_ship.png' : '/images/carrier_mode_truck.png',
              mode: v.mode || 'truck'
            }));
            setFleetVehicles(mapped);
          }
        }
      } catch (e) { }
    };

    if (isOpen) {
      loadOwnerFleet();
    }
  }, [isOpen]);

  // Sync place when pickup pincode changes (place appears beside the pincode)
  const handlePickupChange = (val: string) => {
    setPickupPincodeRaw(val);
    const resolved = resolvePincodeData(val);
    if (resolved) {
      setPickupCity(resolved.city);
      setPickupArea(resolved.area);
      setPickupAddress(resolved.fullAddress);
    }
  };

  // Sync place when delivery pincode changes (place appears beside the pincode)
  const handleDeliveryChange = (val: string) => {
    setDeliveryPincodeRaw(val);
    const resolved = resolvePincodeData(val);
    if (resolved) {
      setDeliveryCity(resolved.city);
      setDeliveryArea(resolved.area);
      setDeliveryAddress(resolved.fullAddress);
    }
  };

  // Swap From and To
  const handleSwap = () => {
    const tempPin = pickupPincodeRaw;
    const tempAddr = pickupAddress;
    const tempCity = pickupCity;
    const tempArea = pickupArea;

    setPickupPincodeRaw(deliveryPincodeRaw);
    setPickupAddress(deliveryAddress);
    setPickupCity(deliveryCity);
    setPickupArea(deliveryArea);

    setDeliveryPincodeRaw(tempPin);
    setDeliveryAddress(tempAddr);
    setDeliveryCity(tempCity);
    setDeliveryArea(tempArea);
  };

  const handleReset = () => {
    setPickupPincodeRaw('');
    setPickupAddress('');
    setPickupCity('');
    setPickupArea('');
    setDeliveryPincodeRaw('');
    setDeliveryAddress('');
    setDeliveryCity('');
    setDeliveryArea('');
    setGoodsType('');
    setWeight('');
    setWeightUnit('Tons');
    setPaymentMode('prepaid');
  };

  // Filter vehicles strictly by owner-added fleet
  const currentVehicles = fleetVehicles.filter(v => v.mode === activeMode);

  // Auto-select first vehicle of the mode when switching
  useEffect(() => {
    if (currentVehicles.length > 0) {
      setSelectedVehicleId(currentVehicles[0].id);
      setSelectedCarrierName(currentVehicles[0].name);
    }
  }, [activeMode, fleetVehicles]);

  const selectedVehicle = currentVehicles.find(v => v.id === selectedVehicleId) || currentVehicles[0] || null;

  const tripPrice = selectedVehicle ? selectedVehicle.totalPrice : 15525;
  const advanceDue = Math.round(tripPrice * 0.40);

  // Count available units strictly from what owner added
  const truckCount = fleetVehicles.filter(v => v.mode === 'truck').length;
  const bikeCount = fleetVehicles.filter(v => v.mode === 'bike').length;
  const trainCount = fleetVehicles.filter(v => v.mode === 'train').length;
  const flightCount = fleetVehicles.filter(v => v.mode === 'flight').length;
  const shipCount = fleetVehicles.filter(v => v.mode === 'ship').length;
  const busCount = fleetVehicles.filter(v => v.mode === 'bus').length;

  const modeTabs = [
    { id: 'truck', label: 'Truck', icon: 'fa-solid fa-truck', count: truckCount, available: truckCount > 0 },
    { id: 'train', label: 'Train', icon: 'fa-solid fa-train', count: trainCount, available: trainCount > 0 },
    { id: 'flight', label: 'Flight', icon: 'fa-solid fa-plane', count: flightCount, available: flightCount > 0 },
    { id: 'ship', label: 'Ship', icon: 'fa-solid fa-ship', count: shipCount, available: shipCount > 0 },
    { id: 'bike', label: 'Bike', icon: 'fa-solid fa-motorcycle', count: bikeCount, available: bikeCount > 0 },
    { id: 'bus', label: 'Bus', icon: 'fa-solid fa-bus', count: busCount, available: busCount > 0 }
  ];

  if (!isOpen) return null;

  return (
    <div
      style={{
        display: 'flex',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(3px)',
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        padding: '24px 16px'
      }}
      onClick={onClose}
    >
      <div
        className="modal-sheet centered-modal"
        style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ================= 1. CARRIER HEADER & SEARCH BAR ================= */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* Top Header Row: 🚚 Carrier */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              <i className="fa-solid fa-truck-fast" style={{ color: '#0ea5e9', fontSize: '20px' }}></i>
              <span>Carrier</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Input Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              background: '#ffffff',
              position: 'relative',
              minHeight: '74px'
            }}
          >
            {/* FROM Box */}
            <div
              style={{
                flex: 1.2,
                minWidth: 0,
                padding: '10px 18px',
                borderRight: '1px solid #e2e8f0',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'capitalize', marginBottom: '2px' }}>
                From
              </span>
              <div style={{ fontSize: '16px', fontWeight: 900, color: pickupCity ? '#0f172a' : '#94a3b8', lineHeight: 1.2 }}>
                {pickupCity || 'origin'}
              </div>
              {pickupArea ? (
                <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                  {pickupArea}
                </div>
              ) : null}
              {/* Date Pill: [📅 Date: Sat, 21 Nov ˇ] */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  marginTop: '4px',
                  width: 'fit-content',
                  cursor: 'pointer'
                }}
              >
                <i className="fa-regular fa-calendar-days" style={{ fontSize: '10px', color: '#0284c7' }}></i>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7' }}>Date: {date}</span>
                <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px', color: '#0284c7', marginLeft: '2px' }}></i>
              </div>

              {/* Circular Swap Button ⇄ */}
              <button
                type="button"
                onClick={handleSwap}
                title="Swap From and To"
                style={{
                  position: 'absolute',
                  right: '-14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  fontSize: '11px',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
                }}
              >
                <i className="fa-solid fa-arrow-right-arrow-left"></i>
              </button>
            </div>

            {/* TO Box */}
            <div
              style={{
                flex: 1.2,
                minWidth: 0,
                padding: '10px 18px 10px 24px',
                borderRight: '1px solid #e2e8f0',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'capitalize', marginBottom: '2px' }}>
                To
              </span>
              <div style={{ fontSize: '16px', fontWeight: 900, color: deliveryCity ? '#0f172a' : '#94a3b8', lineHeight: 1.2 }}>
                {deliveryCity || 'destination'}
              </div>
              {deliveryArea ? (
                <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                  {deliveryArea}
                </div>
              ) : null}
            </div>

            {/* SELECT CARRIER Box (Image 8 with Clickable Dropdown) */}
            <div
              ref={carrierDropdownRef}
              onClick={() => setIsCarrierDropdownOpen(!isCarrierDropdownOpen)}
              style={{
                flex: 1.4,
                minWidth: 0,
                padding: '10px 20px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'capitalize', marginBottom: '4px' }}>
                Select Carrier
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i
                    className={activeMode === 'bike' ? 'fa-solid fa-motorcycle' : 'fa-solid fa-truck-moving'}
                    style={{ color: activeMode === 'bike' ? '#f97316' : '#0ea5e9', fontSize: '17px' }}
                  ></i>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '210px' }}>
                    {selectedCarrierName}
                  </span>
                </div>
                <i className="fa-solid fa-chevron-down" style={{ fontSize: '11px', color: '#64748b' }}></i>
              </div>

              {/* POPUP: ALL AVAILABLE CARRIERS DROPDOWN (Image 8 Exact Match) */}
              {isCarrierDropdownOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '380px',
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
                    padding: '16px',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>
                        All Available Carriers
                      </h4>
                      <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                        Select cargo vehicle ({fleetVehicles.length} total)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCarrierDropdownOpen(false)}
                      style={{ background: 'none', border: 'none', fontSize: '14px', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto' }}>
                    {fleetVehicles.map(veh => {
                      const isSelected = selectedVehicleId === veh.id;
                      return (
                        <div
                          key={veh.id}
                          onClick={() => {
                            setSelectedVehicleId(veh.id);
                            setSelectedCarrierName(veh.name);
                            setActiveMode(veh.mode as any);
                            setIsCarrierDropdownOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            border: isSelected ? '1.5px solid #fdba74' : '1px solid #f1f5f9',
                            background: isSelected ? '#fff7ed' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              background: veh.mode === 'bike' ? '#ffedd5' : '#e0f2fe',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: veh.mode === 'bike' ? '#ea580c' : '#0284c7',
                              fontSize: '16px'
                            }}>
                              <i className={veh.mode === 'bike' ? 'fa-solid fa-motorcycle' : 'fa-solid fa-truck-moving'}></i>
                            </div>
                            <div>
                              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                                {veh.name}
                              </div>
                              <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                                Capacity: {veh.maxPayloadTon} Ton • ₹{veh.ratePerKm}/km
                              </div>
                            </div>
                          </div>
                          <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px', color: '#94a3b8' }}></i>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Orange SEARCH > Button */}
            <button
              type="button"
              style={{
                background: '#f25a1b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0 11px 11px 0',
                padding: '0 32px',
                height: '74px',
                fontSize: '16px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                flexShrink: 0,
                alignSelf: 'stretch',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#ea580c')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f25a1b')}
            >
              <span>Search</span>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: '14px' }}></i>
            </button>
          </div>
        </div>

        {/* ================= 2. MODE TABS & PINCODE FORM CARD ================= */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {/* Mode Tabs Row (Dynamic from owner added fleet) */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {modeTabs.map(tab => {
              const isSelected = activeMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveMode(tab.id as any);
                    const firstOfMode = fleetVehicles.find(v => v.mode === tab.id);
                    if (firstOfMode) {
                      setSelectedVehicleId(firstOfMode.id);
                      setSelectedCarrierName(firstOfMode.name);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 16px',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    background: isSelected ? '#f5f3ff' : '#ffffff',
                    color: isSelected ? '#4f46e5' : '#334155',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <i className={tab.icon} style={{ fontSize: '14px', color: isSelected ? '#4f46e5' : '#64748b' }}></i>
                  <span>{tab.label}</span>
                  {tab.available ? (
                    <span
                      style={{
                        fontSize: '11px',
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: 800
                      }}
                    >
                      {tab.count} Available
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '11px',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontWeight: 700
                      }}
                    >
                      Unavailable
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Form Inputs Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Row 1: Pick-up Area Pincode & Delivery Area Pincode */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              {/* Pickup Pincode / Location */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                  Pick-up Area Pincode *
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    background: '#ffffff',
                    position: 'relative',
                    gap: '10px'
                  }}
                >
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => {
                      const text = e.target.value;
                      setPickupAddress(text);
                      handlePickupChange(text);
                    }}
                    placeholder="6-digit pincode / Pickup location"
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      color: '#0f172a',
                      background: 'transparent'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenMap('pickup')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: 800,
                      color: '#2563eb',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#dbeafe')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#eff6ff')}
                  >
                    <i className="fa-solid fa-map-location-dot" style={{ color: '#2563eb' }}></i>
                    <span>Select on Map</span>
                  </button>
                </div>
              </div>

              {/* Delivery Pincode / Location */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                  Delivery Area Pincode *
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    background: '#ffffff',
                    position: 'relative',
                    gap: '10px'
                  }}
                >
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => {
                      const text = e.target.value;
                      setDeliveryAddress(text);
                      handleDeliveryChange(text);
                    }}
                    placeholder="6-digit pincode / Delivery location"
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      color: '#0f172a',
                      background: 'transparent'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleOpenMap('delivery')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontWeight: 800,
                      color: '#2563eb',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#dbeafe')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#eff6ff')}
                  >
                    <i className="fa-solid fa-map-location-dot" style={{ color: '#2563eb' }}></i>
                    <span>Select on Map</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Goods / Product Type & Weight (with Tons / Kgs toggle) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                  Goods / Product Type *
                </label>
                <input
                  type="text"
                  value={goodsType}
                  onChange={(e) => setGoodsType(e.target.value)}
                  placeholder="e.g. Rice Bags, Industrial Machines, Tiles"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #e2e8f0',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    color: '#0f172a',
                    outline: 'none',
                    background: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>
                    Weight *
                  </label>
                  <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px', gap: '2px' }}>
                    <button
                      type="button"
                      onClick={() => setWeightUnit('Tons')}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        background: weightUnit === 'Tons' ? '#4f46e5' : 'transparent',
                        color: weightUnit === 'Tons' ? '#ffffff' : '#64748b'
                      }}
                    >
                      Tons
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightUnit('Kgs')}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        background: weightUnit === 'Kgs' ? '#4f46e5' : 'transparent',
                        color: weightUnit === 'Kgs' ? '#ffffff' : '#64748b'
                      }}
                    >
                      Kgs
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', background: '#ffffff' }}>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="26"
                    style={{
                      flex: 1,
                      padding: '11px 14px',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: '14px',
                      fontWeight: 800,
                      color: '#0f172a'
                    }}
                  />
                  <span style={{ padding: '0 14px', fontSize: '12.5px', fontWeight: 800, color: '#4f46e5', background: '#eef2ff', height: '100%', display: 'flex', alignItems: 'center' }}>
                    {weightUnit}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 3: Payment Mode */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                Payment Mode
              </label>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 800, color: '#4f46e5', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="modalCarrierPaymentMode"
                    checked={paymentMode === 'prepaid'}
                    onChange={() => setPaymentMode('prepaid')}
                  />
                  Prepaid / Advance (40% + Balance on Delivery)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="modalCarrierPaymentMode"
                    checked={paymentMode === 'cod'}
                    onChange={() => setPaymentMode('cod')}
                  />
                  Cash on Delivery
                </label>
              </div>
            </div>

            {/* Action Buttons: Continue to Vehicle Selection & Reset */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '6px' }}>
              <button
                type="button"
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#4f46e5',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '14.5px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                }}
              >
                Continue to Vehicle Selection
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: '#64748b',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
            </div>

          </div>
        </div>

        {/* ================= 3. STEP 2: VEHICLE CARDS (OR BLANK IF UNAVAILABLE) ================= */}
        {/* USER REQUIREMENT:
            "owner added the one bike and one truck only added on the busines webiste that only the user carrer page want to show"
            "when click the truck then related vehicals will get if it is there are else it show blank bellow like that" */}
        {currentVehicles.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '8px 0 4px 0' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                SELECT VEHICLE FOR {weight} {weightUnit.toUpperCase()} ({currentVehicles.length} {activeMode.toUpperCase()}{currentVehicles.length > 1 ? 'S' : ''} FOUND)
              </h3>

            </div>

            {/* Cards Grid: ONLY shows the vehicles added by the owner! */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
              {currentVehicles.map(veh => {
                const isSelected = selectedVehicleId === veh.id;
                return (
                  <div
                    key={veh.id}
                    onClick={() => {
                      setSelectedVehicleId(veh.id);
                      setSelectedCarrierName(veh.name);
                    }}
                    style={{
                      background: isSelected ? '#faf5ff' : '#ffffff',
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #6366f1' : '1px solid #e2e8f0',
                      boxShadow: isSelected ? '0 10px 25px -5px rgba(99, 102, 241, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Floating Pill Badge Above Card */}
                    {veh.badge && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-12px',
                          left: '20px',
                          background: veh.badge.bg,
                          color: veh.badge.color,
                          border: '1px solid rgba(0,0,0,0.08)',
                          padding: '2px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                      >
                        <span>{veh.badge.icon}</span>
                        <span>{veh.badge.text}</span>
                      </div>
                    )}

                    {/* Vehicle Image & Name Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: veh.badge ? '4px' : '0' }}>
                      <div style={{ width: '84px', height: '60px', background: '#f8fafc', borderRadius: '10px', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <img
                          src={veh.image}
                          alt={veh.name}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>
                          {veh.name}
                        </h4>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
                          {veh.subtitle}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                          Owner: <strong>{veh.owner}</strong> (⭐ {veh.rating}, {veh.trips} Trips)
                        </div>
                      </div>
                    </div>

                    {/* Specs Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#475569', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>
                        {veh.maxPayloadTon} Tonnes Max Capacity • {veh.volumeM3} m³ Volume • {veh.bodyType}
                      </div>
                      <div style={{ color: '#64748b' }}>
                        {veh.distanceKm} km • {veh.deliveryTime}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px', color: '#15803d', fontWeight: 700 }}>
                        {veh.features.map(f => (
                          <span key={f}>✓ {f}</span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto' }}>
                      <div>
                        <span style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                          ₹{veh.totalPrice.toLocaleString('en-IN')} Total
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginLeft: '6px' }}>
                          (₹{veh.ratePerKm}/km)
                        </span>
                      </div>

                      {isSelected ? (
                        <button
                          type="button"
                          style={{
                            background: '#4f46e5',
                            color: '#ffffff',
                            border: 'none',
                            padding: '8px 18px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <i className="fa-solid fa-check"></i> SELECTED
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVehicleId(veh.id);
                            setSelectedCarrierName(veh.name);
                          }}
                          style={{
                            background: '#ffffff',
                            color: '#4f46e5',
                            border: '1.5px solid #4f46e5',
                            padding: '8px 18px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          Select Vehicle
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sticky Bottom Bar matching Image */}
            <div
              style={{
                position: 'sticky',
                bottom: '16px',
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                padding: '14px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '20px',
                zIndex: 100
              }}
            >
              <div style={{ fontSize: '14.5px', color: '#0f172a', fontWeight: 700 }}>
                Total Selected: <strong>{selectedVehicle?.name || 'Heavy Road Cargo'}</strong> • Trip Price: <strong>₹{tripPrice.toLocaleString('en-IN')}</strong> • Advance Due Now: <strong style={{ color: '#15803d' }}>₹{advanceDue.toLocaleString('en-IN')}</strong>
              </div>
              <button
                type="button"
                onClick={() => setIsBooked(true)}
                style={{
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '14.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
                }}
              >
                Proceed to Pay Advance & Book Vehicle →
              </button>
            </div>

          </div>
        ) : (
          /* When Unavailable or 0 vehicles added: show BLANK below as requested! */
          <div style={{ height: '40px' }}></div>
        )}

        {/* Confirmation Modal */}
        {isBooked && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#ffffff', borderRadius: '24px', padding: '32px', maxWidth: '460px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                <i className="fa-solid fa-check"></i>
              </div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>Advance Payment Registered!</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                Advance of <strong>₹{advanceDue.toLocaleString('en-IN')}</strong> registered for <strong>{selectedVehicle?.name}</strong>.
              </p>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', width: '100%', fontSize: '13px', color: '#334155', textAlign: 'left', lineHeight: 1.6 }}>
                <div><strong>Pickup:</strong> {pickupAddress}</div>
                <div><strong>Delivery:</strong> {deliveryAddress}</div>
                <div><strong>Goods:</strong> {goodsType} ({weight} {weightUnit})</div>
                <div><strong>Trip Total:</strong> ₹{tripPrice.toLocaleString('en-IN')}</div>
                <div><strong>Advance Due Now:</strong> ₹{advanceDue.toLocaleString('en-IN')} (40%)</div>
                <div><strong>Balance on Delivery:</strong> ₹{(tripPrice - advanceDue).toLocaleString('en-IN')}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsBooked(false);
                  onClose();
                }}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#0f172a', color: '#ffffff', fontSize: '14px', fontWeight: 800, cursor: 'pointer', marginTop: '6px' }}
              >
                Done / Back to Fleet
              </button>
            </div>
          </div>
        )}

        {/* Interactive Map Picker Modal */}
        <CarrierLocationModal
          isOpen={isMapModalOpen}
          target={mapTarget}
          currentValue={mapTarget === 'pickup' ? pickupAddress : deliveryAddress}
          onClose={() => setIsMapModalOpen(false)}
          onSelect={handleSelectLocation}
        />

      </div>
    </div>
  );
}
