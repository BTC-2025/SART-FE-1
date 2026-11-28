export interface BrandInfo {
  name: string;
  category: string; // 'popular' | 'luxury' | 'performance' | 'electric' | 'retro'
  logo: string; // URL or SVG icon
  models: string[];
}

// ============================================================================
// CAR BRANDS & MODELS (Matching Image 3 & User Specifications)
// ============================================================================
export const CAR_BRANDS_DATA: Record<string, BrandInfo> = {
  // Popular & Mass-Market Car Brands
  'Maruti Suzuki': {
    name: 'Maruti Suzuki',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=120&q=80',
    models: [
      'Alto', 'Alto 800', 'Alto K10', 'S-Presso', 'Wagon R', 'Celerio', 'Ignis',
      'Swift', 'Baleno', 'Dzire', 'Ciaz', 'Brezza', 'Fronx', 'Grand Vitara',
      'Ertiga', 'XL6', 'Eeco', 'Jimny', 'Invicto', 'Omni', 'Ritz', 'SX4', 'Zen Estilo'
    ]
  },
  'Hyundai': {
    name: 'Hyundai',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80',
    models: [
      'Santro', 'Eon', 'i10', 'Grand i10', 'Grand i10 Nios', 'i20', 'i20 Active',
      'Xcent', 'Aura', 'Verna', 'Elantra', 'Exter', 'Venue', 'Creta', 'Alcazar',
      'Tucson', 'Kona Electric', 'Ioniq 5'
    ]
  },
  'Tata Motors': {
    name: 'Tata Motors',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: [
      'Nano', 'Indica', 'Indigo', 'Tiago', 'Tigor', 'Altroz', 'Punch', 'Nexon',
      'Curvv', 'Harrier', 'Safari', 'Hexa', 'Zest', 'Bolt', 'Sumo'
    ]
  },
  'Mahindra': {
    name: 'Mahindra',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: [
      'KUV100', 'TUV300', 'Bolero', 'Bolero Neo', 'XUV300', 'XUV 3XO', 'XUV500',
      'XUV700', 'XUV400 EV', 'Scorpio', 'Scorpio-N', 'Scorpio Classic', 'Thar',
      'Thar Roxx', 'Marazzo', 'Xylo', 'Alturas G4', 'BE 6', 'XEV 9e'
    ]
  },
  'Honda': {
    name: 'Honda',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=120&q=80',
    models: [
      'Brio', 'Jazz', 'Amaze', 'City', 'Civic', 'Accord', 'WR-V', 'BR-V',
      'Mobilio', 'Elevate', 'CR-V'
    ]
  },
  'Toyota': {
    name: 'Toyota',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1590362891988-f7780470208b?auto=format&fit=crop&w=120&q=80',
    models: [
      'Etios', 'Etios Liva', 'Glanza', 'Yaris', 'Corolla Altis', 'Camry',
      'Urban Cruiser', 'Urban Cruiser Hyryder', 'Taisor', 'Rumion', 'Innova',
      'Innova Crysta', 'Innova Hycross', 'Fortuner', 'Hilux', 'Vellfire'
    ]
  },
  'Kia': {
    name: 'Kia',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=120&q=80',
    models: ['Sonet', 'Seltos', 'Syros', 'Carens', 'Carnival', 'EV6']
  },
  'Renault': {
    name: 'Renault',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1541348263662-e0c866659c88?auto=format&fit=crop&w=120&q=80',
    models: ['Kwid', 'Triber', 'Kiger', 'Duster', 'Lodgy', 'Pulse', 'Scala', 'Captur']
  },
  'Nissan': {
    name: 'Nissan',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=120&q=80',
    models: ['Micra', 'Sunny', 'Terrano', 'Kicks', 'Magnite', 'X-Trail']
  },
  'Volkswagen': {
    name: 'Volkswagen',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=120&q=80',
    models: ['Polo', 'Ameo', 'Vento', 'Virtus', 'Taigun', 'Tiguan', 'Jetta', 'Passat']
  },
  'Skoda': {
    name: 'Skoda',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1541348263662-e0c866659c88?auto=format&fit=crop&w=120&q=80',
    models: ['Fabia', 'Rapid', 'Slavia', 'Kushaq', 'Kylaq', 'Octavia', 'Superb', 'Kodiaq', 'Yeti']
  },
  'MG (Morris Garages)': {
    name: 'MG (Morris Garages)',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=120&q=80',
    models: ['Comet EV', 'Astor', 'Hector', 'Hector Plus', 'ZS EV', 'Windsor EV', 'Gloster']
  },
  'Citroën': {
    name: 'Citroën',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=120&q=80',
    models: ['C3', 'eC3', 'C3 Aircross', 'Basalt', 'C5 Aircross']
  },
  'Jeep': {
    name: 'Jeep',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: ['Compass', 'Meridian', 'Wrangler', 'Grand Cherokee']
  },
  'Ford': {
    name: 'Ford (Used Market)',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=120&q=80',
    models: ['Figo', 'Aspire', 'Freestyle', 'EcoSport', 'Fiesta', 'Endeavour', 'Ikon']
  },
  'Chevrolet': {
    name: 'Chevrolet (Used Market)',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=120&q=80',
    models: ['Spark', 'Beat', 'Sail', 'Aveo', 'Cruze', 'Enjoy', 'Tavera', 'Captiva']
  },
  'Fiat': {
    name: 'Fiat (Used Market)',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80',
    models: ['Punto', 'Linea', 'Avventura']
  },
  'Datsun': {
    name: 'Datsun (Used Market)',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1541348263662-e0c866659c88?auto=format&fit=crop&w=120&q=80',
    models: ['Go', 'Go+', 'Redi-GO']
  },
  'Force Motors': {
    name: 'Force Motors',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: ['Gurkha', 'Trax Cruiser']
  },
  'Isuzu': {
    name: 'Isuzu',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1590362891988-f7780470208b?auto=format&fit=crop&w=120&q=80',
    models: ['D-Max V-Cross', 'MU-X']
  },
  'BYD': {
    name: 'BYD',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=120&q=80',
    models: ['Atto 3', 'Seal', 'eMAX 7 (e6)']
  },

  // Luxury Car Brands (Matching Image 3)
  'Mercedes-Benz': {
    name: 'Mercedes-Benz',
    category: 'luxury',
    logo: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=120&q=80',
    models: [
      'A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class', 'CLA', 'GLA',
      'GLC', 'GLE', 'GLS', 'G-Class', 'EQA', 'EQB', 'EQE', 'EQS'
    ]
  },
  'BMW': {
    name: 'BMW',
    category: 'luxury',
    logo: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=120&q=80',
    models: [
      '1 Series', '2 Series', '3 Series', '5 Series', '6 Series GT', '7 Series',
      'X1', 'X3', 'X4', 'X5', 'X7', 'Z4', 'iX1', 'i4', 'iX'
    ]
  },
  'Audi': {
    name: 'Audi',
    category: 'luxury',
    logo: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=120&q=80',
    models: ['A3', 'A4', 'A6', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron']
  },
  'Volvo': {
    name: 'Volvo',
    category: 'luxury',
    logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80',
    models: ['S60', 'S90', 'XC40', 'XC60', 'XC90', 'C40 Recharge']
  },
  'Jaguar': {
    name: 'Jaguar',
    category: 'luxury',
    logo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=120&q=80',
    models: ['XE', 'XF', 'XJ', 'F-Pace', 'E-Pace', 'I-Pace', 'F-Type']
  },
  'Land Rover': {
    name: 'Land Rover',
    category: 'luxury',
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=120&q=80',
    models: [
      'Discovery Sport', 'Range Rover Evoque', 'Range Rover Velar',
      'Range Rover Sport', 'Range Rover', 'Defender'
    ]
  },
  'Mini': {
    name: 'Mini',
    category: 'luxury',
    logo: 'https://images.unsplash.com/photo-1541348263662-e0c866659c88?auto=format&fit=crop&w=120&q=80',
    models: ['Cooper 3-Door', 'Cooper 5-Door', 'Countryman', 'Convertible']
  },
  'Porsche': {
    name: 'Porsche',
    category: 'luxury',
    logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=120&q=80',
    models: ['Macan', 'Cayenne', '911', 'Panamera', 'Taycan']
  },
  'Lexus': {
    name: 'Lexus',
    category: 'luxury',
    logo: 'https://images.unsplash.com/photo-1590362891988-f7780470208b?auto=format&fit=crop&w=120&q=80',
    models: ['ES', 'NX', 'RX', 'LX']
  },
  'Tesla': {
    name: 'Tesla',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=120&q=80',
    models: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck']
  }
};

// ============================================================================
// BIKE BRANDS & MODELS (Matching Image 4 & User Specifications)
// ============================================================================
export const BIKE_BRANDS_DATA: Record<string, BrandInfo> = {
  // Popular & Mass-Market Bike Brands
  'Hero': {
    name: 'Hero',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80',
    models: [
      'Splendor+', 'Splendor+ XTEC', 'Super Splendor', 'HF Deluxe', 'HF 100',
      'Passion+', 'Passion XTEC', 'Glamour', 'Glamour XTEC', 'Xtreme 125R',
      'Xtreme 160R', 'Xtreme 200S', 'XPulse 200 4V', 'Karizma XMR', 'Mavrick 440',
      'Pleasure+', 'Destini 125', 'Xoom', 'Maestro Edge'
    ]
  },
  'Honda': {
    name: 'Honda',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=120&q=80',
    models: [
      'Shine 100', 'Shine 125', 'SP 125', 'Unicorn', 'SP 160', 'Hornet 2.0',
      'CB200X', 'CB300F', 'CB300R', "H'ness CB350", 'CB350RS', 'CB350',
      'Activa 6G', 'Activa 125', 'Dio', 'Dio 125', 'Grazia', 'CD 110 Dream', 'Livo'
    ]
  },
  'Bajaj': {
    name: 'Bajaj',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=120&q=80',
    models: [
      'Platina 100', 'Platina 110', 'CT 110X', 'CT 125X', 'Freedom 125 (CNG)',
      'Pulsar 125', 'Pulsar 150', 'Pulsar N150', 'Pulsar N160', 'Pulsar NS125',
      'Pulsar NS160', 'Pulsar NS200', 'Pulsar RS200', 'Pulsar 220F', 'Pulsar N250',
      'Pulsar NS400Z', 'Avenger Street 160', 'Avenger Cruise 220', 'Dominar 250',
      'Dominar 400', 'Chetak (Electric)'
    ]
  },
  'TVS': {
    name: 'TVS',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=120&q=80',
    models: [
      'Sport', 'Star City+', 'Radeon', 'Raider 125', 'Apache RTR 160',
      'Apache RTR 160 4V', 'Apache RTR 180', 'Apache RTR 200 4V', 'Apache RR 310',
      'Apache RTR 310', 'Ronin', 'Jupiter', 'Jupiter 125', 'NTorq 125',
      'Scooty Pep+', 'Zest 110', 'XL100', 'iQube (Electric)'
    ]
  },
  'Royal Enfield': {
    name: 'Royal Enfield',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=120&q=80',
    models: [
      'Hunter 350', 'Bullet 350', 'Classic 350', 'Meteor 350', 'Guerrilla 450',
      'Himalayan 450', 'Himalayan 411', 'Scram 411', 'Interceptor 650',
      'Continental GT 650', 'Super Meteor 650', 'Shotgun 650', 'Bear 650'
    ]
  },
  'Yamaha': {
    name: 'Yamaha',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=120&q=80',
    models: [
      'FZ-S FI', 'FZ-FI', 'FZ-X', 'MT-15 V2', 'R15 V4', 'R15S', 'R15M',
      'R3', 'MT-03', 'Fascino 125', 'RayZR 125', 'Aerox 155', 'Saluto', 'Fazer'
    ]
  },
  'Suzuki': {
    name: 'Suzuki',
    category: 'popular',
    logo: 'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=120&q=80',
    models: [
      'Gixxer', 'Gixxer SF', 'Gixxer 250', 'Gixxer SF 250', 'V-Strom SX',
      'Access 125', 'Burgman Street', 'Avenis 125', 'Hayabusa', 'Katana', 'V-Strom 800DE'
    ]
  },

  // Performance & Premium Bike Brands
  'KTM': {
    name: 'KTM',
    category: 'performance',
    logo: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=120&q=80',
    models: [
      '125 Duke', '200 Duke', '250 Duke', '390 Duke', 'RC 125', 'RC 200',
      'RC 390', '250 Adventure', '390 Adventure'
    ]
  },
  'Kawasaki': {
    name: 'Kawasaki',
    category: 'performance',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80',
    models: [
      'Ninja 300', 'Ninja 400', 'Ninja 500', 'Ninja 650', 'Ninja ZX-4R',
      'Ninja ZX-6R', 'Ninja ZX-10R', 'Z650', 'Z900', 'Versys 650', 'Vulcan S',
      'W175', 'Eliminator'
    ]
  },
  'Triumph': {
    name: 'Triumph',
    category: 'performance',
    logo: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=120&q=80',
    models: [
      'Speed 400', 'Speed T4', 'Scrambler 400 X', 'Trident 660', 'Street Triple R/RS',
      'Tiger Sport 660', 'Tiger 900', 'Bonneville T100', 'Bonneville T120',
      'Speed Twin 900', 'Rocket 3'
    ]
  },
  'Harley-Davidson': {
    name: 'Harley-Davidson',
    category: 'performance',
    logo: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=120&q=80',
    models: [
      'X440', 'Nightster', 'Sportster S', 'Fat Boy', 'Heritage Classic',
      'Pan America 1250', 'Street 750 (Used Market)', 'Iron 883 (Used Market)'
    ]
  },
  'BMW Motorrad': {
    name: 'BMW Motorrad',
    category: 'performance',
    logo: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=120&q=80',
    models: [
      'G 310 R', 'G 310 RR', 'G 310 GS', 'F 850 GS', 'F 900 R',
      'S 1000 RR', 'R 1250 GS', 'R 1300 GS', 'C 400 GT'
    ]
  },
  'Ducati': {
    name: 'Ducati',
    category: 'performance',
    logo: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=120&q=80',
    models: [
      'Scrambler Icon', 'Monster', 'Panigale V2', 'Panigale V4', 'Streetfighter V2',
      'Streetfighter V4', 'Multistrada V2', 'Multistrada V4', 'Diavel V4'
    ]
  },
  'Aprilia': {
    name: 'Aprilia',
    category: 'performance',
    logo: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=120&q=80',
    models: ['SR 125', 'SR 160', 'SXR 125', 'SXR 160', 'Storm 125', 'RS 457', 'Tuono 660', 'RS 660', 'RSV4']
  },
  'Benelli': {
    name: 'Benelli',
    category: 'performance',
    logo: 'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=120&q=80',
    models: ['Imperiale 400', 'Leoncino 500', 'TRK 502', 'TRK 502X', '502C', 'TNT 300 (Used Market)', 'TNT 600i (Used Market)']
  },
  'Norton': {
    name: 'Norton',
    category: 'performance',
    logo: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=120&q=80',
    models: ['Commando 961', 'V4SV', 'V4CR']
  },

  // Other Petrol & Retro Brands
  'Jawa': {
    name: 'Jawa',
    category: 'retro',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80',
    models: ['Jawa 42', 'Jawa 42 FJ', 'Jawa 42 Bobber', 'Jawa 350', 'Perak']
  },
  'Yezdi': {
    name: 'Yezdi',
    category: 'retro',
    logo: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=120&q=80',
    models: ['Roadster', 'Scrambler', 'Adventure']
  },
  'BSA': {
    name: 'BSA',
    category: 'retro',
    logo: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=120&q=80',
    models: ['Gold Star 650']
  },
  'Husqvarna': {
    name: 'Husqvarna',
    category: 'retro',
    logo: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=120&q=80',
    models: ['Vitpilen 250', 'Svartpilen 250', 'Svartpilen 401']
  },
  'Vespa': {
    name: 'Vespa',
    category: 'retro',
    logo: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=120&q=80',
    models: ['ZX 125', 'VXL 125', 'VXL 150', 'SXL 125', 'SXL 150', 'Elegante']
  },
  'Keeway': {
    name: 'Keeway',
    category: 'retro',
    logo: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=120&q=80',
    models: ['SR125', 'SR250', 'K-Light 250V', 'V302C', 'Sixties 300i']
  },

  // Electric Two-Wheeler Models
  'Ola Electric': {
    name: 'Ola Electric',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=120&q=80',
    models: ['S1 X', 'S1 Air', 'S1 Pro', 'Roadster X', 'Roadster']
  },
  'Ather Energy': {
    name: 'Ather Energy',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=120&q=80',
    models: ['450S', '450X', '450 Apex', 'Rizta']
  },
  'Vida (Hero)': {
    name: 'Vida (Hero)',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80',
    models: ['V1 Plus', 'V1 Pro', 'V2']
  },
  'Revolt': {
    name: 'Revolt',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=120&q=80',
    models: ['RV400', 'RV400 BRZ', 'RV1']
  },
  'Ultraviolette': {
    name: 'Ultraviolette',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=120&q=80',
    models: ['F77 Mach 2']
  },
  'Simple Energy': {
    name: 'Simple Energy',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=120&q=80',
    models: ['Simple One', 'Simple Dot One']
  },
  'River': {
    name: 'River',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=120&q=80',
    models: ['Indie']
  },
  'Oben Electric': {
    name: 'Oben Electric',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=120&q=80',
    models: ['Rorr', 'Rorr EZ']
  },
  'Ampere': {
    name: 'Ampere',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=120&q=80',
    models: ['Magnus EX', 'Primus', 'Nexus']
  },
  'Okinawa': {
    name: 'Okinawa',
    category: 'electric',
    logo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=120&q=80',
    models: ['PraisePro', 'Ridge+', 'iPraise+']
  }
};

import {
  TRUCK_BRANDS_DATA,
  AUTO_BRANDS_DATA,
  BUS_BRANDS_DATA,
  TRACTOR_BRANDS_DATA,
  COMMERCIAL_VAN_BRANDS_DATA
} from './commercialVehiclesData';

export type VehicleCategoryType =
  | 'All'
  | 'Car'
  | 'Bike'
  | 'Van'
  | 'Bus'
  | 'Truck'
  | 'Tractor'
  | 'Auto'
  | 'Electric';

export function getBrandsForCategory(cat: VehicleCategoryType): Record<string, BrandInfo> {
  switch (cat) {
    case 'Bike':
      return BIKE_BRANDS_DATA;
    case 'Truck':
      return TRUCK_BRANDS_DATA;
    case 'Auto':
      return AUTO_BRANDS_DATA;
    case 'Bus':
      return BUS_BRANDS_DATA;
    case 'Tractor':
      return TRACTOR_BRANDS_DATA;
    case 'Van':
      return COMMERCIAL_VAN_BRANDS_DATA;
    case 'Electric': {
      const evMap: Record<string, BrandInfo> = {};
      const allMaps = [
        CAR_BRANDS_DATA,
        BIKE_BRANDS_DATA,
        TRUCK_BRANDS_DATA,
        AUTO_BRANDS_DATA,
        BUS_BRANDS_DATA
      ];
      allMaps.forEach(map => {
        Object.entries(map).forEach(([k, v]) => {
          if (
            v.category === 'electric' ||
            v.models.some(
              m => m.toLowerCase().includes('ev') || m.toLowerCase().includes('electric')
            )
          ) {
            evMap[k] = v;
          }
        });
      });
      return evMap;
    }
    case 'All':
      return {
        ...CAR_BRANDS_DATA,
        ...BIKE_BRANDS_DATA,
        ...TRUCK_BRANDS_DATA,
        ...AUTO_BRANDS_DATA
      };
    case 'Car':
    default:
      return CAR_BRANDS_DATA;
  }
}
