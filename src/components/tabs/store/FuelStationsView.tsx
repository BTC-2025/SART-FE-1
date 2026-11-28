'use client';

import React, { useState } from 'react';
import './FuelStationsView.css';

interface FuelStationItem {
  id: string;
  name: string;
  address: string;
  timings: string;
  phone?: string;
  fuels: string[];
}

const FUEL_STATIONS_DATA: FuelStationItem[] = [
  {
    id: 'hpcl-1',
    name: 'Hpcl-fuel Station (perumuchi Post)',
    address: 'Mshsd Adhoc Monica Sun Agency, Arakkonam-Kancheepuram State Highway Perumuchi Post, Arakkonam, Chennai, Perumuchi Post, 631002, Vellore, Tamil Nadu',
    timings: 'Open now • 12:00 AM - 11:59 PM',
    fuels: ['Petrol', 'Diesel', 'CNG']
  },
  {
    id: 'hpcl-2',
    name: 'Hpcl-fuel Station (walajapet)',
    address: 'Mshsd Adhoc Vgn Agency, Coco Walajapet, Ranipet District, Tamil Nadu 632513, Ind, Walajapet, 632513, Vellore',
    timings: 'Open now • 12:00 AM - 11:59 PM',
    phone: '8438356442',
    fuels: ['Petrol', 'Diesel']
  },
  {
    id: 'hpcl-3',
    name: 'Hpcl-fuel Station (mullavadi)',
    address: 'Mshsd Om Shiva Sakthi Agencies, Kalavai, Vellore, Sh-5, Arcot Tiruvettipuram Vandavasi Tindivanam Road, Arcot, Paradarami, Mullavadi, 632506, Tamil Nadu',
    timings: 'Open now • 12:00 AM - 11:59 PM',
    fuels: ['Petrol', 'Diesel']
  },
  {
    id: 'hpcl-4',
    name: 'Hpcl-fuel Station (thimampet)',
    address: 'Sri Venkateswara Agencies, 504, Thimampet Village, Village And Post Vaniyambadi, Thimampet, 635801, Vellore, Tamil Nadu',
    timings: 'Open now • 05:00 AM - 11:00 PM',
    phone: '9443324528',
    fuels: ['Petrol', 'Diesel']
  },
  {
    id: 'hpcl-5',
    name: 'Hpcl-fuel Station (kethandapatti)',
    address: 'Adhoc Nikinish Fuels, Coco Kethandapatti, Nh 48 Bangalore Chennai Highway Lhs, Kethandapatti, Vaniyambadi, Kethandapatti, 635815, Vellore, Tamil Nadu',
    timings: 'Open now • 12:00 AM - 11:59 PM',
    fuels: ['Petrol', 'Diesel']
  },
  {
    id: 'hpcl-6',
    name: 'Hpcl-fuel Station (pachoor)',
    address: 'Adhoc Sree Padmavathy Agencies, Pachoor Nh Rest Area, Natrampalli, Pachoor, 635854, Vellore, Tamil Nadu',
    timings: 'Open now • 12:00 AM - 11:59 PM',
    fuels: ['Petrol', 'Diesel', 'CNG']
  },
  {
    id: 'hpcl-7',
    name: 'Hpcl-fuel Station (vishamangalam)',
    address: 'Sri Ram Agencies, Tiruvannamalai - Tirupathur Road, Vishamangalam, Udayamuthur Panchayat, Vishamangalam, 635652, Vellore, Tamil Nadu',
    timings: 'Open now • 05:00 AM - 11:00 PM',
    phone: '9362278333',
    fuels: ['Petrol', 'Diesel']
  },
  {
    id: 'hpcl-8',
    name: 'Hpcl-fuel Station (paramasathu)',
    address: 'Mshsd Sri Venkateswara Agency, Sh 500, Srinivasapuram, Paramasathu, 632514, Vellore, Tamil Nadu',
    timings: 'Open now • 12:00 AM - 11:59 PM',
    fuels: ['Petrol', 'Diesel']
  },
  {
    id: 'hpcl-9',
    name: 'Hpcl-fuel Station (perumugai)',
    address: 'S.P.G. Agencies, Nh-46, Pilliyarkuppam Perumugai, , Perumugai , 632009, Vellore, Tamil Nadu',
    timings: 'Open now • 12:00 AM - 11:59 PM',
    phone: '9443251307',
    fuels: ['Petrol', 'Diesel']
  }
];

interface FuelStationsViewProps {
  showToast: (msg: string) => void;
  userLocationCity?: string;
  setUserLocationCity?: (city: string) => void;
  onNavigateTab?: (path: string) => void;
}

export default function FuelStationsView({
  showToast,
  userLocationCity = 'Vellore',
  setUserLocationCity,
  onNavigateTab
}: FuelStationsViewProps) {
  const [selectedCity, setSelectedCity] = useState<string>('Vellore');
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);

  const handleGetDirection = (stationName: string) => {
    showToast(`Opening GPS navigation for ${stationName}`);
  };

  return (
    <div className="fuel-stations-page-wrapper animate-fade-in">
      {/* 1. TOP HEADER BANNER (MATCHING IMAGE 1) */}
      <div className="fuel-stations-header-box">
        <div className="fuel-header-title-row">
          <h1 className="fuel-stations-main-title">
            81 Petrol Pumps in {selectedCity}
          </h1>
          <button
            type="button"
            className="btn-change-city-link"
            onClick={() => setIsCityModalOpen(true)}
          >
            <i className="fa-solid fa-pen"></i>
            <span>Change City</span>
          </button>
        </div>

        <p className="fuel-stations-header-desc">
          Explore 81 fuel stations and pumps in {selectedCity}. Check the address, location, phone number, and timing of nearby petrol and CNG pumps to fill the vehicle tank easily, as per your convenience. Most fuel pumps are open 24*7 to provide the services. Indian Oil, Bharat Petroleum, Hindustan Petroleum (HP), and Reliance are the popular fuel companies that have their petrol and CNG pumps in many areas of {selectedCity}.
        </p>

        {/* Quick links to Check Prices & EV Charging */}
        <div className="fuel-quick-switch-tabs">
          <button
            type="button"
            className="fuel-switch-btn active"
            onClick={() => {}}
          >
            <i className="fa-solid fa-gas-pump"></i>
            <span>Fuel Stations</span>
          </button>

          <button
            type="button"
            className="fuel-switch-btn"
            onClick={() => {
              if (onNavigateTab) onNavigateTab('/store/CheckFuelPrices');
              else if (typeof window !== 'undefined') {
                window.history.pushState({}, '', '/store/CheckFuelPrices');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }
            }}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Check Fuel Prices</span>
          </button>

          <button
            type="button"
            className="fuel-switch-btn"
            onClick={() => {
              if (onNavigateTab) onNavigateTab('/store/FindEVChargingStations');
              else if (typeof window !== 'undefined') {
                window.history.pushState({}, '', '/store/FindEVChargingStations');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }
            }}
          >
            <i className="fa-solid fa-bolt"></i>
            <span>Charging Station</span>
          </button>
        </div>
      </div>

      {/* 2. GRID OF FUEL STATIONS (MATCHING IMAGE 1) */}
      <div className="fuel-stations-grid">
        {FUEL_STATIONS_DATA.map((station) => (
          <div key={station.id} className="fuel-station-card">
            <h3 className="station-card-title">{station.name}</h3>
            <p className="station-card-address">{station.address}</p>
            <div className="station-timing-status">
              <span>{station.timings}</span>
            </div>
            {station.phone && (
              <div className="station-phone-row">
                <i className="fa-solid fa-phone"></i>
                <span>{station.phone}</span>
              </div>
            )}
            <div className="station-fuels-pills">
              {station.fuels.map((f) => (
                <span key={f} className="fuel-check-tag">
                  ✓ {f}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="btn-station-direction"
              onClick={() => handleGetDirection(station.name)}
            >
              <i className="fa-solid fa-diamond-turn-right"></i>
              <span>Get Direction</span>
            </button>
          </div>
        ))}
      </div>

      {/* City Switcher Modal */}
      {isCityModalOpen && (
        <div className="fuel-city-modal-backdrop" onClick={() => setIsCityModalOpen(false)}>
          <div className="fuel-city-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Select City for Fuel Stations</h3>
              <button type="button" onClick={() => setIsCityModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="city-options-list">
              {['Vellore', 'Chennai', 'Ranipet', 'Kanchipuram', 'Tiruvannamalai', 'Bengaluru', 'Coimbatore'].map((city) => (
                <button
                  key={city}
                  type="button"
                  className={`city-select-btn ${selectedCity === city ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCity(city);
                    if (setUserLocationCity) setUserLocationCity(city);
                    setIsCityModalOpen(false);
                    showToast(`Updated fuel stations city to ${city}`);
                  }}
                >
                  <i className="fa-solid fa-location-dot"></i>
                  <span>{city}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
