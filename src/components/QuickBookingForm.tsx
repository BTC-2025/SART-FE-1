'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './QuickBookingForm.css';

export default function QuickBookingForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('rides');
  const [activeSubTab, setActiveSubTab] = useState('car');
  const [isHovered, setIsHovered] = useState(false);

  // Form State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const tabs = [
    { id: 'carrier', icon: 'fa-solid fa-truck-fast', label: 'Carrier', btnName: "Book Carrier" },
    { id: 'parking', icon: 'fa-solid fa-square-parking', label: 'Parking', btnName: "Reserve Parking" },
    { id: 'rides', icon: 'fa-solid fa-car-side', label: 'Rides', btnName: "Book Ride" },
    { id: 'rental', icon: 'fa-solid fa-key', label: 'Rental', btnName: "Rent Vehicle" },
    { id: 'driver', icon: 'fa-solid fa-user-tie', label: 'Driver', btnName: "Hire Driver" }
  ];

  const subServices: Record<string, any[]> = {
    rides: [
      { id: 'bike', label: 'Bike', icon: 'fa-solid fa-motorcycle', colorClass: 'icon-bg-pink' },
      { id: 'auto', label: 'Auto', icon: 'fa-solid fa-taxi', colorClass: 'icon-bg-yellow' },
      { id: 'car', label: 'Car / Sedan', icon: 'fa-solid fa-car', colorClass: 'icon-bg-blue' },
      { id: 'suv', label: 'SUV & Multi-Utility', icon: 'fa-solid fa-truck-pickup', colorClass: 'icon-bg-pink-light' },
      { id: 'bus', label: 'Bus & Minivan', icon: 'fa-solid fa-bus', colorClass: 'icon-bg-purple' },
      { id: 'boat', label: 'Boat & Speedboat', icon: 'fa-solid fa-ship', colorClass: 'icon-bg-teal' },
      { id: 'yacht', label: 'Yacht & Cruise', icon: 'fa-solid fa-anchor', colorClass: 'icon-bg-gray' },
      { id: 'flight', label: 'Charter Flight', icon: 'fa-solid fa-plane-departure', colorClass: 'icon-bg-purple-light' },
      { id: 'heli', label: 'Helicopter', icon: 'fa-solid fa-helicopter', colorClass: 'icon-bg-green' },
      { id: 'train', label: 'Express Train', icon: 'fa-solid fa-train', colorClass: 'icon-bg-yellow-light' }
    ],
    carrier: [
      { id: 'c-bike', label: 'Delivery Bike / Moto', icon: 'fa-solid fa-motorcycle', colorClass: 'icon-bg-pink' },
      { id: 'c-auto', label: 'Electric Three-Wheeler Cargo', icon: 'fa-solid fa-truck-fast', colorClass: 'icon-bg-yellow' },
      { id: 'c-minitruck', label: 'Small Commercial Mini-Truck', icon: 'fa-solid fa-truck-pickup', colorClass: 'icon-bg-blue' },
      { id: 'c-lcv', label: 'Light Commercial Lorry (LCV)', icon: 'fa-solid fa-truck', colorClass: 'icon-bg-blue' },
      { id: 'c-hcv', label: 'Heavy Rigid Lorry (HCV)', icon: 'fa-solid fa-truck-moving', colorClass: 'icon-bg-purple' },
      { id: 'c-trailer', label: 'Multi-Axle Semi-Trailer', icon: 'fa-solid fa-truck-front', colorClass: 'icon-bg-pink-light' },
      { id: 'c-barge', label: 'Small Coastal Cargo Barge', icon: 'fa-solid fa-ship', colorClass: 'icon-bg-teal' },
      { id: 'c-general', label: 'General Cargo Ship', icon: 'fa-solid fa-sailboat', colorClass: 'icon-bg-blue' },
      { id: 'c-feeder', label: 'Feedership Container Ship', icon: 'fa-solid fa-anchor', colorClass: 'icon-bg-purple-light' },
      { id: 'c-mega', label: 'Mega Container Ship', icon: 'fa-solid fa-ferry', colorClass: 'icon-bg-pink' },
      { id: 'c-drone', label: 'Delivery Drone / Quadcopter', icon: 'fa-solid fa-helicopter', colorClass: 'icon-bg-green' },
      { id: 'c-belly', label: 'Passenger Aircraft Belly Cargo', icon: 'fa-solid fa-plane', colorClass: 'icon-bg-yellow-light' },
      { id: 'c-turboprop', label: 'Regional Turboprop Freighter', icon: 'fa-solid fa-plane-departure', colorClass: 'icon-bg-yellow' },
      { id: 'c-narrow', label: 'Narrow-Body Jet Freighter', icon: 'fa-solid fa-plane-arrival', colorClass: 'icon-bg-blue' },
      { id: 'c-wide', label: 'Wide-Body Heavy Jet Freighter', icon: 'fa-solid fa-globe', colorClass: 'icon-bg-pink-light' },
      { id: 'c-freight', label: 'Standard Freight Train', icon: 'fa-solid fa-train', colorClass: 'icon-bg-purple' },
      { id: 'c-tanker', label: 'Liquid Tanker Train', icon: 'fa-solid fa-train-subway', colorClass: 'icon-bg-blue' },
      { id: 'c-intermodal', label: 'Intermodal Container Train', icon: 'fa-solid fa-train-tram', colorClass: 'icon-bg-green' },
      { id: 'c-heavyhaul', label: 'Heavy-Haul Locomotive', icon: 'fa-solid fa-train', colorClass: 'icon-bg-yellow' }
    ],
    parking: [
      { id: 'p-bike', label: 'Two-Wheeler Parking', icon: 'fa-solid fa-motorcycle', colorClass: 'icon-bg-pink' },
      { id: 'p-car', label: 'Car Parking Space', icon: 'fa-solid fa-car-side', colorClass: 'icon-bg-blue' },
      { id: 'p-suv', label: 'SUV / MPV Large Space', icon: 'fa-solid fa-truck-pickup', colorClass: 'icon-bg-purple' },
      { id: 'p-truck', label: 'Commercial Truck Yard', icon: 'fa-solid fa-truck-front', colorClass: 'icon-bg-yellow' },
      { id: 'p-boat', label: 'Small Boat Mooring', icon: 'fa-solid fa-sailboat', colorClass: 'icon-bg-teal' },
      { id: 'p-yacht', label: 'Luxury Yacht Marina Slip', icon: 'fa-solid fa-anchor', colorClass: 'icon-bg-pink-light' },
      { id: 'p-heli', label: 'Helipad Landing', icon: 'fa-solid fa-helicopter', colorClass: 'icon-bg-green' }
    ],
    rental: [
      { id: 'bike', label: 'Bikes & Scooters', icon: 'fa-solid fa-motorcycle', colorClass: 'icon-bg-yellow' },
      { id: 'car', label: 'Cars & Sedans', icon: 'fa-solid fa-car-side', colorClass: 'icon-bg-blue' },
      { id: 'suv', label: 'SUVs & Off-Roaders', icon: 'fa-solid fa-mountain-sun', colorClass: 'icon-bg-pink' },
      { id: 'van', label: 'Vans & Specialty', icon: 'fa-solid fa-van-shuttle', colorClass: 'icon-bg-green' },
      { id: 'water', label: 'Boats & Yachts', icon: 'fa-solid fa-ship', colorClass: 'icon-bg-teal' },
      { id: 'air', label: 'Air Charters', icon: 'fa-solid fa-plane', colorClass: 'icon-bg-purple' },
      { id: 'rail', label: 'Train Charters', icon: 'fa-solid fa-train', colorClass: 'icon-bg-red' }
    ],
    driver: [
      { id: 'd-bike', label: 'Bike / Scooter Rider', icon: 'fa-solid fa-motorcycle', colorClass: 'icon-bg-green' },
      { id: 'd-auto', label: 'Auto-Rickshaw Driver', icon: 'fa-solid fa-taxi', colorClass: 'icon-bg-yellow' },
      { id: 'd-car', label: 'Personal Car Chauffeur', icon: 'fa-solid fa-car-side', colorClass: 'icon-bg-blue' },
      { id: 'd-suv', label: 'SUV / MUV Driver', icon: 'fa-solid fa-car', colorClass: 'icon-bg-pink' },
      { id: 'd-luxury', label: 'Luxury Chauffeur', icon: 'fa-solid fa-user-tie', colorClass: 'icon-bg-purple' },
      { id: 'd-valet', label: 'Event Valet Driver', icon: 'fa-solid fa-key', colorClass: 'icon-bg-teal' },
      { id: 'd-truck', label: 'Heavy Truck Driver', icon: 'fa-solid fa-truck-front', colorClass: 'icon-bg-orange' }
    ]
  };

  const activeTabData = tabs.find(t => t.id === activeTab)!;
  const currentSubServices = subServices[activeTab] || [];

  // Reset subtab when main tab changes
  useEffect(() => {
    if (currentSubServices.length > 0) {
      setActiveSubTab(currentSubServices[0].id);
    }
  }, [activeTab]);

  const setDateToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  };

  const setDateTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  };

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (origin) query.append('origin', origin);
    if (destination) query.append('destination', destination);
    if (date) query.append('date', date);
    
    const queryString = query.toString() ? `?${query.toString()}` : '';
    const tabName = activeTab === 'rides' ? 'ride' : activeTab;
    
    // We must use Next.js standard router push to trigger React state updates naturally,
    // but we use the query string format instead of nested slugs to prevent Next.js Route Reversion bugs
    router.push(`/home/${tabName}?subService=${activeSubTab}&${query.toString()}`);
  };

  return (
    <div className="quick-booking-outer">
      <div className="qb-header">
        <h2>Choose Your Bookings</h2>
      </div>

      <div className="qb-main-container">
        {/* Dynamic Expanding Tabs */}
        <div 
          className="qb-tabs-nav"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              className={`qb-tab-btn btn-${tab.id} ${activeTab === tab.id ? 'active' : ''} ${isHovered ? 'show' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={tab.icon}></i> {tab.label}
            </button>
          ))}
        </div>

        {/* Sub-Service Icons Carousel (Continuous CSS Animation) */}
        <div className="qb-subservices-container">
          <div className="qb-icon-marquee-wrapper">
            <div className="qb-marquee-track">
              {/* Render items twice for seamless looping */}
              {[...currentSubServices, ...currentSubServices].map((sub, index) => (
                <div 
                  key={`${sub.id}-${index}`} 
                  className={`qb-sub-icon ${sub.colorClass} ${activeSubTab === sub.id ? 'active' : ''}`}
                  onClick={() => setActiveSubTab(sub.id)}
                  title={sub.label}
                >
                  <i className={sub.icon}></i>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Form Area */}
        <div className="qb-form-box">
          {/* Pickup / Origin */}
          <div className="qb-field qb-location">
            <i className="fa-solid fa-location-dot icon-gray" style={{marginRight: '12px'}}></i>
            <div className="qb-input-wrap" style={{justifyContent: 'center'}}>
              <input 
                type="text" 
                placeholder={['parking', 'rental'].includes(activeTab) ? 'Enter Location' : 'Enter Pickup Location'} 
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
            {!['parking', 'rental'].includes(activeTab) && (
              <button 
                className="qb-swap-btn"
                onClick={() => {
                  const temp = origin;
                  setOrigin(destination);
                  setDestination(temp);
                }}
              >
                <i className="fa-solid fa-right-left"></i>
              </button>
            )}
          </div>

          {/* Drop / Destination (Only for some) */}
          {!['parking', 'rental'].includes(activeTab) && (
            <div className="qb-field qb-location">
              <i className="fa-solid fa-circle-dot icon-gray" style={{marginRight: '12px'}}></i>
              <div className="qb-input-wrap" style={{justifyContent: 'center'}}>
                <input 
                  type="text" 
                  placeholder="Enter Drop Location" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
          )}

          <button className="qb-search-btn" onClick={handleSearch}>
            Search Book
          </button>
        </div>
      </div>
    </div>
  );
}
