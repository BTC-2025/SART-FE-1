import React from 'react';
import { BusItem, BusSeat, RouteStop } from './busData';
import { BusLiveTrackingTab } from './BusLiveTrackingTab';
import { BusBoardingDroppingTab } from './BusBoardingDroppingTab';
import { BusPassengerInfoTab } from './BusPassengerInfoTab';
import { BusSelectSeatsTab } from './BusSelectSeatsTab';

export interface BusBookingModalProps {
  selectedBus: BusItem | null;
  setSelectedBus: (b: BusItem | null) => void;
  modalTopTab: 'select_seats' | 'boarding_dropping' | 'passenger_info' | 'live_tracking';
  setModalTopTab: (t: any) => void;
  isGpsEnabled: boolean;
  setIsGpsEnabled: (v: boolean) => void;
  activeFullRoute: RouteStop[];
  selectedBoardingPoint: string;
  selectedDroppingPoint: string;
  activeRouteData: any;
  activeBoardingPoints: any[];
  activeDroppingPoints: any[];
  setSelectedBoardingPoint: (s: string) => void;
  setSelectedDroppingPoint: (s: string) => void;
  boardingSubTab: 'boarding_dropping' | 'cancellation' | 'amenities' | 'travel_policy';
  setBoardingSubTab: (t: any) => void;
  passengers: Record<string, { name: string; age: string; gender: 'Male' | 'Female' }>;
  updatePassengerField: (seatId: string, field: 'name' | 'age' | 'gender', value: any) => void;
  registeredPhone: string;
  setRegisteredPhone: (val: string) => void;
  isEditingPhone: boolean;
  setIsEditingPhone: (val: boolean) => void;
  tempPhone: string;
  setTempPhone: (val: string) => void;
  stateOfResidence: string;
  whatsAppOptIn: boolean;
  setWhatsAppOptIn: (val: boolean) => void;
  tripRewardOptIn: boolean;
  setTripRewardOptIn: (val: boolean) => void;
  selectedSeats: string[];
  dateOfJourney?: string;
  calculateTotalFare: () => number;
  handleConfirmBusBooking: () => void;
  currentSeatLayout: any;
  handleToggleSeat: (seat: BusSeat) => void;
  setPreviewPhoto: (url: string | null) => void;
  modalSubTab: string;
  setModalSubTab: (t: string) => void;
  previewPhoto: string | null;
  bookingConfirmed: boolean;
  confirmedPnr: string;
  onDoneBooking?: () => void;
}

export const BusBookingModal: React.FC<BusBookingModalProps> = (props) => {
  const {
    selectedBus, setSelectedBus, modalTopTab, setModalTopTab,
    isGpsEnabled, setIsGpsEnabled, activeFullRoute,
    selectedBoardingPoint, selectedDroppingPoint,
    activeRouteData, activeBoardingPoints, activeDroppingPoints,
    setSelectedBoardingPoint, setSelectedDroppingPoint,
    boardingSubTab, setBoardingSubTab,
    passengers, updatePassengerField, registeredPhone, setRegisteredPhone,
    isEditingPhone, setIsEditingPhone, tempPhone, setTempPhone,
    stateOfResidence, whatsAppOptIn, setWhatsAppOptIn,
    tripRewardOptIn, setTripRewardOptIn, selectedSeats,
    dateOfJourney, calculateTotalFare, handleConfirmBusBooking, currentSeatLayout,
    handleToggleSeat, setPreviewPhoto, modalSubTab, setModalSubTab, previewPhoto,
    bookingConfirmed, confirmedPnr, onDoneBooking
  } = props;

  if (!selectedBus) return null;

  return (
    <div className="bb-seat-modal-backdrop" onClick={() => setSelectedBus(null)}>
      <div className="bb-seat-modal-box-img3" onClick={(e) => e.stopPropagation()}>
        {/* Top Navigation Bar: Select seats | Board/Drop point | Passenger Info | Live Tracking */}
        <div className="bb-modal-top-tabs-bar">
          <div className="bb-modal-top-nav-links">
            <button
              type="button"
              className={`bb-modal-nav-tab ${modalTopTab === 'select_seats' ? 'active' : ''}`}
              onClick={() => setModalTopTab('select_seats')}
            >
              <i className="fa-solid fa-couch" style={{ marginRight: '6px' }}></i> Select seats
            </button>
            <button
              type="button"
              className={`bb-modal-nav-tab ${modalTopTab === 'boarding_dropping' ? 'active' : ''}`}
              onClick={() => setModalTopTab('boarding_dropping')}
            >
              <i className="fa-solid fa-location-dot" style={{ marginRight: '6px' }}></i> Board/Drop point
            </button>
            <button
              type="button"
              className={`bb-modal-nav-tab ${modalTopTab === 'passenger_info' ? 'active' : ''}`}
              onClick={() => setModalTopTab('passenger_info')}
            >
              <i className="fa-solid fa-users" style={{ marginRight: '6px' }}></i> Passenger Info
            </button>
            <button
              type="button"
              className={`bb-modal-nav-tab live-track-tab ${modalTopTab === 'live_tracking' ? 'active' : ''}`}
              onClick={() => setModalTopTab('live_tracking')}
            >
              <span className={`bb-live-pulse-dot ${isGpsEnabled ? 'gps-on' : ''}`}></span>
              <i className="fa-solid fa-satellite-dish" style={{ marginRight: '6px' }}></i> Live Tracking
            </button>
          </div>

          <button
            type="button"
            className="bb-modal-close-icon-btn"
            onClick={() => setSelectedBus(null)}
            title="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {bookingConfirmed ? (
          <div className="bb-img4-confirmed-view">
            <div className="bb-img4-header-row">
              <div className="bb-img4-check-circle">✓</div>
              <h2 className="bb-img4-cnf-title">Bus Ticket Booked Successfully!</h2>
            </div>
            <div className="bb-img4-details-list">
              <div><strong>PNR:</strong> {confirmedPnr}</div>
              <div><strong>Operator:</strong> {selectedBus.operator}</div>
              <div><strong>Bus Type:</strong> {selectedBus.busType}</div>
              <div>
                <strong>Seats:</strong>{' '}
                {selectedSeats.map(s => `${s} (${passengers[s]?.gender === 'Female' ? '♀ Female' : '♂ Male'})`).join(', ')}
              </div>
              <div><strong>Boarding:</strong> {selectedBoardingPoint || selectedBus.boardingPoints[0]?.name} ({selectedBus.depTime})</div>
              <div><strong>Dropping:</strong> {selectedDroppingPoint || selectedBus.droppingPoints[0]?.name} ({selectedBus.arrTime})</div>
              <div><strong>Primary Passenger:</strong> {passengers[selectedSeats[0]]?.name || 'Passenger'} (Age: {passengers[selectedSeats[0]]?.age || '28'}) • {registeredPhone}</div>
              <div><strong>Total Fare Paid:</strong> ₹{calculateTotalFare()}</div>
            </div>
            <button
              type="button"
              className="bb-img4-done-btn"
              onClick={onDoneBooking || (() => setSelectedBus(null))}
            >
              Done
            </button>
          </div>
        ) : modalTopTab === 'live_tracking' ? (
          <BusLiveTrackingTab
            selectedBus={selectedBus}
            isGpsEnabled={isGpsEnabled}
            setIsGpsEnabled={setIsGpsEnabled}
            activeFullRoute={activeFullRoute}
            selectedBoardingPoint={selectedBoardingPoint}
            selectedDroppingPoint={selectedDroppingPoint}
            gpsCoordinates={{ lat: 13.0827, lng: 80.2707 }}
            activeRouteData={activeRouteData}
            activeBoardingPoints={activeBoardingPoints}
            activeDroppingPoints={activeDroppingPoints}
            setSelectedBoardingPoint={setSelectedBoardingPoint}
            setSelectedDroppingPoint={setSelectedDroppingPoint}
            setModalTopTab={setModalTopTab}
          />
        ) : modalTopTab === 'boarding_dropping' ? (
          <BusBoardingDroppingTab
            boardingSubTab={boardingSubTab as any}
            setBoardingSubTab={setBoardingSubTab as any}
            activeRouteData={activeRouteData}
            selectedBoardingPoint={selectedBoardingPoint}
            selectedDroppingPoint={selectedDroppingPoint}
            activeBoardingPoints={activeBoardingPoints}
            activeDroppingPoints={activeDroppingPoints}
            setSelectedBoardingPoint={setSelectedBoardingPoint}
            setSelectedDroppingPoint={setSelectedDroppingPoint}
            setModalTopTab={setModalTopTab}
          />
        ) : modalTopTab === 'passenger_info' ? (
          <BusPassengerInfoTab
            passengers={passengers}
            updatePassengerField={updatePassengerField}
            selectedSeats={selectedSeats}
            registeredPhone={registeredPhone}
            setRegisteredPhone={setRegisteredPhone}
            isEditingPhone={isEditingPhone}
            setIsEditingPhone={setIsEditingPhone}
            tempPhone={tempPhone}
            setTempPhone={setTempPhone}
            stateOfResidence={stateOfResidence}
            whatsAppOptIn={whatsAppOptIn}
            setWhatsAppOptIn={setWhatsAppOptIn}
            tripRewardOptIn={tripRewardOptIn}
            setTripRewardOptIn={setTripRewardOptIn}
            selectedBus={selectedBus}
            selectedBoardingPoint={selectedBoardingPoint}
            selectedDroppingPoint={selectedDroppingPoint}
            calculateTotalFare={calculateTotalFare}
            handleConfirmBusBooking={handleConfirmBusBooking}
            setModalTopTab={setModalTopTab}
          />
        ) : (
          <BusSelectSeatsTab
            selectedBus={selectedBus}
            currentSeatLayout={currentSeatLayout}
            selectedSeats={selectedSeats}
            handleToggleSeat={handleToggleSeat}
            dateOfJourney={dateOfJourney}
            setPreviewPhoto={setPreviewPhoto}
            modalSubTab={modalSubTab}
            setModalSubTab={setModalSubTab}
            activeRouteData={activeRouteData}
            activeFullRoute={activeFullRoute}
            selectedBoardingPoint={selectedBoardingPoint}
            selectedDroppingPoint={selectedDroppingPoint}
            activeBoardingPoints={activeBoardingPoints}
            activeDroppingPoints={activeDroppingPoints}
            setSelectedBoardingPoint={setSelectedBoardingPoint}
            setSelectedDroppingPoint={setSelectedDroppingPoint}
            calculateTotalFare={calculateTotalFare}
            setModalTopTab={setModalTopTab}
          />
        )}
        {/* Photo Lightbox Preview */}
        {previewPhoto && (
          <div className="bb-photo-lightbox-overlay" onClick={() => setPreviewPhoto(null)}>
            <div className="bb-lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img src={previewPhoto} alt="Bus Preview" />
              <button className="bb-lightbox-close" onClick={() => setPreviewPhoto(null)}>
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
