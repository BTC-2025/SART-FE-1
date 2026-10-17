'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ParkingSpot, VehicleTypeOption } from './parkingData';

const ParkingMapClient = dynamic(() => import('../ParkingMapClient'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#e2e8f0', color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
      <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Loading Live Parking Map...
    </div>
  )
});

interface ParkingStepTwoProps {
  city: string;
  selectedVehicleObj: VehicleTypeOption;
  vehicleNumber: string;
  filterTab: 'recommended' | 'cheapest' | 'closest';
  setFilterTab: (t: 'recommended' | 'cheapest' | 'closest') => void;
  selectedSpot: ParkingSpot;
  setSelectedSpot: (s: ParkingSpot) => void;
  spotsList: ParkingSpot[];
  userCoords: [number, number];
  setStep: (step: 1 | 2 | 3 | 4) => void;
}

export default function ParkingStepTwo({
  city,
  selectedVehicleObj,
  vehicleNumber,
  filterTab,
  setFilterTab,
  selectedSpot,
  setSelectedSpot,
  spotsList,
  userCoords,
  setStep
}: ParkingStepTwoProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            type="button"
            onClick={() => setStep(1)}
            style={{
              border: 'none',
              background: '#f1f5f9',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#334155',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fa-solid fa-arrow-left"></i> Edit Vehicle / City
          </button>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800 }}>Departure hub / City</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
              <span>{city} Airport & Commercial Hubs</span>
              <i className="fa-solid fa-chevron-down" style={{ fontSize: '11px', color: '#94a3b8' }}></i>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800 }}>From</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Today at 10:42 AM</span>
            </div>
            <i className="fa-solid fa-arrow-right" style={{ color: '#cbd5e1', fontSize: '12px' }}></i>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 800 }}>Until</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Today at 12:53 PM</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 14px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <i className={`fa-solid ${selectedVehicleObj.icon}`} style={{ color: '#059669' }}></i>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{selectedVehicleObj.label}</span>
          {vehicleNumber && (
            <span style={{ fontSize: '12px', color: '#64748b', borderLeft: '1px solid #cbd5e1', paddingLeft: '8px' }}>
              No: {vehicleNumber}
            </span>
          )}
        </div>
      </div>

      {/* Split Screen Container: LEFT SIDE WIDER (~63%), RIGHT SIDE MAP (~37%) */}
      <div style={{ flex: 1, display: 'flex', height: '100%', overflow: 'hidden' }}>
        {/* LEFT COLUMN: WIDER LIST OF PLACES */}
        <div
          style={{
            flex: '1 1 63%',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            padding: '20px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {(['recommended', 'cheapest', 'closest'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterTab(tab)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '6px 0',
                    fontSize: '15px',
                    fontWeight: filterTab === tab ? 900 : 600,
                    color: filterTab === tab ? '#059669' : '#64748b',
                    borderBottom: filterTab === tab ? '2.5px solid #059669' : 'none',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              type="button"
              style={{
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <i className="fa-solid fa-sliders"></i> Filters
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {spotsList.map((spot) => {
              const isSelected = selectedSpot.id === spot.id;
              return (
                <div
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                    boxShadow: isSelected ? '0 10px 25px -5px rgba(5, 150, 105, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                    padding: '18px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    gap: '18px',
                    position: 'relative'
                  }}
                >
                  <div style={{ width: '110px', height: '100px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    <img
                      src={spot.image}
                      alt={spot.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(15, 23, 42, 0.75)', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px' }}>
                      {spot.availableSlots} Open
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                          {spot.name}
                        </h4>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          Hosted by {spot.host}
                        </span>
                      </div>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px' }}
                        onClick={(e) => { e.stopPropagation(); alert('Saved to favorites'); }}
                      >
                        <i className="fa-regular fa-bookmark"></i>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0' }}>
                      {spot.features.slice(0, 3).map((f, fi) => (
                        <span
                          key={fi}
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <i className="fa-solid fa-check" style={{ fontSize: '9px', color: '#059669' }}></i> {f}
                        </span>
                      ))}
                    </div>

                    <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-circle-check" style={{ fontSize: '11px' }}></i>
                      Cancel up to 24h before start (excl. fees)
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f8fafc' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: '#64748b' }}>
                        <span><i className="fa-solid fa-person-walking"></i> {spot.distance}</span>
                        <span style={{ fontWeight: 800, color: '#0f172a' }}>★ {spot.rating} ({spot.reviewsCount})</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Reserve for</span>
                          <span style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>{spot.priceDisplay}</span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSpot(spot);
                            setStep(3);
                          }}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: '#059669',
                            color: '#ffffff',
                            fontSize: '13px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(5, 150, 105, 0.25)'
                          }}
                        >
                          Select Slot <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px' }}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: MAP CONTAINER (~37%) */}
        <div
          style={{
            flex: '1 1 37%',
            position: 'relative',
            backgroundColor: '#e2e8f0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
            <ParkingMapClient
              vehicleIconClass={selectedVehicleObj.icon}
              vehicleTitle={selectedVehicleObj.label}
              searchQuery={city}
              isSearched={true}
              spots={spotsList}
              selectedSpotId={selectedSpot.id}
              onSelectSpot={(s) => setSelectedSpot(s)}
              userCoords={userCoords}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              zIndex: 1000,
              background: '#ffffff',
              padding: '8px 14px',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#0f172a'
            }}
          >
            <i className="fa-solid fa-layer-group" style={{ color: '#059669' }}></i>
            Interactive Map • Tap pin to view rate
          </div>
        </div>
      </div>
    </div>
  );
}
