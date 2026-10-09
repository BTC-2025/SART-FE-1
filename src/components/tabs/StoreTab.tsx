'use client';

import React, { useEffect, useMemo, useState } from 'react';
import './StoreTab.css';
import { useSartStore } from '@/store/useSartStore';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type EquipmentOption = { name: string; price: number };

type Vehicle = 'Car' | 'Bike' | 'Bus/Truck' | 'Universal';
type Category = 'Mechanics' | 'Wash & Care' | 'Emergency' | 'Accessories' | 'Spare Parts';

type StoreProduct = {
  id: string;
  name: string;
  price: number;
  icon: string;
  image: string;
  vehicle: Vehicle;
  category: Category;
  section: string;
  badge: string;
  desc: string;
  duration: string;
  warranty: string;
  includes: string[];
  equipmentOptions: EquipmentOption[];
  emergency?: boolean;
};

/* ------------------------------------------------------------------ */
/* Images: every service gets its OWN keyword-based photo              */
/* ------------------------------------------------------------------ */

// Keyword list used to fetch a photo that matches the service.
// (loremflickr returns a different, relevant photo per keyword set.)
// To use your own photos, put files in /public/services/<id>.jpg and
// set IMAGE_OVERRIDES['car-7'] = '/services/car-7.jpg'.
const IMAGE_KEYWORDS: Record<string, string> = {
  // Car
  'car-1': 'car,engine,motor',
  'car-2': 'engine,mechanic,repair',
  'car-3': 'engine,oil,change',
  'car-4': 'air,filter,car',
  'car-5': 'gearbox,transmission',
  'car-6': 'clutch,car,parts',
  'car-7': 'brake,pads,disc',
  'car-8': 'brake,caliper,car',
  'car-9': 'tyre,puncture,repair',
  'car-10': 'tire,change,wheel',
  'car-11': 'wheel,alignment,car',
  'car-12': 'wheel,balancing,tire',
  'car-13': 'car,battery,terminal',
  'car-14': 'car,air,conditioning',
  'car-15': 'radiator,coolant,car',
  'car-16': 'car,suspension,shock',
  'car-17': 'steering,wheel,car',
  'car-18': 'car,wiring,electrical',
  'car-19': 'obd,scanner,car,diagnostic',
  'car-20': 'spark,plug,engine',
  'car-21': 'fuel,injector',
  'car-22': 'timing,belt,engine',
  'car-23': 'exhaust,pipe,car',
  'car-24': 'windshield,car,glass',
  'car-25': 'car,dent,repair',
  'car-26': 'car,painting,spray',
  'car-27': 'car,headlight,lamp',
  'car-28': 'car,wiper,windshield',
  'car-29': 'car,inspection,checklist',
  'car-30': 'car,insurance,claim',
  'car-31': 'car,scheduled,service,garage',
  'car-32': 'car,comprehensive,service,mechanic',
  // Bike
  'bike-1': 'motorcycle,service,garage',
  'bike-2': 'motorcycle,engine',
  'bike-3': 'motorcycle,oil,change',
  'bike-4': 'motorcycle,chain,lube',
  'bike-5': 'motorcycle,clutch',
  'bike-6': 'motorcycle,brake',
  'bike-7': 'motorcycle,brake,pads',
  'bike-8': 'motorcycle,tire,puncture',
  'bike-9': 'motorcycle,tire,wheel',
  'bike-10': 'motorcycle,battery',
  'bike-11': 'motorcycle,wiring,electrical',
  'bike-12': 'motorcycle,spark,plug',
  'bike-13': 'motorcycle,fork,suspension',
  'bike-14': 'motorcycle,wash,clean',
  'bike-15': 'motorcycle,diagnostic,mechanic',
  // Bus / Truck
  'bus-1': 'truck,diesel,engine',
  'bus-2': 'truck,engine,oil',
  'bus-3': 'truck,air,brake',
  'bus-4': 'truck,clutch',
  'bus-5': 'truck,gearbox',
  'bus-6': 'truck,tyre,heavy',
  'bus-7': 'truck,suspension,leaf,spring',
  'bus-8': 'truck,battery',
  'bus-9': 'bus,air,conditioning',
  'bus-10': 'truck,radiator',
  'bus-11': 'truck,wiring,electrical',
  'bus-12': 'bus,door,mechanism',
  'bus-13': 'bus,seats,interior',
  'bus-14': 'bus,wash,exterior',
  'bus-15': 'truck,diagnostic,engine',
  // Emergency
  'em-1': 'roadside,assistance,breakdown',
  'em-2': 'jump,start,car,battery',
  'em-3': 'flat,tire,roadside',
  'em-4': 'tow,truck,car',
  'em-5': 'fuel,can,petrol',
  'em-6': 'mechanic,roadside,breakdown',
  'em-7': 'truck,recovery,crane',
  // Wash & care
  'wash-1': 'car,wash,exterior',
  'wash-2': 'car,interior,cleaning,vacuum',
  'wash-3': 'car,foam,wash',
  'wash-4': 'car,detailing',
  'wash-5': 'ceramic,coating,car',
  'wash-6': 'car,polishing,buffing',
  'wash-7': 'engine,bay,clean',
  'wash-8': 'car,underbody,wash',
  'wash-9': 'bus,interior,clean',
  'wash-10': 'truck,wash',
  // Accessories
  'acc-1': 'ev,charger,electric,car',
  'acc-2': 'gps,tracker,vehicle',
  'acc-3': 'car,emergency,toolkit',
  'acc-4': 'tire,inflator,portable',
  'acc-5': 'car,jack,lift',
  'acc-6': 'motorcycle,tools,wrench',
  'acc-7': 'jump,starter,portable',
  'acc-8': 'dashcam,car',
  'acc-9': 'gps,navigation,car',
};

const IMAGE_OVERRIDES: Record<string, string> = {
  // 'car-7': '/services/car-7.jpg',
};

const UNSPLASH_POOLS = {
  general: [
    '1619642751034-765dfdf7c58e', '1517524206127-48bbd363f3d7', '1504215680853-026fe2a11430',
    '1492144534655-ae79c964c9d7', '1486262715619-67b85e0b08d3', '1503376710356-70d6943f65e2'
  ],
  engine: [
    '1486262715619-67b85e0b08d3', '1605810230434-7631ac76ec81', '1625034636901-b5166f21c2dc',
    '1580273916550-e323be2ae537', '1631558296726-5b98ec3423a5', '1517524206127-48bbd363f3d7'
  ],
  oil: [
    '1635787687258-2900bcbd2e60', '1580273916550-e323be2ae537', '1631558296726-5b98ec3423a5',
    '1503376710356-70d6943f65e2', '1615906655593-ad0386982a0f', '1544626159-8dd3eaf9e7a8'
  ],
  tyre: [
    '1578844251758-2f71da64c96f', '1600880292203-757bb62b4baf', '1585011664466-b7bccaa3f628',
    '1626084614144-884bc762b339', '1576404781446-59b43e34b9d0', '1611018861218-d7b81b53e8e2'
  ],
  battery: [
    '1616781297597-402927d780ba', '1615906655593-ad0386982a0f', '1594042858548-bd0620fa9275',
    '1619642751034-765dfdf7c58e', '1562259942-83281c3db77c', '1517524206127-48bbd363f3d7'
  ],
  ac: [
    '1562259942-83281c3db77c', '1607860108855-64acf2078ed9', '1544626159-8dd3eaf9e7a8',
    '1504215680853-026fe2a11430', '1486262715619-67b85e0b08d3', '1580273916550-e323be2ae537'
  ],
  paint: [
    '1601362840469-51e4d8d58785', '1625034636901-b5166f21c2dc', '1607590494488-874db3fb1fc9',
    '1492144534655-ae79c964c9d7', '1520340356584-f9917d1e521e', '1605810230434-7631ac76ec81'
  ],
  wash: [
    '1607860108855-64acf2078ed9', '1520340356584-f9917d1e521e', '1605810230434-7631ac76ec81',
    '1492144534655-ae79c964c9d7', '1503376710356-70d6943f65e2', '1601362840469-51e4d8d58785'
  ],
  bike: [
    '1558981806-ec527fa84c39', '1568772585407-9361f9bfce1f', '1449426468159-d965034fa00c',
    '1585011664466-b7bccaa3f628', '1611018861218-d7b81b53e8e2', '1563720223-14dd8edb1259'
  ],
  bus: [
    '1570125909232-eb263c188f7e', '1519003722824-194d4455a60c', '1601584115197-04ecc0da31d7',
    '1612543940173-774b9e289454', '1560662232-d17e719543e5', '1533227268428-f9ed0900f95b'
  ],
  emergency: [
    '1533227268428-f9ed0900f95b', '1560662232-d17e719543e5', '1612543940173-774b9e289454',
    '1523983088568-711115d515ea', '1517524285303-d6fc683dddf8', '1570125909232-eb263c188f7e'
  ],
  accessories: [
    '1517524285303-d6fc683dddf8', '1523983088568-711115d515ea', '1563720223-14dd8edb1259',
    '1504215680853-026fe2a11430', '1616781297597-402927d780ba', '1600880292203-757bb62b4baf'
  ],
};

const hashLock = (id: string) => Array.from(id).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);

const pickImage = (pool: string[], id: string) => {
  const photoId = pool[hashLock(id) % pool.length];
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=480&q=80`;
};

const SERVICE_IMAGES_BY_NAME: Record<string, string> = {
  "Basic Service":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHGXZTvqCjgWScDb9U6RwuRLsHt2CUyrZP24rI7QhGwcGVJ1Dk3BSuf3Gp&s=10",

  "Standard Service":
    "https://crawfordsautoservice.com/wp-content/uploads/2020/03/service-writer-auto-repair.jpg",

  "Comprehensive Service":
    "https://blogs.gomechanic.com/wp-content/uploads/2024/09/car-service_web_what-is-car-servicing.png",

  "Front Brake Pads":
    "https://c8.alamy.com/comp/T2X4GH/front-brake-discs-with-caliper-and-brake-pads-in-the-car-on-a-car-lift-in-a-workshop-T2X4GH.jpg",

  "Rear Brake Pads":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMdu81guloF0IdPejTI9yz74olsFwi-Z1TF_-eRDkeDQ&s=10",

  "Brake Repair & Bleeding":
    "https://www.winnerchev.com/static/industry-automotive/medium-images/service/brake-repair.jpeg",


  "Engine Oil Change":
    "https://loremflickr.com/800/600/car,engineoil?lock=101",

  "Engine Repair & Overhaul":
    "https://loremflickr.com/800/600/car,enginerepair?lock=106",

  "Air Filter Replacement":
    "https://loremflickr.com/800/600/car,airfilter?lock=102",

  "Spark Plug Replacement":
    "https://loremflickr.com/800/600/car,sparkplug?lock=103",

  "Fuel Injector Cleaning":
    "https://loremflickr.com/800/600/car,fuelinjector?lock=104",

  "Timing Belt Replacement":
    "https://loremflickr.com/800/600/car,timingbelt?lock=105",

  "Engine Replacement":
    "https://loremflickr.com/800/600/car,engine?lock=107",

  "Exhaust System Repair":
    "https://loremflickr.com/800/600/car,exhaust?lock=108",

  "Radiator & Coolant Service":
    "https://loremflickr.com/800/600/car,radiator?lock=109",

  "AC Service & Gas Refill":
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80",

  "Battery Testing & Replacement":
    "https://loremflickr.com/800/600/car,battery?lock=110",

  "Tyre Replacement":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",

  "Wheel Alignment":
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80",

  "Suspension Repair":
    "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800&q=80",

  "Electrical System Repair":
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",

  "Dent Removal & Body Repair":
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80",

  "Car Painting":
    "https://images.unsplash.com/photo-1503376710356-70d6943f65e2?auto=format&fit=crop&w=800&q=80",

  "Bike General Service":
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",

  "Bike Engine Repair":
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",

  "Bike Engine Oil Change":
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",

  "Bus Engine Overhaul":
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",

  "Heavy Vehicle Oil Change":
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",

  "Emergency Roadside Assistance":
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80",

  "Vehicle Towing & Recovery":
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",

  "Exterior Car Wash":
    "https://images.unsplash.com/photo-洗?auto=format&fit=crop&w=800&q=80",

  "Full Car Detailing":
    "https://images.unsplash.com/photo-1503376710356-70d6943f65e2?auto=format&fit=crop&w=800&q=80",

  "Ceramic Coating":
    "https://images.unsplash.com/photo-1503376710356-70d6943f65e2?auto=format&fit=crop&w=800&q=80",

  "Dashcam Installation":
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",

  "GPS Tracker Pro":
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",

  "Portable Tyre Inflator":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
};
const imageFor = (id: string, name: string) => {
  if (SERVICE_IMAGES_BY_NAME[name]) return SERVICE_IMAGES_BY_NAME[name];
  if (IMAGE_OVERRIDES[id]) return IMAGE_OVERRIDES[id];

  const kw = IMAGE_KEYWORDS[id] || '';
  let pool = UNSPLASH_POOLS.general;

  if (id.startsWith('wash')) pool = UNSPLASH_POOLS.wash;
  else if (id.startsWith('em-')) pool = UNSPLASH_POOLS.emergency;
  else if (id.startsWith('acc-')) pool = UNSPLASH_POOLS.accessories;
  else if (id.startsWith('bike')) pool = UNSPLASH_POOLS.bike;
  else if (id.startsWith('bus')) pool = UNSPLASH_POOLS.bus;
  else if (kw.includes('oil') || kw.includes('fluid')) pool = UNSPLASH_POOLS.oil;
  else if (kw.includes('tire') || kw.includes('tyre') || kw.includes('wheel')) pool = UNSPLASH_POOLS.tyre;
  else if (kw.includes('battery') || kw.includes('electrical')) pool = UNSPLASH_POOLS.battery;
  else if (kw.includes('air,conditioning') || kw.includes('radiator') || kw.includes('coolant')) pool = UNSPLASH_POOLS.ac;
  else if (kw.includes('paint') || kw.includes('dent') || kw.includes('body') || kw.includes('brake')) pool = UNSPLASH_POOLS.paint;
  else if (kw.includes('engine') || kw.includes('clutch') || kw.includes('gear') || kw.includes('mechanic')) pool = UNSPLASH_POOLS.engine;

  return pickImage(pool, id);
};

// Local fallback so a card never shows a broken image.
const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e8eef7"/><stop offset="1" stop-color="#cfd9e8"/>
      </linearGradient></defs>
      <rect width="480" height="360" fill="url(#g)"/>
      <text x="50%" y="52%" font-size="72" text-anchor="middle">🔧</text>
    </svg>`,
  );

/* ------------------------------------------------------------------ */
/* Repair equipment / parts catalogues (add-ons)                       */
/* ------------------------------------------------------------------ */

const P = (name: string, price: number): EquipmentOption => ({ name, price });

const parts = {
  engineOil: P('Engine oil (3.5 L)', 700),
  syntheticOil: P('Fully synthetic oil (3.5 L)', 1800),
  oilFilter: P('Oil filter', 300),
  airFilter: P('Air filter', 450),
  cabinFilter: P('AC / cabin filter', 500),
  fuelFilter: P('Fuel filter', 600),
  coolant: P('Coolant (1 L)', 350),
  sparkPlugs: P('Spark plugs (set of 4)', 600),
  battery: P('Car battery', 4500),
  spareTyre: P('Tyre (1 pc)', 3500),
  toolkit: P('Emergency toolkit', 800),
  jack: P('Car jack', 1200),
  brakePads: P('Front brake pads (set)', 1200),
  rearBrakePads: P('Rear brake pads (set)', 1100),
  brakeDisc: P('Brake disc (pair)', 2800),
  brakeFluid: P('Brake fluid', 300),
  clutchKit: P('Clutch kit', 3500),
  clutchOil: P('Clutch fluid', 250),
  gearOil: P('Transmission oil', 1500),
  shocker: P('Shock absorber (1 pc)', 2200),
  bushKit: P('Suspension bush kit', 900),
  tieRod: P('Tie-rod end', 700),
  acGas: P('AC refrigerant gas', 1200),
  acCompressor: P('AC compressor', 9500),
  radiatorCap: P('Radiator cap', 250),
  waterPump: P('Water pump', 1800),
  timingKit: P('Timing belt kit', 3200),
  fuelPump: P('Fuel pump', 3800),
  injectorCleaner: P('Injector cleaner fluid', 400),
  headlight: P('Headlight bulb (pair)', 600),
  wiperBlades: P('Wiper blades (pair)', 450),
  fuse: P('Fuse & relay set', 250),
  alternator: P('Alternator', 6500),
  starter: P('Starter motor', 4800),
  silencer: P('Silencer / muffler', 3500),
  paintTouch: P('Touch-up paint', 500),
  polishKit: P('Premium polish', 700),
  wheelWeights: P('Wheel balancing weights', 150),
  pucKit: P('Puncture repair kit', 200),
  valve: P('Tubeless valve', 80),
};

const bikeParts = {
  oil: P('Bike engine oil (1 L)', 350),
  oilFilter: P('Oil filter', 150),
  airFilter: P('Air filter', 250),
  sparkPlug: P('Spark plug', 150),
  chainLube: P('Chain lubricant', 180),
  chainSet: P('Chain & sprocket kit', 1800),
  battery: P('Bike battery', 1400),
  pucKit: P('Puncture repair kit', 200),
  inflator: P('Portable tyre inflator', 900),
  toolkit: P('Bike toolkit', 500),
  brakePads: P('Brake pads', 250),
  brakeShoe: P('Brake shoe set', 300),
  clutchPlate: P('Clutch plate set', 900),
  clutchCable: P('Clutch cable', 150),
  tyre: P('Replacement tyre', 1600),
  tube: P('Inner tube', 350),
  forkOil: P('Fork oil', 300),
  bulb: P('Headlight bulb', 180),
  fuse: P('Fuse set', 80),
};

const heavyParts = {
  oil: P('Heavy-duty engine oil (15 L)', 2500),
  oilFilter: P('Oil filter', 900),
  airFilter: P('Air filter', 1200),
  fuelFilter: P('Fuel filter', 1100),
  coolant: P('Coolant (5 L)', 1000),
  battery: P('Heavy-vehicle battery', 9000),
  tyre: P('Heavy-vehicle tyre', 12000),
  toolkit: P('Emergency toolkit', 2500),
  airHose: P('Air brake hose', 800),
  brakeChamber: P('Brake chamber', 3200),
  brakeLining: P('Brake lining set', 2800),
  clutchKit: P('Clutch plate & cover kit', 9500),
  gearOil: P('Gearbox oil (10 L)', 2200),
  leafSpring: P('Leaf spring', 5500),
  acGas: P('AC refrigerant gas', 1800),
  doorKit: P('Door mechanism kit', 3000),
  seatFoam: P('Seat foam & cover', 1800),
};

const emergencyParts = {
  jumpStarter: P('Portable jump starter', 1200),
  pucKit: P('Puncture repair kit', 300),
  inflator: P('Tyre inflator', 900),
  oilTopUp: P('Engine oil top-up', 500),
  toolkit: P('Emergency toolkit', 800),
  fuelCan: P('Fuel can (5 L)', 450),
  towRope: P('Tow rope', 600),
  warningTriangle: P('Warning triangle', 350),
  firstAid: P('First-aid kit', 450),
  stepney: P('Stepney wheel fitting', 400),
};

/* ------------------------------------------------------------------ */
/* Service builder                                                     */
/* ------------------------------------------------------------------ */

type Extra = Partial<StoreProduct>;

const service = (
  id: string,
  name: string,
  price: number,
  vehicle: Vehicle,
  category: Category,
  section: string,
  desc: string,
  duration: string,
  includes: string[],
  equipmentOptions: EquipmentOption[],
  extra: Extra = {},
): StoreProduct => ({
  id,
  name,
  price,
  vehicle,
  category,
  section,
  desc,
  duration,
  warranty: '1000 Kms or 1 Month Warranty',
  includes,
  equipmentOptions,
  image: imageFor(id, name),
  icon: 'fa-wrench',
  badge: category === 'Emergency' ? 'Emergency' : 'Service',
  ...extra,
});

/* ------------------------------------------------------------------ */
/* All services                                                        */
/* ------------------------------------------------------------------ */

const STORE_PRODUCTS: StoreProduct[] = [
  /* ============ CAR : SCHEDULED PACKAGES ============ */
  service('car-31', 'Basic Service', 3075, 'Car', 'Mechanics', 'Scheduled Packages',
    'Every 5000 Kms or 6 months (recommended). Free pick-up & drop.', '4 Hrs',
    ['Wiper Fluid Replacement', 'Battery Water Top Up', 'Car Wash', 'Interior Vacuuming (Carpet & Seats)',
      'Engine Oil Replacement', 'Oil Filter Replacement', 'Air Filter Cleaning', 'Coolant Top Up (200 ml)',
      'Heater / Spark Plugs Checking'],
    [parts.syntheticOil, parts.cabinFilter, parts.sparkPlugs, parts.wiperBlades],
    { badge: 'Popular', warranty: '1000 Kms or 3 Months Warranty' }),
  service('car-32', 'Standard Service', 4065, 'Car', 'Mechanics', 'Scheduled Packages',
    'Every 10,000 Kms or 6 months (recommended). Free pick-up & drop.', '6 Hrs',
    ['Car Scanning', 'Wiper Fluid Replacement', 'Battery Water Top Up', 'Car Wash',
      'Interior Vacuuming (Carpet & Seats)', 'Engine Oil & Filter Replacement', 'Air Filter Replacement',
      'Brake Fluid Top Up', 'Coolant Top Up', 'Spark Plug Check', 'Suspension Check'],
    [parts.syntheticOil, parts.airFilter, parts.cabinFilter, parts.fuelFilter, parts.brakeFluid],
    { badge: 'Recommended', warranty: '1000 Kms or 3 Months Warranty' }),
  service('car-33', 'Comprehensive Service', 6096, 'Car', 'Mechanics', 'Scheduled Packages',
    'Every 20,000 Kms or 12 months (recommended). Free pick-up & drop.', '8 Hrs',
    ['AC Filter Replacement', 'Fuel Filter Checking', 'Car Scanning', 'Wiper Fluid Replacement',
      'Battery Water Top Up', 'Engine Oil & Filter Replacement', 'Brake Inspection', 'Wheel Alignment Check',
      'Full Interior & Exterior Wash', 'Throttle Body Cleaning'],
    [parts.syntheticOil, parts.fuelFilter, parts.sparkPlugs, parts.coolant, parts.brakePads, parts.gearOil],
    { badge: 'Enhanced Engine Performance', warranty: '1000 Kms or 3 Months Warranty' }),

  /* ============ CAR : BRAKE MAINTENANCE ============ */
  service('car-7', 'Front Brake Pads', 1979, 'Car', 'Mechanics', 'Brake Maintenance',
    'Prices are estimated and subject to change based on part availability.', '3 Hrs',
    ['Opening & Fitting of Front Brake Pads', 'Front Brake Pads Replacement (OES)',
      'Applicable for Set of 2 Front Brake Pads', 'Inspection of Front Brake Calipers'],
    [parts.brakePads, parts.brakeDisc, parts.brakeFluid],
    { badge: 'Labour Included', warranty: '1 Month Warranty' }),
  service('car-7b', 'Rear Brake Pads', 1799, 'Car', 'Mechanics', 'Brake Maintenance',
    'Replace worn rear brake pads / shoes and check drum or disc condition.', '3 Hrs',
    ['Opening & Fitting of Rear Brake Pads', 'Inspection of Rear Brake Drum / Disc',
      'Brake Cleaning & Greasing', 'Road Test'],
    [parts.rearBrakePads, parts.brakeFluid],
    { warranty: '1 Month Warranty' }),
  service('car-8', 'Brake Repair & Bleeding', 1500, 'Car', 'Mechanics', 'Brake Maintenance',
    'Inspect and repair braking system faults, bleed lines and check master cylinder.', '3 Hrs',
    ['Brake Line Inspection', 'Brake Fluid Bleeding', 'Caliper Inspection', 'Master Cylinder Check'],
    [parts.brakeFluid, parts.brakePads, parts.brakeDisc]),

  /* ============ CAR : ENGINE & OIL ============ */
  service('car-3', 'Engine Oil Change', 1200, 'Car', 'Mechanics', 'Engine & Oil',
    'Drain old engine oil and refill with a suitable grade.', '1 Hr',
    ['Old Oil Drain', 'Oil Filter Replacement', 'Fresh Oil Refill', 'Fluid Level Check'],
    [parts.engineOil, parts.syntheticOil, parts.oilFilter]),
  service('car-4', 'Air Filter Replacement', 500, 'Car', 'Mechanics', 'Engine & Oil',
    'Replace a dirty engine air filter for better mileage and performance.', '30 Mins',
    ['Filter Box Cleaning', 'New Filter Fitting', 'Air Intake Check'],
    [parts.airFilter, parts.cabinFilter]),
  service('car-20', 'Spark Plug Replacement', 600, 'Car', 'Mechanics', 'Engine & Oil',
    'Replace worn spark plugs where applicable.', '1 Hr',
    ['Old Plug Removal', 'Gap Check', 'New Plug Fitting', 'Engine Idle Test'],
    [parts.sparkPlugs]),
  service('car-21', 'Fuel Injector Cleaning', 2000, 'Car', 'Mechanics', 'Engine & Oil',
    'Clean and inspect fuel injectors for smoother running.', '2 Hrs',
    ['Injector Ultrasonic Cleaning', 'Spray Pattern Test', 'Throttle Body Cleaning'],
    [parts.injectorCleaner, parts.fuelFilter, parts.fuelPump]),
  service('car-22', 'Timing Belt Replacement', 3500, 'Car', 'Mechanics', 'Engine & Oil',
    'Replace the timing belt according to vehicle requirements.', '5 Hrs',
    ['Timing Belt Removal', 'Tensioner Check', 'New Belt Fitting', 'Timing Alignment'],
    [parts.timingKit, parts.waterPump]),
  service('car-2', 'Engine Repair & Overhaul', 15000, 'Car', 'Mechanics', 'Engine & Oil',
    'Inspection and repair of internal engine components.', '2 Days',
    ['Engine Opening', 'Piston & Ring Check', 'Valve Grinding', 'Gasket Replacement'],
    [parts.engineOil, parts.oilFilter, parts.coolant, parts.sparkPlugs, parts.timingKit]),
  service('car-1', 'Engine Replacement', 45000, 'Car', 'Mechanics', 'Engine & Oil',
    'Replacement of a damaged engine. Final cost depends on vehicle model and engine condition.', '3-4 Days',
    ['Old Engine Removal', 'New / Reconditioned Engine Fitting', 'Fluids Refill', 'Road Test'],
    [parts.engineOil, parts.oilFilter, parts.coolant]),
  service('car-23', 'Exhaust System Repair', 1200, 'Car', 'Mechanics', 'Engine & Oil',
    'Inspect and repair exhaust leaks or damaged components.', '2 Hrs',
    ['Leak Inspection', 'Gasket Replacement', 'Welding / Clamp Repair'],
    [parts.silencer]),

  /* ============ CAR : AC SERVICE & COOLING ============ */
  service('car-14', 'AC Service & Gas Refill', 1800, 'Car', 'Mechanics', 'AC Service & Repair',
    'Inspect the air-conditioning system and refrigerant level.', '3 Hrs',
    ['AC Gas Pressure Check', 'Cooling Coil Cleaning', 'Cabin Filter Check', 'Vent Temperature Test'],
    [parts.acGas, parts.cabinFilter, parts.acCompressor]),
  service('car-15', 'Radiator & Coolant Service', 1200, 'Car', 'Mechanics', 'AC Service & Repair',
    'Inspect the cooling system and replace coolant if needed.', '2 Hrs',
    ['Radiator Flush', 'Hose Inspection', 'Coolant Refill', 'Leak Test'],
    [parts.coolant, parts.radiatorCap, parts.waterPump]),

  /* ============ CAR : BATTERIES ============ */
  service('car-13', 'Battery Testing & Replacement', 400, 'Car', 'Mechanics', 'Batteries',
    'Test battery health and replace if required.', '45 Mins',
    ['Battery Load Test', 'Terminal Cleaning', 'Alternator Charging Check'],
    [parts.battery, P('Terminal protector kit', 150)]),

  /* ============ CAR : TYRES & WHEEL CARE ============ */
  service('car-9', 'Tyre Puncture Repair', 250, 'Car', 'Mechanics', 'Tyres & Wheel Care',
    'Repair a punctured tyre where repair is safe and suitable.', '30 Mins',
    ['Puncture Location', 'Plug / Patch Repair', 'Air Pressure Fill'],
    [parts.pucKit, parts.valve, parts.spareTyre]),
  service('car-10', 'Tyre Replacement', 800, 'Car', 'Mechanics', 'Tyres & Wheel Care',
    'Tyre fitting labour. Tyre cost is additional if selected.', '1 Hr',
    ['Old Tyre Removal', 'New Tyre Fitting', 'Valve Replacement', 'Pressure Check'],
    [parts.spareTyre, parts.valve, parts.wheelWeights]),
  service('car-11', 'Wheel Alignment', 800, 'Car', 'Mechanics', 'Tyres & Wheel Care',
    'Adjust wheel angles to the vehicle specifications.', '1 Hr',
    ['Camber / Caster / Toe Check', 'Computerised Alignment', 'Steering Straight Test'],
    [parts.tieRod]),
  service('car-12', 'Wheel Balancing', 500, 'Car', 'Mechanics', 'Tyres & Wheel Care',
    'Balance wheels to reduce vibration.', '45 Mins',
    ['Wheel Removal', 'Computerised Balancing', 'Weight Fitting'],
    [parts.wheelWeights]),

  /* ============ CAR : SUSPENSION, STEERING, CLUTCH ============ */
  service('car-16', 'Suspension Repair', 2500, 'Car', 'Mechanics', 'Suspension & Fitments',
    'Inspect suspension components and identify worn parts.', '4 Hrs',
    ['Shock Absorber Check', 'Bush Inspection', 'Link Rod Check', 'Road Test'],
    [parts.shocker, parts.bushKit]),
  service('car-17', 'Steering Repair', 1800, 'Car', 'Mechanics', 'Suspension & Fitments',
    'Inspect steering components and diagnose handling issues.', '3 Hrs',
    ['Steering Rack Check', 'Tie-Rod Inspection', 'Power Steering Fluid Check'],
    [parts.tieRod, P('Power steering fluid', 450)]),
  service('car-5', 'Gearbox & Transmission Repair', 8000, 'Car', 'Mechanics', 'Clutch & Body Parts',
    'Diagnosis and repair of gearbox or transmission faults.', '1-2 Days',
    ['Gearbox Diagnosis', 'Oil Seal Replacement', 'Gear Shift Adjustment'],
    [parts.gearOil]),
  service('car-6', 'Clutch Replacement', 5500, 'Car', 'Mechanics', 'Clutch & Body Parts',
    'Repair clutch slipping, wear and engagement issues.', '6 Hrs',
    ['Clutch Plate Replacement', 'Pressure Plate Check', 'Release Bearing Check'],
    [parts.clutchKit, parts.clutchOil]),

  /* ============ CAR : ELECTRICAL, WINDSHIELD & LIGHTS ============ */
  service('car-18', 'Electrical System Repair', 1000, 'Car', 'Mechanics', 'Windshields & Lights',
    'Diagnose wiring, lighting and electrical faults.', '2 Hrs',
    ['Wiring Inspection', 'Fuse Box Check', 'Alternator & Starter Test'],
    [parts.fuse, parts.alternator, parts.starter]),
  service('car-27', 'Headlight Restoration & Bulbs', 700, 'Car', 'Mechanics', 'Windshields & Lights',
    'Restore foggy headlamps or replace bulbs.', '1 Hr',
    ['Lens Polishing', 'Bulb Replacement', 'Beam Alignment'],
    [parts.headlight]),
  service('car-28', 'Wiper & Washer Service', 450, 'Car', 'Mechanics', 'Windshields & Lights',
    'Replace wiper blades and check the washer system.', '30 Mins',
    ['Blade Replacement', 'Washer Nozzle Cleaning', 'Fluid Refill'],
    [parts.wiperBlades]),
  service('car-24', 'Windshield Replacement', 2500, 'Car', 'Mechanics', 'Windshields & Lights',
    'Replace damaged windshield glass. Final price varies by model.', '4 Hrs',
    ['Old Glass Removal', 'New Glass Fitting', 'Sealant Application'],
    [P('Windshield glass', 6500)]),

  /* ============ CAR : DENTING & PAINTING ============ */
  service('car-25', 'Dent Removal & Body Repair', 1500, 'Car', 'Mechanics', 'Denting & Painting',
    'Repair minor dents and body damage.', '1 Day',
    ['Dent Assessment', 'Panel Beating', 'Surface Finishing'],
    [parts.paintTouch]),
  service('car-26', 'Car Painting', 5000, 'Car', 'Mechanics', 'Denting & Painting',
    'Paint repair or repainting. Final quote depends on the area.', '2-3 Days',
    ['Surface Preparation', 'Primer Coat', 'Colour Match & Paint', 'Clear Coat'],
    [parts.paintTouch, parts.polishKit]),

  /* ============ CAR : INSPECTIONS & INSURANCE ============ */
  service('car-19', 'Computer Diagnostics', 700, 'Car', 'Mechanics', 'Car Inspections',
    'Scan vehicle fault codes and report detected issues.', '1 Hr',
    ['OBD Fault Code Scan', 'Sensor Check', 'Detailed Report'], []),
  service('car-29', 'Pre-Purchase Inspection (120 Points)', 1499, 'Car', 'Mechanics', 'Car Inspections',
    'Complete health check before you buy a used car.', '2 Hrs',
    ['Engine & Gearbox', 'Brakes & Suspension', 'Body & Paint Check', 'Electrical & AC', 'Written Report'], []),
  service('car-30', 'Insurance Claim Assistance', 999, 'Car', 'Mechanics', 'Insurance Claims',
    'Paperwork help and cashless repair support for insurance claims.', 'Varies',
    ['Claim Documentation', 'Surveyor Coordination', 'Cashless Repair Support'], []),

  /* ============ BIKE ============ */
  service('bike-1', 'Bike General Service', 800, 'Bike', 'Mechanics', 'Bike Services',
    'Routine two-wheeler inspection and maintenance.', '3 Hrs',
    ['Engine Oil Check', 'Chain Lubrication', 'Brake Check', 'Wash'],
    [bikeParts.oil, bikeParts.oilFilter, bikeParts.airFilter]),
  service('bike-2', 'Bike Engine Repair', 4500, 'Bike', 'Mechanics', 'Bike Services',
    'Diagnose and repair motorcycle engine problems.', '1-2 Days',
    ['Engine Diagnosis', 'Valve & Piston Check', 'Gasket Replacement'],
    [bikeParts.oil, bikeParts.oilFilter, bikeParts.sparkPlug]),
  service('bike-3', 'Bike Engine Oil Change', 350, 'Bike', 'Mechanics', 'Bike Services',
    'Drain old oil and refill with recommended motorcycle oil.', '30 Mins',
    ['Old Oil Drain', 'Fresh Oil Refill', 'Level Check'], [bikeParts.oil, bikeParts.oilFilter]),
  service('bike-4', 'Bike Chain Cleaning & Lubrication', 250, 'Bike', 'Mechanics', 'Bike Services',
    'Clean, inspect and lubricate the drive chain.', '30 Mins',
    ['Chain Degreasing', 'Slack Adjustment', 'Lubrication'], [bikeParts.chainLube, bikeParts.chainSet]),
  service('bike-5', 'Bike Clutch Repair', 900, 'Bike', 'Mechanics', 'Bike Services',
    'Inspect clutch wear and shifting problems.', '2 Hrs',
    ['Clutch Plate Check', 'Cable Adjustment', 'Shift Test'], [bikeParts.clutchPlate, bikeParts.clutchCable]),
  service('bike-6', 'Bike Brake Repair', 400, 'Bike', 'Mechanics', 'Bike Services',
    'Inspect brake pads, cables or hydraulic brakes.', '1 Hr',
    ['Brake Lever Check', 'Cable / Fluid Check', 'Pad Inspection'], [bikeParts.brakePads, bikeParts.brakeShoe]),
  service('bike-7', 'Bike Brake Pad Replacement', 350, 'Bike', 'Mechanics', 'Bike Services',
    'Replace worn brake pads.', '45 Mins',
    ['Old Pad Removal', 'New Pad Fitting', 'Brake Test'], [bikeParts.brakePads, bikeParts.brakeShoe]),
  service('bike-8', 'Bike Puncture Repair', 150, 'Bike', 'Mechanics', 'Bike Services',
    'Repair a puncture when the tyre can safely be repaired.', '20 Mins',
    ['Puncture Location', 'Patch / Plug', 'Air Fill'], [bikeParts.pucKit, bikeParts.tube]),
  service('bike-9', 'Bike Tyre Replacement', 300, 'Bike', 'Mechanics', 'Bike Services',
    'Fit a replacement tyre. Tyre cost is additional.', '45 Mins',
    ['Old Tyre Removal', 'New Tyre Fitting', 'Wheel Balancing'], [bikeParts.tyre, bikeParts.tube]),
  service('bike-10', 'Bike Battery Replacement', 250, 'Bike', 'Mechanics', 'Bike Services',
    'Test and replace a weak battery if required.', '30 Mins',
    ['Battery Test', 'Terminal Cleaning', 'Charging Check'], [bikeParts.battery]),
  service('bike-11', 'Bike Electrical Repair', 400, 'Bike', 'Mechanics', 'Bike Services',
    'Inspect lights, wiring, starter and charging system.', '1-2 Hrs',
    ['Wiring Check', 'Starter Test', 'Charging Coil Test'], [bikeParts.bulb, bikeParts.fuse]),
  service('bike-12', 'Bike Spark Plug Replacement', 200, 'Bike', 'Mechanics', 'Bike Services',
    'Replace a worn spark plug.', '20 Mins',
    ['Plug Removal', 'Gap Setting', 'New Plug Fitting'], [bikeParts.sparkPlug]),
  service('bike-13', 'Bike Suspension Repair', 700, 'Bike', 'Mechanics', 'Bike Services',
    'Inspect forks and rear suspension.', '2 Hrs',
    ['Fork Oil Check', 'Seal Inspection', 'Rear Shock Check'], [bikeParts.forkOil]),
  service('bike-14', 'Bike Washing & Polishing', 250, 'Bike', 'Wash & Care', 'Bike Services',
    'Clean the bike body and polish suitable surfaces.', '1 Hr',
    ['Foam Wash', 'Chain Clean', 'Body Polish'], []),
  service('bike-15', 'Bike Engine Diagnostics', 500, 'Bike', 'Mechanics', 'Bike Services',
    'Check engine symptoms and compatible diagnostic codes.', '1 Hr',
    ['Fault Scan', 'Compression Check', 'Report'], []),

  /* ============ BUS & TRUCK ============ */
  service('bus-1', 'Bus Engine Overhaul', 85000, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Heavy-vehicle engine inspection, repair or rebuilding.', '5-7 Days',
    ['Engine Teardown', 'Liner & Piston Check', 'Injector Calibration'],
    [heavyParts.oil, heavyParts.oilFilter, heavyParts.fuelFilter, heavyParts.coolant]),
  service('bus-2', 'Heavy Vehicle Oil Change', 3500, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Replace engine oil and filters according to vehicle specifications.', '2 Hrs',
    ['Oil Drain', 'Filter Replacement', 'Fresh Oil Refill'],
    [heavyParts.oil, heavyParts.oilFilter, heavyParts.airFilter]),
  service('bus-3', 'Bus Air Brake Service', 5500, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Inspect air-brake components and pressure systems.', '4 Hrs',
    ['Compressor Check', 'Brake Chamber Check', 'Pressure Leak Test'],
    [heavyParts.airHose, heavyParts.brakeChamber, heavyParts.brakeLining]),
  service('bus-4', 'Bus Clutch Repair', 12000, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Inspect and repair heavy-vehicle clutch components.', '1 Day',
    ['Clutch Plate Check', 'Pressure Plate Check', 'Linkage Adjustment'], [heavyParts.clutchKit]),
  service('bus-5', 'Bus Gearbox Repair', 18000, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Diagnose and repair transmission problems.', '2 Days',
    ['Gearbox Opening', 'Synchro Check', 'Oil Seal Replacement'], [heavyParts.gearOil]),
  service('bus-6', 'Bus & Truck Tyre Service', 1200, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Inspect tyres, pressure and damage. Replacement tyre is additional.', '2 Hrs',
    ['Pressure Check', 'Tread Inspection', 'Rotation'], [heavyParts.tyre]),
  service('bus-7', 'Bus Suspension Repair', 6500, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Inspect suspension and heavy-vehicle components.', '1 Day',
    ['Leaf Spring Check', 'Shock Absorber Check', 'Bush Check'], [heavyParts.leafSpring]),
  service('bus-8', 'Bus Battery Service', 700, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Test battery and charging system.', '1 Hr',
    ['Load Test', 'Terminal Cleaning', 'Alternator Check'], [heavyParts.battery]),
  service('bus-9', 'Bus AC Repair', 2500, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Inspect passenger air-conditioning components.', '4 Hrs',
    ['Gas Pressure Check', 'Compressor Check', 'Duct Inspection'], [heavyParts.acGas]),
  service('bus-10', 'Bus Radiator Repair', 2500, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Diagnose cooling-system leaks and overheating.', '4 Hrs',
    ['Leak Test', 'Radiator Flush', 'Hose Check'], [heavyParts.coolant]),
  service('bus-11', 'Bus Electrical Repair', 1800, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Diagnose lighting, wiring and electrical faults.', '3 Hrs',
    ['Wiring Check', 'Lighting Check', 'Alternator Test'], []),
  service('bus-12', 'Bus Door Repair', 1200, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Inspect and repair passenger-door mechanisms.', '3 Hrs',
    ['Hinge & Lock Check', 'Pneumatic Cylinder Check', 'Alignment'], [heavyParts.doorKit]),
  service('bus-13', 'Bus Seat Repair', 1500, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Repair or replace damaged passenger-seat components.', '1 Day',
    ['Frame Repair', 'Cushion Replacement', 'Cover Stitching'], [heavyParts.seatFoam]),
  service('bus-14', 'Bus Exterior Wash', 1200, 'Bus/Truck', 'Wash & Care', 'Bus & Truck Services',
    'Wash exterior surfaces of buses and commercial vehicles.', '2 Hrs',
    ['Pressure Wash', 'Foam Wash', 'Glass Cleaning'], []),
  service('bus-15', 'Truck Engine Diagnostics', 1800, 'Bus/Truck', 'Mechanics', 'Bus & Truck Services',
    'Diagnose engine warning codes and performance issues.', '2 Hrs',
    ['Fault Code Scan', 'Smoke Test', 'Report'], []),

  /* ============ EMERGENCY / SOS ============ */
  service('em-1', 'Emergency Roadside Assistance', 500, 'Universal', 'Emergency', 'SOS Service',
    'Request roadside assistance for a breakdown. Distance or after-hours fees may apply.', '30-60 Mins',
    ['On-Spot Diagnosis', 'Minor Repairs', 'Tow Recommendation'],
    [emergencyParts.jumpStarter, emergencyParts.pucKit, emergencyParts.inflator, emergencyParts.oilTopUp,
    emergencyParts.toolkit, emergencyParts.warningTriangle],
    { emergency: true, badge: '24/7 Assistance', warranty: 'Service Guarantee' }),
  service('em-2', 'Battery Jump-Start', 400, 'Universal', 'Emergency', 'SOS Service',
    'Get help starting a vehicle with a discharged battery.', '30 Mins',
    ['Battery Test', 'Jump Start', 'Alternator Check'],
    [emergencyParts.jumpStarter], { emergency: true, warranty: 'Service Guarantee' }),
  service('em-3', 'Emergency Puncture Assistance', 350, 'Universal', 'Emergency', 'SOS Service',
    'Request roadside help for a flat tyre.', '30 Mins',
    ['Puncture Repair', 'Stepney Fitting', 'Air Fill'],
    [emergencyParts.pucKit, emergencyParts.inflator, emergencyParts.stepney],
    { emergency: true, warranty: 'Service Guarantee' }),
  service('em-4', 'Vehicle Towing & Recovery', 1500, 'Universal', 'Emergency', 'SOS Service',
    'Arrange towing for a disabled vehicle. Distance and vehicle type affect price.', '1-2 Hrs',
    ['Flatbed / Hook Towing', 'Safe Loading', 'Drop to Garage'],
    [P('Extended-distance towing', 1000), emergencyParts.towRope],
    { emergency: true, warranty: 'Service Guarantee' }),
  service('em-5', 'Emergency Fuel Delivery', 300, 'Universal', 'Emergency', 'SOS Service',
    'Request fuel delivery. Fuel cost and availability are additional.', '30 Mins',
    ['Petrol / Diesel Delivery', 'Fuel Line Prime'],
    [emergencyParts.fuelCan], { emergency: true, warranty: 'Service Guarantee' }),
  service('em-6', 'Emergency Mechanic Visit', 700, 'Universal', 'Emergency', 'SOS Service',
    'Request a mechanic to inspect a vehicle breakdown.', '45 Mins',
    ['On-Spot Inspection', 'Quick Repair', 'Cost Estimate'],
    [emergencyParts.toolkit, emergencyParts.jumpStarter, emergencyParts.oilTopUp, emergencyParts.firstAid],
    { emergency: true, warranty: 'Service Guarantee' }),
  service('em-7', 'Bus & Truck Recovery', 5000, 'Bus/Truck', 'Emergency', 'SOS Service',
    'Request heavy-vehicle recovery. Final charges depend on distance and equipment.', '2-4 Hrs',
    ['Crane / Heavy Tow', 'Safe Recovery', 'Drop to Workshop'],
    [emergencyParts.towRope, emergencyParts.warningTriangle],
    { emergency: true, warranty: 'Service Guarantee' }),

  /* ============ WASH & CARE (CAR SPA) ============ */
  service('wash-1', 'Exterior Car Wash', 350, 'Car', 'Wash & Care', 'Car Spa & Cleaning',
    'Remove dirt, dust and mud from the vehicle exterior.', '45 Mins',
    ['Pressure Wash', 'Body Dry', 'Tyre Dressing'], []),
  service('wash-2', 'Interior Deep Cleaning', 600, 'Car', 'Wash & Care', 'Car Spa & Cleaning',
    'Clean seats, carpets, mats and dashboard surfaces.', '2 Hrs',
    ['Seat Vacuuming', 'Dashboard Polish', 'Mat Cleaning'], [P('Fabric protector', 400)]),
  service('wash-3', 'Foam Wash', 450, 'Car', 'Wash & Care', 'Car Spa & Cleaning',
    'Clean the exterior using vehicle-safe foam products.', '1 Hr',
    ['Foam Application', 'Soft Wash', 'Wipe Down'], []),
  service('wash-7', 'Engine Bay Cleaning', 700, 'Car', 'Wash & Care', 'Car Spa & Cleaning',
    'Clean accessible engine-bay surfaces using suitable methods.', '1 Hr',
    ['Degreasing', 'Gentle Rinse', 'Dressing'], []),
  service('wash-8', 'Underbody Cleaning', 800, 'Car', 'Wash & Care', 'Car Spa & Cleaning',
    'Remove mud and debris from the vehicle underbody.', '1 Hr',
    ['Underbody Wash', 'Wheel Arch Cleaning'], [P('Underbody coating', 1500)]),
  service('wash-9', 'Bus Interior Cleaning', 1800, 'Bus/Truck', 'Wash & Care', 'Car Spa & Cleaning',
    'Clean passenger areas, seats and floors.', '3 Hrs',
    ['Seat Cleaning', 'Floor Scrubbing', 'Window Cleaning'], []),
  service('wash-10', 'Truck Exterior Wash', 1000, 'Bus/Truck', 'Wash & Care', 'Car Spa & Cleaning',
    'Clean the exterior of a commercial vehicle.', '2 Hrs',
    ['Pressure Wash', 'Cab Cleaning'], []),

  /* ============ DETAILING ============ */
  service('wash-4', 'Full Car Detailing', 4500, 'Car', 'Wash & Care', 'Detailing Services',
    'Detailed interior and exterior cleaning.', '1 Day',
    ['Exterior Wash & Clay Bar', 'Interior Deep Clean', 'Wax Finish'], [parts.polishKit]),
  service('wash-5', 'Ceramic Coating', 12000, 'Car', 'Wash & Care', 'Detailing Services',
    'Apply paint protection after suitable surface preparation.', '2 Days',
    ['Paint Decontamination', 'Ceramic Application', 'Curing'], [P('Extra top-up layer', 2500)]),
  service('wash-6', 'Rubbing & Polishing', 1800, 'Car', 'Wash & Care', 'Detailing Services',
    'Improve the appearance of suitable painted surfaces.', '4 Hrs',
    ['Scratch Removal', 'Machine Polishing', 'Wax Finish'], [parts.polishKit]),

  /* ============ ACCESSORIES & SPARE PARTS ============ */
  service('acc-1', 'Smart Fast Charger Pro', 18500, 'Universal', 'Accessories', 'Accessories & Spare Parts',
    'Vehicle charging equipment. Confirm compatibility before purchase.', 'Same Day',
    ['Wall Mount Kit', 'Installation Support'], [], { warranty: '1 Year Warranty' }),
  service('acc-2', 'GPS Tracker Pro', 4200, 'Universal', 'Accessories', 'Accessories & Spare Parts',
    'GPS tracking accessory with compatible wiring and setup.', '1 Hr',
    ['Device', 'Wiring', 'App Setup'], [], { warranty: '1 Year Warranty' }),
  service('acc-3', 'Car Emergency Toolkit', 800, 'Car', 'Accessories', 'Accessories & Spare Parts',
    'Basic emergency tools for common roadside situations.', 'Instant',
    ['Spanner Set', 'Screwdrivers', 'Tow Rope'], []),
  service('acc-4', 'Portable Tyre Inflator', 900, 'Universal', 'Accessories', 'Accessories & Spare Parts',
    'Portable inflator for compatible vehicle tyres.', 'Instant',
    ['12V Compressor', 'Pressure Gauge'], []),
  service('acc-5', 'Car Jack', 1200, 'Car', 'Accessories', 'Accessories & Spare Parts',
    'Vehicle-compatible jack for tyre changes. Use on stable ground.', 'Instant',
    ['Hydraulic Jack', 'Wheel Spanner'], []),
  service('acc-6', 'Bike Toolkit', 500, 'Bike', 'Accessories', 'Accessories & Spare Parts',
    'Basic tools for common motorcycle adjustments.', 'Instant',
    ['Spanner Set', 'Plug Spanner'], []),
  service('acc-7', 'Jump Starter', 1800, 'Universal', 'Accessories', 'Accessories & Spare Parts',
    'Portable jump starter suitable for compatible vehicle batteries.', 'Instant',
    ['Jump Cables', 'Carry Case'], []),
  service('acc-8', 'Dashcam Installation', 1500, 'Car', 'Accessories', 'Accessories & Spare Parts',
    'Installation labour for a compatible dashcam. Device cost may be additional.', '1 Hr',
    ['Mounting', 'Wire Hiding', 'Setup'], [P('Dashcam (1080p)', 3500), P('Memory card 64GB', 600)]),
  service('acc-9', 'Vehicle GPS Installation', 800, 'Universal', 'Accessories', 'Accessories & Spare Parts',
    'Installation labour for a compatible GPS tracker.', '1 Hr',
    ['Mounting', 'Wiring', 'Activation'], []),
];

/* ------------------------------------------------------------------ */
/* UI config                                                           */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  'All', 'Cars', 'Bikes', 'Buses & Trucks', 'Emergency',
  'Wash & Care', 'Accessories', 'Mechanics',
];

const CATEGORY_ICONS: Record<string, string> = {
  All: 'fa-border-all',
  Cars: 'fa-car',
  Bikes: 'fa-motorcycle',
  'Buses & Trucks': 'fa-bus',
  Emergency: 'fa-truck-medical',
  'Wash & Care': 'fa-shower',
  Accessories: 'fa-box',
  Mechanics: 'fa-wrench',
};

const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function StoreTab() {
  const { activeTab, addToCart } = useSartStore();

  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<Record<string, string[]>>({});
  const [vehicleModel, setVehicleModel] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => setMounted(true), []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return STORE_PRODUCTS.filter((product) => {
      const categoryMatch =
        activeCategory === 'All' ||
        (activeCategory === 'Cars' && product.vehicle === 'Car') ||
        (activeCategory === 'Bikes' && product.vehicle === 'Bike') ||
        (activeCategory === 'Buses & Trucks' && product.vehicle === 'Bus/Truck') ||
        (activeCategory === 'Emergency' && product.category === 'Emergency') ||
        (activeCategory === 'Wash & Care' && product.category === 'Wash & Care') ||
        (activeCategory === 'Accessories' && ['Accessories', 'Spare Parts'].includes(product.category)) ||
        (activeCategory === 'Mechanics' && product.category === 'Mechanics');

      const searchMatch =
        !query ||
        `${product.name} ${product.desc} ${product.vehicle} ${product.category} ${product.section} ${product.includes.join(' ')}`
          .toLowerCase()
          .includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  // Group by section, keeping first-seen order
  const sections = useMemo(() => {
    const map = new Map<string, StoreProduct[]>();
    filteredProducts.forEach((p) => {
      if (!map.has(p.section)) map.set(p.section, []);
      map.get(p.section)!.push(p);
    });
    return Array.from(map.entries());
  }, [filteredProducts]);

  const getSelectedEquipment = (product: StoreProduct) =>
    product.equipmentOptions.filter((o) =>
      (selectedEquipment[product.id] ?? []).includes(o.name),
    );

  const getTotal = (product: StoreProduct) =>
    product.price + getSelectedEquipment(product).reduce((sum, o) => sum + o.price, 0);

  const toggleEquipment = (productId: string, name: string) => {
    setSelectedEquipment((current) => {
      const selected = current[productId] ?? [];
      const next = selected.includes(name)
        ? selected.filter((n) => n !== name)
        : [...selected, name];
      return { ...current, [productId]: next };
    });
  };

  const handleAddToCart = (product: StoreProduct) => {
    const chosen = getSelectedEquipment(product);
    const model = vehicleModel[product.id]?.trim();
    const equipmentNames = chosen.map((i) => i.name);

    const cartName = [
      product.name,
      model ? `Vehicle: ${model}` : '',
      equipmentNames.length ? `Add-ons: ${equipmentNames.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    addToCart({
      id: product.id,
      name: cartName,
      price: getTotal(product),
      icon: product.icon,
      category: product.category,
      quantity: 1,
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openReactModal', { detail: 'modal-cart' }));
    }
  };

  if (!mounted) return null;

  return (
    <section className={`tab-screen ${activeTab === 'store' ? 'active' : ''}`} id="tab-store">
      {/* Top categories */}
      <div className="store-top-nav">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={`store-nav-item ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            <i className={`fa-solid ${CATEGORY_ICONS[category] ?? 'fa-wrench'}`}></i>
            <span>{category}</span>
          </button>
        ))}
      </div>

      <div className="store-layout">
        <div className="store-main-content">
          {/* Search */}
          <div style={{ margin: '12px 0' }}>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services, parts, vehicles…"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #ddd',
                borderRadius: 8,
                fontSize: 14,
              }}
            />
          </div>

          {sections.map(([sectionName, products]) => (
            <div key={sectionName}>
              <h2 className="store-section-title">{sectionName}</h2>

              <div className="store-horizontal-list">
                {products.map((product) => {
                  const originalPrice = Math.round(product.price * 1.25);
                  const isOpen = expanded[product.id];
                  const visibleIncludes = isOpen ? product.includes : product.includes.slice(0, 6);
                  const hiddenCount = product.includes.length - 6;
                  const chosen = selectedEquipment[product.id] ?? [];

                  return (
                    <div key={product.id} className="store-horizontal-card">
                      <div className="card-image-col">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => {
                            if (e.currentTarget.src !== FALLBACK_IMAGE) {
                              e.currentTarget.src = FALLBACK_IMAGE;
                            }
                          }}
                        />
                      </div>

                      <div className="card-content-col">
                        <div className="card-header-row">
                          <h3>
                            {product.name}
                            {product.badge && (
                              <span
                                style={{
                                  marginLeft: 8,
                                  fontSize: 10,
                                  padding: '2px 6px',
                                  borderRadius: 3,
                                  color: '#fff',
                                  background: product.emergency ? '#d32f2f' : '#4caf50',
                                  verticalAlign: 'middle',
                                }}
                              >
                                {product.badge}
                              </span>
                            )}
                          </h3>
                          <span className="time-pill">
                            <i className="fa-regular fa-clock"></i> {product.duration}
                          </span>
                        </div>

                        <div className="card-desc-text">
                          <span>• {product.warranty}</span>
                          <span>• Free Pick-up &amp; Drop</span>
                          <p style={{ marginTop: 4, color: '#666' }}>{product.desc}</p>
                        </div>

                        {/* What's included */}
                        <div className="card-inclusions">
                          {visibleIncludes.map((item) => (
                            <div key={item} className="inclusion-item">
                              <i className="fa-solid fa-check"></i> {item}
                            </div>
                          ))}
                          {hiddenCount > 0 && (
                            <div
                              className="inclusion-link"
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                setExpanded((c) => ({ ...c, [product.id]: !c[product.id] }))
                              }
                            >
                              {isOpen ? 'Show less' : `+ ${hiddenCount} more View All`}
                            </div>
                          )}
                        </div>

                        {/* Repair equipment / parts add-ons */}
                        {product.equipmentOptions.length > 0 && (
                          <div style={{ marginTop: 10 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                              Add repair equipment / parts
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
                              {product.equipmentOptions.map((option) => (
                                <label
                                  key={option.name}
                                  style={{ fontSize: 12, display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={chosen.includes(option.name)}
                                    onChange={() => toggleEquipment(product.id, option.name)}
                                  />
                                  {option.name} (+{formatPrice(option.price)})
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Vehicle model */}
                        {product.vehicle !== 'Universal' || product.emergency ? (
                          <input
                            type="text"
                            value={vehicleModel[product.id] ?? ''}
                            onChange={(e) =>
                              setVehicleModel((c) => ({ ...c, [product.id]: e.target.value }))
                            }
                            placeholder="Vehicle model (e.g. Swift VXi 2019)"
                            style={{
                              marginTop: 10,
                              width: '100%',
                              maxWidth: 320,
                              padding: '6px 10px',
                              border: '1px solid #ddd',
                              borderRadius: 6,
                              fontSize: 12,
                            }}
                          />
                        ) : null}

                        <div className="card-footer-row">
                          <div className="pricing-info">
                            <span className="price-old">Rs. {originalPrice.toLocaleString('en-IN')}</span>
                            <span className="price-new">{formatPrice(getTotal(product))}</span>
                          </div>
                          <button className="btn-add-cart" onClick={() => handleAddToCart(product)}>
                            + ADD TO CART
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
              No services found. Try another category or search term.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}