'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import './page.css';
import { ALL_RENTAL_VEHICLES, RentalVehicle } from '@/components/rental/rentalData';

function CarDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vehicleId = searchParams.get('id') || searchParams.get('vehicleId') || 'r-verna';
  const pickupParam = searchParams.get('pickup') || searchParams.get('origin') || 'Katpadi';

  const [vehicle, setVehicle] = useState<RentalVehicle | null>(null);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      // 1. Check in ALL_RENTAL_VEHICLES first
      let found: any = ALL_RENTAL_VEHICLES.find(
        (v) => v.id.toLowerCase() === vehicleId.toLowerCase() || v.name.toLowerCase().includes(vehicleId.toLowerCase())
      );

      // 2. Query Backend API (5000 and 5001)
      if (!found || vehicleId.startsWith('VH-')) {
        try {
          let res = await fetch(`http://localhost:5000/api/rental/vehicles/${vehicleId}`).catch(() => null);
          if (!res || !res.ok) {
            res = await fetch(`http://localhost:5000/api/rental/vehicles/${vehicleId}`).catch(() => null);
          }
          if (!res || !res.ok) {
            res = await fetch(`http://localhost:5000/api/business/vehicles/${vehicleId}`).catch(() => null);
          }
          if (res && res.ok) {
            const json = await res.json();
            if (json && json.success && json.data) {
              const apiV = json.data;
              found = {
                id: apiV.id,
                name: apiV.name,
                icon: 'fa-car-rear',
                color: '#1e293b',
                price: Number(apiV.dailyRate || apiV.price || 1800),
                hourlyRate: Number(apiV.hourlyRate || 150),
                category: apiV.category || 'Sedan',
                seats: apiV.seats || '5 Seats',
                transmission: apiV.transmission || 'Manual',
                fuel: apiV.fuel || 'Petrol',
                year: Number(apiV.year || 2024),
                kms: apiV.kms || '500 Kms Included',
                distance: apiV.distance || '1.2 km from Location',
                image: (apiV.images && apiV.images[0]) || apiV.image || '/images/cab_sedan.png',
                images: apiV.images && apiV.images.length > 0 ? apiV.images : [apiV.image || '/images/cab_sedan.png'],
                badge: apiV.badge || 'Available',
                engine: apiV.engine || '1493 cc',
                vehicleColor: apiV.color || 'Phantom Black',
                city: apiV.city || 'Katpadi',
                location: apiV.location || 'Katpadi, Vellore',
                isAvailable: true
              };
            }
          }
        } catch (e) { }
      }

      // 3. Fallback to local storage sart_business_fleet
      if (!found) {
        try {
          const storedFleet = JSON.parse(localStorage.getItem('sart_business_fleet') || '[]');
          const localV = storedFleet.find((v: any) => v.id.toLowerCase() === vehicleId.toLowerCase() || v.plate?.toLowerCase() === vehicleId.toLowerCase());
          if (localV) {
            found = {
              id: localV.id,
              name: localV.name,
              icon: 'fa-car-rear',
              color: '#1e293b',
              price: Number(localV.dailyRate || localV.price || 1800),
              hourlyRate: Number(localV.hourlyRate || 150),
              category: localV.category || 'Sedan',
              seats: localV.seats || '5 Seats',
              transmission: localV.transmission || 'Manual',
              fuel: localV.fuel || 'Petrol',
              year: Number(localV.year || 2024),
              kms: localV.kms || '500 Kms Included',
              distance: localV.distance || '1.2 km from Location',
              image: (localV.images && localV.images[0]) || localV.image || '/images/cab_sedan.png',
              images: localV.images && localV.images.length > 0 ? localV.images : [localV.image || '/images/cab_sedan.png'],
              badge: localV.badge || 'Available',
              engine: localV.engine || '1493 cc',
              vehicleColor: localV.color || 'Phantom Black',
              city: localV.city || 'Katpadi',
              location: localV.location || 'Katpadi, Vellore',
              isAvailable: true
            };
          }
        } catch (e) { }
      }

      // 4. Default fallback to Hyundai Verna
      if (!found) {
        found = ALL_RENTAL_VEHICLES.find((v) => v.id === 'r-verna') || {
          id: 'r-verna',
          name: 'Hyundai Verna',
          icon: 'fa-car-rear',
          color: '#1e293b',
          price: 2200,
          category: 'Sedan',
          seats: '5 Seats',
          transmission: 'Manual',
          fuel: 'Petrol',
          year: 2024,
          kms: '500 Kms Included',
          distance: '1.2 km from Katpadi',
          image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
          badge: 'Top Choice',
          engine: '1493 cc',
          vehicleColor: 'Phantom Black',
          city: 'Katpadi',
          location: 'Katpadi, Vellore',
          isAvailable: true
        };
      }

      setVehicle(found);
    };

    fetchVehicleDetails();
  }, [vehicleId]);

  if (!vehicle) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Loading vehicle details...</p>
      </div>
    );
  }

  const galleryList = (vehicle.images && vehicle.images.length > 0)
    ? vehicle.images
    : [
      vehicle.image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80'
    ];

  const engineVal = vehicle.engine || (vehicle.category?.toLowerCase().includes('bike') ? '350 cc' : '1493 cc');
  const colorVal = vehicle.vehicleColor || 'Phantom Black';
  const pickupLoc = pickupParam || vehicle.city || vehicle.location || 'Katpadi';

  const handleProceedToDriverDetails = () => {
    router.push(
      `/home/rental/Car/CarDetails/DriverDetails?id=${encodeURIComponent(vehicle.id)}&pickup=${encodeURIComponent(pickupLoc)}`
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div style={{ maxWidth: '980px', margin: '30px auto', padding: '0 20px 60px' }}>
      {/* Main Clean Card Container matching Image 1 */}
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 40px rgba(15, 23, 42, 0.06)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header Row with Title, Category pill and Close button */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.3px'
            }}>
              {vehicle.name}
            </h1>
            <span style={{
              background: '#e0f2fe',
              color: '#0284c7',
              borderRadius: '14px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 700
            }}>
              {vehicle.category || 'Sedan'}
            </span>
          </div>

          <button
            onClick={handleBack}
            type="button"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              fontSize: '15px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
            title="Back to cars"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Centered Vehicle Display with 360 Arc Slider & Gallery Thumbnails */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '20px',
            padding: '32px 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            {/* Centered Vehicle Graphic with Left & Right Next/Prev Arrows */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGalleryIdx(prev => (prev === 0 ? galleryList.length - 1 : prev - 1));
                }}
                style={{
                  position: 'absolute',
                  left: '-24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  fontSize: '15px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                title="Previous Image"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <img
                src={galleryList[selectedGalleryIdx] || vehicle.image}
                alt={vehicle.name}
                style={{
                  width: '500px',
                  height: '200px',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 14px 24px rgba(0, 0, 0, 0.12))',
                  transition: 'all 0.25s ease'
                }}
              />

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGalleryIdx(prev => (prev === galleryList.length - 1 ? 0 : prev + 1));
                }}
                style={{
                  position: 'absolute',
                  right: '-24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  fontSize: '15px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                title="Next Image"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>



            {/* Thumbnails Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {galleryList.slice(0, 5).map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedGalleryIdx(idx)}
                  style={{
                    width: '68px',
                    height: '52px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedGalleryIdx === idx ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    background: '#ffffff',
                    padding: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '7px' }}
                  />
                </div>
              ))}


            </div>
          </div>

          {/* Quick Specs Pill Row */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            fontSize: '13.5px',
            color: '#334155',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', fontWeight: 700 }}>
              <i className="fa-solid fa-location-dot" style={{ color: '#2563eb' }}></i>
              <span>{pickupLoc}</span>
            </div>
            <span style={{ color: '#cbd5e1' }}>•</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-users" style={{ color: '#2563eb' }}></i>
              <span>{vehicle.seats}</span>
            </div>
            <span style={{ color: '#cbd5e1' }}>•</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-gauge-high" style={{ color: '#2563eb' }}></i>
              <span>{engineVal}</span>
            </div>
            <span style={{ color: '#cbd5e1' }}>•</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-gas-pump" style={{ color: '#2563eb' }}></i>
              <span>{vehicle.fuel}</span>
            </div>
            <span style={{ color: '#cbd5e1' }}>•</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-wrench" style={{ color: '#2563eb' }}></i>
              <span>{vehicle.transmission}</span>
            </div>
          </div>

          {/* Vehicle Specifications & Details Card (Blue Icons) */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              fontWeight: 800,
              color: '#0f172a'
            }}>
              <i className="fa-solid fa-car" style={{ color: '#2563eb', fontSize: '15px' }}></i>
              <span>Vehicle Specifications & Details</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Engine', icon: 'fa-gauge-high', value: engineVal },
                { label: 'Fuel Type', icon: 'fa-gas-pump', value: vehicle.fuel },
                { label: 'Transmission', icon: 'fa-gear', value: vehicle.transmission },
                { label: 'Seating Capacity', icon: 'fa-users', value: vehicle.seats },
                { label: 'Color', icon: 'fa-palette', value: colorVal },
                { label: 'Distance from Hub', icon: 'fa-location-dot', value: vehicle.distance || `1.2 km from ${pickupLoc}` }
              ].map((spec, i, arr) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 6px',
                    borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '13.5px', fontWeight: 600 }}>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      background: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px'
                    }}>
                      <i className={`fa-solid ${spec.icon}`}></i>
                    </div>
                    <span>{spec.label}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Footer */}
        <div style={{
          padding: '18px 28px',
          borderTop: '1px solid #f1f5f9',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.3px' }}>
              ₹{vehicle.price?.toLocaleString() || '2,200'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              For 1 Day (₹{vehicle.price?.toLocaleString() || '2,200'}/day)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleBack}
              type="button"
              style={{
                padding: '11px 22px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
            <button
              onClick={handleProceedToDriverDetails}
              type="button"
              style={{
                padding: '11px 28px',
                borderRadius: '10px',
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
              }}
            >
              Proceed to Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarDetailsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar />
      <SubNavbar />
      <main style={{ flex: 1, paddingTop: '20px' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading...</div>}>
          <CarDetailsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

