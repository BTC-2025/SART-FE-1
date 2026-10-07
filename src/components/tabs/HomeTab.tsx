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
import './HomeTab.css';

export default function HomeTab() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    { id: 1, img: '/slider1.jpg', title: 'FUTURE OF COMMUTE', subtitle: 'Experience autonomous luxury', action: 'ride', btn: 'Book a Ride' },
    { id: 2, img: '/slider2.jpg', title: 'CYBERNETIC LOGISTICS', subtitle: 'Automated freight & cargo', action: 'carrier', btn: 'Hire Carrier' },
    { id: 3, img: '/slider3.jpg', title: 'UNLEASH FREEDOM', subtitle: 'Premium rentals for every journey', action: 'rental', btn: 'Rent Vehicle' },
    { id: 4, img: '/slider4.jpg', title: 'ELITE CHAUFFEURS', subtitle: 'Arrive in ultimate style', action: 'drivers', btn: 'Hire Driver' }
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

      <div style={{ background: '#111827', padding: '10px 0' }}>
        <SubNavbar />
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
      {/* Quick Services Section */}
<section className="quick-services-section">

  <div className="services-heading">
    <h2>Book a Service</h2>
    <div className="heading-line"></div>
  </div>

  <div className="quick-services-strip">

    {/* Rides */}
    <div
      className={`service-card ${activeTab === 'ride' ? 'active' : ''}`}
      onClick={() => handleServiceClick('ride')}
    >
      <div className="service-image-wrapper">
        <img
          src="https://img.icons8.com/fluency/96/car.png"
          alt="Rides"
        />
      </div>
      <span>Rides</span>
    </div>


    {/* Carrier */}
    <div
      className={`service-card ${activeTab === 'carrier' ? 'active' : ''}`}
      onClick={() => handleServiceClick('carrier')}
    >
      <div className="service-image-wrapper">
        <img
          src="https://img.icons8.com/fluency/96/delivery.png"
          alt="Carrier"
        />
      </div>
      <span>Carrier </span>
    </div>


    {/* Rental */}
    <div
      className={`service-card ${activeTab === 'rental' ? 'active' : ''}`}
      onClick={() => handleServiceClick('rental')}
    >
      <div className="service-image-wrapper">
        <img
          src="https://img.icons8.com/fluency/96/car-rental.png"
          alt="Rental"
        />
      </div>
      <span>Rental</span>
    </div>


    {/* Community */}
    <div
      className={`service-card ${activeTab === 'community' ? 'active' : ''}`}
      onClick={() => handleServiceClick('community')}
    >
      <div className="service-image-wrapper">
        <img
          src="https://img.icons8.com/fluency/96/conference-call.png"
          alt="Community"
        />
      </div>
      <span>Community</span>
    </div>


    {/* Parking */}
    <div
      className={`service-card ${activeTab === 'parking' ? 'active' : ''}`}
      onClick={() => handleServiceClick('parking')}
    >
      <div className="service-image-wrapper">
        <img
          src="https://img.icons8.com/fluency/96/parking.png"
          alt="Parking"
        />
      </div>
      <span>Parking</span>
    </div>


    {/* Drivers */}
    <div
      className={`service-card ${activeTab === 'drivers' ? 'active' : ''}`}
      onClick={() => handleServiceClick('drivers')}
    >
      <div className="service-image-wrapper">
        <img
          src="https://img.icons8.com/fluency/96/driver.png"
          alt="Drivers"
        />
      </div>
      <span>Drivers</span>
    </div>

  </div>

</section>

      {/* Yellow Quick Booking Form (Below Services) */}
      <QuickBookingForm />

      {/* 🖼️ New Panorama Hero Section (Moved Below Booking Form) */}
      <div className="new-hero-container" style={{ marginTop: '20px' }}>
        {/* Modern Full-Width Carousel */}
        <div className="modern-carousel">
          {carouselSlides.map((slide, index) => (
            <div key={slide.id} className={`carousel-slide ${index === currentSlide ? 'active' : ''}`} style={{ backgroundImage: `url(${slide.img})` }}>
              <div className="carousel-overlay-gradient"></div>
              <div className="carousel-content">
                <h2 className="carousel-title">{slide.title}</h2>
                <p className="carousel-subtitle">{slide.subtitle}</p>
                <button className="carousel-cta" onClick={() => handleServiceClick(slide.action)}>
                  {slide.btn} <i className="fa-solid fa-arrow-right"></i>
                </button>
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

      {/* Special Offers Carousel */}
      <OffersSlider />

      {/* Travel Blogs & Top Routes */}
      <TravelBlogs />
      <TopRoutes />

      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '24px' }}>
        <MapEngine />
        <NewsFeed />
      </div>

    </section>
  );
}

