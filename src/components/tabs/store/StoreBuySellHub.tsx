'use client';

import React, { useState, useEffect } from 'react';
import UsedCarCatalogView from './UsedCarCatalogView';
import SellVehicleView from './SellVehicleView';
import { VehicleShowcaseItem } from '../storeData';
import {
  Carbike360FindNewView,
  Carbike360LatestView,
  Carbike360UpcomingView,
  Carbike360ElectricView,
  Carbike360TrendingView,
  Carbike360UsedCatalogView,
  Carbike360DealershipsView
} from '../CarBike360Views';

interface StoreBuySellHubProps {
  showToast: (msg: string) => void;
  userLocationCity: string;
  setUserLocationCity: (city: string) => void;
  topVehicleSearch: string;
  setTopVehicleSearch: (s: string) => void;
  setOnRoadPriceModalVehicle: (v: VehicleShowcaseItem | null) => void;
  selectedFuelCity: string;
  setActiveHubTab: (tab: any) => void;
}

export default function StoreBuySellHub({
  showToast,
  userLocationCity,
  setUserLocationCity,
  topVehicleSearch,
  setTopVehicleSearch,
  setOnRoadPriceModalVehicle,
  selectedFuelCity,
  setActiveHubTab
}: StoreBuySellHubProps) {
  // CarDekho Buy / Sell view mode: 'buy' vs 'sell'
  const [cardekhoViewMode, setCardekhoViewMode] = useState<'buy' | 'sell'>('buy');
  const [cardekhoSelectedType, setCardekhoSelectedType] = useState<string>('All');
  const [cardekhoCityFilter, setCardekhoCityFilter] = useState<string>('All Cities');

  // Synchronize with URL /store/Buy&Sell/SellVehicle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkSellUrl = () => {
        const p = decodeURIComponent(window.location.pathname.toLowerCase());
        if (p.includes('sellvehicle') || p.includes('valuation') || p.includes('checkprice')) {
          setCardekhoViewMode('sell');
        } else {
          setCardekhoViewMode('buy');
        }
      };
      checkSellUrl();
      window.addEventListener('popstate', checkSellUrl);
      return () => window.removeEventListener('popstate', checkSellUrl);
    }
  }, []);

  const handleNavigateToSell = () => {
    setCardekhoViewMode('sell');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/store/Buy&Sell/SellVehicle');
    }
    showToast('Switched to Sell Vehicle Portal');
  };

  const handleNavigateToBuy = () => {
    setCardekhoViewMode('buy');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/store/Buy&Sell');
    }
    showToast('Returned to Certified Vehicles Catalog');
  };

  // CarBike360.com page mode
  const [carbike360PageMode, setCarbike360PageMode] = useState<
    | 'portal_home'
    | 'find_new'
    | 'latest'
    | 'upcoming'
    | 'electric'
    | 'trending'
    | 'used_catalog'
    | 'dealerships'
  >('portal_home');

  // CarBike360 Left Sidebar Filters
  const [cb360PriceRange, setCb360PriceRange] = useState<string>('all');
  const [cb360SelectedBrands, setCb360SelectedBrands] = useState<string[]>([]);
  const [cb360SelectedBodyTypes, setCb360SelectedBodyTypes] = useState<string[]>([]);
  const [cb360SelectedFuels, setCb360SelectedFuels] = useState<string[]>([]);
  const [cb360SelectedTransmissions, setCb360SelectedTransmissions] = useState<string[]>([]);
  const [cb360SelectedSeating, setCb360SelectedSeating] = useState<string>('all');
  const [cb360SortBy, setCb360SortBy] = useState<'popular' | 'price_low' | 'price_high' | 'rating'>('popular');

  // CarBike360 Upcoming Cars Filter Bar
  const [cb360UpcomingBrand, setCb360UpcomingBrand] = useState<string>('All Brands');
  const [cb360UpcomingBodyType, setCb360UpcomingBodyType] = useState<string>('All Body Types');
  const [cb360UpcomingBudget, setCb360UpcomingBudget] = useState<string>('All Prices');
  const [cb360FaqOpenIndex, setCb360FaqOpenIndex] = useState<number | null>(0);

  return (
    <section className="sart-buysell-main-page">
      {/* 1. SELL VEHICLE VIEW (http://localhost:3005/store/Buy&Sell/SellVehicle) */}
      {cardekhoViewMode === 'sell' ? (
        <SellVehicleView
          onBackToBuy={handleNavigateToBuy}
          showToast={showToast}
          userLocationCity={userLocationCity}
        />
      ) : carbike360PageMode === 'portal_home' ? (
        /* 2. DEFAULT OVERVIEW ON http://localhost:3005/store/Buy&Sell */
        /* SPLIT 2-COLUMN LAYOUT: IMAGE 1 (LEFT SIDEBAR FILTERS) + IMAGE 2 (RIGHT USED CARS GRID) */
        <UsedCarCatalogView
          showToast={showToast}
          userLocationCity={userLocationCity}
          setUserLocationCity={setUserLocationCity}
          onSelectSellVehicle={handleNavigateToSell}
        />
      ) : (
        /* 3. DEDICATED CARBIKE360 SUB-PAGES */
        <>
          <div className="cb360-quick-status-bar animate-fade-in">
            <div className="cb360-quick-status-left">
              <span className="cb360-active-mode-badge">
                <i className="fa-solid fa-layer-group"></i>
                {carbike360PageMode === 'find_new' ? 'CarBike360 • New Cars in India' :
                  carbike360PageMode === 'latest' ? 'CarBike360 • Latest Cars in India' :
                    carbike360PageMode === 'upcoming' ? 'CarBike360 • Upcoming Cars 2026' :
                      carbike360PageMode === 'electric' ? 'CarBike360 • 100% Electric Vehicles' :
                        carbike360PageMode === 'trending' ? 'CarBike360 • Trending Cars' :
                          carbike360PageMode === 'used_catalog' ? 'CarBike360 • Certified Pre-Owned' : 'CarBike360 • Dealerships'}
              </span>
              <span className="cb360-active-city-note">
                <i className="fa-solid fa-location-dot"></i> City: <strong>{userLocationCity}</strong>
              </span>
            </div>
            <button
              type="button"
              className="cb360-top-return-portal-btn"
              onClick={() => {
                setCarbike360PageMode('portal_home');
                showToast('Returned to Certified Cars Catalog');
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back to Certified Cars</span>
            </button>
          </div>

          {carbike360PageMode === 'find_new' && (
            <Carbike360FindNewView
              cardekhoSelectedType={cardekhoSelectedType}
              setCardekhoSelectedType={setCardekhoSelectedType}
              cb360PriceRange={cb360PriceRange}
              setCb360PriceRange={setCb360PriceRange}
              cb360SelectedBrands={cb360SelectedBrands}
              setCb360SelectedBrands={setCb360SelectedBrands}
              cb360SelectedBodyTypes={cb360SelectedBodyTypes}
              setCb360SelectedBodyTypes={setCb360SelectedBodyTypes}
              cb360SelectedFuels={cb360SelectedFuels}
              setCb360SelectedFuels={setCb360SelectedFuels}
              cb360SelectedTransmissions={cb360SelectedTransmissions}
              setCb360SelectedTransmissions={setCb360SelectedTransmissions}
              cb360SelectedSeating={cb360SelectedSeating}
              setCb360SelectedSeating={setCb360SelectedSeating}
              cb360SortBy={cb360SortBy}
              setCb360SortBy={setCb360SortBy}
              userLocationCity={userLocationCity}
              onSelectOnRoadPrice={(v) => setOnRoadPriceModalVehicle(v)}
              onBackToPortal={() => setCarbike360PageMode('portal_home')}
              showToast={showToast}
            />
          )}

          {carbike360PageMode === 'latest' && (
            <Carbike360LatestView
              userLocationCity={userLocationCity}
              onSelectOnRoadPrice={(v) => setOnRoadPriceModalVehicle(v)}
              onBackToPortal={() => setCarbike360PageMode('portal_home')}
              showToast={showToast}
              onSelectBrand={(brand) => {
                setCarbike360PageMode('find_new');
                setCb360SelectedBrands([brand]);
                showToast(`Filtered for ${brand} cars`);
              }}
            />
          )}

          {carbike360PageMode === 'upcoming' && (
            <Carbike360UpcomingView
              userLocationCity={userLocationCity}
              cb360UpcomingBrand={cb360UpcomingBrand}
              setCb360UpcomingBrand={setCb360UpcomingBrand}
              cb360UpcomingBodyType={cb360UpcomingBodyType}
              setCb360UpcomingBodyType={setCb360UpcomingBodyType}
              cb360UpcomingBudget={cb360UpcomingBudget}
              setCb360UpcomingBudget={setCb360UpcomingBudget}
              cb360FaqOpenIndex={cb360FaqOpenIndex}
              setCb360FaqOpenIndex={setCb360FaqOpenIndex}
              onBackToPortal={() => setCarbike360PageMode('portal_home')}
              showToast={showToast}
            />
          )}

          {carbike360PageMode === 'electric' && (
            <Carbike360ElectricView
              userLocationCity={userLocationCity}
              onSelectOnRoadPrice={(v) => setOnRoadPriceModalVehicle(v)}
              onBackToPortal={() => setCarbike360PageMode('portal_home')}
              showToast={showToast}
            />
          )}

          {carbike360PageMode === 'trending' && (
            <Carbike360TrendingView
              userLocationCity={userLocationCity}
              onSelectOnRoadPrice={(v) => setOnRoadPriceModalVehicle(v)}
              onBackToPortal={() => setCarbike360PageMode('portal_home')}
              showToast={showToast}
            />
          )}

          {carbike360PageMode === 'used_catalog' && (
            <Carbike360UsedCatalogView
              cardekhoSelectedType={cardekhoSelectedType}
              setCardekhoSelectedType={setCardekhoSelectedType}
              userLocationCity={userLocationCity}
              setUserLocationCity={setUserLocationCity}
              cardekhoCityFilter={cardekhoCityFilter}
              setCardekhoCityFilter={setCardekhoCityFilter}
              onBackToPortal={() => setCarbike360PageMode('portal_home')}
              showToast={showToast}
            />
          )}

          {carbike360PageMode === 'dealerships' && (
            <Carbike360DealershipsView
              userLocationCity={userLocationCity}
              setUserLocationCity={setUserLocationCity}
              onBackToPortal={() => setCarbike360PageMode('portal_home')}
              showToast={showToast}
            />
          )}
        </>
      )}
    </section>
  );
}
