'use client';

import React, { useState } from 'react';
import { DriverProfile } from './driverData';

interface DriverSelectionListProps {
  vehicleCategoryName: string;
  drivers: DriverProfile[];
  selectedDriver: DriverProfile | null;
  onSelectDriver: (driver: DriverProfile) => void;
  pricingPlan: 'km' | 'day' | 'week' | 'month';
  setPricingPlan: (plan: 'km' | 'day' | 'week' | 'month') => void;
  pickupLocation: string;
  onConfirmAndBook: (driver: DriverProfile) => void;
  onBackToForm: () => void;
}

export default function DriverSelectionList({
  vehicleCategoryName,
  drivers,
  selectedDriver,
  onSelectDriver,
  pricingPlan,
  setPricingPlan,
  pickupLocation,
  onConfirmAndBook,
  onBackToForm
}: DriverSelectionListProps) {
  const [filterResidency, setFilterResidency] = useState<'ALL' | 'LOCAL' | 'OTHER'>('ALL');

  const filteredDrivers = drivers.filter(d => {
    if (filterResidency === 'LOCAL') return d.isLocalResident;
    if (filterResidency === 'OTHER') return !d.isLocalResident;
    return true;
  });

  return (
    <div style={{ flex: 1, backgroundColor: '#f8fafc', overflowY: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Banner Navigation */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={onBackToForm}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                Select Verified Driver for {vehicleCategoryName}
              </h2>
              <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '12px', fontWeight: 800 }}>
                {filteredDrivers.length} Drivers Available
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Pickup: <strong>{pickupLocation || 'Your Location'}</strong> • Transparent rates by km, day, week & month.
            </p>
          </div>
        </div>

        {/* Pricing Plan Selector: Km, Day, Week, Month */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          {[
            { id: 'km' as const, label: 'Per Km Rate' },
            { id: 'day' as const, label: 'Per Day' },
            { id: 'week' as const, label: 'Per Week' },
            { id: 'month' as const, label: 'Per Month' }
          ].map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPricingPlan(p.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: pricingPlan === p.id ? '#059669' : 'transparent',
                color: pricingPlan === p.id ? '#ffffff' : '#334155',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs: All, Local, Other Regional */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL' as const, label: 'All Verified Drivers' },
          { id: 'LOCAL' as const, label: 'Near Pickup Location (Local Residents)' },
          { id: 'OTHER' as const, label: 'Other Regional / Outstation' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterResidency(tab.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: filterResidency === tab.id ? '1.5px solid #059669' : '1px solid #cbd5e1',
              background: filterResidency === tab.id ? '#ecfdf5' : '#ffffff',
              color: filterResidency === tab.id ? '#059669' : '#475569',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Drivers List in Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredDrivers.map(driver => {
          const isSelected = selectedDriver?.id === driver.id;

          let displayPrice = `₹${driver.ratePerDay}/day`;
          let displayPriceSubtitle = '8h Standard Day Rate';
          if (pricingPlan === 'km') {
            displayPrice = `₹${driver.ratePerKm}/km`;
            displayPriceSubtitle = 'Per Kilometer Rate';
          } else if (pricingPlan === 'week') {
            displayPrice = `₹${driver.ratePerWeek}/week`;
            displayPriceSubtitle = '7 Days Package';
          } else if (pricingPlan === 'month') {
            displayPrice = `₹${driver.ratePerMonth}/mo`;
            displayPriceSubtitle = '30 Days Monthly Retainer';
          }

          return (
            <div
              key={driver.id}
              onClick={() => onSelectDriver(driver)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 6px 20px rgba(5, 150, 105, 0.12)' : '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              {/* Left Column: Driver Image + Core Identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '0 0 32%', minWidth: '220px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={driver.image}
                    alt={driver.name}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: isSelected ? '3px solid #059669' : '2px solid #cbd5e1' }}
                  />
                  <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#059669', color: '#ffffff', fontSize: '9px', fontWeight: 900, padding: '2px 5px', borderRadius: '10px' }}>
                    ★ {driver.rating}
                  </span>
                </div>

                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>
                    {driver.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 700, marginTop: '2px' }}>
                    DL: <span style={{ color: '#059669', fontFamily: 'monospace' }}>{driver.licenseNumber}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                    Mobile: <strong>{driver.mobileNumber}</strong> • {driver.completedTrips}+ Safe Trips
                  </div>
                </div>
              </div>

              {/* Middle Column: Location Residency & Vehicles Known & Experience */}
              <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', padding: '0 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {driver.isLocalResident ? (
                    <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                      <i className="fa-solid fa-map-pin"></i> Near Location: {driver.locationArea} ({driver.locationDistance})
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                      <i className="fa-solid fa-globe"></i> Other Location: {driver.locationArea} ({driver.locationDistance})
                    </span>
                  )}
                  <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    {driver.experienceYears}+ Years Driving Experience
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>Known Vehicles:</span>
                  {driver.vehiclesKnown.map((veh, i) => (
                    <span key={i} style={{ background: '#f1f5f9', padding: '1px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#475569' }}>
                      {veh}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {driver.verifiedBadges.map((badge, bidx) => (
                    <span key={bidx} style={{ fontSize: '10.5px', color: '#15803d', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <i className="fa-solid fa-circle-check" style={{ fontSize: '10px' }}></i> {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Pricing & Booking Button */}
              <div style={{ flex: '0 0 20%', minWidth: '160px', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <div style={{ fontSize: '19px', fontWeight: 900, color: '#059669' }}>
                  {displayPrice}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  {displayPriceSubtitle}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDriver(driver);
                    onConfirmAndBook(driver);
                  }}
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
                    marginTop: '4px'
                  }}
                >
                  <span>Select & Book</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
