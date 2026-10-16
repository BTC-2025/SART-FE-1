const fs = require('fs');

const file = fs.readFileSync('src/components/tabs/store/StoreBuySellHub.tsx', 'utf8');
const lines = file.split('\n');

// Find portal home start
const portalStartIdx = lines.findIndex(l => l.includes("carbike360PageMode === 'portal_home' && ("));
console.log('portalStartIdx:', portalStartIdx);

// Extract lines from portalStartIdx to lines.length - 8
const portalLines = lines.slice(portalStartIdx, lines.length - 8);

const portalHeader = `'use client';

import React from 'react';
import {
  VEHICLE_SHOWCASE_DATA,
  AUTOMOTIVE_NEWS_DATA,
  VEHICLE_VIDEO_REVIEWS,
  POPULAR_COMPARISON_PAIRS,
  UPCOMING_CARS_FAQS
} from '../storeData';
import { BRANDS_BY_VEHICLE, MODELS_BY_BRAND } from '../storeProductsData';

interface StoreBuySellPortalOverviewProps {
  cardekhoVehicleCondition: 'new' | 'used';
  cardekhoSelectedType: string;
  cardekhoSearchBy: 'budget' | 'brand';
  cardekhoBrandFilter: string;
  setCardekhoBrandFilter: (b: string) => void;
  cardekhoModelFilter: string;
  setCardekhoModelFilter: (m: string) => void;
  cardekhoBodyTypeFilter: string;
  setCardekhoBodyTypeFilter: (bt: string) => void;
  cardekhoBudgetFilter: string;
  setCardekhoBudgetFilter: (bg: string) => void;
  homeCarSubCategory: string;
  setHomeCarSubCategory: (s: string) => void;
  homeBikeSubCategory: string;
  setHomeBikeSubCategory: (s: string) => void;
  homeCommercialSubCategory: string;
  setHomeCommercialSubCategory: (s: string) => void;
  userLocationCity: string;
  selectedFuelCity: string;
  showToast: (msg: string) => void;
  setActiveHubTab: (tab: any) => void;
  setCarbike360PageMode: (mode: any) => void;
  setCardekhoSelectedType: (type: string) => void;
  setCardekhoSearchBy: (s: any) => void;
}

export function StoreBuySellPortalOverview(props: StoreBuySellPortalOverviewProps) {
  const {
    cardekhoVehicleCondition,
    cardekhoSelectedType,
    cardekhoSearchBy,
    cardekhoBrandFilter,
    setCardekhoBrandFilter,
    cardekhoModelFilter,
    setCardekhoModelFilter,
    cardekhoBodyTypeFilter,
    setCardekhoBodyTypeFilter,
    cardekhoBudgetFilter,
    setCardekhoBudgetFilter,
    homeCarSubCategory,
    setHomeCarSubCategory,
    homeBikeSubCategory,
    setHomeBikeSubCategory,
    homeCommercialSubCategory,
    setHomeCommercialSubCategory,
    userLocationCity,
    selectedFuelCity,
    showToast,
    setActiveHubTab,
    setCarbike360PageMode,
    setCardekhoSelectedType,
    setCardekhoSearchBy
  } = props;

  return (
`;

// Save StoreBuySellPortalOverview.tsx
const portalJsx = portalLines.join('\n');
fs.writeFileSync('src/components/tabs/store/StoreBuySellPortalOverview.tsx', portalHeader + portalJsx + '\n  );\n}\n', 'utf8');

// Now update StoreBuySellHub.tsx to use StoreBuySellPortalOverview
const topLines = lines.slice(0, portalStartIdx);
const newHubContent = topLines.join('\n') + `
                {/* B. DEFAULT PORTAL OVERVIEW (Modularized into StoreBuySellPortalOverview) */}
                {carbike360PageMode === 'portal_home' && (
                  <StoreBuySellPortalOverview
                    cardekhoVehicleCondition={cardekhoVehicleCondition}
                    cardekhoSelectedType={cardekhoSelectedType}
                    cardekhoSearchBy={cardekhoSearchBy}
                    cardekhoBrandFilter={cardekhoBrandFilter}
                    setCardekhoBrandFilter={setCardekhoBrandFilter}
                    cardekhoModelFilter={cardekhoModelFilter}
                    setCardekhoModelFilter={setCardekhoModelFilter}
                    cardekhoBodyTypeFilter={cardekhoBodyTypeFilter}
                    setCardekhoBodyTypeFilter={setCardekhoBodyTypeFilter}
                    cardekhoBudgetFilter={cardekhoBudgetFilter}
                    setCardekhoBudgetFilter={setCardekhoBudgetFilter}
                    homeCarSubCategory={homeCarSubCategory}
                    setHomeCarSubCategory={setHomeCarSubCategory}
                    homeBikeSubCategory={homeBikeSubCategory}
                    setHomeBikeSubCategory={setHomeBikeSubCategory}
                    homeCommercialSubCategory={homeCommercialSubCategory}
                    setHomeCommercialSubCategory={setHomeCommercialSubCategory}
                    userLocationCity={userLocationCity}
                    selectedFuelCity={selectedFuelCity}
                    showToast={showToast}
                    setActiveHubTab={setActiveHubTab}
                    setCarbike360PageMode={setCarbike360PageMode}
                    setCardekhoSelectedType={setCardekhoSelectedType}
                    setCardekhoSearchBy={setCardekhoSearchBy}
                  />
                )}
            </>
          )}
          </section>
  );
}
`;

// Add import of StoreBuySellPortalOverview at top of StoreBuySellHub.tsx
const finalHub = "import { StoreBuySellPortalOverview } from './StoreBuySellPortalOverview';\n" + newHubContent;
fs.writeFileSync('src/components/tabs/store/StoreBuySellHub.tsx', finalHub, 'utf8');
console.log('Successfully modularized StoreBuySellHub.tsx into StoreBuySellPortalOverview.tsx!');
