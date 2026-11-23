'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SubNavbar from '@/components/SubNavbar';
import Footer from '@/components/Footer';
import GoogleMapPickerModal from '@/components/rental/GoogleMapPickerModal';
import { Calendar, Clock, ArrowRight, ArrowLeft, Check, ShieldCheck, FileText, Upload, Building2, User, X } from 'lucide-react';

function CarrierBookingDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  // Mode: e.g. 'Ship', 'Truck', 'Bike', 'Train', 'Flight'
  const routeMode = (typeof params?.mode === 'string' ? params.mode : 'Ship');
  const normalizedMode = routeMode.toUpperCase();

  // Selected vehicle state (either from sessionStorage or searchParams fallback)
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);

  // Load from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('sart_selected_carrier');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSelectedCarrier(parsed);
      }
    } catch (e) {
      console.warn('Failed to parse sart_selected_carrier', e);
    }
  }, []);

  // Vehicle Parameters with clean fallbacks
  const vehicleId = selectedCarrier?.id || searchParams.get('id') || '';
  const paramName = selectedCarrier?.name || searchParams.get('name') || (normalizedMode === 'SHIP' ? 'Shipping Corporation of India Coastal Cargo Feeder' : 'Commercial Cargo Carrier');
  const paramBrand = selectedCarrier?.brand || searchParams.get('brand') || (normalizedMode === 'SHIP' ? 'Shipping Corporation of India' : 'Carrier Logistics');
  const paramReg = selectedCarrier?.regId || searchParams.get('regId') || (normalizedMode === 'SHIP' ? 'IMO 7879' : 'MH 12 MH 6789');
  const paramHub = selectedCarrier?.hub || searchParams.get('hub') || 'Tata Steel Logistics Hub, Chennai, Tamil Nadu - 600081';
  const paramImage = selectedCarrier?.image || searchParams.get('image') || '';

  const baseRateKm = Number(selectedCarrier?.ratePerKm || searchParams.get('ratePerKm') || (normalizedMode === 'SHIP' ? 650 : 48));
  const baseTripFee = Number(selectedCarrier?.baseCharge || searchParams.get('baseCharge') || (normalizedMode === 'SHIP' ? 120000 : 1800));
  const advPct = Number(selectedCarrier?.advancePercent || searchParams.get('advancePercent') || (normalizedMode === 'SHIP' ? 40 : 30));
  const secDeposit = Number(selectedCarrier?.deposit || searchParams.get('deposit') || (normalizedMode === 'SHIP' ? 200000 : 3000));

  // Current Step (1 to 5)
  // Step 1: Route Details
  // Step 2: Sender Details (Business GST or Individual No GST)
  // Step 3: Receiver Details (Business GST or Individual No GST)
  // Step 4: Goods Details
  // Step 5: Vehicle / Carrier Selection
  const [currentStep, setCurrentStep] = useState<number>(1);

  // ---------------- STEP 1: ROUTE DETAILS ----------------
  const [pickupAddress, setPickupAddress] = useState('Cherlapally Industrial Area, Phase 3');
  const [pickupState, setPickupState] = useState('Telangana');
  const [pickupCity, setPickupCity] = useState('Hyderabad');
  const [pickupPincode, setPickupPincode] = useState('500051');

  const [deliveryAddress, setDeliveryAddress] = useState('Peenya Industrial Area, Stage 2');
  const [deliveryState, setDeliveryState] = useState('Karnataka');
  const [deliveryCity, setDeliveryCity] = useState('Bengaluru');
  const [deliveryPincode, setDeliveryPincode] = useState('560058');

  // Update initial pickup/delivery once selectedCarrier loads if present
  useEffect(() => {
    if (selectedCarrier) {
      if (selectedCarrier.pickupAddress) setPickupAddress(selectedCarrier.pickupAddress);
      if (selectedCarrier.pickupPincode) setPickupPincode(selectedCarrier.pickupPincode);
      if (selectedCarrier.deliveryAddress) setDeliveryAddress(selectedCarrier.deliveryAddress);
      if (selectedCarrier.deliveryPincode) setDeliveryPincode(selectedCarrier.deliveryPincode);
      if (selectedCarrier.weight) setTotalCargoWeight(String(selectedCarrier.weight));
      if (selectedCarrier.weightUnit) setWeightUnitVal(selectedCarrier.weightUnit);
      if (selectedCarrier.goodsType) setGoodsDescription(selectedCarrier.goodsType);
    } else {
      const qPickup = searchParams.get('pickupAddress');
      const qPickupPin = searchParams.get('pickupPincode');
      const qDel = searchParams.get('deliveryAddress');
      const qDelPin = searchParams.get('deliveryPincode');
      const qW = searchParams.get('weight');
      const qWU = searchParams.get('weightUnit');
      if (qPickup) setPickupAddress(qPickup);
      if (qPickupPin) setPickupPincode(qPickupPin);
      if (qDel) setDeliveryAddress(qDel);
      if (qDelPin) setDeliveryPincode(qDelPin);
      if (qW) setTotalCargoWeight(qW);
      if (qWU) setWeightUnitVal(qWU);
    }
  }, [selectedCarrier, searchParams]);

  const [pickupDate, setPickupDate] = useState('2026-11-25');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [loadType, setLoadType] = useState('Full Truck Load (FTL) - Dedicated Carrier');
  const [approxDistance, setApproxDistance] = useState(normalizedMode === 'SHIP' ? 'Approx. 850 Nautical Miles' : 'Approx. 570 km');

  // ---------------- STEP 2: SENDER DETAILS ----------------
  const [senderType, setSenderType] = useState<'business' | 'individual'>('business');
  // If Business:
  const [senderGstin, setSenderGstin] = useState('36AAAAA1111A1Z1');
  const [senderCompanyName, setSenderCompanyName] = useState('Tata Steel Logistics & Manufacturing Ltd.');
  // If Individual (No GST):
  const [senderFullName, setSenderFullName] = useState('Rajesh Sharma');
  const [senderPan, setSenderPan] = useState('ABCPS1234D');
  const [senderContactPerson, setSenderContactPerson] = useState('Rajesh Sharma');
  const [senderRelationship, setSenderRelationship] = useState('Self (Owner)');
  const [senderNoGstDeclaration, setSenderNoGstDeclaration] = useState(true);
  // Common Contact:
  const [senderEmail, setSenderEmail] = useState('logistics@tatasteel.com');
  const [senderMobile, setSenderMobile] = useState('9876543210');
  const [senderAddress, setSenderAddress] = useState('Plot No. 42-45, Phase, Phase 3, Cherlapally Industrial Area');

  // ---------------- STEP 3: RECEIVER DETAILS ----------------
  const [receiverType, setReceiverType] = useState<'business' | 'individual'>('business');
  // If Business:
  const [receiverGstin, setReceiverGstin] = useState('29BBBBB2222B1Z2');
  const [receiverCompanyName, setReceiverCompanyName] = useState('Bengaluru Industrial Steel Hub Pvt. Ltd.');
  // If Individual (No GST):
  const [receiverFullName, setReceiverFullName] = useState('Amit Kumar Sharma');
  const [receiverPan, setReceiverPan] = useState('DFGPS6789K');
  const [receiverContactPerson, setReceiverContactPerson] = useState('Amit Kumar Sharma');
  const [receiverRelationship, setReceiverRelationship] = useState('Self (Receiver)');
  const [receiverLandmark, setReceiverLandmark] = useState('Opposite Peenya Police Station');
  const [receiverIdVerificationCheck, setReceiverIdVerificationCheck] = useState(true);
  // Common:
  const [receiverEmail, setReceiverEmail] = useState('deliveries@steelhubblr.com');
  const [receiverMobile, setReceiverMobile] = useState('+91 91234 56789');
  const [receiverContactName, setReceiverContactName] = useState('Anand Hegde');
  const [receiverAddress, setReceiverAddress] = useState('Plot No. 112, Stage 2, Peenya Industrial Area');
  const [unloadingAssistance, setUnloadingAssistance] = useState<'crane' | 'manual'>('crane');
  const [suitableMultiAxle, setSuitableMultiAxle] = useState(true);
  const [unloadingHours, setUnloadingHours] = useState('09:00 AM - 07:00 PM');

  // ---------------- STEP 4: GOODS DETAILS ----------------
  const [goodsCategory, setGoodsCategory] = useState('Industrial Machinery & Equipment');
  const [goodsDescription, setGoodsDescription] = useState('Industrial CNC milling machine and spare tool cabinets');
  const [consignmentValue, setConsignmentValue] = useState('18,50,000');
  const [ewayBillNumber, setEwayBillNumber] = useState('241234567890');
  const [totalCargoWeight, setTotalCargoWeight] = useState(searchParams.get('weight') || (normalizedMode === 'SHIP' ? '52000' : '14'));
  const [weightUnitVal, setWeightUnitVal] = useState(searchParams.get('weightUnit') || (normalizedMode === 'SHIP' ? 'Tonnes' : 'Tons'));
  const [quantityUnits, setQuantityUnits] = useState('1 Unit');
  const [dimensions, setDimensions] = useState({ length: '18 Feet', width: '7.5 Feet', height: '8 Feet' });
  const [packagingType, setPackagingType] = useState('Heavy Wooden Crate / Skidded');
  const [loadingAssistance, setLoadingAssistance] = useState<'required' | 'not_required'>('required');
  const [unloadingRequired, setUnloadingRequired] = useState<'required' | 'not_required'>('required');

  // Special Attributes Checkboxes
  const [attrOverweight, setAttrOverweight] = useState(true);
  const [attrHazmat, setAttrHazmat] = useState(false);
  const [attrTempSensitive, setAttrTempSensitive] = useState(false);
  const [attrFragile, setAttrFragile] = useState(true);
  const [attrTarp, setAttrTarp] = useState(true);

  // ---------------- STEP 5: VEHICLE SELECTION ----------------
  const [selectedVehicleType, setSelectedVehicleType] = useState('heavy');
  const [bodyTypePreference, setBodyTypePreference] = useState('open');
  const [gpsTrackingRequired, setGpsTrackingRequired] = useState(true);
  const [nationalPermit, setNationalPermit] = useState(true);
  const [roadsideAssistance, setRoadsideAssistance] = useState(true);

  // ---------------- STEP 2 & 4: DOCUMENT UPLOADS ----------------
  // GST Invoice / E-Way Bill (Step 2 Business)
  const [gstInvoiceFile, setGstInvoiceFile] = useState<{ name: string; size: string } | null>({
    name: 'invoice_67201.pdf',
    size: '320 KB'
  });
  // Personal Goods Declaration (Step 2 Individual)
  const [personalGoodsFile, setPersonalGoodsFile] = useState<{ name: string; size: string } | null>({
    name: 'personal_goods_declaration.pdf',
    size: '180 KB'
  });
  // ID Proof / PAN (Step 2 Individual)
  const [idProofFile, setIdProofFile] = useState<{ name: string; size: string } | null>({
    name: 'pan_card_rajesh.pdf',
    size: '250 KB'
  });
  // Cargo Commercial Invoice (Step 4 Goods)
  const [commercialInvoiceFile, setCommercialInvoiceFile] = useState<{ name: string; size: string } | null>({
    name: 'commercial_invoice_machinery.pdf',
    size: '480 KB'
  });
  // E-Way Bill / Delivery Challan (Step 4 Goods)
  const [cargoEwayFile, setCargoEwayFile] = useState<{ name: string; size: string } | null>({
    name: 'eway_bill_123456.pdf',
    size: '310 KB'
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<{ name: string; size: string } | null>>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setter({
        name: file.name,
        size: formatFileSize(file.size)
      });
    }
  };

  // Map Picker Modal State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapTarget, setMapTarget] = useState<'pickup' | 'delivery'>('pickup');

  // Fare Calculation
  const estDistanceKm = normalizedMode === 'SHIP' ? 850 : 570;
  const transitFare = estDistanceKm * baseRateKm;
  const subtotal = baseTripFee + transitFare;
  const gstAmount = Number((subtotal * (senderType === 'business' ? 0.18 : 0.05)).toFixed(2));
  const totalFreight = subtotal + gstAmount + secDeposit;
  const advancePayable = Math.round((totalFreight * advPct) / 100);
  const balanceOnDelivery = Math.round(totalFreight - advancePayable);

  // Steps definition for top stepper header
  const stepTitles = [
    { num: 1, label: 'Route Details' },
    { num: 2, label: 'Sender Details' },
    { num: 3, label: 'Receiver Details' },
    { num: 4, label: 'Goods Details' },
    { num: 5, label: `${routeMode} Selection` },

  ];

  // Navigation handlers
  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Step 5 completed -> proceed to Payment page
      handleProceedToPayment();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.back();
    }
  };

  const handleProceedToPayment = () => {
    // Save state to sessionStorage for clean URL and no header overflow
    const bookingSummary = {
      bookingId: `CRG-BK-${Date.now().toString().slice(-6)}`,
      mode: routeMode,
      vehicleId,
      vehicleName: paramName,
      vehicleBrand: paramBrand,
      vehicleReg: paramReg,
      vehicleImage: paramImage,
      pickup: `${pickupCity}, ${pickupState} (${pickupPincode})`,
      pickupAddress,
      delivery: `${deliveryCity}, ${deliveryState} (${deliveryPincode})`,
      deliveryAddress,
      pickupDate,
      pickupTime,
      loadType,
      senderType,
      senderGstin: senderType === 'business' ? senderGstin : 'Unregistered (No GST)',
      senderName: senderType === 'business' ? senderCompanyName : senderFullName,
      senderMobile,
      senderEmail,
      receiverType,
      receiverGstin: receiverType === 'business' ? receiverGstin : 'Unregistered (No GST)',
      receiverName: receiverType === 'business' ? receiverCompanyName : receiverFullName,
      receiverMobile,
      goodsCategory,
      goodsDescription,
      cargoWeight: `${totalCargoWeight} ${weightUnitVal}`,
      consignmentValue,
      ewayBillNumber,
      baseTripFee,
      transitFare,
      secDeposit,
      gstAmount,
      totalFreight,
      advancePayable,
      balanceOnDelivery,
      advPct
    };

    try {
      sessionStorage.setItem('sart_carrier_booking_summary', JSON.stringify(bookingSummary));
    } catch (e) { }

    const q = new URLSearchParams({
      bookingId: bookingSummary.bookingId,
      mode: routeMode,
      name: paramName,
      total: String(totalFreight),
      advance: String(advancePayable)
    });

    router.push(`/home/carrier/${routeMode}/BookingDetails/Payment?${q.toString()}`);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <SubNavbar />

      <main style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '28px 20px', flex: 1 }}>

        {/* ================= TOP STEPPER HEADER (7 Steps matching Screenshot) ================= */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px 20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          marginBottom: '24px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {stepTitles.map((step, idx) => {
              const isPassed = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <React.Fragment key={step.num}>
                  <div
                    onClick={() => {
                      if (step.num <= 5) setCurrentStep(step.num);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: step.num <= 5 ? 'pointer' : 'default',
                      zIndex: 2,
                      minWidth: '85px'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isPassed ? '#1e3a8a' : isCurrent ? '#1e3a8a' : '#ffffff',
                      color: isPassed || isCurrent ? '#ffffff' : '#94a3b8',
                      border: isPassed || isCurrent ? '2px solid #1e3a8a' : '2px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(30, 58, 138, 0.15)' : 'none'
                    }}>
                      {isPassed ? <Check size={16} strokeWidth={3} /> : step.num}
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: isCurrent ? 800 : 600,
                      color: isCurrent ? '#0f172a' : isPassed ? '#1e3a8a' : '#64748b',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}>
                      {step.label}
                    </span>
                  </div>
                  {idx < stepTitles.length - 1 && (
                    <div style={{
                      flex: 1,
                      height: '2px',
                      background: currentStep > idx + 1 ? '#1e3a8a' : '#e2e8f0',
                      marginTop: '-22px',
                      transition: 'background 0.3s'
                    }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ================= STEP CONTENT CONTAINER ================= */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
          padding: '32px'
        }}>

          {/* ================= STEP 1: ROUTE DETAILS ================= */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Route Details
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Specify origin, destination and scheduled dispatch window for dedicated carrier transit.
                </p>
              </div>

              {/* Two Column Grid: Pickup & Delivery Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Pickup Card */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', fontWeight: 800, fontSize: '13.5px' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#2563eb' }}></i>
                    <span>PICKUP LOCATION</span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Pickup Address (Door No, Street, Area / Industrial Estate)</label>
                      <button
                        type="button"
                        onClick={() => { setMapTarget('pickup'); setIsMapModalOpen(true); }}
                        style={{ border: '1px solid #cbd5e1', background: '#ffffff', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 700, color: '#1e3a8a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        🗺️ Select on Map
                      </button>
                    </div>
                    <input
                      type="text"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Cherlapally Industrial Area, Phase 3"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Pickup State</label>
                      <input
                        type="text"
                        value={pickupState}
                        onChange={(e) => setPickupState(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Pickup City</label>
                      <input
                        type="text"
                        value={pickupCity}
                        onChange={(e) => setPickupCity(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>PIN Code</label>
                      <input
                        type="text"
                        value={pickupPincode}
                        onChange={(e) => setPickupPincode(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Card */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 800, fontSize: '13.5px' }}>
                    <i className="fa-solid fa-location-crosshairs" style={{ color: '#dc2626' }}></i>
                    <span>DELIVERY LOCATION</span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Delivery Address (Door No, Street, Area / Warehouse)</label>
                      <button
                        type="button"
                        onClick={() => { setMapTarget('delivery'); setIsMapModalOpen(true); }}
                        style={{ border: '1px solid #cbd5e1', background: '#ffffff', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 700, color: '#b91c1c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        🗺️ Select on Map
                      </button>
                    </div>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Peenya Industrial Area, Stage 2"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Delivery State</label>
                      <input
                        type="text"
                        value={deliveryState}
                        onChange={(e) => setDeliveryState(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Delivery City</label>
                      <input
                        type="text"
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>PIN Code</label>
                      <input
                        type="text"
                        value={deliveryPincode}
                        onChange={(e) => setDeliveryPincode(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Distance Banner */}
              <div style={{
                background: '#eff6ff',
                border: '1.5px dashed #93c5fd',
                borderRadius: '12px',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                color: '#1e3a8a',
                fontSize: '14px',
                fontWeight: 700
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }}></span>
                <span>{pickupCity}, {pickupState}</span>
                <i className="fa-solid fa-arrow-right-long" style={{ color: '#3b82f6' }}></i>
                <span>{deliveryCity}, {deliveryState}</span>
                <span style={{ color: '#64748b', fontWeight: 600 }}>({approxDistance})</span>
              </div>

              {/* Bottom Row: Pickup Date, Preferred Pickup Time, Load Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Pickup Date</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px', background: '#ffffff' }}>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Preferred Pickup Time</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '9px 12px', background: '#ffffff' }}>
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Load Type</label>
                  <select
                    value={loadType}
                    onChange={(e) => setLoadType(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 600, color: '#0f172a', background: '#ffffff' }}
                  >
                    <option value="Full Truck Load (FTL) - Dedicated Carrier">Full Truck Load (FTL) - Dedicated Carrier</option>
                    <option value="Part Truck Load (PTL) - Shared Express">Part Truck Load (PTL) - Shared Express</option>
                    <option value="Heavy Machinery Over-Dimensional (ODC)">Heavy Machinery Over-Dimensional (ODC)</option>
                    <option value="Marine ISO Container Charter">Marine ISO Container Charter</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: SENDER DETAILS (GST vs NO GST / INDIVIDUAL) ================= */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Sender Details
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Enter sender / consignor information for interstate GST compliance or individual non-commercial transport.
                </p>
              </div>

              {/* Radio Switch: Business / Company vs Individual / Unregistered Sender (NO GST) */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '12px 18px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Sender Identity:</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 800, color: senderType === 'business' ? '#1e3a8a' : '#475569', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="senderType"
                    checked={senderType === 'business'}
                    onChange={() => setSenderType('business')}
                  />
                  <span>🏢 Business / Company (GST Registered)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 800, color: senderType === 'individual' ? '#1e3a8a' : '#475569', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="senderType"
                    checked={senderType === 'individual'}
                    onChange={() => setSenderType('individual')}
                  />
                  <span>👤 Individual / Unregistered Sender (No GST)</span>
                </label>
              </div>

              {/* Form Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>

                {/* Left Card: Business Info OR Individual Info */}
                {senderType === 'business' ? (
                  /* Business GST Form */
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      A. Business & GST Information
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>GSTIN</label>
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>✓ GST Verified</span>
                      </div>
                      <input
                        type="text"
                        value={senderGstin}
                        onChange={(e) => setSenderGstin(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}
                      />
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>Legal company name: {senderCompanyName}</span>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Company / Sender Name</label>
                      <input
                        type="text"
                        value={senderCompanyName}
                        onChange={(e) => setSenderCompanyName(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Email Address</label>
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>✓ OTP Verified</span>
                      </div>
                      <input
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Mobile Number</label>
                      <input
                        type="text"
                        value={senderMobile}
                        onChange={(e) => setSenderMobile(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}
                      />
                    </div>
                  </div>
                ) : (
                  /* Individual No GST Form */
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      A. Sender Type & Identity (No GST / Unregistered)
                    </div>
                    <div style={{ background: '#f1f5f9', borderRadius: '6px', padding: '8px 12px', fontSize: '11.5px', color: '#475569' }}>
                      ⓘ Unregistered (GST not required for individual transport)
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Sender / Full Name</label>
                      <input
                        type="text"
                        value={senderFullName}
                        onChange={(e) => setSenderFullName(e.target.value)}
                        placeholder="Rajesh Sharma"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Government ID / PAN (Required for transport without GST)</label>
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>✓ Verified</span>
                      </div>
                      <input
                        type="text"
                        value={senderPan}
                        onChange={(e) => setSenderPan(e.target.value)}
                        placeholder="ABCPS1234D"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Email Address</label>
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>✓ OTP Verified</span>
                      </div>
                      <input
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="rajesh.sharma@email.com"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Mobile Number</label>
                      <input
                        type="text"
                        value={senderMobile}
                        onChange={(e) => setSenderMobile(e.target.value)}
                        placeholder="+91 98765 43210"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}
                      />
                    </div>
                  </div>
                )}

                {/* Right Column: Verified Pickup Address & Documentation Upload */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Verified Pickup Address */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      {senderType === 'business' ? 'C. Verified Pickup Address (Auto-filled from GST )' : 'B. Pickup Contact Person (Self / Representative)'}
                    </div>

                    {senderType === 'individual' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Contact Person Name</label>
                          <input
                            type="text"
                            value={senderContactPerson}
                            onChange={(e) => setSenderContactPerson(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Relationship/Role</label>
                          <input
                            type="text"
                            value={senderRelationship}
                            onChange={(e) => setSenderRelationship(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Pickup Address</label>
                      <input
                        type="text"
                        value={senderAddress}
                        onChange={(e) => setSenderAddress(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>State</label>
                        <input type="text" value={pickupState} readOnly style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', background: '#f8fafc' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>City</label>
                        <input type="text" value={pickupCity} readOnly style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', background: '#f8fafc' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>PIN Code</label>
                        <input type="text" value={pickupPincode} readOnly style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', background: '#f8fafc' }} />
                      </div>
                    </div>
                  </div>

                  {/* Documentation Upload */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      D. Documentation {senderType === 'individual' ? 'for Unregistered Transport' : 'Upload'}
                    </div>

                    {senderType === 'individual' ? (
                      <>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#0f172a', fontWeight: 700, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={senderNoGstDeclaration}
                            onChange={(e) => setSenderNoGstDeclaration(e.target.checked)}
                            style={{ marginTop: '2px' }}
                          />
                          <span>I declare these are personal / non-commercial household or agricultural goods.</span>
                        </label>

                        {/* Personal Goods Declaration */}
                        <div>
                          <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>
                            Personal Goods Declaration Document
                          </label>
                          {personalGoodsFile ? (
                            <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#0f172a', fontWeight: 600 }}>
                                <FileText size={16} color="#64748b" />
                                <span>{personalGoodsFile.name} ({personalGoodsFile.size})</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>✓ Generated & Signed</span>
                                <label style={{ cursor: 'pointer', color: '#2563eb', fontSize: '11px', fontWeight: 700, textDecoration: 'underline' }}>
                                  Change
                                  <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileUpload(e, setPersonalGoodsFile)}
                                  />
                                </label>
                              </div>
                            </div>
                          ) : (
                            <label style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                              <Upload size={16} color="#2563eb" />
                              <span style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: 700 }}>Upload Declaration Document</span>
                              <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, setPersonalGoodsFile)}
                              />
                            </label>
                          )}
                        </div>

                        {/* ID Proof / PAN */}
                        <div>
                          <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>
                            Upload ID Proof (PAN / Aadhaar)
                          </label>
                          {idProofFile ? (
                            <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#0f172a', fontWeight: 600 }}>
                                <Upload size={16} color="#64748b" />
                                <span>{idProofFile.name} ({idProofFile.size})</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>✓ Attached</span>
                                <label style={{ cursor: 'pointer', color: '#2563eb', fontSize: '11px', fontWeight: 700, textDecoration: 'underline' }}>
                                  Change
                                  <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileUpload(e, setIdProofFile)}
                                  />
                                </label>
                              </div>
                            </div>
                          ) : (
                            <label style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                              <Upload size={16} color="#2563eb" />
                              <span style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: 700 }}>Upload ID Proof (PDF / Images)</span>
                              <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, setIdProofFile)}
                              />
                            </label>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          GST Invoice / E-Way Bill (Optional at this stage)
                        </div>
                        {gstInvoiceFile ? (
                          <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                              <FileText size={18} color="#2563eb" />
                              <span>{gstInvoiceFile.name} ({gstInvoiceFile.size})</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 800 }}>✓ Attached</span>
                              <label style={{ cursor: 'pointer', color: '#2563eb', fontSize: '12px', fontWeight: 700, textDecoration: 'underline' }}>
                                Change
                                <input
                                  type="file"
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleFileUpload(e, setGstInvoiceFile)}
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                            <Upload size={18} color="#2563eb" />
                            <span style={{ fontSize: '13px', color: '#2563eb', fontWeight: 700 }}>Upload Invoice / E-Way Bill Document</span>
                            <input
                              type="file"
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileUpload(e, setGstInvoiceFile)}
                            />
                          </label>
                        )}
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= STEP 3: RECEIVER DETAILS (GST vs NO GST / INDIVIDUAL) ================= */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Receiver Details
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Enter receiver / consignee information for destination delivery and unloading assistance.
                </p>
              </div>

              {/* Radio Switch: Business vs Individual / Unregistered Receiver */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '12px 18px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Receiver Identity:</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 800, color: receiverType === 'business' ? '#1e3a8a' : '#475569', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="receiverType"
                    checked={receiverType === 'business'}
                    onChange={() => setReceiverType('business')}
                  />
                  <span>🏢 Business / Company</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 800, color: receiverType === 'individual' ? '#1e3a8a' : '#475569', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="receiverType"
                    checked={receiverType === 'individual'}
                    onChange={() => setReceiverType('individual')}
                  />
                  <span>👤 Individual / Unregistered Receiver (No GST)</span>
                </label>
              </div>

              {/* Form Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>

                {/* Left Card: Business vs Individual Receiver Form */}
                {receiverType === 'business' ? (
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      A. Receiver & Business Details
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>GSTIN (Optional / Business)</label>
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>✓ GST Verified</span>
                      </div>
                      <input
                        type="text"
                        value={receiverGstin}
                        onChange={(e) => setReceiverGstin(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}
                      />
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>Legal company name: {receiverCompanyName}</span>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Company / Receiver Name</label>
                      <input
                        type="text"
                        value={receiverCompanyName}
                        onChange={(e) => setReceiverCompanyName(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Email Address</label>
                        <input
                          type="email"
                          value={receiverEmail}
                          onChange={(e) => setReceiverEmail(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Receiver Mobile</label>
                          <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>✓ Verified</span>
                        </div>
                        <input
                          type="text"
                          value={receiverMobile}
                          onChange={(e) => setReceiverMobile(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Contact Person Name</label>
                      <input
                        type="text"
                        value={receiverContactName}
                        onChange={(e) => setReceiverContactName(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      A. Receiver Type & Identity (No GST / Unregistered)
                    </div>
                    <div style={{ background: '#f1f5f9', borderRadius: '6px', padding: '8px 12px', fontSize: '11.5px', color: '#475569' }}>
                      ⓘ Unregistered (GST not required for individual receiver)
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Receiver / Full Name</label>
                      <input
                        type="text"
                        value={receiverFullName}
                        onChange={(e) => setReceiverFullName(e.target.value)}
                        placeholder="Amit Kumar Sharma"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Government ID / PAN (Optional)</label>
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>✓ Verified</span>
                      </div>
                      <input
                        type="text"
                        value={receiverPan}
                        onChange={(e) => setReceiverPan(e.target.value)}
                        placeholder="DFGPS6789K"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Contact Person Name</label>
                        <input
                          type="text"
                          value={receiverContactPerson}
                          onChange={(e) => setReceiverContactPerson(e.target.value)}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Contact Phone</label>
                        <input
                          type="text"
                          value={receiverMobile}
                          onChange={(e) => setReceiverMobile(e.target.value)}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Delivery Landmark</label>
                      <input
                        type="text"
                        value={receiverLandmark}
                        onChange={(e) => setReceiverLandmark(e.target.value)}
                        placeholder="Opposite Peenya Police Station"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                      />
                    </div>
                  </div>
                )}

                {/* Right Column: Delivery Address & Unloading Requirements */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Delivery Address Card */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      C. Delivery Address (Auto-filled / confirmed)
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Delivery Address</label>
                      <input
                        type="text"
                        value={receiverAddress}
                        onChange={(e) => setReceiverAddress(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>State</label>
                        <input type="text" value={deliveryState} readOnly style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', background: '#f8fafc' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>City</label>
                        <input type="text" value={deliveryCity} readOnly style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', background: '#f8fafc' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>PIN Code</label>
                        <input type="text" value={deliveryPincode} readOnly style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', background: '#f8fafc' }} />
                      </div>
                    </div>
                  </div>

                  {/* Unloading Requirements */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      D. Unloading Requirements
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Unloading Assistance Required?</label>
                      <div style={{ display: 'flex', gap: '18px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
                          <input type="radio" name="unloadingAssistance" checked={unloadingAssistance === 'crane'} onChange={() => setUnloadingAssistance('crane')} />
                          <span>Yes, Crane/Forklift needed</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                          <input type="radio" name="unloadingAssistance" checked={unloadingAssistance === 'manual'} onChange={() => setUnloadingAssistance('manual')} />
                          <span>No, Manual / Handled by receiver</span>
                        </label>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
                        <input type="checkbox" checked={suitableMultiAxle} onChange={(e) => setSuitableMultiAxle(e.target.checked)} />
                        <span>Suitable for Multi-Axle Heavy Commercial Vehicles (32ft/40ft)</span>
                      </label>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Unloading Hours</label>
                        <input
                          type="text"
                          value={unloadingHours}
                          onChange={(e) => setUnloadingHours(e.target.value)}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                        />
                      </div>
                    </div>

                    {receiverType === 'individual' && (
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#0f172a', cursor: 'pointer', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                        <input type="checkbox" checked={receiverIdVerificationCheck} onChange={(e) => setReceiverIdVerificationCheck(e.target.checked)} style={{ marginTop: '2px' }} />
                        <span>Receiver will present ID (PAN / Aadhaar) and Delivery OTP upon carrier arrival.</span>
                      </label>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= STEP 4: GOODS DETAILS ================= */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Goods & Cargo Details
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Specify dimensions, weight, packaging, and handling requirements for vehicle allocation.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

                {/* Left Column: Classification, Value & Weight/Dimensions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* A. Goods Classification & Value */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      A. Goods Classification & Value
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Goods Category</label>
                      <select
                        value={goodsCategory}
                        onChange={(e) => setGoodsCategory(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600, color: '#0f172a', background: '#ffffff' }}
                      >
                        <option value="Industrial Machinery & Equipment">Industrial Machinery & Equipment</option>
                        <option value="Steel Coils, Billets & Heavy Metal">Steel Coils, Billets & Heavy Metal</option>
                        <option value="Automotive Parts & Components">Automotive Parts & Components</option>
                        <option value="Chemicals & Raw Materials">Chemicals & Raw Materials</option>
                        <option value="FMCG & Packaged Dry Cargo">FMCG & Packaged Dry Cargo</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Goods Description</label>
                      <input
                        type="text"
                        value={goodsDescription}
                        onChange={(e) => setGoodsDescription(e.target.value)}
                        placeholder="Industrial CNC milling machine and spare tool cabinets"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Total Consignment Value (₹)</label>
                        <input
                          type="text"
                          value={consignmentValue}
                          onChange={(e) => setConsignmentValue(e.target.value)}
                          placeholder="₹18,50,000"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>E-Way Bill Number (optional)</label>
                        <input
                          type="text"
                          value={ewayBillNumber}
                          onChange={(e) => setEwayBillNumber(e.target.value)}
                          placeholder="241234567890"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* B. Weight & Dimensions */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      B. Weight & Dimensions
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Total Cargo Weight ({weightUnitVal})</label>
                        <input
                          type="text"
                          value={totalCargoWeight}
                          onChange={(e) => setTotalCargoWeight(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Quantity / Units</label>
                        <input
                          type="text"
                          value={quantityUnits}
                          onChange={(e) => setQuantityUnits(e.target.value)}
                          placeholder="1 Unit"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Dimensions (L × W × H)</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        <input type="text" value={dimensions.length} onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 600 }} />
                        <input type="text" value={dimensions.width} onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 600 }} />
                        <input type="text" value={dimensions.height} onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 600 }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Packaging Type</label>
                      <input
                        type="text"
                        value={packagingType}
                        onChange={(e) => setPackagingType(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Loading Requirements & Document Uploads */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* C. Loading & Handling Requirements */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      C. Loading & Handling Requirements
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Loading Assistance</label>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
                          <input type="radio" name="loadingAssistance" checked={loadingAssistance === 'required'} onChange={() => setLoadingAssistance('required')} />
                          <span>Required (Crane / Forklift needed)</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                          <input type="radio" name="loadingAssistance" checked={loadingAssistance === 'not_required'} onChange={() => setLoadingAssistance('not_required')} />
                          <span>Not Required</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Unloading Assistance</label>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
                          <input type="radio" name="unloadingRequired" checked={unloadingRequired === 'required'} onChange={() => setUnloadingRequired('required')} />
                          <span>Required (Crane needed at site)</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                          <input type="radio" name="unloadingRequired" checked={unloadingRequired === 'not_required'} onChange={() => setUnloadingRequired('not_required')} />
                          <span>Not Required</span>
                        </label>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '8px' }}>Special Cargo Attributes</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                          <input type="checkbox" checked={attrOverweight} onChange={(e) => setAttrOverweight(e.target.checked)} />
                          <span>Overweight / Heavy Load</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                          <input type="checkbox" checked={attrHazmat} onChange={(e) => setAttrHazmat(e.target.checked)} />
                          <span>Hazardous (HAZMAT)</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                          <input type="checkbox" checked={attrTempSensitive} onChange={(e) => setAttrTempSensitive(e.target.checked)} />
                          <span>Temperature Sensitive</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                          <input type="checkbox" checked={attrFragile} onChange={(e) => setAttrFragile(e.target.checked)} />
                          <span>Fragile / High-Value</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}>
                          <input type="checkbox" checked={attrTarp} onChange={(e) => setAttrTarp(e.target.checked)} />
                          <span>Weatherproof Tarp Required</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* D. Document Uploads */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      D. Document Uploads
                    </div>

                    {/* Cargo Packing List / Commercial Invoice */}
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>
                        Cargo Packing List / Commercial Invoice
                      </label>
                      {commercialInvoiceFile ? (
                        <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                            <FileText size={18} color="#2563eb" />
                            <span>{commercialInvoiceFile.name} ({commercialInvoiceFile.size})</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 800 }}>✓ Uploaded</span>
                            <label style={{ cursor: 'pointer', color: '#2563eb', fontSize: '12px', fontWeight: 700, textDecoration: 'underline' }}>
                              Change
                              <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, setCommercialInvoiceFile)}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                          <Upload size={16} color="#2563eb" />
                          <span style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: 700 }}>Upload Commercial Invoice / Packing List</span>
                          <input
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileUpload(e, setCommercialInvoiceFile)}
                          />
                        </label>
                      )}
                    </div>

                    {/* E-Way Bill / Delivery Challan */}
                    <div>
                      <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '4px', display: 'block' }}>
                        E-Way Bill / Delivery Challan
                      </label>
                      {cargoEwayFile ? (
                        <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                            <FileText size={18} color="#2563eb" />
                            <span>{cargoEwayFile.name} ({cargoEwayFile.size})</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 800 }}>✓ Uploaded</span>
                            <label style={{ cursor: 'pointer', color: '#2563eb', fontSize: '12px', fontWeight: 700, textDecoration: 'underline' }}>
                              Change
                              <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileUpload(e, setCargoEwayFile)}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                          <Upload size={16} color="#2563eb" />
                          <span style={{ fontSize: '12.5px', color: '#2563eb', fontWeight: 700 }}>Upload E-Way Bill / Challan Document</span>
                          <input
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileUpload(e, setCargoEwayFile)}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= STEP 5: VEHICLE SELECTION ================= */}
          {currentStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  {routeMode} Selection
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Based on your {totalCargoWeight} {weightUnitVal}, {dimensions.length} × {dimensions.width} × {dimensions.height} cargo, we recommend these vehicles:
                </p>
              </div>

              {/* Recommended banner */}
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '12px 16px', color: '#0369a1', fontSize: '13.5px', fontWeight: 700 }}>
                Confirmed Allocated Carrier: {paramName} ({totalCargoWeight} {weightUnitVal} capacity)
              </div>

              {/* ONLY the Chosen Vehicle is displayed! */}
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '2.5px solid #16a34a',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    position: 'relative',
                    maxWidth: '460px',
                    width: '100%',
                    boxShadow: '0 4px 16px rgba(22, 163, 74, 0.08)'
                  }}
                >
                  <span style={{ position: 'absolute', top: '-12px', left: '16px', background: '#16a34a', color: '#ffffff', fontSize: '10.5px', fontWeight: 800, padding: '3px 12px', borderRadius: '12px' }}>
                    ✓ SELECTED CARRIER FOR YOUR SHIPMENT
                  </span>
                  <div style={{ height: '180px', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc' }}>
                    <img
                      src={paramImage}
                      alt={paramName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e: any) => { e.target.src = '/images/tata_ace_fleet.jpg'; }}
                    />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 900, color: '#0f172a', fontFamily: 'serif, Georgia' }}>
                      {paramName}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
                      {paramBrand || 'Verified Carrier Partner'} • Reg: {paramReg}
                    </p>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div><strong>Max Payload:</strong> {totalCargoWeight} {weightUnitVal}</div>
                    <div><strong>Dimensions:</strong> {dimensions.length} × {dimensions.width} × {dimensions.height}</div>
                    <div><strong>Hub Location:</strong> {paramHub}</div>
                  </div>

                  <div style={{
                    background: '#ffffff',
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}>
                    Rate Card: ₹{baseTripFee.toLocaleString('en-IN')}/trip | ₹{baseRateKm}/km | Adv: {advPct}%
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>Total: ₹{totalFreight.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={16} strokeWidth={3} /> Selected
                    </span>
                  </div>
                </div>
              </div>







              {/* Body Type & Driver Requirements checkboxes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '8px' }}>Body Type</label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>
                      <input type="radio" name="bodyType" checked={bodyTypePreference === 'open'} onChange={() => setBodyTypePreference('open')} />
                      <span>Open / Flatbed (Tarp covered)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>
                      <input type="radio" name="bodyType" checked={bodyTypePreference === 'closed'} onChange={() => setBodyTypePreference('closed')} />
                      <span>Container / Closed Body</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: '8px' }}>Carrier Requirements</label>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                      <input type="checkbox" checked={gpsTrackingRequired} onChange={(e) => setGpsTrackingRequired(e.target.checked)} />
                      <span>GPS Live Tracking enabled</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                      <input type="checkbox" checked={nationalPermit} onChange={(e) => setNationalPermit(e.target.checked)} />
                      <span>National Permit (Interstate)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                      <input type="checkbox" checked={roadsideAssistance} onChange={(e) => setRoadsideAssistance(e.target.checked)} />
                      <span>24/7 Roadside Assistance included</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP NAVIGATION BUTTONS (BACK & CONTINUE) ================= */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              type="button"
              onClick={handlePrevStep}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              <span>{currentStep === 1 ? 'Back to Vehicles' : 'Back'}</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 32px',
                borderRadius: '10px',
                border: 'none',
                background: '#ea580c',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)'
              }}
            >
              <span>{currentStep === 5 ? 'Continue to Payment →' : 'Continue →'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </main>

      {/* Map Picker Modal */}
      <GoogleMapPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onConfirm={(addr) => {
          if (mapTarget === 'pickup') {
            setPickupAddress(addr);
          } else {
            setDeliveryAddress(addr);
          }
          setIsMapModalOpen(false);
        }}
        initialAddress={mapTarget === 'pickup' ? pickupAddress : deliveryAddress}
      />

      <Footer />
    </div>
  );
}

export default function CarrierBookingDetailsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', fontWeight: 800 }}>Loading Carrier Booking...</div>}>
      <CarrierBookingDetailsContent />
    </Suspense>
  );
}
