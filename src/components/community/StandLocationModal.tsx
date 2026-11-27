'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TransportUnionInfo } from './transportUnionsData';

interface StandLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  union: TransportUnionInfo;
  currentStand: string;
  standsList: string[];
  onSelectStand: (stand: string) => void;
  onAddNewStand: (newStandTitle: string, updatedList: string[]) => void;
}

// Regional Map Hub Presets for Quick Navigation
export const POPULAR_STAND_COORDINATES = [
  { name: 'Koyambedu Central Auto Stand', city: 'Chennai', area: 'Koyambedu Wholesale Market, Gate 2', lat: 13.0694, lng: 80.1948 },
  { name: 'Chennai Central Station Stand', city: 'Chennai', area: 'Central Railway Station Bay 1', lat: 13.0827, lng: 80.2707 },
  { name: 'T. Nagar Panagal Park Stand', city: 'Chennai', area: 'Panagal Park Junction, T. Nagar', lat: 13.0405, lng: 80.2337 },
  { name: 'Tambaram Railway Station Stand', city: 'Chennai', area: 'Tambaram East Railway Station Exit', lat: 12.9249, lng: 80.1197 },
  { name: 'Guindy Kathipara Junction Stand', city: 'Chennai', area: 'Kathipara Cloverleaf Flyover Bay', lat: 13.0067, lng: 80.2025 },
  { name: 'Chennai Airport Stand', city: 'Chennai', area: 'Airport Terminal 1 Pick-Up Bay 4', lat: 12.9941, lng: 80.1709 },
  { name: 'Velachery MRTS Station Stand', city: 'Chennai', area: 'Velachery MRTS Station Entrance', lat: 12.9815, lng: 80.2227 },
  { name: 'Bengaluru Majestic Stand', city: 'Bengaluru', area: 'Majestic Bus Stand & Station Gate', lat: 12.9767, lng: 77.5713 }
];

export default function StandLocationModal({
  isOpen,
  onClose,
  union,
  currentStand,
  standsList,
  onAddNewStand
}: StandLocationModalProps) {
  const [standName, setStandName] = useState(currentStand);
  const [selectedArea, setSelectedArea] = useState('Koyambedu Wholesale Market (Gate 2), Chennai');
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({ lat: 13.0694, lng: 80.1948 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [selectedGate, setSelectedGate] = useState('Gate 2');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Initialize selected values from currentStand
  useEffect(() => {
    if (!isOpen) return;
    setStandName(currentStand);
    const matched = POPULAR_STAND_COORDINATES.find(p => currentStand.toLowerCase().includes(p.name.toLowerCase()));
    if (matched) {
      setSelectedCoords({ lat: matched.lat, lng: matched.lng });
      setSelectedArea(matched.area);
    }
  }, [isOpen, currentStand]);

  // Leaflet Map with Google Maps Tiles Initialization
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      if (!mapContainerRef.current) return;

      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!isMounted || !mapContainerRef.current) return;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      const initialLat = selectedCoords.lat || 13.0694;
      const initialLng = selectedCoords.lng || 80.1948;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true
      });

      // Google Maps Crisp Road Tile Layer
      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps Road Layer',
        maxZoom: 20
      }).addTo(map);

      // Custom Red Stand Location Pin Icon
      const pinIcon = L.divIcon({
        className: 'stand-map-pin',
        html: `
          <div style="transform: translate(-50%, -100%); filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35)); cursor: pointer;">
            <div style="background: #ef4444; color: #ffffff; width: 38px; height: 38px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);">
              <i class="fa-solid fa-location-dot" style="transform: rotate(45deg); font-size: 16px;"></i>
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38]
      });

      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
        icon: pinIcon
      }).addTo(map);

      const updatePinLocation = async (lat: number, lng: number) => {
        setSelectedCoords({ lat, lng });
        setIsGeocoding(true);

        // Check if close to known popular preset
        let matched = null;
        let minDistance = 999;
        for (const hub of POPULAR_STAND_COORDINATES) {
          const d = Math.hypot(hub.lat - lat, hub.lng - lng);
          if (d < minDistance) {
            minDistance = d;
            matched = hub;
          }
        }

        if (matched && minDistance < 0.03) {
          setSelectedArea(`${matched.area}, ${matched.city}`);
          const newName = `${matched.name} (${selectedGate || 'Gate 1'})`;
          setStandName(newName);
          setIsGeocoding(false);
          return;
        }

        // Live reverse geocoding
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              const addr = data.address || {};
              const place = addr.suburb || addr.neighbourhood || addr.road || addr.city || 'Stand Spot';
              const city = addr.city || addr.town || addr.state_district || 'Chennai';
              setSelectedArea(data.display_name.split(',').slice(0, 3).join(', '));
              const uType = union.name.split(' ')[0] || 'Auto';
              const derivedName = `${place} ${uType} Stand (${selectedGate || 'Main Bay'}), ${city}`;
              setStandName(derivedName);
              setIsGeocoding(false);
              return;
            }
          }
        } catch (e) {
          // fallback
        }

        setSelectedArea(`Selected Map Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        setStandName(`Custom ${union.name} Spot (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
        setIsGeocoding(false);
      };

      marker.on('dragend', (e: any) => {
        const coords = e.target.getLatLng();
        updatePinLocation(coords.lat, coords.lng);
      });

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        updatePinLocation(lat, lng);
      });

      leafletMapRef.current = map;
      markerRef.current = marker;
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Search Location in Map
  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const matched = POPULAR_STAND_COORDINATES.find(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matched && leafletMapRef.current && markerRef.current) {
      leafletMapRef.current.setView([matched.lat, matched.lng], 15);
      markerRef.current.setLatLng([matched.lat, matched.lng]);
      setSelectedCoords({ lat: matched.lat, lng: matched.lng });
      setSelectedArea(`${matched.area}, ${matched.city}`);
      setStandName(`${matched.name} (${selectedGate})`);
      setSearchQuery('');
    } else {
      // Direct Geocode Query
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ' Tamil Nadu')}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0 && leafletMapRef.current && markerRef.current) {
            const first = data[0];
            const lat = parseFloat(first.lat);
            const lng = parseFloat(first.lon);
            leafletMapRef.current.setView([lat, lng], 15);
            markerRef.current.setLatLng([lat, lng]);
            setSelectedCoords({ lat, lng });
            setSelectedArea(first.display_name.split(',').slice(0, 3).join(', '));
            const uType = union.name.split(' ')[0] || 'Auto';
            setStandName(`${searchQuery.trim()} ${uType} Stand (${selectedGate})`);
            setSearchQuery('');
          } else {
            alert(`Location "${searchQuery}" not found. You can click anywhere on the Google Map to place the pin!`);
          }
        })
        .catch(() => {
          alert('Could not search location. Click directly on the Google Map to select your stand spot.');
        });
    }
  };

  // Quick Preset Click
  const handleSelectPresetLocation = (preset: typeof POPULAR_STAND_COORDINATES[0]) => {
    if (leafletMapRef.current && markerRef.current) {
      leafletMapRef.current.setView([preset.lat, preset.lng], 15);
      markerRef.current.setLatLng([preset.lat, preset.lng]);
      setSelectedCoords({ lat: preset.lat, lng: preset.lng });
      setSelectedArea(`${preset.area}, ${preset.city}`);
      setStandName(`${preset.name} (${selectedGate})`);
    }
  };

  // Append Gate / Bay to Stand Name
  const handleGateSelect = (gate: string) => {
    setSelectedGate(gate);
    const baseName = standName.replace(/\s*\([^)]*\)\s*$/, '').trim();
    setStandName(`${baseName} (${gate})`);
  };

  // Submit and Set Stand Location for ALL
  const handleSetStandForAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!standName.trim()) return;

    const trimmed = standName.trim();
    const updatedList = standsList.includes(trimmed)
      ? standsList
      : [trimmed, ...standsList];

    onAddNewStand(trimmed, updatedList);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 6000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '22px',
          maxWidth: '640px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ede9fe', color: '#2A1373', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
              <i className="fa-solid fa-map-location-dot"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                Select Stand Location on Google Map
              </h3>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                {union.name} • Click map to set stand location &amp; choose official name for all
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Location Search Bar */}
          <form onSubmit={handleSearchLocation} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8', fontSize: '13px' }}></i>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search place, railway station, bus terminus, or metro..."
                style={{ width: '100%', padding: '10px 14px 10px 34px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
              />
            </div>
            <button
              type="submit"
              style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#2A1373', color: '#ffffff', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
            >
              Search
            </button>
          </form>

          {/* Quick Regional Hotspots */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {POPULAR_STAND_COORDINATES.slice(0, 5).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPresetLocation(preset)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  color: '#334155',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <i className="fa-solid fa-location-dot" style={{ color: '#2A1373', fontSize: '10px' }}></i>
                <span>{preset.name.split(' ')[0]} {preset.name.split(' ')[1] || ''}</span>
              </button>
            ))}
          </div>

          {/* Interactive Google Maps Leaflet Container */}
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '2px solid #cbd5e1', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
            <div
              ref={mapContainerRef}
              style={{ width: '100%', height: '260px', background: '#f1f5f9' }}
            />

            {/* Map Instruction Floating Badge */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(15, 23, 42, 0.85)',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11.5px',
              fontWeight: 800,
              zIndex: 1000,
              backdropFilter: 'blur(4px)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="fa-solid fa-hand-pointer" style={{ color: '#c4b5fd' }}></i>
              <span>Click or drag pin to select stand spot</span>
            </div>

            {/* Geocoding Loading Indicator */}
            {isGeocoding && (
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: '#ffffff',
                color: '#2A1373',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 800,
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '4px' }}></i> Detecting location...
              </div>
            )}
          </div>

          {/* Selected Location Details Card */}
          <div style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: '12px', padding: '12px 16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#2A1373', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              📍 Selected Spot on Map
            </div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
              {selectedArea}
            </div>
            <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '2px' }}>
              Lat: {selectedCoords.lat.toFixed(4)}, Lng: {selectedCoords.lng.toFixed(4)}
            </div>
          </div>

          {/* Stand Name Input & Gate Selector Form */}
          <form onSubmit={handleSetStandForAll} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>
                Stand Name (Set for All Drivers &amp; Portal) *
              </label>
              <input
                type="text"
                value={standName}
                onChange={e => setStandName(e.target.value)}
                placeholder="e.g. Koyambedu Central Auto Stand (Gate 2)"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '2px solid #2A1373',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#0f172a',
                  outline: 'none',
                  background: '#ffffff'
                }}
                required
              />
            </div>

            {/* Quick Gate / Bay Append Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                Choose Bay / Gate / Spot:
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['Gate 1', 'Gate 2', 'Bay 3', 'Metro Exit', 'Main Entrance', 'Platform 1'].map((g, gIdx) => {
                  const isSel = selectedGate === g;
                  return (
                    <button
                      key={gIdx}
                      type="button"
                      onClick={() => handleGateSelect(g)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: isSel ? '1.5px solid #2A1373' : '1px solid #cbd5e1',
                        background: isSel ? '#ede9fe' : '#ffffff',
                        color: isSel ? '#2A1373' : '#334155',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {isSel ? '✓ ' : ''}{g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Set Stand Location for All Submit Button */}
            <button
              type="submit"
              style={{
                marginTop: '4px',
                padding: '13px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #2A1373 0%, #1a0a4c 100%)',
                color: '#ffffff',
                fontSize: '14.5px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 18px rgba(42, 19, 115, 0.35)'
              }}
            >
              <i className="fa-solid fa-circle-check"></i>
              <span>Set Stand Name for All</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
