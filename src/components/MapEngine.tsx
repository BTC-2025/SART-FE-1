'use client';

import React from 'react';
import './MapEngine.css';
import { useSartStore } from '@/store/useSartStore';

export default function MapEngine() {
  const setActiveTab = useSartStore(state => state.setActiveTab);

  const openGlobalModal = (id: string) => {
    if (typeof window !== 'undefined' && (window as any).openModal) {
      (window as any).openModal(id);
    }
  };

  const toggleMapHotspots = () => {
    if (typeof window !== 'undefined' && (window as any).toggleMapHotspots) {
      (window as any).toggleMapHotspots();
    }
  };

  const zoomInMap = () => {
    if (typeof window !== 'undefined' && (window as any).zoomInMap) {
      (window as any).zoomInMap();
    }
  };

  const zoomOutMap = () => {
    if (typeof window !== 'undefined' && (window as any).zoomOutMap) {
      (window as any).zoomOutMap();
    }
  };

  const recenterMap = () => {
    if (typeof window !== 'undefined') {
      if ((window as any).requestLiveUserLocation) {
        (window as any).requestLiveUserLocation(true);
      } else if ((window as any).recenterMap) {
        (window as any).recenterMap();
      }
    }
  };

  return (
    <div className="">



    </div>
  );
}
