'use client';

import React, { useState } from 'react';
import './SellVehicleView.css';
import UsedCarValuationView from './UsedCarValuationView';

interface SellVehicleViewProps {
  onBackToBuy: () => void;
  showToast: (msg: string) => void;
  userLocationCity?: string;
}

export default function SellVehicleView({
  onBackToBuy,
  showToast,
  userLocationCity = 'Chennai'
}: SellVehicleViewProps) {
  // Toggle between Sell Vehicle form and Used Car Price Calculator (User Image)
  const [showPriceCalculator, setShowPriceCalculator] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = decodeURIComponent(window.location.pathname.toLowerCase());
      return p.includes('valuation') || p.includes('checkprice');
    }
    return false;
  });

  // Vehicle type toggle (defaults to Car as in user's image)
  const [selectedType, setSelectedType] = useState<'Car' | 'Bike' | 'Truck' | 'Auto'>('Car');
  const [regNumber, setRegNumber] = useState<string>('TN-10-EF-7821');
  const [isValuationOpen, setIsValuationOpen] = useState<boolean>(false);
  const [ownerPhone, setOwnerPhone] = useState<string>('');
  const [inspectionDate, setInspectionDate] = useState<string>('Tomorrow, 10:00 AM');
  const [inspectionAddress, setInspectionAddress] = useState<string>('');
  const [isBookingConfirmed, setIsBookingConfirmed] = useState<boolean>(false);

  // Auto format registration number to uppercase
  const handleRegChange = (val: string) => {
    setRegNumber(val.toUpperCase());
    setIsValuationOpen(false);
    setIsBookingConfirmed(false);
  };

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim() || regNumber.trim().length < 6) {
      showToast('Please enter a valid vehicle registration number (e.g. TN-10-EF-7821)');
      return;
    }
    setIsValuationOpen(true);
    showToast(`Registration verified for ${regNumber}! Valuation generated.`);
  };

  const handleConfirmInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerPhone || ownerPhone.length < 10) {
      showToast('Please enter your 10-digit mobile number for inspection callback');
      return;
    }
    setIsBookingConfirmed(true);
    showToast(`Doorstep inspection booked for ${regNumber}! Technician will arrive at ${inspectionDate}`);
  };

  const singularLabel = selectedType === 'Bike' ? 'Bike' : selectedType === 'Truck' ? 'Truck' : selectedType === 'Auto' ? 'Auto' : 'Car';

  // 1. If user clicked "Check Price", render the Used Car Valuation Price Calculator (Matching User's Image)
  if (showPriceCalculator) {
    return (
      <UsedCarValuationView
        onBackToSell={() => setShowPriceCalculator(false)}
        showToast={showToast}
        userLocationCity={userLocationCity}
      />
    );
  }

  return (
    <div className="sart-sell-vehicle-page-wrapper animate-fade-in">
      {/* 1. TOP NAV STRIP WITH BACK BUTTON */}
      <div className="sell-top-nav-bar">
        <button
          type="button"
          className="btn-back-to-catalog"
          onClick={onBackToBuy}
          title="Back to Certified Used Vehicles"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Certified Cars &amp; Vehicles</span>
        </button>

        {/* Vehicle Category Pills */}
        <div className="sell-vehicle-category-pills">
          <button
            type="button"
            className={`sell-cat-pill ${selectedType === 'Car' ? 'active' : ''}`}
            onClick={() => { setSelectedType('Car'); setRegNumber('TN-10-EF-7821'); }}
          >
            <i className="fa-solid fa-car-side"></i>
            <span>Car</span>
          </button>
          <button
            type="button"
            className={`sell-cat-pill ${selectedType === 'Bike' ? 'active' : ''}`}
            onClick={() => { setSelectedType('Bike'); setRegNumber('TN-09-AB-4521'); }}
          >
            <i className="fa-solid fa-motorcycle"></i>
            <span>Bike</span>
          </button>
          <button
            type="button"
            className={`sell-cat-pill ${selectedType === 'Truck' ? 'active' : ''}`}
            onClick={() => { setSelectedType('Truck'); setRegNumber('TN-04-TU-5087'); }}
          >
            <i className="fa-solid fa-truck"></i>
            <span>Commercial Truck</span>
          </button>
          <button
            type="button"
            className={`sell-cat-pill ${selectedType === 'Auto' ? 'active' : ''}`}
            onClick={() => { setSelectedType('Auto'); setRegNumber('TN-02-CD-1120'); }}
          >
            <i className="fa-solid fa-trailer"></i>
            <span>3-Wheeler Auto</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN HERO SECTION (EXACT REPLICA OF USER'S IMAGE) */}
      <section className="sell-hero-section">
        <div className="sell-hero-inner-container">
          {/* HERO LEFT COLUMN: TEXT & 3 BENEFIT BADGES */}
          <div className="sell-hero-left-col">
            <h1 className="sell-hero-main-title">
              Sell Your {singularLabel} for the Best Price
            </h1>
            <p className="sell-hero-subtitle">
              Choose CarDekho &amp; Get Up to <strong>₹25,000 More!</strong>
            </p>

            {/* THREE CIRCULAR VALUE PROPOSITIONS */}
            <div className="sell-value-props-row">
              {/* Badge 1: Verified Car Buyers */}
              <div className="value-prop-item">
                <div className="value-prop-circle-icon">
                  <i className="fa-regular fa-user"></i>
                </div>
                <div className="value-prop-text">
                  <span className="prop-line-1">Verified</span>
                  <span className="prop-line-2">{singularLabel} Buyers</span>
                </div>
              </div>

              {/* Badge 2: Zero Commission */}
              <div className="value-prop-item">
                <div className="value-prop-circle-icon">
                  <span className="rupee-char">₹</span>
                </div>
                <div className="value-prop-text">
                  <span className="prop-line-1">Zero</span>
                  <span className="prop-line-2">Commission</span>
                </div>
              </div>

              {/* Badge 3: No Unwanted Calls */}
              <div className="value-prop-item">
                <div className="value-prop-circle-icon">
                  <i className="fa-solid fa-phone-slash"></i>
                </div>
                <div className="value-prop-text">
                  <span className="prop-line-1">No Unwanted</span>
                  <span className="prop-line-2">Calls</span>
                </div>
              </div>
            </div>
          </div>

          {/* HERO RIGHT COLUMN: SMILING MAN PHOTO & 3-STEP FLOATING PILL */}
          <div className="sell-hero-right-col">
            <div className="man-photo-backdrop-wrapper">
              <div className="man-circle-glow-halo"></div>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
                alt="Smiling Professional Advisor"
                className="man-thumbs-up-img"
              />
            </div>

            {/* FLOATING 3-STEP FLOW CARD */}
            <div className="floating-steps-card">
              <div className="flow-step-item">
                <i className="fa-solid fa-car-side step-icon"></i>
                <span>Share your {singularLabel} Details</span>
              </div>
              <span className="flow-step-divider">&gt;&gt;&gt;</span>
              <div className="flow-step-item">
                <i className="fa-solid fa-scale-balanced step-icon"></i>
                <span>Get details of interested buyers</span>
              </div>
              <span className="flow-step-divider">&gt;&gt;&gt;</span>
              <div className="flow-step-item">
                <i className="fa-regular fa-circle-user step-icon"></i>
                <span>Connect with Buyers to Sell {singularLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CENTERED REGISTRATION NUMBER CARD (MATCHING USER'S IMAGE) */}
      <section className="sell-reg-card-section">
        <div className="sell-reg-card-box">
          <h2 className="reg-card-heading">
            Enter Your {singularLabel} Registration Number
          </h2>

          <form onSubmit={handleSellSubmit} className="reg-input-action-form">
            <div className="reg-input-field-group">
              <label className="reg-input-floating-label">
                Enter Your {singularLabel} No. (DL03-CW-3121)
              </label>
              <input
                type="text"
                className="reg-plate-input"
                value={regNumber}
                onChange={(e) => handleRegChange(e.target.value)}
                placeholder="e.g. TN-10-EF-7821"
                maxLength={14}
                required
              />
            </div>

            <button type="submit" className="btn-sell-my-car-submit">
              Sell My {singularLabel}
            </button>
          </form>

          <div className="reg-card-sub-hint">
            <span>Just here to check price? </span>
            <button
              type="button"
              className="check-price-link-btn"
              onClick={() => {
                setShowPriceCalculator(true);
                showToast('Switched to Used Car Price Calculator');
              }}
            >
              Check Price
            </button>
          </div>
        </div>
      </section>

      {/* 4. INSTANT VALUATION & FREE DOORSTEP INSPECTION FORM (AFTER ENTERING REG NO) */}
      {isValuationOpen && (
        <section className="valuation-results-section animate-scale">
          <div className="valuation-card-container">
            {!isBookingConfirmed ? (
              <>
                <div className="val-card-header">
                  <div className="val-title-left">
                    <span className="verified-reg-pill">
                      <i className="fa-solid fa-circle-check"></i> {regNumber}
                    </span>
                    <h3>Vehicle Valuation &amp; Instant Offer</h3>
                    <p className="val-sub">
                      Registered at RTO {regNumber.split('-').slice(0, 2).join('-')} ({userLocationCity}) • Verified VAHAN Database
                    </p>
                  </div>
                  <div className="val-price-box">
                    <span className="price-tag-label">Estimated Fair Market Value</span>
                    <span className="price-amount-highlight">
                      {selectedType === 'Bike' ? '₹72,000 - ₹85,000' : selectedType === 'Truck' ? '₹4,80,000 - ₹5,40,000' : selectedType === 'Auto' ? '₹1,45,000 - ₹1,70,000' : '₹5,40,000 - ₹5,85,000'}
                    </span>
                    <span className="festive-bonus-badge">
                      <i className="fa-solid fa-gift"></i> Includes ₹25,000 Special SART Exchange Bonus
                    </span>
                  </div>
                </div>

                <div className="val-card-body">
                  <form onSubmit={handleConfirmInspection} className="inspection-booking-form">
                    <h4>Book Free Doorstep Inspection &amp; Receive Same-Day Payment</h4>
                    <p className="inspection-subtext">
                      Our certified evaluator visits your location in {userLocationCity}, conducts a 140-point inspection, and transfers funds directly to your bank account upon sale.
                    </p>

                    <div className="inspection-inputs-grid">
                      <div className="insp-field">
                        <label>Your Mobile Number (OTP Verified)</label>
                        <input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          maxLength={10}
                          required
                        />
                      </div>

                      <div className="insp-field">
                        <label>Preferred Inspection Time</label>
                        <select
                          value={inspectionDate}
                          onChange={(e) => setInspectionDate(e.target.value)}
                        >
                          <option value="Today, 03:00 PM - 05:00 PM">Today, 03:00 PM - 05:00 PM</option>
                          <option value="Tomorrow, 10:00 AM - 12:00 PM">Tomorrow, 10:00 AM - 12:00 PM</option>
                          <option value="Tomorrow, 02:00 PM - 04:00 PM">Tomorrow, 02:00 PM - 04:00 PM</option>
                          <option value="This Weekend, Morning">This Weekend, Morning</option>
                        </select>
                      </div>

                      <div className="insp-field full-width">
                        <label>Inspection Address in {userLocationCity}</label>
                        <input
                          type="text"
                          placeholder="Enter house/office address or landmark..."
                          value={inspectionAddress}
                          onChange={(e) => setInspectionAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="insp-submit-row">
                      <button type="submit" className="btn-confirm-inspection">
                        <i className="fa-solid fa-calendar-check"></i>
                        <span>Confirm Free Doorstep Inspection</span>
                      </button>
                      <span className="guarantee-note">
                        <i className="fa-solid fa-shield-halved"></i> 100% Free Doorstep Evaluation • Zero Obligation
                      </span>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="booking-confirmed-box animate-fade-in">
                <div className="success-icon-circle">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h3>Inspection Successfully Scheduled!</h3>
                <p className="confirm-desc">
                  Our certified vehicle evaluator will visit you for registration <strong>{regNumber}</strong> at <strong>{inspectionDate}</strong> in <strong>{userLocationCity}</strong>.
                </p>
                <div className="confirm-summary-card">
                  <div><strong>Vehicle:</strong> {selectedType} ({regNumber})</div>
                  <div><strong>Mobile Contact:</strong> {ownerPhone}</div>
                  <div><strong>Estimated Payout:</strong> {selectedType === 'Bike' ? '₹72,000 - ₹85,000' : selectedType === 'Truck' ? '₹4,80,000 - ₹5,40,000' : '₹5,40,000 - ₹5,85,000'}</div>
                  <div><strong>Payment Mode:</strong> Instant Bank Transfer (IMPS/RTGS) upon handover</div>
                </div>
                <button
                  type="button"
                  className="btn-back-after-confirm"
                  onClick={onBackToBuy}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>Back to Certified Cars &amp; Vehicles</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. TRUST BADGES FOOTER */}
      <div className="sell-trust-footer-strip">
        <div className="trust-item">
          <i className="fa-solid fa-certificate"></i>
          <span>100% Free RC Transfer Assistance</span>
        </div>
        <div className="trust-item">
          <i className="fa-solid fa-bolt"></i>
          <span>Instant Payment Before Vehicle Handover</span>
        </div>
        <div className="trust-item">
          <i className="fa-solid fa-headset"></i>
          <span>Dedicated SART Relationship Manager</span>
        </div>
      </div>
    </div>
  );
}
