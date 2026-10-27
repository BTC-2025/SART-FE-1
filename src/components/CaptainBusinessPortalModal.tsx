'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './CaptainBusinessPortalModal.css';

interface CaptainBusinessPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'bike' | 'auto' | 'car';
}

const CITIES = ['Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi NCR', 'Coimbatore', 'Pune', 'Kolkata'];

export default function CaptainBusinessPortalModal({
  isOpen,
  onClose,
  category: initialCategory
}: CaptainBusinessPortalModalProps) {
  // Navigation steps:
  // 1: 'phone' -> 2: 'otp' -> 3: 'city' -> 4: 'vehicle' -> 5: 'dl' -> 6: 'live_camera' -> 7: 'personal_details' -> 8: 'vehicle_details' -> 9: 'identity_kyc' -> 10: 'under_verification' -> 11: 'verified_active'
  const [step, setStep] = useState<
    | 'phone'
    | 'otp'
    | 'city'
    | 'vehicle'
    | 'dl'
    | 'live_camera'
    | 'personal_details'
    | 'vehicle_details'
    | 'identity_kyc'
    | 'under_verification'
    | 'verified_active'
  >('phone');

  // Step 1 & 2: Mobile & OTP
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serverOtp, setServerOtp] = useState('1234');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCenterBanner, setShowCenterBanner] = useState(false);

  // Step 3: City
  const [selectedCity, setSelectedCity] = useState('Chennai');

  // Step 4: Vehicle Type
  const [chosenCategory, setChosenCategory] = useState<'bike' | 'auto' | 'car'>(initialCategory || 'bike');

  // Step 5: Driving License
  const [dlNumber, setDlNumber] = useState('');
  const [dlFront, setDlFront] = useState<string | null>(null);
  const [dlBack, setDlBack] = useState<string | null>(null);

  // Step 6: Live Camera Selfie
  const [liveSelfie, setLiveSelfie] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Step 7: Personal Details
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  // Step 8: Vehicle Details & RC
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);
  const [rcFrontImage, setRcFrontImage] = useState<string | null>(null);

  // Step 9: Aadhar / PAN Card KYC
  const [docType, setDocType] = useState<'aadhar' | 'pan'>('aadhar');
  const [docNumber, setDocNumber] = useState('');
  const [docFront, setDocFront] = useState<string | null>(null);
  const [docBack, setDocBack] = useState<string | null>(null);

  // Verification countdown timer (2 to 3 minutes)
  const [verificationSeconds, setVerificationSeconds] = useState(120);

  // Step 11: Captain Portal active tab & rides
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rides' | 'earnings' | 'vehicles'>('dashboard');

  // Camera start/stop helper functions
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access failed:', err);
      alert('Camera access denied or unavailable. You can also upload a live photo.');
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setLiveSelfie(dataUrl);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    if (initialCategory) setChosenCategory(initialCategory);
  }, [initialCategory]);

  // Clean up camera stream if modal unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Verification timer countdown
  useEffect(() => {
    let timer: any;
    if (step === 'under_verification') {
      timer = setInterval(() => {
        setVerificationSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setStep('verified_active');
            setShowCenterBanner(true);
            setTimeout(() => setShowCenterBanner(false), 8000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  if (!isOpen) return null;

  // Step 1: Send OTP with terminal API dispatch
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/captain-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone })
      });
      const data = await res.json();
      if (data && data.otp) {
        setServerOtp(data.otp);
        console.log(`[CLIENT DISPATCH] OTP: ${data.otp}`);
      }
    } catch (err) {
      const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setServerOtp(mockOtp);
      console.log(`[OFFLINE FALLBACK] OTP: ${mockOtp}`);
    }

    setIsSubmitting(false);
    setStep('otp');
  };

  // Step 2: Handle OTP typing
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);

    if (val && index < 3) {
      const nextInput = document.getElementById(`captain-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered.length !== 4) {
      alert('Please enter the 4-digit code.');
      return;
    }
    if (entered !== serverOtp && entered !== '1234') {
      alert(`Invalid OTP! Please enter the code sent to your terminal (OTP: ${serverOtp})`);
      return;
    }
    setStep('city');
  };

  // Helper for file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    stopCamera();
    setStep('phone');
    setPhoneNumber('');
    setOtp(['', '', '', '']);
    onClose();
  };

  const categoryTitle = chosenCategory === 'bike' ? 'Bike & Scooty' : chosenCategory === 'auto' ? 'Auto Rickshaw' : 'Cab & Taxi';
  const categoryIcon = chosenCategory === 'bike' ? 'fa-motorcycle' : chosenCategory === 'auto' ? 'fa-truck-fast' : 'fa-car-side';

  return (
    <div className="captain-portal-overlay" onClick={handleReset}>
      {/* 🌟 Center of Website Notification Banner when verified */}
      {showCenterBanner && (
        <div className="captain-center-verified-toast">
          <div className="toast-icon"><i className="fa-solid fa-circle-check"></i></div>
          <div className="toast-content">
            <h4>Captain Profile Successfully Verified!</h4>
            <p>Your documents, vehicle, and KYC are verified. You are now authorized to accept customer ride requests in {selectedCity}.</p>
          </div>
          <button type="button" className="toast-dismiss-btn" onClick={() => setShowCenterBanner(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      <div className="captain-portal-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="captain-portal-header">
          <div className="captain-portal-header-left">
            <div className="captain-badge-icon">
              <i className={`fa-solid ${categoryIcon}`}></i>
            </div>
            <div>
              <div className="captain-portal-tag">SART CAPTAIN BUSINESS NETWORK</div>
              <h3 className="captain-portal-title">
                {step === 'verified_active'
                  ? `${categoryTitle} Captain Dashboard`
                  : step === 'under_verification'
                  ? 'Verification In Progress'
                  : 'Captain Registration & KYC Onboarding'}
              </h3>
            </div>
          </div>
          <button type="button" className="captain-portal-close" onClick={handleReset} title="Close">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Progress Bar for Onboarding steps */}
        {step !== 'phone' && step !== 'otp' && step !== 'verified_active' && (
          <div className="captain-onboarding-progress-bar">
            <div
              className="progress-fill"
              style={{
                width:
                  step === 'city'
                    ? '15%'
                    : step === 'vehicle'
                    ? '30%'
                    : step === 'dl'
                    ? '45%'
                    : step === 'live_camera'
                    ? '60%'
                    : step === 'personal_details'
                    ? '75%'
                    : step === 'vehicle_details'
                    ? '88%'
                    : step === 'identity_kyc'
                    ? '95%'
                    : '100%'
              }}
            ></div>
          </div>
        )}

        {/* ================= STEP 1: MOBILE NUMBER ================= */}
        {step === 'phone' && (
          <div className="captain-step-body">
            <div className="captain-hero-preview">
              <img
                src={chosenCategory === 'bike' ? '/images/red_bike_3d.png' : chosenCategory === 'auto' ? '/images/auto_rickshaw_3d.png' : '/images/white_car_3d.png'}
                alt="Vehicle"
                className="captain-preview-img"
              />
              <h4>Enter Captain Mobile Number</h4>
              <p>We will generate a 4-digit verification code directly into your server terminal to register your captain business account.</p>
            </div>

            <form onSubmit={handleSendOtp} className="captain-auth-form">
              <label className="captain-input-label">Mobile Number</label>
              <div className="captain-phone-input-row">
                <span className="captain-country-code">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  className="captain-text-input"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="captain-primary-btn"
                disabled={isSubmitting || phoneNumber.length !== 10}
              >
                {isSubmitting ? (
                  <span><i className="fa-solid fa-spinner fa-spin"></i> Dispatching OTP...</span>
                ) : (
                  <span>Get OTP on Terminal <i className="fa-solid fa-arrow-right"></i></span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 2: OTP VERIFICATION ================= */}
        {step === 'otp' && (
          <div className="captain-step-body">
            <div className="captain-hero-preview">
              <div className="captain-otp-icon-bubble">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h4>Verify One-Time Password</h4>
              <p>Enter the 4-digit authentication code sent to <strong>+91 {phoneNumber}</strong></p>
              <div className="terminal-otp-notice">
                <i className="fa-solid fa-terminal"></i> Check terminal logs: OTP is <strong>{serverOtp}</strong>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="captain-auth-form">
              <div className="captain-otp-inputs-row">
                {otp.map((digit, idx) => (
                  <input
                    key={`otp-box-${idx}`}
                    id={`captain-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="captain-otp-digit"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="captain-otp-helper">
                <span>Code printed on Next.js server terminal</span>
                <button
                  type="button"
                  className="captain-resend-btn"
                  onClick={handleSendOtp}
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                className="captain-primary-btn"
                disabled={otp.join('').length !== 4}
              >
                <span>Verify & Continue Registration <i className="fa-solid fa-arrow-right"></i></span>
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 3: SELECT OPERATIONAL CITY ================= */}
        {step === 'city' && (
          <div className="captain-step-body">
            <div className="captain-hero-preview">
              <div className="captain-icon-badge-round"><i className="fa-solid fa-city"></i></div>
              <h4>Select Your Operating City / Region</h4>
              <p>Choose the city where you will offer rides and receive passenger pickups.</p>
            </div>

            <div className="captain-city-grid">
              {CITIES.map(city => (
                <div
                  key={city}
                  className={`captain-city-card ${selectedCity === city ? 'active' : ''}`}
                  onClick={() => setSelectedCity(city)}
                >
                  <i className="fa-solid fa-location-dot"></i>
                  <span>{city}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="captain-primary-btn"
              onClick={() => setStep('vehicle')}
            >
              <span>Continue with {selectedCity} <i className="fa-solid fa-arrow-right"></i></span>
            </button>
          </div>
        )}

        {/* ================= STEP 4: SELECT VEHICLE CATEGORY ================= */}
        {step === 'vehicle' && (
          <div className="captain-step-body">
            <div className="captain-hero-preview">
              <div className="captain-icon-badge-round"><i className="fa-solid fa-car-tunnel"></i></div>
              <h4>Choose Your Vehicle Type</h4>
              <p>Select whether you are riding a two-wheeler, auto rickshaw, or cab/taxi.</p>
            </div>

            <div className="captain-vehicle-choice-grid">
              <div
                className={`captain-choice-card ${chosenCategory === 'bike' ? 'active' : ''}`}
                onClick={() => setChosenCategory('bike')}
              >
                <img src="/images/red_bike_3d.png" alt="Bike" />
                <h5>Bike & Scooty</h5>
                <span>1 Passenger • High Demand</span>
              </div>
              <div
                className={`captain-choice-card ${chosenCategory === 'auto' ? 'active' : ''}`}
                onClick={() => setChosenCategory('auto')}
              >
                <img src="/images/auto_rickshaw_3d.png" alt="Auto" />
                <h5>Auto Rickshaw</h5>
                <span>3 Passengers • Open Transit</span>
              </div>
              <div
                className={`captain-choice-card ${chosenCategory === 'car' ? 'active' : ''}`}
                onClick={() => setChosenCategory('car')}
              >
                <img src="/images/white_car_3d.png" alt="Cab" />
                <h5>Cab & Taxi</h5>
                <span>4-6 Passengers • Premium Fare</span>
              </div>
            </div>

            <button
              type="button"
              className="captain-primary-btn"
              onClick={() => setStep('dl')}
            >
              <span>Proceed to Document Uploads <i className="fa-solid fa-arrow-right"></i></span>
            </button>
          </div>
        )}

        {/* ================= STEP 5: DRIVING LICENSE UPLOAD ================= */}
        {step === 'dl' && (
          <div className="captain-step-body">
            <div className="captain-hero-preview">
              <div className="captain-icon-badge-round"><i className="fa-solid fa-id-card"></i></div>
              <h4>Upload Driving License</h4>
              <p>Please enter your Driving License number and upload clear front and back photos.</p>
            </div>

            <div className="captain-auth-form">
              <label className="captain-input-label">Driving License Number *</label>
              <input
                type="text"
                placeholder="e.g. TN-01-20220004567"
                value={dlNumber}
                onChange={(e) => setDlNumber(e.target.value.toUpperCase())}
                className="captain-field-input"
              />

              <div className="captain-upload-two-grid">
                <div className="captain-upload-card">
                  <span className="upload-title"><i className="fa-solid fa-image"></i> DL Front Side *</span>
                  {dlFront ? (
                    <div className="upload-preview-box">
                      <img src={dlFront} alt="DL Front" />
                      <button type="button" onClick={() => setDlFront(null)}>Change</button>
                    </div>
                  ) : (
                    <label className="upload-dropzone">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      <span>Upload Front Photo</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDlFront)} />
                    </label>
                  )}
                </div>

                <div className="captain-upload-card">
                  <span className="upload-title"><i className="fa-solid fa-image"></i> DL Back Side *</span>
                  {dlBack ? (
                    <div className="upload-preview-box">
                      <img src={dlBack} alt="DL Back" />
                      <button type="button" onClick={() => setDlBack(null)}>Change</button>
                    </div>
                  ) : (
                    <label className="upload-dropzone">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      <span>Upload Back Photo</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDlBack)} />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="captain-primary-btn"
                disabled={!dlNumber.trim() || !dlFront || !dlBack}
                onClick={() => setStep('live_camera')}
              >
                <span>Verify License & Take Live Photo <i className="fa-solid fa-arrow-right"></i></span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 6: LIVE CAMERA CAPTAIN SELFIE ================= */}
        {step === 'live_camera' && (
          <div className="captain-step-body">
            <div className="captain-hero-preview">
              <div className="captain-icon-badge-round"><i className="fa-solid fa-camera"></i></div>
              <h4>Take Captain Live Face Photo</h4>
              <p>Enable your camera to take an instant live photo for passenger safety and ID badge.</p>
            </div>

            <div className="captain-camera-container">
              {liveSelfie ? (
                <div className="camera-captured-view">
                  <img src={liveSelfie} alt="Live selfie" className="captured-selfie-img" />
                  <div className="camera-recheck-row">
                    <span className="selfie-verified-tag"><i className="fa-solid fa-circle-check"></i> Live Photo Captured</span>
                    <button type="button" className="retake-btn" onClick={() => { setLiveSelfie(null); startCamera(); }}>
                      <i className="fa-solid fa-rotate-left"></i> Retake
                    </button>
                  </div>
                </div>
              ) : cameraActive ? (
                <div className="camera-stream-box">
                  <video ref={videoRef} autoPlay playsInline className="live-video-player" />
                  <div className="camera-face-frame"></div>
                  <button type="button" className="snap-photo-btn" onClick={capturePhoto}>
                    <i className="fa-solid fa-camera-retro"></i> Capture Live Photo
                  </button>
                </div>
              ) : (
                <div className="camera-permission-prompt">
                  <i className="fa-solid fa-video"></i>
                  <h5>Camera Access Required</h5>
                  <p>Click below to launch web camera and capture face portrait</p>
                  <button type="button" className="enable-camera-btn" onClick={startCamera}>
                    <i className="fa-solid fa-camera"></i> Enable Camera
                  </button>
                  <div className="or-upload-separator"><span>OR</span></div>
                  <label className="upload-fallback-btn">
                    <i className="fa-solid fa-image"></i> Upload Face Photo
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setLiveSelfie)} />
                  </label>
                </div>
              )}
            </div>

            <button
              type="button"
              className="captain-primary-btn"
              disabled={!liveSelfie}
              onClick={() => { stopCamera(); setStep('personal_details'); }}
            >
              <span>Next: Personal Details <i className="fa-solid fa-arrow-right"></i></span>
            </button>
          </div>
        )}

        {/* ================= STEP 7: PERSONAL DETAILS (PHOTO ON TOP + FORM BELOW) ================= */}
        {step === 'personal_details' && (
          <div className="captain-step-body">
            {/* Live selfie displayed prominently on top */}
            <div className="captain-profile-hero-preview">
              <div className="profile-photo-circle">
                <img src={liveSelfie || '/images/default_avatar.png'} alt="Captain Face" />
                <span className="live-pill"><i className="fa-solid fa-check"></i> Live Photo</span>
              </div>
              <h4>Captain Profile Details</h4>
              <p>Please enter your legal name as on documents, birth date, and residential address.</p>
            </div>

            <div className="captain-auth-form">
              <div>
                <label className="captain-input-label">Full Legal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="captain-field-input"
                />
              </div>

              <div>
                <label className="captain-input-label">Date of Birth (DOB) *</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="captain-field-input"
                />
              </div>

              <div>
                <label className="captain-input-label">Complete Permanent Address *</label>
                <textarea
                  rows={2}
                  placeholder="Door No, Street Name, Area, City, Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="captain-field-input"
                />
              </div>

              <button
                type="button"
                className="captain-primary-btn"
                disabled={!fullName.trim() || !dob || !address.trim()}
                onClick={() => setStep('vehicle_details')}
              >
                <span>Save & Enter Vehicle Details <i className="fa-solid fa-arrow-right"></i></span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 8: VEHICLE NUMBER & RC REGISTRATION ================= */}
        {step === 'vehicle_details' && (
          <div className="captain-step-body">
            <div className="captain-hero-preview">
              <div className="captain-icon-badge-round"><i className="fa-solid fa-car-side"></i></div>
              <h4>Vehicle Information & RC Book</h4>
              <p>Enter vehicle registration plate number and upload front side of the RC card.</p>
            </div>

            <div className="captain-auth-form">
              <div className="form-two-col">
                <div>
                  <label className="captain-input-label">Vehicle Plate Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. TN 01 AB 1234"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    className="captain-field-input"
                  />
                </div>
                <div>
                  <label className="captain-input-label">Make & Model *</label>
                  <input
                    type="text"
                    placeholder="e.g. Honda Activa 6G / WagonR"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="captain-field-input"
                  />
                </div>
              </div>

              <div className="captain-upload-two-grid">
                <div className="captain-upload-card">
                  <span className="upload-title"><i className="fa-solid fa-motorcycle"></i> Vehicle Photo *</span>
                  {vehicleImage ? (
                    <div className="upload-preview-box">
                      <img src={vehicleImage} alt="Vehicle" />
                      <button type="button" onClick={() => setVehicleImage(null)}>Change</button>
                    </div>
                  ) : (
                    <label className="upload-dropzone">
                      <i className="fa-solid fa-camera"></i>
                      <span>Upload Vehicle Photo</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setVehicleImage)} />
                    </label>
                  )}
                </div>

                <div className="captain-upload-card">
                  <span className="upload-title"><i className="fa-solid fa-file-contract"></i> RC Front Side *</span>
                  {rcFrontImage ? (
                    <div className="upload-preview-box">
                      <img src={rcFrontImage} alt="RC Front" />
                      <button type="button" onClick={() => setRcFrontImage(null)}>Change</button>
                    </div>
                  ) : (
                    <label className="upload-dropzone">
                      <i className="fa-solid fa-file-invoice"></i>
                      <span>Upload RC Front</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setRcFrontImage)} />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="captain-primary-btn"
                disabled={!vehicleNumber.trim() || !vehicleImage || !rcFrontImage}
                onClick={() => setStep('identity_kyc')}
              >
                <span>Continue to Aadhar / PAN KYC <i className="fa-solid fa-arrow-right"></i></span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 9: AADHAR / PAN CARD KYC ================= */}
        {step === 'identity_kyc' && (
          <div className="captain-step-body">
            <div className="captain-hero-preview">
              <div className="captain-icon-badge-round"><i className="fa-solid fa-fingerprint"></i></div>
              <h4>Identity Verification (Aadhar / PAN Card)</h4>
              <p>Upload your government identity document front & back for instant authentication.</p>
            </div>

            <div className="captain-auth-form">
              <div className="doc-type-toggle">
                <button
                  type="button"
                  className={`doc-type-btn ${docType === 'aadhar' ? 'active' : ''}`}
                  onClick={() => setDocType('aadhar')}
                >
                  <i className="fa-solid fa-address-card"></i> Aadhar Card
                </button>
                <button
                  type="button"
                  className={`doc-type-btn ${docType === 'pan' ? 'active' : ''}`}
                  onClick={() => setDocType('pan')}
                >
                  <i className="fa-solid fa-file-invoice"></i> PAN Card
                </button>
              </div>

              <div>
                <label className="captain-input-label">{docType === 'aadhar' ? '12-Digit Aadhar Number *' : '10-Digit PAN Number *'}</label>
                <input
                  type="text"
                  placeholder={docType === 'aadhar' ? 'XXXX-XXXX-XXXX' : 'ABCDE1234F'}
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value.toUpperCase())}
                  className="captain-field-input"
                />
              </div>

              <div className="captain-upload-two-grid">
                <div className="captain-upload-card">
                  <span className="upload-title"><i className="fa-solid fa-image"></i> {docType.toUpperCase()} Front Side *</span>
                  {docFront ? (
                    <div className="upload-preview-box">
                      <img src={docFront} alt="Doc Front" />
                      <button type="button" onClick={() => setDocFront(null)}>Change</button>
                    </div>
                  ) : (
                    <label className="upload-dropzone">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      <span>Upload Front Side</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDocFront)} />
                    </label>
                  )}
                </div>

                <div className="captain-upload-card">
                  <span className="upload-title"><i className="fa-solid fa-image"></i> {docType.toUpperCase()} Back Side *</span>
                  {docBack ? (
                    <div className="upload-preview-box">
                      <img src={docBack} alt="Doc Back" />
                      <button type="button" onClick={() => setDocBack(null)}>Change</button>
                    </div>
                  ) : (
                    <label className="upload-dropzone">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                      <span>Upload Back Side</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDocBack)} />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="captain-primary-btn"
                disabled={!docNumber.trim() || !docFront || !docBack}
                onClick={() => {
                  setVerificationSeconds(120);
                  setStep('under_verification');
                }}
              >
                <span>Submit All Documents for Verification <i className="fa-solid fa-check-double"></i></span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 10: UNDER VERIFICATION (2 - 3 MINUTES TIMER) ================= */}
        {step === 'under_verification' && (
          <div className="captain-step-body">
            <div className="captain-verification-loader-box">
              <div className="verification-scanner-ring">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h4>Verifying Documents & Images...</h4>
              <p>Our automated compliance system is inspecting your Driving License, Face Selfie, Vehicle RC, and {docType.toUpperCase()} Card.</p>

              <div className="verification-countdown-card">
                <span className="timer-label"><i className="fa-regular fa-clock"></i> Estimated Verification Time</span>
                <div className="timer-digits">
                  {Math.floor(verificationSeconds / 60)}:{(verificationSeconds % 60).toString().padStart(2, '0')}
                </div>
                <span className="timer-sub">Verification takes 2 to 3 minutes to confirm all uploads are clear.</span>
              </div>

              <div className="verification-checks-list">
                <div className="check-item done"><i className="fa-solid fa-circle-check"></i> Mobile OTP Verified</div>
                <div className="check-item in-progress"><i className="fa-solid fa-spinner fa-spin"></i> Driving License Front & Back Inspection</div>
                <div className="check-item in-progress"><i className="fa-solid fa-spinner fa-spin"></i> Live Face Selfie Match</div>
                <div className="check-item in-progress"><i className="fa-solid fa-spinner fa-spin"></i> Vehicle Number & RC Validation</div>
                <div className="check-item in-progress"><i className="fa-solid fa-spinner fa-spin"></i> {docType.toUpperCase()} Government KYC Clearance</div>
              </div>

              {/* Fast track demo button for user testing */}
              <button
                type="button"
                className="fast-forward-btn"
                onClick={() => {
                  setStep('verified_active');
                  setShowCenterBanner(true);
                  setTimeout(() => setShowCenterBanner(false), 8000);
                }}
              >
                <i className="fa-solid fa-bolt"></i> Fast-Track Approval (Instant Verify)
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 11: VERIFIED CAPTAIN BUSINESS PORTAL ================= */}
        {step === 'verified_active' && (
          <div className="captain-dashboard-body">
            {/* Captain Top Profile Bar */}
            <div className="captain-profile-bar">
              <div className="captain-profile-info">
                <div className="captain-avatar-circle">
                  <img src={liveSelfie || '/images/default_avatar.png'} alt="Captain" />
                </div>
                <div>
                  <div className="captain-name">
                    Captain {fullName || 'Rajesh Kumar'}
                    <span className="captain-verified-badge"><i className="fa-solid fa-circle-check"></i> Government KYC Verified</span>
                  </div>
                  <div className="captain-phone-meta">
                    +91 {phoneNumber} • {selectedCity} • {chosenCategory.toUpperCase()} ({vehicleNumber || 'TN 01 AB 1234'})
                  </div>
                </div>
              </div>

              <div className="captain-online-status">
                <span className="captain-status-indicator active"></span>
                <span>Duty Status: <strong>Online & Accepting Rides</strong></span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="captain-metrics-grid">
              <div className="captain-metric-card green">
                <span className="metric-label">Today's Earnings</span>
                <div className="metric-value">₹1,850.00</div>
                <span className="metric-foot"><i className="fa-solid fa-arrow-trend-up"></i> 14 completed trips</span>
              </div>
              <div className="captain-metric-card blue">
                <span className="metric-label">City Coverage</span>
                <div className="metric-value">{selectedCity}</div>
                <span className="metric-foot"><i className="fa-solid fa-signal"></i> High Demand Radar</span>
              </div>
              <div className="captain-metric-card orange">
                <span className="metric-label">Wallet Balance</span>
                <div className="metric-value">₹4,620.00</div>
                <span className="metric-foot"><i className="fa-solid fa-building-columns"></i> Instant Payout Ready</span>
              </div>
              <div className="captain-metric-card purple">
                <span className="metric-label">Registered Vehicle</span>
                <div className="metric-value">{vehicleModel || (chosenCategory === 'bike' ? 'Honda Activa 6G' : chosenCategory === 'auto' ? 'Bajaj RE EV' : 'Tata Tigor EV')}</div>
                <span className="metric-foot">{vehicleNumber || 'TN 01 AB 1234'}</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="captain-portal-tabs">
              <button
                type="button"
                className={`captain-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <i className="fa-solid fa-gauge-high"></i> Live Radar & Dispatch
              </button>
              <button
                type="button"
                className={`captain-tab-btn ${activeTab === 'rides' ? 'active' : ''}`}
                onClick={() => setActiveTab('rides')}
              >
                <i className="fa-solid fa-route"></i> Ride History
              </button>
              <button
                type="button"
                className={`captain-tab-btn ${activeTab === 'earnings' ? 'active' : ''}`}
                onClick={() => setActiveTab('earnings')}
              >
                <i className="fa-solid fa-wallet"></i> Earnings & Payout
              </button>
              <button
                type="button"
                className={`captain-tab-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
                onClick={() => setActiveTab('vehicles')}
              >
                <i className="fa-solid fa-file-shield"></i> Verified Documents
              </button>
            </div>

            {/* Tab content */}
            <div className="captain-tab-content-area">
              {activeTab === 'dashboard' && (
                <div className="captain-live-orders-list">
                  <div className="captain-section-head">
                    <h5>Nearby Passenger Requests in {selectedCity}</h5>
                    <span className="captain-radar-live"><i className="fa-solid fa-satellite-dish"></i> GPS Radar Scanning</span>
                  </div>

                  <div className="captain-request-card">
                    <div className="req-header">
                      <span className="req-fare">₹145.00</span>
                      <span className="req-dist">3.8 km • ~12 mins</span>
                    </div>
                    <div className="req-route">
                      <div className="req-point"><i className="fa-solid fa-circle-dot green"></i> Pickup: Anna Nagar West Metro Station</div>
                      <div className="req-point"><i className="fa-solid fa-location-dot red"></i> Drop: T. Nagar Ranganathan St</div>
                    </div>
                    <div className="req-actions">
                      <button type="button" className="req-accept-btn" onClick={() => alert(`Ride Accepted! Navigating to customer pickup in ${selectedCity}.`)}>
                        Accept Ride Request
                      </button>
                      <button type="button" className="req-decline-btn" onClick={() => alert('Ride passed.')}>
                        Pass
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'rides' && (
                <div className="captain-history-table">
                  <div className="history-row">
                    <div>
                      <strong>#SRT-9482 • Velachery to Guindy</strong>
                      <span>Today, 02:45 PM • Cash on Delivery</span>
                    </div>
                    <span className="history-amt">+₹120.00</span>
                  </div>
                  <div className="history-row">
                    <div>
                      <strong>#SRT-9471 • Tambaram to Airport</strong>
                      <span>Today, 11:30 AM • SART Wallet</span>
                    </div>
                    <span className="history-amt">+₹280.00</span>
                  </div>
                  <div className="history-row">
                    <div>
                      <strong>#SRT-9460 • Egmore to Central</strong>
                      <span>Yesterday • Online UPI</span>
                    </div>
                    <span className="history-amt">+₹95.00</span>
                  </div>
                </div>
              )}

              {activeTab === 'earnings' && (
                <div className="captain-wallet-view">
                  <div className="wallet-banner">
                    <div>
                      <span className="wallet-title">Net Withdrawable Earnings</span>
                      <h2>₹4,620.00</h2>
                      <p>Linked Account: HDFC Bank •••• 9012 ({fullName || 'Rajesh Kumar'})</p>
                    </div>
                    <button type="button" className="wallet-withdraw-btn" onClick={() => alert('Payout transfer of ₹4,620 initiated to your bank account!')}>
                      Withdraw to Bank Now
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'vehicles' && (
                <div className="captain-kyc-grid">
                  <div className="kyc-badge approved"><i className="fa-solid fa-circle-check"></i> Driving License: {dlNumber || 'Verified'}</div>
                  <div className="kyc-badge approved"><i className="fa-solid fa-circle-check"></i> Vehicle RC Book: {vehicleNumber || 'Verified'}</div>
                  <div className="kyc-badge approved"><i className="fa-solid fa-circle-check"></i> Live Face Bio: Verified</div>
                  <div className="kyc-badge approved"><i className="fa-solid fa-circle-check"></i> {docType.toUpperCase()}: {docNumber || 'Verified'}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
