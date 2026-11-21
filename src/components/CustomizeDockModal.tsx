'use client';

import React, { useState } from 'react';
import './CustomizeDockModal.css';

export type ServiceCategory = 'ride' | 'carrier' | 'rental' | 'driver' | 'parking' | 'community';

export interface ShortcutItem {
  id: string;
  name: string;
  type: ServiceCategory;
  icon: string;
  route: string;
}

export const ALL_SERVICES_SHORTCUTS: ShortcutItem[] = [
  // 1. Rides Services
  { id: 'bike', name: 'Bike', type: 'ride', icon: 'fa-motorcycle', route: '/home/ride/bike' },
  { id: 'car', name: 'Car', type: 'ride', icon: 'fa-car', route: '/home/ride/car' },
  { id: 'auto', name: 'Auto', type: 'ride', icon: 'fa-taxi', route: '/home/ride/auto' },
  { id: 'bus', name: 'Bus Booking', type: 'ride', icon: 'fa-bus', route: '/home/ride/bus' },
  { id: 'shuttle', name: 'Shuttle / Van Booking', type: 'ride', icon: 'fa-van-shuttle', route: '/home/ride/bus' },
  { id: 'train_ride', name: 'Train Booking', type: 'ride', icon: 'fa-train', route: '/home/ride/train' },
  { id: 'flight_ride', name: 'Flight Booking', type: 'ride', icon: 'fa-plane', route: '/home/ride/flight' },
  { id: 'ferry', name: 'Ferry / Boat Booking', type: 'ride', icon: 'fa-ship', route: '/home/ride/boat' },
  { id: 'helicopter', name: 'Helicopter Booking', type: 'ride', icon: 'fa-helicopter', route: '/home/ride/helicopter' },

  // 2. Carriers & Cargo Logistics
  { id: 'truck', name: 'Truck', type: 'carrier', icon: 'fa-truck-moving', route: '/home/carrier' },
  { id: 'train_cargo', name: 'Train', type: 'carrier', icon: 'fa-train-subway', route: '/home/carrier' },
  { id: 'flight_cargo', name: 'Flight', type: 'carrier', icon: 'fa-plane-departure', route: '/home/carrier' },
  { id: 'bike_parcel', name: 'Bike', type: 'carrier', icon: 'fa-box', route: '/home/carrier' },
  { id: 'ship_cargo', name: 'Ship', type: 'carrier', icon: 'fa-ship', route: '/home/carrier' },
  { id: 'tempo', name: 'Mini Truck', type: 'carrier', icon: 'fa-truck-pickup', route: '/home/carrier' },

  // 3. Hourly & Daily Rentals
  { id: 'rental_car', name: 'Car Rental', type: 'rental', icon: 'fa-car-side', route: '/home/rental' },
  { id: 'rental_bike', name: 'Bike Rental', type: 'rental', icon: 'fa-motorcycle', route: '/home/rental' },
  { id: 'rental_self_drive', name: 'Self Drive', type: 'rental', icon: 'fa-key', route: '/home/rental' },
  { id: 'rental_scooter', name: 'EV Scooter', type: 'rental', icon: 'fa-bolt', route: '/home/rental' },

  // 4. Hire Drivers & Chauffeurs
  { id: 'driver_chauffeur', name: 'Personal Chauffeur', type: 'driver', icon: 'fa-user-tie', route: '/home/drivers' },
  { id: 'driver_outstation', name: 'Outstation Driver', type: 'driver', icon: 'fa-id-card', route: '/home/drivers' },
  { id: 'driver_hourly', name: 'Hourly Driver', type: 'driver', icon: 'fa-user-check', route: '/home/drivers' },

  // 5. Safe Parking Slots
  { id: 'parking_car', name: 'Car Parking', type: 'parking', icon: 'fa-square-parking', route: '/home/parking' },
  { id: 'parking_bike', name: 'Bike Parking', type: 'parking', icon: 'fa-motorcycle', route: '/home/parking' },
  { id: 'parking_ev', name: 'EV Charging Slot', type: 'parking', icon: 'fa-charging-station', route: '/home/parking' },
  { id: 'parking_monthly', name: 'Monthly Parking', type: 'parking', icon: 'fa-ticket', route: '/home/parking' },

  // 6. Communities
  { id: 'community_hub', name: 'Community Hub', type: 'community', icon: 'fa-users', route: '/home/community' },
  { id: 'community_union', name: 'Driver Union', type: 'community', icon: 'fa-users-gear', route: '/home/community' },
  { id: 'community_chat', name: 'Community Chat', type: 'community', icon: 'fa-comments', route: '/home/community' },
];

export const DEFAULT_SELECTED_SHORTCUT_IDS: string[] = ['bike'];

interface CustomizeDockModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSave: (ids: string[]) => void;
  maxSelections?: number;
}

export default function CustomizeDockModal({
  isOpen,
  onClose,
  selectedIds,
  onSave,
  maxSelections = 4
}: CustomizeDockModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<
    'all' | ServiceCategory
  >('all');
  const [tempSelected, setTempSelected] = useState<string[]>(selectedIds);

  // Sync temp selections when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedIds);
      setSearchQuery('');
    }
  }, [isOpen, selectedIds]);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    if (tempSelected.includes(id)) {
      if (tempSelected.length <= 1) {
        return;
      }
      setTempSelected(prev => prev.filter(item => item !== id));
    } else {
      // Maximum 4 shortcuts can be chosen
      if (tempSelected.length >= maxSelections) {
        alert(`You can choose a maximum of ${maxSelections} shortcuts for the navigation bar.`);
        return;
      }
      setTempSelected(prev => [...prev, id]);
    }
  };

  const handleResetDefaults = () => {
    setTempSelected(DEFAULT_SELECTED_SHORTCUT_IDS);
  };

  const handleDone = () => {
    onSave(tempSelected);
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
              Select {maxSelections} shortcuts ({tempSelected.length}/{maxSelections} selected)
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
            placeholder="Search services..."
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
            All Services
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'ride' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('ride')}
          >
            <i className="fa-solid fa-car-side" style={{ marginRight: '5px' }}></i> Rides
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'carrier' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('carrier')}
          >
            <i className="fa-solid fa-truck-moving" style={{ marginRight: '5px' }}></i> Carriers
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'rental' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('rental')}
          >
            <i className="fa-solid fa-key" style={{ marginRight: '5px' }}></i> Rentals
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'driver' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('driver')}
          >
            <i className="fa-solid fa-user-tie" style={{ marginRight: '5px' }}></i> Drivers
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'parking' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('parking')}
          >
            <i className="fa-solid fa-square-parking" style={{ marginRight: '5px' }}></i> Parkings
          </button>
          <button
            type="button"
            className={`dock-filter-tab ${activeCategoryFilter === 'community' ? 'active' : ''}`}
            onClick={() => setActiveCategoryFilter('community')}
          >
            <i className="fa-solid fa-users" style={{ marginRight: '5px' }}></i> Communities
          </button>
        </div>

        {/* 2-Column Grid Matching User's Image 2 */}
        <div className="dock-shortcuts-grid">
          {filteredServices.map(service => {
            const isSelected = tempSelected.includes(service.id);
            const isAtMax = !isSelected && tempSelected.length >= maxSelections;

            return (
              <div
                key={service.id}
                className={`shortcut-item-card ${isSelected ? 'selected' : ''} ${isAtMax ? 'disabled' : ''}`}
                onClick={() => handleToggle(service.id)}
              >
                <div className="shortcut-card-left">
                  <div className={`shortcut-icon-badge ${isSelected ? 'active' : ''}`}>
                    <i className={`fa-solid ${service.icon}`}></i>
                  </div>
                  <span className="shortcut-card-name">{service.name}</span>
                </div>

                <div className={`shortcut-radio-circle ${isSelected ? 'checked' : ''}`}>
                  {isSelected && <i className="fa-solid fa-check"></i>}
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
