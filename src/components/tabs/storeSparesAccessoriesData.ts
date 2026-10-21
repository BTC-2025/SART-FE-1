import { StoreProduct } from './storeProductsData';

/* ------------------------------------------------------------------ */
/* 1. EXTENDED VEHICLE SPECIFIC ACCESSORIES & SPARES DATA               */
/* ------------------------------------------------------------------ */

export interface SpareSubCategoryItem {
  id: string;
  name: string;
  items: string[];
}

export interface VehicleSpareCategory {
  id: string;
  name: string;
  icon: string;
  subCategories: SpareSubCategoryItem[];
}

// 11 Detailed Categories based on User Reference Image
export const BIKE_DETAILED_CATEGORIES: VehicleSpareCategory[] = [
  {
    id: 'bike_engine',
    name: '1. Engine & Internal Components',
    icon: 'fa-gears',
    subCategories: [
      { id: 'piston_cyl', name: 'Piston & Cylinder Assembly', items: ['Piston', 'Piston Rings', 'Piston Pin', 'Cylinder Block', 'Cylinder Head'] },
      { id: 'valves_timing', name: 'Valves & Timing', items: ['Inlet/Exhaust Valves', 'Valve Springs', 'Rocker Arms', 'Camshaft', 'Timing Chain', 'Tensioner'] },
      { id: 'crank_bearings', name: 'Crankshaft & Bearings', items: ['Crankshaft Assembly', 'Connecting Rod', 'Crank Bearings', 'Oil Pump'] },
      { id: 'gaskets_seals', name: 'Gaskets & Seals', items: ['Engine Head Gasket', 'Full Packing Kit', 'Oil Seals'] }
    ]
  },
  {
    id: 'bike_transmission',
    name: '2. Transmission & Clutch System',
    icon: 'fa-shuffle',
    subCategories: [
      { id: 'clutch_assy', name: 'Clutch Assembly', items: ['Clutch Plates (Friction & Steel)', 'Clutch Housing', 'Clutch Hub', 'Clutch Center', 'Clutch Push Rod', 'Clutch Cable'] },
      { id: 'gearbox_drive', name: 'Gearbox & Drive', items: ['Gear Shift Lever', 'Gear Drum', 'Transmission Gears', 'Drive Chain', 'Front/Rear Sprockets', 'Chain Adjuster'] },
      { id: 'belt_cvt', name: 'Belt & CVT (Scooters)', items: ['V-Belt', 'Variator Plate', 'Roller Weights', 'Clutch Shoe Assembly'] }
    ]
  },
  {
    id: 'bike_fuel_air',
    name: '3. Fuel & Air Intake System',
    icon: 'fa-gas-pump',
    subCategories: [
      { id: 'fuel_supply', name: 'Fuel Supply', items: ['Fuel Tank', 'Fuel/Petrol Cock', 'Fuel Pump', 'Carburetor / Throttle Body FI', 'Fuel Filter'] },
      { id: 'air_filtration', name: 'Air Filtration', items: ['Air Filter Element', 'Air Suction Valve', 'Breather Hose'] },
      { id: 'exhaust_sys', name: 'Exhaust', items: ['Exhaust Pipe', 'Header Bend Pipe', 'Muffler / Silencer', 'Heat Shield'] }
    ]
  },
  {
    id: 'bike_electrical',
    name: '4. Electrical & Ignition System',
    icon: 'fa-bolt',
    subCategories: [
      { id: 'power_charging', name: 'Power & Charging', items: ['Battery', 'Wiring Harness Kit', 'Regulator / Rectifier', 'Stator Coil / Alternator'] },
      { id: 'ignition_start', name: 'Ignition & Starting', items: ['Spark Plug', 'Ignition Coil', 'CDI / TCI Unit', 'ECU', 'Starter Motor', 'Self-Start Bendix', 'Starter Relay'] },
      { id: 'switches_sensors', name: 'Switches & Sensors', items: ['Ignition Key Switch', 'Handle Switch Assembly', 'Side Stand Sensor', 'Neutral Switch', 'ABS Module'] }
    ]
  },
  {
    id: 'bike_lighting',
    name: '5. Lighting & Signalling',
    icon: 'fa-lightbulb',
    subCategories: [
      { id: 'head_tail', name: 'Head & Tail', items: ['Headlight Assembly (LED/Bulb)', 'Reflector Visor', 'Tail Light Assembly'] },
      { id: 'indicators_extras', name: 'Indicators & Extras', items: ['Turn Signal Indicators', 'Flasher Relay', 'DRLs', 'License Plate Light'] }
    ]
  },
  {
    id: 'bike_braking',
    name: '6. Braking System',
    icon: 'fa-circle-stop',
    subCategories: [
      { id: 'drum_brakes', name: 'Drum Brakes', items: ['Brake Shoes', 'Brake Drum Plate', 'Brake Cams', 'Brake Rods & Springs'] },
      { id: 'disc_brakes', name: 'Disc Brakes', items: ['Brake Disc Rotor', 'Brake Pads (Sintered/Ceramic)', 'Brake Caliper', 'Master Cylinder', 'Brake Fluid Reservoir', 'Brake Hoses'] },
      { id: 'controls', name: 'Controls', items: ['Front Brake Lever', 'Rear Brake Pedal / Foot Lever'] }
    ]
  },
  {
    id: 'bike_suspension',
    name: '7. Suspension & Steering',
    icon: 'fa-arrows-up-down',
    subCategories: [
      { id: 'front_susp', name: 'Front Suspension', items: ['Front Fork Inner Tubes', 'Outer Tubes', 'Fork Oil Seals', 'Fork Cone Set'] },
      { id: 'rear_susp', name: 'Rear Suspension', items: ['Rear Shock Absorbers', 'Mono-Shock Absorber'] },
      { id: 'steering', name: 'Steering', items: ['Handlebar', 'Handle Riser', 'Triple Tree', 'Steering Stem Nut'] }
    ]
  },
  {
    id: 'bike_tyres_wheels',
    name: '8. Wheels, Tyres & Rubber Parts',
    icon: 'fa-circle-notch',
    subCategories: [
      { id: 'wheels_tyres', name: 'Wheels & Tyres', items: ['Tubeless Tyres', 'Tube Tyres', 'Alloy Wheels', 'Spoked Rims', 'Wheel Hub', 'Inner Tubes'] },
      { id: 'rubber_cushions', name: 'Rubber Cushions & Mounts', items: ['Chain Coupling Rubbers', 'Engine Mounting Bushes', 'Footrest Rubbers', 'Gear Lever Rubbers'] }
    ]
  },
  {
    id: 'bike_body_ergo',
    name: '9. Body & Ergonomics',
    icon: 'fa-motorcycle',
    subCategories: [
      { id: 'panels_fairing', name: 'Panels & Fairings', items: ['Front Nose Cowl', 'Side Panels', 'Tail Panel', 'Front/Rear Mudguards', 'Tyre Hugger'] },
      { id: 'seating_frame', name: 'Seating & Frame', items: ['Rider & Pillion Seat', 'Seat Lock / Cable', 'Grab Rail', 'Chassis / Subframe'] },
      { id: 'stands_guards', name: 'Stands & Guards', items: ['Center Stand', 'Side Stand', 'Kickstand Spring', 'Crash Guard / Leg Guard', 'Sari Guard', 'Engine Sump Guard'] }
    ]
  },
  {
    id: 'bike_cluster_dash',
    name: '10. Instrument Cluster & Dash',
    icon: 'fa-gauge-high',
    subCategories: [
      { id: 'dash_meters', name: 'Dashboard & Display', items: ['Digital TFT Display', 'Analog Speedometer', 'Tachometer / RPM Meter', 'Fuel Gauge', 'Meter Glass Lens', 'Speedometer Cable'] }
    ]
  },
  {
    id: 'bike_aftermarket',
    name: '11. Aftermarket, Wear & Touring Accessories',
    icon: 'fa-helmet-safety',
    subCategories: [
      { id: 'riding_gear', name: 'Riding Wear & Protective Gear', items: ['Full Face Helmets', 'Flip-up Modular Helmets', 'Riding Goggles / Visors', 'Armored Riding Jackets', 'Riding Pants', 'Riding Gloves', 'Biking Boots', 'Knee & Elbow Guards'] },
      { id: 'lighting_touring', name: 'Lighting & Electronics', items: ['Auxiliary LED Fog Lights', 'Spotlights', 'Handlebar Mount Switch', 'Fast Mobile USB Charger', 'Vibration Dampener Phone Mount'] },
      { id: 'luggage_touring', name: 'Luggage & Comfort', items: ['Magnetic Tank Bags', 'Waterproof Saddlebags', 'Top Box / Tail Bag', 'Gel Seat Cushion Cover', 'All-Weather Bike Body Cover'] },
      { id: 'crash_protection', name: 'Custom Protection & Styling', items: ['Frame Sliders', 'Knuckle Guards / Handguards', 'Radiator Grill Guard', 'Headlight Grill Mesh'] }
    ]
  }
];

// Universal / Car Specific Spares Categories (Matching reference: Trims, Bumper, Mirrors, Suspension, Tyres, Belts, etc.)
export const CAR_DETAILED_CATEGORIES: VehicleSpareCategory[] = [
  {
    id: 'car_trims_body',
    name: 'Trims & Body Panels',
    icon: 'fa-car-side',
    subCategories: [
      { id: 'car_bumper', name: 'Bumper', items: ['Front Bumper', 'Rear Bumper', 'Bumper Trim', 'Bumper Bracket', 'Front Grill'] },
      { id: 'car_mirrors', name: 'Mirrors', items: ['Interior Mirror', 'Mirror Glass', 'Outside Mirror (ORVM)', 'ORVM Cover', 'Mirror Motor'] },
      { id: 'car_panels', name: 'Body Panels', items: ['Inner Wing Panel', 'Sill Trim', 'Spoiler', 'Emblem & Monogram', 'Fender Lining', 'Bonnet / Hood'] }
    ]
  },
  {
    id: 'car_suspension_steering',
    name: 'Suspension and Arms',
    icon: 'fa-arrows-up-down',
    subCategories: [
      { id: 'car_susp_arms', name: 'Control Arms & Links', items: ['Lower Control Arm', 'Upper Wishbone', 'Stabilizer Link Rod', 'Ball Joint', 'Suspension Bush Kit'] },
      { id: 'car_shocks_struts', name: 'Shocks & Struts', items: ['Front Shock Absorber', 'Rear Strut Assembly', 'Coil Spring', 'Strut Mount Bearing', 'Buffer Pad'] }
    ]
  },
  {
    id: 'car_transmission',
    name: 'Transmission & Drivetrain',
    icon: 'fa-gears',
    subCategories: [
      { id: 'car_clutch', name: 'Clutch Parts', items: ['Clutch Plate & Disc', 'Clutch Pressure Plate', 'Release Bearing', 'Flywheel', 'Clutch Master Cylinder'] },
      { id: 'car_axle_drive', name: 'Axles & Driveshaft', items: ['CV Joint Kit', 'Drive Shaft Assembly', 'Axle Boot Kit', 'Transmission Mount'] }
    ]
  },
  {
    id: 'car_tyres_alloys',
    name: 'Tyres and Alloys',
    icon: 'fa-circle-notch',
    subCategories: [
      { id: 'car_radials', name: 'Radial Tyres', items: ['185/65 R15 Radial', '195/55 R16 Tubeless', '215/60 R17 SUV Tyres', 'All-Terrain 4x4 Tyres', 'Run-Flat Tyres'] },
      { id: 'car_alloys_tpms', name: 'Alloys & TPMS', items: ['Diamond Cut Alloy Wheels', 'Solar TPMS Wireless Sensor', 'Puncture Repair Kit', 'Digital Tyre Inflator'] }
    ]
  },
  {
    id: 'car_engine_fluids',
    name: 'Engine, Oils & Lubricants',
    icon: 'fa-oil-can',
    subCategories: [
      { id: 'car_oils', name: 'Engine Oils & Coolants', items: ['Fully Synthetic 5W-40', 'Semi-Synthetic 10W-30', 'Diesel Engine Oil 15W-40', 'Coolant & Antifreeze', 'Brake Fluid DOT 4'] },
      { id: 'car_filtration', name: 'Filters & Spark Plugs', items: ['Oil Filter', 'Engine Air Filter', 'Cabin AC Filter', 'Fuel Filter', 'Iridium Spark Plugs'] }
    ]
  },
  {
    id: 'car_belts_rollers',
    name: 'Belts Chains and Rollers',
    icon: 'fa-ring',
    subCategories: [
      { id: 'car_timing_belt', name: 'Timing Belts & Kits', items: ['Timing Belt Kit', 'Water Pump with Timing Belt', 'Camshaft Timing Chain', 'Tensioner Pulley'] },
      { id: 'car_serpentine', name: 'Drive Belts & Idlers', items: ['Alternator Serpentine Belt', 'AC Compressor Belt', 'Idler Pulley', 'Tensioner Bearing'] }
    ]
  },
  {
    id: 'car_braking_sys',
    name: 'Brake System & Rotors',
    icon: 'fa-circle-stop',
    subCategories: [
      { id: 'car_disc_brakes', name: 'Disc & Calipers', items: ['Front Brake Pads (Ceramic)', 'Rear Brake Pads', 'Ventilated Brake Rotors', 'Brake Caliper Assembly', 'Brake Hose Pipe'] },
      { id: 'car_abs_cylinders', name: 'Hydraulics & ABS', items: ['Brake Master Cylinder', 'Brake Booster', 'ABS Wheel Speed Sensor', 'Handbrake Cable'] }
    ]
  },
  {
    id: 'car_electronics_dash',
    name: 'Dashboard, Dashcams & Infotainment',
    icon: 'fa-video',
    subCategories: [
      { id: 'car_dashcam', name: 'Smart Dashcams', items: ['4K UHD Dual Channel Dashcam', 'Night Vision Parking Dashcam', 'GPS 4G Connected Dashcam', 'Rear View Mirror Cam'] },
      { id: 'car_audio', name: 'Touchscreen Audio & Gadgets', items: ['Android Auto / CarPlay Touchscreen 10-inch', 'High-Fidelity Component Speakers', 'Wireless MagSafe Car Charger Mount', 'OBD-II Smart Diagnostic Scanner'] }
    ]
  },
  {
    id: 'car_care_detailing',
    name: 'Car Care and Detailing',
    icon: 'fa-spray-can-sparkles',
    subCategories: [
      { id: 'car_interiors', name: 'Interior Accessories', items: ['7D Luxury Custom Fit Foot Mats', 'Perforated Leatherette Seat Covers', 'Memory Foam Neck Pillows', 'Sunshades & Magnetic Curtains'] },
      { id: 'car_detailing', name: 'Ceramic & Wash Care', items: ['Graphene Ceramic Coating 10H', 'Carnauba Liquid Polish', 'Frameless Silicone Wiper Blades', 'Heavy Duty Jump Starter 24000mAh'] }
    ]
  },
  {
    id: 'car_towbar_tow',
    name: 'Towbar Parts & Emergency',
    icon: 'fa-trailer',
    subCategories: [
      { id: 'car_towing', name: 'Towbars & Recovery', items: ['Heavy Duty Tow Hook', 'Tow Rope 5-Ton', 'Jumper Cables', 'Warning Triangle Hazard Kit', 'Luggage Roof Rails'] }
    ]
  }
];

// Truck / Heavy Commercial Categories
export const TRUCK_DETAILED_CATEGORIES: VehicleSpareCategory[] = [
  {
    id: 'truck_diesel_engine',
    name: 'Heavy Diesel Engine & Turbo',
    icon: 'fa-gears',
    subCategories: [
      { id: 'truck_turbo', name: 'Turbo & Intercooler', items: ['Turbocharger Assembly', 'Intercooler Hoses', 'EGR Valve Kit', 'Injector Nozzle Set'] },
      { id: 'truck_engine_parts', name: 'Engine Blocks & Liners', items: ['Cylinder Liners', 'Heavy Piston & Rings', 'Crankshaft Bearings', 'Water Pump Heavy Duty'] }
    ]
  },
  {
    id: 'truck_air_brakes',
    name: 'Air Brakes & Pneumatic System',
    icon: 'fa-circle-stop',
    subCategories: [
      { id: 'truck_brake_chambers', name: 'Brake Chambers & Valves', items: ['Type 24/30 Spring Brake Chamber', 'Foot Brake Valve', 'Dual Brake Valve', 'Brake Drum & Liners'] },
      { id: 'truck_air_dryer', name: 'Air Supply & Compressor', items: ['Air Dryer Cartridge', 'Air Compressor Head', 'Unloader Valve', 'Nylon Air Hoses'] }
    ]
  },
  {
    id: 'truck_suspension_leaf',
    name: 'Leaf Springs & Heavy Axle',
    icon: 'fa-arrows-up-down',
    subCategories: [
      { id: 'truck_leaf', name: 'Leaf Springs & U-Bolts', items: ['Multi-Leaf Spring Assembly', 'Parabolic Springs', 'Heavy U-Bolts with Nuts', 'Shackle Pins & Bushes'] },
      { id: 'truck_axles', name: 'Heavy Axle & Hubs', items: ['Crown Wheel Pinion Set', 'Axle Shaft', 'Heavy Wheel Hub Bearings', 'King Pin Kit'] }
    ]
  },
  {
    id: 'truck_heavy_tyres',
    name: 'Commercial Tyres & Wheels',
    icon: 'fa-circle-notch',
    subCategories: [
      { id: 'truck_tyres', name: 'Highway & Mining Tyres', items: ['10.00 R20 Radial Truck Tyre', '295/80 R22.5 Tubeless', 'Heavy Duty Steel Disc Rims', 'Tyre Flaps & Heavy Tubes'] }
    ]
  },
  {
    id: 'truck_electrical_cabin',
    name: 'Cabin, Lights & Heavy Electricals',
    icon: 'fa-bolt',
    subCategories: [
      { id: 'truck_starter_bat', name: 'Starters & Alternators', items: ['24V Heavy Starter Motor', '24V 80A Alternator', '180Ah Commercial Batteries', 'Battery Cut-off Switch'] },
      { id: 'truck_cabin_mirrors', name: 'Cabin Mirrors & Lamps', items: ['Convex Highway Blindspot Mirrors', 'LED Clearance Marker Lamps', 'Fog Lamp Assemblies', 'Reverse Warning Horn'] }
    ]
  }
];

// Bus Fleet Categories
export const BUS_DETAILED_CATEGORIES: VehicleSpareCategory[] = [
  {
    id: 'bus_ac_cooling',
    name: 'Air Conditioning & Radiator',
    icon: 'fa-snowflake',
    subCategories: [
      { id: 'bus_compressor', name: 'Rooftop AC Spares', items: ['Heavy AC Compressor', 'Condenser Fan Motor', 'Evaporator Core', 'Expansion Valve', 'Roof AC Filter'] },
      { id: 'bus_radiator', name: 'Cooling Radiator & Fan', items: ['Heavy Copper-Brass Radiator', 'Silicon Radiator Hoses', 'Viscous Fan Clutch', 'Coolant Surge Tank'] }
    ]
  },
  {
    id: 'bus_pneumatics_door',
    name: 'Air Suspension & Door Mechanisms',
    icon: 'fa-arrows-up-down',
    subCategories: [
      { id: 'bus_air_bellows', name: 'Air Suspension Bellows', items: ['Air Spring Bellows (Front & Rear)', 'Leveling Valves', 'Heavy Shock Absorbers'] },
      { id: 'bus_door_sys', name: 'Pneumatic Passenger Door', items: ['Pneumatic Door Actuator', 'Door Emergency Valve', 'Rubber Door Seal Strip'] }
    ]
  },
  {
    id: 'bus_brakes_drivetrain',
    name: 'Air Brakes & Drivetrain',
    icon: 'fa-circle-stop',
    subCategories: [
      { id: 'bus_brakes', name: 'Brake Linings & Drums', items: ['Non-Asbestos Brake Linings', 'Slack Adjusters (Auto & Manual)', 'ABS Modulator Valve', 'Brake Drums'] }
    ]
  },
  {
    id: 'bus_interior_lighting',
    name: 'Passenger Comfort & Infotainment',
    icon: 'fa-couch',
    subCategories: [
      { id: 'bus_seats', name: 'Pushback Seats & Fabrics', items: ['Semi-Sleeper Pushback Recliner', 'Armrest & Footrest Spares', 'Seat Reclining Gas Spring'] },
      { id: 'bus_screens', name: 'Coach Screens & PA System', items: ['Roof Mounted 24V LED Coach Display', 'Driver PA Microphone & Amplifier', 'Individual USB Charging Ports'] }
    ]
  }
];

// 3-Wheeler Auto Rickshaw Categories
export const AUTO_DETAILED_CATEGORIES: VehicleSpareCategory[] = [
  {
    id: 'auto_engine_cng',
    name: 'CNG, Petrol & Diesel Engine Spares',
    icon: 'fa-gas-pump',
    subCategories: [
      { id: 'auto_cng_parts', name: 'CNG Kit & Carburetor', items: ['CNG Regulator Kit', 'CNG Solenoid Valve', 'CNG Microswitch', 'Tuned Carburetor / Injector'] },
      { id: 'auto_engine_block', name: 'Engine & Piston', items: ['Auto Piston & Rings Set', 'Cylinder Block Assembly', 'Clutch Plate & Disc Kit', 'Connecting Rod'] }
    ]
  },
  {
    id: 'auto_suspension_steering',
    name: 'Front Fork, Shock & Steering',
    icon: 'fa-arrows-up-down',
    subCategories: [
      { id: 'auto_fork_shocks', name: 'Fork & Helical Springs', items: ['Front Fork Assembly', 'Heavy Front Shock Absorber', 'Rear Helical Springs', 'Cone Ball Set'] },
      { id: 'auto_handle_cables', name: 'Steering Handle & Cables', items: ['Handle Bar Assembly', 'Clutch Cable', 'Accelerator Cable', 'Gear Shift Inner/Outer Cable'] }
    ]
  },
  {
    id: 'auto_brakes_tyres',
    name: 'Brakes, Rims & Tyres',
    icon: 'fa-circle-notch',
    subCategories: [
      { id: 'auto_tyre_rim', name: '4.00-8 Tyres & Drums', items: ['4.00-8 Tubeless / Tube Tyre', 'Heavy Steel Split Rim (8-inch)', 'Brake Drum & Shoe Kit', 'Wheel Cylinder'] }
    ]
  },
  {
    id: 'auto_cabin_hood',
    name: 'Hood Canvas, Meter & Electrics',
    icon: 'fa-bolt',
    subCategories: [
      { id: 'auto_hood', name: 'Hood & Upholstery', items: ['Waterproof Heavy Rexine Hood Canopy', 'Driver & Passenger Cushion Seats', 'Weather Flaps'] },
      { id: 'auto_meter_lights', name: 'Fare Meter, Dash & Lights', items: ['Digital Fare Meter', 'Headlight Luminary Unit', 'LED Cabin Light', 'Reverse Horn'] }
    ]
  }
];

// EV Electric Vehicle Specific Categories
export const EV_DETAILED_CATEGORIES: VehicleSpareCategory[] = [
  {
    id: 'ev_battery_charging',
    name: 'Battery, BMS & Charging Ports',
    icon: 'fa-charging-station',
    subCategories: [
      { id: 'ev_chargers', name: 'Charging Hardware', items: ['Type-2 Portable EV Home Charger 3.3kW', '7.4kW Fast Wallbox AC Charger', 'CCS2 Charging Port Adapter', 'Heavy Duty Charging Cable 5M'] },
      { id: 'ev_bms', name: 'BMS & Cooling Modules', items: ['Battery Thermal Liquid Coolant', 'BMS Sensor Wiring Harness', 'Lithium Cell Equalizer Monitor'] }
    ]
  },
  {
    id: 'ev_motor_drive',
    name: 'Electric Motor & Reduction Gearbox',
    icon: 'fa-bolt',
    subCategories: [
      { id: 'ev_motor', name: 'PMSM Motor Spares', items: ['Motor Rotor Bearings', 'Motor Inverter Controller', 'High Voltage DC-DC Converter', 'Reduction Gearbox Synthetic Fluid'] }
    ]
  },
  {
    id: 'ev_regen_brakes',
    name: 'Regenerative Brakes & Low-Rolling Tyres',
    icon: 'fa-circle-stop',
    subCategories: [
      { id: 'ev_tyres', name: 'EV Specific Low-Noise Tyres', items: ['Low Rolling Resistance EV Tyres', 'Foam-Lined Acoustic Tyres', 'EV Aero Wheel Covers'] },
      { id: 'ev_brakes', name: 'Regen Braking Components', items: ['Electro-Hydraulic Brake Booster', 'Anti-Corrosion Low-Dust Brake Pads', 'Electronic Parking Brake Actuator'] }
    ]
  }
];

// Master / All Vehicles Unified Category Tree (Default view when no specific vehicle is selected)
export const ALL_VEHICLES_MASTER_CATEGORIES: VehicleSpareCategory[] = [
  {
    id: 'master_all_engine',
    name: 'Engine, Oils & Internal Spares',
    icon: 'fa-oil-can',
    subCategories: [
      { id: 'all_oils', name: 'Engine Oils & Lubricants', items: ['Fully Synthetic 5W-40 (Car/SUV)', '4T 10W-40 Synthetic (Bike)', 'Heavy Diesel 15W-40 (Commercial)', 'Coolant & Brake Fluid'] },
      { id: 'all_pistons', name: 'Piston, Valves & Timing', items: ['Piston & Rings Assembly', 'Inlet/Exhaust Valves', 'Timing Belts & Chains', 'Gasket Kit'] },
      { id: 'all_filters', name: 'Filters & Plugs', items: ['Oil Filter', 'Engine Air Filter', 'Cabin AC Filter', 'Fuel Filter', 'Iridium Spark Plugs'] }
    ]
  },
  {
    id: 'master_all_tyres',
    name: 'Tyres, Alloys & TPMS (All Vehicles)',
    icon: 'fa-circle-notch',
    subCategories: [
      { id: 'all_car_tyres', name: 'Car & SUV Radial Tyres', items: ['185/65 R15 Radial', '195/55 R16 Tubeless', '215/60 R17 SUV Tyres', 'All-Terrain 4x4 Tyres'] },
      { id: 'all_bike_tyres', name: 'Bike & Scooter Tyres', items: ['Tubeless 100/80-17 Front', '140/70-17 Rear Radial', '90/90-12 Scooter Tyres', 'Alloy Wheels'] },
      { id: 'all_comm_tyres', name: 'Commercial & Auto Tyres', items: ['4.00-8 Auto Rickshaw Tyre', '10.00 R20 Truck Radial', 'Steel Rims & Flaps'] },
      { id: 'all_tpms', name: 'TPMS & Tyre Inflators', items: ['Solar TPMS Wireless Sensor', 'Digital Tyre Inflator', 'Puncture Repair Kit'] }
    ]
  },
  {
    id: 'master_all_braking',
    name: 'Braking Systems & Rotors',
    icon: 'fa-circle-stop',
    subCategories: [
      { id: 'all_disc_pads', name: 'Disc Brakes & Calipers', items: ['Ceramic Brake Pads', 'Ventilated Disc Rotors', 'Brake Caliper Assembly', 'Brake Fluid DOT 4'] },
      { id: 'all_drum_air', name: 'Drum & Air Brakes', items: ['Brake Shoes', 'Air Brake Chambers', 'Handbrake Cables', 'ABS Wheel Sensors'] }
    ]
  },
  {
    id: 'master_all_suspension',
    name: 'Suspension, Steering & Arms',
    icon: 'fa-arrows-up-down',
    subCategories: [
      { id: 'all_shocks', name: 'Shock Absorbers & Struts', items: ['Front Strut Assembly', 'Rear Gas Shockers', 'Bike Mono-Shock Absorber', 'Fork Inner Tubes'] },
      { id: 'all_leaf_arms', name: 'Control Arms & Leaf Springs', items: ['Lower Control Arm', 'Heavy Leaf Spring Assembly', 'Stabilizer Link Rod', 'Steering Handlebar'] }
    ]
  },
  {
    id: 'master_all_trims_body',
    name: 'Trims, Body Panels & Bumpers',
    icon: 'fa-car-side',
    subCategories: [
      { id: 'all_bumpers_grill', name: 'Bumper & Grills', items: ['Front Bumper', 'Rear Bumper', 'Front Grill', 'Bumper Trim', 'Spoiler'] },
      { id: 'all_mirrors', name: 'Mirrors & Glass', items: ['Outside ORVM Mirror', 'Mirror Glass', 'Interior Rearview Mirror', 'Bike Rearview Mirrors'] },
      { id: 'all_fairing_hood', name: 'Fairings & Hoods', items: ['Bike Nose Cowl & Fairings', 'Auto Canvas Hood Canopy', 'Bonnet / Hood Panels'] }
    ]
  },
  {
    id: 'master_all_electronics',
    name: 'Dashboard, Dashcams & Infotainment',
    icon: 'fa-video',
    subCategories: [
      { id: 'all_dashcams', name: 'Smart Dashcams', items: ['4K UHD Dual Channel Dashcam', 'Night Vision Parking Dashcam', 'GPS 4G Connected Dashcam'] },
      { id: 'all_audio_cluster', name: 'Audio & Digital Clusters', items: ['10-inch Android Auto Touchscreen', 'Component Car Speakers', 'Digital TFT Speedometer', 'Fast USB Chargers'] }
    ]
  },
  {
    id: 'master_all_riding_gear',
    name: 'Riding Wear, Helmets & Touring Gear',
    icon: 'fa-helmet-safety',
    subCategories: [
      { id: 'all_helmets_goggles', name: 'Helmets & Goggles', items: ['Full Face ECE Helmets', 'Flip-Up Modular Helmets', 'UV400 Polarized Riding Goggles'] },
      { id: 'all_jackets_gloves', name: 'Protective Wear & Bags', items: ['Armored Riding Jackets', 'Riding Gloves', 'Touring Saddlebags', 'Knee Guards'] }
    ]
  },
  {
    id: 'master_all_battery_ev',
    name: 'Batteries, Electricals & EV Chargers',
    icon: 'fa-bolt',
    subCategories: [
      { id: 'all_car_bike_bat', name: 'Vehicle Batteries & Starters', items: ['Car 12V Batteries 45Ah-65Ah', 'Bike 12V 5Ah VRLA Batteries', 'Commercial 24V Starters', 'Starter Motors'] },
      { id: 'all_ev_chargers', name: 'EV Chargers & Cables', items: ['Type-2 Portable EV Home Charger 3.3kW', '7.4kW Fast Wallbox Charger', 'CCS2 Port Adapters'] }
    ]
  },
  {
    id: 'master_all_care_tow',
    name: 'Vehicle Care, Mats & Towing',
    icon: 'fa-spray-can-sparkles',
    subCategories: [
      { id: 'all_mats_covers', name: 'Mats & Covers', items: ['7D Luxury Custom Foot Mats', 'Leatherette Seat Covers', 'All-Weather Vehicle Body Covers'] },
      { id: 'all_detailing_tow', name: 'Ceramic Coating & Tow Recovery', items: ['10H Ceramic Coating', 'Heavy 5-Ton Tow Rope', 'Booster Jumper Cables', 'Hazard Warning Kit'] }
    ]
  }
];

// Helper to return categories based on vehicle type
export function getVehicleDetailedCategories(vehicleType?: string): VehicleSpareCategory[] {
  if (!vehicleType || vehicleType.trim() === '' || vehicleType.toLowerCase() === 'all') {
    return ALL_VEHICLES_MASTER_CATEGORIES;
  }
  const t = vehicleType.toLowerCase();
  if (t === 'car' || t.includes('suv')) {
    return CAR_DETAILED_CATEGORIES;
  }
  if (t.includes('bike') || t.includes('motorcycle') || t.includes('scooter')) {
    return BIKE_DETAILED_CATEGORIES;
  }
  if (t.includes('lorry') || t.includes('truck')) {
    return TRUCK_DETAILED_CATEGORIES;
  }
  if (t.includes('bus')) {
    return BUS_DETAILED_CATEGORIES;
  }
  if (t.includes('auto') || t.includes('rickshaw')) {
    return AUTO_DETAILED_CATEGORIES;
  }
  if (t.includes('ev') || t.includes('electric')) {
    return EV_DETAILED_CATEGORIES;
  }
  return CAR_DETAILED_CATEGORIES;
}

/* ------------------------------------------------------------------ */
/* 2. RICH DIRECT-SELLER / SELF-SHIP SPARES & ACCESSORIES CATALOG     */
/* ------------------------------------------------------------------ */

export const EXTENDED_ACCESSORIES_CATALOG: StoreProduct[] = [
  // --- HELMETS & RIDING GEAR ---
  {
    id: 'gear-1',
    name: 'Axor Apex Venomous ECE & DOT Certified Full Face Helmet',
    price: 4994,
    originalPrice: 5499,
    rating: 4.9,
    reviewsCount: 840,
    icon: 'fa-helmet-safety',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Accessories',
    section: 'Riding Gear & Protection',
    badge: 'DOT & ECE 22.05',
    badgeType: 'trending',
    desc: 'High impact ABS composite shell with anti-scratch pinlock ready visor, integrated internal sun visor & aerodynamic spoiler.',
    compatibleWith: 'All Bikers & Scooter Riders (M, L, XL)',
    deliveryTime: 'Direct Dealer Dispatch (24-48 Hrs)',
    inStock: true,
    stockLeft: 24,
  },
  {
    id: 'gear-2',
    name: 'Royal Enfield Escapade Armored All-Weather Riding Jacket',
    price: 7200,
    originalPrice: 8999,
    rating: 4.88,
    reviewsCount: 312,
    icon: 'fa-vest',
    image: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Accessories',
    section: 'Riding Gear & Protection',
    badge: 'CE LEVEL 2',
    badgeType: 'new',
    desc: 'Abrasion resistant 600D Cordura construction with Knox CE Level 2 shoulder & elbow protectors, removable thermal rain liner.',
    compatibleWith: 'Universal Touring (Sizes: S, M, L, XL, XXL)',
    deliveryTime: 'Nearby Riding Gear Store (1-Hr Pickup)',
    inStock: true,
    stockLeft: 18,
  },
  {
    id: 'gear-3',
    name: '100% UV400 Polarized Anti-Glare Biking & Touring Goggles',
    price: 1299,
    originalPrice: 2499,
    rating: 4.75,
    reviewsCount: 450,
    icon: 'fa-glasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Accessories',
    section: 'Riding Gear & Protection',
    badge: 'UV400 POLARIZED',
    desc: 'High-definition shatterproof polycarbonate lenses with windproof dust gasket for high-speed highway touring and motocross.',
    compatibleWith: 'Universal Biking & Outdoor Sport',
    deliveryTime: 'Direct Seller Dispatch',
    inStock: true,
    stockLeft: 50,
  },

  // --- TYRES & CUSTOMIZABLE SIZES ---
  {
    id: 'tyre-1',
    name: 'MRF Zapper FX1 100/80-17 Tubeless Front Bike Tyre',
    price: 2150,
    originalPrice: 2800,
    rating: 4.82,
    reviewsCount: 920,
    icon: 'fa-circle-notch',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Spare Parts',
    section: 'Wheels & Tyres',
    badge: 'BESTSELLER TYRE',
    badgeType: 'bestseller',
    desc: 'Aggressive directional tread pattern for supreme wet tarmac grip, sharper cornering precision and extended tread life.',
    compatibleWith: 'Yamaha FZ, MT-15, Pulsar NS200, TVS Apache RTR',
    deliveryTime: 'Free Fitting at Nearby Tyre Partner',
    inStock: true,
    stockLeft: 30,
  },
  {
    id: 'tyre-2',
    name: 'Michelin City Extra 140/70-17 High-Mileage Rear Bike Tyre',
    price: 3850,
    originalPrice: 4700,
    rating: 4.95,
    reviewsCount: 610,
    icon: 'fa-circle-notch',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Spare Parts',
    section: 'Wheels & Tyres',
    badge: 'MICHELIN GRIP',
    badgeType: 'trending',
    desc: 'Water Sipe technology delivering 35% longer tyre longevity with puncture-resistant overlap casing for rough Indian roads.',
    compatibleWith: 'KTM 390 Duke, Dominar 400, Royal Enfield Hunter 350',
    deliveryTime: 'Express 2-Hr Fitting Available',
    inStock: true,
    stockLeft: 22,
  },

  // --- DASHCAM & DASHBOARD SMART ACCESSORIES ---
  {
    id: 'dash-1',
    name: '70mai A810 4K HDR Dual-Vision Smart Car Dashcam with Sony Starvis 2',
    price: 13999,
    originalPrice: 18999,
    rating: 4.96,
    reviewsCount: 1180,
    icon: 'fa-video',
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Car',
    category: 'Accessories',
    section: 'Dashboard & Electronics',
    badge: '4K SONY STARVIS 2',
    badgeType: 'new',
    desc: 'Native true 4K front + 1080P rear HDR recording with built-in GPS logger, ADAS road safety alerts & 24H AI parking buffer surveillance.',
    compatibleWith: 'All Indian Cars, Sedans, SUVs & Commercial Vans',
    deliveryTime: 'Direct Seller Dispatch (Free Installation Voucher)',
    inStock: true,
    stockLeft: 15,
  },
  {
    id: 'dash-2',
    name: 'Bobo Claw-Grip Motorcycle Mobile Mount with Anti-Vibration Dampener',
    price: 1899,
    originalPrice: 2999,
    rating: 4.89,
    reviewsCount: 2450,
    icon: 'fa-mobile-screen',
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Accessories',
    section: 'Dashboard & Electronics',
    badge: 'ANTI-VIBRATION',
    badgeType: 'trending',
    desc: 'Aviation-grade aluminum CNC body with 4 silicone vibration dampers to protect delicate phone camera sensors during rough rides.',
    compatibleWith: 'All Bikes & Scooters (7/8” & 1” Handlebars)',
    deliveryTime: 'Same Day Dispatch by Local Partner',
    inStock: true,
    stockLeft: 65,
  },

  // --- SPARE PARTS: ENGINE & BRAKING ---
  {
    id: 'sp-1',
    name: 'NGK Iridium IX CR9EIX High Performance Laser Spark Plug',
    price: 799,
    originalPrice: 1100,
    rating: 4.92,
    reviewsCount: 1540,
    icon: 'fa-bolt',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Spare Parts',
    section: 'Engine & Internal Components',
    badge: 'OEM GENUINE',
    desc: '0.6mm ultra-fine laser welded Iridium tip ensuring high durability, anti-fouling spark, and crisper throttle pickup.',
    compatibleWith: 'Royal Enfield, Yamaha, KTM, Bajaj, TVS, Honda',
    deliveryTime: 'In Stock • Ships in 24 Hrs',
    inStock: true,
    stockLeft: 85,
  },
  {
    id: 'sp-2',
    name: 'Rolon Brass Coated Heavy Duty Drive Chain & Sprocket Kit',
    price: 2450,
    originalPrice: 3200,
    rating: 4.86,
    reviewsCount: 780,
    icon: 'fa-link',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
    vehicle: 'Bike',
    category: 'Spare Parts',
    section: 'Transmission & Clutch System',
    badge: 'O-RING SEALED',
    badgeType: 'bestseller',
    desc: 'Gold brass plated solid bushings with O-ring sealed chain links resisting rust and stretching across high-mileage tours.',
    compatibleWith: 'Royal Enfield Classic 350 / Hunter / Meteor',
    deliveryTime: 'Direct Seller Dispatch',
    inStock: true,
    stockLeft: 34,
  }
];

/* ------------------------------------------------------------------ */
/* 3. ACCESSORIES POINT - LOCAL STORES DIRECTORY (For Modal)          */
/* ------------------------------------------------------------------ */

export interface AccessoriesStorePoint {
  id: string;
  name: string;
  city: string;
  area: string;
  address: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  openStatus: string;
  specialization: string[];
  distance: string;
  mapCoordinates: string;
  vehicleType?: string; // 'Car' | 'Bike' | 'Commercial' | 'EV' | 'Universal'
  isServiceCenter?: boolean;
}

export const ACCESSORIES_POINTS: AccessoriesStorePoint[] = [
  // --- CHENNAI ---
  {
    id: 'acc-chn-1',
    name: 'AutoStyle Mega Accessories & Fitment Hub',
    city: 'Chennai',
    area: 'Anna Nagar West',
    address: 'Plot 42, 2nd Avenue, Near Roundtana, Anna Nagar, Chennai - 600040',
    phone: '+91 98401 22334',
    rating: 4.9,
    reviewsCount: 640,
    openStatus: 'Open Now • Closes 9:30 PM',
    specialization: ['Riding Helmets & Gear', 'Tubeless Tyres & Alloys', '4K Dashcams & Android Audio', 'Custom Lighting & Horns'],
    distance: '1.4 km from you',
    mapCoordinates: '13.0850, 80.2101',
    vehicleType: 'Car',
    isServiceCenter: false
  },
  {
    id: 'acc-chn-sc-1',
    name: 'SART Multi-Brand Authorized Car & SUV Service Center',
    city: 'Chennai',
    area: 'Guindy Industrial Estate',
    address: 'No. 8 SIDCO Industrial Estate, Near Guindy Metro, Chennai - 600032',
    phone: '+91 94440 12890',
    rating: 4.94,
    reviewsCount: 1420,
    openStatus: 'Open Now • 24x7 Breakdown Service & Bay Booking',
    specialization: ['Authorized Periodic Car & SUV Service', 'Engine Diagnostics & Scan', 'Cashless Accidental Claims', 'Genuine Spares Fitment Center'],
    distance: '2.3 km from you',
    mapCoordinates: '13.0067, 80.2025',
    vehicleType: 'Car',
    isServiceCenter: true
  },
  {
    id: 'acc-chn-bike-sc',
    name: 'SART Pro-Bikers Master Workshop & Two-Wheeler Center',
    city: 'Chennai',
    area: 'Velachery Bypass',
    address: '142 100ft Inner Ring Road, Velachery, Chennai - 600042',
    phone: '+91 98403 88122',
    rating: 4.91,
    reviewsCount: 1180,
    openStatus: 'Open Now • Closes 9:00 PM',
    specialization: ['Superbike & Commuter General Service', 'Ultrasonic Carb / Injector Clean', 'Front Fork Oil Seal Replacement', 'Braking Caliper Bleeding'],
    distance: '1.8 km from you',
    mapCoordinates: '12.9815, 80.2180',
    vehicleType: 'Bike',
    isServiceCenter: true
  },
  {
    id: 'acc-chn-truck-sc',
    name: 'SART Heavy Truck & Commercial Fleet Workshop',
    city: 'Chennai',
    area: 'Madhavaram Truck Terminal',
    address: 'Bay 24, Chennai Truck Terminal Complex, Madhavaram, Chennai - 600110',
    phone: '+91 97910 44550',
    rating: 4.88,
    reviewsCount: 740,
    openStatus: 'Open Now • 24x7 Heavy Fleet Bay',
    specialization: ['Heavy Diesel Turbo & Engine Overhaul', 'Air Brake Valve Calibration', 'Multi-Leaf Spring Recambering', 'Highway Crane Recovery'],
    distance: '5.2 km from you',
    mapCoordinates: '13.1489, 80.2312',
    vehicleType: 'Lorry',
    isServiceCenter: true
  },
  {
    id: 'acc-chn-ev-sc',
    name: 'SART EV Tech & High-Voltage Battery Service Station',
    city: 'Chennai',
    area: 'OMR Sholinganallur',
    address: 'Tech Park Zone, OMR Sholinganallur, Chennai - 600119',
    phone: '+91 98410 77661',
    rating: 4.95,
    reviewsCount: 620,
    openStatus: 'Open Now • 24x7 EV Charging & Service Hub',
    specialization: ['Lithium Battery Health & Cell Balancing', 'PMSM Motor Inverter Tuning', 'Fast DC Charger Installation', 'Low Rolling Resistance Tyres'],
    distance: '3.5 km from you',
    mapCoordinates: '12.9010, 80.2279',
    vehicleType: 'EV',
    isServiceCenter: true
  },
  {
    id: 'acc-chn-2',
    name: 'GP Road MotoSpares & Performance Point',
    city: 'Chennai',
    area: 'Mount Road / GP Road',
    address: '15/2 General Patters Road, Thousand Lights, Chennai - 600002',
    phone: '+91 94440 88771',
    rating: 4.88,
    reviewsCount: 1120,
    openStatus: 'Open Now • Wholesale & Retail Direct Counter',
    specialization: ['OEM Engine & Clutch Spares', 'Brembo / Bosch Brake Kits', 'High Performance Oils & Filters', 'Crash Guards & Touring Luggage'],
    distance: '3.2 km from you',
    mapCoordinates: '13.0610, 80.2642'
  },
  {
    id: 'acc-chn-sc-2',
    name: 'SpeedyCare Two-Wheeler Master Service & Modification Hub',
    city: 'Chennai',
    area: 'T. Nagar',
    address: '45 Venkatnarayana Road, T. Nagar, Chennai - 600017',
    phone: '+91 98411 90876',
    rating: 4.87,
    reviewsCount: 890,
    openStatus: 'Open Now • Closes 8:30 PM',
    specialization: ['Superbike & Commuter Service', 'Fork & Suspension Overhaul', 'Laser Wheel Alignment', 'Free Safety Inspection'],
    distance: '2.8 km from you',
    mapCoordinates: '13.0418, 80.2341'
  },

  // --- BENGALURU ---
  {
    id: 'acc-blr-1',
    name: 'JC Road SpeedSpares & Riding Zone',
    city: 'Bengaluru',
    area: 'JC Road / Kalasipalyam',
    address: '88 JC Road, Automotive Commercial Complex, Bengaluru - 560002',
    phone: '+91 98860 33445',
    rating: 4.92,
    reviewsCount: 950,
    openStatus: 'Open Now • Closes 9:00 PM',
    specialization: ['Axor & MT Certified Helmets', 'Michelin & Apollo Tyres', 'Aux Fog Lights & Goggles', 'Direct Doorstep Dispatch'],
    distance: '2.1 km from you',
    mapCoordinates: '12.9611, 77.5835'
  },
  {
    id: 'acc-blr-sc-1',
    name: 'Indiranagar AutoCare Multi-Brand Service Station',
    city: 'Bengaluru',
    area: 'Indiranagar',
    address: '100ft Road, Near CMH Metro, Indiranagar, Bengaluru - 560038',
    phone: '+91 98450 12345',
    rating: 4.91,
    reviewsCount: 1250,
    openStatus: 'Open Now • Closes 9:30 PM',
    specialization: ['Automated Brake Bleeding & Discs', 'Periodic Scheduled Car/Bike Service', 'AC Gas & Cooling System', 'Genuine OES Parts Depot'],
    distance: '1.2 km from you',
    mapCoordinates: '12.9784, 77.6408'
  },

  // --- MUMBAI ---
  {
    id: 'acc-mum-1',
    name: 'Opera House MotoLuxe Car & Bike Studio',
    city: 'Mumbai',
    area: 'Opera House, Lamington Road',
    address: 'Shop 12, Swadeshi Mills Compound, Charni Road, Mumbai - 400004',
    phone: '+91 98200 44556',
    rating: 4.86,
    reviewsCount: 780,
    openStatus: 'Open Now • Closes 8:30 PM',
    specialization: ['Luxury 7D Footmats', 'GPS Anti-Theft Dashcams', 'Racing Seats & Ergonomics', 'Laser LED Headlights'],
    distance: '2.8 km from you',
    mapCoordinates: '18.9567, 72.8189'
  },
  {
    id: 'acc-mum-sc-1',
    name: 'Andheri West ProCare Master Bodyshop & Service Station',
    city: 'Mumbai',
    area: 'Andheri West',
    address: 'Link Road, Near Infinity Mall, Andheri West, Mumbai - 400053',
    phone: '+91 98201 99887',
    rating: 4.89,
    reviewsCount: 1100,
    openStatus: 'Open Now • 24x7 Roadside & Garage Triage',
    specialization: ['Car & Bike Full Service', 'Engine Overhaul & ECU Scan', 'Ceramic Paint Booth & Detailing', 'Genuine Parts Fitment'],
    distance: '3.1 km from you',
    mapCoordinates: '19.1363, 72.8277'
  }
];
