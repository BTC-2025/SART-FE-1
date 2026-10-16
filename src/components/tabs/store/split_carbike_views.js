const fs = require('fs');

const file = fs.readFileSync('src/components/tabs/CarBike360Views.tsx', 'utf8');
const lines = file.split('\n');

// Find start of Carbike360UsedCatalogView
const usedCatalogStartIdx = lines.findIndex(l => l.includes('export function Carbike360UsedCatalogView'));
// Find start of Carbike360DealershipsView
const dealershipsStartIdx = lines.findIndex(l => l.includes('export function Carbike360DealershipsView'));
// Find start of TYRE_CATALOG_DATA
const tyresStartIdx = lines.findIndex(l => l.includes('export const TYRE_CATALOG_DATA'));

console.log({ usedCatalogStartIdx, dealershipsStartIdx, tyresStartIdx });

// 1. CarBike360UsedCatalogView.tsx
const usedCatalogLines = lines.slice(usedCatalogStartIdx, dealershipsStartIdx);
const usedCatalogHeader = `'use client';

import React, { useState, useMemo } from 'react';
import {
  VehicleShowcaseItem,
  VEHICLE_SHOWCASE_DATA
} from './storeData';
`;
fs.writeFileSync('src/components/tabs/CarBike360UsedCatalogView.tsx', usedCatalogHeader + '\n' + usedCatalogLines.join('\n'), 'utf8');

// 2. CarBike360TyresView.tsx
const tyresLines = lines.slice(tyresStartIdx);
const tyresHeader = `'use client';

import React, { useState, useMemo, useRef } from 'react';
`;
fs.writeFileSync('src/components/tabs/CarBike360TyresView.tsx', tyresHeader + '\n' + tyresLines.join('\n'), 'utf8');

// 3. Clean CarBike360Views.tsx: remove UsedCatalog and Tyres, import and re-export them
const remainingLines1 = lines.slice(0, usedCatalogStartIdx);
const remainingLines2 = lines.slice(dealershipsStartIdx, tyresStartIdx);

const newCarBike360Views = remainingLines1.join('\n') + '\n\n' + remainingLines2.join('\n') + `

// Re-export modular views
export { Carbike360UsedCatalogView } from './CarBike360UsedCatalogView';
export { Carbike360TyresHubView, TYRE_CATALOG_DATA } from './CarBike360TyresView';
export type { TyreProductItem } from './CarBike360TyresView';
`;

fs.writeFileSync('src/components/tabs/CarBike360Views.tsx', newCarBike360Views, 'utf8');
console.log('Successfully split CarBike360Views.tsx into modular files!');
