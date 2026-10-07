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
    if (typeof window !== 'undefined' && (window as any).recenterMap) {
      (window as any).recenterMap();
    }
  };

  return (
    <div className="home-map-wrapper">
      <div className="home-map-title-row">
        <h2>Live Fleet & Route Tracker</h2>
        <span className="action-link" onClick={toggleMapHotspots}>
          <i className="fa-solid fa-radar"></i> Refresh Nearby Fleet
        </span>
      </div>
      
      <div className="home-map-panel">
        <div id="explore-map"></div>
        
        {/* Floating Actions Overlay */}
        <div className="map-floating-bottom-left">
          <button className="map-action-btn-liked" id="home-liked-btn" onClick={() => {
            setActiveTab('favorites');
            window.history.pushState(null, '', '/favorites');
            if (typeof window !== 'undefined' && (window as any).closeModal) {
              (window as any).closeModal('modal-liked');
            }
          }}>
            <i className="fa-solid fa-star"></i> LIKED
          </button>
        </div>
        <div className="map-floating-bottom-right">
          <button className="map-action-btn-nearby" id="home-nearby-btn" onClick={toggleMapHotspots}>
            <i className="fa-solid fa-radar"></i> NEAR BY FIND
          </button>
        </div>
        
        {/* Floating Map Controls */}
        <div className="map-floating-controls">
          <button className="map-circle-btn" onClick={zoomInMap}><i className="fa-solid fa-plus"></i></button>
          <button className="map-circle-btn" onClick={zoomOutMap}><i className="fa-solid fa-minus"></i></button>
          <button className="map-circle-btn" onClick={recenterMap}><i className="fa-solid fa-crosshairs"></i></button>
        </div>

        {/* Floating Active Booking Card overlay on Map */}
        <div 
          className="map-active-booking-panel floating-map-booking-panel" 
          id="map-active-booking-card" 
          style={{ display: 'none', cursor: 'pointer' }}
          onClick={() => {
            setActiveTab('booking');
            window.history.pushState(null, '', '/booking');
            if (typeof window !== 'undefined' && (window as any).closeModal) {
              (window as any).closeModal('modal-bookings-registry');
            }
          }}
        >
          <div className="panel-header-badge">LIVE TRACKING ACTIVE</div>
          <div className="panel-main">
            <div className="panel-icon-wrap" id="map-active-booking-icon-container">
              <i className="fa-solid fa-car-side" id="map-active-booking-icon"></i>
            </div>
            <div className="panel-desc">
              <h4 id="map-active-booking-title">Ride to Kempegowda Airport</h4>
              <p id="map-active-booking-desc">Driver is starting journey...</p>
            </div>
          </div>
          <button 
            className="cancel-booking-btn" 
            onClick={(e) => {
              e.stopPropagation(); // prevent card click
              setActiveTab('booking');
              window.history.pushState(null, '', '/booking');
              if (typeof window !== 'undefined' && (window as any).closeModal) {
                (window as any).closeModal('modal-bookings-registry');
              }
            }}
          >
            Manage Ticket Details
          </button>
        </div>
      </div>
    </div>
  );
}
