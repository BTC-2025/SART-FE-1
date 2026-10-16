'use client';

import React, { useState, useEffect } from 'react';
import { useSartStore } from '@/store/useSartStore';
import dynamic from 'next/dynamic';

const LiveTrackerMap = dynamic(() => import('@/components/LeafletMapClient'), { ssr: false });

const ROAD_RENTAL_FLEET = [
  {
    title: 'Bikes & Two-Wheelers',
    vehicles: [
      { id: 'r-activa', name: 'Honda Activa 6G (110cc)', icon: 'fa-motorcycle', color: '#f59e0b', price: 400, category: 'Bike', seats: '2 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: '150 Kms', distance: '1.2 km', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80', badge: 'Fast Booking' },
      { id: 'r-jupiter', name: 'TVS Jupiter 125', icon: 'fa-motorcycle', color: '#3b82f6', price: 450, category: 'Bike', seats: '2 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: '150 Kms', distance: '1.8 km', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80', badge: 'Top Rated' },
      { id: 'r-classic', name: 'Royal Enfield Classic 350', icon: 'fa-motorcycle', color: '#10b981', price: 1000, category: 'Bike', seats: '2 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2024, kms: '300 Kms', distance: '2.1 km', image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=600&q=80', badge: 'Cruiser' },
      { id: 'r-himalayan', name: 'Royal Enfield Himalayan 450', icon: 'fa-mountain', color: '#8b5cf6', price: 1400, category: 'Bike', seats: '2 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2024, kms: '400 Kms', distance: '3.4 km', image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80', badge: 'Adventure' },
      { id: 'r-ktm', name: 'KTM Duke 390 ABS', icon: 'fa-motorcycle', color: '#ea580c', price: 1600, category: 'Bike', seats: '2 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2024, kms: '350 Kms', distance: '2.7 km', image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&q=80', badge: 'Sport' },
    ]
  },
  {
    title: 'Cars - 5 Seater Hatchbacks & Sedans',
    vehicles: [
      { id: 'r-swift', name: 'Maruti Suzuki Swift VXi Ags 2022', icon: 'fa-car', color: '#3b82f6', price: 1800, category: '5 Seater Car', seats: '5 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2022, kms: '500 Kms Included', distance: '3.13 km from Location', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80', badge: 'Only 1 left' },
      { id: 'r-i20', name: 'Hyundai i20 Sportz 2023', icon: 'fa-car', color: '#6366f1', price: 2100, category: '5 Seater Car', seats: '5 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2023, kms: '500 Kms Included', distance: '3.13 km from Location', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUWCH0raA0r-PrGJIFZKMBTP7HegtJSoCQ4N8FWQktwg&s', badge: 'Only 1 left' },
      { id: 'r-fronx', name: 'Maruti Suzuki Fronx Delta (CNG) 2025', icon: 'fa-truck-pickup', color: '#0ea5e9', price: 2400, category: '5 Seater Car', seats: '5 Seats', transmission: 'Manual', fuel: 'CNG', year: 2025, kms: '500 Kms Included', distance: '3.13 km from Location', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80', badge: 'CNG Fuel' },
      { id: 'r-verna', name: 'Hyundai Verna S+ 2022', icon: 'fa-car-rear', color: '#1e293b', price: 2800, category: '5 Seater Car', seats: '5 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2022, kms: '500 Kms Included', distance: '3.13 km from Location', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrKA4V4YbPOCWa4xUJzqe8m7dLrFWD1A8Ngvajv7sG-g&s=10', badge: 'Only 1 left' },
      { id: 'r-celerio', name: 'Maruti Suzuki Celerio VXi (Petrol)', icon: 'fa-car-side', color: '#0ea5e9', price: 1500, category: '5 Seater Car', seats: '5 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2022, kms: '300 Kms Included', distance: '1.6 km from Location', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&q=80', badge: 'Best Value' },
      { id: 'r-dzire', name: 'Maruti Suzuki Dzire Sedan', icon: 'fa-car-rear', color: '#2563eb', price: 2200, category: '5 Seater Car', seats: '5 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: '400 Kms Included', distance: '2.5 km from Location', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYUaaZuIyO0WyUXasdFxcxrhkHKVtVeG4_TNA9xBve4Q&s=10', badge: 'Popular' },
      { id: 'r-city', name: 'Honda City 5th Gen (Petrol)', icon: 'fa-car', color: '#1d4ed8', price: 3200, category: '5 Seater Car', seats: '5 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: '500 Kms Included', distance: '4.2 km from Location', image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&q=80', badge: 'Executive' },
      { id: 'r-creta', name: 'Hyundai Creta SX 1.5 (SUV)', icon: 'fa-truck-pickup', color: '#ec4899', price: 3500, category: '5 Seater Car', seats: '5 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2024, kms: '500 Kms Included', distance: '3.0 km from Location', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80', badge: 'Top Choice' },
      { id: 'r-brezza', name: 'Maruti Suzuki Brezza ZXi', icon: 'fa-truck-pickup', color: '#0284c7', price: 2900, category: '5 Seater Car', seats: '5 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: '450 Kms Included', distance: '2.8 km from Location', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80', badge: 'SUV' },
    ]
  },
  {
    title: 'Cars & SUVs - 7 Seater Family MPV/SUV',
    vehicles: [
      { id: 'r-ertiga', name: 'Maruti Suzuki Ertiga VXi (7 Seater)', icon: 'fa-van-shuttle', color: '#14b8a6', price: 3200, category: '7 Seater SUV', seats: '7 Seats', transmission: 'Manual', fuel: 'Petrol', year: 2023, kms: '500 Kms Included', distance: '2.9 km from Location', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', badge: 'Family Favorite' },
      { id: 'r-innova-crysta', name: 'Toyota Innova Crysta 2.4 (7 Seater)', icon: 'fa-van-shuttle', color: '#eab308', price: 4800, category: '7 Seater SUV', seats: '7 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2023, kms: '600 Kms Included', distance: '3.5 km from Location', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YlXhLs_ltcwVlrliiKFT7NFR9f9USpEnCk-PwrVevQ&s=10', badge: 'Highway King' },
      { id: 'r-scorpio-n', name: 'Mahindra Scorpio-N Z8 (7 Seater)', icon: 'fa-mountain-sun', color: '#f97316', price: 4500, category: '7 Seater SUV', seats: '7 Seats', transmission: 'Automatic', fuel: 'Diesel', year: 2024, kms: '550 Kms Included', distance: '4.1 km from Location', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80', badge: 'Tough 4x4' },
      { id: 'r-xuv700', name: 'Mahindra XUV700 AX7 (7 Seater)', icon: 'fa-crown', color: '#8b5cf6', price: 5200, category: '7 Seater SUV', seats: '7 Seats', transmission: 'Automatic', fuel: 'Diesel', year: 2024, kms: '600 Kms Included', distance: '3.8 km from Location', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-YlXhLs_ltcwVlrliiKFT7NFR9f9USpEnCk-PwrVevQ&s=10', badge: 'VIP Luxury' },
      { id: 'r-hycross', name: 'Toyota Innova HyCross Hybrid (7 Seater)', icon: 'fa-caravan', color: '#06b6d4', price: 5800, category: '7 Seater SUV', seats: '7 Seats', transmission: 'Automatic', fuel: 'Electric', year: 2024, kms: '700 Kms Included', distance: '5.0 km from Location', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80', badge: 'Hybrid Eco' },
    ]
  },
  {
    title: 'Tempo Traveller - 12, 16 & 24 Seater Mini Coaches',
    vehicles: [
      { id: 'r-tempo-12', name: 'Force Tempo Traveller (12 Seater Luxury)', icon: 'fa-van-shuttle', color: '#10b981', price: 6500, category: 'Tempo Traveller', seats: '12 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2023, kms: '600 Kms Included', distance: '3.2 km from Location', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', badge: '12 Seats AC' },
      { id: 'r-tempo-16', name: 'Force Tempo Traveller (16 Seater Pushback)', icon: 'fa-van-shuttle', color: '#0ea5e9', price: 8200, category: 'Tempo Traveller', seats: '16 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2023, kms: '700 Kms Included', distance: '4.0 km from Location', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', badge: '16 Seats Pushback' },
      { id: 'r-tempo-24', name: 'Force Tempo Mini Coach (24 Seater)', icon: 'fa-bus', color: '#7c3aed', price: 12000, category: 'Tempo Traveller', seats: '24 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2024, kms: '800 Kms Included', distance: '5.2 km from Location', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', badge: '24 Seats Coach' },
      { id: 'r-tempo-urbania', name: 'Force Urbania Executive (17 Seater VIP)', icon: 'fa-bus-simple', color: '#db2777', price: 14000, category: 'Tempo Traveller', seats: '17 Seats', transmission: 'Manual', fuel: 'Diesel', year: 2024, kms: '800 Kms Included', distance: '4.8 km from Location', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80', badge: 'VIP Urbania' },
    ]
  }
];

const SEA_RENTAL_FLEET = [
  {
    title: 'Personal Watercraft & Speedboats',
    vehicles: [
      { id: 'r-jetski', name: 'Yamaha WaveRunner Jet Ski (2 Seater)', icon: 'fa-water', color: '#0ea5e9', price: 3500, category: 'Ship / Boat', seats: '2 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: 'Unlimited Marina', distance: 'Marina Dock 4', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80', badge: 'Jet Ski' },
      { id: 'r-speedboat', name: 'Bayliner Element Speedboat (6 Seater)', icon: 'fa-sailboat', color: '#0284c7', price: 12000, category: 'Ship / Boat', seats: '6 Seats', transmission: 'Automatic', fuel: 'Petrol', year: 2023, kms: 'Harbor Bound', distance: 'Pier 2B', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80', badge: 'Speedboat' },
      { id: 'r-cabin', name: 'Sea Ray Sundancer Cruiser (10 Seater)', icon: 'fa-anchor', color: '#0369a1', price: 25000, category: 'Ship / Boat', seats: '10 Seats', transmission: 'Automatic', fuel: 'Diesel', year: 2024, kms: 'Coastal Route', distance: 'Yacht Club', image: 'https://images.unsplash.com/photo-1548574505-12caf0050b5b?w=600&q=80', badge: 'Cruiser' },
      { id: 'r-yacht', name: 'Luxury Private Yacht Charter (20 Seater)', icon: 'fa-ship', color: '#eab308', price: 95000, category: 'Ship / Boat', seats: '20 Seats', transmission: 'Automatic', fuel: 'Diesel', year: 2024, kms: 'Deep Sea Charter', distance: 'Royal Port', image: 'https://images.unsplash.com/photo-1548574505-12caf0050b5b?w=600&q=80', badge: 'Ultra Luxury' },
    ]
  }
];

const AIR_RENTAL_FLEET = [
  {
    title: 'Air Charters & Choppers',
    vehicles: [
      { id: 'r-chopper', name: 'Bell 407 Light Helicopter (6 Seater)', icon: 'fa-helicopter', color: '#059669', price: 85000, category: 'Air Charter', seats: '6 Seats', transmission: 'Automatic', fuel: 'Aviation Fuel', year: 2023, kms: 'Helipad Transfer', distance: 'Helipad Bay 1', image: 'https://images.unsplash.com/photo-1506501139174-099022df5260?w=600&q=80', badge: 'Chopper' },
      { id: 'r-lightjet', name: 'Cessna Citation Private Jet (8 Seater)', icon: 'fa-plane-up', color: '#8b5cf6', price: 250000, category: 'Air Charter', seats: '8 Seats', transmission: 'Automatic', fuel: 'Jet A1', year: 2024, kms: 'Flight Route', distance: 'Terminal VIP', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80', badge: 'Private Jet' },
    ]
  }
];

const RAIL_RENTAL_FLEET = [
  {
    title: 'Private Rail & Saloon Cars',
    vehicles: [
      { id: 'r-saloon', name: 'IRCTC Private Luxury Saloon Coach (18 Seater)', icon: 'fa-train', color: '#8b5cf6', price: 65000, category: 'Train Charter', seats: '18 Seats', transmission: 'Automatic', fuel: 'Electric', year: 2023, kms: 'Rail Network', distance: 'Platform 1 VIP', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80', badge: 'Saloon Car' },
      { id: 'r-tourist', name: 'Exclusive Heritage Tourist Train (Full Rake)', icon: 'fa-champagne-glasses', color: '#eab308', price: 250000, category: 'Train Charter', seats: '120 Seats', transmission: 'Automatic', fuel: 'Electric', year: 2024, kms: 'National Circuit', distance: 'Central Yard', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80', badge: 'Heritage Rake' },
    ]
  }
];

const ALL_RENTAL_VEHICLES = [
  ...ROAD_RENTAL_FLEET.map(c => c.vehicles).flat(),
  ...SEA_RENTAL_FLEET.map(c => c.vehicles).flat(),
  ...AIR_RENTAL_FLEET.map(c => c.vehicles).flat(),
  ...RAIL_RENTAL_FLEET.map(c => c.vehicles).flat()
];

const RENTAL_MASTER_CATEGORIES = [
  { id: 'bike', name: 'Bikes & Scooters', icon: 'fa-motorcycle', color: '#f59e0b', desc: 'Activa, Classic 350, Duke, Himalayan', type: 'ROAD', list: ROAD_RENTAL_FLEET[0].vehicles },
  { id: 'car-5', name: '5-Seater Cars', icon: 'fa-car-side', color: '#3b82f6', desc: 'Celerio, Swift, i20, Dzire, Creta, Brezza', type: 'ROAD', list: ROAD_RENTAL_FLEET[1].vehicles },
  { id: 'suv-7', name: '7-Seater SUVs', icon: 'fa-mountain-sun', color: '#ec4899', desc: 'Ertiga, Innova Crysta, Scorpio-N, XUV700', type: 'ROAD', list: ROAD_RENTAL_FLEET[2].vehicles },
  { id: 'tempo', name: 'Tempo Travellers', icon: 'fa-van-shuttle', color: '#10b981', desc: '12, 16 & 24 Seater Mini Buses', type: 'ROAD', list: ROAD_RENTAL_FLEET[3].vehicles },
  { id: 'water', name: 'Ships & Boats', icon: 'fa-ship', color: '#0ea5e9', desc: 'Speedboats, Cruise & Luxury Yachts', type: 'SEA', list: SEA_RENTAL_FLEET[0].vehicles },
  { id: 'air', name: 'Air Charters', icon: 'fa-plane', color: '#8b5cf6', desc: 'Helicopters & Private Jets', type: 'AIR', list: AIR_RENTAL_FLEET[0].vehicles },
  { id: 'rail', name: 'Train Charters', icon: 'fa-train', color: '#ef4444', desc: 'Private Saloon Coach & Tourist Rake', type: 'RAIL', list: RAIL_RENTAL_FLEET[0].vehicles }
];

interface RentalBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

class ModalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
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

      let searchParamsObj = new URLSearchParams();
      if (typeof window !== 'undefined') {
        searchParamsObj = new URLSearchParams(window.location.search);
      }

      const subService = searchParamsObj.get('subService');
      const origin = searchParamsObj.get('origin');

      if (subService || path.includes('-rental') || path.startsWith('/home/rental/')) {
        let masterId = '';
        if (subService) {
          masterId = subService.toLowerCase();
        } else {
          const parts = path.split('/');
          const lastPart = parts[parts.length - 1];
          if (lastPart && lastPart !== 'rental' && lastPart !== 'home') {
            masterId = decodeURIComponent(lastPart).replace('-rental', '').toLowerCase();
          }
        }

        if (masterId) {
          // If the ID matches a master category directly (like 'car', 'bike')
          let foundMaster = RENTAL_MASTER_CATEGORIES.find(m => m.name.toLowerCase().includes(masterId) || m.id.toLowerCase() === masterId);
          let foundVehicleId = '';

          // If not found directly, it might be a specific vehicle ID (like 'r-premium-hatch')
          if (!foundMaster) {
            for (const category of RENTAL_MASTER_CATEGORIES) {
              const vehicleMatch = category.list.find((v: any) => v.id.toLowerCase() === masterId || v.name.toLowerCase().includes(masterId));
              if (vehicleMatch) {
                foundMaster = category;
                foundVehicleId = vehicleMatch.id;
                break;
              }
            }
          }

          if (foundMaster) {
            setSelectedMasterId(foundMaster.id);
            if (foundVehicleId) {
              setSelectedVehicleId(foundVehicleId);
            } else if (foundMaster.list.length > 0) {
              setSelectedVehicleId(foundMaster.list[0].id);
            }

            if (origin) setPickup(origin);

            // Aesthetic URL update
            if (typeof window !== 'undefined' && path === '/home/rental' && subService) {
              try {
                const cleanName = foundMaster.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const nativePushState = Object.getPrototypeOf(window.history).pushState;
                nativePushState.call(window.history, null, '', `/home/rental/${cleanName}`);
              } catch (e) {
                // Ignore
              }
            }

            setStep(2);
            return;
          }
        }
      }

      if (path.includes('-checkout')) {
        setStep(3);
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
  const [dropoff, setDropoff] = useState('');
  const [returnToSameLocation, setReturnToSameLocation] = useState(true);
  const [showLocationList, setShowLocationList] = useState(false);
  const [showDropoffList, setShowDropoffList] = useState(false);

  // Pick-up Date & Time (Calendar & Time selector)
  const [pickupDate, setPickupDate] = useState('Sat, 17 Oct');
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [showPickupCalendar, setShowPickupCalendar] = useState(false);
  const [pickupCalMonth, setPickupCalMonth] = useState(9);
  const [pickupCalYear, setPickupCalYear] = useState(2026);

  // Drop-off Date & Time (Calendar & Time selector with Quick Duration Pills: 1 Day, 1 Week, 1 Month)
  const [dropoffDate, setDropoffDate] = useState('Sun, 18 Oct');
  const [dropoffTime, setDropoffTime] = useState('10:00 AM');
  const [showDropoffCalendar, setShowDropoffCalendar] = useState(false);
  const [dropoffCalMonth, setDropoffCalMonth] = useState(9);
  const [dropoffCalYear, setDropoffCalYear] = useState(2026);

  // Vehicle Selection Dropdown
  const [selectedRentalVehicleId, setSelectedRentalVehicleId] = useState('r-swift');
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [selectedVehicleCategoryFilter, setSelectedVehicleCategoryFilter] = useState('ALL');

  // Filter & Sort States for Step 2 Search Results (Matching Screenshot 2)
  const [filterFuel, setFilterFuel] = useState<string>('ALL');
  const [filterTransmission, setFilterTransmission] = useState<string>('ALL');
  const [filterSeats, setFilterSeats] = useState<string>('ALL');
  const [filterModelYear, setFilterModelYear] = useState<string>('ALL');
  const [filterCategoryModel, setFilterCategoryModel] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('near_first');

  // Live Location State & Distance
  const [userLocationName, setUserLocationName] = useState('Bengaluru (Indiranagar)');
  const [isLocating, setIsLocating] = useState(false);

  const [rentalType, setRentalType] = useState('Daily');
  const [durationPlan, setDurationPlan] = useState<'1day' | '3days' | '1week' | '2weeks' | '1month' | 'custom'>('1day');
  const [customDays, setCustomDays] = useState(1);
  const [startDate, setStartDate] = useState('2026-10-17');
  const [startTime, setStartTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState('2026-10-18');
  const [returnTime, setReturnTime] = useState('10:00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Customer verification details (KYC / Document Verification)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [docType, setDocType] = useState<'dl' | 'aadhaar' | 'pan'>('dl');
  const [docNumber, setDocNumber] = useState('');
  const [uploadedDocName, setUploadedDocName] = useState('driving_license_front.jpg');
  const [isDocVerified, setIsDocVerified] = useState(true);

  const pickupBoxRef = React.useRef<HTMLDivElement>(null);
  const dropoffBoxRef = React.useRef<HTMLDivElement>(null);
  const pickupCalRef = React.useRef<HTMLDivElement>(null);
  const dropoffCalRef = React.useRef<HTMLDivElement>(null);
  const vehicleBoxRef = React.useRef<HTMLDivElement>(null);

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

  const handleSelectPickupDate = (day: number, m = pickupCalMonth, y = pickupCalYear) => {
    const formatted = `${String(day).padStart(2, '0')} ${MONTH_SHORT[m]}, ${y}`;
    setPickupDate(formatted);
    setShowPickupCalendar(false);
  };

  const handleSelectDropoffDate = (day: number, m = dropoffCalMonth, y = dropoffCalYear) => {
    const formatted = `${String(day).padStart(2, '0')} ${MONTH_SHORT[m]}, ${y}`;
    setDropoffDate(formatted);
    setShowDropoffCalendar(false);
  };

  const handleSwapRentalLocations = () => {
    const temp = pickup;
    setPickup(dropoff);
    setDropoff(temp);
  };

  const INDIAN_CITIES = ['Bengaluru', 'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Vellore', 'Erode', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Kochi', 'Mysuru', 'Goa'];

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

  // Close popups on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        pickupCalRef.current &&
        !pickupCalRef.current.contains(e.target as Node) &&
        pickupBoxRef.current &&
        !pickupBoxRef.current.contains(e.target as Node)
      ) {
        setShowPickupCalendar(false);
        setShowLocationList(false);
      }

      if (
        dropoffCalRef.current &&
        !dropoffCalRef.current.contains(e.target as Node) &&
        dropoffBoxRef.current &&
        !dropoffBoxRef.current.contains(e.target as Node)
      ) {
        setShowDropoffCalendar(false);
        setShowDropoffList(false);
      }

      if (
        vehicleBoxRef.current &&
        !vehicleBoxRef.current.contains(e.target as Node)
      ) {
        setShowVehicleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
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

        {/* ================= STEP 1: SELF-DRIVE & RENTALS SEARCH + FLEET ================= */}
        {step === 1 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#f8fafc' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  <i className="fa-solid fa-key"></i>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Self-Drive & Rentals</h2>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Cars (5 & 7 Seats), Tempo Travellers (12, 16, 24 Seats), Bikes & Watercraft</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', fontSize: '16px' }}
                title="Close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Scrollable Container */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* 🚘 Unified Horizontal Search Card */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  background: '#ffffff',
                  position: 'relative'
                }}>
                  {/* 1. PICKUP AND RETURN LOCATION */}
                  <div
                    style={{ flex: 1.2, minWidth: 0, padding: '10px 16px', borderRight: '1px solid #e2e8f0', position: 'relative', display: 'flex', flexDirection: 'column' }}
                    ref={pickupBoxRef}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'capitalize' }}>
                        Pickup location
                      </span>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '10.5px', fontWeight: 700, color: '#0284c7' }} title="Toggle same return location">
                        <input
                          type="checkbox"
                          checked={returnToSameLocation}
                          onChange={(e) => {
                            setReturnToSameLocation(e.target.checked);
                            if (e.target.checked) setDropoff(pickup);
                          }}
                          style={{ width: '12px', height: '12px', accentColor: '#0284c7', cursor: 'pointer' }}
                        />
                        <span>Return to the same location</span>
                      </label>
                    </div>

                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => {
                        setPickup(e.target.value);
                        if (returnToSameLocation) setDropoff(e.target.value);
                        setShowLocationList(true);
                      }}
                      onFocus={() => setShowLocationList(true)}
                      placeholder="Truro, Bengaluru, Chennai..."
                      style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '15px', fontWeight: 800, color: '#0f172a', padding: 0, width: '100%' }}
                    />

                    {!returnToSameLocation && (
                      <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #cbd5e1' }} ref={dropoffBoxRef}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '2px' }}>Different Return Location:</span>
                        <input
                          type="text"
                          value={dropoff}
                          onChange={(e) => {
                            setDropoff(e.target.value);
                            setShowDropoffList(true);
                          }}
                          onFocus={() => setShowDropoffList(true)}
                          placeholder="Drop-off location"
                          style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', fontWeight: 700, color: '#0f172a', width: '100%' }}
                        />
                      </div>
                    )}

                    {/* Suggestions popup (Including Truro & major hubs) */}
                    {showLocationList && (
                      <div className="hero-suggestions-popup" style={{ position: 'absolute', top: '100%', left: 0, width: '280px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden', marginTop: '6px' }}>
                        <div style={{ padding: '8px 12px', background: '#f8fafc', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Select Location</div>
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {['Truro', ...INDIAN_CITIES].filter(c => !pickup || c.toLowerCase().includes(pickup.toLowerCase())).map(city => (
                            <div
                              key={`p-city-${city}`}
                              onClick={() => {
                                setPickup(city);
                                if (returnToSameLocation) setDropoff(city);
                                setShowLocationList(false);
                              }}
                              style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}
                            >
                              <i className="fa-solid fa-location-dot" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                              <span>{city}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. PICKUP DATE AND TIME */}
                  <div
                    style={{ flex: 1.1, minWidth: 0, padding: '10px 16px', borderRight: '1px solid #e2e8f0', position: 'relative', display: 'flex', flexDirection: 'column' }}
                    ref={pickupCalRef}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'capitalize', marginBottom: '3px' }}>
                      Pickup date and time
                    </span>

                    {/* Pick-up date and time pill with interactive calendar & time */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPickupCalendar(prev => !prev);
                        setShowDropoffCalendar(false);
                        setShowVehicleDropdown(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        background: '#f0fdf4',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      title="Click to select pick-up date & time"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                        <i className="fa-regular fa-calendar-check" style={{ color: '#16a34a', fontSize: '12px' }}></i>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#15803d', whiteSpace: 'nowrap' }}>{pickupDate}</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#166534' }}>Time: {pickupTime}</span>
                        </div>
                      </div>
                      <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: '#16a34a' }}></i>
                    </div>

                    {/* Interactive Calendar & Time Selector Popup for Pick-up */}
                    {showPickupCalendar && (
                      <div
                        className="hero-calendar-popup"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 8px)',
                          left: 0,
                          background: '#ffffff',
                          borderRadius: '16px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.25)',
                          padding: '16px',
                          zIndex: 1000,
                          width: '320px',
                          animation: 'fbFadeInDown 0.18s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <button
                            type="button"
                            className="hero-cal-nav-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (pickupCalMonth === 0) {
                                setPickupCalMonth(11);
                                setPickupCalYear(y => y - 1);
                              } else {
                                setPickupCalMonth(m => m - 1);
                              }
                            }}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <i className="fa-solid fa-chevron-left"></i>
                          </button>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                            {MONTH_NAMES[pickupCalMonth]} {pickupCalYear}
                          </span>
                          <button
                            type="button"
                            className="hero-cal-nav-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (pickupCalMonth === 11) {
                                setPickupCalMonth(0);
                                setPickupCalYear(y => y + 1);
                              } else {
                                setPickupCalMonth(m => m + 1);
                              }
                            }}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => (
                            <span key={w} style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>{w}</span>
                          ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                          {Array.from({ length: getFirstDayOfMonth(pickupCalYear, pickupCalMonth) }).map((_, i) => (
                            <div key={`pcal-empty-${i}`}></div>
                          ))}
                          {Array.from({ length: getDaysInMonth(pickupCalYear, pickupCalMonth) }).map((_, i) => {
                            const dayNum = i + 1;
                            const dayFormatted = String(dayNum).padStart(2, '0');
                            const isSelected = pickupDate.includes(`${dayFormatted} ${MONTH_SHORT[pickupCalMonth]}`);

                            return (
                              <button
                                key={`pcal-day-${dayNum}`}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectPickupDate(dayNum);
                                }}
                                style={{
                                  height: '32px',
                                  border: 'none',
                                  borderRadius: '8px',
                                  background: isSelected ? '#16a34a' : 'transparent',
                                  color: isSelected ? '#ffffff' : '#1e293b',
                                  fontWeight: isSelected ? 800 : 600,
                                  fontSize: '12px',
                                  cursor: 'pointer'
                                }}
                              >
                                {dayNum}
                              </button>
                            );
                          })}
                        </div>

                        {/* Pick-up Time Selector */}
                        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>Pick up Time</span>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '06:00 PM', '09:00 PM'].map(t => (
                              <button
                                key={t}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPickupTime(t);
                                }}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: pickupTime === t ? '1.5px solid #16a34a' : '1px solid #e2e8f0',
                                  background: pickupTime === t ? '#f0fdf4' : '#ffffff',
                                  color: pickupTime === t ? '#15803d' : '#475569',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. RETURN DATE AND TIME (With 1 Day / 1 Week / 1 Month Pills + Calendar) */}
                  <div
                    style={{ flex: 1.15, minWidth: 0, padding: '10px 16px', borderRight: '1px solid #e2e8f0', position: 'relative', display: 'flex', flexDirection: 'column' }}
                    ref={dropoffCalRef}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'capitalize' }}>
                        Return date and time
                      </span>
                    </div>

                    {/* Return Date & Time pill */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropoffCalendar(prev => !prev);
                        setShowPickupCalendar(false);
                        setShowVehicleDropdown(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        background: '#fef2f2',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      title="Click to select return date, duration or open calendar"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                        <i className="fa-regular fa-calendar-xmark" style={{ color: '#dc2626', fontSize: '12px' }}></i>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#b91c1c', whiteSpace: 'nowrap' }}>{dropoffDate}</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#991b1b' }}>Time: {dropoffTime}</span>
                        </div>
                      </div>
                      <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: '#dc2626' }}></i>
                    </div>

                    {/* Interactive Calendar & Return Duration Selector Popup (1 Day, 1 Week, 1 Month or choose exact date) */}
                    {showDropoffCalendar && (
                      <div
                        className="hero-calendar-popup"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 8px)',
                          left: 0,
                          background: '#ffffff',
                          borderRadius: '16px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.25)',
                          padding: '16px',
                          zIndex: 1000,
                          width: '330px',
                          animation: 'fbFadeInDown 0.18s ease'
                        }}
                      >
                        {/* Quick Presets: 1 Day, 1 Week, 1 Month */}
                        <div style={{ marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>
                            Quick Return Duration:
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                            {[
                              { label: '1 Day', days: 1, text: 'Sun, 18 Oct' },
                              { label: '1 Week', days: 7, text: 'Sat, 24 Oct' },
                              { label: '1 Month', days: 30, text: 'Mon, 16 Nov' }
                            ].map(preset => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDropoffDate(preset.text);
                                  setCustomDays(preset.days);
                                  setDurationPlan(preset.days === 1 ? '1day' : preset.days === 7 ? '1week' : '1month');
                                }}
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  border: dropoffDate === preset.text ? '1.5px solid #dc2626' : '1px solid #cbd5e1',
                                  background: dropoffDate === preset.text ? '#fef2f2' : '#f8fafc',
                                  color: dropoffDate === preset.text ? '#b91c1c' : '#334155',
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  textAlign: 'center'
                                }}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Calendar Navigation */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <button
                            type="button"
                            className="hero-cal-nav-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (dropoffCalMonth === 0) {
                                setDropoffCalMonth(11);
                                setDropoffCalYear(y => y - 1);
                              } else {
                                setDropoffCalMonth(m => m - 1);
                              }
                            }}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <i className="fa-solid fa-chevron-left"></i>
                          </button>
                          <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                            {MONTH_NAMES[dropoffCalMonth]} {dropoffCalYear}
                          </span>
                          <button
                            type="button"
                            className="hero-cal-nav-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (dropoffCalMonth === 11) {
                                setDropoffCalMonth(0);
                                setDropoffCalYear(y => y + 1);
                              } else {
                                setDropoffCalMonth(m => m + 1);
                              }
                            }}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <i className="fa-solid fa-chevron-right"></i>
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '6px' }}>
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => (
                            <span key={w} style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8' }}>{w}</span>
                          ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                          {Array.from({ length: getFirstDayOfMonth(dropoffCalYear, dropoffCalMonth) }).map((_, i) => (
                            <div key={`dcal-empty-${i}`}></div>
                          ))}
                          {Array.from({ length: getDaysInMonth(dropoffCalYear, dropoffCalMonth) }).map((_, i) => {
                            const dayNum = i + 1;
                            const dayFormatted = String(dayNum).padStart(2, '0');
                            const isSelected = dropoffDate.includes(`${dayFormatted} ${MONTH_SHORT[dropoffCalMonth]}`);

                            return (
                              <button
                                key={`dcal-day-${dayNum}`}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectDropoffDate(dayNum);
                                }}
                                style={{
                                  height: '30px',
                                  border: 'none',
                                  borderRadius: '6px',
                                  background: isSelected ? '#dc2626' : 'transparent',
                                  color: isSelected ? '#ffffff' : '#1e293b',
                                  fontWeight: isSelected ? 800 : 600,
                                  fontSize: '11.5px',
                                  cursor: 'pointer'
                                }}
                              >
                                {dayNum}
                              </button>
                            );
                          })}
                        </div>

                        {/* Return Time Selector */}
                        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>Return Time</span>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '06:00 PM', '09:00 PM'].map(t => (
                              <button
                                key={t}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDropoffTime(t);
                                }}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  border: dropoffTime === t ? '1.5px solid #dc2626' : '1px solid #e2e8f0',
                                  background: dropoffTime === t ? '#fef2f2' : '#ffffff',
                                  color: dropoffTime === t ? '#b91c1c' : '#475569',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SELECT VEHICLE CATEGORY DROPDOWN (Bikes, 5-Seats, 7-Seats, Tempo 12, 16, 24 Seats, Ships) */}
                  <div
                    style={{ flex: 1.4, minWidth: 0, padding: '10px 16px', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column' }}
                    ref={vehicleBoxRef}
                    onClick={() => {
                      setShowVehicleDropdown(prev => !prev);
                      setShowPickupCalendar(false);
                      setShowDropoffCalendar(false);
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'capitalize', marginBottom: '3px' }}>Select Category & Fleet</span>
                    {(() => {
                      const selMaster = RENTAL_MASTER_CATEGORIES.find(m => m.id === selectedMasterId) || RENTAL_MASTER_CATEGORIES[1];
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: selMaster.color + '15', color: selMaster.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                              <i className={`fa-solid ${selMaster.icon}`}></i>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {selMaster.name}
                              </span>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                                {selMaster.list.length} Models • {selMaster.desc}
                              </span>
                            </div>
                          </div>
                          <i className="fa-solid fa-chevron-down" style={{ fontSize: '11px', color: '#64748b' }}></i>
                        </div>
                      );
                    })()}

                    {/* Category Selection Dropdown (No prices shown here - prices calculated dynamically based on days/weeks/months) */}
                    {showVehicleDropdown && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 8px)',
                          right: 0,
                          width: '440px',
                          maxWidth: '92vw',
                          background: '#ffffff',
                          borderRadius: '16px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.25)',
                          padding: '16px',
                          zIndex: 1000,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          animation: 'fbFadeInDown 0.18s ease'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Select Vehicle Category</h4>
                            <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Choose vehicle type. Pricing applies on vehicle catalog page by chosen duration.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowVehicleDropdown(false)}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>

                        {/* List of 7 Master Categories matching user request */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                          {RENTAL_MASTER_CATEGORIES.map((m) => {
                            const isSelected = selectedMasterId === m.id;
                            return (
                              <div
                                key={m.id}
                                onClick={() => {
                                  setSelectedMasterId(m.id);
                                  if (m.list.length > 0) {
                                    setSelectedRentalVehicleId(m.list[0].id);
                                  }
                                  setShowVehicleDropdown(false);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '10px 14px',
                                  borderRadius: '12px',
                                  border: isSelected ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                                  background: isSelected ? '#f0f9ff' : '#ffffff',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div
                                    style={{
                                      width: '38px',
                                      height: '38px',
                                      borderRadius: '10px',
                                      background: m.color + '15',
                                      color: m.color,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '16px',
                                      flexShrink: 0
                                    }}
                                  >
                                    <i className={`fa-solid ${m.icon}`}></i>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>{m.name}</span>
                                      <span style={{ fontSize: '10.5px', background: '#f1f5f9', color: '#475569', padding: '1px 7px', borderRadius: '4px', fontWeight: 700 }}>
                                        {m.list.length} Models
                                      </span>
                                    </div>
                                    <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>{m.desc}</span>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284c7', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                                  <span>Select</span>
                                  <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px' }}></i>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Search CTA Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const selectedVeh = ALL_RENTAL_VEHICLES.find(v => v.id === selectedRentalVehicleId) || ALL_RENTAL_VEHICLES[1];
                      // Find which master category this vehicle belongs to
                      let targetMaster = RENTAL_MASTER_CATEGORIES.find(m => m.list.some(v => v.id === selectedVeh.id));
                      if (!targetMaster) targetMaster = RENTAL_MASTER_CATEGORIES[1];
                      handleSelectMaster(targetMaster);
                      setSelectedVehicleId(selectedVeh.id);
                    }}
                    style={{
                      background: '#f25a1b',
                      border: 'none',
                      borderRadius: '0 11px 11px 0',
                      padding: '0 28px',
                      height: '66px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: 800,
                      flexShrink: 0,
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e04c10'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f25a1b'}
                  >
                    <span>Search</span>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '13px' }}></i>
                  </button>
                </div>
              </div>

              {/* Quick Filter Section Title */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Explore Rental Fleet by Category & Seating</h3>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{ALL_RENTAL_VEHICLES.length} Available Vehicles</span>
              </div>

              {/* Master Category Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {RENTAL_MASTER_CATEGORIES.map(m => (
                  <div
                    key={m.id}
                    onClick={() => handleSelectMaster(m)}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: '#ffffff',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: m.color + '15', color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                        <i className={`fa-solid ${m.icon}`}></i>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#f1f5f9', color: '#475569' }}>
                        {m.list.length} Models
                      </span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1f2937', marginBottom: '4px' }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px', lineHeight: 1.4 }}>
                      {m.desc}
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0ea5e9' }}>
                        From ₹{Math.min(...m.list.map(v => v.price))}/day
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Select <i className="fa-solid fa-arrow-right" style={{ fontSize: '10px' }}></i>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 2: SEARCH RESULTS CATALOG (ZOOMCAR STYLE - SCREENSHOT 2) ================= */}
        {step === 2 && activeMaster && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#f8fafc' }}>

            {/* Top Navigation & Hub Bar */}
            <div style={{ padding: '14px 24px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  type="button"
                  onClick={handleBackToFleet}
                  style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Back to Search"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                    Self-drive cars, bikes and scooties across India
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                      {pickup ? `Pickup: ${pickup}` : 'Current Hub'} • {pickupDate} to {dropoffDate}
                    </span>
                    <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '20px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <i className="fa-solid fa-location-crosshairs"></i> Your Location: {userLocationName}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsLocating(true);
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        () => {
                          setIsLocating(false);
                          setUserLocationName('Near Current GPS (Accurate)');
                        },
                        () => {
                          setIsLocating(false);
                          setUserLocationName('Bengaluru (Indiranagar)');
                        }
                      );
                    } else {
                      setIsLocating(false);
                    }
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <i className={`fa-solid fa-location-arrow ${isLocating ? 'fa-spin' : ''}`} style={{ color: '#0284c7' }}></i>
                  {isLocating ? 'Detecting Location...' : 'Use My GPS Location'}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Main Catalog Layout: Left Filter Panel + Right Vehicles Grid */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

              {/* Left Filter Sidebar */}
              <div style={{ width: '280px', background: '#ffffff', borderRight: '1px solid #e2e8f0', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fa-solid fa-sliders" style={{ color: '#0284c7' }}></i>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Filters</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterFuel('ALL');
                      setFilterTransmission('ALL');
                      setFilterSeats('ALL');
                      setFilterModelYear('ALL');
                      setFilterCategoryModel('ALL');
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#0284c7', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Reset All
                  </button>
                </div>

                {/* Rental Duration Plan Selector (Days / 1 Week / 2 Weeks / 1 Month) */}
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-regular fa-clock" style={{ color: '#0284c7' }}></i> Rental Duration Plan
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7' }}>
                      {durationPlan === '1day' ? '1 Day' : durationPlan === '3days' ? '3 Days' : durationPlan === '1week' ? '1 Week (7 Days)' : durationPlan === '2weeks' ? '2 Weeks (14 Days)' : durationPlan === '1month' ? '1 Month (30 Days)' : `${customDays} Days`}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {[
                      { id: '1day' as const, label: '1 Day', days: 1 },
                      { id: '3days' as const, label: '3 Days', days: 3 },
                      { id: '1week' as const, label: '1 Week', days: 7 },
                      { id: '2weeks' as const, label: '2 Weeks', days: 14 },
                      { id: '1month' as const, label: '1 Month', days: 30 },
                      { id: 'custom' as const, label: 'Custom', days: customDays }
                    ].map(dp => (
                      <button
                        key={dp.id}
                        type="button"
                        onClick={() => {
                          setDurationPlan(dp.id);
                          if (dp.id !== 'custom') {
                            setCustomDays(dp.days);
                          }
                        }}
                        style={{
                          padding: '6px 4px',
                          borderRadius: '8px',
                          border: durationPlan === dp.id ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                          background: durationPlan === dp.id ? '#0284c7' : '#ffffff',
                          color: durationPlan === dp.id ? '#ffffff' : '#334155',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {dp.label}
                      </button>
                    ))}
                  </div>

                  {durationPlan === 'custom' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px dashed #cbd5e1' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Number of Days:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setCustomDays(d => Math.max(1, d - 1))}
                          style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 800 }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', minWidth: '20px', textAlign: 'center' }}>
                          {customDays}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCustomDays(d => d + 1)}
                          style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 800 }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                  <span style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic' }}>
                    Vehicle price auto-calculates based on this duration.
                  </span>
                </div>

                {/* Popular Model Categories (Horizontal Scrollable Thumbnails like Screenshot 2) */}
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '8px' }}>Popular Models</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {[
                      { id: 'ALL', name: 'All Models', count: '10+' },
                      { id: 'Swift', name: 'Maruti Swift', count: 'Only 1 left', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=150&q=80' },
                      { id: 'i20', name: 'Hyundai i20', count: 'Only 1 left', img: 'https://images.unsplash.com/photo-1503376710356-70d6943f65e2?w=150&q=80' },
                      { id: 'Fronx', name: 'Maruti Fronx', count: 'Only 1 left', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=150&q=80' },
                      { id: 'Verna', name: 'Hyundai Verna', count: 'Only 1 left', img: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?w=150&q=80' },
                    ].map(m => (
                      <div
                        key={m.id}
                        onClick={() => setFilterCategoryModel(m.id)}
                        style={{
                          border: filterCategoryModel === m.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '6px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          background: filterCategoryModel === m.id ? '#f0f9ff' : '#ffffff',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {m.count && (
                          <span style={{ fontSize: '9px', fontWeight: 800, color: '#d97706', background: '#fef3c7', padding: '1px 5px', borderRadius: '4px', marginBottom: '4px' }}>
                            {m.count}
                          </span>
                        )}
                        {m.img && (
                          <img src={m.img} alt={m.name} style={{ width: '60px', height: '36px', objectFit: 'contain', borderRadius: '4px' }} />
                        )}
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', textAlign: 'center', marginTop: '4px' }}>{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fuel Type */}
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <i className="fa-solid fa-gas-pump" style={{ color: '#64748b' }}></i> Fuel Type
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {['ALL', 'Petrol', 'Diesel', 'CNG', 'Electric'].map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFilterFuel(f)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: filterFuel === f ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                          background: filterFuel === f ? '#e0f2fe' : '#ffffff',
                          color: filterFuel === f ? '#0369a1' : '#475569',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {f === 'ALL' ? 'All Fuels' : f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <i className="fa-solid fa-gear" style={{ color: '#64748b' }}></i> Transmission
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {['ALL', 'Manual', 'Automatic'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFilterTransmission(t)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: filterTransmission === t ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                          background: filterTransmission === t ? '#e0f2fe' : '#ffffff',
                          color: filterTransmission === t ? '#0369a1' : '#475569',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {t === 'ALL' ? 'Any' : t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seating Capacity */}
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <i className="fa-solid fa-users" style={{ color: '#64748b' }}></i> Seating Capacity
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {[
                      { id: 'ALL', label: 'All Seats' },
                      { id: '5', label: '4-5 Seats' },
                      { id: '7', label: '6-7 Seats' },
                      { id: '12', label: '12-24 Seats' }
                    ].map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setFilterSeats(s.id)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: filterSeats === s.id ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                          background: filterSeats === s.id ? '#e0f2fe' : '#ffffff',
                          color: filterSeats === s.id ? '#0369a1' : '#475569',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Year */}
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <i className="fa-regular fa-calendar" style={{ color: '#64748b' }}></i> Model Year
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    {['ALL', 'Under 3 years', 'Under 5 years', 'Under 7 years'].map(y => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => setFilterModelYear(y)}
                        style={{
                          padding: '6px 8px',
                          borderRadius: '8px',
                          border: filterModelYear === y ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                          background: filterModelYear === y ? '#e0f2fe' : '#ffffff',
                          color: filterModelYear === y ? '#0369a1' : '#475569',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {y === 'ALL' ? 'Any Year' : y}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Content Area: Sort Bar + Vehicle Cards Grid */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Sort By Pills Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>Sort By:</span>
                    {[
                      { id: 'near_first', label: 'Near first', icon: 'fa-location-dot' },
                      { id: 'top_rated', label: 'Top rated', icon: 'fa-thumbs-up' },
                      { id: 'price_low', label: 'Price: low to high', icon: 'fa-arrow-trend-up' },
                      { id: 'price_high', label: 'Price: high to low', icon: 'fa-arrow-trend-down' },
                      { id: 'newest', label: 'Newest first', icon: 'fa-star' }
                    ].map(sb => (
                      <button
                        key={sb.id}
                        type="button"
                        onClick={() => setSortBy(sb.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          border: sortBy === sb.id ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                          background: sortBy === sb.id ? '#0284c7' : '#ffffff',
                          color: sortBy === sb.id ? '#ffffff' : '#475569',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <i className={`fa-solid ${sb.icon}`} style={{ fontSize: '10px' }}></i>
                        {sb.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFilterFuel('ALL');
                      setFilterTransmission('ALL');
                      setFilterSeats('ALL');
                      setFilterModelYear('ALL');
                      setFilterCategoryModel('ALL');
                      setSortBy('near_first');
                    }}
                    style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    Clear All <i className="fa-solid fa-rotate-right" style={{ fontSize: '10px' }}></i>
                  </button>
                </div>

                {/* Filter & Sort computation */}
                {(() => {
                  let list = [...activeMaster.list];

                  // Filter fuel
                  if (filterFuel !== 'ALL') {
                    list = list.filter((v: any) => v.fuel === filterFuel);
                  }

                  // Filter transmission
                  if (filterTransmission !== 'ALL') {
                    list = list.filter((v: any) => v.transmission === filterTransmission);
                  }

                  // Filter seats
                  if (filterSeats !== 'ALL') {
                    if (filterSeats === '5') list = list.filter((v: any) => v.seats?.includes('5'));
                    else if (filterSeats === '7') list = list.filter((v: any) => v.seats?.includes('7'));
                    else if (filterSeats === '12') list = list.filter((v: any) => v.seats?.includes('12') || v.seats?.includes('16') || v.seats?.includes('24'));
                  }

                  // Filter category model
                  if (filterCategoryModel !== 'ALL') {
                    list = list.filter((v: any) => v.name.toLowerCase().includes(filterCategoryModel.toLowerCase()));
                  }

                  // Sort
                  if (sortBy === 'price_low') {
                    list.sort((a: any, b: any) => a.price - b.price);
                  } else if (sortBy === 'price_high') {
                    list.sort((a: any, b: any) => b.price - a.price);
                  } else if (sortBy === 'newest') {
                    list.sort((a: any, b: any) => (b.year || 2023) - (a.year || 2023));
                  }

                  if (list.length === 0) {
                    return (
                      <div style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                        <i className="fa-solid fa-car-side" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '12px' }}></i>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>No vehicles match these filters</h4>
                        <p style={{ margin: 0, fontSize: '13px' }}>Try clearing some filters or changing your fuel/transmission selection.</p>
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                      {list.map((v: any) => {
                        // Dynamic days calculation based on selected duration plan
                        const totalDays = durationPlan === '1day' ? 1
                          : durationPlan === '3days' ? 3
                            : durationPlan === '1week' ? 7
                              : durationPlan === '2weeks' ? 14
                                : durationPlan === '1month' ? 30
                                  : (customDays || 1);

                        const durationLabel = durationPlan === '1day' ? '1 Day'
                          : durationPlan === '3days' ? '3 Days'
                            : durationPlan === '1week' ? '1 Week'
                              : durationPlan === '2weeks' ? '2 Weeks'
                                : durationPlan === '1month' ? '1 Month'
                                  : `${totalDays} Days`;

                        const totalPrice = v.price * totalDays;
                        const isSelected = selectedVehicleId === v.id;

                        return (
                          <div
                            key={v.id}
                            style={{
                              background: '#ffffff',
                              border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                              borderRadius: '16px',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
                              transition: 'all 0.2s ease',
                              position: 'relative'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(15, 23, 42, 0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.05)'; }}
                          >
                            {/* Vehicle Photo Banner */}
                            <div style={{ position: 'relative', width: '100%', height: '170px', background: '#f1f5f9', overflow: 'hidden' }}>
                              <img
                                src={v.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'}
                                alt={v.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              {v.badge && (
                                <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#f59e0b', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                  {v.badge}
                                </span>
                              )}
                              <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(15, 23, 42, 0.8)', color: '#ffffff', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                                {v.seats || '5 Seats'}
                              </span>
                            </div>

                            {/* Card Details */}
                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
                              <div>
                                <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                                  {v.name}
                                </h4>
                                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                                  {v.category} • Year {v.year || 2023}
                                </span>
                              </div>

                              {/* Specs row (Fuel & Transmission) */}
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '11px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <i className="fa-solid fa-gas-pump" style={{ fontSize: '10px', color: '#0284c7' }}></i> {v.fuel || 'Petrol'}
                                </span>
                                <span style={{ fontSize: '11px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <i className="fa-solid fa-gear" style={{ fontSize: '10px', color: '#0284c7' }}></i> {v.transmission || 'Manual'}
                                </span>
                              </div>

                              {/* Distance & Kilometers row (Matching Screenshot 2) */}
                              <div style={{ padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#475569', fontWeight: 700 }}>
                                  <i className="fa-solid fa-gauge-high" style={{ color: '#059669', fontSize: '11px' }}></i>
                                  <span>{v.kms || '500 Kms Included'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#0369a1', fontWeight: 700 }}>
                                  <i className="fa-solid fa-location-dot" style={{ color: '#0284c7' }}></i>
                                  <span>{v.distance || '3.13 km from Location'}</span>
                                </div>
                              </div>

                              {/* Doorstep Delivery text */}
                              <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <i className="fa-solid fa-house" style={{ color: '#94a3b8', fontSize: '10px' }}></i>
                                <span>Doorstep Delivery available (Up to 4 km)</span>
                              </div>

                              {/* Price and Book CTA button (Golden Yellow matching Screenshot 2) */}
                              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                                    ₹{totalPrice}
                                  </span>
                                  <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '4px', fontWeight: 600 }}>
                                    for {durationLabel}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedVehicleId(v.id);
                                    setStep(3);
                                  }}
                                  style={{
                                    background: '#eab308',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    color: '#0f172a',
                                    fontSize: '13px',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(234, 179, 8, 0.4)',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#ca8a04'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = '#eab308'}
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

              </div>

            </div>

          </div>
        )}

        {/* ================= STEP 3: BOOKING SUMMARY & CHECKOUT (CONFIRMATION) ================= */}
        {step === 3 && activeMaster && (
          <div style={{ display: 'flex', flex: 1, height: '80vh', overflow: 'hidden' }}>

            {/* Left Sidebar (Booking Form) - Increased width */}
            <div style={{ width: '540px', minWidth: '480px', maxWidth: '580px', background: '#ffffff', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb', zIndex: 10, boxShadow: '4px 0 16px rgba(0,0,0,0.05)', overflowY: 'auto' }}>

              {/* Header */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #f3f4f6', position: 'sticky', top: 0, background: '#fff', zIndex: 20 }}>
                <button onClick={() => setStep(2)} style={{ background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#111827' }}>Booking Summary</h2>
              </div>

              {!isProcessing && !isConfirmed ? (
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ background: '#f9fafb', borderRadius: '16px', padding: '18px', border: '1px solid #e5e7eb', marginBottom: '16px' }}>
                    <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px' }}>
                      <img
                        src={(activeVehicle as any)?.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'}
                        alt={activeVehicle?.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827', marginBottom: '4px' }}>{activeVehicle?.name}</div>
                    <div style={{ fontSize: '12.5px', color: '#6b7280', marginBottom: '14px' }}>
                      {(activeVehicle as any)?.seats} • {(activeVehicle as any)?.transmission} • {(activeVehicle as any)?.fuel}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 0', borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: '#64748b' }}>Pickup Location</span>
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{pickup || 'Truro'}</span>
                      </div>
                      {!returnToSameLocation && dropoff && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span style={{ color: '#64748b' }}>Return Location</span>
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>{dropoff}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: '#64748b' }}>Pick-up Time</span>
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{pickupDate} • {pickupTime}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: '#64748b' }}>Return Time</span>
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{dropoffDate} • {dropoffTime}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: '#64748b' }}>Vehicle Distance</span>
                        <span style={{ fontWeight: '700', color: '#0284c7' }}>{(activeVehicle as any)?.distance || '1.2 km'}</span>
                      </div>
                    </div>

                    {/* Fare breakdown */}
                    {(() => {
                      const chosenDays = durationPlan === '1day' ? 1
                        : durationPlan === '3days' ? 3
                          : durationPlan === '1week' ? 7
                            : durationPlan === '2weeks' ? 14
                              : durationPlan === '1month' ? 30
                                : (customDays || 1);

                      const chosenLabel = durationPlan === '1day' ? '1 Day'
                        : durationPlan === '3days' ? '3 Days'
                          : durationPlan === '1week' ? '1 Week (7 Days)'
                            : durationPlan === '2weeks' ? '2 Weeks (14 Days)'
                              : durationPlan === '1month' ? '1 Month (30 Days)'
                                : `${chosenDays} Days`;

                      const baseAmount = (activeVehicle?.price || 1500) * chosenDays;
                      const taxAmount = Math.round(baseAmount * 0.18);
                      const totalPayable = baseAmount + taxAmount;

                      return (
                        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ color: '#64748b' }}>Rental Duration</span>
                            <span style={{ fontWeight: '700', color: '#0f172a' }}>{chosenLabel}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ color: '#64748b' }}>Base Rate (₹{activeVehicle?.price || 1500}/day × {chosenDays})</span>
                            <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{baseAmount}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ color: '#64748b' }}>Taxes & Insurance (18%)</span>
                            <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{taxAmount}</span>
                          </div>
                          <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '6px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>Total Payable</span>
                            <span style={{ fontSize: '20px', fontWeight: 900, color: '#0284c7' }}>
                              ₹{totalPayable}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* 🪪 Driver Details & KYC Document Verification Form */}
                  <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                          <i className="fa-solid fa-id-card"></i>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Driver & Document Verification</span>
                      </div>
                      <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                        Required for Handover
                      </span>
                    </div>

                    {/* Person Full Name */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Full Name (As per Govt ID)
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter full name"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
                      />
                    </div>

                    {/* Contact Phone */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Mobile Phone Number
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
                      />
                    </div>

                    {/* Document Selection: DL, Aadhaar, PAN */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                        Select Document for Verification
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {[
                          { id: 'dl' as const, label: 'Driving License', icon: 'fa-id-card' },
                          { id: 'aadhaar' as const, label: 'Aadhaar Card', icon: 'fa-fingerprint' },
                          { id: 'pan' as const, label: 'PAN Card', icon: 'fa-address-card' }
                        ].map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => {
                              setDocType(d.id);
                              if (d.id === 'dl') setDocNumber('DL-04-2023-0091823');
                              else if (d.id === 'aadhaar') setDocNumber('XXXX-XXXX-4819');
                              else if (d.id === 'pan') setDocNumber('ABCDE1234F');
                            }}
                            style={{
                              padding: '8px 6px',
                              borderRadius: '8px',
                              border: docType === d.id ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                              background: docType === d.id ? '#f0f9ff' : '#ffffff',
                              color: docType === d.id ? '#0369a1' : '#334155',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <i className={`fa-solid ${d.icon}`}></i>
                            <span>{d.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Document Number Input */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        {docType === 'dl' ? 'Driving License Number' : docType === 'aadhaar' ? 'Aadhaar Card Number' : 'PAN Card Number'}
                      </label>
                      <input
                        type="text"
                        value={docNumber}
                        onChange={(e) => setDocNumber(e.target.value)}
                        placeholder="Enter document number"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 700, color: '#0f172a', outline: 'none' }}
                      />
                    </div>

                    {/* File Upload Box */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Upload Document Copy (Front & Back)
                      </label>
                      <label style={{
                        border: '2px dashed #93c5fd',
                        borderRadius: '10px',
                        padding: '14px',
                        background: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease'
                      }}>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setUploadedDocName(e.target.files[0].name);
                              setIsDocVerified(true);
                            }
                          }}
                        />
                        <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '20px', color: '#0284c7', marginBottom: '6px' }}></i>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                          {uploadedDocName ? `Uploaded: ${uploadedDocName}` : 'Click to Upload Document (Photo / PDF)'}
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>
                          JPG, PNG, PDF up to 10MB
                        </span>
                      </label>
                    </div>

                    {/* Notice on Original Copy */}
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <i className="fa-solid fa-triangle-exclamation" style={{ color: '#b45309', fontSize: '13px', marginTop: '2px' }}></i>
                      <div style={{ fontSize: '11px', color: '#92400e', lineHeight: 1.4 }}>
                        <strong>Mandatory Original Copy Notice:</strong> When taking delivery of the vehicle, you must submit and physically verify the <strong>original physical copy</strong> of your Driving License / Aadhaar / PAN card to the vehicle owner or hub representative.
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleBook}
                      style={{ flex: 2, padding: '14px', borderRadius: '10px', border: 'none', background: '#f25a1b', color: '#ffffff', fontSize: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(242, 90, 27, 0.3)' }}
                    >
                      Verify & Confirm Booking
                    </button>
                  </div>
                </div>
              ) : isConfirmed ? (
                <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: '#f9fafb', overflowY: 'auto' }}>
                  <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '12px', fontWeight: '800', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <i className="fa-solid fa-circle-check"></i> You booked this vehicle successfully!
                  </div>

                  {/* Vehicle Card */}
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', padding: '18px', background: '#fff', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{activeVehicle?.name}</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <i className="fa-solid fa-location-dot" style={{ color: '#0ea5e9' }}></i> Pickup: {pickup || 'Truro'} ({(activeVehicle as any)?.distance || '1.2 km'})
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '17px', fontWeight: '900', color: '#111827', letterSpacing: '1px' }}>KA 04 R 9081</div>
                        <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>License Plate</div>
                      </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', marginBottom: '2px', textTransform: 'uppercase' }}>Booking PIN</div>
                        <div style={{ fontSize: '24px', fontWeight: '900', color: '#0ea5e9', letterSpacing: '4px' }}>8420</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', marginBottom: '2px', textTransform: 'uppercase' }}>Status</div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#10b981' }}>Ready for Pickup</div>
                      </div>
                    </div>

                    {/* Booking Holder & Document Status */}
                    <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                        <span style={{ color: '#166534', fontWeight: 600 }}>Booked By:</span>
                        <span style={{ fontWeight: 800, color: '#14532d' }}>{customerName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                        <span style={{ color: '#166534', fontWeight: 600 }}>Verified Document:</span>
                        <span style={{ fontWeight: 800, color: '#14532d' }}>
                          {docType === 'dl' ? 'Driving License' : docType === 'aadhaar' ? 'Aadhaar' : 'PAN'} ({docNumber})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 🚨 Mandatory Requirement Highlight for Vehicle Handover */}
                  <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '14px', padding: '14px 16px', marginBottom: '20px', display: 'flex', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '15px' }}>
                      <i className="fa-solid fa-file-shield"></i>
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 800, color: '#991b1b' }}>
                        Mandatory Original Document Submission to Owner
                      </h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#7f1d1d', lineHeight: 1.45 }}>
                        When giving you the vehicle key, you <strong>must submit the original physical copy</strong> of your Driving License / Aadhaar / PAN card to the owner / hub partner for physical security check before keys are released.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    <button style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', color: '#0f172a', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
                      Message Hub
                    </button>
                    <button style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
                      Call Hub
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button
                      onClick={() => { setIsConfirmed(false); setStep(2); }}
                      style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #ef4444', background: '#fff', color: '#ef4444', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}
                    >
                      Cancel Booking
                    </button>
                    <button
                      onClick={handleFinalConfirm}
                      style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: '#111827', color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}
                    >
                      Finish
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1 }}>
                  {isProcessing && (
                    <>
                      <div style={{ width: '48px', height: '48px', border: `4px solid #0284c720`, borderTop: `4px solid #0284c7`, borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '24px' }}></div>
                      <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>Securing Booking...</h3>
                      <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Please wait while we process your request.</p>
                      <style>{`
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                      `}</style>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Map View */}
            <div style={{ flex: 1, position: 'relative', background: '#e5e7eb', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <LiveTrackerMap
                  key="rental-map"
                  vehicleIconClass={activeVehicle?.icon || 'fa-car'}
                  pickup={pickup || 'Truro'}
                  dropoff=""
                  isSearching={false}
                />
              </div>

              <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10, background: '#ffffff', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>Live Vehicle Location Map</div>
              </div>

              <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, background: '#111827', color: '#fff', padding: '12px 24px', borderRadius: '24px', fontSize: '13px', fontWeight: '700', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                <i className="fa-solid fa-location-dot" style={{ marginRight: '8px', color: '#10b981' }}></i> Vehicle is {(activeVehicle as any)?.distance || '1.2 km from your location'}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
