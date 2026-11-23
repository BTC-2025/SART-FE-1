'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import CarrierLocationModal, { LocationResult } from '@/components/CarrierLocationModal';

// Pincode Directory & Smart Postal Circle Resolver for ANY 6-digit Indian Pincode
const PINCODE_DIRECTORY: Record<string, { city: string; area: string; fullAddress: string; state: string }> = {

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
  brand?: string;
  model?: string;
  subtitle: string;
  owner: string;
  rating: number;
  trips: number;
  maxPayload?: number | string;
  weightUnit?: string;
  maxPayloadTon: number;
  fuel?: string;
  regId?: string;
  hub?: string;
  containerSpace?: string;
  volumeM3: number;
  bodyType: string;
  distanceKm: number;
  deliveryTime: string;
  features: string[];
  hasGps?: boolean;
  isReefer?: boolean;
  isHazmat?: boolean;
  baseCharge?: number;
  ratePerKm: number;
  advancePercent?: number;
  deposit?: number;
  pricingText?: string;
  totalPrice: number;
  badge?: { text: string; bg: string; color: string; icon: string };
  image: string;
  mode: string;
  isAvailable?: boolean;
}

// Initial Owner-Added Fleet: Only loads vehicles added by owner in the business website
const INITIAL_OWNER_FLEET: CarrierVehicleItem[] = [];

function CarrierContent() {
  const router = useRouter();

  // Owner-added vehicles state
  const [fleetVehicles, setFleetVehicles] = useState<CarrierVehicleItem[]>(INITIAL_OWNER_FLEET);

  // Selected category mode
  const [activeMode, setActiveMode] = useState<'truck' | 'train' | 'flight' | 'ship' | 'bike' | 'bus'>('bike');

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

  // Close carrier dropdown when clicking outside
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
    const parseCarrier = (v: any): CarrierVehicleItem => {
      const mode = (v.mode || v.type || 'truck').toLowerCase();
      const isBike = mode === 'bike';
      const isShip = mode === 'ship';
      const isTrain = mode === 'train';
      const isFlight = mode === 'flight';
      const isKg = v.weightUnit?.toLowerCase()?.includes('kg');
      const pLoad = isKg ? ((Number(v.maxPayload) || 150) / 1000) : (Number(v.maxPayload) || (isShip ? 52000 : 28));

      const defaultRate = isBike ? 14 : isShip ? 650 : isTrain ? 120 : isFlight ? 380 : 48;
      const defaultBase = isBike ? 120 : isShip ? 120000 : isTrain ? 35000 : isFlight ? 45000 : 1800;
      const defaultAdvance = isBike ? 25 : isShip ? 40 : 30;
      const defaultDeposit = isBike ? 1000 : isShip ? 200000 : 3000;

      const rate = Number(v.ratePerKm || defaultRate);
      const base = Number(v.baseCharge || defaultBase);
      const total = base ? base : Math.round(rate * (isBike ? 25 : 345));

      // Max Load string formatting
      let maxPayloadStr = '';
      if (typeof v.maxPayload === 'number') {
        maxPayloadStr = `${v.maxPayload.toLocaleString('en-IN')} ${v.weightUnit || (isBike ? 'kg' : 'Tonnes')}`;
      } else if (v.maxPayload) {
        maxPayloadStr = String(v.maxPayload);
      } else if (v.payloadKg) {
        maxPayloadStr = `${Number(v.payloadKg).toLocaleString('en-IN')} ${v.weightUnit || 'kg'}`;
      } else {
        maxPayloadStr = isBike ? '150 kg' : isShip ? '52,000 Tonnes' : '28 Tonnes';
      }

      const defaultFuel = isShip ? 'Heavy Fuel Oil (HFO)' : isBike ? 'Petrol' : isTrain ? 'Electric Traction' : isFlight ? 'Aviation Turbine Fuel (ATF)' : 'Diesel';
      const defaultContainer = isShip ? '4500 TEU ISO Marine Container Hold' : isBike ? 'Insulated Last-Mile Top Box (65L)' : '20ft Closed Container / Flatbed';
      const defaultReg = isShip ? 'IMO 12 MM' : isBike ? 'TN 01 NJ 1234' : 'MH 12 MH 6789';
      const defaultHub = isShip ? 'Tata Steel Logistics Hub, Chennai, Tamil Nadu - 600081' : isBike ? 'Ranipet - Chittoor Trunk Road, Thiruvalam, Katpadi, Vellore, Tamil Nadu, 632106, India' : 'Mumbai Port Logistics Hub';

      const defaultImg = isBike
        ? '/images/hero_cargo_bike.png'
        : isShip
          ? 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80'
          : isTrain
            ? '/images/carrier_mode_train.jpg'
            : isFlight
              ? '/images/carrier_mode_flight.png'
              : '/images/tata_ace_fleet.jpg';

      return {
        id: v.id || `CRG-${Date.now()}`,
        name: v.name || `${v.brand || 'Tata Motors'} ${v.model || 'Ace Gold'}`,
        brand: v.brand || (v.name ? v.name.split(' ')[0] : 'Tata Motors'),
        model: v.model || v.name || 'Tata Ace Gold',
        subtitle: `(${v.type || v.category || (isBike ? 'Express Delivery' : isShip ? 'Ocean Freight' : 'Road Cargo')})`,
        owner: v.brand || v.ownerName || 'Verified Carrier Partner',
        rating: Number(v.rating || 4.9),
        trips: Number(v.trips || 142),
        maxPayload: maxPayloadStr,
        weightUnit: v.weightUnit || (isBike ? 'kg' : 'Tonnes'),
        maxPayloadTon: pLoad,
        fuel: v.fuel || defaultFuel,
        regId: v.regId || v.plate || defaultReg,
        hub: v.hub || v.location || defaultHub,
        containerSpace: v.containerSpace || defaultContainer,
        volumeM3: Number(v.volumeCapacity || (isBike ? 0.65 : isShip ? 85000 : 38.5)),
        bodyType: v.containerSpace || defaultContainer,
        distanceKm: isBike ? 25 : isShip ? 1200 : 345,
        deliveryTime: isBike ? 'Est. Delivery: 45 mins' : isShip ? 'Est. Transit: 3 Days' : 'Est. Delivery: Sun, Nov 23',
        features: [
          v.hasGps !== false ? 'Live GPS Tracking' : '',
          v.isReefer ? 'Cold Chain' : '',
          v.isHazmat ? 'HAZMAT Certified' : '',
          'Insurance Covered'
        ].filter(Boolean),
        hasGps: v.hasGps !== false,
        isReefer: !!v.isReefer,
        isHazmat: !!v.isHazmat,
        baseCharge: base,
        ratePerKm: rate,
        advancePercent: Number(v.advancePercent || defaultAdvance),
        deposit: Number(v.deposit || defaultDeposit),
        pricingText: v.pricingText || `₹${base.toLocaleString('en-IN')}/trip | ₹${rate}/km | Adv: ${v.advancePercent || defaultAdvance}%`,
        totalPrice: total,
        badge: {
          text: isBike ? '⚡ FASTEST HYPERLOCAL • 100% Green Electric' : isShip ? '⚓ MARITIME OCEAN FREIGHT' : '⭐ VERIFIED OWNER FLEET',
          bg: isBike ? '#ecfeff' : isShip ? '#f0f9ff' : '#fef3c7',
          color: isBike ? '#0e7490' : isShip ? '#0369a1' : '#92400e',
          icon: isBike ? '⚡' : isShip ? '⚓' : '⭐'
        },
        image: v.image || (v.images && v.images[0]) || defaultImg,
        mode,
        isAvailable: v.isAvailable !== false
      };
    };

    const loadOwnerFleet = async () => {
      // 1. Fetch from Backend API (shared with business site at port 3007)
      try {
        const res = await fetch('/api/carriers');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.vehicles) && data.vehicles.length > 0) {
            setFleetVehicles(data.vehicles.map(parseCarrier));
            return;
          }
        }
      } catch (err) { }

      // 2. Try local storage fallback
      try {
        const saved = localStorage.getItem('logi_pulse_vehicles');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFleetVehicles(parsed.map(parseCarrier));
            return;
          }
        }
      } catch (e) { }

      // 3. Fallback to empty fleet (only vehicles added by owner will ever show)
      setFleetVehicles([]);
    };

    loadOwnerFleet();
    window.addEventListener('storage', loadOwnerFleet);
    window.addEventListener('focus', loadOwnerFleet);
    return () => {
      window.removeEventListener('storage', loadOwnerFleet);
      window.removeEventListener('focus', loadOwnerFleet);
    };
  }, []);

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

  // Reset form
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

  // Continue to /home/carrier/[Mode]/BookingDetails
  const handleContinueBooking = () => {
    const veh = currentVehicles.find(v => v.id === selectedVehicleId) || currentVehicles[0];
    if (!veh) return;

    const modeCapitalized = veh.mode ? (veh.mode.charAt(0).toUpperCase() + veh.mode.slice(1).toLowerCase()) : 'Truck';

    const q = new URLSearchParams({
      id: veh.id,
      mode: modeCapitalized,
      name: veh.name,
      brand: veh.brand || 'Tata Motors',
      regId: veh.regId || 'MH 12 MH 6789',
      hub: veh.hub || 'Mumbai Port Logistics Hub',
      pickupPincode: pickupPincodeRaw || '400001',
      pickupAddress: pickupAddress || (veh.hub || 'Mumbai Port Logistics Hub'),
      deliveryPincode: deliveryPincodeRaw || '600001',
      deliveryAddress: deliveryAddress || 'Tata Steel Logistics Hub, Chennai, Tamil Nadu - 600081',
      weight: weight || (veh.mode === 'bike' ? '150' : '28'),
      weightUnit: weightUnit || (veh.mode === 'bike' ? 'kg' : 'Tonnes'),
      goodsType: goodsType || 'Industrial / Commercial Freight',
      ratePerKm: String(veh.ratePerKm || 48),
      baseCharge: String(veh.baseCharge || 1800),
      advancePercent: String(veh.advancePercent || 30),
      deposit: String(veh.deposit || 3000),
      image: veh.image || '/images/tata_ace_fleet.jpg'
    });

    router.push(`/home/carrier/${modeCapitalized}/BookingDetails?${q.toString()}`);
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
  const advanceDue = Math.round(tripPrice * 0.40); // 40% advance payment calculation

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

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 24px', minHeight: '85vh', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ================= 1. CARRIER HEADER & SEARCH BAR (Exact Image Match) ================= */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
          <i className="fa-solid fa-truck-fast" style={{ color: '#0ea5e9', fontSize: '20px' }}></i>
          <span>Carrier</span>
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
            <input
              type="text"
              value={pickupCity}
              onChange={(e) => {
                const val = e.target.value;
                setPickupCity(val);
                setPickupAddress(val);
                if (/^\d{6}$/.test(val)) {
                  handlePickupChange(val);
                }
              }}
              placeholder="origin"
              style={{
                fontSize: '16px',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.2,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: '2px 0',
                width: '100%',
                fontFamily: 'inherit'
              }}
            />
            {pickupArea ? (
              <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                {pickupArea}
              </div>
            ) : null}
            {/* Date Pill: [📅 Date: Sat, 21 Nov ˇ] */}
            <label
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
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <i className="fa-regular fa-calendar-days" style={{ fontSize: '10px', color: '#0284c7' }}></i>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7' }}>Date: {date}</span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px', color: '#0284c7', marginLeft: '2px' }}></i>
              <input
                type="date"
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  cursor: 'pointer'
                }}
                onChange={(e) => {
                  if (e.target.value) {
                    const d = new Date(e.target.value);
                    const formatted = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
                    setDate(formatted);
                  }
                }}
              />
            </label>

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
            <input
              type="text"
              value={deliveryCity}
              onChange={(e) => {
                const val = e.target.value;
                setDeliveryCity(val);
                setDeliveryAddress(val);
                if (/^\d{6}$/.test(val)) {
                  handleDeliveryChange(val);
                }
              }}
              placeholder="destination"
              style={{
                fontSize: '16px',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.2,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: '2px 0',
                width: '100%',
                fontFamily: 'inherit'
              }}
            />
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
        {/* Mode Tabs Row (Dynamic Counts from what owner added) */}
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
                placeholder="e.g. Industrial Machines, Tiles, FMCG"
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
                  name="carrierPaymentMode"
                  checked={paymentMode === 'prepaid'}
                  onChange={() => setPaymentMode('prepaid')}
                />
                Prepaid / Advance (40% + Balance on Delivery)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="carrierPaymentMode"
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
              SELECT VEHICLE FOR ({currentVehicles.length} {activeMode.toUpperCase()}{currentVehicles.length > 1 ? 'S' : ''} FOUND)
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
                    background: isSelected ? '#f8faff' : '#ffffff',
                    borderRadius: '20px',
                    border: isSelected ? '2.5px solid #2563eb' : '1px solid #e2e8f0',
                    boxShadow: isSelected ? '0 12px 28px -6px rgba(37, 99, 235, 0.18)' : '0 4px 16px rgba(0,0,0,0.06)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    maxWidth: '380px'
                  }}
                >
                  {/* 1. Vehicle Photo at Top */}
                  <div style={{
                    width: '100%',
                    height: '175px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    background: '#f8fafc',
                    position: 'relative'
                  }}>
                    <img
                      src={veh.image}
                      alt={veh.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e: any) => { e.target.src = '/images/tata_ace_fleet.jpg'; }}
                    />
                  </div>

                  {/* 2. Header Row: Name & Mode Badge + Rating */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a', lineHeight: 1.25, fontFamily: 'serif, Georgia' }}>
                        {veh.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <span style={{
                          background: '#eff6ff',
                          color: '#1d4ed8',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase'
                        }}>
                          {veh.mode.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#eab308', display: 'flex', alignItems: 'center', gap: '2px' }}>
                          ⭐ <span style={{ color: '#0f172a' }}>{veh.rating || 4.9}</span>
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginTop: '3px' }}>
                      {veh.brand || veh.owner}
                    </div>
                  </div>

                  {/* 3. Specs List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12.5px', color: '#475569' }}>
                    <div>
                      <strong style={{ color: '#0f172a' }}>Max Load:</strong> {typeof veh.maxPayload === 'number' ? `${veh.maxPayload} ${veh.weightUnit || 'Tonnes'}` : (veh.maxPayload || '28 Tonnes')} • {veh.fuel || 'Diesel'} • {veh.containerSpace || veh.bodyType}
                    </div>
                    <div>
                      <strong style={{ color: '#0f172a' }}>ID / Reg:</strong> {veh.regId || 'MH 12 MH 6789'}
                    </div>
                    <div>
                      <strong style={{ color: '#0f172a' }}>Hub:</strong> {veh.hub || 'Mumbai Port Logistics Hub'}
                    </div>
                  </div>

                  {/* 4. Badges (GPS Telematics, Cold Chain, HAZMAT) */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(veh.hasGps !== false) && (
                      <span style={{
                        background: '#ecfdf5',
                        color: '#065f46',
                        border: '1px solid #a7f3d0',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        📡 GPS Telematics
                      </span>
                    )}
                    {veh.isReefer && (
                      <span style={{
                        background: '#eff6ff',
                        color: '#1e40af',
                        border: '1px solid #bfdbfe',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        ❄️ Cold Chain
                      </span>
                    )}
                    {veh.isHazmat && (
                      <span style={{
                        background: '#fefce8',
                        color: '#854d0e',
                        border: '1px solid #fef08a',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        ⚠️ HAZMAT
                      </span>
                    )}
                  </div>

                  {/* 5. Rate Card Box */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Rate Card:</span>
                    <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                      ₹{Number(veh.baseCharge || 1800).toLocaleString('en-IN')}/trip | ₹{veh.ratePerKm}/km | Adv: {veh.advancePercent || 30}%
                    </span>
                  </div>

                  {/* 6. Bottom Selection Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '4px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: '#16a34a'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                      Available
                    </span>

                    {isSelected ? (
                      <button
                        type="button"
                        style={{
                          background: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          padding: '7px 18px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
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
                          color: '#2563eb',
                          border: '1.5px solid #2563eb',
                          padding: '6px 16px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
            <button
              type="button"
              onClick={handleContinueBooking}
              style={{
                background: '#ea580c',
                color: '#ffffff',
                border: 'none',
                padding: '13px 28px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Continue →</span>
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
              onClick={() => setIsBooked(false)}
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
  );
}

export default function CarrierPage() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflowX: 'hidden' }}>
      <Navbar />
      <SubNavbar />
      <main style={{ flex: 1, padding: '20px 0 60px 0', width: '100%' }}>
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', fontWeight: 700 }}>Loading Carrier Fleet...</div>}>
          <CarrierContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
