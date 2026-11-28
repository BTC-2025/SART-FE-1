'use client';

import React, { useState, useMemo } from 'react';
import { UsedCarsFilterState } from './usedCarsData';
import { VehicleCategoryType } from './vehicleBrandsModelsData';
import './UsedCarFilterSidebar.css';

interface UsedCarFilterSidebarProps {
  filters: UsedCarsFilterState;
  setFilters: React.Dispatch<React.SetStateAction<UsedCarsFilterState>>;
  totalCount: number;
  onResetFilters: () => void;
  vehicleType?: VehicleCategoryType;
}

export default function UsedCarFilterSidebar({
  filters,
  setFilters,
  totalCount,
  onResetFilters,
  vehicleType = 'Car'
}: UsedCarFilterSidebarProps) {
  // Collapsible sections
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const isBike = vehicleType === 'Bike';
  const labelVeh = vehicleType === 'Bike' ? 'Bikes' : vehicleType === 'Truck' ? 'Trucks' : vehicleType === 'Auto' ? '3-Wheelers' : vehicleType === 'Bus' ? 'Buses' : vehicleType === 'Tractor' ? 'Tractors' : 'Cars';
  const labelSingle = vehicleType === 'Bike' ? 'Bike' : vehicleType === 'Truck' ? 'Truck' : vehicleType === 'Auto' ? 'Auto' : vehicleType === 'Bus' ? 'Bus' : vehicleType === 'Tractor' ? 'Tractor' : 'Car';

  const toggleSection = (sec: string) => {
    setCollapsed(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleToggleAll = () => {
    const nextVal = !allCollapsed;
    setAllCollapsed(nextVal);
    const secs = [
      'budget', 'brand', 'year', 'age', 'fuel',
      'transmission', 'kms', 'ownership', 'bodyType', 'sellerType',
      'rto', 'seats', 'discount'
    ];
    const updated: Record<string, boolean> = {};
    secs.forEach(s => { updated[s] = nextVal; });
    setCollapsed(updated);
  };

  // Checkbox toggle helpers
  const toggleArrayItem = (key: keyof UsedCarsFilterState, value: string) => {
    setFilters(prev => {
      const arr = (prev[key] as string[]) || [];
      const exists = arr.includes(value);
      return {
        ...prev,
        [key]: exists ? arr.filter(x => x !== value) : [...arr, value]
      };
    });
  };

  const toggleSeatItem = (seatVal: number) => {
    setFilters(prev => {
      const exists = prev.seats.includes(seatVal);
      return {
        ...prev,
        seats: exists ? prev.seats.filter(s => s !== seatVal) : [...prev.seats, seatVal]
      };
    });
  };

  const CAR_BRANDS = [
    { name: 'Hyundai', count: 303 },
    { name: 'Maruti Suzuki', count: 225 },
    { name: 'Tata Motors', count: 103 },
    { name: 'Honda', count: 148 },
    { name: 'Mahindra', count: 79 },
    { name: 'Toyota', count: 58 },
    { name: 'BMW', count: 48 },
    { name: 'Mercedes-Benz', count: 29 },
    { name: 'Jeep', count: 21 },
    { name: 'Audi', count: 18 },
    { name: 'Kia', count: 42 },
    { name: 'Volkswagen', count: 35 },
    { name: 'Skoda', count: 28 },
    { name: 'MG', count: 24 },
    { name: 'Renault', count: 19 }
  ];

  const BIKE_BRANDS = [
    { name: 'Hero', count: 412 },
    { name: 'Honda', count: 380 },
    { name: 'Bajaj', count: 320 },
    { name: 'TVS', count: 290 },
    { name: 'Royal Enfield', count: 260 },
    { name: 'Yamaha', count: 180 },
    { name: 'Suzuki', count: 140 },
    { name: 'KTM', count: 95 },
    { name: 'Kawasaki', count: 45 },
    { name: 'Triumph', count: 38 },
    { name: 'Harley-Davidson', count: 32 },
    { name: 'Ather Energy', count: 58 },
    { name: 'Ola Electric', count: 64 },
    { name: 'Revolt', count: 28 },
    { name: 'Chetak', count: 34 }
  ];

  const TRUCK_BRANDS = [
    { name: 'Ashok Leyland', count: 185 },
    { name: 'Tata Motors', count: 240 },
    { name: 'Eicher Motors', count: 110 },
    { name: 'BharatBenz', count: 75 },
    { name: 'Mahindra', count: 98 },
    { name: 'Force Motors', count: 42 },
    { name: 'Isuzu', count: 35 },
    { name: 'Euler Motors', count: 24 }
  ];

  const AUTO_BRANDS = [
    { name: 'Bajaj', count: 310 },
    { name: 'Piaggio', count: 215 },
    { name: 'Mahindra', count: 85 },
    { name: 'TVS', count: 70 },
    { name: 'Atul Auto', count: 45 },
    { name: 'Altigreen', count: 32 }
  ];

  const BUS_BRANDS = [
    { name: 'Tata Motors', count: 120 },
    { name: 'Ashok Leyland', count: 95 },
    { name: 'Force Motors', count: 68 },
    { name: 'Eicher', count: 52 },
    { name: 'BharatBenz', count: 28 },
    { name: 'Volvo Buses', count: 18 }
  ];

  const TRACTOR_BRANDS = [
    { name: 'Mahindra', count: 145 },
    { name: 'Swaraj', count: 112 },
    { name: 'John Deere', count: 88 },
    { name: 'Sonalika', count: 65 },
    { name: 'JCB', count: 54 },
    { name: 'Massey Ferguson', count: 48 }
  ];

  const VAN_BRANDS = [
    { name: 'Force Motors', count: 90 },
    { name: 'Tata Motors', count: 85 },
    { name: 'Maruti Suzuki Commercial', count: 62 },
    { name: 'Mahindra', count: 45 },
    { name: 'Ashok Leyland', count: 38 }
  ];

  const BRANDS_LIST = useMemo(() => {
    if (vehicleType === 'Bike') return BIKE_BRANDS;
    if (vehicleType === 'Truck') return TRUCK_BRANDS;
    if (vehicleType === 'Auto') return AUTO_BRANDS;
    if (vehicleType === 'Bus') return BUS_BRANDS;
    if (vehicleType === 'Tractor') return TRACTOR_BRANDS;
    if (vehicleType === 'Van') return VAN_BRANDS;
    if (vehicleType === 'All') return [...CAR_BRANDS.slice(0, 5), ...BIKE_BRANDS.slice(0, 4), ...TRUCK_BRANDS.slice(0, 4)];
    return CAR_BRANDS;
  }, [vehicleType]);

  const visibleBrands = showAllBrands ? BRANDS_LIST : BRANDS_LIST.slice(0, 10);
  const filteredBrands = filters.brandSearchText.trim()
    ? BRANDS_LIST.filter(b => b.name.toLowerCase().includes(filters.brandSearchText.toLowerCase()))
    : visibleBrands;

  return (
    <aside className="used-car-filter-sidebar animate-fade-in">
      {/* Header with Collapse All toggle */}
      <div className="filter-sidebar-header">
        <button
          type="button"
          className="btn-collapse-all"
          onClick={handleToggleAll}
          title={allCollapsed ? 'Expand All Filters' : 'Collapse All Filters'}
        >
          <i className={`fa-solid ${allCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          <span>{allCollapsed ? 'Expand All Filters' : 'Collapse All Filters'}</span>
        </button>

        <button
          type="button"
          className="btn-reset-filters"
          onClick={onResetFilters}
          title="Reset all filters"
        >
          <i className="fa-solid fa-arrow-rotate-left"></i>
          <span>Reset</span>
        </button>
      </div>

      {/* 1. BUDGET */}
      <div className="filter-block">
        <div className="filter-block-title" onClick={() => toggleSection('budget')}>
          <span>Budget</span>
          <i className={`fa-solid ${collapsed.budget ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </div>
        {!collapsed.budget && (
          <div className="filter-block-body">
            <div className="slider-range-labels">
              <span>₹0</span>
              <span>{isBike ? '₹5 Lakh' : '₹5 Crore'}</span>
            </div>
            <input
              type="range"
              min="0"
              max={isBike ? 500000 : 50000000}
              step={isBike ? 5000 : 50000}
              value={filters.maxBudget}
              onChange={(e) => setFilters(p => ({ ...p, maxBudget: Number(e.target.value) }))}
              className="filter-range-slider"
            />
            <div className="slider-current-val">
              Up to: <strong>{filters.maxBudget >= (isBike ? 500000 : 50000000) ? (isBike ? '₹5 Lakh+' : '₹5 Crore+') : `₹${(filters.maxBudget / 100000).toFixed(1)} Lakh`}</strong>
            </div>
          </div>
        )}
      </div>

      {/* 3. BRAND + MODEL */}
      <div className="filter-block">
        <div className="filter-block-title" onClick={() => toggleSection('brand')}>
          <span>Brand + Model</span>
          <i className={`fa-solid ${collapsed.brand ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </div>
        {!collapsed.brand && (
          <div className="filter-block-body">
            <div className="brand-search-box">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder={`Search ${labelSingle} Brand or Model`}
                value={filters.brandSearchText}
                onChange={(e) => setFilters(p => ({ ...p, brandSearchText: e.target.value }))}
              />
              {filters.brandSearchText && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setFilters(p => ({ ...p, brandSearchText: '' }))}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            <div className="filter-checkbox-grid">
              {filteredBrands.map(b => (
                <label key={b.name} className="filter-checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.selectedBrands.includes(b.name)}
                    onChange={() => toggleArrayItem('selectedBrands', b.name)}
                  />
                  <span>{b.name} ({b.count})</span>
                </label>
              ))}
            </div>

            {!filters.brandSearchText && (
              <button
                type="button"
                className="filter-show-more-link"
                onClick={() => setShowAllBrands(prev => !prev)}
              >
                {showAllBrands ? 'Show Less Brands' : 'Show More Brands'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4. MODEL YEAR */}
      <div className="filter-block">
        <div className="filter-block-title" onClick={() => toggleSection('year')}>
          <span>Model Year</span>
          <i className={`fa-solid ${collapsed.year ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </div>
        {!collapsed.year && (
          <div className="filter-block-body">
            <div className="slider-range-labels">
              <span>{filters.minYear}</span>
              <span>2024</span>
            </div>
            <input
              type="range"
              min="2000"
              max="2024"
              step="1"
              value={filters.minYear}
              onChange={(e) => setFilters(p => ({ ...p, minYear: Number(e.target.value) }))}
              className="filter-range-slider"
            />
            <div className="slider-current-val">
              From year <strong>{filters.minYear}</strong> and newer
            </div>
          </div>
        )}
      </div>

      {/* 5. CAR/BIKE AGE */}
      <div className="filter-block">
        <div className="filter-block-title" onClick={() => toggleSection('age')}>
          <span>{labelSingle} Age</span>
          <i className={`fa-solid ${collapsed.age ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </div>
        {!collapsed.age && (
          <div className="filter-block-body">
            <div className="filter-checkbox-grid">
              {[
                { id: '<1yr', label: 'Less than 1 year old' },
                { id: '<3yr', label: 'Less than 3 years old' },
                { id: '<5yr', label: 'Less than 5 years old' },
              ].map(age => (
                <label key={age.id} className="filter-checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.carAge.includes(age.id)}
                    onChange={() => toggleArrayItem('carAge', age.id)}
                  />
                  <span>{age.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. FUEL TYPE */}
      <div className="filter-block">
        <div className="filter-block-title" onClick={() => toggleSection('fuel')}>
          <span>Fuel Type</span>
          <i className={`fa-solid ${collapsed.fuel ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </div>
        {!collapsed.fuel && (
          <div className="filter-block-body">
            <div className="filter-checkbox-grid">
              {[
                { id: 'Petrol', label: 'Petrol' },
                { id: 'Diesel', label: isBike ? 'Diesel (Not Applicable)' : 'Diesel' },
                { id: 'Electric', label: 'Electric (EV)' },
                { id: 'CNG', label: 'CNG' },
              ].map(fuel => (
                <label key={fuel.id} className="filter-checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.fuelTypes.includes(fuel.id)}
                    onChange={() => toggleArrayItem('fuelTypes', fuel.id)}
                  />
                  <span>{fuel.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 7. TRANSMISSION */}
      <div className="filter-block">
        <div className="filter-block-title" onClick={() => toggleSection('transmission')}>
          <span>Transmission</span>
          <i className={`fa-solid ${collapsed.transmission ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </div>
        {!collapsed.transmission && (
          <div className="filter-block-body">
            <div className="filter-checkbox-grid">
              {[
                { id: 'Manual', label: isBike ? 'Manual (Gears)' : 'Manual' },
                { id: 'Automatic', label: isBike ? 'Automatic (CVT / Scooter)' : 'Automatic' },
              ].map(trans => (
                <label key={trans.id} className="filter-checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.transmissions.includes(trans.id)}
                    onChange={() => toggleArrayItem('transmissions', trans.id)}
                  />
                  <span>{trans.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 8. KILOMETER DRIVEN */}
      <div className="filter-block">
        <div className="filter-block-title" onClick={() => toggleSection('kms')}>
          <span>Kilometer Driven</span>
          <i className={`fa-solid ${collapsed.kms ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </div>
        {!collapsed.kms && (
          <div className="filter-block-body">
            <div className="slider-range-labels">
              <span>0 kms</span>
              <span>{isBike ? '60,000 kms' : '2,60,000 kms'}</span>
            </div>
            <input
              type="range"
              min="0"
              max={isBike ? 60000 : 260000}
              step={isBike ? 1000 : 5000}
              value={filters.maxKms}
              onChange={(e) => setFilters(p => ({ ...p, maxKms: Number(e.target.value), popularKmChip: null }))}
              className="filter-range-slider"
            />
            <div className="slider-current-val">
              Driven up to: <strong>{filters.maxKms.toLocaleString()} km</strong>
            </div>
          </div>
        )}
      </div>

      {/* 9. OWNERSHIP */}
      <div className="filter-block">
        <div className="filter-block-title" onClick={() => toggleSection('ownership')}>
          <span>Ownership</span>
          <i className={`fa-solid ${collapsed.ownership ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </div>
        {!collapsed.ownership && (
          <div className="filter-block-body">
            <div className="filter-checkbox-grid">
              {[
                { id: 'First owner', label: 'First owner' },
                { id: 'Second owner', label: 'Second owner' },
                { id: 'Third owner or more', label: 'Third owner or more' },
              ].map(own => (
                <label key={own.id} className="filter-checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.ownerships.includes(own.id)}
                    onChange={() => toggleArrayItem('ownerships', own.id)}
                  />
                  <span>{own.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 10. BODY TYPE */}
      <div className="filter-block">
        <div className="filter-block-title" onClick={() => toggleSection('bodyType')}>
          <span>Body Type</span>
          <i className={`fa-solid ${collapsed.bodyType ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </div>
        {!collapsed.bodyType && (
          <div className="filter-block-body">
            <div className="filter-checkbox-grid">
              {(vehicleType === 'Bike' ? [
                { id: 'Commuter', label: 'Commuter' },
                { id: 'Sports', label: 'Sports / Street' },
                { id: 'Cruiser', label: 'Cruiser / Retro' },
                { id: 'Scooter', label: 'Scooter / Moped' },
                { id: 'Adventure', label: 'Adventure / Tourer' },
                { id: 'Electric', label: 'Electric (EV)' },
              ] : vehicleType === 'Truck' ? [
                { id: 'Mini Truck', label: 'Mini Truck (SCV)' },
                { id: 'Pickup Truck', label: 'Pickup Truck' },
                { id: 'Tipper Truck', label: 'Tipper / Dumper' },
                { id: 'Haulage Rigid', label: 'Heavy Rigid Truck' }
              ] : vehicleType === 'Auto' ? [
                { id: '3-Wheeler Auto', label: 'Passenger Auto' },
                { id: 'Cargo Delivery Auto', label: 'Cargo Auto / Loader' }
              ] : vehicleType === 'Bus' ? [
                { id: 'Passenger Bus', label: 'Staff / School Bus' },
                { id: 'Commercial Van', label: 'Mini Bus / Traveler' }
              ] : vehicleType === 'Tractor' ? [
                { id: 'Agri Tractor', label: 'Farm Tractor' },
                { id: 'Earthmover / Backhoe', label: 'Earthmover / JCB' }
              ] : [
                { id: 'Hatchback', label: 'Hatchback (700)' },
                { id: 'SUV', label: 'SUV (604)' },
                { id: 'Sedan', label: 'Sedan (226)' },
                { id: 'MUV', label: 'MUV (22)' },
                { id: 'Minivan', label: 'Minivan (8)' },
                { id: 'Convertible', label: 'Convertible (2)' },
                { id: 'Coupe', label: 'Coupe (2)' },
                { id: 'Pickup Truck', label: 'Pickup Truck (2)' },
              ]).map(body => (
                <label key={body.id} className="filter-checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.bodyTypes.includes(body.id)}
                    onChange={() => toggleArrayItem('bodyTypes', body.id)}
                  />
                  <span>{body.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 11. SELLER TYPE */}
      <div className="filter-block">
        <div className="filter-block-title" onClick={() => toggleSection('sellerType')}>
          <span>Seller Type</span>
          <i className={`fa-solid ${collapsed.sellerType ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </div>
        {!collapsed.sellerType && (
          <div className="filter-block-body">
            <div className="filter-checkbox-grid">
              {[`All ${labelVeh}`, `Partner ${labelVeh}`, `Enterprise ${labelVeh}`, `Direct Owner ${labelVeh}`].map(s => (
                <label key={s} className="filter-checkbox-item">
                  <input
                    type="radio"
                    name="sellerTypeRadio"
                    checked={filters.sellerType === s}
                    onChange={() => setFilters(p => ({ ...p, sellerType: s }))}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 13. RTO */}
      <div className="filter-block">
        <div className="filter-block-title" onClick={() => toggleSection('rto')}>
          <span>RTO</span>
          <i className={`fa-solid ${collapsed.rto ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </div>
        {!collapsed.rto && (
          <div className="filter-block-body">
            <div className="filter-checkbox-grid">
              {['Tamil nadu', 'Haryana', 'Pondicherry', 'Chandigarh', 'Punjab', 'Delhi'].map(rto => (
                <label key={rto} className="filter-checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.rtoStates.includes(rto)}
                    onChange={() => toggleArrayItem('rtoStates', rto)}
                  />
                  <span>{rto}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 14. SEATS (FOR CARS) */}
      {!isBike && (
        <div className="filter-block">
          <div className="filter-block-title" onClick={() => toggleSection('seats')}>
            <span>Seats</span>
            <i className={`fa-solid ${collapsed.seats ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
          </div>
          {!collapsed.seats && (
            <div className="filter-block-body">
              <div className="filter-checkbox-grid">
                {[
                  { val: 4, label: '4 Seater' },
                  { val: 5, label: '5 Seater' },
                  { val: 6, label: '6 Seater' },
                  { val: 7, label: '7 Seater' },
                ].map(seat => (
                  <label key={seat.val} className="filter-checkbox-item">
                    <input
                      type="checkbox"
                      checked={filters.seats.includes(seat.val)}
                      onChange={() => toggleSeatItem(seat.val)}
                    />
                    <span>{seat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 15. DISCOUNT */}
      <div className="filter-block">
        <div className="filter-block-title" onClick={() => toggleSection('discount')}>
          <span>Discount</span>
          <i className={`fa-solid ${collapsed.discount ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
        </div>
        {!collapsed.discount && (
          <div className="filter-block-body">
            <div className="filter-checkbox-grid">
              {[
                { id: 'upto_20k', label: isBike ? 'Upto ₹5,000' : 'Upto ₹20,000' },
                { id: 'upto_50k', label: isBike ? 'Upto ₹10,000' : 'Upto ₹50,000' },
                { id: 'upto_1l', label: isBike ? 'Upto ₹20,000' : 'Upto ₹1,00,000' },
                { id: 'above_1l', label: isBike ? 'Above ₹20,000' : 'Above ₹1,00,000' },
              ].map(disc => (
                <label key={disc.id} className="filter-checkbox-item">
                  <input
                    type="checkbox"
                    checked={filters.discounts.includes(disc.id)}
                    onChange={() => toggleArrayItem('discounts', disc.id)}
                  />
                  <span>{disc.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
