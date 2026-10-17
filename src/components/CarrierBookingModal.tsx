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
      { id: 'c-bike', name: 'Delivery Bike / Moto', icon: 'fa-motorcycle', color: '#ff6b6b', price: 150, capacityTon: 0.05, perKmRate: 12 },
      { id: 'c-auto', name: 'Electric Three-Wheeler Cargo', icon: 'fa-truck-fast', color: '#f59e0b', price: 400, capacityTon: 0.5, perKmRate: 18 },
      { id: 'c-ace', name: 'ACE / DOST / PICKUP (1.5 TON)', icon: 'fa-truck-pickup', color: '#3b82f6', price: 900, capacityTon: 1.5, perKmRate: 35 },
      { id: 'c-eicher-14', name: 'EICHER 14FT (3.5 TON)', icon: 'fa-truck', color: '#2563eb', price: 2200, capacityTon: 3.5, perKmRate: 33 },
      { id: 'c-eicher-17', name: 'EICHER 17FT (5 TON)', icon: 'fa-truck', color: '#1d4ed8', price: 3200, capacityTon: 5, perKmRate: 33 },
      { id: 'c-eicher-19', name: 'EICHER 19FT (7 TON)', icon: 'fa-truck-front', color: '#4338ca', price: 4500, capacityTon: 7, perKmRate: 44 },
      { id: 'c-cont-20', name: '20FT CONTAINER (6.5 TON)', icon: 'fa-box', color: '#0284c7', price: 5000, capacityTon: 6.5, perKmRate: 44 },
      { id: 'c-eicher-22', name: 'EICHER PRO 22FT (10 TON)', icon: 'fa-truck-front', color: '#6366f1', price: 6500, capacityTon: 10, perKmRate: 44 },
      { id: 'c-cont-32-7', name: '32FT CONTAINER (7/8 TON)', icon: 'fa-trailer', color: '#7c3aed', price: 7500, capacityTon: 8, perKmRate: 44 },
      { id: 'c-cont-32-16', name: '32FT CONTAINER (16 TON)', icon: 'fa-trailer', color: '#8b5cf6', price: 11000, capacityTon: 16, perKmRate: 68 },
      { id: 'c-cont-32-18', name: '32FT CONTAINER (18 TON)', icon: 'fa-trailer', color: '#a855f7', price: 13000, capacityTon: 18, perKmRate: 72 },
      { id: 'c-taurus-18', name: 'LORRY/TAURUS (18 TON)', icon: 'fa-truck-moving', color: '#d946ef', price: 14000, capacityTon: 18, perKmRate: 75 },
      { id: 'c-open-trailer', name: '20 / 32 / 40 FT All Side Open TRAILER', icon: 'fa-truck-ramp-box', color: '#ec4899', price: 18000, capacityTon: 25, perKmRate: 85 },
      { id: 'c-partload', name: 'PARTLOAD & PARCEL SERVICE', icon: 'fa-boxes-packing', color: '#f59e0b', price: 350, capacityTon: 1.0, perKmRate: 20 },
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
      { id: 'c-covered-wagon', name: 'Covered Freight Wagon (BCN / BCNA 58–70 Tonnes)', icon: 'fa-train-subway', color: '#7c3aed', price: 95000 },
      { id: 'c-freight', name: 'Standard Freight Train (Full Rake)', icon: 'fa-train', color: '#8b5cf6', price: 150000 },
      { id: 'c-tanker', name: 'Liquid Tanker Train (BTPN)', icon: 'fa-train-subway', color: '#0ea5e9', price: 200000 },
      { id: 'c-intermodal', name: 'Intermodal Container Train (CONCOR / BLLA)', icon: 'fa-train-tram', color: '#10b981', price: 350000 },
      { id: 'c-heavyhaul', name: 'Heavy-Haul Locomotive (BOXN / 3000+ Tonnes)', icon: 'fa-train', color: '#f59e0b', price: 500000 },
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
  const [selectedVehicle, setSelectedVehicle] = useState('c-bike');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [date, setDate] = useState('Thu, 15 Oct');
  const [time, setTime] = useState('');
  const [scheduleType, setScheduleType] = useState('Now');
  const [bookingRole, setBookingRole] = useState<'Sender' | 'Receiver'>('Sender');

  // Shipment Modes & Service Category (Domestic, International, Cargo, Railways, Quick)
  const [shipmentMode, setShipmentMode] = useState<'Domestic' | 'International' | 'Cargo' | 'Railways' | 'Quick'>('Domestic');
  const [selectedService, setSelectedService] = useState('Express Parcel');
  const [pickupPincode, setPickupPincode] = useState('');
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('United States');
  const [packageWeight, setPackageWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'ton' | 'kg'>('ton');
  const [goodsName, setGoodsName] = useState('');
  const [dimL, setDimL] = useState('');
  const [dimW, setDimW] = useState('');
  const [dimH, setDimH] = useState('');
  const [numBoxes, setNumBoxes] = useState('1');
  const [paymentMode, setPaymentMode] = useState<'Prepaid' | 'Cash on Delivery'>('Cash on Delivery');
  const [shipmentValue, setShipmentValue] = useState('2000');
  const [calculatedRates, setCalculatedRates] = useState<{
    estimatedFare: number;
    recommendedVehicle: string;
    deliveryTime: string;
    distanceKm: number;
    ratePerKm: number;
    goodsTypeDesc: string;
  } | null>(null);

  const [cargoWeight, setCargoWeight] = useState('');
  const [cargoUnit, setCargoUnit] = useState('kg');
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [weightError, setWeightError] = useState('');

  const [isSearching, setIsSearching] = useState(false);
  const [isFindingCarrier, setIsFindingCarrier] = useState(false);
  const [isCarrierFound, setIsCarrierFound] = useState(false);
  const [showLocationList, setShowLocationList] = useState(false);
  const [showDropoffList, setShowDropoffList] = useState(false);
  const [showCarrierDropdown, setShowCarrierDropdown] = useState(false);
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [calMonth, setCalMonth] = useState(9); // October
  const [calYear, setCalYear] = useState(2026);

  const carrierBoxRef = React.useRef<HTMLDivElement>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const fromRef = React.useRef<HTMLDivElement>(null);
  const toRef = React.useRef<HTMLDivElement>(null);

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const MONTH_SHORT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleSelectDate = (day: number, m = calMonth, y = calYear) => {
    const formatted = `${String(day).padStart(2, '0')} ${MONTH_SHORT[m]}, ${y}`;
    setDate(formatted);
    setShowCalendarPicker(false);
  };

  const INDIAN_CITIES = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Vellore', 'Erode', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Kolkata', 'Kochi', 'Thiruvananthapuram', 'Mysuru'];

  const LOGISTICS_SERVICES = [
    {
      id: 'express-parcel',
      name: 'Express Parcel',
      description: 'Fast, door-to-door parcel delivery with real-time tracking.',
      icon: 'fa-box-open',
      category: 'Domestic',
      badge: 'Most Popular',
      defaultVehicle: 'c-bike'
    },
    {
      id: 'airmax',
      name: 'AirMax',
      description: 'Time-critical, high-volume air express delivery service.',
      icon: 'fa-plane-circle-check',
      category: 'Air',
      badge: 'Fastest Air',
      defaultVehicle: 'c-narrow'
    },
    {
      id: 'express-premium',
      name: 'Express Premium',
      description: 'Affordable, next-day delivery service for urgent shipments.',
      icon: 'fa-bolt',
      category: 'Domestic',
      badge: 'Next Day',
      defaultVehicle: 'c-minitruck'
    },
    {
      id: '3pl',
      name: '3PL (Third-Party Logistics)',
      description: 'End-to-end storage, inventory, and order fulfillment solutions.',
      icon: 'fa-warehouse',
      category: 'Cargo',
      badge: 'Enterprise',
      defaultVehicle: 'c-hcv'
    },
    {
      id: 'ltl',
      name: 'LTL (Less Than Truckload Shipping)',
      description: 'Cost-effective freight shipping for smaller loads.',
      icon: 'fa-truck-ramp-box',
      category: 'Cargo',
      badge: 'Cost Saver',
      defaultVehicle: 'c-lcv'
    },
    {
      id: 'international-shipping',
      name: 'International Shipping',
      description: 'Global delivery to 220+ destinations and a local presence in 7 countries.',
      icon: 'fa-earth-americas',
      category: 'International',
      badge: 'Global 220+',
      defaultVehicle: 'c-wide'
    }
  ];

  const handleCalculateRates = () => {
    const rawVal = parseFloat(packageWeight) || 1.5;
    // Normalized weight in metric tons
    const wtTon = weightUnit === 'kg' ? rawVal / 1000 : rawVal;
    const wtKg = weightUnit === 'ton' ? rawVal * 1000 : rawVal;

    let dist = 35;
    if (pickupPincode && deliveryPincode) {
      const p1 = parseInt(pickupPincode) || 600001;
      const p2 = parseInt(deliveryPincode) || 600028;
      dist = Math.max(15, Math.min(2500, Math.round(Math.abs(p1 - p2) / 30) + 15));
    }

    let recVehicle = 'c-ace';
    let ratePerKm = 35;
    let baseRate = 0;
    let timeEst = '1 - 2 business days';

    if (shipmentMode === 'International') {
      recVehicle = wtTon > 5 ? 'c-general' : 'c-wide';
      ratePerKm = wtTon > 5 ? 120 : 250;
      baseRate = 2500 + wtKg * 40;
      timeEst = wtTon > 5 ? '12 - 18 business days (Sea Cargo Ship)' : '3 - 5 business days (Air Freight Jet)';
      dist = 8500;
    } else if (shipmentMode === 'Railways') {
      // Railways Freight logic
      if (wtTon >= 58 && wtTon <= 70) {
        // Covered wagon payload capacity: 58 to 70 tonnes
        recVehicle = 'c-covered-wagon';
        ratePerKm = 52;
        baseRate = 28000 + dist * ratePerKm;
        timeEst = '1 - 2 business days (Single Covered Wagon)';
      } else if (wtTon > 70) {
        // Heavy locomotive / Full rake
        recVehicle = 'c-heavyhaul';
        ratePerKm = 88;
        baseRate = 75000 + dist * ratePerKm;
        timeEst = '2 - 3 business days (Heavy Haul Multi-Wagon Rake)';
      } else if (wtTon >= 20) {
        recVehicle = 'c-freight';
        ratePerKm = 48;
        baseRate = 20000 + dist * ratePerKm;
        timeEst = '2 business days (Standard Freight Train)';
      } else {
        recVehicle = 'c-intermodal';
        ratePerKm = 42;
        baseRate = 12000 + dist * ratePerKm;
        timeEst = '1 - 2 business days (Rail Container)';
      }
    } else if (shipmentMode === 'Cargo') {
      if (wtTon >= 58 && wtTon <= 70) {
        // Automatically suggest Covered Wagon for 58 to 70 tonnes
        recVehicle = 'c-covered-wagon';
        ratePerKm = 52;
      } else if (wtTon <= 2) {
        recVehicle = 'c-ace';
        ratePerKm = 35;
      } else if (wtTon <= 7) {
        recVehicle = 'c-eicher-19';
        ratePerKm = 44;
      } else if (wtTon <= 14) {
        recVehicle = 'c-eicher-22';
        ratePerKm = 45;
      } else if (wtTon <= 18) {
        recVehicle = 'c-cont-32-18';
        ratePerKm = 72;
      } else if (wtTon > 70) {
        recVehicle = 'c-heavyhaul';
        ratePerKm = 88;
      } else {
        recVehicle = dist > 500 ? 'c-freight' : 'c-open-trailer';
        ratePerKm = 85;
      }
      baseRate = 600 + dist * ratePerKm;
      timeEst = '2 - 3 business days';
    } else if (shipmentMode === 'Quick') {
      recVehicle = wtKg <= 10 ? 'c-drone' : 'c-bike';
      ratePerKm = 15;
      baseRate = 80 + dist * ratePerKm;
      timeEst = '45 - 90 minutes (Hyperlocal Road)';
      dist = 12;
    } else {
      // DOMESTIC (Road, 2-wheelers, 4-wheelers, or long trains/flights)
      if (wtKg <= 20 && dist <= 30) {
        // 2-wheeler
        recVehicle = 'c-bike';
        ratePerKm = 12;
        baseRate = 120 + dist * ratePerKm;
        timeEst = 'Same day delivery';
      } else if (wtKg <= 600 && dist <= 50) {
        // 3-wheeler
        recVehicle = 'c-auto';
        ratePerKm = 18;
        baseRate = 350 + dist * ratePerKm;
        timeEst = 'Same day delivery';
      } else if (wtTon >= 1 && wtTon <= 2) {
        // User rule: 1 to 2 tons -> 34 to 37 Rs per km
        recVehicle = 'c-ace'; // ACE / DOST / PICKUP (1.5 TON)
        ratePerKm = 36; // between 34 and 37
        baseRate = 900 + dist * ratePerKm;
        timeEst = 'Next day delivery';
      } else if (wtTon > 14 && wtTon <= 18) {
        // User rule: more than 15 to 18 tons -> 56 to 86 Rs per km
        recVehicle = 'c-cont-32-18'; // 32FT CONTAINER (18 TON) / TAURUS
        ratePerKm = 72; // between 56 and 86
        baseRate = 12000 + dist * ratePerKm;
        timeEst = '2 - 3 business days';
      } else if (wtTon >= 6 && wtTon <= 14) {
        // User rule: 6 to 14 tons -> 42 to 46 Rs per km
        recVehicle = wtTon <= 10 ? 'c-eicher-22' : 'c-cont-32-7';
        ratePerKm = 44; // between 42 and 46
        baseRate = 6000 + dist * ratePerKm;
        timeEst = '1 - 2 business days';
      } else if (wtTon > 2 && wtTon <= 6) {
        // User rule: 2 to 15 tons bracket -> 31 to 35 Rs per km
        recVehicle = wtTon <= 3.5 ? 'c-eicher-14' : 'c-eicher-17';
        ratePerKm = 33; // between 31 and 35
        baseRate = 2200 + dist * ratePerKm;
        timeEst = '1 - 2 business days';
      } else if (wtTon >= 58 && wtTon <= 70) {
        // User rule: Single covered wagon carries a payload capacity of 58 to 70 tonnes
        recVehicle = 'c-covered-wagon';
        ratePerKm = 52;
        baseRate = 28000 + dist * ratePerKm;
        timeEst = '1 - 2 business days (Single Covered Freight Wagon)';
      } else if (wtTon > 70) {
        // Heavy train locomotive
        recVehicle = 'c-heavyhaul';
        ratePerKm = 88;
        baseRate = 75000 + dist * ratePerKm;
        timeEst = '2 - 3 business days (Heavy-Haul Train)';
      } else if (wtTon > 18) {
        // Heavy multi-axle or train if long distance
        recVehicle = dist > 400 ? 'c-freight' : 'c-open-trailer';
        ratePerKm = 85;
        baseRate = 16000 + dist * ratePerKm;
        timeEst = dist > 400 ? '2 - 3 business days' : '2 business days';
      } else {
        recVehicle = 'c-ace';
        ratePerKm = 35;
        baseRate = 800 + dist * ratePerKm;
        timeEst = '1 - 2 business days';
      }
    }

    setCalculatedRates({
      estimatedFare: Math.round(baseRate),
      recommendedVehicle: recVehicle,
      deliveryTime: timeEst,
      distanceKm: dist,
      ratePerKm: ratePerKm,
      goodsTypeDesc: goodsName || 'Commercial Freight'
    });
    setSelectedVehicle(recVehicle);
  };

  const handleResetRates = () => {
    setPickupPincode('');
    setDeliveryPincode('');
    setPackageWeight('1.5');
    setWeightUnit('ton');
    setGoodsName('');
    setDimL('');
    setDimW('');
    setDimH('');
    setNumBoxes('1');
    setShipmentValue('2000');
    setCalculatedRates(null);
  };

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

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (carrierBoxRef.current && !carrierBoxRef.current.contains(e.target as Node)) {
        setShowCarrierDropdown(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendarPicker(false);
      }
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setShowLocationList(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setShowDropoffList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      const subService = searchParamsObj.get('subService');
      const origin = searchParamsObj.get('origin');
      const destination = searchParamsObj.get('destination');

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
    // If cargo weight is empty but package weight exists from calculator, sync it
    if (!cargoWeight && packageWeight) {
      setCargoWeight(packageWeight);
    }
    // If pickup and dropoff exist, enable searching to show route immediately on map
    if (pickup && dropoff) {
      setIsSearching(true);
    }
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
    } else if (selectedVehicleObj.id === 'c-covered-wagon') {
      maxWeightStr = '70 Tonnes (58–70 Tonnes payload per covered wagon)';
      maxWeightNum = 70000;
    } else if (selectedVehicleObj.name.includes('Ship') || selectedVehicleObj.name.includes('Train') || selectedVehicleObj.name.includes('Locomotive') || selectedVehicleObj.name.includes('Wagon')) {
      maxWeightStr = '500+ Tonnes';
      maxWeightNum = 500000;
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
      alert("Please enter valid pickup and dropoff locations / pincodes.");
      return;
    }

    const recName = receiverName.trim() || contactName.trim();
    const recPhone = receiverPhone.trim() || (bookingRole === 'Receiver' ? contactPhone.trim() : '');
    const sendPhone = senderPhone.trim() || (bookingRole === 'Sender' ? contactPhone.trim() : '');

    if (!recName) {
      alert("Please enter the receiving person name.");
      return;
    }

    if (!recPhone) {
      alert("Please enter the receiver person mobile number to call when the parcel reaches the destination.");
      return;
    }

    if (!sendPhone) {
      alert("Please enter the sender mobile number.");
      return;
    }

    setIsSearching(true);
    setIsFindingCarrier(true);
  };

  const getGoogleMapsEmbedUrl = () => {
    const origin = pickup.trim() ? encodeURIComponent(pickup.trim()) : 'Chennai';
    const destination = dropoff.trim() ? encodeURIComponent(dropoff.trim()) : '';

    if (origin && destination) {
      return `https://maps.google.com/maps?saddr=${origin}&daddr=${destination}&t=m&z=13&output=embed`;
    }
    const center = origin || destination || 'Chennai';
    return `https://maps.google.com/maps?q=${center}&t=m&z=13&output=embed`;
  };

  const getDirectGoogleMapsAppUrl = () => {
    const origin = encodeURIComponent(pickup.trim() || 'Chennai');
    const destination = encodeURIComponent(dropoff.trim() || 'Chennai Central');
    const travelmode = mode === 'RAIL' ? 'transit' : (mode === 'AIR' || mode === 'SEA' ? 'flying' : 'driving');
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelmode}`;
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
    <div style={{ display: 'flex', zIndex: 1000, background: '#ffffff', minHeight: '100%', width: '100%' }} onClick={handleClose}>
      <div className="modal-sheet centered-modal" style={{ maxWidth: '1440px', width: '98%', height: '92vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', transition: 'max-width 0.3s ease' }} onClick={e => e.stopPropagation()}>

        {/* Dummy div to absorb the globals.css >div:first-child { display: none } rule */}
        <div style={{ display: 'none' }}></div>

        {step === 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-truck-fast" style={{ color: '#0ea5e9' }}></i> Cargo & Carrier Booking
            </div>
            <button
              type="button"
              onClick={handleClose}
              style={{ background: 'transparent', border: 'none', fontSize: '20px', color: '#64748b', cursor: 'pointer', padding: '4px 8px' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}

        {step === 1 && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* 🚚 Unified Carrier Search Card (Matching User Image 2) */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Form Inputs Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                background: '#ffffff',
                overflow: 'visible',
                position: 'relative'
              }}>
                {/* FROM Address Box */}
                <div style={{ flex: 1.1, minWidth: 0, padding: '10px 16px', borderRight: '1px solid #e2e8f0', position: 'relative', display: 'flex', flexDirection: 'column' }} ref={fromRef}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'capitalize', marginBottom: '3px' }}>From</span>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => {
                      setPickup(e.target.value);
                      setShowLocationList(true);
                    }}
                    onFocus={() => setShowLocationList(true)}
                    placeholder="origin"
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '15px', fontWeight: 800, color: '#0f172a', padding: 0, width: '100%' }}
                  />

                  {/* Date of Journey Row with Interactive Calendar */}
                  <div
                    ref={calendarRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCalendarPicker(prev => !prev);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      marginTop: '4px',
                      background: '#f0f9ff',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid #bae6fd',
                      width: 'fit-content',
                      cursor: 'pointer',
                      position: 'relative',
                      userSelect: 'none'
                    }}
                    title="Click to select dispatch date"
                  >
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <i className="fa-regular fa-calendar-days"></i> Date:
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0369a1', whiteSpace: 'nowrap' }}>{date}</span>
                    <i className="fa-solid fa-chevron-down" style={{ fontSize: '9px', color: '#0284c7', marginLeft: '2px' }}></i>

                    {/* Interactive Calendar Popup */}
                    {showCalendarPicker && (
                      <div className="hero-calendar-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="hero-cal-header">
                          <button
                            type="button"
                            className="hero-cal-nav-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (calMonth === 0) {
                                setCalMonth(11);
                                setCalYear(y => y - 1);
                              } else {
                                setCalMonth(m => m - 1);
                              }
                            }}
                          >
                            <i className="fa-solid fa-chevron-left"></i>
                          </button>
                          <span className="hero-cal-title">
                            {MONTH_NAMES[calMonth]} {calYear}
                          </span>
                          <button
                            type="button"
                            className="hero-cal-nav-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (calMonth === 11) {
                                setCalMonth(0);
                                setCalYear(y => y + 1);
                              } else {
                                setCalMonth(m => m + 1);
                              }
                            }}
                          >
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        </div>

                        <div className="hero-cal-weekdays">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => (
                            <span key={w} className="hero-cal-weekday">{w}</span>
                          ))}
                        </div>

                        <div className="hero-cal-days-grid">
                          {Array.from({ length: getFirstDayOfMonth(calYear, calMonth) }).map((_, i) => (
                            <div key={`cal-empty-${i}`} className="hero-cal-day-cell empty"></div>
                          ))}
                          {Array.from({ length: getDaysInMonth(calYear, calMonth) }).map((_, i) => {
                            const dayNum = i + 1;
                            const dayFormatted = String(dayNum).padStart(2, '0');
                            const isSelected = date.includes(`${dayFormatted} ${MONTH_SHORT[calMonth]}`) || date.includes(`${dayNum} ${MONTH_SHORT[calMonth]}`);

                            return (
                              <button
                                key={`cal-day-${dayNum}`}
                                type="button"
                                className={`hero-cal-day-cell ${isSelected ? 'selected' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectDate(dayNum);
                                }}
                              >
                                {dayNum}
                              </button>
                            );
                          })}
                        </div>

                        <div className="hero-cal-footer">
                          <button
                            type="button"
                            className="hero-cal-quick-action"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCalMonth(9);
                              setCalYear(2026);
                              handleSelectDate(15, 9, 2026);
                            }}
                          >
                            Today (15 Oct)
                          </button>
                          <button
                            type="button"
                            className="hero-cal-quick-action"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCalMonth(9);
                              setCalYear(2026);
                              handleSelectDate(16, 9, 2026);
                            }}
                          >
                            Tomorrow (16 Oct)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Swap Button floating on divider line */}
                  <button
                    type="button"
                    onClick={handleSwap}
                    title="Swap From and To locations"
                    style={{
                      position: 'absolute',
                      right: '-15px',
                      top: '18px',
                      width: '30px',
                      height: '30px',
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
                      boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <i className="fa-solid fa-arrow-right-arrow-left"></i>
                  </button>

                  {/* Popular Cities Suggestion */}
                  {showLocationList && (
                    <div className="hero-suggestions-popup">
                      <div className="hero-suggestions-header">
                        <span>Select City / Logistics Hub</span>
                        <i className="fa-solid fa-city"></i>
                      </div>
                      <div className="hero-suggestions-list">
                        {INDIAN_CITIES.filter(c => !pickup || c.toLowerCase().includes(pickup.toLowerCase())).map(city => (
                          <div
                            key={`from-city-${city}`}
                            className="hero-city-item"
                            onClick={() => {
                              setPickup(city);
                              setShowLocationList(false);
                            }}
                          >
                            <div className="hero-city-icon">
                              <i className="fa-solid fa-location-dot" style={{ color: '#10b981' }}></i>
                            </div>
                            <div className="hero-city-info">
                              <span className="hero-city-name">{city}</span>
                              <span className="hero-city-state">Logistics Pickup Hub</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* TO Address Box */}
                <div style={{ flex: 1.1, minWidth: 0, padding: '10px 16px 10px 24px', borderRight: '1px solid #e2e8f0', position: 'relative', display: 'flex', flexDirection: 'column' }} ref={toRef}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'capitalize', marginBottom: '3px' }}>To</span>
                  <input
                    type="text"
                    value={dropoff}
                    onChange={(e) => {
                      setDropoff(e.target.value);
                      setShowDropoffList(true);
                    }}
                    onFocus={() => setShowDropoffList(true)}
                    placeholder="destination"
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '15px', fontWeight: 800, color: '#0f172a', padding: 0, width: '100%' }}
                  />

                  {showDropoffList && (
                    <div className="hero-suggestions-popup">
                      <div className="hero-suggestions-header">
                        <span>Select City / Destination Hub</span>
                        <i className="fa-solid fa-city"></i>
                      </div>
                      <div className="hero-suggestions-list">
                        {INDIAN_CITIES.filter(c => !dropoff || c.toLowerCase().includes(dropoff.toLowerCase())).map(city => (
                          <div
                            key={`to-city-${city}`}
                            className="hero-city-item"
                            onClick={() => {
                              setDropoff(city);
                              setShowDropoffList(false);
                            }}
                          >
                            <div className="hero-city-icon">
                              <i className="fa-solid fa-location-dot" style={{ color: '#ef4444' }}></i>
                            </div>
                            <div className="hero-city-info">
                              <span className="hero-city-name">{city}</span>
                              <span className="hero-city-state">Destination Warehouse</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>



                {/* SELECT CARRIER DROPDOWN (ALL 19 CARRIERS WITH ICONS) */}
                <div
                  style={{ flex: 1.3, minWidth: 0, padding: '10px 16px', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column' }}
                  ref={carrierBoxRef}
                  onClick={() => setShowCarrierDropdown(prev => !prev)}
                >
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'capitalize', marginBottom: '3px' }}>Select Carrier</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <i className={`fa-solid ${ALL_CARRIERS.find(c => c.id === selectedVehicle)?.icon || 'fa-motorcycle'}`} style={{ color: ALL_CARRIERS.find(c => c.id === selectedVehicle)?.color || '#f97316', fontSize: '15px' }}></i>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ALL_CARRIERS.find(c => c.id === selectedVehicle)?.name || 'Delivery Bike / Moto'}
                      </span>
                    </div>
                    <i className="fa-solid fa-chevron-down" style={{ fontSize: '11px', color: '#64748b' }}></i>
                  </div>

                  {/* Dropdown displaying all carrier options directly below the button */}
                  {showCarrierDropdown && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        width: '380px',
                        maxWidth: '92vw',
                        background: '#ffffff',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.25), 0 0 1px rgba(0,0,0,0.1)',
                        padding: '16px',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        animation: 'fbFadeInDown 0.18s ease'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>All Available Carriers</h4>
                          <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Select cargo vehicle or freight mode ({ALL_CARRIERS.length} total)</span>
                        </div>
                        <button
                          type="button"
                          className="hero-td-close"
                          onClick={() => setShowCarrierDropdown(false)}
                          style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          maxHeight: '340px',
                          overflowY: 'auto',
                          paddingRight: '4px'
                        }}
                      >
                        {ALL_CARRIERS.map((carrier) => {
                          const isSelected = selectedVehicle === carrier.id;
                          return (
                            <div
                              key={carrier.id}
                              onClick={() => {
                                setSelectedVehicle(carrier.id);
                                setShowCarrierDropdown(false);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                borderRadius: '10px',
                                border: isSelected ? '1.5px solid #f97316' : '1px solid #e2e8f0',
                                background: isSelected ? '#fff7ed' : '#ffffff',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.background = '#f8fafc';
                                  e.currentTarget.style.borderColor = '#cbd5e1';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.background = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e2e8f0';
                                }
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: carrier.color + '15',
                                    color: carrier.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    flexShrink: 0
                                  }}
                                >
                                  <i className={`fa-solid ${carrier.icon}`}></i>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                                    {carrier.name}
                                  </span>
                                  {(carrier as any).capacityTon ? (
                                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                                      Capacity: {(carrier as any).capacityTon} Ton • ₹{(carrier as any).perKmRate || 35}/km
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                                      Specialized Freight Carrier
                                    </span>
                                  )}
                                </div>
                              </div>
                              <i
                                className="fa-solid fa-chevron-right"
                                style={{
                                  fontSize: '11px',
                                  color: isSelected ? '#f97316' : '#94a3b8'
                                }}
                              ></i>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* SEARCH CTA BUTTON (Orange gradient rounded right matching Image 2) */}
                <button
                  type="button"
                  onClick={() => {
                    const chosen = ALL_CARRIERS.find(c => c.id === selectedVehicle);
                    if (chosen) {
                      if (senderPhone && !contactPhone) {
                        setContactPhone(senderPhone);
                      }
                      handleSelectVehicle(chosen);
                    }
                  }}
                  title="Search & Enter Carrier Fleet Details"
                  style={{
                    background: '#f25a1b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0 11px 11px 0',
                    padding: '0 28px',
                    height: '64px',
                    fontSize: '16px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    flexShrink: 0,
                    alignSelf: 'stretch',
                    transition: 'background 0.2s ease',
                    boxShadow: 'none'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#ea580c')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f25a1b')}
                >
                  <span>Search</span>
                  <i className="fa-solid fa-chevron-right" style={{ fontSize: '14px' }}></i>
                </button>
              </div>
            </div>


            {/* ================= 1 ROW WITH 6 COLUMNS: OUR LOGISTICS SERVICES ================= */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '20px 24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-truck-ramp-box" style={{ color: '#4f46e5' }}></i> Our Logistics Services
                  </h3>
                  <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                    Click any service below to automatically configure instant express delivery or freight mode:
                  </span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#4f46e5', background: '#eef2ff', padding: '4px 12px', borderRadius: '8px' }}>
                  6 Service Modes Available
                </span>
              </div>

              {/* 6 Columns in 1 Single Horizontal Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                gap: '12px'
              }}>
                {LOGISTICS_SERVICES.map((srv) => {
                  const isSelected = selectedService === srv.name;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => {
                        setSelectedService(srv.name);
                        const targetVeh = ALL_CARRIERS.find(c => c.id === srv.defaultVehicle);
                        if (targetVeh) {
                          setSelectedVehicle(targetVeh.id);
                        }
                        // Adjust shipmentMode based on service
                        if (srv.id === 'international-shipping') {
                          setShipmentMode('International');
                          setPackageWeight('5');
                          setWeightUnit('ton');
                        } else if (srv.id === 'airmax') {
                          setShipmentMode('Cargo');
                          setPackageWeight('2.5');
                          setWeightUnit('ton');
                        } else if (srv.id === 'express-parcel') {
                          setShipmentMode('Domestic');
                          setPackageWeight('5');
                          setWeightUnit('kg');
                        } else if (srv.id === 'express-premium') {
                          setShipmentMode('Domestic');
                          setPackageWeight('1.5');
                          setWeightUnit('ton');
                        } else {
                          setShipmentMode('Domestic');
                          setPackageWeight('7');
                          setWeightUnit('ton');
                        }
                        handleCalculateRates();
                      }}
                      style={{
                        padding: '14px 12px',
                        borderRadius: '16px',
                        border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                        background: isSelected ? 'linear-gradient(180deg, #f8faff 0%, #eef2ff 100%)' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '175px',
                        boxShadow: isSelected ? '0 8px 20px rgba(79, 70, 229, 0.15)' : '0 2px 6px rgba(0,0,0,0.02)',
                        transform: isSelected ? 'translateY(-2px)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.transform = 'none';
                        }
                      }}
                    >
                      {/* Top Header with Icon and Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: isSelected ? '#4f46e5' : '#f1f5f9',
                          color: isSelected ? '#ffffff' : '#4f46e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px'
                        }}>
                          <i className={`fa-solid ${srv.icon}`}></i>
                        </div>
                        <span style={{
                          fontSize: '9.5px',
                          fontWeight: 800,
                          padding: '3px 6px',
                          borderRadius: '6px',
                          background: isSelected ? '#4f46e5' : '#f1f5f9',
                          color: isSelected ? '#ffffff' : '#64748b',
                          whiteSpace: 'nowrap'
                        }}>
                          {srv.badge}
                        </span>
                      </div>

                      {/* Service Title */}
                      <div style={{ marginBottom: '6px' }}>
                        <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 800, color: '#1e293b', lineHeight: 1.25 }}>
                          {srv.name}
                        </h4>
                      </div>

                      {/* Description */}
                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.35, flex: 1 }}>
                        {srv.description}
                      </p>

                      {/* Interactive Action Button (Express Delivery in less time) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService(srv.name);
                          const targetVeh = ALL_CARRIERS.find(c => c.id === srv.defaultVehicle);
                          if (targetVeh) {
                            setSelectedVehicle(targetVeh.id);
                          }
                          handleCalculateRates();
                        }}
                        style={{
                          marginTop: '10px',
                          width: '100%',
                          padding: '6px 4px',
                          borderRadius: '8px',
                          border: 'none',
                          background: isSelected ? '#4f46e5' : '#f8fafc',
                          color: isSelected ? '#ffffff' : '#475569',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          transition: 'background 0.2s'
                        }}
                      >
                        <span>{isSelected ? 'Selected' : 'Select'}</span>
                        <i className="fa-solid fa-bolt" style={{ fontSize: '9px', color: isSelected ? '#fde047' : '#94a3b8' }}></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= SHIPPING & FREIGHT RATE CALCULATOR (FULL WIDTH) ================= */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* Mode Selector Tabs (Domestic, International, Cargo, Quick) */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShipmentMode('Domestic');
                    setCalculatedRates(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: shipmentMode === 'Domestic' ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    background: shipmentMode === 'Domestic' ? '#eef2ff' : '#ffffff',
                    color: shipmentMode === 'Domestic' ? '#4f46e5' : '#475569',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ color: '#6366f1' }}>✦</span> Domestic
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShipmentMode('International');
                    setCalculatedRates(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: shipmentMode === 'International' ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    background: shipmentMode === 'International' ? '#eef2ff' : '#ffffff',
                    color: shipmentMode === 'International' ? '#4f46e5' : '#475569',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fa-solid fa-plane" style={{ color: '#6366f1', fontSize: '13px' }}></i> International
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShipmentMode('Cargo');
                    setCalculatedRates(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: shipmentMode === 'Cargo' ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    background: shipmentMode === 'Cargo' ? '#eef2ff' : '#ffffff',
                    color: shipmentMode === 'Cargo' ? '#4f46e5' : '#475569',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fa-solid fa-boxes-stacked" style={{ color: '#6366f1', fontSize: '13px' }}></i> Cargo
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShipmentMode('Railways');
                    setCalculatedRates(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: shipmentMode === 'Railways' ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                    background: shipmentMode === 'Railways' ? '#f5f3ff' : '#ffffff',
                    color: shipmentMode === 'Railways' ? '#7c3aed' : '#475569',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fa-solid fa-train" style={{ color: '#7c3aed', fontSize: '13px' }}></i> Railways (Trains)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShipmentMode('Quick');
                    setCalculatedRates(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: shipmentMode === 'Quick' ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    background: shipmentMode === 'Quick' ? '#eef2ff' : '#ffffff',
                    color: shipmentMode === 'Quick' ? '#4f46e5' : '#475569',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fa-solid fa-bolt-lightning" style={{ color: '#6366f1', fontSize: '13px' }}></i> Quick
                </button>
              </div>

              {/* Dynamic Form based on Tab (Domestic vs International vs Cargo vs Quick) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Row 1: Pincodes / Destination Country */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                      {shipmentMode === 'Cargo' ? 'Pickup Pincode *' : 'Pick-up Area Pincode *'}
                    </label>
                    <input
                      type="text"
                      placeholder="6-digit pincode"
                      value={pickupPincode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                        setPickupPincode(val);
                        if (val.length === 6) {
                          setPickup(`Pincode: ${val}`);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        background: '#fafafa',
                        fontWeight: 600
                      }}
                    />
                  </div>

                  <div>
                    {shipmentMode === 'International' ? (
                      <>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                          Destination Country *
                        </label>
                        <select
                          value={destinationCountry}
                          onChange={(e) => {
                            setDestinationCountry(e.target.value);
                            setDropoff(e.target.value);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            borderRadius: '12px',
                            border: '1.5px solid #e2e8f0',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            background: '#fafafa',
                            fontWeight: 700,
                            color: '#0f172a'
                          }}
                        >
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Germany">Germany</option>
                          <option value="Australia">Australia</option>
                          <option value="Canada">Canada</option>
                        </select>
                      </>
                    ) : (
                      <>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                          {shipmentMode === 'Cargo' ? 'Destination Pincode *' : 'Delivery Area Pincode *'}
                        </label>
                        <input
                          type="text"
                          placeholder="6-digit pincode"
                          value={deliveryPincode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                            setDeliveryPincode(val);
                            if (val.length === 6) {
                              setDropoff(`Pincode: ${val}`);
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            borderRadius: '12px',
                            border: '1.5px solid #e2e8f0',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            background: '#fafafa',
                            fontWeight: 600
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Row 2: Goods Name / Type & Weight with Unit Selector (Ton / kg) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', alignItems: 'center' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                      Goods / Product Type *
                    </label>
                    <input
                      type="text"
                      value={goodsName}
                      onChange={(e) => setGoodsName(e.target.value)}
                      placeholder="e.g. Industrial Machines, Tiles, FMCG"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #e2e8f0',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        background: '#fafafa',
                        fontWeight: 700,
                        color: '#0f172a'
                      }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>
                        Weight *
                      </label>
                      {/* Toggle unit: ton or kg */}
                      <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px', gap: '2px' }}>
                        <button
                          type="button"
                          onClick={() => setWeightUnit('ton')}
                          style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            background: weightUnit === 'ton' ? '#4f46e5' : 'transparent',
                            color: weightUnit === 'ton' ? '#ffffff' : '#64748b'
                          }}
                        >
                          Tons
                        </button>
                        <button
                          type="button"
                          onClick={() => setWeightUnit('kg')}
                          style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            background: weightUnit === 'kg' ? '#4f46e5' : 'transparent',
                            color: weightUnit === 'kg' ? '#ffffff' : '#64748b'
                          }}
                        >
                          Kgs
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fafafa' }}>
                      <input
                        type="text"
                        value={packageWeight}
                        onChange={(e) => setPackageWeight(e.target.value)}
                        placeholder={weightUnit === 'ton' ? '1.5' : '1500'}
                        style={{
                          flex: 1,
                          padding: '12px 14px',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          fontSize: '15px',
                          fontWeight: 800,
                          color: '#0f172a'
                        }}
                      />
                      <span style={{ padding: '0 14px', fontSize: '13px', fontWeight: 800, color: '#4f46e5', background: '#eef2ff', height: '100%', display: 'flex', alignItems: 'center' }}>
                        {weightUnit === 'ton' ? 'Tons' : 'Kg'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 3: Boxes (if Cargo) & Payment Mode */}
                <div style={{ display: 'grid', gridTemplateColumns: shipmentMode === 'Cargo' ? '1fr 1fr' : '1fr', gap: '16px', alignItems: 'center' }}>
                  {shipmentMode === 'Cargo' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                        Boxes *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={numBoxes}
                        onChange={(e) => setNumBoxes(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          background: '#fafafa',
                          fontWeight: 700
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                      Payment Mode
                    </label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="paymentMode"
                          checked={paymentMode === 'Prepaid'}
                          onChange={() => setPaymentMode('Prepaid')}
                        />
                        Prepaid
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#4f46e5', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="paymentMode"
                          checked={paymentMode === 'Cash on Delivery'}
                          onChange={() => setPaymentMode('Cash on Delivery')}
                        />
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>

                {/* Actions: Calculate rates & Reset */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={handleCalculateRates}
                    style={{
                      padding: '14px 28px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#6366f1',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '15px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                      transition: 'transform 0.1s'
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    Calculate rates
                  </button>

                  <button
                    type="button"
                    onClick={handleResetRates}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
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

                {/* Calculated Rates Output Card */}
                {calculatedRates && (
                  <div style={{
                    marginTop: '8px',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    border: '1.5px solid #86efac',
                    borderRadius: '16px',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Optimal Shipping Match ({shipmentMode})
                        </span>
                        <h4 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 900, color: '#14532d', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className={`fa-solid ${ALL_CARRIERS.find(c => c.id === calculatedRates.recommendedVehicle)?.icon || 'fa-truck'}`} style={{ color: '#16a34a' }}></i>
                          {ALL_CARRIERS.find(c => c.id === calculatedRates.recommendedVehicle)?.name}
                        </h4>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534' }}>Estimated Fare</span>
                        <div style={{ fontSize: '24px', fontWeight: 900, color: '#15803d' }}>
                          ₹{calculatedRates.estimatedFare.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '12.5px', color: '#166534', fontWeight: 700, borderTop: '1px solid #bbf7d0', paddingTop: '10px' }}>
                      <div><i className="fa-solid fa-indian-rupee-sign"></i> ₹{calculatedRates.ratePerKm}/km Rate Tier</div>
                      <div><i className="fa-regular fa-clock"></i> {calculatedRates.deliveryTime}</div>

                      <div><i className="fa-solid fa-weight-scale"></i> {packageWeight} {weightUnit === 'ton' ? 'Tons' : 'kg'}</div>
                      <div><i className="fa-solid fa-box"></i> {calculatedRates.goodsTypeDesc}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const chosen = ALL_CARRIERS.find(c => c.id === calculatedRates.recommendedVehicle);
                        if (chosen) {
                          if (pickupPincode) setPickup(`Pincode: ${pickupPincode}`);
                          if (deliveryPincode) {
                            setDropoff(shipmentMode === 'International' ? `${destinationCountry}` : `Pincode: ${deliveryPincode}`);
                          } else if (shipmentMode === 'International') {
                            setDropoff(destinationCountry);
                          }
                          if (packageWeight) setCargoWeight(packageWeight);
                          if (weightUnit) setCargoUnit(weightUnit === 'ton' ? 'ton' : 'kg');
                          if (senderPhone && !contactPhone) setContactPhone(senderPhone);
                          setIsSearching(true);
                          handleSelectVehicle(chosen);
                        }
                      }}
                      style={{
                        marginTop: '4px',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        border: 'none',
                        background: '#15803d',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)'
                      }}
                    >
                      <span>Book with {ALL_CARRIERS.find(c => c.id === calculatedRates.recommendedVehicle)?.name}</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* ================= STEP 2: LOGISTICS DASHBOARD (PORTER/MOVERS STYLE) ================= */}
        {step === 2 && (
          <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

            {/* Left Sidebar (Booking Flow) - Widened to 520px for clear layout */}
            <div style={{ width: '520px', minWidth: '480px', background: '#ffffff', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb', zIndex: 10, boxShadow: '4px 0 16px rgba(0,0,0,0.05)', overflowY: 'auto' }}>

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

                  {/* 2. Route & Locations (Moved Top) */}
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

                  {/* 1. Cargo Details (Moved Bottom) */}
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
                              <option>Covered Wagon Payload (58–70 Tonnes - Grain / Cement / Fertilizer)</option>
                              <option>Standard Freight Container</option>
                              <option>Bulk Minerals & Coal (BOXN)</option>
                              <option>Agricultural Produce & Food Grains</option>
                              <option>Automobiles & Parts (NMG)</option>
                              <option>Liquid Tank Wagons (BTPN - Petroleum/Chemicals)</option>
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
                      </div>
                    </div>
                  )}

                  {/* 3. Sender & Receiver Contact Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setBookingRole('Sender')}
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', border: '1px solid', borderColor: bookingRole === 'Sender' ? '#111827' : '#e5e7eb', background: bookingRole === 'Sender' ? '#111827' : '#ffffff', color: bookingRole === 'Sender' ? '#ffffff' : '#4b5563', transition: 'all 0.2s ease' }}
                      >{mode === 'ROAD' ? 'I am the Sender' : 'I am the Shipper'}</button>
                      <button
                        onClick={() => setBookingRole('Receiver')}
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', border: '1px solid', borderColor: bookingRole === 'Receiver' ? '#111827' : '#e5e7eb', background: bookingRole === 'Receiver' ? '#111827' : '#ffffff', color: bookingRole === 'Receiver' ? '#ffffff' : '#4b5563', transition: 'all 0.2s ease' }}
                      >{mode === 'ROAD' ? 'I am the Receiver' : 'I am the Consignee'}</button>
                    </div>

                    {/* Receiver Contact Details (Primary required for parcel delivery call) */}
                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1.5px solid #e2e8f0' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-solid fa-user-check" style={{ color: '#10b981' }}></i>
                        <span>Receiver Contact Details <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>(To call when parcel arrives)</span></span>
                      </h3>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Receiving Person Name *</label>
                          <input
                            type="text"
                            value={receiverName}
                            onChange={e => {
                              setReceiverName(e.target.value);
                              setContactName(e.target.value);
                            }}
                            placeholder="Receiver Full Name"
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '13.5px', fontWeight: '700', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Receiver Mobile Number *</label>
                          <input
                            type="tel"
                            value={receiverPhone}
                            onChange={e => {
                              setReceiverPhone(e.target.value);
                              if (bookingRole === 'Receiver') setContactPhone(e.target.value);
                            }}
                            placeholder="+91 Mobile to call on arrival"
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '13.5px', fontWeight: '700', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sender Contact Details */}
                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1.5px solid #e2e8f0' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-solid fa-user-tag" style={{ color: '#6366f1' }}></i>
                        <span>Sender Contact Details <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>(Pickup Origin)</span></span>
                      </h3>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Sender Name</label>
                          <input
                            type="text"
                            value={senderName}
                            onChange={e => setSenderName(e.target.value)}
                            placeholder="Sender Name"
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '13.5px', fontWeight: '700', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>Sender Mobile *</label>
                          <input
                            type="tel"
                            value={senderPhone}
                            onChange={e => {
                              setSenderPhone(e.target.value);
                              if (bookingRole === 'Sender') setContactPhone(e.target.value);
                            }}
                            placeholder="+91 Mobile Number"
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '13.5px', fontWeight: '700', color: '#111827', outline: 'none', boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>
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

            {/* Right Section (Google Maps Live Distance & Navigation) */}
            <div style={{ flex: 1, position: 'relative', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>

              {/* Map Floating Header Overlay */}
              <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '10px', zIndex: 10 }}>

                <div style={{ background: '#ffffff', padding: '10px 16px', borderRadius: '14px', boxShadow: '0 4px 14px rgba(0,0,0,0.12)', fontSize: '13px', fontWeight: '800', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e2e8f0' }}>
                  <i className="fa-solid fa-location-crosshairs" style={{ color: '#2563eb' }}></i> Google Maps Live
                </div>
                <a
                  href={getDirectGoogleMapsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  style={{ background: '#111827', color: '#ffffff', padding: '10px 14px', borderRadius: '14px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}
                >
                  <i className="fa-solid fa-arrow-up-right-from-square"></i> Open App
                </a>
              </div>

              {/* Live Google Maps Directions & Route View */}
              <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <iframe
                  title="Google Maps Live Directions"
                  src={getGoogleMapsEmbedUrl()}
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
