'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSartStore } from '@/store/useSartStore';
import Showcase from '@/components/Showcase';
import MapEngine from '@/components/MapEngine';
import NewsFeed from '@/components/NewsFeed';
import TravelBlogs from '@/components/TravelBlogs';
import { POPULAR_CITIES } from '@/components/trainData';
import './HomeTab.css';

export default function HomeTab() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [

    {
      id: 1,
      img: '/great_indian_bus_sale.jpg',
      title1: '',
      subtitle: '',
      action1: 'ride',
      btn1: ''
    },
    {
      id: 2,
      img: '/slider1.jpg',
      title1: '',
      subtitle: '',
      action1: 'ride',
      btn1: ''
    },
    {
      id: 3,
      img: '/slider2.jpg',
      title1: '',
      subtitle: '',
      action1: 'carrier',
      btn1: ''
    },
    {
      id: 4,
      img: '/slider3.jpg',
      title1: '',
      subtitle: '',
      action1: 'rental',
      btn1: ''
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const { activeTab, setActiveTab, setActiveRideMode } = useSartStore();
  const router = useRouter();

  // Flight search form state in Hero Banner (Matching User's 2nd Image)
  const [tripType, setTripType] = useState<'one_way' | 'round_trip'>('round_trip');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departDate, setDepartDate] = useState(() => {
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;
  });
  const [returnDate, setReturnDate] = useState(() => {
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;
  });
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Premium Economy' | 'Business'>('Economy');
  const [selectedSpecialFare, setSelectedSpecialFare] = useState('');
  const [freeCancelOpt, setFreeCancelOpt] = useState(true);

  // Dropdown states
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showTravellerDropdown, setShowTravellerDropdown] = useState(false);
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [showReturnCalendarPicker, setShowReturnCalendarPicker] = useState(false);
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [returnCalMonth, setReturnCalMonth] = useState(() => new Date().getMonth());
  const [returnCalYear, setReturnCalYear] = useState(() => new Date().getFullYear());

  // Contact details for inquiry / group travel
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialRemarks, setSpecialRemarks] = useState('');

  const fromRef = React.useRef<HTMLDivElement>(null);
  const toRef = React.useRef<HTMLDivElement>(null);
  const travellerRef = React.useRef<HTMLDivElement>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const returnCalendarRef = React.useRef<HTMLDivElement>(null);

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const MONTH_SHORT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleSelectDate = (day: number, m = calMonth, y = calYear) => {
    const formatted = `${String(day).padStart(2, '0')} ${MONTH_SHORT[m]}, ${y}`;
    setDepartDate(formatted);
    setShowCalendarPicker(false);
  };

  const handleSelectReturnDate = (day: number, m = returnCalMonth, y = returnCalYear) => {
    const formatted = `${String(day).padStart(2, '0')} ${MONTH_SHORT[m]}, ${y}`;
    setReturnDate(formatted);
    setShowReturnCalendarPicker(false);
  };

  // Ride Mode selection state (1: Bike, 2: Auto, 3: Car, 4: Bus, 5: Train, 6: Flight, 7: Helicopter)
  const [selectedRide, setSelectedRide] = useState<'bike' | 'auto' | 'car' | 'bus' | 'train' | 'flight' | 'helicopter'>('bike');
  const [showRideDropdown, setShowRideDropdown] = useState(false);
  const rideRef = React.useRef<HTMLDivElement>(null);

  const AVAILABLE_RIDES = [
    { id: 'bike' as const, name: 'Bike', icon: 'fa-motorcycle', desc: 'Fastest solo city ride & deliveries', count: '30+ bikes nearby' },
    { id: 'auto' as const, name: 'Auto', icon: 'fa-taxi', desc: 'Quick city auto rides at meter fares', count: '25+ autos nearby' },
    { id: 'car' as const, name: 'Car / Cab', icon: 'fa-car', desc: 'Sedan, SUV, Prime & Outstation', count: '40+ cabs nearby' },
    { id: 'bus' as const, name: 'Bus', icon: 'fa-bus', desc: 'AC Sleeper, Volvo & Semi-sleeper', count: '35+ buses' },
    { id: 'train' as const, name: 'Train', icon: 'fa-train', desc: 'Express, Vande Bharat & Superfast', count: '18+ trains' },
    { id: 'flight' as const, name: 'Flight', icon: 'fa-plane', desc: 'Fastest domestic & international flights', count: '12+ flights' },
    { id: 'helicopter' as const, name: 'Helicopter', icon: 'fa-helicopter', desc: 'Helipad transfers & chartered choppers', count: '6+ helipads' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setShowToDropdown(false);
      }
      if (travellerRef.current && !travellerRef.current.contains(e.target as Node)) {
        setShowTravellerDropdown(false);
      }
      if (rideRef.current && !rideRef.current.contains(e.target as Node)) {
        setShowRideDropdown(false);
      }
      if (vehicleRef.current && !vehicleRef.current.contains(e.target as Node)) {
        setShowVehicleDropdown(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendarPicker(false);
      }
      if (returnCalendarRef.current && !returnCalendarRef.current.contains(e.target as Node)) {
        setShowReturnCalendarPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const totalTravellers = adultsCount + childrenCount + infantsCount;

  // 5 Main Service Categories (Rides, Cargo & Logistics, Vehicle Rental, Drivers Hire, Parking Slots)
  type ServiceCategory = 'rides' | 'carrier' | 'rental' | 'drivers' | 'parking';
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('rides');

  // Common rich vehicle list requested: bike, car, auto, bus, truck, ship, helicopter, jcb, tractor, train
  const SHARED_VEHICLES = [
    { id: 'bike', name: 'Bike', icon: 'fa-motorcycle', count: '30+ bikes nearby' },
    { id: 'car', name: 'Car', icon: 'fa-car', count: '40+ cars nearby' },
    { id: 'auto', name: 'Auto', icon: 'fa-taxi', count: '25+ autos nearby' },
    { id: 'bus', name: 'Bus', icon: 'fa-bus', count: '35+ buses' },
    { id: 'truck', name: 'Truck', icon: 'fa-truck', count: '20+ trucks' },
    { id: 'ship', name: 'Ship', icon: 'fa-ship', count: '8+ boats' },
    { id: 'helicopter', name: 'Helicopter', icon: 'fa-helicopter', count: '6+ helipads' },
    { id: 'jcb', name: 'JCB', icon: 'fa-trowel-bricks', count: '10+ JCBs nearby' },
    { id: 'tractor', name: 'Tractor', icon: 'fa-tractor', count: '12+ tractors' },
    { id: 'train', name: 'Train', icon: 'fa-train', count: '18+ trains' }
  ];

  const RIDES_VEHICLES = [
    { id: 'bike', name: 'Bike', icon: 'fa-motorcycle', count: '30+ bikes nearby' },
    { id: 'car', name: 'Car', icon: 'fa-car', count: '40+ cars nearby' },
    { id: 'auto', name: 'Auto', icon: 'fa-taxi', count: '25+ autos nearby' },
    { id: 'bus', name: 'Bus', icon: 'fa-bus', count: '35+ buses' },
    { id: 'ship', name: 'Ship', icon: 'fa-ship', count: '8+ ferries' },
    { id: 'helicopter', name: 'Helicopter', icon: 'fa-helicopter', count: '6+ helipads' },
    { id: 'train', name: 'Train', icon: 'fa-train', count: '18+ trains' }
  ];

  const CARRIER_VEHICLES = [
    { id: 'train', name: 'Train Cargo', icon: 'fa-train', count: '15+ rakes available' },
    { id: 'flight', name: 'Flight Cargo', icon: 'fa-plane', count: '10+ cargo flights' },
    { id: 'car', name: 'Car / Van Cargo', icon: 'fa-car', count: '30+ nearby' },
    { id: 'truck', name: 'Truck Cargo', icon: 'fa-truck', count: '20+ nearby' },

    { id: 'bike', name: 'Bike Parcel', icon: 'fa-motorcycle', count: '45+ nearby' },
    { id: 'ship', name: 'Ship Cargo', icon: 'fa-ship', count: '8+ vessels' }
  ];

  // Category specific vehicle options
  const CATEGORY_VEHICLES: Record<ServiceCategory, Array<{ id: string; name: string; icon: string; count?: string }>> = {
    rides: RIDES_VEHICLES,
    carrier: CARRIER_VEHICLES,
    rental: SHARED_VEHICLES,
    drivers: SHARED_VEHICLES,
    parking: SHARED_VEHICLES
  };

  const [selectedVehicle, setSelectedVehicle] = useState<string>('bike');
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const vehicleRef = React.useRef<HTMLDivElement>(null);

  // When changing category, reset selected vehicle to the first option
  const handleSelectCategory = (cat: ServiceCategory) => {
    setSelectedCategory(cat);
    const firstVeh = CATEGORY_VEHICLES[cat][0]?.id || '';
    setSelectedVehicle(firstVeh);
  };

  const handleExecuteSearch = () => {
    const src = fromCity.includes('-') ? fromCity.split('-')[1].trim() : fromCity.trim();
    const dest = toCity.includes('-') ? toCity.split('-')[1].trim() : toCity.trim();

    if (typeof window !== 'undefined') {
      if (src) localStorage.setItem('sart_search_from', src);
      if (dest) localStorage.setItem('sart_search_to', dest);
    }

    const query = new URLSearchParams({
      source: src,
      destination: dest,
      date: departDate,
      vehicle: selectedVehicle
    }).toString();

    if (selectedCategory === 'rides') {
      const mode = (['bike', 'auto', 'car', 'bus', 'train', 'flight', 'helicopter', 'ship'].includes(selectedVehicle) ? selectedVehicle : 'bike') as any;
      setActiveRideMode(mode);
      setActiveTab('ride');
      const targetUrl = `/home/ride/${mode}?${query}`;
      router.push(targetUrl);
    } else if (selectedCategory === 'carrier') {
      setActiveTab('carrier');
      router.push(`/home/carrier?${query}`);
    } else if (selectedCategory === 'rental') {
      setActiveTab('rental');
      router.push(`/home/rental?${query}`);
    } else if (selectedCategory === 'drivers') {
      setActiveTab('drivers');
      router.push(`/home/drivers?${query}`);
    } else if (selectedCategory === 'parking') {
      setActiveTab('parking');
      router.push(`/home/parking?${query}`);
    }
  };

  const handleServiceClick = (tab: string) => {
    if (tab === 'ride' || tab === 'rides') {
      setActiveRideMode('bike');
      if (typeof window !== 'undefined') {
        localStorage.setItem('sart_active_ride_mode', 'bike');
      }
      setActiveTab('ride');
      router.push('/home/ride/bike', { scroll: false });
      return;
    }
    setActiveTab(tab as any);
    router.push(`/home/${tab}`, { scroll: false });
  };

  return (
    <section className={`tab-screen ${activeTab === 'home' ? 'active' : ''}`} id="tab-home">

      {/* 🖼️ New Panorama Hero Section */}
      <div className="new-hero-container">

        {/* 🌟 Two Distinct Floating Cards (Category Tabs Card & Search Card) at bottom of Header */}
        <div className="hero-booking-cards-stack">
          {/* Top Card: Category Selection Strip */}
          <div className="hero-cat-tabs-card">
            <div className="hero-cat-tabs-list">
              <button
                type="button"
                className={`hero-cat-tab-btn ${selectedCategory === 'rides' ? 'active' : ''}`}
                onClick={() => handleSelectCategory('rides')}
              >
                <div className="hero-cat-icon-box cat-rides">
                  <i className="fa-solid fa-car-side"></i>
                </div>
                <span>Rides</span>
              </button>

              <button
                type="button"
                className={`hero-cat-tab-btn ${selectedCategory === 'carrier' ? 'active' : ''}`}
                onClick={() => handleSelectCategory('carrier')}
              >
                <div className="hero-cat-icon-box cat-carrier">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <span>Cargo &amp; Logistics</span>
              </button>

              <button
                type="button"
                className={`hero-cat-tab-btn ${selectedCategory === 'rental' ? 'active' : ''}`}
                onClick={() => handleSelectCategory('rental')}
              >
                <div className="hero-cat-icon-box cat-rental">
                  <i className="fa-solid fa-key"></i>
                </div>
                <span>Vehicle Rental</span>
              </button>

              <button
                type="button"
                className={`hero-cat-tab-btn ${selectedCategory === 'drivers' ? 'active' : ''}`}
                onClick={() => handleSelectCategory('drivers')}
              >
                <div className="hero-cat-icon-box cat-drivers">
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <span>Drivers Hire</span>
              </button>

              <button
                type="button"
                className={`hero-cat-tab-btn ${selectedCategory === 'parking' ? 'active' : ''}`}
                onClick={() => handleSelectCategory('parking')}
              >
                <div className="hero-cat-icon-box cat-parking">
                  <i className="fa-solid fa-square-parking"></i>
                </div>
                <span>Parking Slots</span>
              </button>
            </div>
          </div>

          {/* Bottom Card: Search & Booking Bar */}
          <div className="hero-search-card">
            <div className="hero-search-horizontal-row">
              {/* 1. Vehicle Dropdown on the Left of From */}
              <div className="hero-h-cell hero-h-vehicle-cell" ref={vehicleRef}>
                <div
                  className="hero-h-vehicle-trigger"
                  onClick={() => setShowVehicleDropdown(prev => !prev)}
                >
                  <div className="hero-h-icon">
                    <i className={`fa-solid ${CATEGORY_VEHICLES[selectedCategory].find(v => v.id === selectedVehicle)?.icon || 'fa-car'}`}></i>
                  </div>
                  <div className="hero-h-input-wrap">
                    <span className="hero-h-label">Vehicle</span>
                    <span className="hero-h-val">
                      {CATEGORY_VEHICLES[selectedCategory].find(v => v.id === selectedVehicle)?.name || 'Select'}
                    </span>
                  </div>
                  <i className="fa-solid fa-chevron-down hero-h-chevron"></i>
                </div>

                {showVehicleDropdown && (
                  <div className="hero-vehicle-dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    <div className="hero-vdp-header">
                      <div>
                        <h4 className="hero-vdp-title">
                          {selectedCategory === 'carrier' ? 'Cargo & Logistics Selection' : selectedCategory === 'rental' ? 'Rental Fleet Selection' : 'Ride Selection'}
                        </h4>
                        <span className="hero-vdp-subtitle">
                          {selectedCategory === 'carrier' ? 'Choose freight party & cargo vehicle' : 'Choose travel party & preferred vehicle'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="hero-vdp-close-btn"
                        onClick={() => setShowVehicleDropdown(false)}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>

                    {/* Scrollable Vehicle Cards List */}
                    <div className="hero-vehicle-dropdown-list">
                      {CATEGORY_VEHICLES[selectedCategory].map((veh) => {
                        const isSelected = selectedVehicle === veh.id;
                        return (
                          <div
                            key={veh.id}
                            className={`hero-vdp-card ${isSelected ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedVehicle(veh.id);
                              setShowVehicleDropdown(false);
                              if (selectedCategory === 'carrier') {
                                setActiveTab('carrier');
                                router.push(`/home/carrier?vehicle=${veh.id}`, { scroll: false });
                              }
                            }}
                          >
                            <div className="hero-vdp-card-left">
                              <div className={`hero-vdp-icon-box ${isSelected ? 'active' : ''}`}>
                                <i className={`fa-solid ${veh.icon}`}></i>
                              </div>
                              <span className="hero-vdp-name">{veh.name}</span>
                              {veh.count && (
                                <span className={`hero-vdp-badge ${isSelected ? 'active' : ''}`}>
                                  {veh.count}
                                </span>
                              )}
                            </div>
                            <div className="hero-vdp-arrow">
                              <i className="fa-solid fa-chevron-right"></i>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hero-h-divider"></div>

              {/* 2. Leaving From */}
              <div className="hero-h-cell hero-h-from-cell" ref={fromRef}>
                <div className="hero-h-icon">
                  <i className="fa-solid fa-location-arrow"></i>
                </div>
                <div className="hero-h-input-wrap">
                  <span className="hero-h-label">Leaving From</span>
                  <input
                    type="text"
                    className="hero-h-input"
                    value={fromCity}
                    onChange={(e) => {
                      setFromCity(e.target.value);
                      setShowFromDropdown(true);
                    }}
                    onFocus={() => setShowFromDropdown(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setShowFromDropdown(false);
                        handleExecuteSearch();
                      }
                    }}
                    placeholder="Enter city or terminal"
                  />
                </div>

                {showFromDropdown && (
                  <div className="hero-suggestions-popup">
                    <div className="hero-suggestions-header">
                      <span>Popular Cities</span>
                      <i className="fa-solid fa-city"></i>
                    </div>
                    <div className="hero-suggestions-list">
                      {POPULAR_CITIES.filter(c =>
                        !fromCity || c.name.toLowerCase().includes(fromCity.toLowerCase()) || c.code.toLowerCase().includes(fromCity.toLowerCase())
                      ).map(c => (
                        <div
                          key={`from-${c.code}`}
                          className="hero-city-item"
                          onClick={() => {
                            setFromCity(`${c.name} (${c.code})`);
                            setShowFromDropdown(false);
                          }}
                        >
                          <div className="hero-city-icon">
                            <i className="fa-solid fa-location-dot"></i>
                          </div>
                          <div className="hero-city-info">
                            <span className="hero-city-name">{c.name} ({c.code})</span>
                            <span className="hero-city-state">{c.state}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <button
                type="button"
                className="hero-h-swap-btn"
                onClick={handleSwapCities}
                title="Swap Locations"
              >
                <i className="fa-solid fa-right-left"></i>
              </button>

              {/* 3. Going To */}
              <div className="hero-h-cell hero-h-to-cell" ref={toRef}>
                <div className="hero-h-icon">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="hero-h-input-wrap">
                  <span className="hero-h-label">Going To</span>
                  <input
                    type="text"
                    className="hero-h-input"
                    value={toCity}
                    onChange={(e) => {
                      setToCity(e.target.value);
                      setShowToDropdown(true);
                    }}
                    onFocus={() => setShowToDropdown(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setShowToDropdown(false);
                        handleExecuteSearch();
                      }
                    }}
                    placeholder="Enter destination"
                  />
                </div>

                {showToDropdown && (
                  <div className="hero-suggestions-popup">
                    <div className="hero-suggestions-header">
                      <span>Popular Cities</span>
                      <i className="fa-solid fa-city"></i>
                    </div>
                    <div className="hero-suggestions-list">
                      {POPULAR_CITIES.filter(c =>
                        !toCity || c.name.toLowerCase().includes(toCity.toLowerCase()) || c.code.toLowerCase().includes(toCity.toLowerCase())
                      ).map(c => (
                        <div
                          key={`to-${c.code}`}
                          className="hero-city-item"
                          onClick={() => {
                            setToCity(`${c.name} (${c.code})`);
                            setShowToDropdown(false);
                          }}
                        >
                          <div className="hero-city-icon">
                            <i className="fa-solid fa-location-dot"></i>
                          </div>
                          <div className="hero-city-info">
                            <span className="hero-city-name">{c.name} ({c.code})</span>
                            <span className="hero-city-state">{c.state}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hero-h-divider"></div>

              {/* 4. Departure Date */}
              <div
                className="hero-h-cell hero-h-date-cell"
                ref={calendarRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCalendarPicker(prev => !prev);
                }}
              >
                <div className="hero-h-icon">
                  <i className="fa-regular fa-calendar-days"></i>
                </div>
                <div className="hero-h-input-wrap">
                  <span className="hero-h-label">Departure</span>
                  <span className="hero-h-val">{departDate}</span>
                </div>

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
                        <div key={`empty-${i}`} className="hero-cal-day-cell empty"></div>
                      ))}
                      {Array.from({ length: getDaysInMonth(calYear, calMonth) }).map((_, i) => {
                        const dayNum = i + 1;
                        const dayFormatted = String(dayNum).padStart(2, '0');
                        const isSelected =
                          departDate.includes(`${dayFormatted} ${MONTH_SHORT[calMonth]}`) ||
                          departDate.includes(`${dayNum} ${MONTH_SHORT[calMonth]}`);

                        return (
                          <button
                            key={dayNum}
                            type="button"
                            className={`hero-cal-day-cell ${isSelected ? 'selected' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectDate(dayNum);
                            }}
                          >
                            <span className="hero-cal-day-number">{dayNum}</span>
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
                          const now = new Date();
                          setCalMonth(now.getMonth());
                          setCalYear(now.getFullYear());
                          handleSelectDate(now.getDate(), now.getMonth(), now.getFullYear());
                        }}
                      >
                        Today ({new Date().getDate()} {MONTH_SHORT[new Date().getMonth()]})
                      </button>
                      <button
                        type="button"
                        className="hero-cal-quick-action"
                        onClick={(e) => {
                          e.stopPropagation();
                          const tom = new Date();
                          tom.setDate(tom.getDate() + 1);
                          setCalMonth(tom.getMonth());
                          setCalYear(tom.getFullYear());
                          handleSelectDate(tom.getDate(), tom.getMonth(), tom.getFullYear());
                        }}
                      >
                        Tomorrow ({(() => { const t = new Date(); t.setDate(t.getDate() + 1); return `${t.getDate()} ${MONTH_SHORT[t.getMonth()]}`; })()})
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Quick Date Buttons (Today / Tomorrow) */}
              <div className="hero-h-quick-dates">
                <button
                  type="button"
                  className="hero-h-quick-date-btn"
                  onClick={() => {
                    const now = new Date();
                    setCalMonth(now.getMonth());
                    setCalYear(now.getFullYear());
                    handleSelectDate(now.getDate(), now.getMonth(), now.getFullYear());
                  }}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="hero-h-quick-date-btn"
                  onClick={() => {
                    const tom = new Date();
                    tom.setDate(tom.getDate() + 1);
                    setCalMonth(tom.getMonth());
                    setCalYear(tom.getFullYear());
                    handleSelectDate(tom.getDate(), tom.getMonth(), tom.getFullYear());
                  }}
                >
                  Tomorrow
                </button>
              </div>

              {/* 6. Red Search Button */}
              <button
                type="button"
                className="hero-h-search-btn"
                onClick={handleExecuteSearch}
              >
                <span>Search</span>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Modern Full-Width Carousel (Clean Background Only) */}
        <div className="modern-carousel">
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${slide.img})`,
                backgroundColor: '#0c2217',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Optional slight ambient overlay for depth */}
              <div className="carousel-overlay-clean"></div>
            </div>
          ))}

          <button className="carousel-nav prev" onClick={() => setCurrentSlide(p => (p === 0 ? carouselSlides.length - 1 : p - 1))} aria-label="Previous Slide">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button className="carousel-nav next" onClick={() => setCurrentSlide(p => (p + 1) % carouselSlides.length)} aria-label="Next Slide">
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          <div className="carousel-dots">
            {carouselSlides.map((_, i) => (
              <div key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)}></div>
            ))}
          </div>
        </div>
      </div>


      <div className="home-content-wrapper">
        {/* Quick Services Section */}
        <section className="book-service-section">
          <div className="book-service-header">
            <h2>Book a Service</h2>
            <p>Select tailored multi-modal transport and logistics crafted for instant urban mobility.</p>
          </div>
          <div className="book-service-inner-card">
            <div className="book-service-grid">
              {/* 1. Road Rides (Enters Bike Ride Page by default) */}
              <div className="book-card" onClick={() => handleServiceClick('ride')}>
                <div className="book-img-wrapper">
                  <img
                    src="/images/rides_fleet_showcase.png"
                    alt="Rides Fleet"
                    className="book-card-img"
                  />
                </div>
                <h3 className="book-title" style={{ textAlign: 'center' }}>Rides</h3>
                <div className="book-footer"></div>
              </div>

              {/* 2. Cargo & Logistics */}
              <div className="book-card" onClick={() => handleServiceClick('carrier')}>
                <div className="book-img-wrapper">
                  <img
                    src="/images/carrier_service.png"
                    alt="Carrier Logistics"
                    className="book-card-img"
                  />
                </div>
                <h3 className="book-title" style={{ textAlign: 'center' }}>Carrier</h3>
                <div className="book-footer"></div>
              </div>

              {/* 3. Vehicle Rental */}
              <div className="book-card" onClick={() => handleServiceClick('rental')}>
                <div className="book-img-wrapper">
                  <img
                    src="/images/vehicle_rental_fleet.png"
                    alt="Vehicle Rental"
                    className="book-card-img"
                  />
                </div>
                <h3 className="book-title" style={{ textAlign: 'center' }}>Vehicle Rental</h3>
                <div className="book-footer"></div>
              </div>

              {/* 4. Drivers Hire */}
              <div className="book-card" onClick={() => handleServiceClick('drivers')}>
                <div className="book-img-wrapper">
                  <img
                    src="/images/drivers_service.png"
                    alt="Drivers Hire"
                    className="book-card-img"
                  />
                </div>
                <h3 className="book-title" style={{ textAlign: 'center' }}>Drivers Hire</h3>
                <div className="book-footer"></div>
              </div>

              {/* 5. Parking Slots */}
              <div className="book-card" onClick={() => handleServiceClick('parking')}>
                <div className="book-img-wrapper">
                  <img
                    src="/images/parking_service.jpg"
                    alt="Parking Slots"
                    className="book-card-img"
                  />
                </div>
                <h3 className="book-title" style={{ textAlign: 'center' }}>Parking Slots</h3>
                <div className="book-footer"></div>
              </div>

              {/* 6. Communities */}
              <div className="book-card" onClick={() => handleServiceClick('community')}>
                <div className="book-img-wrapper">
                  <img
                    src="/images/community_service.jpg"
                    alt="Communities"
                    className="book-card-img"
                  />
                </div>
                <h3 className="book-title" style={{ textAlign: 'center' }}>Communities</h3>
                <div className="book-footer"></div>
              </div>
            </div>
          </div>
        </section>

        <Showcase />

        <TravelBlogs />

        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '24px', paddingBottom: '60px' }}>
          <MapEngine />
          <NewsFeed />
        </div>
      </div>
    </section>
  );
}

