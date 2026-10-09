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
import './HomeTab.css';

export default function HomeTab() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      id: 1,
      img: '/slider4.jpg',
      title1: 'Universal Mobility.',
      title2: 'Obsidian Prestige.',
      subtitle: 'Reserve verified chauffeurs, instant executive sedans, and cargo transport backed by uncompromising luxury standards.',
      action1: 'drivers', btn1: 'HIRE DRIVER'
    },
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
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { activeTab, setActiveTab } = useSartStore();
  const router = useRouter();

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

        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '24px', paddingBottom: '60px' }}>
          <MapEngine />
          <NewsFeed />
        </div>
      </div>
    </section>
  );
}

