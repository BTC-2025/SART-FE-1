'use client';

import React from 'react';
import { RENTAL_MASTER_CATEGORIES, ALL_RENTAL_VEHICLES, INDIAN_CITIES, MONTH_NAMES, MONTH_SHORT, RentalMasterCategory } from './rentalData';

interface RentalStepOneProps {
  pickup: string;
  setPickup: (v: string) => void;
  dropoff: string;
  setDropoff: (v: string) => void;
  returnToSameLocation: boolean;
  setReturnToSameLocation: (v: boolean) => void;
  showLocationList: boolean;
  setShowLocationList: (v: boolean) => void;
  showDropoffList: boolean;
  setShowDropoffList: (v: boolean) => void;
  pickupDate: string;
  setPickupDate?: (v: string) => void;
  pickupTime: string;
  setPickupTime?: (v: string) => void;
  showPickupCalendar: boolean;
  setShowPickupCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  pickupCalMonth: number;
  setPickupCalMonth: React.Dispatch<React.SetStateAction<number>>;
  pickupCalYear: number;
  setPickupCalYear: React.Dispatch<React.SetStateAction<number>>;
  dropoffDate: string;
  setDropoffDate: (v: string) => void;
  dropoffTime: string;
  setDropoffTime: (v: string) => void;
  showDropoffCalendar: boolean;
  setShowDropoffCalendar: React.Dispatch<React.SetStateAction<boolean>>;
  dropoffCalMonth: number;
  setDropoffCalMonth: React.Dispatch<React.SetStateAction<number>>;
  dropoffCalYear: number;
  setDropoffCalYear: React.Dispatch<React.SetStateAction<number>>;
  selectedMasterId: string;
  setSelectedMasterId: (v: string) => void;
  selectedRentalVehicleId: string;
  setSelectedRentalVehicleId: (v: string) => void;
  showVehicleDropdown: boolean;
  setShowVehicleDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  pickupBoxRef: React.RefObject<HTMLDivElement | null>;
  dropoffBoxRef: React.RefObject<HTMLDivElement | null>;
  pickupCalRef: React.RefObject<HTMLDivElement | null>;
  dropoffCalRef: React.RefObject<HTMLDivElement | null>;
  vehicleBoxRef: React.RefObject<HTMLDivElement | null>;
  handleSelectPickupDate: (day: number) => void;
  handleSelectDropoffDate: (day: number) => void;
  setCustomDays: React.Dispatch<React.SetStateAction<number>>;
  setDurationPlan: (plan: '1day' | '3days' | '1week' | '2weeks' | '1month' | 'custom') => void;
  handleSelectMaster: (master: RentalMasterCategory) => void;
  setSelectedVehicleId: (id: string) => void;
  handleClose: () => void;
}

export default function RentalStepOne({
  pickup,
  setPickup,
  dropoff,
  setDropoff,
  returnToSameLocation,
  setReturnToSameLocation,
  showLocationList,
  setShowLocationList,
  showDropoffList,
  setShowDropoffList,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  showPickupCalendar,
  setShowPickupCalendar,
  pickupCalMonth,
  setPickupCalMonth,
  pickupCalYear,
  setPickupCalYear,
  dropoffDate,
  setDropoffDate,
  dropoffTime,
  setDropoffTime,
  showDropoffCalendar,
  setShowDropoffCalendar,
  dropoffCalMonth,
  setDropoffCalMonth,
  dropoffCalYear,
  setDropoffCalYear,
  selectedMasterId,
  setSelectedMasterId,
  selectedRentalVehicleId,
  setSelectedRentalVehicleId,
  showVehicleDropdown,
  setShowVehicleDropdown,
  pickupBoxRef,
  dropoffBoxRef,
  pickupCalRef,
  dropoffCalRef,
  vehicleBoxRef,
  handleSelectPickupDate,
  handleSelectDropoffDate,
  setCustomDays,
  setDurationPlan,
  handleSelectMaster,
  setSelectedVehicleId,
  handleClose,
}: RentalStepOneProps) {
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  return (
    <div >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            <i className="fa-solid fa-key"></i>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Self-driveacross India</h2>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Cars, Bikes, Scooters, Bus, Trucks, Ships & Charters</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', fontSize: '15px' }}
          title="Close"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* Scrollable Container */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Unified Horizontal Search Card with Increased Width */}
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            background: '#ffffff',
            position: 'relative'
          }}>
            {/* 1. PICKUP AND RETURN LOCATION */}
            <div
              style={{ flex: 1.2, minWidth: 0, padding: '10px 16px', borderRight: '1px solid #e2e8f0', position: 'relative', display: 'flex', flexDirection: 'column' }}
              ref={pickupBoxRef as any}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'capitalize' }}>
                  Pickup location
                </span>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '10.5px', fontWeight: 700, color: '#0284c7' }} title="Toggle same return location">
                  <input
                    type="checkbox"
                    checked={returnToSameLocation}
                    onChange={(e) => {
                      setReturnToSameLocation(e.target.checked);
                      if (e.target.checked) setDropoff(pickup);
                    }}
                    style={{ width: '12px', height: '12px', accentColor: '#0284c7', cursor: 'pointer' }}
                  />
                  <span>Return to the same location</span>
                </label>
              </div>

              <input
                type="text"
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value);
                  if (returnToSameLocation) setDropoff(e.target.value);
                  setShowLocationList(true);
                }}
                onFocus={() => setShowLocationList(true)}
                placeholder="Truro, Bengaluru, Chennai..."
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '15px', fontWeight: 800, color: '#0f172a', padding: 0, width: '100%' }}
              />

              {!returnToSameLocation && (
                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #cbd5e1' }} ref={dropoffBoxRef as any}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '2px' }}>Different Return Location:</span>
                  <input
                    type="text"
                    value={dropoff}
                    onChange={(e) => {
                      setDropoff(e.target.value);
                      setShowDropoffList(true);
                    }}
                    onFocus={() => setShowDropoffList(true)}
                    placeholder="Drop-off location"
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', fontWeight: 700, color: '#0f172a', width: '100%' }}
                  />
                </div>
              )}

              {/* Suggestions popup */}
              {showLocationList && (
                <div className="hero-suggestions-popup" style={{ position: 'absolute', top: '100%', left: 0, width: '280px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden', marginTop: '6px' }}>
                  <div style={{ padding: '8px 12px', background: '#f8fafc', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Select Location</div>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {['Truro', ...INDIAN_CITIES].filter(c => !pickup || c.toLowerCase().includes(pickup.toLowerCase())).map(city => (
                      <div
                        key={`p-city-${city}`}
                        onClick={() => {
                          setPickup(city);
                          if (returnToSameLocation) setDropoff(city);
                          setShowLocationList(false);
                        }}
                        style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#1e293b', borderBottom: '1px solid #f1f5f9' }}
                      >
                        <i className="fa-solid fa-location-dot" style={{ color: '#0284c7', fontSize: '12px' }}></i>
                        <span>{city}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. PICKUP DATE AND TIME */}
            <div
              style={{ flex: 1.1, minWidth: 0, padding: '10px 16px', borderRight: '1px solid #e2e8f0', position: 'relative', display: 'flex', flexDirection: 'column' }}
              ref={pickupCalRef as any}
            >
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'capitalize', marginBottom: '3px' }}>
                Pickup date and time
              </span>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPickupCalendar(prev => !prev);
                  setShowDropoffCalendar(false);
                  setShowVehicleDropdown(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                  background: '#f0fdf4',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                title="Click to select pick-up date & time"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                  <i className="fa-regular fa-calendar-check" style={{ color: '#16a34a', fontSize: '12px' }}></i>
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#15803d', whiteSpace: 'nowrap' }}>{pickupDate}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#166534' }}>Time: {pickupTime}</span>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: '#16a34a' }}></i>
              </div>

              {showPickupCalendar && (
                <div
                  className="hero-calendar-popup"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    background: '#ffffff',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.35)',
                    padding: '16px',
                    zIndex: 1050,
                    width: '320px',
                    maxWidth: '90vw',
                    animation: 'fbFadeInDown 0.18s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <button
                      type="button"
                      className="hero-cal-nav-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (pickupCalMonth === 0) {
                          setPickupCalMonth(11);
                          setPickupCalYear(y => y - 1);
                        } else {
                          setPickupCalMonth(m => m - 1);
                        }
                      }}
                      style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      {MONTH_NAMES[pickupCalMonth]} {pickupCalYear}
                    </span>
                    <button
                      type="button"
                      className="hero-cal-nav-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (pickupCalMonth === 11) {
                          setPickupCalMonth(0);
                          setPickupCalYear(y => y + 1);
                        } else {
                          setPickupCalMonth(m => m + 1);
                        }
                      }}
                      style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => (
                      <span key={w} style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>{w}</span>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {Array.from({ length: getFirstDayOfMonth(pickupCalYear, pickupCalMonth) }).map((_, i) => (
                      <div key={`pcal-empty-${i}`}></div>
                    ))}
                    {Array.from({ length: getDaysInMonth(pickupCalYear, pickupCalMonth) }).map((_, i) => {
                      const dayNum = i + 1;
                      const dayFormatted = String(dayNum).padStart(2, '0');
                      const isSelected = pickupDate.includes(`${dayFormatted} ${MONTH_SHORT[pickupCalMonth]}`);

                      return (
                        <button
                          key={`pcal-day-${dayNum}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPickupDate(dayNum);
                          }}
                          style={{
                            height: '32px',
                            border: 'none',
                            borderRadius: '8px',
                            background: isSelected ? '#16a34a' : 'transparent',
                            color: isSelected ? '#ffffff' : '#1e293b',
                            fontWeight: isSelected ? 800 : 600,
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Pick up Time</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (setPickupDate) setPickupDate('Sat, 17 Oct');
                          if (setPickupTime) setPickupTime('10:00 AM');
                          setShowPickupCalendar(false);
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#16a34a', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Reset / Clear
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '06:00 PM', '09:00 PM'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (setPickupTime) setPickupTime(t);
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: pickupTime === t ? '1.5px solid #16a34a' : '1px solid #e2e8f0',
                            background: pickupTime === t ? '#f0fdf4' : '#ffffff',
                            color: pickupTime === t ? '#15803d' : '#475569',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. RETURN DATE AND TIME */}
            <div
              style={{ flex: 1.15, minWidth: 0, padding: '10px 16px', borderRight: '1px solid #e2e8f0', position: 'relative', display: 'flex', flexDirection: 'column' }}
              ref={dropoffCalRef as any}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'capitalize' }}>
                  Return date and time
                </span>
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropoffCalendar(prev => !prev);
                  setShowPickupCalendar(false);
                  setShowVehicleDropdown(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                  background: '#fef2f2',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                title="Click to select return date, duration or open calendar"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                  <i className="fa-regular fa-calendar-xmark" style={{ color: '#dc2626', fontSize: '12px' }}></i>
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#b91c1c', whiteSpace: 'nowrap' }}>{dropoffDate}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#991b1b' }}>Time: {dropoffTime}</span>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px', color: '#dc2626' }}></i>
              </div>

              {showDropoffCalendar && (
                <div
                  className="hero-calendar-popup"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    background: '#ffffff',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.35)',
                    padding: '16px',
                    zIndex: 1050,
                    width: '330px',
                    maxWidth: '90vw',
                    animation: 'fbFadeInDown 0.18s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569' }}>
                        Quick Return Duration:
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropoffDate('Sun, 18 Oct');
                          setDropoffTime('10:00 AM');
                          setCustomDays(1);
                          setDurationPlan('1day');
                          setShowDropoffCalendar(false);
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#dc2626', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Reset / Clear
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {[
                        { label: '1 Day', days: 1, text: 'Sun, 18 Oct' },
                        { label: '1 Week', days: 7, text: 'Sat, 24 Oct' },
                        { label: '1 Month', days: 30, text: 'Mon, 16 Nov' }
                      ].map(preset => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropoffDate(preset.text);
                            setCustomDays(preset.days);
                            setDurationPlan(preset.days === 1 ? '1day' : preset.days === 7 ? '1week' : '1month');
                          }}
                          style={{
                            padding: '5px 8px',
                            borderRadius: '6px',
                            border: dropoffDate === preset.text ? '1.5px solid #dc2626' : '1px solid #cbd5e1',
                            background: dropoffDate === preset.text ? '#fef2f2' : '#f8fafc',
                            color: dropoffDate === preset.text ? '#b91c1c' : '#334155',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <button
                      type="button"
                      className="hero-cal-nav-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (dropoffCalMonth === 0) {
                          setDropoffCalMonth(11);
                          setDropoffCalYear(y => y - 1);
                        } else {
                          setDropoffCalMonth(m => m - 1);
                        }
                      }}
                      style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                      {MONTH_NAMES[dropoffCalMonth]} {dropoffCalYear}
                    </span>
                    <button
                      type="button"
                      className="hero-cal-nav-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (dropoffCalMonth === 11) {
                          setDropoffCalMonth(0);
                          setDropoffCalYear(y => y + 1);
                        } else {
                          setDropoffCalMonth(m => m + 1);
                        }
                      }}
                      style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '6px' }}>
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => (
                      <span key={w} style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8' }}>{w}</span>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {Array.from({ length: getFirstDayOfMonth(dropoffCalYear, dropoffCalMonth) }).map((_, i) => (
                      <div key={`dcal-empty-${i}`}></div>
                    ))}
                    {Array.from({ length: getDaysInMonth(dropoffCalYear, dropoffCalMonth) }).map((_, i) => {
                      const dayNum = i + 1;
                      const dayFormatted = String(dayNum).padStart(2, '0');
                      const isSelected = dropoffDate.includes(`${dayFormatted} ${MONTH_SHORT[dropoffCalMonth]}`);

                      return (
                        <button
                          key={`dcal-day-${dayNum}`}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectDropoffDate(dayNum);
                          }}
                          style={{
                            height: '30px',
                            border: 'none',
                            borderRadius: '6px',
                            background: isSelected ? '#dc2626' : 'transparent',
                            color: isSelected ? '#ffffff' : '#1e293b',
                            fontWeight: isSelected ? 800 : 600,
                            fontSize: '11.5px',
                            cursor: 'pointer'
                          }}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' }}>Return Time</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '06:00 PM', '09:00 PM'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropoffTime(t);
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: dropoffTime === t ? '1.5px solid #dc2626' : '1px solid #e2e8f0',
                            background: dropoffTime === t ? '#fef2f2' : '#ffffff',
                            color: dropoffTime === t ? '#b91c1c' : '#475569',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SELECT VEHICLE CATEGORY DROPDOWN */}
            <div
              style={{ flex: 1.4, minWidth: 0, padding: '10px 16px', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column' }}
              ref={vehicleBoxRef as any}
              onClick={() => {
                setShowVehicleDropdown(prev => !prev);
                setShowPickupCalendar(false);
                setShowDropoffCalendar(false);
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'capitalize', marginBottom: '3px' }}>Select Category & Fleet</span>
              {(() => {
                const selMaster = RENTAL_MASTER_CATEGORIES.find(m => m.id === selectedMasterId) || RENTAL_MASTER_CATEGORIES[1];
                return (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: selMaster.color + '15', color: selMaster.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                        <i className={`fa-solid ${selMaster.icon}`}></i>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {selMaster.name}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                          {selMaster.type} Rental
                        </span>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-down" style={{ fontSize: '11px', color: '#64748b' }}></i>
                  </div>
                );
              })()}

              {showVehicleDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '360px',
                    maxWidth: '94vw',
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.25)',
                    padding: '18px',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    animation: 'fbFadeInDown 0.18s ease'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>Select Vehicle Category</h4>
                      <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Choose preferred vehicle category</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowVehicleDropdown(false)}
                      style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', fontSize: '12px' }}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
                    {RENTAL_MASTER_CATEGORIES.map((m) => {
                      const isSelected = selectedMasterId === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => {
                            setSelectedMasterId(m.id);
                            if (m.list.length > 0) {
                              setSelectedRentalVehicleId(m.list[0].id);
                            }
                            setShowVehicleDropdown(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            borderRadius: '14px',
                            border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                            background: isSelected ? '#f0f9ff' : '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = '#ffffff';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                background: m.color + '15',
                                color: m.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                flexShrink: 0
                              }}
                            >
                              <i className={`fa-solid ${m.icon}`}></i>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{m.name}</span>
                              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{m.type} Rental Fleet</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isSelected ? '#0284c7' : '#0284c7', fontSize: '12.5px', fontWeight: 800, flexShrink: 0 }}>
                            <span>Select</span>
                            <i className="fa-solid fa-chevron-right" style={{ fontSize: '11px' }}></i>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Search CTA Button */}
            <button
              type="button"
              onClick={() => {
                const selectedVeh = ALL_RENTAL_VEHICLES.find(v => v.id === selectedRentalVehicleId) || ALL_RENTAL_VEHICLES[1];
                let targetMaster = RENTAL_MASTER_CATEGORIES.find(m => m.list.some(v => v.id === selectedVeh.id));
                if (!targetMaster) targetMaster = RENTAL_MASTER_CATEGORIES[1];
                handleSelectMaster(targetMaster);
                setSelectedVehicleId(selectedVeh.id);
              }}
              style={{
                background: '#f25a1b',
                border: 'none',
                borderRadius: '0 11px 11px 0',
                padding: '0 28px',
                height: '66px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 800,
                flexShrink: 0,
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e04c10'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f25a1b'}
            >
              <span>Search</span>
              <i className="fa-solid fa-chevron-right" style={{ fontSize: '13px' }}></i>
            </button>
          </div>
        </div>

        {/* Popular Travel & Flight Destinations matching Image 1 */}
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              {
                city: 'Tiruchirappalli',
                duration: '1h 5m, direct',
                dates: 'Sat 14/11 ▸ Sat 21/11',
                price: '₹ 9,676',
                image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=500&q=80'
              },
              {
                city: 'Coimbatore',
                duration: '1h 5m, direct',
                dates: 'Sun 22/11 ▸ Sun 29/11',
                price: '₹ 10,150',
                image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80'
              },
              {
                city: 'Madurai',
                duration: '1h 5m, direct',
                dates: 'Sat 14/11 ▸ Sat 21/11',
                price: '₹ 11,004',
                image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=500&q=80'
              },
              {
                city: 'Vijayawada',
                duration: '1h 25m, direct',
                dates: 'Sat 14/11 ▸ Sat 21/11',
                price: '₹ 11,193',
                image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=500&q=80'
              }
            ].map((dest) => (
              <div
                key={dest.city}
                onClick={() => {
                  setDropoff(dest.city);
                  const selectedVeh = ALL_RENTAL_VEHICLES.find(v => v.id === selectedRentalVehicleId) || ALL_RENTAL_VEHICLES[1];
                  let targetMaster = RENTAL_MASTER_CATEGORIES.find(m => m.list.some(v => v.id === selectedVeh.id)) || RENTAL_MASTER_CATEGORIES[1];
                  handleSelectMaster(targetMaster);
                  setSelectedVehicleId(selectedVeh.id);
                }}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ width: '100%', height: '140px', overflow: 'hidden' }}>
                  <img
                    src={dest.image}
                    alt={dest.city}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                    {dest.city}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                    {dest.duration}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                    {dest.dates}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>from </span>
                    {dest.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
