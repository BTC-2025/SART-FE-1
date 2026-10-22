'use client';

import React, { useState, useEffect } from 'react';
import { useSartStore } from '@/store/useSartStore';
import {
  RENTAL_MASTER_CATEGORIES,
  ALL_RENTAL_VEHICLES,
  INDIAN_CITIES,
  MONTH_SHORT,
  RentalMasterCategory
} from './rental/rentalData';
import RentalStepOne from './rental/RentalStepOne';
import RentalStepTwo from './rental/RentalStepTwo';
import RentalStepThree from './rental/RentalStepThree';

interface RentalBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

class ModalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ zIndex: 9999, position: 'fixed', top: '100px', left: '20px', background: 'red', color: 'white', padding: '20px', borderRadius: '10px' }}>
          <h2>Modal Crash!</h2>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function RentalBookingModalWrapper(props: RentalBookingModalProps) {
  return (
    <ModalErrorBoundary>
      <RentalBookingModal {...props} />
    </ModalErrorBoundary>
  );
}

function RentalBookingModal({ isOpen, onClose }: RentalBookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMasterId, setSelectedMasterId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  // Form State
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [returnToSameLocation, setReturnToSameLocation] = useState(true);
  const [showLocationList, setShowLocationList] = useState(false);
  const [showDropoffList, setShowDropoffList] = useState(false);

  // Pick-up Date & Time
  const [pickupDate, setPickupDate] = useState(() => {
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;
  });
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [showPickupCalendar, setShowPickupCalendar] = useState(false);
  const [pickupCalMonth, setPickupCalMonth] = useState(() => new Date().getMonth());
  const [pickupCalYear, setPickupCalYear] = useState(() => new Date().getFullYear());

  // Drop-off Date & Time
  const [dropoffDate, setDropoffDate] = useState(() => {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[tom.getDay()]}, ${tom.getDate()} ${months[tom.getMonth()]}`;
  });
  const [dropoffTime, setDropoffTime] = useState('10:00 AM');
  const [showDropoffCalendar, setShowDropoffCalendar] = useState(false);
  const [dropoffCalMonth, setDropoffCalMonth] = useState(() => {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    return tom.getMonth();
  });
  const [dropoffCalYear, setDropoffCalYear] = useState(() => {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    return tom.getFullYear();
  });

  // Vehicle Selection Dropdown
  const [selectedRentalVehicleId, setSelectedRentalVehicleId] = useState('r-swift');
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

  // Filter & Sort States
  const [filterFuel, setFilterFuel] = useState<string>('ALL');
  const [filterTransmission, setFilterTransmission] = useState<string>('ALL');
  const [filterSeats, setFilterSeats] = useState<string>('ALL');
  const [filterModelYear, setFilterModelYear] = useState<string>('ALL');
  const [filterCategoryModel, setFilterCategoryModel] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('near_first');
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(10000);

  // Live Location State & Distance
  const [userLocationName, setUserLocationName] = useState('Bengaluru (Indiranagar)');
  const [isLocating, setIsLocating] = useState(false);

  const [rentalType, setRentalType] = useState('Daily');
  const [durationPlan, setDurationPlan] = useState<'1day' | '3days' | '1week' | '2weeks' | '1month' | 'custom'>('1day');
  const [customDays, setCustomDays] = useState(1);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [startTime, setStartTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [returnTime, setReturnTime] = useState('10:00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Customer verification details
  const [customerName, setCustomerName] = useState('');
  const [customerAge, setCustomerAge] = useState('26');
  const [customerPhone, setCustomerPhone] = useState('');
  const [docType, setDocType] = useState<'dl' | 'aadhaar' | 'pan'>('dl');
  const [docNumber, setDocNumber] = useState('');
  const [uploadedDocName, setUploadedDocName] = useState('driving_license_front.jpg');
  const [isDocVerified, setIsDocVerified] = useState(true);

  const pickupBoxRef = React.useRef<HTMLDivElement>(null);
  const dropoffBoxRef = React.useRef<HTMLDivElement>(null);
  const pickupCalRef = React.useRef<HTMLDivElement>(null);
  const dropoffCalRef = React.useRef<HTMLDivElement>(null);
  const vehicleBoxRef = React.useRef<HTMLDivElement>(null);

  const handleSelectPickupDate = (day: number, m = pickupCalMonth, y = pickupCalYear) => {
    const formatted = `${String(day).padStart(2, '0')} ${MONTH_SHORT[m]}, ${y}`;
    setPickupDate(formatted);
    setShowPickupCalendar(false);
  };

  const handleSelectDropoffDate = (day: number, m = dropoffCalMonth, y = dropoffCalYear) => {
    const formatted = `${String(day).padStart(2, '0')} ${MONTH_SHORT[m]}, ${y}`;
    setDropoffDate(formatted);
    setShowDropoffCalendar(false);
  };

  const updateUrl = (path: string) => {
    if (typeof window !== 'undefined') {
      try {
        const nativePushState = Object.getPrototypeOf(window.history).pushState;
        nativePushState.call(window.history, null, '', path);
      } catch (e) {
        window.history.pushState(null, '', path);
      }
    }
  };

  useEffect(() => {
    const handleUrlState = () => {
      const path = window.location.pathname;

      let searchParamsObj = new URLSearchParams();
      if (typeof window !== 'undefined') {
        searchParamsObj = new URLSearchParams(window.location.search);
      }

      const subService = searchParamsObj.get('subService') || searchParamsObj.get('vehicle');
      const origin = searchParamsObj.get('origin') || searchParamsObj.get('source');
      const searchDate = searchParamsObj.get('date');

      if (origin) setPickup(origin);
      if (searchDate) setPickupDate(searchDate);

      if (subService || path.includes('-rental') || path.startsWith('/home/rental/')) {
        let masterId = '';
        if (subService) {
          masterId = subService.toLowerCase();
        } else {
          const parts = path.split('/');
          const lastPart = parts[parts.length - 1];
          if (lastPart && lastPart !== 'rental' && lastPart !== 'home') {
            masterId = decodeURIComponent(lastPart).replace('-rental', '').toLowerCase();
          }
        }

        if (masterId) {
          let foundMaster = RENTAL_MASTER_CATEGORIES.find(m => m.name.toLowerCase().includes(masterId) || m.id.toLowerCase() === masterId);
          let foundVehicleId = '';

          if (!foundMaster) {
            for (const category of RENTAL_MASTER_CATEGORIES) {
              const vehicleMatch = category.list.find((v: any) => v.id.toLowerCase() === masterId || v.name.toLowerCase().includes(masterId));
              if (vehicleMatch) {
                foundMaster = category;
                foundVehicleId = vehicleMatch.id;
                break;
              }
            }
          }

          if (foundMaster) {
            setSelectedMasterId(foundMaster.id);
            if (foundVehicleId) {
              setSelectedVehicleId(foundVehicleId);
            } else if (foundMaster.list.length > 0) {
              setSelectedVehicleId(foundMaster.list[0].id);
            }

            if (typeof window !== 'undefined' && path === '/home/rental' && subService) {
              try {
                const cleanName = foundMaster.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const nativePushState = Object.getPrototypeOf(window.history).pushState;
                nativePushState.call(window.history, null, '', `/home/rental/${cleanName}`);
              } catch (e) { }
            }

            setStep(2);
            return;
          }
        }
      }

      if (path.includes('-checkout')) {
        setStep(3);
      } else if (path === '/' || path === '/home') {
        useSartStore.getState().setActiveTab('home');
      }
    };

    if (isOpen) {
      handleUrlState();
    }

    window.addEventListener('popstate', handleUrlState);
    return () => {
      window.removeEventListener('popstate', handleUrlState);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleReset = () => {
      setStep(1);
      setIsProcessing(false);
      setIsConfirmed(false);
    };
    window.addEventListener('resetModalSteps', handleReset);
    return () => window.removeEventListener('resetModalSteps', handleReset);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        pickupCalRef.current &&
        !pickupCalRef.current.contains(e.target as Node) &&
        pickupBoxRef.current &&
        !pickupBoxRef.current.contains(e.target as Node)
      ) {
        setShowPickupCalendar(false);
        setShowLocationList(false);
      }

      if (
        dropoffCalRef.current &&
        !dropoffCalRef.current.contains(e.target as Node) &&
        dropoffBoxRef.current &&
        !dropoffBoxRef.current.contains(e.target as Node)
      ) {
        setShowDropoffCalendar(false);
        setShowDropoffList(false);
      }

      if (
        vehicleBoxRef.current &&
        !vehicleBoxRef.current.contains(e.target as Node)
      ) {
        setShowVehicleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (!isOpen) return null;

  const handleSelectMaster = (master: RentalMasterCategory) => {
    setSelectedMasterId(master.id);
    if (master.list.length > 0) {
      setSelectedVehicleId(master.list[0].id);
    }
    setStep(2);
  };

  const handleBackToFleet = () => {
    setStep(1);
  };

  const handleClose = () => {
    setStep(1);
    updateUrl('/');
    useSartStore.getState().setActiveTab('home');
    onClose();
  };

  const handleBook = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);
    }, 2000);
  };

  const handleFinalConfirm = () => {
    let vehicleName = 'Self-Drive Vehicle';
    let vehiclePrice = 1500;

    const master = RENTAL_MASTER_CATEGORIES.find(m => m.id === selectedMasterId);
    if (master) {
      const found = master.list.find((v: any) => v.id === selectedVehicleId);
      if (found) {
        vehicleName = found.name;
        vehiclePrice = found.price;
      }
    }

    let subtitle = `${vehicleName} • ${rentalType} Rental`;
    if (startDate && returnDate) {
      subtitle += ` • From ${startDate} to ${returnDate}`;
    }

    if ((window as any).executeGenericBooking) {
      (window as any).executeGenericBooking('rental', `Rental: ${pickup}`, subtitle, vehiclePrice, { from: pickup, startDate, startTime, returnDate, returnTime, rentalType });
    }
    window.location.reload();
  };

  const activeMaster = RENTAL_MASTER_CATEGORIES.find(m => m.id === selectedMasterId);
  const activeVehicle = activeMaster?.list.find((v: any) => v.id === selectedVehicleId);

  return (
    <div
      className="sart-modal-backdrop"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        zIndex: 1000,
        background: 'transparent',
        padding: '0',
        width: '100%',
        minHeight: '100%'
      }}
      onClick={handleClose}
    >
      <div
        className="rental-booking-modal-sheet"
        style={{
          maxWidth: '1200px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
          margin: '0 auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dummy-modal-header-for-css-hack" style={{ display: 'none' }}></div>

      {/* STEP 1: SELF-DRIVE & RENTALS SEARCH + FLEET */}
      {step === 1 && (
        <RentalStepOne
          pickup={pickup}
          setPickup={setPickup}
          dropoff={dropoff}
          setDropoff={setDropoff}
          returnToSameLocation={returnToSameLocation}
          setReturnToSameLocation={setReturnToSameLocation}
          showLocationList={showLocationList}
          setShowLocationList={setShowLocationList}
          showDropoffList={showDropoffList}
          setShowDropoffList={setShowDropoffList}
          pickupDate={pickupDate}
          setPickupDate={setPickupDate}
          pickupTime={pickupTime}
          setPickupTime={setPickupTime}
          showPickupCalendar={showPickupCalendar}
          setShowPickupCalendar={setShowPickupCalendar}
          pickupCalMonth={pickupCalMonth}
          setPickupCalMonth={setPickupCalMonth}
          pickupCalYear={pickupCalYear}
          setPickupCalYear={setPickupCalYear}
          dropoffDate={dropoffDate}
          setDropoffDate={setDropoffDate}
          dropoffTime={dropoffTime}
          setDropoffTime={setDropoffTime}
          showDropoffCalendar={showDropoffCalendar}
          setShowDropoffCalendar={setShowDropoffCalendar}
          dropoffCalMonth={dropoffCalMonth}
          setDropoffCalMonth={setDropoffCalMonth}
          dropoffCalYear={dropoffCalYear}
          setDropoffCalYear={setDropoffCalYear}
          selectedMasterId={selectedMasterId}
          setSelectedMasterId={setSelectedMasterId}
          selectedRentalVehicleId={selectedRentalVehicleId}
          setSelectedRentalVehicleId={setSelectedRentalVehicleId}
          showVehicleDropdown={showVehicleDropdown}
          setShowVehicleDropdown={setShowVehicleDropdown}
          pickupBoxRef={pickupBoxRef}
          dropoffBoxRef={dropoffBoxRef}
          pickupCalRef={pickupCalRef}
          dropoffCalRef={dropoffCalRef}
          vehicleBoxRef={vehicleBoxRef}
          handleSelectPickupDate={handleSelectPickupDate}
          handleSelectDropoffDate={handleSelectDropoffDate}
          setCustomDays={setCustomDays}
          setDurationPlan={setDurationPlan}
          handleSelectMaster={handleSelectMaster}
          setSelectedVehicleId={setSelectedVehicleId}
          handleClose={handleClose}
        />
      )}

      {/* STEP 2: SEARCH RESULTS CATALOG */}
      {step === 2 && activeMaster && (
        <RentalStepTwo
          activeMaster={activeMaster}
          pickup={pickup}
          pickupDate={pickupDate}
          dropoffDate={dropoffDate}
          userLocationName={userLocationName}
          isLocating={isLocating}
          setIsLocating={setIsLocating}
          setUserLocationName={setUserLocationName}
          filterFuel={filterFuel}
          setFilterFuel={setFilterFuel}
          filterTransmission={filterTransmission}
          setFilterTransmission={setFilterTransmission}
          filterSeats={filterSeats}
          setFilterSeats={setFilterSeats}
          filterModelYear={filterModelYear}
          setFilterModelYear={setFilterModelYear}
          filterCategoryModel={filterCategoryModel}
          setFilterCategoryModel={setFilterCategoryModel}
          sortBy={sortBy}
          setSortBy={setSortBy}
          priceMin={priceMin}
          setPriceMin={setPriceMin}
          priceMax={priceMax}
          setPriceMax={setPriceMax}
          durationPlan={durationPlan}
          setDurationPlan={setDurationPlan}
          customDays={customDays}
          setCustomDays={setCustomDays}
          selectedVehicleId={selectedVehicleId}
          setSelectedVehicleId={setSelectedVehicleId}
          handleBackToFleet={handleBackToFleet}
          handleClose={handleClose}
          setStep={setStep}
        />
      )}

      {/* STEP 3: BOOKING SUMMARY & CHECKOUT */}
      {step === 3 && activeMaster && (
        <RentalStepThree
          activeMaster={activeMaster}
          activeVehicle={activeVehicle}
          pickup={pickup}
          dropoff={dropoff}
          returnToSameLocation={returnToSameLocation}
          pickupDate={pickupDate}
          pickupTime={pickupTime}
          dropoffDate={dropoffDate}
          dropoffTime={dropoffTime}
          durationPlan={durationPlan}
          customDays={customDays}
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerAge={customerAge}
          setCustomerAge={setCustomerAge}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          docType={docType}
          setDocType={setDocType}
          docNumber={docNumber}
          setDocNumber={setDocNumber}
          uploadedDocName={uploadedDocName}
          setUploadedDocName={setUploadedDocName}
          isDocVerified={isDocVerified}
          setIsDocVerified={setIsDocVerified}
          isProcessing={isProcessing}
          isConfirmed={isConfirmed}
          setIsConfirmed={setIsConfirmed}
          setStep={setStep}
          handleBook={handleBook}
          handleFinalConfirm={handleFinalConfirm}
        />
      )}
      </div>
    </div>
  );
}
