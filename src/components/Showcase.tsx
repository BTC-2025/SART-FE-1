import React, { useRef, useState } from 'react';
import './Showcase.css';

interface OfferCard {
  id: number;
  category: 'Flights' | 'Hotels' | 'Bank Offers' | 'Trains';
  tag: string;
  bank?: string;
  badgeBg: string;
  title: string;
  subtitle: string;
  code?: string;
  image: string;
}

interface HotelCard {
  id: number;
  name: string;
  location: string;
  rating: string;
  reviews: string;
  price: string;
  stars?: number;
  image: string;
  badge?: string;
  duration?: string;
  category?: string;
  capacity?: string;
  description?: string;
  transport?: string;
}

const OFFERS_DATA: OfferCard[] = [
  {
    id: 1,
    category: 'Flights',
    tag: 'FESTIVE FARES',
    title: 'Up to 20% Off on Flights',
    subtitle: 'Special holiday airline discounts for domestic & intl routes',
    code: 'FEST',
    badgeBg: '#e11d48',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    category: 'Bank Offers',
    bank: 'AXIS BANK',
    tag: 'AXIS SPECIAL',
    title: 'Flat 12% Off on Flights',
    subtitle: 'With Axis Bank Credit Cards + Interest Free EMI',
    code: 'AXISFLY',
    badgeBg: '#9f1239',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    category: 'Bank Offers',
    bank: 'HDFC BANK',
    tag: 'DOMESTIC DEALS',
    title: 'Get up to ₹2,000 Off',
    subtitle: 'On domestic flights with HDFC Bank Credit Card EMI',
    code: 'HDFCSART',
    badgeBg: '#1e3a8a',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    category: 'Bank Offers',
    bank: 'ICICI BANK',
    tag: 'MEGA SAVER',
    title: 'Up to ₹7,500 Off',
    subtitle: 'On Flights with ICICI Bank Credit Card EMI',
    code: 'ICICISART',
    badgeBg: '#c2410c',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    category: 'Hotels',
    tag: 'LUXURY STAYS',
    title: 'Save up to 40% on Hotels',
    subtitle: 'Verified 4-star & 5-star properties across top metro hubs',
    code: 'HOTEL40',
    badgeBg: '#059669',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    category: 'Trains',
    tag: 'ZERO CONVENIENCE',
    title: '₹0 Gateway Fee on Trains',
    subtitle: 'Instant PNR confirmation & free cancellation protection',
    code: 'TRAINFREE',
    badgeBg: '#7c3aed',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    category: 'Flights',
    tag: 'INTL FLYER',
    title: 'Flat ₹5,000 Off Abroad',
    subtitle: 'Exclusive discounts on Europe, Dubai, & Singapore flights',
    code: 'GLOBALFLY',
    badgeBg: '#0284c7',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    category: 'Hotels',
    tag: 'WEEKEND RESORT',
    title: 'Stay 3 Nights, Pay for 2',
    subtitle: 'Complimentary breakfast and free pool access included',
    code: 'RESORT2X',
    badgeBg: '#0d9488',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 9,
    category: 'Bank Offers',
    bank: 'SBI CARD',
    tag: 'CASHBACK',
    title: '5% Instant Cashback',
    subtitle: 'Applicable across all transit bookings and airport taxis',
    code: 'SBISART',
    badgeBg: '#15803d',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 10,
    category: 'Trains',
    tag: 'TATKAL BOOST',
    title: 'Guaranteed Waitlist Refund',
    subtitle: '100% money back if waitlisted train ticket not confirmed',
    code: 'SURETRAIN',
    badgeBg: '#9333ea',
    image: 'https://images.unsplash.com/photo-1515165562839-978bbcf18277?auto=format&fit=crop&w=600&q=80'
  }
];

const WHY_BOOK_ITEMS = [
  {
    id: 1,
    title: 'Track flight delays & baggage',
    desc: 'Live gate alerts & baggage carousel tracker',
    icon: 'fa-solid fa-plane-circle-check',
    bg: '#eff6ff',
    color: '#2563eb'
  },
  {
    id: 2,
    title: 'Save up to 40% with smart fare alerts',
    desc: 'AI price prediction & automatic price drops',
    icon: 'fa-solid fa-bell-concierge',
    bg: '#fefce8',
    color: '#ca8a04'
  },
  {
    id: 3,
    title: 'Travel Stress-Free with Insurance',
    desc: 'Medical coverage, trip delay & lost passport cover',
    icon: 'fa-solid fa-shield-heart',
    bg: '#fdf2f8',
    color: '#db2777'
  },
  {
    id: 4,
    title: 'Instant & Full Refund Guarantee',
    desc: 'Zero-deduction instant refund on cancellations',
    icon: 'fa-solid fa-shield-halved',
    bg: '#f0fdf4',
    color: '#16a34a'
  }
];

const HOTELS_DATA: HotelCard[] = [

  {
    id: 1,
    name: "Economy Hatchback",
    location: "Chennai to Pondicherry",
    rating: "4.6",
    reviews: "2k+ Travelers",
    price: "₹2,499",
    duration: "3 Hours",
    category: "City & Outstation Cab",
    badge: "Budget Friendly",
    capacity: "4 Passengers",
    description:
      "Affordable air-conditioned hatchback for city rides, airport transfers, and short trips.",
    transport: "Private Cab",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Premium Sedan",
    location: "Hyderabad to Vijayawada",
    rating: "4.8",
    reviews: "3k+ Travelers",
    price: "₹3,999",
    duration: "5 Hours",
    category: "Comfort Travel",
    badge: "Most Popular",
    capacity: "4 Passengers",
    description:
      "Comfortable sedan with spacious seating, air conditioning, and a professional driver.",
    transport: "Private Sedan",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "SUV Family Ride",
    location: "Bengaluru to Mysuru",
    rating: "4.8",
    reviews: "2.5k+ Travelers",
    price: "₹4,999",
    duration: "3.5 Hours",
    category: "Family Travel",
    badge: "Family Favorite",
    capacity: "6–7 Passengers",
    description:
      "Spacious SUV suitable for families, luggage, weekend trips, and long-distance journeys.",
    transport: "Private SUV",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Luxury Premium Car",
    location: "Mumbai City & Outstation",
    rating: "4.9",
    reviews: "1.5k+ Travelers",
    price: "₹7,999",
    duration: "8 Hours",
    category: "Luxury Travel",
    badge: "Premium Choice",
    capacity: "3–4 Passengers",
    description:
      "Travel in a premium vehicle for business meetings, special occasions, and executive transfers.",
    transport: "Luxury Chauffeur Car",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Tempo Traveller",
    location: "Delhi to Agra",
    rating: "4.7",
    reviews: "1.8k+ Travelers",
    price: "₹8,499",
    duration: "4 Hours",
    category: "Group Travel",
    badge: "Group Special",
    capacity: "9–17 Passengers",
    description:
      "Ideal for group outings, family functions, sightseeing, and multi-day road trips.",
    transport: "Private Tempo Traveller",
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Mini Bus Rental",
    location: "Hyderabad to Tirupati",
    rating: "4.7",
    reviews: "1.2k+ Travelers",
    price: "₹12,999",
    duration: "10 Hours",
    category: "Group & Pilgrimage",
    badge: "Group Travel Deal",
    capacity: "18–25 Passengers",
    description:
      "Convenient group transport for pilgrimages, corporate trips, weddings, and tours.",
    transport: "Private Mini Bus",
    image:
      "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Motorbike Rental",
    location: "Manali & Nearby Routes",
    rating: "4.8",
    reviews: "2k+ Travelers",
    price: "₹999",
    duration: "Per Day",
    category: "Bike Adventure",
    badge: "Adventure Pick",
    capacity: "1–2 Riders",
    description:
      "Explore scenic mountain roads and local destinations on a rented motorcycle.",
    transport: "Self-Drive Bike",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Electric Auto Rickshaw",
    location: "Chennai City",
    rating: "4.5",
    reviews: "900+ Travelers",
    price: "₹199",
    duration: "Local Trip",
    category: "Eco-Friendly Travel",
    badge: "Green Mobility",
    capacity: "3 Passengers",
    description:
      "Affordable short-distance travel for local shopping, station transfers, and daily commutes.",
    transport: "Electric Auto",
    image:
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80"
  }

];

export default function Showcase() {
  const [activeOfferTab, setActiveOfferTab] = useState<'All' | 'Flights' | 'Hotels' | 'Bank Offers' | 'Trains'>('All');
  const [isOffersGridExpanded, setIsOffersGridExpanded] = useState(false);
  const [isHotelsGridExpanded, setIsHotelsGridExpanded] = useState(false);

  const offersTrackRef = useRef<HTMLDivElement>(null);
  const whyTrackRef = useRef<HTMLDivElement>(null);
  const hotelsTrackRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, distance: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  const filteredOffers = activeOfferTab === 'All'
    ? OFFERS_DATA
    : OFFERS_DATA.filter(o => o.category === activeOfferTab);

  return (
    <div className="showcase-container">

      {/* 1. OFFERS FOR YOU SECTION */}
      <section className="showcase-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Offers For You</h2>
          </div>
          <div className="showcase-header-right">

            <button
              type="button"
              className="showcase-view-all-link"
              onClick={() => setIsOffersGridExpanded(prev => !prev)}
            >
              {isOffersGridExpanded ? 'View Less' : 'View All'} <i className={`fa-solid ${isOffersGridExpanded ? 'fa-chevron-up' : 'fa-chevron-right'}`}></i>
            </button>
          </div>
        </div>

        {/* Carousel with Left/Right Buttons */}
        <div className="showcase-slider-relative">
          {!isOffersGridExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn left"
              onClick={() => scrollContainer(offersTrackRef, -330)}
              aria-label="Scroll Offers Left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <div
            className={`showcase-cards-track ${isOffersGridExpanded ? 'grid-expanded' : ''}`}
            ref={offersTrackRef}
          >
            {filteredOffers.map(offer => (
              <div
                key={offer.id}
                className="showcase-offer-card"
                style={{ backgroundImage: `url(${offer.image})` }}
              >
                {/* Full Card Background Backdrop Gradient Overlay */}
                <div className="showcase-card-overlay"></div>

                <div className="showcase-card-inner">
                  <div className="showcase-card-top-tags">
                    <div className="showcase-offer-badge" style={{ backgroundColor: offer.badgeBg }}>
                      {offer.tag}
                    </div>
                    {offer.bank && (
                      <div className="showcase-bank-pill">
                        <span className="showcase-bank-text">{offer.bank}</span>
                      </div>
                    )}
                  </div>

                  <div className="showcase-card-bottom-info">
                    <h3 className="showcase-offer-heading">{offer.title}</h3>
                    <p className="showcase-offer-sub">{offer.subtitle}</p>
                    {offer.code && (
                      <div className="showcase-code-chip">
                        <span>Code:</span> <strong>{offer.code}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isOffersGridExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn right"
              onClick={() => scrollContainer(offersTrackRef, 330)}
              aria-label="Scroll Offers Right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      </section>

      {/* 2. WHY BOOK WITH US SECTION */}
      <section className="showcase-section why-book-section">
        <div className="showcase-section-header">
          <h2 className="showcase-title">Why Book With Us?</h2>
        </div>

        <div className="showcase-slider-relative">


          <div className="showcase-why-track" ref={whyTrackRef}>
            {WHY_BOOK_ITEMS.map(item => (
              <div key={item.id} className="showcase-why-card">
                <div className="showcase-why-icon-box" style={{ backgroundColor: item.bg, color: item.color }}>
                  <i className={item.icon}></i>
                </div>
                <div className="showcase-why-text">
                  <h4 className="showcase-why-title">{item.title}</h4>
                  <p className="showcase-why-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* 3. TOP HOTELS & DESTINATIONS SECTION */}
      <section className="showcase-section hotels-section">
        <div className="showcase-section-header">
          <div className="showcase-header-left">
            <h2 className="showcase-title">Explore Top Travel Destinations</h2>
            <span className="showcase-subtitle-tag">Best Travel Deals</span>
          </div>
          <button
            type="button"
            className="showcase-view-all-link orange"
            onClick={() => setIsHotelsGridExpanded(prev => !prev)}
          >
            {isHotelsGridExpanded ? 'View Less' : 'View All'} <i className={`fa-solid ${isHotelsGridExpanded ? 'fa-chevron-up' : 'fa-chevron-right'}`}></i>
          </button>
        </div>

        <div className="showcase-slider-relative">
          {!isHotelsGridExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn left"
              onClick={() => scrollContainer(hotelsTrackRef, -310)}
              aria-label="Scroll Hotels Left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}

          <div
            className={`showcase-hotels-track ${isHotelsGridExpanded ? 'grid-expanded' : ''}`}
            ref={hotelsTrackRef}
          >
            {HOTELS_DATA.map(hotel => (
              <div key={hotel.id} className="showcase-hotel-card">
                <div className="showcase-hotel-img-wrap">
                  <img src={hotel.image} alt={hotel.name} />
                  {hotel.badge && (
                    <span className="showcase-hotel-badge">
                      <i className="fa-solid fa-shield-check"></i> {hotel.badge}
                    </span>
                  )}
                </div>

                <div className="showcase-hotel-details">
                  <div className="showcase-hotel-name-row">
                    <h3 className="showcase-hotel-name" title={hotel.name}>{hotel.name}</h3>
                    <div className="showcase-stars">
                      {Array.from({ length: hotel.stars }).map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                    </div>
                  </div>
                  <p className="showcase-hotel-loc">{hotel.location}</p>

                  <div className="showcase-hotel-footer">
                    <div className="showcase-rating-pill">
                      <span className="rating-score">{hotel.rating}</span>
                      <span className="rating-lbl">Excellent • {hotel.reviews}</span>
                    </div>
                    <div className="showcase-price-tag">
                      <span className="price-val">{hotel.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isHotelsGridExpanded && (
            <button
              type="button"
              className="showcase-arrow-btn right"
              onClick={() => scrollContainer(hotelsTrackRef, 310)}
              aria-label="Scroll Hotels Right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
      </section>

    </div>
  );
}
