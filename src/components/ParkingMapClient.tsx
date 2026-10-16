// @ts-nocheck
'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  priceDisplay: string;
  pricePerHour: number;
  rating: number;
  reviewsCount: number;
  distance: string;
  host: string;
  features: string[];
  image: string;
  availableSlots: number;
}

interface ParkingMapClientProps {
  vehicleIconClass: string;
  vehicleTitle?: string;
  searchQuery?: string;
  isSearched?: boolean;
  spots?: ParkingSpot[];
  selectedSpotId?: string;
  onSelectSpot?: (spot: ParkingSpot) => void;
  userCoords?: [number, number];
}

export default function ParkingMapClient({
  vehicleIconClass,
  vehicleTitle = 'Car',
  searchQuery = '',
  isSearched = true,
  spots = [],
  selectedSpotId = '',
  onSelectSpot,
  userCoords = [13.0827, 80.2707]
}: ParkingMapClientProps) {
  const centerCoords: [number, number] = userCoords || [13.0827, 80.2707];

  // Custom Icon for Parking Spots with Price Pills
  const createParkingIcon = (price: string, isSelected: boolean) => L.divIcon({
    className: 'custom-parking-marker',
    html: `<div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%); cursor:pointer; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
            <div style="background: ${isSelected ? '#0f172a' : '#ffffff'}; color: ${isSelected ? '#ffffff' : '#0f172a'}; padding: 4px 9px; border-radius: 20px; font-weight: 800; font-size: 12px; border: 2px solid ${isSelected ? '#059669' : '#e2e8f0'}; white-space:nowrap; margin-bottom: 2px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
              ${price}
            </div>
            <div style="width: 24px; height: 24px; border-radius: 50%; background: ${isSelected ? '#059669' : '#3b82f6'}; display:flex; align-items:center; justify-content:center; color:#fff; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              <i class="fa-solid fa-square-parking" style="font-size: 13px;"></i>
            </div>
          </div>`,
    iconSize: [46, 56],
    iconAnchor: [23, 56]
  });

  const userMarkerIcon = L.divIcon({
    className: 'user-live-marker',
    html: `<div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
            <div style="background: #2563eb; color: #fff; padding: 3px 8px; border-radius: 12px; font-weight: 700; font-size: 11px; white-space:nowrap; margin-bottom: 3px;">
              You are here
            </div>
            <div style="width: 18px; height: 18px; border-radius: 50%; background: #2563eb; border: 3px solid #ffffff; box-shadow: 0 0 0 6px rgba(37,99,235,0.3);"></div>
          </div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40]
  });

  return (
    <MapContainer 
      key={`${centerCoords[0]}-${centerCoords[1]}-${spots.length}`}
      center={centerCoords} 
      zoom={14} 
      style={{ height: '100%', width: '100%', borderRadius: '0' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Live User Location Marker */}
      <Marker position={centerCoords} icon={userMarkerIcon}>
        <Popup>
          <div style={{ padding: '4px' }}>
            <strong>Your Live Location</strong>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Scanning for open parking spaces nearby</div>
          </div>
        </Popup>
      </Marker>

      {/* Parking Spots */}
      {spots.map((spot) => {
        const isSelected = selectedSpotId === spot.id;
        return (
          <Marker 
            key={spot.id} 
            position={[spot.lat, spot.lng]} 
            icon={createParkingIcon(spot.priceDisplay, isSelected)}
            eventHandlers={{
              click: () => {
                if (onSelectSpot) onSelectSpot(spot);
              }
            }}
          >
            <Popup>
              <div style={{ minWidth: '180px', padding: '4px' }}>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{spot.name}</strong>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{spot.address}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontWeight: 800, color: '#059669', fontSize: '14px' }}>{spot.priceDisplay}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>★ {spot.rating}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
