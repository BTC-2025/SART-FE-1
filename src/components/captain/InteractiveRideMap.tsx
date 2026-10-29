// @ts-nocheck
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon default URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to dynamically fit bounds when points change
function MapBoundsUpdater({
  pickupCoords,
  dropCoords,
  selectionMode
}: {
  pickupCoords: { lat: number; lng: number } | null;
  dropCoords: { lat: number; lng: number } | null;
  selectionMode: 'pickup' | 'drop' | 'idle';
}) {
  const map = useMap();

  useEffect(() => {
    // Invalidate map size to ensure all Google map tiles load properly inside flex/dynamic containers
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (pickupCoords && dropCoords) {
      const bounds = L.latLngBounds(
        [pickupCoords.lat, pickupCoords.lng],
        [dropCoords.lat, dropCoords.lng]
      );
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true });
    } else if (pickupCoords) {
      map.setView([pickupCoords.lat, pickupCoords.lng], 14, { animate: true });
    } else if (dropCoords) {
      map.setView([dropCoords.lat, dropCoords.lng], 14, { animate: true });
    }
  }, [pickupCoords?.lat, pickupCoords?.lng, dropCoords?.lat, dropCoords?.lng]);

  return null;
}

// Handle Map Click (Only selects on explicit mouse click, NOT mouse movement)
function MapClickHandler({
  onMapClick
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export interface InteractiveRideMapProps {
  mode: 'bike' | 'auto' | 'car';
  pickupCoords: { lat: number; lng: number } | null;
  dropCoords: { lat: number; lng: number } | null;
  pickupAddress: string;
  dropAddress: string;
  selectionMode: 'pickup' | 'drop' | 'idle';
  onSelectLocation: (type: 'pickup' | 'drop', lat: number, lng: number) => void;
  nearbyCaptains?: Array<{
    id: string;
    driverName: string;
    serviceType: string;
    lat: number;
    lng: number;
    rating?: number;
    vehicleModel?: string;
    plateNumber?: string;
  }>;
  routeGeometry?: [number, number][];
  dropMarkerLabel?: string;
  dropMarkerType?: 'drop' | 'user';
}

export default function InteractiveRideMap({
  mode = 'bike',
  pickupCoords,
  dropCoords,
  pickupAddress,
  dropAddress,
  selectionMode,
  onSelectLocation,
  nearbyCaptains = [],
  routeGeometry = [],
  dropMarkerLabel,
  dropMarkerType = 'drop'
}: InteractiveRideMapProps) {
  // Map style: 'google' (Google Street Map) | 'satellite' (Google Hybrid Satellite) | 'osm' (Standard)
  const [mapStyle, setMapStyle] = useState<'google' | 'satellite' | 'osm'>('google');

  // Center default coordinates (Chennai / current center)
  const defaultCenter: [number, number] = useMemo(() => {
    if (pickupCoords) return [pickupCoords.lat, pickupCoords.lng];
    if (dropCoords) return [dropCoords.lat, dropCoords.lng];
    return [13.0827, 80.2707];
  }, [pickupCoords, dropCoords]);

  // Handle explicit user map click
  const handleMapClick = (lat: number, lng: number) => {
    // Determine which point to select:
    // If user clicked explicitly 'pickup' mode -> set pickup
    // If user clicked explicitly 'drop' mode -> set drop
    // If idle: if no pickup -> set pickup, otherwise set drop
    if (selectionMode === 'pickup') {
      onSelectLocation('pickup', lat, lng);
    } else if (selectionMode === 'drop') {
      onSelectLocation('drop', lat, lng);
    } else {
      if (!pickupCoords) {
        onSelectLocation('pickup', lat, lng);
      } else {
        onSelectLocation('drop', lat, lng);
      }
    }
  };

  // Custom Green Circle Marker for Pickup Location (matching screenshot 2)
  const pickupMarkerIcon = useMemo(() => {
    return L.divIcon({
      className: 'sart-pickup-circle-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="
            background: #ffffff;
            color: #0f172a;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 11.5px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.18);
            border: 1px solid #cbd5e1;
            margin-bottom: 4px;
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
          ">
            🟢 ${pickupAddress || 'Pickup Point'}
          </div>
          <div style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #ffffff;
            border: 4px solid #16a34a;
            box-shadow: 0 0 0 5px rgba(22, 163, 74, 0.28), 0 4px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: #16a34a;"></div>
          </div>
        </div>
      `,
      iconSize: [28, 48],
      iconAnchor: [14, 48]
    });
  }, [pickupAddress]);

  // Custom Red Ring Pin for Dropping Location (or User Location Pin in Captain view)
  const dropMarkerIcon = useMemo(() => {
    const isUserPin = dropMarkerType === 'user';
    const labelText = dropMarkerLabel || (isUserPin ? '👤 Rider / Pickup Point' : `🔴 ${dropAddress || 'Dropping Point'}`);
    const pinColor = isUserPin ? '#2563eb' : '#dc2626';
    const pinIconClass = isUserPin ? 'fa-user' : 'fa-location-dot';

    return L.divIcon({
      className: isUserPin ? 'sart-user-location-pin' : 'sart-drop-ring-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="
            background: #ffffff;
            color: #0f172a;
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 11.5px;
            font-weight: 800;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.18);
            border: 1px solid #cbd5e1;
            margin-bottom: 4px;
            max-width: 220px;
            overflow: hidden;
            text-overflow: ellipsis;
          ">
            ${labelText}
          </div>
          <div style="
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: ${pinColor};
            border: 3.5px solid #ffffff;
            box-shadow: 0 0 0 5px ${isUserPin ? 'rgba(37, 99, 235, 0.3)' : 'rgba(220, 38, 38, 0.3)'}, 0 4px 8px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 14px;
          ">
            <i class="fa-solid ${pinIconClass}" style="font-size: 14px;"></i>
          </div>
        </div>
      `,
      iconSize: [34, 54],
      iconAnchor: [17, 54]
    });
  }, [dropAddress, dropMarkerLabel, dropMarkerType]);

  // Real vehicle icons for nearby live captains (matching Screenshot 2 Auto / Bike / Cab icons)
  const createCaptainIcon = (driver: any) => {
    const isAuto = mode === 'auto' || driver.serviceType === 'auto';
    const isBike = mode === 'bike' || driver.serviceType === 'bike';

    const iconImage = isAuto
      ? 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png'
      : isBike
        ? '/images/white_bike.png'
        : 'https://cdn-icons-png.flaticon.com/512/75/75780.png';

    return L.divIcon({
      className: 'sart-nearby-captain-marker',
      html: `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -50%);
          cursor: pointer;
          filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));
        ">
          <div style="
            width: 36px;
            height: 36px;
            background: #ffffff;
            border-radius: 50%;
            border: 2px solid ${isAuto ? '#f59e0b' : isBike ? '#10b981' : '#3b82f6'};
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          ">
            <img src="${iconImage}" style="width: 24px; height: 24px; object-fit: contain;" alt="Captain" />
          </div>
          <div style="
            background: #0f172a;
            color: #ffffff;
            font-size: 9.5px;
            font-weight: 800;
            padding: 1px 6px;
            border-radius: 10px;
            margin-top: 2px;
            white-space: nowrap;
          ">
            ${driver.driverName ? driver.driverName.split(' ')[0] : 'Captain'} • ⭐${driver.rating || 4.8}
          </div>
        </div>
      `,
      iconSize: [40, 52],
      iconAnchor: [20, 26]
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ width: '100%', height: '100%', borderRadius: '12px', zIndex: 1 }}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        {/* Google Maps HD Street Tiles (Default) */}
        {mapStyle === 'satellite' ? (
          <TileLayer
            url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
            attribution="&copy; Google Maps Satellite"
            maxZoom={20}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
        ) : mapStyle === 'osm' ? (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
            maxZoom={19}
            subdomains={['a', 'b', 'c']}
          />
        ) : (
          <TileLayer
            url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            attribution="&copy; Google Maps"
            maxZoom={20}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          />
        )}

        {/* Dynamic Bounds Auto-fitter */}
        <MapBoundsUpdater
          pickupCoords={pickupCoords}
          dropCoords={dropCoords}
          selectionMode={selectionMode}
        />

        {/* Listen for single mouse click to select point */}
        <MapClickHandler onMapClick={handleMapClick} />

        {/* 1. Road Navigation Route Polyline (Bold Black Line matching active accepted trip) */}
        {routeGeometry && routeGeometry.length > 0 && (
          <Polyline
            positions={routeGeometry}
            pathOptions={{
              color: '#0f172a',
              weight: 5,
              opacity: 0.9,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
        )}

        {/* 2. Green Pickup Point Marker */}
        {pickupCoords && (
          <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={pickupMarkerIcon} />
        )}

        {/* 3. Red Dropping Point Marker */}
        {dropCoords && (
          <Marker position={[dropCoords.lat, dropCoords.lng]} icon={dropMarkerIcon} />
        )}

        {/* 4. Real Nearby Captains / Autos / Bikes / Cars on the road (matching Screenshot 2) */}
        {nearbyCaptains && nearbyCaptains.map((driver) => {
          if (!driver.lat || !driver.lng) return null;
          return (
            <Marker
              key={driver.id}
              position={[driver.lat, driver.lng]}
              icon={createCaptainIcon(driver)}
            >
              <Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
                <div style={{ fontSize: '12px', fontWeight: 700 }}>
                  <div>{driver.driverName} ({driver.vehicleModel || mode.toUpperCase()})</div>
                  <div style={{ color: '#16a34a', fontSize: '11px' }}>Available • {driver.plateNumber || 'Verified'}</div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Google Map Mode Selector Pills on Top-Right */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 1000,
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        padding: '3px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        border: '1px solid #e2e8f0',
        gap: '4px'
      }}>
        <button
          type="button"
          onClick={() => setMapStyle('google')}
          style={{
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: mapStyle === 'google' ? '#1e293b' : 'transparent',
            color: mapStyle === 'google' ? '#ffffff' : '#475569'
          }}
        >
          <i className="fa-solid fa-map" style={{ marginRight: '4px' }}></i> Google Map
        </button>
        <button
          type="button"
          onClick={() => setMapStyle('satellite')}
          style={{
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: mapStyle === 'satellite' ? '#1e293b' : 'transparent',
            color: mapStyle === 'satellite' ? '#ffffff' : '#475569'
          }}
        >
          <i className="fa-solid fa-satellite" style={{ marginRight: '4px' }}></i> Satellite
        </button>
        <button
          type="button"
          onClick={() => setMapStyle('osm')}
          style={{
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: mapStyle === 'osm' ? '#1e293b' : 'transparent',
            color: mapStyle === 'osm' ? '#ffffff' : '#475569'
          }}
        >
          <i className="fa-solid fa-layer-group" style={{ marginRight: '4px' }}></i> OSM
        </button>
      </div>

      {/* Floating Status & Instruction Tooltip at bottom of map */}
      <div style={{
        position: 'absolute',
        bottom: '14px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.9)',
        color: '#ffffff',
        padding: '6px 16px',
        borderRadius: '24px',
        fontSize: '12px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
        pointerEvents: 'none'
      }}>
        {selectionMode === 'pickup' && (
          <>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span>
            <span>Click map to set <strong>Pickup Location</strong></span>
          </>
        )}
        {selectionMode === 'drop' && (
          <>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
            <span>Click map to set <strong>Dropping Point (Red Pin)</strong></span>
          </>
        )}
        {selectionMode === 'idle' && (
          <>
            <i className="fa-solid fa-computer-mouse" style={{ color: '#f97316' }}></i>
            <span>Click on map to select pickup or dropping point</span>
          </>
        )}
      </div>
    </div>
  );
}
