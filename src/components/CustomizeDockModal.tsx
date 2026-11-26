'use client';

import React, { useState } from 'react';
import './CustomizeDockModal.css';

export interface ShortcutItem {
  id: string;
  name: string;
  type: 'ride' | 'carrier' | 'rental' | 'drivers' | 'parking' | 'community';
  icon: string;
  route: string;
}

export const ALL_SERVICES_SHORTCUTS: ShortcutItem[] = [
  // Rides Services
  { id: 'bike', name: 'Bike', type: 'ride', icon: 'fa-motorcycle', route: '/home/ride/bike' },
  { id: 'car', name: 'Car', type: 'ride', icon: 'fa-car', route: '/home/ride/car' },
  { id: 'auto', name: 'Auto', type: 'ride', icon: 'fa-taxi', route: '/home/ride/auto' },
  { id: 'bus', name: 'Bus Booking', type: 'ride', icon: 'fa-bus', route: '/home/ride/bus' },
  { id: 'shuttle', name: 'Shuttle / Van Booking', type: 'ride', icon: 'fa-van-shuttle', route: '/home/ride/bus' },
  { id: 'train_ride', name: 'Train Booking', type: 'ride', icon: 'fa-train', route: '/home/ride/train' },
  { id: 'flight_ride', name: 'Flight Booking', type: 'ride', icon: 'fa-plane', route: '/home/ride/flight' },
  { id: 'ferry', name: 'Ferry / Boat Booking', type: 'ride', icon: 'fa-ship', route: '/home/ride/boat' },
  { id: 'helicopter', name: 'Helicopter Booking', type: 'ride', icon: 'fa-helicopter', route: '/home/ride/helicopter' },

  // Carriers & Cargo Logistics
  { id: 'truck', name: 'Truck', type: 'carrier', icon: 'fa-truck-moving', route: '/home/carrier' },
  { id: 'train_cargo', name: 'Train Cargo', type: 'carrier', icon: 'fa-train-subway', route: '/home/carrier' },
  { id: 'flight_cargo', name: 'Flight Cargo', type: 'carrier', icon: 'fa-plane-departure', route: '/home/carrier' },
  { id: 'bike_parcel', name: 'Bike Parcel', type: 'carrier', icon: 'fa-box', route: '/home/carrier' },
  { id: 'ship_cargo', name: 'Ship Cargo', type: 'carrier', icon: 'fa-ship', route: '/home/carrier' },
  { id: 'bus_cargo', name: 'Bus Cargo', type: 'carrier', icon: 'fa-truck-pickup', route: '/home/carrier' },

  // Rentals
  { id: 'rental_luxury', name: 'Vehicle Rental', type: 'rental', icon: 'fa-gem', route: '/home/rental' },

  // Drivers
  { id: 'driver_on_demand', name: 'Driver', type: 'drivers', icon: 'fa-id-card', route: '/home/drivers' },

  // Parkings
  { id: 'parking_spot', name: 'Parkings', type: 'parking', icon: 'fa-square-p', route: '/home/parking' },
  { id: 'parking_ev', name: 'EV Charging Slot', type: 'parking', icon: 'fa-charging-station', route: '/home/parking' },

  // Communities
  { id: 'community_hub', name: 'Community Hub', type: 'community', icon: 'fa-users', route: '/home/community' },
  { id: 'community_union', name: 'Driver & Fleet Union', type: 'community', icon: 'fa-handshake', route: '/home/community' }
];

export const PERMANENT_SHORTCUT_IDS: string[] = ['bike', 'truck', 'parking_spot'];
export const DEFAULT_SELECTED_SHORTCUT_IDS: string[] = ['bike', 'truck', 'parking_spot'];

interface CustomizeDockModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSave: (ids: string[]) => void;
  maxCustomAdditions?: number;
}

export default function CustomizeDockModal({
  isOpen,
  onClose,
  selectedIds,
  onSave,
  maxCustomAdditions = 2
}: CustomizeDockModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'ride' | 'carrier' | 'rental' | 'drivers' | 'parking' | 'community'>('all');

  // Custom added shortcuts (excluding permanent ones: bike, truck, parking_spot)
  const [customSelected, setCustomSelected] = useState<string[]>([]);

  // Sync custom selections when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const customs = selectedIds.filter(id => !PERMANENT_SHORTCUT_IDS.includes(id)).slice(0, maxCustomAdditions);
      setCustomSelected(customs);
      setSearchQuery('');
    }
  }, [isOpen, selectedIds, maxCustomAdditions]);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    // If it's one of the 3 permanent shortcuts, it cannot be changed or removed
    if (PERMANENT_SHORTCUT_IDS.includes(id)) {
      return;
    }

    if (customSelected.includes(id)) {
      setCustomSelected(prev => prev.filter(item => item !== id));
    } else {
      // Max 2 custom shortcuts can be added
      if (customSelected.length >= maxCustomAdditions) {
        alert(`You can add up to ${maxCustomAdditions} extra shortcuts after Bike, Truck, and Parkings.`);
        return;
      }
      setCustomSelected(prev => [...prev, id]);
    }
  };

  const handleResetDefaults = () => {
    setCustomSelected([]);
  };

  const handleDone = () => {
    // Permanent 3 are always preserved first, followed by up to 2 custom choices
    const fullList = [...PERMANENT_SHORTCUT_IDS, ...customSelected.slice(0, maxCustomAdditions)];
    onSave(fullList);
    onClose();
  };

  const filteredServices = ALL_SERVICES_SHORTCUTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryFilter === 'all' || s.type === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="dock-modal-backdrop" onClick={onClose}>
      <div className="dock-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="dock-modal-header">
          <div>
            <h3 className="dock-modal-title">Customize Shortcuts</h3>
            <span className="dock-modal-subtitle">
              Bike, Truck &amp; Parkings are permanent defaults. Add up to {maxCustomAdditions} extra shortcuts ({customSelected.length}/{maxCustomAdditions} added)
            </span>
          </div>
          <button type="button" className="dock-modal-close-btn" onClick={onClose} title="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="dock-modal-search-box">
          <i className="fa-solid fa-magnifying-glass search-ico"></i>
          <input
            type="text"
            className="dock-modal-search-input"
            placeholder="Search rides, carriers, rentals, parkings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs: All, Rides, Carriers, Rentals, Drivers, Parkings, Communities */}
        <div className="dock-service-filter-row">
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('all')}
          >
            <i className="fa-solid fa-border-all"></i>
            <span>All</span>
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'ride' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('ride')}
          >
            <i className="fa-solid fa-car-side"></i>
            <span>Rides</span>
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'carrier' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('carrier')}
          >
            <i className="fa-solid fa-truck-moving"></i>
            <span>Carriers</span>
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'rental' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('rental')}
          >
            <i className="fa-solid fa-key"></i>
            <span>Rentals</span>
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'drivers' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('drivers')}
          >
            <i className="fa-solid fa-user-tie"></i>
            <span>Drivers</span>
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'parking' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('parking')}
          >
            <i className="fa-solid fa-square-p"></i>
            <span>Parkings</span>
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'community' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('community')}
          >
            <i className="fa-solid fa-users"></i>
            <span>Communities</span>
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="dock-shortcuts-grid">
          {filteredServices.map(service => {
            const isPermanent = PERMANENT_SHORTCUT_IDS.includes(service.id);
            const isSelected = isPermanent || customSelected.includes(service.id);
            const isAtMax = !isSelected && customSelected.length >= maxCustomAdditions;

            return (
              <div
                key={service.id}
                className={`shortcut-item-card ${isSelected ? 'selected' : ''} ${isAtMax ? 'disabled' : ''} ${isPermanent ? 'permanent-locked' : ''}`}
                onClick={() => handleToggle(service.id)}
                style={{
                  cursor: isPermanent ? 'default' : isAtMax ? 'not-allowed' : 'pointer',
                  opacity: isPermanent ? 0.95 : isAtMax ? 0.5 : 1
                }}
                title={isPermanent ? 'Default permanent shortcut (cannot be removed)' : service.name}
              >
                <div className="shortcut-card-left">
                  <div className={`shortcut-icon-badge ${isSelected ? 'active' : ''}`}>
                    <i className={`fa-solid ${service.icon}`}></i>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="shortcut-card-name">{service.name}</span>
                    {isPermanent && (
                      <span style={{ fontSize: '10.5px', color: '#16a34a', fontWeight: 700 }}>
                        Permanent Default
                      </span>
                    )}
                  </div>
                </div>

                <div className={`shortcut-radio-circle ${isSelected ? 'checked' : ''}`} style={isPermanent ? { backgroundColor: '#16a34a', borderColor: '#16a34a' } : {}}>
                  {isSelected && <i className={`fa-solid ${isPermanent ? 'fa-lock' : 'fa-check'}`}></i>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer with Reset Defaults and Done button */}
        <div className="dock-modal-footer">
          <button
            type="button"
            className="dock-reset-btn"
            onClick={handleResetDefaults}
          >
            Reset Defaults
          </button>

          <button
            type="button"
            className="dock-done-btn"
            onClick={handleDone}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
