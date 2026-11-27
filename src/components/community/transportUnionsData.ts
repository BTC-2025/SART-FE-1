export interface TransportUnionInfo {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  category: 'ROAD' | 'SEA' | 'AIR' | 'RAIL';
  icon: string;
  iconBg: string;
  color: string;
  standsCount: number;
  stands: string[];
  membersCount: number;
  description: string;
  defaultStand: string;
  associatedUnionName: string;
}

export const ALL_TRANSPORT_UNIONS: TransportUnionInfo[] = [
  {
    id: 'union-auto',
    name: 'Auto Union',
    badge: 'PUBLIC UNION',
    subtitle: 'Auto Rickshaws & 3-Wheelers',
    category: 'ROAD',
    icon: 'fa-taxi',
    iconBg: '#fef3c7',
    color: '#d97706',
    standsCount: 2,
    stands: ['Koyambedu Central Auto Stand', 'Central Railway Station Auto Stand'],
    membersCount: 3,
    description: 'Registered Regional Auto Stand Drivers & Shared 3-Wheeler Syndicate under ADWA.',
    defaultStand: 'Koyambedu Auto Stand (Gate 2)',
    associatedUnionName: 'Auto Stand Union'
  },
  {
    id: 'union-car',
    name: 'Car Union',
    badge: 'PUBLIC UNION',
    subtitle: 'Cabs, Taxis & Tourist Cars',
    category: 'ROAD',
    icon: 'fa-car',
    iconBg: '#dbeafe',
    color: '#2563eb',
    standsCount: 1,
    stands: ['Chennai Airport & City Taxi Stand'],
    membersCount: 2,
    description: 'City Taxi, Airport Cabs & Tourist Permit Drivers Welfare Association.',
    defaultStand: 'Airport Taxi Stand (Bay 4)',
    associatedUnionName: 'City Taxi Drivers Union'
  },
  {
    id: 'union-bus',
    name: 'Bus Union',
    badge: 'PUBLIC UNION',
    subtitle: 'Private, Mini & Intercity Buses',
    category: 'ROAD',
    icon: 'fa-bus',
    iconBg: '#dcfce7',
    color: '#059669',
    standsCount: 1,
    stands: ['CMBT Intercity & Private Omnibus Stand'],
    membersCount: 1,
    description: 'Private Omnibus Owners, Contract Carriage & Mini-Bus Drivers Syndicate.',
    defaultStand: 'CMBT Omni Bus Stand (Platform 3)',
    associatedUnionName: 'Private Bus Owners Club'
  },
  {
    id: 'union-truck',
    name: 'Truck Union',
    badge: 'PUBLIC UNION',
    subtitle: 'Heavy Commercial Trucks, Lorries & Multi-Axle',
    category: 'ROAD',
    icon: 'fa-truck-front',
    iconBg: '#ede9fe',
    color: '#7c3aed',
    standsCount: 2,
    stands: ['SIPCOT Freight Logistics Stand', 'NH48 Highway Truckers Bay'],
    membersCount: 3,
    description: 'Heavy Truckers Association, Tipper, Trailer & Multi-Axle Freight Drivers.',
    defaultStand: 'SIPCOT Logistics Yard 1',
    associatedUnionName: 'Heavy Truckers Association'
  },
  {
    id: 'union-marine',
    name: 'Marine & Port Union',
    badge: 'PUBLIC UNION',
    subtitle: 'Fishermen, Coastal Boats & Port Captains',
    category: 'SEA',
    icon: 'fa-ship',
    iconBg: '#e0f2fe',
    color: '#0284c7',
    standsCount: 1,
    stands: ['Kasimedu Coastal Harbor & Port Dock'],
    membersCount: 2,
    description: 'Coastal Fishermen Syndicate, Tug Operators & Marine Cargo Crews.',
    defaultStand: 'Kasimedu Coastal Dock',
    associatedUnionName: 'Fishermen Coastal Union'
  },
  {
    id: 'union-aviation',
    name: 'Aviation & Drone Union',
    badge: 'PUBLIC UNION',
    subtitle: 'Commercial Drone Pilots & Charter Aviators',
    category: 'AIR',
    icon: 'fa-plane',
    iconBg: '#ffedd5',
    color: '#ea580c',
    standsCount: 1,
    stands: ['Aerodrome Drone Pilot Station'],
    membersCount: 1,
    description: 'Commercial Drone Pilots, Aerial Surveyors & Charter Helicopter Operators.',
    defaultStand: 'Aerodrome Base 1',
    associatedUnionName: 'Commercial Drone Pilots'
  },

];
