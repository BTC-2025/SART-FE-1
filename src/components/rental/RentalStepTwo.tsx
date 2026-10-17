'use client';

import React, { useState } from 'react';
import { RentalMasterCategory, RentalVehicle } from './rentalData';
import VehicleDetailModal from './VehicleDetailModal';

interface RentalStepTwoProps {
  activeMaster: RentalMasterCategory;
  pickup: string;
  pickupDate: string;
  dropoffDate: string;
  userLocationName: string;
  isLocating: boolean;
  setIsLocating: (v: boolean) => void;
  setUserLocationName: (v: string) => void;
  filterFuel: string;
  setFilterFuel: (v: string) => void;
  filterTransmission: string;
  setFilterTransmission: (v: string) => void;
  filterSeats: string;
  setFilterSeats: (v: string) => void;
  filterModelYear: string;
  setFilterModelYear: (v: string) => void;
  filterCategoryModel: string;
  setFilterCategoryModel: (v: string) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  priceMin: number;
  setPriceMin: (v: number) => void;
  priceMax: number;
  setPriceMax: (v: number) => void;
  durationPlan: '1day' | '3days' | '1week' | '2weeks' | '1month' | 'custom';
  setDurationPlan: (v: '1day' | '3days' | '1week' | '2weeks' | '1month' | 'custom') => void;
  customDays: number;
  setCustomDays: React.Dispatch<React.SetStateAction<number>>;
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  handleBackToFleet: () => void;
  handleClose: () => void;
  setStep: (step: 1 | 2 | 3) => void;
}

export default function RentalStepTwo({
  activeMaster,
  pickup,
  pickupDate,
  dropoffDate,
  userLocationName,
  isLocating,
  setIsLocating,
  setUserLocationName,
  filterFuel,
  setFilterFuel,
  filterTransmission,
  setFilterTransmission,
  filterSeats,
  setFilterSeats,
  filterModelYear,
  setFilterModelYear,
  filterCategoryModel,
  setFilterCategoryModel,
  sortBy,
  setSortBy,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  durationPlan,
  setDurationPlan,
  customDays,
  setCustomDays,
  selectedVehicleId,
  setSelectedVehicleId,
  handleBackToFleet,
  handleClose,
  setStep
}: RentalStepTwoProps) {
  const [previewVehicle, setPreviewVehicle] = useState<RentalVehicle | null>(null);
  let list = [...activeMaster.list];

  if (filterFuel !== 'ALL') {
    list = list.filter((v: any) => v.fuel === filterFuel);
  }

  if (filterTransmission !== 'ALL') {
    list = list.filter((v: any) => v.transmission === filterTransmission);
  }

  if (filterSeats !== 'ALL') {
    if (filterSeats === '2') list = list.filter((v: any) => v.seats?.includes('2'));
    else if (filterSeats === '5') list = list.filter((v: any) => v.seats?.includes('5'));
    else if (filterSeats === '7') list = list.filter((v: any) => v.seats?.includes('7'));
    else if (filterSeats === '12') list = list.filter((v: any) => v.seats?.includes('12') || v.seats?.includes('16') || v.seats?.includes('24'));
  }

  if (filterCategoryModel !== 'ALL') {
    list = list.filter((v: any) => v.name.toLowerCase().includes(filterCategoryModel.toLowerCase()));
  }

  if (filterModelYear !== 'ALL') {
    const currentYr = 2026;
    if (filterModelYear === 'Under 3 years') {
      list = list.filter((v: any) => (currentYr - (v.year || 2023)) <= 3);
    } else if (filterModelYear === 'Under 5 years') {
      list = list.filter((v: any) => (currentYr - (v.year || 2023)) <= 5);
    } else if (filterModelYear === 'Under 7 years') {
      list = list.filter((v: any) => (currentYr - (v.year || 2023)) <= 7);
    }
  }

  // Price adjustment filter
  if (priceMax > 0) {
    list = list.filter((v: any) => v.price >= priceMin && v.price <= priceMax);
  }

  if (sortBy === 'price_low') {
    list.sort((a: any, b: any) => a.price - b.price);
  } else if (sortBy === 'price_high') {
    list.sort((a: any, b: any) => b.price - a.price);
  } else if (sortBy === 'newest') {
    list.sort((a: any, b: any) => (b.year || 2023) - (a.year || 2023));
  }

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

  return (
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

      {/* Main Catalog Layout */}
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
                setPriceMax(15000);
              }}
              style={{ background: 'transparent', border: 'none', color: '#0284c7', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
            >
              Reset All
            </button>
          </div>

          {/* Rental Duration Plan Selector */}
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
                    onClick={() => setCustomDays((d: number) => Math.max(1, d - 1))}
                    style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 800 }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', minWidth: '20px', textAlign: 'center' }}>
                    {customDays}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCustomDays((d: number) => d + 1)}
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

          {/* Popular Models */}
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '8px' }}>Popular Models</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[
                { id: 'ALL', name: 'All Models', count: '10+' },
                { id: 'Swift', name: 'Maruti Swift', count: 'Only 1 left', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=150&q=80' },
                { id: 'i20', name: 'Hyundai i20', count: 'Only 1 left', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUWCH0raA0r-PrGJIFZKMBTP7HegtJSoCQ4N8FWQktwg&s' },
                { id: 'Fronx', name: 'Maruti Fronx', count: 'Only 1 left', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=150&q=80' },
                { id: 'Verna', name: 'Hyundai Verna', count: 'Only 1 left', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUWCH0raA0r-PrGJIFZKMBTP7HegtJSoCQ4N8FWQktwg&s' },
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

          {/* Price Range Adjustment */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-indian-rupee-sign" style={{ color: '#0284c7' }}></i> Daily Price Limit
              </span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0284c7' }}>
                Up to ₹{priceMax}
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={15000}
              step={100}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
              <span>₹300/day</span>
              <span>₹15,000/day</span>
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
                { id: '2', label: '2 Seats (Bikes)' },
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

        {/* Right Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

          {list.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
              <i className="fa-solid fa-car-side" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '12px' }}></i>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>No vehicles match these filters</h4>
              <p style={{ margin: 0, fontSize: '13px' }}>Try clearing some filters or changing your fuel/transmission selection.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {list.map((v: RentalVehicle) => {
                const totalPrice = v.price * totalDays;
                const isSelected = selectedVehicleId === v.id;

                return (
                  <div
                    key={v.id}
                    onClick={() => setPreviewVehicle(v)}
                    style={{
                      background: '#ffffff',
                      border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(15, 23, 42, 0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.05)'; }}
                  >
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

                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                          {v.name}
                        </h4>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                          {v.category} • Year {v.year || 2023}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <i className="fa-solid fa-gas-pump" style={{ fontSize: '10px', color: '#0284c7' }}></i> {v.fuel || 'Petrol'}
                        </span>
                        <span style={{ fontSize: '11px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <i className="fa-solid fa-gear" style={{ fontSize: '10px', color: '#0284c7' }}></i> {v.transmission || 'Manual'}
                        </span>
                      </div>

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

                      <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fa-solid fa-house" style={{ color: '#94a3b8', fontSize: '10px' }}></i>
                        <span>Doorstep Delivery available (Up to 4 km)</span>
                      </div>

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
                          onClick={(e) => {
                            e.stopPropagation();
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
          )}
        </div>
      </div>

      {/* Vehicle Specification Details Modal (Image 2) */}
      <VehicleDetailModal
        vehicle={previewVehicle}
        isOpen={Boolean(previewVehicle)}
        onClose={() => setPreviewVehicle(null)}
        onBookNow={(veh) => {
          setSelectedVehicleId(veh.id);
          setStep(3);
        }}
        totalDays={totalDays}
        durationLabel={durationLabel}
        pickupLocation={pickup}
      />
    </div>
  );
}
