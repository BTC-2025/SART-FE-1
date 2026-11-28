'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UsedCarItem } from './usedCarsData';
import { useSartStore } from '@/store/useSartStore';

interface UsedCarGridCardProps {
  car: UsedCarItem;
  onMakeOffer: (car: UsedCarItem) => void;
  onViewSellerDetails: (car: UsedCarItem) => void;
  showToast: (msg: string) => void;
}

export default function UsedCarGridCard({
  car,
  onMakeOffer,
  onViewSellerDetails,
  showToast
}: UsedCarGridCardProps) {
  const router = useRouter();
  const { wishlist, toggleWishlist, addToCart } = useSartStore();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const isFavorited = wishlist.includes(car.id);

  const images = car.images && car.images.length > 0 ? car.images : [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=700&q=80'
  ];

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(car.id);
    if (!isFavorited) {
      showToast(`Saved ${car.name} to Wishlist. View in Cart & Wishlist.`);
    } else {
      showToast(`Removed ${car.name} from Wishlist`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: car.id,
      name: `${car.name} (${car.year} • ${car.variant})`,
      price: car.rawPrice,
      originalPrice: car.rawPrice + 25000,
      icon: 'fa-car-side',
      image: images[0],
      quantity: 1,
      category: `${car.bodyType} - Verified Pre-Owned`,
      brand: car.brand,
      description: `Verified seller: ${car.sellerDetails.name} • ${car.location}`,
      rating: car.sellerDetails.rating || 4.8,
      inStock: true
    });
    showToast(`Added ${car.name} to Cart! Opening Cart...`);
    router.push('/home/cart');
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(`Hi, I am interested in buying the ${car.name} (${car.variant}, ${car.price}) listed on SART. Please share more details.`);
    const phone = car.sellerDetails.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${phone || '919840123456'}?text=${message}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
    showToast(`Opening WhatsApp chat for ${car.name}`);
  };

  return (
    <article className="used-car-card animate-fade-in">
      {/* 1. TOP IMAGE MEDIA AREA */}
      <div className="used-car-card-media" onClick={() => onViewSellerDetails(car)}>
        <img
          src={images[currentImgIndex]}
          alt={`${car.name} - ${car.variant}`}
          className="used-car-card-img"
          loading="lazy"
        />

        {/* Top-Left Partner / Seller Tag */}
        {car.partnerTag && (
          <div className={`card-top-partner-tag ${car.partnerTag.toLowerCase().includes('spinny') ? 'tag-spinny' : car.partnerTag.toLowerCase().includes('crest') ? 'tag-crest' : ''}`}>
            <span>{car.partnerTag}</span>
          </div>
        )}

        {/* Top-Right Favorite Heart */}
        <button
          type="button"
          className={`card-heart-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={handleFavoriteToggle}
          title={isFavorited ? 'Remove from Saved' : 'Save to Shortlist'}
        >
          <i className={`fa-${isFavorited ? 'solid' : 'regular'} fa-heart`}></i>
        </button>

        {/* Carousel Prev/Next Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="card-media-arrow arrow-left"
              onClick={handlePrevImg}
              title="Previous Photo"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              type="button"
              className="card-media-arrow arrow-right"
              onClick={handleNextImg}
              title="Next Photo"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>

            {/* Carousel Dots */}
            <div className="card-carousel-dots">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`dot ${idx === currentImgIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Bottom-Right Green Save Badge */}
        {car.saveAmount && (
          <div className="card-save-badge">
            <span className="save-dot">●</span>
            <span>{car.saveAmount}</span>
          </div>
        )}
      </div>

      {/* 2. CARD CONTENT DETAILS */}
      <div className="used-car-card-body">
        {/* Row 1: Vehicle Title + Price */}
        <div className="card-title-price-row">
          <h4 className="card-vehicle-name" title={car.name}>{car.name}</h4>
          <span className="card-price-value">{car.price}</span>
        </div>

        {/* Row 2: Subtitle / Variant + EMI */}
        <div className="card-variant-emi-row">
          <span className="card-variant-name" title={car.variant}>{car.variant}</span>
          <span className="card-emi-value">{car.emi}</span>
        </div>

        {/* Row 3: Specs + Make Offer */}
        <div className="card-specs-offer-row">
          <span className="card-specs-text">
            {car.kmsDisplay} • {car.fuel} • {car.transmission} • {car.rto}
          </span>
          <button
            type="button"
            className="card-make-offer-btn"
            onClick={(e) => {
              e.stopPropagation();
              onMakeOffer(car);
            }}
          >
            Make Offer
          </button>
        </div>

        {/* Row 4: Trust & Assurance Badges */}
        <div className="card-badges-row">
          {car.badges.map((badge, bIdx) => (
            <span key={bIdx} className="card-assurance-badge">
              {badge.includes('★') ? '' : <i className="fa-solid fa-check"></i>}
              <span>{badge}</span>
            </span>
          ))}
        </div>

        {/* Row 5: Action Buttons (WhatsApp + Add to Cart + Orange View Seller Details) */}
        <div className="card-actions-row">
          <button
            type="button"
            className="card-whatsapp-btn"
            onClick={handleWhatsApp}
            title="Chat with Seller on WhatsApp"
          >
            <i className="fa-brands fa-whatsapp"></i>
          </button>

          <button
            type="button"
            className="card-add-to-cart-btn"
            onClick={handleAddToCart}
            title="Add Vehicle to Cart"
          >
            <i className="fa-solid fa-cart-shopping"></i>
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            className="card-view-seller-btn"
            onClick={() => onViewSellerDetails(car)}
            title="View Seller & Vehicle Details"
          >
            View Seller Details
          </button>
        </div>

        {/* Row 6: Location */}
        <div className="card-location-row">
          <i className="fa-solid fa-location-dot"></i>
          <span>{car.location}</span>
        </div>
      </div>
    </article>
  );
}
