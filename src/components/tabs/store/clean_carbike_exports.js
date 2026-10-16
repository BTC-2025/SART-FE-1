const fs = require('fs');
let file = fs.readFileSync('src/components/tabs/CarBike360Views.tsx', 'utf8');

const idx = file.indexOf('/* 24. CARBIKE360 TYRES');
if (idx !== -1) {
  const start = file.lastIndexOf('/* -----', idx);
  file = file.slice(0, start) + `// Re-export modular views
export { Carbike360UsedCatalogView } from './CarBike360UsedCatalogView';
export { Carbike360TyresHubView, TYRE_CATALOG_DATA } from './CarBike360TyresView';
export type { TyreProductItem } from './CarBike360TyresView';
`;
  fs.writeFileSync('src/components/tabs/CarBike360Views.tsx', file, 'utf8');
  console.log('Cleaned CarBike360Views.tsx successfully');
}
