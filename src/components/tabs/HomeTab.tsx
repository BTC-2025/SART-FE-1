'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSartStore } from '@/store/useSartStore';
import SubNavbar from '@/components/SubNavbar';
import Showcase from '@/components/Showcase';
import MapEngine from '@/components/MapEngine';
import NewsFeed from '@/components/NewsFeed';
import TravelBlogs from '@/components/TravelBlogs';
import TopRoutes from '@/components/TopRoutes';
import WhyChooseUs from '@/components/WhyChooseUs';
import { POPULAR_CITIES } from '@/components/trainData';
import './HomeTab.css';

export default function HomeTab() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [

    {
      id: 2,
      img: '/slider1.jpg',
      title1: 'Future of Commute Autonomous Luxury.',

      subtitle: 'Experience the next generation of smart city travel with our premium electric fleet.',
      action1: 'ride', btn1: 'BOOK A RIDE'
    },
    {
      id: 3,
      img: '/slider2.jpg',
      title1: 'Cybernetic Logistics Automated Freight.',

      subtitle: 'Seamless intra-city cargo and parcel delivery with real-time tracking.',
      action1: 'carrier', btn1: 'HIRE CARRIER'
    },
    {
      id: 4,
      img: '/slider3.jpg',
      title1: 'Unleash Freedom Premium Rentals.',

      subtitle: 'Zero-deposit luxury sedans, SUVs & flexible daily fleet for your every journey.',
      action1: 'rental', btn1: 'RENT VEHICLE'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 3 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const { activeTab, setActiveTab, setActiveRideMode } = useSartStore();
  const router = useRouter();

  // Flight search form state in Hero Banner (Matching User's 2nd Image)
  const [tripType, setTripType] = useState<'one_way' | 'round_trip'>('round_trip');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departDate, setDepartDate] = useState('Thu, 15 Oct');
  const [returnDate, setReturnDate] = useState('Thu, 15 Oct');
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
  const [calMonth, setCalMonth] = useState(9); // 0-indexed: 9 = October
  const [calYear, setCalYear] = useState(2026);

  const fromRef = React.useRef<HTMLDivElement>(null);
  const toRef = React.useRef<HTMLDivElement>(null);
  const travellerRef = React.useRef<HTMLDivElement>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);

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

  // Ride Mode selection state (1: Bike, 2: Auto, 3: Car, 4: Bus, 5: Train, 6: Flight)
  const [selectedRide, setSelectedRide] = useState<'bike' | 'auto' | 'car' | 'bus' | 'train' | 'flight'>('bike');
  const [showRideDropdown, setShowRideDropdown] = useState(false);
  const rideRef = React.useRef<HTMLDivElement>(null);

  const AVAILABLE_RIDES = [
    { id: 'bike' as const, name: 'Bike', icon: 'fa-motorcycle', desc: 'Fastest solo city ride & deliveries', count: '30+ bikes nearby' },
    { id: 'auto' as const, name: 'Auto', icon: 'fa-taxi', desc: 'Quick city auto rides at meter fares', count: '25+ autos nearby' },
    { id: 'car' as const, name: 'Car / Cab', icon: 'fa-car', desc: 'Sedan, SUV, Prime & Outstation', count: '40+ cabs nearby' },
    { id: 'bus' as const, name: 'Bus', icon: 'fa-bus', desc: 'AC Sleeper, Volvo & Semi-sleeper', count: '35+ buses' },
    { id: 'train' as const, name: 'Train', icon: 'fa-train', desc: 'Express, Vande Bharat & Superfast', count: '18+ trains' },
    { id: 'flight' as const, name: 'Flight', icon: 'fa-plane', desc: 'Fastest domestic & international flights', count: '12+ flights' },
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
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendarPicker(false);
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

  const handleSearchRide = (rideModeToUse?: 'flight' | 'train' | 'bus' | 'car' | 'auto' | 'bike') => {
    const mode = rideModeToUse || selectedRide;
    const src = fromCity.includes('-') ? fromCity.split('-')[1].trim() : fromCity.trim();
    const dest = toCity.includes('-') ? toCity.split('-')[1].trim() : toCity.trim();

    if (typeof window !== 'undefined') {
      if (src) localStorage.setItem('sart_ride_pickup', src);
      if (dest) localStorage.setItem('sart_ride_dropoff', dest);
      window.dispatchEvent(new CustomEvent('sart_ride_location_update', {
        detail: { pickup: src, dropoff: dest }
      }));
    }

    const query = new URLSearchParams({
      source: src,
      destination: dest,
      date: departDate
    }).toString();

    setActiveRideMode(mode);
    setActiveTab('ride');
    const targetUrl = `/home/ride/${mode}?${query}`;
    if (typeof window !== 'undefined') {
      window.history.pushState({ mode }, '', targetUrl);
    }
    router.push(targetUrl);
  };

  const handleServiceClick = (tab: string) => {
    setActiveTab(tab as any);
    router.push(`/home/${tab}`, { scroll: false });
  };

  return (
    <section className={`tab-screen ${activeTab === 'home' ? 'active' : ''}`} id="tab-home">

      {/* 🖼️ New Panorama Hero Section */}
      <div className="new-hero-container">
        {/* SubNavbar Overlay */}
        <div className="hero-subnav-overlay">
          <SubNavbar />
        </div>

        {/* ✈️ Hero Flight Search Floating Overlay (Matching User's 2nd Image) */}
        <div className="hero-flight-search-wrapper">
          <div className="hero-flight-card">
            {/* Top Row: Trip Types & Hassle-Free Bookings Badge */}
            <div className="hero-flight-top-row">
              <div className="hero-flight-trip-types">
                <button
                  type="button"
                  className={`hero-trip-pill ${tripType === 'one_way' ? 'active' : ''}`}
                  onClick={() => setTripType('one_way')}
                >
                  <span className="hero-radio-dot"></span> One Way
                </button>
                <button
                  type="button"
                  className={`hero-trip-pill ${tripType === 'round_trip' ? 'active' : ''}`}
                  onClick={() => setTripType('round_trip')}
                >
                  <span className="hero-radio-dot"></span> Round Trip
                </button>
              </div>

            </div>

            {/* Middle Row: Form Inputs Grid (From, To, Departure, Return, Travellers, Search) */}
            <div className="hero-flight-form-row">
              {/* FROM City */}
              <div className="hero-ff-box" ref={fromRef}>
                <span className="hero-ff-label">From</span>
                <input
                  type="text"
                  className="hero-ff-input"
                  value={fromCity}
                  onChange={(e) => {
                    setFromCity(e.target.value);
                    setShowFromDropdown(true);
                  }}
                  onFocus={() => setShowFromDropdown(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setShowFromDropdown(false);
                      handleSearchRide();
                    }
                  }}
                  placeholder="origin"
                />

                {/* Date of Journey directly below From address with interactive Calendar */}
                <div 
                  className="hero-ff-subdate-row" 
                  ref={calendarRef} 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCalendarPicker(prev => !prev);
                  }}
                  title="Click to open calendar"
                >
                  <span className="hero-ff-subdate-label">
                    <i className="fa-regular fa-calendar-days"></i> Date:
                  </span>
                  <span className="hero-ff-subdate-text">{departDate}</span>
                  <i className="fa-solid fa-chevron-down hero-ff-subdate-chevron"></i>

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
                          title="Previous month"
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
                          title="Next month"
                        >
                          <i className="fa-solid fa-chevron-right"></i>
                        </button>
                      </div>

                      {/* Weekday Names */}
                      <div className="hero-cal-weekdays">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => (
                          <span key={w} className="hero-cal-weekday">{w}</span>
                        ))}
                      </div>

                      {/* Days Grid */}
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

                      {/* Quick date picks */}
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
                            setFromCity(`${c.code} - ${c.name}`);
                            setShowFromDropdown(false);
                          }}
                        >
                          <div className="hero-city-icon">
                            <i className="fa-solid fa-plane-departure"></i>
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
                className="hero-ff-swap-btn"
                onClick={handleSwapCities}
                title="Swap departure and destination"
              >
                <i className="fa-solid fa-arrow-right-arrow-left"></i>
              </button>

              {/* TO City */}
              <div className="hero-ff-box" ref={toRef}>
                <span className="hero-ff-label">To</span>
                <input
                  type="text"
                  className="hero-ff-input"
                  value={toCity}
                  onChange={(e) => {
                    setToCity(e.target.value);
                    setShowToDropdown(true);
                  }}
                  onFocus={() => setShowToDropdown(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setShowToDropdown(false);
                      handleSearchRide();
                    }
                  }}
                  placeholder="destination"
                />
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
                            setToCity(`${c.code} - ${c.name}`);
                            setShowToDropdown(false);
                          }}
                        >
                          <div className="hero-city-icon">
                            <i className="fa-solid fa-plane-arrival"></i>
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



              {/* AVAILABLE RIDES SELECTION */}
              <div
                className="hero-ff-box hero-ff-traveller"
                ref={rideRef}
                onClick={() => setShowRideDropdown(prev => !prev)}
              >
                <span className="hero-ff-label">Select Ride</span>
                <span className="hero-ff-val-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className={`fa-solid ${AVAILABLE_RIDES.find(r => r.id === selectedRide)?.icon || 'fa-motorcycle'}`} style={{ color: '#0284c7' }}></i>
                  <span>{AVAILABLE_RIDES.find(r => r.id === selectedRide)?.name || 'Bike'}</span>
                </span>

                {showRideDropdown && (
                  <div className="hero-traveller-dropdown hero-ride-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="hero-td-header">
                      <div>
                        <h4>Available Rides</h4>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Select a ride mode to explore</span>
                      </div>
                      <button
                        type="button"
                        className="hero-td-close"
                        onClick={() => setShowRideDropdown(false)}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>

                    <div className="hero-ride-options-list">
                      {AVAILABLE_RIDES.map((ride) => {
                        const isSelected = selectedRide === ride.id;
                        return (
                          <div
                            key={ride.id}
                            className={`hero-ride-option-card ${isSelected ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedRide(ride.id);
                              setShowRideDropdown(false);
                            }}
                          >
                            <div className="hero-ride-option-left">
                              <div className={`hero-ride-icon-wrap ${isSelected ? 'active' : ''}`}>
                                <i className={`fa-solid ${ride.icon}`}></i>
                              </div>
                              <div className="hero-ride-info-wrap">
                                <div className="hero-ride-name-row">
                                  <span className="hero-ride-name">{ride.name}</span>
                                  <span className="hero-ride-count-badge">{ride.count}</span>
                                </div>
                                <span className="hero-ride-desc">{ride.desc}</span>
                              </div>
                            </div>
                            <div className="hero-ride-arrow">
                              <i className="fa-solid fa-chevron-right"></i>
                            </div>
                          </div>
                        );
                      })}
                    </div>


                  </div>
                )}
              </div>

              {/* Search CTA */}
              <button
                type="button"
                className="hero-ff-search-btn"
                onClick={() => handleSearchRide()}
                title="Search Rides"
              >
                <span>Search</span>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>




          </div>
        </div>

        {/* Modern Full-Width Carousel */}
        <div className="modern-carousel">
          {carouselSlides.map((slide, index) => (
            <div key={slide.id} className={`carousel-slide ${index === currentSlide ? 'active' : ''}`} style={{ backgroundImage: `url(${slide.img})`, backgroundColor: '#0c2217' }}>
              <div className="carousel-overlay-gradient"></div>
            </div>
          ))}

          <button className="carousel-nav prev" onClick={() => setCurrentSlide(p => p === 0 ? 3 : p - 1)}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button className="carousel-nav next" onClick={() => setCurrentSlide(p => p === 3 ? 0 : p + 1)}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          <div className="carousel-dots">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Services Strip replacing the old image click areas */}
      {/* <div style={{ textAlign: 'center', padding: '3px 20px 0' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', margin: 0, letterSpacing: '1px' }}>Book a Service</h2>
        <div style={{ width: '60px', height: '4px', background: '#f59e0b', margin: '12px auto 0', borderRadius: '2px' }}></div>
      </div>
      <div className="quick-services-strip">
        <div className="service-card" onClick={() => setActiveTab('ride')}><i className="fa-solid fa-car-side"></i> <span>Rides</span></div>
        <div className="service-card" onClick={() => setActiveTab('carrier')}><i className="fa-solid fa-truck-fast"></i> <span>Carrier</span></div>
        <div className="service-card" onClick={() => setActiveTab('rental')}><i className="fa-solid fa-key"></i> <span>Rental</span></div>
        <div className="service-card" onClick={() => setActiveTab('community')}><i className="fa-solid fa-users"></i> <span>Community</span></div>
        <div className="service-card" onClick={() => setActiveTab('parking')}><i className="fa-solid fa-square-parking"></i> <span>Parking</span></div>
        <div className="service-card" onClick={() => setActiveTab('drivers')}><i className="fa-solid fa-user-tie"></i> <span>Drivers</span></div>
      </div> */}
      <div className="home-content-wrapper">
        {/* Quick Services Section */}
        <section className="book-service-section">
          <div className="book-service-header">
            <h2>Book a Service</h2>
            <p>Select tailored multi-modal transport and logistics crafted for instant urban mobility.</p>
          </div>
          <div className="book-service-inner-card">
            <div className="book-service-grid">
              {/* 1. Road Rides */}
              <div className="book-card" onClick={() => handleServiceClick('ride')}>
                <div className="book-badge badge-green"><i className="fa-solid fa-clock"></i> NEAR YOU IN 2 MINS</div>
                <h3 className="book-title">Rides</h3>
                <p className="book-desc">Instant taxi, premium sedans & daily auto commutes.</p>
                <div className="book-footer">
                  <div className="book-meta">
                    <span className="meta-label">Fares starting at</span>
                    <span className="meta-val">₹49 / km <span className="meta-action">Book Ride <i className="fa-solid fa-chevron-right"></i></span></span>
                  </div>
                  <div className="book-icon icon-green"><i className="fa-solid fa-car-side"></i></div>
                </div>
              </div>

              {/* 2. Cargo & Logistics */}
              <div className="book-card" onClick={() => handleServiceClick('carrier')}>
                <div className="book-badge badge-orange"><i className="fa-solid fa-bolt"></i> INSTANT DELIVERY</div>
                <h3 className="book-title">Cargo & Logistics</h3>
                <p className="book-desc">Freight trucks, intra-city courier vans & rapid parcel drops.</p>
                <div className="book-footer">
                  <div className="book-meta">
                    <span className="meta-label">Payload Up to</span>
                    <span className="meta-val">2.5 Tonnes <span className="meta-action">Ship Parcel <i className="fa-solid fa-chevron-right"></i></span></span>
                  </div>
                  <div className="book-icon icon-orange"><i className="fa-solid fa-truck-fast"></i></div>
                </div>
              </div>

              {/* 3. Vehicle Rental */}
              <div className="book-card" onClick={() => handleServiceClick('rental')}>
                <div className="book-badge badge-teal"><i className="fa-solid fa-leaf"></i> SELF-DRIVE & EV</div>
                <h3 className="book-title">Vehicle Rental</h3>
                <p className="book-desc">Zero-deposit luxury sedans, SUVs & flexible daily fleet.</p>
                <div className="book-footer">
                  <div className="book-meta">
                    <span className="meta-label">Zero Deposit</span>
                    <span className="meta-val">₹1,999 / day <span className="meta-action">Rent Car <i className="fa-solid fa-chevron-right"></i></span></span>
                  </div>
                  <div className="book-icon icon-teal"><i className="fa-solid fa-key"></i></div>
                </div>
              </div>

              {/* 4. Drivers Hire */}
              <div className="book-card" onClick={() => handleServiceClick('drivers')}>
                <div className="book-badge badge-indigo"><i className="fa-solid fa-user-shield"></i> VERIFIED CHAUFFEURS</div>
                <h3 className="book-title">Drivers Hire</h3>
                <p className="book-desc">Acting drivers for your own car. Hourly, round-trip or outstation.</p>
                <div className="book-footer">
                  <div className="book-meta">
                    <span className="meta-label">Certified Pros</span>
                    <span className="meta-val">₹99 / hr <span className="meta-action">Hire Chauffeur <i className="fa-solid fa-chevron-right"></i></span></span>
                  </div>
                  <div className="book-icon icon-indigo"><i className="fa-solid fa-user-tie"></i></div>
                </div>
              </div>

              {/* 5. Parking Slots */}
              <div className="book-card" onClick={() => handleServiceClick('parking')}>
                <div className="book-badge badge-blue"><i className="fa-solid fa-square-parking"></i> LIVE VACANCY</div>
                <h3 className="book-title">Parking Slots</h3>
                <p className="book-desc">Real-time automated parking, valet access & EV charger reservation.</p>
                <div className="book-footer">
                  <div className="book-meta">
                    <span className="meta-label">Availability</span>
                    <span className="meta-val">142 Slots nearby <span className="meta-action">Reserve Slot <i className="fa-solid fa-chevron-right"></i></span></span>
                  </div>
                  <div className="book-icon icon-blue"><i className="fa-solid fa-p"></i></div>
                </div>
              </div>

              {/* 6. Communities */}
              <div className="book-card" onClick={() => handleServiceClick('community')}>
                <div className="book-badge badge-pink"><i className="fa-solid fa-users"></i> 10K+ MEMBERS</div>
                <h3 className="book-title">Communities</h3>
                <p className="book-desc">Driver association, safety guild, welfare union & civic forums.</p>
                <div className="book-footer">
                  <div className="book-meta">
                    <span className="meta-label">Active Chapters</span>
                    <span className="meta-val">Chennai Central <span className="meta-action">Join Hub <i className="fa-solid fa-chevron-right"></i></span></span>
                  </div>
                  <div className="book-icon icon-pink"><i className="fa-solid fa-users"></i></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Showcase />

        <WhyChooseUs />

        <TravelBlogs />

        <TopRoutes />

        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '24px', paddingBottom: '60px' }}>
          <MapEngine />
          <NewsFeed />
        </div>
      </div>
    </section>
  );
}

