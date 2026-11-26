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
    id: 'SHP-SAMUDRA',
    name: 'MV Samudra Express',
    vesselType: 'High-Speed Cruise Ferry',
    code: 'IMO 9842105',
    depPort: 'Chennai Port (Berth 4)',
    arrPort: 'Port Blair (Haddo Wharf)',
    depDate: '28 Nov 2026',
    arrDate: '30 Nov 2026',
    depTime: '08:30 AM',
    arrTime: '03:00 PM',
    duration: '54h 30m',
    fare: 6850,
    cabinType: 'Deluxe Ocean Cabin',
    operator: 'SART Maritime Lines',
    rating: 4.8,
    mealsIncluded: true,
    deck: 'CRUISE FERRY • DECK 4',
    speed: '22 Knots',
    capacity: '1,200 Pax • Ro-Ro Deck',
    amenities: ['AC Cabins', 'Dining Hall', 'Medical Bay', 'Lifeboats', 'Sat-WiFi'],
    reportNotice: 'Report at pier 90 mins before departure'
  },
  {
    id: 'SHP-01',
    name: 'Cordelia Empress Cruise',
    vesselType: 'Luxury Cruise Liner',
    code: 'CE-904',
    depPort: 'Mumbai Port Trust (BOM-SEA)',
    arrPort: 'Goa Mormugao Port (GOI-SEA)',
    depDate: '28 Nov 2026',
    arrDate: '29 Nov 2026',
    depTime: '17:00',
    arrTime: '08:30',
    duration: '15h 30m',
    fare: 14500,
    cabinType: 'Ocean View Balcony Suite',
    operator: 'Cordelia Cruises',
    rating: 4.9,
    mealsIncluded: true,
    deck: 'Deck 7 - Sunset Promenade',
    speed: '20 Knots',
    capacity: '1,800 Pax',
    amenities: ['AC Cabins', 'Fine Dining', 'Pool Deck', 'Live Casino', 'Wi-Fi'],
    reportNotice: 'Report at pier 90 mins before departure'
  },
  {
    id: 'SHP-02',
    name: 'MV Kavaratti Inter-Island Express',
    vesselType: 'High-Speed Catamaran Ferry',
    code: 'LK-302',
    depPort: 'Kochi Ferry Wharf (COK-SEA)',
    arrPort: 'Kavaratti Island Jetty (LAK-SEA)',
    depDate: '28 Nov 2026',
    arrDate: '28 Nov 2026',
    depTime: '09:00',
    arrTime: '14:30',
    duration: '5h 30m',
    fare: 4200,
    cabinType: 'Premium Air-Conditioned Lounge',
    operator: 'Lakshadweep Maritime',
    rating: 4.8,
    mealsIncluded: false,
    deck: 'Main AC Deck',
    speed: '24 Knots',
    capacity: '700 Pax',
    amenities: ['AC Cabins', 'Snack Bar', 'Medical Bay', 'Lifeboats'],
    reportNotice: 'Report at pier 60 mins before departure'
  },
  {
    id: 'SHP-03',
    name: 'Andaman Makruzz Gold',
    vesselType: 'Coastal Catamaran',
    code: 'MK-108',
    depPort: 'Port Blair Phoenix Jetty (IXZ-SEA)',
    arrPort: 'Havelock Island Pier (HVL-SEA)',
    depDate: '28 Nov 2026',
    arrDate: '28 Nov 2026',
    depTime: '08:00',
    arrTime: '09:30',
    duration: '1h 30m',
    fare: 2850,
    cabinType: 'Royal Executive Club',
    operator: 'Makruzz Ferries',
    rating: 4.9,
    mealsIncluded: true,
    deck: 'Upper Observation Deck',
    speed: '28 Knots',
    capacity: '330 Pax',
    amenities: ['AC Cabins', 'Beverage Bar', 'Panoramic Windows'],
    reportNotice: 'Report at pier 45 mins before departure'
  }
];

export default function ShipBookingView({
  source = 'Chennai',
  destination = 'Port Blair',
  dateOfJourney = '26 Nov, 2026'
}: ShipBookingViewProps) {
  const router = useRouter();
  const [selectedShipId, setSelectedShipId] = useState<string>('all');

  // Sync selected ship from localStorage or custom events
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sart_selected_ship_id');
      if (stored) {
        setSelectedShipId(stored);
      }

      const handleShipEvent = (e: any) => {
        if (e.detail?.id) {
          setSelectedShipId(e.detail.id);
        }
      };
      window.addEventListener('sart_ship_selected', handleShipEvent);
      return () => window.removeEventListener('sart_ship_selected', handleShipEvent);
    }
  }, []);

  const handleSelectShip = (id: string) => {
    setSelectedShipId(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sart_selected_ship_id', id);
    }
  };

  const filteredShips = selectedShipId === 'all'
    ? SHIP_SERVICES
    : SHIP_SERVICES.filter((s) => s.id === selectedShipId);

  const selectedShipData = SHIP_SERVICES.find((s) => s.id === selectedShipId);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 16px 60px' }}>
      {/* Ship Quick Filter Pills / Selector Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '20px',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
          <i className="fa-solid fa-ship"></i> Select Ship:
        </span>

        <button
          type="button"
          onClick={() => handleSelectShip('all')}
          style={{
            padding: '7px 16px',
            borderRadius: '24px',
            fontSize: '12.5px',
            fontWeight: selectedShipId === 'all' ? 800 : 600,
            background: selectedShipId === 'all' ? '#0284c7' : '#f8fafc',
            color: selectedShipId === 'all' ? '#ffffff' : '#475569',
            border: selectedShipId === 'all' ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>All Available Ships ({SHIP_SERVICES.length})</span>
        </button>

        {SHIP_SERVICES.map((s) => {
          const isSelected = selectedShipId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelectShip(s.id)}
              style={{
                padding: '7px 16px',
                borderRadius: '24px',
                fontSize: '12.5px',
                fontWeight: isSelected ? 800 : 600,
                background: isSelected ? '#0284c7' : '#ffffff',
                color: isSelected ? '#ffffff' : '#1e293b',
                border: isSelected ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
              }}
            >
              <span>{s.name}</span>
              <span
                style={{
                  fontSize: '10.5px',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(255,255,255,0.25)' : '#e0f2fe',
                  color: isSelected ? '#ffffff' : '#0369a1',
                  fontWeight: 700
                }}
              >
                ₹{s.fare.toLocaleString('en-IN')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
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
              {selectedShipData ? selectedShipData.name : 'Cruise & Passenger Ship Charters'}
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#bae6fd' }}>
            {selectedShipData
              ? `${selectedShipData.vesselType} • Route: ${selectedShipData.depPort} ➔ ${selectedShipData.arrPort}`
              : 'Book scheduled passenger ferries, sea passenger voyages, and luxury marine cruises.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {selectedShipId !== 'all' && (
            <button
              type="button"
              onClick={() => handleSelectShip('all')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.4)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Show All Ships
            </button>
          )}
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
        {filteredShips.map((ship) => (
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
                  try {
                    localStorage.setItem('sart_selected_ship_voyage', JSON.stringify(ship));
                  } catch (e) { }

                  const query = new URLSearchParams({
                    shipId: ship.id,
                    name: ship.name,
                    vesselType: ship.vesselType,
                    code: ship.code,
                    operator: ship.operator,
                    depPort: ship.depPort,
                    arrPort: ship.arrPort,
                    depDate: ship.depDate || '28 Nov 2026',
                    arrDate: ship.arrDate || '30 Nov 2026',
                    depTime: ship.depTime,
                    arrTime: ship.arrTime,
                    duration: ship.duration,
                    fare: String(ship.fare),
                    cabinType: ship.cabinType,
                    deck: ship.deck,
                    rating: String(ship.rating)
                  });

                  router.push(`/home/ride/ship/PassengerDetails?${query.toString()}`);
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
