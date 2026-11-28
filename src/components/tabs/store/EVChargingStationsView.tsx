'use client';

import React, { useState } from 'react';
import './EVChargingStationsView.css';

interface ChargingStation {
  id: string;
  name: string;
  address: string;
  timings: string;
  phone?: string;
  connectors: string[];
}

const EV_CHARGING_STATIONS_DATA: ChargingStation[] = [
  {
    id: 'ev-1',
    name: 'Zulaikha Motors Charging Station',
    address: '10/8 3rd Main Road Below Telephone Exchange Bridge Sai Nagar Ambattur Industrial Estate',
    timings: 'Open now • 10:00 AM - 07:00 PM',
    phone: '9742211172',
    connectors: ['CCS-II', 'CHAdeMO', 'Socket', '3PIN']
  },
  {
    id: 'ev-2',
    name: 'Diselecti Automotive Pvt Ltd',
    address: '60/2 61/2 East Coast Road Chettiyar Agaram',
    timings: 'Open now • 10:00 AM - 07:00 PM',
    phone: '9884866993',
    connectors: ['AC TYPE 2']
  },
  {
    id: 'ev-3',
    name: 'Tata Power - FPL Vehicles Charging Station',
    address: 'No. 824 Annasali Nandnam Charging Station',
    timings: 'Open now • 12:00 AM - 11:59 PM',
    phone: '18008332233',
    connectors: ['CCS-II']
  },
  {
    id: 'ev-4',
    name: 'COC - Koyambedu Charging Station',
    address: 'Station, Kaliamman Main Road, Koyambedu',
    timings: 'Open now • 12:00 AM - 11:59 PM',
    connectors: ['CCS-II']
  },
  {
    id: 'ev-5',
    name: 'Kazam - Sait Colony Charging Station',
    address: '26, Sait Colony 1st Street, Egmore',
    timings: 'Open now • 12:00 AM - 11:59 PM',
    phone: '9789514174',
    connectors: ['Bharat AC001']
  },
  {
    id: 'ev-6',
    name: 'Hotel Vadapalani (Private - Charger)',
    address: '61 Inner Ring Rd Thiru Nagar Colony NGO Colony',
    timings: 'Open now • 12:00 AM - 11:59 PM',
    phone: '9742211172',
    connectors: ['CCS-II', 'CHAdeMO']
  }
];

const EV_BRANDS = [
  { id: 'audi', name: 'Audi', icon: 'fa-solid fa-circle-notch' },
  { id: 'bmw', name: 'BMW', icon: 'fa-solid fa-compass' },
  { id: 'tata', name: 'Tata', icon: 'fa-solid fa-car-side' },
  { id: 'nissan', name: 'Nissan', icon: 'fa-solid fa-shield-halved' },
  { id: 'porsche', name: 'Porsche', icon: 'fa-solid fa-shield' },
  { id: 'mercedes', name: 'Mercedes-Benz', icon: 'fa-solid fa-certificate' }
];

interface EVChargingStationsViewProps {
  showToast: (msg: string) => void;
  userLocationCity?: string;
  setUserLocationCity?: (city: string) => void;
  onNavigateTab?: (path: string) => void;
}

export default function EVChargingStationsView({
  showToast,
  userLocationCity = 'Chennai',
  setUserLocationCity,
  onNavigateTab
}: EVChargingStationsViewProps) {
  const [selectedCity, setSelectedCity] = useState<string>('Chennai');
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  const navigateTo = (path: string) => {
    if (onNavigateTab) {
      onNavigateTab(path);
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleGetDirection = (stationName: string) => {
    showToast(`Opening GPS navigation for ${stationName}`);
  };

  return (
    <div className="ev-charging-page-wrapper animate-fade-in">
      {/* 1. TOP HEADER BANNER (MATCHING IMAGE 3) */}
      <div className="ev-header-card">
        <div className="ev-title-row">
          <h1 className="ev-main-title">
            EV Charging Station in {selectedCity}
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

        <p className="ev-header-subtext">
          There are 112 EV charging stations in {selectedCity} to charge your electric car. Find out the address, contact details and directions of an EV charging station near you below. You may also find out which charging station offers fast charging facility and if it&apos;s compatible with CCS/CHAdeMO standards. Also, check out Top Electric cars in India which are available for sale.
        </p>

        {/* Quick Hub Navigation Pills */}
        <div className="ev-quick-switch-tabs">
          <button
            type="button"
            className="ev-switch-btn"
            onClick={() => navigateTo('/store/FuelStations')}
          >
            <i className="fa-solid fa-gas-pump"></i>
            <span>Fuel Stations</span>
          </button>

          <button
            type="button"
            className="ev-switch-btn"
            onClick={() => navigateTo('/store/CheckFuelPrices')}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Check Fuel Prices</span>
          </button>

          <button
            type="button"
            className="ev-switch-btn active"
            onClick={() => {}}
          >
            <i className="fa-solid fa-bolt"></i>
            <span>Charging Station</span>
          </button>

          <button
            type="button"
            className="ev-switch-btn"
            onClick={() => navigateTo('/store/ServiceCenters')}
          >
            <i className="fa-solid fa-wrench"></i>
            <span>Service Centers</span>
          </button>
        </div>
      </div>

      {/* 2. ELECTRIC CAR CHARGING STATION BRANDS ROW (MATCHING IMAGE 3) */}
      <div className="ev-brands-card">
        <h2 className="ev-section-title">
          Electric Car Charging Station in {selectedCity}
        </h2>

        <div className="ev-brands-grid">
          {EV_BRANDS.map((brand) => (
            <div
              key={brand.id}
              className={`ev-brand-item-card ${selectedBrand === brand.name ? 'selected' : ''}`}
              onClick={() => {
                const next = selectedBrand === brand.name ? '' : brand.name;
                setSelectedBrand(next);
                showToast(next ? `Filtering stations compatible with ${brand.name}` : 'Showing all charging stations');
              }}
            >
              <div className="ev-brand-logo-circle">
                <i className={brand.icon}></i>
              </div>
              <span className="ev-brand-name">{brand.name}</span>
            </div>
          ))}
        </div>

        <div className="ev-view-all-brands-row">
          <button
            type="button"
            className="btn-view-all-brands"
            onClick={() => showToast('Displaying 24+ global EV manufacturers')}
          >
            <span>View All Brands</span>
            <i className="fa-solid fa-circle-chevron-down"></i>
          </button>
        </div>
      </div>

      {/* 3. EV CHARGING STATIONS 3-COLUMN GRID (MATCHING IMAGE 3) */}
      <div className="ev-stations-grid">
        {EV_CHARGING_STATIONS_DATA.map((station) => (
          <div key={station.id} className="ev-station-card">
            <h3 className="ev-station-title">{station.name}</h3>
            <p className="ev-station-address">{station.address}</p>

            <div className="ev-station-timings">
              <span>{station.timings}</span>
            </div>

            {station.phone && (
              <div className="ev-station-phone">
                <i className="fa-solid fa-phone"></i>
                <span>{station.phone}</span>
              </div>
            )}

            <div className="ev-connectors-row">
              {station.connectors.map((connector) => (
                <span key={connector} className="connector-check-badge">
                  ✓ {connector}
                </span>
              ))}
            </div>

            <button
              type="button"
              className="btn-ev-direction"
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
        <div className="ev-city-modal-backdrop" onClick={() => setIsCityModalOpen(false)}>
          <div className="ev-city-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Select City for EV Charging Stations</h3>
              <button type="button" onClick={() => setIsCityModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="city-options-list">
              {['Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi NCR', 'Pune', 'Coimbatore', 'Vellore'].map((city) => (
                <button
                  key={city}
                  type="button"
                  className={`city-select-btn ${selectedCity === city ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCity(city);
                    if (setUserLocationCity) setUserLocationCity(city);
                    setIsCityModalOpen(false);
                    showToast(`Updated EV charging stations for ${city}`);
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
