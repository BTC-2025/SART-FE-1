'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Anchor, Compass, Calendar, Clock, ArrowRight, ShieldCheck, Waves } from 'lucide-react';

interface ShipBookingViewProps {
  source?: string;
  destination?: string;
  dateOfJourney?: string;
}

const SHIP_SERVICES = [
  {
    id: 'SHP-01',
    name: 'Cordelia Empress Cruise',
    vesselType: 'Luxury Cruise Liner',
    code: 'CE-904',
    depPort: 'Mumbai Port Trust (BOM-SEA)',
    arrPort: 'Goa Mormugao Port (GOI-SEA)',
    depTime: '17:00',
    arrTime: '08:30',
    duration: '15h 30m',
    fare: 14500,
    cabinType: 'Ocean View Balcony Suite',
    operator: 'Cordelia Cruises',
    rating: 4.9,
    mealsIncluded: true,
    deck: 'Deck 7 - Sunset Promenade'
  },
  {
    id: 'SHP-02',
    name: 'MV Kavaratti Inter-Island Express',
    vesselType: 'High-Speed Catamaran Ferry',
    code: 'LK-302',
    depPort: 'Kochi Ferry Wharf (COK-SEA)',
    arrPort: 'Kavaratti Island Jetty (LAK-SEA)',
    depTime: '09:00',
    arrTime: '14:30',
    duration: '5h 30m',
    fare: 4200,
    cabinType: 'Premium Air-Conditioned Lounge',
    operator: 'Lakshadweep Maritime',
    rating: 4.8,
    mealsIncluded: false,
    deck: 'Main AC Deck'
  },
  {
    id: 'SHP-03',
    name: 'Andaman Makruzz Gold',
    vesselType: 'Coastal Catamaran',
    code: 'MK-108',
    depPort: 'Port Blair Phoenix Jetty (IXZ-SEA)',
    arrPort: 'Havelock Island Pier (HVL-SEA)',
    depTime: '08:00',
    arrTime: '09:30',
    duration: '1h 30m',
    fare: 2850,
    cabinType: 'Royal Executive Club',
    operator: 'Makruzz Ferries',
    rating: 4.9,
    mealsIncluded: true,
    deck: 'Upper Observation Deck'
  }
];

export default function ShipBookingView({
  source = 'Mumbai',
  destination = 'Goa',
  dateOfJourney = '26 Nov, 2026'
}: ShipBookingViewProps) {
  const router = useRouter();
  const [selectedVessel, setSelectedVessel] = useState<any>(null);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 16px 60px' }}>
      {/* Top Banner */}
      <div
        style={{
          backgroundColor: '#0c4a6e',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          boxShadow: '0 4px 16px rgba(12, 74, 110, 0.25)',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '24px' }}>🚢</span>
            <h2 style={{ fontSize: '22px', fontWeight: 900, margin: 0 }}>
              Cruise &amp; Passenger Ship Charters
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#bae6fd' }}>
            Book scheduled passenger ferries, sea passenger voyages, and luxury marine cruises.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={16} /> DG Shipping Approved
          </span>
        </div>
      </div>

      {/* Available Ships List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {SHIP_SERVICES.map((ship) => (
          <div
            key={ship.id}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr',
              gap: '24px',
              alignItems: 'center'
            }}
          >
            {/* Vessel Info */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px'
                }}
              >
                🚢
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
                  {ship.name}
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
                  {ship.operator} • {ship.code} • {ship.vesselType}
                </div>
                <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '6px', fontWeight: 700 }}>
                  ⚓ {ship.deck}
                </div>
              </div>
            </div>

            {/* Route & Timings */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px' }}>
              <div>
                <strong style={{ fontSize: '20px', color: '#0f172a', display: 'block' }}>{ship.depTime}</strong>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>{ship.depPort}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>{ship.duration}</span>
                <div style={{ width: '80px', height: '2px', backgroundColor: '#cbd5e1', position: 'relative', margin: '6px 0' }}>
                  <div style={{ position: 'absolute', right: '0', top: '-4px', width: '0', height: '0', borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid #cbd5e1' }} />
                </div>
                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>Direct Voyage</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '20px', color: '#0f172a', display: 'block' }}>{ship.arrTime}</strong>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>{ship.arrPort}</span>
              </div>
            </div>

            {/* Price & Action */}
            <div style={{ textAlign: 'right', borderLeft: '1px solid #f1f5f9', paddingLeft: '20px' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>
                ₹ {ship.fare.toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginBottom: '12px' }}>
                per passenger cabin pass
              </span>

              <button
                type="button"
                onClick={() => {
                  alert(`Reserving Sea Voyage on ${ship.name} (${ship.code}). Proceeding to Port Manifest.`);
                }}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#0c4a6e',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(12, 74, 110, 0.25)'
                }}
              >
                <span>Book Ship Voyage</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
