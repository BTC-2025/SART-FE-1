import React from 'react';
import { BusItem } from './busData';

export interface BusPassengerInfoTabProps {
  passengers: Record<string, { name: string; age: string; gender: 'Male' | 'Female' }>;
  updatePassengerField: (seatId: string, field: 'name' | 'age' | 'gender', value: any) => void;
  selectedSeats: string[];
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
  selectedBus: BusItem;
  selectedBoardingPoint: string;
  selectedDroppingPoint: string;
  calculateTotalFare: () => number;
  handleConfirmBusBooking: () => void;
  setModalTopTab: (tab: any) => void;
}

export const BusPassengerInfoTab: React.FC<BusPassengerInfoTabProps> = ({
  passengers,
  updatePassengerField,
  selectedSeats,
  registeredPhone,
  setRegisteredPhone,
  isEditingPhone,
  setIsEditingPhone,
  tempPhone,
  setTempPhone,
  stateOfResidence,
  whatsAppOptIn,
  setWhatsAppOptIn,
  tripRewardOptIn,
  setTripRewardOptIn,
  selectedBus,
  selectedBoardingPoint,
  selectedDroppingPoint,
  calculateTotalFare,
  handleConfirmBusBooking,
  setModalTopTab
}) => {
  return (
    <div className="bb-modal-tab-content-panel bb-passenger-info-screen-img4">
      <div className="bb-pax-img4-two-col-layout">
        {/* Left Column: Contact details, Passenger cards, tripReward */}
        <div className="bb-pax-img4-left-col">
          {/* 1. Contact Details Card (Exact Image 4) */}
          <div className="bb-pax-img4-card bb-contact-card-img4">
            <div className="bb-contact-header-row">
              <div>
                <h3 className="bb-contact-title">Contact details</h3>
                <p className="bb-contact-subtitle">Ticket details will be sent to</p>
              </div>
              <button
                type="button"
                className="bb-contact-edit-btn"
                onClick={() => setIsEditingPhone(!isEditingPhone)}
              >
                {isEditingPhone ? 'Save' : 'Edit'}
              </button>
            </div>

            {isEditingPhone ? (
              <div className="bb-contact-edit-row">
                <input
                  type="tel"
                  className="bb-phone-input-edit"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
                <button
                  type="button"
                  className="bb-save-phone-btn"
                  onClick={() => {
                    setRegisteredPhone(tempPhone);
                    setIsEditingPhone(false);
                  }}
                >
                  Update
                </button>
              </div>
            ) : (
              <div className="bb-contact-phone-row">
                <i className="fa-solid fa-phone"></i>
                <span className="bb-contact-phone-text">{registeredPhone}</span>
              </div>
            )}

            <div className="bb-contact-location-row">
              <i className="fa-solid fa-location-dot"></i>
              <span className="bb-contact-state-text">{stateOfResidence}</span>
            </div>

            <div className="bb-contact-whatsapp-pill">
              <i className="fa-brands fa-whatsapp"></i>
              <span>WhatsApp communication enabled</span>
              <input
                type="checkbox"
                checked={whatsAppOptIn}
                onChange={(e) => setWhatsAppOptIn(e.target.checked)}
                className="bb-wa-checkbox"
                title="Toggle WhatsApp updates"
              />
            </div>
          </div>

          {/* 2. Passenger Details Cards (Dynamic per Selected Seat - Exact Image 4) */}
          <div className="bb-pax-img4-card bb-passengers-container-img4">
            <h3 className="bb-passengers-main-title">Passenger details</h3>

            {selectedSeats.map((seatId, idx) => {
              const isUpper = seatId.startsWith('U');
              const paxData = passengers[seatId] || { name: '', age: '', gender: 'Male' };
              return (
                <div key={seatId} className="bb-pax-single-card-block">
                  <div className="bb-pax-header-strip">
                    <div className="bb-pax-user-icon-circle">
                      <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="bb-pax-meta-titles">
                      <span className="bb-pax-num-title">Passenger {idx + 1}</span>
                      <span className="bb-pax-seat-code-sub">
                        Seat {seatId}, {isUpper ? 'Upper Deck' : 'Lower Deck'}
                      </span>
                    </div>
                    <i className="fa-solid fa-chevron-up bb-pax-acc-icon"></i>
                  </div>

                  <div className="bb-pax-input-group">
                    <label className="bb-pax-label">Name *</label>
                    <input
                      type="text"
                      className="bb-pax-input-box"
                      placeholder=""
                      value={paxData.name}
                      onChange={(e) => updatePassengerField(seatId, 'name', e.target.value)}
                    />
                  </div>

                  <div className="bb-pax-input-group">
                    <label className="bb-pax-label">Age *</label>
                    <input
                      type="number"
                      className="bb-pax-input-box"
                      placeholder=""
                      value={paxData.age}
                      onChange={(e) => updatePassengerField(seatId, 'age', e.target.value)}
                    />
                  </div>

                  <div className="bb-pax-gender-row">
                    <span className="bb-pax-label">Gender *</span>
                    <div className="bb-pax-gender-pills-wrap">
                      <button
                        type="button"
                        className={`bb-pax-radio-pill ${paxData.gender === 'Male' ? 'selected' : ''}`}
                        onClick={() => updatePassengerField(seatId, 'gender', 'Male')}
                      >
                        <span className="bb-radio-circle"></span> Male
                      </button>
                      <button
                        type="button"
                        className={`bb-pax-radio-pill ${paxData.gender === 'Female' ? 'selected' : ''}`}
                        onClick={() => updatePassengerField(seatId, 'gender', 'Female')}
                      >
                        <span className="bb-radio-circle"></span> Female
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. tripReward Card (Exact Image 4 Bottom) */}
          <div className="bb-pax-img4-card bb-tripreward-bottom-card">
            <div className="bb-tripreward-header-badge">
              <i className="fa-solid fa-star"></i> tripReward
            </div>

            <h3 className="bb-tripreward-bold-title">Don&apos;t miss your free ticket!</h3>
            <p className="bb-tripreward-subtext">
              Take 4 trips with {selectedBus.operator} to get free ticket
            </p>

            <div className="bb-tripreward-inner-box">
              <div className="bb-step-dots-row">
                <span className="bb-step-dot active">1</span>
                <span className="bb-step-dot">2</span>
                <span className="bb-step-dot">3</span>
                <span className="bb-step-dot">4</span>
              </div>
              <div className="bb-trip-step-label">
                You are booking 1 of 4 trips with {selectedBus.operator}
              </div>
              <div className="bb-optin-label">Opt in to get a free ticket</div>

              <button
                type="button"
                className={`bb-tripreward-cta-btn ${tripRewardOptIn ? 'opted-in' : ''}`}
                onClick={() => setTripRewardOptIn(!tripRewardOptIn)}
              >
                {tripRewardOptIn ? '✔ Yes, I am in' : 'Yes, I am in'}
              </button>

              <a href="#how-it-works" className="bb-how-it-works-link" onClick={(e) => e.preventDefault()}>
                How it works
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Trip Summary & Price Card (Exact Image 4) */}
        <div className="bb-pax-img4-right-col">
          <div className="bb-pax-img4-summary-card">
            <h3 className="bb-summary-operator-title">{selectedBus.operator}</h3>
            <p className="bb-summary-bus-type-meta">
              {selectedSeats.length} seats • {selectedBus.busType}
            </p>

            {/* Schedule Timeline */}
            <div className="bb-summary-timeline-block">
              <div className="bb-timeline-stop-row">
                <span className="bb-tl-time">{selectedBus.depTime}</span>
                <span className="bb-tl-dot start"></span>
                <div className="bb-tl-details">
                  <strong className="bb-tl-stop-name">{selectedBoardingPoint}</strong>
                  <span className="bb-tl-landmark">Infront of Sathyabama University Arch</span>
                </div>
              </div>

              <div className="bb-timeline-duration-spacer">
                <span className="bb-tl-vertical-line"></span>
                <span className="bb-tl-duration-badge">{selectedBus.duration}</span>
              </div>

              <div className="bb-timeline-stop-row">
                <span className="bb-tl-time">{selectedBus.arrTime}</span>
                <span className="bb-tl-dot end"></span>
                <div className="bb-tl-details">
                  <strong className="bb-tl-stop-name">{selectedDroppingPoint}</strong>
                  <span className="bb-tl-landmark">Opp to Raja Motors towards Bangalore</span>
                </div>
              </div>
            </div>

            <div className="bb-summary-divider"></div>

            {/* Seat details with Green Badges */}
            <div className="bb-summary-seat-details-block">
              <div className="bb-seat-details-header">Seat details</div>
              <div className="bb-seat-count-sub">{selectedSeats.length} seats</div>

              <div className="bb-green-seat-pills-row">
                {selectedSeats.map(s => {
                  const isUpper = s.startsWith('U');
                  return (
                    <span key={s} className="bb-green-seat-pill">
                      {s} • {isUpper ? 'Upper deck' : 'Lower deck'}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="bb-summary-divider"></div>

            {/* Total fare & Confirm CTA */}
            <div className="bb-summary-fare-row">
              <span className="bb-fare-label-text">Total Fare</span>
              <span className="bb-fare-amount-total">₹{calculateTotalFare()}</span>
            </div>

            <button
              type="button"
              className="bb-confirm-book-btn full-width"
              onClick={handleConfirmBusBooking}
            >
              Confirm & Pay ₹{calculateTotalFare()}
            </button>
          </div>

          <div className="bb-back-nav-box" style={{ marginTop: '16px' }}>
            <button
              type="button"
              className="bb-nav-back-btn"
              onClick={() => setModalTopTab('boarding_dropping')}
            >
              ← Back to Boarding / Dropping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
