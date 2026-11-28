'use client';

import React, { useState, useEffect } from 'react';
import FuelStationsView from './FuelStationsView';
import CheckFuelPricesView from './CheckFuelPricesView';
import EVChargingStationsView from './EVChargingStationsView';
import ServiceCentersView from './ServiceCentersView';
import StoreFuelHub from './StoreFuelHub';

interface FuelEnergyPortalsHubProps {
  showToast: (msg: string) => void;
  selectedFuelCity: string;
  setSelectedFuelCity: React.Dispatch<React.SetStateAction<string>>;
  userLocationCity?: string;
  setUserLocationCity?: (city: string) => void;
}

export type FuelEnergyPortalView =
  | 'hub_overview'
  | 'fuel_stations'
  | 'check_prices'
  | 'ev_charging'
  | 'service_centers';

export default function FuelEnergyPortalsHub({
  showToast,
  selectedFuelCity,
  setSelectedFuelCity,
  userLocationCity = 'Chennai',
  setUserLocationCity
}: FuelEnergyPortalsHubProps) {
  const [activePortal, setActivePortal] = useState<FuelEnergyPortalView>('hub_overview');

  const resolvePortalFromPath = (pathname: string): FuelEnergyPortalView => {
    const p = decodeURIComponent(pathname.toLowerCase());
    if (p.includes('fuelstations')) return 'fuel_stations';
    if (p.includes('checkfuelprices')) return 'check_prices';
    if (p.includes('findevchargingstations') || p.includes('chargingstation')) return 'ev_charging';
    if (p.includes('servicecenters') || p.includes('servicecenter')) return 'service_centers';
    return 'hub_overview';
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updatePortal = () => {
        const detected = resolvePortalFromPath(window.location.pathname);
        setActivePortal(detected);
      };

      updatePortal();
      window.addEventListener('popstate', updatePortal);
      return () => window.removeEventListener('popstate', updatePortal);
    }
  }, []);

  const handleNavigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      const nextPortal = resolvePortalFromPath(path);
      setActivePortal(nextPortal);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section className="fuel-energy-portals-hub">
      {/* 1. FIND FUEL STATIONS (MATCHING IMAGE 1: http://localhost:3005/store/FuelStations) */}
      {activePortal === 'fuel_stations' && (
        <FuelStationsView
          showToast={showToast}
          userLocationCity={userLocationCity || selectedFuelCity}
          setUserLocationCity={setUserLocationCity}
          onNavigateTab={handleNavigate}
        />
      )}

      {/* 2. CHECK FUEL PRICES (MATCHING IMAGE 2: http://localhost:3005/store/CheckFuelPrices) */}
      {activePortal === 'check_prices' && (
        <CheckFuelPricesView
          showToast={showToast}
          userLocationCity={userLocationCity || selectedFuelCity}
          setUserLocationCity={setUserLocationCity}
          onNavigateTab={handleNavigate}
        />
      )}

      {/* 3. FIND EV CHARGING STATIONS (MATCHING IMAGE 3: http://localhost:3005/store/FindEVChargingStations) */}
      {activePortal === 'ev_charging' && (
        <EVChargingStationsView
          showToast={showToast}
          userLocationCity={userLocationCity || selectedFuelCity}
          setUserLocationCity={setUserLocationCity}
          onNavigateTab={handleNavigate}
        />
      )}

      {/* 4. SERVICE CENTERS (MATCHING IMAGE 4: http://localhost:3005/store/ServiceCenters) */}
      {activePortal === 'service_centers' && (
        <ServiceCentersView
          showToast={showToast}
          userLocationCity={userLocationCity || selectedFuelCity}
          setUserLocationCity={setUserLocationCity}
          onNavigateTab={handleNavigate}
        />
      )}

      {/* 5. DEFAULT EV & FUEL LIVE DIRECTORY OVERVIEW */}
      {activePortal === 'hub_overview' && (
        <StoreFuelHub
          showToast={showToast}
          selectedFuelCity={selectedFuelCity}
          setSelectedFuelCity={setSelectedFuelCity}
        />
      )}
    </section>
  );
}
