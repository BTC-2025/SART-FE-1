import React from 'react';
import { VEHICLE_SHOWCASE_DATA } from '../storeData';
import { BRANDS_BY_VEHICLE, MODELS_BY_BRAND } from '../storeProductsData';

interface StoreVehicleFinderBarProps {
  cardekhoVehicleCondition: 'new' | 'used';
  setCardekhoVehicleCondition: (c: 'new' | 'used') => void;
  cardekhoSelectedType: string;
  setCardekhoSelectedType: (t: string) => void;
  cardekhoBrandFilter: string;
  setCardekhoBrandFilter: (b: string) => void;
  cardekhoModelFilter: string;
  setCardekhoModelFilter: (m: string) => void;
  cardekhoBodyTypeFilter: string;
  setCardekhoBodyTypeFilter: (bt: string) => void;
  cardekhoSearchBy: 'budget' | 'brand';
  setCardekhoSearchBy: (s: 'budget' | 'brand') => void;
  cardekhoBudgetFilter: string;
  setCardekhoBudgetFilter: (bf: string) => void;
  cardekhoCityFilter: string;
  setCardekhoCityFilter: (c: string) => void;
  showToast: (msg: string) => void;
}

export function StoreVehicleFinderBar({
  cardekhoVehicleCondition,
  setCardekhoVehicleCondition,
  cardekhoSelectedType,
  setCardekhoSelectedType,
  cardekhoBrandFilter,
  setCardekhoBrandFilter,
  cardekhoModelFilter,
  setCardekhoModelFilter,
  cardekhoBodyTypeFilter,
  setCardekhoBodyTypeFilter,
  cardekhoSearchBy,
  setCardekhoSearchBy,
  cardekhoBudgetFilter,
  setCardekhoBudgetFilter,
  cardekhoCityFilter,
  setCardekhoCityFilter,
  showToast
}: StoreVehicleFinderBarProps) {
  return (
    /* HORIZONTAL VEHICLE FINDER FORM INSIDE CONTAINER */
    <div className="carandbike-finder-bar-card">
      {/* Top line with title and active condition badge */}
      <div className="cb-finder-title-row">
        <div className="cb-title-wrap">
          <span className="cb-flair-badge"><i className="fa-solid fa-compass"></i> SART ALL-VEHICLE SEARCH</span>
          <h2 className="cb-main-heading">
            {cardekhoVehicleCondition === 'new'
              ? (cardekhoSelectedType === 'All' ? 'Search New Vehicles' :
                cardekhoSelectedType === 'Car' ? 'Search New Cars & SUVs' :
                  cardekhoSelectedType === 'Bike' ? 'Search New Bikes & Scooters' :
                    cardekhoSelectedType === 'Van' ? 'Search New Commercial Vans' :
                      cardekhoSelectedType === 'Bus' ? 'Search New Passenger Buses' :
                        cardekhoSelectedType === 'Lorry' ? 'Search New Commercial Trucks' :
                          cardekhoSelectedType === 'Tractor' ? 'Search New Agri Tractors' :
                            cardekhoSelectedType === 'Auto' ? 'Search New 3-Wheelers & Autos' : 'Search New Electric Vehicles (EV)')
              : (cardekhoSelectedType === 'All' ? 'Search Certified Pre-Owned Vehicles' :
                cardekhoSelectedType === 'Car' ? 'Search Certified Pre-Owned Cars & SUVs' :
                  cardekhoSelectedType === 'Bike' ? 'Search Certified Pre-Owned Bikes & Scooters' :
                    cardekhoSelectedType === 'Van' ? 'Search Certified Pre-Owned Commercial Vans' :
                      cardekhoSelectedType === 'Bus' ? 'Search Certified Pre-Owned Passenger Buses' :
                        cardekhoSelectedType === 'Lorry' ? 'Search Certified Pre-Owned Commercial Trucks' :
                          cardekhoSelectedType === 'Tractor' ? 'Search Certified Pre-Owned Agri Tractors' :
                            cardekhoSelectedType === 'Auto' ? 'Search Certified Pre-Owned 3-Wheelers & Autos' : 'Search Certified Pre-Owned Electric Vehicles')}
          </h2>
        </div>

        <div className="cb-top-stats-pill">
          <span>{VEHICLE_SHOWCASE_DATA.filter(v => (cardekhoSelectedType === 'All' || v.type === cardekhoSelectedType || (cardekhoSelectedType === 'EV' && (v.status === 'electric' || v.fuel.toLowerCase().includes('ev') || v.fuel.toLowerCase().includes('electric')))) && (cardekhoVehicleCondition === 'new' ? v.status !== 'used' : v.status === 'used')).length} Vehicles Available</span>
        </div>
      </div>

      {/* Horizontal Inputs Bar tailored dynamically to New vs Used Vehicle */}
      <div className="cb-horizontal-inputs-bar">
        {/* 1. NEW VEHICLE FLOW */}
        {cardekhoVehicleCondition === 'new' && (
          <>
            {/* Step 1: Choose Your Vehicle Category */}
            <div className="cb-field-box">
              <label className="cb-field-label">
                <i className="fa-solid fa-truck-monster"></i> 1. Choose Vehicle
              </label>
              <div className="cb-select-wrap">
                <select
                  value={cardekhoSelectedType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setCardekhoSelectedType(newType);
                    setCardekhoBrandFilter('All Brands');
                    setCardekhoModelFilter('All Models');
                    setCardekhoBodyTypeFilter('All');
                    showToast(`Selected: ${e.target.options[e.target.selectedIndex].text}`);
                  }}
                >
                  <option value="All">All Categories</option>
                  <option value="Bike">🏍️ Bike &amp; Scooter</option>
                  <option value="Car">🚗 Car &amp; SUV</option>
                  <option value="Van">🚐 Van &amp; Commercial MUV</option>
                  <option value="Bus">🚌 Passenger Bus</option>
                  <option value="Lorry">🚛 Truck &amp; Heavy Lorry</option>
                  <option value="Tractor">🚜 Agriculture &amp; Tractor</option>
                  <option value="Auto">🛺 3-Wheeler Auto</option>
                  <option value="EV">⚡ 100% Electric (EV)</option>
                </select>
                <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
              </div>
            </div>

            {/* Step 2: Choose Filter Mode: By Budget OR By Brand */}
            <div className="cb-field-box">
              <label className="cb-field-label">
                <i className="fa-solid fa-sliders"></i> 2. Search Mode
              </label>
              <div className="cb-select-wrap">
                <select
                  value={cardekhoSearchBy}
                  onChange={(e) => {
                    setCardekhoSearchBy(e.target.value as 'budget' | 'brand');
                    setCardekhoModelFilter('All Models');
                  }}
                >
                  <option value="budget">💰 By Budget</option>
                  <option value="brand">🏷️ By Brand &amp; Model</option>
                </select>
                <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
              </div>
            </div>

            {/* If 'By Budget': Budget Price 0-2 Lakh etc. + Type of Vehicle (Body Type) */}
            {cardekhoSearchBy === 'budget' ? (
              <>
                <div className="cb-field-box">
                  <label className="cb-field-label">
                    <i className="fa-solid fa-indian-rupee-sign"></i> Budget Price
                  </label>
                  <div className="cb-select-wrap">
                    <select
                      value={cardekhoBudgetFilter}
                      onChange={(e) => setCardekhoBudgetFilter(e.target.value)}
                    >
                      <option value="All Budgets">All Price Ranges</option>
                      <option value="Under 2 Lakh">0 - 2 Lakh</option>
                      <option value="2 - 5 Lakh">2 - 5 Lakh</option>
                      <option value="5 - 10 Lakh">5 - 10 Lakh</option>
                      <option value="10 - 20 Lakh">10 - 20 Lakh</option>
                      <option value="20 - 50 Lakh">20 - 50 Lakh</option>
                      <option value="Above 50 Lakh">Above 50 Lakh</option>
                    </select>
                    <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                  </div>
                </div>

                <div className="cb-field-box">
                  <label className="cb-field-label">
                    <i className="fa-solid fa-shapes"></i> Type of Vehicle
                  </label>
                  <div className="cb-select-wrap">
                    <select
                      value={cardekhoBodyTypeFilter}
                      onChange={(e) => setCardekhoBodyTypeFilter(e.target.value)}
                    >
                      <option value="All">All Types</option>
                      {cardekhoSelectedType === 'Bike' && (
                        <>
                          <option value="Scooter">Scooter / Moped</option>
                          <option value="Bike">Commuter Motorcycle</option>
                          <option value="Cruiser">Cruiser (Meteor / Bullet)</option>
                          <option value="Sports">Sports / Naked Bike (Duke / R15)</option>
                          <option value="Adventure">Adventure Tourer (Himalayan / 390)</option>
                          <option value="Electric">Electric Scooter (EV)</option>
                        </>
                      )}
                      {cardekhoSelectedType === 'Car' && (
                        <>
                          <option value="Hatchback">Hatchback (Swift / Baleno)</option>
                          <option value="Sedan">Sedan (Dzire / City / Verna)</option>
                          <option value="SUV">Compact SUV (Nexon / Brezza)</option>
                          <option value="SUV">Mid-Size / Full SUV (Creta / Scorpio / Thar)</option>
                          <option value="MPV">MPV / 7-Seater (Ertiga / Innova)</option>
                          <option value="Electric">Electric SUV (EV)</option>
                        </>
                      )}
                      {cardekhoSelectedType === 'Van' && (
                        <>
                          <option value="Passenger">Passenger Van (Eeco / Winger)</option>
                          <option value="Cargo">Cargo Delivery Van</option>
                          <option value="Luxury">Luxury Tourer (Urbania / Traveller)</option>
                        </>
                      )}
                      {cardekhoSelectedType === 'Bus' && (
                        <>
                          <option value="Intercity">Intercity Luxury Coach</option>
                          <option value="City">City Transit Bus</option>
                          <option value="School">School / Staff Bus</option>
                          <option value="Electric">Electric City Bus</option>
                        </>
                      )}
                      {cardekhoSelectedType === 'Lorry' && (
                        <>
                          <option value="Light">Small / Light Commercial (SCV / Dost)</option>
                          <option value="Tipper">Tipper / Construction Mining</option>
                          <option value="Haulage">Heavy Long-Haul Truck (Signa / Blazo)</option>
                          <option value="Trailer">Tractor Trailer / Multi-Axle</option>
                        </>
                      )}
                      {cardekhoSelectedType === 'Tractor' && (
                        <>
                          <option value="2WD">2WD Agricultural Tractor</option>
                          <option value="4WD">4WD Heavy Duty Tractor</option>
                          <option value="Mini">Mini / Orchard Tractor</option>
                          <option value="Harvester">Combine Harvester Equipment</option>
                        </>
                      )}
                      {cardekhoSelectedType === 'Auto' && (
                        <>
                          <option value="Passenger">Passenger Auto (3-Seater)</option>
                          <option value="Cargo">Cargo Load Auto (Ape / Maxima)</option>
                          <option value="Electric">Electric Auto (EV)</option>
                        </>
                      )}
                      {cardekhoSelectedType === 'EV' && (
                        <>
                          <option value="SUV">Electric SUV / Car</option>
                          <option value="Scooter">Electric Scooter / 2W</option>
                          <option value="Auto">Electric Auto (3W)</option>
                          <option value="Bus">Electric Passenger Bus</option>
                        </>
                      )}
                      {cardekhoSelectedType === 'All' && (
                        <>
                          <option value="Hatchback">Hatchback</option>
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="Scooter">Scooter</option>
                          <option value="Bike">Motorcycle</option>
                          <option value="Truck">Commercial Truck</option>
                          <option value="Bus">Bus</option>
                          <option value="Tractor">Tractor</option>
                        </>
                      )}
                    </select>
                    <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                  </div>
                </div>
              </>
            ) : (
              /* If 'By Brand': Maker + Model */
              <>
                <div className="cb-field-box">
                  <label className="cb-field-label">
                    <i className="fa-solid fa-building"></i> Maker / Brand
                  </label>
                  <div className="cb-select-wrap">
                    <select
                      value={cardekhoBrandFilter}
                      onChange={(e) => {
                        setCardekhoBrandFilter(e.target.value);
                        setCardekhoModelFilter('All Models');
                      }}
                    >
                      <option value="All Brands">All Brands</option>
                      {(cardekhoSelectedType === 'All'
                        ? [
                          'Tata Motors', 'Hyundai', 'Mahindra', 'Maruti Suzuki', 'Toyota',
                          'Royal Enfield', 'Hero MotoCorp', 'Honda 2Wheelers', 'Bajaj Auto',
                          'TVS Motor', 'Yamaha', 'KTM', 'Ashok Leyland', 'Volvo Buses',
                          'Force Motors', 'Ather Energy', 'Ola Electric', 'Swaraj', 'John Deere', 'Sonalika'
                        ]
                        : (BRANDS_BY_VEHICLE[cardekhoSelectedType] || ['Tata Motors', 'Mahindra', 'Hyundai'])
                      ).map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                  </div>
                </div>

                <div className="cb-field-box">
                  <label className="cb-field-label">
                    <i className="fa-solid fa-car-side"></i> Model
                  </label>
                  <div className="cb-select-wrap">
                    <select
                      value={cardekhoModelFilter}
                      onChange={(e) => setCardekhoModelFilter(e.target.value)}
                    >
                      <option value="All Models">All Models</option>
                      {(MODELS_BY_BRAND[cardekhoBrandFilter] || [
                        'Swift', 'Creta', 'Nexon', 'Scorpio-N', 'Classic 350', 'Activa 6G / 125', 'Splendor Plus',
                        'Pulsar 150', '575 DI XP Plus', 'Swaraj 744 FE', 'Signa 2823.K', 'Traveller 3050'
                      ]).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* 2. USED VEHICLE FLOW */}
        {cardekhoVehicleCondition === 'used' && (
          <>
            {/* Step 1: Choose Your Vehicle Category */}
            <div className="cb-field-box">
              <label className="cb-field-label">
                <i className="fa-solid fa-truck-monster"></i> 1. Choose Vehicle
              </label>
              <div className="cb-select-wrap">
                <select
                  value={cardekhoSelectedType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setCardekhoSelectedType(newType);
                    setCardekhoBrandFilter('All Brands');
                    setCardekhoModelFilter('All Models');
                    setCardekhoBodyTypeFilter('All');
                    showToast(`Selected: ${e.target.options[e.target.selectedIndex].text}`);
                  }}
                >
                  <option value="All">All Categories</option>
                  <option value="Car">🚗 Cars &amp; SUVs</option>
                  <option value="Bike">🏍️ Bikes &amp; Scooters</option>
                  <option value="Lorry">🚛 Commercial Trucks</option>
                  <option value="Bus">🚌 Passenger Buses</option>
                  <option value="Van">🚐 Commercial Vans</option>
                  <option value="Tractor">🚜 Agri Tractors</option>
                  <option value="Auto">🛺 3-Wheelers &amp; Auto</option>
                  <option value="EV">⚡ Electric Vehicles (EV)</option>
                </select>
                <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
              </div>
            </div>

            {/* Search Mode: By Budget OR By Brand & Model */}
            <div className="cb-field-box">
              <label className="cb-field-label">
                <i className="fa-solid fa-sliders"></i> Filter By
              </label>
              <div className="cb-select-wrap">
                <select
                  value={cardekhoSearchBy}
                  onChange={(e) => {
                    setCardekhoSearchBy(e.target.value as 'budget' | 'brand');
                    setCardekhoModelFilter('All Models');
                  }}
                >
                  <option value="budget">💰 By Budget</option>
                  <option value="brand">🏷️ By Brand &amp; Model</option>
                </select>
                <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
              </div>
            </div>

            {cardekhoSearchBy === 'budget' ? (
              <div className="cb-field-box">
                <label className="cb-field-label">
                  <i className="fa-solid fa-indian-rupee-sign"></i> Budget Price
                </label>
                <div className="cb-select-wrap">
                  <select
                    value={cardekhoBudgetFilter}
                    onChange={(e) => setCardekhoBudgetFilter(e.target.value)}
                  >
                    <option value="All Budgets">All Price Ranges</option>
                    <option value="Under 2 Lakh">0 - 2 Lakh</option>
                    <option value="2 - 5 Lakh">2 - 5 Lakh</option>
                    <option value="5 - 10 Lakh">5 - 10 Lakh</option>
                    <option value="10 - 20 Lakh">10 - 20 Lakh</option>
                    <option value="20 - 50 Lakh">20 - 50 Lakh</option>
                    <option value="Above 50 Lakh">Above 50 Lakh</option>
                  </select>
                  <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                </div>
              </div>
            ) : (
              <>
                <div className="cb-field-box">
                  <label className="cb-field-label">
                    <i className="fa-solid fa-building"></i> Brand
                  </label>
                  <div className="cb-select-wrap">
                    <select
                      value={cardekhoBrandFilter}
                      onChange={(e) => {
                        setCardekhoBrandFilter(e.target.value);
                        setCardekhoModelFilter('All Models');
                      }}
                    >
                      <option value="All Brands">All Brands</option>
                      {(cardekhoSelectedType === 'All'
                        ? [
                          'Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Toyota', 'Honda',
                          'Royal Enfield', 'Hero MotoCorp', 'Honda 2Wheelers', 'Bajaj Auto', 'TVS Motor',
                          'Yamaha', 'KTM', 'Bajaj Auto (RE)', 'Maruti Suzuki (Eeco/Omni)', 'Eicher Motors', 'Sonalika'
                        ]
                        : (BRANDS_BY_VEHICLE[cardekhoSelectedType] || ['Tata Motors', 'Mahindra', 'Hyundai'])
                      ).map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                  </div>
                </div>

                <div className="cb-field-box">
                  <label className="cb-field-label">
                    <i className="fa-solid fa-car-side"></i> Model
                  </label>
                  <div className="cb-select-wrap">
                    <select
                      value={cardekhoModelFilter}
                      onChange={(e) => setCardekhoModelFilter(e.target.value)}
                    >
                      <option value="All Models">All Models</option>
                      {(MODELS_BY_BRAND[cardekhoBrandFilter] || [
                        'Swift', 'Creta', 'Venue', 'Nexon', 'Punch', 'Thar / Thar Roxx',
                        'Meteor 350', 'MT-15 V2', 'Activa 6G / 125', 'Apache RTR 160 4V', 'Eeco 7-Seater AC'
                      ]).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
                  </div>
                </div>
              </>
            )}

            {/* Cities Dropdown */}
            <div className="cb-field-box">
              <label className="cb-field-label">
                <i className="fa-solid fa-location-dot"></i> Select City
              </label>
              <div className="cb-select-wrap">
                <select
                  value={cardekhoCityFilter}
                  onChange={(e) => setCardekhoCityFilter(e.target.value)}
                >
                  <option value="All Cities">All Cities</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Coimbatore">Coimbatore / Erode</option>
                  <option value="Pune">Pune</option>
                </select>
                <i className="fa-solid fa-chevron-down cb-select-arrow"></i>
              </div>
            </div>
          </>
        )}

        {/* Search Action Button */}
        <div className="cb-btn-box">
          <button
            type="button"
            className="btn-carandbike-search-yellow"
            onClick={() => {
              showToast(`Search applied: ${cardekhoVehicleCondition === 'new' ? 'New Vehicles' : 'Used Vehicles'} • ${cardekhoSearchBy === 'budget' ? cardekhoBudgetFilter : `${cardekhoBrandFilter} ${cardekhoModelFilter}`}`);
            }}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
