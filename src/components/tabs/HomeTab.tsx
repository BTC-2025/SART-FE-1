'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSartStore } from '@/store/useSartStore';
import SubNavbar from '@/components/SubNavbar';
import QuickBookingForm from '@/components/QuickBookingForm';
import MapEngine from '@/components/MapEngine';
import NewsFeed from '@/components/NewsFeed';
import OffersSlider from '@/components/OffersSlider';
import TravelBlogs from '@/components/TravelBlogs';
import TopRoutes from '@/components/TopRoutes';
import WhyChooseUs from '@/components/WhyChooseUs';
import CommunityVoices from '@/components/CommunityVoices';
import { POPULAR_CITIES } from '@/components/trainData';
import './HomeTab.css';

export default function HomeTab() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [

    {
      id: 2,
      img: '/slider1.jpg',
      title1: 'Future of Commute.',
      title2: 'Autonomous Luxury.',
      subtitle: 'Experience the next generation of smart city travel with our premium electric fleet.',
      action1: 'ride', btn1: 'BOOK A RIDE'
    },
    {
      id: 3,
      img: '/slider2.jpg',
      title1: 'Cybernetic Logistics.',
      title2: 'Automated Freight.',
      subtitle: 'Seamless intra-city cargo and parcel delivery with real-time tracking.',
      action1: 'carrier', btn1: 'HIRE CARRIER'
    },
    {
      id: 4,
      img: '/slider3.jpg',
      title1: 'Unleash Freedom.',
      title2: 'Premium Rentals.',
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

  const fromRef = React.useRef<HTMLDivElement>(null);
  const toRef = React.useRef<HTMLDivElement>(null);
  const travellerRef = React.useRef<HTMLDivElement>(null);

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

  const handleSearchFlights = () => {
    // Extract city name without code e.g. "MAA - Chennai" -> "Chennai"
    const src = fromCity.includes('-') ? fromCity.split('-')[1].trim() : fromCity.trim();
    const dest = toCity.includes('-') ? toCity.split('-')[1].trim() : toCity.trim();
    const query = new URLSearchParams({
      source: src,
      destination: dest,
      date: departDate,
      adults: adultsCount.toString(),
      children: childrenCount.toString(),
      infants: infantsCount.toString(),
      cabinClass: cabinClass
    }).toString();

    setActiveRideMode('flight');
    setActiveTab('ride');
    const targetUrl = `/home/ride/flight?${query}`;
    if (typeof window !== 'undefined') {
      window.history.pushState({ mode: 'flight' }, '', targetUrl);
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
              <div className="hero-hassle-free-badge">
                <i className="fa-solid fa-thumbs-up"></i> Hassle-Free Bookings
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
                      handleSearchFlights();
                    }
                  }}
                  placeholder="origin airport"
                />
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
                      handleSearchFlights();
                    }
                  }}
                  placeholder="destination airport"
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

              {/* DEPARTURE */}
              <div className="hero-ff-box">
                <span className="hero-ff-label">Departure</span>
                <input
                  type="text"
                  className="hero-ff-input"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  placeholder="Thu, 15 Oct"
                />
              </div>

              {/* RETURN */}
              <div className="hero-ff-box hero-ff-return-box">
                <span className="hero-ff-label">Return</span>
                <div className="hero-return-input-wrap">
                  <input
                    type="text"
                    className="hero-ff-input"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    placeholder="Thu, 15 Oct"
                  />
                  {returnDate && (
                    <button
                      type="button"
                      className="hero-clear-return"
                      onClick={() => setReturnDate('')}
                      title="Clear return date"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* TRAVELLERS & CLASS */}
              <div
                className="hero-ff-box hero-ff-traveller"
                ref={travellerRef}
                onClick={() => setShowTravellerDropdown(prev => !prev)}
              >
                <span className="hero-ff-label">Travellers &amp; Class</span>
                <span className="hero-ff-val-text">{totalTravellers} Traveller{totalTravellers > 1 ? 's' : ''}, {cabinClass}</span>

                {showTravellerDropdown && (
                  <div className="hero-traveller-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="hero-td-header">
                      <h4>Select Travelers &amp; Class</h4>
                      <button
                        type="button"
                        className="hero-td-close"
                        onClick={() => setShowTravellerDropdown(false)}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>

                    <div className="hero-td-body">
                      {/* Adults */}
                      <div className="hero-td-row">
                        <div className="hero-td-type-info">
                          <span className="hero-td-title">Adults</span>
                          <span className="hero-td-sub">12+ years</span>
                        </div>
                        <div className="hero-td-counter">
                          <button
                            type="button"
                            onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                            disabled={adultsCount <= 1}
                          >
                            −
                          </button>
                          <span className="hero-td-count">{adultsCount}</span>
                          <button
                            type="button"
                            onClick={() => setAdultsCount(Math.min(9, adultsCount + 1))}
                            disabled={adultsCount >= 9}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="hero-td-row">
                        <div className="hero-td-type-info">
                          <span className="hero-td-title">Children</span>
                          <span className="hero-td-sub">2 - 12 years</span>
                        </div>
                        <div className="hero-td-counter">
                          <button
                            type="button"
                            onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                            disabled={childrenCount <= 0}
                          >
                            −
                          </button>
                          <span className="hero-td-count">{childrenCount}</span>
                          <button
                            type="button"
                            onClick={() => setChildrenCount(Math.min(6, childrenCount + 1))}
                            disabled={childrenCount >= 6}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Infants */}
                      <div className="hero-td-row">
                        <div className="hero-td-type-info">
                          <span className="hero-td-title">Infants</span>
                          <span className="hero-td-sub">Under 2 years</span>
                        </div>
                        <div className="hero-td-counter">
                          <button
                            type="button"
                            onClick={() => setInfantsCount(Math.max(0, infantsCount - 1))}
                            disabled={infantsCount <= 0}
                          >
                            −
                          </button>
                          <span className="hero-td-count">{infantsCount}</span>
                          <button
                            type="button"
                            onClick={() => setInfantsCount(Math.min(adultsCount, infantsCount + 1))}
                            disabled={infantsCount >= adultsCount}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Cabin Class Selection */}
                      <div className="hero-td-cabin-section">
                        <span className="hero-td-cabin-label">CABIN CLASS</span>
                        <div className="hero-td-cabin-pills">
                          {(['Economy', 'Premium Economy', 'Business'] as const).map(c => (
                            <button
                              key={c}
                              type="button"
                              className={`hero-td-cabin-pill ${cabinClass === c ? 'active' : ''}`}
                              onClick={() => setCabinClass(c)}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="hero-td-footer">
                      <button
                        type="button"
                        className="hero-td-done-btn"
                        onClick={() => setShowTravellerDropdown(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Search CTA */}
              <button
                type="button"
                className="hero-ff-search-btn"
                onClick={handleSearchFlights}
                title="Search Flights"
              >
                <span>Search</span>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            {/* Bottom Special Fares & Free Cancellation Banner */}
            <div className="hero-flight-special-fares">
              <span className="hero-special-label">Special Fares (Optional):</span>
              {['Student', 'Senior Citizen', 'Armed Forces', 'Doctors & Nurses'].map((fare) => (
                <button
                  key={fare}
                  type="button"
                  className={`hero-special-pill ${selectedSpecialFare === fare ? 'active' : ''}`}
                  onClick={() => setSelectedSpecialFare(selectedSpecialFare === fare ? '' : fare)}
                >
                  {fare}
                </button>
              ))}
            </div>


          </div>
        </div>

        {/* Modern Full-Width Carousel */}
        <div className="modern-carousel">
          {carouselSlides.map((slide, index) => (
            <div key={slide.id} className={`carousel-slide ${index === currentSlide ? 'active' : ''}`} style={{ backgroundImage: `url(${slide.img})`, backgroundColor: '#0c2217' }}>
              <div className="carousel-overlay-gradient"></div>
              <div className="carousel-content">
                <h2 className="carousel-title">
                  <span className="title-white">{slide.title1}</span><br />
                  <span className="title-gold">{slide.title2}</span>
                </h2>
                <p className="carousel-subtitle">{slide.subtitle}</p>

                <div className="hero-actions">
                  <button className="carousel-cta btn-primary" onClick={() => handleServiceClick(slide.action1)}>
                    {slide.btn1} <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
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

        <QuickBookingForm />

        <OffersSlider />

        <WhyChooseUs />

        <TravelBlogs />

        <TopRoutes />

        <CommunityVoices />

        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '24px', paddingBottom: '60px' }}>
          <MapEngine />
          <NewsFeed />
        </div>
      </div>
    </section>
  );
}

