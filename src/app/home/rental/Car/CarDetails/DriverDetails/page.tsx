'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import './page.css';
import { ALL_RENTAL_VEHICLES, RentalVehicle } from '@/components/rental/rentalData';

function DriverDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vehicleId = searchParams.get('id') || searchParams.get('vehicleId') || 'r-verna';
  const pickupParam = searchParams.get('pickup') || searchParams.get('origin') || 'Katpadi';

  const [vehicle, setVehicle] = useState<RentalVehicle | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerAge, setCustomerAge] = useState('26');
  const [customerPhone, setCustomerPhone] = useState('9876543210');
  const [docType, setDocType] = useState<'dl' | 'aadhaar' | 'pan'>('dl');
  const [docNumber, setDocNumber] = useState('DL-04-2023-0091823');
  const [uploadedDocName, setUploadedDocName] = useState('driving_license_front.jpg');

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      let found: any = ALL_RENTAL_VEHICLES.find(
        (v) => v.id.toLowerCase() === vehicleId.toLowerCase() || v.name.toLowerCase().includes(vehicleId.toLowerCase())
      );

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
                city: apiV.city || 'Katpadi',
                location: apiV.location || 'Katpadi, Vellore',
                isAvailable: true
              };
            }
          }
        } catch (e) { }
      }

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
              city: localV.city || 'Katpadi',
              location: localV.location || 'Katpadi, Vellore',
              isAvailable: true
            };
          }
        } catch (e) { }
      }

      if (!found) {
        found = ALL_RENTAL_VEHICLES.find((v) => v.id === 'r-verna') || {
          id: '',
          name: '',
          icon: '',
          color: '#1e293b',
          price: 1800,
          category: '',
          seats: '',
          transmission: '',
          fuel: '',
          year: 2024,
          kms: '',
          distance: '',
          image: '',
          badge: '',
          engine: '',
          city: '',
          isAvailable: true
        };
      }
      setVehicle(found);
    };

    fetchVehicleDetails();
  }, [vehicleId]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      id: vehicle?.id || 'r-verna',
      pickup: pickupParam,
      name: customerName,
      age: customerAge,
      phone: customerPhone,
      docType,
      docNumber,
      docName: uploadedDocName
    }).toString();

    router.push(`/home/rental/Car/CarDetails/DriverDetails/ReviewDetails?${query}`);
  };

  return (
    <div style={{ maxWidth: '1260px', margin: '30px auto', padding: '0 20px 60px' }}>
      {/* Container */}
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 40px rgba(15, 23, 42, 0.06)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => router.back()}
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
                color: '#1e293b'
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                User Details
              </h1>
              <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                Required for vehicle handover • {vehicle?.name || ''}
              </p>
            </div>
          </div>

          <span style={{
            fontSize: '11px',
            background: '#dcfce7',
            color: '#166534',
            padding: '4px 10px',
            borderRadius: '12px',
            fontWeight: 700
          }}>
            Step 2 of 3
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleNext} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
              Full Name (As per Govt ID)
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter full legal name"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Age (Years - 18+ Required)
              </label>
              <input
                type="number"
                min={18}
                max={85}
                required
                value={customerAge}
                onChange={(e) => setCustomerAge(e.target.value)}
                placeholder="26"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Mobile Phone Number
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter 10-digit mobile"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Document Selector */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
              Select Document for Verification
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
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
                    if (d.id === 'aadhaar') setDocNumber('XXXX-XXXX-4589');
                    if (d.id === 'pan') setDocNumber('ABCDE1234F');
                  }}
                  style={{
                    padding: '14px 10px',
                    borderRadius: '12px',
                    border: docType === d.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: docType === d.id ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <i className={`fa-solid ${d.icon}`} style={{ color: docType === d.id ? '#2563eb' : '#64748b', fontSize: '18px' }}></i>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: docType === d.id ? '#1e3a8a' : '#334155' }}>
                    {d.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
              {docType === 'dl' ? 'Driving License Number' : docType === 'aadhaar' ? 'Aadhaar Card Number' : 'PAN Card Number'}
            </label>
            <input
              type="text"
              required
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              placeholder="Enter document number"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Upload Box */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
              Upload Document Copy (Front & Back)
            </label>
            <div style={{
              border: '2px dashed #93c5fd',
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-file-shield" style={{ fontSize: '18px' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    Uploaded: {uploadedDocName}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    JPG, PNG, PDF up to 10MB • Verified
                  </div>
                </div>
              </div>

              <span style={{ color: '#16a34a', fontSize: '13px', fontWeight: 700 }}>
                <i className="fa-solid fa-circle-check"></i> Ready
              </span>
            </div>
          </div>

          {/* Notice */}
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '12px',
            color: '#92400e',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            lineHeight: 1.5
          }}>
            <i className="fa-solid fa-circle-info" style={{ marginTop: '2px', fontSize: '14px' }}></i>
            <span>
              <strong>Mandatory Original Copy Notice:</strong> When taking delivery of the vehicle, you must submit and physically verify the original physical copy of your Driving License / Aadhaar / PAN card to the vehicle owner or hub representative.
            </span>
          </div>

          {/* Action Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid #f1f5f9'
          }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Back
            </button>

            <button
              type="submit"
              style={{
                padding: '12px 32px',
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
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DriverDetailsPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <Navbar />
      <SubNavbar />
      <main style={{ flex: 1, paddingTop: '20px' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading...</div>}>
          <DriverDetailsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

