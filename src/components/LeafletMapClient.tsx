// @ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to dynamically fit map bounds when coordinates change
function MapUpdater({ bounds, center }: { bounds: L.LatLngBoundsExpression | null, center?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14, animate: false });
    } else if (center) {
      map.setView(center, 13, { animate: false });
    }
  }, [bounds, center, map]);
  return null;
}

interface LeafletMapClientProps {
  vehicleIconClass: string;
  pickup?: string;
  dropoff?: string;
  isSearching?: boolean;
}

export default function LeafletMapClient({ vehicleIconClass, pickup = 'Chennai', dropoff = 'Chennai Airport', isSearching = false }: LeafletMapClientProps) {
  const [pickupCoords, setPickupCoords] = useState<[number, number]>([13.0827, 80.2707]);
  const [dropCoords, setDropCoords] = useState<[number, number]>([12.9796, 80.1637]);
  const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const getGeo = async (query: string) => {
          if (!query || query === 'Current Location') query = 'Chennai';
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`);
          const data = await res.json();
          if (data && data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number];
          return null;
        };

        const pCoords = await getGeo(pickup);
        const dCoords = await getGeo(dropoff);

        if (pCoords) setPickupCoords(pCoords);
        if (dCoords) setDropCoords(dCoords);

        if (pCoords && dCoords) {
          if (isSearching) {
            const bounds = L.latLngBounds([pCoords, dCoords]);
            setMapBounds(bounds);
          } else {
            setMapBounds(null); // Reset bounds when not searching
          }
        }
      } catch (e) {
        console.error("Geocoding failed", e);
      }
    };
    
    // Debounce slightly to prevent spamming API on every keystroke
    const timer = setTimeout(fetchCoords, 1000);
    return () => clearTimeout(timer);
  }, [pickup, dropoff, isSearching]);

  // Generate intermediate points to simulate a slightly curved/realistic route instead of a perfect straight line
  const midLat = (pickupCoords[0] + dropCoords[0]) / 2;
  const midLng = (pickupCoords[1] + dropCoords[1]) / 2;
  // Offset the middle point slightly for a curve
  const offset = 0.02;
  const currentVehicleCoords: [number, number] = [midLat + offset, midLng - offset];

  const routePath: [number, number][] = [
    pickupCoords,
    [midLat + (pickupCoords[0] - midLat) / 2, midLng + (pickupCoords[1] - midLng) / 2 + offset],
    currentVehicleCoords,
    [midLat + (dropCoords[0] - midLat) / 2 - offset, midLng + (dropCoords[1] - midLng) / 2],
    dropCoords
  ];

  const vehicleIcon = L.divIcon({
    className: 'custom-vehicle-marker',
    html: `<div style="width: 36px; height: 36px; border-radius: 50%; background: #3b82f6; border: 3px solid #fff; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transition: all 0.3s ease;"><i class="fa-solid ${vehicleIconClass}"></i></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  const pickupIcon = L.divIcon({
    className: 'custom-pickup-marker',
    html: `<div style="width: 16px; height: 16px; border-radius: 50%; background: #10b981; border: 3px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  const dropIcon = L.divIcon({
    className: 'custom-drop-marker',
    html: `<div style="width: 16px; height: 16px; border-radius: 50%; background: #ef4444; border: 3px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  return (
    <MapContainer 
      center={pickupCoords} 
      zoom={11} 
      style={{ height: '100%', width: '100%', zIndex: 1 }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      <MapUpdater bounds={mapBounds} center={!isSearching ? pickupCoords : undefined} />

      {isSearching && <Polyline positions={routePath} color="#111827" weight={4} dashArray="10, 10" />}

      {isSearching ? (
        <>
          <Marker position={pickupCoords} icon={pickupIcon} />
          <Marker position={dropCoords} icon={dropIcon} />
          <Marker position={currentVehicleCoords} icon={vehicleIcon} />
        </>
      ) : (
        <Marker position={pickupCoords} icon={vehicleIcon} />
      )}
    </MapContainer>
  );
}
