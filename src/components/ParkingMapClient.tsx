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

interface ParkingMapClientProps {
  vehicleIconClass: string;
  vehicleTitle?: string;
  searchQuery?: string;
  isSearched?: boolean;
}

export default function ParkingMapClient({ vehicleIconClass, vehicleTitle = 'Car', searchQuery = '', isSearched = false }: ParkingMapClientProps) {
  // Simulate different coordinates based on search query
  const isSearchActive = searchQuery.length > 2;
  const centerCoords: [number, number] = isSearchActive ? [13.0827, 80.2707] : [12.9716, 77.5946]; // Chennai vs Bangalore simulation

  // Dynamic Pricing based on vehicle type
  const getPrice = (base: number) => {
    if (vehicleTitle.includes('Two-Wheeler') || vehicleTitle.includes('Bike')) return `₹${base - 30}/hr`;
    if (vehicleTitle.includes('Boat') || vehicleTitle.includes('Yacht')) return `₹${base * 10}/hr`;
    if (vehicleTitle.includes('Plane') || vehicleTitle.includes('Jet')) return `₹${base * 50}/hr`;
    return `₹${base}/hr`; // Default car pricing
  };

  // Custom Icon for Parking Spots
  const createParkingIcon = (price: string, color: string) => L.divIcon({
    className: 'custom-parking-marker',
    html: `<div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%); width: max-content; transition: all 0.3s ease;">
            <div style="background: ${color}; color: #fff; padding: 6px 10px; border-radius: 8px; font-weight: 700; font-size: 13px; margin-bottom: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2);">${price}</div>
            <i class="fa-solid fa-location-dot" style="color: ${color}; font-size: 28px; text-shadow: 0 4px 4px rgba(0,0,0,0.4);"></i>
          </div>`,
    iconSize: [40, 60],
    iconAnchor: [0, 0]
  });

  // Base coords to offset from center
  const spots = [
    { offset: [0, 0], basePrice: 50, color: '#f59e0b', label: 'Premium Slot' },
    { offset: [0.0034, -0.0046], basePrice: 40, color: '#10b981', label: 'Standard Slot' },
    { offset: [-0.0036, 0.0054], basePrice: 80, color: '#3b82f6', label: 'Covered Parking' },
    { offset: [0.0050, 0.0020], basePrice: 30, color: '#8b5cf6', label: 'Economy Slot' }
  ];

  return (
    <MapContainer 
      key={`${centerCoords[0]}-${centerCoords[1]}`} // Force re-render on location change
      center={centerCoords} 
      zoom={14} 
      style={{ height: '100%', width: '100%', borderRadius: '0' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {isSearched && spots.map((spot, idx) => (
        <Marker 
          key={idx} 
          position={[centerCoords[0] + spot.offset[0], centerCoords[1] + spot.offset[1]]} 
          icon={createParkingIcon(getPrice(spot.basePrice), spot.color)}
        >
           <Popup><b>{spot.label}</b><br/>Available for {vehicleTitle}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
